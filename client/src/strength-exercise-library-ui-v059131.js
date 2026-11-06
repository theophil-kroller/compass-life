/** Compass 0.5.91.31 · Fast opt-in UI. */
import {EXERCISE_LIBRARY_ENTRIES_131,BENCH_REQUIRED_131,exercisePhoto131,lastConfirmedLoad131,singleExercisePlan131} from './strength-exercise-library-model-v059131.js';
import {NEW_EXERCISES_BY_ID_89} from './strength-exercise-library-v0589.js';
import {resumableGuidedSession} from './strength-workout-resume-v57759405.js';
import './strength-exercise-library-ui-v059131.css';
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const armCues=Object.freeze({
 'biceps-curl':'Kurzhanteln seitlich → Ellbogen beugen, Oberarme ruhig halten.',
 'hammer-curl':'Neutralgriff seitlich → zur Schulter ziehen, ohne zu schwingen.',
 'triceps-pushdown':'Am Kabel Ellbogen eng halten → nach unten strecken.',
 'triceps-extension':'Hantel hinter dem Kopf → Arme über Kopf strecken.',
 'wrist-curl':'Unterarme abstützen → Handgelenke kontrolliert beugen.',
 'triceps-curl':'French Press mit SZ-Stange: Arme oben → Ellenbogen beugen.',
 'skullcrusher':'Liegendes Trizepsstrecken mit Kurzhanteln: Gewicht zum Kopf absenken.',
 'reverse-curl':'Im Obergriff von unten nach oben curlen.',
 'concentration-curl':'Ellbogen am Oberschenkel abstützen → Hantel beugen.'
});
/** On-demand dialog; only loads the heavy guided workout after explicit START. */
export function openExerciseLibrary131({state,onSession=async()=>{}}={}){
 if(!state)throw Error('Für ein Einzeltraining zuerst den Compass-Tresor entsperren.');
 const prev=document.activeElement;
 let place='home',section='',query='',selected='',count=3,reps='8–12',closed=false;
 const root=document.createElement('div');root.className='str131-overlay';
 root.innerHTML='<section class="str131-dialog" role="dialog" aria-modal="true" aria-label="Übungsbibliothek"></section>';
 document.body.append(root);const panel=root.firstElementChild;
 const candidates=()=>EXERCISE_LIBRARY_ENTRIES_131.filter(x=>x.places.includes(place)&&(!section||x.section===section)&&(`${x.name} ${x.group} ${x.id}`).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()));
 const current=()=>EXERCISE_LIBRARY_ENTRIES_131.find(x=>x.id===selected);
 const close=()=>{if(closed)return;closed=true;document.removeEventListener('keydown',onKey);root.remove();prev?.focus?.({preventScroll:true});};
 const onKey=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',onKey);
 root.addEventListener('click',e=>{if(e.target===root)close();});
 const updateList=()=>{
  const list=panel.querySelector('[data-results]');if(!list)return;
  const entries=candidates();list.innerHTML=entries.length?entries.map(x=>`<button type="button" data-pick="${escapeHtml(x.id)}" class="str131-item ${selected===x.id?'is-active':''}" aria-pressed="${selected===x.id}"><strong>${escapeHtml(x.name)}</strong><small>${escapeHtml(x.section)}</small></button>`).join(''):'<p class="str131-empty">Keine passende Übung an diesem Trainingsort.</p>';
  list.querySelectorAll('[data-pick]').forEach(button=>button.onclick=()=>{selected=button.dataset.pick;count=3;reps=/plank|farmers-walk|sled-push/.test(selected)?'30 Sek.':'8–12';updateList();updateDetail();});
 };
 const updateDetail=()=>{
  const detail=panel.querySelector('[data-detail]');if(!detail)return;
  const ex=current();if(!ex){detail.innerHTML='<div class="str131-empty">Wähle links eine Übung aus. Hier erscheinen Vorschau und Trainingsstart.</div>';return;}
  const image=exercisePhoto131(ex.id);
  const last=lastConfirmedLoad131(state,ex.id);
  const picture=image?.kind==='pair'?`<img src="${escapeHtml(image.url)}" alt="${escapeHtml(ex.name)}: links START, rechts ENDE" loading="lazy" decoding="async"/>`:image?.kind==='double'?`<div class="str131-pair"><img src="${escapeHtml(image.start)}" alt="START ${escapeHtml(ex.name)}" loading="lazy"/><img src="${escapeHtml(image.end)}" alt="ENDE ${escapeHtml(ex.name)}" loading="lazy"/></div>`:`<p class="str131-noimage">Für diese Übung ist noch kein passendes START-/ENDE-Bild vorhanden. Bitte anhand einer verlässlichen Anleitung ausführen.</p>`;
  detail.innerHTML=`<h3>${escapeHtml(ex.name)}</h3><p class="str131-musclegroup">${escapeHtml(ex.section)} · ${place==='home'?'Zuhause':'Gym'}</p><div class="str131-preview">${picture}</div><p class="str131-cue">${escapeHtml(armCues[ex.id]||NEW_EXERCISES_BY_ID_89.get(ex.id)?.cue||'Die Übung kontrolliert ausführen; Technik und Geräte vor dem Start selbst prüfen.')}</p>${BENCH_REQUIRED_131.has(ex.id)?'<p class="str131-note">Bank erforderlich – bitte sichere Ausstattung prüfen.</p>':''}${last?`<p class="str131-prior">Zuletzt bestätigte Last: <strong>${escapeHtml(last.weightKg)} kg</strong> · ein Hinweis, keine automatische Steigerung</p>`:'<p class="str131-prior">Noch kein bestätigtes Coach-Gewicht dokumentiert.</p>'}<div class="str131-controls"><label>Sätze<select data-sets>${Array.from({length:6},(_,i)=>`<option value="${i+1}" ${count===i+1?'selected':''}>${i+1}</option>`).join('')}</select></label><label>Wiederholungen oder Dauer<input data-reps type="text" value="${escapeHtml(reps)}" maxlength="24" aria-label="Wiederholungen oder Dauer"/></label></div><p class="str131-help">Nur bestätigte Sätze werden mit Datum, Gewicht und RIR in der bestehenden Strength-History gespeichert.</p><button type="button" class="str131-start" data-start>▶ Diese Einzelübung starten</button><p class="str131-error" role="alert" data-error></p>`;
  detail.querySelector('[data-sets]').onchange=e=>{count=Number(e.target.value);};
  detail.querySelector('[data-reps]').onchange=e=>{reps=e.target.value;};
  detail.querySelector('[data-start]').onclick=async()=>{
   const error=detail.querySelector('[data-error]');
   try{
    reps=detail.querySelector('[data-reps]').value;
    const plan=singleExercisePlan131(state,selected,{place,sets:count,reps});
    const prior=resumableGuidedSession(state);
    if(prior&&!window.confirm('Es gibt ein unvollständiges Training. Zusätzlich eine neue Einzelübung starten? Das bestehende Training bleibt gespeichert.'))return;
    const guided=await import('./strength-guided-v5775920.js');
    close();guided.openGuidedWorkout({plan,onSession});
   }catch(e){error.textContent=e.message||'Einzelübung konnte nicht gestartet werden.';}
  };
 };
 panel.innerHTML=`<header class="str131-header"><div><small>COMPASS · STRENGTH</small><h2>Übungsbibliothek</h2><p>Spontan trainieren – jede Übung gehört in dieselbe History.</p></div><button class="str131-close" aria-label="Bibliothek schließen" type="button">×</button></header><div class="str131-filters"><label>Trainingsort<select data-place><option value="home">Zuhause</option><option value="gym">Gym</option></select></label><label>Muskelgruppe<select data-group><option value="">Alle</option>${[...new Set(EXERCISE_LIBRARY_ENTRIES_131.map(x=>x.section))].sort((a,b)=>a.localeCompare(b,'de')).map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('')}</select></label><label>Suche<input data-search type="search" placeholder="Übung suchen …" autocomplete="off"/></label></div><div class="str131-columns"><nav class="str131-results" aria-label="Übungen" data-results></nav><article class="str131-detail" data-detail></article></div>`;
 panel.querySelector('.str131-close').onclick=close;
 panel.querySelector('[data-place]').onchange=e=>{place=e.target.value;selected='';updateList();updateDetail();};
 panel.querySelector('[data-group]').onchange=e=>{section=e.target.value;selected='';updateList();updateDetail();};
 panel.querySelector('[data-search]').oninput=e=>{query=e.target.value;updateList();};
 updateList();updateDetail();panel.querySelector('[data-search]')?.focus({preventScroll:true});
 return {close};
}
