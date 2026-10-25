import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {compass758Bridge} from '../client/compass758-bridge.js';

// Synthetic scaffold checks self-consistency, not a replacement for the real-main.js chain gate.
const scaffold=String.raw`
const COMPASS_CLIENT_VERSION='0.5.77.57.1';
import './mobile-workflow-v57757.css';
function projectScreen(){
 const templates=false,treeIndex={},selection=null,selectedTask=null,settings='',active=0;
 return chrome(\`<div class="tree-workspace \${selectedTask||selection?'has-inspector':''}"></div>\`);
}
function inboxScreen(){return \`<form><div class="inbox-detail-actions"><button type="submit" name="intent" value="promote">Aufgabe</button></div></form>\`;}
async function actions(action,id,form,editForm){
 if(action==='tree-inspector-close'){selectedTaskId=null;selectedProjectId=null;render();return;}
 if(action==='tree-task-select'){const t=state.tasks?.[id];if(!t)return;selectedTaskId=id;selectedProjectId=t.projectId;render();return;}
 if(action==='tree-create-close'){return;}
 if(action==='project-select'){
  const p=state.projects[id];projectCollapsed.delete(id);selectedProjectId=id;selectedTaskId=null;
  return;
 }
 const intent=ev.submitter?.value||'save';
    if(intent==='promote'){}
}
`;
const source=scaffold.replaceAll('\\`','`').replaceAll('\\${','${');
const transformed=compass758Bridge().transform(source,'/repo/client/src/main.js').code;

test('.58 transforms a realistic post-.57.1 source and parses',()=>{
 assert.match(transformed,/COMPASS_CLIENT_VERSION='0\.5\.77\.58'/);
 const tmp=mkdtempSync(join(tmpdir(),'compass58-'));
 try{const file=join(tmp,'check.mjs');writeFileSync(file,transformed);execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}finally{rmSync(tmp,{recursive:true,force:true})}
});
test('folder navigation and task outline are separate; inspector follows selection',()=>{
 assert.match(transformed,/function compass58Navigator\(/);
 assert.match(transformed,/function compass58ProjectLayout\(/);
 assert.match(transformed,/treeTaskRows\(selection\.id,null,0,new Set\(\),treeIndex\)/);
 assert.match(transformed,/selectedTaskId=id;selectedProjectId=t\.projectId;compass58InspectorHidden=false;/);
 assert.match(transformed,/if\(tab==='projects'\)\{compass58InspectorHidden=true;render\(\);return;/);
 assert.match(transformed,/if\(!templates\)return compass58ProjectLayout/);
});
test('Inbox → Dreams is an atomic record reclassification, not a new task',()=>{
 const i=transformed.indexOf("if(intent==='dream')"),end=transformed.indexOf("if(intent==='promote')",i);
 assert.ok(i>0&&end>i);
 const block=transformed.slice(i,end);
 assert.match(block,/record\.tags=parseTags\(\['dreams','dream-'/);
 assert.match(block,/s\.pending\.push\(makeMutation\(record\)\)/);
 assert.doesNotMatch(block,/s\.tasks\[/);
 assert.doesNotMatch(block,/record\.deleted=true/);
 assert.match(transformed,/value="dream"/);
});
test('real source gate must be last bridge and protected in CI',()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compass757Bridge\(\), compass758Bridge\(\)\]/);
 const gate=readFileSync(new URL('./compass-057757-full-transform-chain.test.mjs',import.meta.url),'utf8');
 assert.match(gate,/imports\.at\(-1\)\.exportName,'compass758Bridge'/);
});
test('mobile retains navigation and inspector, supports standard accessibility labels',()=>{
 const css=readFileSync(new URL('../client/src/project-workspace-v57758.css',import.meta.url),'utf8');
 assert.match(css,/\.compass58-mobile-explorer/);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(transformed,/aria-label="Ordner und Projekte"/);
 assert.match(transformed,/aria-label="Aufgaben von/);
});


test('nested folders open only on selection/expansion and inspector reflects task selection',()=>{
 const from=transformed.indexOf('const compass58Expanded=new Set();');
 const to=transformed.indexOf('function projectScreen(){',from);
 assert.ok(from>=0&&to>from,'actual helper block embedded');
 const folder={id:'folder',parentId:null,kind:'folder',title:'Forschung',status:'active'};
 const project={id:'project',parentId:'folder',kind:'project',title:'Dissertation',status:'active'};
 const task={id:'task',projectId:'project',title:'Artikel lesen'};
 const children=id=>id===null?[folder]:id==='folder'?[project]:[];
 const index={projectChildren:children,orphans:[],counts:new Map([['project',1]])};
 const ctx={
  state:{projects:{folder,project},tasks:{task}},selectedProjectId:null,selectedTaskId:null,treeCreateKind:'',
  h:x=>String(x),ico:(name)=>'['+name+']',folderIcon:()=> 'folder',isShoppingList:()=>false,
  treeTaskRows:()=>'<span id="task-row">Artikel lesen</span>',taskEditor:()=>'<input id="task-editor"/>',
  treeTaskDestinationOptions:()=>'<option value="project">Dissertation</option>',chrome:x=>x,
  projectExchangePanel:()=>'',lifeGoalsPanel:()=>'',gtdProjectHealthPanel:()=>'',
  projectParentOptions:()=>'',taskCreateForm:()=>'',treeTaskParent:null,treeCreateParent:null,
  index,folder,project,task
 };
 vm.createContext(ctx);vm.runInContext(transformed.slice(from,to),ctx);
 const closed=vm.runInContext('compass58Navigator(index)',ctx);
 assert.match(closed,/Forschung/);assert.doesNotMatch(closed,/Dissertation/);
 vm.runInContext("compass58Expanded.add('folder')",ctx);
 const opened=vm.runInContext('compass58Navigator(index)',ctx);
 assert.match(opened,/Dissertation/);assert.doesNotMatch(opened,/Artikel lesen/);
 vm.runInContext("compass58Collapsed.add('folder')",ctx);
 assert.doesNotMatch(vm.runInContext('compass58Navigator(index)',ctx),/Dissertation/);
 vm.runInContext("compass58Collapsed.delete('folder')",ctx);
 ctx.selectedProjectId='project';
 const projectView=vm.runInContext('compass58ProjectLayout({treeIndex:index,selection:project,selectedTask:null,settings:"PROJECT-EDIT-FORM",active:1})',ctx);
 assert.match(projectView,/id="task-row"/);assert.match(projectView,/PROJECT-EDIT-FORM/);
 const taskView=vm.runInContext('compass58ProjectLayout({treeIndex:index,selection:project,selectedTask:task,settings:"PROJECT-EDIT-FORM",active:1})',ctx);
 assert.match(taskView,/id="task-editor"/);assert.doesNotMatch(taskView,/PROJECT-EDIT-FORM/);
 vm.runInContext('compass58InspectorHidden=true',ctx);
 const withoutInspector=vm.runInContext('compass58ProjectLayout({treeIndex:index,selection:project,selectedTask:task,settings:"PROJECT-EDIT-FORM",active:1})',ctx);
 assert.match(withoutInspector,/id="task-row"/);assert.doesNotMatch(withoutInspector,/class="compass58-inspector work-card/);
});
