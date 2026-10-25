import './makko-ho-guide-v5775910.css';

// Fullscreen-style Makko-Ho guide: one premium card per step, minimal chrome.
// Images are local and requested only after the guide is opened.
const ART_ROOT=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/, '/')+'makko-ho-cards-v5775916/';
// A real prerecorded instrumental track, not the old computer-generated Sakura loop.
const MUSIC_URL='https://cdn.pixabay.com/download/audio/2024/11/15/audio_157298f798.mp3?filename=koto-traditional-japanese-music-264711.mp3';
const MUSIC_CACHE='compass-makko-recorded-koto-v1';
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
   <img class="mk616-cardimg" alt="${ART_LABELS[stage.pose]}" src="${ART_ROOT}${stage.pose}.webp?v=5916" width="512" height="454" decoding="async" loading="eager" />
 </figure>`;
}

export function openMakkoGuide({onFinish=()=>{}}={}){
 let step=0,duration=45,remaining=45,overtime=0,running=false,completed=false,ticker=null,target=0,closed=false;
 let musicEnabled=true,musicVolume=.22,musicPlayer=null,musicBlobUrl='',musicPending=null,musicStatus='bereit';
 let gongPlayer=null,gongObjectUrl='',gongLoading=null;
 try{const v=localStorage.getItem('compass:makko:sakura-music');if(v==='off')musicEnabled=false;}catch{}

 const previous=document.activeElement;
 const wrap=document.createElement('div');
 wrap.className='mk610-backdrop';
 wrap.innerHTML='<section class="mk610-dialog mk616-dialog" role="dialog" aria-modal="true" aria-label="Makko-Ho Meridian-Stretches"></section>';
 document.body.append(wrap);
 const panel=wrap.firstElementChild;

 const stop=()=>{running=false;if(ticker!==null){clearInterval(ticker);ticker=null;}};

 async function ensureMusic(){
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
    if(closed||!musicEnabled)return;
    musicBlobUrl=URL.createObjectURL(blob);
    musicPlayer=new Audio(musicBlobUrl);
    musicPlayer.loop=true;
    musicPlayer.preload='auto';
    musicPlayer.volume=musicVolume;
    try{await musicPlayer.play();musicStatus='läuft';}catch{musicStatus='tippe auf Play';}
   }catch(error){
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
 function stopMusic(){if(musicPlayer){musicPlayer.pause();musicPlayer.src='';musicPlayer.load();musicPlayer=null;}if(musicBlobUrl){URL.revokeObjectURL(musicBlobUrl);musicBlobUrl='';}}
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

 const cleanup=()=>{if(closed)return;closed=true;stop();stopMusic();gongPlayer?.pause();if(gongObjectUrl)URL.revokeObjectURL(gongObjectUrl);wrap.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);previous?.focus?.({preventScroll:true});};
 const key=e=>{if(e.key==='Escape')cleanup();};
 const snapshotTime=()=>{const delta=target-performance.now();remaining=Math.max(0,Math.ceil(delta/1000));overtime=completed?Math.max(0,Math.floor(-delta/1000)):0;};
 const visibility=()=>{if(document.hidden&&musicPlayer){musicPlayer.pause();musicStatus='pausiert';updateMusicStatus();}if(document.hidden&&running){snapshotTime();stop();render();}};
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
    <div class="mk616-headline"><div><small>BEWEGUNG · MAKKO-HO</small><h2>${step+1}/6 · ${st.code} <span lang="ja">${st.jp}</span></h2><p>${st.name}</p></div><button class="mk610-exit" aria-label="Schließen">×</button></div>
    <div class="mk610-stages mk616-stages" aria-label="Fortschritt">${STAGES.map((x,i)=>`<span class="${i<step?'done':i===step?'active':''}" title="${x.code}"></span>`).join('')}</div>
    <div class="mk616-hero">${drawing(st)}</div>
    <div class="mk616-controls">
      <div class="mk616-core">
        <button class="mk616-icon" data-go="prev" aria-label="Vorherige Übung" ${step===0?'disabled':''}>←</button>
        <div class="mk613-timer-display mk616-timer"><div class="mk610-ring mk610-progress" style="--progress:${(duration-remaining)/duration}"><strong class="mk610-time" aria-live="off">${completed?'+'+fmt(overtime):fmt(remaining)}</strong></div><small class="mk613-clock-state">${completed?'freie Haltezeit':'Timer'}</small></div>
        <button class="mk616-start" type="button" data-go="start">${running?'Pause':completed?'Weiter halten':'Play'}</button>
        <button class="mk616-icon mk616-next ${completed?'is-ready':''}" data-go="next" aria-label="Nächste Übung">${step===5?'✓':'→'}</button>
      </div>
      <div class="mk616-subbar">
        <button type="button" class="mk616-music-toggle" data-go="music" aria-pressed="${musicEnabled}">${musicEnabled?'♫ Koto':'♪ Aus'}</button>
        <label class="mk616-volume" aria-label="Musiklautstärke"><input data-go="volume" type="range" min="0" max="60" step="2" value="${Math.round(musicVolume*100)}" ${musicEnabled?'':'disabled'} /></label>
        <label class="mk616-duration">Dauer <select data-go="duration"><option value="45" ${duration===45?'selected':''}>45s</option><option value="60" ${duration===60?'selected':''}>60s</option><option value="90" ${duration===90?'selected':''}>90s</option></select></label>
        <button class="mk616-reset" type="button" data-go="reset" aria-label="Timer zurücksetzen">↺</button>
      </div>
      <div class="mk616-foot"><small data-music-status>${musicEnabled?musicStatus:'aus'}</small><small>Gong bei Zielzeit · Timer läuft weiter</small></div>
    </div>
  </div>`;

  panel.querySelector('.mk610-exit').onclick=cleanup;
  panel.querySelector('[data-go="music"]').onclick=()=>{
    musicEnabled=!musicEnabled;
    musicStatus=musicEnabled?'bereit':'aus';
    try{localStorage.setItem('compass:makko:sakura-music',musicEnabled?'on':'off');}catch{}
    if(!musicEnabled)musicPlayer?.pause();
    else if(running)void ensureMusic();
    render();
  };
  panel.querySelector('[data-go="volume"]').oninput=e=>{musicVolume=Number(e.target.value)/100;if(musicPlayer)musicPlayer.volume=musicVolume;};
  panel.querySelector('[data-go="start"]').onclick=()=>{
    if(running){snapshotTime();stop();render();return;}
    if(musicEnabled)void ensureMusic();
    running=true;
    target=performance.now()+(completed?-overtime:remaining)*1000;
    ticker=setInterval(tick,200);
    render();
  };
  panel.querySelector('[data-go="reset"]').onclick=()=>{stop();remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="duration"]').onchange=e=>{stop();duration=Number(e.target.value)||45;remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="prev"]').onclick=()=>{if(step===0)return;stop();step--;remaining=duration;overtime=0;completed=false;render();};
  panel.querySelector('[data-go="next"]').onclick=async()=>{stop();if(step===5){cleanup();try{await onFinish();}catch(error){console.warn('Makko-Ho Abschluss konnte nicht vorgemerkt werden',error);}return;}step++;remaining=duration;overtime=0;completed=false;render();};
  updateMusicStatus();
 }

 render();
 panel.querySelector('[data-go="start"]')?.focus({preventScroll:true});
 void getGong();
 return {close:cleanup};
}
