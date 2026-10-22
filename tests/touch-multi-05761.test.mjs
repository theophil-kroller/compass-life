import test from 'node:test';
import assert from 'node:assert/strict';
import {putTouch,touchEntries,touchKinds,touchHistoryView,touchPersonSummary,suggestedTouchKinds,touchQuickView,mergeTouchJournal,deleteTouch} from '../client/src/touch-journal-v577.js';
const at='2026-10-22T15:00:00Z';
const state=()=>({people:{p1:{id:'p1',name:'Alex'},p2:{id:'p2',name:'Sam'}},touchJournal:{entries:[]}});
test('several activities form one event, linked to one existing person',()=>{
 const s=state(),e=putTouch(s,{kinds:['dance','kiss','cuddle','dance'],at,personId:'p1',person:'Alex'});
 assert.deepEqual(touchKinds(e),['dance','kiss','cuddle']);assert.equal(touchEntries(s).length,1);
 assert.equal(touchPersonSummary(s,'p1').count,1);assert.equal(touchPersonSummary(s,'p2').count,0);
 assert.deepEqual(suggestedTouchKinds(s,'p1'),['dance','kiss','cuddle']);
 assert.match(touchHistoryView(s,{period:90}),/Tanzen · 💋 Küssen/);
});
test('legacy single-kind entries are supported; deleting event removes all types',()=>{
 const s=state();s.touchJournal.entries.push({id:'legacy',kind:'hug',at,updatedAt:at});
 assert.deepEqual(touchKinds(s.touchJournal.entries[0]),['hug']);
 deleteTouch(s,'legacy');assert.equal(touchEntries(s).length,0);
});
test('tombstone sync and multi-kind data survive merges',()=>{
 const a={entries:[{id:'a',kind:'hug',kinds:['hug','kiss'],at,updatedAt:at}]};
 const b={entries:[{id:'a',kind:'hug',kinds:['hug','kiss'],at,deleted:true,updatedAt:'2026-10-22T16:00:00Z'}]};
 assert.equal(mergeTouchJournal(a,b).entries[0].deleted,true);
});
test('multiple checkboxes in direct form and explicit person choices',()=>{
 const html=touchQuickView(state(),{personId:'p1'});
 assert.match(html,/t577-capture-form/);assert.match(html,/type="checkbox" name="kinds"/);
 assert.match(html,/value="p1" selected/);assert.match(html,/Was ist passiert\? Mehrfachauswahl/);
});
test('empty selection cannot be accidentally saved',()=>assert.throws(()=>putTouch(state(),{kinds:[],at}),/mindestens/));
