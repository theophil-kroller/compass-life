/** Six-stage Makko-Ho mobility guide; loaded ONLY on explicit Play action.
 * Holds are freely adjustable; no background timer or remote media requests.
 * Illustrations are original schematic poses, not anatomical technique teaching.
 */
import './makko-ho-guide-v5775910.css';
// Private, local assets: none of the six images is requested before the user
// explicitly opens the Makko-Ho guide (its parent is dynamically imported).
// The public/WebP path deliberately bypasses the service-worker install precache.
const ART_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-ho-illustrations-v5775911/';
const MUSIC_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-ho-music-v5775912/';
const MUSIC_FILE='sakura-sakura-compass.mp3';
const MUSIC_CACHE='compass-makko-sakura-on-demand-v1';
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
function drawing(stage){
 const number=STAGES.indexOf(stage)+1;
 // The visible panel renders exactly one image. The next six-step graphic is
 // fetched only when a user advances, then CacheFirst makes it available offline.
 return `<div class="mk611-artwork" role="group" aria-label="Illustration ${number} von 6">
  <img class="mk611-pose-image" alt="${ART_LABELS[stage.pose]}" src="${ART_ROOT}${stage.pose}.webp?v=5912" width="502" height="502" decoding="async" loading="eager" />
  <span class="mk611-step-number" aria-hidden="true">${String(number).padStart(2,'0')} / 06</span>
  <span class="mk611-art-kind">Zielhaltung</span>
 </div>`;
}
export function openMakkoGuide({onFinish=()=>{}}={}){
 let step=0,duration=45,remaining=45,running=false,completed=false,ticker=null,target=0,sound=true,closed=false;
 let audio=null;let musicEnabled=true,musicVolume=.22,musicPlayer=null,musicBlobUrl='',musicPending=null,musicStatus='bereit';
 try{const v=localStorage.getItem('compass:makko:sakura-music');if(v==='off')musicEnabled=false;}catch{}
 const previous=document.activeElement;const wrap=document.createElement('div');wrap.className='mk610-backdrop';
 wrap.innerHTML='<section class="mk610-dialog" role="dialog" aria-modal="true" aria-label="Makko-Ho Meridian-Stretches"></section>';document.body.append(wrap);
 const panel=wrap.firstElementChild;
 const stop=()=>{running=false;if(ticker!==null){clearInterval(ticker);ticker=null;}};
 const MUSIC_URL=MUSIC_ROOT+MUSIC_FILE;
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
   }catch(error){musicStatus='Musik nicht verfügbar';console.warn('Sakura Sakura konnte nicht geladen werden:',error);}
   finally{musicPending=null;updateMusicStatus();}
  })();return musicPending;
 }
 function updateMusicStatus(){
  const status=panel.querySelector('[data-music-status]');if(status)status.textContent=musicEnabled?musicStatus:'aus';
 }
 function stopMusic(){if(musicPlayer){musicPlayer.pause();musicPlayer.src='';musicPlayer.load();musicPlayer=null;}if(musicBlobUrl){URL.revokeObjectURL(musicBlobUrl);musicBlobUrl='';}}
 const duckMusic=()=>{if(!musicPlayer)return;musicPlayer.volume=Math.min(.05,musicVolume*.3);setTimeout(()=>{if(musicPlayer&&!closed)musicPlayer.volume=musicEnabled?musicVolume:0;},650);};

 const beep=(freq=880)=>{if(!sound)return;duckMusic();try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio ||=new Audio();if(audio.state==='suspended')void audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.value=.0001;osc.connect(gain);gain.connect(audio.destination);gain.gain.exponentialRampToValueAtTime(.10,audio.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.20);osc.start();osc.stop(audio.currentTime+.21);}catch{ /* silent fallback: visible timer remains authoritative */ }};
 const cleanup=()=>{if(closed)return;closed=true;stop();stopMusic();wrap.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);if(audio){void audio.close().catch(()=>{});audio=null;}previous?.focus?.({preventScroll:true});};
 const key=e=>{if(e.key==='Escape')cleanup();};
 const visibility=()=>{if(document.hidden&&musicPlayer){musicPlayer.pause();musicStatus='pausiert';updateMusicStatus();}if(document.hidden&&running){remaining=Math.max(0,Math.ceil((target-performance.now())/1000));stop();render();}};
 document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
 wrap.onclick=e=>{if(e.target===wrap)cleanup();};
 const fmt=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${Math.max(0,n%60).toString().padStart(2,'0')}`;
 const refreshTime=()=>{const t=panel.querySelector('.mk610-time'),ring=panel.querySelector('.mk610-progress');if(t)t.textContent=fmt(remaining);if(ring)ring.style.setProperty('--progress',String(Math.max(0,Math.min(1,(duration-remaining)/duration))));};
 function tick(){if(!running)return;const old=remaining;remaining=Math.max(0,Math.ceil((target-performance.now())/1000));if(old!==remaining)refreshTime();if(remaining===0){stop();completed=true;beep();setTimeout(()=>beep(660),230);render();}}
 function render(){const st=STAGES[step];const finished=remaining===0||completed;
  panel.innerHTML=`<div class="mk610-head"><div><small>BEWEGUNG · MAKKO-HO</small><h2>${step+1}/6 · ${st.name}</h2></div><button class="mk610-exit" aria-label="Schließen">×</button></div>
  <div class="mk612-music" aria-label="Hintergrundmusik"><button type="button" data-go="music" aria-pressed="${musicEnabled}">${musicEnabled?'♫ Sakura Sakura · An':'♪ Sakura Sakura · Aus'}</button><label>Lautstärke <input data-go="volume" type="range" min="0" max="60" step="2" value="${Math.round(musicVolume*100)}" aria-label="Musiklautstärke" ${musicEnabled?'':'disabled'}/></label><small data-music-status>${musicEnabled?musicStatus:'aus'}</small></div>
  <div class="mk610-stages" aria-label="Fortschritt">${STAGES.map((x,i)=>`<span class="${i<step?'done':i===step?'active':''}" title="${x.name}"></span>`).join('')}</div>
  <div class="mk610-main"><div class="mk610-figure">${drawing(st)}<small>Illustration der Zielhaltung · nur so weit dehnen, wie es angenehm ist</small></div><div class="mk610-content"><small class="mk610-element">${st.element}</small><p>${st.desc}</p><div class="mk610-tip">${st.tip}</div><div class="mk610-clock"><div class="mk610-ring mk610-progress" style="--progress:${(duration-remaining)/duration}"><strong class="mk610-time">${fmt(remaining)}</strong></div><div class="mk610-timer-actions"><button type="button" data-go="start">${running?'Pause':remaining===0?'Erneut':'▶ Start'}</button><button type="button" data-go="reset">↺ Zurücksetzen</button><label>Dauer<select data-go="duration"><option value="30" ${duration===30?'selected':''}>30 Sek.</option><option value="45" ${duration===45?'selected':''}>45 Sek.</option><option value="60" ${duration===60?'selected':''}>1 Minute</option><option value="90" ${duration===90?'selected':''}>1½ Minuten</option></select></label></div></div></div></div>
  <div class="mk610-bottom"><span><label><input type="checkbox" data-go="sound" ${sound?'checked':''}/> Signalton</label> · ruhig atmen, keine Schmerzen provozieren</span><div class="mk610-nav"><button data-go="prev" ${step===0?'disabled':''}>Zurück</button><button class="primary" data-go="next">${step===5?'Abschließen ✓':'Weiter →'}</button></div></div>`;
  panel.querySelector('.mk610-exit').onclick=cleanup;
  panel.querySelector('[data-go="music"]').onclick=()=>{
   musicEnabled=!musicEnabled;musicStatus=musicEnabled?'bereit':'aus';
   try{localStorage.setItem('compass:makko:sakura-music',musicEnabled?'on':'off');}catch{}
   if(!musicEnabled)musicPlayer?.pause();else void ensureMusic();render();
  };
  panel.querySelector('[data-go="volume"]').oninput=e=>{musicVolume=Number(e.target.value)/100;if(musicPlayer)musicPlayer.volume=musicVolume;};

  panel.querySelector('[data-go="start"]').onclick=()=>{if(running){remaining=Math.max(0,Math.ceil((target-performance.now())/1000));stop();render();return;}if(remaining===0)remaining=duration;if(sound&&!audio){try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio=new Audio();void audio.resume();}}catch{}}if(musicEnabled)void ensureMusic();running=true;target=performance.now()+remaining*1000;ticker=setInterval(tick,200);render();};
  panel.querySelector('[data-go="reset"]').onclick=()=>{stop();remaining=duration;completed=false;render();};
  panel.querySelector('[data-go="duration"]').onchange=e=>{stop();duration=Number(e.target.value)||45;remaining=duration;completed=false;render();};
  panel.querySelector('[data-go="sound"]').onchange=e=>{sound=e.target.checked;};
  panel.querySelector('[data-go="prev"]').onclick=()=>{if(step===0)return;stop();step--;remaining=duration;completed=false;render();};
  panel.querySelector('[data-go="next"]').onclick=async()=>{stop();if(step===5){cleanup();try{await onFinish();}catch(error){console.warn('Makko-Ho Abschluss konnte nicht vorgemerkt werden',error);}return;}step++;remaining=duration;completed=false;render();};
 }
 render();panel.querySelector('[data-go="start"]')?.focus({preventScroll:true});if(musicEnabled)void ensureMusic();return {close:cleanup};
}
