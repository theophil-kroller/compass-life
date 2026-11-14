import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nutritionFoods,nutritionQuickView,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutrientEntry,nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {foodCategory148,foodTags148,foodSearch148,FOOD_FILTERS_148} from '../client/src/food-menu-v059148.js';
import {FOODS_148,foodPortion148,RECIPE_EVIDENCE_148} from '../client/src/food-additions-v059148.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {vtaperProteinOptions145} from '../client/src/vtaper-nutrition-coach-v059144.js';
const state=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const foods=nutritionFoods(state());
const food=id=>foods.find(f=>f.id===id);
const oldIds=JSON.parse(readFileSync(new URL('./fixtures/food-presets-059147-ids.json',import.meta.url),'utf8'));
const ids=[...FOODS_148.map(f=>f.id)];
const entry=(id,amount)=>({foodId:id,amount,at:'2026-11-14T12:00:00',id:'e1'});
const close=(a,b)=>assert.ok(Math.abs(a-b)<0.04,`${a} should equal ${b}`);
test('no baseline product removed or renamed; all old saved entry IDs still resolve',()=>{
 const all=new Set(foods.map(f=>f.id));
 for(const id of oldIds)assert.ok(all.has(id),`missing previously existing ID ${id}`);
 assert.equal(all.size,foods.length,'no duplicated IDs');
 for(const id of ids)assert.equal(foods.filter(f=>f.id===id).length,1,`duplicate new food ${id}`);
});
test('taxonomy is a read-only view over every known food, including custom entries',()=>{
 const s=state();s.nutritionJournal.customFoods.push({id:'mine',emoji:'🥗',title:'Meine gespeicherte Speise',group:'Eigene',defaultAmount:'1 Portion'});
 const before=structuredClone(s),catalog=nutritionFoods(s);
 for(const f of catalog){assert.ok(FOOD_FILTERS_148.some(([key])=>key===foodCategory148(f)),`no category ${f.id}`); assert.ok(foodTags148(f).includes(foodCategory148(f)));}
 assert.deepEqual(s,before);
 assert.equal(foodCategory148(catalog.find(x=>x.id==='mine')),'other');
});
test('all food categories are searchable and include bread, protein dairy, BCAA and shakes',()=>{
 assert.equal(foodCategory148(food('hofer-laugenbreze-butter')),'bakery');
 assert.equal(foodCategory148(food('milsani-high-protein-pfirsich-maracuja-200g')),'dairy');
 assert.equal(foodCategory148(food('profuel-alphaminos-bcaa')),'sport');
 assert.ok(foodTags148(food('milsani-high-protein-pfirsich-maracuja-200g')).includes('protein'));
 assert.ok(foodSearch148(food('hofer-laugenbreze-butter')).includes('laugenbreze'));
 assert.ok(foodSearch148(food('profuel-alphaminos-bcaa')).includes('aminosauren'));
 const html=nutritionQuickView(state());
 for(const f of foods)assert.ok(html.includes(`data-action="pj92-food-tap" data-id="${f.id}"`),f.id);
 assert.ok(html.includes('data-pj148-search'));
 assert.ok(html.includes('data-pj148-filter="protein"'));
});
test('new whole Milsani cup uses exact label totals; other micros remain unknown',()=>{
 const id='milsani-high-protein-pfirsich-maracuja-200g';assert.equal(food(id).defaultAmount,'1 Becher (200 g)');
 close(nutrientEntry(food(id),entry(id,'1 Becher')).values.kcal,136);
 const v=nutrientEntry(food(id),entry(id,'1 Becher')).values;
 for(const [key,expected] of Object.entries({protein:24.8,carbs:7,sugar:6,fat:.8,saturated:.6,salt:.26}))close(v[key],expected);
 assert.equal(v.calcium,undefined);
 assert.equal(foodPortion148(id,'0,5 Becher').grams,100);
 assert.equal(nutritionKcalEstimate(food(id),'2 Becher').low,272);
 assert.ok(vtaperProteinOptions145(state()).find(x=>x.id===id),'new cup in V-Taper menu');
});
test('recipe input remains additive and gives proportional gram-based macros/micros',()=>{
 const cabbage='homemade_indian_lemon_red_cabbage_20261114',kimchi='homemade_red_cabbage_beet_kimchi_20261114';
 for(const [id,kcal,protein] of [[cabbage,58,1.5],[kimchi,34,1.3]]){
  assert.ok(PRODUCT_PROFILES[id]);assert.equal(food(id).defaultAmount,'100 g');
  close(nutritionKcalEstimate(food(id),'150 g').low,kcal*1.5);
  const totals=nutrientEntry(food(id),entry(id,'150 g'));
  close(totals.values.protein,protein*1.5);assert.ok(totals.values.vitaminC>0);
  assert.ok(totals.estimatedKeys.has('protein'));
  assert.equal(foodPortion148(id,'2 Beilagen').grams,200);
  for(const bad of ['0 g','-1 Portion','unclear','6000 g']){assert.equal(foodPortion148(id,bad),null);assert.equal(nutritionKcalEstimate(food(id),bad),null);}
  assert.ok(RECIPE_EVIDENCE_148[id].dailyDozen);
 }
 assert.equal(PRODUCT_PROFILES[kimchi].nutrients.salt,2.3);
 assert.equal(RECIPE_EVIDENCE_148[kimchi].metadata.fermentation.phMeasured,null);
});
test('kimchi carries conservative Daily Dozen data and no false probiotic credit',()=>{
 const s=state();s.nutritionJournal.entries=[entry('homemade_red_cabbage_beet_kimchi_20261114','100 g')];
 const d=dailyDozen5930(s,{day:'2026-11-14'});
 assert.equal(d.rows.find(r=>r.id==='cruciferous').observed,0,'no fake confirmed cabbage weight in kimchi');
 assert.ok(!PRODUCT_PROFILES['homemade_red_cabbage_beet_kimchi_20261114'].nutrients.probiotics);
});

