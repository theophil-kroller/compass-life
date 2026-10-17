import test from 'node:test';
import assert from 'node:assert/strict';
import {validWatchSession,createPair,claimPair,acceptWatchSession,listWatchSessions} from '../worker/src/watch.js';

const sample={id:'w'+'a'.repeat(32),activity:'Forschung',startedAt:Math.floor(Date.now()/1000)-200,durationSec:180,focusSec:160,breakSec:20,pomodoros:1,hrSamples:[[30,78],[60,84]],bbSamples:[[0,66],[180,64]],bbStart:66,bbEnd:64};
test('strict watch input validation protects health data and sessions',()=>{
 assert.equal(validWatchSession(sample),true);
 for (const activity of ['Lehre','Pruefungen','Pruefungskorrektur','Pruefungserstellung']) {
  assert.equal(validWatchSession({...sample,activity}),true,activity);
 }
 assert.equal(validWatchSession({...sample,hrSamples:[[33,350]]}),false);
 assert.equal(validWatchSession({...sample,activity:'DROP TABLE watch_sessions'}),false);
 assert.equal(validWatchSession({...sample,bbEnd:999}),false);
 assert.equal(validWatchSession({...sample,id:'bogus'}),false);
 assert.equal(validWatchSession({...sample,durationSec:150}),false);
});
function fakeD1(){
 const pairs=new Map(),devices=new Map(),sessions=new Map(),attempts=new Map();
 return {pairs,devices,sessions,db:{prepare(sql){return {bind(...v){return {
 async first(){if(sql.includes('FROM watch_pair_codes')){let p=pairs.get(v[0]);return p?{...p}:null;}if(sql.includes('FROM watch_pair_attempts'))return attempts.get(v[0])||null;if(sql.includes('FROM watch_devices'))return devices.get(v[0])||null;return null;},
 async all(){if(sql.includes('FROM watch_sessions'))return {results:[...sessions.values()].map(x=>({...x,hr_samples_json:JSON.stringify(x.hr_samples_json),bb_samples_json:JSON.stringify(x.bb_samples_json)}))};return {results:[]};},
 async run(){
 if(sql.startsWith('DELETE FROM watch_pair_codes WHERE owner_sub')){for(const [k,p] of pairs)if(p.owner_sub===v[0])pairs.delete(k);return {meta:{changes:1}};}
 if(sql.startsWith('INSERT INTO watch_pair_codes')){pairs.set(v[0],{owner_sub:v[1],created_at:v[2],expires_at:v[3]});return {meta:{changes:1}};}
 if(sql.startsWith('INSERT INTO watch_pair_attempts')){attempts.set(v[0],{window_start:v[1],attempts:1});return {meta:{changes:1}};}
 if(sql.startsWith('UPDATE watch_pair_attempts')){let x=attempts.get(v[0]);if(x)x.attempts++;return {meta:{changes:1}};}
 if(sql.startsWith('DELETE FROM watch_pair_codes WHERE code_hash')){if(pairs.has(v[0])){pairs.delete(v[0]);return {meta:{changes:1}}}return {meta:{changes:0}};}
 if(sql.startsWith('INSERT INTO watch_devices')){devices.set(v[0],{owner_sub:v[1],revoked:0});return {meta:{changes:1}};}
 if(sql.startsWith('INSERT INTO watch_sessions')){let k=v[0]+'|'+v[1];if(sessions.has(k))return {meta:{changes:0}};sessions.set(k,{owner_sub:v[0],session_id:v[1],token_hash:v[2],activity:v[3],started_at:v[4],duration_sec:v[5],focus_sec:v[6],break_sec:v[7],pomodoros:v[8],hr_samples_json:JSON.parse(v[9]),bb_samples_json:JSON.parse(v[10]),body_battery_start:v[11],body_battery_end:v[12]});return {meta:{changes:1}};}
 return {meta:{changes:1}};
 }
 };}};}}};
}
test('user-controlled pairing and idempotent watch upload',async()=>{
 const {db,pairs,devices,sessions}=fakeD1(),env={DB:db},user={sub:'owner-sub'};
 const code=(await (await createPair(env,user)).json()).code;
 assert.match(code,/^\d{8}$/);assert.equal(pairs.size,1);
 const req=new Request('https://example.test/api/watch/pair/claim',{method:'POST',headers:{'CF-Connecting-IP':'1.2.3.4'},body:JSON.stringify({code})});
 const res=await claimPair(req,env);assert.equal(res.status,200);
 const {token}=await res.json();assert.match(token,/^cw1_[0-9a-f]{64}$/);assert.equal(devices.size,1);assert.equal(pairs.size,0);
 const data=()=>new Request('https://example.test/api/watch/sessions',{method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify(sample)});
 assert.equal((await acceptWatchSession(data(),env)).status,200);
 assert.equal((await (await acceptWatchSession(data(),env)).json()).duplicate,true);
 assert.equal(sessions.size,1);
 const list=await (await listWatchSessions(env,user)).json();assert.equal(list.sessions[0].activity,'Forschung');
 const unauth=await acceptWatchSession(new Request('https://example.test/api/watch/sessions',{method:'POST',body:JSON.stringify(sample)}),env);assert.equal(unauth.status,401);
});
