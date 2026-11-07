import test from 'node:test';
import assert from 'node:assert/strict';
import {SKYR_PACKAGES,parseSkyrPortion,skyrKcal} from '../client/src/skyr-serving-v059133.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutritionParts,nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const DAY='2026-11-07';
const IDS=Object.keys(SKYR_PACKAGES);
const foods=nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}});
const products=IDS.map(id=>foods.find(f=>f.id===id));
const near=(actual,expected,eps=.04)=>assert.ok(Math.abs(actual-expected)<eps,`${actual} ≠ ${expected}`);
const state=(id,amount)=>({nutritionJournal:{entries:[{id:'meal',foodId:id,amount,at:DAY+'T12:30:00',deleted:false}],customFoods:[]}});

test('Only two new distinct Skyr presets, default full cups, with original manufacturer macros',()=>{
 assert.equal(IDS.length,2);
 for(const f of products){assert.ok(f);assert.equal(foods.filter(x=>x.id===f.id).length,1);assert.equal(f.group,'Snacks');assert.match(f.defaultAmount,/1 Becher/)}
 assert.equal(products[0].defaultAmount,'1 Becher (150 g)');assert.equal(products[1].defaultAmount,'1 Becher (450 g)');
 assert.equal(products[0].kcalLow,71);assert.equal(products[1].kcalLow,230);
 near(PRODUCT_PROFILES[IDS[0]].nutrients.protein,8);near(PRODUCT_PROFILES[IDS[1]].nutrients.protein,9);
 assert.equal(PRODUCT_PROFILES[IDS[1]].nutrients.saturated,0.07);
});
test('One, half, two cups and explicit grams parse the same in Journal and Nutrition Insights',()=>{
 for(const [i,f] of products.entries())for(const [raw,g] of [
  [f.defaultAmount,SKYR_PACKAGES[f.id].grams],['1 Becher',SKYR_PACKAGES[f.id].grams],
  ['0,5 Becher',SKYR_PACKAGES[f.id].grams/2],['2 Becher',SKYR_PACKAGES[f.id].grams*2],
  ['100 g',100],['250 g',250],['1 Packung',SKYR_PACKAGES[f.id].grams]
 ]){
  const parsed=parseSkyrPortion(f.id,raw,f.defaultAmount);near(parsed.grams,g);
  const kcal=skyrKcal(f.id,parsed);
  const j=nutritionKcalEstimate(f,raw);assert.equal(j.low,kcal);assert.equal(j.high,kcal);
  const p=nutritionParts(f.id,raw,f);assert.equal(p.length,1);near(p[0].amount,g);
  const day=nutritionDay(state(f.id,raw),DAY);
  near(day.totals.protein,g*(i===0?8:9)/100);
  near(day.totals.carbs,g*(i===0?5.5:3.6)/100);
  near(day.totals.kcal,g*SKYR_PACKAGES[f.id].kcal100/100,.5);
 }
});
test('Unparseable and zero portion never silently fall back to a whole cup',()=>{
 for(const f of products)for(const bad of ['ein Becher','0 Becher','-1 Becher','nicht bekannt','6000 g']){
  assert.equal(parseSkyrPortion(f.id,bad,f.defaultAmount),null);
  assert.equal(nutritionKcalEstimate(f,bad),null);
  assert.equal(nutritionParts(f.id,bad,f).length,0);
  assert.equal(nutritionDay(state(f.id,bad),DAY).coverage.protein.unknown,1);
 }
});
test('Per-cup macros are label-derived, not claims of exact micro amounts',()=>{
 const a=nutritionDay(state(IDS[0],products[0].defaultAmount),DAY),b=nutritionDay(state(IDS[1],products[1].defaultAmount),DAY);
 near(a.totals.kcal,70.5);near(a.totals.protein,12);near(a.totals.carbs,8.25);near(a.totals.sugar,4.5);near(a.totals.salt,.15);
 near(b.totals.kcal,229.5);near(b.totals.protein,40.5);near(b.totals.carbs,16.2);near(b.totals.fat,.45);near(b.totals.salt,.45);
 for(const day of [a,b]){
  for(const n of ['calcium','phosphorus','potassium','magnesium','vitaminB2','vitaminB12','sodium']){
   assert.equal(day.coverage[n].known,1);assert.equal(day.coverage[n].estimated,1,n);
  }
  for(const n of ['vitaminD','iodine','fiber','vitaminC'])assert.equal(day.coverage[n].unknown,1,n);
  assert.equal(day.coverage.protein.estimated,0);
 }
 assert.equal(a.coverage.fat.estimated,1);assert.equal(b.coverage.fat.estimated,0);
 assert.match(PRODUCT_PROFILES[IDS[0]].note,/keine belegte Obstportion/);
});
test('Daily Dozen gives no dairy or flavour-only fruit credit; anti-aging only records protein',()=>{
 for(const f of products){
  const s=state(f.id,f.defaultAmount);
  const rows=dailyDozenSummary(s,DAY).rows;
  for(const id of ['fruit','berries','nuts','beans','beverages','wholegrains'])assert.equal(rows.find(x=>x.id===id)?.count,0,id);
  const aa=antiAgingEightModel(s,DAY);
  assert.equal(aa.rows.find(x=>x.id==='berries').status,'unknown');
  assert.equal(aa.rows.find(x=>x.id==='protein').status,'partial');
  assert.match(aa.rows.find(x=>x.id==='protein').value,/g Protein/);
 }
});
test('One food list without entries does not secretly log a meal or supplement',()=>{
 const state={nutritionJournal:{entries:[],customFoods:[]}};
 assert.equal(nutritionDay(state,DAY).entries.length,0);
 assert.equal(dailyDozenSummary(state,DAY).rows.find(x=>x.id==='fruit').count,0);
});
