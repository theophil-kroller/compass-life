import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inboxTodayTaskDraft} from '../client/src/inbox-today-v557.js';
import {inboxRecords,tasksForDay,nextActions} from '../client/src/tasks.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',taskId='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const state=()=>({records:{[id]:{id,title:'SchulFox Nachricht',note:'Frage zu Schulprojekt',tags:['schulprojekt','compass-system-flag'],deleted:false,updatedAt:'2026-10-20T12:00:00Z'}},projects:{},tasks:{},pending:[],taskPending:{}});
test('quick Inbox Today creates valid, projectless, deadline-free action preserving metadata',()=>{
 const s=state();const t=inboxTodayTaskDraft(s,id,taskId,'2026-10-20');
 assert.equal(t.title,'SchulFox Nachricht');assert.equal(t.note,'Frage zu Schulprojekt');
 assert.equal(t.workflow,'next');assert.equal(t.projectId,null);assert.equal(t.dueDate,null);assert.equal(t.deferUntil,null);
 assert.equal(t.plannedDate,'2026-10-20');assert.equal(t.flagged,true);assert.deepEqual(t.tags,['schulprojekt']);
 assert.equal(s.records[id].deleted,false);assert.equal(Object.keys(s.tasks).length,0);
 s.tasks[taskId]=t;s.records[id].deleted=true;
 assert.equal(inboxRecords(s).length,0);assert.equal(tasksForDay(s,'2026-10-20').length,1);assert.equal(nextActions(s,'2026-10-20').length,1);
});
test('quick Inbox Today fails safely for unavailable or incompatible entries without mutation',()=>{
 const s=state();assert.throws(()=>inboxTodayTaskDraft(s,id,taskId,'2026-02-30'),/Planungstag/);
 s.records[id].title='X'.repeat(181);assert.throws(()=>inboxTodayTaskDraft(s,id,taskId,'2026-10-20'),/180/);
 s.records[id].title='OK';s.records[id].note='X'.repeat(3001);assert.throws(()=>inboxTodayTaskDraft(s,id,taskId,'2026-10-20'),/3.000/);
 s.records[id].deleted=true;assert.throws(()=>inboxTodayTaskDraft(s,id,taskId,'2026-10-20'),/nicht mehr verfügbar/);
 assert.equal(Object.keys(s.tasks).length,0);
});
test('Inbox Today is an independent accessible row action with atomic promotion and pending sync',()=>{
 const screen=main.slice(main.indexOf('function inboxScreen(){'),main.indexOf('function clarifyControls(',main.indexOf('function inboxScreen(){')));
 assert.match(screen,/data-action="inbox-plan-today"/);assert.match(screen,/class="inbox-quick-today"/);
 assert.match(screen,/aria-label="\$\{h\(r.title\)\} als Next Action für heute übernehmen/);
 const handler=main.slice(main.indexOf("if(action==='inbox-plan-today')"),main.indexOf("if(action==='inbox-move-up'",main.indexOf("if(action==='inbox-plan-today')")));
 assert.match(handler,/inboxTodayTaskDraft\(state,id,crypto.randomUUID\(\),today,stamp\(\)\)/);
 assert.match(handler,/await mutate\(s=>\{/);assert.match(handler,/s.tasks\[task.id\]=task;s.taskPending\[task.id\]=true/);
 assert.match(handler,/original.deleted=true/);assert.match(handler,/s.pending.push\(makeMutation\(original\)\)/);
 assert.match(handler,/original.deleted\|\|s.tasks\[task.id\]/);
 assert.match(css,/\.inbox-row-wrap \.inbox-quick-today/);
 assert.match(css,/@media\(max-width:580px\)/);
});
