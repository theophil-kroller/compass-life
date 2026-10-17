// Compass Focus 0.3.1 — fēnix 7S (240 x 240)
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
    // 0.3.1 Worker patch must be deployed BEFORE synchronizing Lehre/Pruefungen.
    const IDS = ["Forschung", "Lehre", "Pruefungen", "Verwaltung", "Meeting", "Weiterbildung", "Familie", "Beziehungsdynamiken"];
    const LABELS = ["Forschung", "Lehre", "Prüfungen", "Verwaltung", "Meetings", "Weiterbildung", "Familie", "Beziehungsdynamiken"];
    const COLORS = [0x65BEC7, 0xD4B46C, 0xD99868, 0x86A4BA, 0x93A3AD, 0xB7A6CB, 0x8FBC9F, 0xC96B4B];

    var mode = "select"; // select / running / session-menu / pairing / syncing
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

    function initialize() {
        token = Storage.getValue("watchToken");
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
            } else if (pomodoro && phase.equals("break") && phaseSec >= 300) {
                phase = "break-due";
                phaseSec = 300;
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
        if (token != null && queue.size() > 0) { sync(); }
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
        mode = "syncing"; lastMessage = "Verbinde ..."; redraw();
        try {
            Communications.makeWebRequest(API+"/api/watch/pair/claim", {"code"=>code},
                {:method=>Communications.HTTP_REQUEST_METHOD_POST,
                 :headers=>{"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON}, method(:pairDone));
        } catch(ex) { mode = "select"; lastMessage = "Keine Verbindung"; redraw(); }
    }
    function pairDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        mode = "select";
        if (status == 200 && data instanceof Lang.Dictionary && data.hasKey("token")) {
            token = data["token"]; Storage.setValue("watchToken", token); lastMessage = "Verbunden";
        } else { lastMessage = "Kopplung fehlgeschlagen"; }
        redraw();
    }
    function sync() {
        if (token == null) { enterPair(); return; }
        if (queue.size() == 0) { lastMessage = "Alles übertragen"; redraw(); return; }
        if (waiting) { return; }
        waiting = true; mode = "syncing"; lastMessage = "Übertrage ..."; redraw();
        try {
            Communications.makeWebRequest(API+"/api/watch/sessions", queue[0],
                {:method=>Communications.HTTP_REQUEST_METHOD_POST,
                 :headers=>{"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON,
                     "Authorization"=>"Bearer "+token},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON}, method(:syncDone));
        } catch(ex) { waiting = false; mode = "select"; lastMessage = "Keine Verbindung"; redraw(); }
    }
    function syncDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        waiting = false; mode = "select";
        if (status == 200 && data instanceof Lang.Dictionary && data["ok"] == true) {
            queue.remove(queue[0]); Storage.setValue("sessions", queue); lastMessage = "Sync OK";
            if (queue.size() > 0) { sync(); return; }
        } else { lastMessage = status == 401 ? "Bitte neu koppeln" : "Offline: später Sync"; }
        redraw();
    }
}

