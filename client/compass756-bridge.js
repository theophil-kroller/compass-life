/** Compass 0.5.77.56 – lightweight, GTD-first Today.
 * Requires successful .55.2 bridge and its existing target Inspector bindings.
 * Conservatively leaves storage, encrypted Vault, task handlers and cloud sync alone.
 */
export function compass756Bridge(){
 const once=(s,a,b,label)=>{
  const n=s.split(a).length-1;
  if(n!==1)throw Error('Compass .56: '+label+': source anchor found '+n+' times');
  return s.replace(a,b);
 };
 return {name:'compass-756-gtd-workspace',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;
  const ch=(a,b,label)=>{s=once(s,a,b,label);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.55.2';","const COMPASS_CLIENT_VERSION='0.5.77.56';",'version');
  ch("import './occasion-compact-v577552.css';","import './occasion-compact-v577552.css';\nimport './gtd-workspace-v57756.css';",'stylesheet');
  // Replace two long textual pills by one target icon which toggles modes.
  const modeStart='<div class="compass55-mode-switch" role="group" aria-label="Compass Anzeigemodus">';
  const a=s.indexOf(modeStart),b=a<0?-1:s.indexOf('</div>',a);
  if(a<0||b<0||s.indexOf(modeStart,a+1)>=0)throw Error('Compass .56: mode switch boundaries missing');
  const icon='<div class="compass55-mode-switch compass56-mode-switch" role="group" aria-label="Anzeigemodus"><button type="button" data-action="compass55-mode" data-id="${compass55Mode===\'focus\'?\'extended\':\'focus\'}" class="compass56-mode-button ${compass55Mode===\'focus\'?\'is-active\':\'\'}" aria-label="${compass55Mode===\'focus\'?\'Focus aktiv. Zu Extended wechseln\':\'Extended aktiv. Zu Focus wechseln\'}" aria-pressed="${compass55Mode===\'focus\'}" title="${compass55Mode===\'focus\'?\'Focus (zu Extended wechseln)\':\'Extended (zu Focus wechseln)\'}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.25"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/></svg></button></div>';
  s=s.slice(0,a)+icon+s.slice(b+'</div>'.length);
  // Use the existing .55 shared inspector renderer, never duplicate editor fields.
  const i=s.indexOf('function compass55InspectorContent(){');
  const j=i<0?-1:s.indexOf('\nfunction todayWork(locked=false){',i);
  if(i<0||j<0)throw Error('Compass .56: shared Inspector missing');
  const section=s.slice(i,j);
  const needle=':todaySmartPanel()';
  if(section.split(needle).length!==2)throw Error('Compass .56: Inspector recommendation branch changed');
  const replacement=':(compass56RecommendationMarkup&&compass56RecommendationDay===selectedDay?compass56RecommendationPanel():compass56RecommendationButton())';
  s=s.slice(0,i)+section.replace(needle,replacement)+s.slice(j);
  // Expensive dashboards are no longer constructed by the ordinary Today route.
  ch('function todayScreen(){return chrome(`${calendarDeadlinePanel()}${occasionPanel()}${todayWork()}`);}',
     'function todayScreen(){return chrome(compass56TodayWorkspace());}', 'Today route');
  const src="\n// Only the requested Intelligence runs. A rendered recommendation remains a snapshot.\nlet compass56RecommendationMarkup='';\nlet compass56RecommendationDay='';\nlet compass56PlanningOpen=false;\nfunction compass56RecommendationButton(){\n return '<section class=\"compass56-inspector-peek\"><button type=\"button\" class=\"compass56-smart-button\" data-action=\"compass56-recommend\" title=\"Empfehlungen jetzt berechnen\">'+ico('spark',17)+' Empfehlungen berechnen</button></section>';\n}\nfunction compass56RecommendationPanel(){\n return '<div class=\"compass56-recommend-result\"><div class=\"compass56-recommend-actions\"><button type=\"button\" data-action=\"compass56-recommend\" title=\"Vorschläge neu berechnen\">↻</button><button type=\"button\" data-action=\"compass56-recommend-close\" aria-label=\"Vorschläge schließen\" title=\"Schließen\">×</button></div>'+compass56RecommendationMarkup+'</div>';\n}\nfunction compass56TodayWorkspace(){\n const day=selectedDay,actual=day===localDateString(new Date());\n const tasks=tasksForDay(state,day).filter(t=>!waitingSourceId(t));\n const formatted=new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric',month:'long'}).format(new Date(day+'T12:00:00'));\n const completed=tasks.filter(t=>t.completed).length;\n return `<div class=\"today-layout compass56-today\">\n  ${calendarRail()}\n  <div class=\"today-center compass56-main\">\n   <section class=\"work-card today-tasks compass56-primary\" aria-label=\"Tagesaufgaben\">\n    <div class=\"work-heading compass56-title\"><div><span class=\"compass56-title-main\">${actual?'Heute':h(formatted)}</span><small>${h(formatted)}</small></div><span class=\"quiet-tag\">${completed} / ${tasks.length} erledigt</span></div>\n    ${taskList(tasks,'day')}\n    <details class=\"calm-create compass56-add\"><summary>${ico('plus',15)} Aufgabe hinzufügen</summary>${taskCreateForm(day)}</details>\n    <div class=\"capture-inline compass56-capture\"><form id=\"capture-form\"><label class=\"sr-only\" for=\"capture\">In die Inbox erfassen</label><input id=\"capture\" name=\"title\" maxlength=\"1000\" required placeholder=\"Zur Inbox hinzufügen …\"/><button type=\"submit\" class=\"primary-btn\" aria-label=\"In Inbox erfassen\" title=\"In Inbox erfassen\">${ico('plus',17)}</button></form></div>\n   </section>\n   <section class=\"work-card appointments compass56-calendar\"><div class=\"work-heading\"><span>${ico('calendar',18)} Termine</span><button type=\"button\" class=\"compass56-link\" data-tab=\"forecast\">Forecast ${ico('arrow',14)}</button></div>\n     ${calendarToken?calendarCardRows(day):calendarConnectUI()}</section>\n   ${compass56PlanningOpen?`<section class=\"compass56-extra\" aria-label=\"Weitere Tagesplanung\">\n      ${yesterday710Panel(day)}${waiting715TodayPanel(day)}${calendarDeadlinePanel()}${occasionPanel()}${eventAgendaPanel()}${actual?researchRefreshPanel('today'):''}\n      <div class=\"compass56-slim-review\">${gtdTodaySummary()}</div>\n   </section>`:''}\n   <button type=\"button\" class=\"compass56-expand\" data-action=\"compass56-planning\" aria-expanded=\"${compass56PlanningOpen}\">${compass56PlanningOpen?'Weniger anzeigen':'Weitere Planung'} ${ico(compass56PlanningOpen?'arrow':'plus',14)}</button>\n  </div>\n  <aside class=\"inspector-rail today-context-rail\" aria-label=\"${todayInspectorOpen?'Aufgaben-Inspector':'Empfehlungen'}\">${compass55InspectorContent()}</aside>\n </div>`;\n}\n";

  ch('function todayScreen(){return chrome(compass56TodayWorkspace());}',src+'\nfunction todayScreen(){return chrome(compass56TodayWorkspace());}','workspace renderer');
  ch("if(action==='finance-pane'){",
    "if(action==='compass56-recommend'){compass56RecommendationDay=selectedDay;compass56RecommendationMarkup=todaySmartPanel();render();return;}\n"+
    "    if(action==='compass56-recommend-close'){compass56RecommendationMarkup='';compass56RecommendationDay='';if(!compass55RefreshInspector())render();return;}\n"+
    "    if(action==='compass56-planning'){compass56PlanningOpen=!compass56PlanningOpen;render();return;}\n"+
    "    if(action==='finance-pane'){",'explicit request handlers');
  return {code:s,map:null};
 }};
}
