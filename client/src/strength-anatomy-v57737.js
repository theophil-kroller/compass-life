/** Compass 0.5.77.37 · Detailed voluntary strength-muscle visualization.
 * Exercise -> regions is literature-informed MODEL / hypothesis, NOT measured EMG,
 * recovery status, muscle fatigue, injury risk or anatomical imaging. Count only
 * deliberately assigned exercises; unknown Garmin sets stay unclassified.
 */
import {cyclingMuscleSummary} from './cycling-muscles-v57737.js';
export {cyclingMuscleSummary};
export const ANATOMY_REGIONS=Object.freeze([
 ['pectoral_upper','Obere Brust','front'],['pectoral_lower','Brustmuskel','front'],
 ['deltoid_front','Vordere Schulter','front'],['deltoid_side','Seitliche Schulter','both'],['deltoid_rear','Hintere Schulter','back'],
 ['biceps','Bizeps','front'],['brachialis','Brachialis','front'],['triceps','Trizeps','back'],
 ['forearm_flex','Unterarm-Beuger','front'],['forearm_ext','Unterarm-Strecker','back'],
 ['rectus_abdominis','Gerade Bauchmuskeln','front'],['obliques','Seitliche Bauchmuskeln','front'],
 ['trapezius_upper','Oberer Trapezmuskel','back'],['trapezius_mid','Mittlerer Trapezmuskel','back'],
 ['rhomboids','Rautenmuskel','back'],['latissimus','Latissimus','back'],['erector_spinae','Rückenstrecker','back'],
 ['glute_max','Großer Gesäßmuskel','back'],['glute_med','Seitlicher Gesäßmuskel','back'],
 ['quadriceps','Quadrizeps','front'],['adductors','Adduktoren','front'],['hamstrings','Beinbeuger','back'],
 ['calves_gastro','Wadenmuskel (Gastrocnemius)','back'],['calves_soleus','Wadenmuskel (Soleus)','back'],['tibialis','Schienbeinmuskel','front']
 ].map(([id,label,side])=>Object.freeze({id,label,side})));
const r=(primary,secondary=[])=>Object.freeze({primary,secondary});
/** Stable Compass IDs (not Garmin-internal numeric codes). Compound lifts can have
 * more than one primary action, especially curl→press. Synergists are simplified. */
