import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {economicFlowIndex,economicFlowKind} from '../client/src/finance-economic-flows-v05914.js';
import {premiumFinanceModel,financeAccountStatusModel,financePremiumOverviewView} from '../client/src/finance-premium-v57753.js';
import {financeMonthlySeries,financeExpenseOverview} from '../client/src/finance-analytics.js';
import {financeViewModel} from '../client/src/finance-core.js';
const row=(id,day,cents,flow,category,accountId='raiffeisen:current:EUR',extra={})=>({id,day,amountCents:cents,flow,category,accountId,merchant:category,description:category,...extra});
const tx=[
 row('pay','2026-10-01',300000,'income','Einnahmen / Gehalt'),
 row('grocery','2026-10-04',-18000,'expense','Lebensmittel / Supermarkt'),
 row('refund','2026-10-08',2500,'refund','Rückerstattung / Rückzahlung'),
 row('own-a','2026-10-10',-50000,'expense','Sonstiges / Zahlung ohne klaren Zweck','raiffeisen:current:EUR',{description:'EIGENÜBERTRAG nach N26',source:'broad-rule'}),
 row('own-b','2026-10-11',50000,'income','Einnahmen / Eingang ohne klare Herkunft','n26:current:EUR',{source:'broad-rule'}),
 row('card','2026-10-12',-65000,'expense','Sonstiges / Überweisung ohne klaren Zweck','raiffeisen:current:EUR',{description:'Kreditkartenabrechnung VISA',source:'broad-rule'}),
 row('cash','2026-10-13',-10000,'cash','Bargeld / Bargeldbehebung'),
 row('unknown-out','2026-10-14',-181309,'expense','Sonstiges / Zahlung ohne klaren Zweck','raiffeisen:current:EUR',{source:'broad-rule'}),
 row('unknown-in','2026-10-15',80000,'income','Einnahmen / Eingang ohne klare Herkunft','n26:current:EUR',{source:'broad-rule'}),
 row('confirmed-other','2026-10-16',-3000,'expense','Sonstiges / Zahlung ohne klaren Zweck','n26:current:EUR',{source:'user',confidence:'confirmed'}),
 row('single-side','2026-10-17',-20000,'expense','Sonstiges / Überweisung ohne klaren Zweck','raiffeisen:current:EUR',{source:'broad-rule'}),
 row('other-side','2026-10-18',20000,'income','Einnahmen / Eingang ohne klare Herkunft','revolut:current:EUR',{source:'broad-rule'}),
 row('external','2026-10-20',-12345,'expense','Wohnen / Miete & Betriebskosten','raiffeisen:current:EUR',{description:'Betriebskosten Wohnung',source:'user',confidence:'confirmed'})
];
test('same account transfers and broad unknown income/expenses do not inflate cashflow or Sonstiges',()=>{
 const state={financeTransactions:tx},p=premiumFinanceModel(state,{period:'2026-10',today:'2026-11-01'});
 assert.equal(p.income,300000);assert.equal(p.refund,2500);assert.equal(p.expense,18000+3000+12345);
 assert.equal(p.flow,300000+2500-(18000+3000+12345));
 assert.equal(p.categories.find(c=>c.name==='Sonstiges').cents,3000);
 assert.equal(p.transfers,3);assert.ok(p.pending>=181309+80000+20000+20000);
 const vm=financeViewModel(tx,'2026-10');assert.equal(vm.incomeCents,p.income);assert.equal(vm.expenseCents,p.expense);assert.equal(vm.netCents,p.flow);
 const a=financeMonthlySeries(tx,'2026-10');assert.equal(a[0].incomeCents,p.income);assert.equal(a[0].expenseCents,p.expense);
 const e=financeExpenseOverview(tx,'2026-10');assert.equal(e.categories.find(c=>c.name==='Sonstiges')?.cents,3000);
});
test('do not mistake real user-confirmed housing for self transfer merely on matching amount',()=>{
 const a=row('out','2026-10-10',-50000,'expense','Wohnen / Miete & Betriebskosten','raiffeisen:current:EUR',{source:'user',confidence:'confirmed'});
 const b=row('in','2026-10-10',50000,'income','Einnahmen / Eingang ohne klare Herkunft','n26:current:EUR',{source:'broad-rule'});
 const v=economicFlowIndex([a,b]);assert.equal(economicFlowKind(a,v),'expense');assert.equal(economicFlowKind(b,v),'uncertain');
});
test('confirmed linked account pairs cannot double count, but change per-account ledger',()=>{
 const a=row('x','2026-10-10',-40000,'expense','Sonstiges','raiffeisen:current:EUR',{linkedTransferId:'y',source:'user'});
 const b=row('y','2026-10-11',40000,'income','Einnahmen','n26:current:EUR',{linkedTransferId:'x',source:'user'});
 const idx=economicFlowIndex([a,b]);assert.equal(economicFlowKind(a,idx),'transfer');assert.equal(economicFlowKind(b,idx),'transfer');
 const balances=financeAccountStatusModel({financeTransactions:[a,b],financeWealthSnapshots:[
  {type:'bank',label:'Raiffeisen · Giro',day:'2026-10-01',cents:100000},
  {type:'bank',label:'N26 · Giro EUR',day:'2026-10-01',cents:10000}
 ]},'2026-11-01','2026-10-31');
 assert.equal(balances.accounts.find(x=>x.label==='Raiffeisen · Giro').balanceCents,60000);
 assert.equal(balances.accounts.find(x=>x.label==='N26 · Giro EUR').balanceCents,50000);
 assert.equal(balances.total,110000);
});
test('forward and backward anchored bank balances on selected day, closest snapshot used',()=>{
 const state={financeTransactions:[
 row('v1','2026-10-10',10000,'income','Einnahmen','n26:current:EUR'),
 row('v2','2026-10-20',-7000,'expense','Lebensmittel','n26:current:EUR'),
 row('v3','2026-11-02',-2000,'transfer','Transfer','n26:current:EUR'),
 ],financeWealthSnapshots:[
 {type:'bank',label:'N26 · Giro EUR',day:'2026-10-15',cents:20000},
 {type:'bank',label:'N26 · Giro EUR',day:'2026-11-05',cents:18000}
 ]};
 const oct=financeAccountStatusModel(state,'2026-11-06','2026-10-31');
 assert.equal(oct.accounts[0].balanceCents,13000);assert.equal(oct.accounts[0].derived,true);
 const early=financeAccountStatusModel(state,'2026-11-06','2026-10-09');
 assert.equal(early.accounts[0].balanceCents,10000); // later Oct 15 anchor minus Oct 10 credit
 const exact=financeAccountStatusModel(state,'2026-11-06','2026-10-15');
 assert.equal(exact.accounts[0].balanceCents,20000);assert.equal(exact.accounts[0].derived,false);
 const nov=financeAccountStatusModel(state,'2026-11-06','2026-11-05');
 assert.equal(nov.accounts[0].balanceCents,18000);assert.equal(nov.accounts[0].derived,false);
});
test('no snapshot means missing balance (not zero); unknown label never bridged',()=>{
 const state={financeTransactions:[row('v','2026-10-05',20000,'income','Einnahmen','n26:current:EUR')],financeWealthSnapshots:[{type:'bank',label:'N26 private savings',day:'2026-10-01',cents:12300}]};
 const m=financeAccountStatusModel(state,'2026-11-01','2026-10-31');
 assert.equal(m.accounts.find(x=>x.id==='n26:current:EUR').balanceCents,null);
 assert.equal(m.accounts.find(x=>x.id.startsWith('snapshot:')).balanceCents,12300);
 assert.equal(m.incomplete,true);
});
test('chart appears before finance month figures and balances; month-navigation hook exists',()=>{
 const html=financePremiumOverviewView({financeTransactions:tx,financeWealthSnapshots:[]},{period:'lastMonth',today:'2026-11-01'});
 assert.ok(html.indexOf('GELDFLUSS ZUERST')<html.indexOf('MONAT AUF EINEN BLICK'));
 assert.ok(html.indexOf('MONAT AUF EINEN BLICK')<html.indexOf('KONTEN &amp; SALDEN'));
 assert.match(html,/finance-month-step/);assert.match(html,/Netto-Cashflow · Sparspielraum/);assert.match(html,/wirtschaftlich ungeklärt/);
 assert.match(readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8'),/if\(action==='finance-month-step'\)/);
});
