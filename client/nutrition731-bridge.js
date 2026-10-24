/** Compass 0.5.77.31 · cumulative bridge following .27 .28 .29 .30.
 * Fat-quality monitoring: non-destructive, local-only, no schema change.
 * Also updates measured salted peanut handful from 30g estimate to 20g.
 * Prior logs containing an explicit 30g continue to mean 30g. */
export function nutrition731Bridge(){
 const replaceUnique=(source,needle,next,label)=>{
  if(source.split(needle).length!==2)throw Error(`Nutrition .31: eindeutiger Integrationsanker fehlt (${label}); Basis 0.5.77.30 kontrollieren.`);
  return source.replace(needle,next);
 };
 return {name:'compass-nutrition-fat-quality-731',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let code=source;
   const change=(from,to,label)=>{code=replaceUnique(code,from,to,label);};
   change("const COMPASS_CLIENT_VERSION='0.5.77.30';","const COMPASS_CLIENT_VERSION='0.5.77.31';",'version');
   change("import './nutrition-connections-v57727.css';","import './nutrition-connections-v57727.css';\nimport {nutritionFatView} from './nutrition-fat-quality-v57731.js';\nimport './nutrition-fat-quality-v57731.css';",'import');
   change("let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;", "let nutritionFatDays731='30',nutritionFatMetric731='saturated';\nlet journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;",'state');
   change('🔗 Zusammenhänge</button></nav>', '🔗 Zusammenhänge</button><button type="button" data-action="ni712-view" data-id="fats" class="${nutritionView712===\'fats\'?\'selected\':\'\'}">🥑 Fettqualität</button></nav>', 'subtab');
   change("nutritionView712==='connections'?nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays}):nutritionHistoryView", "nutritionView712==='connections'?nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays}):nutritionView712==='fats'?nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()}):nutritionHistoryView",'view');
   change("['journal','nutrients','timing','trends','connections'].includes(id)","['journal','nutrients','timing','trends','connections','fats'].includes(id)",'navigation');
   change(' // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.',
` // Nutrition 4: localized fat-quality controls, no full app rerender.
 if(action==='ni731-period'){
  if(!['7','30','90','365','all'].includes(id))return;
  nutritionFatDays731=id;refreshNutritionFatPanel731();return;
 }
 if(action==='ni731-metric'){
  if(!['fat','saturated','mono','poly','ala','epa','dha','omega6','cholesterol','trans'].includes(id))return;
  nutritionFatMetric731=id;refreshNutritionFatPanel731();return;
 }
 // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.`, 'events');
   change('function render(){',
`function refreshNutritionFatPanel731(){
 const node=app.querySelector('.ni731-root');
 if(!node||!state){render();return;}
 node.outerHTML=nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()});
 app.querySelector('.ni731-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
function render(){`,'local refresh');
   return {code,map:null};
  }
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   let out=replaceUnique(source,"['peanuts','🥜','Hofer gesalzene Erdnüsse','Snacks','1 Handvoll (30 g; geschätzt)',175,190]", "['peanuts','🥜','Hofer gesalzene Erdnüsse','Snacks','1 Handvoll (20 g; abgewogen)',117,126]",'peanut preset');
   // Do not change all other nut/seed handfuls: specifically 20g for user's salted peanuts.
   out=replaceUnique(out,"items.push({value:(m[1]?parseNumber(m[1]):1)*30,unit:'g'});", "items.push({value:(m[1]?parseNumber(m[1]):1)*(food.id==='peanuts'?20:30),unit:'g'});",'handful parser');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/nutrition-intelligence-v57712.js')){
   let out=replaceUnique(source,"return {value:(m?amountNumber(m[1]):1)*30,unit:'g'};", "return {value:(m?amountNumber(m[1]):1)*(entry.foodId==='peanuts'?20:30),unit:'g'};",'handful quantity');
   out=replaceUnique(out,"'30 g pro Handvoll vorläufig; konkrete Packung und Portionsgewicht noch nicht bestätigt.'", "'Eine persönliche Handvoll entspricht 19–20 g (24.10.2026 abgewogen); Zusammensetzung weiterhin generische Schätzung.'",'source note');
   return {code:out,map:null};
  }
  return null;
 }};
}