class CompassView extends WatchUi.View {
    const BG = 0x091419;
    const WHITE = 0xF0F4F2;
    const MUTED = 0x91A5AA;
    const TRACK = 0x23393E;
    const AQUA = 0x78C6C7;
    var model;
    function initialize(m) { View.initialize(); model = m; }
    function pen(dc, c) { dc.setColor(c, BG); }
    function textAt(dc, x, y, s, f, color, width) {
        var font = f;
        if (dc.getTextWidthInPixels(s, font) > width) { font = Graphics.FONT_SMALL; }
        if (dc.getTextWidthInPixels(s, font) > width) { font = Graphics.FONT_TINY; }
        pen(dc, color);
        dc.drawText(x, y, font, s, Graphics.TEXT_JUSTIFY_CENTER | Graphics.TEXT_JUSTIFY_VCENTER);
    }
    function centered(dc, y, s, f, c, maxW) { textAt(dc, dc.getWidth()/2, y, s, f, c, maxW); }
    function pad(n) { return (n < 10 ? "0" : "") + n.toString(); }
    function clockLabel() {
        try {
            var d = Gregorian.info(Time.now(), Time.FORMAT_SHORT);
            return pad(d.day) + "." + pad(d.month) + ".  " + pad(d.hour) + ":" + pad(d.min);
        } catch(ex) { return "COMPASS"; }
    }
    function categoryLabel(dc, y, x, maxW, color) {
        var label = model.LABELS[model.index];
        if (model.index == 7) {
            textAt(dc, x, y-9, "Beziehungs-", Graphics.FONT_SMALL, color, maxW);
            textAt(dc, x, y+10, "dynamiken", Graphics.FONT_SMALL, color, maxW);
        } else {
            textAt(dc, x, y, label, Graphics.FONT_MEDIUM, color, maxW);
        }
    }
    function categoryIcon(dc, x, y, r) {
        var c = model.COLORS[model.index];
        pen(dc, TRACK); dc.fillCircle(x,y,r);
        pen(dc, c);
        var i = model.index;
        if (i == 0) { // Forschung — microscope / lens
            dc.drawCircle(x-2,y-3,6); dc.drawLine(x+3,y+2,x+9,y+8); dc.drawLine(x-8,y+9,x+8,y+9);
        } else if (i == 1 || i == 5) { // Lehre / Weiterbildung — open book
            dc.drawLine(x,y-6,x,y+8); dc.drawLine(x-9,y-6,x-9,y+6); dc.drawLine(x+9,y-6,x+9,y+6);
            dc.drawLine(x-9,y-6,x-1,y-4); dc.drawLine(x+1,y-4,x+9,y-6);
            dc.drawLine(x-9,y+6,x-1,y+8); dc.drawLine(x+1,y+8,x+9,y+6);
        } else if (i == 2) { // Prüfungen — tick
            dc.drawRectangle(x-9,y-9,18,18); dc.drawLine(x-5,y,x-1,y+4); dc.drawLine(x-1,y+4,x+6,y-5);
        } else if (i == 3) { // Verwaltung — folders
            dc.drawRectangle(x-10,y-5,20,13); dc.drawLine(x-10,y-7,x-2,y-7);
        } else if (i == 4) { // Meetings — people
            dc.drawCircle(x-5,y-5,3); dc.drawCircle(x+5,y-5,3);
            dc.drawLine(x-10,y+7,x-10,y+1); dc.drawLine(x+10,y+7,x+10,y+1);
            dc.drawLine(x-10,y+7,x-1,y+7); dc.drawLine(x+1,y+7,x+10,y+7);
        } else if (i == 6) { // Familie — home
            dc.drawLine(x-10,y,x,y-9); dc.drawLine(x,y-9,x+10,y);
            dc.drawLine(x-7,y-2,x-7,y+9); dc.drawLine(x+7,y-2,x+7,y+9);
            dc.drawLine(x-7,y+9,x+7,y+9);
        } else { // Beziehungsdynamiken — two rings
            dc.drawCircle(x-4,y,6); dc.drawCircle(x+4,y,6);
        }
    }
    function heart(dc,x,y) {
        pen(dc,0xD98990);
        dc.drawLine(x,y+7,x-9,y-1); dc.drawLine(x-9,y-1,x-9,y-6);
        dc.drawLine(x-9,y-6,x-5,y-9); dc.drawLine(x-5,y-9,x,y-5);
        dc.drawLine(x,y-5,x+5,y-9); dc.drawLine(x+5,y-9,x+9,y-6);
        dc.drawLine(x+9,y-6,x+9,y-1); dc.drawLine(x+9,y-1,x,y+7);
    }
    function battery(dc,x,y,val) {
        pen(dc,AQUA); dc.drawRoundedRectangle(x,y,48,22,4);
        dc.fillRectangle(x+49,y+7,3,8);
        if (val != null) {
            var fill = (val*39/100).toNumber();
            if (fill > 0) { dc.fillRectangle(x+4,y+4,fill,14); }
            // Dark text on a pale backdrop retains legibility at low battery values.
            pen(dc,WHITE); dc.fillRoundedRectangle(x+12,y+3,24,16,3);
            textAt(dc,x+24,y+11,val.toString(),Graphics.FONT_TINY,BG,23);
        } else {
            textAt(dc,x+24,y+11,"--",Graphics.FONT_TINY,WHITE,38);
        }
    }
    function sensors(dc,y) {
        var cx = dc.getWidth()/2;
        heart(dc,cx-63,y);
        var hr = model.hrLast == null ? "--" : model.hrLast.toString();
        textAt(dc,cx-37,y,hr,Graphics.FONT_TINY,WHITE,42);
        // Use cached Body Battery samples. SensorHistory must not be polled on each repaint.
        var bb = model.bbStart;
        if (model.bbPoints.size() > 0) {
            bb = model.bbPoints[model.bbPoints.size()-1][1];
        }
        battery(dc,cx+8,y-11,bb);
    }
    function timerText() {
        var s = model.totalSec;
        if (model.pomodoro) {
            var length = model.phase.equals("break") || model.phase.equals("break-due") ? 300 : 1500;
            s = length - model.phaseSec;
            if (s < 0) { s = 0; }
            // Round to next whole minute/second, showing 25:00 at session start.
        }
        var m = (s / 60).toNumber();
        return m.toString() + ":" + pad(s % 60);
    }
    function drawArcProgress(dc) {
        if (!model.pomodoro) { return; }
        var total = model.phase.equals("break") || model.phase.equals("break-due") ? 300 : 1500;
        var used = model.phaseSec;
        if (used <= 0) { return; }
        if (used > total) { used = total; }
        var degrees = (used*360/total).toNumber();
        if (degrees >= 360) { degrees = 359; }
        pen(dc,model.COLORS[model.index]);
        dc.setPenWidth(3);
        dc.drawArc(dc.getWidth()/2,dc.getHeight()/2,dc.getWidth()/2-9,Graphics.ARC_CLOCKWISE,90,90-degrees);
        dc.setPenWidth(1);
    }
    function menuRow(dc,y,label,selected) {
        var cx = dc.getWidth()/2;
        if (selected) {
            pen(dc,TRACK); dc.fillRoundedRectangle(cx-91,y-18,182,36,7);
            pen(dc,AQUA); dc.fillRoundedRectangle(cx-91,y-18,3,36,1);
        }
        centered(dc,y,label,Graphics.FONT_SMALL,selected?WHITE:MUTED,174);
    }
    function onUpdate(dc) {
        var w = dc.getWidth(); var h = dc.getHeight(); var cx = w/2;
        pen(dc,BG); dc.clear();
        // A restrained, thin visual bezel that preserves the round display's safe area.
        pen(dc,TRACK); dc.drawCircle(cx,h/2,w/2-9);
        centered(dc,h*13/100,clockLabel(),Graphics.FONT_TINY,MUTED,w*64/100);
        pen(dc,AQUA); dc.fillRoundedRectangle(cx-13,h*20/100,26,2,1);
        if (model.mode.equals("running")) {
            drawArcProgress(dc);
            categoryIcon(dc,cx-65,h*34/100,17);
            categoryLabel(dc,h*34/100,cx+16,w*62/100,WHITE);
            centered(dc,h*52/100,timerText(),Graphics.FONT_LARGE,WHITE,w*72/100);
            var status = "FOKUS";
            if (model.paused) { status = "PAUSIERT"; }
            else if (model.phase.equals("focus-due")) { status = "FOKUS FERTIG"; }
            else if (model.phase.equals("break-due")) { status = "PAUSE FERTIG"; }
            else if (model.phase.equals("break")) { status = "PAUSE"; }
            else if (!model.pomodoro) { status = "FREIER FOKUS"; }
            centered(dc,h*65/100,status,Graphics.FONT_TINY,model.paused?0xD8B277:AQUA,w*70/100);
            sensors(dc,h*77/100);
            centered(dc,h*88/100,model.dailyPomodoros.toString()+" POMODOROS HEUTE",Graphics.FONT_TINY,MUTED,w*67/100);
        } else if (model.mode.equals("session-menu")) {
            centered(dc,h*32/100,"SESSION",Graphics.FONT_MEDIUM,AQUA,w*60/100);
            menuRow(dc,h*45/100,"Fortsetzen",model.menuIndex==0);
            menuRow(dc,h*61/100,"Pausieren",model.menuIndex==1);
            menuRow(dc,h*77/100,"Beenden & speichern",model.menuIndex==2);
        } else if (model.mode.equals("pairing")) {
            centered(dc,h*35/100,"KOPPELN",Graphics.FONT_MEDIUM,AQUA,w*70/100);
            var d = model.digit;
            var code = model.code.substring(0,d)+"["+model.code.substring(d,d+1)+"]"+model.code.substring(d+1,8);
            centered(dc,h*50/100,code,Graphics.FONT_SMALL,WHITE,w*82/100);
            centered(dc,h*66/100,"STELLE "+(d+1).toString()+" / 8",Graphics.FONT_TINY,MUTED,w*70/100);
            centered(dc,h*80/100,"UP/DOWN: ZAHL",Graphics.FONT_TINY,MUTED,w*69/100);
            centered(dc,h*89/100,"START: WEITER",Graphics.FONT_TINY,MUTED,w*58/100);
        } else if (model.mode.equals("syncing")) {
            centered(dc,h*39/100,"SYNCHRONISATION",Graphics.FONT_SMALL,AQUA,w*76/100);
            centered(dc,h*58/100,model.lastMessage,Graphics.FONT_SMALL,WHITE,w*77/100);
        } else {
            centered(dc,h*30/100,"COMPASS",Graphics.FONT_SMALL,AQUA,w*65/100);
            categoryIcon(dc,cx-69,h*44/100,18);
            categoryLabel(dc,h*44/100,cx+18,w*60/100,WHITE);
            centered(dc,h*61/100,model.pomodoro?"POMODORO":"FREIER TIMER",Graphics.FONT_TINY,AQUA,w*70/100);
            centered(dc,h*72/100,model.pomodoro?"25 / 5":"OHNE LIMIT",Graphics.FONT_LARGE,WHITE,w*70/100);
            var bottom = model.lastMessage.equals("") ? model.dailyPomodoros.toString()+" POMODOROS HEUTE" : model.lastMessage;
            centered(dc,h*86/100,bottom,Graphics.FONT_TINY,MUTED,w*70/100);
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
            } else if (model.mode.equals("select")) {
                if (k == WatchUi.KEY_UP) { model.index = (model.index+model.LABELS.size()-1)%model.LABELS.size(); }
                else if (k == WatchUi.KEY_DOWN) { model.index = (model.index+1)%model.LABELS.size(); }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.begin(); }
                else if (k == WatchUi.KEY_MENU) { model.pomodoro = !model.pomodoro; }
                else if (k == WatchUi.KEY_ESC || k == WatchUi.KEY_LAP) { model.sync(); }
            } else if (model.mode.equals("running")) {
                if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.pauseToggle(); }
                else if (k == WatchUi.KEY_ESC) { model.openMenu(); }
            }
        } catch(ex) { System.println("COMPASS 0.3.1 INPUT ERROR"); }
        model.redraw();
        return true;
    }
}
