/** Compass Life 0.5.77.55.2 - Lightning Fast Today + Focus / Extended mode.
 * All source changes are guarded and occur after .54 on-demand plugin.
 * GTD state, persistence, syncing and the encrypted Vault schema are preserved.
 */
export function compass755Bridge(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .55: ${label}: expected exactly one anchor, found ${n}`);return s.replace(a,b);};
 return {name:'compass-755-fast-today',enforce:'pre',transform(source,id){
  const file=id.replace(/\\/g,'/').split('?')[0];
  if(!file.endsWith('/client/src/main.js'))return null;
  let s=source;
  const ch=(a,b,label)=>{s=once(s,a,b,label);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.54';","const COMPASS_CLIENT_VERSION='0.5.77.55.2';",'version');
  ch("import './on-demand-v57754.css';", "import './on-demand-v57754.css';\nimport './fast-today-v57755.css';", 'UX stylesheet');
  ch("import './fast-today-v57755.css';", "import './fast-today-v57755.css';\nimport './occasion-compact-v577552.css';", 'occasion styling');
  ch("const app=document.getElementById('app');", "const app=document.getElementById('app');\nconst COMPASS55_MODE_KEY='compass.ui.focus.v57755';\nlet compass55Mode=(()=>{try{return localStorage.getItem(COMPASS55_MODE_KEY)==='extended'?'extended':'focus';}catch{return 'focus';}})();",'Focus / Extended persistence');
  // Keep the main GTD navigation intact. Only the two analysis groups are hidden in Focus.
  ch('<div class="shell premium751"><aside class="sidebar"', '<div class="shell premium751 compass55-${compass55Mode}"><aside class="sidebar"','shell mode after .51');
  // Page title and date are redundant with navigation and the selected day in Today.
  // Keep a screen-reader heading without occupying a row of visual space.
  ch('<div class="page-intro page-intro-compact"><h1>${h(title)}</h1><span class="page-compact-info">${h(today)}</span></div>', '<h1 class="sr-only">${h(title)}</h1>', 'remove redundant global page header');
  const brand='<div class="brand"><span class="brand-icon premium751-brandmark"><img src="${import.meta.env.BASE_URL}icon-192.png" width="38" height="38" alt="" decoding="async"/></span><span class="brand-name">Compass<small>Personal Life Manager · ${COMPASS_CLIENT_VERSION}</small></span></div>';
  ch(brand,brand+`\n <div class="compass55-mode-switch" role="group" aria-label="Compass Anzeigemodus"><button type="button" data-action="compass55-mode" data-id="focus" class="\${compass55Mode==='focus'?'is-active':''}" aria-pressed="\${compass55Mode==='focus'}">Focus</button><button type="button" data-action="compass55-mode" data-id="extended" class="\${compass55Mode==='extended'?'is-active':''}" aria-pressed="\${compass55Mode==='extended'}">Extended</button></div>`, 'Focus switch');
  // Scope CSS visibility through a class on the two group wrappers, not through hide/show of contents.
  const insightGroupAnchor='<div class="calm-nav-group">\n <button type="button" class="calm-group-toggle ${calmNavGroup===\'insights\'';
  const financeGroupAnchor='<div class="calm-nav-group">\n <button type="button" class="calm-group-toggle ${calmNavGroup===\'finance\'';
  ch(insightGroupAnchor,'<div class="calm-nav-group compass55-extended-only">\n <button type="button" class="calm-group-toggle ${calmNavGroup===\'insights\'','Insights nav visibility');
  ch(financeGroupAnchor,'<div class="calm-nav-group compass55-extended-only">\n <button type="button" class="calm-group-toggle ${calmNavGroup===\'finance\'','Finance nav visibility');
  const modeHandler=`if(action==='compass55-mode'){
     if(id==='focus'||id==='extended'){
      compass55Mode=id;
      try{localStorage.setItem(COMPASS55_MODE_KEY,id);}catch{}
      if(id==='focus'&&(tab==='insights'||tab==='finance'||['activity','recovery','progress'].includes(tab))){tab='today';todayInspectorOpen=false;calmNavGroup='';}
      if(id==='extended'&&calmNavGroup==='')calmNavGroup='insights';
      render();
     }
     return;
    }
    `;
  ch("if(action==='finance-pane'){",modeHandler+"if(action==='finance-pane'){",'mode handler');
  ch("if(action==='calm-nav-group'){calmNavGroup=calmNavGroup===id?'':id;render();return;}",
     "if(action==='calm-nav-group'){if(id==='insights'||id==='finance'){tab=id;calmNavGroup=id;if(id==='insights')insightTab='intelligence';else{financePane='Überblick';financeReviewPage=0;financeLedgerPage=0;}render();return;}calmNavGroup=calmNavGroup===id?'':id;render();return;}",
     'load Insights/Finance on header click');
  // Instrument the REAL unlock stages separately: the supplied .54 trace contains no unlock entries.
  // Markers contain no titles, values or personal data and reuse existing opt-in performanceTrace.
  ch("try {if(hasVault){state=await vault.unlock(p);}else {", "try {const compass55UnlockStep=performanceTrace.start();if(hasVault){state=await vault.unlock(p);}else {",'unlock timing begin');
  ch("state=await vault.create(p);hasVault=true;}\n      // Draft bytes", "state=await vault.create(p);hasVault=true;}performanceTrace.end('Tresor: Entschlüsseln',tab,compass55UnlockStep);\n      // Draft bytes",'unlock timing end');
  ch("state[EDIT_DRAFT_VAULT_KEY]={...(state[EDIT_DRAFT_VAULT_KEY]||{}),...(await vault.loadEditDrafts().catch(()=>({})))};", "const compass55DraftStep=performanceTrace.start();state[EDIT_DRAFT_VAULT_KEY]={...(state[EDIT_DRAFT_VAULT_KEY]||{}),...(await vault.loadEditDrafts().catch(()=>({})))};performanceTrace.end('Tresor: Entwürfe laden',tab,compass55DraftStep);",'draft timing');
  ch("prepareTasks(state);eventState(state);prunePastEvents(state,localDate());await persist();",
     "const compass55Keys=['tasks','taskPending','taskVersions','taskConflicts','projects','projectPending','projectVersions','projectConflicts','discoveredEvents','eventPreferences','eventVersions','eventPending','eventDeleted','eventConflicts'];const compass55Missing=compass55Keys.some(key=>state[key]==null);prepareTasks(state);eventState(state);const compass55Pruned=prunePastEvents(state,localDate());const compass55SaveStep=performanceTrace.start();if(compass55Missing||compass55Pruned>0){await persist();performanceTrace.end('Tresor: Startzustand speichern',tab,compass55SaveStep);}else{performanceTrace.end('Tresor: Startzustand unverändert',tab,compass55SaveStep);}",
     'skip redundant full encryption on unchanged unlock');
  

  // Compact occasion step: one-line label + due date and accessible check/cross actions.
  // Keep existing occasion-accept / occasion-dismiss business logic unchanged.
  const occasionStart=s.indexOf('function occasionPanel(){');
  const occasionEnd=occasionStart>=0?s.indexOf('\nfunction timelinePanel(){',occasionStart):-1;
  if(occasionStart<0||occasionEnd<0)throw Error('Compass .55.2: occasion panel unavailable');
  let occ=s.slice(occasionStart,occasionEnd);
  const occOnce=(before,after,reason)=>{const n=occ.split(before).length-1;if(n!==1)throw Error('Compass .55.2: '+reason+': expected one match, found '+n);occ=occ.replace(before,after);};
  occOnce('<span>${h(st.label)}<small>', '<span class="occasion55-copy">${h(st.label)}<small class="occasion55-date">','occasion label and inline date');
  occOnce('</small></span><div>${status.kind', '</small></span><div class="occasion55-actions">${status.kind', 'occasion actions');
  occOnce('data-step="${h(st.id)}">Übernehmen</button>', 'data-step="${h(st.id)}" aria-label="Als Aufgabe übernehmen" title="Übernehmen">✓</button>', 'accept icon');
  occOnce('data-step="${h(st.id)}">Nicht nötig</button>', 'data-step="${h(st.id)}" aria-label="Vorschlag ausblenden" title="Nicht nötig">×</button>', 'dismiss icon');
  s=s.slice(0,occasionStart)+occ+s.slice(occasionEnd);
  // Extract inspector markup once. Full Today render and targeted rail refresh use exactly
  // the same renderer, avoiding diverging forms or stale field values.
  const todayStart=s.indexOf('function todayWork(locked=false){');
  const todayEnd=s.indexOf('\nfunction radarScreen(){',todayStart);
  if(todayStart<0||todayEnd<0)throw Error('Compass .55: today function boundaries missing');
  const today=s.slice(todayStart,todayEnd);
  const rail='<aside class="inspector-rail today-context-rail"';
  const i=today.indexOf(rail),j=i<0?-1:today.indexOf('">',i),k=j<0?-1:today.indexOf('</aside></div>`;',j);
  if(i<0||j<0||k<0||today.indexOf(rail,i+rail.length)>=0)throw Error('Compass .55: inspector rail boundaries missing');
  const inspectorContent=today.slice(j+2,k);
  if(!inspectorContent.includes('todayInspectorOpen&&state?.tasks?.[selectedTaskId]')||!inspectorContent.includes('taskEditor()')||!inspectorContent.includes('todaySmartPanel()'))throw Error('Compass .55: inspector content changed');
  const begin='function todayWork(locked=false){';
  const railHelper='function compass55InspectorContent(){return `'+inspectorContent+'`;}\n';
  s=s.slice(0,todayStart)+railHelper+s.slice(todayStart);
  // The contents may occur once in the Today template; replace only in its original scope.
  const today2Start=s.indexOf('function todayWork(locked=false){'),today2End=s.indexOf('\nfunction radarScreen(){',today2Start);
  const inside=s.slice(today2Start,today2End);
  if(inside.split(inspectorContent).length!==2)throw Error('Compass .55: Today rail markup no longer unique');
  s=s.slice(0,today2Start)+inside.replace(inspectorContent,'${compass55InspectorContent()}')+s.slice(today2End);

  // Extract exactly two existing form binders into reusable functions. They are still
  // bound on regular render, and ONLY re-bound inside the newly rendered inspector.
  const extract=(start,end,fn,label)=>{
   const a=s.indexOf(start),b=a<0?-1:s.indexOf(end,a);
   if(a<0||b<0||s.indexOf(start,a+start.length)>=0)throw Error('Compass .55: '+label+' form anchors missing');
   const code=s.slice(a,b);
   s=s.slice(0,a)+fn+'();\n  '+s.slice(b);
   return 'function '+fn+'(){\n '+code+'}\n';
  };
  const wf=extract("const waitingForm=app.querySelector('#wf715-create');", "const taskForm=app.querySelector('#task-create-form');",'compass55BindWaitingForm','Waiting For');
  const ed=extract("const taskEditForm=app.querySelector('#task-edit-form');", "const lifeGoalForm=app.querySelector('#life-goal-form');",'compass55BindTaskEditForm','Inspector edit');
  // Extract original click binding factory. This avoids duplicating event logic
  // (date +/- controls, click target validation, etc.), and permits local re-binding.
  const actionsStart="app.querySelectorAll('[data-action]').forEach(el=>{if(el.closest('#fw705-network-results'))return;el.onclick=ev=>{";
  const actionsEnd="\n  app.querySelectorAll('.v48-date-form')";
  const a=s.indexOf(actionsStart),b=a<0?-1:s.indexOf(actionsEnd,a);
  if(a<0||b<0||s.indexOf(actionsStart,a+5)>=0)throw Error('Compass .55: click binder boundaries missing');
  const actionBinder=s.slice(a,b).replace("app.querySelectorAll('[data-action]')","root.querySelectorAll('[data-action]')");
  s=s.slice(0,a)+'compass55BindDataActions(app);'+s.slice(b);

  // Local, synchronous Inspector UI update: no chrome(), no Today/calendar rebuild,
  // no destruction of the editor while opening another task.
  const helpers=wf+'\n'+ed+'\nfunction compass55BindDataActions(root){\n '+actionBinder+'}\n'+`
function compass55RefreshInspector(){
 if(!state||tab!=='today')return false;
 const rail=app.querySelector('.today-context-rail');if(!rail)return false;
 const measured=performanceTrace.start();
 rail.innerHTML=compass55InspectorContent();
 rail.setAttribute('aria-label',todayInspectorOpen?'Aufgaben-Inspector':'Was passt jetzt?');
 app.querySelectorAll('.today-tasks .task-row').forEach(row=>{
  const button=row.querySelector('[data-action="task-select"]');
  row.classList.toggle('is-selected',button?.dataset?.id===selectedTaskId);
 });
 compass55BindDataActions(rail);
 compass55BindWaitingForm();compass55BindTaskEditForm();
 if(state)wireSmartTags(rail,()=>state);
 performanceTrace.end('GTD: Inspector aktualisieren',tab,measured);
 return true;
}
function compass55FastTaskPaint(id){
 const measured=performanceTrace.start();
 const row=[...app.querySelectorAll('.today-tasks .task-row')].find(r=>r.querySelector('[data-action="task-toggle"]')?.dataset?.id===id);
 if(!row)return false;
 const task=state?.tasks?.[id];if(!task)return false;
 row.classList.toggle('completed',!!task.completed);
 const check=row.querySelector('[data-action="task-toggle"]');
 if(check){check.textContent=task.completed?'✓':'';check.setAttribute('aria-label',task.completed?'Wieder öffnen':'Erledigen');}
 const counter=app.querySelector('.today-tasks .work-heading .quiet-tag');
 if(counter){const rows=tasksForDay(state,selectedDay).filter(t=>!waitingSourceId(t));counter.textContent=rows.filter(t=>t.completed).length+' / '+rows.length+' erledigt';}
 performanceTrace.end('GTD: Checkbox aktualisieren',tab,measured);
 return true;
}
`;
  ch('function bind() {',helpers+'\nfunction bind() {','fast handlers declaration');
  ch('function render(){',
     "function render(){\n if(state&&compass55Mode==='focus'&&['insights','finance','activity','recovery','progress'].includes(tab)){tab='today';todayInspectorOpen=false;calmNavGroup='';}", 'Focus only GTD, including saved direct views');
  const select="if(action==='task-select'){if(!state?.tasks?.[id])return;selectedTaskId=id;if(tab==='today')todayInspectorOpen=true;render();";
  ch(select,"if(action==='task-select'){if(!state?.tasks?.[id])return;selectedTaskId=id;if(tab==='today')todayInspectorOpen=true;if(!compass55RefreshInspector())render();",'fast Inspector selection');
  ch("if(action==='today-inspector-close'){todayInspectorOpen=false;selectedTaskId=null;render();return;}","if(action==='today-inspector-close'){todayInspectorOpen=false;selectedTaskId=null;if(!compass55RefreshInspector())render();return;}",'fast Inspector close');
  // Narrow, opt-in task replacement: preserve the rollback semantics of planningCheckpoint.
  // This avoids structuredClone of years of finance and health data just for one checkbox.
  const toggle="if(action==='task-toggle'){if(!state?.tasks?.[id])return;if(state.projects?.[state.tasks[id].projectId]?.isTemplate){toast('Vorlage bleibt unverändert. Erstelle eine neue Liste daraus.');return;}await mutate(s=>{s.tasks[id].completed=!s.tasks[id].completed;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});return;}";
  const optimized="if(action==='task-toggle'){if(!state?.tasks?.[id])return;if(state.projects?.[state.tasks[id].projectId]?.isTemplate){toast('Vorlage bleibt unverändert. Erstelle eine neue Liste daraus.');return;}const fast=tab==='today'&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&[...app.querySelectorAll('.today-tasks .task-row [data-action=\"task-toggle\"]')].some(el=>el.dataset.id===id);await mutate(s=>{s.tasks[id]={...s.tasks[id],completed:!s.tasks[id].completed,updatedAt:stamp()};s.taskPending[id]=true;},null,fast,fast?{fastPlanning:true,fastTodayVisual:true,onApplied:()=>{compass55FastTaskPaint(id);if(todayInspectorOpen&&selectedTaskId===id)compass55RefreshInspector();}}:null);return;}";
  ch(toggle,optimized,'instant Today checkbox, durable save');
  ch('options?.onApplied?.();\n      render();\n      await afterPlanningPaint();','options?.onApplied?.();\n      if(options?.fastTodayVisual!==true)render();\n      await afterPlanningPaint();','skip redundant full render only on fast Today checkbox');
  return {code:s,map:null};
 }};
}
