/** Compass 0.5.55 – worktime annual comparison. Local, descriptive only.
 * 2024–2026 (or observed years), calendar months vs actual ISO weeks, no future data.
 * The optional exploratory CI assumes independent observed weeks; it is NOT a
 * prediction interval or an estimate of actual (rather than documented) work.
 */
import {worktimeWeeks,worktimeMonths,workHM} from './worktime-v553.js';
const months=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const palette=['#466E9D','#C28055','#558A75','#9A79AA','#BA9961'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const utc=date=>Date.parse(date+'T12:00:00Z');
const addDays=(day,n)=>new Date(utc(day)+n*86400000).toISOString().slice(0,10);
const monthKey=(year,month)=>`${year}-${String(month).padStart(2,'0')}`;
const nfmt=n=>Number(n).toLocaleString('de-AT',{maximumFractionDigits:1});
const pointX=(month,weekFraction)=>month+Math.min(.95,Math.max(.05,weekFraction));
const formatInterval=(n)=>`${nfmt(n)} h`;
/** Weekly work samples positioned by the ISO week's Thursday (month-majority assignment). */
export function worktimeYearWeeks(days=[],year,today='9999-12-31'){
 const rows=(days||[]).filter(d=>d?.day<=today&&Number.isFinite(d?.hours));
 return worktimeWeeks(rows,year).filter(w=>w.start<=today).map(w=>{
  const thursday=addDays(w.start,3);
  const month=Number(thursday.slice(5,7));
  const dayOfMonth=Number(thursday.slice(8,10));
  const span=new Date(Date.UTC(Number(thursday.slice(0,4)),month,0)).getUTCDate();
  // ISO weeks at year edges may belong to the adjacent year. Keep them at chart edge.
  const x=Math.max(.05,Math.min(11.95,pointX(month-1,(dayOfMonth-.5)/span)));
  const complete=w.end<today; // Today/partial calendar week never enters CI
  return {...w,year,month,x,complete,thursday};
 });
}
export function worktimeYearComparison(days=[],today='9999-12-31',displayYears=null){
 const years=displayYears||[2024,2025,2026];
 return years.map(year=>{
  const yearMonths=worktimeMonths(days.filter(d=>d.day<=today),year);
  const weeks=worktimeYearWeeks(days,year,today);
  return {year,color:palette[years.indexOf(year)%palette.length],months:yearMonths.map((m,i)=>({month:i+1,hours:m.hours,days:m.days,completed:monthKey(year,i+1)<today.slice(0,7)})),weeks};
 });
}
function mean(arr){return arr.reduce((a,b)=>a+b,0)/arr.length;}
function stdev(arr){if(arr.length<2)return 0;const m=mean(arr);return Math.sqrt(arr.reduce((s,v)=>s+(v-m)**2,0)/(arr.length-1));}
/** Descriptive rolling local weekly mean and approximate 95% confidence limits.
 * Must have >=8 completed weeks from >=2 years within +-0.9 calendar months.
 * Serial dependence and different year coverage limit inferential interpretation.
 */
export function weeklyTrendBand(series){
 const all=series.flatMap(s=>s.weeks.filter(w=>w.complete&&w.hours>=0).map(w=>({...w,year:s.year})));
 if(new Set(all.map(w=>w.year)).size<2)return [];
 const out=[];
 for(let i=0;i<48;i++){
  const x=.125+i*.25;
  const near=all.filter(w=>Math.abs(w.x-x)<=.95);
  if(near.length<8||new Set(near.map(w=>w.year)).size<2)continue;
  const vals=near.map(w=>w.hours);
  const m=mean(vals),se=stdev(vals)/Math.sqrt(vals.length);
  // Two-sided 95% Student-t critical value approximation, df >= 7.
  const df=vals.length-1;const t=1.96+2.35/df+3.2/(df*df);
  out.push({x,mean:m,lower:Math.max(0,m-t*se),upper:m+t*se,n:vals.length,years:new Set(near.map(w=>w.year)).size});
 }
 return out;
}
const X={W:960,L:37,R:11},plotX=x=>X.L+x/12*(X.W-X.L-X.R);
export function worktimeYearComparisonView(days=[],today='9999-12-31',mode='month'){
 const data=worktimeYearComparison(days,today),weeks=data.flatMap(y=>y.weeks),monthly=data.flatMap(y=>y.months.filter(m=>m.days&&m.completed));
 const max=Math.max(45,...(mode==='week'?weeks.map(w=>w.hours):monthly.map(m=>m.hours)))*1.16;
 const W=960,H=249,L=37,R=11,T=14,B=47,h=H-T-B;
 const y=v=>T+h-Math.max(0,v)/max*h;
 const back=`<rect x="${L}" y="${T}" width="${W-L-R}" height="${h}" rx="6" fill="#F9FBF9"/>`;
 const grid=[0,.25,.5,.75,1].map(i=>{const yy=y(i*max);return `<line x1="${L}" x2="${W-R}" y1="${yy}" y2="${yy}" stroke="#E3EBE6" stroke-width="1"/><text x="${L-7}" y="${yy+4}" font-size="10" text-anchor="end" fill="#839789">${Math.round(i*max)}</text>`;}).join('');
 const monthMarkers=months.map((name,i)=>`<line x1="${plotX(i)}" y1="${T}" x2="${plotX(i)}" y2="${T+h}" stroke="#E7EEE8" stroke-width=".8"/><text x="${plotX(i+.5)}" y="${H-18}" font-size="10.5" fill="#607D6C" text-anchor="middle">${name}</text>`).join('');
 let marks='',trend='',caption='';
 if(mode==='month'){
  const barW=19,step=23;
  marks=data.map((s,j)=>s.months.map((m,i)=>{
   if(!m.days||!m.completed)return '';
   const x=plotX(i+.5)+(j-1)*step-barW/2;
   return `<rect x="${x}" y="${y(m.hours)}" width="${barW}" height="${Math.max(1,T+h-y(m.hours))}" rx="2.4" fill="${s.color}"><title>${s.year} · ${months[i]} · ${workHM(m.hours)} · ${m.days} erfasste Tage</title></rect>`;
  }).join('')).join('');
  caption='Abgeschlossene Monate · Gruppierte Stunden je Jahr. Laufender Monat wird nicht mit vollen Monaten verglichen.';
 } else {
  const band=weeklyTrendBand(data);
  const pointsPath=pts=>pts.map((p,i)=>`${i?'L':'M'}${plotX(p.x).toFixed(2)} ${y(p.value).toFixed(2)}`).join(' ');
  if(band.length>2){
   const upper=band.map(v=>({x:v.x,value:v.upper}));const lower=[...band].reverse().map(v=>({x:v.x,value:v.lower}));
   trend=`<path d="${pointsPath(upper)} ${pointsPath(lower).replace(/^M/,'L')} Z" fill="#8BB0A1" fill-opacity=".21" stroke="none"/><path d="${pointsPath(band.map(v=>({x:v.x,value:v.mean})))}" fill="none" stroke="#4B7665" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  marks=data.map(s=>s.weeks.map(w=>`<circle cx="${plotX(w.x)}" cy="${y(w.hours)}" r="3.1" fill="${s.color}" stroke="#fff" stroke-width=".6" opacity=".88"><title>${s.year} · ${w.start}–${w.end} · ${workHM(w.hours)}${w.complete?'':' · laufende Woche'}</title></circle>`).join('')).join('');
  caption='Jeder Punkt = dokumentierte ISO-Woche (nach ihrem Donnerstag im Monat eingeordnet). Linie = geglätteter lokaler Wochenmittelwert; Band = exploratives 95-%-Konfidenzintervall. Es setzt unabhängige Wochen voraus und ist bei wiederkehrenden Belastungsmustern nur eine grobe Orientierung, keine Vorhersage. Laufende Wochen fließen nicht in das Band ein.';
 }
 const svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Arbeitszeit ${mode==='month'?'nach Monat je Jahr':'als einzelne Wochen je Jahr mit explorativem 95-Prozent-Konfidenzband'}" xmlns="http://www.w3.org/2000/svg">${back}${grid}${monthMarkers}${trend}${marks}<text x="7" y="11" font-size="10" fill="#71887A">h</text></svg>`;
 return `<section class="work555-compare" aria-label="Arbeitszeit im Jahresvergleich"><div class="work555-compare-head"><div><h3>Jahresvergleich · ${mode==='week'?'Wochen':'Monate'}</h3><small>2024–2026 · gleiche Monatsposition, getrennte Jahre</small></div><div class="work555-mode"><button type="button" data-action="worktime-compare-mode" data-id="month" aria-label="Monatsansicht" ${mode==='month'?'disabled':''}>←</button><span>${mode==='month'?'Monat':'Woche'}</span><button type="button" data-action="worktime-compare-mode" data-id="week" aria-label="Wochenansicht" ${mode==='week'?'disabled':''}>→</button></div></div><div class="work555-year-legend">${data.map(s=>`<span><i style="background:${s.color}"></i>${s.year}</span>`).join('')}${mode==='week'?'<span><i style="background:#9ABEB0"></i>95-%-Band (explorativ)</span>':''}</div>${marks?svg:'<p class="muted-line">Noch keine Jahresvergleichsdaten verfügbar.</p>'}<p class="work555-note">${caption}</p></section>`;
}
