/** Compass UX 0.5.77.59.3 — external Insights navigation and Focus on unlock.
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

      // The taxonomy in insights-navigation-v57750.js lists activity, recovery,
      // and progress as external routes; their screens bypass insightsScreen().
      // Restore the SAME, already-working subtab navigation for those routes.
      // The existing ins750-open handler handles all transitions; do not fork it.
      ch('return chrome(`${discoveryPanel()}<section class="work-card recovery-idea-hub"',
         'return chrome(`<div class="compass593-external-insights" aria-label="Leben und Orte">${insights750Subtabs(\'recovery\',insightTab)}</div>${discoveryPanel()}<section class="work-card recovery-idea-hub"',
         'Erholung: Leben & Orte tabs');
      ch('return chrome(`<div class="activity-summary-insights">',
         'return chrome(`<div class="compass593-external-insights" aria-label="Gesundheit und Körper">${insights750Subtabs(\'activity\',insightTab)}</div><div class="activity-summary-insights">',
         'Aktivitäten: Gesundheit & Körper tabs');
      ch('return chrome(`<div class="progress-view">',
         'return chrome(`<div class="compass593-external-insights" aria-label="Zeit und Produktivität">${insights750Subtabs(\'progress\',insightTab)}</div><div class="progress-view">',
         'Fortschritt: Zeit & Produktivität tabs');

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
