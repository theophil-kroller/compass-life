/** Compass 0.5.17.7 · Verified transfers only; unverified pairs are proposals, not money movement. */
import {accountFor,accountLabel,transferCandidates} from './finance-revolut.js';
import {nodeColor} from './finance-circular-flow-v32.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const q=n=>Math.round(n*100)/100;
export function verifiedAccountEdges(rows=[]){
 const byId=new Map(rows.map(r=>[r.id,r])),edges=new Map(),visited=new Set();
 const add=(from,to,cents,type)=>{if(!Number.isSafeInteger(cents)||cents<=0)return;const k=from.id+'|'+to.id+'|'+type,old=edges.get(k)||{from:from.id,to:to.id,fromLabel:from.label,toLabel:to.label,cents:0,count:0,type};old.cents+=cents;old.count++;edges.set(k,old);};
 for(const r of rows){if(visited.has(r.id))continue;
  const pair=r.linkedTransferId&&byId.get(r.linkedTransferId);
  if(pair&&pair.linkedTransferId===r.id&&!r.needsReview&&!pair.needsReview&&r.flow==='transfer'&&pair.flow==='transfer'&&r.amountCents===-pair.amountCents&&accountFor(r)!==accountFor(pair)){
   visited.add(r.id);visited.add(pair.id);const source=r.amountCents<0?r:pair,dest=r.amountCents>0?r:pair;
   add({id:accountFor(source),label:accountLabel(source)},{id:accountFor(dest),label:accountLabel(dest)},Math.abs(source.amountCents),'internal');continue;
  }
  if(!r.needsReview&&r.flow==='transfer'&&r.amountCents<0&&!r.linkedTransferId){
   const description=String(r.description||r.merchant||'');
   const target=r.category==='Transfer / Krypto'?(/\bkraken\b/iu.test(description)?'Kraken':'Kryptobörse'):
     r.category==='Transfer / Depot & Wertpapiere'?(/\bflatex\b/iu.test(description)?'flatex':'Wertpapierdepot'):null;
   if(target)add({id:accountFor(r),label:accountLabel(r)},{id:'external:'+target,label:target},Math.abs(r.amountCents),'external');
  }
 }
 return [...edges.values()].sort((a,b)=>b.cents-a.cents);
}
const curve=(a,b,c,d,size)=>{const bend=(c-a)*.45;return `M${q(a)} ${q(b)} C${q(a+bend)} ${q(b)} ${q(c-bend)} ${q(d)} ${q(c)} ${q(d)} L${q(c)} ${q(d+size)} C${q(c-bend)} ${q(d+size)} ${q(a+bend)} ${q(b+size)} ${q(a)} ${q(b+size)} Z`;};
export function accountFlowView(rows=[]){
 const edges=verifiedAccountEdges(rows),candidates=transferCandidates(rows,30),count=edges.length;
 const sourceMap=new Map(),destMap=new Map();
 for(const e of edges){const src=sourceMap.get(e.from)||{id:e.from,label:e.fromLabel,cents:0};src.cents+=e.cents;sourceMap.set(e.from,src);
   const dst=destMap.get(e.to)||{id:e.to,label:e.toLabel,cents:0};dst.cents+=e.cents;destMap.set(e.to,dst);}
 const sources=[...sourceMap.values()].sort((a,b)=>b.cents-a.cents),targets=[...destMap.values()].sort((a,b)=>b.cents-a.cents);
 const total=edges.reduce((s,e)=>s+e.cents,0),H=Math.max(310,120+Math.max(sources.length,targets.length)*75),W=1050,top=48,room=H-105;
 const gap=15,scale=total?Math.min((room-gap*Math.max(0,sources.length-1))/total,(room-gap*Math.max(0,targets.length-1))/total):0;
 const leftX=180,rightX=770,nw=16;
 const arrange=(nodes)=>{let y=(H-(total*scale+(nodes.length-1)*gap))/2;return new Map(nodes.map(n=>{const a={...n,y,height:n.cents*scale,used:0};y+=a.height+gap;return [n.id,a];}));};
 const left=arrange(sources),right=arrange(targets);
 const gradients=edges.map((e,i)=>`<linearGradient id="fin34-account-${i}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${nodeColor(e.from)}"/><stop offset=".45" stop-color="#335DA8"/><stop offset="1" stop-color="${nodeColor(e.to)}"/></linearGradient>`).join('');
 const paths=edges.map((e,i)=>{const s=left.get(e.from),t=right.get(e.to),width=e.cents*scale,sy=s.y+s.used,ty=t.y+t.used;s.used+=width;t.used+=width;
  return `<path class="fin-account-ribbon" d="${curve(leftX+nw,sy,rightX,ty,width)}" fill="url(#fin34-account-${i})" fill-opacity=".72"><title>${esc(e.fromLabel)} → ${esc(e.toLabel)}: ${esc(eur(e.cents))} · ${e.count} bestätigte Überträge</title></path>`;}).join('');
 const labels=[...left.values()].map(p=>`<rect x="${leftX}" y="${q(p.y)}" width="${nw}" height="${q(Math.max(p.height,2))}" rx="3" fill="${nodeColor(p.id)}"/><text x="${leftX-13}" y="${q(p.y+p.height/2+4)}" text-anchor="end" font-size="13" fill="currentColor">${esc(p.label)}</text>`).join('')+
  [...right.values()].map(p=>`<rect x="${rightX}" y="${q(p.y)}" width="${nw}" height="${q(Math.max(p.height,2))}" rx="3" fill="${nodeColor(p.id)}"/><text x="${rightX+27}" y="${q(p.y+p.height/2+4)}" font-size="13" fill="currentColor">${esc(p.label)}</text>`).join('');
 return `<section class="fin-analysis-section fin-account-network"><span class="insight-kicker">MEHRKONTEN / VERMÖGENSBEWEGUNGEN</span><h3>Mein Geld zwischen den Konten</h3>
 <p class="fin-disclaimer">Die Bänder zeigen <strong>bestätigte</strong> Eigenüberträge und zugeordnete Einzahlungen an Kraken/flatex, nicht Konsum und kein zusätzliches Einkommen. Breiten entsprechen den Summen im Datenbestand. Bei unbestätigten Gegenbuchungen ist die tatsächliche Bewegung noch nicht als Verbindung enthalten.</p>
 ${edges.length?`<div class="fin-sankey-scroller fin-account-sankey"><svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Konten-Sankey mit proportionalen, geschwungenen Verbindungen zwischen bestätigten Konten"><defs>${gradients}</defs><text x="${leftX}" y="24" font-size="14" fill="#376A5F">Absenderkonten</text><text x="${rightX}" y="24" font-size="14" fill="#376A5F">Empfänger & Anlagekonten</text>${paths}${labels}</svg></div><p class="fin-art-note">${count} bestätigte Kontoverbindungen · ${eur(total)} an erfassten Überträgen. Dieselben Euro können mehrere Konten durchlaufen; die Summe ist <strong>kein Vermögenswert</strong>.</p>`:'<p class="insight-no-data">Noch keine verifizierten Kontoverbindungen. Prüfe passende Gegenbuchungen – anschließend erscheinen sie hier.</p>'}
 <details class="fin-account-proposals"><summary>${candidates.length} mögliche Eigenüberträge prüfen</summary><p class="fin-disclaimer">Nicht bestätigt: Diese Vorschläge sind absichtlich kein Bestandteil der Geldfluss-Grafik. Unter „Prüfen“ kannst du die Gegenbuchungen bestätigen.</p>${candidates.map(c=>`<div class="fin-account-proposal"><span>${esc(c.accounts.join(' ↔ '))} · ${esc(c.day)}</span><strong>${esc(eur(c.amountCents))}</strong></div>`).join('')||'<p>Keine passenden unbestätigten Gegenbuchungen erkannt.</p>'}</details><button type="button" class="secondary-btn" data-action="finance-pane" data-id="Prüfen">Eigenüberträge überprüfen →</button></section>`;
}
