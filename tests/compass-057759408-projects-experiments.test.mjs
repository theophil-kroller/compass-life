import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {duplicateProject48,ancestorLifecycle48,visibleInProjectTree48,lifecycleRows48,canPurgeProject48,redactProject48,projectIcon48,projectVaultPanel48} from '../client/src/project-lifecycle-v57759408.js';
import {coachTrialStart48,coachTrialEvaluate48,coachTrialFinish48,coachNof1Panel48} from '../client/src/strength-nof1-v57759408.js';
import {validProject,PROJECT_STATUSES,mergeProjectSnapshot} from '../client/src/tasks.js';
import {validProjectPayload} from '../worker/src/projects.js';

const p=(id,title,parentId=null,status='active',kind='project')=>({id,title,parentId,status,kind,outcome:'',category:'Allgemein',reviewIntervalDays:7,projectType:'parallel',sortOrder:0});
const rootId='00000000-0000-4000-8000-000000000001',folderId='00000000-0000-4000-8000-000000000002',childId='00000000-0000-4000-8000-000000000003';
test('duplicate creation is blocked only for the same parent and project type',()=>{
 const state={projects:{[rootId]:p(rootId,'Gründungsgarage',folderId)}};
 assert.equal(duplicateProject48(state,{title:' GRÜNDUNGSGARAGE ',parentId:folderId})?.id,rootId);
 assert.equal(duplicateProject48(state,{title:'Gründungsgarage',parentId:null}),null);
 assert.equal(duplicateProject48(state,{title:'Gründungsgarage',parentId:folderId,kind:'folder'}),null);
});
test('folder lifecycle hides descendants without deleting tasks and archive/trash have separate listings',()=>{
 const state={projects:{[folderId]:p(folderId,'Lehre',null,'trash','folder'),[childId]:p(childId,'Gründungsgarage',folderId)},tasks:{t1:{projectId:childId,title:'Nicht verlieren'}}};
 assert.equal(visibleInProjectTree48(state,state.projects[childId]),false);
 assert.equal(ancestorLifecycle48(state,state.projects[childId]),'trash');
 assert.deepEqual(lifecycleRows48(state,'trash').map(x=>x.id),[folderId]);
 assert.equal(canPurgeProject48(state,folderId),false);
 state.projects[folderId].status='archived';
 assert.deepEqual(lifecycleRows48(state,'archived').map(x=>x.id),[folderId]);
 assert.equal(state.tasks.t1.title,'Nicht verlieren');
 state.projects[folderId].status='active';
 assert.equal(visibleInProjectTree48(state,state.projects[childId]),true);
});
test('empty trashed project can be purged with redacted metadata, server and client validate lifecycle status',()=>{
 const state={projects:{[rootId]:p(rootId,'Ein Doppelprojekt',null,'trash')},tasks:{}};
 assert.equal(canPurgeProject48(state,rootId),true);
 const deleted=redactProject48(state.projects[rootId]);
 assert.equal(deleted.title,'Entferntes Projekt');
 assert.equal(deleted.status,'deleted');
 assert.equal(deleted.outcome,'');
 assert.equal(validProject(deleted),true);
 assert.equal(validProjectPayload({...deleted,baseVersion:2}),true);
 assert.equal(PROJECT_STATUSES.includes('archived'),true);
 assert.equal(PROJECT_STATUSES.includes('trash'),true);
 assert.equal(PROJECT_STATUSES.includes('deleted'),true);
 assert.equal(canPurgeProject48({projects:{[rootId]:state.projects[rootId]},tasks:{a:{projectId:rootId}}},rootId),false);
});
test('special shopping/checklist icons and separated archive/trash surface',()=>{
 assert.equal(projectIcon48(p(folderId,'Einkaufslisten',null,'active','folder')),'cart');
 assert.equal(projectIcon48(p(folderId,'Check-Listen',null,'active','folder')),'checkSquare');
 const state={projects:{[rootId]:p(rootId,'Projekt A',null,'archived')}};
 const ui=projectVaultPanel48(state,'archived',(x)=>x);
 assert.match(ui,/Wiederherstellen/);assert.match(ui,/In Papierkorb/);assert.doesNotMatch(ui,/Endgültig löschen/);
});
const makeSession=(date,reps,rest=90)=>({source:'compass-guided-v5920',startedAt:`${date}T09:00:00Z`,completed:true,id:date,
 exercises:[{exerciseId:'dumbbell-row',confirmedSets:[1,2,3].map((setNumber)=>({confirmed:true,setNumber,reps,weightKg:8,rir:2,
  completedAt:`${date}T09:${String(setNumber*5).padStart(2,'0')}:00Z`,...(setNumber>1?{setStartedAt:new Date(Date.parse(`${date}T09:${String((setNumber-1)*5).padStart(2,'0')}:00Z`)+rest*1000).toISOString()}:{} )}))}]});
