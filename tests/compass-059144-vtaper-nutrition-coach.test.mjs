import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {vtaperNutritionModel144,vtaperNutritionHtml144,vtaperWeightTrend144} from '../client/src/vtaper-nutrition-coach-v059144.js';
import {vtaperOverviewHtml141,vtaperOverviewModel141} from '../client/src/vtaper-overview-v059141.js';
const today='2026-11-12';
const shift=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
function sample({extraHungryDay=false,missingProtein=false}={}){
 const foods=[{id:'full-meal',title:'Vollständiges vegetarisches Tagesrezept',defaultAmount:'1 Portion',nutrientBasis:'perPortion',nutrients:{kcal:2100,protein:152,carbs:220,fat:65},source:'eigene Einträge'}];
 const entries=Array.from({length:14},(_,i)=>({id:`food${i}`,foodId:'full-meal',at:shift(today,i-13)+'T12:00:00.000Z',amount:'1 Portion'}));
 if(extraHungryDay){entries.push({id:'hunger',foodId:'extra',at:shift(today,-5)+'T15:00:00.000Z',amount:'1 Portion'});foods.push({id:'extra',title:'Zusätzliche Mahlzeit',defaultAmount:'1 Portion',nutrientBasis:'perPortion',nutrients:{kcal:650,protein:12},source:'eigene Schätzung'});}
 if(missingProtein){foods[0].nutrients={kcal:2100};}
 const fitdays=Array.from({length:16},(_,i)=>({day:shift(today,i-15),at:shift(today,i-15)+'T07:00:00Z',weightKg:86.5-i*.03,bodyFatPct:23.6}));
 return {nutritionJournal:{entries,customFoods:foods,energyGoal:{enabled:true,birthYear:1983,birthMonth:5,heightCm:185,formulaSex:'male',method:'mifflin',activity:'moderate',deficit:300}},healthImports:{fitdays},strengthCycle:{activeBlockId:'block01',blocks:[{id:'block01',startDay:'2026-10-24',status:'active'}]}};
}
test('7, 14 and active six-week ranges are derived read-only from tracked meals',()=>{
 const st=sample(),initial=structuredClone(st),m=vtaperNutritionModel144(st,{today});
 assert.equal(m.windows[7].tracked,7);assert.equal(m.windows[14].tracked,14);
 assert.equal(m.windows[42].start,'2026-10-24');assert.equal(m.windows[42].blockAligned,true);
 assert.equal(m.windows[14].avgKcal,2100);assert.equal(m.windows[14].avgProtein,152);
 assert.ok(m.energyReady);assert.ok(m.windows[14].avgDeficit>0);
 assert.equal(m.source,'encrypted-journal-readonly');assert.deepEqual(st,initial);
 const html=vtaperNutritionHtml144(m);assert.match(html,/Unterstützt deine Ernährung den V-Taper/);
 assert.match(html,/7 Tage/);assert.match(html,/14 Tage/);assert.match(html,/6-Wochen-Block/);
 assert.match(html,/kcal\/Tag/);assert.match(html,/Ein einzelner Tag/);assert.doesNotMatch(html,/schlecht gegessen/i);
});
test('one unusually high-calorie day remains a normal recorded day, no negative instant judgement or compensation',()=>{
 const st=sample({extraHungryDay:true}),m=vtaperNutritionModel144(st,{today});
 assert.ok(m.windows[14].avgKcal>2100);
 assert.equal(m.windows[14].tracked,14);
 assert.match(m.advice,/Behalte deine Routine bei/);
 assert.doesNotMatch(m.advice,/auslassen|kompensieren|Strafe|zusätzliche Kalorien abtrainieren/i);
});
test('missing protein values do not become zero and estimated calories still count',()=>{
 const st=sample({missingProtein:true}),m=vtaperNutritionModel144(st,{today});
 assert.equal(m.windows[14].avgKcal,2100);
 assert.equal(m.windows[14].avgProtein,null);
 assert.equal(m.windows[14].proteinDays,0);assert.equal(m.food,null);
 assert.doesNotMatch(m.advice,/Proteindurchschnitt liegt unter/);
});
test('confirmed low protein across seven days triggers existing-catalog food suggestion, not new diary entry',()=>{
 const st=sample();st.nutritionJournal.customFoods[0].nutrients.protein=90;
 const m=vtaperNutritionModel144(st,{today});
 assert.ok(m.food);assert.ok(m.food.protein>=10);assert.ok(m.food.kcal>0);
 assert.match(m.advice,/Protein/);assert.match(vtaperNutritionHtml144(m),/keine automatische Buchung/);
});
test('energy expenditure is not invented if personal energy model cannot be built',()=>{
 const st=sample();st.nutritionJournal.energyGoal={};st.healthImports.fitdays=[];
 const m=vtaperNutritionModel144(st,{today});assert.equal(m.energyReady,false);
 assert.equal(m.windows[14].avgDeficit,null);assert.match(vtaperNutritionHtml144(m),/Verbrauch noch nicht berechenbar/);
});
test('median weight slope uses repeated daily readings, not a single weigh-in',()=>{
 assert.equal(vtaperWeightTrend144([{day:'2026-11-11',value:86,at:0}],14),null);
 const rows=Array.from({length:14},(_,i)=>({day:shift(today,i-13),value:87-i*.05,at:0}));
 const trend=vtaperWeightTrend144(rows,14);assert.ok(trend.kgPerWeek<0);assert.ok(Math.abs(trend.kgPerWeek+.35)<.01);
});
test('nutrition panel sits after body changes but before original dashboard footer and existing body insights',()=>{
 const st=sample(),model={latest:null,first:null,measures:[],weight:{last:null},fat:{last:null},trainingDays:0,sets:0,proteinDays:0,kcalDays:0};
 const html=vtaperOverviewHtml141(model,{nutrition:vtaperNutritionModel144(st,{today})});
 assert.ok(html.indexOf('vt141-lower')<html.indexOf('vt144-nutrition'));
 assert.ok(html.indexOf('vt144-nutrition')<html.indexOf('vt141-footer'));
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.ok(main.indexOf('vtaperNutritionModel144(state,{today,nutritionIndex:bodyNutritionIndex})')>0);
 assert.match(main,/vtaperOverviewHtml141\(vtaperOverviewModel141/);
});
