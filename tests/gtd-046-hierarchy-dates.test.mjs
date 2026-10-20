import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname} from 'node:path';
import {putProject,listProjects} from '../worker/src/projects.js';
import {putTask,listTasks} from '../worker/src/tasks.js';
import {schemaStatus} from '../worker/src/schema.js';
import {nextActions,validTaskParent,validProjectParent,hierarchicalProjectTasks,projectPlain,taskPlain} from '../client/src/tasks.js';
const dir=join(dirname(fileURLToPath(import.meta.url)),'../worker/migrations');
const owner={sub:'test-owner'};
const pid='11111111-1111-4111-a111-111111111111',childId='22222222-2222-4222-a222-222222222222';
const taskId='33333333-3333-4333-a333-333333333333',task2Id='44444444-4444-4444-a444-444444444444';
function testDB(){
 const db=new DatabaseSync(':memory:');
 for(let i=1;i<=17;i++){
  const name=({1:'0001_core.sql',2:'0002_auth_sessions.sql',3:'0003_watch_tracker.sql',4:'0004_planning_tasks.sql',5:'0005_gtd_projects_agendas.sql',6:'0006_gtd_context_review.sql',7:'0007_project_hierarchy.sql',8:'0008_watch_session_tombstones.sql',9:'0009_health_daily.sql',10:'0010_widget_preview.sql',11:'0011_discovery_events.sql',12:'0012_weekly_review.sql',13:'0013_project_templates.sql',14:'0014_private_device_mirror.sql',15:'0015_project_folder_icons.sql',16:'0016_task_progress_counters.sql',17:'0017_private_device_chunks.sql'})[i];
  db.exec(readFileSync(join(dir,name),'utf8'));
 }
 const env={DB:{prepare(sql){const mk=(...args)=>{const stmt=db.prepare(sql);return {first:async()=>stmt.get(...args)||null,all:async()=>({results:stmt.all(...args)}),run:async()=>{const r=stmt.run(...args);return {meta:{changes:Number(r.changes)}}}}};return {...mk(),bind:(...args)=>mk(...args)};}}};
 return {db,env};
}
async function post(fn,env,body){const r=await fn(new Request('https://test.invalid/',{method:'POST',body:JSON.stringify(body)}),env,owner);return {code:r.status,data:await r.json()};}
const project=(id,title,extra={})=>({id,title,outcome:'',category:'Allgemein',status:'active',dueDate:null,reviewIntervalDays:7,reviewedAt:null,kind:'project',projectType:'parallel',parentId:null,sortOrder:100,baseVersion:0,...extra});
const task=(id,title,projectId,extra={})=>({id,title,note:'',category:'Allgemein',plannedDate:null,dueDate:null,workflow:'next',flagged:false,projectId,completed:false,archived:false,tags:[],contextTags:[],deferUntil:null,estimateMinutes:null,parentTaskId:null,sortOrder:100,baseVersion:0,...extra});

