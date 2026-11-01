import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {EXERCISES,STRENGTH_ENGLISH_NAMES,manualExerciseMuscles} from '../client/src/strength-editor-v57732.js';
import {NEW_EXERCISES_89,resolveExerciseAlias89,insertOptionalExercise89,exerciseImagePair89} from '../client/src/strength-exercise-library-v0589.js';
import {runInNewContext} from 'node:vm';
// Legacy Coach UI imports CSS and is browser-only. Run its pure planning functions in
// the same VM-compatible source mode used by historical Compass tests.
const coachSource=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8')
 .replace(/^import .*;\s*$/gm,'').replace(/export (function|const) /g,'$1 ');
const vmContext={EXERCISES,strengthExerciseLabel:id=>id,NEW_EXERCISES_BY_ID_89:new Map(NEW_EXERCISES_89.map(e=>[e.id,e])),insertOptionalExercise89,
 strengthPeriod:()=>({events:[],sessions:[],unassigned:0}),detailedMuscleData:()=>({regions:{}}),
 Date,Intl,Number,Math,String,console,localStorage:{getItem:()=>null,setItem:()=>{}}};
runInNewContext(coachSource+'\nthis.planNextWorkout=planNextWorkout;',vmContext);
const planNextWorkout=vmContext.planNextWorkout;
const guidedSource=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8')
 .replace(/^import.*$/gm,'').replace(/export (function|const) /g,'$1 ')
 .replace('import.meta.env?.BASE_URL',"'/'");
