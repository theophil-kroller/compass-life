/** Compass 0.5.77.37 · Personal recipes, individually adjustable gram portions.
 * Nutrition data are generic food-composition references, never a claimed Hofer-label analysis.
 * An unrecorded optional ingredient is initialized at 0g for this SPECIFIC recipe only.
 * No missing micronutrient or fatty acid is implicitly zero.
 */
const ing=(id,label,grams,values,source='USDA FoodData Central · generisches Lebensmittel',optional=false)=>Object.freeze({id,label,grams,values,source,optional});
const RAW=Object.freeze({
 'salad-personal':{name:'Mein großer grüner Salat',icon:'🥗',ingredients:[
  ing('lettuce','Grüner Blattsalat',150,{kcal:15,protein:1.36,carbs:2.87,fiber:1.3,fat:.15,potassium:194,folate:38,vitaminC:9.2,vitaminK:126}),
  ing('pumpkin-oil','Steirisches Kürbiskernöl',10,{kcal:884,fat:100,saturated:18,mono:34,poly:48},'Generisches Kürbiskernöl · grobe Fettsäureprofil-Schätzung, Sorte variiert'),
  ing('balsamic','Balsamicoessig',15,{kcal:88,carbs:17,sugar:15,potassium:112},'USDA · Balsamico, generisch'),
  ing('soy','Sojasauce',10,{kcal:53,protein:8.1,carbs:4.9,salt:14},'USDA · generische Sojasauce; Salzgehalt stark markenabhängig'),
  ing('cumin','Kreuzkümmelsamen / Kumin',1,{kcal:375,protein:17.8,carbs:44.2,fiber:10.5,fat:22.3,iron:66.4},'USDA · Kreuzkümmel, ganze Samen'),
  ing('coriander','Koriandersamen',1,{kcal:298,protein:12.4,carbs:55,fiber:41.9,fat:17.8},'USDA · Koriandersamen'),
  ing('sesame','Schwarzer Sesam · 1 Schöpfer',15,{kcal:573,protein:17.73,carbs:23.45,fiber:11.8,fat:49.67,saturated:6.96,calcium:975,magnesium:351,iron:14.55},'USDA · Sesam, generisch; schwarzer Sesam kann abweichen'),
  ing('carrot','Karotten · bis zu 2 Stück',0,{kcal:41,protein:.93,carbs:9.58,fiber:2.8,fat:.24,vitaminA:835,potassium:320},'USDA · Karotte roh',true),
  ing('pepper','Roter Spitzpaprika',0,{kcal:31,protein:1,carbs:6,fiber:2.1,fat:.3,vitaminC:127.7},'USDA · rote Paprika roh (keine Spitzpaprika-Markendaten)',true),
  ing('peanuts','Gesalzene Erdnüsse · 1 Handvoll',20,{kcal:610,protein:25,carbs:10,fiber:8,fat:50,saturated:7,salt:1},'Compass · generisches Referenzprofil Hofer-Erdnüsse, Markenwert noch unbestätigt'),
  ing('avocado','Avocado',0,{kcal:160,protein:2,carbs:8.53,fiber:6.7,fat:14.66,saturated:2.13,potassium:485},'USDA · Avocado roh',true)
 ]},
 'bean-salad-personal':{name:'Mein Käferbohnensalat',icon:'🫘',ingredients:[
  ing('beans','Hofer Käferbohnen · 1 Dose, abgetropft',240,{kcal:95,protein:6.5,carbs:14,fiber:6.5,fat:.6},'Vorläufiges GENERISCHES gekochtes Bohnenprofil, nicht Hofer-Packung; Abtropfgewicht schätzen statt behaupten'),
  ing('garlic','Knoblauchpulver',1,{kcal:331,protein:16.6,carbs:72.7,fiber:9,fat:.73},'USDA · Knoblauchpulver'),
  ing('oregano','Oreganopulver',1,{kcal:265,protein:9,carbs:68.9,fiber:42.5,fat:4.3},'USDA · Oregano getrocknet'),
  ing('pumpkin-oil','Steirisches Kürbiskernöl',12,{kcal:884,fat:100,saturated:18,mono:34,poly:48},'Generisches Kürbiskernöl · Fettsäuren grob geschätzt'),
  ing('balsamic','Balsamicoessig',15,{kcal:88,carbs:17,sugar:15},'USDA · Balsamico, generisch'),
  ing('salt','Salz',.5,{salt:100},'Zugesetztes Speisesalz; Salz aus der Bohnenkonserve separat unbekannt')
 ]},
 'fried-egg-personal':{name:'Mein Spiegelei · Olivenöl, Kala Namak, Kurkuma, Chili',icon:'🍳',ingredients:[
  ing('egg','Hühnerei · 1 Stück ohne Schale',55,{kcal:143,protein:12.56,carbs:.72,fat:9.51,saturated:3.126,cholesterol:372,vitaminB12:.89,vitaminD:2,selenium:30.7},'USDA · ganzes rohes Ei; Fettaufnahme beim Braten hängt von Ölmenge ab'),
  ing('olive-oil','Natives Olivenöl extra · zum Braten',5,{kcal:884,fat:100,saturated:13.8,mono:73,poly:10.5,vitaminE:14.35},'USDA · Olivenöl; tatsächlich aufgenommenes Öl nicht gemessen'),
  ing('kala-namak','Kala Namak · 1 Prise',.3,{salt:100},'Speisesalz-Äquivalent als Schätzung; Kala Namak variabler Mineral-/Schwefelgehalt'),
  ing('turmeric','Kurkuma, gemahlen · 1 Prise',.3,{kcal:312,protein:9.68,carbs:67.14,fat:3.25,fiber:22.7},'USDA · gemahlene Kurkuma'),
  ing('chili','Chiliflocken · 1 Prise',.2,{kcal:282,protein:12,carbs:50,fat:14},'USDA · generische rote Chiliflocken')
 ]}
});
export const PERSONAL_RECIPE_IDS=Object.freeze(Object.keys(RAW));
export const PERSONAL_RECIPE_PRESETS=Object.freeze(PERSONAL_RECIPE_IDS.map(id=>Object.freeze({id,title:RAW[id].name,emoji:RAW[id].icon,group:id==='fried-egg-personal'?'Frühstück':'Mahlzeiten',defaultAmount:'1 Portion',kcalLow:null,kcalHigh:null,recipeNote:'Persönliches Rezept, Grammangaben je Zutat editierbar'})));
export const PERSONAL_RECIPE_CATALOG=RAW;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
export function recipeSnapshot(id,input){
 const def=RAW[id];if(!def)return [];
 const rows=new Map((Array.isArray(input)?input:[]).filter(x=>x?.id).map(x=>[x.id,x]));
 return def.ingredients.map(x=>{const edited=rows.get(x.id),n=Number(String(edited?.grams??'').replace(',','.'));
  return {id:x.id,grams:edited&&Number.isFinite(n)&&n>=0&&n<=2000?round(n):x.grams,assumed:edited?.assumed===false?false:true};});
}
export function personalRecipeParts(id,recipe){
 const def=RAW[id];if(!def)return [];
 const saved=recipeSnapshot(id,recipe);
 return saved.map(row=>{
  const ingredient=def.ingredients.find(x=>x.id===row.id);
  // Omitted OPTIONAL item = explicitly not included in THIS recipe, NOT zero nutrients in that ingredient.
  if(row.grams===0)return null;
  const values=Object.fromEntries(Object.entries(ingredient.values).map(([key,n])=>[key,round(n*row.grams/100)]));
  return {name:ingredient.label,part:'Persönliches Rezept',amount:row.grams,unit:'g',source:ingredient.source,values,
   estimatedKeys:Object.keys(values),extra:[],note:row.assumed?'Menge vorläufig, bitte bei Bedarf abwiegen; generisches Nährstoffprofil':'Menge persönlich editiert; Nährstoffprofil weiterhin geschätzt'};
 }).filter(Boolean);
}
export function personalRecipeKcal(id,recipe){
 const parts=personalRecipeParts(id,recipe);if(!parts.length)return null;
 const k=parts.filter(x=>Number.isFinite(x.values.kcal));
 if(!k.length)return null;
 const subtotal=k.reduce((n,p)=>n+p.values.kcal,0);
 const incomplete=parts.some(x=>!Number.isFinite(x.values.kcal));
 return {low:Math.round(subtotal),high:Math.round(subtotal),kind:incomplete?'Rezept-Teilsumme (unvollständig)':'Rezept-Schätzung',incomplete};
}
export function personalRecipeEditor(entry){
 if(!PERSONAL_RECIPE_IDS.includes(entry?.foodId))return '';
 const def=RAW[entry.foodId],rows=recipeSnapshot(entry.foodId,entry.recipe);
 return `<fieldset class="r737-edit"><legend>${esc(def.icon)} ${esc(def.name)} · Zutaten</legend><p>Alle Grammzahlen sind editierbar. Optionale Zutaten mit 0 g wurden für diesen Eintrag nicht verwendet. Die Nährwerte stammen aus generischen Referenzen, nicht von deiner Markenverpackung.</p><div class="r737-fields">${rows.map(row=>{const x=def.ingredients.find(i=>i.id===row.id);return `<label>${esc(x.label)}${x.optional?' <small>(optional)</small>':''}<span><input name="recipe737-${esc(row.id)}" type="number" min="0" max="2000" step="0.1" inputmode="decimal" value="${row.grams}" required> g</span></label>`;}).join('')}</div></fieldset>`;
}
export function readPersonalRecipe(id,fd){return recipeSnapshot(id,RAW[id]?.ingredients.map(x=>({id:x.id,grams:fd.get('recipe737-'+x.id),assumed:false}))||[]);}
