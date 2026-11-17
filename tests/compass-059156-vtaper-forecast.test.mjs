import test from 'node:test';
import assert from 'node:assert/strict';
import {vTaperModel88,vTaperTapeRatio88,vTaperView88,vTaperChart88} from '../client/src/coach-integration-v0588.js';
const day=(d)=>new Date(d+'T12:00:00Z').toISOString().slice(0,10);
const offset=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const guide=(d)=>({id:'session-'+d,source:'compass-guided-v5920',startedAt:d+'T06:00:00Z',completed:true,exercises:[{exerciseId:'dumbbell-row',confirmedSets:[{confirmed:true,setNumber:1,reps:10,weightKg:10}]}]});
const measurements=(start,count,step,kg)=>Array.from({length:count},(_,i)=>({day:offset(start,i*step),weightKg:kg-i*.08,bodyFatPct:24}));
const tape=(at,regionId,valueCm)=>({id:at+'|'+regionId,day:at.slice(0,10),at,regionId,valueCm,source:'fitdays-plus',method:'import',protocol:'fitdays-export'});
test('Smart Tape shoulder and waist pair from same imported session appears in Strength dashboard',()=>{
 const st={healthImports:{fitdays:[]},nutritionJournal:{bodyMeasures88:[
  tape('2026-11-04T07:00:00.000Z','shoulder',110.3),tape('2026-11-04T07:00:00.000Z','waist',93),
  tape('2026-11-11T07:00:00.000Z','shoulder',111.4),tape('2026-11-11T07:00:00.000Z','waist',94.4)
 ]}};
 const m=vTaperModel88(st,{today:'2026-11-17'});
 assert.equal(m.ratio,1.18);assert.equal(m.circum.shoulderCm,111.4);assert.equal(m.circum.waistCm,94.4);
 const html=vTaperView88(st,{today:'2026-11-17'});
 assert.match(html,/1,180/);assert.match(html,/Schulter 111,4 cm/);assert.match(html,/Taille 94,4 cm/);
});
test('Never match shoulder and waist from different timestamps, sources or protocols',()=>{
 const st={nutritionJournal:{bodyMeasures88:[
  tape('2026-11-11T07:00:00.000Z','shoulder',111),tape('2026-11-11T19:00:00.000Z','waist',90),
  {...tape('2026-11-12T07:00:00.000Z','waist',92),source:'manual'}
 ]}};
 assert.equal(vTaperTapeRatio88(st,{today:'2026-11-17'}),null);
});
test('Legacy manually entered paired measurements still render alongside imported Smart Tape',()=>{
 const st={nutritionJournal:{bodyMeasures88:[{id:'old',day:'2026-11-01',shoulderCm:110,waistCm:90}]}};
 assert.equal(vTaperTapeRatio88(st,{today:'2026-11-17'}).ratio,1.222);
});
test('Short recent training window never generates scenarios from longer PRE-training measurements',()=>{
 const st={healthImports:{fitdays:[...measurements('2026-08-01',30,3,88),...measurements('2026-11-01',9,2,86)]},strengthGuidedSessions:[guide('2026-11-01')]};
 const m=vTaperModel88(st,{today:'2026-11-17',horizonMonths:6});
 assert.equal(m.sufficient,false);assert.equal(m.forecast,null);
 assert.equal(m.trainingStart,'2026-11-01');assert.ok(m.postTrainingTrend);
 assert.ok(Math.abs(m.weightTrendKgPer30-m.postTrainingTrend.slopePerDay*30)<1e-9);
 const html=vTaperView88(st,{today:'2026-11-17'});
 assert.match(html,/kg\/Woche/);assert.match(html,/kg\/30 Tage/);
 assert.doesNotMatch(html,/Historischer Trend vor Trainingsbeginn/);
 assert.match(html,/seit Beginn des aktuellen Trainingsprogramms/);
});
test('With 45+ post-training days, changing PRE-training points cannot change the forecast',()=>{
 const recent=measurements('2026-09-01',13,5,86),base={strengthGuidedSessions:[guide('2026-09-01')]};
 const a=vTaperModel88({...base,healthImports:{fitdays:[{day:'2026-07-01',weightKg:70},...recent]}},{today:'2026-11-02'});
 const b=vTaperModel88({...base,healthImports:{fitdays:[{day:'2026-07-01',weightKg:140},...recent]}},{today:'2026-11-02'});
 assert.equal(a.sufficient,true);assert.equal(b.sufficient,true);assert.deepEqual(a.forecast,b.forecast);
 assert.ok(a.forecast.every(x=>x.weightRangeKg[0]<=x.weightRangeKg[1]));
 assert.doesNotMatch(vTaperChart88({...base,healthImports:{fitdays:recent}},a),/NaN|Infinity/);
});
test('No multi-year linear extrapolation and stale Fitdays values suppress scenarios',()=>{
 const recent=measurements('2026-09-01',13,5,86),base={strengthGuidedSessions:[guide('2026-09-01')],healthImports:{fitdays:recent}};
 const long=vTaperModel88(base,{today:'2026-11-02',horizonMonths:24});
 assert.equal(long.forecast?.length,3);assert.ok(long.forecast.every(x=>x.weightRangeKg[0]>50));
 const stale=vTaperModel88(base,{today:'2026-12-03',horizonMonths:24});
 assert.equal(stale.forecast,null);
});
