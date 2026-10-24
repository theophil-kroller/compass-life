/** Compass 0.5.77.42 — end-to-end encrypted strength journal merge.
 * Pure helpers; no cloud, network, storage or unencrypted export.
 * Manual annotations are keyed by Garmin session identity and start time, not array index.
 */
const text=x=>typeof x==='string'?x:'';
const revision=x=>text(x?.updatedAt)||text(x?.start);
const entries=x=>Array.isArray(x?.annotations)?x.annotations.filter(a=>a&&typeof a==='object'&&(text(a.sessionId)||text(a.start))):[];
const contentSize=a=>Array.isArray(a?.sets)?a.sets.reduce((n,s)=>n+(s?.exerciseId?3:0)+(Number.isFinite(s?.weightKg)?2:0)+(Number.isFinite(s?.reps)?1:0),0):0;
const same=(a,b)=>Boolean(a?.sessionId&&a.sessionId===b?.sessionId)||Boolean(a?.start&&a.start===b?.start);
function choose(a,b){
 const x=revision(a),y=revision(b);
 let newer=y>x?b:x>y?a:contentSize(b)>contentSize(a)?b:contentSize(a)>contentSize(b)?a:JSON.stringify(a)>=JSON.stringify(b)?a:b;
 const older=newer===a?b:a;
 // A later import or another phone may contain empty placeholders. Empty/null
 // is NOT a deliberate deletion and must not erase an assigned exercise or kg.
 const current=Array.isArray(newer.sets)?newer.sets:[];
 const previous=Array.isArray(older.sets)?older.sets:[];
 const sets=Array.from({length:Math.max(current.length,previous.length)},(_,i)=>{
  const fresh=current[i],old=previous[i];
  if(!fresh)return old;
  if(!old)return fresh;
  return {...old,...fresh,
   exerciseId:fresh.exerciseId||old.exerciseId||null,
   reps:Number.isFinite(fresh.reps)?fresh.reps:Number.isFinite(old.reps)?old.reps:null,
   weightKg:Number.isFinite(fresh.weightKg)?fresh.weightKg:Number.isFinite(old.weightKg)?old.weightKg:null};
 });
 return {...older,...newer,sets};
}

export function mergeStrengthJournal(local={},remote={}){
 const a=local&&typeof local==='object'?local:{},b=remote&&typeof remote==='object'?remote:{};
 const out=[];
 for(const next of [...entries(a),...entries(b)]){
  const idx=out.findIndex(item=>same(item,next));
  if(idx===-1)out.push(next);
  else out[idx]=choose(out[idx],next);
 }
 out.sort((a,b)=>text(a.start).localeCompare(text(b.start))||text(a.sessionId).localeCompare(text(b.sessionId)));
 return {annotations:out};
}
export function strengthSyncStatus(state){
 const annotations=entries(state?.strengthJournal).length;
 return {annotations,connected:Boolean(state?.privateDeviceMirror?.key),mode:state?.privateDeviceMirror?.mode||''};
}
