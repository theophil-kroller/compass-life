import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
import {queueFinanceMobileDecision,applyQueuedFinanceDecisions,mergeFinanceMobileDecisions,financeDecisionFingerprint} from '../client/src/finance-mobile-decisions-v0579.js';
import {financeQuickNavView} from '../client/src/finance-mobile-nav-v0579.js';
import {mobileFinanceReviewView,mobileFinanceReviewRows} from '../client/src/finance-mobile-review-v0579.js';
import {financePremiumOverviewView} from '../client/src/finance-premium-v57753.js';
const filepath=path=>new URL('../'+path,import.meta.url);
function tx(id='t1'){return {id,day:'2026-10-25',accountId:'n26:current:EUR',merchant:'Test Zahlung',description:'Kartenzahlung',category:'Prüfen / Noch ungeklärt',flow:'expense',amountCents:-2500,needsReview:true,source:'import'};}
function receiver(){return {privateDeviceMirror:{mode:'receiver',key:'encrypted-key'},financeTransactions:[tx()],financeMobileDecisions:[]};}
function source(){return {privateDeviceMirror:{mode:'source',key:'encrypted-key'},financeTransactions:[tx()],financeMobileDecisions:[]};}
const at='2026-10-30T18:00:00.000Z';
test('Mobile queue only writes a journal command, leaving finance mirror byte-for-byte untouched',()=>{
 const state=receiver(),before=JSON.stringify(state.financeTransactions);
 const d=queueFinanceMobileDecision(state,'t1','Lebensmittel / Supermarkt','expense',at,'d1');
 assert.equal(JSON.stringify(state.financeTransactions),before);
 assert.equal(d.status,'pending');assert.equal(d.transactionId,'t1');
 assert.throws(()=>queueFinanceMobileDecision(state,'t1','Lebensmittel / Supermarkt','expense',at,'d2'),/bereits/);
});
test('Journal merge preserves mobile decisions across independent devices',()=>{
 const mobile=receiver();queueFinanceMobileDecision(mobile,'t1','Lebensmittel / Supermarkt','expense',at,'d1');
 const merged=mergeJournalData({financeMobileDecisions:[]},{financeMobileDecisions:mobile.financeMobileDecisions});
 assert.equal(merged.financeMobileDecisions.length,1);
 const sm=source();sm.financeMobileDecisions=merged.financeMobileDecisions;
 assert.deepEqual(applyQueuedFinanceDecisions(sm,'2026-10-30T18:00:01.000Z'),{handled:1,applied:1,conflicts:0});
 assert.equal(sm.financeTransactions[0].category,'Lebensmittel / Supermarkt');
 assert.equal(sm.financeTransactions[0].needsReview,false);
 assert.equal(sm.financeMobileDecisions[0].status,'applied');
 assert.deepEqual(applyQueuedFinanceDecisions(sm),{handled:0,applied:0,conflicts:0});
});
test('Outdated receiver correction never overwrites independently edited source record',()=>{
 const mobile=receiver();queueFinanceMobileDecision(mobile,'t1','Lebensmittel / Supermarkt','expense',at,'d1');
 const sm=source();sm.financeTransactions[0]={...sm.financeTransactions[0],category:'Wohnen / Miete & Betriebskosten',needsReview:false};sm.financeMobileDecisions=mobile.financeMobileDecisions;
 const result=applyQueuedFinanceDecisions(sm,'2026-10-30T18:00:01.000Z');assert.equal(result.applied,0);assert.equal(result.conflicts,1);
 assert.equal(sm.financeTransactions[0].category,'Wohnen / Miete & Betriebskosten');
});
test('A stale pending replica cannot resurrect a completed decision',()=>{
 const r=receiver();const pending=queueFinanceMobileDecision(r,'t1','Lebensmittel / Supermarkt','expense',at,'d1');
 const completed={...pending,status:'applied',updatedAt:at};
 assert.equal(mergeFinanceMobileDecisions([pending],[completed])[0].status,'applied');
 assert.equal(mergeFinanceMobileDecisions([completed],[pending])[0].status,'applied');
});
test('Invalid amount-category or flow cannot be queued even on receiver',()=>{
 const r=receiver();assert.throws(()=>queueFinanceMobileDecision(r,'t1','Einnahmen / Gehalt','income',at,'bad'));
 assert.equal(r.financeMobileDecisions.length,0);
});
test('Early mobile finance navigation links overview, booking lines, and open classifications',()=>{
 const html=financeQuickNavView(receiver(),'Überblick');
 assert.match(html,/data-id="Buchungen"/);assert.match(html,/data-id="Prüfen"/);assert.match(html,/Unklassifiziert \(1\)/);
 assert.match(financePremiumOverviewView(receiver(),{today:'2026-10-30',period:'last12'}),/fin79-open-review/);
});
test('App integrates receiver queue and safe source reconciliation in its encrypted journal',()=>{
 const main=readFileSync(filepath('client/src/main-full-v57759402510.js'),'utf8');
 assert.match(main,/financeMobileDecisions:st\.financeMobileDecisions\|\|\[\]/);
 assert.match(main,/st\.financeMobileDecisions=m\.financeMobileDecisions\|\|\[\]/);
 assert.match(main,/applyQueuedFinanceDecisions\(state\)/);
 assert.match(main,/if\(state\?\.privateDeviceMirror\?\.mode==='receiver'\)/);
 assert.match(main,/financeQuickNavView\(state,financePane\)/);
});

test('Mobile review directly displays one responsive finance edit form and hides queued rows',()=>{
 const phone=receiver();const html=mobileFinanceReviewView(phone,{account:'all',page:0});
 assert.match(html,/data-finance-confirm="t1"/);assert.match(html,/name="category"/);assert.match(html,/name="flow"/);
 queueFinanceMobileDecision(phone,'t1','Lebensmittel / Supermarkt','expense',at,'d1');
 assert.equal(mobileFinanceReviewRows(phone).length,0);
 assert.doesNotMatch(mobileFinanceReviewView(phone),/data-finance-confirm="t1"/);
});
test('User-approved safe merchant rule is added only on the source after confirmation',()=>{
 const phone=receiver();phone.financeTransactions[0].merchant='Hofer';
 queueFinanceMobileDecision(phone,'t1','Lebensmittel / Supermarkt','expense',at,'d1',true);
 const primary=source();primary.financeTransactions[0].merchant='Hofer';primary.financeMobileDecisions=phone.financeMobileDecisions;
 const result=applyQueuedFinanceDecisions(primary,'2026-10-30T18:00:01Z');
 assert.equal(result.applied,1);assert.equal(primary.financeRules?.[0]?.category,'Lebensmittel / Supermarkt');
 assert.equal(phone.financeRules,undefined);
});
