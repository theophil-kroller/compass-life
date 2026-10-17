import './style.css';
import {registerSW} from 'virtual:pwa-register';
import * as vault from './vault.js';
import {request,nextBatch,applyResult,mergePulled,sameItemContent,pruneIdenticalConflicts} from './sync.js';
import {prepareTasks,TASK_CATEGORIES,CATEGORY_LABELS,validLocalTask,taskPlain,sameTask,localDate,tasksForDay,dueTasks,mergeTaskSnapshot,parseTags,nextActions,flaggedTasks,heldTasks,projectTasks,validProject,projectPlain,sameProject,mergeProjectSnapshot,agendaForEvent,projectNeedsReview,contextsFor} from './tasks.js';

registerSW({immediate:true});
const app=document.getElementById('app');
let config={apiUrl:'',googleClientId:''};
let state=null, hasVault=false, authToken='', currentUser='', busy=false, notice='', error='', tab='today', lastActivity=Date.now();
let saveQueue=Promise.resolve();
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
let selectedDay=localDateString(new Date());
let selectedInboxId=null;
let selectedTaskId=null;
let selectedProjectId=null;
let selectedAgendaEventId=null;
let showCalendarBlocks=false;
let showCaptureDetails=false;
let contextFilter='';
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
if(['today','inbox','review','forecast','overview','someday','activity','projects','next','flagged','hold'].includes(bootView))tab=bootView;
if(bootCapture){captureAfterUnlock=true;tab='inbox';}

