/** 0.5.78. Derived, read-only meeting projection from explicitly logged touch events.
 * Never guesses identity from free text, calendar proximity or relation type.
 * Avoids duplicating encrypted contact records and updates on edit/delete.
 */
import {touchEntries} from './touch-journal-v577.js';
export function touchDerivedMeetings(state,personId,manualLog=[]){
 if(!personId)return [];
 const dates=new Map();
 for(const item of touchEntries(state)){
  if(item.personId!==personId)continue;
  const dt=new Date(item.at);
  if(!Number.isFinite(+dt))continue;
  // Date of local contact, as recorded on user's device.
  const d=`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  if(!dates.has(d))dates.set(d,item);
 }
 const existing=new Set((manualLog||[]).filter(r=>r?.type==='meeting').map(r=>r.day));
 return [...dates.entries()].filter(([date])=>!existing.has(date)).map(([date])=>({id:`touch-derived:${personId}:${date}`,day:date,type:'meeting',note:'Aus Berührung & Nähe erfasst',initiator:'unknown',sourceEventId:`touch-day:${personId}:${date}`}));
}
export function personWithTouchMeetings(person,state){
 if(!person?.id)return person;
 const history=Array.isArray(person.contactLog)?person.contactLog:[];
 return {...person,contactLog:[...history,...touchDerivedMeetings(state,person.id,history)]};
}
export function peopleWithTouchMeetings(people,state){
 return Object.fromEntries(Object.entries(people||{}).map(([id,p])=>[id,personWithTouchMeetings(p,state)]));
}
