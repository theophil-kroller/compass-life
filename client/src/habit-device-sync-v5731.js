/** Compass 0.5.73.1 · end-to-end encrypted, two-way Habit Tracker reconciliation.
 * A completion is identified by (habitId, local calendar day). Explicit undos
 * remain as tombstones so a stale second device cannot resurrect a checked item.
 * No network calls, plaintext cloud storage, or unobserved days are generated here.
 */
const isoDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const revision=row=>String(row?.doneAt||row?.updatedAt||'');
const deterministic=(a,b)=>{
 if(!a)return b;if(!b)return a;
 const ar=revision(a),br=revision(b);
 if(ar!==br)return ar>br?a:b;
 // With indistinguishable edit times an explicit uncheck takes precedence.
 if(typeof a.done==='boolean'&&typeof b.done==='boolean'&&a.done!==b.done)return a.done===false?a:b;
 return JSON.stringify(a)>=JSON.stringify(b)?a:b;
};
export function normalizeHabitCompletion(row){
 if(!row||!row.habitId||!isoDay(row.day))return null;
 return {habitId:String(row.habitId),day:String(row.day),done:row.done!==false,
  doneAt:revision(row)};
}
export function habitCompletionKey(row){return `${row.habitId}\u0000${row.day}`;}
export function mergeHabitQuick(local={},remote={}){
 const left=local&&typeof local==='object'?local:{},right=remote&&typeof remote==='object'?remote:{};
 const items=new Map();
 for(const item of [...(Array.isArray(left.items)?left.items:[]),...(Array.isArray(right.items)?right.items:[])]){
  if(!item?.id)continue;
  const id=String(item.id),next={id,title:String(item.title||id),slot:String(item.slot||''),active:item.active!==false,
   ...(item.updatedAt?{updatedAt:String(item.updatedAt)}:{})};
  items.set(id,deterministic(items.get(id),next));
 }
 const completions=new Map();
 for(const raw of [...(Array.isArray(left.completions)?left.completions:[]),...(Array.isArray(right.completions)?right.completions:[])]){
  const row=normalizeHabitCompletion(raw);if(!row)continue;
  const key=habitCompletionKey(row);completions.set(key,deterministic(completions.get(key),row));
 }
 return {items:[...items.values()].sort((a,b)=>a.id.localeCompare(b.id)),
  completions:[...completions.values()].sort((a,b)=>a.day.localeCompare(b.day)||a.habitId.localeCompare(b.habitId))};
}
