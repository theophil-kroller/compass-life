import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAL_RECIPE_IDS,PERSONAL_RECIPE_PRESETS,PERSONAL_RECIPE_CATALOG,recipeSnapshot,personalRecipeParts,personalRecipeKcal} from '../client/src/personal-recipes-v57737.js';
import {nutritionFoods} from '../client/src/personal-journal-v5692.js';
import {nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
const ID='korean-spicy-tofu-vegetable-strudel'; // historical stable foodId
const DAY='2026-11-03';
const state=(recipe=recipeSnapshot(ID),amount='1 Krautroulade (ca. 288 g)')=>({nutritionJournal:{entries:[{id:'k1',foodId:ID,at:'2026-11-03T08:00:00',amount,recipe,deleted:false}],customFoods:[]}});
test('existing food ID is renamed in place, with no duplicate menu item or spontaneous log',()=>{
 assert.equal(PERSONAL_RECIPE_IDS.filter(x=>x===ID).length,1);
 assert.equal(nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}}).filter(x=>x.id===ID).length,1);
 assert.match(PERSONAL_RECIPE_PRESETS.find(x=>x.id===ID).title,/Krautroulade mit Räuchertofu/);
 assert.equal(state().nutritionJournal.entries.length,1);
});
test('no pastry grams or macros are used; optional unknown vegetables get 0 g',()=>{
 const names=personalRecipeParts(ID).map(x=>x.name).join(' · ');
 assert.match(names,/Kraut/);assert.match(names,/Räuchertofu/);
 assert.doesNotMatch(names,/Strudel|Blätterteig|Strudelteig/);
 assert.equal(recipeSnapshot(ID).find(x=>x.id==='mixed-vegetables').grams,0);
 assert.equal(recipeSnapshot(ID).reduce((a,x)=>a+x.grams,0),288);
 assert.equal(personalRecipeKcal(ID).low,286);
 const n=nutritionDay(state(),DAY);assert.ok(Math.abs(n.totals.kcal-286.22)<0.01);assert.ok(n.totals.protein>20);assert.ok(n.totals.fiber>5);
});
test('legacy pastry snapshot never counts its former assumed vegetable filling or stale pasty weight',()=>{
 const legacy=[{id:'strudel-pastry',grams:80,assumed:true},{id:'tofu',grams:90,assumed:true},{id:'mixed-vegetables',grams:100,assumed:true},{id:'oil',grams:6,assumed:true},{id:'spicy-seasoning',grams:12,assumed:true}];
 const migrated=recipeSnapshot(ID,legacy);
 assert.equal(migrated.find(x=>x.id==='mixed-vegetables').grams,0);
 assert.equal(migrated.find(x=>x.id==='tofu').grams,100);
 assert.equal(migrated.find(x=>x.id==='cabbage').grams,170);
 assert.ok(!migrated.some(x=>x.id==='strudel-pastry'));
 assert.ok(Math.abs(nutritionDay(state(legacy),DAY).totals.kcal-286.22)<0.01);
 const historicalEditor=legacy.map(x=>({...x,assumed:false}));
 assert.equal(recipeSnapshot(ID,historicalEditor).find(x=>x.id==='mixed-vegetables').grams,0,'legacy default vegetable mix was never confirmed by editing an unrelated field');
 const deliberate=legacy.map(x=>x.id==='tofu'?{...x,grams:140,assumed:false}:x);
 assert.equal(recipeSnapshot(ID,deliberate).find(x=>x.id==='tofu').grams,140);
});
test('Daily Dozen credits cabbage only as cruciferous, smoked tofu only as soy/beans, not a double generic vegetable',()=>{
 const d=dailyDozenIngredientEvidence404(state(),DAY);
 assert.equal(d.totals.cruciferous,170/80);
 assert.equal(d.totals.beans,100/125);
 assert.equal(d.totals.vegetables,0);
 assert.equal(d.totals.wholegrains,0);
 const l=dailyDozenSummary(state(),DAY);
 assert.equal(l.rows.find(x=>x.id==='cruciferous').count,1);
 assert.equal(l.rows.find(x=>x.id==='beans').count,1);
});
test('portion scaling uses Krautrouladen, and macros and Daily Dozen scale consistently',()=>{
 assert.equal(personalRecipeKcal(ID,null,'2 Krautrouladen').low,572);
 const d=dailyDozenIngredientEvidence404(state(recipeSnapshot(ID),'2 Krautrouladen'),DAY);
 assert.equal(d.totals.beans,2*100/125);
 assert.equal(d.totals.cruciferous,2*170/80);
});
