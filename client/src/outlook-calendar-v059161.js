/** Compass 0.5.91.61 — read-only, encrypted Outlook desktop calendar cache.
 * Pure functions, no browser/network dependency. Incomplete snapshots are rejected.
 */
export const OUTLOOK_CALENDAR_SCHEMA61='1.0';
const dt=s=>typeof s==='string'&&Number.isFinite(Date.parse(s));
const day=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&dt(s+'T12:00:00Z');
const idOK=s=>typeof s==='string'&&/^outlook-local-[a-f0-9]{64}$/.test(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=(s,max=300)=>String(s??'').trim().slice(0,max);
function canonical(row){return JSON.stringify([row.source_id,row.title,row.start,row.end,row.all_day,row.location,row.description??'',row.status,row.availability,row.last_modified,row.original_start]);}
export function emptyOutlookCalendar61(){return {events:[],acknowledged:{},googleLinks:{},pendingExport:null,updatedAt:'',confirmedAt:'',window:null,completed:false};}
export function normalizeOutlookCalendar61(v){const x=v&&typeof v==='object'?v:{};return {...emptyOutlookCalendar61(),events:Array.isArray(x.events)?x.events.filter(r=>idOK(r?.source_id)).slice(0,20000):[],acknowledged:x.acknowledged&&typeof x.acknowledged==='object'?x.acknowledged:{},googleLinks:x.googleLinks&&typeof x.googleLinks==='object'?x.googleLinks:{},pendingExport:x.pendingExport&&typeof x.pendingExport==='object'?x.pendingExport:null,updatedAt:dt(x.updatedAt)?x.updatedAt:'',confirmedAt:dt(x.confirmedAt)?x.confirmedAt:'',window:x.window&&day(x.window.start)&&day(x.window.end)?x.window:null,completed:x.completed===true};}
export function parseOutlookSnapshot61(value){
 const x=typeof value==='string'?JSON.parse(value):value;
 if(!x||x.schema_version!=='1.0'||x.source!=='compass-outlook-bridge'||x.complete!==true||x.snapshot_type!=='complete'||!day(x.window?.start)||!day(x.window?.end)||x.window.end<=x.window.start||!dt(x.generated_at)||!Array.isArray(x.events)||!Array.isArray(x.deleted)||x.events.length>20000||x.deleted.length>20000)throw Error('Unvollständiger oder ungültiger Outlook-Kalendersnapshot. Gespeicherte Termine bleiben unverändert.');
 const seen=new Set();const events=x.events.map(row=>{
  if(!idOK(row?.source_id)||!dt(row.start)||!dt(row.end)||Date.parse(row.end)<=Date.parse(row.start)||typeof row.title!=='string'||row.title.length>250||row.all_day!==true&&row.all_day!==false||seen.has(row.source_id))throw Error('Ungültige oder doppelte Outlook-Termin-ID');
  seen.add(row.source_id);return {source_id:row.source_id,calendar_id:clean(row.calendar_id),series_id:clean(row.series_id),original_start:clean(row.original_start,30),title:clean(row.title,250),start:row.start,end:row.end,all_day:row.all_day,location:clean(row.location,400),description:clean(row.description,8000),status:row.status==='cancelled'?'cancelled':'confirmed',availability:clean(row.availability,32),last_modified:dt(row.last_modified)?row.last_modified:null,created_at:dt(row.created_at)?row.created_at:null};
 });
 const deleted=x.deleted.map(row=>{if(!idOK(row?.source_id))throw Error('Ungültige Outlook-Tombstone-ID');return {source_id:row.source_id,series_id:clean(row.series_id),original_start:clean(row.original_start,30)};});
 return {...x,events,deleted};
}
export function applyOutlookSnapshot61(existing,raw){
 const snapshot=parseOutlookSnapshot61(raw),old=normalizeOutlookCalendar61(existing),byId=new Map(old.events.map(x=>[x.source_id,x]));
 const now=snapshot.generated_at,seen=new Set();
 for(const row of snapshot.events){seen.add(row.source_id);const before=byId.get(row.source_id);byId.set(row.source_id,{...row,absentScans:0,revision:canonical(row),recordedAt:before?.revision===canonical(row)?before.recordedAt:now});}
 for(const del of snapshot.deleted){seen.add(del.source_id);const prev=byId.get(del.source_id);if(prev){const next={...prev,status:'cancelled',absentScans:0,recordedAt:now};next.revision=canonical(next);byId.set(del.source_id,next);}else{const tomb={source_id:del.source_id,calendar_id:'',series_id:del.series_id,original_start:del.original_start,title:'',start:del.original_start?del.original_start+'T00:00:00+01:00':now,end:del.original_start?del.original_start+'T00:01:00+01:00':now,all_day:false,status:'cancelled',location:'',last_modified:now,recordedAt:now,absentScans:0};tomb.revision=canonical(tomb);byId.set(del.source_id,tomb);}}
 // One missing occurrence can be a COM enumeration anomaly. Delete only after
 // TWO complete successes over the same coverage, never on failed/partial scan.
 for(const [id,row] of byId){if(seen.has(id)||row.status==='cancelled')continue;
  const overlaps=String(row.start||'').slice(0,10)<snapshot.window.end&&String(row.end||'').slice(0,10)>=snapshot.window.start;
  if(!overlaps)continue;
  const attempts=(Number(row.absentScans)||0)+1;
  if(attempts>=2){const deleted={...row,status:'cancelled',absentScans:attempts,recordedAt:now};deleted.revision=canonical(deleted);byId.set(id,deleted);}else byId.set(id,{...row,absentScans:attempts});
 }
 return {...old,events:[...byId.values()].sort((a,b)=>String(a.start).localeCompare(String(b.start))||a.source_id.localeCompare(b.source_id)),updatedAt:now,window:snapshot.window,completed:true};
}
export function outlookToGoogleShape61(row){
 return {id:'outlook:'+row.source_id,source:'outlook_local',source_id:row.source_id,
  summary:row.title,location:row.location,description:row.description,
  start:row.all_day?{date:row.start.slice(0,10)}:{dateTime:row.start},
  end:row.all_day?{date:row.end.slice(0,10)}:{dateTime:row.end},
  status:row.status,transparency:row.availability==='free'?'transparent':'opaque',
  updated:row.last_modified||row.recordedAt,all_day:row.all_day};
}
export function outlookVisible61(v){return normalizeOutlookCalendar61(v).events.filter(r=>r.status!=='cancelled').map(outlookToGoogleShape61);}
/** Normalize harmless title differences without erasing a real meeting topic.
 * "Marketing (GRO)" and "Marketing ()" may be the same meeting, but
 * "Marketing (GRO)" and "Marketing (HR)" remain distinct without an explicit link.
 */
export function calendarTitleParts163(text){
 let s=String(text??'').normalize('NFKC').toLocaleLowerCase('de').replace(/[\u200b-\u200d\ufeff]/g,'').replace(/\s+/g,' ').trim();
 s=s.replace(/[（]/g,'(').replace(/[）]/g,')').replace(/\s*\(\s*\)\s*$/g,'').trim();
 const match=s.match(/^(.*?)\s*\(\s*([^()]*)\s*\)\s*$/u);
 const base=match?match[1]:s,suffix=match?match[2]:'';
 const tidy=x=>x.replace(/[\s\u00a0]+/g,' ').replace(/[.,;:!?]+$/gu,'').trim();
 return {base:tidy(base),suffix:tidy(suffix),full:tidy(s)};
}
export function sameCrossCalendarEvent163(a,b){
 if(!a||!b)return false;
 const allDay=v=>Boolean(v?.start?.date&&!v?.start?.dateTime);
 if(allDay(a)!==allDay(b))return false;
 const timestamp=v=>v?.dateTime?Date.parse(v.dateTime):null;
 if(allDay(a)){
  if(a.start?.date!==b.start?.date||a.end?.date!==b.end?.date)return false;
 }else{
  const sa=timestamp(a.start),sb=timestamp(b.start),ea=timestamp(a.end),eb=timestamp(b.end);
  if(![sa,sb,ea,eb].every(Number.isFinite)||Math.abs(sa-sb)>5*60000||Math.abs(ea-eb)>5*60000)return false;
 }
 const x=calendarTitleParts163(a.summary),y=calendarTitleParts163(b.summary);
 if(!x.base||!y.base||x.base!==y.base)return false;
 // A meaningful different parenthetical label can indicate a separate event.
 return !x.suffix||!y.suffix||x.suffix===y.suffix;
}
export function outlookCalendarDedup61(google,archive){
 const x=normalizeOutlookCalendar61(archive),link=x.googleLinks||{};
 const g=(google||[]).filter(e=>e.status!=='cancelled');const gl=new Set(g.map(x=>x.id));
 const googleByTopic=new Map();
 for(const event of g){
  const topic=calendarTitleParts163(event.summary).base;
  if(!topic)continue;
  if(!googleByTopic.has(topic))googleByTopic.set(topic,[]);
  googleByTopic.get(topic).push(event);
 }
 // Preserve Google's event on the timeline; only suppress a matching Outlook
 // *display row*. Never touch either stored calendar or a later export.
 return [...g,...outlookVisible61(x).filter(e=>!gl.has(link[e.source_id])&&!(googleByTopic.get(calendarTitleParts163(e.summary).base)||[]).some(ge=>sameCrossCalendarEvent163(ge,e)))];
}
export function mergeOutlookCalendars61(a,b){
 const left=normalizeOutlookCalendar61(a),right=normalizeOutlookCalendar61(b),rows=new Map();
 for(const row of [...left.events,...right.events]){
  const prev=rows.get(row.source_id);if(!prev||String(row.recordedAt||'')>=String(prev.recordedAt||''))rows.set(row.source_id,row);
 }
 const newest=String(left.updatedAt)>=String(right.updatedAt)?left:right;
 const acknowledged={...left.acknowledged,...right.acknowledged};
 const pendingExport=newest.pendingExport;
 return {...newest,events:[...rows.values()],acknowledged,googleLinks:{...left.googleLinks,...right.googleLinks},pendingExport};
}
export function outlookExport61(v,{type='delta',start,end,descriptions=false,exportId,at=new Date().toISOString()}={}){
 const x=normalizeOutlookCalendar61(v);if(!['full','delta'].includes(type)||!day(start)||!day(end)||end<=start||!exportId||!dt(at))throw Error('Exportparameter ungültig');
 const selection=x.events.filter(r=>{const from=r.original_start||r.start.slice(0,10),to=r.end?.slice(0,10)||from;return from<end&&to>=start;}).filter(r=>type==='full'||x.acknowledged[r.source_id]!==r.revision);
 const events=selection.map(row=>({source_id:row.source_id,google_event_id:x.googleLinks[row.source_id]||null,change_type:row.status==='cancelled'?'deleted':x.acknowledged[row.source_id]?'updated':'created',title:row.title,start:row.start,end:row.end,all_day:row.all_day,location:row.location,status:row.status,calendar_id:row.calendar_id,original_start:row.original_start||null,last_modified:row.last_modified, ...(descriptions?{description:row.description||''}:{})}));
 const pack={schema_version:'1.0',source:'compass-outlook-bridge',export_type:type,export_id:exportId,timezone:'Europe/Vienna',exported_at:at,window:{start,end},events};
 const manifest={id:exportId,type,at,versions:Object.fromEntries(selection.map(r=>[r.source_id,r.revision]))};
 return {pack,manifest};
}
export function saveOutlookExportDraft61(v,manifest){return {...normalizeOutlookCalendar61(v),pendingExport:manifest};}
export function confirmOutlookExport61(v,id,at=new Date().toISOString()){
 const x=normalizeOutlookCalendar61(v);if(!x.pendingExport||x.pendingExport.id!==id)throw Error('Kein passender offener JSON-Export');
 return {...x,acknowledged:{...x.acknowledged,...x.pendingExport.versions},pendingExport:null,confirmedAt:at};
}
export function saveGoogleOutlookLink61(v,id,googleId){if(!idOK(id)||googleId&&(!/^[A-Za-z0-9_@.\-]{4,300}$/.test(googleId)))throw Error('Ungültige Event-ID');const x=normalizeOutlookCalendar61(v);return {...x,googleLinks:{...x.googleLinks,[id]:String(googleId||'')}};}
export function outlookCalendarPanel61(v,settings={}){
 const x=normalizeOutlookCalendar61(v),count=x.events.filter(e=>e.status!=='cancelled').length,esc=escape;
 const daysBack=Number(settings.back??14),daysForward=Number(settings.forward??180),descriptions=settings.descriptions===true;
 return `<section class="work-card outlook61" aria-label="Outlook Calendar"><div class="work-heading"><span>📅 Outlook Calendar</span><span class="quiet-tag">Windows COM · nur lesend</span></div>
 <p class="muted-line">Klassisches Outlook mit Exchange-Profil. Automatisch alle 15 Minuten bei geöffnetem Compass und laufender lokaler Bridge. Keine Microsoft-Cloud-Anmeldung.</p>
 <div class="outlook61-stats"><span>Bridge: <strong>${esc(settings.connected?'Verbunden':'Nicht verbunden')}</strong></span><span>Importiert: <strong>${count} Termine</strong></span><span>Letzter Erfolg: <strong>${esc(x.updatedAt?new Date(x.updatedAt).toLocaleString('de-AT'):'–')}</strong></span></div>
 <div class="outlook61-controls"><label>Lokaler Port<input id="outlook61-port" type="number" min="1024" max="65535" value="${Number(settings.port)||8765}"></label><label>Schlüssel aus Bridge-Konsole<input id="outlook61-key" type="password" autocomplete="off" value="${esc(settings.token||'')}"></label><label>Vergangene Tage<input id="outlook61-back" type="number" min="0" max="365" value="${daysBack}"></label><label>Kommende Tage<input id="outlook61-forward" type="number" min="1" max="730" value="${daysForward}"></label></div>
 <label><input id="outlook61-descriptions" type="checkbox" ${descriptions?'checked':''}> Beschreibungen bei der lokalen Bridge laden (optional)</label>
 <div class="outlook61-buttons"><button type="button" class="secondary-btn" data-action="outlook61-refresh">Outlook-Kalender jetzt aktualisieren</button><label class="secondary-btn">Snapshot-JSON einlesen<input type="file" id="outlook61-file" accept=".json,application/json" hidden></label></div>
 <div class="outlook61-buttons"><button type="button" class="secondary-btn" data-action="outlook61-full">Voll-Export JSON</button><button type="button" class="secondary-btn" data-action="outlook61-delta">Delta-Export JSON</button></div>
 <p class="muted-line">Exportzeitraum entspricht den aktuell eingestellten Tagen um heute. JSON ohne Beschreibungen ist Standard.</p>
 ${x.pendingExport?`<div class="outlook61-confirm"><strong>Export wartet auf Bestätigung</strong><p>${esc(x.pendingExport.type)} · ${esc(x.pendingExport.at)}</p><button type="button" class="primary-btn" data-action="outlook61-confirm">In Google übernommen – Delta bestätigen</button> <button type="button" class="secondary-btn" data-action="outlook61-hold">Noch nicht übernommen</button></div>`:''}
 <p class="muted-line">Letzter bestätigter Export: ${esc(x.confirmedAt?new Date(x.confirmedAt).toLocaleString('de-AT'):'–')} · ${esc(settings.message||'')}</p>
 <details><summary>Google-Event-ID zuordnen · Duplikate vermeiden</summary><form id="outlook61-link"><label>Outlook-Termin<select name="sourceId">${x.events.filter(e=>e.status!=='cancelled').slice(-300).map(e=>`<option value="${esc(e.source_id)}">${esc(e.title)} · ${esc(e.start.slice(0,16))}</option>`).join('')}</select></label><label>Google-Event-ID<input name="googleId" placeholder="ID nach ChatGPT-Übernahme" maxlength="300"></label><button class="secondary-btn" type="submit">Zuordnung speichern</button></form></details></section>`;
}
