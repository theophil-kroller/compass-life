/** Compass .59.40.8: lifecycle (synced), duplicate-safe creation, N-of-1 trials. */
export function compass59408ProjectsExperimentsRelease(){
 const one=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.8 ${label}: expected one anchor; found ${n}`);return s.replace(a,b);};
 return {name:'compass-59408-projects-experiments',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];let s=source;
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   s=one(s,'Build 0.5.77.59.40.7','Build 0.5.77.59.40.8','lock badge');return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-coach-v5775910.js')){
   s=one(s,"import {coach34Feedback", "import {coachNof1Panel48} from './strength-nof1-v57759408.js';\nimport './strength-nof1-v57759408.css';\nimport {coach34Feedback",'coach import');
   s=one(s,'export function openStrengthCoach({state,today,onSession=async()=>{}}){','export function openStrengthCoach({state,today,onSession=async()=>{},onExperiment=async()=>{}}){','trial callback');
   s=one(s,' const dialog=host.firstElementChild;const before=document.activeElement;let closed=false;',' const dialog=host.firstElementChild;const before=document.activeElement;let closed=false,trialMessage48="";','coach message state');
   s=one(s,'  ${coachPlateauView47(state,plan,today)}','  ${coachPlateauView47(state,plan,today)}\n  ${coachNof1Panel48(state,plan,today)}\n  ${trialMessage48?`<p class="str408-note" role="status">${safe(trialMessage48)}</p>`:""}','experiment UI');
   s=one(s,"  dialog.querySelectorAll('[data-cycle35]').forEach(button=>button.onclick=()=>{if(saveCycleAction35(button.dataset.cycle35,today))draw();});",`  dialog.querySelectorAll('[data-trial48]').forEach(button=>button.onclick=async()=>{
    if(button.disabled)return;button.disabled=true;
    try{await onExperiment({kind:button.dataset.trial48,id:button.dataset.id,strategy:button.dataset.strategy,
      exerciseTitle:button.dataset.title,primary:button.dataset.primary,today});trialMessage48='Strategieversuch gespeichert.';}
    catch(ex){trialMessage48=String(ex.message||ex).slice(0,300);}
    draw();
   });
   dialog.querySelectorAll('[data-cycle35]').forEach(button=>button.onclick=()=>{if(saveCycleAction35(button.dataset.cycle35,today))draw();});`,'experiment handlers');
   return {code:s,map:null};
  }
  if(!path.endsWith('/client/src/main.js'))return null;
  s=one(s,'Build 0.5.77.59.40.7','Build 0.5.77.59.40.8','main badge');
  s=one(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.7';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.8';",'client version');
  s=one(s,"import {deadlineIntelligence}","import {duplicateProject48,visibleInProjectTree48,projectVaultPanel48,canPurgeProject48,childCount48,taskCount48,redactProject48,projectIcon48} from './project-lifecycle-v57759408.js';\nimport './project-lifecycle-v57759408.css';\nimport {coachTrialStart48,coachTrialFinish48} from './strength-nof1-v57759408.js';\nimport {deadlineIntelligence}",'feature imports');
  s=one(s,'let selectedProjectId=null;','let selectedProjectId=null;\nlet projectVaultView48="",projectCreating48=false;','mode and duplicate guard');
  s=one(s,"  suitcase:'<rect",`  cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l3 12h13l2-9H5M8 17h12"/>',
  archive:'<rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v13h14V8M10 13h4"/>',
  trash:'<path d="M3 6h18M9 6V4h6v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  suitcase:'<rect`,'new svg icons');
  s=one(s,"return candidates.filter(p=>!p.isTemplate&&!visited.has(p.id)&&!(isShoppingList(state,p)&&p.status==='completed')).map(p=>{", "return candidates.filter(p=>!p.isTemplate&&!visited.has(p.id)&&visibleInProjectTree48(state,p)&&!(isShoppingList(state,p)&&p.status==='completed')).map(p=>{",'hide inactive tree');
  s=one(s,"${ico(folderIcon(p),17)}","${ico(projectIcon48(p)==='folder'?folderIcon(p):projectIcon48(p),17)}",'special folder icons');
  s=one(s,"tree-node-icon\">${ico('list',17)}</span>","tree-node-icon\">${ico(projectIcon48(p),17)}</span>",'checklist icon');
  s=one(s,"const selection=selectedProjectId&&state.projects?.[selectedProjectId]||null;", "const selection=!projectVaultView48&&selectedProjectId&&state.projects?.[selectedProjectId]||null;",'normal selection only');
  s=one(s,"<div class=\"unified-tree\" role=\"tree\" aria-label=\"Ordner, Projekte und Aufgaben\">${treeProjectRows(null,0,new Set(),treeIndex)||'<div class=\"tree-empty\">Noch keine Projekte. Lege dein erstes Projekt oder einen Ordner an.</div>'}<div class=\"tree-root-drop\" data-drop-type=\"project-root\" data-drop-id=\"\">${ico('folder',14)} Auf oberste Ebene ziehen</div></div>","<div class=\"unified-tree\" role=\"tree\" aria-label=\"Ordner, Projekte und Aufgaben\">${projectVaultView48?projectVaultPanel48(state,projectVaultView48,ico):(treeProjectRows(null,0,new Set(),treeIndex)||'<div class=\"tree-empty\">Noch keine Projekte. Lege dein erstes Projekt oder einen Ordner an.</div>')}${!projectVaultView48?`<div class=\"tree-root-drop\" data-drop-type=\"project-root\" data-drop-id=\"\">${ico('folder',14)} Auf oberste Ebene ziehen</div>`:''}<div class=\"p48-destinations\"><button type=\"button\" data-action=\"p48-view-archive\" aria-pressed=\"${projectVaultView48==='archived'}\">${ico('archive',16)} Archiv</button><button type=\"button\" class=\"p48-trash\" data-action=\"p48-view-trash\" aria-pressed=\"${projectVaultView48==='trash'}\">${ico('trash',16)} Papierkorb</button></div></div>",'vault navigation');
  s=one(s,"if(proj.kind==='project'&&(!proj.isTemplate||proj.id===selected)&&(proj.status!=='completed'||proj.id===selected))","if(proj.kind==='project'&&visibleInProjectTree48(state,proj)&&(!proj.isTemplate||proj.id===selected)&&(proj.status!=='completed'||proj.id===selected))",'active project selector');
  s=one(s,"if(blocked.has(proj.id))continue;\n  roots.push","if(blocked.has(proj.id)||!visibleInProjectTree48(state,proj))continue;\n  roots.push",'parent selector');
  s=one(s,"for(const p of Object.values(state.projects||{}).filter(p=>p.kind==='project'&&!p.isTemplate)){", "for(const p of Object.values(state.projects||{}).filter(p=>p.kind==='project'&&!p.isTemplate&&visibleInProjectTree48(state,p))){",'task destinations');
  // Inspector action buttons, independent of the collapsed metadata form.
  s=one(s,"${selection?.isTemplate?`<button type=\"button\" class=\"primary-btn\" data-action=\"tree-template-use\"", "${selection?`<div class=\"p48-inspector-actions\"><button type=\"button\" data-action=\"p48-archive\" data-id=\"${h(selection.id)}\">${ico('archive',15)} Archivieren</button><button type=\"button\" class=\"p48-trash\" data-action=\"p48-trash\" data-id=\"${h(selection.id)}\">${ico('trash',15)} Papierkorb</button></div>`:''}${selection?.isTemplate?`<button type=\"button\" class=\"primary-btn\" data-action=\"tree-template-use\"",'inspector controls');
  // Note: repeated clicks on the same form should not create new UUIDs while persistence runs.
  s=one(s,"    ev.preventDefault();const d=new FormData(projectCreate);const project={id:crypto.randomUUID()",`    ev.preventDefault();if(projectCreating48)return;const d=new FormData(projectCreate);const project={id:crypto.randomUUID()`, 'create in-flight guard');
  s=one(s,"    if(!validProject(project)||!validProjectParent(state,project.id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}",`    if(!validProject(project)||!validProjectParent(state,project.id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}
    const dupe=duplicateProject48(state,project);if(dupe){toast('Ein Projekt oder Ordner mit diesem Namen existiert hier bereits. Zum Anlegen eines zweiten bitte einen anderen Namen verwenden.',true);return;}`, 'same parent duplicate');
  s=one(s,"    try{\n      await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;},projectCreate,true,{",`    try{
      projectCreating48=true;projectCreate.querySelector('[type="submit"]').disabled=true;
      await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;},projectCreate,true,{`,'disable button on submit');
  s=one(s,"    }catch(ex){toast(ex.message,true);}\n  };\n  const projectEdit",`    }catch(ex){toast(ex.message,true);}
    finally{projectCreating48=false;if(projectCreate.isConnected)projectCreate.querySelector('[type="submit"]').disabled=false;}
  };
  const projectEdit`,'reset submit guard');
  s=one(s,"if(action==='project-reviewed'){",`if(action==='p48-view-archive'||action==='p48-view-trash'){projectVaultView48=action==='p48-view-archive'?'archived':'trash';selectedProjectId=null;selectedTaskId=null;treeCreateKind='';render();return;}
    if(action==='p48-close'){projectVaultView48='';render();return;}
    if(action==='p48-archive'||action==='p48-trash'||action==='p48-restore'||action==='p48-purge'){
      const p=state?.projects?.[id];if(!p)return;
      if(action==='p48-archive'&&p.status==='archived'||action==='p48-trash'&&p.status==='trash')return;
      if(action==='p48-purge'){
        if(!canPurgeProject48(state,id))return toast('Endgültiges Löschen ist nur bei leeren Projekten oder Ordnern im Papierkorb erlaubt. Aufgaben und Unterprojekte zuerst verschieben.',true);
        if(!confirm('Projekt endgültig löschen? Dies kann nach Synchronisierung nicht rückgängig gemacht werden.'))return;
      }else if(action==='p48-trash'){
        if(!confirm('„'+p.title+'“ in den Papierkorb verschieben? Unterprojekte und Aufgaben bleiben erhalten.'))return;
      }
      try{await mutate(s=>{const x=s.projects[id];const next=action==='p48-archive'?'archived':action==='p48-trash'?'trash':action==='p48-purge'?'deleted':x.status==='archived'?'completed':'active';
       s.projects[id]=next==='deleted'?redactProject48(x):{...x,status:next};s.projectPending[id]=true;});
       if(selectedProjectId===id){selectedProjectId=null;selectedTaskId=null;}
       toast(action==='p48-purge'?'Projektinhalt gelöscht; eine technische ID-Sperre verhindert Wiederherstellung durch alte Geräte.':action==='p48-trash'?'In den Papierkorb verschoben.':action==='p48-archive'?'Projekt archiviert.':'Projekt wiederhergestellt.');
      }catch(ex){toast(ex.message,true);}return;
    }
    if(action==='project-reviewed'){`,'lifecycle actions');
  s=one(s,'mod.openStrengthCoach({state,today:localDate(),onSession:storeStrengthGuidedSession});return;',
   `mod.openStrengthCoach({state,today:localDate(),onSession:storeStrengthGuidedSession,onExperiment:async data=>{
    if(data.kind==='start'){await mutate(s=>coachTrialStart48(s,{exerciseId:data.id,exerciseTitle:data.exerciseTitle,strategy:data.strategy,primary:data.primary,today:data.today}));return;}
    if(data.kind==='finish'){await mutate(s=>coachTrialFinish48(s,data.id,data.today));return;}
   }});return;`,'trial persistence callback');
  return {code:s,map:null};
 }};
}
