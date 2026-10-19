import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {needsDateDecision,deadlineUrgency} from '../client/src/urgency-intelligence-v48.js';
import {dayCandidates} from '../client/src/daily-planning-v48.js';

const today='2026-10-20';
const task=(id,props={})=>({id,title:id,category:'Allgemein',workflow:'next',completed:false,archived:false,estimateMinutes:60,...props});
const state=(...ts)=>({tasks:Object.fromEntries(ts.map(t=>[t.id,t])),projects:{},uiPreferences:{}});

test('Undated actionable tasks receive date-review notice, not a fabricated urgency or hard deadline',()=>{
 const s=state(task('undated'),task('soft',{plannedDate:'2026-10-26'}),task('hard',{dueDate:'2026-11-01'}));
 const forecast={status:'disconnected',from:today};
 assert.equal(needsDateDecision(s,s.tasks.undated),true);
 assert.equal(needsDateDecision(s,s.tasks.soft),false);
 assert.equal(needsDateDecision(s,s.tasks.hard),false);
 const urg=deadlineUrgency(s,forecast,{today});
 assert.equal(urg.get('undated').score,null);
 assert.equal(urg.get('undated').tone,'neutral');
 assert.equal(urg.get('undated').needsDate,true);
 assert.equal(urg.get('soft').needsDate,false);
 assert.equal(urg.get('hard').due,'2026-11-01');
});
test('Project-inherited hard date suffices; project hierarchy is cycle-safe',()=>{
 const root='11111111-1111-4111-8111-111111111111';
 const s=state(task('inherited',{projectId:root}));
 s.projects[root]={id:root,status:'active',kind:'project',dueDate:'2026-10-30'};
 assert.equal(needsDateDecision(s,s.tasks.inherited),false);
 assert.equal(deadlineUrgency(s,{status:'partial',from:today},{today}).get('inherited').due,'2026-10-30');
});
test('Only executable tasks can enter daily list; no Someday/Maybe or Waiting For date prompts',()=>{
 const s=state(task('open'),task('waiting',{workflow:'waiting'}),task('hold',{workflow:'hold'}),task('later',{deferUntil:'2026-12-01'}),task('done',{completed:true}));
 const candidates=dayCandidates(s,today,50,{forecast:{status:'disconnected',from:today}});
 assert.deepEqual(candidates.map(x=>x.task.id),['open']);
 assert.equal(candidates[0].urgency.needsDate,true);
});
test('UI offers unobtrusive date choice and validates it before updating the synced task',()=>{
 const src=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(src,/daily-plan-undated/);
 assert.match(src,/daily-plan-date-edit/);
 assert.match(src,/v48-date-form/);
 assert.match(src,/Wunschtag \(unverbindlich\)/);
 assert.match(src,/Harte Deadline/);
 assert.match(src,/dateIsValid\(value\)/);
 assert.match(src,/s\.taskPending\[taskId\]=true/);
 assert.match(src,/s\.tasks\[taskId\]\[kind\]=value/);
});

test('Urgency increases as hard deadline approaches and flags proven capacity shortfall separately',()=>{
 const f={status:'ready',from:today,through:'2026-11-02',slots:[{day:today,start:new Date(`${today}T09:00:00`).getTime(),end:new Date(`${today}T10:00:00`).getTime(),minutes:60}]};
 const s=state(task('future',{dueDate:'2026-11-02'}),task('nextweek',{dueDate:'2026-10-27'}),task('tomorrow',{dueDate:'2026-10-21'}));
 const scores=deadlineUrgency(s,{...f,status:'stale'},{today});
 assert.ok(scores.get('future').score<scores.get('nextweek').score);
 assert.ok(scores.get('nextweek').score<scores.get('tomorrow').score);
 const threat=state(task('huge',{dueDate:today,estimateMinutes:600}));
 const risk=deadlineUrgency(threat,f,{today}).get('huge');
 assert.equal(risk.tone,'risk');assert.equal(risk.atRisk,true);assert.equal(risk.score,100);
 assert.equal(deadlineUrgency(threat,{...f,status:'stale'},{today}).get('huge').atRisk,false);
});
