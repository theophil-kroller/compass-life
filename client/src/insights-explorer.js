/** Compass 0.5.13 · local-only, user-driven exploratory statistical comparisons. */
import {buildSleepInsights} from './insights.js';
import {buildWellnessInsights} from './insights-wellness.js';
import {buildProductivityInsights} from './insights-productivity.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const finite=v=>Number.isFinite(v);
export const EXPLORE_FIELDS=[
 ['sleepMinutes','Schlafdauer','Minuten'],['hrv','Nächtliche HRV','ms'],['stress','Stress (Tagesmittel)','Garmin-Skala'],['battery','Body Battery morgens','0–100'],['workMinutes','Fokuszeit','Minuten'],['pomodoros','Pomodoros','Anzahl'],['meetingMinutes','Meetingzeit','Minuten']
];
export function exploreDays({imported={},activities=[],calendarEvents=[],rules=[],overrides={},calendarCoverage=null,today='2026-10-18',period='28'}={}){
 const nights=buildSleepInsights(imported,today,period),health=buildWellnessInsights(imported,today,period);
 const work=buildProductivityInsights({imported,activities,calendarEvents,rules,overrides,calendarCoverage,today,period});
 const days=new Map();const at=d=>{if(!days.has(d))days.set(d,{day:d});return days.get(d);};
 for(const n of nights.nights)if(finite(n.sleepMinutes))at(n.day).sleepMinutes=n.sleepMinutes;
 for(const h of nights.hrv)if(finite(h.nightAverageMs))at(h.day).hrv=h.nightAverageMs;
 for(const day of health.summaries){if(finite(day.avgStress)&&day.stressCount>=12)at(day.day).stress=day.avgStress;
  const morning=day.points?.filter(x=>finite(x.bodyBattery)&&new Date(x.at).getHours()>=6&&new Date(x.at).getHours()<11)||[];
  if(morning.length>=2)at(day.day).battery=morning.reduce((s,x)=>s+x.bodyBattery,0)/morning.length;
 }
 for(const f of work.rows){const x=at(f.day);x.workMinutes=f.workMinutes;x.pomodoros=f.pomodoros;if(finite(f.meetingMinutes))x.meetingMinutes=f.meetingMinutes;}
 return [...days.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
const shift=(s,n)=>new Date(Date.parse(s+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
export function explorePairs(days,xKey,yKey,lag=0){
 const byDay=new Map(days.map(d=>[d.day,d]));const result=[];
 for(const d of days){const target=byDay.get(shift(d.day,lag));if(finite(d[xKey])&&target&&finite(target[yKey]))result.push({day:d.day,x:d[xKey],y:target[yKey]});}
 return result.sort((a,b)=>a.day.localeCompare(b.day));
}
const linear=rows=>{const n=rows.length;if(n<3)return null;const avgX=rows.reduce((s,r)=>s+r.x,0)/n,avgY=rows.reduce((s,r)=>s+r.y,0)/n;
 let xx=0,xy=0,yy=0;for(const r of rows){xx+=(r.x-avgX)**2;xy+=(r.x-avgX)*(r.y-avgY);yy+=(r.y-avgY)**2;}
 if(xx<1e-9||yy<1e-9)return null;const slope=xy/xx;return {slope,intercept:avgY-slope*avgX,r:xy/Math.sqrt(xx*yy)};
};
export const empiricalPercentile=(xs,p)=>{const vals=xs.filter(finite).sort((a,b)=>a-b);if(!vals.length)return null;const idx=(vals.length-1)*p,i=Math.floor(idx),t=idx-i;return vals[i]*(1-t)+vals[Math.min(i+1,vals.length-1)]*t;};
export function blockBootstrapRegression(rows,{samples=240,seed=9511}={}){
 const valid=rows.filter(r=>finite(r.x)&&finite(r.y)).sort((a,b)=>a.day.localeCompare(b.day));const main=linear(valid);
 if(!main)return {fit:null,curve:[],reason:'Zu wenig Streuung'};
 if(valid.length<20||new Set(valid.map(r=>r.x)).size<6)return {fit:main,curve:[],reason:'Für das 95%-Intervall werden mindestens 20 Wertepaaren mit ausreichend X-Streuung benötigt.'};
 // Circular contiguous-block bootstrap. Indicative confidence band for fitted mean, NOT a prediction interval.
 let s=seed>>>0;const random=()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};
 const n=valid.length,L=Math.max(3,Math.floor(Math.sqrt(n))),fits=[];
 for(let k=0;k<samples;k++){const selected=[];while(selected.length<n){const start=Math.floor(random()*n);for(let j=0;j<L&&selected.length<n;j++)selected.push(valid[(start+j)%n]);}
  const fit=linear(selected);if(fit)fits.push(fit);
 }
 if(fits.length<samples*.7)return {fit:main,curve:[],reason:'Bootstrap nicht stabil genug für ein Intervall.'};
 const min=Math.min(...valid.map(r=>r.x)),max=Math.max(...valid.map(r=>r.x));
 const curve=Array.from({length:26},(_,i)=>{const x=min+(max-min)*i/25,values=fits.map(f=>f.intercept+f.slope*x);return {x,estimate:main.intercept+main.slope*x,lo:empiricalPercentile(values,.025),hi:empiricalPercentile(values,.975)};});
 return {fit:main,curve,samples:fits.length,blockLength:L,reason:null};
}
const fieldName=k=>EXPLORE_FIELDS.find(x=>x[0]===k)?.[1]||k;
const fieldUnit=k=>EXPLORE_FIELDS.find(x=>x[0]===k)?.[2]||'';
const fmt=v=>Number(v).toLocaleString('de-AT',{maximumFractionDigits:1});
export function explorerChart(pairs,stat){
 if(pairs.length<3)return `<div class="insight-no-data">Nur ${pairs.length} gemeinsam beobachtete Tage. Für eine Analyse sind mindestens 3 Wertepaare nötig.</div>`;
 const W=830,H=326,L=74,R=24,T=26,B=66,ww=W-L-R,hh=H-T-B;
 const xs=pairs.map(p=>p.x),ys=pairs.map(p=>p.y),bands=stat.curve.flatMap(c=>[c.lo,c.hi]);
 const lowX=Math.min(...xs),highX=Math.max(...xs);let lowY=Math.min(...ys,...bands),highY=Math.max(...ys,...bands);
 const dx=Math.max(1,(highX-lowX)*.09),dy=Math.max(1,(highY-lowY)*.09);lowY=Math.max(0,lowY-dy);highY+=dy;
 const minX=Math.max(0,lowX-dx),maxX=highX+dx,X=x=>L+(x-minX)/(maxX-minX||1)*ww,Y=y=>T+hh-(y-lowY)/(highY-lowY||1)*hh;
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" x2="${W-R}" y1="${T+hh*t}" y2="${T+hh*t}" stroke="#DFE8E2"/><text x="${L-12}" y="${T+hh*t+4}" text-anchor="end" font-size="12" fill="#789187">${fmt(highY-(highY-lowY)*t)}</text><text x="${L+ww*t}" y="${H-34}" text-anchor="middle" font-size="12" fill="#789187">${fmt(minX+(maxX-minX)*t)}</text>`).join('');
 const ribbon=stat.curve.length?`<path d="${stat.curve.map((p,i)=>`${i?'L':'M'}${X(p.x).toFixed(2)} ${Y(p.hi).toFixed(2)}`).join(' ')} ${stat.curve.slice().reverse().map(p=>`L${X(p.x).toFixed(2)} ${Y(p.lo).toFixed(2)}`).join(' ')} Z" fill="#64A38E" opacity=".22"/><path d="${stat.curve.map((p,i)=>`${i?'L':'M'}${X(p.x).toFixed(2)} ${Y(p.estimate).toFixed(2)}`).join(' ')}" fill="none" stroke="#2E7767" stroke-width="2.7"/>`:'';
 const dots=pairs.map(p=>`<circle cx="${X(p.x).toFixed(2)}" cy="${Y(p.y).toFixed(2)}" r="4.2" fill="#4E8E80" fill-opacity=".74"><title>${esc(p.day)} · ${fmt(p.x)} × ${fmt(p.y)}</title></circle>`).join('');
 return `<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Streudiagramm mit ${pairs.length} gemeinsamen Datenpaaren und ${stat.curve.length?'explorativem 95-Prozent-Konfidenzband':'ohne Konfidenzband'}">${grid}${ribbon}${dots}</svg></div>`;
}
export function exploreView(days=[],xKey='sleepMinutes',yKey='workMinutes',lag=1){
 const opts=val=>EXPLORE_FIELDS.map(([id,label])=>`<option value="${id}" ${id===val?'selected':''}>${esc(label)}</option>`).join('');
 const pairs=explorePairs(days,xKey,yKey,lag),stat=blockBootstrapRegression(pairs);
 return `<section class="explore-workspace"><div class="insight-stat-intro"><span class="insight-kicker">STATISTIKLABOR / DEIN LEBEN IN DATEN</span><h3>Explore – Zusammenhänge untersuchen</h3><p>Wähle zwei Messgrößen. Nur tatsächlich gemessene Tage werden gepaart. Die Analyse bleibt vollständig lokal im entsperrten Vault.</p></div>
 <div class="explore-controls"><label>X-Achse<select id="explore-x">${opts(xKey)}</select></label><label>Y-Achse<select id="explore-y">${opts(yKey)}</select></label><label>Zeitbezug<select id="explore-lag"><option value="0" ${lag===0?'selected':''}>Gleicher Tag</option><option value="1" ${lag===1?'selected':''}>Y am Folgetag</option><option value="-1" ${lag===-1?'selected':''}>Y am Vortag</option></select></label></div>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>SCATTER / EXPLORATIVE STATISTICS</small><h3>${esc(fieldName(xKey))} × ${esc(fieldName(yKey))}</h3></div><span class="quiet-tag">${pairs.length} Paare</span></div>${explorerChart(pairs,stat)}
 <div class="explore-results"><span><small>Datenpaare</small><strong>${pairs.length}</strong></span><span><small>Pearson r</small><strong>${stat.fit?fmt(stat.fit.r):'–'}</strong></span><span><small>95%-KI</small><strong>${stat.curve.length?'Block-Bootstrap':'Noch nicht'}</strong></span></div>
 <p class="insight-figure-note">${stat.curve.length?`Das transparente Band ist ein <strong>exploratives 95%-Bootstrap-Konfidenzintervall der geschätzten Regressionsmittelwertlinie</strong> (zirkuläre Blöcke von ${stat.blockLength} Beobachtungen, ${stat.samples} Stichproben). Kein individuelles Vorhersageintervall.`:`${esc(stat.reason||'Nur beobachtete Messpunkte, ohne vorgetäuschte Präzision.')}`}</p>
 <p class="insight-figure-note">Fehlende Tage sind keine Nullwerte. Erfasste Pomodoros bilden protokollierte Fokuszeit ab, nicht Produktivitätsqualität. Autokorrelation, Zeittrends, Saisonalität und Drittvariablen können einen Zusammenhang verfälschen. Keine Kausalaussage oder medizinische Diagnose.</p></article></section>`;
}
