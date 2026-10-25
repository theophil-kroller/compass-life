/** Compass 0.5.77.58 — OmniFocus-inspired three-pane Projects and direct Inbox→Dreams.
 * Runs after the verified .57.1 bridge. Existing project/task/record data unchanged.
 */
export function compass758Bridge(){
 const replaceExactly=(s,from,to,label)=>{
  const n=s.split(from).length-1;
  if(n!==1)throw new Error(`Compass .58 ${label}: expected 1 source anchor, found ${n}`);
  return s.replace(from,to);
 };
 return {name:'compass-758-project-workspace',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;
  const ch=(from,to,label)=>{s=replaceExactly(s,from,to,label);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.57.1';","const COMPASS_CLIENT_VERSION='0.5.77.58.2';",'version');
  ch("import './mobile-workflow-v57757.css';","import './mobile-workflow-v57757.css';\nimport './project-workspace-v57758.css';",'styles');

  // Locate the receipt call INSIDE the shopping page in the post-.45 source.
  // .45 enriched receiptInboxView with month:receiptMonth745. A string anchored
  // to its original .43 arguments broke CI #225. Respect the exact source call
  // and move it as-is, rather than baking a brittle version of its arguments.
  const shoppingFrom=s.indexOf('function shoppingScreen(){');
  const shoppingTo=s.indexOf('\nfunction ',shoppingFrom+24);
  if(shoppingFrom<0||shoppingTo<shoppingFrom)throw new Error('Compass .58: shopping function boundaries unavailable');
  const shoppingBlock=s.slice(shoppingFrom,shoppingTo);
  const matches=[...shoppingBlock.matchAll(/\$\{(receiptInboxView\(state,\{[^}]*\}\))\}/g)];
  if(matches.length!==1)throw new Error(`Compass .58: expected one receipt UI call in shopping checklist, found ${matches.length}`);
  const receiptExpression=matches[0][1];
  s=s.slice(0,shoppingFrom)+shoppingBlock.replace(matches[0][0],'')+s.slice(shoppingTo);
  ch("return '<section class=\"work-card compass57-shopping-stats\">",
     "return "+receiptExpression+"+'<section class=\"work-card compass57-shopping-stats\">",
     'receipt UI only in statistics and import tab');

  // Only Projects changes; Templates stays on the existing, fully functional view.
  ch('function projectScreen(){',project58Source+'\nfunction projectScreen(){','three-pane helpers');
  const legacy=' return chrome(`<div class="tree-workspace ${selectedTask||selection?\'has-inspector\':\'\'}">';
  ch(legacy,
     ' if(!templates)return compass58ProjectLayout({treeIndex,selection,selectedTask,settings,active});\n'+legacy,
     'Projects-only dispatch');

  // Do not construct the full project settings form for every project selection.
  ch('const settings=selection?`<details class="project-properties"',
     'const settings=(selection&&(templates||!compass58InspectorHidden))?`<details class="project-properties"',
     'lazy project inspector settings');

  // Keep the original title click and drag-and-drop handlers, just reveal parent folders.
  ch('projectCollapsed.delete(id);selectedProjectId=id;selectedTaskId=null;',
     'projectCollapsed.delete(id);selectedProjectId=id;selectedTaskId=null;compass58InspectorHidden=true;if(p.kind===\'folder\')compass58Expanded.add(id);',
     'project selection');
  ch("if(action==='tree-inspector-close'){selectedTaskId=null;selectedProjectId=null;render();return;}",
     "if(action==='tree-inspector-close'){if(tab==='projects'){compass58InspectorHidden=true;render();return;}selectedTaskId=null;selectedProjectId=null;render();return;}",
     'inspector can close without losing project selection');
  ch("if(action==='tree-task-select'){const t=state.tasks?.[id];if(!t)return;selectedTaskId=id;selectedProjectId=t.projectId;render();return;}",
     "if(action==='tree-task-select'){const t=state.tasks?.[id];if(!t)return;selectedTaskId=id;selectedProjectId=t.projectId;compass58InspectorHidden=false;render();return;}",
     'task inspector selection');
  ch("if(action==='tree-create-close'){",
     "if(action==='compass58-folder-expand'){if(compass58Collapsed.has(id)){compass58Collapsed.delete(id);compass58Expanded.add(id);}else{compass58Collapsed.add(id);compass58Expanded.delete(id);}render();return;}\n"+
     "    if(action==='compass58-inspector-toggle'){compass58InspectorHidden=!compass58InspectorHidden;render();return;}\n"+
     "    if(action==='compass58-tools'){compass58ToolsOpen=!compass58ToolsOpen;render();return;}\n"+
     "    if(action==='tree-create-close'){",'three-pane controls');

  // In the Inbox, Someday / Maybe is a classification decision, not a task workflow.
  ch('<div class="inbox-detail-actions"><button type="submit" name="intent" value="promote"',
     '<div class="compass58-dream-route"><label for="compass58-dream-category">Someday / Maybe · Kategorie<select id="compass58-dream-category" name="dreamCategory">${DREAM_CATEGORIES.map(([key,title])=>`<option value="${key}">${h(title)}</option>`).join(\'\')}</select></label><button type="submit" class="secondary-btn" name="intent" value="dream">${ico(\'spark\',16)} Zu Dreams</button></div>\n <div class="inbox-detail-actions"><button type="submit" name="intent" value="promote"',
     'Inbox classification control');
  ch("    if(intent==='promote'){",
     "    if(intent==='dream'){\n"+
     "      const category=String(form.get('dreamCategory')||'ideen');\n"+
     "      if(!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Ungültige Dreams-Kategorie.',true);return;}\n"+
     "      try{await mutate(s=>{const record=s.records[id];if(!record||record.deleted)throw Error('Eintrag bereits geklärt.');\n"+
     "        record.title=title;record.note=note;record.tags=parseTags(['dreams','dream-'+category,...tags.filter(tag=>tag!=='dreams'&&!tag.startsWith('dream-'))]);\n"+
     "        record.updatedAt=stamp();s.pending.push(makeMutation(record));s.history.push({type:'dream-classified',at:record.updatedAt,id});\n"+
     "      },editForm);selectedInboxId=null;selectedDreamId=id;toast('Eintrag zu Dreams / Someday–Maybe verschoben.');}\n"+
     "      catch(ex){toast(ex.message,true);}\n"+
     "      return;\n"+
     "    }\n    if(intent==='promote'){",'Inbox-to-Dreams atomic conversion');
  // Dream logger is a capture tool, not heavy Insights. It must remain reachable
  // from the global moon button even while the GTD Focus layout is active.
  ch("if(state&&compass55Mode==='focus'&&['insights','finance','activity','recovery','progress'].includes(tab))",
     "if(state&&compass55Mode==='focus'&&((tab==='insights'&&insightTab!=='dreamworld')||['finance','activity','recovery','progress'].includes(tab)))",
     'moon quick capture bypasses Focus-only route redirect');
  // All Insights graphs require their lazy analytics chunks; the encrypted dream
  // input uses an already statically imported module and must open without them.
  ch("function insightsScreen(){if(!compass54Ready('insights'))return compass54LoadingScreen('insights');",
     "function insightsScreen(){if(insightTab!=='dreamworld'&&!compass54Ready('insights'))return compass54LoadingScreen('insights');",
     'dream form does not wait for analytics chunks');
  ch('function render(){',
     `let compass59DreamFocusPending=false;
function compass59FocusDreamField(){
 const field=app.querySelector('#dream743-form textarea[name="body"]');
 if(!field)return false;
 compass59DreamFocusPending=false;
 try{field.focus({preventScroll:true});}catch{field.focus();}
 field.scrollIntoView?.({block:'center'});
 return true;
}
function render(){`,
     'dream focus once the form exists');
  ch("if(action==='dream743-open'){\n  tab='insights';insightTab='dreamworld';calmNavGroup='insights';dreamEditingId743='';render();return;\n }",
     "if(action==='dream743-open'){\n  compass59DreamFocusPending=true;\n  tab='insights';insightTab='dreamworld';calmNavGroup='insights';dreamEditingId743='';render();compass59FocusDreamField();return;\n }",
     'moon button opens and focuses dream entry');
  ch("const dream743Form=app.querySelector('#dream743-form');",
     "const dream743Form=app.querySelector('#dream743-form');\n if(compass59DreamFocusPending&&dream743Form)compass59FocusDreamField();",
     'focus after dream form binds / lazy load');
  return {code:s,map:null};
 }};
}

