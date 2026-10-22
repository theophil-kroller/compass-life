/** Compass 0.5.9: Garmin stress and Body Battery, offline and derived ONLY from imported FIT samples.
 * Recorded five-minute bucket samples. No imputation across absent periods or proprietary score reconstruction.
 */
import {insightsRange} from './insights.js';
import {rollingEnvelopeChart} from './health-rolling.js';
import {buildStressContext,stressContextView} from './stress-context-v5778.js';
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayFmt=new Intl.DateTimeFormat('sv-SE',{year:'numeric',month:'2-digit',day:'2-digit'});
const clockFmt=new Intl.DateTimeFormat('de-AT',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
const formatDay=day=>new Date(`${day}T12:00:00Z`).toLocaleDateString('de-AT',{day:'2-digit',month:'short'});
const num=n=>Number.isFinite(n)?n.toLocaleString('de-AT',{maximumFractionDigits:1}):'–';
export const stressZone=value=>!Number.isFinite(value)?null:value<=25?'Ruhe':value<=50?'Niedrig':value<=75?'Mittel':'Hoch';
const zones=[{label:'Ruhe',color:'#4C9C89'},{label:'Niedrig',color:'#A0C6A0'},{label:'Mittel',color:'#E1BA78'},{label:'Hoch',color:'#D98976'}];
export function buildWellnessInsights(imported={},today=new Date().toISOString().slice(0,10),period='28'){
 const range=insightsRange(today,period),all=Array.isArray(imported?.garminWellness)?imported.garminWellness:[];
 const days=new Map();let lastAt='';
 for(const point of all){
  if(typeof point?.at!=='string'||!Number.isFinite(Date.parse(point.at)))continue;
  const timestamp=Date.parse(point.at);
  if(timestamp>Date.parse(today+'T23:59:59Z')+86400000)continue;
  const day=dayFmt.format(new Date(timestamp));
  if((range.start&&day<range.start)||day>range.end)continue;
  const stress=Number.isFinite(point.stress)&&point.stress>=0&&point.stress<=100?point.stress:null;
  const bodyBattery=Number.isFinite(point.bodyBattery)&&point.bodyBattery>=0&&point.bodyBattery<=100?point.bodyBattery:null;
  if(stress===null&&bodyBattery===null)continue;
  const row={at:point.at,day,stress,bodyBattery};
  if(!days.has(day))days.set(day,[]);days.get(day).push(row);
  if(row.at>lastAt)lastAt=row.at;
 }
 const summaries=[];
 for(const [day,unsorted] of days){
  const points=unsorted.sort((a,b)=>a.at.localeCompare(b.at));
  const stress=points.map(p=>p.stress).filter(Number.isFinite),battery=points.map(p=>p.bodyBattery).filter(Number.isFinite);
  const categories=Object.fromEntries(zones.map(z=>[z.label,0]));
  for(const value of stress)categories[stressZone(value)]++;
  let charged=0,drained=0,previous=null;
  for(const p of points){
   if(p.bodyBattery===null)continue;
   // Changes are calculated only for nearby observations, not across measurement gaps.
   if(previous&&Date.parse(p.at)-Date.parse(previous.at)<=15*60000){const delta=p.bodyBattery-previous.bodyBattery;if(delta>0)charged+=delta;else drained-=delta;}
   previous=p;
  }
  summaries.push({day,points,stressCount:stress.length,batteryCount:battery.length,
   avgStress:stress.length?stress.reduce((a,b)=>a+b,0)/stress.length:null,
   minBattery:battery.length?Math.min(...battery):null,maxBattery:battery.length?Math.max(...battery):null,
   lastBattery:battery.length?battery.at(-1):null,charged:Math.round(charged),drained:Math.round(drained),categories});
 }
 summaries.sort((a,b)=>a.day.localeCompare(b.day));
 const stressDays=summaries.filter(d=>d.stressCount),batteryDays=summaries.filter(d=>d.batteryCount);
 const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
 const stressCount=stressDays.reduce((a,d)=>a+d.stressCount,0);
 const zoneCounts=Object.fromEntries(zones.map(z=>[z.label,stressDays.reduce((a,d)=>a+d.categories[z.label],0)]));
 return {range,summaries,stressDays,batteryDays,stressCount,zoneCounts,lastAt,
  avgStress:stressCount?stressDays.reduce((a,d)=>a+d.avgStress*d.stressCount,0)/stressCount:null,
  avgMinBattery:mean(batteryDays.map(d=>d.minBattery)),avgMaxBattery:mean(batteryDays.map(d=>d.maxBattery)),
  timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'Gerätezeitzone'};
}
function card(name,value,detail){return `<article class="insight-kpi"><span>${safe(name)}</span><strong>${safe(value)}</strong><small>${safe(detail)}</small></article>`;}
function note(message){return `<div class="insight-data-note">${safe(message)}</div>`;}
function missing(kind){return `<div class="insight-no-data">Noch keine ${safe(kind)}-Messwerte im lokalen Vault. Bitte die bereits importierten Garmin-ZIPs unter Datenquellen einmal erneut importieren. Das ergänzt die neuen Daten ohne doppelte Einträge.</div>`;}
function daySelector(summaries,day){
 const i=summaries.findIndex(x=>x.day===day),prior=i>0?summaries[i-1]:null,next=i>=0&&i<summaries.length-1?summaries[i+1]:null;
 const label=new Date(`${day}T12:00:00Z`).toLocaleDateString('de-AT',{weekday:'short',day:'2-digit',month:'long',year:'numeric'});
 return `<nav class="health-day-switch" aria-label="Tag wechseln"><button type="button" data-action="insights-wellness-day" data-id="${safe(prior?.day||'')}" aria-label="Vorheriger Messtag" ${prior?'':'disabled'}>←</button><strong>${safe(label)}</strong><button type="button" data-action="insights-wellness-day" data-id="${safe(next?.day||'')}" aria-label="Nächster Messtag" ${next?'':'disabled'}>→</button></nav>`;
}
function shell(title,index,content,caption=''){
 return `<article class="insight-chart-card"><div class="insight-figure-title"><div><small>${safe(index)}</small><h3>${safe(title)}</h3></div></div>${content}${caption?`<p class="insight-figure-note">${safe(caption)}</p>`:''}</article>`;
}
function lineSegments(points,field,color,{dayStart=null,endGap=15*60000}={}){
 let lines=[],current=[];
 for(const p of points){
  const val=p[field];if(!Number.isFinite(val)){if(current.length)lines.push(current);current=[];continue;}
  const t=Date.parse(p.at);if(current.length&&t-Date.parse(current.at(-1))>endGap){lines.push(current);current=[];}
  current.push(p);
 }
 if(current.length)lines.push(current);
 const X=p=>64+(Date.parse(p.at)-dayStart)/86400000*756;
 const Y=v=>175-v/100*145;
 return lines.map(line=>{
  const valid=line.filter(x=>Number.isFinite(x[field]));
  if(!valid.length)return '';
  return valid.length===1?`<circle cx="${X(valid[0]).toFixed(1)}" cy="${Y(valid[0][field]).toFixed(1)}" r="3" fill="${color}"/>`:`<polyline fill="none" stroke="${color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" points="${valid.map(p=>`${X(p).toFixed(1)},${Y(p[field]).toFixed(1)}`).join(' ')}"/>`;
 }).join('');
}
function localClockAxis(day,timezone){
 // Place samples along the user's current local calendar date, for correct 00–24 h axes.
 const dayStart=Date.parse(`${day}T00:00:00Z`);
 return {dayStart,day,timezone};
}
export function wellnessDayChart(daySummary,type='stress'){
 if(!daySummary)return missing(type==='stress'?'Stress':'Body-Battery');
 const isStress=type==='stress',field=isStress?'stress':'bodyBattery',color=isStress?'#CF9271':'#358B75';
 const points=daySummary.points.filter(p=>Number.isFinite(p[field]));if(!points.length)return missing(type==='stress'?'Stress':'Body-Battery');
 const hours=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const X=p=>{const h=hours.format(new Date(p.at)).split(':').map(Number);return 64+(h[0]*60+h[1])/1440*756;};
 const Y=v=>175-v*1.45;
 const paths=[],parts=[];
 for(const p of points){const previous=parts.at(-1);if(previous&&Date.parse(p.at)-Date.parse(previous.at)>15*60000){paths.push([...parts]);parts.length=0;}parts.push(p);}if(parts.length)paths.push(parts);
 const grid=[0,25,50,75,100].map(v=>`<line x1="64" x2="820" y1="${Y(v)}" y2="${Y(v)}" stroke="#E4ECE7"/><text x="53" y="${Y(v)+4}" text-anchor="end" fill="#849A8D" font-size="11">${v}</text>`).join('');
 const axis=[0,6,12,18,24].map(h=>`<text x="${64+h/24*756}" y="201" text-anchor="middle" fill="#81988C" font-size="11">${String(h).padStart(2,'0')}:00</text>`).join('');
 const colored=isStress?points.map(p=>`<circle cx="${X(p).toFixed(1)}" cy="${Y(p.stress).toFixed(1)}" r="2.3" fill="${zones.find(z=>z.label===stressZone(p.stress))?.color||color}"><title>${safe(clockFmt.format(new Date(p.at)))} · Stress ${num(p.stress)}</title></circle>`).join(''):'';
 const backdrop=isStress?'':daySummary.points.filter(p=>Number.isFinite(p.stress)).map(p=>`<line x1="${X(p).toFixed(1)}" x2="${X(p).toFixed(1)}" y1="${Y(0)}" y2="${Y(p.stress).toFixed(1)}" stroke="${p.stress<=25?'#82B7D1':'#DB9974'}" stroke-width="2.4" opacity=".48"/>`).join('');
 const line=paths.map(g=>g.length>1?`<polyline points="${g.map(p=>`${X(p).toFixed(1)},${Y(p[field]).toFixed(1)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`:`<circle cx="${X(g[0])}" cy="${Y(g[0][field])}" r="3" fill="${color}"/>`).join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 840 216" role="img" aria-label="${isStress?'Stress':'Body Battery'} Tagesverlauf ${safe(daySummary.day)}" xmlns="http://www.w3.org/2000/svg">${grid}${axis}${backdrop}${line}${colored}</svg></div><div class="insight-legend"><span><i style="background:${color}"></i>${isStress?'Garmin Stress':'Garmin Body Battery'}</span>${isStress?'':'<span><i style="background:#DB9974"></i>Stress im Hintergrund</span>'}<span>${points.length} Messpunkte à 5 min</span></div>`;
}
export function wellnessDayBars(summaries,type,aggregation='auto'){
 const values=summaries.filter(s=>Number.isFinite(type==='stress'?s.avgStress:s.maxBattery));
 if(!values.length)return missing(type==='stress'?'Stress':'Body-Battery');
 // Daily chart stays legible for a year: aggregate to weeks when > 70 days of observations.
 const byWeek=aggregation==='week'||(aggregation==='auto'&&values.length>70),groups=[];
 for(const s of values){const date=new Date(s.day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);const week=date.toISOString().slice(0,10);const key=byWeek?week:s.day;let g=groups.at(-1);if(!g||g.key!==key){g={key,rows:[]};groups.push(g);}g.rows.push(s);}
 const W=840,left=55,top=16,h=170,base=top+h,width=760/groups.length,bar=Math.min(16,Math.max(2,width*.65));
 const X=i=>left+(i+.5)*760/groups.length;
 const Y=value=>base-value/100*h;
 const marks=groups.map((g,i)=>{
  const vals=g.rows.map(x=>type==='stress'?x.avgStress:x.maxBattery);const count=g.rows.reduce((n,x)=>n+x.stressCount,0);const mean=type==='stress'?g.rows.reduce((n,x)=>n+x.avgStress*x.stressCount,0)/(count||1):vals.reduce((a,b)=>a+b,0)/vals.length;
  if(type==='stress')return `<rect x="${(X(i)-bar/2).toFixed(1)}" y="${Y(mean).toFixed(1)}" width="${bar.toFixed(1)}" height="${(base-Y(mean)).toFixed(1)}" rx="2" fill="${zones.find(z=>z.label===stressZone(mean))?.color||'#C48C68'}"><title>${safe(formatDay(g.key))}: Ø Stress ${num(mean)} · ${g.rows.length} Tag(e)</title></rect>`;
  const lows=g.rows.map(x=>x.minBattery),low=Math.min(...lows),high=Math.max(...vals),x=X(i);
  return `<line x1="${x}" x2="${x}" y1="${Y(high)}" y2="${Y(low)}" stroke="#93C5B6" stroke-width="${bar}" stroke-linecap="round" opacity=".75"><title>${safe(formatDay(g.key))}: Minimum ${num(low)}, Maximum ${num(high)} · ${g.rows.length} Tag(e)</title></line><circle cx="${x}" cy="${Y(high)}" r="4.3" fill="#23785F" stroke="#fff" stroke-width="1.3"/><circle cx="${x}" cy="${Y(low)}" r="4.3" fill="#BB754C" stroke="#fff" stroke-width="1.3"/>`;
 }).join('');
 const grid=[0,25,50,75,100].map(v=>`<line x1="${left}" x2="${W-25}" y1="${Y(v)}" y2="${Y(v)}" stroke="${type==='stress'&&v>0&&v<100?'#E1BA78':'#E7EFEB'}" stroke-dasharray="${type==='stress'&&v>0&&v<100?'4 3':'none'}"/><text x="${left-10}" y="${Y(v)+4}" text-anchor="end" fill="#879D91" font-size="11">${v}</text>`).join('');
 const every=Math.max(1,Math.ceil(groups.length/8));const labels=groups.map((g,i)=>i%every===0||i===groups.length-1?`<text x="${X(i)}" y="206" font-size="10" text-anchor="middle" fill="#8BA092">${safe(formatDay(g.key))}</text>`:'').join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 840 221" role="img" aria-label="${type==='stress'?'Stressmittel':'Body Battery Tageshoch und Tief'} der ausgewählten Periode" xmlns="http://www.w3.org/2000/svg">${grid}${marks}${labels}</svg></div><p class="insight-figure-note">${byWeek?'Wochenblöcke (nach gültigen Messpunkten gewichtet);':'Tageswerte;'} ${type==='stress'?'Mittelwert nur aus tatsächlich erfassten Stresspunkten.':'Beobachtete Höchst- und Tiefstwerte, keine interpolierten Tagesextrema.'} Fehlende Tage werden nicht als Null interpretiert.</p>${type==='energy'?'<div class="insight-legend"><span><i style="background:#23785F"></i>Beobachtetes Hoch</span><span><i style="background:#BB754C"></i>Beobachtetes Tief</span></div>':''}`;
}
/** Empirical Gaussian raincloud: bandwidth rule; raw samples only, no imputation. */
export function stressRaincloud(model){
 const sample=model.stressDays.flatMap(d=>d.points.map(p=>p.stress).filter(Number.isFinite));
 if(!sample.length)return missing('Stress');
 const counts=model.zoneCounts,total=sample.length,sorted=sample.slice().sort((a,b)=>a-b);
 const q=t=>{const x=(sorted.length-1)*t,i=Math.floor(x);return sorted[i]+(sorted[Math.min(i+1,sorted.length-1)]-sorted[i])*(x-i);};
 const median=q(.5),low=q(.25),high=q(.75);
 const W=860,L=48,R=24,T=14,H=234,axis=192,plot=W-L-R;
 const X=v=>L+v/100*plot;
 // Bounded support [0,100], Gaussian smooth only to illustrate measured density.
 const sd=Math.sqrt(sample.reduce((n,x)=>n+(x-median)**2,0)/sample.length);
 const bw=Math.max(2.2,Math.min(12,1.06*Math.max(sd,1)*Math.pow(sample.length,-.2)));
 const hist=Array.from({length:101},(_,i)=>sample.reduce((a,v)=>a+Math.exp(-.5*((i-v)/bw)**2),0)/(sample.length*bw));
 const max=Math.max(...hist)||1;
 const density='M'+X(0).toFixed(1)+','+axis+' '+hist.map((v,i)=>'L'+X(i).toFixed(1)+','+(axis-v/max*103).toFixed(1)).join(' ')+' L'+X(100).toFixed(1)+','+axis+'Z';
 const regions=[['Ruhe',0,25,'#4C9C89'],['Niedrig',25,50,'#A0C6A0'],['Mittel',50,75,'#E1BA78'],['Hoch',75,100,'#D98976']];
 const backgrounds=regions.map(([label,a,b,color])=>`<rect x="${X(a)}" y="${T}" width="${X(b)-X(a)}" height="${axis-T+24}" fill="${color}" opacity=".10"/><text x="${(X(a)+X(b))/2}" y="${T+13}" text-anchor="middle" fill="#687a73" font-size="10">${label}</text>`).join('');
 const boundaries=[25,50,75].map(x=>`<line x1="${X(x)}" x2="${X(x)}" y1="${T+19}" y2="${axis+26}" stroke="#738579" stroke-dasharray="4 4" opacity=".6"/>`).join('');
 // Deterministic thinning; every sample contributes to density and quantiles.
 const step=Math.max(1,Math.ceil(sample.length/330));
 const dots=sample.filter((_,i)=>i%step===0).map((v,i)=>{const yy=axis+5+(i*37%17);return `<circle cx="${X(v).toFixed(2)}" cy="${yy}" r="1.9" fill="${zones.find(z=>z.label===stressZone(v)).color}" opacity=".65"><title>Stress ${num(v)}</title></circle>`;}).join('');
 const distribution=`<path d="${density}" fill="#4C9C89" fill-opacity=".28" stroke="#387e70" stroke-width="2"/>`;
 const box=`<line x1="${X(q(.05))}" x2="${X(q(.95))}" y1="${axis-10}" y2="${axis-10}" stroke="#2a5950" stroke-width="2"/><rect x="${X(low)}" y="${axis-18}" width="${Math.max(1,X(high)-X(low))}" height="16" rx="4" fill="#fff" stroke="#2a5950" stroke-width="1.7"/><line x1="${X(median)}" x2="${X(median)}" y1="${axis-18}" y2="${axis-2}" stroke="#2a5950" stroke-width="2.3"/>`;
 const ticks=[0,25,50,75,100].map(n=>`<text x="${X(n)}" y="${H-3}" text-anchor="middle" font-size="11" fill="#647e74">${n}</text>`).join('');
 const summary=zones.map(z=>`<span><i style="background:${z.color}"></i>${z.label}: ${num(100*counts[z.label]/total)} %</span>`).join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Raincloud Plot der Garmin Stresswerte: Dichtekurve, Boxplot und Einzelpunkte mit Ruhe, Niedrig, Mittel und Hoch">${backgrounds}${boundaries}${distribution}${box}${dots}${ticks}</svg></div><div class="insight-legend">${summary}</div><p class="insight-figure-note">${total.toLocaleString('de-AT')} gültige 5-Minuten-Stresspunkte. Dichtekurve geglättet, Boxplot zeigt Median und 25.–75. Perzentil (Linie: 5.–95.), Einzelpunkte: ${Math.ceil(total/step)} von ${total} zur besseren Lesbarkeit. Farbgrenzen bei 25, 50 und 75. Keine Hochrechnung auf fehlende Tageszeit.</p>`;
}
function zoneStack(model,day=null){const counts=day?day.categories:model.zoneCounts,total=Object.values(counts).reduce((a,b)=>a+b,0);if(!total)return missing('Stress');
 return `<div class="insight-zone-stack" role="img" aria-label="Stressstufen nach Anteil der gültigen Messpunkte">${zones.map(z=>`<div style="width:${(counts[z.label]/total*100).toFixed(2)}%;background:${z.color}" title="${z.label}: ${num(counts[z.label]/total*100)} %"></div>`).join('')}</div><div class="insight-zone-grid">${zones.map(z=>`<div><i style="background:${z.color}"></i><span>${z.label}</span><strong>${num(counts[z.label]/total*100)} %</strong><small>${num(counts[z.label])} Messpunkte</small></div>`).join('')}</div>`;
}
const dayShift=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function stressNavigation(today,period='28',offset=0){
 const size=period==='7'?7:period==='90'?90:period==='365'?365:28;
 const effective=Math.min(0,Math.max(-10000,Number(offset)||0));
 const end=dayShift(today,effective*size);return {size,end,start:dayShift(end,1-size),offset:effective};
}
function stressWindowControls(nav,period,offset){
 const all=period==='all';
 return `<nav class="health-day-switch" aria-label="Stress-Zeitraum blättern"><button type="button" data-action="insights-stress-prev" aria-label="Früheren Zeitraum anzeigen" ${all?'disabled':''}>←</button><strong>${all?'Gesamter erfasster Zeitraum':`${formatDay(nav.start)} – ${formatDay(nav.end)}`}</strong><button type="button" data-action="insights-stress-next" aria-label="Späteren Zeitraum anzeigen" ${all||offset>=0?'disabled':''}>→</button></nav>`;
}
export function insightsStressView(imported={},period='28',today=new Date().toISOString().slice(0,10),selected='',aggregation='auto',windowDays=14,offset=0,context={}){
 const nav=stressNavigation(today,period,offset);
 const model=buildWellnessInsights(imported,period==='all'?today:nav.end,period),list=model.stressDays,day=list.find(x=>x.day===selected)||list.at(-1)||null;
 const contextAnalysis=buildStressContext({model,garminSessions:imported?.garminSessions||[],...context});
 return `<div class="insight-wellness">
 <div class="insight-kpi-grid">${card('Ø Stress',num(model.avgStress),'Gültige Garmin-Stresswerte')}${card('Messtage',num(list.length),'Mit gültigen Stresswerten')}${card('Stress-Messpunkte',num(model.stressCount),'5-Minuten-Zeitfenster')}${card('Letzter Messtag',list.length?formatDay(list.at(-1).day):'–','Importierte Garmin-Wellness-Dateien')}</div>
 ${note(`Garmin Stress ist ein physiologischer Schätzwert, keine psychologische Stressdiagnose. Messungen während Aktivitäten oder ohne gültigen Sensorwert bleiben Lücken. Aktuelle Gerätezeitzone: ${model.timezone}.`)}
 ${stressWindowControls(nav,period,offset)}
 <div class="insight-chart-grid">
 ${shell('Belastungsstufen · Raincloud','01 · STRESS DISTRIBUTION',stressRaincloud(model),'Verteilung gültiger Garmin-Stresspunkte, nicht der gesamten Tageszeit.')}
 ${shell('Stress über den Zeitraum','02 · STRESS HISTORY',`<div class="health-mode-toggle" role="group" aria-label="Stress Zeitauflösung"><button data-action="insights-stress-granularity" data-id="day" class="${aggregation==='day'?'is-chosen':''}">Täglich</button><button data-action="insights-stress-granularity" data-id="week" class="${aggregation==='week'?'is-chosen':''}">Wöchentlich</button></div>`+wellnessDayBars(model.summaries,'stress',aggregation),'Farbcodierung aus Garmin-Stressstufen: Ruhe 0–25, niedrig 26–50, mittel 51–75, hoch 76–100. Keine psychologische Diagnose.')}
 ${shell('Rollender Stressverlauf','02B · ROLLING STRESS',rollingEnvelopeChart(model.stressDays,'avgStress',{title:'Täglicher Stressmittelwert',unit:'Garmin-Stress',windowDays,color:'#C28669',range:model.range,stressZones:true}),`Rollender Median und Streuung auf Tagesbasis (Fenster ${windowDays} Tage).`)}
 </div>
 ${stressContextView(contextAnalysis)}
 ${shell('Mein Stress im Tagesverlauf','03 · DAILY STRESS',list.length?daySelector(list,day.day)+wellnessDayChart(day,'stress'):missing('Stress'),'Lücken werden nicht aufgefüllt; hohe Werte sind nicht automatisch negative emotionale Erlebnisse.')}
 <div class="insight-footnote">Wichtig: Zum Ergänzen der neuen Stresswerte bereits früher importierte Garmin-Tages-ZIPs unter „Datenquellen“ erneut auswählen. Compass erkennt gleiche Zeitpunkte und legt keine Duplikate an.</div>
 </div>`;
}
export function insightsEnergyView(imported={},period='28',today=new Date().toISOString().slice(0,10),selected=''){
 const model=buildWellnessInsights(imported,today,period),list=model.batteryDays,day=list.find(x=>x.day===selected)||list.at(-1)||null;
 const charged=list.length?list.reduce((a,x)=>a+x.charged,0):0,drained=list.length?list.reduce((a,x)=>a+x.drained,0):0;
 return `<div class="insight-wellness">
 <div class="insight-kpi-grid">${card('Ø Tageshoch',num(model.avgMaxBattery),'Beobachtete Garmin-Werte')}${card('Ø Tagestief',num(model.avgMinBattery),'Beobachtete Garmin-Werte')}${card('Aufgeladen',list.length?'+'+num(charged):'–','Summe kurzer, gültiger Intervalle')}${card('Verbraucht',list.length?'−'+num(drained):'–','Summe kurzer, gültiger Intervalle')}</div>
 ${note(`Garmin Body Battery ist eine gerätebasierte Energieschätzung von 0 bis 100. Die Änderungen beruhen nur auf aufeinanderfolgenden gültigen Messpunkten (maximal 15 Minuten Abstand); längere Datenlücken werden nicht überbrückt. Zeitzone: ${model.timezone}.`)}
 <div class="insight-chart-grid">${shell('Tageshoch und Tagestief','01 · DAILY ENERGY RANGE',wellnessDayBars(model.summaries,'energy'),'Spannweite beobachteter Werte, keine Schätzung fehlender Werte.')}
 ${shell('Stress und Energie zusammen','02 · STRESS × BODY BATTERY',day?zoneStack(model,day):missing('Stress und Body Battery'),'Anteile der gültigen Stresspunkte am ausgewählten Energietag; keine kausale Analyse.')}</div>
 ${shell('Energie im Tagesverlauf','03 · DAILY BODY BATTERY',list.length?daySelector(list,day.day)+wellnessDayChart(day,'energy'):missing('Body-Battery'),'Tatsächliche importierte Garmin-Body-Energy-Werte im 5-Minuten-Raster. Kein rekonstruiertes Energiemodell.')}
 <div class="insight-footnote">Auch für Body Battery bitte die Garmin-ZIPs einmal erneut importieren. Die vorhandenen Schlaf- und HRV-Daten bleiben dabei erhalten; Rohdateien werden nicht hochgeladen.</div>
 </div>`;
}
