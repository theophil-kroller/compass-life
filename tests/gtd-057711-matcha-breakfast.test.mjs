import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  FOOD_PRESETS,addNutrition,nutritionFoods,nutritionKcalEstimate,
  nutritionKcalSummary,nutritionQuickView,nutritionEntries
} from '../client/src/personal-journal-v5692.js';

const plain=FOOD_PRESETS.find(x=>x.id==='matcha-oat-plain');
const honey=FOOD_PRESETS.find(x=>x.id==='matcha');
const now=new Date('2026-10-23T12:00:00Z');

test('two distinct one-tap breakfast matcha variants have explicit oat milk and water recipe',()=>{
 assert.ok(plain);assert.ok(honey);
 assert.equal(plain.group,'Frühstück');assert.equal(honey.group,'Frühstück');
 assert.match(plain.title,/ohne Honig/);assert.match(honey.title,/Honig/);
 assert.match(plain.recipeNote,/1 TL Matcha/);assert.match(plain.recipeNote,/heißes Wasser/);
 assert.match(honey.recipeNote,/1 TL Honig/);
 assert.match(honey.defaultAmount,/75 ml Hafermilch/);
 const ui=nutritionQuickView(null);
 assert.match(ui,/data-id="matcha-oat-plain"/);assert.match(ui,/data-id="matcha"/);
 assert.match(ui,/500 ml sind die gesamte Trinkmenge/);
 assert.equal((ui.match(/data-id="matcha(?:-oat-plain)?"/g)||[]).length,2);
});

test('oat-milk based estimates differ by one tsp of honey, not by water volume',()=>{
 assert.deepEqual(nutritionKcalEstimate(plain,plain.defaultAmount),{low:35,high:60,kind:'Schätzung'});
 assert.deepEqual(nutritionKcalEstimate(honey,honey.defaultAmount),{low:55,high:85,kind:'Schätzung'});
 assert.deepEqual(nutritionKcalEstimate(plain,'500 ml Getränk · 75 ml Hafermilch'),{low:35,high:60,kind:'Schätzung'});
 assert.deepEqual(nutritionKcalEstimate(plain,'250 ml Getränk · 75 ml Hafermilch'),{low:35,high:60,kind:'Schätzung'});
 assert.deepEqual(nutritionKcalEstimate(plain,'600 ml Getränk · 75 ml Hafermilch'),{low:35,high:60,kind:'Schätzung'});
 assert.deepEqual(nutritionKcalEstimate(plain,'500 ml Getränk · 50 ml Hafermilch'),{low:25,high:45,kind:'Schätzung'});
 assert.deepEqual(nutritionKcalEstimate(honey,'500 ml Getränk · 100 ml Hafermilch'),{low:65,high:105,kind:'Schätzung'});
 assert.deepEqual(nutritionKcalEstimate(plain,'500 ml Hafermilch'),{low:205,high:360,kind:'Schätzung'});
});

test('historical matcha logs keep their legacy ID and are recalculated without changing entries',()=>{
 const state={nutritionJournal:{entries:[{id:'old',foodId:'matcha',at:'2026-10-23T07:00:00Z',amount:'1 Tasse (250 ml)',note:'wie früher'}],customFoods:[]}};
 const old=JSON.stringify(state.nutritionJournal.entries[0]);
 assert.equal(nutritionFoods(state).filter(x=>x.id==='matcha').length,1);
 assert.deepEqual(nutritionKcalEstimate(honey,state.nutritionJournal.entries[0].amount),{low:55,high:85,kind:'Schätzung'});
 assert.equal(JSON.stringify(state.nutritionJournal.entries[0]),old);
 const added=addNutrition(state,{id:'today',foodId:'matcha-oat-plain',at:'2026-10-23T07:35:00Z'});
 assert.equal(added.amount,plain.defaultAmount);
 assert.equal(nutritionEntries(state).length,2);
 assert.deepEqual(nutritionKcalSummary(state,7,now),{low:90,high:145,known:2,unknown:0,total:2,complete:true});
});

test('existing non-Matcha nutrition scaling is unchanged and build versions are aligned',()=>{
 const bread=FOOD_PRESETS.find(x=>x.id==='dark-bread-butter');
 assert.deepEqual(nutritionKcalEstimate(bread,'2 Scheiben'),{low:280,high:520,kind:'Schätzung'});
 const root=JSON.parse(readFileSync(new URL('../package.json',import.meta.url)));
 const client=JSON.parse(readFileSync(new URL('../client/package.json',import.meta.url)));
 assert.equal(root.version,'0.5.77.11');assert.equal(client.version,root.version);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.11'/);
});
