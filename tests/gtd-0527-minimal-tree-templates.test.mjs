import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {moveProjectHierarchy,moveTaskHierarchy,cloneProjectTemplate} from '../client/src/project-workspace-v27.js';
import {prepareTasks,childProjects,taskChildren,nextActions,dueTasks,flaggedTasks,heldTasks,validProject,projectPlain,validLocalTask} from '../client/src/tasks.js';
import {projectHealth,waitingReview} from '../client/src/gtd-intelligence-v23.js';
import {reviewQueue} from '../client/src/guided-review.js';
import {putProject,listProjects,validProjectPayload} from '../worker/src/projects.js';
import {schemaStatus} from '../worker/src/schema.js';

const u=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
const project=(n,title,extra={})=>({id:u(n),title,outcome:'',category:'Allgemein',status:'active',dueDate:null,reviewIntervalDays:7,reviewedAt:null,kind:'project',projectType:'parallel',parentId:null,sortOrder:n*100,isTemplate:false,baseVersion:0,...extra});
const task=(n,title,projectId,extra={})=>({id:u(n),title,note:'',plannedDate:null,dueDate:null,category:'Allgemein',completed:false,archived:false,workflow:'next',flagged:false,projectId,parentTaskId:null,sortOrder:n*100,tags:[],contextTags:[],deferUntil:null,estimateMinutes:null,updatedAt:'2026-10-18T00:00:00.000Z',...extra});
const initial=()=>prepareTasks({projects:{},tasks:{}});
const put=(s,collection,...records)=>{for(const r of records)s[collection][r.id]=r;return s;};

test('Project drag-and-drop reorders siblings, changes folders and rejects cycles',()=>{
 const s=initial();const folder=project(1,'Ordner',{kind:'folder'}),folder2=project(2,'Ordner 2',{kind:'folder'}),a=project(3,'A',{parentId:folder.id}),b=project(4,'B',{parentId:folder.id});
 put(s,'projects',folder,folder2,a,b);
 moveProjectHierarchy(s,b.id,a.id,'before');
 assert.deepEqual(childProjects(s,folder.id).map(p=>p.title),['B','A']);
 moveProjectHierarchy(s,a.id,folder2.id,'inside');
 assert.equal(s.projects[a.id].parentId,folder2.id);
 assert.equal(s.projectPending[a.id],true);
 assert.throws(()=>moveProjectHierarchy(s,folder.id,b.id,'inside'),/Zyklische/);
 assert.throws(()=>moveProjectHierarchy(s,folder.id,folder.id,'inside'),/sich selbst/);
});

test('Tasks move with their descendants across projects without losing hierarchy or creating loops',()=>{
 const s=initial(),a=project(1,'Arbeit'),b=project(2,'Privat');put(s,'projects',a,b);
 const parent=task(10,'Koffer packen',a.id),child=task(11,'Zahnbürste',a.id,{parentTaskId:parent.id}),sibling=task(12,'Schuhe',a.id);
 put(s,'tasks',parent,child,sibling);
 moveTaskHierarchy(s,parent.id,'project',b.id);
 assert.equal(s.tasks[child.id].projectId,b.id);
 assert.equal(s.tasks[child.id].parentTaskId,parent.id);
 assert.deepEqual(taskChildren(s,b.id,null).map(x=>x.title),['Koffer packen']);
 assert.equal(s.taskPending[child.id],true);
 assert.throws(()=>moveTaskHierarchy(s,parent.id,'task',child.id,'inside'),/Zyklische/);
 moveTaskHierarchy(s,sibling.id,'task',parent.id,'inside');
 assert.equal(s.tasks[sibling.id].parentTaskId,parent.id);
 assert.deepEqual(taskChildren(s,b.id,parent.id).map(x=>x.title),['Zahnbürste','Schuhe']);
});

