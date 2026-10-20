import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {deadlineIntelligence} from '../client/src/deadline-intelligence-v45.js';
import {exportProjectPlan,parseProjectPlan,projectImportPreview,applyProjectPlan} from '../client/src/project-exchange-v45.js';
const pid='123e4567-e89b-42d3-a456-426614174000';
const tid='123e4567-e89b-42d3-a456-426614174001';
const child='123e4567-e89b-42d3-a456-426614174002';
const day='2026-10-19';
const state=()=>({projects:{[pid]:{id:pid,title:'Korrekturen',kind:'project',category:'Pruefungen',status:'active',projectType:'parallel',folderIcon:null,reviewIntervalDays:7,dueDate:'2026-10-20'}},tasks:{[tid]:{id:tid,title:'24 Klausuren korrigieren',category:'Pruefungen',projectId:pid,progressTarget:36,progressCurrent:12,estimateMinutes:288,workflow:'next',sortOrder:100}},projectPending:{},taskPending:{}});
const forecast=(mins=180)=>({status:'ready',from:day,through:'2026-11-01',source:'test',slots:[{start:new Date('2026-10-19T09:00:00').getTime(),end:new Date('2026-10-19T12:00:00').getTime(),minutes:mins}]});
test('Deadline Intelligence inherits project hard deadline and estimates remaining pieces without creating calendar events',()=>{
 const s=state(),copy=JSON.stringify(s),r=deadlineIntelligence(s,forecast());
 assert.equal(r.status,'risk');assert.equal(r.items.length,1);assert.equal(r.items[0].minutes,192);assert.equal(r.items[0].slack,-12);assert.equal(r.items[0].inherited,true);assert.equal(JSON.stringify(s),copy);
});
test('Adequate time no false conflict; completed, soft-dated, held and parent summaries excluded',()=>{
 const s=state();s.tasks[tid].progressCurrent=36;
 s.tasks[child]={...s.tasks[tid],id:child,title:'Soft date',progressTarget:null,progressCurrent:0,estimateMinutes:45,projectId:null,plannedDate:'2026-10-19',dueDate:null};
 assert.equal(deadlineIntelligence(s,forecast(360)).items.length,0);
 assert.equal(deadlineIntelligence(s,forecast(360)).soft,1);
 s.tasks[tid].progressCurrent=10;
 assert.equal(deadlineIntelligence(s,forecast(360)).items[0].status,'ok');
 s.tasks[tid].estimateMinutes=null;
 assert.equal(deadlineIntelligence(s,forecast(360)).unknown,1);
 s.tasks[tid].workflow='waiting';assert.equal(deadlineIntelligence(s,forecast(360)).unknown,0);
});
test('No coverage, stale data or outside horizon do not invent feasibility',()=>{
 assert.equal(deadlineIntelligence(state(),{status:'stale'}).status,'unavailable');
 const r=deadlineIntelligence(state(),{...forecast(),through:day});
 assert.equal(r.items[0].status,'beyond-horizon');assert.equal(r.items[0].capacity,null);
});
test('Project export/parse roundtrip preserves GTD structure, duration, dates and progress',()=>{
 const s=state();s.tasks[child]={...s.tasks[tid],id:child,title:'Schriftliche Rückmeldung',parentTaskId:tid,estimateMinutes:40,progressTarget:null,progressCurrent:0};
 const exported=exportProjectPlan(s,pid);const parsed=parseProjectPlan(JSON.stringify(exported));
 assert.equal(parsed.projects.length,1);assert.equal(parsed.tasks.length,2);
 assert.equal(parsed.tasks[1].parentTaskKey,tid);assert.equal(parsed.tasks[0].progressCurrent,12);
 assert.equal(parsed.projects[0].dueDate,'2026-10-20');
 assert.equal(parsed.tasks[0].estimateMinutes,288);
});
test('New plan creates hierarchy atomically and marks every item for sync',()=>{
 const doc={format:'compass-project-exchange',version:1,projects:[{key:'folder',title:'Forschung',kind:'folder'},{key:'project',title:'Review',parentKey:'folder'}],tasks:[{key:'task1',projectKey:'project',title:'30 Paper lesen',estimateMinutes:480,progressTarget:30,progressCurrent:0},{key:'task2',projectKey:'project',parentTaskKey:'task1',title:'Abstracts markieren',estimateMinutes:60}]};
 const plan=parseProjectPlan(doc);const s={projects:{},tasks:{}};let i=0;
 const result=applyProjectPlan(s,plan,{idFactory:()=>`123e4567-e89b-42d3-a456-${String(++i).padStart(12,'0')}`});
 assert.equal(result.projects,2);assert.equal(result.tasks,2);assert.deepEqual(s,{projects:{},tasks:{}});
 assert.ok(Object.values(result.state.projects).some(p=>p.kind==='folder'));
 const t=Object.values(result.state.tasks).find(t=>t.title==='Abstracts markieren');
 assert.ok(result.state.tasks[t.parentTaskId]);assert.equal(Object.keys(result.state.taskPending).length,2);
});
test('Imported existing IDs never silently overwrite records; explicit update requires unchanged preview',()=>{
 const s=state(),plan=parseProjectPlan(exportProjectPlan(s,pid));
 const original=JSON.stringify(s);const preview=projectImportPreview(s,plan);
 assert.equal(preview.updates,2);
 const unchanged=applyProjectPlan(s,plan,{idFactory:()=>{throw Error('Should not create IDs');}});
 assert.equal(unchanged.projects+unchanged.tasks,0);assert.equal(JSON.stringify(s),original);
 plan.tasks[0].title='Neu aus GPT';const baseline={[tid]:JSON.stringify(s.tasks[tid]),[pid]:JSON.stringify(s.projects[pid])};
 const updated=applyProjectPlan(s,plan,{updateExisting:true,idFactory:()=>{throw Error('Should not create IDs');},baseline});
 assert.equal(updated.state.tasks[tid].title,'Neu aus GPT');assert.equal(s.tasks[tid].title,'24 Klausuren korrigieren');
 s.tasks[tid].title='Inzwischen manuell geändert';
 assert.throws(()=>applyProjectPlan(s,plan,{updateExisting:true,idFactory:()=>tid,baseline}),/seit der Vorschau/);
});
test('Invalid exchange files, cyclic nesting, cross-project parents and injected HTML are rejected/escaped',()=>{
 const minimal={format:'compass-project-exchange',version:1,projects:[{key:'a',title:'Projekt'}],tasks:[]};
 assert.throws(()=>parseProjectPlan(JSON.stringify({...minimal,version:999})),/Unbekanntes/);
 assert.throws(()=>parseProjectPlan({...minimal,projects:[{key:'a',title:'P',parentKey:'b'},{key:'b',title:'Q',parentKey:'a'}]}),/Zyklus/);
 assert.throws(()=>parseProjectPlan({...minimal,tasks:[{key:'x',projectKey:'missing',title:'Task'}]}),/unbekanntes Projekt/);
 assert.throws(()=>parseProjectPlan({...minimal,tasks:[{key:'x',projectKey:'a',title:'T',estimateMinutes:999999}]}),/Ungültige Aufgabendaten/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/projectExchangePanel\(\)/);assert.match(main,/project-exchange-commit/);assert.match(main,/h\(p.title\)/);
});
test('Version and read-only UX constraints preserved',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.61'/);
 assert.match(main,/deadlineCompact\(\{inForecast:true\}\)/);
 assert.doesNotMatch(readFileSync(new URL('../client/src/deadline-intelligence-v45.js',import.meta.url),'utf8'),/fetch\(|localStorage|setItem/);
 assert.doesNotMatch(readFileSync(new URL('../client/src/project-exchange-v45.js',import.meta.url),'utf8'),/fetch\(|eval\(|localStorage/);
});

test('Existing project with tasks cannot silently become a folder on reimport',()=>{
 const s=state(),plan=parseProjectPlan(exportProjectPlan(s,pid));
 plan.projects[0].kind='folder';plan.projects[0].folderIcon='folder';
 assert.throws(()=>applyProjectPlan(s,plan,{updateExisting:true,idFactory:()=>{throw Error('not needed');}}),/Projekt enthält Aufgaben/);
 assert.equal(s.projects[pid].kind,'project');
});
