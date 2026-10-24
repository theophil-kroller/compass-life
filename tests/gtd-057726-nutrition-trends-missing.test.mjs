import test from 'node:test';
import assert from 'node:assert/strict';
import {nutritionTrendsSeries,nutritionTrendsView,nutritionTrendsIndex,nutrientMicroSummary,NUTRIENT_TREND_METRICS} from '../client/src/nutrition-trends-v57726.js';
import {nutritionDailyHistory,nutritionHistoryView} from '../client/src/nutrition-history-v577.js';
import {nutritionKcalEstimate,addCustomFood} from '../client/src/personal-journal-v5692.js';
import {nutritionTimingSeries} from '../client/src/nutrition-timing-v57725.js';
const now=new Date('2026-10-24T10:00:00Z');
const make=()=>({nutritionJournal:{customFoods:[],entries:[
 {id:'apple-a',foodId:'apple',at:'2026-10-22T08:00:00Z',amount:'1 Stück',updatedAt:'1'},
 {id:'matcha-a',foodId:'matcha-powder',at:'2026-10-22T09:00:00Z',amount:'1 TL',updatedAt:'1'},
 {id:'cheese-a',foodId:'cheddar',at:'2026-10-23T14:00:00Z',amount:'25 g',updatedAt:'1'},
 {id:'supp-a',foodId:'supplement-bluebonnet-one-men',at:'2026-10-23T07:00:00Z',amount:'1 Kapsel',updatedAt:'1'}
]}});
const opts={mode:'week',anchor:'2026-10-24',now};
test('Nutrition 2: daily protein dot values remain one per observed day; missing days are never fake zeros',()=>{
 const s=make(),m=nutritionTrendsSeries(s,{...opts,metric:'protein'});
 assert.equal(m.period.mode,'week');assert.equal(m.observed.length,2);
 assert.equal(m.knownRows.length,2);
 assert.equal(m.rows.filter(r=>r.entries===0).length,4);
 assert.equal(m.mean>0,true);
 const html=nutritionTrendsView(s,{...opts,metric:'protein'});
 assert.match(html,/ni726-dot/);assert.match(html,/Wochentagsmuster/);assert.match(html,/Nährstoff-Trends/);
 assert.match(html,/Vitamine/);assert.match(html,/Tagespunktdiagramm/);
});
test('Nutrition 2: salt is a WHO upper reference; caffeine EFSA is not a consumption goal',()=>{
 const s=make();const salt=nutritionTrendsSeries(s,{...opts,metric:'salt'});const caf=nutritionTrendsSeries(s,{...opts,metric:'caffeine'});
 assert.equal(salt.guide,5);assert.equal(salt.guideKind,'upper');
 assert.equal(caf.guide,400);assert.equal(caf.guideKind,'upper');
 assert.ok(caf.knownRows.some(r=>r.totals.caffeine>=56));
 const html=nutritionTrendsView(s,{...opts,metric:'caffeine'});
 assert.match(html,/EFSA-Koffeinorientierung/);
});
test('Nutrition 2: micros average known days and preserve coverage counts',()=>{
 const s=make();const data=nutrientMicroSummary(s,opts),vitC=data.items.find(r=>r.key==='vitaminC');
 assert.ok(vitC.known>=1);assert.ok(vitC.mean>0);assert.equal(vitC.reference,80);
 assert.ok(vitC.known<=data.logged);assert.ok(vitC.percent>0);
 assert.match(nutritionTrendsView(s,opts),/Tage mit Wert/);
});
test('Nutrition 2: updated entry invalidates only affected per-day cache and does not touch journal source',()=>{
 const s=make(),snapshot=JSON.stringify(s);const a=nutritionTrendsIndex(s);
 assert.equal(nutritionTrendsIndex(s),a);assert.equal(JSON.stringify(s),snapshot);
 const entry=s.nutritionJournal.entries.find(x=>x.id==='cheese-a');entry.amount='50 g';entry.updatedAt='2';
 const b=nutritionTrendsIndex(s);assert.equal(b,a);
 assert.ok(nutritionTrendsSeries(s,{...opts,metric:'protein'}).rows.some(r=>r.day==='2026-10-23'&&r.totals.protein>10));
 entry.deleted=true;entry.updatedAt='3';
 assert.ok(nutritionTrendsSeries(s,{...opts,metric:'protein'}).rows.some(r=>r.day==='2026-10-23'&&r.totals.protein===undefined));
});
test('Nutrition 2: compact kcal pill names missing foods and supplements without treating them as zero',()=>{
 const s=make();s.nutritionJournal.entries.push({id:'mystery',foodId:'other-food',at:'2026-10-23T12:30:00Z',amount:'1 Teller',updatedAt:'1'});
 const records=nutritionDailyHistory(s,{period:7,now});const yesterday=records.find(r=>r.day==='2026-10-23');
 assert.equal(yesterday.unknown,1);assert.equal(yesterday.supplementItems.length,1);
 assert.equal(yesterday.missingItems.length,1);assert.match(yesterday.missingItems[0].reason,/kcal-Angabe/);
 const html=nutritionHistoryView(s,{period:7,now});
 // Version 0.5.77.38 moves details below the daily kcal amount into one small pill.
 // Both records must remain identifiable without a full-width expandable row.
 assert.match(html,/<details class="n577-pill-details">/);
 assert.match(html,/<summary class="n577-mini-pill"/);
 assert.match(html,/2 ohne kcal/);
 assert.match(html,/Anderes/);
 assert.match(html,/Bluebonnet ONE for Men/);
 assert.match(html,/Nahrungsergänzung · keine kcal-Deklaration; kein Nullwert angenommen/);
 assert.match(html,/data-action="pj92-food-edit"/);
 assert.doesNotMatch(html,/Fehlende Energieangaben anzeigen/);
 assert.doesNotMatch(html,/class="n577-missing-items"/);
 assert.doesNotMatch(html,/1 ohne Wert/);
});
test('Nutrition 2: one 1-TL matcha has a nonempty energy estimate, and a capsule cannot end a fasting interval',()=>{
 const s=make();const food={id:'matcha-powder',defaultAmount:'1 TL (2 g)',kcalLow:5,kcalHigh:9};
 const e=nutritionKcalEstimate(food,'1 TL');assert.deepEqual([e.low,e.high],[5,9]);
 const m=nutritionTimingSeries(s,opts);const oct23=m.rows.find(r=>r.day==='2026-10-23');
 assert.equal(new Date(oct23.first).toISOString(),'2026-10-23T14:00:00.000Z');
});
test('Nutrition 2: new custom foods may include honest kcal ranges; empty remains unknown',()=>{
 const s={};const a=addCustomFood(s,'Mein Gericht','🍛',{defaultAmount:'1 Portion',kcalLow:'330',kcalHigh:'520'});
 assert.deepEqual([a.kcalLow,a.kcalHigh],[330,520]);
 assert.deepEqual(nutritionKcalEstimate(a,'2 Portionen'),{low:660,high:1040,kind:'Schätzung'});
 const b=addCustomFood(s,'Unbekannt','🍽️',{defaultAmount:'1 Portion',kcalLow:'',kcalHigh:''});
 assert.equal(b.kcalLow,null);assert.equal(nutritionKcalEstimate(b,'1 Portion'),null);
});
test('Nutrition 2: defaults still have all nutrient icons; version and targeted panel navigation wired',async()=>{
 const {readFileSync}=await import('node:fs');const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.26'/);
 assert.match(main,/data-id="journal"/);assert.match(main,/data-id="nutrients"/);assert.match(main,/data-id="timing"/);assert.match(main,/data-id="trends"/);
 assert.match(main,/refreshNutritionTrendsPanel/);
 assert.ok(NUTRIENT_TREND_METRICS.some(x=>x.key==='salt'));
 assert.ok(NUTRIENT_TREND_METRICS.some(x=>x.key==='caffeine'));
});
