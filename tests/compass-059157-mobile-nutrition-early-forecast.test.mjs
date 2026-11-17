import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {vTaperModel88,vTaperView88} from '../client/src/coach-integration-v0588.js';
const source=(file)=>readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
const date=(n)=>new Date(Date.parse('2026-10-24T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const guided={id:'one',source:'compass-guided-v5920',startedAt:'2026-10-24T08:00:00Z',completed:true,exercises:[{exerciseId:'dumbbell-row',confirmedSets:[{confirmed:true,reps:10,weightKg:12}]}]};
const st={strengthGuidedSessions:[guided],healthImports:{fitdays:Array.from({length:21},(_,i)=>({day:date(i),weightKg:87-i*.055,bodyFatPct:24}))}};
test('realistic 21-day training history shows the 3, 6, 12 and 24-month planning scenarios',()=>{
 for(const months of [3,6,12,24]){
  const m=vTaperModel88(st,{today:date(20),horizonMonths:months});
  assert.equal(m.sufficient,true);assert.equal(m.forecastStage,'early');assert.equal(m.forecast?.length,3);
  assert.ok(m.forecast.every(x=>x.months===months&&x.weightRangeKg[0]<=x.weightRangeKg[1]));
  const view=vTaperView88(st,{today:date(20),horizonMonths:months});
  assert.match(view,new RegExp(`Vorausschau · ${months} Monate`));assert.match(view,/Frühe Vorausschau/);
  assert.doesNotMatch(view,/NaN|Infinity/);
 }
});
test('recent post-training data are required: no borrowing old pre-training observations',()=>{
 const tooFew={...st,healthImports:{fitdays:[...st.healthImports.fitdays.slice(0,6),{day:'2026-01-02',weightKg:77}]}};
 assert.equal(vTaperModel88(tooFew,{today:date(20)}).forecast,null);
});
test('the mobile nutrition layout keeps actual navigation and tables scrollable rather than clipped',()=>{
 const focus=source('nutrition-focus-v577594017.css');
 const dashboard=source('nutrition-coach-v059152.css');
 assert.match(focus,/\.nf4017-workspace\{width:100%\}/);
 assert.match(focus,/touch-action:pan-x/);
 assert.match(focus,/\.nf4017-workspace table\{display:block;max-width:100%;overflow-x:auto/);
 assert.match(dashboard,/\.ni152 \.ni154-donut-layout\{grid-template-columns:minmax\(0,1fr\)\}/);
 assert.match(dashboard,/\.ni152 \.ni152-pager strong\{min-width:0/);
 assert.match(dashboard,/\.ni152 \.ni152-dozenrow\{grid-template-columns:minmax\(0,1fr\) auto/);
});
