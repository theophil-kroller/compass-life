import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {FOOD_PRESETS,nutritionFoods,addNutrition,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {INSPIRATION_LEVELS,inspirationEntry,inspirationStats,mergeInspirationEntries,inspirationSuggestions} from '../client/src/task-inspiration-v57759402523.js';
import {lifeBalanceBand,lifeBalanceRadarView} from '../client/src/life-balance-radar-v563.js';
import {balancePerspective38} from '../client/src/life-balance-perspectives-v5775938.js';
import {nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
const file=name=>readFile(new URL('../client/src/'+name,import.meta.url),'utf8');

test('the two personal breakfasts are visible with stable IDs and old generic egg remains',()=>{
 const catalog=nutritionFoods({nutritionJournal:{customFoods:[]}});
 for(const id of ['smoothie-personal','fried-egg-personal']){
  const rows=catalog.filter(x=>x.id===id);assert.equal(rows.length,1);assert.equal(rows[0].group,'Frühstück');
 }
 assert(FOOD_PRESETS.some(x=>x.id==='fried-egg'));
});
test('personal recipes log immutable ingredient snapshots and estimate energy, no missing item',()=>{
 const s={nutritionJournal:{entries:[],customFoods:[]}};
 const smoothie=addNutrition(s,{foodId:'smoothie-personal',at:'2026-10-30T09:00:00Z'});
 assert(Array.isArray(smoothie.recipe));assert(smoothie.recipe.some(x=>x.id==='blueberries'));
 const egg=addNutrition(s,{foodId:'fried-egg-personal',at:'2026-10-30T10:00:00Z'});
 assert(egg.recipe.some(x=>x.id==='turmeric'));
 const foods=nutritionFoods(s);const er=nutrientEntry(foods.find(x=>x.id===egg.foodId),egg);
 assert(er.values.kcal>0);assert(er.parts.some(x=>x.name.includes('Kurkuma')));
 const sr=nutrientEntry(foods.find(x=>x.id===smoothie.foodId),smoothie);assert(sr.values.kcal>0);assert(sr.parts.some(x=>x.name.includes('Blaubeeren')));
 assert(nutritionKcalEstimate(nutritionFoods(s).find(x=>x.id===egg.foodId),egg.amount,egg.recipe).low>0);
});
test('seven inspiration levels and three-observation voluntary suggestions',()=>{
 assert.equal(INSPIRATION_LEVELS.length,7);
 const s={tasks:{open:{id:'open',title:'Bericht',category:'Administration',completed:false}},taskInspiration:[]};
 for(let i=0;i<3;i++)s.taskInspiration.push(inspirationEntry({id:'prior'+i,title:'Verwaltung',category:'Administration'},2,'2026-10-30T13:00:00Z','rating'+i));
 assert.equal(inspirationStats(s).mean,2);
 assert.equal(inspirationSuggestions(s).length,1);
 assert.equal(inspirationSuggestions({...s,taskInspiration:s.taskInspiration.slice(0,2)}).length,0);
 assert.equal(mergeInspirationEntries(s.taskInspiration,s.taskInspiration).length,3);
});
test('radar thresholds have nonempty color and historical overlays for changed axes',()=>{
 for(const n of [null,0,24,25,50,75,90,100])assert(lifeBalanceBand(n).label&&lifeBalanceBand(n).color);
 const s={healthImports:{},tasks:{}};
 const output=balancePerspective38(s,{today:'2026-10-30',period:7,healthDays:[],choice:'all',history:2});
 assert.match(output,/Vorperiode/);assert.match(output,/Davor/);assert.match(output,/lbr23-scale/);
 assert.match(output,/0–24/);assert.match(output,/90–100/);
});
test('lockscreen capture uses sealed encryption and not localStorage, has shortcut button',async()=>{
 const js=await file('ars-vivendi-lock-full-v5775922.js');
 assert.match(js,/appendSealedCapture\(title\)/);assert.match(js,/data-ars23-capture/);
 assert.match(js,/if\(!await sealedCaptureReady\(\)\)/);
 assert.doesNotMatch(js,/localStorage\.setItem/);
});
test('main task completion offers the optional rating without blocking completion',async()=>{
 const main=await file('main-full-v57759402510.js');
 assert.match(main,/if\(newlyCompleted&&state\?\.tasks\?\.\[id\]\?\.completed\)/);
 assert.match(main,/action==='inspi23-rate'/);
 assert.match(main,/action==='inspi23-skip'/);
 assert.match(main,/inspirationInsightsView\(state\)/);
 assert.match(main,/taskInspiration:st\.taskInspiration\|\|\[\]/);
});
