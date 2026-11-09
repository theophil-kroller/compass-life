import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutritionDay,nutritionParts} from '../client/src/nutrition-intelligence-v57712.js';
import {ALPRO_PUDDING_PACKAGES,parseAlproPuddingPortion,alproPuddingKcal} from '../client/src/alpro-pudding-serving-v059138.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {wholegrainBreadEvidence} from '../client/src/wholegrain-serving-v059138.js';
const DAY='2026-11-09';
const near=(a,b,eps=.02)=>assert.ok(Math.abs(a-b)<=eps,`${a} ≠ ${b}`);
const foods=nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}});
const food=id=>foods.find(x=>x.id===id);
const state=(id,amount)=>({nutritionJournal:{customFoods:[],entries:[{id:'one',foodId:id,at:DAY+'T12:00:00',amount,deleted:false}]}});
const van='alpro-plant-protein-vanilla-pudding-200g', choc='alpro-plant-protein-chocolate-pudding-200g';

test('Two separate 200g Alpro Plant Protein snack presets with label protein',()=>{
 for(const id of [van,choc]){assert.equal(foods.filter(x=>x.id===id).length,1);assert.equal(food(id).group,'Snacks');assert.equal(food(id).defaultAmount,'1 Becher (200 g)');}
 assert.equal(food(van).kcalLow,184);assert.equal(food(choc).kcalHigh,190);
 assert.equal(PRODUCT_PROFILES[van].nutrients.protein,10);assert.equal(PRODUCT_PROFILES[choc].nutrients.protein,10.2);
 assert.equal(PRODUCT_PROFILES[choc].nutrients.vitaminB12,undefined,'Chocolate B12 not declared');
 assert.equal(PRODUCT_PROFILES[van].nutrients.vitaminB12,.38);
});
test('Label nutrition scales for a single cup, half cup, two cups and grams',()=>{
 for(const id of [van,choc])for(const [amount,g] of [['1 Becher (200 g)',200],['0,5 Becher',100],['2 Becher',400],['150 g',150],['1 Packung',200]]){
  near(parseAlproPuddingPortion(id,amount).grams,g);
  const kcal=alproPuddingKcal(id,{grams:g});
  assert.equal(nutritionKcalEstimate(food(id),amount).low,kcal);
  near(nutritionParts(id,amount,food(id))[0].amount,g);
  near(nutritionDay(state(id,amount),DAY).totals.protein,g*ALPRO_PUDDING_PACKAGES[id].protein100/100);
 }
});
test('One vanilla and one chocolate cup total 374 kcal and 40.4g label protein',()=>{
 const s=state(van,'1 Becher');s.nutritionJournal.entries.push({id:'two',foodId:choc,at:DAY+'T13:00:00',amount:'1 Becher'});
 const m=nutritionDay(s,DAY);near(m.totals.kcal,374);near(m.totals.protein,40.4);near(m.totals.fiber,5.4);
 near(m.totals.calcium,480);near(m.totals.vitaminD,3);near(m.totals.vitaminB2,.84);near(m.totals.vitaminB12,.76);
 assert.equal(m.coverage.vitaminB12.unknown,1,'No zero B12 assigned to chocolate');
 assert.equal(dailyDozenSummary(s,DAY).rows.find(x=>x.id==='beans').count,0);
 assert.equal(dailyDozen5930(s,{day:DAY}).rows.find(x=>x.id==='legumes').observed,0);
 assert.match(antiAgingEightModel(s,DAY).rows.find(x=>x.id==='protein').value,/40[.,]4/);
});
test('Invalid or zero portions are rejected instead of silently converted to one cup',()=>{
 for(const id of [van,choc])for(const raw of ['nicht bekannt','0 Becher','-1 Becher','3000 g']){
  assert.equal(parseAlproPuddingPortion(id,raw),null);
  assert.equal(nutritionKcalEstimate(food(id),raw),null);
  assert.equal(nutritionParts(id,raw,food(id)).length,0);
 }
});
test('Wholegrain bread and toast map consistently in both Daily Dozen views',()=>{
 for(const id of ['wholegrain-bread-slice','wholegrain-toast-butter-jam','bio-kornbrot','dark-bread-butter','bread-cheese']){
  const s=state(id,'2 Scheiben (100 g)');
  const legacy=dailyDozenSummary(s,DAY).rows.find(x=>x.id==='wholegrains').count;
  const modern=dailyDozen5930(s,{day:DAY}).rows.find(x=>x.id==='wholegrains').observed;
  assert.equal(legacy,2,id);assert.equal(modern,2,id);
 }
 const g=state('wholegrain-bread-slice','100 g');assert.equal(dailyDozenSummary(g,DAY).rows.find(x=>x.id==='wholegrains').count,2);
});
test('Unverified generic/dark bread does not earn a wholegrain portion',()=>{
 for(const id of ['bread-unknown','dark-bread','happy-harvest-steinofen-kornspitz']){
  assert.equal(wholegrainBreadEvidence(id,'1 Scheibe'),null);
  assert.equal(dailyDozenIngredientEvidence404(state(id,'1 Scheibe'),DAY).totals.wholegrains,0);
 }
});
test('Explicitly confirmed wholegrain custom food credits one slice',()=>{
 const s=state('custom-bread','1 Scheibe');s.nutritionJournal.customFoods=[{id:'custom-bread',title:'Vollkornbrot Roggen',wholegrain:true}];
 assert.equal(dailyDozenSummary(s,DAY).rows.find(x=>x.id==='wholegrains').count,1);
 assert.equal(dailyDozen5930(s,{day:DAY}).rows.find(x=>x.id==='wholegrains').observed,1);
});
