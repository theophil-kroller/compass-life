import {PROTEIN_CUP_FOODS_155} from '../client/src/food-protein-cups-v059155.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry,PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {PLANT_FOODS_149,PLANT_DD_149,plantPortion149} from '../client/src/food-plants-v059149.js';
import {foodCategory148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const s=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const foods=nutritionFoods(s()),get=id=>foods.find(x=>x.id===id);
const entry=(foodId,amount,id=foodId)=>({id,foodId,amount,at:'2026-11-15T12:00:00'});
const nearly=(got,want,eps=.08)=>assert.ok(Math.abs(got-want)<=eps,`${got} != ${want}`);
test('every v0.5.91.48 product survives; original banana has exactly one matching ID',()=>{
 const before=JSON.parse(readFileSync(new URL('./fixtures/food-presets-059148-ids.json',import.meta.url),'utf8'));
 for(const old of before)assert.ok(get(old),`Lost existing product ${old}`);
 assert.equal(foods.length,new Set(foods.map(x=>x.id)).size,'no duplicate IDs');
 assert.equal(foods.filter(x=>x.id==='banana').length,1,'reuse banana, do not duplicate');
 assert.equal(PLANT_FOODS_149.length,13);
 assert.equal(foods.length,before.length+PLANT_FOODS_149.length+PROTEIN_CUP_FOODS_155.length);
 assert.equal(get('banana').defaultAmount,'1 Stück (120 g essbar)');
});
test('all 13 new presets show in existing food menu/search/categories with macro, micro sources',()=>{
 const html=nutritionQuickView(s());
 for(const f of PLANT_FOODS_149){
  const found=get(f.id);assert.ok(found);assert.ok(PRODUCT_PROFILES[f.id]);
  assert.ok(html.includes(`data-action="pj92-food-tap" data-id="${f.id}"`),f.id);
  assert.ok(foodSearch148(found).includes(f.id));
  assert.ok(['meals','vegetables','fruitnuts','drinks'].includes(foodCategory148(found)));
  assert.ok(typeof PRODUCT_PROFILES[f.id].nutrients.kcal==='number');
  assert.ok(f.id==='calpis-kyohou-grape-diluted-20261115'||typeof PRODUCT_PROFILES[f.id].nutrients.protein==='number');
 }
});
test('Calpis label uses drink after 5:1 dilution, 150 ml, no invented vitamins',()=>{
 const id='calpis-kyohou-grape-diluted-20261115',f=get(id);
 assert.equal(foodCategory148(f),'drinks');
 nearly(nutritionKcalEstimate(f,'1 Glas').low,74,.51);
 nearly(nutrientEntry(f,entry(id,'1 Glas')).values.sugar,16.5);
 nearly(nutrientEntry(f,entry(id,'300 ml')).values.kcal,147);
 assert.equal(nutrientEntry(f,entry(id,'1 Glas')).values.vitaminC,undefined);
 assert.equal(nutrientEntry(f,entry(id,'1 Glas')).values.protein,undefined,'<0.5 g label is not exact zero');
 assert.equal(plantPortion149(id,'1 Glas').unit,'ml');
 assert.equal(plantPortion149(id,'150 g'),null);
});
test('halved pomelo, whole pomelo, weighed fruit, vegetables and dry spaghetti portions',()=>{
 const p='pomelo-fresh-20261115';
 nearly(plantPortion149(p,'½ Pomelo').grams,250);
 nearly(plantPortion149(p,'1 Pomelo').grams,500);
 nearly(plantPortion149(p,'1 Stück').grams,500);
 nearly(plantPortion149(p,'1 ganze Pomelo').grams,500);
 nearly(plantPortion149(p,'halbe Pomelo').grams,250);
 nearly(plantPortion149(p,'1/2 Pomelo').grams,250);
 nearly(plantPortion149(p,'250 g').grams,250);
 nearly(plantPortion149('spelt-spaghetti-dry-20261115','200 g gekocht').grams,80);
 nearly(plantPortion149('spelt-spaghetti-dry-20261115','80 g trocken').grams,80);
 nearly(plantPortion149('broccoli-steamed-home-20261115','1 Brokkoli').grams,250);
 assert.equal(plantPortion149('calpis-kyohou-grape-diluted-20261115','150 ml Konzentrat'),null);
});
test('each entry scales calories, protein, fiber and micronutrients with weighed serving',()=>{
 for(const f of PLANT_FOODS_149.filter(x=>x.id!=='calpis-kyohou-grape-diluted-20261115')){
  const p=PRODUCT_PROFILES[f.id],n=nutrientEntry(get(f.id),entry(f.id,'200 g'));
  nearly(n.values.kcal,p.nutrients.kcal*2);
  nearly(n.values.protein,p.nutrients.protein*2);
  assert.ok(n.estimatedKeys.has('kcal'));
  assert.ok(Object.keys(n.values).some(x=>/vitamin|folate|calcium|potassium|magnesium/.test(x)),f.id);
  assert.equal(n.values.vitaminB12,undefined,'no fabricated B12 values');
 }
});
test('Greger DD credits broccoli, carrot, fruit; no counted Calpis or unverified whole grain',()=>{
 const data=s();data.nutritionJournal.entries=[
  entry('broccoli-steamed-home-20261115','160 g'),
  entry('carrot-raw-fresh-20261115','80 g'),
  entry('mango-fresh-20261115','1 Mango'),
  entry('spelt-spaghetti-dry-20261115','80 g'),
  entry('calpis-kyohou-grape-diluted-20261115','1 Glas')
 ];
 const model=dailyDozen5930(data,{day:'2026-11-15'});
 const by=Object.fromEntries(model.rows.map(x=>[x.id,x]));
 assert.ok(by.cruciferous.observed>=1);
 assert.ok(by.vegetables.observed>=1);
 assert.ok(by.fruits.observed>=1);
 assert.equal(by.wholegrains.observed,0);
 assert.equal(by.beverages.observed,0);
 const dd=dailyDozenSummary(data,'2026-11-15');
 assert.ok(dd.rows.find(x=>x.id==='cruciferous').count>=1);
 assert.ok(dd.rows.find(x=>x.id==='fruit').count>=1);
 const age=antiAgingEightModel(data,'2026-11-15');
 assert.equal(age.rows.find(x=>x.id==='greens').status,'observed');
 assert.equal(age.rows.find(x=>x.id==='nad').status,'unmeasurable');
});
