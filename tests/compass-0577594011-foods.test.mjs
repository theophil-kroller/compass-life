import test from 'node:test';
import assert from 'node:assert/strict';
import {FOOD_PRESETS,nutritionFoods} from '../client/src/personal-journal-v5692.js';
import {nutrientEntry,PRODUCT_PROFILES} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {compass594011FoodsRelease} from '../client/compass594011-foods-release.js';
const day='2026-10-27',at='2026-10-27T08:00:00';
const record=(foodId,amount,note='')=>({foodId,amount,note,at,id:foodId});
const state=(entries)=>({nutritionJournal:{entries,customFoods:[]}});
test('Two presets with appropriate real portion references',()=>{
 assert.equal(FOOD_PRESETS.filter(f=>f.id==='spar-bio-flaxseed').length,1);
 assert.equal(FOOD_PRESETS.filter(f=>f.id==='sbudget-topfencreme-vanilla').length,1);
 assert.equal(nutritionFoods({}).find(f=>f.id==='spar-bio-flaxseed').defaultAmount,'1 TL (3 g)');
});
test('Photographed macro nutrients used at 3g and 180g, micros flagged as estimated',()=>{
 const foods=nutritionFoods({});
 const flax=nutrientEntry(foods.find(f=>f.id==='spar-bio-flaxseed'),record('spar-bio-flaxseed','3 g'));
 const quark=nutrientEntry(foods.find(f=>f.id==='sbudget-topfencreme-vanilla'),record('sbudget-topfencreme-vanilla','180 g'));
 assert.equal(flax.values.kcal,15.99);assert.equal(flax.values.fiber,0.81);assert.equal(flax.values.protein,0.6);
 assert.equal(quark.values.kcal,178.2);assert.equal(quark.values.sugar,25.2);assert.equal(quark.values.protein,10.44);
 assert(flax.estimatedKeys.has('magnesium'));assert(quark.estimatedKeys.has('calcium'));
 assert(!quark.estimatedKeys.has('kcal'));
});
test('Greger credits ONLY explicitly ground and heated flax and never double counts nuts',()=>{
 let e=dailyDozenIngredientEvidence404(state([record('spar-bio-flaxseed','7 g')]),day);
 assert.equal(e.totals.flax,0);assert.equal(e.nutGrams,0);
 e=dailyDozenIngredientEvidence404(state([record('spar-bio-flaxseed','7 g','geschrotet und gebacken')]),day);
 assert.equal(e.totals.flax,1);assert.equal(e.totals.nuts,0);
 e=dailyDozenIngredientEvidence404(state([record('spar-bio-flaxseed','3 g','gemahlen, gekocht')]),day);
 assert(Math.abs(e.totals.flax-3/7)<0.001);
});
test('Topfencreme earns no Daily Dozen ticks and flax gives microbiome only partial observation',()=>{
 const x=state([record('sbudget-topfencreme-vanilla','180 g'),record('spar-bio-flaxseed','3 g')]);
 const e=dailyDozenIngredientEvidence404(x,day);
 assert.equal(e.totals.flax,0);assert.equal(e.totals.nuts,0);
 const a=antiAgingEightModel(x,day);
 assert.equal(a.rows.find(r=>r.id==='microbiome').status,'partial');
 assert.equal(a.rows.find(r=>r.id==='xeno').status,'unmeasurable');
});
test('Release plugin changes only the designated version anchor',()=>{
 const p=compass594011FoodsRelease();
 const main=`Build 0.5.77.59.40.10\nconst COMPASS_CLIENT_VERSION='0.5.77.59.40.10';`;
 const out=p.transform(main,'/repo/client/src/main.js').code;
 assert.match(out,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.11'/);
});
