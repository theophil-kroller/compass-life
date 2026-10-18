/** Compass 0.5.17.1 · signed / hierarchical money flow visualizations.
 * Pure SVG, local only. A flow represents classified bank entries, never a transfer
 * of money between spending categories. Expense amounts are positive magnitudes.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
export const flowColors=['#327B75','#668CC5','#D78869','#8C7CAF','#D4A251','#50A09A','#B87B9C','#80A16B','#C38E65','#647F91','#A6A77F','#C07E83'];
const special=[['Transfers / Investieren','Transfer','#8C7CAF'],['Bargeld · Zweck unbekannt','Bargeld','#C69F69'],['Noch ungeklärt','Prüfen','#DA9858']];
const q=x=>Math.round(x*100)/100;
const click=(parent,child='')=>child?`data-action="finance-subcategory-select" data-id="${esc(parent+' / '+child)}" role="button" tabindex="0"`:`data-action="finance-category-select" data-id="${esc(parent)}" role="button" tabindex="0"`;
const moneyRow=t=>t&&!t.needsReview&&t.flow==='expense'&&Number.isFinite(t.amountCents)&&t.amountCents<0;
export function hierarchicalFlows(rows=[]){
 const main=new Map();
 for(const t of rows){if(!moneyRow(t))continue;
  const parts=String(t.category||'Sonstiges / Ohne Details').split(' / '),parent=parts[0],child=parts.slice(1).join(' / ')||'Ohne Unterkategorie',amount=-t.amountCents;
  if(!main.has(parent))main.set(parent,new Map());const m=main.get(parent);m.set(child,(m.get(child)||0)+amount);
 }
 const results=[...main].map(([name,sub])=>({name,children:[...sub].map(([name,cents])=>({name,cents})).sort((a,b)=>b.cents-a.cents)})).map(x=>({...x,cents:x.children.reduce((s,c)=>s+c.cents,0)})).sort((a,b)=>b.cents-a.cents);
 const consumers=results.slice(0,12);const hidden=results.slice(12),overflow=hidden.reduce((s,r)=>s+r.cents,0);
 if(overflow)consumers.push({name:'Weitere Konsumkategorien',cents:overflow,children:hidden.map(x=>({name:x.name,cents:x.cents}))});
 for(const row of consumers){if(row.children.length<=6)continue;const head=row.children.slice(0,5),tail=row.children.slice(5).reduce((s,x)=>s+x.cents,0);row.children=[...head,{name:'Weitere Unterkategorien',cents:tail}];}
 for(const [name,kind] of special){const cents=rows.filter(t=>t?.amountCents<0&&(kind==='Prüfen'?t.needsReview:!t.needsReview&&t.flow===(kind==='Bargeld'?'cash':'transfer'))).reduce((s,t)=>s-t.amountCents,0);if(cents>0)consumers.push({name,cents,children:[{name:'Separater Kontenabgang',cents}],special:true});}
 return consumers.map((g,i)=>({...g,color:flowColors[i%flowColors.length],children:g.children.map((c,j)=>({...c,color:flowColors[i%flowColors.length]}))}));
}
const volume=groups=>groups.reduce((s,x)=>s+x.cents,0);
const path=(x0,y0,x1,y1,x2,y2,x3,y3)=>`M${q(x0)} ${q(y0)} C${q((x0+x1)/2)} ${q(y0)} ${q((x0+x1)/2)} ${q(y1)} ${q(x1)} ${q(y1)} L${q(x1)} ${q(y2)} C${q((x0+x1)/2)} ${q(y2)} ${q((x0+x1)/2)} ${q(y3)} ${q(x0)} ${q(y3)} Z`;
/** Cubic-ribbon Sankey: nodes are three real columns with independently spaced
 * destination layouts. Ribbons retain exact proportional thickness throughout.
 * No implicit allocation of incomes to expenses is implied by this view.
 */
