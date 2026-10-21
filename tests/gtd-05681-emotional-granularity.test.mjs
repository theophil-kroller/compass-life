import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FEELINGS,newFeelingDraft,chooseFeeling,intensityFor,feelingWord,setFeelingDetail,toggleFeelingObservation,validatedCheckin,appendCheckin,replaceCheckin,draftFromCheckin,feelingOverlay,feelingInsights} from '../client/src/feeling-wheel-v565.js';
import {feelingFamilies,intensityPresence,FEELING_OBSERVATIONS} from '../client/src/feeling-depth-v5681.js';
const uid='fb75a021-aa4d-4a44-b2f8-53e0d54e772f',at='2026-10-20T11:30:00.000Z',day='2026-10-20';
test('0.5.68.1 retains the established slider vocabulary and adds distinct optional emotional nuance',()=>{
 assert.deepEqual(FEELINGS.find(x=>x.id==='joy').words,['Erfreut','Fröhlich','Glücklich','Begeistert','Euphorisch']);
 assert.equal(feelingWord('joy',7),'Begeistert');assert.ok(feelingFamilies('joy').some(x=>x[1].includes('Inspiriert')));
 let d=intensityFor(chooseFeeling(newFeelingDraft(),'joy'),'joy',7);
 d=setFeelingDetail(d,'joy',{family:'Optimismus'});d=setFeelingDetail(d,'joy',{nuance:'Inspiriert'});
 assert.equal(d.selected.joy,7);assert.deepEqual(d.details.joy,{family:'Optimismus',nuance:'Inspiriert'});
 assert.equal(validatedCheckin(d,{id:uid,at,day}).items[0].nuance,'Inspiriert');
});
test('0.5.68.1 nuance is validated and inconsistent combinations cannot enter the vault',()=>{
 const d=chooseFeeling(newFeelingDraft(),'joy');
 assert.throws(()=>setFeelingDetail(d,'joy',{family:'Fake'}),/Gefühlsfamilie/);
 assert.throws(()=>setFeelingDetail(d,'joy',{family:'Optimismus',nuance:'Panisch'}),/Gefühlsnuance/);
 let good=setFeelingDetail(d,'joy',{family:'Optimismus',nuance:'Inspiriert'});
 good=setFeelingDetail(good,'joy',{family:'Lebensfreude'});
 assert.equal(good.details.joy.family,'Lebensfreude');assert.equal(good.details.joy.nuance,undefined);
 assert.equal(validatedCheckin({...d,details:{joy:{family:'Bad',nuance:'Bad'}}},{id:uid,at,day}).items[0].family,undefined);
});
test('0.5.68.1 body, needs and impulses are optional and independent from emotion score',()=>{
 let d=chooseFeeling(newFeelingDraft(),'anger');d=toggleFeelingObservation(d,'body','Erschöpft');d=toggleFeelingObservation(d,'needs','Rückzug');d=toggleFeelingObservation(d,'impulses','Süßes essen');
 const e=validatedCheckin({...d,hypothesis:'Nach dem Sport brauche ich Ruhe.'},{id:uid,at,day});
 assert.equal(e.items[0].intensity,5);assert.deepEqual(e.observations,{body:['Erschöpft'],needs:['Rückzug'],impulses:['Süßes essen']});
 assert.equal(e.hypothesis,'Nach dem Sport brauche ich Ruhe.');
 assert.throws(()=>toggleFeelingObservation(d,'body','Unbekannt'));
 assert.throws(()=>validatedCheckin({...d,observations:{body:['<script>']}},{id:uid,at,day}));
 assert.ok(FEELING_OBSERVATIONS.impulses.includes('Sexualität'));
});
test('0.5.68.1 old check-ins remain intact; editing preserves original identity, timestamps and history',()=>{
 let d=chooseFeeling(newFeelingDraft(),'joy');const old=validatedCheckin(d,{id:uid,at,day});
 const vaultState={feelingCheckins:[]};appendCheckin(vaultState,old);
 const editor=draftFromCheckin(old);assert.equal(editor.selected.joy,5);assert.equal(editor.hypothesis,'');
 const changed=setFeelingDetail(editor,'joy',{family:'Optimismus',nuance:'Inspiriert'});
 replaceCheckin(vaultState,validatedCheckin(changed,{id:uid,at,day}));
 assert.equal(vaultState.feelingCheckins.length,1);assert.equal(vaultState.feelingCheckins[0].id,uid);
 assert.equal(vaultState.feelingCheckins[0].at,at);assert.ok(vaultState.feelingCheckins[0].editedAt);
 assert.throws(()=>replaceCheckin(vaultState,{...old,at:'2026-10-21T11:30:00Z'}),/Zeitpunkt/);
});
test('0.5.68.1 refined overlay preserves original word slider plus visually graded independent intensity bar',()=>{
 let d=chooseFeeling(newFeelingDraft(),'joy');d=intensityFor(d,'joy',7);d=setFeelingDetail(d,'joy',{family:'Optimismus',nuance:'Inspiriert'});
 const ui=feelingOverlay(d,[]);
 assert.match(ui,/Erfreut/);assert.match(ui,/Euphorisch/);assert.match(ui,/fw65-range/);
 assert.match(ui,/fw681-intensity-scale/);assert.match(ui,/--step:1/);assert.match(ui,/--step:10/);
 assert.match(ui,/Inspiriert/);assert.match(ui,/Meine Wahrnehmung vertiefen/);
});
test('0.5.68.1 overview, chronology and patterns use only real records and keep inspector actions',()=>{
 let d=chooseFeeling(newFeelingDraft(),'joy');d=setFeelingDetail(d,'joy',{family:'Optimismus',nuance:'Inspiriert'});
 const e=validatedCheckin(d,{id:uid,at,day});
 const overview=feelingInsights([e],day,30,{view:'overview'}),history=feelingInsights([e],day,30,{view:'history'}),patterns=feelingInsights([e],day,30,{view:'patterns'});
 for(const ui of [overview,history,patterns]){assert.match(ui,/Gefühlswelt/);assert.match(ui,/Feeling Inspector/);assert.match(ui,/data-action="feeling-entry-edit"/);}
 assert.match(overview,/Gefühlsrhythmus/);assert.match(history,/Chronik/);
 assert.match(patterns,/zu wenige Einträge/);assert.ok(!patterns.includes('Freude taucht häufig nach kreativer Arbeit auf'));
});
test('0.5.68.1 escapes personal hypotheses, body terms and selected nuances in the UI',()=>{
 const d={...chooseFeeling(newFeelingDraft(),'fear'),note:'<script>n</script>',hypothesis:'<img src=x onerror=alert(2)>'};
 const entry=validatedCheckin(d,{id:uid,at,day});const ui=feelingInsights([entry],day,30);
 assert.ok(!ui.includes('<img'));assert.match(ui,/&lt;img/);
 assert.ok(!feelingOverlay(d,[]).includes('<img'));
});
test('0.5.68.1 locked entry has encrypted capture route and existing backups; no automatic cloud route',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const vault=readFileSync(new URL('../client/src/vault.js',import.meta.url),'utf8');
 assert.match(main,/vault\.appendSealedFeeling\(entry\)/);
 assert.match(vault,/export async function appendSealedFeeling/);
 assert.match(main,/capture\.kind==='feeling'/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.68\.1'/);
 assert.ok(!main.includes('/api/feelings'));
});
function memoryIndexedDB(){
 const storage=new Map();let opened=false;
 const make=()=>({createObjectStore(){},close(){},transaction(){
   const tx={oncomplete:null,onerror:null,objectStore(){return {get(k){const req={onsuccess:null,result:null};queueMicrotask(()=>{req.result=storage.get(k);req.onsuccess?.();queueMicrotask(()=>tx.oncomplete?.());});return req;},put(v,k){storage.set(k,v);queueMicrotask(()=>tx.oncomplete?.());},delete(k){storage.delete(k);queueMicrotask(()=>tx.oncomplete?.());}};}};return tx;}});
 return {storage,open(){const req={result:null,onupgradeneeded:null,onsuccess:null};queueMicrotask(()=>{req.result=make();if(!opened){opened=true;req.onupgradeneeded?.();}req.onsuccess?.();});return req;}};
}
test('0.5.68.1 locked feeling check-in is ciphertext, survives restart queue and decrypts into full structured entry',async()=>{
 const previous=globalThis.indexedDB,db=memoryIndexedDB();globalThis.indexedDB=db;
 const vault=await import('../client/src/vault.js');
 try{
  await vault.create('A long enough local secret phrase for testing');await vault.setupSealedCapture();
  const chosen=setFeelingDetail(chooseFeeling(newFeelingDraft(),'joy'),'joy',{family:'Optimismus',nuance:'Inspiriert'});
  const entry=validatedCheckin({...chosen,hypothesis:'Das neue Projekt inspiriert mich'},{id:uid,at,day});
  vault.lock();assert.equal(await vault.appendSealedFeeling(entry),1);
  const raw=JSON.stringify([...db.storage.values()]);assert.ok(!raw.includes('Das neue Projekt inspiriert mich'));assert.ok(!raw.includes('Inspiriert'));
  await assert.rejects(vault.readSealedCaptures(),/gesperrt/);
  const state=await vault.unlock('A long enough local secret phrase for testing');
  const queued=await vault.readSealedCaptures();assert.equal(queued.length,1);assert.equal(queued[0].kind,'feeling');assert.deepEqual(queued[0].entry,entry);
  appendCheckin(state,queued[0].entry);await vault.save(state);await vault.acknowledgeSealedCaptures([queued[0].id]);
  assert.equal((await vault.readSealedCaptures()).length,0);
  vault.lock();assert.equal((await vault.unlock('A long enough local secret phrase for testing')).feelingCheckins.length,1);
 }finally{vault.lock();globalThis.indexedDB=previous;}
});
