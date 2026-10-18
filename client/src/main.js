import {REVIEW_STEPS,newReview,validReview,reviewQueue,projectReviewSummary,nextReviewStep,reviewedStep} from './guided-review.js';
import {wireSmartTags,rememberTag} from './smart-tags.js';
import {personCalendarEvents} from './people-matching.js';
import './style.css';
import {allRecoveryIdeas,scoreRecoveryIdeas,recoveryWeather,validRecoveryIdea} from './recovery-ideas.js';
import {assertCompatibleWorker} from './health-check.js';
import {parseEventImport,upcomingImportedEvents,discoveryPromptRegional,discoveryPromptTravel,eventKey,eventAppearance as discoveryAppearance,EVENT_CATEGORIES,eventArea,eventCountry} from './event-import.js';
import {eventState,queueEvent,queueEventPreference,removeEvents,prunePastEvents,pendingEventBatch,acknowledgeEventBatch,mergeEventSnapshot,resolveEventConflict} from './event-sync.js';
import {healthViewModel,healthBars,healthTime,healthObservation} from './health-visual.js';
import {inspectHealthFiles,commitHealthImport,missingGarminDays} from './health-import.js';
import {importedHealthDashboard,healthSourcesView,healthBodyView,healthConnectActivityView} from './health-dashboard.js';
import {financePreviewView,FINANCE_PANES} from './finance-preview.js';
import {INSIGHT_TABS,INSIGHT_PERIODS,buildSleepInsights,insightsSleepView,insightsPlannedView} from './insights.js';
import {insightsStressView,insightsEnergyView} from './insights-wellness.js';
import {fitnessInsightsView} from './insights-fitness.js';
import {registerSW} from 'virtual:pwa-register';
import * as vault from './vault.js';
import {request,nextBatch,applyResult,mergePulled,sameItemContent,pruneIdenticalConflicts} from './sync.js';
import {DEFAULT_CALENDAR_RULES,CALENDAR_CATEGORIES,effectiveCalendarRules,classifyCalendarEvent,validCalendarRule,validCalendarOverride,visibleCalendarEventsForDay,isRoutineCalendarBlock} from './calendar-rules.js';
import {ACTIVITY_CATEGORIES,isoLocal,validActivityEdit,validManualActivity,projectActivities,activeActivities,activityStats,timelineItems} from './activity-management.js';
import {OCCASION_STEPS,OCCASION_LEAD_DAYS,daysUntil,occasionStepKey,occasionTaskTag,relatedOccasionTask,occasionTask,validCustomStep,shiftDay} from './occasion-planning.js';
import {occasionsWithPeople,validPersonBirthday} from './people-occasions.js';
import {contextChoices,filterContextTasks} from './context-perspectives.js';
import {prepareTasks,TASK_CATEGORIES,CATEGORY_LABELS,validLocalTask,taskPlain,sameTask,localDate,tasksForDay,dueTasks,mergeTaskSnapshot,parseTags,nextActions,flaggedTasks,heldTasks,projectTasks,validProject,projectPlain,sameProject,mergeProjectSnapshot,agendaForEvent,projectNeedsReview,contextsFor,blockedByProject,dreamRecords,inboxRecords,childProjects,projectDescendantIds,validProjectParent,validTaskParent,hierarchicalProjectTasks,taskChildren,ordered} from './tasks.js';

registerSW({immediate:true});
const COMPASS_CLIENT_VERSION='0.5.10';
const app=document.getElementById('app');
let config={apiUrl:'',googleClientId:''};
let state=null, hasVault=false, authToken='', currentUser='', busy=false, notice='', error='', tab='today', lastActivity=Date.now();
let saveQueue=Promise.resolve();
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
let selectedDay=localDateString(new Date());
let selectedInboxId=null;
let selectedDreamId=null;
let selectedTaskId=null;
let selectedProjectId=null;
let projectFocus=false;
const projectCollapsed=new Set();
let selectedAgendaEventId=null;
let calendarRulesOpen=false,showHiddenCalendarEvents=false;
let reviewWorkflow='next';
let reviewEditingTaskId=null,reviewProjectId=null;
let activitySelectedId=null,activityTrash=false,overviewHorizon=30,overviewWeek=0,selectedTimelineDay='',selectedPersonId=null,occasionOpen=true;
const reviewDrafts=new Map();
function captureReviewDraft(){const form=app?.querySelector('#review-commit-form');if(form?.dataset.id)reviewDrafts.set(form.dataset.id,Object.fromEntries(new FormData(form).entries()));}
let showCalendarBlocks=false;
let showCaptureDetails=false;
let contextFilter='';
let recoveryIdeaMinutes=180,recoveryIdeaEnergy='medium',recoveryIdeaRange='trip';
let syncResyncRequested=false;
let syncTimer=null, lastSyncAt=0;
const SYNC_INTERVAL_MS=15*60*1000;
const CHANGE_DEBOUNCE_MS=7000;
function scheduleSync(delay=CHANGE_DEBOUNCE_MS) {
  if(!state||!authToken||!navigator.onLine||document.visibilityState==='hidden')return;
  clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{syncTimer=null;syncNow().catch(()=>{});},delay);
}
async function resumeSession(){
  if(!state)return;
  try {
    const session=await vault.loadSession();
    if(!session)return;
    authToken=session.token;currentUser=session.email;
    render();
    reloadWatchSessions().catch(()=>{});
    reloadHealth().catch(()=>{});
    reloadWidgetDevices().catch(()=>{});
    if(!navigator.onLine)return;
    const who=await request(config.apiUrl,authToken,'/api/me');
    currentUser=who.email;render();
    await syncNow();
  }catch(ex){
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession();toast('Compass-Sitzung abgelaufen. Bitte einmalig mit Google anmelden.');}
    else {error='Verbindung derzeit nicht erreichbar. Lokale Erfassung bleibt möglich.';render();}
  }
}

let captureOverlayOpen=false;
let captureAfterUnlock=false;
let inboxQuery='';
const bootSearch=new URLSearchParams(location.search);
const bootCapture=bootSearch.get('capture')==='1';
const bootView=bootSearch.get('view');
if(['today','inbox','review','forecast','overview','someday','activity','people','progress','recovery','insights','finance','projects','next','flagged','hold'].includes(bootView))tab=bootView;
if(bootView==='health')tab='insights';
if(bootCapture){captureAfterUnlock=true;tab='inbox';}

