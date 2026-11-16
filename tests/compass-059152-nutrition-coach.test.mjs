import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nutritionCoachOverview52,nutritionCoachAnalyze52,nutritionCoachDashboard52,nutritionCoachWindow52,shiftNutritionCoachWindow52} from '../client/src/nutrition-coach-v059152.js';
import {nutritionFocusDay4017,nutritionWorkspace4017} from '../client/src/nutrition-focus-v577594017.js';
const d=(day,at)=>`${day}T${at||'12:00'}:00+01:00`;
function state(){return {nutritionJournal:{entries:[
 {id:'a',foodId:'salt-loaf-test',at:d('2026-11-10','12:00'),amount:'1 Portion',updatedAt:'2026-11-10T11:00Z'},
 {id:'b',foodId:'salt-loaf-test',at:d('2026-11-11','12:00'),amount:'1 Portion',updatedAt:'2026-11-11T11:00Z'},
 {id:'c',foodId:'salt-loaf-test',at:d('2026-11-12','12:00'),amount:'1 Portion',updatedAt:'2026-11-12T11:00Z'},
 {id:'d',foodId:'salt-loaf-test',at:d('2026-11-13','12:00'),amount:'1 Portion',updatedAt:'2026-11-13T11:00Z'},
 {id:'e',foodId:'broccoli-steamed-home-20261115',at:d('2026-11-13','13:00'),amount:'250 g',updatedAt:'2026-11-13T11:00Z'}],customFoods:[{id:'salt-loaf-test',title:'Ein lokales Salzprodukt',group:'Snacks',defaultAmount:'1 Portion',nutrientBasis:'perPortion',nutrients:{kcal:400,salt:6,protein:8,fat:2,saturated:1,fiber:3},source:'Testetikett'}]}};}
test('7/14/42/90-day windows have date-based paging even across calendar weeks',()=>{
 const w=nutritionCoachWindow52({days:7,anchor:'2026-11-16',today:'2026-11-16'});
 assert.equal(w.start,'2026-11-10');assert.equal(w.end,'2026-11-16');assert.equal(shiftNutritionCoachWindow52(7,w.end,'prev','2026-11-16'),'2026-11-09');
 assert.equal(shiftNutritionCoachWindow52(7,'2026-11-09','next','2026-11-16'),'2026-11-16');
 assert.equal(shiftNutritionCoachWindow52(42,'2026-10-05','next','2026-11-16'),'2026-11-16');
});
test('historical food products and named sources are ranked from actual logged portion values',()=>{
 const s=state(),m=nutritionCoachOverview52(s,{days:14,anchor:'2026-11-16',today:'2026-11-16'});
 assert.equal(m.loggedDays,4);assert.equal(m.products.find(p=>p.id==='salt-loaf-test').count,4);
 assert.equal(m.metrics.salt.avg,6);assert.equal(m.dozen.find(d=>d.id==='cruciferous').daysPresent,1);
 const r=nutritionCoachAnalyze52(s,{days:14,anchor:'2026-11-16',today:'2026-11-16'});
 assert.match(r.items.find(i=>i.id==='salt').observation,/Ein lokales Salzprodukt: 24 g/);
 assert.ok(r.items.some(i=>i.id==='dd-berries'));assert.ok(r.items.some(i=>i.id==='dd-legumes'));
});
test('an individual high-salt food does not automatically trigger moral warning',()=>{
 const s=state();s.nutritionJournal.entries=s.nutritionJournal.entries.slice(0,1);
 const r=nutritionCoachAnalyze52(s,{days:7,anchor:'2026-11-16',today:'2026-11-16'});
 assert.match(r.items.find(i=>i.id==='salt').action,/keine Gegenmaßnahme/);
});
test('unknown nutrient values remain unknown and do not count as zero',()=>{
 const s=state();s.nutritionJournal.entries.push({id:'z',foodId:'unknown-food-id',at:d('2026-11-14','08:00'),amount:'1 Portion'});
 const m=nutritionCoachOverview52(s,{days:14,anchor:'2026-11-16',today:'2026-11-16'});
 assert.ok(m.metrics.salt.partial>0);assert.ok(m.metrics.vitaminB12.days<m.loggedDays);
});
test('recommendations are not computed by normal dashboard render',()=>{
 const src=readFileSync(new URL('../client/src/nutrition-coach-v059152.js',import.meta.url),'utf8');
 const dashboard=src.split('export function nutritionCoachDashboard52(')[1];
 assert.doesNotMatch(dashboard,/nutritionCoachAnalyze52\(/);
 const html=nutritionCoachDashboard52(state(),{days:14,anchor:'2026-11-16',today:'2026-11-16'});
 assert.match(html,/Meine Ernährung analysieren/);assert.doesNotMatch(html,/Ein lokales Salzprodukt: 24 g/);
});
test('recommendations invalidate after journal change',()=>{
 const s=state(),r=nutritionCoachAnalyze52(s,{days:14,anchor:'2026-11-16',today:'2026-11-16'});
 assert.match(nutritionCoachDashboard52(s,{days:14,anchor:'2026-11-16',today:'2026-11-16',report:r}),/Ein lokales Salzprodukt: 24 g/);
 s.nutritionJournal.entries[0].amount='2 Portionen';s.nutritionJournal.entries[0].updatedAt='2026-11-16T09:00:00Z';
 assert.doesNotMatch(nutritionCoachDashboard52(s,{days:14,anchor:'2026-11-16',today:'2026-11-16',report:r}),/Ein lokales Salzprodukt: 24 g/);
});
test('nutrition tabs include Übersicht and existing journal, data is untouched',()=>{
 const s=state(),before=JSON.stringify(s);
 const html=nutritionWorkspace4017(s,{day:'2026-11-16',view:'overview',renderOverview:()=>'<main>Überblick geladen</main>',renderSection:()=>'',renderHistory:()=>'',renderJournal:()=>'',renderManualDozen:()=>'',renderSync:()=>''});
 assert.match(html,/Überblick geladen/);assert.match(html,/Daily Dozen/);assert.match(html,/Mensa/);assert.equal(JSON.stringify(s),before);
});
test('no new eager import in main/Today and button click only invokes analysis',()=>{
 const main=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(main,/import\('\.\/nutrition-coach-v059152\.js'\)/);
 assert.doesNotMatch(main,/^import .*nutrition-coach-v059152/m);
 assert.match(main,/if\(action==='ni152-analyze'\)/);
 assert.match(main,/nutritionCoachPageVisible52\(\)/);
});
