import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
import {circularWealthFlowView,observedCircularEdges} from '../client/src/finance-circular-flow-v32.js';
import {categoryInsightCards} from '../client/src/finance-visuals.js';
const tx=(id,amountCents,accountId='n26:main',extra={})=>({id,day:'2026-10-05',amountCents,accountId,accountDisplay:accountId,flow:'transfer',needsReview:false,merchant:'Beispiel',description:'',...extra});
const observed=[tx('a',-10000,'n26:main',{linkedTransferId:'b'}),tx('b',10000,'revolut:main',{linkedTransferId:'a'}),tx('c',-5500,'n26:main',{category:'Transfer / Depot & Wertpapiere',description:'Flatex Einzahlung'}),tx('d',-9000,'n26:main',{flow:'expense',category:'Wohnen / Miete'}),tx('e',-6500,'n26:main',{flow:'transfer',needsReview:true,category:'Transfer / Krypto',description:'Kraken'})];
test('circular graph includes only paired verified internal moves and categorized deposits, not consumption or pending',()=>{
 const edges=observedCircularEdges(observed);
 assert.equal(edges.length,2);assert.equal(edges.reduce((s,e)=>s+e.cents,0),15500);
 assert.equal(edges.find(e=>e.type==='confirmed')?.transactionIds.length,2);
 assert.equal(edges.find(e=>e.type==='investment')?.transactionIds.length,1);
 assert.ok(!JSON.stringify(edges).includes('9000'));
});
test('unilateral unverified transfer does not create confirmed self-to-self loop',()=>{
 assert.equal(observedCircularEdges([tx('s',-5000,'n26:main',{linkedTransferId:'missing'})]).length,0);
 assert.equal(observedCircularEdges([tx('x',-1000,'n26:main',{linkedTransferId:'y'}),tx('y',1000,'n26:main',{linkedTransferId:'x'})]).length,0);
});
test('circular flow provides interactive true-transaction inspector and no fictional net worth',()=>{
 const e=observedCircularEdges(observed)[0];
 const html=circularWealthFlowView({financeWealthSnapshots:[]},observed,e.id);
 assert.match(html,/fin32-cycle-chart/);assert.match(html,/data-action="finance-cycle-inspect"/);
 assert.match(html,/fin32-cycle-detail/);assert.match(html,/2026-10-05/);
 assert.doesNotMatch(html,/Separat dokumentierte Bestände/);
 assert.match(html,/Summe der Bewegungen, nicht Vermögenswert/);
});
test('finance period is in the SAME nav header; unused filter row omitted',()=>{
 const html=financeDashboardView({financeTransactions:observed},'Überblick','last12',null,0,{today:'2026-10-19'});
 assert.match(html,/<div class="fin32-header fin37-header"><span/);
 assert.match(html,/<div class="fin30-topbar fin32-header-tools">/);
 assert.ok(html.indexOf('fin32-header-tools')<html.indexOf('</div></div>'));
 assert.doesNotMatch(html,/<span class="fin30-coverage">/);
});
test('compact patterns use mini-card grid, smaller SVG and preserve drilldown',()=>{
 const spends=[tx('spend1',-1000,'n26:main',{flow:'expense',category:'Lebensmittel / Einkauf'})];
 const html=categoryInsightCards(spends,'2026-10-19');
 assert.match(html,/fin32-pattern-grid/);assert.match(html,/fin32-pattern-card/);
 assert.match(html,/viewBox="0 0 420 55"/);assert.match(html,/data-action="finance-category-select"/);
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(css,/fin32-pattern-grid\{display:grid;grid-template-columns:repeat\(4/);
 assert.match(css,/@media\(max-width:560px\)/);
});
test('cycle pane is reachable and is filtered to actual source account',()=>{
 const html=financeDashboardView({financeTransactions:observed},'Geldkreislauf','last12',null,0,{account:'n26:main',today:'2026-10-19'});
 assert.match(html,/Interaktiver Vermögenskreislauf/);
 assert.match(html,/finance-cycle-inspect/);
 assert.match(html,/n26:main/);
});
