import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {threeMonthCostModel,observedLiquidity,checkedCostClass,financeNecessitiesView} from '../client/src/finance-essentials-v43.js';
import {financeDashboardView,FINANCE_TABS,FINANCE_GROUPS,financeGroupForPane} from '../client/src/finance-dashboard.js';
import {privateSection,FINANCE_FIELDS} from '../client/src/private-device-sync-v30.js';
const tx=(day,amount,flow='expense',category='Lebensmittel / Supermarkt',extra={})=>({id:`${day}-${amount}`,day,amountCents:amount,flow,category,merchant:'Testhändler',needsReview:false,...extra});
const today='2026-10-19';
const transactions=[tx('2026-07-12',-30000),tx('2026-08-13',-60000),tx('2026-09-11',-90000),tx('2026-09-15',-200000,'transfer','Transfer / Eigene Konten'),tx('2026-08-07',-3000,'cash','Bargeld / Bargeldbehebung'),tx('2026-07-08',-8000,'expense','Shopping / Online-Shopping',{needsReview:true}),tx('2026-09-15',40000,'refund','Rückerstattung / Rückzahlung'),tx('2026-10-03',-40000)];
test('three completed calendar months: 3-month average excludes active month, transfers, refunds, cash and pending',()=>{
 const m=threeMonthCostModel(transactions,today,{'Lebensmittel / Supermarkt':'essential'});
 assert.deepEqual(m.months,['2026-07','2026-08','2026-09']);assert.equal(m.total,180000);assert.equal(m.average,60000);assert.equal(m.totals.essential,180000);
 assert.equal(m.pendingCount,1);assert.equal(m.cashCount,1);assert.equal(m.classified,true);
});
test('missing month is not silently replaced with zero, but spending still tracked',()=>{
 const m=threeMonthCostModel(transactions.filter(t=>!t.day.startsWith('2026-08')),today,{});
 assert.equal(m.average,null);assert.equal(m.complete,false);assert.equal(m.totals.unclassified,120000);
});
test('only allowed category-to-cost assignments are saved; defaults remain unclassified',()=>{
 assert.equal(checkedCostClass('Lebensmittel / Supermarkt','optional'),'optional');
 assert.throws(()=>checkedCostClass('Transfer / Eigene Konten','essential'));
 assert.throws(()=>checkedCostClass('Lebensmittel / Supermarkt','<script>'));
 const html=financeNecessitiesView({financeCostClasses:{}},transactions,today);
 assert.match(html,/Kategorien einordnen/);assert.match(html,/Noch nicht zugeordnet/);assert.match(html,/data-finance-cost-class="Lebensmittel \/ Supermarkt"/);
 assert.doesNotMatch(html,/<script>/);
});
test('liquidity runway only from dated bank balances, stale balance of any included account invalidates it',()=>{
 const fresh={financeWealthSnapshots:[{type:'bank',label:'Bank A',day:'2026-10-18',cents:300000},{type:'bank',label:'Bank B',day:'2026-10-17',cents:100000}]};
 assert.deepEqual(observedLiquidity(fresh,today),{cents:400000,old:false,latest:'2026-10-18',count:2});
 const html=financeNecessitiesView({...fresh,financeCostClasses:{'Lebensmittel / Supermarkt':'essential'}},transactions,today,{compact:true});
 assert.match(html,/6,7 Mon\.|6\.7 Mon\./);
 const stale={financeWealthSnapshots:[...fresh.financeWealthSnapshots.slice(0,1),{type:'bank',label:'Bank B',day:'2026-08-01',cents:100000}]};
 assert.equal(observedLiquidity(stale,today).old,true);
 assert.match(financeNecessitiesView({...stale,financeCostClasses:{'Lebensmittel / Supermarkt':'essential'}},transactions,today,{compact:true}),/Liquiditätsreichweite<\/small><strong>–/);
});
test('five primary groups retain every legacy finance pane exactly once, with contextual tabs',()=>{
 assert.equal(FINANCE_GROUPS.length,5);
 const panes=FINANCE_GROUPS.flatMap(x=>x.panes);
 assert.deepEqual([...panes].sort(),FINANCE_TABS.map(x=>x.title).sort());assert.equal(new Set(panes).size,panes.length);
 assert.equal(financeGroupForPane('Visual Lab').title,'Werkzeuge');
 assert.equal(financeGroupForPane('Pflicht & Luxus').title,'Ausgaben');
 const out=financeDashboardView({financeTransactions:transactions},'Pflicht & Luxus','last12',null,0,{today});
 assert.match(out,/fin43-subtabs/);assert.match(out,/finance-cost-class/);
 const overview=financeDashboardView({financeTransactions:transactions},'Überblick','last12',null,0,{today});
 assert.ok(overview.indexOf('fin43-stat-grid')<overview.indexOf('fin-pace-plot'));
 assert.ok(overview.indexOf('fin-pace-plot')<overview.indexOf('finance-overview-sankey'));
 assert.match(overview,/Weitere Kennzahlen, letzte Buchungen/);
});
test('cost class preferences persist in local private device payload without new worker schema',()=>{
 assert.ok(FINANCE_FIELDS.includes('financeCostClasses'));
 const part=privateSection({financeCostClasses:{'Wohnen / Miete & Betriebskosten':'essential'}},'finance');
 assert.equal(part.financeCostClasses['Wohnen / Miete & Betriebskosten'],'essential');
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/FINANCE_GROUPS\.map\(group=>/);
 assert.match(main,/data-action="calm-finance-group"/);
 assert.match(main,/data-finance-cost-class/);
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(css,/\.tree-line\.fin43-folder-row \.tree-label/);
 assert.match(css,/\.fin43-overview-charts \.fin-pace-plot svg\{max-height:175px\}/);
});
