import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
import {circularWealthFlowView} from '../client/src/finance-circular-flow-v32.js';
import {deepSankey} from '../client/src/finance-deep-sankey.js';
const read=name=>readFileSync(new URL('../client/src/'+name,import.meta.url),'utf8');
const tx=(id,cents,flow,category,accountId='n26:main',extra={})=>({id,day:'2026-10-05',amountCents:cents,flow,category,accountId,accountDisplay:accountId,merchant:'Beispiel',description:'',needsReview:false,...extra});
const rows=[tx('pair-a',-10000,'transfer','Transfer / Eigenübertrag','n26:main',{linkedTransferId:'pair-b'}),tx('pair-b',10000,'transfer','Transfer / Eigenübertrag','revolut:main',{linkedTransferId:'pair-a'}),tx('depot',-5000,'transfer','Transfer / Depot & Wertpapiere','n26:main',{description:'Flatex Einzahlung'}),tx('shop',-12345,'expense','Lebensmittel / Einkauf')];
test('Ausgaben shows compact circular observed flows BEFORE full four-level Sankey and retains link drilldown',()=>{
 const html=financeDashboardView({financeTransactions:rows},'Ausgaben','last12',null,0,{today:'2026-10-19'});
 const circle=html.indexOf('class="fin32-cycle-layout fin33-cycle-compact"');
 const sankey=html.indexOf('class="fin-visual-section fin33-spending-flow"');
 assert.ok(circle>0 && sankey>circle,'Circular flows first, 4-level Sankey second');
 assert.match(html,/fin33-cycle-connections/);
 assert.match(html,/data-action="finance-cycle-inspect"/);
 assert.match(html,/Abgänge → Hauptkategorien → Unterkategorien → Händler/);
});
test('Cashflow similarly prioritizes observed circle and avoids redundant cycle promo',()=>{
 const html=financeDashboardView({financeTransactions:rows},'Cashflow','last12',null,0,{today:'2026-10-19'});
 assert.ok(html.indexOf('fin33-cycle-compact')<html.indexOf('fin30-primary-flow'));
 assert.doesNotMatch(html,/fin32-cycle-promo/);
});
test('Compact network folds large lists while selected edge shows real transaction details directly',()=>{
 const view=circularWealthFlowView({},rows,'','all',{compact:true});
 assert.match(view,/<details class="fin33-cycle-connections">/);
 assert.match(view,/<details class="fin33-cycle-method">/);
 const selected=circularWealthFlowView({},rows,JSON.stringify(['n26:main','revolut:main','confirmed']),'all',{compact:true});
 assert.match(selected,/fin32-cycle-detail/);
 assert.match(selected,/2026-10-05/);
});
test('Sankey source ribbon begins at column top, no tall merchant-centering gap',()=>{
 const html=deepSankey(rows);
 assert.match(html,/x="132" y="68"/);
 assert.match(html,/Lebensmittel/);
 assert.match(html,/Händler \/ Zahlungspartner/);
});
test('Desktop Insights duplicates are hidden; mobile nav still available and productivity sidebar linked',()=>{
 const main=read('main.js'),css=read('style.css');
 assert.match(main,/data-action="calm-insight-view" data-id="focus"/);
 assert.match(main,/calm-insight-toolbar" aria-label="Mobile Insights-Navigation"/);
 assert.match(main,/class="insight-heading-main"/);
 assert.match(css,/@media\(min-width:701px\)\{\.insight-workspace>\.calm-insight-toolbar\{display:none\}/);
 assert.match(css,/@media\(max-width:700px\)\{\.insight-workspace>\.calm-insight-toolbar\{margin:/);
});
test('Finance icons resize as one system; only redundant successful sync notice is suppressed',()=>{
 const css=read('style.css'),main=read('main.js');
 assert.match(css,/\.fin32-header \.fin-nav-icon svg\{width:16px;height:16px/);
 assert.match(main,/notice==='Synchronisiert\. Alle verfügbaren Änderungen abgeglichen\.'/);
 assert.match(main,/\$\{error\?`<div role="alert" class="alert bad"/);
});
