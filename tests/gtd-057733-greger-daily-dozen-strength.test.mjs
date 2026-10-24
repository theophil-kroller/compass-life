import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DAILY_DOZEN,dailyDozenSummary,dailyDozenView,setDailyDozen,mergeDailyDozen,shiftDailyDozenDate} from '../client/src/daily-dozen-v57733.js';
import {fatTrafficDashboard} from '../client/src/nutrition-guidance-v57733.js';
import {EXERCISES,STRONGLIFTS_5X5,manualExerciseMuscles,strengthSetRow} from '../client/src/strength-editor-v57732.js';
import {nutritionStrength733Bridge} from '../client/nutrition-strength733-bridge.js';
import {strengthNutrition732Bridge} from '../client/strength-nutrition732-bridge.js';
const day='2026-10-24';
const example={today:day,rows:[{day,entries:2,values:{ala:1.4,omega6:7.1,saturated:5,mono:12,poly:9,cholesterol:42,trans:null,epa:null,dha:null},coverage:{ala:{known:1,missing:1},omega6:{known:1,missing:1},saturated:{known:2,missing:0,estimated:1},mono:{known:1,missing:1},poly:{known:1,missing:1},cholesterol:{known:1,missing:1},epa:{known:0,missing:2},dha:{known:0,missing:2},trans:{known:0,missing:2}}}]};
test('Daily Dozen tracks precisely 12 categories with 24 serving ticks',()=>{
 assert.equal(DAILY_DOZEN.length,12);assert.equal(DAILY_DOZEN.reduce((s,x)=>s+x.target,0),24);
 assert.equal(new Set(DAILY_DOZEN.map(x=>x.id)).size,12);
});
test('untracked foods are not assumed to fulfil the Daily Dozen',()=>{
 const model=dailyDozenSummary({nutritionJournal:{entries:[{foodId:'peanuts'}]}},day);
 assert.equal(model.completed,0);assert.equal(model.total,24);
 assert.match(dailyDozenView({}, {day,today:day}),/0 \/ 24/);
});
test('steps clamp; reject unknown categories and invalid dates',()=>{
 const st={};for(let i=0;i<5;i++)setDailyDozen(st,day,'berries',1);
 assert.equal(dailyDozenSummary(st,day).rows.find(x=>x.id==='berries').count,1);
 setDailyDozen(st,day,'berries',-1);assert.equal(dailyDozenSummary(st,day).completed,0);
 assert.throws(()=>setDailyDozen(st,day,'wrong',1));assert.throws(()=>setDailyDozen(st,'invalid','berries',1));
});
test('different device edits merge per category, not whole day',()=>{
 const a={};const b={};setDailyDozen(a,day,'beans',1);setDailyDozen(b,day,'flax',1);
 const combined=mergeDailyDozen(a.nutritionJournal.dailyDozen,b.nutritionJournal.dailyDozen);
 assert.equal(combined[day].beans.count,1);assert.equal(combined[day].flax.count,1);
});
test('later explicit deletion of completed portion survives a prior older copy',()=>{
 const a={[day]:{nuts:{count:1,updatedAt:'2026-10-24T08:00:00Z'}}};
 const b={[day]:{nuts:{count:0,updatedAt:'2026-10-24T09:00:00Z'}}};
 assert.equal(mergeDailyDozen(a,b)[day].nuts.count,0);
 assert.equal(mergeDailyDozen(b,a)[day].nuts.count,0);
});
test('local calendar date stepping, including previous month',()=>{
 assert.equal(shiftDailyDozenDate('2026-11-01',-1),'2026-10-31');
});
test('fat dashboard: unknown EPA/DHA not zero; omega ratio descriptive, not red',()=>{
 const html=fatTrafficDashboard(example,{today:day});
 assert.match(html,/5,1 : 1/);assert.match(html,/Nicht bestimmbar/);
 assert.match(html,/tone-amber/);assert.match(html,/250 mg/);
 assert.doesNotMatch(html,/ideales Verhältnis.*[0-9]/i);
});
test('fat dashboard: only measured or known EPA + DHA earns full progress',()=>{
 const m=structuredClone(example);m.rows[0].values.epa=200;m.rows[0].values.dha=80;
 m.rows[0].coverage.epa={known:2,missing:0};m.rows[0].coverage.dha={known:2,missing:0};
 const html=fatTrafficDashboard(m,{today:day});assert.match(html,/280 \/ 250 mg/);
});
test('empty fat diary is not green or implicitly zero',()=>{
 const h=fatTrafficDashboard({today:day,rows:[]},{today:day});assert.match(h,/noch keine protokollierte Mahlzeit/i);assert.match(h,/Nicht bestimmbar/);
});
test('StrongLifts 5x5 A/B include all 5 base exercises',()=>{
 const ids=new Set([...STRONGLIFTS_5X5.A,...STRONGLIFTS_5X5.B].map(x=>x.exerciseId));
 for(const id of ['squat','bench','barbell-row','military-press','deadlift'])assert.ok(ids.has(id));
 assert.equal(STRONGLIFTS_5X5.A[0].sets,5);assert.equal(STRONGLIFTS_5X5.B.at(-1).sets,1);
});
test('custom curl-to-press, hammer-to-press, triceps curl and classic curls visible',()=>{
 const ids=new Set(EXERCISES.map(x=>x.id));
 for(const id of ['curl-to-press','hammer-to-press','military-press','triceps-curl','biceps-curl','hammer-curl'])assert.ok(ids.has(id));
 assert.equal(EXERCISES.length,new Set(EXERCISES.map(x=>x.id)).size);
 const hammer=manualExerciseMuscles('hammer-to-press');assert.equal(hammer.known,true);assert.ok(hammer.secondary.includes('biceps'));assert.equal(hammer.primary,'shoulders');
 assert.match(strengthSetRow(0,{exerciseId:'hammer-to-press'}),/Hammer Curl to Press/);
});
test('new bridge patches fat module after .32 transformation',()=>{
 const root=process.cwd();const raw=fs.readFileSync(root+'/client/src/nutrition-fat-quality-v57731.js','utf8');
 const previous=strengthNutrition732Bridge().transform(raw,'/source/client/src/nutrition-fat-quality-v57731.js').code;
 const out=nutritionStrength733Bridge().transform(previous,'/source/client/src/nutrition-fat-quality-v57731.js').code;
 assert.match(out,/fatTrafficDashboard\(model,\{today\}\)/);
 assert.match(out,/import \{fatTrafficDashboard\}/);
});
test('new bridge guards mismatched source versions and raw content',()=>{
 const bridge=nutritionStrength733Bridge();
 assert.throws(()=>bridge.transform('invalid','/source/client/src/main.js'),/Integrationsanker/);
 assert.throws(()=>bridge.transform('invalid','/source/client/src/personal-journal-v5692.js'),/Integrationsanker/);
});
test('new bridge inserts version, subtab, events, localized redraw and journal sync in precise anchors',()=>{
 const raw=["const COMPASS_CLIENT_VERSION='0.5.77.32';","import './strength-editor-v57732.css';", "let nutritionFatDays731='30',nutritionFatMetric731='saturated',strengthEditId732='';",'🥑 Fettqualität</button></nav>',"nutritionView712==='fats'?nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()}):nutritionHistoryView", "['journal','nutrients','timing','trends','connections','fats'].includes(id)",'function render(){\n // Mobile modal must remain mounted while open:',' // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.'].join('\n');
 const out=nutritionStrength733Bridge().transform(raw,'/source/client/src/main.js').code;
 for(const s of ['0.5.77.33','dailyDozenView','dd733-step','refreshDailyDozen733','dd733-day','daily-dozen'])assert.ok(out.includes(s));
});
