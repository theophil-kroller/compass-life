import './makko-ho-guide-v5775910.css';

// Fullscreen-style Makko-Ho guide: one premium card per step, minimal chrome.
// Images are local and requested only after the guide is opened.
const ART_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-ho-cards-v5775917/';
// A real prerecorded instrumental track, not the old computer-generated Sakura loop.
const MUSIC_URL='https://cdn.pixabay.com/download/audio/2024/11/15/audio_157298f798.mp3?filename=koto-traditional-japanese-music-264711.mp3';
const MUSIC_CACHE='compass-makko-recorded-koto-v1';
const MUSIC_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-ho-music-v5775918/';
const MUSIC_TRACKS=Object.freeze([
 {id:'sakura-dance',name:'Sakura Dance',by:'38534292',length:'4:26',file:'sakura-dance.mp3'},
 {id:'henshin',name:'Henshin · Japanese Koto',by:'Music_Unlimited',length:'2:18',file:'henshin-koto.mp3'},
 {id:'japan-koto',name:'Japan Koto Folk',by:'Music_Unlimited',length:'2:26',file:'japan-koto-folk.mp3'},
 {id:'classic',name:'Koto · bisherige Musik',by:'Prettysleepy',length:'0:56',url:MUSIC_URL}
]);
const MUSIC_SELECTED_KEY='compass:makko:music-selected-v1';
const MUSIC_VOLUME_KEY='compass:makko:music-volume-v1';

const GONG_STORAGE_URL=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-custom-gong-v1';
// Recorded acoustic gong (Alexander / Orange Free Sounds, CC BY 4.0).
const GONG_DEFAULT_URL='https://www.orangefreesounds.com/wp-content/uploads/2016/08/Large-gong-struck-once.mp3';

const ART_LABELS=Object.freeze({
 metal:'ZENKUTSU – Vorwärtsbeuge. Premium-Infokarte mit japanischem Namen, Dehnzonen, Tipp und Dauer.',
 earth:'KOKYŪ – Rücköffnung in Rückenlage. Premium-Infokarte mit japanischem Namen, Dehnzonen, Tipp und Dauer.',
 fire:'KOKAN – Schmetterling. Premium-Infokarte mit japanischem Namen, Dehnzonen, Tipp und Dauer.',
 water:'ASHI – Beinstreckung. Premium-Infokarte mit japanischem Namen, Dehnzonen, Tipp und Dauer.',
 innerfire:'KOSA – Hüftöffnung in Vorneige. Premium-Infokarte mit japanischem Namen, Dehnzonen, Tipp und Dauer.',
 wood:'SOKUHO – Seitdehnung. Premium-Infokarte mit japanischem Namen, Dehnzonen, Tipp und Dauer.'
});
const STAGES=[
 {code:'ZENKUTSU',jp:'前屈',element:'Metall',name:'Lunge & Dickdarm',pose:'metal'},
 {code:'KOKYŪ',jp:'呼吸',element:'Erde',name:'Magen & Milz',pose:'earth'},
 {code:'KOKAN',jp:'股間',element:'Feuer',name:'Herz & Dünndarm',pose:'fire'},
 {code:'ASHI',jp:'足',element:'Wasser',name:'Blase & Niere',pose:'water'},
 {code:'KOSA',jp:'交差',element:'Feuer II',name:'Perikard & Dreifacherwärmer',pose:'innerfire'},
 {code:'SOKUHO',jp:'側方',element:'Holz',name:'Leber & Gallenblase',pose:'wood'}
];

function drawing(stage){
 const number=STAGES.indexOf(stage)+1;
 return `<figure class="mk616-cardwrap" role="group" aria-label="Illustration ${number} von 6">
   <img class="mk616-cardimg" alt="${ART_LABELS[stage.pose]}" src="${ART_ROOT}${stage.pose}.webp?v=5917" width="512" height="454" decoding="async" loading="eager" />
 </figure>`;
}

