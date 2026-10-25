/** Opt-in local training assistant. Imported ONLY after clicking "Trainingscoach".
 * No API calls, no external model, and no changes to private strength data.
 * Heuristics are training-planning aids rather than EMG or injury assessment.
 */
import {strengthPeriod} from './strength-insights-v57728.js';
import {detailedMuscleData} from './strength-anatomy-v57737.js';
import {EXERCISES} from './strength-editor-v57732.js';
import './strength-coach-v5775910.css';

const safe=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const GROUPS={back:'Rücken/Lat',shoulders:'Schultern',core:'Bauch/Rumpf',chest:'Brust',quads:'Oberschenkel',posterior:'Beinrückseite',glutes:'Gesäß',biceps:'Bizeps',triceps:'Trizeps'};
const GOALS={
 balance:{label:'Ausgeglichen trainieren',targets:['back','shoulders','core','chest','quads','posterior','glutes'],note:'Unterrepräsentierte Muskelgruppen nach belegten Sätzen berücksichtigen.'},
 vtaper:{label:'V-Taper',targets:['back','shoulders','back','shoulders','core'],note:'Latissimus, seitliche/hintere Schultern und Rumpf betonen; Beine bleiben im Plan.'},
 abs:{label:'Bauchmuskeln / Sixpack',targets:['core','core','back','quads','posterior'],note:'Rumpf kräftigen; sichtbare Bauchmuskeln hängen auch von Körperfett und Ernährung ab. Kein lokaler Fettabbau.'},
 strength:{label:'Allgemeine Kraft',targets:['quads','chest','back','posterior','shoulders','core'],note:'Grundbewegungen und progressive, kontrollierte Laststeigerung. StrongLifts 5×5 ist eine mögliche Struktur.'}
};
const IDEAS=[
 ['ab-wheel-kneeling','core','home','rollout','Vom Knie abrollen; Rippen unten, Gesäß leicht anspannen. Nur so weit rollen, wie der Rumpf stabil bleibt.','abs,balance,vtaper'],
 ['plank','core','home','plank','Rumpf fest halten, ohne ins Hohlkreuz zu sinken.','abs,balance'],
 ['dead-bug','core','home','core','Langsam gegenläufig Arm und Bein strecken, unterer Rücken stabil.','abs,balance'],
 ['dumbbell-floor-press','chest','home','press','Auf dem Boden drücken; Ellbogen kontrolliert ablegen.','strength,balance'],
 ['dumbbell-row','back','home','pull','Einarmig ziehen, Schulterblatt Richtung Wirbelsäule führen.','vtaper,balance,strength'],
 ['dumbbell-pullover','back','home','pull','Leicht starten, Schultern beweglich halten, nicht ins Hohlkreuz gehen.','vtaper'],
 ['dumbbell-lateral-raise','shoulders','home','raise','Leichtes Gewicht, Arme seitlich kontrolliert anheben.','vtaper,balance'],
 ['goblet-squat','quads','home','squat','Brust aufrecht, Knie in Zehenrichtung.','strength,balance'],
 ['dumbbell-romanian-deadlift','posterior','home','hinge','Hüfte zurückführen, Wirbelsäule neutral.','strength,balance'],
 ['dumbbell-shoulder-press','shoulders','home','press','Ohne Schwung über Kopf drücken.','strength,vtaper'],
 ['barbell-overhead-press','shoulders','home','press','Nur mit sicher fixierter Verbindungsstange und geeigneter Last; kontrolliert drücken.','strength'],
 ['barbell-row','back','home','pull','Mit sicher verbundener Hantel und stabiler Rumpfposition rudern.','strength,vtaper'],
 ['bench','chest','gym','press','Stabile Schulterposition, kontrollierte Bewegung.','strength'],
 ['squat','quads','gym','squat','Saubere Tiefe, Technik vor Gewicht.','strength,balance'],
 ['deadlift','posterior','gym','hinge','Hantel nah am Körper, Rumpf stabil.','strength,balance'],
 ['lat-pulldown','back','gym','pull','Zur oberen Brust ziehen, nicht hinter den Nacken.','vtaper,balance'],
 ['cable-straight-arm-pulldown','back','gym','pull','Arme weitgehend gestreckt, Bewegung aus der Schulter.','vtaper'],
 ['cable-single-arm-row','back','gym','pull','Pro Seite vollständig und kontrolliert ziehen.','vtaper,balance'],
 ['cable-lateral-raise','shoulders','gym','raise','Kabelzug auf Schulterhöhe kontrollieren; leicht starten.','vtaper'],
 ['cable-rear-delt-fly','shoulders','gym','raise','Arme weit öffnen, Schultern nicht hochziehen.','vtaper,balance'],
 ['face-pull','shoulders','gym','pull','Zum Gesicht ziehen, Ellenbogen nach außen.','vtaper,balance'],
 ['cable-crunch','core','gym','core','Rumpf beugen, nicht nur die Hüfte bewegen.','abs'],
 ['cable-woodchop','core','gym','core','Drehung ruhig führen; keine ruckartige Rotation.','abs'],
 ['barbell-row','back','gym','pull','Oberkörper stabil, kontrolliert zum Rumpf rudern.','strength,vtaper']
];
const catalog=new Map(EXERCISES.map(x=>[x.id,x]));
const shape=(kind)=>{
 const figure='<circle cx="48" cy="24" r="7"/><path d="M48 32 L48 70 M48 40 L28 58 M48 40 L69 57 M48 70 L31 99 M48 70 L65 99"/>';
 const variants={
 rollout:'<circle cx="96" cy="92" r="10"/><path d="M23 89 L39 76 L67 76 L87 91 M23 89 L10 108 M44 70 L32 58 M39 76 L31 98"/>',
 pull:'<path d="M8 20 H86 M30 20 V40 M62 20 V40"/><circle cx="47" cy="54" r="8"/><path d="M47 62 V88 M47 69 L30 42 M47 69 L64 42 M47 88 L28 107 M47 88 L66 107"/>',
 press:'<path d="M19 23 H77 M35 23 L35 46 M61 23 L61 46"/>'+figure,
 raise:'<circle cx="48" cy="24" r="7"/><path d="M48 31 V75 M48 44 L14 45 M48 44 L82 45 M48 75 L32 103 M48 75 L64 103"/>',
 squat:'<circle cx="48" cy="23" r="7"/><path d="M48 30 L44 63 M44 42 L27 57 M44 42 L62 57 M44 63 L67 74 L59 103 M44 63 L25 76 L18 102"/>',
 hinge:'<circle cx="71" cy="33" r="7"/><path d="M64 37 L37 64 M49 53 L51 87 M37 64 L21 88 M51 87 L46 107 M51 87 L69 105"/>',
 core:'<circle cx="51" cy="38" r="7"/><path d="M48 45 L45 73 M45 52 L20 67 M45 52 L73 68 M45 73 L22 91 M45 73 L77 92"/>',
 plank:'<circle cx="20" cy="64" r="7"/><path d="M27 67 L64 70 L92 88 M26 68 L16 89 M64 70 L59 92"/>'
 };
 return `<svg viewBox="0 0 115 115" role="img" aria-label="Schematische Bewegungsillustration" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${variants[kind]||figure}</g><path d="M5 110 H110" stroke="currentColor" stroke-opacity=".2"/></svg>`;
};
export function proposeStrengthTraining(state,{goal='balance',equipment='home',today}={}){
 const profile=GOALS[goal]||GOALS.balance;
 const period=strengthPeriod(state,{range:'28',today:today||new Date().toISOString().slice(0,10)});
 const anatomy=detailedMuscleData(period);
 const counts=Object.fromEntries(Object.keys(GROUPS).map(group=>[group,0]));
 const last=Object.fromEntries(Object.keys(GROUPS).map(group=>[group,null]));
 const recorded=period.events.filter(x=>x.exerciseId&&Number(x.reps)>0&&catalog.has(x.exerciseId));
 for(const event of recorded){const group=catalog.get(event.exerciseId)?.primary;if(!(group in counts))continue;counts[group]++;if(event.day&&(!last[group]||event.day>last[group]))last[group]=event.day;}
 const mapped=recorded.length;
 const sorted=IDEAS.filter(([id,,place])=>place===equipment&&catalog.has(id)).map(([id,muscle,place,kind,cue,priorities],i)=>{
   const item=catalog.get(id);const priority=priorities.split(',').includes(goal)?5:0;
   const focus=profile.targets.filter(x=>x===muscle).length*4;
   const exposure=counts[muscle]||0;
   const balance=mapped>0?Math.max(0,8-exposure)*.75:0;
   const daysSince=last[muscle]&&/^\d{4}-\d{2}-\d{2}$/.test(last[muscle])?Math.max(0,Math.round((Date.parse((today||new Date().toISOString().slice(0,10))+'T12:00:00Z')-Date.parse(last[muscle]+'T12:00:00Z'))/86400000)):null;
   const recency=mapped>0&&daysSince!==null?(daysSince>=7?1:daysSince<=1?-1:0):0;
   const fine=anatomy.regions?.[muscle==='back'?'latissimus':muscle==='shoulders'?'deltoid_side':'rectus_abdominis']?.primary||0;
   return {id,title:item.name,muscle,place,kind,cue,priority,score:priority+focus+balance+recency-Math.min(4,fine*.25)-i*.01,
    explanation:mapped>0?`${GROUPS[muscle]}: ${exposure} selbst zugeordnete Hauptsätze in 28 Tagen${daysSince!==null?` · zuletzt vor ${daysSince} Tagen`:''}. Nicht erfasste Einheiten bleiben unbekannt.`:`Für ${profile.label} geeignet; noch keine ausreichende Muskelhistorie zum Vergleich.`};
 }).sort((a,b)=>b.score-a.score);
 const selected=[],byMuscle=new Map();
 for(const x of sorted){if(selected.length>=6)break;const n=byMuscle.get(x.muscle)||0;if(n>=2)continue;byMuscle.set(x.muscle,n+1);selected.push(x);}
 return {profile,selected,period,mapped,counts,coverageKnown:mapped>0,anatomy};
}
export function openStrengthCoach({state,today}){
 let equipment='home',goal='balance';const host=document.createElement('div');host.className='str610-backdrop';host.innerHTML='<section class="str610-dialog" role="dialog" aria-modal="true" aria-label="Compass Trainingscoach"></section>';document.body.append(host);
 const dialog=host.firstElementChild;const before=document.activeElement;let closed=false;
 const close=()=>{if(closed)return;closed=true;host.remove();document.removeEventListener('keydown',onKey);before?.focus?.({preventScroll:true});};
 const onKey=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',onKey);
 host.addEventListener('click',e=>{if(e.target===host)close();});
 function draw(){const plan=proposeStrengthTraining(state,{goal,equipment,today});
 dialog.innerHTML=`<div class="str610-title"><div><small>COMPASS · LOKALER TRAININGSCOACH</small><h2>Trainiere mit System</h2></div><button class="str610-close" aria-label="Schließen" type="button">×</button></div>
 <div class="str610-options"><label>Ziel<select class="str610-goal">${Object.entries(GOALS).map(([id,x])=>`<option value="${id}" ${goal===id?'selected':''}>${safe(x.label)}</option>`).join('')}</select></label><label>Equipment<select class="str610-equipment"><option value="home" ${equipment==='home'?'selected':''}>🏠 Zuhause · Kurzhanteln, Stange, Ab Wheel</option><option value="gym" ${equipment==='gym'?'selected':''}>🏋️ Gym · Kabelzug & Langhantel</option></select></label></div>
 <p class="str610-intro">${safe(plan.profile.note)}</p><div class="str610-quality">${plan.coverageKnown?`Analysiert: ${plan.mapped} manuell zugeordnete Sätze der letzten 28 Tage. ${plan.period.unassigned} Sätze ohne genaue Muskelzuordnung.`:'Noch nicht genügend individuell zugeordnete Sätze für einen echten Muskelbalance-Vergleich. Vorschläge beruhen zunächst auf Ziel und Equipment.'}</div>
 <div class="str610-grid">${plan.selected.map((x,i)=>`<article class="str610-exercise"><div class="str610-exercise-drawing">${shape(x.kind)}</div><div><small>${i+1} · ${safe(GROUPS[x.muscle])}</small><h3>${safe(x.title)}</h3><p>${safe(x.cue)}</p><span>${safe(x.explanation)}</span></div></article>`).join('')}</div>
 <p class="str610-disclaimer">Schematische Bewegungsbilder. Keine Messung von Muskelwachstum oder Belastbarkeit. Keine automatisch angeordneten Trainingstage oder Diagnosen. Technik und Erholung haben Vorrang.</p>`;
 dialog.querySelector('.str610-close').onclick=close;
 dialog.querySelector('.str610-goal').onchange=e=>{goal=e.target.value;draw();};
 dialog.querySelector('.str610-equipment').onchange=e=>{equipment=e.target.value;draw();};
 }
 draw();dialog.querySelector('select')?.focus({preventScroll:true});return {close};
}
