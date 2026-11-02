import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAL_RECIPE_IDS,PERSONAL_RECIPE_PRESETS,recipeSnapshot,personalRecipeParts,personalRecipeKcal,personalRecipeEditor,readPersonalRecipe} from '../client/src/personal-recipes-v57737.js';
import {nutritionFoods,nutritionKcalEstimate,addNutrition} from '../client/src/personal-journal-v5692.js';
import {nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const CAKE='homemade-poppy-cake-chocolate-personal', DAL='basmati-lentil-dal-broccoli-personal', DAY='2026-11-02', AT='2026-11-02T14:00:00';
const preset=id=>PERSONAL_RECIPE_PRESETS.find(f=>f.id===id);
const state=(id,recipe=recipeSnapshot(id),amount=preset(id).defaultAmount)=>({nutritionJournal:{entries:[{id:'one',foodId:id,at:AT,amount,recipe,deleted:false}],customFoods:[]}});

test('both are unique stable food presets in existing menu, no new storage',()=>{
 for(const id of [CAKE,DAL]){assert.equal(PERSONAL_RECIPE_IDS.filter(v=>v===id).length,1);assert.equal(nutritionFoods(state(id)).filter(v=>v.id===id).length,1);assert.match(preset(id).recipeNote,/Daily Dozen/);assert.match(preset(id).recipeNote,/Anti-Aging Eight/);}
 assert.equal(preset(CAKE).group,'Snacks');assert.equal(preset(DAL).group,'Mahlzeiten');
 assert.match(preset(CAKE).defaultAmount,/7 × 6 × 4 cm/);
 assert.match(preset(DAL).defaultAmount,/flacher Suppenteller/);
});
test('homemade cake: 7x6x4 cm piece is a weight assumption, topping separately editable',()=>{
 assert.deepEqual(Object.fromEntries(recipeSnapshot(CAKE).map(r=>[r.id,r.grams])),{'poppy-cake-base':125,'chocolate-topping':15});
 assert.equal(personalRecipeKcal(CAKE).low,573);
 assert.equal(nutritionKcalEstimate(preset(CAKE),preset(CAKE).defaultAmount).high,573);
 assert.equal(nutritionDay(state(CAKE),DAY).totals.kcal,573.25);
 assert.ok(nutritionDay(state(CAKE),DAY).totals.calcium>0);
 assert.ok(nutritionDay(state(CAKE),DAY).coverage.calcium.estimated);
 assert.equal(nutritionDay(state(CAKE),DAY).coverage.folate.unknown,1); // no fake micronutrient zero
});
test('cake DD: poppy mass is unknown, no inferred nuts or wholegrain, AA does not assert effect',()=>{
 const s=state(CAKE),d=dailyDozenIngredientEvidence404(s,DAY),legacy=dailyDozenSummary(s,DAY),aa=antiAgingEightModel(s,DAY);
 assert.equal(d.nutGrams,0);assert.equal(d.totals.nuts,0);assert.equal(d.totals.wholegrains,0);
 assert.ok(d.notes.nuts.join().includes('unbekannt'));
 assert.equal(legacy.rows.find(r=>r.id==='nuts').count,0);
 assert.equal(aa.rows.find(r=>r.id==='nuts').status,'unknown');
 assert.equal(aa.rows.find(r=>r.id==='xeno').status,'unmeasurable');
 assert.equal(aa.rows.find(r=>r.id==='protein').status,'partial');
});
test('dal: cooked rice, cooked lentils, broccoli, oil, curry, salt counted once',()=>{
 const rows=recipeSnapshot(DAL);
 assert.deepEqual(Object.fromEntries(rows.map(r=>[r.id,r.grams])),{'basmati-cooked':170,'lentils-cooked':160,'broccoli-cooked':100,oil:8,'curry-powder':2,salt:1});
 assert.equal(personalRecipeKcal(DAL).low,519);
 assert.deepEqual(personalRecipeKcal(DAL).incomplete,false);
 const day=nutritionDay(state(DAL),DAY),n=day.totals;
 assert.ok(n.kcal>500&&n.kcal<550);assert.ok(n.protein>20&&n.protein<24);assert.ok(n.carbs>85&&n.carbs<90);
 assert.ok(n.fiber>16&&n.fiber<19);assert.ok(n.fat>9&&n.fat<11);
 for(const key of ['potassium','iron','magnesium','folate','vitaminC','vitaminB6','calcium','zinc']){
  assert.ok(n[key]>0,`${key} estimated`);assert.equal(day.coverage[key].estimated,1,`${key} estimated flag`);
 }
 assert.equal(day.coverage.vitaminB12.unknown,1);
});
test('dal DD and AA: lentils, cruciferous broccoli, curry counted, white rice not wholegrain',()=>{
 const s=state(DAL),d=dailyDozenIngredientEvidence404(s,DAY);
 assert.ok(Math.abs(d.totals.beans-160/90)<1e-8);
 assert.ok(Math.abs(d.totals.cruciferous-100/80)<1e-8);
 assert.equal(d.totals.spices,1);assert.equal(d.totals.wholegrains,0);
 const modern=dailyDozen5930(s,{day:DAY});
 assert.ok(modern.rows.find(x=>x.id==='legumes').observed>1.7);
 assert.equal(modern.rows.find(x=>x.id==='cruciferous').observed,1);
 assert.equal(modern.rows.find(x=>x.id==='wholegrains').observed,0);
 const dd=dailyDozenSummary(s,DAY);
 assert.equal(dd.rows.find(x=>x.id==='beans').count,2);
 assert.match(dd.rows.find(x=>x.id==='beans').provenance.join(' '),/Linsendal/);
 assert.equal(dd.rows.find(x=>x.id==='cruciferous').count,1);
 assert.equal(dd.rows.find(x=>x.id==='spices').count,1);
 assert.equal(dd.rows.find(x=>x.id==='wholegrains').count,0);
 const aa=antiAgingEightModel(s,DAY);
 assert.equal(aa.rows.find(x=>x.id==='greens').status,'observed');
 assert.equal(aa.rows.find(x=>x.id==='microbiome').status,'partial');
 assert.equal(aa.rows.find(x=>x.id==='nad').status,'unmeasurable');
});
test('two portions scale ingredient nutrients and Daily Dozen without adding food entries',()=>{
 for(const [id,amount] of [[CAKE,'2 Stück'],[DAL,'2 Teller']]){
  assert.equal(personalRecipeParts(id,null,amount).length,recipeSnapshot(id).length);
  assert.ok(Math.abs(nutritionDay(state(id,undefined,amount),DAY).totals.kcal-2*nutritionDay(state(id),DAY).totals.kcal)<.02);
 }
 const s=state(DAL,undefined,'2 Portionen');const d=dailyDozenIngredientEvidence404(s,DAY);
 assert.ok(d.totals.beans>3);assert.ok(d.totals.cruciferous>2);
 assert.equal(d.totals.wholegrains,0);
});
test('edit saved ingredients independently; smaller chocolate and zero broccoli reduce relevant nutrients',()=>{
 for(const id of [CAKE,DAL]){
  const editor=personalRecipeEditor({foodId:id});assert.match(editor,/recipe737-/);
  const fd=new FormData();for(const row of recipeSnapshot(id))fd.set(`recipe737-${row.id}`,String(row.grams));
  if(id===CAKE){fd.set('recipe737-chocolate-topping','0');const edited=readPersonalRecipe(id,fd);assert.equal(edited.find(r=>r.id==='chocolate-topping').grams,0);assert.ok(personalRecipeKcal(id,edited).low<500);}
  if(id===DAL){fd.set('recipe737-broccoli-cooked','0');const edited=readPersonalRecipe(id,fd);assert.equal(dailyDozenIngredientEvidence404(state(id,edited),DAY).totals.cruciferous,0);assert.equal(nutritionDay(state(id,edited),DAY).coverage.vitaminC.unknown,1);}
 }
});
test('existing recipes and food logs remain unchanged',()=>{
 const prev=personalRecipeKcal('oven-potatoes-sesame-personal');assert.equal(prev.low,467);
 assert.equal(personalRecipeKcal('fried-egg-personal').low,personalRecipeKcal('fried-egg-personal',null,'2 Portionen').low);
 const oldState=state('oven-potatoes-sesame-personal');assert.equal(nutritionDay(oldState,DAY).totals.kcal,466.51);
 assert.equal(nutritionFoods(oldState).filter(f=>f.id==='apple-shortcrust-cake').length,1);
});
test('no implicit meal creation or changes to encrypted journal before selection',()=>{
 const s={nutritionJournal:{entries:[],customFoods:[]}};
 assert.equal(nutritionDay(s,DAY).entries.length,0);
 assert.equal(nutritionFoods(s).filter(f=>f.id===CAKE).length,1);
 assert.equal(s.nutritionJournal.entries.length,0);
});
