// Compass 0.4.10 – local, encrypted editorial overlay for watch sessions plus manual entries.
// Raw Garmin measurements are never altered by an edit; deleting permanently uses the authenticated Worker endpoint.
const ISO_LOCAL=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
import {isRoutineCalendarBlock} from './calendar-rules.js';
export const ACTIVITY_CATEGORIES=['Arbeit','Erholung','Freizeit','Soziales','Sonstiges'];
const isoFromEpoch=seconds=>{const date=new Date(seconds*1000);const p=n=>String(n).padStart(2,'0');return `${date.getFullYear()}-${p(date.getMonth()+1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;};
export const isoLocal=isoFromEpoch;
export const isValidLocalDateTime=value=>typeof value==='string'&&ISO_LOCAL.test(value)&&Number.isFinite(new Date(value).getTime())&&isoFromEpoch(new Date(value).getTime()/1000)===value;
export function validActivityEdit(e){return Boolean(e&&typeof e.title==='string'&&e.title.trim().length>=1&&e.title.length<=100&&ACTIVITY_CATEGORIES.includes(e.category)&&isValidLocalDateTime(e.startedAt)&&Number.isSafeInteger(e.durationMinutes)&&e.durationMinutes>=1&&e.durationMinutes<=1440&&(e.distanceKm==null||Number.isFinite(e.distanceKm)&&e.distanceKm>=0&&e.distanceKm<=999.99)&&typeof e.note==='string'&&e.note.length<=1000&&(e.projectId==null||typeof e.projectId==='string'&&e.projectId.length<=60));}
export function validManualActivity(e){return validActivityEdit(e)&&/^manual-[a-z0-9-]{36}$/i.test(e.id||'')&&typeof e.deleted==='boolean';}
export const projectActivities=(watchSessions=[],state={})=>{
 const edits=state?.activityEdits||{};
 const watch=(watchSessions||[]).filter(s=>s&&typeof s.id==='string').map(s=>{
   const o=edits[s.id]||{};
   if(o.purged)return null;
   return {id:s.id,title:o.title??s.activity,category:o.category??(s.activity==='Familie'?'Soziales':'Arbeit'),startedAt:o.startedAt??isoFromEpoch(s.startedAt),durationMinutes:o.durationMinutes??Math.max(1,Math.round((s.durationSec||60)/60)),note:o.note??'',distanceKm:o.distanceKm??null,projectId:o.projectId??'',deleted:o.deleted===true,source:'Garmin',pomodoros:s.pomodoros||0,hrSamples:s.hrSamples||[],bbStart:s.bbStart,bbEnd:s.bbEnd};
 }).filter(Boolean);
 const manual=Object.values(state?.manualActivities||{}).filter(validManualActivity).map(x=>({...x,source:'Manuell',pomodoros:0}));
 return [...watch,...manual].sort((a,b)=>b.startedAt.localeCompare(a.startedAt)||a.id.localeCompare(b.id));
};
export const activeActivities=(watch,state)=>projectActivities(watch,state).filter(x=>!x.deleted);
export function activityStats(list,fromDay,toDay){const activities=list.filter(x=>!x.deleted&&x.startedAt.slice(0,10)>=fromDay&&x.startedAt.slice(0,10)<=toDay);return {count:activities.length,minutes:activities.reduce((v,x)=>v+x.durationMinutes,0),recoveryMinutes:activities.filter(x=>x.category==='Erholung').reduce((v,x)=>v+x.durationMinutes,0),pomodoros:activities.reduce((v,x)=>v+x.pomodoros,0)};}
export function timelineItems(state,calendarEvents=[],startDay,endDay,appearance=()=>({emoji:'📅',category:'Neutral',hidden:false})){
 const items=[];const include=(date)=>date&&date>=startDay&&date<=endDay;
 for(const t of Object.values(state?.tasks||{})){
  if(t.archived||t.completed)continue;
  if(include(t.dueDate))items.push({date:t.dueDate,type:'due',id:t.id,title:t.title,projectId:t.projectId});
  if(include(t.plannedDate)&&t.plannedDate!==t.dueDate)items.push({date:t.plannedDate,type:'planned',id:t.id,title:t.title,projectId:t.projectId});
 }
 for(const p of Object.values(state?.projects||{})){
  if(p.kind==='folder'||p.status!=='active'||!include(p.dueDate))continue;
  items.push({date:p.dueDate,type:'milestone',id:p.id,title:p.title,projectId:p.id});
 }
 for(const e of calendarEvents){
  if(e.status==='cancelled'||isRoutineCalendarBlock(e))continue;const date=e.start?.dateTime?isoFromEpoch(new Date(e.start.dateTime).getTime()/1000).slice(0,10):(e.start?.date||'');
  const a=appearance(e);if(!include(date)||a.hidden)continue;
  items.push({date,type:'calendar',id:e.id,title:a.displayTitle||e.summary||'Termin',icon:a.emoji||'📅',category:a.category||'Neutral'});
 }
 const order={milestone:0,due:1,planned:2,calendar:3};
 return items.sort((a,b)=>a.date.localeCompare(b.date)||order[a.type]-order[b.type]||String(a.title).localeCompare(String(b.title),'de'));
}