const curveBand=(x0,y0,x1,y1,h)=>{
 const bend=(x1-x0)*.46;
 return `M${q(x0)},${q(y0)} C${q(x0+bend)},${q(y0)} ${q(x1-bend)},${q(y1)} ${q(x1)},${q(y1)} L${q(x1)},${q(y1+h)} C${q(x1-bend)},${q(y1+h)} ${q(x0+bend)},${q(y0+h)} ${q(x0)},${q(y0+h)} Z`;
};
export function hierarchicalSankey(rows=[]){
 const groups=hierarchicalFlows(rows),total=volume(groups);
 if(!total)return '<p class="insight-no-data">Noch keine kategorisierten Bankabgänge.</p>';
 const n=groups.length,leaves=groups.reduce((x,g)=>x+g.children.length,0);
 const W=1320,H=Math.max(690,leaves*29+n*18+135),margin=70;
 const xRoot=135,xParent=545,xLeaf=971,nodeWidth=12,groupGap=17,leafGap=7;
 // A single value scale is shared across all stages. Group/leaf padding is
 // inserted independently, causing real curved splits instead of flat stripes.
 const usable=H-margin*2;
 const scale=Math.max(.001,Math.min((usable-(n-1)*groupGap)/total,(usable-(leaves-1)*leafGap)/total));
 const totalPx=total*scale;
 let rootY=(H-totalPx)/2,parentY=(H-(totalPx+(n-1)*groupGap))/2,leafY=(H-(totalPx+(leaves-1)*leafGap))/2;
 const ribbons=[],nodes=[],leftLabels=[],rightLabels=[],defs=[];
 const labelText=(s,max=31)=>s.length>max?s.slice(0,max-1)+'…':s;
 // Render delicate parent/child color gradients, rather than flat rectangles.
 groups.forEach((g,i)=>{
  const h=g.cents*scale,parentStart=parentY,rootStart=rootY;
  const grad=`compass-sankey-${i}`;
  defs.push(`<linearGradient id="${grad}" x1="0%" y1="0%" x2="100%" y2="10%"><stop offset="0%" stop-color="${g.color}" stop-opacity=".25"/><stop offset="63%" stop-color="${g.color}" stop-opacity=".62"/><stop offset="100%" stop-color="${g.color}" stop-opacity=".87"/></linearGradient>`);
  ribbons.push(`<path class="fin-flow-band" ${g.special?'':click(g.name)} d="${curveBand(xRoot+nodeWidth,rootStart,xParent,parentStart,h)}" fill="url(#${grad})" stroke="${g.color}" stroke-opacity=".2" stroke-width=".6"><title>${esc(g.name)} · ${esc(euro(g.cents))}</title></path>`);
  nodes.push(`<g class="fin-flow-node" ${g.special?'':click(g.name)}><rect x="${xParent}" y="${q(parentStart)}" width="${nodeWidth}" height="${q(Math.max(h,1))}" rx="2" fill="${g.color}"/><title>${esc(g.name)} · ${esc(euro(g.cents))}</title></g>`);
  if(h>=14)leftLabels.push(`<text class="fin-flow-parent-text" x="${xParent-14}" y="${q(parentStart+h/2+4)}" text-anchor="end">${esc(labelText(g.name,30))}</text>`);
  let leafStart=parentStart;
  for(const [j,c] of g.children.entries()){
   const dh=c.cents*scale,ly=leafY,opacity=Math.max(.28,.8-j*.065);
   ribbons.push(`<path class="fin-flow-band" ${g.special?'':click(g.name,c.name)} d="${curveBand(xParent+nodeWidth,leafStart,xLeaf,ly,dh)}" fill="${g.color}" fill-opacity="${q(opacity*.51)}" stroke="${g.color}" stroke-opacity=".2" stroke-width=".5"><title>${esc(g.name)} → ${esc(c.name)} · ${esc(euro(c.cents))}</title></path>`);
   nodes.push(`<g class="fin-flow-node" ${g.special?'':click(g.name,c.name)}><rect x="${xLeaf}" y="${q(ly)}" width="${nodeWidth}" height="${q(Math.max(dh,1))}" rx="2" fill="${g.color}" fill-opacity="${q(opacity)}"/><title>${esc(g.name)} / ${esc(c.name)} · ${esc(euro(c.cents))}</title></g>`);
   // Small leaves stay available in the detail table rather than overprinting.
   if(dh>=12)rightLabels.push(`<text class="fin-flow-end-text" x="${xLeaf+18}" y="${q(ly+dh/2+4)}">${esc(labelText(c.name,30))} · ${esc(euro(c.cents))}</text>`);
   leafStart+=dh;leafY+=dh+leafGap;
  }
  parentY+=h+groupGap;rootY+=h;
 });
 const detail=groups.map(g=>`<div class="fin-sankey-detail-group"><strong><i style="background:${g.color}"></i>${esc(g.name)} <span>${esc(euro(g.cents))}</span></strong>${g.children.map(c=>g.special?`<span><span>${esc(c.name)}</span><b>${esc(euro(c.cents))}</b></span>`:`<button type="button" ${click(g.name,c.name)}><span>${esc(c.name)}</span><b>${esc(euro(c.cents))}</b></button>`).join('')}</div>`).join('');
 return `<div class="fin-organic-sankey"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Organischer dreistufiger Sankey: Abgänge zu Hauptkategorien und Unterkategorien"><defs>${defs.join('')}</defs><text x="${xRoot+6}" y="34" font-size="15" fill="#326B60" text-anchor="middle">Abgänge</text><text x="${xParent+6}" y="34" font-size="15" fill="#326B60" text-anchor="middle">Hauptkategorien</text><text x="${xLeaf+6}" y="34" font-size="15" fill="#326B60" text-anchor="middle">Unterkategorien</text>${ribbons.join('')}<rect x="${xRoot}" y="${q((H-totalPx)/2)}" width="${nodeWidth}" height="${q(totalPx)}" rx="4" fill="#286E63"/><text x="${xRoot-18}" y="${q(H/2+5)}" font-size="13" fill="currentColor" text-anchor="end">${esc(euro(total))}</text>${nodes.join('')}${leftLabels.join('')}${rightLabels.join('')}</svg></div><details class="fin-sankey-detail"><summary>Alle Haupt- und Unterkategorien mit Beträgen öffnen</summary><div class="fin-sankey-detail-grid">${detail}</div></details><p class="fin-art-note">Organische, geschwungene Geldbänder: Abgänge → Hauptkategorie → Unterkategorie. Breiten entsprechen den erfassten Beträgen. Sehr kleine Flüsse stehen lesbar in der Detailtabelle. Bargeld, eigene Transfers und unklare Abgänge werden getrennt vom Konsum ausgewiesen.</p>`;
}
// SVG circular-sector geometry: angles in radians, 0 points towards 12 o'clock.
const polar=(cx,cy,r,a)=>[cx+r*Math.sin(a),cy-r*Math.cos(a)];
export function sector(cx,cy,inner,outer,a,b){if(b<=a+1e-9)return '';const wide=b-a>Math.PI?1:0,p1=polar(cx,cy,outer,a),p2=polar(cx,cy,outer,b),p3=polar(cx,cy,inner,b),p4=polar(cx,cy,inner,a);return `M${q(p1[0])},${q(p1[1])} A${outer},${outer} 0 ${wide} 1 ${q(p2[0])},${q(p2[1])} L${q(p3[0])},${q(p3[1])} A${inner},${inner} 0 ${wide} 0 ${q(p4[0])},${q(p4[1])} Z`;}
function ringSegments(groups,start,extent){const sum=volume(groups)||1;let a=start;return groups.map(g=>{const b=a+extent*g.cents/sum,x={...g,a,b};a=b;let at=x.a;x.children=x.children.map(c=>{const bt=at+(b-x.a)*c.cents/g.cents,child={...c,a:at,b:bt};at=bt;return child;});return x;});}
export function signedSunburst(rows=[]){
 const groups=hierarchicalFlows(rows),sum=volume(groups),inc=new Map();for(const r of rows){if(r.needsReview||r.amountCents<=0||!['income','refund'].includes(r.flow))continue;const name=r.flow==='income'?String(r.category||'Einnahmen / Sonstiges').split(' / ')[1]||'Sonstiges':'Rückerstattungen';inc.set(name,(inc.get(name)||0)+r.amountCents);}
 const incomes=[...inc].sort((a,b)=>b[1]-a[1]).map(([name,cents],i)=>({name,cents,color:'#459B80',children:[{name,cents}]}));const positive=volume(incomes);
 if(!sum&&!positive)return '<p class="insight-no-data">Keine geeigneten Zu- oder Abgänge.</p>';
 const out=ringSegments(groups,Math.PI+.015,Math.PI-.03),inp=ringSegments(incomes,.015,Math.PI-.03),cx=440,cy=265;
 const rings=[...out.map(g=>`<g><path d="${sector(cx,cy,76,148,g.a,g.b)}" fill="${g.color}" opacity=".84"><title>− ${esc(g.name)} · ${esc(euro(g.cents))}</title></path>${g.children.map(c=>`<path d="${sector(cx,cy,155,225,c.a,c.b)}" fill="${g.color}" opacity=".5"><title>${esc(g.name)} / ${esc(c.name)} · ${esc(euro(c.cents))}</title></path>`).join('')}</g>`),...inp.map(g=>`<g><path d="${sector(cx,cy,76,148,g.a,g.b)}" fill="#44977F"><title>+ ${esc(g.name)} · ${esc(euro(g.cents))}</title></path><path d="${sector(cx,cy,155,225,g.a,g.b)}" fill="#88C8AC"><title>${esc(g.name)} · ${esc(euro(g.cents))}</title></path></g>`)].join('');
 return `<div class="fin-radial-figure"><svg viewBox="0 0 880 535" role="img" aria-label="Signierter Sunburst: links Abgänge, rechts Einnahmen"><circle cx="${cx}" cy="${cy}" r="65" fill="#F4F8F5"/><text x="${cx}" y="${cy-9}" text-anchor="middle" font-size="13" fill="currentColor">Bankbewegungen</text><text x="${cx}" y="${cy+13}" text-anchor="middle" font-size="12" fill="currentColor">± getrennt</text>${rings}<text x="170" y="22" font-size="17" font-weight="700" fill="#BA6E55">− Abgänge ${esc(euro(sum))}</text><text x="600" y="22" font-size="17" font-weight="700" fill="#2F8F72">+ Zuflüsse ${esc(euro(positive))}</text></svg></div><p class="fin-art-note">Signierter Sunburst: linke Halbkreise zeigen Bankabgänge, rechte Einnahmen und Erstattungen. Beträge werden <strong>nicht</strong> saldiert oder als gegenseitige Finanzierung interpretiert. Innen Hauptkategorien, außen Unterkategorien; Anteile beziehen sich jeweils auf Zu- beziehungsweise Abgänge.</p>`;
}
export function radialSankey(rows=[]){
 const groups=hierarchicalFlows(rows).filter(g=>!g.special),total=volume(groups);if(!total)return '<p class="insight-no-data">Noch keine klassifizierten Konsumausgaben.</p>';
 const shapes=ringSegments(groups,.01,Math.PI*2-.02),cx=440,cy=266,r0=86,r1=132,r2=175,r3=238;
 const parts=[];for(const g of shapes){parts.push(`<g ${click(g.name)}><path d="${sector(cx,cy,r0,r1,g.a,g.b)}" fill="${g.color}" opacity=".97"><title>${esc(g.name)} · ${esc(euro(g.cents))}</title></path></g>`);
  for(const c of g.children){const a0=c.a,a1=c.b;parts.push(`<path d="${sector(cx,cy,r1,r2,a0,a1)}" fill="${g.color}" opacity=".26"/><g ${click(g.name,c.name)}><path d="${sector(cx,cy,r2,r3,a0,a1)}" fill="${g.color}" opacity=".63"><title>${esc(g.name)} / ${esc(c.name)}: ${esc(euro(c.cents))}</title></path></g>`);}
 }
 return `<div class="fin-radial-figure"><svg viewBox="0 0 880 535" role="img" aria-label="Radiales Sankey: Konsum von Haupt- zu Unterkategorien"><circle cx="${cx}" cy="${cy}" r="77" fill="#EDF4EF"/><text x="${cx}" y="${cy-9}" text-anchor="middle" font-size="14" fill="#234D44">Konsum</text><text x="${cx}" y="${cy+18}" text-anchor="middle" font-size="14" fill="#234D44" font-weight="700">${esc(euro(total))}</text>${parts.join('')}</svg></div><p class="fin-art-note">Radialer Geldfluss: Zentrum Konsum, innerer Ring Hauptkategorien, äußerer Ring Unterkategorien. Jede Verbindung bleibt derselben Hauptkategorie zugeordnet. Beträge im Tooltip; keine Transfers zwischen Ausgabenkategorien.</p>`;
}
// Weighted power cells (additively weighted Voronoi). Cell areas are iteratively
// matched to target spending proportions; categories with minuscule amounts are grouped.
const polygonArea=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1];},0))/2;
const clip=(poly,A,B,C)=>{if(!poly.length)return [];const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],v=poly[(i+1)%poly.length],fp=A*p[0]+B*p[1]-C,fv=A*v[0]+B*v[1]-C;if(fp<=0)out.push(p);if((fp<0&&fv>0)||(fp>0&&fv<0)){const t=fp/(fp-fv);out.push([p[0]+t*(v[0]-p[0]),p[1]+t*(v[1]-p[1])]);}}return out;};
export function powerVoronoi(items=[],W=900,H=400){
 const data=items.filter(x=>x.cents>0).slice(0,11),n=data.length;if(!n)return [];
 const total=volume(data),target=data.map(x=>W*H*x.cents/total),centers=data.map((x,i)=>{const angle=i*2.39996323,rad=.12+.32*Math.sqrt((i+.5)/n);return [W*(.5+rad*Math.cos(angle)),H*(.5+rad*Math.sin(angle))];}),weights=data.map(()=>0);
 const cells=()=>centers.map(([sx,sy],i)=>{let poly=[[0,0],[W,0],[W,H],[0,H]];for(let j=0;j<n;j++){if(j===i)continue;const [tx,ty]=centers[j],A=2*(tx-sx),B=2*(ty-sy),C=tx*tx+ty*ty-sx*sx-sy*sy+weights[i]-weights[j];poly=clip(poly,A,B,C);if(!poly.length)break;}return poly;});
 for(let k=0;k<220;k++){const poly=cells(),areas=poly.map(p=>p.length>=3?polygonArea(p):0),step=k<100?.40:.12;let maxErr=0;for(let i=0;i<n;i++){let diff=target[i]-areas[i];maxErr=Math.max(maxErr,Math.abs(diff));weights[i]+=step*diff;}const ref=weights.reduce((a,b)=>a+b,0)/n;for(let i=0;i<n;i++)weights[i]-=ref;if(maxErr<W*H*.004)break;}
 return cells().map((poly,i)=>({...data[i],polygon:poly,area:poly.length>=3?polygonArea(poly):0,targetArea:target[i]}));
}
export function voronoiTreemap(rows=[]){const groups=hierarchicalFlows(rows).filter(x=>!x.special),total=volume(groups);if(!total)return '<p class="insight-no-data">Keine Konsumausgaben für die Voronoi-Treemap.</p>';
 const chosen=groups.slice(0,9).map(x=>({...x})),rest=groups.slice(9).reduce((s,x)=>s+x.cents,0);if(rest)chosen.push({name:'Weitere',cents:rest,color:'#98A7A1'});
 const cells=powerVoronoi(chosen,920,440);
 const labels=cells.map(c=>{const p=c.polygon;if(p.length<3)return '';const cx=p.reduce((s,x)=>s+x[0],0)/p.length,cy=p.reduce((s,x)=>s+x[1],0)/p.length;return `<g ${click(c.name)} class="fin-voronoi-cell"><path d="M${p.map(x=>`${q(x[0])},${q(x[1])}`).join(' L')} Z" fill="${c.color}" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><title>${esc(c.name)} · ${esc(euro(c.cents))}</title>${c.area>10000?`<text x="${q(cx)}" y="${q(cy)}" text-anchor="middle" font-size="15" fill="white" font-weight="700">${esc(c.name.slice(0,24))}</text><text x="${q(cx)}" y="${q(cy+21)}" text-anchor="middle" font-size="12" fill="white">${esc(euro(c.cents))}</text>`:''}</g>`;}).join('');
 return `<div class="fin-voronoi-figure"><svg viewBox="0 0 920 440" role="img" aria-label="Gewichtete Voronoi-Treemap der Ausgabenkategorien">${labels}</svg></div><p class="fin-art-note">Gewichtete Voronoi-Treemap (Power-Diagramm): Polygonflächen nähern sich den Ausgabenanteilen an. Kleine Bereiche werden für Lesbarkeit zusammengefasst; exakte Beträge stehen im Tooltip und in der Kategorienliste.</p>`;
}