let watchPairCode='', watchPairExpires='', watchSessions=[], watchDevices=[], watchError='';
let healthDays=[],healthDevices=[],healthPairCode='',healthError='',healthLastUpdated='';
let widgetPairCode='',widgetDevices=[],widgetConnectError='';
let healthSpan=7,healthDetailsOpen=false,healthDevicesOpen=false;
let importHealthSpan=90,selectedGarminNight='',healthFilePreview=null,healthFileReading=false;
let insightWellnessDay='';
let insightTab=bootView==='health'?'sources':'sleep',insightPeriod='28',insightNight='',financePane='Überblick';
let discoveryRange='week',discoveryCity='all',discoveryArea='all',discoveryCategory='all',discoveryImportOpen=false,discoveryWeekOffset=0,discoveryImportPreview=null;
const discoveryExpandedDays=new Set();
// Calendar OAuth is independent from Compass login; token stays in RAM only.
let calendarToken='', calendarExpires=0, calendarEvents=[], calendarStatus='Nicht verbunden', calendarBusy=false;
let calendarUpdatedAt=0;
const CAL_SCOPE='https://www.googleapis.com/auth/calendar.events.readonly';
function calendarDate(e){
 const value=e?.start?.dateTime;
 if(value){try{return localDateString(new Date(value));}catch{}}
 return (e?.start?.date||'').slice(0,10);
}
function dailyCalendar(day){return calendarEvents.filter(e=>calendarDate(e)===day&&e.status!=='cancelled').sort((a,b)=>(a.start?.dateTime||a.start?.date||'').localeCompare(b.start?.dateTime||b.start?.date||''));}
function calendarTime(e){
 const t=e?.start?.dateTime;
 if(!t)return 'Ganztägig';
 try{return new Intl.DateTimeFormat('de-AT',{hour:'2-digit',minute:'2-digit'}).format(new Date(t));}catch{return 'Termin';}
}
function visibleCalendarEvents(day){return visibleCalendarEventsForDay(calendarEvents,day,effectiveCalendarRules(state),state?.calendarOverrides||{},showHiddenCalendarEvents,showCalendarBlocks);}
function isRoutineBlock(e){return isRoutineCalendarBlock(e);}
function eventAppearance(e){return classifyCalendarEvent(e,effectiveCalendarRules(state),state?.calendarOverrides||{});}
function recoveryEvents(day){return visibleCalendarEvents(day).filter(e=>eventAppearance(e).category==='Erholung');}
function agendaEvent(e){const matched=agendaForEvent(state,e);return matched.length?`<span class="agenda-count">${ico('list',13)} ${matched.length} Agenda</span>`:'';}
function calendarCardRows(day){
 const ev=visibleCalendarEvents(day);
 return ev.length?`<div class="compass-calendar-list">${ev.map(e=>`<button type="button" class="compass-calendar-event calendar-clickable" data-action="agenda-open" data-id="${h(e.id)}"><span class="compass-calendar-hour">${h(calendarTime(e))}</span><span class="event-emoji" aria-hidden="true">${h(eventAppearance(e).emoji)}</span><strong>${h(eventAppearance(e).displayTitle||'Termin')}</strong>${agendaEvent(e)}${ico('arrow',14)}</button>`).join('')}</div>`
  :'<div class="appointments-empty"><span>Keine relevanten Termine für diesen Tag.</span></div>';
}
function calendarFilterToggle(){return `<div class="calendar-controls"><button type="button" class="secondary-btn calendar-filter-toggle" data-action="calendar-toggle-blocks">${ico(showCalendarBlocks?'eye':'eyeOff',15)} ${showCalendarBlocks?'Zeitblöcke ausblenden':'Zeitblöcke einblenden'}</button><button type="button" class="secondary-btn" data-action="calendar-toggle-hidden">${showHiddenCalendarEvents?'Ausgeblendete verbergen':'Ausgeblendete zeigen'}</button><button type="button" class="secondary-btn" data-action="calendar-rules-toggle">${ico('pencil',14)} Kalenderregeln</button></div>${calendarRulesPanel()}`;}
function categorySelect(name,selected='Neutral'){return `<select name="${name}">${CALENDAR_CATEGORIES.map(c=>`<option value="${h(c)}" ${c===selected?'selected':''}>${h(c)}</option>`).join('')}</select>`;}
function calendarRulesPanel(){if(!calendarRulesOpen||!state)return '';
 const rules=effectiveCalendarRules(state);
 return `<section class="calendar-rules-panel" aria-label="Kalender-Klassifizierungsregeln"><div class="work-heading"><span>Symbole und Erholungskategorien bearbeiten</span><button type="button" class="secondary-btn" data-action="calendar-rules-toggle">Schließen</button></div><p class="muted-line">Regeln werden in dieser Reihenfolge geprüft (erster Treffer gewinnt). Die Begriffe beziehen sich ausschließlich auf den Termintitel. Diese Einstellungen bleiben verschlüsselt in deinem lokalen Compass-Tresor.</p>
 <div class="calendar-rule-list">${rules.map((r,i)=>`<form class="calendar-rule-form" data-id="${h(r.id)}"><div class="rule-heading"><label><input type="checkbox" name="enabled" ${r.enabled?'checked':''}/> Aktiv</label><strong>${i+1}. ${h(r.label)}</strong><div class="rule-move"><button type="button" class="secondary-btn" data-action="calendar-rule-up" data-id="${h(r.id)}" ${i===0?'disabled':''} aria-label="Priorität erhöhen">↑</button><button type="button" class="secondary-btn" data-action="calendar-rule-down" data-id="${h(r.id)}" ${i===rules.length-1?'disabled':''} aria-label="Priorität senken">↓</button></div></div><div class="rule-fields"><label>Regelname<input name="label" required maxlength="70" value="${h(r.label)}"/></label><label>Symbol<input name="emoji" maxlength="16" required value="${h(r.emoji)}" aria-label="Emoji"/></label><label>Kategorie${categorySelect('category',r.category)}</label><label>Begriffe (Komma getrennt)<input name="terms" maxlength="500" required value="${h(r.terms)}"/></label><label>Ausschlüsse (optional)<input name="exclude" maxlength="300" value="${h(r.exclude||'')}"/></label></div><div class="rule-actions"><button class="primary-btn" type="submit">Regel speichern</button><button type="button" class="secondary-btn" data-action="calendar-rule-delete" data-id="${h(r.id)}">Entfernen</button></div></form>`).join('')}</div><div class="rule-toolbar"><button type="button" class="secondary-btn" data-action="calendar-rule-add">Neue Regel</button><button type="button" class="secondary-btn" data-action="calendar-rules-reset">Standardregeln wiederherstellen</button></div></section>`;
}
function eventAgendaPanel(){
 const event=calendarEvents.find(e=>e.id===selectedAgendaEventId);
 if(!event||!state)return '';
 const notes=agendaForEvent(state,event);
 const title=String(event.summary||'');
 const look=eventAppearance(event),over=state.calendarOverrides?.[event.id]||{};
 const person=title.match(/\b(?:mit|bei)\s+([\p{Lu}][\p{L}-]{2,})/u);
 const suggested=/\buko\b/i.test(title)?'uko':person?person[1].toLocaleLowerCase('de'):(title.match(/[\p{L}\p{N}]{3,}/u)?.[0]?.toLocaleLowerCase('de')||'');
 const externalUrl=typeof event.htmlLink==='string'&&/^https:\/\/(?:calendar\.google\.com\/|www\.google\.com\/calendar\/)/.test(event.htmlLink)?event.htmlLink:'';
 return `<section id="agenda-details" tabindex="-1" class="work-card agenda-panel" aria-label="Kalendertermin und persönliches Overlay"><div class="work-heading"><span>${h(look.emoji)} Kalendertermin</span><button type="button" class="secondary-btn" data-action="agenda-close">Schließen</button></div>
 <h3>${h(title||'Termin')}</h3><p class="muted-line">${h(calendarDate(event))} · ${h(calendarTime(event))} · Google Calendar (nur lesen) ${externalUrl?`· <a href="${h(externalUrl)}" target="_blank" rel="noopener noreferrer">In Google Calendar bearbeiten ↗</a>`:''}</p>
 <form id="calendar-overlay-form" data-id="${h(event.id)}" class="calendar-overlay-form"><div class="work-heading"><span>Compass-Overlay (nur lokal)</span></div><label>Eigener Anzeigetitel<input name="title" value="${h(over.title||'')}" maxlength="180" placeholder="Originaltitel beibehalten"/></label><div class="overlay-fields"><label>Kategorie${categorySelect('category',over.category||look.category)}</label><label>Symbol<input name="emoji" aria-label="Terminsymbol" maxlength="16" value="${h(over.emoji||look.emoji)}"/></label></div><label class="flag-check"><input type="checkbox" name="hidden" ${look.hidden?'checked':''}/> In Compass ausblenden</label><div class="rule-actions"><button type="submit" class="primary-btn">Overlay speichern</button><button type="button" class="secondary-btn" data-action="calendar-overlay-reset" data-id="${h(event.id)}">Automatische Zuordnung</button></div><small>Nur Anzeige in Compass; der originale Google-Termin wird nicht verändert. Für alle ähnlichen Termine ändere die Kalenderregeln.</small></form>
 <div class="work-heading"><span>${ico('users',19)} Gesprächsvorbereitung</span></div>
 ${notes.length?`<div class="agenda-items">${notes.map(x=>`<div class="agenda-item">${ico('checkSquare',16)} <span>${h(x.title)}</span><small>${x.tags?.map(t=>'#'+h(t)).join(' ')||''}</small></div>`).join('')}</div>`:'<p class="muted-line">Noch keine offenen Gesprächspunkte mit passenden Tags.</p>'}
 <form id="agenda-note-form" class="project-form"><input type="hidden" name="tag" value="${h(suggested)}"><label>Neuen Agendapunkt notieren<input name="title" required maxlength="180" placeholder="Was möchte ich besprechen?"/></label><button type="submit" class="primary-btn">${ico('plus',16)} Agendapunkt hinzufügen</button></form>
 <p class="form-hint">Tag-Vorschlag: #${h(suggested)}. Keine Kalendereinträge werden verändert.</p></section>`;
}
function calendarConnectUI(){
 if(calendarBusy)return '<span class="calendar-connection">Google Calendar wird geladen …</span>';
 return calendarToken&&Date.now()<calendarExpires
  ?`<button type="button" class="secondary-btn" data-action="calendar-refresh">${ico('sync',15)} Kalender aktualisieren</button>`
  :`<button type="button" class="secondary-btn" data-action="calendar-connect">${ico('calendar',15)} Google Calendar verbinden (nur lesen)</button>`;
}
async function fetchCalendar(){
 if(!calendarToken||Date.now()>=calendarExpires)throw new Error('Kalenderfreigabe abgelaufen. Bitte erneut verbinden.');
 if(calendarBusy)return;
 calendarBusy=true;calendarStatus='Lädt …';render();
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
 try{
   const start=new Date();start.setHours(0,0,0,0);
   const end=new Date(start);end.setDate(end.getDate()+90);
   const url=new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
   url.searchParams.set('timeMin',start.toISOString());url.searchParams.set('timeMax',end.toISOString());
   url.searchParams.set('singleEvents','true');url.searchParams.set('orderBy','startTime');
   url.searchParams.set('maxResults','200');
   const loaded=[];let pageToken='';
   for(let page=0;page<5;page++){
     if(pageToken)url.searchParams.set('pageToken',pageToken);else url.searchParams.delete('pageToken');
     const response=await fetch(url,{headers:{Authorization:`Bearer ${calendarToken}`},signal:controller.signal,cache:'no-store'});
     if(!response.ok)throw new Error(response.status===403?'Google Calendar API oder Berechtigung fehlt. Bitte Calendar API im Google-Cloud-Projekt aktivieren.':`Google Calendar: HTTP ${response.status}`);
     const data=await response.json();
     loaded.push(...(Array.isArray(data.items)?data.items.filter(x=>x&&x.start):[]));
     pageToken=data.nextPageToken||'';if(!pageToken)break;
   }
   calendarEvents=loaded;
   calendarUpdatedAt=Date.now();calendarStatus=`${calendarEvents.length} Kalendertermine geladen`;
 }catch(ex){calendarStatus=ex.name==='AbortError'?'Kalenderanfrage hat zu lange gedauert.':ex.message;}
 finally{clearTimeout(timeout);calendarBusy=false;render();}
}
async function connectCalendar(){
 await ensureGoogle();
 if(!window.google?.accounts?.oauth2?.initTokenClient)throw new Error('Google Calendar-Anmeldung derzeit nicht verfügbar.');
 const client=window.google.accounts.oauth2.initTokenClient({client_id:config.googleClientId,scope:CAL_SCOPE,callback:async result=>{
   if(result.error||!result.access_token){calendarStatus='Keine Calendar-Freigabe erteilt.';render();return;}
   calendarToken=result.access_token;
   calendarExpires=Date.now()+Math.max(0,Number(result.expires_in||3600)-60)*1000;
   await fetchCalendar();
 }});
 client.requestAccessToken({prompt:'consent'});
}
function watchOverview(){
 const sessions=activeActivities(watchSessions,state);
 const today=localDate();const monday=new Date(today+'T12:00:00');monday.setDate(monday.getDate()-((monday.getDay()+6)%7));const weekStart=localDate(monday);
 const rows=[['Heute',sessions.filter(x=>x.startedAt.slice(0,10)===today)],['Diese Woche',sessions.filter(x=>x.startedAt.slice(0,10)>=weekStart)],['Erfasst',sessions]];
 return `<div class="compass-tracking-grid">${rows.map(([label,items])=>`<div class="tracking-period"><span>${label}</span><strong>${(items.reduce((a,x)=>a+x.durationMinutes,0)/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong><small>${items.reduce((a,x)=>a+(x.pomodoros||0),0)} Pomodoros · ${items.length} Sessions</small></div>`).join('')}</div><p class="stats-caption">Garmin: letzte maximal 50 Sessions plus manuelle Einträge; Änderungen am Rohdatensatz bleiben getrennt. Schlafdaten sind nicht angebunden.</p>`;
}

let weather={status:'idle',city:'Graz',temperature:null,label:''};
function persist() {
  const snapshot=structuredClone(state);
  saveQueue=saveQueue.catch(()=>{}).then(()=>vault.save(snapshot));
  return saveQueue;
}
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=s=>s?new Date(s).toLocaleString('de-AT',{dateStyle:'medium',timeStyle:'short'}):'–';
const configured=()=>config.apiUrl.startsWith('https://')&&!config.apiUrl.includes('YOUR_')&&
  config.googleClientId.endsWith('.apps.googleusercontent.com')&&!config.googleClientId.includes('REPLACE');
function toast(s,isError=false) {if(isError){error=s;notice='';}else{notice=s;error='';}render();}
function download(filename,obj) {
  const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
async function mutate(fn) {
  if(!state)throw new Error('Der Tresor muss entsperrt sein.');
  prepareTasks(state);
  const previous=structuredClone(state);
  try {
    fn(state);
    await persist();
  }catch(ex){state=previous;render();throw new Error(`Lokales Speichern fehlgeschlagen: ${ex.message}`);}
  render();
  if(busy)syncResyncRequested=true;
  else scheduleSync();
}
async function addCapture(title,note=''){
  const cleanTitle=String(title||'').trim();const cleanNote=String(note||'').trim();
  if(!cleanTitle||cleanTitle.length>1000)throw new Error('Bitte einen Gedanken mit maximal 1.000 Zeichen eingeben.');
  if(cleanNote.length>10000)throw new Error('Die Notiz ist zu lang (max. 10.000 Zeichen).');
  await mutate(s=>{
    const r={id:crypto.randomUUID(),title:cleanTitle,note:cleanNote,tags:[],deleted:false,updatedAt:stamp()};
    s.records[r.id]=r;s.pending.push(makeMutation(r));s.history.push({type:'captured',at:stamp(),id:r.id});
  });
}

const stamp=()=>new Date().toISOString();
function makeMutation(record) {
  return {id:record.id,mutationId:crypto.randomUUID(),baseVersion:0,title:record.title,
    note:record.note,deleted:record.deleted,tags:record.tags||[]};
}
// The dashboard is the permanent future-state information architecture.
// Locked and not-yet-implemented modules display neutral, inert states.
const symbol = {
  home:'<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/>',
  inbox:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 13h5l2 3h4l2-3h5"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  activity:'<path d="M3 17V9m6 8V5m6 12v-7m6 7V3"/>',
  people:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  checkSquare:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16.6 7.4-2.5 6.7-6.7 2.5 2.5-6.7z"/>',
  spark:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8z"/>',
  pencil:'<path d="m15 5 4 4M4 20l4.5-1 11-11a2.8 2.8 0 0 0-4-4l-11 11z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="m3 3 18 18M2 12s4-7 10-7 10 7 10 7c-.6 1-1.3 1.9-2.2 2.8M7 18.5A12 12 0 0 1 2 12"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3z"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.9 4.9l1.5 1.5m11.2 11.2 1.5 1.5M2 12h2m16 0h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  arrowLeft:'<path d="M19 12H5m6-6-6 6 6 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  cloud:'<path d="M8 18H6a4 4 0 0 1-.3-8 6.7 6.7 0 0 1 13 .2A4 4 0 0 1 18 18H8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  layers:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
  moon:'<path d="M20.5 14.2a8.6 8.6 0 0 1-10.7-10.7 9 9 0 1 0 10.7 10.7z"/>',
  shield:'<path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5z"/><path d="m8.5 12 2.3 2.3 4.7-4.8"/>',
  sync:'<path d="M20 8a8 8 0 0 0-14-2L4 8m0-4v4h4M4 16a8 8 0 0 0 14 2l2-2m0 4v-4h-4"/>',
  flag:'<path d="M5 3v19M5 4h14l-3 5 3 5H5"/>',
  pause:'<circle cx="12" cy="12" r="9"/><path d="M9 8v8M15 8v8"/>',
  list:'<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  book:'<path d="M12 7a8 8 0 0 0-9-2v14a8 8 0 0 1 9 2M12 7a8 8 0 0 1 9-2v14a8 8 0 0 0-9 2M12 7v14"/>',
  bookmark:'<path d="M5 3h14v18l-7-5-7 5z"/>',
  suitcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V4h6v3M3 12h18"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'
};
function ico(name, size=19) {return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${symbol[name]||symbol.compass}</svg>`;}
const rows=()=>inboxRecords(state);
const disabledButton=(label='Öffnen')=>`<button class="ghost-cta" type="button" disabled aria-label="${h(label)} – noch nicht freigeschaltet">${h(label)} ${ico('arrow',13)}</button>`;
function navItem(id,label,iconName,{disabled=false,count=null}={}) {
 const attr=disabled?'disabled aria-disabled="true" title="Noch nicht freigeschaltet"':`data-tab="${id}"`;
 return `<button type="button" class="nav-item ${tab===id?'is-active':''} ${disabled?'is-disabled':''}" ${attr}>
  ${ico(iconName,19)}<span>${h(label)}</span>${count!==null?`<span class="nav-count">${count}</span>`:''}</button>`;
}
function chrome(content){
 const num=rows().length;
 const today=new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 const title=tab==='today'&&selectedDay!==localDateString(new Date())?new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(`${selectedDay}T12:00:00`)):(({today:'Heute',forecast:'Forecast',projects:'Projekte',next:'Next Actions',flagged:'Flagged',hold:'On Hold',someday:'Dreams',review:'Wochenreview',overview:'Übersicht',inbox:'Inbox',system:'System & Synchronisation',activity:'Aktivitäten',people:'Menschen',progress:'Fortschritt',recovery:'Erholung',health:'Gesundheit',insights:'Insights'})[tab]||'Heute');
 const sub=({activity:'Sessions bearbeiten, zuordnen und verwalten.',people:'Gespräche, offene Punkte und Kontakte.',progress:'Fortschritt bei Projekten und Tätigkeiten.',recovery:'Aktive Erholung und freie Zeit im Blick.',health:'Schlaf, HRV und Körperzusammensetzung – Garmin und Fitdays an einem Ort.',insights:'Personal Analytics · Muster in Schlaf, Energie und Produktivität erkennen.',today:'Was heute wirklich zählt.',forecast:'Termine, Fristen und Agenden auf einer Zeitachse.',projects:'Ergebnisse verfolgen, nächste Schritte verbinden.',next:'Alle ausführbaren nächsten Schritte, auch ohne Datum.',flagged:'Bewusst hervorgehobene Aufgaben.',hold:'Bewusst pausiert oder auf Rückmeldung wartend.',someday:'Someday / Maybe · Ein Raum für Ideen ohne Verpflichtung.',review:'Gedanken klären, Verpflichtungen prüfen und bewusst wählen.',overview:'Alle Lebensbereiche auf einen Blick.',inbox:'Alles erfassen. Später in Ruhe klären.',system:'Deine Geräteverbindung und Datensicherheit.'})[tab]||'';
 return `<div class="shell"><aside class="sidebar" aria-label="Navigation">
 <div class="brand"><span class="brand-icon">${ico('compass',24)}</span><span class="brand-name">Compass<small>Personal Life Manager · ${COMPASS_CLIENT_VERSION}</small></span></div>
 <nav class="side-nav" aria-label="Hauptnavigation">
 <span class="nav-section-label">DEIN TAG</span>
 ${navItem('overview','Übersicht','layers')}
 ${navItem('today','Heute','sun')}
 ${navItem('inbox','Inbox','inbox',{count:num})}
 ${navItem('next','Next Actions','target')}
 ${navItem('forecast','Forecast','calendar')}
 ${navItem('review','Wochenreview','sync')}
 <span class="nav-section-label">GESTALTEN & PLANEN</span>
 ${navItem('projects','Projekte','folder')}
 ${navItem('people','Menschen','people')}
 ${navItem('recovery','Erholung','heart')}
 ${navItem('insights','Insights · Gesundheit','layers')}
 ${navItem('finance','Finanzen','folder')}
 ${navItem('progress','Fortschritt','activity')}
 <button type="button" class="nav-group-toggle" data-action="nav-more" aria-expanded="${state?.uiPreferences?.advancedNav===true||['flagged','hold','someday','activity'].includes(tab)?'true':'false'}">${ico('list',16)} Weitere Ansichten ${ico('arrow',14)}</button>
 ${state?.uiPreferences?.advancedNav===true||['flagged','hold','someday','activity'].includes(tab)?`<div class="nav-subgroup">
 ${navItem('flagged','Flagged','flag')}
 ${navItem('hold','On Hold','pause')}
 ${navItem('someday','Dreams','spark')}
 ${navItem('activity','Aktivitäten','activity')}
 </div>`:''}
 <div class="nav-separator"></div>
 ${navItem('system','Einstellungen & Sync','settings')}
 </nav><div class="sidebar-foot">${ico('shield',16)} <span>Dein persönlicher Arbeitsraum</span></div>
 </aside><main class="workspace"><div class="utility-bar">
 <button type="button" class="search-shell capture-shortcut" data-action="capture-focus" title="Zur Schnellerfassung">${ico('search',17)}<span>Schnell erfassen ...</span><kbd>Ctrl / ⌘ K</kbd></button>
 <div class="utility-right">${weather.status==='loaded'?`<button class="weather-quick" type="button" data-action="weather-city" title="Wetterstandort ändern">${ico('sun',15)} <span>${h(weather.city)} · ${h(weather.temperature)} °C · ${h(weather.label)}</span></button>`:`<button class="weather-quick" type="button" data-action="weather-load" title="Wetter für Graz abrufen">${ico('sun',15)} <span>${weather.status==='loading'?'Wetter lädt …':'Wetter · Graz'}</span></button>`}
 <span class="connection"><span class="connection-dot ${state?(authToken?'green':'amber'):'gray'}"></span><span>${state?(authToken?'Compass verbunden':'Nur lokal · kein Sync'):'Tresor gesperrt'}</span></span>
 <span class="avatar" aria-label="Persönlicher Arbeitsbereich">${ico('compass',18)}</span>${state?`<button class="icon-utility" type="button" data-action="lock" title="Tresor sperren" aria-label="Tresor sperren">${ico('lock',19)}</button>`:''}</div></div>
 <div class="content ${tab==='today'||tab==='forecast'?'content-work':''}">
 <div class="page-intro"><div><p class="page-overline">${tab==='today'?'DEIN TAGESKOMPASS':tab==='overview'?'DEIN PERSÖNLICHER KOMPASS':'COMPASS · DEIN ARBEITSRAUM'}</p><h1>${h(title)}</h1><p class="intro-subtitle">${h(sub)}</p></div><div class="today-label">${h(today)}<span>${state?'Tresor entsperrt':'Tresor gesperrt'}</span></div></div>
 ${notice?`<div role="status" class="alert good">${h(notice)}</div>`:''}${error?`<div role="alert" class="alert bad">${h(error)}</div>`:''}
 ${content}<footer>Compass · Private Beta · Lokal verschlüsselt ${ico('shield',13)}</footer></div></main>${state?`<button class="capture-fab" type="button" data-action="capture-focus" aria-label="Schnellerfassung öffnen" title="Gedanken erfassen">${ico('plus',23)}</button>`:``}${state&&captureOverlayOpen?captureOverlay():``}</div>`;
}

function moduleCard({name,iconName,sub='',action='',body='',cls='',active=false}){
 return `<section class="module-card ${cls} ${active?'module-active':'module-inactive'}" aria-label="${h(name)}">
 <div class="module-head"><div class="module-title">${ico(iconName,21)}<h2>${h(name)}</h2></div>${action?disabledButton(action):''}</div>
 ${sub?`<p class="module-subtitle">${h(sub)}</p>`:''}${body}</section>`;
}
const placeholder=(text='Noch keine Einträge')=>`<div class="empty-minimal"><span class="empty-circle">${ico('plus',17)}</span><span>${h(text)}</span></div>`;
function inboxPreview(){
 const list=rows().slice(0,3);
 return moduleCard({name:'Inbox',iconName:'inbox',cls:'inbox-preview',active:true,sub:list.length?`${rows().length} offene Einträge`:'Dein Eingang ist leer.',body:list.length?`<div class="compact-items">${list.map(r=>`<div class="compact-item"><span class="tiny-square"></span><span>${h(r.title)}</span></div>`).join('')}</div>`:placeholder('Alles erfasst – nichts wartet.' )})
   .replace('</section>',`<button class="text-link" type="button" data-tab="inbox">Inbox öffnen ${ico('arrow',14)}</button></section>`);
}
function captureCard(locked=false){
 return `<section class="module-card module-active capture-card"><div class="module-head"><div class="module-title">${ico('pencil',21)}<h2>Schnellerfassung</h2></div></div>
 <p class="module-subtitle">Ein Gedanke. Ein verlässlicher Ort.</p>
 <form id="capture-form"><label class="sr-only" for="capture">Gedanke erfassen</label><textarea id="capture" name="title" maxlength="1000" required rows="3" placeholder="Was möchtest du festhalten?" ${locked?'disabled':''}></textarea>
 <div class="capture-bottom"><span>Inbox · zunächst ungeordnet</span><button type="submit" class="primary-btn" ${locked?'disabled':''}>Erfassen ${ico('arrow',16)}</button></div></form></section>`;
}
function dashboardCards(locked=false){
 const todayCards=tasksForDay(state,localDateString(new Date()));
 const skeleton='<div class="skeleton-lines"><div></div><div></div><div></div></div>';
 return `<div class="dashboard-grid">
 ${moduleCard({name:'Heute',iconName:'sun',cls:'grid-today',active:true,sub:'Deine Tagesübersicht',body:todayCards.length?`<div class="dashboard-today-tasks">${todayCards.slice(0,4).map(t=>`<div>${ico(t.completed?'check':'checkSquare',16)} <span>${h(t.title)}</span></div>`).join('')}</div><small class="stats-caption">${todayCards.filter(t=>t.completed).length} / ${todayCards.length} erledigt</small>`:`<div class="today-placeholder">${ico('calendar',28)}<span>Keine Aufgaben für heute geplant</span><small>Geplante Aufgaben findest du unter Heute.</small></div>`}).replace('</section>',`<button class="text-link" type="button" data-tab="today">Heute öffnen ${ico('arrow',14)}</button></section>`)}
 ${moduleCard({name:'Nächste Aktionen',iconName:'target',cls:'grid-next',active:true,sub:'Ausführbar, ohne künstliche Deadline',body:nextActions(state).length?taskList(nextActions(state).slice(0,3),'dashboard')+'<button class="text-link" type="button" data-tab="next">Alle Next Actions '+ico('arrow',14)+'</button>':placeholder('Noch keine nächsten Schritte erfasst.')})}
 ${captureCard(locked)}
 ${inboxPreview()}
 ${moduleCard({name:'Wochenreview',iconName:'sync',cls:'grid-review',active:true,sub:'Klarheit gewinnen. Regelmäßig.',body:`<div class="review-steps review-steps-icon"><div>${ico('inbox',16)} Eingang klären</div><div>${ico('checkSquare',16)} Nächste Schritte</div><div>${ico('calendar',16)} Fristen prüfen</div></div><button class="text-link" type="button" data-tab="review">Wochenreview öffnen ${ico('arrow',14)}</button>`})}
 ${moduleCard({name:'Projekte',iconName:'folder',cls:'grid-projects',active:true,sub:'Aktive Ergebnisse und nächste Schritte',body:`<div class="project-summary"><strong>${Object.values(state?.projects||{}).filter(p=>p.status==='active').length}</strong><span>aktive Projekte</span><small>${Object.values(state?.projects||{}).filter(p=>p.status==='active'&&!nextActions(state).some(t=>t.projectId===p.id)).length} ohne nächste Aktion</small></div><button type="button" class="text-link" data-tab="projects">Projekte öffnen ${ico('arrow',14)}</button>`})}
 ${moduleCard({name:'Kalender & Fokus',iconName:'calendar',cls:'grid-calendar',active:true,sub:'Deine Termine (Google, nur lesend)',body:calendarToken?calendarCardRows(localDateString(new Date())):calendarConnectUI()})}

 ${moduleCard({name:'Menschen',iconName:'people',cls:'grid-people',active:true,sub:'Gespräche & Agenden',body:`<div class="project-summary"><strong>${Object.keys(state?.people||{}).length}</strong><span>Kontakte im Tresor</span></div><button type="button" class="text-link" data-tab="people">Menschen öffnen ${ico('arrow',14)}</button>`})}
 ${moduleCard({name:'Activity Tracking',iconName:'activity',cls:'grid-activity',active:true,sub:'Garmin · Fokuszeit · Pomodoro',body:watchOverview()}).replace('</section>',`<button class="text-link" type="button" data-tab="activity">Aktivitäten ansehen ${ico('arrow',14)}</button></section>`)}
 </div>`;
}
function localDateString(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
const dayFormat=d=>new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric'}).format(d);
function miniCalendar(){
 const first=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1);
 const start=new Date(first);start.setDate(1-((first.getDay()+6)%7));
 const now=localDateString(new Date());
 const cells=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const key=localDateString(d);
  return `<button type="button" data-action="select-day" data-id="${key}" class="cal-cell ${d.getMonth()!==first.getMonth()?'outside':''} ${key===now?'today-mark':''} ${key===selectedDay?'selected':''}" aria-label="${h(dayFormat(d))}" aria-pressed="${key===selectedDay}">${d.getDate()}</button>`;}).join('');
 const month=new Intl.DateTimeFormat('de-AT',{month:'long',year:'numeric'}).format(first);
 const days=['Mo','Di','Mi','Do','Fr','Sa','So'].map(x=>`<span>${x}</span>`).join('');
 return `<section class="mini-month" aria-label="Monatskalender"><div class="month-head"><strong>${h(month)}</strong><div><button type="button" class="month-arrow" data-action="month-prev" title="Vorheriger Monat" aria-label="Vorheriger Monat">‹</button><button type="button" class="month-arrow" data-action="month-next" title="Nächster Monat" aria-label="Nächster Monat">›</button></div></div><div class="cal-weekdays">${days}</div><div class="cal-cells">${cells}</div></section>`;
}
function calendarRail(){
 const shown=new Date(`${selectedDay}T12:00:00`);
 return `<aside class="date-rail" aria-label="Kalender und Tagesnavigation">${miniCalendar()}
 <div class="rail-metrics"><button type="button" data-action="reset-today" class="rail-metric"><strong>Heute</strong><small>${h(new Intl.DateTimeFormat('de-AT',{day:'2-digit',month:'2-digit'}).format(new Date()))}</small></button><span class="rail-metric rail-inert"><strong>Offen</strong><small>–</small></span></div>
 <div class="rail-caption">Nächste 7 Tage</div><div class="rail-days">${Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return `<button class="rail-day ${localDateString(d)===selectedDay?'on':''}" type="button" data-action="select-day" data-id="${localDateString(d)}"><span>${h(dayFormat(d))}</span><small>–</small></button>`;}).join('')}</div><p class="rail-footnote">Kalendereinträge erscheinen nach der Google-Verbindung. Aufgaben bleiben in Compass.</p></aside>`;
}
function datesPreview(){return `<div class="date-prototype"><div>${ico('calendar',16)}<span>Wunschtermin</span><span class="date-value">–</span></div><div>${ico('flag',16)}<span>Harte Deadline</span><span class="date-value">–</span></div><div>${ico('clock',16)}<span>Frühestens ab</span><span class="date-value">–</span></div></div>`;}
function todayWork(locked=false){
 const selected=localDateString(new Date())===selectedDay;
 return `<div class="today-layout">${calendarRail()}<div class="today-center">
 <section class="work-card appointments"><div class="work-heading"><span>${ico('calendar',18)} Termine ${selected?'heute':h(dayFormat(new Date(`${selectedDay}T12:00:00`)))}</span><span class="quiet-tag">${h(calendarStatus)}</span></div>
 ${calendarToken?calendarCardRows(selectedDay)+calendarFilterToggle():calendarConnectUI()}</section>${eventAgendaPanel()}
 <section class="work-card today-tasks"><div class="work-heading"><span>${ico('list',18)} Meine Aufgaben ${selected?'für heute':'für diesen Tag'}</span><span class="quiet-tag">${tasksForDay(state,selectedDay).filter(t=>t.completed).length} / ${tasksForDay(state,selectedDay).length} erledigt</span></div>
 ${state?taskCreateForm(selectedDay):''}
 ${taskList(tasksForDay(state,selectedDay), 'day')}
 <div class="capture-inline"><form id="capture-form"><label class="sr-only" for="capture">Schnell in die Inbox erfassen</label><input id="capture" name="title" maxlength="1000" required placeholder="Gedanken sofort in der Inbox festhalten …" ${locked?'disabled':''}/><button type="submit" class="primary-btn" ${locked?'disabled':''}>${ico('plus',17)} Erfassen</button></form><small>Inbox bleibt ein eigener Eingang; eine Aufgabe erhält bewusst ein Datum.</small></div></section>
 <div class="below-today"><section class="work-card deadline-card"><div class="work-heading"><span>${ico('flag',18)} Fristen & Vorausschau</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">${dueTasks(state,4).map(t=>`<div class="deadline-inline"><strong>${h(t.dueDate)}</strong> ${h(t.title)}</div>`).join('')||'Noch keine offenen Deadlines erfasst.'}</div></section>
 <section class="work-card review-card"><div class="work-heading"><span>${ico('sync',18)} Review</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">Offene Schleifen werden später regelmäßig geprüft – ohne künstliche Deadlines.</div></section></div>
 </div><aside class="inspector-rail" aria-label="Aufgabendetails und Personen-Kontext"><section class="work-card inspector-card"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabendetails</span><span class="quiet-tag">Planung</span></div>
 ${taskEditor()}
 <div class="inspector-other"><span>Projekt</span><b>–</b><span>Kontext</span><b>–</b><span>Personen</span><b>–</b><span>Aufwand</span><b>–</b></div></section>
 <section class="work-card person-preview"><div class="work-heading"><span>${ico('people',18)} Offene Gesprächsthemen</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">Person auswählen → alle offenen Agenda-Punkte sehen. Personen-Agendas folgen im GTD-Ausbau.</div></section>
 <section class="work-card energy-context"><div class="work-heading"><span>${ico('bolt',18)} Energie & Kontext</span><span class="quiet-tag">Planungsfilter</span></div><div class="energy-levels" aria-label="Energiestufen (Vorschau)"><button disabled type="button">Wenig</button><button disabled type="button">Mittel</button><button disabled type="button">Viel</button></div><p class="energy-hint">Wenn du erschöpft oder blockiert bist, zeigt Compass später kleine, passende Next Actions – statt dir zusätzliche Aufgaben aufzudrängen.</p></section>
 <button type="button" class="overview-nudge" data-tab="overview">${ico('layers',17)} Große Übersicht ansehen ${ico('arrow',14)}</button></aside></div>`;
}
function forecastScreen(){
 const list=dueTasks(state,600),planned=Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&t.plannedDate),today=localDate();
 const days=Array.from({length:14},(_,i)=>{const d=new Date(today+'T12:00:00');d.setDate(d.getDate()+i);return localDate(d);});
 const overdue=list.filter(t=>t.dueDate<today);
 const dayContent=day=>{
  const tasks=list.filter(t=>t.dueDate===day);const plannedTasks=planned.filter(t=>t.plannedDate===day&&t.dueDate!==day);
  const ev=calendarToken?visibleCalendarEvents(day):[];
  if(!tasks.length&&!plannedTasks.length&&!ev.length)return '';
  const combined=[...tasks.map(t=>({type:'task',sort:'0',obj:t})),...plannedTasks.map(t=>({type:'planned',sort:'0b',obj:t})),...ev.map(e=>({type:'event',sort:e.start?.dateTime||'1',obj:e}))].sort((a,b)=>a.sort.localeCompare(b.sort));
  return `<div class="forecast-date-group"><h3>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(day+'T12:00:00')))}</h3><div class="timeline-day">${combined.map(x=>x.type==='task'?`<div class="timeline-item deadline-event">${ico('flag',19)}<div><strong>${h(x.obj.title)}</strong><small>Compass · harte Deadline · ${h(CATEGORY_LABELS[x.obj.category]||x.obj.category)}</small></div><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(x.obj.id)}">Details</button></div>`:x.type==='planned'?`<div class="timeline-item planned-event">${ico('calendar',19)}<div><strong>${h(x.obj.title)}</strong><small>Compass · Planned (Wunschtermin, keine Deadline)</small></div><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(x.obj.id)}">Details</button></div>`:`<button type="button" class="timeline-item calendar-event" data-action="agenda-open" data-id="${h(x.obj.id)}"><span class="forecast-event-emoji">${h(eventAppearance(x.obj).emoji)}</span><div><strong>${h(eventAppearance(x.obj).displayTitle||'Kalendertermin')}</strong><small>Google Calendar · ${h(eventAppearance(x.obj).category)} · ${h(calendarTime(x.obj))}${x.obj.start?.date?' · Ganztagsmarker':''}${eventAppearance(x.obj).hidden?' · ausgeblendet':''}</small></div>${agendaEvent(x.obj)}${ico('arrow',15)}</button>`).join('')}</div></div>`;
 };
 return chrome(`<div class="forecast-layout">${calendarRail()}<section class="forecast-full work-card"><div class="work-heading"><span>${ico('calendar',21)} Forecast · Deadlines, Planung & Termine</span><span class="quiet-tag">14 Tage</span></div>
 <div class="forecast-tools">${calendarToken?calendarFilterToggle():calendarConnectUI()}<span class="muted-line">${list.length} offene Deadlines · ${planned.length} geplante Aufgaben · ${days.reduce((sum,d)=>sum+recoveryEvents(d).length,0)} Erholungstermine · Google Calendar nur lesend</span></div>
 ${overdue.length?`<div class="forecast-date-overdue"><strong>Überfällig</strong>${taskList(overdue,'forecast')}</div>`:''}
 ${days.map(dayContent).join('')||'<div class="task-empty">Keine Termine oder Fristen für die kommenden 14 Tage.</div>'}
 <p class="rail-footnote">Ganztägig markierte Fristen blockieren nicht automatisch deinen ganzen Tag. Zeitblöcke können ausgeblendet werden.</p></section><aside class="forecast-inspector">${eventAgendaPanel()}<section class="work-card task-inspector"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabe bearbeiten</span></div>${taskEditor()}</section></aside></div>`);
}
function projectOptions(selected=''){
 const options=['<option value="">Kein Projekt</option>'];
 const visit=(parent,depth)=>{for(const proj of childProjects(state,parent)){
  if(proj.kind==='project'&&(proj.status!=='completed'||proj.id===selected))options.push(`<option value="${h(proj.id)}" ${selected===proj.id?'selected':''}>${'  '.repeat(depth)}${h(proj.title)}</option>`);
  if(depth<15)visit(proj.id,depth+1);
 }};visit(null,0);return options.join('');
}
function projectParentOptions(selected='',excludeId=''){
 const blocked=excludeId?new Set([excludeId,...projectDescendantIds(state,excludeId)]):new Set();
 const roots=['<option value="">Oberste Ebene</option>'];
 const walk=(parent,depth)=>{for(const proj of childProjects(state,parent)){
  if(blocked.has(proj.id))continue;
  roots.push(`<option value="${h(proj.id)}" ${proj.id===selected?'selected':''}>${'  '.repeat(depth)}${proj.kind==='folder'?'▸ ':''}${h(proj.title)}</option>`);
  if(depth<15)walk(proj.id,depth+1);
 }};
 walk(null,0);return roots.join('');
}
function taskParentOptions(projectId,selected='',self=''){
 const blocked=new Set([self]);const visit=(id)=>{for(const t of Object.values(state?.tasks||{}).filter(t=>t.parentTaskId===id)){if(blocked.has(t.id))continue;blocked.add(t.id);visit(t.id);}};
 if(self)visit(self);
 return '<option value="">Hauptebene</option>'+hierarchicalProjectTasks(state,projectId).filter(t=>!blocked.has(t.id)&&!t.completed).map(t=>`<option value="${h(t.id)}" ${selected===t.id?'selected':''}>${'  '.repeat(Math.min(t.depth,8))}${h(t.title)}</option>`).join('');
}
function dateButtons(field){return `<div class="date-shortcuts" data-date-target="${field}"><button type="button" data-action="date-adjust" data-field="${field}" data-offset="day">+1d</button><button type="button" data-action="date-adjust" data-field="${field}" data-offset="week">+1w</button><button type="button" data-action="date-adjust" data-field="${field}" data-offset="month">+1m</button><button type="button" data-action="date-clear" data-field="${field}">Löschen</button></div>`;}
function dateControl(field,label,value='',hint=''){return `<label class="date-control">${label}<input name="${field}" type="date" value="${h(value||'')}">${dateButtons(field)}${hint?`<small>${h(hint)}</small>`:''}</label>`;}
function moveOrder(state,collection,id,direction){
 const current=state[collection][id];if(!current)return false;
 const peers=collection==='projects'?childProjects(state,current.parentId||null):taskChildren(state,current.projectId,current.parentTaskId||null);
 const index=peers.findIndex(x=>x.id===id),other=peers[index+direction];if(!other)return false;
 const changed=[peers[index],other];
 // Normalize all sibling ordering once to avoid tie ambiguity in older projects.
 peers.forEach((entry,i)=>{state[collection][entry.id].sortOrder=(i+1)*100;});
 state[collection][changed[0].id].sortOrder=(index+direction+1)*100;
 state[collection][changed[1].id].sortOrder=(index+1)*100;
 const pending=collection==='projects'?'projectPending':'taskPending';
 peers.forEach(entry=>{state[pending][entry.id]=true;});
 return true;
}
function categoryOptions(selected='Allgemein'){
 return TASK_CATEGORIES.map(c=>`<option value="${h(c)}" ${c===selected?'selected':''}>${h(CATEGORY_LABELS[c]||c)}</option>`).join('');
}
function workflowOptions(selected='next'){
 return [['next','Next Action'],['waiting','Waiting For'],['hold','On Hold']].map(([value,label])=>`<option value="${value}" ${selected===value?'selected':''}>${label}</option>`).join('');
}
function taskCreateForm(defaultDay='',defaultProject=''){
 return `<form class="task-create-form" id="task-create-form"><div class="task-form-title"><strong>Neue Aufgabe</strong><span>Ohne künstliche Deadline</span></div><input name="title" aria-label="Aufgabentitel" maxlength="180" required placeholder="Was ist der nächste konkrete Schritt?"/><div class="task-field-grid">
 ${dateControl('plannedDate','Planned · Wunschtermin',defaultDay,'Für Heute / Forecast; keine Frist')}
 ${dateControl('dueDate','Due · harte Deadline')}
 ${dateControl('deferUntil','Defer · frühestens ab','','Bis dahin keine Next Action')}
 <label>Duration · Minuten<input name="estimateMinutes" type="number" min="5" max="1440" step="5" placeholder="optional"/></label>
 <label>Bereich<select name="category">${categoryOptions()}</select></label><label>GTD-Status<select name="workflow">${workflowOptions()}</select></label>
 <label>Projekt<select name="projectId">${projectOptions(defaultProject)}</select></label>${defaultProject?`<label>Unteraufgabe von<select name="parentTaskId">${taskParentOptions(defaultProject)}</select></label>`:''}
 <label>Agenda-Tags<input name="tags" data-smart-tags placeholder="UKO, Martin" maxlength="300"/></label>
 <label>Kontext-Tags<input name="contextTags" data-smart-tags placeholder="büro, laptop" maxlength="300"/></label>
 <label class="flag-check"><input type="checkbox" name="flagged"/> Flagged</label><button class="primary-btn" type="submit">${ico('plus',16)} Hinzufügen</button></div></form>`;
}
function taskList(items,scope,hideEmpty=false){return items.length?`<div class="task-list" data-scope="${h(scope)}">${items.map(t=>`<div class="task-row ${selectedTaskId===t.id?'is-selected':''} ${t.completed?'completed':''}"><button type="button" class="task-check" data-action="task-toggle" data-id="${h(t.id)}" aria-label="${t.completed?'Wieder öffnen':'Erledigen'}">${t.completed?'✓':'○'}</button><button type="button" class="flag-button ${t.flagged?'is-flagged':''}" data-action="task-flag" data-id="${h(t.id)}" title="Flagged umschalten">${ico('flag',17)}</button><button class="task-title-button" type="button" data-action="task-select" data-id="${h(t.id)}" ${Number.isInteger(t.depth)?`style="padding-left:${Math.min(t.depth,8)*17}px"`: ''}><strong>${t.depth?'↳ ':''}${h(t.title)}</strong><small>${h(CATEGORY_LABELS[t.category]||t.category)}${t.dueDate?' · Deadline '+h(t.dueDate):''}${t.workflow==='waiting'?' · Waiting For':t.workflow==='hold'?' · On Hold':''}${t.deferUntil&&t.deferUntil>localDate()?' · ab '+h(t.deferUntil):''}${t.estimateMinutes?' · '+t.estimateMinutes+' min':''}${(t.contextTags||[]).length?' · @'+h(t.contextTags.join(' @')):''}${state?.taskPending?.[t.id]?' · Lokal gespeichert':''}</small>${t.tags?.length?`<span class="task-tags">${t.tags.map(tag=>'<i>#'+h(tag)+'</i>').join('')}</span>`:''}</button>${state?.taskConflicts?.[t.id]?'<span class="task-conflict-pill">Konflikt</span>':''}</div>`).join('')}</div>`:hideEmpty?'':`<div class="task-empty">Keine passenden Aufgaben.</div>`;}
function taskEditor(){const t=state?.tasks?.[selectedTaskId];if(!t||t.archived)return '<div class="task-empty">Wähle eine Aufgabe, um ihre Details zu bearbeiten.</div>';
 return `<form id="task-edit-form" data-id="${h(t.id)}" class="task-edit-form"><label>Titel<input required name="title" maxlength="180" value="${h(t.title)}"/></label><label>Notiz<textarea name="note" maxlength="3000" rows="3">${h(t.note||'')}</textarea></label>
 <div class="inspector-dates">${dateControl('deferUntil','Defer · frühestens ab',t.deferUntil,'Verfügbarkeit; keine Deadline')}${dateControl('plannedDate','Planned · Wunschtermin',t.plannedDate,'Für Heute und Forecast')}${dateControl('dueDate','Due · harte Deadline',t.dueDate,'Fälligkeit und Überfälligkeit')}</div>
 <label>Duration · geschätzter Aufwand (Min.)<input name="estimateMinutes" type="number" min="5" max="1440" step="5" value="${t.estimateMinutes??''}"/></label>
 <label>Bereich<select name="category">${categoryOptions(t.category)}</select></label><label>GTD-Status<select name="workflow">${workflowOptions(t.workflow)}</select></label><label>Projekt<select name="projectId">${projectOptions(t.projectId)}</select></label>
 ${t.projectId?`<label>Hierarchie · Unteraufgabe von<select name="parentTaskId">${taskParentOptions(t.projectId,t.parentTaskId,t.id)}</select></label>`:''}
 <label>Agenda-Tags<input name="tags" data-smart-tags value="${h((t.tags||[]).join(', '))}" placeholder="UKO, Martin"/></label><label>Kontexte<input name="contextTags" data-smart-tags value="${h((t.contextTags||[]).join(', '))}" placeholder="büro, laptop"/></label>
 <label class="flag-check"><input type="checkbox" name="flagged" ${t.flagged?'checked':''}/> Flagged</label>
 <div class="task-edit-actions"><button class="primary-btn" type="submit">Speichern</button><button class="secondary-btn" type="button" data-action="task-archive" data-id="${h(t.id)}">Archivieren</button></div></form>${state.taskConflicts[t.id]?`<div class="task-conflict"><strong>Änderungskonflikt</strong><p>Die Aufgabe wurde auf einem anderen Gerät bearbeitet. Beide Fassungen bleiben erhalten.</p><button type="button" data-action="task-conflict-local" data-id="${h(t.id)}">Meine Änderungen übernehmen</button><button type="button" data-action="task-conflict-remote" data-id="${h(t.id)}">Cloud-Version übernehmen</button></div>`:''}`;
}
function workflowScreen(which){
 const titles={next:'Next Actions',flagged:'Flagged',hold:'On Hold & Waiting For'};
 const tasks=which==='next'?nextActions(state):which==='flagged'?flaggedTasks(state):heldTasks(state);
 const shown=which==='next'?filterContextTasks(tasks,contextFilter):tasks;
 const availableContexts=contextChoices(tasks);
 const waiting=which==='hold'?shown.filter(t=>t.workflow==='waiting'):[];
 const paused=which==='hold'?shown.filter(t=>t.workflow==='hold'):[];
 const blocked=which==='hold'?blockedByProject(state):[];
 const pausedProjects=which==='hold'?Object.values(state?.projects||{}).filter(p=>p.status==='hold'):[];
 const perspectiveItems=which==='hold'?[...shown,...blocked]:shown;
 if(!perspectiveItems.some(t=>t.id===selectedTaskId))selectedTaskId=null;
 const noActions=which==='next'&&!shown.length?`<div class="task-empty perspective-empty"><strong>${contextFilter?'Für diesen Kontext ist gerade nichts verfügbar.':'Keine verfügbaren Next Actions.'}</strong><p>Prüfe die Inbox, kläre deine nächsten Schritte im Review oder lege eine konkrete Aufgabe an. Verschobene und pausierte Aufgaben erscheinen hier nicht.</p><button type="button" class="secondary-btn" data-tab="review">Inbox im Review klären</button> <button type="button" class="secondary-btn" data-tab="inbox">Inbox öffnen</button></div>`:'';
 return chrome(`<div class="workflow-layout"><section class="work-card"><div class="work-heading"><span>${ico(which==='flagged'?'flag':which==='hold'?'pause':'target',20)} ${titles[which]}</span><span class="quiet-tag">${perspectiveItems.length} offen</span></div>
 ${which==='next'?`<div class="context-filter"><label>Aktueller Kontext <select id="context-filter"><option value="">Alle verfügbaren Next Actions</option>${availableContexts.map(c=>`<option value="${h(c.value)}" ${contextFilter===c.value?'selected':''}>${c.group?'▸ ':''}${h(c.label)}</option>`).join('')}</select></label></div>`:''}
 ${which==='flagged'?'<p class="muted-line">Hier erscheinen nur Aufgaben, die du ausdrücklich mit der Flagge markiert hast. Über das Fahnensymbol kannst du die Markierung sofort entfernen.</p>':''}
 ${which==='hold'?`<div class="held-sections"><h3>Waiting For · ${waiting.length}</h3>${taskList(waiting,'waiting')}<h3>On Hold · ${paused.length}</h3>${taskList(paused,'paused')}<h3>Durch pausierte Projekte zurückgestellt · ${blocked.length}</h3>${taskList(blocked,'project-hold')}<h3>Pausierte Projekte · ${pausedProjects.length}</h3>${pausedProjects.length?pausedProjects.map(p=>`<button type="button" class="held-project-link" data-action="hold-open-project" data-id="${h(p.id)}">${ico('folder',15)} ${h(p.title)} ${ico('arrow',13)}</button>`).join(''):'<p class="muted-line">Keine Projekte pausiert.</p>'}</div>`:`${taskCreateForm('')}${taskList(shown,which,which==='next')}${noActions}`}
 </section><aside class="work-card"><div class="work-heading"><span>${ico('pencil',18)} Aufgabendetails</span></div>${taskEditor()}</aside></div>`);
}
function projectTree(){
 const visited=new Set();
 const draw=(parent,depth)=>childProjects(state,parent).map(pr=>{
  if(visited.has(pr.id))return '';visited.add(pr.id);
  const children=childProjects(state,pr.id);const selected=pr.id===selectedProjectId;const collapsed=projectCollapsed.has(pr.id);
  return `<div class="project-branch"><div class="project-branch-line" style="padding-left:${Math.min(depth,10)*14}px">${children.length?`<button type="button" class="tree-chevron" data-action="project-toggle-expand" data-id="${h(pr.id)}" aria-label="${collapsed?'Aufklappen':'Zuklappen'}">${collapsed?'▸':'▾'}</button>`:'<span class="tree-chevron-placeholder"></span>'}<button type="button" class="project-list-item ${selected?'is-current':''}" data-action="project-select" data-id="${h(pr.id)}">${ico('folder',16)}<span class="project-tree-name"><strong>${h(pr.title)}</strong><small>${pr.kind==='folder'?'Ordner':pr.projectType==='sequential'?'Sequential':pr.projectType==='single'?'Single Actions':'Parallel'} · ${pr.status==='active'?'Aktiv':pr.status==='hold'?'Pausiert':'Fertig'}</small></span></button></div>${collapsed?'':draw(pr.id,depth+1)}</div>`;
 }).join('');
 return draw(null,0);
}
function projectTaskTree(project){
 const items=hierarchicalProjectTasks(state,project.id);const ready=new Set(nextActions(state).map(t=>t.id));
 if(!items.length)return '<p class="muted-line">Noch keine Aufgaben. Erstelle unten den ersten Schritt.</p>';
 return `<div class="hierarchical-task-list">${items.map(t=>`<div class="hier-task ${t.completed?'completed':''} ${selectedTaskId===t.id?'is-selected':''}" style="--task-depth:${Math.min(t.depth,10)}"><button type="button" class="task-check" data-action="task-toggle" data-id="${h(t.id)}">${t.completed?'✓':'○'}</button><button type="button" class="hier-task-title" data-action="task-select" data-id="${h(t.id)}"><strong>${h(t.title)}</strong><small>${t.completed?'Erledigt':ready.has(t.id)?'Verfügbar':t.deferUntil&&t.deferUntil>localDate()?'Defer bis '+h(t.deferUntil):'Nicht verfügbar'}${t.dueDate?' · Due '+h(t.dueDate):''}${t.estimateMinutes?' · '+t.estimateMinutes+' min':''}</small></button><div class="hier-actions"><button type="button" data-action="task-move-up" data-id="${h(t.id)}" aria-label="Nach oben">↑</button><button type="button" data-action="task-move-down" data-id="${h(t.id)}" aria-label="Nach unten">↓</button><button type="button" data-action="task-add-subtask" data-id="${h(t.id)}" aria-label="Unteraufgabe anlegen">+</button></div></div>`).join('')}</div>`;
}
function projectScreen(){
 const projects=Object.values(state?.projects||{});const current=state?.projects?.[selectedProjectId]||childProjects(state,null)[0]||projects[0]||null;
 if(current&&!state?.projects?.[selectedProjectId])selectedProjectId=current.id;
 if(current?.kind==='folder'||!current||state?.tasks?.[selectedTaskId]?.projectId!==current.id)selectedTaskId=null;
 const items=current?.kind==='project'?projectTasks(state,current.id):[];
 const nextCount=current?nextActions(state).filter(t=>t.projectId===current.id).length:0;
 const active=projects.filter(x=>x.kind!=='folder'&&x.status==='active').length;
 return chrome(`<div class="projects-layout omni-projects ${projectFocus?'is-focused':''}">
 <aside class="work-card project-navigation"><div class="work-heading"><span>${ico('folder',20)} Ordner & Projekte</span><span class="quiet-tag">${active} aktiv</span></div>
 <form class="project-form" id="project-create-form"><label>Name<input required name="title" maxlength="140" placeholder="Projekt oder Ordner"/></label><div class="project-create-row"><label>Art<select name="kind"><option value="project">Projekt</option><option value="folder">Ordner</option></select></label><label>Typ<select name="projectType"><option value="parallel">Parallel</option><option value="sequential">Sequential</option><option value="single">Single Actions</option></select></label></div><label>Unterhalb von<select name="parentId">${projectParentOptions(current?.id||'')}</select></label><label>Ergebnis<input name="outcome" maxlength="800" placeholder="Optional"/></label><button class="primary-btn" type="submit">${ico('plus',16)} Anlegen</button></form>
 <div class="project-tree">${projectTree()||'<p class="muted-line">Noch keine Projekte.</p>'}</div></aside>
 <main class="work-card project-middle"><div class="work-heading"><span>${ico('target',18)} ${current?h(current.title):'Projektaufgaben'}</span><div class="project-heading-actions"><span class="quiet-tag">${current?.kind==='folder'?'Ordner':`${nextCount} verfügbar`}</span><button type="button" class="secondary-btn" data-action="project-focus-toggle">${projectFocus?'Übersicht':'Fokusmodus'}</button></div></div>
 ${current?.kind==='folder'?`<p class="muted-line">Dieser Ordner strukturiert deine Projekte.</p><div class="project-folder-children">${childProjects(state,current.id).map(pr=>`<button type="button" class="project-list-item" data-action="project-select" data-id="${h(pr.id)}">${ico('folder',18)} <strong>${h(pr.title)}</strong></button>`).join('')||'<p>Ordner ist leer.</p>'}</div>`:current?`<div class="progress-hint"><span>${items.filter(t=>t.completed).length} von ${items.length} Aufgaben erledigt</span><div class="progress-track"><span style="width:${items.length?Math.round(100*items.filter(t=>t.completed).length/items.length):0}%"></span></div></div>${current.status==='active'&&nextCount===0?'<div class="project-warning">Noch keine verfügbare Next Action in diesem Projekt.</div>':''}${projectTaskTree(current)}${taskCreateForm('',current.id)}`:'<div class="task-empty">Lege zuerst dein erstes Projekt an.</div>'}</main>
 <aside class="work-card project-inspector"><div class="work-heading"><span>${ico('pencil',18)} Inspector</span></div>
 ${current?`<details class="project-properties" ${!selectedTaskId?'open':''}><summary>${current.kind==='folder'?'Ordner':'Projekt'} bearbeiten</summary><form id="project-edit-form" class="task-edit-form" data-id="${h(current.id)}"><label>Name<input name="title" required maxlength="140" value="${h(current.title)}"/></label><label>Ergebnis<textarea name="outcome" rows="2" maxlength="800">${h(current.outcome||'')}</textarea></label><label>Bereich<select name="category">${categoryOptions(current.category)}</select></label><label>Status<select name="status">${[['active','Aktiv'],['hold','On Hold'],['completed','Abgeschlossen']].map(([v,l])=>`<option value="${v}" ${current.status===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Art<select name="kind"><option value="project" ${current.kind!=='folder'?'selected':''}>Projekt</option><option value="folder" ${current.kind==='folder'?'selected':''}>Ordner</option></select></label><label>Projekttyp<select name="projectType">${[['parallel','Parallel'],['sequential','Sequential'],['single','Single Actions']].map(([v,l])=>`<option value="${v}" ${(current.projectType||'parallel')===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Übergeordnet<select name="parentId">${projectParentOptions(current.parentId,current.id)}</select></label>${dateControl('dueDate','Projekt-Deadline',current.dueDate)}<label>Review alle (Tage)<input name="reviewIntervalDays" type="number" min="1" max="90" value="${current.reviewIntervalDays||7}"/></label><div class="project-review-info">Letzter Review: ${current.reviewedAt?h(new Date(current.reviewedAt).toLocaleDateString('de-AT')):'Noch nie'} · ${projectNeedsReview(current)?'Review fällig':'Aktuell'}</div><div class="project-edit-actions"><button class="primary-btn" type="submit">Speichern</button><button type="button" class="secondary-btn" data-action="project-reviewed" data-id="${h(current.id)}">Jetzt geprüft</button></div></form>${state.projectConflicts[current.id]?`<div class="task-conflict">Änderungskonflikt. <button data-action="project-conflict-remote" data-id="${h(current.id)}">Cloud</button><button data-action="project-conflict-local" data-id="${h(current.id)}">Lokal</button></div>`:''}</details>`:''}
 ${selectedTaskId?`<div class="inspector-task-heading"><strong>Ausgewählte Aufgabe</strong></div>${taskEditor()}`:current?.kind==='project'?'<div class="task-empty">Wähle links in der Aufgabenliste einen Schritt für den Inspector.</div>':''}
 </aside></div>`);
}
const DREAM_CATEGORIES=[['lernen','Lernen & Weiterbilden','book'],['lesen','Lesen & Entdecken','bookmark'],['erleben','Erleben & Ausprobieren','suitcase'],['ideen','Projekte & Ideen','spark']];
function dreamCategory(r){return DREAM_CATEGORIES.find(([key])=>(r.tags||[]).includes('dream-'+key))?.[0]||'ideen';}
function somedayScreen(){
 const dreams=dreamRecords(state);
 const current=dreams.find(r=>r.id===selectedDreamId)||dreams[0]||null;
 return chrome(`<div class="dream-layout"><section class="dream-intro work-card"><div class="dream-lead"><span class="dream-symbol">${ico('spark',31)}</span><div><p class="little-overline">DEIN DREAM SPACE</p><h2>Möglichkeiten dürfen warten.</h2><p>Ideen bewusst aufheben, ohne sie zu einer Verpflichtung zu machen. Nur du entscheidest, wann du sie aktivierst.</p></div></div>
 <form id="dream-create-form" class="dream-capture-shell"><input name="title" type="text" required maxlength="1000" placeholder="Neue Idee, Wunsch oder Inspiration …" aria-label="Someday / Maybe erfassen"/><select name="category" aria-label="Dreams-Kategorie">${DREAM_CATEGORIES.map(([key,title])=>`<option value="${key}">${h(title)}</option>`).join('')}</select><button type="submit" class="primary-btn">${ico('plus',16)} Sammeln</button></form>
 <p class="dream-caption">Diese Ideen werden mit dem Tag #dreams geräteübergreifend synchronisiert und erscheinen nicht mehr in der Inbox.</p></section>
 <div class="dream-grid">${DREAM_CATEGORIES.map(([key,title,iconName])=>{const entries=dreams.filter(r=>dreamCategory(r)===key);return `<section class="dream-category work-card"><div class="work-heading"><span>${ico(iconName,19)} ${h(title)}</span><span class="quiet-tag">${entries.length}</span></div>${entries.length?`<div class="dream-list">${entries.map(r=>`<button type="button" class="dream-item ${current?.id===r.id?'is-current':''}" data-action="dream-select" data-id="${h(r.id)}">${ico('spark',14)}<span>${h(r.title)}</span>${ico('arrow',13)}</button>`).join('')}</div>`:'<div class="dream-empty">Noch nichts gesammelt</div>'}</section>`}).join('')}</div>
 <section class="work-card dream-review"><div class="work-heading"><span>${ico('sync',18)} Dreams durchsehen</span><span class="quiet-tag">${dreams.length} Ideen</span></div>${current?`<form id="dream-edit-form" data-id="${h(current.id)}" class="dream-edit-form"><label>Gedanke<input name="title" required maxlength="1000" value="${h(current.title)}"/></label><label>Notizen<textarea name="note" rows="3" maxlength="10000">${h(current.note||'')}</textarea></label><label>Kategorie<select name="category">${DREAM_CATEGORIES.map(([key,title])=>`<option value="${key}" ${dreamCategory(current)===key?'selected':''}>${h(title)}</option>`).join('')}</select></label><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="dream-to-inbox" data-id="${h(current.id)}">Zurück in die Inbox</button><button type="button" class="secondary-btn" data-action="dream-to-next" data-id="${h(current.id)}">Als Next Action aktivieren</button></form>`:'<p class="muted-line">Noch keine Dreams vorhanden. Du kannst hier jederzeit eine Idee aufnehmen.</p>'}</section></div>`);
}
function weatherCondition(code){if(code===0)return 'Klar';if(code<=3)return 'Bewölkt';if(code<=48)return 'Nebel';if(code<=67)return 'Regen';if(code<=77)return 'Schnee';if(code<=82)return 'Schauer';return 'Gewitter';}
async function loadWeather(city){
 weather={...weather,city,status:'loading'};render();
 try{const geo=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`).then(r=>{if(!r.ok)throw new Error('Ort nicht gefunden');return r.json()});
  const g=geo.results?.[0];if(!g)throw new Error('Ort nicht gefunden');
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${g.latitude}&longitude=${g.longitude}&current=temperature_2m,weather_code&timezone=auto`;
  const data=await fetch(url).then(r=>{if(!r.ok)throw new Error('Wetterdienst nicht erreichbar');return r.json()});
  if(typeof data.current?.temperature_2m!=='number')throw new Error('Keine Wetterdaten');
  weather={city:g.name,status:'loaded',temperature:Math.round(data.current.temperature_2m),label:weatherCondition(data.current.weather_code)};
  render();
 }catch(ex){weather={city,status:'idle',temperature:null,label:''};toast(`Wetter konnte nicht geladen werden: ${ex.message}`,true);}
}
function vaultScreen(){
 tab=['inbox','forecast','overview','someday','review','activity','projects','next','flagged','hold'].includes(tab)?'today':tab;
 return chrome(`<section class="vault-compact" aria-label="Lokalen Tresor einrichten"><div class="vault-copy"><span class="vault-icon">${ico('lock',18)}</span><div><h2>${hasVault?'Tresor entsperren':'Lokalen Tresor einrichten'}</h2><p>${hasVault?'Deine Daten bleiben verborgen, bis du sie entsperrst.':'Einmalig eine Passphrase festlegen; deine lokalen Daten werden verschlüsselt gespeichert.'}</p></div></div>
 <form class="vault-form" id="vault-form" autocomplete="off"><label class="sr-only" for="passphrase">Passphrase</label><input id="passphrase" name="passphrase" type="password" required minlength="12" placeholder="Passphrase (mindestens 12 Zeichen)" autocomplete="off" />
 ${!hasVault?'<label class="sr-only" for="passphrase-repeat">Passphrase wiederholen</label><input id="passphrase-repeat" name="repeat" type="password" minlength="12" required autocomplete="off" placeholder="Passphrase wiederholen"/>':''}
 <button class="primary-btn" type="submit">${hasVault?'Entsperren':'Einrichten'} ${ico('arrow',15)}</button>
 ${!hasVault?'<label class="restore-label" for="encrypted-import">Verschlüsseltes Backup importieren</label><input id="encrypted-import" type="file" accept="application/json"/>':''}</form></section>${todayWork(true)}`);
}
function todayScreen(){return chrome(`${occasionPanel()}${todayWork()}`);}
function homeScreen(){return chrome(`<div class="dashboard-timeline">${timelinePanel()}</div>${occasionPanel()}${dashboardCards()}`);}

function captureOverlay(){
 return `<div class="capture-modal-layer" data-action="capture-close-backdrop">
 <section class="capture-modal" role="dialog" aria-modal="true" aria-labelledby="capture-modal-title" tabindex="-1">
 <div class="capture-modal-heading"><div><p class="capture-eyebrow">QUICK CAPTURE · INBOX</p><h2 id="capture-modal-title">Aus dem Kopf. In Compass.</h2></div><button type="button" class="capture-modal-close" data-action="capture-close" aria-label="Schnellerfassung schließen">${ico('plus',20)}</button></div>
 <form id="capture-modal-form"><label for="capture-modal-input" class="sr-only">Neuer Gedanke</label>
 <textarea autofocus id="capture-modal-input" name="title" rows="3" maxlength="1000" required placeholder="Was möchtest du nicht vergessen?"></textarea>
 <details class="optional-capture"><summary>${ico('plus',15)} Notiz oder Link ergänzen <span>optional</span></summary><label for="capture-modal-note" class="sr-only">Zusätzliche Notiz</label><textarea id="capture-modal-note" name="note" maxlength="10000" rows="3" placeholder="Zusätzliche Informationen …"></textarea></details>
 <div class="capture-modal-foot"><span>${ico('lock',14)} Verschlüsselt und offline gespeichert</span><button class="primary-btn" type="submit">In Inbox erfassen ${ico('arrow',15)}</button></div></form>
 <p class="capture-modal-hint">Kein Projekt, keine Deadline, keine Priorität nötig · Esc zum Schließen</p></section></div>`;
}
function inboxScreen(){
 const fullList=rows();
 const query=inboxQuery.trim().toLocaleLowerCase('de');
 const list=query?fullList.filter(r=>`${r.title} ${r.note||''} ${(r.tags||[]).join(' ')}`.toLocaleLowerCase('de').includes(query)):fullList;
 const current=list.find(r=>r.id===selectedInboxId)||list[0]||null;
 return chrome(`<div class="inbox-mvp-layout"><section class="module-card module-active inbox-mvp-card">
 <div class="inbox-mvp-head"><div><p class="capture-eyebrow">VERLÄSSLICHER EINGANG</p><h2>Deine Inbox <span class="count">${fullList.length}</span></h2><p>Alles sammeln. Noch nichts entscheiden müssen.</p></div><button type="button" class="primary-btn" data-action="capture-focus">${ico('plus',17)} Erfassen</button></div>
 <div class="inbox-search-box">${ico('search',17)}<input id="inbox-query" type="search" placeholder="Inbox durchsuchen …" value="${h(inboxQuery)}" autocomplete="off" aria-label="Inbox durchsuchen"/></div>
 <div class="inbox-mvp-list">
 ${list.length?list.map(r=>`<button type="button" class="inbox-mvp-row ${current?.id===r.id?'is-current':''}" data-action="select-inbox" data-id="${h(r.id)}"><span class="inbox-list-mark">${ico('inbox',16)}</span><span class="inbox-list-copy"><strong>${h(r.title)}</strong>${r.note?`<small class="item-preview">${h(r.note)}</small>`:''}<small>${date(r.updatedAt)}${r.tags?.length?' · '+r.tags.map(x=>'#'+h(x)).join(' '):''}</small></span><span class="inbox-list-sync ${state.pending.some(p=>p.id===r.id)?'needs-sync':''}" title="${state.pending.some(p=>p.id===r.id)?'Noch nicht synchronisiert':'Keine lokalen Änderungen ausstehend'}">${state.pending.some(p=>p.id===r.id)?ico('cloud',14):ico('check',14)}</span></button>`).join(''):
 `<div class="inbox-mvp-empty">${ico(query?'search':'inbox',32)}<strong>${query?'Keine passenden Einträge':'Dein Kopf darf leerer werden.'}</strong><span>${query?'Versuche einen anderen Suchbegriff.':'Halte hier alles fest, was dir im Alltag begegnet.'}</span></div>`}
 </div><div class="inbox-mvp-bottom"><span>${state.pending.length} ausstehende Änderungen</span><button type="button" class="review-link" data-tab="review">Wochenreview ${ico('arrow',14)}</button></div></section>
 <aside class="module-card module-active inbox-mvp-detail">${current?
 `<div class="inbox-detail-top"><span class="capture-eyebrow">EINTRAG · INBOX</span><span class="inbox-detail-date">${date(current.updatedAt)}</span></div><form id="inbox-edit-form" data-id="${h(current.id)}"><label for="inbox-edit-title">Gedanke</label><textarea id="inbox-edit-title" name="title" maxlength="1000" rows="3" required>${h(current.title)}</textarea><label for="inbox-edit-note">Notizen, Links, Kontext</label><textarea id="inbox-edit-note" name="note" maxlength="10000" rows="7" placeholder="Optional – für den späteren Review">${h(current.note||'')}</textarea><label for="inbox-edit-tags">Agenda-Tags (Komma getrennt)</label><input id="inbox-edit-tags" name="tags" data-smart-tags value="${h((current.tags||[]).join(', '))}" placeholder="UKO, Martin"/><div class="inbox-detail-actions"><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="remove" data-id="${h(current.id)}">Archivieren</button></div></form><div class="inbox-detail-next">${ico('target',18)}<div><strong>Später klären</strong><p>Im Wochenreview wird daraus eine Next Action, ein Projekt, eine Agenda oder Dreams. Bis dahin bleibt dieser Gedanke zuverlässig in der Inbox.</p><button type="button" class="review-link" data-tab="review">Zum Review ${ico('arrow',14)}</button></div></div>`:
 `<div class="inbox-mvp-empty detail-empty">${ico('pencil',32)}<strong>Ein Gedanke genügt.</strong><span>Öffne die Schnellerfassung und halte fest, was dich beschäftigt.</span></div>`}</aside></div>`);
}

function clarifyControls(currentId=null){
 const saved=(currentId&&state?.reviewMeta?.[currentId])||{};
 const energy=[['low','Wenig',1],['medium','Mittel',2],['high','Viel',3]];
 const attentions=[['routine','Routine','sync'],['clarity','Geistige Klarheit','sun'],['deep','Tiefes Denken','book']];
 return `<div class="clarify-options" aria-label="Klärung und Energie"><div class="clarify-choice"><h3>Wohin gehört es?</h3><div class="choice-row">${[['next','Next Action'],['waiting','Waiting For'],['hold','On Hold'],['dreams','Dreams']].map(([value,label])=>`<button type="button" data-action="review-clarify:${value}" data-id="${h(currentId||'')}" class="choice-pill ${reviewWorkflow===value?'chosen':''}" aria-pressed="${reviewWorkflow===value}" ${currentId?'':'disabled'}>${label}</button>`).join('')}<span class="muted-line">Weitere Ziele können als Projekte oder Ideen angelegt werden.</span></div></div>
 <div class="clarify-choice"><h3>Wie viel Energie braucht es?</h3><div class="choice-row review-energy-choices">${energy.map(([key,label,level])=>`<button type="button" class="review-choice review-energy-${key} ${saved.energy===key?'chosen':''}" aria-pressed="${saved.energy===key}" data-action="review-energy:${key}" data-id="${h(currentId||'')}" ${currentId?'':'disabled'}><span class="mini-battery battery-${level}"><i></i></span>${label}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Welche Art von Aufmerksamkeit?</h3><div class="choice-row">${attentions.map(([key,label,icon])=>`<button type="button" class="review-choice review-attention ${saved.attention===key?'chosen':''}" aria-pressed="${saved.attention===key}" data-action="review-attention:${key}" data-id="${h(currentId||'')}" ${currentId?'':'disabled'}>${ico(icon,15)} ${label}</button>`).join('')}</div></div>
 <small class="review-local-caption">Energie und Aufmerksamkeit werden verschlüsselt in diesem lokalen Tresor gespeichert. Die Synchronisierung dieser Review-Merkmale auf andere Geräte folgt später.</small>
 <p class="muted-line">Projekt, Defer, Planned, Due und Duration kannst du direkt unterhalb der Klärung festlegen.</p>
 </div>`;
}
function reviewTaskRow(t,mode='next'){
 return `<div class="assistant-task"><div><strong>${h(t.title)}</strong><small>${h(t.projectId?projectLabel(t.projectId):'Einzelaktion')}${t.dueDate?' · Due '+h(t.dueDate):''}${t.workflow==='waiting'?' · Waiting For':''}</small></div><div class="assistant-actions"><button type="button" class="secondary-btn" data-action="assistant-task-edit" data-id="${h(t.id)}">Bearbeiten</button><button type="button" class="secondary-btn" data-action="assistant-task-done" data-id="${h(t.id)}">Erledigt</button></div></div>`;
}
function reviewInlineEditor(){
 const t=state?.tasks?.[reviewEditingTaskId];if(!t||t.archived)return '';
 return `<form id="review-inline-task" data-id="${h(t.id)}" class="assistant-inline-form"><div class="work-heading"><span>${ico('pencil',16)} Aufgabe bearbeiten</span><button type="button" class="secondary-btn" data-action="assistant-task-cancel">Schließen</button></div><label>Titel<input name="title" required maxlength="180" value="${h(t.title)}"/></label><label>Notiz<textarea name="note" maxlength="3000" rows="2">${h(t.note||'')}</textarea></label><div class="assistant-form-grid"><label>Status<select name="workflow">${workflowOptions(t.workflow)}</select></label><label>Projekt<select name="projectId">${projectOptions(t.projectId)}</select></label><label>Geplant<input name="plannedDate" type="date" value="${h(t.plannedDate||'')}"/></label><label>Defer (keine Deadline)<input name="deferUntil" type="date" value="${h(t.deferUntil||'')}"/></label><label>Due (harte Frist)<input name="dueDate" type="date" value="${h(t.dueDate||'')}"/></label><label>Agenda-Tags<input data-smart-tags name="tags" maxlength="300" value="${h((t.tags||[]).join(', '))}"/></label></div><button type="submit" class="primary-btn">Aufgabe speichern</button></form>`;
}
function reviewQuickAction(defaultProject=null){
 return `<form id="review-quick-action" class="assistant-quick-action"><label>Nächste Aktion direkt hier erfassen<input name="title" required maxlength="180" placeholder="Konkreter, ausführbarer nächster Schritt …"/></label><div class="assistant-form-grid"><label>Projekt<select name="projectId">${projectOptions(defaultProject)}</select></label><label>Status<select name="workflow">${workflowOptions('next')}</select></label><label>Personen- / Agenda-Tags<input name="tags" data-smart-tags maxlength="300" placeholder="Tag eingeben …"/></label></div><button class="secondary-btn" type="submit">${ico('plus',14)} Aktion anlegen</button></form>`;
}
function reviewCalendarEntries(events,kind){
 if(!calendarToken)return `<p class="muted-line">Google Kalender ist noch nicht verbunden. Du kannst diesen Schritt trotzdem bewusst abschließen oder später erneut prüfen. Kalender-Zugriff bleibt nur lesend.</p>${reviewQuickAction()}`;
 return `${events.length?events.slice(0,35).map(e=>`<div class="assistant-task"><div><strong>${h(e.summary||'Kalendertermin')}</strong><small>${h(String(e.reviewDay))} · ${h(calendarTime(e))}${e.status==='tentative'?' · vorläufig':''}</small></div><span class="quiet-tag">${kind==='past'?'Vergangen':'Geplant'}</span></div>`).join(''):'<p class="muted-line">Keine passenden Kalendertermine in diesem Zeitfenster.</p>'}<p class="muted-line">Vergangene Termine sind keine bestätigten Treffen. Bei Nachbereitung oder Vorbereitung direkt eine Aktion anlegen.</p>${reviewQuickAction()}`;
}
function reviewStepBody(step,queue){
 if(step==='collect')return `<div class="assistant-help"><strong>Was ist noch im Kopf?</strong><p>Erfasse einzelne Gedanken schnell, bevor du die Inbox klärst. Auch Papiernotizen und Nachrichten-Postfächer bewusst berücksichtigen.</p></div><form id="review-capture" class="assistant-quick-action"><label>Gedanke, Erinnerung oder Zusage<input name="title" maxlength="1000" required placeholder="Was beschäftigt dich gerade?"/></label><button class="primary-btn" type="submit">Zur Inbox hinzufügen</button></form>`;
 if(step==='inbox'){
  const list=queue.inbox,current=list.find(r=>r.id===selectedInboxId)||list[0]||null;const draft=current?reviewDrafts.get(current.id)||{}:{};
  return `<div class="assistant-kpi">${list.length} ungeklärte Einträge</div><div class="review-cards-layout"><nav class="review-inbox-list">${list.map(r=>`<button type="button" class="review-inbox-item ${r.id===current?.id?'selected':''}" data-action="review-select" data-id="${h(r.id)}"><strong>${h(r.title)}</strong></button>`).join('')||'<p class="muted-line">Inbox leer – dieser Teil ist abgeschlossen.</p>'}</nav><div class="review-detail">${current?`<strong>${h(current.title)}</strong><p class="review-item-note">${h(current.note||'')}</p>${clarifyControls(current.id)}<form id="review-commit-form" data-id="${h(current.id)}"><div class="review-plan-fields"><label>Projekt<select name="projectId">${projectOptions(draft.projectId)}</select></label><label>Bereich<select name="category">${categoryOptions(draft.category||'Allgemein')}</select></label>${dateControl('deferUntil','Defer',draft.deferUntil)}${dateControl('plannedDate','Planned',draft.plannedDate)}${dateControl('dueDate','Due',draft.dueDate)}<label>Aufwand in Minuten<input type="number" name="estimateMinutes" min="5" max="1440" step="5" value="${h(draft.estimateMinutes||'')}"/></label></div><button class="primary-btn" type="submit">Als ${h(({next:'Next Action',waiting:'Waiting For',hold:'On Hold',dreams:'Dream'})[reviewWorkflow])} übernehmen</button></form><button type="button" class="secondary-btn assistant-remove" data-action="assistant-inbox-remove" data-id="${h(current.id)}">Eintrag archivieren</button>`:'<p class="muted-line">Die Inbox ist vollständig geklärt.</p>'}</div></div>`;
 }
 if(step==='calendar-past')return reviewCalendarEntries(queue.calendarPast,'past');
 if(step==='calendar-future')return reviewCalendarEntries(queue.calendarFuture,'future');
 if(step==='next')return `<div class="assistant-kpi">${queue.next.length} ausführbare Next Actions</div><p class="muted-line">Prüfe konkrete nächste Schritte. Aufgaben lassen sich hier bearbeiten oder als erledigt markieren.</p>${queue.next.slice(0,35).map(t=>reviewTaskRow(t)).join('')||'<p class="muted-line">Keine verfügbaren Next Actions.</p>'}${reviewInlineEditor()}${reviewQuickAction()}`;
 if(step==='waiting')return `<div class="assistant-kpi">${queue.waiting.length} offene Waiting For</div><p class="muted-line">Welcher Rückmeldung möchtest du nachgehen? Personentags verknüpfen Agenda-Punkte mit „Menschen“.</p>${queue.waiting.map(t=>reviewTaskRow(t,'waiting')).join('')||'<p class="muted-line">Keine offenen Waiting For.</p>'}${reviewInlineEditor()}${reviewQuickAction()}`;
 if(step==='projects'){
  const review=state.weeklyReview,project=queue.projects.find(p=>p.id===reviewProjectId)||queue.due.find(p=>!review.inspectedProjects.includes(p.id))||queue.projects.find(p=>!review.inspectedProjects.includes(p.id))||queue.projects[0];
  const sum=project?projectReviewSummary(project,state):null;
  const remaining=queue.due.filter(p=>!review.inspectedProjects.includes(p.id));
  return `<div class="assistant-project-stats"><strong>${queue.projects.length} aktive Projekte</strong><span>${queue.due.length} fällig · ${remaining.length} noch unbestätigt</span></div>
   <div class="assistant-project-layout"><div class="assistant-project-queue">${queue.projects.map(p=>`<button type="button" data-action="assistant-project-select" data-id="${h(p.id)}" class="assistant-project-entry ${project?.id===p.id?'selected':''}"><span>${h(p.title)}</span><small>${projectNeedsReview(p)?'Review fällig':`Intervall ${p.reviewIntervalDays||7} Tage`}${review.inspectedProjects.includes(p.id)?' · ✓ geprüft':''}</small></button>`).join('')||'<p class="muted-line">Keine aktiven Projekte.</p>'}</div>
   <div class="assistant-project-focus">${project?`<h3>${h(project.title)}</h3><p class="muted-line">${h(project.outcome||'Noch kein gewünschtes Ergebnis hinterlegt.')}</p><div class="assistant-project-kpis"><span>${sum.tasks.length} offene Schritte</span><span>${sum.available.length} verfügbar</span><span>Review alle ${sum.interval} Tage</span></div>${!sum.available.length?'<p class="project-warning">Keine ausführbare Next Action – solltest du einen nächsten Schritt definieren?</p>':''}
   ${sum.tasks.slice(0,25).map(t=>reviewTaskRow(t)).join('')||'<p class="muted-line">Noch keine Aufgaben.</p>'}${reviewInlineEditor()}${reviewQuickAction(project.id)}<div class="assistant-project-footer"><button type="button" class="primary-btn" data-action="assistant-project-reviewed" data-id="${h(project.id)}">${ico('check',16)} Projekt geprüft</button><small>Das tatsächliche Reviewdatum wird im Projekt gespeichert und synchronisiert.</small></div>`:''}</div></div>`;
 }
 if(step==='unassigned')return `<div class="assistant-kpi">${queue.unassigned.length} offene projektlose Aufgaben</div><p class="muted-line">Einzelaktionen dürfen ohne Projekt bleiben. Prüfe nur, ob etwas tatsächlich mehrere Schritte erfordert.</p>${queue.unassigned.slice(0,60).map(t=>reviewTaskRow(t)).join('')||'<p class="muted-line">Keine offenen Einzelaktionen.</p>'}${reviewInlineEditor()}${reviewQuickAction()}`;
 if(step==='someday')return `<p class="muted-line">Was davon möchtest du weiter aufheben? Was kann aktiv werden?</p>${queue.dreams.slice(0,50).map(r=>`<div class="assistant-task"><strong>${h(r.title)}</strong><button type="button" class="secondary-btn" data-action="assistant-dream-activate" data-id="${h(r.id)}">In Inbox</button></div>`).join('')||'<p class="muted-line">Keine Someday-Ideen vorhanden.</p>'}<form id="review-capture" class="assistant-quick-action"><label>Neue Möglichkeit festhalten<input name="title" maxlength="1000" required placeholder="Was wäre interessant?"/></label><button type="submit" class="secondary-btn">In Inbox erfassen</button></form>`;
 const health=state?.healthImports||{},healthDates=[...(health.garminNights||[]),...(health.garminHrv||[])];
 const missing=missingGarminDays(healthDates,localDate());
 const healthText=!healthDates.length?'Noch keine Garmin-Daten importiert.':missing.length?`${missing.length} Tage nach dem letzten Garmin-Import vorgeschlagen (${missing[0]} bis ${missing.at(-1)}).`:'Keine offenen Tage nach dem letzten Garmin-Import erkannt.';
 const healthReview=`<section class="assistant-health-review"><div class="work-heading"><span>${ico('activity',16)} Optional: Gesundheitsdaten aktualisieren</span><span class="quiet-tag">Garmin + Fitdays</span></div><p class="muted-line">${h(healthText)} Die Daten werden nur in deinem verschlüsselten lokalen Tresor verarbeitet.</p><label class="secondary-btn health-upload-btn">Gesammelte Dateien auswählen<input id="health-import-input" type="file" multiple accept=".zip,.fit,.csv,.xls,.xlsx,.json"/></label>${healthFilePreview?`<p>${healthFilePreview.processed} Datei(en) geprüft · ${healthFilePreview.fitdays.length} Fitdays-Werte · ${healthFilePreview.garminNights.length} Nächte · ${healthFilePreview.garminHrv.length} HRV-Tage · ${(healthFilePreview.garminWellness||[]).length} Stress-/Energie-Messpunkte · ${(healthFilePreview.garminFitness||[]).length} Garmin-Aktivitätstage · ${(healthFilePreview.garminSessions||[]).length} Trainingssessions.</p>${healthFilePreview.errors.length?`<p class="error">${healthFilePreview.errors.map(h).join(' · ')}</p>`:''}<button type="button" class="primary-btn" data-action="health-import-confirm">Import übernehmen</button> <button type="button" class="secondary-btn" data-action="health-import-cancel">Verwerfen</button>`:''}<p class="small-muted">Dieser Schritt ist freiwillig und blockiert den GTD-Review nicht.</p></section>`;
 return `<div class="assistant-finish"><h3>Was ist jetzt noch offen?</h3><div class="assistant-finish-grid"><span><strong>${queue.inbox.length}</strong> Inbox</span><span><strong>${queue.due.length}</strong> fällige Projekte</span><span><strong>${queue.waiting.length}</strong> Waiting For</span><span><strong>${queue.unassigned.length}</strong> Einzelaktionen</span></div><label>Gedanken zum Abschluss<textarea id="review-end-notes" maxlength="1200" rows="3" placeholder="Was ist jetzt klarer? Was soll beim nächsten Review wieder auftauchen?">${h(state.weeklyReview?.notes||'')}</textarea></label><p class="muted-line">Du kannst den Review vollständig oder bewusst teilweise abschließen. Ein vollständiger Schritt bedeutet „durchgesehen“, nicht zwingend „alles erledigt“.</p>${healthReview}</div>`;
}
function reviewScreen(){
 if(!validReview(state.weeklyReview)){state.weeklyReview=newReview();state.reviewVersion=state.reviewVersion||0;}
 const q=reviewQueue(state,calendarEvents,localDate()),r=state.weeklyReview;
 const index=r.step,step=REVIEW_STEPS[index],done=r.done.length,progress=Math.round(100*done/REVIEW_STEPS.length);
 return chrome(`<div class="assistant-review">
  <header class="assistant-review-head work-card"><div><span class="page-overline">GTD · WEEKLY REVIEW</span><h2>Dein System durchsehen.</h2><p class="muted-line">Ein Bereich nach dem anderen – ohne Reiterwechsel. Fortschritt wird gespeichert.</p></div><div><strong>${done} / ${REVIEW_STEPS.length}</strong><small> Bereiche geprüft</small><div class="assistant-progress"><span style="width:${progress}%"></span></div><button type="button" class="secondary-btn" data-action="assistant-new">Neuen Review starten</button></div></header>
  ${state.reviewConflict?`<div class="project-warning"><strong>Review-Konflikt auf anderem Gerät.</strong><p>Wähle bewusst, welche Version gilt.</p><button type="button" class="secondary-btn" data-action="assistant-resolve-remote">Cloud übernehmen</button><button type="button" class="secondary-btn" data-action="assistant-resolve-local">Meine Version behalten</button></div>`:''}
  ${r.completedAt?`<div class="assistant-completed work-card"><strong>Letzter Review abgeschlossen: ${h(new Date(r.completedAt).toLocaleDateString('de-AT'))}</strong><p>Du kannst die Schritte nachsehen oder einen neuen Durchgang beginnen.</p></div>`:''}
  <div class="assistant-review-grid"><nav class="work-card assistant-steps" aria-label="Review-Bereiche">${REVIEW_STEPS.map((s,i)=>`<button type="button" class="assistant-step ${i===index?'is-selected':''}" data-action="assistant-step" data-id="${i}" aria-current="${i===index?'step':'false'}"><span>${r.done.includes(s.id)?'✓':i+1}</span><span><strong>${h(s.title)}</strong><small>${h(s.phase)}</small></span></button>`).join('')}</nav>
  <section class="work-card assistant-current"><div class="assistant-stage-header"><small>${h(step.phase)} · Schritt ${index+1} / ${REVIEW_STEPS.length}</small><h2>${h(step.title)}</h2><p>${h(step.help)}</p></div>${reviewStepBody(step.id,q)}<div class="assistant-review-footer"><button type="button" class="secondary-btn" data-action="assistant-back" ${index===0?'disabled':''}>← Zurück</button><button type="button" class="secondary-btn" data-action="assistant-next" ${index===REVIEW_STEPS.length-1?'disabled':''}>Überspringen</button><button type="button" class="primary-btn" data-action="assistant-complete-step">${index===REVIEW_STEPS.length-1?'Review abschließen':'Diesen Bereich geprüft →'}</button></div></section></div>
 </div>`);
}
function systemScreen(){
 return chrome(`<div class="system-grid"><section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('cloud',22)}<h2>Cloud-Verbindung</h2></div></div><p class="module-subtitle">GitHub Pages · Cloudflare Worker · D1</p>
 <div class="connection-detail"><span class="connection-dot ${configured()?'green':'amber'}"></span><span>${configured()?'Konfiguration hinterlegt':'Google-Anmeldung noch nicht konfiguriert'}</span></div>
 <p class="small-muted">${configured()?'API: '+h(config.apiUrl):'In client/public/runtime-config.json sind noch Konfigurationswerte zu ergänzen.'}</p><p class="small-muted">Frontend: Compass ${COMPASS_CLIENT_VERSION} · benötigt Worker-API 11 oder neuer.</p>
 <div id="google-button" class="google-button"></div><p class="small-muted">${authToken?'Compass-Sitzung aktiv: '+h(currentUser)+' · bleibt nach erneutem Tresor-Entsperren erhalten.':'Google-Anmeldung einmalig verknüpfen; danach wird die Compass-Sitzung verschlüsselt im Tresor gespeichert.'}</p><p class="small-muted">Automatisch: 7 Sekunden nach Änderungen und etwa alle 15 Minuten, solange Compass geöffnet und sichtbar ist. Manuell jederzeit über „Jetzt synchronisieren“.</p>
 <div class="system-actions"><button class="primary-btn" data-action="sync" ${!authToken||busy?'disabled':''}>${busy?'Synchronisiere …':'Jetzt synchronisieren'} ${ico('sync',16)}</button><button class="secondary-btn" data-action="logout" ${!authToken?'disabled':''}>Google trennen</button></div>
 <div class="mini-stats"><div><span>Wartende Änderungen</span><strong>${state.pending.length}</strong></div><div><span>Konflikte</span><strong>${state.conflicts.length}</strong></div><div><span>Sync-Cursor</span><strong>${state.cursor}</strong></div></div></section>
 <section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('shield',22)}<h2>Lokaler Tresor</h2></div></div><p class="module-subtitle">Verschlüsselt und offline nutzbar.</p>
 <div class="security-line">${ico('check',17)} AES-256-GCM verschlüsselte Speicherung</div><div class="security-line">${ico('check',17)} Passphrase bleibt auf deinem Gerät</div><div class="security-line">${ico('check',17)} Keine privaten Aufgaben in GitHub</div>
 <button class="secondary-btn full" data-action="export-encrypted">Verschlüsseltes Backup herunterladen</button><button class="secondary-btn full" data-action="export-json">Klartext-JSON exportieren</button><p class="small-muted">Klartext-Exporte enthalten unverschlüsselte private Inhalte.</p></section></div>
 <section class="work-card ux-settings" aria-label="Darstellung anpassen"><div class="work-heading"><span>${ico('settings',18)} Darstellung & Bedienung</span><span class="quiet-tag">Nur auf diesem Gerät</span></div>
 <p class="muted-line">Diese Einstellungen werden verschlüsselt in deinem lokalen Tresor gespeichert.</p>
 <div class="ux-settings-row"><div><strong>Weitere Ansichten dauerhaft öffnen</strong><small>Flagged, On Hold, Dreams und Aktivitäten in der Navigation anzeigen.</small></div><button type="button" class="secondary-btn" data-action="nav-more">${state?.uiPreferences?.advancedNav?'Ausblenden':'Einblenden'}</button></div>
 <div class="ux-settings-row"><div><strong>Erholungsideen</strong><small>Eigene Vorschläge und Filter findest du unter Erholung. Sie werden nicht ungefragt zu Aufgaben.</small></div><button type="button" class="secondary-btn" data-tab="recovery">Erholung öffnen</button></div>
 </section>
 ${state.conflicts.length?`<section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('sync',21)}<h2>Synchronisationskonflikte (${state.conflicts.length})</h2></div></div><p class="module-subtitle">Wähle bewusst die gewünschte Fassung.</p>${state.conflicts.map(c=>`<div class="conflict"><p><strong>Lokal:</strong> ${h(c.local?.title||'(gelöscht)')}</p><p><strong>Cloud:</strong> ${h(c.remote?.title||'(fehlt)')}</p>${c.local?.note||c.remote?.note?`<p class="small-muted"><strong>Notiz lokal:</strong> ${h(c.local?.note||'(leer)')} · <strong>Cloud:</strong> ${h(c.remote?.note||'(leer)')}</p>`:''}<div class="system-actions"><button class="secondary-btn" data-action="resolve-remote" data-id="${h(c.id)}">Cloud übernehmen</button><button class="primary-btn" data-action="resolve-local" data-id="${h(c.id)}">Meine Version behalten</button></div></div>`).join('')}</section>`:''}`);
}
function projectLabel(projectId){return state?.projects?.[projectId]?.title||'Ohne Projekt';}
function personTag(name){return String(name||'').normalize('NFKC').toLocaleLowerCase('de').trim().replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,32);}
function allOccasions(){return occasionsWithPeople(calendarEvents,eventAppearance,state?.people||{},localDate(),OCCASION_LEAD_DAYS);}
function occasionStatus(occasion,step){
 const existing=relatedOccasionTask(state,occasion,step);
 if(existing)return {kind:'accepted',task:existing};
 const key=occasionStepKey(occasion,step);
 return {kind:state?.occasionChoices?.[key]==='dismissed'?'dismissed':'pending'};
}
function occasionPanel(){
 const occasions=allOccasions();
 if(!occasions.length)return '';
 const visible=occasions.filter(o=>{
  const steps=[...OCCASION_STEPS[o.kind],...(state?.customOccasionSteps?.[o.id]||[]).filter(validCustomStep)];
  return steps.some(st=>occasionStatus(o,st).kind!=='pending'||daysUntil(localDate(),o.date)<=st.daysBefore);
 });
 if(!visible.length)return '';
 const first=visible.slice(0,7);
 return `<section class="work-card occasion-panel" aria-label="Anlässe und Vorbereitungen"><div class="work-heading"><span>${ico('bell',18)} Anstehende Anlässe</span><button type="button" class="secondary-btn" data-action="occasion-toggle">${occasionOpen?'Einklappen':'Anzeigen'}</button></div>
 ${occasionOpen?`${first.map(o=>{
  const distance=daysUntil(localDate(),o.date);
  const steps=[...OCCASION_STEPS[o.kind],...(state?.customOccasionSteps?.[o.id]||[]).filter(validCustomStep)];
  return `<div class="occasion-entry"><div class="occasion-entry-head"><span class="occasion-emoji">${h(o.emoji)}</span><div><strong>${h(o.title)}</strong><small>${h(o.date)} · ${distance===0?'Heute':`in ${distance} Tagen`} ${o.source==='calendar'?'· Google Kalender':o.source==='people'?'· Menschen':'· jährlich'}</small></div><button type="button" class="secondary-btn" data-action="occasion-custom" data-id="${h(o.id)}">+ Eigener Schritt</button></div>
  <div class="occasion-suggestions">${steps.map(st=>{const status=occasionStatus(o,st),active=distance<=st.daysBefore;
   if(status.kind==='pending'&&!active)return '';
   return `<div class="occasion-suggestion ${status.kind!=='pending'?'occasion-quiet':''}"><span>${h(st.label)}<small>${status.kind==='accepted'?'Als Aufgabe übernommen':status.kind==='dismissed'?'Für diesen Anlass ausgeblendet':`Sinnvoll bis ${h((()=>{const d=new Date(o.date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-st.deadlineBefore);return d.toISOString().slice(0,10)})())}`}</small></span><div>${status.kind==='pending'?`<button type="button" class="primary-btn" data-action="occasion-accept" data-id="${h(o.id)}" data-step="${h(st.id)}">Übernehmen</button><button type="button" class="secondary-btn" data-action="occasion-dismiss" data-id="${h(o.id)}" data-step="${h(st.id)}">Nicht nötig</button>`:status.kind==='dismissed'?`<button type="button" class="secondary-btn" data-action="occasion-reset" data-id="${h(o.id)}" data-step="${h(st.id)}">Wieder anzeigen</button>`:`<button type="button" class="secondary-btn" data-action="task-view" data-id="${h(status.task.id)}">Aufgabe ansehen</button>`}</div></div>`;
  }).join('')}</div></div>`;
 }).join('')}<small class="occasion-footnote">Vorschläge erzeugen keine Aufgaben ohne deine Zustimmung. Feiertage werden jährlich berechnet, Geburtstage aus „Menschen“ oder Google Kalender erkannt. Keine Push-Benachrichtigung bei geschlossener App.</small>`:`<p class="muted-line">${visible.length} Anlässe mit offenen Vorbereitungen</p>`}</section>`;
}
function timelinePanel(){
 const today=localDate();const windowEnd=shiftDay(today,overviewHorizon-1);
 const maxWeek=Math.max(0,Math.ceil(overviewHorizon/7)-1);
 overviewWeek=Math.min(overviewWeek,maxWeek);
 const first=shiftDay(today,overviewWeek*7);
 const count=Math.min(7,overviewHorizon-overviewWeek*7);
 const days=Array.from({length:count},(_,i)=>shiftDay(first,i));
 const entries=timelineItems(state,calendarEvents,first,days[days.length-1],eventAppearance).filter(x=>x.date>=first&&x.date<=days[days.length-1]);
 const grouped=new Map(days.map(d=>[d,[]]));for(const x of entries)grouped.get(x.date)?.push(x);
 const selected=days.includes(selectedTimelineDay)?selectedTimelineDay:(entries[0]?.date||days[0]);
 const list=grouped.get(selected)||[],labels={due:'Deadline',planned:'Geplant',milestone:'Meilenstein',calendar:'Kalender'};
 const period=d=>new Intl.DateTimeFormat('de-AT',{day:'2-digit',month:'short'}).format(new Date(`${d}T12:00:00`));
 const dayName=d=>new Intl.DateTimeFormat('de-AT',{weekday:'short'}).format(new Date(`${d}T12:00:00`));
 return `<section class="work-card overview-timeline"><div class="work-heading"><span>${ico('layers',19)} Timeline · Projekte, Meilensteine & Termine</span><div class="timeline-horizon">${[14,30,90].map(n=>`<button type="button" data-action="timeline-horizon" data-id="${n}" class="secondary-btn ${overviewHorizon===n?'is-chosen':''}">${n} Tage</button>`).join('')}</div></div>
 <div class="timeline-week-nav"><div><strong>Woche ${overviewWeek+1}</strong><span> · ${h(period(first))}–${h(period(days[days.length-1]))}</span></div><div class="timeline-week-arrows"><button type="button" class="secondary-btn" data-action="timeline-week-prev" aria-label="Vorherige Woche" ${overviewWeek===0?'disabled':''}>${ico('arrowLeft',16)} Vorherige</button><button type="button" class="secondary-btn" data-action="timeline-week-next" aria-label="Nächste Woche" ${overviewWeek>=maxWeek?'disabled':''}>Nächste ${ico('arrow',16)}</button></div></div>
 <div class="timeline-axis" role="group" aria-label="Zeitstrahl, Woche ${overviewWeek+1}">
 ${days.map(d=>{const items=grouped.get(d)||[];return `<button type="button" class="timeline-axis-day ${d===selected?'selected':''} ${d===today?'is-today':''}" data-action="timeline-day" data-id="${h(d)}" aria-pressed="${d===selected}" aria-label="${h(dayName(d))} ${h(period(d))}, ${items.length} Ereignisse"><span class="timeline-axis-date">${h(dayName(d))} <strong>${h(period(d))}</strong></span><span class="timeline-axis-dot ${items.length?'has-events':''}"></span><span class="timeline-axis-count">${items.length?`${items.length} ${items.length===1?'Eintrag':'Einträge'}`:'–'}</span></button>`;}).join('')}
 </div>
 <div class="timeline-selected-detail"><div class="work-heading"><span>${ico('calendar',17)} ${h(dayName(selected))}, ${h(period(selected))}</span><span class="quiet-tag">${list.length} Einträge</span></div>
 ${list.length?`<div class="timeline-detail-grid">${list.map(x=>`<button type="button" class="timeline-detail-card type-${h(x.type)}" ${x.type==='calendar'?`data-action="agenda-open" data-id="${h(x.id)}"`:`data-action="${x.type==='milestone'?'timeline-project':'task-view'}" data-id="${h(x.id)}"`}><span class="branch-icon">${h(x.icon||(x.type==='milestone'?'◆':x.type==='due'?'⚑':'•'))}</span><span><strong>${h(x.title)}</strong><small>${h(labels[x.type]||x.type)}${x.projectId&&state?.projects?.[x.projectId]?` · ${h(projectLabel(x.projectId))}`:''}</small></span></button>`).join('')}</div>`:'<p class="timeline-day-empty">An diesem Tag gibt es im gewählten Zeitraum keine Einträge. Wähle einen anderen Punkt auf dem Zeitstrahl.</p>'}
 </div>
 <small class="occasion-footnote">${h(period(today))} bis ${h(period(windowEnd))} · Google Calendar nur lesend. Projekt-Meilensteine nutzen die Projekt-Deadline.</small></section>`;
}
function peopleScreen(){
 const people=Object.values(state?.people||{}).sort((a,b)=>a.name.localeCompare(b.name,'de'));
 const selected=people.find(p=>p.id===selectedPersonId)||people[0];
 const taskListFor=p=>Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&[...(t.tags||[]),...(t.contextTags||[])].includes(p.tag));
 const related=selected?taskListFor(selected):[];
 const waiting=related.filter(t=>t.workflow==='waiting').length;
 const personEvents=selected?personCalendarEvents(calendarEvents,selected,localDate()):{upcoming:[],past:[]};
 return chrome(`<div class="people-grid"><section class="work-card"><div class="work-heading"><span>${ico('people',18)} Kontakte & Gesprächspunkte</span><span class="quiet-tag">${people.length}</span></div><form id="person-create-form" class="compact-stack"><label>Name<input name="name" maxlength="80" required placeholder="Name hinzufügen" /></label><button type="submit" class="primary-btn">Person hinzufügen</button></form><div class="people-list">${people.map(p=>`<button type="button" data-action="person-select" data-id="${h(p.id)}" class="people-item ${selected?.id===p.id?'selected':''}"><strong>${h(p.name)}</strong><small>${taskListFor(p).length} offene Punkte${p.birthdayMonthDay?` · 🎂 ${h(p.birthdayMonthDay.slice(3))}.${h(p.birthdayMonthDay.slice(0,2))}.`:""}</small></button>`).join('')||'<p class="muted-line">Noch keine Kontakte. Personen und Notizen bleiben in deinem verschlüsselten lokalen Tresor.</p>'}</div></section>
 <section class="work-card"><div class="work-heading"><span>${ico('list',18)} ${selected?h(selected.name):'Gesprächsvorbereitung'}</span>${selected?`<button class="secondary-btn" type="button" data-action="person-remove" data-id="${h(selected.id)}">Entfernen</button>`:''}</div>${selected?`<p class="muted-line">${related.length} offene Schritte · ${waiting} Waiting For</p>
 <form id="person-tag-form" class="compact-stack" data-id="${h(selected.id)}"><label>Personen-Tag<input name="tag" data-smart-tags maxlength="50" value="${h(selected.tag)}" required/></label><label>Namensvarianten für Kalender (optional)<input name="aliases" maxlength="200" value="${h(selected.aliases||'')}" placeholder="Spitzname, Kurzform …"/></label><button class="secondary-btn" type="submit">Zuordnung speichern</button><small>Das Tag verbindet offene Aufgaben mit dieser Person. Kalendertermine werden anhand des Namens oder der angegebenen Varianten erkannt.</small></form>
 <div class="people-calendar"><div class="work-heading"><span>${ico('calendar',16)} Gemeinsame Google-Termine</span><span class="quiet-tag">${personEvents.upcoming.length} kommende</span></div>${personEvents.upcoming.slice(0,5).map(e=>`<div class="person-calendar-event"><strong>${h(e.summary||'Termin')}</strong><small>${h(String(e.start?.dateTime||e.start?.date||'').slice(0,16).replace('T',' · '))} · geplant</small></div>`).join('')||'<p class="muted-line">Keine zugeordneten künftigen Kalendertermine.</p>'}${personEvents.past.length?`<details><summary>${personEvents.past.length} vergangene Termine</summary>${personEvents.past.slice(0,6).map(e=>`<div class="person-calendar-event"><strong>${h(e.summary||'Termin')}</strong><small>${h(String(e.start?.dateTime||e.start?.date||'').slice(0,16).replace('T',' · '))} · Durchführung nicht bestätigt</small></div>`).join('')}</details>`:''}<small class="muted-line">Google Kalender wird nur im angemeldeten Browser gelesen. Vergangene Termine sind kein bestätigter Kontakt.</small></div>
 <form id="person-birthday-form" data-id="${h(selected.id)}" class="compact-stack person-birthday-form"><div class="work-heading"><span>${ico('calendar',16)} Geburtstag</span><span class="quiet-tag">${selected.birthdayMonthDay?`${h(selected.birthdayMonthDay.slice(3))}.${h(selected.birthdayMonthDay.slice(0,2))}.${selected.birthdayYear||''}`:'Nicht eingetragen'}</span></div>
 <div class="birthday-fields"><label>Tag<select name="day"><option value="">–</option>${Array.from({length:31},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(selected.birthdayMonthDay?.slice(3))===n?'selected':''}>${n}</option>`).join('')}</select></label><label>Monat<select name="month"><option value="">–</option>${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${Number(selected.birthdayMonthDay?.slice(0,2))===n?'selected':''}>${new Intl.DateTimeFormat('de-AT',{month:'long'}).format(new Date(2000,n-1,1))}</option>`).join('')}</select></label><label>Geburtsjahr (optional)<input type="number" name="year" min="1850" max="${new Date().getFullYear()}" placeholder="Unbekannt" value="${h(selected.birthdayYear??'')}"/></label></div>
 <div class="birthday-actions"><button type="submit" class="secondary-btn">Geburtstag speichern</button><button type="button" class="secondary-btn" data-action="person-birthday-clear" data-id="${h(selected.id)}" ${selected.birthdayMonthDay?'':'disabled'}>Entfernen</button></div>
 <small>Gespeichert im verschlüsselten Tresor auf diesem Gerät. Geburtstage erscheinen in der Anlassvorbereitung und werden mit gleichen Google-Kalendergeburtstagen zusammengeführt.</small></form>
 <form id="person-note-form" data-id="${h(selected.id)}" class="compact-stack"><label>Notizen zur Person<textarea name="note" rows="3" maxlength="1500">${h(selected.note||'')}</textarea></label><button type="submit" class="secondary-btn">Notiz speichern</button></form><form id="person-agenda-form" data-id="${h(selected.id)}" class="compact-stack"><label>Gesprächsthema oder Aufgabe<input name="title" maxlength="180" required placeholder="Was möchte ich ansprechen?"/></label><button type="submit" class="primary-btn">Agenda-Schritt anlegen</button></form><div class="people-agendas">${related.map(t=>`<button type="button" class="people-agenda" data-action="person-task-open" data-id="${h(t.id)}">${ico('checkSquare',16)} <span>${h(t.title)}<small>${h(t.workflow==='waiting'?'Waiting For':'Next Action')}</small></span></button>`).join('')||'<p class="muted-line">Noch keine offenen Agenda-Schritte.</p>'}</div>`:'<p class="muted-line">Wähle eine Person, um gemeinsame Themen und nächste Schritte zu verwalten.</p>'}</section></div>`);
}
function financeScreen(){return chrome(financePreviewView(ico,financePane));}
function insightsScreen(){
 const tabDef=INSIGHT_TABS.find(t=>t.id===insightTab)||INSIGHT_TABS[0];
 const today=localDate();
 const model=buildSleepInsights(state?.healthImports||{},today,insightPeriod);
 const tabs=INSIGHT_TABS.map(t=>`<button type="button" class="insights-nav-tab ${t.id===insightTab?'selected':''}" data-action="insights-tab" data-id="${h(t.id)}" aria-pressed="${t.id===insightTab}">${ico(t.icon,19)}<span>${h(t.label)}</span>${t.state==='live'?'<i class="insight-tab-live" aria-label="Bereits verfügbar"></i>':''}</button>`).join('');
 const periods=INSIGHT_PERIODS.map(([v,label])=>`<button type="button" class="insight-period ${insightPeriod===v?'selected':''}" data-action="insights-period" data-id="${h(v)}" aria-pressed="${insightPeriod===v}">${h(label)}</button>`).join('');
 const dataCount=(state?.healthImports?.garminNights?.length||0)+(state?.healthImports?.garminHrv?.length||0)+(state?.healthImports?.fitdays?.length||0)+(state?.healthImports?.garminWellness?.length||0)+(state?.healthImports?.garminFitness?.length||0)+(state?.healthImports?.garminSessions?.length||0);
 const content=insightTab==='sleep'?insightsSleepView(model,insightNight,ico,today):insightTab==='stress'?insightsStressView(state?.healthImports,insightPeriod,today,insightWellnessDay):insightTab==='energy'?insightsEnergyView(state?.healthImports,insightPeriod,today,insightWellnessDay):insightTab==='body'?healthBodyView(state?.healthImports||{},insightPeriod):insightTab==='activity'?fitnessInsightsView(state?.healthImports||{},healthDays,insightPeriod,today):insightTab==='sources'?healthSummaryPanel('sources'):insightsPlannedView(insightTab,state?.healthImports||{},healthDays,activeActivities(watchSessions,state));
 return chrome(`<div class="insight-workspace" aria-label="Compass Insights · Personal Analytics">
 <header class="insight-hero"><div><span class="insight-kicker">COMPASS / PERSONAL ANALYTICS</span><h2>Dein Leben in Daten.</h2><p>Ein gemeinsamer Blick auf Schlaf, Erholung, Aktivität und Fokus. Lokal analysiert – ohne automatisch erzeugte Gesundheitsbewertungen.</p></div><div class="insight-hero-side"><span>${ico('shield',18)} Lokaler Vault</span><strong>${dataCount}</strong><small>Garmin- und Fitdays-Datensätze</small></div></header>
 <nav class="insights-nav" aria-label="Insights-Kategorien">${tabs}</nav>
 <div class="insight-view-header"><div><div class="insight-kicker">${h(tabDef.label.toUpperCase())} / ${insightTab==='sources'?'VERWALTUNG':'ANALYSE'}</div><h2>${h(tabDef.subtitle)}</h2></div>${['sleep','body','activity','stress','energy'].includes(insightTab)?`<div class="insight-periods" aria-label="Zeitraum auswählen">${periods}</div>`:''}</div>
 ${content}
 ${insightTab==='sources'?'':`<div class="insight-import-bridge"><div>${ico('heart',22)}<span><strong>Daten ergänzen</strong><small>Garmin- und Fitdays-Dateien gesammelt unter Datenquellen importieren.</small></span></div><button class="secondary-btn" type="button" data-action="insights-tab" data-id="sources">Datenquellen öffnen →</button></div>`}
 </div>`);
}
function progressScreen(){
 const projects=Object.values(state?.projects||{}).filter(p=>p.kind!=='folder'&&p.status==='active');
 const today=localDate(),earlier=new Date(today+'T12:00:00');earlier.setDate(earlier.getDate()-6);const begin=localDate(earlier);
 const stats=activityStats(activeActivities(watchSessions,state),begin,today);
 return chrome(`<div class="progress-view"><section class="work-card"><div class="work-heading"><span>${ico('activity',18)} Aktivitäten der letzten 7 Tage</span></div><div class="metrics-row"><div><strong>${stats.count}</strong><small>Sessions</small></div><div><strong>${(stats.minutes/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong><small>erfasste Zeit</small></div><div><strong>${stats.pomodoros}</strong><small>Pomodoros</small></div></div><button type="button" class="text-link" data-tab="activity">Sessions verwalten ${ico('arrow',14)}</button></section><section class="work-card"><div class="work-heading"><span>${ico('folder',18)} Projektfortschritt</span><span class="quiet-tag">${projects.length} aktiv</span></div>${projects.length?projects.map(p=>{const tasks=projectTasks(state,p.id);const completed=tasks.filter(x=>x.completed).length;return `<button type="button" class="progress-project" data-action="timeline-project" data-id="${h(p.id)}"><span><strong>${h(p.title)}</strong><small>${completed} / ${tasks.length} Schritte erledigt</small></span><div class="progress-track"><span style="width:${tasks.length?Math.round(completed/tasks.length*100):0}%"></span></div></button>`;}).join(''):'<p class="muted-line">Noch keine aktiven Projekte.</p>'}</section></div>`);
}
function healthSummaryPanel(mode='full'){
 const today=localDate(),vm=healthViewModel(healthDays,today,healthSpan);const s=vm.stats;
 const label=(key)=>key==='steps'?'Schritte':key==='sleepMinutes'?'Schlaf':'Training';
 const fmt=(key,v)=>v===null?'–':key==='steps'?Number(v).toLocaleString('de-AT'):key==='sleepMinutes'?healthTime(v):`${v} min`;
 const chart=(key,cls)=>{const bars=healthBars(vm.points,key);return `<div class="health-chart health-chart-${cls}" role="img" aria-label="${label(key)} in den letzten ${healthSpan} Tagen">${bars.map((b,i)=>`<div class="health-chart-slot" title="${h(b.day)}: ${h(b.label)}"><div class="health-chart-rail">${b.value===null?'<span class="health-chart-unknown" aria-hidden="true">·</span>':`<span class="health-chart-bar" style="height:${b.height}%"></span>`}</div><span class="health-chart-date">${h(new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric'}).format(new Date(b.day+'T12:00:00Z')))}</span></div>`).join('')}</div>`;};
 const cards=[['steps','steps','🚶','Bewegung'],['sleepMinutes','sleep','🌙','Schlaf'],['exerciseMinutes','exercise','🏃','Training']].map(([key,cls,emoji,title])=>`<article class="health-visual-card"><div class="health-card-title"><span class="health-card-icon" aria-hidden="true">${emoji}</span><strong>${title}</strong></div><span class="health-card-number">${fmt(key,s[key].average)}</span><span class="health-card-sub">Ø je erfasstem Tag · ${s[key].count}/${healthSpan} Messwerte</span>${chart(key,cls)}</article>`).join('');
 const rows=[...healthDays].sort((a,b)=>b.day.localeCompare(a.day)).slice(0,30);
 return `${mode==='sources'?healthSourcesView(state?.healthImports):importedHealthDashboard(state?.healthImports,importHealthSpan,selectedGarminNight)}
 ${healthFilePreview?`<section class="health-import-preview"><strong>Importvorschau</strong><p>${healthFilePreview.processed} Datei(en) gelesen · ${healthFilePreview.fitdays.length} Fitdays-Messungen · ${healthFilePreview.garminNights.length} Garmin-Nächte · ${healthFilePreview.garminHrv.length} HRV-Tage · ${(healthFilePreview.garminWellness||[]).length} Stress-/Energie-Messpunkte · ${(healthFilePreview.garminFitness||[]).length} Garmin-Aktivitätstage · ${(healthFilePreview.garminSessions||[]).length} Trainingssessions.</p>${healthFilePreview.errors.length?`<p class="error">${healthFilePreview.errors.map(h).join('<br>')}</p>`:''}<div class="health-import-preview-actions"><button type="button" class="primary-btn" data-action="health-import-confirm">Import übernehmen</button><button type="button" class="secondary-btn" data-action="health-import-cancel">Verwerfen</button></div><small>Originaldateien werden weder gespeichert noch zur Cloud übertragen.</small></section>`:''}
 ${mode==='sources'?`<section class="work-card health-panel" aria-label="Geräteverbindungen"><div class="work-heading"><span>${ico('settings',18)} Health Connect & Android-Widget</span><button type="button" class="secondary-btn" data-action="health-refresh" ${!authToken?'disabled':''}>${ico('refresh',14)} Daten aktualisieren</button></div><p class="muted-line">${healthDays.length} Health-Connect-Tage aus der Cloud verfügbar (maximal 90 Tage geladen). Die Diagramme stehen unter Aktivität. Hier verwaltest du die Geräte und Berechtigungen.</p>${healthError?`<p class="error">${h(healthError)}</p>`:''}`:` <section class="work-card health-panel" aria-label="Gesundheitsüberblick"><div class="work-heading"><span>${ico('activity',18)} Gesundheit · Dein Überblick</span><button class="secondary-btn" data-action="health-refresh" ${!authToken?'disabled':''}>${ico('refresh',14)} Aktualisieren</button></div>
 <div class="health-hero"><div><span class="eyebrow">LETZTE ${healthSpan} TAGE</span><h3>Bewegung, Schlaf und Training</h3><p>Deine tatsächlichen Health-Connect-Messwerte. Fehlende Daten bleiben als Lücken sichtbar.</p></div><div class="health-span"><button class="secondary-btn ${healthSpan===7?'is-chosen':''}" data-action="health-range" data-id="7" aria-pressed="${healthSpan===7}">7 Tage</button><button class="secondary-btn ${healthSpan===30?'is-chosen':''}" data-action="health-range" data-id="30" aria-pressed="${healthSpan===30}">30 Tage</button></div></div>
 <div class="health-visual-grid">${cards}</div>
 <div class="health-observation"><span aria-hidden="true">✦</span><div><strong>Was die Daten zeigen</strong><p>${h(healthObservation(vm))}</p></div></div>
 ${healthError?`<p class="error">${h(healthError)}</p>`:''}
 <details class="health-details" ${healthDetailsOpen?'open':''} id="health-day-details"><summary>Tageswerte ansehen <span>${rows.length} gespeicherte Tage</span></summary><div class="health-days-list">${rows.map(d=>`<div class="health-day"><strong>${h(new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'2-digit',month:'short'}).format(new Date(d.day+'T12:00:00Z')))}</strong><span>${d.steps===null?'–':Number(d.steps).toLocaleString('de-AT')} Schritte</span><span>${healthTime(d.sleepMinutes)} Schlaf</span><span>${d.exerciseMinutes??'–'} min Sport</span></div>`).join('')}</div></details>
`}
 <div class="widget-connect-panel"><div><strong>📱 Android-Widget · Heute auf einen Blick</strong><p>Die Widgets zeigen Fokus-Aufgaben oder die Veranstaltungen der nächsten sieben Tage. Keine Gesundheitsdaten im Homescreen. Dafür ist ein eigener, jederzeit widerrufbarer Lesezugang erforderlich. Keine Tresor-Passphrase im Widget.</p></div><button type="button" class="secondary-btn" data-action="widget-pair" ${!authToken?'disabled':''}>Widget-Kopplungscode erzeugen</button>${widgetPairCode?`<strong class="watch-code">${h(widgetPairCode)}</strong>`:''}${widgetConnectError?`<p class="error">${h(widgetConnectError)}</p>`:''}${widgetDevices.map(d=>`<div class="watch-session"><span>${h(d.label)} · ${h(d.createdAt.slice(0,10))}</span><button type="button" class="secondary-btn" data-action="widget-revoke" data-id="${h(d.deviceHash)}">Widerrufen</button></div>`).join('')}</div>
 <details class="health-details" ${healthDevicesOpen?'open':''} id="health-device-details"><summary>Health Connect & Datenschutz <span>Verbindung verwalten</span></summary><div class="health-pair-panel"><p>Im Android-Companion die Berechtigungen erteilen und einen einmaligen Code eingeben.</p><button type="button" class="secondary-btn" data-action="health-pair" ${!authToken?'disabled':''}>Health-Connect-Kopplungscode erzeugen</button> ${healthPairCode?`<strong class="watch-code">${h(healthPairCode)}</strong>`:''}${healthDevices.map(d=>`<div class="watch-session"><span>${h(d.label)}</span><button class="secondary-btn" data-action="health-revoke" data-id="${h(d.deviceHash)}">Trennen</button></div>`).join('')}<button type="button" class="secondary-btn" data-action="health-delete-all">Gesundheitsdaten aus der Cloud löschen</button><small>Der freiwillige tägliche automatische Abgleich wird im Android-Companion aktiviert. Die Werte sind zugriffsgeschützt in Cloudflare D1 gespeichert, aber nicht Ende-zu-Ende-verschlüsselt. Keine medizinische Bewertung.</small></div></details></section>`;
}
function isoWeekNumber(d){const a=new Date(d);a.setUTCDate(a.getUTCDate()+4-(a.getUTCDay()||7));const y=new Date(Date.UTC(a.getUTCFullYear(),0,1));return Math.ceil((((a-y)/86400000)+1)/7);}
function discoveryPanel(){
 const today=localDate(),all=upcomingImportedEvents(state?.discoveredEvents,today);
 const monday=new Date(today+'T12:00:00Z');monday.setUTCDate(monday.getUTCDate()-((monday.getUTCDay()+6)%7)+7*discoveryWeekOffset);const mondayStr=monday.toISOString().slice(0,10);const sunday=new Date(monday);sunday.setUTCDate(monday.getUTCDate()+6);const sundayStr=sunday.toISOString().slice(0,10);
 const fmtWeek=d=>new Intl.DateTimeFormat('de-AT',{day:'numeric',month:'short'}).format(d);
 const preferences=state?.eventPreferences||{},fav=all.filter(e=>preferences[eventKey(e)]==='saved').length,hide=all.filter(e=>preferences[eventKey(e)]==='hidden').length;
 const filter=(e)=>{const status=preferences[eventKey(e)]||'open';if(discoveryRange==='saved'&&status!=='saved')return false;if(discoveryRange==='hidden'&&status!=='hidden')return false;if(!['saved','hidden'].includes(discoveryRange)&&status==='hidden')return false;
  if(discoveryCity!=='all'&&e.city!==discoveryCity)return false;if(discoveryArea!=='all'){const area=eventArea(e);if(discoveryArea==='austria'?!['graz','vienna','austria'].includes(area):discoveryArea==='europe'?!['graz','vienna','austria','europe'].includes(area):area!==discoveryArea)return false;}if(discoveryCategory!=='all'&&e.category!==discoveryCategory)return false;
  const d=new Date(today+'T12:00:00Z'),wd=d.getUTCDay();if(discoveryRange==='today')return e.date===today;
  if(discoveryRange==='week'){d.setUTCDate(d.getUTCDate()+7);return e.date<=d.toISOString().slice(0,10);}
  if(discoveryRange==='weekend'){d.setUTCDate(d.getUTCDate()+(6-wd+7)%7);const sat=d.toISOString().slice(0,10);d.setUTCDate(d.getUTCDate()+1);return e.date>=sat&&e.date<=d.toISOString().slice(0,10);}
  if(discoveryRange==='all')return (e.endDate||e.date)>=mondayStr&&e.date<=sundayStr;
  return true;};
 const events=all.filter(filter).slice(0,100),groups=new Map();for(const e of events){if(!groups.has(e.date))groups.set(e.date,[]);groups.get(e.date).push(e);}
 const eventCard=e=>{const key=eventKey(e),[emoji,tone]=discoveryAppearance(e.category),status=preferences[key]||'open';const desc=e.description||`${e.category} im ${e.venue||e.city}. Genauere Informationen zum Programm stehen auf der Veranstalterseite.`;
 return `<article class="discovery-card discovery-${tone}"><div class="discovery-art" aria-hidden="true">${e.imageUrl?`<img src="${h(e.imageUrl)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"/>`:""}<span class="discovery-art-fallback">${emoji}</span></div><div class="discovery-copy"><span class="discovery-type">${h(e.category)} · ${h(e.city)}${eventCountry(e)?` · ${h(eventCountry(e))}`:""}</span><h4>${h(e.title)}</h4><p>${h(desc)}</p><small>${h(e.venue)} · ${h(e.city)} · Termin und Details vor Besuch prüfen</small></div><div class="discovery-card-actions"><button type="button" class="secondary-btn ${status==='saved'?'is-chosen':''}" data-action="discovery-save" data-id="${h(key)}" aria-label="${status==='saved'?'Von Merkliste entfernen':'Zur Merkliste hinzufügen'}">${status==='saved'?'♥ Gemerkt':'♡ Merken'}</button><button type="button" class="text-link" data-action="discovery-hide" data-id="${h(key)}">${status==='hidden'?'Einblenden':'Ausblenden'}</button><a href="${h(e.sourceUrl)}" class="text-link" target="_blank" rel="noopener noreferrer">Details ↗</a></div></article>`;};
 const ranges=[['today','Heute'],['week','7 Tage'],['weekend','Wochenende'],['all','Alle'],['saved',`♥ Merkliste (${fav})`],['hidden',`Ausgeblendet (${hide})`]];
 const cities=[...new Set(all.map(x=>x.city))].sort();
 return `<section class="work-card discovery-panel"><div class="work-heading"><span>${ico('calendar',18)} Entdecken · Freizeit in deiner Nähe</span><span class="quiet-tag">${all.length} Veranstaltungen · ${fav} gemerkt</span></div>
 <p class="muted-line">Aus importierten Recherchen – keine Live-Verfügbarkeit. Die Programmbeschreibung wird nur angezeigt, wenn sie im Import enthalten ist.</p>
 <div class="discovery-tabs">${ranges.map(([value,title])=>`<button class="discovery-tab ${discoveryRange===value?'selected':''}" data-action="discovery-range" data-id="${value}" aria-pressed="${discoveryRange===value}">${h(title)}</button>`).join('')}</div>
 ${discoveryRange==='all'?`<div class="discovery-week-pager"><button type="button" class="secondary-btn" data-action="discovery-week-prev" ${discoveryWeekOffset===0?'disabled':''}>← Zurück</button><strong>${h(fmtWeek(monday))} – ${h(fmtWeek(sunday))} · KW ${isoWeekNumber(monday)}</strong><button type="button" class="secondary-btn" data-action="discovery-week-next">Weiter →</button><button type="button" class="text-link" data-action="discovery-week-today">Diese Woche</button></div>`:''}
 <div class="discovery-filters"><label>Region<select data-discovery-filter="area"><option value="all" ${discoveryArea==='all'?'selected':''}>Überall</option><option value="graz" ${discoveryArea==='graz'?'selected':''}>Graz & Umgebung</option><option value="vienna" ${discoveryArea==='vienna'?'selected':''}>Wien</option><option value="austria" ${discoveryArea==='austria'?'selected':''}>Österreich</option><option value="europe" ${discoveryArea==='europe'?'selected':''}>Europa</option></select></label><label>Stadt<select data-discovery-filter="city"><option value="all">Alle Städte</option>${cities.map(c=>`<option value="${h(c)}" ${discoveryCity===c?'selected':''}>${h(c)}</option>`).join('')}</select></label><label>Interesse<select data-discovery-filter="category"><option value="all">Alle Kategorien</option>${EVENT_CATEGORIES.map(c=>`<option value="${h(c)}" ${discoveryCategory===c?'selected':''}>${h(discoveryAppearance(c)[0])} ${h(c)}</option>`).join('')}</select></label><button class="secondary-btn" type="button" data-action="discovery-import-toggle">${discoveryImportOpen?'Import schließen':'＋ Veranstaltungen importieren'}</button></div>
 ${discoveryImportOpen?`<div class="discovery-import-drawer"><div class="discovery-actions"><button type="button" class="secondary-btn" data-action="discovery-prompt-regional">Recherche: Graz, Wien & Österreich</button><button type="button" class="secondary-btn" data-action="discovery-prompt-travel">Recherche: Tanz & Bujinkan Europa</button><button type="button" class="secondary-btn" data-action="discovery-clear">Importierte Events entfernen</button></div><form id="discovery-import-form" class="compact-stack"><label>Veranstaltungs-JSON<textarea name="events" rows="5" maxlength="200000" placeholder='{"events":[{"title":"...","date":"2026-11-01","city":"Graz","venue":"...","category":"Theater","description":"...","sourceUrl":"https://...","imageUrl":"https://...","country":"Österreich"}]}' required></textarea></label><button class="primary-btn" type="submit">Import prüfen</button></form>${discoveryImportPreview?`<div class="discovery-import-preview"><strong>${discoveryImportPreview.total} erkannt · ${discoveryImportPreview.added.length} neu · ${discoveryImportPreview.duplicates} Dubletten</strong><p>Die neuen Veranstaltungen werden erst nach deiner Bestätigung in den lokalen Tresor übernommen und mit deiner Compass-Cloud synchronisiert.</p><button class="primary-btn" type="button" data-action="discovery-import-confirm">${discoveryImportPreview.added.length} importieren</button><button class="secondary-btn" type="button" data-action="discovery-import-cancel">Abbrechen</button></div>`:""}<small>JSON mit Markdown-Codeblock und typischen KI-URL-Fehlern wird bereinigt. Bei Fehlern zeigen wir den Eintrag.</small></div>`:''}
 ${Object.keys(state?.eventConflicts||{}).length?`<div class="discovery-conflicts"><strong>${Object.keys(state.eventConflicts).length} Event-Konflikte zwischen Geräten</strong><p>Wähle je Veranstaltung die Cloud-Version oder deine lokale Bearbeitung.</p>${Object.entries(state.eventConflicts).slice(0,12).map(([k,c])=>`<div class="discovery-conflict-row"><span>${h(c.remote?.event?.title||k.split("|")[0])}</span><button class="secondary-btn" data-action="discovery-conflict-cloud" data-id="${h(k)}">Cloud</button><button class="secondary-btn" data-action="discovery-conflict-local" data-id="${h(k)}">Lokal</button></div>`).join("")}</div>`:""}
 <div class="discovery-day-groups">${[...groups].map(([date,items])=>{const shown=discoveryExpandedDays.has(date)?items:items.slice(0,3);return `<section class="discovery-day"><div class="discovery-day-head"><h3>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(date+'T12:00:00Z')))}</h3><span>${items.length} ${items.length===1?'Idee':'Ideen'}</span></div>${shown.map(eventCard).join('')}${items.length>3?`<button type="button" class="text-link discovery-more" data-action="discovery-more" data-id="${date}">${discoveryExpandedDays.has(date)?'Weniger anzeigen':`Weitere ${items.length-3} anzeigen`}</button>`:''}</section>`;}).join('')||'<p class="discovery-empty">Hier ist gerade nichts vorgemerkt. Ändere den Zeitraum oder die Filter, um andere Vorschläge zu sehen.</p>'}</div>
 </section>`;
}

