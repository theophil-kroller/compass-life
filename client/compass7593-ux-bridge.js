/** Compass UX 0.5.77.59.8 — Planning leisure + Life Balance first; retains .59.3 Focus/unlock.
 * Intentionally inserted between .56 and .57.1 so the production regression
 * gate still keeps the validated .57.1 -> .58 bridge pair as the final transforms.
 * No changes to vault encryption, data, analytics calculations or sync.
 */
export function compass7593UxBridge(){
  function replaceExactly(source, before, after, label){
    const count=source.split(before).length-1;
    if(count!==1)throw new Error(`Compass .59.3 ${label}: expected 1 source anchor, found ${count}`);
    return source.replace(before,after);
  }
  return {
    name:'compass-7593-external-insights-and-unlock-focus',
    enforce:'pre',
    transform(source,id){
      if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
      let s=source;
      const ch=(a,b,label)=>{s=replaceExactly(s,a,b,label);};

      // Recovery is now a planning route; never prepend Insights tabs to it.
      // Activity and progress remain external Insights routes.
      ch('return chrome(`<div class="activity-summary-insights">',
         'return chrome(`<div class="compass593-external-insights" aria-label="Gesundheit und Körper">${insights750Subtabs(\'activity\',insightTab)}</div><div class="activity-summary-insights">',
         'Aktivitäten: Gesundheit & Körper tabs');
      ch('return chrome(`<div class="progress-view">',
         'return chrome(`<div class="compass593-external-insights" aria-label="Zeit und Produktivität">${insights750Subtabs(\'progress\',insightTab)}</div><div class="progress-view">',
         'Fortschritt: Zeit & Produktivität tabs');

      // The Planen section is the single source for leisure opportunities and ideas.
      // Do not add another top navigation bar or duplicate the recovery content.
      ch("${navItem('forecast','Kalender & Forecast','calendar')}",
         "${navItem('forecast','Kalender & Forecast','calendar')}\n ${navItem('recovery','Freizeit & Erholung','heart')}",
         'leisure planning entry');
      ch("'hold','someday'].includes(tab)?'plan':tab==='insights'||tab==='activity'||tab==='progress'||tab==='recovery'?'insights'",
         "'hold','someday','recovery'].includes(tab)?'plan':tab==='insights'||tab==='activity'||tab==='progress'?'insights'",
         'initial planning navigation selection');
      ch("'flagged','hold','someday'].includes(tab)?'plan':['insights','activity','progress','recovery'].includes(tab)?'insights'",
         "'flagged','hold','someday','recovery'].includes(tab)?'plan':['insights','activity','progress'].includes(tab)?'insights'",
         'navigation group after route selection');
      // The original Focus guard intentionally redirects analytic views to Today.
      // Opening the leisure planner is an explicit user choice of an extended
      // planning workspace, not a request to change the unlock default.
      ch("if(target==='today')todayInspectorOpen=false;tab=target;",
         "if(target==='today')todayInspectorOpen=false;"+
         "if(target==='recovery'){compass55Mode='extended';try{localStorage.setItem(COMPASS55_MODE_KEY,'extended');}catch{}}"+
         "tab=target;",
         'explicit leisure navigation can open from Focus');
      // The older .55 bridge sets the Insights group header to the old cockpit.
      // Handle that header before the legacy branch, without touching old Vite
      // plugins or the Finance group's action.
      ch("if(action==='calm-finance-group'){",
         "if(action==='calm-nav-group'&&id==='insights'){tab='insights';insightTab='balance';calmNavGroup='insights';render();return;}\n    if(action==='calm-finance-group'){",
         'Insights header opens Life Balance');

      // A consciously selected Extended mode is valid for the current unlocked
      // session only. On NEXT successful unlock, Focus/Today is the default.
      // Failed unlocks must not silently alter the user's mode.
      // ?capture=1 and explicit ?view= links retain priority; otherwise start Today.
      ch("if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}toast('Lokaler Tresor bereit'+recoveryMessage+'.');",
         "compass55Mode='focus';\n"+
         "      try{localStorage.setItem(COMPASS55_MODE_KEY,'focus');}catch{}\n"+
         "      if(!captureAfterUnlock&&!bootView){tab='today';todayInspectorOpen=false;calmNavGroup='';}\n"+
         "      if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}toast('Lokaler Tresor bereit'+recoveryMessage+'.');",
         'successful vault unlock resets session to Focus');
      return {code:s,map:null};
    }
  };
}
