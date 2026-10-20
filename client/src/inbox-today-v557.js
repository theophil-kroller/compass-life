/** Compass 0.5.57 — quick Inbox-to-Today promotion.
 * Builds a valid, projectless Next Action; persistence and capture tombstoning
 * belong to the caller's SINGLE encrypted vault mutation.
 */
import {inboxTaskDraft} from './inbox-promotion-v27.js';
import {dateIsValid,validLocalTask} from './tasks.js';

export function inboxTodayTaskDraft(state,recordId,newId,day,now=new Date().toISOString()){
 if(typeof day!=='string'||!day||!dateIsValid(day))throw new Error('Ungültiger Planungstag.');
 const task=inboxTaskDraft(state,recordId,{workflow:'next'},newId,now);
 const planned={...task,plannedDate:day};
 if(!validLocalTask(planned))throw new Error('Die Aufgabe kann nicht für heute geplant werden.');
 return planned;
}
