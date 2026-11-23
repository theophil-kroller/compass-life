/** Compass Life 0.5.91.67 · Wiederverwendbare Take-away-Nudelbox mit Gemüse und Currysoße.
 * SCHÄTZUNG, NICHT GEWOGEN: weder Gericht noch Sauce wurden analysiert.
 * Die Nudelsorte sowie Zutaten der Currysoße (insbesondere Fischsauce) sind
 * unbekannt. Die generische Nudelreferenz ist lediglich ein Ei-Nudel-Proxy;
 * damit wird KEIN tatsächlicher Eigehalt behauptet. Keine automatischen Logs.
 */
export const TAKEAWAY_NOODLE_BOX_ID_167='takeaway-noodle-box-vegetable-thai-curry-20261123';

export const TAKEAWAY_NOODLE_BOX_ASSUMPTIONS_167=Object.freeze({
 servingGrams:550,servingsPerBox:1,meal:'Mittagessen',vegetablesGrams:130,
 ingredients:Object.freeze([
  Object.freeze({name:'Nudeln, verzehrfertig (Weizen/Ei-Nudeln nur als Nährwert-Proxy)',grams:300,verified:false}),
  Object.freeze({name:'Gemüsemischung (z. B. Karotte, Kraut, Paprika, Zwiebel)',grams:130,verified:false}),
  Object.freeze({name:'Thai-Curry-Soße (Kokos-/Curry-Proxy, Art unbekannt)',grams:105,verified:false}),
  Object.freeze({name:'Bratöl (aufgenommen)',grams:15,verified:false})
 ]),
 noMeatOrTofuModelled:true,
 noodleTypeUnconfirmed:true,
 curryTypeUnconfirmed:true,
 fishSauceCannotBeRuledOut:true,
 plausibleKcalRange:[550,950]
});

/** Generische Orientierungswerte pro 100 g. Egg noodles (cooked, USDA FDC
 * 168926) is an imperfect NOODLE NUTRIENT PROXY, not proof of egg contents.
 * Vegetables, curry sauce and cooking oil are rough recipe models. Actual
 * sodium, vitamins, added oil and fat quality can differ substantially.
 * Units follow Compass nutrition-intelligence: mg minerals, µg folate etc.
 */
export const TAKEAWAY_NOODLE_BOX_REFERENCES_167=Object.freeze({
 noodles:Object.freeze({kcal:138,protein:4.54,carbs:25.16,sugar:0.4,fat:2.07,saturated:0.42,fiber:1.2,sodium:5,calcium:12,magnesium:21,potassium:38,phosphorus:76,iron:0.8,zinc:0.5,selenium:23.9,folate:13}),
 vegetables:Object.freeze({kcal:35,protein:1.8,carbs:6.7,sugar:3.3,fat:0.35,saturated:0.06,fiber:2.4,sodium:40,calcium:35,magnesium:17,potassium:200,phosphorus:39,iron:0.6,folate:30,vitaminC:20,vitaminA:120,vitaminB6:0.12}),
 currySauce:Object.freeze({kcal:140,protein:1.5,carbs:8.5,sugar:4,fat:11.4,saturated:7.3,fiber:0.5,sodium:850,calcium:18,magnesium:25,potassium:180,phosphorus:30,iron:0.5,folate:5,vitaminC:2,vitaminB6:0.04}),
 oil:Object.freeze({kcal:900,protein:0,carbs:0,sugar:0,fat:100,saturated:9.5,fiber:0,sodium:0})
});

function summedNutrients(){
 const out={};
 for(const [key,mass] of [['noodles',300],['vegetables',130],['currySauce',105],['oil',15]]){
  for(const [k,v] of Object.entries(TAKEAWAY_NOODLE_BOX_REFERENCES_167[key]))out[k]=(out[k]||0)+mass*v/100;
 }
 out.salt=(out.sodium||0)*2.5/1000;
 return Object.freeze(Object.fromEntries(Object.entries(out).map(([k,v])=>[k,Math.round(v*1000)/1000])));
}
export const TAKEAWAY_NOODLE_BOX_NUTRIENTS_167=summedNutrients();

