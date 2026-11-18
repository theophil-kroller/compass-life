import test from 'node:test';import assert from 'node:assert/strict';
import {giftEntries,upsertGift,removeGift,mergeGiftPlanner,giftSummary,christmasGiftNudge,giftPlannerView} from '../client/src/gift-planner-v059158.js';
import {touchStats58,touchStatsView58} from '../client/src/touch-stats-v059158.js';
import {strengthRhythm58,strengthRhythmView58} from '../client/src/strength-recovery-rhythm-v059158.js';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
import {readFileSync} from 'node:fs';
const t='2026-11-18T10:00:00.000Z';
test('Gift planner: saves recurring Christmas, links people, and retains history',()=>{
 const state={people:{p:{id:'p',name:'Max Mustermann'}},giftPlanner58:{entries:[]}};
 const a=upsertGift(state,{title:'Buch',year:2025,occasion:'christmas',personId:'p',stage:'given',price:'19,95'},{idFactory:()=> 'a',at:t});
 const b=upsertGift(state,{title:'Tee',year:2026,occasion:'christmas',personId:'p',stage:'idea'},{idFactory:()=> 'b',at:t});
 assert.equal(giftEntries(state).length,2);assert.equal(a.price,19.95);assert.equal(giftSummary(state,{year:2026}).total,1);
 assert.match(giftPlannerView(state,{year:2026}),/Buch/);assert.match(giftPlannerView(state,{year:2026}),/Geschenkhistorie/);
 assert.equal(christmasGiftNudge(state,{today:'2026-11-18'}).days,36);
 assert.equal(christmasGiftNudge(state,{today:'2026-11-18'}).pending,1);
});
test('Gift planner: rejects empty and invalid inputs',()=>{
 const state={};assert.throws(()=>upsertGift(state,{title:'',year:2026,occasion:'christmas'}));
 assert.throws(()=>upsertGift(state,{title:'Gift',year:2026,occasion:'unknown'}));
 assert.throws(()=>upsertGift(state,{title:'Gift',year:2026,occasion:'christmas',price:'-1'}));
});
test('Gift planner: tombstone and remote merge, no resurrection',()=>{
 const left={giftPlanner58:{entries:[]}};upsertGift(left,{title:'Blumen',year:2026,occasion:'birthday',stage:'idea'},{idFactory:()=> 'x',at:'2026-11-01T12:00:00Z'});
 const old=structuredClone(left.giftPlanner58);removeGift(left,'x','2026-11-03T12:00:00Z');
 const merged=mergeGiftPlanner(left.giftPlanner58,old);assert.equal(merged.entries[0].deleted,true);
 const journal=mergeJournalData({giftPlanner58:left.giftPlanner58},{giftPlanner58:old});assert.equal(journal.giftPlanner58.entries[0].deleted,true);
});
test('Touch: weekly and monthly categories, person isolation',()=>{
 const state={people:{p:{id:'p',name:'Max',relationKind:'friend'},q:{id:'q',name:'Pat',relationKind:'friend'}},touchJournal:{entries:[
  {id:'1',at:'2026-11-15T12:00:00Z',personId:'p',kinds:['hug','dance']},
  {id:'2',at:'2026-11-16T12:00:00Z',personId:'q',kinds:['hug']},
  {id:'3',at:'2026-10-20T12:00:00Z',personId:'p',kind:'sex'}
 ]}};
 const month=touchStats58(state,{today:new Date('2026-11-18T12:00:00Z'),unit:'month',personId:'p'});
 assert.equal(month.total,2);assert.equal(month.types.hug,1);assert.equal(month.types.dance,1);assert.equal(month.types.sex,1);
 const weekly=touchStats58(state,{today:new Date('2026-11-18T12:00:00Z'),unit:'week',personId:'p'});
 assert.equal(weekly.total,2);assert.equal(weekly.periods.at(-1).count,0);assert.equal(weekly.types.hug,1);
 assert.match(touchStatsView58(state,{unit:'month',personId:'p'}),/Berührungsstatistik/);
});
test('Strength recovery: documented six active days recommends an easy day but does not modify plan',()=>{
 const state={strengthGuidedSessions:Array.from({length:6},(_,i)=>({id:String(i),startedAt:`2026-11-${String(i+12).padStart(2,'0')}T10:00:00Z`}))};
 const before=JSON.stringify(state);const result=strengthRhythm58(state,{today:'2026-11-18'});
 assert.equal(result.count,6);assert.equal(result.restSuggested,true);assert.equal(JSON.stringify(state),before);
 assert.match(strengthRhythmView58(state,{today:'2026-11-18'}),/Regeneration|Entlastung/);
});
test('Lockscreen: encrypted work start/stop, no direct plaintext time records',()=>{
 const lock=readFileSync(new URL('../client/src/ars-vivendi-lock-full-v5775922.js',import.meta.url),'utf8');
 assert.match(lock,/appendSealedWorktime/);assert.match(lock,/await appendSealedWorktime/);
 assert.match(lock,/data-ars58-work/);assert.match(lock,/sealedCaptureReady/);
 const app=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(app,/vaultIdleMinutes/);assert.match(app,/giftPlanner58:st.giftPlanner58/);
});
