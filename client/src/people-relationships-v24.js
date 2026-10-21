/** Compass 0.5.24 – voluntary contact history and relationship review.
 * User-confirmed contact only. Never infer contact from calendar, tasks or Inbox.
 * Stored on a person in the encrypted local vault; intentionally not synced as GTD objects.
 */
const isoDay=/^\d{4}-\d{2}-\d{2}$/;
const safeDate=day=>{
 if(!isoDay.test(String(day||'')))return null;
 const d=new Date(`${day}T12:00:00Z`);
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===day?d:null;
};
export const CONTACT_TYPES=Object.freeze([
 ['meeting','Persönliches Treffen'],['call','Telefonat'],['message','Nachricht'],
 ['video','Videogespräch'],['email','E-Mail'],['other','Sonstiger Kontakt']
]);
export const CONTACT_REVIEW_DAYS=Object.freeze([0,14,30,60,90,180,365]);
export const CONTACT_INITIATORS=Object.freeze([['unknown','Nicht erfasst'],['self','Von mir'],['other','Von der anderen Person'],['mutual','Gemeinsam']]);
export const contactInitiatorLabel=id=>CONTACT_INITIATORS.find(([key])=>key===id)?.[1]||'Nicht erfasst';
export const contactTypeLabel=id=>CONTACT_TYPES.find(([key])=>key===id)?.[1]||'Kontakt';
export function validContactEntry(item,today=new Date().toISOString().slice(0,10)){
 const note=String(item?.note||'');
 return !!(safeDate(item?.day)&&safeDate(today)&&item.day<=today&&CONTACT_TYPES.some(([id])=>id===item?.type)
   &&note.length<=1200&&String(item?.id||'').length>0&&String(item.id).length<=100
   &&(!item.sourceEventId||String(item.sourceEventId).length<=250)
   &&(!item.initiator||CONTACT_INITIATORS.some(([key])=>key===item.initiator)));
}
export function addContactEntry(person,item,today){
 if(!validContactEntry(item,today))throw Error('Kontaktart, Datum oder Notiz ungültig. Zukünftige Kontakte können nicht bestätigt werden.');
 const existing=Array.isArray(person?.contactLog)?person.contactLog:[];
 if(existing.some(x=>x.id===item.id||item.sourceEventId&&x.sourceEventId===item.sourceEventId))return {person,added:false};
 return {person:{...person,contactLog:[...existing,{id:item.id,day:item.day,type:item.type,note:item.note||'',initiator:item.initiator||'unknown',...(item.sourceEventId?{sourceEventId:item.sourceEventId}:{})}].sort((a,b)=>b.day.localeCompare(a.day)||a.id.localeCompare(b.id))},added:true};
}
export function contactSummary(person,today=new Date().toISOString().slice(0,10)){
 const entries=(Array.isArray(person?.contactLog)?person.contactLog:[]).filter(x=>validContactEntry(x,today));
 const sorted=[...entries].sort((a,b)=>b.day.localeCompare(a.day)||a.id.localeCompare(b.id));
 const mostRecent=sorted[0]||null;
 const days=mostRecent?Math.max(0,Math.round((safeDate(today)-safeDate(mostRecent.day))/86400000)):null;
 const reviewDays=Number(person?.contactReviewDays||0);
 const reviewEnabled=CONTACT_REVIEW_DAYS.includes(reviewDays)&&reviewDays>0;
 return {items:sorted,last:mostRecent,daysSince:days,reviewDays:reviewEnabled?reviewDays:0,
    due:reviewEnabled&&days!==null&&days>=reviewDays,hasHistory:sorted.length>0};
}
export function contactReviewQueue(people,today=new Date().toISOString().slice(0,10)){
 return Object.values(people||{}).map(person=>({person,...contactSummary(person,today)}))
  .filter(x=>x.due)
  .sort((a,b)=>(b.daysSince-b.reviewDays)-(a.daysSince-a.reviewDays)||a.person.name.localeCompare(b.person.name,'de'));
}
export function updateContactReviewDays(person,value){
 const days=Number(value);
 if(!CONTACT_REVIEW_DAYS.includes(days))throw Error('Ungültiges Review-Intervall.');
 return {...person,contactReviewDays:days};
}
