/** Compass 0.5.77.13 — editable master templates and disposable shopping copies.
 * The only persistent records are ordinary projects/tasks (D1 compatible). Archiving
 * means completed project, not deletion of items or source template.
 */
import {cloneProjectTemplate} from './project-workspace-v27.js';
import {projectTasks,validProject} from './tasks.js';

export const SHOPPING_FOLDER_TITLE='Einkaufslisten';
export function isShoppingTemplate(project){
 return Boolean(project?.isTemplate&&/einkauf|shopping/i.test(String(project.title||'')));
}
export function shoppingFolder(state){return Object.values(state?.projects||{}).find(p=>p.kind==='folder'&&p.title===SHOPPING_FOLDER_TITLE)||null;}
export function isShoppingList(state,project){
 if(!project||project.kind!=='project'||project.isTemplate)return false;
 const folder=shoppingFolder(state);
 return Boolean(folder&&project.parentId===folder.id)||/einkauf|shopping/i.test(project.title||'');
}
export function shoppingLists(state,{archived=false}={}){
 return Object.values(state?.projects||{}).filter(p=>isShoppingList(state,p)&&(archived?['completed','archived'].includes(p.status):['active','hold'].includes(p.status)))
  .sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))||a.title.localeCompare(b.title,'de'));
}
export function shoppingProgress(state,projectId){
 const tasks=projectTasks(state,projectId);
 return {done:tasks.filter(t=>t.completed).length,total:tasks.length,remaining:tasks.filter(t=>!t.completed).length};
}
export function instantiateShoppingList(state,templateId,idFactory,title,now=new Date().toISOString()){
 const template=state.projects?.[templateId];if(!isShoppingTemplate(template))throw Error('Bitte zuerst eine Einkaufsvorlage auswählen.');
 if(!state.projects||!state.tasks)throw Error('Projekt- oder Aufgabendaten fehlen.');
 let folder=shoppingFolder(state);
 if(!folder){
  const id=idFactory();folder={id,title:SHOPPING_FOLDER_TITLE,outcome:'Aktive und abgeschlossene Einkaufslisten',category:'Allgemein',status:'active',kind:'folder',folderIcon:'folder',isTemplate:false,projectType:'parallel',parentId:null,dueDate:null,reviewIntervalDays:30,reviewedAt:null,sortOrder:100,updatedAt:now};
  if(!validProject(folder)||state.projects[id])throw Error('Einkaufsordner konnte nicht angelegt werden.');
  state.projects[id]=folder;(state.projectPending??={})[id]=true;
 }
 const result=cloneProjectTemplate(state,templateId,idFactory,title);
 result.project.parentId=folder.id;result.project.projectType='parallel';result.project.status='active';result.project.dueDate=null;result.project.updatedAt=now;
 state.projectPending[result.project.id]=true;
 return result;
}
export function archiveShoppingList(state,projectId,{now=new Date().toISOString()}={}){
 const p=state?.projects?.[projectId];if(!isShoppingList(state,p)||!['active','hold'].includes(p.status))throw Error('Nur eine aktive Einkaufsliste kann archiviert werden.');
 p.status='completed';p.updatedAt=now;(state.projectPending??={})[p.id]=true;
 return shoppingProgress(state,projectId);
}
export function restoreShoppingList(state,projectId,{now=new Date().toISOString()}={}){
 const p=state?.projects?.[projectId];if(!isShoppingList(state,p)||p.status!=='completed')throw Error('Keine archivierte Einkaufsliste.');
 p.status='active';p.updatedAt=now;(state.projectPending??={})[p.id]=true;
 return p;
}
