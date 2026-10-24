import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergeStrengthJournal,strengthSyncStatus} from '../client/src/strength-device-sync-v57742.js';
import {strengthSync742Bridge} from '../client/strength-sync742-bridge.js';
const ann=(sessionId,when,sets,updatedAt='2026-10-24T12:00:00Z')=>({sessionId,start:when,sets,updatedAt,source:'manual-compass'});
const desktop=ann('desktop-activity','2026-10-23T19:00:00Z',[{exerciseId:'hip-thrust',weightKg:70,reps:12},{exerciseId:'triceps-extension',weightKg:14,reps:11}]);
test('desktop annotation survives merge with empty mobile journal in either order',()=>{
 assert.deepEqual(mergeStrengthJournal({annotations:[desktop]},{annotations:[]}).annotations,[desktop]);
 assert.deepEqual(mergeStrengthJournal({annotations:[]},{annotations:[desktop]}).annotations,[desktop]);
});
test('union is idempotent: repeated mobile sync never duplicates a workout',()=>{
 let merged=mergeStrengthJournal({annotations:[desktop]},{});
 for(let i=0;i<10;i++)merged=mergeStrengthJournal(merged,{annotations:[desktop]});
 assert.equal(merged.annotations.length,1);
});
test('newer manual exercise classification wins without losing unrelated sessions',()=>{
 const old=ann('a','2026-10-23T10:00:00Z',[{exerciseId:null,weightKg:null,reps:null}],'2026-10-23T10:15:00Z');
 const corrected=ann('a','2026-10-23T10:00:00Z',[{exerciseId:'military-press',weightKg:20,reps:8}],'2026-10-24T10:15:00Z');
 const other=ann('b','2026-10-23T15:00:00Z',[{exerciseId:'squat',weightKg:70,reps:5}]);
 const r=mergeStrengthJournal({annotations:[old,other]},{annotations:[corrected]});
 assert.equal(r.annotations.length,2);
 assert.equal(r.annotations.find(x=>x.sessionId==='a').sets[0].exerciseId,'military-press');
 assert.equal(r.annotations.find(x=>x.sessionId==='b').sets[0].exerciseId,'squat');
});
test('same timestamp chooses more fully annotated sets, not empty mobile placeholder',()=>{
 const blank=ann(desktop.sessionId,desktop.start,[{exerciseId:null,reps:null,weightKg:null}],desktop.updatedAt);
 assert.deepEqual(mergeStrengthJournal({annotations:[desktop]},{annotations:[blank]}).annotations,[desktop]);
});
test('a newer blank mobile annotation cannot wipe desktop exercise or weight',()=>{
 const placeholder={...desktop,sets:[{exerciseId:null,weightKg:null,reps:null}],updatedAt:'2026-10-25T10:00:00Z'};
 const merged=mergeStrengthJournal({annotations:[desktop]},{annotations:[placeholder]});
 assert.equal(merged.annotations.length,1);
 assert.equal(merged.annotations[0].sets[0].exerciseId,'hip-thrust');
 assert.equal(merged.annotations[0].sets[0].weightKg,70);
 assert.equal(merged.annotations[0].sets[1].exerciseId,'triceps-extension');
});
test('Garmin import with different ID but exact matching start does not create duplicates',()=>{
 const variant={...desktop,sessionId:'garmin-fit-alternate'};
 assert.equal(mergeStrengthJournal({annotations:[desktop]},{annotations:[variant]}).annotations.length,1);
});
test('separate sessions on the same day are kept separate',()=>{
 const second=ann('b','2026-10-23T20:00:00Z',[{exerciseId:'bench',reps:5,weightKg:60}]);
 assert.equal(mergeStrengthJournal({annotations:[desktop]},{annotations:[second]}).annotations.length,2);
});
test('malformed empty snapshots do not destroy valid manual entries',()=>{
 assert.deepEqual(mergeStrengthJournal({annotations:[desktop]},null).annotations,[desktop]);
 assert.equal(mergeStrengthJournal({},{}).annotations.length,0);
});
test('sync status respects E2EE mirror pairing without exposing annotations',()=>{
 assert.deepEqual(strengthSyncStatus({strengthJournal:{annotations:[desktop]},privateDeviceMirror:{key:'secret',mode:'receiver'}}),{annotations:1,connected:true,mode:'receiver'});
});
const bridge=strengthSync742Bridge();
test('journal merge source is extended with strength without rewriting other journals',()=>{
 const raw="import {mergePeopleDirectory} from './people-sync-v57719.js';\nconst r={touchJournal:mergeTouchRecords(lc.touchJournal,rc.touchJournal),};";
 const s=bridge.transform(raw,'/app/client/src/personal-journal-v5692.js').code;
 assert.match(s,/import \{mergeStrengthJournal\}/);
 assert.match(s,/strengthJournal:mergeStrengthJournal\(lc.strengthJournal,rc.strengthJournal\)/);
 assert.match(s,/touchJournal:mergeTouchRecords/);
});
test('main build stage captures manual edits, exports and imports encrypted annotations',()=>{
 const raw=`const COMPASS_CLIENT_VERSION='0.5.77.41';
 const f=JSON.stringify([s?.touchJournal||null,s?.miracleMorning||null]);
 function journalSyncPayload(st){return {touchJournal:copy.touchJournal||{entries:[]},miracleMorning:ensureMorning(st)};}
 function applyJournalPayload(st,payload){st.touchJournal=m.touchJournal;st.feelingCheckins=m.feelingCheckins;}
 if(action==='pj92-sync-now'){}`;
 const s=bridge.transform(raw,'/app/client/src/main.js').code;
 for(const marker of ['0.5.77.42','s?.strengthJournal||null','strengthJournal:st.strengthJournal||{annotations:[]}', 'st.strengthJournal=m.strengthJournal','str742-sync-now'])assert.ok(s.includes(marker),marker);
 assert.match(s,/syncPersonalJournal\(\)/);
});
test('strength editor offers manual E2EE sync instead of local-only label',()=>{
 const raw=`<small>Lokales Trainingsjournal</small><p class="str732-help">Die Muskelkarte wird aus den von dir zugeordneten Übungen berechnet;`;
 const s=bridge.transform(raw,'/app/client/src/strength-editor-v57732.js').code;
 assert.match(s,/Verschlüsselter Geräteabgleich möglich/);
 assert.match(s,/data-action="str742-sync-now"/);
});
test('bridge fails closed when installed source does not match expected base',()=>{
 assert.throws(()=>bridge.transform('unexpected source','/app/client/src/main.js'),/Integrationsanker/);
});
test('Vite plugin chain contains legacy bridges in correct order and new strength sync before PWA',()=>{
 const s=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 const order=['nutritionPill577371Bridge()', 'strengthPremium738Bridge()', 'compass741Bridge()', 'strengthSync742Bridge()', 'VitePWA('];
 let prev=-1;for(const x of order){const i=s.indexOf(x);assert.ok(i>prev,`${x} after previous stage`);prev=i;}
});
