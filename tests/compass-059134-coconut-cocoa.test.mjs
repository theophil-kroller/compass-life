import test from 'node:test';
import assert from 'node:assert/strict';
import {
 DR_GOERG_COCONUT_MILK_ID as coco,COPAYA_RAW_COCOA_ID as cocoa,
 parseCoconutMilkPortion,parseRawCocoaPortion,labelledProductKcal
} from '../client/src/coconut-cocoa-serving-v059134.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutritionParts,nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const DAY='2026-11-07';
const foods=nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}});
const food=id=>foods.find(f=>f.id===id);
const near=(a,b,delta=.04)=>assert.ok(Math.abs(a-b)<=delta,`${a} vs ${b}`);
const state=(id,amount)=>({nutritionJournal:{entries:[{id:'observed',foodId:id,amount,at:'2026-11-07T12:00:00'}],customFoods:[]}});

test('Both products are distinct catalog entries with user-requested base portions',()=>{
 assert.ok(food(coco));assert.ok(food(cocoa));assert.equal(food(coco).group,'Zutaten');assert.equal(food(cocoa).group,'Zutaten');
 assert.equal(food(coco).defaultAmount,'100 ml');assert.match(food(cocoa).defaultAmount,/1 EL/);
 for(const id of [coco,cocoa])assert.equal(foods.filter(f=>f.id===id).length,1);
});
test('Coconut milk normalizes 100 ml portions, full 200 ml carton and fractions',()=>{
 for(const [raw,ml] of [['100 ml',100],['1 Portion',100],['0,5 Portion',50],['2 Portionen',200],['1 Packung',200],['0,5 Packung',100],['200 ml',200],['0,15 l',150]]){
  const q=parseCoconutMilkPortion(raw);near(q?.value,ml);
  const k=labelledProductKcal(coco,q);near(k,Math.round(ml*1.86));
  assert.equal(nutritionKcalEstimate(food(coco),raw)?.low,k);
  const parts=nutritionParts(coco,raw,food(coco));assert.equal(parts.length,1);near(parts[0].amount,ml);
  const day=nutritionDay(state(coco,raw),DAY);near(day.totals.kcal,ml*1.86,.5);
  near(day.totals.saturated,ml*.14);near(day.totals.fat,ml*.17);near(day.totals.protein,ml*.021);
 }
});
test('Cocoa level tablespoons are consistent with grams and proportional macros',()=>{
 for(const [raw,g] of [['1 EL',6],['0,5 EL',3],['2 EL',12],['3 EL',18],['1 TL',2],['6 g',6],['15 g',15]]){
  const q=parseRawCocoaPortion(raw);near(q?.value,g);
  const k=labelledProductKcal(cocoa,q);near(k,Math.round(g*3.30));
  assert.equal(nutritionKcalEstimate(food(cocoa),raw)?.low,k);
  const p=nutritionParts(cocoa,raw,food(cocoa));assert.equal(p.length,1);near(p[0].amount,g);
  const day=nutritionDay(state(cocoa,raw),DAY);near(day.totals.protein,g*.281);
  near(day.totals.fat,g*.11);near(day.totals.sugar,g*.003);
 }
});
test('Descriptive spoon default uses EL rather than double counting parenthesized grams',()=>{
 assert.equal(parseRawCocoaPortion('',food(cocoa).defaultAmount).value,6);
 assert.equal(nutritionKcalEstimate(food(cocoa),'').low,20);
 assert.equal(nutritionParts(cocoa,'',food(cocoa))[0].amount,6);
});
test('Unknown, invalid and zero amounts stay unknown, not one default serving',()=>{
 for(const id of [coco,cocoa])for(const raw of ['ein Esslöffel','0 EL','0 ml','-10 ml','nicht bekannt','7000 ml','2000 g']){
  assert.equal(nutritionKcalEstimate(food(id),raw),null,`${id}: ${raw}`);
  assert.equal(nutritionParts(id,raw,food(id)).length,0,`${id}: ${raw}`);
 }
});
test('Original manufacturer macro values are preserved separately from estimates',()=>{
 const c=PRODUCT_PROFILES[coco],a=PRODUCT_PROFILES[cocoa];
 assert.equal(c.reference.unit,'ml');assert.equal(c.nutrients.kcal,186);
 assert.equal(c.nutrients.fat,17);assert.equal(c.nutrients.saturated,14);
 assert.equal(c.nutrients.carbs,5.8);assert.equal(c.nutrients.protein,2.1);
 assert.equal(a.reference.unit,'g');assert.equal(a.nutrients.kcal,330);assert.equal(a.nutrients.protein,28.1);
 assert.equal(a.nutrients.fat,11);assert.equal(a.nutrients.saturated,6.9);
 assert.equal(a.nutrients.carbs,14);assert.equal(a.nutrients.sugar,0.3);
 for(const id of [coco,cocoa]){
  const p=PRODUCT_PROFILES[id];
  assert.ok(p.estimatedNutrients.includes('magnesium'));
  assert.ok(!p.estimatedNutrients.includes('kcal'));
  assert.ok(!p.estimatedNutrients.includes('protein'));
  const day=nutritionDay(state(id,food(id).defaultAmount),DAY);
  assert.equal(day.coverage.magnesium.estimated,1);
  assert.equal(day.coverage.protein.estimated,0);
  assert.equal(day.coverage.vitaminD.unknown,1);
 }
 assert.equal(nutritionDay(state(coco,'100 ml'),DAY).coverage.fiber.unknown,1);
 assert.equal(nutritionDay(state(cocoa,'1 EL'),DAY).coverage.fiber.estimated,1);
 assert.equal(a.extra.cocoaFlavanols.value,null);
 assert.equal(a.extra.caffeine.value,null);
});
test('Neither coconut milk nor cocoa automatically earns unsupported Daily Dozen portions',()=>{
 for(const id of [coco,cocoa]){
  const dd=dailyDozenIngredientEvidence404(state(id,food(id).defaultAmount),DAY);
  for(const key of ['nuts','beans','spices','beverages','fruit','berries','wholegrains'])near(dd.totals[key],0);
  const aa=antiAgingEightModel(state(id,food(id).defaultAmount),DAY);
  assert.equal(aa.rows.find(x=>x.id==='xeno').status,'unmeasurable');
  assert.equal(aa.rows.find(x=>x.id==='nad').status,'unmeasurable');
  assert.equal(aa.rows.find(x=>x.id==='nuts').status,'unknown');
 }
});
test('Adding products to catalog does not automatically log any consumption',()=>{
 const st={nutritionJournal:{entries:[],customFoods:[]}};
 assert.equal(nutritionDay(st,DAY).entries.length,0);
 assert.equal(antiAgingEightModel(st,DAY).rows.find(x=>x.id==='nuts').status,'unknown');
});
