import test from 'node:test';
import assert from 'node:assert/strict';
import {quickHabitSnapshot117,quickHabitDone117} from '../client/src/habit-daily-guard-v059117.js';
import {localPunch117,applyManualPunch117} from '../client/src/worktime-manual-v059117.js';
import {PERSONAL_RECIPE_IDS,PERSONAL_RECIPE_PRESETS,recipeSnapshot,personalRecipeParts,personalRecipeKcal} from '../client/src/personal-recipes-v57737.js';
import {nutritionFoods,nutritionKcalEstimate,timeEntries} from '../client/src/personal-journal-v5692.js';
import {nutritionDay,bioactiveDay} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import fs from 'node:fs';
const DAY='2026-11-03', POT='steamed-potatoes-sichuan-veg-personal', RICE='black-rice-cooked-personal';
const state=id=>({nutritionJournal:{entries:[{id:'one-'+id,foodId:id,at:DAY+'T14:00:00',amount:PERSONAL_RECIPE_PRESETS.find(x=>x.id===id).defaultAmount,recipe:recipeSnapshot(id)}],customFoods:[]}});
const work=()=>({quickWorktime:{sessions:[],activeStart:''},timeJournal:{entries:[],overrides:{}}});
const at='2026-11-04T15:00:00+01:00';

