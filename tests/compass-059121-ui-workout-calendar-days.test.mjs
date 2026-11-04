import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {guidedSetDay,guidedDayGroups,guidedDayWindow} from '../client/src/strength-session-days-v059121.js';
import {strengthPeriod} from '../client/src/strength-insights-v57728.js';
import {mergeGuidedStrengthSessions} from '../client/src/strength-coach-history-v5775926.js';
import {confirmedRir34} from '../client/src/strength-adaptive-v5775934.js';
import {latestCoachRirSession46} from '../client/src/strength-rir-progress-v57759406.js';
import {sessionEvidence47} from '../client/src/strength-plateau-v57759407.js';
import {radarMovement38} from '../client/src/life-balance-perspectives-v5775938.js';
import {cycleEvidence35,cycleBlockEvaluation35} from '../client/src/strength-cycle-v5775935.js';
import {bodyMeasurementDashboardModel,bodyMeasurementDashboardHtml,putBodyMeasurement} from '../client/src/body-measurements-v05918.js';

const prev='2026-11-03T18:20:00Z',today='2026-11-04T07:00:00Z';
const set=(n,at,rir=2)=>({confirmed:true,setNumber:n,completedAt:at,reps:10,weightKg:8,rir});
const sample=()=>({id:'multiday-1',source:'compass-guided-v5920',startedAt:'2026-11-03T18:00:00Z',finishedAt:'2026-11-04T07:30:00Z',completed:true,
 exercises:[{exerciseId:'dumbbell-row',confirmedSets:[set(1,prev,3),set(2,today,2)]},{exerciseId:'dumbbell-lateral-raise',confirmedSets:[set(1,'2026-11-04T07:06:00Z',2)]}]});
const state=()=>({strengthGuidedSessions:[sample()]});

test('a set has the confirmed local day, not the session start or close day',()=>{
 const session=sample(),groups=guidedDayGroups(session);
 assert.equal(groups.length,2);assert.deepEqual(groups.map(g=>g.sets.length),[1,2]);
 assert.deepEqual(groups.map(g=>g.day),['2026-11-03','2026-11-04']);
 assert.equal(guidedDayWindow(session,groups[0]).completed,false);
 assert.equal(guidedDayWindow(session,groups[1]).completed,true);
 assert.equal(session.exercises[0].confirmedSets[0].completedAt,prev);
});
test('explicit completedDay survives travel and clock-zone changes',()=>{
 const s=sample(),row={confirmed:true,completedAt:'2026-11-04T00:10:00Z',completedDay:'2026-11-03'};
 assert.equal(guidedSetDay(s,row),'2026-11-03');
 assert.equal(guidedSetDay(s,{confirmed:true}),'2026-11-03'); // old missing timestamps: transparently use start
});
test('coach daily history is split, and today contains only today’s sets',()=>{
 const s=state(),original=JSON.stringify(s);
 const full=strengthPeriod(s,{range:'7',today:'2026-11-04'});
 assert.equal(full.activeSets,3);assert.equal(full.trainingDays,2);
 assert.deepEqual(full.sessions.filter(x=>x.coachOnly).map(x=>[x.day,x.sets.length,x.completed]),[['2026-11-03',1,false],['2026-11-04',2,true]]);
 const yesterday=strengthPeriod(s,{range:'7',today:'2026-11-03'});
 assert.equal(yesterday.activeSets,1);assert.equal(yesterday.todayRecorded,true);
 const todayOnly=mergeGuidedStrengthSessions([],s,{today:'2026-11-04',start:'2026-11-04'});
 assert.equal(todayOnly.sources.coachSets,2);
 assert.equal(todayOnly.sessions[0].start,today);
 assert.equal(JSON.stringify(s),original,'read views must never alter confirmed timestamps or saved records');
});
test('cycle recovery evidence uses both days and confirms most recent day',()=>{
 const evidence=cycleEvidence35(state(),'2026-11-04');assert.deepEqual(evidence.days,['2026-11-03','2026-11-04']);
 const block=cycleBlockEvaluation35(evidence.sessions,{startDay:'2026-11-03',today:'2026-11-04'});
 assert.equal(block.trainingDays,2);assert.equal(block.lastTrainingDay,'2026-11-04');assert.equal(block.confirmedSets,3);
});
test('RIR and plateau do not retroactively move all sets to the first session day',()=>{
 const s=state(),rows=confirmedRir34(s,'dumbbell-row','2026-11-04');
 assert.deepEqual(rows.map(x=>x.day),['2026-11-04','2026-11-03']);
 const latest=latestCoachRirSession46(s,'dumbbell-row','2026-11-04');
 assert.equal(latest.day,'2026-11-04');assert.equal(latest.sets.length,1);
 assert.equal(sessionEvidence47(s,'dumbbell-row','2026-11-04').length,0,'one set per day must not impersonate two comparable sets');
});
test('combined day and Garmin merge does not duplicate a prior day workout',()=>{
 const s=state(),garmin=[{id:'g1',day:'2026-11-03',start:'2026-11-03T18:00:00Z',source:'garmin-fit-strength',sets:[{exerciseId:'dumbbell-row',reps:10,weightKg:8,source:'garmin-fit-set'}],reportedSets:1}];
 const combined=mergeGuidedStrengthSessions(garmin,s,{today:'2026-11-04'});
 assert.equal(combined.sources.matchedSets,1);
 assert.equal(combined.sources.coachSets,2);
 assert.equal(combined.sessions.filter(x=>x.day==='2026-11-04').length,1);
});
test('unified Smart Tape layout shows single figure and single details panel',()=>{
 const s={nutritionJournal:{bodyMeasures88:[]}};
 for(const [regionId,valueCm] of Object.entries({shoulder:119,chest:103,waist:91,hip:99,leftUpperArm:32})){
  putBodyMeasurement(s,{regionId,at:'2026-11-04T15:00:00Z',day:'2026-11-04',valueCm,source:'fitdays-plus'});
 }
 const m=bodyMeasurementDashboardModel(s,{today:'2026-11-04',range:'28'});
 const html=bodyMeasurementDashboardHtml(m,{selectedRegionId:'leftUpperArm',heightCm:185});
 assert.equal((html.match(/id="bm918-detail"/g)||[]).length,1);
 assert.equal((html.match(/class="bp120-svg bm918-body-map"/g)||[]).length,1);
 assert.doesNotMatch(html,/bm918-workspace/,'a second body map and grid must not be rendered beneath the first');
 assert.match(html,/bp120-cols/);
 assert.match(html,/<details class="bp120-extras">/);
 assert.match(html,/<details class="bm918-chooser">/);
 assert.doesNotMatch(html,/bm918-region [^>]*><span>[^<]*<\/span><strong>/,'body-part values no longer repeated in second grid');
});
test('new confirmations pin calendar date without changing existing set times',()=>{
 const s=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
 assert.match(s,/completedAt,completedDay/);assert.match(s,/confirmedAt\.toLocaleDateString\('sv-SE'\)/);
});

test('life-balance radar attributes Strength Coach work to both actual calendar days',()=>{
 const r=radarMovement38(state(),[], '2026-11-04',7);
 assert.equal(r.strength.observed,2);assert.equal(r.strength.latest,'2026-11-04');
});
