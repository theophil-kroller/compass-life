import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {dailyDozen5930} from '../client/src/daily-dozen-v5775930.js';
import {dailyDozenSummary} from '../client/src/daily-dozen-v57733.js';
import {logMensaMeal} from '../client/src/mensa-journal-v57759402512.js';
import {nutritionCoachDashboard52,nutritionCoachOverview52,nutritionCoachAnalyze52} from '../client/src/nutrition-coach-v059152.js';
const at='2026-11-16T11:30:00.000Z',day='2026-11-16';
const offer={id:'mensa-stremayrgasse-study-2026-11-16',menuDate:day,venueId:'mensa-tu-graz-stremayrgasse',catalogVersion:1,title:'Frühlingsrolle',ingredientsNamedInMenu:['Indonesisches Wokgemüse','Basmatireis'],ingredientWeightsGrams:{'Frühlingsrolle':130,'Indonesisches Wokgemüse':210,'Basmatireis, gekocht':190},dailyDozenCandidateCategories:['vegetables','wholegrains'],nutrientEstimates:{energyKcal:{min:520,max:870}},evidence:{sourceType:'user_provided_official_menu_screenshot'}};
function sample(){return {mensaCatalog:{entries:[structuredClone(offer)]},nutritionJournal:{entries:[],customFoods:[]}};}
test('Study-Teller not eaten is never credited from menu alone',()=>{
 const s=sample(),d=dailyDozen5930(s,{day});assert.equal(d.rows.find(x=>x.id==='vegetables').observed,0);
});
test('consumed Wokgemüse earns quantified estimated vegetable evidence, ordinary Basmati no wholegrain',()=>{
 const s=sample();logMensaMeal(s,day,at);
 assert.equal(s.nutritionJournal.entries.length,1);
 assert.equal(s.nutritionJournal.entries[0].menuSnapshot.ingredientWeightsGrams['Indonesisches Wokgemüse'],210);
 const evidence=dailyDozenIngredientEvidence404(s,day);
 assert.ok(evidence.totals.vegetables>2.5);
 assert.equal(evidence.totals.wholegrains,0);
 assert.ok(evidence.notes.vegetables.some(x=>/Rezeptschätzung/.test(x)));
 const daily=dailyDozen5930(s,{day});assert.equal(daily.rows.find(x=>x.id==='vegetables').observed,2);
 const legacy=dailyDozenSummary(s,day);assert.ok(legacy.rows.find(x=>x.id==='vegetables').partial>2.5);
});
test('existing journal snapshots recover ingredient assumptions from Mensa catalog without writing',()=>{
 const s=sample();const e={id:'old-entry',foodId:'mensa-menu-2026-11-16-v1',at,amount:'1 Study-Teller',catalogOfferId:offer.id,menuSnapshot:{title:offer.title,menuDate:day,dailyDozenCandidateCategories:offer.dailyDozenCandidateCategories}};
 s.nutritionJournal.entries.push(e);const before=JSON.stringify(s);
 assert.ok(dailyDozenIngredientEvidence404(s,day).totals.vegetables>2.5);
 assert.equal(JSON.stringify(s),before);
});
test('named vegetables without quantities only create clearly labelled provisional fractional serving',()=>{
 const s=sample();s.mensaCatalog.entries[0].ingredientWeightsGrams=null;s.mensaCatalog.entries[0].ingredientsNamedInMenu=['Gemüse','Linsen','Basmati Reis'];logMensaMeal(s,day,at);
 const evidence=dailyDozenIngredientEvidence404(s,day);
 assert.equal(evidence.totals.vegetables,0.5);assert.equal(evidence.totals.beans,0.5);assert.equal(evidence.totals.wholegrains,0);
 assert.ok(evidence.notes.vegetables.some(x=>/Teilportion/.test(x)));
});
test('true named wholegrain component is credited and a candidate without ingredients is not',()=>{
 const s=sample();s.mensaCatalog.entries[0].ingredientWeightsGrams={'Naturreis, gekocht':120};logMensaMeal(s,day,at);
 const evidence=dailyDozenIngredientEvidence404(s,day);
 assert.ok(evidence.totals.wholegrains>1.1);assert.equal(evidence.totals.vegetables,0);
});
test('nutrition dashboard has measurable y-axis, dated x-axis, quantitative interpretation and separate drinks',()=>{
 const s=sample();logMensaMeal(s,day,at);
 const view=nutritionCoachDashboard52(s,{days:14,anchor:day,today:day,metric:'kcal'});
 assert.match(view,/viewBox="0 0 1000 235"/);
 assert.match(view,/numerische kcal-Achse/);
 assert.match(view,/16\.11/);
 assert.match(view,/Was isst du regelmäßig/);
 assert.match(view,/Getränke/);
 assert.match(view,/Mensa-Mahlzeit/);
 assert.equal(nutritionCoachOverview52(s,{days:14,anchor:day,today:day}).mensaCount,1);
});
test('analysis stays click-only even with Mensa source evidence',()=>{
 const s=sample();logMensaMeal(s,day,at);const report=nutritionCoachAnalyze52(s,{days:14,anchor:day,today:day});
 assert.ok(report.items.some(x=>x.id==='mensa'));
 const dashboard=readFileSync(new URL('../client/src/nutrition-coach-v059152.js',import.meta.url),'utf8').split('export function nutritionCoachDashboard52(')[1];
 assert.doesNotMatch(dashboard,/nutritionCoachAnalyze52\(/);
});
