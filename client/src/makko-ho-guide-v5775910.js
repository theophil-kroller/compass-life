/** Six-stage Makko-Ho mobility guide; loaded ONLY on explicit Play action.
 * Holds are freely adjustable; no background timer or remote media requests.
 * Illustrations are original schematic poses, not anatomical technique teaching.
 */
import './makko-ho-guide-v5775910.css';
const ink='stroke="#356f5b" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"';
const poses={
 metal:`<circle cx="147" cy="93" r="15"/><path d="M133 103 L101 150 L70 179 M101 150 L94 208 M102 151 L126 206 M104 131 L152 141 L187 117 M152 141 L191 159"/>`,
 earth:`<circle cx="145" cy="44" r="15"/><path d="M142 59 L152 125 L171 169 M151 125 L106 166 L74 174 M151 125 L183 166 L201 168 M146 67 L118 119 M156 65 L184 120"/>`,
 fire:`<circle cx="150" cy="100" r="15"/><path d="M142 115 L126 151 L143 183 M127 151 L98 189 L62 187 M130 151 L171 190 L214 187 M132 138 L93 169 M144 140 L193 167"/>`,
 water:`<circle cx="185" cy="99" r="15"/><path d="M174 108 L127 151 L87 167 M127 151 L65 189 L29 190 M128 153 L199 190 L237 191 M130 130 L226 185 M127 130 L70 182"/>`,
 innerfire:`<circle cx="147" cy="93" r="15"/><path d="M136 105 L120 149 L134 184 M120 149 L80 196 L49 189 M120 149 L168 196 L208 188 M133 122 L167 137 L105 160 M166 125 L117 138 L186 155"/>`,
 wood:`<circle cx="167" cy="73" r="15"/><path d="M158 86 L120 135 L127 177 M120 135 L82 189 L39 188 M126 176 L217 190 L255 188 M121 110 L67 65 M121 111 L86 54"/>`
};
const STAGES=[
 {element:'Metall',name:'Lunge & Dickdarm',pose:'metal',desc:'Stehe bequem, Daumen hinter dem Rücken ineinanderhaken und aus der Hüfte sanft nach vorne neigen. Arme nur so weit anheben, wie angenehm.',tip:'Knie weich lassen, Nacken entspannt.'},
 {element:'Erde',name:'Magen & Milz',pose:'earth',desc:'Aufrecht knien und – nur soweit Knie und Rücken es zulassen – den Oberkörper sanft nach hinten öffnen. Als leichtere Variante aufrecht bleiben und Hüftvorderseite dehnen.',tip:'Keinen Druck auf Knie oder unteren Rücken erzwingen.'},
 {element:'Feuer',name:'Herz & Dünndarm',pose:'fire',desc:'Setze dich, Fußsohlen aneinander (Schmetterlingssitz). Lehne den Oberkörper langsam nach vorne und atme gleichmäßig.',tip:'Knie nicht nach unten drücken.'},
 {element:'Wasser',name:'Blase & Niere',pose:'water',desc:'Setze dich mit ausgestreckten Beinen hin. Oberkörper aus der Hüfte nach vorne neigen, Hände nur soweit zu den Füßen führen wie angenehm.',tip:'Bei Bedarf die Knie leicht beugen.'},
 {element:'Feuer II',name:'Perikard & Dreifacherwärmer',pose:'innerfire',desc:'Sitze locker im Schneidersitz, kreuze die Arme vor dem Oberkörper und neige dich sanft nach vorne. Danach Arm- und Beinstellung wechseln.',tip:'Zur Halbzeit Seitenwechsel.'},
 {element:'Holz',name:'Leber & Gallenblase',pose:'wood',desc:'Setze dich mit angenehm gegrätschten Beinen hin, strecke die Arme über den Kopf und neige den Oberkörper erst zu einer, dann zur anderen Seite.',tip:'Zur Halbzeit Seitenwechsel. Nicht ruckartig ziehen.'}
];
function drawing(stage){return `<svg viewBox="0 0 295 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vereinfachte Zeichnung: ${stage.name}"><rect x="0" y="0" width="295" height="230" rx="24" fill="#f2f7f2"/><path d="M25 210 H270" stroke="#c8dbcb" stroke-width="2"/><g ${ink}>${poses[stage.pose]}</g><circle cx="245" cy="36" r="16" fill="#dfeae0"/><text x="245" y="41" font-size="12" text-anchor="middle" font-weight="700" fill="#36735d">${STAGES.indexOf(stage)+1}</text></svg>`;}
export function openMakkoGuide({onFinish=()=>{}}={}){
 let step=0,duration=45,remaining=45,running=false,completed=false,ticker=null,target=0,sound=true,closed=false;
 let audio=null;const previous=document.activeElement;const wrap=document.createElement('div');wrap.className='mk610-backdrop';
 wrap.innerHTML='<section class="mk610-dialog" role="dialog" aria-modal="true" aria-label="Makko-Ho Meridian-Stretches"></section>';document.body.append(wrap);
 const panel=wrap.firstElementChild;
 const stop=()=>{running=false;if(ticker!==null){clearInterval(ticker);ticker=null;}};
 const beep=(freq=880)=>{if(!sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio ||=new Audio();if(audio.state==='suspended')void audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.value=.0001;osc.connect(gain);gain.connect(audio.destination);gain.gain.exponentialRampToValueAtTime(.10,audio.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.20);osc.start();osc.stop(audio.currentTime+.21);}catch{ /* silent fallback: visible timer remains authoritative */ }};
 const cleanup=()=>{if(closed)return;closed=true;stop();wrap.remove();document.removeEventListener('keydown',key);document.removeEventListener('visibilitychange',visibility);if(audio){void audio.close().catch(()=>{});audio=null;}previous?.focus?.({preventScroll:true});};
 const key=e=>{if(e.key==='Escape')cleanup();};
 const visibility=()=>{if(document.hidden&&running){remaining=Math.max(0,Math.ceil((target-performance.now())/1000));stop();render();}};
 document.addEventListener('keydown',key);document.addEventListener('visibilitychange',visibility);
 wrap.onclick=e=>{if(e.target===wrap)cleanup();};
 const fmt=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${Math.max(0,n%60).toString().padStart(2,'0')}`;
 const refreshTime=()=>{const t=panel.querySelector('.mk610-time'),ring=panel.querySelector('.mk610-progress');if(t)t.textContent=fmt(remaining);if(ring)ring.style.setProperty('--progress',String(Math.max(0,Math.min(1,(duration-remaining)/duration))));};
 function tick(){if(!running)return;const old=remaining;remaining=Math.max(0,Math.ceil((target-performance.now())/1000));if(old!==remaining)refreshTime();if(remaining===0){stop();completed=true;beep();setTimeout(()=>beep(660),230);render();}}
 function render(){const st=STAGES[step];const finished=remaining===0||completed;
  panel.innerHTML=`<div class="mk610-head"><div><small>BEWEGUNG · MAKKO-HO</small><h2>${step+1}/6 · ${st.name}</h2></div><button class="mk610-exit" aria-label="Schließen">×</button></div>
  <div class="mk610-stages" aria-label="Fortschritt">${STAGES.map((x,i)=>`<span class="${i<step?'done':i===step?'active':''}" title="${x.name}"></span>`).join('')}</div>
  <div class="mk610-main"><div class="mk610-figure">${drawing(st)}<small>Schematische Bewegung · keine Technikdiagnose</small></div><div class="mk610-content"><small class="mk610-element">${st.element}</small><p>${st.desc}</p><div class="mk610-tip">${st.tip}</div><div class="mk610-clock"><div class="mk610-ring mk610-progress" style="--progress:${(duration-remaining)/duration}"><strong class="mk610-time">${fmt(remaining)}</strong></div><div class="mk610-timer-actions"><button type="button" data-go="start">${running?'Pause':remaining===0?'Erneut':'▶ Start'}</button><button type="button" data-go="reset">↺ Zurücksetzen</button><label>Dauer<select data-go="duration"><option value="30" ${duration===30?'selected':''}>30 Sek.</option><option value="45" ${duration===45?'selected':''}>45 Sek.</option><option value="60" ${duration===60?'selected':''}>1 Minute</option><option value="90" ${duration===90?'selected':''}>1½ Minuten</option></select></label></div></div></div></div>
  <div class="mk610-bottom"><span><label><input type="checkbox" data-go="sound" ${sound?'checked':''}/> Signalton</label> · ruhig atmen, keine Schmerzen provozieren</span><div class="mk610-nav"><button data-go="prev" ${step===0?'disabled':''}>Zurück</button><button class="primary" data-go="next">${step===5?'Abschließen ✓':'Weiter →'}</button></div></div>`;
  panel.querySelector('.mk610-exit').onclick=cleanup;
  panel.querySelector('[data-go="start"]').onclick=()=>{if(running){remaining=Math.max(0,Math.ceil((target-performance.now())/1000));stop();render();return;}if(remaining===0)remaining=duration;if(sound&&!audio){try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio=new Audio();void audio.resume();}}catch{}}running=true;target=performance.now()+remaining*1000;ticker=setInterval(tick,200);render();};
  panel.querySelector('[data-go="reset"]').onclick=()=>{stop();remaining=duration;completed=false;render();};
  panel.querySelector('[data-go="duration"]').onchange=e=>{stop();duration=Number(e.target.value)||45;remaining=duration;completed=false;render();};
  panel.querySelector('[data-go="sound"]').onchange=e=>{sound=e.target.checked;};
  panel.querySelector('[data-go="prev"]').onclick=()=>{if(step===0)return;stop();step--;remaining=duration;completed=false;render();};
  panel.querySelector('[data-go="next"]').onclick=async()=>{stop();if(step===5){cleanup();try{await onFinish();}catch(error){console.warn('Makko-Ho Abschluss konnte nicht vorgemerkt werden',error);}return;}step++;remaining=duration;completed=false;render();};
 }
 render();panel.querySelector('[data-go="start"]')?.focus({preventScroll:true});return {close:cleanup};
}
