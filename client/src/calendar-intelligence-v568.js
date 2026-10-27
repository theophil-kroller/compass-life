/** Calendar entries are hints, never evidence that an event was attended or a deadline is binding. */
import {calendarMatchesPerson} from './people-matching.js';
const normalize=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const day=e=>String(e?.start?.date||e?.start?.dateTime||'').slice(0,10);
export const DEADLINE_TERMS=/\b(prufung|klausur|exam|examination|defense|disputation|abgabe|deadline|einreichung|submission|due date|beurteilung|kolloquium|assessment)\b/i;
const clean=s=>normalize(s).replace(/\b(prufung|klausur|exam|deadline|abgabe|einreichung|submission|termin|fur|for|am|der|die|das|zum)\b/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function projectMatchesDeadline(event,projects={}){
 const title=clean(event?.summary||'');
 if(!title)return false;
 const significant=title.split(' ').filter(t=>t.length>=4);
 return Object.values(projects||{}).some(p=>{
  if(!p||p.isTemplate||p.archived||p.status!=='active'&&p.status!=='hold')return false;
  if(p.calendarSourceId&&p.calendarSourceId===event.id)return true;
  const t=clean(p.title);return !!t&&(t===title||(significant.length>0&&significant.some(w=>t.split(' ').includes(w))));
 });
}
export function deadlineSuggestions(events,projects={},dismissed={},today=new Date().toISOString().slice(0,10),horizon=90){
 const upper=new Date(today+'T12:00:00Z');upper.setUTCDate(upper.getUTCDate()+horizon);const until=upper.toISOString().slice(0,10);
 return (Array.isArray(events)?events:[]).filter(e=>e&&e.id&&e.status!=='cancelled'&&day(e)>=today&&day(e)<=until&&DEADLINE_TERMS.test(normalize(e.summary||''))&&!dismissed[e.id]&&!projectMatchesDeadline(e,projects))
  .map(e=>({id:e.id,title:String(e.summary||'').slice(0,180),day:day(e),description:String(e.description||'').slice(0,400)})).sort((a,b)=>a.day.localeCompare(b.day)).slice(0,12);
}
export function contactSuggestions(events,people={},today=new Date().toISOString().slice(0,10),dismissed={}){
 const lower=new Date(today+'T12:00:00Z');lower.setUTCDate(lower.getUTCDate()-75);const from=lower.toISOString().slice(0,10);
 const matches=[];
 for(const e of Array.isArray(events)?events:[]){
  if(!e?.id||e.status==='cancelled'||e.transparency==='transparent'||day(e)>today||day(e)<from||dismissed[e.id])continue;
  for(const p of Object.values(people||{})){
   if(!p?.id||!calendarMatchesPerson(e,p)||Array.isArray(p.contactLog)&&p.contactLog.some(c=>c.sourceEventId===e.id))continue;
   matches.push({id:e.id,personId:p.id,personName:p.name,title:String(e.summary||'').slice(0,180),day:day(e),kind:'meeting'});
  }
 }
 return matches.sort((a,b)=>b.day.localeCompare(a.day)).slice(0,20);
}
