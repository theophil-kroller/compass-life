import test from 'node:test';
import assert from 'node:assert/strict';
import {annualChartAtlas,annualSleepStageAtlas,annualWellnessAtlas,annualSportsAtlas,annualNutritionAtlas} from '../client/src/annual-chart-atlas-v4023.js';
import {annualDocument} from '../client/src/life-annual-v577594019.js';
import {compass594023AnnualChartAtlas} from '../client/compass594023-annual-chart-atlas.js';
import {readFileSync} from 'node:fs';
const w={start:'2026-01-01',end:'2026-10-28'};
const state={healthImports:{
 garminNights:Array.from({length:7},(_,i)=>({day:`2026-10-${String(i+20).padStart(2,'0')}`,sleepMinutes:330+i*9,totals:{deep:50+i,light:190+i*5,rem:90+i*2}})),
 garminWellness:Array.from({length:140},(_,i)=>({at:`2026-10-${String(20+Math.floor(i/20)).padStart(2,'0')}T${String(i%20).padStart(2,'0')}:00:00Z`,stress:(i*7)%100,bodyBattery:20+(i%20)*3})),
 garminSessions:Array.from({length:10},(_,i)=>({id:`s${i}`,day:`2026-10-${String(i+1).padStart(2,'0')}`,start:`2026-10-${String(i+1).padStart(2,'0')}T08:00:00`,title:'Radfahren',durationMinutes:60+i*8,distanceKm:20,sport:21}))
 },nutritionJournal:{entries:[{id:'matcha',at:'2026-10-22T08:00:00',foodId:'matcha-powder',amount:'1 TL'},{id:'fruit',at:'2026-10-23T12:00:00',foodId:'apple',amount:'1 Stück'}]},workTime:{days:[]}};
test('sleep phases on last seven nights are static print vectors',()=>{
 const x=annualSleepStageAtlas(state,w);assert.equal(x.length,1);assert.match(x[0].plots[0].svg,/<svg/);assert.doesNotMatch(x[0].plots[0].svg,/undefined|NaN|wird geladen/);
});
test('Body Battery and Stress report pages use measurements, not placeholders',()=>{
 const x=annualWellnessAtlas(state,w);assert.equal(x.length,1);assert.equal(x[0].plots.length,2);assert.match(x[0].plots[0].svg,/circle/);assert.doesNotMatch(x[0].plots[0].svg,/undefined|NaN/);
});
test('Sports category charts and timeline are based on recorded sessions',()=>{
 const x=annualSportsAtlas(state,w);assert.equal(x.length,1);assert.match(x[0].plots[0].svg,/Radfahren/);assert.match(x[0].plots[0].caption,/10 dokumentierte/);
});
test('Bioactive nutrient chart is never fabricated from unknown amounts',()=>{
 const x=annualNutritionAtlas(state,w);assert.ok(Array.isArray(x));for(const y of x)for(const p of y.plots)assert.doesNotMatch(p.svg,/NaN|undefined/);
});
test('Missing source data suppresses charts instead of displaying zero values',()=>{
 const x=annualChartAtlas({},w);assert.deepEqual(x.health,[]);assert.deepEqual(x.sports,[]);assert.deepEqual(x.nutrition,[]);
});
test('Annual integrates documented stages, activity and energy',()=>{
 const html=annualDocument(state,{now:'2026-10-28',period:'year'});
 assert.match(html,/Die Architektur deiner Nächte/);assert.match(html,/Energie und Belastung/);assert.match(html,/Ein Jahr in Bewegung/);
 assert.match(html,/Body Battery/);assert.doesNotMatch(html,/Anatomie wird geladen/);
});
test('Vite adds release .40.23 transformation after .40.22',()=>{
 const v=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(v,/compass594023AnnualChartAtlas/);
 const p=compass594023AnnualChartAtlas();
 const a=p.transform("const COMPASS_CLIENT_VERSION='0.5.77.59.40.22';\nBuild 0.5.77.59.40.22",'/x/client/src/main.js');
 assert.match(a.code,/0\.5\.77\.59\.40\.23/);
});
