/** Compass 0.5.77.34 · guarded additive Vite transforms after v0.5.77.33.
 * Never silently patch a mismatched base: fail closed on moved/duplicate anchors.
 */
export function nutritionLongevity734Bridge(){
 const replace=(input,from,to,label)=>{
  if(input.split(from).length!==2)throw Error(`Compass .34: Integrationsanker nicht eindeutig (${label}) · bitte 0.5.77.33 als Basis prüfen.`);
  return input.replace(from,to);
 };
 return {name:'compass-nutrition-longevity-734',enforce:'pre',transform(input,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let s=input,change=(a,b,key)=>{s=replace(s,a,b,key);};
   change("const COMPASS_CLIENT_VERSION='0.5.77.33';", "const COMPASS_CLIENT_VERSION='0.5.77.34';",'Version');
   change("import './nutrition-guidance-v57733.css';", "import './nutrition-guidance-v57733.css';\nimport {antiAgingEightView} from './anti-aging-eight-v57734.js';\nimport './anti-aging-eight-v57734.css';",'Anti-Aging imports');
   change("dailyDozenDay733=localDateString(new Date());", "dailyDozenDay733=localDateString(new Date()),antiAgingDay734=localDateString(new Date());",'Anti-Aging date');
   change('🌿 Daily Dozen</button></nav>', '🌿 Daily Dozen</button><button type="button" data-action="ni712-view" data-id="anti-aging" class="${nutritionView712===\'anti-aging\'?\'selected\':\'\'}">🌱 Anti-Aging Eight</button></nav>', 'Nutrition tabs');
   change("nutritionView712==='daily-dozen'?dailyDozenView(state,{day:dailyDozenDay733,today:localDate()}):nutritionHistoryView", "nutritionView712==='daily-dozen'?dailyDozenView(state,{day:dailyDozenDay733,today:localDate()}):nutritionView712==='anti-aging'?antiAgingEightView(state,{day:antiAgingDay734,today:localDate()}):nutritionHistoryView",'Anti-Aging view');
   change("['journal','nutrients','timing','trends','connections','fats','daily-dozen'].includes(id)", "['journal','nutrients','timing','trends','connections','fats','daily-dozen','anti-aging'].includes(id)",'Nutrition navigation');
   change('function refreshDailyDozen733(){', `function refreshAntiAging734(){
 const host=app.querySelector('.aa734-root');if(!host||!state){render();return;}
 host.outerHTML=antiAgingEightView(state,{day:antiAgingDay734,today:localDate()});
 app.querySelector('.aa734-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
function refreshDailyDozen733(){`, 'Local Anti-Aging refresh');
   change(' // Daily Dozen .33: save individual counters, no page rebuild / scroll jump.',` // Anti-Aging Eight .34: only replace its own panel, never scroll to top.
 if(action==='aa734-day'){
  if(!['prev','next','today'].includes(id))return;
  const today=localDate();antiAgingDay734=id==='today'?today:shiftDailyDozenDate(antiAgingDay734,id==='prev'?-1:1);
  if(antiAgingDay734>today)antiAgingDay734=today;
  refreshAntiAging734();return;
 }
 // Daily Dozen .33: save individual counters, no page rebuild / scroll jump.`, 'Anti-Aging actions');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   return {code:replace(input, "['tea-unsweetened','🍵','Tee ungesüßt','Getränke','1 Tasse (250 ml)',0,5]", "['tea-unsweetened','🍵','Tee ungesüßt','Getränke','1 Tasse (250 ml)',0,5],['green-tea-chinese','🍃','Chinesischer Grüntee · ungesüßt','Getränke','1 Tasse (250 ml)',0,3]",'Grüntee-Preset'),map:null};
  }
  if(path.endsWith('/client/src/nutrition-intelligence-v57712.js')){
   let s=replace(input,"const LABELLED={",`const LABELLED={
 'green-tea-chinese':profile('Chinesischer Grüntee · aufgebrüht, ohne Zucker',250,'ml',{kcal:2,fat:0,saturated:0,carbs:0,sugar:0},'BfR / EFSA: generischer Grüntee-Richtwert',{caffeine:{label:'Koffein (Teein)',value:38,unit:'mg',mode:'estimate'}},'≈ 38 mg Koffein pro 250 ml laut Referenzbereich, keine Messung deiner Teesorte. Ziehzeit und Blattmenge beeinflussen den Gehalt. https://www.bfr.bund.de/fragen-und-antworten/thema/fragen-und-antworten-zu-koffein-und-koffeinhaltigen-lebensmitteln-einschliesslich-energy-drinks/'),`, 'Grüntee Koffeinprofil');
   s=replace(s,"'milk-my-vay':profile", "'milk-my-vay':profile",'profile passt');
   s=replace(s,"for(const [id,micros] of Object.entries(GENERIC_MICRONUTRIENTS))", "LABELLED['green-tea-chinese'].estimatedNutrients=['kcal'];\nfor(const [id,micros] of Object.entries(GENERIC_MICRONUTRIENTS))",'Koffeinschätzung markiert');
   return {code:s,map:null};
  }
  return null;
 }};
}
