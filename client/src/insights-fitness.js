/** Compass 0.5.10: Garmin FIT monitoring + Health Connect, without duplicate steps.
 * Prefer locally imported Garmin steps when available, otherwise Health Connect.
 * Session summaries only where Garmin activity exports actually contain global 18.
 */
import {insightsRange} from './insights.js';
import {sportsInsightsView,sportsPeriodWindow,normalizedSportDistance} from './sports-insights.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=(x,d=0)=>Number.isFinite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:d}):'–';
const dayLabel=x=>new Date(x+'T12:00:00Z').toLocaleDateString('de-AT',{day:'2-digit',month:'short'});
const finite=x=>Number.isFinite(x)&&x>=0;
const sportNames={0:'Training',1:'Laufen',2:'Radfahren',3:'Wechsel',4:'Fitnessgerät',5:'Schwimmen',11:'Gehen',17:'Wandern',18:'Gehen',19:'Krafttraining',20:'Indoor-Radfahren'};
export function joinedFitnessDays(imported={},healthDays=[],today='2026-10-18',period='28'){
 const range=typeof period==='object'&&period?.end?period:insightsRange(today,period),days=new Map();
 for(const r of healthDays||[]){if(!r||typeof r.day!=='string'||r.day>range.end||range.start&&r.day<range.start)continue;
  days.set(r.day,{day:r.day,steps:finite(r.steps)?r.steps:null,exerciseMinutes:finite(r.exerciseMinutes)?r.exerciseMinutes:null,stepsSource:finite(r.steps)?'Health Connect':null,distanceKm:null,activeMinutes:null});
 }
 for(const f of imported?.garminFitness||[]){if(!f||typeof f.day!=='string'||f.day>range.end||range.start&&f.day<range.start)continue;
  const old=days.get(f.day)||{day:f.day,steps:null,exerciseMinutes:null,stepsSource:null,distanceKm:null,activeMinutes:null};
  const steps=finite(f.steps)?f.steps:old.steps;
  days.set(f.day,{...old,steps,stepsSource:finite(f.steps)?'Garmin FIT':old.stepsSource,distanceKm:finite(f.distanceKm)?f.distanceKm:null,activeMinutes:finite(f.activeMinutes)?f.activeMinutes:null});
 }
 return [...days.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
function lineChart(rows,key,color,unit,label,period){
 const valid=rows.filter(r=>finite(r[key]));
 if(!valid.length)return `<p class="insight-no-data">Noch keine ${esc(label)}-Werte im gewählten Zeitraum.</p>`;
 const aggregate=valid.length>95,groups=new Map();
 for(const row of valid){const d=new Date(row.day+'T12:00:00Z');if(aggregate)d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));const k=aggregate?d.toISOString().slice(0,10):row.day;
  if(!groups.has(k))groups.set(k,[]);groups.get(k).push(row[key]);}
 const points=[...groups].map(([day,values])=>({day,value:values.reduce((a,b)=>a+b,0)/values.length,count:values.length}));
 const W=760,H=235,L=59,R=22,T=20,B=43,w=W-L-R,h=H-T-B,max=Math.max(1,...points.map(p=>p.value));
 const first=Date.parse(points[0].day+'T12:00:00Z'),last=Date.parse(points.at(-1).day+'T12:00:00Z');
 const X=i=>L+(last===first?.5:(Date.parse(points[i].day+'T12:00:00Z')-first)/(last-first))*w,Y=v=>T+h-v/max*h;
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" y1="${Y(max*t)}" x2="${W-R}" y2="${Y(max*t)}" stroke="#E4EDE7"/><text x="${L-10}" y="${Y(max*t)+4}" text-anchor="end" fill="#829489" font-size="11">${esc(num(max*t))}</text>`).join('');
 let segments=[],current=[];
 for(let i=0;i<points.length;i++){if(i>0&&Date.parse(points[i].day+'T12:00:00Z')-Date.parse(points[i-1].day+'T12:00:00Z')>(aggregate?8:2)*86400000){if(current.length)segments.push(current);current=[];}current.push(i);}if(current.length)segments.push(current);
 const paths=segments.map(indices=>indices.length===1?'':`<polyline fill="none" stroke="${color}" stroke-width="2.8" stroke-linejoin="round" points="${indices.map(i=>`${X(i).toFixed(1)},${Y(points[i].value).toFixed(1)}`).join(' ')}"/>`).join('');
 const dots=points.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.value)}" r="${points.length>80?2.5:3.8}" fill="${color}"><title>${esc(p.day)} · ${esc(num(p.value,1))} ${esc(unit)} · ${p.count} Messtag(e)</title></circle>`).join('');
 const xticks=[0,.25,.5,.75,1].map(t=>{const i=Math.round(t*(points.length-1));return `<text x="${X(i)}" y="${H-13}" text-anchor="middle" font-size="11" fill="#789081">${esc(dayLabel(points[i].day))}</text>`;}).join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}: ${points.length} Zeitpunkte"><title>${esc(label)} ${esc(period)}</title>${grid}${paths}${dots}${xticks}</svg></div><p class="insight-figure-note">${aggregate?'Wochendurchschnitt aus gemessenen Tagen':'Nur tatsächlich erfasste Tage; Linien unterbrochen bei Lücken'} · ${valid.length} Tage · fehlende Werte werden nicht zu Null ergänzt.</p>`;
}
const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
const kpi=(name,value,detail)=>`<article class="insight-kpi"><span>${esc(name)}</span><strong>${esc(value)}</strong><small>${esc(detail)}</small></article>`;
export function fitnessInsightsView(imported={},healthDays=[],period='28',today=new Date().toLocaleDateString('sv-SE'),personalActivities=[],sportsUI=null){
 const range=sportsUI?sportsPeriodWindow(sportsUI.mode,sportsUI.anchor,today):insightsRange(today,period);
 const rows=joinedFitnessDays(imported,healthDays,today,sportsUI?range:period);
 const withSteps=rows.filter(x=>finite(x.steps)),distance=rows.filter(x=>finite(x.distanceKm)),exercise=rows.filter(x=>finite(x.exerciseMinutes)),active=rows.filter(x=>finite(x.activeMinutes));
 const sessions=(imported?.garminSessions||[]).filter(s=>s.day<=range.end&&(!range.start||s.day>=range.start)).sort((a,b)=>b.start.localeCompare(a.start));
 const garminDays=rows.filter(x=>x.stepsSource==='Garmin FIT').length;
 return `<section class="insight-fitness-view" aria-label="Garmin und Health Connect Aktivität">
 <div class="insight-kpi-grid">${kpi('Ø Schritte',num(mean(withSteps.map(r=>r.steps))),'pro erfasstem Tag · Garmin vor Health Connect')}${kpi('Ø Strecke',num(mean(distance.map(r=>r.distanceKm)),2)+' km','Garmin-Monitoring · Gehen/Laufen')}${kpi('Ø Training',num(mean(exercise.map(r=>r.exerciseMinutes)))+' min','Health Connect · pro erfasstem Tag')}${kpi('Garmin-Aktivitäten',num(sessions.length),'Garmin FIT / Activities.csv')}</div>
 <div class="insight-data-note">${rows.length} Tage mit Datensätzen im ausgewählten Zeitraum. Schritte werden je Tag <strong>entweder aus Garmin (${garminDays} Tage) oder Health Connect</strong> übernommen und niemals addiert. Garmin-FIT-Schritte sind Tages-Zählerstände aus Walking/Running-Monitoring; Aktions-/Trainingsminuten werden nicht mit Health-Connect-Intensitätsminuten gleichgesetzt.</div>
 ${sportsInsightsView(imported?.garminSessions||[],personalActivities,sportsUI?sportsPeriodWindow(sportsUI.mode,sportsUI.anchor,today):range,sportsUI||{})}
 <div class="insight-chart-grid"><article class="insight-chart-card"><div class="insight-figure-title"><div><small>01 · MOVEMENT</small><h3>Schritte im Zeitverlauf</h3></div><strong>${num(withSteps.length)} Tage</strong></div>${lineChart(rows,'steps','#368B7D','Schritte','Schritte',sportsUI?.mode||period)}</article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>02 · DISTANCE</small><h3>Gehen & Laufen</h3></div><strong>${num(distance.length)} Tage</strong></div>${lineChart(rows,'distanceKm','#4C80AD','km','Strecke',sportsUI?.mode||period)}<p class="insight-figure-note">Nur dokumentierte FIT-Monitoring-Distanz. GPS-Routen werden nicht importiert.</p></article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>03 · EXERCISE</small><h3>Training über Health Connect</h3></div></div>${lineChart(rows,'exerciseMinutes','#B07E60','min','Trainingsminuten',sportsUI?.mode||period)}</article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>04 · ACTIVE TIME</small><h3>Garmin-Geh-/Laufzeit</h3></div></div>${lineChart(rows,'activeMinutes','#A38AC5','min','Geh-/Laufzeit',sportsUI?.mode||period)}<p class="insight-figure-note">Garmin-Monitoring-Zähler; keine offiziellen Intensitätsminuten oder unabhängigen Trainingseinheiten.</p></article></div>
 <details class="insight-chart-card fitness-sessions-details"><summary>Einzelne Garmin-Trainings ansehen · ${num(sessions.length)} im Zeitraum</summary>
 ${sessions.length?`<div class="insight-fitness-sessions">${sessions.map(s=>`<div class="insight-session-row"><div><strong>${esc(s.title||sportNames[s.sport]||'Sportaktivität')}</strong><small>${esc(dayLabel(s.day))} · ${esc(s.start.slice(11,16))} ${s.localTimeNoOffset?'(Garmin-CSV, Zeitzone offen)':'UTC'}</small></div><span>${finite(s.durationMinutes)?esc(num(s.durationMinutes,1))+' min':'–'}</span><span>${normalizedSportDistance(s,/swimm?ing/i.test(s.title+' '+s.activityType)?'swimming':'other')!==null?esc(num(normalizedSportDistance(s,/swimm?ing/i.test(s.title+' '+s.activityType)?'swimming':'other'),2))+' km':'–'}</span><span>${finite(s.avgHr)?esc(num(s.avgHr))+' bpm':'–'}</span></div>`).join('')}</div>`:'<p class="insight-no-data">Noch keine Garmin-Trainingssessions importiert. Die Tages-Wellness-ZIPs enthalten oft nur Monitoring-Werte. Einzelne Trainings-FITs können zusätzlich importiert werden.</p>'}
 <p class="insight-figure-note">Nur tatsächlich im Export enthaltene Sessions, keine künstlich erzeugten Aktivitäten. Garmin-Activities-CSV: Uhrzeiten ohne Zeitzone; Freiwasser-Schwimmdistanzen in Metern werden zu km umgerechnet; übrige Einheiten nach Garmin-Export prüfen. Keine Karten- oder Positionsdaten gespeichert.</p></details>
 <div class="insight-footnote">Die dargestellten Schritte, Aktivitätszeiten und Distanzen sind Gerätewerte und können aufgrund unvollständiger FIT-Tagesdateien unter den Garmin-Connect-Werten liegen. Für genaue Tageswerte benötigst du vollständig exportierte Monitoring-Dateien.</div></section>`;
}
