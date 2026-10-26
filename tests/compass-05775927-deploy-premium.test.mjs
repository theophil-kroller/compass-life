/** Compass .59.27 deploy regression: release must stay compatible with historical
 * Vite source bridges and with Node VM-based Coach unit tests.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {strengthNutrition732Bridge} from '../client/strength-nutrition732-bridge.js';
const read=name=>readFileSync(new URL('../client/src/'+name,import.meta.url),'utf8');
const coach=read('strength-coach-v5775910.js');
const guided=read('strength-guided-v5775920.js');
const insights=read('strength-insights-v57728.js');
const photos=['squat','bench','barbell-row','military-press','dumbbell-shoulder-press','dumbbell-romanian-deadlift',
 'cable-lateral-raise','face-pull','plank','dead-bug','cable-straight-arm-pulldown','cable-single-arm-row',
 'cable-rear-delt-fly','cable-crunch','cable-woodchop','dumbbell-floor-press','barbell-overhead-press'];
test('new visual library has exactly 17 valid independent WebP assets, missing cable-row remains schematic',()=>{
 for(const slug of photos){const path=new URL(`../client/public/strength-visuals-v5775927/${slug}.webp`,import.meta.url);
  assert.ok(existsSync(path),slug);assert.ok(statSync(path).size>4000,slug);
  const magic=readFileSync(path).subarray(0,12);
  assert.equal(magic.toString('ascii',0,4),'RIFF');assert.equal(magic.toString('ascii',8,12),'WEBP');}
 assert.match(guided,/const COACH_PREMIUM_PHOTOS=new Set/);
 assert.match(guided,/COACH_PREMIUM_VISUAL_ROOT/);
 assert.match(guided,/COACH_NEW_VISUALS/);
 assert.match(guided,/PREMIUM_VISUALS/);
 assert.ok(!photos.includes('cable-row'));
});
test('historical .32 bridge processes extended raw strength model without double imports',()=>{
 const path='/repo/client/src/strength-insights-v57728.js';
 const transformed=strengthNutrition732Bridge().transform(insights,path).code;
 assert.match(transformed,/strengthEditorView\(state,m.sessions,editingId\)/);
 assert.equal((transformed.match(/import \{applyStrengthAnnotations,manualExerciseMuscles,strengthEditorView\}/g)||[]).length,1);
 assert.equal((transformed.match(/function mergeGuidedStrengthSessions\(/g)||[]).length,1);
 assert.match(transformed,/includeCoach=true/);
 assert.match(transformed,/Die Muskelzuordnung ist eine nachvollziehbare <em>Heuristik aus FIT-Übungskategorien<\/em>/);
});
test('Coach planning tolerates legacy VM test contexts without importing health module',()=>{
 const content=coach.replace(/^import .*;\s*$/gm,'').replace(/export (function|const) /g,'$1 ');
 const ids=['dumbbell-row','dumbbell-lateral-raise','dumbbell-pullover','goblet-squat','ab-wheel-kneeling','dumbbell-romanian-deadlift'];
 const context={EXERCISES:ids.map(id=>({id,name:id,primary:id.includes('row')?'back':'shoulders',secondary:[]})),
  strengthPeriod:()=>({events:[],sessions:[],unassigned:0}),detailedMuscleData:()=>({regions:{}}),
  Date,Intl,Number,Math,String,console,localStorage:{getItem:()=>null,setItem:()=>{}}};
 runInNewContext(content+'\nthis.next=planNextWorkout;',context);
 const plan=context.next({},{goal:'vtaper',today:'2026-10-26'});
 assert.equal(plan.health.status,'insufficient');
 assert.equal(plan.health.attention,false);
});
test('Guided workout keeps only the original import.meta reference so Node VM tests work',()=>{
 assert.equal((guided.match(/import\.meta\.env\?\.BASE_URL/g)||[]).length,1);
 const content=guided.replace(/^import.*$/gm,'').replace(/export (function|const) /g,'$1 ')
  .replace('import.meta.env?.BASE_URL',"'/'");
 const context={Date,Intl,Number,Math,String,RegExp,crypto:{randomUUID:()=> 'test'}};
 runInNewContext(content+'\nthis.snapshot=makeGuidedSnapshot;',context);
 assert.equal(typeof context.snapshot,'function');
});
