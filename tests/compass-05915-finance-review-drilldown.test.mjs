import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeReviewProposal,applyFinanceReviewProposal} from '../client/src/finance-review-commit-v05915.js';
import {financeMonthBreakdown,premiumFinanceModel,financePremiumOverviewView} from '../client/src/finance-premium-v57753.js';
import {economicFlowIndex,economicFlowKind} from '../client/src/finance-economic-flows-v05914.js';
const row=(id,day,amountCents,flow,category,extra={})=>({id,day,amountCents,flow,category,accountId:'raiffeisen:current:EUR',merchant:'Buchungsgegenpartei',description:`Buchung ${id}`,...extra});
const incoming=row('in','2026-10-11',522800,'income','Einnahmen / Eingang ohne klare Herkunft',{needsReview:false,source:'broad-rule'});
const incoming2=row('in2','2026-10-12',25000,'income','Einnahmen / Eingang ohne klare Herkunft',{needsReview:true,source:'rule'});
const salary=row('salary','2026-10-10',300000,'income','Einnahmen / Gehalt',{needsReview:false,source:'rule'});
const paid=row('paid','2026-10-14',-262058,'expense','Lebensmittel / Supermarkt',{needsReview:false,source:'user',confidence:'confirmed',merchant:'SPAR'});
const own=row('transfer','2026-10-16',-150000,'transfer','Transfer / Eigene Konten',{needsReview:false});
const refund=row('refund','2026-10-21',3500,'refund','Rückerstattung / Rückzahlung',{needsReview:false,source:'user'});
const state=()=>({financeTransactions:[incoming,incoming2,salary,paid,own,refund],financeRules:[]});
test('review proposal accepts economically open row whose original needsReview is false',()=>{
 const s=state();
 const p=financeReviewProposal(s.financeTransactions,'in',{category:'Einnahmen / Honorare',flow:'income'});
 assert.equal(p.changes.length,1);
 assert.equal(p.changes[0].id,'in');
 assert.equal(s.financeTransactions[0].needsReview,false,'planning must not mutate state');
 const n=applyFinanceReviewProposal(s,p,{category:'Einnahmen / Honorare',flow:'income'});
 assert.equal(n,1);
 assert.equal(s.financeTransactions[0].needsReview,false);
 assert.equal(s.financeTransactions[0].source,'user');
 assert.equal(economicFlowKind(s.financeTransactions[0],economicFlowIndex(s.financeTransactions)),'income');
});
test('cannot label a positive bank inflow as consumption and must explain why',()=>{
 assert.throws(()=>financeReviewProposal(state().financeTransactions,'in',{category:'Essen & Ausgehen / Mensa & Kantine',flow:'expense'}),/Geldeingang.*nicht zum Buchungsvorzeichen/);
 assert.throws(()=>financeReviewProposal(state().financeTransactions,'in',{category:'Einnahmen / Gehalt',flow:'expense'}),/passen nicht zusammen/);
});
test('batch selection limited to projected group; confirmed income and outgoing do not change',()=>{
 const s=state();
 const p=financeReviewProposal(s.financeTransactions,'in',{category:'Transfer / Eigene Konten',flow:'transfer',applyAll:true});
 assert.deepEqual(p.changes.map(x=>x.id).sort(),['in','in2']);
 assert.equal(applyFinanceReviewProposal(s,p,{category:'Transfer / Eigene Konten',flow:'transfer'}),2);
 assert.equal(s.financeTransactions.find(x=>x.id==='salary').category,'Einnahmen / Gehalt');
 assert.equal(s.financeTransactions.find(x=>x.id==='paid').flow,'expense');
 assert.equal(s.financeTransactions.find(x=>x.id==='in').flow,'transfer');
 assert.equal(economicFlowKind(s.financeTransactions.find(x=>x.id==='in'),economicFlowIndex(s.financeTransactions)),'transfer');
});
test('rejected stale review selection does not mutate the vault',()=>{
 const s=state(),prior=JSON.stringify(s);
 assert.throws(()=>financeReviewProposal(s.financeTransactions,'salary',{category:'Einnahmen / Honorare',flow:'income'}),/nicht mehr offen/);
 assert.equal(JSON.stringify(s),prior);
});
test('audit rows reconcile to every displayed October metric, excluding transfers and unknown flows',()=>{
 const s=state();const p=financeReviewProposal(s.financeTransactions,'in',{category:'Einnahmen / Honorare',flow:'income'});
 applyFinanceReviewProposal(s,p,{category:'Einnahmen / Honorare',flow:'income'});
 const m=premiumFinanceModel(s,{period:'2026-10',today:'2026-11-01'});
 const rows=financeMonthBreakdown(s,'all','2026-10','2026-11-01');
 assert.equal(rows.income.reduce((v,t)=>v+t.amountCents,0),m.income);
 assert.equal(rows.refund.reduce((v,t)=>v+t.amountCents,0),m.refund);
 assert.equal(rows.expense.reduce((v,t)=>v-t.amountCents,0),m.expense);
 assert.equal(rows.income.some(t=>t.id==='transfer'),false);
 const html=financePremiumOverviewView(s,{period:'2026-10',today:'2026-11-01'});
 for(const label of ['data-finance-drill="income"','data-finance-drill="refund"','data-finance-drill="expense"','data-finance-drill="net"','Buchungen ansehen','Buchungsgegenpartei'])assert.ok(html.includes(label),label);
 assert.ok(html.indexOf('data-finance-drill="income"')<html.indexOf('data-finance-drill="expense"'));
 assert.ok(!html.includes('Buchung transfer'));
});
test('displayed transaction descriptions are safely escaped and IBANs masked',()=>{
 const malicious=row('evil','2026-10-03',1000,'income','Einnahmen / Gehalt',{merchant:'<script>bad</script>',description:'DE89370400440532013000 <img src=x onerror=alert(1)>',needsReview:false});
 const html=financePremiumOverviewView({financeTransactions:[malicious]},{period:'2026-10',today:'2026-11-01'});
 assert.ok(html.includes('&lt;script&gt;bad&lt;/script&gt;'));
 assert.ok(html.includes('[IBAN]'));
 assert.ok(!html.includes('<img src=x onerror'));
});
test('runtime both production and legacy entrypoints import review helper and show local errors',()=>{
 for(const file of ['main-full-v57759402510.js','main.js']){
  const text=readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
  assert.match(text,/financeReviewProposal\(state\.financeTransactions\|\|\[\]/);
  assert.match(text,/data-finance-review-feedback/);
  assert.doesNotMatch(text,/if\(!old\|\|!old\.needsReview\)return/);
 }
});
