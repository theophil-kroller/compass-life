import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activeChallenge42,challengeBadge42} from '../client/src/strength-challenge-v059142.js';
import {progressionGroup142,exerciseProgressionView141} from '../client/src/strength-exercise-progression-v059141.js';
const sets=(day,rir=4,kg=7,reps=11)=>[1,2,3].map(setNumber=>({confirmed:true,setNumber,reps,weightKg:kg,rir,completedDay:day,completedAt:`${day}T18:0${setNumber}:00Z`}));
const workout=(date,rir=4,kg=7,reps=11)=>({id:date,source:'compass-guided-v5920',startedAt:`${date}T18:00:00Z`,completed:true,finishedAt:`${date}T19:00:00Z`,exercises:[{exerciseId:'dumbbell-lateral-raise',confirmedSets:sets(date,rir,kg,reps)}]});
const dec={action:'hold-reps',load:{plateKg:7},next:{plateKg:8}};
test('active coach suggests next realistically achievable dumbbell load on high reserve, never logs it',()=>{
 const state={strengthGuidedSessions:[workout('2026-11-11')]},before=structuredClone(state);
 const x=activeChallenge42({state,exerciseId:'dumbbell-lateral-raise',today:'2026-11-12',lastKg:7,reps:'8–12',plannedSets:3,equipmentDecision:dec});
 assert.equal(x.kind,'load-trial');assert.equal(x.candidateKg,8);assert.match(x.detail,/ersten Arbeitssatz/);
 assert.deepEqual(state,before);assert.match(challengeBadge42(x),/Gewichts-Challenge/);
});
test('Repeated high rep work on distinct days earns a tentative trial without invented RIR',()=>{
 const state={strengthGuidedSessions:[workout('2026-11-09',undefined,7,12),workout('2026-11-11',undefined,7,12)]};
 state.strengthGuidedSessions.forEach(w=>w.exercises[0].confirmedSets.forEach(s=>delete s.rir));
 const x=activeChallenge42({state,exerciseId:'dumbbell-lateral-raise',today:'2026-11-12',lastKg:7,reps:'8–12',plannedSets:3,equipmentDecision:dec});
 assert.equal(x.kind,'load-trial');assert.equal(x.candidateKg,8);
});
test('no extra weight under recovery alert, pain, or outsized plate increment',()=>{
 const state={strengthGuidedSessions:[workout('2026-11-11')]};
 for(const flags of [{pain:true},{healthAttention:true},{deload:true}]){
  const x=activeChallenge42({state,exerciseId:'dumbbell-lateral-raise',today:'2026-11-12',lastKg:7,reps:'8–12',plannedSets:3,equipmentDecision:dec,...flags});
  assert.equal(x.kind,'recovery');assert.equal(x.candidateKg,null);
 }
 const x=activeChallenge42({state,exerciseId:'dumbbell-lateral-raise',today:'2026-11-12',lastKg:7,reps:'8–12',plannedSets:3,equipmentDecision:{...dec,next:{plateKg:10}}});
 assert.equal(x.kind,'reps');assert.equal(x.candidateKg,null);
});
test('training progress organizes by primary V-taper anatomy category',()=>{
 assert.equal(progressionGroup142('dumbbell-lateral-raise'),'shoulders');
 assert.equal(progressionGroup142('ab-wheel-kneeling'),'core');
 assert.equal(progressionGroup142('dumbbell-row'),'back');
 assert.equal(progressionGroup142('goblet-squat'),'lower');
 assert.equal(progressionGroup142('dumbbell-floor-press'),'other');
 const out=exerciseProgressionView141({sessions:[{day:'2026-11-01',sets:[{exerciseId:'dumbbell-row',weightKg:10,reps:10},{exerciseId:'dumbbell-lateral-raise',weightKg:6,reps:10}]},{day:'2026-11-10',sets:[{exerciseId:'dumbbell-row',weightKg:11,reps:10},{exerciseId:'dumbbell-lateral-raise',weightKg:7,reps:12}]}]});
 assert.ok(out.indexOf('Schultern')<out.indexOf('Rücken'));assert.match(out,/2 Übungen mit höherer Arbeitslast/);
 assert.match(out,/Seit Beginn \+1 kg Arbeitslast/);
});
test('coach and guided player place a reversible challenge in the actual workout preview',()=>{
 const coach=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 const guide=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
 assert.match(coach,/corrected\.suggestedKg=challenge42\.candidateKg/);
 assert.match(guide,/challenge42:e\.challenge42/);
 assert.match(guide,/challengeBadge42\(exercise\.challenge42\)/);
 assert.match(guide,/challengeBadge42\(curr\.challenge42\)/);
 assert.match(guide,/plan\.exercises\[i\]\?\.suggestedKg/);
});
test('interrupted workouts preserve the precise coach challenge and suggested load',async()=>{
 const {guidedPlanFromSession}=await import('../client/src/strength-workout-resume-v57759405.js');
 const snapshot={source:'compass-guided-v5920',goal:'vtaper',equipment:'home',title:'V-Taper',exercises:[{exerciseId:'dumbbell-lateral-raise',title:'Seitheben',plannedSets:3,plannedReps:'8–12',confirmedSets:[]}],planSnapshot:{exercises:[{id:'dumbbell-lateral-raise',title:'Seitheben',suggestedKg:8,lastKg:7,challenge42:{kind:'load-trial',candidateKg:8,title:'Gewichts-Challenge',detail:'Sauber testen'}}]}};
 const restored=guidedPlanFromSession(snapshot);
 assert.equal(restored.exercises[0].suggestedKg,8);
 assert.equal(restored.exercises[0].challenge42.kind,'load-trial');
});