const recipeNote='GROBE IMBISS-SCHÄTZUNG vom 23.11.2026; weder gewogen noch durch Herstelleretikett belegt. 1 klassische Box ≈ 550 g: 300 g gekochte Nudeln, 130 g gemischtes Gemüse, 105 g Thai-Curry-Soße und ca. 15 g beim Braten aufgenommenes Öl. Currysoße nur vermutet; Kokosmilch-/Gewürz-/Salzanteil unbekannt. Die Nudelsorte wurde nicht bestätigt; generische gegarte Ei-Nudeln dienen ausschließlich als Nährwert-Proxy (keine Behauptung, dass Eier enthalten sind). Auch Fischsoße ist nicht auszuschließen: NICHT als gesichert vegetarisch oder vegan behandeln. Kein Fleisch, Tofu oder zusätzliches Topping eingerechnet. 742 kcal ist ein Rechenmittelpunkt; je nach Boxgröße, Öl und Soße sind grob 550–950 kcal plausibel. ALLE Makro- und Mikronährstoffe inklusive Salz geschätzt. Kein bestätigtes Vollkorn; Gemüsemenge geschätzt (~130 g), weder Kreuzblütler noch Gewürzportionen gesondert belegt. Bei größerer/kleinerer Box Portionsmenge ändern; für exaktes Öl/Sauce/Nudelsorte Rezept aktualisieren.';
export const TAKEAWAY_NOODLE_BOX_FOOD_167=Object.freeze({
 id:TAKEAWAY_NOODLE_BOX_ID_167,emoji:'🍜',
 title:'Nudelbox vom Chinesen · Gemüse & Thai-Curry-Soße (geschätzt)',
 group:'Mahlzeiten',defaultAmount:'1 Box (ca. 550 g)',
 kcalLow:Math.round(TAKEAWAY_NOODLE_BOX_NUTRIENTS_167.kcal),
 kcalHigh:Math.round(TAKEAWAY_NOODLE_BOX_NUTRIENTS_167.kcal),
 recipeNote,
 aliases:['Nudelbox','Asia Nudelbox','Chinesische Nudelbox','Gebratene Nudeln mit Gemüse','Gemüsenudeln Thai-Curry','Thai Curry Nudeln','Nudeln vom Chinesen','Asiabox Curry']
});
export const TAKEAWAY_NOODLE_BOX_PROFILE_167=Object.freeze({
 name:TAKEAWAY_NOODLE_BOX_FOOD_167.title,
 reference:{amount:550,unit:'g'},nutrients:TAKEAWAY_NOODLE_BOX_NUTRIENTS_167,
 source:'Rezept-/Portionsschätzung nach Nutzerbeschreibung 23.11.2026; USDA FDC 168926 als ungefähre gekochte Nudelreferenz; Curry-/Gemüse-/Ölwerte generische Annahmen, keine Etikettwerte',
 extra:{},note:recipeNote,
 estimatedNutrients:Object.keys(TAKEAWAY_NOODLE_BOX_NUTRIENTS_167)
});
export const TAKEAWAY_NOODLE_BOX_RECIPE_167=Object.freeze({
 recipeIngredients:TAKEAWAY_NOODLE_BOX_ASSUMPTIONS_167.ingredients,
 baseServingGrams:550,servings:1,estimated:true,curryUnconfirmed:true,
 probableRangeKcal:TAKEAWAY_NOODLE_BOX_ASSUMPTIONS_167.plausibleKcalRange
});

export function noodleBoxPortion167(input,defaultAmount=''){
 const s=String(input||defaultAmount||'1 Box (ca. 550 g)').trim().toLocaleLowerCase('de-AT').replace(/,/g,'.');
 const g=s.match(/^(\d+(?:\.\d+)?)\s*(?:g|gramm)\b/);
 const units=s.match(/^(\d+(?:\.\d+)?)\s*(?:box(?:en)?|nudelbox(?:en)?|portion(?:en)?|schachtel(?:n)?|paket(?:e)?|becher)\b/);
 const half=/^(?:½|halb(?:e|er|es)?)\s*(?:box|nudelbox|portion)\b/.test(s);
 const factor=g?Number(g[1])/550:units?Number(units[1]):half?0.5:null;
 if(!Number.isFinite(factor)||factor<=0||factor>5000/550)return null;
 return {grams:factor*550,portions:factor};
}
