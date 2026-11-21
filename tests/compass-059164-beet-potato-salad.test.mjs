import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry,PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {foodCategory148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {foodPortion148,RECIPE_EVIDENCE_148,HOMEMADE_148} from '../client/src/food-additions-v059148.js';
import {BEET_SALAD_164,BEET_SALAD_ID_164,BEET_SALAD_NUTRIENTS_164,beetSaladPortion164} from '../client/src/beet-potato-salad-v059164.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const id=BEET_SALAD_ID_164;
const state=(amount='1 Portion')=>({nutritionJournal:{entries:[{id:'meal20261121',foodId:id,amount,at:'2026-11-21T12:00:00'}],customFoods:[]}});
const food=nutritionFoods(state()).find(x=>x.id===id);
const close=(a,b,t=.03)=>assert.ok(Math.abs(a-b)<=t,`expected ~${b} got ${a}`);
test('recipe is one real meal preset and searchable under Rote Rüben',()=>{
 assert.ok(food);assert.equal(nutritionFoods(state()).filter(f=>f.id===id).length,1);
 assert.equal(foodCategory148(food),'meals');assert.equal(food.group,'Mahlzeiten');
 assert.ok(HOMEMADE_148.has(id));assert.match(foodSearch148(food),/rote r[uü]ben|rote-ruben/i);
 assert.match(nutritionQuickView(state()),/Rote-Rüben-Kartoffelsalat/);
});
test('whole recipe estimated masses add up; half is 572.5g, ingredient evidence named',()=>{
 assert.equal(BEET_SALAD_164.ingredients.reduce((s,x)=>s+x.gramsBatch,0),1145);
 assert.equal(BEET_SALAD_164.portionGrams,572.5);assert.equal(RECIPE_EVIDENCE_148[id].ingredients.length,14);
 for(const word of ['Rosmarin','Zitronenschale','Koriandersamen','Kala Namak','Sesam','Rüben','Kürbiskernöl','Schafkäse'])assert.match(food.recipeNote, new RegExp(word,'i'));
 assert.match(PRODUCT_PROFILES[id].note,/Schafkäse/);
});
test('mass and portion parsing: standard half recipe, full batch, quarter, 250g, 0.5 portion',()=>{
 for(const [amount,grams] of [['1 Portion',572.5],['2 Portionen',1145],['1 Rezept',1145],['½ Rezept',572.5],['¼ Rezept',286.25],['0,5 Portion',286.25],['250 g',250],['1 Portion (ca. 573 g; ½ Rezept)',572.5]]){
  close(foodPortion148(id,amount).grams,grams,.00001);
  close(beetSaladPortion164(amount).grams,grams,.00001);
  const log=state(amount).nutritionJournal.entries[0];close(nutrientEntry(food,log).values.kcal,Math.round((BEET_SALAD_NUTRIENTS_164.kcal*grams/572.5)*100)/100,.04);
 }
 assert.equal(foodPortion148(id,'0 Portionen'),null);assert.equal(foodPortion148(id,'-100 g'),null);
 assert.equal(foodPortion148(id,'Sesam'),null);
});
test('estimated macros/micros are present and flagged, no invented vitamin D or B12 from plants',()=>{
 const n=nutrientEntry(food,state().nutritionJournal.entries[0]);
 close(n.values.kcal,838.62,1);close(n.values.protein,28.1,.2);close(n.values.fat,48.2,.3);
 close(n.values.carbs,77.9,.3);close(n.values.fiber,13.1,.2);
 assert.ok(n.values.calcium>500);assert.ok(n.values.magnesium>200);assert.ok(n.values.potassium>1000);
 assert.ok(n.values.folate>150);assert.ok(n.values.vitaminB12>1);
 assert.ok(!n.knownKeys.has('vitaminD'));assert.ok(!n.knownKeys.has('iodine'));
 for(const key of ['kcal','protein','carbs','fat','fiber','calcium','magnesium','potassium','iron','folate','vitaminB12'])assert.ok(n.estimatedKeys.has(key),key);
 assert.ok(n.sources.some(x=>/Schätzung/i.test(x)));
 close(nutritionKcalEstimate(food,'1 Portion').low,Math.round(BEET_SALAD_NUTRIENTS_164.kcal));
});
test('Daily Dozen counts recipe ingredients once, excludes potatoes wholegrains, cheese beans',()=>{
 const s=state();const evidence=dailyDozenIngredientEvidence404(s,'2026-11-21');
 close(evidence.totals.vegetables,175/80);close(evidence.nutGrams,30);close(evidence.totals.nuts,1);close(evidence.totals.spices,1);
 for(const key of ['wholegrains','beans','berries','cruciferous','flax','beverages'])assert.equal(evidence.totals[key],0,key);
 assert.match(evidence.notes.wholegrains.join(' '),/kein Vollkorn/);
 const modern=dailyDozen5930(s,{day:'2026-11-21'});const by=Object.fromEntries(modern.rows.map(r=>[r.id,r]));
 assert.equal(by.vegetables.observed,2);assert.equal(by.nuts.observed,1);assert.equal(by.spices.observed,1);
 assert.equal(by.wholegrains.observed,0);assert.ok(modern.evidence.some(x=>x.category==='vegetables'));
 const legacy=Object.fromEntries(dailyDozenSummary(s,'2026-11-21').rows.map(x=>[x.id,x]));
 assert.equal(legacy.vegetables.count,2);assert.equal(legacy.nuts.count,1);assert.equal(legacy.spices.count,1);
});
test('scaled half portion yields fractional vegetables, seeds; manual Daily Dozen zero wins',()=>{
 const s=state('0,5 Portion');const e=dailyDozenIngredientEvidence404(s,'2026-11-21');
 close(e.totals.vegetables,1.09375);close(e.totals.nuts,.5);close(e.nutGrams,15);
 s.nutritionJournal.dailyDozen={'2026-11-21':{nuts:{count:0,updatedAt:'2026-11-21T13:00:00'}}};
 assert.equal(dailyDozenSummary(s,'2026-11-21').rows.find(x=>x.id==='nuts').count,0);
});
test('Anti-Aging Eight nut status observed from seed mass; clinical biomarkers remain unmeasurable',()=>{
 const s=state();const m=antiAgingEightModel(s,'2026-11-21');
 assert.equal(m.rows.find(x=>x.id==='nuts').status,'observed');
 assert.ok(m.rows.find(x=>x.id==='nuts').value.includes('30 g'));
 assert.equal(m.rows.find(x=>x.id==='microbiome').status,'partial');
 assert.equal(m.rows.find(x=>x.id==='xeno').status,'unmeasurable');
 assert.equal(m.rows.find(x=>x.id==='nad').status,'unmeasurable');
});
