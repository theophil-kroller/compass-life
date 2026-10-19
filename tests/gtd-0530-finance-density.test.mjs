import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
import {spendingPaceView} from '../client/src/finance-spending-pace-v29.js';

const row=(id,day,amountCents,category,flow='expense')=>({id,day,accountId:'raiffeisen:giro',amountCents,category,flow,merchant:'TEST',description:'Test only',needsReview:false,confidence:'confirmed'});
const rows=[row('a','2026-10-05',-4500,'Lebensmittel / Supermarkt'),row('b','2026-10-07',-3000,'Wohnen / Betriebskosten'),row('c','2026-10-10',-2100,'Mobilität / ÖPNV'),row('d','2026-10-11',-100,'Freizeit / Sonstiges'),row('e','2026-10-12',20000,'Einkommen / Sonstiges','income'),row('f','2026-09-08',-1000,'Lebensmittel / Supermarkt')];
const state={financeTransactions:rows};
const html=(pane='Überblick')=>financeDashboardView(state,pane,'current',null,0,{today:'2026-10-19',account:'all'});

test('compact finance lead shows real top three categories in the right rail, before the Sankey',()=>{
 const markup=html();
 assert.match(markup, /class="fin30-glance-rail"/);
 assert.match(markup, /class="fin30-category-peek"/);
 const category=markup.slice(markup.indexOf('class="fin30-category-peek"'),markup.indexOf('</aside>'));
 assert.match(category, /Lebensmittel/);
 assert.match(category, /Wohnen/);
 assert.match(category, /Mobilität/);
 assert.doesNotMatch(category, /Freizeit/);
 assert.match(category, /data-action="finance-pane" data-id="Ausgaben"/);
 assert.ok(markup.indexOf('fin30-category-peek')<markup.indexOf('fin30-primary-flow'));
 assert.ok(markup.indexOf('fin30-primary-flow')<markup.indexOf('fin30-deep-insights'));
});
test('pending transfers do not appear as consumer categories in the glance panel',()=>{
 const onlyTransfer=[row('t','2026-10-10',-30000,'Sonstiges / Transfer','transfer')];
 const markup=financeDashboardView({financeTransactions:onlyTransfer},'Überblick','current',null,0,{today:'2026-10-19'});
 assert.doesNotMatch(markup, /class="fin30-category-peek"/);
});
test('finance chart is shorter and disclosure keeps methodological caveats accessible',()=>{
 const pace=spendingPaceView(rows,'2026-10-19');
 assert.match(pace, /viewBox="0 0 760 196"/);
 assert.match(pace, /<details class="fin-pace-caveat"><summary>Datenhinweise<\/summary>/);
 assert.match(pace,/Unvollständige Bankexporte/);
});
test('scoped density CSS retains responsive two-column KPIs and specialist finance diagrams',()=>{
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(css,/\.finance-workspace \.fin30-glance-rail/);
 assert.match(css,/\.finance-workspace \.fin30-peek-row/);
 assert.match(css, /@media\(max-width:650px\)/);
 assert.match(html('Ausgaben'),/SPENDING · VIER EBENEN/);
 assert.doesNotMatch(html('Ausgaben'),/fin30-category-peek/);
});
