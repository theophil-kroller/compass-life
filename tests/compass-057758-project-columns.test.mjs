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
 const templates=false,treeIndex={},selection=null,selectedTask=null,active=0;
 const settings=selection?\`<details class="project-properties">Settings</details>\`:'';
 return chrome(\`<div class="tree-workspace \${selectedTask||selection?'has-inspector':''}"></div>\`);
}
function compass57ShopStatistics(){return '<section class="work-card compass57-shopping-stats">';}
function shoppingScreen(){return chrome(\`<div class="shopping713-shell">\${receiptInboxView(state,{draft:receiptDraft743})}<section class="work-card shopping713-overview">Checklist</section></div>\`);}
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
function insightsScreen(){if(!compass54Ready('insights'))return compass54LoadingScreen('insights');}
function render(){
 if(state&&compass55Mode==='focus'&&['insights','finance','activity','recovery','progress'].includes(tab)){tab='today';todayInspectorOpen=false;calmNavGroup='';}
}
function bind(){
 const dream743Form=app.querySelector('#dream743-form');
}
function handleDreamTap(){
 if(action==='dream743-open'){
  tab='insights';insightTab='dreamworld';calmNavGroup='insights';dreamEditingId743='';render();return;
 }
}

`;
const source=scaffold.replaceAll('\\`','`').replaceAll('\\${','${');
const transformed=compass758Bridge().transform(source,'/repo/client/src/main.js').code;

test('.58 transforms a realistic post-.57.1 source and parses',()=>{
 assert.match(transformed,/COMPASS_CLIENT_VERSION='0\.5\.77\.58\.2'/);
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
 assert.match(projectView,/id="task-row"/);assert.doesNotMatch(projectView,/PROJECT-EDIT-FORM/);
 vm.runInContext('compass58InspectorHidden=false',ctx);
 assert.match(vm.runInContext('compass58ProjectLayout({treeIndex:index,selection:project,selectedTask:null,settings:"PROJECT-EDIT-FORM",active:1})',ctx),/PROJECT-EDIT-FORM/);
 const taskView=vm.runInContext('compass58ProjectLayout({treeIndex:index,selection:project,selectedTask:task,settings:"PROJECT-EDIT-FORM",active:1})',ctx);
 assert.match(taskView,/id="task-editor"/);assert.doesNotMatch(taskView,/PROJECT-EDIT-FORM/);
 vm.runInContext('compass58InspectorHidden=true',ctx);
 const withoutInspector=vm.runInContext('compass58ProjectLayout({treeIndex:index,selection:project,selectedTask:task,settings:"PROJECT-EDIT-FORM",active:1})',ctx);
 assert.match(withoutInspector,/id="task-row"/);assert.doesNotMatch(withoutInspector,/class="compass58-inspector work-card/);
});

test('Kassenbon receipt data is never built in list view, only on statistics tab',()=>{
 const list=transformed.slice(transformed.indexOf('function shoppingScreen(){'),transformed.indexOf('function inboxScreen(){'));
 const stats=transformed.slice(transformed.indexOf('function compass57ShopStatistics(){'),transformed.indexOf('function shoppingScreen(){'));
 assert.doesNotMatch(list,/receiptInboxView\(state,/);
 assert.match(stats,/return receiptInboxView\(state,\{draft:receiptDraft743\}\)/);
 assert.match(list,/class="work-card shopping713-overview"/);
});
test('Project inspector is collapsed by default and collapses after folder or project selection',()=>{
 assert.match(transformed,/let compass58InspectorHidden=true;/);
 assert.match(transformed,/selectedTaskId=null;compass58InspectorHidden=true;if\(p.kind/);
 assert.match(transformed,/settings=\(selection&&\(templates\|\|!compass58InspectorHidden\)\)\?/);
});

// Real post-.45 markup has a month argument. Earlier mocked tests omitted it
// and therefore missed the production-only CI failure in deployment #225.
test('receipt extraction accepts real post-.45 month parameter and leaves the shopping checklist clean',()=>{
 const actualSource=source.replace('receiptInboxView(state,{draft:receiptDraft743})',
                                   'receiptInboxView(state,{draft:receiptDraft743,month:receiptMonth745})');
 assert.notEqual(actualSource,source,'the post-.45 fixture includes the real receipt arguments');
 const actual=compass758Bridge().transform(actualSource,'/repo/client/src/main.js').code;
 const list=actual.slice(actual.indexOf('function shoppingScreen(){'),actual.indexOf('function inboxScreen(){'));
 const stats=actual.slice(actual.indexOf('function compass57ShopStatistics(){'),actual.indexOf('function shoppingScreen(){'));
 assert.doesNotMatch(list,/receiptInboxView\(state/);
 assert.match(stats,/receiptInboxView\(state,\{draft:receiptDraft743,month:receiptMonth745\}\)/);
});


test('Moon shortcut works in Focus; other analytics still redirect to Today',()=>{
 assert.match(transformed,/tab==='insights'&&insightTab!=='dreamworld'/);
 assert.match(transformed,/if\(insightTab!=='dreamworld'&&!compass54Ready\('insights'\)\)/);
 assert.match(transformed,/if\(action==='dream743-open'\)\{\n  compass59DreamFocusPending=true/);
 assert.match(transformed,/compass59FocusDreamField\(\)/);
 assert.match(transformed,/if\(compass59DreamFocusPending&&dream743Form\)compass59FocusDreamField\(\)/);
});
test('One tap focuses encrypted dream input when DOM is available; retries after form arrives',()=>{
 const pos=transformed.indexOf('let compass59DreamFocusPending=false;');
 const end=transformed.indexOf('function render(){',pos);
 assert.ok(pos>=0&&end>pos);
 let focused=0,scrolled=0,showForm=false;
 const field={focus(){focused++},scrollIntoView(){scrolled++}};
 const ctx={app:{querySelector(selector){return showForm&&selector==='#dream743-form textarea[name="body"]'?field:null}}};
 vm.createContext(ctx);
 vm.runInContext(transformed.slice(pos,end),ctx);
 vm.runInContext('compass59DreamFocusPending=true',ctx);
 assert.equal(vm.runInContext('compass59FocusDreamField()',ctx),false);
 assert.equal(focused,0);
 showForm=true;
 assert.equal(vm.runInContext('compass59FocusDreamField()',ctx),true);
 assert.equal(focused,1);
 assert.equal(scrolled,1);
 assert.equal(vm.runInContext('compass59DreamFocusPending',ctx),false);
});
