import test from 'node:test';
import assert from 'node:assert/strict';

function fakeIndexedDB(){
 const data=new Map();let ready=false;
 const db={close(){},createObjectStore(){return {};},transaction(){
  const tx={oncomplete:null,onerror:null,onabort:null};let outstanding=0,scheduled=false,finished=false;
  const ops=[];
  const finish=()=>{if(!scheduled){scheduled=true;setTimeout(()=>{scheduled=false;if(outstanding>0||finished)return;for(const op of ops)op();finished=true;tx.oncomplete?.();},1);}};
  const store={
   get(key){outstanding++;const req={result:undefined,onsuccess:null,onerror:null};
    setTimeout(()=>{req.result=data.get(key);req.onsuccess?.();outstanding--;finish();},0);return req;},
   put(value,key){ops.push(()=>data.set(key,value));finish();},
   delete(key){ops.push(()=>data.delete(key));finish();}
  };tx.objectStore=()=>store;return tx;
 }};
 return {data,api:{open(){const request={result:db,onupgradeneeded:null,onsuccess:null,onerror:null};setTimeout(()=>{if(!ready){ready=true;request.onupgradeneeded?.();}request.onsuccess?.();},0);return request;}}};
}

test('actual encrypted IndexedDB journal survives lock/unlock, compacts atomically, and is included in backups',async()=>{
 const original=globalThis.indexedDB, fake=fakeIndexedDB();globalThis.indexedDB=fake.api;
 try{
  const vault=await import('../client/src/vault.js');
  const password='core-first-test-passphrase';
  const initial=await vault.create(password);
  initial.health={secret:'not in delta'};
  initial.tasks={};initial.projects={};initial.taskPending={};initial.projectPending={};
  await vault.save(initial);
  await vault.appendCoreGtdDelta({kind:'gtd',tasks:{task1:{id:'task1',progressCurrent:5}},taskPending:{task1:true},projects:{},projectPending:{}});
  await vault.appendCoreGtdDelta({kind:'gtd',tasks:{},projects:{},taskPending:{},projectPending:{},
    weeklyReview:{step:4,done:['collect','inbox'],updatedAt:'2026-10-29'},reviewPending:true});
  const backup=await vault.exportEncrypted();
  assert.equal(backup.coreJournal?.length,2);
  assert.equal(JSON.stringify(fake.data.get('core_gtd_journal_v1')).includes('task1'),false,'journal must not leak plaintext');
  vault.lock();
  const replay=await vault.unlock(password);
  assert.equal(replay.tasks.task1.progressCurrent,5);
  assert.equal(replay.taskPending.task1,true);
  assert.equal(replay.health.secret,'not in delta');
  assert.equal(replay.weeklyReview.step,4);
  assert.deepEqual(replay.weeklyReview.done,['collect','inbox']);
  assert.equal(replay.reviewPending,true);
  await vault.save(replay);
  assert.equal(fake.data.has('core_gtd_journal_v1'),false,'full snapshot + journal deletion atomic');
  vault.lock();
  const after=await vault.unlock(password);
  assert.equal(after.tasks.task1.progressCurrent,5,'replay survives checkpoint');
  assert.equal(after.health.secret,'not in delta');
  assert.equal(after.weeklyReview.step,4);
  assert.equal(after.reviewPending,true);
  vault.lock();
 }finally{globalThis.indexedDB=original;}
});
