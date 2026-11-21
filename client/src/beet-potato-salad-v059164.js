/** Compass Life 0.5.91.64 — user-described beet/potato/feta salad (21 Nov 2026).
 * WHOLE DISH: 1145 g estimated; standard logged portion = HALF: 572.5 g.
 * Nutrient totals were calculated from approximate ingredient masses and generic composition tables.
 * These are NOT measured values, and no actual Schafkäse label was provided.
 */
export const BEET_SALAD_164 = Object.freeze({
  "id": "homemade-beet-potato-sheep-cheese-salad-20261121",
  "title": "Rote-Rüben-Kartoffelsalat mit Schafkäse, schwarzem Sesam & Kürbiskernöl",
  "batchGrams": 1145,
  "portionGrams": 572.5,
  "servings": 2,
  "ingredients": [
    {
      "name": "Kartoffeln, mit Schale gedämpft",
      "gramsBatch": 480,
      "measured": false
    },
    {
      "name": "Rote Rüben, roh, gerieben",
      "gramsBatch": 300,
      "measured": false
    },
    {
      "name": "Karotte, roh, gerieben",
      "gramsBatch": 50,
      "measured": false
    },
    {
      "name": "Schafkäse in Salzlake (Hofer; Sorte nicht bestätigt)",
      "gramsBatch": 180,
      "measured": false
    },
    {
      "name": "Schwarzer Sesam, ganze Samen",
      "gramsBatch": 40,
      "measured": false
    },
    {
      "name": "Kürbiskerne, getrocknet",
      "gramsBatch": 20,
      "measured": false
    },
    {
      "name": "Kürbiskernöl (2 EL)",
      "gramsBatch": 27,
      "measured": false
    },
    {
      "name": "Sojasauce (1 EL)",
      "gramsBatch": 15,
      "measured": false
    },
    {
      "name": "Essig (1 EL)",
      "gramsBatch": 15,
      "measured": false
    },
    {
      "name": "Ahornsirup (kleiner Schuss)",
      "gramsBatch": 10,
      "measured": false
    },
    {
      "name": "Rosmarin, frisch",
      "gramsBatch": 2,
      "measured": false
    },
    {
      "name": "Zitronenschale, frisch",
      "gramsBatch": 2,
      "measured": false
    },
    {
      "name": "Koriandersamen, ganz",
      "gramsBatch": 3,
      "measured": false
    },
    {
      "name": "Kala Namak, Prise",
      "gramsBatch": 1,
      "measured": false
    }
  ],
  "assumptions": "Alles geschätzt, nicht abgewogen. 8 kleine gedämpfte Kartoffeln mit Schale ≈ 480 g, 2 mittelgroße rohe rote Rüben ≈ 300 g; halbe Karotte ≈ 50 g; eine Packung Hofer Schafkäse ≈ 180 g (Packungsgröße nicht bestätigt); ein Schöpfer schwarzer Sesam ≈ 40 g, Kürbiskerne ≈ 20 g, Kürbiskernöl 2 EL ≈ 27 g. Übrige Mengen laut Liste. Die tatsächliche Portion kann von 572,5 g abweichen.",
  "sources": [
    "Nutzer-Rezept 21.11.2026",
    "Indikative USDA-ähnliche Lebensmittelzusammensetzung je 100 g; keine Analyse",
    "Hofer SALAKIS Schafkäse 180-g-Produkt als mögliche, nicht bestätigte Packungsgröße https://www.hofer.at/produkt/salakis-schafkaese-standard-000000000111203002"
  ],
  "notes": [
    "Schafkäse, Sesam und Öl bestimmen einen großen Teil der Energie; Schafkäse-Variante und Größe unbekannt.",
    "Rote Rüben und Karotte werden roh verarbeitet, Kartoffeln mit Schale gedämpft; keine zusätzlichen Kochverluste für Vitamine modelliert.",
    "Sesam-Calcium aus ganzen Samen hat geringere/variable Bioverfügbarkeit; keine Aussage über absorbierbare Menge.",
    "Rote Rüben enthalten Betalaine, Pflanzenstoffe nicht beziffert; kein garantierter Anti-Aging-Effekt.",
    "Salzgehalt aus geschätztem Schafkäse, Sojasauce und Kala Namak stark unsicher."
  ]
});
export const BEET_SALAD_ID_164 = BEET_SALAD_164.id;
export const BEET_SALAD_NUTRIENTS_164 = Object.freeze({
  "kcal": 838.625,
  "protein": 28.109,
  "carbs": 77.892,
  "sugar": 17.865,
  "fat": 48.169,
  "saturated": 17.453,
  "fiber": 13.115,
  "calcium": 705.82,
  "magnesium": 249.06,
  "potassium": 1777.51,
  "phosphorus": 726.75,
  "iron": 6.8,
  "zinc": 6.316,
  "vitaminC": 32.325,
  "vitaminB6": 0.989,
  "folate": 247.34,
  "vitaminB1": 0.445,
  "salt": 4.178,
  "vitaminA": 321.25,
  "vitaminK": 4.03,
  "vitaminB12": 1.53,
  "vitaminB2": 0.756
});
export const BEET_SALAD_FOOD_164 = Object.freeze({
 id: BEET_SALAD_ID_164, emoji:'🥗', title:BEET_SALAD_164.title, group:'Mahlzeiten',
 defaultAmount:'1 Portion (ca. 573 g; ½ Rezept)',
 kcalLow:Math.round(BEET_SALAD_NUTRIENTS_164.kcal),kcalHigh:Math.round(BEET_SALAD_NUTRIENTS_164.kcal),
 recipeNote:'GROBE REZEPTSCHÄTZUNG vom 21.11.2026 · 1 Portion = die Hälfte des gesamten Salats (ca. 573 g). 8 kleine Kartoffeln mit Schale, 2 Rote Rüben, Karotte, 1 Packung Hofer Schafkäse, schwarzer Sesam, Kürbiskerne, 2 EL Kürbiskernöl, Sojasauce, Essig, Kala Namak, Ahornsirup, frischer Rosmarin, Zitronenschale und Koriandersamen. Angenommen: 480 g Kartoffeln, 300 g Rüben, 50 g Karotte, 180 g Schafkäse, 40 g Sesam, 20 g Kürbiskerne, 27 g Öl. Mikronährstoffe und Salz nur aus Standardwerten geschätzt, nicht aus Etiketten; Sesam-Calcium ist nicht gleich absorbiertes Calcium. Daily Dozen: Gemüse aus Rüben/Karotte, Nüsse/Samen aus Sesam/Kürbiskernen, Kräuter/Gewürze anteilig; Kartoffeln zählen nicht als Vollkorn. Anti-Aging Eight: Nuss-/Samenhinweis, keine medizinische Prognose.',
 aliases:['Rote Rüben Kartoffelsalat','Rote-Rüben-Kartoffel-Salat','Rote Beete Kartoffelsalat','Kartoffelsalat mit Schafkäse und Sesam','Schwarzer Sesam Salat','Rote-Rüben-Salat mit Feta','Beetroot Potato Salad']
});
export const BEET_SALAD_PROFILE_164 = Object.freeze({
 name: BEET_SALAD_164.title,
 reference:{amount:BEET_SALAD_164.portionGrams,unit:'g'},
 nutrients:BEET_SALAD_NUTRIENTS_164,
 source:'Grobe Rezeptschätzung 21.11.2026 · geschätzte Zutatenmengen + typische Nährwerte, keine Messung/kein Produktetikett',
 extra:{},
 note:BEET_SALAD_164.assumptions+' '+BEET_SALAD_164.notes.join(' '),
 estimatedNutrients:Object.keys(BEET_SALAD_NUTRIENTS_164)
});
/** Parse either grams, number of portions (half a recipe each), or whole/half batch. */
export function beetSaladPortion164(value, fallback=BEET_SALAD_FOOD_164.defaultAmount){
 const a=String(value||fallback||'').trim().toLocaleLowerCase('de-AT').replace(',', '.');
 if(!a||a.startsWith('-'))return null;
 const m=a.match(/^(\d+(?:\.\d+)?)\s*(?:g|gramm)\b/);
 const serving=a.match(/^(\d+(?:\.\d+)?)\s*portion(?:en)?\b/);
 const batch=a.match(/^(\d+(?:\.\d+)?)\s*(?:rezept(?:e)?|gesamtes?\s*rezept|ganze[rns]?\s*menge)\b/);
 const half=/^(?:½|halbe|halb(?:es)?)\s*(?:portion|rezept|menge)\b/.test(a);
 const quarter=/^(?:¼|viertel)\s*rezept\b/.test(a);
 const number=m?Number(m[1]):serving?Number(serving[1])*BEET_SALAD_164.portionGrams:batch?Number(batch[1])*BEET_SALAD_164.batchGrams:quarter?BEET_SALAD_164.batchGrams/4:half?(a.includes('portion')?BEET_SALAD_164.portionGrams/2:BEET_SALAD_164.batchGrams/2):null;
 return Number.isFinite(number)&&number>0&&number<=5000?{grams:number,portions:number/BEET_SALAD_164.portionGrams}:null;
}
