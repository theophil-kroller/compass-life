import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SMOOTHIE_INGREDIENTS,smoothieRecipe,smoothieParts,smoothieKcalEstimate,smoothieNotes} from '../client/src/nutrition-smart-smoothie-v57736.js';
import {compass594015SmoothieEnergyRelease} from '../client/compass594015-smoothie-energy-release.js';

const find=(recipe,id)=>recipe.find(r=>r.id===id);
test('Actual smoothie uses banana, sesame, blueberries, pollen and spices, without implicit nuts or mint',()=>{
 const rec=smoothieRecipe();
 assert.equal(find(rec,'banana').grams,120);
 assert.equal(find(rec,'sesame').grams,15);
 assert.equal(find(rec,'blueberries').grams,75);
 assert.equal(find(rec,'pollen').grams,5);
 assert.equal(find(rec,'nuts').grams,0);
 assert.equal(find(rec,'mint').grams,0);
 assert.match(smoothieNotes(),/Blütenpollen/);
 assert.doesNotMatch(smoothieNotes(),/Nussmischung|Minzblätter/);
 assert.equal(smoothieParts(rec).length,7);
 const kcal=smoothieKcalEstimate(rec);
 assert.deepEqual(kcal,{low:210,high:328,kind:'Rezeptschätzung'});
});
test('Stored historical smoothie without recipe gets valid kcal instead of missing marker',()=>{
 const kcal=smoothieKcalEstimate(undefined,'1 Portion');
 assert.equal(kcal.low,210);
 assert.equal(kcal.high,328);
 assert.equal(smoothieKcalEstimate(undefined,'2 Portionen').low,421);
});
test('Old assumed nuts are no longer erroneously attributed; explicit edits are preserved',()=>{
 const old=smoothieRecipe().map(r=>r.id==='nuts'?{...r,grams:30,assumed:true}:r.id==='mint'?{...r,grams:2,assumed:true}:r);
 const updated=smoothieRecipe(old);
 assert.equal(find(updated,'nuts').grams,0);
 assert.equal(find(updated,'mint').grams,0);
 const custom=smoothieRecipe(old.map(r=>r.id==='nuts'?{...r,assumed:false}:r));
 assert.equal(find(custom,'nuts').grams,30);
 assert.ok(smoothieKcalEstimate(custom).low>smoothieKcalEstimate(old).low);
});
test('Per-entry gram updates propagate, including pollen quantity and zero quantity',()=>{
 const withMorePollen=smoothieRecipe([{id:'pollen',grams:10,assumed:false}]);
 const noPollen=smoothieRecipe([{id:'pollen',grams:0,assumed:false}]);
 assert.ok(smoothieKcalEstimate(withMorePollen).low>smoothieKcalEstimate(noPollen).low);
 assert.ok(smoothieParts(noPollen).every(x=>!x.name.includes('Blütenpollen')));
 assert.ok(SMOOTHIE_INGREDIENTS.find(x=>x.id==='pollen').basis.includes('nicht produktspezifisch'));
});
test('Late guarded version transformer updates energy, time plots, cache, header and display name',()=>{
 const release=compass594015SmoothieEnergyRelease();
 const edit=(filename,txt)=>release.transform(txt,'/repo/client/src/'+filename).code;
 const journal=edit('personal-journal-v5692.js',["import {SMOOTHIE_INGREDIENTS,smoothieRecipe,smartNutritionGroups,smartNutritionFoods,smoothieEditFields,smoothieNotes} from './nutrition-smart-smoothie-v57736.js';", "if(PERSONAL_RECIPE_IDS.includes(food?.id))return personalRecipeKcal(food.id,recipe);", "['smoothie-personal','🫐','Mein Smoothie · Banane, Sesam, Beeren, Nüsse'"].join('\n'));
 assert.match(journal,/smoothieKcalEstimate\(recipe,amount\)/);
 assert.match(journal,/Blütenpollen/);
 const energy=edit('energy-goal-v575.js','estimate(index.get(e.foodId),e.amount)');
 assert.match(energy,/e.amount,e.recipe/);
 const timing=edit('nutrition-timing-v57725.js','const approx=nutritionKcalEstimate(food,entry.amount);\nconst fingerprint=e=>JSON.stringify([e.id,e.foodId,e.at,e.amount,e.note,e.updatedAt,e.deleted]);');
 assert.match(timing,/nutritionKcalEstimate\(food,entry.amount,entry.recipe\)/);
 assert.match(timing,/e.note,e.recipe,e.updatedAt/);
 const main=edit('main.js',"const COMPASS_CLIENT_VERSION='0.5.77.59.40.14'; Build 0.5.77.59.40.14");
 assert.match(main,/0\.5\.77\.59\.40\.15/);
});
test('Repo wires the late plugin after the .40.14 patch',()=>{
 const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(vite,/compassConfig.plugins.push\(compass594014FlaxTileRelease\(\)\);\ncompassConfig.plugins.push\(compass594015SmoothieEnergyRelease\(\)\)/);
});
