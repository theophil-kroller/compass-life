import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {foodPortion148,RECIPE_EVIDENCE_148} from '../client/src/food-additions-v059148.js';
import {foodCategory148,foodSearch148} from '../client/src/food-menu-v059148.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {ROESTI_TOAST_ID_165 as rid,RAW_CACAO_OAT_ID_165 as cid,ROESTI_165,RAW_CACAO_OAT_165,roestiToastPortion165,rawCacaoOatPortion165} from '../client/src/roesti-cocoa-v059165.js';
const day='2026-11-22';
const state=(id,amount)=>({nutritionJournal:{entries:[{id:'new',foodId:id,amount,at:'2026-11-22T12:00:00'}],customFoods:[]}});
const foods=nutritionFoods({});
const food=id=>foods.find(f=>f.id===id);
const near=(a,b,t=0.05)=>assert.ok(Math.abs(a-b)<t,`${a} != ~${b}`);
test('both products appear once in correct menus, searchable and in Quick View',()=>{
 for(const [id,category,word] of [[rid,'meals','rosti'],[cid,'drinks','rohkakao']]){
  assert.equal(foods.filter(f=>f.id===id).length,1);
  assert.equal(foodCategory148(food(id)),category);
  assert.match(foodSearch148(food(id)),new RegExp(word,'i'));
  assert.match(nutritionQuickView(state(id,food(id).defaultAmount)),id===rid?/Rösti-Toast/:/Rohkakao/);
 }
 assert.equal(food(rid).group,'Mahlzeiten');assert.equal(food(cid).group,'Getränke');
});
test('Rösti-Toast: pack 400g, standard piece 200g, original panel nutrition preserved',()=>{
 assert.equal(ROESTI_165.packGrams,400);assert.equal(ROESTI_165.piecesPerPack,2);
 assert.equal(ROESTI_165.pieceGrams,200);assert.equal(food(rid).defaultAmount,'1 Stück (200 g)');
 const result=nutrientEntry(food(rid),state(rid,'1 Stück').nutritionJournal.entries[0]);
 for(const [k,v] of Object.entries({kcal:455,protein:11,carbs:51,sugar:6.4,fat:22,saturated:7.8,salt:1.8})){
  near(result.values[k],v);assert.equal(result.estimatedKeys.has(k),false,k);
 }
 assert.equal(result.values.sodium,720);
 assert.equal(result.knownKeys.has('fiber'),false,'fiber not declared or estimated');
 for(const k of ['calcium','magnesium','potassium','iron','folate','vitaminB6','vitaminB12']){
  assert.ok(result.knownKeys.has(k),k);assert.ok(result.estimatedKeys.has(k),k);
 }
 assert.equal(result.knownKeys.has('vitaminD'),false);
 assert.equal(nutritionKcalEstimate(food(rid),'1 Stück').low,455);
 near(nutritionKcalEstimate(food(rid),'1 Packung').low,910);
 assert.equal(PRODUCT_PROFILES[rid].reference.amount,200);
});
test('Rösti amounts use 200g pieces, 400g pack and gram weights, never 2× default',()=>{
 for(const [s,g] of [['1 Stück',200],['2 Stücke',400],['1 Packung',400],['0,5 Packung',200],['½ Stück',100],['100 g',100],['1 Portion',200],['1 Stück (200 g)',200]]){
  assert.equal(roestiToastPortion165(s)?.grams,g,s);
  assert.equal(foodPortion148(rid,s)?.grams,g,s);
 }
 for(const s of ['0 Stück','-10 g','Toast','-1 Packung'])assert.equal(foodPortion148(rid,s),null,s);
});
test('raw cacao is chopped solid cacao with 200ml oat milk: one cup scales correctly',()=>{
 assert.equal(RAW_CACAO_OAT_165.cacaoGramsPerCup,8);
 assert.equal(RAW_CACAO_OAT_165.milkMlPerCup,200);
 assert.equal(RAW_CACAO_OAT_165.referenceGrams,208);
 for(const [s,g] of [['1 Tasse',208],['2 Tassen',416],['½ Tasse',104],['0,5 Tasse',104],['200 ml',208],['250 ml',260],['104 g',104]]){
  near(rawCacaoOatPortion165(s)?.grams,g);near(foodPortion148(cid,s)?.grams,g);
 }
 for(const s of ['-1 Tasse','0 Tassen','Kakao'])assert.equal(foodPortion148(cid,s),null,s);
 const n=nutrientEntry(food(cid),state(cid,'1 Tasse').nutritionJournal.entries[0]);
 for(const [k,v] of Object.entries(RAW_CACAO_OAT_165.nutrients)){
  near(n.values[k],v);assert.ok(n.estimatedKeys.has(k),k);
 }
 assert.equal(n.knownKeys.has('vitaminD'),false);
 assert.equal(n.knownKeys.has('vitaminB12'),false);
 assert.match(n.parts[0].note,/kakaomasse/i);
 near(nutritionKcalEstimate(food(cid),'2 Tassen').low,336);
 assert.equal(RECIPE_EVIDENCE_148[cid].ingredients[0].grams,8);
});
test('Daily Dozen: both no fabricated wholegrain, nuts, drinks or full berries; source notes',()=>{
 for(const id of [rid,cid]){
  const s=state(id,food(id).defaultAmount);
  const ev=dailyDozenIngredientEvidence404(s,day);
  for(const [k,v] of Object.entries(ev.totals))assert.equal(v,0,`${id} credits ${k}`);
  assert.equal(ev.nutGrams,0);assert.equal(ev.spiceGrams,0);
  const dd=dailyDozen5930(s,{day});
  assert.equal(dd.rows.reduce((sum,row)=>sum+row.observed,0),0);
  const aa=antiAgingEightModel(s,day);
  assert.equal(aa.rows.find(x=>x.id==='nuts').status,'unknown');
  assert.equal(aa.rows.find(x=>x.id==='xeno').status,'unmeasurable');
 }
 assert.match(dailyDozenIngredientEvidence404(state(rid,'1 Stück'),day).notes.berries.join(' '),/13 g/);
 assert.match(dailyDozenIngredientEvidence404(state(cid,'1 Tasse'),day).notes.wholegrains.join(' '),/Haferdrink/);
});
