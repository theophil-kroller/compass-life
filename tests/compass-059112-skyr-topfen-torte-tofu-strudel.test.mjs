import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAL_RECIPE_IDS,PERSONAL_RECIPE_PRESETS,recipeSnapshot,personalRecipeParts,personalRecipeKcal,personalRecipeEditor,readPersonalRecipe} from '../client/src/personal-recipes-v57737.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const IDS=['spar-freefrom-bio-skyr-250g','bio-magertopfen-250g','homemade-topfentorte-slice','korean-spicy-tofu-vegetable-strudel'];
const DAY='2026-11-03';
const food=id=>PERSONAL_RECIPE_PRESETS.find(p=>p.id===id);
const state=(id,{recipe=recipeSnapshot(id),amount=food(id).defaultAmount}={})=>({nutritionJournal:{entries:[{id:`entry-${id}`,foodId:id,at:DAY+'T08:00:00',amount,recipe,deleted:false}],customFoods:[]}});
const totals=id=>nutritionDay(state(id),DAY).totals;

test('four stable menu entries are listed only once and are NOT logged as already eaten',()=>{
 const s={nutritionJournal:{entries:[],customFoods:[]}};
 for(const id of IDS){assert.equal(PERSONAL_RECIPE_IDS.filter(x=>x===id).length,1,id);assert.equal(nutritionFoods(s).filter(f=>f.id===id).length,1,id);assert.ok(food(id).recipeNote?.length>80);}
 assert.equal(s.nutritionJournal.entries.length,0);
 assert.equal(food(IDS[0]).group,'Frühstück');assert.equal(food(IDS[1]).group,'Frühstück');
 assert.equal(food(IDS[2]).group,'Snacks');assert.equal(food(IDS[3]).group,'Mahlzeiten');
});
test('SPAR lactose-free Bio Skyr label data are accurately scaled from 100 g to 250 g',()=>{
 const d=nutritionDay(state(IDS[0]),DAY),t=d.totals;
 assert.equal(t.kcal,155);assert.equal(t.protein,27.5);assert.equal(t.carbs,10);assert.equal(t.sugar,10);assert.equal(t.salt,.25);
 assert.equal(t.sodium,100);assert.equal(t.calcium,300);
 assert.equal(d.coverage.protein.estimated,0);assert.equal(d.coverage.calcium.estimated,1);assert.equal(d.coverage.vitaminB12.estimated,1);
 assert.equal(d.coverage.fat.estimated,1); // package gives <0.5, not a precise value
 assert.equal(d.coverage.fiber.unknown,1); // do not manufacture missing label fields
 assert.match(food(IDS[0]).recipeNote,/Fett <0,5/);
 assert.equal(nutritionKcalEstimate(food(IDS[0])).low,155);
});
test('Bio Magertopfen label protein 12g / 100g and no invented label micronutrients',()=>{
 const d=nutritionDay(state(IDS[1]),DAY),t=d.totals;
 assert.equal(t.kcal,175);assert.equal(t.protein,30);assert.equal(t.carbs,10.25);assert.equal(t.fat,.5);assert.equal(t.salt,.25);
 assert.equal(d.coverage.protein.estimated,0);assert.equal(d.coverage.calcium.estimated,1);assert.equal(d.coverage.vitaminB12.estimated,1);
 assert.equal(d.coverage.vitaminD.unknown,1);assert.equal(d.coverage.fiber.unknown,1);
});
test('one photo-estimated cheesecake slice and tofu strudel give plausible macro/micro estimates',()=>{
 const c=totals(IDS[2]),s=totals(IDS[3]);
 assert.equal(personalRecipeKcal(IDS[2]).low,371);assert.equal(personalRecipeKcal(IDS[3]).low,521);
 assert.ok(c.protein>12&&c.protein<22);assert.ok(c.calcium>100&&c.calcium<250);
 assert.ok(s.protein>18&&s.protein<25);assert.ok(s.fiber>5&&s.fiber<8);
 assert.ok(s.iron>2&&s.potassium>300);
 assert.match(food(IDS[2]).recipeNote,/NICHT gewogen/);assert.match(food(IDS[3]).recipeNote,/nicht bestätigt/i);
 for(const id of IDS.slice(2)){const d=nutritionDay(state(id),DAY);assert.equal(d.coverage.kcal.estimated,d.entries.length?d.entries.length:1);}
});
test('ingredients are editable and 2 Becher/2 Stück/2 Portionen scale everything exactly once',()=>{
 for(const [id,countLabel] of [[IDS[0],'2 Becher'],[IDS[1],'2 Becher'],[IDS[2],'2 Stück'],[IDS[3],'2 Portionen']]){
  const kcal=personalRecipeKcal(id).low;
  assert.ok(Math.abs(personalRecipeKcal(id,null,countLabel).low-2*kcal)<=1,id);
  assert.match(personalRecipeEditor({foodId:id}),/recipe737-/);
 }
 const recipe=recipeSnapshot(IDS[3]);recipe.find(r=>r.id==='tofu').grams=180;
 assert.ok(nutritionDay(state(IDS[3],{recipe}),DAY).totals.protein>totals(IDS[3]).protein);
 const form=new FormData();for(const row of recipe)form.set('recipe737-'+row.id,String(row.grams));
 assert.equal(readPersonalRecipe(IDS[3],form).find(r=>r.id==='tofu').grams,180);
});
test('Daily Dozen: dairy and cake do not get plant-food credits; strudel tofu & vegetables provisional',()=>{
 for(const id of IDS.slice(0,3)){
  const d=dailyDozenIngredientEvidence404(state(id),DAY);
  for(const k of ['beans','berries','fruit','greens','cruciferous','vegetables','nuts','wholegrains'])assert.equal(d.totals[k],0,`${id}:${k}`);
 }
 const d=dailyDozenIngredientEvidence404(state(IDS[3]),DAY);
 assert.ok(Math.abs(d.totals.beans-90/125)<1e-10);assert.equal(d.totals.vegetables,1.25);
 assert.equal(d.totals.cruciferous,0);assert.equal(d.totals.wholegrains,0);assert.equal(d.totals.spices,0);
 const legacy=dailyDozenSummary(state(IDS[3]),DAY);
 assert.equal(legacy.rows.find(x=>x.id==='beans').count,1);
 assert.equal(legacy.rows.find(x=>x.id==='vegetables').count,1);
});
test('Anti-Aging Eight reports protein for all; strudel gives only nutritional evidence, not measured postbiotics',()=>{
 for(const id of IDS){const a=antiAgingEightModel(state(id),DAY);const protein=a.rows.find(x=>x.id==='protein');assert.equal(protein.status,'partial');assert.match(protein.value,/Protein/);assert.equal(a.rows.find(x=>x.id==='nad').status,'unmeasurable');}
 const tofu=antiAgingEightModel(state(IDS[3]),DAY);
 assert.equal(tofu.rows.find(x=>x.id==='microbiome').status,'partial');
 assert.match(tofu.rows.find(x=>x.id==='microbiome').reason,/nicht|weder/i);
});
test('older recipe calories remain stable and nutrition days without food remain empty',()=>{
 for(const [id,kcal] of [['oven-potatoes-sesame-personal',467],['homemade-poppy-cake-chocolate-personal',573],['basmati-lentil-dal-broccoli-personal',519],['ironmaxx-vegan-protein-shake-mixed-berries',119]])assert.equal(personalRecipeKcal(id).low,kcal);
 assert.equal(nutritionDay({nutritionJournal:{entries:[],customFoods:[]}},DAY).entries.length,0);
});
