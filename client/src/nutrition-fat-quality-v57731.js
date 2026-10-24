/** Compass 0.5.77.31 · Nutrition Insights 4: Fettqualität.
 * Source-conscious: 0 is only recorded when supported; missing != 0.
 * Product labels provide fat/saturated where existing nutritionParts has them.
 * Generic fatty-acid profiles are strictly flagged ESTIMATE (not the branded product).
 * Omega-3 (ALA vs EPA/DHA) and Omega-6 are NOT interchangeable with all PUFA.
 * All calculations are local to the decrypted journal state. */
import {nutritionEntries,nutritionFoods} from './personal-journal-v5692.js';
import {nutritionParts} from './nutrition-intelligence-v57712.js';

export const FAT_FIELDS=Object.freeze({
 fat:['Fett gesamt','g'],saturated:['Gesättigt','g'],mono:['Einfach ungesättigt (MUFA)','g'],poly:['Mehrfach ungesättigt (PUFA)','g'],
 ala:['Omega-3 · ALA','g'],epa:['Omega-3 · EPA','mg'],dha:['Omega-3 · DHA','mg'],omega6:['Omega-6 · Linolsäure','g'],cholesterol:['Cholesterin','mg'],trans:['Transfettsäuren','g']
});
const EXPLAIN={
 fat:'Etikettwert oder belastbarer generischer Durchschnitt',saturated:'Etikettwert oder generischer Durchschnitt',
 mono:'MUFA aus generischer Lebensmitteltabelle',poly:'PUFA aus generischer Lebensmitteltabelle',
 ala:'pflanzliches Omega-3 (α-Linolensäure), nicht EPA/DHA',epa:'langkettiges Omega-3 EPA',dha:'langkettiges Omega-3 DHA',
 omega6:'Linolsäure; kein pauschaler Negativnährstoff',cholesterol:'Cholesterin aus Lebensmitteln; nicht LDL im Blut',trans:'Transfettsäuren'
};
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const finite=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
const round=(x,n=3)=>Math.round(x*10**n)/10**n;
const fmt=(x,n=2)=>finite(x)?x.toLocaleString('de-AT',{maximumFractionDigits:n}):'–';
const dateKey=at=>{const d=new Date(at);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const shiftDate=(day,delta)=>{const d=new Date(`${day}T12:00:00`);d.setDate(d.getDate()+delta);return dateKey(d);};

/** Per 100g GENERIC foods; NEVER claim that a private-label branded product was analysed.
 * Generic database sources: USDA FDC legacy 16090 (peanuts), 01009 (cheddar),
 * Nutrition Advance USDA compilation (butter); Canadian Dairy Commission cheddar.
 * ALA / Omega6 are subsets of PUFA and MUST NOT be added to PUFA again.
 */
export const FAT_REFERENCES=Object.freeze({
 peanuts:{basis:100,unit:'g',fat:49.66,saturated:7.723,mono:26.181,poly:9.773,ala:.025,epa:0,dha:0,omega6:9.694,cholesterol:0,trans:.027,source:'USDA FDC 16090 · gesalzene, trocken geröstete Erdnüsse (Referenz; Hofer-Rezeptur nicht verifiziert)',url:'https://vitahoy.ch/de/ndb/pml/us-16090'},
 cheddar:{basis:100,unit:'g',fat:33.31,saturated:18.867,mono:9.391,poly:.942,ala:.108,epa:10,dha:1,omega6:.791,cholesterol:105,source:'USDA FDC 01009 / Canadian Dairy Commission · generischer Cheddar',url:'https://www.cdc-ccl.ca/en/node/780'},
 'cheddar-hofer':{basis:100,unit:'g',fat:33.31,saturated:18.867,mono:9.391,poly:.942,ala:.108,epa:10,dha:1,omega6:.791,cholesterol:105,source:'USDA generischer Cheddar · keine Messung am Hofer BBQ Cheddar',url:'https://vitahoy.ch/en/ndb/pml/us-01009'},
 'butter-hofer':{basis:100,unit:'g',fat:81.11,saturated:50.49,mono:23.43,poly:3.01,ala:.32,omega6:1.01,cholesterol:215,source:'USDA generische Butter · keine Messung an Hofer Bio-Butter',url:'https://www.nutritionadvance.com/fatty-acid-profiles-of-common-foods/'},
 'fried-egg':{basis:100,unit:'g',fat:14.84,saturated:4.32,mono:6.18,poly:3.25,ala:.14,epa:0,dha:63,omega6:2.78,cholesterol:401,trans:.041,source:'USDA FDC 173423 · generisches Spiegelei; Bratfett/Zubereitung kann stark abweichen',url:'https://getfoodfacts.com/food/egg-whole-cooked-fried-173423'}
});
const DIRECT=Object.freeze({
 'milk-my-vay':{plant:true,note:'Haferdrink enthält Pflanzenfette; konkrete MUFA/PUFA-Verteilung nicht deklariert'},
 'bio-kornbrot':{plant:true,note:'Nuss-/Saatenanteile für Omega-Profil nicht ausreichend quantifiziert'},
 'mixed-nuts':{plant:true,note:'Mischverhältnis der Nüsse/Saaten unbekannt'},
 'dried-mango':{plant:true},apple:{plant:true},'matcha-powder':{plant:true},honey:{plant:true},
 'monin-caramel':{plant:true},'tea-unsweetened':{plant:true},'tea-honey':{plant:true},coffee:{plant:true},
 'oat-latte':{plant:true},'matcha':{plant:true},'matcha-oat-plain':{plant:true},
 'pistachio-butter-cups':{note:'Kakaofett und Pistazienfett im Fertigprodukt: keine spezifischen Fettsäureanalysen'},
 'pringles':{note:'Ölsorte und Sorte/Variante unbekannt'},'chio-chips':{note:'Ölsorte und Sorte/Variante unbekannt'},
 'mensa':{note:'Rezept/Öle des konkreten Study-Tellers fehlen'},'mensa-study-veggie':{note:'Rezept/Öle des konkreten Study-Tellers fehlen'},
 smoothie:{note:'Zutaten nicht spezifiziert'},'other-food':{note:'Lebensmittel nicht spezifiziert'},
 buffet:{note:'Gericht nicht spezifiziert'},'wholegrain-toast-butter-jam':{note:'Mengen und Zusammensetzung offen'},
 'bread-cheese':{note:'Rezeptanteile teilweise bekannt, Brot enthält keine vollständige Fettsäureanalyse'},
 'dark-bread-butter':{note:'Rezeptanteile teilweise bekannt, Brot enthält keine vollständige Fettsäureanalyse'},
 'fried-egg':{note:'Zubereitungsfett und Portion variieren'},'rice-pudding':{note:'Milchrezeptur nicht spezifiziert'},
 latella:{note:'Sorte und Rezeptur können abweichen'},'snickers':{note:'Fertigprodukt, detaillierte Fettsäureanalyse fehlt'},
 chocolate:{note:'Marke und Sorte unbekannt'},'aperol-spritz':{note:'Rezeptur offen'},'red-wine':{},'white-wine':{},whiskey:{},turmeric:{note:'Milch-/Ölsorte im Rezept unbekannt'},
 'cheddar':{},'cheddar-hofer':{},'butter-hofer':{},peanuts:{},
 'supplement-bluebonnet-one-men':{note:'Keine quantifizierte Fettanalyse der Kapsel'},
 'supplement-fuerstenmed':{note:'Keine quantifizierte Fettanalyse der Kapsel'}
});
const ingredients=Object.freeze({
 'Haferdrink':'milk-my-vay', 'Matchapulver':'matcha-powder', 'Honig':'honey',
 'Brot':'bio-kornbrot','Butter':'butter-hofer','Cheddar':'cheddar',
 'Karamellsirup':'monin-caramel','Espresso':'espresso',
});
const plantOnly=new Set(['milk-my-vay','bio-kornbrot','mixed-nuts','dried-mango','apple','matcha-powder','monin-caramel','honey','coffee','espresso','peanuts']);
function partFoodId(part,entryId){if(ingredients[part.part])return ingredients[part.part];
 if(part.part==='Produkt'||part.part==='product')return entryId;
 return entryId;
}
function dose(part,reference){if(part.unit!==reference.unit||!finite(part.amount)||!finite(reference.basis)||!reference.basis)return null;return part.amount/reference.basis;}
function partValue(part,key){return finite(part?.values?.[key])?part.values[key]:null;}
function calcPart(part,foodId){const id=partFoodId(part,foodId),ref=FAT_REFERENCES[id],ratio=ref?dose(part,ref):null;
 const values={},status={},reasons={};
 for(const key of Object.keys(FAT_FIELDS)){
  const fromLabel=['fat','saturated'].includes(key)?partValue(part,key):null;
  if(fromLabel!==null){values[key]=fromLabel;status[key]=(part.estimatedKeys?.includes(key)||/schätzung/i.test(part.source||''))?'estimated':'declared';reasons[key]=part.source||'Produktangabe';continue;}
  if(ratio!==null&&finite(ref[key])){values[key]=round(ref[key]*ratio,4);status[key]='estimated';reasons[key]=ref.source;continue;}
  // Only zero, never substitute zero for an unreported fatty-acid class if fat exists.
  if(key==='cholesterol'&&(plantOnly.has(id)||DIRECT[id]?.plant)){
   values[key]=0;status[key]='inherent';reasons[key]='pflanzliches Lebensmittel enthält kein Cholesterin';continue;
  }
  const fat=partValue(part,'fat');
  if(fat===0&&key!=='cholesterol'){
   values[key]=0;status[key]='rounded';reasons[key]='Etikett: 0 g Fett (gerundeter Deklarationswert)';continue;
  }
  values[key]=null;status[key]='missing';reasons[key]='Nicht deklariert / kein belastbares Referenzprofil';
 }
 return {part,id,values,status,reasons};
}
export function fatEntry(food,entry){let parts=nutritionParts(entry.foodId,entry.amount,food);
 // Existing catalog has a fried egg as a count but no per-gram macro label. A USDA
 // preparation average for one 46g egg is the only explicit, flagged fallback.
 if(!parts.length&&entry.foodId==='fried-egg'){
  const text=String(entry.amount||food?.defaultAmount||'1 Stück');
  const match=text.match(/^(\d+(?:[.,]\d+)?)\s*(?:Stück|Ei(?:er)?)/i);
  const grams=text.match(/^(\d+(?:[.,]\d+)?)\s*g\b/i);
  const g=grams?Number(grams[1].replace(',','.')):match?Number(match[1].replace(',','.'))*46:null;
  if(finite(g)&&g>0&&g<=460)parts=[{unit:'g',amount:g,part:'Produkt',values:{},estimatedKeys:[],source:'USDA FDC 173423 / Zubereitungsschätzung'}];
 }
 const result=parts.map(p=>calcPart(p,entry.foodId)),values={},coverage={};
 for(const key of Object.keys(FAT_FIELDS)){
  const known=result.filter(x=>finite(x.values[key]));
  values[key]=known.length?round(known.reduce((sum,x)=>sum+x.values[key],0),4):null;
  coverage[key]={known:known.length,missing:result.length-known.length,estimate:known.filter(x=>x.status[key]==='estimated').length,rounded:known.filter(x=>x.status[key]==='rounded').length,partial:known.length>0&&known.length<result.length,status:known.length?(known.some(x=>x.status[key]==='estimated')?'estimated':known.some(x=>x.status[key]==='rounded')?'rounded':'declared'):'missing'};
 }
 return {entry,food,parts:result,values,coverage,hasParts:parts.length>0};
}
export function fatQualityModel(state,{days=30,today=dateKey(new Date())}={}){
 const allFoods=nutritionFoods(state),foodMap=new Map(allFoods.map(x=>[x.id,x]));
 const all=nutritionEntries(state),start=days==='all'?'':shiftDate(today,1-Math.max(1,Math.min(3650,Number(days)||30)));
 const entries=all.filter(x=>{const day=dateKey(x.at);return day&&day<=today&&(!start||day>=start);}).map(x=>fatEntry(foodMap.get(x.foodId),x));
 const daysMap=new Map();
 for(const entry of entries){const day=dateKey(entry.entry.at);let rec=daysMap.get(day);if(!rec){rec={day,entries:0,values:{},coverage:{}};daysMap.set(day,rec);}rec.entries++;
  for(const k of Object.keys(FAT_FIELDS)){const v=entry.values[k],c=rec.coverage[k]||{known:0,missing:0,estimates:0,partial:0};
   if(finite(v)){rec.values[k]=(rec.values[k]||0)+v;c.known++;if(entry.coverage[k].estimate)c.estimates++;if(entry.coverage[k].partial)c.partial++;}
   else c.missing++;
   rec.coverage[k]=c;
  }
 }
 const rows=[...daysMap.values()].sort((a,b)=>a.day.localeCompare(b.day));
 const totals={},coverage={};for(const k of Object.keys(FAT_FIELDS)){const known=entries.filter(x=>finite(x.values[k]));totals[k]=known.length?round(known.reduce((s,x)=>s+x.values[k],0),3):null;coverage[k]={known:known.length,missing:entries.length-known.length,estimated:known.filter(x=>x.coverage[k].estimate).length,partial:known.filter(x=>x.coverage[k].partial).length};}
 const catalog=allFoods.map(f=>{const ref=FAT_REFERENCES[f.id],tag=DIRECT[f.id];return {id:f.id,title:f.title,tag:ref?'Referenzprofil':(tag?.plant?'Pflanzlich / teilweise':'Einzeldaten nötig'),source:ref?.source||tag?.note||'Kein spezifisches Fettsäureprofil',url:ref?.url||null};});
 return {entries,rows,totals,coverage,catalog,start,today};
}
const MODES=[['7','7 Tage'],['30','30 Tage'],['90','90 Tage'],['365','1 Jahr'],['all','Gesamt']];
const METRICS=['fat','saturated','mono','poly','ala','omega6','epa','dha','cholesterol','trans'];
const dotColors={fat:'#438A7C',saturated:'#C47F60',mono:'#4C84A5',poly:'#A17FBE',ala:'#568F75',omega6:'#BC9461',epa:'#668FAD',dha:'#668FAD',cholesterol:'#9D8272',trans:'#B66B66'};
function dotPlot(rows,metric){const logged=rows.filter(x=>finite(x.values[metric]));if(!logged.length)return '<p class="ni731-muted">Für diesen Nährstoff liegen noch keine auswertbaren Tage vor.</p>';
 const max=Math.max(...logged.map(x=>x.values[metric]),.01)*1.13;
 const w=860,h=218,padLeft=54,padRight=24,padTop=18,padBottom=36,cw=w-padLeft-padRight,ch=h-padTop-padBottom;
 const xMin=Date.parse(logged[0].day+'T12:00:00Z'),xMax=Date.parse(logged.at(-1).day+'T12:00:00Z');
 const x=day=>padLeft+(Date.parse(day+'T12:00:00Z')-xMin)/Math.max(86400000,xMax-xMin)*cw;
 const y=v=>padTop+ch-(v/max)*ch;
 const guides=[0,.25,.5,.75,1].map(fr=>`<line x1="${padLeft}" y1="${y(fr*max).toFixed(1)}" x2="${w-padRight}" y2="${y(fr*max).toFixed(1)}" stroke="currentColor" opacity=".12"/><text x="${padLeft-8}" y="${(y(fr*max)+4).toFixed(1)}" font-size="12" fill="currentColor" text-anchor="end">${fmt(fr*max,metric==='epa'||metric==='dha'||metric==='cholesterol'?0:2)}</text>`).join('');
 const circles=logged.map(row=>{const color=dotColors[metric]||'#468C82',partial=row.coverage[metric]?.missing>0,estimated=row.coverage[metric]?.estimates>0;
  return `<circle cx="${x(row.day).toFixed(1)}" cy="${y(row.values[metric]).toFixed(1)}" r="${partial?4.2:5.1}" stroke="${color}" stroke-width="2" fill="${partial?'transparent':color}" opacity="${estimated?.85:1}"><title>${esc(row.day)} · ${fmt(row.values[metric],3)} ${FAT_FIELDS[metric][1]} · ${partial?'unvollständige Nährwertabdeckung':'alle erfassten Einträge ausgewertet'}${estimated?' · Schätzdaten':''}</title></circle>`;
 }).join('');
 return `<svg class="ni731-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Punktdiagramm ${esc(FAT_FIELDS[metric][0])}, nur tatsächlich protokollierte Tage">${guides}<line x1="${padLeft}" y1="${h-padBottom}" x2="${w-padRight}" y2="${h-padBottom}" stroke="currentColor" opacity=".3"/><text x="${padLeft}" y="${h-11}" fill="currentColor" font-size="12">${esc(logged[0].day)}</text><text x="${w-padRight}" y="${h-11}" fill="currentColor" font-size="12" text-anchor="end">${esc(logged.at(-1).day)}</text>${circles}</svg>`;
}
const chip=(k,value,cover)=>`<div class="ni731-chip"><small>${esc(FAT_FIELDS[k][0])}</small><strong>${fmt(value,k==='epa'||k==='dha'||k==='cholesterol'?0:2)} <i>${esc(FAT_FIELDS[k][1])}</i></strong><small>${cover.known} mit Wert · ${cover.missing} ohne Angabe${cover.estimated?' · '+cover.estimated+' geschätzt':''}</small></div>`;
export function nutritionFatView(state,{days='30',metric='saturated',today=dateKey(new Date())}={}){
 const model=fatQualityModel(state,{days,today}),metricId=METRICS.includes(metric)?metric:'saturated';
 const checked=model.entries.length,meta=model.coverage[metricId];
 const present=model.rows.filter(row=>finite(row.values[metricId]));
 const points=present.map(row=>`<tr><td>${esc(row.day)}</td><td>${fmt(row.values[metricId],3)} ${esc(FAT_FIELDS[metricId][1])}</td><td>${row.coverage[metricId].known}/${row.entries}</td><td>${row.coverage[metricId].missing?'unvollständig':''}${row.coverage[metricId].estimates?' · Referenzwerte':''}</td></tr>`).reverse().slice(0,15).join('');
 const sources=model.catalog.map(f=>`<tr><td><strong>${esc(f.title)}</strong></td><td>${esc(f.tag)}</td><td>${esc(f.source)}${f.url?` · <a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">Quelle ↗</a>`:''}</td></tr>`).join('');
 return `<section class="ni731-root" aria-label="Fettqualität der Ernährung"><div class="ni731-head"><div><h2>🥑 Fettqualität · Omega-3 / Omega-6</h2><p>Cholesterin, gesättigte und ungesättigte Fettsäuren: belegte Werte getrennt von Schätzungen. Ernährungstagebuch bleibt lokal.</p></div><span class="ni731-count">${checked} Einträge · ${model.rows.length} protokollierte Tage</span></div>
 <nav class="ni731-modes" aria-label="Zeitraum">${MODES.map(([id,label])=>`<button type="button" data-action="ni731-period" data-id="${id}" class="${id===days?'active':''}" aria-pressed="${id===days}">${label}</button>`).join('')}</nav>
 <div class="ni731-chips">${['fat','saturated','mono','poly','ala','omega6','cholesterol','epa','dha','trans'].map(k=>chip(k,model.totals[k],model.coverage[k])).join('')}</div>
 <div class="ni731-chart"><div class="ni731-chart-title"><h3>Einzelne Beobachtungstage · Punktdiagramm</h3><small>Hohle Punkte: für einige Speisen fehlt der gewählte Fettwert</small></div><div class="ni731-metric">${METRICS.map(k=>`<button type="button" data-action="ni731-metric" data-id="${k}" class="${metricId===k?'active':''}" aria-pressed="${metricId===k}">${esc(k==='ala'?'Omega‑3 ALA':k==='epa'?'EPA':k==='dha'?'DHA':k==='omega6'?'Omega‑6':FAT_FIELDS[k][0].replace(' (MUFA)','').replace(' (PUFA)',''))}</button>`).join('')}</div>${dotPlot(model.rows,metricId)}<p class="ni731-muted">${esc(EXPLAIN[metricId])}. Keine Nullen bei fehlenden Werten. Tagebuchdaten sind möglicherweise unvollständig; es werden keine ganzen Tage geschätzt.</p><details><summary>Tage und Datenabdeckung (${present.length})</summary><div class="ni731-table-wrap"><table><thead><tr><th>Tag</th><th>Erfasster Wert</th><th>Abgedeckte Einträge</th><th>Hinweis</th></tr></thead><tbody>${points}</tbody></table></div></details></div>
 <div class="ni731-guides"><h3>Wissenschaftliche Referenzwerte (DGE / ÖGE)</h3><div class="ni731-guide-grid"><div><strong>Gesamtfett</strong><span>ca. 30 % der Energie</span></div><div><strong>Gesättigte</strong><span>höchstens 10 % der Energie</span></div><div><strong>Omega‑3 / ALA</strong><span>0,5 % der Energie (Schätzwert)</span></div><div><strong>Omega‑6 / Linolsäure</strong><span>2,5 % der Energie</span></div><div><strong>EPA + DHA</strong><span>250 mg/Tag Orientierung</span></div><div><strong>Transfette</strong><span>möglichst wenig, unter 1 % der Energie</span></div></div><p>Wichtig: Omega‑6 ist essenziell, kein grundsätzlich „schlechtes“ Fett. Das Omega‑6:3-Verhältnis allein ist kein verlässlicher Gesundheits-Score. Ernährungs-Cholesterin ist nicht dasselbe wie der LDL-Cholesterin-Blutwert. Prozentziele erfordern einen möglichst vollständigen Tagesverzehr; bei lückenhaften Daten keine Ampelwertung.</p><a href="https://www.dge.de/wissenschaft/referenzwerte/fett-essenzielle-fettsaeuren/" target="_blank" rel="noopener noreferrer">DGE/ÖGE-Referenzwerte ↗</a></div>
 <details class="ni731-catalog"><summary>Alle Lebensmittel im Compass-Katalog · Quellen und Datenlücken (${model.catalog.length})</summary><p>Es wurden sämtliche sichtbaren Standard- und eigenen Lebensmittel berücksichtigt. Ohne eindeutige Rezeptur oder Fettanalyse bleiben unbekannte MUFA-, PUFA- und Omega-Werte absichtlich offen. Bei Markenprodukten gelten generische USDA-Profile immer nur als gekennzeichnete Schätzreferenz.</p><div class="ni731-table-wrap"><table><thead><tr><th>Eintrag</th><th>Abdeckung</th><th>Forschungsstand / Quelle</th></tr></thead><tbody>${sources}</tbody></table></div></details>
 </section>`;
}
