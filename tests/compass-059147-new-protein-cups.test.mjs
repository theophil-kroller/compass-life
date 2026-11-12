import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutritionParts,nutritionDay} from '../client/src/nutrition-intelligence-v57712.js';
import {PROTEIN_CUPS_147,parseProteinCup147} from '../client/src/protein-cup-serving-v059147.js';
import {vtaperProteinOptions145} from '../client/src/vtaper-nutrition-coach-v059144.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';

const state=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const ids=['ehrmann-high-protein-vegan-chocolate-200g','spar-naturpur-bio-skyr-mango-maracuja-400g'];
const foodList=nutritionFoods(state());
const lookup=id=>foodList.find(f=>f.id===id);
const close=(a,b)=>assert.ok(Math.abs(a-b)<.011,`${a} != ${b}`);
const day='2026-11-12';
const dayState=(id,amount)=>({nutritionJournal:{entries:[{id:'e',foodId:id,amount,at:day+'T12:00:00',deleted:false}],customFoods:[]}});

test('each photographed product has exactly one catalog preset and the full container default',()=>{
 const [vegan,skyr]=ids;
 assert.deepEqual(ids.map(id=>foodList.filter(f=>f.id===id).length),[1,1]);
 assert.equal(lookup(vegan).defaultAmount,'1 Becher (200 g)');
 assert.equal(lookup(skyr).defaultAmount,'1 Becher (400 g)');
 assert.equal(lookup(vegan).kcalLow,150);assert.equal(lookup(skyr).kcalHigh,288);
 assert.equal(PROTEIN_CUPS_147[vegan].grams,200);assert.equal(PROTEIN_CUPS_147[skyr].grams,400);
});

test('one complete cup has the label values and the daily journal agrees with the kcal estimator',()=>{
 const expectations={
  [ids[0]]:{kcal:150,protein:20,carbs:5,sugar:.4,fat:5,saturated:4.2,fiber:2.6,salt:.5},
  [ids[1]]:{kcal:288,protein:36,carbs:33.6,sugar:26.4,salt:.4}
 };
 for(const id of ids){
  const est=nutritionKcalEstimate(lookup(id),'1 Becher');
  assert.equal(est.low,expectations[id].kcal);assert.equal(est.high,expectations[id].kcal);
  const actual=nutritionDay(dayState(id,'1 Becher'),day);
  for(const [key,val] of Object.entries(expectations[id]))close(actual.totals[key],val);
  assert.equal(actual.entries[0].parts[0].amount,PROTEIN_CUPS_147[id].grams);
 }
});

test('quantity parser uses separate cup sizes, fractions, grams, and refuses invalid amounts',()=>{
 for(const id of ids){
  const size=PROTEIN_CUPS_147[id].grams;
  for(const [str,g] of [['1 Becher',size],['1 Becher ('+size+' g)',size],['2 Becher',2*size],['0,5 Becher',size/2],['150 g',150]]){
   close(parseProteinCup147(id,str).grams,g);
   close(nutritionParts(id,str,lookup(id))[0].amount,g);
  }
  for(const invalid of ['0 Becher','-1 Becher','unbekannt','8000 g']){
   assert.equal(parseProteinCup147(id,invalid),null,`${id}: ${invalid}`);
   assert.equal(nutritionKcalEstimate(lookup(id),invalid),null);
   assert.deepEqual(nutritionParts(id,invalid,lookup(id)),[]);
  }
 }
});

test('skyr nutrient upper bounds and unlabeled micronutrients are not falsely written as exact zeros',()=>{
 const p=PRODUCT_PROFILES[ids[1]];
 for(const key of ['fat','saturated','fiber','calcium','vitaminB12','vitaminD'])assert.equal(p.nutrients[key],undefined,key);
 for(const key of ['fat','saturated','fiber'])assert.match(p.note,new RegExp(key==='fiber'?'Ballaststoffe':key==='fat'?'Fett':'gesättigte Fette'));
 assert.deepEqual(dailyDozen5930(dayState(ids[1],'1 Becher'),{day}).rows.find(x=>x.id==='fruit')?.observed??0,0);
});

test('both cups can be suggested from the existing V-Taper menu; nothing is logged automatically',()=>{
 const s=state(),copy=structuredClone(s),rec=vtaperProteinOptions145(s,{needed:35,budget:300});
 for(const id of ids){const r=rec.find(x=>x.id===id);assert.ok(r,id);assert.equal(r.kcal,id===ids[0]?150:288);assert.equal(r.protein,id===ids[0]?20:36);}
 assert.deepEqual(s,copy);
});
