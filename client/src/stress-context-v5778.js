/** Compass 0.5.77.8 — local-only observational joins of Garmin's 5-min stress
 * samples with real, time-bounded calendar items and recorded activities.
 * Overlap is not proof of attendance, causation or psychological distress.
 */
import {classifyCalendarEvent} from './calendar-rules.js';
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const MIN=60000;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n||0).toLocaleString('de-AT');
const localDay=ms=>{const d=new Date(ms);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const shortDay=day=>new Date(day+'T12:00:00').toLocaleDateString('de-AT',{day:'numeric',month:'short'});
const clock=ms=>new Date(ms).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const STRESS_BANDS=[{id:'rest',label:'Ruhe',lo:0,hi:25},{id:'low',label:'Niedrig',lo:26,hi:50},{id:'medium',label:'Mittel',lo:51,hi:75},{id:'high',label:'Hoch',lo:76,hi:100}];
export const stressBand=value=>!Number.isFinite(value)||value<0||value>100?null:value<=25?'rest':value<=50?'low':value<=75?'medium':'high';
function timedRows(calendarEvents,activities,garminSessions,rules,overrides){
 const events=[],sessions=[],seenEvents=new Set(),seenSessions=new Set();
 for(const e of calendarEvents||[]){
  if(!e||e.status==='cancelled'||!e.start?.dateTime||!e.end?.dateTime)continue;
  const start=Date.parse(e.start.dateTime),end=Date.parse(e.end.dateTime);
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end-start>24*60*MIN)continue;
  const id=String(e.id||e.iCalUID||e.summary||'')+'|'+start;
  if(seenEvents.has(id))continue;seenEvents.add(id);
  const appearance=classifyCalendarEvent(e,rules,overrides);
  if(appearance.hidden)continue;
  events.push({start,end,title:String(appearance.displayTitle||e.summary||'Kalendereintrag').slice(0,150),category:appearance.category||'Neutral',source:'calendar'});
 }
 for(const a of activities||[]){
  if(!a||a.deleted||!Number.isFinite(a.durationMinutes)||a.durationMinutes<=0||a.durationMinutes>1440)continue;
  // Compass activities have a device-local timestamp with no offset.
  if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(a.startedAt||''))continue;
  const start=Date.parse(a.startedAt),end=start+a.durationMinutes*MIN;
  if(!Number.isFinite(start))continue;
  const key='personal|'+String(a.id||a.title)+'|'+start;
  if(seenSessions.has(key))continue;seenSessions.add(key);
  sessions.push({start,end,title:String(a.title||'Aktivität').slice(0,150),category:String(a.category||'Aktivität'),source:'tracked'});
 }
 for(const s of garminSessions||[]){
  if(!s||!Number.isFinite(s.durationMinutes)||s.durationMinutes<=0||s.durationMinutes>1440||typeof s.start!=='string')continue;
  // Garmin FIT = absolute instant; Activities.csv = explicitly unzoned local wall-clock time.
  if(s.localTimeNoOffset&&!/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(s.start))continue;
  const start=Date.parse(s.start),end=start+s.durationMinutes*MIN;
  if(!Number.isFinite(start))continue;
  // De-duplicate nearly identical Garmin sport sessions from overlapping imports.
  if(sessions.some(a=>a.source==='garmin'&&Math.abs(a.start-start)<2*MIN&&Math.abs(a.end-end)<5*MIN))continue;
  const name=String(s.title||s.activityType||({1:'Laufen',2:'Radfahren',5:'Schwimmen',11:'Gehen',17:'Wandern',19:'Krafttraining'}[s.sport]||'Garmin-Training')).slice(0,150);
  sessions.push({start,end,title:name,category:'Garmin-Training',source:'garmin',uncertain:!!s.localTimeNoOffset});
 }
 // Group by calendar days in the device's timezone; boundaries can cross midnight.
 const index=list=>{const byDay=new Map();for(const e of list){const days=[localDay(e.start),localDay(Math.max(e.start,e.end-1))];for(const day of new Set(days)){
   if(!byDay.has(day))byDay.set(day,[]);byDay.get(day).push(e);
  }}return byDay;};
 return {calendar:index(events),activity:index(sessions),calendarTotal:events.length,activityTotal:sessions.length,activityCsvUnzoned:sessions.some(s=>s.uncertain)};
}
function coverageIncludes(coverage,day){return !!(coverage?.complete!==false&&DAY.test(coverage?.start||'')&&DAY.test(coverage?.end||'')&&day>=coverage.start&&day<=coverage.end);}
const topEntries=map=>[...map.values()].sort((a,b)=>b.count-a.count||a.title.localeCompare(b.title,'de')).slice(0,4);
export function buildStressContext({model,calendarEvents=[],activities=[],garminSessions=[],calendarCoverage=null,rules=[],overrides={}}={}){
 const rows=model?.stressDays||[],indexed=timedRows(calendarEvents,activities,garminSessions,rules,overrides),bins=Object.fromEntries(STRESS_BANDS.map(z=>[z.id,{...z,count:0,calendarCount:0,activityCount:0,covered:0,calendarLabels:new Map(),activityLabels:new Map()}]));
 const high=[],scanned=[];let first='',last='',incompleteDays=0,knownDays=0;
 for(const d of rows){const covered=coverageIncludes(calendarCoverage,d.day);if(covered)knownDays++;else incompleteDays++;
  for(const p of d.points||[]){const zone=stressBand(p.stress);if(!zone)continue;
   const t=Date.parse(p.at);if(!Number.isFinite(t))continue;
   const bucket=bins[zone];bucket.count++;if(covered)bucket.covered++;
   const calendarHits=(indexed.calendar.get(d.day)||[]).filter(e=>e.start<t+5*MIN&&e.end>t);
   const activityHits=(indexed.activity.get(d.day)||[]).filter(e=>e.start<t+5*MIN&&e.end>t);
   if(calendarHits.length){bucket.calendarCount++;for(const e of calendarHits){const key=e.category+'|'+e.title,entry=bucket.calendarLabels.get(key)||{title:e.title,category:e.category,count:0};entry.count++;bucket.calendarLabels.set(key,entry);}}
   if(activityHits.length){bucket.activityCount++;for(const a of activityHits){const key=a.category+'|'+a.title,entry=bucket.activityLabels.get(key)||{title:a.title,category:a.category,count:0};entry.count++;bucket.activityLabels.set(key,entry);}}
   if(zone==='high')high.push({t,day:d.day,stress:p.stress,covered,calendar:calendarHits.map(x=>({title:x.title,category:x.category})),activities:activityHits.map(x=>({title:x.title,category:x.category,uncertain:x.uncertain}))});
   if(!first||d.day<first)first=d.day;if(!last||d.day>last)last=d.day;
  }
 }
 // Group adjacent high 5-minute buckets into stress episodes, so no repetitive peak rows.
 high.sort((a,b)=>a.t-b.t);const episodes=[];
 for(const point of high){const latest=episodes.at(-1);if(!latest||point.day!==latest.day||point.t-latest.end>15*MIN){episodes.push({start:point.t,end:point.t,day:point.day,peak:point.stress,points:1,calendar:new Map(),activities:new Map(),covered:point.covered});}
 else{latest.end=point.t;latest.peak=Math.max(latest.peak,point.stress);latest.points++;latest.covered=latest.covered&&point.covered;}
 const current=episodes.at(-1);
 for(const e of point.calendar)current.calendar.set(e.category+'|'+e.title,e);
 for(const a of point.activities)current.activities.set(a.category+'|'+a.title,a);
 }
 const recentPeaks=episodes.sort((a,b)=>b.start-a.start).slice(0,12).map(e=>({...e,calendar:[...e.calendar.values()].slice(0,5),activities:[...e.activities.values()].slice(0,5)}));
 return {bands:STRESS_BANDS.map(z=>({...bins[z.id],calendar:topEntries(bins[z.id].calendarLabels),activities:topEntries(bins[z.id].activityLabels),calendarLabels:undefined,activityLabels:undefined})),recentPeaks,episodesCount:episodes.length,range:{first,last},calendarCoverage,knownDays,incompleteDays,activityCsvUnzoned:indexed.activityCsvUnzoned,activityTotal:indexed.activityTotal,calendarTotal:indexed.calendarTotal};
}
/** Render in the existing Stress page below the Raincloud chart. */
export function stressContextView(result){
 const bands=result.bands||[],total=bands.reduce((s,b)=>s+b.count,0);
 if(!total)return `<section class="stress-context" aria-label="Stress im Kontext"><h3>Was war bei meinen Stresswerten los?</h3><p>Keine gültigen Garmin-Stressmessungen im ausgewählten Zeitraum.</p></section>`;
 const list=(entries,type)=>entries.length?`<ul>${entries.map(e=>`<li><span>${esc(e.title)}</span><small>${esc(e.category)} · ${fmt(e.count)} Messpunkte mit zeitlicher Überschneidung</small></li>`).join('')}</ul>`:`<p class="stress-context-empty">${type==='calendar'?'Keine zeitgleichen Einträge in den geladenen Kalenderdaten':'Keine zeitgleich dokumentierten Aktivitäten'}.</p>`;
 const sections=bands.map(b=>`<article class="stress-context-zone" data-zone="${b.id}"><header><strong>${esc(b.label)} <small>${b.lo}–${b.hi}</small></strong><span>${fmt(b.count)} Messpunkte · ${total?Math.round(100*b.count/total):0} %</span></header><div class="stress-context-columns"><div><h4>Kalender</h4><p>${fmt(b.calendarCount)} von ${fmt(b.count)} Messpunkten mit Kalenderüberschneidung · ${fmt(b.covered)} Punkte im vollständig geladenen Kalenderfenster</p>${list(b.calendar,'calendar')}</div><div><h4>Aktivitäten</h4><p>${fmt(b.activityCount)} von ${fmt(b.count)} Messpunkten zeitgleich zu einer dokumentierten Aktivität</p>${list(b.activities,'activity')}</div></div></article>`).join('');
 const peaks=result.recentPeaks.map(p=>`<div class="stress-context-peak"><div><strong>${esc(shortDay(p.day))} · ${esc(clock(p.start))}${p.end>p.start?'–'+esc(clock(p.end+5*MIN)):''}</strong><span>Spitzenwert ${fmt(p.peak)} · ${fmt(p.points)} Messpunkte</span></div><div class="stress-context-peak-tags">${p.calendar.length?p.calendar.map(e=>`<span>📅 ${esc(e.title)}</span>`).join(''):(p.covered?'<small>📅 Kein zeitgleicher Kalendereintrag</small>':'<small>📅 Kalenderabdeckung fehlt</small>')}${p.activities.length?p.activities.map(a=>`<span>🏃 ${esc(a.title)}${a.uncertain?' (Uhrzeit unsicher)':''}</span>`).join(''):'<small>🏃 Keine dokumentierte Aktivität zur selben Zeit</small>'}</div></div>`).join('');
 const missing=result.incompleteDays?`Kalenderdaten sind nur für ${fmt(result.knownDays)} von ${fmt(result.knownDays+result.incompleteDays)} Messtagen vollständig geladen. „Kein Eintrag“ wird außerhalb dieser Abdeckung nicht behauptet. `:'';
 return `<section class="stress-context" aria-label="Stresswerte und zeitgleiche Kalender- und Aktivitätsdaten"><div class="stress-context-heading"><div><small>04 · STRESS × KALENDER × AKTIVITÄTEN</small><h3>Was war bei meinen Stresswerten los?</h3></div><span class="stress-context-chip">${fmt(total)} gemessene Punkte</span></div><p class="stress-context-intro">Garmin-Stressmessungen mit <strong>zeitgleichen</strong> Kalendereinträgen und protokollierten Aktivitäten. So siehst du, was bei Ruhe, niedrigem, mittlerem oder hohem Stress eingeplant oder erfasst war.</p><div class="stress-context-grid">${sections}</div>
 <details class="stress-context-details" ${result.episodesCount?'open':''}><summary>Hohe Stressphasen – Uhrzeiten und Termine (${fmt(result.episodesCount)})</summary>${peaks?`<div class="stress-context-peaks">${peaks}</div>`:'<p>Im gewählten Zeitraum wurden keine Messwerte über 75 erfasst.</p>'}${result.episodesCount>12?'<small>Hier erscheinen die zwölf jüngsten hohen Stressphasen.</small>':''}</details>
 <p class="insight-figure-note">${missing}Kalendertermine sind geplante Einträge, kein Beweis für Teilnahme. Aktivitäten stammen aus dokumentierten Sitzungen oder Garmin-Exporten. Übereinstimmungen beweisen keinen Einfluss auf den Stress. Bei mehreren gleichzeitigen Einträgen kann derselbe Messpunkt mehrfach in den Titellisten vorkommen. Nur gültige Messpunkte zählen; ungemessene Zeiten bleiben unbekannt. ${result.activityCsvUnzoned?'Garmin-Activities-CSV-Zeiten haben keine Zeitzonenangabe; ihre Zuordnung kann verschoben sein. ':''}Diese Auswertung wird ausschließlich lokal im entsperrten Vault erstellt.</p></section>`;
}
