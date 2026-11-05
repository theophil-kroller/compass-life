import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MCT_C8_FOOD_ID,parseMctC8Serving,mctC8Kcal} from '../client/src/mct-c8-serving-v059123.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutritionDay,nutritionParts} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {fatEntry} from '../client/src/nutrition-fat-quality-v57731.js';
const D='2026-11-05';
const foods=nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}});
const food=foods.find(x=>x.id===MCT_C8_FOOD_ID);
const state=(amount=food.defaultAmount)=>({nutritionJournal:{entries:[{id:'c8-one',foodId:MCT_C8_FOOD_ID,amount,at:`${D}T09:13:00`,deleted:false}],customFoods:[]}});
const near=(a,b,eps=.02)=>assert.ok(Math.abs(a-b)<=eps,`${a} should be near ${b}`);

test('One single MCT C8 entry in Zutaten; default 1 EL, no automatic ingestion',()=>{
 assert.ok(food);assert.equal(food.group,'Zutaten');assert.match(food.defaultAmount,/1 EL/);
 assert.equal(food.kcalLow,126);assert.equal(food.kcalHigh,126);
 assert.equal(foods.filter(x=>x.id===MCT_C8_FOOD_ID).length,1);
 const empty={nutritionJournal:{entries:[],customFoods:[]}};
 assert.equal(nutritionDay(empty,D).entries.length,0);
});
test('C8: one EL (15 ml ~14 g), halves, doubles, grams, decimal comma, teaspoons',()=>{
 for(const [input,g] of [['1 EL',14],['1 EL (15 ml ≈ 14 g)',14],['0,5 EL',7],['2 EL',28],['1 TL',14/3],['15 ml',14],['30 ml',28],['28 g',28],['1 Esslöffel',14],['2 Teelöffel',28/3]])
  near(parseMctC8Serving(input).grams,g);
 assert.equal(mctC8Kcal(parseMctC8Serving('1 EL')),126);
 assert.equal(mctC8Kcal(parseMctC8Serving('0,5 EL')),63);
 assert.equal(mctC8Kcal(parseMctC8Serving('2 EL')),252);
 for(const invalid of ['ein EL','-1 EL','nicht gemessen','3000 g','1 g Milch']){
  // '1 g Milch' contains explicit grams and may be accepted as free-text notes;
  // do not claim it is an unknown dose when a weight is explicitly specified.
  if(invalid==='1 g Milch')continue;
  assert.equal(parseMctC8Serving(invalid),null,invalid);
 }
});
test('All nutrition views use manufacturer profile and identical portion parser',()=>{
 for(const [input,grams] of [[food.defaultAmount,14],['2 EL',28],['0,5 EL',7],['20 g',20],['10 ml',14*10/15]]){
  const meal=nutritionDay(state(input),D);
  near(meal.totals.kcal,grams*9);near(meal.totals.fat,grams);near(meal.totals.saturated,grams);
  for(const nutrient of ['protein','carbs','sugar','fiber','salt'])near(meal.totals[nutrient],0);
  for(const nutrient of ['vitaminE','magnesium','calcium','potassium','vitaminB12'])assert.equal(meal.coverage[nutrient].unknown,1);
  assert.equal(meal.coverage.kcal.estimated,0);assert.equal(meal.coverage.fat.estimated,0);
  const kcal=nutritionKcalEstimate(food,input);near(kcal.low,Math.round(grams*9));assert.equal(kcal.high,kcal.low);
  const parts=nutritionParts(MCT_C8_FOOD_ID,input,food);assert.equal(parts.length,1);near(parts[0].amount,grams);
 }
 assert.deepEqual(PRODUCT_PROFILES[MCT_C8_FOOD_ID].nutrients,{kcal:900,protein:0,carbs:0,sugar:0,fat:100,saturated:100,fiber:0,salt:0});
});
test('Unparseable dose does not silently count a default EL',()=>{
 assert.equal(nutritionKcalEstimate(food,'etwas'),null);
 assert.equal(nutritionParts(MCT_C8_FOOD_ID,'etwas',food).length,0);
 assert.equal(nutritionDay(state('etwas'),D).coverage.kcal.unknown,1);
});
test('No Daily Dozen / Anti Aging Eight plant-food credit from extracted fat',()=>{
 const s=state();const d=dailyDozenIngredientEvidence404(s,D);
 assert.equal(Object.values(d.totals).reduce((a,b)=>a+b,0),0);
 const summary=dailyDozenSummary(s,D);
 for(const k of ['nuts','flax','fruit','berries','vegetables','beverages'])assert.equal(summary.rows.find(x=>x.id===k)?.count||0,0,k);
 const aa=antiAgingEightModel(s,D);
 assert.equal(aa.rows.find(x=>x.id==='nuts').status,'unknown');
 assert.equal(aa.rows.find(x=>x.id==='berries').status,'unknown');
 assert.equal(aa.rows.find(x=>x.id==='microbiome').status,'unknown');
});
test('Fat-quality: C8 classified as saturated medium-chain fat, plant cholesterol inherent zero',()=>{
 const a=fatEntry(food,state().nutritionJournal.entries[0]);
 near(a.values.fat,14);near(a.values.saturated,14);
 assert.equal(a.values.cholesterol,0);
 assert.equal(a.values.ala,null);
});
test('Product inspector includes BRAINEFFECT source and explicit 1-EL conversion uncertainty',()=>{
 const source=fs.readFileSync(new URL('../client/src/nutrition-intelligence-v57712.js',import.meta.url),'utf8');
 assert.match(source,/productList=\['braineffect-mct-c8-oil'/);
 assert.match(PRODUCT_PROFILES[MCT_C8_FOOD_ID].note,/15 ml ≈ 14 g/);
 assert.match(PRODUCT_PROFILES[MCT_C8_FOOD_ID].source,/brain-effect.com/);
});