test('Makko-Ho day cache: legacy undated and yesterday checks cannot mark a new day complete',()=>{
 const today='2026-11-04',yesterday='2026-11-03';
 const legacy=quickHabitSnapshot117({doneToday:['hakka-5']},today);
 assert.deepEqual(legacy.doneToday,[]);assert.equal(quickHabitDone117(legacy,'hakka-5',today),false);
 const prior=quickHabitSnapshot117({doneDay:yesterday,doneToday:['hakka-5']},today);
 assert.deepEqual(prior.doneToday,[]);
 const current=quickHabitSnapshot117({doneDay:today,doneToday:['hakka-5','hakka-5']},today);
 assert.deepEqual(current.doneToday,['hakka-5']);assert.equal(quickHabitDone117(current,'hakka-5',today),true);
 assert.equal(quickHabitDone117(current,'hakka-5',yesterday),false);
});
test('Makko UI uses date-scoped locked cache and marks real finish without toggling off',()=>{
 const main=fs.readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(main,/quickHabitSnapshot117\(safe,localDate\(\)\)/);
 assert.match(main,/quickHabitDone117\(quickPublic,habitId,day\)/);
 assert.match(main,/onFinish:async session=>\{if\(!state\|\|session\?\.completed!==true\)return;/);
 assert.match(main,/setHabitDoneState\(st,'hakka-5',day,true,at\)/);
});
test('Manual punch: backdated open timer is not a fabricated completed session',()=>{
 const s=work(),now=new Date(at);
 const r=applyManualPunch117(s,{day:'2026-11-04',startTime:'08:15',now});
 assert.equal(r.mode,'running');assert.equal(s.quickWorktime.activeStart,localPunch117('2026-11-04','08:15'));
 assert.equal(timeEntries(s).length,0);
 assert.throws(()=>applyManualPunch117(s,{day:'2026-11-04',startTime:'09:00',now}),/Timer läuft/);
});
test('Manual punch: finished retrospective interval is editable through the standard journal',()=>{
 const s=work(),now=new Date(at);
 const r=applyManualPunch117(s,{day:'2026-11-04',startTime:'08:15',endTime:'12:00',now});
 assert.equal(r.mode,'completed');assert.equal(timeEntries(s).length,1);
 assert.equal(timeEntries(s)[0].source,'manual');assert.equal(timeEntries(s)[0].category,'work');
 assert.equal(s.quickWorktime.sessions.length,0);assert.equal(s.quickWorktime.activeStart,'');
 assert.throws(()=>applyManualPunch117(s,{day:'2026-11-04',startTime:'11:00',endTime:'13:00',now}),/überschneidet/);
});
test('Manual punch rejects future timestamps, bad spans, invalid DST day and unsafe category',()=>{
 const now=new Date(at);
 for(const v of [
  {day:'2026-11-05',startTime:'08:00'},
  {day:'2026-11-04',startTime:'20:00'},
  {day:'2026-11-04',startTime:'12:00',endTime:'11:00'},
  {day:'2026-11-04',startTime:'11:00',endTime:'12:00',category:'rest'},
 ])assert.throws(()=>applyManualPunch117(work(),{...v,now}));
 assert.throws(()=>localPunch117('2026-13-04','10:00'));
});
test('Two new meals are in existing menu, are not automatically logged, portions editable',()=>{
 for(const id of [POT,RICE]){
  assert.equal(PERSONAL_RECIPE_IDS.filter(x=>x===id).length,1);
  assert.equal(nutritionFoods(state(id)).filter(x=>x.id===id).length,1);
  assert.equal(PERSONAL_RECIPE_PRESETS.find(x=>x.id===id).group,'Mahlzeiten');
  assert.equal(personalRecipeKcal(id).low,nutritionKcalEstimate(PERSONAL_RECIPE_PRESETS.find(x=>x.id===id),PERSONAL_RECIPE_PRESETS.find(x=>x.id===id).defaultAmount).low);
 }
 assert.equal(personalRecipeKcal(POT).low,351);
 assert.equal(personalRecipeKcal(RICE).low,238);
 assert.ok(personalRecipeParts(POT).some(x=>/Ahornsirup/.test(x.name)));
 assert.ok(personalRecipeParts(POT).some(x=>/Sichuan/.test(x.name)));
 assert.ok(personalRecipeParts(POT).some(x=>/sellerie/i.test(x.name)));
 assert.equal(recipeSnapshot(POT).find(x=>x.id==='carrots').grams,150);
 assert.equal(recipeSnapshot(RICE).find(x=>x.id==='black-rice-cooked').grams,180);
 const r=recipeSnapshot(RICE);r[0].grams=90;assert.equal(personalRecipeKcal(RICE,r).low,119);
 const p=recipeSnapshot(POT);p.find(x=>x.id==='soy-sauce').grams=0;
 assert.ok(personalRecipeKcal(POT,p).low<351);
 assert.equal(nutritionFoods({nutritionJournal:{entries:[],customFoods:[]}}).filter(x=>[POT,RICE].includes(x.id)).length,2);
});
test('New meal macros + micros are generic estimated, not declared label tests; unknown not zero',()=>{
 for(const id of [POT,RICE]){
  const n=nutritionDay(state(id),DAY);
  assert.equal(n.entries.length,1);
  for(const k of ['kcal','carbs','protein','fat','fiber','potassium','magnesium','iron']){
   assert.ok(n.totals[k]>=0,`${id} ${k}`);assert.equal(n.coverage[k].estimated,1,`${id} ${k} generic estimate`);
  }
  assert.equal(n.coverage.vitaminB12.unknown,1);
  assert.equal(n.coverage.vitaminD.unknown,1);
 }
 const p=nutritionDay(state(POT),DAY);
 assert.ok(p.totals.vitaminA>1000);assert.ok(p.totals.salt>2);
});
test('Only ingredient-supported phytochemical categories are shown with unknown quantity',()=>{
 const rice=bioactiveDay(state(RICE),DAY);
 assert.equal(rice.find(x=>x.key==='anthocyanins-black-rice').known,0);
 assert.equal(rice.find(x=>x.key==='anthocyanins-black-rice').unknown,1);
 const potatoes=bioactiveDay(state(POT),DAY);
 for(const key of ['gingerols','capsaicinoids','sanshools']){
  const item=potatoes.find(x=>x.key===key);assert.ok(item,key);assert.equal(item.known,0);assert.ok(item.unknown>=1);
 }
});
test('Daily Dozen credits carrots/celery + spices and black wholegrain rice once only',()=>{
 const a=dailyDozenIngredientEvidence404(state(POT),DAY),b=dailyDozenIngredientEvidence404(state(RICE),DAY);
 assert.equal(a.totals.vegetables,190/80);
 assert.equal(a.totals.wholegrains,0);assert.equal(a.totals.beans,0);assert.equal(a.totals.spices,1);
 assert.ok(Math.abs(b.totals.wholegrains-1.8)<1e-9);
 assert.equal(b.totals.vegetables,0);
 const old=dailyDozenSummary(state(POT),DAY);
 assert.equal(old.rows.find(x=>x.id==='vegetables').count,2);
 assert.equal(old.rows.find(x=>x.id==='spices').count,1);
 const modern=dailyDozen5930(state(RICE),{day:DAY});
 assert.equal(modern.rows.find(x=>x.id==='wholegrains').observed,1.8);
 const oldRice=dailyDozenSummary(state(RICE),DAY);
 assert.equal(oldRice.rows.find(x=>x.id==='wholegrains').count,2);
});
test('Anti-Aging Eight uses logged protein/fiber but does not infer biomarkers',()=>{
 for(const id of [POT,RICE]){
  const m=antiAgingEightModel(state(id),DAY);
  assert.equal(m.rows.find(x=>x.id==='protein').status,'partial');
  assert.equal(m.rows.find(x=>x.id==='microbiome').status,'partial');
  assert.match(m.rows.find(x=>x.id==='microbiome').value,/Ballaststoffe/);
  assert.equal(m.rows.find(x=>x.id==='nad').status,'unmeasurable');
  assert.equal(m.rows.find(x=>x.id==='xeno').status,'unmeasurable');
 }
});
