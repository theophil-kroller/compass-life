/** Compass Life 0.5.91.65 · Rösti-Toast (label) and homemade raw-cacao oat drink (estimate).
 * Distinguish exact product-panel macros from NON-LABELLED estimated micronutrients.
 * These are catalog entries: never silently log consumption or mutate the vault.
 */
export const ROESTI_TOAST_ID_165 = 'all-seasons-roesti-toast-camembert-lingonberry-200g';
export const RAW_CACAO_OAT_ID_165 = 'homemade-raw-cacao-oat-milk-20261122';

export const ROESTI_165 = Object.freeze({
 id:ROESTI_TOAST_ID_165,
 title:'All Seasons Rösti-Toast · Preiselbeeren & Camembert',
 packGrams:400, piecesPerPack:2, pieceGrams:200,
 label:'Originalverpackung, Nutzerfotos vom 22.11.2026 · Nährwerte zubereitet im Backofen, pro Stück (200 g).',
 ingredients:'Kartoffeln 64 %, Schmelzkäsezubereitung 15 % (u. a. Camembert 4,5 %), Preiselbeerfüllung 10 % (Preiselbeeren 6,5 %), u. a. Zucker, Kartoffelstärke, Dextrose, Öl, Salz. Vegetarisch; Milch, Weizen und Senf als mögliche Allergene/Zutatenetikett prüfen.',
 note:'Pro Verpackung 400 g = 2 Rösti-Toasts. Ein Stück (200 g) liefert laut Packung 455 kcal, 22 g Fett (7,8 g gesättigt), 51 g Kohlenhydrate (6,4 g Zucker), 11 g Protein und 1,8 g Salz. Ballaststoffe, Mineralstoffe und Vitamine sind NICHT deklariert; gespeicherte Mikrowerte sind grobe Zutaten-basierten Schätzungen, nicht Herstellerwerte. 6,5 % Preiselbeeren = etwa 13 g pro Stück innerhalb der gesüßten Füllung: keine automatische Beerenportion. Kartoffeln sind kein Vollkorn. Extra Back-/Bratfett separat buchen.',
 nutrients:Object.freeze({
  kcal:455,protein:11,carbs:51,sugar:6.4,fat:22,saturated:7.8,salt:1.8,
  // Sodium derived from label salt (salt / 2.5); all other micros from typical ingredients.
  sodium:720,calcium:170,magnesium:43,potassium:575,phosphorus:230,iron:1.1,zinc:1.3,
  vitaminC:8,vitaminB6:0.27,folate:30,vitaminB12:0.3
 }),
 estimatedMicroKeys:Object.freeze(['calcium','magnesium','potassium','phosphorus','iron','zinc','vitaminC','vitaminB6','folate','vitaminB12'])
});
export const RAW_CACAO_OAT_165 = Object.freeze({
 id:RAW_CACAO_OAT_ID_165,
 title:'Rohkakao mit Hafermilch · hausgemacht',
 servings:1,milkMlPerCup:200,cacaoGramsPerCup:8,referenceGrams:208,
 ingredients:'Ca. 2 TL klein geschnittene, feste Rohkakaomasse (angenommen 8 g), mit 200 ml Hafermilch, ohne Zuckerzusatz. Hafermilch-Marke, Fortifizierung und Kakaoprodukt unbekannt.',
 note:'SCHÄTZUNG: 1 Tasse ≈ 200 ml Haferdrink Barista (angenommen 60 kcal/100 ml) + 8 g feste Rohkakaomasse (NICHT entöltes Kakaopulver). Sowohl TL-Masse als auch Haferdrink variieren nach Produkt. Keine angenommene Vitamin-B12-/Vitamin-D-/Calcium-Fortifizierung; niedriger Calcium-Basiswert für nicht angereicherten Haferdrink ist nur orientierend. Bei fortifizierter Milch können Calcium, B2, B12 und D deutlich höher sein. Kakaoflavanole/Theobromin/Koffein nicht quantifizierbar; Rohkakao oder Haferdrink sind nicht automatisch eine Daily-Dozen-Gewürz-, Nuss-, Hülsenfrucht-, Vollkorn- oder ungesüßte Getränkeportion. Keine Anti-Aging-Wirkung behauptet.',
 nutrients:Object.freeze({
  kcal:168,protein:3.2,carbs:14.2,sugar:8.15,fat:10.3,saturated:3.2,fiber:2.4,salt:0.2,
  calcium:30,magnesium:60,potassium:270,phosphorus:110,iron:1.2,zinc:0.7,copper:0.2,manganese:0.3,vitaminB1:0.09,folate:10
 })
});
export const ROESTI_COCOA_FOODS_165=Object.freeze([
 Object.freeze({id:ROESTI_TOAST_ID_165,emoji:'🥔',title:ROESTI_165.title,group:'Mahlzeiten',defaultAmount:'1 Stück (200 g)',kcalLow:455,kcalHigh:455,recipeNote:ROESTI_165.label+' '+ROESTI_165.ingredients+' '+ROESTI_165.note,aliases:['Rösti Toast','Rösti-Toast','Rösti Toast Hofer','All Seasons Toast-Roesti','Rösti mit Camembert und Preiselbeeren']}),
 Object.freeze({id:RAW_CACAO_OAT_ID_165,emoji:'☕',title:RAW_CACAO_OAT_165.title,group:'Getränke',defaultAmount:'1 Tasse (200 ml Hafermilch + ca. 8 g Rohkakao)',kcalLow:168,kcalHigh:168,recipeNote:RAW_CACAO_OAT_165.ingredients+' '+RAW_CACAO_OAT_165.note,aliases:['Rohkakao','Roher Kakao mit Hafermilch','Rohkakao Tasse','Raw Cacao Oat Latte','Kakaomasse mit Haferdrink']})
]);
export const ROESTI_COCOA_PROFILES_165=Object.freeze({
 [ROESTI_TOAST_ID_165]:Object.freeze({name:ROESTI_165.title,reference:{amount:200,unit:'g'},nutrients:ROESTI_165.nutrients,source:ROESTI_165.label+' Mikronährstoffe: generische Zutaten-Schätzung, kein Herstelleretikett',extra:{},note:ROESTI_165.note,estimatedNutrients:[...ROESTI_165.estimatedMicroKeys]}),
 [RAW_CACAO_OAT_ID_165]:Object.freeze({name:RAW_CACAO_OAT_165.title,reference:{amount:208,unit:'g'},nutrients:RAW_CACAO_OAT_165.nutrients,source:'Grobe Rezeptschätzung · Nutzerangabe 22.11.2026; Richtwerte Rohkakaomasse und angenommener Haferdrink Barista (keine Produktetiketten)',extra:{cocoaFlavanols:{label:'Kakao-Flavanole',value:null,unit:'mg'},theobromine:{label:'Theobromin',value:null,unit:'mg'},caffeine:{label:'Koffein',value:null,unit:'mg'}},note:RAW_CACAO_OAT_165.note,estimatedNutrients:Object.keys(RAW_CACAO_OAT_165.nutrients)})
});
export const ROESTI_COCOA_RECIPE_165=Object.freeze({
 [ROESTI_TOAST_ID_165]:{packageGrams:400,pieces:2,pieceGrams:200,productPanel:'1 Stück (200 g): 455 kcal; P11, KH51, F22, Zucker6,4, gesättigt7,8, Salz1,8; Ballaststoffe unbekannt',ingredients:ROESTI_165.ingredients},
 [RAW_CACAO_OAT_ID_165]:{referenceGrams:208,ingredients:[{name:'Rohkakaomasse, fest, gehackt',grams:8,assumption:true},{name:'Hafermilch (Barista-Annahme)',millilitres:200,assumption:true}],source:'Nutzerrezept; Mengenannahmen und generische Nährwert-Richtwerte'}
});
const valid=n=>Number.isFinite(n)&&n>0&&n<=5000;
const parseNum=s=>Number(s.replace(',','.'));
/** Return total gram-equivalent; 1 Stück=200g, 1 Packung=400g. */
export function roestiToastPortion165(input, fallback='1 Stück (200 g)'){
 const a=String(input||fallback||'').trim().toLocaleLowerCase('de-AT');
 const g=a.match(/^(\d+(?:[.,]\d+)?)\s*(?:g|gramm)\b/);
 const piece=a.match(/^(\d+(?:[.,]\d+)?)\s*(?:st[üu]ck(?:e)?|portion(?:en)?|toasts?)\b/);
 const pack=a.match(/^(\d+(?:[.,]\d+)?)\s*(?:packung(?:en)?|pack|paket(?:e)?)\b/);
 const half=/^(?:½|halb(?:es|er|e)?)\s*(?:st[üu]ck|portion|toast)\b/.test(a);
 const mass=g?parseNum(g[1]):piece?parseNum(piece[1])*200:pack?parseNum(pack[1])*400:half?100:null;
 return valid(mass)?{grams:mass,portions:mass/200}:null;
}
/** Reference is a cup with 200 ml oat milk + 8 g chopped solid cacao. */
export function rawCacaoOatPortion165(input, fallback='1 Tasse (200 ml Hafermilch + ca. 8 g Rohkakao)'){
 const a=String(input||fallback||'').trim().toLocaleLowerCase('de-AT');
 const g=a.match(/^(\d+(?:[.,]\d+)?)\s*(?:g|gramm)\b/);
 const ml=a.match(/^(\d+(?:[.,]\d+)?)\s*ml\b/);
 const cup=a.match(/^(\d+(?:[.,]\d+)?)\s*(?:tasse(?:n)?|glas|gl[aä]ser|portion(?:en)?)\b/);
 const half=/^(?:½|halb(?:es|er|e)?)\s*(?:tasse|glas|portion)\b/.test(a);
 const mass=g?parseNum(g[1]):ml?parseNum(ml[1])*208/200:cup?parseNum(cup[1])*208:half?104:null;
 return valid(mass)?{grams:mass,portions:mass/208}:null;
}