function recoveryScreen(){
 const today=localDate(),endDate=new Date(today+'T12:00:00');endDate.setDate(endDate.getDate()+30);const end=localDate(endDate);
 const cal=calendarEvents.filter(e=>e.status!=='cancelled'&&calendarDate(e)>=today&&calendarDate(e)<=end&&eventAppearance(e).category==='Erholung'&&!eventAppearance(e).hidden);
 const acts=activeActivities(watchSessions,state).filter(x=>x.category==='Erholung').slice(0,25);
 const d=new Date(today+'T12:00:00');d.setDate(d.getDate()-6);const week=activityStats(activeActivities(watchSessions,state),localDate(d),today);
 const work=activeActivities(watchSessions,state).filter(x=>x.category==='Arbeit'&&x.startedAt.slice(0,10)>=localDate(d)).reduce((sum,x)=>sum+x.durationMinutes,0);
 const currentWeather=weather.status==='loaded'?recoveryWeather(weather.label):'unknown';
 const ideas=scoreRecoveryIdeas(allRecoveryIdeas(state),{weather:currentWeather,minutes:recoveryIdeaMinutes,energy:recoveryIdeaEnergy,range:recoveryIdeaRange});
 const weatherText=weather.status==='loaded'?`${weather.city}: ${weather.temperature} °C · ${weather.label}`:'Wetter noch nicht geladen';
 return chrome(`${discoveryPanel()}<section class="work-card recovery-idea-hub" aria-label="Freizeit bewusst planen">
 <div class="work-heading"><span>${ico('heart',20)} Zeit für dich</span><button class="secondary-btn" type="button" data-action="weather-load">${weather.status==='loaded'?'Wetter aktualisieren':'Wetter abrufen'}</button></div>
 <div class="recovery-glance"><div><span>Erfasste Arbeit · 7 Tage</span><strong>${(work/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong></div><div><span>Erfasste Erholung · 7 Tage</span><strong>${(week.recoveryMinutes/60).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong></div><div><span>Wetter · aktuell</span><strong>${h(weather.status==='loaded'?weather.label:'Nicht geladen')}</strong></div></div>
 <p class="muted-line">${work>0?'Die Erfassung zeigt nur protokollierte Zeiten, keine vollständige Arbeitsbelastung.':''} Diese Ideen sind freiwillige Inspirationen – keine Bewertung deiner Gesundheit. ${h(weatherText)}. Der Wetterfilter verwendet derzeit das aktuelle Stadtwetter, keine Wochenendprognose.</p>
 <div class="recovery-filter-row"><label>Zeitbudget<select id="recovery-idea-minutes" data-recovery-filter="minutes"><option value="60" ${recoveryIdeaMinutes===60?'selected':''}>Bis 1 Stunde</option><option value="180" ${recoveryIdeaMinutes===180?'selected':''}>Bis 3 Stunden</option><option value="360" ${recoveryIdeaMinutes===360?'selected':''}>Bis 6 Stunden</option><option value="1440" ${recoveryIdeaMinutes===1440?'selected':''}>Ganzer Tag</option></select></label>
 <label>Energie<select id="recovery-idea-energy" data-recovery-filter="energy"><option value="low" ${recoveryIdeaEnergy==='low'?'selected':''}>Wenig</option><option value="medium" ${recoveryIdeaEnergy==='medium'?'selected':''}>Mittel</option><option value="high" ${recoveryIdeaEnergy==='high'?'selected':''}>Viel</option></select></label>
 <label>Entfernung<select id="recovery-idea-range" data-recovery-filter="range"><option value="home" ${recoveryIdeaRange==='home'?'selected':''}>Zuhause</option><option value="near" ${recoveryIdeaRange==='near'?'selected':''}>In der Nähe</option><option value="trip" ${recoveryIdeaRange==='trip'?'selected':''}>Auch Ausflüge</option></select></label></div>
 <div class="recovery-ideas-grid">${ideas.length?ideas.map(i=>`<div class="recovery-idea"><span class="recovery-idea-emoji">${h(i.emoji)}</span><div><strong>${h(i.title)}</strong><small>${i.minutes} min · ${i.range==='home'?'Zuhause':i.range==='near'?'In der Nähe':'Ausflug'} · ${i.weather==='sun'?'☀️':i.weather==='rain'?'🌧️':'🌤️'}</small></div><button type="button" class="secondary-btn" data-action="recovery-idea-capture" data-id="${h(i.id)}" aria-label="${h(i.title)} in Inbox übernehmen">+ Inbox</button><button type="button" class="recovery-remove" data-action="${i.id.startsWith('idea-')?'recovery-idea-remove':'recovery-idea-hide'}" data-id="${h(i.id)}" aria-label="${i.id.startsWith('idea-')?'Idee entfernen':'Starteridee ausblenden'}">×</button></div>`).join(''):'<p class="muted-line">Für diese Auswahl gibt es noch keine passenden Ideen. Erhöhe das Zeitbudget oder ändere den Energiefilter.</p>'}</div>
 ${(state?.hiddenStarterIdeas||[]).length?`<button type="button" class="text-link" data-action="recovery-ideas-reset">Ausgeblendete Starterideen wiederherstellen (${state.hiddenStarterIdeas.length})</button>`:''}
 <form id="recovery-idea-form" class="recovery-add-form"><label>Eigene Freizeitidee<input name="title" required maxlength="90" placeholder="z. B. Ausflug zum See"/></label><label>Symbol<input name="emoji" maxlength="12" value="🌿" aria-label="Emoji für Idee"/></label><label>Dauer (Min.)<input name="minutes" type="number" min="15" max="1440" value="120" required/></label>
 <label>Wetter<select name="weather"><option value="any">Jedes Wetter</option><option value="sun">Sonnig</option><option value="rain">Regen</option></select></label><label>Energie<select name="energy"><option value="low">Wenig</option><option value="medium" selected>Mittel</option><option value="high">Viel</option></select></label><label>Entfernung<select name="range"><option value="home">Zuhause</option><option value="near" selected>In der Nähe</option><option value="trip">Ausflug</option></select></label><button type="submit" class="primary-btn">${ico('plus',15)} Idee speichern</button></form>
 </section>
 <div class="recovery-view"><section class="work-card"><div class="work-heading"><span>${ico('calendar',19)} Geplante Erholung · 30 Tage</span><span class="quiet-tag">${cal.length} Termine</span></div>${cal.length?cal.map(e=>`<button type="button" class="recovery-row" data-action="agenda-open" data-id="${h(e.id)}"><span>${h(eventAppearance(e).emoji)}</span><strong>${h(eventAppearance(e).displayTitle)}</strong><small>${h(calendarDate(e))}</small></button>`).join(''):`<p class="muted-line">${calendarToken?'Keine erkannten Erholungstermine in den nächsten 30 Tagen.':'Verbinde Google Calendar, um Erholungstermine anzuzeigen.'}</p>`}${calendarToken?calendarFilterToggle():calendarConnectUI()}</section>
 <section class="work-card"><div class="work-heading"><span>${ico('activity',19)} Erlebte Erholung</span><span class="quiet-tag">${acts.length} Aktivitäten</span></div>${acts.map(a=>`<button type="button" class="recovery-row" data-action="activity-open" data-id="${h(a.id)}"><span>🌿</span><strong>${h(a.title)}</strong><small>${h(a.startedAt.slice(0,10))} · ${a.durationMinutes} min</small></button>`).join('')||'<p class="muted-line">Du kannst in Aktivitäten eine Garmin-Session oder eine manuelle Aktivität als Erholung kennzeichnen.</p>'}<button type="button" class="text-link" data-tab="activity">Aktivitäten bearbeiten ${ico('arrow',14)}</button></section></div>`);
}

