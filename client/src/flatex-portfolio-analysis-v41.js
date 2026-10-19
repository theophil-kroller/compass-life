/** Pure, evidence-only Flatex portfolio sorting and snapshot visualizations.
 * Treemap AREA represents MARKET VALUE, COLOR represents displayed gain since cost.
 * Neither visualization is a total return or a historical asset-performance calculation.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const pct=n=>Number(n).toLocaleString('de-AT',{minimumFractionDigits:2,maximumFractionDigits:2})+' %';
export const POSITION_SORTS=Object.freeze([['market','Depotwert'],['name','Name'],['percent','Gewinn / Verlust %'],['gain','Gewinn / Verlust €'],['weight','Depotanteil']]);
function val(p,key,total){switch(key){case 'name':return String(p.name||'');case 'percent':return p.costCents>0?100*(p.marketCents-p.costCents)/p.costCents:null;case 'gain':return p.marketCents-p.costCents;case 'weight':return total?100*p.marketCents/total:0;default:return p.marketCents;}}
export function sortFlatexPositions(input=[],key='market',descending=true){
 const sort=POSITION_SORTS.some(x=>x[0]===key)?key:'market';const total=input.reduce((s,p)=>s+(Number(p.marketCents)||0),0);
 return [...input].sort((a,b)=>{
  const x=val(a,sort,total),y=val(b,sort,total);
  if(x==null||y==null){if(x==null&&y==null)return String(a.isin).localeCompare(String(b.isin));return x==null?1:-1;}
  const diff=sort==='name'?x.localeCompare(y,'de-AT',{sensitivity:'base'}):x-y;
  return (descending?-diff:diff)||String(a.isin).localeCompare(String(b.isin));
 });
}
export function positionSortToolbar(key='market',descending=true){
 const selected=POSITION_SORTS.some(x=>x[0]===key)?key:'market';
 return `<div class="fin41-sort-controls"><label for="finance-flatex-positions-sort">Sortieren nach</label><select id="finance-flatex-positions-sort" aria-label="Flatex-Positionen sortieren">${POSITION_SORTS.map(([v,t])=>`<option value="${v}" ${v===selected?'selected':''}>${esc(t)}</option>`).join('')}</select><button type="button" data-action="finance-flatex-sort-direction" aria-label="Sortierreihenfolge umkehren" title="Sortierreihenfolge umkehren">${descending?'↓ Absteigend':'↑ Aufsteigend'}</button></div>`;
}
function split(items,x,y,w,h){
 if(!items.length)return [];
 if(items.length===1)return [{...items[0],x,y,w,h}];
 const sum=items.reduce((a,p)=>a+p.marketCents,0);let left=items[0].marketCents,cut=1;
 while(cut<items.length-1&&left<sum/2){left+=items[cut].marketCents;cut++;}
 const ratio=Math.min(.96,Math.max(.04,left/sum));
 return w>=h?[...split(items.slice(0,cut),x,y,w*ratio,h),...split(items.slice(cut),x+w*ratio,y,w*(1-ratio),h)]:[...split(items.slice(0,cut),x,y,w,h*ratio),...split(items.slice(cut),x,y+h*ratio,w,h*(1-ratio))];
}
export function flatexPerformanceTreemap(positions=[]){
 const positive=positions.filter(p=>p.marketCents>0),total=positive.reduce((s,p)=>s+p.marketCents,0);
 if(!total)return '<p class="fin-disclaimer">Noch keine bewerteten Positionen für die Performance-Treemap.</p>';
 const sorted=sortFlatexPositions(positive,'market',true),tiles=split(sorted,0,0,100,100);
 const colors=(p)=>{if(!p.costCents)return '#718e9e';const rate=(p.marketCents-p.costCents)/p.costCents;
  if(Math.abs(rate)<.001)return '#648c8a';const saturation=Math.round(Math.min(58,30+Math.abs(rate)*75));return rate>0?`hsl(157 ${saturation}% 35%)`:`hsl(358 ${saturation}% 48%)`;};
 return `<div class="fin41-mosaic" role="group" aria-label="Performance-Treemap: Fläche nach Depotwert, Farbe nach Buchgewinn oder Verlust">${tiles.map(p=>{
 const gain=p.marketCents-p.costCents,rate=p.costCents?100*gain/p.costCents:null;
 return `<button type="button" class="fin41-mosaic-tile" data-action="finance-flatex-chart-select" data-id="${esc(p.isin)}" style="left:${p.x.toFixed(4)}%;top:${p.y.toFixed(4)}%;width:${p.w.toFixed(4)}%;height:${p.h.toFixed(4)}%;background:${colors(p)}" title="${esc(p.name)} · Marktwert ${esc(euro(p.marketCents))} · ${rate===null?'Einstand unbekannt':esc(pct(rate))}"><strong>${esc(p.name)}</strong><span>${esc(euro(p.marketCents))}</span><b>${rate===null?'–':`${rate>=0?'+':''}${esc(pct(rate))}`}</b></button>`;
 }).join('')}</div><div class="fin41-mosaic-key"><span><i class="fin41-mosaic-legend-green"></i>Gewinn</span><span><i class="fin41-mosaic-legend-red"></i>Verlust</span><span><i class="fin41-mosaic-legend-grey"></i>Kein Einstand</span></div><p class="fin41-mosaic-caption">Fläche = Positionswert · Farbe = Veränderung gegenüber dem ausgewiesenen Einstandswert (keine Gesamtrendite). Position anklicken → Kursanalyse.</p>`;
}
export function flatexGainContributions(positions=[]){
 if(!positions.length)return '<p class="fin-disclaimer">Noch keine Positionen importiert.</p>';
 const ordered=sortFlatexPositions(positions,'gain',true),max=Math.max(1,...ordered.map(p=>Math.abs(p.marketCents-p.costCents)));
 return `<div class="fin41-contributions" role="group" aria-label="Buchgewinn- und Verlustbeiträge in Euro">${ordered.map(p=>{
 const delta=p.marketCents-p.costCents,ratio=50*Math.abs(delta)/max;
 return `<button type="button" class="fin41-contribution" data-action="finance-flatex-chart-select" data-id="${esc(p.isin)}" title="${esc(p.name)}: ${esc(euro(delta))} – Kursanalyse öffnen"><span class="fin41-contribution-title">${esc(p.name)}</span><span class="fin41-contribution-bar"><i class="fin41-contribution-zero"></i><em style="left:${delta<0?(50-ratio).toFixed(2):'50'}%;width:${ratio.toFixed(2)}%;background:${delta<0?'#c45a62':'#278c76'}"></em></span><strong class="${delta<0?'negative':'positive'}">${delta>0?'+':''}${esc(euro(delta))}</strong></button>`;
 }).join('')}</div><p class="fin41-mosaic-caption">Buchgewinn/-verlust je Position zum erfassten Stichtag – ohne Ausschüttungen, Steuern oder spätere Einzahlungen.</p>`;
}
