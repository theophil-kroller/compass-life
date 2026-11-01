import test from 'node:test';
import assert from 'node:assert/strict';
import {FOOD_PRESETS,nutritionFoods,nutritionQuickView,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {nutritionParts,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {compass5929BreakfastBridge} from '../client/compass5929-breakfast-bridge.js';
import {readFileSync} from 'node:fs';

const s={nutritionJournal:{entries:[],customFoods:[]}};
const recipes=['lyttos-pistachio-breakfast','lyttos-tahini-breakfast'];
test('Both original yogurt recipe IDs are native, unique, and visible in quick breakfast',()=>{
 for(const id of recipes){
  assert.equal(FOOD_PRESETS.filter(x=>x.id===id).length,1,id);
  assert.equal(nutritionFoods(s).filter(x=>x.id===id).length,1,id);
  assert.equal(FOOD_PRESETS.find(x=>x.id===id).group,'Frühstück');
  assert.match(nutritionQuickView(s),new RegExp(`data-id="${id}"`));
 }
});
test('Historical nutrition entries survive and contribute ingredient-based protein',()=>{
 for(const id of recipes){
  const f=FOOD_PRESETS.find(x=>x.id===id);
  const nutrients=nutrientEntry(f,{foodId:id,amount:f.defaultAmount});
  assert.equal(nutrients.parts.length,3);
  assert.ok(nutrients.values.protein>=7&&nutrients.values.protein<10);
  assert.ok(nutrients.values.kcal>300&&nutrients.values.kcal<330);
  assert.ok(nutritionKcalEstimate(f,f.defaultAmount).low>300);
 }
});
test('Gram edits and zero-ingredient variations recalculate rather than leave fixed totals',()=>{
 const f=FOOD_PRESETS.find(x=>x.id===recipes[0]);
 const original=nutritionKcalEstimate(f,f.defaultAmount);
 assert.ok(nutritionKcalEstimate(f,'150 g Joghurt + 5 g Honig + 10 g Pistazienmus').low<original.low);
 assert.equal(nutritionKcalEstimate(f,'0 g Joghurt + 0 g Honig + 0 g Pistazienmus').low,0);
 assert.equal(nutritionKcalEstimate(f,'2000 g Joghurt + 15 g Honig + 15 g Pistazienmus'),null);
 assert.equal(nutritionParts(recipes[1],'150 g Joghurt + 12 g Honig + 9 g Tahini').length,3);
});
test('Legacy build bridge does not duplicate native recipes while retaining historical CI integration',()=>{
 const plugin=compass5929BreakfastBridge();
 for(const filename of ['personal-journal-v5692.js','nutrition-intelligence-v57712.js']){
  const code=readFileSync(new URL('../client/src/'+filename,import.meta.url),'utf8');
  assert.equal(plugin.transform(code,'/repo/client/src/'+filename),null);
 }
});
