/** Compass 0.5.77.59.31 | Family Radar – read-only projection of Google Calendar.
 * No Calendar write, no implicit GTD mutation and no external network access.
 * Every proposed action requires an explicit choice and remains idempotent.
 */
const clean=s=>String(s||'').normalize('NFKC').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de').replace(/\s+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const day=e=>String(e?.start?.dateTime||e?.start?.date||'').slice(0,10);
const isDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s+'T12:00:00Z'));
const delta=(date,d)=>{const t=Date.parse(`${date}T12:00:00Z`);return Number.isFinite(t)?new Date(t+d*86400000).toISOString().slice(0,10):null;};
const distance=(from,to)=>Math.round((Date.parse(to+'T12:00:00Z')-Date.parse(from+'T12:00:00Z'))/86400000);
const aliasList=person=>{
 const full=clean(person?.name),first=full.split(' ')[0];
 const eligibleFirst=(['nathanael','nathaniel','seraphina'].includes(first) && !['friend','colleague','partner','acquaintance'].includes(person?.relationKind));
 const variants=eligibleFirst? (first==='seraphina'?['seraphina']:['nathanael','nathaniel']):[];
 return [...new Set([person?.name,...String(person?.aliases||'').split(/[,;\n]/),...variants].map(clean).filter(n=>n.length>2))];
};
export const FAMILY_RADAR_HORIZON=30;
export function familyPrefix(event,person){
 if(event?.status==='cancelled'||!event?.id)return null;
 const title=String(event.summary||'').trim();
 const idx=title.indexOf(':');if(idx<=0||idx>60)return null;
 const prefix=clean(title.slice(0,idx));
 if(!aliasList(person).includes(prefix))return null;
 const subject=title.slice(idx+1).trim();return subject||null;
}
export function familyKind(subject){
 const s=clean(subject);
 if(/\b(ferien|herbstferien|weihnachtsferien|osterferien|sommerferien|schulfrei|urlaub|feiertag)\b/.test(s))return 'holiday';
 if(/\b(praktikumsplatz|unterlagen|abgabe|abgeben|spatestens|einreich|deadline|anmeldeschluss|frist)\b/.test(s))return 'deadline';
 if(/\b(projektwoche|berufsorientierung|berufspraktische tage|praktikumstage)\b/.test(s))return 'project';
 if(/(?:schularbeit|prufung|klausur)\b|\b(?:test|sa)\b/.test(s))return 'exam';
 return 'event';
}
export function familyIsReminder(subject){return /\b(in einer woche|eine woche vorher|noch (7|sieben) tage|erinnerung|reminder|vorwarnung)\b/i.test(clean(subject));}
function subjectKey(subject){return clean(subject).replace(/\b(in einer woche|eine woche vorher|noch (7|sieben) tage|erinnerung|reminder|vorwarnung)\b/g,'').replace(/[^a-z\d ]/g,' ').replace(/\s+/g,' ').trim();}
/** Child-specific and opt-in. A calendar name prefix never establishes kinship or age.
 * Bootstrap the two already-confirmed children only; new children need explicit
 * profile classification as Familie + opt-in Child role in this panel.
 * Existing .31 enabled:true without a child role is NOT a trusted declaration.
 */
export function familyRules(state,person){
 const saved=state?.familyRadar?.rules?.[person?.id]||{};
 const name=clean(person?.name);
 const first=name.split(' ')[0];
 const knownChild=['nathanael','nathaniel','seraphina'].includes(first)&&!['friend','colleague','partner','acquaintance'].includes(person?.relationKind);
 const role=saved.role==='child'?'child':saved.role==='information'?'information':saved.role==='off'?'off':knownChild?'child':'off';
 const eligible=role==='child'&&(knownChild||person?.relationKind==='family');
 const enabled=eligible&&saved.enabled!==false;
 return {enabled,eligible,role,mathSupport:saved.mathSupport!==false,mathLead:Math.max(1,Math.min(60,Number(saved.mathLead)||14)),deadlineLead:Math.max(1,Math.min(90,Number(saved.deadlineLead)||21)),otherExams:saved.otherExams==='support'?'support':'observe'};
}
/** Groups one-week reminders under the real exam and never invents a second deadline.
 * When the main event isn't in the fetched horizon, orphan reminders stay informational.
 */
