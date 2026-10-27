import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {coachRestEvidence47,coachPlateau47,coachPlateauRestPlan47,coachFitdaysSegments47,coachPlateauView47} from '../client/src/strength-plateau-v57759407.js';
import {compass59407PlateauRelease} from '../client/compass59407-plateau-release.js';
const dates=['2026-09-24','2026-10-02','2026-10-12','2026-10-25'];
function session(day,reps=10,rir=2,rest=90){
 const sets=[1,2,3].map((n)=>({confirmed:true,setNumber:n,reps,weightKg:8,rir,
   completedAt:`${day}T09:${String(n*5).padStart(2,'0')}:00Z`,
   ...(n>1&&rest!==null?{setStartedAt:new Date(Date.parse(`${day}T09:${String((n-1)*5).padStart(2,'0')}:00Z`)+rest*1000).toISOString()}:{} )}));
 return {source:'compass-guided-v5920',id:day,completed:true,startedAt:`${day}T09:00:00Z`,exercises:[{exerciseId:'dumbbell-row',confirmedSets:sets}]};
}
const state=(reps=[10,10,10,10],rest=90,rir=2)=>({strengthGuidedSessions:dates.map((d,i)=>session(d,reps[i],rir,rest))});
test('actual rest requires explicitly marked next-set start, not confirmation spacing',()=>{
 const e=session(dates[0],10,2,90).exercises[0];
 assert.deepEqual(coachRestEvidence47(e).measuredSeconds,[90,90]);
 e.confirmedSets.forEach(s=>delete s.setStartedAt);
 const x=coachRestEvidence47(e);assert.equal(x.medianMeasuredSeconds,null);assert.equal(x.intervalCount,2);
});
test('four comparable completed sessions spanning 21+ days suggest more rest, not a false growth diagnosis',()=>{
 const v=coachPlateau47(state(),'dumbbell-row',{today:'2026-10-27',primary:'back',weeklyKnownSets:7});
 assert.equal(v.status,'possible-plateau');assert.equal(v.action,'longer-rest');assert.equal(v.restMedianSeconds,90);
 assert.match(v.reason,/180 s/);
});
test('progression is not mislabeled plateau, missing rest cannot be treated as short rest',()=>{
 assert.equal(coachPlateau47(state([8,9,9,11]),'dumbbell-row',{today:'2026-10-27'}).status,'progressing');
 const v=coachPlateau47(state([10,10,10,10],null),'dumbbell-row',{today:'2026-10-27',primary:'back',weeklyKnownSets:15});
 assert.equal(v.action,'measure-rest');
 assert.equal(v.restMedianSeconds,null);
 assert.equal(coachPlateau47({strengthGuidedSessions:[]},'dumbbell-row',{today:'2026-10-27'}).status,'insufficient');
});
test('no automatic extra sets when recovery warning, and high RIR suggests reps before volume',()=>{
 const v=coachPlateau47(state([10,10,10,10],180,4),'dumbbell-row',{today:'2026-10-27',primary:'back',weeklyKnownSets:3});
 assert.equal(v.action,'progress-reps');
 assert.equal(coachPlateau47(state(),'dumbbell-row',{today:'2026-10-27',primary:'back',healthAttention:true}).action,'longer-rest'); // rest is separately observed as short
 assert.equal(coachPlateau47(state([10,10,10,10],180,0),'dumbbell-row',{today:'2026-10-27',primary:'back',healthAttention:true}).action,'consider-deload');
});
test('Fitdays five-region 6+ readings spaced 28+ days are exploratory trends, no unsupported growth attribution',()=>{
 const days=['2026-08-01','2026-08-05','2026-08-08','2026-10-12','2026-10-15','2026-10-20'];
 const st={healthImports:{fitdays:days.map((day,i)=>({day,at:`${day}T07:00:00Z`,segmentMuscle:{leftArm:{kg:i<3?3:3.1},rightArm:{kg:i<3?3.2:3.4},trunk:{kg:i<3?22:22.3},leftLeg:{kg:10},rightLeg:{kg:10}}}))}};
 const r=coachFitdaysSegments47(st,{today:'2026-10-27'});
 assert.equal(r.status,'exploratory');assert.equal(r.rows.length,5);
 assert.equal(r.rows.find(x=>x.key==='leftArm').deltaKg,.1);
 assert.match(r.message,/kein direkter Nachweis/i);
 const x=coachPlateauView47(st,{goal:'vtaper',exercises:[],health:{}},'2026-10-27');
 assert.match(x,/Fitdays/);
 assert.match(x,/0.10 kg/);
 assert.equal(coachFitdaysSegments47({healthImports:{fitdays:days.slice(0,3).map(day=>({day,segmentMuscle:{trunk:{kg:20}}}))}},{today:'2026-10-27'}).status,'insufficient');
});
test('proposed rest experiment changes only future plan and recomputes time budget',()=>{
 const plan={goal:'vtaper',budget:45,estimatedMinutes:35,timeFit:'fits',health:{},exercises:[{id:'dumbbell-row',primary:'back',sets:3,restSeconds:90,progressionHint:'Vorheriges Training'}]};
 const next=coachPlateauRestPlan47(state(),plan,'2026-10-27');
 assert.equal(plan.exercises[0].restSeconds,90);
 assert.equal(next.exercises[0].restSeconds,180);
 assert.equal(next.estimatedMinutes,38);
 assert.match(next.exercises[0].progressionHint,/Pausenexperiment/);
 assert.equal(next.plateauExperiments47.length,1);
 assert.equal(coachPlateauRestPlan47(state([8,9,10,11]),plan,'2026-10-27'),plan);
});
test('complete Vite chain transforms coach, guided set tracking and main to .40.7',async()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 const imports=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...cfg.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 assert.equal(names.at(-1),'compass59408ProjectsExperimentsRelease');
 for(const file of ['main.js','strength-coach-v5775910.js','strength-guided-v5775920.js']){
  let code=readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
  for(const name of names){const mod=await import(new URL('../client/'+imports.get(name),import.meta.url));const res=mod[name]().transform(code,'/repo/client/src/'+file);if(res?.code)code=res.code;}
  execFileSync(process.execPath,['--input-type=module','--check'],{input:code});
  if(file==='main.js')assert.match(code,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.8'/);
  if(file.startsWith('strength-coach')){assert.match(code,/coachPlateauView47\(state,plan,today\)/);assert.match(code,/coachPlateauRestPlan47\(state,planNextWorkout/);}
  if(file.startsWith('strength-guided')){assert.match(code,/pendingSetStarts47/);assert.match(code,/data-act="begin-set"/);assert.match(code,/restActualSeconds:observed/);assert.match(code,/data-act="extend-rest"/);}
 }
});
