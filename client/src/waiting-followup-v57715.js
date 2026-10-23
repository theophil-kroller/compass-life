/** Compass 0.5.77.15 — explicit GTD Waiting For follow-up, no remote mail access.
 * Store relationship in a backward-compatible note marker; task schema/worker unchanged.
 * Dates are local calendar date strings, computed via UTC noon to avoid DST issues.
 */
import {validLocalTask,isTemplateTask} from './tasks.js';
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const MARKER=/\n?\[Compass-WaitingFor:([0-9a-f-]{36})\]\s*$/i;
const compactDay=d=>d.toISOString().slice(0,10);
function dayDate(day){
 if(typeof day!=='string'||!DAY.test(day))throw Error('Bitte ein gültiges Prüfdatum wählen.');
 const d=new Date(day+'T12:00:00Z');
 if(!Number.isFinite(d.getTime())||compactDay(d)!==day)throw Error('Ungültiges Prüfdatum.');
 return d;
}
function addDays(day,n){const d=dayDate(day);d.setUTCDate(d.getUTCDate()+n);return compactDay(d);}
/** Gregorian Easter Sunday, Meeus/Jones/Butcher. */
export function easterSunday(year){
 const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30;
 const i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k+70)%7,m=Math.floor((a+11*h+22*l)/451);
 const month=Math.floor((h+l-7*m+114)/31),day=1+(h+l-7*m+114)%31;
 return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
/** Nationwide Austrian statutory public holidays. Province/company specific days are not inferred. */
export function austrianPublicHoliday(day){
 const dt=dayDate(day),year=dt.getUTCFullYear(),monthDay=day.slice(5);
 const fixed={'01-01':'Neujahr','01-06':'Heilige Drei Könige','05-01':'Staatsfeiertag','08-15':'Mariä Himmelfahrt','10-26':'Nationalfeiertag','11-01':'Allerheiligen','12-08':'Mariä Empfängnis','12-25':'Christtag','12-26':'Stefanitag'};
 if(fixed[monthDay])return fixed[monthDay];
 const easter=easterSunday(year);
 for(const [offset,name] of [[1,'Ostermontag'],[39,'Christi Himmelfahrt'],[50,'Pfingstmontag'],[60,'Fronleichnam']]){
  if(addDays(easter,offset)===day)return name;
 }
 return null;
}
export function isAustrianWorkday(day){const n=dayDate(day).getUTCDay();return n!==0&&n!==6&&!austrianPublicHoliday(day);}
export function nextAustrianWorkday(day){let result=day;for(let i=0;i<370;i++){if(isAustrianWorkday(result))return result;result=addDays(result,1);}throw Error('Keinen freien Werktag gefunden.');}
export function addAustrianWorkdays(day,amount){
 if(!Number.isInteger(amount)||amount<1||amount>260)throw Error('Ungültige Anzahl von Werktagen.');
 let result=day,remaining=amount;
 while(remaining>0){result=addDays(result,1);if(isAustrianWorkday(result))remaining--;}
 return result;
}
export function suggestedFollowupDates(today){
 return [{days:1,label:'Nächster Werktag'},{days:3,label:'In 3 Werktagen'},{days:5,label:'In 5 Werktagen'},{days:10,label:'In 10 Werktagen'}]
  .map(option=>({...option,date:addAustrianWorkdays(today,option.days)}));
}
export const waitingSourceId=task=>String(task?.note||'').match(MARKER)?.[1]||null;
export const visibleWaitingNote=note=>String(note||'').replace(MARKER,'').trimEnd();
export function retainWaitingLink(existingNote,editedNote){
 const match=String(existingNote||'').match(MARKER);
 const clean=visibleWaitingNote(editedNote).slice(0,match?2950:3000);
 return match?clean+'\n[Compass-WaitingFor:'+match[1]+']':clean;
}
export function currentFollowupFor(state,originId){
 return Object.values(state?.tasks||{}).find(t=>!t.archived&&!t.completed&&t.workflow==='waiting'&&waitingSourceId(t)===originId)||null;
}
export function makeWaitingFollowup(origin,{id,day,title,now=new Date().toISOString()}={}){
 if(!origin?.id||!origin.completed||origin.archived)throw Error('Die Ausgangsaufgabe muss erledigt und nicht archiviert sein.');
 if(!/^[0-9a-f-]{36}$/i.test(String(id||'')))throw Error('Ungültige Aufgaben-ID.');
 const raw=String(title||'').trim();if(!raw||raw.length>180)throw Error('Bitte einen kurzen Titel für die Rückmeldung eingeben.');
 const when=nextAustrianWorkday(day);
 const originTitle=String(origin.title||'').slice(0,180);
 const note=`Gesendete Nachricht: ${originTitle}\nAntwort überprüfen; bei Bedarf freundlich nachfassen.\n[Compass-WaitingFor:${origin.id}]`;
 const task={id,title:raw,note,plannedDate:when,dueDate:null,category:origin.category||'Allgemein',completed:false,archived:false,workflow:'waiting',flagged:false,
  projectId:origin.projectId||null,parentTaskId:null,sortOrder:0,tags:[],contextTags:[],deferUntil:null,estimateMinutes:null,progressTarget:null,progressCurrent:0,updatedAt:now};
 if(!validLocalTask(task))throw Error('Die Wiedervorlage konnte nicht angelegt werden.');
 return task;
}
/** Open follow-ups become visible on check day and stay visible until disposition. */
export function waitingFollowupsDue(state,day){
 dayDate(day);
 return Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&!isTemplateTask(state,t)&&t.workflow==='waiting'&&t.plannedDate&&t.plannedDate<=day&&waitingSourceId(t))
  .sort((a,b)=>a.plannedDate.localeCompare(b.plannedDate)||a.title.localeCompare(b.title,'de'));
}
export function postponeWaitingFollowup(task,today,days=5){
 if(!task||task.completed||task.workflow!=='waiting'||!waitingSourceId(task))throw Error('Kein offener Antwort-Reminder.');
 return {...task,plannedDate:addAustrianWorkdays(today,days),updatedAt:new Date().toISOString()};
}
