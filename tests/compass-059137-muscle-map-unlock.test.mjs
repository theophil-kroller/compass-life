import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXERCISES,canonicalGarminExercise92,applyStrengthAnnotations} from '../client/src/strength-editor-v57732.js';
import {ANATOMY_REGIONS,EXERCISE_ANATOMY,EXERCISE_STABILIZERS,exerciseMuscleRoles122,detailedMuscleData,isAnatomyClassifiedSet137} from '../client/src/strength-anatomy-v57737.js';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
import {premiumStrengthSvg,premiumMuscleHighlight125} from '../client/src/strength-premium-v57738.js';
import {libraryMuscleRoles137} from '../client/src/strength-library-roles-v059137.js';
import {UNLOCK_STAGE_137,reportUnlockStage137} from '../client/src/unlock-feedback-v059137.js';
const root=new URL('../',import.meta.url);
const src=p=>readFileSync(new URL(p,root),'utf8');
const regionIds=new Set(ANATOMY_REGIONS.map(x=>x.id));

test('Every current exercise has one unambiguous anatomical primary, secondary and stabilizer assignment',()=>{
 assert.equal(EXERCISES.length,68);
 assert.equal(new Set(EXERCISES.map(x=>x.id)).size,EXERCISES.length);
 assert.equal(Object.keys(EXERCISE_ANATOMY).length,EXERCISES.length);
 assert.equal(Object.keys(EXERCISE_STABILIZERS).length,EXERCISES.length);
 for(const ex of EXERCISES){
  const r=exerciseMuscleRoles122(ex.id);
  assert.ok(r?.primary.length,`No primary muscles: ${ex.id}`);
  assert.deepEqual(Object.keys(r).sort(),['primary','secondary','stabilizers'].sort());
  const groups=[...r.primary,...r.secondary,...r.stabilizers];
  assert.equal(new Set(groups).size,groups.length,`Overlapping roles: ${ex.id}`);
  for(const g of groups)assert.ok(regionIds.has(g),`${ex.id}: unknown region ${g}`);
  const ui=libraryMuscleRoles137(ex.id);
  assert.ok(ui?.primary.length,`Library missing ${ex.id}`);
  assert.equal(ui.primary.length,r.primary.length);
  assert.equal(ui.secondary.length,r.secondary.length);
  assert.equal(ui.stabilizers.length,r.stabilizers.length);
 }
});

test('Reverse fly paints posterior delts red on the day of real confirmed sets',()=>{
 const model=strengthPeriod({strengthGuidedSessions:[{
  id:'guided-1',source:'compass-guided-v5920',startedAt:'2026-11-08T13:30:00+01:00',
  completed:true,finishedAt:'2026-11-08T13:50:00+01:00',exercises:[{
   exerciseId:'reverse-fly',confirmedSets:[{confirmed:true,setNumber:1,reps:12,weightKg:7,completedDay:'2026-11-08',completedAt:'2026-11-08T13:43:00+01:00'}]
  }]
 }]},{today:'2026-11-08',range:'7'});
 assert.equal(model.coachSources.coachSets,1);
 const m=detailedMuscleData(model);
 assert.equal(m.regions.deltoid_rear.primary,1);
 assert.equal(m.regions.rhomboids.secondary,1);
 assert.equal(m.regions.erector_spinae.stabilizing,1);
 const svg=premiumStrengthSvg(model,'back','roles',{rides:0},'strength');
 const match=svg.match(/data-anatomy-info="([^"]+)"/);
 assert.ok(match);
 const info=JSON.parse(match[1].replaceAll('&quot;','"').replaceAll('&amp;','&'));
 assert.ok(info.todayRegions.includes('deltoid_rear'));
 assert.ok(info.supportingRegions.includes('rhomboids'));
 assert.ok(info.todayStabilizers.includes('erector_spinae'));
 assert.equal(premiumMuscleHighlight125(info,'deltoid_rear').fill,'#ed4b42');
 assert.equal(premiumMuscleHighlight125(info,'rhomboids').fill,'#f0c955');
});

test('A set from yesterday is orange today, without silently rewriting its date',()=>{
 const model={today:'2026-11-08',sessions:[{day:'2026-11-07',sets:[{exerciseId:'reverse-fly',reps:10}]}]};
 const svg=premiumStrengthSvg(model,'back','roles',{rides:0},'strength');
 const info=JSON.parse(svg.match(/data-anatomy-info="([^"]+)"/)[1].replaceAll('&quot;','"'));
 assert.equal(premiumMuscleHighlight125(info,'deltoid_rear').fill,'#ee963a');
 assert.ok(!info.todayRegions.includes('deltoid_rear'));
});

