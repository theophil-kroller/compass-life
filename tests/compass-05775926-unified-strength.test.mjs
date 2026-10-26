import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeGuidedStrengthSessions,coachConfirmedStrengthSets} from '../client/src/strength-coach-history-v5775926.js';
import {strengthPeriod,strengthInsightsView} from '../client/src/strength-insights-v57728.js';

const day='2026-10-25',start='2026-10-25T10:00:00.000Z';
const mkCoach=(sets,id='coach-1')=>({id,source:'compass-guided-v5920',startedAt:start,completed:true,exercises:[{exerciseId:'dumbbell-row',confirmedSets:sets}]});
const set=(reps=10,kg=12,n=1)=>({confirmed:true,setNumber:n,reps,weightKg:kg,completedAt:'2026-10-25T10:12:00Z'});
const mkGarmin=(sets=[],reportedSets=sets.length)=>({id:'strength|'+start,day,start,source:'garmin-fit-strength',sets,reportedSets});

test('.26 Coach-only sessions are read-only, correctly classed, and visible in Muscle Map',()=>{
 const state={strengthGuidedSessions:[mkCoach([set(10,12,1),set(12,12,2)])]};
 const m=strengthPeriod(state,{today:day,range:'7'});
 assert.equal(m.activeSets,2);assert.equal(m.knownSets,2);assert.equal(m.unassigned,0);
 assert.equal(m.trainingDays,1);assert.equal(m.groups.find(x=>x.id==='back').primary,2);
 assert.equal(m.volumeKg,264);assert.equal(m.coachSources.coachSets,2);
 assert.match(strengthInsightsView(state,{today:day,range:'7'}),/Coach/);
});
test('.26 exact Garmin exercise and Coach confirmation do not double count',()=>{
 const state={strengthGuidedSessions:[mkCoach([set()])],healthImports:{garminStrength:[mkGarmin([{exerciseId:'dumbbell-row',category:23,reps:10,weightKg:12,exercise:'Rudern',source:'garmin-fit-set'}])]}};
 const m=strengthPeriod(state,{today:day,range:'7'});
 assert.equal(m.activeSets,1);assert.equal(m.knownSets,1);assert.equal(m.coachSources.matchedSets,1);
});
test('.26 matching unassigned FIT set is enriched, not duplicated',()=>{
 const state={strengthGuidedSessions:[mkCoach([set()])],healthImports:{garminStrength:[mkGarmin([{category:null,reps:10,weightKg:12,exerciseId:null,source:'garmin-fit-set'}])]}};
 const m=strengthPeriod(state,{today:day,range:'7'});
 assert.equal(m.activeSets,1);assert.equal(m.knownSets,1);assert.equal(m.coachSources.pairedSets,1);
});
test('.26 CSV reported count stays authoritative for unmatched summary sets',()=>{
 const data=mergeGuidedStrengthSessions([{id:'csv',day,start,sets:[],reportedSets:4,summaryOnly:true,source:'garmin-activities-csv'}],{strengthGuidedSessions:[mkCoach([set(10,12,1),set(10,12,2),set(10,12,3)])]},{today:day,start:'2026-10-20'});
 assert.equal(data.sessions.length,1);assert.equal(data.sessions[0].sets.length,3);
 assert.equal(data.sessions[0].reportedSets,4);
});
test('.26 no preview/partial session is turned into a completed set',()=>{
 assert.equal(coachConfirmedStrengthSets(mkCoach([{confirmed:false,setNumber:1,reps:10,weightKg:12}])).length,0);
 const m=strengthPeriod({strengthGuidedSessions:[mkCoach([])]},{today:day,range:'7'});
 assert.equal(m.activeSets,0);
});
test('.26 repeated Coach snapshots, unknown exercise and out-of-range dates are excluded',()=>{
 const c=mkCoach([set()]),bad={...c,id:'bad',exercises:[{exerciseId:'not-in-catalog',confirmedSets:[set()]}]};
 const rows=mergeGuidedStrengthSessions([],{strengthGuidedSessions:[c,c,bad]},{today:'2026-10-26',start:'2026-10-20'});
 assert.equal(rows.sessions.length,1);assert.equal(rows.sources.coachSets,1);
 const outside=mergeGuidedStrengthSessions([],{strengthGuidedSessions:[c]},{today:'2026-10-30',start:'2026-10-27'});
 assert.equal(outside.sessions.length,0);
});
test('.26 merges do not mutate state or Garmin originals',()=>{
 const g=mkGarmin([{category:null,reps:10,weightKg:12}]);
 const state={strengthGuidedSessions:[mkCoach([set()])]};
 const before=JSON.stringify({g,state});mergeGuidedStrengthSessions([g],state,{today:day,start:'2026-10-20'});
 assert.equal(JSON.stringify({g,state}),before);
});
test('.26 Coach planner explicitly requests Garmin-only period (avoids adding Coach twice)',async()=>{
 const {readFileSync}=await import('node:fs');
 const file=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
 assert.match(file,/const period=strengthPeriod\(state,\{range:'28',today:todayValue,includeCoach:false\}\);/);
});
