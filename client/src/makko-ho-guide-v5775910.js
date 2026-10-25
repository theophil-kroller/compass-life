/** Six-stage Makko-Ho mobility guide; loaded ONLY on explicit Play action.
 * Holds are freely adjustable; no background timer or remote media requests.
 * Illustrations are original schematic poses, not anatomical technique teaching.
 */
import './makko-ho-guide-v5775910.css';
// Private, local assets: none of the six images is requested before the user
// explicitly opens the Makko-Ho guide (its parent is dynamically imported).
// The public/WebP path deliberately bypasses the service-worker install precache.
const ART_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-ho-illustrations-v5775911/';
// A real prerecorded instrumental track, not the old computer-generated Sakura loop.
// Prettysleepy · “Koto Traditional Japanese Music”, Pixabay Content License.
// The external file is requested ONLY when the user opens this guide.
const MUSIC_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-ho-music-v5775912/';
const MUSIC_FILE='sakura-sakura-compass.mp3'; // Legacy asset: deliberately NEVER played.
const MUSIC_URL='https://cdn.pixabay.com/download/audio/2024/11/15/audio_157298f798.mp3?filename=koto-traditional-japanese-music-264711.mp3';
const MUSIC_CACHE='compass-makko-recorded-koto-v1';
const GONG_STORAGE_URL=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-custom-gong-v1';
// Recorded acoustic gong (Alexander / Orange Free Sounds, CC BY 4.0).
const GONG_DEFAULT_URL='https://www.orangefreesounds.com/wp-content/uploads/2016/08/Large-gong-struck-once.mp3';

