/** Person links used only for presentation; an Inbox record remains unclarified. */
const norm=v=>String(v??'').normalize('NFKC').toLocaleLowerCase('de').trim().replace(/^#/, '').replace(/\s+/g,' ');
const keys=p=>new Set([p?.tag].filter(Boolean).map(norm));
const linked=(item,person)=>{const candidates=keys(person);return [...(item?.tags||[]),...(item?.contextTags||[])].some(tag=>candidates.has(norm(tag)));};
export function linkedPersonTasks(tasks,person){return Object.values(tasks||{}).filter(t=>!t.archived&&!t.completed&&linked(t,person));}
export function linkedPersonInbox(records,person){return (records||[]).filter(r=>!r.deleted&&linked(r,person));}
