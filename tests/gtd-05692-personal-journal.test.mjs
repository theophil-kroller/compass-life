import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TIME_AREAS,FOOD_PRESETS,ensureJournal,putTimeEntry,deleteTimeEntry,timeEntries,timeBreakdown,overlapWarnings,addNutrition,addCustomFood,nutritionStats,nutritionQuickView,nutritionInsightsView,timeJournalView,mergeJournalData} from '../client/src/personal-journal-v5692.js';
const a='2026-10-20T08:00:00.000Z',b='2026-10-20T09:30:00.000Z',now=new Date('2026-10-21T12:00:00Z');
test('0.5.69.2 preserves existing clock intervals and classifies them without duplicating',()=>{
 const state={quickWorktime:{sessions:[{id:'old-work',start:a,end:b}],activeStart:''}};
 assert.equal(timeEntries(state).length,1);
 assert.equal(timeEntries(state)[0].category,'work');
 putTimeEntry(state,{id:'old-work',start:a,end:b,category:'project',project:'Compass',title:'Compass Entwicklung',updatedAt:'2026-10-21T08:00:00Z'});
 assert.equal(timeEntries(state).length,1);assert.equal(timeEntries(state)[0].project,'Compass');
 assert.equal(state.quickWorktime.sessions[0].end,b);
 assert.equal(timeBreakdown(state,7,now).totals.project,90);
});
test('0.5.69.2 manually logged family playtime and other projects coexist',()=>{
 const s={};ensureJournal(s);
 putTimeEntry(s,{id:'son',start:'2026-10-20T17:00:00Z',end:'2026-10-20T17:45:00Z',category:'family',title:'Fußball mit meinem Sohn'});
 putTimeEntry(s,{id:'website',start:'2026-10-20T15:00:00Z',end:'2026-10-20T16:30:00Z',category:'project',project:'Beziehungsdynamiken'});
 const totals=timeBreakdown(s,7,now).totals;assert.equal(totals.family,45);assert.equal(totals.project,90);
 assert.equal(overlapWarnings(s).length,0);assert.ok(timeJournalView(s).includes('Fußball mit meinem Sohn'));
});
test('0.5.69.2 interval validation and overlap warning',()=>{
 const s={};assert.throws(()=>putTimeEntry(s,{start:b,end:a,category:'work'}),/zwischen/);
 assert.throws(()=>putTimeEntry(s,{start:a,end:b,category:'unknown'}),/Lebensbereich/);
 putTimeEntry(s,{id:'x',start:a,end:b,category:'work'});
 putTimeEntry(s,{id:'y',start:'2026-10-20T09:00:00Z',end:'2026-10-20T10:00:00Z',category:'project'});
 assert.equal(overlapWarnings(s).length,1);assert.match(timeJournalView(s),/überlappende/);
 deleteTimeEntry(s,'x');assert.equal(timeEntries(s).length,1);
});
test('0.5.69.2 nutrition presets include user examples without calorie estimates',()=>{
 for(const id of ['matcha','oat-latte','smoothie','mensa','peanuts','mixed-nuts','dried-mango','rice-pudding','apple','cheddar','chocolate','tea-honey','turmeric','snickers'])assert.ok(FOOD_PRESETS.some(f=>f.id===id),id);
 assert.ok(TIME_AREAS.some(a=>a[0]==='family'));
 const markup=nutritionQuickView(null);assert.match(markup,/🍵/);assert.match(markup,/🥭/);assert.doesNotMatch(markup,/\d+\s*kcal/);
});
test('0.5.69.2 nutrition statistics, editing and HTML escaping',()=>{
 const s={};addNutrition(s,{id:'n1',foodId:'matcha',at:'2026-10-20T07:00:00Z'});
 addNutrition(s,{id:'n2',foodId:'matcha',at:'2026-10-20T08:00:00Z',note:'<img src=x>'});
 assert.equal(nutritionStats(s,30,now).ranked[0][1],2);
 assert.ok(nutritionInsightsView(s,{period:30}).includes('&lt;img'));
 addCustomFood(s,'Granola');assert.ok(nutritionQuickView(s).includes('Granola'));
 assert.throws(()=>addCustomFood(s,'Granola'),/bereits/);
});
test('0.5.69.2 encrypted mirror merge preserves concurrent and edited records by identity',()=>{
 const local={timeJournal:{entries:[{id:'a',category:'work',updatedAt:'2026-10-20T12:00:00Z'}],overrides:{}},nutritionJournal:{entries:[{id:'x',note:'A',updatedAt:'2026-10-20T11:00:00Z'}]}};
 const remote={timeJournal:{entries:[{id:'b',category:'project',updatedAt:'2026-10-20T13:00:00Z'}],overrides:{}},nutritionJournal:{entries:[{id:'x',note:'B',updatedAt:'2026-10-20T14:00:00Z'},{id:'y',updatedAt:'2026-10-20T13:00:00Z'}]}};
 const merged=mergeJournalData(local,remote);
 assert.deepEqual(merged.timeJournal.entries.map(e=>e.id).sort(),['a','b']);
 assert.equal(merged.nutritionJournal.entries.find(e=>e.id==='x').note,'B');
 assert.equal(merged.nutritionJournal.entries.length,2);
});
test('0.5.69.2 worker and UI have authenticated encrypted journal route and icon-first food access',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
 const cryptoFile=readFileSync(new URL('../client/src/private-device-sync-v30.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(main,/syncPersonalJournal/);assert.match(main,/mirrorPublishEncrypted\('journal'/);
 assert.match(main,/vault\.appendSealedNutrition/);assert.match(main,/pj92-food-open/);
 assert.match(main,/insightTab==='nutrition'/);assert.match(main,/insightTab==='timejournal'/);
 assert.match(worker,/finance\|health\|journal/);assert.match(cryptoFile,/journal/);
 assert.match(css,/pj92-food-tile/);assert.match(css,/\.utility-right \.quick-utility-label/);
});
import {newSalt,syncKeyFromPhrase,encryptSection,decryptSection} from '../client/src/private-device-sync-v30.js';
test('0.5.69.2 journal device mirror is authenticated, ciphertext-only and restores entries',async()=>{
 const data={quickWorktime:{sessions:[],activeStart:''},timeJournal:{entries:[{id:'test',title:'Compass-Entwicklung'}],overrides:{}},nutritionJournal:{entries:[{id:'n1',foodId:'matcha',note:'süßer Nachmittagskaffee'}],customFoods:[]}};
 const salt=newSalt(),key=await syncKeyFromPhrase('correct horse battery metaphor for test',salt);
 const encrypted=await encryptSection(key,'journal',data);
 assert.ok(!JSON.stringify(encrypted).includes('Nachmittagskaffee'));
 assert.ok(!JSON.stringify(encrypted).includes('Compass-Entwicklung'));
 assert.deepEqual(await decryptSection(key,'journal',encrypted),data);
 const another=await syncKeyFromPhrase('a completely different secret phrase',salt);
 await assert.rejects(()=>decryptSection(another,'journal',encrypted),/Synchronisierungs-Passphrase/);
});
test('0.5.69.2 D1 migration preserves old mirror and extends kinds',()=>{
 const sql=readFileSync(new URL('../worker/migrations/0018_personal_journal_mirror.sql',import.meta.url),'utf8');
 assert.match(sql,/INSERT INTO private_device_mirror_0018/);
 assert.match(sql,/SELECT owner_sub,kind,version,salt,iv,ciphertext/);
 assert.match(sql,/kind IN \('finance','health','journal'\)/);
});
