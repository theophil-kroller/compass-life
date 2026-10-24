/** Compass 0.5.77.27 · Additive, guarded Vite source bridge.
 * Keeps the upstream 0.5.77.26 main.js byte-for-byte untouched, and installs
 * the Nutrition 3 tab during Vite dev/build. Fails closed when upstream changes.
 */
export function nutrition3Bridge(){
 const apply=(source,needle,replacement,label)=>{
  const start=source.indexOf(needle);
  if(start<0||source.indexOf(needle,start+needle.length)!==-1)throw Error(`Nutrition 3 integration: eindeutiger Anker fehlt (${label}); 0.5.77.26 prüfen.`);
  return source.slice(0,start)+replacement+source.slice(start+needle.length);
 };
 return {
  name:'compass-nutrition-3-v57727',enforce:'pre',
  transform(source,id){
   if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
   let code=source;
   const replace=(find,withText,label)=>{code=apply(code,find,withText,label);};
   replace("const COMPASS_CLIENT_VERSION='0.5.77.26';", "const COMPASS_CLIENT_VERSION='0.5.77.27';",'Version');
   replace("import './nutrition-trends-v57726.css';", "import './nutrition-trends-v57726.css';\nimport {nutritionConnectionsView} from './nutrition-connections-v57727.js';\nimport './nutrition-connections-v57727.css';",'Import');
   replace("let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;",
    "let nutritionConnInput727='lastMeal',nutritionConnOutcome727='sleep',nutritionConnRange727='90';\nlet journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;",'lokale Auswahl');
   replace('📊 Nährstoff-Trends</button></nav>',
    '📊 Nährstoff-Trends</button><button type="button" data-action="ni712-view" data-id="connections" class="${nutritionView712===\'connections\'?\'selected\':\'\'}">🔗 Zusammenhänge</button></nav>', 'Insights-Reiter');
   const oldBranch="nutritionView712==='trends'?nutritionTrendsView(state,{mode:nutritionTrendsMode726,anchor:nutritionTrendsAnchor726,metric:nutritionTrendsMetric726}):nutritionHistoryView";
   const newBranch="nutritionView712==='trends'?nutritionTrendsView(state,{mode:nutritionTrendsMode726,anchor:nutritionTrendsAnchor726,metric:nutritionTrendsMetric726}):nutritionView712==='connections'?nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays}):nutritionHistoryView";
   replace(oldBranch,newBranch,'Nutrition-View');
   replace("['journal','nutrients','timing','trends'].includes(id)","['journal','nutrients','timing','trends','connections'].includes(id)",'Navigation');
   replace(' // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.',
` // Nutrition 3: independent, read-only scatter series and light-weight subpanel updates.
 if(action==='ni727-input'){
  if(!['lastMeal','kcal','protein','caffeine'].includes(id))return;
  nutritionConnInput727=id;refreshNutritionConnectionsPanel();return;
 }
 if(action==='ni727-range'){
  if(!['30','90','365','all'].includes(id))return;
  nutritionConnRange727=id;refreshNutritionConnectionsPanel();return;
 }
 // Nutrition 2: redraw only the selected trend charts, never the full app for navigation.`, 'Nutrition3 Aktionen');
   replace('function render(){',
`function refreshNutritionConnectionsPanel(){
 const host=app.querySelector('.ni727-root');
 if(!host||!state){render();return;}
 host.outerHTML=nutritionConnectionsView(state,{input:nutritionConnInput727,outcome:nutritionConnOutcome727,range:nutritionConnRange727,today:localDate(),healthDays});
 const next=app.querySelector('.ni727-root');
 next?.querySelectorAll('button[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});
 const selected=next?.querySelector('#ni727-outcome');
 if(selected)selected.onchange=()=>{nutritionConnOutcome727=selected.value;refreshNutritionConnectionsPanel();};
}
function render(){`, 'Teilansicht-Refresh');
   replace(" const balanceGoalsForm=app.querySelector('#lbr63-goals-form');",
` const nutritionConnSelect=app.querySelector('#ni727-outcome');
 if(nutritionConnSelect)nutritionConnSelect.onchange=()=>{
  nutritionConnOutcome727=nutritionConnSelect.value;refreshNutritionConnectionsPanel();
 };
 const balanceGoalsForm=app.querySelector('#lbr63-goals-form');`, 'Select-Handler');
   return {code,map:null};
  }
 };
}
