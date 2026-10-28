/** CompassWatch 0.5.12.5 – minimal projections from the unlocked vault. */
const dayFromEvent=(event,localDateFor)=>{
 const date=event?.start?.date;if(/^\d{4}-\d{2}-\d{2}$/.test(date||''))return date;
 if(event?.start?.dateTime)return localDateFor(event.start.dateTime);
 return '';
};
const stripSchoolTitle=title=>{
 const raw=String(title||'').trim();
 // Named entries are deliberately required: no unrelated person's schoolwork.
 const head=/^(?:nathanael(?:\s+kroller)?|nathaniel|nataniel|n)[\s:–-]+(.+)$/i.exec(raw);
 const tail=/^(.+?)\s*[\(\[–-]\s*(?:nathanael|nathaniel|nataniel)\s*[\)\]]?$/i.exec(raw);
 const body=head?.[1]||tail?.[1]||'';
 if(!/\b(?:schularbeit|schulaufgabe|klausur|prüfung|pruefung|test|referat|matura|prüfungstermin)\b/i.test(body))return '';
 return body.trim();
};
/** For the next 10 dates; handles all-day calendar events. */
export function schoolDeadlinesForWatch(events,day,localDateFor){
 const last=new Date(Date.parse(day+'T12:00:00Z')+10*86400000).toISOString().slice(0,10);
 const seen=new Set(),result=[];
 for(const e of events||[]){
  if(e?.status==='cancelled')continue;
  const body=stripSchoolTitle(e.summary),date=dayFromEvent(e,localDateFor);
  if(!body||date<day||date>=last)continue;
  const title='N: '+body.slice(0,65);
  const key=date+'|'+body.toLocaleLowerCase('de').replace(/\s+/g,' ');
  if(!seen.has(key)){seen.add(key);result.push({date,title});}
 }
 return result.sort((a,b)=>a.date.localeCompare(b.date)).slice(0,16);
}
function words(s){return String(s||'').normalize('NFKC').toLocaleLowerCase('de').replace(/[^a-z0-9äöüß]+/g,' ').trim();}
/** Full name only; avoid false positives for common first names in meetings. */
export function colleagueMeetingRank(person,events,day,afterMinute=0){
 const full=words(person.name);
 if(full.length<7||full.split(' ').length<2)return 100000;
 for(const e of events||[]){
  if(!e?.start||!e?.title||e.end<=e.start)continue;
  const minute=Number(e.start.slice(0,2))*60+Number(e.start.slice(3,5));
  if(minute>=afterMinute&&(' '+words(e.title)+' ').includes(' '+full+' '))return minute;
 }
 return 100000;
}
/** No manual per-person approval; only explicitly classified work colleagues. */
export function colleaguesForWatch(people,agendaIndex,calendarEvents,day,afterMinute=0){
 const entries=[];
 for(const person of people||[]){
  if(person?.relationKind!=='colleague'||!person?.id||!person?.name)continue;
  const agenda=agendaIndex.get(person.id)||{tasks:[],inbox:[]};
  const points=[...(agenda.tasks||[]),...(agenda.inbox||[])]
   .map(t=>String(t?.title||'').trim()).filter(Boolean).slice(0,4).map(t=>t.slice(0,65));
  entries.push({name:String(person.name).slice(0,55),points,rank:colleagueMeetingRank(person,calendarEvents,day,afterMinute)});
 }
 return entries.sort((a,b)=>a.rank-b.rank||b.points.length-a.points.length||a.name.localeCompare(b.name,'de'))
  .slice(0,24).map(({name,points})=>({name,points}));
}
