/** Compass .59.37: local, opt-in family learning suggestions.
 * No calendar writes or automatic GTD tasks. A cached but stale calendar is
 * useful for dates, not proof of available time slots.
 */
import {familyEvents,familyRules,familyKind} from './family-radar-v5775931.js';
import {capacityForecast} from './capacity-engine-v44.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isoDay=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T12:00:00Z'));
const shift=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const days=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const pretty=d=>new Date(d+'T12:00:00Z').toLocaleDateString('de-AT',{weekday:'short',day:'numeric',month:'short'});
const rangeLabel=e=>{const a=e.day,b=e.endDay||e.day;return b>a?`${pretty(a)} – ${pretty(b)}`:pretty(a);};
const clock=ms=>new Date(ms).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'});
export function familyForecastEntries37(events,people,state,{today=new Date().toISOString().slice(0,10),horizon=21}={}){
 if(!isoDay(today))return [];
 const out=[];
 for(const person of Object.values(people||{})){
  if(!familyRules(state,person).enabled)continue;
  for(const e of familyEvents(events,person,{today,horizon}))if(['exam','deadline','project'].includes(e.kind)){
   out.push({...e,endDay:(e.event?.end?.date?shift(e.event.end.date,-1):String(e.event?.end?.dateTime||e.day).slice(0,10)),daysLeft:days(today,e.day)});
  }
 }
 // The local mobile vault can have the calendar before contact profiles arrive.
 // Known child prefixes are informational only; never infer adulthood/kinship
 // for any other person. An explicit profile opt-out always wins.
 const prefixes={nathanael:'Nathanael',nathaniel:'Nathanael',seraphina:'Seraphina'};
 const profiles=Object.values(people||{});
 const knownProfiles=new Set(profiles.flatMap(p=>[String(p.name||'').trim().toLocaleLowerCase('de').split(' ')[0],...String(p.aliases||'').split(/[,;\n]/).map(v=>v.trim().toLocaleLowerCase('de'))]));
 const knownEvents=new Set(out.map(e=>e.id));
 for(const e of Array.isArray(events)?events:[]){
  if(!e?.id||e.status==='cancelled'||knownEvents.has(e.id))continue;
  const m=String(e.summary||'').match(/^\s*(nathanael|nathaniel|seraphina)\s*:\s*(.+)/i);if(!m)continue;
  const prefix=m[1].toLocaleLowerCase('de');if(knownProfiles.has(prefix))continue;
  const examDay=String(e.start?.date||e.start?.dateTime||'').slice(0,10);
  if(!isoDay(examDay)||examDay<today||days(today,examDay)>horizon)continue;
  const kind=familyKind(m[2]);if(!['exam','deadline','project'].includes(kind))continue;
  out.push({id:e.id,personId:null,personName:prefixes[prefix],title:m[2],day:examDay,endDay:e.end?.date?shift(e.end.date,-1):examDay,kind,daysLeft:days(today,examDay),linkedReminders:[],event:e});
 }
 return out.sort((a,b)=>a.daysLeft-b.daysLeft||a.personName.localeCompare(b.personName,'de')).slice(0,8);
}
export function familyStudySlots37(events,event,coverage,updatedAt,{now=new Date(),today=null,limit=3,familyRadar=null}={}){
 const date=today||[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 if(!event||event.kind!=='exam'||!isoDay(date)||!isoDay(event.day)||event.day<=date)return {status:'no-exam',slots:[]};
 // A stale or incomplete Google Calendar archive must never imply actual availability.
 const span=Math.min(14,days(date,event.day));
 // Known household rhythm: not a claim that Nathanael is present on a given day.
 const nathanael=/^natha(?:na|ni)el(?:\b|\s)/i.test(String(event.personName||''));
 const saved=familyRadar?.availability?.[event.personId]||{};
 const arrival=Number.isInteger(saved.arrivalHour)&&saved.arrivalHour>=17&&saved.arrivalHour<=21?saved.arrivalHour:19;
 const football=Number.isInteger(saved.footballMinutes)&&saved.footballMinutes>=0&&saved.footballMinutes<=120?saved.footballMinutes:45;
 const transition=15;
 const earliest=nathanael?Math.max(19*60+30,arrival*60+football+transition):16*60;
 const latest=nathanael?21*60+30:20*60;
 const weekdays=Array.isArray(saved.weekdays)?saved.weekdays.filter(n=>Number.isInteger(n)&&n>=0&&n<=6):[];
 const fore=capacityForecast({events,connected:!!coverage?.complete,coverage,updatedAt,now,startDay:date,days:span,
  settings:{startHour:nathanael?19:16,endHour:nathanael?22:20,bufferMinutes:15,minSlotMinutes:45,weekends:true,availabilityTitles:'__no_availability_block__'}});
 if(fore.status!=='ready')return {status:fore.status,slots:[]};
 const slots=[],seen=new Set();
 for(const s of fore.slots){
  if(s.day>=event.day||seen.has(s.day)||fore.days.find(d=>d.day===s.day)?.allDayBusy)continue;
  if(weekdays.length&&!weekdays.includes(new Date(s.day+'T12:00:00').getDay()))continue;
  const dayStart=new Date(s.day+'T00:00:00').getTime();
  const preferred=nathanael?20*60:16*60;
  const offset=Math.max(earliest,preferred);
  const candidate=Math.max(s.start,dayStart+offset*60000);
  if(candidate+45*60000>s.end||candidate+45*60000>dayStart+latest*60000)continue;
  slots.push({day:s.day,start:candidate,end:candidate+45*60000,minutes:45,at:clock(candidate),until:clock(candidate+45*60000),attendanceUnverified:!weekdays.length&&nathanael});
  seen.add(s.day);if(slots.length>=limit)break;
 }
 return {status:'ready',slots};
}
export function familyCreateStudy37(state,event,person,slot,{today,uuid}={}){
 if(!state||!event||event.kind!=='exam'||!person||!familyRules(state,person).enabled||!slot||!isoDay(slot.day)||slot.day>=event.day||slot.day<today||typeof uuid!=='function')return {reason:'invalid',created:null};
 const key=`${person.id}::${event.id}::learning::${slot.day}`;
 if(state.familyRadar?.decisions?.[key]?.status==='accepted'||Object.values(state.tasks||{}).some(t=>!t.archived&&t.familyRadarKey===key))return {reason:'existing',created:null};
 const task={id:uuid(),title:`Mit ${person.name} für ${event.title} lernen`,note:`Family Radar · Vorschlag für ${slot.day} um ${slot.at} (45 Minuten). Freie Zeit nur aus kürzlich aktualisiertem Kalender geschätzt; kein Google-Termin gebucht.`,category:'Familie',completed:false,archived:false,workflow:'next',flagged:false,projectId:null,personId:person.id,tags:['familie',String(person.tag||person.name).toLocaleLowerCase('de').replace(/^#/,'').replace(/[^\p{L}\p{N}-]/gu,'').slice(0,31)].filter(Boolean),contextTags:[],plannedDate:slot.day,dueDate:null,estimateMinutes:45,familyRadarKey:key,calendarSourceId:event.id,sortOrder:0};
 state.tasks??={};state.taskPending??={};state.familyRadar??={};state.familyRadar.decisions??={};
 state.tasks[task.id]=task;state.taskPending[task.id]=true;
 state.familyRadar.decisions[key]={status:'accepted',at:today,updatedAt:new Date().toISOString(),taskIds:[task.id],eventId:event.id};
 return {reason:null,created:task};
}
export function familyForecastPanel37(entries,events,state,{selectedId='',coverage=null,updatedAt=0,now=new Date(),today}={}){
 if(!entries.length)return '';
 const selected=entries.find(e=>e.id===selectedId);
 const planned=selected?familyStudySlots37(events,selected,coverage,updatedAt,{now,today,familyRadar:state?.familyRadar}):null;
 const reason={disconnected:'Keine gespeicherte Kalenderabdeckung.',partial:'Der Kalender ist für den Zeitraum nicht vollständig abgeglichen.',stale:'Der letzte Kalenderabgleich ist älter als zwei Stunden.', 'no-exam':'Für diesen Termin werden keine Lernfenster vorgeschlagen.'};
 const extra=selected?`<div class="fr37-study"><strong>Lernfenster · ${esc(selected.personName)} · ${esc(selected.title)}</strong><p>Unverbindliche 45-Minuten-Vorschläge. ${/^natha(?:na|ni)el/i.test(selected.personName)?'Abendregel: Ankunft ab 19 Uhr, 45 Min. Fußball + 15 Min. Pause, Lernen bevorzugt ab 20 Uhr und Ende bis 21:30 Uhr. Ob Nathanael an diesem Tag da ist, bitte prüfen.':''} Erst nach Bestätigung wird eine Aufgabe erstellt; keine Google-Kalenderbuchung.</p>${planned.status==='ready'?(planned.slots.length?`<div class="fr37-options">${planned.slots.map(s=>`<button type="button" data-action="fr37-book" data-id="${esc(selected.id)}" data-day="${esc(s.day)}" data-step="${esc(String(s.start))}">${esc(pretty(s.day))} · ${esc(s.at)}–${esc(s.until)} <span>Als GTD-Aufgabe vormerken</span></button>`).join('')}</div>`:'<small>Keine passenden 45-Minuten-Lücken vor der Prüfung gefunden.</small>'):`<p class="fr37-unverified">${esc(reason[planned.status]||'Aktuell keine verifizierbaren freien Zeiten.')} <button type="button" data-action="calendar-connect">Google-Kalender aktualisieren</button></p>`}</div>`:'';
 return `<section class="work-card fr37-forecast" aria-label="Familienfristen im Forecast"><header><strong>◉ Familie · kommende Prüfungen und Fristen</strong><small>Kalendercache · nur lesend</small></header><div class="fr37-list">${entries.map(e=>`<div class="fr37-row"><span class="fr37-date">${esc(rangeLabel(e))}</span><div><strong>${esc(e.personName)} · ${esc(e.title)}</strong><small>${e.daysLeft===0?'Heute':`In ${e.daysLeft} Tagen`} · ${esc(({exam:'Schularbeit',deadline:'Frist',project:'Schulprojekt'})[e.kind])}</small></div>${e.kind==='exam'&&e.personId?`<button type="button" data-action="fr37-open" data-id="${esc(e.id)}">${selectedId===e.id?'Schließen':'Lernfenster prüfen'}</button>`:''}</div>`).join('')}</div>${extra}</section>`;
}
/** Resolve explicit device E2EE conflicts by timestamp, not insertion order.
 * Equal legacy records fall back to a deterministic comparison, never delete data.
 */
export function mergeFamilyRadar37(a,b){
 const left=a&&typeof a==='object'?a:{},right=b&&typeof b==='object'?b:{};
 function merge(x,y){const out={};for(const id of new Set([...Object.keys(x||{}),...Object.keys(y||{})])){
  if(id==='__proto__'||id==='constructor'||id==='prototype')continue;
  const v=x?.[id],w=y?.[id];if(!v){out[id]=w;continue;}if(!w){out[id]=v;continue;}
  const at=String(v.updatedAt||v.at||''),bt=String(w.updatedAt||w.at||'');
  out[id]=at===bt?(JSON.stringify(v)>=JSON.stringify(w)?v:w):(at>bt?v:w);
 }return out;}
 return {rules:merge(left.rules,right.rules),decisions:merge(left.decisions,right.decisions),availability:merge(left.availability,right.availability)};
}
