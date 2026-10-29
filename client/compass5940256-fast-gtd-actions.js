/** Compass .40.25.6 – task progress and project moves feel immediate. */
export function compass5940256FastGtdActions(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.6 ${label}: expected 1 anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-5940256-fast-gtd-actions',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.5','Build 0.5.77.59.40.25.6','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.5';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.6';",'version');
  s=once(s,'Build 0.5.77.59.40.25.5','Build 0.5.77.59.40.25.6','footer');
  s=once(s,"import {planningCheckpoint,restorePlanningCheckpoint,afterPlanningPaint} from './fast-planning-v57721.js';",`import {planningCheckpoint,restorePlanningCheckpoint,afterPlanningPaint} from './fast-planning-v57721.js';
import {gtdCheckpoint,paintGtdProgress} from './fast-gtd-actions-v5775940256.js';`,'helper import');
  s=once(s,`  const fastPlanning=options?.fastPlanning===true&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&tab!=='people';
  const previous=fastPlanning?planningCheckpoint(state):structuredClone(state);`,
  `  const fastGtd=options?.fastGtd===true&&tab!=='people';
  const fastPlanning=fastGtd||options?.fastPlanning===true&&!['source','receiver'].includes(state.privateDeviceMirror?.mode)&&tab!=='people';
  const actionStart=fastGtd?performanceTrace.start():null;
  const gtdTicket=fastGtd?++fastGtdMutationRevision:0;
  const previous=fastGtd?gtdCheckpoint(state,{singleTaskId:options?.singleTaskId||null}):fastPlanning?planningCheckpoint(state):structuredClone(state);`,'selective snapshot');
  s=once(s,`    if(['source','receiver'].includes(state.privateDeviceMirror?.mode)&&privateChanged(previous,state)){`,
    `    if(!fastGtd&&['source','receiver'].includes(state.privateDeviceMirror?.mode)&&privateChanged(previous,state)){`,'private mirror guard');
  s=once(s,`async function mutate(fn,committedEditForm=null,skipFinalRender=false,options=null) {`,
    `let fastGtdMutationRevision=0;
async function mutate(fn,committedEditForm=null,skipFinalRender=false,options=null) {`,'revision counter');
  s=once(s,`  }catch(ex){if(fastPlanning){restorePlanningCheckpoint(state,previous);options?.onFailed?.();}else state=previous;if(draftBackup)editDraftGuard.rollback(draftBackup);render();throw new Error(\`Lokales Speichern fehlgeschlagen: \${ex.message}\`);}`,
    `  }catch(ex){
      // A failed earlier save must not discard a later in-flight +1 or move.
      if(!fastGtd||gtdTicket===fastGtdMutationRevision){
        if(fastPlanning){restorePlanningCheckpoint(state,previous);options?.onFailed?.();}else state=previous;
      }
      if(draftBackup)editDraftGuard.rollback(draftBackup);render();
      throw new Error(\`Lokales Speichern fehlgeschlagen: \${ex.message}\`);
    }`,'concurrent rollback');
  s=once(s,`      if(options?.fastTodayVisual!==true)render();
      await afterPlanningPaint();
    }
    await persist();
    syncQuickPublicFromState();`,
  `      if(options?.fastTodayVisual!==true&&!options?.inlineGtd)render();
      await afterPlanningPaint();
      if(fastGtd)performanceTrace.end('GTD Aktion bis Paint',tab,actionStart);
    }
    await persist();
    if(!fastGtd)syncQuickPublicFromState();`,'fast UI and avoid unrelated quick state');
  // For inline progress: the DOM is patched immediately. For hierarchy moves: exactly one full render before encryption.
  s=once(s,`    if(action==='task-progress-plus'||action==='task-progress-minus'){
      const t=state?.tasks?.[id];if(!t||t.archived||t.completed||state.projects?.[t.projectId]?.isTemplate)return;
      const next=advanceTaskCounter(t,action==='task-progress-plus'?1:-1);
      if(next===null||next===(t.progressCurrent??0))return;
      await mutate(s=>{s.tasks[id].progressCurrent=next;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});
      if(next===t.progressTarget)toast('Stückziel erreicht! Die Aufgabe bleibt offen, bis du sie abschließt.');
      return;
    }`,
  `    if(action==='task-progress-plus'||action==='task-progress-minus'){
      const t=state?.tasks?.[id];if(!t||t.archived||t.completed||state.projects?.[t.projectId]?.isTemplate)return;
      const next=advanceTaskCounter(t,action==='task-progress-plus'?1:-1);
      if(next===null||next===(t.progressCurrent??0))return;
      const quick=tab!=='people';
      await mutate(s=>{s.tasks[id]={...s.tasks[id],progressCurrent:next,updatedAt:stamp()};s.taskPending[id]=true;},null,quick,
        quick?{fastPlanning:true,fastGtd:true,singleTaskId:id,inlineGtd:true,onApplied:()=>paintGtdProgress(app,id,state.tasks[id])}:null);
      if(next===t.progressTarget)toast('Stückziel erreicht! Die Aufgabe bleibt offen, bis du sie abschließt.');
      return;
    }`,'instant progress');
  s=once(s,`      await mutate(s=>moveOrder(s,'tasks',id,action==='task-move-up'?-1:1));return;`,
  `      const quick=true;
      await mutate(s=>moveOrder(s,'tasks',id,action==='task-move-up'?-1:1),null,quick,quick?{fastPlanning:true,fastGtd:true}:null);return;`,'reorder fast');
  s=once(s,`    try{await mutate(s=>moveTaskHierarchy(s,taskId,type,targetId,'inside'));selectedProjectId=state.tasks[taskId].projectId;toast('Aufgabe mit Unteraufgaben verschoben.');}catch(ex){toast(ex.message,true);}`,
  `    try{const quick=true;
      await mutate(s=>moveTaskHierarchy(s,taskId,type,targetId,'inside'),null,quick,quick?{fastPlanning:true,fastGtd:true,onApplied:()=>{selectedProjectId=state.tasks[taskId].projectId;}}:null);
      if(!quick)selectedProjectId=state.tasks[taskId].projectId;
    }catch(ex){toast(ex.message,true);}`,'inspector move');
  s=once(s,`      try{if(payload.type==='project')await mutate(s=>moveProjectHierarchy(s,payload.id,targetId,where));
        else await mutate(s=>moveTaskHierarchy(s,payload.id,targetType,targetId,where));
        if(payload.type==='project')selectedProjectId=payload.id;
        else {selectedProjectId=state.tasks[payload.id].projectId;selectedTaskId=payload.id;}`,
  `      try{const quick=true;
        const updateSelection=()=>{if(payload.type==='project')selectedProjectId=payload.id;
          else {selectedProjectId=state.tasks[payload.id].projectId;selectedTaskId=payload.id;}};
        await mutate(s=>payload.type==='project'?moveProjectHierarchy(s,payload.id,targetId,where):moveTaskHierarchy(s,payload.id,targetType,targetId,where),null,quick,
          quick?{fastPlanning:true,fastGtd:true,onApplied:updateSelection}:null);
        if(!quick){updateSelection();render();}`,'drag/drop fast');
  return {code:s,map:null};
 }};
}
