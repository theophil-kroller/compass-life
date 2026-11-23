/** Compass Life 0.5.91.66 · Hirse-Ei-Auflauf mit sehr wenig Dattelsirup.
 * USER RECIPE IS NOT WEIGHED OR VERIFIED. Base recipe explicitly excludes fruit.
 * Alternative breakfast variant includes 100 g pear added at serving; it is not
 * claimed to be in the gifted original casserole.
 * All macro/micronutrient estimates use generic FOOD COMPOSITION REFERENCES,
 * not product labels or measured laboratory values.
 */
export const MILLET_BAKE_ID_166='homemade-millet-egg-bake-little-date-syrup-20261123';
export const MILLET_BAKE_PEAR_ID_166='homemade-millet-egg-bake-pear-breakfast-20261123';

// Illustrative batch: 500g millet cooked in water + 3 medium eggs (150g edible)
// + 10g date syrup = 660g cooked mixture; cut into 4x 165g portions.
// Fruit variant adds 100g fresh pear to one 165g base portion.
export const MILLET_BAKE_ASSUMPTIONS_166=Object.freeze({
 batchGrams:660,servings:4,baseServingGrams:165,pearGramsPerServing:100,pearServingGrams:265,
 ingredients:Object.freeze([
  Object.freeze({name:'Hirse, in Wasser gekocht',grams:500,verified:false,note:'etwa 170g trockene Hirse nur Ertragsannahme; ganze Hirsekörner/ganze Hirse angenommen'}),
  Object.freeze({name:'Eier, ganz (ohne Schale)',grams:150,count:3,verified:false}),
  Object.freeze({name:'Dattelsirup',grams:10,verified:false,note:'wenig Sirup; 10g pro Gesamtauflauf als Schätzannahme'})
 ]),
 optionalFruit:Object.freeze({name:'Birne, frisch, essbarer Anteil',grams:100,verified:false,note:'nur in Frühstücksvariante; nicht als Bestandteil des geschenkten Originals behauptet'}),
 noAddedFatOrMilkAssumed:true
});
/** Reference inputs per 100 g, approximate. USDA SR Legacy: cooked millet FDC
 * 168871; raw whole egg FDC 171287; raw pear FDC 169118. Date syrup uses
 * generic 280 kcal / 70 g carbohydrates per 100 g, not a specific label.
 * Key names follow Compass nutrition-intelligence nutrient dictionary.
 */
const REFERENCE_166=Object.freeze({
 millet:Object.freeze({kcal:119,protein:3.51,carbs:23.67,sugar:0.13,fat:1.0,saturated:0.19,fiber:1.3,sodium:2,calcium:3,magnesium:44,potassium:62,phosphorus:100,iron:0.63,zinc:0.91,manganese:0.272,vitaminB1:0.106,vitaminB6:0.108,folate:19}),
 egg:Object.freeze({kcal:143,protein:12.56,carbs:0.72,sugar:0.37,fat:9.51,saturated:3.13,fiber:0,sodium:142,calcium:56,magnesium:12,potassium:138,phosphorus:198,iron:1.75,zinc:1.29,selenium:30.7,vitaminB2:0.457,vitaminB6:0.17,vitaminB12:0.89,vitaminD:2,folate:47,choline:294}),
 syrup:Object.freeze({kcal:280,protein:0,carbs:70,sugar:65,fat:0,saturated:0,fiber:0,sodium:0}),
 pear:Object.freeze({kcal:57,protein:0.36,carbs:15.23,sugar:9.75,fat:0.14,saturated:0.022,fiber:3.1,sodium:1,calcium:9,magnesium:7,potassium:116,phosphorus:12,iron:0.18,zinc:0.1,vitaminC:4.3,vitaminB6:0.029,folate:7})
});
const sumIngredient=(parts)=>{
 const out={};for(const [profile,grams] of parts){
  for(const [k,value] of Object.entries(profile))out[k]=(out[k]||0)+value*grams/100;
 }
 // Source profiles contain sodium in milligrams; convert to grams of salt.
 out.salt=(out.sodium||0)*2.5/1000;
 return Object.freeze(Object.fromEntries(Object.entries(out).map(([k,v])=>[k,Math.round(v*1000)/1000])));
};
const a=MILLET_BAKE_ASSUMPTIONS_166;
const baseBatch=sumIngredient([[REFERENCE_166.millet,500],[REFERENCE_166.egg,150],[REFERENCE_166.syrup,10]]);
export const MILLET_BAKE_NUTRIENTS_166=Object.freeze(Object.fromEntries(Object.entries(baseBatch).map(([k,v])=>[k,Math.round(v*1000/a.servings)/1000])));
export const MILLET_BAKE_PEAR_NUTRIENTS_166=sumIngredient([[MILLET_BAKE_NUTRIENTS_166,100],[REFERENCE_166.pear,100]]); // base profile is per portion: 100 pseudo-units = 1 portion

