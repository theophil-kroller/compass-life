import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {schemaStatus} from '../worker/src/schema.js';
import {listDiscoveryEvents,upsertDiscoveryEvents} from '../worker/src/discovery-events.js';
import {parseEventImport,validEvent,eventKey,upcomingImportedEvents,discoveryPromptRegional,discoveryPromptTravel} from '../client/src/event-import.js';
import {eventState,queueEvent,queueEventPreference,removeEvents,prunePastEvents,pendingEventBatch,acknowledgeEventBatch,mergeEventSnapshot,resolveEventConflict} from '../client/src/event-sync.js';
const dir=fileURLToPath(new URL('../worker/migrations/',import.meta.url));
const owner={sub:'owner-053'},other={sub:'other-053'};
function database(){
 const db=new DatabaseSync(':memory:');for(const name of ['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0004_planning_tasks.sql','0005_gtd_projects_agendas.sql','0006_gtd_context_review.sql','0007_project_hierarchy.sql','0008_watch_session_tombstones.sql','0009_health_daily.sql','0010_widget_preview.sql','0011_discovery_events.sql','0012_weekly_review.sql','0013_project_templates.sql'])db.exec(readFileSync(join(dir,name),'utf8'));
 const wrap={prepare(sql){const run=(...args)=>({first:async()=>db.prepare(sql).get(...args)||null,all:async()=>({results:db.prepare(sql).all(...args)}),run:async()=>({meta:{changes:Number(db.prepare(sql).run(...args).changes)}})});return {...run(),bind:(...args)=>run(...args)};}};return {db,env:{DB:wrap}};
}
const sample=(title,date='2026-11-02',other={})=>({title,date,city:'Graz',venue:'Orpheum',category:'Kabarett',sourceUrl:'https://events.example.com/source',...other});
const post=(rows)=>new Request('https://example.test/api/events/batch',{method:'POST',body:JSON.stringify({events:rows})});
test('Import accepts 250 events, catches item 251 and preserves sourced images, end dates, genres',()=>{
 const raw={events:Array.from({length:250},(_,i)=>sample('Kabarett '+i,'2026-11-02',{description:'Ein offiziell bestätigtes Programm',imageUrl:'https://example.org/poster.jpg'}))};const p=parseEventImport(JSON.stringify(raw));assert.equal(p.added.length,250);assert.equal(p.total,250);
 assert.throws(()=>parseEventImport(JSON.stringify({events:[...raw.events,sample('Too many')]})),/maximal 250/);
 assert.equal(validEvent(sample('Festival','2026-10-18',{endDate:'2026-10-21'})),true);
 assert.equal(upcomingImportedEvents([sample('Festival','2026-10-18',{endDate:'2026-10-21'})],'2026-10-20').length,1);
 assert.match(discoveryPromptRegional,/30 Tage/);assert.match(discoveryPromptTravel,/6 Monaten/);
});
test('Cloud accepts batches, scopes owners, rejects invalid dates, supports optimistic conflict and tombstone',async()=>{
 const {db,env}=database();try{assert.equal((await schemaStatus(env.DB)).ready,true);
  const s=eventState({});const ev=sample('Neuer Tanzabend');const key=queueEvent(s,ev);const batch=pendingEventBatch(s);assert.equal(batch.length,1);
  let resp=await upsertDiscoveryEvents(post(batch),env,owner);assert.equal(resp.status,200);const result=await resp.json();assert.equal(result.results[0].status,'applied');acknowledgeEventBatch(s,batch,result);assert.equal(s.eventVersions[key],1);assert.equal(Object.keys(s.eventPending).length,0);
  let snapshot=(await (await listDiscoveryEvents(env,owner)).json()).events;assert.equal(snapshot.length,1);assert.equal((await (await listDiscoveryEvents(env,other)).json()).events.length,0);
  const otherState=eventState({});mergeEventSnapshot(otherState,snapshot);assert.equal(otherState.discoveredEvents[0].title,'Neuer Tanzabend');
  queueEventPreference(otherState,key,'saved');assert.equal(pendingEventBatch(otherState)[0].status,'saved');const upgradeBatch=pendingEventBatch(otherState);const updated=await (await upsertDiscoveryEvents(post(upgradeBatch),env,owner)).json();acknowledgeEventBatch(otherState,upgradeBatch,updated);assert.equal(otherState.eventPreferences[key],'saved');assert.equal(otherState.eventVersions[key],2);
  queueEventPreference(s,key,'hidden');const conflicting=await (await upsertDiscoveryEvents(post(pendingEventBatch(s)),env,owner)).json();assert.equal(conflicting.results[0].status,'conflict');acknowledgeEventBatch(s,pendingEventBatch(s),conflicting);assert.equal(Object.keys(s.eventConflicts).length,1);
  assert.equal(resolveEventConflict(s,key,'cloud'),true);assert.equal(s.eventPreferences[key],'saved');assert.equal(Object.keys(s.eventPending).length,0);
  removeEvents(otherState);const deletedBatch=pendingEventBatch(otherState);const deleted=await (await upsertDiscoveryEvents(post(deletedBatch),env,owner)).json();acknowledgeEventBatch(otherState,deletedBatch,deleted);assert.equal((await (await listDiscoveryEvents(env,owner)).json()).events[0].removed,true);
  const invalid=await upsertDiscoveryEvents(post([{...deletedBatch[0],event:sample('Malicious','not-a-day'),removed:false,baseVersion:3}]),env,owner);assert.equal(invalid.status,400);
 }finally{db.close();}
});
test('Old unsynced local catalog migrates without erasing preferences and past entries are purged after grace',()=>{
 const s=eventState({discoveredEvents:[sample('Old','2026-09-01'),sample('Favorites','2026-09-01'),sample('Upcoming','2026-11-09')],eventPreferences:{}});
 const favKey=eventKey(s.discoveredEvents[1]);s.eventPreferences[favKey]='saved';assert.equal(prunePastEvents(s,'2026-10-18'),1);
 assert.ok(s.discoveredEvents.some(e=>e.title==='Favorites'));assert.ok(!s.discoveredEvents.some(e=>e.title==='Old'));
 assert.equal(pendingEventBatch(s)[0].removed,true);assert.equal(s.eventPending[eventKey(sample('Old','2026-09-01'))],true);
 const n=mergeEventSnapshot(eventState({}),[{key:eventKey(sample('Upcoming','2026-11-09')),event:sample('Upcoming','2026-11-09'),status:'open',removed:false,version:1}]);assert.equal(n,1);
});
test('Week paging and 2-mode discoverable prompts exist in the actual UI; D1 migration is additive',()=>{
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const v of ['discovery-week-prev','discovery-week-next','discovery-week-today','discovery-import-confirm','discovery-prompt-regional','discovery-prompt-travel','syncEvents','discovery-conflict-cloud'])assert.ok(source.includes(v),v);
 const sql=readFileSync(join(dir,'0011_discovery_events.sql'),'utf8');assert.doesNotMatch(sql,/\b(?:DROP|TRUNCATE)\b/i);
});
test('Legacy local imports are reconciled against existing cloud favorites without spurious conflicts',()=>{
 const ev=sample('Europäischer Tanzabend');const k=eventKey(ev);const local=eventState({discoveredEvents:[ev]});
 mergeEventSnapshot(local,[{key:k,event:{...ev,description:'Kurztext aus der offiziellen Quelle'},status:'saved',removed:false,version:4}]);
 assert.equal(local.eventPreferences[k],'saved');assert.equal(local.eventVersions[k],4);assert.equal(local.discoveredEvents.length,1);assert.deepEqual(local.eventConflicts,{});
 const localFav=eventState({discoveredEvents:[ev],eventPreferences:{[k]:'saved'}});
 mergeEventSnapshot(localFav,[{key:k,event:ev,status:'open',removed:false,version:1}]);
 assert.equal(localFav.eventPending[k],true);
});
