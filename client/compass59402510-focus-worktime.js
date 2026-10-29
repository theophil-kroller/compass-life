/** Compass .40.25.10 — last in the Vite transform chain. Strict one-anchor edits. */
export function compass59402510FocusWorktime(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.10 ${label}: expected 1 anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-59402510-focus-worktime',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.9','Build 0.5.77.59.40.25.10','lock version'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.9';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.10';",'version');
  s=once(s,'Build 0.5.77.59.40.25.9','Build 0.5.77.59.40.25.10','footer');
  s=once(s,"import {calendarBirthdayCandidates,familyWorkerSnapshot,createDeferredFamilyCache} from './today-core-deferred-v5775940259.js';",
    "import {calendarBirthdayCandidates,familyWorkerSnapshot,createDeferredFamilyCache} from './today-core-deferred-v5775940259.js';\nimport {focusActivityTypeChoices} from './activity-management.js';\nimport {timeProgressMarkup,projectTimeText} from './focus-productivity-v57759402510.js';\nimport './focus-productivity-v57759402510.css';",'imports');
  s=once(s,'timeJournalView(state,{period:timeJournalPeriod,editingId:timeJournalEditId,showForm:timeJournalShowForm})',
    'timeJournalView(state,{period:timeJournalPeriod,editingId:timeJournalEditId,showForm:timeJournalShowForm,watchActivities:activeActivities(watchSessions,state)})','journal merge');
  s=once(s,` const stats=activityStats(activeActivities(watchSessions,state),begin,today);`,
    ` const stats=activityStats(activeActivities(watchSessions,state),begin,today);\n const focusTimeProgress=timeProgressMarkup(activeActivities(watchSessions,state),begin,today);`,'progress data');
  s=once(s,'<div class="progress-view"><section class="work-card">',
    '<div class="progress-view"><section class="work-card">','progress shell'); // preserve existing structure
  s=once(s,'<button type="button" class="text-link" data-tab="activity">Sessions verwalten ${ico(\'arrow\',14)}</button></section><section class="work-card">',
    '<button type="button" class="text-link" data-tab="activity">Sessions verwalten ${ico(\'arrow\',14)}</button>${focusTimeProgress}</section><section class="work-card">','progress categories');
  s=once(s,'<div class="progress-track" aria-hidden="true"><span style="width:${tasks.length?Math.round(completed/tasks.length*100):0}%"></span></div></button>',
    '<div class="progress-track" aria-hidden="true"><span style="width:${tasks.length?Math.round(completed/tasks.length*100):0}%"></span></div><small class="c4010-project-time">${h(projectTimeText(activeActivities(watchSessions,state),p.id))}</small></button>','project hours');
  s=once(s,` const choices=ACTIVITY_CATEGORIES.map(c=>\`<option value="\${h(c)}" \${chosen?.category===c?'selected':''}>\${h(c)}</option>\`).join('');`,
    ` const choices=ACTIVITY_CATEGORIES.map(c=>\`<option value="\${h(c)}" \${chosen?.category===c?'selected':''}>\${h(c)}</option>\`).join('');\n const typeChoices=focusActivityTypeChoices.map(c=>\`<option value="\${h(c.type)}" \${chosen?.activityType===c.type?'selected':''}>\${h(c.label)}</option>\`).join('');`,'type choices');
  s=once(s,'<label>Art<select name="category">${choices}</select></label><label>Datum und Uhrzeit',
    '<label>Lebensbereich<select name="category">${choices}</select></label><label>Tätigkeitsart<select name="activityType">${typeChoices}</select></label>${chosen.activityTypeReview?\'<small class="c4010-review-warning">Historische Prüfungssession: Bitte Korrektur oder Prüfungsmodus bestätigen.</small>\':\'\'}<label>Datum und Uhrzeit','inspector type');
  s=once(s,"projectId:String(d.get('projectId')||'')};","projectId:String(d.get('projectId')||''),activityType:String(d.get('activityType')||'')};",'edit type save');
  s=once(s,`async function reloadWatchSessions(){
 if(!authToken)return;
 try{const [data,dev]=await Promise.all([request(config.apiUrl,authToken,'/api/watch/sessions'),request(config.apiUrl,authToken,'/api/watch/devices')]);watchSessions=data.sessions||[];watchDevices=dev.devices||[];watchError='';if(['activity','overview','insights','recovery','progress'].includes(tab))render();}
 catch(ex){watchError='Uhr-Daten derzeit nicht erreichbar ('+ex.message+').';render();}
}`,
`let watchHistoryLoading=null;
let watchHistoryComplete=false;
async function reloadWatchSessions(){
 if(!authToken)return;
 const deepHistory=['activity','progress','overview'].includes(tab)||(tab==='insights'&&['focus','timejournal'].includes(insightTab));
 if(watchHistoryLoading)return deepHistory&&!watchHistoryComplete
   ?watchHistoryLoading.then(()=>watchHistoryComplete?undefined:reloadWatchSessions())
   :watchHistoryLoading;
 const token=authToken;
 watchHistoryLoading=(async()=>{
  try{
   const [first,dev]=await Promise.all([request(config.apiUrl,token,'/api/watch/sessions?limit='+(deepHistory?200:50)),request(config.apiUrl,token,'/api/watch/devices')]);
   let all=first.sessions||[],cursor=first.nextCursor||null,pages=1;
   if(!deepHistory)cursor=null;
   const cursors=new Set();
   while(cursor&&pages<100&&token===authToken){
    if(cursors.has(cursor))throw new Error('Garmin-Historie: Cursor wiederholt');
    cursors.add(cursor);
    const page=await request(config.apiUrl,token,'/api/watch/sessions?limit=200&cursor='+encodeURIComponent(cursor));
    all.push(...page.sessions||[]);cursor=page.nextCursor||null;pages++;
   }
   if(cursor)throw new Error('Garmin-Historie über 20.000 Sessions: bitte Bericht pagination prüfen');
   if(token!==authToken)return;
   watchSessions=[...new Map(all.map(s=>[s.id,s])).values()];watchDevices=dev.devices||[];watchHistoryComplete=deepHistory;watchError='';
   if(['activity','overview','insights','recovery','progress'].includes(tab))render();
  }catch(ex){watchError='Garmin-Historie unvollständig: '+ex.message;render();}
 })();
 try{return await watchHistoryLoading;}finally{watchHistoryLoading=null;}
}`,'page history');
  s=once(s,"if(id==='focus'&&authToken){reloadWatchSessions().catch(()=>{});}","if(['focus','timejournal'].includes(id)&&authToken){reloadWatchSessions().catch(()=>{});}",'insights refresh');
  s=once(s,'Garmin: letzte maximal 50 Sessions plus manuelle Einträge;',
    'Garmin: aktuell abgerufene Sessions plus manuelle Einträge;','overview caption');
  return {code:s,map:null};
 }};
}
