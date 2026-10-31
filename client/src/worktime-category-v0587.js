/** Compass 0.5.87: explicit division between paid work and other recorded time.
 * This is a display calculation; historic journal entries are not migrated or changed.
 */
export const COMPASS_WORK_CATEGORY='work';
export const WORKTIME_CATEGORY_LABELS=Object.freeze({work:'Berufliche Arbeit',project:'Privatprojekt',family:'Familie & Beziehungen',leisure:'Sport & Freizeit',health:'Gesundheit & Erholung',personal:'Alltag',other:'Sonstiges'});
export const isProfessionalWork=e=>String(e?.category||'work')===COMPASS_WORK_CATEGORY;
export function calendarDayWindow(day){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('Ungültiges Tagesdatum.');
 const start=new Date(day+'T00:00:00');if(!Number.isFinite(start.getTime())||start.getFullYear()!==Number(day.slice(0,4))||start.getMonth()+1!==Number(day.slice(5,7))||start.getDate()!==Number(day.slice(8,10)))throw Error('Ungültiges Tagesdatum.');
 const end=new Date(start);end.setDate(end.getDate()+1);
 return [start.getTime(),end.getTime()];
}
function unionMinutes(intervals){
 if(!intervals.length)return 0;
 intervals.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 let total=0,[s,e]=intervals[0];
 for(const [start,end] of intervals.slice(1)){
  if(start<=e)e=Math.max(end,e);
  else {total+=e-s;s=start;e=end;}
 }
 return Math.round((total+e-s)/60000);
}
/** Returns category-specific non-overlapping minutes clipped to a local civil day. */
export function professionalTimeSummary(entries,day,{now=Date.now(),activeStart='',activeCategory='work'}={}){
 const [start,end]=calendarDayWindow(day),categories=Object.fromEntries(Object.keys(WORKTIME_CATEGORY_LABELS).map(k=>[k,[]]));
 for(const entry of entries||[]){
  if(!entry||entry.deleted)continue;
  const s=Date.parse(entry.start),e=entry.end?Date.parse(entry.end):Number(now);
  if(!Number.isFinite(s)||!Number.isFinite(e)||e<=s)continue;
  const lo=Math.max(start,s),hi=Math.min(end,e);
  if(hi>lo)(categories[WORKTIME_CATEGORY_LABELS[entry.category]?entry.category:'other']??= []).push([lo,hi]);
 }
 if(activeStart){
  const s=Date.parse(activeStart),e=Number(now),lo=Math.max(start,s),hi=Math.min(end,e);
  if(Number.isFinite(lo)&&Number.isFinite(hi)&&hi>lo)(categories[WORKTIME_CATEGORY_LABELS[activeCategory]?activeCategory:'other']??=[]).push([lo,hi]);
 }
 const minutes=Object.fromEntries(Object.entries(categories).map(([k,v])=>[k,unionMinutes(v)]));
 const nonWork=Object.entries(minutes).reduce((sum,[k,v])=>sum+(k==='work'?0:v),0);
 return {work:minutes.work,nonWork,minutes};
}
export const activityToJournalArea=category=>({Arbeit:'work',Freizeit:'leisure',Erholung:'health',Soziales:'family',Sonstiges:'other'}[category]||'other');
