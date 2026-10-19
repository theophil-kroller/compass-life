import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {capacityForecast} from '../client/src/capacity-engine-v44.js';
import {proactivePlan,remainingTaskMinutes} from '../client/src/proactive-planner-v47.js';

const day='2026-10-20',now=new Date(`${day}T08:00:00`);
const range={complete:true,start:'2026-10-01',end:'2026-12-01'};
const event=(name,a,b)=>({summary:name,start:{dateTime:`${day}T${a}:00`},end:{dateTime:`${day}T${b}:00`}});
const forecast=(events=[],days=2)=>capacityForecast({events,connected:true,coverage:range,updatedAt:now.getTime(),now,startDay:day,days});
const task=(id,extra={})=>({id,title:id,category:'Allgemein',workflow:'next',projectId:null,completed:false,archived:false,estimateMinutes:60,...extra});
const state=(...items)=>({tasks:Object.fromEntries(items.map(t=>[t.id,t])),projects:{}});

test('Never infer free time or plan from disconnected, stale or incomplete calendar',()=>{
 for(const status of ['disconnected','stale','partial']){
  const f={...forecast(),status}; const p=proactivePlan(state(task('a')),f);
  assert.equal(p.status,'unavailable');assert.deepEqual(p.blocks,[]);assert.equal(p.totalMinutes,0);
 }
});
test('Work is availability; a meeting inside it is blocked with its buffers',()=>{
 const f=forecast([event('Work','09:00','17:00'),event('Meeting','11:00','12:00')],1);
 assert.equal(f.totalMinutes,400);
 const p=proactivePlan(state(task('paper',{estimateMinutes:150,dueDate:day})),f);
 assert.equal(p.status,'ready');assert.equal(p.totalMinutes,150);
 assert.ok(p.blocks.every(b=>b.end<=new Date(`${day}T10:50:00`).getTime()||b.start>=new Date(`${day}T12:10:00`).getTime()));
});
test('Avoid double-booking; split effort into real, disjoint working blocks',()=>{
 const p=proactivePlan(state(task('a',{estimateMinutes:185,dueDate:day}),task('b',{estimateMinutes:95,dueDate:day})),forecast([],1));
 assert.equal(p.totalMinutes,280);assert.ok(p.blocks.length>=3);
 const sorted=p.blocks.slice().sort((a,b)=>a.start-b.start);
 for(let i=1;i<sorted.length;i++)assert.ok(sorted[i].start>=sorted[i-1].end);
 assert.deepEqual(new Set(p.blocks.map(b=>b.task.id)),new Set(['a','b']));
});
test('Prioritize a hard deadline over a flagged but undated action',()=>{
 const p=proactivePlan(state(task('nice',{flagged:true,estimateMinutes:90}),task('due',{dueDate:day,estimateMinutes:90})),forecast([],1));
 assert.equal(p.blocks[0].task.id,'due');
});
test('Defers future tasks and respects an existing soft planned date',()=>{
 const future='2026-10-21';
 const p=proactivePlan(state(task('deferred',{deferUntil:future}),task('soft',{plannedDate:future})),forecast([],2));
 assert.ok(p.blocks.length>0);assert.ok(p.blocks.every(b=>b.day>=future));
});
test('Unavailable GTD work never gets an automatic suggestion',()=>{
 const s=state(task('waiting',{workflow:'waiting'}),task('hold',{workflow:'hold'}),task('completed',{completed:true}),task('tomorrow',{deferUntil:'2026-11-30'}));
 assert.deepEqual(proactivePlan(s,forecast([],2)).blocks,[]);
});
test('A sequential project does not schedule downstream actions before prerequisites',()=>{
 const p='11111111-1111-4111-8111-111111111111';
 const a=task('a',{projectId:p,sortOrder:0}),b=task('b',{projectId:p,sortOrder:1});
 const s=state(a,b);s.projects[p]={id:p,title:'Project',kind:'project',status:'active',projectType:'sequential'};
 assert.deepEqual(new Set(proactivePlan(s,forecast([],2)).blocks.map(x=>x.task.id)),new Set(['a']));
});
test('Remaining effort uses task piece counters, but never auto-completes a task',()=>{
 const a=task('exam',{estimateMinutes:240,progressTarget:40,progressCurrent:15});
 assert.equal(remainingTaskMinutes(a),150);
 assert.equal(remainingTaskMinutes({...a,progressCurrent:40}),0);
 const s=state(a),p=proactivePlan(s,forecast([],1));
 assert.equal(p.totalMinutes,150);assert.equal(a.completed,false);assert.equal(a.progressCurrent,15);
});
test('Horizon shortfalls are visible and unknown estimates are not silently invented',()=>{
 const s=state(task('urgent',{dueDate:day,estimateMinutes:600}),task('unknown',{dueDate:day,estimateMinutes:null}));
 const p=proactivePlan(s,forecast([event('Work','09:00','17:00'),event('Meeting','11:00','16:00')],1));
 assert.equal(p.shortfalls.length,1);assert.equal(p.shortfalls[0].task.id,'urgent');assert.ok(p.shortfalls[0].remaining>0);
 assert.equal(p.unknownCount,1);
});
test('Past due is flagged rather than optimistically scheduled before an expired deadline',()=>{
 const p=proactivePlan(state(task('old',{dueDate:'2026-10-19'})),forecast([],1));
 assert.equal(p.blocks.length,0);assert.equal(p.shortfalls[0].reason,'overdue');
});
test('Forecast does not mutate state, deadlines, capacity slots or preferences',()=>{
 const s=state(task('x',{dueDate:day})),f=forecast();
 const old=JSON.stringify([s,f]);proactivePlan(s,f);assert.equal(JSON.stringify([s,f]),old);
});
test('Compact UI present in Forecast and Today, and accepts planned day only after explicit action',()=>{
 const ui=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(ui,/proactivePlannerPanel\(\)/);assert.match(ui,/nextRealisticBlock\(\)/);assert.match(ui,/planner-mark/);
 assert.match(ui,/plannedDate=day/);assert.match(ui,/taskPending\[id\]=true/);assert.match(ui,/forecast\.status!=='ready'/);
 assert.doesNotMatch(ui,/class=\"capacity-suggestions\"/); // no redundant older suggestion panel
 assert.doesNotMatch(readFileSync(new URL('../client/src/proactive-planner-v47.js',import.meta.url),'utf8'),/fetch\(|localStorage|writeFile|request\(/);
});
test('Leave deliberate daily slack; a free Work day is not an obligation to fill every minute',()=>{
 const f=forecast([event('Work','09:00','17:00')],1);
 const p=proactivePlan(state(task('big',{estimateMinutes:1100})),f);
 assert.ok(p.totalMinutes<=Math.floor(f.days[0].minutes*.8));
 assert.ok(p.totalMinutes>0);
});
test('Respect selected context and energy today, but do not project today preferences onto tomorrow',()=>{
 const f=forecast([],2);
 const s=state(task('home',{contextTags:['home','energy-high'],dueDate:'2026-10-21'}));
 s.uiPreferences={dailyContext:'office',dailyEnergy:'low'};
 const p=proactivePlan(s,f);
 assert.ok(p.blocks.length>0);assert.ok(p.blocks.every(b=>b.day==='2026-10-21'));
});
