import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionParts,bioactiveDay,nutritionDay,nutritionIntelligenceView,nutrientReferenceProgress,PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {DAILY_NRV,CAFFEINE_EFSA_ADULT_ORIENTATION_MG} from '../client/src/nutrition-reference-v57722.js';
import {addNutrition} from '../client/src/personal-journal-v5692.js';
const at='2026-10-23T12:00:00+02:00',day='2026-10-23';
const make=()=>({nutritionJournal:{entries:[],customFoods:[]}});
const put=(s,id,amount)=>addNutrition(s,{foodId:id,amount,at});
test('manufacturer confirmed MatchaTherapy 30+ has all five numeric minimums per 2 grams',()=>{
 const parts=nutritionParts('matcha-oat-plain','1 Becher (ca. 500 ml; 75 ml Hafermilch)');
 const powder=parts.find(x=>x.part==='Matchapulver');
 assert.equal(powder.amount,2);
 for(const [key,expected] of Object.entries({EGCG:60,EGC:30,EC:12,catechin:4,caffeine:56})){
  const item=powder.extra.find(x=>x.key===key);assert.equal(item?.value,expected);assert.equal(item?.mode,'minimum');
 }
 assert.equal(powder.extra.find(x=>x.key==='lTheanine').value,null);
 assert.equal(PRODUCT_PROFILES['matcha-powder'].reference.amount,1);
});
test('explicit matcha weight overrides normal 2g dose without changing oat milk',()=>{
 const p=nutritionParts('matcha','500 ml, 75 ml Hafermilch, 3 g Matcha');
 assert.equal(p[0].values.calcium,90);
 assert.equal(p[1].amount,3);
 assert.equal(p[1].extra.find(x=>x.key==='EGCG').value,90);
 assert.equal(p[2].values.kcal,21);
});
test('coffee and matcha combine caffeine, separating EFSA espresso estimates from matcha lower bounds',()=>{
 const s=make();put(s,'matcha-oat-plain');put(s,'oat-latte');put(s,'coffee');
 const x=bioactiveDay(s,day).find(x=>x.key==='caffeine');
 assert.equal(x.value,226); // matcha ≥56 + espresso ≈80 + filter ≈90
 assert.equal(x.known,3);assert.equal(x.minimum,1);assert.equal(x.estimated,2);
 assert.equal(CAFFEINE_EFSA_ADULT_ORIENTATION_MG,400);
 const html=nutritionIntelligenceView(s,{day});
 assert.match(html,/400 mg/);assert.match(html,/Sicherheitsorientierung/);
});
test('food micros come from a generic source while exact maker macro labels take priority',()=>{
 const apple=nutritionParts('apple','1 Stück')[0];
 assert.equal(apple.amount,182);assert.equal(apple.values.vitaminC,8.37);
 assert.equal(apple.values.kcal,94.64);
 assert.ok(apple.estimatedKeys.includes('vitaminC'));
 const cheddar=nutritionParts('cheddar','1 Scheibe')[0];
 assert.equal(cheddar.values.kcal,103.75);
 assert.equal(cheddar.values.calcium,177.5);
 assert.ok(cheddar.estimatedKeys.includes('calcium'));
 assert.ok(!cheddar.estimatedKeys.includes('kcal'));
 const nuts=nutritionParts('mixed-nuts','1 Handvoll')[0];
 assert.equal(nuts.values.kcal,194.7);
 assert.ok(nuts.values.magnesium>40);
 assert.equal(Object.hasOwn(nuts.values,'selenium'),false,'Paranuss-Selen darf nicht fälschlich als präzise gelten');
});
test('vitamin NRV bar keeps >100% visible and gives no misleading percent for folate DFE',()=>{
 assert.equal(DAILY_NRV.vitaminC,80);
 assert.equal(nutrientReferenceProgress('vitaminC',90).pct,113);
 assert.equal(nutrientReferenceProgress('folate',667),null);
 const s=make();put(s,'supplement-bluebonnet-one-men');
 const html=nutritionIntelligenceView(s,{day});
 assert.match(html,/113 % EU-NRV/);
 assert.match(html,/über Referenzwert/);
 assert.match(html,/weder persönlicher Bedarf noch sichere Obergrenze/);
});
test('unchanged data not treated as zero when no food is entered',()=>{
 const m=nutritionDay(make(),day);
 assert.equal(m.coverage.calcium.known,0);
 assert.equal(m.coverage.calcium.unknown,0);
 assert.doesNotMatch(nutritionIntelligenceView(make(),{day}),/0 % EU-NRV/);
});