test('N-of-1 trial measures before/after at the same load and requires comparison days',()=>{
 const state={strengthGuidedSessions:[makeSession('2026-09-01',10),makeSession('2026-09-15',10),makeSession('2026-09-29',10)],coachTrials48:[]};
 const trial=coachTrialStart48(state,{exerciseId:'dumbbell-row',exerciseTitle:'Rudern',strategy:'longer-rest',today:'2026-10-01'});
 assert.equal(state.coachTrials48.length,1);
 assert.equal(trial.baseline.reps,10);
 assert.throws(()=>coachTrialStart48(state,{exerciseId:'dumbbell-row',strategy:'longer-rest',today:'2026-10-01'}),/läuft bereits/);
 assert.equal(coachTrialEvaluate48(state,trial,'2026-10-10').status,'collecting');
 for(const dt of ['2026-10-04','2026-10-14','2026-10-24'])state.strengthGuidedSessions.push(makeSession(dt,11,180));
 const review=coachTrialEvaluate48(state,trial,'2026-10-27');
 assert.equal(review.status,'improved');assert.equal(review.deltaReps,1);assert.equal(review.restChanged,90);
 assert.match(review.interpretation,/kein Kausalnachweis/);
 coachTrialFinish48(state,trial.id,'2026-10-27');
 assert.equal(trial.status,'finished');assert.equal(trial.result.deltaReps,1);
});
test('N-of-1 never calls changing load proof of an improvement',()=>{
 const st={strengthGuidedSessions:[makeSession('2026-09-01',10),makeSession('2026-09-15',10)],coachTrials48:[]};
 const trial=coachTrialStart48(st,{exerciseId:'dumbbell-row',strategy:'progress-reps',today:'2026-10-01'});
 for(const dt of ['2026-10-04','2026-10-14','2026-10-24']){const row=makeSession(dt,12);row.exercises[0].confirmedSets.forEach(x=>x.weightKg=12);st.strengthGuidedSessions.push(row);}
 assert.equal(coachTrialEvaluate48(st,trial,'2026-10-27').status,'collecting');
 assert.throws(()=>coachTrialFinish48(st,trial.id,'2026-10-27'),/Vergleichseinheiten/);
});
test('Vite release integrates both UI and coach experiment persistence into the entire pipeline',async()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 const imports=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...cfg.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 assert.equal(names.at(-1),'compass594017NutritionFocusRelease');
 for(const file of ['main.js','strength-coach-v5775910.js','ars-vivendi-lock-v5775922.js']){
  let code=readFileSync(new URL('../client/src/'+file,import.meta.url),'utf8');
  for(const name of names){const mod=await import(new URL('../client/'+imports.get(name),import.meta.url));const transformed=mod[name]().transform(code,'/repo/client/src/'+file);if(transformed?.code)code=transformed.code;}
  execFileSync(process.execPath,['--input-type=module','--check'],{input:code});
  if(file==='main.js')for(const key of ['projectVaultPanel48','p48-purge','projectCreating48','coachTrialStart48','duplicateProject48',"COMPASS_CLIENT_VERSION='0.5.77.59.40.17'"])assert.ok(code.includes(key),key);
  if(file.startsWith('strength-coach'))assert.match(code,/coachNof1Panel48\(state,plan,today\)/);
 }
});

test('N-of-1 adapts the next single variable after an unsuccessful trial, but not after a confounded trial',async()=>{
 const {coachTrialNextStrategy48}=await import('../client/src/strength-nof1-v57759408.js');
 const history={coachTrials48:[{exerciseId:'dumbbell-row',status:'finished',strategy:'longer-rest',result:{status:'unchanged'}}]};
 assert.equal(coachTrialNextStrategy48(history,'dumbbell-row','longer-rest').strategy,'progress-reps');
 history.coachTrials48[0].result.status='inconclusive';
 assert.equal(coachTrialNextStrategy48(history,'dumbbell-row','longer-rest').strategy,'measure-rest');
 history.coachTrials48[0].result.status='declined';
 assert.equal(coachTrialNextStrategy48(history,'dumbbell-row','longer-rest',true).strategy,'consider-deload');
});
