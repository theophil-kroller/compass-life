import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reportWindow,reportReadiness,reportEvidence,pairedCorrelation,reportDocument,reportSetupView,rankEvidenceLocally} from '../client/src/life-report-v577594018.js';
const days=n=>Array.from({length:n},(_,i)=>new Date(Date.UTC(2026,9,i+1,12)).toISOString().slice(0,10));
const s={healthImports:{garminNights:days(27).map((day,i)=>({day,totals:{deep:80+i,light:250,rem:120}})),garminHrv:days(27).map((day,i)=>({day,nightAverageMs:40+i})),fitdays:[{at:'2026-10-27T08:00:00Z',weightKg:80}],garminWellness:[]},nutritionJournal:{entries:[{id:'a',at:'2026-10-20T10:00:00Z',foodId:'apple',amount:'1 Stück'}]},financeTransactions:[{day:'2026-10-20',id:'private',description:'secret',merchant:'Secret merchant',amountCents:-13500,category:'Lebensmittel / Supermarkt',flow:'expense',needsReview:false}],placesVisits:[{id:'p',start:'2026-10-02T08:00:00Z',end:'2026-10-03T15:00:00Z',lat:47.07,lon:15.44,minutes:1860,name:'Graz'}]};
test('report windows are deterministic and exclude out-of-period evidence',()=>{assert.deepEqual(reportWindow('2026-10-28','month'),{start:'2026-09-29',end:'2026-10-28',days:30,period:'month'});assert.equal(reportWindow('2026-10-28','year').days,365);});
test('readiness treats Garmin imports as observed data, not proof of live sync',()=>{const v=reportReadiness(s,{now:'2026-10-28',period:'month'});assert.equal(v.sources.length,5);assert.ok(v.sources.find(x=>x.label==='Garmin Schlaf').count===27);assert.ok(v.sources.some(x=>x.stale));assert.ok(v.sources.every(x=>x.last===null||/^2026-/.test(x.last)));});
test('report never includes finance or coordinates without opt in',()=>{const body=reportDocument(s,{now:'2026-10-28',period:'month'});assert.ok(body.includes('Ars Vivendi'));assert.ok(body.includes('Schlaf im Jahresverlauf'));assert.ok(!body.includes('Secret merchant'));assert.ok(!body.includes('Graz'));assert.ok(!body.includes('Wo ich unterwegs war'));assert.ok(!body.includes('Finanzströme'));});
test('explicit finance and places opt ins render ORIGINAL Sankey and worldmap SVG',()=>{const body=reportDocument(s,{now:'2026-10-28',period:'year',finance:true,places:true});assert.ok(body.includes('Finanzströme'));assert.ok(body.includes('Sankey'));assert.match(body,/places-world-svg/);assert.match(body,/Originale Compass-Worldmap/);assert.ok(body.includes('Graz'));assert.ok(body.includes('Data Integrity'));});
test('correlation requires adequate matched, varying observations and claims no causality',()=>{const tiny=pairedCorrelation([{day:'2026-10-01',value:10}],[{day:'2026-10-01',value:20}]);assert.equal(tiny.r,null);assert.equal(tiny.n,1);const a=days(25).map((day,i)=>({day,value:400+i*2})),b=days(25).map((day,i)=>({day,value:40+i}));const r=pairedCorrelation(a,b);assert.equal(r.n,25);assert.equal(r.r,1);assert.match(reportDocument(s,{now:'2026-10-28'}),/keine Kausalität/i);});
test('local assistant can reorder existing evidence ids only',async()=>{const facts=[{id:'a',text:'10 Nächte',detail:'vorhanden'},{id:'b',text:'20 Tage',detail:'vorhanden'}];let sent;const fetcher=async(url,options)=>{if(url.endsWith('/models'))return {ok:true,json:async()=>({data:[{id:'test-local'}]})};sent=JSON.parse(options.body);return {ok:true,json:async()=>({choices:[{message:{content:'{"ids":["b","a"]}'}}]})};};const sorted=await rankEvidenceLocally(facts,{fetcher});assert.deepEqual(sorted,['b','a']);assert.equal(sent.messages[0].content.includes('Keine neuen Aussagen'),true);const bad=async(url)=>url.endsWith('/models')?{ok:true,json:async()=>({data:[{id:'test'}]})}:{ok:true,json:async()=>({choices:[{message:{content:'{"ids":["b","invented"]}'}}]})};await assert.rejects(rankEvidenceLocally(facts,{fetcher:bad}),/nicht belegte/);});
test('report accessible in insights, local privacy toggles and print action',()=>{const html=reportSetupView(s,{now:'2026-10-28',finance:false,places:false});assert.match(html,/clp-preview/);assert.match(html,/clp-finance/);assert.match(html,/clp-places/);assert.ok(!html.includes('checked/> Finanz'));const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');for(const key of ["lifeReportSettings={period:'year'","action==='clp-preview'","action==='clp-ai'","action==='clp-refresh'",'reportWindow.document.write'])assert.ok(main.includes(key),key);});

test('evidence-first recommendations include only logged deficiencies and explicit denominators',async()=>{
 const {reportRecommendations}=await import('../client/src/life-report-v577594018.js');
 const dates=days(26);
 const withLogs={nutritionJournal:{entries:dates.map((d,i)=>({id:'m'+i,at:d+'T12:00:00',foodId:'mixed-nuts',amount:'30 g'}))},healthImports:{garminNights:dates.map(day=>({day,totals:{deep:55,light:220,rem:60}})),garminHrv:[]}};
 const advice=reportRecommendations(withLogs,{now:'2026-10-28',period:'month'});
 assert.ok(advice.some(x=>x.id==='sleep-habit'));
 assert.ok(advice.some(x=>x.id.startsWith('dd-')));
 assert.ok(advice.every(x=>x.observation&&!/Mangel|Diagnose|du isst nie/i.test(x.observation)));
 const html=reportDocument(withLogs,{now:'2026-10-28',period:'month'});
 assert.ok(html.includes('Was ich ausprobieren könnte'));
 assert.ok(html.includes('Die folgenden Vorschläge'));
 assert.ok(!advice.some(x=>x.id==='saturated-fat'), 'No fat intake claim if logging / kcal coverage is incomplete');
});
test('recommendations never assert deficits from 2 logged days or missing nights',async()=>{
 const {reportRecommendations}=await import('../client/src/life-report-v577594018.js');
 const advice=reportRecommendations({nutritionJournal:{entries:[{id:'x',at:'2026-10-27T08:00:00',foodId:'apple'}]},healthImports:{garminNights:[]}},{now:'2026-10-28'});
 assert.deepEqual(advice,[]);
});
test('financial recommendations are explicit opt-in and never guess overspending',async()=>{
 const {reportRecommendations}=await import('../client/src/life-report-v577594018.js');
 const transactions=Array.from({length:20},(_,i)=>({day:'2026-10-21',amountCents:-1000,id:'tx'+i,category:i<6?'Unklar':'Lebensmittel / Supermarkt',needsReview:i<6,flow:'expense'}));
 const state={financeTransactions:transactions};
 assert.ok(!reportRecommendations(state,{now:'2026-10-28'}).some(x=>x.id.startsWith('finance')));
 const advice=reportRecommendations(state,{now:'2026-10-28',finance:true});
 assert.ok(advice.some(x=>x.id==='finance-review'));
 assert.ok(!advice.some(x=>/zu viel|zu hohe ausgaben/i.test(x.observation)));
});
test('saturated-fat signal requires 14 fully characterized days and cites observed energy share only',async()=>{
 const {reportRecommendations}=await import('../client/src/life-report-v577594018.js');
 const entries=days(16).map((day,i)=>({id:'butter'+i,at:day+'T13:00:00',foodId:'butter-hofer',amount:'150 g'}));
 const advice=reportRecommendations({nutritionJournal:{entries}},{now:'2026-10-28',period:'month'});
 const fat=advice.find(x=>x.id==='saturated-fat');
 assert.ok(fat,'Daily fully covered logs with high saturated energy share trigger a cautious advice');
 assert.match(fat.observation,/16 auswertbaren protokollierten Tagen/);
 assert.match(fat.method,/10 % ist eine allgemeine Ernährungsorientierung/);
 assert.ok(!reportRecommendations({nutritionJournal:{entries:entries.slice(0,13)}},{now:'2026-10-28'}).some(x=>x.id==='saturated-fat'));
});
