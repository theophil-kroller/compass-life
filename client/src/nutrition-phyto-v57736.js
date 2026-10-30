/** Compass .36 · Source-tagged dietary polyphenol CLASSES, not a combined
 * antioxidant health score. Estimates measure chemical contents in food, not
 * measured absorption, health benefit or human plasma antioxidant effects.
 */
import {nutritionEntries,nutritionFoods} from './personal-journal-v5692.js';
import {SMOOTHIE_INGREDIENTS,smoothieRecipe} from './nutrition-smart-smoothie-v57736.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round=x=>Math.round(x*10)/10;
const day=d=>{const x=new Date(d);return Number.isFinite(+x)?`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`:'';};
const make=(id,name,low,high,food,source,url,note,kind)=>({id,name,low:round(low),high:Number.isFinite(high)?round(high):null,food,source,url,note,kind});
const greenSource='NCBI Bookshelf: Green Tea Catechins and Sport Performance';
const coffeeSource='PubMed 23993490: Kaffee, Chlorogensäuren nach Röstung';
const berrySource='PubMed 23635035: gefrorene Heidelbeeren, Anthocyane';
const greek='Es werden Gehalte in Lebensmitteln geschätzt, keine biologische antioxidative Wirkung.';
export function bioactiveForEntry(entry){
 if(!entry||entry.deleted)return [];
 const id=entry.foodId,amount=String(entry.amount||''),quantity=amount.match(/(\d+(?:[.,]\d+)?)\s*(ml|tassen?|g)\b/i);
 const val=quantity?Number(quantity[1].replace(',','.')):null,unit=quantity?.[2]?.toLowerCase();
 if(id==='green-tea-chinese'){
  const factor=unit==='ml'&&Number.isFinite(val)?val/250:unit?.startsWith('tasse')&&Number.isFinite(val)?val:1;
  return factor>0&&factor<=8?[make('catechins','Grüntee-Catechine',50*factor,100*factor,'Chinesischer Grüntee',greenSource,'https://www.ncbi.nlm.nih.gov/books/NBK299060/','Inkl. EGCG/EGC; Einzelgehalte nicht bekannt. Stark abhängig von Sorte und Ziehzeit.','tea')]:[];
 }
 if(id==='coffee'){
  const factor=unit==='ml'&&Number.isFinite(val)?val/200:1;
  return factor>0&&factor<=8?[make('cga','Chlorogensäuren',27.33*factor,121.25*factor,'Filterkaffee',coffeeSource,'https://pubmed.ncbi.nlm.nih.gov/23993490/','Gemessene Spanne kommerzieller Kaffeegetränke; Bohne und Röstung unbekannt.','coffee')]:[];
 }
 if(['matcha-powder','matcha','matcha-oat-plain'].includes(id)){
  const m=amount.match(/(\d+(?:[.,]\d+)?)\s*g\b/i),t=amount.match(/(\d+(?:[.,]\d+)?)\s*(?:tl|teelöffel)\b/i);
  const grams=id==='matcha-powder'?(m?Number(m[1].replace(',','.')):t?Number(t[1].replace(',','.'))*2:2):2;
  return grams>0&&grams<=30?[make('egcg-min','EGCG (garantierter Mindestgehalt)',30*grams,null,'MatchaTherapy 30+','MatchaTherapy Hersteller · mindestens 30 mg EGCG/g','https://matchatherapy.com/de-at','Markenprofil: deklarierter Mindestgehalt, keine obere Grenze; nicht zu Tee-Catechinen summieren.','matcha')]:[];
 }
 if(id==='apple'||id==='banana'){
  // These foods contain phytochemicals, but there is no validated generic
  // brand/ripeness-specific class assay here. Keep unknown, never zero.
  return [];
 }
 if(id==='smoothie-personal'){
  const grams=smoothieRecipe(entry.recipe).find(x=>x.id==='blueberries')?.grams||0;
  // Specific assay on 10 commercial/freezing cultivars; not guaranteed for user's brand.
  return grams>0?[make('anthocyanins','Heidelbeer-Anthocyane',201.4*grams/100,402.8*grams/100,'Mein Smoothie · Blaubeeren',berrySource,'https://pubmed.ncbi.nlm.nih.gov/23635035/','Sortenstudie; Mengenannahme wird in Rezepteditor bearbeitet. Andere Smoothie-Pflanzenstoffe nicht enthalten.','berries')]:[];
 }
 return [];
}
export function phytoModel(state,{period=30,today=day(new Date())}={}){
 const n=[7,30,90].includes(Number(period))?Number(period):30;
 const start=new Date(today+'T12:00:00');start.setDate(start.getDate()-n+1);const first=day(start);
 const records=nutritionEntries(state).filter(e=>day(e.at)>=first&&day(e.at)<=today),foods=new Map(nutritionFoods(state).map(x=>[x.id,x]));
 const rows=records.flatMap(e=>bioactiveForEntry(e).map(x=>({...x,at:e.at})));
 const grouped=new Map();for(const r of rows){const g=grouped.get(r.id)||{id:r.id,name:r.name,low:0,high:0,count:0,openUpper:false,source:r.source,url:r.url};g.low+=r.low;if(r.high===null)g.openUpper=true;else g.high+=r.high;g.count++;grouped.set(r.id,g);}
 const unsupported=records.filter(e=>!bioactiveForEntry(e).length).map(e=>({name:foods.get(e.foodId)?.title||'Eigenes Lebensmittel',at:e.at}));
 return {period:n,today,first,records:records.length,rows,groups:[...grouped.values()].map(x=>({...x,low:round(x.low),high:x.openUpper?null:round(x.high)})),unsupported,coverage:rows.length};
}
export function nutritionPhytoView(state,{period=30,today=day(new Date())}={}){
 const m=phytoModel(state,{period,today});const labels={7:'7 Tage',30:'30 Tage',90:'90 Tage'};
 return `<section class="phyto736-root" aria-label="Pflanzenstoffe nach Lebensmittelquelle"><div class="phyto736-top"><div><h2>🌿 Pflanzenstoffe &amp; Polyphenole</h2><p>Konkrete Verbindungsgruppen aus dokumentierten Lebensmitteln. Chemische Gehalte sind <strong>keine Messung einer antioxidativen Wirkung im Körper</strong>.</p></div><a href="https://nutritionfacts.org/video/antioxidants-in-a-pinch/" target="_blank" rel="noopener noreferrer">Dr. Greger · Antioxidants in a Pinch ↗</a></div>
 <div class="phyto736-buttons" role="group" aria-label="Analysezeitraum">${[7,30,90].map(n=>`<button type="button" data-action="phyto736-period" data-id="${n}" class="${n===m.period?'selected':''}">${labels[n]}</button>`).join('')}</div>
 <div class="phyto736-overview"><strong>${m.records}</strong><span>erfasste Lebensmittel im Zeitraum</span><strong>${m.rows.length}</strong><span>Einträge mit quantifizierbaren Polyphenolklassen</span></div>
 ${m.groups.length?`<div class="phyto736-cards">${m.groups.map(g=>`<article class="phyto736-card"><small>${esc(g.name)}</small><strong>${g.high===null?'≥ '+g.low.toLocaleString('de-AT',{maximumFractionDigits:1}):g.low.toLocaleString('de-AT',{maximumFractionDigits:1})+'–'+g.high.toLocaleString('de-AT',{maximumFractionDigits:1})} mg</strong><span>Referenzspanne · ${g.count} Eintrag/Einträge</span><a href="${esc(g.url)}" target="_blank" rel="noopener noreferrer">Studie / Datengrundlage ↗</a></article>`).join('')}</div>`:'<p class="phyto736-empty">Noch keine Lebensmittel mit belastbaren Gehaltsbereichen in diesem Zeitraum protokolliert.</p>'}
 <p class="phyto736-explain">Catechine, Chlorogensäuren und Anthocyane bleiben getrennt – sie haben unterschiedliche Zusammensetzungen. Kein „ORAC-Gesundheitsscore“ und keine erfundene Tagesempfehlung. Die USDA hat ihre alte ORAC-Datenbank 2012 zurückgezogen, da diese Laborwerte keine gesicherten Aussagen über gesundheitliche Wirkungen zulassen.</p>
 ${m.rows.length?`<details class="phyto736-unknown"><summary>Beiträge je dokumentiertem Lebensmittel (${m.rows.length})</summary><div>${m.rows.slice().reverse().slice(0,100).map(r=>`<span>${esc(day(r.at))} · ${esc(r.food)}: ${r.high===null?'mind. '+r.low:r.low+'–'+r.high} mg ${esc(r.name)}</span>`).join('')}</div></details>`:''}
 ${m.unsupported.length?`<details class="phyto736-unknown"><summary>Weitere Einträge ohne quantifizierte Polyphenolklasse (${m.unsupported.length})</summary><div>${[...new Set(m.unsupported.map(x=>x.name))].slice(0,75).map(s=>`<span>${esc(s)}</span>`).join('')}</div><p>Diese Lebensmittel sind nicht antioxidantienfrei. Für die konkrete Marke/Zubereitung fehlt nur eine vergleichbare Messung.</p></details>`:''}
 <div class="phyto736-refs"><strong>Weitere Inhaltsstoffe:</strong><span>Chinesischer Grüntee: Kalium, Magnesium, Mangan, Riboflavin (generische USDA-Referenz); Kaffee: Kalium, Magnesium, Niacin (generische USDA-Referenz). Werte werden im Bereich Makro &amp; Mikro als Schätzungen geführt.</span></div></section>`;
}
