/** Compass .40.25.11 · Restore the existing premium front/back muscle atlas
 * in the already compiled full-source entry without changing the legacy
 * strength-insights module (which the historical bridge/test chain consumes).
 * Read-only rendering. The same classified session model drives both views.
 */
import {strengthInsightsView as strengthLegacyView,strengthPeriod} from './strength-insights-v57728.js';
import {strengthPremiumMap} from './strength-premium-v57738.js';
import {strengthEditorView} from './strength-editor-v57732.js';

export function strengthInsightsView(state,opts={}){
 const {range='28',today,side='front'}=opts;
 const html=strengthLegacyView(state,opts);
 const from=html.indexOf('<div class="str728-visual">');
 const to=html.indexOf('<p class="str728-note"><strong>Wichtig:',from);
 if(from<0||to<from||html.indexOf('<div class="str728-visual">',from+1)!==-1)
  throw Error('Premium-Muskelkarte: historische Silhouetten-Integrationsstelle hat sich geändert.');
 const period=strengthPeriod(state,{range,today});
 // Reuse the anatomical atlas already shipped for Compass; the atlas itself
 // renders both sides and offers individual muscle details on hover/focus.
 const atlas=strengthPremiumMap(period,null,'strength',side);
 const withoutSilhouette=html.slice(0,from)+atlas+'\n '+html.slice(to);
 // Historic CSV, Garmin/FIT and coach sessions use the SAME saved session ID.
 // A pencil is attached to every rendered row, not only the newest CSV import.
 const journalSessions=[...period.sessions].reverse().slice(0,40);
 let rowIndex=0;
 const escapedId=x=>String(x??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
 const journalAction=withoutSilhouette.replace(/(<section class="str728-session"><header>[\s\S]*?)(<\/header>)/g,(_full,head,tail)=>{
  const session=journalSessions[rowIndex++];
  if(!session)throw Error('Trainingsjournal: Session-Zuordnung beim Bearbeiten inkonsistent.');
  return head+`<button type="button" class="str732-session-pencil" data-action="str732-edit" data-id="${escapedId(session.id)}" aria-label="Training vom ${escapedId(session.day)} bearbeiten" title="Übungen und Gewichte bearbeiten">✎</button>`+tail;
 }).replaceAll('Für Muskelgruppen und Einzelgewichte die Original-FIT-Datei dieser Aktivität exportieren.',
  'Übungen, Wiederholungen und Gewichte kannst du mit dem Stift direkt nachtragen.');
 if(rowIndex!==journalSessions.length)throw Error('Trainingsjournal: Anzahl der bearbeitbaren Sessions stimmt nicht überein.');
 // The frozen full-source entry bypassed the historical bridge that mounted
 // the existing per-set editor. Restore it *without* modifying Garmin imports.
 // Keep it above the large atlas so newly imported CSV-only sessions remain
 // actionable and visible instead of forcing users to scroll through charts.
 const kpiAnchor='<div class="str728-stats">';
 if(journalAction.split(kpiAnchor).length!==2)
  throw Error('Krafttraining-Editor: KPI-Integrationsstelle nicht eindeutig.');
 const editor=period.sessions.length?strengthEditorView(state,period.sessions,opts.editingId||''):'';
 const withEditor=journalAction.replace(kpiAnchor,editor+'\n '+kpiAnchor);
 // Two maps are visible together: the old one-side-only toggle is misleading.
 return withEditor.replace(/<div class="str728-ranges" role="group" aria-label="Körperansicht">[\s\S]*?<\/div>/,
  '<span class="c4011-both-sides">Vorder- und Rückseite gleichzeitig</span>');
}
