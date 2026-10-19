/** Compass 0.5.32. A circular chord view of VERIFIED account movements. 
 * Edges are observed transfers, not inferred source-of-income, investment performance, or stock-flow-equivalent wealth.
 */
import {accountFor,accountLabel} from './finance-revolut.js';
import {wealthSummary} from './finance-wealth-consolidation.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const short=s=>String(s||'').length>21?String(s).slice(0,20)+'…':String(s||'');
const money=n=>Number.isSafeInteger(n)&&n>0?n:0;
export const circularFlowPalette=['#ABD349','#28B682','#197FA6','#3B64B5','#673CA2','#AB075B','#E0443A','#F39A29'];
export const nodeColor=(id)=>{
 const key=String(id||'').toLocaleLowerCase('en-US');
 if(key.startsWith('raiffeisen'))return circularFlowPalette[0];
 if(key.startsWith('n26'))return circularFlowPalette[1];
 if(key.startsWith('revolut'))return circularFlowPalette[2];
 if(key.startsWith('dkb:visa'))return circularFlowPalette[5];
 if(key.startsWith('dkb'))return circularFlowPalette[4];
 if(key.includes('kraken')||key.includes('crypto'))return circularFlowPalette[7];
 if(key.includes('flatex')||key.includes('depot'))return circularFlowPalette[6];
 let hash=2166136261;for(const c of key){hash=Math.imul(hash^c.charCodeAt(0),16777619);}
 return circularFlowPalette[(hash>>>0)%circularFlowPalette.length];
};
function investmentTarget(t){
 if(t?.category==='Transfer / Krypto')return /\bkraken\b/iu.test(String(t.description||t.merchant||''))?'Kraken':'Kryptobörse';
 if(t?.category==='Transfer / Depot & Wertpapiere')return /\bflatex\b/iu.test(String(t.description||t.merchant||''))?'flatex':'Wertpapierdepot';
 return null;
}
export function observedCircularEdges(rows=[]){
 const input=Array.isArray(rows)?rows:[];
 const byId=new Map(input.filter(t=>t?.id).map(t=>[t.id,t]));
 const seen=new Set(), edges=new Map();
 const add=(from,to,fromLabel,toLabel,cents,ids,type)=>{
  if(!money(cents)||!from||!to||from===to)return;
  const id=JSON.stringify([from,to,type]);
  let edge=edges.get(id);if(!edge){edge={id,from,to,fromLabel,toLabel,cents:0,count:0,transactionIds:[],type};edges.set(id,edge);}
  edge.cents+=cents;edge.count++;edge.transactionIds.push(...ids);
 };
 for(const t of input){
  if(!t?.id||seen.has(t.id))continue;
  const counterpart=t.linkedTransferId&&byId.get(t.linkedTransferId);
  if(counterpart&&counterpart.id!==t.id&&counterpart.linkedTransferId===t.id&&
    !t.needsReview&&!counterpart.needsReview&&t.flow==='transfer'&&counterpart.flow==='transfer'&&
    Number.isSafeInteger(t.amountCents)&&t.amountCents===-counterpart.amountCents&&
    accountFor(t)!==accountFor(counterpart)){
    seen.add(t.id);seen.add(counterpart.id);
    const source=t.amountCents<0?t:counterpart,target=t.amountCents>0?t:counterpart;
    if(source.amountCents<0&&target.amountCents>0)add(accountFor(source),accountFor(target),accountLabel(source),accountLabel(target),-source.amountCents,[source.id,target.id],'confirmed');
    continue;
  }
  // A one-sided negative investment transfer can be visualized as an observed deposit,
  // NOT as a recognized counterpart transaction or an actual portfolio balance.
  if(!t.needsReview&&t.flow==='transfer'&&t.amountCents<0&&!t.linkedTransferId){
   const target=investmentTarget(t);
   if(target){seen.add(t.id);add(accountFor(t),'investment:'+target,accountLabel(t),target,-t.amountCents,[t.id],'investment');}
  }
 }
 return [...edges.values()].sort((a,b)=>b.cents-a.cents);
}
function transactionDetails(rows,edge){
 if(!edge)return '';
 const byId=new Map(rows.map(t=>[t.id,t]));const found=edge.transactionIds.map(id=>byId.get(id)).filter(Boolean).slice(0,35);
 return `<section class="fin32-cycle-detail" aria-live="polite"><div class="fin31-card-header"><div><strong>${esc(edge.fromLabel)} → ${esc(edge.toLabel)}</strong><small>${esc(edge.count)} bestätigte Bewegung(en) · ${esc(euro(edge.cents))}</small></div><button type="button" class="fin31-link" data-action="finance-cycle-clear">Schließen</button></div>
 <div class="fin32-cycle-tx">${found.map(t=>`<div><small>${esc(t.day||'')}</small><span>${esc((t.merchant||t.category||'Buchung').slice(0,65))}</span><b>${esc(euro(t.amountCents||0))}</b></div>`).join('')}</div>${edge.transactionIds.length>35?`<p class="fin31-footnote">${edge.transactionIds.length-35} weitere Buchungszeilen in der Datenquelle.</p>`:''}<p class="fin31-footnote">Die Gegenbuchung eines bestätigten Eigenübertrags wird angezeigt, aber die Bewegung im Diagramm nur einmal gezählt.</p></section>`;
}
export function circularWealthFlowView(state={},rows=[],selectedId='',account='all',options={}){
 const compact=options?.compact===true;
 const edges=observedCircularEdges(rows).filter(e=>account==='all'||e.from===account||e.to===account),sum=edges.reduce((s,e)=>s+e.cents,0), nodesMap=new Map();
 for(const e of edges){for(const [id,label] of [[e.from,e.fromLabel],[e.to,e.toLabel]])if(!nodesMap.has(id))nodesMap.set(id,{id,label,amount:0});nodesMap.get(e.from).amount+=e.cents;nodesMap.get(e.to).amount+=e.cents;}
 // The limit applies to the VISUAL only; the list and selected transaction inspection retain every confirmed edge.
 const top=edges.slice(0,14),visibleKeys=new Set(top.flatMap(e=>[e.from,e.to]));
 const nodes=[...nodesMap.values()].filter(n=>visibleKeys.has(n.id));
 const cx=460,cy=256,r=181;const loc=new Map(nodes.map((n,i)=>{const angle=2*Math.PI*i/Math.max(1,nodes.length)-Math.PI/2;return [n.id,{x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle),angle}]}));
 const max=Math.max(...top.map(e=>e.cents),1);
 const palette=circularFlowPalette;
 const gradients=top.map((e,i)=>{const a=loc.get(e.from),b=loc.get(e.to);return `<linearGradient id="fin34-edge-${i}" gradientUnits="userSpaceOnUse" x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}"><stop offset="0" stop-color="${nodeColor(e.from)}"/><stop offset=".52" stop-color="#375BAC"/><stop offset="1" stop-color="${nodeColor(e.to)}"/></linearGradient>`;}).join('');
 const edgeIndex=new Map(top.map((e,i)=>[e.id,i]));
 const lines=top.slice().reverse().map(e=>{
  const a=loc.get(e.from),b=loc.get(e.to),s=(3+23*Math.sqrt(e.cents/max)).toFixed(1);
  const d=`M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx},${cy} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  const selected=e.id===selectedId;
  const color=`url(#fin34-edge-${edgeIndex.get(e.id)})`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${s}" stroke-opacity="${selected?'1':'.68'}" stroke-linecap="round" ${e.type==='investment'?'stroke-dasharray="9 5"':''}><title>${esc(e.fromLabel)} → ${esc(e.toLabel)} · ${esc(euro(e.cents))}</title></path><path d="${d}" fill="none" stroke="transparent" stroke-width="${Math.max(22,Number(s)+8)}" stroke-linecap="round" data-action="finance-cycle-inspect" data-id="${esc(e.id)}" aria-label="${esc(e.fromLabel)} nach ${esc(e.toLabel)}: ${esc(euro(e.cents))}" role="button" tabindex="0" class="fin32-cycle-hit"/>`;
 }).join('');
 const dots=nodes.map((n,i)=>{
  const p=loc.get(n.id),outX=cx+(r+19)*Math.cos(p.angle),outY=cy+(r+19)*Math.sin(p.angle);
  const anchor=outX<cx-18?'end':outX>cx+18?'start':'middle';
  return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="9" fill="${nodeColor(n.id)}" stroke="white" stroke-width="3"><title>${esc(n.label)}</title></circle><text x="${outX.toFixed(1)}" y="${outY.toFixed(1)}" font-size="12" text-anchor="${anchor}" fill="#3a5b50">${esc(short(n.label))}</text>`;
 }).join('');
 const selected=edges.find(e=>e.id===selectedId);
 const wealth=wealthSummary(state);
 const wealthNote=(wealth.observed.length||wealth.krakenPricedCents)?`<div class="fin32-wealth-note"><span>Separat dokumentierte Bestände</span><strong>${esc(euro(wealth.totalObservedCents))}</strong><small>Manuelle Konto-/Depotstände und ggf. bewertete Kraken-Bestände · unterschiedliche Stichtage möglich · kein errechneter Geldfluss</small><button type="button" class="fin31-link" data-action="finance-pane" data-id="Portfolio">Bestände ansehen →</button></div>`:'';
 return `<section class="fin32-cycle-layout ${compact?'fin33-cycle-compact':''}" aria-label="Interaktiver Vermögenskreislauf"><div class="fin32-cycle-top"><div><span class="insight-kicker">BEOBACHTETE VERMÖGENSBEWEGUNGEN</span><h3>Geld zwischen Konten und Anlagen</h3><p>Ein Kreisbild der tatsächlich belegten Verbindungen – keine angenommene Herkunft oder Anlageperformance.</p></div><div class="fin32-cycle-total"><strong>${esc(euro(sum))}</strong><small>${edges.length} belegte Kontoverbindungen · Summe der Bewegungen, nicht Vermögenswert</small></div></div>
 ${top.length?`<div class="fin32-cycle-chart"><svg viewBox="0 0 920 515" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Interaktiver Kreisgraph der nachgewiesenen Geldbewegungen"><defs>${gradients}</defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e6efea" stroke-width="1.5"/>${lines}<circle cx="${cx}" cy="${cy}" r="47" fill="#fbfdfb" stroke="#e8eee9"/><text x="${cx}" y="${cy-5}" text-anchor="middle" font-size="12" fill="#476b59">${edges.length} Wege</text><text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="10" fill="#789086">belegt</text>${dots}</svg></div>`:'<p class="fin31-empty">Noch keine bestätigten Eigenüberträge oder als Depot-/Krypto-Einzahlung klassifizierten Buchungen. Unter „Kontenflüsse“ lassen sich mögliche Gegenbuchungen prüfen. Ohne Belege zeichnet Compass keine Verbindungen.</p>'}
 ${edges.length?`${compact?`<details class="fin33-cycle-connections"><summary>${edges.length} bestätigte Verbindungen aufschlüsseln</summary>`:''}<div class="fin32-cycle-list" aria-label="Alle bestätigten Verbindungen"><div class="fin31-card-header"><strong>Verbindungen öffnen</strong><small>Klicken für Buchungsdetails</small></div>${edges.map((e,i)=>`<button type="button" data-action="finance-cycle-inspect" data-id="${esc(e.id)}" class="fin32-cycle-edge ${selectedId===e.id?'selected':''}"><i style="background:${nodeColor(e.from)}"></i><span>${esc(e.fromLabel)} → ${esc(e.toLabel)}</span><b>${esc(euro(e.cents))}</b></button>`).join('')}</div>${compact?'</details>':''}`:''}
 ${selected?transactionDetails(rows,selected):''}
 ${wealthNote}<div class="fin32-cycle-help"><button type="button" class="secondary-btn" data-action="finance-pane" data-id="Kontenflüsse">Überträge prüfen →</button><button type="button" class="secondary-btn" data-action="finance-pane" data-id="Portfolio">Vermögenswerte →</button></div>
 ${compact?'<details class="fin33-cycle-method"><summary>Darstellung &amp; Grenzen</summary>':''}<p class="fin31-footnote">Durchgezogene Linien = beidseitig bestätigte Eigenüberträge; gestrichelte Linien = klassifizierte einseitige Depoteinzahlungen. Nur wechselseitig bestätigte Eigenüberträge und ausdrücklich klassifizierte negative Depoteinzahlungen. Ein- und Auszahlungen bei mehreren eigenen Konten können dieselben Euro mehrfach durch das Netzwerk bewegen. Börsengewinne, Depotverkäufe oder Dividenden bilden ohne eindeutig zugeordnete Daten keinen Rückfluss. Die Bestände rechts/unterhalb stammen aus getrennten Bewertungen und werden NICHT mit Überträgen verrechnet.</p>${compact?'</details>':''}</section>`;
}
