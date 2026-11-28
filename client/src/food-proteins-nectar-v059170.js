/** Compass Life 0.5.91.70 — food menu extension, 28 November 2026.
 * Source: user-supplied original-package photographs (all declared values).
 * Powder profiles describe dry powder only; prepared milk is a separate entry.
 * Voelkel is a sweetened nectar, not an unsweetened fruit juice.
 * Unknown trace nutrients must not be treated as proven zero; labelled <x are modeled
 * as explicitly estimated midpoint proxies with published upper limits in metadata. */
export const NEW_FOODS_170=Object.freeze([
 {
  id:'schalkmuehle-tropical-treasure-protein-20g-20261128',title:'Schalk Mühle Bio Vegan Protein · Tropical Treasure',emoji:'🥭',group:'Getränke',unit:'g',grams:20,
  labels:{kcal:359,protein:43,carbs:26,sugar:17,fat:7.6,saturated:3.5,fiber:8.2,salt:0.44,magnesium:368,vitaminC:968},micros:{},
  aliases:['Tropical Treasure Protein','Schalkmühle Protein Mango Banane Kokos','Bio Vegan Protein tropical'],
  note:'Originaletikett 28.11.2026: Pulver je 100 g 359 kcal, 43 g Protein, 26 g KH (17 g Zucker), 7,6 g Fett (3,5 g gesättigt), 8,2 g Ballaststoffe, 0,44 g Salz, 368 mg Magnesium und 968 mg Vitamin C. Je 20 g: 71,8 kcal, 8,6 g Protein, 73,6 mg Magnesium und 193,6 mg Vitamin C. Zutaten: 32 % entöltes Sonnenblumenkernpulver, 22 % Ackerbohnen-Proteinisolat, 20 % Bananenpulver, 10 % entöltes Kürbiskernpulver, 10 % Kokosmilchpulver (mit Maltodextrin), 3 % Acerolapulver, 3 % Mangopulver. Teilweise entölte Saatenpulver und Protein-Isolat: keine automatische ganze Daily-Dozen-Nüsse-/Samen-, Hülsenfrucht- oder Obstportion. Zutatenanteile dienen nur als transparente Hinweise. Flüssigkeiten separat buchen. Mikroangaben außer Magnesium und Vitamin C unbekannt.'
 },
 {
  id:'raab-bio-soya-cocoa-protein-shake-20g-20261128',title:'Raab Bio Protein Shake · Soja Kakao',emoji:'🥤',group:'Getränke',unit:'g',grams:20,packageGrams:300,
  labels:{kcal:356,protein:72,carbs:12,sugar:10,fat:1.1,saturated:0.7,fiber:5.1,salt:0.47},micros:{},
  aliases:['Raab Protein Shake Soja Kakao','Raab Sojaprotein Kakao Bio','Raab Cocoa Protein'],
  note:'Herstelleretikett 28.11.2026 je 100 g: 356 kcal, 72 g Protein, 12 g KH (10 g Zucker), 1,1 g Fett (0,7 g gesättigt), 5,1 g Ballaststoffe, 0,47 g Salz. Je 20 g Pulver 71,2 kcal, 14,4 g Protein, 2,4 g KH, 2 g Zucker. Zutaten: 78 % Sojaprotein, 12 % Agavendicksaftpulver, 10 % fettarmes Kakaopulver. Sojaprotein-Konzentrat ist keine vollständige Daily-Dozen-Hülsenfrucht-Portion; 2 g Kakaopulver kein belegter spezifischer Anti-Aging-Erfolg. Mikronährstoffe nicht deklariert: unbekannt, nicht Null. Zubereitungsvorschlag 20 g in 300 ml Pflanzendrink/Milch; Getränk separat eintragen.'
 },
 {
  id:'raab-bio-soya-vanilla-protein-shake-20g-20261128',title:'Raab Bio Protein Shake · Soja Vanille',emoji:'🥤',group:'Getränke',unit:'g',grams:20,packageGrams:300,
  labels:{kcal:374,protein:72,carbs:17,sugar:13,fat:1.3,saturated:0.05,fiber:2.9,salt:0.1},micros:{},estimatedKeys:['saturated'],upperBounds:{saturated:0.1},
  aliases:['Raab Protein Shake Soja Vanille','Raab Sojaprotein Vanille Bio','Raab Vanilla Protein'],
  note:'Herstelleretikett 28.11.2026 je 100 g: 374 kcal, 72 g Protein, 17 g KH (13 g Zucker), 1,3 g Fett, <0,1 g gesättigte Fettsäuren, 2,9 g Ballaststoffe, 0,1 g Salz. Gesättigte Fettsäuren 0,05 g/100 g als transparenter Rechenmittelpunkt der Obergrenze, NICHT als gemessener Wert. Je 20 g Pulver 74,8 kcal und 14,4 g Protein. Sojaproteinprodukt mit Vanillegeschmack; keine vollständig belegte Hülsenfruchtportion. Mikronährstoffe nicht deklariert: unbekannt, nicht Null. Getränkezusatz separat buchen.'
 },
 {
  id:'voelkel-bio-maracuja-nectar-200ml-20261128',title:'Voelkel Bio Maracuja-Nektar · 30 % Frucht',emoji:'🧃',group:'Getränke',unit:'ml',grams:200,packageGrams:500,
  labels:{kcal:68,protein:0.25,carbs:15.2,sugar:15.1,fat:0.25,saturated:0.05,salt:0.005},micros:{},
  estimatedKeys:['protein','fat','saturated','salt'],upperBounds:{protein:0.5,fat:0.5,saturated:0.1,salt:0.01},
  aliases:['Voelkel Maracuja Saft','Bio Maracuja Nektar','Passionsfrucht Nektar Voelkel'],
  note:'Originaletikett 28.11.2026 je 100 ml: 68 kcal, 15,2 g KH (15,1 g Zucker), Fett <0,5 g, gesättigt <0,1 g, Eiweiß <0,5 g, Salz <0,01 g. Für <x-Angaben speichert Compass ausdrücklich geschätzte Rechenmittelpunkte und die Etikettobergrenze; keinesfalls sind das gemessene Werte. Zutaten: natürliches Mineralwasser, 30 % Maracujasaft, Rohrzucker, Zitronensaftkonzentrat, Pektin. 1 Glas 200 ml = 136 kcal und 30,2 g Zucker. Flasche 0,5 l. Gezuckerter Nektar, keine Daily-Dozen-Obstportion und keine Wasser-/Teeportion. Mikroangaben unbekannt.'
 }
]);
export const FOOD_INDEX_170=Object.freeze(Object.fromEntries(NEW_FOODS_170.map(x=>[x.id,Object.freeze(x)])));
export const FOOD_GRAMS_170=Object.freeze(Object.fromEntries(NEW_FOODS_170.map(x=>[x.id,x.grams])));
export const FOODS_170=Object.freeze(NEW_FOODS_170.map(x=>Object.freeze({
 id:x.id,title:x.title,emoji:x.emoji,group:x.group,
 defaultAmount:x.unit==='ml'?`1 Glas (${x.grams} ml)`:`1 Portion (${x.grams} g Pulver)`,
 kcalLow:Math.round(x.labels.kcal*x.grams/100),kcalHigh:Math.round(x.labels.kcal*x.grams/100),
 aliases:x.aliases,recipeNote:x.note
})));
export const PROFILES_170=Object.freeze(Object.fromEntries(NEW_FOODS_170.map(x=>[x.id,Object.freeze({
 name:x.title,reference:{amount:100,unit:'g'},nutrients:{...x.labels,...x.micros},
 source:'Originaletikett auf Nutzerfotos, 28.11.2026 (mit wenigen explizit markierten <x-Schätzungen)',
 note:x.note,extra:{dailyDozen:[],antiAgingEight:{credited:[]},upperBounds:x.upperBounds||{}},
 estimatedNutrients:x.estimatedKeys||[],...(x.upperBounds?{upperBounds:x.upperBounds}:{})
})])));
/** Exact, quantity-preserving parsing for products of this release. */
export function foodPortion170(id,amount='',defaultAmount=''){
 const spec=FOOD_INDEX_170[id];if(!spec)return null;
 const text=String(amount||defaultAmount||'').toLocaleLowerCase('de-AT').trim().replace(/,/g,'.');
 const m=text.match(/^(\d+(?:\.\d+)?)\s*(ml|milliliter|g|gramm|portion(?:en)?|gl[aä]s(?:er)?|flasche(?:n)?|packung(?:en)?|el|essl[oö]ffel)\b/);
 const half=text.match(/^(?:½|halbe[rs]?|halb)\s*(portion|glas|flasche|packung)\b/);
 let mass=null;
 if(m){const n=Number(m[1]),u=m[2];
  if(/^(?:g|gramm|ml|milliliter)$/.test(u))mass=n;
  else if(/^(?:flasche|packung)/.test(u))mass=n*(spec.packageGrams||spec.grams);
  else if(/^(?:el|essl)/.test(u))mass=spec.unit==='g'?n*10:null; // Raab: manufacturer measures 2 EL=20g, Tropical uses 2 EL without validated grams; 10g/EL is estimate.
  else mass=n*spec.grams;
 }else if(half)mass=(/^(?:flasche|packung)/.test(half[1])?(spec.packageGrams||spec.grams):spec.grams)/2;
 if(!Number.isFinite(mass)||mass<=0||mass>5000)return null;
 return {grams:mass,portions:mass/spec.grams}; // 1ml~1g for drink; explicitly stated approximation.
}
