/** Compass 0.5.91.9 · Lehr- und Event-Vorbereitungsradar.
 * Pure read-only calendar projection. No network access, no background timers.
 * Creates GTD records only after an explicit user action in an unlocked vault.
 */
const norm=v=>String(v||'').normalize('NFKC').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de').replace(/\s+/g,' ').trim();
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const validDay=d=>DAY.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const addDays=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const daysBetween=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
const eventDay=e=>String(e?.start?.dateTime||e?.start?.date||'').slice(0,10);
/** An exact standalone abbreviation inside ANY parentheses; other staff are allowed.
 * Never match Kroeger, krokodil, descriptions, or matching free text.
 */
export function hasTeachingCodeKro(title){
 const value=String(title||'').normalize('NFKC');
 for(const match of value.matchAll(/\(([^()]*)\)/g)){
  if(match[1].split(/[\s,;/|&+\-]+/u).some(x=>norm(x)==='kro'))return true;
 }
 return false;
}
export function teachingEventType(event){
 if(!event||event.status==='cancelled'||!event.id)return null;
 const title=String(event.summary||'').trim();if(!title)return null;
 if(hasTeachingCodeKro(title))return 'lecture';
 const cleaned=norm(title);
 if(/\bbusiness[ -]?model(?:ling)?[ -]?workshop\b/.test(cleaned))return 'workshop';
 if(/\bfinal[ -]?pitch\b/.test(cleaned))return 'moderation';
 return null;
}
export const TEACHING_RADAR_LEADS=Object.freeze({lecture:21,workshop:21,moderation:35});
const sourceKey=(e,d)=>`${String(e.id)}::${d}`;
const signature=(e,d)=>norm(String(e.summary||'').replace(/\([^()]*\)/g,'')).replace(/[^\p{L}\p{N}]+/gu,'-')+'|'+String(e?.start?.dateTime||e?.start?.date||d);
export function teachingRadarEntries(events,state,{today,horizon=90,limit=18}={}){
 if(!validDay(today))return [];
 const seen=new Set(),result=[];
 for(const event of Array.isArray(events)?events:[]){
  const kind=teachingEventType(event);if(!kind)continue;
  const day=eventDay(event);if(!validDay(day))continue;
  const remaining=daysBetween(today,day),lead=TEACHING_RADAR_LEADS[kind];
  if(remaining<0||remaining>Math.min(horizon,lead))continue;
  const dup=signature(event,day);if(seen.has(dup))continue;seen.add(dup);
  const key=sourceKey(event,day);
  const fingerprint=dup;
  const project=Object.values(state?.projects||{}).find(p=>(p?.teachingRadarKey===key||p?.teachingRadarFingerprint===fingerprint)&&p.status!=='trash'&&p.status!=='deleted')||null;
  const decision=state?.teachingRadar?.decisions?.[key];
  if(decision?.status==='snoozed'&&decision.until>today&&!project)continue;
  const title=String(event.summary||'').trim();
  result.push({key,id:String(event.id),day,daysLeft:remaining,kind,lead,title,fingerprint,projectId:project?.id||null,calendarId:event.calendarId||event.calendar_id||null});
 }
 return result.sort((a,b)=>a.daysLeft-b.daysLeft||a.title.localeCompare(b.title,'de')).slice(0,Math.max(1,Math.min(60,limit)));
}
const projectTasksFor=kind=>kind==='moderation'?[ 
 ['Moderationsablauf, Timings und Übergänge abstimmen',45],
 ['Namen, Teams, Jury und Programm gegenprüfen',30],
 ['Anmoderation und Übergangstexte vorbereiten',60],
 ['Technik, Mikrofon und Ablauf vor Ort prüfen',30]
]:kind==='workshop'?[ 
 ['Lernziele, Agenda und Workshop-Timing prüfen',35],
 ['Business-Model-Methoden und Arbeitsvorlagen vorbereiten',60],
 ['Gruppenübungen und Praxisbeispiele vorbereiten',45],
 ['Material, Raum und Technik final kontrollieren',30]
]:[
 ['Lernziele, Materialien und Ablauf durchsehen',35],
 ['Folien und Fachinhalte aktualisieren',60],
 ['Beispiele und Interaktionen vorbereiten',45],
 ['Unterrichtsunterlagen und Technik kontrollieren',25]
];
export function teachingRadarAccept(state,entry,{today,uuid}={}){
 if(!state||!entry||!validDay(today)||!validDay(entry.day)||entry.day<today||typeof uuid!=='function')return {reason:'invalid',project:null,tasks:[]};
 // Revalidate the identity, never trust an arbitrary caller-supplied suggestion.
 if(!['lecture','workshop','moderation'].includes(entry.kind)||entry.key!==`${entry.id}::${entry.day}`)return {reason:'invalid',project:null,tasks:[]};
 state.projects??={};state.projectPending??={};state.tasks??={};state.taskPending??={};
 const existing=Object.values(state.projects).find(p=>(p.teachingRadarKey===entry.key||p.teachingRadarFingerprint===entry.fingerprint)&&p.status!=='trash'&&p.status!=='deleted');
 if(existing)return {reason:'existing',project:existing,tasks:[]};
 const relevant=norm(entry.title).replace(/\([^()]*\)/g,'').trim().replace(/\s+/g,' ');
 const dateLabel=new Date(entry.day+'T12:00:00Z').toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit'});
 const prefix=entry.kind==='moderation'?'Moderation':entry.kind==='workshop'?'Workshop':'LV';
 const folder=Object.values(state.projects).find(p=>p.kind==='folder'&&p.status==='active'&&norm(p.title)==='lehre')||null;
 const project={id:uuid(),title:`${prefix} vorbereiten: ${relevant} · ${dateLabel}`.slice(0,140),outcome:`${entry.title} am ${entry.day} gut vorbereitet durchführen.`,category:'Lehre',status:'active',dueDate:entry.day,reviewIntervalDays:7,reviewedAt:null,kind:'project',folderIcon:null,isTemplate:false,projectType:'parallel',parentId:folder?.id||null,sortOrder:0,teachingRadarKey:entry.key,teachingRadarFingerprint:entry.fingerprint,calendarSourceId:entry.id,calendarSourceDay:entry.day};
 const lastDay=addDays(entry.day,-1),firstPlan=addDays(entry.day,-14);
 const tasks=projectTasksFor(entry.kind).map(([title,minutes],i)=>({
  id:uuid(),title,note:`Vorbereitungsradar · ${entry.title} · ${entry.day}. Originaltermin bleibt im Google Kalender.`,category:'Lehre',completed:false,archived:false,workflow:'next',flagged:false,projectId:project.id,tags:['lehre','vorbereitung'],contextTags:[],plannedDate:i===0?(firstPlan<today?today:firstPlan):null,dueDate:i===3?(lastDay<today?today:lastDay):null,estimateMinutes:minutes,sortOrder:(i+1)*100,teachingRadarKey:entry.key,calendarSourceId:entry.id
 }));
 state.projects[project.id]=project;state.projectPending[project.id]=true;
 for(const task of tasks){state.tasks[task.id]=task;state.taskPending[task.id]=true;}
 return {reason:null,project,tasks};
}
export function teachingRadarSnooze(state,key,today,days=3){
 if(!state||typeof key!=='string'||!validDay(today)||!Number.isInteger(days)||days<1||days>14)return false;
 state.teachingRadar??={};state.teachingRadar.decisions??={};
 state.teachingRadar.decisions[key]={status:'snoozed',until:addDays(today,days),updatedAt:new Date().toISOString()};return true;
}
export function mergeTeachingRadar(local={},remote={}){
 const a=local?.decisions||{},b=remote?.decisions||{},decisions={...a};
 for(const [key,item] of Object.entries(b))if(!decisions[key]||String(item.updatedAt||'')>String(decisions[key].updatedAt||''))decisions[key]=item;
 return {decisions};
}
export function teachingRadarPanel(entries,{view='today'}={}){
 if(!entries?.length)return '';
 const max=view==='today'?3:12;
 const shown=entries.slice(0,max);
 return `<section class="tr919-radar" aria-label="Lehr- und Event-Vorbereitungsradar"><div class="tr919-head"><strong>🎓 Lehr- & Event-Vorbereitung</strong><small>Google Kalender · ${view==='today'?'demnächst':'Vorschau'}</small></div><div class="tr919-list">${shown.map(e=>`<div class="tr919-row"><div class="tr919-time"><strong>${e.daysLeft===0?'Heute':e.daysLeft===1?'Morgen':`In ${e.daysLeft} Tagen`}</strong><small>${safe(new Date(e.day+'T12:00:00Z').toLocaleDateString('de-AT',{day:'numeric',month:'short'}))}</small></div><div class="tr919-desc"><strong>${safe(e.title)}</strong><small>${safe(({lecture:'Lehre',workshop:'Business Model Workshop',moderation:'Final Pitch · Moderation'})[e.kind])} · Vorbereitung ${e.projectId?'angelegt':'empfohlen'}</small></div><div class="tr919-actions">${e.projectId?`<button type="button" data-action="tr919-project-open" data-id="${safe(e.projectId)}">Projekt öffnen</button>`:`<button type="button" data-action="tr919-create" data-id="${safe(e.key)}">Projekt anlegen</button><button type="button" class="tr919-later" data-action="tr919-snooze" data-id="${safe(e.key)}">Später</button>`}</div></div>`).join('')}</div>${entries.length>shown.length?`<button class="tr919-more" type="button" data-tab="forecast">Weitere ${entries.length-shown.length} Termine im Forecast</button>`:''}<small class="tr919-foot">Kalendertermine werden nur gelesen. Projekt und Aufgaben entstehen erst nach Bestätigung.</small></section>`;
}
