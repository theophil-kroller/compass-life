/** 0.5.74: persist a minimal, E2EE-synced Google Calendar cache in the local vault.
 * Google stays authoritative. No invitations, descriptions, or OAuth tokens stored.
 */
const dateOK=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const iso=x=>typeof x==='string'&&Number.isFinite(Date.parse(x));
const isoDay=(dt)=>new Date(dt).toISOString().slice(0,10);
export const shiftCalendarDay=(day,n)=>isoDay(Date.parse(day+'T12:00:00Z')+n*86400000);
export const calendarEventDate=e=>String(e?.start?.date||e?.start?.dateTime||e?.originalStartTime?.date||e?.originalStartTime?.dateTime||'').slice(0,10);
export function selectedCalendarFields(raw,seenAt){
 if(!raw||typeof raw.id!=='string'||!raw.id||raw.id.length>300)return null;
 const status=raw.status==='cancelled'?'cancelled':'confirmed';
 const start=raw.start||raw.originalStartTime;
 if(!start||(!dateOK(start.date)&&!iso(start.dateTime)))return null;
 const end=raw.end||start;
 return {id:raw.id,status,summary:String(raw.summary||'').slice(0,220),
  start:start.date?{date:start.date}:{dateTime:start.dateTime},
  end:end.date?{date:end.date}:{dateTime:end.dateTime},
  recurringEventId:String(raw.recurringEventId||'').slice(0,300),
  updated:iso(raw.updated)?raw.updated:seenAt,
  recordedAt:seenAt,
  transparency:raw.transparency==='transparent'?'transparent':'opaque'};
}
export function normalizeCalendarArchive(value){
 const obj=value&&typeof value==='object'?value:{};
 const entries=new Map();for(const row of Array.isArray(obj.events)?obj.events:[]){
  const v=selectedCalendarFields(row,iso(row.recordedAt)?row.recordedAt:'1970-01-01T00:00:00Z');
  if(!v)continue;entries.set(v.id,v);
 }
 return {events:[...entries.values()].sort((a,b)=>a.id.localeCompare(b.id)),
  start:dateOK(obj.start)?obj.start:'',end:dateOK(obj.end)?obj.end:'',
  updatedAt:iso(obj.updatedAt)?obj.updatedAt:'',completed:obj.completed===true};
}
function revision(row){return String(row?.recordedAt||row?.updated||'');}
export function mergeCalendarArchives(a,b){
 const x=normalizeCalendarArchive(a),y=normalizeCalendarArchive(b),all=new Map();
 for(const row of [...x.events,...y.events]){const old=all.get(row.id);
  if(!old||revision(row)>revision(old)||(revision(row)===revision(old)&&row.status==='cancelled'))all.set(row.id,row);
 }
 const newest=x.updatedAt>=y.updatedAt?x:y;
 return {events:[...all.values()].sort((a,b)=>a.id.localeCompare(b.id)),
  start:x.start&&y.start?(x.start<y.start?x.start:y.start):x.start||y.start,
  end:x.end&&y.end?(x.end>y.end?x.end:y.end):x.end||y.end,
  updatedAt:x.updatedAt>y.updatedAt?x.updatedAt:y.updatedAt,
  completed: x.completed||y.completed};
}
/** Commit only after all pages for [start,end) were fetched. Unseen IDs within
 * that COMPLETE window are tombstoned; no record outside that window is removed. */
export function applyCalendarWindow(previous,rawEvents,{start,end,seenAt,complete=true}={}){
 if(!dateOK(start)||!dateOK(end)||end<=start||!iso(seenAt)||complete!==true)throw Error('Unvollständiges Kalenderfenster: kein Speichern.');
 const old=normalizeCalendarArchive(previous),byId=new Map(old.events.map(x=>[x.id,x]));
 const live=new Map();for(const raw of rawEvents||[]){
  const record=selectedCalendarFields(raw,seenAt);if(!record)continue;
  live.set(record.id,record);
 }
 for(const [id,existing] of byId){if(existing.status==='cancelled'||live.has(id))continue;
  const day=calendarEventDate(existing);
  if(day>=start&&day<end)byId.set(id,{...existing,status:'cancelled',recordedAt:seenAt});
 }
 for(const [id,record] of live){
  const prior=byId.get(id);
  if(prior&&prior.updated===record.updated&&prior.status===record.status&&prior.summary===record.summary&&JSON.stringify(prior.start)===JSON.stringify(record.start)&&JSON.stringify(prior.end)===JSON.stringify(record.end))continue;
  byId.set(id,record);
 }
 const merged={events:[...byId.values()].sort((a,b)=>a.id.localeCompare(b.id)),start:old.start&&old.start<start?old.start:start,
  end:old.end&&old.end>end?old.end:end,updatedAt:seenAt,completed:true};
 return merged;
}
export function visibleCachedCalendar(archive){return normalizeCalendarArchive(archive).events.filter(e=>e.status!=='cancelled');}
/** Determine historical start from actually recorded Garmin stress observations, not a fabricated date. */
export function calendarSyncStart(imported={},today){
 const points=Array.isArray(imported?.garminWellness)?imported.garminWellness:[];
 let first='';for(const row of points){if(!iso(row?.at)||!Number.isFinite(row.stress)||row.stress<0||row.stress>100)continue;
  const date=String(row.at).slice(0,10);if(!first||date<first)first=date;
 }
 return first||shiftCalendarDay(today,-90);
}
export function calendarFetchWindows(archive,imported={},today){
 const cached=normalizeCalendarArchive(archive),desired=calendarSyncStart(imported,today),future=shiftCalendarDay(today,365),old=shiftCalendarDay(today,-90),ranges=[];
 // First load: full Garmin history. Later updates: correction window + new future.
 if(!cached.completed){ranges.push({start:desired,end:future});}
 else {
  if(cached.start&&desired<cached.start)ranges.push({start:desired,end:cached.start});
  ranges.push({start:old,end:future});
 }
 // Chunks of up to 180 days: failures cannot silently masquerade as complete.
 const out=[];for(const r of ranges){let cursor=r.start;
  while(cursor<r.end){const end=shiftCalendarDay(cursor,180),until=end<r.end?end:r.end;out.push({start:cursor,end:until});cursor=until;}
 }
 return out;
}
