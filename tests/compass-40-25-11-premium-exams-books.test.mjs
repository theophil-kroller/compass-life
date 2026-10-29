import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {strengthInsightsView as repairedStrength} from '../client/src/strength-insights-full-repair-v57759402511.js';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
import {activityTotals,focusActivityBreakdown} from '../client/src/focus-productivity-v57759402510.js';
import {RECEIPT_CATEGORY_IDS,receiptCategoryForItem,setReceiptCategory,suggestReceiptCategory} from '../client/src/receipt-categories-v57745.js';
import {parseReceiptJSON,putReceipt,receiptMonthSummary,receiptInboxView,RECEIPT_GPT_PROMPT} from '../client/src/receipt-gpt-v57743.js';
const root=new URL('../client/src/',import.meta.url);
const main=readFileSync(new URL('main-full-v57759402510.js',root),'utf8');

test('restores the existing genuine front/back anatomical atlas without altering state',()=>{
 const state={};const before=structuredClone(state);
 // Historical strength renderer and model are reused; the previous cartoon container is gone.
 const html=repairedStrength(state,{range:'28',today:'2026-10-29',side:'front'});
 assert.match(html,/str740-svg.*data-anatomy-view="front"/);
 assert.match(html,/str740-svg.*data-anatomy-view="back"/);
 assert.match(html,/Vorder- und Rückseite gleichzeitig/);
 assert.doesNotMatch(html,/<div class="str728-visual">/);
 assert.deepEqual(state,before);
 assert.equal(typeof strengthPeriod,'function');
});

test('full-source wires the restored atlas and mounts SVG paths after a local map refresh',()=>{
 assert.match(main,/import \{strengthInsightsView\} from '\.\/strength-insights-full-repair-v57759402511\.js'/);
 assert.match(main,/old\.outerHTML=strengthInsightsView\([\s\S]*?mountPremiumAnatomy\(app\)/);
});

test('open historic exam rows render a real clickable CTA',()=>{
 const row={id:'exam-1',source:'Garmin',category:'Arbeit',startedAt:'2026-10-28T09:00',durationMinutes:125,focusSec:5400,pomodoros:3,activityType:'Pruefungen',activityTypeReview:true};
 const summary=activityTotals([row]);assert.equal(summary.review,1);
 const html=focusActivityBreakdown([row]);
 assert.match(html,/data-action="focus-review-open"/);
 assert.match(html,/Jetzt zuordnen/);
 assert.ok((html.match(/data-action="focus-review-open"/g)||[]).length>=2);
 assert.match(main,/if\(action==='focus-review-open'\)/);
 assert.match(main,/activityReviewFlow=true;activitySelectedId=first\.id;activityTrash=false;tab='activity'/);
 assert.match(main,/const pendingExams=rows\.filter\(a=>a\.activityTypeReview\)/);
 assert.match(main,/const wasPending=projectActivities\(watchSessions,state\)/);
});

test('Bücher appears as a separate receipt category, recognizes explicit book labels but not foods',()=>{
 assert.ok(RECEIPT_CATEGORY_IDS.includes('books'));
 for(const title of ['Buch','Bücher','Fachbuch Physik','Taschenbuch','ISBN 978', 'Sachbuch'])
  assert.equal(suggestReceiptCategory({description:title}).category,'books',title);
 for(const title of ['Buchweizen','Buchweizenflocken', 'Unbekannter Titel'])
  assert.notEqual(suggestReceiptCategory({description:title}).category,'books',title);
 assert.equal(suggestReceiptCategory({description:'Titel unbekannt',category:'Bücher'}).category,'books');
 assert.match(RECEIPT_GPT_PROMPT,/Drogerie, Bücher, Sonstiges/);
});

test('manual book classification persists in receipt category summaries without modifying originals',()=>{
 const raw={schema:'compass_receipt_v1',merchant:'Libro',date:'2026-10-29',currency:'EUR',total:19.95,items:[{description:'Unbekannter Titel',quantity:1,unit:'Stück',unit_price:19.95,total:19.95,category:'Sonstiges',confidence:'high'}]};
 const row=parseReceiptJSON(JSON.stringify(raw)),state={};putReceipt(state,row);
 const before=structuredClone(state.receiptJournal.entries);
 const result=setReceiptCategory(state,{receiptId:row.id,index:0,category:'books'});
 assert.equal(result.affected,1);
 assert.equal(receiptCategoryForItem(state,row,row.items[0]).category,'books');
 assert.equal(receiptMonthSummary(state,'2026-10').categories.find(x=>x.id==='books').amount,19.95);
 assert.match(receiptInboxView(state,{month:'2026-10'}),/<option value="books" selected>Bücher<\/option>/);
 assert.deepEqual(state.receiptJournal.entries,before);
});
