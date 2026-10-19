import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financePeriodInfo,financeCategorySeries,financialSnapshot} from '../client/src/finance-visual-model.js';
import {categoryInsightCards,financeDonut,financeTreemap,financeOutflowSankey,financeStackedArea,financeWaterfall,financeForecastView,financeCategoryFocusedView} from '../client/src/finance-visuals.js';
import {financeDashboardView,FINANCE_TABS} from '../client/src/finance-dashboard.js';
const day=(year,month,d=15)=>`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const row=(date,cents,category='Lebensmittel / Supermarkt',flow='expense',extra={})=>({day:date,amountCents:cents,category,flow,needsReview:false,id:`test-${date}-${cents}-${category}`,merchant:'Markt',description:'test',...extra});
const history=[];
for(let i=0;i<13;i++){const d=new Date(Date.UTC(2025,8+i,15)),m=day(d.getUTCFullYear(),d.getUTCMonth()+1);
 history.push(row(m,-40000-i*1000),row(m,-10000,'Wohnen / Miete & Betriebskosten'),row(m,65000,'Einnahmen / Gehalt','income'));
}
history.push(row('2026-10-08',-21000),row('2026-10-15',-7000));
test('rolling financial windows are date-bounded and not mistaken for all time',()=>{
 const a=financePeriodInfo(history,'last3','2026-10-18');
 assert.equal(a.start,'2026-08-01');assert.equal(a.end,'2026-10-18');assert.ok(a.rows.length<history.length);
 assert.equal(financePeriodInfo(history,'current','2026-10-18').start,'2026-10-01');
 assert.equal(financePeriodInfo(history,'ytd','2026-10-18').start,'2026-01-01');
 assert.ok(financePeriodInfo(history,'all','2026-10-18').rows.length===history.length);
 assert.equal(financePeriodInfo(history,'2025','2026-10-18').rows[0].day.slice(0,4),'2025');
});
test('category statistics ignore inflows/transfers and exclude current and first partial month',()=>{
 const r=financeCategorySeries(history,'Lebensmittel','2026-10-18');
 assert.equal(r.n,12);
 assert.ok(r.mean>40000&&r.mean<60000);
 assert.ok(r.p20<=r.mean&&r.mean<=r.p80);
 assert.equal(r.spent,28000);
 assert.ok(r.forecast>r.spent);assert.ok(r.history.every(x=>x.month<'2026-10'));
 const missing=financeCategorySeries([row('2026-10-08',-50000)],'Lebensmittel','2026-10-18');
 assert.equal(missing.n,0);assert.equal(missing.forecast,null);
});
test('five chart types render true data only and distinguish conditional projections',()=>{
 const o=financePeriodInfo(history,'last12','2026-10-18').rows;
 assert.match(financeOutflowSankey(o),/Abgänge/);
 assert.match(financeTreemap(o),/Treemap/);
 assert.match(financeDonut(o),/Konsumausgaben/);
 assert.match(financeStackedArea(o),/Gestapelte Ausgabenkategorien/);
 assert.match(financeWaterfall(o),/kein Kontostand/);
 assert.match(financeForecastView(history,'2026-10-18'),/kein statistisch kalibriertes Konfidenzintervall/);
 const empty=financeForecastView([row('2026-10-08',-1000)],'2026-10-18');
 assert.match(empty,/fehlen zusammenhängende Monatsdaten/);
});
test('category insight uses dark green through orange and red gradient and shows range transparently',()=>{
 const html=categoryInsightCards(history,'2026-10-18');
 for(const color of ['#155B48','#E7B15E','#B93D52'])assert.ok(html.includes(color));
 assert.match(html,/20.–80. Perzentil/);assert.match(html,/data-action="finance-category-select"/);
 assert.match(financeCategoryFocusedView(history,'Lebensmittel','2026-10-18'),/fin-focused-months/);
});
test('does not expose unescaped category names or invent missing sums',()=>{
 const suspicious=row('2026-10-09',-5000,'<script>alert(1)</script> / Shop');
 for(const html of [financeTreemap([suspicious]),financeDonut([suspicious]),categoryInsightCards([suspicious],'2026-10-18')]){
  assert.ok(!html.includes('<script>'));
 }
 assert.match(categoryInsightCards([]),/Noch keine kategorisierten Ausgaben/);
});
test('dashboard shows new panes period semantics and retains import',()=>{
 const html=financeDashboardView({financeTransactions:history},'Ausgaben','last3',null,0,{today:'2026-10-18'});
 assert.match(html,/Letzte 3 Kalendermonate/);
 assert.match(html,/fin-pattern-grid/);assert.match(html,/fin-treemap/);assert.match(html,/fin-donut/);
 assert.match(html,/finance-files/);
 assert.ok(FINANCE_TABS.find(t=>t.title==='Einnahmen'));
 assert.ok(FINANCE_TABS.find(t=>t.title==='Prognose'));
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(source,/COMPASS_CLIENT_VERSION='0\.5\.25'/);assert.match(source,/finance-category-select/);
});
