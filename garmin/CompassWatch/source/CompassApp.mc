// Compass Focus 0.4.1 — fēnix 7S (240 x 240)
// Built from D4: one InputDelegate, String.equals() comparisons.
// Preview build: compile and test with Garmin Connect IQ SDK 9.2.0.
using Toybox.Application;
using Toybox.Application.Storage;
using Toybox.Attention;
using Toybox.Communications;
using Toybox.Cryptography;
using Toybox.Graphics;
using Toybox.Lang;
using Toybox.PersistedContent;
using Toybox.Sensor;
using Toybox.SensorHistory;
using Toybox.System;
using Toybox.Time;
using Toybox.Time.Gregorian;
using Toybox.Timer;
using Toybox.WatchUi;

class CompassApp extends Application.AppBase {
    var model;
    function initialize() {
        AppBase.initialize();
        model = new CompassModel();
    }
    function getInitialView() { return [new CompassView(model), new CompassInput(model)]; }
    function onStop(state) { model.onExit(); }
}

class CompassModel {
    const API = "https://compass-api.theophil-tiger.workers.dev";
    // Stable category IDs are sent to the Worker; German names are display-only.
    // Keep canonical IDs across versions; Counseling is a watch-only display name.
    const IDS = ["Forschung", "Lehre", "Pruefungen", "Verwaltung", "Meeting", "Weiterbildung", "Familie", "Beziehungsdynamiken"];
    const LABELS = ["Forschung", "Lehre", "Prüfungen", "Verwaltung", "Meetings", "Weiterbildung", "Familie", "Counseling"];
    // Deliberately separated colors for the fēnix 7S low-color display.
    // Meetings are muted blue; administration, family and continuing education differ.
    const COLORS = [0x65BEC7, 0xE5B34D, 0xE98E4F, 0x4F9CCB, 0x749BA9, 0xA28BDE, 0x65B988, 0xCC7168];
    // Time-limited deep-work sessions vs elapsed-time tracking by category.
    const DEFAULT_POMODORO = [true, true, true, false, false, true, false, false];

    var mode = "select"; // select / hub / today / forecast / detail / running / session-menu / pairing / syncing
    var hubIndex = 0;
    // Garmin agenda screens remain empty until Compass has actual dated tasks.
    // Never invent/transform undated inbox captures into scheduled tasks.
    var index = 0;
    var pomodoro = true;
    var running = false;
    var paused = false;
    var menuPriorPaused = false;
    var menuIndex = 0;
    var startEpoch = 0;
    var lastEpoch = 0;
    var focusSec = 0;
    var breakSec = 0;
    var totalSec = 0;
    var pomodoros = 0;
    var dailyPomodoros = 0;
    var dailyDate = "";
    var phase = "focus"; // focus / focus-due / break / break-due
    var phaseSec = 0;
    var hrPoints = [];
    var bbPoints = [];
    var hrLast = null;
    var bbStart = null;
    var bbEnd = null;
    var token = null;
    var queue = [];
    var timer = null;
    var waiting = false;
    var lastMessage = "";
    var code = "00000000";
    var digit = 0;
    // A network callback is never allowed to trap the UI on SYNC.
    var requestStartedAt = 0;
    var planningCache = null;
    var agendaIndex = 0;
    var detailOrigin = "forecast";
    var detailOffset = 0;
    var lastPlanningAttemptEpoch = 0;
    var lastPlanningFetchEpoch = 0;