// Additional photographed products. No warnings in the compact menu.
test('new whey shakes and raw peanuts use exact label macros and clear portions',()=>{
 for(const [id,portion,kcal,protein,category] of [
  ['all-stars-whey-iced-matcha-latte-30g','1 Portion',117,20,'sport'],
  ['nutrinorm-whey-deluxe-cookies-cream-30g','1 Portion',112,22.3,'sport'],
  ['golden-turtle-peanuts-raw-with-skin-500g','30 g',170.1,7.8,'fruitnuts']]){
  const f=food(id);assert.ok(f);assert.equal(foodCategory148(f),category);
  const n=nutrientEntry(f,entry(id,portion));close(n.values.protein,protein);
  close(n.values.kcal,category==='fruitnuts'?170.1:kcal);
  assert.ok(foodTags148(f).includes(category));
  assert.ok(foodSearch148(f).includes(category==='fruitnuts'?'erdnusse':'protein')||foodSearch148(f).includes('whey'));
  assert.equal(n.estimatedKeys.size,0);
  assert.ok(!/erhitzen|erhitzt|vor dem verzehr ausreichend/i.test(f.recipeNote||''),'no visible safety banner in menu');
 }
 close(nutrientEntry(food('all-stars-whey-iced-matcha-latte-30g'),entry('all-stars-whey-iced-matcha-latte-30g','15 g')).values.protein,10);
 close(nutrientEntry(food('nutrinorm-whey-deluxe-cookies-cream-30g'),entry('nutrinorm-whey-deluxe-cookies-cream-30g','2 Portionen')).values.protein,44.6);
 assert.equal(foodPortion148('golden-turtle-peanuts-raw-with-skin-500g','1 Handvoll').grams,30);
 assert.ok(vtaperProteinOptions145(state()).some(o=>o.id==='nutrinorm-whey-deluxe-cookies-cream-30g'));
});

test('house-baked muffin and cake use estimated portion values and remain searchable',()=>{
 const examples=[
  ['homemade-muffin-low-sugar-20261114',80,225,4],
  ['homemade-cake-slice-low-sugar-20261114',100,270,4]
 ];
 for(const [id,grams,kcal,protein] of examples){
  const f=food(id);assert.ok(f);assert.equal(foodCategory148(f),'sweets');
  assert.ok(foodSearch148(f).includes(id.includes('muffin')?'muffin':'kuchen'));
  assert.equal(foodPortion148(id,'1 Stück').grams,grams);
  assert.equal(foodPortion148(id,'0,5 Stück').grams,grams/2);
  close(nutritionKcalEstimate(f,'1 Stück').low,kcal);
  assert.equal(nutritionKcalEstimate(f,'0,5 Stück').high,Math.round(kcal/2));
  const values=nutrientEntry(f,entry(id,'1 Stück'));
  close(values.values.protein,protein);
  assert.ok(values.estimatedKeys.has('kcal'));
  assert.ok(values.estimatedKeys.has('protein'));
  assert.equal(values.values.vitaminC,undefined,'unknown micronutrients are not fabricated');
  assert.ok(!RECIPE_EVIDENCE_148[id],'no invented exact ingredients or recipe evidence');
  assert.equal(foodPortion148(id,'110 g').grams,110);
 }
});
