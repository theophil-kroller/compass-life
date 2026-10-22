import test from 'node:test';
import assert from 'node:assert/strict';
import {morningConnections,morningConnectionsView} from '../client/src/morning-connections-v572.js';
const day='2026-10-22';
const routine=d=>({day:d,finishedAt:d+'T08:00:00Z',steps:[{id:'silence',skipped:false}]});
const night=(d,min)=>({day:d,totals:{deep:Math.floor(min/4),light:min-Math.floor(min/4),rem:0}});
const feeling=(d,id='joy')=>({day:d,items:[{id,intensity:5}]});
test('no history does not invent routine, sleep or emotion days',()=>{
 const m=morningConnections({}, {today:day,days:7});
 assert.equal(m.coverage.routineDays,0);assert.equal(m.coverage.measuredNights,0);
 assert.equal(m.sleep.sufficient,false);assert.equal(m.emotions.sufficient,false);
 assert.match(morningConnectionsView(m),/nicht ergänzt/);
});
test('only completed non-skipped sessions count, and a day is unique',()=>{
 const m=morningConnections({miracleMorning:{sessions:[routine('2026-10-21'),routine('2026-10-21'),{...routine('2026-10-20'),finishedAt:''},{...routine('2026-10-19'),steps:[{id:'silence',skipped:true}]}]}},{today:day,days:7});
 assert.equal(m.coverage.routineDays,1);assert.equal(m.timeline.filter(x=>x.routine).length,1);
});
test('paired observations report real evidence and transparent denominators',()=>{
 const routineDays=['2026-10-16','2026-10-18','2026-10-20'];
 const otherDays=['2026-10-17','2026-10-19','2026-10-21'];
 const state={miracleMorning:{sessions:routineDays.map(routine)},healthImports:{garminNights:[...routineDays.map(d=>night(d,480)),...otherDays.map(d=>night(d,420))]},feelingCheckins:[...routineDays.map(d=>feeling(d)),...otherDays.map(d=>feeling(d,'fear'))]};
 const m=morningConnections(state,{today:day,days:7});
 assert.equal(m.sleep.sufficient,true);assert.equal(m.sleep.withMean,480);assert.equal(m.sleep.otherMean,420);
 assert.equal(m.emotions.sufficient,true);assert.equal(m.emotions.withTop[0][0],'joy');
 assert.match(morningConnectionsView(m),/8 h/);
});
test('missing entries are unknown, not false-negative health scores',()=>{
 const m=morningConnections({miracleMorning:{sessions:[routine('2026-10-21')]},healthImports:{garminNights:[night('2026-10-21',480)]}},{today:day,days:7});
 assert.equal(m.sleep.otherCount,0);assert.equal(m.sleep.sufficient,false);
 assert.match(morningConnectionsView(m),/Ohne Routinenachweis/);
});