const guidedContext={Date,Intl,Number,Math,String,RegExp,crypto:{randomUUID:()=> 'test'}};
runInNewContext(guidedSource+'\nthis.makeGuidedSnapshot=makeGuidedSnapshot;',guidedContext);
const makeGuidedSnapshot=guidedContext.makeGuidedSnapshot;
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const expected=['one-arm-dumbbell-snatch','dumbbell-front-squat','dumbbell-walking-lunge','sled-push','farmers-walk','dumbbell-bench-press'];
const baseState={healthImports:{garminStrength:[],garminSessions:[]},strengthJournal:{annotations:[]},strengthGuidedSessions:[]};
test('all six canonical IDs appear exactly once; no existing ID replaced',()=>{
 assert.equal(new Set(EXERCISES.map(e=>e.id)).size,EXERCISES.length);
 assert.deepEqual(NEW_EXERCISES_89.map(e=>e.id),expected);
 for(const id of expected)assert.equal(EXERCISES.filter(e=>e.id===id).length,1);
 for(const id of ['goblet-squat','bench','lunge','dumbbell-floor-press'])assert.equal(EXERCISES.filter(e=>e.id===id).length,1);
});
test('six unique named English/German aliases, metadata, recovery and muscle map',()=>{
 for(const item of NEW_EXERCISES_89){
  assert.equal(typeof STRENGTH_ENGLISH_NAMES[item.id],'string');
  assert.equal(resolveExerciseAlias89(item.german),item.id);
  assert.equal(resolveExerciseAlias89(item.english),item.id);
  assert.equal(resolveExerciseAlias89(item.aliases[0]),item.id);
  assert.equal(manualExerciseMuscles(item.id).primary,item.primary);
  assert.ok(item.recovery&&item.progression&&item.cue&&item.pattern&&item.places.length);
 }
});
test('12 real WebP image files exist in public; manifest maps 6 true start/end pairs',()=>{
 const manifest=JSON.parse(readFileSync(resolve(root,'client/public/strength-visuals-v0589/manifest.json'),'utf8'));
 assert.equal(Object.keys(manifest.images).length,12);
 assert.equal(Object.keys(manifest.exercises).length,6);
 assert.deepEqual(manifest.dimensions,[768,600]);
 for(const info of NEW_EXERCISES_89){
  const imgs=manifest.exercises[info.slug]; assert.ok(imgs);
  assert.notEqual(imgs.start,imgs.end);
  for(const name of [imgs.start,imgs.end]){
   const path=resolve(root,'client/public/strength-visuals-v0589',name);
   assert.ok(statSync(path).size>3000,`${name} contains image bytes`);
   const data=readFileSync(path);
   assert.equal(data.subarray(0,4).toString(),'RIFF');
   assert.equal(data.subarray(8,12).toString(),'WEBP');
  }
 }
});
test('PWA subdirectory BASE_URL determines valid non-overlapping image URLs',()=>{
 for(const item of NEW_EXERCISES_89){
  const urls=exerciseImagePair89(item.id,'/compass/');assert.match(urls.start,/^\/compass\/strength-visuals-v0589\/.+_start\.webp$/);
  assert.match(urls.end,/_end\.webp$/);
 }
 assert.equal(exerciseImagePair89('bench'),null);
});
test('no optional workout changes by default, StrongLifts stays intact',()=>{
 const original=['goblet-squat','dumbbell-row','plank'];
 assert.deepEqual(insertOptionalExercise89(original,{}).ids,original);
 assert.deepEqual(insertOptionalExercise89(original,{optionalExercise:'dumbbell-front-squat',strongLifts:true}).ids,original);
 assert.deepEqual(original,['goblet-squat','dumbbell-row','plank']);
});
test('front squat replaces goblet, bench press requires gym, sled always gym',()=>{
 const original=['goblet-squat','dumbbell-row','plank'];
 const selected=insertOptionalExercise89(original,{optionalExercise:'dumbbell-front-squat'});
 assert.deepEqual(selected.ids,['dumbbell-front-squat','dumbbell-row','plank']);
 assert.deepEqual(insertOptionalExercise89(original,{optionalExercise:'sled-push',equipment:'home'}).ids,original);
 assert.deepEqual(insertOptionalExercise89(original,{optionalExercise:'dumbbell-bench-press',equipment:'home'}).ids,original);
 assert.equal(insertOptionalExercise89(['squat','bench','barbell-row'],{optionalExercise:'sled-push',equipment:'gym'}).ids[0],'sled-push');
});
test('snatch requires explicit technique confirmation and no pain',()=>{
 const original=['goblet-squat','dumbbell-row','plank'];
 assert.deepEqual(insertOptionalExercise89(original,{optionalExercise:'one-arm-dumbbell-snatch'}).ids,original);
 assert.deepEqual(insertOptionalExercise89(original,{optionalExercise:'one-arm-dumbbell-snatch',techniqueApproved:true,pain:true}).ids,original);
 assert.ok(insertOptionalExercise89(original,{optionalExercise:'one-arm-dumbbell-snatch',techniqueApproved:true}).ids.includes('one-arm-dumbbell-snatch'));
});
test('planned extra keeps existing Coach snapshot / confirmation storage',()=>{
 const state=structuredClone(baseState);
 const plan=planNextWorkout(state,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-01',optionalExercise:'dumbbell-front-squat'});
 assert.ok(plan.exercises.some(x=>x.id==='dumbbell-front-squat'));
 assert.equal(plan.exercises.length,3);
 assert.ok(!plan.exercises.some(x=>x.id==='goblet-squat'));
 const snapshot=makeGuidedSnapshot(plan,'2026-11-01T10:00:00Z','test-id');
 assert.equal(snapshot.source,'compass-guided-v5920');
 assert.ok(snapshot.exercises.some(x=>x.exerciseId==='dumbbell-front-squat'));
 assert.ok(snapshot.exercises.every(e=>e.confirmedSets.length===0));
});
test('gym-only extra, StrongLifts variant and exercise dose never auto changed',()=>{
 const base=planNextWorkout(baseState,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-01'});
 assert.ok(base.exercises.every(x=>!expected.includes(x.id)));
 const gym=planNextWorkout(baseState,{goal:'strength',equipment:'gym',mode:'stronglifts',today:'2026-11-01',optionalExercise:'sled-push'});
 assert.equal(gym.mode,'stronglifts');
 assert.deepEqual(gym.exercises.map(x=>x.id),['squat','bench','barbell-row']);
});
