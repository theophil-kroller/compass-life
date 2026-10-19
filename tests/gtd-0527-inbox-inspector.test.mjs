import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inboxTaskDraft} from '../client/src/inbox-promotion-v27.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const projectId='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const newId='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const state=()=>({records:{[id]:{id,title:'Budget klären',note:'Mit Katja besprechen',tags:['katja'],deleted:false}},tasks:{},projects:{[projectId]:{id:projectId,title:'Plan 2026',kind:'project',category:'Allgemein',status:'active',isTemplate:false}}});
test('0.5.27 inbox project assignment makes valid Next Action draft without changing original',()=>{
 const s=state();const t=inboxTaskDraft(s,id,{projectId,workflow:'next',title:'Budget abstimmen',tags:['katja']},newId,'2026-10-19T12:00:00Z');
 assert.equal(t.projectId,projectId);assert.equal(t.title,'Budget abstimmen');assert.equal(t.workflow,'next');assert.deepEqual(t.tags,['katja']);
 assert.equal(s.records[id].deleted,false);assert.equal(Object.keys(s.tasks).length,0);
 assert.equal(t.dueDate,null);assert.equal(t.plannedDate,null);
});
test('0.5.27 inbox remains standalone when no project assigned, waiting for is explicit',()=>{
 const t=inboxTaskDraft(state(),id,{workflow:'waiting'},newId);assert.equal(t.projectId,null);assert.equal(t.workflow,'waiting');
});
test('0.5.27 rejects unavailable projects, project templates and completed projects',()=>{
 const s=state();assert.throws(()=>inboxTaskDraft(s,id,{projectId:'ffffffff-ffff-4fff-8fff-ffffffffffff'},newId),/Projekt/);
 s.projects[projectId].isTemplate=true;assert.throws(()=>inboxTaskDraft(s,id,{projectId},newId),/Vorlage/);
 s.projects[projectId].isTemplate=false;s.projects[projectId].status='completed';assert.throws(()=>inboxTaskDraft(s,id,{projectId},newId),/Projekt/);
});
test('0.5.27 never loses title or truncates meeting notes without warning',()=>{
 const s=state();assert.throws(()=>inboxTaskDraft(s,id,{title:'A'.repeat(181)},newId),/180/);
 assert.throws(()=>inboxTaskDraft(s,id,{note:'N'.repeat(3001)},newId),/3.000/);
 s.records[id].deleted=true;assert.throws(()=>inboxTaskDraft(s,id,{},newId),/nicht mehr verfügbar/);
});
test('0.5.27 inbox retains calm inspector with direct project selection',()=>{
 const part=main.slice(main.indexOf('function inboxScreen(){'),main.indexOf('function clarifyControls('));
 assert.match(part,/class="inbox-promote-fields"/);assert.match(part,/name="projectId"/);
 assert.match(part,/name="workflow"/);assert.match(part,/name="intent" value="promote"/);
 assert.match(main,/inboxTaskDraft\(state,id/);assert.match(main,/s\.taskPending\[task\.id\]=true/);
 assert.match(main,/s\.records\[id\]\.deleted=true/);assert.match(css,/inbox-quiet-inspector/);
});
