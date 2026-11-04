/** Compass 0.5.91.22 · Correct the ACTUAL load of an already confirmed set.
 * Same encrypted strengthGuidedSessions as workout, coach, recovery, and Muscle Map.
 * A change affects one confirmed set only; neither the target suggestion nor
 * neighbouring sets are silently overwritten. The original completion date stays.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function parseActualWeight122(value){
 if(value===null||value===undefined||String(value).trim()==='')throw Error('Bitte tatsächliches Gewicht angeben.');
 const n=Number(String(value).trim().replace(',','.'));
 if(!Number.isFinite(n)||n<0||n>500)throw Error('Gewicht muss zwischen 0 und 500 kg liegen.');
 return Math.round(n*100)/100;
}
export function correctGuidedSessionSetWeight122(session,{exerciseId,setNumber,weightKg,now=new Date().toISOString()}={}){
 if(!session||session.source!=='compass-guided-v5920')throw Error('Compass-Workout nicht gefunden.');
 const exercise=(session.exercises||[]).find(x=>x.exerciseId===exerciseId);
 if(!exercise)throw Error('Übung nicht gefunden.');
 const index=Number(setNumber);
 const set=(exercise.confirmedSets||[]).find(x=>x?.confirmed===true&&x.setNumber===index);
 if(!set)throw Error('Bestätigten Satz nicht gefunden.');
 const value=parseActualWeight122(weightKg),old=Number.isFinite(set.weightKg)?set.weightKg:null;
 if(old===value)return {changed:false,weightKg:value,oldWeightKg:old};
 if(!Number.isFinite(Date.parse(now)))throw Error('Ungültiger Korrekturzeitpunkt.');
 set.weightKg=value;
 set.weightSource='actual-manual';
 set.weightUpdatedAt=now;
 set.updatedAt=now;
 set.weightCorrections=[...(Array.isArray(set.weightCorrections)?set.weightCorrections:[]),{at:now,fromKg:old,toKg:value}].slice(-20);
 session.updatedAt=now;
 // Intentionally keep completedAt/completedDay, so cross-day training stays correct.
 return {changed:true,weightKg:value,oldWeightKg:old};
}
export function correctGuidedSetWeight122(state,{sessionId,...rest}={}){
 const session=(state?.strengthGuidedSessions||[]).find(s=>s.id===sessionId);
 if(!session)throw Error('Gespeicherte Trainingseinheit nicht gefunden.');
 return correctGuidedSessionSetWeight122(session,rest);
}
/** Existing workouts can be corrected AFTER completion in Insights > Krafttraining.
 * This journal section edits the canonical confirmed sets, never Garmin imports.
 */
export function guidedWeightCorrectionView122(state,{maxSessions=30}={}){
 const sessions=(Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[])
  .filter(s=>s?.source==='compass-guided-v5920'&&!s.deleted&&s.exercises?.some(e=>e.confirmedSets?.some(r=>r.confirmed===true)))
  .sort((a,b)=>String(b.finishedAt||b.startedAt||'').localeCompare(String(a.finishedAt||a.startedAt||'')))
  .slice(0,maxSessions);
 const rows=sessions.map(s=>{
  const date=String(s.finishedAt||s.startedAt||'').slice(0,10);
  const inner=(s.exercises||[]).flatMap(ex=>(ex.confirmedSets||[]).filter(r=>r.confirmed===true).map(set=>{
   const value=Number.isFinite(set.weightKg)?String(set.weightKg):'';
   const doneDate=esc(set.completedDay||String(set.completedAt||s.startedAt||'').slice(0,10));
   return `<form class="str122-weight-form" data-session-id="${esc(s.id)}" data-exercise-id="${esc(ex.exerciseId)}" data-set-number="${esc(set.setNumber)}"><label><span>${esc(ex.title||ex.exerciseId)} · Satz ${esc(set.setNumber)} <small>${doneDate} · ${set.reps==null?'Wdh. offen':esc(set.reps)+' Wdh.'}${Number.isInteger(set.rir)?' · RIR '+set.rir:''}</small></span><span><input type="number" inputmode="decimal" step="0.5" min="0" max="500" name="actualWeightKg" aria-label="Tatsächliches Gewicht für Satz ${esc(set.setNumber)}" value="${esc(value)}" required/> kg</span></label><button type="submit" class="secondary-btn">Gewicht korrigieren</button></form>`;
  })).join('');
  return `<details class="str122-workout"><summary>${esc(date)} · ${esc(s.planTitle||'Compass Workout')} · ${s.exercises?.reduce((n,e)=>n+(e.confirmedSets||[]).filter(r=>r.confirmed===true).length,0)||0} bestätigte Sätze</summary>${inner}</details>`;
 }).join('');
 return `<section class="work-card str122-corrections" aria-label="Tatsächliche Satzgewichte nachträglich korrigieren"><div class="work-heading"><span>✎ Tatsächliche Satzgewichte korrigieren</span><small>Auch nach Trainingsabschluss · lokal im Tresor</small></div><p>Der Coach übernimmt die <strong>bestätigten tatsächlichen Satzgewichte</strong>, nicht die früher vorgeschlagenen. Jede Korrektur wirkt nur auf den ausgewählten Satz und aktualisiert die Fortschrittsberechnung. Der Trainingstag bleibt unverändert.</p>${rows||'<p>Noch keine bestätigten Compass-Workouts vorhanden.</p>'}${rows?`<details><summary>Gespeichertes Compass-Workout auswählen</summary>${rows}</details>`:''}</section>`;
}
