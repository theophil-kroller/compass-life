import './style.css';
import {registerSW} from 'virtual:pwa-register';
import * as vault from './vault.js';
import {request,nextBatch,applyResult,mergePulled} from './sync.js';

registerSW({immediate:true});
const app=document.getElementById('app');
let config={apiUrl:'',googleClientId:''};
let state=null, hasVault=false, authToken='', currentUser='', busy=false, notice='', error='', tab='inbox', lastActivity=Date.now();
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
function line(icon,text){return `<div class="feature"><span>${icon}</span><span>${text}</span></div>`;}
function chrome(content) {
  return `<div class="shell"><aside class="sidebar"><div class="brand"><div class="brand-icon">◈</div><div><strong>Compass</strong><small>Relaxed Control</small></div></div>
    <div class="sidebar-caption">DEIN ARBEITSRAUM</div>
    <button class="nav ${tab==='inbox'?'current':''}" data-tab="inbox"><span>▤</span> Inbox <span class="pill-small">${state?Object.values(state.records).filter(x=>!x.deleted).length:0}</span></button>
    <button class="nav ${tab==='system'?'current':''}" data-tab="system"><span>⟲</span> System & Sync</button>
    <div class="sidebar-future"><small>DEMNÄCHST</small>${line('◇','Next Actions')}${line('◷','Weekly Review')}${line('◫','Kanban & Projekte')}${line('⌁','Calendar & Focus')}</div>
    <div class="sidebar-bottom"><div class="status-dot ${navigator.onLine?'online':'offline'}"></div><span>${navigator.onLine?'Internet verfügbar':'Offline-Modus'}</span></div></aside>
    <main class="main"><header class="top"><div><span class="eyebrow">PERSONAL LIFE MANAGER · PHASE A</span><h1>${tab==='inbox'?'Capture & Inbox':'System & Synchronisation'}</h1></div><div class="top-actions"><span class="alpha">FOUNDATION α1</span>${state?'<button class="button subtle" data-action="lock">Sperren</button>':''}</div></header>
    ${notice?`<div role="status" class="alert good">${h(notice)}</div>`:''}${error?`<div role="alert" class="alert bad">${h(error)}</div>`:''}
    ${content}<footer>Compass 0.1.0-alpha.1 · Lokal verschlüsselt · Eigenständiges Projekt</footer></main></div>`;
}
function intro(){return `<div class="welcome"><div class="welcome-mark">◈</div><p class="eyebrow">DEIN PERSÖNLICHER KOMPASS</p><h2>Weniger im Kopf behalten.<br><i>Mehr Raum zum Handeln.</i></h2><p class="muted">Dein privater Speicher auf diesem Gerät ist verschlüsselt. Nur du kennst die lokale Passphrase.</p></div>`;}
function vaultScreen(){return chrome(`${intro()}<div class="card auth-card"><div class="section-head"><div><h2>${hasVault?'Lokalen Tresor entsperren':'Lokalen Tresor einrichten'}</h2><p>${hasVault?'Nach dem Entsperren kannst du auch ohne Internet arbeiten.':'Erstelle eine eigene Passphrase mit mindestens zwölf Zeichen. Sie wird nicht an den Server geschickt.'}</p></div></div>
    <form id="vault-form" autocomplete="off"><label for="passphrase">Lokale Passphrase</label><input id="passphrase" name="passphrase" type="password" required minlength="12" placeholder="Mindestens 12 Zeichen" autocomplete="off"/>
    ${!hasVault?'<label for="passphrase-repeat">Passphrase wiederholen</label><input name="repeat" id="passphrase-repeat" type="password" required minlength="12" autocomplete="off"/>':''}
    <button class="button primary" type="submit">${hasVault?'Tresor entsperren':'Tresor erstellen'}</button></form>
    <p class="small muted">Wenn du die Passphrase vergisst, ist ein nur lokal vorhandener, verschlüsselter Datenbestand nicht wiederherstellbar. Speichere deshalb verschlüsselte Backups.</p>
    ${!hasVault?'<div class="import-line"><label for="encrypted-import">Vorhandenes verschlüsseltes Backup importieren</label><input id="encrypted-import" type="file" accept="application/json"/></div>':''}</div>`);}
