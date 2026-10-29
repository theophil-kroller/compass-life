import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {gtdCheckpoint,paintGtdProgress} from '../client/src/fast-gtd-actions-v5775940256.js';
import {restorePlanningCheckpoint} from '../client/src/fast-planning-v57721.js';
import {taskDescendants} from '../client/src/project-workspace-v27.js';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const measured={veryLargeImportedHealth:Array.from({length:30000},(_,i)=>i),financeTransactions:[{amount:120,description:'private'}]};
function state(){return {...measured,tasks:{a:{id:'a',projectId:'p',progressTarget:50,progressCurrent:4,sortOrder:100},b:{id:'b',projectId:'p',sortOrder:200}},projects:{p:{id:'p',kind:'project',title:'Pruefungen'}},taskPending:{},projectPending:{}};}
test('GTD +1 checkpoint snapshots only changed task and does not clone health or finance',()=>{
 const s=state(), healthRef=s.veryLargeImportedHealth,finRef=s.financeTransactions;
 const prior=gtdCheckpoint(s,{singleTaskId:'a'});
 s.tasks.a={...s.tasks.a,progressCurrent:5};s.taskPending.a=true;
 assert.equal(s.tasks.a.progressCurrent,5);
 restorePlanningCheckpoint(s,prior);
 assert.equal(s.tasks.a.progressCurrent,4);assert.equal(s.taskPending.a,undefined);
 assert.strictEqual(s.veryLargeImportedHealth,healthRef);assert.strictEqual(s.financeTransactions,finRef);
});
test('GTD drag/reorder checkpoint correctly restores mutated task/project objects',()=>{
 const s=state(),prior=gtdCheckpoint(s);
 s.tasks.a.projectId='other';s.tasks.b.sortOrder=10;s.projects.p.title='Temporary';s.taskPending.a=true;
 restorePlanningCheckpoint(s,prior);
 assert.equal(s.tasks.a.projectId,'p');assert.equal(s.tasks.b.sortOrder,200);assert.equal(s.projects.p.title,'Pruefungen');assert.equal(s.taskPending.a,undefined);
});
test('task descendants scale to deep hierarchies while preserving depth-first order and cycles',()=>{
 const s=state();s.tasks.a.parentTaskId='z';
 s.tasks.z={id:'z',projectId:'p'};
 s.tasks.x={id:'x',projectId:'p',parentTaskId:'a'};
 s.tasks.y={id:'y',projectId:'p',parentTaskId:'a'};
 s.tasks.w={id:'w',projectId:'p',parentTaskId:'x'};
 assert.deepEqual(taskDescendants(s,'a'),['x','w','y']);
 // 4k steps previously caused an O(N²) scan; stack must not overflow.
 const deep={tasks:{}};for(let i=0;i<4000;i++)deep.tasks[i]={id:String(i),parentTaskId:i?String(i-1):null};
 assert.equal(taskDescendants(deep,'0').length,3999);
});
test('inline +1/−1 changes only progress UI, no full root replacement',()=>{
 const count={textContent:'4/50'},bar={value:4,max:50,setAttribute(k,v){this[k]=v;}},strong={textContent:'4/50'},field={value:'4',closest(){return {dataset:{id:'a'}}}},summary={textContent:'',closest(){return {dataset:{id:'a'}}}};
 const row={title:'',querySelector(s){return s==='.v42-progress-count'?count:bar;}};
 const inspector={querySelector(){return strong}};
 const plus={dataset:{action:'task-progress-plus',id:'a'},closest(s){return s==='.v42-task-progress'?row:inspector},disabled:false};
 const minus={dataset:{action:'task-progress-minus',id:'a'},closest(s){return s==='.v42-task-progress'?row:inspector},disabled:false};
 const root={querySelectorAll(s){if(s.includes('[data-action='))return [plus,minus];if(s.includes('[name='))return [field];if(s.includes('summary'))return [summary];return [];}};
 paintGtdProgress(root,'a',{id:'a',progressCurrent:50,progressTarget:50});
 assert.equal(count.textContent,'50/50');assert.equal(strong.textContent,'50/50');assert.equal(bar.value,50);assert.equal(field.value,'50');assert.equal(plus.disabled,true);assert.equal(minus.disabled,false);
});
test('release injects instant progress, selective checkpoints, synchronous move rendering before encrypted save',async()=>{
 const cfg=readFileSync(join(root,'client/vite.config.js'),'utf8');
 const imports=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.*?)'/g)].map(m=>[m[1],m[2]]));
 const calls=[...cfg.matchAll(/\b(\w+)\(\)/g)].map(m=>m[1]).filter(name=>imports.has(name));
 let s=readFileSync(join(root,'client/src/main.js'),'utf8');
 for(const name of calls){const m=await import(pathToFileURL(join(root,'client',imports.get(name))).href);const result=await m[name]().transform(s,join(root,'client/src/main.js'));if(result?.code)s=result.code;}
 assert.match(s,/const COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.25\.7'/);
 assert.match(s,/fastGtd\?gtdCheckpoint\(state/);
 assert.match(s,/if\(!fastPlanning\)syncQuickPublicFromState/);
 assert.match(s,/paintGtdProgress\(app,id,state\.tasks\[id\]\)/);
 assert.match(s,/GTD Aktion bis Paint/);
 assert.match(s,/moveTaskHierarchy\(s,taskId,type,targetId,'inside'\)/);
 assert.match(s,/if\(!fastGtd&&\['source','receiver'\]/);
 assert.match(s,/gtdTicket===fastGtdMutationRevision/);
});
