import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {guidedPlanFromSession} from '../client/src/strength-workout-resume-v57759405.js';
import {rirProgression46,latestCoachRirSession46} from '../client/src/strength-rir-progress-v57759406.js';
import {locationCycle46,nextLocationContext46} from '../client/src/location-cycle-v57759406.js';
import {compass59406RirContextRelease} from '../client/compass59406-rir-context-release.js';
const today='2026-10-27';
const session=(repValues,rirValues,kg=8,extras={})=>({id:'s1',source:'compass-guided-v5920',completed:true,startedAt:'2026-10-25T08:00:00Z',...extras,
 exercises:[{exerciseId:'dumbbell-row',confirmedSets:repValues.map((reps,i)=>({confirmed:true,setNumber:i+1,reps,rir:rirValues[i],weightKg:kg}))}]});
const state=s=>({strengthGuidedSessions:[s]});
const opts={today,reps:'8–12',plannedSets:3,lastKg:8,equipment:'home',goal:'vtaper'};
test('4+ RIR leads to more reps at the same weight; not aggressive 25 percent load increase',()=>{
 const result=rirProgression46(state(session([8,8,8],[4,4,4])),'dumbbell-row',opts);
 assert.equal(result.action,'increase-reps');assert.deepEqual(result.targetReps,[9,9,9]);assert.equal(result.suggestedKg,null);
});
test('Bodyweight V-Taper exercises also progress via confirmed reps and RIR, without invented kilograms',()=>{
 const s=session([8,8,8],[4,3,4],0);
 s.exercises[0].exerciseId='pike-pushup';
 const r=rirProgression46(state(s),'pike-pushup',{...opts,lastKg:null});
 assert.equal(r.action,'increase-reps');assert.deepEqual(r.targetReps,[9,9,9]);
 assert.equal(r.suggestedKg,null);assert.match(r.message,/Körpergewicht/);
});
test('At the top of range with 4+ and oversized home step: never propose jump of 25%',()=>{
 const result=rirProgression46(state(session([12,12,12],[4,4,4])),'dumbbell-row',opts);
 assert.equal(result.action,'hold-at-cap');assert.equal(result.suggestedKg,null);
});
test('Controlled microloading only with complete confirmed session and RIR evidence',()=>{
 const result=rirProgression46(state(session([12,12,12],[2,2,2],40)),'dumbbell-row',{...opts,lastKg:40,equipment:'gym',weightStepKg:2.5});
 assert.equal(result.action,'increase-load');assert.equal(result.suggestedKg,42.5);
 const no=rirProgression46(state(session([12,12,12],[4,null,null],40)),'dumbbell-row',{...opts,lastKg:40,equipment:'gym',weightStepKg:2.5});
 assert.equal(no.suggestedKg,null);
});
test('RIR 0, incomplete sessions, missing and time exercises never trigger upward changes',()=>{
 const fail=rirProgression46(state(session([8,8,8],[0,1,0])),'dumbbell-row',opts);
 assert.equal(fail.action,'hold-fatigue');assert.equal(fail.suggestedKg,null);
 assert.equal(rirProgression46(state(session([8,8,8],[null,null,null])),'dumbbell-row',opts),null);
 assert.equal(rirProgression46(state(session([8,8,8],[4,4,4],8,{completed:false})),'dumbbell-row',opts),null);
 assert.equal(rirProgression46(state(session([8,8,8],[4,4,4])),'dumbbell-row',{...opts,reps:'45 Sek.'}),null);
 assert.equal(rirProgression46(state(session([8,8,8],[4,4,4])),'dumbbell-row',{...opts,goal:'strength'}),null);
});
test('Recovery caution or deload blocks progression without inventing readiness',()=>{
 for(const key of ['healthAttention','deload']){
  const r=rirProgression46(state(session([8,8,8],[4,4,4])),'dumbbell-row',{...opts,[key]:true});
  assert.equal(r.action,'hold-recovery');assert.deepEqual(r.targetReps,[8,8,8]);
 }
});
test('Only current, confirmed per-set RIR; no partial, future or stale workouts',()=>{
 const recent=latestCoachRirSession46(state(session([10,10,10],[2,2,2])),'dumbbell-row',today);
 assert.equal(recent.sets.length,3);
 assert.equal(rirProgression46(state(session([8,8,8],[4,4,4],8,{startedAt:'2026-09-01T08:00:00Z'})),'dumbbell-row',opts),null);
});
test('Context cycles single-click in exactly requested order, with separate GPS pin for settings',()=>{
 assert.deepEqual(['home','work','away','unknown'].map(nextLocationContext46),['work','away','unknown','home']);
 const html=locationCycle46({locationContext39:{mode:'manual',manual:'home'}});
 assert.match(html,/data-action="ctx46-cycle"/);assert.match(html,/📍/);assert.match(html,/💼/);assert.match(locationCycle46({locationContext39:{mode:'manual',manual:'away'}}),/👤/);
 assert.match(html,/Kontext Zuhause. Weiter: Arbeit/);
 assert.equal((html.match(/class="ctx46-cycle"/g)||[]).length,1);
 const css=readFileSync(new URL('../client/src/location-cycle-v57759406.css',import.meta.url),'utf8');
 assert.match(css,/@media\(max-width:700px\)/);assert.match(css,/position:fixed/);
});
test('Per-set RIR goals persist inside encrypted workout snapshot and survive reload',()=>{
 const source=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
 const extract=source.slice(source.indexOf('export function makeGuidedSnapshot'),source.indexOf('export function matchingGuidedSessions')).replace('export function makeGuidedSnapshot','function makeGuidedSnapshot');
 const fn=runInNewContext(extract+'\nmakeGuidedSnapshot',{Date,Math,Number,String});
 const plan={title:'V-Taper',goal:'vtaper',equipment:'home',exercises:[{id:'dumbbell-row',title:'Einarmiges Rudern',primary:'back',sets:3,reps:'8–12',targetReps:[9,10,11],restSeconds:120,lastKg:8}]};
 const snapshot=fn(plan,'2026-10-27T09:00:00Z','rir-example');
 assert.deepEqual(Array.from(snapshot.exercises[0].targetReps),[9,10,11]);
 const restored=guidedPlanFromSession(snapshot);
 assert.deepEqual(Array.from(restored.exercises[0].targetReps),[9,10,11]);
 assert.equal(restored.exercises[0].lastKg,8);
 assert.match(source,/proposedReps\(ex,index\)/);
});
test('Version and actual Vite transform chain both reach .40.6 with single location cycle',async()=>{
 const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 const imports=new Map([...config.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...config.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 assert.equal(names.at(-1),'compass59407PlateauRelease');
 let code=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const name of names){
  const mod=await import(new URL('../client/'+imports.get(name),import.meta.url));
  const res=await mod[name]().transform(code,'/repo/client/src/main.js');
  if(res?.code)code=res.code;
 }
 assert.match(code,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.7'/);
 assert.match(code,/locationCycle46\(state\)/);
 assert.match(code,/ctx46-cycle/);
 assert.doesNotMatch(code,/locationPicker43\(state\)/);
});
