using Toybox.Application;
using Toybox.Application.Storage;
using Toybox.Attention;
using Toybox.Communications;
using Toybox.Cryptography;
using Toybox.Graphics;
using Toybox.Lang;
using Toybox.Sensor;
using Toybox.SensorHistory;
using Toybox.System;
using Toybox.Time;
using Toybox.Timer;
using Toybox.WatchUi;

class CompassApp extends Application.AppBase {
    var model;
    function initialize() { AppBase.initialize(); model = new CompassModel(); }
    function getInitialView() { return [new CompassView(model), new CompassInput(model)]; }
    function onStop(state) { model.onExit(); }
}

class CompassModel {
    const API = "https://compass-api.theophil-tiger.workers.dev";
    const LABELS = ["Forschung", "Pruefungskorrektur", "Pruefungserstellung", "Verwaltung", "Meeting", "Weiterbildung", "Familie", "Beziehungsdynamiken"];
    var mode = "select"; // select, running, pairing, syncing
    var index = 0;
    var pomodoro = true;
    var running = false;
    var paused = false;
    var startEpoch = 0;
    var lastEpoch = 0;
    var focusSec = 0;
    var breakSec = 0;
    var totalSec = 0;
    var pomodoros = 0;
    var phase = "focus";
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
        timer = new Timer.Timer();
        timer.start(method(:tick), 1000, true);
    }
    function redraw() { WatchUi.requestUpdate(); }
    function now() { return Time.now().value(); }
    function begin() {
        if(queue.size()>=20){lastMessage="Speicher voll: Sync";redraw();return;}
        running=true;paused=false;startEpoch=now();lastEpoch=startEpoch;
        focusSec=0;breakSec=0;totalSec=0;pomodoros=0;phase="focus";phaseSec=0;
        hrPoints=[];bbPoints=[];hrLast=null;bbStart=readBodyBattery();if(bbStart!=null)bbPoints.add([0,bbStart]);mode="running";
        try { Sensor.setEnabledSensors([Sensor.SENSOR_HEARTRATE]); } catch(ex) { }
        redraw();
    }
    function tick() {
        if(mode=="running" && running && !paused) {
            var t=now();var delta=t-lastEpoch;
            if(delta<0 || delta>5) { lastEpoch=t;redraw();return; }
            lastEpoch=t;totalSec+=delta;
            if(phase=="break") {breakSec+=delta;} else {focusSec+=delta;}
            phaseSec+=delta;
            if(totalSec%30==0 && delta>0)sampleHeartRate();
            if(totalSec%300==0 && delta>0 && bbPoints.size()<72){var bb=readBodyBattery();if(bb!=null)bbPoints.add([totalSec,bb]);}
            if(pomodoro && phase=="focus" && phaseSec>=1500){pomodoros++;phase="focus-due";alert();}
            else if(pomodoro && phase=="break" && phaseSec>=300){phase="focus";phaseSec=0;alert();}
        }
        redraw();
    }
    function alert() {try { Attention.vibrate([new Attention.VibeProfile(50,400),new Attention.VibeProfile(0,200),new Attention.VibeProfile(50,400)]); }catch(ex) {}}
    function sampleHeartRate() {
        try {var info=Sensor.getInfo();if(info!=null && info.heartRate!=null){hrLast=info.heartRate;
           if(hrPoints.size()<180)hrPoints.add([totalSec,hrLast]);}}
        catch(ex) { }
    }
    function readBodyBattery() {
        try {
            if((Toybox has :SensorHistory) && (Toybox.SensorHistory has :getBodyBatteryHistory)) {
                var iter=SensorHistory.getBodyBatteryHistory({:period=>1});
                if(iter!=null){var sample=iter.next();if(sample!=null)return sample.data;}
            }
        }catch(ex) { }
        return null;
    }
    function pauseToggle() {
        if(!running)return;
        paused=!paused;lastEpoch=now();redraw();
    }
    function finish() {
        if(!running)return;
        sampleHeartRate();bbEnd=readBodyBattery();
        if(bbEnd!=null && bbPoints.size()<72)bbPoints.add([totalSec,bbEnd]);
        running=false;paused=false;mode="select";
        var raw=Cryptography.randomBytes(16);var hex="";
        for(var i=0;i<raw.size();i++){hex+=raw[i].format("%02x");}
        var item={"id"=>"w"+hex,"activity"=>LABELS[index],"startedAt"=>startEpoch,
          "durationSec"=>totalSec,"focusSec"=>focusSec,"breakSec"=>breakSec,
          "pomodoros"=>pomodoros,"hrSamples"=>hrPoints,"bbSamples"=>bbPoints,"bbStart"=>bbStart,"bbEnd"=>bbEnd};
        if(totalSec>0){
            if(queue.size()<20){queue.add(item);Storage.setValue("sessions",queue);lastMessage="Gespeichert";}
            else {lastMessage="Speicher voll: Sync";}
        }
        try {Sensor.setEnabledSensors([]);}catch(ex){}
        redraw();
        if(token!=null && queue.size()>0)sync();
    }
    function onExit(){if(running)finish();}
    function enterPair(){mode="pairing";code="00000000";digit=0;lastMessage="";redraw();}
    function incDigit(dir){
        var s="";
        for(var i=0;i<8;i++){
            var val=code.substring(i,i+1).toNumber();
            if(i==digit)val=(val+dir+10)%10;
            s+=val.toString();
        }
        code=s;redraw();
    }
    function nextDigit(){
        if(digit<7){digit++;redraw();return;}
        mode="syncing";lastMessage="Verbinde ...";redraw();
        try {
          Communications.makeWebRequest(API+"/api/watch/pair/claim",{"code"=>code},
            {:method=>Communications.HTTP_REQUEST_METHOD_POST,
             :headers=>{"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON},
             :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON},method(:pairDone));
        } catch(ex){mode="select";lastMessage="Keine Handy-Verbindung";redraw();}
    }
    function pairDone(status, data){
        mode="select";
        if(status==200 && data!=null && data.hasKey("token")){
          token=data["token"];Storage.setValue("watchToken",token);lastMessage="Verbunden";
        }else{lastMessage="Pairing fehlgeschlagen";}
        redraw();
    }
    function sync(){
        if(token==null){enterPair();return;}
        if(queue.size()==0){lastMessage="Alles uebertragen";redraw();return;}
        if(waiting)return;
        waiting=true;mode="syncing";lastMessage="Uebertrage ...";redraw();
        try {
          Communications.makeWebRequest(API+"/api/watch/sessions",queue[0],
            {:method=>Communications.HTTP_REQUEST_METHOD_POST,
             :headers=>{"Content-Type"=>Communications.REQUEST_CONTENT_TYPE_JSON,"Authorization"=>"Bearer "+token},
             :responseType=>Communications.HTTP_RESPONSE_CONTENT_TYPE_JSON},method(:syncDone));
        }catch(ex){waiting=false;mode="select";lastMessage="Keine Handy-Verbindung";redraw();}
    }
    function syncDone(status,data){
        waiting=false;mode="select";
        if(status==200 && data!=null && data["ok"]==true){
            queue.remove(queue[0]);Storage.setValue("sessions",queue);
            lastMessage="Sync OK";
            if(queue.size()>0){sync();return;}
        }else{lastMessage=status==401?"Uhr neu koppeln":"Offline: spaeter Sync";}
        redraw();
    }
}

