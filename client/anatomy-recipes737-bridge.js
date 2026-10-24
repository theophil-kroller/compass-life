/** Compass .37 additive, fail-closed Vite integration after .36.
 * Source bridge is limited to known anchors: no unreviewed replacement of the Vault.
 */
export function anatomyRecipes737Bridge(){
 const one=(s,a,b,label)=>{if(s.split(a).length!==2)throw Error(`Compass .37: fehlender/mehrfacher Anker (${label}). Erst v0.5.77.36 vollständig hochladen.`);return s.replace(a,b);};
 return {name:'compass-anatomy-recipes-737',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let s=source;const change=(a,b,label)=>{s=one(s,a,b,label);};
   change("const COMPASS_CLIENT_VERSION='0.5.77.36';","const COMPASS_CLIENT_VERSION='0.5.77.37';",'version');
   change("import './nutrition-phyto-v57736.css';","import './nutrition-phyto-v57736.css';\nimport {readPersonalRecipe,PERSONAL_RECIPE_IDS} from './personal-recipes-v57737.js';\nimport './strength-recipes-v57737.css';",'recipe forms and styles');
   change("let strengthRange728='28',strengthSide728='front';","let strengthRange728='28',strengthSide728='front',strengthActivity737='combined';",'cycling mode');
   change("strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today,editingId:strengthEditId732})","strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today,editingId:strengthEditId732,activity:strengthActivity737})",'main cycling activity view');
   change("strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today:localDate(),editingId:strengthEditId732})","strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today:localDate(),editingId:strengthEditId732,activity:strengthActivity737})",'refresh cycling activity');
   change(' // Strength: fast local map toggle, without re-rendering the whole GTD app.',` // .37: cycling layer is descriptive and explicitly separate from strength sets.
 if(action==='str737-activity'){
  if(!['combined','strength','cycling'].includes(id))return;
  strengthActivity737=id;refreshStrength728();return;
 }
 // Strength: fast local map toggle, without re-rendering the whole GTD app.`, 'cycling mode action');
   change("if(item.foodId==='smoothie-personal')item.recipe=readSmoothieForm(fd);item.updatedAt=stamp();", "if(item.foodId==='smoothie-personal')item.recipe=readSmoothieForm(fd);if(PERSONAL_RECIPE_IDS.includes(item.foodId))item.recipe=readPersonalRecipe(item.foodId,fd);item.updatedAt=stamp();",'save editable recipes');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   let s=source;const change=(a,b,label)=>{s=one(s,a,b,label);};
   change("import {SMOOTHIE_INGREDIENTS,smoothieRecipe,smartNutritionGroups,smartNutritionFoods,smoothieEditFields,smoothieNotes} from './nutrition-smart-smoothie-v57736.js';", "import {SMOOTHIE_INGREDIENTS,smoothieRecipe,smartNutritionGroups,smartNutritionFoods,smoothieEditFields,smoothieNotes} from './nutrition-smart-smoothie-v57736.js';\nimport {PERSONAL_RECIPE_IDS,PERSONAL_RECIPE_PRESETS,recipeSnapshot,personalRecipeEditor,personalRecipeKcal} from './personal-recipes-v57737.js';",'recipe imports');
   change("export function nutritionFoods(state){return [...FOOD_PRESETS,...(state?.nutritionJournal?.customFoods||[])];}", "export function nutritionFoods(state){return [...FOOD_PRESETS,...PERSONAL_RECIPE_PRESETS,...(state?.nutritionJournal?.customFoods||[])];}",'all catalog foods');
   change("const foods=[...FOOD_PRESETS,...state.nutritionJournal.customFoods];", "const foods=nutritionFoods(state);",'capture known recipes');
   change("item.recipe=smoothieRecipe(recent?.recipe); }", `item.recipe=smoothieRecipe(recent?.recipe); }
 if(PERSONAL_RECIPE_IDS.includes(foodId)){
  const recent=state.nutritionJournal.entries.filter(x=>x.foodId===foodId&&!x.deleted&&Array.isArray(x.recipe)).sort((a,b)=>String(b.at).localeCompare(String(a.at)))[0];
  item.recipe=recipeSnapshot(foodId,recent?.recipe);
 }`, 'capture recipe snapshot and recent sizes');
   change("export function nutritionKcalEstimate(food,amount){\n if(!food||!Number.isFinite(food.kcalLow)", "export function nutritionKcalEstimate(food,amount,recipe=null){\n if(PERSONAL_RECIPE_IDS.includes(food?.id))return personalRecipeKcal(food.id,recipe);\n if(!food||!Number.isFinite(food.kcalLow)",'personal recipe energy');
   change("nutritionKcalEstimate(food,entry.amount);", "nutritionKcalEstimate(food,entry.amount,entry.recipe);",'energy journal per-entry grams');
   change("${editing.foodId==='smoothie-personal'?smoothieEditFields(editing):''}", "${editing.foodId==='smoothie-personal'?smoothieEditFields(editing):PERSONAL_RECIPE_IDS.includes(editing.foodId)?personalRecipeEditor(editing):''}",'recipe editor below date/amount');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/nutrition-intelligence-v57712.js')){
   let s=source;const change=(a,b,label)=>{s=one(s,a,b,label);};
   change("import {smoothieParts} from './nutrition-smart-smoothie-v57736.js';", "import {smoothieParts} from './nutrition-smart-smoothie-v57736.js';\nimport {PERSONAL_RECIPE_IDS,personalRecipeParts} from './personal-recipes-v57737.js';",'nutrient ingredients import');
   change("const parts=entry.foodId==='smoothie-personal'?smoothieParts(entry.recipe):nutritionParts(entry.foodId,entry.amount,food),totals={},knownKeys=new Set();", "const parts=PERSONAL_RECIPE_IDS.includes(entry.foodId)?personalRecipeParts(entry.foodId,entry.recipe):entry.foodId==='smoothie-personal'?smoothieParts(entry.recipe):nutritionParts(entry.foodId,entry.amount,food),totals={},knownKeys=new Set();", 'nutrient source-aware per ingredient');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/nutrition-history-v577.js')){
   return {code:one(source,'nutritionKcalEstimate(food,e.amount)', 'nutritionKcalEstimate(food,e.amount,e.recipe)','historical recipe kcal'),map:null};
  }
  if(path.endsWith('/client/src/nutrition-smart-smoothie-v57736.js')){
   let out=one(source,"'Mahlzeiten':['mensa-study-veggie','dark-bread-butter']", "'Mahlzeiten':['salad-personal','bean-salad-personal','mensa-study-veggie','dark-bread-butter']",'personal favorite meals');
   out=one(out,"const COMMON_FAVORITES={'Getränke':","const COMMON_FAVORITES={'Frühstück':['fried-egg-personal'], 'Getränke':",'personal fried egg breakfast');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/daily-dozen-auto-v57734.js')){
   let s=source;const change=(a,b,label)=>{s=one(s,a,b,label);};
   change("import {smoothieRecipe} from './nutrition-smart-smoothie-v57736.js';", "import {smoothieRecipe} from './nutrition-smart-smoothie-v57736.js';\nimport {PERSONAL_RECIPE_IDS,recipeSnapshot} from './personal-recipes-v57737.js';",'Daily Dozen personal recipes');
   change("totals={fruit:0,berries:0,nuts:0,beverages:0}","totals={fruit:0,berries:0,nuts:0,beverages:0,greens:0,vegetables:0,beans:0}",'greens beans vegetables');
   change("sources={fruit:[],berries:[],nuts:[],beverages:[]}","sources={fruit:[],berries:[],nuts:[],beverages:[],greens:[],vegetables:[],beans:[]}",'daily evidence source keys');
   change("const foodId=String(entry.foodId||''),type=VERIFIED_DAILY_FOODS[foodId];",`const foodId=String(entry.foodId||''),type=VERIFIED_DAILY_FOODS[foodId];
  if(PERSONAL_RECIPE_IDS.includes(foodId)){
   const recipe=new Map(recipeSnapshot(foodId,entry.recipe).map(row=>[row.id,row.grams]));
   if(foodId==='salad-personal'){
    if((recipe.get('lettuce')||0)>=80){totals.greens++;sources.greens.push('Grüner Salat (mind. 80 g; Portionsschätzung)');}
    if((recipe.get('carrot')||0)>=80||(recipe.get('pepper')||0)>=80){totals.vegetables++;sources.vegetables.push('Karotten oder Paprika im Salat');}
    nutGrams+=recipe.get('peanuts')||0;
   }
   if(foodId==='bean-salad-personal'&&(recipe.get('beans')||0)>=100){
    // One conservative legume portion, even when a tin appears larger.
    totals.beans++;sources.beans.push('Käferbohnen (mind. 100 g; Dose nur geschätzt)');
   }
   continue;
  }`, 'daily dozen personalized meal evidence');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-insights-v57728.js')){
   let s=source;const change=(a,b,label)=>{s=one(s,a,b,label);};
   change("import {applyStrengthAnnotations,manualExerciseMuscles,strengthEditorView} from './strength-editor-v57732.js';", "import {applyStrengthAnnotations,manualExerciseMuscles,strengthEditorView} from './strength-editor-v57732.js';\nimport {detailedMuscleSvg,detailedMuscleTable,cyclingMuscleSummary} from './strength-anatomy-v57737.js';",'fine anatomy and cycling model');
   change("export function strengthInsightsView(state,{range='28',side='front',today=day(new Date()),editingId=''}={}){", "export function strengthInsightsView(state,{range='28',side='front',today=day(new Date()),editingId='',activity='combined'}={}){",'muscle activity mode');
   change("const m=strengthPeriod(state,{range,today}); const groups=m.groups;", "const m=strengthPeriod(state,{range,today}); const groups=m.groups; const cycling=cyclingMuscleSummary(state,{range,today});",'cycling data by period');
   change('<div class="str728-visual"><div class="str728-body-panel"><div class="str735-two-maps">',"<div class=\"str737-activity-tabs\" role=\"group\" aria-label=\"Muskelbeteiligung nach Aktivitätsart\">${[['combined','Gemeinsam'],['strength','Krafttraining'],['cycling','🚲 Radfahren']].map(([id,label])=>`<button type=\"button\" data-action=\"str737-activity\" data-id=\"${id}\" class=\"${activity===id?'selected':''}\" aria-pressed=\"${activity===id}\">${label}</button>`).join('')}</div>\n ${activity!=='strength'?`<p class=\"str737-ride-info\"><strong>🚲 ${cycling.rides} Radfahrten · ${cycling.minutes.toLocaleString('de-AT',{maximumFractionDigits:0})} Min. · ${cycling.days} Tage</strong><small>Fischer-E-Bike ohne Motorunterstützung laut eigener Angabe; Unterstützung und Tretleistung sind nicht aus Garmin-Dateien messbar. <strong>Keine Umrechnung in Kraftsätze.</strong></small></p>`:''}\n <div class=\"str728-visual\"><div class=\"str728-body-panel\"><div class=\"str735-two-maps\">",'riding tabs');
   // The exact .35 dual-view placeholders (after the older guards have transformed).
   change("${bodySvg(m,'front',side==='back'?'load':'roles')}","${detailedMuscleSvg(m,'front',side==='back'?'load':'roles',cycling,activity)}",'anatomy front');
   change("${bodySvg(m,'back',side==='back'?'load':'roles')}","${detailedMuscleSvg(m,'back',side==='back'?'load':'roles',cycling,activity)}",'anatomy back');
   change('${groupTiles(m)}',"${detailedMuscleTable(m,cycling,activity)}<details class=\"str737-coarse\"><summary>Grobe Muskelgruppen anzeigen</summary>${groupTiles(m)}</details>",'fine muscle groups');
   change('<div class="str735-body-legend">', '<div class="str735-body-legend">${activity!==\'strength\'&&cycling.rides?\'<span><i style="background:#F28C25"></i> Radfahren: vorrangig</span><span><i style="background:#F6C95A"></i> Radfahren: beteiligt</span>\':\'\'}', 'cycling legend');
   return {code:s,map:null};
  }
  return null;
 }};
}
