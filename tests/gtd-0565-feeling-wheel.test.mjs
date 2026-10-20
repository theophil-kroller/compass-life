import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FEELINGS,newFeelingDraft,chooseFeeling,intensityFor,feelingWord,validatedCheckin,appendCheckin,feelingRange,feelingStats,feelingOverlay,feelingInsights,feelingReview} from '../client/src/feeling-wheel-v565.js';
const id='f2aceba1-439f-49c2-a6e2-e07ab7c27b20';
const at='2026-10-20T22:32:01.000Z';
const entry=(draft,uid=id,when=at,day='2026-10-20')=>validatedCheckin(draft,{id:uid,at:when,day});
test('0.5.65 six emoji emotions are distinct and hover information is accessible',()=>{
 assert.equal(FEELINGS.length,6);
 assert.equal(new Set(FEELINGS.map(e=>e.id)).size,6);
 assert.ok(FEELINGS.every(e=>e.emoji&&e.description&&e.words.length===5));
 const html=feelingOverlay(newFeelingDraft(),[]);
 for(const e of FEELINGS)assert.ok(html.includes(e.emoji)&&html.includes(e.label)&&html.includes(e.description));
 assert.match(html,/role="dialog" aria-modal="true"/);
});
test('0.5.65 multi-select chooses independently and toggles',()=>{
 let d=chooseFeeling(newFeelingDraft(),'joy');d=chooseFeeling(d,'sadness');d=intensityFor(d,'joy',9);
 assert.equal(d.selected.joy,9);assert.equal(d.selected.sadness,5);
 d=chooseFeeling(d,'sadness');assert.deepEqual(d.selected,{joy:9});
 assert.throws(()=>chooseFeeling(d,'unknown'));
});
test('0.5.65 intensity words are specific and indexed from 1 to 10',()=>{
 assert.equal(feelingWord('anger',1),'Gereizt');assert.equal(feelingWord('anger',10),'Rasend');
 assert.equal(feelingWord('joy',10),'Euphorisch');assert.equal(feelingWord('fear',8),'Verängstigt');
 assert.equal(feelingWord('not-real',5),null);
 assert.throws(()=>intensityFor(newFeelingDraft(),'anger',5));
 assert.throws(()=>intensityFor(chooseFeeling(newFeelingDraft(),'anger'),'anger',11));
});
test('0.5.65 check-ins validate all fields before encryption and do not truncate notes',()=>{
 const d=intensityFor(chooseFeeling(newFeelingDraft(),'fear'),'fear',7);
 const e=entry({...d,note:'Ein wichtiger Gedanke'});
 assert.equal(e.items[0].intensity,7);assert.equal(e.note,'Ein wichtiger Gedanke');assert.equal(e.day,'2026-10-20');
 assert.throws(()=>entry({...d,note:'x'.repeat(1001)}));
 assert.throws(()=>entry(newFeelingDraft()));
 assert.throws(()=>entry({selected:{evil:8}}));
 assert.throws(()=>entry(d,'insecure-id'));
});
test('0.5.65 repeated check-ins on same day remain separate; duplicate ids are blocked',()=>{
 const s={},d=chooseFeeling(newFeelingDraft(),'calm');
 appendCheckin(s,entry(d));appendCheckin(s,entry(d,'a2aceba1-439f-49c2-a6e2-e07ab7c27b20','2026-10-20T23:03:00Z'));
 assert.equal(s.feelingCheckins.length,2);
 assert.equal(feelingStats(s.feelingCheckins,'2026-10-20',7).activeDays,1);
 assert.throws(()=>appendCheckin(s,entry(d)),/bereits/);
});
test('0.5.65 weekly and insights history do not rate negative feelings poorly or fabricate missing days',()=>{
 const first=entry(chooseFeeling(newFeelingDraft(),'sadness'));
 const past=entry(chooseFeeling(newFeelingDraft(),'joy'),'b2aceba1-439f-49c2-a6e2-e07ab7c27b20','2026-09-01T08:30:00Z','2026-09-01');
 assert.equal(feelingRange([past,first],'2026-10-20',7).length,1);
 const stats=feelingStats([past,first],'2026-10-20',7);
 assert.equal(stats.groups[0].label,'Trauer');assert.equal(stats.entries,1);
 assert.ok(feelingReview([past,first],'2026-10-20').includes('🌧️'));
 assert.ok(feelingInsights([past,first],'2026-10-20',7).includes('Gefühlsverlauf'));
});
test('0.5.65 safely escapes user note content in HTML, never interpolates as markup',()=>{
 const notes='<img src=x onerror=alert(1)> & "hi"';
 const d={...chooseFeeling(newFeelingDraft(),'joy'),note:notes};
 const modal=feelingOverlay(d,[]),history=feelingInsights([entry(d)],'2026-10-20',7);
 assert.ok(!modal.includes('<img'));assert.ok(!history.includes('<img'));
 assert.ok(modal.includes('&lt;img'));assert.ok(history.includes('&lt;img'));
});
test('0.5.65 browser routes feeling wheel globally and stores it only through encrypted vault mutation',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 for(const token of ['COMPASS_CLIENT_VERSION=\'0.5.67.1\'','fw65-top-trigger','feeling-open','feeling-save','validatedCheckin','appendCheckin(s,entry)','feelingReview','feelingInsights','feelingOverlay','feelingDraft=newFeelingDraft()'])assert.ok(main.includes(token),token);
 assert.match(css,/fw65-wheel/);assert.ok(!main.includes('/api/feelings'));
});
