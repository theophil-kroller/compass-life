import test from 'node:test';
import assert from 'node:assert/strict';
import {trendModel96,tCritical96,trendSvg96} from '../client/src/trend-statistics-v0591.js';
import {vTaperModel88,vTaperChart88,vTaperView88} from '../client/src/coach-integration-v0588.js';
import {bodyTransformationView} from '../client/src/body-transformation-v57749.js';
import {fatMassVisualView} from '../client/src/body-fat-visual-v57759402522.js';
import {fitdaysInterpretationView} from '../client/src/fitdays-interpretation-v57759402517.js';
const day=(n)=>new Date(Date.parse('2026-10-20T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const points=Array.from({length:12},(_,i)=>({day:day(i),value:87-i*.16 + [.01,-.05,.05][i%3]}));
const fitdays=points.map((p,i)=>({day:p.day,at:p.day+'T09:00:00Z',weightKg:p.value,bodyFatPct:24.5-i*.06,muscleKg:61+i*.02}));
const guided={id:'coach-documented',source:'compass-guided-v5920',startedAt:'2026-10-22T07:00:00Z',completed:true,exercises:[{exerciseId:'dumbbell-row',confirmedSets:[{confirmed:true,setNumber:1,reps:10,weightKg:12}]}]};
const state={healthImports:{fitdays},strengthGuidedSessions:[guided]};
test('two-sided 96% t quantiles match reference values, df=1,2,8,large',()=>{
 assert.ok(Math.abs(tCritical96(1)-15.8945448)<.01);
 assert.ok(Math.abs(tCritical96(2)-4.848733)<.01);
 assert.ok(Math.abs(tCritical96(8)-2.45)<.1);
 assert.ok(Math.abs(tCritical96(1000)-2.056)<.02);
});
test('regression uses real elapsed days, 96% CI for conditional mean, never inserts missing dates',()=>{
 const t=trendModel96(points);
 assert.equal(t.n,12);assert.equal(t.spanDays,11);assert.equal(t.confidence,.96);
 assert.ok(t.slopePerDay<-.1);assert.equal(t.fitted.length,12);
 assert.ok(t.fitted.every(p=>p.upper>=p.mean&&p.mean>=p.lower));
 assert.match(trendSvg96(t,{X:d=>+d.slice(-2),Y:y=>y}),/ci91-confidence/);
});
test('short windows and sparse points do not generate bogus confidence bands',()=>{
 assert.equal(trendModel96(points.slice(0,4)),null);
 assert.equal(trendModel96(points.slice(0,5),{minSpanDays:7}),null);
 assert.equal(trendModel96([]),null);
});
test('per-date duplicate measurements do not overweight a day',()=>{
 const a=trendModel96([...points, {...points.at(0),value:70}]);
 assert.equal(a.n,points.length);assert.equal(a.fitted.length,points.length);
});
test('V-Taper shows a short training-era trend before 45-day forecasting is allowed',()=>{
 const model=vTaperModel88(state,{today:'2026-11-01',horizonMonths:3});
 assert.equal(model.trainingStart,'2026-10-22');assert.equal(model.forecast,null);
 assert.ok(model.postTrainingTrend);assert.ok(model.trainingObservations>=8);
 const chart=vTaperChart88(state,model),view=vTaperView88(state,{today:'2026-11-01',horizonMonths:3});
 assert.match(chart,/ci91-confidence/);assert.match(chart,/Trainingsbeginn/);
 assert.match(view,/Seit Trainingsbeginn/);assert.match(view,/45 Tage/);
 assert.doesNotMatch(chart,/NaN|Infinity/);
});
test('body weight, fat and muscle dot charts show 96% bands, readable values',()=>{
 const html=bodyTransformationView(state,{today:'2026-11-01',range:'28'});
 assert.equal((html.match(/ci91-confidence/g)||[]).length,3);
 assert.match(html,/96-%-Konfidenzband/);assert.match(html,/Körperfett \(BIA\)/);
 assert.match(html,/<text x="41"/);
});
test('fat mass chart shows y axis values and a labelled trend and keeps measurement dots',()=>{
 const html=fatMassVisualView(fitdays);
 assert.match(html,/ci91-confidence/);
 assert.match(html,/kg<\/text>/);
 assert.match(html,/Fettmasse · einzelne Messpunkte/);
});
test('empty target-weight strip omitted but caller-supplied target can still display',()=>{
 const bare=fitdaysInterpretationView(fitdays,{today:'2026-11-01',range:'28',heightCm:185});
 assert.doesNotMatch(bare,/<div class="fdi-report-strip" aria-label="Obesity · Gewicht/);
 assert.match(bare,/leere Zielgewichts-Balken entfällt/);
 const target=fitdaysInterpretationView(fitdays,{today:'2026-11-01',range:'28',heightCm:185,targetWeightKg:80});
 assert.match(target,/freiwilliges Zielgewicht/);
});
test('Garmin session dates with unknown set counts are not plotted as zero performed sets',()=>{
 const html=bodyTransformationView(state,{today:'2026-11-01',range:'28',strengthSessions:[{day:day(0),id:'summary',reportedSets:null,sets:[]}]});
 assert.match(html,/Satzdaten fehlen/);assert.match(html,/Sätze unbekannt/);
});
test('No exercise or fitdays data means no fabricated V-Taper slope',()=>{
 const m=vTaperModel88({healthImports:{fitdays:[]}}, {today:'2026-11-01'});
 assert.equal(m.postTrainingTrend,null);assert.equal(m.forecast,null);
});
