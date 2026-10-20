import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {merchantExpenseGroups,normalizedMerchant,merchantInsightsView} from '../client/src/finance-merchant-insights.js';
import {addWealthSnapshot,wealthSummary,consolidatedWealthView,validateWealthSnapshot} from '../client/src/finance-wealth-consolidation.js';
const tx=(merchant,category,cents,day='2026-08-13',other={})=>({merchant,category,amountCents:-cents,day,flow:'expense',needsReview:false,...other});
test('bank merchants are consolidated across POS spelling without claiming item-level receipts',()=>{
 const rows=[tx('HOFER 02133 GRAZ','Lebensmittel / Supermarkt',2300),tx('Hofer Markt','Lebensmittel / Supermarkt',500),tx('SPAR Kasse','Lebensmittel / Supermarkt',3400),tx('BILLA PLUS','Lebensmittel / Supermarkt',1000),tx('BILLA 10','Lebensmittel / Supermarkt',750),tx('HOFER','Shopping / Online-Shopping',9000),tx('HOFER','Lebensmittel / Supermarkt',999,'2026-08-10',{needsReview:true}),tx('HOFER','Lebensmittel / Supermarkt',1000,'2026-08-10',{flow:'transfer'})];
 const r=merchantExpenseGroups(rows,'Lebensmittel');assert.equal(r.length,1);assert.equal(r[0].cents,7950);assert.equal(r[0].merchants.find(x=>x.name==='Hofer').cents,2800);
 assert.equal(r[0].merchants.find(x=>x.name==='Billa Plus').cents,1000);assert.equal(r[0].merchants.find(x=>x.name==='Billa').cents,750);
 const html=merchantInsightsView(rows,'Lebensmittel');assert.match(html,/Hofer/);assert.match(html,/Spar/);assert.match(html,/einzelne Produkte/);assert.doesNotMatch(html,/9.000,00/);
});
test('unknown merchant stays unknown, XSS is escaped',()=>{
 assert.equal(normalizedMerchant('PAYPAL *ABCD'),'PAYPAL *ABCD');
 assert.doesNotMatch(merchantInsightsView([tx('<img src=x onerror=alert(1)>','Lebensmittel / Supermarkt',800)]),/<img/);
});
test('wealth snapshots remain as-of local evidence and replace exact same day',()=>{
 let a=addWealthSnapshot([],{type:'bank',label:'N26',day:'2026-10-18',cents:12345});a=addWealthSnapshot(a,{type:'bank',label:'N26',day:'2026-10-18',cents:11000});a=addWealthSnapshot(a,{type:'flatex',label:'Depot',day:'2026-10-18',cents:510000});a=addWealthSnapshot(a,{type:'liability',label:'Loan',day:'2026-10-18',cents:25000});
 assert.equal(a.length,3);const v=wealthSummary({financeWealthSnapshots:a});assert.equal(v.totalObservedCents,496000);assert.equal(v.partial,true);
 assert.match(consolidatedWealthView({financeWealthSnapshots:a},'2026-10-19'),/Beobachteter Saldo/);assert.match(consolidatedWealthView({financeWealthSnapshots:a},'2026-10-19'),/finance-wealth-add/);
});
test('inconsistent dates, invalid valuation amounts and unknown types are rejected',()=>{
 for(const d of ['2026-02-30','2026-13-10','bad'])assert.throws(()=>validateWealthSnapshot({type:'bank',label:'Test',day:d,cents:100}));
 assert.throws(()=>validateWealthSnapshot({type:'crypto',label:'Kraken',day:'2026-10-18',cents:100}));
 assert.throws(()=>validateWealthSnapshot({type:'bank',label:'Test',day:'2026-10-18',cents:1.7}));
});
test('kraken partial cannot be silently counted as complete wealth',()=>{
 const v=wealthSummary({krakenPortfolio:{balances:{XXBT:'1',ETH:'2'},quotesEur:{XXBT:'100'}}});assert.equal(v.krakenPricedCents,10000);assert.equal(v.kraken.complete,false);assert.equal(v.partial,true);
});
test('0.5.17.6 is wired to finance UX without private data',()=>{
 const dash=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.49\.1'/);assert.match(dash,/merchantInsightsView\(filtered/);assert.match(dash,/consolidatedWealthView\(state/);assert.match(main,/finance-wealth-add/);
});
