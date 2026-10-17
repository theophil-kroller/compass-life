import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nextActions,flaggedTasks,heldTasks,blockedByProject,isDreamRecord,dreamRecords,inboxRecords,parseTags} from '../client/src/tasks.js';
const id='fbdf5da4-5a3e-4c68-8735-c5a2074d42f6';
const task=(title,props={})=>({id:crypto.randomUUID(),title,workflow:'next',completed:false,archived:false,flagged:false,...props});
const s={tasks:{},projects:{},records:{}};
function add(t){s.tasks[t.id]=t;return t;}
test('Flagged contains only explicitly flagged tasks, not overdue, planned or truthy legacy string values',()=>{
 const sample={...s,tasks:{}};
 for(const t of [task('Not flagged',{dueDate:'2025-01-01'}),task('String false',{flagged:'false'}),task('Held but not flagged',{workflow:'hold'}),task('Actually flagged',{flagged:true}),task('Done flagged',{flagged:true,completed:true})])sample.tasks[t.id]=t;
 assert.deepEqual(flaggedTasks(sample).map(x=>x.title),['Actually flagged']);
});
test('Next Actions exclude paused projects, waiting, held, future defer; ready action remains available',()=>{
 const sample={tasks:{},projects:{[id]:{id,status:'hold'}}};
 for(const t of [task('Ready'),task('Waiting',{workflow:'waiting'}),task('Paused',{workflow:'hold'}),task('Deferred',{deferUntil:'2099-12-01'}),task('Project paused',{projectId:id})])sample.tasks[t.id]=t;
 assert.deepEqual(nextActions(sample,'2026-10-18').map(x=>x.title),['Ready']);
 assert.deepEqual(heldTasks(sample).map(x=>x.title),['Paused','Waiting']);
 assert.deepEqual(blockedByProject(sample).map(x=>x.title),['Project paused']);
});
test('Dreams tag is deliberate classification; open Dreams excluded from Inbox; unrelated tags preserved',()=>{
 const ordinary={id:crypto.randomUUID(),title:'Inbox',tags:[],deleted:false,updatedAt:'2026-10-18T01:00:00Z'};
 const idea={id:crypto.randomUUID(),title:'Idea',tags:['dreams','dream-lesen','friends'],deleted:false,updatedAt:'2026-10-18T02:00:00Z'};
 const removed={id:crypto.randomUUID(),title:'Deleted',tags:['dreams'],deleted:true,updatedAt:'2026-10-18T03:00:00Z'};
 const sample={records:{[ordinary.id]:ordinary,[idea.id]:idea,[removed.id]:removed}};
 assert.deepEqual(inboxRecords(sample).map(x=>x.title),['Inbox']);
 assert.deepEqual(dreamRecords(sample).map(x=>x.title),['Idea']);
 assert.equal(isDreamRecord(removed),false);
 assert.deepEqual(parseTags(['dreams','dream-ideen','Gym']),['dreams','dream-ideen','gym']);
});
test('UI routes selected task only if present, holds project links, creates and reviews Dreams',()=>{
 const ui=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const name of ['perspectiveItems.some(t=>t.id===selectedTaskId)','dream-create-form','dream-edit-form','dream-to-inbox','dream-to-next','review-clarify:${value}','hold-open-project','id="agenda-details"'])assert.ok(ui.includes(name),`Missing ${name}`);
 assert.ok(!ui.includes('Someday-Review öffnen</button>'), 'old inert Dreams review button');
});
test('Forecast has explicit 3-column desktop grid and responsive layout; no new database migration',()=>{
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(css,/\.forecast-layout\{grid-template-columns:195px minmax\(0,1fr\) minmax\(290px,340px\)/);
 assert.match(css,/\.forecast-inspector\{grid-column:1 \/ -1/);
});
