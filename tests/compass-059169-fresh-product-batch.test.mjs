import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {foodPortion148} from '../client/src/food-additions-v059148.js';
import {foodCategory148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {FOODS_169,NEW_FOODS_169,PROFILES_169,foodPortion169} from '../client/src/food-package-collection-v059169.js';
const today='2026-11-28';
const ids=NEW_FOODS_169.map(x=>x.id),food=id=>nutritionFoods({}).find(x=>x.id===id);
const entry=(id,amount)=>({id:'check',foodId:id,amount,at:`${today}T12:00:00`});
const state=(id,amount)=>({nutritionJournal:{entries:[entry(id,amount)],customFoods:[]}});
const near=(a,b,epsilon=0.025)=>assert.ok(Math.abs(a-b)<epsilon,`${a} ≠ ${b}`);
test('all eight distinct photographed items are present once without mutating original catalog',()=>{
 assert.equal(ids.length,8);
 for(const id of ids){assert.equal(nutritionFoods({}).filter(x=>x.id===id).length,1);assert.ok(PRODUCT_PROFILES[id]);assert.ok(PROFILES_169[id]);}
 assert.ok(food('rapunzel-cranberries-apple-concentrate-100g-20261125'));
});
test('figs use the user weighing: one fig 10g; twenty figs 200g',()=>{
 const id=ids[0];assert.equal(food(id).defaultAmount,'1 Feige (10 g)');
 for(const [amount,mass] of [['1 Feige',10],['20 Feigen',200],['2 Stück',20],['½ Feige',5],['200 g',200]])near(foodPortion148(id,amount).grams,mass,0.001);
 assert.ok(nutrientEntry(food(id),entry(id,'1 Feige')).estimatedKeys.has('kcal'));
});
test('chia and amaranth macros and manufacturer minerals per default portion',()=>{
 const chia=nutrientEntry(food(ids[1]),entry(ids[1],'1 Portion'));
 for(const [k,v] of Object.entries({kcal:216,protein:7.5,carbs:14,sugar:10.5,fat:12,fiber:12}))near(chia.values[k],v);
 assert.ok(chia.estimatedKeys.has('calcium'));
 const amaranth=nutrientEntry(food(ids[2]),entry(ids[2],'1 Portion'));
 for(const [k,v] of Object.entries({kcal:191,protein:5.5,carbs:31.5,fat:3.95,fiber:3.65,magnesium:76,iron:1.85}))near(amaranth.values[k],v);
 assert.ok(!amaranth.estimatedKeys.has('magnesium'));
});
test('coconut drink 200 ml is 50 kcal and not water',()=>{
 const id=ids[3];near(foodPortion148(id,'200 ml').grams,200);
 const n=nutrientEntry(food(id),entry(id,'200 ml'));
 for(const [k,v] of Object.entries({kcal:50,protein:1.8,carbs:2.2,sugar:0.4,fat:3.6,saturated:3.2,fiber:.2,salt:.24}))near(n.values[k],v);
 assert.equal(foodCategory148(food(id)),'drinks');
 near(dailyDozenIngredientEvidence404(state(id,'200 ml'),today).totals.beverages,0);
});
test('dried Goji, barberries and Physalis retain package macros, fractional grams and berry credit',()=>{
 for(let i=4;i<=6;i++){
  const id=ids[i],spec=NEW_FOODS_169[i],n=nutrientEntry(food(id),entry(id,'1 Portion'));
  near(n.values.kcal,spec.labels.kcal*.30);
  near(n.values.fiber,spec.labels.fiber*.30);
  near(foodPortion148(id,'1 Packung').grams,100);
  near(dailyDozenIngredientEvidence404(state(id,'30 g'),today).totals.berries,.75);
 }
 assert.ok(nutrientEntry(food(ids[5]),entry(ids[5],'30 g')).estimatedKeys.has('saturated'));
});
test('rice protein 20g contains 16g protein and cannot be counted as wholegrain rice',()=>{
 const id=ids[7],n=nutrientEntry(food(id),entry(id,'2 EL'));
 for(const [k,v] of Object.entries({kcal:77.2,protein:16,carbs:.24,fat:1.36}))near(n.values[k],v);
 assert.equal(foodCategory148(food(id)),'sport');assert.ok(n.estimatedKeys.has('sugar'));
 near(dailyDozenIngredientEvidence404(state(id,'2 EL'),today).totals.wholegrains,0);
});
test('no manufactured daily dozen portions for unknown chia, muesli berry or barista ingredients',()=>{
 for(const id of [ids[1],ids[2],ids[3]]){
  const summary=dailyDozenIngredientEvidence404(state(id,'1 Portion'),today);
  for(const k of ['berries','fruit','wholegrains','nuts','beans','spices'])near(summary.totals[k],0);
 }
});
test('food categories and search remain usable',()=>{
 assert.ok(foodSearch148(food(ids[0])).includes('nestelberg'));
 assert.equal(foodCategory148(food(ids[0])),'fruitnuts');
 assert.equal(foodCategory148(food(ids[2])),'meals');
 assert.equal(foodCategory148(food(ids[7])),'sport');
});
test('bad portion inputs are rejected instead of silently booking wrong quantities',()=>{
 for(const id of ids)for(const bad of ['-1 Portion','0 Portion','5001 g','unbekannt'])assert.equal(foodPortion169(id,bad),null);
});
