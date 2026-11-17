import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry,PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {foodCategory148,foodTags148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {foodPortion148} from '../client/src/food-additions-v059148.js';
import {nutritionCoachAnalyze52,nutritionCoachDashboard52,nutritionFoodGroup54} from '../client/src/nutrition-coach-v059152.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {readFileSync} from 'node:fs';
const state=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const products=nutritionFoods(state());
const get=id=>products.find(x=>x.id===id);
const close=(actual,expected)=>assert.ok(Math.abs(actual-expected)<.06,`${actual} !== ${expected}`);
const cups=[
 ['dr-oetker-high-protein-milchreis-zimt-400g',400,368,30.4,48,18,6,4,.88],
 ['billa-high-protein-griesspudding-zimt-500g',500,395,38,43,23.5,7.5,5,.65],
 ['noem-pro20-topfencreme-blueberry-cheesecake-235g',235,122.2,19.74,9.4,7.755,.5875,.235,.235],
];
test('new cups are additive, unique, in dairy protein menu, and have full-cup defaults',()=>{
 assert.equal(products.length,new Set(products.map(f=>f.id)).size);
 for(const [id,g,kcal] of cups){
  const f=get(id);assert.ok(f,id);assert.equal(f.defaultAmount,`1 Becher (${g} g)`);
  assert.equal(foodCategory148(f),'dairy');assert.ok(foodTags148(f).includes('protein'));
  assert.equal(nutritionFoodGroup54(f),'dairy');assert.ok(foodSearch148(f).includes(id.split('-')[0]));
  assert.equal(nutritionKcalEstimate(f,'1 Becher').low,Math.round(kcal));
  assert.equal(foodPortion148(id,'0,5 Becher').grams,g/2);
  assert.equal(foodPortion148(id,'2 Becher').grams,g*2);
  assert.equal(foodPortion148(id,'150 g').grams,150);
 }
});
test('macros exactly follow photographed nutrition labels; minerals are estimates',()=>{
 for(const [id,g,kcal,protein,carbs,sugar,fat,saturated,salt] of cups){
  const v=nutrientEntry(get(id),{id:'e',foodId:id,amount:'1 Becher',at:'2026-11-17T10:00:00'}).values;
  close(v.kcal,kcal);close(v.protein,protein);close(v.carbs,carbs);close(v.sugar,sugar);
  close(v.fat,fat);
  close(v.saturated,saturated);close(v.salt,salt);
  assert.ok(v.calcium>0);assert.ok(v.vitaminB12>0);
  const profile=PRODUCT_PROFILES[id];assert.ok(profile.estimatedNutrients.includes('calcium'));
  assert.ok(!profile.estimatedNutrients.includes('protein'));
 }
});
test('flavoured dairy products do not create fruit, berries, or wholegrain Daily Dozen ticks',()=>{
 for(const [id] of cups){
  const s=state();s.nutritionJournal.entries=[{id:'e',foodId:id,amount:'1 Becher',at:'2026-11-17T12:00:00'}];
  const d=dailyDozen5930(s,{day:'2026-11-17'});
  for(const category of ['berries','fruits','wholegrains'])assert.equal(d.rows.find(r=>r.id===category).observed,0,`${id} ${category}`);
 }
});
function entriesState(){const s=state();s.nutritionJournal.entries=Array.from({length:6},(_,i)=>({id:'p'+i,foodId:cups[i%3][0],amount:'1 Becher',at:`2026-11-${String(10+i).padStart(2,'0')}T12:00:00` }));return s;}
test('nutrition care report is generated only on deliberate analyze, offers substantive actions and monitoring',()=>{
 const s=entriesState(),before=JSON.stringify(s);
 const html=nutritionCoachDashboard52(s,{days:14,anchor:'2026-11-17',today:'2026-11-17'});
 assert.match(html,/Meine Ernährung analysieren/);assert.doesNotMatch(html,/ni155-report-body/);
 const report=nutritionCoachAnalyze52(s,{days:14,anchor:'2026-11-17',today:'2026-11-17'});
 assert.ok(report.care);assert.equal(report.care.assessment.length,4);
 assert.ok(report.care.priorities.length>0);assert.equal(report.care.monitoring.length,report.care.priorities.length);
 const after=nutritionCoachDashboard52(s,{days:14,anchor:'2026-11-17',today:'2026-11-17',report});
 assert.match(after,/Ernährungsassessment/);assert.match(after,/Maßnahmen & Erfolgskontrolle/);
 assert.match(after,/Dein persönlicher Ernährungsreport/);assert.match(after,/Methodik & Referenzen/);
 assert.equal(JSON.stringify(s),before);
});
test('new nutrition report has no eager Today import and is linked by lazy nutrition coach',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.doesNotMatch(main,/^import .*nutrition-care-report-v059155/m);
 assert.match(main,/import\('\.\/nutrition-coach-v059152\.js'\)/);
});
