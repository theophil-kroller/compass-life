/** Compass 0.5.77.9 – strictly observational event-level comparisons.
 * Time windows are fixed: 30 min before, entire event, 60 min after.
 * Missing 5-minute Garmin readings are unknown, never imputed or scored zero.
 * All results stay local to the unlocked vault. No causal/medical claims.
 */
import {timedRows} from './stress-context-v5778.js';
const MIN=60000,DAY=/^\d{4}-\d{2}-\d{2}$/;
const validStress=x=>Number.isFinite(x)&&x>=0&&x<=100;
const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:null;
const number=x=>Number(x).toLocaleString('de-AT',{maximumFractionDigits:1});
const html=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shortDay=t=>new Date(t).toLocaleDateString('de-AT',{day:'2-digit',month:'short'});
const clock=t=>new Date(t).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const timeGroup=(row,source)=>{
 const title=String(row.title||'').toLocaleLowerCase('de'),category=String(row.category||'').toLocaleLowerCase('de');
 const is=(re)=>re.test(title);
 // Specific activities precede general classifications. Social visits are not work meetings.
 if(is(/sauna|therme|spa|wellness|dampfbad/))return ['wellness','Sauna & Therme'];
 if(is(/zouk|kizomba|bachata|tanz|dance|salsa|ballett/))return ['dance','Tanzen'];
 if(is(/radfahren|fahrrad|bike|cycling|mtb|wandern|hiking|walk|spazier|joggen|laufen|running|schwimm|swim|training|fitness|gym|sport|bujinkan|yoga|ski/))return ['sports','Sport & Bewegung'];
 if(category==='soziales'||is(/familienzeit|freunde treffen|kaffee mit|brunch mit/))return ['social','Soziale Kontakte'];
 if(source==='calendar'){
  if(is(/vorlesung|lehre|lehrveranstaltung|übung|unterricht|vortrag|prüfung|seminar|teaching/))return ['teaching','Lehre & Unterricht'];
  if(is(/meeting|besprechung|jour fixe|abstimmung|stand.?up|teamrunde|review meeting|termin mit|gespräch|sitzung|call/))return ['meeting','Meetings & Besprechungen'];
  if(is(/forschung|research|literatur|dissertation|doktorat|paper|writing block|schreibblock/))return ['research','Forschung & Schreiben'];
  if(category==='arbeit')return ['work','Arbeitstermine'];
  if(category==='erholung')return ['relax','Erholung'];
  if(category==='freizeit')return ['leisure','Freizeit & Kultur'];
  return ['other-calendar','Weitere Kalendertermine'];
 }
 if(is(/forschung|research|literatur|dissertation|doktorat|paper/))return ['research','Forschung & Schreiben'];
 if(category==='arbeit'||is(/pomodoro|arbeitszeit|fokus|focus|konzentration/))return ['work','Arbeitssessions'];
 if(category==='erholung')return ['relax','Erholung'];
 return [category==='garmin-training'?'sports':'other-activity',category==='garmin-training'?'Sport & Bewegung':'Weitere Aktivitäten'];
};
export const stressPatternType=(event,source)=>timeGroup(event,source);
function stressPoints(model){
 const byTime=new Map();
 for(const day of model?.stressDays||[])for(const p of day?.points||[]){
  if(!validStress(p.stress))continue;
  const at=Date.parse(p.at);if(!Number.isFinite(at))continue;
  byTime.set(at,p.stress); // identical measurements from re-imports never double count
 }
 return [...byTime].map(([time,value])=>({time,value})).sort((a,b)=>a.time-b.time);
}
function firstIndex(rows,time){let lo=0,hi=rows.length;while(lo<hi){const mid=(lo+hi)>>1;if(rows[mid].time<time)lo=mid+1;else hi=mid;}return lo;}
function windowSample(points,start,end){
 if(end<=start)return {avg:null,count:0,high:null};
 let n=0,sum=0,high=0;
 for(let i=firstIndex(points,start);i<points.length&&points[i].time<end;i++){n++;sum+=points[i].value;if(points[i].value>75)high++;}
 return {avg:n>=2?sum/n:null,count:n,high:n>=2?high/n:null};
}
const averageProperty=(items,field)=>mean(items.map(x=>x[field]).filter(Number.isFinite));
const round=n=>Number.isFinite(n)?Math.round(n*10)/10:null;
function summarizeGroup(g){
 const events=g.events;
 const available=field=>events.filter(e=>Number.isFinite(e[field]?.avg));
 const pairedBeforeAfter=events.filter(e=>Number.isFinite(e.before.avg)&&Number.isFinite(e.after.avg));
 const pairedBeforeDuring=events.filter(e=>Number.isFinite(e.before.avg)&&Number.isFinite(e.during.avg));
 const pairedDuringAfter=events.filter(e=>Number.isFinite(e.during.avg)&&Number.isFinite(e.after.avg));
 const observedDuring=available('during');
 const days=new Set(pairedBeforeAfter.map(e=>new Date(e.start).toLocaleDateString('sv-SE')));
 const delta=round(averageProperty(pairedBeforeAfter.map(e=>({delta:e.after.avg-e.before.avg})),'delta'));
 return {id:g.id,label:g.label,source:g.source,events:events.length,days:new Set(events.map(e=>new Date(e.start).toLocaleDateString('sv-SE'))).size,
  beforeN:available('before').length,duringN:observedDuring.length,afterN:available('after').length,
  avgDuring:round(averageProperty(observedDuring.map(e=>({value:e.during.avg})),'value')),
  highDuring:observedDuring.length?round(100*averageProperty(observedDuring.map(e=>({share:e.during.high})),'share')):null,
  beforeAfterN:pairedBeforeAfter.length,completeN:events.filter(e=>Number.isFinite(e.before.avg)&&Number.isFinite(e.during.avg)&&Number.isFinite(e.after.avg)).length,
  beforeDuringN:pairedBeforeDuring.length,duringAfterN:pairedDuringAfter.length,
  pairedBefore:round(averageProperty(pairedBeforeAfter.map(e=>({value:e.before.avg})),'value')),
  pairedAfter:round(averageProperty(pairedBeforeAfter.map(e=>({value:e.after.avg})),'value')),
  delta,trendReady:pairedBeforeAfter.length>=3&&days.size>=2,
  recent:events.slice().sort((a,b)=>b.start-a.start).slice(0,3).map(e=>({title:e.title,start:e.start,before:round(e.before.avg),during:round(e.during.avg),after:round(e.after.avg),uncertain:e.uncertain})),
  uncertain:events.some(e=>e.uncertain)};
}
export function buildStressPatterns({model,calendarEvents=[],activities=[],garminSessions=[],calendarCoverage=null,rules=[],overrides={}}={}){
 const points=stressPoints(model);
 const contexts=timedRows(calendarEvents,activities,garminSessions,rules,overrides);
 const groups=new Map();let excludedCalendar=0,unmeasured=0,usable=0;
 if(!points.length)return {groups:[],points:0,events:0,excludedCalendar:0,unmeasured:0,usable:0,calendarCoverage};
 const startRange=points[0].time,endRange=points.at(-1).time;
 for(const [source,events] of [['calendar',contexts.calendarRows],['activity',contexts.activityRows]]){
  for(const e of events){
   if(source==='calendar'&&e.generic)continue; // A generic Work block is not a concrete observed event.
   if(e.start>endRange+30*MIN||e.end<startRange-60*MIN)continue;
   // Do not compare overnight blocks or implausible tiny sessions as if they were one activity.
   if(e.end-e.start<10*MIN||e.end-e.start>8*60*MIN)continue;
   if(source==='calendar'){
    const from=new Date(e.start),to=new Date(e.end-1);
    const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const covered=calendarCoverage?.complete!==false&&DAY.test(calendarCoverage?.start||'')&&DAY.test(calendarCoverage?.end||'')&&iso(from)>=calendarCoverage.start&&iso(to)<=calendarCoverage.end;
    if(!covered){excludedCalendar++;continue;}
   }
   const before=windowSample(points,e.start-30*MIN,e.start);
   const during=windowSample(points,e.start,e.end);
   const after=windowSample(points,e.end,e.end+60*MIN);
   if(![before,during,after].some(x=>Number.isFinite(x.avg))){unmeasured++;continue;}
   usable++;
   const [id,label]=timeGroup(e,source),key=source+'|'+id;
   if(!groups.has(key))groups.set(key,{id,label,source,events:[]});
   groups.get(key).events.push({...e,before,during,after});
  }
 }
 const summary=[...groups.values()].map(summarizeGroup).sort((a,b)=>a.source.localeCompare(b.source)||b.events-a.events||a.label.localeCompare(b.label,'de'));
 return {groups:summary,points:points.length,events:contexts.calendarTotal+contexts.activityTotal,excludedCalendar,unmeasured,usable,calendarCoverage};
}
const value=n=>Number.isFinite(n)?number(n):'–';
const signed=n=>Number.isFinite(n)?`${n>0?'+':''}${number(n)} Punkte`:'–';
const oneGroup=g=>{
 const enough=g.trendReady;
 const label=(g.source==='calendar'?'📅 ':'🏃 ')+g.label;
 return `<article class="stress-pattern-card"><div class="stress-pattern-card-head"><strong>${html(label)}</strong><span>${number(g.events)} Ereignisse</span></div>
 <div class="stress-pattern-kpis"><div><small>Während · Ø Garmin-Stress</small><strong>${value(g.avgDuring)}</strong><small>${number(g.duringN)} Ereignisse mit Messungen</small></div><div><small>Hohe Punkte währenddessen</small><strong>${Number.isFinite(g.highDuring)?value(g.highDuring)+' %':'–'}</strong><small>nur gemessene Phasen</small></div><div><small>Vorher → Nachher</small><strong>${signed(g.delta)}</strong><small>${number(g.beforeAfterN)} gepaarte Ereignisse</small></div></div>
 ${g.beforeAfterN?`<div class="stress-pattern-pair"><span>30 Min. davor <b>${value(g.pairedBefore)}</b></span><span aria-hidden="true">→</span><span>60 Min. danach <b>${value(g.pairedAfter)}</b></span></div>`:'<p class="stress-pattern-caution">Für einen Vergleich vor/nach diesen Ereignissen fehlen zeitlich gepaarte Garmin-Messungen.</p>'}
 <p class="stress-pattern-caution">${enough?`Wiederholt beobachtet an ${number(g.days)} Ereignistagen; ein Zusammenhang, keine nachgewiesene Wirkung.`:`${number(g.beforeAfterN)} Vorher-/Nachher-Paare. Für eine wiederholte Beobachtung benötigen wir mindestens 3 Ereignisse an 2 verschiedenen Tagen.`}${g.uncertain?' Bei einem Garmin-CSV-Eintrag ist die Uhrzeit möglicherweise ungenau.':''}</p>
 <details><summary>Einzelne Zeitfenster ansehen</summary><ul>${g.recent.map(e=>`<li><strong>${html(e.title)}</strong><small>${html(shortDay(e.start))} ${html(clock(e.start))} · davor ${value(e.before)} · während ${value(e.during)} · danach ${value(e.after)}${e.uncertain?' · Uhrzeit unsicher':''}</small></li>`).join('')}</ul></details></article>`;
};
export function stressPatternsView(result){
 const groups=result?.groups||[];
 const ranked=groups.slice().sort((a,b)=>Number(b.trendReady)-Number(a.trendReady)||b.beforeAfterN-a.beforeAfterN||b.duringN-a.duringN||b.events-a.events||a.label.localeCompare(b.label,'de'));
 const evidence=ranked.filter(g=>g.trendReady&&Number.isFinite(g.delta));
 const signals=evidence.slice(0,3).map(g=>{
  const tendency=g.delta<0?'niedriger':g.delta>0?'höher':'ähnlich';
  const line=`Nach ${html(g.label)} lagen deine gemessenen Werte im 60-Minuten-Fenster im Mittel ${html(number(Math.abs(g.delta)))} Garmin-Punkte ${tendency} als in den 30 Minuten davor.`;
  return `<li><strong>${g.source==='calendar'?'📅':'🏃'} ${html(g.label)}</strong><p>${line}</p><small>${number(g.beforeAfterN)} vollständig gepaarte Termine an mindestens 2 Tagen · Beobachtung, keine Ursache.</small></li>`;
 }).join('');
 const headings=groups.length?`${evidence.length?`<div class="stress-pattern-summary"><h4>Wiederkehrende Beobachtungen</h4><ul>${signals}</ul></div>`:`<p class="stress-pattern-empty">Noch keine belastbaren wiederkehrenden Muster: Dafür brauchen wir mindestens 3 vergleichbare Ereignisse an 2 verschiedenen Tagen. Die vorhandenen Einzelfälle sind unten einsehbar.</p>`}`:'<p class="stress-pattern-empty">Noch keine zeitlich verknüpfbaren Einträge. Prüfe die Kalenderabdeckung und importierte Garmin-Aktivitäten.</p>';
 const groupsOf=(source)=>ranked.filter(x=>x.source===source);
 const cards=(items)=>items.length?`<div class="stress-pattern-grid">${items.map(oneGroup).join('')}</div>`:'<p>Für diese Datenquelle fehlen noch auswertbare Ereignisse.</p>';
 const featured=ranked.slice(0,3),other=ranked.slice(3);
 const coverage=result.excludedCalendar?` ${number(result.excludedCalendar)} Kalendereinträge lagen außerhalb des vollständig synchronisierten Zeitraums.`:'';
 const missing=result.unmeasured?` ${number(result.unmeasured)} Ereignisse hatten keine ausreichenden Garmin-Messwerte im zeitlichen Umfeld.`:'';
 return `<section class="stress-patterns" aria-label="Persönliche Stressmuster nach Kalender und Aktivitäten"><div class="stress-context-heading"><div><small>05 · PERSONAL INTELLIGENCE · LOKAL</small><h3>Was fällt bei meinen Aktivitäten wiederholt auf?</h3></div><span class="stress-context-chip">${number(result.usable||0)} verknüpfte Ereignisse</span></div>
  <p class="stress-context-intro">Für gleiche Arten von Terminen vergleichen wir <strong>30 Minuten vor</strong>, <strong>währenddessen</strong> und <strong>60 Minuten nach</strong> einem Ereignis. Jeder Termin zählt einmal, nicht jeder einzelne Messpunkt. Ergebnisse sind nur Beobachtungen, keine Ursachenanalyse.</p>
  ${headings}
  ${featured.length?`<h4>Vergleichbare Ereignisarten</h4>${cards(featured)}`:''}
  ${other.length?`<details class="stress-pattern-more"><summary>${other.length} weitere Ereignisarten anzeigen (Kalender & Aktivitäten)</summary>${cards(other)}</details>`:''}
  ${!groups.length?'<p class="stress-pattern-empty">Kalendertermine und Garmin-Aktivitäten kannst du nach vollständiger Synchronisierung miteinander vergleichen.</p>':''}
  <p class="insight-figure-note">${coverage}${missing} Garmin erfasst körperliche Stressreaktionen, keine Gefühle. Fehlende Werte werden nicht geschätzt. Ein Kalendereintrag bestätigt keine Teilnahme. Zeitliche Muster sind kein Nachweis einer Wirkung.</p>
 </section>`;
}
