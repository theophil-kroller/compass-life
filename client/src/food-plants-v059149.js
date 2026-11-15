/** 0.5.91.49 · additive plant foods and Calpis.
 * Weights are edible grams; Calpis is mL ready-to-drink (5:1 dilution).
 * Existing banana ID is NOT replaced or duplicated.
 * Generic values are composition estimates (USDA/UK CoFID) except Calpis label;
 * never impute unreported micronutrients as zero, nor health benefit scores.
 */
export const PLANT_MENU_149=Object.freeze([
  {
    "id": "broccoli-steamed-home-20261115",
    "emoji": "🥦",
    "title": "Brokkoli · gedämpft mit Salz & Pfeffer",
    "group": "Mahlzeiten",
    "defaultAmount": "1 Portion (250 g gegart)",
    "defaultQuantity": 250,
    "unit": "g",
    "nutrients": {
      "kcal": 34,
      "protein": 4.1,
      "carbs": 3.5,
      "sugar": 2,
      "fat": 0.5,
      "saturated": 0.12,
      "fiber": 3.8,
      "vitaminA": 61,
      "vitaminC": 60,
      "vitaminE": 1.8,
      "vitaminK": 110,
      "vitaminB1": 0.29,
      "vitaminB2": 0.15,
      "vitaminB6": 0.13,
      "folate": 72,
      "calcium": 44,
      "iron": 0.75,
      "magnesium": 21,
      "phosphorus": 74,
      "potassium": 373,
      "zinc": 0.6
    },
    "source": "USDA FoodData Central / UK CoFID · gegarter, essbarer Anteil; Näherung",
    "dailyDozen": "cruciferous",
    "antiAgingEight": {
      "greens": "cruciferous / green vegetable",
      "microbiome": "dietary_fiber",
      "xeno": "phytochemicals_present_not_quantified"
    },
    "recipeNote": "Gedämpft, kein Öl; Salzmenge nicht beziffert und nicht als 0 gespeichert. 250 g gegarter Brokkoli sind eine Portionsannahme (nicht automatisch ein ganzer roher Brokkolikopf). Vitamin-C-Gehalt schwankt je nach Dampfzeit.",
    "aliases": [
      "Steamed Broccoli",
      "Gedämpfter Brokkoli",
      "ganzer Brokkoli"
    ],
    "preparation": "steamed"
  },
  {
    "id": "passion-fruit-fresh-20261115",
    "emoji": "🥭",
    "title": "Maracuja · frisch",
    "group": "Snacks",
    "defaultAmount": "1 Frucht (ca. 18 g Fruchtfleisch)",
    "defaultQuantity": 18,
    "unit": "g",
    "nutrients": {
      "kcal": 97,
      "protein": 2.2,
      "carbs": 23.4,
      "sugar": 11.2,
      "fat": 0.7,
      "saturated": 0.06,
      "fiber": 10.4,
      "vitaminA": 64,
      "vitaminC": 30,
      "vitaminB2": 0.13,
      "niacin": 1.5,
      "folate": 14,
      "calcium": 12,
      "iron": 1.6,
      "magnesium": 29,
      "phosphorus": 68,
      "potassium": 348,
      "zinc": 0.1
    },
    "source": "USDA FoodData Central · generischer Durchschnittswert, nicht produktspezifisch",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "phytochemicals_present_not_quantified"
    },
    "recipeNote": "Roh, essbares Fruchtfleisch inkl. Kerne; Schale nicht mitgewogen. 18 g ist eine kleine Maracuja; bei größeren Früchten Gramm anpassen. Keine Beeren-Gutschrift.",
    "aliases": [
      "Passionsfrucht",
      "Passionfruit"
    ],
    "preparation": "raw"
  },
  {
    "id": "carrot-raw-fresh-20261115",
    "emoji": "🥕",
    "title": "Karotte · roh",
    "group": "Snacks",
    "defaultAmount": "1 Karotte (ca. 80 g)",
    "defaultQuantity": 80,
    "unit": "g",
    "nutrients": {
      "kcal": 41,
      "protein": 0.93,
      "carbs": 9.58,
      "sugar": 4.74,
      "fat": 0.24,
      "saturated": 0.032,
      "fiber": 2.8,
      "vitaminA": 835,
      "vitaminC": 5.9,
      "vitaminE": 0.66,
      "vitaminK": 13.2,
      "vitaminB1": 0.066,
      "vitaminB2": 0.058,
      "niacin": 0.983,
      "vitaminB6": 0.138,
      "folate": 19,
      "calcium": 33,
      "iron": 0.3,
      "magnesium": 12,
      "phosphorus": 35,
      "potassium": 320,
      "zinc": 0.24
    },
    "source": "USDA FoodData Central · Carrots raw, FDC 170393",
    "dailyDozen": "vegetables",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "carotenoids_present_not_quantified"
    },
    "recipeNote": "Roh; Standardgewicht essbar, ohne Grün. Betacarotin in Vitamin A (RAE) bereits berücksichtigt.",
    "aliases": [
      "Möhre",
      "Karottenstange"
    ],
    "preparation": "raw"
  },
  {
    "id": "mango-fresh-20261115",
    "emoji": "🥭",
    "title": "Mango · frisch",
    "group": "Snacks",
    "defaultAmount": "1 Mango (ca. 200 g Fruchtfleisch)",
    "defaultQuantity": 200,
    "unit": "g",
    "nutrients": {
      "kcal": 60,
      "protein": 0.82,
      "carbs": 14.98,
      "sugar": 13.66,
      "fat": 0.38,
      "saturated": 0.092,
      "fiber": 1.6,
      "vitaminA": 54,
      "vitaminC": 36.4,
      "vitaminE": 0.9,
      "vitaminK": 4.2,
      "vitaminB6": 0.12,
      "folate": 43,
      "calcium": 11,
      "iron": 0.16,
      "magnesium": 10,
      "phosphorus": 14,
      "potassium": 168,
      "copper": 0.11
    },
    "source": "USDA FoodData Central · generischer Durchschnittswert, nicht produktspezifisch",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "carotenoids_present_not_quantified"
    },
    "recipeNote": "Reifes Fruchtfleisch ohne Schale und Stein. Nicht mit getrockneter Mango verwechseln.",
    "aliases": [
      "Frische Mango",
      "Mango roh"
    ],
    "preparation": "raw"
  },
  {
    "id": "mandarin-fresh-20261115",
    "emoji": "🍊",
    "title": "Mandarine · frisch",
    "group": "Snacks",
    "defaultAmount": "1 Mandarine (ca. 90 g essbar)",
    "defaultQuantity": 90,
    "unit": "g",
    "nutrients": {
      "kcal": 53,
      "protein": 0.81,
      "carbs": 13.34,
      "sugar": 10.58,
      "fat": 0.31,
      "saturated": 0.039,
      "fiber": 1.8,
      "vitaminA": 34,
      "vitaminC": 26.7,
      "vitaminE": 0.2,
      "vitaminB1": 0.058,
      "vitaminB6": 0.078,
      "folate": 16,
      "calcium": 37,
      "iron": 0.15,
      "magnesium": 12,
      "phosphorus": 20,
      "potassium": 166
    },
    "source": "USDA FoodData Central · generischer Durchschnittswert, nicht produktspezifisch",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "citrus_flavanones_possible_not_quantified"
    },
    "recipeNote": "Geschält, essbare Segmente. Sorte und Größe variieren.",
    "aliases": [
      "Mandarine 1 Stück",
      "Tangerine"
    ],
    "preparation": "raw"
  },
  {
    "id": "dragon-fruit-fresh-20261115",
    "emoji": "🐉",
    "title": "Drachenfrucht (Pitaya) · frisch",
    "group": "Snacks",
    "defaultAmount": "1 Drachenfrucht (ca. 200 g essbar)",
    "defaultQuantity": 200,
    "unit": "g",
    "nutrients": {
      "kcal": 60,
      "protein": 1.2,
      "carbs": 13,
      "sugar": 7.7,
      "fat": 0.1,
      "fiber": 3,
      "vitaminC": 3,
      "calcium": 18,
      "iron": 0.7,
      "magnesium": 18,
      "phosphorus": 36,
      "potassium": 125
    },
    "source": "Generische Pitaya-Kompositionsschätzung · Sorte/Schalenanteil unsicher",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "pigments_present_not_quantified"
    },
    "recipeNote": "Grober Sortenmittelwert, Unterschiede zwischen rotem/weißem Fruchtfleisch und Quellen erheblich. Mikronährstoffe ohne belastbare Basis fehlen; kein Vitamin-B12-Wert erfunden.",
    "aliases": [
      "Pitaya",
      "Dragonfruit",
      "Drachen Frucht"
    ],
    "preparation": "raw"
  },
  {
    "id": "pomelo-fresh-20261115",
    "emoji": "🍈",
    "title": "Pomelo · frisch",
    "group": "Snacks",
    "defaultAmount": "½ Pomelo (ca. 250 g Fruchtfleisch)",
    "defaultQuantity": 250,
    "unit": "g",
    "nutrients": {
      "kcal": 38,
      "protein": 0.76,
      "carbs": 9.62,
      "sugar": 6,
      "fat": 0.04,
      "fiber": 1,
      "vitaminC": 61,
      "vitaminB1": 0.034,
      "vitaminB2": 0.027,
      "niacin": 0.22,
      "vitaminB6": 0.036,
      "calcium": 4,
      "iron": 0.11,
      "magnesium": 6,
      "phosphorus": 17,
      "potassium": 216
    },
    "source": "USDA FoodData Central · generischer Durchschnittswert, nicht produktspezifisch",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "citrus_flavanones_possible_not_quantified"
    },
    "recipeNote": "Standard = ½ große Pomelo, nur Fruchtfleisch ohne dicke Schale/Membran. 1 ganze Pomelo = 500 g essbar als vorläufige Schätzung.",
    "aliases": [
      "Pomelo halb",
      "Halbe Pomelo",
      "Ganze Pomelo"
    ],
    "preparation": "raw"
  },
  {
    "id": "pomegranate-fresh-20261115",
    "emoji": "🔴",
    "title": "Granatapfel · Kerne frisch",
    "group": "Snacks",
    "defaultAmount": "1 Granatapfel (ca. 170 g Kerne)",
    "defaultQuantity": 170,
    "unit": "g",
    "nutrients": {
      "kcal": 83,
      "protein": 1.67,
      "carbs": 18.7,
      "sugar": 13.67,
      "fat": 1.17,
      "saturated": 0.12,
      "fiber": 4,
      "vitaminC": 10.2,
      "vitaminE": 0.6,
      "vitaminK": 16.4,
      "vitaminB1": 0.067,
      "vitaminB2": 0.053,
      "vitaminB6": 0.075,
      "folate": 38,
      "calcium": 10,
      "iron": 0.3,
      "magnesium": 12,
      "phosphorus": 36,
      "potassium": 236,
      "zinc": 0.35
    },
    "source": "USDA FoodData Central · Pomegranates raw, SR Legacy 09286",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "punicalagins_in_fruit_presence_not_quantified"
    },
    "recipeNote": "170 g Kerne pro Frucht als portionsbezogene Schätzung; bei großem Granatapfel mehr möglich. Keine direkte Anti-Aging-Wirkung ableitbar.",
    "aliases": [
      "Granatapfelkerne",
      "Pomegranate"
    ],
    "preparation": "raw"
  },
  {
    "id": "kiwi-green-fresh-20261115",
    "emoji": "🥝",
    "title": "Kiwi · grün, frisch",
    "group": "Snacks",
    "defaultAmount": "1 Kiwi (ca. 75 g essbar)",
    "defaultQuantity": 75,
    "unit": "g",
    "nutrients": {
      "kcal": 61,
      "protein": 1.14,
      "carbs": 14.66,
      "sugar": 8.99,
      "fat": 0.52,
      "saturated": 0.029,
      "fiber": 3,
      "vitaminC": 92.7,
      "vitaminE": 1.46,
      "vitaminK": 40.3,
      "vitaminB6": 0.063,
      "folate": 25,
      "calcium": 34,
      "iron": 0.31,
      "magnesium": 17,
      "phosphorus": 34,
      "potassium": 312
    },
    "source": "USDA FoodData Central · Kiwifruit green raw, generischer Durchschnitt",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "plant_compounds_present_not_quantified"
    },
    "recipeNote": "Grüne Kiwi, geschält; essbares Fruchtgewicht ca. 75 g. Gelbe Kiwi weicht teilweise erheblich ab.",
    "aliases": [
      "Kiwifrucht",
      "Kiwi grün"
    ],
    "preparation": "raw"
  },
  {
    "id": "avocado-fresh-20261115",
    "emoji": "🥑",
    "title": "Avocado · frisch",
    "group": "Snacks",
    "defaultAmount": "1 Avocado (ca. 140 g Fruchtfleisch)",
    "defaultQuantity": 140,
    "unit": "g",
    "nutrients": {
      "kcal": 160,
      "protein": 2,
      "carbs": 8.53,
      "sugar": 0.66,
      "fat": 14.66,
      "saturated": 2.13,
      "fiber": 6.7,
      "vitaminC": 10,
      "vitaminE": 2.07,
      "vitaminK": 21,
      "vitaminB1": 0.067,
      "vitaminB2": 0.13,
      "niacin": 1.74,
      "vitaminB6": 0.257,
      "folate": 81,
      "calcium": 12,
      "iron": 0.55,
      "magnesium": 29,
      "phosphorus": 52,
      "potassium": 485,
      "zinc": 0.64
    },
    "source": "USDA FoodData Central · generischer Durchschnittswert, nicht produktspezifisch",
    "dailyDozen": "fruit",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "plant_compounds_present_not_quantified"
    },
    "recipeNote": "Ohne Schale/Kern. Eher kalorienreich durch einfach ungesättigte Fette; Standard 140 g essbar. Kein Daily-Dozen-Nussbonus.",
    "aliases": [
      "Avocado ganz",
      "Avocado Fruchtfleisch"
    ],
    "preparation": "raw"
  },
  {
    "id": "sweet-potato-steamed-20261115",
    "emoji": "🍠",
    "title": "Süßkartoffel · gedämpfte Scheiben",
    "group": "Mahlzeiten",
    "defaultAmount": "1 Süßkartoffel (ca. 200 g gegart)",
    "defaultQuantity": 200,
    "unit": "g",
    "nutrients": {
      "kcal": 76,
      "protein": 1.37,
      "carbs": 17.72,
      "sugar": 5.74,
      "fat": 0.14,
      "saturated": 0.03,
      "fiber": 2.5,
      "vitaminA": 787,
      "vitaminC": 12.8,
      "vitaminE": 0.94,
      "vitaminK": 2.1,
      "vitaminB1": 0.056,
      "vitaminB2": 0.047,
      "niacin": 0.538,
      "vitaminB6": 0.165,
      "folate": 6,
      "calcium": 27,
      "iron": 0.72,
      "magnesium": 18,
      "phosphorus": 32,
      "potassium": 230,
      "zinc": 0.2,
      "manganese": 0.27
    },
    "source": "USDA FoodData Central · gekochte Süßkartoffel ohne Schale (Dämpfen angenähert)",
    "dailyDozen": "vegetables",
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "beta_carotene_present_not_quantified"
    },
    "recipeNote": "Dünne gedämpfte Scheiben ohne Öl. Die Tabelle für gekochte Süßkartoffel ist eine Annäherung für Dampfgaren; fertig gegartes essbares Gewicht.",
    "aliases": [
      "Süsskartoffel",
      "Sweet Potato gedämpft"
    ],
    "preparation": "steamed"
  },
  {
    "id": "calpis-kyohou-grape-diluted-20261115",
    "emoji": "🥤",
    "title": "Calpis Kyoho Traube · verdünnt 5:1",
    "group": "Getränke",
    "defaultAmount": "1 Glas (150 ml trinkfertig)",
    "defaultQuantity": 150,
    "unit": "ml",
    "nutrients": {
      "kcal": 49,
      "carbs": 12,
      "sugar": 11,
      "fat": 0,
      "saturated": 0,
      "salt": 0
    },
    "source": "Originaletikett · Nutzerfoto 15.11.2026, Nährwerte je 100 ml bei Verdünnung 5:1",
    "dailyDozen": null,
    "antiAgingEight": {
      "microbiome": "not_established",
      "xeno": "not_established"
    },
    "recipeNote": "Nährwertangaben für FERTIGES Getränk bei 5 Teilen Wasser zu 1 Teil Konzentrat laut Zubereitungstext, nicht für unverdünnten Sirup. 150 ml ergeben ca. 74 kcal und 16,5 g Zucker; Protein <0,75 g (Etikett <0,5 g je 100 ml), kein exakter Zahlenwert. Kein belegter Obstanteil als Daily-Dozen-Portion. Nicht deklarierte Mikronährstoffe bleiben unbekannt.",
    "aliases": [
      "Calpis Traube",
      "Calpis Kyoho",
      "カルピス",
      "Calpico"
    ],
    "preparation": "diluted"
  },
  {
    "id": "spelt-spaghetti-dry-20261115",
    "emoji": "🍝",
    "title": "Dinkel-Spaghetti · trocken",
    "group": "Mahlzeiten",
    "defaultAmount": "1 Portion (80 g trocken)",
    "defaultQuantity": 80,
    "unit": "g",
    "nutrients": {
      "kcal": 359,
      "protein": 12,
      "carbs": 73,
      "sugar": 3.4,
      "fat": 1.4,
      "saturated": 0.3,
      "fiber": 3.3,
      "salt": 0.03,
      "vitaminB1": 0.3,
      "vitaminB2": 0.05,
      "niacin": 3.3,
      "vitaminB6": 0.1,
      "folate": 35,
      "iron": 1.3,
      "magnesium": 40,
      "phosphorus": 150,
      "potassium": 160,
      "zinc": 1.3
    },
    "source": "Dinkel-Spaghetti trocken: Makros anhand EDEKA-Dinkelspaghetti (15.01.2026); Mikros grobe Getreide-Referenzwerte",
    "dailyDozen": null,
    "antiAgingEight": {
      "microbiome": "dietary_fiber",
      "xeno": "not_established"
    },
    "recipeNote": "Standard 80 g TROCKEN = ~200 g gekocht (Wasseraufnahme abhängig von Garzeit). Keine automatische Vollkorn-Gutschrift: gewöhnliche Dinkelspaghetti sind nicht zwingend Vollkorn. Soße/Öl separat erfassen; Mikros sind generische Näherungen.",
    "aliases": [
      "Spelt Spaghetti",
      "Dinkelpasta",
      "Dinkelnudeln"
    ],
    "preparation": "dry"
  }
]);
export const PLANT_FOODS_149=Object.freeze(PLANT_MENU_149.map(x=>Object.freeze({
 id:x.id,emoji:x.emoji,title:x.title,group:x.group,defaultAmount:x.defaultAmount,
 kcalLow:Math.round(x.nutrients.kcal*x.defaultQuantity/100),
 kcalHigh:Math.round(x.nutrients.kcal*x.defaultQuantity/100),
 aliases:x.aliases,recipeNote:x.recipeNote
})));
export const PLANT_PROFILES_149=Object.freeze(Object.fromEntries(PLANT_MENU_149.map(x=>[x.id,Object.freeze({
 name:x.title,reference:{amount:100,unit:x.unit},nutrients:x.nutrients,extra:x.id==='calpis-kyohou-grape-diluted-20261115'?{proteinLimit:{label:'Eiweiß: weniger als 0,5 g je 100 ml',value:null,unit:'g'}}:{},source:x.source,
 note:x.recipeNote,estimatedNutrients:x.id==='calpis-kyohou-grape-diluted-20261115'?[]:Object.keys(x.nutrients)
})])));
export const PLANT_DD_149=Object.freeze(Object.fromEntries(PLANT_MENU_149.map(x=>[x.id,Object.freeze({
 group:x.dailyDozen,portionG:x.defaultQuantity,unit:x.unit,antiAgingEight:x.antiAgingEight,
 preparation:x.preparation
})])));
const Q=Object.freeze(Object.fromEntries(PLANT_MENU_149.map(x=>[x.id,{quantity:x.defaultQuantity,unit:x.unit}])));
const normalize=s=>String(s??'').trim().toLocaleLowerCase('de-AT').replace('½','0,5').replace('¼','0,25');
export function plantPortion149(id,amount='',defaultAmount=''){
 const def=Q[id];if(!def)return null;
 const s=normalize(amount||defaultAmount).replace(/^1\s*\/\s*2\b/,'0,5');if(!s||s.startsWith('-'))return null;
 if(id==='calpis-kyohou-grape-diluted-20261115'&&/konzentrat|sirup|unverd[üu]nnt/.test(s))return null;
 const amountNumber=n=>Number(String(n).replace(',','.'));
 const grams=s.match(/^(\d+(?:[.,]\d+)?)\s*(g|gramm|ml|milliliter)\b/);
 let value=null;
 if(grams){
   const unit=grams[2].startsWith('m')?'ml':'g';
   if(unit!==def.unit)return null;
   value=amountNumber(grams[1]);
   if(id==='spelt-spaghetti-dry-20261115'&&/gekocht|gegart/.test(s))value/=2.5; // 200 g cooked ~= 80 g dry; user-adjustable approximation
 }else{
   const half=/^(?:halbe|halber|halbes|halb)\b/.test(s);
   const m=s.match(/^(\d+(?:[.,]\d+)?)\s*(?:ganze?\s+)?(?:stück(?:e)?|stueck(?:e)?|frucht|früchte|fruechte|mango|pomelo|brokkoli|kopf|maracuja|mandarine|kiwi|karotte|avocado|granatapfel|drachenfrucht|süßkartoffel|suesskartoffel|portion(?:en)?|glas|gläser|glaeser|tasse(?:n)?)\b/);
   if(half)value=id==='pomelo-fresh-20261115'?def.quantity:def.quantity*.5;
   else if(m)value=def.quantity*amountNumber(m[1])*(id==='pomelo-fresh-20261115'&&(/pomelo|st[üu]ck/.test(s))?2:1);
   else return null;
 }
 return Number.isFinite(value)&&value>0&&value<=5000?{grams:value,portions:value/def.quantity,unit:def.unit}:null;
}
