/** Ars Vivendi .40.25.2 — print-native version of Compass Personal Patterns.
 * Reuses the exact financeCategorySeries calculation from the existing finance dashboard.
 * Privacy: called only with explicit finance permission; no server operations.
 */
import {financeCategorySeries,financeCategory} from './finance-visual-model.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=c=>Number.isFinite(c)?(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0}):'—';
const pct=(value,max)=>Math.max(0,Math.min(1,max>0?value/max:0));
const note=value=>Number.isFinite(value)?value.toLocaleString('de-AT',{maximumFractionDigits:0}):'—';
const preferred=['Lebensmittel','Wohnen','Gesundheit & Sport','Shopping','Freizeit & Reisen','Familie','Essen & Ausgehen','Sonstiges','Mobilität'];
const icons={'Lebensmittel':'🛒','Wohnen':'⌂','Gesundheit & Sport':'✦','Shopping':'◇','Freizeit & Reisen':'✈','Familie':'♡','Essen & Ausgehen':'☕','Sonstiges':'✧','Mobilität':'↗'};
const colors=['#2d7766','#deac50','#7996bc','#c77b72','#8f78b3','#6cad9a','#d49d67','#80a2bf','#bb899c'];

export function annualPersonalPatternModel(transactions=[],endDate=''){
 if(!/^\d{4}-\d\d-\d\d$/.test(endDate))return [];
 const eligible=(Array.isArray(transactions)?transactions:[]).filter(t=>t&&!t.deleted&&typeof t.day==='string'&&t.day<=endDate&&/^\d{4}-\d\d-\d\d$/.test(t.day));
 const totals=new Map();
 for(const t of eligible)if(!t.needsReview&&t.flow==='expense'&&Number.isFinite(t.amountCents)&&t.amountCents<0){
  const name=financeCategory(t);totals.set(name,(totals.get(name)||0)-t.amountCents);
 }
 const sorted=[...totals].sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
 const cats=[...preferred.filter(c=>totals.has(c)),...sorted.filter(c=>!preferred.includes(c))].slice(0,12);
 return cats.map((category,i)=>{
  const series=financeCategorySeries(eligible,category,endDate),p=series.forecast??series.spent;
  const max=Math.max(10000,series.p80??0,(series.mean??0)*1.8,p*1.12);
  return {...series,category,paint:colors[i%colors.length],marker:p,max,fullHistory:series.prior.filter(x=>x.observed).length};
 });
}

function patternCard(o,id){
 const max=o.max,at=c=>28+514*pct(c,max),meanX=o.mean===null?null:at(o.mean),nowX=at(o.marker),q0=o.p20===null?null:at(o.p20),q1=o.p80===null?null:at(o.p80);
 const grad='av252-spectrum-'+id;
 const status=o.n<6?'Wenig Referenzmonate':o.forecast===null?'Monat bisher':o.position;
 const spread=o.p20!==null?`Üblicher Bereich ${euro(o.p20)} – ${euro(o.p80)}`:`${o.n}/12 Referenzmonate`;
 const statusColor=o.forecast!==null&&o.n>=6?(o.position==='Über üblich'?'#a85f4b':o.position==='Unter üblich'?'#267960':'#7b7968'):'#607669';
 return `<article class="av252-card"><div class="av252-card-head"><span class="av252-card-icon" style="color:${o.paint}">${esc(icons[o.category]||'●')}</span><div><strong>${esc(o.category)}</strong><small>${o.n} von 12 Referenzmonaten</small></div><span class="av252-trend">${esc(o.status==='Steigend'?'↗ Steigend':o.status==='Sinkend'?'↘ Sinkend':o.status==='Stabil'?'→ Stabil':'– Trend offen')}</span></div>
  <div class="av252-figures"><div><small>Ø pro Referenzmonat</small><strong>${euro(o.mean)}</strong></div><div><small>${o.forecast!==null?'Prognose Monatsende':'Bisher in diesem Monat'}</small><strong>${euro(o.marker)}</strong></div></div>
  <svg viewBox="0 0 570 76" role="img" aria-label="${esc(o.category)}: zwölfmonatiger Durchschnitt ${euro(o.mean)}; ${o.forecast!==null?'Monatsprognose':'bisheriger Monatsbetrag'} ${euro(o.marker)}; ${esc(spread)}">
   <defs><linearGradient id="${grad}" x1="0" x2="1"><stop offset="0" stop-color="#135e4b"/><stop offset=".27" stop-color="#4b9d79"/><stop offset=".51" stop-color="#91b89a"/><stop offset=".72" stop-color="#ebb95f"/><stop offset=".88" stop-color="#e88953"/><stop offset="1" stop-color="#c84e5f"/></linearGradient></defs>
   <rect x="28" y="21" width="514" height="15" rx="7.5" fill="url(#${grad})"/>
   ${q0!==null?`<rect x="${q0.toFixed(2)}" y="17" width="${Math.max(2,q1-q0).toFixed(2)}" height="23" rx="3" fill="none" stroke="#213c35" stroke-dasharray="5 4" stroke-width="2"/>`:''}
   ${meanX!==null?`<line x1="${meanX.toFixed(2)}" x2="${meanX.toFixed(2)}" y1="11" y2="44" stroke="#263d35" stroke-width="3"/>`:''}
   <path d="M${(nowX-8).toFixed(2)} 4 L${(nowX+8).toFixed(2)} 4 L${nowX.toFixed(2)} 16 Z" fill="#263d35"/><circle cx="${nowX.toFixed(2)}" cy="28.5" r="7.5" fill="#fff" stroke="#293d38" stroke-width="3"/>
   <text x="28" y="64" font-size="15" fill="#658073">0 €</text><text x="542" y="64" text-anchor="end" font-size="15" fill="#658073">${euro(max)}</text>
  </svg>
  <div class="av252-card-foot"><b style="color:${statusColor}">${esc(status)}</b><span>${esc(spread)}</span></div>
 </article>`;
}
const p=(heading,subtitle,body,idx)=>`<section class="av19-page av25-editorial av252-page"><div class="av19-running">PRIVATE ARCHIVE <span>ARS VIVENDI · PERSONAL CHRONICLE</span></div><div class="av19-kicker">VI · FINANCIAL LIFE / PERSONAL PATTERNS ${idx}</div><header class="av19-heading"><h2>${esc(heading)}</h2><p>${esc(subtitle)}</p></header>${body}</section>`;

