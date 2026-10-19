import {projectNeedsReview,projectTasks,nextActions,inboxRecords,heldTasks} from './tasks.js';

/** Review state contains only workflow metadata, never a copy of tasks or calendar contents. */
export const REVIEW_STEPS=[
 {id:'collect',title:'Gedanken sammeln',phase:'Kopf frei',help:'Alles Erfassen, was gerade noch im Kopf ist.'},
 {id:'inbox',title:'Inbox klären',phase:'Kopf frei',help:'Jeden Eingang in eine klare Entscheidung verwandeln.'},
 {id:'calendar-past',title:'Vergangenen Kalender prüfen',phase:'System aktuell',help:'Gab es offene Zusagen oder Nachbereitungen?'},
 {id:'calendar-future',title:'Kommenden Kalender prüfen',phase:'System aktuell',help:'Brauchen Termine Vorbereitung oder eine nächste Aktion?'},
 {id:'next',title:'Next Actions prüfen',phase:'System aktuell',help:'Sind die nächsten Schritte wirklich ausführbar?'},
 {id:'waiting',title:'Waiting For & Agendas',phase:'System aktuell',help:'Auf wen oder was wartest du? Sind Gesprächspunkte offen?'},
 {id:'projects',title:'Projekte prüfen',phase:'System aktuell',help:'Alle aktiven Projekte im Blick; fällige gründlich überprüfen.'},
 {id:'unassigned',title:'Einzelaktionen ohne Projekt',phase:'System aktuell',help:'Einzelaktionen sind okay. Mehrstufiges gehört eventuell in ein Projekt.'},
 {id:'someday',title:'Someday & Dreams',phase:'Kreativ werden',help:'Ideen ansehen, ohne sie zur Pflicht zu machen.'},
 {id:'finish',title:'Abschluss',phase:'Vertrauen',help:'Offene Punkte sehen und bewusst abschließen.'}
];
const iso=t=>typeof t==='string'&&!Number.isNaN(Date.parse(t));
export function newReview(now=new Date().toISOString()){
 return {id:crypto.randomUUID(),startedAt:now,updatedAt:now,completedAt:null,step:0,done:[],inspectedProjects:[],notes:''};
}
export function validReview(x){return !!(x&&typeof x==='object'&&/^[\da-f-]{36}$/i.test(x.id||'')&&iso(x.startedAt)&&iso(x.updatedAt)&&(!x.completedAt||iso(x.completedAt))&&Number.isInteger(x.step)&&x.step>=0&&x.step<REVIEW_STEPS.length&&Array.isArray(x.done)&&x.done.length<=REVIEW_STEPS.length&&x.done.every(v=>REVIEW_STEPS.some(s=>s.id===v))&&Array.isArray(x.inspectedProjects)&&x.inspectedProjects.length<=500&&x.inspectedProjects.every(v=>typeof v==='string'&&/^[\da-f-]{36}$/i.test(v))&&typeof x.notes==='string'&&x.notes.length<=1200);}
export function reviewQueue(state,calendarEvents=[],today=new Date().toISOString().slice(0,10)){
 const projects=Object.values(state?.projects||{}).filter(p=>p.kind!=='folder'&&!p.isTemplate&&p.status==='active');
 const due=projects.filter(p=>projectNeedsReview(p,today));
 const unassigned=Object.values(state?.tasks||{}).filter(t=>!t.archived&&!t.completed&&!t.projectId);
 const waiting=heldTasks(state).filter(t=>t.workflow==='waiting');
 const dated=calendarEvents.filter(e=>e&&e.status!=='cancelled'&& (e.start?.date||e.start?.dateTime)).map(e=>({...e,reviewDay:String(e.start?.date||e.start?.dateTime).slice(0,10)}));
 const shift=(n)=>{const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
 return {projects,due,unassigned,waiting,next:nextActions(state,today),inbox:inboxRecords(state),calendarPast:dated.filter(e=>e.reviewDay>=shift(-14)&&e.reviewDay<today).sort((a,b)=>b.reviewDay.localeCompare(a.reviewDay)),calendarFuture:dated.filter(e=>e.reviewDay>=today&&e.reviewDay<=shift(21)).sort((a,b)=>a.reviewDay.localeCompare(b.reviewDay)),dreams:Object.values(state?.records||{}).filter(r=>!r.deleted&&(r.tags||[]).includes('dreams'))};
}
export function projectReviewSummary(project,state,today=new Date().toISOString().slice(0,10)){
 const tasks=projectTasks(state,project.id).filter(t=>!t.completed); const available=nextActions(state,today).filter(t=>t.projectId===project.id);
 return {tasks,available,due:projectNeedsReview(project,today),interval:project.reviewIntervalDays||7};
}
export function nextReviewStep(review,step){const n=Math.min(REVIEW_STEPS.length-1,Math.max(0,step));return {...review,step:n,updatedAt:new Date().toISOString()};}
export function reviewedStep(review,stepId){const done=[...new Set([...review.done,stepId])];return {...review,done,step:Math.min(REVIEW_STEPS.length-1,REVIEW_STEPS.findIndex(s=>s.id===stepId)+1),updatedAt:new Date().toISOString()};}
