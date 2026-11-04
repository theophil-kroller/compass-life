/** Compass 0.5.91.21 – authoritative day of each confirmed workout set.
 * Source timestamps are immutable. A session may span multiple local dates.
 * Old sets without a timestamp use the session start as an explicitly marked fallback.
 */
const validDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(String(d||''))&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
export function workoutLocalDay(timestamp){
 const date=new Date(timestamp||'');
 if(!Number.isFinite(date.getTime()))return null;
 const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
 return `${y}-${m}-${d}`;
}
export function guidedSetDay(session,set){
 // Store the day at confirmation so that changing device timezone never shifts a completed set.
 if(validDay(set?.completedDay))return set.completedDay;
 return workoutLocalDay(set?.completedAt)||workoutLocalDay(session?.startedAt);
}
export function guidedDayGroups(session){
 if(session?.source!=='compass-guided-v5920')return [];
 const byDay=new Map();
 for(const exercise of Array.isArray(session.exercises)?session.exercises:[]){
  for(const set of Array.isArray(exercise?.confirmedSets)?exercise.confirmedSets:[]){
   if(set?.confirmed!==true)continue;
   const day=guidedSetDay(session,set);if(!day)continue;
   const entry=byDay.get(day)||{day,sets:[],hasFallback:false};
   entry.sets.push({exerciseId:exercise.exerciseId,exercise,set});
   if(!set.completedAt&&!set.completedDay)entry.hasFallback=true;
   byDay.set(day,entry);
  }
 }
 return [...byDay.values()].sort((a,b)=>a.day.localeCompare(b.day));
}
export function guidedDayWindow(session,group){
 const times=group.sets.map(({set})=>set.completedAt).filter(x=>Number.isFinite(Date.parse(x||''))).sort();
 const started=workoutLocalDay(session.startedAt)===group.day?session.startedAt:null;
 const finished=workoutLocalDay(session.finishedAt)===group.day?session.finishedAt:null;
 return {start:started||times[0]||session.startedAt,end:finished||times.at(-1)||started||session.startedAt,
  completed:Boolean(session.completed)&&Boolean(finished),continued:guidedDayGroups(session).length>1};
}
