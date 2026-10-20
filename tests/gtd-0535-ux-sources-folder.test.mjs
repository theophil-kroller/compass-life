import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {healthSourcesView} from '../client/src/health-dashboard.js';
import {FOLDER_ICONS,folderIcon,validFolderIcon} from '../client/src/folder-icons-v35.js';
import {projectPlain,validProject} from '../client/src/tasks.js';
import {schemaStatus} from '../worker/src/schema.js';
import {putProject,listProjects,validProjectPayload} from '../worker/src/projects.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const main=readFileSync(join(root,'client/src/main.js'),'utf8');
const css=readFileSync(join(root,'client/src/style.css'),'utf8');
const uuid='12345678-1234-4123-8123-123456789012';
const p={id:uuid,title:'Forschung',outcome:'',category:'Forschung',status:'active',dueDate:null,reviewIntervalDays:7,reviewedAt:null,kind:'folder',folderIcon:'book',isTemplate:false,projectType:'parallel',parentId:null,sortOrder:100,baseVersion:0};
const names=['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0004_planning_tasks.sql','0005_gtd_projects_agendas.sql','0006_gtd_context_review.sql','0007_project_hierarchy.sql','0008_watch_session_tombstones.sql','0009_health_daily.sql','0010_widget_preview.sql','0011_discovery_events.sql','0012_weekly_review.sql','0013_project_templates.sql','0014_private_device_mirror.sql','0015_project_folder_icons.sql','0016_task_progress_counters.sql','0017_private_device_chunks.sql'];
function db(){const sql=new DatabaseSync(':memory:');for(const name of names)sql.exec(readFileSync(join(root,'worker/migrations',name),'utf8'));return {sql,env:{DB:{prepare(query){return{all:async()=>({results:sql.prepare(query).all()}),bind(...args){return{first:async()=>sql.prepare(query).get(...args)||null,all:async()=>({results:sql.prepare(query).all(...args)}),run:async()=>({meta:{changes:Number(sql.prepare(query).run(...args).changes)}})}}}}}}};}
test('Datenquellen show three compact source cards; advanced instructions and destructive actions are disclosed',()=>{
 const html=healthSourcesView({garminNights:[{day:'2026-10-10'}],garminHrv:[{day:'2026-10-10'}],fitdays:[{day:'2026-10-10'}],garminSessions:[{day:'2026-10-10'}]});
 assert.match(html,/health-source-summary/);assert.equal((html.match(/class="health-source-card"/g)||[]).length,3);
 assert.match(html,/Neuen Export importieren/);assert.match(html,/id="health-import-input"/);assert.match(html,/type="file" multiple/);
 assert.match(html,/<details class="health-source-advanced">/);assert.match(html,/Exportanleitungen und Datenverwaltung/);
 assert.match(html,/health-import-clear/);assert.match(html,/nicht Ende-zu-Ende-verschlüsselt/);
 assert.doesNotMatch(html,/href="javascript:/);
});
test('sources connection settings stay visible as disclosures, not removed; 1:2 people layout and OmniFocus dates',()=>{
 assert.match(main,/health-source-connection-head/);assert.match(main,/Geräte, Widget und Zugriffsrechte verwalten/);
 for(const feature of ['widget-pair','widget-revoke','health-pair','health-revoke','health-delete-all','health-refresh'])assert.ok(main.includes(feature),feature);
 assert.match(main,/insight-source-heading/);assert.match(css,/\.people-grid\{grid-template-columns:minmax\(245px,1fr\) minmax\(0,2fr\)/);
 assert.match(main,/people-add-person/);assert.match(main,/lang="de-AT" aria-label/);
 assert.match(css,/\.task-edit-form \.date-control>input\{background:#fff/);
});
test('folder icons whitelist rejects arbitrary injection and persist in project payload',async()=>{
 assert.ok(FOLDER_ICONS.length>=10);assert.equal(validFolderIcon('<svg>'),false);assert.equal(validFolderIcon('javascript:alert(1)'),false);
 assert.equal(folderIcon({kind:'folder',folderIcon:'book'}),'book');assert.equal(folderIcon({kind:'folder',folderIcon:'evil'}),'folder');
 assert.ok(validProject(p));assert.ok(validProjectPayload(p));assert.equal(validProjectPayload({...p,folderIcon:'<svg onload=alert(1)>'}),false);
 assert.equal(projectPlain(p).folderIcon,'book');
 const {sql,env}=db();try{
  assert.deepEqual(await schemaStatus(env.DB),{ready:true,requiredMigration:null,missing:[]});
  const res=await putProject(new Request('https://test.invalid/',{method:'POST',body:JSON.stringify(p)}),env,{sub:'owner'});
  assert.equal(res.status,200,await res.text());const stored=(await(await listProjects(env,{sub:'owner'})).json()).projects[0];assert.equal(stored.folderIcon,'book');
  const edit=await putProject(new Request('https://test.invalid/',{method:'POST',body:JSON.stringify({...p,baseVersion:1,folderIcon:'spark'})}),env,{sub:'owner'});assert.equal(edit.status,200);const changed=(await edit.json()).project;assert.equal(changed.folderIcon,'spark');
 }finally{sql.close();}
});
test('folder symbol button opens inspector picker; date shortcuts preserved',()=>{
 assert.match(main,/folder-icon-open/);assert.match(main,/folderIconPicker\(selection\)/);assert.match(main,/name="folderIcon"/);
 for(const v of ['date-adjust','date-clear','Defer','Planned','Due'])assert.ok(main.includes(v),v);
});
