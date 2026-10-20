/** Compass 0.5.55 · Conference & Opportunity Radar (local-first).
 * Fixed, dated editorial snapshot. This is NOT live web search or a background monitor.
 * All user records are validated and stored only after deliberate action in the Vault.
 */
import {parseProjectPlan,EXCHANGE_FORMAT,EXCHANGE_VERSION} from './project-exchange-v45.js';
import {proactivePlan} from './proactive-planner-v47.js';
export const RADAR_CHECKED_AT='2026-10-20';
export const RADAR_REGIONS=['Europa','Asien','Nordamerika','Australien / Ozeanien','Andere'];
export const RADAR_TOPICS=['Nachhaltigkeit','Geschäftsmodelle','Innovation','Ownership','Strategisches Timing'];
export const RADAR_SEEDS=Object.freeze([
 {id:'ispim-2027',title:'ISPIM Innovation Conference 2027',region:'Europa',location:'Riga, Lettland',deadline:'2027-01-29',eventDate:'2027-06-06',format:'Einreichungsformat vor Planung auf der Quelle prüfen',topics:['Geschäftsmodelle','Innovation','Nachhaltigkeit'],source:'https://www.ispim-innovation.com/post/call-for-submissions-2027-ispim-innovation-conference',note:'Tracks u. a. Business Models, Responsible Innovation und Sustainability-Oriented Innovation Management.'},
 {id:'aib-2027',title:'AIB Annual Meeting 2027',region:'Asien',location:'Malaysia',deadline:'2027-01-12',eventDate:'2027-06-26',format:'Paper / Einreichungsformat prüfen',topics:['Geschäftsmodelle','Innovation'],source:'https://www.aib.world/2027-annual-meeting/contribute/call-for-papers/',note:'International Business; Einreichfenster laut Call ab 9.11.2026.'},
 {id:'icsbpim-2027',title:'Sustainable Business Practices & Innovative Models 2027',region:'Asien',location:'Ghaziabad (Delhi NCR), Indien · hybrid',deadline:'2026-10-31',eventDate:'2027-01-12',format:'Abstract / Vorgaben auf der Quelle prüfen',topics:['Nachhaltigkeit','Geschäftsmodelle','Innovation'],source:'https://sbmconferencencr.christuniversity.in/?page=call_for_papers',note:'Abstrakteinreichung bis 31.10.2026 laut Veranstalter; Reiseform kann entfallen (hybrid).'}
]);
const ISO=/^\d{4}-\d{2}-\d{2}$/;
const clean=(v,max)=>String(v??'').trim().slice(0,max);
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeConferenceUrl(v){try{const u=new URL(String(v||''));return u.protocol==='https:'&&u.username===''&&u.password===''&&u.hostname&&u.href.length<=700?u.href:'';}catch{return '';}}
export function validConference(entry){return !!(entry&&typeof entry.id==='string'&&/^[a-z0-9-]{1,80}$/.test(entry.id)&&typeof entry.title==='string'&&entry.title.trim().length>=3&&entry.title.length<=160&&RADAR_REGIONS.includes(entry.region)&&Array.isArray(entry.topics)&&entry.topics.length>0&&entry.topics.length<=5&&entry.topics.every(x=>RADAR_TOPICS.includes(x))&&safeConferenceUrl(entry.source)&&(!entry.deadline||ISO.test(entry.deadline)&&new Date(entry.deadline+'T12:00:00Z').toISOString().slice(0,10)===entry.deadline)&&['neu','merken','ignorieren','projekt'].includes(entry.status||'neu'));}
export function newConference(fields,id){
 const r={id,title:clean(fields.title,160),region:fields.region,location:clean(fields.location,120),deadline:clean(fields.deadline,10)||null,eventDate:null,format:clean(fields.format,140)||'Einreichungsformat prüfen',topics:fields.topics,source:safeConferenceUrl(fields.source),note:clean(fields.note,500),status:'merken',verifiedAt:null,custom:true};
 if(!validConference(r))throw Error('Bitte Titel, HTTPS-Quelle, Themen, Region und gegebenenfalls ein gültiges Datum angeben.');return r;
}
export function conferenceEntries(state){
 const records=Array.isArray(state?.conferenceRadar)?state.conferenceRadar:[];
 const overlay=new Map(records.filter(r=>r&&typeof r.id==='string').map(x=>[x.id,x]));
 return [...RADAR_SEEDS.map(s=>({...s,status:['merken','ignorieren','projekt'].includes(overlay.get(s.id)?.status)?overlay.get(s.id).status:'neu',verifiedAt:RADAR_CHECKED_AT})),...records.filter(x=>x.custom&&validConference(x)&&!RADAR_SEEDS.some(s=>s.id===x.id))];
}
export function setConferenceStatus(state,id,status){
 if(!['neu','merken','ignorieren','projekt'].includes(status))throw Error('Unbekannter Status.');
 const row=conferenceEntries(state).find(r=>r.id===id);if(!row)throw Error('Konferenz nicht gefunden.');
 const copy={...state,conferenceRadar:[...(Array.isArray(state.conferenceRadar)?state.conferenceRadar:[])]};
 const pos=copy.conferenceRadar.findIndex(x=>x.id===id);
 const next=row.custom?{...row,status}:{id,status};
 if(pos<0)copy.conferenceRadar.push(next);else copy.conferenceRadar[pos]=next;
 return copy.conferenceRadar;
}
export function conferenceAssessment(row,forecast,state,today){
 if(!row.deadline)return {state:'unknown',description:'Keine bestätigte Deadline – erst beim Veranstalter prüfen.'};
 if(row.deadline<today)return {state:'expired',description:'Einreichfrist bereits abgelaufen – Quelle auf Verlängerung prüfen.'};
 if(forecast?.status!=='ready')return {state:'unknown',description:'Kalender nicht vollständig und aktuell geladen – keine Kapazitätsaussage.'};
 if(row.deadline>forecast.through)return {state:'outside',description:'Frist außerhalb des 30-Tage-Horizonts – noch keine zuverlässige Kapazitätsprognose.'};
 const plan=proactivePlan(state,forecast);
 if(plan.status!=='ready'&&plan.status!=='planned')return {state:'unknown',description:'Planungskapazität nicht auswertbar.'};
 const demand=estimateConferenceMinutes(row);
 const free=Math.round(forecast.slots.filter(s=>s.day<=row.deadline).reduce((n,s)=>n+s.minutes,0)*0.8);
 const allocated=(plan.blocks||[]).filter(b=>b.day<=row.deadline).reduce((n,b)=>n+b.minutes,0);
 const available=Math.max(0,free-allocated);
 const unknown=(plan.unknown||[]).length;
 return {state:unknown?'unknown':available>=demand?'capacity':'tight',available,demand,unknown,description:unknown?`${unknown} bestehende Aufgaben ohne belastbare Aufwandsschätzung. ${Math.round(available/60)} h rechnerisch noch frei – keine Machbarkeitszusage.`:`${Math.round(available/60)} h nach bekannten Planblöcken / 80-%-Puffer; Projektentwurf ca. ${Math.round(demand/60)} h. Keine Reservierung.`};
}
export function estimateConferenceMinutes(_row){return 60+90+240+180+90+60;}// customizable initial estimate, 12h; not a prediction.
/** No side effects: reuse the existing project exchange preview and confirmation flow. */
export function conferenceProjectPlan(row){
 if(!validConference(row)||!row.deadline)throw Error('Vor Projektplanung bitte eine offizielle Deadline hinterlegen.');
 const key='cfp-'+row.id;
 const steps=[
 ['Call prüfen: Format, Publikationsoptionen und Kosten',60],
 ['Passung zur Forschungsfrage und Betreuungsfeedback klären',90],
 ['Kernargument / Literatur und Beitrag strukturieren',240],
 ['Abstract oder Einreichungstext entwerfen',180],
 ['Internes Feedback einarbeiten',90],
 ['Einreichung final prüfen und abgeben',60]
 ];
 const data={format:EXCHANGE_FORMAT,version:EXCHANGE_VERSION,projects:[{key,title:`CFP · ${row.title}`.slice(0,140),outcome:`Fristgerechte, qualitätsgeprüfte Einreichung: ${row.source}`.slice(0,800),category:'Forschung',kind:'project',status:'active',projectType:'sequential',dueDate:row.deadline}],tasks:steps.map(([title,estimateMinutes],i)=>({key:key+'-step-'+i,projectKey:key,title,note:i===0?`Offizielle Quelle: ${row.source}\nFrist: ${row.deadline}\nAufwände sind grobe editierbare STARTschätzungen, kein zugesagter Aufwand.`:i===5?`Vorher die Einreichmodalitäten und den letzten Termin erneut an der offiziellen Quelle überprüfen: ${row.source}`:'',category:'Forschung',workflow:'next',estimateMinutes,progressCurrent:0,progressTarget:null,dueDate:i===5?row.deadline:null,sortOrder:100+i*100}))};
 return parseProjectPlan(data);
}
export function conferenceRadarView(entries,{topic='all',region='all',today,forecast,state,escape=e}={}){
 const filtered=entries.filter(x=>x.status!=='ignorieren'&&(topic==='all'||x.topics.includes(topic))&&(region==='all'||x.region===region)).sort((a,b)=>Number(b.status==='merken')-Number(a.status==='merken')||(a.deadline||'9999').localeCompare(b.deadline||'9999'));
 const opt=(value,label,chosen)=>`<option value="${e(value)}" ${value===chosen?'selected':''}>${e(label)}</option>`;
 return `<section class="radar555" aria-label="Conference Radar"><div class="radar555-head"><div><small>FORSCHUNG · OPPORTUNITIES</small><h2>Konferenzen & Calls for Papers</h2><p>Offizielle Calls sichten, vormerken und als Projekt mit editierbarem Aufwand planen.</p></div><span class="quiet-tag">${filtered.length} Einträge</span></div>
 <div class="radar555-toolbar"><label>Thema <select id="radar555-topic">${opt('all','Alle Themen',topic)}${RADAR_TOPICS.map(t=>opt(t,t,topic)).join('')}</select></label><label>Region <select id="radar555-region">${opt('all','Alle Regionen',region)}${RADAR_REGIONS.map(r=>opt(r,r,region)).join('')}</select></label><span class="radar555-caption">Kuratierter Stand ${RADAR_CHECKED_AT}. Keine Live-Suche; Deadline vor Einreichung prüfen.</span></div>
 <div class="radar555-list">${filtered.map(x=>{const a=conferenceAssessment(x,forecast,state,today),days=x.deadline?Math.round((Date.parse(x.deadline+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000):null;return `<article class="radar555-row"><div class="radar555-top"><div><h3>${e(x.title)}</h3><small>${e(x.location||x.region)} · ${e(x.topics.join(' · '))}</small></div><span class="radar555-deadline ${days!==null&&days<=14?'radar555-soon':''}">${x.deadline?`Abgabe ${e(x.deadline)}${days>=0?' · '+days+' Tage':''}`:'Deadline prüfen'}</span></div><p>${e(x.note||x.format||'')}</p><div class="radar555-evidence"><span>${a.state==='tight'?'Zeitengpass möglich':a.state==='capacity'?'Rechnerisch Platz vorhanden':a.state==='expired'?'Frist vorbei':'Planung prüfen'}</span><small>${e(a.description)}</small></div><div class="radar555-actions"><a href="${e(x.source)}" target="_blank" rel="noopener noreferrer">Offizieller Call ↗</a><button type="button" class="secondary-btn" data-action="radar555-save" data-id="${e(x.id)}">${x.status==='merken'?'Merkliste ✓':'Merken'}</button><button type="button" class="secondary-btn" data-action="radar555-project" data-id="${e(x.id)}" ${!x.deadline?'disabled':''}>Projektentwurf ↗</button><button type="button" class="radar555-ignore" data-action="radar555-ignore" data-id="${e(x.id)}" title="Nicht mehr anzeigen" aria-label="${e(x.title)} ausblenden">×</button></div></article>`;}).join('')||'<p class="muted-line">Keine Treffer für diese Filter. Du kannst unten einen Call ergänzen.</p>'}</div>
 <details class="radar555-create"><summary>+ Eigenen Call hinzufügen</summary><form id="radar555-form"><label>Titel<input name="title" required maxlength="160" placeholder="Konferenz / Call for Papers"/></label><label>Quelle (HTTPS)<input name="source" type="url" required maxlength="700" placeholder="https://veranstalter.org/cfp"/></label><label>Ort<input name="location" maxlength="120"/></label><label>Region<select name="region">${RADAR_REGIONS.map(r=>opt(r,r,'Europa')).join('')}</select></label><label>Thema<select name="topic">${RADAR_TOPICS.map(r=>opt(r,r,'Nachhaltigkeit')).join('')}</select></label><label>Deadline (wenn bestätigt)<input name="deadline" type="date"/></label><label>Notiz<input name="note" maxlength="500" placeholder="Track, Einreichformat, Kontakt ..."/></label><button type="submit" class="primary-btn">Call lokal vormerken</button></form></details>
 <details class="radar555-ignored"><summary>Ausgeblendete Calls (${entries.filter(x=>x.status==='ignorieren').length})</summary>${entries.filter(x=>x.status==='ignorieren').map(x=>`<button type="button" class="secondary-btn" data-action="radar555-restore" data-id="${e(x.id)}">${e(x.title)} wieder anzeigen</button>`).join('')||'<span class="muted-line">Keine.</span>'}</details>
 <p class="radar555-foot">Daten sind im lokalen Tresor gespeichert. Kein automatisches Web-Crawling, keine Garantie über Peer-Review-Qualität, keine Kalenderänderung. Ein Projekt wird erst in der bestehenden Projektvorschau nach deiner Bestätigung übernommen.</p></section>`;
}
