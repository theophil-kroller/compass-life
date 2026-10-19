import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {capacityForecast} from '../client/src/capacity-engine-v44.js';
import {dayCandidates,dayDropTargets,placeDayBlock,dayPlanBlocks,updateDayBlock,dayPlanStatus} from '../client/src/daily-planning-v48.js';

const today='2026-10-20',tomorrow='2026-10-21',now=new Date(`${today}T08:00:00`);
const task=(id,extra={})=>({id,title:id,workflow:'next',category:'Allgemein',completed:false,archived:false,estimateMinutes:90,progressTarget:null,projectId:null,...extra});
const state=(...tasks)=>({tasks:Object.fromEntries(tasks.map(t=>[t.id,t])),projects:{},uiPreferences:{}});
const event=(summary,start,end)=>({summary,start:{dateTime:`${today}T${start}:00`},end:{dateTime:`${today}T${end}:00`}});
const forecast=(events=[],settings={})=>capacityForecast({events,settings,connected:true,coverage:{complete:true,start:'2026-10-01',end:'2026-12-01'},updatedAt:now.getTime(),now,startDay:today,days:14});
const idFactory=()=> '00000000-0000-4000-8000-000000000048';
const place=(s,f,taskId,start,minutes=60,moveId=null)=>placeDayBlock(s,f,{taskId,day:today,start,minutes,moveId},{now,idFactory});
const ts=t=>new Date(`${today}T${t}:00`).getTime();

