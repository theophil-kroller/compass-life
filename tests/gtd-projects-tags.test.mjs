import test from 'node:test';
import assert from 'node:assert/strict';
import {validProjectPayload} from '../worker/src/projects.js';
import {validTask} from '../worker/src/tasks.js';
import {parseTags,validLocalTask,validProject,agendaForEvent,nextActions,heldTasks,flaggedTasks,projectTasks,mergeProjectSnapshot,prepareTasks} from '../client/src/tasks.js';
import {validateMutation} from '../worker/src/validation.js';
const pid='1a222d99-c4e6-4009-bdd4-b71dd3d56f3d',tid='1c88a917-a9df-409a-9de3-90821fe6bf73';
const task={id:tid,title:'UKO Prüfungsordnung besprechen',note:'',plannedDate:null,dueDate:null,category:'Lehre',completed:false,archived:false,workflow:'next',flagged:true,projectId:pid,tags:['uko'],baseVersion:0};
const project={id:pid,title:'Lehre Oktober',outcome:'Abgaben abgeschlossen',category:'Lehre',status:'active',dueDate:null,baseVersion:0};
test('Undated Next Actions permitted; workflow and project association retained',()=>{
 assert.equal(validTask(task),true);assert.equal(validLocalTask(task),true);
 assert.equal(validTask({...task,workflow:'invalid'}),false);
 assert.equal(validTask({...task,tags:['<img onerror=alert(1)>']}),false);
 assert.equal(validTask({...task,projectId:'abc'}),false);
 const state={tasks:{[tid]:task}};
 assert.equal(nextActions(state).length,1);assert.equal(flaggedTasks(state).length,1);assert.equal(projectTasks(state,pid).length,1);
 state.tasks[tid].workflow='waiting';assert.equal(nextActions(state).length,0);assert.equal(heldTasks(state).length,1);
});
test('Project validation, optimistic conflict protection and local pending merge',()=>{
 assert.equal(validProject(project),true);assert.equal(validProjectPayload(project),true);
 assert.equal(validProjectPayload({...project,dueDate:'2026-02-31'}),false);
 assert.equal(validProjectPayload({...project,title:'  '}),false);
 assert.equal(validProjectPayload({...project,status:'bogus'}),false);
 const state=prepareTasks({});state.projects[pid]=project;state.projectPending[pid]=true;
 mergeProjectSnapshot(state,[{...project,title:'Cloud',version:3}]);assert.equal(state.projects[pid].title,project.title);
 delete state.projectPending[pid];mergeProjectSnapshot(state,[{...project,title:'Cloud',version:3}]);assert.equal(state.projects[pid].title,'Cloud');
});
test('Tags from Inbox and tasks match calendar event by exact word and not substring',()=>{
 assert.deepEqual(parseTags(' #UKO, Martin; uko '),['uko','martin']);
 const state={tasks:{[tid]:{...task,tags:['uko']}},records:{a:{id:'a',title:'Vertrag',tags:['martin'],deleted:false}}};
 assert.equal(agendaForEvent(state,{summary:'UKO Weekly Jour fixe'}).length,1);
 assert.equal(agendaForEvent(state,{summary:'Meeting mit Martin'}).length,1);
 assert.equal(agendaForEvent(state,{summary:'Martina Workshop'}).length,0);
});
test('Old inbox mutations remain compatible; new tags validated',()=>{
 const sample={id:'a23fbfd6-4291-4dfe-87fa-8e8623678123',mutationId:'f00e5bac-e0a1-4542-84c6-36458a9557b1',baseVersion:0,title:'Notiz',note:'',deleted:false};
 assert.equal(validateMutation(sample),null);
 assert.equal(validateMutation({...sample,tags:['uko','martin']}),null);
 assert.equal(validateMutation({...sample,tags:['<script>']}),'invalid-tags');
});
