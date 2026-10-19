import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {merchantKey} from '../client/src/finance-core.js';
import {financeForecastModel,financeForecastDashboard} from '../client/src/finance-forecast-v18.js';
import {financeDashboardView,FINANCE_TABS} from '../client/src/finance-dashboard.js';
import {financeNavIcon} from '../client/src/finance-navigation-icons.js';
const tr=(day,amountCents,category='Lebensmittel / Supermarkt',flow='expense',merchant='Supermarkt')=>({id:day+':'+amountCents+':'+merchant,day,amountCents,category,flow,merchant,needsReview:false});
const rows=[];
for(let i=0;i<12;i++){
 const d=new Date(Date.UTC(2025,9+i,10)).toISOString().slice(0,10),md=d.slice(0,7);
 rows.push(tr(md+'-03',-95000,'Wohnen / Miete & Betriebskosten','expense','Vermieter'));
 rows.push(tr(md+'-12',-(25000+700*i),'Lebensmittel / Supermarkt'));
 rows.push(tr(md+'-15',155000,'Einnahmen / Gehalt','income','Arbeitgeber'));
 rows.push(tr(md+'-20',-200000,'Transfer / Eigene Konten','transfer','Eigener Transfer'));
}
const manual={[merchantKey('Vermieter')]:'fixed'};
test('0.5.18 monthly forecasts exclude inter-account transfers and count only verified recurring payments',()=>{
 const r=financeForecastModel(rows,manual,'2026-10-19');
 assert.equal(r.ready,true);assert.equal(r.confirmedMerchants,1);
 assert.equal(r.fixed,95000);
 assert.ok(r.variable>25000&&r.variable<40000);
 assert.equal(r.baseline,r.fixed+r.variable);
 assert.equal(r.scenario.length,3);
 assert.equal(r.scenario[0].month,'2026-11');
 assert.ok(r.backtests>=3);
 assert.ok(r.scenario[2].high>=r.scenario[0].high);
});
test('0.5.18 scenarios vary variable spending only and do not silently alter fixed costs',()=>{
 const baseline=financeForecastDashboard(rows,manual,'2026-10-19','basis');
 const low=financeForecastDashboard(rows,manual,'2026-10-19','sparsam');
 const high=financeForecastDashboard(rows,manual,'2026-10-19','mehr');
 const nums=s=>[...s.matchAll(/<div><small>2026-11<\/small><strong>([^<]+)/g)].map(x=>x[1]);
 assert.ok(baseline.includes('95.000') || baseline.includes('950,00'));
 assert.notDeepEqual(nums(baseline),nums(low));assert.notDeepEqual(nums(baseline),nums(high));
 assert.match(baseline,/Rücktest|rückblickenden/);assert.match(baseline,/keine garantierte|garantierte Prognose/);
 assert.ok(!baseline.includes('Eigener Transfer'));
});
test('0.5.18 no forecast on missing immediately preceding month even when older history exists',()=>{
 const x=rows.filter(t=>t.day<'2026-09-01');const r=financeForecastModel(x,manual,'2026-10-19');
 assert.equal(r.ready,false);assert.equal(r.baseline,null);
 assert.match(financeForecastDashboard(x,manual,'2026-10-19'),/nicht belastbar/);
});
test('0.5.18 excludes unresolved spending from baseline and never trusts merchant alone for fixed',()=>{
 const x=rows.concat([{...tr('2026-09-11',-500000,'Sonstiges / Zahlung ohne klaren Zweck'),needsReview:true}]);
 const base=financeForecastModel(rows,{},'2026-10-19'),extra=financeForecastModel(x,{},'2026-10-19');
 assert.equal(base.baseline,extra.baseline);assert.equal(extra.fixed,0);
 assert.ok(extra.warnings.some(x=>x.includes('Ungeklärte')));
});
test('0.5.18 finance panes show meaningful icons, including forecast and account flows',()=>{
 const html=financeDashboardView({financeTransactions:rows,financeRecurringRules:manual},'Prognose','last12',null,0,{today:'2026-10-19'});
 assert.match(html,/fin-nav-icon/);assert.match(html,/fin-nav-chart/);assert.match(html,/fin-nav-git-merge/);
 assert.match(html,/finance-forecast-scenario/);assert.match(html,/fin-forecast-18/);
 assert.ok((html.match(/class="fin-nav-icon/g)||[]).length>=FINANCE_TABS.length);
 assert.match(financeNavIcon('UNKNOWN'),/fin-nav-layers/);
 assert.ok(!financeNavIcon('bad"><script>').includes('<script>'));
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(source,/COMPASS_CLIENT_VERSION='0\.5\.21\.1'/);assert.match(source,/finance-forecast-scenario/);
});
