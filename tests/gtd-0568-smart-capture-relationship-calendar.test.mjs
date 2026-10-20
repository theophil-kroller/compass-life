import test from 'node:test';
import assert from 'node:assert/strict';
import {deadlineSuggestions,projectMatchesDeadline,contactSuggestions} from '../client/src/calendar-intelligence-v568.js';
import {careMode,activeCare,relationshipReview,suggestCareMode} from '../client/src/relationship-intelligence-v568.js';

const date='2026-10-21';
const event=(id,summary,day='2026-11-12')=>({id,summary,start:{date:day}});

test('Prüfung and Abgabe suggest a project but never create one automatically',()=>{
 const entries=[event('exam','Prüfung Strategisches Management'),event('d','Deadline: Arbeit einreichen'),event('social','Mittagessen mit Ilona'),{...event('cancel','Prüfung Finance'),status:'cancelled'}];
 const found=deadlineSuggestions(entries,{}, {},date);
 assert.deepEqual(found.map(x=>x.id),['exam','d']);
 assert.equal(projectMatchesDeadline(entries[0],{'p':{id:'p',title:'Vorbereitung Strategisches Management',status:'active'}}),true);
 assert.equal(deadlineSuggestions(entries,{'p':{title:'Vorbereitung Strategisches Management',status:'active'}},{d:true},date).length,0);
});
test('calendar contact proposals require explicit confirmation and deduplicate source events',()=>{
 const events=[event('e1','Kaffee mit Martin', '2026-10-15'),event('e2','Kaffee mit Martin','2026-11-01'),{...event('e3','Treffen Martin','2026-10-10'),status:'cancelled'}];
 const person={id:'martin',name:'Martin',contactLog:[]};
 assert.deepEqual(contactSuggestions(events,{martin:person},date).map(x=>x.id),['e1']);
 assert.deepEqual(contactSuggestions(events,{martin:{...person,contactLog:[{sourceEventId:'e1'}]}},date),[]);
 assert.deepEqual(contactSuggestions(events,{martin:person},date,{e1:true}),[]);
});
test('daily household and colleague mode do not artificially earn 100 points',()=>{
 const base={id:'1',name:'Kind',closeness:95,contactCadenceDays:7,sharesHousehold:true};
 assert.equal(careMode(base),'regular');assert.equal(activeCare(base),false);
 assert.equal(suggestCareMode({id:'2',name:'Kollegin',relationKind:'colleague'}),'regular');
 const report=relationshipReview({'1':base},date);
 assert.equal(report.tracked,0);assert.equal(report.covered,0);assert.equal(report.due.length,0);
});
test('explicit long-distance colleague rhythm remains active and respects pause',()=>{
 const p={id:'2',name:'Sydney',relationKind:'colleague',contactCadenceDays:30,contactLog:[{id:'c1',day:'2026-09-01',type:'call'}]};
 assert.equal(careMode(p),'intentional');assert.equal(relationshipReview({x:p},date).due.length,1);
 assert.equal(activeCare({...p,contactMode:'regular'}),false);
 assert.equal(activeCare({...p,contactMode:'paused'}),false);
});

test('contact drift needs documented prior rhythm and excludes daily/paused contact',()=>{
 const log=['2026-01-01','2026-01-15','2026-02-01','2026-02-14'].map((day,i)=>({id:String(i),day,type:'call'}));
 const person={id:'old',name:'Frühere Kollegin',contactLog:log};
 assert.equal(relationshipReview({old:person},date).drift.length,1);
 assert.equal(relationshipReview({old:{...person,contactMode:'regular'}},date).drift.length,0);
 assert.equal(relationshipReview({old:{...person,contactMode:'paused'}},date).drift.length,0);
});
// Tiny IndexedDB harness exercises the real production crypto and persistence module.
function fakeIndexedDB(){
 const storage=new Map();
 const mkdb=()=>({
  createObjectStore(){return {};},close(){},
  transaction(_store,_mode){
   const tx={oncomplete:null,onerror:null,objectStore(){return {
    get(key){const req={onsuccess:null,onerror:null,result:undefined};queueMicrotask(()=>{req.result=storage.get(key);req.onsuccess?.();queueMicrotask(()=>tx.oncomplete?.());});return req;},
    put(value,key){storage.set(key,value);queueMicrotask(()=>tx.oncomplete?.());},
    delete(key){storage.delete(key);queueMicrotask(()=>tx.oncomplete?.());}
   };}};return tx;
  }
 });
 let opened=false;
 return {open(){const req={result:null,onupgradeneeded:null,onsuccess:null,onerror:null};queueMicrotask(()=>{req.result=mkdb();if(!opened){opened=true;req.onupgradeneeded?.();}req.onsuccess?.();});return req;},storage};
}
test('locked capture ciphertext has no plaintext and is decryptable only after vault unlock',async()=>{
 const prevIndexed=globalThis.indexedDB;
 const fake=fakeIndexedDB();globalThis.indexedDB=fake;
 try{
  const vault=await import('../client/src/vault.js');
  const original=await vault.create('A sufficiently long test passphrase');
  await vault.setupSealedCapture();assert.equal(await vault.sealedCaptureReady(),true);
  vault.lock();
  assert.equal(await vault.appendSealedCapture('Idee im Zug', 'Privat und offline'),1);
  const raw=JSON.stringify([...fake.storage.entries()]);
  assert.equal(raw.includes('Idee im Zug'),false);assert.equal(raw.includes('Privat und offline'),false);
  await assert.rejects(vault.readSealedCaptures(),/gesperrt/);
  const unlocked=await vault.unlock('A sufficiently long test passphrase');
  assert.deepEqual(unlocked.records,original.records);
  const queued=await vault.readSealedCaptures();assert.equal(queued.length,1);
  assert.equal(queued[0].title,'Idee im Zug');assert.equal(queued[0].note,'Privat und offline');
  // Acknowledge only after vault save; reopening may still recover if interruption occurred earlier.
  unlocked.records[queued[0].id]={id:queued[0].id,title:queued[0].title,deleted:false};
  await vault.save(unlocked);await vault.acknowledgeSealedCaptures([queued[0].id]);
  assert.equal((await vault.readSealedCaptures()).length,0);
  vault.lock();await vault.appendSealedCapture('Backup-Reise-Notiz','Verschlüsselt bis zum Zielgerät');
  const backup=await vault.exportEncrypted();assert.ok(backup.sealedCapture.privateKey);assert.ok(backup.sealedCapture.publicKey);assert.equal(backup.sealedCapture.queue.length,1);
  const copied=fakeIndexedDB();globalThis.indexedDB=copied;
  await vault.importEncrypted(backup);
  assert.equal(await vault.sealedCaptureReady(),true);
  await assert.rejects(vault.readSealedCaptures(),/gesperrt/);
  await vault.unlock('A sufficiently long test passphrase');
  const restored=await vault.readSealedCaptures();assert.equal(restored.length,1);assert.equal(restored[0].title,'Backup-Reise-Notiz');
  vault.lock();
 }finally{globalThis.indexedDB=prevIndexed;}
});
