/** Compass 0.5.68: contact-care mode is separate from relationship type or closeness. */
import {contactSummary} from './people-relationships-v24.js';
import {contactImpulse,preference} from './relationship-radar-v564.js';
export const CONTACT_MODES=Object.freeze([
 ['intentional','Bewusst Kontakt halten'],
 ['regular','Regelmäßiger Alltagskontakt'],
 ['occasional','Gelegentlich / ohne Kontaktziel'],
 ['paused','Kontaktpflege pausieren']
]);
export function careMode(person){
 if(person?.sharesHousehold===true)return 'regular';
 if(CONTACT_MODES.some(([id])=>id===person?.contactMode))return person.contactMode;
 if(person?.contactPaused===true)return 'paused';
 // Preserve legacy opt-in rhythms; never silently turn a colleague into an obligation.
 if(preference(person).cadence>0)return 'intentional';
 return 'occasional';
}
export function activeCare(person){return careMode(person)==='intentional'&&!preference(person).paused&&preference(person).cadence>0;}
export function relationshipReview(people,today){
 const list=Object.values(people||{});
 const active=list.filter(activeCare);
 const measured=active.map(p=>({person:p,...contactImpulse(p,today)}));
 const tracked=measured.filter(x=>x.hasHistory),due=tracked.filter(x=>x.due).sort((a,b)=>b.score-a.score);
 const recent=list.flatMap(p=>contactSummary(p,today).items.slice(0,4).map(e=>({...e,personId:p.id,personName:p.name}))).sort((a,b)=>b.day.localeCompare(a.day)).slice(0,10);
 const forgotten=active.filter(p=>!contactSummary(p,today).hasHistory);
 // Drift is a gentle observation, not an obligation. Require 3 dated contacts and
 // a notable decrease from this person's own historic cadence.
 const drift=list.filter(p=>careMode(p)!=='paused'&&careMode(p)!=='regular').map(person=>{
  const entries=contactSummary(person,today).items;
  if(entries.length<3)return null;
  const dates=[...new Set(entries.map(e=>e.day))].sort();if(dates.length<3)return null;
  const recent=dates.slice(-5);
  const gaps=recent.slice(1).map((date,i)=>(Date.parse(date+'T12:00:00Z')-Date.parse(recent[i]+'T12:00:00Z'))/86400000);
  const typical=gaps.slice().sort((a,b)=>a-b)[Math.floor(gaps.length/2)];
  const days=(Date.parse(today+'T12:00:00Z')-Date.parse(recent.at(-1)+'T12:00:00Z'))/86400000;
  return typical>0&&days>Math.max(45,2.5*typical)?{person,daysSince:Math.round(days),usualDays:Math.round(typical)}:null;
 }).filter(Boolean).sort((a,b)=>b.daysSince-a.daysSince).slice(0,5);
 return {active:active.length,tracked:tracked.length,covered:tracked.filter(x=>!x.due).length,due,recent,forgotten,drift};
}
export function suggestCareMode(person){
 if(person?.sharesHousehold)return 'regular';
 if(preference(person).kind==='colleague'&&preference(person).cadence===0)return 'regular';
 return careMode(person);
}
