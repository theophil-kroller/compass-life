import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {healthViewModel,healthBars,healthObservation} from '../client/src/health-visual.js';
import {parseEventImport,eventAppearance,upcomingImportedEvents} from '../client/src/event-import.js';
import {startWidgetPair,claimWidgetPair,widgetSummary,listWidgetDevices,revokeWidgetDevice} from '../worker/src/widget-preview.js';
import {schemaStatus} from '../worker/src/schema.js';
const dir=fileURLToPath(new URL('../worker/migrations/',import.meta.url));
function makeDb(){
 const db=new DatabaseSync(':memory:');
 for(const name of ['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0004_planning_tasks.sql','0005_gtd_projects_agendas.sql','0006_gtd_context_review.sql','0007_project_hierarchy.sql','0008_watch_session_tombstones.sql','0009_health_daily.sql','0010_widget_preview.sql'])db.exec(readFileSync(join(dir,name),'utf8'));
 const wrapper={prepare(sql){const stmt=db.prepare(sql);return {bind(...args){return {first:async()=>stmt.get(...args)||null,run:async()=>({meta:{changes:Number(stmt.run(...args).changes)}}),all:async()=>({results:stmt.all(...args)})}},first:async()=>stmt.get()||null,all:async()=>({results:stmt.all()})}}};
 return {db,env:{DB:wrapper}};
}
const owner={sub:'owner-052',email:'test@example.org'};
const post=(path,body,token)=>new Request('https://api.example'+path,{method:'POST',headers:{'CF-Connecting-IP':'192.0.2.99',...(token?{authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
test('Health charts preserve missing data and use measurement-specific denominators',()=>{
 const vm=healthViewModel([{day:'2026-10-16',steps:2500,sleepMinutes:480},{day:'2026-10-17',steps:6000,sleepMinutes:null},{day:'2026-10-18',steps:0,exerciseMinutes:38}], '2026-10-18',7);
 assert.equal(vm.points.length,7);assert.equal(vm.stats.steps.count,3);assert.equal(vm.stats.steps.average,2833);assert.equal(vm.stats.sleepMinutes.count,1);
 assert.equal(vm.stats.exerciseMinutes.count,1);assert.equal(healthBars(vm.points,'sleepMinutes').filter(x=>x.value===null).length,6);
 assert.match(healthObservation(vm),/Schlaf ist an 1/);
});
test('AI event import accepts fenced JSON and repairable escapes, preserves honest descriptions and warns by item',()=>{
 const sample={title:'Konzert',date:'2026-11-12',city:'Graz',venue:'Saal',category:'Ballett',description:'Ein Beschreibungstext aus offizieller Quelle.',sourceUrl:'https://example.org/events'};
 const raw='```json\n'+JSON.stringify({events:[sample]}).replace('https://','https\\://').replace('example.org','example\\.org')+'\n```';
 const parsed=parseEventImport(raw);assert.equal(parsed.added.length,1);assert.equal(parsed.added[0].sourceUrl,sample.sourceUrl);assert.equal(parsed.added[0].description,sample.description);
 assert.equal(eventAppearance('Sport')[0],'⚽');
 assert.equal(upcomingImportedEvents(parsed.added,'2026-11-01').length,1);
 assert.throws(()=>parseEventImport(JSON.stringify({events:[sample,{...sample,category:'Unbekannt'}]})),/Eintrag 2.*Kategorie/);
 assert.throws(()=>parseEventImport(JSON.stringify({events:[{...sample,sourceUrl:'javascript:alert(1)'}]})),/Eintrag 1.*HTTPS/);
});
test('Widget pairing is scoped, one-time, hashed at rest, authorizes only own rows and revokes instantly',async()=>{
 const {db,env}=makeDb();try{
  assert.deepEqual(await schemaStatus(env.DB),{ready:true,requiredMigration:null,missing:[]});
  const code=(await (await startWidgetPair(env,owner)).json()).code;
  const first=await claimWidgetPair(post('/api/widget/pair/claim',{code}),env);assert.equal(first.status,200);
  const token=(await first.json()).token;assert.match(token,/^cw1_[0-9a-f]{64}$/);
  assert.equal((await claimWidgetPair(post('/api/widget/pair/claim',{code}),env)).status,401);
  const row=db.prepare('SELECT token_hash FROM widget_devices').get();assert.ok(row.token_hash.length===64&&!row.token_hash.includes(token));
  const day=new Date().toISOString().slice(0,10);
  db.prepare(`INSERT INTO planning_tasks(owner_sub,id,title,note,category,planned_date,completed,archived,workflow,version,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)`)
    .run(owner.sub,'11111111-1111-4111-8111-111111111111','Wichtiger Task','geheim','Allgemein',day,0,0,'next',1,new Date().toISOString());
  db.prepare(`INSERT INTO planning_tasks(owner_sub,id,title,note,category,planned_date,completed,archived,workflow,version,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)`)
    .run('other','22222222-2222-4222-8222-222222222222','Anderer','geheim','Allgemein',day,0,0,'next',1,new Date().toISOString());
  const url='https://api.example/api/widget/summary?day='+day;
  assert.equal((await widgetSummary(new Request(url,{headers:{authorization:'Bearer cs1_invalid'}}),env)).status,401);
  const summary=(await(await widgetSummary(new Request(url,{headers:{authorization:'Bearer '+token}}),env)).json());
  assert.equal(summary.openToday,1);assert.equal(summary.next.title,'Wichtiger Task');assert.ok(!JSON.stringify(summary).includes('geheim'));
  const devices=(await(await listWidgetDevices(env,owner)).json()).devices;assert.equal(devices.length,1);
  await revokeWidgetDevice(post('/api/widget/device/revoke',{deviceHash:devices[0].deviceHash}),env,owner);
  assert.equal((await widgetSummary(new Request(url,{headers:{authorization:'Bearer '+token}}),env)).status,401);
 }finally{db.close();}
});
test('Android widget preview has a separate private token and user-controlled title visibility',()=>{
 const android=fileURLToPath(new URL('../android/CompassWidget/app/src/main/java/at/compasslife/widget/',import.meta.url));
 const widget=readFileSync(join(android,'TodayWidget.java'),'utf8'),companion=readFileSync(join(android,'HealthCompanionActivity.kt'),'utf8');
 for(const term of ['/api/widget/summary','WidgetTokenStore','showTitles','WidgetOpenActivity'])assert.ok(widget.includes(term)||companion.includes(term),term);
 assert.match(companion,/\/api\/widget\/pair\/claim/);assert.match(widget,/getBoolean\("showTitles",false\)/);
 assert.doesNotMatch(widget,/localStorage|auth_session|cs1_/);
 const sql=readFileSync(join(dir,'0010_widget_preview.sql'),'utf8');assert.doesNotMatch(sql,/\b(?:DROP|TRUNCATE)\b/i);
});

test('Interest imports distinguish Kabarett, dance genres and Bujinkan, and validate photo source',async()=>{
 const {EVENT_CATEGORIES,eventArea,eventCountry,discoveryPrompt}=await import('../client/src/event-import.js');
 for(const category of ['Kabarett','Zouk','Kizomba','Bachata','Tanz','Bujinkan']){
   assert.ok(EVENT_CATEGORIES.includes(category),category);
   const data=parseEventImport(JSON.stringify({events:[{title:'Belegte Veranstaltung',date:'2026-12-12',city:'Prag',country:'Tschechien',venue:'Halle',category,
      description:'Ein offizieller, sachlicher Programmtext.',sourceUrl:'https://events.example.org/ticket',imageUrl:'https://events.example.org/photo.jpg'}]}));
   assert.equal(data.added[0].category,category);assert.equal(data.added[0].imageUrl,'https://events.example.org/photo.jpg');
   assert.equal(eventArea(data.added[0]),'europe');
   assert.equal(eventAppearance(category)[0].length>0,true);
 }
 const old=parseEventImport(JSON.stringify({events:[{title:'Lokale Vorstellung',date:'2026-11-05',city:'Graz',venue:'Kulturhaus',category:'Cabaret',sourceUrl:'https://events.example.org/abc'}]}));
 assert.equal(old.added[0].category,'Kabarett');assert.equal(eventArea(old.added[0]),'graz');assert.equal(eventCountry(old.added[0]),'Österreich');
 assert.throws(()=>parseEventImport(JSON.stringify({events:[{...old.added[0],imageUrl:'data:image/svg+xml;base64,aaaa'}]})),/Eintrag 1.*Bildlink/);
 assert.match(discoveryPrompt,/Kabarett/);assert.match(discoveryPrompt,/Conny und Dado/);assert.match(discoveryPrompt,/japanischen Shihan/);
});
