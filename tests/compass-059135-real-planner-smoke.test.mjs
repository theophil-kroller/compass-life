/** End-to-end smoke for actual planNextWorkout (CSS is irrelevant to planning).
 * A fresh node child imports all real Coach modules with a test-only CSS loader.
 */
import test from 'node:test';import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const code=String.raw`
import {planNextWorkout} from './client/src/strength-coach-v5775910.js';
import {saveHomeAttachments135} from './client/src/strength-home-attachments-v059135.js';
import {singleExercisePlan131} from './client/src/strength-exercise-library-model-v059131.js';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
const s={healthImports:{garminSessions:[],garminStrength:[]},strengthGuidedSessions:[],strengthJournal:{},nutritionJournal:{}};
const before=JSON.stringify(s);
const initial=planNextWorkout(s,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-01'});
const planningReadOnly=before===JSON.stringify(s);const days=[];
for(let i=0;i<8;i++){
 const day=new Date(Date.UTC(2026,10,1+i)).toISOString().slice(0,10);
 const p=planNextWorkout(s,{goal:'vtaper',equipment:'home',minutes:25,today:day});
 days.push({day,ids:p.exercises.map(x=>x.id),sets:p.exercises.map(x=>x.sets),minutes:p.estimatedMinutes,heads:p.shoulderBalance.counts});
 s.strengthGuidedSessions.push({id:'test'+i,source:'compass-guided-v5920',startedAt:day+'T10:00:00Z',finishedAt:day+'T10:25:00Z',completed:true,exercises:p.exercises.map(x=>({exerciseId:x.id,confirmedSets:Array.from({length:x.sets},(_,j)=>({confirmed:true,setNumber:j+1,reps:12,weightKg:7,rir:2,completedDay:day,completedAt:day+'T10:'+String(j*4+1).padStart(2,'0')+':00Z'}))}))});
}
s.strengthJournal.safety88={day:'2026-11-09',pain:true};
const pain=planNextWorkout(s,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-09'});
delete s.strengthJournal.safety88;
const futureBefore=planNextWorkout(s,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-10'});
saveHomeAttachments135({cableReady:true,pullupReady:true});
const futureAfter=planNextWorkout(s,{goal:'vtaper',equipment:'home',minutes:25,today:'2026-11-10'});
const open=singleExercisePlan131(s,'face-pull',{place:'home',sets:2});
const strength=planNextWorkout(s,{goal:'strength',equipment:'gym',minutes:45,today:'2026-11-10',mode:'stronglifts'});
console.log(JSON.stringify({initial:initial.exercises.map(x=>x.id),planningReadOnly,days,pain:pain.exercises.map(x=>x.id),futureBefore:futureBefore.homeAttachments,futureAfter:futureAfter.homeAttachments,openSingle:open.exercises[0].id,stronglifts:strength.exercises.map(x=>({id:x.id,sets:x.sets})),strongliftsMode:strength.mode}));
`;
const proc=spawnSync(process.execPath,['--no-warnings','--experimental-loader','./tests/css-noop-loader.mjs','--input-type=module','-e',code],{cwd:root,encoding:'utf8',timeout:30000});
const error=proc.status===0?null:(proc.stderr||proc.stdout);
let result;
try{result=JSON.parse(proc.stdout.trim());}catch{}
test('real Coach imports through unchanged module graph and executes planning',()=>{
 assert.equal(proc.status,0,error);assert.ok(result?.days?.length===8,error);
});
test('eight actual 25 minute sessions balance posterior and lateral shoulders with back, legs and calf',()=>{
 assert.equal(proc.status,0,error);
 assert.equal(result.planningReadOnly,true);
 assert.ok(result.days.every(d=>d.ids.length<=3&&d.minutes<=25));
 const ids=result.days.flatMap(d=>d.ids);
 for(const id of ['dumbbell-lateral-raise','reverse-fly','dumbbell-row','goblet-squat','calf-raise'])assert.ok(ids.includes(id),id);
 assert.ok(!ids.includes('dumbbell-front-raise'));
 assert.ok(!ids.some(id=>id.startsWith('cable-')));
});
test('uninstalled HomeGym attachments stay off until explicit setting',()=>{
 assert.equal(proc.status,0,error);
 assert.equal(result.futureBefore.cableReady,false);
 assert.equal(result.futureBefore.pullupReady,false);
 assert.equal(result.futureAfter.cableReady,true);
 assert.equal(result.futureAfter.pullupReady,true);
 assert.equal(result.openSingle,'face-pull');
});
test('HWS pain gate avoids overhead press without changing saved sets',()=>{
 assert.equal(proc.status,0,error);
 assert.ok(!result.pain.includes('dumbbell-shoulder-press'));
});
test('StrongLifts A/B remains 5x5 and independent of V-Taper scheduling',()=>{
 assert.equal(proc.status,0,error);
 assert.equal(result.strongliftsMode,'stronglifts');
 assert.equal(result.stronglifts.length,3);
 assert.equal(result.stronglifts.find(x=>x.id==='squat')?.sets,5);
});
