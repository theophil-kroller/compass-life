import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {gtdDelta,applyGtdDelta,createCoreIdlePolicy} from '../client/src/core-first-v5775940257.js';
const read=path=>readFileSync(fileURLToPath(new URL('../'+path,import.meta.url)),'utf8');
test('encrypted journal patches only the changed GTD records and preserves unrelated private state',()=>{
 const source={tasks:{a:{id:'a',progressCurrent:4},b:{id:'b',progressCurrent:1}},projects:{p:{id:'p'}},taskPending:{},projectPending:{},health:{secret:'health'},finance:{secret:'finance'}};
 const prior=structuredClone(source),next=structuredClone(source);
 next.tasks.a.progressCurrent=5;next.taskPending.a=true;
 const delta=gtdDelta(prior,next);
 assert.deepEqual(Object.keys(delta.tasks),['a']);assert.deepEqual(Object.keys(delta.projects),[]);
 assert.equal(JSON.stringify(delta).includes('health'),false);assert.equal(JSON.stringify(delta).includes('finance'),false);
 const restored=applyGtdDelta(structuredClone(prior),delta);
 assert.equal(restored.tasks.a.progressCurrent,5);assert.equal(restored.tasks.b.progressCurrent,1);
 assert.equal(restored.health.secret,'health');assert.equal(restored.finance.secret,'finance');
 // A replay is idempotent after an interrupted startup.
 assert.deepEqual(applyGtdDelta(restored,delta),restored);
});
test('deletion and reorder are reconstructable without rewriting unrelated records',()=>{
 const before={tasks:{a:{id:'a',parentTaskId:null},b:{id:'b',parentTaskId:'a'},c:{id:'c'}},projects:{p:{id:'p'}},taskPending:{b:true},projectPending:{}};
 const after=structuredClone(before);delete after.tasks.c;after.tasks.b.parentTaskId=null;delete after.taskPending.b;after.projectPending.p=true;
 const delta=gtdDelta(before,after),replayed=applyGtdDelta(structuredClone(before),delta);
 assert.deepEqual(replayed.tasks,after.tasks);assert.deepEqual(replayed.taskPending,after.taskPending);assert.deepEqual(replayed.projectPending,after.projectPending);
});
test('idle policy favors an active typist, syncs after quiet, and eventually catches up',()=>{
 const p=createCoreIdlePolicy({quietMs:10000,maxDelayMs:120000});p.noteActivity(1000);p.beginWait(1200);
 assert.equal(p.maySync(6000,{visible:true,online:true}),false);
 assert.equal(p.maySync(11001,{visible:true,online:true}),true);
 p.noteActivity(20000);assert.equal(p.maySync(145000,{visible:true,online:true,editing:true}),false);
 assert.equal(p.maySync(145000,{visible:false,online:true}),false);
 assert.equal(p.maySync(145000,{visible:true,online:false}),false);
 assert.equal(p.maySync(145000,{visible:true,online:true}),true);
 p.reset();assert.equal(p.state().lastScheduled,0);
});
test('vault performs journal/snapshot transaction and backup exports journal',()=>{
 const vault=read('client/src/vault.js');
 assert.match(vault,/CORE_JOURNAL_KEY='core_gtd_journal_v1'/);
 assert.match(vault,/kv\.put\(\{iv:to64\(iv\),data:to64\(new Uint8Array\(ciphertext\)\)\},'payload'\);kv\.delete\(CORE_JOURNAL_KEY\)/);
 assert.match(vault,/applyGtdDelta\(state,JSON\.parse\(dec\.decode\(payload\)\)\)/);
 assert.match(vault,/coreJournal:await kvGet\(CORE_JOURNAL_KEY\)/);
 assert.match(vault,/bundle\.coreJournal/);
});
test('release keeps manual sync and routes automatic sync to idle scheduler',()=>{
 const plugin=read('client/compass5940257-core-first.js'),config=read('client/vite.config.js');
 assert.match(config,/compass5940257CoreFirst\(\)/);
 assert.match(plugin,/syncNow\(\{silent:true\}\)/);
 assert.match(plugin,/appendCoreGtdDelta\(gtdDelta\(previous,state\)\)/);
 assert.match(plugin,/scheduleCoreCompaction\(\)/);
 assert.match(plugin,/async function syncNow\(\{silent=false\}=\{\}\)/);
});
