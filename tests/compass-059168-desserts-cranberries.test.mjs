import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {foodPortion148} from '../client/src/food-additions-v059148.js';
import {foodCategory148,foodSearch148,foodTags148} from '../client/src/food-menu-v059148.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {BILLA_SAHNE_PUDDING_ID_168 as billa,NOEM_PRO20_VANILLA_ID_168 as noem,RAPUNZEL_CRANBERRY_ID_168 as cranberry,PACKAGED_168,PACKAGED_FOODS_168,PACKAGED_GRAMS_168,PACKAGED_PROFILES_168,packagedPortion168} from '../client/src/food-desserts-cranberries-v059168.js';
const day='2026-11-25';
const near=(a,b,tol=.02)=>assert.ok(Math.abs(a-b)<=tol,`${a} not near ${b}`);
const st=(id,amount,entryId='a')=>({nutritionJournal:{entries:[{id:entryId,foodId:id,amount,at:'2026-11-25T18:15:00'}],customFoods:[]}});
const find=id=>nutritionFoods({}).find(x=>x.id===id);

test('catalog has exactly one of each new product; originals and prior variants remain untouched',()=>{
 for(const id of [billa,noem,cranberry]){
  assert.equal(nutritionFoods({}).filter(x=>x.id===id).length,1);
  assert.ok(PRODUCT_PROFILES[id]);assert.ok(PACKAGED_PROFILES_168[id]);
 }
 assert.ok(find('noem-pro20-topfencreme-blueberry-cheesecake-235g'));
 assert.ok(find('billa-high-protein-griesspudding-zimt-500g'));
 assert.ok(find('rapunzel-cranberries-apple-concentrate-100g-20261125'));
 assert.equal(PACKAGED_FOODS_168.length,3);
});
test('default serving is the entire tub or the whole 100g package, never 100g for the cups',()=>{
 for(const [id,mass,kind] of [[billa,500,'Becher'],[noem,235,'Becher'],[cranberry,100,'Packung']]){
  assert.equal(PACKAGED_GRAMS_168[id],mass);
  assert.equal(find(id).defaultAmount,`1 ${kind} (${mass} g)`);
  near(packagedPortion168(id,find(id).defaultAmount).grams,mass,0.001);
  near(foodPortion148(id,'',find(id).defaultAmount).grams,mass,0.001);
 }
});
test('fractional containers, explicit grams, and multiple packages scale deterministically',()=>{
 for(const id of [billa,noem,cranberry]){
  const mass=PACKAGED_GRAMS_168[id],noun=id===cranberry?'Packung':'Becher';
  for(const [input,expected] of [[`1 ${noun}`,mass],[`0,5 ${noun}`,mass/2],[`½ ${noun}`,mass/2],[`2 ${noun}`,mass*2],['50 g',50],['100 Gramm',100]])near(foodPortion148(id,input).grams,expected,.001);
  for(const bad of ['-1 Becher','0 Becher','übermorgen','5001 g','1 Dose'])assert.equal(foodPortion148(id,bad),null,`${id}: ${bad}`);
 }
});
test('manufacturer macro labels calculate complete BILLA 500g cup, estimated micros marked',()=>{
 const food=find(billa),entry=st(billa,'1 Becher').nutritionJournal.entries[0],r=nutrientEntry(food,entry);
 for(const [k,val] of Object.entries({kcal:755,protein:13.5,carbs:75,sugar:60,fat:44,saturated:30,salt:.75})){
  near(r.values[k],val);assert.equal(r.estimatedKeys.has(k),false,k);
 }
 near(r.values.calcium,525);assert.ok(r.estimatedKeys.has('calcium'));
 assert.equal(r.knownKeys.has('fiber'),false,'fiber unknown, not 0');
 assert.equal(foodCategory148(food),'sweets');
 assert.match(foodSearch148(food),/sahnepudding/);
 near(nutritionKcalEstimate(food,'1 Becher').low,755);
});
test('NÖM vanilla is distinct from blueberry; 235g cup has 20g protein and bounded fat',()=>{
 const food=find(noem),entry=st(noem,'1 Becher').nutritionJournal.entries[0],r=nutrientEntry(food,entry);
 for(const [k,val] of Object.entries({kcal:112.8,protein:19.74,carbs:7.99,sugar:7.05,saturated:.235,salt:.235})){
  near(r.values[k],val);assert.equal(r.estimatedKeys.has(k),false,k);
 }
 near(r.values.fat,.5875);
 assert.ok(r.estimatedKeys.has('fat'));
 assert.equal(PACKAGED_168[noem].upperBounds.fat,.5);
 assert.equal(r.knownKeys.has('fiber'),false);
 near(r.values.calcium,246.75);assert.ok(r.estimatedKeys.has('calcium'));
 assert.equal(foodCategory148(food),'dairy');
 assert.ok(foodTags148(food).includes('protein'));
 assert.match(nutritionQuickView(st(noem,'1 Becher')),/Topfencreme/);
});
test('Rapunzel cranberries retain added apple-syrup sugars, do not invent micros',()=>{
 const food=find(cranberry),entry=st(cranberry,'1 Packung').nutritionJournal.entries[0],r=nutrientEntry(food,entry);
 for(const [k,val] of Object.entries({kcal:331,protein:.9,carbs:73,sugar:56,fat:.9,saturated:.1,fiber:5.8,salt:.04})){
  near(r.values[k],val);assert.equal(r.estimatedKeys.has(k),false,k);
 }
 near(r.values.magnesium,6);assert.ok(r.estimatedKeys.has('magnesium'));
 assert.equal(r.knownKeys.has('vitaminC'),false);
 assert.equal(foodCategory148(food),'fruitnuts');
 assert.match(food.recipeNote,/39 % Apfeldicksaft/);
 assert.match(food.recipeNote,/20\.02\.2026/);
});
test('Daily Dozen credits only 60% actual dried cranberries (1.5 berries portions) and no extra apple fruit',()=>{
 const state=st(cranberry,'1 Packung');
 const e=dailyDozenIngredientEvidence404(state,day);
 near(e.totals.berries,1.5);near(e.totals.fruit,0);
 assert.match(e.notes.berries.join(' '),/39 % Apfeldicksaft/);
 near(dailyDozenIngredientEvidence404(st(cranberry,'½ Packung'),day).totals.berries,.75);
 const progress=dailyDozen5930(state,{day});
 near(progress.rows.find(x=>x.id==='berries').observed,1);
 assert.equal(dailyDozenSummary(state,day).rows.find(x=>x.id==='berries').count,1);
 assert.equal(antiAgingEightModel(state,day).rows.find(x=>x.id==='berries').status,'observed');
});
test('dairy desserts do not become plant servings or high-protein health claims',()=>{
 for(const id of [billa,noem]){
  const s=st(id,'1 Becher');const e=dailyDozenIngredientEvidence404(s,day);
  for(const key of ['berries','fruit','beans','spices','wholegrains','nuts','vegetables','beverages'])near(e.totals[key],0);
  const aa=antiAgingEightModel(s,day);
  assert.equal(aa.rows.find(x=>x.id==='protein').status,'partial');
  assert.equal(aa.rows.find(x=>x.id==='nad').status,'unmeasurable');
 }
});
test('new menu catalog does not silently log today or change encrypted-vault persistence',()=>{
 assert.equal(({}.nutritionJournal?.entries||[]).length,0);
 assert.equal(nutritionFoods({}).filter(x=>[billa,noem,cranberry].includes(x.id)).length,3);
});
