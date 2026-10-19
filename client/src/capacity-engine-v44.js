/** Compass 0.5.44 · read-only, local Capacity Engine.
 * Calendar titles and events stay in browser RAM; only generic preferences may be saved to the Vault.
 * Free calendar time is NOT a commitment or a prediction of human productivity.
 */
import {smartDailyChoices, timeModes} from './life-intelligence-v22.js';
const pad=x=>String(x).padStart(2,'0');
const dayKey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const roundM=ms=>Math.max(0,Math.floor(ms/60000));
const clamp=(n,min,max,fallback)=>Number.isInteger(Number(n))&&Number(n)>=min&&Number(n)<=max?Number(n):fallback;
export const CAPACITY_DEFAULTS=Object.freeze({startHour:9,endHour:17,bufferMinutes:10,minSlotMinutes:30,weekends:false});
export function capacitySettings(raw={}){
 const p={startHour:clamp(raw.startHour,5,18,9),endHour:clamp(raw.endHour,6,23,17),bufferMinutes:clamp(raw.bufferMinutes,0,60,10),minSlotMinutes:clamp(raw.minSlotMinutes,15,120,30),weekends:raw.weekends===true};
 if(p.endHour<=p.startHour)p.endHour=Math.min(23,p.startHour+1);
 return p;
}
const parseEventDate=(value)=>{if(typeof value!=='string')return null;const ms=Date.parse(value);return Number.isFinite(ms)?ms:null;};
/** Merge overlapping intervals; a meeting shared between calendars must not block time twice. */
export function mergeIntervals(intervals){
 const sorted=intervals.filter(a=>Array.isArray(a)&&Number.isFinite(a[0])&&Number.isFinite(a[1])&&a[1]>a[0]).sort((a,b)=>a[0]-b[0]);
 const merged=[];
 for(const [a,b] of sorted){const last=merged[merged.length-1];if(last&&a<=last[1])last[1]=Math.max(last[1],b);else merged.push([a,b]);}
 return merged;
}
/** Never remove events because they are hidden in Compass or look like routine blocks. */
export function busyIntervals(events=[],workStart,workEnd,bufferMinutes=10){
 const padMs=bufferMinutes*60000,blocks=[];let allDayBusy=0;
 for(const event of (Array.isArray(events)?events:[])){
  if(!event||event.status==='cancelled'||event.transparency==='transparent')continue;
  const start=event.start||{},end=event.end||{};
  let a,b;
  if(start.date&&end.date){ // Google all-day end is exclusive. Opaque holiday/vacation blocks the workday.
   a=parseEventDate(start.date+'T00:00:00');b=parseEventDate(end.date+'T00:00:00');
   if(a!=null&&b!=null&&a<workEnd&&b>workStart)allDayBusy++;
  }else{
   a=parseEventDate(start.dateTime);b=parseEventDate(end.dateTime);
  }
  if(a==null||b==null||b<=a||b<=workStart||a>=workEnd)continue;
  blocks.push([Math.max(workStart,a-padMs),Math.min(workEnd,b+padMs)]);
 }
 return {intervals:mergeIntervals(blocks),allDayBusy};
}
export function capacityForecast({events=[],connected=false,coverage=null,updatedAt=0,now=new Date(),startDay=null,days=14,settings={}}={}){
 const pref=capacitySettings(settings),today=dayKey(now),from=startDay||today;
 const goodDay=/^\d{4}-\d{2}-\d{2}$/.test(from)&&!Number.isNaN(Date.parse(from+'T12:00:00'));
 if(!goodDay)throw Error('Ungültiger Starttag.');
 const span=clamp(days,1,30,14),last=new Date(from+'T12:00:00');last.setDate(last.getDate()+span-1);
 const through=dayKey(last),coverageOk=Boolean(coverage?.complete===true&&coverage.start<=from&&coverage.end>through);
 const fresh=Number.isFinite(updatedAt)&&updatedAt>0&&now.getTime()-updatedAt>=0&&now.getTime()-updatedAt<=120*60000;
 const status=!connected?'disconnected':!coverageOk?'partial':!fresh?'stale':'ready';
 const out=[];
 if(status!=='ready')return {status,settings:pref,days:[],slots:[],totalMinutes:null,workMinutes:null,from,through,source:'Google Calendar · primärer Kalender, nur lesend'};
 for(let d=0;d<span;d++){
  const date=new Date(from+'T12:00:00');date.setDate(date.getDate()+d);const day=dayKey(date);
  const allowed=pref.weekends||!([0,6].includes(date.getDay()));
  const begin=new Date(`${day}T${pad(pref.startHour)}:00:00`).getTime();
  const end=new Date(`${day}T${pad(pref.endHour)}:00:00`).getTime();
  const earliest=day===today?Math.max(begin,now.getTime()):begin;
  const start=day<today?end:earliest;
  const allDay=allowed?busyIntervals(events,begin,end,pref.bufferMinutes):{intervals:[],allDayBusy:0};
  const breaks=[],slots=[];let cursor=start;
  if(allowed){
   for(const [a,b] of allDay.intervals){if(a>cursor&&roundM(a-cursor)>=pref.minSlotMinutes)slots.push({day,start:cursor,end:a,minutes:roundM(a-cursor)});cursor=Math.max(cursor,b);}
   if(end>cursor&&roundM(end-cursor)>=pref.minSlotMinutes)slots.push({day,start:cursor,end,minutes:roundM(end-cursor)});
  }
  out.push({day,slots,minutes:slots.reduce((n,s)=>n+s.minutes,0),workMinutes:allowed?roundM(end-Math.max(start,begin)):0,allDayBusy:allDay.allDayBusy,off:!allowed});
 }
 const slots=out.flatMap(d=>d.slots);
 return {status,settings:pref,days:out,slots,totalMinutes:slots.reduce((n,s)=>n+s.minutes,0),workMinutes:out.reduce((n,d)=>n+d.workMinutes,0),from,through,source:'Google Calendar · primärer Kalender, nur lesend'};
}
/** Suggestions do not reserve space and do not write to calendar/tasks. Unknown estimates stay marked as tentative. */
export function capacitySuggestions(state,forecast,{energy='offen',context='',limit=3}={}){
 if(forecast?.status!=='ready')return [];
 const seen=new Set(),result=[];
 for(const slot of forecast.slots){
  const minutes=timeModes.filter(n=>n<=slot.minutes).at(-1)||15;
  const picks=smartDailyChoices(state,{day:slot.day,minutes,energy,context,limit:3}).items;
  const candidate=picks.find(r=>!seen.has(r.task.id)&&(!r.task.estimateMinutes||r.task.estimateMinutes<=slot.minutes));
  if(!candidate)continue;
  seen.add(candidate.task.id);
  result.push({slot,task:candidate.task,reasons:candidate.reasons,estimateUnknown:!candidate.task.estimateMinutes});
  if(result.length>=limit)break;
 }
 return result;
}
