import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const text=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
const ids={
 'dumbbell-row':['back','biceps'],'dumbbell-lateral-raise':['shoulders'],
 'dumbbell-pullover':['back'],'goblet-squat':['quads','glutes'],
 'dumbbell-romanian-deadlift':['posterior','glutes'],'ab-wheel-kneeling':['core'],
 'dumbbell-floor-press':['chest'],'plank':['core'],'dead-bug':['core'],
 'dumbbell-shoulder-press':['shoulders'],'barbell-overhead-press':['shoulders'],
 'barbell-row':['back'],'squat':['quads'],'bench':['chest'],
 'military-press':['shoulders'],'deadlift':['posterior'],
 'lat-pulldown':['back'],'cable-lateral-raise':['shoulders'],
 'cable-rear-delt-fly':['shoulders'],'cable-single-arm-row':['back'],
 'cable-crunch':['core'],'cable-straight-arm-pulldown':['back'],
 'cable-woodchop':['core'],'face-pull':['shoulders']};
const EXERCISES=Object.entries(ids).map(([id,[primary,...secondary]])=>({id,primary,secondary,name:id}));
function planner(period={events:[],sessions:[],unassigned:0},now='2026-10-25'){
 const transformed=text.replace(/^import .*;\s*$/gm,'').replace(/export (function|const) /g,'$1 ');
 const ctx={EXERCISES,strengthPeriod:()=>period,detailedMuscleData:()=>({regions:{}}),console,
   localStorage:{getItem:()=>null,setItem:()=>{}},Date,Intl,Number,Math,String};
 const api=runInNewContext(transformed+'\nthis.API={combinedStrengthEvents,planNextWorkout};',ctx);
 const session=(sets,day='2026-10-25')=>({id:'c1',source:'compass-guided-v5920',startedAt:`${day}T09:00:00.000Z`,completed:true,
   exercises:sets.map(([id,reps=8,kg=8,at=day+'T09:06:00.000Z'],index)=>({exerciseId:id,confirmedSets:[{confirmed:true,setNumber:1,reps,weightKg:kg,completedAt:at}]}))});
 return {api,session,now};
}
test('Fresh Coach-only work adds real confirmed muscle sets even without Garmin data',()=>{
 const {api,session}=planner(); const state={strengthGuidedSessions:[session([['dumbbell-row',8,8],['dumbbell-lateral-raise',12,5]])]};
 const p=api.planNextWorkout(state,{goal:'vtaper',equipment:'home',today:'2026-10-25',minutes:45});
 assert.equal(p.sourceStats.coach,2);assert.equal(p.sourceStats.garmin,0);
 assert.equal(p.known,2);assert.equal(p.cautious,true);
 assert.equal(p.history.counts7.back,1);assert.equal(p.history.counts7.shoulders,1);
 assert.equal(p.latestAge,0);
});
test('Merely previewing an exercise never enters the Coach muscle history',()=>{
 const {api,session}=planner();const empty=session([['dumbbell-row',8,8]]);empty.exercises[0].confirmedSets=[];
 const state={strengthGuidedSessions:[empty]};
 const p=api.planNextWorkout(state,{goal:'vtaper',equipment:'home',today:'2026-10-25'});
 assert.equal(p.known,0);assert.equal(p.sourceStats.coach,0);assert.equal(p.cautious,false);
});
test('After Garmin import, equivalent classified sets are counted once, not twice',()=>{
 const {api,session}=planner({events:[{exerciseId:'dumbbell-row',sessionId:'garmin-1',day:'2026-10-25',reps:8,weightKg:8}],sessions:[{id:'garmin-1',start:'2026-10-25T09:02:00.000Z'}],unassigned:0});
 const state={strengthGuidedSessions:[session([['dumbbell-row',8,8]])]};
 const p=api.planNextWorkout(state,{goal:'vtaper',equipment:'home',today:'2026-10-25'});
 assert.equal(p.known,1);assert.equal(p.sourceStats.garmin,1);
 assert.equal(p.sourceStats.coach,0);assert.equal(p.sourceStats.deduplicated,1);
});
test('Unassigned Garmin summary does NOT suppress a confirmed Coach set',()=>{
 const {api,session}=planner({events:[],sessions:[{id:'g1',start:'2026-10-25T09:00:00.000Z',reportedSets:4}],unassigned:4});
 const p=api.planNextWorkout({strengthGuidedSessions:[session([['dumbbell-row',8,8]])]},{goal:'balance',today:'2026-10-25'});
 assert.equal(p.known,1);assert.equal(p.sourceStats.coach,1);assert.equal(p.missing,4);
});
test('Different reps or physical load do not get mistaken for exact same set',()=>{
 const {api,session}=planner({events:[{exerciseId:'dumbbell-row',sessionId:'g1',day:'2026-10-25',reps:12,weightKg:12}],sessions:[{id:'g1',start:'2026-10-25T09:00:00.000Z'}]});
 const p=api.planNextWorkout({strengthGuidedSessions:[session([['dumbbell-row',8,8]])]},{goal:'balance',today:'2026-10-25'});
 assert.equal(p.known,2);assert.equal(p.sourceStats.deduplicated,0);
});
test('Coach records outside 28-day planning window are omitted',()=>{
 const {api,session}=planner(); const p=api.planNextWorkout({strengthGuidedSessions:[session([['dumbbell-row',8,8]],'2026-07-01')]},{goal:'balance',today:'2026-10-25'});
 assert.equal(p.known,0);
});
test('Partial sessions are accepted but unconfirmed or unknown exercises ignored',()=>{
 const {api,session}=planner();const s=session([['dumbbell-row',8,8]]);
 s.completed=false;s.exercises.push({exerciseId:'unknown',confirmedSets:[{confirmed:true,reps:20,completedAt:'2026-10-25T09:15:00Z'}]});
 const p=api.planNextWorkout({strengthGuidedSessions:[s]},{goal:'vtaper',today:'2026-10-25'});
 assert.equal(p.sourceStats.coach,1);
});
test('StrongLifts gym remains opt-in and method alternation sees Coach-only logged A/B sets',()=>{
 const {api,session}=planner();const state={strengthGuidedSessions:[session([['squat',5,50],['bench',5,50],['barbell-row',5,40]],'2026-10-24')]};
 const p=api.planNextWorkout(state,{goal:'strength',equipment:'gym',mode:'stronglifts',today:'2026-10-25'});
 assert.equal(p.variant,'B');
 const home=api.planNextWorkout(state,{goal:'strength',equipment:'home',mode:'stronglifts',today:'2026-10-25'});
 assert.equal(home.mode,'smart');
});
