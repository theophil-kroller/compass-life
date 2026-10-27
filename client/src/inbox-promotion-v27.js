/** Convert an Inbox capture into a GTD task without mutating source data.
 * Caller persists the task and tombstones the original record in ONE local vault write.
 */
import {validLocalTask,parseTags} from './tasks.js';
import {inboxFlagged,visibleInboxTags} from './inbox-flags-v27.js';

export function inboxTaskDraft(state,recordId,fields={},newId,now=new Date().toISOString()){
 const record=state?.records?.[recordId];
 if(!record||record.deleted||record.tags?.includes('dreams'))throw new Error('Inbox-Eintrag ist nicht mehr verfügbar.');
 if(!newId||state.tasks?.[newId])throw new Error('Neue Aufgaben-ID ungültig.');
 const projectId=String(fields.projectId||'').trim()||null;
 const project=projectId?state.projects?.[projectId]:null;
 if(projectId&&(!project||project.kind!=='project'||project.isTemplate||!['active','hold'].includes(project.status)))throw new Error('Bitte ein aktives oder pausiertes Projekt auswählen; keine Vorlage.');
 const workflow=String(fields.workflow||'next');
 if(!['next','waiting','hold'].includes(workflow))throw new Error('GTD-Status ungültig.');
 const title=String(fields.title??record.title??'').trim();
 const note=String(fields.note??record.note??'').trim();
 if(title.length>180)throw new Error('Titel auf höchstens 180 Zeichen kürzen.');
 if(note.length>3000)throw new Error('Notiz ist für eine Aufgabe zu lang. Bitte auf 3.000 Zeichen kürzen, damit nichts verloren geht.');
 const task={id:newId,title,note,category:project?.category||'Allgemein',workflow,flagged:inboxFlagged(record),
  completed:false,archived:false,projectId,parentTaskId:null,sortOrder:0,
  plannedDate:null,dueDate:null,deferUntil:null,estimateMinutes:null,
  tags:parseTags(visibleInboxTags(fields.tags??record.tags??[])),contextTags:[],updatedAt:now};
 if(!validLocalTask(task))throw new Error('Aufgabenangaben sind ungültig.');
 return task;
}
