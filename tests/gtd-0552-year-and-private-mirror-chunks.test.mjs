import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {webcrypto} from 'node:crypto';
import {sleepYearGroups,renderSleepYearDistribution} from '../client/src/sleep-year-v552.js';
import {renderSleepIntelligence} from '../client/src/sleep-intelligence-v550.js';
import {privateMirrorParts,joinMirrorParts,privateMirrorNeedsChunks} from '../client/src/private-device-chunks-v552.js';
import {privateMirror} from '../worker/src/private-device-mirror.js';
import {privateMirrorChunks} from '../worker/src/private-device-chunks-v552.js';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
const nights=[{day:'2025-11-12',sleepMinutes:365},{day:'2026-01-02',sleepMinutes:428},{day:'2026-01-03',sleepMinutes:462},{day:'2026-07-18',sleepMinutes:388},{day:'2026-10-19',sleepMinutes:420}];
test('Annual monthly box+dot shows all 12 months and missing months as absent, not zero',()=>{
 const g=sleepYearGroups(nights,'2026-10-20','month');assert.equal(g.length,12);
 assert.equal(g.find(x=>x.key==='2026-01').values.length,2);
 assert.equal(g.find(x=>x.key==='2026-02').median,null);
 const html=renderSleepYearDistribution(nights,'2026-10-20','month');
 assert.match(html,/Box = mittlere 50 %/);assert.match(html,/2026-01-02/);assert.doesNotMatch(html,/NaN|Infinity/);
});
test('Annual weekly and daily resolutions use the same data window and do not invent measurements',()=>{
 const weekly=sleepYearGroups(nights,'2026-10-20','week'),daily=sleepYearGroups(nights,'2026-10-20','day');
 assert.ok(weekly.length>=52);assert.equal(daily.length,5);assert.equal(weekly.flatMap(x=>x.values).length,5);
 for(const mode of ['week','day']){const html=renderSleepYearDistribution(nights,'2026-10-20',mode);assert.match(html,/5\//);assert.doesNotMatch(html,/NaN|Infinity/);}
 const full=renderSleepIntelligence({nights,today:'2026-10-20',period:'365',yearMode:'week'});
 assert.match(full,/data-action="insights-year-mode"/);assert.match(full,/aria-pressed="true" class="is-active">Woche/);
});
test('Large ciphertext splits into exact base64 chunks with correct reconstruction and bounds',()=>{
 const ciphertext='a'.repeat(900000);assert.ok(privateMirrorNeedsChunks(ciphertext));
 const parts=privateMirrorParts(ciphertext);assert.ok(parts.length>2);assert.equal(joinMirrorParts(parts,parts.length),ciphertext);
 assert.throws(()=>joinMirrorParts(parts.slice(1),parts.length),/Unvollständig/);
 assert.throws(()=>privateMirrorParts('a'.repeat(29_000_000)),/zu groß/);
});
function database(){
 const db=new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('../worker/migrations/0014_private_device_mirror.sql',import.meta.url),'utf8'));
 db.exec(readFileSync(new URL('../worker/migrations/0017_private_device_chunks.sql',import.meta.url),'utf8'));
 const env={DB:{prepare(sql){return {bind(...vals){return {first:async()=>db.prepare(sql).get(...vals)||null,run:async()=>({meta:{changes:Number(db.prepare(sql).run(...vals).changes)}})};}};}}};
 return {db,env};
}
const identity={sub:'owner-1'};
function call(env,kind,route,method='GET',payload=null,sub=identity.sub){
 const url=`https://unit.test/api/private-device/${kind}${route}`;
 const req=new Request(url,{method,...(payload?{body:JSON.stringify(payload)}:{})});
 return route===''?privateMirror(req,env,{sub}):privateMirrorChunks(req,env,{sub});
}
test('E2EE staged upload commits atomically, protects previous version, and isolates owners',async()=>{
 const {db,env}=database();try{
  const salt='a'.repeat(24),iv='b'.repeat(16);
  const original={baseVersion:0,salt,iv,ciphertext:'a'.repeat(96),compressed:true};
  assert.equal((await call(env,'health','','POST',original)).status,200);
  const transferId='12345678-1234-1234-1234-123456789abc';
  // Partial staged upload must NOT appear as a committed new version.
  const parts=['a'.repeat(160000),'a'.repeat(60000)];
  assert.equal((await call(env,'health','/parts','POST',{transferId,partIndex:0,part:parts[0]})).status,200);
  let snap=(await (await call(env,'health','')).json()).record;assert.equal(snap.version,1);assert.ok(!snap.chunked);
  const commit={transferId,partCount:parts.length,baseVersion:1,salt,iv,compressed:true};
  assert.equal((await call(env,'health','/commit','POST',commit)).status,409);
  assert.equal((await call(env,'health','/parts','POST',{transferId,partIndex:1,part:parts[1]})).status,200);
  assert.equal((await call(env,'health','/commit','POST',commit)).status,200);
  snap=(await (await call(env,'health','')).json()).record;assert.equal(snap.version,2);assert.equal(snap.chunkCount,2);
  const received=[];for(let i=0;i<2;i++)received.push((await (await call(env,'health',`/parts?transferId=${transferId}&partIndex=${i}`)).json()).part);
  assert.equal(joinMirrorParts(received,2),parts.join(''));
  assert.equal((await call(env,'health','/commit','POST',commit)).status,409); // stale version
  assert.equal((await (await call(env,'health','','GET',null,'another-owner')).json()).record,null);
  assert.equal((await call(env,'health',`/parts?transferId=${transferId}&partIndex=0`,'GET',null,'another-owner')).status,404);
 }finally{db.close();}
});
