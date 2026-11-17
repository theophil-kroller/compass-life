/** Compass 0.5.91.55 · new complete-cup presets from customer photographed labels (17 Nov 2026).
 * Dairy micronutrients below are reference-composition approximations, marked estimated;
 * daily dozen / anti-aging boxes are not attributed to flavored dairy desserts.
 * Profiles preserve original raw label macros and package sizes separately.
 */
const cups=[
 {
  id:'dr-oetker-high-protein-milchreis-zimt-400g',emoji:'🍚',
  title:'Dr. Oetker High Protein Milchreis · Zimt',grams:400,
  nutrients:{kcal:92,protein:7.6,carbs:12,sugar:4.5,fat:1.5,saturated:1.0,salt:0.22},
  // Approximate typical dairy-dessert micronutrients; none are claimed as manufacturer data.
  micros:{calcium:110,phosphorus:140,potassium:135,magnesium:11,vitaminB2:0.17,vitaminB12:0.6,sodium:88},
  aliases:['Dr Oetker Protein Milchreis','High Protein Milchreis Zimt','Protein Milchreis'],
 },
 {
  id:'billa-high-protein-griesspudding-zimt-500g',emoji:'🍮',
  title:'BILLA High Protein Grießpudding · Zimt',grams:500,
  nutrients:{kcal:79,protein:7.6,carbs:8.6,sugar:4.7,fat:1.5,saturated:1.0,salt:0.13},
  micros:{calcium:110,phosphorus:145,potassium:135,magnesium:11,vitaminB2:0.17,vitaminB12:0.6,sodium:52},
  aliases:['Billa 38 Protein','Billa Protein Griesspudding','Zimt Grießpudding'],
 },
 {
  id:'noem-pro20-topfencreme-blueberry-cheesecake-235g',emoji:'🫐',
  title:'nöm PRO 20 Topfencreme · Blueberry Cheesecake',grams:235,
  // Fat <0.5 g/100 g is a maximum, not a reported exact number.
  nutrients:{kcal:52,protein:8.4,carbs:4.0,sugar:3.3,fat:0.25,saturated:0.1,salt:0.10},
  micros:{calcium:105,phosphorus:160,potassium:140,magnesium:12,vitaminB2:0.21,vitaminB12:0.7,sodium:40},
  aliases:['Nöm PRO 20 Blueberry Cheesecake','nöm Topfencreme Heidelbeere','NÖM 20 Protein'],
  upperBounds:{fat:0.5}
 }
];
export const PROTEIN_CUP_FOODS_155=Object.freeze(cups.map(x=>Object.freeze({
 id:x.id,emoji:x.emoji,title:x.title,group:'Snacks',
 defaultAmount:`1 Becher (${x.grams} g)`,kcalLow:Math.round(x.grams*x.nutrients.kcal/100),kcalHigh:Math.round(x.grams*x.nutrients.kcal/100),
 aliases:x.aliases,recipeNote:'Originaletikett · 1 ganzer Becher als Standardportion; Menge bei Bedarf anpassen. Mikronährstoffe als Referenzwerte ergänzt. Bei nöm Fett <0,5 g/100 g: für Berechnungen 0,25 g/100 g angesetzt.'
})));
export const PROTEIN_CUP_GRAMS_155=Object.freeze(Object.fromEntries(cups.map(x=>[x.id,x.grams])));
export const PROTEIN_CUP_PROFILES_155=Object.freeze(Object.fromEntries(cups.map(x=>[x.id,{
 name:x.title,reference:{amount:100,unit:'g'},
 nutrients:{...x.nutrients,...x.micros},
 source:'Herstelleretikett · Nutzerfotos 17.11.2026; Mikronährstoffe: generische Milchprodukt-Referenzwerte',
 extra:{upperBounds:x.upperBounds||{},dailyDozen:[],antiAgingEight:{credited:[]}},
 note:'Milchhaltiges Dessert mit hohem Proteingehalt. Frucht-/Getreidezutaten begründen ohne belegte Vollkorn-/Beerenportion keine Daily-Dozen-Gutschrift.',
 estimatedNutrients:[...Object.keys(x.micros),...(x.upperBounds?Object.keys(x.upperBounds):[])],
 ...(x.upperBounds?{upperBounds:x.upperBounds}:{})
}])));
