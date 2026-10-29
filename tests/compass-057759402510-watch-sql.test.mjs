import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {hash,acceptWatchSession,listWatchSessions} from '../worker/src/watch.js';
const migrations=['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0008_watch_session_tombstones.sql','0020_watch_session_revision.sql'];
function setup(){
 const sqlite=new DatabaseSync(':memory:');for(const m of migrations)sqlite.exec(readFileSync(join(import.meta.dirname,'../worker/migrations',m),'utf8'));
 const prepare=sql=>{let args=[];return {bind(...a){args=a;return this;},async first(){return sqlite.prepare(sql).get(...args)||null;},async all(){return {results:sqlite.prepare(sql).all(...args)}},async run(){return {meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}}},_run(){return sqlite.prepare(sql).run(...args)}}};
 return {sqlite,db:{prepare,async batch(stmts){sqlite.exec('BEGIN');try{const res=stmts.map(s=>s._run());sqlite.exec('COMMIT');return res;}catch(e){sqlite.exec('ROLLBACK');throw e;}}}};
}
const token='cw1_'+'f'.repeat(64),id='w'+'f'.repeat(32);
const sample={id,activity:'Forschung',startedAt:Math.floor(Date.now()/1000)-3600,durationSec:1500,focusSec:1500,breakSec:0,pomodoros:1,hrSamples:[],bbSamples:[],revision:1,finalized:false,bbStart:null,bbEnd:null};
const req=body=>new Request('https://example.org/api/watch/sessions',{method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify(body)});
test('real SQL migration retains one row across interim revisions, freezes finalized records',async()=>{
 const {sqlite,db}=setup();sqlite.prepare('INSERT INTO watch_devices(token_hash,owner_sub,device_label,created_at) VALUES (?,?,?,?)').run(await hash(token),'owner','device','2026-10-29');
 const post=async data=>(await (await acceptWatchSession(req(data),{DB:db})).json());
 assert.equal((await post(sample)).duplicate,false);
 assert.equal((await post({...sample,revision:2,durationSec:3300,focusSec:3000,breakSec:300,pomodoros:2})).duplicate,false);
 assert.equal((await post({...sample,revision:3,durationSec:3400,focusSec:3000,breakSec:400,pomodoros:2,finalized:true})).duplicate,false);
 assert.equal((await post({...sample,revision:2,durationSec:3300,focusSec:3000,breakSec:300,pomodoros:2})).duplicate,true);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM watch_sessions').get().n,1);
 assert.equal(sqlite.prepare('SELECT pomodoros,revision,finalized FROM watch_sessions').get().revision,3);
 const list=await(await listWatchSessions({DB:db},{sub:'owner'})).json();assert.equal(list.sessions[0].finalized,true);
 sqlite.close();
});
test('discard creates a tombstone so prior in-flight checkpoints cannot resurrect the session',async()=>{
 const {sqlite,db}=setup();sqlite.prepare('INSERT INTO watch_devices(token_hash,owner_sub,device_label,created_at) VALUES (?,?,?,?)').run(await hash(token),'owner','device','2026-10-29');
 const post=async data=>(await (await acceptWatchSession(req(data),{DB:db})).json());
 await post(sample);const cancel=await post({...sample,revision:2,finalized:true,cancelled:true});
 assert.equal(cancel.cancelled,true);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM watch_sessions').get().n,0);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM watch_deleted_sessions').get().n,1);
 const late=await post(sample);assert.equal(late.deleted,true);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM watch_sessions').get().n,0);
 sqlite.close();
});
