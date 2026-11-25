/** Compass Life 0.5.91.68 – photographed packaged foods (25 Nov 2026).
 * Label macros are authoritative for the photographed packaging. All micros
 * are proxy estimates, NOT claims about the actual branded batches.
 * No automated diary entries are created by this catalog module.
 */
export const BILLA_SAHNE_PUDDING_ID_168='billa-sahnepudding-vanille-500g-20261125';
export const NOEM_PRO20_VANILLA_ID_168='noem-pro20-topfencreme-vanille-235g-20261125';
export const RAPUNZEL_CRANBERRY_ID_168='rapunzel-cranberries-apple-concentrate-100g-20261125';

// Amounts in each table are PER 100 GRAMS; no fat/fibre values inferred from
// missing label declarations. NÖM label reports FAT <0.5 g/100 g: 0.25 is an
// explicit modelling midpoint, NOT a measured value (upper bound retained).
const ITEMS=Object.freeze([
 Object.freeze({
  id:BILLA_SAHNE_PUDDING_ID_168,emoji:'🍮',
  title:'BILLA immer gut Sahnepudding · Vanille',group:'Snacks',grams:500,package:'Becher',
  labels:Object.freeze({kcal:151,protein:2.7,carbs:15,sugar:12,fat:8.8,saturated:6.0,salt:0.15}),
  micros:Object.freeze({calcium:105,magnesium:10,potassium:125,phosphorus:90,vitaminB2:0.12,vitaminB12:0.4}),
  aliases:['Billa Sahne Pudding Vanille','Sahnepudding Billa','BILLA Vanillepudding 500g','Vanille-Sahnepudding Bourbon-Vanille'],
  note:'Originaletikett aus Nutzerfotos vom 25.11.2026. 500-g-Becher: 88 % Sahne (10 % Fett), Zucker, modifizierte Stärke, 0,6 % Bourbon-Vanilleextrakt, Laktose, Kurkumaextrakt, Salz, Carrageen, Vanillemark, Aroma und Paprikaextrakt. Energie, Fett, gesättigte Fettsäuren, Kohlenhydrate, Zucker, Eiweiß und Salz sind Herstelleretikettwerte. Ballaststoffe und weitere nicht genannte Nährstoffe UNBEKANNT (nicht 0); Calcium, Magnesium, Kalium, Phosphor, Vitamin B2 und Vitamin B12 sind ausdrücklich ungefähre Milchprodukt-Referenzwerte, nicht produktspezifisch gemessen. Daily Dozen: keine automatische Pflanzenportion; Bourbon-Vanille ist keine quantifizierte Gewürzportion. Anti-Aging Eight: keine spezielle Gutschrift.'
 }),
 Object.freeze({
  id:NOEM_PRO20_VANILLA_ID_168,emoji:'🥣',
  title:'nöm PRO 20 Topfencreme · Vanille',group:'Snacks',grams:235,package:'Becher',
  labels:Object.freeze({kcal:48,protein:8.4,carbs:3.4,sugar:3.0,fat:0.25,saturated:0.1,salt:0.1}),
  micros:Object.freeze({calcium:105,phosphorus:160,potassium:140,magnesium:12,vitaminB2:0.21,vitaminB12:0.7}),
  aliases:['NÖM PRO20 Vanilla','nöm PRO Topfencreme Vanille','nöm Pro 20 Vanille 235g','High Protein Vanille Topfencreme','Nöm High Protein Vanilla'],
  upperBounds:Object.freeze({fat:0.5}),
  note:'Originaletikett aus Nutzerfotos vom 25.11.2026. 235-g-Becher, Vanille-Topfencreme aus Mager-Topfen, Wasser, 8 % Joghurt aus Magermilch, modifizierter Stärke, Johannisbrotkernmehl, Vanillearoma/-pulver und den Süßungsmitteln Sucralose und Acesulfam K. Hersteller: <0,5 g Fett je 100 g; für die Summenbildung bewusst 0,25 g/100 g als SCHÄTZUNG genutzt, tatsächlich pro Becher <1,175 g. Kalorien/Protein/Kohlenhydrate/Zucker/gesättigte Fettsäuren/Salz: Herstelleretikett. Mikronährstoffe: nicht deklariert, nur geschätzte Magerquark-/Joghurt-Referenzprofile. Ballaststoffe unbekannt, nicht 0. Der Becher enthält keinen zugesetzten Zucker, aber natürlichen Milchzucker. Daily Dozen und Anti-Aging Eight: kein automatischer Pflanzen- bzw. Gesundheitscredit.'
 }),
 Object.freeze({
  id:RAPUNZEL_CRANBERRY_ID_168,emoji:'🍒',
  title:'Rapunzel Bio Cranberries · mit Apfeldicksaft',group:'Snacks',grams:100,package:'Packung',
  labels:Object.freeze({kcal:331,protein:0.9,carbs:73,sugar:56,fat:0.9,saturated:0.1,fiber:5.8,salt:0.04}),
  micros:Object.freeze({calcium:9,magnesium:6,potassium:49,phosphorus:13,iron:0.4,manganese:0.3}),
  aliases:['Rapunzel Cranberries ganze Beeren 100g','Getrocknete Cranberries Apfeldicksaft','Bio Cranberries Rapunzel','Cranberries getrocknet Rapunzel'],
  note:'Originaletikett aus Nutzerfotos vom 25.11.2026. 1 ganze Packung = 100 g, Zusammensetzung: 60 % getrocknete Cranberries, 39 % Apfeldicksaft und ca. 1 % Sonnenblumenöl. ALLE Etikett-Makros inklusive 56 g Zucker pro 100 g; Apfeldicksaft bedeutet zugesetzte konzentrierte Zuckerquelle. Mineralstoffangaben NICHT auf der Packung: sehr grobe generische Schätzwerte aus gesüßten getrockneten Cranberries, nicht als exakte Messwerte ausgeben. Daily Dozen: nur der 60-g-Trockencranberry-Anteil kann näherungsweise als Beerenanteil eingeordnet werden (ca. 1,5 Trockenbeeren-Referenzportionen à 40 g); die übrigen 40 % der Packung werden NICHT zusätzlich als Früchte/Beeren gezählt. Produkt ist gesüßt und kein gleichwertiger Ersatz für ungesüßte Beeren. Anti-Aging Eight: Beerenverzehr ist protokollierbar, keine messbare Langlebigkeitswirkung. Auf Foto aufgedrucktes MHD 20.02.2026 – bei künftigen Packungen separat auf MHD und Verderb prüfen.'
 })
]);
export const PACKAGED_168=Object.freeze(Object.fromEntries(ITEMS.map(x=>[x.id,x])));
export const PACKAGED_GRAMS_168=Object.freeze(Object.fromEntries(ITEMS.map(x=>[x.id,x.grams])));
export const PACKAGED_FOODS_168=Object.freeze(ITEMS.map(x=>Object.freeze({
 id:x.id,emoji:x.emoji,title:x.title,group:x.group,
 defaultAmount:`1 ${x.package} (${x.grams} g)`,
 kcalLow:Math.round(x.labels.kcal*x.grams/100),kcalHigh:Math.round(x.labels.kcal*x.grams/100),
 recipeNote:x.note,aliases:x.aliases
})));
export const PACKAGED_PROFILES_168=Object.freeze(Object.fromEntries(ITEMS.map(x=>[x.id,Object.freeze({
 name:x.title,reference:{amount:100,unit:'g'},
 nutrients:{...x.labels,...x.micros},
 source:'Nutzerfotos der Originalverpackung vom 25.11.2026 (Makros); für Mikros generische Lebensmittel-Referenzschätzwerte, keine Herstellerdeklaration',
 extra:{upperBounds:x.upperBounds||{},dailyDozen:x.id===RAPUNZEL_CRANBERRY_ID_168?['berries (reiner Cranberry-Anteil, gesüßt)']:[],antiAgingEight:{credited:[]}},
 note:x.note,estimatedNutrients:[...Object.keys(x.micros),...(x.upperBounds?Object.keys(x.upperBounds):[])],
 ...(x.upperBounds?{upperBounds:x.upperBounds}:{})
})])));

/** Only the new ids are handled here; the rest of Compass's parsing stays unchanged. */
export function packagedPortion168(id,amount='',defaultAmount=''){
 const item=PACKAGED_168[id];if(!item)return null;
 const raw=String(amount||defaultAmount||`1 ${item.package} (${item.grams} g)`).trim().toLocaleLowerCase('de-AT').replace(/,/g,'.');
 const numeric=raw.match(/^(\d+(?:\.\d+)?)\s*(?:g|gramm)\b/);
 const quantity=raw.match(/^(\d+(?:\.\d+)?)\s*(?:becher(?:n)?|packung(?:en)?|paket(?:en)?|portion(?:en)?|st[üu]ck(?:e)?)\b/);
 const half=/^(?:½|halb(?:e|er|es)?)\s*(?:becher|packung|paket|portion)\b/.test(raw);
 const grams=numeric?Number(numeric[1]):quantity?Number(quantity[1])*item.grams:half?item.grams/2:null;
 if(!Number.isFinite(grams)||grams<=0||grams>5000)return null;
 return {grams,portions:grams/item.grams};
}
