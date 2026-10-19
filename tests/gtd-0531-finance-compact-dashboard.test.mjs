import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
import {financeMonthlyMini,financeRecentPeek,financeBudgetPeek,financeFixedPeek} from '../client/src/finance-overview-v31.js';
const tx=(id,day,amountCents,flow='expense',extra={})=>({id,day,amountCents,flow,needsReview:false,merchant:'Beispiel',category:'Wohnen / Miete & Betriebskosten',...extra});
const data=[tx('1','2026-10-13',-8300),tx('2','2026-09-13',-7000),tx('3','2026-10-14',280000,'income'),tx('4','2026-10-15',-20000,'transfer'),tx('5','2026-10-18',-4000,'expense',{needsReview:true})];
const state={financeTransactions:data};
const markup=(pane='Überblick')=>financeDashboardView(state,pane,'last12',null,0,{today:'2026-10-19'});
test('finance first fold: month chart, real transactions, budget and confirmed cost panels appear before optional Sankey',()=>{
 const html=markup();for(const cls of ['fin31-primary-row','fin31-months','fin31-recent','fin31-secondary-row','fin31-budget','fin31-fixed','fin31-advanced-flow'])assert.match(html,new RegExp(cls));
 assert.ok(html.indexOf('fin31-months')<html.indexOf('fin31-advanced-flow'));
 assert.ok(html.indexOf('fin31-recent')<html.indexOf('fin31-advanced-flow'));
 assert.match(html,/<details id="finance-overview-sankey" class="fin31-advanced-flow"/);
 assert.match(html, /fin30-lead-grid/);
});
test('finance other panes retain classic drill-down and detailed Sankey',()=>{
 assert.doesNotMatch(markup('Ausgaben'),/fin31-primary-row/);
 assert.match(markup('Ausgaben'),/SPENDING · VIER EBENEN/);
 assert.doesNotMatch(markup('Cashflow'),/fin31-advanced-flow/);
});
test('monthly chart counts confirmed consumption and income, never transfer/pending and never fills missing months',()=>{
 const html=financeMonthlyMini(data);
 assert.match(html,/83,00/);
 assert.match(html,/2\.800,00/);
 assert.doesNotMatch(html,/200,00/);
 assert.doesNotMatch(html,/40,00/);
 assert.equal((html.match(/class="fin31-month"/g)||[]).length,2);
});
test('recent entries display actual transaction status, not fictitious merchants, and escape HTML',()=>{
 const html=financeRecentPeek([...data,tx('x','2026-10-19',-200,'expense',{merchant:'<img src=x onerror=alert(1)>',needsReview:true})]);
 assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img src=x/);
 assert.match(html,/prüfen/);assert.match(html,/data-id="Buchungen"/);
});
test('budgets are not falsely presented as account-specific and unconfigured goals show no invented money',()=>{
 const html=financeBudgetPeek(state,'2026-10-19','n26:personal');
 assert.match(html,/gilt für alle Konten/);assert.doesNotMatch(html,/0,00.*\/.*0,00/);
 assert.match(financeFixedPeek(data,{}),/Noch keine bestätigten regelmäßigen Zahlungen/);
});
test('dashboard layout is scoped to finance and mobile responsive',()=>{
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(css,/\.finance-workspace \.fin31-row/);assert.match(css,/@media\(max-width:950px\)/);
});
