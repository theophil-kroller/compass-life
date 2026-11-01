import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NEW_EXERCISES_89,guidedBonusCandidate92,suggestOptionalExercise90} from '../client/src/strength-exercise-library-v0589.js';
import {EXERCISES,canonicalGarminExercise92,applyStrengthAnnotations} from '../client/src/strength-editor-v57732.js';
import {detailedMuscleData} from '../client/src/strength-anatomy-v57737.js';
const guide=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/strength-guided-v5775920.css',import.meta.url),'utf8');
const core=[
 {id:'dumbbell-row',title:'Kurzhantelrudern',sets:3,reps:'8–12',restSeconds:90},
 {id:'dumbbell-lateral-raise',title:'Seitheben',sets:3,reps:'12–15',restSeconds:60},
 {id:'dumbbell-pullover',title:'Pullover',sets:2,reps:'10–12',restSeconds:75}
];
const base={title:'V-Taper',goal:'vtaper',mode:'smart',equipment:'home',exercises:core};
test('the three mandatory exercises stay untouched and a fourth proposal can be shown at 25 minutes',()=>{
 const suggestion=suggestOptionalExercise90({plannedIds:core.map(e=>e.id),goal:'vtaper',equipment:'home',minutes:25,availableMinutes:0,today:'2026-11-01'});
 assert.ok(suggestion,'lack of free time must not hide a safe optional suggestion');
 const bonus=guidedBonusCandidate92({...base,suggestedOptional:suggestion});
 assert.ok(bonus);assert.equal(bonus.optional,true);assert.equal(bonus.order,4);
 assert.equal(bonus.id,suggestion.id);assert.equal(base.exercises.length,3);
 assert.equal(NEW_EXERCISES_89.some(e=>e.id===bonus.id),true);
});
test('no bonus for unrecognized options, stronglifts, or no safety clearance',()=>{
 assert.equal(guidedBonusCandidate92({...base,mode:'stronglifts',suggestedOptional:{id:'farmers-walk'}}),null);
 assert.equal(guidedBonusCandidate92({...base,suggestedOptional:{id:'one-arm-dumbbell-snatch'}}),null);
 assert.equal(guidedBonusCandidate92({...base,suggestedOptional:{id:'sled-push'}}),null);
 assert.equal(guidedBonusCandidate92({...base,suggestedOptional:null}),null);
});
test('the guided player presents four cards before recording any optional sets',()=>{
 assert.match(guide,/Vier Trainingsfelder/);
 assert.match(guide,/ÜBUNG 4 · FREIWILLIG/);
 assert.match(guide,/data-act="accept-bonus"/);
 assert.match(guide,/data-act="skip-bonus"/);
 assert.match(guide,/if\(optionalChoice!=='accepted'\)setBonusChoice\('skipped'\)/);
 assert.match(guide,/choice==='accepted'&&bonusCandidate\?\[\.\.\.coreExercises,bonusCandidate\]:coreExercises/);
 assert.match(guide,/confirmedSets:\[\]/);
 assert.match(guide,/plan\.mode==='stronglifts'/);
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/@media\(max-width:600px\)/);
});
test('identified Garmin FIT titles are mapped to exact names only',()=>{
 assert.equal(canonicalGarminExercise92({identified:true,exercise:'One-Arm Dumbbell Row'}),'dumbbell-row');
 assert.equal(canonicalGarminExercise92({identified:true,exercise:'Dumbbell Bench Press'}),'dumbbell-bench-press');
 assert.equal(canonicalGarminExercise92({identified:true,exercise:"Farmer's Walk"}),'farmers-walk');
 assert.equal(canonicalGarminExercise92({identified:true,exercise:'Dumbbell Walking Lunge'}),'dumbbell-walking-lunge');
 assert.equal(canonicalGarminExercise92({identified:true,exercise:'Bench Press'}),null);
 assert.equal(canonicalGarminExercise92({identified:false,exercise:'Dumbbell Bench Press'}),null);
 assert.equal(canonicalGarminExercise92({identified:true,exercise:'Krafttraining'}),null);
});
test('identified Garmin FIT exercises receive primary and secondary roles, once',()=>{
 const session={id:'session-1',start:'2026-11-01T09:00:00Z',day:'2026-11-01',sets:[
  {index:0,identified:true,exercise:'Dumbbell Bench Press',reps:10,weightKg:12},
  {index:1,identified:true,exercise:'Farmer Carry',reps:1,weightKg:15},
  {index:2,identified:false,exercise:'Row',reps:10,weightKg:25}
 ]};
 const state={strengthJournal:{annotations:[]}};
 const once=applyStrengthAnnotations(state,[session])[0];
 assert.equal(once.sets[0].exerciseId,'dumbbell-bench-press');
 assert.equal(once.sets[0].primary,'chest');
 assert.ok(once.sets[0].secondary.includes('triceps'));
 assert.equal(once.sets[1].exerciseId,'farmers-walk');
 assert.equal(once.sets[2].exerciseId,undefined);
 const twice=applyStrengthAnnotations(state,[once])[0];
 assert.equal(twice.sets.length,3,'does not add duplicate sets');
 const anatomy=detailedMuscleData({sessions:[twice]});
 assert.equal(anatomy.mapped,2);
 assert.ok(anatomy.regions.pectoral_lower.primary>0);
 assert.ok(anatomy.regions.triceps.secondary>0);
 assert.ok(anatomy.regions.forearm_flex.primary>0);
 assert.equal(anatomy.unmapped,1);
});
test('manual Garmin annotation beats automatic title match',()=>{
 const session={id:'session-2',start:'2026-11-01T09:00:00Z',sets:[{identified:true,exercise:'Dumbbell Bench Press',reps:12,weightKg:12}]};
 const state={strengthJournal:{annotations:[{sessionId:'session-2',updatedAt:'2026-11-01T12:00:00Z',sets:[{exerciseId:'goblet-squat',reps:12,weightKg:14}]}]}};
 const mapped=applyStrengthAnnotations(state,[session]);
 assert.equal(mapped[0].sets[0].exerciseId,'goblet-squat');
 assert.equal(mapped[0].sets[0].primary,'quads');
});
test('time-based Farmer Carry and Sled Push are mapped without fabricated repetitions',()=>{
 const result=detailedMuscleData({sessions:[{sets:[{exerciseId:'farmers-walk',reps:null,durationSeconds:35},{exerciseId:'sled-push',reps:null,durationSeconds:20}]}]});
 assert.equal(result.mapped,2);
 assert.ok(result.regions.forearm_flex.primary>0);
 assert.ok(result.regions.quadriceps.primary>0);
});
test('new movements each have canonical muscle mapping in detailed Muscle Map',()=>{
 for(const entry of NEW_EXERCISES_89){
  assert.ok(EXERCISES.some(x=>x.id===entry.id));
  const result=detailedMuscleData({sessions:[{sets:[{exerciseId:entry.id,reps:8}]}]});
  assert.equal(result.mapped,1,entry.id);
  assert.ok(result.ranked.some(x=>x.primary>0),entry.id);
  assert.ok(result.ranked.some(x=>x.secondary>0),entry.id);
 }
});