export function familyEvents(events,person,{today=new Date().toISOString().slice(0,10),horizon=FAMILY_RADAR_HORIZON,includeHidden=()=>true}={}){
 if(!person||!isDay(today))return [];
 const until=delta(today,horizon);
 const matched=(Array.isArray(events)?events:[]).filter(e=>e&&isDay(day(e))&&day(e)>=today&&day(e)<=until&&includeHidden(e))
  .map(e=>({id:e.id,personId:person.id,personName:person.name,day:day(e),title:familyPrefix(e,person),event:e}))
  .filter(x=>x.title).map(x=>({...x,kind:familyKind(x.title),reminder:familyIsReminder(x.title),subject:subjectKey(x.title),linkedReminders:[]}))
  .sort((a,b)=>a.day.localeCompare(b.day)||a.id.localeCompare(b.id));
 const primary=matched.filter(x=>!x.reminder),reminders=matched.filter(x=>x.reminder);
 for(const r of reminders){
  const matching=primary.filter(x=>x.kind===r.kind&&x.subject===r.subject&&distance(r.day,x.day)>=0&&distance(r.day,x.day)<=10).sort((a,b)=>Math.abs(distance(r.day,a.day)-7)-Math.abs(distance(r.day,b.day)-7))[0];
  if(matching)matching.linkedReminders.push(r.id);
  else primary.push({...r,kind:'reminder',orphanReminder:true});
 }
 return primary.sort((a,b)=>a.day.localeCompare(b.day)||a.id.localeCompare(b.id));
}
export function familyActionFor(entry,rules,today){
 const until=distance(today,entry.day);if(!Number.isFinite(until)||until<0)return null;
 if(entry.kind==='deadline'&&until<=rules.deadlineLead)return {kind:'organise',lead:rules.deadlineLead,why:'Organisatorische Frist: Vorbereitungszeit und Unterlagen prüfen'};
 const isMath=/(?:\bmathematik\b|\bmathe\b|mathematikschularbeit\b|matheschularbeit\b)/i.test(entry.subject);
 const examLead=isMath?rules.mathLead:14;
 if(entry.kind==='exam'&&(isMath?rules.mathSupport:rules.otherExams==='support')&&until<=examLead){
  return {kind:'learning',lead:examLead,why:'Gemeinsame Lernvorbereitung anbieten'};
 }
 return null;
}
export const familyDecisionKey=(e,kind)=>`${e.personId}::${e.id}::${kind}`;
export function familySuggestions(events,people,state,{today=new Date().toISOString().slice(0,10),horizon=FAMILY_RADAR_HORIZON,includeHidden=()=>true}={}){
 const decisions=state?.familyRadar?.decisions||{};
 const out=[];
 // One linear calendar pass. The former algorithm scanned every event again
 // for every person on each Today render (O(people × events)). Keep it pure:
 // calendar edits and renamed prefixes take effect on the very next render.
 const byPrefix=new Map();
 for(const event of Array.isArray(events)?events:[]){
  if(!event?.id||event.status==='cancelled')continue;
  const name=String(event.summary||'');const sep=name.indexOf(':');
  if(sep<1||sep>60)continue;
  const prefix=clean(name.slice(0,sep));
  if(!byPrefix.has(prefix))byPrefix.set(prefix,[]);
  byPrefix.get(prefix).push(event);
 }
 for(const person of Object.values(people||{})){
  const rules=familyRules(state,person);if(!rules.enabled)continue;
  const candidates=[],seen=new Set();
  for(const alias of aliasList(person))for(const event of byPrefix.get(alias)||[]){
   if(seen.has(event.id))continue;
   seen.add(event.id);candidates.push(event);
  }
  for(const event of familyEvents(candidates,person,{today,horizon,includeHidden})){
   const action=familyActionFor(event,rules,today);if(!action)continue;
   const key=familyDecisionKey(event,action.kind);
   const decision=decisions[key];
   if(decision?.status==='dismissed'||decision?.status==='accepted'||(decision?.status==='snoozed'&&decision.until>today))continue;
   if(Object.values(state?.tasks||{}).some(t=>!t.archived&&t.familyRadarKey===key)||Object.values(state?.projects||{}).some(p=>!p.archived&&p.familyRadarKey===key))continue;
   out.push({...event,action,key,daysLeft:distance(today,event.day)});
  }
 }
 return out.sort((a,b)=>a.daysLeft-b.daysLeft||Number(a.kind!=='deadline')-Number(b.kind!=='deadline')).slice(0,15);
}
const makeTask=(key,title,person,event,uuid,plannedDate=null,dueDate=null)=>({
 id:uuid(),title:title.slice(0,180),note:`Familien-Radar · ${person.name} · Google-Kalender-Ereignis ${event.id} · ${event.day}.\nTermin bleibt im Google Kalender.`,category:'Familie',completed:false,archived:false,workflow:'next',flagged:false,projectId:null,personId:person.id,tags:[clean(String(person.tag||person.name).replace(/^#/,'' )).slice(0,31),'familie'],contextTags:[],plannedDate,dueDate,estimateMinutes:30,familyRadarKey:key,calendarSourceId:event.id,sortOrder:0
});
/** Invoke only after the user explicitly accepts. Mutates only the user's already-unlocked vault state. */
export function familyAccept(state,entry,person,{today,uuid}={}){
 if(!entry||!person||!familyRules(state,person).enabled||!isDay(today)||typeof uuid!=='function')return {created:[],reason:'invalid'};
 const key=entry.key,existing=Object.values(state.tasks||{}).filter(t=>t.familyRadarKey===key),prior=state?.familyRadar?.decisions?.[key];
 if(existing.length||prior?.status==='accepted')return {created:[],reason:'existing'};
 const generated=[];
 if(entry.action.kind==='learning'){
  const leads=[Math.min(10,Math.max(1,entry.daysLeft)),Math.min(4,Math.max(1,entry.daysLeft-1))];
  for(let i=0;i<2;i++){
   const preferred=delta(entry.day,-leads[i]);const plannedDate=preferred<today?today:preferred;
   generated.push(makeTask(key,`Mit ${person.name} für ${entry.title.replace(/\s+in einer woche/ig,'')} lernen · Einheit ${i+1}`,person,entry,uuid,plannedDate,null));
  }
 }else{
  const title=`Mit ${person.name} ${entry.title} vorbereiten`;
  generated.push(makeTask(key,title,person,entry,uuid,today,entry.day));
 }
 state.tasks??={};state.taskPending??={};state.familyRadar??={};state.familyRadar.decisions??={};
 for(const t of generated){state.tasks[t.id]=t;state.taskPending[t.id]=true;}
 state.familyRadar.decisions[key]={status:'accepted',at:today,updatedAt:new Date().toISOString(),taskIds:generated.map(t=>t.id),eventId:entry.id};
 return {created:generated,reason:null};
}
/** Optional explicit project plan for paperwork, never an automatic Calendar mutation. */
export function familyAcceptProject(state,entry,person,{today,uuid}={}){
 if(!entry||entry.action?.kind!=='organise'||!person||!familyRules(state,person).enabled||!isDay(today)||typeof uuid!=='function')return {project:null,tasks:[],reason:'invalid'};
 const key=entry.key;
 if(state?.familyRadar?.decisions?.[key]?.status==='accepted'||Object.values(state?.projects||{}).some(p=>p.familyRadarKey===key)||Object.values(state?.tasks||{}).some(t=>t.familyRadarKey===key))return {project:null,tasks:[],reason:'existing'};
 state.projects??={};state.projectPending??={};state.tasks??={};state.taskPending??={};
 let folder=Object.values(state.projects).find(p=>p?.kind==='folder'&&clean(p.title)==='familie'&&p.status==='active');
 if(!folder){folder={id:uuid(),title:'Familie',outcome:'',category:'Familie',status:'active',kind:'folder',folderIcon:'folder',projectType:'parallel',parentId:null,reviewIntervalDays:7,sortOrder:0,isTemplate:false};state.projects[folder.id]=folder;state.projectPending[folder.id]=true;}
 const project={id:uuid(),title:`${person.name} – ${entry.title}`.slice(0,140),outcome:`Vor dem ${entry.day} gemeinsam vorbereiten und einreichen.`,category:'Familie',status:'active',dueDate:entry.day,reviewIntervalDays:7,reviewedAt:null,kind:'project',folderIcon:null,isTemplate:false,projectType:'parallel',parentId:folder.id,sortOrder:0,calendarSourceId:entry.id,familyRadarKey:key};
 const titles=[`Mit ${person.name} mögliche Betriebe und Voraussetzungen besprechen`,'Betrieb kontaktieren und Praktikumsplatz klären','Praktikumsplatz bestätigen','Unterlagen fristgerecht abgeben'];
 const tasks=titles.map((title,i)=>({...makeTask(key,title,person,entry,uuid,null,i===titles.length-1?entry.day:null),projectId:project.id,estimateMinutes:i===0?30:45,sortOrder:100+i}));
 state.projects[project.id]=project;state.projectPending[project.id]=true;
 if(state.people?.[person.id]){const profile=state.people[person.id];profile.relatedProjectIds=[...new Set([...(profile.relatedProjectIds||[]),project.id])];}
 for(const t of tasks){state.tasks[t.id]=t;state.taskPending[t.id]=true;}
 state.familyRadar??={};state.familyRadar.decisions??={};state.familyRadar.decisions[key]={status:'accepted',at:today,updatedAt:new Date().toISOString(),projectId:project.id,taskIds:tasks.map(t=>t.id),eventId:entry.id};
 return {project,tasks,folder,reason:null};
}
export function familyChoose(state,key,choice,today){
 if(!key||!['dismissed','snoozed'].includes(choice)||!isDay(today))return false;
 state.familyRadar??={};state.familyRadar.decisions??={};
 state.familyRadar.decisions[key]={status:choice,at:today,updatedAt:new Date().toISOString(),...(choice==='snoozed'?{until:delta(today,3)}:{})};return true;
}
const prettyDay=s=>new Date(`${s}T12:00:00Z`).toLocaleDateString('de-AT',{day:'numeric',month:'short'});
export function familyPersonPanel(entries,suggestions,person,rules=familyRules({},person)){
 if(!person)return '';
 const items=entries.slice(0,12),actions=new Map(suggestions.filter(s=>s.personId===person.id).map(s=>[s.id,s]));
 return `<section class="work-card fr31-person" aria-label="Family Radar – bevorstehende Ereignisse"><div class="fr31-head"><strong>◉ Family Radar · ${esc(person.name)}</strong><small>Google Kalender · nächste 30 Tage</small></div>${items.length?items.map(e=>{
  const rec=actions.get(e.id);return `<div class="fr31-row"><span class="fr31-date">${esc(prettyDay(e.day))}</span><div class="fr31-detail"><strong>${esc(e.title)}</strong><small>${esc(({exam:'Schularbeit / Prüfung',deadline:'Organisatorische Frist',project:'Projektwoche',holiday:'Ferien',reminder:'Erinnerung',event:'Termin'})[e.kind])}${e.linkedReminders.length?' · Erinnerung zugeordnet':''}</small>${rec?`<div class="fr31-actions"><span>${esc(rec.action.why)}</span><button type="button" data-action="fr31-accept" data-id="${esc(rec.key)}">${rec.action.kind==='learning'?'2 Lernaufgaben anlegen':'Vorbereitung übernehmen'}</button>${rec.action.kind==='organise'?`<button type="button" data-action="fr31-project" data-id="${esc(rec.key)}">Projektplan anlegen</button>`:''}<button type="button" data-action="fr31-snooze" data-id="${esc(rec.key)}">Später</button><button type="button" data-action="fr31-dismiss" data-id="${esc(rec.key)}">Verwerfen</button></div>`:''}</div></div>`}).join(''):'<p class="fr31-empty">Keine zugeordneten Familienereignisse im nächsten Monat. Kalender und Namenspräfixe prüfen.</p>'}<details class="fr31-rules"><summary>Unterstützungsregeln für ${esc(person.name)}</summary><form id="fr31-settings-form" data-person="${esc(person.id)}"><label>Familienradar-Rolle<select name="role"><option value="off" ${rules.role==='off'?'selected':''}>Nicht für Familienradar verwenden</option><option value="child" ${rules.role==='child'?'selected':''}>Kind – Lern- und Fristunterstützung</option><option value="information" ${rules.role==='information'?'selected':''}>Nur Familie – informativ</option></select></label><label><input name="enabled" type="checkbox" ${rules.enabled?'checked':''}>Lern- und Fristvorschläge aktivieren</label><label><input name="mathSupport" type="checkbox" ${rules.mathSupport?'checked':''}>Mathematik: gemeinsam lernen</label><label>Mathe-Vorlauf <input name="mathLead" type="number" min="1" max="60" value="${rules.mathLead}"> Tage</label><label>Andere Schularbeiten <select name="otherExams"><option value="observe" ${rules.otherExams==='observe'?'selected':''}>Nur beobachten</option><option value="support" ${rules.otherExams==='support'?'selected':''}>Lernunterstützung</option></select></label><label>Organisatorische Fristen <input name="deadlineLead" type="number" min="1" max="90" value="${rules.deadlineLead}"> Tage vorher</label><button type="button" data-action="fr31-rules-save" data-id="${esc(person.id)}">Regeln speichern</button></form></details><small class="fr31-disclaimer">Termine werden nur gelesen. Vorschläge ändern den geteilten Kalender nicht.</small></section>`;
}
/** A next-week exam is relevant to a parent even without a learning action.
 * Read-only; no API calls, no new tasks, and only children explicitly eligible
 * for the Family Radar. Exam reminders fold into the true exam.
 */
export function familyTodayObservations(events,people,state,{today=new Date().toISOString().slice(0,10),leadDays=14}={}){
 if(!isDay(today))return [];
 const relevant=(Array.isArray(events)?events:[]).filter(e=>e?.id&&e.status!=='cancelled'&&
  isDay(day(e))&&distance(today,day(e))>=0&&distance(today,day(e))<=leadDays&&String(e.summary||'').includes(':'));
 const found=[];
 for(const person of Object.values(people||{})){
  if(!familyRules(state,person).enabled)continue;
  for(const row of familyEvents(relevant,person,{today,horizon:leadDays})){
   if(row.kind!=='exam')continue;
   const infoKey=familyDecisionKey(row,'observe');
   const decision=state?.familyRadar?.decisions?.[infoKey];
   if(decision?.status==='dismissed'||(decision?.status==='snoozed'&&decision.until>today))continue;
   found.push({...row,daysLeft:distance(today,row.day),action:null,kind:'exam',key:infoKey});
  }
 }
 // A child-tagged Google event is still worth a non-mutating Today notice
 // when this device has not yet synced the child's People profile. Only the
 // two explicitly known child name prefixes qualify; never infer age or role
 // from arbitrary calendar contacts (e.g. Bettina). Explicit profile rules win.
 const profiles=Object.values(people||{});
 const knownPrefixes={nathanael:'Nathanael',nathaniel:'Nathanael',seraphina:'Seraphina'};
 const already=new Set(found.map(x=>x.id));
 for(const e of relevant){
  if(already.has(e.id))continue;
  const summary=String(e.summary||''),split=summary.indexOf(':');if(split<1||split>60)continue;
  const prefix=clean(summary.slice(0,split)),personName=knownPrefixes[prefix];if(!personName)continue;
  if(profiles.some(p=>aliasList(p).includes(prefix)))continue; // do not override profile opt-outs
  const title=summary.slice(split+1).trim();
  if(familyKind(title)!=='exam'||familyIsReminder(title))continue;
  const daysLeft=distance(today,day(e));
  found.push({id:e.id,personId:null,personName,title,day:day(e),event:e,
   kind:'exam',linkedReminders:[],daysLeft,action:null,key:`calendar::${e.id}::observe`});
 }
 return found.sort((a,b)=>a.daysLeft-b.daysLeft||a.personName.localeCompare(b.personName,'de'));
}
/** At most two tiny notices. Informational exams appear regardless of whether
 * the parent opted into proactive learning tasks. Clicking opens the person.
 */
export function familyTodayPanel(suggestions,observations=[]){
 const combined=new Map();
 for(const s of [...(Array.isArray(suggestions)?suggestions:[]),...(Array.isArray(observations)?observations:[])]){
  if(!s||s.daysLeft<0||s.daysLeft>Math.max(s.action?.lead||14,14))continue;
  const key=String(s.personId)+'::'+String(s.id);
  const previous=combined.get(key);if(!previous||(s.action&&!previous.action))combined.set(key,s);
 }
 const items=[...combined.values()].sort((a,b)=>a.daysLeft-b.daysLeft||Number(!!b.action)-Number(!!a.action)).slice(0,2);
 if(!items.length)return '';
 return `<section class="fr31-today" aria-label="Wichtige Familienhinweise"><span>◉ Familie</span><div class="fr371-items">${items.map(s=>`<div class="fr371-row"><button type="button" class="fr371-person" data-action="${s.personId?'fr31-person':'agenda-open'}" data-id="${esc(s.personId||s.id)}" aria-label="${esc(s.personName)} – ${s.personId?'Family Radar und Termine anzeigen':'Kalendertermin anzeigen'}"><span class="fr371-orb" aria-hidden="true">🔮</span><span class="fr371-copy"><strong>${esc(s.personName)}</strong>: ${esc(s.title)} <small>in ${s.daysLeft} Tagen · ${s.action?(s.action.kind==='learning'?'Lernvorbereitung':'Organisation')+' empfohlen':'Schularbeit im Blick behalten'}</small></span></button><button type="button" class="fr371-plan" data-action="fr371-plan" data-id="${esc(s.id)}" aria-label="Planen, Kalender und Forecast öffnen" title="In Kalender &amp; Forecast planen"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="m10 16 2 2 4-4"/></svg></button></div>`).join('')}</div></section>`;
}

