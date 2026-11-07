import test from 'node:test';
import assert from 'node:assert/strict';
import {PERSONAL_RECIPE_PRESETS,recipeSnapshot,personalRecipeParts,personalRecipeKcal,pumpkinSoupBatchFraction} from '../client/src/personal-recipes-v57737.js';
import {nutritionKcalEstimate,nutritionFoods} from '../client/src/personal-journal-v5692.js';
import {nutritionParts,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
const soup='muscat-pumpkin-soup-personal';
const day='2026-11-07';
const state=(foodId=soup, amount='1 Portion')=>({nutritionJournal:{entries:[{id:'s1',foodId,amount,at:'2026-11-07T12:00:00.000+01:00'}],customFoods:[]}});
function food(){return nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}}).find(x=>x.id===soup)}
test('soup is visible in normal meal presets as an editable personal recipe',()=>{
 const x=PERSONAL_RECIPE_PRESETS.find(x=>x.id===soup);
 assert.ok(x);assert.match(x.title,/Muskatkürbis/);assert.equal(x.group,'Mahlzeiten');assert.match(x.recipeNote,/editierbar/);
 assert.match(x.defaultAmount,/1\/3 Topf/);
 assert.ok(food());
});
test('user named ingredients are all present, no oil or meat invented',()=>{
 const parts=recipeSnapshot(soup);assert.equal(parts.length,10);
 assert.deepEqual(parts.map(x=>x.id),['pumpkin','potatoes','carrots','celery','garlic','ginger','nutmeg','chili-flakes','butter','vegetable-broth']);
});
test('one bowl is one third of pot; full pot is three bowls',()=>{
 const single=personalRecipeKcal(soup,null,'1 Portion'),whole=personalRecipeKcal(soup,null,'1 Topf');
 assert.ok(single.low>85&&single.low<200);
 assert.ok(Math.abs(whole.low-single.low*3)<=2);
 assert.equal(pumpkinSoupBatchFraction('1 Portion'),1/3);
 assert.equal(pumpkinSoupBatchFraction('2 Schüsseln'),2/3);
 assert.equal(pumpkinSoupBatchFraction('1/2 Topf'),.5);
 assert.equal(pumpkinSoupBatchFraction('½ Topf'),.5);
 assert.equal(pumpkinSoupBatchFraction('1 Topf'),1);
 assert.ok(Math.abs(pumpkinSoupBatchFraction('400 g')-400/1325)<1e-8);
 assert.equal(pumpkinSoupBatchFraction('0,5 Portion'),1/6);
});
test('invalid soup portions never default to an entire pot or bowl',()=>{
 for(const a of ['ein Topf','0 Portion','-2 Topf','99 Portionen','']){
  // Empty explicit entry remains an unknown amount, whereas a missing journal amount
  // can use the visible food.defaultAmount at rendering time.
  if(a==='')continue;
  assert.equal(pumpkinSoupBatchFraction(a),null,a);
  assert.equal(personalRecipeKcal(soup,null,a),null,a);
 }
});
test('batch edits change protein, calories, and micros for the same one-bowl journal entry',()=>{
 const rows=recipeSnapshot(soup); const edited=rows.map(x=>x.id==='butter'?{...x,grams:20,assumed:false}:x);
 const kcal0=personalRecipeKcal(soup,null,'1 Portion').low;
 const kcal1=personalRecipeKcal(soup,edited,'1 Portion').low;
 assert.ok(kcal1>kcal0+20&&kcal1<kcal0+30,{kcal0,kcal1});
 const f=food();const e={id:'x',foodId:soup,amount:'1 Portion',recipe:edited,at:'2026-11-07T12:00:00+01:00'};
 const details=nutrientEntry(f,e);
 assert.ok(details.knownKeys.has('vitaminA'));
 assert.ok(details.values.fat>3);
 assert.ok(Math.abs(details.values.kcal-kcal1)<=0.51);
});
test('soup is estimated and calorie estimate matches detail energy',()=>{
 const f=food(); const a=nutritionKcalEstimate(f,'1 Portion');
 const b=nutritionParts(soup,'1 Portion',f);
 assert.equal(a.low,Math.round(b.reduce((s,x)=>s+x.values.kcal,0)));
 assert.ok(b.some(x=>/Muskatkürbis/.test(x.name)));
 assert.ok(b.every(x=>x.estimatedKeys.length>0));
});
test('one bowl credits vegetable and spice parts but not potato as grain or soup as water',()=>{
 const e=dailyDozenIngredientEvidence404(state(),day);
 assert.ok(e.totals.vegetables>1.5&&e.totals.vegetables<3);
 assert.ok(e.totals.spices>0);
 assert.equal(e.totals.wholegrains,0);assert.equal(e.totals.beverages,0);
 assert.equal(e.totals.greens,0);
});
test('Daily Dozen scales only consumed fraction, not whole pot',()=>{
 const one=dailyDozenIngredientEvidence404(state(soup,'1 Portion'),day);
 const two=dailyDozenIngredientEvidence404(state(soup,'2 Schüsseln'),day);
 assert.equal(Math.round(two.totals.vegetables*100),Math.round(one.totals.vegetables*200));
});
test('anti-aging tracks estimated fiber without claiming postbiotics or longevity effects',()=>{
 const a=antiAgingEightModel(state(),day);
 const micro=a.rows.find(x=>x.id==='microbiome');
 assert.equal(micro.status,'partial');assert.match(micro.value,/Ballaststoffe/);
 assert.match(micro.reason,/weder|nicht/);
 assert.equal(a.rows.find(x=>x.id==='nad').status,'unmeasurable');
});
test('two package-specific Skyr profiles remain intact',()=>{
 const foods=nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}});
 const m=foods.find(x=>x.id==='milsani-skyr-maracuja-150g');
 const e=foods.find(x=>x.id==='ehrmann-high-protein-skyr-natural-450g');
 assert.ok(m&&e);assert.equal(nutritionKcalEstimate(m,'1 Becher').low,71);
 assert.equal(nutritionKcalEstimate(e,'1 Becher').low,230);
});
