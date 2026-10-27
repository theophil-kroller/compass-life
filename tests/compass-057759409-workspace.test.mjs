import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {todayOrdered49,todayMove49,taskLife49,taskLifecycleView49,TASK_TRASH_TAG49} from '../client/src/compass-workspace-v57759409.js';
import {validTask} from '../worker/src/tasks.js';
const root=new URL('../',import.meta.url);
const t=(id,title,sortOrder=0)=>({id,title,plannedDate:'2026-10-27',completed:false,archived:false,sortOrder});

test('Today ordering uses user-controlled sortOrder, new tasks append; move persists values',()=>{
 const state={tasks:{a:t('a','Alpha'),b:t('b','Bravo'),c:t('c','Charlie')}};
 const moved=todayMove49(state,'2026-10-27','c',-1);
 assert.deepEqual(moved.map(x=>x.id),['a','c','b']);
 moved.forEach(x=>state.tasks[x.id].sortOrder=x.sortOrder);
 state.tasks.d=t('d','Delta');
 assert.deepEqual(todayOrdered49(Object.values(state.tasks)).map(x=>x.id),['a','c','b','d']);
 assert.deepEqual(todayMove49(state,'2026-10-27','a',-1),[]);
});

test('Task archive and trash are distinct without unsupported backend columns',()=>{
 const row=t('id','Projekt bearbeiten');row.archived=true;row.tags=[];
 assert.equal(taskLife49(row),'archived');row.tags=[TASK_TRASH_TAG49];assert.equal(taskLife49(row),'trash');
 const state={tasks:{a:{...row,id:'a'}}};
 assert.match(taskLifecycleView49(state,'trash',(x)=>x,(x)=>x),/Wiederherstellen/);
 assert.doesNotMatch(taskLifecycleView49(state,'archived',(x)=>x,(x)=>x),/Projekt bearbeiten/);
 const apiRow={...row,id:'00000000-0000-4000-8000-000000000009',note:'',category:'Allgemein',workflow:'next',flagged:false,completed:false,plannedDate:'2026-10-27',dueDate:null,deferUntil:null,estimateMinutes:null,projectId:null,contextTags:[],parentTaskId:null,progressCurrent:0,progressTarget:null,baseVersion:1};
 assert.equal(validTask(apiRow),true);
});

test('COMPLETE transformed Web app renders sticky archive/trash in real 3pane, task buttons and Today sort',async()=>{
 const cfg=readFileSync(new URL('client/vite.config.js',root),'utf8');
 const imported=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...cfg.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 assert.equal(names.at(-1),'compass594010ProjectSyncRecoveryRelease');
 let src=readFileSync(new URL('client/src/main.js',root),'utf8');
 for(const name of names){const mod=await import(pathToFileURL(new URL('client/'+imported.get(name),root).pathname));const result=mod[name]().transform(src,'/repo/client/src/main.js');if(result?.code)src=result.code;}
 execFileSync(process.execPath,['--input-type=module','--check'],{input:src});
 assert.match(src,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.10'/);
 assert.match(src,/compass49VaultNavigation\(\)/);
 assert.match(src,/taskLifecycleView49\(state,projectVaultView48,ico,h\)/);
 assert.match(src,/todayOrdered49\(tasksForDay\(state,day\)/);
 assert.match(src,/data-action="p49-today-up"/);
 assert.match(src,/data-action="p49-today-down"/);
 assert.match(src,/data-action="task49-trash"/);
 assert.match(src,/data-action="p48-archive"/);
 assert.match(src,/data-action="p48-view-trash"/);
 assert.match(src,/data-action="p48-view-archive"/);
 assert.match(src,/class="p49-task-row-actions"/);
});
