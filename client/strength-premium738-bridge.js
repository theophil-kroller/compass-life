/** Compass .39 · apply AFTER .37.1; fail visibly on changed integration contracts. */
export function strengthPremium738Bridge(){
 const once=(text,from,to,label)=>{
  if(text.split(from).length!==2)throw Error(`Compass 0.5.77.39: Integrationsstelle nicht eindeutig (${label}). Prüfe den vollständigen Build 0.5.77.37.1.`);
  return text.replace(from,to);
 };
 return {name:'compass-premium-strength-739',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/main.js')){
   let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.37.1';","const COMPASS_CLIENT_VERSION='0.5.77.39';",'version');
   s=once(s,"import './strength-recent-defaults-v577371.css';","import './strength-recent-defaults-v577371.css';\nimport './strength-premium-v57738.css';",'premiummuskelkarte styles');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-insights-v57728.js')){
   let s=source;
   s=once(s,"import {detailedMuscleSvg,detailedMuscleTable,cyclingMuscleSummary} from './strength-anatomy-v57737.js';",
     "import {detailedMuscleSvg,detailedMuscleTable,cyclingMuscleSummary} from './strength-anatomy-v57737.js';\nimport {strengthPremiumTimeline,strengthPremiumKpis,strengthPremiumMap} from './strength-premium-v57738.js';",'premium module');
   s=once(s,'<section class="work-card"><div class="work-heading"><span>💪 Krafttraining · Muscle Map',
     '<section class="work-card str738-shell"><div class="work-heading"><span>💪 Krafttraining · Muscle Map','gym dashboard class');
   s=once(s,'\n ${m.csvOnly||m.csvExtra?',
     '\n ${strengthPremiumTimeline(m,cycling,{range,today})}\n ${m.csvOnly||m.csvExtra?', 'heatmap placement');
   s=once(s,' ${strengthEditorView(state,m.sessions,editingId)}\n <div class="str728-stats">',
     ' <div class="str728-stats">', 'move editor below main map');
   const statsBegin='<div class="str728-stats">${stat(\'Trainingstage\'';
   const statsEnd='</div>\n <div class="str737-activity-tabs"';
   const start=s.indexOf(statsBegin),end=s.indexOf(statsEnd,start);
   if(start<0||end<start||s.indexOf(statsBegin,start+1)!==-1)throw Error('Compass .39: Kachelzeile fehlt / unerwartetes Layout.');
   s=s.slice(0,start)+'${strengthPremiumKpis(m,cycling)}\n <div class="str737-activity-tabs"'+s.slice(end+statsEnd.length);
   const vizStart='<div class="str728-visual"><div class="str728-body-panel"><div class="str735-two-maps">';
   const vizEnd='\n <p class="str728-note"><strong>Wichtig:';
   const from=s.indexOf(vizStart),to=s.indexOf(vizEnd,from);
   if(from<0||to<from||s.indexOf(vizStart,from+1)!==-1)throw Error('Compass .39: veraltetes Anatomielayout gefunden; Redesign angehalten.');
   s=s.slice(0,from)+'${strengthPremiumMap(m,cycling,activity,side)}'+s.slice(to);
   s=once(s,'\n </section>\n <section class="work-card"><div class="work-heading"><span>📈 Trainingsrhythmus',
     '\n </section>\n ${strengthEditorView(state,m.sessions,editingId)}\n <section class="work-card"><div class="work-heading"><span>📈 Trainingsrhythmus', 'editor follows body card');
   return {code:s,map:null};
  }
  return null;
 }};
}
