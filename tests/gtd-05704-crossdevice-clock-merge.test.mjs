import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeQuickWorktime,mergeJournalData} from '../client/src/personal-journal-v5692.js';
const start='2026-10-21T09:34:00.000Z';
const stop='2026-10-21T12:15:00.000Z';
const phone={sessions:[],activeStart:start,activeCategory:'work',updatedAt:start};
const staleDesktop={sessions:[],activeStart:'',activeCategory:'work',updatedAt:'2026-10-21T12:00:00.000Z'};

test('0.5.70.4 active phone timer survives a newer idle laptop snapshot',()=>{
 const p=mergeQuickWorktime(phone,staleDesktop);
 const l=mergeQuickWorktime(staleDesktop,phone);
 assert.equal(p.activeStart,start);
 assert.equal(l.activeStart,start);
 assert.equal(p.activeCategory,'work');
 assert.deepEqual(p,l);
});
test('0.5.70.4 both sides retain open timer after cloud sync/reload',()=>{
 const remote=mergeJournalData({quickWorktime:staleDesktop},{quickWorktime:phone});
 const desktop=mergeJournalData({quickWorktime:staleDesktop},remote);
 const phoneAgain=mergeJournalData({quickWorktime:phone},desktop);
 assert.equal(desktop.quickWorktime.activeStart,start);
 assert.equal(phoneAgain.quickWorktime.activeStart,start);
 assert.deepEqual(desktop.quickWorktime,phoneAgain.quickWorktime);
});
test('0.5.70.4 genuine stop closes the same start even if stale phone still displays active',()=>{
 const finished={sessions:[{id:'clock-stop-1',start,end:stop,category:'work',updatedAt:stop}],activeStart:'',updatedAt:stop};
 assert.equal(mergeQuickWorktime(phone,finished).activeStart,'');
 assert.equal(mergeQuickWorktime(finished,phone).activeStart,'');
 const merged=mergeQuickWorktime(phone,finished);
 assert.deepEqual(merged.sessions.map(s=>s.id),['clock-stop-1']);
 assert.deepEqual(mergeQuickWorktime(merged,phone),merged);
});
test('0.5.70.4 older completed interval does not hide a new active timer',()=>{
 const earlier='2026-10-20T08:00:00.000Z';
 const earlierStop='2026-10-20T10:00:00.000Z';
 const old={sessions:[{id:'old',start:earlier,end:earlierStop}],activeStart:'',updatedAt:earlierStop};
 const m=mergeQuickWorktime(old,phone);
 assert.equal(m.activeStart,start);
 assert.equal(m.sessions.length,1);
});
test('0.5.70.4 does not mutate inputs and merge is idempotent',()=>{
 const a=JSON.stringify(phone),b=JSON.stringify(staleDesktop);
 const m=mergeQuickWorktime(phone,staleDesktop);
 assert.deepEqual(mergeQuickWorktime(m,m),m);
 assert.equal(JSON.stringify(phone),a);
 assert.equal(JSON.stringify(staleDesktop),b);
});
test('0.5.70.4 clock fix does not lose nutrition or feelings when merging',()=>{
 const l={quickWorktime:staleDesktop,feelingCheckins:[{id:'feel1',at:start,items:[]}],nutritionJournal:{entries:[{id:'food1',foodId:'matcha',at:start}]}};
 const r={quickWorktime:phone,feelingCheckins:[{id:'feel2',at:stop,items:[]}],nutritionJournal:{entries:[{id:'food2',foodId:'mensa',at:stop}]}};
 const merged=mergeJournalData(l,r);
 assert.equal(merged.quickWorktime.activeStart,start);
 assert.equal(merged.feelingCheckins.length,2);
 assert.equal(merged.nutritionJournal.entries.length,2);
});
