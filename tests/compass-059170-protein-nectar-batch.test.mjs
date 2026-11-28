import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {foodPortion148} from '../client/src/food-additions-v059148.js';
import {foodSearch148,foodCategory148} from '../client/src/food-menu-v059148.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {NEW_FOODS_170,FOOD_INDEX_170,PROFILES_170,foodPortion170} from '../client/src/food-proteins-nectar-v059170.js';
const ids=NEW_FOODS_170.map(i=>i.id),food=id=>nutritionFoods({}).find(x=>x.id===id);
const entry=(id,amount)=>({id:'check-170',foodId:id,amount,at:'2026-11-28T12:00:00'});
const near=(a,b,e=.02)=>assert.ok(Math.abs(a-b)<e,`${a} not close to ${b}`);
const nutrient=(id,amount='1 Portion')=>nutrientEntry(food(id),entry(id,amount));
const progress=(id,amount)=>dailyDozenIngredientEvidence404({nutritionJournal:{entries:[entry(id,amount)],customFoods:[]}},'2026-11-28');
test('four branded products in actual food catalog with unique IDs and profile integration',()=>{
 assert.equal(ids.length,4);assert.equal(new Set(ids).size,4);
 for(const id of ids){assert.equal(nutritionFoods({}).filter(x=>x.id===id).length,1);assert.ok(PRODUCT_PROFILES[id]);assert.ok(PROFILES_170[id]);}
 assert.ok(food('raab-bio-rice-protein-neutral-20g-20261128')); // previous release unaffected
});
test('Tropical treasure original label: macronutrients plus manufacturer magnesium and vitamin C',()=>{
 const id=ids[0],n=nutrient(id);
 for(const [k,v] of Object.entries({kcal:71.8,protein:8.6,carbs:5.2,sugar:3.4,fat:1.52,saturated:.7,fiber:1.64,salt:.088,magnesium:73.6,vitaminC:193.6}))near(n.values[k],v);
 assert.ok(!n.estimatedKeys.has('magnesium'));assert.ok(!n.estimatedKeys.has('vitaminC'));
 assert.equal(foodCategory148(food(id)),'sport');
});
test('Raab Bio Soja Kakao contains 14.4g protein per 20g, not mixed with milk',()=>{
 const n=nutrient(ids[1]);
 for(const [k,v] of Object.entries({kcal:71.2,protein:14.4,carbs:2.4,sugar:2,fat:.22,saturated:.14,fiber:1.02,salt:.094}))near(n.values[k],v);
 assert.equal(foodCategory148(food(ids[1])),'sport');
});
test('Raab Bio Soja Vanille 20g retains labelled macros and explicitly estimated trace saturated fat',()=>{
 const n=nutrient(ids[2]);
 for(const [k,v] of Object.entries({kcal:74.8,protein:14.4,carbs:3.4,sugar:2.6,fat:.26,fiber:.58,salt:.02}))near(n.values[k],v);
 assert.ok(n.estimatedKeys.has('saturated'));assert.equal(FOOD_INDEX_170[ids[2]].upperBounds.saturated,.1);
});
test('Voelkel original nectar 200ml, 500ml and 100ml scale; added-sugar content retained',()=>{
 const id=ids[3],n=nutrient(id,'200 ml');
 for(const [k,v] of Object.entries({kcal:136,carbs:30.4,sugar:30.2}))near(n.values[k],v);
 near(foodPortion148(id,'1 Glas').grams,200);near(foodPortion148(id,'1 Flasche').grams,500);near(foodPortion148(id,'100 ml').grams,100);
 near(nutrient(id,'1 Flasche').values.kcal,340);near(nutrient(id,'1 Flasche').values.sugar,75.5);
 assert.ok(n.estimatedKeys.has('fat'));assert.ok(n.estimatedKeys.has('protein'));
 assert.equal(foodCategory148(food(id)),'drinks');
});
test('quantities can be scaled by grams, ml, half-portion, and labeled cups; bad inputs rejected',()=>{
 for(const id of ids){near(foodPortion148(id,'10 g').grams,10);near(foodPortion148(id,'½ Portion').grams,FOOD_INDEX_170[id].grams/2);near(foodPortion170(id,'1 Portion').grams,FOOD_INDEX_170[id].grams);
  for(const bad of ['-1 Portion','0 Portion','unbekannt','5001 g'])assert.equal(foodPortion170(id,bad),null);
 }
 assert.equal(foodPortion170(ids[3],'2 EL'),null);
});
test('Daily Dozen / Anti-Aging do not claim full serving from isolates, powdered seeds or sweetened nectar',()=>{
 for(const id of ids){const p=progress(id,'1 Portion');for(const k of ['beans','nuts','berries','fruit','wholegrains','beverages','spices'])near(p.totals[k],0);}
 assert.ok(progress(ids[0],'20 g').notes.nuts.some(x=>x.includes('entöltes')));
 assert.ok(progress(ids[3],'200 ml').notes.beverages.some(x=>x.includes('Nektar')));
});
test('all four products findable through branded search and source provenance',()=>{
 for(const id of ids){assert.ok(foodSearch148(food(id)).includes(id.split('-')[0]));assert.ok(PROFILES_170[id].source.includes('Originaletikett'));}
 assert.ok(foodSearch148(food(ids[3])).includes('maracuja'));
});
