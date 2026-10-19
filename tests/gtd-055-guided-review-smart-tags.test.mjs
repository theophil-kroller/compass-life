import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readWeeklyReview,writeWeeklyReview} from '../worker/src/weekly-review.js';
import {schemaStatus} from '../worker/src/schema.js';
import {newReview,validReview,reviewQueue,reviewedStep,projectReviewSummary} from '../client/src/guided-review.js';
import {prepareTasks,localDate} from '../client/src/tasks.js';
import {tagCatalog,suggestTags,rememberTag,applyTagSuggestion} from '../client/src/smart-tags.js';
import {calendarMatchesPerson,personCalendarEvents} from '../client/src/people-matching.js';
const dir=fileURLToPath(new URL('../worker/migrations/',import.meta.url));
function db(){
 const sql=new DatabaseSync(':memory:');
 for(const name of ['0001_core.sql','0002_auth_sessions.sql','0003_watch_tracker.sql','0004_planning_tasks.sql','0005_gtd_projects_agendas.sql','0006_gtd_context_review.sql','0007_project_hierarchy.sql','0008_watch_session_tombstones.sql','0009_health_daily.sql','0010_widget_preview.sql','0011_discovery_events.sql','0012_weekly_review.sql','0013_project_templates.sql'])sql.exec(readFileSync(join(dir,name),'utf8'));
 return {sql,env:{DB:{prepare(query){return{bind(...args){const stmt=sql.prepare(query);return{first:async()=>stmt.get(...args)||null,run:async()=>({meta:{changes:Number(stmt.run(...args).changes)}}),all:async()=>({results:stmt.all(...args)})}},all:async()=>({results:sql.prepare(query).all()})}}}}};
}
const owner={sub:'owner-055'},other={sub:'other-055'};
const send=(progress,baseVersion)=>new Request('https://test.example/api/review',{method:'POST',body:JSON.stringify({progress,baseVersion})});
test('0.5.5 Review progress persists separately and conflicts protect cross-device progress',async()=>{
 const {sql,env}=db();try{
  assert.equal((await schemaStatus(env.DB)).ready,true);
  let r=newReview();assert.equal(validReview(r),true);
  let first=await writeWeeklyReview(send(r,0),env,owner);assert.equal(first.status,200);assert.equal((await first.json()).version,1);
  let second=reviewedStep(r,'collect');assert.equal(validReview(second),true);assert.equal(second.step,1);
  let saved=await writeWeeklyReview(send(second,1),env,owner);assert.equal(saved.status,200);assert.equal((await saved.json()).version,2);
  let stale=await writeWeeklyReview(send({...r,step:4},1),env,owner);assert.equal(stale.status,409);const conflict=await stale.json();assert.equal(conflict.version,2);assert.equal(conflict.progress.step,1);
  let restored=await(await readWeeklyReview(env,owner)).json();assert.equal(restored.progress.done[0],'collect');assert.equal(restored.version,2);
  const different=await(await readWeeklyReview(env,other)).json();assert.equal(different.version,0);assert.equal(different.progress,null);
  assert.equal((await writeWeeklyReview(send({...r,step:101},0),env,owner)).status,400);
  assert.ok(readFileSync(join(dir,'0012_weekly_review.sql'),'utf8').includes('CREATE TABLE IF NOT EXISTS'));
 }finally{sql.close();}
});
test('Review includes projectless tasks and due projects, without pressuring non-due projects',()=>{
 const today='2026-10-18';const state=prepareTasks({records:{},tasks:{},projects:{}});
 const pu='11111111-1111-4111-8111-111111111111', p2='22222222-2222-4222-8222-222222222222';
 state.projects[pu]={id:pu,kind:'project',status:'active',reviewIntervalDays:7,reviewedAt:null,title:'Forschung'};
 state.projects[p2]={id:p2,kind:'project',status:'active',reviewIntervalDays:14,reviewedAt:'2026-10-16T13:00:00.000Z',title:'Reise'};
 state.tasks.a={id:'a',title:'Zahnarzt anrufen',category:'Allgemein',workflow:'next',completed:false,archived:false,projectId:null,tags:[]};
 const q=reviewQueue(state,[],today);
 assert.equal(q.projects.length,2);assert.deepEqual(q.due.map(p=>p.id),[pu]);assert.equal(q.unassigned.length,1);
 assert.equal(projectReviewSummary(state.projects[p2],state,today).due,false);
});
test('Smart tags prioritize people, autocomplete substring and recent tags',()=>{
 const state={people:{a:{name:'Nathanael Kroller',tag:'nathanael kroller'},b:{name:'Ilona',tag:'ilona'}},tasks:{a:{tags:['forschung','paper'],contextTags:['laptop']}},records:{}};
 assert.ok(tagCatalog(state).some(t=>t.tag==='nathanael kroller'&&t.type==='person'));
 assert.equal(suggestTags(state,'n')[0].tag,'nathanael kroller');
 rememberTag(state,'paper');assert.ok(suggestTags(state,'pap').some(t=>t.tag==='paper'));
 assert.equal(applyTagSuggestion('ilona, nat','nathanael kroller'),'ilona, nathanael kroller');
});
test('Google calendar person matching uses exact full names or explicit aliases, not partial substrings',()=>{
 const person={name:'Nathanael Kroller',aliases:'Nathi'};
 assert.equal(calendarMatchesPerson({summary:'Kinobesuch mit Nathanael Kroller'},person),true);
 assert.equal(calendarMatchesPerson({summary:'Nathi: Schulprojekt'},person),true);
 assert.equal(calendarMatchesPerson({summary:'Antonathibaum'},person),false);
 const items=[{summary:'Nathi: Treffen',start:{date:'2026-10-22'}},{summary:'Nathanael Kroller Mittag',start:{date:'2026-10-12'}}];
 assert.equal(personCalendarEvents(items,person,'2026-10-18').upcoming.length,1);
 assert.equal(personCalendarEvents(items,person,'2026-10-18').past.length,1);
});
test('Actual UI has inline review and smart tag suggestions, only copy of Google calendar',()=>{
 const ui=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8'), css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 for(const key of ['assistant-project-reviewed','assistant-task-edit','assistant-quick-action','assistant-resolve-local','person-tag-form','personCalendarEvents','wireSmartTags(app'])assert.ok(ui.includes(key),key);
 assert.ok(css.includes('.assistant-review-grid'));assert.ok(css.includes('.smart-tags-menu'));
 assert.equal(readFileSync(new URL('../client/src/health-check.js',import.meta.url),'utf8').includes('MIN_WORKER_API_VERSION = 12'),true);
});