function inboxScreen(){
  const rows=Object.values(state.records).filter(r=>!r.deleted).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  return chrome(`<section class="hero"><div><p class="eyebrow">EINFACH ERFASSEN. SPÄTER KLÄREN.</p><h2>Ein freier Kopf beginnt mit<br><em>einem verlässlichen Eingang.</em></h2><p>Notiere etwas, bevor es untergeht. Organisieren kannst du es später.</p></div><div class="hero-art">✦</div></section>
    <div class="columns"><section class="card capture"><div class="section-head"><div><h2>Quick Capture</h2><p>Deine Gedanken haben hier Platz. Auch offline.</p></div><span class="quiet-icon">＋</span></div>
      <form id="capture-form"><label for="capture">Was beschäftigt dich?</label><textarea id="capture" name="title" maxlength="1000" placeholder="z. B. Beim nächsten Jour fixe die offene Frage ansprechen …" required></textarea><div class="inline-actions"><span class="small muted">Strukturierung folgt in Phase B.</span><button class="button primary" type="submit">Zur Inbox hinzufügen ↗</button></div></form></section>
    <section class="card system-card"><div class="section-head"><div><h2>Dein System</h2><p>Status und lokale Datensicherheit</p></div></div>
      <div class="stat"><span>Inbox-Einträge</span><strong>${rows.length}</strong></div><div class="stat"><span>Wartende Änderungen</span><strong>${state.pending.length}</strong></div><div class="stat"><span>Bearbeitungskonflikte</span><strong class="${state.conflicts.length?'warning':''}">${state.conflicts.length}</strong></div>
      <p class="small muted">${authToken?'Mit Google angemeldet: '+h(currentUser):'Lokal nutzbar. Für Cloud-Synchronisation Google anmelden.'}</p>
      <button class="button outline full" data-tab="system">Synchronisation öffnen →</button></section></div>
    <section class="card inbox-list"><div class="section-head"><div><h2>Inbox</h2><p>${rows.length?`${rows.length} Einträge warten auf deine nächste Klärung.`:'Noch leer – deine nächste Idee ist willkommen.'}</p></div><span class="count">${rows.length}</span></div>
      ${rows.length?rows.map(r=>`<div class="inbox-row"><div class="inbox-dot"></div><div class="item-text"><strong>${h(r.title)}</strong><small>${date(r.updatedAt)} · ${state.pending.some(p=>p.id===r.id)?'Lokal gespeichert, Sync ausstehend':'Im lokalen Tresor'}</small></div><button class="icon-button" data-action="edit" data-id="${h(r.id)}" title="Bearbeiten">✎</button><button class="icon-button" data-action="remove" data-id="${h(r.id)}" title="Archivieren">×</button></div>`).join(''):
      '<div class="empty"><div>✧</div><p>Alles erfasst? Starte mit deiner ersten Idee.</p></div>'}</section>`);
}
function systemScreen() {
 return chrome(`<div class="columns"><section class="card"><div class="section-head"><div><h2>Cloud-Verbindung</h2><p>GitHub Pages → Cloudflare Worker → D1</p></div></div>
   <div class="status-strip"><span class="status-dot ${configured()?'online':'offline'}"></span>${configured()?'Konfiguration hinterlegt':'Cloud-Konfiguration fehlt'}</div>
   <p class="small muted">${configured()?'API: '+h(config.apiUrl):'Öffne client/public/runtime-config.json und trage Worker-Adresse und Google Client-ID ein.'}</p>
   <div id="google-button" class="google-button"></div>
   <p class="small muted">${authToken?'Angemeldet als '+h(currentUser):'Ein Google-ID-Token wird nur im Arbeitsspeicher gehalten. Für die Synchronisation ist nach Ablauf eine erneute Anmeldung erforderlich.'}</p>
   <div class="inline-actions"><button class="button primary" data-action="sync" ${!authToken||busy?'disabled':''}>${busy?'Synchronisiere …':'Jetzt synchronisieren ↻'}</button><button class="button outline" data-action="logout" ${!authToken?'disabled':''}>Google trennen</button></div>
   <div class="stat"><span>Outbox</span><strong>${state.pending.length}</strong></div><div class="stat"><span>Sync-Cursor</span><strong>${state.cursor}</strong></div>
   </section><section class="card"><div class="section-head"><div><h2>Lokaler Tresor</h2><p>Offline und verschlüsselt</p></div></div>
   ${line('✓','AES-256-GCM verschlüsselte Daten in IndexedDB')}${line('✓','PBKDF2-Schlüsselableitung, Passphrase nur lokal')}${line('✓','Kein Token und keine privaten Inhalte im GitHub-Repository')}
   <div class="button-stack"><button class="button outline full" data-action="export-encrypted">Verschlüsseltes Backup herunterladen</button><button class="button outline full" data-action="export-json">Klartext-JSON exportieren</button></div><p class="small muted">Achtung: Der Klartext-Export enthält deine privaten Einträge unverschlüsselt.</p></section></div>
   ${state.conflicts.length?`<section class="card"><h2>Konflikte (${state.conflicts.length})</h2><p class="muted">Zwei Geräte haben denselben Eintrag verändert. Entscheide bewusst, welche Version gelten soll.</p>${state.conflicts.map(c=>`<div class="conflict"><p><strong>Mein Gerät:</strong> ${h(c.local?.title||'(gelöscht)')}</p><p><strong>Cloud:</strong> ${h(c.remote?.title||'(fehlt)')}</p><div class="inline-actions"><button class="button outline" data-action="resolve-remote" data-id="${h(c.id)}">Cloud übernehmen</button><button class="button primary" data-action="resolve-local" data-id="${h(c.id)}">Meine Version behalten</button></div></div>`).join('')}</section>`:''}
   <section class="card"><h2>Was folgt in Phase B?</h2><p class="muted">Projekte, Next Actions, Agendas, Kontexte, Review-Zyklen und Kanban. Dieses Foundation-Release testet zunächst zuverlässig den Eingang und das Datenfundament.</p></section>`);
}
function render() {
  if(!state){app.innerHTML=vaultScreen();bind();return;}
  app.innerHTML=tab==='system'?systemScreen():inboxScreen();bind();
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
