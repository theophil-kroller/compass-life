/** Compass 0.5.77.33: additive source bridge after 0.5.77.32.
 * Adds Dr. Greger's visual fat interpretation, Daily Dozen, and app version.
 * The strength exercise catalog itself is replaced by the new 0.5.77.32 catalog file.
 */
export function nutritionStrength733Bridge(){
 const unique=(input,from,to,label)=>{
  if(input.split(from).length!==2)throw Error(`Compass .33: Integrationsanker fehlt oder mehrfach: ${label}; Basis muss 0.5.77.32 sein.`);
  return input.replace(from,to);
 };
 return {name:'compass-nutrition-strength-733',enforce:'pre',transform(input,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let out=input;const change=(from,to,label)=>{out=unique(out,from,to,label);};
   change("const COMPASS_CLIENT_VERSION='0.5.77.32';","const COMPASS_CLIENT_VERSION='0.5.77.33';",'version');
   change("import './strength-editor-v57732.css';","import './strength-editor-v57732.css';\nimport {dailyDozenView,setDailyDozen,shiftDailyDozenDate} from './daily-dozen-v57733.js';\nimport './nutrition-guidance-v57733.css';",'imports');
   change("let nutritionFatDays731='30',nutritionFatMetric731='saturated',strengthEditId732='';", "let nutritionFatDays731='30',nutritionFatMetric731='saturated',strengthEditId732='',dailyDozenDay733=localDateString(new Date());",'date state');
   change('🥑 Fettqualität</button></nav>', '🥑 Fettqualität</button><button type="button" data-action="ni712-view" data-id="daily-dozen" class="${nutritionView712===\'daily-dozen\'?\'selected\':\'\'}">🌿 Daily Dozen</button></nav>','nutrition subtabs');
   change("nutritionView712==='fats'?nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()}):nutritionHistoryView", "nutritionView712==='fats'?nutritionFatView(state,{days:nutritionFatDays731,metric:nutritionFatMetric731,today:localDate()}):nutritionView712==='daily-dozen'?dailyDozenView(state,{day:dailyDozenDay733,today:localDate()}):nutritionHistoryView",'Daily Dozen view');
   change("['journal','nutrients','timing','trends','connections','fats'].includes(id)","['journal','nutrients','timing','trends','connections','fats','daily-dozen'].includes(id)",'daily dozen navigation');
   change('function render(){\n // Mobile modal must remain mounted while open:', `function refreshDailyDozen733(){
 const section=app.querySelector('.dd733-root');if(!section||!state){render();return;}
 section.outerHTML=dailyDozenView(state,{day:dailyDozenDay733,today:localDate()});
 app.querySelector('.dd733-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
}
function render(){
 // Mobile modal must remain mounted while open:`, 'local daily dozen updates');
   change(' // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.',
` // Daily Dozen .33: save individual counters, no page rebuild / scroll jump.
 if(action==='dd733-day'){
  if(!['prev','next','today'].includes(id))return;
  const today=localDate();dailyDozenDay733=id==='today'?today:shiftDailyDozenDate(dailyDozenDay733,id==='prev'?-1:1);
  if(dailyDozenDay733>today)dailyDozenDay733=today;
  refreshDailyDozen733();return;
 }
 if(action==='dd733-step'){
  if(!state)return toast('Bitte den Tresor entsperren.',true);
  const sign=id?.slice(0,1),cat=id?.slice(1);if(!['+','-'].includes(sign))return;
  try{journalSyncStatus='lokal';await mutate(st=>setDailyDozen(st,dailyDozenDay733,cat,sign==='+'?1:-1),null,true);refreshDailyDozen733();}
  catch(ex){toast('Daily Dozen: '+ex.message,true);}return;
 }
 // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.`, 'actions');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/nutrition-fat-quality-v57731.js')){
   let out=unique(input,"import {nutritionParts} from './nutrition-intelligence-v57712.js';", "import {nutritionParts} from './nutrition-intelligence-v57712.js';\nimport {fatTrafficDashboard} from './nutrition-guidance-v57733.js';",'fat guidance import');
   out=unique(out,' <div class="ni731-chips">',' ${fatTrafficDashboard(model,{today})}\n <div class="ni731-chips">','fat dashboard before raw numbers');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   let out=unique(input,"import {mergePeopleDirectory} from './people-sync-v57719.js';", "import {mergePeopleDirectory} from './people-sync-v57719.js';\nimport {mergeDailyDozen} from './daily-dozen-v57733.js';",'daily dozen sync import');
   out=unique(out,'nutritionJournal:{entries:byId(lc.nutritionJournal?.entries,rc.nutritionJournal?.entries),customFoods:byId(lc.nutritionJournal?.customFoods,rc.nutritionJournal?.customFoods),',
    'nutritionJournal:{entries:byId(lc.nutritionJournal?.entries,rc.nutritionJournal?.entries),customFoods:byId(lc.nutritionJournal?.customFoods,rc.nutritionJournal?.customFoods),dailyDozen:mergeDailyDozen(lc.nutritionJournal?.dailyDozen,rc.nutritionJournal?.dailyDozen),','journal merge');
   return {code:out,map:null};
  }
  return null;
 }};
}
