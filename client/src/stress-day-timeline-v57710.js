/** Compass 0.5.77.10 — a single, local-only day timeline of real Garmin stress
 * samples, concrete calendar appointments, Garmin/Compass activities and manually
 * recorded time. Calendar = scheduled, not evidence of attendance. No imputation.
 */
import {timedRows,genericStressCalendarBlock} from './stress-context-v5778.js';
const MIN=60000;
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hm=x=>new Date(x).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const dayStamp=d=>{const x=new Date(d);return [x.getFullYear(),String(x.getMonth()+1).padStart(2,'0'),String(x.getDate()).padStart(2,'0')].join('-');};
const isGenericWork=genericStressCalendarBlock;
const truncate=(s,n)=>s.length<=n?s:s.slice(0,n-1)+'…';
const good=p=>Number.isFinite(p.stress)&&p.stress>=0&&p.stress<=100&&Number.isFinite(Date.parse(p.at));
export function buildStressDayTimeline({daySummary,calendarEvents=[],activities=[],garminSessions=[],timeRows=[],calendarCoverage=null,rules=[],overrides={}}={}){
 if(!daySummary?.day)return null;
 const day=daySummary.day,base=new Date(`${day}T00:00:00`).getTime(),next=new Date(base);next.setDate(next.getDate()+1);
 const end=next.getTime(),within=x=>x.end>base&&x.start<end;
 const idx=timedRows(calendarEvents,activities,garminSessions,rules,overrides);
 const appointments=idx.calendarRows.filter(within).map(e=>({...e,generic:isGenericWork(e.title)})).sort((a,b)=>a.start-b.start);
 const recorded=idx.activityRows.filter(within).map(e=>({...e,recorded:true}));
 const manual=(Array.isArray(timeRows)?timeRows:[]).filter(e=>!e.deleted).flatMap(e=>{
  const start=Date.parse(e.start),stop=Date.parse(e.end);if(!Number.isFinite(start)||!Number.isFinite(stop)||stop<=start||stop-start>48*3600000)return [];
  const title=String(e.title||e.project||'').trim();
  if(!title||isGenericWork(title))return []; // bare clock-in is context, not a performed activity
  if(!within({start,end:stop}))return [];
  if(recorded.some(x=>Math.abs(x.start-start)<2*MIN&&Math.abs(x.end-stop)<5*MIN&&x.title.toLocaleLowerCase('de')===title.toLocaleLowerCase('de')))return [];
  return [{start,end:stop,title:title.slice(0,150),category:'Zeitprotokoll',source:'time-journal',recorded:true}];
 });
 const sessions=[...recorded,...manual].sort((a,b)=>a.start-b.start);
 const measurements=[...new Map((daySummary.points||[]).filter(good).filter(p=>dayStamp(p.at)===day).map(p=>[Date.parse(p.at),{time:Date.parse(p.at),value:p.stress}])).values()].sort((a,b)=>a.time-b.time);
 const periods=[['morning','Früh · 06–12 Uhr',6,12],['day','Tag · 12–18 Uhr',12,18],['evening','Abend · 18–24 Uhr',18,24]].map(([id,label,from,to])=>{
  const points=measurements.filter(p=>{const h=new Date(p.time).getHours();return h>=from&&h<to;});
  return {id,label,count:points.length,mean:points.length>=3?Math.round(points.reduce((s,p)=>s+p.value,0)/points.length):null,high:points.filter(p=>p.value>75).length};
 });
 const covered=calendarCoverage?.complete!==false&&calendarCoverage?.start<=day&&calendarCoverage?.end>=day;
 return {day,start:base,end,measurements,appointments,sessions,periods,calendarCovered:covered,calendarTotal:appointments.filter(x=>!x.generic).length,genericTotal:appointments.filter(x=>x.generic).length};
}
/** Use local wall-clock minutes across the day for axes; retained instant for matching.
 * Bars are clipped to the day, titles survive in SVG tooltips and the list below.
 */
