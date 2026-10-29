/** Today birthday ribbon. No background fetch, no writes, no user identifiers in diagnostics. */
import {occasionsWithPeople} from './people-occasions.js';
import {daysUntil} from './occasion-planning.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function todayBirthdayHighlights(events=[],appearance=()=>({}),people={},today,{daysAhead=7}={}){
 const birthdays=occasionsWithPeople(events,appearance,people,today,daysAhead).filter(x=>x.kind==='birthday');
 const unique=new Set();
 const items=[];
 for(const b of birthdays){
  const days=daysUntil(today,b.date);
  if(days<0||days>daysAhead)continue;
  const key=(b.personId?`person:${b.personId}`:String(b.title).normalize('NFKC').toLocaleLowerCase('de').trim())+'@'+b.date;
  if(unique.has(key))continue;
  unique.add(key);
  const id=b.source==='calendar'?String(b.id).slice('birthday:'.length,-(b.date.length+1)):b.personId;
  items.push({id,kind:b.source==='people'?'person':'calendar',date:b.date,title:b.title,days});
 }
 return items.sort((a,b)=>a.days-b.days||a.title.localeCompare(b.title,'de'));
}
/** Today all birthdays are always visible; forthcoming ones remain in a compact, optional fold. */
export function todayBirthdayPanel(items=[]){
 if(!items.length)return '';
 const now=items.filter(x=>x.days===0),soon=items.filter(x=>x.days>0);
 const chip=x=>`<button type="button" class="bday255-name" data-action="${x.kind==='person'?'fr31-person':'agenda-open'}" data-id="${esc(x.id)}" title="${esc(x.title)} öffnen">${esc(x.title)}</button>`;
 return `<section class="bday255" aria-label="Geburtstage in den nächsten sieben Tagen"><span class="bday255-label">🎂 Geburtstag${now.length!==1&&items.length!==1?'e':''}</span><div class="bday255-content">${now.length?`<div class="bday255-line"><strong>Heute:</strong> ${now.map(chip).join('<span class="bday255-dot">·</span>')}</div>`:''}${soon.length?`<details class="bday255-upcoming" ${now.length?'':'open'}><summary>${now.length?`Weitere Geburtstage · ${soon.length}`:'Demnächst'}</summary><div class="bday255-soon">${soon.map(x=>`<span class="bday255-item"><small>${x.days===1?'Morgen':`in ${x.days} Tagen`}</small> ${chip(x)}</span>`).join('')}</div></details>`:''}</div></section>`;
}
