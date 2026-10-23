import test from 'node:test';
import assert from 'node:assert/strict';
import {peopleInScope,peopleScopeCounts} from '../client/src/people-scope-v57720.js';
import {mergeTaskSnapshot,mergeProjectSnapshot,prepareTasks} from '../client/src/tasks.js';
import {readFileSync} from 'node:fs';

const contacts=[{id:'a',name:'Prof',relationKind:'colleague'}, {id:'b',name:'Friend',relationKind:'friend'}, {id:'c',name:'Untyped'}, {id:'d',name:'Partner',relationKind:'partner'}];
test('Arbeitskollegen / Privat / Alle filter by explicit relationship kind without changing source contacts',()=>{
 const original=JSON.stringify(contacts);
 assert.deepEqual(peopleInScope(contacts,'work').map(p=>p.id),['a']);
 assert.deepEqual(peopleInScope(contacts,'private').map(p=>p.id),['b','c','d']);
 assert.deepEqual(peopleInScope(contacts,'all').map(p=>p.id),['a','b','c','d']);
 assert.deepEqual(peopleScopeCounts(contacts),{all:4,work:1,private:3});
 assert.equal(JSON.stringify(contacts),original);
 assert.deepEqual(peopleInScope([],'private'),[]);
});
test('Snapshot merge does not rewrite equal version; never suppresses a newer version',()=>{
 const id='00000000-0000-4000-8000-000000000001';
 const st=prepareTasks({tasks:{[id]:{id,title:'Lokal',version:3}},projects:{[id]:{id,title:'Projekt Lokal',version:2}},taskVersions:{[id]:3},projectVersions:{[id]:2}});
 assert.equal(mergeTaskSnapshot(st,[{id,title:'Alter GET',version:3}]),0);
 assert.equal(st.tasks[id].title,'Lokal');
 assert.equal(mergeProjectSnapshot(st,[{id,title:'Alter GET',version:2}]),0);
 assert.equal(st.projects[id].title,'Projekt Lokal');
 assert.equal(mergeTaskSnapshot(st,[{id,title:'Neu',version:4}]),1);
 assert.equal(mergeProjectSnapshot(st,[{id,title:'Neu P',version:3}]),1);
 assert.equal(st.tasks[id].title,'Neu');assert.equal(st.projects[id].title,'Neu P');
});
test('People filter action exists and respects actual local contact count when filtered list is empty',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/data-action="people-scope720"/);
 assert.match(main,/if\(action==='people-scope720'\)/);
 assert.match(main,/!counts\.all\?`<section class="work-card people-sync719-alert"/);
 assert.match(main,/peopleMapMarkup\(people,selected\)/);
});
