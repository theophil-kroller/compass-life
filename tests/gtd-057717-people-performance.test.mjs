import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildPersonAgendaIndex,sortPeopleByOpenItems} from '../client/src/people-agenda-index-v57717.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const guard=readFileSync(new URL('../client/src/edit-draft-guard-v57716.js',import.meta.url),'utf8');

test('Agenda projection groups open tasks and Inbox by person tag once and deduplicates tags',()=>{
 const people=[{id:'a',name:'Anna',tag:'anna'},{id:'b',name:'Berta',tag:'berta'},{id:'c',name:'Clara',tag:'clara'}];
 const tasks={
  t1:{id:'t1',title:'Rückmeldung',tags:['ANNA','anna'],contextTags:['berta'],workflow:'waiting'},
  t2:{id:'t2',title:'Brief senden',tags:['anna'],flagged:true},
  t3:{id:'t3',title:'Abgeschlossen',tags:['anna'],completed:true},
  t4:{id:'t4',title:'Vorlage',tags:['anna'],projectId:'master'},
  t5:{id:'t5',title:'Archiv',tags:['berta'],archived:true}
 };
 const records=[{id:'r1',title:'Notiz',tags:['berta','ANNA']},{id:'r2',tags:['anna'],deleted:true},{id:'r3',tags:['anna','dreams']}];
 const out=buildPersonAgendaIndex(people,tasks,records,{master:{isTemplate:true}});
 assert.deepEqual(out.get('a').tasks.map(t=>t.id),['t2','t1']);
 assert.deepEqual(out.get('a').inbox.map(r=>r.id),['r1']);
 assert.deepEqual(out.get('b').tasks.map(t=>t.id),['t1']);
 assert.deepEqual(out.get('b').inbox.map(r=>r.id),['r1']);
 assert.deepEqual(out.get('c'),{tasks:[],inbox:[]});
 assert.deepEqual(sortPeopleByOpenItems(people,out).map(x=>x.id),['a','b','c']);
 assert.deepEqual(people.map(x=>x.id),['a','b','c']);
});
test('Large projection keeps 500 contacts and 8,000 linked entries without repeated scans',()=>{
 const people=Array.from({length:500},(_,i)=>({id:'p'+i,name:'P '+i,tag:'person'+i}));
 const tasks=Object.fromEntries(Array.from({length:5000},(_,i)=>['t'+i,{id:'t'+i,title:'Test '+i,tags:['person'+(i%500)],completed:false,archived:false}]));
 const records=Array.from({length:3000},(_,i)=>({id:'r'+i,tags:['person'+(i%500)],deleted:false}));
 const out=buildPersonAgendaIndex(people,tasks,records,{});
 assert.equal(out.size,500);
 assert.equal([...out.values()].reduce((n,x)=>n+x.tasks.length,0),5000);
 assert.equal([...out.values()].reduce((n,x)=>n+x.inbox.length,0),3000);
});
test('People view is action-first: agenda before optional relationship metadata',()=>{
 const start=main.indexOf('function peopleScreen(){');const end=main.indexOf('function financeScreen()',start);
 const section=main.slice(start,end);
 assert.ok(section.includes('buildPersonAgendaIndex'));
 assert.ok(section.indexOf('people-agenda-first')<section.indexOf('p717-optional-relationship'));
 assert.match(section,/peopleRadarExpanded\?`<div class="p717-relationship-panel">/);
 assert.match(main,/data-action="people-radar-toggle"/);
 assert.match(main,/pendingIds\.has\(r\.id\)/);
});
test('Contact note autosave no longer persists and encrypts whole Vault on each keystroke',()=>{
 const start=main.indexOf("  const contactForm=app.querySelector('#person-contact-form')");
 const end=main.indexOf('  if(contactForm)contactForm.onsubmit',start);
 const section=main.slice(start,end);
 assert.ok(start>0&&end>start);
 assert.doesNotMatch(section,/persist\(/);
 assert.match(guard,/'person-contact-form'/);
});

import {buildPlanTreeIndex} from '../client/src/plan-tree-index-v57717.js';
test('Planen tree indexes hierarchy in one pass and excludes archived tasks',()=>{
 const state={projects:{a:{id:'a',title:'Root'},b:{id:'b',parentId:'a',title:'Child'},o:{id:'o',parentId:'missing',title:'Orphan'}},tasks:{t1:{id:'t1',title:'Milk',projectId:'a'},t2:{id:'t2',title:'Cheese',projectId:'a',parentTaskId:'t1'},t3:{id:'t3',projectId:'a',archived:true}}};
 const idx=buildPlanTreeIndex(state);
 assert.deepEqual(idx.projectChildren(null).map(x=>x.id),['a']);
 assert.deepEqual(idx.projectChildren('a').map(x=>x.id),['b']);
 assert.deepEqual(idx.orphans.map(x=>x.id),['o']);
 assert.deepEqual(idx.taskChildren('a',null).map(x=>x.id),['t1']);
 assert.deepEqual(idx.taskChildren('a','t1').map(x=>x.id),['t2']);
 assert.equal(idx.counts.get('a'),2);
});
