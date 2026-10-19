/** Compass 0.5.27 — pure hierarchy moves and reusable project templates.
 * These operations are local-first, validated and mark every changed record pending
 * so the existing optimistic sync protocol can replay them on all devices.
 */
import {childProjects, projectDescendantIds, taskChildren, validProjectParent, validTaskParent, validLocalTask, validProject} from './tasks.js';

const safeOrder=(index)=>Math.min(1000000,(index+1)*100);
const mark=(s,type,id)=>{s[type==='projects'?'projectPending':'taskPending']??={};s[type==='projects'?'projectPending':'taskPending'][id]=true;};
const assignOrders=(s,type,ids)=>ids.forEach((id,i)=>{s[type][id].sortOrder=safeOrder(i);mark(s,type,id);});

export function moveProjectHierarchy(state,id,targetId=null,where='inside'){
 const p=state?.projects?.[id],target=targetId?state?.projects?.[targetId]:null;
 if(!p||targetId&&!target||!['inside','before','after'].includes(where))throw new Error('Projektziel ungültig.');
 if(targetId===id)throw new Error('Ein Projekt kann nicht in sich selbst verschoben werden.');
 const parentId=where==='inside'?targetId:(target?.parentId||null);
 if(!validProjectParent(state,id,parentId))throw new Error('Zyklische Projektstruktur nicht zulässig.');
 // A template is a library item and cannot be placed underneath itself indirectly.
 if(parentId&&state.projects[parentId]?.isTemplate)throw new Error('Vorlagen nicht ineinander verschachteln.');
 const oldParent=p.parentId||null;
 p.parentId=parentId;
 const siblings=childProjects(state,parentId).filter(x=>x.id!==id).map(x=>x.id);
 const pos=where==='inside'?siblings.length:siblings.indexOf(targetId)+(where==='after'?1:0);
 if(where!=='inside'&&siblings.indexOf(targetId)<0)throw new Error('Ziel nicht im gleichen Ordner.');
 siblings.splice(pos,0,id);
 assignOrders(state,'projects',siblings);
 if(oldParent!==parentId)assignOrders(state,'projects',childProjects(state,oldParent).map(x=>x.id));
 return {parentId,ordered:siblings};
}

export function taskDescendants(state,id){
 const out=[],visited=new Set([id]);
 const visit=(parent)=>{for(const t of Object.values(state?.tasks||{})){
  if(t.archived||t.parentTaskId!==parent||visited.has(t.id))continue;
  visited.add(t.id);out.push(t.id);visit(t.id);
 }};
 visit(id);return out;
}

export function moveTaskHierarchy(state,id,targetType,targetId,where='inside'){
 const task=state?.tasks?.[id];
 if(!task||task.archived||!['inside','before','after'].includes(where))throw new Error('Aufgabe oder Position ungültig.');
 let projectId,parentTaskId=null,relativeId=null;
 if(targetType==='project'){
  if(where!=='inside'||!state.projects?.[targetId]||state.projects[targetId].kind==='folder')throw new Error('Projektziel ungültig.');
  projectId=targetId;
 }else if(targetType==='task'){
  const target=state.tasks?.[targetId];
  if(!target||target.archived||targetId===id)throw new Error('Aufgabenziel ungültig.');
  projectId=target.projectId;
  parentTaskId=where==='inside'?targetId:(target.parentTaskId||null);
  relativeId=where==='inside'?null:targetId;
 }else throw new Error('Aufgabenziel ungültig.');
 if(!projectId||!state.projects[projectId]||state.projects[projectId].kind==='folder')throw new Error('Aufgaben brauchen ein Projekt.');
 if(Boolean(state.projects[task.projectId]?.isTemplate)!==Boolean(state.projects[projectId]?.isTemplate))throw new Error('Vorlagen bleiben getrennt von aktiven Aufgaben. Erst eine neue Liste erstellen.');
 if(taskDescendants(state,id).includes(parentTaskId)||!validTaskParent(state,id,projectId,parentTaskId)){
  // validTaskParent checks against the *current* project; cross-project moves with a
  // new parent are checked against target state below instead.
  if(taskDescendants(state,id).includes(parentTaskId)||projectId===task.projectId)throw new Error('Zyklische Aufgabenstruktur nicht zulässig.');
 }
 const oldProject=task.projectId,oldParent=task.parentTaskId||null;
 const moved=[id,...taskDescendants(state,id)];
 if(parentTaskId&&moved.includes(parentTaskId))throw new Error('Aufgabe kann nicht in eine Unteraufgabe verschoben werden.');
 for(const movedId of moved){state.tasks[movedId].projectId=projectId;state.tasks[movedId].updatedAt=new Date().toISOString();mark(state,'tasks',movedId);}
 task.parentTaskId=parentTaskId;
 const siblings=taskChildren(state,projectId,parentTaskId).filter(t=>t.id!==id).map(t=>t.id);
 const pos=relativeId?siblings.indexOf(relativeId)+(where==='after'?1:0):siblings.length;
 if(relativeId&&siblings.indexOf(relativeId)<0)throw new Error('Ziel nicht im gleichen Bereich.');
 siblings.splice(pos,0,id);
 assignOrders(state,'tasks',siblings);
 if(oldProject!==projectId||oldParent!==parentTaskId)assignOrders(state,'tasks',taskChildren(state,oldProject,oldParent).map(t=>t.id));
 return {projectId,parentTaskId,ordered:siblings,moved};
}

export function isTemplateProject(p){return p?.kind==='project'&&p?.isTemplate===true;}
export function cloneProjectTemplate(state,id,ids,title){
 const source=state?.projects?.[id];if(!isTemplateProject(source))throw new Error('Keine Projektvorlage.');
 const tasks=Object.values(state.tasks||{}).filter(t=>!t.archived&&t.projectId===id);
 if(tasks.length>120)throw new Error('Vorlage hat zu viele Einträge (maximal 120).');
 const freshId=ids();const newTitle=String(title||'').trim();
 if(!newTitle||newTitle.length>140||state.projects[freshId])throw new Error('Name oder Projekt-ID ungültig.');
 const newProject={...source,id:freshId,title:newTitle,isTemplate:false,status:'active',reviewedAt:null,dueDate:null,parentId:source.parentId||null,sortOrder:safeOrder(childProjects(state,source.parentId||null).length),version:undefined,baseVersion:undefined};
 if(!validProject(newProject))throw new Error('Projektvorlage ungültig.');
 const remap=new Map(tasks.map(t=>[t.id,ids()]));
 const copies=tasks.map(t=>({...t,id:remap.get(t.id),projectId:freshId,parentTaskId:remap.get(t.parentTaskId)||null,plannedDate:null,dueDate:null,deferUntil:null,completed:false,flagged:false,archived:false,updatedAt:new Date().toISOString(),version:undefined,baseVersion:undefined}));
 for(const copy of copies)if(!validLocalTask(copy))throw new Error('Vorlage enthält ungültige Aufgaben.');
 state.projects[freshId]=newProject;mark(state,'projects',freshId);
 for(const copy of copies){state.tasks[copy.id]=copy;mark(state,'tasks',copy.id);}
 return {project:newProject,tasks:copies};
}