export function annualFinancePatternPages(state={},w={},settings={}){
 if(!settings.finance)return [];
 const model=annualPersonalPatternModel(state.financeTransactions,w.end);
 if(!model.length)return [];
 const pages=[];
 for(let i=0;i<model.length;i+=6){
  const part=model.slice(i,i+6);const heading=i===0?'Was ist bei mir üblich?':'Mein persönlicher Ausgabenkorridor';
  const intro=i===0?'Deine tatsächlichen monatlichen Ausgaben im Vergleich zu den zwölf vorhergehenden Kalendermonaten.':'Weitere Ausgabenkategorien im selben persönlichen 12-Monats-Vergleich.';
  const cards=`<div class="av252-grid">${part.map((o,j)=>patternCard(o,i+j)).join('')}</div>`;
  const from=model[0].history[0]?.month??'—',to=model[0].history.at(-1)?.month??'—';
  const legend=i===0?`<div class="av252-legend"><span><b class="av252-key av252-key-average"></b>Monatsmittel</span><span><b class="av252-key av252-key-current"></b>aktueller Wert</span><span><b class="av252-key av252-key-band"></b>20.–80. Perzentil</span></div>`:'';
  const findings=part.filter(x=>x.forecast!==null&&x.n>=6&&['Unter üblich','Über üblich'].includes(x.position));
  const summary=findings.length?findings.slice(0,3).map(x=>`${x.category}: ${x.position.toLowerCase()} (${euro(x.forecast)} prognostiziert gegenüber ${euro(x.mean)} im Monatsmittel)`).join(' · '):'Die Grafik zeigt für jede Kategorie den Vergleich mit ihrer eigenen zwölfmonatigen Ausgabengeschichte.';
  const insight=`<div class="av252-insight"><strong>Dein finanzielles Muster</strong><p>${esc(summary)}</p></div>`;
  const foot=`<p class="av252-note">Referenz: ${esc(from)} bis ${esc(to)}. Nur bestätigte Konsumausgaben; Transfers, ungeklärte Buchungen und Depotkäufe werden nicht als Konsum behandelt. Ein angebrochener Monat wird nur bei regelmäßigen historischen Ausgaben hochgerechnet.</p>`;
  pages.push(p(heading,intro,legend+cards+insight+foot,String(i/6+1).padStart(2,'0')));
 }
 return pages;
}
export const ANNUAL_FINANCE_PATTERNS_CSS=`
.av252-page{gap:3mm}.av252-page .av19-heading h2{font-size:29px}.av252-page .av19-heading{margin-bottom:1mm}.av252-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2.5mm 3mm;grid-auto-rows:44mm;align-content:start}.av252-card{border:1px solid #d6e3d9;border-radius:2.5mm;padding:1.6mm 2.5mm 1.5mm;display:flex;flex-direction:column;gap:.65mm;min-width:0;background:#fff;box-sizing:border-box;height:44mm;min-height:44mm;break-inside:avoid}.av252-card-head{display:flex;align-items:center;gap:1.8mm;min-width:0}.av252-card-icon{font-size:17px}.av252-card-head>div{min-width:0;flex:1}.av252-card-head strong{font:700 12px/1.1 system-ui,sans-serif;color:#233e31;display:block}.av252-card-head small{font:8.5px system-ui,sans-serif;color:#8c9b8e;display:block;margin-top:1mm}.av252-trend{font:8.5px system-ui,sans-serif;color:#547369;white-space:nowrap}.av252-figures{display:grid;grid-template-columns:1fr 1fr;gap:2mm}.av252-figures small{display:block;font:9px/1.2 system-ui,sans-serif;color:#869c8c}.av252-figures strong{display:block;font:700 16px/1.25 Georgia,serif;color:#264b3b}.av252-card svg{width:100%;height:12mm;display:block;overflow:visible}.av252-card-foot{display:flex;gap:1mm;align-items:baseline;justify-content:space-between;min-width:0}.av252-card-foot b{font:700 9px system-ui,sans-serif;white-space:nowrap}.av252-card-foot span{font:8.5px system-ui,sans-serif;color:#779186;text-align:right}.av252-legend{display:flex;flex-wrap:wrap;gap:5mm;font:9px system-ui,sans-serif;color:#607c6f}.av252-legend span{display:flex;align-items:center;gap:1.5mm}.av252-key{height:8px;width:11px;display:inline-block}.av252-key-average{border-left:2px solid #243c33}.av252-key-current{border-radius:50%;width:7px;height:7px;background:#fff;border:2px solid #243c33}.av252-key-band{border:1.5px dashed #243c33}.av252-insight{border-top:1px solid #dce6da;padding-top:3mm;margin-top:1mm}.av252-insight strong{font:17px Georgia,serif;color:#2c5a45}.av252-insight p{font:11px/1.4 system-ui,sans-serif;color:#4a6356;margin:1mm 0}.av252-note{margin-top:1mm;font:9px/1.35 system-ui,sans-serif;color:#799083}
`;
