/** Compass 0.5.82 · Ars Vivendi, My Life in Weeks.
 * Birthdays define life-year boundaries, Gregorian calendar days define months.
 * 53rd life-week is a deliberately short remaining 1–2-day segment.
 * No life expectancy predictions and no automatic inference of travel from calendar items.
 */
export const LIFE_BIRTHDAY='1983-06-28';
export const LIFE_HORIZON=100;
export const LIFE_EVENT_CATEGORIES=Object.freeze([
 ['travel','Reisen','#649ac4','✈'],['abroad','Ausland & Auslandssemester','#9c81c6','🌍'],
 ['family','Familie & Beziehungen','#cf8498','♥'],['learning','Studium & Lernen','#5a9a90','🎓'],
 ['career','Beruf & Projekte','#cf9465','◆'],['milestone','Meilensteine','#cfae6a','✦'],
 ['relationship','Lebenspartnerschaft','#c57c9c','♥'],
 ['education','Ausbildung & Studium','#4c9a90','🎓'],['work','Beruflicher Abschnitt','#d08d5a','◆'],
 ['volunteer','Ehrenamt','#8882b6','✧'],
 ['other','Besondere Erlebnisse','#879b8e','●']
]);
const DAY=86400000,RE=/^\d{4}-\d{2}-\d{2}$/;
const dateOf=s=>{if(typeof s!=='string'||!RE.test(s))return NaN;const d=Date.parse(s+'T00:00:00Z');return Number.isFinite(d)&&new Date(d).toISOString().slice(0,10)===s?d:NaN;};
const iso=t=>new Date(t).toISOString().slice(0,10);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateFormatter=new Intl.DateTimeFormat('de-AT',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const monthFormatter=new Intl.DateTimeFormat('de-AT',{month:'short',timeZone:'UTC'});
const fmt=t=>dateFormatter.format(new Date(t));
const color=category=>LIFE_EVENT_CATEGORIES.find(x=>x[0]===category)?.[2]||'#879b8e';
const name=category=>LIFE_EVENT_CATEGORIES.find(x=>x[0]===category)?.[1]||'Erlebnis';
const lifeEventEnd=(e,today=iso(Date.now()))=>e?.ongoing?today:e?.end;
const lifeEventActive=(e,today=iso(Date.now()))=>!e?.deleted&&Number.isFinite(dateOf(e?.start))&&Number.isFinite(dateOf(lifeEventEnd(e,today)));
const lifePeriod=e=>`${e.startPrecision==='month'?e.start.slice(0,7):e.start} – ${e.ongoing?'Ongoing':e.endPrecision==='month'?e.end.slice(0,7):e.end}`;
const lifeEventId=x=>String(x?.sourceRef||'').trim()||`${String(x?.category||'')}|${String(x?.title||'').trim().toLowerCase()}|${String(x?.start||'')}|${String(x?.organization||'').trim().toLowerCase()}`;
export function lifeYearRange(age,birthday=LIFE_BIRTHDAY){
 if(!Number.isInteger(age)||age<0||age>120||!Number.isFinite(dateOf(birthday)))throw Error('Ungültiges Lebensjahr.');
 const month=Number(birthday.slice(5,7))-1,day=Number(birthday.slice(8,10)),year=Number(birthday.slice(0,4));
 const start=Date.UTC(year+age,month,day),end=Date.UTC(year+age+1,month,day);
 return {age,start:iso(start),endExclusive:iso(end),startMs:start,endMs:end,days:(end-start)/DAY,years:`${year+age}/${String(year+age+1).slice(-2)}`};
}
export function lifeWeekCells(age,{birthday=LIFE_BIRTHDAY,today=iso(Date.now()),events=[]}={}){
 const range=lifeYearRange(age,birthday),todayMs=dateOf(today),cells=[];
 for(let w=0;w<Math.ceil(range.days/7);w++){
  const start=range.startMs+DAY*w*7,end=Math.min(range.endMs,start+DAY*7);
  const hits=(events||[]).filter(e=>!e?.deleted&&Number.isFinite(dateOf(e?.start))&&Number.isFinite(dateOf(lifeEventEnd(e,today)))&&dateOf(e.start)<end&&dateOf(lifeEventEnd(e,today))+DAY>start);
  cells.push({age,week:w+1,start:iso(start),end:iso(end-DAY),days:(end-start)/DAY,
   status:todayMs>=end?'past':todayMs>=start&&todayMs<end?'current':'future',events:hits});
 }
 return cells;
}
export function lifeMonthMarkers(age,birthday=LIFE_BIRTHDAY){
 const r=lifeYearRange(age,birthday),out=[{label:'Jun',date:r.start,pct:0,start:true}];
 const total=53*7*DAY;
 for(let m=0;m<13;m++){
  const year=new Date(r.startMs).getUTCFullYear(),month=5+m;
  const first=Date.UTC(year,month,1);
  if(first<=r.startMs||first>=r.endMs)continue;
  out.push({label:monthFormatter.format(new Date(first)),date:iso(first),pct:((first-r.startMs)/total)*100,newYear:new Date(first).getUTCMonth()===0});
 }
 return out;
}
export function lifeAgeAt(day,birthday=LIFE_BIRTHDAY){const t=dateOf(day),b=dateOf(birthday);if(!Number.isFinite(t)||!Number.isFinite(b))return null;let age=new Date(t).getUTCFullYear()-new Date(b).getUTCFullYear();if(t<lifeYearRange(Math.max(0,age),birthday).startMs)age--;return Math.max(0,age);}
export function validateLifeEvent(data){
 const ongoing=data?.ongoing===true||data?.ongoing==='true';
 const startPrecision=data?.startPrecision==='month'?'month':'day',endPrecision=data?.endPrecision==='month'?'month':'day';
 const e={id:String(data?.id||'').trim().slice(0,130)||crypto.randomUUID(),title:String(data?.title||'').trim().slice(0,150),
  start:String(data?.start||''),end:ongoing?'':String(data?.end||''),ongoing,startPrecision,endPrecision,
  category:String(data?.category||'other'),location:String(data?.location||'').trim().slice(0,160),
  organization:String(data?.organization||'').trim().slice(0,180),person:String(data?.person||'').trim().slice(0,120),
  note:String(data?.note||'').trim().slice(0,1500),source:['calendar','linkedin','import'].includes(data?.source)?data.source:'manual',
  sourceRef:String(data?.sourceRef||'').slice(0,320),calendarRef:String(data?.calendarRef||'').slice(0,240),
  private:data?.private===true||data?.category==='relationship',updatedAt:new Date().toISOString(),deleted:data?.deleted===true};
 if(e.title.length<2)throw Error('Bitte einen Ereignistitel eingeben.');
 const a=dateOf(e.start),b=ongoing?Date.now():dateOf(e.end);
 if(!Number.isFinite(a)||!Number.isFinite(b)||a>b||a<dateOf(LIFE_BIRTHDAY)||b>dateOf('2110-12-31'))throw Error('Gültige Daten ab dem Geburtstag eingeben. Das Enddatum zählt mit.');
 if(e.startPrecision==='month'&&e.start.slice(-2)!=='01')throw Error('Monatsgenauer Beginn benötigt den ersten Monatstag als Rechenanker.');
 if(e.endPrecision==='month'&&!ongoing){const d=new Date(dateOf(e.end));d.setUTCDate(d.getUTCDate()+1);if(d.getUTCDate()!==1)throw Error('Monatsgenaues Ende benötigt den letzten Monatstag als Rechenanker.');}
 if(!LIFE_EVENT_CATEGORIES.some(x=>x[0]===e.category))throw Error('Unbekannte Ereigniskategorie.');
 return e;
}
/** Import from GPT/LinkedIn: strict schema, local-only validation, explicit review and de-duplication. */
export function parseLifeEventsImport(raw,{existing=[],today=iso(Date.now())}={}){
 if(typeof raw!=='string'||raw.length>250000)throw Error('Importtext fehlt oder ist zu groß (max. 250 KB).');
 let txt=raw.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim(),value;
 try{value=JSON.parse(txt);}catch{throw Error('Kein gültiges JSON. Bitte einen vollständigen compass_life_events_v1-Block einfügen.');}
 if(!value||Array.isArray(value)||value.schema!=='compass_life_events_v1'||!Array.isArray(value.events))throw Error('Erwartet: {"schema":"compass_life_events_v1","events":[…]}.');
 if(value.events.length>150)throw Error('Maximal 150 Ereignisse pro Import.');
 const seen=new Set(),old=(existing||[]).filter(x=>x&&!x.deleted),preview=[];
 for(let i=0;i<value.events.length;i++){
  const entry=value.events[i];if(!entry||typeof entry!=='object'||Array.isArray(entry))throw Error(`Eintrag ${i+1}: Objekt erwartet.`);
  const e=validateLifeEvent({...entry,source:['linkedin','calendar'].includes(entry.source)?entry.source:'import'});
  const key=lifeEventId(e);if(seen.has(key))throw Error(`Eintrag ${i+1}: Doppelte Quellenkennung im Import.`);seen.add(key);
  const duplicate=old.some(x=>x.id===e.id||(e.sourceRef&&x.sourceRef===e.sourceRef)||lifeEventId(x)===key);
  preview.push({...e,duplicate,previewIndex:i});
 }
 return preview;
}
export function applyLifeEventsImport(state,entries){
 if(!Array.isArray(entries)||entries.length>150)throw Error('Ungültige Importauswahl.');
 const existing=state.lifeWeekEvents||[],used=new Set(),newEntries=[];
 for(const draft of entries){const e=validateLifeEvent(draft);const key=lifeEventId(e);
  if(used.has(key)||existing.some(x=>!x.deleted&&(x.id===e.id||(e.sourceRef&&x.sourceRef===e.sourceRef)||lifeEventId(x)===key)))continue;
  used.add(key);newEntries.push(e);
 }
 state.lifeWeekEvents=[...existing,...newEntries];return newEntries.length;
}
export function putLifeEvent(state,entry){const row=validateLifeEvent(entry);state.lifeWeekEvents=Array.isArray(state.lifeWeekEvents)?state.lifeWeekEvents:[];const i=state.lifeWeekEvents.findIndex(v=>v?.id===row.id);if(i<0)state.lifeWeekEvents.push(row);else state.lifeWeekEvents[i]=row;return row;}
export function deleteLifeEvent(state,id){const e=(state?.lifeWeekEvents||[]).find(x=>x.id===id&&!x.deleted);if(!e)throw Error('Ereignis nicht gefunden.');Object.assign(e,{deleted:true,updatedAt:new Date().toISOString()});}
export function mergeLifeWeekEvents(a,b){const byId=new Map();for(const row of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){if(!row?.id)continue;const prev=byId.get(row.id);if(!prev||String(row.updatedAt||'')>String(prev.updatedAt||'')||(String(row.updatedAt||'')===String(prev.updatedAt||'')&&row.deleted===true))byId.set(row.id,row);}return [...byId.values()].sort((a,b)=>a.start.localeCompare(b.start)||a.id.localeCompare(b.id));}
function calDay(v){if(v?.date&&RE.test(v.date))return v.date;if(v?.dateTime){const t=Date.parse(v.dateTime);if(Number.isFinite(t))return new Date(t).toLocaleDateString('sv-SE',{timeZone:'Europe/Vienna'});}return '';}
export function calendarLifeCandidates(calendar=[],age=43,{query='',existing=[],onlyTravel=true,limit=60}={}){
 const r=lifeYearRange(age),seen=new Set(),already=new Set((existing||[]).filter(x=>!x.deleted&&x.calendarRef).map(x=>x.calendarRef)),terms=/reise|urlaub|holiday|vacation|sydney|china|australia|australien|flug|flight|hotel|trip|asia|asien|semester|international|familienurlaub|auslands/i;
 const q=String(query||'').trim().toLocaleLowerCase('de-AT');
 return (Array.isArray(calendar)?calendar:[]).filter(e=>e&&e.status!=='cancelled').map(e=>{
  const start=calDay(e.start),rawEnd=calDay(e.end),exclusive=Boolean(e.end?.date)&&!e.end?.dateTime;
  const end=exclusive&&Number.isFinite(dateOf(rawEnd))?iso(dateOf(rawEnd)-DAY):rawEnd||start;
  const title=String(e.summary||'').trim().slice(0,150),location=String(e.location||'').trim().slice(0,160),id=String(e.id||'');
  return {id,title,location,start,end,likelyTravel:terms.test(title+' '+location)};
 }).filter(e=>e.id&&e.title&&Number.isFinite(dateOf(e.start))&&Number.isFinite(dateOf(e.end))&&dateOf(e.start)<r.endMs&&dateOf(e.end)>=r.startMs&&!already.has(e.id)&&!seen.has(e.id)&&(seen.add(e.id))&&(q?(e.title+' '+e.location).toLocaleLowerCase('de-AT').includes(q):(!onlyTravel||e.likelyTravel))).sort((a,b)=>a.start.localeCompare(b.start)).slice(0,limit);
}
/** Counters use Vienna-local calendar dates supplied by the app. Birth day = day 1. */
export function lifeElapsedMetrics(day,birthday=LIFE_BIRTHDAY){
 const t=dateOf(day),b=dateOf(birthday);
 if(!Number.isFinite(t)||!Number.isFinite(b)||t<b)return null;
 const current=new Date(t),birth=new Date(b),completedDays=Math.floor((t-b)/DAY);
 const age=lifeAgeAt(day,birthday);
 let fullMonths=(current.getUTCFullYear()-birth.getUTCFullYear())*12+(current.getUTCMonth()-birth.getUTCMonth());
 if(current.getUTCDate()<birth.getUTCDate())fullMonths--;
 const sevenCycle=Math.floor(age/7)+1,sevenYear=age%7+1;
 const cycleStart=lifeYearRange((sevenCycle-1)*7,birthday).start;
 const cycleEndExclusive=lifeYearRange(sevenCycle*7,birthday).start;
 return {age,lifeYear:age+1,completedDays,lifeDay:completedDays+1,completedWeeks:Math.floor(completedDays/7),lifeWeek:Math.floor(completedDays/7)+1,
  completedMonths:fullMonths,lifeMonth:fullMonths+1,sevenCycle,sevenYear,cycleAgeStart:(sevenCycle-1)*7,cycleAgeEnd:sevenCycle*7-1,cycleStart,cycleEndExclusive};
}
export const LIFE_ZOOM_OPTIONS=Object.freeze([100,90,80,75,70,60,50]);
export function normalizeLifeZoom(zoom){if(zoom==='fit')return 'fit';const n=Number(zoom);return LIFE_ZOOM_OPTIONS.includes(n)?n:'fit';}
export function lifeZoomSizing(zoom,years,viewportHeight=900){
 const value=normalizeLifeZoom(zoom),count=Math.max(1,Math.min(110,Number(years)||80));
 if(value==='fit'){
  // Leave room for the sticky month labels, legend and surrounding controls.
  const height=Math.min(760,Math.max(330,Math.round(viewportHeight*.72)));
  const row=Math.max(4.5,Math.min(19,(height-48)/count-0.5));
  return {zoom:value,years:count,rowHeight:row,gap:0.5,cellHeight:Math.max(3,row-1),viewportHeight:height};
 }
 const f=value/100;
 return {zoom:value,years:count,rowHeight:19*f,gap:2*f,cellHeight:Math.max(4,12*f),viewportHeight:Math.min(760,Math.max(330,Math.round(viewportHeight*.72)))};
}
export const lifeYearTier=age=>age>=100?'star':age>=90?'gold':age>=80?'silver':age>=70?'bronze':'base';
function markers(age,withLabels=false){const list=lifeMonthMarkers(age);return list.filter(x=>!x.start).map(x=>`<span class="lw82-month-line${x.newYear?' lw82-year-line':''}" style="left:${x.pct.toFixed(4)}%" title="${esc(x.date)} · ${x.newYear?'Neujahr':'Monatsanfang'}"></span>${withLabels?`<span class="lw82-month-label${x.newYear?' lw82-jan':''}${x.date.slice(5,10)==='07-01'?' lw82-july':''}" style="left:${x.pct.toFixed(4)}%" title="${esc(x.date)}">${esc(x.label)}</span>`:''}`).join('');}
function square(cell){const cs=cell.events.filter(e=>e.category!=='relationship').map(e=>color(e.category));const bg=cs.length===1?`background:${cs[0]};`:cs.length>1?`background:linear-gradient(90deg,${cs[0]} 0 50%,${cs[1]} 50%);`:'';
 const cls=cs.length?' is-event':cell.status==='past'?' is-past':cell.status==='current'?' is-now':' is-future';const tip=`${fmt(dateOf(cell.start))} – ${fmt(dateOf(cell.end))}${cell.days<7?' · Teilwoche':''}${cell.events.length?' · '+cell.events.map(e=>e.title).join(' / '):''}`;
 return `<button type="button" class="lw82-week${cls}${cell.status==='current'?' is-current':''}" data-lw82-week="${cell.age}:${cell.week}" title="${esc(tip)}" aria-label="Lebensjahr ${cell.age}, Woche ${cell.week}: ${esc(tip)}" style="${bg}"></button>`;
}
const eventDisplay=e=>`<div class="lw82-event" style="--lw82-event:${color(e.category)}"><div><strong>${esc(e.title)}</strong><small>${esc(lifePeriod(e))} · ${esc(name(e.category))}${e.location?' · '+esc(e.location):''}${e.organization?' · '+esc(e.organization):''}${e.person?' · '+esc(e.person):''}</small></div><button type="button" class="secondary-btn" data-action="lw82-edit" data-id="${esc(e.id)}">Bearbeiten</button></div>`;
function lifeRelationshipRibbons(age,events,today){
 const r=lifeYearRange(age),duration=r.endMs-r.startMs,relationships=events.filter(e=>e.category==='relationship'&&lifeEventActive(e,today)&&dateOf(e.start)<r.endMs&&dateOf(lifeEventEnd(e,today))>=r.startMs).slice(0,3);
 return relationships.map((e,i)=>{const a=Math.max(r.startMs,dateOf(e.start)),b=Math.min(r.endMs,dateOf(lifeEventEnd(e,today))+DAY),start=100*(a-r.startMs)/duration,width=100*(b-a)/duration;
  return `<span class="lw84-relationship-ribbon" style="left:${start.toFixed(3)}%;width:${width.toFixed(3)}%;bottom:${i*2.5}px" title="${esc((e.person||e.title)+' · '+lifePeriod(e))}"></span>`;
 }).join('');
}
function lifeTimelineLanes(events,range,today){
 const rows=events.filter(e=>['relationship','education','learning','work','career','volunteer'].includes(e.category)&&lifeEventActive(e,today));
 if(!rows.length)return '';
 const total=range.endMs-range.startMs;
 return `<section class="lw84-timeline" aria-label="Lebensabschnitte im Jahreszeitstrahl"><h4>Lebensabschnitte im Zeitstrahl</h4>${rows.map(e=>{
  const a=Math.max(dateOf(e.start),range.startMs),b=Math.min(dateOf(lifeEventEnd(e,today))+DAY,range.endMs);
  const left=Math.max(0,Math.min(100,100*(a-range.startMs)/total)),width=Math.max(0,100*(b-a)/total);
  return `<div class="lw84-timeline-row"><span title="${esc(e.title)}">${esc(e.person||e.organization||e.title)}</span><div class="lw84-timeline-track"><span style="left:${left.toFixed(3)}%;width:${width.toFixed(3)}%;background:${color(e.category)}" title="${esc(e.title+' · '+lifePeriod(e))}"></span></div><small>${esc(lifePeriod(e))}</small></div>`;
 }).join('')}</section>`;
}
function editor(draft={}){return `<section class="lw82-editor" id="lw82-editor"><div class="lw82-section-head"><div><h3>${draft.id?'Lebensereignis bearbeiten':'Lebensereignis hinzufügen'}</h3><p>Ein Zeitraum genügt. Bei Beziehungen ist ein offenes Enddatum möglich. Bei monatsgenauen LinkedIn-Angaben stehen der Monatserste bzw. Monatsletzte nur als Rechenanker.</p></div></div>
<form id="lw82-event-form" data-id="${esc(draft.id||'')}"><label>Titel<input name="title" maxlength="150" required placeholder="z. B. Familienurlaub in China" value="${esc(draft.title||'')}"/></label><div class="lw82-fields"><label>Beginn<input type="date" name="start" required value="${esc(draft.start||'')}"/></label><label>Beginn-Genauigkeit<select name="startPrecision"><option value="day" ${draft.startPrecision!=='month'?'selected':''}>Tag bekannt</option><option value="month" ${draft.startPrecision==='month'?'selected':''}>Nur Monat bekannt</option></select></label><label>Ende (einschließlich)<input type="date" name="end" ${draft.ongoing?'disabled':''} ${draft.ongoing?'':'required'} value="${esc(draft.end||draft.start||'')}"/></label><label>Ende-Genauigkeit<select name="endPrecision"><option value="day" ${draft.endPrecision!=='month'?'selected':''}>Tag bekannt</option><option value="month" ${draft.endPrecision==='month'?'selected':''}>Nur Monat bekannt</option></select></label><label>Kategorie<select name="category">${LIFE_EVENT_CATEGORIES.map(c=>`<option value="${c[0]}" ${draft.category===c[0]?'selected':''}>${c[3]} ${c[1]}</option>`).join('')}</select></label><label>Person (optional)<input name="person" maxlength="120" placeholder="Name der Partnerperson" value="${esc(draft.person||'')}"/></label><label>Organisation (optional)<input name="organization" maxlength="180" placeholder="Arbeitgeber / Hochschule" value="${esc(draft.organization||'')}"/></label><label>Ort (optional)<input name="location" maxlength="160" placeholder="Sydney, China, …" value="${esc(draft.location||'')}"/></label></div><label class="lw84-checkbox"><input type="checkbox" name="ongoing" value="true" ${draft.ongoing?'checked':''}/> Ongoing – dieser Lebensabschnitt dauert an (kein Enddatum)</label><label>Erinnerung / Notiz (optional)<textarea name="note" rows="2" maxlength="1500">${esc(draft.note||'')}</textarea></label><div class="lw82-actions"><button class="primary-btn" type="submit">${draft.id?'Änderungen speichern':'Ereignis speichern'}</button>${draft.id?`<button type="button" class="secondary-btn" data-action="lw82-delete" data-id="${esc(draft.id)}">Löschen</button>`:''}<button type="button" class="secondary-btn" data-action="lw82-clear">Neue Eingabe</button></div></form></section>`;}
function lifeImportPanel(preview=[]){return `<section class="lw84-import" id="lw84-import"><h3>Lebenslauf und Beziehungen importieren</h3><p>Hier einen JSON-Block im Format <code>compass_life_events_v1</code> einfügen (z. B. aus diesem Chat). Zuerst prüfen, dann einzelne Zeitspannen bestätigen. Nichts wird ohne Bestätigung gespeichert.</p><form id="lw84-import-parse"><label>JSON-Import<textarea name="json" rows="5" maxlength="250000" placeholder='{"schema":"compass_life_events_v1","events":[…]}'></textarea></label><button type="submit" class="secondary-btn">Import prüfen</button></form>${preview.length?`<form id="lw84-import-apply"><h4>Prüfvorschau · ${preview.length} Einträge</h4><p>Nur angehakte Einträge werden gespeichert. Bereits vorhandene Einträge sind deaktiviert.</p><div class="lw84-import-items">${preview.map(e=>`<label class="lw84-import-item"><input type="checkbox" name="choice" value="${e.previewIndex}" ${e.duplicate?'disabled':'checked'}/><span><strong>${esc(e.title)}</strong><small>${esc(lifePeriod(e))} · ${esc(name(e.category))}${e.organization?' · '+esc(e.organization):''}${e.person?' · '+esc(e.person):''}${e.duplicate?' · Schon vorhanden':''}</small></span></label>`).join('')}</div><button type="submit" class="primary-btn">Ausgewählte Einträge verschlüsselt übernehmen</button></form>`:''}</section>`;}
export function lifeWeeksView(state,{today=new Date().toLocaleDateString('sv-SE'),selectedAge=null,selectedWeek=null,draft={},bonus=false,star=false,matrixZoom='fit',calendar=[],calendarQuery='',calendarResults=[],calendarLive=false,calendarConnected=false,calendarLoading=false,importPreview=[],showPrivatePdf=false}={}){
 const ageNow=lifeAgeAt(today),all=(state?.lifeWeekEvents||[]).filter(e=>e&&!e.deleted),focus=Number.isInteger(selectedAge)?selectedAge:null;
 const thisYear=focus===null?Math.min(109,ageNow??43):Math.max(0,Math.min(109,focus)),range=lifeYearRange(thisYear),events=all.filter(e=>Number.isFinite(dateOf(e.start))&&Number.isFinite(dateOf(lifeEventEnd(e,today)))&&dateOf(e.start)<range.endMs&&dateOf(lifeEventEnd(e,today))>=range.startMs).sort((a,b)=>a.start.localeCompare(b.start));
 const dates=Array.from({length:star?110:bonus?100:80},(_,i)=>i),lastWeek=ageNow===null?null:lifeWeekCells(ageNow,{today})?.find(w=>w.status==='current');
 const count=all.filter(e=>dateOf(e.start)<=dateOf(today)).length,metrics=lifeElapsedMetrics(today),currentZoom=normalizeLifeZoom(matrixZoom);
 const rows=dates.map(age=>{const cells=lifeWeekCells(age,{today,events:all});return `<div class="lw82-row lw82-${lifeYearTier(age)}${age%7===0?' lw83-cycle-start':''}${age%5===0||age===ageNow?' lw83-labeled':''}" data-age="${age}"><button type="button" class="lw82-row-label" data-action="lw82-year" data-id="${age}" title="Lebensjahr ${age+1} öffnen">${String(1983+age)}<span>/ ${String(1984+age).slice(-2)}</span><small>${age} J.</small></button><div class="lw82-row-grid">${cells.map(square).join('')}${markers(age)}${lifeRelationshipRibbons(age,all,today)}</div></div>`;}).join('');
 const zoom=lifeWeekCells(thisYear,{today,events:all});const chosen=selectedWeek&&zoom.find(w=>w.week===selectedWeek);
 const suggestions=calendarLifeCandidates([...calendar,...calendarResults],thisYear,{query:calendarQuery,existing:all,onlyTravel:!calendarQuery});
 return `<section class="lw82-root" aria-label="My Life in Weeks"><header class="lw82-intro"><small>ARS VIVENDI · MY LIFE IN WEEKS</small><h2>Ein Leben. Woche für Woche.</h2><p>28. Juni 1983 · 80 Jahre Orientierungsbereich · Bronze ab 70 · Silber ab 80 · Gold ab 90 · Gold-Star-Plus ab 100. Kein festgelegtes Lebensende.</p></header>
 <div class="lw83-life-line" aria-label="Deine Lebenszeit in Tagen, Wochen, Monaten und Siebenjahreszyklen">
 <div><small>Lebensjahr</small><strong>${metrics?metrics.lifeYear+'.':'–'}</strong><span>${metrics?metrics.age+' Jahre alt':'–'}</span></div>
 <div><small>Dein Lebenstag</small><strong>${metrics?metrics.lifeDay.toLocaleString('de-AT')+'.':'–'}</strong><span>${metrics?metrics.completedDays.toLocaleString('de-AT')+' Tage gelebt':'–'}</span></div>
 <div><small>Deine Lebenswoche</small><strong>${metrics?metrics.lifeWeek.toLocaleString('de-AT')+'.':'–'}</strong><span>${metrics?metrics.completedWeeks.toLocaleString('de-AT')+' Wochen abgeschlossen':'–'}</span></div>
 <div><small>Dein Lebensmonat</small><strong>${metrics?metrics.lifeMonth.toLocaleString('de-AT')+'.':'–'}</strong><span>Ab 28. Juni 1983 gezählt</span></div>
 <div class="lw83-cycle-card"><small>7-Jahreszyklus</small><strong>${metrics?metrics.sevenCycle+'.':'–'}</strong><span>${metrics?metrics.cycleAgeStart+'–'+metrics.cycleAgeEnd+' Jahre · Jahr '+metrics.sevenYear+' von 7':'–'}</span></div>
 </div><p class="lw83-life-notes">${metrics?`Siebenjahreszyklus ${metrics.sevenCycle}: ${esc(fmt(dateOf(metrics.cycleStart)))} – ${esc(fmt(dateOf(metrics.cycleEndExclusive)-DAY))}. Die Zyklen sind eine frei gewählte Orientierung, keine wissenschaftliche Entwicklungsprognose.`:''} · ${count} Lebensereignisse eingetragen</p>
 <div class="lw82-legend">${[['#9ea9ac','Vergangene Wochen'],['#f8faf9','Zukünftige Wochen'],...LIFE_EVENT_CATEGORIES.map(x=>[x[2],x[1]])].map(([hex,label])=>`<span><i style="background:${hex}"></i>${esc(label)}</span>`).join('')}<span class="lw82-current-legend">◎ Aktuelle Woche</span><span class="lw83-cycle-legend">│ 7-Jahreszyklus-Grenze</span></div>
 <div class="lw82-navigator"><button type="button" class="secondary-btn" data-action="lw82-today">◎ Zu meiner Lebenswoche</button><button type="button" class="secondary-btn" data-action="lw82-new">+ Ereignis eintragen</button><button type="button" class="secondary-btn" data-action="lw84-import-open">⇪ Lebenslauf importieren</button><button type="button" class="secondary-btn" data-action="lw82-bonus">${bonus?'80–99 ausblenden':'80–99 · Bonusjahre'}</button><button type="button" class="secondary-btn" data-action="lw82-star">${star?'100+ ausblenden':'100+ · Gold-Star-Plus'}</button></div>
 <p class="lw82-june-key"><strong>Jahresbeginn am Geburtstag:</strong> 28.–30. Juni · <strong class="lw82-july-label">│ 1. Juli</strong> (Monatslinie im ersten Kästchen) · <strong>✦ 1. Jänner</strong> (goldene Jahreswechsellinie)</p>
 <div class="lw83-zoom-toolbar" role="group" aria-label="Zoom für die Wochen-Gesamtübersicht"><span class="lw83-zoom-heading">Gesamtübersicht · Zoom</span><div class="lw83-zoom-buttons">${LIFE_ZOOM_OPTIONS.map(z=>`<button type="button" class="secondary-btn lw83-zoom-button${currentZoom===z?' is-active':''}" data-action="lw83-zoom" data-id="${z}" aria-pressed="${currentZoom===z}">${z} %</button>`).join('')}<button type="button" class="secondary-btn lw83-zoom-button${currentZoom==='fit'?' is-active':''}" data-action="lw83-zoom" data-id="fit" aria-pressed="${currentZoom==='fit'}">Alles einpassen</button></div><small>Nur die Wochenmatrix wird skaliert · alle Jahre im Überblick</small></div>
 <div class="lw83-export-toolbar" role="group" aria-label="Einseitiges Lebensposter als PDF herunterladen"><strong>Lebensposter · Vektor-PDF</strong><button type="button" class="secondary-btn" data-action="lw83-pdf" data-id="A4">PDF · A4 quer</button><button type="button" class="secondary-btn" data-action="lw83-pdf" data-id="A3">PDF · A3 quer</button><label class="lw84-checkbox lw84-pdf-private-label"><input type="checkbox" id="lw84-pdf-private" ${showPrivatePdf?'checked':''}/> Private Beziehungen im PDF anzeigen</label><small>Eine Seite · lokal erstellt · private Beziehungen standardmäßig ausgeblendet</small></div>
 <div class="lw82-main-scroll" tabindex="0" aria-label="Lebensmatrix, vertikal und horizontal scrollbar"><div class="lw82-matrix" data-lw83-zoom="${currentZoom}" data-lw83-years="${dates.length}"><div class="lw82-month-header"><span>Lebensjahr</span><div class="lw82-month-track"><strong>Jun 28</strong>${markers(thisYear,true)}</div></div><div class="lw82-rows" id="lw82-rows">${rows}</div></div></div>
 <p class="lw82-hint">Jede Zeile beginnt an deinem Geburtstag am 28. Juni. Die kurze erste Juniphase endet an der Monatslinie zum 1. Juli. Gold markiert den 1. Jänner. Jede 53. Zelle ist eine kurze Teilwoche. Antippen/Anklicken öffnet das Lebensjahr, Hover zeigt Datum und Ereignisse.</p>
 <section class="lw82-detail" id="lw82-detail"><div class="lw82-detail-head"><div><small>LEBENSCHRONIK · ZOOM</small><h3>Lebensjahr ${thisYear+1} · ${esc(range.years)}</h3><p>${esc(fmt(range.startMs))} – ${esc(fmt(range.endMs-DAY))}</p></div><div><button type="button" class="secondary-btn" data-action="lw82-previous" ${thisYear===0?'disabled':''}>←</button><button type="button" class="secondary-btn" data-action="lw82-next" ${thisYear===109?'disabled':''}>→</button></div></div>
 <div class="lw82-zoom-scroll"><div class="lw82-zoom-track"><div class="lw82-zoom-labels"><strong>Jun 28</strong>${markers(thisYear,true)}</div><div class="lw82-zoom-grid">${zoom.map(square).join('')}${markers(thisYear)}</div></div></div>${lifeTimelineLanes(events,range,today)}
 ${chosen?`<div class="lw82-chosen">Ausgewählte Woche ${chosen.week}: ${esc(fmt(dateOf(chosen.start)))} bis ${esc(fmt(dateOf(chosen.end)))} · ${chosen.events.length} Ereignis(se)</div>`:''}
 <div class="lw82-event-head"><h4>Lebensereignisse in diesem Jahr</h4><span>${events.length}</span></div>${events.length?`<div class="lw82-event-list">${events.map(eventDisplay).join('')}</div>`:'<p class="muted-line">In diesem Lebensjahr noch keine Ereignisse hinterlegt. Wähle eine Woche oder gib einen Zeitraum ein.</p>'}
 ${editor(draft)}
 ${lifeImportPanel(importPreview)}
 <section class="lw82-calendar"><div class="lw82-section-head"><div><h3>Aus Google Kalender vorschlagen</h3><p>Keine automatische Übernahme. Du bestätigst jedes Ereignis selbst. Auch alte Jahre können gezielt durchsucht werden.</p></div></div><form id="lw82-calendar-filter"><label>Begriff suchen<input name="query" value="${esc(calendarQuery)}" placeholder="z. B. Sydney, China, Urlaub" /></label><button class="secondary-btn" type="submit">Suchen</button></form><div class="lw82-actions"><button type="button" class="secondary-btn" data-action="lw82-calendar-fetch" ${calendarLoading?'disabled':''}>${calendarLoading?'Kalender wird durchsucht …':`Kalender ${esc(range.years)} nachrecherchieren`}</button>${!calendarConnected?'<button type="button" class="secondary-btn" data-action="calendar-connect">Google Calendar verbinden</button><small>Für eine historische Live-Recherche benötigt Compass deine bestehende Google-Calendar-Freigabe. Gespeicherte Termine werden auch ohne Freigabe angezeigt.</small>':''}</div>
 ${suggestions.length?`<div class="lw82-candidates">${suggestions.map(e=>`<div class="lw82-candidate"><div><strong>${esc(e.title)}</strong><small>${esc(e.start)} – ${esc(e.end)}${e.location?' · '+esc(e.location):''} · Kalenderhinweis, noch nicht gespeichert</small></div><button type="button" class="secondary-btn" data-action="lw82-calendar-choose" data-id="${esc(e.id)}">Als Ereignis prüfen</button></div>`).join('')}</div>`:'<p class="muted-line">Keine passenden Kalendertermine in den aktuell gespeicherten Daten gefunden. Suche nach einem Begriff oder recherchiere dieses Lebensjahr.</p>'}</section></section></section>`;
}
