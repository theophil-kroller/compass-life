import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
import {EXERCISE_ANATOMY,EXERCISE_STABILIZERS,ANATOMY_REGIONS,exerciseMuscleRoles122,detailedMuscleData,STABILIZER_COLOR_122} from '../client/src/strength-anatomy-v57737.js';
import {premiumStrengthSvg,strengthPremiumMap} from '../client/src/strength-premium-v57738.js';
import {correctGuidedSessionSetWeight122,correctGuidedSetWeight122,guidedWeightCorrectionView122,parseActualWeight122} from '../client/src/strength-set-corrections-v059122.js';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
const sample=()=>({strengthGuidedSessions:[{id:'s1',source:'compass-guided-v5920',startedAt:'2026-11-03T18:00:00Z',finishedAt:'2026-11-04T08:00:00Z',completed:true,planTitle:'V-Taper',updatedAt:'2026-11-04T08:00:00Z',exercises:[{exerciseId:'goblet-squat',title:'Goblet Squat',confirmedSets:[{setNumber:1,confirmed:true,reps:10,weightKg:9,rir:2,completedAt:'2026-11-03T18:20:00Z',completedDay:'2026-11-03'},{setNumber:2,confirmed:true,reps:11,weightKg:9,rir:2,completedAt:'2026-11-04T07:51:00Z',completedDay:'2026-11-04'}]}]}]});
test('every editorial exercise (66) has a full role definition and explicit stabilization audit',()=>{
 const ids=EXERCISES.map(x=>x.id),regions=new Set(ANATOMY_REGIONS.map(x=>x.id));
 assert.equal(ids.length,68);assert.deepEqual(new Set(ids),new Set(Object.keys(EXERCISE_ANATOMY)));assert.deepEqual(new Set(ids),new Set(Object.keys(EXERCISE_STABILIZERS)));
 for(const id of ids){const roles=exerciseMuscleRoles122(id),all=[...roles.primary,...roles.secondary,...roles.stabilizers];assert.equal(new Set(all).size,all.length,`no overlapping roles ${id}`);for(const r of all)assert.ok(regions.has(r),`${id}: unknown ${r}`);}
});
test('Goblet squat stabilizes both calf heads and shin, but not as hypertrophy sets',()=>{
 const roles=exerciseMuscleRoles122('goblet-squat');
 assert.ok(roles.stabilizers.includes('calves_gastro'));assert.ok(roles.stabilizers.includes('calves_soleus'));assert.ok(roles.stabilizers.includes('tibialis'));
 const data=detailedMuscleData({sessions:[{sets:[{exerciseId:'goblet-squat',reps:10}]}]});
 assert.equal(data.regions.calves_soleus.stabilizing,1);assert.equal(data.regions.calves_soleus.primary,0);assert.equal(data.regions.calves_soleus.secondary,0);assert.equal(data.regions.calves_soleus.index,0);
 assert.equal(data.regions.quadriceps.primary,1);assert.equal(data.regions.glute_max.primary,1);
 assert.equal(data.ranked.some(r=>r.id==='calves_soleus'),false);
});
test('unknown exercise remains unmapped rather than invented muscle work',()=>{
 const data=detailedMuscleData({sessions:[{sets:[{exerciseId:'nonexistent',reps:8}]}]});
 assert.equal(data.unmapped,1);assert.equal(data.regions.calves_soleus.stabilizing,0);
});
test('premium muscle map includes third role legend, per-region data and truthful caveat',()=>{
 const model={today:'2026-11-04',sessions:[{day:'2026-11-04',sets:[{exerciseId:'goblet-squat',reps:10}]}],events:[]};
 const svg=premiumStrengthSvg(model,'back','load',null,'strength');
 assert.match(svg,/stabilizing/);assert.match(svg,/todayStabilizers/);assert.match(svg,/calves_soleus/);
 const html=strengthPremiumMap(model,null,'strength');
 assert.ok(html.includes(STABILIZER_COLOR_122));assert.match(html,/kein Wachstumssatz/);assert.match(html,/keine EMG-Messung/);
});
test('after-confirmation correction changes only the intended set and keeps the original day/time',()=>{
 const st=sample(),before=structuredClone(st),now='2026-11-04T21:20:00Z';
 const result=correctGuidedSetWeight122(st,{sessionId:'s1',exerciseId:'goblet-squat',setNumber:1,weightKg:'11,0',now});
 assert.deepEqual(result,{changed:true,weightKg:11,oldWeightKg:9});
 const s=st.strengthGuidedSessions[0].exercises[0].confirmedSets;
 assert.equal(s[0].weightKg,11);assert.equal(s[1].weightKg,9);assert.equal(s[0].completedAt,before.strengthGuidedSessions[0].exercises[0].confirmedSets[0].completedAt);
 assert.equal(s[0].completedDay,'2026-11-03');assert.equal(st.strengthGuidedSessions[0].updatedAt,now);
 assert.equal(s[0].weightCorrections.length,1);assert.deepEqual(s[0].weightCorrections[0],{at:now,fromKg:9,toKg:11});
});
test('same correction is idempotent, bad values and nonconfirmed sets are rejected',()=>{
 const st=sample(),at='2026-11-04T21:20:00Z';
 correctGuidedSetWeight122(st,{sessionId:'s1',exerciseId:'goblet-squat',setNumber:1,weightKg:11,now:at});
 const noOp=correctGuidedSetWeight122(st,{sessionId:'s1',exerciseId:'goblet-squat',setNumber:1,weightKg:11,now:at});
 assert.equal(noOp.changed,false);assert.equal(st.strengthGuidedSessions[0].exercises[0].confirmedSets[0].weightCorrections.length,1);
 for(const value of ['',null,-1,'abc',999])assert.throws(()=>parseActualWeight122(value));
 assert.throws(()=>correctGuidedSetWeight122(st,{sessionId:'s1',exerciseId:'goblet-squat',setNumber:99,weightKg:11}));
});
test('correction is used by the canonical strength view and volume, not a parallel table',()=>{
 const st=sample();
 const before=strengthPeriod(st,{range:'7',today:'2026-11-04'});
 correctGuidedSetWeight122(st,{sessionId:'s1',exerciseId:'goblet-squat',setNumber:1,weightKg:11,now:'2026-11-04T21:20:00Z'});
 const after=strengthPeriod(st,{range:'7',today:'2026-11-04'});
 assert.equal(after.activeSets,before.activeSets);assert.equal(after.trainingDays,2);
 assert.ok(after.volumeKg>before.volumeKg,`expected volume to reflect corrected weight (${before.volumeKg} to ${after.volumeKg})`);
 assert.ok(after.events.some(e=>e.exerciseId==='goblet-squat'&&e.weightKg===11));
});
test('historical completed workouts have accessible per-set edit controls',()=>{
 const html=guidedWeightCorrectionView122(sample());
 assert.match(html,/Tatsächliche Satzgewichte korrigieren/);assert.match(html,/data-session-id="s1"/);assert.match(html,/data-set-number="1"/);assert.match(html,/data-set-number="2"/);assert.match(html,/name="actualWeightKg"/);assert.match(html,/2026-11-03/);
});
test('the guided workout has after-confirmation editable actual weights and persists them',()=>{
 const s=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
 assert.match(s,/data-act="set-weight"/);assert.match(s,/correctGuidedSessionSetWeight122\(snapshot/);assert.match(s,/void persist\(\)\.catch/);
});
test('coach ranks latest same-day workout chronologically instead of choosing most sets',()=>{
 const s=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 const m=s.match(/export function strengthProgressionForExercise\([\s\S]*?\n}\n\nfunction nextStrongLiftsVariant/);
 assert.ok(m,'progression function found');
 const context={HOME_EQUIPMENT:{availablePlateKg:28}};
 vm.runInNewContext(m[0].replace(/^export /,'').replace(/\n\nfunction nextStrongLiftsVariant$/,'')+'\nthis.progression=strengthProgressionForExercise;',context);
 const old=[{exerciseId:'goblet-squat',day:'2026-11-04',sessionId:'old',weightKg:9,reps:12,completedAt:'2026-11-04T07:00:00Z'},{exerciseId:'goblet-squat',day:'2026-11-04',sessionId:'old',weightKg:9,reps:12,completedAt:'2026-11-04T07:01:00Z'},{exerciseId:'goblet-squat',day:'2026-11-04',sessionId:'old',weightKg:9,reps:12,completedAt:'2026-11-04T07:02:00Z'}];
 const newest={exerciseId:'goblet-squat',day:'2026-11-04',sessionId:'latest',weightKg:11,reps:8,completedAt:'2026-11-04T18:00:00Z'};
 const result=context.progression({valid:[...old,newest]},'goblet-squat',{reps:'8–12',sets:3,equipment:'home'});
 assert.equal(result.lastKg,11);assert.equal(result.previousSets,1);assert.notEqual(result.action,'increase-load');
});
test('calf raise remains a V-taper candidate with documented primary calf activation',async()=>{
 const s=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 assert.match(s,/'calf-raise':\[2,'10–15',60\]/);
 const {vtaperCandidates135}=await import('../client/src/strength-vtaper-balance-v059135.js');
 assert.ok(vtaperCandidates135('home',{cableReady:false,pullupReady:false}).includes('calf-raise'));
 const data=detailedMuscleData({sessions:[{sets:[{exerciseId:'calf-raise',reps:12}]}]});
 assert.equal(data.regions.calves_soleus.primary,1);assert.equal(data.regions.calves_gastro.primary,1);
});
