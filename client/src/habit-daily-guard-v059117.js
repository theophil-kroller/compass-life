/** Compass 0.5.91.17 · Locked quick-habit cache is an ephemeral DAY snapshot.
 * Legacy caches had only doneToday without a date, so they cannot be safely
 * interpreted on the next calendar day. Never carry completion to a new day.
 */
export const validHabitDay117=day=>typeof day==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(Date.parse(day+'T12:00:00'));
export function quickHabitSnapshot117(raw={},today){
 const safe=raw&&typeof raw==='object'?raw:{};
 const day=validHabitDay117(today)?today:'';
 const sameDay=day!==''&&safe.doneDay===day;
 return {doneDay:day,doneToday:sameDay?[...new Set((Array.isArray(safe.doneToday)?safe.doneToday:[]).filter(x=>typeof x==='string'&&x.length<128))]:[]};
}
export function quickHabitDone117(raw,habitId,day){
 return validHabitDay117(day)&&raw?.doneDay===day&&Array.isArray(raw?.doneToday)&&raw.doneToday.includes(habitId);
}
