/** Compass 0.5.29 · Cumulative day-aligned spending, computed locally from classified expenses.
 * Transfers, cash withdrawals, refunds and unreviewed rows never enter the consumer pace.
 * Imported statement coverage cannot prove calendar completeness. The chart says so.
 */
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const shift=(month,n)=>{const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+n,1)).toISOString().slice(0,7);};
const monthDays=month=>new Date(Date.UTC(+month.slice(0,4),+month.slice(5),0)).getUTCDate();
const validDay=day=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(String(day||'')))return false;const d=new Date(day+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===day;};
const expense=t=>t&&!t.needsReview&&t.flow==='expense'&&Number.isSafeInteger(t.amountCents)&&t.amountCents<0;
function dailyCumulative(rows,month,cutoff){
 const days=Math.min(cutoff,monthDays(month)),totals=Array(days).fill(0);let observed=0,classified=0;
 for(const t of rows){if(!String(t.day||'').startsWith(month)||!validDay(t.day))continue;observed++;if(expense(t)){const day=Number(t.day.slice(8));if(day<=days){totals[day-1]-=t.amountCents;classified++;}}}
 let v=0;return {month,series:totals.map(n=>v+=n),total:totals.reduce((a,b)=>a+b,0),observed,classified};
}
export function spendingPaceModel(rows=[],today=new Date().toISOString().slice(0,10)){
 if(!validDay(today))throw Error('Ungültiger Stichtag für Monatsvergleich.');
 const month=today.slice(0,7),day=Number(today.slice(8)),data=Array.isArray(rows)?rows:[];
 const current=dailyCumulative(data,month,day);
 const previous=dailyCumulative(data,shift(month,-1),day);
 const historical=[1,2,3].map(n=>dailyCumulative(data,shift(month,-n),day));
 // A 3-month average needs three independently observed months: missing months are not zero.
 const eligible=historical.every(m=>m.observed>0);
 const avg3=eligible?{month:'avg3',series:Array.from({length:day},(_,i)=>Math.round(historical.reduce((n,m)=>n+(m.series[Math.min(i,m.series.length-1)]||0),0)/3)),observed:historical.reduce((n,m)=>n+m.observed,0)}:null;
 const baseline=previous.observed>0?previous:null;
 const delta=baseline?current.total-baseline.total:null;
 return {month,day,current,previous:baseline,average3:avg3,deltaCents:delta,
  deltaPercent:baseline&&baseline.total>0?100*delta/baseline.total:null,monthsAvailable:historical.filter(x=>x.observed>0).length};
}
export function spendingPaceView(rows=[],today=new Date().toISOString().slice(0,10),mode='previous'){
 const m=spendingPaceModel(rows,today),avg=mode==='average3',reference=avg?m.average3:m.previous;
 const label=avg?'Ø vorherige 3 Monate':'Vormonat',thisValue=m.current.total,refValue=reference?.series.at(-1)??null;
 const max=Math.max(1,...m.current.series,...(reference?.series||[])),w=760,height=196,left=67,right=18,top=14,bottom=29,plotWidth=w-left-right,plotHeight=height-top-bottom;
 const px=d=>left+plotWidth*(d-1)/Math.max(1,m.day-1),py=v=>top+plotHeight*(1-v/max);
 const line=vals=>vals.map((v,i)=>`${i?'L':'M'}${px(i+1).toFixed(2)} ${py(v).toFixed(2)}`).join(' ');
 const baseline=m.current.series.length?line(m.current.series):'';
 const endX=px(m.day).toFixed(2),endY=py(thisValue).toFixed(2);
 const area=`${baseline} L${endX} ${py(0).toFixed(2)} L${px(1).toFixed(2)} ${py(0).toFixed(2)} Z`;
 const seriesAvailable=m.current.observed>0;
 const change=refValue===null?'Vergleich fehlt':thisValue-refValue>0?`+${eur(thisValue-refValue)} gegenüber ${label}`:`${eur(thisValue-refValue)} gegenüber ${label}`;
 const ticks=[1,Math.max(2,Math.round(m.day/3)),Math.max(2,Math.round(m.day*2/3)),m.day].filter((x,i,a)=>x<=m.day&&a.indexOf(x)===i);
 return `<section class="fin-pace" aria-label="Monatlicher Ausgabenvergleich"><div class="fin-pace-heading"><div><span class="insight-kicker">SPENDING PACE · TAGESGLEICHER VERGLEICH</span><h3>Wie schnell gebe ich diesen Monat Geld aus?</h3><p>Bestätigter Konsum vom 1. bis ${m.day}. · keine Transfers oder Bargeldbehebungen</p></div><label class="fin-pace-selector">Vergleichen mit <select id="finance-pace-compare" aria-label="Vergleichszeitraum für kumulierte Ausgaben"><option value="previous" ${!avg?'selected':''}>Vormonat</option><option value="average3" ${avg?'selected':''}>Ø letzte 3 Monate</option></select></label></div>
 <div class="fin-pace-summary"><div><small>Dieser Monat bis ${m.day}.</small><strong>${eur(thisValue)}</strong></div><div><small>${label} · gleicher Kalendertag</small><strong>${refValue===null?'–':eur(refValue)}</strong></div><span class="fin-pace-delta">${refValue===null?'Vergleich nicht verfügbar':h(change)}</span></div>
 ${seriesAvailable?`<div class="fin-pace-plot"><svg viewBox="0 0 ${w} ${height}" role="img" aria-label="Kumulierte bestätigte Monatsausgaben bis zum gleichen Kalendertag"><defs><linearGradient id="fin-pace-fill-29" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#47A8A0" stop-opacity=".25"/><stop offset="100%" stop-color="#47A8A0" stop-opacity=".025"/></linearGradient></defs>${[0,.25,.5,.75,1].map(fr=>`<g><line x1="${left}" y1="${py(max*fr).toFixed(2)}" x2="${w-right}" y2="${py(max*fr).toFixed(2)}" stroke="#E5ECE9"/><text x="${left-10}" y="${(py(max*fr)+4).toFixed(2)}" text-anchor="end" font-size="11" fill="#71847F">${h(eur(max*fr))}</text></g>`).join('')}<path d="${area}" fill="url(#fin-pace-fill-29)"/><path d="${baseline}" fill="none" stroke="#208E8B" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>${reference?`<path d="${line(reference.series)}" fill="none" stroke="#8893A3" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="7 5"/>`:''}<circle cx="${endX}" cy="${endY}" r="4.5" fill="#208E8B" stroke="white" stroke-width="2"><title>${h(m.month)} · ${h(eur(thisValue))}</title></circle>${ticks.map(d=>`<text x="${px(d).toFixed(2)}" y="${height-13}" text-anchor="middle" font-size="11" fill="#71847F">${d}.</text>`).join('')}</svg><div class="fin-pace-legend"><span><i class="fin-pace-key-current"></i>Dieser Monat</span>${reference?`<span><i class="fin-pace-key-previous"></i>${label}</span>`:''}</div></div>`:'<p class="insight-no-data">In diesem Monat liegen noch keine importierten Buchungen vor.</p>'}
 <details class="fin-pace-caveat"><summary>Datenhinweise</summary><p>${avg&&!reference?'Der Drei-Monats-Vergleich ist erst mit Buchungen aus allen drei Vormonaten verfügbar. ':''}Verglichen wird jeweils nur bis zum gleichen Kalendertag (bei kürzeren Monaten bis zum Monatsende). Unvollständige Bankexporte und noch ungeklärte Buchungen können den Verlauf verändern; fehlende Tage sind kein Nachweis für null Ausgaben.</p></details></section>`;
}
