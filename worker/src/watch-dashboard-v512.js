// CompassWatch 0.5.12 — owner-scoped, bounded device projection.
// Calendar is NOT fetched from Google here. The unlocked Compass client
// publishes only today's selected fields from its encrypted local archive.
import {hash} from './watch.js';
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const dateOK=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const validHHMM=s=>typeof s==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
// Display substantial real appointments, not generic all-day work placeholders.
const genericWatchSlot=title=>/^(?:work|working|work block|work time|arbeit|arbeitszeit|arbeitsblock|fokus|focus|focus time|fokuszeit|busy|beschäftigt|blocked|blockiert)$/i.test(String(title||'').trim().replace(/\s+/g,' '));
const minuteOf=s=>Number(s.slice(0,2))*60+Number(s.slice(3,5));
export function significantCalendarEvents(rows){
 if(!Array.isArray(rows))return [];
 return rows.filter(x=>x&&typeof x.title==='string'&&x.title.trim()&&!genericWatchSlot(x.title)&&validHHMM(x.start)&&validHHMM(x.end)&&minuteOf(x.end)-minuteOf(x.start)>=60)
  .sort((a,b)=>a.start.localeCompare(b.start))
  .slice(0,24).map((x,i)=>({id:i,title:x.title.trim().slice(0,64),start:x.start,end:x.end}));
}

async function device(req,env){
 const token=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');
 if(!/^cw1_[0-9a-f]{64}$/.test(token))return null;
 const d=await env.DB.prepare('SELECT owner_sub FROM watch_devices WHERE token_hash=? AND revoked=0').bind(await hash(token)).first();
 return d?.owner_sub||null;
}
async function shoppingRows(env,owner){
 // Only tasks in a named shopping folder or one of its direct child projects.
 const q=await env.DB.prepare(`SELECT t.id,t.title,t.completed,t.version FROM planning_tasks t
 JOIN planning_projects p ON p.owner_sub=t.owner_sub AND p.id=t.project_id
 LEFT JOIN planning_projects parent ON parent.owner_sub=p.owner_sub AND parent.id=p.parent_id
 WHERE t.owner_sub=? AND t.archived=0 AND p.status='active' AND
 (lower(p.title) IN ('einkaufsliste','einkaufslisten','shopping list')
  OR (parent.status='active' AND lower(parent.title) IN ('einkaufsliste','einkaufslisten','shopping list')))
 ORDER BY t.completed ASC, t.sort_order ASC, t.title ASC LIMIT 45`).bind(owner).all();
 return (q.results||[]).map(r=>({id:r.id,title:r.title.slice(0,64),checked:!!r.completed,version:r.version}));
}
export async function watchDashboard(req,env){
 const owner=await device(req,env);if(!owner)return reply({error:'unauthorized'},401);
 const url=new URL(req.url),day=url.searchParams.get('day');if(!dateOK(day))return reply({error:'invalid-day'},400);
 const today=(await env.DB.prepare(`SELECT id,title,planned_date,due_date,category FROM planning_tasks WHERE owner_sub=? AND archived=0 AND completed=0 AND workflow='next' AND (planned_date=? OR due_date<=?) ORDER BY sort_order ASC,title ASC LIMIT 12`).bind(owner,day,day).all()).results||[];
 const end=new Date(Date.parse(day+'T12:00:00Z')+10*86400000).toISOString().slice(0,10);
 const due=(await env.DB.prepare(`SELECT id,title,due_date,category FROM planning_tasks WHERE owner_sub=? AND archived=0 AND completed=0 AND due_date>=? AND due_date<? ORDER BY due_date ASC,title ASC LIMIT 16`).bind(owner,day,end).all()).results||[];
 const calendar=await env.DB.prepare('SELECT events_json,updated_at FROM watch_calendar_daily WHERE owner_sub=? AND day=?').bind(owner,day).first();
 let events=[];try{events=JSON.parse(calendar?.events_json||'[]');}catch{}
 return reply({date:day,generatedAt:new Date().toISOString(),calendarUpdatedAt:calendar?.updated_at||null,
  today:today.map(r=>({id:r.id,title:r.title.slice(0,70),plannedDate:r.planned_date,dueDate:r.due_date,category:r.category})),
  deadlines:due.map(r=>({id:r.id,title:r.title.slice(0,70),dueDate:r.due_date,category:r.category})),
  events:significantCalendarEvents(events),shopping:await shoppingRows(env,owner)});
}
export async function watchCalendarPublish(req,env,owner){
 let input;try{let raw=await req.text();if(raw.length>9000)return reply({error:'oversized'},413);input=JSON.parse(raw);}catch{return reply({error:'invalid-json'},400);}
 const day=input?.day,rows=input?.events;
 if(!dateOK(day)||!Array.isArray(rows)||rows.length>24||!rows.every(x=>x&&typeof x.title==='string'&&x.title.length<=64&&validHHMM(x.start)&&validHHMM(x.end)&&x.end>x.start))return reply({error:'invalid-calendar'},400);
 // 2-day TTL; do not retain historical calendar details in D1.
 const updatedAt=new Date().toISOString();
 await env.DB.prepare(`INSERT INTO watch_calendar_daily(owner_sub,day,events_json,updated_at) VALUES(?,?,?,?)
 ON CONFLICT(owner_sub,day) DO UPDATE SET events_json=excluded.events_json,updated_at=excluded.updated_at`).bind(owner.sub,day,JSON.stringify(significantCalendarEvents(rows)),updatedAt).run();
 await env.DB.prepare("DELETE FROM watch_calendar_daily WHERE owner_sub=? AND day<?").bind(owner.sub,new Date(Date.now()-86400000).toISOString().slice(0,10)).run();
 return reply({ok:true,day,count:significantCalendarEvents(rows).length,updatedAt});
}
export async function watchShoppingToggle(req,env){
 const owner=await device(req,env);if(!owner)return reply({error:'unauthorized'},401);
 let input;try{let raw=await req.text();if(raw.length>400)return reply({error:'oversized'},413);input=JSON.parse(raw);}catch{return reply({error:'invalid-json'},400);}
 if(!/^[0-9a-f-]{36}$/i.test(input?.id||'')||!Number.isSafeInteger(input?.version)||input.version<1||typeof input.checked!=='boolean')return reply({error:'invalid-task'},400);
 const rows=await shoppingRows(env,owner);
 const entry=rows.find(t=>t.id===input.id);
 if(!entry)return reply({error:'not-a-shopping-task'},404);
 if(entry.version!==input.version)return reply({error:'task-conflict',remote:entry},409);
 const updatedAt=new Date().toISOString();
 const out=await env.DB.prepare(`UPDATE planning_tasks SET completed=?,version=version+1,updated_at=? WHERE owner_sub=? AND id=? AND version=?`).bind(input.checked?1:0,updatedAt,owner,input.id,input.version).run();
 if(out.meta?.changes!==1)return reply({error:'task-conflict'},409);
 return reply({ok:true,id:input.id,checked:input.checked,version:input.version+1});
}
