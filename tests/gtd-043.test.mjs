import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nextActions, contextsFor, projectNeedsReview, validLocalTask, validProject, taskPlain, projectPlain} from '../client/src/tasks.js';
import {validTask} from '../worker/src/tasks.js';
import {validProjectPayload} from '../worker/src/projects.js';
import {schemaStatus} from '../worker/src/schema.js';

const id='d2199b67-d69e-4b1e-a1b8-9df37ce0ff4e';
const task={id,title:'Bibliothek prüfen',note:'',plannedDate:null,dueDate:null,category:'Forschung',completed:false,archived:false,workflow:'next',flagged:false,projectId:null,tags:[],deferUntil:null,contextTags:['laptop','büro'],estimateMinutes:25,baseVersion:0};
const project={id,title:'Projekt',outcome:'Resultat',category:'Forschung',status:'active',dueDate:null,reviewIntervalDays:14,reviewedAt:null,baseVersion:0};

test('0.4.3 task fields roundtrip and backend reject invalid estimates/contexts/dates',()=>{
  assert.equal(validLocalTask(task),true);
  assert.equal(validTask(task),true);
  assert.equal(validTask({...task,estimateMinutes:0}),false);
  assert.equal(validTask({...task,contextTags:['!unsafe']}),false);
  assert.equal(validTask({...task,deferUntil:'2026-02-30'}),false);
  assert.deepEqual(taskPlain(task).contextTags,['laptop','büro']);
});

test('deferred next actions stay hidden until date; context filter only includes available tasks',()=>{
  const later={...task,id:'db69aa61-dbd0-4e16-87d8-ea1a4cae5b67',title:'Später',deferUntil:'2026-11-01'};
  const s={tasks:{[id]:task,[later.id]:later},projects:{}};
  assert.equal(nextActions(s,'2026-10-18').length,1);
  assert.equal(nextActions(s,'2026-11-01').length,2);
  assert.deepEqual(contextsFor(s,'BÜRO').map(t=>t.title),['Bibliothek prüfen']);
  s.projects[id]={...project,status:'hold'};
  s.tasks[id].projectId=id;
  assert.equal(nextActions(s,'2026-10-18').length,0);
});

test('project review date and custom interval are validated and preserved',()=>{
  assert.equal(validProject(project),true);
  assert.equal(validProjectPayload(project),true);
  assert.equal(validProjectPayload({...project,reviewIntervalDays:0}),false);
  assert.equal(projectPlain(project).reviewIntervalDays,14);
  assert.equal(projectNeedsReview(project,'2026-10-18'),true);
  assert.equal(projectNeedsReview({...project,reviewedAt:'2026-10-10T11:00:00.000Z'},'2026-10-18'),false);
  assert.equal(projectNeedsReview({...project,reviewedAt:'2026-10-03T11:00:00.000Z'},'2026-10-18'),true);
  assert.equal(projectNeedsReview({...project,status:'hold'},'2026-10-18'),false);
});

test('read-only D1 schema readiness reports correct missing migrations',async()=>{
  const columns={private_device_mirror:['owner_sub','kind','ciphertext','version','salt'],items:['id','tags_json'],planning_tasks:['id','workflow','flagged','project_id','tags_json','defer_until','context_tags_json','estimate_minutes','parent_task_id','sort_order'],planning_projects:['id','review_interval_days','reviewed_at','kind','project_type','parent_id','sort_order','is_template','folder_icon'],watch_deleted_sessions:['owner_sub','session_id','deleted_at'],health_pair_codes:['code_hash','owner_sub','expires_at'],health_devices:['token_hash','owner_sub','revoked'],health_daily:['owner_sub','day','steps','sleep_minutes','exercise_minutes'],discovery_events:['owner_sub','event_key','event_json','status','removed','version'],widget_pair_codes:['code_hash','owner_sub','expires_at'],widget_devices:['token_hash','owner_sub','revoked'],weekly_review_progress:['owner_sub','progress_json','version']};
  const db={prepare(sql){const table=sql.match(/table_info\((\w+)\)/)[1];return {all:async()=>({results:(columns[table]||[]).map(name=>({name}))})};}};
  assert.deepEqual((await schemaStatus(db)).missing,[]);
  columns.planning_projects=columns.planning_projects.filter(x=>x!=='kind');
  assert.equal((await schemaStatus(db)).requiredMigration,'0007');
  columns.planning_projects.push('kind');
  columns.planning_tasks=columns.planning_tasks.filter(x=>x!=='defer_until');
  assert.equal((await schemaStatus(db)).requiredMigration,'0006');
  columns.items=columns.items.filter(x=>x!=='tags_json');
  assert.equal((await schemaStatus(db)).requiredMigration,'0005');
  columns.planning_tasks=[];
  assert.equal((await schemaStatus(db)).requiredMigration,'0001–0004');
});

test('SQL of 0.4.3 is strictly additive; review conversion, context UI and health gate are present',()=>{
  const sql=readFileSync(new URL('../worker/migrations/0006_gtd_context_review.sql',import.meta.url),'utf8');
  assert.doesNotMatch(sql, /\b(?:DROP|DELETE|TRUNCATE)\b/i);
  assert.match(sql,/ADD COLUMN defer_until/);
  assert.match(sql,/ADD COLUMN review_interval_days/);
  const ui=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
  assert.match(ui,/review-clarify:/);
  assert.match(ui,/project-reviewed/);
  assert.match(ui,/context-filter/);
  assert.match(ui,/assertCompatibleWorker\(health\)/);
});
