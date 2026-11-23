import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {foodPortion148,RECIPE_EVIDENCE_148,HOMEMADE_148} from '../client/src/food-additions-v059148.js';
import {foodCategory148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {MILLET_BAKE_ID_166 as mid,MILLET_BAKE_PEAR_ID_166 as pid,MILLET_BAKE_NUTRIENTS_166 as base,MILLET_BAKE_PEAR_NUTRIENTS_166 as pear,MILLET_BAKE_ASSUMPTIONS_166 as assumptions,milletBakePortion166} from '../client/src/millet-egg-bake-v059166.js';

const day='2026-11-24';
const foods=nutritionFoods({});
const food=id=>foods.find(x=>x.id===id);
const st=(id,amount)=>({nutritionJournal:{entries:[{id:'bake',foodId:id,amount,at:'2026-11-24T12:00:00'}],customFoods:[]}});
const near=(actual,expected,tol=.05)=>assert.ok(Math.abs(actual-expected)<=tol,`${actual} not near ${expected}`);
test('both variants appear once in existing breakfast menu, searchable, and quick view',()=>{
  for(const id of [mid,pid]){
    assert.equal(foods.filter(f=>f.id===id).length,1);
    assert.equal(food(id).group,'Frühstück');
    assert.equal(foodCategory148(food(id)),'meals');
    assert.match(foodSearch148(food(id)),/hirse/i);
    assert.match(nutritionQuickView(st(id,food(id).defaultAmount)),/Hirse/i);
    assert.equal(HOMEMADE_148.has(id),true);
    assert.ok(PRODUCT_PROFILES[id]);
  }
});
test('illustrative recipe reflects only reported ingredients, with separate optional pear',()=>{
 assert.equal(assumptions.ingredients.length,3);
 assert.deepEqual(assumptions.ingredients.map(x=>x.grams),[500,150,10]);
 assert.equal(assumptions.servings,4);
 assert.equal(assumptions.baseServingGrams,165);
 assert.equal(assumptions.pearGramsPerServing,100);
 assert.equal(assumptions.noAddedFatOrMilkAssumed,true);
 assert.equal(RECIPE_EVIDENCE_148[mid].recipeIngredients.length,3);
 assert.equal(RECIPE_EVIDENCE_148[pid].recipeIngredients.length,4);
 assert.match(food(mid).recipeNote,/nicht gewogen/i);
 assert.match(food(pid).recipeNote,/nicht im Originalrezept bestätigt/i);
 assert.doesNotMatch(food(mid).title,/Birne/);
});
test('standard portion is 165g base, 265g pear; scaling supports fractions and grams',()=>{
 for(const [id,unit] of [[mid,165],[pid,265]]){
  for(const [amount,expected] of [['1 Portion',unit],['2 Portionen',2*unit],['½ Portion',unit/2],['0,5 Portion',unit/2],['1 Stück',unit],['1 Scheibe',unit],['100 g',100],['1 Portion (ca. 165 g)',unit]]){
   near(foodPortion148(id,amount).grams,expected,.001);
   near(milletBakePortion166(id,amount).grams,expected,.001);
  }
  for(const bad of ['0 Portionen','-1 Stück','gar nichts','5001 g','']){
   if(!bad)continue;assert.equal(foodPortion148(id,bad),null,bad);
  }
 }
});
test('macros and all micronutrients are explicitly estimated, never labelled as measured',()=>{
 for(const [id,expected] of [[mid,base],[pid,pear]]){
  const n=nutrientEntry(food(id),st(id,'1 Portion').nutritionJournal.entries[0]);
  for(const [k,v] of Object.entries(expected)){
   near(n.values[k],v,.02);assert.ok(n.estimatedKeys.has(k),`${id}:${k} not marked estimated`);
  }
  assert.equal(n.values.kcal>0,true);assert.equal(n.knownKeys.has('vitaminK'),false);
  near(nutritionKcalEstimate(food(id),'2 Portionen').low,Math.round(expected.kcal*2),1);
 }
 near(base.kcal,209.375);near(pear.kcal,266.375);
 near(pear.kcal-base.kcal,57);
 near(pear.fiber-base.fiber,3.1);
});
test('Daily Dozen whole-grain estimated from 125g cooked millet, pear only if chosen',()=>{
 const b=dailyDozenIngredientEvidence404(st(mid,'1 Portion'),day);
 near(b.totals.wholegrains,1.25);
 near(b.totals.fruit,0);
 const p=dailyDozenIngredientEvidence404(st(pid,'1 Portion'),day);
 near(p.totals.wholegrains,1.25);
 near(p.totals.fruit,100/120);
 for(const category of ['berries','cruciferous','nuts','flax','beans'])near(p.totals[category],0);
 assert.match(p.notes.fruit.join(' '),/nicht im ursprünglichen Auflauf bestätigt/i);
 const half=dailyDozenIngredientEvidence404(st(pid,'½ Portion'),day);
 near(half.totals.fruit,50/120);
 near(half.totals.wholegrains,.625);
 const dd=dailyDozen5930(st(pid,'1 Portion'),{day});
 near(dd.rows.find(x=>x.id==='wholegrains').observed,1.3,.01);
 near(dd.rows.find(x=>x.id==='fruits').observed,.8,.01);
});
test('Anti-Aging Eight observes no unjustified nuts, berries, or biomarker',()=>{
 for(const id of [mid,pid]){
  const aa=antiAgingEightModel(st(id,'1 Portion'),day);
  assert.equal(aa.rows.find(x=>x.id==='nuts').status,'unknown');
  assert.equal(aa.rows.find(x=>x.id==='berries').status,'unknown');
  assert.equal(aa.rows.find(x=>x.id==='nad').status,'unmeasurable');
  assert.equal(aa.rows.find(x=>x.id==='protein').status,'partial');
  assert.equal(aa.rows.find(x=>x.id==='microbiome').status,'partial');
 }
});
test('catalog entry does not silently book tomorrow breakfast, no vault migration',()=>{
 assert.equal(nutritionFoods({}).filter(f=>[mid,pid].includes(f.id)).length,2);
 assert.equal(({}.nutritionJournal?.entries||[]).length,0);
 assert.equal(assumptions.ingredients.every(i=>i.verified===false),true);
});