export function stressDayTimelineView(model){
 if(!model)return '';
 const {measurements,appointments,sessions,periods}=model;
 const W=980,L=65,R=15,plot=W-L-R,H=345;
 const minutes=t=>{const d=new Date(t);return d.getHours()*60+d.getMinutes()+d.getSeconds()/60;};
 const pos=t=>L+Math.min(1440,Math.max(0,minutes(t)))/1440*plot;
 const interval=(e)=>{const s=Math.max(e.start,model.start),t=Math.min(e.end,model.end);const x=s===model.start?L:pos(s),right=t===model.end?W-R:pos(t);return {x,width:Math.max(1,right-x)};};
 const stressY=n=>182-n*1.40;
 const hours=[0,3,6,9,12,15,18,21,24].map(hr=>`<line x1="${L+hr/24*plot}" y1="29" x2="${L+hr/24*plot}" y2="327" stroke="#e2eae4"/><text x="${L+hr/24*plot}" y="21" font-size="11" text-anchor="middle" fill="#657e73">${String(hr).padStart(2,'0')}</text>`).join('');
 const grid=[0,25,50,75,100].map(n=>`<line x1="${L}" x2="${W-R}" y1="${stressY(n)}" y2="${stressY(n)}" stroke="#e1e9e3"/><text x="${L-9}" y="${stressY(n)+4}" text-anchor="end" fill="#688074" font-size="11">${n}</text>`).join('');
 const zones=`<rect x="${L}" y="${stressY(100)}" width="${plot}" height="${stressY(75)-stressY(100)}" fill="#d98678" opacity=".10"/>`;
 const segments=[];let current=[];for(const p of measurements){if(current.length&&p.time-current.at(-1).time>15*MIN){segments.push(current);current=[];}current.push(p);}if(current.length)segments.push(current);
 const trace=segments.map(g=>g.length>1?`<polyline fill="none" stroke="#ae6c51" stroke-width="2.2" stroke-linejoin="round" points="${g.map(p=>`${pos(p.time).toFixed(1)},${stressY(p.value).toFixed(1)}`).join(' ')}"/>`:`<circle cx="${pos(g[0].time).toFixed(1)}" cy="${stressY(g[0].value).toFixed(1)}" r="2.8" fill="#ae6c51"/>`).join('');
 const peaks=measurements.filter(p=>p.value>75).map(p=>`<circle cx="${pos(p.time).toFixed(1)}" cy="${stressY(p.value).toFixed(1)}" r="2.6" fill="#c44b3b"><title>${html(hm(p.time))} · Garmin ${p.value}</title></circle>`).join('');
 const bars=(items,y,colors)=>items.slice(0,28).map((e,i)=>{
  const {x,width}=interval(e),y0=y+(i%2)*17,fill=e.generic?'#d2d9d4':colors;
  const label=e.generic?'Arbeitsblock · ohne konkrete Tätigkeit':e.title;
  return `<rect x="${x.toFixed(1)}" y="${y0}" width="${width.toFixed(1)}" height="15" rx="4" fill="${fill}" opacity="${e.generic?'.40':'.85'}"><title>${html(hm(e.start))}–${html(hm(e.end))} · ${html(label)}${e.source==='calendar'?' (Kalender: geplant)':''}</title></rect>${width>88?`<text x="${(x+5).toFixed(1)}" y="${y0+11}" font-size="10" fill="${e.generic?'#627469':'white'}" pointer-events="none">${html(truncate(label,Math.min(32,Math.floor((width-10)/6.2))))}</text>`:''}`;
 }).join('');
 const real=appointments.filter(x=>!x.generic),generic=appointments.filter(x=>x.generic);
 const svg=`<div class="stress710-chart-scroll"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tageszeitstrahl mit gemessenen Garmin-Stresswerten, Kalendereinträgen und protokollierten Aktivitäten"><rect width="${W}" height="${H}" fill="transparent"/>${zones}${grid}${hours}<text x="5" y="95" font-size="11" fill="#567268">Stress</text><text x="5" y="232" font-size="11" fill="#567268">Kalender</text><text x="5" y="293" font-size="11" fill="#567268">Aktivität</text>${trace}${peaks}${bars(generic,215,'#d2d9d4')}${bars(real,215,'#437d84')}${bars(sessions,278,'#597f4c')}<line x1="${L}" x2="${W-R}" y1="332" y2="332" stroke="#cbdad0"/></svg></div>`;
 const formatRow=e=>`<li><span>${html(hm(e.start))}–${html(hm(e.end))}</span><strong>${html(e.title)}</strong><small>${e.source==='calendar'?'Kalender · geplant, Teilnahme nicht bestätigt':e.source==='time-journal'?'Zeitprotokoll · dokumentiert':e.source==='garmin'?'Garmin-Aktivität':'Aktivität · dokumentiert'}</small></li>`;
 const cards=periods.map(p=>`<div class="stress710-period"><span>${html(p.label)}</span><strong>${p.mean==null?'–':p.mean}</strong><small>${p.count?`${p.count.toLocaleString('de-AT')} Messungen · ${p.high} davon hoch`:'Keine Messwerte'}${p.count>0&&p.count<3?' · zu wenig für Ø':''}</small></div>`).join('');
 return `<section class="stress710-timeline" aria-label="Mein Tag: Stress und tatsächliche Ereignisse"><div class="stress-context-heading"><div><small>STRESS IM TAGESABLAUF · LOKAL</small><h3>Was stand an, als mein Stress stieg?</h3></div><span class="stress-context-chip">${measurements.length} gemessene Werte</span></div>
  <p class="stress-context-intro">Zeitstrahl mit <b>echten Garmin-Messungen</b>, <b>konkreten Kalenderterminen</b> sowie Garmin-/Compass-Aktivitäten und Zeitprotokollen. „Work“ ist nur ein neutraler Hintergrundblock, <b>kein nachgewiesenes Ereignis</b>.</p>
  <div class="stress710-periods">${cards}</div>${svg}
  <div class="stress710-legend"><span><i class="stress710-stress"></i> Garmin-Stress</span><span><i class="stress710-calendar"></i> Kalender · geplant</span><span><i class="stress710-activity"></i> Aktivität · erfasst</span><span><i class="stress710-generic"></i> Arbeitsblock ohne Details</span></div>
  ${!model.calendarCovered?'<p class="stress710-warning">Die Kalenderhistorie ist für diesen Tag nicht vollständig bestätigt. Fehlende Termine dürfen nicht als terminfreie Zeit interpretiert werden.</p>':''}
  <details class="stress710-details"><summary>${real.length} konkrete Kalendertermine · ${sessions.length} aufgezeichnete Aktivitäten im Detail</summary><div class="stress710-events"><div><h4>Konkrete Termine (nur Planung)</h4>${real.length?`<ul>${real.map(formatRow).join('')}</ul>`:'<p>Keine konkreten Termine in den geladenen Daten.</p>'}</div><div><h4>Erfasste Aktivitäten & Zeitprotokolle</h4>${sessions.length?`<ul>${sessions.map(formatRow).join('')}</ul>`:'<p>Keine protokollierten Aktivitäten für diesen Tag.</p>'}</div></div></details>
  <small class="stress710-foot">Es werden keine Stresswerte ergänzt oder zwischen Messlücken geschätzt. Körperliche Bewegung kann Garmin-Stresswerte und Messverfügbarkeit beeinflussen; Zeitgleichheit bedeutet keine Ursache. Für nicht aufgezeichnete Aktivitäten gibt es keine rückwirkende Zuordnung.</small>
 </section>`;
}