function activityScreen(){
 const all=projectActivities(watchSessions,state),rows=all.filter(a=>a.deleted===activityTrash);
 const chosen=rows.find(a=>a.id===activitySelectedId)||rows[0]||null;
 const projectOpts=`<option value="">Ohne Projekt</option>${Object.values(state?.projects||{}).filter(p=>p.kind!=='folder').map(p=>`<option value="${h(p.id)}" ${p.id===chosen?.projectId?'selected':''}>${h(p.title)}</option>`).join('')}`;
 const choices=ACTIVITY_CATEGORIES.map(c=>`<option value="${h(c)}" ${chosen?.category===c?'selected':''}>${h(c)}</option>`).join('');
 return chrome(`<div class="activity-layout"><section class="work-card"><div class="work-heading"><span>${ico('activity',18)} Aktivitätsverwaltung</span><div class="activity-actions"><button type="button" class="secondary-btn" data-action="activity-new">+ Manuell</button><button type="button" class="secondary-btn" data-action="watch-refresh" ${!authToken?'disabled':''}>Garmin aktualisieren</button></div></div>
 <p class="muted-line">Korrigieren, verschieben, Projekt zuordnen, wiederherstellen oder endgültig entfernen. Messwerte der Garmin bleiben bei redaktionellen Änderungen unverändert.</p><div class="activity-tabs"><button type="button" class="secondary-btn ${!activityTrash?'is-chosen':''}" data-action="activity-tab" data-id="active">Aktiv (${all.filter(a=>!a.deleted).length})</button><button type="button" class="secondary-btn ${activityTrash?'is-chosen':''}" data-action="activity-tab" data-id="trash">Papierkorb (${all.filter(a=>a.deleted).length})</button></div>
 <div class="activity-list">${rows.map(a=>`<button type="button" data-action="activity-open" data-id="${h(a.id)}" class="activity-row ${chosen?.id===a.id?'selected':''}"><strong>${h(a.title)} <small>· ${h(a.source)}</small></strong><span>${h(a.startedAt.replace('T',' · '))} · ${a.durationMinutes} min · ${h(projectLabel(a.projectId))}</span></button>`).join('')||'<p class="muted-line">Keine Aktivitäten in dieser Ansicht.</p>'}</div></section>
 <section class="work-card"><div class="work-heading"><span>${ico('pencil',18)} Session-Inspector</span></div>${chosen?`<form id="activity-edit-form" data-id="${h(chosen.id)}" class="compact-stack"><label>Titel<input name="title" required maxlength="100" value="${h(chosen.title)}"/></label><label>Art<select name="category">${choices}</select></label><label>Datum und Uhrzeit<input name="startedAt" type="datetime-local" required value="${h(chosen.startedAt)}"/></label><label>Dauer in Minuten<input name="durationMinutes" type="number" required min="1" max="1440" value="${chosen.durationMinutes}"/></label><label>Projekt<select name="projectId">${projectOpts}</select></label><label>Notiz<textarea name="note" maxlength="1000" rows="3">${h(chosen.note||'')}</textarea></label><p class="muted-line">Quelle: ${h(chosen.source)}${chosen.source==='Garmin'?' · Messwerte bleiben erhalten':''}</p><div class="activity-actions"><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="${chosen.deleted?'activity-restore':'activity-trash'}" data-id="${h(chosen.id)}">${chosen.deleted?'Wiederherstellen':'In Papierkorb'}</button>${chosen.deleted?`<button type="button" class="danger-btn" data-action="activity-purge" data-id="${h(chosen.id)}">Endgültig löschen</button>`:''}</div></form>`:'<p class="muted-line">Wähle eine Session oder lege eine manuelle Aktivität an.</p>'}
 <div class="watch-pair-block"><h3>Garmin fēnix 7S</h3><p class="muted-line">Kopplung und Geräteverwaltung bleiben getrennt von der Session-Bearbeitung.</p>${watchPairCode?`<strong class="watch-code">${h(watchPairCode)}</strong>`:''}<button type="button" class="secondary-btn" data-action="watch-pair" ${!authToken?'disabled':''}>Kopplungscode erstellen</button>${watchDevices.map(d=>`<div class="watch-session"><span>${h(d.label)}</span><button type="button" class="secondary-btn" data-action="watch-revoke" data-id="${h(d.deviceHash)}">Trennen</button></div>`).join('')}${watchError?`<p class="watch-error">${h(watchError)}</p>`:''}</div></section></div>`);
}
async function reloadWidgetDevices(){
 if(!authToken)return;
 try{const data=await request(config.apiUrl,authToken,'/api/widget/devices');widgetDevices=data.devices||[];widgetConnectError='';render();}
 catch(ex){widgetConnectError='Widget-Geräte konnten nicht geladen werden: '+ex.message;}
}
async function reloadHealth(){
 if(!authToken||!config.apiUrl)return;
 try{const [values,devices]=await Promise.all([request(config.apiUrl,authToken,'/api/health/days?days=90'),request(config.apiUrl,authToken,'/api/health/devices')]);healthDays=values.days||[];healthDevices=devices.devices||[];healthError='';healthLastUpdated=Date.now();render();}
 catch(ex){healthError=ex.status===404?'Health-Worker 0.5.1 noch nicht veröffentlicht.':ex.message;render();}
}
async function reloadWatchSessions(){
 if(!authToken)return;
 try{const [data,dev]=await Promise.all([request(config.apiUrl,authToken,'/api/watch/sessions'),request(config.apiUrl,authToken,'/api/watch/devices')]);watchSessions=data.sessions||[];watchDevices=dev.devices||[];watchError='';render();}
 catch(ex){watchError='Uhr-Daten derzeit nicht erreichbar ('+ex.message+').';render();}
}
function render(){
 if(!state){captureOverlayOpen=false;app.innerHTML=vaultScreen();bind();return;}
 app.innerHTML=tab==='activity'?activityScreen():tab==='people'?peopleScreen():tab==='progress'?progressScreen():tab==='finance'?financeScreen():tab==='insights'?insightsScreen():tab==='recovery'?recoveryScreen():tab==='system'?systemScreen():tab==='inbox'?inboxScreen():tab==='overview'?homeScreen():tab==='forecast'?forecastScreen():tab==='someday'?somedayScreen():tab==='review'?reviewScreen():tab==='projects'?projectScreen():['next','flagged','hold'].includes(tab)?workflowScreen(tab):todayScreen();bind();
 if(captureOverlayOpen)requestAnimationFrame(()=>app.querySelector('#capture-modal-input')?.focus());
 if(tab==='system'&&configured()&&!authToken)renderGoogleButton();
}
function bind() {
 if(state)wireSmartTags(app,()=>state);
  app.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{tab=el.dataset.tab;if(tab==='health'){tab='insights';insightTab='sources';}notice='';error='';render();if((tab==='activity'||tab==='overview'||tab==='progress'||tab==='recovery')&&authToken)reloadWatchSessions().catch(()=>{});if((tab==='progress'||tab==='recovery'||tab==='insights')&&authToken){reloadHealth().catch(()=>{});reloadWidgetDevices().catch(()=>{});}});
  const vaultForm=app.querySelector('#vault-form');if(vaultForm)vaultForm.onsubmit=async ev=>{
    ev.preventDefault();const form=new FormData(vaultForm),p=String(form.get('passphrase')||'');
    try {if(hasVault){state=await vault.unlock(p);}else {if(p!==form.get('repeat'))throw new Error('Die Passphrasen stimmen nicht überein.');state=await vault.create(p);hasVault=true;}
      prepareTasks(state);eventState(state);prunePastEvents(state,localDate());await persist();
      if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}toast('Lokaler Tresor bereit.');
      resumeSession().catch(()=>{});}catch(ex){toast(ex.message,true);}
  };

  // All Review actions operate inside the assistant; no navigation to other tabs.
  const reviewCapture=app.querySelector('#review-capture');if(reviewCapture)reviewCapture.onsubmit=async ev=>{ev.preventDefault();const title=String(new FormData(reviewCapture).get('title')||'').trim();if(!title)return;await addCapture(title,'');toast('In die Inbox aufgenommen.');};
  const reviewQuick=app.querySelector('#review-quick-action');if(reviewQuick)reviewQuick.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(reviewQuick),title=String(fd.get('title')||'').trim(),projectId=fd.get('projectId')||null,workflow=fd.get('workflow')||'next';
    const t={id:crypto.randomUUID(),title,note:'',category:'Allgemein',workflow,completed:false,archived:false,flagged:false,plannedDate:null,dueDate:null,deferUntil:null,estimateMinutes:null,projectId,parentTaskId:null,sortOrder:0,tags:parseTags(fd.get('tags')),contextTags:[],updatedAt:stamp()};
    if(!validLocalTask(t)||projectId&&!state.projects?.[projectId]){toast('Aktion prüfen.',true);return;}
    await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;for(const tag of t.tags)rememberTag(s,tag);});toast('Aktion gespeichert – Review bleibt geöffnet.');
  };
  const reviewInline=app.querySelector('#review-inline-task');if(reviewInline)reviewInline.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(reviewInline),id=reviewInline.dataset.id,original=state?.tasks?.[id];if(!original)return;
    const projectId=fd.get('projectId')||null;
    const t={...original,title:String(fd.get('title')||'').trim(),note:String(fd.get('note')||'').trim(),workflow:fd.get('workflow')||'next',projectId,parentTaskId:projectId===original.projectId?original.parentTaskId:null,plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,deferUntil:fd.get('deferUntil')||null,tags:parseTags(fd.get('tags')),updatedAt:stamp()};
    if(!validLocalTask(t)||!validTaskParent(state,id,t.projectId,t.parentTaskId)||projectId&&!state.projects?.[projectId]){toast('Aufgabenfelder oder Hierarchie prüfen.',true);return;}
    if(projectId!==original.projectId&&Object.values(state.tasks).some(child=>!child.archived&&child.parentTaskId===id)){toast('Unteraufgaben zuerst umziehen, bevor du das Projekt änderst.',true);return;}
    await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;for(const tag of t.tags)rememberTag(s,tag);});reviewEditingTaskId=null;toast('Aufgabe im Review aktualisiert.');
  };
  const reviewCommit=app.querySelector('#review-commit-form');if(reviewCommit){reviewCommit.oninput=captureReviewDraft;reviewCommit.onchange=captureReviewDraft;reviewCommit.onsubmit=async ev=>{
    ev.preventDefault();const id=reviewCommit.dataset.id,r=state?.records?.[id];if(!r||r.deleted)return;
    const d=new FormData(reviewCommit),workflow=reviewWorkflow;
    if(workflow==='dreams'){
      await mutate(s=>{const record=s.records[id];record.tags=parseTags(['dreams','dream-ideen',...(record.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-'))]);record.updatedAt=stamp();s.pending.push(makeMutation(record));});
      selectedInboxId=null;selectedDreamId=id;reviewWorkflow='next';reviewDrafts.delete(id);toast('In Dreams übernommen.');return;
    }
    if(r.title.length>180){toast('Bitte den Inbox-Titel vor der Übernahme auf maximal 180 Zeichen kürzen.',true);return;}
    const meta=state.reviewMeta?.[id]||{};
    const contextTags=parseTags([...(meta.energy?['energy-'+meta.energy]:[]),...(meta.attention?['attention-'+meta.attention]:[])]);
    const task={id:crypto.randomUUID(),title:r.title,note:(r.note||'').slice(0,3000),plannedDate:d.get('plannedDate')||null,dueDate:d.get('dueDate')||null,deferUntil:d.get('deferUntil')||null,estimateMinutes:d.get('estimateMinutes')?Number(d.get('estimateMinutes')):null,category:d.get('category')||'Allgemein',workflow,flagged:false,completed:false,archived:false,projectId:d.get('projectId')||null,parentTaskId:null,sortOrder:0,tags:parseTags(r.tags||[]),contextTags,updatedAt:stamp()};
    if(!validLocalTask(task)||task.projectId&&!state.projects?.[task.projectId]){toast('Prüfe das Projekt und die Datumsfelder.',true);return;}
    await mutate(s=>{s.tasks[task.id]=task;s.taskPending[task.id]=true;s.records[id].deleted=true;s.records[id].updatedAt=stamp();s.pending.push(makeMutation(s.records[id]));delete s.reviewMeta?.[id];});
    selectedInboxId=null;selectedTaskId=task.id;reviewWorkflow='next';reviewDrafts.delete(id);toast('Inbox-Eintrag geklärt und als Aufgabe gespeichert.');
  };}
  const overlayForm=app.querySelector('#calendar-overlay-form');if(overlayForm)overlayForm.onsubmit=async ev=>{
    ev.preventDefault();const id=overlayForm.dataset.id;const d=new FormData(overlayForm);
    const next={title:String(d.get('title')||'').trim(),category:String(d.get('category')||''),emoji:String(d.get('emoji')||'').trim(),hidden:d.has('hidden')};
    if(!validCalendarOverride(next)){toast('Overlay-Felder prüfen.',true);return;}
    await mutate(s=>{s.calendarOverrides??={};s.calendarOverrides[id]=next;});toast('Compass-Overlay gespeichert. Der Google-Termin bleibt unverändert.');
  };
  app.querySelectorAll('.calendar-rule-form').forEach(form=>form.onsubmit=async ev=>{
    ev.preventDefault();const id=form.dataset.id;const fd=new FormData(form);
    const rule={id,label:String(fd.get('label')||'').trim(),emoji:String(fd.get('emoji')||'').trim(),category:String(fd.get('category')||'Neutral'),terms:String(fd.get('terms')||'').trim(),exclude:String(fd.get('exclude')||'').trim(),enabled:fd.has('enabled')};
    if(!validCalendarRule(rule)){toast('Bitte die Regel-Felder prüfen.',true);return;}
    await mutate(s=>{s.calendarRules=effectiveCalendarRules(s).map(r=>r.id===id?rule:r);});toast('Kalenderregel gespeichert.');
  });
  const activityForm=app.querySelector('#activity-edit-form');if(activityForm)activityForm.onsubmit=async ev=>{
    ev.preventDefault();const id=activityForm.dataset.id;const d=new FormData(activityForm);
    const data={title:String(d.get('title')||'').trim(),category:String(d.get('category')||''),startedAt:String(d.get('startedAt')||''),durationMinutes:Number(d.get('durationMinutes')),note:String(d.get('note')||''),projectId:String(d.get('projectId')||'')};
    if(!validActivityEdit(data)||data.projectId&&!state?.projects?.[data.projectId]){toast('Prüfe Titel, Zeitpunkt, Dauer und Projekt.',true);return;}
    await mutate(s=>{if(id.startsWith('manual-')){s.manualActivities[id]={...s.manualActivities[id],...data};}else{s.activityEdits??={};s.activityEdits[id]={...(s.activityEdits[id]||{}),...data};}});toast('Änderungen im verschlüsselten Tresor gespeichert.');
  };
  const personForm=app.querySelector('#person-create-form');if(personForm)personForm.onsubmit=async ev=>{ev.preventDefault();const name=String(new FormData(personForm).get('name')||'').trim(),tag=personTag(name);if(!name||!tag){toast('Bitte einen gültigen Namen eingeben.',true);return;}if(Object.values(state.people||{}).some(p=>p.tag===tag)){toast('Kontakt bereits vorhanden.',true);return;}const id=crypto.randomUUID();await mutate(s=>{s.people??={};s.people[id]={id,name,tag,note:''};});selectedPersonId=id;render();};
  const personTagForm=app.querySelector('#person-tag-form');if(personTagForm)personTagForm.onsubmit=async ev=>{
    ev.preventDefault();const id=personTagForm.dataset.id,p=state?.people?.[id];if(!p)return;
    const data=new FormData(personTagForm),tag=parseTags([String(data.get('tag')||'').replace(/^#/, '')])[0],aliases=String(data.get('aliases')||'').trim();
    if(!tag||tag.length>50||aliases.length>200){toast('Bitte gültiges Personen-Tag verwenden.',true);return;}
    if(Object.values(state.people).some(x=>x.id!==id&&x.tag===tag)){toast('Tag wird bereits von einer anderen Person verwendet.',true);return;}
    await mutate(s=>{s.people[id].tag=tag;s.people[id].aliases=aliases;rememberTag(s,tag);});toast('Zuordnung gespeichert. Bestehende Aufgaben-Tags werden nicht verändert.');
  };
  const personBirthday=app.querySelector('#person-birthday-form');if(personBirthday)personBirthday.onsubmit=async ev=>{
    ev.preventDefault();const id=personBirthday.dataset.id;if(!state?.people?.[id])return;
    const fd=new FormData(personBirthday),day=Number(fd.get('day')||0),month=Number(fd.get('month')||0);
    const md=day&&month?`${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`:'';
    const raw=String(fd.get('year')||'').trim(),year=raw===''?null:Number(raw);
    if((day&&!month)||(month&&!day)||!validPersonBirthday(md,year)){toast('Bitte ein gültiges Datum und optional ein Geburtsjahr angeben.',true);return;}
    await mutate(s=>{s.people[id].birthdayMonthDay=md;s.people[id].birthdayYear=year;});toast('Geburtstag im lokalen Tresor gespeichert.');
  };
  const personNote=app.querySelector('#person-note-form');if(personNote)personNote.onsubmit=async ev=>{ev.preventDefault();const id=personNote.dataset.id, note=String(new FormData(personNote).get('note')||'');if(!state?.people?.[id])return;await mutate(s=>{s.people[id].note=note;});toast('Persönliche Notiz gespeichert.');};
  const personAgenda=app.querySelector('#person-agenda-form');if(personAgenda)personAgenda.onsubmit=async ev=>{ev.preventDefault();const person=state?.people?.[personAgenda.dataset.id];if(!person)return;const title=String(new FormData(personAgenda).get('title')||'').trim();if(!title||title.length>180){toast('Bitte einen kurzen Agendapunkt eingeben.',true);return;}const t={id:crypto.randomUUID(),title,note:'Gesprächsthema mit '+person.name,category:'Allgemein',workflow:'next',completed:false,archived:false,flagged:false,plannedDate:null,dueDate:null,deferUntil:null,estimateMinutes:null,projectId:null,parentTaskId:null,sortOrder:0,tags:parseTags([person.tag]),contextTags:[],updatedAt:stamp()};await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;rememberTag(s,person.tag);});toast('Agenda-Schritt als Next Action angelegt.');};
  const importField=app.querySelector('#encrypted-import');if(importField)importField.onchange=async ev=>{
    try {const obj=JSON.parse(await ev.target.files[0].text());await vault.importEncrypted(obj);hasVault=true;toast('Backup importiert. Jetzt mit der ursprünglichen Passphrase entsperren.');}
    catch(ex){toast(ex.message,true);}
  };
  app.querySelectorAll('#capture-form, #capture-modal-form').forEach(form=>form.onsubmit=async ev=>{
    ev.preventDefault();
    const submit=form.querySelector('[type=submit]');if(submit)submit.disabled=true;
    try {const data=new FormData(form);await addCapture(data.get('title'),data.get('note'));captureOverlayOpen=false;
      notice='Sicher in deiner Inbox gespeichert'+(authToken?' · Cloud-Abgleich vorgemerkt':' · nur auf diesem Gerät')+'.';error='';render();
    }catch(ex){if(submit)submit.disabled=false;toast(ex.message,true);}
  });
  const taskForm=app.querySelector('#task-create-form');if(taskForm)taskForm.onsubmit=async ev=>{
    ev.preventDefault();const fd=new FormData(taskForm);
    const t={id:crypto.randomUUID(),title:String(fd.get('title')||'').trim(),note:'',plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',completed:false,archived:false,workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,parentTaskId:fd.get('parentTaskId')||null,sortOrder:0,tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,updatedAt:stamp()};
    if(!validLocalTask(t)||!validTaskParent(state,t.id,t.projectId,t.parentTaskId)){toast('Aufgabenfelder bzw. Hierarchie prüfen.',true);return;}
    t.sortOrder=Math.min(1000000,100+Math.max(0,...taskChildren(state,t.projectId,t.parentTaskId).map(x=>x.sortOrder||0)));
    await mutate(s=>{prepareTasks(s);s.tasks[t.id]=t;s.taskPending[t.id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);});selectedTaskId=t.id;toast('Aufgabe lokal gespeichert.');
  };
  const taskEditForm=app.querySelector('#task-edit-form');if(taskEditForm)taskEditForm.onsubmit=async ev=>{
    ev.preventDefault();const id=taskEditForm.dataset.id,fd=new FormData(taskEditForm);const existing=state.tasks[id];if(!existing)return;
    const t={...existing,title:String(fd.get('title')||'').trim(),note:String(fd.get('note')||'').trim(),plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,parentTaskId:(fd.get('projectId')===existing.projectId?fd.get('parentTaskId')||null:null),tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,updatedAt:stamp()};
    if(!validLocalTask(t)||!validTaskParent(state,id,t.projectId,t.parentTaskId)){toast('Aufgabenfelder bzw. Hierarchie prüfen.',true);return;}
    if(t.projectId!==existing.projectId&&Object.values(state.tasks).some(child=>!child.archived&&child.parentTaskId===id)){toast('Unteraufgaben zuerst einzeln verschieben, bevor du das Projekt dieser Aufgabe wechselst.',true);return;}
    await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;for(const tag of [...t.tags,...t.contextTags])rememberTag(s,tag);});toast('Aufgabe aktualisiert.');
  };
  const projectCreate=app.querySelector('#project-create-form');if(projectCreate)projectCreate.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(projectCreate);const project={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:'active',dueDate:null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7),reviewedAt:null,kind:d.get('kind')||'project',projectType:d.get('projectType')||'parallel',parentId:d.get('parentId')||null,sortOrder:0};
    if(!validProject(project)||!validProjectParent(state,project.id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}
    project.sortOrder=Math.min(1000000,100+Math.max(0,...childProjects(state,project.parentId).map(x=>x.sortOrder||0)));
    await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;});selectedProjectId=project.id;render();
  };
  const projectEdit=app.querySelector('#project-edit-form');if(projectEdit)projectEdit.onsubmit=async ev=>{
    ev.preventDefault();const id=projectEdit.dataset.id;const d=new FormData(projectEdit);const project={...state.projects[id],title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:d.get('status')||'active',dueDate:d.get('dueDate')||null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7),kind:d.get('kind')||'project',projectType:d.get('projectType')||'parallel',parentId:d.get('parentId')||null};
    if(!validProject(project)||!validProjectParent(state,id,project.parentId)){toast('Projektangaben bzw. Ordnerhierarchie prüfen.',true);return;}
    if(project.kind==='folder'&&state.projects[id].kind!=='folder'&&projectTasks(state,id).length){toast('Ein Projekt mit Aufgaben kann nicht in einen Ordner umgewandelt werden.',true);return;}
    await mutate(s=>{s.projects[id]=project;s.projectPending[id]=true;});toast('Projekt gespeichert.');
  };
  const agendaForm=app.querySelector('#agenda-note-form');if(agendaForm)agendaForm.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(agendaForm);const t={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),note:'',category:'Meeting',plannedDate:null,dueDate:null,workflow:'next',flagged:false,projectId:null,tags:parseTags([d.get('tag')]),completed:false,archived:false};
    if(!validLocalTask(t)){toast('Agendapunkt prüfen.',true);return;}
    await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;});toast('Agendapunkt für das Meeting angelegt.');
  };
  const dreamCreate=app.querySelector('#dream-create-form');if(dreamCreate)dreamCreate.onsubmit=async ev=>{
    ev.preventDefault();const data=new FormData(dreamCreate),title=String(data.get('title')||'').trim(),category=String(data.get('category')||'ideen');
    if(!title||title.length>1000||!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Dreams-Eingabe prüfen.',true);return;}
    const id=crypto.randomUUID();await mutate(s=>{const r={id,title,note:'',tags:['dreams','dream-'+category],deleted:false,updatedAt:stamp()};s.records[id]=r;s.pending.push(makeMutation(r));s.history.push({type:'dream-captured',at:stamp(),id});});selectedDreamId=id;toast('Idee in Dreams gespeichert.');
  };
  const dreamEdit=app.querySelector('#dream-edit-form');if(dreamEdit)dreamEdit.onsubmit=async ev=>{
    ev.preventDefault();const id=dreamEdit.dataset.id,fd=new FormData(dreamEdit);const title=String(fd.get('title')||'').trim(),note=String(fd.get('note')||'').trim(),category=String(fd.get('category')||'ideen');
    if(!title||title.length>1000||note.length>10000||!DREAM_CATEGORIES.some(([key])=>key===category)){toast('Dreams-Felder prüfen.',true);return;}
    await mutate(s=>{const r=s.records[id];if(!r||r.deleted)return;r.title=title;r.note=note;r.tags=parseTags(['dreams','dream-'+category,...(r.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-'))]);r.updatedAt=stamp();s.pending.push(makeMutation(r));});toast('Dream aktualisiert.');
  };
  const editForm=app.querySelector('#inbox-edit-form');if(editForm)editForm.onsubmit=async ev=>{
    ev.preventDefault();const id=editForm.dataset.id;const form=new FormData(editForm);
    const title=String(form.get('title')||'').trim(),note=String(form.get('note')||'').trim(),tags=parseTags(form.get('tags'));
    if(!title||title.length>1000||note.length>10000){toast('Bitte Titel und Notizlänge prüfen.',true);return;}
    const existing=state.records[id];if(!existing)return;
    if(existing.title===title&&(existing.note||'')===note&&JSON.stringify(existing.tags||[])===JSON.stringify(tags)){notice='Keine Änderungen.';render();return;}
    try{await mutate(s=>{const r=s.records[id];r.title=title;r.note=note;r.tags=tags;r.updatedAt=stamp();s.pending.push(makeMutation(r));});notice='Änderungen lokal gespeichert.';render();}
    catch(ex){toast(ex.message,true);}
  };
  const cfilter=app.querySelector('#context-filter');if(cfilter)cfilter.onchange=ev=>{contextFilter=ev.target.value;render();};
  const search=app.querySelector('#inbox-query');if(search)search.oninput=ev=>{
    const v=ev.target.value;const caret=ev.target.selectionStart??v.length;inboxQuery=v;render();
    const field=app.querySelector('#inbox-query');if(field){field.focus();try{field.setSelectionRange(caret,caret);}catch{}}
  };
  app.querySelectorAll('[data-recovery-filter]').forEach(el=>el.onchange=()=>{
    if(el.dataset.recoveryFilter==='minutes')recoveryIdeaMinutes=Number(el.value);
    if(el.dataset.recoveryFilter==='energy')recoveryIdeaEnergy=el.value;
    if(el.dataset.recoveryFilter==='range')recoveryIdeaRange=el.value;
    render();
  });
  const discoveryForm=app.querySelector('#discovery-import-form');if(discoveryForm)discoveryForm.onsubmit=async ev=>{ev.preventDefault();try{
    const raw=String(new FormData(discoveryForm).get('events')||'');const result=parseEventImport(raw,state?.discoveredEvents||[]);
    discoveryImportPreview=result;render();
   }catch(ex){toast('Import: '+ex.message,true);}};
  for(const key of ['health-day-details','health-device-details']){const el=app.querySelector('#'+key);if(el)el.ontoggle=()=>{if(key==='health-day-details')healthDetailsOpen=el.open;else healthDevicesOpen=el.open;};}
  app.querySelectorAll('[data-discovery-filter]').forEach(el=>el.onchange=()=>{if(el.dataset.discoveryFilter==='city')discoveryCity=el.value;else if(el.dataset.discoveryFilter==='area')discoveryArea=el.value;else discoveryCategory=el.value;render();});
  app.querySelectorAll('.discovery-art img').forEach(img=>{img.onerror=()=>img.remove();});
  const recoveryForm=app.querySelector('#recovery-idea-form');if(recoveryForm)recoveryForm.onsubmit=async ev=>{
    ev.preventDefault();const data=new FormData(recoveryForm);
    const i={id:'idea-'+crypto.randomUUID(),title:String(data.get('title')||'').trim(),emoji:String(data.get('emoji')||'🌿').trim()||'🌿',minutes:Number(data.get('minutes')),weather:String(data.get('weather')||'any'),energy:String(data.get('energy')||'medium'),range:String(data.get('range')||'near')};
    if(!validRecoveryIdea(i)){toast('Bitte Idee, Symbol, Dauer und Kategorien prüfen.',true);return;}
    await mutate(s=>{s.recoveryIdeas??=[];s.recoveryIdeas.push(i);});toast('Freizeitidee im lokalen Tresor gespeichert.');
  };
  const healthUpload=app.querySelector('#health-import-input');
  if(healthUpload)healthUpload.onchange=async()=>{
    if(!healthUpload.files?.length||healthFileReading)return;
    healthFileReading=true;healthFilePreview=null;
    try{const preview=await inspectHealthFiles([...healthUpload.files]);
      if(!preview.processed)throw Error(preview.errors.join('\n')||'Keine unterstützten Dateien.');
      healthFilePreview=preview;toast(`Importvorschau: ${preview.fitdays.length} Fitdays, ${preview.garminNights.length} Nächte, ${(preview.garminWellness||[]).length} Stress-/Energiewerte.`);
    }catch(ex){toast('Import konnte nicht gelesen werden: '+ex.message,true);}
    finally{healthFileReading=false;}
  };
  const selectedNight=app.querySelector('#health-night-select');if(selectedNight)selectedNight.onchange=()=>{selectedGarminNight=selectedNight.value;render();};
  const insightSelect=app.querySelector('#insights-night-select');if(insightSelect)insightSelect.onchange=()=>{insightNight=insightSelect.value;render();};
  const wellnessSelect=app.querySelector('#insights-wellness-select');if(wellnessSelect)wellnessSelect.onchange=()=>{insightWellnessDay=wellnessSelect.value;render();};
  app.querySelectorAll('[data-action]').forEach(el=>el.onclick=ev=>{
    if(el.dataset.action==='capture-close-backdrop'&&ev.target!==el)return;
    if(el.dataset.action==='date-adjust'||el.dataset.action==='date-clear'){
      const field=el.closest('form')?.querySelector(`[name="${el.dataset.field}"]`);
      if(!field)return;
      if(el.dataset.action==='date-clear')field.value='';
      else {const from=field.value||localDate();const dt=new Date(from+'T12:00:00');if(el.dataset.offset==='day')dt.setDate(dt.getDate()+1);else if(el.dataset.offset==='week')dt.setDate(dt.getDate()+7);else if(el.dataset.offset==='month'){const day=dt.getDate();dt.setDate(1);dt.setMonth(dt.getMonth()+1);dt.setDate(Math.min(day,new Date(dt.getFullYear(),dt.getMonth()+1,0).getDate()));}field.value=localDate(dt);}
      field.focus();return;
    }
    runAction(el.dataset.action,el.dataset.id,el.dataset.step);
  });
}
async function runAction(action,id,stepId=null) {
  lastActivity=Date.now();
  try {
    if(action==='assistant-new'){
      if(!confirm('Neuen Wochenreview starten? Der bisherige Durchgang wird als Fortschrittsstand ersetzt; die geprüften Projekte behalten ihre Reviewdaten.'))return;
      reviewEditingTaskId=null;reviewProjectId=null;await mutate(s=>{s.weeklyReview=newReview();s.reviewPending=true;});return;
    }
    if(action==='assistant-step'||action==='assistant-back'||action==='assistant-next'){
      captureReviewDraft();const index=action==='assistant-step'?Number(id):action==='assistant-back'?Math.max(0,state.weeklyReview.step-1):Math.min(REVIEW_STEPS.length-1,state.weeklyReview.step+1);
      if(!Number.isInteger(index)||index<0||index>=REVIEW_STEPS.length)return;
      reviewEditingTaskId=null;await mutate(s=>{s.weeklyReview=nextReviewStep(s.weeklyReview,index);s.reviewPending=true;});return;
    }
    if(action==='assistant-complete-step'){
      const current=REVIEW_STEPS[state.weeklyReview.step];if(!current)return;
      const queue=reviewQueue(state,calendarEvents,localDate());
      if(current.id==='inbox'&&queue.inbox.length&&!confirm(`${queue.inbox.length} Inbox-Einträge sind noch offen. Diesen Bereich trotzdem als durchgesehen markieren?`))return;
      if(current.id==='projects'&&queue.due.some(p=>!state.weeklyReview.inspectedProjects.includes(p.id))&&!confirm('Nicht alle fälligen Projekte wurden geprüft. Trotzdem fortfahren?'))return;
      const notes=String(app.querySelector('#review-end-notes')?.value||'').slice(0,1200);
      await mutate(s=>{s.weeklyReview=reviewedStep(s.weeklyReview,current.id);if(current.id==='finish'){s.weeklyReview.completedAt=stamp();s.weeklyReview.notes=notes;}s.reviewPending=true;});return;
    }
    if(action==='assistant-project-select'){if(!state.projects?.[id])return;reviewProjectId=id;reviewEditingTaskId=null;render();return;}
    if(action==='assistant-project-reviewed'){
      if(!state.projects?.[id])return;
      await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;s.weeklyReview.inspectedProjects=[...new Set([...s.weeklyReview.inspectedProjects,id])];s.weeklyReview.updatedAt=stamp();s.reviewPending=true;});reviewProjectId=null;toast('Projekt geprüft. Nächstes Projekt direkt hier.');return;
    }
    if(action==='assistant-task-edit'){if(!state.tasks?.[id])return;reviewEditingTaskId=id;render();return;}
    if(action==='assistant-task-cancel'){reviewEditingTaskId=null;render();return;}
    if(action==='assistant-task-done'){
      if(!state.tasks?.[id])return;await mutate(s=>{s.tasks[id].completed=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});reviewEditingTaskId=null;return;
    }
    if(action==='assistant-inbox-remove'){
      if(!state.records?.[id]||!confirm('Inbox-Eintrag archivieren?'))return;
      await mutate(s=>{s.records[id].deleted=true;s.records[id].updatedAt=stamp();s.pending.push(makeMutation(s.records[id]));});return;
    }
    if(action==='assistant-dream-activate'){
      if(!state.records?.[id])return;await mutate(s=>{const r=s.records[id];r.tags=parseTags((r.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-')));r.updatedAt=stamp();s.pending.push(makeMutation(r));});toast('Idee für die Inbox aktiviert.');return;
    }
    if(action==='assistant-resolve-remote'||action==='assistant-resolve-local'){
      const c=state.reviewConflict;if(!c)return;
      await mutate(s=>{if(action.endsWith('remote')){s.weeklyReview=c.progress;s.reviewVersion=c.version;s.reviewPending=false;}else{s.reviewVersion=c.version;s.reviewPending=true;}s.reviewConflict=null;});return;
    }
    if(action==='health-range'){healthSpan=id==='30'?30:7;render();return;}
    if(action==='discovery-week-prev'){discoveryWeekOffset=Math.max(0,discoveryWeekOffset-1);render();return;}
    if(action==='discovery-week-next'){discoveryWeekOffset=Math.min(80,discoveryWeekOffset+1);render();return;}
    if(action==='discovery-week-today'){discoveryWeekOffset=0;render();return;}
    if(action==='discovery-import-cancel'){discoveryImportPreview=null;render();return;}
    if(action==='discovery-import-confirm'){if(!discoveryImportPreview)return;const preview=discoveryImportPreview;await mutate(st=>{for(const e of preview.added)queueEvent(st,e);});discoveryImportPreview=null;discoveryImportOpen=false;toast(`${preview.added.length} Veranstaltungen übernommen – Cloud-Sync läuft im Hintergrund.`);return;}
    if(action==='discovery-conflict-cloud'||action==='discovery-conflict-local'){await mutate(st=>resolveEventConflict(st,id,action.endsWith('cloud')?'cloud':'local'));return;}
    if(action==='discovery-range'){if(['today','week','weekend','all','saved','hidden'].includes(id))discoveryRange=id;render();return;}
    if(action==='discovery-import-toggle'){discoveryImportOpen=!discoveryImportOpen;discoveryImportPreview=null;render();return;}
    if(action==='discovery-more'){if(discoveryExpandedDays.has(id))discoveryExpandedDays.delete(id);else discoveryExpandedDays.add(id);render();return;}
    if(action==='discovery-save'||action==='discovery-hide'){const entry=state?.discoveredEvents?.find(e=>eventKey(e)===id);if(!entry)return;await mutate(st=>{st.eventPreferences??={};const prev=st.eventPreferences[id]||'open';const next=action==='discovery-save'?(prev==='saved'?'open':'saved'):(prev==='hidden'?'open':'hidden');queueEventPreference(st,id,next);});return;}
    if(action==='nav-more'){await mutate(s=>{s.uiPreferences??={};s.uiPreferences.advancedNav=!(s.uiPreferences.advancedNav===true);});return;}
    if(action==='recovery-idea-remove'){if(!String(id).startsWith('idea-'))return;await mutate(s=>{s.recoveryIdeas=(s.recoveryIdeas||[]).filter(i=>i.id!==id);});return;}
    if(action==='recovery-idea-hide'){if(!String(id).startsWith('starter-'))return;await mutate(s=>{s.hiddenStarterIdeas=[...new Set([...(s.hiddenStarterIdeas||[]),id])];});return;}
    if(action==='recovery-ideas-reset'){await mutate(s=>{s.hiddenStarterIdeas=[];});return;}
    if(action==='recovery-idea-capture'){
      const idea=allRecoveryIdeas(state).find(i=>i.id===id);if(!idea)return;
      await addCapture(idea.title,'Freizeitidee aus Erholung. Zeitpunkt erst bei konkreter Planung festlegen.');
      tab='inbox';toast('Idee in die Inbox übernommen. Noch nicht terminiert.');return;
    }
    if(action.startsWith('review-clarify:')){
      if(!state?.records?.[id]||state.records[id].deleted)return;
      const choice=action.split(':')[1];if(!['next','waiting','hold','dreams'].includes(choice))return;
      captureReviewDraft();reviewWorkflow=choice;render();return;
    }
    if(action==='review-select'){if(!state?.records?.[id]||state.records[id].deleted)return;captureReviewDraft();selectedInboxId=id;reviewWorkflow='next';render();return;}
    if(action==='review-project-open'){if(!state?.projects?.[id])return;reviewProjectId=id;render();return;}
    if(action.startsWith('review-energy:') || action.startsWith('review-attention:')){
       const [key,val]=action.split(':');
       if(!state?.records?.[id] || state.records[id].deleted)return;
       const options=key==='review-energy'?['low','medium','high']:['routine','clarity','deep'];
       if(!options.includes(val))return;
       captureReviewDraft();await mutate(s=>{
         s.reviewMeta=s.reviewMeta||{};
         const old=s.reviewMeta[id]||{};
         s.reviewMeta[id]={...old,[key==='review-energy'?'energy':'attention']:val};
       });
       return;
    }
    if(action==='dream-select'){if(!state?.records?.[id])return;selectedDreamId=id;render();return;}
    if(action==='dream-to-inbox'){
      if(!state?.records?.[id])return;
      await mutate(s=>{const r=s.records[id];r.tags=(r.tags||[]).filter(t=>t!=='dreams'&&!t.startsWith('dream-'));r.updatedAt=stamp();s.pending.push(makeMutation(r));});selectedDreamId=null;selectedInboxId=id;tab='inbox';toast('Idee liegt wieder in der Inbox.');return;
    }
    if(action==='dream-to-next'){
      const r=state?.records?.[id];if(!r||r.deleted||!r.tags?.includes('dreams'))return;
      if(r.title.length>180){toast('Bitte Titel vor der Aktivierung auf höchstens 180 Zeichen kürzen.',true);return;}
      const t={id:crypto.randomUUID(),title:r.title,note:(r.note||'').slice(0,3000),plannedDate:null,dueDate:null,category:'Allgemein',completed:false,archived:false,workflow:'next',flagged:false,projectId:null,tags:parseTags((r.tags||[]).filter(x=>x!=='dreams'&&!x.startsWith('dream-'))),contextTags:[],deferUntil:null,estimateMinutes:null,updatedAt:stamp()};
      if(!validLocalTask(t)){toast('Eintrag konnte nicht aktiviert werden.',true);return;}
      await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;const dream=s.records[id];dream.deleted=true;dream.updatedAt=stamp();s.pending.push(makeMutation(dream));});selectedDreamId=null;selectedTaskId=t.id;tab='next';toast('Dream als Next Action aktiviert.');return;
    }
    if(action==='task-view'){const t=state?.tasks?.[id];if(!t)return;selectedTaskId=id;selectedDay=t.dueDate||t.plannedDate||localDate();tab='today';render();return;}
    if(action==='timeline-horizon'){const n=Number(id);if([14,30,90].includes(n)){overviewHorizon=n;overviewWeek=0;selectedTimelineDay='';render();}return;}
    if(action==='timeline-week-next'||action==='timeline-week-prev'){overviewWeek=Math.max(0,Math.min(Math.ceil(overviewHorizon/7)-1,overviewWeek+(action==='timeline-week-next'?1:-1)));selectedTimelineDay='';render();return;}
    if(action==='timeline-day'){const today=localDate(),first=shiftDay(today,overviewWeek*7),last=shiftDay(first,Math.min(7,overviewHorizon-overviewWeek*7)-1);if(id>=first&&id<=last){selectedTimelineDay=id;render();}return;}
    if(action==='timeline-project'){if(state?.projects?.[id]){selectedProjectId=id;tab='projects';render();}return;}
    if(action==='person-select'){selectedPersonId=id;render();return;}
    if(action==='person-birthday-clear'){if(!state?.people?.[id])return;await mutate(s=>{s.people[id].birthdayMonthDay='';s.people[id].birthdayYear=null;});toast('Geburtstag aus dem Kontakt entfernt.');return;}
    if(action==='person-remove'){if(!state?.people?.[id]||!confirm('Kontakt und lokale Notiz entfernen? Bereits angelegte Aufgaben bleiben erhalten.'))return;await mutate(s=>{delete s.people[id];});selectedPersonId=null;return;}
    if(action==='person-task-open'){if(state?.tasks?.[id]){selectedTaskId=id;tab='next';render();}return;}
    if(action==='activity-new'){
      const title=prompt('Neue Aktivität: Titel');if(title===null)return;if(!title.trim()||title.trim().length>100){toast('Titel muss zwischen 1 und 100 Zeichen haben.',true);return;}
      const id='manual-'+crypto.randomUUID(),item={id,title:title.trim(),category:'Freizeit',startedAt:isoLocal(Date.now()/1000),durationMinutes:30,note:'',projectId:'',deleted:false};
      await mutate(s=>{s.manualActivities??={};s.manualActivities[id]=item;});activitySelectedId=id;activityTrash=false;render();return;
    }
    if(action==='activity-tab'){activityTrash=id==='trash';activitySelectedId=null;render();return;}
    if(action==='activity-open'){activitySelectedId=id;tab='activity';render();return;}
    if(action==='activity-trash'||action==='activity-restore'){
      const entry=projectActivities(watchSessions,state).find(x=>x.id===id);if(!entry)return;
      await mutate(s=>{if(id.startsWith('manual-')){if(!s.manualActivities?.[id])return;s.manualActivities[id].deleted=action==='activity-trash';}else{s.activityEdits??={};s.activityEdits[id]={...(s.activityEdits[id]||{}),deleted:action==='activity-trash'};}});activitySelectedId=null;return;
    }
    if(action==='activity-purge'){
      const entry=projectActivities(watchSessions,state).find(x=>x.id===id);if(!entry||!entry.deleted)return;
      if(!confirm('Diese Session endgültig und unwiderruflich löschen? Garmin-Messwerte werden dabei ebenfalls serverseitig gelöscht.'))return;
      if(entry.source==='Garmin'){
        if(!authToken){toast('Zum endgültigen Löschen einer Garmin-Session zuerst mit Compass verbinden. Bis dahin im Papierkorb belassen.',true);return;}
        try{await request(config.apiUrl,authToken,'/api/watch/sessions/purge',{method:'POST',body:JSON.stringify({sessionId:id})});}
        catch(ex){toast('Serverseitiges Löschen fehlgeschlagen. Session bleibt im Papierkorb: '+ex.message,true);return;}
        await mutate(s=>{s.activityEdits??={};s.activityEdits[id]={purged:true};});watchSessions=watchSessions.filter(x=>x.id!==id);
      }else{await mutate(s=>{delete s.manualActivities[id];});}
      activitySelectedId=null;toast('Session endgültig entfernt.');return;
    }
    if(action==='occasion-toggle'){occasionOpen=!occasionOpen;render();return;}
    if(['occasion-accept','occasion-dismiss','occasion-reset','occasion-custom'].includes(action)){
      const occasion=allOccasions().find(o=>o.id===id);if(!occasion)return;
      if(action==='occasion-custom'){
        const title=prompt(`Zusätzliche Vorbereitung für ${occasion.title}:`);if(title===null)return;
        if(!title.trim()||title.trim().length>100){toast('Bitte 1–100 Zeichen eingeben.',true);return;}
        const step={id:'custom-'+crypto.randomUUID(),label:title.trim(),daysBefore:Math.max(0,Math.min(70,daysUntil(localDate(),occasion.date))),deadlineBefore:0,minutes:15};
        await mutate(s=>{s.customOccasionSteps??={};s.customOccasionSteps[occasion.id]??=[];s.customOccasionSteps[occasion.id].push(step);});return;
      }
      const step=[...OCCASION_STEPS[occasion.kind],...(state?.customOccasionSteps?.[occasion.id]||[]).filter(validCustomStep)].find(st=>st.id===stepId);if(!step)return;
      const key=occasionStepKey(occasion,step);
      if(action==='occasion-reset'||action==='occasion-dismiss'){await mutate(s=>{s.occasionChoices??={};if(action==='occasion-dismiss')s.occasionChoices[key]='dismissed';else delete s.occasionChoices[key];});return;}
      if(relatedOccasionTask(state,occasion,step)){toast('Dieser Vorbereitungsschritt ist bereits als Aufgabe vorhanden.');return;}
      const task=occasionTask(step,occasion,crypto.randomUUID());if(!validLocalTask(task)){toast('Vorbereitung kann nicht als Aufgabe gespeichert werden.',true);return;}
      await mutate(s=>{s.tasks[task.id]=task;s.taskPending[task.id]=true;s.occasionChoices??={};s.occasionChoices[key]='accepted';});toast('Vorbereitung als reguläre Compass-Aufgabe übernommen.');return;
    }
    if(action==='hold-open-project'){if(!state?.projects?.[id])return;selectedProjectId=id;selectedTaskId=null;tab='projects';render();return;}
    if(action==='calendar-toggle-blocks'){showCalendarBlocks=!showCalendarBlocks;render();return;}
    if(action==='calendar-toggle-hidden'){showHiddenCalendarEvents=!showHiddenCalendarEvents;render();return;}
    if(action==='calendar-rules-toggle'){calendarRulesOpen=!calendarRulesOpen;render();return;}
    if(action==='calendar-overlay-reset'){if(!state?.calendarOverrides?.[id])return;await mutate(s=>{delete s.calendarOverrides[id];});toast('Automatische Zuordnung wiederhergestellt.');return;}
    if(action==='calendar-rule-add'){
      const id='custom-'+crypto.randomUUID();const rule={id,label:'Neue Aktivität',emoji:'✨',category:'Erholung',terms:'neuer begriff',exclude:'',enabled:false};
      await mutate(s=>{s.calendarRules=[...effectiveCalendarRules(s),rule];});return;
    }
    if(action==='calendar-rules-reset'){if(!confirm('Alle bearbeiteten Regeln auf die Standardliste zurücksetzen? Persönliche Termin-Overlays bleiben erhalten.'))return;await mutate(s=>{s.calendarRules=DEFAULT_CALENDAR_RULES.map(r=>({...r}));});return;}
    if(action==='calendar-rule-delete'){if(!confirm('Diese Klassifizierungsregel entfernen?'))return;await mutate(s=>{s.calendarRules=effectiveCalendarRules(s).filter(r=>r.id!==id);});return;}
    if(action==='calendar-rule-up'||action==='calendar-rule-down'){
      await mutate(s=>{const rules=effectiveCalendarRules(s).map(r=>({...r}));const i=rules.findIndex(r=>r.id===id),j=i+(action==='calendar-rule-up'?-1:1);if(i>=0&&j>=0&&j<rules.length){[rules[i],rules[j]]=[rules[j],rules[i]];s.calendarRules=rules;}});return;
    }

    if(action==='agenda-open'){const e=calendarEvents.find(x=>x.id===id);if(e){selectedDay=calendarDate(e);tab='today';}selectedAgendaEventId=id;render();requestAnimationFrame(()=>{const panel=app.querySelector('#agenda-details');if(panel){panel.focus({preventScroll:true});panel.scrollIntoView({block:'nearest',behavior:'smooth'});}});return;}
    if(action==='agenda-close'){selectedAgendaEventId=null;render();return;}
    if(action==='project-focus-toggle'){projectFocus=!projectFocus;render();return;}
    if(action==='project-toggle-expand'){if(projectCollapsed.has(id))projectCollapsed.delete(id);else projectCollapsed.add(id);render();return;}
    if(action==='task-add-subtask'){
      const t=state?.tasks?.[id];if(!t||!t.projectId)return;
      selectedProjectId=t.projectId;tab='projects';render();
      const input=app.querySelector('#task-create-form [name="parentTaskId"]');if(input)input.value=id;
      app.querySelector('#task-create-form [name="title"]')?.focus();return;
    }
    if(action==='task-move-up'||action==='task-move-down'){
      if(!state?.tasks?.[id])return;
      await mutate(s=>moveOrder(s,'tasks',id,action==='task-move-up'?-1:1));return;
    }
    if(action==='project-select'){selectedProjectId=id;selectedTaskId=null;render();return;}
    if(action==='project-reviewed'){if(!state?.projects?.[id])return;await mutate(s=>{s.projects[id].reviewedAt=stamp();s.projectPending[id]=true;});toast('Projekt-Review dokumentiert.');return;}
    if(action==='project-conflict-local'||action==='project-conflict-remote'){
      const conflict=state?.projectConflicts[id];if(!conflict)return;
      await mutate(s=>{if(action==='project-conflict-remote'&&conflict.remote){s.projects[id]=conflict.remote;s.projectVersions[id]=conflict.remote.version;delete s.projectPending[id];}
        else {s.projectVersions[id]=conflict.remote?.version||0;s.projectPending[id]=true;}delete s.projectConflicts[id];});return;
    }
    if(action==='calendar-connect'){await connectCalendar();return;}
    if(action==='calendar-refresh'){await fetchCalendar();return;}
    if(action==='capture-focus'){
      if(!state){captureAfterUnlock=true;document.querySelector('#passphrase')?.focus();return;}
      captureOverlayOpen=true;render();return;
    }
    if(action==='capture-close'||action==='capture-close-backdrop'){captureOverlayOpen=false;render();return;}
    if(action==='select-day'){if(!/^\d{4}-\d{2}-\d{2}$/.test(id||''))return;selectedDay=id;calendarMonth=new Date(`${id}T12:00:00`);render();return;}
    if(action==='reset-today'){selectedDay=localDateString(new Date());calendarMonth=new Date();render();return;}
    if(action==='month-prev'||action==='month-next'){calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+(action==='month-next'?1:-1),1);render();return;}
    if(action==='weather-load'){await loadWeather(weather.city||'Graz');return;}
    if(action==='weather-city'){const city=prompt('Stadt für Wetteranzeige',weather.city);if(city?.trim())await loadWeather(city.trim().slice(0,100));return;}
    if(action==='finance-pane'){if(FINANCE_PANES.some(p=>p.title===id)){financePane=id;render();}return;}
    if(action==='insights-tab'){if(INSIGHT_TABS.some(t=>t.id===id)){insightTab=id;render();}return;}
    if(action==='insights-period'){if(INSIGHT_PERIODS.some(([v])=>v===id)){insightPeriod=id;render();}return;}
    if(action==='import-health-range'){importHealthSpan=id==='all'?'all':Number(id)||90;render();return;}
    if(action==='health-import-cancel'){healthFilePreview=null;render();return;}
    if(action==='health-import-confirm'){
      if(!healthFilePreview)return;
      const staged=healthFilePreview;
      try{await mutate(s=>{commitHealthImport(s,staged);});healthFilePreview=null;toast('Garmin- und Fitdays-Messwerte im verschlüsselten Tresor gespeichert.');}
      catch(ex){toast(ex.message,true);}return;
    }
    if(action==='health-import-clear'){
      if(!confirm('Alle lokal importierten Garmin- und Fitdays-Messungen auf diesem Gerät löschen? Health-Connect-Daten in der Cloud bleiben unverändert.'))return;
      await mutate(s=>{delete s.healthImports;});selectedGarminNight='';healthFilePreview=null;toast('Lokale Garmin- und Fitdays-Daten gelöscht.');return;
    }
    if(action==='lock'){healthFilePreview=null;selectedGarminNight='';clearTimeout(syncTimer);calendarToken='';calendarEvents=[];calendarExpires=0;healthDays=[];healthDevices=[];healthPairCode='';healthError='';widgetPairCode='';widgetDevices=[];vault.lock();state=null;authToken='';currentUser='';notice='';error='';render();return;}
    if(action==='widget-pair'){if(!authToken)return;try{const out=await request(config.apiUrl,authToken,'/api/widget/pair/start',{method:'POST'});widgetPairCode=out.code;widgetConnectError='';render();}catch(ex){widgetConnectError=ex.message;render();}return;}
    if(action==='widget-revoke'){if(!authToken||!confirm('Widget-Gerät wirklich trennen? Der Widget-Zugang wird sofort ungültig.'))return;try{await request(config.apiUrl,authToken,'/api/widget/device/revoke',{method:'POST',body:JSON.stringify({deviceHash:id})});await reloadWidgetDevices();}catch(ex){widgetConnectError=ex.message;render();}return;}
    if(action==='health-pair'){
      try{const result=await request(config.apiUrl,authToken,'/api/health/pair/start',{method:'POST'});healthPairCode=result.code;healthError='';render();}
      catch(ex){healthError=ex.message;render();}return;
    }
    if(action==='health-refresh'){await reloadHealth();return;}
    if(action==='health-delete-all'){if(!authToken||!confirm('Alle in Cloudflare gespeicherten Gesundheits-Tageswerte unwiderruflich löschen? Auf dem Samsung bleiben die ursprünglichen Health-Connect-Daten erhalten.'))return;try{await request(config.apiUrl,authToken,'/api/health/data/delete',{method:'POST'});await reloadHealth();toast('Gespeicherte Gesundheitsdaten gelöscht.');}catch(ex){toast(ex.message,true);}return;}
    if(action==='health-revoke'){
      if(!confirm('Health-Connect-Gerät wirklich trennen? Bereits gespeicherte Tageswerte bleiben im Dashboard.'))return;
      try{await request(config.apiUrl,authToken,'/api/health/device/revoke',{method:'POST',body:JSON.stringify({deviceHash:id})});await reloadHealth();}catch(ex){healthError=ex.message;render();}return;
    }
    if(action==='discovery-prompt-regional'||action==='discovery-prompt-travel'){
      try{await navigator.clipboard.writeText(action.endsWith('regional')?discoveryPromptRegional:discoveryPromptTravel);toast('Rechercheprompt kopiert.');}catch{toast('Kopieren nicht möglich.',true);}return;
    }
    if(action==='discovery-clear'){
      if(!confirm('Alle importierten Veranstaltungen geräteübergreifend entfernen? Dies kann nicht rückgängig gemacht werden.'))return;
      await mutate(st=>removeEvents(st));toast('Löschung wird mit deiner Compass-Cloud synchronisiert.');return;
    }
    if(action==='discovery-capture'){
      const entry=state?.discoveredEvents?.find(e=>eventKey(e)===id);if(!entry)return;
      await addCapture(entry.title,`${entry.date} · ${entry.venue}, ${entry.city}\nQuelle: ${entry.sourceUrl}`);toast('Veranstaltung in der Inbox vorgemerkt.');return;
    }
    if(action==='watch-pair'){
      try{const d=await request(config.apiUrl,authToken,'/api/watch/pair/start',{method:'POST'});watchPairCode=d.code;watchPairExpires=d.expiresAt;watchError='';render();}
      catch(ex){watchError='Kopplung derzeit nicht bereit: '+ex.message;render();}return;
    }
    if(action==='watch-refresh'){await reloadWatchSessions();return;}
    if(action==='watch-revoke'){
      if(!confirm('Uhr wirklich trennen? Noch nicht synchronisierte Sessions bleiben lokal auf der Uhr, lassen sich aber erst nach erneuter Kopplung hochladen.'))return;
      try{await request(config.apiUrl,authToken,'/api/watch/device/revoke',{method:'POST',body:JSON.stringify({deviceHash:id})});await reloadWatchSessions();}
      catch(ex){watchError='Gerät konnte nicht getrennt werden: '+ex.message;render();}return;
    }
    if(action==='sync'){await syncNow();return;}
    if(action==='logout'){
      const previous=authToken;authToken='';currentUser='';calendarToken='';calendarEvents=[];calendarExpires=0;healthDays=[];healthDevices=[];healthPairCode='';healthError='';widgetPairCode='';widgetDevices=[];clearTimeout(syncTimer);
      await vault.clearSession();
      try {if(previous)await request(config.apiUrl,previous,'/api/session',{method:'DELETE'});
        toast('Compass-Sitzung auf diesem Gerät beendet. Lokale Daten bleiben geschützt.');}
      catch {toast('Lokal abgemeldet. Serverseitiger Widerruf gerade nicht erreichbar – bitte bei Gelegenheit erneut verbinden und abmelden.',true);}
      return;
    }
    if(action==='task-select'){if(!state?.tasks?.[id])return;selectedTaskId=id;render();return;}
    if(action==='task-flag'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].flagged=!s.tasks[id].flagged;s.taskPending[id]=true;});return;}
    if(action==='task-toggle'){if(!state?.tasks?.[id])return;await mutate(s=>{s.tasks[id].completed=!s.tasks[id].completed;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});return;}
    if(action==='task-archive'){if(!confirm('Aufgabe archivieren?'))return;await mutate(s=>{s.tasks[id].archived=true;s.tasks[id].updatedAt=stamp();s.taskPending[id]=true;});selectedTaskId=null;return;}
    if(action==='task-conflict-local'||action==='task-conflict-remote'){
       const conflict=state.taskConflicts[id];if(!conflict)return;
       await mutate(s=>{if(action==='task-conflict-remote'&&conflict.remote){s.tasks[id]=conflict.remote;s.taskVersions[id]=conflict.remote.version;delete s.taskPending[id];}
         else{s.taskVersions[id]=conflict.remote?.version||0;s.taskPending[id]=true;}
         delete s.taskConflicts[id];});return;
    }
    if(action==='select-inbox'){if(!state?.records[id]||state.records[id].deleted)return;selectedInboxId=id;tab='inbox';render();return;}
    if(action==='edit'){
      const current=state.records[id];if(!current||current.deleted)return;
      const value=prompt('Inbox-Eintrag bearbeiten',current.title);if(value===null)return;
      if(!value.trim()||value.trim().length>1000){toast('1–1000 Zeichen erforderlich.',true);return;}
      await mutate(s=>{const r=s.records[id];r.title=value.trim();r.updatedAt=stamp();s.pending.push(makeMutation(r));});return;
    }
    if(action==='remove'){
      if(!confirm('Diesen Inbox-Eintrag archivieren?'))return;
      await mutate(s=>{const r=s.records[id];r.deleted=true;r.updatedAt=stamp();s.pending.push(makeMutation(r));});return;
    }
    if(action==='export-encrypted'){download(`compass-vault-${new Date().toISOString().slice(0,10)}.json`,await vault.exportEncrypted());toast('Verschlüsseltes Backup erstellt.');return;}
    if(action==='export-json'){if(!confirm('Klartext-Export erstellen? Die Datei ist NICHT verschlüsselt.'))return;download('compass-export-unencrypted.json',state);toast('JSON-Export erstellt. Sicher aufbewahren.');return;}
    if(action==='resolve-remote'||action==='resolve-local'){
      const c=state.conflicts.find(x=>x.id===id);if(!c)return;
      await mutate(s=>{
        s.conflicts=s.conflicts.filter(x=>x.id!==id);
        if(action==='resolve-remote') {
          if(c.remote){s.records[id]={id,title:c.remote.title,note:c.remote.note,tags:c.remote.tags||[],deleted:c.remote.deleted,updatedAt:c.remote.updatedAt};s.serverVersions[id]=c.remote.version;}
          else {delete s.records[id];delete s.serverVersions[id];}
        }else {
          s.serverVersions[id]=c.remote?.version||0;
          if(sameItemContent(s.records[id],c.remote)) {
            s.pending=s.pending.filter(x=>x.id!==id);
          }else {s.pending.push(makeMutation(s.records[id]));}
        }
      });toast('Konfliktentscheidung gespeichert.');return;
    }
  }catch(ex){toast(ex.message,true);}
}
let googleScriptPromise=null;
async function ensureGoogle() {
  if(window.google?.accounts?.id)return;
  if(!googleScriptPromise)googleScriptPromise=new Promise((resolve,reject)=>{
    const script=document.createElement('script');script.src='https://accounts.google.com/gsi/client';script.async=true;
    script.onload=resolve;script.onerror=()=>reject(new Error('Google Sign-In konnte nicht geladen werden.'));document.head.append(script);
  });
  await googleScriptPromise;
}
async function renderGoogleButton() {
  try {
    await ensureGoogle();
    const root=document.getElementById('google-button');if(!root||authToken)return;
    window.google.accounts.id.initialize({client_id:config.googleClientId,callback:async response=>{
      try {
        // Exchange the short-lived Google ID token for a revocable 30-day Compass session.
        const session=await request(config.apiUrl,response.credential,'/api/session',{method:'POST'});
        await vault.saveSession(session);
        authToken=session.token;currentUser=session.email;
        toast('Compass verbunden. Die Anmeldung bleibt im verschlüsselten Tresor gespeichert.');
        await syncNow();
      }catch(ex){authToken='';currentUser='';toast(ex.status===401?'Dieses Google-Konto ist nicht freigeschaltet.':ex.message,true);}
    },auto_select:false});
    window.google.accounts.id.renderButton(root,{theme:'outline',size:'large',type:'standard',text:'signin_with',shape:'rectangular'});
  }catch(ex){toast(ex.message,true);}
}
async function syncProjects(){
 prepareTasks(state);
 for(const id of Object.keys(state.projectPending).sort((a,b)=>{const depth=id=>{let n=0,c=state.projects[id],seen=new Set();while(c?.parentId&&n<50&&!seen.has(c.id)){seen.add(c.id);c=state.projects[c.parentId];n++;}return n;};return depth(a)-depth(b);}).slice(0,75)){
  if(state.projectConflicts[id])continue;
  const project=state.projects[id];if(!project){delete state.projectPending[id];continue;}
  const before=JSON.stringify(projectPlain(project));
  try{
   const data=await request(config.apiUrl,authToken,'/api/projects',{method:'POST',body:JSON.stringify({...projectPlain(project),baseVersion:state.projectVersions[id]||0})});
   if(data.project){state.projectVersions[id]=data.project.version;if(before===JSON.stringify(projectPlain(state.projects[id]))){state.projects[id]=data.project;delete state.projectPending[id];}}
  }catch(ex){
   if(ex.status!==409)throw ex;
   const remote=(await request(config.apiUrl,authToken,'/api/projects')).projects?.find(p=>p.id===id)||null;
   if(remote&&sameProject(project,remote)){state.projectVersions[id]=remote.version;if(before===JSON.stringify(projectPlain(state.projects[id]))){state.projects[id]=remote;delete state.projectPending[id];}}
   else {state.projectConflicts[id]={remote};delete state.projectPending[id];}
  }
  await persist();
 }
 const data=await request(config.apiUrl,authToken,'/api/projects');
 mergeProjectSnapshot(state,data.projects||[]);await persist();
}
async function syncTasks(){
  prepareTasks(state);
  // Keep local task mutations until the server confirms them.
  for(const id of Object.keys(state.taskPending).sort((a,b)=>{const depth=id=>{let n=0,c=state.tasks[id],seen=new Set();while(c?.parentTaskId&&n<50&&!seen.has(c.id)){seen.add(c.id);c=state.tasks[c.parentTaskId];n++;}return n;};return depth(a)-depth(b);}).slice(0,75)){
    if(state.taskConflicts[id])continue;
    const task=state.tasks[id];if(!task){delete state.taskPending[id];continue;}
    const before=JSON.stringify(taskPlain(task));
    try{
      const data=await request(config.apiUrl,authToken,'/api/tasks',{method:'POST',body:JSON.stringify({...taskPlain(task),baseVersion:state.taskVersions[id]||0})});
      if(data.task){state.taskVersions[id]=data.task.version;if(before===JSON.stringify(taskPlain(state.tasks[id]))){state.tasks[id]=data.task;delete state.taskPending[id];}}
    }catch(ex){
      if(ex.status!==409)throw ex;
      const snapshot=await request(config.apiUrl,authToken,'/api/tasks');const remote=(snapshot.tasks||[]).find(t=>t.id===id)||null;
      if(remote&&sameTask(task,remote)){state.taskVersions[id]=remote.version;if(before===JSON.stringify(taskPlain(state.tasks[id]))){state.tasks[id]=remote;delete state.taskPending[id];}}
      else{state.taskConflicts[id]={remote};delete state.taskPending[id];}
    }
    await persist();
  }
  const snapshot=await request(config.apiUrl,authToken,'/api/tasks');
  mergeTaskSnapshot(state,snapshot.tasks||[]);await persist();
}
async function syncEvents(){
 eventState(state);
 // Pull first so a previously imported catalog is not re-uploaded as a duplicate on a second device.
 const initial=await request(config.apiUrl,authToken,'/api/events');
 mergeEventSnapshot(state,initial.events||[]);
 // Existing 0.5.2 event imports are promoted to the new durable sync queue exactly once.
 for(const e of state.discoveredEvents){const k=eventKey(e);if(state.eventVersions[k]===undefined&&!state.eventPending[k]&&!state.eventConflicts[k])state.eventPending[k]=true;}
 await persist();
 let rounds=0;
 while(Object.keys(state.eventPending).length&&rounds++<100){
  const batch=pendingEventBatch(state,25);if(!batch.length)break;
  const result=await request(config.apiUrl,authToken,'/api/events/batch',{method:'POST',body:JSON.stringify({events:batch})});
  acknowledgeEventBatch(state,batch,result);await persist();
 }
 const remote=await request(config.apiUrl,authToken,'/api/events');
 mergeEventSnapshot(state,remote.events||[]);
 prunePastEvents(state,localDate());await persist();
}
async function syncReview(){
  const remote=await request(config.apiUrl,authToken,'/api/review');
  // On a new device, load the existing cloud review instead of creating a competing copy.
  const local=state.weeklyReview;
  if(!validReview(local)||(!state.reviewPending&&!state.reviewVersion&&local.done.length===0&&!local.completedAt&&remote.progress)){
    if(remote.progress&&validReview(remote.progress)){state.weeklyReview=remote.progress;state.reviewVersion=remote.version;state.reviewPending=false;state.reviewConflict=null;await persist();render();}
    return;
  }
  if(!state.reviewPending){
    if(remote.version>(state.reviewVersion||0)&&remote.progress&&validReview(remote.progress)){
      state.weeklyReview=remote.progress;state.reviewVersion=remote.version;state.reviewConflict=null;await persist();render();
    }return;
  }
  if(state.reviewConflict)return;
  if(remote.version!==(state.reviewVersion||0)){
    state.reviewConflict={progress:remote.progress,version:remote.version};await persist();render();return;
  }
  const before=JSON.stringify(local);
  try{
    const saved=await request(config.apiUrl,authToken,'/api/review',{method:'POST',body:JSON.stringify({progress:local,baseVersion:state.reviewVersion||0})});
    state.reviewVersion=saved.version;
    if(JSON.stringify(state.weeklyReview)===before)state.reviewPending=false;
    await persist();
  }catch(ex){if(ex.status===409){const latest=await request(config.apiUrl,authToken,'/api/review');state.reviewConflict={progress:latest.progress,version:latest.version};await persist();render();return;}throw ex;}
}
async function syncNow() {
  if(!state||!authToken||busy||!navigator.onLine)return;
  clearTimeout(syncTimer);syncTimer=null;
  busy=true;render();
  try {
    const health=await request(config.apiUrl,authToken,'/api/health');
    assertCompatibleWorker(health);
    const stale=prunePastEvents(state,localDate());if(stale)await persist();
    // No concurrent writes while in flight: mutations queue before a request starts.
    let rounds=0;
    while(state.pending.length&&rounds++<100) {
      const batch=nextBatch(state.pending,25).map(m=>({...m,baseVersion:state.serverVersions[m.id]||0}));
      const data=await request(config.apiUrl,authToken,'/api/sync/push',{
        method:'POST',body:JSON.stringify({mutations:batch})});
      let processed=false;
      for(const result of data.results||[]) {
        if(result.status==='error'||result.status==='rejected')throw new Error('Mutation konnte nicht geschrieben werden.');
        if(result.status==='applied'||result.status==='duplicate'||result.status==='conflict')processed=true;
        applyResult(state,result);
      }
      await persist();
      if(!processed)break;
    }
    let fetches=0;
    while(fetches++<100) {
      const data=await request(config.apiUrl,authToken,`/api/sync/pull?cursor=${state.cursor}`);
      mergePulled(state,data.changes||[]);state.cursor=data.cursor;
      await persist();
      if(!data.hasMore)break;
    }
    const fixed=pruneIdenticalConflicts(state);if(fixed)await persist();
    await syncProjects();
    await syncTasks();
    await syncEvents();
    await syncReview();
    lastSyncAt=Date.now();
    notice=state.conflicts.length?'Synchronisiert – bitte Konflikte prüfen.':'Synchronisiert. Alle verfügbaren Änderungen abgeglichen.';
    error='';
  }catch(ex){
    syncResyncRequested=false;
    error=ex.status===401?'Google-Sitzung abgelaufen. Bitte erneut anmelden.':`Synchronisation: ${ex.message}`;
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession().catch(()=>{});}
  }finally{
    busy=false;render();
    const retry=syncResyncRequested&&Boolean(state?.pending.length||Object.keys(state?.taskPending||{}).length||Object.keys(state?.projectPending||{}).length||Object.keys(state?.eventPending||{}).length||state?.reviewPending)&&Boolean(authToken)&&navigator.onLine&&!error;
    syncResyncRequested=false;
    if(retry)scheduleSync(0);
  }
}
document.addEventListener('keydown',ev=>{
  const target=ev.target;
  const typing=target instanceof HTMLElement && (['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||target.isContentEditable);
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k'){
    ev.preventDefault();runAction('capture-focus');return;
  }
  if(ev.key==='Escape'&&captureOverlayOpen){ev.preventDefault();captureOverlayOpen=false;render();return;}
  if(!typing&&!ev.ctrlKey&&!ev.altKey&&!ev.metaKey&&ev.key.toLowerCase()==='n'&&state){ev.preventDefault();runAction('capture-focus');}
});
window.addEventListener('online',()=>{render();if(authToken)scheduleSync(0);});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'&&authToken&&state&&
    (state.pending.length||Object.keys(state.taskPending||{}).length||Object.keys(state.eventPending||{}).length||state.reviewPending||Date.now()-lastSyncAt>=SYNC_INTERVAL_MS))scheduleSync(1000);
});
setInterval(()=>{
  if(state&&authToken&&navigator.onLine&&document.visibilityState==='visible'&&
     Date.now()-lastSyncAt>=SYNC_INTERVAL_MS&&!busy)scheduleSync(0);
},60000);
window.addEventListener('offline',render);
for(const e of ['pointerdown','keydown','touchstart'])document.addEventListener(e,()=>{lastActivity=Date.now();},{passive:true});
setInterval(()=>{if(state&&Date.now()-lastActivity>15*60*1000){clearTimeout(syncTimer);vault.lock();state=null;authToken='';currentUser='';calendarToken='';calendarEvents=[];calendarExpires=0;notice='Nach 15 Minuten Inaktivität automatisch gesperrt.';render();}},60000);
(async()=>{
  try{config=await fetch(`${import.meta.env.BASE_URL}runtime-config.json`,{cache:'no-store'}).then(r=>r.json());}
  catch{config={};}
  hasVault=await vault.exists();if(bootCapture&&hasVault){captureAfterUnlock=true;}render();if(bootCapture)history.replaceState(null,'',location.pathname);
})().catch(ex=>{app.innerHTML=`<div class="fatal">Lokaler Speicher nicht verfügbar: ${h(ex.message)}. Bitte einen sicheren Browserkontext verwenden.</div>`;});
