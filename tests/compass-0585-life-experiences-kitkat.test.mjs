import test from 'node:test';
import assert from 'node:assert/strict';
import {FOOD_PRESETS,nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {lifeWeekCells,lifeWeekVisualLayers,lifeWeeksView,validateLifeEvent} from '../client/src/life-weeks-v0582.js';
import {buildLifeWeeksPdf,lifeWeeksPosterModel} from '../client/src/life-weeks-pdf-v0583.js';
const birthday='1983-06-28',today='2026-10-31';
const entry=(category,title,start,end,opts={})=>validateLifeEvent({category,title,start,end,...opts});
test('work, education, volunteering and relationships remain background phase lines, not vivid week fill',()=>{
 const events=[entry('work','Test role','2020-01-01','2026-10-01'),entry('education','Bachelor in engineering','2022-01-01','2026-09-30',{endPrecision:'month'}),entry('volunteer','Community role','2020-01-01','2026-10-01'),entry('relationship','Partner A','2020-01-01','2026-10-01')];
 const week=lifeWeekCells(43,{today,events}).find(x=>x.start==='2026-09-27');
 assert.ok(week);const layers=lifeWeekVisualLayers(week);
 assert.deepEqual(layers.experiences,[]);assert.ok(layers.phases.includes('work'));assert.ok(layers.phases.includes('relationship'));assert.equal(layers.milestone,true,'Completed degree is a monthly milestone');
 const html=lifeWeeksView({lifeWeekEvents:events},{today,selectedAge:43});assert.match(html,/lw85-phase-ribbon/);assert.match(html,/lw85-milestone-star/);assert.match(html,/lw84-relationship-ribbon/);
});
test('degree with year-only, unverified end date does not invent graduation star',()=>{
 const e=entry('education','High School Diploma','2002-01-01','2002-12-31',{endPrecision:'month',note:'Nur Jahresangabe in LinkedIn'});
 const w=lifeWeekCells(19,{today,events:[e]}).find(x=>x.start<='2002-12-31'&&x.end>='2002-12-31');
 assert.equal(lifeWeekVisualLayers(w).milestone,false);
});
test('birth milestones are gold stars on exact life week, including when travel overlaps',()=>{
 const events=[entry('milestone','Geburt Nathanael','2012-12-27','2012-12-27'),entry('travel','Reise','2012-12-24','2013-01-03')];
 const cells=lifeWeekCells(29,{today,events});const w=cells.find(x=>x.start<='2012-12-27'&&x.end>='2012-12-27');assert.equal(lifeWeekVisualLayers(w).milestone,true);assert.deepEqual(lifeWeekVisualLayers(w).experiences,['travel']);
 const s=lifeWeeksView({lifeWeekEvents:events},{today,selectedAge:29});assert.match(s,/★/);assert.match(s,/lw85-has-milestone/);
});
test('PDF emits vector stars and does not use education/work as primary full-cell color',()=>{
 const events=[entry('work','Job','2002-01-01','2003-12-31'),entry('milestone','Graduation','2002-06-28','2002-06-28')];
 const model=lifeWeeksPosterModel({today,events});const target=model.rows.find(r=>r.age===19).cells[0];
 assert.deepEqual(lifeWeekVisualLayers(target).experiences,[]);assert.equal(lifeWeekVisualLayers(target).milestone,true);
 const pdf=new TextDecoder().decode(buildLifeWeeksPdf({today,events,paper:'A3'}));assert.match(pdf,/h B/);assert.match(pdf,/Count 1/);
});
test('KitKat Chunky Peanut Butter appears as one 42g snack with official macros',()=>{
 const f=FOOD_PRESETS.find(f=>f.id==='kitkat-chunky-peanut-butter');assert.ok(f);assert.equal(f.group,'Snacks');assert.equal(f.defaultAmount,'1 Riegel (42 g)');
 assert.equal(f.kcalLow,222);assert.equal(f.kcalHigh,222);
 const p=PRODUCT_PROFILES[f.id];assert.ok(p);assert.equal(p.reference.amount,42);assert.deepEqual(p.nutrients,{kcal:222,fat:12.7,saturated:6.4,carbs:21.9,sugar:18.1,fiber:1.2,protein:4.5,salt:.26});
 assert.equal(nutritionFoods({}).filter(e=>e.id===f.id).length,1);
 const r=nutritionKcalEstimate(f,f.defaultAmount);assert.equal(r.low,222);assert.equal(r.high,222);
});
