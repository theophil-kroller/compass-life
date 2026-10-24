import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionTimingIndex,nutritionTimingSeries,nutritionTimingView,nutritionTimingPeriod,shiftNutritionTimingPeriod,nutritionTimingSelectedMarkup,colorForHour,FOOD_DAYPARTS} from '../client/src/nutrition-timing-v57725.js';
const now=new Date('2026-10-24T10:22:00+02:00');
const sample=()=>({nutritionJournal:{customFoods:[],entries:[
 {id:'a',foodId:'apple',at:'2026-10-22T08:30:00+02:00',amount:'1 Stück',updatedAt:'1'},
 {id:'b',foodId:'cheddar',at:'2026-10-22T19:15:00+02:00',amount:'25 g',updatedAt:'1'},
 {id:'c',foodId:'apple',at:'2026-10-23T10:00:00+02:00',amount:'1 Stück',updatedAt:'1'},
 ]}});
const series=(s,opts={})=>nutritionTimingSeries(s,{now,anchor:'2026-10-24',...opts});
test('Nutrition Insights 1 plots individual documented food events without aggregating away timestamps',()=>{
 const a=series(sample());assert.equal(a.events.length,3);assert.equal(a.observed.length,2);
 assert.equal(a.rows.find(x=>x.day==='2026-10-22').first,Date.parse('2026-10-22T08:30:00+02:00'));
 assert.equal(a.rows.find(x=>x.day==='2026-10-22').eatingMinutes,645);
 const html=nutritionTimingView(sample(),{now,anchor:'2026-10-24'});
 assert.match(html,/data-action="ni725-event"/);assert.match(html,/data-id="b"/);assert.match(html,/Essfenster/);assert.match(html,/Längste Pause der Woche/);
});
test('Longest logged overnight pause belongs to following calendar day and is calendar-adjacent only',()=>{
 const a=series(sample());assert.equal(a.longest.day,'2026-10-23');assert.equal(a.longest.minutes,885);
 assert.equal(a.rows.find(x=>x.day==='2026-10-23').overnightMinutes,885);
 const s=sample();s.nutritionJournal.entries.find(e=>e.id==='b').deleted=true;
 assert.equal(series(s).longest.minutes,1530); // one previous dated intake but not enough to claim verified fasting
 s.nutritionJournal.entries.find(e=>e.id==='a').at='2026-10-21T08:30:00+02:00';
 s.nutritionJournal.entries.find(e=>e.id==='a').updatedAt='new';
 assert.equal(series(s).longest,null); // missing previous calendar day
});
test('Incremental day index notices edits, deletion and timestamp moves without altering vault',()=>{
 const s=sample(),original=JSON.stringify(s),initial=nutritionTimingIndex(s);
 assert.equal(initial.days.get('2026-10-22').summary.entries,2);
 assert.equal(nutritionTimingIndex(s),initial);assert.equal(JSON.stringify(s),original);
 const entry=s.nutritionJournal.entries[1];entry.at='2026-10-23T11:00:00+02:00';entry.updatedAt='2';
 const updated=nutritionTimingIndex(s);
 assert.equal(updated.days.get('2026-10-22').summary.entries,1);
 assert.equal(updated.days.get('2026-10-23').summary.entries,2);
 entry.deleted=true;entry.updatedAt='3';assert.equal(nutritionTimingIndex(s).days.get('2026-10-23').summary.entries,1);
});
test('Week and month navigation respects calendar boundaries and future disabled arrows',()=>{
 const w=nutritionTimingPeriod('week','2026-10-24',now);assert.equal(w.first,'2026-10-19');assert.equal(w.last,'2026-10-24');assert.equal(w.canNext,false);
 assert.equal(shiftNutritionTimingPeriod('week','2026-10-24',-1,now),'2026-10-12');
 const m=nutritionTimingPeriod('month','2026-09-15',now);assert.equal(m.first,'2026-09-01');assert.equal(m.last,'2026-09-30');
 assert.equal(shiftNutritionTimingPeriod('month','2026-09-15',1,now),'2026-10-01');
 assert.equal(shiftNutritionTimingPeriod('month','2026-10-15',1,now),'2026-10-15');
});
test('Zero calorie entries do not break observed fasting and missing days never become zero calorie days',()=>{
 const s=sample();s.nutritionJournal.entries.push({id:'zero',foodId:'water',at:'2026-10-23T07:30:00+02:00',amount:'250 ml',updatedAt:'1'});
 assert.equal(series(s).longest.minutes,885);
 assert.equal(series(s).rows.filter(r=>r.known>0).length,2);
 assert.equal(series(s).rows.filter(r=>r.known===0&&r.entries===0).length,4);
});
test('Evening dot is blue, midday red, morning orange; labels and icons survive',()=>{
 assert.equal(FOOD_DAYPARTS.some(p=>p.icon==='🌅'),true);
 assert.equal(colorForHour(8),'#E97B37');assert.equal(colorForHour(12),'#D34D53');assert.equal(colorForHour(19),'#4187C8');
 const html=nutritionTimingView(sample(),{now,anchor:'2026-10-24',selectedId:'a'});
 assert.match(html,/🌅/);assert.match(html,/☀️/);assert.match(html,/🍽️/);assert.match(html,/🌆/);
 assert.match(html,/ni725-selection/);assert.match(nutritionTimingSelectedMarkup(sample(),'a'),/Eintrag bearbeiten/);
});
test('All-time mode includes all year-month rows without discarding timestamp details',()=>{
 const s=sample();s.nutritionJournal.entries.push({id:'old',foodId:'apple',at:'2025-08-15T07:17:00+02:00',amount:'1 Stück',updatedAt:'1'});
 const a=series(s,{mode:'all'});assert.equal(a.events.length,4);
 const html=nutritionTimingView(s,{mode:'all',now});assert.match(html,/2025-08/);assert.match(html,/2026-10/);assert.match(html,/2025-08-15/);
});
test('Observed overnight intervals use actual elapsed time across autumn DST clock change',()=>{
 const s={nutritionJournal:{entries:[
  {id:'before',foodId:'apple',at:'2026-10-24T19:00:00+02:00',amount:'1 Stück',updatedAt:'1'},
  {id:'after',foodId:'apple',at:'2026-10-25T10:00:00+01:00',amount:'1 Stück',updatedAt:'1'}
 ],customFoods:[]}};
 const result=nutritionTimingSeries(s,{mode:'week',anchor:'2026-10-25',now:new Date('2026-10-25T12:00:00+01:00')});
 assert.equal(result.longest.minutes,960);
});
test('Existing nutrition Insights tabs are extended, not replaced, and navigation uses targeted redraw',async()=>{
 const {readFileSync}=await import('node:fs');
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/data-id="journal"/);assert.match(main,/data-id="nutrients"/);assert.match(main,/data-id="timing"/);
 assert.match(main,/refreshNutritionTimingPanel\(\)/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.25'/);
});
