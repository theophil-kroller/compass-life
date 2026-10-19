import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {linkedPersonTasks,linkedPersonInbox} from '../client/src/person-links.js';
import {matchesEventCategories,toggleEventCategory,selectedCategoryLabel} from '../client/src/discovery-category-filter.js';
const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const finance=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');
test('Inbox tags link to a person without turning inbox records into tasks',()=>{
 const p={tag:'alex beispiel'};
 const inbox=[{id:'a',title:'Berufspraktikum suchen',tags:['alex beispiel']},{id:'b',title:'Friseurtermin',tags:['#Alex Beispiel']},{id:'c',tags:['andere person']}];
 assert.deepEqual(linkedPersonInbox(inbox,p).map(x=>x.id),['a','b']);
 assert.deepEqual(linkedPersonTasks({t1:{id:'t1',tags:['alex beispiel'],completed:false},t2:{id:'t2',tags:['alex beispiel'],completed:true}},p).map(x=>x.id),['t1']);
});
test('Category multiselect is reversible and distinguishes none from all',()=>{
 const all=['Kino','Theater','Tanz'];
 assert.equal(selectedCategoryLabel(null,all),'Alle');
 let set=toggleEventCategory(null,'Theater',false,all);
 assert.deepEqual(set,['Kino','Tanz']);
 assert.equal(matchesEventCategories('Theater',set),false);
 assert.equal(matchesEventCategories('Kino',set),true);
 set=toggleEventCategory(set,'Theater',true,all);
 assert.equal(set,null);
 set=[];assert.equal(matchesEventCategories('Kino',set),false);
});
test('Health has four icon buttons with hover text and accessible labels',()=>{
 assert.match(source,/calm-health-icons/);
 for(const [id,name] of [['sleep','Schlaf'],['energy','Body Battery'],['stress','Stress'],['body','Körper']])assert.ok(source.includes(`'${id}','${name}'`));
 assert.match(source,/class="calm-icon-tooltip"/);
 assert.match(source,/aria-label="\$\{label\}" title="\$\{label\}"/);
});
test('Task list precedes collapsed form and flagged never auto-creates',()=>{
 const start=source.indexOf('function workflowScreen('),stop=source.indexOf('function projectTree(',start),fragment=source.slice(start,stop);
 assert.match(fragment,/taskList\(shown,which,which==='next'.*?<details class=/s);
 assert.match(fragment,/flag-existing/);
 assert.match(source,/class="calm-overview-extra"/);
});
test('Finance KPIs precede optional valuation and import logic remains intact',()=>{
 const start=finance.indexOf("if(pane==='Überblick'||pane==='Cashflow')"),stop=finance.indexOf("if(pane==='Ausgaben')",start),frag=finance.slice(start,stop);
 assert.ok(frag.indexOf('fin-kpi-grid fin-kpi-v17')<frag.indexOf('calm-wealth-detail'));
 assert.match(finance,/finance-import-manager/);
});
