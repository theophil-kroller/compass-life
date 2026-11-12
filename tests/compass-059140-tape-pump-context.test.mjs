import test from 'node:test';
import assert from 'node:assert/strict';
import {setTapeWorkoutContext140,getTapeWorkoutContext140,linkedTapeExercises140,tapeWorkoutCheckins140,tapePumpAffectedRegions140} from '../client/src/smart-tape-pump-context-v059140.js';
import {bodyMeasurementDashboardModel,bodyMeasurementDashboardHtml} from '../client/src/body-measurements-v05918.js';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
const a='2026-11-11T21:00:00.000Z',b='2026-11-04T08:00:00.000Z';
const tape=(region,at,val)=>({id:at+'|'+region,source:'fitdays-plus',day:at.slice(0,10),at,regionId:region,valueCm:val,method:'smart-tape',protocol:'Fitdays+ Smart Tape'});
const guided=(id,day,when)=>({id:'guided-'+id,source:'compass-guided-v5920',startedAt:when,completed:true,finishedAt:when,exercises:[{exerciseId:id,confirmedSets:[{confirmed:true,completedDay:day,completedAt:when,setNumber:1,reps:12,weightKg:5}]}]});
const state=()=>({nutritionJournal:{bodyMeasures88:[tape('shoulder',b,120),tape('waist',b,90),tape('shoulder',a,122),tape('waist',a,88),tape('leftUpperArm',a,33),tape('head',a,58)]},strengthGuidedSessions:[guided('dumbbell-lateral-raise','2026-11-11','2026-11-11T20:15:00.000Z'),guided('biceps-curl','2026-11-11','2026-11-11T22:05:00.000Z')]});
test('User checks one measurement session without modifying its actual circumference rows',()=>{
 const s=state(),before=structuredClone(s.nutritionJournal.bodyMeasures88);
 assert.equal(getTapeWorkoutContext140(s,a),null);
 const ctx=setTapeWorkoutContext140(s,a,true,{now:'2026-11-12T12:00:00.000Z'});
 assert.equal(ctx.postWorkout,true);
 assert.deepEqual(s.nutritionJournal.bodyMeasures88,before);
 assert.equal(s.nutritionJournal.bodyMeasureContexts140.length,1);
 assert.equal(getTapeWorkoutContext140(s,b),null);
 setTapeWorkoutContext140(s,a,false,{now:'2026-11-12T12:01:00.000Z'});
 assert.equal(s.nutritionJournal.bodyMeasureContexts140.length,1);
 assert.equal(getTapeWorkoutContext140(s,a).postWorkout,false);
 assert.throws(()=>setTapeWorkoutContext140(s,'2026-11-01T05:00:00.000Z',true));
});
test('Pump heuristic matches pre-measurement confirmed delts, excludes post-measurement curl',()=>{
 const s=state();setTapeWorkoutContext140(s,a,true);
 const x=tapeWorkoutCheckins140(s,{today:'2026-11-12'}).find(c=>c.at===a);
 assert.equal(x.linked.matched.length,1);
 assert.equal(x.linked.matched[0].id,'dumbbell-lateral-raise');
 assert.equal(x.linked.excludedLater,1);
 assert.ok(x.possiblePumpRegions.includes('shoulder'));
 assert.ok(!x.possiblePumpRegions.includes('leftUpperArm'));
 assert.ok(!x.possiblePumpRegions.includes('waist'));
 assert.ok(!x.possiblePumpRegions.includes('head'));
 assert.equal(x.source,'workout-observation-not-pump-measurement');
});
test('Cross-midnight workout immediately before tape remains eligible; measurements never change',()=>{
 const time='2026-11-12T00:20:00.000Z';
 const matched=linkedTapeExercises140([{day:'2026-11-11',start:'2026-11-11T23:30:00.000Z',sets:[{exerciseId:'reverse-fly',day:'2026-11-11',start:'2026-11-11T23:55:00.000Z'}]}],time);
 assert.deepEqual(matched.matched.map(x=>x.id),['reverse-fly']);
 assert.ok(tapePumpAffectedRegions140(matched.matched).includes('shoulder'));
});
test('No speculative pump when session timestamps missing or older than four hours',()=>{
 const earlier=linkedTapeExercises140([{day:'2026-11-11',sets:[{exerciseId:'biceps-curl',day:'2026-11-11',start:'2026-11-11T14:00:00.000Z'}]}],a);
 assert.equal(earlier.matched.length,0);
 const unknown=linkedTapeExercises140([{day:'2026-11-11',sets:[{exerciseId:'biceps-curl',day:'2026-11-11'}]}],a);
 assert.equal(unknown.matched.length,0);assert.equal(unknown.timeUnknown.length,1);
});
test('Dashboard marks pumped measurements and flags visual comparison; untagged date not marked',()=>{
 const s=state();setTapeWorkoutContext140(s,a,true);
 const model=bodyMeasurementDashboardModel(s,{today:'2026-11-12',range:'90'});
 const html=bodyMeasurementDashboardHtml(model,{selectedRegionId:'shoulder'});
 assert.match(html,/Nach Workout gemessen/);
 assert.match(html,/Pump möglich/);
 assert.match(html,/data-action="smart-tape-postworkout"/);
 assert.match(html,/Messbedingungen · Wochen-Check-in/);
 assert.match(html,/2026-11-11/);
 assert.equal(model.series.find(x=>x.id==='shoulder').latest.valueCm,122);
 assert.equal(model.ratioLatest.ratio,1.39);
});
test('Workout marker survives encrypted journal per-ID sync and later uncheck wins',()=>{
 const local=state();setTapeWorkoutContext140(local,a,true,{now:'2026-11-12T12:00:00.000Z'});
 const remote=state();setTapeWorkoutContext140(remote,a,false,{now:'2026-11-12T13:00:00.000Z'});
 const merged=mergeJournalData(local,remote);
 assert.equal(merged.nutritionJournal.bodyMeasureContexts140.length,1);
 assert.equal(merged.nutritionJournal.bodyMeasureContexts140[0].postWorkout,false);
 assert.equal(merged.nutritionJournal.bodyMeasures88.length,6);
});