test('Relevant options are only currently available GTD Next Actions, never Someday, Waiting For, completed or templates',()=>{
 const p='11111111-1111-4111-8111-111111111111';
 const s=state(task('available',{dueDate:today}),task('waiting',{workflow:'waiting'}),task('hold',{workflow:'hold'}),task('done',{completed:true}),task('later',{deferUntil:'2026-11-01'}),task('template',{projectId:p}),task('blocked',{projectId:'22222222-2222-4222-8222-222222222222'}));
 s.projects[p]={id:p,status:'active',isTemplate:true};s.projects['22222222-2222-4222-8222-222222222222']={status:'hold'};
 s.records={'foo':{id:'foo',tags:['dreams'],title:'Someday / Maybe Idea'}};
 assert.deepEqual(dayCandidates(s,today).map(x=>x.task.id),['available']);
});
test('Today and tomorrow have selectable true calendar slots, Work is free, meetings remain busy',()=>{
 const f=forecast([event('Work','09:00','17:00'),event('Weekly meeting','11:00','12:00')]);
 const a=dayDropTargets(f,today);const b=dayDropTargets(f,tomorrow);
 assert.ok(a.length>0&&b.length>0);
 assert.ok(a.some(x=>x.start===ts('09:00')));
 assert.ok(a.every(x=>x.start<ts('10:50')||x.start>=ts('12:10')));
});
test('Calendar is read-only; dropped block sits in verified free time and original state is untouched',()=>{
 const s=state(task('research'));
 const f=forecast([event('Work','09:00','17:00')]);
 const snapshot=JSON.stringify(s),calendar=JSON.stringify(f);
 const blocks=place(s,f,'research',ts('09:00'),60);
 assert.equal(blocks.length,1);assert.equal(blocks[0].end,ts('10:00'));assert.equal(blocks[0].taskId,'research');
 assert.equal(JSON.stringify(s),snapshot);assert.equal(JSON.stringify(f),calendar);
});
test('Overlaps and blocked meetings are rejected – including buffer time',()=>{
 const s=state(task('a'),task('b'));
 const f=forecast([event('Meeting','11:00','12:00')]);
 const a=place(s,f,'a',ts('09:00'));
 s.uiPreferences.dailyPlanBlocks=a;
 assert.throws(()=>place(s,f,'b',ts('09:30'),60),/bereits/);
 assert.throws(()=>place(s,f,'b',ts('10:30'),60),/nicht genug freie/);
 assert.throws(()=>place(s,f,'b',ts('11:30'),30),/nicht genug freie/);
 assert.equal(place(s,f,'b',ts('12:30'),30).length,2);
});
test('A dragged block can be moved without self-overlap, but a completed block cannot',()=>{
 const s=state(task('a'));const f=forecast();
 const original=place(s,f,'a',ts('09:00'));s.uiPreferences.dailyPlanBlocks=original;
 const moved=place(s,f,'a',ts('10:00'),60,original[0].id);
 assert.equal(moved.length,1);assert.equal(moved[0].start,ts('10:00'));
 s.uiPreferences.dailyPlanBlocks=updateDayBlock({...s,uiPreferences:{dailyPlanBlocks:moved}},moved[0].id,'toggleDone');
 assert.throws(()=>place(s,f,'a',ts('11:00'),60,moved[0].id),/nicht mehr verschoben/);
});
test('Long action may be split into multiple non-overlapping work blocks within remaining estimate',()=>{
 const s=state(task('paper',{estimateMinutes:180}));const f=forecast();
 s.uiPreferences.dailyPlanBlocks=place(s,f,'paper',ts('09:00'),60);
 const more=place(s,f,'paper',ts('10:00'),60);
 assert.equal(more.length,2);s.uiPreferences.dailyPlanBlocks=more;
 assert.throws(()=>place(s,f,'paper',ts('11:00'),90),/übersteigt/);
 assert.equal(place(s,f,'paper',ts('11:00'),60).length,3);
});
test('Piece counter reduces remaining time, so user cannot overbook stale estimates',()=>{
 const s=state(task('exams',{estimateMinutes:240,progressTarget:40,progressCurrent:30}));
 assert.equal(dayCandidates(s,today)[0].minutes,60);
 assert.throws(()=>place(s,forecast(),'exams',ts('09:00'),90),/Restaufwand/);
});
test('Unknown estimates show as unknown and allow only one explicitly provisional block',()=>{
 const s=state(task('unknown',{estimateMinutes:null}));
 assert.equal(dayCandidates(s,today)[0].estimateUnknown,true);
 s.uiPreferences.dailyPlanBlocks=place(s,forecast(),'unknown',ts('09:00'),30);
 assert.equal(s.uiPreferences.dailyPlanBlocks[0].estimateUnknown,true);
 assert.deepEqual(dayCandidates(s,today),[]);
 assert.throws(()=>place(s,forecast(),'unknown',ts('10:00'),30),/schätzen/);
});
test('No placement on stale/incomplete/disconnected calendar or into the past',()=>{
 const s=state(task('x'));const f=forecast();
 for(const status of ['stale','partial','disconnected'])assert.throws(()=>place(s,{...f,status},'x',ts('09:00')),/Kalenderdaten/);
 assert.throws(()=>placeDayBlock(s,f,{taskId:'x',day:today,start:ts('09:00'),minutes:30},{now:new Date(`${today}T13:00:00`),idFactory}),/Vergangene/);
});
test('A paused project, deferred action or task conflict cannot be manually dropped',()=>{
 const s=state(task('hold',{workflow:'hold'}),task('future',{deferUntil:tomorrow}),task('conflict'));
 s.taskConflicts={conflict:{remote:{}}};
 for(const id of ['hold','future','conflict'])assert.throws(()=>place(s,forecast(),id,ts('09:00')),/keine verfügbare/);
});
test('Done toggle is a block confirmation only, never marks the underlying task completed',()=>{
 const s=state(task('x'));s.uiPreferences.dailyPlanBlocks=place(s,forecast(),'x',ts('09:00'));
 s.uiPreferences.dailyPlanBlocks=updateDayBlock(s,s.uiPreferences.dailyPlanBlocks[0].id,'toggleDone');
 assert.equal(dayPlanStatus(s,today,now).done,1);assert.equal(dayPlanStatus(s,today,now).code,'ontrack');assert.equal(s.tasks.x.completed,false);
 s.uiPreferences.dailyPlanBlocks=updateDayBlock(s,s.uiPreferences.dailyPlanBlocks[0].id,'toggleDone');
 assert.equal(dayPlanStatus(s,today,now).code,'active');
});
test('At end of day, open blocks and genuine overdue deadlines cannot be misreported as on track',()=>{
 const s=state(task('x'),task('deadline',{dueDate:today,estimateMinutes:90}));
 s.uiPreferences.dailyPlanBlocks=place(s,forecast(),'x',ts('09:00'));
 const end=new Date(`${today}T21:00:00`);
 assert.notEqual(dayPlanStatus(s,today,end).code,'ontrack');
 s.uiPreferences.dailyPlanBlocks=updateDayBlock(s,s.uiPreferences.dailyPlanBlocks[0].id,'toggleDone');
 assert.equal(dayPlanStatus(s,today,end).code,'review');
 assert.equal(dayPlanStatus(s,today,end).dueOpen,1);
 s.tasks.deadline.completed=true;
 assert.equal(dayPlanStatus(s,today,end).code,'ontrack');
});
test('No plan does not imply on-track when due tasks are still open',()=>{
 const s=state(task('deadline',{dueDate:today}));
 const result=dayPlanStatus(s,today,new Date(`${today}T21:00:00`));
 assert.equal(result.code,'review');
 assert.equal(result.dueOpen,1);
});
test('Removal is reversible at task level: deletes only the local time block',()=>{
 const s=state(task('x'));s.uiPreferences.dailyPlanBlocks=place(s,forecast(),'x',ts('09:00'));
 s.uiPreferences.dailyPlanBlocks=updateDayBlock(s,s.uiPreferences.dailyPlanBlocks[0].id,'remove');
 assert.deepEqual(dayPlanBlocks(s),[]);assert.ok(s.tasks.x);assert.equal(s.tasks.x.plannedDate,undefined);
});
test('Forecast UI exposes draggable tasks, 30 minute targets, keyboard/touch fallback and today summary',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/dailyPlanPanel\(\)/);assert.match(main,/dailyStatusNudge\(\)/);
 assert.match(main,/data-day-drag/);assert.match(main,/data-day-drop/);assert.match(main,/dragstart/);assert.match(main,/dragover/);assert.match(main,/drop/);
 assert.match(main,/data-action="daily-plan-pick"/);assert.match(main,/daily-plan-place/);assert.match(main,/daily-plan-done/);
 assert.match(main,/Nur ausführbare Next Actions/);assert.match(main,/selectedForecastDay/);
 assert.doesNotMatch(readFileSync(new URL('../client/src/daily-planning-v48.js',import.meta.url),'utf8'),/fetch\(|localStorage|request\(/);
});
