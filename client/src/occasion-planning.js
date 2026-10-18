// Compass 0.4.10 — optional, staged preparation for birthdays and annual holidays.
// No Calendar writes. Choices live in the encrypted local vault; accepted tasks use normal task sync.
import {calendarEventDay,containsTerm} from './calendar-rules.js';
import {localDate,parseTags} from './tasks.js';
export const OCCASION_STEPS={
 birthday:[
  {id:'gift',label:'Geschenk besorgen',daysBefore:14,deadlineBefore:2,minutes:45},
  {id:'cake',label:'Kuchen organisieren oder backen',daysBefore:4,deadlineBefore:1,minutes:60},
  {id:'candles',label:'Kerzen besorgen',daysBefore:5,deadlineBefore:1,minutes:15},
  {id:'greetings',label:'Geburtstagsgrüße übermitteln',daysBefore:1,deadlineBefore:0,minutes:5}
 ],
 christmas:[
  {id:'gather',label:'Familienzusammenkunft abstimmen und einladen',daysBefore:49,deadlineBefore:20,minutes:20},
  {id:'gifts',label:'Geschenke auswählen und besorgen',daysBefore:42,deadlineBefore:7,minutes:90},
  {id:'travel',label:'Anreise oder Besuche organisieren',daysBefore:35,deadlineBefore:14,minutes:25},
  {id:'meal',label:'Festessen, Einkauf und Vorbereitung planen',daysBefore:14,deadlineBefore:2,minutes:45},
  {id:'greetings',label:'Weihnachtsgrüße vorbereiten',daysBefore:10,deadlineBefore:1,minutes:20}
 ],
 easter:[
  {id:'gather',label:'Familientreffen zu Ostern vereinbaren',daysBefore:30,deadlineBefore:12,minutes:20},
  {id:'gifts',label:'Ostergeschenke und Kleinigkeiten besorgen',daysBefore:21,deadlineBefore:3,minutes:35},
  {id:'eggs',label:'Eier, Deko oder Osterkörbchen vorbereiten',daysBefore:10,deadlineBefore:2,minutes:45},
  {id:'meal',label:'Osteressen und Einkäufe organisieren',daysBefore:10,deadlineBefore:2,minutes:40},
  {id:'greetings',label:'Ostergrüße übermitteln',daysBefore:1,deadlineBefore:0,minutes:5}
 ]
};
export const OCCASION_LEAD_DAYS=70;
export function shiftDay(day,offset){const date=new Date(`${day}T12:00:00Z`);if(!Number.isFinite(date.getTime()))return '';date.setUTCDate(date.getUTCDate()+offset);return date.toISOString().slice(0,10);}
export function easterSunday(year){
 // Anonymous Gregorian (Meeus/Jones/Butcher) algorithm, valid in 1583–4099.
 if(!Number.isInteger(year)||year<1583||year>4099)throw Error('Invalid year');
 const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
 const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k+700)%7;
 const m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31),day=(h+l-7*m+114)%31+1;
 return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
export function annualHolidays(today=localDate(),leadDays=OCCASION_LEAD_DAYS){
 const year=Number(today.slice(0,4));const end=shiftDay(today,leadDays);const out=[];
 for(let y=year;y<=year+1;y++){
  for(const [kind,date,title,emoji] of [['christmas',`${y}-12-24`,'Weihnachten · Heiligabend','🎄'],['easter',easterSunday(y),'Ostern','🐣']]){
   if(date>=today&&date<=end)out.push({kind,id:`holiday:${kind}:${y}`,date,title,emoji,source:'annual'});
  }
 }
 return out;
}
export function isBirthdayEvent(event,appearance={}){
 if(!event||event.status==='cancelled'||appearance.hidden)return false;
 const title=String(event.summary||'');
 return event.eventType==='birthday'||appearance.ruleId==='birthday'||containsTerm(title,'geburtstag')||containsTerm(title,'birthday')||containsTerm(title,'bday');
}
export function birthdayName(event){return String(event.summary||'Geburtstag').replace(/\s*[-–:]?\s*(?:Geburtstag|Birthday|Bday)\s*(?:von|of)?\s*/ig,' ').replace(/\s+/g,' ').trim()||'Geburtstag';}
export function upcomingOccasions(events=[],appearance=()=>({}),today=localDate(),leadDays=OCCASION_LEAD_DAYS){
 const end=shiftDay(today,leadDays),out=annualHolidays(today,leadDays);
 for(const e of events){
  const a=appearance(e);
  if(!isBirthdayEvent(e,a))continue;
  const date=calendarEventDay(e);if(date<today||date>end)continue;
  out.push({kind:'birthday',id:`birthday:${String(e.id||birthdayName(e))}:${date}`,date,title:birthdayName(e),emoji:'🎂',source:'calendar'});
 }
 return out.sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'de'));
}
export function daysUntil(today,day){return Math.round((Date.parse(day+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000);}
export const occasionStepKey=(occasion,step)=>`${occasion.id}|${step.id}`;
function fnv(str,seed){let hash=seed>>>0;for(let i=0;i<str.length;i++){hash^=str.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');}
export function occasionTaskTag(occasion,step){const s=occasionStepKey(occasion,step);return 'anlass-'+fnv(s,2166136261)+fnv(s,334214467);}
export function relatedOccasionTask(state,occasion,step){const tag=occasionTaskTag(occasion,step);return Object.values(state?.tasks||{}).find(t=>t.tags?.includes(tag));}
export function occasionTask(step,occasion,uuid,customTitle='',today=localDate()){
 if(!OCCASION_STEPS[occasion.kind]?.some(x=>x.id===step.id)&&!/^custom-[0-9a-f-]{36}$/i.test(step.id))throw Error('Unbekannter Anlassschritt');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(occasion.date))throw Error('Ungültiges Anlassdatum');
 const title=(customTitle.trim()||`${step.label} · ${occasion.title}`).slice(0,180);
 const originalPlanned=shiftDay(occasion.date,-step.daysBefore),originalDue=shiftDay(occasion.date,-step.deadlineBefore);
 const planned=originalPlanned<today?today:originalPlanned,due=originalDue<today?today:originalDue;
 return {id:uuid,title,note:`Vorbereitung für ${occasion.title} am ${occasion.date}.`,category:'Familie',completed:false,archived:false,workflow:'next',flagged:false,projectId:null,parentTaskId:null,sortOrder:0,tags:parseTags(['anlass',occasionTaskTag(occasion,step)]),contextTags:[],deferUntil:planned,plannedDate:planned,dueDate:due,estimateMinutes:step.minutes,updatedAt:new Date().toISOString()};
}
export function validCustomStep(step){return Boolean(step&&/^custom-[0-9a-f-]{36}$/i.test(step.id)&&typeof step.label==='string'&&step.label.trim().length>0&&step.label.length<=100&&Number.isInteger(step.daysBefore)&&step.daysBefore>=0&&step.daysBefore<=70&&Number.isInteger(step.deadlineBefore)&&step.deadlineBefore>=0&&step.deadlineBefore<=step.daysBefore&&Number.isInteger(step.minutes)&&step.minutes>=5&&step.minutes<=1440);}
