/** Compass 0.5.77.59.40.5 – encrypted-vault workout recovery helpers.
 * Read-only functions; no GPS, network, localStorage or unencrypted checkpoints.
 */
const timestamp=x=>{const n=Date.parse(String(x||''));return Number.isFinite(n)?n:null;};
export function resumableGuidedSession(state,{now=Date.now(),maxAgeHours=168}={}){
 const sessions=Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[];
 return sessions.filter(s=>s?.source==='compass-guided-v5920'&&s.completed!==true&&!s.finishedAt&&Array.isArray(s.exercises)&&s.exercises.length>0&&s.exercises.length<=32&&s.exercises.every(e=>e&&typeof e.exerciseId==='string'&&Number.isInteger(e.plannedSets)&&e.plannedSets>=1&&e.plannedSets<=30&&Array.isArray(e.confirmedSets))&&timestamp(s.startedAt)!==null)
  .filter(s=>{const age=now-(timestamp(s.updatedAt)??timestamp(s.startedAt));return age>=0&&age<=maxAgeHours*3600000;})
  .sort((a,b)=>(timestamp(b.updatedAt)||0)-(timestamp(a.updatedAt)||0))[0]||null;
}
export function guidedPlanFromSession(session){
 if(!session?.exercises?.length)throw Error('Kein gespeichertes Workout vorhanden.');
 const old=session.planSnapshot||{};
 const previous=new Map((old.exercises||[]).map(e=>[e.id,e]));
 const exercises=session.exercises.map((e,i)=>{
  const item=previous.get(e.exerciseId)||{};
  const last=[...(e.confirmedSets||[])].reverse().find(s=>Number.isFinite(s.weightKg))?.weightKg;
  return {id:e.exerciseId,title:e.title||item.title||e.exerciseId,primary:item.primary||e.primary||'',
   sets:e.plannedSets,reps:e.plannedReps,restSeconds:Number.isFinite(e.restSeconds)?e.restSeconds:Number.isFinite(item.restSeconds)?item.restSeconds:180,
   lastKg:Number.isFinite(last)?last:Number.isFinite(item.lastKg)?item.lastKg:null,
   progressionHint:item.progressionHint||'',targetReps:Array.isArray(e.targetReps)?e.targetReps:Array.isArray(item.targetReps)?item.targetReps:null,order:i+1};
 });
 return {goal:session.goal||old.goal||'balance',equipment:session.equipment==='gym'?'gym':'home',
  title:session.planTitle||old.title||'Gespeichertes Workout',exercises};
}
export function resumeExerciseIndex(session){
 const n=session?.exercises?.length||0;if(!n)return 0;
 const cursor=session.currentExerciseIndex;
 if(Number.isInteger(cursor)&&cursor>=0&&cursor<n)return cursor;
 const first=session.exercises.findIndex(e=>(e.confirmedSets||[]).filter(s=>s.confirmed).length<e.plannedSets);
 return first<0?n-1:first;
}
