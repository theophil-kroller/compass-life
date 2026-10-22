import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ageFromMonth,energyGoalSettings,latestBodyRecord,inferActivity,restingEnergy,personalEnergyEstimate,dayEnergyStatus,energyGoalView} from '../client/src/energy-goal-v575.js';
import {addNutrition,FOOD_PRESETS,mergeJournalData,nutritionKcalEstimate,nutritionInsightsView} from '../client/src/personal-journal-v5692.js';
const NOW=new Date('2026-10-22T14:00:00Z');
const profile={enabled:true,birthYear:1983,birthMonth:6,heightCm:185,formulaSex:'male',activity:'moderate',method:'auto',deficit:300,updatedAt:'2026-10-22T10:00:00Z'};
const state=()=>({healthImports:{fitdays:[{at:'2026-10-21T08:00:00Z',weightKg:80,bodyFatPct:20}],garminFitness:[]},nutritionJournal:{entries:[],customFoods:[],energyGoal:profile}});
test('age year/month and exact supported reference formula',()=>{
 assert.equal(ageFromMonth(1983,6,NOW),43);assert.equal(ageFromMonth(1983,12,NOW),42);
 assert.equal(restingEnergy({weightKg:80,heightCm:185,age:43,formulaSex:'male'}).kcal,1746.25);
 assert.equal(restingEnergy({weightKg:80,heightCm:185,age:43,formulaSex:'female'}).kcal,1580.25);
 assert.ok(Math.abs(restingEnergy({weightKg:80,fatMassKg:16}).kcal-1673.8)<.01);
 assert.equal(restingEnergy({weightKg:80,heightCm:185,age:43,formulaSex:''}),null);
});
test('uses actual latest Fitdays weight; invalid and future records excluded',()=>{
 const body=latestBodyRecord({fitdays:[{at:'2026-10-11T10:00:00Z',weightKg:70,bodyFatPct:24},{at:'2026-10-21T10:00:00Z',weightKg:80,fatMassKg:17},{at:'2026-10-25T10:00:00Z',weightKg:100} ]},NOW);
 assert.equal(body.weightKg,80);assert.equal(body.fatMassKg,17);
 assert.equal(latestBodyRecord({},NOW),null);
});
test('automatic activity requires coverage; no double count with sessions',()=>{
 const days=Array.from({length:14},(_,i)=>({day:`2026-10-${String(i+1).padStart(2,'0')}`,steps:9000}));
 const info=inferActivity({garminFitness:days,garminSessions:[{id:'a',start:'2026-10-18T12:00:00Z',durationMinutes:200}]},NOW);
 assert.equal(info.category,'moderate');assert.equal(info.basis,'Schritte (Garmin)');assert.equal(info.pal,1.55);
 assert.equal(inferActivity({},NOW),null);
 const training=inferActivity({garminSessions:[{id:'1',start:'2026-10-18T12:00:00Z',durationMinutes:280},{id:'2',start:'2026-10-20T12:00:00Z',durationMinutes:400}]},NOW);
 assert.equal(training.category,'moderate');
});
test('default auto uses physiologically complete Mifflin; FFM fallback without demographic data',()=>{
 const s=state(),m=personalEnergyEstimate(s,NOW);assert.equal(m.resting.method,'Mifflin–St. Jeor');assert.equal(m.ready,true);assert.equal(m.tdee,2700);assert.equal(m.target,2400);
 s.nutritionJournal.energyGoal={...profile,birthYear:null,heightCm:null,formulaSex:''};
 assert.equal(personalEnergyEstimate(s,NOW).resting.method,'Fettfreie Masse · Mifflin et al.');
 s.healthImports.fitdays=[{at:'2026-04-10T08:00:00Z',weightKg:80,bodyFatPct:20}];assert.equal(personalEnergyEstimate(s,NOW).ready,false);
});
test('warnings use kcal ranges and never treat missing foods as zero',()=>{
 const s=state(),foods=FOOD_PRESETS;
 for(let i=0;i<3;i++)addNutrition(s,{foodId:'pringles',at:'2026-10-22T12:00:00Z',id:'p'+i});
 const status=dayEnergyStatus(s,{now:NOW,foods,estimate:nutritionKcalEstimate});
 assert.equal(status.status,'over');assert.equal(status.known,3);assert.equal(status.unknown,0);assert.ok(status.low>status.target);
 addNutrition(s,{foodId:'other-food',at:'2026-10-22T13:00:00Z',id:'unknown'});
 assert.equal(dayEnergyStatus(s,{now:NOW,foods,estimate:nutritionKcalEstimate}).unknown,1);
 const pane=energyGoalView(s,{now:NOW,foods,estimate:nutritionKcalEstimate});assert.match(pane,/Persönliches Energieziel/);assert.match(pane,/überschreitet/);assert.match(pane,/nicht erfasste Mahlzeiten/);
 assert.match(nutritionInsightsView(s,{period:30}),/Persönliches Energieziel/);
});
test('missing foods, disabled goal and uncertain overlap do not generate false alerts',()=>{
 const s=state(),foods=FOOD_PRESETS;
 s.nutritionJournal.energyGoal={...profile,enabled:false};
 addNutrition(s,{foodId:'pringles',at:'2026-10-22T11:00:00Z'});
 assert.equal(dayEnergyStatus(s,{now:NOW,foods,estimate:nutritionKcalEstimate}).status,'off');
 s.nutritionJournal.energyGoal={...profile,enabled:true};
 assert.equal(dayEnergyStatus(s,{now:NOW,foods,estimate:nutritionKcalEstimate}).status,'within-recorded');
 for(let i=0;i<2;i++)addNutrition(s,{foodId:'pringles',at:'2026-10-22T12:00:00Z',id:'z'+i});
 assert.equal(dayEnergyStatus(s,{now:NOW,foods,estimate:nutritionKcalEstimate}).status,'over');
});
test('profile sync is last-updated-wins; no device can erase a newer setting',()=>{
 const a={nutritionJournal:{energyGoal:{...profile,deficit:500,updatedAt:'2026-10-22T10:00:00Z'},entries:[],customFoods:[]}},b={nutritionJournal:{energyGoal:{...profile,deficit:300,updatedAt:'2026-10-22T11:00:00Z'},entries:[],customFoods:[]}};
 assert.equal(mergeJournalData(a,b).nutritionJournal.energyGoal.deficit,300);
 assert.equal(mergeJournalData(b,a).nutritionJournal.energyGoal.deficit,300);
 assert.equal(mergeJournalData(a,{}).nutritionJournal.energyGoal.deficit,500);
 assert.equal(mergeJournalData({},a).nutritionJournal.energyGoal.deficit,500);
 assert.equal(energyGoalSettings({enabled:true,birthYear:'lol',activity:'other'}).birthYear,null);
});
test('integration includes profile form and respects existing mirror and version',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.75'/);
 assert.match(main,/pj575-energy-form/);assert.match(main,/dayEnergyStatus\(state/);
 assert.match(main,/nutritionKcalEstimate/);assert.match(main,/nutritionJournal:copy\.nutritionJournal/);
 assert.doesNotMatch(main,/localStorage\.setItem\(['"]energyGoal/);
});
