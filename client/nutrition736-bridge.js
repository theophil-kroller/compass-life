/** Compass 0.5.77.36 · additive source bridge after 0.5.77.35.
 * Fail-fast exact anchors; existing 0.5.77.27-.35 source transformations remain ordered.
 * No new cloud API or unencrypted data persistence.
 */
export function nutrition736Bridge(){
 const one=(s,from,to,label)=>{
  if(s.split(from).length!==2)throw Error(`Compass .36: eindeutiger Integrationsanker fehlt (${label}); Basis 0.5.77.35 kontrollieren.`);
  return s.replace(from,to);
 };
 return {name:'compass-nutrition-736',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let s=source;const change=(a,b,k)=>{s=one(s,a,b,k);};
   change("const COMPASS_CLIENT_VERSION='0.5.77.35';","const COMPASS_CLIENT_VERSION='0.5.77.36';",'version');
   change("import './touch-insights-v57735.css';", "import './touch-insights-v57735.css';\nimport {nutritionPhytoView} from './nutrition-phyto-v57736.js';\nimport {readSmoothieForm} from './nutrition-smart-smoothie-v57736.js';\nimport './nutrition-phyto-v57736.css';",'nutrition phyto imports');
   change("antiAgingDay734=localDateString(new Date());", "antiAgingDay734=localDateString(new Date()),phytoPeriod736=30;",'phyto period state');
   change('🌱 Anti-Aging Eight</button></nav>', '🌱 Anti-Aging Eight</button><button type="button" data-action="ni712-view" data-id="phyto" class="${nutritionView712===\'phyto\'?\'selected\':\'\'}">🌿 Pflanzenstoffe</button></nav>', 'phyto subtab');
   change("nutritionView712==='anti-aging'?antiAgingEightView(state,{day:antiAgingDay734,today:localDate()}):nutritionHistoryView", "nutritionView712==='anti-aging'?antiAgingEightView(state,{day:antiAgingDay734,today:localDate()}):nutritionView712==='phyto'?nutritionPhytoView(state,{period:phytoPeriod736,today:localDate()}):nutritionHistoryView", 'phyto view');
   change("['journal','nutrients','timing','trends','connections','fats','daily-dozen','anti-aging'].includes(id)", "['journal','nutrients','timing','trends','connections','fats','daily-dozen','anti-aging','phyto'].includes(id)",'phyto navigation');
   change('function refreshAntiAging734(){',`function refreshPhyto736(){
 const el=app.querySelector('.phyto736-root');if(!el||!state){render();return;}
 el.outerHTML=nutritionPhytoView(state,{period:phytoPeriod736,today:localDate()});
 app.querySelector('.phyto736-root')?.querySelectorAll('[data-action]').forEach(x=>{x.onclick=()=>runAction(x.dataset.action,x.dataset.id);});
}
function refreshAntiAging734(){`,'phyto local redraw');
   change(' // Anti-Aging Eight .34: only replace its own panel, never scroll to top.',` // Phytochemical profiles: update only this pane, not the whole GTD app.
 if(action==='phyto736-period'){
  if(!['7','30','90'].includes(id))return;
  phytoPeriod736=Number(id);refreshPhyto736();return;
 }
 // Anti-Aging Eight .34: only replace its own panel, never scroll to top.`,'phyto period action');
   change("item.note=String(fd.get('note')||'').slice(0,500);item.updatedAt=stamp();", "item.note=String(fd.get('note')||'').slice(0,500);if(item.foodId==='smoothie-personal')item.recipe=readSmoothieForm(fd);item.updatedAt=stamp();",'edit per-entry smoothie grams');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   let s=source;const change=(a,b,k)=>{s=one(s,a,b,k);};
   change("import {mergePeopleDirectory} from './people-sync-v57719.js';", "import {mergePeopleDirectory} from './people-sync-v57719.js';\nimport {SMOOTHIE_INGREDIENTS,smoothieRecipe,smartNutritionGroups,smartNutritionFoods,smoothieEditFields,smoothieNotes} from './nutrition-smart-smoothie-v57736.js';",'smart food imports');
   change("['smoothie','🥤','Smoothie','Getränke','1 Glas (300 ml)',120,280]", "['smoothie','🥤','Smoothie','Getränke','1 Glas (300 ml)',120,280],['smoothie-personal','🫐','Mein Smoothie · Banane, Sesam, Beeren, Nüsse','Getränke','1 Portion',null,null]", 'personal recipe tile');
   change(" ...(id==='matcha'||id==='matcha-oat-plain'?{", " ...(id==='smoothie-personal'?{recipeNote:'Mein übliches Rezept · '+smoothieNotes()+'. Mengen im Tagebuch einzeln bearbeitbar.'}:{}),\n ...(id==='matcha'||id==='matcha-oat-plain'?{", 'smoothie recipe labels');
   change("const foods=nutritionFoods(state),groups=[...new Set(foods.map(f=>f.group))];", "const foods=nutritionFoods(state),groups=smartNutritionGroups(foods,new Date().getHours());",'daypart reorder with no hiding');
   change('foods.filter(f=>f.group===group).map(f=>', 'smartNutritionFoods(foods,group).map(f=>', 'favorite tiles inside group');
   change('const idx=state.nutritionJournal.entries.findIndex(e=>e.id===item.id);', "if(foodId==='smoothie-personal'){const recent=state.nutritionJournal.entries.filter(x=>x.foodId==='smoothie-personal'&&!x.deleted&&Array.isArray(x.recipe)).sort((a,b)=>String(b.at||'').localeCompare(String(a.at||'')))[0];item.recipe=smoothieRecipe(recent?.recipe); }\n const idx=state.nutritionJournal.entries.findIndex(e=>e.id===item.id);",'recipe snapshot at capture');
   change('<label>Notiz (optional)<textarea name="note" rows="2" maxlength="500">${esc(editing.note||\'\')}</textarea></label>', '${editing.foodId===\'smoothie-personal\'?smoothieEditFields(editing):\'\'}<label>Notiz (optional)<textarea name="note" rows="2" maxlength="500">${esc(editing.note||\'\')}</textarea></label>', 'grams editor in journal');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/nutrition-intelligence-v57712.js')){
   let s=source;const change=(a,b,k)=>{s=one(s,a,b,k);};
   change("import {nutritionEntries,nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';", "import {nutritionEntries,nutritionFoods,nutritionKcalEstimate} from './personal-journal-v5692.js';\nimport {smoothieParts} from './nutrition-smart-smoothie-v57736.js';", 'ingredient composition import');
   change('const parts=nutritionParts(entry.foodId,entry.amount,food),totals={},knownKeys=new Set();', "const parts=entry.foodId==='smoothie-personal'?smoothieParts(entry.recipe):nutritionParts(entry.foodId,entry.amount,food),totals={},knownKeys=new Set();",'smoothie from individual ingredients');
   if(!s.includes("'Generischer Grüntee; USDA FDC 171917, NCBI Bookshelf'"))change("{kcal:2,fat:0,saturated:0,carbs:0,sugar:0},'BfR / EFSA: generischer Grüntee-Richtwert',{caffeine:{label:'Koffein (Teein)',value:38,unit:'mg',mode:'estimate'}}", "{kcal:2,fat:0,saturated:0,carbs:0,sugar:0,potassium:20,magnesium:2.5,manganese:.46,vitaminB2:.15},'Generischer Grüntee; USDA FDC 171917, NCBI Bookshelf',{caffeine:{label:'Koffein (Teein)',value:38,unit:'mg',mode:'estimate'},catechins:{label:'Catechine gesamt (50–100 mg/250 ml)',value:75,unit:'mg',mode:'estimate'}}", 'green tea bioactive and minerals');
   if(!s.includes("LABELLED['green-tea-chinese'].estimatedNutrients=['kcal','potassium','magnesium','manganese','vitaminB2'];"))change("LABELLED['green-tea-chinese'].estimatedNutrients=['kcal'];", "LABELLED['green-tea-chinese'].estimatedNutrients=['kcal','potassium','magnesium','manganese','vitaminB2'];", 'green tea reference estimates');
   change("profile('Filterkaffee · Richtwert 200 ml',200,'ml',{kcal:2},'Schätzung / EFSA',{caffeine:{label:'Koffein',value:90,unit:'mg',mode:'estimate'}}", "profile('Filterkaffee · Richtwert 200 ml',200,'ml',{kcal:2,potassium:108,magnesium:10,niacin:.44},'USDA Brewed Coffee / EFSA, generische Schätzung',{caffeine:{label:'Koffein',value:90,unit:'mg',mode:'estimate'},chlorogenicAcids:{label:'Chlorogensäuren (27–121 mg/200 ml)',value:75,unit:'mg',mode:'estimate'}}",'coffee minerals, chlorogenic acids');
   change("for(const [id,micros] of Object.entries(GENERIC_MICRONUTRIENTS))", "LABELLED['coffee'].estimatedNutrients=['kcal','potassium','magnesium','niacin'];\nfor(const [id,micros] of Object.entries(GENERIC_MICRONUTRIENTS))",'coffee reference estimates');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/daily-dozen-auto-v57734.js')){
   let s=source;const change=(a,b,k)=>{s=one(s,a,b,k);};
   change("const localDay=at=>", "import {smoothieRecipe} from './nutrition-smart-smoothie-v57736.js';\nconst localDay=at=>",'smoothie daily dozen import');
   change("const records=state?.nutritionJournal?.entries||[], totals={fruit:0,nuts:0,beverages:0};", "const records=state?.nutritionJournal?.entries||[], totals={fruit:0,berries:0,nuts:0,beverages:0};",'berry total');
   change("const sources={fruit:[],nuts:[],beverages:[]};let nutGrams=0;", "const sources={fruit:[],berries:[],nuts:[],beverages:[]};let nutGrams=0;",'berry source');
   change("const foodId=String(entry.foodId||''),type=VERIFIED_DAILY_FOODS[foodId];if(!type)continue;",`const foodId=String(entry.foodId||''),type=VERIFIED_DAILY_FOODS[foodId];
  if(foodId==='smoothie-personal'){
   const recipe=new Map(smoothieRecipe(entry.recipe).map(x=>[x.id,x.grams]));
   // Automatically recognize food groups from a recipe with saved ingredient
   // amounts. Assumed grams remain explicitly identified as estimates.
   if(recipe.get('banana')>=100){totals.fruit++;sources.fruit.push('Smoothie: 1 Banane (Menge ggf. geschätzt)');}
   if(recipe.get('blueberries')>=75){totals.berries++;sources.berries.push('Smoothie: Blaubeeren (75 g; ggf. geschätzt)');}
   if(recipe.get('nuts')>0){nutGrams+=recipe.get('nuts');sources.nuts.push('Smoothie: Nussmix (Menge ggf. geschätzt)');}
   continue;
  }
  if(!type)continue;`, 'Daily Dozen smoothie evidence');
   return {code:s,map:null};
  }
  return null;
 }};
}
