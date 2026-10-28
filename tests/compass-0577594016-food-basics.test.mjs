import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOOD_PRESETS,nutritionFoods,addNutrition,nutritionQuickView,nutritionKcalEstimate,nutritionKcalSummary} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry,nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {nutritionTimingIndex,nutritionConsumptionKind} from '../client/src/nutrition-timing-v57725.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozenEvidence} from '../client/src/daily-dozen-auto-v57734.js';
import {dayEnergyStatus} from '../client/src/energy-goal-v575.js';
import {compass594016FoodBasicsRelease} from '../client/compass594016FoodBasicsRelease.js';
const day='2026-10-28';
const baseDate='2026-10-28T12:00:00';
const food=id=>FOOD_PRESETS.find(x=>x.id===id);
const entry=(id,amount=food(id)?.defaultAmount,at=baseDate)=>({id:id+'_'+amount,foodId:id,amount,at});
function st(entries=[]){return {nutritionJournal:{entries,customFoods:[]}};}
test('Two durable image/name/amount tiles in existing quick-capture menu (no special one-off button)',()=>{
 const cake=food('apple-shortcrust-cake'),water=food('water-glass');
 assert.equal(cake.title,'Apfelkuchen mit Mürbteig');assert.equal(cake.emoji,'🍰');assert.equal(cake.group,'Snacks');
 assert.match(cake.defaultAmount,/125 g/);assert.equal(water.title,'Wasser');assert.equal(water.emoji,'💧');
 assert.equal(water.group,'Getränke');assert.equal(water.defaultAmount,'1 Glas (250 ml)');
 assert.equal(FOOD_PRESETS.filter(f=>f.id===cake.id).length,1);assert.equal(FOOD_PRESETS.filter(f=>f.id===water.id).length,1);
 const html=nutritionQuickView(st());assert.match(html,/data-action="pj92-food-tap" data-id="apple-shortcrust-cake"/);
 assert.match(html,/data-action="pj92-food-tap" data-id="water-glass"/);
 assert.ok(!html.includes('Gestern mit Uhrzeit nachtragen'));
});
test('Cake kcal range and macro estimate align with BLS and editable grams/pieces',()=>{
 const cake=food('apple-shortcrust-cake');
 assert.deepEqual(nutritionKcalEstimate(cake),{low:230,high:350,kind:'Schätzung'});
 assert.equal(nutritionKcalEstimate(cake,'2 Stück').low,460);
 assert.equal(nutritionKcalEstimate(cake,'250 g').high,700);
 const one=nutrientEntry(cake,entry(cake.id)),two=nutrientEntry(cake,entry(cake.id,'2 Stück')),weighted=nutrientEntry(cake,entry(cake.id,'100 g'));
 assert.equal(one.values.kcal,273.75);assert.equal(two.values.kcal,547.5);assert.equal(weighted.values.kcal,219);
 assert.equal(one.values.protein,4.63);assert.equal(one.values.carbs,34.25);assert.ok(one.estimatedKeys.has('kcal'));
 assert.ok(!one.knownKeys.has('calcium'),'Unknown micros must stay unknown');
});
test('Zero-kcal water is a real known 0, not an unknown nor a meal in fasting plots',()=>{
 const water=food('water-glass');
 assert.deepEqual(nutritionKcalEstimate(water),{low:0,high:0,kind:'Trinkwasser ohne Zusätze'});
 assert.deepEqual(nutritionKcalEstimate(water,'2 Gläser'),{low:0,high:0,kind:'Trinkwasser ohne Zusätze'});
 for(const amount of ['1 Glas (250 ml)','2 Gläser','500 ml','0,5 l']){
  const n=nutrientEntry(water,entry(water.id,amount));
  assert.equal(n.values.kcal,0);assert(n.knownKeys.has('kcal'));assert(!n.knownKeys.has('calcium'));
 }
 const s=st([entry('water-glass')]);
 assert.equal(nutritionKcalSummary(s,1,new Date('2026-10-28T17:00:00')).known,1);
 const index=nutritionTimingIndex(s);
 const item=index.days.get(day).events.values().next().value;
 assert.equal(item.consumptionKind,'drink');assert.equal(item.kcal,0);assert.equal(item.caloric,false);
 assert.equal(nutritionConsumptionKind(water),'drink');
 const d=nutritionDay(s,day);assert.equal(d.totals.kcal,0);assert.equal(d.coverage.kcal.unknown,0);
 const goal=dayEnergyStatus(s,{now:new Date('2026-10-28T17:00:00'),foods:nutritionFoods(s),estimate:nutritionKcalEstimate});
 assert.equal(goal.known,1);assert.equal(goal.unknown,0);
});
test('Glas Wasser contributes to Daily Dozen beverage evidence but cake does not count as fresh apple',()=>{
 const s=st([entry('water-glass'),entry('apple-shortcrust-cake')]);
 const x=dailyDozenIngredientEvidence404(s,day);
 assert.ok(Math.abs(x.totals.beverages-250/350)<.00001);
 assert.equal(x.totals.fruit,0);
 const old=dailyDozenEvidence(s,day);assert.equal(old.totals.beverages,1);assert.equal(old.totals.fruit,0);
});
test('Repeated tap entries preserve independent IDs and timestamps, no migration',()=>{
 const s=st();
 const one=addNutrition(s,{foodId:'water-glass',at:'2026-10-28T09:00:00Z'});
 const two=addNutrition(s,{foodId:'water-glass',at:'2026-10-28T13:00:00Z'});
 const cake=addNutrition(s,{foodId:'apple-shortcrust-cake',at:'2026-10-28T14:00:00Z'});
 assert.notEqual(one.id,two.id);assert.equal(s.nutritionJournal.entries.length,3);
 assert.equal(one.amount,'1 Glas (250 ml)');assert.equal(cake.amount,'1 Stück (125 g)');
});
test('Version transform is chained after .40.15 release',()=>{
 const p=compass594016FoodBasicsRelease();
 const main=p.transform("const COMPASS_CLIENT_VERSION='0.5.77.59.40.15';\nBuild 0.5.77.59.40.15",'/repo/client/src/main.js').code;
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.16'/);
 assert.match(p.transform('Build 0.5.77.59.40.15','/repo/client/src/ars-vivendi-lock-v5775922.js').code,/\.40\.16/);
 const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(config,/compassConfig\.plugins\.push\(compass594015SmoothieEnergyRelease\(\)\);\s*compassConfig\.plugins\.push\(compass594016FoodBasicsRelease\(\)\);/);
});
