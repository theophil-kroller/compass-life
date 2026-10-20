/** Compass 0.5.52 – year distribution: measured nights only, no zero-fill. */
import {percentile} from './insights-stats.js';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dayMs=d=>Date.parse(`${d}T12:00:00Z`);
const dateAt=ms=>new Date(ms).toISOString().slice(0,10);
const minuteLabel=m=>Number.isFinite(m)?`${Math.floor(Math.round(m)/60)} h ${String(Math.round(m)%60).padStart(2,'0')} min`:'–';
const monthName=d=>new Date(dayMs(d)).toLocaleDateString('de-AT',{month:'short'});
const finiteNight=n=>/^\d{4}-\d{2}-\d{2}$/.test(n?.day||'')&&Number.isFinite(n.sleepMinutes)&&n.sleepMinutes>0&&n.sleepMinutes<=1440;
const mondayOf=d=>dateAt(dayMs(d)-((new Date(dayMs(d)).getUTCDay()+6)%7)*86400000);
export function sleepYearGroups(nights,today,mode='month'){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(today))return [];
 const year=Number(today.slice(0,4)),month=Number(today.slice(5,7)),first=new Date(Date.UTC(year,month-12,1)).toISOString().slice(0,10),groups=new Map();
 const recent=(nights||[]).filter(n=>finiteNight(n)&&n.day>=first&&n.day<=today).sort((a,b)=>a.day.localeCompare(b.day));
 for(const n of recent){const key=mode==='day'?n.day:mode==='week'?mondayOf(n.day):n.day.slice(0,7);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(n);}
 if(mode==='day')return recent.map(n=>({key:n.day,rows:[n],values:[n.sleepMinutes],median:n.sleepMinutes,mean:n.sleepMinutes,q1:n.sleepMinutes,q3:n.sleepMinutes}));
 const starts=[];
 if(mode==='month'){for(let i=11;i>=0;i--){const d=new Date(Date.UTC(year,month-1-i,1));starts.push(d.toISOString().slice(0,7));}}
 else{for(let d=mondayOf(first);d<=today;d=dateAt(dayMs(d)+7*86400000))starts.push(d);}
 return starts.map(key=>{const rows=groups.get(key)||[],values=rows.map(n=>n.sleepMinutes).sort((a,b)=>a-b);return {key,rows,values,median:values.length?percentile(values,.5):null,q1:values.length?percentile(values,.25):null,q3:values.length?percentile(values,.75):null,mean:values.length?values.reduce((a,b)=>a+b,0)/values.length:null};});
}
export function renderSleepYearDistribution(nights,today,mode='month'){
 const kind=['month','week','day'].includes(mode)?mode:'month',groups=sleepYearGroups(nights,today,kind);
 const all=groups.flatMap(g=>g.values),count=all.length;
 if(!groups.length||!count)return '<p class="sleep550-no-data">Noch keine gemessenen Nächte in diesem Jahresfenster.</p>';
 const W=1000,H=270,L=56,R=18,T=20,B=40,plotW=W-L-R,plotH=H-T-B;
 // Scale is data-driven but stable across modes for the same 12 months.
 const sorted=[...all].sort((a,b)=>a-b),p05=percentile(sorted,.05),p95=percentile(sorted,.95);
 const lo=Math.max(0,Math.floor((Math.max(0,p05-90))/60)*60),hi=Math.max(lo+180,Math.ceil((p95+90)/60)*60);
 const Y=v=>Math.max(T,Math.min(T+plotH,T+plotH-(v-lo)/(hi-lo)*plotH));
 const X=i=>L+(i+.5)/groups.length*plotW;
 const firstDay=new Date(Date.UTC(Number(today.slice(0,4)),Number(today.slice(5,7))-12,1)).toISOString().slice(0,10);
 const xDay=day=>L+(dayMs(day)-dayMs(firstDay))/Math.max(1,dayMs(today)-dayMs(firstDay))*plotW;
 const grid=Array.from({length:5},(_,i)=>{const min=lo+(hi-lo)*i/4,y=Y(min);return `<line x1="${L}" x2="${W-R}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E9F0EA"/><text x="${L-9}" y="${(y+3).toFixed(1)}" text-anchor="end" fill="#6C8379" font-size="11">${escape(minuteLabel(min))}</text>`;}).join('');
 const dayFirst=groups[0].key,monthTicks=[];let last='';
 const chart=groups.map((g,i)=>{
  const x=kind==='day'?xDay(g.key):X(i),color='#397C68',dots=g.rows.map((n,j)=>{
   // Deterministic tiny x jitter by day of month; no random layout drift.
   const jitter=kind==='month'?((Number(n.day.slice(-2))*13)%15-7):kind==='week'?((j*11)%7-3):0;
   const pointX=x+jitter*(kind==='month'?1.12:kind==='week'?.38:0);
   return `<circle cx="${pointX.toFixed(2)}" cy="${Y(n.sleepMinutes).toFixed(2)}" r="${kind==='day'?2.35:kind==='week'?2.65:3.15}" data-action="insights-night-day" data-id="${escape(n.day)}" tabindex="0" role="button" aria-label="${escape(n.day)}: ${escape(minuteLabel(n.sleepMinutes))}" fill="${color}" fill-opacity=".62"><title>${escape(n.day)} · ${escape(minuteLabel(n.sleepMinutes))}</title></circle>`;
  }).join('');
  if(kind==='day')return dots;
  const monthLabel=kind==='month'?monthName(g.key+'-01'):kind==='week'?(i%4===0?`${g.key.slice(8)}.${g.key.slice(5,7)}.`:''):'';
  const tick=monthLabel?`<text x="${x.toFixed(2)}" y="${H-13}" text-anchor="middle" fill="#668074" font-size="${kind==='month'?12:9}">${escape(monthLabel)}</text>`:'';
  if(!g.values.length)return tick+`<circle cx="${x.toFixed(2)}" cy="${T+plotH/2}" r="2" fill="#BBCBC2"><title>${escape(g.key)}: keine Messung</title></circle>`;
  const boxWidth=kind==='month'?19:7,min=g.values[0],max=g.values.at(-1);
  const whisker=`<line x1="${x}" y1="${Y(min)}" x2="${x}" y2="${Y(max)}" stroke="#91B6A6" stroke-width="1.5"/>`;
  const box=`<rect x="${(x-boxWidth/2).toFixed(1)}" y="${Y(g.q3).toFixed(1)}" width="${boxWidth}" height="${Math.max(1,Y(g.q1)-Y(g.q3)).toFixed(1)}" rx="${kind==='month'?4:2}" fill="#B8D8C9" fill-opacity=".65" stroke="#649782" stroke-width="1"/>`;
  const median=`<line x1="${x-boxWidth/2-2}" x2="${x+boxWidth/2+2}" y1="${Y(g.median)}" y2="${Y(g.median)}" stroke="#225C48" stroke-width="2.3"/>`;
  return `${whisker}${box}${dots}${median}${tick}`;
 }).join('');
 if(kind==='day'){for(let i=0;i<12;i++){const mid=new Date(Date.UTC(Number(today.slice(0,4)),Number(today.slice(5,7))-12+i,15)).toISOString().slice(0,10);monthTicks.push(`<text x="${xDay(mid).toFixed(1)}" y="${H-13}" font-size="11" text-anchor="middle" fill="#677F71">${escape(monthName(mid))}</text>`);}}
 const detail=kind==='month'?'Monatliche Verteilung aller erfassten Nächte':kind==='week'?'Wochenverteilung im selben Jahresfenster':'Einzelne Nächte über das ganze Jahr';
 const nMeasured=count,nPossible=Math.round((dayMs(today)-dayMs(new Date(Date.UTC(Number(today.slice(0,4)),Number(today.slice(5,7))-12,1)).toISOString().slice(0,10)))/86400000)+1;
 return `<div class="sleep552-year-plot" role="group" aria-label="${escape(detail)}"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(detail)}; ${nMeasured} Nächte; Werte in Stunden und Minuten">${grid}${chart}${monthTicks.join('')}</svg></div><div class="sleep552-year-legend"><span><i class="sleep552-swatch"></i>Einzelne Nächte</span>${kind==='day'?'<span>Jeder Punkt entspricht einer Nacht.</span>':'<span>Box = mittlere 50 % · Strich = Median · Enden = Extremwerte</span>'}<span>${nMeasured}/${nPossible} erfasste Nächte</span></div><p class="sleep550-subnote">${escape(detail)}. Verteilung in h:min; fehlende Messungen werden weder auf null gesetzt noch interpoliert. Einzelpunkte zeigen die tatsächlich gemessene Schlafdauer.</p>`;
}
