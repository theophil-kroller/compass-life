import test from 'node:test';
import assert from 'node:assert/strict';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
import {premiumStrengthSvg,premiumMuscleHighlight125,strengthPremiumMap} from '../client/src/strength-premium-v57738.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {nutritionDay,nutritionParts} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {HOFER_PRETZEL_BUTTER_ID,parseHoferPretzelButterPortion,hoferPretzelButterKcal} from '../client/src/hofer-pretzel-butter-serving-v059139.js';
const TODAY='2026-11-12';
const food=nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}}).find(f=>f.id===HOFER_PRETZEL_BUTTER_ID);
const state=amount=>({nutritionJournal:{customFoods:[],entries:[{id:'snack-1',foodId:HOFER_PRETZEL_BUTTER_ID,at:'2026-11-12T12:15:00',amount,deleted:false}]}});
const near=(actual,expected,delta=.05)=>assert.ok(Math.abs(actual-expected)<=delta,`${actual} ≠ ${expected}`);
const infoFor=model=>{
 const svg=premiumStrengthSvg(model,'back','roles',{rides:0},'strength');
 const raw=svg.match(/data-anatomy-info="([^"]+)"/)?.[1];
 assert.ok(raw);
 return JSON.parse(raw.replaceAll('&quot;','"').replaceAll('&amp;','&'));
};

test('A guided workout spanning midnight contributes confirmed sets to both local dates',()=>{
 const session={id:'night-1',source:'compass-guided-v5920',startedAt:'2026-11-11T23:44:00+01:00',finishedAt:'2026-11-12T00:14:00+01:00',completed:true,exercises:[
  {exerciseId:'reverse-fly',confirmedSets:[{confirmed:true,setNumber:1,reps:12,weightKg:7,completedAt:'2026-11-11T23:54:00+01:00',completedDay:'2026-11-11'}]},
  {exerciseId:'biceps-curl',confirmedSets:[{confirmed:true,setNumber:1,reps:10,weightKg:7,completedAt:'2026-11-12T00:07:00+01:00',completedDay:'2026-11-12'}]}
 ]};
 const saved=structuredClone(session);
 const model=strengthPeriod({strengthGuidedSessions:[session]},{today:TODAY,range:'7'});
 assert.deepEqual(model.sessions.map(s=>s.day).sort(),['2026-11-11','2026-11-12']);
 assert.equal(model.coachSources.coachSets,2);
 const info=infoFor(model);
 assert.ok(info.yesterdayRegions.includes('deltoid_rear'));
 assert.ok(info.todayRegions.includes('biceps'));
 assert.equal(premiumMuscleHighlight125(info,'deltoid_rear').fill,'#a63e53');
 assert.equal(premiumMuscleHighlight125(info,'biceps').fill,'#ed4b42');
 assert.deepEqual(session,saved,'Rendering must not mutate workout timestamps');
});

test('Today beats yesterday when the same muscle is trained on both days',()=>{
 const model={today:TODAY,sessions:[
  {day:'2026-11-11',sets:[{exerciseId:'biceps-curl',reps:10}]},
  {day:TODAY,sets:[{exerciseId:'biceps-curl',reps:12}]}
 ]};
 const info=infoFor(model);
 assert.ok(info.yesterdayRegions.includes('biceps'));
 assert.ok(info.todayRegions.includes('biceps'));
 assert.equal(premiumMuscleHighlight125(info,'biceps').fill,'#ed4b42');
 const html=strengthPremiumMap(model,{rides:0,regions:{primary:[],secondary:[]}},'strength');
 assert.match(html,/Gestern trainiert/);
 assert.match(html,/Vor 2–7 Tagen trainiert/);
});

test('Previous 2–7 days remain orange while older than 7 days are not highlighted',()=>{
 const info=infoFor({today:TODAY,sessions:[
  {day:'2026-11-10',sets:[{exerciseId:'reverse-fly',reps:10}]},
  {day:'2026-10-28',sets:[{exerciseId:'biceps-curl',reps:10}]}
 ]});
 assert.equal(premiumMuscleHighlight125(info,'deltoid_rear').fill,'#ee963a');
 assert.equal(premiumMuscleHighlight125(info,'biceps'),null);
});

test('HOFER pretzel with butter is an editable snack with source-aware ingredient macros',()=>{
 assert.ok(food);
 assert.equal(food.group,'Snacks');
 assert.equal(food.kcalLow,372);
 const parts=nutritionParts(HOFER_PRETZEL_BUTTER_ID,food.defaultAmount,food);
 assert.deepEqual(parts.map(p=>p.part),['Laugenbreze','Butter']);
 near(parts[0].amount,95);near(parts[1].amount,10);
 assert.match(parts[0].source,/unbestätigt/);
 assert.equal(parts[0].values.vitaminB12,undefined);
 assert.equal(parts[0].values.fiber,undefined);
 const totals=nutritionDay(state(food.defaultAmount),TODAY).totals;
 near(totals.kcal,372.3);near(totals.protein,8.145);near(totals.carbs,53.925);
 near(totals.fat,13.14);near(totals.salt,1.6645);
 assert.equal(nutritionKcalEstimate(food,food.defaultAmount).low,372);
});

test('HOFER pretzel portion and butter can be changed independently, with zero butter',()=>{
 for(const [amount,pretzel,butter,kcal] of [
  ['1 Breze (110 g) + Butter (15 g)',110,15,456],
  ['2 Brezen + Butter (20 g)',190,20,745],
  ['1 Breze ohne Butter',95,0,298],
  ['95 g Breze + 5 g Butter',95,5,335]
 ]){
  const serving=parseHoferPretzelButterPortion(amount);
  assert.deepEqual(serving,{pretzelGrams:pretzel,butterGrams:butter});
  assert.equal(hoferPretzelButterKcal(serving),kcal);
  assert.equal(nutritionKcalEstimate(food,amount).low,kcal);
 }
 for(const a of ['0 Brezen','-2 Brezen','1 Breze + Butter (-15 g)','gar keine Ahnung']){
  assert.equal(parseHoferPretzelButterPortion(a),null,`Invalid: ${a}`);
 }
});

test('Pretzel never earns unsupported wholegrain or anti-aging credit; actual protein is logged',()=>{
 const s=state(food.defaultAmount);
 assert.equal(dailyDozenSummary(s,TODAY).rows.find(x=>x.id==='wholegrains').count,0);
 assert.equal(dailyDozen5930(s,{day:TODAY}).rows.find(x=>x.id==='wholegrains').observed,0);
 const aa=antiAgingEightModel(s,TODAY);
 assert.equal(aa.rows.find(x=>x.id==='nuts').status,'unknown');
 assert.match(aa.rows.find(x=>x.id==='protein').value,/8[.,]1/);
});
