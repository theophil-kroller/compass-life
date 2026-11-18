import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {describeDeficit160,todayEnergyModel160,todayEnergyMarkup160} from '../client/src/today-energy-peek-v059160.js';
import {proteinTodayMarkup88} from '../client/src/coach-integration-v0588.js';
import {dayEnergyStatus} from '../client/src/energy-goal-v575.js';
import {nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
const DAY='2026-10-22',now=new Date('2026-10-22T14:00:00');
const energy={enabled:true,birthYear:1983,birthMonth:6,heightCm:185,formulaSex:'male',activity:'moderate',method:'auto',deficit:300};
const makeState=(calories=2100,{low=calories,high=calories,add=true}={})=>({
 healthImports:{fitdays:[{at:'2026-10-21T08:00:00Z',weightKg:80,bodyFatPct:20}],garminFitness:[]},
 nutritionJournal:{energyGoal:{...energy},proteinCoach88:{targetG:145},customFoods:[{id:'local-meal',title:'Testmahlzeit',group:'Eigene',defaultAmount:'1 Portion',kcalLow:low,kcalHigh:high,nutrientBasis:'perPortion',nutrients:{kcal:calories,protein:55}}],entries:add?[{id:'entry',foodId:'local-meal',at:'2026-10-22T12:00:00Z',amount:'1 Portion'}]:[]}
});
test('Exactly matches the energy estimates from the existing nutrition quick meter, not an invented budget',()=>{
 const s=makeState(),original=dayEnergyStatus(s,{now,foods:nutritionFoods(s),estimate:nutritionKcalEstimate}),m=todayEnergyModel160(s,DAY,{now});
 assert.equal(original.tdee,2700);assert.equal(m.tdee,original.tdee);assert.equal(m.target,original.target);
 assert.equal(m.intakeLow,original.low);assert.equal(m.intakeHigh,original.high);
 assert.equal(m.deficit,600);assert.equal(m.stage.label,'Ambitioniertes Abnahmeziel');
 const markup=todayEnergyMarkup160(s,DAY,{now});
 assert.match(markup,/2[.\s\u00a0]100 kcal erfasst/);assert.match(markup,/600 kcal Defizit/);assert.match(markup,/Ambitioniertes Abnahmeziel/);
 assert.match(markup,/Zwischenstand/);assert.match(markup,/Gesamtbedarf ≈ 2[.\s\u00a0]700 kcal/);
});
test('Protein meter is preserved with the new calorie line immediately after the existing protein footnote',()=>{
 const s=makeState();const html=proteinTodayMarkup88(s,DAY,{compact:true});
 assert.match(html,/55 g Protein erfasst/);assert.match(html,/ci125-protein-scale/);
 assert.match(html,/data-action="ci88-food-open"/);assert.match(html,/ci160-energy-peek/);
 assert.ok(html.indexOf('ci160-energy-peek')>html.indexOf('ci125-protein-scale'));
});
test('Ranges are shown as ranges, and cannot be silently flattened into exact values',()=>{
 const s=makeState(2100,{low:2000,high:2200}),m=todayEnergyModel160(s,DAY,{now}),html=todayEnergyMarkup160(s,DAY,{now});
 assert.equal(m.deficitLow,500);assert.equal(m.deficitHigh,700);
 assert.match(html,/2[.\s\u00a0]000–2[.\s\u00a0]200 kcal erfasst/);
 assert.match(html,/Defizitspanne 500–700 kcal/);
});
test('A high interim deficit is not called ideal or celebrated as permission to skip nutrition',()=>{
 const s=makeState(1750);const m=todayEnergyModel160(s,DAY,{now}),html=todayEnergyMarkup160(s,DAY,{now});
 assert.equal(m.deficit,950);assert.equal(m.stage.tone,'high');assert.match(html,/Sehr hohes rechnerisches Defizit/);
 assert.doesNotMatch(html,/nichts mehr essen|Mahlzeit auslassen|perfekt/i);
});
test('Above maintenance consumption is visibly signalled as surplus, independently of colour band',()=>{
 const m=todayEnergyModel160(makeState(2850),DAY,{now});
 assert.equal(m.deficit,-150);assert.equal(m.stage.tone,'over');
 assert.match(todayEnergyMarkup160(makeState(2850),DAY,{now}),/150 kcal Überschuss/);
});
test('Missing or unquantified kcal and disabled target never turn into fictitious deficits',()=>{
 const empty=makeState(2100,{add:false});assert.equal(todayEnergyModel160(empty,DAY,{now}).known,false);
 assert.match(todayEnergyMarkup160(empty,DAY,{now}),/Noch keine Kalorienaufnahme erfasst/);
 const waterOnly=makeState(0);assert.equal(todayEnergyModel160(waterOnly,DAY,{now}).known,false);
 assert.doesNotMatch(todayEnergyMarkup160(waterOnly,DAY,{now}),/Defizit/);
 const disabled=makeState();disabled.nutritionJournal.energyGoal.enabled=false;
 assert.equal(todayEnergyModel160(disabled,DAY,{now}).ready,false);
 assert.match(todayEnergyMarkup160(disabled,DAY,{now}),/Persönliches Energieziel/);
});
test('Historical day ignores future meals and observes date-scoped Fitdays data',()=>{
 const s=makeState();s.nutritionJournal.entries.push({id:'tomorrow',foodId:'local-meal',amount:'1 Portion',at:'2026-10-23T12:00:00Z'});
 const m=todayEnergyModel160(s,DAY,{now:new Date('2026-10-23T16:00:00')});
 assert.equal(m.intakeLow,2100);assert.equal(m.day,DAY);assert.equal(m.currentDay,false);
});
test('Pure read-only path, no extra Insights analysis and mobile overflow safety',()=>{
 const s=makeState(),before=JSON.stringify(s);todayEnergyMarkup160(s,DAY,{now});assert.equal(JSON.stringify(s),before);
 const modelSource=readFileSync(new URL('../client/src/today-energy-peek-v059160.js',import.meta.url),'utf8');
 assert.doesNotMatch(modelSource,/nutritionTrendsIndex|nutritionCoachOverview|localStorage|sessionStorage/);
 const css=readFileSync(new URL('../client/src/gtd-workspace-v57756.css',import.meta.url),'utf8');
 assert.match(css,/ci160-energy-peek/);assert.match(css,/overflow-wrap:anywhere/);assert.match(css,/max-width:100%/);
});
test('Deficit classification does not confuse small deficit with a surplus',()=>{
 assert.equal(describeDeficit160(0).tone,'maintain');assert.equal(describeDeficit160(300).tone,'gentle');
 assert.equal(describeDeficit160(500).tone,'moderate');assert.equal(describeDeficit160(700).tone,'ambitious');
 assert.equal(describeDeficit160(850).tone,'high');assert.equal(describeDeficit160(-200).tone,'over');
});
