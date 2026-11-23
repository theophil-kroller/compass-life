import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {foodPortion148,RECIPE_EVIDENCE_148,HOMEMADE_148} from '../client/src/food-additions-v059148.js';
import {foodCategory148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {TAKEAWAY_NOODLE_BOX_ID_167 as id,TAKEAWAY_NOODLE_BOX_ASSUMPTIONS_167 as assumptions,TAKEAWAY_NOODLE_BOX_NUTRIENTS_167 as n,TAKEAWAY_NOODLE_BOX_FOOD_167 as food,noodleBoxPortion167} from '../client/src/takeaway-noodlebox-v059167.js';
const day='2026-11-23';
const near=(actual,expected,tol=.05)=>assert.ok(Math.abs(actual-expected)<=tol,`${actual} not near ${expected}`);
const st=amount=>({nutritionJournal:{entries:[{id:'noodle',foodId:id,amount,at:'2026-11-23T12:30:00'}],customFoods:[]}});
test('takeaway dish appears once in meals, searchable in established Compass food menu',()=>{
 const matches=nutritionFoods({}).filter(x=>x.id===id);
 assert.equal(matches.length,1);assert.equal(matches[0].group,'Mahlzeiten');assert.equal(foodCategory148(matches[0]),'meals');
 assert.match(foodSearch148(matches[0]),/nudelbox/);assert.match(foodSearch148(matches[0]),/curry/);
 assert.match(nutritionQuickView(st('1 Box')),/Nudelbox/i);assert.equal(HOMEMADE_148.has(id),true);
 assert.ok(PRODUCT_PROFILES[id]);assert.ok(RECIPE_EVIDENCE_148[id]);
});
test('one box is 550g with honest ingredients and no unconfirmed meat/tofu or vegan claim',()=>{
 assert.equal(assumptions.servingGrams,550);
 assert.deepEqual(assumptions.ingredients.map(x=>x.grams),[300,130,105,15]);
 assert.equal(assumptions.ingredients.every(x=>x.verified===false),true);
 assert.equal(assumptions.noMeatOrTofuModelled,true);assert.equal(assumptions.fishSauceCannotBeRuledOut,true);
 assert.equal(RECIPE_EVIDENCE_148[id].recipeIngredients.length,4);
 assert.match(food.recipeNote,/Fischsoße|Fischsauce/);assert.match(food.recipeNote,/nicht gewogen|nicht gewogen|weder gewogen/i);
 assert.doesNotMatch(food.title, /vegan|vegetarisch/i);
});
test('box, half-box, multiple boxes and grams scale within 0-5000g',()=>{
 for(const [amount,expected] of [['1 Box',550],['2 Boxen',1100],['½ Box',275],['halbe Nudelbox',275],['0,5 Box',275],['1 Portion',550],['100 g',100],['1 Box (ca. 550 g)',550]]){
  near(foodPortion148(id,amount).grams,expected,.001);
  near(noodleBoxPortion167(amount).grams,expected,.001);
 }
 for(const bad of ['0 Boxen','-1 Box','kein Essen','5001 g'])assert.equal(foodPortion148(id,bad),null,bad);
});
test('all macro and micro fields marked estimate and portional totals use central estimate',()=>{
 const measured=nutrientEntry(food,st('1 Box').nutritionJournal.entries[0]);
 for(const [k,v] of Object.entries(n)){
  near(measured.values[k],v,.02);assert.ok(measured.estimatedKeys.has(k),`not estimated: ${k}`);
 }
 assert.equal(measured.knownKeys.has('iodine'),false);
 near(n.kcal,741.5);near(n.protein,17.535);near(n.carbs,93.115);near(n.fat,33.635);
 near(nutritionKcalEstimate(food,'2 Boxen').low,1484,2);
});
test('Daily Dozen credits estimated 130g other vegetables only, not full grains, tofu or spices',()=>{
 const e=dailyDozenIngredientEvidence404(st('1 Box'),day);
 near(e.totals.vegetables,130/80);near(e.totals.wholegrains,0);
 for(const cat of ['beans','greens','cruciferous','nuts','spices','berries','fruit','beverages'])near(e.totals[cat],0);
 assert.match(e.notes.vegetables.join(' '),/ungewogene Imbiss-Schätzung/);
 const half=dailyDozenIngredientEvidence404(st('½ Box'),day);
 near(half.totals.vegetables,65/80);
 const dd=dailyDozen5930(st('1 Box'),{day});
 near(dd.rows.find(x=>x.id==='vegetables').observed,1.6,.1);
});
test('Anti-Aging Eight shows nutrition evidence, never fabricates measured outcomes',()=>{
 const aa=antiAgingEightModel(st('1 Box'),day);
 assert.equal(aa.rows.find(x=>x.id==='protein').status,'partial');
 assert.equal(aa.rows.find(x=>x.id==='microbiome').status,'partial');
 assert.equal(aa.rows.find(x=>x.id==='nuts').status,'unknown');
 assert.equal(aa.rows.find(x=>x.id==='nad').status,'unmeasurable');
});
test('catalog addition does not silently add today journal entry or migrate vault',()=>{
 assert.equal(nutritionFoods({}).filter(x=>x.id===id).length,1);
 assert.equal(({}.nutritionJournal?.entries||[]).length,0);
 assert.equal(assumptions.ingredients.some(x=>x.verified),false);
});
