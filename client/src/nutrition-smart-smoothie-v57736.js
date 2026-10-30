/** Compass .36 · Adaptive quick-food groups and a transparent personal smoothie recipe.
 * Every ingredient has its own saved gram amount. Generic nutrient references are
 * approximations, not claims about specific brands or the user's exact handfuls.
 */
export const SMOOTHIE_INGREDIENTS=Object.freeze([
 {id:'banana',label:'Banane (ohne Schale)',grams:120,unit:'g',basis:'USDA FDC 173944 · Banane, roh',values:{kcal:89,protein:1.09,carbs:22.84,sugar:12.23,fat:.33,saturated:.112,fiber:2.6,potassium:358,magnesium:27,vitaminC:8.7,vitaminB6:.37}},
 {id:'sesame',label:'Bio schwarzer Sesam (1 Schöpfer)',grams:15,unit:'g',basis:'USDA Sesamsamen, ganze Samen · generisch; Schöpfermenge ungewogen',values:{kcal:573,protein:17.73,carbs:23.45,fat:49.67,saturated:6.96,fiber:11.8,calcium:975,magnesium:351,iron:14.55}},
 {id:'pollen',label:'Bio Blütenpollen (1 Löffel, ca. 5 g)',grams:5,unit:'g',basis:'Vergleichbare Bio-Blütenpollen: ca. 285–385 kcal/100 g; hier 350 kcal/100 g als mittlere Schätzung, nicht produktspezifisch',values:{kcal:350}},
 {id:'cinnamon',label:'Zimt (1 Prise)',grams:.4,unit:'g',basis:'USDA Zimt, gemahlen · Menge geschätzt',values:{kcal:247,fiber:53.1,carbs:80.6,fat:1.24,protein:3.99}},
 {id:'ginger',label:'Ingwerpulver (1 Prise)',grams:.4,unit:'g',basis:'USDA Ingwer, gemahlen · Menge geschätzt',values:{kcal:335,protein:8.98,carbs:71.62,fiber:14.1,fat:4.24}},
 {id:'turmeric',label:'Kurkuma (1 Prise)',grams:.4,unit:'g',basis:'USDA Kurkuma, gemahlen · Menge geschätzt; bei älteren Einträgen ohne Angabe 0 g',values:{kcal:312,protein:9.68,carbs:67.14,fat:3.25,fiber:22.7}},
 {id:'blueberries',label:'Hofer gefrorene Blaubeeren (1 Handvoll)',grams:75,unit:'g',basis:'USDA Heidelbeeren, roh; tiefgekühlt und Sorte können abweichen',values:{kcal:57,protein:.74,carbs:14.49,sugar:9.96,fat:.33,saturated:.028,fiber:2.4,vitaminC:9.7,manganese:.336}},
 {id:'mint',label:'Frische Pfefferminzblätter (nur falls ergänzt)',grams:0,unit:'g',basis:'Für Blätter nicht sicher auf Portionsbasis spezifiziert',values:{}},
 {id:'nuts',label:'Bio Nussmischung (nur falls ergänzt)',grams:0,unit:'g',basis:'MorgenLand Bio Kerniger Nuss Mix – Etikett; ggf. abweichende Mischung',values:{kcal:649,protein:17,carbs:12,sugar:4.2,fat:58,saturated:7.1,fiber:6.9}}
]);
const number=x=>typeof x==='number'?x:Number(String(x??'').replace(',','.'));
const round=x=>Math.round((x+Number.EPSILON)*100)/100;
export function smoothieRecipe(input){
 const byId=new Map(Array.isArray(input)?input.map(x=>[String(x?.id),x]):[]);
 return SMOOTHIE_INGREDIENTS.map(i=>{
  const candidate=byId.get(i.id),v=candidate?.grams===undefined||candidate?.grams===null?NaN:number(candidate.grams);
  // Never attribute a newly added ingredient to a previously saved smoothie.
  const legacyUnconfirmed=['mint','nuts'].includes(i.id)&&candidate?.assumed!==false;
  const grams=legacyUnconfirmed?0:i.id==='turmeric'&&Array.isArray(input)&&!byId.has('turmeric')?0:Number.isFinite(v)&&v>=0&&v<=1000?round(v):i.grams;
  return {id:i.id,grams,assumed:candidate?.assumed===false?false:true};
 });
}
export function smoothieParts(recipe){
 const rec=smoothieRecipe(recipe);
 return rec.filter(item=>item.grams>0).map(item=>{const source=SMOOTHIE_INGREDIENTS.find(i=>i.id===item.id);const values=Object.fromEntries(Object.entries(source.values).map(([k,v])=>[k,round(v*item.grams/100)]));
  return {name:source.label,part:'Smoothie-Zutat',amount:item.grams,unit:'g',source:source.basis,values,estimatedKeys:Object.keys(values),extra:[],note:item.assumed?'Mengenannahme; in der Eintragsbearbeitung korrigierbar':'Vom Nutzer eingetragene Menge; Nährstoffprofil weiterhin generisch'};
 });
}
/** Estimate each logged smoothie from its own recorded ingredient snapshot, including older rows.
 * Explicit gram edits are honoured. The range reflects unweighed handful/scoop amounts
 * and generic ingredient sources; it is not a measured nutrient label.
 */
