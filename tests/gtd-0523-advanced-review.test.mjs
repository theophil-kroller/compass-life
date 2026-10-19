import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {projectHealth,waitingReview,repeatedTask,ageDays} from '../client/src/gtd-intelligence-v23.js';
const p=(id,changes={})=>({id,title:'Projekt '+id,kind:'project',status:'active',reviewIntervalDays:7,reviewedAt:'2026-10-10T12:00:00Z',...changes});
const t=(id,changes={})=>({id,title:'Aufgabe',note:'',category:'Allgemein',workflow:'next',completed:false,archived:false,updatedAt:'2026-10-01T12:00:00Z',tags:[],contextTags:[],...changes});
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
test('0.5.23 project health distinguishes review interval and unavailable action',()=>{
 const s={projects:{[a]:p(a),[b]:p(b,{reviewedAt:'2026-10-18T10:00:00Z'})},tasks:{[a]:t(a,{projectId:b})}};
 const m=projectHealth(s,'2026-10-19');assert.equal(m.active,2);assert.equal(m.withoutAction,1);assert.equal(m.dueReviews,1);
 assert.equal(m.items[0].severity,'blocked');assert.equal(m.items[0].project.id,a);
 assert.equal(m.items[1].severity,'ok');
});
test('0.5.23 paused and completed projects are excluded, no invented deadlines',()=>{
 const s={projects:{[a]:p(a,{status:'hold'}),[b]:p(b,{status:'completed'})},tasks:{}};
 assert.equal(projectHealth(s,'2026-10-19').active,0);
 const active=projectHealth({projects:{[a]:p(a,{reviewedAt:'2026-10-18T00:00:00Z'})},tasks:{[b]:t(b,{projectId:a,deferUntil:'2026-11-01'})}},'2026-10-19');
 assert.equal(active.withoutAction,1);assert.equal(active.items[0].overdueDeadline,false);
});
test('0.5.23 Waiting For age counts last edit only and never invents a due date',()=>{
 const r=waitingReview({tasks:{[a]:t(a,{workflow:'waiting',updatedAt:'2026-10-01T12:00:00Z'}),[b]:t(b,{workflow:'waiting',updatedAt:'2026-10-18T12:00:00Z'})}},'2026-10-19');
 assert.equal(r.items.length,2);assert.equal(r.attention,1);assert.equal(r.items[0].daysSinceEdit,18);
 assert.equal(r.items[0].task.dueDate,undefined);assert.equal(ageDays('not-a-date','2026-10-19'),null);
});
test('0.5.23 repeat requires explicit completed task and strips old dates, no implicit auto-repeat',()=>{
 const old=t(a,{completed:true,flagged:true,plannedDate:'2026-08-01',dueDate:'2026-08-05',deferUntil:'2026-08-01',projectId:b,parentTaskId:b,estimateMinutes:30});
 const n=repeatedTask(old,b,'2026-10-19T08:00:00Z');
 assert.equal(n.dueDate,null);assert.equal(n.plannedDate,null);assert.equal(n.deferUntil,null);assert.equal(n.parentTaskId,null);
 assert.equal(n.completed,false);assert.equal(n.projectId,b);assert.equal(n.estimateMinutes,30);
 assert.throws(()=>repeatedTask(t(a),b),/Nur abgeschlossene/);
});
test('0.5.23 UI links real GTD review to projects and waiting list',()=>{
 const s=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(s,/projectHealth\(state/);assert.match(s,/waitingReview\(state/);
 assert.match(s,/data-action="gtd-review-project"/);assert.match(s,/data-action="gtd-repeat-task"/);
 assert.match(s,/COMPASS_CLIENT_VERSION='0\.5\.34'/);
});