const ART_LABELS=Object.freeze({
 metal:'Stehende Vorbeuge: Hände sind hinter dem Rücken verschränkt und die Arme sanft angehoben.',
 earth:'Tiefe kniende Rücköffnung: Unterschenkel liegen am Boden, Oberkörper ist zurückgelehnt; Kopf berührt sanft die Matte.',
 fire:'Schmetterlingssitz: Fußsohlen berühren sich, Knie öffnen sich zu den Seiten.',
 water:'Sitzende Vorbeuge: Beide Beine nach vorne gestreckt, Oberkörper neigt sich aus der Hüfte.',
 innerfire:'Schneidersitz: Arme überkreuzen sich, der Oberkörper neigt sich sanft nach vorn.',
 wood:'Grätschsitz: Oberkörper seitlich über ein Bein gebeugt, beide Arme über dem Kopf.'
});
const STAGES=[
 {element:'Metall',name:'Lunge & Dickdarm',pose:'metal',desc:'Stehe bequem, Daumen hinter dem Rücken ineinanderhaken und aus der Hüfte sanft nach vorne neigen. Arme nur so weit anheben, wie angenehm.',tip:'Knie weich lassen, Nacken entspannt.'},
 {element:'Erde',name:'Magen & Milz',pose:'earth',desc:'Beginne aufrecht im Kniestand. Lehne dich nur so weit zurück, wie es für Knie und Rücken angenehm ist. In der sehr tiefen Variante berühren Rücken und Kopf die Matte. Diese Position nicht erzwingen.',tip:'Die Illustration zeigt deine fortgeschrittene Haltung. Als Einstieg stütze dich mit den Händen ab; keine Schmerzen, kein Druck auf Knie oder Lendenwirbelsäule.'},
 {element:'Feuer',name:'Herz & Dünndarm',pose:'fire',desc:'Setze dich, Fußsohlen aneinander (Schmetterlingssitz). Lehne den Oberkörper langsam nach vorne und atme gleichmäßig.',tip:'Knie nicht nach unten drücken.'},
 {element:'Wasser',name:'Blase & Niere',pose:'water',desc:'Setze dich mit ausgestreckten Beinen hin. Oberkörper aus der Hüfte nach vorne neigen, Hände nur soweit zu den Füßen führen wie angenehm.',tip:'Bei Bedarf die Knie leicht beugen.'},
 {element:'Feuer II',name:'Perikard & Dreifacherwärmer',pose:'innerfire',desc:'Sitze locker im Schneidersitz, kreuze die Arme vor dem Oberkörper und neige dich sanft nach vorne. Danach Arm- und Beinstellung wechseln.',tip:'Zur Halbzeit Seitenwechsel.'},
 {element:'Holz',name:'Leber & Gallenblase',pose:'wood',desc:'Setze dich mit angenehm gegrätschten Beinen hin, strecke die Arme über den Kopf und neige den Oberkörper erst zu einer, dann zur anderen Seite.',tip:'Zur Halbzeit Seitenwechsel. Nicht ruckartig ziehen.'}
];
// Approximate stretch zones, NOT medical meridian anatomy. A visual aid only.
const STRETCH_ZONES=Object.freeze({
 metal:{label:'Brust · Schultern · Arme',zones:[[35,45,12,13],[61,45,12,13],[48,62,12,12]]},
 earth:{label:'Oberschenkelvorderseite · Hüfte',zones:[[38,101,9,23],[58,101,9,23],[48,77,14,11]]},
 fire:{label:'Innere Oberschenkel · Hüfte',zones:[[41,102,8,21],[55,102,8,21],[48,82,12,9]]},
 water:{label:'Rücken · Beinrückseiten',zones:[[48,62,13,29],[41,110,10,24],[55,110,10,24]]},
 innerfire:{label:'Schultern · Rücken · Hüfte',zones:[[34,49,10,15],[62,49,10,15],[47,74,13,13]]},
 wood:{label:'Flanken · seitlicher Rumpf',zones:[[32,61,7,28],[64,61,7,28],[38,100,9,12],[57,100,9,12]]}
});
function zoneGraphic(stage){
 const z=STRETCH_ZONES[stage.pose];
 const marks=z.zones.map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#ce694b" opacity=".75"/>`).join('');
 return `<aside class="mk614-zones" aria-label="Schematische Dehnzonen: ${z.label}">
  <div class="mk614-zone-head"><span class="mk614-zonetitle">DEHNZONEN</span><span class="mk614-zonesub">schematisch</span></div>
  <div class="mk614-zone-body"><svg viewBox="0 0 96 150" role="img" aria-label="Körpersilhouette mit farblich markierten Bereichen" xmlns="http://www.w3.org/2000/svg">
  <circle cx="48" cy="17" r="11" fill="#e5dfd2" stroke="#9d9b8f" stroke-width="1.5"/>
  <path d="M37 32Q48 27 59 32L67 79 61 88 55 133 43 133 35 88 29 79Z" fill="#e8e1d3" stroke="#9d9b8f" stroke-width="1.4"/>
  <path d="M35 36L18 70 13 93M61 36L78 70 83 93" fill="none" stroke="#c6bfb2" stroke-width="13" stroke-linecap="round"/>
  <path d="M42 82L36 136M54 82L60 136" stroke="#d5cbbd" stroke-width="14" stroke-linecap="round"/>
  ${marks}<path d="M48 30L48 83" stroke="#746f65" stroke-width="1" stroke-dasharray="3 4" opacity=".6"/>
  </svg><span class="mk614-zone-label">${z.label}</span></div>
  <small class="mk614-zone-note">Orientierung, keine medizinische Meridian-Karte</small>
 </aside>`;
}
function drawing(stage){
 const number=STAGES.indexOf(stage)+1;
 // The visible panel renders exactly one image. The next six-step graphic is
 // fetched only when a user advances, then CacheFirst makes it available offline.
 return `<div class="mk611-artwork" role="group" aria-label="Illustration ${number} von 6">
  <img class="mk611-pose-image" alt="${ART_LABELS[stage.pose]}" src="${ART_ROOT}${stage.pose}.webp?v=5914" width="502" height="502" decoding="async" loading="eager" />
  <span class="mk611-step-number" aria-hidden="true">${String(number).padStart(2,'0')} / 06</span>
  <span class="mk611-art-kind">Zielhaltung</span>${zoneGraphic(stage)}
 </div>`;
}
export function openMakkoGuide({onFinish=()=>{}}={}){
 let step=0,duration=45,remaining=45,overtime=0,running=false,completed=false,ticker=null,target=0,sound=true,closed=false;
 let musicEnabled=true,musicVolume=.22,musicPlayer=null,musicBlobUrl='',musicPending=null,musicStatus='bereit';
 let gongPlayer=null,gongObjectUrl='',gongLoading=null;
 try{const v=localStorage.getItem('compass:makko:sakura-music');if(v==='off')musicEnabled=false;}catch{}
 const previous=document.activeElement;const wrap=document.createElement('div');wrap.className='mk610-backdrop';
 wrap.innerHTML='<section class="mk610-dialog" role="dialog" aria-modal="true" aria-label="Makko-Ho Meridian-Stretches"></section>';document.body.append(wrap);
 const panel=wrap.firstElementChild;
 const stop=()=>{running=false;if(ticker!==null){clearInterval(ticker);ticker=null;}};
 // MUSIC_URL declared above. Never fall back to the synthesized loop.
 async function ensureMusic(){
  if(closed||!musicEnabled)return;
  if(musicPlayer){musicPlayer.volume=musicVolume;try{await musicPlayer.play();musicStatus='läuft';}catch{musicStatus='tippe auf Start';}updateMusicStatus();return;}
  if(musicPending)return musicPending;
  musicStatus='wird geladen';updateMusicStatus();
  musicPending=(async()=>{
   try{
    let response=null;
    if('caches' in window){try{const cache=await caches.open(MUSIC_CACHE);response=await cache.match(MUSIC_URL);
     if(!response){const fresh=await fetch(MUSIC_URL);if(!fresh.ok)throw Error('Audio nicht verfügbar');response=fresh.clone();await cache.put(MUSIC_URL,fresh.clone());}}
     catch(error){if(!response)response=await fetch(MUSIC_URL);}}
    else response=await fetch(MUSIC_URL);
    if(!response?.ok)throw Error('Audio nicht verfügbar');
    const blob=await response.blob();if(closed||!musicEnabled)return;
    musicBlobUrl=URL.createObjectURL(blob);
    musicPlayer=new Audio(musicBlobUrl);musicPlayer.loop=true;musicPlayer.preload='auto';musicPlayer.volume=musicVolume;
    try{await musicPlayer.play();musicStatus='läuft';}catch{musicStatus='tippe auf Start';}
   }catch(error){
    // CDN CORS restrictions may block fetch/cache while permitting ordinary HTML audio.
    // Use direct, real recording as fallback, never the old synthetic MP3.
    try{musicPlayer=new Audio(MUSIC_URL);musicPlayer.loop=true;musicPlayer.preload='none';musicPlayer.volume=musicVolume;
      await musicPlayer.play();musicStatus='läuft · Online';
    }catch{musicStatus='Aufnahme online nicht erreichbar';musicPlayer=null;}
    console.warn('Koto-Aufnahme konnte nicht zwischengespeichert werden:',error);
   }
   finally{musicPending=null;updateMusicStatus();}
  })();return musicPending;
 }
 function updateMusicStatus(){
  const status=panel.querySelector('[data-music-status]');if(status)status.textContent=musicEnabled?musicStatus:'aus';
 }
 function stopMusic(){if(musicPlayer){musicPlayer.pause();musicPlayer.src='';musicPlayer.load();musicPlayer=null;}if(musicBlobUrl){URL.revokeObjectURL(musicBlobUrl);musicBlobUrl='';}}
 const duckMusic=()=>{if(!musicPlayer)return;musicPlayer.volume=Math.min(.05,musicVolume*.3);setTimeout(()=>{if(musicPlayer&&!closed)musicPlayer.volume=musicEnabled?musicVolume:0;},2800);};

 // A REAL recording is the only accepted gong source. One can be added locally in
 // the player from a licensed MP3/OGG/WAV; no generated bell/oscillator fallback.
 async function getGong(){
  if(gongPlayer)return gongPlayer;
  if(gongLoading)return gongLoading;
  gongLoading=(async()=>{try{
   if(!('caches' in window))return null;
   const cache=await caches.open('compass-makko-recorded-gong-v1');
   // Local custom recording takes priority; otherwise use a real licensed gong.
   let r=await cache.match(GONG_STORAGE_URL);
   if(!r){r=await cache.match(GONG_DEFAULT_URL);
     if(!r){try{const fresh=await fetch(GONG_DEFAULT_URL);if(fresh.ok){r=fresh.clone();await cache.put(GONG_DEFAULT_URL,fresh.clone());}}catch{}}
   }
   if(r){const blob=await r.blob();gongObjectUrl=URL.createObjectURL(blob);gongPlayer=new Audio(gongObjectUrl);}
   else{gongPlayer=new Audio(GONG_DEFAULT_URL);} // streaming fallback if CORS/cache unavailable
   gongPlayer.preload='auto';return gongPlayer;
  }catch(error){
   // Even without CacheStorage, try the recorded online source rather than synth audio.
   try{gongPlayer=new Audio(GONG_DEFAULT_URL);return gongPlayer;}catch{}
   console.warn('Aufgenommener Gong nicht erreichbar',error);return null;
  }finally{gongLoading=null;}})();
  return gongLoading;
 }
 async function importGong(file){
  if(!file||file.size>3_000_000||(!file.type.startsWith('audio/')&&!/\.(mp3|ogg|wav|m4a)$/i.test(file.name))){
   musicStatus='Gongdatei: bitte Audio bis 3 MB wählen';updateMusicStatus();return;
  }
  try{
   gongPlayer?.pause();gongPlayer=null;if(gongObjectUrl){URL.revokeObjectURL(gongObjectUrl);gongObjectUrl='';}
   const cache=await caches.open('compass-makko-recorded-gong-v1');
   await cache.put(GONG_STORAGE_URL,new Response(file,{headers:{'Content-Type':file.type||'audio/mpeg'}}));
   await getGong();
   const el=panel.querySelector('[data-gong-status]');if(el)el.textContent='Echter Gong bereit';
  }catch(error){console.warn('Gong-Aufnahme konnte nicht gespeichert werden',error);const el=panel.querySelector('[data-gong-status]');if(el)el.textContent='Gong nicht speicherbar';}
 }
 const gong=()=>{
  if(!sound)return;
  void getGong().then(sample=>{
   if(closed||!sample)return;
   duckMusic();try{sample.pause();sample.currentTime=0;sample.volume=.62;void sample.play().catch(()=>{});}catch{}
  });
 };
 const cleanup=()=>{if(closed)return;closed=true;stop();stopMusic();gongPlayer?.pause();if(gongObjectUrl)URL.revokeObjectURL(gongObjectUrl);wrap.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);previous?.focus?.({preventScroll:true});};
 const key=e=>{if(e.key==='Escape')cleanup();};
 const snapshotTime=()=>{const delta=target-performance.now();remaining=Math.max(0,Math.ceil(delta/1000));overtime=completed?Math.max(0,Math.floor(-delta/1000)):0;};
 const visibility=()=>{if(document.hidden&&musicPlayer){musicPlayer.pause();musicStatus='pausiert';updateMusicStatus();}if(document.hidden&&running){snapshotTime();stop();render();}};
 document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
 wrap.onclick=e=>{if(e.target===wrap)cleanup();};
 const fmt=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${Math.max(0,n%60).toString().padStart(2,'0')}`;
 const refreshTime=()=>{
  const t=panel.querySelector('.mk610-time'),ring=panel.querySelector('.mk610-progress'),status=panel.querySelector('.mk613-clock-state');
  if(t)t.textContent=completed?'+'+fmt(overtime):fmt(remaining);
  if(status)status.textContent=completed?'Zielzeit erreicht · weiter in deinem Tempo':'Verbleibende Zeit';
  if(ring)ring.style.setProperty('--progress',String(Math.max(0,Math.min(1,(duration-remaining)/duration))));
 };
 function tick(){
  if(!running)return;
  const oldRemaining=remaining,oldOvertime=overtime,delta=target-performance.now();
  remaining=Math.max(0,Math.ceil(delta/1000));
  if(remaining===0&&!completed){completed=true;overtime=0;gong();render();}
  if(completed)overtime=Math.max(0,Math.floor(-delta/1000));
  if(oldRemaining!==remaining||oldOvertime!==overtime)refreshTime();
 }
 function render(){const st=STAGES[step];
  panel.innerHTML=`<div class="mk610-head"><div><small>BEWEGUNG · MAKKO-HO</small><h2>${step+1}/6 · ${st.name}</h2></div><button class="mk610-exit" aria-label="Schließen">×</button></div>
  <div class="mk612-music" aria-label="Hintergrundmusik"><button type="button" data-go="music" aria-pressed="${musicEnabled}">${musicEnabled?'♫ Koto · An':'♪ Koto · Aus'}</button><label>Lautstärke <input data-go="volume" type="range" min="0" max="60" step="2" value="${Math.round(musicVolume*100)}" aria-label="Musiklautstärke" ${musicEnabled?'':'disabled'}/></label><small data-music-status>${musicEnabled?musicStatus:'aus'}</small><label class="mk614-gong-import">Gong-Aufnahme <input data-go="gongfile" type="file" accept="audio/mpeg,audio/ogg,audio/wav,audio/mp4,.mp3,.ogg,.wav,.m4a" aria-label="Echte Gong-Aufnahme auf diesem Gerät auswählen"/></label><small data-gong-status>Gong: Aufnahme von Alexander (CC BY 4.0)</small></div>
  <div class="mk610-stages" aria-label="Fortschritt">${STAGES.map((x,i)=>`<span class="${i<step?'done':i===step?'active':''}" title="${x.name}"></span>`).join('')}</div>
  <div class="mk610-main"><div class="mk610-figure">${drawing(st)}<small>Illustration der Zielhaltung · nur so weit dehnen, wie es angenehm ist</small></div><div class="mk610-content"><small class="mk610-element">${st.element}</small><p>${st.desc}</p><div class="mk610-tip">${st.tip}</div><div class="mk610-clock"><div class="mk613-timer-display"><div class="mk610-ring mk610-progress" style="--progress:${(duration-remaining)/duration}"><strong class="mk610-time" aria-live="off">${completed?'+'+fmt(overtime):fmt(remaining)}</strong></div><small class="mk613-clock-state">${completed?'Zielzeit erreicht · weiter in deinem Tempo':'Verbleibende Zeit'}</small></div><div class="mk610-timer-actions"><button type="button" data-go="start">${running?'Pause':completed?'▶ Weiterlaufen':'▶ Start'}</button><button type="button" data-go="reset">↺ Zurücksetzen</button><label>Dauer<select data-go="duration"><option value="30" ${duration===30?'selected':''}>30 Sek.</option><option value="45" ${duration===45?'selected':''}>45 Sek.</option><option value="60" ${duration===60?'selected':''}>1 Minute</option><option value="90" ${duration===90?'selected':''}>1½ Minuten</option></select></label></div></div></div></div>
  <div class="mk610-bottom"><span><label><input type="checkbox" data-go="sound" ${sound?'checked':''}/> Signalton</label> · echter Gong bei Zielzeit; Timer läuft weiter</span><div class="mk610-nav"><button data-go="prev" ${step===0?'disabled':''}>Zurück</button><button class="primary" data-go="next">${step===5?'Abschließen ✓':'Weiter →'}</button></div></div>`;
  panel.querySelector('.mk610-exit').onclick=cleanup;
  panel.querySelector('[data-go="gongfile"]').onchange=e=>{void importGong(e.target.files?.[0]);};
  void getGong().then(a=>{const el=panel.querySelector('[data-gong-status]');if(el&&a)el.textContent='Aufgenommener Gong bereit';});
  panel.querySelector('[data-go="music"]').onclick=()=>{
   musicEnabled=!musicEnabled;musicStatus=musicEnabled?'bereit':'aus';
   try{localStorage.setItem('compass:makko:sakura-music',musicEnabled?'on':'off');}catch{}
   if(!musicEnabled)musicPlayer?.pause();else void ensureMusic();render();
  };
  panel.querySelector('[data-go="volume"]').oninput=e=>{musicVolume=Number(e.target.value)/100;if(musicPlayer)musicPlayer.volume=musicVolume;};

  panel.querySelector('[data-go="start"]').onclick=()=>{
   if(running){snapshotTime();stop();render();return;}

   if(musicEnabled)void ensureMusic();
   running=true;target=performance.now()+(completed?-overtime:remaining)*1000;
   ticker=setInterval(tick,200);render();
  };
  panel.querySelector('[data-go="reset"]').onclick=()=>{stop();remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="duration"]').onchange=e=>{stop();duration=Number(e.target.value)||45;remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="sound"]').onchange=e=>{sound=e.target.checked;};
  panel.querySelector('[data-go="prev"]').onclick=()=>{if(step===0)return;stop();step--;remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="next"]').onclick=async()=>{stop();if(step===5){cleanup();try{await onFinish();}catch(error){console.warn('Makko-Ho Abschluss konnte nicht vorgemerkt werden',error);}return;}step++;remaining=duration;overtime=0;completed=false;render();};
 }
 render();panel.querySelector('[data-go="start"]')?.focus({preventScroll:true});if(musicEnabled)void ensureMusic();return {close:cleanup};
}