    function initialize() {
        token = Storage.getValue("watchToken");
        planningCache = Storage.getValue("watchPlanning");
        var cacheEpoch = Storage.getValue("planningFetchedEpoch");
        lastPlanningFetchEpoch = cacheEpoch == null ? 0 : cacheEpoch;
        var saved = Storage.getValue("sessions");
        queue = saved == null ? [] : saved;
        var d = Storage.getValue("pomodoroDay");
        var n = Storage.getValue("pomodoroCount");
        dailyDate = d == null ? "" : d;
        dailyPomodoros = n == null ? 0 : n;
        refreshDay();
        timer = new Timer.Timer();
        timer.start(method(:tick), 1000, true);
    }
    function redraw() { WatchUi.requestUpdate(); }
    function now() { return Time.now().value(); }
    function dateKey() {
        var d = Gregorian.info(Time.now(), Time.FORMAT_SHORT);
        return d.year.toString() + "-" + d.month.toString() + "-" + d.day.toString();
    }
    function refreshDay() {
        var key = dateKey();
        if (!dailyDate.equals(key)) {
            dailyDate = key;
            dailyPomodoros = 0;
            Storage.setValue("pomodoroDay", key);
            Storage.setValue("pomodoroCount", 0);
        }
    }
    function showHub() { mode = "hub"; hubIndex = 0; redraw(); }
    function openHubItem() {
        if (hubIndex == 0) { mode = "select"; }
        else if (hubIndex == 1) { mode = "today"; agendaIndex=0; refreshAgendaIfStale(); }
        else if (hubIndex == 2) { mode = "forecast"; agendaIndex=0; refreshAgendaIfStale(); }
        else if (hubIndex == 3) { mode = "select"; sync(); return; }
        redraw();
    }
    // A stale snapshot updates quietly; never hold the agenda UI hostage.
    function refreshAgendaIfStale() {
        if (token != null && !waiting && now()-lastPlanningAttemptEpoch > 300 &&
            (lastPlanningFetchEpoch == 0 || now()-lastPlanningFetchEpoch > 900)) {
            fetchPlanning();
        }
    }
    function chooseCategory(dir) {
        index = (index + dir + LABELS.size()) % LABELS.size();
        pomodoro = DEFAULT_POMODORO[index];
        lastMessage = "";
        redraw();
    }
    // Every fourth completed focus interval earns a 15-minute rest.
    function breakDuration() { return (dailyPomodoros > 0 && dailyPomodoros % 4 == 0) ? 900 : 300; }
    function phaseDuration() {
        if (phase.equals("break") || phase.equals("break-due")) { return breakDuration(); }
        return 1500;
    }
    function begin() {
        if (queue.size() >= 20) { lastMessage = "Speicher voll: Sync"; redraw(); return; }
        refreshDay();
        running = true; paused = false;
        startEpoch = now(); lastEpoch = startEpoch;
        focusSec = 0; breakSec = 0; totalSec = 0;
        pomodoros = 0; phase = "focus"; phaseSec = 0;
        hrPoints = []; bbPoints = []; hrLast = null;
        bbStart = readBodyBattery(); bbEnd = null;
        if (bbStart != null) { bbPoints.add([0, bbStart]); }
        mode = "running"; lastMessage = "";
        try { Sensor.setEnabledSensors([Sensor.SENSOR_HEARTRATE]); } catch(ex) { }
        redraw();
    }
    function tick() as Void {
        refreshDay();
        if (waiting && requestStartedAt > 0 && now() - requestStartedAt > 15) {
            waiting = false;
            requestStartedAt = 0;
            if (mode.equals("syncing")) { mode = "select"; }
            lastMessage = "Offline - später erneut";
        }
        if (mode.equals("running") && running && !paused &&
            !phase.equals("focus-due") && !phase.equals("break-due")) {
            var t = now();
            var delta = t - lastEpoch;
            if (delta < 0 || delta > 5) { lastEpoch = t; redraw(); return; }
            lastEpoch = t;
            totalSec += delta;
            if (phase.equals("break")) { breakSec += delta; }
            else { focusSec += delta; }
            phaseSec += delta;
            if (delta > 0 && totalSec % 30 == 0) { sampleHeartRate(); }
            if (delta > 0 && totalSec % 300 == 0 && bbPoints.size() < 72) {
                var bb = readBodyBattery();
                if (bb != null) { bbPoints.add([totalSec, bb]); }
            }
            if (pomodoro && phase.equals("focus") && phaseSec >= 1500) {
                pomodoros += 1;
                dailyPomodoros += 1;
                Storage.setValue("pomodoroCount", dailyPomodoros);
                phase = "focus-due";
                phaseSec = 1500;
                alert();
            } else if (pomodoro && phase.equals("break") && phaseSec >= breakDuration()) {
                phase = "break-due";
                phaseSec = breakDuration();
                alert();
            }
        }
        redraw();
    }
    function alert() {
        try {
            Attention.vibrate([new Attention.VibeProfile(50,400),
                new Attention.VibeProfile(0,200),
                new Attention.VibeProfile(50,400)]);
        } catch(ex) { }
    }
    function sampleHeartRate() {
        try {
            var info = Sensor.getInfo();
            if (info != null && info.heartRate != null) {
                hrLast = info.heartRate;
                if (hrPoints.size() < 180) { hrPoints.add([totalSec, hrLast]); }
            }
        } catch(ex) { }
    }
    function readBodyBattery() {
        try {
            if ((Toybox has :SensorHistory) && (Toybox.SensorHistory has :getBodyBatteryHistory)) {
                var iter = SensorHistory.getBodyBatteryHistory({:period=>1});
                if (iter != null) {
                    var sample = iter.next();
                    if (sample != null && sample.data != null) {
                        var value = sample.data.toNumber();
                        if (value >= 0 && value <= 100) { return value; }
                    }
                }
            }
        } catch(ex) { }
        return null;
    }
    function pauseToggle() {
        if (!running) { return; }
        if (pomodoro && phase.equals("focus-due")) {
            phase = "break"; phaseSec = 0; paused = false;
        } else if (pomodoro && phase.equals("break-due")) {
            phase = "focus"; phaseSec = 0; paused = false;
        } else {
            paused = !paused;
        }
        lastEpoch = now(); redraw();
    }
    function openMenu() {
        if (!running) { return; }
        menuPriorPaused = paused;
        paused = true; menuIndex = 0; mode = "session-menu";
        lastEpoch = now(); redraw();
    }
    function closeMenu() {
        mode = "running";
        paused = menuPriorPaused;
        lastEpoch = now(); redraw();
    }
    function menuAction() {
        if (menuIndex == 0) {
            mode = "running"; paused = false; lastEpoch = now();
        } else if (menuIndex == 1) {
            mode = "running"; paused = true; lastEpoch = now();
        } else {
            finish(); return;
        }
        redraw();
    }
    function finish() {
        if (!running) { return; }
        sampleHeartRate(); bbEnd = readBodyBattery();
        if (bbEnd != null && bbPoints.size() < 72) { bbPoints.add([totalSec, bbEnd]); }
        running = false; paused = false; mode = "select";
        var raw = Cryptography.randomBytes(16); var hex = "";
        for (var i = 0; i < raw.size(); i++) { hex += raw[i].format("%02x"); }
        var item = {"id"=>"w"+hex, "activity"=>IDS[index], "startedAt"=>startEpoch,
            "durationSec"=>totalSec, "focusSec"=>focusSec, "breakSec"=>breakSec,
            "pomodoros"=>pomodoros, "hrSamples"=>hrPoints, "bbSamples"=>bbPoints,
            "bbStart"=>bbStart, "bbEnd"=>bbEnd};
        if (totalSec > 0) {
            if (queue.size() < 20) {
                queue.add(item);
                Storage.setValue("sessions", queue);
                lastMessage = "Session gespeichert";
            } else { lastMessage = "Speicher voll: Sync"; }
        }
        try { Sensor.setEnabledSensors([]); } catch(ex) { }
        redraw();
        // Never hijack navigation by auto-entering a network screen.
        // Saved locally and sent on explicit Sync later.
    }
    function onExit() { if (running) { finish(); } }
    function enterPair() { mode = "pairing"; code = "00000000"; digit = 0; lastMessage = ""; redraw(); }
    function incDigit(dir) {
        var s = "";
        for (var i = 0; i < 8; i++) {
            var val = code.substring(i,i+1).toNumber();
            if (i == digit) { val = (val + dir + 10) % 10; }
            s += val.toString();
        }
        code = s; redraw();
    }
    function nextDigit() {
        if (digit < 7) { digit++; redraw(); return; }
        mode = "syncing"; lastMessage = "Verbinde ...";
        waiting = true; requestStartedAt = now(); redraw();
        try {
            Communications.makeWebRequest(API+"/api/watch/pair/claim", {"code"=>code},
                {:method=>Communications.HTTP_REQUEST_METHOD_POST,
                 :headers=>{"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON}, method(:pairDone));
        } catch(ex) { waiting = false; requestStartedAt = 0;
            mode = "select"; lastMessage = "Keine Verbindung"; redraw(); }
    }
    function pairDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        if (!waiting) { return; }
        waiting = false; requestStartedAt = 0;
        if (mode.equals("syncing")) { mode = "select"; }
        if (status == 200 && data instanceof Lang.Dictionary && data.hasKey("token")) {
            token = data["token"]; Storage.setValue("watchToken", token); lastMessage = "Verbunden";
            redraw();
            // First successful pairing also fetches the planning snapshot.
            fetchPlanning(); return;
        } else { lastMessage = "Kopplung fehlgeschlagen"; }
        redraw();
    }
    function sync() {
        if (token == null) { enterPair(); return; }
        if (queue.size() == 0) { fetchPlanning(); return; }
        if (waiting) { return; }
        waiting = true; requestStartedAt = now(); mode = "syncing"; lastMessage = "Übertrage ..."; redraw();
        try {
            Communications.makeWebRequest(API+"/api/watch/sessions", queue[0],
                {:method=>Communications.HTTP_REQUEST_METHOD_POST,
                 :headers=>{"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON,
                     "Authorization"=>"Bearer "+token},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON}, method(:syncDone));
        } catch(ex) { waiting = false; requestStartedAt = 0;
            mode = "select"; lastMessage = "Keine Verbindung"; redraw(); }
    }
    function syncDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        if (!waiting) { return; }
        var onscreen = mode.equals("syncing");
        waiting = false; requestStartedAt = 0;
        if (onscreen) { mode = "select"; }
        if (status == 200 && data instanceof Lang.Dictionary && data["ok"] == true) {
            // Only remove a session after a server acknowledgment, even if user
            // has pressed BACK and meanwhile started another local session.
            if (queue.size() > 0) {
                queue.remove(queue[0]); Storage.setValue("sessions", queue);
            }
            lastMessage = "Sync OK";
            // Never re-enter SYNC from an asynchronous callback after BACK.
            // Such a callback must not interrupt a running focus timer.
            if (onscreen) {
                if (queue.size() > 0) { sync(); return; }
                fetchPlanning(); return;
            }
        } else { lastMessage = status == 401 ? "Bitte neu koppeln" : "Offline: später Sync"; }
        redraw();
    }
    function fetchPlanning() {
        if (token == null) { enterPair(); return; }
        if (waiting) { return; }
        waiting = true; requestStartedAt = now(); lastPlanningAttemptEpoch = now();
        // Keep cached agenda visible during a background refresh.
        if (!mode.equals("today") && !mode.equals("forecast") && !mode.equals("detail")) {
            mode = "syncing";
        }
        lastMessage = "Lade Planung ..."; redraw();
        try {
            var day = dateKey(); // yyyy-m-d -> normalize to yyyy-mm-dd
            var info = Gregorian.info(Time.now(),Time.FORMAT_SHORT);
            var mm = info.month.toString(); if (info.month < 10) { mm = "0"+mm; }
            var dd = info.day.toString(); if (info.day < 10) { dd = "0"+dd; }
            day = info.year.toString()+"-"+mm+"-"+dd;
            Communications.makeWebRequest(API+"/api/watch/planning?day="+day, {},
                {:method=>Communications.HTTP_REQUEST_METHOD_GET,
                 :headers=>{"Authorization"=>"Bearer "+token},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON},method(:planningDone));
        } catch(ex) {
            waiting = false; requestStartedAt = 0; mode = "select";
            lastMessage = "Offline - Cache bleibt"; redraw();
        }
    }
    function planningDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        if (!waiting) { return; }
        waiting = false; requestStartedAt = 0;
        if (mode.equals("syncing")) { mode = "select"; }
        if (status == 200 && data instanceof Lang.Dictionary && data.hasKey("today") && data.hasKey("deadlines")) {
            planningCache = data;
            lastPlanningFetchEpoch = now();
            try { Storage.setValue("watchPlanning", data);
                  Storage.setValue("planningFetchedEpoch", lastPlanningFetchEpoch); } catch(ex) { }
            lastMessage = "Planung aktualisiert";
        } else { lastMessage = status == 401 ? "Bitte neu koppeln" : "Offline - letzter Stand"; }
        redraw();
    }
    function agendaItems() {
        if (planningCache == null) { return []; }
        var sourceMode = mode.equals("detail") ? detailOrigin : mode;
        var key = sourceMode.equals("forecast") ? "deadlines" : "today";
        if (!planningCache.hasKey(key)) { return []; }
        var value = planningCache[key];
        return value == null ? [] : value;
    }
}