const project58Source=String.raw`
// A project outline is never the left navigation: folders/projects are separate from tasks.
const compass58Expanded=new Set();
const compass58Collapsed=new Set();
let compass58InspectorHidden=true;
let compass58ToolsOpen=false;
function compass58VisibleChildren(index,parent=null){
 const items=parent===null?[...index.projectChildren(null),...index.orphans]:index.projectChildren(parent);
 return [...new Map(items.filter(p=>p&&!p.isTemplate&&!(isShoppingList(state,p)&&p.status==='completed')).map(p=>[p.id,p])).values()];
}
function compass58OnSelectedPath(projectId){
 let id=selectedProjectId;const visited=new Set();
 for(let depth=0;id&&depth<20&&!visited.has(id);depth++){
  if(id===projectId)return true;
  visited.add(id);id=state.projects?.[id]?.parentId||'';
 }
 return false;
}
function compass58Navigator(index,parent=null,depth=0,visited=new Set()){
 if(depth>15)return '';
 return compass58VisibleChildren(index,parent).filter(p=>!visited.has(p.id)).map(p=>{
  visited.add(p.id);
  const children=compass58VisibleChildren(index,p.id),hasChildren=children.length>0;
  const open=!compass58Collapsed.has(p.id)&&(compass58Expanded.has(p.id)||compass58OnSelectedPath(p.id));
  const selected=selectedProjectId===p.id;
  const label=p.kind==='folder'?'Ordner':'Projekt';
  return '<div class="compass58-nav-entry tree-entry tree-project" data-drag-type="project" data-drag-id="'+h(p.id)+'">'+
    '<div class="compass58-nav-row tree-drop-target '+(selected?'selected':'')+'" data-drop-type="project" data-drop-id="'+h(p.id)+'" style="--level:'+Math.min(depth,9)+'">'+
      (hasChildren?'<button type="button" class="compass58-caret" data-action="compass58-folder-expand" data-id="'+h(p.id)+'" aria-label="'+h(p.title)+(open?' zuklappen':' aufklappen')+'" aria-expanded="'+open+'">'+(open?'▾':'▸')+'</button>':'<span class="compass58-caret-spacer"></span>')+
      '<span class="compass58-grip tree-drag-handle" draggable="true" data-drag-type="project" data-drag-id="'+h(p.id)+'" title="Projekt verschieben" aria-label="Projekt verschieben">⋮⋮</span>'+
      '<button type="button" class="compass58-nav-item" data-action="project-select" data-id="'+h(p.id)+'" aria-label="'+h(label)+': '+h(p.title)+'" '+(selected?'aria-current="true"':'')+'>'+ico(p.kind==='folder'?folderIcon(p):'list',17)+'<span>'+h(p.title)+'</span>'+(p.status==='hold'?'<small>Pause</small>':'')+'</button>'+
    '</div>'+(hasChildren&&open?'<div class="compass58-nav-children">'+compass58Navigator(index,p.id,depth+1,visited)+'</div>':'')+'</div>';
 }).join('');
}
function compass58CreatePanel(){
 if(!treeCreateKind)return '';
 const parent=treeCreateParent||'';
 return '<section class="work-card compass58-create">'+
   '<div class="compass58-create-head"><strong>'+(treeCreateKind==='task'?'Neue Aufgabe':treeCreateKind==='folder'?'Neuer Ordner':'Neues Projekt')+'</strong><button type="button" data-action="tree-create-close" aria-label="Schließen">×</button></div>'+
   (treeCreateKind==='task'?taskCreateForm('',parent,treeTaskParent||''):
    '<form class="project-form" id="project-create-form"><label>Name<input required autofocus name="title" maxlength="140"/></label>'+ 
    '<input type="hidden" name="kind" value="'+h(treeCreateKind)+'"/><label>Unterhalb von<select name="parentId">'+projectParentOptions(parent)+'</select></label>'+ 
    '<details><summary>Weitere Einstellungen</summary><label>Typ<select name="projectType"><option value="parallel">Parallel</option><option value="sequential">Sequential</option><option value="single">Single Actions</option></select></label><label>Ergebnis<input name="outcome" maxlength="800"/></label></details>'+ 
    '<button class="primary-btn" type="submit">Anlegen</button></form>')+'</section>';
}
function compass58ProjectLayout({treeIndex,selection,selectedTask,settings,active}){
 const tree=compass58Navigator(treeIndex)||'<p class="compass58-muted">Noch keine Ordner oder Projekte</p>';
 const ownTask=selectedTask&&selection?.kind==='project'&&selectedTask.projectId===selection.id?selectedTask:null;
 const children=selection?compass58VisibleChildren(treeIndex,selection.id):compass58VisibleChildren(treeIndex);
 const tasks=selection?.kind==='project'?treeTaskRows(selection.id,null,0,new Set(),treeIndex):'';
 const rootCount=selection?.kind==='project'?treeIndex.counts.get(selection.id)||0:children.length;
 const name=selection?.title||'Projekte';
 const content=selection?.kind==='project'? 
   '<div class="compass58-outline tree-work-card unified-tree" role="tree" aria-label="Aufgaben von '+h(name)+'">'+(tasks||'<p class="compass58-empty">Noch keine Aufgaben</p>')+'</div>':
   '<div class="compass58-collection">'+(children.map(p=>'<button type="button" class="compass58-project-tile" data-action="project-select" data-id="'+h(p.id)+'">'+ico(p.kind==='folder'?folderIcon(p):'list',18)+'<span>'+h(p.title)+'</span>'+ico('arrow',15)+'</button>').join('')||'<p class="compass58-empty">Noch keine Projekte in diesem Ordner</p>')+'</div>';
 const inspector=compass58InspectorHidden?'':(ownTask?'<div class="compass58-inspector-fields">'+taskEditor()+'<form id="tree-move-task-form" class="tree-move-form" data-id="'+h(ownTask.id)+'"><label>Verschieben nach<select name="target" required>'+treeTaskDestinationOptions(ownTask)+'</select></label><button type="submit" class="secondary-btn">Verschieben</button></form></div>':settings);
 const selectedDetails=!!(selection||ownTask)&&!compass58InspectorHidden;
 const inspectorMarkup=selectedDetails?'<aside class="compass58-inspector work-card tree-inspector" aria-label="'+(ownTask?'Aufgaben-Inspector':'Projekt-Inspector')+'">'+
  '<div class="tree-inspector-header"><strong>'+h(ownTask?'Aufgabendetails':selection?.title||'Details')+'</strong><button type="button" class="tree-close" data-action="tree-inspector-close" aria-label="Inspector schließen" title="Inspector schließen">×</button></div>'+inspector+'</aside>':'';
 return chrome('<div class="compass58-workspace '+(selectedDetails?'has-inspector':'')+'">'+
  '<aside class="compass58-sidebar" aria-label="Ordner und Projekte"><div class="compass58-sidebar-heading"><strong>Ordner & Projekte</strong><button type="button" data-action="tree-add-folder" aria-label="Ordner hinzufügen" title="Ordner hinzufügen">'+ico('plus',16)+'</button></div><div class="compass58-sidebar-list">'+tree+'</div></aside>'+ 
  '<section class="compass58-center"><div class="compass58-heading"><div><h2>'+h(name)+'</h2><span>'+rootCount+' '+(selection?.kind==='project'?'Einträge':'Projekte / Ordner')+'</span></div><div class="compass58-heading-actions">'+
   (selection?.kind==='project'?'<button type="button" data-action="tree-add-task" data-id="'+h(selection.id)+'" aria-label="Aufgabe hinzufügen" title="Aufgabe hinzufügen">'+ico('plus',18)+'</button>':'<button type="button" data-action="tree-add-project" data-id="'+h(selection?.id||'')+'" aria-label="Projekt hinzufügen" title="Projekt hinzufügen">'+ico('plus',18)+'</button>')+
   (selection?'<button type="button" data-action="compass58-inspector-toggle" aria-label="Inspector '+(selectedDetails?'schließen':'öffnen')+'" title="Inspector">'+ico('layers',18)+'</button>':'')+'</div></div>'+ 
   '<details class="compass58-mobile-explorer"><summary>'+ico('folder',17)+' Ordner & Projekte</summary><div class="compass58-mobile-tree">'+tree+'</div></details>'+ 
   compass58CreatePanel()+content+ 
   '<button type="button" class="compass58-tools-button" data-action="compass58-tools" aria-expanded="'+compass58ToolsOpen+'">'+ico('settings',15)+' Projektwerkzeuge</button>'+ 
   (compass58ToolsOpen?'<section class="compass58-extra">'+projectExchangePanel()+'<details class="tree-secondary"><summary>Lebensziele & Projektgesundheit</summary>'+lifeGoalsPanel()+gtdProjectHealthPanel()+'</details></section>':'')+
   '</section>'+inspectorMarkup+'</div>');
}
`;
