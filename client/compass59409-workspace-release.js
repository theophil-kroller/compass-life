/** Compass .40.9 — visible archives in the ACTIVE 3-pane navigator, Today ordering and smaller GPS */
export function compass59409WorkspaceRelease(){
 const once=(s,a,b,label)=>{let n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.9 ${label}: ${n} anchors (expected 1)`);return s.replace(a,b);};
 return {name:'compass-59409-workspace',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];let s=source;
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(s,'Build 0.5.77.59.40.8','Build 0.5.77.59.40.9','lock badge'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  s=once(s,'Build 0.5.77.59.40.8','Build 0.5.77.59.40.9','header badge');
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.8';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.9';",'version');
  s=once(s,"import {duplicateProject48,visibleInProjectTree48", "import {todayOrdered49,todayMove49,taskLifecycleView49,taskLife49,TASK_TRASH_TAG49,TASK_PURGED_TAG49} from './compass-workspace-v57759409.js';\nimport './compass-workspace-v57759409.css';\nimport {duplicateProject48,visibleInProjectTree48",'workspace imports');
  // The .40.8 footer was inserted into an obsolete tree. The three-pane
  // project browser introduced by .58 is the actual rendered desktop UI.
  s=once(s,"items.filter(p=>p&&!p.isTemplate&&!(isShoppingList(state,p)&&p.status==='completed'))", "items.filter(p=>p&&!p.isTemplate&&visibleInProjectTree48(state,p)&&!(isShoppingList(state,p)&&p.status==='completed'))",'hide archived from 3pane');
  // Visible action buttons directly on project-task rows; Inspector is optional.
  s=once(s,'   <button type="button" class="tree-inline-add" data-action="tree-add-subtask"',
    '   ${!isTemplateTask(state,t)?`<span class="p49-task-row-actions"><button type="button" data-action="task-archive" data-id="${h(t.id)}" title="Aufgabe archivieren" aria-label="${h(t.title)} archivieren">${ico(\'archive\',13)}</button><button type="button" data-action="task49-trash" data-id="${h(t.id)}" title="Aufgabe in Papierkorb" aria-label="${h(t.title)} in Papierkorb">${ico(\'trash\',13)}</button></span>`:\'\'}\n   <button type="button" class="tree-inline-add" data-action="tree-add-subtask"',
    'inline actions for actual project tasks');
  s=once(s, " const name=selection?.title||'Projekte';", " const name=projectVaultView48?(projectVaultView48==='archived'?'Archiv':'Papierkorb'):(selection?.title||'Projekte');",'threepane title');
  s=once(s, " const content=selection?.kind==='project'?", " const content=projectVaultView48?(projectVaultPanel48(state,projectVaultView48,ico)+taskLifecycleView49(state,projectVaultView48,ico,h)):selection?.kind==='project'?",'threepane content');
  s=once(s, " const inspector=compass58InspectorHidden?'':", " const inspector=projectVaultView48?'':compass58InspectorHidden?'':",'disable inspector in vault');
  s=once(s, "':settings);", "':(selection?'<div class=\"p48-inspector-actions\"><button type=\"button\" data-action=\"p48-archive\" data-id=\"'+h(selection.id)+'\">'+ico('archive',15)+' Archivieren</button><button type=\"button\" class=\"p48-trash\" data-action=\"p48-trash\" data-id=\"'+h(selection.id)+'\">'+ico('trash',15)+' Papierkorb</button></div>':'')+settings);",'threepane inspector controls');
  s=once(s, "<div class=\"compass58-sidebar-list\">'+tree+'</div></aside>'", "<div class=\"compass58-sidebar-list\">'+tree+'</div>'+compass49VaultNavigation()+'</aside>'",'always visible sidebar footer');
  s=once(s,"<div class=\"compass58-mobile-tree\">'+tree+'</div></details>'", "<div class=\"compass58-mobile-tree\">'+tree+compass49VaultNavigation()+'</div></details>'",'mobile footer');
  s=once(s, 'function compass58ProjectLayout({treeIndex,selection,selectedTask,settings,active}){',`function compass49VaultNavigation(){
 return '<nav class="p49-vault-nav" aria-label="Archiv und Papierkorb"><button type="button" data-action="p48-view-archive" aria-pressed="'+(projectVaultView48==='archived')+'">'+ico('archive',15)+' Archiv</button><button type="button" data-action="p48-view-trash" aria-pressed="'+(projectVaultView48==='trash')+'">'+ico('trash',15)+' Papierkorb</button>'+(projectVaultView48?'<button type="button" data-action="p48-close">'+ico('arrow',14)+' Projekte</button>':'')+'</nav>';
}
function compass58ProjectLayout({treeIndex,selection,selectedTask,settings,active}){`,'footer helper');
  // The actual Heute screen lives in compass56TodayWorkspace (added after .56),
  // rather than the older todayWork() patched in legacy screens.
  s=once(s,'const tasks=tasksForDay(state,day).filter(t=>!waitingSourceId(t));','const tasks=todayOrdered49(tasksForDay(state,day).filter(t=>!waitingSourceId(t)));','Today sort');
  s=once(s, "${nextScope?`<span class=\"next38-drag\"", "${scope==='day'?`<span class=\"p49-today-move\"><button type=\"button\" data-action=\"p49-today-up\" data-id=\"${h(t.id)}\" title=\"Nach oben\" aria-label=\"${h(t.title)} nach oben\" ${i===0||t.completed?'disabled':''}>↑</button><button type=\"button\" data-action=\"p49-today-down\" data-id=\"${h(t.id)}\" title=\"Nach unten\" aria-label=\"${h(t.title)} nach unten\" ${i===items.length-1||t.completed?'disabled':''}>↓</button></span>`:''}${nextScope?`<span class=\"next38-drag\"", 'Today arrow buttons');
  s=once(s, '<button class="secondary-btn" type="button" data-action="task-archive" data-id="${h(t.id)}">${template?\'Aus Vorlage entfernen\':\'Archivieren\'}</button>',
   '<button class="secondary-btn" type="button" data-action="task-archive" data-id="${h(t.id)}">${template?\'Aus Vorlage entfernen\':\'Archivieren\'}</button>${!template?`<button type="button" class="secondary-btn p49-trash-button" data-action="task49-trash" data-id="${h(t.id)}">${ico(\'trash\',14)} Papierkorb</button>`:\'\'}','task inspector archive/trash');
  s=once(s,"if(action==='p48-view-archive'||action==='p48-view-trash'){", `if(action==='p49-today-up'||action==='p49-today-down'){
      const delta=action==='p49-today-up'?-1:1,day=selectedDay;
      const updates=todayMove49(state,day,id,delta);
      if(!updates.length)return;
      await mutate(s=>{for(const u of updates){if(!s.tasks[u.id])continue;s.tasks[u.id].sortOrder=u.sortOrder;s.tasks[u.id].updatedAt=stamp();s.taskPending[u.id]=true;}});return;
    }
    if(action==='task49-trash'||action==='task49-restore'||action==='task49-redact'){
      const t=state?.tasks?.[id];if(!t)return;
      if(action==='task49-trash'&&!confirm('Aufgabe „'+t.title+'“ in den Papierkorb verschieben?'))return;
      if(action==='task49-redact'){
        if(taskLife49(t)!=='trash')return;
        if(Object.values(state.tasks||{}).some(x=>x?.parentTaskId===id&&!x.archived))return toast('Zuerst die Unteraufgaben verschieben oder archivieren.',true);
        if(!confirm('Inhalt dieser Aufgabe endgültig entfernen? Titel und Notiz werden überschrieben; eine technische Synchronisationssperre bleibt bestehen.'))return;
      }
      await mutate(s=>{const x=s.tasks[id];if(!x)return;
        const tags=(x.tags||[]).filter(v=>v!==TASK_TRASH_TAG49&&v!==TASK_PURGED_TAG49);
        if(action==='task49-trash')tags.push(TASK_TRASH_TAG49);
        if(action==='task49-redact')tags.push(TASK_PURGED_TAG49);
        x.tags=tags;x.archived=action!=='task49-restore';
        if(action==='task49-redact'){x.title='Entfernte Aufgabe';x.note='';x.plannedDate=null;x.dueDate=null;x.deferUntil=null;x.category='Allgemein';x.projectId=null;x.parentTaskId=null;x.contextTags=[];x.flagged=false;x.completed=true;x.estimateMinutes=null;x.progressCurrent=0;x.progressTarget=null;x.sortOrder=0;x.tags=[TASK_PURGED_TAG49];}
        x.updatedAt=stamp();s.taskPending[id]=true;
      });if(selectedTaskId===id){selectedTaskId=null;todayInspectorOpen=false;}return;
    }
    if(action==='p48-view-archive'||action==='p48-view-trash'){`, 'new task/order actions');
  return {code:s,map:null};
 }};
}
