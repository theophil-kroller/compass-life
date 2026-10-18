import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validHealthDay,startHealthPair,claimHealthPair,uploadHealthDays,listHealthDays,deleteHealthDays, listHealthDevices,revokeHealthDevice} from '../worker/src/health-daily.js';
import {parseEventImport,upcomingImportedEvents} from '../client/src/event-import.js';
import {schemaStatus} from '../worker/src/schema.js';

const dir=fileURLToPath(new URL('../worker/migrations/',import.meta.url));
function createDB(){
 const db=new DatabaseSync(':memory:');
 for(const name of ['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0004_planning_tasks.sql','0005_gtd_projects_agendas.sql','0006_gtd_context_review.sql','0007_project_hierarchy.sql','0008_watch_session_tombstones.sql','0009_health_daily.sql'])db.exec(readFileSync(join(dir,name),'utf8'));
 const wrap={prepare(sql){return {bind(...values){return {first:async()=>db.prepare(sql).get(...values)||null,all:async()=>({results:db.prepare(sql).all(...values)}),run:async()=>{const out=db.prepare(sql).run(...values);return {meta:{changes:Number(out.changes)}}}}},all:async()=>({results:db.prepare(sql).all()})}},batch:async list=>{for(const q of list)await q.run();}};
 return {db,env:{DB:wrap}};
}
function req(path,body,token,ip='test-ip'){return new Request('https://api.example'+path,{method:'POST',headers:{'CF-Connecting-IP':ip,...(token?{authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});}
const owner={sub:'owner-1',email:'owner@example.org'};
test('Health validation accepts sparse measurements but rejects malicious and nonsensical data',()=>{
 assert.equal(validHealthDay({day:'2026-10-18',steps:5000}),true);
 assert.equal(validHealthDay({day:'2026-10-18',sleepMinutes:460,exerciseMinutes:42}),true);
 assert.equal(validHealthDay({day:'2026-10-18'}),false);
 assert.equal(validHealthDay({day:'2026-02-30',steps:200}),false);
 assert.equal(validHealthDay({day:'2026-10-18',steps:-10}),false);
 assert.equal(validHealthDay({day:'2026-10-18',steps:400,owner_sub:'attacker'}),false);
});
test('Device pairing, scoped upload, idempotent day updates, revocation, deletion, real SQLite',async()=>{
 const {db,env}=createDB();try{
 assert.deepEqual(await schemaStatus(env.DB),{ready:true,requiredMigration:null,missing:[]});
 const start=await (await startHealthPair(env,owner)).json();assert.match(start.code,/^\d{8}$/);
 const claimed=await (await claimHealthPair(req('/api/health/pair/claim',{code:start.code}),env)).json();assert.match(claimed.token,/^ch1_[0-9a-f]{64}$/);
 assert.equal((await claimHealthPair(req('/api/health/pair/claim',{code:start.code}),env)).status,401);
 const today=new Date().toISOString().slice(0,10);
 const upload=req('/api/health/days',{days:[{day:today,steps:4500,sleepMinutes:420}]},claimed.token);
 assert.equal((await uploadHealthDays(upload,env)).status,200);
 assert.equal((await uploadHealthDays(req('/api/health/days',{days:[{day:today,steps:5000}]},claimed.token),env)).status,200);
 const rows=(await (await listHealthDays(new Request('https://api.example/api/health/days'),env,owner)).json()).days;
 assert.equal(rows[0].steps,5000);assert.equal(rows[0].sleepMinutes,420);
 assert.equal((await (await listHealthDays(new Request('https://api.example/api/health/days'),env,{sub:'other'})).json()).days.length,0);
 assert.equal((await uploadHealthDays(req('/api/health/days',{days:[{day:today,steps:1}]},'wrong-token'),env)).status,401);
 const deviceList=(await (await listHealthDevices(env,owner)).json()).devices;assert.equal(deviceList.length,1);
 assert.equal((await revokeHealthDevice(req('/api/health/device/revoke',{deviceHash:deviceList[0].deviceHash}),env,owner)).status,200);
 assert.equal((await uploadHealthDays(req('/api/health/days',{days:[{day:today,steps:1}]},claimed.token),env)).status,401);
 assert.equal((await deleteHealthDays(env,owner)).status,200);
 assert.equal((await(await listHealthDays(new Request('https://api.example/api/health/days'),env,owner)).json()).days.length,0);
 }finally{db.close();}
});
test('Event JSON import requires source, deduplicates and avoids HTML code execution',()=>{
 const entry={title:'  Test Oper  ',date:'2026-11-11',city:'Graz',venue:'Oper Graz',category:'Oper',sourceUrl:'https://oper-graz.example/termine'};
 const first=parseEventImport(JSON.stringify({events:[entry,{...entry,title:'Test  Oper'}]}));
 assert.equal(first.added.length,1);assert.equal(first.duplicates,1);
 assert.equal(parseEventImport(JSON.stringify({events:[entry]}),first.added).added.length,0);
 assert.equal(upcomingImportedEvents(first.added,'2026-11-01').length,1);
 assert.throws(()=>parseEventImport(JSON.stringify({events:[{...entry,sourceUrl:'javascript:alert(1)'}]})),/Quellenlink/);
 assert.throws(()=>parseEventImport('{not JSON}'),/gültiges JSON/);
});
test('Health migration is additive and Android source requests explicit permissions',()=>{
 const sql=readFileSync(new URL('../worker/migrations/0009_health_daily.sql',import.meta.url),'utf8');
 assert.doesNotMatch(sql,/\b(?:DROP|TRUNCATE)\b/i);
 const app=readFileSync(new URL('../android/CompassWidget/app/src/main/java/at/compasslife/widget/HealthCompanionActivity.kt',import.meta.url),'utf8');
 for(const marker of ['getSdkStatus','PermissionController.createRequestPermissionResultContract','StepsRecord.COUNT_TOTAL','SLEEP_DURATION_TOTAL','EXERCISE_DURATION_TOTAL','HealthTokenStore.save','/api/health/days'])assert.ok(app.includes(marker),marker);
});
