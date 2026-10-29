import {stackedWorkDays,focusActivityBreakdown} from './focus-productivity-v57759402510.js';
/** Compass 0.5.11 · Productivity × Health (local-only joins).
 * All joins use observed dates; missing focus tracking is never treated as zero output.
 * Calendar titles are classified transiently, never persisted or sent to a Compass API.
 */
import {buildSleepInsights,insightsRange} from './insights.js';
import {buildWellnessInsights} from './insights-wellness.js';
import {classifyCalendarEvent,calendarEventDay,isRoutineCalendarBlock} from './calendar-rules.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validDay=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\d$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00Z'));
const mean=a=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
const fmt=(v,dec=1)=>Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:dec}):'–';
const dd=d=>new Date(d+'T12:00:00Z').toLocaleDateString('de-AT',{day:'numeric',month:'short'});
const dt=d=>Date.parse(`${d}T12:00:00Z`);
const finite=v=>Number.isFinite(v)&&v>=0;
// Unicode word boundaries also recognize German umlauts (e.g. „Übung“ alone).
const wordPattern=terms=>new RegExp(`(^|[^\\p{L}\\p{N}])(?:${terms})(?=$|[^\\p{L}\\p{N}])`,'iu');
const meetingWords=wordPattern('meeting|jour\\s*fixe|jourfixe|besprechung|teams|zoom|konferenz|sitzung|call|stand\\s*up|standup|teamtreffen|abstimmung');
const teachingWords=wordPattern('lehre|vorlesung|seminar|übung|uebung|kurs|unterricht|lecture|teaching|workshop');
const researchWords=wordPattern('forschung|research|dissertation|paper|literatur|schreiben|writing|review');
const intervalOverlap=(event,start,end)=>{
 const from=Date.parse(event.start?.dateTime||'');const to=Date.parse(event.end?.dateTime||'');
 if(!Number.isFinite(from)||!Number.isFinite(to)||to<=from)return 0;
 return Math.max(0,Math.min(end,to)-Math.max(start,from))/60000;
};
const kind=title=>meetingWords.test(title)?'meeting':teachingWords.test(title)?'teaching':researchWords.test(title)?'research':null;
/** A timed, explicitly recognized work event. Do not pretend unlabeled appointments are meetings. */
export function calendarWorkMinutes(events=[],rules=[],overrides={},range={start:null,end:'9999-12-31'}){
 const byDay=new Map();const seen=new Set();
 for(const e of events||[]){
  if(!e||e.status==='cancelled'||!e.start?.dateTime||!e.end?.dateTime||isRoutineCalendarBlock(e))continue;
  if(e.id&&seen.has(e.id))continue;if(e.id)seen.add(e.id);
  const appearance=classifyCalendarEvent(e,rules,overrides);if(appearance.hidden)continue;
  const label=kind(appearance.displayTitle||e.summary||'');if(!label)continue;
  const first=Date.parse(e.start.dateTime),last=Date.parse(e.end.dateTime);
  if(!Number.isFinite(first)||!Number.isFinite(last)||last<=first||last-first>24*3600000)continue;
  // Local calendar day in user's current device timezone (as elsewhere in Compass).
  const days=[calendarEventDay(e)];
  if(new Date(last).toDateString()!==new Date(first).toDateString()){
   const following=new Date(first);following.setDate(following.getDate()+1);
   days.push([following.getFullYear(),String(following.getMonth()+1).padStart(2,'0'),String(following.getDate()).padStart(2,'0')].join('-'));
  }
  for(const day of new Set(days)){
   if(!validDay(day)||range.start&&day<range.start||day>range.end)continue;
   const localStart=new Date(`${day}T00:00:00`),localEnd=new Date(localStart);localEnd.setDate(localEnd.getDate()+1);
   const minutes=intervalOverlap(e,localStart.getTime(),localEnd.getTime());
   if(minutes<=0)continue;
   const x=byDay.get(day)||{day,meetingMinutes:0,teachingMinutes:0,researchMinutes:0,recognizedEvents:0};
   x[label+'Minutes']+=Math.min(minutes,24*60);x.recognizedEvents++;byDay.set(day,x);
  }
 }
 return [...byDay.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
/** Only days with recorded sessions are marked tracked. A missing session day is unknown, not 0. */
export function focusActivityDays(activities=[],range={start:null,end:'9999-12-31'}){
 const map=new Map(),seen=new Set();
 for(const a of activities||[]){
  if(!a||a.deleted||seen.has(a.id)||a.category!=='Arbeit'||!/^\d{4}-\d\d-\d\dT/.test(a.startedAt||''))continue;
  seen.add(a.id);
  const day=a.startedAt.slice(0,10),duration=a.durationMinutes;
  if(!validDay(day)||range.start&&day<range.start||day>range.end||!finite(duration)||duration>1440)continue;
  const p=map.get(day)||{day,workMinutes:0,pomodoros:0,sessions:0,watchSessions:0,manualSessions:0};
  p.workMinutes+=duration;p.pomodoros+=Number.isSafeInteger(a.pomodoros)&&a.pomodoros>0?a.pomodoros:0;
  p.sessions++;if(a.source==='Garmin')p.watchSessions++;else p.manualSessions++;
  map.set(day,p);
 }
 return [...map.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
export function buildProductivityInsights({imported={},activities=[],calendarEvents=[],rules=[],overrides={},calendarCoverage=null,today='2026-10-18',period='28'}={}){
 const range=insightsRange(today,period);
 const work=focusActivityDays(activities,range),workMap=new Map(work.map(x=>[x.day,x]));
 const sleep=buildSleepInsights(imported,today,period),sleepMap=new Map(sleep.nights.filter(n=>finite(n.sleepMinutes)).map(x=>[x.day,x.sleepMinutes]));
 const wellness=buildWellnessInsights(imported,today,period),wMap=new Map(wellness.summaries.map(x=>[x.day,x]));
 const calendars=calendarWorkMinutes(calendarEvents,rules,overrides,range);
 const cMap=new Map(calendars.map(x=>[x.day,x]));
 const calendarReady=!!calendarCoverage?.start&&!!calendarCoverage?.end&&calendarCoverage.complete!==false;
 const coverageDay=d=>calendarReady&&d>=calendarCoverage.start&&d<=calendarCoverage.end;
 const rows=work.map(f=>{
  const bb=wMap.get(f.day),morning=bb?.points?.filter(p=>finite(p.bodyBattery)&&new Date(p.at).getHours()>=6&&new Date(p.at).getHours()<11)||[];
  const morningBattery=morning.length>=2?mean(morning.map(p=>p.bodyBattery)):null;
  return {...f,sleepMinutes:sleepMap.get(f.day)??null,
   avgStress:bb&&bb.stressCount>=12?bb.avgStress:null,morningBattery,
   meetingMinutes:coverageDay(f.day)?cMap.get(f.day)?.meetingMinutes||0:null,
   teachingMinutes:coverageDay(f.day)?cMap.get(f.day)?.teachingMinutes||0:null,
   researchMinutes:coverageDay(f.day)?cMap.get(f.day)?.researchMinutes||0:null};
 });
 const nMeetings=rows.filter(r=>finite(r.meetingMinutes)).length;
 return {range,rows,workDays:work.length,calendarReady,calendarCoverage,calendarEventsClassified:calendars.length,
  sleepPairs:rows.filter(r=>finite(r.sleepMinutes)),stressPairs:rows.filter(r=>finite(r.avgStress)),batteryPairs:rows.filter(r=>finite(r.morningBattery)),meetingPairs:rows.filter(r=>finite(r.meetingMinutes)),
  totalPomodoros:work.reduce((s,r)=>s+r.pomodoros,0),totalWorkMinutes:work.reduce((s,r)=>s+r.workMinutes,0),trackedWorkDays:work.length,
  meetingDaysAvailable:nMeetings,calendarDays:calendars,wellnessDays:wellness.summaries.length};
}
function noData(title,detail){return `<div class="insight-no-data"><strong>${esc(title)}</strong><p>${esc(detail)}</p></div>`;}
const box=(number,heading,content,foot)=>`<article class="insight-chart-card"><div class="insight-figure-title"><div><small>${esc(number)} · CONNECTED INSIGHTS</small><h3>${esc(heading)}</h3></div></div>${content}${foot?`<p class="insight-figure-note">${esc(foot)}</p>`:''}</article>`;
export function productivityScatter(pairs,xKey,yKey,{title='',xLabel='',yLabel='',color='#477F91',xUnit='',yUnit='',need=3}={}){
 const rows=(pairs||[]).filter(x=>Number.isFinite(x[xKey])&&Number.isFinite(x[yKey]));
 if(rows.length<need)return noData('Noch nicht genügend gemeinsame Messungen',`${rows.length} Wertepaar(e) vorhanden; mindestens ${need} Tage mit beiden Werten benötigt.`);
 const W=760,H=274,L=72,R=24,T=24,B=59,ww=W-L-R,hh=H-T-B;
 const xv=rows.map(x=>x[xKey]),yv=rows.map(x=>x[yKey]);
 let xmin=Math.min(...xv),xmax=Math.max(...xv),ymin=Math.min(...yv),ymax=Math.max(...yv);
 const xPad=Math.max(1,(xmax-xmin)*.11),yPad=Math.max(1,(ymax-ymin)*.13);
 xmin=Math.max(0,xmin-xPad);xmax+=xPad;ymin=Math.max(0,ymin-yPad);ymax+=yPad;
 const X=v=>L+(v-xmin)/(xmax-xmin||1)*ww,Y=v=>T+hh-(v-ymin)/(ymax-ymin||1)*hh;
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" x2="${W-R}" y1="${(T+hh*t).toFixed(1)}" y2="${(T+hh*t).toFixed(1)}" stroke="#E5EFEA"/><text x="${L-9}" y="${(T+hh*t+4).toFixed(1)}" text-anchor="end" font-size="11" fill="#789186">${esc(fmt(ymax-(ymax-ymin)*t))}</text><text x="${(L+ww*t).toFixed(1)}" y="${H-33}" text-anchor="middle" font-size="11" fill="#789186">${esc(fmt(xmin+(xmax-xmin)*t))}</text>`).join('');
 const dots=rows.map(r=>`<circle cx="${X(r[xKey]).toFixed(1)}" cy="${Y(r[yKey]).toFixed(1)}" r="${rows.length>100?2.8:4.2}" fill="${color}" fill-opacity=".72"><title>${esc(r.day)} · ${esc(fmt(r[xKey]))}${esc(xUnit)} × ${esc(fmt(r[yKey]))}${esc(yUnit)}</title></circle>`).join('');
 return `<div class="insight-figure-header"><span>${esc(title)}</span><small>${rows.length} tatsächliche Wertepaare</small></div><div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}, Streudiagramm mit ${rows.length} Wertepaaren">${grid}${dots}<text x="${W/2}" y="${H-5}" text-anchor="middle" font-size="12" fill="#688477">${esc(xLabel)}</text><text x="13" y="${H/2}" transform="rotate(-90 13 ${H/2})" text-anchor="middle" font-size="12" fill="#688477">${esc(yLabel)}</text></svg></div><div class="insight-legend"><span><i style="background:${color}"></i>Gemeinsam beobachtete Tage (${rows.length})</span></div>`;
}
function durationChart(rows){
 if(!rows.length)return noData('Noch keine Arbeitsphasen erfasst','Pomodoro- und Arbeitszeitdaten erscheinen nach einer Garmin- oder manuellen Arbeitssession.');
 const last=[...rows].slice(-36),max=Math.max(...last.map(x=>x.workMinutes),1);
 return `<div class="insight-focus-barlist">${last.map(r=>`<div class="insight-focus-bar" title="${esc(r.day)} · ${esc(fmt(r.workMinutes,0))} min · ${r.pomodoros} Pomodoros"><span>${esc(dd(r.day))}</span><div class="insight-focus-track"><i style="width:${Math.max(1,r.workMinutes/max*100).toFixed(1)}%"></i></div><strong>${esc(fmt(r.workMinutes,0))} min</strong><small>${r.pomodoros} P.</small></div>`).join('')}</div>`;
}
function weekdayHeatmap(activities){
 const sessions=activities.filter(a=>a.category==='Arbeit'&&!a.deleted&&/^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(a.startedAt||'')&&finite(a.durationMinutes));
 if(!sessions.length)return noData('Keine erfassten Sessions','Die Uhrzeitmatrix erscheint mit deinen Arbeitssessions.');
 const slots=Array.from({length:7},()=>Array(6).fill(0));
 for(const a of sessions){const date=new Date(a.startedAt);const weekday=(date.getDay()+6)%7,hour=date.getHours();if(hour<6||hour>=24)continue;slots[weekday][Math.floor((hour-6)/3)]+=Math.min(a.durationMinutes,180);}
 const top=Math.max(1,...slots.flat());const days=['Mo','Di','Mi','Do','Fr','Sa','So'];
 return `<div class="insight-focus-heatmap" role="img" aria-label="Erfasste Arbeitsminuten nach Wochentag und Beginnzeit"><span></span>${[6,9,12,15,18,21].map(h=>`<span class="insight-heat-hour">${h} Uhr</span>`).join('')}${slots.map((row,i)=>`<strong>${days[i]}</strong>${row.map((v,j)=>`<span class="insight-heat-cell" style="background:rgba(52,126,106,${(.07+v/top*.85).toFixed(3)})"><title>${days[i]} ${6+j*3}–${9+j*3} Uhr · ${fmt(v,0)} min erfasst</title></span>`).join('')}`).join('')}</div><p class="insight-figure-note">Summen nach Startzeit und Wochentag, kein Nachweis optimaler Leistung. Sehr lange Sessions werden für die Farbstärke begrenzt.</p>`;
}
const kpi=(name,value,detail)=>`<article class="insight-kpi"><span>${esc(name)}</span><strong>${esc(value)}</strong><small>${esc(detail)}</small></article>`;
export function productivityInsightsView(model,activities=[],calendarStatus='Nicht verbunden',calendarConnected=false){
 const {rows,sleepPairs,stressPairs,batteryPairs,meetingPairs}=model;
 return `<section class="insight-productivity" aria-label="Produktivität und Gesundheit im Vergleich">
 <div class="insight-kpi-grid">${kpi('Arbeitszeit erfasst',fmt(model.totalWorkMinutes/60,1)+' h',`${model.workDays} Tage mit Arbeitssessions`)}${kpi('Pomodoros',fmt(model.totalPomodoros,0),'Tatsächlich protokollierte Zähler')}${kpi('Schlaf × Arbeit',fmt(sleepPairs.length,0),'gemeinsam beobachtete Tage')}${kpi('Kalender × Arbeit',fmt(meetingPairs.length,0),'Tage im geladenen Kalenderfenster')}</div>
 ${focusActivityBreakdown(activities)}
 <div class="insight-productivity-tools"><div><strong>Auswertung aktualisieren</strong><small>Kalender und Arbeitssessions werden nur lesend abgerufen.</small></div><div><button class="secondary-btn" type="button" data-action="watch-refresh">Arbeitssessions laden</button><button class="secondary-btn" type="button" data-action="${calendarConnected?'calendar-refresh':'calendar-connect'}">${calendarConnected?'Kalender aktualisieren':'Kalender verbinden'}</button></div></div>
 <div class="insight-data-note"><strong>Was die Daten leisten:</strong> Compass verbindet ausschließlich tatsächlich protokollierte Arbeitssessions mit Schlaf, Stress, Body Battery und zeitlich passenden Kalenderterminen. <strong>Arbeitssessions sind ein Zeitindikator, kein Maß für Leistung oder Qualität.</strong> Tage ohne Aufzeichnung sind unbekannt, nicht unproduktiv.</div>
 <div class="insight-chart-grid">
 ${box('01','Meine erfasste Arbeitszeit',stackedWorkDays(activities,rows),'Bis zu 36 dokumentierte Arbeitstage, nach Garmin-Tätigkeitsart eingefärbt. Pausen zählen zur Sessiondauer, nicht zur Fokuszeit.')}
 ${box('02','Zu welchen Zeiten arbeite ich?',weekdayHeatmap(activities),'Zeitmatrix anhand der erfassten Session-Startzeiten, nicht anhand angenommener Arbeitszeiten.')}
 ${box('03','Schlafdauer × Arbeitszeit',productivityScatter(sleepPairs,'sleepMinutes','workMinutes',{title:'Letzte Nacht → erfasste Arbeit am selben Kalendertag',xLabel:'Schlafdauer [min]',yLabel:'Arbeitszeit [min]',xUnit:' min',yUnit:' min',color:'#407F78'}),'Nacht wird nach ihrem Aufwachtag zugeordnet; keine Aussage über Ursache oder geistige Leistungsfähigkeit.')}
 ${box('04','Schlafdauer × Pomodoros',productivityScatter(sleepPairs,'sleepMinutes','pomodoros',{title:'Schlafdauer und protokollierte Pomodoros',xLabel:'Schlafdauer [min]',yLabel:'Pomodoros [Anzahl]',xUnit:' min',color:'#8D76AD'}),'Die Anzahl ist nur für verbundene Garmin-Pomodoro-Sessions verfügbar; andere Arbeitssessions können null protokollierte Pomodoros haben.')}
 ${box('05','Stress × Arbeitszeit',productivityScatter(stressPairs,'avgStress','workMinutes',{title:'Gemessener Garmin-Tagesstress und Arbeitssessions',xLabel:'Ø Stressindex [0–100]',yLabel:'Arbeitszeit [min]',color:'#C78A68'}),'Stresswerte kommen aus mindestens zwölf gültigen fünfminütigen Garmin-Messpunkten am betreffenden Tag.')}
 ${box('06','Morgendliche Body Battery × Arbeit',productivityScatter(batteryPairs,'morningBattery','workMinutes',{title:'Garmin Body Battery zwischen 6 und 11 Uhr',xLabel:'Ø Body Battery [0–100]',yLabel:'Arbeitszeit [min]',color:'#50889A'}),'Nur tatsächlich gemessene Vormittagswerte; keine abgeleitete Energie- oder Produktivitätskennzahl.')}
 ${box('07','Meetingdauer × Arbeitszeit',model.calendarReady?productivityScatter(meetingPairs,'meetingMinutes','workMinutes',{title:'Erkannte Meetings und erfasste Arbeitszeit',xLabel:'Meetingzeit [min]',yLabel:'Arbeitszeit [min]',color:'#9E7792'}):noData('Kalender noch nicht geladen','Verbinde Google Calendar, um Meetings anhand ihrer Titel zu erkennen.'),'Es werden nur zeitgebundene Termine mit erkennbaren Meeting-Schlüsselwörtern berücksichtigt; nicht erkannte Titel bleiben unklassifiziert.')}
 ${box('08','Arbeitstypen aus dem Kalender',model.calendarReady?`<div class="insight-work-types">${[['Meetings','meetingMinutes','#97749E'],['Lehre','teachingMinutes','#557D9B'],['Forschung','researchMinutes','#4E977F']].map(([label,key,color])=>{const value=mean(meetingPairs.map(r=>r[key]));return `<div><span>${esc(label)}</span><div class="insight-focus-track"><i style="width:${Math.min(100,(value||0)/360*100)}%;background:${color}"></i></div><strong>${esc(fmt(value||0,0))} min</strong></div>`;}).join('')}</div><p class="insight-figure-note">Durchschnitt pro gemeinsam dokumentiertem Arbeitstag; grobe, transparente Zuordnung nach Termintiteln.</p>`:noData('Kalender noch nicht verbunden','Google Calendar wird ausschließlich lesend genutzt.'),'Werte beruhen auf den aktuell geladenen Kalendereinträgen. Keine automatische Projekterkennung oder Rekonstruktion nicht vorhandener Termine.')}</div>
 <div class="insight-footnote">Datenabdeckung: ${model.workDays} Arbeitstage protokolliert · ${sleepPairs.length} Schlafpaare · ${stressPairs.length} Stresspaare · ${batteryPairs.length} Vormittags-Body-Battery-Paare · ${meetingPairs.length} Kalenderpaare. ${esc(calendarStatus)}. Kalender-Historie wird nur während einer aktiven Google-Calendar-Verbindung gelesen. Garmin-Sessions sind serverseitig auf den aktuell abgerufenen Bestand begrenzt. Keine Korrelation oder 95%-Konfidenzintervalle ohne Prüfung ausreichender unabhängiger Beobachtungen.</div></section>`;
}
