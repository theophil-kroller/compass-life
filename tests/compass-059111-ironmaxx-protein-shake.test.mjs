import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAL_RECIPE_PRESETS,PERSONAL_RECIPE_IDS,recipeSnapshot,personalRecipeParts,personalRecipeKcal,personalRecipeEditor,readPersonalRecipe} from '../client/src/personal-recipes-v57737.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const ID='ironmaxx-vegan-protein-shake-mixed-berries',DAY='2026-11-02';
const food=PERSONAL_RECIPE_PRESETS.find(x=>x.id===ID);
const state=(recipe=recipeSnapshot(ID),amount=food.defaultAmount)=>({nutritionJournal:{entries:[{id:'shake-1',foodId:ID,at:DAY+'T15:00:00',amount,recipe,deleted:false}],customFoods:[]}});

test('IronMaxx Mixed Berries is a single stable product in Getränke, not auto-logged',()=>{
 assert.equal(PERSONAL_RECIPE_IDS.filter(x=>x===ID).length,1);
 assert.equal(food.group,'Getränke');assert.match(food.defaultAmount,/30 g Pulver \+ 300 ml Wasser/);
 const s={nutritionJournal:{entries:[],customFoods:[]}};
 assert.equal(nutritionFoods(s).filter(x=>x.id===ID).length,1);
 assert.equal(s.nutritionJournal.entries.length,0);
 assert.match(food.recipeNote,/Originaletikett/);
});
test('one 30-g glass uses actual label values; no fake sugar zero or unknown fiber',()=>{
 const day=nutritionDay(state(),DAY);const totals=day.totals;
 for(const [k,v] of Object.entries({kcal:119,protein:22,carbs:1.4,fat:2.4,saturated:.4,salt:1.3,sodium:520}))assert.equal(totals[k],v,k);
 assert.equal(personalRecipeKcal(ID).low,119);
 assert.match(personalRecipeKcal(ID).kind,/Etikettwert/);
 assert.equal(nutritionKcalEstimate(food,food.defaultAmount).low,119);
 assert.equal(day.coverage.protein.estimated,0);
 assert.equal(day.coverage.sodium.estimated,1);
 for(const k of ['sugar','fiber','vitaminB12','iron','calcium','magnesium','potassium','zinc','vitaminD']){
  assert.equal(day.coverage[k].unknown,1,`${k} is unknown`);
  assert.ok(!Object.hasOwn(totals,k),`${k} not fabricated`);
 }
 assert.match(food.recipeNote,/<0,5 g/);
});
test('portion scaling works for glass count and edited powder quantity',()=>{
 const base=personalRecipeParts(ID);
 assert.deepEqual(base.map(p=>p.amount),[30,300]);
 assert.equal(personalRecipeKcal(ID,null,'2 Gläser').low,238);
 assert.equal(personalRecipeParts(ID,null,'2 Gläser')[0].values.protein,44);
 const edit=recipeSnapshot(ID);edit.find(x=>x.id==='protein-powder').grams=15;
 assert.equal(personalRecipeKcal(ID,edit).low,60);
 assert.equal(nutritionDay(state(edit),DAY).totals.protein,11);
 assert.equal(nutritionDay(state(edit),DAY).totals.sodium,260);
 assert.match(personalRecipeEditor({foodId:ID}),/recipe737-protein-powder/);
 const f=new FormData();f.set('recipe737-protein-powder','30');f.set('recipe737-water','250');
 assert.equal(readPersonalRecipe(ID,f).find(x=>x.id==='water').grams,250);
});
test('daily dozen only records documented water as drink; berry flavour not berries',()=>{
 const s=state(),d=dailyDozenIngredientEvidence404(s,DAY);
 assert.ok(Math.abs(d.totals.beverages-300/350)<1e-10);
 for(const k of ['berries','beans','nuts','wholegrains','fruit'])assert.equal(d.totals[k],0,k);
 const legacy=dailyDozenSummary(s,DAY);
 assert.equal(legacy.rows.find(x=>x.id==='beverages').count,1);
 assert.equal(legacy.rows.find(x=>x.id==='berries').count,0);
 const edit=recipeSnapshot(ID);edit.find(x=>x.id==='water').grams=0;
 assert.equal(dailyDozenIngredientEvidence404(state(edit),DAY).totals.beverages,0);
 assert.equal(dailyDozenSummary(state(edit),DAY).rows.find(x=>x.id==='beverages').count,0);
});
test('anti-aging eight shows recorded protein without claiming protein restriction or berries',()=>{
 const a=antiAgingEightModel(state(),DAY);
 const p=a.rows.find(x=>x.id==='protein');assert.equal(p.status,'partial');assert.match(p.value,/22 g Protein/);
 assert.equal(a.rows.find(x=>x.id==='berries').status,'unknown');
 assert.equal(a.rows.find(x=>x.id==='nad').status,'unmeasurable');
});
test('older recipe nutrition and personal journal remain unchanged',()=>{
 assert.equal(personalRecipeKcal('oven-potatoes-sesame-personal').low,467);
 assert.equal(personalRecipeKcal('homemade-poppy-cake-chocolate-personal').low,573);
 assert.equal(personalRecipeKcal('basmati-lentil-dal-broccoli-personal').low,519);
 const s={nutritionJournal:{entries:[],customFoods:[]}};
 assert.equal(nutritionDay(s,DAY).entries.length,0);
 assert.equal(s.nutritionJournal.entries.length,0);
});