export const EXERCISE_ANATOMY=Object.freeze({
 bench:r(['pectoral_lower','pectoral_upper'],['deltoid_front','triceps']),
 'incline-bench':r(['pectoral_upper'],['deltoid_front','triceps']),
 pushup:r(['pectoral_lower'],['triceps','deltoid_front','rectus_abdominis']),
 'chest-press':r(['pectoral_lower'],['triceps','deltoid_front']),
 'chest-fly':r(['pectoral_lower','pectoral_upper'],['deltoid_front']),
 pullup:r(['latissimus'],['biceps','brachialis','rhomboids','forearm_flex']),
 'lat-pulldown':r(['latissimus'],['biceps','brachialis','rhomboids']),
 'cable-row':r(['latissimus','rhomboids'],['trapezius_mid','biceps','deltoid_rear']),
 'dumbbell-row':r(['latissimus','rhomboids'],['biceps','deltoid_rear']),
 'barbell-row':r(['latissimus','rhomboids'],['trapezius_mid','biceps','erector_spinae','deltoid_rear']),
 deadlift:r(['glute_max','hamstrings','erector_spinae'],['quadriceps','trapezius_mid','forearm_flex']),
 'romanian-deadlift':r(['hamstrings','glute_max'],['erector_spinae']),
 squat:r(['quadriceps','glute_max'],['adductors','erector_spinae','rectus_abdominis']),
 'leg-press':r(['quadriceps','glute_max'],['adductors']),
 lunge:r(['quadriceps','glute_max'],['adductors','hamstrings']),
 'leg-extension':r(['quadriceps']),
 'leg-curl':r(['hamstrings']),
 'hip-thrust':r(['glute_max'],['quadriceps','hamstrings','glute_med']),
 'glute-bridge':r(['glute_max'],['hamstrings','quadriceps']),
 'calf-raise':r(['calves_gastro','calves_soleus']),
 'shoulder-press':r(['deltoid_front'],['deltoid_side','triceps','trapezius_upper']),
 'lateral-raise':r(['deltoid_side'],['trapezius_upper']),
 'face-pull':r(['deltoid_rear','rhomboids'],['trapezius_mid']),
 'reverse-fly':r(['deltoid_rear'],['rhomboids','trapezius_mid']),
 'biceps-curl':r(['biceps'],['brachialis','forearm_flex']),
 'hammer-curl':r(['brachialis','biceps'],['forearm_flex']),
 'triceps-pushdown':r(['triceps']),
 'triceps-extension':r(['triceps']),
 'wrist-curl':r(['forearm_flex']),
 plank:r(['rectus_abdominis','obliques'],['deltoid_front','glute_max']),
 'dead-bug':r(['rectus_abdominis','obliques']),
 crunch:r(['rectus_abdominis']),
 'pallof-press':r(['obliques','rectus_abdominis'],['deltoid_front']),
 'military-press':r(['deltoid_front'],['deltoid_side','triceps','trapezius_upper','pectoral_upper','rectus_abdominis']),
 'curl-to-press':r(['biceps','deltoid_front'],['brachialis','deltoid_side','triceps','forearm_flex']),
 'hammer-to-press':r(['brachialis','deltoid_front'],['biceps','deltoid_side','triceps','forearm_flex']),
 'triceps-curl':r(['triceps']),skullcrusher:r(['triceps']),
 'close-grip-bench':r(['triceps'],['pectoral_lower','deltoid_front']),
 'reverse-curl':r(['brachialis','forearm_ext'],['biceps']),
 'concentration-curl':r(['biceps'],['brachialis']),
 'seated-dumbbell-press':r(['deltoid_front'],['deltoid_side','triceps','trapezius_upper'])
});
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n.toLocaleString('de-AT',{maximumFractionDigits:1});
const validSet=s=>s&&s.exerciseId&&Number(s.reps)>0;
export function detailedMuscleData(model){
 const data=Object.fromEntries(ANATOMY_REGIONS.map(region=>[region.id,{...region,primary:0,secondary:0,index:0}]));
 let mapped=0,unmapped=0;
 for(const session of model?.sessions||[])for(const set of session.sets||[]){
  // No automatic anatomical detail from broad FIT category or incomplete CSV summary.
  const anatomy=EXERCISE_ANATOMY[set?.exerciseId];
  if(!validSet(set)||!anatomy){unmapped++;continue;}
  mapped++;
  for(const id of anatomy.primary)if(data[id])data[id].primary++;
  for(const id of anatomy.secondary)if(data[id]&&!anatomy.primary.includes(id))data[id].secondary++;
 }
 for(const x of Object.values(data))x.index=x.primary+x.secondary*.5;
 const max=Math.max(1,...Object.values(data).map(x=>x.index));
 return {regions:data,ranked:Object.values(data).filter(x=>x.index>0).sort((a,b)=>b.index-a.index),max,mapped,unmapped};
}
/* Original editable anatomical-style geometry, not a copied Garmin image.
 * 200x440 viewbox, mirrored regions, separate anatomical segments where useful. */
