/** Compass Insights 0.5.7 – local-first personal analytics.
 * Only imported observations; no estimated Garmin scores, sleep need, HRV status or confidence ribbons.
 */
import {sleepTimeline} from './health-dashboard.js';
import {sleepDistributionChart,hrvReferenceView,sleepHrvScatter} from './insights-stats.js';

const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palette={green:'#337864',purple:'#8065A9',deep:'#4367A5',light:'#A0B4DD',rem:'#AE86C3',awake:'#DCA471',muted:'#8CA399'};
const dateUTC=day=>Date.parse(`${day}T12:00:00Z`);
const dayString=day=>new Date(dateUTC(day)).toLocaleDateString('de-AT',{day:'numeric',month:'short'});
const number=v=>Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:1}):'–';
const readableMinutes=v=>Number.isFinite(v)?`${Math.floor(v/60)} h ${String(Math.round(v%60)).padStart(2,'0')} min`:'–';
const dayShift=(day,n)=>new Date(dateUTC(day)+n*86400000).toISOString().slice(0,10);
const fmtClock=m=>Number.isFinite(m)?`${String(Math.floor(m/60)%24).padStart(2,'0')}:${String(Math.round(m%60)).padStart(2,'0')}`:'–';
export const INSIGHT_TABS=[
 {id:'sleep',label:'Schlaf',icon:'moon',state:'live',subtitle:'Schlafdauer, -konsistenz und nächtliche HRV'},
 {id:'energy',label:'Body Battery',icon:'bolt',state:'planned',subtitle:'Energiereserven und Aufladung · Ausbau 0.5.9'},
 {id:'stress',label:'Stress',icon:'activity',state:'planned',subtitle:'Stresskurven und Belastungskategorien · Ausbau 0.5.9'},
 {id:'activity',label:'Aktivität',icon:'heart',state:'live',subtitle:'Health-Connect-Schritte und Trainingsminuten · Garmin-Ausbau folgt'},
 {id:'focus',label:'Produktivität',icon:'target',state:'planned',subtitle:'Pomodoros, Kalender und Energie · Ausbau 0.5.11'},
 {id:'body',label:'Körper',icon:'layers',state:'live',subtitle:'Fitdays-Report · Körpergewicht, Körperfett und Segmente'},
 {id:'places',label:'Orte',icon:'compass',state:'planned',subtitle:'Reiseorte und Schlaf an verschiedenen Orten · Ausbau 0.5.12'},
 {id:'explore',label:'Explore',icon:'spark',state:'planned',subtitle:'Eigene statistische Fragen und Konfidenzintervalle · Ausbau 0.5.13'},
 {id:'sources',label:'Datenquellen',icon:'settings',state:'live',subtitle:'Garmin, Fitdays und Health Connect · Import & Verbindungen'}
];
export const INSIGHT_PERIODS=[['7','7 Tage'],['28','4 Wochen'],['90','90 Tage'],['365','1 Jahr'],['all','Alles']];
export function insightsRange(today,period){
 const end=/^\d{4}-\d\d-\d\d$/.test(today||'')?today:new Date().toISOString().slice(0,10);
 const days=period==='all'?null:({7:7,28:28,90:90,365:365})[period]||28;
 return {start:days?dayShift(end,1-days):null,end,days};
}
const inRange=(day,range)=>/^\d{4}-\d\d-\d\d$/.test(day||'')&&(!range.start||day>=range.start)&&day<=range.end;
export function sleepMinutes(night){
 const totals=night?.totals||{};
 const values=[totals.deep,totals.light,totals.rem];
 if(!values.some(Number.isFinite))return null;
 const result=values.reduce((a,v)=>a+(Number.isFinite(v)&&v>=0?v:0),0);
 return result>0&&result<=1440?Math.round(result):null;
}
// A night-based axis avoids averaging 23:55 and 00:05 to 12:00.
export function nightClock(iso,kind='bed',timeZone){
 if(!iso||!Number.isFinite(Date.parse(iso)))return null;
 const options={hour:'2-digit',minute:'2-digit',hourCycle:'h23'};
 if(timeZone)options.timeZone=timeZone;
 const parts=new Intl.DateTimeFormat('en-GB',options).formatToParts(new Date(iso));
 const h=Number(parts.find(p=>p.type==='hour')?.value),m=Number(parts.find(p=>p.type==='minute')?.value);
 if(!Number.isFinite(h)||!Number.isFinite(m))return null;
 const local=h*60+m;
 // 18:00–next noon for bedtime; wake before 18:00 belongs to following day.
 return (h<18?local+1440:local);
}
export function buildSleepInsights(imported={},today=new Date().toISOString().slice(0,10),period='28',timeZone){
 const range=insightsRange(today,period);
 const nights=(imported.garminNights||[]).filter(x=>inRange(x.day,range)).map(n=>({
  ...n, sleepMinutes:sleepMinutes(n),bedMinutes:nightClock(n.start,'bed',timeZone),wakeMinutes:nightClock(n.end,'wake',timeZone)
 })).sort((a,b)=>a.day.localeCompare(b.day));
 const hrv=(imported.garminHrv||[]).filter(x=>inRange(x.day,range)).map(x=>({...x})).sort((a,b)=>a.day.localeCompare(b.day));
 const numeric=rows=>rows.filter(Number.isFinite);
 const mean=rows=>{const valid=numeric(rows);return valid.length?valid.reduce((sum,v)=>sum+v,0)/valid.length:null;};
 const available=nights.filter(x=>x.sleepMinutes!==null),latest=nights.at(-1)||null;
 const firstDay=nights[0]?.day||hrv[0]?.day||null;
 // Coverage is an observation count, not a claim of how many days the watch was worn.
 return {range,nights,hrv,firstDay,latest,validSleepNights:available.length,
  totalNights:nights.length,totalHrvDays:hrv.filter(x=>Number.isFinite(x.nightAverageMs)).length,
  meanSleepMinutes:mean(available.map(x=>x.sleepMinutes)),meanBedMinutes:mean(nights.map(x=>x.bedMinutes)),
  meanWakeMinutes:mean(nights.map(x=>x.wakeMinutes)),meanHrv:mean(hrv.map(x=>x.nightAverageMs)),
  timeZone:timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone||'Gerätezeitzone'};
}
function axisLine(label,sub=''){
 return `<div class="insight-figure-header"><span>${escapeHtml(label)}</span>${sub?`<small>${escapeHtml(sub)}</small>`:''}</div>`;
}
function noMeasurements(msg){return `<div class="insight-no-data">${escapeHtml(msg)}</div>`;}
export function insightsLineChart(records,fields,title,{unit='',range,domain=null,baseline=null,baselineBand=null}={}){
 const normalized=records.filter(x=>inRange(x.day,range||{end:'9999-12-31',start:null}));
 const series=fields.map(f=>({...f,rows:normalized.filter(x=>Number.isFinite(x[f.key])).sort((a,b)=>a.day.localeCompare(b.day))}));
 const values=series.flatMap(s=>s.rows.map(x=>x[s.key]));
 if(!values.length)return noMeasurements(`Für ${title} liegen in diesem Zeitraum noch keine Messwerte vor.`);
 const bandValues=baselineBand?.filter(Number.isFinite)||[];const loValue=domain?.[0]??Math.min(...values,...bandValues),hiValue=domain?.[1]??Math.max(...values,...bandValues);
 const offset=(hiValue-loValue||1)*.18,lo=Math.max(0,loValue-offset),hi=hiValue+offset,interval=hi-lo||1;
 const allDays=normalized.map(x=>x.day).filter(Boolean).sort(),start=range?.start||allDays[0],end=range?.end||allDays.at(-1);
 const xMin=dateUTC(start),xMax=Math.max(dateUTC(end),xMin+86400000);
 const W=820,H=264,left=58,right=18,top=23,bottom=42,w=W-left-right,h=H-top-bottom;
 const X=day=>left+(dateUTC(day)-xMin)/(xMax-xMin)*w;
 const Y=value=>top+h-(value-lo)/interval*h;
 const parts=series.map(s=>{
  const rowDots=s.rows.slice(-350).map(d=>`<circle cx="${X(d.day).toFixed(1)}" cy="${Y(d[s.key]).toFixed(1)}" r="${s.rows.length>90?2.2:3.6}" fill="${s.color}"><title>${escapeHtml(dayString(d.day))}: ${number(d[s.key])}${escapeHtml(unit)}</title></circle>`).join('');
  // Explicitly break the line across missing calendar dates; no interpolation of unknown measurements.
  let segments=[],current=[];
  for(const row of s.rows){if(current.length&&(dateUTC(row.day)-dateUTC(current.at(-1).day))>86400000*1.6){segments.push(current);current=[];}current.push(row);}
  if(current.length)segments.push(current);
  return segments.map(group=>group.length>1?`<polyline points="${group.map(d=>`${X(d.day).toFixed(1)},${Y(d[s.key]).toFixed(1)}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`:'').join('')+rowDots;
 }).join('');
 const ticks=[0,.25,.5,.75,1].map(r=>{
  const val=lo+interval*r;return `<line x1="${left}" y1="${Y(val)}" x2="${W-right}" y2="${Y(val)}" stroke="#E8EEEB"/><text x="${left-10}" y="${Y(val)+4}" text-anchor="end" fill="#84998D" font-size="12">${number(val)}</text>`;
 }).join('');
 const xTicks=[0,.25,.5,.75,1].map(r=>{const date=new Date(xMin+r*(xMax-xMin)).toISOString().slice(0,10);return `<text x="${left+w*r}" y="${H-10}" text-anchor="middle" fill="#84998D" font-size="12">${escapeHtml(dayString(date))}</text>`;}).join('');
 const bandMark=baselineBand?.length===2&&baselineBand.every(Number.isFinite)?`<rect x="${left}" y="${Y(Math.max(...baselineBand))}" width="${w}" height="${Math.abs(Y(baselineBand[0])-Y(baselineBand[1]))}" fill="#8065A9" opacity=".12"/>`:'';
 const baselineMark=Number.isFinite(baseline)&&baseline>=lo&&baseline<=hi?`<line x1="${left}" y1="${Y(baseline)}" x2="${W-right}" y2="${Y(baseline)}" stroke="#A5B7AA" stroke-width="1.5" stroke-dasharray="5 6"/>`:'';
 return `${axisLine(title)}<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHtml(title)}, ${values.length} Messpunkte, ${escapeHtml(unit)}" xmlns="http://www.w3.org/2000/svg">${ticks}${bandMark}${baselineMark}${parts}${xTicks}</svg></div><div class="insight-legend">${series.map(s=>`<span><i style="background:${s.color}"></i>${escapeHtml(s.label)} · ${s.rows.length} Werte</span>`).join('')}</div>`;
}
export function sleepConsistencyChart(nights,range){
 const rows=nights.filter(n=>Number.isFinite(n.bedMinutes)&&Number.isFinite(n.wakeMinutes));
 if(!rows.length)return noMeasurements('Keine vollständigen Einschlaf- und Aufwachzeiten vorhanden.');
 const W=820,H=275,left=68,right=18,top=22,bottom=43,w=W-left-right,h=H-top-bottom;
 const start=range?.start||rows[0].day,end=range?.end||rows.at(-1).day,span=Math.max(86400000,dateUTC(end)-dateUTC(start));
 const X=d=>left+(dateUTC(d)-dateUTC(start))/span*w;
 const yMin=18*60,yMax=37*60;
 const Y=v=>top+h-(v-yMin)/(yMax-yMin)*h;
 const grid=[18,21,24,27,30,33,36].map(t=>`<line x1="${left}" x2="${W-right}" y1="${Y(t*60)}" y2="${Y(t*60)}" stroke="#EAF0EC"/><text x="${left-9}" y="${Y(t*60)+4}" text-anchor="end" fill="#83978A" font-size="11">${fmtClock(t*60)}</text>`).join('');
 const dots=rows.slice(-220).map(n=>{
  const b=Math.max(yMin,Math.min(yMax,n.bedMinutes)),e=Math.max(yMin,Math.min(yMax,n.wakeMinutes));
  return `<line x1="${X(n.day)}" x2="${X(n.day)}" y1="${Y(b)}" y2="${Y(e)}" stroke="#9FB4D5" stroke-width="3" stroke-opacity=".45"/><circle cx="${X(n.day)}" cy="${Y(b)}" r="3.4" fill="#657AAE"><title>${escapeHtml(dayString(n.day))} · Bett: ${fmtClock(n.bedMinutes)}</title></circle><circle cx="${X(n.day)}" cy="${Y(e)}" r="3.4" fill="#58A08B"><title>${escapeHtml(dayString(n.day))} · Aufstehen: ${fmtClock(n.wakeMinutes)}</title></circle>`;
 }).join('');
 return `${axisLine('Schlafkonsistenz','Uhrzeiten auf einer Nachtachse')}
 <div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Einschlaf- und Aufwachzeiten für ${rows.length} Nächte" xmlns="http://www.w3.org/2000/svg">${grid}${dots}<text x="${left}" y="${H-10}" fill="#81958A" font-size="11">${escapeHtml(dayString(start))}</text><text x="${W-right}" y="${H-10}" text-anchor="end" fill="#81958A" font-size="11">${escapeHtml(dayString(end))}</text></svg></div>
 <div class="insight-legend"><span><i style="background:#657AAE"></i>Einschlafen</span><span><i style="background:#58A08B"></i>Aufwachen</span><span>${rows.length} Nächte</span></div>`;
}
export function weeklySleepGroups(nights){
 const groups=new Map();
 for(const night of nights){if(!Number.isFinite(night.sleepMinutes))continue;
  const d=new Date(dateUTC(night.day));const weekday=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-weekday);
  const week=d.toISOString().slice(0,10);
  if(!groups.has(week))groups.set(week,[]);groups.get(week).push(night.sleepMinutes);
 }
 return [...groups.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([week,values])=>({week,count:values.length,mean:values.reduce((a,b)=>a+b,0)/values.length}));
}
export function insightsSleepView(model,selectedNight='',ico=()=>'',today=''){
 const {nights,hrv,range}=model,latest=nights.find(n=>n.day===selectedNight)||nights.at(-1)||null;
 const overview=[
  ['Ø Schlaf',readableMinutes(model.meanSleepMinutes),'Garmin · valide Nächte'],
  ['Ø Einschlafen',fmtClock(model.meanBedMinutes),'Gerätezeitzone'],
  ['Ø Aufwachen',fmtClock(model.meanWakeMinutes),'Gerätezeitzone'],
  ['Ø nächtliche HRV',Number.isFinite(model.meanHrv)?`${number(model.meanHrv)} ms`:'–','Importierte HRV-Tage']
 ];
 const sleepRows=nights.map(n=>({day:n.day,sleepMinutes:n.sleepMinutes}));
 const weeks=weeklySleepGroups(nights).slice(-8);
 return `<div class="insight-sleep-content">
 <div class="insight-kpi-grid">${overview.map(([k,v,sub])=>`<article class="insight-kpi"><span>${escapeHtml(k)}</span><strong>${escapeHtml(v)}</strong><small>${escapeHtml(sub)}</small></article>`).join('')}</div>
 <div class="insight-data-note">${ico('shield',16)} <span><strong>${model.validSleepNights} Nächte</strong> mit Schlafdauer · <strong>${model.totalHrvDays} Tage</strong> mit nächtlicher HRV. Fehlende Messungen bleiben Lücken. Uhrzeiten werden in <strong>${escapeHtml(model.timeZone)}</strong> angezeigt, nicht automatisch in der Zeitzone einer Reise.</span></div>
 <div class="insight-chart-grid"><article class="insight-chart-card"><div class="insight-figure-title"><div><small>01 · SLEEP DURATION</small><h3>Wie lange schlafe ich?</h3></div>${ico('moon',20)}</div>${insightsLineChart(sleepRows,[{key:'sleepMinutes',label:'Schlafdauer',color:palette.green}],'Schlafdauer in Minuten',{unit:' min',range})}<p class="insight-figure-note">Nur echte Tief-, Leicht- und REM-Minuten aus Garmin. Ein Garmin-Sleep-Need-Wert ist noch nicht verfügbar.</p></article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>02 · SLEEP CONSISTENCY</small><h3>Wann schlafe ich?</h3></div>${ico('clock',20)}</div>${sleepConsistencyChart(nights,range)}<p class="insight-figure-note">Die Uhrzeiten stammen aus Import-Zeitstempeln. Bei Reisen kann die aktuelle Gerätezeitzone von der Ortszeit der damaligen Nacht abweichen.</p></article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>03 · HEART RATE VARIABILITY</small><h3>Mein HRV-Verlauf</h3></div>${ico('heart',20)}</div>${insightsLineChart(hrv,[{key:'nightAverageMs',label:'Nächtlicher Durchschnitt',color:palette.purple},{key:'weeklyAverageMs',label:'Garmin 7-Tage-Wert',color:palette.deep}],'HRV · Millisekunden',{unit:' ms',range})}<p class="insight-figure-note">Die 7-Tage-Werte werden nur gezeigt, wenn Garmin sie im FIT-Export liefert. Kein erfundener Baseline-Bereich und keine abgeleitete Statusklassifikation.</p></article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>04 · WEEKLY SUMMARY</small><h3>Meine Schlafwochen</h3></div>${ico('calendar',20)}</div>${weeks.length?`<div class="insight-weeks">${weeks.map(w=>{const width=Math.max(3,Math.min(100,w.mean/600*100));return `<div class="insight-week"><span>${escapeHtml(dayString(w.week))}</span><div class="insight-week-track"><i style="width:${width.toFixed(1)}%"></i></div><strong>${escapeHtml(readableMinutes(w.mean))}</strong><small>${w.count} Nächte</small></div>`;}).join('')}</div>`:noMeasurements('Noch keine vollständigen Schlafwochen importiert.')}<p class="insight-figure-note">Wochendurchschnitt je gemessener Nacht. Die Balken sind kein Sleep Score.</p></article></div>
 <div class="insight-chart-grid"><article class="insight-chart-card"><div class="insight-figure-title"><div><small>05 · SLEEP DISTRIBUTION</small><h3>Wie stark schwankt mein Schlaf?</h3></div>${ico('activity',20)}</div>${sleepDistributionChart(nights)}</article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>06 · PERSONAL HRV REFERENCE</small><h3>Meine beobachtete HRV-Spanne</h3></div>${ico('heart',20)}</div>${hrvReferenceView(hrv,(rows,series,title,options)=>insightsLineChart(rows,series,title,{...options,range}))}</article>
 <article class="insight-chart-card insight-night-detail"><div class="insight-figure-title"><div><small>07 · SLEEP & HRV</small><h3>Schlaf und HRV zusammen</h3></div>${ico('layers',20)}</div>${sleepHrvScatter(nights,hrv)}</article></div>
 <article class="insight-chart-card insight-night-detail"><div class="insight-figure-title"><div><small>08 · THE NIGHT</small><h3>Schlafphasen im Detail</h3></div>${ico('moon',20)}</div>${nights.length?`<label class="insight-night-selector">Nacht auswählen <select id="insights-night-select">${[...nights].reverse().map(n=>`<option value="${escapeHtml(n.day)}" ${latest?.day===n.day?'selected':''}>${escapeHtml(new Date(dateUTC(n.day)).toLocaleDateString('de-AT',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}))}</option>`).join('')}</select></label>`:''}${latest?sleepTimeline(latest):noMeasurements('Noch keine importierten Garmin-Nächte.')}<div class="insight-night-totals">${latest?[['Tief',latest.totals?.deep,palette.deep],['Leicht',latest.totals?.light,palette.light],['REM',latest.totals?.rem,palette.rem],['Wach',latest.totals?.awake,palette.awake]].map(([label,v,color])=>`<span><i style="background:${color}"></i>${label}: ${Number.isFinite(v)?readableMinutes(v):'–'}</span>`).join(''):''}</div></article>
 <div class="insight-footnote">Die Garmin-Messwerte sind Schätzungen der Uhr, keine medizinische Diagnose. Ein 95%-Konfidenzintervall folgt in der Statistikphase nur dort, wo genug Messungen und ein geeignetes Zeitreihenmodell vorliegen. Fehlende Werte werden weder extrapoliert noch als Null behandelt.</div>
 </div>`;
}
export function insightsPlannedView(tab,imported={},healthDays=[],activities=[]){
 const fit=imported?.fitdays||[],labels={
  energy:['Body Battery','Tageskurven, nächtliche Aufladung und 4-Wochen-High/Low','Die bisherigen Garmin-Schlaf-/HRV-Importer speichern noch keine Body-Battery-Werte. Dafür müssen die Wellness-FIT-Records erst gesondert dekodiert werden.'],
  stress:['Stress','Belastungszonen, Tageszeiten und Wochenverläufe','Stresswerte aus Garmin-FIT-Dateien werden derzeit noch nicht vollständig extrahiert.'],
  activity:['Aktivität','Schritte, Aktivitäten, Intensitätsminuten und Training','Einige Aktivitätswerte sind bereits als Health-Connect-Tageswerte verfügbar; der detaillierte Garmin-Import folgt.'],
  focus:['Produktivität','Pomodoro-Heatmap und Fokuszeit im Kontext von Schlaf','Compass speichert Aktivitäten bereits; die statistisch saubere zeitliche Verknüpfung folgt.'],
  body:['Körperzusammensetzung','Gewicht, Körperfett, Muskelbalance und Fitdays-Report','Fitdays-Messungen findest du direkt im Tab Körper.'],
  places:['Orte & Reisen','Weltkarte, Aufenthalte und Schlaf nach Ort','Aktivitäts-GPS-Tracks identifizieren Schlaforte nicht automatisch. Wir verwenden später nur bestätigte Aufenthalte.'],
  explore:['Explore','Frei kombinierte Messgrößen, Scatterplots und Unsicherheitsintervalle','Der Statistik-Explorer braucht zunächst eine verlässliche gemeinsame Zeitachse aller Datenquellen.']
 };
 const [title,feature,note]=labels[tab]||labels.explore;
 const counts=[['Fitdays-Messungen',fit.length],['Health-Connect-Tage',healthDays.length],['Erfasste Aktivitäten',activities.length]];
 return `<div class="insight-coming"><div class="insight-coming-badge">IN VORBEREITUNG · NÄCHSTE INSIGHTS-PHASE</div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(feature)}</p><div class="insight-coming-counts">${counts.map(([name,count])=>`<div><strong>${count}</strong><span>${escapeHtml(name)}</span></div>`).join('')}</div><div class="insight-data-note">${escapeHtml(note)}</div><button type="button" class="secondary-btn" data-action="insights-tab" data-id="sources">Datenquellen öffnen →</button></div>`;
}
