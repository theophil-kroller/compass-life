/** Verified movements only: a flow is not consumption, income or a statement of net worth. */
import {accountFor,accountLabel} from './finance-revolut.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
export function verifiedAccountEdges(rows=[]){
 const byId=new Map(rows.map(r=>[r.id,r])),edges=new Map(),visited=new Set();
 const add=(a,b,v,type)=>{if(!Number.isFinite(v)||v<=0)return;const k=`${a.id}|${b.id}|${type}`,current=edges.get(k)||{from:a.id,to:b.id,fromLabel:a.label,toLabel:b.label,cents:0,count:0,type};current.cents+=v;current.count++;edges.set(k,current);};
 for(const r of rows){
  if(visited.has(r.id))continue;
  const other=r.linkedTransferId&&byId.get(r.linkedTransferId);
  if(other&&other.linkedTransferId===r.id&&r.flow==='transfer'&&other.flow==='transfer'&&r.amountCents===-other.amountCents&&accountFor(r)!==accountFor(other)){
   visited.add(r.id);visited.add(other.id);const outgoing=r.amountCents<0?r:other,incoming=r.amountCents>0?r:other;
   add({id:accountFor(outgoing),label:accountLabel(outgoing)},{id:accountFor(incoming),label:accountLabel(incoming)},Math.abs(outgoing.amountCents),'internal');continue;
  }
  if(!r.needsReview&&r.flow==='transfer'&&r.amountCents<0&&!r.linkedTransferId){
   // Only a user-confirmed investment transfer can be pictured as an external
   // allocation. Provider-specific labels are derived solely from that booking.
   const description=String(r.description||r.merchant||'');
   const target=r.category==='Transfer / Krypto'?(/\bKraken\b/iu.test(description)?'Kraken':'Kryptobörse')
    :r.category==='Transfer / Depot & Wertpapiere'?(/\bflatex\b/iu.test(description)?'flatex':'Wertpapierdepot'):null;
   if(target)add({id:accountFor(r),label:accountLabel(r)},{id:`external:${target}`,label:target},Math.abs(r.amountCents),'external');
  }
 }
 return [...edges.values()].sort((a,b)=>b.cents-a.cents);
}
export function accountFlowView(rows=[]){
 const edges=verifiedAccountEdges(rows),width=1050,height=Math.max(280,edges.length*58+95),max=Math.max(1,...edges.map(x=>x.cents));
 const colors=['#338A78','#4C93B3','#B18EC6','#E0A662','#899C91','#C68572'];
 return `<section class="fin-analysis-section fin-account-network"><span class="insight-kicker">MEHRKONTEN / VERMÖGENSBEWEGUNGEN</span><h3>Mein Geld zwischen den Konten</h3><p class="fin-disclaimer">Nur <strong>beidseitig bestätigte</strong> Eigenüberträge und bereits klassifizierte Überweisungen an Krypto-/Depotdienstleister. Unbestätigte Überweisungen werden nicht als Geldfluss behauptet. Kein Kontostand, kein nachgewiesener Vermögenszuwachs und keine Konsumausgabe.</p>
 ${edges.length?`<div class="fin-sankey-scroller"><svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bestätigte Kontoüberträge und Überweisungen zu Depot- oder Kryptodienstleistern">${edges.map((e,i)=>{
 const y=58+i*58,thickness=6+20*e.cents/max,color=colors[i%colors.length];return `<title>${esc(e.fromLabel)} nach ${esc(e.toLabel)}: ${esc(eur(e.cents))}</title><text x="20" y="${y-12}" font-size="14" fill="#31584C">${esc(e.fromLabel)}</text><path d="M 230 ${y} C 400 ${y}, 600 ${y}, 760 ${y}" fill="none" stroke="${color}" stroke-opacity=".65" stroke-width="${thickness}" stroke-linecap="round"/><text x="780" y="${y-12}" font-size="14" fill="#31584C">${esc(e.toLabel)}</text><text x="780" y="${y+10}" font-size="12" fill="#6B7B71">${esc(eur(e.cents))} · ${e.count} Buchung(en)</text>`;}).join('')}</svg></div>`:'<p class="insight-no-data">Noch keine bestätigten Kontenflüsse. Unter „Prüfen“ kannst du passende Gegenbuchungen aus Raiffeisen, N26, Revolut oder DKB bestätigen. Die Grafik erscheint anschließend automatisch.</p>'}
 </section>`;
}