test('0.4.6 migration is additive and full D1 schema becomes ready',async()=>{
 const {db,env}=testDB();
 const sql=readFileSync(join(dir,'0007_project_hierarchy.sql'),'utf8');
 assert.doesNotMatch(sql,/\bDROP\b|\bDELETE\b|\bTRUNCATE\b/i);
 assert.deepEqual(await schemaStatus(env.DB),{ready:true,requiredMigration:null,missing:[]});
 db.close();
});
test('project folders, nested projects and task parent persist through real SQLite SQL and reject loops',async()=>{
 const {db,env}=testDB();
 const folder=project(pid,'Ordner',{kind:'folder'});
 assert.equal((await post(putProject,env,folder)).code,200);
 const child=project(childId,'Sequential Projekt',{parentId:pid,projectType:'sequential'});
 assert.equal((await post(putProject,env,child)).code,200);
 assert.equal((await post(putProject,env,{...folder,parentId:childId,baseVersion:1})).code,400);
 const projects=(await(await listProjects(env,owner)).json()).projects;
 assert.equal(projects.find(p=>p.id===childId).parentId,pid);
 assert.equal(projects.find(p=>p.id===childId).projectType,'sequential');
 assert.equal((await post(putTask,env,task(taskId,'Parent',childId,{plannedDate:'2026-10-21',dueDate:'2026-10-23',deferUntil:'2026-10-20',estimateMinutes:45}))).code,200);
 assert.equal((await post(putTask,env,task(task2Id,'Subtask',childId,{parentTaskId:taskId,sortOrder:200}))).code,200);
 assert.equal((await post(putTask,env,task(taskId,'Parent',childId,{parentTaskId:task2Id,baseVersion:1}))).code,400);
 const tasks=(await(await listTasks(env,owner)).json()).tasks;
 assert.equal(tasks.find(t=>t.id===task2Id).parentTaskId,taskId);
 assert.equal(tasks.find(t=>t.id===taskId).plannedDate,'2026-10-21');
 assert.equal(tasks.find(t=>t.id===taskId).dueDate,'2026-10-23');
 assert.equal(tasks.find(t=>t.id===taskId).deferUntil,'2026-10-20');
 assert.equal(tasks.find(t=>t.id===taskId).estimateMinutes,45);
 assert.equal((await post(putTask,env,task(taskId,'Parent renamed',childId,{baseVersion:1,sortOrder:300}))).code,200);
 assert.equal((await post(putProject,env,{...child,outcome:'Ready',baseVersion:1})).code,200);
 db.close();
});
test('Sequential and Parallel availability are based on task order, nested leaf tasks, Defer and held ancestor folders',()=>{
 const p=project(pid,'Sequential',{projectType:'sequential'});
 const a=task(taskId,'First',pid,{sortOrder:100});
 const b=task(task2Id,'Second',pid,{sortOrder:200,deferUntil:'2026-11-01'});
 const nested=task('55555555-5555-4555-a555-555555555555','Subtask',pid,{parentTaskId:taskId,sortOrder:100});
 const s={projects:{[pid]:p},tasks:{[a.id]:a,[b.id]:b,[nested.id]:nested}};
 assert.deepEqual(nextActions(s,'2026-10-21').map(x=>x.title),['Subtask']);
 assert.deepEqual(hierarchicalProjectTasks(s,pid).map(x=>[x.title,x.depth]),[['First',0],['Subtask',1],['Second',0]]);
 assert.equal(validTaskParent(s,a.id,pid,nested.id),false);
 assert.equal(validProjectParent(s,pid,pid),false);
 s.tasks[nested.id].completed=true;
 assert.deepEqual(nextActions(s,'2026-10-21').map(x=>x.title),['First']);
 s.tasks[a.id].completed=true;
 assert.equal(nextActions(s,'2026-10-21').length,0);
 assert.deepEqual(nextActions(s,'2026-11-01').map(x=>x.title),['Second']);
 s.projects[pid].projectType='parallel';s.tasks[a.id].completed=false;
 assert.deepEqual(nextActions(s,'2026-11-01').map(x=>x.title),['First','Second']);
 const folder=project(childId,'Pausierter Ordner',{kind:'folder',status:'hold'});
 s.projects[childId]=folder;s.projects[pid].parentId=childId;
 assert.equal(nextActions(s,'2026-11-01').length,0);
});
test('four independent scheduling values survive client serialization; UI has direct save and quick actions',()=>{
 const t=task(taskId,'Plan',pid,{deferUntil:'2026-10-20',plannedDate:'2026-10-22',dueDate:'2026-10-25',estimateMinutes:90});
 assert.deepEqual(Object.fromEntries(['deferUntil','plannedDate','dueDate','estimateMinutes'].map(k=>[k,taskPlain(t)[k]])),{deferUntil:'2026-10-20',plannedDate:'2026-10-22',dueDate:'2026-10-25',estimateMinutes:90});
 assert.equal(projectPlain(project(pid,'P')).projectType,'parallel');
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const val of ['date-adjust','date-clear','dateControl(\'deferUntil\'','dateControl(\'plannedDate\'','dateControl(\'dueDate\'','Duration ·','project-focus-toggle','task-add-subtask','task-move-up','hierarchicalProjectTasks'])assert.ok(source.includes(val),val);
});