class CompassView extends WatchUi.View {
    var model;
    function initialize(m){View.initialize();model=m;}
    function line(dc,txt,y,font,color){dc.setColor(color,Graphics.COLOR_TRANSPARENT);dc.drawText(dc.getWidth()/2,y,font,txt,Graphics.TEXT_JUSTIFY_CENTER);}
    function onUpdate(dc){
       var w=dc.getWidth();var h=dc.getHeight();
       dc.setColor(0x142722,Graphics.COLOR_TRANSPARENT);dc.clear();
       line(dc,"COMPASS",h/9,Graphics.FONT_SMALL,0xb8d4bb);
       if(model.mode=="pairing"){
          line(dc,"Code von Compass",h/4,Graphics.FONT_TINY,0xffffff);
          line(dc,model.code,h/2-15,Graphics.FONT_LARGE,0xf1d8a4);
          line(dc,"UP/DOWN: Ziffer",h*3/4,Graphics.FONT_TINY,0xffffff);
          line(dc,"START: weiter",h*3/4+18,Graphics.FONT_TINY,0xffffff);
       }else if(model.mode=="running"){
          line(dc,model.LABELS[model.index],h/4,Graphics.FONT_SMALL,0xe2ebe4);
          var secs=model.totalSec;
          var m=(secs/60).toNumber();
          var ss=secs%60;
          var digits=(ss<10?"0":"")+ss.toString();
          line(dc,m.toString()+":"+digits,h/2-14,Graphics.FONT_LARGE,0xffffff);
          line(dc,model.paused?"PAUSE":model.pomodoro?(model.phase=="break"?"Pomodoro Pause":phase=="focus-due"?"Pause? DOWN":"Pomodoro Fokus"):"Aktiv",h*2/3,Graphics.FONT_SMALL,0xb8d4bb);
          line(dc,"HR "+(model.hrLast==null?"–":model.hrLast.toString())+"  BB "+(model.bbStart==null?"–":model.bbStart.toString()),h*2/3+25,Graphics.FONT_TINY,0xe2ebe4);
       }else{
          line(dc,model.LABELS[model.index],h/3,Graphics.FONT_MEDIUM,0xffffff);
          line(dc,model.pomodoro?"25 / 5 Pomodoro":"Freier Timer",h/2,Graphics.FONT_SMALL,0xb8d4bb);
          line(dc,model.lastMessage,h*2/3,Graphics.FONT_TINY,0xf1d8a4);
          line(dc,model.queue.size().toString()+" lokal gespeichert",h*2/3+20,Graphics.FONT_TINY,0xb8d4bb);
          line(dc,"UP/DOWN Auswahl",h*5/6-15,Graphics.FONT_TINY,0xffffff);
          line(dc,"START los | MENU Modus",h*5/6,Graphics.FONT_TINY,0xffffff);
       }
    }
}
class CompassInput extends WatchUi.InputDelegate {
    var model;
    function initialize(m){InputDelegate.initialize();model=m;}
    function onKey(ev){
        var k=ev.getKey();
        if(model.mode=="pairing"){
          if(k==WatchUi.KEY_UP){model.incDigit(1);return true;}
          if(k==WatchUi.KEY_DOWN){model.incDigit(-1);return true;}
          if(k==WatchUi.KEY_ENTER){model.nextDigit();return true;}
          if(k==WatchUi.KEY_ESC){model.mode="select";model.redraw();return true;}
        }else if(model.mode=="running"){
          if(k==WatchUi.KEY_ENTER){model.pauseToggle();return true;}
          if(k==WatchUi.KEY_DOWN && model.phase=="focus-due") {model.phase="break";model.phaseSec=0;model.redraw();return true;}
          if(k==WatchUi.KEY_UP && model.phase=="break") {model.phase="focus";model.phaseSec=0;model.redraw();return true;}
          if(k==WatchUi.KEY_ESC){model.finish();return true;}
        }else if(model.mode=="select"){
          if(k==WatchUi.KEY_UP){model.index=(model.index+model.LABELS.size()-1)%model.LABELS.size();model.redraw();return true;}
          if(k==WatchUi.KEY_DOWN){model.index=(model.index+1)%model.LABELS.size();model.redraw();return true;}
          if(k==WatchUi.KEY_MENU){model.pomodoro=!model.pomodoro;model.redraw();return true;}
          if(k==WatchUi.KEY_ENTER){model.begin();return true;}
          if(k==WatchUi.KEY_LAP){model.sync();return true;}
          if(k==WatchUi.KEY_ESC){model.sync();return true;}
        }
        return false;
    }
}