const batchNote='REZEPTANNAHME, nicht gewogen: gesamter Auflauf ca. 500 g gekochte Hirse (ungefähr 170 g trocken, Ausbeute unsicher), 3 Eier (150 g essbar), 10 g Dattelsirup, ohne Milch oder zusätzliches Fett. Vier Portionen à 165 g angenommen. Die tatsächliche Rezeptur und Portionsgröße sind unbekannt; alle Makros/Mikros sind geschätzt. Die Mikronährstoffe basieren auf generischen Zutatenwerten (USDA FoodData Central; Dattelsirup grober Richtwert). Hirse als ganzes Korn angenommen; bitte auf Vollkornqualität prüfen. Eier zählen nicht als Daily Dozen, zugesetzter Dattelsirup ebenfalls nicht.';
const pearNote='FRÜHSTÜCKSOPTION, nicht im Originalrezept bestätigt: 1 Portion des Hirse-Ei-Auflaufs (165 g) plus 100 g frische Birne. Birne wird ausschließlich in dieser Variante mitgezählt. Bitte bei anderer Frucht/Menge korrigieren oder den Auflauf und das echte Obst separat buchen.';
export const MILLET_BAKE_FOODS_166=Object.freeze([
 Object.freeze({id:MILLET_BAKE_ID_166,emoji:'🌾',title:'Hirse-Ei-Auflauf · wenig Dattelsirup (hausgemacht)',group:'Frühstück',defaultAmount:'1 Portion (ca. 165 g)',kcalLow:Math.round(MILLET_BAKE_NUTRIENTS_166.kcal),kcalHigh:Math.round(MILLET_BAKE_NUTRIENTS_166.kcal),recipeNote:batchNote,aliases:['Hirse Auflauf','Hirseauflauf','Hirse-Ei-Auflauf','Hirse Eier Dattelsirup','Hirseauflauf Freundin']}),
 Object.freeze({id:MILLET_BAKE_PEAR_ID_166,emoji:'🍐',title:'Hirse-Ei-Auflauf mit Birne · Frühstück',group:'Frühstück',defaultAmount:'1 Portion (ca. 265 g; mit 100 g Birne)',kcalLow:Math.round(MILLET_BAKE_PEAR_NUTRIENTS_166.kcal),kcalHigh:Math.round(MILLET_BAKE_PEAR_NUTRIENTS_166.kcal),recipeNote:batchNote+' '+pearNote,aliases:['Hirseauflauf Birne','Hirse mit Birnen','Millet Egg Pear Bake','Hirse Frühstück mit Obst']})
]);
const makeProfile=(id,name,grams,nutrients,note)=>Object.freeze({name,reference:{amount:grams,unit:'g'},nutrients,source:'Rezeptschätzung aus Nutzerangabe 23.11.2026; USDA FoodData Central: cooked millet 168871, egg 171287, pear 169118; Sirup ohne Produktetikett',extra:{},note,estimatedNutrients:Object.keys(nutrients)});
export const MILLET_BAKE_PROFILES_166=Object.freeze({
 [MILLET_BAKE_ID_166]:makeProfile(MILLET_BAKE_ID_166,MILLET_BAKE_FOODS_166[0].title,165,MILLET_BAKE_NUTRIENTS_166,batchNote),
 [MILLET_BAKE_PEAR_ID_166]:makeProfile(MILLET_BAKE_PEAR_ID_166,MILLET_BAKE_FOODS_166[1].title,265,MILLET_BAKE_PEAR_NUTRIENTS_166,batchNote+' '+pearNote)
});
export const MILLET_BAKE_RECIPE_166=Object.freeze({
 [MILLET_BAKE_ID_166]:Object.freeze({recipeIngredients:[...a.ingredients],batchGrams:a.batchGrams,servings:a.servings,baseServingGrams:a.baseServingGrams,estimated:true}),
 [MILLET_BAKE_PEAR_ID_166]:Object.freeze({recipeIngredients:[...a.ingredients,a.optionalFruit],baseServingGrams:a.baseServingGrams,pearGrams:a.pearGramsPerServing,referenceGrams:a.pearServingGrams,estimated:true,optionalFruit:true})
});
const positive=x=>Number.isFinite(x)&&x>0&&x<=5000;
export function milletBakePortion166(id,input,defaultAmount=''){
 if(id!==MILLET_BAKE_ID_166&&id!==MILLET_BAKE_PEAR_ID_166)return null;
 const base=id===MILLET_BAKE_ID_166?165:265;
 const s=String(input||defaultAmount||(id===MILLET_BAKE_ID_166?'1 Portion (165 g)':'1 Portion (265 g)')).trim().toLocaleLowerCase('de-AT').replace(/,/g,'.');
 const grams=s.match(/^(\d+(?:\.\d+)?)\s*(?:g|gramm)\b/);
 const number=s.match(/^(\d+(?:\.\d+)?)\s*(?:portion(?:en)?|st[üu]ck(?:e)?|scheibe(?:n)?|stueck(?:e)?)\b/);
 const half=/^(?:½|halb(?:e|es|er)?)\s*(?:portion|st[üu]ck|scheibe|stueck)\b/.test(s);
 const mass=grams?Number(grams[1]):number?Number(number[1])*base:half?base/2:null;
 return positive(mass)?{grams:mass,portions:mass/base}:null;
}
