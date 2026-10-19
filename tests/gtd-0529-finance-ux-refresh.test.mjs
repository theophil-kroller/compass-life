import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spendingPaceModel,spendingPaceView} from '../client/src/finance-spending-pace-v29.js';
import {accountActivityModel,recordedAccountSnapshots,financeAccountsView} from '../client/src/finance-accounts-v29.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
import {deepSankeyModel,deepSankey} from '../client/src/finance-deep-sankey.js';
const expense=(day,n,accountId='n26:current:EUR')=>({day,amountCents:-n,accountId,category:'Lebensmittel / Supermarkt',merchant:'Test',flow:'expense',needsReview:false});

test('Spending pace compares the same elapsed days, excluding future days, transfers and unresolved rows',()=>{
 const rows=[expense('2026-10-01',1000),expense('2026-10-19',2000),expense('2026-10-20',99999),expense('2026-09-01',500),expense('2026-09-19',1000),expense('2026-09-25',9999),{...expense('2026-10-05',25000),flow:'transfer'},{...expense('2026-10-07',20000),needsReview:true}];
 const m=spendingPaceModel(rows,'2026-10-19');assert.equal(m.current.total,3000);assert.equal(m.current.series.length,19);assert.equal(m.previous.total,1500);assert.equal(m.deltaCents,1500);assert.equal(m.deltaPercent,100);
 const html=spendingPaceView(rows,'2026-10-19');assert.match(html,/€\s*30/);assert.match(html,/€\s*15/);assert.match(html,/finance-pace-compare/);assert.match(html,/Unvollständige Bankexporte/);
});
test('Three-month comparison is unavailable if a month has no observed source rows',()=>{
 const rows=[expense('2026-10-08',200),expense('2026-09-08',300),expense('2026-08-08',100)];let m=spendingPaceModel(rows,'2026-10-19');assert.equal(m.average3,null);
 const html=spendingPaceView(rows,'2026-10-19','average3');assert.match(html,/Drei-Monats-Vergleich ist erst/);
 m=spendingPaceModel([...rows,expense('2026-07-08',200)],'2026-10-19');assert.equal(m.average3.series.at(-1),200);
});
test('February is capped to calendar length; invalid dates are rejected cleanly',()=>{
 const m=spendingPaceModel([expense('2026-03-31',100),expense('2026-02-28',700)],'2026-03-31');assert.equal(m.previous.series.length,28);assert.equal(m.previous.total,700);
 assert.throws(()=>spendingPaceModel([],'2026-99-99'),/Ungültiger/);
});
test('Account overview separates bank/card sources, never equates transaction flow with a balance',()=>{
 const rows=[expense('2026-10-15',1000),{...expense('2026-10-10',500,'dkb:visa:EUR'),flow:'transfer'}];
 const v=accountActivityModel(rows,rows);assert.equal(v.length,2);assert.equal(v.find(x=>x.id.startsWith('dkb:')).group,'Karten');assert.equal(v.find(x=>x.id.startsWith('n26:')).group,'Bankkonten');
 const html=financeAccountsView({financeTransactions:rows,financeWealthSnapshots:[]},rows);assert.match(html,/Abgänge im gewählten Zeitraum/);assert.match(html,/keine Kontostände/i);assert.match(html,/finance-account-pick/);assert.doesNotMatch(html,/Kontostand.*10,00/);
});
test('Manual wealth snapshots use latest date per source, with no duplicate summation or invented trends',()=>{
 const s=[{label:'N26',type:'bank',day:'2026-09-30',cents:10000},{label:'N26',type:'bank',day:'2026-10-16',cents:15000},{label:'Depot',type:'flatex',day:'2026-10-01',cents:30000}];
 assert.deepEqual(recordedAccountSnapshots(s).map(x=>x.cents).sort(),[15000,30000]);
 const html=financeAccountsView({financeTransactions:[],financeWealthSnapshots:s});assert.match(html,/N26/);assert.match(html,/€\s*150/);assert.match(html,/2026-10-16/);
});
test('Finance overview renders pace; accounts is navigable and previous Sankey and gauges remain',()=>{
 const transactions=[expense('2026-10-11',12345)];const overview=financeDashboardView({financeTransactions:transactions},'Überblick','current',null,0,{today:'2026-10-19'});
 assert.match(overview,/Wie schnell gebe ich diesen Monat Geld aus/);assert.match(overview,/Wohin fließt mein Geld/);assert.match(overview,/fin43-stat/);
 const accounts=financeDashboardView({financeTransactions:transactions},'Konten','current',null,0,{today:'2026-10-19'});assert.match(accounts,/Konten im Überblick/);assert.match(accounts,/Aktueller Finanzbereich/);
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');assert.match(source,/finance-account-pick/);assert.match(source,/finance-pace-compare/);
});
test('Sankey retains canonical merchant merging with updated richer ribbon geometry',()=>{
 const rows=[{...expense('2026-10-10',1500),merchant:'AMAZON EU'},{...expense('2026-10-11',2500),merchant:'Klarna',merchantDisplayName:'Amazon'}];
 const model=deepSankeyModel(rows);assert.equal(model[0].cents,4000);assert.match(deepSankey(rows),/Vierstufiger Sankey/);assert.match(deepSankey(rows),/finance-merchant-select/);
});