export function openMakkoGuide({onFinish=()=>{},onSession=()=>{}}={}){
 let step=0,duration=45,remaining=45,overtime=0,running=false,completed=false,ticker=null,target=0,closed=false;
 let musicEnabled=true,musicVolume=.22,musicPlayer=null,musicBlobUrl='',musicPending=null,musicStatus='bereit';
 let selectedMusic='sakura-dance',musicSettingsOpen=false,musicEpoch=0;
 let gongPlayer=null,gongObjectUrl='',gongLoading=null;
 let wakeSentinel=null,wakeRequest=null,wakeGeneration=0,wakeState='idle',wakeRetry=0;
 let activeSince=null,activeMs=0,stageHolds=[],side='left',sessionLogged=false;
 const sessionStart=new Date().toISOString();
 const stopActive=()=>{if(activeSince!==null){activeMs+=Math.max(0,performance.now()-activeSince);activeSince=null;}};
 const stageKey=()=>STAGES[step].pose;
 const currentSide=()=>step===5?side:null;
 const recordHold=()=>{
   stopActive(); const seconds=Math.round(activeMs/1000);
   if(seconds>0)stageHolds.push({pose:stageKey(),side:currentSide(),seconds});
   activeMs=0;return seconds;
 };
 const sessionData=(finished)=>({id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`,startedAt:sessionStart,finishedAt:new Date().toISOString(),completed:finished===true,holds:stageHolds.map(x=>({...x})),totalSeconds:stageHolds.reduce((sum,x)=>sum+x.seconds,0)});
 
 try{
  const v=localStorage.getItem('compass:makko:sakura-music');if(v==='off')musicEnabled=false;
  const stored=localStorage.getItem(MUSIC_SELECTED_KEY);
  if(MUSIC_TRACKS.some(track=>track.id===stored))selectedMusic=stored;
  const level=Number(localStorage.getItem(MUSIC_VOLUME_KEY));
  if(localStorage.getItem(MUSIC_VOLUME_KEY)!==null&&Number.isFinite(level))musicVolume=Math.max(0,Math.min(.6,level));
 }catch{}

 const previous=document.activeElement;
 const wrap=document.createElement('div');
 wrap.className='mk610-backdrop';
 wrap.innerHTML='<section class="mk610-dialog mk616-dialog" role="dialog" aria-modal="true" aria-label="Makko-Ho Meridian-Stretches"></section>';
 document.body.append(wrap);
 const panel=wrap.firstElementChild;

 // Screen Wake Lock is requested only after user presses Play; never on page load.
 // A device may deny it in power-save mode, so handle refusal without stopping training.
 function wakeSupported(){return typeof navigator!=='undefined'&&typeof navigator.wakeLock?.request==='function';}
 function updateWakeStatus(){
  const el=panel.querySelector('[data-wake-status]');
  if(!el)return;
  el.textContent=!running?'':wakeState==='active'?'☀ Display bleibt an':wakeState==='unsupported'?'Display-Schutz nicht unterstützt':wakeState==='failed'?'Display-Wachhalten nicht verfügbar':wakeState==='released'?'Display-Schutz unterbrochen':'Display wird wachgehalten …';
 }
 function releaseWakeLock(){
  ++wakeGeneration;
  wakeRequest=null;
  const held=wakeSentinel;
  wakeSentinel=null;
  wakeState='idle';
  if(held){try{void Promise.resolve(held.release()).catch(()=>{});}catch{}}
  updateWakeStatus();
 }
 function acquireWakeLock(){
  if(closed||!running||document.hidden)return;
  if(!wakeSupported()){wakeState='unsupported';updateWakeStatus();return;}
  if(wakeSentinel&&!wakeSentinel.released){wakeState='active';updateWakeStatus();return;}
  if(wakeRequest)return wakeRequest;
  const generation=++wakeGeneration;
  wakeState='requesting';updateWakeStatus();
  let request;
  try{
   // Must be invoked synchronously from the Play event where possible.
   request=Promise.resolve(navigator.wakeLock.request('screen')).then(sentinel=>{
    if(!sentinel)return;
    if(closed||!running||document.hidden||generation!==wakeGeneration){try{void Promise.resolve(sentinel.release()).catch(()=>{});}catch{}return;}
    wakeSentinel=sentinel;
    wakeState='active';updateWakeStatus();
    sentinel.addEventListener?.('release',()=>{
     if(wakeSentinel!==sentinel)return;
     wakeSentinel=null;
     wakeState='released';updateWakeStatus();
     // One reattempt for a transient OS release while still visible and running.
     if(!closed&&running&&!document.hidden&&wakeRetry<1){wakeRetry++;void acquireWakeLock();}
    });
   }).catch(error=>{
    if(generation===wakeGeneration&&!closed&&running){wakeState='failed';updateWakeStatus();console.info('Screen Wake Lock nicht verfügbar:',error);}
   }).finally(()=>{if(wakeRequest===request)wakeRequest=null;});
  }catch(error){wakeState='failed';updateWakeStatus();console.info('Screen Wake Lock nicht verfügbar:',error);return;}
  wakeRequest=request;
  return request;
 }
 const stop=()=>{stopActive();running=false;if(ticker!==null){clearInterval(ticker);ticker=null;}releaseWakeLock();};

 async function ensureLocalMusic(){
  if(closed||!musicEnabled)return;
  const selection=MUSIC_TRACKS.find(track=>track.id===selectedMusic);
  if(!selection?.file)return;
  if(musicPlayer){
   musicPlayer.volume=musicVolume;
   try{await musicPlayer.play();musicStatus='läuft';}catch{musicStatus='Wiedergabe nicht verfügbar';}
   updateMusicStatus();return;
  }
  // Native audio streams the selected local MP3 progressively. Never fetch other tracks.
  const player=new Audio(MUSIC_ROOT+selection.file);
  player.preload='none';player.loop=true;player.volume=musicVolume;
  const epoch=musicEpoch;
  musicPlayer=player;musicStatus='lädt';updateMusicStatus();
  try{
   await player.play();
   if(closed||!musicEnabled||selectedMusic!==selection.id||musicEpoch!==epoch){player.pause();return;}
   musicStatus='läuft';
  }catch(error){
   if(musicPlayer===player){musicPlayer=null;musicStatus='Musik nicht verfügbar';}
   console.info('Makko-Ho Musik konnte nicht abgespielt werden',error);
  }finally{updateMusicStatus();}
 }
 async function ensureMusic(){
  if(selectedMusic!=='classic')return ensureLocalMusic();
  const startingEpoch=musicEpoch;
  if(closed||!musicEnabled)return;
  if(musicPlayer){musicPlayer.volume=musicVolume;try{await musicPlayer.play();musicStatus='läuft';}catch{musicStatus='tippe auf Play';}updateMusicStatus();return;}
  if(musicPending)return musicPending;
  musicStatus='lädt';updateMusicStatus();
  musicPending=(async()=>{
   try{
    let response=null;
    if('caches' in window){
      try{
        const cache=await caches.open(MUSIC_CACHE);
        response=await cache.match(MUSIC_URL);
        if(!response){
          const fresh=await fetch(MUSIC_URL);
          if(!fresh.ok)throw Error('Audio nicht verfügbar');
          response=fresh.clone();
          await cache.put(MUSIC_URL,fresh.clone());
        }
      }catch(error){if(!response)response=await fetch(MUSIC_URL);}
    }else response=await fetch(MUSIC_URL);
    if(!response?.ok)throw Error('Audio nicht verfügbar');
    const blob=await response.blob();
    if(closed||!musicEnabled||startingEpoch!==musicEpoch||selectedMusic!=='classic')return;
    musicBlobUrl=URL.createObjectURL(blob);
    musicPlayer=new Audio(musicBlobUrl);
    musicPlayer.loop=true;
    musicPlayer.preload='auto';
    musicPlayer.volume=musicVolume;
    try{await musicPlayer.play();musicStatus='läuft';}catch{musicStatus='tippe auf Play';}
   }catch(error){
    if(startingEpoch!==musicEpoch||closed||selectedMusic!=='classic')return;
    try{
      musicPlayer=new Audio(MUSIC_URL);
      musicPlayer.loop=true;
      musicPlayer.preload='none';
      musicPlayer.volume=musicVolume;
      await musicPlayer.play();
      musicStatus='läuft · Online';
    }catch{
      musicStatus='Koto offline';
      musicPlayer=null;
    }
    console.warn('Koto-Aufnahme konnte nicht zwischengespeichert werden:',error);
   }finally{musicPending=null;updateMusicStatus();}
  })();
  return musicPending;
 }
 function stopMusic(){musicEpoch++;musicPending=null;if(musicPlayer){musicPlayer.pause();musicPlayer.src='';musicPlayer.load();musicPlayer=null;}if(musicBlobUrl){URL.revokeObjectURL(musicBlobUrl);musicBlobUrl='';}}
 function updateMusicStatus(){const n=panel.querySelector('[data-music-status]');if(n)n.textContent=musicEnabled?musicStatus:'aus';}
 const duckMusic=()=>{if(!musicPlayer)return;musicPlayer.volume=Math.min(.05,musicVolume*.3);setTimeout(()=>{if(musicPlayer&&!closed)musicPlayer.volume=musicEnabled?musicVolume:0;},2800);};

 async function getGong(){
  if(gongPlayer)return gongPlayer;
  if(gongLoading)return gongLoading;
  gongLoading=(async()=>{try{
   if(!('caches' in window))return null;
   const cache=await caches.open('compass-makko-recorded-gong-v1');
   let r=await cache.match(GONG_STORAGE_URL);
   if(!r){
     r=await cache.match(GONG_DEFAULT_URL);
     if(!r){try{const fresh=await fetch(GONG_DEFAULT_URL);if(fresh.ok){r=fresh.clone();await cache.put(GONG_DEFAULT_URL,fresh.clone());}}catch{}}
   }
   if(r){const blob=await r.blob();gongObjectUrl=URL.createObjectURL(blob);gongPlayer=new Audio(gongObjectUrl);}else gongPlayer=new Audio(GONG_DEFAULT_URL);
   gongPlayer.preload='auto';
   return gongPlayer;
  }catch(error){
   try{gongPlayer=new Audio(GONG_DEFAULT_URL);return gongPlayer;}catch{}
   console.warn('Aufgenommener Gong nicht erreichbar',error);return null;
  }finally{gongLoading=null;}})();
  return gongLoading;
 }
 const gong=()=>{void getGong().then(sample=>{if(closed||!sample)return;duckMusic();try{sample.pause();sample.currentTime=0;sample.volume=.62;void sample.play().catch(()=>{});}catch{}});};

 const cleanup=()=>{if(closed)return;closed=true;stop();
  if(!sessionLogged){recordHold();const data=sessionData(false);if(data.totalSeconds>0){sessionLogged=true;void Promise.resolve(onSession(data)).catch(error=>console.warn('Makko-Ho Session konnte nicht gespeichert werden',error));}}
  stopMusic();gongPlayer?.pause();if(gongObjectUrl)URL.revokeObjectURL(gongObjectUrl);wrap.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);previous?.focus?.({preventScroll:true});};
 const key=e=>{if(e.key==='Escape')cleanup();};
 const snapshotTime=()=>{const delta=target-performance.now();remaining=Math.max(0,Math.ceil(delta/1000));overtime=completed?Math.max(0,Math.floor(-delta/1000)):0;};
 const visibility=()=>{if(document.hidden&&musicPlayer){musicPlayer.pause();musicStatus='pausiert';updateMusicStatus();}if(document.hidden&&running){snapshotTime();stop();render();}else if(!document.hidden&&running)void acquireWakeLock();};
 document.addEventListener('keydown',key);
 document.addEventListener('visibilitychange',visibility);
 wrap.onclick=e=>{if(e.target===wrap)cleanup();};

 const fmt=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${Math.max(0,n%60).toString().padStart(2,'0')}`;
 const refreshTime=()=>{
  const t=panel.querySelector('.mk610-time'),ring=panel.querySelector('.mk610-progress'),status=panel.querySelector('.mk613-clock-state'),next=panel.querySelector('[data-go="next"]');
  if(t)t.textContent=completed?'+'+fmt(overtime):fmt(remaining);
  if(status)status.textContent=completed?'freie Haltezeit':'Timer';
  if(ring)ring.style.setProperty('--progress',String(Math.max(0,Math.min(1,(duration-remaining)/duration))));
  if(next)next.classList.toggle('is-ready',completed);
 };
 function tick(){
  if(!running)return;
  const oldRemaining=remaining,oldOvertime=overtime,delta=target-performance.now();
  remaining=Math.max(0,Math.ceil(delta/1000));
  if(remaining===0&&!completed){completed=true;overtime=0;gong();render();}
  if(completed)overtime=Math.max(0,Math.floor(-delta/1000));
  if(oldRemaining!==remaining||oldOvertime!==overtime)refreshTime();
 }
 function render(){
  const st=STAGES[step];
  panel.innerHTML=`<div class="mk616-shell">
    <div class="mk616-headline"><div><small>BEWEGUNG · MAKKO-HO</small><h2>${step+1}/6 · ${st.code} <span lang="ja">${st.jp}</span>${step===5?` · ${side==='left'?'Links':'Rechts'}`:''}</h2><p>${st.name}</p></div><button class="mk610-exit" aria-label="Schließen">×</button></div>
    <div class="mk610-stages mk616-stages" aria-label="Fortschritt">${STAGES.map((x,i)=>`<span class="${i<step?'done':i===step?'active':''}" title="${x.code}"></span>`).join('')}</div>
    <div class="mk616-hero">${drawing(st)}${step===5?`<span class="mk617-side-label" aria-live="polite">${side==='left'?'1/2 · Zur linken Seite neigen':'2/2 · Zur rechten Seite neigen'}</span>`:''}</div>
    <div class="mk616-controls">
      <div class="mk616-core">
        <button class="mk616-icon" data-go="prev" aria-label="Vorherige Übung" ${step===0?'disabled':''}>←</button>
        <div class="mk613-timer-display mk616-timer"><div class="mk610-ring mk610-progress" style="--progress:${(duration-remaining)/duration}"><strong class="mk610-time" aria-live="off">${completed?'+'+fmt(overtime):fmt(remaining)}</strong></div><small class="mk613-clock-state">${completed?'freie Haltezeit':'Timer'}</small></div>
        <button class="mk616-start mk617-media" type="button" data-go="start" aria-label="${running?'Pausieren':'Starten'}" title="${running?'Pausieren':'Starten'}" aria-pressed="${running}">${running?'<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.3"/><rect x="14" y="4" width="4" height="16" rx="1.3"/></svg>':'<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 4.7a1.4 1.4 0 0 1 2.1-1.2L20 10.8a1.45 1.45 0 0 1 0 2.4L9.6 20.5a1.4 1.4 0 0 1-2.1-1.2Z"/></svg>'}</button>
        <button class="mk616-icon mk616-next ${completed?'is-ready':''}" data-go="next" aria-label="Nächste Übung">${step===5&&side==='right'?'✓':'→'}</button>
      </div>
      <div class="mk616-subbar">
        <button type="button" class="mk616-music-toggle" data-go="music" aria-pressed="${musicEnabled}">${musicEnabled?'♫ Musik':'♪ Aus'}</button>
        <button class="mk618-gear" type="button" data-go="music-settings" aria-label="Musik auswählen" title="Musik auswählen" aria-expanded="${musicSettingsOpen}" aria-controls="mk618-settings">⚙</button>
        <label class="mk616-volume" aria-label="Musiklautstärke"><input data-go="volume" type="range" min="0" max="60" step="2" value="${Math.round(musicVolume*100)}" ${musicEnabled?'':'disabled'} /></label>
        <label class="mk616-duration">Dauer <select data-go="duration"><option value="45" ${duration===45?'selected':''}>45s</option><option value="60" ${duration===60?'selected':''}>60s</option><option value="90" ${duration===90?'selected':''}>90s</option></select></label>
        <button class="mk616-reset" type="button" data-go="reset" aria-label="Timer zurücksetzen">↺</button>
        ${musicSettingsOpen?`<section id="mk618-settings" class="mk618-settings" role="group" aria-label="Hintergrundmusik auswählen"><div class="mk618-settings-head"><strong>Hintergrundmusik</strong><small>Auswahl wird gespeichert</small></div><div class="mk618-tracks">${MUSIC_TRACKS.map(track=>`<button type="button" data-go="track" data-track="${track.id}" class="mk618-track ${selectedMusic===track.id?'selected':''}" aria-pressed="${selectedMusic===track.id}"><span aria-hidden="true" class="mk618-radio">${selectedMusic===track.id?'✓':'♫'}</span><span class="mk618-track-info"><strong>${track.name}</strong><small>${track.by}</small></span><span class="mk618-track-duration">${track.length}</span></button>`).join('')}</div></section>`:''}
      </div>
      <div class="mk616-foot"><small data-music-status>${musicEnabled?musicStatus:'aus'}</small><small data-wake-status aria-live="polite"></small></div>
    </div>
  </div>`;

  panel.querySelector('.mk610-exit').onclick=cleanup;
  panel.querySelector('[data-go="music-settings"]').onclick=()=>{
    musicSettingsOpen=!musicSettingsOpen;
    render();
    panel.querySelector('[data-go="music-settings"]')?.focus({preventScroll:true});
  };
  panel.querySelectorAll('[data-go="track"]').forEach(button=>button.onclick=()=>{
    const next=button.dataset.track;
    if(!MUSIC_TRACKS.some(track=>track.id===next))return;
    if(next!==selectedMusic){stopMusic();selectedMusic=next;try{localStorage.setItem(MUSIC_SELECTED_KEY,selectedMusic);}catch{}
      musicStatus='bereit';
      if(running&&musicEnabled)void ensureMusic();
    }
    musicSettingsOpen=false;render();
    panel.querySelector('[data-go="music-settings"]')?.focus({preventScroll:true});
  });
  panel.querySelector('[data-go="music"]').onclick=()=>{
    musicEnabled=!musicEnabled;
    musicStatus=musicEnabled?'bereit':'aus';
    try{localStorage.setItem('compass:makko:sakura-music',musicEnabled?'on':'off');}catch{}
    if(!musicEnabled)musicPlayer?.pause();
    else if(running)void ensureMusic();
    render();
  };
  panel.querySelector('[data-go="volume"]').oninput=e=>{musicVolume=Number(e.target.value)/100;if(musicPlayer)musicPlayer.volume=musicVolume;try{localStorage.setItem(MUSIC_VOLUME_KEY,String(musicVolume));}catch{}};
  panel.querySelector('[data-go="start"]').onclick=()=>{
    if(running){snapshotTime();stop();render();return;}
    running=true;
    activeSince=performance.now();
    target=performance.now()+(completed?-overtime:remaining)*1000;
    ticker=setInterval(tick,200);
    wakeRetry=0;
    void acquireWakeLock();
    if(musicEnabled)void ensureMusic();
    render();
  };
  panel.querySelector('[data-go="reset"]').onclick=()=>{stop();remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="duration"]').onchange=e=>{stop();duration=Number(e.target.value)||45;remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="prev"]').onclick=()=>{
    if(step===0)return;
    stop();recordHold();
    if(step===5&&side==='right')side='left';else{step--;side='left';}
    remaining=duration;overtime=0;completed=false;render();
  };
  panel.querySelector('[data-go="next"]').onclick=async()=>{
    stop();recordHold();
    if(step===5&&side==='left'){
      // Both sides are required. Never finish after the first side.
      side='right';remaining=duration;overtime=0;completed=false;render();return;
    }
    if(step===5){
      const data=sessionData(true);sessionLogged=true;
      cleanup();
      try{if(data.totalSeconds>0)await onSession(data);await onFinish(data);}catch(error){console.warn('Makko-Ho Abschluss konnte nicht gespeichert werden',error);}
      return;
    }
    step++;remaining=duration;overtime=0;completed=false;render();
  };
  updateMusicStatus();
  updateWakeStatus();
 }

 render();
 panel.querySelector('[data-go="start"]')?.focus({preventScroll:true});
 void getGong();
 return {close:cleanup};
}
