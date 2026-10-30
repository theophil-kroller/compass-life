/** Compass .59.21 – opt-in Wim-Hof audio; the actual recordings remain user-owned.
 * One-file IndexedDB archive per device. No fetching until first playback.
 */
import './wim-hof-player-v5775921.css';
export const WIM_TRACKS=Object.freeze({
 morning:{label:'Morgen',icon:'☀',file:'AUD-20240504-WA0004.mp3'},
 evening:{label:'Abend',icon:'☾',file:'AUD-20240504-WA0005.mp3'}
});
const DB='compass-wimhof-recordings-v1',STORE='recordings';
const ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/,'/')+'wim-hof-audio/';
const key='compass:wimhof:track-v5921';
const formatTime=value=>{const t=Math.max(0,Math.floor(Number(value)||0));return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;};
function dbOpen(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(Error('Lokale Speicherung hier nicht verfügbar.'));const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};req.onerror=()=>reject(req.error);req.onsuccess=()=>resolve(req.result);});}
async function dbAction(type,k,value){const db=await dbOpen();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,type==='read'?'readonly':'readwrite');const os=tx.objectStore(STORE);const req=type==='read'?os.get(k):os.put(value,k);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();tx.onerror=()=>db.close();});}
export const wimStoredRecording=track=>dbAction('read',track);
export async function wimSaveRecording(track,blob){if(!WIM_TRACKS[track]||!(blob instanceof Blob)||blob.size<100)throw Error('Ungültige Audioaufnahme.');await dbAction('write',track,blob);return blob.size;}
export function wimTrackSource(track){if(!WIM_TRACKS[track])throw Error('Unbekannter Wim-Hof-Modus.');return ROOT+WIM_TRACKS[track].file;}
export async function openWimHofPlayer({onComplete=async()=>{}}={}){
 let track='evening';try{if(localStorage.getItem(key)==='morning')track='morning';}catch{}
 let audio=new Audio(),url='',playing=false,loaded=false,closed=false,wake=null,loadId=0,loading=false,saved=false,saving=false,heardSeconds=0,playStartedAt=0;
 const previous=document.activeElement,overlay=document.createElement('div');
 overlay.className='wh621-overlay';overlay.innerHTML='<section class="wh621-dialog" role="dialog" aria-modal="true" aria-label="Wim-Hof Atemroutine"></section>';document.body.append(overlay);
 const view=overlay.firstElementChild;
 const release=()=>{if(wake){const old=wake;wake=null;void old.release?.().catch?.(()=>{});}};
 async function keepAwake(){if(closed||!playing||document.hidden||wake||!navigator.wakeLock?.request)return;try{const lock=await navigator.wakeLock.request('screen');if(closed||!playing){void lock.release();return;}wake=lock;lock.addEventListener?.('release',()=>{if(wake===lock)wake=null;});}catch{showStatus('Bildschirm-Wachhalten wird vom Gerät nicht unterstützt.');}}
 const visibility=()=>{if(!document.hidden&&playing)void keepAwake();else release();};document.addEventListener('visibilitychange',visibility);
 const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[x]));
 const status=message=>{const n=view.querySelector('[data-status]');if(n)n.textContent=message;};
 const showStatus=status;
 const tick=()=>{const progress=view.querySelector('progress');if(progress){progress.value=Number.isFinite(audio.currentTime)?audio.currentTime:0;progress.max=Number.isFinite(audio.duration)?audio.duration:1;}const time=view.querySelector('[data-clock]');if(time)time.textContent=`${formatTime(audio.currentTime)} / ${Number.isFinite(audio.duration)?formatTime(audio.duration):'--:--'}`;};
 const setButtons=()=>{const btn=view.querySelector('[data-control="play"]');if(btn){btn.textContent=playing?'⏸':'▶';btn.setAttribute('aria-label',playing?'Pausieren':'Abspielen');}};
 function resetAudio(){heardSeconds=0;playStartedAt=0;saved=false;audio.pause();audio.removeAttribute('src');audio.load();playing=false;loaded=false;loading=false;release();if(url){URL.revokeObjectURL(url);url='';}audio=new Audio();audio.preload='metadata';audio.ontimeupdate=tick;audio.onloadedmetadata=tick;audio.onended=async()=>{if(closed)return;playing=false;heardSeconds+=playStartedAt?Math.max(0,(Date.now()-playStartedAt)/1000):0;playStartedAt=0;release();setButtons();await saveCurrent({ended:true});};}
 async function saveCurrent({ended=false}={}){
  if(saving)return;
  if(saved){status('Einheit bereits gesichert. Für eine weitere Einheit Stopp und erneut starten.');return;}
  const seconds=Math.round(Math.max(heardSeconds+(playStartedAt?(Date.now()-playStartedAt)/1000:0),0));
  if(seconds<30){status('Noch keine aufzeichnungswürdige Einheit (mindestens 30 Sekunden aktiv gehört).');return;}
  const button=view.querySelector('[data-control="finish"]');if(button)button.disabled=true;
  saving=true;status('Einheit wird verschlüsselt gespeichert …');
  try{await onComplete({track,finishedAt:new Date().toISOString(),durationSeconds:seconds,ended});saved=true;status('✓ Gesichert · '+formatTime(seconds)+' · '+WIM_TRACKS[track].label);}
  catch(ex){saved=false;status('Nicht gespeichert: '+(ex?.message||ex)+'. Nach Entsperren erneut speichern oder nachtragen.');}
  finally{saving=false;if(button)button.disabled=false;}
 }
 async function ensureLoaded(){if(loaded)return true;if(loading)return false;loading=true;const current=++loadId;status('Aufnahme wird geladen …');
  try{let blob=await wimStoredRecording(track).catch(()=>null);if(!blob){const response=await fetch(wimTrackSource(track),{cache:'force-cache'});if(!response.ok)throw Error('Datei ist noch nicht verfügbar. Importiere eine MP3 oder M4A einmal über „Datei wählen“.');blob=await response.blob();if(blob.size<100)throw Error('Audiodatei ist leer.');try{await wimSaveRecording(track,blob);}catch(error){status('Wiedergabe möglich, aber lokales Speichern fehlgeschlagen: '+error.message);}}
   if(closed||loadId!==current)return false;url=URL.createObjectURL(blob);audio.src=url;loaded=true;status('Lokal bereit · '+WIM_TRACKS[track].file);return true;
  }catch(e){if(!closed&&current===loadId)status(e.message);return false;}finally{loading=false;}
 }
 async function play(){if(playing){audio.pause();heardSeconds+=playStartedAt?Math.max(0,(Date.now()-playStartedAt)/1000):0;playStartedAt=0;playing=false;release();setButtons();return;}if(!await ensureLoaded())return;try{if(saved){audio.currentTime=0;heardSeconds=0;saved=false;}await audio.play();playStartedAt=Date.now();playing=true;void keepAwake();setButtons();status('Läuft · '+WIM_TRACKS[track].label);}catch{status('Bitte erneut ▶ tippen – die Audiowiedergabe wurde blockiert.');}}
 function stop(){audio.pause();playing=false;playStartedAt=0;heardSeconds=0;saved=false;audio.currentTime=0;release();setButtons();tick();status('Gestoppt · Aufnahme nicht als Einheit gezählt.');}
 function changeTrack(next){if(!WIM_TRACKS[next]||track===next)return;++loadId;resetAudio();track=next;try{localStorage.setItem(key,track);}catch{}render();}
 const keyDown=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',keyDown);
 function close(){if(closed)return;closed=true;++loadId;resetAudio();document.removeEventListener('keydown',keyDown);document.removeEventListener('visibilitychange',visibility);overlay.remove();previous?.focus?.({preventScroll:true});}
 overlay.onclick=e=>{if(e.target===overlay)close();};
 function render(){view.innerHTML=`<header class="wh621-header"><div><small>COMPASS · ATEMPRAXIS</small><h2>Wim-Hof-Routine</h2></div><button type="button" class="wh621-close" aria-label="Schließen" data-control="close">×</button></header>
 <div class="wh621-tabs" role="group" aria-label="Aufnahme wählen">${Object.entries(WIM_TRACKS).map(([id,v])=>`<button type="button" data-track="${id}" class="${id===track?'selected':''}" aria-pressed="${id===track}"><span>${v.icon}</span><strong>${v.label}</strong></button>`).join('')}</div>
 <div class="wh621-center"><div class="wh621-symbol">${WIM_TRACKS[track].icon}</div><strong>${WIM_TRACKS[track].label} · Atemroutine</strong><p>Atme entspannt und nur in sicherer Umgebung. Niemals im Wasser, beim Fahren oder in Situationen, in denen Ohnmacht gefährlich wäre.</p></div>
 <div class="wh621-transport"><button type="button" data-control="stop" aria-label="Stoppen">⏹</button><button type="button" class="primary" data-control="play" aria-label="Abspielen">▶</button><button type="button" data-control="pause" aria-label="Pausieren">⏸</button></div>
 <button type="button" data-control="finish" class="wh621-finish">✓ Einheit abschließen &amp; speichern</button><div class="wh621-progress"><progress max="1" value="0" aria-label="Wiedergabefortschritt"></progress><span data-clock>00:00 / --:--</span></div><p class="wh621-status" data-status role="status">Bereit · ${WIM_TRACKS[track].file}</p>
 <label class="wh621-upload">Aufnahme einmal lokal speichern <input type="file" accept=".mp3,.m4a,audio/mpeg,audio/mp4,audio/x-m4a" data-control="import"/></label><small class="wh621-footnote">Bei vollständigem Abspielen wird die Einheit gespeichert. Bei vorzeitigem Ende bitte „Einheit abschließen & speichern“ wählen. Jede Session wird einzeln verschlüsselt erfasst. Im Habit-Tracker lassen sich Einheiten nachtragen.</small>`;
 view.querySelector('[data-control="close"]').onclick=close;view.querySelector('[data-control="play"]').onclick=()=>{void play();};view.querySelector('[data-control="pause"]').onclick=()=>{if(playing){audio.pause();heardSeconds+=playStartedAt?Math.max(0,(Date.now()-playStartedAt)/1000):0;playStartedAt=0;playing=false;release();setButtons();status('Pausiert');}};view.querySelector('[data-control="stop"]').onclick=stop;view.querySelector('[data-control="finish"]').onclick=async()=>{if(playing){audio.pause();heardSeconds+=playStartedAt?Math.max(0,(Date.now()-playStartedAt)/1000):0;playStartedAt=0;playing=false;release();setButtons();}await saveCurrent();};
 view.querySelectorAll('[data-track]').forEach(b=>b.onclick=()=>changeTrack(b.dataset.track));
 view.querySelector('[data-control="import"]').onchange=async e=>{const file=e.target.files?.[0];if(!file)return;if(!/\.(mp3|m4a)$/i.test(file.name)){status('Bitte eine MP3- oder M4A-Datei auswählen.');return;}if(file.name.replace(/\.(mp3|m4a)$/i,'')!==WIM_TRACKS[track].file.replace(/\.mp3$/i,'')){status('Für '+WIM_TRACKS[track].label+' bitte '+WIM_TRACKS[track].file+' oder die gleichnamige M4A auswählen.');return;}try{await wimSaveRecording(track,file);await navigator.storage?.persist?.().catch(()=>{});++loadId;resetAudio();status('Lokal gespeichert. Jetzt ▶ drücken.');}catch(err){status('Speichern fehlgeschlagen: '+err.message);}};
 }
 resetAudio();render();view.querySelector('[data-control="play"]')?.focus({preventScroll:true});return {close};
}
