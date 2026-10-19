/** Compass 0.5.17.7: four real proportional levels, not a separate merchant list.
 * Category/merchant labels come from locally imported entries only. Not a receipt.
 */
import {merchantDisplay,merchantNameKey} from './finance-merchant-editor.js';
import {hierarchicalFlows} from './finance-exotic-hierarchy.js';
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=n=>(n/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const r=n=>Math.round(n*100)/100;
const action=(parent,sub)=>sub?`data-action="finance-subcategory-select" data-id="${h(parent+' / '+sub)}" role="button" tabindex="0"`:`data-action="finance-category-select" data-id="${h(parent)}" role="button" tabindex="0"`;
const eligible=t=>t&&!t.needsReview&&t.flow==='expense'&&Number.isSafeInteger(t.amountCents)&&t.amountCents<0;
const compact=(rows,max,other)=>rows.length<=max?rows:[...rows.slice(0,max),{name:other,cents:rows.slice(max).reduce((v,x)=>v+x.cents,0),merchants:rows.slice(max).flatMap(s=>s.merchants||[])}];
export function deepSankeyModel(rows=[],focus='all'){
 const grouped=hierarchicalFlows(rows).filter(g=>focus==='all'||g.name===focus);
 const sources=new Map();
 for(const t of rows){if(!eligible(t))continue;const [parent,...rest]=String(t.category||'Sonstiges / Unbekannt').split(' / ');
  const sub=rest.join(' / ')||'Ohne Unterkategorie',key=parent+'\u001f'+sub;let m=sources.get(key);if(!m){m=new Map();sources.set(key,m);}const name=merchantDisplay(t);const keyName=merchantNameKey(name);const old=m.get(keyName)||{name,cents:0};old.cents-=t.amountCents;m.set(keyName,old);}
 const regular=grouped.filter(g=>!g.special),special=grouped.filter(g=>g.special);
 const selected=focus==='all'&&regular.length>10?
  [...regular.slice(0,10),{name:'Weitere Konsumkategorien',color:'#829E90',cents:regular.slice(10).reduce((a,g)=>a+g.cents,0),children:regular.slice(10).map(g=>({name:g.name,cents:g.cents}))},...special]:grouped;
 return selected.map(g=>{
  let children=(g.children||[]).map(c=>{
   let values=[];
   if(!g.special){const merchant=sources.get(g.name+'\u001f'+c.name);
    values=[...(merchant||new Map()).values()].map(({name,cents})=>({name,cents})).sort((a,b)=>b.cents-a.cents);
   }
   // The legacy hierarchy groups tiny subcategories into a single labelled slot.
   // Preserve all cents even if individual merchants cannot be attributed to that slot.
   if(!values.length)values=[{name:g.special?'Eigenübertrag / kein Einkauf':'Weitere Zahlungspartner',cents:c.cents}];
   else if(values.reduce((n,x)=>n+x.cents,0)!==c.cents){const used=values.reduce((n,x)=>n+x.cents,0);if(c.cents>used)values.push({name:'Weitere Zahlungspartner',cents:c.cents-used});}
   values=compact(values,4,'Weitere Händler');
   return {...c,merchants:values};
  });
  // For composite groups without matching underlying individual rows, use an honest aggregate.
  if(children.reduce((n,c)=>n+c.cents,0)!==g.cents){children=[{name:'Weitere Unterkategorien',cents:g.cents,merchants:[{name:'Nicht einzeln zugeordnet',cents:g.cents}]}];}
  return {...g,children};
 });
}
const ribbon=(a,b,c,d,w)=>{const bend=(c-a)*.46;return `M${r(a)} ${r(b)} C${r(a+bend)} ${r(b)} ${r(c-bend)} ${r(d)} ${r(c)} ${r(d)} L${r(c)} ${r(d+w)} C${r(c-bend)} ${r(d+w)} ${r(a+bend)} ${r(b+w)} ${r(a)} ${r(b+w)} Z`;};
/** A single canonical merchant can receive flows from multiple subcategories.
 * Incoming ribbon segments never claim one economic expense twice.
 */
export function deepSankey(rows=[],focus='all'){
 const groups=deepSankeyModel(rows,focus),total=groups.reduce((v,g)=>v+g.cents,0);
 if(!total)return '<p class="insight-no-data">Noch keine bestätigten Konsumausgaben für diese Ansicht.</p>';
 const merchantMap=new Map(),leafKey=(g,c,m)=>['Weitere Händler','Weitere Zahlungspartner','Nicht einzeln zugeordnet','Eigenübertrag / kein Einkauf'].includes(m.name)?`${g.name}\u001f${c.name}\u001f${m.name}`:merchantNameKey(m.name);
 for(const g of groups)for(const c of g.children)for(const m of c.merchants){const key=leafKey(g,c,m),old=merchantMap.get(key)||{key,name:m.name,cents:0,color:g.color};old.cents+=m.cents;merchantMap.set(key,old);}
 const merchants=[...merchantMap.values()];
 const np=groups.length,ns=groups.reduce((n,g)=>n+g.children.length,0),nm=merchants.length;
 const H=Math.max(700,125+nm*34+ns*15+np*22),W=1740,top=68,gp=24,sp=15,mp=12;
 const avail=H-top-45,scale=Math.min((avail-gp*(np-1))/total,(avail-sp*(ns-1))/total,(avail-mp*(nm-1))/total);
 if(!(scale>0))return '<p class="insight-no-data">Zu viele Kategorien für diese Darstellung.</p>';
 const widths=[132,522,970,1405],bar=13;const v0=(H-total*scale)/2;
 let py=(H-(total*scale+gp*(np-1)))/2,sy=(H-(total*scale+sp*(ns-1)))/2,ry=v0;
 let my=(H-(total*scale+mp*(nm-1)))/2;
 const tops=new Map(),used=new Map();for(const m of merchants){tops.set(m.key,my);used.set(m.key,0);my+=m.cents*scale+mp;}
 const defs=[],paths=[],nodes=[],labels=[];
 groups.forEach((g,i)=>{
  const tall=g.cents*scale,pr=py,root=ry,id=`deep-flow-grad-${i}`;
  defs.push(`<linearGradient id="${id}"><stop stop-color="${g.color}" stop-opacity=".41"/><stop offset="1" stop-color="${g.color}" stop-opacity=".86"/></linearGradient>`);
  paths.push(`<path class="fin-flow-band" d="${ribbon(widths[0]+bar,root,widths[1],pr,tall)}" fill="url(#${id})" ${g.special?'':action(g.name)}><title>${h(g.name)} · ${h(euro(g.cents))}</title></path>`);
  nodes.push(`<rect x="${widths[1]}" y="${r(pr)}" width="${bar}" height="${r(Math.max(tall,1))}" fill="${g.color}" rx="2"/>`);
  if(tall>13)labels.push(`<text x="${widths[1]-14}" y="${r(pr+tall/2+4)}" text-anchor="end" class="fin-flow-parent-text">${h(g.name.slice(0,30))}</text>`);
  let fromSub=pr;
  g.children.forEach(c=>{
   const sh=c.cents*scale,subStart=sy;
   paths.push(`<path class="fin-flow-band" d="${ribbon(widths[1]+bar,fromSub,widths[2],subStart,sh)}" fill="${g.color}" fill-opacity=".54" ${g.special?'':action(g.name,c.name)}><title>${h(g.name)} → ${h(c.name)} · ${h(euro(c.cents))}</title></path>`);
   nodes.push(`<rect x="${widths[2]}" y="${r(subStart)}" width="${bar}" height="${r(Math.max(sh,1))}" fill="${g.color}" fill-opacity=".8" rx="2"/>`);
   if(sh>12)labels.push(`<text x="${widths[2]-15}" y="${r(subStart+sh/2+4)}" text-anchor="end" class="fin-flow-end-text">${h(c.name.slice(0,29))}</text>`);
   let subOut=subStart;
   c.merchants.forEach(m=>{
    const mh=m.cents*scale,key=leafKey(g,c,m),merchantStart=tops.get(key)+used.get(key);
    // Merchant ribbons share a genuine target node instead of duplicating names.
    paths.push(`<path class="fin-flow-band" d="${ribbon(widths[2]+bar,subOut,widths[3],merchantStart,mh)}" fill="${g.color}" fill-opacity=".53" data-action="finance-merchant-select" data-id="${h(m.name)}" role="button" tabindex="0"><title>${h(g.name)} / ${h(c.name)} / ${h(m.name)} · ${h(euro(m.cents))}</title></path>`);
    used.set(key,used.get(key)+mh);subOut+=mh;
   });
   fromSub+=sh;sy+=sh+sp;
  });
  py+=tall+gp;ry+=tall;
 });
 for(const m of merchants){const y=tops.get(m.key),height=m.cents*scale;
  nodes.push(`<rect x="${widths[3]}" y="${r(y)}" width="${bar}" height="${r(Math.max(height,1))}" fill="${m.color}" fill-opacity=".88" rx="2" data-action="finance-merchant-select" data-id="${h(m.name)}" role="button" tabindex="0"/>`);
  labels.push(`<text x="${widths[3]+20}" y="${r(y+Math.max(12,height/2+4))}" class="fin-flow-end-text" data-action="finance-merchant-select" data-id="${h(m.name)}" role="button" tabindex="0">${h(m.name.slice(0,28))} · ${h(euro(m.cents))}</text>`);
 }
 const names=['Abgänge','Hauptkategorien','Unterkategorien','Händler / Zahlungspartner'];
 return `<div class="fin-organic-sankey fin-deep-sankey"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Vierstufiger Sankey mit zusammengeführten Händlern; Buchungen behalten ihre Kategorien"><defs>${defs.join('')}</defs>${names.map((name,i)=>`<text x="${widths[i]}" y="32" fill="#326B60" font-size="15">${h(name)}</text>`).join('')}${paths.join('')}<rect x="${widths[0]}" y="${r(v0)}" width="${bar}" height="${r(total*scale)}" rx="4" fill="#286E63"/><text x="${widths[0]-16}" y="${r(H/2+4)}" text-anchor="end" fill="currentColor" font-size="14">${h(euro(total))}</text>${nodes.join('')}${labels.join('')}</svg></div><p class="fin-art-note">Händler mit gleichem bestätigten Anzeigenamen werden rechts zu <strong>einem Knoten</strong> zusammengefasst. Zahlungswege aus verschiedenen Kategorien bleiben als getrennte Verbindungen sichtbar. Klick auf einen Händler öffnet die Bearbeitung direkt hier; Originalbuchungen bleiben erhalten.</p>`;
}