const SHAPES={
 front:{
 pectoral_upper:['M77 105 Q88 100 99 106 L99 119 Q84 122 72 116 Z','M123 105 Q112 100 101 106 L101 119 Q116 122 128 116 Z'],
 pectoral_lower:['M72 117 Q86 124 99 121 L99 151 Q77 154 71 133 Z','M128 117 Q114 124 101 121 L101 151 Q123 154 129 133 Z'],
 deltoid_front:['M70 92 Q60 90 54 105 L61 120 L78 105 Z','M130 92 Q140 90 146 105 L139 120 L122 105 Z'],
 deltoid_side:['M53 104 Q47 111 46 122 L53 133 62 120 Z','M147 104 Q153 111 154 122 L147 133 138 120 Z'],
 biceps:['M55 135 L64 140 Q64 153 57 172 L47 167 Q52 144 55 135 Z','M145 135 L136 140 Q136 153 143 172 L153 167 Q148 144 145 135 Z'],
 brachialis:['M47 168 L57 173 L56 183 L43 181 Z','M153 168 L143 173 L144 183 L157 181 Z'],
 forearm_flex:['M43 182 L56 186 L45 222 L33 218 Z','M157 182 L144 186 L155 222 L167 218 Z'],
 rectus_abdominis:['M87 157 L99 158 L99 176 L87 175 Z','M101 158 L113 157 L113 175 L101 176 Z','M87 178 L99 179 L99 195 L86 193 Z','M101 179 L113 178 L114 193 L101 195 Z','M88 198 L99 199 L99 212 L89 211 Z','M101 199 L112 198 L111 211 L101 212 Z'],
 obliques:['M75 155 L85 157 L85 195 L77 201 L72 185 Z','M125 155 L115 157 L115 195 L123 201 L128 185 Z'],
 quadriceps:['M78 230 L93 230 L92 304 L77 317 L73 289 Z','M95 230 L100 232 L98 312 L91 318 Z','M122 230 L107 230 L108 304 L123 317 L127 289 Z','M105 230 L100 232 L102 312 L109 318 Z'],
 adductors:['M100 230 L96 229 L93 271 L100 283 Z','M100 230 L104 229 L107 271 L100 283 Z'],
 tibialis:['M76 332 L87 332 L88 387 L78 396 Z','M124 332 L113 332 L112 387 L122 396 Z']
 },
 back:{
 trapezius_upper:['M92 92 L100 102 L85 116 L78 106 Z','M108 92 L100 102 L115 116 L122 106 Z'],
 trapezius_mid:['M84 118 L100 109 L100 145 L78 140 Z','M116 118 L100 109 L100 145 L122 140 Z'],
 rhomboids:['M87 148 L100 143 L100 170 L84 162 Z','M113 148 L100 143 L100 170 L116 162 Z'],
 deltoid_side:['M53 104 Q47 111 46 122 L53 133 62 120 Z','M147 104 Q153 111 154 122 L147 133 138 120 Z'],
 deltoid_rear:['M70 92 Q60 90 54 105 L61 120 L78 105 Z','M130 92 Q140 90 146 105 L139 120 L122 105 Z'],
 latissimus:['M77 142 L99 173 L99 197 L76 185 L69 164 Z','M123 142 L101 173 L101 197 L124 185 L131 164 Z'],
 triceps:['M55 135 L64 140 L57 182 L44 177 Z','M145 135 L136 140 L143 182 L156 177 Z'],
 forearm_ext:['M43 182 L56 186 L45 222 L33 218 Z','M157 182 L144 186 L155 222 L167 218 Z'],
 erector_spinae:['M92 174 L99 182 L99 211 L88 209 Z','M108 174 L101 182 L101 211 L112 209 Z'],
 glute_med:['M75 215 Q84 205 99 212 L97 224 L75 230 Z','M125 215 Q116 205 101 212 L103 224 L125 230 Z'],
 glute_max:['M75 230 L98 225 L99 247 Q86 254 74 246 Z','M125 230 L102 225 L101 247 Q114 254 126 246 Z'],
 hamstrings:['M77 252 L97 252 L95 319 L75 313 Z','M123 252 L103 252 L105 319 L125 313 Z'],
 calves_gastro:['M77 329 L92 330 L93 357 L85 377 L76 363 Z','M123 329 L108 330 L107 357 L115 377 L124 363 Z'],
 calves_soleus:['M84 377 L94 365 L91 396 L79 400 Z','M116 377 L106 365 L109 396 L121 400 Z']
 }
};
const neutral='#E1E4E3';
export function muscleTone(value,primary,secondary,mode='roles'){
 if(!primary&&!secondary)return neutral;
 if(mode==='roles')return primary>0?'#E64B38':'#F8C94A';
 return value<1.5?'#F6D763':value<3?'#FEB343':value<5?'#F1872E':value<9?'#E35B32':'#C83C3C';
}
export function detailedMuscleSvg(model,side='front',mode='roles',cycling=null,activity='combined'){
 const data=detailedMuscleData(model),shapes=SHAPES[side]||SHAPES.front;
 const rides=cycling?.rides>0&&activity!=='strength';const regions=rides?cycling.regions:{primary:[],secondary:[]};
 const zones=Object.entries(shapes).map(([id,paths])=>{const r=data.regions[id],bikePrimary=regions.primary.includes(id),bikeSecondary=regions.secondary.includes(id);
  const strengthVisible=activity!=='cycling';
  const color=strengthVisible&&((r?.primary||0)+(r?.secondary||0)>0)?muscleTone(r?.index||0,r?.primary||0,r?.secondary||0,mode):bikePrimary?'#F28C25':bikeSecondary?'#F6C95A':neutral;
  const overlap=rides&&activity==='combined'&&(bikePrimary||bikeSecondary)&&((r?.primary||0)+(r?.secondary||0)>0);
  const stroke=overlap?'#E59D29':'#fff',strokeWidth=overlap?3.4:2;
  const label=`${r?.label||id}: ${r?.primary||0} Hauptsätze; ${r?.secondary||0} unterstützende Satzbeteiligungen${bikePrimary||bikeSecondary?'; bei dokumentiertem Radfahren anatomisch mitbeansprucht (kein Satz)': ''}`;
  return paths.map(path=>`<path d="${path}" fill="${color}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" tabindex="0" aria-label="${esc(label)}"><title>${esc(label)}</title></path>`).join('');}).join('');
 return `<svg viewBox="0 0 200 440" class="str728-body str737-detail-svg" role="img" aria-label="Feinere anatomische Muskelkarte ${side==='front'?'vorn':'hinten'}, ${mode==='load'?'Satzbelastung':'Haupt- und Nebenbeteiligung'}">
 <ellipse cx="100" cy="42" rx="27" ry="32" fill="#F3F5F3" stroke="#D4DAD7" stroke-width="1.8"/><path d="M92 69 L108 69 L110 89 L90 89 Z" fill="#F0F1F0" stroke="#D4DAD7"/>
 <path d="M69 91 Q100 79 131 91 L153 106 170 200 153 229 138 221 147 181 128 218 127 250 124 329 126 406 107 409 99 335 93 407 77 409 73 327 75 246 71 218 53 179 62 220 47 228 30 200 47 106 Z" fill="#F2F3F2" stroke="#D3D8D5" stroke-width="1.9"/>
 ${zones}<path d="M91 106 Q100 110 109 106" fill="none" stroke="#F9FAF9" stroke-width="1.4"/></svg>`;
}
export function detailedMuscleTable(model,cycling=null,activity='combined'){const x=detailedMuscleData(model),rides=cycling?.rides>0&&activity!=='strength';
 const visible=Object.values(x.regions).filter(r=>(activity!=='cycling'&&r.index>0)||(rides&&(cycling.regions.primary.includes(r.id)||cycling.regions.secondary.includes(r.id))));
 const rows=visible.sort((a,b)=>b.index-a.index||(cycling?.regions.primary.includes(b.id)?1:0)-(cycling?.regions.primary.includes(a.id)?1:0)).slice(0,24).map(r=>`<div class="str737-detail-row"><span class="str737-circle" style="background:${activity!=='cycling'&&r.index>0?muscleTone(r.index,r.primary,r.secondary,'load'):cycling?.regions.primary.includes(r.id)?'#F28C25':'#F6C95A'}"></span><span>${esc(r.label)}</span><strong>${activity==='cycling'?'Radfahren':fmt(r.primary)+' Haupt'}</strong><small>${rides&&(cycling.regions.primary.includes(r.id)||cycling.regions.secondary.includes(r.id))?'🚲 Ausdauerbeteiligung':r.secondary?`${fmt(r.secondary)} unterstützend`:''}</small></div>`).join('');
 return `<section class="str737-detail-table" aria-label="Feine Muskelgruppen"><div class="str737-detail-head"><strong>Feine Muskelgruppen</strong><small>${x.mapped} manuell zugeordnete Sätze · ${x.unmapped} ohne feine Zuordnung · ${cycling?.rides||0} Radtouren separat</small></div>${rows||'<p>Noch keine detailliert zugeordneten Sätze. Bitte im Übungseditor Übungen auswählen.</p>'}</section>`;
}
