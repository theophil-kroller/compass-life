import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {compass755Bridge} from '../client/compass755-bridge.js';

// A deliberately small, realistic integration fixture. The transform must be
// fail-closed when any matching app anchor is changed or missing.
const fixture=`import './on-demand-v57754.css';
const COMPASS_CLIENT_VERSION='0.5.77.54';
const app=document.getElementById('app');
let state=null,tab='today',selectedTaskId=null,todayInspectorOpen=false,calmNavGroup='';
let notice='',error=''; const performanceTrace={start:()=>0};
const h=x=>String(x),ico=()=>'';
function chrome(content){let title='Heute',today='25. Okt.';
return \`<div class="shell premium751"><aside class="sidebar"><div class="brand"><span class="brand-icon premium751-brandmark"><img src="\${import.meta.env.BASE_URL}icon-192.png" width="38" height="38" alt="" decoding="async"/></span><span class="brand-name">Compass<small>Personal Life Manager · \${COMPASS_CLIENT_VERSION}</small></span></div>
<nav class="side-nav calm-side-nav"><div class="calm-nav-group">
 <button type="button" class="calm-group-toggle \${calmNavGroup==='insights'?'is-open':''}">Insights</button></div>
<div class="calm-nav-group">
 <button type="button" class="calm-group-toggle \${calmNavGroup==='finance'?'is-open':''}">Finanzen</button></div></nav></aside><main class="workspace"><div class="content">
<div class="page-intro page-intro-compact"><h1>\${h(title)}</h1><span class="page-compact-info">\${h(today)}</span></div>\${content}</div></main></div>\`;}
function taskEditor(){return 'Editor';}
function todaySmartPanel(){return 'Recommendations';}
function todayWork(locked=false){return \`<div class="today-layout"><div class="today-center">Tasks</div><aside class="inspector-rail today-context-rail" aria-label="\${todayInspectorOpen?'Aufgaben-Inspector':'Was passt jetzt?'}">\${todayInspectorOpen&&state?.tasks?.[selectedTaskId]&&!state.tasks[selectedTaskId].archived?\`<section class="work-card inspector-card today-focus-inspector"><div class="work-heading"><span>Aufgabe bearbeiten</span><button data-action="today-inspector-close">x</button></div>\${taskEditor()}</section>\`:todaySmartPanel()}</aside></div>\`;}
function radarScreen(){return null;}
async function unlockFixture(){
const form={get:()=>''};const p='test';const performanceTrace={start:()=>0,end:()=>{}};
try {if(hasVault){state=await vault.unlock(p);}else {if(p!==form.get('repeat'))throw new Error('Die Passphrasen stimmen nicht überein.');state=await vault.create(p);hasVault=true;}
      // Draft bytes are separate from the full Vault payload, but use the same key.
      state[EDIT_DRAFT_VAULT_KEY]={...(state[EDIT_DRAFT_VAULT_KEY]||{}),...(await vault.loadEditDrafts().catch(()=>({})))};
      prepareTasks(state);eventState(state);prunePastEvents(state,localDate());await persist();
}catch(error){throw error;}
}
function bind() {
const waitingForm=app.querySelector('#wf715-create');if(waitingForm)waitingForm.onsubmit=async ev=>{ev.preventDefault();await mutate(s=>{s.test='waiting';});};
const taskForm=app.querySelector('#task-create-form');if(taskForm)taskForm.onsubmit=()=>{};
const taskEditForm=app.querySelector('#task-edit-form');if(taskEditForm)taskEditForm.onsubmit=async ev=>{ev.preventDefault();await mutate(s=>{s.test='task';});};
const lifeGoalForm=app.querySelector('#life-goal-form');if(lifeGoalForm)lifeGoalForm.onsubmit=()=>{};
app.querySelectorAll('[data-action]').forEach(el=>{if(el.closest('#fw705-network-results'))return;el.onclick=ev=>{if(el.dataset.action==='date-adjust')return;runAction(el.dataset.action,el.dataset.id,el.dataset.step,el.dataset.day);}});
  app.querySelectorAll('.v48-date-form').forEach(form=>form.onsubmit=()=>{});
}
async function mutate(fn,committedEditForm=null,skipFinalRender=false,options=null){fn(state);if(options?.fastPlanning===true){options?.onApplied?.();
      render();
      await afterPlanningPaint();}
 if(!skipFinalRender)render();}
async function runAction(action,id){
if(action==='calm-nav-group'){calmNavGroup=calmNavGroup===id?'':id;render();return;}
if(action==='finance-pane'){return;}
if(action==='task-select'){if(!state?.tasks?.[id])return;selectedTaskId=id;if(tab==='today')todayInspectorOpen=true;render();if(tab==='today'&&window.matchMedia?.('(max-width:800px)')?.matches)requestAnimationFrame(()=>app.querySelector('.today-focus-inspector')?.scrollIntoView?.({behavior:'smooth',block:'start'}));return;}
if(action==='today-inspector-close'){todayInspectorOpen=false;selectedTaskId=null;render();return;}
if(action==='task-toggle'){if(!state?.tasks?.[id])return;if(state.projects?.[state.tasks[id].projectId]?.isTemplate){toast('Vorlage bleibt unverändert. Erstelle eine neue Liste daraus.');return;}await mutate(s=>{s.tasks[id].completed=!s.tasks[id].completed;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});return;}
}
function render(){
 const renderMeasurement=performanceTrace.start();
 app.innerHTML=chrome(todayWork());bind();}
`;

