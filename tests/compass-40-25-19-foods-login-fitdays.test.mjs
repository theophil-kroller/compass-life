import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOOD_PRESETS,addNutrition,nutritionFoods,nutritionKcalEstimate,nutritionQuickView} from '../client/src/personal-journal-v5692.js';
import {nutritionParts,nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {dailyDozenEvidence} from '../client/src/daily-dozen-v57733.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {antiAgingEightModel} from '../client/src/anti-aging-eight-v57734.js';
import {bioactiveForEntry} from '../client/src/nutrition-phyto-v57736.js';
import {fitdaysInterpretationView} from '../client/src/fitdays-interpretation-v57759402517.js';
const src=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const product=id=>FOOD_PRESETS.find(f=>f.id===id);
const day='2026-10-30';
test('BCAA restored with historical 13g / 35 kcal / 10g BCAA, but not as complete protein',()=>{
 const f=product('profuel-alphaminos-bcaa'); assert.ok(f);assert.equal(f.group,'Nahrungsergänzung');assert.equal(f.defaultAmount,'13 g');
 assert.equal(nutritionKcalEstimate(f,f.defaultAmount).low,35);
 const parts=nutritionParts(f.id,f.defaultAmount,f); assert.equal(parts.length,1);assert.equal(parts[0].values.kcal,35);assert.equal(parts[0].values.protein,undefined);
 const extra=Object.fromEntries(parts[0].extra.map(x=>[x.key,x.value]));assert.deepEqual([extra.bcaa,extra.leucine,extra.isoleucine,extra.valine],[10000,5000,2500,2500]);
 assert.equal(bioactiveForEntry({foodId:f.id,amount:f.defaultAmount}).length,0);
});
test('banana and existing apple: full recorded grams, macro/micros, portion scaling',()=>{
 const b=product('banana'),apple=product('apple'); assert.ok(b);assert.ok(apple);
 assert.equal(nutritionParts(b.id,b.defaultAmount,b)[0].values.kcal,106.8);
 assert.equal(nutritionParts(b.id,'2 Stück',b)[0].values.kcal,213.6);
 assert.equal(nutritionParts(b.id,'150 g',b)[0].values.kcal,133.5);
 assert.ok(nutritionParts(b.id,b.defaultAmount,b)[0].values.potassium>=400);
 assert.ok(nutritionParts(apple.id,apple.defaultAmount,apple)[0].values.vitaminC>=8);
 assert.match(nutritionQuickView({}),/Banane/);assert.match(nutritionQuickView({}),/PROFUEL/);
});
test('Daily Dozen and Anti-Aging recognize 2 fruit servings, not the supplement',()=>{
 const state={};['banana','apple','profuel-alphaminos-bcaa'].forEach(id=>addNutrition(state,{foodId:id,at:day+'T10:10:00Z'}));
 assert.equal(dailyDozenEvidence(state,day).totals.fruit,2);
 assert.equal(dailyDozenIngredientEvidence404(state,day).totals.fruit,2);
 const model=antiAgingEightModel(state,day);assert.equal(model.rows.find(x=>x.id==='microbiome').status,'partial');
 assert.equal(model.rows.find(x=>x.id==='nuts').status,'unknown');
 assert.ok(bioactiveForEntry({foodId:'apple',amount:'1 Stück'}).length===0);
});
test('lock and app share one visible release label, old snapshot constant untouched',()=>{
 const release=src('../client/src/compass-release-v57759402519.js');const main=src('../client/src/main-full-v57759402510.js'),lock=src('../client/src/ars-vivendi-lock-full-v5775922.js');
 assert.match(release,/0\.5\.77\.59\.40\.25\.20/);assert.match(main,/Personal Life Manager · \$\{COMPASS_VISIBLE_RELEASE\}/);assert.match(lock,/Build \$\{COMPASS_VISIBLE_RELEASE\}/);
 assert.match(main,/const COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.25\.10'/);
});
test('Fitdays-style axes, readable categorical ranges and crosshairs only for known data',()=>{
 const sample={day,at:day+'T07:10:00Z',weightKg:87.1,bodyFatPct:24.4,visceralFat:8};
 const s=fitdaysInterpretationView([sample],{today:day,range:'28',heightCm:184});
 assert.match(s,/höherer BMI · mehr Fett/);assert.match(s,/fdi-crosshair-y/);assert.match(s,/fdi-crosshair-x/);assert.match(s,/fdi-track-caption/);assert.match(s,/25,7/);
 assert.doesNotMatch(s,/Diagnose: Adipositas/);assert.match(s,/kein Messwert|nicht verfügbar|nicht erfasst/i);
});
