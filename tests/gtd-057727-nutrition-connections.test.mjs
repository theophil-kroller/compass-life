import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nutritionSpearman,joinNutritionObservations,nutritionConnectionSeries,nutritionConnectionsView,sleepMinutesOf} from '../client/src/nutrition-connections-v57727.js';
import {nutrition3Bridge} from '../client/nutrition3-bridge.js';

const today='2026-10-24';
const state=()=>({
 nutritionJournal:{customFoods:[],entries:[
  {id:'m',foodId:'matcha',at:'2026-10-22T07:30:00Z',amount:'1 Becher',updatedAt:'1'},
  {id:'c',foodId:'cheddar',at:'2026-10-22T19:15:00Z',amount:'25 g',updatedAt:'1'},
  {id:'a',foodId:'apple',at:'2026-10-23T18:00:00Z',amount:'1 Stück',updatedAt:'1'}
 ]},
 healthImports:{garminNights:[
  {day:'2026-10-23',totals:{deep:95,light:267,rem:110}},
  {day:'2026-10-24',totals:{deep:120,light:270,rem:100}}
 ],garminFitness:[{day:'2026-10-22',steps:8999}]},
 feelingCheckins:[{id:'f',day:'2026-10-22',at:'2026-10-22T17:00:00Z',items:[{id:'calm',intensity:7}]}]
});

test('Nutrition 3: correct next-night association and local calendar date',()=>{
 const res=nutritionConnectionSeries(state(),{today,input:'lastMeal',outcome:'sleep',range:'30'});
 assert.equal(res.points.length,2);assert.equal(res.points[0].day,'2026-10-22');
 assert.equal(res.points[0].targetDay,'2026-10-23');assert.ok(res.points[0].x>=19&&res.points[0].x<20);
 assert.equal(res.points[0].y,472/60);
});
test('Nutrition 3: same-day Garmin steps, no fabricated zero for missing day',()=>{
 const res=nutritionConnectionSeries(state(),{today,input:'protein',outcome:'steps',range:'30'});
 assert.equal(res.points.length,1);assert.equal(res.points[0].y,8999);
 assert.equal(res.withoutOutcome.length,1);
});
test('Nutrition 3: mood self-report only, missing other emotions not zero',()=>{
 const calm=nutritionConnectionSeries(state(),{today,input:'lastMeal',outcome:'mood:calm'});
 const fear=nutritionConnectionSeries(state(),{today,input:'lastMeal',outcome:'mood:fear'});
 assert.equal(calm.points.length,1);assert.equal(calm.points[0].y,7);
 assert.equal(fear.points.length,0);
});
test('Nutrition 3: >today future nights excluded; missing input/outcome distinct',()=>{
 const data=joinNutritionObservations([{day:'2026-10-22',value:null},{day:'2026-10-23',value:3}],
  [{day:'2026-10-24',value:6},{day:'2026-10-25',value:8}],{today,outcome:'sleep',range:'30'});
 assert.deepEqual(data.withoutInput,['2026-10-22']);assert.equal(data.points.length,1);
 assert.equal(data.points[0].targetDay,'2026-10-24');
 assert.equal(sleepMinutesOf({totals:{deep:null,light:null,rem:null}}),null);
});
test('Nutrition 3: tied-rank Spearman only after ten pairs and with variability',()=>{
 assert.equal(nutritionSpearman(Array.from({length:9},(_,i)=>({x:i,y:i}))),null);
 assert.ok(Math.abs(nutritionSpearman(Array.from({length:10},(_,i)=>({x:i,y:9-i})))+1)<1e-10);
 assert.equal(nutritionSpearman(Array.from({length:10},(_,i)=>({x:i,y:2}))),null);
});
test('Nutrition 3: private scatter renders all variables and honest coverage',()=>{
 const html=nutritionConnectionsView(state(),{today,outcome:'sleep',range:'90'});
 assert.match(html,/ni727-dot/);assert.match(html,/Spearman/);assert.match(html,/kein Hinweis auf eine ernährungsbedingte Wirkung/i);
 assert.match(html,/niemals automatisch 0/i);assert.match(html,/id="ni727-outcome"/);
});
test('Nutrition 3: bridge upgrades exactly 0.5.77.26 without modifying original source',()=>{
 const original=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const before=original.length;
 const transformed=nutrition3Bridge().transform(original,'/workspace/client/src/main.js');
 assert.equal(original.length,before);assert.match(original,/COMPASS_CLIENT_VERSION='0\.5\.77\.26'/);
 assert.match(transformed.code,/COMPASS_CLIENT_VERSION='0\.5\.77\.27'/);
 assert.match(transformed.code,/data-id="connections"/);
 assert.match(transformed.code,/nutritionConnectionsView\(state/);
 assert.match(transformed.code,/refreshNutritionConnectionsPanel/);
 assert.match(transformed.code,/ni727-range/);
});