class CompassView extends WatchUi.View {
    const BG = 0x061014;
    const WHITE = 0xF4F6F4;
    const MUTED = 0x9AADB2;
    const TRACK = 0x20383D;
    const AQUA = 0x70C8CC;
    const TOMATO = 0xE65B50; // Recognizable red, never activity-colored
    const GOLD = 0xE0BB6A;
    var model;
    function initialize(m) { View.initialize(); model = m; }
    function pen(dc,c) { dc.setColor(c,BG); }
    function pad(n) { return (n<10 ? "0" : "")+n.toString(); }
    function drawTxt(dc,x,y,s,font,color,width) {
        var f = font;
        if (dc.getTextWidthInPixels(s,f) > width) { f = Graphics.FONT_SMALL; }
        if (dc.getTextWidthInPixels(s,f) > width) { f = Graphics.FONT_TINY; }
        pen(dc,color);
        dc.drawText(x,y,f,s,Graphics.TEXT_JUSTIFY_CENTER|Graphics.TEXT_JUSTIFY_VCENTER);
    }
    function centered(dc,y,s,font,color,width) {
        drawTxt(dc,dc.getWidth()/2,y,s,font,color,width);
    }
    function clockLabel() {
        try {
            var d = Gregorian.info(Time.now(),Time.FORMAT_SHORT);
            return pad(d.day)+"."+pad(d.month)+". "+pad(d.hour)+":"+pad(d.min);
        } catch(ex) { return "COMPASS"; }
    }
    function categoryLabel(dc,y,x,maxW) {
        var label = model.LABELS[model.index];
        drawTxt(dc,x,y,label,Graphics.FONT_MEDIUM,WHITE,maxW);
    }
    function categoryIcon(dc,x,y,r) {
        var c = model.COLORS[model.index];
        pen(dc,c); dc.fillCircle(x,y,r);
        pen(dc,BG);
        var i=model.index;
        if (i==0) { // Research: document with magnifier, not graduation cap.
            dc.drawRectangle(x-9,y-11,13,17);
            dc.drawLine(x-6,y-6,x+1,y-6); dc.drawLine(x-6,y-2,x,y-2);
            dc.drawCircle(x+5,y+5,5); dc.drawLine(x+9,y+9,x+13,y+13);
        } else if (i==1 || i==5) { // Teaching, continuing education: open book.
            dc.drawLine(x,y-7,x,y+8);
            dc.drawLine(x-9,y-7,x-9,y+7); dc.drawLine(x+9,y-7,x+9,y+7);
            dc.drawLine(x-9,y-7,x-1,y-4); dc.drawLine(x+1,y-4,x+9,y-7);
            dc.drawLine(x-9,y+7,x-1,y+9); dc.drawLine(x+1,y+9,x+9,y+7);
        } else if (i==2) { // Exams.
            dc.drawRectangle(x-9,y-10,18,20);
            dc.drawLine(x-5,y,x-1,y+4);dc.drawLine(x-1,y+4,x+6,y-5);
        } else if (i==3) { // Administration.
            dc.drawRectangle(x-10,y-5,20,14);dc.drawLine(x-9,y-7,x-2,y-7);
        } else if (i==4) { // Meeting.
            dc.fillCircle(x-5,y-5,3);dc.fillCircle(x+5,y-5,3);
            dc.drawLine(x-10,y+7,x-10,y+1);dc.drawLine(x+10,y+7,x+10,y+1);
            dc.drawLine(x-10,y+7,x-1,y+7);dc.drawLine(x+1,y+7,x+10,y+7);
        } else if (i==6) { // Family.
            dc.drawLine(x-10,y,x,y-10);dc.drawLine(x,y-10,x+10,y);
            dc.drawLine(x-7,y-3,x-7,y+9);dc.drawLine(x+7,y-3,x+7,y+9);
            dc.drawLine(x-7,y+9,x+7,y+9);
        } else { // Counseling: two joined circles.
            dc.drawCircle(x-4,y,6);dc.drawCircle(x+4,y,6);
        }
    }
    function heart(dc,x,y) {
        pen(dc,0xE1898E);
        dc.drawLine(x,y+7,x-8,y-2);dc.drawLine(x-8,y-2,x-8,y-6);
        dc.drawLine(x-8,y-6,x-4,y-9);dc.drawLine(x-4,y-9,x,y-5);
        dc.drawLine(x,y-5,x+4,y-9);dc.drawLine(x+4,y-9,x+8,y-6);
        dc.drawLine(x+8,y-6,x+8,y-2);dc.drawLine(x+8,y-2,x,y+7);
    }
    function battery(dc,x,y,val) {
        // Body Battery, not the Garmin hardware battery. A single vector icon
        // renders all values 0..100. The fixed black number area is legible on
        // a low-color MIP display and the bottom bar conveys charge visually.
        var ww=40; var hh=20;
        pen(dc,MUTED);
        dc.drawRectangle(x,y,ww,hh);
        dc.fillRectangle(x+ww,y+6,4,8); // Attached contact at the right.
        pen(dc,TRACK); dc.fillRectangle(x+2,y+2,ww-4,hh-4);
        if (val != null) {
            var v=val.toNumber();
            if (v<0) { v=0; }
            if (v>100) { v=100; }
            var filled=(v*(ww-6)/100).toNumber();
            if (filled>0) {
                pen(dc,v<=20?0xD66E69:v<=40?0xDBB66A:AQUA);
                dc.fillRectangle(x+3,y+15,filled,2);
            }
            drawTxt(dc,x+ww/2,y+8,v.toString(),Graphics.FONT_TINY,WHITE,ww-7);
        } else {
            drawTxt(dc,x+ww/2,y+8,"--",Graphics.FONT_TINY,MUTED,ww-7);
        }
    }
    function sensors(dc,y) {
        var cx=dc.getWidth()/2;
        heart(dc,cx-65,y);
        drawTxt(dc,cx-40,y,model.hrLast==null?"--":model.hrLast.toString(),Graphics.FONT_TINY,WHITE,34);
        var bb=model.bbStart;
        if (model.bbPoints.size()>0) { bb=model.bbPoints[model.bbPoints.size()-1][1]; }
        battery(dc,cx+11,y-10,bb);
    }
    function tomato(dc,x,y) {
        pen(dc,TOMATO);dc.fillCircle(x,y+1,7);
        pen(dc,0x75B888);
        dc.drawLine(x,y-6,x-2,y-10);dc.drawLine(x,y-6,x+4,y-9);
        dc.drawLine(x-5,y-7,x+5,y-7);
    }
    function diamond(dc,x,y,bright) {
        pen(dc,bright?GOLD:MUTED);
        dc.drawLine(x-8,y-3,x-4,y-8);dc.drawLine(x-4,y-8,x+4,y-8);
        dc.drawLine(x+4,y-8,x+8,y-3);dc.drawLine(x+8,y-3,x,y+8);
        dc.drawLine(x,y+8,x-8,y-3);dc.drawLine(x-8,y-3,x+8,y-3);
        if(bright) { dc.fillCircle(x,y-1,2); }
    }
    function cycleRow(dc,y) {
        if (!model.pomodoro) { return; }
        var cx=dc.getWidth()/2;
        tomato(dc,cx-71,y);
        drawTxt(dc,cx-49,y+1,model.dailyPomodoros.toString(),Graphics.FONT_SMALL,WHITE,31);
        var dots=model.dailyPomodoros%4;
        for(var i=0;i<4;i++) {
            pen(dc,i<dots?model.COLORS[model.index]:TRACK);
            dc.fillCircle(cx-15+i*12,y,4);
        }
        diamond(dc,cx+60,y,model.dailyPomodoros>0 && model.dailyPomodoros%4==0);
    }
    function timerText() {
        var s=model.totalSec;
        if(model.pomodoro) { s=model.phaseDuration()-model.phaseSec; if(s<0){s=0;} }
        var m=(s/60).toNumber();
        if(s>=3600) {
            var hrs=(s/3600).toNumber();
            return hrs.toString()+":"+pad((s%3600/60).toNumber())+":"+pad(s%60);
        }
        return pad(m)+":"+pad(s%60);
    }
    function drawRing(dc) {
        var cx=dc.getWidth()/2;var cy=dc.getHeight()/2;var r=cx-11;
        pen(dc,TRACK);dc.setPenWidth(2);
        dc.drawCircle(cx,cy,r);
        if(model.mode.equals("running") && model.pomodoro) {
            var duration=model.phaseDuration();
            var used=model.phaseSec;
            if(used>duration){used=duration;}
            if(used>0) {
                var degrees=(used*360/duration).toNumber();
                if(degrees>=360){degrees=359;}
                pen(dc,model.COLORS[model.index]);dc.setPenWidth(3);
                dc.drawArc(cx,cy,r,Graphics.ARC_CLOCKWISE,90,90-degrees);
            }
        } else if(model.mode.equals("running") && !model.pomodoro) {
            // Free timer has no deadline: colored arc is identity, not fake progress.
            pen(dc,model.COLORS[model.index]);dc.setPenWidth(2);
            dc.drawArc(cx,cy,r,Graphics.ARC_CLOCKWISE,72,108);
        }
        dc.setPenWidth(1);
    }
    function playIcon(dc,x,y) {
        pen(dc,AQUA);
        dc.drawLine(x-5,y-8,x+7,y);dc.drawLine(x+7,y,x-5,y+8);
        dc.drawLine(x-5,y+8,x-5,y-8);
    }
    function pauseIcon(dc,x,y) {
        pen(dc,AQUA);
        dc.fillRectangle(x-7,y-9,5,18);dc.fillRectangle(x+3,y-9,5,18);
    }
    function saveIcon(dc,x,y) {
        pen(dc,AQUA);dc.drawRectangle(x-9,y-10,18,20);
        dc.drawRectangle(x-5,y-9,10,7);dc.drawRectangle(x-5,y+3,10,6);
    }
    function hubItem(n) {
        if (n==0) { return "FOKUS"; }
        if (n==1) { return "HEUTE"; }
        if (n==2) { return "DEADLINES"; }
        return "SYNC";
    }
    function drawHub(dc,w,h) {
        var cx=w/2;
        centered(dc,h*29/100,"COMPASS",Graphics.FONT_SMALL,AQUA,w*70/100);
        // All menu rows stay clear of the COMPASS header and outer circle.
        for (var off=-1;off<=1;off++) {
            var n=(model.hubIndex+off+4)%4;
            var y=h*(59+off*14)/100;
            if (off==0) {
                pen(dc,TRACK); dc.fillRoundedRectangle(cx-86,y-15,172,30,4);
                pen(dc,AQUA); dc.fillRectangle(cx-72,y+15,144,2);
            }
            centered(dc,y,hubItem(n),Graphics.FONT_TINY,off==0?WHITE:MUTED,w*72/100);
        }
    }
    function shortDate(iso) {
        if (iso == null || iso.length() < 10) { return "Für heute"; }
        return iso.substring(8,10)+"."+iso.substring(5,7)+"."+iso.substring(0,4);
    }
    function daysUntil(iso) {
        if (iso == null) { return 9999; }
        try {
            var today=Gregorian.info(Time.now(), Time.FORMAT_SHORT);
            var present=Gregorian.moment({:year=>today.year, :month=>today.month, :day=>today.day});
            var yr=iso.substring(0,4).toNumber();
            var mo=iso.substring(5,7).toNumber();
            var da=iso.substring(8,10).toNumber();
            var deadline=Gregorian.moment({:year=>yr, :month=>mo, :day=>da});
            return (deadline.value()-present.value())/86400;
        } catch(ex) { return 9999; }
    }
    function urgencyColor(iso) {
        var days=daysUntil(iso);
        if (days <= 0) { return 0xE46F71; }
        if (days <= 2) { return GOLD; }
        return MUTED;
    }
    function calendarMark(dc,cx,cy,color) {
        pen(dc,color);dc.setPenWidth(2);
        dc.drawRectangle(cx-9,cy-9,18,17);
        dc.drawLine(cx-9,cy-3,cx+9,cy-3);
        dc.drawLine(cx-5,cy-12,cx-5,cy-6);
        dc.drawLine(cx+5,cy-12,cx+5,cy-6);
        dc.setPenWidth(1);
    }
    // Wrap using actual Connect IQ glyph widths; prefer breaking at word boundaries.
    function titleLines(dc,title,maxPx) {
        var result=[];
        var current="";
        var space=-1;
        for (var i=0;i<title.length();i++) {
            var c=title.substring(i,i+1);
            if (c.equals(" ")) { space=current.length(); }
            current+=c;
            if (dc.getTextWidthInPixels(current,Graphics.FONT_TINY)>maxPx && current.length()>1) {
                if (space>0) {
                    result.add(current.substring(0,space));
                    current=current.substring(space+1,current.length());
                } else {
                    result.add(current.substring(0,current.length()-1));
                    current=c;
                }
                space=-1;
            }
        }
        if (current.length()>0) { result.add(current); }
        return result;
    }
    function drawAgendaEmpty(dc,w,h,isForecast) {
        var head=isForecast?"DEADLINES":"HEUTE";
        centered(dc,h*29/100,head,Graphics.FONT_SMALL,AQUA,w*72/100);
        var items=model.agendaItems();
        if (items.size() == 0) {
            centered(dc,h*47/100,"Keine Einträge",Graphics.FONT_SMALL,WHITE,w*76/100);
            centered(dc,h*65/100,model.planningCache==null?"Noch nicht geladen":"Keine offenen Aufgaben",Graphics.FONT_TINY,MUTED,w*78/100);
            centered(dc,h*74/100,"BACK zum Menü",Graphics.FONT_TINY,MUTED,w*73/100);
            return;
        }
        var task=items[model.agendaIndex%items.size()];
        var title=task["title"];
        var due=task["dueDate"];
        var col=urgencyColor(due);
        if (isForecast) { calendarMark(dc,w/2,h*40/100,col); }
        var lines=titleLines(dc,title,w*73/100);
        var shown=lines.size()>2?2:lines.size();
        for (var k=0;k<shown;k++) {
            var text=lines[k];
            if (k==1 && lines.size()>2) { text=text+"…"; }
            centered(dc,h*(51+k*10)/100,text,Graphics.FONT_TINY,WHITE,w*76/100);
        }
        centered(dc,h*72/100,shortDate(due),Graphics.FONT_TINY,col,w*72/100);
        centered(dc,h*83/100,(model.agendaIndex%items.size()+1).toString()+" / "+items.size().toString(),Graphics.FONT_TINY,MUTED,w*70/100);
    }
    function drawAgendaDetail(dc,w,h) {
        var items=model.agendaItems();
        if (items.size()==0) { centered(dc,h*52/100,"Keine Einträge",Graphics.FONT_SMALL,WHITE,w*72/100); return; }
        var task=items[model.agendaIndex%items.size()];
        var due=task["dueDate"];
        var col=urgencyColor(due);
        centered(dc,h*28/100,model.detailOrigin.equals("forecast")?"DEADLINE":"AUFGABE",Graphics.FONT_SMALL,AQUA,w*69/100);
        var lines=titleLines(dc,task["title"],w*76/100);
        var maxOffset=lines.size()>3?lines.size()-3:0;
        if (model.detailOffset>maxOffset) { model.detailOffset=maxOffset; }
        for(var j=0;j<3;j++) {
            var ix=j+model.detailOffset;
            if(ix<lines.size()) {
                centered(dc,h*(42+j*10)/100,lines[ix],Graphics.FONT_TINY,WHITE,w*78/100);
            }
        }
        centered(dc,h*76/100,shortDate(due),Graphics.FONT_TINY,col,w*73/100);
        centered(dc,h*85/100,task["category"],Graphics.FONT_TINY,MUTED,w*75/100);
    }
    function menuRow(dc,y,index,label,selected) {
        var cx=dc.getWidth()/2;
        if(selected) {
            pen(dc,TRACK);dc.fillRoundedRectangle(cx-90,y-16,180,33,5);
            pen(dc,AQUA);dc.fillRectangle(cx-87,y+14,174,2);
        }
        if(index==0){playIcon(dc,cx-76,y);}
        if(index==1){pauseIcon(dc,cx-76,y);}
        if(index==2){saveIcon(dc,cx-76,y);}
        drawTxt(dc,cx+7,y,label,Graphics.FONT_SMALL,selected?WHITE:MUTED,148);
    }
    function onUpdate(dc) {
        var w=dc.getWidth();var h=dc.getHeight();var cx=w/2;
        pen(dc,BG);dc.clear();
        drawRing(dc);
        centered(dc,h*15/100,clockLabel(),Graphics.FONT_TINY,MUTED,w*68/100);
        pen(dc,AQUA);dc.fillRectangle(cx-11,h*20/100,22,2);
        if(model.mode.equals("running")) {
            sensors(dc,h*29/100);
            categoryIcon(dc,cx-62,h*42/100,17);
            categoryLabel(dc,h*42/100,cx+18,w*65/100);
            var status=model.paused?"PAUSIERT":(!model.pomodoro?"LÄUFT":model.phase.equals("focus")?"FOKUS":model.phase.equals("break")?"PAUSE":model.phase.equals("focus-due")?"FOKUS FERTIG":"PAUSE FERTIG");
            centered(dc,h*54/100,status,Graphics.FONT_TINY,model.paused?GOLD:model.COLORS[model.index],w*64/100);
            centered(dc,h*66/100,timerText(),Graphics.FONT_LARGE,WHITE,w*70/100);
            cycleRow(dc,h*83/100);
        } else if(model.mode.equals("session-menu")) {
            centered(dc,h*30/100,"SESSION",Graphics.FONT_MEDIUM,AQUA,w*68/100);
            menuRow(dc,h*44/100,0,"Fortsetzen",model.menuIndex==0);
            menuRow(dc,h*59/100,1,"Pausieren",model.menuIndex==1);
            menuRow(dc,h*74/100,2,"Beenden",model.menuIndex==2);
        } else if(model.mode.equals("hub")) {
            drawHub(dc,w,h);
        } else if(model.mode.equals("today") || model.mode.equals("forecast")) {
            drawAgendaEmpty(dc,w,h,model.mode.equals("forecast"));
        } else if(model.mode.equals("detail")) {
            drawAgendaDetail(dc,w,h);
        } else if(model.mode.equals("pairing")) {
            centered(dc,h*33/100,"KOPPELN",Graphics.FONT_MEDIUM,AQUA,w*67/100);
            var d=model.digit;
            var code=model.code.substring(0,d)+"["+model.code.substring(d,d+1)+"]"+model.code.substring(d+1,8);
            centered(dc,h*50/100,code,Graphics.FONT_SMALL,WHITE,w*84/100);
            centered(dc,h*64/100,"STELLE "+(d+1).toString()+" / 8",Graphics.FONT_TINY,MUTED,w*68/100);
            centered(dc,h*81/100,"UP/DOWN: ZAHL",Graphics.FONT_TINY,MUTED,w*70/100);
        } else if(model.mode.equals("syncing")) {
            centered(dc,h*40/100,"SYNC",Graphics.FONT_MEDIUM,AQUA,w*70/100);
            centered(dc,h*57/100,model.lastMessage,Graphics.FONT_SMALL,WHITE,w*80/100);
        } else {
            centered(dc,h*29/100,"COMPASS",Graphics.FONT_SMALL,AQUA,w*65/100);
            categoryIcon(dc,cx-64,h*43/100,18);
            categoryLabel(dc,h*43/100,cx+17,w*64/100);
            if(model.pomodoro) {
                // Tomato replaces redundant '25 / 5' Pomodoro explanation.
                tomato(dc,cx-54,h*62/100);
                drawTxt(dc,cx+18,h*63/100,"25:00",Graphics.FONT_LARGE,WHITE,w*47/100);
                if(model.lastMessage.equals("")) { cycleRow(dc,h*82/100); }
            } else {
                centered(dc,h*61/100,"FREIER TIMER",Graphics.FONT_TINY,model.COLORS[model.index],w*65/100);
                centered(dc,h*73/100,"00:00",Graphics.FONT_LARGE,WHITE,w*65/100);
            }
            if(!model.lastMessage.equals("")) {
                centered(dc,h*82/100,model.lastMessage,Graphics.FONT_TINY,MUTED,w*72/100);
            }
        }
    }
}

