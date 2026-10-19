/** Compass 0.5.18 · transparent, local-only expense planning.
 * Historical transaction files cannot prove complete account coverage. Output is
 * a conditional cash-spending scenario, never a guarantee or bank balance.
 */
import {merchantKey} from './finance-core.js';
import {escapeFinance} from './finance-core.js';
const h=escapeFinance;
const euro=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const month=(day,offset=0)=>{const [y,m]=String(day).slice(0,7).split('-').map(Number);return new Date(Date.UTC(y,m-1+offset,1)).toISOString().slice(0,7);};
const goodDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d||''))&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const eligible=t=>t&&!t.needsReview&&t.flow==='expense'&&Number.isFinite(t.amountCents)&&t.amountCents<0&&goodDay(t.day);
const sum=(xs,k)=>xs.reduce((s,x)=>s+x[k],0);
const avg=xs=>xs.length?xs.reduce((s,v)=>s+v,0)/xs.length:null;
const pctile=(xs,p)=>{if(!xs.length)return null;const a=[...xs].sort((x,y)=>x-y),index=(a.length-1)*p,j=Math.floor(index);return a[j]+((a[j+1]??a[j])-a[j])*(index-j);};
const rnd=n=>Math.round(Math.max(0,n));
export function financeForecastModel(transactions=[],manual={},today=new Date().toISOString().slice(0,10)){
 const day=goodDay(today)?today:new Date().toISOString().slice(0,10),lastMonth=month(day,-1),firstDay=transactions.filter(t=>goodDay(t.day)).map(t=>t.day).sort()[0]||null;
 const periods=Array.from({length:12},(_,i)=>month(day,i-12));
 const monthly=periods.map(m=>{
  const all=transactions.filter(t=>goodDay(t.day)&&t.day.startsWith(m));
  const spent=all.filter(eligible);
  const fixed=spent.filter(t=>manual[merchantKey(t.merchant||'')]==='fixed');
  return {month:m,available:all.length>0&&(!firstDay||m>firstDay.slice(0,7)),rows:all.length,total:spent.reduce((a,t)=>a-t.amountCents,0),fixed:fixed.reduce((a,t)=>a-t.amountCents,0),income:all.filter(t=>!t.needsReview&&t.flow==='income'&&t.amountCents>0).reduce((a,t)=>a+t.amountCents,0),pending:all.filter(t=>t.needsReview).length};
 }).map(m=>({...m,variable:m.total-m.fixed}));
 const latest=monthly.slice(-6),usable=latest.length===6&&latest.every(m=>m.available),allHistoric=monthly.filter(m=>m.available);
 const trend=usable?{recent:rnd(avg(latest.slice(-3).map(m=>m.total))),earlier:rnd(avg(latest.slice(0,3).map(m=>m.total)))}:null;
 if(trend){trend.delta=trend.recent-trend.earlier;trend.pct=trend.earlier>0?100*trend.delta/trend.earlier:null;}
 const explicitFixed=Object.values(manual).filter(x=>x==='fixed').length;
 const warnings=[];
 if(!usable)warnings.push('Nicht sechs unmittelbar aufeinanderfolgende historische Monate mit Buchungen vorhanden.');
 if(transactions.some(t=>t.needsReview))warnings.push('Ungeklärte Buchungen sind ausgeschlossen.');
 if(transactions.some(t=>t.flow==='cash'&&t.amountCents<0))warnings.push('Bargeldverwendung ist nicht aus Abhebungen ableitbar.');
 if(transactions.some(t=>t.currency&&t.currency!=='EUR'))warnings.push('Fremdwährungen nur soweit als EUR-Buchungen vorhanden.');
 warnings.push('Ein Monat mit Buchungen ist nicht automatisch ein vollständig exportierter Monat. Fehlende Konten und noch nicht importierte Tage können die Schätzung verzerren.');
 if(!usable)return {ready:false,monthly,lastMonth,observed:allHistoric.length,trend:null,warnings,confirmedMerchants:explicitFixed,backtests:0,scenario:[],baseline:null};
 const last3=latest.slice(-3),fixed=rnd(avg(last3.map(x=>x.fixed))),variable=rnd(avg(last3.map(x=>x.variable))),income=rnd(avg(last3.map(x=>x.income))),baseline=fixed+variable;
 // One-month walk-forward: each prediction uses only the preceding 3 observations.
 const errors=[];
 for(let i=3;i<monthly.length;i++){
  const window=monthly.slice(i-3,i),target=monthly[i];
  if(target.available&&window.every(x=>x.available))errors.push(Math.abs(target.total-avg(window.map(x=>x.total))));
 }
 const empirical=errors.length>=3?pctile(errors,.8):null;
 const dispersion=pctile(latest.map(x=>x.total),.8)-pctile(latest.map(x=>x.total),.2);
 const deviation=empirical??Math.max(dispersion/2,baseline*.1);
 // Bands widen with horizon, but do not imply probability or statistical calibration.
 const scenario=[1,2,3].map(i=>({month:month(day,i),central:baseline,low:rnd(baseline-deviation*Math.sqrt(i)),high:rnd(baseline+deviation*Math.sqrt(i))}));
 return {ready:true,monthly,lastMonth,observed:allHistoric.length,trend,warnings,confirmedMerchants:explicitFixed,backtests:errors.length,empirical:empirical!==null,fixed,variable,income,baseline,scenario};
}
const point=(x,y)=>`${Math.round(x)},${Math.round(y)}`;
export function financeForecastDashboard(transactions=[],manual={},today=new Date().toISOString().slice(0,10),variant='basis'){
 const m=financeForecastModel(transactions,manual,today),warning=m.warnings.map(s=>`<li>${h(s)}</li>`).join('');
 if(!m.ready)return `<section class="fin-forecast-18"><div class="fin-art-heading"><div><small>FORECAST / DATENQUALITÄT</small><h3>Wie könnte es weitergehen?</h3></div></div><div class="fin-forecast-empty"><strong>Eine vorsichtige Monatsprojektion ist noch nicht belastbar.</strong><p>${m.observed} historische Monate mit irgendeinem Import. Für die Berechnung benötigen wir sechs unmittelbar vor dem laufenden Monat liegende Monate mit Buchungen.</p></div><ul class="fin-forecast-warnings">${warning}</ul></section>`;
 const variants={basis:1,sparsam:.9,mehr:.1+1},mult=variants[variant]||1;
 const forecasts=m.scenario.map(x=>({...x,central:rnd(m.fixed+m.variable*mult),low:rnd(m.fixed+Math.max(0,(x.low-m.fixed)*mult)),high:rnd(m.fixed+(x.high-m.fixed)*mult)}));
 const history=m.monthly.slice(-9),W=970,H=330,L=70,R=44,T=30,B=59,all=[...history.map(x=>x.total),...forecasts.map(x=>x.high)],top=Math.max(20000,...all)*1.13;
 const X=i=>L+i*(W-L-R)/(history.length+3-1),Y=value=>T+(H-T-B)*(1-value/top);
 const known=history.map((x,i)=>x.available?point(X(i),Y(x.total)):null),segments=[];let current=[];
 known.forEach(p=>{if(p)current.push(p);else {if(current.length>1)segments.push(current.join(' '));current=[];}});if(current.length>1)segments.push(current.join(' '));
 const bandTop=forecasts.map((x,i)=>point(X(history.length+i),Y(x.high)));
 const bandBottom=forecasts.map((x,i)=>point(X(history.length+i),Y(x.low))).reverse();
 const start=history.at(-1),poly=[point(X(history.length-1),Y(start.total)),...bandTop,...bandBottom].join(' ');
 const line=forecasts.map((x,i)=>point(X(history.length+i),Y(x.central))).join(' ');
 const coverage=m.empirical?`Empirische Fehlerspanne aus ${m.backtests} rückblickenden Ein-Monats-Proben`:`Illustrative Streuung (${m.backtests} Rücktests – für Fehlerspanne zu wenig)`;
 const fmt=n=>Number(n).toLocaleString('de-AT',{maximumFractionDigits:1});
 return `<section class="fin-forecast-18"><div class="fin-forecast-kpis"><article><small>Ø Konsum · letzte 3 Monate</small><strong>${h(euro(m.baseline))}</strong><span>${h(m.trend.pct===null?'Vorperiode ohne Basis':`${m.trend.pct>=0?'+':''}${fmt(m.trend.pct)} % gegenüber vorigen 3 Monaten`)}</span></article><article><small>Bestätigte regelmäßige Händler</small><strong>${h(euro(m.fixed))}</strong><span>${m.confirmedMerchants} bestätigte Händlerregeln · keine Vertragszusicherung</span></article><article><small>Variable Ausgaben · Ø</small><strong>${h(euro(m.variable))}</strong><span>Rest des Konsums, inkl. unregelmäßiger Ausgaben</span></article><article><small>Einnahmen · Ø</small><strong>${h(euro(m.income))}</strong><span>Nur eingestufte Einnahmen</span></article></div>
 <div class="fin-forecast-controls"><label>Szenario <select id="finance-forecast-scenario"><option value="basis" ${variant==='basis'?'selected':''}>Basis · bisheriges Niveau</option><option value="sparsam" ${variant==='sparsam'?'selected':''}>10 % weniger variable Ausgaben</option><option value="mehr" ${variant==='mehr'?'selected':''}>10 % mehr variable Ausgaben</option></select></label><span>Keine automatische Anpassung von Fixkosten</span></div>
 <div class="fin-viz-scroll"><svg viewBox="0 0 ${W} ${H}" class="fin-forecast-svg" role="img" aria-label="Historische Monatsausgaben mit rollierendem Drei-Monats-Szenario und Band aus Rücktestfehlern beziehungsweise beobachteter Streuung">
 ${[0,.25,.5,.75,1].map(v=>`<line x1="${L}" x2="${W-R}" y1="${Math.round(Y(v*top))}" y2="${Math.round(Y(v*top))}" stroke="#E3ECE5"/><text x="${L-10}" y="${Math.round(Y(v*top)+4)}" text-anchor="end" font-size="11" fill="#81988A">${h(euro(v*top))}</text>`).join('')}
 <polygon points="${poly}" fill="#80AABD" opacity=".29"/>
 ${segments.map(s=>`<polyline points="${s}" fill="none" stroke="#2E917D" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`).join('')}
 ${known.map((p,i)=>p?`<circle cx="${Math.round(X(i))}" cy="${Math.round(Y(history[i].total))}" r="3.5" fill="#2E917D"><title>${h(history[i].month)} · ${h(euro(history[i].total))}</title></circle>`:'').join('')}
 <path d="M${point(X(history.length-1),Y(start.total))} L${point(X(history.length),Y(forecasts[0].central))} ${line.split(' ').slice(1).map(p=>`L${p}`).join(' ')}" fill="none" stroke="#D5805E" stroke-width="3" stroke-dasharray="8 7"/>
 <line x1="${Math.round(X(history.length-1)+17)}" y1="${T}" x2="${Math.round(X(history.length-1)+17)}" y2="${H-B}" stroke="#9BAEA4" stroke-dasharray="3 5"/>
 ${history.map((x,i)=>i%2===0?`<text x="${Math.round(X(i))}" y="${H-21}" font-size="11" text-anchor="middle" fill="#779081">${h(x.month.slice(2))}</text>`:'').join('')}${forecasts.map((x,i)=>`<text x="${Math.round(X(history.length+i))}" y="${H-21}" font-size="11" text-anchor="middle" fill="#B2725A">${h(x.month.slice(2))}</text>`).join('')}
 </svg></div><div class="fin-forecast-table">${forecasts.map(f=>`<div><small>${h(f.month)}</small><strong>${h(euro(f.central))}</strong><span>${h(euro(f.low))} – ${h(euro(f.high))}</span></div>`).join('')}</div>
 <p class="fin-art-note"><strong>${h(coverage)}.</strong> Das Band ist weder ein 95-%-Konfidenzintervall noch eine garantierte Prognose. Keine zukünftigen Zinserträge, Reisebuchungen oder Kontostände werden angenommen.</p>
 <details class="fin-forecast-method"><summary>Berechnung & Datenqualität nachvollziehen</summary><p>Basis: Ø der letzten drei erfassten vollständigen Kalendermonate; Fixkosten sind ausschließlich ausdrücklich bestätigte wiederkehrende Händler. Band: 80. Perzentil der absoluten Rücktestfehler (falls mindestens drei Rücktests möglich), sonst beobachtete Streuung. Alle drei Folgemonate verwenden denselben Ausgangswert, das Band wird mit dem Zeithorizont größer. Keine automatische Saisonbereinigung.</p><ul class="fin-forecast-warnings">${warning}</ul></details></section>`;
}
/** Composition of observed expense months; only explicit recurring confirmations are called fixed. */
export function financeFixedVariableView(transactions=[],manual={},today=new Date().toISOString().slice(0,10)){
 const m=financeForecastModel(transactions,manual,today),months=m.monthly.slice(-6),max=Math.max(1,...months.map(x=>x.total));
 return `<section class="fin-visual-section fin-fixed-structure"><div class="fin-art-heading"><div><small>COST STRUCTURE / LETZTE 6 MONATE</small><h3>Was ist regelmäßig, was bleibt variabel?</h3></div><span class="fin-art-tag">${m.confirmedMerchants} bestätigte Händlerregeln</span></div>
 <div class="fin-fixed-months">${months.map(x=>`<div class="fin-fixed-month ${x.available?'':'is-missing'}" title="${h(x.month)}: ${x.available?`${euro(x.fixed)} wiederkehrend · ${euro(x.variable)} variabel`:'Keine importierten Buchungen'}"><div class="fin-fixed-bar"><span class="fixed" style="height:${x.available?Math.max(0,100*x.fixed/max):0}%"></span><span class="variable" style="height:${x.available?Math.max(0,100*x.variable/max):0}%"></span></div><small>${h(x.month.slice(2))}</small></div>`).join('')}</div>
 <div class="insight-legend"><span><i style="background:#338D7A"></i>Von dir bestätigte regelmäßige Ausgaben</span><span><i style="background:#E9A470"></i>Übriger Konsum</span></div>
 <p class="fin-art-note">Die Zuordnung „regelmäßig“ erfolgt ausschließlich bei von dir bestätigten Händlern unter Fixkosten. Nicht bestätigte regelmäßige Zahlungen werden zunächst als variabel ausgewiesen. Fehlende Monate bleiben leer. Eine regelmäßige Zahlung muss kein vertraglicher Fixkostenposten sein.</p></section>`;
}