test('Confirmed set with missing repetitions remains mapped; unknown Garmin summary does not',()=>{
 const confirmed={exerciseId:'reverse-fly',confirmed:true,source:'compass-guided-confirmed',reps:null};
 assert.equal(isAnatomyClassifiedSet137(confirmed),true);
 assert.equal(isAnatomyClassifiedSet137({exerciseId:'reverse-fly',reps:null,source:'garmin-fit-set'}),false);
 assert.equal(isAnatomyClassifiedSet137({exerciseId:'reverse-fly',reps:10}),true);
 const data=detailedMuscleData({sessions:[{sets:[confirmed,{exerciseId:'reverse-fly',reps:null,source:'garmin-fit-set'}]}]});
 assert.equal(data.regions.deltoid_rear.primary,1);
 assert.equal(data.mapped,1);
 assert.equal(data.unmapped,1);
 const svg=premiumStrengthSvg({today:'2026-11-08',sessions:[{day:'2026-11-08',sets:[confirmed]}]},'back','roles',{},'strength');
 const info=JSON.parse(svg.match(/data-anatomy-info="([^"]+)"/)[1].replaceAll('&quot;','"'));
 assert.ok(info.todayRegions.includes('deltoid_rear'));
});

test('Only explicit, identified reverse-fly variants map automatically; generic FIT entries never guessed',()=>{
 for(const title of ['Dumbbell Reverse Fly','Reverse Dumbbell Fly','Seated Bent Over Rear Delt Raise','Seated Bent-Over Rear Delt Raise','Dumbbell Rear Delt Fly']){
  assert.equal(canonicalGarminExercise92({exercise:title,identified:true}),'reverse-fly',title);
 }
 assert.equal(canonicalGarminExercise92({exercise:'Fly',identified:true}),null);
 assert.equal(canonicalGarminExercise92({exercise:'Dumbbell Reverse Fly',identified:false}),null);
 assert.equal(canonicalGarminExercise92({exercise:'Unrecognized exercise',identified:true}),null);
 const updated=applyStrengthAnnotations({},[{id:'garmin-1',start:'2026-11-08T10:00:00Z',sets:[{
  exercise:'Reverse Dumbbell Fly',identified:true,reps:15,weightKg:4,category:9
 }]}]);
 assert.equal(updated[0].sets[0].exerciseId,'reverse-fly');
 assert.equal(updated[0].sets[0].knownMuscles,true);
});

test('Library displays the same canonical anatomical groups as red/yellow/turquoise map',()=>{
 const ui=src('client/src/strength-exercise-library-ui-v059131.js');
 assert.match(ui,/libraryMuscleRoles137\(ex.id\)/);
 assert.match(ui,/str137-muscle-roles/);
 assert.deepEqual(libraryMuscleRoles137('reverse-fly').primary,['Hintere Schulter']);
 assert.ok(libraryMuscleRoles137('reverse-fly').secondary.includes('Rautenmuskel'));
 assert.ok(libraryMuscleRoles137('reverse-fly').stabilizers.includes('Rückenstrecker'));
});

test('Unlock indicator attaches to the real vault form; every stage visible, errors clear it',()=>{
 const overlay=src('client/src/ars-vivendi-lock-full-v5775922.js');
 const main=src('client/src/main-full-v57759402510.js');
 const helper=src('client/src/unlock-feedback-v059137.js');
 const css=src('client/src/unlock-feedback-v059137.css');
 assert.match(overlay,/detachProgress=attachUnlockProgress137\(shell\)/);
 assert.match(overlay,/detachProgress\?\.\(\)/);
 assert.match(main,/reportUnlockStage137\('decrypt'\)/);
 for(const phase of ['drafts','merge','capture','render','error'])assert.match(main,new RegExp(`reportUnlockStage137\\('${phase}'\\)`));
 for(const phase of ['decrypt','drafts','merge','capture','render'])assert.ok(UNLOCK_STAGE_137[phase]);
 assert.match(helper,/slot\.after\(progress\)/);
 assert.match(helper,/submit\.disabled=start/);
 assert.match(helper,/progress\.hidden=!start/);
 assert.match(css,/prefers-reduced-motion/);
 assert.doesNotMatch(helper,/passphrase|\.value|localStorage|vault\.unlock/);
 assert.equal(reportUnlockStage137('decrypt'),undefined);
});
