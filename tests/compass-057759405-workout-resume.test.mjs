import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resumableGuidedSession,guidedPlanFromSession,resumeExerciseIndex} from '../client/src/strength-workout-resume-v57759405.js';
import {runInNewContext} from 'node:vm';
const guideSource=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
const snapSource=guideSource.slice(guideSource.indexOf('export function makeGuidedSnapshot'),guideSource.indexOf('export function matchingGuidedSessions')).replace('export function makeGuidedSnapshot','function makeGuidedSnapshot');
const makeGuidedSnapshot=runInNewContext(snapSource+'\nmakeGuidedSnapshot',{Date,Math,Number,String,crypto:{randomUUID:()=> 'guid-1'}});
import {strengthCoachHealthContext} from '../client/src/strength-coach-recovery-v5775926.js';
const today='2026-10-27T08:00:00.000Z';
const exercise=(id,title)=>({id,title,sets:3,reps:'8–12',restSeconds:180,primary:'quads'});
const plan={title:'V-Taper – gestartete Auswahl',goal:'vtaper',equipment:'home',exercises:[exercise('goblet-squat','Goblet Squat'),exercise('pike-pushup','Pike Push-up')]};
const make=()=>makeGuidedSnapshot(plan,today,'workout-1');

test('New workout saves pinned order, original exercise details and cursor with no server or localStorage',()=>{
 const session=make();
 assert.equal(session.id,'workout-1');
 assert.deepEqual(session.planSnapshot.exercises.map(x=>x.id),['goblet-squat','pike-pushup']);
 assert.equal(session.currentExerciseIndex,0);
 assert.equal(Object.keys(session.workingWeights).length,0);
 assert.equal(session.completed,false);
 const text=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
 assert.match(text,/snapshot\.currentExerciseIndex=ex/);
 assert.match(text,/data-save-status/);
 assert.match(text,/pagehide/);
 assert.doesNotMatch(readFileSync(new URL('../client/src/strength-workout-resume-v57759405.js',import.meta.url),'utf8'),/localStorage\.|sessionStorage\.|watchPosition\(/);
});

test('Recover exactly Goblet Squat after a reload instead of a recomputed Pike Push-up',()=>{
 const original=make();
 original.started=true;original.currentExerciseIndex=0;
 original.exercises[0].confirmedSets.push({confirmed:true,setNumber:1,reps:10,weightKg:12,completedAt:today});
 original.workingWeights={'0':12};
 original.updatedAt='2026-10-27T08:12:00.000Z';
 const latest=resumableGuidedSession({strengthGuidedSessions:[original]},{now:Date.parse('2026-10-27T08:30:00.000Z')});
 assert.equal(latest?.id,'workout-1');
 assert.equal(resumeExerciseIndex(latest),0);
 assert.deepEqual(guidedPlanFromSession(latest).exercises.map(x=>x.id),['goblet-squat','pike-pushup']);
 assert.equal(guidedPlanFromSession(latest).exercises[0].lastKg,12);
 assert.equal(latest.exercises[0].confirmedSets.length,1);
});

test('Older workout records without planSnapshot resume from planned exercise and confirmed sets',()=>{
 const old=make();
 delete old.planSnapshot;delete old.currentExerciseIndex;delete old.workingWeights;
 old.exercises[0].confirmedSets=[1,2,3].map(i=>({confirmed:true,setNumber:i,reps:10,weightKg:8}));
 old.updatedAt='2026-10-27T08:16:00.000Z';
 assert.equal(resumeExerciseIndex(old),1);
 assert.equal(guidedPlanFromSession(old).exercises[0].title,'Goblet Squat');
 assert.equal(guidedPlanFromSession(old).exercises[1].title,'Pike Push-up');
});

test('Never resume finished, expired or invalid sessions; no new workout silently overrides an unfinished one',()=>{
 const s=make();s.updatedAt='2026-10-27T08:12:00.000Z';
 assert.equal(resumableGuidedSession({strengthGuidedSessions:[{...s,completed:true}]},{now:Date.parse(today)}),null);
 assert.equal(resumableGuidedSession({strengthGuidedSessions:[{...s,finishedAt:today}]},{now:Date.parse(today)}),null);
 assert.equal(resumableGuidedSession({strengthGuidedSessions:[s]},{now:Date.parse('2026-11-08T08:30:00.000Z')}),null);
 assert.equal(resumableGuidedSession({strengthGuidedSessions:[{...s,exercises:[]}]},{now:Date.parse(today)}),null);
 const coach=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 const bridge=readFileSync(new URL('../client/compass5910-strength-habits-bridge.js',import.meta.url),'utf8');
 assert.match(coach,/Training fortsetzen/);
 assert.match(coach,/zusätzliches neues Training starten\?/i);
 assert.match(coach,/resumeSession:unfinished/);
 assert.match(bridge,/resumeSession:unfinished/);
});

test('HRV and sleep use fixed calendar windows, unrelated to first exercise log',()=>{
 const series=[];for(let i=0;i<13;i++){
  const date=new Date('2026-10-27T12:00:00Z');date.setUTCDate(date.getUTCDate()-i);
  series.push({day:date.toISOString().slice(0,10),sleepMinutes:450,nightAverageMs:55});
 }
 const rows={healthImports:{garminNights:series,garminHrv:series}};
 const data=strengthCoachHealthContext(rows,{today:'2026-10-27'});
 assert.equal(data.sleep.recentCount,3);
 assert.equal(data.sleep.baselineCount,10);
 assert.equal(data.hrv.recentCount,3);
 assert.equal(data.hrv.baselineCount,10);
 assert.equal(data.sleep.usable,true);
 assert.equal(data.hrv.usable,true);
 assert.match(data.method,/letzten 3 Kalendertage/);
});

test('Terminal Vite plugin transforms complete .40.4 code to .40.5 without changing workout logic',async()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 const files=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(m=>[m[1],m[2]]));
 const names=[...cfg.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(m=>m[1]);
 assert.equal(names.at(-1),'compass59409WorkspaceRelease');
 let code=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const name of names){const mod=await import(new URL('../client/'+files.get(name),import.meta.url));const r=mod[name]().transform(code,'/repo/client/src/main.js');if(r?.code)code=r.code;}
 assert.match(code,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.9'/);
 assert.match(code,/storeStrengthGuidedSession/);
});
