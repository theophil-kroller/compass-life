import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
import {validLocalTask,taskPlain,taskCounterValid,advanceTaskCounter} from '../client/src/tasks.js';
import {repeatedTask} from '../client/src/gtd-intelligence-v23.js';
import {putTask,listTasks} from '../worker/src/tasks.js';
import {schemaStatus} from '../worker/src/schema.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const uid='11111111-1111-4111-a111-111111111111';
const owner={sub:'unit-test-local'};
const task={id:uid,title:'Prüfungen korrigieren',note:'',plannedDate:null,dueDate:null,category:'Pruefungen',completed:false,archived:false,workflow:'next',flagged:false,projectId:null,tags:[],contextTags:[],deferUntil:null,estimateMinutes:null,parentTaskId:null,sortOrder:0,baseVersion:0};
function dbSetup(){
 const db=new DatabaseSync(':memory:');
 const migrations=join(root,'worker/migrations');
 for(const file of readdirSync(migrations).filter(x=>/^\d{4}_.*\.sql$/.test(x)).sort())db.exec(readFileSync(join(migrations,file),'utf8'));
 const env={DB:{prepare(sql){return {bind(...args){return {first:async()=>db.prepare(sql).get(...args)||null,all:async()=>({results:db.prepare(sql).all(...args)}),run:async()=>{const result=db.prepare(sql).run(...args);return {meta:{changes:Number(result.changes)}}}}},all:async()=>({results:db.prepare(sql).all()})};}}};
 return {db,env};
}
async function send(env,body){const res=await putTask(new Request('https://compass.test/api/tasks',{method:'POST',body:JSON.stringify(body)}),env,owner);return {code:res.status,json:await res.json()};}
test('0.5.42 optional per-task counts are strongly validated; other GTD fields unchanged',()=>{
 assert.equal(taskCounterValid(task),true);
 assert.equal(validLocalTask(task),true);
 const p={...task,progressCurrent:12,progressTarget:36};
 assert.equal(validLocalTask(p),true);
 assert.equal(taskPlain(p).progressCurrent,12);
 assert.equal(taskPlain(p).progressTarget,36);
 for(const item of [{progressCurrent:-1,progressTarget:36},{progressCurrent:37,progressTarget:36},{progressCurrent:1,progressTarget:null},{progressCurrent:0,progressTarget:0},{progressCurrent:1.5,progressTarget:36},{progressCurrent:0,progressTarget:100001},{progressCurrent:'1',progressTarget:36}]){
  assert.equal(validLocalTask({...task,...item}),false,JSON.stringify(item));
 }
 assert.equal(advanceTaskCounter(p,1),13);
 assert.equal(advanceTaskCounter({...p,progressCurrent:36},1),36);
 assert.equal(advanceTaskCounter({...p,progressCurrent:0},-1),0);
 assert.equal(advanceTaskCounter(p,-1),11);
 assert.equal(advanceTaskCounter(task,1),null);
 assert.equal(advanceTaskCounter(p,20),null);
 assert.equal(task.completed,false,'counter never automatically changes task completion');
 const duplicate=repeatedTask({...p,completed:true},'22222222-2222-4222-a222-222222222222');
 assert.equal(duplicate.progressTarget,36);assert.equal(duplicate.progressCurrent,0);
});
test('D1 migration 0016 is additive and counter values persist and optimistic conflicts are enforced',async()=>{
 const {db,env}=dbSetup();
 try{
  assert.deepEqual(await schemaStatus(env.DB),{ready:true,requiredMigration:null,missing:[]});
  const migration=readFileSync(join(root,'worker/migrations/0016_task_progress_counters.sql'),'utf8');
  assert.doesNotMatch(migration,/\bDROP\b|\bDELETE\b|\bTRUNCATE\b/i);
  let first=await send(env,{...task,progressCurrent:0,progressTarget:36});
  assert.equal(first.code,200,JSON.stringify(first.json));
  assert.equal(first.json.task.progressCurrent,0);
  let progress=await send(env,{...task,progressCurrent:13,progressTarget:36,baseVersion:1});
  assert.equal(progress.code,200,JSON.stringify(progress.json));
  assert.equal(progress.json.task.progressCurrent,13);
  assert.equal(progress.json.task.progressTarget,36);
  assert.equal(progress.json.task.completed,false);
  const conflict=await send(env,{...task,progressCurrent:14,progressTarget:36,baseVersion:1});
  assert.equal(conflict.code,409);
  assert.equal(conflict.json.remote.progressCurrent,13);
  const all=(await (await listTasks(env,owner)).json()).tasks;
  assert.equal(all.length,1);
  assert.equal(all[0].progressCurrent,13);
  assert.equal((await send(env,{...task,progressCurrent:37,progressTarget:36,baseVersion:2})).code,400);
  assert.equal((await send(env,{...task,progressCurrent:0,progressTarget:null,baseVersion:2})).code,200);
  const zero=(await (await listTasks(env,owner)).json()).tasks[0];
  assert.equal(zero.progressTarget,null);
  assert.equal(zero.progressCurrent,0);
 }finally{db.close();}
});
test('row-level +1 and project tree, inspector edit and completion remain separate',()=>{
 const main=readFileSync(join(root,'client/src/main.js'),'utf8');
 for(const code of ['COMPASS_CLIENT_VERSION=\'0.5.68.1\'','taskProgressInline(t)','task-progress-plus','task-progress-minus','advanceTaskCounter(t,','name="progressTarget"','name="progressCurrent"','taskPending[id]=true','Stückziel erreicht!','Die Aufgabe bleibt offen'])assert.ok(main.includes(code),code);
 const css=readFileSync(join(root,'client/src/style.css'),'utf8');
 assert.match(css,/\.v42-task-progress/);
 assert.match(css,/\.v42-progress-editor/);
});
