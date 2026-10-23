import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOOD_PRESETS,addNutrition,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES,nutritionParts,nutritionDay,nutritionIntelligenceView} from '../client/src/nutrition-intelligence-v57712.js';
const day='2026-10-23',at='2026-10-23T12:00:00+02:00';
const state=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const id='supplement-bluebonnet-one-men';
test('Bluebonnet ONE for Men appears as an opt-in quick-capture supplement and not as a 40+ formula',()=>{
 const row=FOOD_PRESETS.find(f=>f.id===id);
 assert.ok(row);assert.equal(row.defaultAmount,'1 Kapsel');assert.equal(row.group,'Nahrungsergänzung');
 const html=nutritionQuickView(state());assert.match(html,/Bluebonnet ONE for Men/);
 assert.doesNotMatch(row.title,/40\+/);
 const prof=PRODUCT_PROFILES[id];assert.equal(prof.reference.amount,1);assert.equal(prof.reference.unit,'Kapseln');
 assert.match(prof.note,/332616/);
});
test('Daily nutrients use 1 capsule exact label values, extra blends with unspecified amounts do not add to nutrient totals',()=>{
 const s=state();let d=nutritionDay(s,day);assert.equal(d.entries.length,0);assert.equal(d.coverage.zinc.known,0);
 addNutrition(s,{foodId:id,at});d=nutritionDay(s,day);
 assert.equal(d.entries.length,1);
 for(const [key,val] of Object.entries({vitaminA:1050,vitaminC:90,vitaminD:20,vitaminE:15,vitaminK:20,vitaminB1:1.2,vitaminB2:1.3,niacin:16,vitaminB6:1.7,folate:667,vitaminB12:2.4,biotin:30,pantothenicAcid:5,calcium:50,iodine:150,magnesium:25,zinc:22,selenium:55,copper:0.9,manganese:2.3,chromium:35,molybdenum:45,potassium:5,choline:5,boron:1})){
  assert.equal(d.totals[key],val,key); assert.equal(d.coverage[key].known,1,key);
 }
 assert.equal(Object.keys(PRODUCT_PROFILES[id].nutrients).length,25);
 const p=nutritionParts(id,'1 Kapsel');assert.equal(p.length,1);
 assert.equal(p[0].extra.find(x=>x.key==='maleBlend').value,100);
 assert.equal(p[0].extra.find(x=>x.key==='ashwagandha').value,null);
 assert.equal(p[0].extra.find(x=>x.key==='enzymeBlend').value,5);
 assert.equal(d.coverage.kcal.known,0);
 assert.ok(!Object.hasOwn(d.totals,'kcal'));
});
test('Two explicitly logged capsules scale units without auto creating extra entries',()=>{
 const s=state();addNutrition(s,{foodId:id,amount:'2 Kapseln',at});const d=nutritionDay(s,day);
 assert.equal(d.entries.length,1);assert.equal(d.totals.zinc,44);assert.equal(d.totals.vitaminD,40);
 assert.equal(d.entries[0].parts[0].extra.find(x=>x.key==='maleBlend').value,200);
 assert.equal(nutritionParts(id,'2 Kapseln')[0].values.vitaminD,40);
});
test('FürstenMED is a separate product; no merged intake unless both are logged',()=>{
 const s=state();addNutrition(s,{foodId:id,at});assert.equal(nutritionDay(s,day).totals.selenium,55);
 addNutrition(s,{foodId:'supplement-fuerstenmed',at});assert.equal(nutritionDay(s,day).totals.selenium,67.5);
 assert.equal(nutritionDay(s,day).totals.zinc,24.5);
});
test('Macro nutrient icons are visible yet labels remain readable, and all new micros render in the day analysis',()=>{
 const s=state();addNutrition(s,{foodId:id,at});const html=nutritionIntelligenceView(s,{day,detail:id});
 for(const icon of ['⚡','🥚','🌾','🍬','🥑','🧈','🌿','🧂'])assert.ok(html.includes(icon));
 for(const word of ['Makronährstoffe','Vitamin A','Folat','Jod','Biotin','Chrom','Cholin','Advanced Male Health Blend','Brennnesselwurzel-Extrakt'])assert.ok(html.includes(word),word);
 assert.match(html,/aria-hidden="true"/);assert.match(html,/NIH-Produktetikett/);
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');assert.match(css,/ni712-nutrient-icon/);
});
