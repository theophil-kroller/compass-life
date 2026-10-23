import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {tasksForDay, isActionAvailable, advanceTaskCounter} from '../client/src/tasks.js';

const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const ID='8f0a19de-4d1f-4b58-b209-945142cee001';
const PROJ='f13abf66-570c-447b-9274-07c894011002';
function state(day){
 return {projects:{[PROJ]:{id:PROJ,title:'Prüfungen',kind:'project',status:'active'}},tasks:{[ID]:{id:ID,title:'PME Frage 18 (36)',projectId:PROJ,workflow:'next',completed:false,archived:false,plannedDate:null,dueDate:null,progressCurrent:14,progressTarget:36}},taskPending:{}};
}
test('project tree has separate today toggle, independent of completion toggle',()=>{
 assert.match(main,/data-action="tree-plan-today"/);
 assert.match(main,/tree-today-box/);
 assert.match(main,/data-action="task-toggle"/);
 assert.match(main,/if\(action==='next-plan-today'\|\|action==='tree-plan-today'\)/);
 assert.match(main,/const setDate=current\.plannedDate===today\?null:today/);
 assert.match(main,/s\.tasks\[id\]\.plannedDate=setDate/);
 assert.match(main,/s\.taskPending\[id\]=true/);
 assert.match(main,/s\.tasks\[id\]\.updatedAt=stamp\(\)/);
 assert.match(css,/\.tree-today-check\.is-planned/);
});
test('marking individual exam correction for today makes same task appear in daily view with existing counter',()=>{
 const s=state(),day='2026-10-20',task=s.tasks[ID];
 assert.equal(isActionAvailable(s,task,day),true);
 assert.equal(tasksForDay(s,day).length,0);
 task.plannedDate=day;
 const today=tasksForDay(s,day);
 assert.equal(today.length,1);
 assert.equal(today[0],task);
 assert.deepEqual([today[0].progressCurrent,today[0].progressTarget],[14,36]);
 task.progressCurrent=advanceTaskCounter(task,1);
 assert.equal(tasksForDay(s,day)[0].progressCurrent,15);
 assert.equal(task.completed,false);
 task.plannedDate=null;
 assert.equal(tasksForDay(s,day).length,0);
});
test('today marker does not change deadline and unavailable items cannot be selected',()=>{
 const s=state(),day='2026-10-20',t=s.tasks[ID];
 t.dueDate='2026-10-26';t.plannedDate=day;
 assert.equal(t.dueDate,'2026-10-26');
 assert.equal(tasksForDay(s,day).length,1);
 t.plannedDate=null;
 assert.equal(t.dueDate,'2026-10-26');
 t.workflow='waiting';
 assert.equal(isActionAvailable(s,t,day),false);
 t.workflow='hold';
 assert.equal(isActionAvailable(s,t,day),false);
 t.workflow='next';t.completed=true;
 assert.equal(isActionAvailable(s,t,day),false);
});
test('in daily task list, progress +1 is reusable from project task, including on mobile',()=>{
 assert.match(main,/taskList\(dayTasks, 'day'\)/);
 assert.match(main,/function taskProgressInline\(t\)/);
 assert.match(main,/\$\{taskProgressInline\(t\)\}/);
 assert.match(main,/data-action="task-progress-plus"/);
 assert.match(css,/@media\(max-width:700px\)\{\.tree-today-check/);
});
