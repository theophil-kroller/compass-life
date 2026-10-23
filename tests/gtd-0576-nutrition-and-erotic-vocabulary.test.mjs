import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOOD_PRESETS,addNutrition,nutritionQuickView,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {quickEnergyMeter} from '../client/src/nutrition-quick-meter-v576.js';
import {feelingFamilies,setFeelingDetail,FEELING_OBSERVATIONS} from '../client/src/feeling-depth-v5681.js';
import {findEmotionNetwork,toggleNetworkTerm,EMOTION_NETWORK_TERMS} from '../client/src/feeling-network-v5705.js';
import {newFeelingDraft,chooseFeeling,validatedCheckin,draftFromCheckin,feelingOverlay} from '../client/src/feeling-wheel-v565.js';
const NOW=new Date('2026-10-22T15:00:00Z');
const goal={enabled:true,birthYear:1983,birthMonth:6,heightCm:185,formulaSex:'male',method:'mifflin',activity:'moderate',deficit:300};
const state=()=>({healthImports:{fitdays:[{at:'2026-10-21T09:00:00Z',weightKg:80,bodyFatPct:20}]},nutritionJournal:{entries:[],customFoods:[],energyGoal:goal}});
test('0.5.76 three breakfast foods with sensible editable default portions',()=>{
 for(const [id,portion] of [['wholegrain-toast-butter-jam','1 Stück'],['fried-egg','1 Stück'],['dark-bread-butter','1 Scheibe (50 g) + Butter (10 g; geschätzt)']]){
  const f=FOOD_PRESETS.find(x=>x.id===id);assert.ok(f);assert.equal(f.group,'Frühstück');assert.equal(f.defaultAmount,portion);assert.ok(f.kcalLow>0&&f.kcalHigh>f.kcalLow);
  const s=state();const row=addNutrition(s,{foodId:id,at:NOW.toISOString()});assert.equal(row.amount,portion);
  const estimate=nutritionKcalEstimate(f,row.amount);assert.equal(estimate.low,f.kcalLow);
 }
 assert.deepEqual(nutritionKcalEstimate(FOOD_PRESETS.find(f=>f.id==='dark-bread-butter'),'2 Scheiben'),{low:404,high:428,kind:'Schätzung'});
 assert.match(nutritionQuickView(null),/Vollkorn-Toast/);
 assert.match(nutritionQuickView(null),/Bio Nur-Kornbrot mit Hofer Bio-Butter/);
});
test('0.5.76 early-day kcal band is transparent about missing data',()=>{
 const s=state();addNutrition(s,{foodId:'wholegrain-toast-butter-jam',at:'2026-10-22T06:30:00Z'});
 const html=quickEnergyMeter(s,{now:NOW});
 assert.match(html,/140–260 kcal/);assert.match(html,/Abnahmeziel/);assert.match(html,/Erhaltung/);assert.match(html,/keine<\/strong> bestätigte Tagesbilanz/);
 assert.match(html,/pj576-range/);assert.match(html,/pj576-energy-track/);
 const unknown=addNutrition(s,{foodId:'other-food',at:'2026-10-22T07:00:00Z'});
 assert.match(quickEnergyMeter(s,{now:NOW}),/1 ohne Schätzung/);
 assert.ok(unknown.id);
});
test('0.5.76 calorie indicator cannot infer target from locked or opt-out vault',()=>{
 assert.match(quickEnergyMeter(null),/Tresor entsperren/);
 const s=state();s.nutritionJournal.energyGoal={...goal,enabled:false};
 assert.match(quickEnergyMeter(s,{now:NOW}),/pj576-energy-track/);
 assert.match(quickEnergyMeter(s,{now:NOW}),/neutrale Referenzskala/);
 assert.match(quickEnergyMeter(s,{now:NOW}),/freiwillig aktivieren/);
});
test('0.5.76 stress context: only one scrollbar, quick goal near top and version',()=>{
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(css,/\.pj92-food-panel \.pj92-food-grid\{max-height:none;overflow:visible/);
 assert.match(main,/\$\{quickEnergyMeter\(state\)\}.*\$\{nutritionQuickView\(state\)\}/);
 const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 assert.ok(main.includes("const COMPASS_CLIENT_VERSION='"+pkg.version+"'"));
});
test('0.5.76 erotic vocabulary is available in affection family and captures chosen nuance',()=>{
 const family=feelingFamilies('affection').find(([key])=>key==='Erotik & Begehren');assert.ok(family);
 for(const w of ['Lustvoll','Sinnlich','Erotisch angezogen','Begehrend'])assert.ok(family[1].includes(w));
 let d=chooseFeeling(newFeelingDraft(),'affection');d=setFeelingDetail(d,'affection',{family:'Erotik & Begehren',nuance:'Lustvoll'});
 const checked=validatedCheckin(d,{id:'e4d1a4b1-81aa-45ad-9349-58ec00bbed62',at:NOW.toISOString()});assert.equal(checked.items[0].nuance,'Lustvoll');
 assert.deepEqual(draftFromCheckin(checked).details.affection,{family:'Erotik & Begehren',nuance:'Lustvoll'});
 assert.match(feelingOverlay(d,[]),/Erotik &amp; Begehren/);
 assert.match(feelingOverlay(d,[]),/fw576-erotic-shortcut/);
});
test('0.5.76 sexual desire is searchable but separate from physiology and impulse',()=>{
 for(const q of ['lust','begehren','erotisch']){
  const words=findEmotionNetwork(q,{limit:12}).words.map(x=>x.word);
  assert.ok(words.includes('Lustvoll'),q);
  assert.ok(words.includes('Sexuelle Lust'),q);
  assert.ok(words.includes('Sexuell erregt'),q);
 }
 const lust=EMOTION_NETWORK_TERMS.find(x=>x.word==='Lustvoll');const body=EMOTION_NETWORK_TERMS.find(x=>x.word==='Sexuell erregt');const impulse=EMOTION_NETWORK_TERMS.find(x=>x.word==='Sexuelle Lust');
 assert.equal(lust.root,'affection');assert.equal(lust.kind,'gefühl');assert.equal(body.kind,'körper');assert.equal(impulse.kind,'impuls');
 const d=toggleNetworkTerm(newFeelingDraft(),lust.id);assert.equal(d.selected.affection,5);assert.equal(d.details.affection.family,'Erotik & Begehren');
 assert.ok(FEELING_OBSERVATIONS.body.includes('Sexuell erregt'));
 assert.ok(FEELING_OBSERVATIONS.impulses.includes('Sexuelle Lust'));
});
