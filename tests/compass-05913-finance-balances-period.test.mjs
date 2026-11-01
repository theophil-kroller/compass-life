import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {premiumFinanceRange,premiumFinanceModel,financePremiumOverviewView,financeAccountStatusModel} from '../client/src/finance-premium-v57753.js';
import {financePeriodInfo} from '../client/src/finance-visual-model.js';
const tx=(day,amountCents,flow,accountId='n26:current:EUR',extra={})=>({id:`${accountId}-${day}-${amountCents}`,day,amountCents,flow,accountId,category:'Lebensmittel',...extra});
const all={financeTransactions:[
 tx('2026-10-01',+200000,'income'),tx('2026-10-31',-50000,'expense'),tx('2026-10-20',+10000,'refund'),
 tx('2026-10-20',-200000,'transfer'),tx('2026-10-25',-2300,'expense','revolut:current:EUR'),
 tx('2026-11-01',-500,'expense'),tx('2026-09-30',-700,'expense'),
 tx('2026-10-24',-6000,'expense','n26:current:EUR',{needsReview:true})
],financeWealthSnapshots:[
 {type:'bank',label:'N26 · Giro EUR',day:'2026-10-02',cents:150000},
 {type:'bank',label:'N26 · Giro EUR',day:'2026-10-31',cents:175500},
 {type:'bank',label:'Revolut · Current EUR',day:'2026-10-30',cents:42100},
 {type:'other',label:'Aktienkonto',day:'2026-10-31',cents:50000}
]};
test('previous calendar month uses 1–31 October on 1 November, inclusive, not trailing 30 days',()=>{
 assert.deepEqual(premiumFinanceRange('lastMonth','2026-11-01'),{from:'2026-10-01',to:'2026-10-31'});
 const p=financePeriodInfo(all.financeTransactions,'lastMonth','2026-11-01');
 assert.equal(p.start,'2026-10-01');assert.equal(p.end,'2026-10-31');assert.equal(p.rows.length,6);
 assert.doesNotMatch(p.label,/bisher/);
});
test('year rollover, December, and leap February stay inclusive',()=>{
 assert.deepEqual(premiumFinanceRange('lastMonth','2027-01-03'),{from:'2026-12-01',to:'2026-12-31'});
 assert.deepEqual(premiumFinanceRange('lastMonth','2024-03-01'),{from:'2024-02-01',to:'2024-02-29'});
 assert.equal(financePeriodInfo([],'lastMonth','2024-03-01').end,'2024-02-29');
});
test('monthly cashflow excludes own transfers and uncertain transactions',()=>{
 const v=premiumFinanceModel(all,{today:'2026-11-01',period:'lastMonth'});
 assert.equal(v.income,200000);assert.equal(v.refund,10000);assert.equal(v.expense,52300);
 assert.equal(v.flow,157700);assert.equal(v.pending,6000);assert.equal(v.review,1);
 const current=premiumFinanceModel(all,{today:'2026-11-01',period:'current'});
 assert.equal(current.income,0);assert.equal(current.expense,500);
});
test('real bank snapshots use latest confirmed per named account, no invented balance',()=>{
 const m=financeAccountStatusModel(all,'2026-11-01');
 const n26=m.accounts.find(x=>x.label==='N26 · Giro EUR');
 assert.equal(n26.snapshot.cents,175500);assert.equal(n26.snapshot.day,'2026-10-31');
 assert.equal(n26.latestTransaction,'2026-11-01');
 assert.equal(m.accounts.find(x=>x.label==='Revolut · Current EUR').snapshot.cents,42100);
 assert.equal(m.knownCount,2);assert.equal(m.total,217600);assert.equal(m.incomplete,false);
 const missing=financeAccountStatusModel({financeTransactions:all.financeTransactions},'2026-11-01');
 assert.ok(missing.accounts.every(x=>x.snapshot===null));
 assert.equal(missing.knownCount,0);assert.equal(missing.total,0);
});
test('unmatched manual bank snapshot is shown independently without speculative account matching',()=>{
 const m=financeAccountStatusModel({financeTransactions:[tx('2026-10-27',123,'income')],financeWealthSnapshots:[{type:'bank',label:'N26 Privatkonto',day:'2026-10-27',cents:83212}]},'2026-11-01');
 assert.equal(m.accounts.length,2);assert.equal(m.accounts[0].snapshot,null);
 assert.equal(m.accounts[1].snapshot.cents,83212);assert.equal(m.incomplete,true);
});
test('future snapshots ignored in current overview, historical snapshots never called live',()=>{
 const m=financeAccountStatusModel({financeTransactions:[tx('2026-10-21',123,'income')],financeWealthSnapshots:[{type:'bank',label:'N26 · Giro EUR',day:'2026-12-01',cents:123400}]},'2026-11-01');
 assert.equal(m.knownCount,0);
 const html=financePremiumOverviewView(all,{today:'2026-11-01',period:'lastMonth'});
 for(const phrase of ['Letzter Monat','Wo liegt mein Geld?','Saldo vom 2026-10-31','Letzte Buchung: 2026-11-01','MONAT AUF EINEN BLICK','Oktober 2026','Kontostand erfassen / aktualisieren','finance-wealth-add'])assert.ok(html.includes(phrase),phrase);
 assert.match(html,/Dieser Monat/);assert.match(html,/fin53-chart-scroll/);assert.match(html,/fin79-open-review/);
});
test('user text is escaped and no missing bank balance shown as zero euros',()=>{
 const m=financePremiumOverviewView({financeTransactions:[{...tx('2026-10-20',5000,'income','<svg onload=alert(1)>') ,accountDisplay:'<img src=x onerror=alert(1)>'}]},{today:'2026-11-01',period:'lastMonth'});
 assert.doesNotMatch(m,/<img src=x onerror/);assert.match(m,/&lt;img src=x onerror/);
 assert.match(m,/Kein bestätigter Saldo/);
 assert.match(m,/Buchungsdatum ≠ Saldo-Stichtag/);
});
test('select and existing form handler retained; analytics range applies in dashboard too',()=>{
 const code=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(code,/financeWealthSnapshots=addWealthSnapshot/);
 assert.match(code,/getElementById\('thisDoesNotExist'\)|app\.querySelector\('#finance-wealth-add'\)/);
 const dashboard=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');
 assert.match(dashboard,/\['lastMonth','Letzter Monat'\]/);
});
