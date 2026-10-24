/** Compass .32: additive bridge after Nutrition .31.
 * Mobile nutrition capture: tiles first; hold modal DOM steady during background sync.
 * Strength: persistent manual annotations independent from (repeatable) Garmin imports.
 * Fat guidance: Dr Greger / NutritionFacts.org is the primary requested orientation.
 */
export function strengthNutrition732Bridge(){
 const unique=(source,from,to,label)=>{
  if(source.split(from).length!==2)throw Error(`Compass .32: Integrationsanker fehlt oder mehrdeutig: ${label}. Erwartete Basis 0.5.77.31.`);
  return source.replace(from,to);
 };
 return {name:'compass-strength-nutrition-732',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let out=source;const change=(a,b,label)=>{out=unique(out,a,b,label);};
   change("const COMPASS_CLIENT_VERSION='0.5.77.31';","const COMPASS_CLIENT_VERSION='0.5.77.32';",'version');
   change("import './nutrition-connections-v57727.css';", "import './nutrition-connections-v57727.css';\nimport {putStrengthAnnotation,strengthSetRow} from './strength-editor-v57732.js';\nimport './strength-editor-v57732.css';",'strength editor imports');
   change("let nutritionFatDays731='30',nutritionFatMetric731='saturated';","let nutritionFatDays731='30',nutritionFatMetric731='saturated',strengthEditId732='';",'strength edit state');
   change("${quickEnergyMeter(state)}${state?mealComposerMarkup(mealComposeText,mealComposeModel):''}${nutritionQuickView(state)}", "${nutritionQuickView(state)}${quickEnergyMeter(state)}${state?mealComposerMarkup(mealComposeText,mealComposeModel):''}",'quick tiles before manual entry');
   change('function render(){\n const renderMeasurement=performanceTrace.start();',
`function render(){
 // Mobile modal must remain mounted while open: background sync/health reloads must
 // not reset scroll, keyboard, touch focus or rebuild hundreds of unrelated nodes.
 // Opening/closing remains explicit: nutritionQuickOpen false immediately enables render.
 if(nutritionQuickOpen&&state&&app.querySelector('.pj92-food-panel'))return;
 const renderMeasurement=performanceTrace.start();`,'mobile modal stable');
   // Both full-page and localized refresh must preserve editor's current selection.
   change('strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today})', 'strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today,editingId:strengthEditId732})','strength main view');
   change('strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today:localDate()})', 'strengthInsightsView(state,{range:strengthRange728,side:strengthSide728,today:localDate(),editingId:strengthEditId732})','strength refresh');
   change('function bind() {',`function bindStrengthEditor732(){
 const strengthForm=app.querySelector('#str732-form');
 if(strengthForm)strengthForm.onsubmit=async ev=>{
  ev.preventDefault();if(!state)return;
  const rows=[...strengthForm.querySelectorAll('[data-strength-set]')];
  const fd=new FormData(strengthForm);
  const sets=rows.map((row,i)=>({exerciseId:String(fd.get('exercise-'+i)||''),reps:fd.get('reps-'+i),weightKg:fd.get('weight-'+i)}));
  try{journalSyncStatus='lokal';await mutate(st=>putStrengthAnnotation(st,{sessionId:strengthForm.dataset.sessionId,start:strengthForm.dataset.start,sets}),null,true);
   strengthEditId732='';refreshStrength728();toast('Übungen und Gewichte lokal gespeichert · Muskelkarte aktualisiert.');
  }catch(ex){toast(ex.message,true);}
 };
}
function bind() {
 bindStrengthEditor732();`,'strength editor save');
   change("app.querySelector('.str728-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});",
    "app.querySelector('.str728-root')?.querySelectorAll('[data-action]').forEach(el=>{el.onclick=()=>runAction(el.dataset.action,el.dataset.id);});\n bindStrengthEditor732();", 'local strength editor rebinding');
   change(' // Strength: fast local map toggle, without re-rendering the whole GTD app.',
` // Manual muscle map: all edits local, original Garmin data never changed.
 if(action==='str732-edit'){strengthEditId732=id;refreshStrength728();return;}
 if(action==='str732-cancel'){strengthEditId732='';refreshStrength728();return;}
 if(action==='str732-add-set'){
  const form=app.querySelector('#str732-form'),rows=form?.querySelector('.str732-rows');if(!rows)return;
  const i=rows.querySelectorAll('[data-strength-set]').length;
  if(i>=80)return toast('Maximal 80 Sätze je Training.',true);
  rows.insertAdjacentHTML('beforeend',strengthSetRow(i));
  rows.lastElementChild?.querySelector('select')?.focus({preventScroll:true});return;
 }
 // Strength: fast local map toggle, without re-rendering the whole GTD app.`, 'strength editor events');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/strength-insights-v57728.js')){
   let out=source;const change=(a,b,label)=>{out=unique(out,a,b,label);};
   change("import {MUSCLE_GROUPS,strengthMuscles,mergeStrengthImports} from './garmin-strength-v57728.js';",
    "import {MUSCLE_GROUPS,strengthMuscles,mergeStrengthImports} from './garmin-strength-v57728.js';\nimport {applyStrengthAnnotations,manualExerciseMuscles,strengthEditorView} from './strength-editor-v57732.js';",'strength editor imports');
   change('return [...fits,...summaries].sort((a,b)=>a.start.localeCompare(b.start));',
    'return applyStrengthAnnotations(state,[...fits,...summaries]).sort((a,b)=>a.start.localeCompare(b.start));','annotations merge');
   change('const category=strengthMuscles(set.category);',
    'const category=set.exerciseId?manualExerciseMuscles(set.exerciseId):strengthMuscles(set.category);','manual muscle mapping');
   change("export function strengthInsightsView(state,{range='28',side='front',today=day(new Date())}={}){",
    "export function strengthInsightsView(state,{range='28',side='front',today=day(new Date()),editingId=''}={}){",'strength edit option');
   change(" <div class=\"str728-stats\">${stat('Trainingstage'", " ${strengthEditorView(state,m.sessions,editingId)}\n <div class=\"str728-stats\">${stat('Trainingstage'", 'edit block before map');
   change('Für Muskelgruppen und Einzelgewichte die Original-FIT-Datei dieser Aktivität exportieren.',
    'Für die Muskelkarte diese Einheit oben im Übungseditor zuordnen – ohne zusätzlichen FIT-Export.','CSV info');
   change('für die farbige Muskelkarte fehlt die individuelle Aktivitäts-FIT-Datei.',
    'für die farbige Muskelkarte kannst du Übungen und Gewichte direkt in Compass ergänzen.','summary info');
   return {code:out,map:null};
  }
  if(path.endsWith('/client/src/nutrition-fat-quality-v57731.js')){
   const begin='<div class="ni731-guides"><h3>Wissenschaftliche Referenzwerte (DGE / ÖGE)</h3>';
   const start=source.indexOf(begin),end=source.indexOf(' <details class="ni731-catalog">',start);
   if(start<0||end<start)throw Error('Compass .32: Greger Orientierung: Nutrition .31 card layout nicht gefunden.');
   const guide=`<div class="ni731-guides"><h3>Orientierung nach Dr. Michael Greger · NutritionFacts.org</h3><div class="ni731-guide-grid"><div><strong>Daily Dozen</strong><span>1 Portion Leinsamen pro Tag</span></div><div><strong>Nüsse &amp; Samen</strong><span>1 Portion täglich</span></div><div><strong>Lebensmittelwahl</strong><span>Unverarbeitete pflanzliche Lebensmittel als Schwerpunkt</span></div><div><strong>EPA / DHA</strong><span>250 mg/Tag aus Algen- oder Hefenöl erwägen (Greger: Optimum Nutrients)</span></div></div><p>Das sind Greger-Empfehlungen, keine automatische Ernährungspflicht. ALA aus Leinsamen und EPA/DHA werden getrennt erfasst; fehlende Produktanalysen bleiben unbekannt. Der Daily Dozen ist eine Orientierung und keine vollständige Messung deiner täglichen Ernährung.</p><a href="https://nutritionfacts.org/topics/daily-dozen/" target="_blank" rel="noopener noreferrer">NutritionFacts.org · Daily Dozen ↗</a> · <a href="https://nutritionfacts.org/optimum-nutrient-recommendations/" target="_blank" rel="noopener noreferrer">Optimum Nutrient Recommendations ↗</a></div>`;
   return {code:source.slice(0,start)+guide+source.slice(end),map:null};
  }
  return null;
 }};
}
