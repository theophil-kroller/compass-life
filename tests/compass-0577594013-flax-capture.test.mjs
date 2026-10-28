import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOOD_PRESETS,addNutrition,nutritionQuickView,nutritionFoods,nutritionKcalEstimate} from '../client/src/personal-journal-v5692.js';
import {dailyDozenIngredientEvidence404} from '../client/src/daily-dozen-evidence-v57759404.js';
import {nutrientEntry} from '../client/src/nutrition-intelligence-v57712.js';
import {compass594013FlaxRelease} from '../client/compass594013-flax-release.js';
const day='2026-10-27';
const entry=(amount='1 TL (3 g)',note='Vor dem Schlucken gekaut (roh)')=>({id:'flax-1',foodId:'spar-bio-flaxseed',at:'2026-10-27T17:00:00',amount,note});
const st=(entries=[])=>({nutritionJournal:{entries,customFoods:[]}});
test('flax is a reusable normal food tile with labelled 3g and 16kcal',()=>{
 const f=FOOD_PRESETS.find(f=>f.id==='spar-bio-flaxseed');
 assert.equal(f.group,'Snacks');assert.equal(f.defaultAmount,'1 TL (3 g)');
 assert.match(nutritionQuickView(st(),{}),/data-action="pj92-food-tap" data-id="spar-bio-flaxseed"/);
 assert.doesNotMatch(nutritionQuickView(st(),{}),/pj92-flax-yesterday|pj92-flax-quick/);
 assert.match(nutritionQuickView(st(),{}),/SPAR Bio-Leinsamen/);
 assert.deepEqual(nutritionKcalEstimate(f,'1 TL (3 g)'),{low:16,high:16,kind:'Schätzung'});
});
test('logged chewed 3g is 0.43 portion and not an intact full serving',()=>{
 const evidence=dailyDozenIngredientEvidence404(st([entry()]),day);
 assert(Math.abs(evidence.totals.flax-3/7)<1e-10);
 assert.equal(evidence.totals.nuts,0);
 assert.match(evidence.notes.flax.join(' '),/gekaut/);
 assert.equal(dailyDozenIngredientEvidence404(st([entry('1 TL (3 g)','')]),day).totals.flax,0);
});
test('7g explicitly chewed counts one documented serving; timestamps not invented for yesterday',()=>{
 const x=st();addNutrition(x,entry('7 g').at?{...entry('7 g')}:{});
 assert.equal(dailyDozenIngredientEvidence404(x,day).totals.flax,1);
 assert.equal(x.nutritionJournal.entries[0].at,'2026-10-27T17:00:00');
 assert.equal(nutrientEntry(nutritionFoods(x).find(f=>f.id==='spar-bio-flaxseed'),entry()).values.kcal,15.99);
});
test('runtime source has repeatable tile tap and generic journal timestamp editor',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/action==='pj92-food-tap'/);
 assert.doesNotMatch(main,/pj92-flax-yesterday/);
 assert.match(readFileSync(new URL('../client/src/personal-journal-v5692.js',import.meta.url),'utf8'),/name="at"/);
 const dozen=readFileSync(new URL('../client/src/daily-dozen-v57733.js',import.meta.url),'utf8');
 assert.match(dozen,/Teilportion:/);
 const p=compass594013FlaxRelease();
 const r=p.transform("Build 0.5.77.59.40.12;\nconst COMPASS_CLIENT_VERSION='0.5.77.59.40.12';",'/local/client/src/main.js');
 assert.match(r.code,/0\.5\.77\.59\.40\.13/);
});