export function smoothieKcalEstimate(recipe,amount='1 Portion'){
 const text=String(amount||'1 Portion').trim();
 const match=/^(\d+(?:[.,]\d+)?)\s*Portion(?:en)?\b/i.exec(text);
 const count=match?Number(match[1].replace(',','.')):1;
 if(!Number.isFinite(count)||count<=0||count>20)return null;
 const ingredients=smoothieParts(recipe);
 if(!ingredients.length)return null;
 const base=ingredients.reduce((sum,item)=>sum+(item.values.kcal||0),0);
 if(base<=0)return null;
 return {low:Math.round(base*count*.82),high:Math.round(base*count*1.28),kind:'Rezeptschätzung'};
}
export function smoothieNotes(){return SMOOTHIE_INGREDIENTS.filter(i=>i.grams>0).map(i=>`${i.label}: ca. ${String(i.grams).replace('.',',')} g`).join('; ');}
const PREFERRED={
 morning:['Frühstück','Getränke','Snacks','Mahlzeiten','Nahrungsergänzung','Zutaten'],
 midday:['Mahlzeiten','Getränke','Snacks','Frühstück','Nahrungsergänzung','Zutaten'],
 afternoon:['Getränke','Snacks','Mahlzeiten','Frühstück','Nahrungsergänzung','Zutaten'],
 evening:['Getränke','Snacks','Mahlzeiten','Frühstück','Nahrungsergänzung','Zutaten']
};
export function nutritionDaypart(hour){const h=Number(hour);return !Number.isFinite(h)||h<11?'morning':h<15?'midday':h<20?'afternoon':'evening';}
export function smartNutritionGroups(foods=[],hour=9){
 const groups=[...new Set(foods.map(f=>f.group).filter(Boolean))],preferred=PREFERRED[nutritionDaypart(hour)];
 return groups.sort((a,b)=>{const ai=preferred.indexOf(a),bi=preferred.indexOf(b);return (ai<0?100:ai)-(bi<0?100:bi);});
}
export function smoothieEditFields(entry={}){
 const items=smoothieRecipe(entry.recipe);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<fieldset class="pj92-smoothie-editor"><legend>🥤 Dein Smoothie · Zutatenmengen</legend><p class="pj92-smoothie-note">Eine Handvoll und ein Schöpfer sind Mengenannahmen. Trage gern deine abgewogenen Gramm ein; bisherige Einträge behalten ihre eigenen Rezeptmengen.</p><div class="pj92-smoothie-fields">${items.map(r=>{
  const source=SMOOTHIE_INGREDIENTS.find(x=>x.id===r.id);
  return `<label>${esc(source.label)}<input type="number" min="0" max="1000" step="0.1" inputmode="decimal" name="smoothie-${esc(r.id)}" value="${r.grams}" aria-label="${esc(source.label)} in Gramm">g</label>`;
 }).join('')}</div></fieldset>`;
}
export function readSmoothieForm(formData){
 return smoothieRecipe(SMOOTHIE_INGREDIENTS.map(i=>({id:i.id,grams:formData.get('smoothie-'+i.id),assumed:false})));
}

/** Favorites surface first INSIDE each group, not only at the category level. */
const COMMON_FAVORITES={'Getränke':['green-tea-chinese','smoothie-personal','coffee','matcha','matcha-oat-plain','tea-unsweetened'],'Snacks':['banana','apple','peanuts','mixed-nuts','pistachio-butter-cups'],'Mahlzeiten':['mensa-study-veggie','dark-bread-butter']};
export function smartNutritionFoods(foods=[],group=''){
 const favorite=COMMON_FAVORITES[group]||[];
 return foods.filter(f=>f.group===group).sort((a,b)=>{const ai=favorite.indexOf(a.id),bi=favorite.indexOf(b.id);return (ai<0?100:ai)-(bi<0?100:bi);});
}
