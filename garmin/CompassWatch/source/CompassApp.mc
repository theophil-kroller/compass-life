// Compass Chrono 0.5.12.6 — People Todo Detail — fēnix 7S (240 x 240, 64-color MIP)
// Built from D4: one InputDelegate, String.equals() comparisons.
// Preview build: compile and test with Garmin Connect IQ SDK 9.2.0.
using Toybox.Application;
using Toybox.Application.Storage;
using Toybox.Attention;
using Toybox.Communications;
using Toybox.Cryptography;
using Toybox.Graphics;
using Toybox.Lang;
using Toybox.Math;
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
    // Category 7 replaces the unused no-timer Counseling slot.
    // Pruefungen is also accepted by the deployed Worker, allowing recording
    // examination-supervision duration without a Worker migration.
    // Category 2 is correction work (Pomodoro); category 7 is exam supervision.
    const IDS = ["Forschung", "Lehre", "Pruefungskorrektur", "Verwaltung", "Meeting", "Weiterbildung", "Familie", "Pruefungen"];
    const LABELS = ["Forschung", "Lehre", "Korrektur", "Verwaltung", "Meetings", "Weiterbildung", "Familie", "Prüfungsmodus"];
    const COLORS = [0x55FFFF, 0x55FFAA, 0xFF5555, 0x55AAFF, 0x55AAFF, 0xAA55FF, 0x55FFAA, 0xAA0055];
    const DEFAULT_POMODORO = [true, false, true, false, false, true, false, false];
    const EXAM_CATEGORY = 7;
    // Seconds elapsed from the start of an uninterrupted 60-minute exam;
    // no independent timers, hence announcements cannot drift apart.
    const EXAM_MARKS = [1800, 2700, 3300, 3600];
    const EXAM_TOTAL_SEC = 3600;


    var mode = "select"; // select / hub / today / forecast / detail / running / session-menu / pairing / syncing
    var hubIndex = 0;
    var shoppingListIndex = 0;
    var shoppingListId = "";
    var peopleIndex = 0;
    var peoplePointIndex = 0;
    // Snapshot only the selected visible title/name to keep the detail stable
    // if the day's watch projection refreshes while the user is reading it.
    var personPointTitle = "";
    var personPointName = "";
    var personPointPosition = "";
    var dashboardCache = null;
    var dashboardDay = "";
    var watchDateFormat = "dd.MM.";
    var lastDashboardAttemptAt = 0;
    var lastDashboardFetchAt = 0;
    var shoppingIndex = 0;
    // Build-time QA flag. PRODUCTION=false; the simulator-only ZIP changes it to true.
    const SIMULATOR_DEMO = false;
    var demoDashboard = null;
    var lastTouchMode = "";
    var shoppingQueue = [];
    var shoppingSending = false;
    // Garmin agenda screens remain empty until Compass has actual dated tasks.
    // Never invent/transform undated inbox captures into scheduled tasks.
    var index = 0;
    var pomodoro = true;
    var running = false;
    var paused = false;
    var menuPriorPaused = false;
    // A paused draft is NEVER a completed/synced session.
    var draft = null;
    var discardChoice = 0;
    var backgroundSync = false;
    var lastAutoSyncAt = 0;
    // A Pomodoro checkpoint and a final upload use the SAME session ID.
    // Revisions increase monotonically; only the newest server revision counts.
    var activeSessionId = null;
    var sessionRevision = 0;
    var pendingCheckpoint = null;
    var syncSentType = "";
    var syncSentId = "";
    var syncSentRevision = 0;
    var lastCheckpointEpoch = 0;
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
    // Cached for chronograph side register; no fabricated sensor data.
    var faceBb = null;
    var lastFaceBbAt = 0;
    // Current heart rate is ephemeral; do not persist or fabricate a reading.
    var faceHr = null;
    var faceHrMeasuredAt = 0;
    var lastFaceHrAttemptAt = 0;
    // Exam alert state survives Resume Later and device-app restarts.
    var examNextIndex = 0; // number of delivered milestones: 0..4
    var examBannerIndex = 0; // 1..4, independently of next countdown
    var examBannerUntil = 0; // wall-clock epoch: alert shown for one minute


    function initialize() {
        if (SIMULATOR_DEMO) {
            // Synthetic content stays in memory. NEVER saved, queued or sent to Cloudflare.
            demoDashboard = {
                "events"=>[
                    {"title"=>"Jour fixe UKO", "start"=>"09:00", "end"=>"10:30"},
                    {"title"=>"LV Entrepreneurship", "start"=>"10:30", "end"=>"12:00"},
                    {"title"=>"Besprechung", "start"=>"13:00", "end"=>"15:00"},
                    {"title"=>"Work", "start"=>"16:00", "end"=>"18:00"}
                ],
                "today"=>[
                    {"title"=>"UKO Agenda vorbereiten", "dueDate"=>"2026-10-28"},
                    {"title"=>"Prüfungsfragen prüfen", "dueDate"=>"2026-10-28"},
                    {"title"=>"E-Mails beantworten", "dueDate"=>"2026-10-28"},
                    {"title"=>"Vortrag finalisieren", "dueDate"=>"2026-10-28"}
                ],
                "deadlines"=>[
                    {"title"=>"UKO Unterlagen", "dueDate"=>"2026-10-29"},
                    {"title"=>"Forschungsbericht", "dueDate"=>"2026-10-30"},
                    {"title"=>"N: Englisch-Schularbeit", "dueDate"=>"2026-11-04"},
                    {"title"=>"LV-Präsentation", "dueDate"=>"2026-11-05"},
                    {"title"=>"Seminar Review", "dueDate"=>"2026-11-06"}
                ],
                "shoppingLists"=>[ {"id"=>"12345678-1234-4234-9234-1234567890ab","title"=>"Einkaufsliste Hofer – Wochenvorrat und Haushalt"}, {"id"=>"12345678-1234-4234-9234-1234567890ac","title"=>"Einkaufsliste Spar"} ],
                "people"=>[ {"name"=>"Martin","points"=>["Urlaub besprechen","Wochenendplanung"]}, {"name"=>"Andrea","points"=>["Unterlagen besprechen"]} ],
                "shopping"=>[
                    {"id"=>"demo-a","version"=>1,"checked"=>false,"title"=>"Hafermilch"},
                    {"id"=>"demo-b","version"=>1,"checked"=>false,"title"=>"Blaubeeren"},
                    {"id"=>"demo-c","version"=>1,"checked"=>false,"title"=>"Bananen"},
                    {"id"=>"demo-d","version"=>1,"checked"=>false,"title"=>"Vollkornbrot"},
                    {"id"=>"demo-e","version"=>1,"checked"=>false,"title"=>"Ingwer"},
                    {"id"=>"demo-f","version"=>1,"checked"=>false,"title"=>"Mineralwasser"}
                ]
            };
        }
        token = Storage.getValue("watchToken");
        planningCache = Storage.getValue("watchPlanning");
        dashboardCache = Storage.getValue("watchDashboard0512");
        var dday = Storage.getValue("watchDashboardDay0512");
        dashboardDay = dday == null ? "" : dday;
        var savedShoppingId = Storage.getValue("watchShoppingListId05124");
        shoppingListId = savedShoppingId==null ? "" : savedShoppingId;
        var shoppingSaved = Storage.getValue("watchShoppingQueue0512");
        shoppingQueue = shoppingSaved == null ? [] : shoppingSaved;
        var cacheEpoch = Storage.getValue("planningFetchedEpoch");
        lastPlanningFetchEpoch = cacheEpoch == null ? 0 : cacheEpoch;
        var saved = Storage.getValue("sessions");
        queue = saved == null ? [] : saved;
        pendingCheckpoint = Storage.getValue("focusCheckpoint057127");
        // Resume Later survives app restarts without inflating the sync queue.
        draft = Storage.getValue("activeDraft052");
        if (draft != null && draft instanceof Lang.Dictionary && draft.hasKey("index")) {
            var ix = draft["index"];
            if (ix != null && ix >= 0 && ix < LABELS.size() &&
                (ix != EXAM_CATEGORY || (draft.hasKey("examSession") && draft["examSession"] == true))) {
                index = ix;
                pomodoro = DEFAULT_POMODORO[index];
                if (ix == EXAM_CATEGORY) {
                    totalSec = draft["totalSec"];
                    examNextIndex = draft.hasKey("examNextIndex") ? draft["examNextIndex"] : 0;
                    examBannerIndex = draft.hasKey("examBannerIndex") ? draft["examBannerIndex"] : 0;
                    examBannerUntil = draft.hasKey("examBannerUntil") ? draft["examBannerUntil"] : 0;
                }
                lastMessage = "▶ Session fortsetzen";
            } else { draft = null; }
        } else { draft = null; }
        var d = Storage.getValue("pomodoroDay");
        var n = Storage.getValue("pomodoroCount");
        dailyDate = d == null ? "" : d;
        dailyPomodoros = n == null ? 0 : n;
        refreshDay();
        faceBb = readBodyBattery();
        lastFaceBbAt = now();
        sampleFaceHeart();
        timer = new Timer.Timer();
        timer.start(method(:tick), 1000, true);
    }
    function redraw() {
        // App-scoped touch handling: enabled only for list views; physical buttons remain active.
        if (!lastTouchMode.equals(mode)) {
            lastTouchMode=mode;
            try {
                if (WatchUi has :configureTouchEvents) {
                    WatchUi.configureTouchEvents({:enabled=>(mode.equals("today") || mode.equals("forecast") || mode.equals("shopping") || mode.equals("shopping-lists") || mode.equals("people") || mode.equals("person-detail"))});
                }
            } catch(ex) { }
        }
        WatchUi.requestUpdate();
    }
    function now() { return Time.now().value(); }
    function dateKey() {
        var d=Gregorian.info(Time.now(),Time.FORMAT_SHORT);
        return d.year.toString()+"-"+(d.month<10?"0":"")+d.month.toString()+"-"+(d.day<10?"0":"")+d.day.toString();
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
    function showHub() { mode = "hub"; hubIndex = 0; refreshDashboardIfStale(); redraw(); }
    function openHubItem() {
        if (hubIndex == 0) { mode = "select"; }
        else if (hubIndex == 1) { mode = "today"; agendaIndex=0; refreshDashboardIfStale(); }
        else if (hubIndex == 2) { mode = "forecast"; agendaIndex=0; refreshDashboardIfStale(); }
        else if (hubIndex == 3) { mode = "shopping-lists"; shoppingListIndex=0; refreshDashboardIfStale(); }
        else if (hubIndex == 4) { mode = "people"; peopleIndex=0; refreshDashboardIfStale(); }
        else if (hubIndex == 5) { mode = "select"; sync(false); return; }
        redraw();
    }
    function refreshDashboardIfStale() {
        if (SIMULATOR_DEMO) { return; }
        if (token != null && !waiting && now()-lastDashboardAttemptAt > 240 &&
           (!dashboardDay.equals(dateKey()) || now()-lastDashboardFetchAt>900)) { fetchDashboard(); }
    }
    function dashboardItems(key) {
        if (SIMULATOR_DEMO && demoDashboard!=null && demoDashboard.hasKey(key)) { return demoDashboard[key]; }
        if (dashboardCache==null || !dashboardDay.equals(dateKey()) ||
            !dashboardCache.hasKey(key) || dashboardCache[key]==null) { return []; }
        return dashboardCache[key];
    }
    function fetchDashboard() {
        if (SIMULATOR_DEMO) { return; }
        if (token == null) { return; }
        if (waiting) { return; }
        waiting=true; requestStartedAt=now();lastDashboardAttemptAt=now();
        var t=Gregorian.info(Time.now(),Time.FORMAT_SHORT);
        var mm=(t.month<10?"0":"")+t.month.toString();
        var dd=(t.day<10?"0":"")+t.day.toString();
        var day=t.year.toString()+"-"+mm+"-"+dd;
        var listParam=shoppingListId.length()>0?"&list="+shoppingListId:"";
        try {
            Communications.makeWebRequest(API+"/api/watch/dashboard?day="+day+listParam, {},
                {:method=>Communications.HTTP_REQUEST_METHOD_GET,
                 :headers=>{"Authorization"=>"Bearer "+token},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON},method(:dashboardDone));
        } catch(ex) { waiting=false;requestStartedAt=0;lastMessage="Offline - Cache";redraw(); }
    }
    function dashboardDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        if (!waiting) { return; }
        waiting=false;requestStartedAt=0;
        if (status==200 && data instanceof Lang.Dictionary && data.hasKey("today") &&
            data.hasKey("deadlines") && data.hasKey("shopping") && data.hasKey("events")) {
            dashboardCache=data;dashboardDay=dateKey();lastDashboardFetchAt=now();
            if (shoppingListId.length()==0 && data.hasKey("shoppingListId") && data["shoppingListId"]!=null) {
                shoppingListId=data["shoppingListId"];
            }
            try { Storage.setValue("watchDashboard0512",data);
                  Storage.setValue("watchDashboardDay0512",dashboardDay); } catch(ex) { }
            lastMessage="Tagesdaten bereit";
            if (shoppingQueue.size()>0) { flushShoppingQueue(); }
        } else if (status==404) { lastMessage="Worker-Update fehlt"; }
        else { lastMessage=status==401?"Bitte neu koppeln":"Offline - letzter Stand"; }
        redraw();
    }
    function chooseShoppingList() {
        var options=dashboardItems("shoppingLists");
        if (shoppingListIndex>=options.size() || shoppingQueue.size()>0) {
            lastMessage=shoppingQueue.size()>0?"Einkaeufe erst synchronisieren":"Keine aktive Liste";redraw();return;
        }
        var id=options[shoppingListIndex]["id"];
        shoppingListId=id;shoppingIndex=0;
        try {Storage.setValue("watchShoppingListId05124",id);}catch(ex){}
        mode="shopping";
        if (SIMULATOR_DEMO) {redraw();return;}
        dashboardDay="";lastDashboardFetchAt=0;fetchDashboard();redraw();
    }
    function openPerson() {
        if (peopleIndex>=dashboardItems("people").size()) {return;}
        peoplePointIndex=0;mode="person-detail";redraw();
    }
    function openPersonPoint() {
        var persons=dashboardItems("people");
        if (peopleIndex<0 || peopleIndex>=persons.size()) {return;}
        var person=persons[peopleIndex];
        if (person==null || !person.hasKey("points")) {return;}
        var points=person["points"];
        if (points==null || peoplePointIndex<0 || peoplePointIndex>=points.size()) {return;}
        // 0.5.12.5 Watch Bridge transmits point titles, not task IDs or dates.
        // Opening a point must never mark an unrelated Compass task as done.
        var point=points[peoplePointIndex];
        if (!(point instanceof Lang.String) || point.length()==0) {return;}
        personPointTitle=point;
        personPointName=person["name"]==null?"":person["name"].toString();
        personPointPosition=(peoplePointIndex+1).toString()+" / "+points.size().toString();
        detailOrigin="person-detail";
        detailOffset=0;
        mode="detail";
        redraw();
    }
    function toggleShopping() {
        if (SIMULATOR_DEMO) {
            var demo=dashboardItems("shopping");
            if (shoppingIndex < demo.size()) { demo[shoppingIndex]["checked"] = demo[shoppingIndex]["checked"] != true; }
            lastMessage="DEMO - nicht synchronisiert"; redraw(); return;
        }
        var list=dashboardItems("shopping");
        if (list.size()==0 || shoppingIndex>=list.size()) { return; }
        var task=list[shoppingIndex];
        if(shoppingQueue.size()>=30) {lastMessage="Zuerst synchronisieren";redraw();return;}
        var desired=task["checked"]!=true;
        task["checked"]=desired;
        var queued=false;
        for(var i=0;i<shoppingQueue.size();i++){
            if(shoppingQueue[i]["id"].equals(task["id"])) {
                shoppingQueue[i]["checked"]=desired;queued=true;break;
            }
        }
        if(!queued){ shoppingQueue.add({"id"=>task["id"],"version"=>task["version"],"checked"=>desired,"day"=>dateKey(),"listId"=>shoppingListId}); }
        try {Storage.setValue("watchShoppingQueue0512",shoppingQueue);
             Storage.setValue("watchDashboard0512",dashboardCache);}catch(ex){}
        lastMessage="Vorgemerkt";redraw();flushShoppingQueue();
    }
    function flushShoppingQueue() {
        if (SIMULATOR_DEMO) { return; }
        if (token==null||waiting||shoppingQueue.size()==0) { return; }
        waiting=true;shoppingSending=true;requestStartedAt=now();
        try {
            Communications.makeWebRequest(API+"/api/watch/shopping/toggle",shoppingQueue[0],
                {:method=>Communications.HTTP_REQUEST_METHOD_POST,
                 :headers=>{"Authorization"=>"Bearer "+token,"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON},method(:shoppingDone));
        }catch(ex){ waiting=false;shoppingSending=false;requestStartedAt=0;lastMessage="Liste offline";redraw(); }
    }
    function shoppingDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        if (!shoppingSending) {return;}
        waiting=false;shoppingSending=false;requestStartedAt=0;
        if(status==200 && data instanceof Lang.Dictionary && data.hasKey("version")){
            var synced=shoppingQueue[0];
            var list=dashboardItems("shopping");
            for(var i=0;i<list.size();i++){
                if(list[i]["id"].equals(synced["id"])) {list[i]["version"]=data["version"];break;}
            }
            shoppingQueue.remove(shoppingQueue[0]);
            try{Storage.setValue("watchShoppingQueue0512",shoppingQueue);
                Storage.setValue("watchDashboard0512",dashboardCache);}catch(ex){}
            lastMessage="Einkauf synchronisiert";
            if(shoppingQueue.size()>0){flushShoppingQueue();}
        }else if(status==409 || status==404){
            // Stale base versions are not silently overwritten; fetch current data.
            shoppingQueue.remove(shoppingQueue[0]);
            try {Storage.setValue("watchShoppingQueue0512",shoppingQueue);}catch(ex){}
            lastMessage="Konflikt - bitte neu abgleichen";
        }else{lastMessage="Einkauf vorgemerkt";}
        redraw();
    }
    // Shared button/touch list navigation. Never affects focus timers or exam modes.
    function bounded(v,lo,hi) {
        if (v<lo) { return lo; }
        if (v>hi) { return hi; }
        return v;
    }
    function scrollList(dir) {
        var count=0;
        if (mode.equals("shopping-lists")) {
            count=dashboardItems("shoppingLists").size();
            if (count>0) {shoppingListIndex=bounded(shoppingListIndex+dir,0,count-1);}
        } else if (mode.equals("people")) {
            count=dashboardItems("people").size();
            if (count>0) {peopleIndex=bounded(peopleIndex+dir,0,count-1);}
        } else if (mode.equals("person-detail")) {
            var persons=dashboardItems("people");
            if (peopleIndex<persons.size()) {var points=persons[peopleIndex]["points"];if(points!=null&&points.size()>0){peoplePointIndex=bounded(peoplePointIndex+dir,0,points.size()-1);}}
        } else if (mode.equals("shopping")) {
            count=dashboardItems("shopping").size();
            if (count>0) { shoppingIndex=bounded(shoppingIndex+dir,0,count-1); }
        } else if (mode.equals("today") || mode.equals("forecast")) {
            count=agendaItems().size();
            if (count>0) { agendaIndex=bounded(agendaIndex+dir,0,count-1); }
        }
        redraw();
    }
    function touchList(x,y) {
        if (x<22 || x>218) { return false; }
        if (mode.equals("shopping-lists")) {
            if(y<65 || y>218) {return false;}
            var opts=dashboardItems("shoppingLists"),slot=((y-72)/33).toNumber();
            var first=bounded(shoppingListIndex,0,bounded(opts.size()-5,0,opts.size()));
            var idx=first+slot;
            if(slot<0||slot>=5||idx>=opts.size()) {return false;}
            shoppingListIndex=idx;chooseShoppingList();return true;
        }
        if (mode.equals("people")) {
            if(y<65 || y>218) {return false;}
            var persons=dashboardItems("people"),first=bounded(peopleIndex,0,bounded(persons.size()-5,0,persons.size()));
            var slot=((y-72)/29).toNumber(),idx=first+slot;
            if(slot<0||slot>=5||idx>=persons.size()) {return false;}
            peopleIndex=idx;openPerson();return true;
        }
        if (mode.equals("person-detail")) {
            if (y<67 || y>=203) {return false;}
            var persons=dashboardItems("people");
            if (peopleIndex>=persons.size()) {return false;}
            var points=persons[peopleIndex]["points"];
            if (points==null) {return false;}
            var first=bounded(peoplePointIndex,0,bounded(points.size()-4,0,points.size()));
            var slot=((y-67)/34).toNumber(),idx=first+slot;
            if (slot<0 || slot>=4 || idx>=points.size()) {return false;}
            peoplePointIndex=idx;openPersonPoint();return true;
        }
        if (mode.equals("shopping")) {
            if (y<77 || y>217) { return false; }
            var rows=dashboardItems("shopping");
            var first=bounded(shoppingIndex,0,bounded(rows.size()-5,0,rows.size()));
            var slot=((y-77)/28).toNumber();
            var idx=first+slot;
            if (slot<0 || slot>=5 || idx>=rows.size()) { return false; }
            shoppingIndex=idx;toggleShopping();return true;
        }
        if (mode.equals("today")) {
            if (y<141 || y>206) { return false; }
            var tasks=agendaItems();
            var first=bounded(agendaIndex,0,bounded(tasks.size()-3,0,tasks.size()));
            var slot=((y-141)/22).toNumber();
            var idx=first+slot;
            if (slot<0 || slot>=3 || idx>=tasks.size()) { return false; }
            agendaIndex=idx;detailOrigin="today";detailOffset=0;mode="detail";redraw();return true;
        }
        if (mode.equals("forecast")) {
            if (y<86 || y>206) { return false; }
            var tasks=agendaItems();
            var first=bounded(agendaIndex,0,bounded(tasks.size()-3,0,tasks.size()));
            var slot=((y-86)/40).toNumber();
            var idx=first+slot;
            if (slot<0 || slot>=3 || idx>=tasks.size()) { return false; }
            agendaIndex=idx;detailOrigin="forecast";detailOffset=0;mode="detail";redraw();return true;
        }
        return false;
    }
    function chooseCategory(dir) {
        // Never accidentally switch the category of a saved pending session.
        if (draft != null) { lastMessage = "START: Fortsetzen"; redraw(); return; }
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
        if (draft != null) { resumeDraft(); return; }
        if (queue.size() >= 20) { lastMessage = "Speicher voll: Sync"; redraw(); return; }
        refreshDay();
        running = true; paused = false;
        activeSessionId = newWatchSessionId();
        sessionRevision = 0;
        startEpoch = now(); lastEpoch = startEpoch;
        focusSec = 0; breakSec = 0; totalSec = 0;
        pomodoros = 0; phase = "focus"; phaseSec = 0;
        examNextIndex = 0; examBannerIndex = 0; examBannerUntil = 0;
        hrPoints = []; bbPoints = []; hrLast = null;
        bbStart = readBodyBattery(); bbEnd = null;
        faceBb = bbStart;
        if (bbStart != null) { bbPoints.add([0, bbStart]); }
        mode = "running"; lastMessage = "";
        checkpoint();
        try { Sensor.setEnabledSensors([Sensor.SENSOR_HEARTRATE]); } catch(ex) { }
        redraw();
    }
    function tick() as Void {
        refreshDay();
        // An on-demand read, not a permanent background heart-rate listener.
        if (now()-lastFaceHrAttemptAt>=15) { sampleFaceHeart(); }
        // Only a periodic sensor history query outside sessions.
        if (!running && now()-lastFaceBbAt>=300) {
            faceBb = readBodyBattery();
            lastFaceBbAt = now();
        }
        // Morning Sync: once per local day, then refresh on demand.
        if (!SIMULATOR_DEMO && token!=null && !waiting && !running && shoppingQueue.size()==0 &&
            !mode.equals("pairing") && (lastDashboardAttemptAt==0 ||
            (!dashboardDay.equals(dateKey()) && now()-lastDashboardAttemptAt>300))) {
            fetchDashboard();
        }
        if (!SIMULATOR_DEMO && !waiting && shoppingQueue.size()>0 && token!=null &&
            (lastAutoSyncAt==0 || now()-lastAutoSyncAt>300)) {
            lastAutoSyncAt=now();flushShoppingQueue();
        }
        // If a previous automatic upload was interrupted (app closed/offline),
        // retry pending locally saved sessions while the app is foregrounded.
        // Never send an uncompleted Resume Later draft.
        if (!SIMULATOR_DEMO && !waiting && token != null &&
            (queue.size() > 0 || pendingCheckpoint != null) &&
            !mode.equals("pairing") && (lastAutoSyncAt==0 || now()-lastAutoSyncAt>=300)) {
            sync(true);
        }
        if (waiting && requestStartedAt > 0 && now() - requestStartedAt > 15) {
            waiting = false;
            requestStartedAt = 0;
            backgroundSync=false;
            if (mode.equals("syncing")) { mode = "select"; }
            lastMessage = "Offline - später erneut";
        }
        if (mode.equals("running") && running && !paused &&
            !phase.equals("focus-due") && !phase.equals("break-due")) {
            var t = now();
            var delta = t - lastEpoch;
            if (delta < 0 || (index != EXAM_CATEGORY && delta > 5)) {
                lastEpoch = t; redraw(); return;
            }
            lastEpoch = t;
            if (index == EXAM_CATEGORY) {
                // A single elapsed-time clock drives all four announcements.
                // A slow tick can cross a milestone; announce the latest one
                // once rather than playing multiple vibrations in a burst.
                var remaining = EXAM_TOTAL_SEC-totalSec;
                if (remaining < 0) { remaining = 0; }
                if (delta > remaining) { delta = remaining; }
                totalSec += delta;
                var notified = false;
                while (examNextIndex < EXAM_MARKS.size() &&
                    totalSec >= EXAM_MARKS[examNextIndex]) {
                    examNextIndex++;
                    notified = true;
                }
                if (notified) {
                    examBannerIndex = examNextIndex;
                    examBannerUntil = now()+60;
                    if (examNextIndex == 4) { paused = true; }
                    checkpoint(); // Save delivered milestones BEFORE vibration.
                    alert();
                }
                if (t-lastCheckpointEpoch >= 30) { checkpoint(); }
                redraw();
                return;
            }
            totalSec += delta;
            if (phase.equals("break")) { breakSec += delta; }
            else { focusSec += delta; }
            phaseSec += delta;
            if (delta > 0 && totalSec % 30 == 0) { sampleHeartRate(); }
            // Lightweight crash recovery, at most once per minute while active.
            if (t-lastCheckpointEpoch>=60) { checkpoint(); }
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
                checkpoint();
                // Persist first, then upload. No double counting after retries.
                queueFocusCheckpoint();
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
    // Only display a recent, actually supplied sensor reading. On watch-app
    // start Sensor.getInfo() may have no HR until the device exposes a value.
    function sampleFaceHeart() {
        lastFaceHrAttemptAt = now();
        try {
            var sample = Sensor.getInfo();
            if (sample != null && sample.heartRate != null) {
                var bpm = sample.heartRate.toNumber();
                if (bpm >= 35 && bpm <= 230) {
                    faceHr = bpm;
                    faceHrMeasuredAt = now();
                    return;
                }
            }
        } catch(ex) { }
        if (faceHrMeasuredAt == 0 || now()-faceHrMeasuredAt > 75) { faceHr = null; }
    }
    function sampleHeartRate() {
        try {
            var info = Sensor.getInfo();
            if (info != null && info.heartRate != null) {
                hrLast = info.heartRate;
                faceHr = hrLast; faceHrMeasuredAt = now();
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
        if (index == EXAM_CATEGORY && examNextIndex == 4) {
            // Exam is over; only Save, Resume Later or Exit are meaningful.
            lastMessage = "Prüfung beendet – Speichern";
            redraw();
            return;
        }
        if (pomodoro && phase.equals("focus-due")) {
            phase = "break"; phaseSec = 0; paused = false;
        } else if (pomodoro && phase.equals("break-due")) {
            phase = "focus"; phaseSec = 0; paused = false;
        } else {
            paused = !paused;
        }
        lastEpoch = now(); checkpoint(); redraw();
    }
    function openMenu() {
        if (!running) { return; }
        menuPriorPaused = paused;
        paused = true; menuIndex = 0; mode = "session-menu";
        lastEpoch = now(); checkpoint(); redraw();
    }
    function closeMenu() {
        mode = "running";
        paused = menuPriorPaused;
        lastEpoch = now(); redraw();
    }
    function menuAction() {
        if (menuIndex == 0) { // Resume
            mode = "running";
            paused = (index == EXAM_CATEGORY && examNextIndex == 4);
            lastEpoch = now(); checkpoint();
        } else if (menuIndex == 1) { // Save -> durable local queue, then sync
            finish(); return;
        } else if (menuIndex == 2) { // Resume Later -> checkpoint, not a completed activity
            suspendSession(); return;
        } else if (menuIndex == 3) { // Discard is deliberately confirmed
            mode = "discard-confirm"; discardChoice = 0;
        } else if (menuIndex == 4) { // Exit the watch app without losing progress
            if (!suspendSession()) { return; }
            System.exit(); return;
        }
        redraw();
    }
    function newWatchSessionId() {
        var raw = Cryptography.randomBytes(16); var hex = "";
        for (var i = 0; i < raw.size(); i++) { hex += raw[i].format("%02x"); }
        return "w"+hex;
    }
    function snapshot(finalized) {
        if (activeSessionId == null) { activeSessionId = newWatchSessionId(); }
        return {"id"=>activeSessionId,"revision"=>sessionRevision,"finalized"=>finalized,
            "activity"=>IDS[index],"startedAt"=>startEpoch,
            "durationSec"=>totalSec,"focusSec"=>focusSec,"breakSec"=>breakSec,
            "pomodoros"=>pomodoros,"hrSamples"=>hrPoints,"bbSamples"=>bbPoints,
            "bbStart"=>bbStart,"bbEnd"=>bbEnd};
    }
    function queueFocusCheckpoint() {
        if (totalSec <= 0) { return; }
        if (pendingCheckpoint != null && activeSessionId != null &&
            !pendingCheckpoint["id"].equals(activeSessionId)) {
            // Preserve a previous offline draft rather than overwrite it.
            lastMessage="Älterer Sync ausstehend"; return;
        }
        sessionRevision += 1;
        var item = snapshot(false);
        try {
            Storage.setValue("focusCheckpoint057127",item);
            pendingCheckpoint=item;
            checkpoint();
        } catch(ex) { lastMessage="Zwischenstand nur als Entwurf"; return; }
        if (token != null && !waiting && !SIMULATOR_DEMO) { sync(true); }
    }
    // Serialize only values supported by Application.Storage.  No bitmap/date objects.
    function checkpoint() {
        if (!running) { return true; }
        var item = {"index"=>index,"startEpoch"=>startEpoch,
            "focusSec"=>focusSec,"breakSec"=>breakSec,"totalSec"=>totalSec,
            "pomodoros"=>pomodoros,"phase"=>phase,"phaseSec"=>phaseSec,
            "sessionId"=>activeSessionId,"sessionRevision"=>sessionRevision,
            "hrPoints"=>hrPoints,"bbPoints"=>bbPoints,"hrLast"=>hrLast,
            "bbStart"=>bbStart,
            "examSession"=>(index == EXAM_CATEGORY),
            "examNextIndex"=>examNextIndex,
            "examBannerIndex"=>examBannerIndex,
            "examBannerUntil"=>examBannerUntil};
        try {
            Storage.setValue("activeDraft052",item);
            draft=item;
            lastCheckpointEpoch=now();
            return true;
        } catch(ex) {
            lastMessage="Speicher voll - bitte prüfen";
            return false;
        }
    }
    function clearDraft() {
        draft=null;
        try { Storage.deleteValue("activeDraft052"); } catch(ex) { }
    }
    function suspendSession() {
        if (!running) { return draft != null; }
        paused = true;
        if (!checkpoint()) { redraw(); return false; }
        running = false; mode = "select";
        lastMessage = "▶ Session fortsetzen";
        try { Sensor.setEnabledSensors([]); } catch(ex) { }
        redraw(); return true;
    }
    function resumeDraft() {
        if (draft == null || !draft.hasKey("index")) { return; }
        var d=draft;
        index=d["index"];
        pomodoro=DEFAULT_POMODORO[index];
        activeSessionId=d.hasKey("sessionId") ? d["sessionId"] : newWatchSessionId();
        sessionRevision=d.hasKey("sessionRevision") ? d["sessionRevision"] : 0;
        startEpoch=d["startEpoch"];focusSec=d["focusSec"];
        breakSec=d["breakSec"];totalSec=d["totalSec"];
        pomodoros=d["pomodoros"];phase=d["phase"];phaseSec=d["phaseSec"];
        hrPoints=d["hrPoints"];bbPoints=d["bbPoints"];
        hrLast=d["hrLast"];bbStart=d["bbStart"];
        examNextIndex=d.hasKey("examNextIndex") ? d["examNextIndex"] : 0;
        examBannerIndex=d.hasKey("examBannerIndex") ? d["examBannerIndex"] : 0;
        examBannerUntil=d.hasKey("examBannerUntil") ? d["examBannerUntil"] : 0;
        running=true; paused=true; mode="running";
        lastEpoch=now();lastMessage="PAUSIERT";
        try { Sensor.setEnabledSensors([Sensor.SENSOR_HEARTRATE]); } catch(ex) { }
        redraw();
    }
    function discardSession() {
        // If checkpoints reached the server, a durable tombstone is required.
        // Queue cancellation even while offline, then resume normal syncing.
        if (running && totalSec>0 && queue.size()<20) {
            sessionRevision+=1;
            var cancelled=snapshot(true);
            cancelled["cancelled"]=true;
            queue.add(cancelled);
            try { Storage.setValue("sessions",queue); }
            catch(ex) { queue.remove(cancelled);lastMessage="Löschen später erneut versuchen";redraw();return; }
            if (pendingCheckpoint!=null && pendingCheckpoint["id"].equals(activeSessionId)) {
                pendingCheckpoint=null;
                try { Storage.deleteValue("focusCheckpoint057127"); } catch(ex) { }
            }
        } else if (running && totalSec>0 && queue.size()>=20) {
            lastMessage="Zuerst Sessions synchronisieren";redraw();return;
        }
        running=false;paused=false;mode="select";
        clearDraft();
        hrPoints=[];bbPoints=[];
        if (index == EXAM_CATEGORY) {
            totalSec=0; examNextIndex=0; examBannerIndex=0; examBannerUntil=0;
        }
        lastMessage="Session verworfen";
        try { Sensor.setEnabledSensors([]); } catch(ex) { }
        redraw();
        if (token!=null && !waiting && queue.size()>0) { sync(true); }
    }
    function finish() {
        if (!running) { return; }
        sampleHeartRate(); bbEnd = readBodyBattery();
        if (bbEnd != null && bbPoints.size() < 72) { bbPoints.add([totalSec, bbEnd]); }
        sessionRevision += 1;
        var item = snapshot(true);
        if (totalSec > 0) {
            if (queue.size() >= 20) {
                lastMessage="Speicher voll - bitte synchronisieren";
                paused=true;mode="session-menu";redraw();return;
            }
            queue.add(item);
            try { Storage.setValue("sessions",queue); }
            catch(ex) {
                queue.remove(item);
                lastMessage="Speichern fehlgeschlagen - Session erhalten";
                paused=true;mode="session-menu";redraw();return;
            }
        }
        // A successfully persisted final session supersedes a pending partial.
        var hasSavedDuration = totalSec > 0;
        if (hasSavedDuration && pendingCheckpoint != null &&
            pendingCheckpoint["id"].equals(item["id"])) {
            pendingCheckpoint=null;
            try { Storage.deleteValue("focusCheckpoint057127"); } catch(ex) { }
        }
        clearDraft();
        running = false; paused = false; mode = "select";
        lastMessage=hasSavedDuration ? "Lokal gesichert" : "Keine Aktivität erfasst";
        if (index == EXAM_CATEGORY) {
            // The next exam must always preview a fresh 60/30-minute session.
            totalSec=0; examNextIndex=0; examBannerIndex=0; examBannerUntil=0;
        }
        try { Sensor.setEnabledSensors([]); } catch(ex) { }
        redraw();
        // Network is a best-effort follow-up; a failed request never removes
        // the locally queued activity.  The user need not press BACK to sync.
        if (hasSavedDuration && token != null && !waiting) { sync(true); }
    }
    function onExit() {
        // OS-driven exits must NOT silently mark a partial activity completed.
        // A best-effort partial upload may not finish after process termination.
        if (running) { paused=true;checkpoint();queueFocusCheckpoint(); }
        else if (token != null && !waiting &&
            (queue.size()>0 || pendingCheckpoint!=null)) { sync(true); }
        try { Sensor.setEnabledSensors([]); } catch(ex) { }
    }
    function enterPair() { if (SIMULATOR_DEMO) { lastMessage="DEMO - offline"; redraw(); return; } mode = "pairing"; code = "00000000"; digit = 0; lastMessage = ""; redraw(); }
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
        if (SIMULATOR_DEMO) { lastMessage="DEMO - keine Kopplung"; mode="hub"; redraw(); return; }
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
            fetchDashboard(); return;
        } else { lastMessage = "Kopplung fehlgeschlagen"; }
        redraw();
    }
    function sync(quiet) {
        if (SIMULATOR_DEMO) { lastMessage="DEMO - kein Cloudflare"; mode="hub"; redraw(); return; }
        if (token == null) { enterPair(); return; }
        if (waiting) { return; }
        if (queue.size()==0 && pendingCheckpoint==null) { if (!quiet) { fetchDashboard(); } return; }
        // Final records take precedence over partial snapshots.
        var isFinal=queue.size()>0;
        var item=isFinal ? queue[0] : pendingCheckpoint;
        syncSentType=isFinal ? "final" : "checkpoint";
        syncSentId=item["id"];
        syncSentRevision=item.hasKey("revision") ? item["revision"] : 0;
        waiting = true; requestStartedAt = now();
        backgroundSync=quiet;
        if (quiet) { lastAutoSyncAt=now(); }
        if (!quiet) { mode="syncing"; }
        lastMessage = quiet ? "Gesichert · Sync läuft" : "Übertrage ...";
        redraw();
        try {
            Communications.makeWebRequest(API+"/api/watch/sessions", item,
                {:method=>Communications.HTTP_REQUEST_METHOD_POST,
                 :headers=>{"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON,
                     "Authorization"=>"Bearer "+token},
                 :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON}, method(:syncDone));
        } catch(ex) { waiting = false; requestStartedAt = 0;
            backgroundSync=false;syncSentType="";
            if (!quiet) { mode = "select"; }
            lastMessage = "Gesichert - Sync später"; redraw(); }
    }
    function syncDone(status as Lang.Number, data as Lang.Dictionary or Lang.String or PersistedContent.Iterator or Null) as Void {
        if (!waiting) { return; }
        var onscreen = mode.equals("syncing");
        waiting = false; requestStartedAt = 0;
        if (onscreen) { mode = "select"; }
        var wasBackground=backgroundSync;
        backgroundSync=false;
        if (status == 200 && data instanceof Lang.Dictionary && data["ok"] == true) {
            // Clear ONLY the acknowledged revision; a newer pending snapshot stays.
            if (syncSentType.equals("final") && queue.size() > 0 &&
                queue[0]["id"].equals(syncSentId)) {
                queue.remove(queue[0]); Storage.setValue("sessions", queue);
            } else if (syncSentType.equals("checkpoint") && pendingCheckpoint != null &&
                pendingCheckpoint["id"].equals(syncSentId) &&
                pendingCheckpoint["revision"]==syncSentRevision) {
                pendingCheckpoint=null;
                try { Storage.deleteValue("focusCheckpoint057127"); } catch(ex) { }
            }
            lastMessage = "Sync OK";
            // Never re-enter SYNC from an asynchronous callback after BACK.
            // Such a callback must not interrupt a running focus timer.
            syncSentType="";
            if (onscreen) {
                if (queue.size()>0 || pendingCheckpoint!=null) { sync(false); return; }
                fetchPlanning(); return;
            }
            if (wasBackground && (queue.size()>0 || pendingCheckpoint!=null)) {
                sync(true); return;
            }
        } else { lastMessage = status == 401 ? "Bitte neu koppeln" : "Offline: später Sync"; }
        syncSentType="";
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
        if (SIMULATOR_DEMO) {
            return dashboardItems((mode.equals("forecast") ||
                (mode.equals("detail") && detailOrigin.equals("forecast"))) ? "deadlines" : "today");
        }
        var sourceMode = mode.equals("detail") ? detailOrigin : mode;
        var key = sourceMode.equals("forecast") ? "deadlines" : "today";
        if (dashboardCache != null && dashboardDay.equals(dateKey())) {return dashboardItems(key);}
        if (planningCache==null || !planningCache.hasKey(key)) {return [];}
        var value=planningCache[key];return value==null?[]:value;
    }
}

class CompassView extends WatchUi.View {
    const BG = 0x000000;
    const NAVY = 0x000011; // near-black midnight navy; blue 0x000055 was too saturated on the 64-color MIP
    const WHITE = 0xF4F6F4;
    const MUTED = 0x9AADB2;
    const TRACK = 0x20383D;
    const AQUA = 0x70C8CC;
    const TOMATO = 0xE65B50; // Recognizable red, never activity-colored
    const GOLD = 0xAA8855; // muted champagne-gold progress and hands
    const PALE_GOLD = 0xFFEECC; // soft ivory with warm metal reflection
    const DIAL_CHARCOAL = 0x555555;
    const EXAM_BURGUNDY = 0xAA0055;
    var model;
    // Resources are loaded once per View, never once per clock tick.
    // Renderer only: timer, milestones, storage and network logic remain 0.5.7.
    var premiumBase = null;
    var premiumBaseIndex = -1;
    var premiumDigits = null;
    var premiumDigitsSmall = null;
    var premiumCategory = null;
    var premiumCategoryIndex = -1;
    var premiumTomato = null;
    var premiumStopwatch = null;
    var premiumHeart = null;
    var premiumBell = null;
    var premiumHourglass = null;
    var premiumGem = null;
    var uiBackdrop = null;
    var uiBackdropMode = "";
    var uiFontTiny = null;
    var uiFontMenu = null;
    var uiIconCache = {};
    function initialize(m) {
        View.initialize(); model = m;
        // Background is loaded lazily for the selected category, not all eight at once.
        premiumBase = null; premiumBaseIndex = -1;
        try { premiumDigits = WatchUi.loadResource(Rez.Fonts.ChronoDigitsLarge); } catch(e) { }
        try { premiumDigitsSmall = WatchUi.loadResource(Rez.Fonts.ChronoDigitsSmall); } catch(e) { }
        try { premiumTomato = WatchUi.loadResource(Rez.Drawables.Chrono_Tomato); } catch(e) { }
        try { premiumStopwatch = WatchUi.loadResource(Rez.Drawables.Chrono_Stopwatch); } catch(e) { }
        try { premiumHeart = WatchUi.loadResource(Rez.Drawables.Chrono_Heart); } catch(e) { }
        try { premiumBell = WatchUi.loadResource(Rez.Drawables.Chrono_Bell); } catch(e) { }
        try { premiumHourglass = WatchUi.loadResource(Rez.Drawables.Chrono_Hourglass); } catch(e) { }
        try { premiumGem = WatchUi.loadResource(Rez.Drawables.Chrono_Gem); } catch(e) { }
        // UI atlases are loaded lazily; do not retain two full-size dial bitmaps.
    }
    // Eight prequantized scenic bitmaps; each loaded only when selected.
    // The data/hand overlays are still live Connect-IQ drawing calls.
    function bounded(v,lo,hi) {
        if (v<lo) { return lo; }
        if (v>hi) { return hi; }
        return v;
    }
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
    // Eight DIFFERENT silhouettes, on a gold foundation with a colored detail.
    // Meeting: people; Lehre: mortarboard; Korrektur: checklist;
    // Exam supervision: burgundy mortarboard; Verwaltung: briefcase; Familie: house.
    function categoryIcon(dc,x,y,r) {
        var c=GOLD;
        pen(dc,0x000000);dc.fillCircle(x,y,r);
        pen(dc,DIAL_CHARCOAL);dc.drawCircle(x,y,r);
        dc.setPenWidth(2);
        var i=model.index;
        if(i==0) { // Forschung: magnifying glass
            pen(dc,c);dc.drawCircle(x-3,y-3,6);dc.drawLine(x+2,y+2,x+9,y+9);
        } else if(i==1) { // Lehre: graduation cap
            pen(dc,c);dc.drawLine(x-12,y-3,x,y-9);dc.drawLine(x,y-9,x+12,y-3);
            dc.drawLine(x-12,y-3,x,y+3);dc.drawLine(x,y+3,x+12,y-3);
            dc.drawLine(x-6,y+4,x-6,y+8);dc.drawLine(x-6,y+8,x+6,y+8);
            dc.drawLine(x+11,y-2,x+11,y+6);
        } else if(i==2) { // Prüfung: clipboard / check
            pen(dc,c);dc.drawRectangle(x-8,y-9,16,20);
            dc.drawLine(x-4,y-5,x+4,y-5);
            dc.drawLine(x-5,y+2,x-1,y+6);dc.drawLine(x-1,y+6,x+6,y-3);
        } else if(i==3) { // Verwaltung: briefcase
            pen(dc,c);dc.drawRectangle(x-11,y-3,22,14);
            dc.drawLine(x-5,y-4,x-5,y-8);dc.drawLine(x-5,y-8,x+5,y-8);
            dc.drawLine(x+5,y-8,x+5,y-4);dc.drawLine(x-10,y+3,x+10,y+3);
        } else if(i==4) { // Meeting: participants
            pen(dc,c);dc.drawCircle(x-5,y-5,4);dc.drawCircle(x+5,y-5,4);
            dc.drawLine(x-11,y+9,x-10,y+1);dc.drawLine(x-10,y+1,x-2,y+1);
            dc.drawLine(x+2,y+1,x+10,y+1);dc.drawLine(x+10,y+1,x+11,y+9);
            dc.drawLine(x-11,y+9,x+11,y+9);
        } else if(i==5) { // Weiterbildung: open book
            pen(dc,c);dc.drawLine(x,y-7,x,y+9);
            dc.drawLine(x-10,y-8,x-10,y+7);dc.drawLine(x+10,y-8,x+10,y+7);
            dc.drawLine(x-10,y-8,x-1,y-5);dc.drawLine(x+1,y-5,x+10,y-8);
            dc.drawLine(x-10,y+7,x-1,y+9);dc.drawLine(x+1,y+9,x+10,y+7);
        } else if(i==6) { // Familie: house with two people
            pen(dc,c);dc.drawLine(x-11,y-2,x,y-11);dc.drawLine(x,y-11,x+11,y-2);
            dc.drawLine(x-8,y-4,x-8,y+10);dc.drawLine(x+8,y-4,x+8,y+10);
            dc.drawLine(x-8,y+10,x+8,y+10);
            dc.fillCircle(x-3,y+1,2);dc.fillCircle(x+3,y+1,2);
        } else { // Rare exam-supervision mode: burgundy graduation cap.
            pen(dc,EXAM_BURGUNDY);dc.fillCircle(x,y,r-2);
            pen(dc,GOLD);
            dc.drawLine(x-12,y-3,x,y-9);dc.drawLine(x,y-9,x+12,y-3);
            dc.drawLine(x-12,y-3,x,y+3);dc.drawLine(x,y+3,x+12,y-3);
            dc.drawLine(x-6,y+4,x-6,y+8);dc.drawLine(x-6,y+8,x+6,y+8);
            dc.drawLine(x+11,y-2,x+11,y+6);
        }
        dc.setPenWidth(1);
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
        pen(dc,DIAL_CHARCOAL);dc.setPenWidth(1);
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

    // --- Compass Chrono 0.5.4: minimalist navy, crisp data and hands in front ---
    // This is the foreground of the existing watch APP, not a system watchface.
    function dialLine(dc,x1,y1,x2,y2,col,width) {
        pen(dc,col); dc.setPenWidth(width);
        dc.drawLine(x1,y1,x2,y2); dc.setPenWidth(1);
    }
    function polarX(cx,degrees,radius) {
        return (cx + Math.sin(degrees*Math.PI/180.0)*radius).toNumber();
    }
    function polarY(cy,degrees,radius) {
        return (cy - Math.cos(degrees*Math.PI/180.0)*radius).toNumber();
    }
    function hand(dc,cx,cy,degrees,length,width) {
        // Slim gilt-and-silver hands. At 240 pixels a broad outlined shaft
        // looks cartoonish; use 1..4-pixel strokes with a narrow pointed tip.
        var tipX=polarX(cx,degrees,length), tipY=polarY(cy,degrees,length);
        var shoulderX=polarX(cx,degrees,length-9),shoulderY=polarY(cy,degrees,length-9);
        var tailX=polarX(cx,degrees+180,7),tailY=polarY(cy,degrees+180,7);
        dialLine(dc,tailX+1,tailY+1,shoulderX+1,shoulderY+1,0x000000,width+2);
        dialLine(dc,tailX,tailY,shoulderX,shoulderY,GOLD,width);
        dialLine(dc,cx,cy,shoulderX,shoulderY,PALE_GOLD,1);
        dialLine(dc,shoulderX,shoulderY,tipX,tipY,GOLD,1);
    }
    function dialBackground(dc) {
        pen(dc,0x000000);dc.clear();
        var cx=dc.getWidth()/2,cy=dc.getHeight()/2;
        pen(dc,NAVY);dc.fillCircle(cx,cy,106);
        pen(dc,0x555555);dc.drawCircle(cx,cy,107);
        // Subtle metal hour marks; never draw a bright perimeter neon ring.
        for(var i=0;i<60;i++) {
            var deg=i*6,major=(i%5==0);
            var inner=major?95:104,outer=major?104:105;
            dialLine(dc,polarX(cx,deg,inner),polarY(cy,deg,inner),
                polarX(cx,deg,outer),polarY(cy,deg,outer),
                major?0xAAAA55:0x555555,major?2:1);
        }
    }
    function clockHands(dc,cx,cy) {
        var t=Gregorian.info(Time.now(),Time.FORMAT_SHORT);
        var seconds=t.sec, minutes=t.min+seconds/60.0;
        var hours=(t.hour%12)+minutes/60.0;
        hand(dc,cx,cy,hours*30,52,4);
        hand(dc,cx,cy,minutes*6,77,3);
        // Behind the subdials; the long seconds hand cannot hide a countdown.
        var angle=seconds*6;
        dialLine(dc,polarX(cx,angle+180,12),polarY(cy,angle+180,12),
            polarX(cx,angle,86),polarY(cy,angle,86),PALE_GOLD,1);
        pen(dc,0x000000);dc.fillCircle(cx,cy,5);
        pen(dc,GOLD);dc.fillCircle(cx,cy,3);
        pen(dc,0xFFFFFF);dc.fillCircle(cx,cy,1);
    }
    function chronographDial(dc,x,y,r) {
        // Draw BEFORE the hands. Text is drawn in the final foreground pass.
        pen(dc,0x000000);dc.fillCircle(x,y,r-1);
        pen(dc,0xAAAA55);dc.drawCircle(x,y,r);
        pen(dc,0x555555);dc.drawCircle(x,y,r-3);
    }
    function chronoLogo(dc,cx) {
        // Clear category-only glyph: no brand text and no bright neon halo.
        categoryIcon(dc,cx,43,19);
    }
    // Left register: actual daily count, one outlined mini-diamond for each
    // completed four Pomodoros, up to four badges (16 Pomodoros) on this screen.
    function pomodoroCountRegister(dc,x,y) {
        chronographDial(dc,x,y,34);
        var progress=model.dailyPomodoros%4;
        // Segment indicator represents progress into the CURRENT four-block.
        for(var j=0;j<4;j++) {
            var color=j<progress?GOLD:0x555555;
            for(var tick=0;tick<12;tick++) {
                var a=j*90+tick*7.5;
                dialLine(dc,polarX(x,a,29),polarY(y,a,29),
                    polarX(x,a,33),polarY(y,a,33),color,j<progress?2:1);
            }
        }
    }
    function miniDiamond(dc,x,y) {
        // Preserve the 0.5.3 DEMO14 small-outline diamond geometry.
        pen(dc,GOLD);
        dc.drawLine(x-4,y-2,x-2,y-5);dc.drawLine(x-2,y-5,x+2,y-5);
        dc.drawLine(x+2,y-5,x+4,y-2);dc.drawLine(x+4,y-2,x,y+4);
        dc.drawLine(x,y+4,x-4,y-2);dc.drawLine(x-4,y-2,x+4,y-2);
    }
    function pomodoroCountReadout(dc,x,y) {
        var n=model.dailyPomodoros;
        var badges=((n-(n%4))/4).toNumber();
        if(badges>4) { badges=4; }
        if(badges>0) {
            // Four 8px gems separated by at least 3px, no text multiplier.
            for(var i=0;i<badges;i++) {
                miniDiamond(dc,x-18+i*12,y-14);
            }
            centeredAt(dc,x,y+12,n.toString(),WHITE,Graphics.FONT_SMALL,53);
        } else {
            centeredAt(dc,x,y+3,n.toString(),WHITE,Graphics.FONT_SMALL,53);
        }
    }
    function currentBodyBattery() {
        var bb=model.faceBb;
        if(model.running) {
            bb=model.bbStart;
            if(model.bbPoints.size()>0) { bb=model.bbPoints[model.bbPoints.size()-1][1]; }
        }
        return bb;
    }
    // Outer circle = Garmin Body Battery 0..100, independent of live HR.
    // No synthesized Body Battery when the API has no current value.
    function bodyBatteryRing(dc,x,y) {
        chronographDial(dc,x,y,34);
        var bb=currentBodyBattery();
        var valid=bb!=null && bb>=0 && bb<=100;
        for(var k=0;k<48;k++) {
            var color=valid && k<bb*48/100.0 ? 0xAAAA55 : 0x555555;
            var angle=k*7.5;
            dialLine(dc,polarX(x,angle,29),polarY(y,angle,29),
                polarX(x,angle,33),polarY(y,angle,33),color,2);
        }
    }
    function bodyBatteryReadout(dc,x,y) {
        // The RING shows Garmin Body Battery, while the INSIDE always shows HR.
        // Simulator and some devices may provide no recent HR: display --, never
        // substitute the body-battery percentage as though it were the pulse.
        heart(dc,x,y-12);
        var hr="--";
        if(model.faceHr!=null && model.faceHrMeasuredAt>0 &&
            model.now()-model.faceHrMeasuredAt<=75) {
            hr=model.faceHr.toString();
        }
        centeredAt(dc,x,y+11,hr,WHITE,Graphics.FONT_SMALL,53);
    }
    function chronoPomodoro(dc,cx,y) {
        // The exam has its own three-dial renderer, not this timer.
        if (model.index == model.EXAM_CATEGORY) { return; }
        var r=37;
        chronographDial(dc,cx,y,r);
        var active=model.mode.equals("running");
        var remaining=0,elapsed=0,duration=1500;
        if(model.pomodoro) {
            duration=active?model.phaseDuration():1500;
            elapsed=active?model.phaseSec:0;
            remaining=duration-elapsed;
        } else if(active) { remaining=model.totalSec; }
        if(remaining<0) { remaining=0; }
        if(elapsed>duration) { elapsed=duration; }
        // Gold rather than bright cyan. The larger circular dial makes the
        // tomato and real 25-minute countdown legible on the fēnix 7S.
        for (var k=0;k<36;k++) {
            var done=active&&model.pomodoro&&(k*duration<elapsed*36);
            var col=done?GOLD:DIAL_CHARCOAL;
            var angle=k*10;
            dialLine(dc,polarX(cx,angle,32),polarY(y,angle,32),
                polarX(cx,angle,36),polarY(y,angle,36),col,done?2:1);
        }
    }
    function chronoPomodoroReadout(dc,cx,y) {
        if (model.index == model.EXAM_CATEGORY) { return; }
        var active=model.mode.equals("running");
        var remaining=0;
        if(model.pomodoro) {
            remaining=(active?model.phaseDuration():1500)-(active?model.phaseSec:0);
        } else if(active) { remaining=model.totalSec; }
        if(remaining<0) { remaining=0; }
        // Only actual focus cycles use the tomato. A meeting/family/lecture
        // counter displays a stopwatch icon instead, without time limit.
        if (model.pomodoro) {
            tomato(dc,cx,y-14);
        } else {
            pen(dc,PALE_GOLD);
            dc.setPenWidth(1);
            dc.drawCircle(cx,y-14,6);
            dc.drawLine(cx,y-21,cx,y-23);
            dc.drawLine(cx-3,y-23,cx+3,y-23);
            dc.drawLine(cx,y-14,cx,y-18);
            dc.drawLine(cx,y-14,cx+3,y-12);
        }
        var timeText=pad((remaining/60).toNumber())+":"+pad(remaining%60);
        if(remaining>=3600) { timeText=(remaining/3600).toNumber().toString()+":"+pad(((remaining%3600)/60).toNumber()); }
        centeredAt(dc,cx,y+12,timeText,WHITE,Graphics.FONT_SMALL,67);
        if(active&&model.paused) {
            pen(dc,0xAAAA55);dc.fillRectangle(cx+17,y-19,2,8);
            dc.fillRectangle(cx+21,y-19,2,8);
        }
    }
    function chronoSmallDials(dc,cx) {
        var y=128;
        pomodoroCountRegister(dc,cx-54,y);
        bodyBatteryRing(dc,cx+54,y);
        chronoPomodoro(dc,cx,181);
    }
    function chronoReadouts(dc,cx) {
        // The hands sit ABOVE subdial surfaces, with critical text/gems readable.
        pomodoroCountReadout(dc,cx-54,128);
        bodyBatteryReadout(dc,cx+54,128);
        chronoPomodoroReadout(dc,cx,181);
    }
    function centeredAt(dc,x,y,s,color,font,maxW) {
        drawTxt(dc,x,y,s,font,color,maxW);
    }
    function chronoCategoryLabel() {
        if(model.index==4) { return "Meeting"; }
        if(model.index==2) { return "Prüfung"; }
        return model.LABELS[model.index];
    }
    // --- 0.5.6: Examination supervision, inside CompassWatch (not a new app) ---
    function examRemaining() {
        var sec=model.EXAM_TOTAL_SEC-model.totalSec;
        if (sec<0) { sec=0; }
        return sec;
    }
    function examNextRemaining() {
        if (model.examNextIndex >= 4) { return 0; }
        var sec=model.EXAM_MARKS[model.examNextIndex]-model.totalSec;
        return sec<0 ? 0 : sec;
    }
    function examTime(sec) {
        if (sec<0) { sec=0; }
        return pad((sec/60).toNumber())+":"+pad(sec%60);
    }
    function examProgressRing(dc,x,y,r,remaining,total) {
        chronographDial(dc,x,y,r);
        if (total<=0) { total=1; }
        var portion=remaining*36/total;
        for (var k=0;k<36;k++) {
            var a=k*10;
            var col=k<portion?GOLD:0x555555;
            dialLine(dc,polarX(x,a,r-6),polarY(y,a,r-6),
                polarX(x,a,r-2),polarY(y,a,r-2),col,k<portion?2:1);
        }
    }
    // Compact geometry-first exam registers: no cramped captions in the dial.
    function examBell(dc,x,y) {
        // Bell silhouette, 14x14 pixels. Shape is language-independent.
        pen(dc,GOLD);
        dc.setPenWidth(2);
        dc.drawLine(x,y-8,x,y-6);
        dc.drawLine(x-4,y-4,x-4,y+3);
        dc.drawLine(x+4,y-4,x+4,y+3);
        dc.drawLine(x-4,y-4,x-2,y-6);
        dc.drawLine(x+4,y-4,x+2,y-6);
        dc.drawLine(x-4,y+3,x-7,y+6);
        dc.drawLine(x+4,y+3,x+7,y+6);
        dc.drawLine(x-7,y+6,x+7,y+6);
        dc.drawLine(x-2,y+8,x+2,y+8);
        dc.setPenWidth(1);
    }
    function examHourglass(dc,x,y) {
        // Hourglass instead of the word "GESAMT".
        pen(dc,PALE_GOLD);
        dc.setPenWidth(2);
        dc.drawLine(x-5,y-7,x+5,y-7);
        dc.drawLine(x-5,y+7,x+5,y+7);
        dc.drawLine(x-4,y-6,x+4,y+6);
        dc.drawLine(x+4,y-6,x-4,y+6);
        dc.setPenWidth(1);
    }
    function examMilestonePips(dc,x,y) {
        // Four distinctive filled/unfilled pips show delivered announcements.
        // Numeric 0/4 below is kept as an unambiguous accessibility fallback.
        for (var k=0;k<4;k++) {
            var px=x-18+k*12;
            pen(dc,k<model.examNextIndex?GOLD:0x555555);
            if (k<model.examNextIndex) {
                dc.fillCircle(px,y,3);
            } else {
                dc.drawCircle(px,y,3);
            }
        }
    }
    function examFace(dc,w,h) {
        // Three subregisters fit within the actual 240x240 fēnix 7S dial.
        // Top: burgundy cap identifies this rare mode; nothing else to read.
        var cx=w/2;var cy=h/2;
        dialBackground(dc);
        examProgressRing(dc,cx-54,128,34,model.examNextIndex,4);
        var stage=model.examNextIndex;
        var stageStart=stage==0?0:model.EXAM_MARKS[stage-1];
        var stageDuration=stage<4?model.EXAM_MARKS[stage]-stageStart:1;
        examProgressRing(dc,cx+54,128,34,examNextRemaining(),stageDuration);
        examProgressRing(dc,cx,181,38,examRemaining(),model.EXAM_TOTAL_SEC);
        clockHands(dc,cx,cy-8);
        // Render legible data AFTER the hands; no repeated text labels.
        examMilestonePips(dc,cx-54,114);
        centeredAt(dc,cx-54,138,model.examNextIndex.toString()+"/4",WHITE,Graphics.FONT_SMALL,56);
        examBell(dc,cx+54,112);
        centeredAt(dc,cx+54,140,examTime(examNextRemaining()),WHITE,Graphics.FONT_TINY,62);
        examHourglass(dc,cx,163);
        centeredAt(dc,cx,193,examTime(examRemaining()),WHITE,Graphics.FONT_SMALL,68);
        categoryIcon(dc,cx,43,19);
        if (model.paused && model.examNextIndex<4 && model.running) {
            // Two pause bars, no additional line of clipped text.
            pen(dc,PALE_GOLD);
            dc.fillRectangle(cx-5,74,3,8);
            dc.fillRectangle(cx+2,74,3,8);
        }
    }
    function examAnnouncement(dc,w,h) {
        // Full-screen announcement for 60 seconds, distinct from the normal
        // icon-first dial. Here one short explicit caption is intentional:
        // invigilators must know WHICH announcement is due.
        pen(dc,0x000000);dc.clear();
        var cx=w/2;
        pen(dc,EXAM_BURGUNDY);dc.fillCircle(cx,64,25);
        pen(dc,GOLD);dc.setPenWidth(2);
        dc.drawLine(cx-12,60,cx,54);dc.drawLine(cx,54,cx+12,60);
        dc.drawLine(cx-12,60,cx,67);dc.drawLine(cx,67,cx+12,60);
        dc.drawLine(cx-6,70,cx-6,76);dc.drawLine(cx-6,76,cx+6,76);
        dc.setPenWidth(1);
        var no=model.examBannerIndex;
        var header=no==4 ? "ENDE" : no.toString()+". Durchsage";
        centeredAt(dc,cx,116,header,WHITE,Graphics.FONT_MEDIUM,184);
        pen(dc,GOLD);dc.fillRectangle(cx-34,138,68,2);
        // 30:00 / 15:00 / 05:00 / 00:00 remaining, without long subtitles.
        centeredAt(dc,cx,177,examTime(examRemaining()),WHITE,Graphics.FONT_LARGE,175);
    }
    function drawChronograph(dc,w,h) {
        var cx=w/2;
        dialBackground(dc);
        // True luxury-watch layering: the hands cross the *faces* of the
        // small registers; only their numbers and symbols sit on top.
        chronoSmallDials(dc,cx);
        clockHands(dc,cx,h/2-8);
        chronoReadouts(dc,cx);
        chronoLogo(dc,cx);
        if (!model.lastMessage.equals("") && model.mode.equals("select")) {
            // A small status along the bottom replaces the bulky category title.
            centeredAt(dc,cx,224,model.lastMessage,GOLD,Graphics.FONT_TINY,168);
        }
    }

    // 0.5.8 PREMIUM RENDERER: one static 240px bitmap, dynamic gauges and
    // hands, then cached icon/bitmap-font readouts. No screenshots as data.
    function premiumBackground(dc) {
        // 0.5.10: every category has its own 240px artwork. The former static
        // one-size-fits-all dotted dial is no longer shown. Keep only ONE
        // loaded bitmap live: avoids eight simultaneous resource allocations.
        if (premiumBase == null || premiumBaseIndex != model.index) {
            premiumBase = null;
            premiumBaseIndex = model.index;
            try {
                if (model.index == 0) { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseResearch); }
                else if (model.index == 1) { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseLecture); }
                else if (model.index == 2) { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseCorrect); }
                else if (model.index == 3) { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseAdmin); }
                else if (model.index == 4) { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseMeeting); }
                else if (model.index == 5) { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseLearn); }
                else if (model.index == 6) { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseFamily); }
                else { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBaseExam); }
            } catch(e) {
                // A missing resource must never prevent opening saved sessions.
                try { premiumBase = WatchUi.loadResource(Rez.Drawables.ChronoBase); } catch(ex) { }
            }
        }
        if (premiumBase != null && dc.getWidth() == 240 && dc.getHeight() == 240) {
            dc.drawBitmap(0, 0, premiumBase);
        } else { dialBackground(dc); } // Defensive fallback on other screens.
    }
    function premiumCategoryBitmap() {
        if (premiumCategory != null && premiumCategoryIndex == model.index) { return premiumCategory; }
        premiumCategoryIndex = model.index;
        premiumCategory = null;
        try {
            if (model.index == 0) { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Research); }
            else if (model.index == 1) { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Lecture); }
            else if (model.index == 2) { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Correct); }
            else if (model.index == 3) { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Admin); }
            else if (model.index == 4) { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Meeting); }
            else if (model.index == 5) { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Learn); }
            else if (model.index == 6) { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Family); }
            else { premiumCategory = WatchUi.loadResource(Rez.Drawables.Chrono_Exam); }
        } catch(e) { }
        return premiumCategory;
    }
    // Local contrast, rather than one global "dark/bright background" switch:
    // these decisions are based on the actual scenic pixels within x=100..140,
    // y=73..86, immediately beneath the tiny date. The scene is fixed per mode.
    // 7 exam and 5 learning have pale sky here; other modes have dark stone/sea.
    function premiumDateInk() {
        if (model.index == 5 || model.index == 7) { return 0x001122; }
        return PALE_GOLD;
    }
    function premiumDateShadow() {
        if (model.index == 5 || model.index == 7) { return 0xFFEECC; }
        return 0x001122;
    }
    function premiumCategoryGlyph(dc,cx) {
        var bmp = premiumCategoryBitmap();
        if (bmp != null) { dc.drawBitmap(cx-16,30,bmp); }
        else { categoryIcon(dc,cx,46,14); }
        // Genuine small custom bitmap-font numerals. A 1-pixel opposite-tone
        // shadow protects legibility at transitions between sky and landscape.
        try {
            var dt = Gregorian.info(Time.now(),Time.FORMAT_SHORT);
            var label = pad(dt.day)+"/"+pad(dt.month);
            if (premiumDigitsSmall != null) {
                dc.setColor(premiumDateShadow(),Graphics.COLOR_TRANSPARENT);
                dc.drawText(cx+1,81,premiumDigitsSmall,label,Graphics.TEXT_JUSTIFY_CENTER|Graphics.TEXT_JUSTIFY_VCENTER);
                dc.setColor(premiumDateInk(),Graphics.COLOR_TRANSPARENT);
                dc.drawText(cx,80,premiumDigitsSmall,label,Graphics.TEXT_JUSTIFY_CENTER|Graphics.TEXT_JUSTIFY_VCENTER);
            }
        } catch(e) { }
    }
    function premiumIcon(dc, bmp, x, y, w, h) {
        if (bmp != null) { dc.drawBitmap(x-(w/2),y-(h/2),bmp); }
    }
    function premiumText(dc,x,y,value,large) {
        var font = large ? premiumDigits : premiumDigitsSmall;
        if (font != null) {
            // Unlike system fonts, our bitmap font is pixel-sized by design.
            dc.setColor(WHITE,Graphics.COLOR_TRANSPARENT);
            dc.drawText(x,y,font,value,Graphics.TEXT_JUSTIFY_CENTER|Graphics.TEXT_JUSTIFY_VCENTER);
        } else {
            centeredAt(dc,x,y,value,WHITE,large?Graphics.FONT_SMALL:Graphics.FONT_TINY,64);
        }
    }
    function premiumArc(dc,x,y,r,used,total,col) {
        // The background bitmap contains the full graphite register ring.
        // Remaining ring is painted only when the sensor value is available.
        if (total <= 0 || used <= 0) { return; }
        var degrees=(used*360.0/total).toNumber();
        if (degrees > 359) { degrees=359; }
        pen(dc,col); dc.setPenWidth(3);
        dc.drawArc(x,y,r,Graphics.ARC_CLOCKWISE,90,90-degrees);
        dc.setPenWidth(1);
    }
    function premiumHands(dc,cx,cy) {
        var t=Gregorian.info(Time.now(),Time.FORMAT_SHORT);
        var sec=t.sec,mins=t.min+sec/60.0,hrs=(t.hour%12)+mins/60.0;
        premiumHand(dc,cx,cy,hrs*30.0,51,5);
        premiumHand(dc,cx,cy,mins*6.0,83,3);
        var a=sec*6.0;
        dialLine(dc,polarX(cx,a+180,15),polarY(cy,a+180,15),
            polarX(cx,a,98),polarY(cy,a,98),0xAAAAAA,1);
        pen(dc,0x000000);dc.fillCircle(cx,cy,5);
        pen(dc,GOLD);dc.fillCircle(cx,cy,3);
        pen(dc,PALE_GOLD);dc.fillCircle(cx,cy,1);
    }
    function premiumHand(dc,cx,cy,a,len,w) {
        var tx=polarX(cx,a,len),ty=polarY(cy,a,len);
        var sx=polarX(cx,a,len-10),sy=polarY(cy,a,len-10);
        var bx=polarX(cx,a+180,11),by=polarY(cy,a+180,11);
        // Four metal layers: a hairline shadow, warm gold edge, ivory insert, polished tip.
        dialLine(dc,bx+1,by+1,sx+1,sy+1,0x02050C,w+4);
        dialLine(dc,bx,by,sx,sy,0x775533,w+2);
        dialLine(dc,bx,by,sx,sy,GOLD,w);
        dialLine(dc,cx,cy,sx,sy,PALE_GOLD,w-2);
        dialLine(dc,sx,sy,tx,ty,PALE_GOLD,1);
    }
    function premiumNormal(dc,w,h) {
        var cx=w/2;
        premiumBackground(dc);
        var count=model.dailyPomodoros;
        var currentCycle=count%4;
        premiumArc(dc,cx-50,135,35,currentCycle,4,GOLD);
        var bb=currentBodyBattery();
        if (bb!=null && bb>=0 && bb<=100) {
            premiumArc(dc,cx+50,135,35,bb,100,GOLD);
        }
        // A mechanical kitchen-timer indication: the gold 360-degree track
        // counts DOWN from full to empty. On pause it freezes at the exact
        // remaining duration; an idle, not-yet-started Pomodoro shows full.
        if (model.pomodoro) {
            var ringTotal=1500;
            var ringRemain=ringTotal;
            if (model.mode.equals("running")) {
                ringTotal=model.phaseDuration();
                ringRemain=ringTotal-model.phaseSec;
                if (ringRemain<0) { ringRemain=0; }
            }
            premiumArc(dc,cx,183,37,ringRemain,ringTotal,GOLD);
        }
        // True watch hand hierarchy: foreground over bitmap and rings.
        premiumHands(dc,cx,120);
        premiumCategoryGlyph(dc,cx);
        var gems=((count-(count%4))/4).toNumber();
        if (gems>4) { gems=4; }
        if (gems>0) {
            for (var i=0;i<gems;i++) {
                var gx=(cx-50)-18+i*12;
                if (premiumGem != null) { dc.drawBitmap(gx-7,109,premiumGem); }
                else { miniDiamond(dc,gx,118); }
            }
        }
        premiumText(dc,cx-50,gems>0?146:140,count.toString(),true);
        premiumIcon(dc,premiumHeart,cx+50,126,17,16);
        var hr="--";
        if (model.faceHr!=null && model.faceHrMeasuredAt>0 &&
            model.now()-model.faceHrMeasuredAt<=75) { hr=model.faceHr.toString(); }
        premiumText(dc,cx+50,148,hr,true);
        var active=model.mode.equals("running");
        var remaining=0;
        if (model.pomodoro) {
            remaining=(active?model.phaseDuration():1500)-(active?model.phaseSec:0);
            premiumIcon(dc,premiumTomato,cx,166,32,32);
        } else {
            remaining=active?model.totalSec:0;
            premiumIcon(dc,premiumStopwatch,cx,167,20,20);
        }
        if (remaining<0) { remaining=0; }
        var label=pad((remaining/60).toNumber())+":"+pad(remaining%60);
        if (remaining>=3600) {
            label=(remaining/3600).toNumber().toString()+":"+pad(((remaining%3600)/60).toNumber());
        }
        premiumText(dc,cx,194,label,false);
        if (active && model.paused) {
            pen(dc,GOLD);dc.fillRectangle(cx+21,165,2,8);dc.fillRectangle(cx+25,165,2,8);
        }
        if (!model.lastMessage.equals("") && model.mode.equals("select")) {
            centeredAt(dc,cx,227,model.lastMessage,MUTED,Graphics.FONT_TINY,160);
        }
    }
    function premiumExam(dc,w,h) {
        var cx=w/2;
        premiumBackground(dc);
        premiumArc(dc,cx-50,135,35,model.examNextIndex,4,GOLD);
        var step=model.examNextIndex;
        var stageStart=step==0?0:model.EXAM_MARKS[step-1];
        var stageDuration=step<4?model.EXAM_MARKS[step]-stageStart:1;
        var next=examNextRemaining();
        // Ring empties towards the next announcement, not an invented counter.
        premiumArc(dc,cx+50,135,35,next,stageDuration,GOLD);
        premiumArc(dc,cx,183,37,examRemaining(),model.EXAM_TOTAL_SEC,GOLD);
        premiumHands(dc,cx,120);
        premiumCategoryGlyph(dc,cx);
        // Four pips for delivered milestones; time data stays legible.
        for (var i=0;i<4;i++) {
            pen(dc,i<model.examNextIndex?GOLD:0x555555);
            if (i<model.examNextIndex) { dc.fillCircle(cx-50-18+i*12,119,2); }
            else { dc.drawCircle(cx-50-18+i*12,119,2); }
        }
        premiumText(dc,cx-50,145,model.examNextIndex.toString()+"/4",true);
        premiumIcon(dc,premiumBell,cx+50,122,16,19);
        premiumText(dc,cx+50,147,examTime(next),false);
        premiumIcon(dc,premiumHourglass,cx,164,16,19);
        premiumText(dc,cx,194,examTime(examRemaining()),false);
        if (model.paused && model.examNextIndex<4 && model.running) {
            pen(dc,GOLD);dc.fillRectangle(cx-5,72,3,8);dc.fillRectangle(cx+2,72,3,8);
        }
    }
    function premiumAnnouncement(dc,w,h) {
        // Keep alert full-screen, brief and unmistakable for invigilation.
        var cx=w/2;
        premiumBackground(dc);
        // Opaque central reading area covers decorative hands/dials.
        pen(dc,0x000000);dc.fillRectangle(cx-95,88,190,90);
        premiumCategoryGlyph(dc,cx);
        var no=model.examBannerIndex;
        var header=no==4 ? "ENDE" : no.toString()+". Durchsage";
        centeredAt(dc,cx,116,header,WHITE,Graphics.FONT_MEDIUM,185);
        pen(dc,GOLD);dc.fillRectangle(cx-35,143,70,1);
        premiumText(dc,cx,166,examTime(examRemaining()),true);
    }

    // All four dashboard pages use a separate scenic pre-quantized bitmap.
    function dashboardBackdrop(dc,w,h) {
        // Keep peak RAM bounded on the fēnix 7S: a dial OR a dashboard bitmap.
        premiumBase=null;premiumBaseIndex=-1;
        if(uiFontTiny==null){try{uiFontTiny=WatchUi.loadResource(Rez.Fonts.ChronoUiMicro);}catch(ex){}}
        if(uiFontMenu==null){try{uiFontMenu=WatchUi.loadResource(Rez.Fonts.ChronoUiMenu);}catch(ex){}}
        var kind=(model.mode.equals("hub")||model.mode.equals("shopping-lists")||model.mode.equals("people")||model.mode.equals("person-detail"))?"hub":model.mode.equals("today")?"today":model.mode.equals("shopping")?"shopping":"deadlines";
        if(uiBackdrop==null || !uiBackdropMode.equals(kind)) {
            uiBackdrop=null;uiBackdropMode=kind;
            try {
                if(kind.equals("hub")) { uiBackdrop=WatchUi.loadResource(Rez.Drawables.UiMenuBg); }
                else if(kind.equals("today")) { uiBackdrop=WatchUi.loadResource(Rez.Drawables.UiTodayBg); }
                else if(kind.equals("shopping")) { uiBackdrop=WatchUi.loadResource(Rez.Drawables.UiShoppingBg); }
                else {uiBackdrop=WatchUi.loadResource(Rez.Drawables.UiDeadlinesBg);}
            }catch(ex) { }
        }
        if(uiBackdrop!=null) {dc.drawBitmap(0,0,uiBackdrop);}
        else {pen(dc,NAVY);dc.fillRectangle(0,0,w,h);}
    }
    function uiIcon(dc,key,x,y) {
        if(!uiIconCache.hasKey(key)) {
            var loaded=null;
            try {
                if(key.equals("focus")) { loaded=WatchUi.loadResource(Rez.Drawables.UiFocus); }
                else if(key.equals("today")) { loaded=WatchUi.loadResource(Rez.Drawables.UiToday); }
                else if(key.equals("deadline")) { loaded=WatchUi.loadResource(Rez.Drawables.UiDeadline); }
                else if(key.equals("shopping")) { loaded=WatchUi.loadResource(Rez.Drawables.UiShopping); }
                else if(key.equals("sync")) { loaded=WatchUi.loadResource(Rez.Drawables.UiSync); }
                else if(key.equals("check")) { loaded=WatchUi.loadResource(Rez.Drawables.UiCheck); }
                else if(key.equals("meeting")) { loaded=WatchUi.loadResource(Rez.Drawables.UiMeeting); }
                else if(key.equals("family")) { loaded=WatchUi.loadResource(Rez.Drawables.UiFamily); }
                else if(key.equals("task")) { loaded=WatchUi.loadResource(Rez.Drawables.UiTask); }
                else if(key.equals("fruit")) { loaded=WatchUi.loadResource(Rez.Drawables.UiFruit); }
                else if(key.equals("dairy")) { loaded=WatchUi.loadResource(Rez.Drawables.UiDairy); }
                else if(key.equals("bread")) { loaded=WatchUi.loadResource(Rez.Drawables.UiBread); }
                else if(key.equals("drink")) { loaded=WatchUi.loadResource(Rez.Drawables.UiDrink); }
                else if(key.equals("vegetables")) { loaded=WatchUi.loadResource(Rez.Drawables.UiVegetables); }
                else { loaded=WatchUi.loadResource(Rez.Drawables.UiMisc); }
            }catch(ex) { }
            uiIconCache[key]=loaded;
        }
        if(uiIconCache[key]!=null) { dc.drawBitmap(x-11,y-11,uiIconCache[key]); }
    }
    function uiText(dc,x,y,str,isLarge,color) {
        pen(dc,color);
        var f=isLarge?uiFontMenu:uiFontTiny;
        if(f==null) { f=Graphics.FONT_TINY; }
        dc.drawText(x,y,f,str,Graphics.TEXT_JUSTIFY_CENTER|Graphics.TEXT_JUSTIFY_VCENTER);
    }
    function trimText(text,limit) {
        if(text==null) { return ""; }
        var s=text.toString();
        if(s.length()<=limit) { return s; }
        return s.substring(0,limit-1)+"…";
    }
    function hubItem(n) {
        if(n==0) { return "Fokus"; }
        if(n==1) { return "Heute"; }
        if(n==2) { return "Deadlines"; }
        if(n==3) { return "Einkaufslisten"; }
        if(n==4) { return "Menschen"; }
        return "Sync";
    }
    function hubIcon(n) {
        if(n==0) { return "focus"; }
        if(n==1) { return "today"; }
        if(n==2) { return "deadline"; }
        if(n==3) { return "shopping"; }
        if(n==4) { return "meeting"; }
        return "sync";
    }
    function drawHub(dc,w,h) {
        dashboardBackdrop(dc,w,h);
        uiText(dc,120,33,"COMPASS",true,PALE_GOLD);
        if(model.SIMULATOR_DEMO){uiText(dc,120,219,"DEMO / OFFLINE",false,GOLD);}
        pen(dc,GOLD);dc.drawLine(80,48,160,48);
        // Fixed-row menu, no decorative chronograph registers behind text.
        var order=[0,1,2,3,4,5]; // Keep existing UP/DOWN navigation and safe START action
        for(var i=0;i<6;i++) {
            var n=order[i],y=65+i*29;
            if(n==model.hubIndex) {
                pen(dc,0x005555);dc.fillRoundedRectangle(40,y-13,160,27,6);
                pen(dc,GOLD);dc.drawRoundedRectangle(40,y-13,160,27,6);
            }
            uiIcon(dc,hubIcon(n),57,y);
            uiText(dc,131,y,hubItem(n),false,n==model.hubIndex?WHITE:PALE_GOLD);
        }
    }
    function uiDate(dc){
        var d=Gregorian.info(Time.now(),Time.FORMAT_SHORT);
        uiText(dc,120,49,(d.day<10?"0":"")+d.day.toString()+"."+(d.month<10?"0":"")+d.month.toString(),false,PALE_GOLD);
    }
    function eventMinute(value){
        if(value==null||value.length()<5) { return 0; }
        return value.substring(0,2).toNumber()*60+value.substring(3,5).toNumber();
    }
    // Old cached calendars may predate server filtering. Suppress generic Work
    // placeholders and short slots on-device too, without changing saved events.
    function showCalendarEvent(ev) {
        if(ev==null || !ev.hasKey("title") || !ev.hasKey("start") || !ev.hasKey("end")) { return false; }
        var title=ev["title"].toLower();
        if(title.equals("work")||title.equals("arbeit")||title.equals("arbeitszeit")||
           title.equals("arbeitsblock")||title.equals("work block")||title.equals("fokus")||
           title.equals("focus")||title.equals("busy")||title.equals("beschäftigt")) { return false; }
        return eventMinute(ev["end"])-eventMinute(ev["start"])>=60;
    }
    // Real twelve-hour clock: 9:00–10:30 occupies 45 degrees, not a 24h stripe.
    // Morning and afternoon use separate concentric tracks to avoid ambiguity.
    function drawCalendarArc(dc,cx,cy,radius,begin,end,color) {
        if(end<=begin) { return; }
        pen(dc,color);dc.setPenWidth(3);
        for(var minute=begin;minute<end;minute+=3){
            var stop=minute+3<end?minute+3:end;
            var a1=((minute%720)/2.0-90)*Math.PI/180;
            var a2=((stop%720)/2.0-90)*Math.PI/180;
            var x1=Math.round(cx+radius*Math.cos(a1)),y1=Math.round(cy+radius*Math.sin(a1));
            var x2=Math.round(cx+radius*Math.cos(a2)),y2=Math.round(cy+radius*Math.sin(a2));
            dc.drawLine(x1,y1,x2,y2);
        }
        dc.setPenWidth(1);
    }
    function drawDayRing(dc) {
        var evs=model.dashboardItems("events");
        // Each event has its own accent, even when appointments are adjacent.
        // AM/PM remain on separate concentric tracks. A 2-minute gap at each
        // boundary prevents contiguous 09:00-10:00 and 10:00-11:00 merging.
        for(var half=0;half<2;half++) {
            var count=0;
            for(var j=0;j<evs.size();j++) {
                var ev=evs[j];
                if(!showCalendarEvent(ev)) { continue; }
                var from=eventMinute(ev["start"]),to=eventMinute(ev["end"]);
                var a=half*720,b=(half+1)*720;
                var first=from>a?from:a,last=to<b?to:b;
                if(last<=first) { continue; }
                var color=(count%2==0)?0xFFAA00:0xAA3355;
                count++;
                if(last-first>4) { first+=1;last-=1; }
                drawCalendarArc(dc,120,120,half==0?100:94,first,last,color);
            }
        }
    }
    // Daily Orbit 0.5.12.3: keep the 12-hour dial readable.
    // Do not cover it with a large static To-do rectangle or instructional footer.
    function drawTodayPage(dc,w,h) {
        dashboardBackdrop(dc,w,h);
        drawDayRing(dc);
        uiText(dc,120,28,"HEUTE",true,PALE_GOLD);uiDate(dc);
        var evs=model.dashboardItems("events"),tasks=model.agendaItems();
        var selected=null;
        for(var j=0;j<evs.size();j++) {if(showCalendarEvent(evs[j])) {selected=evs[j];break;}}
        if(selected!=null) {
            uiText(dc,120,77,selected["start"]+"–"+selected["end"],false,PALE_GOLD);
            uiText(dc,120,95,trimText(selected["title"],19),false,WHITE);
        } else {
            var msg="Keine Zeitblöcke";
            if(!model.SIMULATOR_DEMO && (model.dashboardCache==null ||
                 !model.dashboardCache.hasKey("calendarUpdatedAt") ||
                 model.dashboardCache["calendarUpdatedAt"]==null)) {msg="Kalender-Sync fehlt";}
            uiText(dc,120,87,msg,false,MUTED);
        }
        pen(dc,0x666644);dc.drawLine(53,115,187,115);
        uiText(dc,120,128,"TO-DOS",false,PALE_GOLD);
        if(tasks.size()==0){uiText(dc,120,158,"Keine To-dos",false,MUTED);return;}
        var first=bounded(model.agendaIndex,0,bounded(tasks.size()-3,0,tasks.size()));
        for(var i=0;i<3 && first+i<tasks.size();i++) {
            var idx=first+i,y=152+i*22,t=tasks[idx];
            if(idx==model.agendaIndex) {
                pen(dc,GOLD);dc.drawLine(48,y-9,48,y+9);
            }
            uiText(dc,125,y,trimText(t["title"],19),false,idx==model.agendaIndex?WHITE:MUTED);
        }
    }
    function drawDeadlinesPage(dc,w,h) {
        dashboardBackdrop(dc,w,h);
        uiText(dc,120,28,"DEADLINES",true,PALE_GOLD);uiDate(dc);
        var tasks=model.agendaItems();
        if(tasks.size()==0){uiText(dc,120,128,"Keine Deadlines",false,MUTED);return;}
        var first=bounded(model.agendaIndex,0,bounded(tasks.size()-3,0,tasks.size()));
        for(var i=0;i<3 && first+i<tasks.size();i++){
            var idx=first+i,t=tasks[idx],y=103+i*40;
            pen(dc,0x000011);dc.fillRoundedRectangle(35,y-17,170,34,4);
            if(idx==model.agendaIndex){pen(dc,GOLD);dc.drawLine(39,y-12,39,y+12);}
            var title=t["title"];
            if(title!=null && title.length()>=2 && title.substring(0,2).equals("N:")) {
                uiIcon(dc,"family",54,y);
                uiText(dc,133,y-6,trimText(title,17),false,PALE_GOLD);
            }else {
                uiText(dc,120,y-6,trimText(title,20),false,idx==model.agendaIndex?WHITE:MUTED);
            }
            uiText(dc,120,y+9,shortDate(t["dueDate"]),false,urgencyColor(t["dueDate"]));
        }
    }
    function shoppingGlyphKey(title) {
        var s=title.toLower();
        if(s.find("milch")!=null||s.find("topfen")!=null||s.find("käse")!=null) { return "dairy"; }
        if(s.find("apfel")!=null||s.find("banan")!=null||s.find("mango")!=null) { return "fruit"; }
        if(s.find("brot")!=null||s.find("semmel")!=null) { return "bread"; }
        if(s.find("wasser")!=null||s.find("saft")!=null) { return "drink"; }
        if(s.find("gemüse")!=null||s.find("karott")!=null) { return "vegetables"; }
        return "shopping";
    }
    // Long shopping-list labels slide slowly rightward through a fixed-width
    // viewport; drawing one small segment avoids scrolling the entire list.
    function watchListTitle() {
        var lists=model.dashboardItems("shoppingLists");
        for(var i=0;i<lists.size();i++) {
            if(lists[i]["id"].equals(model.shoppingListId)) {return lists[i]["title"];}
        }
        if(model.dashboardCache!=null && model.dashboardCache.hasKey("shoppingListTitle") &&
           model.dashboardCache["shoppingListTitle"]!=null) {return model.dashboardCache["shoppingListTitle"];}
        return "Einkaufsliste";
    }
    function scrollingListTitle(text,limit) {
        if(text==null) {return "";}
        var s=text.toString();
        if(s.length()<=limit) {return s;}
        // Circular ticker, including a short visual separation between passes.
        var ticker=s+"   "+s;
        var frame=model.now()%(s.length()+3);
        if(frame+limit>ticker.length()) {frame=0;}
        return ticker.substring(frame,frame+limit);
    }
    function drawShoppingLists(dc,w,h) {
        dashboardBackdrop(dc,w,h);uiText(dc,120,30,"EINKAUFSLISTEN",true,PALE_GOLD);
        var options=model.dashboardItems("shoppingLists");
        if(options.size()==0){uiText(dc,120,112,"Keine aktive Liste",false,MUTED);return;}
        var first=bounded(model.shoppingListIndex,0,bounded(options.size()-5,0,options.size()));
        for(var i=0;i<5 && first+i<options.size();i++) {
            var idx=first+i,y=79+i*33,r=options[idx];
            if(idx==model.shoppingListIndex){pen(dc,0x005555);dc.fillRoundedRectangle(28,y-13,184,27,5);}
            uiIcon(dc,"shopping",47,y);uiText(dc,132,y,idx==model.shoppingListIndex?scrollingListTitle(r["title"],19):trimText(r["title"],19),false,idx==model.shoppingListIndex?WHITE:MUTED);
        }
    }
    function drawPeoplePage(dc,w,h) {
        dashboardBackdrop(dc,w,h);uiText(dc,120,29,"MENSCHEN",true,PALE_GOLD);
        var people=model.dashboardItems("people");
        if(people.size()==0){uiText(dc,120,115,"Keine Freigabe",false,MUTED);return;}
        var first=bounded(model.peopleIndex,0,bounded(people.size()-5,0,people.size()));
        for(var i=0;i<5 && first+i<people.size();i++){
            var idx=first+i,y=78+i*29,p=people[idx];
            if(idx==model.peopleIndex){pen(dc,0x005555);dc.fillRoundedRectangle(25,y-12,190,26,4);}
            uiIcon(dc,"meeting",44,y);
            uiText(dc,125,y,trimText(p["name"],19),false,idx==model.peopleIndex?WHITE:MUTED);
        }
    }
    function drawPersonPoints(dc,w,h) {
        dashboardBackdrop(dc,w,h);var persons=model.dashboardItems("people");
        if(model.peopleIndex>=persons.size()){return;}
        var person=persons[model.peopleIndex];
        uiText(dc,120,36,trimText(person["name"],19),true,PALE_GOLD);
        var points=person["points"];
        if(points==null||points.size()==0){uiText(dc,120,114,"Keine offenen Punkte",false,MUTED);return;}
        var first=bounded(model.peoplePointIndex,0,bounded(points.size()-4,0,points.size()));
        for(var i=0;i<4&&first+i<points.size();i++){
            var idx=first+i,y=84+i*34;
            if(idx==model.peoplePointIndex){pen(dc,0x005555);dc.fillRoundedRectangle(27,y-13,185,29,4);}
            uiIcon(dc,"task",43,y);uiText(dc,132,y,trimText(points[idx],19),false,idx==model.peoplePointIndex?WHITE:MUTED);
        }
        uiText(dc,120,222,"START: ANSEHEN",false,GOLD);
    }
    function drawShoppingPage(dc,w,h) {
        dashboardBackdrop(dc,w,h);
        uiText(dc,120,25,"EINKAUF",true,PALE_GOLD);
        uiText(dc,120,47,scrollingListTitle(watchListTitle(),24),false,WHITE);
        var rows=model.dashboardItems("shopping");
        var done=0;for(var n=0;n<rows.size();n++){if(rows[n]["checked"]==true){done++;}}
        uiText(dc,120,61,(rows.size()-done).toString()+" offen · "+done.toString()+" erledigt",false,MUTED);
        if(rows.size()==0){uiText(dc,120,125,"Liste nicht geladen",false,MUTED);return;}
        var first=bounded(model.shoppingIndex,0,bounded(rows.size()-5,0,rows.size()));
        for(var i=0;i<5 && first+i<rows.size();i++) {
            var idx=first+i,r=rows[idx],y=91+i*28;
            if(idx==model.shoppingIndex){pen(dc,0x005555);dc.fillRoundedRectangle(25,y-12,190,24,4);}
            pen(dc,r["checked"]==true?GOLD:0x55AAAA);dc.drawRoundedRectangle(32,y-6,12,12,2);
            if(r["checked"]==true){dc.drawLine(34,y,37,y+3);dc.drawLine(37,y+3,42,y-3);}
            var glyph=shoppingGlyphKey(r["title"]);
            if(!glyph.equals("shopping")){uiIcon(dc,glyph,58,y);}
            uiText(dc,134,y,trimText(r["title"],20),false,r["checked"]==true?MUTED:WHITE);
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
        if (model.detailOrigin.equals("person-detail")) {
            drawPersonPointDetail(dc,w,h);return;
        }
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
    function drawPersonPointDetail(dc,w,h) {
        // Reuse the Today detail's three-line, scrollable title treatment.
        // No due date, priority, category or completion is fabricated.
        centered(dc,h*28/100,"OFFENER PUNKT",Graphics.FONT_SMALL,AQUA,w*76/100);
        var lines=titleLines(dc,model.personPointTitle,w*76/100);
        var maxOffset=lines.size()>3?lines.size()-3:0;
        if (model.detailOffset>maxOffset) { model.detailOffset=maxOffset; }
        for (var j=0;j<3;j++) {
            var ix=j+model.detailOffset;
            if (ix<lines.size()) {
                centered(dc,h*(42+j*10)/100,lines[ix],Graphics.FONT_TINY,WHITE,w*78/100);
            }
        }
        centered(dc,h*76/100,model.personPointName,Graphics.FONT_TINY,GOLD,w*76/100);
        centered(dc,h*85/100,model.personPointPosition,Graphics.FONT_TINY,MUTED,w*70/100);
        centered(dc,h*94/100,"BACK ZUR PERSON",Graphics.FONT_TINY,GOLD,w*80/100);
    }
    function menuItemName(i) {
        if(i==0){return "Fortsetzen";}
        if(i==1){return "Speichern";}
        if(i==2){return "Später fortsetzen";}
        if(i==3){return "Verwerfen";}
        return "Beenden";
    }
    function menuGlyph(dc,x,y,i) {
        pen(dc,GOLD);dc.setPenWidth(2);
        if(i==0) {
            dc.drawLine(x-5,y-7,x+6,y);dc.drawLine(x+6,y,x-5,y+7);
            dc.drawLine(x-5,y+7,x-5,y-7);
        } else if(i==1) {
            dc.drawRectangle(x-8,y-8,16,16);dc.drawRectangle(x-4,y-7,8,5);
            dc.drawLine(x-4,y+2,x+4,y+2);
        } else if(i==2) {
            dc.fillRectangle(x-6,y-8,4,16);dc.fillRectangle(x+2,y-8,4,16);
        } else if(i==3) {
            dc.drawRectangle(x-6,y-5,12,13);dc.drawLine(x-9,y-8,x+9,y-8);
            dc.drawLine(x-4,y-10,x+4,y-10);
        } else {
            dc.drawLine(x-3,y-8,x+7,y-8);dc.drawLine(x+7,y-8,x+7,y+8);
            dc.drawLine(x-3,y+8,x+7,y+8);dc.drawLine(x-4,y,x-11,y);
            dc.drawLine(x-11,y,x-7,y-4);dc.drawLine(x-11,y,x-7,y+4);
        }
        dc.setPenWidth(1);
    }
    function drawSessionMenu(dc,w,h) {
        var cx=w/2;
        // Isolated menu: NO analog clock date or cyan row is drawn behind it.
        // Keep all text inside the safe circle and away from the bezel.
        pen(dc,0x000000);dc.clear();
        categoryIcon(dc,cx-47,37,12);
        drawTxt(dc,cx+14,37,"SESSION",Graphics.FONT_SMALL,PALE_GOLD,124);
        pen(dc,GOLD);dc.fillRectangle(cx-31,57,62,1);
        var top=model.menuIndex>3?1:0;
        for(var i=top;i<top+4;i++) {
            var y=84+(i-top)*31;
            var selected=i==model.menuIndex;
            if(selected){
                pen(dc,0x555500);dc.fillRoundedRectangle(cx-89,y-14,178,29,4);
                pen(dc,GOLD);dc.drawRoundedRectangle(cx-89,y-14,178,29,4);
            }
            menuGlyph(dc,cx-69,y,i);
            drawTxt(dc,cx+18,y,menuItemName(i),Graphics.FONT_SMALL,
                selected?WHITE:0xAAAAAA,128);
        }
        if(top==0){centered(dc,213,"WEITERE",Graphics.FONT_TINY,GOLD,94);}
        else{centered(dc,213,"ZURÜCK",Graphics.FONT_TINY,GOLD,94);}
    }
    function onUpdate(dc) {
        var w=dc.getWidth();var h=dc.getHeight();var cx=w/2;
        pen(dc,BG);dc.clear();
        if (model.mode.equals("select") || model.mode.equals("running")) {
            uiBackdrop=null;uiBackdropMode="";uiFontTiny=null;uiFontMenu=null;
            if (model.index == model.EXAM_CATEGORY) {
                if (model.mode.equals("running") && model.examBannerIndex>0 &&
                    model.examBannerUntil>model.now()) {
                    premiumAnnouncement(dc,w,h);
                } else { premiumExam(dc,w,h); }
            } else { premiumNormal(dc,w,h); }
            return;
        }
        if (model.mode.equals("session-menu")) {
            drawSessionMenu(dc,w,h);
            return;
        }
        if(model.mode.equals("hub")){drawHub(dc,w,h);return;}
        if(model.mode.equals("today")){drawTodayPage(dc,w,h);return;}
        if(model.mode.equals("forecast")){drawDeadlinesPage(dc,w,h);return;}
        if(model.mode.equals("shopping-lists")){drawShoppingLists(dc,w,h);return;}
        if(model.mode.equals("people")){drawPeoplePage(dc,w,h);return;}
        if(model.mode.equals("person-detail")){drawPersonPoints(dc,w,h);return;}
        if(model.mode.equals("shopping")){drawShoppingPage(dc,w,h);return;}
        if(model.mode.equals("detail")){drawAgendaDetail(dc,w,h);return;}
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
        } else if(model.mode.equals("discard-confirm")) {
            centered(dc,65,"VERWERFEN?",Graphics.FONT_MEDIUM,GOLD,178);
            centered(dc,94,"Nicht gespeichert!",Graphics.FONT_TINY,MUTED,185);
            for(var q=0;q<2;q++) {
                var yy=131+q*40;
                if(model.discardChoice==q) {
                    pen(dc,0x555500);dc.fillRoundedRectangle(cx-83,yy-15,166,30,4);
                    pen(dc,GOLD);dc.drawRoundedRectangle(cx-83,yy-15,166,30,4);
                }
                centered(dc,yy,q==0?"Abbrechen":"Ja, verwerfen",Graphics.FONT_SMALL,
                    q==model.discardChoice?WHITE:MUTED,152);
            }
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
    function onSwipe(ev as WatchUi.SwipeEvent) as Lang.Boolean {
        if (!(model.mode.equals("today") || model.mode.equals("forecast") || model.mode.equals("shopping") || model.mode.equals("shopping-lists") || model.mode.equals("people") || model.mode.equals("person-detail"))) { return false; }
        var direction=ev.getDirection();
        if (direction==WatchUi.SWIPE_UP) {model.scrollList(1);return true;}
        if (direction==WatchUi.SWIPE_DOWN) {model.scrollList(-1);return true;}
        return false;
    }
    function onTap(ev as WatchUi.ClickEvent) as Lang.Boolean {
        if (!(model.mode.equals("today") || model.mode.equals("forecast") || model.mode.equals("shopping") || model.mode.equals("shopping-lists") || model.mode.equals("people") || model.mode.equals("person-detail"))) { return false; }
        var xy=ev.getCoordinates();
        if (xy==null || xy.size()<2) { return false; }
        return model.touchList(xy[0],xy[1]);
    }
    function onKey(ev as WatchUi.KeyEvent) as Lang.Boolean {
        var k = ev.getKey();
        try {
            if (model.mode.equals("session-menu")) {
                if (k == WatchUi.KEY_UP) { model.menuIndex = (model.menuIndex+4)%5; }
                else if (k == WatchUi.KEY_DOWN) { model.menuIndex = (model.menuIndex+1)%5; }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.menuAction(); }
                else if (k == WatchUi.KEY_ESC) { model.closeMenu(); }
            } else if (model.mode.equals("discard-confirm")) {
                if (k == WatchUi.KEY_UP || k == WatchUi.KEY_DOWN) {
                    model.discardChoice=(model.discardChoice+1)%2;
                } else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) {
                    if (model.discardChoice==1) { model.discardSession(); }
                    else { model.mode="session-menu"; }
                } else if (k == WatchUi.KEY_ESC) { model.mode="session-menu"; }
            } else if (model.mode.equals("pairing")) {
                if (k == WatchUi.KEY_UP) { model.incDigit(1); }
                else if (k == WatchUi.KEY_DOWN) { model.incDigit(-1); }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.nextDigit(); }
                else if (k == WatchUi.KEY_ESC) { model.mode = "select"; }
            } else if (model.mode.equals("hub")) {
                if (k == WatchUi.KEY_UP) { model.hubIndex = (model.hubIndex+5)%6; }
                else if (k == WatchUi.KEY_DOWN) { model.hubIndex = (model.hubIndex+1)%6; }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.openHubItem(); }
                else if (k == WatchUi.KEY_ESC) { model.mode = "select"; }
            } else if (model.mode.equals("today") || model.mode.equals("forecast")) {
                if (k == WatchUi.KEY_UP || k == WatchUi.KEY_DOWN) { model.scrollList(k == WatchUi.KEY_DOWN ? 1 : -1); }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) {
                    if (model.agendaItems().size() > 0) {
                        model.detailOrigin=model.mode;model.detailOffset=0;model.mode="detail";
                    }
                } else if (k == WatchUi.KEY_ESC) { model.mode="hub"; }
             } else if (model.mode.equals("shopping-lists")) {
                if (k == WatchUi.KEY_UP || k == WatchUi.KEY_DOWN) {model.scrollList(k==WatchUi.KEY_DOWN?1:-1);}
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) {model.chooseShoppingList();}
                else if (k == WatchUi.KEY_ESC) {model.mode="hub";}
            } else if (model.mode.equals("people")) {
                if (k == WatchUi.KEY_UP || k == WatchUi.KEY_DOWN) {model.scrollList(k==WatchUi.KEY_DOWN?1:-1);}
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) {model.openPerson();}
                else if (k == WatchUi.KEY_ESC) {model.mode="hub";}
            } else if (model.mode.equals("person-detail")) {
                if (k == WatchUi.KEY_UP || k == WatchUi.KEY_DOWN) {model.scrollList(k==WatchUi.KEY_DOWN?1:-1);}
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) {model.openPersonPoint();}
                else if (k == WatchUi.KEY_ESC) {model.mode="people";}
            } else if (model.mode.equals("shopping")) {
                if (k == WatchUi.KEY_UP || k == WatchUi.KEY_DOWN) { model.scrollList(k == WatchUi.KEY_DOWN ? 1 : -1); }
                else if (k == WatchUi.KEY_START || k == WatchUi.KEY_ENTER) { model.toggleShopping(); }
                else if (k == WatchUi.KEY_ESC) { model.mode="shopping-lists"; }
            } else if (model.mode.equals("detail")) {
                if (k == WatchUi.KEY_UP) { if (model.detailOffset>0) { model.detailOffset--; } }
                else if (k == WatchUi.KEY_DOWN) { model.detailOffset++; }
                // BACK always returns exactly one navigation level. The person
                // and highlighted point are retained when returning to agenda.
                else if (k == WatchUi.KEY_ESC) { model.mode=model.detailOrigin; }
                // Preserve the legacy Today / Forecast START-to-close behavior,
                // but a colleague's point is dismissed only with BACK.
                else if ((k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) && !model.detailOrigin.equals("person-detail")) {
                    model.mode=model.detailOrigin;
                }
            } else if (model.mode.equals("syncing")) {
                if (k == WatchUi.KEY_ESC || k == WatchUi.KEY_LAP) { model.mode = "select"; model.lastMessage = "Sync im Hintergrund"; }
            } else if (model.mode.equals("select")) {
                if (k == WatchUi.KEY_UP) { model.chooseCategory(-1); }
                else if (k == WatchUi.KEY_DOWN) { model.chooseCategory(1); }
                else if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.begin(); }
                else if (k == WatchUi.KEY_MENU) { model.showHub(); }
                else if (k == WatchUi.KEY_ESC || k == WatchUi.KEY_LAP) { System.exit(); }
            } else if (model.mode.equals("running")) {
                if (k == WatchUi.KEY_ENTER || k == WatchUi.KEY_START) { model.pauseToggle(); }
                else if (k == WatchUi.KEY_ESC) { model.openMenu(); }
            }
        } catch(ex) { System.println("COMPASS 0.3.3 INPUT ERROR"); }
        model.redraw();
        return true;
    }
}
