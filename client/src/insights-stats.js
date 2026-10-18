/** Personal, descriptive statistics from measured nights. No fake Garmin baseline or medical status. */
const finite=x=>Number.isFinite(x);
export function percentile(values,p){
 const sorted=values.filter(finite).sort((a,b)=>a-b);
 if(!sorted.length||!finite(p)||p<0||p>1)return null;
 const at=(sorted.length-1)*p,i=Math.floor(at),f=at-i;
 return sorted[i]+(sorted[Math.min(i+1,sorted.length-1)]-sorted[i])*f;
}
export function hrvObservedBand(hrv,minimum=14){
 const values=(hrv||[]).map(x=>x.nightAverageMs).filter(x=>finite(x)&&x>0);
 if(values.length<minimum)return {count:values.length,low:null,high:null,median:null};
 return {count:values.length,low:percentile(values,.20),high:percentile(values,.80),median:percentile(values,.5)};
}
export function weeklyDistributions(nights){
 const weeks=new Map();for(const n of nights||[]){if(!/^\d{4}-\d\d-\d\d$/.test(n.day||'')||!finite(n.sleepMinutes)||n.sleepMinutes<=0)continue;
  const d=new Date(`${n.day}T12:00:00Z`);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));const key=d.toISOString().slice(0,10);
  if(!weeks.has(key))weeks.set(key,[]);weeks.get(key).push(n.sleepMinutes);
 }
 return [...weeks.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([week,values])=>({week,count:values.length,median:percentile(values,.5),q1:values.length>=3?percentile(values,.25):null,q3:values.length>=3?percentile(values,.75):null,mean:values.reduce((a,b)=>a+b,0)/values.length}));
}
export function joinedSleepHrv(nights,hrv){
 const hr=new Map((hrv||[]).filter(x=>finite(x.nightAverageMs)&&x.nightAverageMs>0).map(x=>[x.day,x.nightAverageMs]));
 return (nights||[]).filter(x=>finite(x.sleepMinutes)&&x.sleepMinutes>0&&hr.has(x.day)).map(x=>({day:x.day,sleepMinutes:x.sleepMinutes,nightAverageMs:hr.get(x.day)}));
}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mins=v=>`${Math.floor(v/60)}:${String(Math.round(v%60)).padStart(2,'0')}`;
export function sleepDistributionChart(nights){
 const rows=weeklyDistributions(nights).slice(-14);
 if(!rows.length)return '<p class="insight-no-data">Keine gemessenen Schlafwochen vorhanden.</p>';
 const W=760,H=264,L=54,R=18,T=20,B=46,ww=W-L-R,hh=H-T-B;
 const vals=rows.flatMap(x=>[x.median,x.q1,x.q3].filter(finite));const low=Math.max(0,Math.min(...vals)-55),high=Math.max(...vals)+55;
 const Y=v=>T+hh-(v-low)/(high-low||1)*hh;
 const X=i=>L+(i+.5)*(ww/rows.length);
 const grid=[0,.25,.5,.75,1].map(t=>{const v=low+(high-low)*t;return `<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#E6EEE9"/><text x="${L-7}" y="${Y(v)+4}" text-anchor="end" fill="#7B9283" font-size="11">${esc(mins(v))}</text>`;}).join('');
 const data=rows.map((r,i)=>{const x=X(i);return `${finite(r.q1)?`<line x1="${x}" x2="${x}" y1="${Y(r.q1)}" y2="${Y(r.q3)}" stroke="#A6BCC8" stroke-width="9" stroke-linecap="round"><title>${esc(r.week)} · Interquartilsbereich ${mins(r.q1)}–${mins(r.q3)} · ${r.count} Nächte</title></line>`:''}<circle cx="${x}" cy="${Y(r.median)}" r="4.4" fill="#367F71"><title>${esc(r.week)} · Median ${mins(r.median)} · ${r.count} Nächte</title></circle>${i%Math.max(1,Math.ceil(rows.length/6))===0?`<text x="${x}" y="${H-15}" text-anchor="middle" fill="#788E84" font-size="10">${esc(r.week.slice(5))}</text>`:''}`;}).join('');
 return `<div class="insight-figure-header"><span>Schlafverteilung je Woche</span><small>Median + IQR bei mindestens 3 Nächten</small></div><div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Schlafdauer: wöchentlicher Median mit Interquartilsbereich">${grid}${data}</svg></div><p class="insight-figure-note">Die dicken Striche zeigen die mittleren 50 % der erfassten Nächte (IQR), <strong>kein 95%-Konfidenzintervall</strong>. Einzelne Wochen mit weniger als 3 Nächten zeigen nur den Median.</p>`;
}
export function hrvReferenceView(hrv,chart){
 const band=hrvObservedBand(hrv);
 const label=x=>x==null?'–':x.toLocaleString('de-AT',{maximumFractionDigits:1});
 const rows=(hrv||[]).filter(x=>finite(x.nightAverageMs)&&x.nightAverageMs>0);
 return `<div class="insight-reference-card"><div class="insight-reference-metrics"><span><small>20. Perzentil</small><strong>${label(band.low)}${band.low==null?'':' ms'}</strong></span><span><small>Median</small><strong>${label(band.median)}${band.median==null?'':' ms'}</strong></span><span><small>80. Perzentil</small><strong>${label(band.high)}${band.high==null?'':' ms'}</strong></span></div>
 ${band.low===null?`<p class="insight-figure-note">${band.count} gemessene HRV-Nächte · für einen eigenen beobachteten Referenzbereich benötigen wir mindestens 14 Nächte im gewählten Zeitraum.</p>`:`${chart(rows,[{key:'nightAverageMs',label:'Nächtliche HRV',color:'#8065A9'}],'Nächtliche HRV mit beobachtetem Streubereich',{unit:' ms',baselineBand:[band.low,band.high]})}<p class="insight-figure-note">Der farbige Bereich umfasst das 20.–80. Perzentil deiner <strong>gemessenen</strong> HRV-Nächte (${band.count} Werte). Das ist weder eine Garmin-HRV-Baseline noch ein medizinischer Normbereich oder ein 95%-KI.</p>`}</div>`;
}
export function sleepHrvScatter(nights,hrv){
 const rows=joinedSleepHrv(nights,hrv);
 if(rows.length<3)return `<p class="insight-no-data">${rows.length} Nächte mit gemeinsamem Schlaf- und HRV-Wert. Für den Vergleich werden mindestens drei Nächte benötigt.</p>`;
 const W=760,H=235,L=64,R=25,T=16,B=49,ww=W-L-R,hh=H-T-B;
 const xs=rows.map(x=>x.sleepMinutes),ys=rows.map(x=>x.nightAverageMs),xlo=Math.max(0,Math.min(...xs)-30),xhi=Math.max(...xs)+30,ylo=Math.max(0,Math.min(...ys)-5),yhi=Math.max(...ys)+5;
 const X=x=>L+(x-xlo)/(xhi-xlo||1)*ww,Y=y=>T+hh-(y-ylo)/(yhi-ylo||1)*hh;
 const grid=[0,.25,.5,.75,1].map(t=>`<line x1="${L}" x2="${W-R}" y1="${T+hh*t}" y2="${T+hh*t}" stroke="#E8EFEB"/><text x="${L-8}" y="${T+hh*t+3}" text-anchor="end" fill="#84968D" font-size="10">${Math.round(yhi-(yhi-ylo)*t)}</text><text x="${L+ww*t}" y="${H-19}" text-anchor="middle" fill="#84968D" font-size="10">${mins(xlo+(xhi-xlo)*t)}</text>`).join('');
 return `<div class="insight-figure-header"><span>Schlafdauer × HRV derselben Nacht</span><small>${rows.length} Wertepaar(e)</small></div><div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Streudiagramm Schlafdauer und HRV, ${rows.length} gemeinsame Nächte">${grid}${rows.map(d=>`<circle cx="${X(d.sleepMinutes)}" cy="${Y(d.nightAverageMs)}" r="4.1" fill="#8065A9" opacity=".78"><title>${esc(d.day)} · ${mins(d.sleepMinutes)} h Schlaf · ${d.nightAverageMs.toLocaleString('de-AT')} ms</title></circle>`).join('')}<text x="${W/2}" y="${H-2}" text-anchor="middle" font-size="11" fill="#758C80">Schlafdauer [h:mm]</text><text x="10" y="${H/2}" transform="rotate(-90 10 ${H/2})" text-anchor="middle" font-size="11" fill="#758C80">HRV [ms]</text></svg></div><p class="insight-figure-note">Deskriptiver Vergleich, ohne vorgetäuschte Korrelation, Trendlinie oder kausale Interpretation. Weitere statistische Auswertungen folgen mit ausreichender Datenmenge.</p>`;
}
