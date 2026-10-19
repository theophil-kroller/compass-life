import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
const txn=(day,amountCents,flow='expense')=>({id:`fake-${day}-${amountCents}`,day,accountId:'raiffeisen:giro',amountCents,flow,merchant:'TEST TRANSACTION',category:'Lebensmittel / Supermarkt',description:'Nur Testdaten',needsReview:false,confidence:'confirmed'});
const rows=[txn('2026-10-03',-1850),txn('2026-10-12',-4600),txn('2026-09-03',-1400),txn('2026-09-12',-4200),txn('2026-08-12',-1950),txn('2026-07-12',-2900),txn('2026-10-07',230000,'income')];
const html=pane=>financeDashboardView({financeTransactions:rows},pane,'last12',null,0,{account:'all',today:'2026-10-19'});
test('finance cockpit puts compact costs and cumulative pace ahead of deeper Sankey',()=>{
 const markup=html('Überblick');
 const summary=markup.indexOf('fin43-stat-grid');
 const lead=markup.indexOf('fin43-overview-charts');
 assert.ok(summary>0&&summary<lead);
 assert.ok(markup.indexOf('class="fin-pace"')>lead);
 assert.ok(markup.indexOf('fin43-overview-charts')<markup.indexOf('fin30-primary-flow'));
 assert.match(markup,/<details class="fin43-more-overview">/);
 assert.match(markup,/<details class="fin30-more-controls">/);
 assert.doesNotMatch(markup,/class="calm-finance-head"/);
});
test('finance filter settings retain account filtering and import actions behind disclosure',()=>{
 const markup=html('Überblick');
 assert.match(markup,/<summary>Filter &amp; Daten/);
 assert.match(markup, /id="finance-account"/);
 assert.match(markup, /id="finance-period"/);
 assert.match(markup, /data-action="finance-open-import"/);
 assert.match(markup, /data-action="finance-reclassify"/);
 assert.match(markup, /data-action="finance-pane" data-id="Prüfen"/);
});
test('money flow remains foregrounded in spending pane and existing advanced diagrams survive',()=>{
 const markup=html('Ausgaben');
 assert.match(markup, /hierarchicalSankey|SPENDING · VIER EBENEN/);
 assert.match(markup, /SPENDING TREEMAP/);
 assert.doesNotMatch(markup, /class="fin30-lead-grid"/);
});
test('finance first-fold is responsive and does not hide budget goals',()=>{
 const styles=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(styles, /\.fin30-lead-grid/);
 assert.match(styles, /@media\(max-width:720px\)/);
 assert.match(html('Budget & Ziele'), /fin30-goal-grid/);
});