let watchPairCode='', watchPairExpires='', watchSessions=[], watchDevices=[], watchError='';
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
function visibleCalendarEvents(day){return dailyCalendar(day).filter(e=>showCalendarBlocks||!isRoutineBlock(e));}
function isRoutineBlock(e){return /^(work|research blocker)$/i.test(String(e?.summary||'').trim());}
function agendaEvent(e){const matched=agendaForEvent(state,e);return matched.length?`<span class="agenda-count">${ico('list',13)} ${matched.length} Agenda</span>`:'';}
function calendarCardRows(day){
 const ev=visibleCalendarEvents(day);
 return ev.length?`<div class="compass-calendar-list">${ev.map(e=>`<button type="button" class="compass-calendar-event calendar-clickable" data-action="agenda-open" data-id="${h(e.id)}"><span class="compass-calendar-hour">${h(calendarTime(e))}</span><strong>${h(e.summary||'Termin')}</strong>${agendaEvent(e)}${ico('arrow',14)}</button>`).join('')}</div>`
  :'<div class="appointments-empty"><span>Keine relevanten Termine für diesen Tag.</span></div>';
}
function calendarFilterToggle(){return `<button type="button" class="secondary-btn calendar-filter-toggle" data-action="calendar-toggle-blocks">${ico(showCalendarBlocks?'eye':'eyeOff',15)} ${showCalendarBlocks?'Zeitblöcke ausblenden':'Zeitblöcke einblenden'}</button>`;}
function eventAgendaPanel(){
 const event=calendarEvents.find(e=>e.id===selectedAgendaEventId);
 if(!event||!state)return '';
 const notes=agendaForEvent(state,event);
 const title=String(event.summary||'');
 const person=title.match(/\b(?:mit|bei)\s+([\p{Lu}][\p{L}-]{2,})/u);
 const suggested=/\buko\b/i.test(title)?'uko':person?person[1].toLocaleLowerCase('de'):(title.match(/[\p{L}\p{N}]{3,}/u)?.[0]?.toLocaleLowerCase('de')||'');
 return `<section class="work-card agenda-panel" aria-label="Besprechungsagenda"><div class="work-heading"><span>${ico('users',19)} Gesprächsvorbereitung</span><button type="button" class="secondary-btn" data-action="agenda-close">Schließen</button></div>
 <h3>${h(event.summary||'Termin')}</h3><p class="muted-line">${h(calendarDate(event))} · ${h(calendarTime(event))} · Google Calendar (nur lesen)</p>
 ${notes.length?`<div class="agenda-items">${notes.map(x=>`<div class="agenda-item">${ico('checkSquare',16)} <span>${h(x.title)}</span><small>${x.tags?.map(t=>'#'+h(t)).join(' ')||''}</small></div>`).join('')}</div>`:'<p class="muted-line">Noch keine offenen Gesprächspunkte mit passenden Tags.</p>'}
 <form id="agenda-note-form" class="project-form"><input type="hidden" name="tag" value="${h(suggested)}"><label>Neuen Agendapunkt notieren<input name="title" required maxlength="180" placeholder="Was möchte ich besprechen?"/></label><button type="submit" class="primary-btn">${ico('plus',16)} Agendapunkt hinzufügen</button></form>
 <p class="form-hint">Tag-Vorschlag: #${h(suggested)}. Du kannst Tags anschließend im Aufgabeneditor ändern. Keine Kalendereinträge werden verändert.</p></section>`;
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
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{
   const start=new Date();start.setHours(0,0,0,0);
   const end=new Date(start);end.setDate(end.getDate()+21);
   const url=new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
   url.searchParams.set('timeMin',start.toISOString());url.searchParams.set('timeMax',end.toISOString());
   url.searchParams.set('singleEvents','true');url.searchParams.set('orderBy','startTime');
   url.searchParams.set('maxResults','200');
   const response=await fetch(url,{headers:{Authorization:`Bearer ${calendarToken}`},signal:controller.signal,cache:'no-store'});
   if(!response.ok)throw new Error(response.status===403?'Google Calendar API oder Berechtigung fehlt. Bitte Calendar API im Google-Cloud-Projekt aktivieren.':`Google Calendar: HTTP ${response.status}`);
   const data=await response.json();
   calendarEvents=Array.isArray(data.items)?data.items.filter(x=>x&&x.start):[];
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
 const sessions=watchSessions||[];
 const today=localDate();const monday=new Date(today+'T12:00:00');monday.setDate(monday.getDate()-((monday.getDay()+6)%7));const weekStart=localDate(monday);
 const rows=[['Heute',sessions.filter(x=>new Date(x.startedAt*1000).toLocaleDateString('en-CA')===today)],['Diese Woche',sessions.filter(x=>new Date(x.startedAt*1000).toLocaleDateString('en-CA')>=weekStart)],['Synchronisiert',sessions]];
 return `<div class="compass-tracking-grid">${rows.map(([label,items])=>`<div class="tracking-period"><span>${label}</span><strong>${(items.reduce((a,x)=>a+(x.focusSec||0),0)/3600).toLocaleString('de-AT',{maximumFractionDigits:1})} h</strong><small>${items.reduce((a,x)=>a+(x.pomodoros||0),0)} Pomodoros · ${items.length} Sessions</small></div>`).join('')}</div><p class="stats-caption">Letzte maximal 50 synchronisierte Compass-Garmin-Sessions. Schlafdaten sind nicht angebunden.</p>`;
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
const rows=()=>state?Object.values(state.records).filter(r=>!r.deleted).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)):[];
const disabledButton=(label='Öffnen')=>`<button class="ghost-cta" type="button" disabled aria-label="${h(label)} – noch nicht freigeschaltet">${h(label)} ${ico('arrow',13)}</button>`;
function navItem(id,label,iconName,{disabled=false,count=null}={}) {
 const attr=disabled?'disabled aria-disabled="true" title="Noch nicht freigeschaltet"':`data-tab="${id}"`;
 return `<button type="button" class="nav-item ${tab===id?'is-active':''} ${disabled?'is-disabled':''}" ${attr}>
  ${ico(iconName,19)}<span>${h(label)}</span>${count!==null?`<span class="nav-count">${count}</span>`:''}</button>`;
}
function chrome(content){
 const num=rows().length;
 const today=new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 const title=tab==='today'&&selectedDay!==localDateString(new Date())?new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(`${selectedDay}T12:00:00`)):(({today:'Heute',forecast:'Forecast',projects:'Projekte',next:'Next Actions',flagged:'Flagged',hold:'On Hold',someday:'Dreams',review:'Wochenreview',overview:'Übersicht',inbox:'Inbox',system:'System & Synchronisation',activity:'Aktivitäten'})[tab]||'Heute');
 const sub=({activity:'Aktivitäten, Zeit und Fokus. Auch von der Garmin.',today:'Was heute wirklich zählt.',forecast:'Termine, Fristen und Agenden auf einer Zeitachse.',projects:'Ergebnisse verfolgen, nächste Schritte verbinden.',next:'Alle ausführbaren nächsten Schritte, auch ohne Datum.',flagged:'Bewusst hervorgehobene Aufgaben.',hold:'Bewusst pausiert oder auf Rückmeldung wartend.',someday:'Someday / Maybe · Ein Raum für Ideen ohne Verpflichtung.',review:'Gedanken klären, Verpflichtungen prüfen und bewusst wählen.',overview:'Alle Lebensbereiche auf einen Blick.',inbox:'Alles erfassen. Später in Ruhe klären.',system:'Deine Geräteverbindung und Datensicherheit.'})[tab]||'';
 return `<div class="shell"><aside class="sidebar" aria-label="Navigation">
 <div class="brand"><span class="brand-icon">${ico('compass',24)}</span><span class="brand-name">Compass<small>Personal Life Manager</small></span></div>
 <nav class="side-nav" aria-label="Hauptnavigation">
 ${navItem('inbox','Inbox','inbox',{count:num})}
 ${navItem('today','Heute','sun')}${navItem('forecast','Forecast','calendar')}
 ${navItem('next','Next Actions','target')}${navItem('review','Wochenreview','sync')}
 ${navItem('flagged','Flagged','flag')}${navItem('hold','On Hold','pause')}
 ${navItem('someday','Dreams','spark')}
 <div class="nav-separator"></div>
 ${navItem('projects','Projekte','folder')}${navItem('people','Menschen','people',{disabled:true})}
 ${navItem('progress','Fortschritt','activity',{disabled:true})}${navItem('recovery','Erholung','heart',{disabled:true})}
 <div class="nav-separator"></div>${navItem('overview','Übersicht','layers')}
 ${navItem('activity','Aktivitäten','activity')}${navItem('system','System & Sync','settings')}
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

 ${moduleCard({name:'Menschen',iconName:'people',cls:'grid-people',sub:'Offene Gespräche & Kontakte',body:`<div class="people-preview"><span class="people-circles"><i></i><i></i><i></i></span><p>Keine Personen erfasst</p></div>`})}
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
 const list=dueTasks(state,600),today=localDate();
 const days=Array.from({length:14},(_,i)=>{const d=new Date(today+'T12:00:00');d.setDate(d.getDate()+i);return localDate(d);});
 const overdue=list.filter(t=>t.dueDate<today);
 const dayContent=day=>{
  const tasks=list.filter(t=>t.dueDate===day);
  const ev=calendarToken?visibleCalendarEvents(day):[];
  if(!tasks.length&&!ev.length)return '';
  const combined=[...tasks.map(t=>({type:'task',sort:'0',obj:t})),...ev.map(e=>({type:'event',sort:e.start?.dateTime||'1',obj:e}))].sort((a,b)=>a.sort.localeCompare(b.sort));
  return `<div class="forecast-date-group"><h3>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(day+'T12:00:00')))}</h3><div class="timeline-day">${combined.map(x=>x.type==='task'?`<div class="timeline-item deadline-event">${ico('flag',19)}<div><strong>${h(x.obj.title)}</strong><small>Compass · harte Deadline · ${h(CATEGORY_LABELS[x.obj.category]||x.obj.category)}</small></div><button type="button" class="secondary-btn" data-action="task-select" data-id="${h(x.obj.id)}">Details</button></div>`:`<button type="button" class="timeline-item calendar-event" data-action="agenda-open" data-id="${h(x.obj.id)}">${ico('calendar',19)}<div><strong>${h(x.obj.summary||'Kalendertermin')}</strong><small>Google Calendar · ${h(calendarTime(x.obj))}${x.obj.start?.date?' · Ganztagsmarker':''}</small></div>${agendaEvent(x.obj)}${ico('arrow',15)}</button>`).join('')}</div></div>`;
 };
 return chrome(`<div class="forecast-layout">${calendarRail()}<section class="forecast-full work-card"><div class="work-heading"><span>${ico('calendar',21)} Forecast · Fristen und Termine</span><span class="quiet-tag">14 Tage</span></div>
 <div class="forecast-tools">${calendarToken?calendarFilterToggle():calendarConnectUI()}<span class="muted-line">${list.length} offene Deadlines · Google Calendar nur lesend</span></div>
 ${overdue.length?`<div class="forecast-date-overdue"><strong>Überfällig</strong>${taskList(overdue,'forecast')}</div>`:''}
 ${days.map(dayContent).join('')||'<div class="task-empty">Keine Termine oder Fristen für die kommenden 14 Tage.</div>'}
 <p class="rail-footnote">Ganztägig markierte Fristen blockieren nicht automatisch deinen ganzen Tag. Zeitblöcke können ausgeblendet werden.</p></section><aside class="forecast-inspector">${eventAgendaPanel()}<section class="work-card task-inspector"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabe bearbeiten</span></div>${taskEditor()}</section></aside></div>`);
}
function projectOptions(selected=''){
 return `<option value="">Kein Projekt</option>`+Object.values(state?.projects||{}).filter(x=>x.status!=='completed'||x.id===selected).sort((a,b)=>a.title.localeCompare(b.title,'de')).map(p=>`<option value="${h(p.id)}" ${selected===p.id?'selected':''}>${h(p.title)}</option>`).join('');
}
function categoryOptions(selected='Allgemein'){
 return TASK_CATEGORIES.map(c=>`<option value="${h(c)}" ${c===selected?'selected':''}>${h(CATEGORY_LABELS[c]||c)}</option>`).join('');
}
function workflowOptions(selected='next'){
 return [['next','Next Action'],['waiting','Waiting For'],['hold','On Hold']].map(([value,label])=>`<option value="${value}" ${selected===value?'selected':''}>${label}</option>`).join('');
}
function taskCreateForm(defaultDay='',defaultProject=''){
 return `<form class="task-create-form" id="task-create-form"><div class="task-form-title"><strong>Neue Aufgabe</strong><span>Auch ohne Datum möglich</span></div><input name="title" aria-label="Aufgabentitel" maxlength="180" required placeholder="Was ist der nächste konkrete Schritt?"/><div class="task-field-grid">
 <label>Geplanter Tag<input name="plannedDate" type="date" value="${h(defaultDay||'')}"></label><label>Harte Deadline<input name="dueDate" type="date"></label>
 <label>Kategorie<select name="category">${categoryOptions()}</select></label><label>Status<select name="workflow">${workflowOptions()}</select></label>
 <label>Projekt<select name="projectId">${projectOptions(defaultProject)}</select></label><label>Agenda-Tags<input name="tags" placeholder="UKO, Martin" maxlength="300"/></label>
 <label>Frühestens ab<input name="deferUntil" type="date" title="Erst ab diesem Datum in Next Actions anzeigen; ist keine Deadline"/></label><label>Kontext-Tags<input name="contextTags" placeholder="büro, laptop" maxlength="300"/></label>
 <label>Aufwand (Min.)<input name="estimateMinutes" type="number" min="5" max="1440" step="5" placeholder="optional"/></label>
 <label class="flag-check"><input type="checkbox" name="flagged"/> Flagged</label><button class="primary-btn" type="submit">${ico('plus',16)} Hinzufügen</button></div></form>`;
}
function taskList(items,scope,hideEmpty=false){return items.length?`<div class="task-list" data-scope="${h(scope)}">${items.map(t=>`<div class="task-row ${t.completed?'completed':''}"><button type="button" class="task-check" data-action="task-toggle" data-id="${h(t.id)}" aria-label="${t.completed?'Wieder öffnen':'Erledigen'}">${t.completed?'✓':'○'}</button><button type="button" class="flag-button ${t.flagged?'is-flagged':''}" data-action="task-flag" data-id="${h(t.id)}" title="Flagged umschalten">${ico('flag',17)}</button><button class="task-title-button" type="button" data-action="task-select" data-id="${h(t.id)}"><strong>${h(t.title)}</strong><small>${h(CATEGORY_LABELS[t.category]||t.category)}${t.dueDate?' · Deadline '+h(t.dueDate):''}${t.workflow==='waiting'?' · Waiting For':t.workflow==='hold'?' · On Hold':''}${t.deferUntil&&t.deferUntil>localDate()?' · ab '+h(t.deferUntil):''}${t.estimateMinutes?' · '+t.estimateMinutes+' min':''}${(t.contextTags||[]).length?' · @'+h(t.contextTags.join(' @')):''}${state?.taskPending?.[t.id]?' · Lokal gespeichert':''}</small>${t.tags?.length?`<span class="task-tags">${t.tags.map(tag=>'<i>#'+h(tag)+'</i>').join('')}</span>`:''}</button>${state?.taskConflicts?.[t.id]?'<span class="task-conflict-pill">Konflikt</span>':''}</div>`).join('')}</div>`:hideEmpty?'':`<div class="task-empty">Keine passenden Aufgaben.</div>`;}
function taskEditor(){const t=state?.tasks?.[selectedTaskId];if(!t||t.archived)return '<div class="task-empty">Tippe auf eine Aufgabe, um sie zu bearbeiten.</div>';
 return `<form id="task-edit-form" data-id="${h(t.id)}" class="task-edit-form"><label>Titel<input required name="title" maxlength="180" value="${h(t.title)}"/></label><label>Notiz<textarea name="note" maxlength="3000" rows="3">${h(t.note||'')}</textarea></label><label>Geplanter Tag<input type="date" name="plannedDate" value="${h(t.plannedDate||'')}"></label><label>Harte Deadline<input type="date" name="dueDate" value="${h(t.dueDate||'')}"></label><label>Kategorie<select name="category">${categoryOptions(t.category)}</select></label><label>GTD-Status<select name="workflow">${workflowOptions(t.workflow)}</select></label><label>Projekt<select name="projectId">${projectOptions(t.projectId)}</select></label><label>Tags (mit Komma trennen)<input name="tags" value="${h((t.tags||[]).join(', '))}" placeholder="UKO, Martin"/></label>
 <label>Frühestens ab (keine Deadline)<input type="date" name="deferUntil" value="${h(t.deferUntil||'')}"/></label>
 <label>Kontexte (Komma getrennt)<input name="contextTags" value="${h((t.contextTags||[]).join(', '))}" placeholder="büro, laptop"/></label>
 <label>Aufwand (Min.)<input name="estimateMinutes" type="number" min="5" max="1440" step="5" value="${t.estimateMinutes??''}"/></label><label class="flag-check"><input type="checkbox" name="flagged" ${t.flagged?'checked':''}/> Flagged</label><div class="task-edit-actions"><button class="primary-btn" type="submit">Speichern</button><button class="secondary-btn" type="button" data-action="task-archive" data-id="${h(t.id)}">Archivieren</button></div></form>${state.taskConflicts[t.id]?`<div class="task-conflict"><strong>Änderungskonflikt</strong><p>Die Aufgabe wurde auf einem anderen Gerät bearbeitet. Beide Fassungen bleiben erhalten.</p><button type="button" data-action="task-conflict-local" data-id="${h(t.id)}">Meine Änderungen übernehmen</button><button type="button" data-action="task-conflict-remote" data-id="${h(t.id)}">Cloud-Version übernehmen</button></div>`:''}`;
}
function workflowScreen(which){
 const titles={next:'Next Actions',flagged:'Flagged',hold:'On Hold & Waiting For'};
 const tasks=which==='next'?nextActions(state):which==='flagged'?flaggedTasks(state):heldTasks(state);
 const shown=which==='next'&&contextFilter?contextsFor(state,contextFilter):tasks;
 const availableContexts=[...new Set(nextActions(state).flatMap(t=>t.contextTags||[]))].sort((a,b)=>a.localeCompare(b,'de'));
 return chrome(`<div class="workflow-layout"><section class="work-card"><div class="work-heading"><span>${ico(which==='flagged'?'flag':which==='hold'?'pause':'target',20)} ${titles[which]}</span><span class="quiet-tag">${shown.length} offen</span></div>
 ${which==='next'?`<div class="context-filter"><label>Aktueller Kontext <select id="context-filter"><option value="">Alle verfügbaren Next Actions</option>${availableContexts.map(c=>`<option value="${h(c)}" ${contextFilter===c?'selected':''}>@${h(c)}</option>`).join('')}</select></label></div>`:''}
 ${taskCreateForm('')}${taskList(shown,which)}</section><aside class="work-card"><div class="work-heading"><span>${ico('pencil',18)} Aufgabendetails</span></div>${taskEditor()}</aside></div>`);
}
function projectScreen(){
 const projects=Object.values(state?.projects||{}).sort((a,b)=>['active','hold','completed'].indexOf(a.status)-['active','hold','completed'].indexOf(b.status)||a.title.localeCompare(b.title,'de'));
 const current=state?.projects?.[selectedProjectId]||projects[0]||null;
 const items=current?projectTasks(state,current.id):[];
 const nextCount=nextActions(state).filter(t=>t.projectId===current?.id).length;
 return chrome(`<div class="projects-layout"><section class="work-card"><div class="work-heading"><span>${ico('folder',20)} Projekte</span><span class="quiet-tag">${projects.filter(x=>x.status==='active').length} aktiv</span></div>
 <form class="project-form" id="project-create-form"><label>Neues Projekt<input required name="title" maxlength="140" placeholder="z. B. Dissertation: Paper fertigstellen"/></label><label>Gewünschtes Ergebnis<input name="outcome" maxlength="800" placeholder="Woran erkenne ich, dass es fertig ist?"/></label><label>Bereich<select name="category">${categoryOptions()}</select></label><label>Review alle (Tage)<input type="number" name="reviewIntervalDays" min="1" max="90" value="7"/></label><button class="primary-btn" type="submit">${ico('plus',17)} Projekt anlegen</button></form>
 ${projects.length?`<div class="project-list">${projects.map(x=>`<button type="button" class="project-list-item ${current?.id===x.id?'is-current':''}" data-action="project-select" data-id="${h(x.id)}"><span>${ico('folder',18)}</span><div><strong>${h(x.title)}</strong><small>${h(CATEGORY_LABELS[x.category]||x.category)} · ${x.status==='active'?'Aktiv':x.status==='hold'?'Pausiert':'Abgeschlossen'}</small></div><span>${projectTasks(state,x.id).filter(t=>!t.completed&&!t.archived).length}</span></button>`).join('')}</div>`:'<div class="task-empty">Noch keine Projekte angelegt.</div>'}</section>
 <div class="project-details">${current?`<section class="work-card"><div class="work-heading"><span>${ico('target',18)} Gewünschtes Ergebnis</span><span class="quiet-tag">${current.status==='active'?'Aktiv':current.status==='hold'?'On Hold':'Abgeschlossen'}</span></div><form id="project-edit-form" class="task-edit-form" data-id="${h(current.id)}"><label>Projektname<input name="title" required maxlength="140" value="${h(current.title)}"/></label><label>Ergebnis<textarea name="outcome" rows="2" maxlength="800">${h(current.outcome||'')}</textarea></label><div class="project-edit-grid"><label>Bereich<select name="category">${categoryOptions(current.category)}</select></label><label>Status<select name="status">${[['active','Aktiv'],['hold','On Hold'],['completed','Abgeschlossen']].map(([v,l])=>`<option value="${v}" ${current.status===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Deadline (optional)<input name="dueDate" type="date" value="${h(current.dueDate||'')}"></label><label>Review alle (Tage)<input name="reviewIntervalDays" type="number" min="1" max="90" value="${current.reviewIntervalDays||7}"/></label></div><div class="project-review-info">Letzter Review: ${current.reviewedAt?h(new Date(current.reviewedAt).toLocaleDateString('de-AT')):'Noch nicht geprüft'} · ${projectNeedsReview(current)?'Review fällig':'Aktuell'}</div><div class="project-edit-actions"><button class="primary-btn" type="submit">Projekt speichern</button><button type="button" class="secondary-btn" data-action="project-reviewed" data-id="${h(current.id)}">${ico('checkSquare',15)} Jetzt geprüft</button></div></form>${state.projectConflicts[current.id]?`<div class="task-conflict">Konflikt mit anderem Gerät. <button data-action="project-conflict-remote" data-id="${h(current.id)}">Cloud-Version übernehmen</button><button data-action="project-conflict-local" data-id="${h(current.id)}">Meine Version übernehmen</button></div>`:''}</section>
 <section class="work-card"><div class="work-heading"><span>${ico('target',18)} Nächste Schritte</span><span class="quiet-tag">${nextCount} ausführbar</span></div><div class="progress-hint"><span>Abgeschlossene Aufgaben: ${items.filter(t=>t.completed).length} von ${items.length}</span><div class="progress-track"><span style="width:${items.length?Math.round(100*items.filter(t=>t.completed).length/items.length):0}%"></span></div></div>${current.status==='active'&&nextCount===0?'<div class="project-warning">Dieses aktive Projekt hat noch keine nächste ausführbare Handlung.</div>':''}${taskCreateForm('',current.id)}${taskList(items,'project')}</section><section class="work-card">${taskEditor()}</section>`:'<section class="work-card"><div class="task-empty">Lege zuerst dein erstes Projekt an.</div></section>'}</div></div>`);
}
function somedayScreen(){
 return chrome(`<div class="dream-layout"><section class="dream-intro work-card">
 <div class="dream-lead"><span class="dream-symbol">${ico('spark',31)}</span><div><p class="little-overline">DEIN DREAM SPACE</p><h2>Möglichkeiten dürfen warten.</h2><p>Eine Ausbildung, ein Buch, die Tauchweiterbildung oder eine Idee. Sammle, was dich inspiriert – ohne Datum, ohne Prioritätsdruck und ohne dass es automatisch in „Heute“ erscheint.</p></div></div>
 <div class="dream-capture-shell"><input type="text" disabled placeholder="Neue Idee, Wunsch oder Inspiration …" aria-label="Someday / Maybe erfassen (noch nicht verfügbar)"/><button type="button" class="primary-btn" disabled>${ico('plus',16)} Sammeln</button></div>
 <p class="dream-caption">Bis die Sammlung freigeschaltet ist, kannst du Gedanken über die Schnellerfassung sicher in die Inbox geben.</p></section>
 <div class="dream-grid">${[
 ['Lernen & Weiterbilden','book','Kurse, Seminare, Zertifikate und neue Kompetenzen'],
 ['Lesen & Entdecken','bookmark','Interessante Artikel, Bücher, Podcasts und Links'],
 ['Erleben & Ausprobieren','suitcase','Reisen, Tauchen, Tanzen und persönliche Wünsche'],
 ['Projekte & Ideen','spark','Vorhaben, für die gerade noch keine Zeit ist']
 ].map(([title,iconName,desc])=>`<section class="dream-category work-card"><div class="work-heading"><span>${ico(iconName,19)} ${h(title)}</span><span class="quiet-tag">0</span></div><p>${h(desc)}</p><div class="dream-empty">Noch nichts gesammelt</div></section>`).join('')}</div>
 <section class="work-card dream-review"><div class="work-heading"><span>${ico('sync',18)} In Ruhe wiederentdecken</span><span class="quiet-tag">Review</span></div><p>Diese Sammlung bleibt aus Today und Forecast heraus. Du kannst sie später in deinem Wochenreview oder bei einem gelegentlichen Inspirations-Review sichten. Nur was du bewusst aktivierst, wird zu einem Projekt oder einer Next Action.</p><button disabled type="button" class="soft-button">Someday-Review öffnen</button></section></div>`);
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
function todayScreen(){return chrome(todayWork());}
function homeScreen(){return chrome(dashboardCards());}

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
 `<div class="inbox-detail-top"><span class="capture-eyebrow">EINTRAG · INBOX</span><span class="inbox-detail-date">${date(current.updatedAt)}</span></div><form id="inbox-edit-form" data-id="${h(current.id)}"><label for="inbox-edit-title">Gedanke</label><textarea id="inbox-edit-title" name="title" maxlength="1000" rows="3" required>${h(current.title)}</textarea><label for="inbox-edit-note">Notizen, Links, Kontext</label><textarea id="inbox-edit-note" name="note" maxlength="10000" rows="7" placeholder="Optional – für den späteren Review">${h(current.note||'')}</textarea><label for="inbox-edit-tags">Agenda-Tags (Komma getrennt)</label><input id="inbox-edit-tags" name="tags" value="${h((current.tags||[]).join(', '))}" placeholder="UKO, Martin"/><div class="inbox-detail-actions"><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="remove" data-id="${h(current.id)}">Archivieren</button></div></form><div class="inbox-detail-next">${ico('target',18)}<div><strong>Später klären</strong><p>Im Wochenreview wird daraus eine Next Action, ein Projekt, eine Agenda oder Dreams. Bis dahin bleibt dieser Gedanke zuverlässig in der Inbox.</p><button type="button" class="review-link" data-tab="review">Zum Review ${ico('arrow',14)}</button></div></div>`:
 `<div class="inbox-mvp-empty detail-empty">${ico('pencil',32)}<strong>Ein Gedanke genügt.</strong><span>Öffne die Schnellerfassung und halte fest, was dich beschäftigt.</span></div>`}</aside></div>`);
}

function clarifyControls(currentId=null){
 const saved=(currentId&&state?.reviewMeta?.[currentId])||{};
 const energy=[['low','Wenig',1],['medium','Mittel',2],['high','Viel',3]];
 const attentions=[['routine','Routine','sync'],['clarity','Geistige Klarheit','sun'],['deep','Tiefes Denken','book']];
 return `<div class="clarify-options" aria-label="Klärung und Energie"><div class="clarify-choice"><h3>Wohin gehört es?</h3><div class="choice-row">${[['next','Next Action'],['waiting','Waiting For'],['hold','On Hold']].map(([value,label])=>`<button type="button" data-action="review-clarify:${value}" data-id="${h(currentId||'')}" class="choice-pill" ${currentId?'':'disabled'}>${label}</button>`).join('')}<span class="muted-line">Weitere Ziele können als Projekte oder Ideen angelegt werden.</span></div></div>
 <div class="clarify-choice"><h3>Wie viel Energie braucht es?</h3><div class="choice-row review-energy-choices">${energy.map(([key,label,level])=>`<button type="button" class="review-choice review-energy-${key} ${saved.energy===key?'chosen':''}" aria-pressed="${saved.energy===key}" data-action="review-energy:${key}" data-id="${h(currentId||'')}" ${currentId?'':'disabled'}><span class="mini-battery battery-${level}"><i></i></span>${label}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Welche Art von Aufmerksamkeit?</h3><div class="choice-row">${attentions.map(([key,label,icon])=>`<button type="button" class="review-choice review-attention ${saved.attention===key?'chosen':''}" aria-pressed="${saved.attention===key}" data-action="review-attention:${key}" data-id="${h(currentId||'')}" ${currentId?'':'disabled'}>${ico(icon,15)} ${label}</button>`).join('')}</div></div>
 <small class="review-local-caption">Energie und Aufmerksamkeit werden verschlüsselt in diesem lokalen Tresor gespeichert. Die Synchronisierung dieser Review-Merkmale auf andere Geräte folgt später.</small>
 <div class="clarify-choice"><h3>Wichtigkeit & Dringlichkeit</h3><p class="clarify-tip">Zwei getrennte Dimensionen. Dringlichkeit kann sich ändern, ohne dass ein Ziel wichtiger wird.</p><div class="choice-row">${['Wichtig: hoch / mittel / niedrig','Dringend: ja / nein'].map(x=>`<button type="button" disabled class="choice-pill">${h(x)}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Termine (nur bei Bedarf)</h3><div class="choice-row">${['Frühestens ab','Wunschtermin','Harte Deadline','Wiedervorlage'].map(x=>`<button type="button" disabled class="choice-pill">${h(x)}</button>`).join('')}</div></div>
 </div>`;
}
function reviewScreen(){
 const list=rows();const current=list.find(r=>r.id===selectedInboxId)||list[0]||null;
 return chrome(`<div class="guided-review"><div class="review-flow work-card"><div class="work-heading"><span>${ico('sync',20)} Dein Weekly Review</span><span class="quiet-tag">Geführter Ablauf</span></div>
 <p class="review-explainer">Nicht alles muss sofort geklärt werden. Einmal pro Woche bringst du die offenen Schleifen systematisch auf den aktuellen Stand.</p>
 <div class="review-flow-steps">${[
 ['1','Eingang leeren','Jeden erfassten Gedanken klären oder bewusst parken.',String(list.length)+' offene Einträge'],
 ['2','Nächste Schritte','Projekte, Next Actions und offene Entscheidungen prüfen.',nextActions(state).length+' Next Actions · '+Object.values(state?.projects||{}).filter(p=>p.status==='active'&&!nextActions(state).some(t=>t.projectId===p.id)).length+' Projekte ohne nächste Aktion'],
 ['3','Waiting For & Agendas','Worauf wartest du? Mit wem gibt es Gesprächsbedarf?',heldTasks(state).length+' offene Vorgänge'],
 ['4','Termine & Fristen','Vergangene und kommende Termine und Deadlines ansehen.',calendarToken?calendarStatus:'Google Calendar optional'],
 ['5','Dreams & Möglichkeiten','Ideen freiwillig sichten, ohne neue Verpflichtungen.','Nur auf Wunsch']
 ].map(([n,title,desc,tag],i)=>`<div class="review-flow-step ${i===0?'review-step-current':''}"><span class="review-step-number">${ico(['inbox','checkSquare','people','calendar','spark'][i],17)}</span><div><strong>${title}</strong><p>${desc}</p></div><small>${tag}</small></div>`).join('')}</div></div>
 <section class="work-card review-item-pane"><div class="work-heading"><span>${ico('inbox',19)} Inbox klären</span><span class="quiet-tag">${list.length} offen</span></div>
 ${current?`<label class="sr-only" for="review-select">Inbox-Eintrag auswählen</label><select id="review-select" class="review-select">${list.map(r=>`<option value="${h(r.id)}" ${r.id===current.id?'selected':''}>${h(r.title)}</option>`).join('')}</select><p class="review-item-note">${current.note?h(current.note):'Noch keine zusätzliche Notiz hinterlegt.'}</p>`:'<div class="review-none">Deine Inbox ist leer. Erfasse neue Gedanken jederzeit über Quick Capture.</div>'}
 ${clarifyControls(current?.id)}
 <section class="review-next-section"><div class="work-heading"><span>${ico('folder',18)} Projekte & nächste Schritte</span><button type="button" class="text-link" data-tab="projects">Projekte prüfen ${ico('arrow',14)}</button></div>
 <div class="review-status-columns"><div><strong>${Object.values(state?.projects||{}).filter(x=>x.status==='active').length}</strong><span>aktive Projekte</span></div><div><strong>${nextActions(state).length}</strong><span>Next Actions</span></div><div><strong>${heldTasks(state).length}</strong><span>On Hold / Waiting</span></div></div>
 <button type="button" class="secondary-btn" data-tab="next">Next Actions ansehen</button> <button type="button" class="secondary-btn" data-tab="hold">Waiting For prüfen</button>
 <div class="project-review-queue"><strong>Projekte zur Durchsicht</strong>${Object.values(state?.projects||{}).filter(p=>projectNeedsReview(p)).length?Object.values(state?.projects||{}).filter(p=>projectNeedsReview(p)).map(p=>`<div class="review-project-row"><span>${h(p.title)} ${nextActions(state).some(t=>t.projectId===p.id)?'':' · keine verfügbare Next Action'}</span><button type="button" class="secondary-btn" data-action="project-reviewed" data-id="${h(p.id)}">Geprüft</button></div>`).join(''):'<p class="muted-line">Alle aktiven Projekte sind im aktuellen Review-Zyklus geprüft.</p>'}</div></section>
 <div class="compass-review-legend"><strong>Energie auf einen Blick</strong><div class="compass-energy-legend"><span class="energy-low">${ico('bolt',15)} Niedrig · ▰▱▱</span><span class="energy-medium">${ico('bolt',15)} Mittel · ▰▰▱</span><span class="energy-high">${ico('bolt',15)} Hoch · ▰▰▰</span></div><small>Visuelle Orientierung; die tatsächliche Zuordnung zur Aufgabe folgt in einem späteren GTD-Schritt.</small></div>
 <div class="review-ai-hint">${ico('spark',19)} <div><strong>Später: Lokaler KI-Vorschlag</strong><p>Compass kann bei der Klärung unterstützen, z. B. wenn aus einer wichtigen Aufgabe aufgrund einer näher rückenden harten Deadline auch eine dringliche wird. Die Entscheidung bleibt bei dir.</p></div></div>
 </section></div>`);
}

function systemScreen(){
 return chrome(`<div class="system-grid"><section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('cloud',22)}<h2>Cloud-Verbindung</h2></div></div><p class="module-subtitle">GitHub Pages · Cloudflare Worker · D1</p>
 <div class="connection-detail"><span class="connection-dot ${configured()?'green':'amber'}"></span><span>${configured()?'Konfiguration hinterlegt':'Google-Anmeldung noch nicht konfiguriert'}</span></div>
 <p class="small-muted">${configured()?'API: '+h(config.apiUrl):'In client/public/runtime-config.json sind noch Konfigurationswerte zu ergänzen.'}</p>
 <div id="google-button" class="google-button"></div><p class="small-muted">${authToken?'Compass-Sitzung aktiv: '+h(currentUser)+' · bleibt nach erneutem Tresor-Entsperren erhalten.':'Google-Anmeldung einmalig verknüpfen; danach wird die Compass-Sitzung verschlüsselt im Tresor gespeichert.'}</p><p class="small-muted">Automatisch: 7 Sekunden nach Änderungen und etwa alle 15 Minuten, solange Compass geöffnet und sichtbar ist. Manuell jederzeit über „Jetzt synchronisieren“.</p>
 <div class="system-actions"><button class="primary-btn" data-action="sync" ${!authToken||busy?'disabled':''}>${busy?'Synchronisiere …':'Jetzt synchronisieren'} ${ico('sync',16)}</button><button class="secondary-btn" data-action="logout" ${!authToken?'disabled':''}>Google trennen</button></div>
 <div class="mini-stats"><div><span>Wartende Änderungen</span><strong>${state.pending.length}</strong></div><div><span>Konflikte</span><strong>${state.conflicts.length}</strong></div><div><span>Sync-Cursor</span><strong>${state.cursor}</strong></div></div></section>
 <section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('shield',22)}<h2>Lokaler Tresor</h2></div></div><p class="module-subtitle">Verschlüsselt und offline nutzbar.</p>
 <div class="security-line">${ico('check',17)} AES-256-GCM verschlüsselte Speicherung</div><div class="security-line">${ico('check',17)} Passphrase bleibt auf deinem Gerät</div><div class="security-line">${ico('check',17)} Keine privaten Aufgaben in GitHub</div>
 <button class="secondary-btn full" data-action="export-encrypted">Verschlüsseltes Backup herunterladen</button><button class="secondary-btn full" data-action="export-json">Klartext-JSON exportieren</button><p class="small-muted">Klartext-Exporte enthalten unverschlüsselte private Inhalte.</p></section></div>
 ${state.conflicts.length?`<section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('sync',21)}<h2>Synchronisationskonflikte (${state.conflicts.length})</h2></div></div><p class="module-subtitle">Wähle bewusst die gewünschte Fassung.</p>${state.conflicts.map(c=>`<div class="conflict"><p><strong>Lokal:</strong> ${h(c.local?.title||'(gelöscht)')}</p><p><strong>Cloud:</strong> ${h(c.remote?.title||'(fehlt)')}</p>${c.local?.note||c.remote?.note?`<p class="small-muted"><strong>Notiz lokal:</strong> ${h(c.local?.note||'(leer)')} · <strong>Cloud:</strong> ${h(c.remote?.note||'(leer)')}</p>`:''}<div class="system-actions"><button class="secondary-btn" data-action="resolve-remote" data-id="${h(c.id)}">Cloud übernehmen</button><button class="primary-btn" data-action="resolve-local" data-id="${h(c.id)}">Meine Version behalten</button></div></div>`).join('')}</section>`:''}`);
}
function activityScreen(){
  const rows=watchSessions.map(x=>{
    const day=new Date(x.startedAt*1000).toLocaleString('de-AT',{dateStyle:'short',timeStyle:'short'});
    const mins=Math.round(x.durationSec/60);
    const heart=x.hrSamples?.length?Math.round(x.hrSamples.reduce((sum,p)=>sum+p[1],0)/x.hrSamples.length)+' bpm Ø':'–';
    const activityName=({Pruefungen:'Prüfungen',Pruefungskorrektur:'Prüfungskorrektur',Pruefungserstellung:'Prüfungserstellung',Lehre:'Lehre',Meeting:'Meetings'})[x.activity]||x.activity;
    const palette={Forschung:'#65BEC7',Lehre:'#D4B46C',Pruefungen:'#D99868',Pruefungskorrektur:'#D99868',Pruefungserstellung:'#D99868',Meeting:'#93A3AD',Verwaltung:'#86A4BA',Weiterbildung:'#B7A6CB',Familie:'#8FBC9F',Beziehungsdynamiken:'#C96B4B'};
    const color=palette[x.activity]||'#93A3AD';
    return `<div class="watch-session"><div><strong><span class="watch-cat-mark" style="background:${color}" aria-hidden="true"></span>${h(activityName)}</strong><small>${h(day)} · ${mins} Minuten · ${x.pomodoros} Pomodoros</small></div><span>♥ ${h(heart)} · BB ${x.bbStart==null?'–':x.bbStart} → ${x.bbEnd==null?'–':x.bbEnd} (${x.bbSamples?.length||0} Werte)</span></div>`;
  }).join('');
  return chrome(`<div class="watch-grid"><section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('activity',22)}<h2>Garmin Compass</h2></div></div>
   <p class="module-subtitle">Forschung, Lehre, Prüfungen, Meetings und weitere Tätigkeiten direkt auf der fēnix 7S erfassen.</p>
   <div class="watch-pair-block"><h3>Uhr koppeln</h3><p>Compass-Tresor und Google-Verbindung müssen entsperrt sein. Tippe auf „Kopplungscode erstellen“ und gib die acht Ziffern in der Garmin-App ein (UP/DOWN ändern, START bestätigt).</p>
   ${watchPairCode?`<div class="watch-code">${h(watchPairCode)}</div><small>Gültig bis ${h(new Date(watchPairExpires).toLocaleTimeString('de-AT'))}. Nicht öffentlich teilen.</small>`:''}
   <button class="primary-btn" type="button" data-action="watch-pair" ${!authToken?'disabled':''}>Kopplungscode erstellen</button></div>
   <div class="watch-device-list">${watchDevices.map(d=>`<div class="watch-session"><div><strong>${h(d.label)}</strong><small>Gekoppelt seit ${h(new Date(d.createdAt).toLocaleDateString('de-AT'))}</small></div><button type="button" class="secondary-btn" data-action="watch-revoke" data-id="${h(d.deviceHash)}">Trennen</button></div>`).join('')}</div>
   ${watchError?`<p class="watch-error">${h(watchError)}</p>`:''}
   <p class="small-muted">Für den Garmin-Prototyp wird eine eigene Connect-IQ-App benötigt. Ohne installierte Uhr-App zeichnet Compass noch nichts auf.</p></section>
   <section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('clock',22)}<h2>Aufgezeichnete Sessions</h2></div></div>
   <p class="module-subtitle">Herzfrequenzwerte sind Messungen der Uhr, Body Battery ist je nach Firmware verfügbar. Kein medizinischer Befund.</p>
   <button class="secondary-btn" type="button" data-action="watch-refresh" ${!authToken?'disabled':''}>Sessions aktualisieren</button>
   <div class="watch-session-list">${rows||'<div class="watch-empty">Noch keine Uhr-Sessions synchronisiert.</div>'}</div></section></div>`);
}
async function reloadWatchSessions(){
 if(!authToken)return;
 try{const [data,dev]=await Promise.all([request(config.apiUrl,authToken,'/api/watch/sessions'),request(config.apiUrl,authToken,'/api/watch/devices')]);watchSessions=data.sessions||[];watchDevices=dev.devices||[];watchError='';render();}
 catch(ex){watchError='Uhr-Daten derzeit nicht erreichbar ('+ex.message+').';render();}
}
function render(){
 if(!state){captureOverlayOpen=false;app.innerHTML=vaultScreen();bind();return;}
 app.innerHTML=tab==='activity'?activityScreen():tab==='system'?systemScreen():tab==='inbox'?inboxScreen():tab==='overview'?homeScreen():tab==='forecast'?forecastScreen():tab==='someday'?somedayScreen():tab==='review'?reviewScreen():tab==='projects'?projectScreen():['next','flagged','hold'].includes(tab)?workflowScreen(tab):todayScreen();bind();
 if(captureOverlayOpen)requestAnimationFrame(()=>app.querySelector('#capture-modal-input')?.focus());
 if(tab==='system'&&configured()&&!authToken)renderGoogleButton();
}
function bind() {
  app.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{tab=el.dataset.tab;notice='';error='';render();if((tab==='activity'||tab==='overview')&&authToken)reloadWatchSessions().catch(()=>{});});
  const vaultForm=app.querySelector('#vault-form');if(vaultForm)vaultForm.onsubmit=async ev=>{
    ev.preventDefault();const form=new FormData(vaultForm),p=String(form.get('passphrase')||'');
    try {if(hasVault){state=await vault.unlock(p);}else {if(p!==form.get('repeat'))throw new Error('Die Passphrasen stimmen nicht überein.');state=await vault.create(p);hasVault=true;}
      prepareTasks(state);
      if(captureAfterUnlock){captureOverlayOpen=true;captureAfterUnlock=false;}toast('Lokaler Tresor bereit.');
      resumeSession().catch(()=>{});}catch(ex){toast(ex.message,true);}
  };
  const reviewSelect=app.querySelector('#review-select');if(reviewSelect)reviewSelect.onchange=ev=>{selectedInboxId=ev.target.value;render();};
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
    const t={id:crypto.randomUUID(),title:String(fd.get('title')||'').trim(),note:'',plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',completed:false,archived:false,workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,updatedAt:stamp()};
    if(!validLocalTask(t)){toast('Aufgabenfelder prüfen (Titel, Datum oder Kategorie).',true);return;}
    await mutate(s=>{prepareTasks(s);s.tasks[t.id]=t;s.taskPending[t.id]=true;});selectedTaskId=t.id;toast('Aufgabe lokal gespeichert.');
  };
  const taskEditForm=app.querySelector('#task-edit-form');if(taskEditForm)taskEditForm.onsubmit=async ev=>{
    ev.preventDefault();const id=taskEditForm.dataset.id,fd=new FormData(taskEditForm);const existing=state.tasks[id];if(!existing)return;
    const t={...existing,title:String(fd.get('title')||'').trim(),note:String(fd.get('note')||'').trim(),plannedDate:fd.get('plannedDate')||null,dueDate:fd.get('dueDate')||null,category:fd.get('category')||'Allgemein',workflow:fd.get('workflow')||'next',flagged:fd.has('flagged'),projectId:fd.get('projectId')||null,tags:parseTags(fd.get('tags')),deferUntil:fd.get('deferUntil')||null,contextTags:parseTags(fd.get('contextTags')),estimateMinutes:fd.get('estimateMinutes')?Number(fd.get('estimateMinutes')):null,updatedAt:stamp()};
    if(!validLocalTask(t)){toast('Aufgabenfelder prüfen (Titel, Datum oder Kategorie).',true);return;}
    await mutate(s=>{s.tasks[id]=t;s.taskPending[id]=true;});toast('Aufgabe aktualisiert.');
  };
  const projectCreate=app.querySelector('#project-create-form');if(projectCreate)projectCreate.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(projectCreate);const project={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:'active',dueDate:null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7),reviewedAt:null};
    if(!validProject(project)){toast('Projektangaben prüfen.',true);return;}
    await mutate(s=>{s.projects[project.id]=project;s.projectPending[project.id]=true;});selectedProjectId=project.id;render();
  };
  const projectEdit=app.querySelector('#project-edit-form');if(projectEdit)projectEdit.onsubmit=async ev=>{
    ev.preventDefault();const id=projectEdit.dataset.id;const d=new FormData(projectEdit);const project={...state.projects[id],title:String(d.get('title')||'').trim(),outcome:String(d.get('outcome')||'').trim(),category:d.get('category')||'Allgemein',status:d.get('status')||'active',dueDate:d.get('dueDate')||null,reviewIntervalDays:Number(d.get('reviewIntervalDays')||7)};
    if(!validProject(project)){toast('Projektangaben prüfen.',true);return;}
    await mutate(s=>{s.projects[id]=project;s.projectPending[id]=true;});toast('Projekt gespeichert.');
  };
  const agendaForm=app.querySelector('#agenda-note-form');if(agendaForm)agendaForm.onsubmit=async ev=>{
    ev.preventDefault();const d=new FormData(agendaForm);const t={id:crypto.randomUUID(),title:String(d.get('title')||'').trim(),note:'',category:'Meeting',plannedDate:null,dueDate:null,workflow:'next',flagged:false,projectId:null,tags:parseTags([d.get('tag')]),completed:false,archived:false};
    if(!validLocalTask(t)){toast('Agendapunkt prüfen.',true);return;}
    await mutate(s=>{s.tasks[t.id]=t;s.taskPending[t.id]=true;});toast('Agendapunkt für das Meeting angelegt.');
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
  app.querySelectorAll('[data-action]').forEach(el=>el.onclick=ev=>{
    if(el.dataset.action==='capture-close-backdrop'&&ev.target!==el)return;
    runAction(el.dataset.action,el.dataset.id);
  });
}
async function runAction(action,id) {
  lastActivity=Date.now();
  try {
    if(action.startsWith('review-clarify:')){
      const workflow=action.split(':')[1],r=state?.records?.[id];if(!r||r.deleted||!['next','waiting','hold'].includes(workflow))return;
      if(r.title.length>180){toast('Bitte den Inbox-Titel zunächst auf 180 Zeichen kürzen.',true);return;}
      const task={id:crypto.randomUUID(),title:r.title,note:(r.note||'').slice(0,3000),plannedDate:null,dueDate:null,category:'Allgemein',completed:false,archived:false,workflow,flagged:false,projectId:null,tags:r.tags||[],contextTags:[],deferUntil:null,estimateMinutes:null,updatedAt:stamp()};
      if(!validLocalTask(task)){toast('Eintrag zuerst prüfen.',true);return;}
      await mutate(s=>{s.tasks[task.id]=task;s.taskPending[task.id]=true;s.records[id].deleted=true;s.records[id].updatedAt=stamp();s.pending.push(makeMutation(s.records[id]));});
      selectedTaskId=task.id;toast('Aus Inbox übernommen. Lokal gespeichert und Sync vorgemerkt.');return;
    }
    if(action.startsWith('review-energy:') || action.startsWith('review-attention:')){
       const [key,val]=action.split(':');
       if(!state?.records?.[id] || state.records[id].deleted)return;
       const options=key==='review-energy'?['low','medium','high']:['routine','clarity','deep'];
       if(!options.includes(val))return;
       await mutate(s=>{
         s.reviewMeta=s.reviewMeta||{};
         const old=s.reviewMeta[id]||{};
         s.reviewMeta[id]={...old,[key==='review-energy'?'energy':'attention']:val};
       });
       return;
    }
    if(action==='calendar-toggle-blocks'){showCalendarBlocks=!showCalendarBlocks;render();return;}
    if(action==='agenda-open'){selectedAgendaEventId=id;render();return;}
    if(action==='agenda-close'){selectedAgendaEventId=null;render();return;}
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
    if(action==='lock'){clearTimeout(syncTimer);calendarToken='';calendarEvents=[];calendarExpires=0;vault.lock();state=null;authToken='';currentUser='';notice='';error='';render();return;}
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
      const previous=authToken;authToken='';currentUser='';calendarToken='';calendarEvents=[];calendarExpires=0;clearTimeout(syncTimer);
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
 for(const id of Object.keys(state.projectPending).slice(0,75)){
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
  for(const id of Object.keys(state.taskPending).slice(0,75)){
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
async function syncNow() {
  if(!state||!authToken||busy||!navigator.onLine)return;
  clearTimeout(syncTimer);syncTimer=null;
  busy=true;render();
  try {
    const health=await request(config.apiUrl,authToken,'/api/health');
    if(health.apiVersion!==4||health.schema?.ready!==true)throw new Error(`Cloud-Datenbank noch nicht bereit: Worker 0.4.3 und Migration ${health.schema?.requiredMigration||'0005/0006'} prüfen. Lokale Änderungen bleiben sicher.`);
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
    lastSyncAt=Date.now();
    notice=state.conflicts.length?'Synchronisiert – bitte Konflikte prüfen.':'Synchronisiert. Alle verfügbaren Änderungen abgeglichen.';
    error='';
  }catch(ex){
    syncResyncRequested=false;
    error=ex.status===401?'Google-Sitzung abgelaufen. Bitte erneut anmelden.':`Synchronisation: ${ex.message}`;
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession().catch(()=>{});}
  }finally{
    busy=false;render();
    const retry=syncResyncRequested&&Boolean(state?.pending.length||Object.keys(state?.taskPending||{}).length||Object.keys(state?.projectPending||{}).length)&&Boolean(authToken)&&navigator.onLine&&!error;
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
    (state.pending.length||Object.keys(state.taskPending||{}).length||Date.now()-lastSyncAt>=SYNC_INTERVAL_MS))scheduleSync(1000);
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
