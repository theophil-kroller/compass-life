import test from 'node:test';
import assert from 'node:assert/strict';
import {validTask,listWatchPlanning} from '../worker/src/tasks.js';
import {prepareTasks,tasksForDay,dueTasks,mergeTaskSnapshot,sameTask} from '../client/src/tasks.js';
const t={id:'0c88a917-a9df-409a-9de3-90821fe6bf73',title:'Prüfungsbogen erstellen',note:'',plannedDate:'2026-10-17',dueDate:'2026-10-21',category:'Pruefungen',completed:false,archived:false,baseVersion:0};
test('Task input keeps planned day separate from actual deadline',()=>{
 assert.equal(validTask(t),true);
 assert.equal(validTask({...t,title:' '}),false);
 assert.equal(validTask({...t,dueDate:'2026-02-30'}),false);
 assert.equal(validTask({...t,category:'DROP TABLE'}),false);
 assert.equal(validTask({...t,plannedDate:null}),true);
});
test('Local task snapshots do not overwrite unsent changes or conflicts',()=>{
 const state=prepareTasks({});state.tasks[t.id]={...t,title:'Meine lokale Fassung'};
 state.taskPending[t.id]=true;
 const cloud={...t,title:'Cloud-Fassung',version:3};
 mergeTaskSnapshot(state,[cloud]);assert.equal(state.tasks[t.id].title,'Meine lokale Fassung');
 delete state.taskPending[t.id];mergeTaskSnapshot(state,[cloud]);
 assert.equal(state.tasks[t.id].title,'Cloud-Fassung');assert.equal(state.taskVersions[t.id],3);
 assert.equal(tasksForDay(state,'2026-10-17').length,1);
 assert.equal(dueTasks(state).length,1);
 assert.equal(sameTask({...t,version:8},{...t,version:5}),true);
});
test('Watch planning filters strictly by owner and returns real tasks only',async()=>{
 const stored=[{id:t.id,title:t.title,planned_date:t.plannedDate,due_date:t.dueDate,category:t.category,completed:0}];
 let sub=null;
 const env={DB:{prepare(sql){return {bind(...args){sub=args[0];return {async all(){return {results:stored};}};}};}}};
 const r=await listWatchPlanning(new Request('https://test.example/api/watch/planning?day=2026-10-17'),env,'owner-a');
 assert.equal(r.status,200);const data=await r.json();assert.equal(sub,'owner-a');
 assert.equal(data.today[0].title,t.title);assert.equal(data.deadlines[0].dueDate,t.dueDate);
 assert.equal((await listWatchPlanning(new Request('https://test.example/?day=bad'),env,'owner-a')).status,400);
});
