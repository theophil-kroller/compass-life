import test from 'node:test';
import assert from 'node:assert/strict';
import {FOOD_PRESETS,nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutritionParts,nutrientEntry,nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
const ID='happy-harvest-steinofen-kornspitz';
const row=FOOD_PRESETS.find(f=>f.id===ID);
const state={nutritionJournal:{entries:[{id:'korn1',foodId:ID,amount:'1 Stück',at:'2026-11-01T12:15:00',deleted:false}],customFoods:[]}};

test('Kornspitz has one stable preset ID and piece-based default',()=>{
 assert.equal(FOOD_PRESETS.filter(f=>f.id===ID).length,1);
 assert.equal(nutritionFoods(state).filter(f=>f.id===ID).length,1);
 assert.equal(row.defaultAmount,'1 Stück');assert.equal(row.kcalLow,218);assert.equal(row.kcalHigh,218);
 assert.equal(row.group,'Snacks');
});
test('all photo-label nutrients stored per 100g; fiber remains absent',()=>{
 const p=PRODUCT_PROFILES[ID];assert.deepEqual(p.reference,{amount:100,unit:'g'});
 assert.deepEqual(p.nutrients,{kcal:290,fat:3.7,saturated:0.5,carbs:49,sugar:2,protein:11,salt:1.2});
 assert.ok(!Object.hasOwn(p.nutrients,'fiber'));
 assert.match(p.note,/Leinsamen/);assert.match(p.extra.allergens.note,/Sesam/);
});
test('one piece is 75g and 218kcal with 8.25g protein',()=>{
 const part=nutritionParts(ID,'1 Stück',row)[0];assert.equal(part.amount,75);assert.equal(part.unit,'g');
 assert.equal(part.values.kcal,217.5);assert.equal(part.values.protein,8.25);
 assert.equal(part.values.carbs,36.75);assert.equal(part.values.fat,2.78);assert.equal(part.values.salt,0.9);
 assert.deepEqual(nutritionKcalEstimate(row,'1 Stück'),{low:218,high:218,kind:'Verpackungsetikett · rechnerisch'});
});
test('two pieces and explicit grams scale consistently',()=>{
 const x=nutritionParts(ID,'2 Stück',row)[0];assert.equal(x.amount,150);assert.equal(x.values.kcal,435);assert.equal(x.values.protein,16.5);
 assert.deepEqual(nutritionKcalEstimate(row,'2 Stück'),{low:435,high:435,kind:'Verpackungsetikett · rechnerisch'});
 assert.equal(nutritionParts(ID,'100 g',row)[0].values.kcal,290);
 assert.equal(nutritionKcalEstimate(row,'100 g').low,290);
 assert.equal(nutritionParts(ID,'1 Stück (75 g)',row)[0].amount,75);
});
test('journal uses catalog to preserve protein and marks missing fiber unknown',()=>{
 const x=nutrientEntry(row,state.nutritionJournal.entries[0]);assert.equal(x.values.protein,8.25);
 assert.equal(x.values.fiber,undefined);
 const day=nutritionDay(state,'2026-11-01');assert.equal(day.totals.protein,8.25);assert.equal(day.coverage.fiber.unknown,1);
});
test('Kornspitz is not automatically credited as verified wholegrain',()=>{
 const m=dailyDozen5930(state,{day:'2026-11-01'});
 assert.equal(m.rows.find(x=>x.id==='wholegrains').observed,0);
});
test('existing breakfast and snack catalog entries are retained',()=>{
 for(const id of ['lyttos-pistachio-breakfast','lyttos-tahini-breakfast','kitkat-chunky-peanut-butter'])assert.ok(FOOD_PRESETS.some(f=>f.id===id));
});
