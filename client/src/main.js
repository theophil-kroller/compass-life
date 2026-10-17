import './style.css';
import {registerSW} from 'virtual:pwa-register';
import * as vault from './vault.js';
import {request,nextBatch,applyResult,mergePulled} from './sync.js';

registerSW({immediate:true});
const app=document.getElementById('app');
let config={apiUrl:'',googleClientId:''};
let state=null, hasVault=false, authToken='', currentUser='', busy=false, notice='', error='', tab='home', lastActivity=Date.now();
let saveQueue=Promise.resolve();
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
  if(!state||busy)return;
  fn(state);await persist();render();
  if(authToken&&navigator.onLine) syncNow().catch(()=>{});
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
 return `<div class="shell"><aside class="sidebar" aria-label="Navigation">
 <div class="brand"><span class="brand-icon">${ico('compass',24)}</span><span class="brand-name">Compass<small>Personal Life Manager</small></span></div>
 <nav class="side-nav" aria-label="Hauptnavigation">
 ${navItem('home','Übersicht','home')}${navItem('inbox','Inbox','inbox',{count:num})}
 ${navItem('next','Next Actions','target',{disabled:true})}${navItem('review','Wochenreview','sync',{disabled:true})}
 ${navItem('projects','Projekte','folder',{disabled:true})}${navItem('calendar','Kalender & Fokus','calendar',{disabled:true})}
 ${navItem('progress','Fortschritt','activity',{disabled:true})}${navItem('people','Menschen','people',{disabled:true})}
 ${navItem('recovery','Erholung','heart',{disabled:true})}
 <div class="nav-separator"></div>${navItem('system','System & Sync','settings')}
 </nav><div class="sidebar-foot">${ico('shield',16)} <span>Dein persönlicher Arbeitsraum</span></div>
 </aside><main class="workspace"><div class="utility-bar"><div class="search-shell" aria-label="Suche noch nicht verfügbar">${ico('search',17)}<span>In Compass suchen</span><kbd>⌘ K</kbd></div>
 <div class="utility-right"><span class="connection"><span class="connection-dot ${state?(navigator.onLine?'green':'amber'):'gray'}"></span><span>${state?(authToken?'Google angemeldet':navigator.onLine?'Lokal entsperrt':'Offline · lokal'):'Tresor gesperrt'}</span></span>
 <span class="avatar" aria-label="Persönlicher Arbeitsbereich">${ico('compass',18)}</span>${state?`<button class="icon-utility" type="button" data-action="lock" title="Tresor sperren" aria-label="Tresor sperren">${ico('lock',19)}</button>`:''}</div></div>
 <div class="content"><div class="page-intro"><div><p class="page-overline">PERSÖNLICHER KOMPASS</p><h1>${tab==='home'?'Dein Tag, im Blick.':tab==='inbox'?'Inbox': 'System & Synchronisation'}</h1><p class="intro-subtitle">${tab==='home'?'Weniger im Kopf behalten. Mehr Raum zum Handeln.':tab==='inbox'?'Alles erfassen. Das Wesentliche später klären.':'Dein Datenfundament und deine Geräteverbindung.'}</p></div><div class="today-label">${h(today)}<span>${state?'Lokaler Tresor entsperrt':'Lokaler Tresor gesperrt'}</span></div></div>
 ${notice?`<div role="status" class="alert good">${h(notice)}</div>`:''}${error?`<div role="alert" class="alert bad">${h(error)}</div>`:''}
 ${content}<footer>Compass · Private Beta · Lokal verschlüsselt ${ico('shield',13)}</footer></div></main></div>`;
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
 ${moduleCard({name:'Erholung',iconName:'heart',cls:'grid-recovery',sub:'Energie & Schlaf im Blick',body:`<div class="energy-placeholder"><span class="donut big">–</span><div><span>${ico('moon',14)} Schlaf</span><span>${ico('heart',14)} Erholung</span><span>${ico('activity',14)} Energie</span></div></div>`})}
 </div>`;
}
function vaultScreen(){
 tab='home';
 return chrome(`<section class="vault-banner" aria-label="Lokalen Tresor einrichten"><div class="vault-banner-copy"><div class="banner-symbol">${ico('lock',22)}</div><span class="little-overline">DEIN PRIVATER ARBEITSRAUM</span><h2>${hasVault?'Willkommen zurück.':'Dein Compass ist bereit.'}</h2><p>${hasVault?'Entsperre deinen persönlichen Tresor, um deine Daten zu sehen.':'Richte einmalig deinen verschlüsselten lokalen Tresor ein. Die Daten bleiben auf diesem Gerät geschützt.'}</p></div>
 <form class="vault-form" id="vault-form" autocomplete="off"><label for="passphrase">${hasVault?'Passphrase eingeben':'Neue Passphrase (mind. 12 Zeichen)'}</label><input id="passphrase" name="passphrase" type="password" required minlength="12" placeholder="••••••••••••" autocomplete="off" />
 ${!hasVault?'<label for="passphrase-repeat">Passphrase wiederholen</label><input id="passphrase-repeat" name="repeat" type="password" minlength="12" required autocomplete="off" placeholder="••••••••••••"/>':''}
 <button class="primary-btn wide" type="submit">${hasVault?'Tresor entsperren':'Tresor einrichten'} ${ico('arrow',16)}</button>
 ${!hasVault?'<label class="restore-label" for="encrypted-import">Verschlüsseltes Backup importieren</label><input id="encrypted-import" type="file" accept="application/json"/>':''}</form></section>
 ${dashboardCards(true)}`);
}
function homeScreen(){return chrome(dashboardCards());}
function inboxScreen(){
 const list=rows();
 return chrome(`<div class="inbox-layout"><section class="module-card module-active inbox-capture-large"><div class="module-head"><div class="module-title">${ico('pencil',22)}<h2>Quick Capture</h2></div></div><p class="module-subtitle">Einfach erfassen – strukturieren kannst du später.</p>
 <form id="capture-form"><label for="capture">Was möchtest du festhalten?</label><textarea id="capture" name="title" maxlength="1000" rows="5" placeholder="Was beschäftigt dich gerade?" required></textarea><button class="primary-btn wide" type="submit">Zur Inbox hinzufügen ${ico('arrow',16)}</button></form></section>
 <section class="module-card module-active inbox-items-large"><div class="module-head"><div class="module-title">${ico('inbox',22)}<h2>Deine Inbox</h2><span class="count">${list.length}</span></div></div><p class="module-subtitle">Alles, was noch auf Klärung wartet.</p>
 ${list.length?`<div class="full-items">${list.map(r=>`<div class="inbox-row"><span class="tiny-square"></span><div class="item-text"><strong>${h(r.title)}</strong><small>${date(r.updatedAt)} · ${state.pending.some(p=>p.id===r.id)?'Synchronisation ausstehend':'Lokal gespeichert'}</small></div><button class="icon-button" type="button" data-action="edit" data-id="${h(r.id)}" aria-label="Eintrag bearbeiten" title="Bearbeiten">${ico('pencil',17)}</button><button class="icon-button" type="button" data-action="remove" data-id="${h(r.id)}" aria-label="Eintrag archivieren" title="Archivieren">${ico('check',18)}</button></div>`).join('')}</div>`:placeholder('Deine Inbox ist leer. Ein guter Anfang.')}
 </section></div>`);
}
function systemScreen(){
 return chrome(`<div class="system-grid"><section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('cloud',22)}<h2>Cloud-Verbindung</h2></div></div><p class="module-subtitle">GitHub Pages · Cloudflare Worker · D1</p>
 <div class="connection-detail"><span class="connection-dot ${configured()?'green':'amber'}"></span><span>${configured()?'Konfiguration hinterlegt':'Google-Anmeldung noch nicht konfiguriert'}</span></div>
 <p class="small-muted">${configured()?'API: '+h(config.apiUrl):'In client/public/runtime-config.json sind noch Konfigurationswerte zu ergänzen.'}</p>
 <div id="google-button" class="google-button"></div><p class="small-muted">${authToken?'Angemeldet: '+h(currentUser):'Google-Anmeldung bleibt bis zur Konfiguration deaktiviert. Deine lokalen Daten sind unabhängig davon nutzbar.'}</p>
 <div class="system-actions"><button class="primary-btn" data-action="sync" ${!authToken||busy?'disabled':''}>${busy?'Synchronisiere …':'Jetzt synchronisieren'} ${ico('sync',16)}</button><button class="secondary-btn" data-action="logout" ${!authToken?'disabled':''}>Google trennen</button></div>
 <div class="mini-stats"><div><span>Wartende Änderungen</span><strong>${state.pending.length}</strong></div><div><span>Konflikte</span><strong>${state.conflicts.length}</strong></div><div><span>Sync-Cursor</span><strong>${state.cursor}</strong></div></div></section>
 <section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('shield',22)}<h2>Lokaler Tresor</h2></div></div><p class="module-subtitle">Verschlüsselt und offline nutzbar.</p>
 <div class="security-line">${ico('check',17)} AES-256-GCM verschlüsselte Speicherung</div><div class="security-line">${ico('check',17)} Passphrase bleibt auf deinem Gerät</div><div class="security-line">${ico('check',17)} Keine privaten Aufgaben in GitHub</div>
 <button class="secondary-btn full" data-action="export-encrypted">Verschlüsseltes Backup herunterladen</button><button class="secondary-btn full" data-action="export-json">Klartext-JSON exportieren</button><p class="small-muted">Klartext-Exporte enthalten unverschlüsselte private Inhalte.</p></section></div>
 ${state.conflicts.length?`<section class="module-card module-active"><div class="module-head"><div class="module-title">${ico('sync',21)}<h2>Synchronisationskonflikte (${state.conflicts.length})</h2></div></div><p class="module-subtitle">Wähle bewusst die gewünschte Fassung.</p>${state.conflicts.map(c=>`<div class="conflict"><p><strong>Lokal:</strong> ${h(c.local?.title||'(gelöscht)')}</p><p><strong>Cloud:</strong> ${h(c.remote?.title||'(fehlt)')}</p><div class="system-actions"><button class="secondary-btn" data-action="resolve-remote" data-id="${h(c.id)}">Cloud übernehmen</button><button class="primary-btn" data-action="resolve-local" data-id="${h(c.id)}">Meine Version behalten</button></div></div>`).join('')}</section>`:''}`);
}
function render(){
 if(!state){app.innerHTML=vaultScreen();bind();return;}
 app.innerHTML=tab==='system'?systemScreen():tab==='inbox'?inboxScreen():homeScreen();bind();
 if(tab==='system'&&configured()&&!authToken)renderGoogleButton();
}
function bind() {
  app.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{tab=el.dataset.tab;notice='';error='';render();});
  const vaultForm=app.querySelector('#vault-form');if(vaultForm)vaultForm.onsubmit=async ev=>{
    ev.preventDefault();const form=new FormData(vaultForm),p=String(form.get('passphrase')||'');
    try {if(hasVault){state=await vault.unlock(p);}else {if(p!==form.get('repeat'))throw new Error('Die Passphrasen stimmen nicht überein.');state=await vault.create(p);hasVault=true;}
      toast('Lokaler Tresor bereit.');}catch(ex){toast(ex.message,true);}
  };
  const importField=app.querySelector('#encrypted-import');if(importField)importField.onchange=async ev=>{
    try {const obj=JSON.parse(await ev.target.files[0].text());await vault.importEncrypted(obj);hasVault=true;toast('Backup importiert. Jetzt mit der ursprünglichen Passphrase entsperren.');}
    catch(ex){toast(ex.message,true);}
  };
  const capture=app.querySelector('#capture-form');if(capture)capture.onsubmit=async ev=>{
    ev.preventDefault();const value=String(new FormData(capture).get('title')||'').trim();if(!value)return;
    await mutate(s=>{const r={id:crypto.randomUUID(),title:value,note:'',deleted:false,updatedAt:stamp()};
      s.records[r.id]=r;s.pending.push(makeMutation(r));s.history.push({type:'captured',at:stamp(),id:r.id});});
    notice='Erfasst und verschlüsselt gespeichert.';render();
  };
  app.querySelectorAll('[data-action]').forEach(el=>el.onclick=()=>runAction(el.dataset.action,el.dataset.id));
}
async function runAction(action,id) {
  lastActivity=Date.now();
  try {
    if(action==='lock'){vault.lock();state=null;authToken='';currentUser='';notice='';error='';render();return;}
    if(action==='sync'){await syncNow();return;}
    if(action==='logout'){authToken='';currentUser='';toast('Von Google getrennt. Lokale Daten bleiben geschützt.');return;}
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
          s.pending.push(makeMutation(s.records[id]));
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
      authToken=response.credential;
      try {
        const who=await request(config.apiUrl,authToken,'/api/me');currentUser=who.email;
        toast('Google-Anmeldung erfolgreich.');await syncNow();
      }catch(ex){authToken='';currentUser='';toast(ex.status===401?'Dieses Google-Konto ist nicht freigeschaltet.':ex.message,true);}
    },auto_select:false});
    window.google.accounts.id.renderButton(root,{theme:'outline',size:'large',type:'standard',text:'signin_with',shape:'rectangular'});
  }catch(ex){toast(ex.message,true);}
}
async function syncNow() {
  if(!state||!authToken||busy||!navigator.onLine)return;
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
    notice=state.conflicts.length?'Synchronisiert – bitte Konflikte prüfen.':'Synchronisiert. Alle verfügbaren Änderungen abgeglichen.';
    error='';
  }catch(ex){
    error=ex.status===401?'Google-Sitzung abgelaufen. Bitte erneut anmelden.':`Synchronisation: ${ex.message}`;
    if(ex.status===401){authToken='';currentUser='';}
  }finally{busy=false;render();}
}
window.addEventListener('online',()=>{render();if(authToken)syncNow().catch(()=>{});});
window.addEventListener('offline',render);
for(const e of ['pointerdown','keydown','touchstart'])document.addEventListener(e,()=>{lastActivity=Date.now();},{passive:true});
setInterval(()=>{if(state&&Date.now()-lastActivity>15*60*1000){vault.lock();state=null;authToken='';currentUser='';notice='Nach 15 Minuten Inaktivität automatisch gesperrt.';render();}},60000);
(async()=>{
  try{config=await fetch(`${import.meta.env.BASE_URL}runtime-config.json`,{cache:'no-store'}).then(r=>r.json());}
  catch{config={};}
  hasVault=await vault.exists();render();
})().catch(ex=>{app.innerHTML=`<div class="fatal">Lokaler Speicher nicht verfügbar: ${h(ex.message)}. Bitte einen sicheren Browserkontext verwenden.</div>`;});
