/** Compass 0.5.50 – Sleep Intelligence.
 * Measured Garmin nights only. Dates are anchored to the night/day field (UTC calendar math),
 * and missing or partial data are never replaced by zero or interpreted as illness.
 */
import {percentile} from './insights-stats.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(`${d}T12:00:00Z`));
const time=d=>Date.parse(`${d}T12:00:00Z`);
const shift=(d,n)=>new Date(time(d)+n*86400000).toISOString().slice(0,10);
export const sleepHM=v=>Number.isFinite(v)&&v>=0?`${Math.floor(Math.round(v)/60)} h ${String(Math.round(v)%60).padStart(2,'0')} min`:'–';
const minsShort=v=>Number.isFinite(v)&&v>=0?`${Math.floor(Math.round(v)/60)}:${String(Math.round(v)%60).padStart(2,'0')}`:'–';
const mean=a=>{const vals=a.filter(v=>Number.isFinite(v)&&v>=0);return vals.length?vals.reduce((s,v)=>s+v,0)/vals.length:null;};
const dateLabel=d=>new Date(time(d)).toLocaleDateString('de-AT',{day:'numeric',month:'short'});
const weekdayLabel=d=>new Date(time(d)).toLocaleDateString('de-AT',{weekday:'short'});
const monthLabel=d=>new Date(`${d}T12:00:00Z`).toLocaleDateString('de-AT',{month:'short'});
const stages=[['deep','Tief','#4367A5'],['rem','REM','#AE86C3'],['light','Leicht','#A0B4DD']];
function validNight(n){return validDay(n?.day)&&Number.isFinite(n.sleepMinutes)&&n.sleepMinutes>0&&n.sleepMinutes<=1440;}
function nightsIn(nights,start,end){return (nights||[]).filter(n=>validNight(n)&&n.day>=start&&n.day<=end);}
export function compareSleepWindows(nights,today,unit='week'){
 if(!validDay(today))return {current:[],previous:[],currentMean:null,previousMean:null,delta:null,unit};
 let start,end,previousStart,previousEnd;
 if(unit==='month'){
  const dayOfMonth=Number(today.slice(8));start=today.slice(0,7)+'-01';end=today;
  const year=Number(today.slice(0,4)),month=Number(today.slice(5,7));
  const previousMonth=new Date(Date.UTC(year,month-2,1));previousStart=previousMonth.toISOString().slice(0,10);
  const lastDay=new Date(Date.UTC(previousMonth.getUTCFullYear(),previousMonth.getUTCMonth()+1,0)).getUTCDate();
  previousEnd=previousStart.slice(0,8)+String(Math.min(dayOfMonth,lastDay)).padStart(2,'0');
 }else{
  const weekDay=(new Date(time(today)).getUTCDay()+6)%7;
  start=shift(today,-weekDay);end=today;previousStart=shift(start,-7);previousEnd=shift(end,-7);
 }
 const current=nightsIn(nights,start,end),previous=nightsIn(nights,previousStart,previousEnd);
 const currentMean=mean(current.map(n=>n.sleepMinutes)),previousMean=mean(previous.map(n=>n.sleepMinutes));
 // Never describe a difference from one or two nights as an established trend.
 const delta=current.length>=3&&previous.length>=3?currentMean-previousMean:null;
 return {unit,start,end,previousStart,previousEnd,current,previous,currentMean,previousMean,delta,comparable:delta!==null};
}
export function sleepMonthSummaries(nights,today,months=12){
 if(!validDay(today))return [];
 const yyyy=Number(today.slice(0,4)),mm=Number(today.slice(5,7));
 return Array.from({length:months},(_,i)=>{
  const month=new Date(Date.UTC(yyyy,mm-months+i,1)); // mm is 1-based; current at i=months-1
  const start=month.toISOString().slice(0,10),next=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth()+1,1));
  const last=shift(next.toISOString().slice(0,10),-1),end=last>today?today:last;
  const rows=nightsIn(nights,start,end);const days=Math.max(0,Math.round((time(end)-time(start))/86400000)+1);
  return {month:start.slice(0,7),start,end,days,rows,count:rows.length,mean:mean(rows.map(n=>n.sleepMinutes)),
   deep:mean(rows.map(n=>n.totals?.deep)),rem:mean(rows.map(n=>n.totals?.rem)),light:mean(rows.map(n=>n.totals?.light))};
 });
}
export function sleepPersonalReference(nights,selectedDay,field='sleepMinutes'){
 if(!validDay(selectedDay))return {count:0,low:null,high:null,median:null,status:'unknown'};
 const candidate=(nights||[]).filter(n=>validNight(n)&&n.day<selectedDay&&n.day>=shift(selectedDay,-60));
 const pick=n=>field==='sleepMinutes'?n.sleepMinutes:n.totals?.[field];
 const vals=candidate.map(pick).filter(x=>Number.isFinite(x)&&x>=0),n=(nights||[]).find(n=>n.day===selectedDay);
 const value=n?pick(n):null;
 if(vals.length<14||!Number.isFinite(value))return {count:vals.length,low:null,high:null,median:null,status:'unknown'};
 const low=percentile(vals,.1),high=percentile(vals,.9),median=percentile(vals,.5);
 return {count:vals.length,low,high,median,status:value<low?'below':value>high?'above':'usual'};
}
export function sleepCoverageWeek(nights,today){
 if(!validDay(today))return [];
 const map=new Map((nights||[]).filter(validNight).map(n=>[n.day,n]));
 return Array.from({length:7},(_,i)=>{const day=shift(today,i-6);return {day,night:map.get(day)||null};});
}
function segmentParts(n){return stages.map(([key,label,color])=>[key,label,color,Number.isFinite(n.totals?.[key])&&n.totals[key]>=0?n.totals[key]:0]);}
function phasesBars(nights,today,selected){
 const rows=sleepCoverageWeek(nights,today),max=Math.max(540,...rows.map(x=>x.night?.sleepMinutes||0));
 return `<div class="sleep550-week-list" aria-label="Schlafphasen der letzten sieben Kalendertage">${rows.map(({day,night})=>{
  const measured=Boolean(night),segments=measured?segmentParts(night):[];
  const bars=measured?segments.map(([k,label,color,duration])=>`<span class="sleep550-stage-segment" style="width:${(duration/max*100).toFixed(2)}%;background:${color}" title="${esc(label)}: ${esc(sleepHM(duration))}"></span>`).join(''):'<span class="sleep550-missing-bar">Keine Messung</span>';
  return `<div class="sleep550-week-row ${day===selected?'is-selected':''}"><span class="sleep550-week-day">${esc(weekdayLabel(day))}<small>${esc(dateLabel(day))}</small></span>${measured?`<button class="sleep550-week-button" type="button" data-action="insights-night-day" data-id="${esc(day)}" title="${esc(dateLabel(day))} · ${esc(sleepHM(night.sleepMinutes))} · Details anzeigen" aria-pressed="${day===selected}"><span class="sleep550-week-rail">${bars}</span></button>`:`<div class="sleep550-week-button no-data"><span class="sleep550-week-rail">${bars}</span></div>`}<strong>${measured?esc(minsShort(night.sleepMinutes)):'–'}</strong></div>`;
 }).join('')}</div>`;
}
function deltaText(comparison){
 if(!comparison.comparable)return 'Vergleich erst ab 3 gemessenen Nächten pro Zeitraum';
 const n=Math.round(comparison.delta);if(Math.abs(n)<1)return '±0 min';return `${n>0?'+':'−'}${Math.abs(n)} min`;
}
function metricsCard(title,period,field='sleepMinutes'){
 const m=mean(period.current.map(n=>field==='sleepMinutes'?n.sleepMinutes:n.totals?.[field]));
 return `<div class="sleep550-metric"><span>${esc(title)}</span><strong>${esc(sleepHM(m))}</strong><small>${period.current.length} Nächte erfasst</small></div>`;
}
/** Garmin-like, continuous stepped stage timeline. Breaks represent unobserved intervals. */
export function sleepStageCurve(night,timeZone){
 if(!Array.isArray(night?.stages)||!night.stages.length)return '<p class="sleep550-no-data">Keine detaillierten Schlafphasen in dieser Nacht gespeichert.</p>';
 const from=Date.parse(night.start),to=Date.parse(night.end);
 if(!Number.isFinite(from)||!Number.isFinite(to)||to<=from)return '<p class="sleep550-no-data">Zeitstempel für die Schlafphasen fehlen.</p>';
 const W=750,H=194,L=54,R=12,T=15,B=32,w=W-L-R,h=H-T-B;
 const definitions=[['Wach',1,'#DCA471'],['REM',4,'#B789CC'],['Leicht',2,'#9DB6E4'],['Tief',3,'#5B82BA']];
 const yFor=stage=>T+definitions.findIndex(x=>x[1]===stage)*(h/3);
 const xFor=ms=>L+(ms-from)/(to-from)*w;
 const clock=iso=>{try{return new Intl.DateTimeFormat('de-AT',{hour:'2-digit',minute:'2-digit',timeZone:timeZone||undefined}).format(new Date(iso));}catch{return '–';}};
 const grid=definitions.map(([label,,color],i)=>{const y=T+i*h/3;return `<line x1="${L}" x2="${W-R}" y1="${y}" y2="${y}" stroke="#344B60" stroke-width="1"/><text x="${L-9}" y="${y+4}" font-size="11" text-anchor="end" fill="#C2D3E0">${label}</text>`;}).join('');
 const records=night.stages.filter(s=>definitions.some(x=>x[1]===s.stage)&&Number.isFinite(Date.parse(s.start))&&Number.isFinite(Date.parse(s.end)))
  .map(s=>({...s,a:Math.max(from,Date.parse(s.start)),b:Math.min(to,Date.parse(s.end))}))
  .filter(s=>s.b>s.a).sort((a,b)=>a.a-b.a);
 let last=null,plot='';
 for(const s of records){
  const ya=yFor(s.stage),xa=xFor(s.a),xb=xFor(s.b),paint=definitions.find(x=>x[1]===s.stage)[2];
  if(last&&s.a-last.b>=0&&s.a-last.b<=60000){
   const xc=xFor(s.a),yp=yFor(last.stage);
   if(yp!==ya)plot+=`<line x1="${xc.toFixed(1)}" x2="${xc.toFixed(1)}" y1="${yp.toFixed(1)}" y2="${ya.toFixed(1)}" stroke="#749BBA" stroke-width="2.2"/>`;
  }
  plot+=`<line x1="${xa.toFixed(1)}" x2="${xb.toFixed(1)}" y1="${ya.toFixed(1)}" y2="${ya.toFixed(1)}" stroke="${paint}" stroke-width="5" stroke-linecap="round"><title>${esc(definitions.find(x=>x[1]===s.stage)[0])} · ${esc(clock(s.start))}–${esc(clock(s.end))}</title></line>`;
  last=s;
 }
 if(!plot)return '<p class="sleep550-no-data">Keine gültigen Schlafphasen innerhalb der Nacht.</p>';
 const axis=[0,.25,.5,.75,1].map(t=>{const at=new Date(from+(to-from)*t).toISOString();return `<text x="${L+w*t}" y="${H-9}" font-size="10" text-anchor="${t===0?'start':t===1?'end':'middle'}" fill="#ADBECA">${esc(clock(at))}</text>`;}).join('');
 return `<div class="sleep550-stage-curve"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Schlafphasen im Tagesverlauf; ungemessene Zeiträume bleiben getrennt">${grid}${plot}${axis}</svg></div>`;
}
function nightDetails(night,nights,sleepTimeline,timezone){
 if(!night)return `<aside class="sleep550-detail"><h3>Nacht auswählen</h3><p>Noch keine Schlafmessungen für diesen Zeitraum. Leere Tage bleiben fehlende Daten.</p></aside>`;
 const ref=sleepPersonalReference(nights,night.day);const bed=Date.parse(night.start),wake=Date.parse(night.end);
 const inBed=Number.isFinite(bed)&&Number.isFinite(wake)&&wake>bed&&wake-bed<=24*3600000?(wake-bed)/60000:null;
 const eff=Number.isFinite(inBed)&&inBed>=night.sleepMinutes&&inBed<=960?Math.round(night.sleepMinutes/inBed*100):null;
 const zone=timezone||undefined;const clock=iso=>{if(!iso||!Number.isFinite(Date.parse(iso)))return '–';try{return new Intl.DateTimeFormat('de-AT',{hour:'2-digit',minute:'2-digit',timeZone:zone}).format(new Date(iso));}catch{return '–';}};
 const refNote=ref.status==='unknown'?`Noch keine belastbare persönliche Referenz · ${ref.count}/14 vorangegangene Nächte in 60 Tagen`:
  `Schlafdauer ${ref.status==='below'?'unter':ref.status==='above'?'über':'innerhalb'} der eigenen beobachteten 10.–90.-Perzentil-Spanne (${sleepHM(ref.low)}–${sleepHM(ref.high)}, ${ref.count} Nächte)`;
 return `<aside class="sleep550-detail" aria-label="Schlafnacht ${esc(night.day)}"><div class="sleep550-detail-heading"><span>DETAIL EINER NACHT</span><strong>${esc(new Date(time(night.day)).toLocaleDateString('de-AT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}))}</strong></div><div class="sleep550-detail-metrics"><div><span>Gesamtschlaf</span><strong>${esc(sleepHM(night.sleepMinutes))}</strong></div><div><span>Zeit im Bett</span><strong>${esc(sleepHM(inBed))}</strong></div><div><span>Effizienz*</span><strong>${eff===null?'–':eff+' %'}</strong></div><div><span>Einschlafen / Aufwachen</span><strong>${esc(clock(night.start))} – ${esc(clock(night.end))}</strong></div></div>${sleepStageCurve(night,timezone)}<div class="sleep550-detail-phases">${segmentParts(night).map(([,label,color,val])=>`<span><i style="background:${color}"></i>${esc(label)} ${esc(sleepHM(val))}</span>`).join('')}</div><div class="sleep550-reference">${esc(refNote)}</div><small class="sleep550-detail-note">*Zeit im Bett und Effizienz nur bei plausiblen Start-/Endzeiten; Garmin-Schlafstadien sind Schätzungen. Die persönliche Spanne ist keine medizinische Norm. Uhrzeiten: ${esc(timezone||'Gerät')}.</small></aside>`;
}
function sleepTrendSvg(nights,today,period){
 const cap=period==='7'?7:period==='28'?28:period==='90'?90:90,start=shift(today,1-cap);
 const rows=nightsIn(nights,start,today);if(rows.length<2)return `<p class="sleep550-no-data">Noch nicht genügend Nächte für eine Trendlinie.</p>`;
 const W=760,H=190,L=52,R=20,T=16,B=34,ww=W-L-R,hh=H-T-B;
 const vals=rows.map(n=>n.sleepMinutes),lo=Math.max(0,Math.min(...vals)-60),hi=Math.max(...vals,480)+50;
 const X=d=>L+(time(d)-time(start))/(Math.max(1,time(today)-time(start)))*ww,Y=v=>T+hh-(v-lo)/(hi-lo||1)*hh;
 const grid=[0,.5,1].map(t=>{const v=lo+(hi-lo)*t;return `<line x1="${L}" y1="${Y(v)}" x2="${W-R}" y2="${Y(v)}" stroke="#E6EDE8"/><text x="${L-7}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="#809389">${esc(minsShort(v))}</text>`;}).join('');
 const dots=rows.map(n=>`<circle cx="${X(n.day).toFixed(1)}" cy="${Y(n.sleepMinutes).toFixed(1)}" r="${rows.length>60?2.5:4}" fill="#367B68"><title>${esc(dateLabel(n.day))}: ${esc(sleepHM(n.sleepMinutes))}</title></circle>`).join('');
 let paths=[],current=[];for(const n of rows){if(current.length&&time(n.day)-time(current.at(-1).day)>86400000*1.5){if(current.length>1)paths.push(current);current=[];}current.push(n);}if(current.length>1)paths.push(current);
 const lines=paths.map(p=>`<polyline points="${p.map(n=>`${X(n.day).toFixed(1)},${Y(n.sleepMinutes).toFixed(1)}`).join(' ')}" fill="none" stroke="#367B68" stroke-width="2"/>`).join('');
 const averages=rows.map(n=>{const last=nightsIn(nights,shift(n.day,-6),n.day);return {...n,avg:last.length>=3?mean(last.map(x=>x.sleepMinutes)):null};}).filter(n=>n.avg!==null);
 let avgPaths=[],chunk=[];for(const n of averages){if(chunk.length&&time(n.day)-time(chunk.at(-1).day)>86400000*1.5){if(chunk.length>1)avgPaths.push(chunk);chunk=[];}chunk.push(n);}if(chunk.length>1)avgPaths.push(chunk);
 const averageLines=avgPaths.map(p=>`<polyline points="${p.map(n=>`${X(n.day).toFixed(1)},${Y(n.avg).toFixed(1)}`).join(' ')}" fill="none" stroke="#B28BBA" stroke-width="3" stroke-linecap="round"/>`).join('');
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Schlafdauer pro Nacht in Stunden und Minuten und gleitender 7-Tage-Durchschnitt; Lücken nicht verbunden">${grid}${lines}${averageLines}${dots}<text x="${L}" y="${H-8}" font-size="11" fill="#809389">${esc(dateLabel(start))}</text><text x="${W-R}" y="${H-8}" font-size="11" text-anchor="end" fill="#809389">${esc(dateLabel(today))}</text></svg><div class="sleep550-legend">● Einzelne Nacht <span>━ Gleitender 7-Tage-Mittelwert (mind. 3 Nächte)</span></div>`;
}
function sleepAnnualView(nights,today){
 const months=sleepMonthSummaries(nights,today);const dates=months.filter(m=>m.count).map(m=>m.month),yearLabel=dates.length?`${dates[0]} – ${dates.at(-1)}`:'Letzte 12 Monate';
 const max=Math.max(540,...months.filter(m=>Number.isFinite(m.mean)).map(m=>m.mean));
 const chart=`<div class="sleep550-year-columns">${months.map(m=>`<div class="sleep550-year-month"><div class="sleep550-year-bar-space">${m.mean!==null?`<span class="sleep550-year-fill" style="height:${(m.mean/max*100).toFixed(2)}%" title="${esc(m.month)} · Ø ${esc(sleepHM(m.mean))} · ${m.count} von ${m.days} Nächten"></span>`:''}</div><span>${esc(monthLabel(m.start))}</span><strong>${m.mean!==null?esc(minsShort(m.mean)):'–'}</strong><small>${m.count}/${m.days}</small></div>`).join('')}</div>`;
 const nightsByDay=new Map((nights||[]).filter(validNight).map(n=>[n.day,n]));
 const heatmap=`<div class="sleep550-calendar-months">${months.map(m=>{const days=[];const firstWeekday=(new Date(time(m.start)).getUTCDay()+6)%7;for(let i=0;i<firstWeekday;i++)days.push('<span class="sleep550-cal-empty"></span>');for(let day=m.start;day<=m.end;day=shift(day,1)){
  const n=nightsByDay.get(day),pct=n?Math.max(1,Math.min(4,Math.ceil(n.sleepMinutes/150))):0;
  days.push(n?`<button type="button" class="sleep550-cal-dot sleep550-cal-${pct}" data-action="insights-night-day" data-id="${esc(day)}" title="${esc(day)} · ${esc(sleepHM(n.sleepMinutes))}" aria-label="${esc(day)}: ${esc(sleepHM(n.sleepMinutes))}"></button>`:`<span class="sleep550-cal-dot sleep550-cal-0" title="${esc(day)} · keine Messung"></span>`);
 }return `<div class="sleep550-cal-month"><strong>${esc(monthLabel(m.start))} ${esc(m.start.slice(0,4))}</strong><div class="sleep550-cal-grid">${days.join('')}</div></div>`;}).join('')}</div>`;
 return `<section class="sleep550-year insight-chart-card"><div class="insight-figure-title"><div><small>JAHRESÜBERBLICK</small><h3>Schlaf über zwölf Monate</h3></div></div><p class="sleep550-subnote">${esc(yearLabel)} · Durchschnitt je <em>gemessener</em> Nacht, in h:min · darunter erfasste Nächte / Kalendertage. Der erste Monat kann im rollierenden Jahresfenster unvollständig sein.</p>${chart}<details class="sleep550-extra"><summary>365-Tage-Kalender und Datenabdeckung ansehen</summary><div class="sleep550-calendar-legend">Je dunkler, desto länger die gemessene Schlafdauer · <span class="sleep550-cal-dot sleep550-cal-0"></span> keine Messung</div>${heatmap}<p class="sleep550-subnote">Eine fehlende Messung ist weder eine Null-Stunden-Nacht noch ein Nachweis, dass die Uhr nicht getragen wurde. Kalender-/Lehrphasen werden in dieser Version noch nicht automatisch als Ursachen interpretiert.</p></details></section>`;
}
function sleepPhaseBoxDots(nights,today){
 const rows=nightsIn(nights,shift(today,-29),today);if(rows.length<4)return '<p class="sleep550-no-data">Für die Phasenverteilung benötigen wir mindestens vier gemessene Nächte.</p>';
 const W=700,H=184,L=64,R=18,T=17,B=22,w=W-L-R,rowH=50;
 const keys=[['deep','Tief','#4367A5'],['rem','REM','#AE86C3'],['light','Leicht','#A0B4DD']];
 const max=Math.max(300,...rows.flatMap(n=>keys.map(([k])=>n.totals?.[k]||0)))*1.1;
 const X=v=>L+Math.max(0,Math.min(1,v/max))*w;
 const elements=keys.map(([key,label,color],idx)=>{
  const vals=rows.map(n=>n.totals?.[key]).filter(v=>Number.isFinite(v)&&v>=0);if(!vals.length)return '';
  const med=percentile(vals,.5),q1=percentile(vals,.25),q3=percentile(vals,.75),y=T+idx*rowH+19;
  const dots=vals.map((v,i)=>`<circle cx="${X(v).toFixed(1)}" cy="${(y+((i*7)%11-5)).toFixed(1)}" r="2.7" fill="${color}" opacity=".58"><title>${esc(label)}: ${esc(sleepHM(v))}</title></circle>`).join('');
  return `<text x="${L-8}" y="${y+3}" font-size="12" text-anchor="end" fill="#597367">${esc(label)}</text><line x1="${X(Math.min(...vals))}" x2="${X(Math.max(...vals))}" y1="${y}" y2="${y}" stroke="#B2C8BD" stroke-width="1.5"/><rect x="${X(q1)}" y="${y-9}" width="${Math.max(1,X(q3)-X(q1))}" height="18" rx="4" fill="${color}" opacity=".35"/>${dots}<line x1="${X(med)}" x2="${X(med)}" y1="${y-11}" y2="${y+11}" stroke="#294D43" stroke-width="2"><title>Median ${esc(sleepHM(med))}</title></line>`;
 }).join('');
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Boxplot und einzelne Schlafphasenwerte der letzten 30 Nächte in Minuten">${elements}<text x="${L}" y="${H-5}" font-size="11" fill="#7B9287">0 min</text><text x="${W-R}" y="${H-5}" text-anchor="end" font-size="11" fill="#7B9287">${esc(sleepHM(max))}</text></svg><p class="sleep550-subnote">Punkte = einzelne Nächte, Box = mittlere 50 % (IQR), dunkler Strich = Median. Kein medizinischer Grenzbereich.</p>`;
}
export function renderSleepIntelligence({nights=[],selectedNight='',today='',period='28',timeZone='',sleepTimeline=()=>''}={}){
 const valid=nights.filter(validNight).sort((a,b)=>a.day.localeCompare(b.day));
 const latest=valid.find(n=>n.day===selectedNight)||valid.at(-1)||null;
 const weekly=compareSleepWindows(valid,today,'week'),monthly=compareSleepWindows(valid,today,'month');
 const recent=nightsIn(valid,shift(today,-6),today),baseline=nightsIn(valid,shift(today,-36),shift(today,-7));
 const recentAvg=mean(recent.map(n=>n.sleepMinutes)),baselineAvg=baseline.length>=10?mean(baseline.map(n=>n.sleepMinutes)):null;
 const change=recent.length>=3&&Number.isFinite(baselineAvg)?recentAvg-baselineAvg:null;
 const insight=change===null?'Für einen belastbareren Verlauf fehlen noch Vergleichsnächte.':change<=-30?`In den letzten 7 Tagen lag deine gemessene Schlafdauer im Mittel ${Math.abs(Math.round(change))} Minuten unter dem Vergleichszeitraum. Das kann Anlass sein, Schlafbedarf und Tagesmüdigkeit zu beachten.`:change>=30?`Die mittlere Schlafdauer lag ${Math.round(change)} Minuten über deinem vorherigen Verlauf.`:'Deine mittlere Schlafdauer liegt derzeit nahe deinem vorherigen Verlauf.';
 const showYear=period==='365'||period==='all';
 return `<section class="sleep550" aria-label="Sleep Intelligence – persönliche Schlaftrends">
  <header class="sleep550-lead"><div><span>SLEEP INTELLIGENCE</span><h3>Schlaf im Überblick</h3></div><small>Stunden & Minuten · nur gemessene Nächte</small></header>
  <div class="sleep550-summary">
   <div class="sleep550-summary-main"><span>Ø diese Woche (bisher)</span><strong>${esc(sleepHM(weekly.currentMean))}</strong><small>${esc(deltaText(weekly))} zur gleichen Zeit der Vorwoche · ${weekly.current.length}/${weekly.previous.length} Nächte</small></div>
   <div class="sleep550-summary-main"><span>Ø dieser Monat (bisher)</span><strong>${esc(sleepHM(monthly.currentMean))}</strong><small>${esc(deltaText(monthly))} zum gleichen Teil des Vormonats · ${monthly.current.length}/${monthly.previous.length} Nächte</small></div>
   ${metricsCard('Ø Tiefschlaf · Woche',weekly,'deep')}${metricsCard('Ø REM · Woche',weekly,'rem')}
  </div>
  <div class="sleep550-insight-note"><span>${esc(insight)}</span><small>Vergleich: letzte 7 Tage zu den 30 Tagen davor (${recent.length}/${baseline.length} Nächte). Kein Nachweis einer Übermüdung.</small></div>
  <div class="sleep550-primary"><article class="sleep550-week insight-chart-card"><div class="insight-figure-title"><div><small>01 · SLEEP STAGES</small><h3>Letzte 7 Tage</h3></div></div><div class="sleep550-phases-legend">${stages.map(([,name,color])=>`<span><i style="background:${color}"></i>${esc(name)}</span>`).join('')}</div>${phasesBars(valid,today,latest?.day)}<p class="sleep550-subnote">Die Balkenlänge entspricht der gesamten Schlafdauer. Fehlende Tage sind keine Null-Stunden-Nächte. Tag anklicken für Details.</p></article>
  ${nightDetails(latest,valid,sleepTimeline,timeZone)}</div>
  <article class="insight-chart-card sleep550-trend"><div class="insight-figure-title"><div><small>02 · SLEEP TREND</small><h3>Schlafdauer im Verlauf</h3></div></div>${sleepTrendSvg(valid,today,period)}</article>
  ${showYear?sleepAnnualView(valid,today):`<div class="sleep550-year-teaser"><span>Langfristige Trends, Monate & mögliche Saisoneffekte</span><button type="button" data-action="insights-period" data-id="365">Jahresübersicht ansehen →</button></div>`}
  <details class="sleep550-extra sleep550-statistics"><summary>Schlafphasen-Verteilung · Boxplot & einzelne Nächte</summary>${sleepPhaseBoxDots(valid,today)}</details>
 </section>`;
}
