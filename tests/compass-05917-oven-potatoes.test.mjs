import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAL_RECIPE_IDS,PERSONAL_RECIPE_PRESETS,recipeSnapshot,personalRecipeParts,personalRecipeKcal,personalRecipeEditor,readPersonalRecipe} from '../client/src/personal-recipes-v57737.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {nutritionDay,nutritionParts} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';

const ID='oven-potatoes-sesame-personal';
const preset=PERSONAL_RECIPE_PRESETS.find(x=>x.id===ID);
const at='2026-11-01T12:35:00';
const state=recipe=>({nutritionJournal:{entries:[{id:'oven1',foodId:ID,amount:preset.defaultAmount,recipe,at,deleted:false}],customFoods:[]}});

 test('one stable built-in personal meal selectable in the nutrition food menu',()=>{
  assert.equal(PERSONAL_RECIPE_IDS.filter(x=>x===ID).length,1);
  assert.equal(nutritionFoods(state()).filter(x=>x.id===ID).length,1);
  assert.equal(preset.group,'Mahlzeiten');
  assert.match(preset.defaultAmount,/breite Suppenschüssel/);
  assert.match(preset.recipeNote,/mit Schale|samt Schale/);
  assert.match(preset.recipeNote,/beide|insgesamt/);
 });
 test('the wide soup bowl uses one total oil amount despite two drizzle steps',()=>{
  const rows=recipeSnapshot(ID);
  assert.deepEqual(Object.fromEntries(rows.map(x=>[x.id,x.grams])),{
   'potato-skin':300,'olive-oil':20,'black-sesame':10,'chili-flakes':0.5,salt:1
  });
  assert.equal(rows.filter(x=>x.id==='olive-oil').length,1);
  assert.ok(rows.every(x=>x.assumed));
 });
 test('energy is ingredient-derived, transparent estimate; no fake vitamin C after baking',()=>{
  const parts=personalRecipeParts(ID);
  const sum=parts.reduce((n,x)=>n+(x.values.kcal??0),0);
  assert.ok(sum>460&&sum<470);
  assert.deepEqual(personalRecipeKcal(ID),{low:467,high:467,kind:'Rezept-Schätzung',incomplete:false});
  assert.deepEqual(nutritionKcalEstimate(preset,preset.defaultAmount),{low:467,high:467,kind:'Rezept-Schätzung',incomplete:false});
  assert.equal(nutritionDay(state(),'2026-11-01').totals.kcal,466.51);
  assert.equal(nutritionDay(state(),'2026-11-01').totals.salt,1);
  assert.ok(nutritionDay(state(),'2026-11-01').totals.protein>7);
  assert.equal(parts.some(p=>Object.hasOwn(p.values,'vitaminC')),false);
  assert.ok(parts.every(p=>p.estimatedKeys.length===Object.keys(p.values).length));
 });
 test('editor and persisted recipe allow ingredient gram edits, including removing seeds',()=>{
  const editHtml=personalRecipeEditor({foodId:ID});
  for(const id of ['potato-skin','olive-oil','black-sesame','chili-flakes','salt'])assert.match(editHtml,new RegExp('name="recipe737-'+id+'"'));
  const fd=new FormData();for(const r of recipeSnapshot(ID))fd.set('recipe737-'+r.id,String(r.grams));
  fd.set('recipe737-olive-oil','10');fd.set('recipe737-black-sesame','0');
  const edited=readPersonalRecipe(ID,fd);
  assert.equal(edited.find(x=>x.id==='olive-oil').grams,10);
  assert.equal(edited.find(x=>x.id==='olive-oil').assumed,false);
  assert.equal(edited.find(x=>x.id==='black-sesame').grams,0);
  const p=personalRecipeParts(ID,edited);
  assert.equal(p.some(x=>x.name.includes('Sesam')),false);
  assert.ok(personalRecipeKcal(ID,edited).low<350);
  assert.ok(nutritionDay(state(edited),'2026-11-01').totals.fat<12);
 });
 test('one bowl or two bowls scales calories, nutrients and Daily Dozen seed evidence',()=>{
  const single=nutritionParts(ID,preset.defaultAmount,preset);
  const double=nutritionParts(ID,'2 Portionen',preset);
  assert.equal(single.length,5);assert.equal(double.length,5);
  assert.equal(double.find(p=>p.name.includes('Kartoffeln')).amount,600);
  assert.equal(double.find(p=>p.name.startsWith('Olivenöl')).amount,40);
  assert.equal(nutritionKcalEstimate(preset,'2 Portionen').low,933);
  assert.ok(Math.abs(double.reduce((n,p)=>n+p.values.kcal,0)-933.02)<.01);
 });
 test('Daily Dozen credits only recorded sesame and chili fractions, not a full unweighed vegetable serving',()=>{
  const ledger=dailyDozenIngredientEvidence404(state(),'2026-11-01');
  assert.equal(ledger.nutGrams,10);assert.equal(ledger.spiceGrams,.5);
  assert.equal(ledger.totals.vegetables,0);
  const daily=dailyDozen5930(state(),{day:'2026-11-01'});
  assert.equal(daily.rows.find(r=>r.id==='nuts').observed,.3);
  assert.equal(daily.rows.find(r=>r.id==='spices').observed,.5);
  const noSesame=recipeSnapshot(ID,[{id:'black-sesame',grams:0}]);
  assert.equal(dailyDozenIngredientEvidence404(state(noSesame),'2026-11-01').nutGrams,0);
 });
 test('older recipes remain unchanged when their amount field is a count',()=>{
  const original=personalRecipeKcal('fried-egg-personal');
  const retained=personalRecipeKcal('fried-egg-personal',null,'2 Portionen');
  assert.deepEqual(retained,original);
 });