// Same working physical key path established in the D4 simulator tests.
class CompassInput extends WatchUi.InputDelegate {
    var model;
    function initialize(m) { InputDelegate.initialize(); model = m; }
    function onKey(ev as WatchUi.KeyEvent) as Lang.Boolean {
        var k = ev.getKey();
        try {
            if (model.mode.equals("session-menu")) {
                if (k == WatchUi.KEY_UP) { model.menuIndex = (model.menuIndex+2)%3; }
                else if (k == WatchUi.KEY_DOWN) { model.menuIndex = (model.menuIndex+1)%3; }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.menuAction(); }
                else if (k == WatchUi.KEY_ESC) { model.closeMenu(); }
            } else if (model.mode.equals("pairing")) {
                if (k == WatchUi.KEY_UP) { model.incDigit(1); }
                else if (k == WatchUi.KEY_DOWN) { model.incDigit(-1); }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.nextDigit(); }
                else if (k == WatchUi.KEY_ESC) { model.mode = "select"; }
            } else if (model.mode.equals("hub")) {
                if (k == WatchUi.KEY_UP) { model.hubIndex = (model.hubIndex+3)%4; }
                else if (k == WatchUi.KEY_DOWN) { model.hubIndex = (model.hubIndex+1)%4; }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.openHubItem(); }
                else if (k == WatchUi.KEY_ESC) { model.mode = "select"; }
            } else if (model.mode.equals("today") || model.mode.equals("forecast")) {
                if (k == WatchUi.KEY_UP || k == WatchUi.KEY_DOWN) {
                    var items = model.agendaItems();
                    if (items.size() > 0) {
                        var dir = k == WatchUi.KEY_DOWN ? 1 : -1;
                        model.agendaIndex = (model.agendaIndex + dir + items.size()) % items.size();
                    }
                } else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) {
                    if (model.agendaItems().size() > 0) {
                        model.detailOrigin=model.mode;model.detailOffset=0;model.mode="detail";
                    }
                } else if (k == WatchUi.KEY_ESC) { model.mode = "hub"; }
            } else if (model.mode.equals("detail")) {
                if (k == WatchUi.KEY_UP) { if (model.detailOffset>0) { model.detailOffset--; } }
                else if (k == WatchUi.KEY_DOWN) { model.detailOffset++; }
                else if (k == WatchUi.KEY_ESC || k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) {
                    model.mode=model.detailOrigin;
                }
            } else if (model.mode.equals("syncing")) {
                if (k == WatchUi.KEY_ESC || k == WatchUi.KEY_LAP) { model.mode = "select"; model.lastMessage = "Sync im Hintergrund"; }
            } else if (model.mode.equals("select")) {
                if (k == WatchUi.KEY_UP) { model.chooseCategory(-1); }
                else if (k == WatchUi.KEY_DOWN) { model.chooseCategory(1); }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.begin(); }
                else if (k == WatchUi.KEY_MENU) { model.showHub(); }
                else if (k == WatchUi.KEY_ESC || k == WatchUi.KEY_LAP) { model.sync(); }
            } else if (model.mode.equals("running")) {
                if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.pauseToggle(); }
                else if (k == WatchUi.KEY_ESC) { model.openMenu(); }
            }
        } catch(ex) { System.println("COMPASS 0.3.3 INPUT ERROR"); }
        model.redraw();
        return true;
    }
}
