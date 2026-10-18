import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hierarchicalFlows,hierarchicalSankey,signedSunburst,radialSankey,powerVoronoi,voronoiTreemap} from '../client/src/finance-exotic-hierarchy.js';
import {comparisonPeriods,categoryTotals,comparisonChord,comparisonRadar,COMPARISONS} from '../client/src/finance-comparison.js';
import {TEMPORAL_CHARTS,spendingCalendar,spendingSpiral,spendingHorizon,spendingStreamgraph,spendingAlluvial} from '../client/src/finance-exotic-time.js';
import {financeVisualLab,financeDashboardView,FINANCE_TABS} from '../client/src/finance-dashboard.js';
const tx=(day,category,cents,flow='expense',extra={})=>({id:`${day}|${category}|${cents}`,day,category,amountCents:cents,flow,needsReview:false,merchant:'Test',description:'Demonstration',...extra});
const history=[];
for(let i=0;i<30;i++){
 const d=new Date(Date.UTC(2024,5+i,16)).toISOString().slice(0,10);
 history.push(tx(d,'Lebensmittel / Supermarkt',-22000-i*400),tx(d,'Lebensmittel / Bäckerei',-3800),tx(d,'Lebensmittel / Bio-Lebensmittel',-5900),tx(d,'Wohnen / Miete & Betriebskosten',-69000),tx(d,'Gesundheit & Sport / Tanzen',-9000),tx(d,'Freizeit & Reisen / Flüge',-3000),tx(d,'Einnahmen / Gehalt',210000,'income'));
}
history.push(tx('2026-10-05','Transfer / Eigene Konten',-900000,'transfer'),tx('2026-10-06','Bargeld / Bargeldbehebung',-15000,'cash'),tx('2026-10-08','Prüfen / Noch ungeklärt',-9000,'expense',{needsReview:true}));
test('three-stage sankey classifies real main and subcategories; transfers and cash remain separate',()=>{
 const input=hierarchicalFlows(history);const food=input.find(c=>c.name==='Lebensmittel');
 assert.ok(food);assert.equal(food.children.length,3);assert.equal(food.cents,food.children.reduce((s,c)=>s+c.cents,0));
 assert.ok(input.some(c=>c.name==='Transfers / Investieren'));
 assert.ok(input.some(c=>c.name==='Bargeld · Zweck unbekannt'));
 assert.ok(input.some(c=>c.name==='Noch ungeklärt'));
 const svg=hierarchicalSankey(history);
 for(const label of ['Abgänge','Hauptkategorien','Unterkategorien','Lebensmittel','Bio-Lebensmittel','Tanzen','data-action="finance-subcategory-select"'])assert.match(svg,new RegExp(label));
 assert.equal(hierarchicalFlows(history).reduce((s,x)=>s+x.cents,0),history.filter(t=>t.amountCents<0).reduce((s,x)=>s-x.amountCents,0));
});
test('hierarchy and special charts do not print raw HTML in user-provided merchant/category labels',()=>{
 const row=tx('2026-10-12','<img src=x onerror=alert(1)> / <script>foo</script>',-5000);
 for(const svg of [hierarchicalSankey([row]),signedSunburst([row]),radialSankey([row]),voronoiTreemap([row])]){
  assert.ok(!svg.includes('<script>'));
  assert.ok(!svg.includes('<img'));
 }
});
test('weighted Voronoi is a real power partition with area approximately proportional to amount',()=>{
 const input=[{name:'One',cents:600000},{name:'Two',cents:270000},{name:'Three',cents:100000},{name:'Four',cents:30000}];
 const result=powerVoronoi(input,900,400);const total=360000;
 assert.equal(result.length,4);
 for(let i=0;i<result.length;i++)assert.ok(Math.abs(result[i].area/total-input[i].cents/1e6)<.025,`${input[i].name} target ${input[i].cents} actual ${result[i].area}`);
 assert.ok(Math.abs(result.reduce((s,r)=>s+r.area,0)-360000)<10);
});
test('signs in sunburst are distinct; radial depiction does not route through centre',()=>{
 const sb=signedSunburst(history);assert.match(sb,/Abgänge/);assert.match(sb,/Zuflüsse/);assert.match(sb,/getrennt/);
 const radial=radialSankey(history);assert.match(radial,/Unterkategorien/);assert.match(radial,/Konsum/);
 assert.doesNotMatch(radial,/Q440 266/);
});
test('period comparisons align elapsed dates, including meteorological winter and preceding quarter',()=>{
 let t=comparisonPeriods(history,'month_year','2026-10-18');assert.equal(t.aStart,'2026-10-01');assert.equal(t.aEnd,'2026-10-18');assert.equal(t.bStart,'2025-10-01');assert.equal(t.bEnd,'2025-10-18');
 t=comparisonPeriods(history,'quarter_prev','2026-10-18');assert.equal(t.aStart,'2026-10-01');assert.equal(t.bStart,'2026-07-01');assert.equal(t.bEnd,'2026-07-18');
 t=comparisonPeriods(history,'season_year','2026-10-18');assert.equal(t.aStart,'2026-09-01');assert.equal(t.bStart,'2025-09-01');
 t=comparisonPeriods(history,'season_year','2026-01-20');assert.equal(t.aStart,'2025-12-01');assert.equal(t.bStart,'2024-12-01');
 t=comparisonPeriods(history,'year_year','2026-10-18');assert.equal(t.aStart,'2026-01-01');assert.equal(t.bStart,'2025-01-01');
 assert.equal(COMPARISONS.length,7);
});
test('chord is same-category period linking, radar normalized, never imagined transfers',()=>{
 const pair=comparisonPeriods(history,'month_year','2026-10-18');
 assert.ok(pair.comparable);
 const chord=comparisonChord(pair),radar=comparisonRadar(pair);
 assert.match(chord,/keine/);assert.match(chord,/Geldflüsse zwischen Kategorien/);
 assert.match(radar,/100 %/);assert.match(radar,/250 %/);
 assert.equal(categoryTotals(pair.a).get('Lebensmittel')>0,true);
 assert.equal(categoryTotals(pair.a).has('Transfer'),false);
});
test('five temporal charts use observed series and show explicit limits',()=>{
 assert.equal(TEMPORAL_CHARTS.length,5);
 const charts=[spendingCalendar(history),spendingSpiral(history),spendingHorizon(history),spendingStreamgraph(history),spendingAlluvial(history)];
 for(const chart of charts){assert.match(chart,/<svg/);assert.match(chart,/fin-art-note/);assert.doesNotMatch(chart,/(?:NaN|undefined)/);}
 assert.match(charts[0],/finance-day-select/);assert.match(charts[3],/Streamgraph/);assert.match(charts[4],/derselben Kategorie/);
 assert.match(spendingHorizon(history.slice(0,7)),/Mindestens sechs Monate/);
});
test('Visual Lab selectable; finance spending and cashflow contain the actual hierarchical chart and keep import',()=>{
 assert.ok(FINANCE_TABS.some(t=>t.title==='Visual Lab'));
 const lab=financeVisualLab(history,history,{visualMode:'voronoi',compareMode:'month_year'},'2026-10-18');assert.match(lab,/Voronoi-Treemap/);assert.match(lab,/finance-viz-mode/);
 const compare=financeVisualLab(history,history,{visualMode:'chord',compareMode:'month_year'},'2026-10-18');assert.match(compare,/finance-compare-mode/);
 const spending=financeDashboardView({financeTransactions:history},'Ausgaben','last12',null,0,{today:'2026-10-18'});
 assert.match(spending,/Abgänge → Hauptkategorien → Unterkategorien/);assert.match(spending,/finance-files/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/finance-subcategory-select/);assert.match(main,/finance-day-select/);assert.match(main,/COMPASS_CLIENT_VERSION='0\.4\.17\.5'/);
});
