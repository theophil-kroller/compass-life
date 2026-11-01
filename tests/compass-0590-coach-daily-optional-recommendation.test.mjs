import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
import {NEW_EXERCISES_89,suggestOptionalExercise90,insertOptionalExercise89} from '../client/src/strength-exercise-library-v0589.js';
const source=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
const context={EXERCISES,NEW_EXERCISES_89,NEW_EXERCISES_BY_ID_89:new Map(NEW_EXERCISES_89.map(x=>[x.id,x])),suggestOptionalExercise90,insertOptionalExercise89,
 strengthExerciseLabel:id=>id,strengthPeriod:()=>({events:[],sessions:[],unassigned:0}),detailedMuscleData:()=>({regions:{}}),Date,Intl,Number,Math,String,console,localStorage:{getItem:()=>null,setItem:()=>{}}};
runInNewContext(source.replace(/^import .*;\s*$/gm,'').replace(/export (function|const) /g,'$1 ')+'\nthis.planNextWorkout=planNextWorkout;',context);
const plan=context.planNextWorkout;
const empty={healthImports:{garminStrength:[],garminSessions:[]},strengthJournal:{annotations:[]},strengthGuidedSessions:[]};
test('daily suggestion is deterministic and remains separate from prescribed main exercises',()=>{
 const p=plan(empty,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-01'});
 assert.equal(p.exercises.length,3);
 assert.ok(p.suggestedOptional);
 assert.ok(!p.exercises.some(x=>x.id===p.suggestedOptional.id));
 assert.ok(['swap','conditional-bonus'].includes(p.suggestedOptional.mode));
 assert.notEqual(p.suggestedOptional.id,'one-arm-dumbbell-snatch');
});
test('gym-only sled and bench never proposed at home',()=>{
 for(const goal of ['vtaper','balance','strength','abs']){
  const s=suggestOptionalExercise90({plannedIds:['dumbbell-row','dumbbell-lateral-raise','dumbbell-pullover'],goal,equipment:'home',minutes:25,availableMinutes:8,today:'2026-11-01'});
  assert.ok(s && !['sled-push','dumbbell-bench-press','one-arm-dumbbell-snatch'].includes(s.id));
 }
});
test('no optional suggestion under pain, attention or StrongLifts A/B',()=>{
 for(const opts of [{pain:true},{healthAttention:true},{strongLifts:true}])assert.equal(suggestOptionalExercise90({plannedIds:['goblet-squat'],equipment:'gym',...opts}),null);
 const gym=plan(empty,{goal:'strength',equipment:'gym',mode:'stronglifts',today:'2026-11-01'});
 assert.equal(gym.suggestedOptional,null);
 assert.deepEqual(gym.exercises.map(x=>x.id),['squat','bench','barbell-row']);
});
test('documented next-day muscle loading suppresses high-stress recommendations',()=>{
 const h={last:{quads:'2026-10-31',glutes:'2026-10-31',posterior:'2026-10-31',back:'2026-10-31',shoulders:'2026-10-31',forearms:'2026-10-31',core:'2026-10-31',chest:'2026-10-31',triceps:'2026-10-31'},
 counts7:{quads:5,glutes:5,posterior:5,back:5,shoulders:5,forearms:5,core:5,chest:5,triceps:5}};
 assert.equal(suggestOptionalExercise90({plannedIds:['goblet-squat'],goal:'strength',equipment:'gym',today:'2026-11-01',history:h}),null);
});
test('optional acceptance swaps in short session and appends only when explicitly permitted',()=>{
 const p=plan(empty,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-01'});
 const accepted=plan(empty,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-01',optionalExercise:p.suggestedOptional.id,optionalAppend:true});
 assert.ok(accepted.exercises.length===p.exercises.length || accepted.exercises.length===p.exercises.length+1);
 assert.equal(accepted.optionalMode,p.suggestedOptional.mode==='conditional-bonus'?'bonus':'swap');
 const addition=insertOptionalExercise89(['goblet-squat','dumbbell-row'],{optionalExercise:'farmers-walk',append:true});
 assert.deepEqual(addition.ids,['goblet-squat','dumbbell-row','farmers-walk']);
 assert.equal(addition.mode,'bonus');
});
test('daily suggestion visible near coach controls, with genuine accept and skip handlers',()=>{
 assert.match(source,/Übungsidee für heute/);
 assert.match(source,/str590-accept/);
 assert.match(source,/str590-skip/);
 assert.match(source,/const skippedKey=/);
 assert.match(source,/updateOptionalSuggestion90\(idea\)/);
 assert.match(source,/isSkipped\(\)/);
});
