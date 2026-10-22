// Compass 0.5.77.7 · Read-only GTD research review intelligence.
// No reminder is converted to a task or a hard deadline without the user's choice.
import {DISCOVERY_RESEARCH_BUTTONS} from './discovery-research-v577.js';

// The interval means when it is sensible to re-check sources, NOT that long-running
// festivals or exhibitions stop being valid on that date. Do not let a 2030 permanent
// museum exhibition postpone the next museum programme review for four years.
export const RESEARCH_REFRESH_RULES=Object.freeze({
 'cinema-program':{days:7,lead:2},
 'cinema-cabaret':{days:30,lead:5},
 'music':{days:45,lead:7},
 'stage':{days:45,lead:7},
 'dance':{days:30,lead:7},
 'arts':{days:45,lead:7},
 'spectator':{days:14,lead:3},
 'active':{days:45,lead:7},
 'winter':{days:14,lead:3},
 'alternative':{days:45,lead:7}
});
const isDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const isoDay=value=>{
 if(isDate(value))return value;
 if(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(value)&&Number.isFinite(Date.parse(value)))return value.slice(0,10);
 return '';
};
const shift=(day,n)=>{const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
const maxDay=(a,b)=>a&&b?(a>b?a:b):a||b||'';
const minDay=(a,b)=>a&&b?(a<b?a:b):a||b||'';
const daysBetween=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const categoriesByGroup={
 'cinema-program':['Kino','Filmfestival'],'cinema-cabaret':['Kabarett'],
 'music':['Konzert','Musical'],'stage':['Oper','Theater','Ballett'],
 'dance':['Tanz','Zouk','Kizomba','Bachata','Contact Improvisation','Festival'],
 'arts':['Kultur','Museum','Ausstellung'],'spectator':['Fußball','Basketball','Sport'],
 'active':['Mountainbike','BMX','Bujinkan'],
 'winter':['Wintersport','Skifahren','Langlaufen','Rodeln'],
 'alternative':['Workshop','Shibari','Tantra','Körperarbeit']
};
/** Snapshot at import time: avoids losing evidence of the latest included dates when
 * events are pruned later. Covers all events in the actual imported batch. */
export function researchCoverageSnapshot(events){
 let lastEventDate='',lastEndDate='',firstDate='';
 for(const e of Array.isArray(events)?events:[]){
  if(!isDate(e?.date))continue;
  lastEventDate=maxDay(lastEventDate,e.date);
  firstDate=minDay(firstDate,e.date);
  const end=isDate(e.endDate)&&e.endDate>=e.date?e.endDate:e.date;
  lastEndDate=maxDay(lastEndDate,end);
 }
 return {firstDate,lastEventDate,lastEndDate};
}
export function researchRefreshStates(state,today){
 if(!isDate(today))return [];
 const events=Array.isArray(state?.discoveredEvents)?state.discoveredEvents:[];
 const history=state?.discoveryResearchHistory||{};
 return DISCOVERY_RESEARCH_BUTTONS.flatMap(b=>{
  const record=history[b.id]||{};
  const candidates=events.filter(e=>e?.researchGroup===b.id||(!e?.researchGroup&&categoriesByGroup[b.id]?.includes(e?.category)));
  // Last imported event timestamps are a fallback for older vaults without history.
  const lastRaw=record.at||candidates.reduce((s,e)=>String(e.lastImportedAt||'')>s?e.lastImportedAt:s,'');
  const lastImport=isoDay(lastRaw);
  if(!lastImport)return []; // Never generate ten phantom tasks for untouched research buttons.
  const rules=RESEARCH_REFRESH_RULES[b.id];if(!rules)return [];
  const current=researchCoverageSnapshot(candidates);
  const lastEventDate=maxDay(isoDay(record.lastEventDate),current.lastEventDate);
  const lastEndDate=maxDay(isoDay(record.lastEndDate),current.lastEndDate);
  const cadenceEnd=shift(lastImport,rules.days);
  // Events imported in multiple batches may reach beyond the standard cadence.
  // Still trigger a check when this batch's last programme date is close.
  const planned=lastEventDate?minDay(cadenceEnd,shift(lastEventDate,-rules.lead)):cadenceEnd;
  // Never declare a fresh import overdue before it was made.
  const due=planned<lastImport?lastImport:planned;
  const daysLeft=daysBetween(today,due);
  const status=daysLeft<=0?'due':daysLeft<=3?'soon':'fresh';
  return [{id:b.id,label:b.label,icon:b.icon,lastImport,coverageEnd:lastEventDate,latestEventEnd:lastEndDate,
    nextReview:due,daysLeft,status,days:rules.days,lead:rules.lead,
    stored:candidates.length,updatedAt:lastRaw}];
 });
}
export function researchReminders(state,today,{includeSoon=true}={}){
 return researchRefreshStates(state,today).filter(x=>x.status==='due'||includeSoon&&x.status==='soon')
  .sort((a,b)=>a.nextReview.localeCompare(b.nextReview)||a.label.localeCompare(b.label,'de'));
}
export function researchReminderText(item){
 if(!item)return '';
 if(item.daysLeft<0)return `Seit ${-item.daysLeft} Tagen zur Aktualisierung fällig`;
 if(item.daysLeft===0)return 'Heute aktualisieren';
 if(item.daysLeft===1)return 'Morgen neu recherchieren';
 return `In ${item.daysLeft} Tagen neu recherchieren`;
}
/** Import statistics are append/replace metadata in the encrypted local vault;
 * no remote API and no background scraping. */
export function recordResearchImport(state,id,preview,at){
 const prior=state.discoveryResearchHistory?.[id]||{};
 const snapshot=researchCoverageSnapshot([...(preview.added||[]),...(preview.refreshed||[])]);
 const incomingDay=isoDay(at);
 const priorDay=isoDay(prior.at);
 const sameDay=priorDay&&priorDay===incomingDay;
 const merged={...snapshot};
 if(sameDay){merged.firstDate=minDay(prior.firstDate||'',snapshot.firstDate);merged.lastEventDate=maxDay(prior.lastEventDate||'',snapshot.lastEventDate);merged.lastEndDate=maxDay(prior.lastEndDate||'',snapshot.lastEndDate);}
 state.discoveryResearchHistory??={};
 state.discoveryResearchHistory[id]={at,total:preview.total,added:preview.added.length,updated:preview.refreshed?.length||0,...merged};
 return state.discoveryResearchHistory[id];
}
