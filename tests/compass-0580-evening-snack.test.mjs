import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAL_RECIPE_IDS,recipeSnapshot,personalRecipeParts,personalRecipeKcal,personalRecipeEditor,readPersonalRecipe} from '../client/src/personal-recipes-v57737.js';
import {nutritionFoods,addNutrition,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
const ID='crackers-feta-evening-personal';
const now='2026-10-30T21:16:00.000Z';
const state=()=>({nutritionJournal:{entries:[],customFoods:[]}});
test('Personal evening snack is a stable, unique preset in its own section',()=>{
 const foods=nutritionFoods(state()); const found=foods.filter(x=>x.id===ID);
 assert.equal(found.length,1); assert.equal(found[0].group,'Abendsnack');
 assert(PERSONAL_RECIPE_IDS.includes(ID));
 assert.equal(found[0].defaultAmount,'1 Portion');
});
test('One portion uses exact half-cracker package and 1 tbsp each',()=>{
 const amounts=Object.fromEntries(recipeSnapshot(ID).map(x=>[x.id,x.grams]));
 assert.deepEqual(amounts,{'crackers':90,'sheep-cheese':90,'pumpkin-oil':14,'miso':15,'basil-pesto':15});
 const values=personalRecipeParts(ID).reduce((out,p)=>{for(const [k,v] of Object.entries(p.values))out[k]=(out[k]||0)+v;return out;},{});
 assert(values.kcal>=820&&values.kcal<=900);
 assert(values.protein>20&&values.protein<30);
 assert(values.fat>45&&values.fat<65);
 assert(values.salt>4); // salinity comes mainly from cheese/miso/crackers; estimated only
});
test('Logging has saved ingredient snapshot and nutrition shows composition',()=>{
 const s=state();const entry=addNutrition(s,{foodId:ID,at:now});
 assert.equal(entry.foodId,ID);assert.equal(entry.recipe.length,5);
 const food=nutritionFoods(s).find(x=>x.id===ID);
 const result=nutrientEntry(food,entry);
 assert(result.parts.some(x=>x.name.includes('Miso')));
 assert(result.parts.some(x=>x.name.includes('Basilikumpesto')));
 assert(result.values.kcal>800);
 assert(nutritionKcalEstimate(food,entry.amount,entry.recipe).low>800);
});
test('One ingredient change updates estimate without mutating built-in defaults',()=>{
 const before=recipeSnapshot(ID),edited=recipeSnapshot(ID,[{id:'miso',grams:5,assumed:false}]);
 assert.equal(edited.find(x=>x.id==='miso').grams,5);
 assert.equal(before.find(x=>x.id==='miso').grams,15);
 const def=personalRecipeKcal(ID),smaller=personalRecipeKcal(ID,edited);
 assert(smaller.low<def.low);
 const markup=personalRecipeEditor({foodId:ID,recipe:edited});
 assert.match(markup,/recipe737-miso/);
 const fd=new FormData();for(const row of edited)fd.set('recipe737-'+row.id,String(row.grams));
 assert.equal(readPersonalRecipe(ID,fd).find(x=>x.id==='miso').grams,5);
});
