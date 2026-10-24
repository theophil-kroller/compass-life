/** Compass 0.5.77.32. Opt-in local annotations of Garmin strength training.
 * This is an independent, editorial exercise catalog, not a copy of Garmin's proprietary list.
 * Muscle assignment is a practical approximation; never a measured activation.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const EXERCISES=Object.freeze([
 ['bench','Bankdrücken','Brust','chest',['triceps','shoulders']],
 ['incline-bench','Schrägbankdrücken','Brust','chest',['shoulders','triceps']],
 ['pushup','Liegestütze','Brust','chest',['triceps','shoulders']],
 ['chest-press','Brustpresse','Brust','chest',['triceps','shoulders']],
 ['chest-fly','Butterfly / Fliegende','Brust','chest',['shoulders']],
 ['pullup','Klimmzüge','Rücken','back',['biceps','forearms']],
 ['lat-pulldown','Latzug','Rücken','back',['biceps','forearms']],
 ['cable-row','Rudern am Kabel','Rücken','back',['biceps']],
 ['dumbbell-row','Einarmiges Kurzhantelrudern','Rücken','back',['biceps']],
 ['barbell-row','Langhantelrudern','Rücken','back',['biceps','posterior']],
 ['deadlift','Kreuzheben','Rücken / Beine','posterior',['back','glutes']],
 ['romanian-deadlift','Rumänisches Kreuzheben','Beine','posterior',['glutes','back']],
 ['squat','Kniebeugen','Beine','quads',['glutes','posterior']],
 ['leg-press','Beinpresse','Beine','quads',['glutes']],
 ['lunge','Ausfallschritte','Beine','quads',['glutes','posterior']],
 ['leg-extension','Beinstrecker','Beine','quads',[]],
 ['leg-curl','Beinbeuger','Beine','posterior',[]],
 ['hip-thrust','Hip Thrust','Beine','glutes',['posterior']],
 ['glute-bridge','Glute Bridge','Beine','glutes',['posterior']],
 ['calf-raise','Wadenheben','Beine','calves',[]],
 ['shoulder-press','Schulterdrücken','Schultern','shoulders',['triceps']],
 ['lateral-raise','Seitheben','Schultern','shoulders',[]],
 ['face-pull','Face Pull','Schultern','shoulders',['back']],
 ['reverse-fly','Reverse Fly','Schultern','shoulders',['back']],
 ['biceps-curl','Bizepscurls','Arme','biceps',['forearms']],
 ['hammer-curl','Hammercurls','Arme','biceps',['forearms']],
 ['triceps-pushdown','Trizepsdrücken','Arme','triceps',[]],
 ['triceps-extension','Überkopf-Trizepsstrecken','Arme','triceps',[]],
 ['wrist-curl','Unterarmcurls','Arme','forearms',[]],
 ['plank','Plank','Rumpf','core',['shoulders']],
 ['dead-bug','Dead Bug','Rumpf','core',[]],
 ['crunch','Crunches','Rumpf','core',[]],
 ['pallof-press','Pallof Press','Rumpf','core',['shoulders']],
 // Compass .33: compound exercises that also target primary/secondary muscle groups.
 ['military-press','Military Press (stehend, Langhantel)','StrongLifts 5×5','shoulders',['triceps','core']],
 ['curl-to-press','Curl to Press (Bizepscurl → Schulterdrücken)','Kombinationsübungen','biceps',['shoulders','triceps','forearms']],
 ['hammer-to-press','Hammer Curl to Press (Hammercurl → Schulterdrücken)','Kombinationsübungen','shoulders',['biceps','triceps','forearms']],
 ['triceps-curl','Trizeps-Curl / French Press (Strecken)','Arme','triceps',[]],
 ['skullcrusher','Skull Crushers / liegendes Trizepsstrecken','Arme','triceps',[]],
 ['close-grip-bench','Enges Bankdrücken','Brust','triceps',['chest','shoulders']],
 ['reverse-curl','Reverse Curls','Arme','forearms',['biceps']],
 ['concentration-curl','Konzentrationscurls','Arme','biceps',['forearms']],
 ['seated-dumbbell-press','Kurzhantel-Schulterdrücken sitzend','Schultern','shoulders',['triceps']]
].map(([id,name,group,primary,secondary])=>Object.freeze({id,name,group,primary,secondary})));
export const STRONGLIFTS_5X5=Object.freeze({
 A:Object.freeze([{exerciseId:'squat',sets:5,reps:5},{exerciseId:'bench',sets:5,reps:5},{exerciseId:'barbell-row',sets:5,reps:5}]),
 B:Object.freeze([{exerciseId:'squat',sets:5,reps:5},{exerciseId:'military-press',sets:5,reps:5},{exerciseId:'deadlift',sets:1,reps:5}])
});
const byId=new Map(EXERCISES.map(x=>[x.id,x]));
export function manualExerciseMuscles(id){const x=byId.get(id);return x?{name:x.name,primary:x.primary,secondary:x.secondary,known:true}:{name:'Übung offen',primary:null,secondary:[],known:false};}
export function strengthAnnotationKey(s){return String(s?.id||'');}
const offsetMatch=(a,b)=>{const x=Date.parse(a||''),y=Date.parse(b||'');return Number.isFinite(x)&&Number.isFinite(y)&&[0,-2,-1,1,2].some(h=>Math.abs(x-y+h*3600000)<150000);};
const matches=(annotation,session)=>annotation.sessionId===session.id||annotation.start===session.start||offsetMatch(annotation.start,session.start);
export function findStrengthAnnotation(state,session){return (state?.strengthJournal?.annotations||[]).filter(a=>matches(a,session)).sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')))[0]||null;}
export function applyStrengthAnnotations(state,sessions=[]){return sessions.map(session=>{
 const ann=findStrengthAnnotation(state,session);if(!ann)return session;
 const base=Array.isArray(session.sets)?session.sets:[];
 // Fresh imports may add sets; keep new Garmin sets while preserving manually corrected fields.
 const count=Math.max(base.length,ann.sets.length),sets=[];
 for(let i=0;i<count;i++){
  const raw=base[i]||{index:i,start:session.start,end:session.end,category:null,subtype:null,exercise:'Übung nicht zugeordnet',reps:null,weightKg:null};
  const edit=ann.sets[i];if(!edit){sets.push(raw);continue;}
  const x=manualExerciseMuscles(edit.exerciseId);sets.push({...raw,index:i,exerciseId:edit.exerciseId||null,exercise:edit.exerciseId?x.name:raw.exercise,reps:edit.reps,weightKg:edit.weightKg,primary:x.primary,secondary:x.secondary,knownMuscles:x.known,manuallyEdited:true});
 }
 return {...session,sets,summaryOnly:false,manuallyAnnotated:true};
});}
const toNumber=(v,min,max,integer=false)=>{if(v==null||String(v).trim()==='')return null;const n=Number(String(v).replace(',','.'));if(!Number.isFinite(n)||n<min||n>max||(integer&&!Number.isInteger(n)))throw Error('Ungültige Angabe bei Sätzen / Wiederholungen / Gewicht.');return n;};
export function putStrengthAnnotation(state,{sessionId,start,sets}){
 if(!sessionId||!start||!Number.isFinite(Date.parse(start)))throw Error('Trainingseinheit fehlt.');
 if(!Array.isArray(sets)||!sets.length||sets.length>80)throw Error('Bitte zwischen 1 und 80 Sätze angeben.');
 const cleaned=sets.map(s=>({exerciseId:byId.has(s.exerciseId)?s.exerciseId:null,reps:toNumber(s.reps,0,500,true),weightKg:toNumber(s.weightKg,0,500)}));
 state.strengthJournal??={annotations:[]};state.strengthJournal.annotations??=[];
 const old=state.strengthJournal.annotations.findIndex(x=>x.sessionId===sessionId||x.start===start);
 const item={sessionId,start,sets:cleaned,updatedAt:new Date().toISOString(),source:'manual-compass'};
 if(old<0)state.strengthJournal.annotations.push(item);else state.strengthJournal.annotations[old]=item;
 return item;
}
export function strengthSetRow(i,s={}){
 const groups=['StrongLifts 5×5',...new Set(EXERCISES.map(x=>x.group).filter(g=>g!=='StrongLifts 5×5'))],options='<option value="">Übung zuordnen …</option>'+groups.map(g=>`<optgroup label="${esc(g)}">${EXERCISES.filter(x=>x.group===g).map(x=>`<option value="${esc(x.id)}" ${s.exerciseId===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</optgroup>`).join('');
 return `<div class="str732-set" data-strength-set="${i}"><span class="str732-count">Satz ${i+1}</span><label>Übung<select name="exercise-${i}">${options}</select></label><label>Wdh.<input inputmode="numeric" type="number" min="0" max="500" step="1" name="reps-${i}" placeholder="–" value="${Number.isFinite(s.reps)?s.reps:''}"></label><label>kg<input inputmode="decimal" type="number" min="0" max="500" step="0.25" name="weight-${i}" placeholder="–" value="${Number.isFinite(s.weightKg)?s.weightKg:''}"></label></div>`;
}
export function strengthEditorView(state,sessions=[],editingId=''){
 const reversed=[...sessions].reverse(),pending=reversed.filter(s=>!s.sets?.length||s.sets.some(x=>!x.exerciseId&&!x.identified));
 const current=reversed.find(s=>s.id===editingId);
 const prompt=pending.length?`<div class="str732-pending" role="status"><strong>💪 ${pending.length} Krafttraining${pending.length===1?'':'seinheiten'} zur Zuordnung</strong><p>Garmin hat die Einheiten erfasst. Wähle hier einfach Übungen und trage Wiederholungen sowie Gewichte ein; kein weiterer FIT-Export notwendig.</p><div class="str732-choices">${pending.slice(0,8).map(s=>`<button type="button" data-action="str732-edit" data-id="${esc(s.id)}">${esc(s.day)} · ${esc(s.start?.slice(11,16)||'')} · ${Math.max(s.reportedSets||0,s.sets?.length||0)||'?'} Sätze →</button>`).join('')}</div></div>`:'';
 const list=reversed.slice(0,20).map(s=>`<button type="button" class="str732-session-choice" data-action="str732-edit" data-id="${esc(s.id)}"><span>${esc(s.day)} · ${esc(s.start?.slice(11,16)||'')} <small>${s.manuallyAnnotated?'✓ Bearbeitet':s.summaryOnly?'Noch nicht zugeordnet':'Garmin/FIT'}</small></span><strong>${Math.max(s.reportedSets||0,s.sets?.length||0)||'–'} Sätze <span aria-hidden="true">✎</span></strong></button>`).join('');
 if(!current)return `<section class="work-card str732-editor"><div class="work-heading"><span>📝 Übungen &amp; Gewichte nachtragen</span><small>Lokales Trainingsjournal</small></div>${prompt}<details><summary>Trainingseinheit zum Bearbeiten auswählen</summary><div class="str732-session-list">${list||'Noch keine Garmin-Krafttrainingseinheit importiert.'}</div></details><p class="str732-help">Die Muskelkarte wird aus den von dir zugeordneten Übungen berechnet; ein automatisch aufgezeichnetes Training wird dabei nicht doppelt gezählt.</p></section>`;
 const prior=findStrengthAnnotation(state,current),raw=prior?.sets||current.sets||[],count=Math.min(80,Math.max(1,current.reportedSets||0,raw.length));
 const sets=Array.from({length:count},(_,i)=>{const s=raw[i]||{reps:null,weightKg:null};return !prior&&s.source==='garmin-fit-set'&&s.weightKg===0?{...s,weightKg:null}:s;});
 return `<section class="work-card str732-editor"><div class="work-heading"><span>✏️ Training bearbeiten · ${esc(current.day)}</span><button type="button" class="secondary-btn" data-action="str732-cancel">Schließen</button></div><p class="str732-help">${esc(current.start?.slice(11,16)||'')} · ${current.reportedReps??'–'} Wiederholungen laut Garmin. Unbekannte Werte bitte leer lassen. Die Zuordnung überschreibt keine importierten Originaldaten.</p><form id="str732-form" data-session-id="${esc(current.id)}" data-start="${esc(current.start)}"><div class="str732-rows">${sets.map((set,i)=>strengthSetRow(i,set)).join('')}</div><div class="str732-buttons"><button type="button" data-action="str732-add-set" class="secondary-btn">+ Satz hinzufügen</button><button type="submit" class="primary-btn">Übungen speichern und Muskelkarte aktualisieren</button></div></form></section>`;
}
