const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export function calendarMatchesPerson(event,person){
 const title=norm(event?.summary||'');if(!title||event?.status==='cancelled')return false;
 const names=[person?.name,...String(person?.aliases||'').split(/[,;\n]/)].filter(x=>typeof x==='string'&&norm(x).length>=3);
 return names.some(name=>{const n=norm(name);return new RegExp('(^|[^\\p{L}\\p{N}])'+escape(n)+'($|[^\\p{L}\\p{N}])','u').test(title);});
}
export function personCalendarEvents(events,person,today){const matches=events.filter(e=>calendarMatchesPerson(e,person));const day=e=>String(e.start?.dateTime||e.start?.date||'').slice(0,10);
 return {upcoming:matches.filter(e=>day(e)>=today).sort((a,b)=>day(a).localeCompare(day(b))).slice(0,12),past:matches.filter(e=>day(e)<today).sort((a,b)=>day(b).localeCompare(day(a))).slice(0,12)};}
