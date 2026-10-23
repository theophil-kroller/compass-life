/** Compass 0.5.77.12 — source-aware nutrition estimates. All sources are either
 * explicitly photographed product labels or marked estimates. No missing nutrient
 * value is interpreted as zero and no compound content is fabricated.
 * User food log remains within the encrypted nutritionJournal vault. */
import {nutritionEntries,nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const N={
 kcal:['Energie','kcal'],protein:['Eiweiß','g'],carbs:['Kohlenhydrate','g'],sugar:['davon Zucker','g'],fat:['Fett','g'],saturated:['gesättigte Fettsäuren','g'],fiber:['Ballaststoffe','g'],salt:['Salz','g'],
 vitaminA:['Vitamin A','µg RAE'],vitaminC:['Vitamin C','mg'],vitaminD:['Vitamin D','µg'],vitaminE:['Vitamin E','mg'],vitaminK:['Vitamin K2','µg'],
 vitaminB1:['Vitamin B1','mg'],vitaminB2:['Vitamin B2','mg'],niacin:['Vitamin B3 / Niacin','mg'],vitaminB6:['Vitamin B6','mg'],folate:['Folat','µg DFE'],vitaminB12:['Vitamin B12','µg'],biotin:['Biotin / B7','µg'],pantothenicAcid:['Pantothensäure / B5','mg'],
 calcium:['Calcium','mg'],iodine:['Jod','µg'],magnesium:['Magnesium','mg'],zinc:['Zink','mg'],selenium:['Selen','µg'],copper:['Kupfer','mg'],manganese:['Mangan','mg'],chromium:['Chrom','µg'],molybdenum:['Molybdän','µg'],potassium:['Kalium','mg'],choline:['Cholin','mg'],boron:['Bor','mg']
};
const MACRO_ICONS=Object.freeze({kcal:'⚡',protein:'🥚',carbs:'🌾',sugar:'🍬',fat:'🥑',saturated:'🧈',fiber:'🌿',salt:'🧂'});

export const NUTRIENT_LABELS=N;
const profile=(name,amount,unit,values,source='Etikett',extra={},note='')=>({name,reference:{amount,unit},nutrients:values,source,extra,note});
const LABELLED={
 'milk-my-vay':profile('My Vay Barista Haferdrink · Hofer',100,'ml',{kcal:48,fat:2.3,saturated:.2,carbs:6.1,sugar:2.5,fiber:.2,protein:.6,salt:.11,calcium:120,vitaminB2:.21,vitaminD:1.1,vitaminB12:.38},'Etikett',{},'Angereichert mit Calcium, B2, B12 und D; Zucker aus Haferfermentation.'),
 'monin-caramel':profile('Monin Salted Caramel Sirup',100,'ml',{kcal:326,fat:0,saturated:0,carbs:80.3,sugar:80.3,protein:0,salt:1.01},'Etikett',{},'Kleiner Schuss: 10 ml geschätzt, nicht abgemessen.'),
 'mixed-nuts':profile('MorgenLand Bio Kerniger Nuss Mix',100,'g',{kcal:649,fat:58,saturated:7.1,carbs:12,sugar:4.2,fiber:6.9,protein:17,salt:.02},'Etikett',{},'1 Handvoll = 30 g (vom Nutzer gewogen). Paranüsse: Selen enthalten, Menge unbekannt.'),
 'dried-mango':profile('SPAR Vital Bio-Mangohälften',100,'g',{kcal:298,fat:2.2,saturated:.5,carbs:62,sugar:60,fiber:8.2,protein:2.9},'Produktangabe',{},'Eine persönliche Portion = ganze Packung (200 g). Ohne Zuckerzusatz.'),
 'rice-pudding':profile('S-BUDGET Milchreis Zimt · SPAR',100,'g',{kcal:113,carbs:20,sugar:12,protein:2.8,fat:2.4,salt:.27},'Produktangabe',{},'1 Becher = 200 g; Ballaststoffwert <0,5 g/100 g wird nicht als exakter Messwert geführt.'),
 'pistachio-butter-cups':profile('Better Pistachio Butter Cups',13,'g',{kcal:80,fat:6.1,saturated:2.2,carbs:4.8,sugar:3.9,fiber:.5,protein:1.2,salt:.05},'Etikett',{},'3 Stück à 13 g, insgesamt 39 g. Etikettwerte pro Cup gerundet.'),
 'cheddar':profile('SPAR Würziger Cheddar, in Scheiben',100,'g',{kcal:415,fat:35,saturated:22,protein:25,salt:1.7},'Etikett',{},'Kohlenhydrate und Zucker jeweils <0,5 g/100 g; nicht exakt null. Scheibengewicht vorläufig 25 g.'),
 'cheddar-hofer':profile('Hofer BBQ Burgerscheiben Cheddar',100,'g',{kcal:390,fat:32,saturated:21,protein:25,salt:1.9},'Etikett',{},'Extra dicke Scheibe = 33 g laut Verpackung. Kohlenhydrate <0,5 g/100 g.'),
 'bio-kornbrot':profile('Zurück zum Ursprung Bio Nur-Kornbrot',100,'g',{kcal:268,fat:12.2,saturated:1.6,carbs:26.2,sugar:2.5,fiber:8.1,protein:9.3,salt:1},'Etikett',{},'Eine Brotscheibe mit 50 g nur als vorläufige Menge; individuell abwiegbar.'),
 'butter-hofer':profile('Hofer Bio-Butter',100,'g',{kcal:740,fat:82,saturated:52,carbs:.6,sugar:.6,protein:.7,salt:.02},'Schätzung',{},'Marke bekannt, genaue Etikettwerte nicht vorliegend; 10 g pro bestrichener Scheibe geschätzt.'),
 'peanuts':profile('Hofer gesalzene Erdnüsse',100,'g',{kcal:610,protein:25,fat:50,saturated:7,carbs:10,sugar:5,fiber:8,salt:1},'Schätzung',{},'30 g pro Handvoll vorläufig; konkrete Packung und Portionsgewicht noch nicht bestätigt.'),
 'matcha-powder':profile('MatchaTherapy Matchapulver',2,'g',{kcal:7},'Schätzung',{
   EGC:{label:'Epigallocatechin (EGC)',value:null,unit:'mg',note:'Teecatechin, keine verifizierte Produktmenge'},
   EGCG:{label:'Epigallocatechingallat (EGCG)',value:null,unit:'mg',note:'Teecatechin, keine verifizierte Produktmenge'},
   caffeine:{label:'Koffein',value:null,unit:'mg',note:'Ohne validierte Etikettmenge keine Schätzung'},
   lTheanine:{label:'L-Theanin',value:null,unit:'mg',note:'Ohne validierte Etikettmenge keine Schätzung'}
 },'1 TL ≈ 2 g geschätzt. Kein überprüfbares MatchaTherapy-Nährwertetikett vorhanden; EGC und EGCG sind unterschiedliche Stoffe.'),
 'honey':profile('Honig, 1 TL',7,'g',{kcal:21,carbs:5.7,sugar:5.7},'Schätzung',{},'Teelöffel ≈ 7 g; kein Markenetikett.'),
 'espresso':profile('Espresso',1,'Portion',{kcal:2},'Schätzung',{},'Nur Energie grob geschätzt, Wasser/Filterkaffee praktisch ohne Makros.'),
 // The source is the non-40+ ONE for Men formula (NIH DSLD 332616, UPC 743715001398).
 // 40+ is a different supplement with different strengths: do not silently mix formulations.
 'supplement-bluebonnet-one-men':profile('Bluebonnet ONE for Men · Whole Food-Based Multiple',1,'Kapseln',{
   vitaminA:1050,vitaminC:90,vitaminD:20,vitaminE:15,vitaminK:20,
   vitaminB1:1.2,vitaminB2:1.3,niacin:16,vitaminB6:1.7,folate:667,
   vitaminB12:2.4,biotin:30,pantothenicAcid:5,
   choline:5,calcium:50,iodine:150,magnesium:25,zinc:22,selenium:55,
   copper:0.9,manganese:2.3,chromium:35,molybdenum:45,potassium:5,boron:1
 },'NIH-Produktetikett (DSLD 332616)',{
   paba:{label:'PABA (Para-Aminobenzoesäure)',value:5,unit:'mg'},
   maleBlend:{label:'Advanced Male Health Blend – gesamt',value:100,unit:'mg'},
   nettle:{label:'Brennnesselwurzel-Extrakt',value:null,unit:'mg',partOf:'maleBlend'},
   pomegranate:{label:'Granatapfel-Fruchtextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   ginseng:{label:'Amerikanischer/Panax-Ginsengwurzel-Extrakt',value:null,unit:'mg',partOf:'maleBlend'},
   broccoliExtract:{label:'Brokkoli-Pflanzenextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   ashwagandha:{label:'Ashwagandha-Wurzelextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   pumpkin:{label:'Kürbiskernpulver',value:null,unit:'mg',partOf:'maleBlend'},
   rhodiola:{label:'Rosenwurz-Extrakt (Rhodiola)',value:null,unit:'mg',partOf:'maleBlend'},
   sawPalmetto:{label:'Sägepalmenbeeren-Extrakt',value:null,unit:'mg',partOf:'maleBlend'},
   turmeric:{label:'Kurkuma-Wurzelextrakt',value:null,unit:'mg',partOf:'maleBlend'},
   organicBlend:{label:'Organic Whole Food Vegetable Blend – gesamt',value:5,unit:'mg'},
   barleyGrass:{label:'Bio-Gerstengras',value:null,unit:'mg',partOf:'organicBlend'},
   cabbage:{label:'Bio-Kohl',value:null,unit:'mg',partOf:'organicBlend'},
   parsley:{label:'Bio-Petersilie',value:null,unit:'mg',partOf:'organicBlend'},
   chlorella:{label:'Bio-Chlorella',value:null,unit:'mg',partOf:'organicBlend'},
   spirulina:{label:'Bio-Spirulina',value:null,unit:'mg',partOf:'organicBlend'},
   seaKelp:{label:'Bio-Meeresalgen (Kelp)',value:null,unit:'mg',partOf:'organicBlend'},
   kale:{label:'Bio-Grünkohl',value:null,unit:'mg',partOf:'organicBlend'},
   broccoli:{label:'Bio-Brokkoli',value:null,unit:'mg',partOf:'organicBlend'},
   dandelion:{label:'Bio-Löwenzahnblatt',value:null,unit:'mg',partOf:'organicBlend'},
   broccoliSprout:{label:'Bio-Brokkolisprossen',value:null,unit:'mg',partOf:'organicBlend'},
   dulse:{label:'Bio-Dulse-Algen',value:null,unit:'mg',partOf:'organicBlend'},
   enzymeBlend:{label:'Plant Source Digestive Enzyme Blend – gesamt',value:5,unit:'mg'},
   bromelain:{label:'Bromelain (Ananas)',value:null,unit:'mg',partOf:'enzymeBlend'},
   papain:{label:'Papain (Papaya)',value:null,unit:'mg',partOf:'enzymeBlend'},
   amylase:{label:'Amylase',value:null,unit:'mg',partOf:'enzymeBlend'},
   cellulase:{label:'Cellulase',value:null,unit:'mg',partOf:'enzymeBlend'},
   glucoamylase:{label:'Glucoamylase',value:null,unit:'mg',partOf:'enzymeBlend'},
   lipase:{label:'Lipase',value:null,unit:'mg',partOf:'enzymeBlend'},
   protease:{label:'Protease',value:null,unit:'mg',partOf:'enzymeBlend'}
 },'Offizielles Etikett: https://dsld.od.nih.gov/label/332616 · Formel ONE for Men OHNE 40+. 1 Kapsel pro Portion. Hersteller nennt das Präparat eisenfrei. Einzelmengen innerhalb der Pflanzen-/Enzymmischungen sind nicht ausgewiesen. Keine automatische tägliche Einnahme.'),
 'supplement-fuerstenmed':profile('FürstenMED Kombinationspräparat',4,'Kapseln',{vitaminC:130,zinc:10,selenium:50,vitaminE:22.5},'Etikett',{
   tribulus:{label:'Tribulus-terrestris-Extrakt',value:840,unit:'mg'},
   saponins:{label:'davon Saponine',value:798,unit:'mg',partOf:'tribulus'},
   arginineHcl:{label:'L-Argininhydrochlorid',value:760,unit:'mg'},
   arginine:{label:'davon L-Arginin',value:630,unit:'mg',partOf:'arginineHcl'},
   maca:{label:'Macapulver',value:400,unit:'mg'},
   pomegranate:{label:'Granatapfelextrakt',value:200,unit:'mg'},
   ellagic:{label:'davon Ellagsäure',value:80,unit:'mg',partOf:'pomegranate'},
   eleuthero:{label:'Sibirischer Ginseng-Extrakt',value:300,unit:'mg'},
   eleutherosides:{label:'davon Eleutheroside',value:12,unit:'mg',partOf:'eleuthero'},
   lecithin:{label:'Lecithin',value:76,unit:'mg'}
 },'Alle Mengen gelten für 4 Kapseln. Niacin und Vitamin D3 auf Foto nicht sicher lesbar und deshalb NICHT quantifiziert. Supplement-Einnahme wird nur beim ausdrücklich erfassten Eintrag gezählt.')
};
export const PRODUCT_PROFILES=Object.freeze(LABELLED);
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
const amountNumber=x=>Number(String(x).replace(',','.'));
function quantityFor(entry,food){
 const a=String(entry?.amount||food?.defaultAmount||'').toLowerCase();
 const match=a.match(/(\d+(?:[.,]\d+)?)\s*(g|gramm|ml|kapseln?|scheiben?|stücke?|cups?)(?!\w)/i);
 if(match){const val=amountNumber(match[1]),unit=match[2];if(unit.startsWith('kapsel'))return {value:val,unit:'Kapseln'};
 if(unit.startsWith('scheib'))return {value:val*(entry.foodId==='cheddar-hofer'?33:entry.foodId==='cheddar'?25:50),unit:'g'};
 if(unit.startsWith('stück')||unit.startsWith('cup'))return {value:val*13,unit:'g'};
 return {value:val,unit:unit==='gramm'?'g':unit};}
 if(/handvoll/.test(a)){const m=a.match(/(\d+(?:[.,]\d+)?)\s*handvoll/);return {value:(m?amountNumber(m[1]):1)*30,unit:'g'};}
 if(/packung|becher/.test(a)&&['dried-mango','rice-pudding'].includes(entry.foodId))return {value:200,unit:'g'};
 if(entry.foodId==='cheddar')return {value:25,unit:'g'};
 if(entry.foodId==='cheddar-hofer')return {value:33,unit:'g'};
 if(entry.foodId==='supplement-fuerstenmed'||entry.foodId==='supplement-bluebonnet-one-men')return {value:1,unit:'Kapseln'};
 return null;
}
function rescale(profile,amount,unit,part='product'){
 if(!profile||!Number.isFinite(amount)||amount<0||profile.reference.unit!==unit)return null;
 const factor=amount/profile.reference.amount;
 const values=Object.fromEntries(Object.entries(profile.nutrients).map(([k,v])=>[k,round(v*factor)]));
 return {values,amount,unit,source:profile.source,name:profile.name,part,extra:Object.entries(profile.extra).map(([key,v])=>({key,...v,value:v.value===null?null:round(v.value*factor)})),note:profile.note};
}
export function nutritionParts(foodId,amount='',food=null){
 const source=food||{id:foodId,defaultAmount:''};
 const fake={foodId,amount};
 const value=quantityFor(fake,source);
 const piece=(id,qty,unit,part)=>rescale(LABELLED[id],qty,unit,part);
 if(foodId==='matcha'||foodId==='matcha-oat-plain'){
   const milk=String(amount||'').match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:hafermilch|haferdrink)/i);
   const ml=milk?amountNumber(milk[1]):75;
   return [piece('milk-my-vay',ml,'ml','Haferdrink'),piece('matcha-powder',2,'g','Matchapulver'),...(foodId==='matcha'?[piece('honey',7,'g','Honig')]:[])].filter(Boolean);
 }
 if(foodId==='oat-latte'){
  const a=String(amount||''),milk=a.match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:hafermilch|haferdrink)/i),syrup=a.match(/(\d+(?:[.,]\d+)?)\s*ml\s*(?:sirup|monin)/i);
  return [piece('milk-my-vay',milk?amountNumber(milk[1]):200,'ml','Haferdrink'),piece('monin-caramel',syrup?amountNumber(syrup[1]):10,'ml','Karamellsirup'),piece('espresso',1,'Portion','Espresso')].filter(Boolean);
 }
 if(foodId==='dark-bread-butter'||foodId==='bread-cheese'){
  const a=String(amount||source.defaultAmount||'');
  const countMatch=a.match(/(\d+(?:[.,]\d+)?)\s*(?:scheiben?|stücke?)/i);
  const slices=countMatch?amountNumber(countMatch[1]):1;
  const breadMatch=a.match(/(\d+(?:[.,]\d+)?)\s*g(?=[^\d]*?(?:\+|$))/i);
  const butterMatch=a.match(/butter[^\d]*(\d+(?:[.,]\d+)?)\s*g/i);
  const breadG=breadMatch?amountNumber(breadMatch[1]):50*slices;
  const butterG=butterMatch?amountNumber(butterMatch[1]):10*slices;
  return [piece('bio-kornbrot',breadG,'g','Brot'),piece('butter-hofer',butterG,'g','Butter'),...(foodId==='bread-cheese'?[piece('cheddar',25*slices,'g','Cheddar')]:[])].filter(Boolean);
 }
 if(foodId==='espresso')return [piece('espresso',1,'Portion','Espresso')];
 if(foodId==='milk-my-vay'||foodId==='monin-caramel')return value?[piece(foodId,value.value,value.unit,'Produkt')].filter(Boolean):[];
 return value?[piece(foodId,value.value,value.unit,'Produkt')].filter(Boolean):[];
}
export function nutrientEntry(food,entry){
 const parts=nutritionParts(entry.foodId,entry.amount,food),totals={},knownKeys=new Set();
 const sources=new Set(),partialKeys=new Set();
 for(const p of parts){sources.add(p.source);for(const [k,v] of Object.entries(p.values)){totals[k]=round((totals[k]||0)+v);knownKeys.add(k);}}
 if(parts.length>1)for(const key of knownKeys)if(parts.some(p=>!Object.hasOwn(p.values,key)))partialKeys.add(key);
 if(!parts.length){const k=nutritionKcalEstimate(food,entry.amount);if(k){totals.kcal=round((k.low+k.high)/2);knownKeys.add('kcal');sources.add('Grobe Schätzung');}}
 return {entry,food,parts,values:totals,knownKeys,partialKeys,sources:[...sources]};
}
const dateLocal=at=>{const d=new Date(at);return Number.isFinite(d.getTime())?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
export function nutritionDay(state,day){
 const foods=new Map(nutritionFoods(state).map(f=>[f.id,f]));
 const rows=nutritionEntries(state).filter(e=>dateLocal(e.at)===day).map(e=>nutrientEntry(foods.get(e.foodId),e));
 const totals={},coverage={};for(const key of Object.keys(N))coverage[key]={known:0,unknown:0,partial:0};
 for(const r of rows)for(const key of Object.keys(N)){
   if(r.knownKeys.has(key)){coverage[key].known++;if(r.partialKeys.has(key))coverage[key].partial++;totals[key]=round((totals[key]||0)+(r.values[key]||0));}
   else coverage[key].unknown++;
 }
 return {day,entries:rows,totals,coverage,complete:rows.length>0&&Object.values(coverage).every(x=>x.unknown===0)};
}
const pretty=(n,unit)=>Number.isFinite(n)?`${n.toLocaleString('de-AT',{maximumFractionDigits:2})} ${unit}`:'–';
function section(title,keys,m,{icons=false}={}){return `<section class="ni712-panel"><h3>${esc(title)}</h3><div class="ni712-rows">${keys.map(key=>{
 const [label,unit]=N[key],cov=m.coverage[key],known=cov.known;
 const value=known?pretty(m.totals[key],unit):'–';
 return `<div class="ni712-row"><span class="ni712-nutrient-label">${icons?`<span class="ni712-nutrient-icon" aria-hidden="true">${MACRO_ICONS[key]||'◦'}</span>`:''}${esc(label)}</span><strong>${esc(value)}</strong><small>${known?`${known}/${m.entries.length} Einträge mit Wert${cov.unknown||cov.partial?' · teilweise unbekannt':''}`:'Nicht bestimmt'}</small></div>`;
 }).join('')}</div></section>`;}
export function nutritionIntelligenceView(state,{day=dateLocal(new Date()),detail=''}={}){
 const m=nutritionDay(state,day),entries=m.entries,labels=N,detailProfile=LABELLED[detail];
 const productList=['matcha-powder','milk-my-vay','monin-caramel','mixed-nuts','peanuts','dried-mango','rice-pudding','pistachio-butter-cups','cheddar','cheddar-hofer','bio-kornbrot','butter-hofer','supplement-bluebonnet-one-men','supplement-fuerstenmed'];
 const head=`<section class="work-card ni712-root"><div class="ni712-header"><div><small>COMPASS · NUTRITION INTELLIGENCE</small><h2>Makro & Mikro · Tagesanalyse</h2><p>Nur tatsächlich protokollierte Produkte und Rezepte. Fehlende Werte sind unbekannt, nicht null.</p></div><div class="ni712-day"><button type="button" data-action="ni712-day" data-id="prev" aria-label="Vortag">←</button><strong>${esc(new Date(day+'T12:00:00').toLocaleDateString('de-AT',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}))}</strong><button type="button" data-action="ni712-day" data-id="next" aria-label="Folgetag">→</button><button type="button" data-action="ni712-day" data-id="today">Heute</button></div></div>
 <div class="ni712-kpis"><div><strong>${entries.length}</strong><small>Ernährungseinträge</small></div><div><strong>${m.coverage.kcal.known?pretty(m.totals.kcal,'kcal'):'–'}</strong><small>Erfasste Energie · Teilbilanz</small></div><div><strong>${m.coverage.protein.known?pretty(m.totals.protein,'g'):'–'}</strong><small>Bekanntes Eiweiß</small></div><div><strong>${m.coverage.fiber.known?pretty(m.totals.fiber,'g'):'–'}</strong><small>Bekannte Ballaststoffe</small></div></div>
 <p class="ni712-caveat">${entries.length?`${entries.length} Einträge · ${m.coverage.kcal.known} mit Energiewert · ${m.coverage.protein.unknown} ohne Proteindaten. Ein niedriger Wert zeigt keine Unterversorgung an.`:'Für diesen Tag sind noch keine Lebensmittel oder Nahrungsergänzungen protokolliert.'} Schätzwerte, Produktetiketten und unbekannte Nährstoffe werden getrennt gekennzeichnet. Kein Nachweis eines Nährstoffmangels.</p>
 <div class="ni712-grid">${section('Makronährstoffe',['kcal','protein','carbs','sugar','fat','saturated','fiber','salt'],m,{icons:true})}${section('Vitamine & Mineralstoffe',['vitaminA','vitaminC','vitaminD','vitaminE','vitaminK','vitaminB1','vitaminB2','niacin','vitaminB6','folate','vitaminB12','biotin','pantothenicAcid','calcium','iodine','magnesium','zinc','selenium','copper','manganese','chromium','molybdenum','potassium','choline','boron'],m)}</div>
 <details class="ni712-details"><summary>Welche Lebensmittel fließen ein? (${entries.length})</summary>${entries.length?`<div class="ni712-entry-list">${entries.map(x=>`<div><span><strong>${esc(x.food?.title||'Eigenes Lebensmittel')}</strong><small>${esc(x.entry.amount||'Menge unbekannt')}</small></span><span>${x.knownKeys.has('kcal')?esc(pretty(x.values.kcal,'kcal')):'kcal unbekannt'}<small>${esc(x.sources.join(' / ')||'Ohne Nährstoffprofil')}</small></span></div>`).join('')}</div>`:'<p>Keine Einträge vorhanden.</p>'}</details></section>`;
 const profiles=`<section class="work-card ni712-root"><h2>Produktwissen & Inhaltsstoffe</h2><p class="muted-line">Herstelleretiketten, Hersteller-Produktangaben und Schätzungen bleiben nachvollziehbar. Pflanzenstoffe und „davon“-Untergruppen werden nicht zu Vitamin- oder Makro-Summen addiert.</p><div class="ni712-product-list">${productList.map(id=>`<button type="button" data-action="ni712-profile" data-id="${esc(id)}" class="${id===detail?'active':''}">${esc(LABELLED[id].name)}</button>`).join('')}</div>${detailProfile?`<div class="ni712-profile"><h3>${esc(detailProfile.name)}</h3><p><strong>Daten:</strong> ${esc(detailProfile.source)} · je ${detailProfile.reference.amount} ${esc(detailProfile.reference.unit)}. ${esc(detailProfile.note)}</p><div class="ni712-profile-values">${Object.entries(detailProfile.nutrients).map(([k,v])=>`<div><span>${esc(labels[k]?.[0]||k)}</span><strong>${esc(pretty(v,labels[k]?.[1]||''))}</strong></div>`).join('')}</div>${Object.keys(detailProfile.extra).length?`<h4>Zusätzliche Inhaltsstoffe (nicht zu summieren)</h4><div class="ni712-profile-values">${Object.values(detailProfile.extra).map(x=>`<div><span>${esc(x.label)}</span><strong>${x.value===null?'Menge unbekannt':esc(pretty(x.value,x.unit))}</strong></div>`).join('')}</div>`:''}</div>`:'<p class="muted-line">Produkt antippen, um Nährwerte und zusätzliche Inhaltsstoffe zu sehen.</p>'}</section>`;
 return head+profiles;
}