test('Vite chain keeps the prior lazy loader and introduces .55 last',()=>{
 const c=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(c,/import \{ compass755Bridge \} from '\.\/compass755-bridge\.js'/);
 assert.match(c,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\)\]/);
});

test('today inspector and task checkbox get narrowly targeted handlers and no redundant header',()=>{
 const out=compass755Bridge().transform(fixture,'/repo/client/src/main.js').code;
 assert.match(out,/COMPASS_CLIENT_VERSION='0\.5\.77\.55\.1'/);
 assert.match(out,/function compass55InspectorContent\(\)/);
 assert.match(out,/function compass55RefreshInspector\(\)/);
 assert.match(out,/if\(!compass55RefreshInspector\(\)\)render\(\)/);
 assert.match(out,/fastTodayVisual:true/);
 assert.match(out,/if\(state&&compass55Mode==='focus'/);
 assert.match(out,/if\(options\?\.fastTodayVisual!==true\)render\(\)/);
 assert.match(out,/function compass55BindTaskEditForm\(\)/);
 assert.match(out,/function compass55BindWaitingForm\(\)/);
 assert.match(out,/compass55BindDataActions\(rail\)/);
 assert.match(out,/<h1 class="sr-only">\$\{h\(title\)\}<\/h1>/);
 assert.doesNotMatch(out,/class="page-intro page-intro-compact"/);
 const path=join(tmpdir(),`compass755-${process.pid}.mjs`);writeFileSync(path,out);
 try{execFileSync(process.execPath,['--check',path]);}finally{unlinkSync(path);}
});

test('Focus hides only optional navigation, Extended remains accessible and persistent',()=>{
 const out=compass755Bridge().transform(fixture,'/repo/client/src/main.js').code;
 assert.match(out,/class="calm-nav-group compass55-extended-only"/);
 assert.equal((out.match(/class="calm-nav-group compass55-extended-only"/g)||[]).length,2);
 assert.match(out,/COMPASS55_MODE_KEY='compass\.ui\.focus\.v57755'/);
 assert.match(out,/localStorage\.setItem\(COMPASS55_MODE_KEY,id\)/);
 const css=readFileSync(new URL('../client/src/fast-today-v57755.css',import.meta.url),'utf8');
 assert.match(css,/\.compass55-focus \.compass55-extended-only \{display:none !important\}/);
 assert.doesNotMatch(css,/\.compass55-focus \.today-tasks[^\S\r\n]*\{display:none/);
});

test('missing or changed integration anchors stop the build',()=>{
 const bridge=compass755Bridge();
 assert.equal(bridge.transform(fixture,'/repo/client/src/other.js'),null);
 assert.throws(()=>bridge.transform(fixture.replace('function todayWork(locked=false){','function renamedToday('),'/repo/client/src/main.js'),/today function boundaries/);
 assert.throws(()=>bridge.transform(fixture.replace('function bind() {','function another(){'),'/repo/client/src/main.js'),/fast handlers declaration/);
 assert.throws(()=>bridge.transform(fixture.replace('const COMPASS_CLIENT_VERSION=\'0.5.77.54\';',''),'/repo/client/src/main.js'),/version/);
});

test('Insight and Finance header click start their own route and progress loader',()=>{
 const out=compass755Bridge().transform(fixture,'/repo/client/src/main.js').code;
 assert.match(out,/if\(id==='insights'\|\|id==='finance'\)\{tab=id;calmNavGroup=id;/);
 assert.match(out,/insightTab='intelligence'/);
 assert.match(out,/financePane='Überblick'/);
 assert.match(out,/Tresor: Entschlüsseln/);
 assert.match(out,/Tresor: Entwürfe laden/);
 assert.match(out,/Tresor: Startzustand speichern/);
 assert.match(out,/compass55Missing\|\|compass55Pruned>0/);
 assert.match(out,/Tresor: Startzustand unverändert/);
 assert.doesNotMatch(out,/class="shell compass55-/);
 assert.match(out,/class="shell premium751 compass55-/);
});
