import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {widgetEvents} from '../worker/src/widget-preview.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const addDays=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
function fixture(){
 const db=new DatabaseSync(':memory:');
 for(const file of ['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0004_planning_tasks.sql','0005_gtd_projects_agendas.sql','0006_gtd_context_review.sql','0007_project_hierarchy.sql','0008_watch_session_tombstones.sql','0009_health_daily.sql','0010_widget_preview.sql','0011_discovery_events.sql','0012_weekly_review.sql'])
  db.exec(read('worker/migrations/'+file));
 const wrap={prepare(sql){return {bind(...args){
  const statement=db.prepare(sql);
  return {
   first:async()=>statement.get(...args)||null,
   all:async()=>({results:statement.all(...args)}),
   run:async()=>({meta:{changes:Number(statement.run(...args).changes)}})
  };
 }}}};
 return {db,env:{DB:wrap}};
}
function event(owner,date,status,title='Event',more={}){
 return [owner,title+'|'+date+'|Graz',JSON.stringify({title,date,city:'Graz',venue:'Ort',category:'Konzert',sourceUrl:'https://example.org/e',...more}),status,0,1,new Date().toISOString()];
}
test('Event widget shows next seven days only, favorites first, without cross-owner leakage',async()=>{
 const {db,env}=fixture();try{
 const token='cw1_'+('a'.repeat(64)),hash=createHash('sha256').update(token).digest('hex');
 db.prepare('INSERT INTO widget_devices(token_hash,owner_sub,label,created_at) VALUES(?,?,?,?)').run(hash,'owner','Test',new Date().toISOString());
 const today=new Date().toISOString().slice(0,10);
 const put=(row)=>db.prepare('INSERT INTO discovery_events(owner_sub,event_key,event_json,status,removed,version,updated_at) VALUES(?,?,?,?,?,?,?)').run(...row);
 put(event('owner',addDays(today,2),'open','Konzert'));
 put(event('owner',addDays(today,6),'saved','Zouk'));
 put(event('owner',addDays(today,7),'open','Zu spät'));
 put(event('owner',addDays(today,-1),'open','Vergangen'));
 put(event('other',addDays(today,1),'saved','Nicht für mich'));
 put(event('owner',addDays(today,1),'hidden','Ausgeblendet'));
 const req=new Request('https://example.org/api/widget/events?day='+today,{headers:{Authorization:'Bearer '+token}});
 const response=await widgetEvents(req,env);assert.equal(response.status,200);
 const x=await response.json();assert.equal(x.total,2);assert.equal(x.events.length,2);assert.equal(x.events[0].title,'Zouk');assert.equal(x.events[0].saved,true);
 assert.deepEqual(x.events.map(y=>y.title),['Zouk','Konzert']);
 const invalid=await widgetEvents(new Request('https://example.org/api/widget/events?day=2031-01-01',{headers:{Authorization:'Bearer '+token}}),env);assert.equal(invalid.status,400);
 db.prepare('UPDATE widget_devices SET revoked=1 WHERE token_hash=?').run(hash);
 assert.equal((await widgetEvents(req,env)).status,401);
 assert.equal((await widgetEvents(new Request('https://example.org/api/widget/events?day='+today),env)).status,401);
 }finally{db.close()}
});
test('Native widgets are distinct, only focus contains task titles, focus contains no health indicators',()=>{
 const focus=read('android/CompassWidget/app/src/main/java/at/compasslife/widget/TodayWidget.java');
 const events=read('android/CompassWidget/app/src/main/java/at/compasslife/widget/DiscoveryWidget.java');
 const focusXml=read('android/CompassWidget/app/src/main/res/layout/widget_today.xml');
 const eventXml=read('android/CompassWidget/app/src/main/res/layout/widget_events.xml');
 const manifest=read('android/CompassWidget/app/src/main/AndroidManifest.xml');
 assert.match(focus,/waitingFor/);assert.match(focus,/nextActions/);assert.doesNotMatch(focus,/sleepAverageMinutes|widget_health/);
 assert.match(focus,/showTitles/, 'privacy opt-in');
 assert.match(events,/\/api\/widget\/events/);assert.match(events,/next seven days|next seven|sieben/i);
 assert.match(focusXml,/widget_waiting/);assert.doesNotMatch(focusXml,/widget_health/);
 assert.match(eventXml,/events_row3/);assert.match(manifest,/\.DiscoveryWidget/);
 assert.match(read('android/CompassWidget/app/src/main/res/xml/widget_events_info.xml'),/widget_events/);
});
test('Health background sync requires explicit opt-in, own permission, daily WorkManager and supports off switch',()=>{
 const health=read('android/CompassWidget/app/src/main/java/at/compasslife/widget/HealthDailySync.kt');
 const ui=read('android/CompassWidget/app/src/main/java/at/compasslife/widget/HealthCompanionActivity.kt');
 const manifest=read('android/CompassWidget/app/src/main/AndroidManifest.xml');
 const gradle=read('android/CompassWidget/app/build.gradle.kts');
 for(const key of ['PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND','FEATURE_READ_HEALTH_DATA_IN_BACKGROUND','HealthDailyWorker','PeriodicWorkRequestBuilder','24,TimeUnit.HOURS','WorkManager','ExistingPeriodicWorkPolicy','fun disable','Result.retry','HealthTokenStore.load'])assert.ok(health.includes(key),key);
 assert.match(ui,/awaitingBackground=true/);assert.match(ui,/HealthSyncSchedule\.enable/);assert.match(ui,/HealthSyncSchedule\.disable/);
 assert.match(manifest,/READ_HEALTH_DATA_IN_BACKGROUND/);
 assert.match(gradle,/work-runtime-ktx/);
});
test('Projects preserve 3 panes on desktop and Worker is release 0.5.5 API 11',()=>{
 const css=read('client/src/style.css');const worker=read('worker/src/index.js');
 assert.match(css,/@media\(min-width:1020px\)/);
 assert.match(css,/\.projects-layout\.omni-projects:not\(\.is-focused\)>\.project-inspector\{grid-column:3/);
 assert.match(worker,/apiVersion:11,release:'0\.5\.5'/);
 assert.match(worker,/widgetEvents\(req,env\)/);
 assert.match(read('client/src/main.js'),/COMPASS_CLIENT_VERSION='0\.5\.20'/);
});
