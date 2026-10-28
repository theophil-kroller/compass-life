/** Compass 0.5.77.59.40.15: fix retrospective and new smoothie energy estimates.
 * Late guarded Vite transform, leaving historic patch chain untouched.
 */
export function compass594015SmoothieEnergyRelease(){
 const once=(source,a,b,label)=>{const count=source.split(a).length-1;
  if(count!==1)throw Error(`Compass .40.15 ${label}: ${count} matches`);
  return source.replace(a,b);
 };
 return {name:'compass-594015-smoothie-energy',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.14';", "const COMPASS_CLIENT_VERSION='0.5.77.59.40.15';",'client version');
   s=once(s,'Build 0.5.77.59.40.14','Build 0.5.77.59.40.15','footer version');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))
   return {code:once(source,'Build 0.5.77.59.40.14','Build 0.5.77.59.40.15','lock version'),map:null};
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   let s=once(source,"import {SMOOTHIE_INGREDIENTS,smoothieRecipe,smartNutritionGroups,smartNutritionFoods,smoothieEditFields,smoothieNotes} from './nutrition-smart-smoothie-v57736.js';", "import {SMOOTHIE_INGREDIENTS,smoothieRecipe,smoothieKcalEstimate,smartNutritionGroups,smartNutritionFoods,smoothieEditFields,smoothieNotes} from './nutrition-smart-smoothie-v57736.js';",'smoothie formula import');
   s=once(s,"if(PERSONAL_RECIPE_IDS.includes(food?.id))return personalRecipeKcal(food.id,recipe);", "if(food?.id==='smoothie-personal')return smoothieKcalEstimate(recipe,amount);\n if(PERSONAL_RECIPE_IDS.includes(food?.id))return personalRecipeKcal(food.id,recipe);",'actual kcal estimate');
   s=once(s,"Mein Smoothie · Banane, Sesam, Beeren, Nüsse", "Mein Smoothie · Banane, Sesam, Heidelbeeren, Blütenpollen",'food tile and display name');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/energy-goal-v575.js')){
   return {code:once(source,'estimate(index.get(e.foodId),e.amount)', 'estimate(index.get(e.foodId),e.amount,e.recipe)', 'day energy from recipe'),map:null};
  }
  if(path.endsWith('/client/src/nutrition-timing-v57725.js')){
   let s=once(source,'const approx=nutritionKcalEstimate(food,entry.amount);','const approx=nutritionKcalEstimate(food,entry.amount,entry.recipe);','timing from recipe');
   s=once(s,'e.note,e.updatedAt,e.deleted','e.note,e.recipe,e.updatedAt,e.deleted','invalidate recipe cache');
   return {code:s,map:null};
  }
  return null;
 }};
}
