import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry,PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {foodCategory148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {nutritionFoodGroup54} from '../client/src/nutrition-coach-v059152.js';
import {foodPortion148} from '../client/src/food-additions-v059148.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const id='realmix-ube-latte-stick-16g';
const data=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const food=nutritionFoods(data()).find(f=>f.id===id);
const entry=(amount='1 Stick')=>({id:'ube',foodId:id,amount,at:'2026-11-19T12:00:00'});
const close=(x,y,tol=.012)=>assert.ok(Math.abs(x-y)<tol,`got ${x}; expected ${y}`);
test('REALMIX exists exactly once as drink, is searchable and in quick food menu',()=>{
 assert.ok(food); assert.equal(nutritionFoods(data()).filter(f=>f.id===id).length,1);
 assert.equal(food.group,'Getränke'); assert.equal(foodCategory148(food),'drinks'); assert.equal(nutritionFoodGroup54(food),'drinks');
 assert.match(foodSearch148(food),/ube latte/); assert.match(nutritionQuickView(data()),/REALMIX Ube Latte/);
 assert.equal(food.defaultAmount,'1 Stick (16 g Pulver)');
});
test('photographed label per 100g correctly scaled to 16g; no invented micronutrients',()=>{
 const n=nutrientEntry(food,entry());const v=n.values;
 close(v.kcal,80.48);close(v.fat,4.32);close(v.saturated,4.16);close(v.carbs,10.56);
 close(v.sugar,8);close(v.protein,.48);close(v.fiber,.09);close(v.salt,.01);
 assert.equal(v.vitaminC,undefined);assert.equal(v.vitaminB12,undefined);
 assert.equal(v.potassium,undefined);assert.equal(v.calcium,undefined);assert.equal(v.iron,undefined);
 assert.deepEqual(PRODUCT_PROFILES[id].estimatedNutrients,[]);
 assert.match(PRODUCT_PROFILES[id].note,/unbekannt/);
 assert.equal(nutritionKcalEstimate(food,'1 Stick').low,80);
});
test('fractional and multiple sticks scale reliably while water is the preparation base',()=>{
 for(const [value,g] of [['1 Stick',16],['2 Sticks',32],['0,5 Stick',8],['½ Stick',8],['8 g',8],['1 Portion',16]]){
  close(foodPortion148(id,value).grams,g);close(nutritionKcalEstimate(food,value).low,Math.round(80.48*g/16));
  close(nutrientEntry(food,entry(value)).values.sugar,8*g/16);
 }
 assert.equal(foodPortion148(id,'Wasser'),null);
 assert.equal(foodPortion148(id,'-1 Stick'),null);
});
test('Daily Dozen no vegetable or unsweetened beverage credit; Anti-Aging Eight no credit',()=>{
 const s=data();s.nutritionJournal.entries=[entry()];
 const dozen=dailyDozen5930(s,{day:'2026-11-19'});
 const by=Object.fromEntries(dozen.rows.map(r=>[r.id,r.observed]));
 for(const key of ['vegetables','cruciferous','berries','fruits','beverages'])assert.equal(by[key],0,key);
 const evidence=dailyDozenIngredientEvidence404(s,'2026-11-19');
 assert.equal(evidence.totals.vegetables,0);assert.equal(evidence.totals.beverages,0);
 assert.match(evidence.notes.beverages.join(' '),/gezuckert/);
 const aging=antiAgingEightModel(s,'2026-11-19');
 assert.ok(aging.rows.every(r=>r.status!=='observed'));
});