test('Templates never enter Next Actions/Forecast/Review; copies reset checkboxes and dates, keep nested tasks',()=>{
 const s=initial();const p=project(1,'Biogast Bestellung',{isTemplate:true});put(s,'projects',p);
 const buy=task(2,'Bio-Obst bestellen',p.id,{completed:true,dueDate:'2026-10-12',plannedDate:'2026-10-12',flagged:true});
 const check=task(3,'Gemüse prüfen',p.id,{parentTaskId:buy.id,deferUntil:'2026-10-20'});
 put(s,'tasks',buy,check);
 assert.equal(nextActions(s,'2026-10-19').length,0);
 assert.equal(dueTasks(s).length,0);
 assert.equal(flaggedTasks(s).length,0);
 assert.equal(heldTasks(s).length,0);
 assert.equal(projectHealth(s).active,0);
 assert.equal(waitingReview(s).attention,0);
 assert.equal(reviewQueue(s,[],'2026-10-19').projects.length,0);
 let id=10;const copy=cloneProjectTemplate(s,p.id,()=>u(id++),'Biogast 19. Oktober');
 assert.equal(copy.project.isTemplate,false);
 assert.equal(copy.tasks.length,2);
 assert.ok(copy.tasks.every(t=>!t.completed&&!t.dueDate&&!t.plannedDate&&!t.deferUntil));
 assert.ok(copy.tasks.every(t=>!t.flagged),'Vorlage darf keine alte Flagge in die neue Einkaufsliste übernehmen');
 assert.equal(copy.tasks[1].parentTaskId,copy.tasks[0].id);
 assert.equal(s.projects[p.id].isTemplate,true);
 assert.equal(s.tasks[buy.id].completed,true);
 assert.ok(validProject(copy.project)&&copy.tasks.every(validLocalTask));
 assert.equal(projectPlain(copy.project).isTemplate,false);
 assert.throws(()=>moveTaskHierarchy(s,check.id,'project',copy.project.id),/Vorlagen bleiben getrennt/);
});

test('Template migration is additive and the API persists is_template through a real SQLite roundtrip',async()=>{
 const db=new DatabaseSync(':memory:');
 try{
  const migrations=fileURLToPath(new URL('../worker/migrations/',import.meta.url));
  for(const name of ['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0004_planning_tasks.sql','0005_gtd_projects_agendas.sql','0006_gtd_context_review.sql','0007_project_hierarchy.sql','0008_watch_session_tombstones.sql','0009_health_daily.sql','0010_widget_preview.sql','0011_discovery_events.sql','0012_weekly_review.sql','0013_project_templates.sql'])db.exec(readFileSync(join(migrations,name),'utf8'));
  assert.deepEqual(await schemaStatus({prepare:sql=>({all:async()=>({results:db.prepare(sql).all()})})}),{ready:true,requiredMigration:null,missing:[]});
  const env={DB:{prepare(sql){return {bind(...args){return {first:async()=>db.prepare(sql).get(...args)||null,all:async()=>({results:db.prepare(sql).all(...args)}),run:async()=>({meta:{changes:Number(db.prepare(sql).run(...args).changes)}})}}};}}};
  const source=project(1,'Wocheneinkauf',{isTemplate:true});assert.equal(validProjectPayload(source),true);
  assert.equal(validProjectPayload({...source,isTemplate:'yes'}),false);
  const response=await putProject(new Request('https://example.test',{method:'POST',body:JSON.stringify(source)}),env,{sub:'owner'});
  assert.equal(response.status,200,await response.text());
  const projects=(await (await listProjects(env,{sub:'owner'})).json()).projects;
  assert.equal(projects.length,1);assert.equal(projects[0].isTemplate,true);
  const sql=readFileSync(join(migrations,'0013_project_templates.sql'),'utf8');
  assert.doesNotMatch(sql,/\bDROP\b|\bDELETE\b|\bTRUNCATE\b/i);
 }finally{db.close();}
});

test('Minimal UI uses compact headings, tree-first list, contextual inspector, drop and fallback movement',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(main,/page-intro page-intro-compact/);
 assert.match(main,/function treeProjectRows\(/);
 assert.match(main,/function treeTaskRows\(/);
 assert.match(main,/tree-inspector-close/);
 assert.match(main,/tree-move-task-form/);
 assert.match(main,/\.tree-drop-target,\.tree-root-drop/);
 assert.match(main,/tree-template-use/);
 assert.match(main,/navItem\('templates','Vorlagen'/);
 assert.match(css,/\.tree-workspace\.has-inspector/);
 assert.match(css,/\.tree-inline-add/);
});
