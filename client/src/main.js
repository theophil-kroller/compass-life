import './style.css';
import {registerSW} from 'virtual:pwa-register';
import * as vault from './vault.js';
import {request,nextBatch,applyResult,mergePulled,sameItemContent,pruneIdenticalConflicts} from './sync.js';

registerSW({immediate:true});
const app=document.getElementById('app');
let config={apiUrl:'',googleClientId:''};
let state=null, hasVault=false, authToken='', currentUser='', busy=false, notice='', error='', tab='today', lastActivity=Date.now();
let saveQueue=Promise.resolve();
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
let selectedDay=localDateString(new Date());
let selectedInboxId=null;
let showCaptureDetails=false;
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
if(['today','inbox','review','forecast','overview','someday','activity'].includes(bootView))tab=bootView;
if(bootCapture){captureAfterUnlock=true;tab='inbox';}

let watchPairCode='', watchPairExpires='', watchSessions=[], watchDevices=[], watchError='';
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
    const r={id:crypto.randomUUID(),title:cleanTitle,note:cleanNote,deleted:false,updatedAt:stamp()};
    s.records[r.id]=r;s.pending.push(makeMutation(r));s.history.push({type:'captured',at:stamp(),id:r.id});
  });
}

const stamp=()=>new Date().toISOString();
function makeMutation(record) {
  return {id:record.id,mutationId:crypto.randomUUID(),baseVersion:0,title:record.title,
    note:record.note,deleted:record.deleted};
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
 const title=tab==='today'&&selectedDay!==localDateString(new Date())?new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(new Date(`${selectedDay}T12:00:00`)):(({today:'Heute',forecast:'Forecast',someday:'Dreams',review:'Wochenreview',overview:'Übersicht',inbox:'Inbox',system:'System & Synchronisation',activity:'Aktivitäten'})[tab]||'Heute');
 const sub=({activity:'Aktivitäten, Zeit und Fokus. Auch von der Garmin.',today:'Was heute wirklich zählt.',forecast:'Termine und Verpflichtungen in den kommenden Tagen.',someday:'Someday / Maybe · Ein Raum für Ideen ohne Verpflichtung.',review:'Gedanken klären, Verpflichtungen prüfen und bewusst wählen.',overview:'Alle Lebensbereiche auf einen Blick.',inbox:'Alles erfassen. Später in Ruhe klären.',system:'Deine Geräteverbindung und Datensicherheit.'})[tab]||'';
 return `<div class="shell"><aside class="sidebar" aria-label="Navigation">
 <div class="brand"><span class="brand-icon">${ico('compass',24)}</span><span class="brand-name">Compass<small>Personal Life Manager</small></span></div>
 <nav class="side-nav" aria-label="Hauptnavigation">
 ${navItem('inbox','Inbox','inbox',{count:num})}
 ${navItem('today','Heute','sun')}${navItem('forecast','Forecast','calendar')}
 ${navItem('next','Next Actions','target',{disabled:true})}${navItem('review','Wochenreview','sync')}
 ${navItem('flagged','Flagged','flag',{disabled:true})}${navItem('hold','On Hold','pause',{disabled:true})}
 ${navItem('someday','Dreams','spark')}
 <div class="nav-separator"></div>
 ${navItem('projects','Projekte','folder',{disabled:true})}${navItem('people','Menschen','people',{disabled:true})}
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
 const skeleton='<div class="skeleton-lines"><div></div><div></div><div></div></div>';
 return `<div class="dashboard-grid">
 ${moduleCard({name:'Heute',iconName:'sun',cls:'grid-today',sub:'Deine Tagesübersicht',action:'Tagesansicht',body:`<div class="today-placeholder">${ico('calendar',28)}<span>Keine Tagesplanung vorhanden</span><small>Termine und Aktionen erscheinen hier.</small></div>`})}
 ${moduleCard({name:'Nächste Empfehlung',iconName:'spark',cls:'grid-next',sub:'Dein nächster sinnvoller Schritt',body:`<div class="recommend-placeholder"><span class="little-overline">NÄCHSTE AKTION</span><div class="recommend-icon">${ico('target',24)}</div><strong>Noch keine Empfehlung</strong><p>Hier erscheint später eine passende nächste Handlung.</p><button class="primary-btn disabled-primary" disabled>Fokus starten ${ico('arrow',15)}</button></div>`})}
 ${captureCard(locked)}
 ${inboxPreview()}
 ${moduleCard({name:'Wochenreview',iconName:'sync',cls:'grid-review',sub:'Klarheit gewinnen. Regelmäßig.',action:'Review öffnen',body:`<div class="review-steps"><div><span class="ring"></span>Eingang klären</div><div><span class="ring"></span>Projekte durchsehen</div><div><span class="ring"></span>Neue Woche planen</div></div>`})}
 ${moduleCard({name:'Projekte',iconName:'folder',cls:'grid-projects',sub:'Alle Vorhaben an einem Ort',action:'Projekte öffnen',body:`<div class="project-skeleton"><div><i></i><span></span><b></b></div><div><i></i><span></span><b></b></div><div><i></i><span></span><b></b></div></div><div class="quiet-bottom">Noch keine Projekte angelegt</div>`})}
 ${moduleCard({name:'Kalender & Fokus',iconName:'calendar',cls:'grid-calendar',sub:'Raum für das Wesentliche',body:`<div class="calendar-preview"><span>09:00</span><div></div><span>11:00</span><div></div><span>14:00</span><div></div></div><p class="quiet-bottom">Keine Kalenderdaten verbunden</p>`})}
 ${moduleCard({name:'Fortschritt',iconName:'activity',cls:'grid-progress',sub:'Entwicklung sichtbar machen',body:`<div class="ring-row"><div class="ring-unit"><span class="donut">–</span><small>Ziele</small></div><div class="ring-unit"><span class="donut">–</span><small>Gewohnheiten</small></div><div class="ring-unit"><span class="donut">–</span><small>Fokuszeit</small></div></div>`})}
 ${moduleCard({name:'Menschen',iconName:'people',cls:'grid-people',sub:'Offene Gespräche & Kontakte',body:`<div class="people-preview"><span class="people-circles"><i></i><i></i><i></i></span><p>Keine Personen erfasst</p></div>`})}
 ${moduleCard({name:'Activity Tracking',iconName:'activity',cls:'grid-activity',active:true,sub:'Garmin · Fokuszeit · Pomodoro',body:watchSessions.length?`<div class="activity-stat"><strong>${Math.round(watchSessions.reduce((sum,s)=>sum+s.focusSec,0)/3600*10)/10} h</strong> erfasste Fokuszeit · ${watchSessions.length} Sessions</div>`:placeholder('Noch keine Uhr-Sessions synchronisiert.')}).replace('</section>',`<button class="text-link" type="button" data-tab="activity">Aktivitäten ansehen ${ico('arrow',14)}</button></section>`)}
 ${moduleCard({name:'Erholung',iconName:'heart',cls:'grid-recovery',sub:'Energie & Schlaf im Blick',body:`<div class="energy-placeholder"><span class="donut big">–</span><div><span>${ico('moon',14)} Schlaf</span><span>${ico('heart',14)} Erholung</span><span>${ico('activity',14)} Energie</span></div></div>`})}
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
 <section class="work-card appointments"><div class="work-heading"><span>${ico('calendar',18)} Termine ${selected?'heute':h(dayFormat(new Date(`${selectedDay}T12:00:00`)))}</span><span class="quiet-tag">Google Kalender nicht verbunden</span></div>
 <div class="appointments-empty"><span>${ico('calendar',21)}</span><div><strong>Keine Kalendertermine verfügbar</strong><small>Nach dem Verknüpfen erscheinen hier deine echten Termine – ohne Aufgaben in Google Calendar einzutragen.</small></div></div></section>
 <section class="work-card today-tasks"><div class="work-heading"><span>${ico('list',18)} Meine Aufgaben ${selected?'für heute':'für diesen Tag'}</span><span class="quiet-tag">Manuelle Reihenfolge</span></div>
 <div class="today-tasks-empty">${ico('target',36)}<h2>${locked?'Deine Tagesplanung bleibt geschützt.':'Noch keine Aufgaben ausgewählt.'}</h2><p>${locked?'Entsperre deinen Tresor. Die Tagesliste wird später aus deinen bewusst eingeplanten Next Actions zusammengestellt.':'Hier planst du künftig die Reihenfolge deiner Next Actions per Drag-and-drop. Inbox-Einträge werden nicht automatisch zu Tagesaufgaben.'}</p><button type="button" class="soft-button" disabled>+ Aufgabe für diesen Tag planen</button></div>
 <div class="capture-inline"><form id="capture-form"><label class="sr-only" for="capture">Schnell in die Inbox erfassen</label><input id="capture" name="title" maxlength="1000" required placeholder="Gedanken sofort in der Inbox festhalten …" ${locked?'disabled':''}/><button type="submit" class="primary-btn" ${locked?'disabled':''}>${ico('plus',17)} Erfassen</button></form><small>Ohne Projekt, Datum oder Priorität – erst einmal sicher erfasst.</small></div></section>
 <div class="below-today"><section class="work-card deadline-card"><div class="work-heading"><span>${ico('flag',18)} Fristen & Vorausschau</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">Keine Fristen erfasst. Wunschtermin und harte Deadline bleiben getrennt.</div></section>
 <section class="work-card review-card"><div class="work-heading"><span>${ico('sync',18)} Review</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">Offene Schleifen werden später regelmäßig geprüft – ohne künstliche Deadlines.</div></section></div>
 </div><aside class="inspector-rail" aria-label="Aufgabendetails und Personen-Kontext"><section class="work-card inspector-card"><div class="work-heading"><span>${ico('checkSquare',18)} Aufgabendetails</span><span class="quiet-tag">Vorschau</span></div>
 <div class="inspector-placeholder">${ico('target',27)}<strong>Keine Aufgabe ausgewählt</strong><span>Wenn du eine Aufgabe auswählst, erscheinen hier ihre Angaben.</span></div>${datesPreview()}
 <div class="inspector-other"><span>Projekt</span><b>–</b><span>Kontext</span><b>–</b><span>Personen</span><b>–</b><span>Aufwand</span><b>–</b></div></section>
 <section class="work-card person-preview"><div class="work-heading"><span>${ico('people',18)} Offene Gesprächsthemen</span><span class="quiet-tag">–</span></div><div class="preview-empty-small">Person auswählen → alle offenen Agenda-Punkte sehen. Personen-Agendas folgen im GTD-Ausbau.</div></section>
 <section class="work-card energy-context"><div class="work-heading"><span>${ico('bolt',18)} Energie & Kontext</span><span class="quiet-tag">Planungsfilter</span></div><div class="energy-levels" aria-label="Energiestufen (Vorschau)"><button disabled type="button">Wenig</button><button disabled type="button">Mittel</button><button disabled type="button">Viel</button></div><p class="energy-hint">Wenn du erschöpft oder blockiert bist, zeigt Compass später kleine, passende Next Actions – statt dir zusätzliche Aufgaben aufzudrängen.</p></section>
 <button type="button" class="overview-nudge" data-tab="overview">${ico('layers',17)} Große Übersicht ansehen ${ico('arrow',14)}</button></aside></div>`;
}
function forecastScreen(){return chrome(`${calendarRail()}<section class="forecast-full work-card"><div class="work-heading"><span>${ico('calendar',21)} Forecast – die nächsten Tage</span><span class="quiet-tag">Vorschau</span></div>${Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return `<div class="forecast-day-row"><span>${h(new Intl.DateTimeFormat('de-AT',{weekday:'long',day:'numeric',month:'long'}).format(d))}</span><small>Keine geplanten Aufgaben oder Kalendertermine verfügbar</small></div>`;}).join('')}<p class="rail-footnote">Forecast vereint später echte Kalendertermine, harte Fristen und bewusst geplante Next Actions – die Kalenderdaten werden nicht mit Aufgaben überschrieben.</p></section>` .replace(/^/, '<div class="forecast-layout">') .concat('</div>'));}
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
 tab=['inbox','forecast','overview','someday','review','activity'].includes(tab)?'today':tab;
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
 const list=query?fullList.filter(r=>`${r.title} ${r.note||''}`.toLocaleLowerCase('de').includes(query)):fullList;
 const current=list.find(r=>r.id===selectedInboxId)||list[0]||null;
 return chrome(`<div class="inbox-mvp-layout"><section class="module-card module-active inbox-mvp-card">
 <div class="inbox-mvp-head"><div><p class="capture-eyebrow">VERLÄSSLICHER EINGANG</p><h2>Deine Inbox <span class="count">${fullList.length}</span></h2><p>Alles sammeln. Noch nichts entscheiden müssen.</p></div><button type="button" class="primary-btn" data-action="capture-focus">${ico('plus',17)} Erfassen</button></div>
 <div class="inbox-search-box">${ico('search',17)}<input id="inbox-query" type="search" placeholder="Inbox durchsuchen …" value="${h(inboxQuery)}" autocomplete="off" aria-label="Inbox durchsuchen"/></div>
 <div class="inbox-mvp-list">
 ${list.length?list.map(r=>`<button type="button" class="inbox-mvp-row ${current?.id===r.id?'is-current':''}" data-action="select-inbox" data-id="${h(r.id)}"><span class="inbox-list-mark">${ico('inbox',16)}</span><span class="inbox-list-copy"><strong>${h(r.title)}</strong>${r.note?`<small class="item-preview">${h(r.note)}</small>`:''}<small>${date(r.updatedAt)}</small></span><span class="inbox-list-sync ${state.pending.some(p=>p.id===r.id)?'needs-sync':''}" title="${state.pending.some(p=>p.id===r.id)?'Noch nicht synchronisiert':'Keine lokalen Änderungen ausstehend'}">${state.pending.some(p=>p.id===r.id)?ico('cloud',14):ico('check',14)}</span></button>`).join(''):
 `<div class="inbox-mvp-empty">${ico(query?'search':'inbox',32)}<strong>${query?'Keine passenden Einträge':'Dein Kopf darf leerer werden.'}</strong><span>${query?'Versuche einen anderen Suchbegriff.':'Halte hier alles fest, was dir im Alltag begegnet.'}</span></div>`}
 </div><div class="inbox-mvp-bottom"><span>${state.pending.length} ausstehende Änderungen</span><button type="button" class="review-link" data-tab="review">Wochenreview ${ico('arrow',14)}</button></div></section>
 <aside class="module-card module-active inbox-mvp-detail">${current?
 `<div class="inbox-detail-top"><span class="capture-eyebrow">EINTRAG · INBOX</span><span class="inbox-detail-date">${date(current.updatedAt)}</span></div><form id="inbox-edit-form" data-id="${h(current.id)}"><label for="inbox-edit-title">Gedanke</label><textarea id="inbox-edit-title" name="title" maxlength="1000" rows="3" required>${h(current.title)}</textarea><label for="inbox-edit-note">Notizen, Links, Kontext</label><textarea id="inbox-edit-note" name="note" maxlength="10000" rows="7" placeholder="Optional – für den späteren Review">${h(current.note||'')}</textarea><div class="inbox-detail-actions"><button type="submit" class="primary-btn">Änderungen speichern</button><button type="button" class="secondary-btn" data-action="remove" data-id="${h(current.id)}">Archivieren</button></div></form><div class="inbox-detail-next">${ico('target',18)}<div><strong>Später klären</strong><p>Im Wochenreview wird daraus eine Next Action, ein Projekt, eine Agenda oder Dreams. Bis dahin bleibt dieser Gedanke zuverlässig in der Inbox.</p><button type="button" class="review-link" data-tab="review">Zum Review ${ico('arrow',14)}</button></div></div>`:
 `<div class="inbox-mvp-empty detail-empty">${ico('pencil',32)}<strong>Ein Gedanke genügt.</strong><span>Öffne die Schnellerfassung und halte fest, was dich beschäftigt.</span></div>`}</aside></div>`);
}

function clarifyControls(){
 return `<div class="clarify-options" aria-label="Künftige Klärungskategorien (Vorschau)"><div class="clarify-choice"><h3>Wohin gehört es?</h3><div class="choice-row">${['Next Action','Projekt','Agenda / Person','Waiting For','Dreams','Referenz'].map(x=>`<button type="button" disabled class="choice-pill">${h(x)}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Wie viel Energie braucht es?</h3><div class="choice-row">${['Low Energy','Medium Energy','High Energy'].map(x=>`<button type="button" disabled class="choice-pill">${h(x)}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Welche Art von Aufmerksamkeit?</h3><div class="choice-row">${['Routine','Geistige Klarheit','Tiefes Denken'].map(x=>`<button type="button" disabled class="choice-pill">${h(x)}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Wichtigkeit & Dringlichkeit</h3><p class="clarify-tip">Zwei getrennte Dimensionen. Dringlichkeit kann sich ändern, ohne dass ein Ziel wichtiger wird.</p><div class="choice-row">${['Wichtig: hoch / mittel / niedrig','Dringend: ja / nein'].map(x=>`<button type="button" disabled class="choice-pill">${h(x)}</button>`).join('')}</div></div>
 <div class="clarify-choice"><h3>Termine (nur bei Bedarf)</h3><div class="choice-row">${['Frühestens ab','Wunschtermin','Harte Deadline','Wiedervorlage'].map(x=>`<button type="button" disabled class="choice-pill">${h(x)}</button>`).join('')}</div></div>
 </div>`;
}
function reviewScreen(){
 const list=rows();const current=list.find(r=>r.id===selectedInboxId)||list[0]||null;
 return chrome(`<div class="guided-review"><div class="review-flow work-card"><div class="work-heading"><span>${ico('sync',20)} Dein Weekly Review</span><span class="quiet-tag">Geführte Vorschau</span></div>
 <p class="review-explainer">Nicht alles muss sofort geklärt werden. Einmal pro Woche bringst du die offenen Schleifen systematisch auf den aktuellen Stand.</p>
 <div class="review-flow-steps">${[
 ['1','Eingang leeren','Jeden erfassten Gedanken klären oder bewusst parken.',String(list.length)+' offene Einträge'],
 ['2','Nächste Schritte','Projekte, Next Actions und offene Entscheidungen prüfen.','Noch nicht aktiv'],
 ['3','Waiting For & Agendas','Worauf wartest du? Mit wem gibt es Gesprächsbedarf?','Noch nicht aktiv'],
 ['4','Termine & Fristen','Vergangene und kommende Kalendertermine ansehen.','Noch nicht verbunden'],
 ['5','Dreams & Möglichkeiten','Ideen freiwillig sichten, ohne neue Verpflichtungen.','Nur auf Wunsch']
 ].map(([n,title,desc,tag],i)=>`<div class="review-flow-step ${i===0?'review-step-current':''}"><span class="review-step-number">${n}</span><div><strong>${title}</strong><p>${desc}</p></div><small>${tag}</small></div>`).join('')}</div></div>
 <section class="work-card review-item-pane"><div class="work-heading"><span>${ico('inbox',19)} Inbox klären</span><span class="quiet-tag">${list.length} offen</span></div>
 ${current?`<label class="sr-only" for="review-select">Inbox-Eintrag auswählen</label><select id="review-select" class="review-select">${list.map(r=>`<option value="${h(r.id)}" ${r.id===current.id?'selected':''}>${h(r.title)}</option>`).join('')}</select><p class="review-item-note">${current.note?h(current.note):'Noch keine zusätzliche Notiz hinterlegt.'}</p>`:'<div class="review-none">Deine Inbox ist leer. Erfasse neue Gedanken jederzeit über Quick Capture.</div>'}
 ${clarifyControls()}
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
 app.innerHTML=tab==='activity'?activityScreen():tab==='system'?systemScreen():tab==='inbox'?inboxScreen():tab==='overview'?homeScreen():tab==='forecast'?forecastScreen():tab==='someday'?somedayScreen():tab==='review'?reviewScreen():todayScreen();bind();
 if(captureOverlayOpen)requestAnimationFrame(()=>app.querySelector('#capture-modal-input')?.focus());
 if(tab==='system'&&configured()&&!authToken)renderGoogleButton();
}
function bind() {
  app.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{tab=el.dataset.tab;notice='';error='';render();if(tab==='activity'&&authToken)reloadWatchSessions().catch(()=>{});});
  const vaultForm=app.querySelector('#vault-form');if(vaultForm)vaultForm.onsubmit=async ev=>{
    ev.preventDefault();const form=new FormData(vaultForm),p=String(form.get('passphrase')||'');
    try {if(hasVault){state=await vault.unlock(p);}else {if(p!==form.get('repeat'))throw new Error('Die Passphrasen stimmen nicht überein.');state=await vault.create(p);hasVault=true;}
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
  const editForm=app.querySelector('#inbox-edit-form');if(editForm)editForm.onsubmit=async ev=>{
    ev.preventDefault();const id=editForm.dataset.id;const form=new FormData(editForm);
    const title=String(form.get('title')||'').trim(),note=String(form.get('note')||'').trim();
    if(!title||title.length>1000||note.length>10000){toast('Bitte Titel und Notizlänge prüfen.',true);return;}
    const existing=state.records[id];if(!existing)return;
    if(existing.title===title&&(existing.note||'')===note){notice='Keine Änderungen.';render();return;}
    try{await mutate(s=>{const r=s.records[id];r.title=title;r.note=note;r.updatedAt=stamp();s.pending.push(makeMutation(r));});notice='Änderungen lokal gespeichert.';render();}
    catch(ex){toast(ex.message,true);}
  };
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
    if(action==='lock'){clearTimeout(syncTimer);vault.lock();state=null;authToken='';currentUser='';notice='';error='';render();return;}
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
      const previous=authToken;authToken='';currentUser='';clearTimeout(syncTimer);
      await vault.clearSession();
      try {if(previous)await request(config.apiUrl,previous,'/api/session',{method:'DELETE'});
        toast('Compass-Sitzung auf diesem Gerät beendet. Lokale Daten bleiben geschützt.');}
      catch {toast('Lokal abgemeldet. Serverseitiger Widerruf gerade nicht erreichbar – bitte bei Gelegenheit erneut verbinden und abmelden.',true);}
      return;
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
          if(c.remote){s.records[id]={id,title:c.remote.title,note:c.remote.note,deleted:c.remote.deleted,updatedAt:c.remote.updatedAt};s.serverVersions[id]=c.remote.version;}
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
async function syncNow() {
  if(!state||!authToken||busy||!navigator.onLine)return;
  clearTimeout(syncTimer);syncTimer=null;
  busy=true;render();
  try {
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
    lastSyncAt=Date.now();
    notice=state.conflicts.length?'Synchronisiert – bitte Konflikte prüfen.':'Synchronisiert. Alle verfügbaren Änderungen abgeglichen.';
    error='';
  }catch(ex){
    syncResyncRequested=false;
    error=ex.status===401?'Google-Sitzung abgelaufen. Bitte erneut anmelden.':`Synchronisation: ${ex.message}`;
    if(ex.status===401){authToken='';currentUser='';await vault.clearSession().catch(()=>{});}
  }finally{
    busy=false;render();
    const retry=syncResyncRequested&&Boolean(state?.pending.length)&&Boolean(authToken)&&navigator.onLine&&!error;
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
    (state.pending.length||Date.now()-lastSyncAt>=SYNC_INTERVAL_MS))scheduleSync(1000);
});
setInterval(()=>{
  if(state&&authToken&&navigator.onLine&&document.visibilityState==='visible'&&
     Date.now()-lastSyncAt>=SYNC_INTERVAL_MS&&!busy)scheduleSync(0);
},60000);
window.addEventListener('offline',render);
for(const e of ['pointerdown','keydown','touchstart'])document.addEventListener(e,()=>{lastActivity=Date.now();},{passive:true});
setInterval(()=>{if(state&&Date.now()-lastActivity>15*60*1000){clearTimeout(syncTimer);vault.lock();state=null;authToken='';currentUser='';notice='Nach 15 Minuten Inaktivität automatisch gesperrt.';render();}},60000);
(async()=>{
  try{config=await fetch(`${import.meta.env.BASE_URL}runtime-config.json`,{cache:'no-store'}).then(r=>r.json());}
  catch{config={};}
  hasVault=await vault.exists();if(bootCapture&&hasVault){captureAfterUnlock=true;}render();if(bootCapture)history.replaceState(null,'',location.pathname);
})().catch(ex=>{app.innerHTML=`<div class="fatal">Lokaler Speicher nicht verfügbar: ${h(ex.message)}. Bitte einen sicheren Browserkontext verwenden.</div>`;});
