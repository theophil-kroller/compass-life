// Owner-only task planning bridge; independent from Inbox and Garmin sessions.
const ct={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'};
const out=(obj,code=200)=>new Response(JSON.stringify(obj),{status:code,headers:ct});
const dateRE=/^\d{4}-\d{2}-\d{2}$/;
const isDate=x=>x==null||(typeof x==='string'&&dateRE.test(x)&&Number.isFinite(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x);
const workflows=new Set(['next','waiting','hold']);
const validOrder=x=>x==null||(Number.isSafeInteger(x)&&x>=0&&x<=1000000);
const validEstimate=x=>x==null||(Number.isSafeInteger(x)&&x>=5&&x<=1440);
const validCounter=t=>{
 const current=t.progressCurrent??0,target=t.progressTarget??null;
 return target==null?current===0:Number.isSafeInteger(target)&&target>=1&&target<=100000&&Number.isSafeInteger(current)&&current>=0&&current<=target;
};
const tagOk=t=>Array.isArray(t)&&t.length<=12&&t.every(x=>typeof x==='string'&&x.length>0&&x.length<=32&&/^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u.test(x));
const categories=new Set(['Allgemein','Forschung','Lehre','Pruefungen','Verwaltung','Meeting','Weiterbildung','Familie','Beziehungsdynamiken']);
export function validTask(t){return Boolean(t&&typeof t==='object'&&/^[0-9a-f-]{36}$/i.test(t.id||'')&&
 typeof t.title==='string'&&t.title.trim().length>0&&t.title.length<=180&&
 typeof t.note==='string'&&t.note.length<=3000&&isDate(t.plannedDate)&&isDate(t.dueDate)&&
 categories.has(t.category)&&workflows.has(t.workflow||'next')&&typeof (t.flagged??false)==='boolean'&&(!t.projectId||/^[0-9a-f-]{36}$/i.test(t.projectId))&&tagOk(t.tags??[])&&tagOk(t.contextTags??[])&&isDate(t.deferUntil)&&(!t.parentTaskId||/^[0-9a-f-]{36}$/i.test(t.parentTaskId))&&validOrder(t.sortOrder)&&validEstimate(t.estimateMinutes)&&validCounter(t)&&typeof t.completed==='boolean'&&typeof t.archived==='boolean'&&
 Number.isSafeInteger(t.baseVersion)&&t.baseVersion>=0&&t.baseVersion<=100000000);}
export const taskRow=r=>({id:r.id,title:r.title,note:r.note,plannedDate:r.planned_date,dueDate:r.due_date,category:r.category,completed:!!r.completed,archived:!!r.archived,updatedAt:r.updated_at,version:r.version,workflow:r.workflow||'next',flagged:!!r.flagged,projectId:r.project_id||null,tags:JSON.parse(r.tags_json||'[]'),deferUntil:r.defer_until||null,contextTags:JSON.parse(r.context_tags_json||'[]'),estimateMinutes:r.estimate_minutes??null,parentTaskId:r.parent_task_id||null,sortOrder:r.sort_order??0,progressCurrent:r.progress_current??0,progressTarget:r.progress_target??null});
export async function listTasks(env,owner){const q=await env.DB.prepare('SELECT * FROM planning_tasks WHERE owner_sub=? ORDER BY updated_at DESC LIMIT 600').bind(owner.sub).all();return out({tasks:(q.results||[]).map(taskRow)});}
export async function putTask(req,env,owner){
 let t;try{const raw=await req.text();if(raw.length>5000)return out({error:'payload-too-large'},413);t=JSON.parse(raw);}catch{return out({error:'invalid-json'},400);}
 if(!validTask(t))return out({error:'invalid-task'},400);
 let row=await env.DB.prepare('SELECT * FROM planning_tasks WHERE owner_sub=? AND id=?').bind(owner.sub,t.id).first();
 if(!row && t.baseVersion!==0)return out({error:'task-conflict',remote:null},409);
 if(row && row.version!==t.baseVersion)return out({error:'task-conflict',remote:taskRow(row)},409);
 if(t.parentTaskId){let parentId=t.parentTaskId,seen=new Set([t.id]);for(let i=0;i<100&&parentId;i++){if(seen.has(parentId))return out({error:'task-parent-cycle'},400);seen.add(parentId);const parent=await env.DB.prepare('SELECT id, project_id, parent_task_id FROM planning_tasks WHERE owner_sub=? AND id=?').bind(owner.sub,parentId).first();if(!parent||!t.projectId||parent.project_id!==t.projectId)return out({error:'invalid-task-parent'},400);parentId=parent.parent_task_id;if(i===99)return out({error:'task-parent-too-deep'},400);}}
 const updatedAt=new Date().toISOString();
 const params=[t.title.trim(),t.note,t.plannedDate||null,t.dueDate||null,t.category,t.completed?1:0,t.archived?1:0,t.workflow||'next',t.flagged?1:0,t.projectId||null,JSON.stringify(t.tags||[]),t.deferUntil||null,JSON.stringify(t.contextTags||[]),t.estimateMinutes??null,t.parentTaskId||null,t.sortOrder??0,t.progressCurrent??0,t.progressTarget??null,updatedAt];
 try{
  if(row){const upd=await env.DB.prepare(`UPDATE planning_tasks SET title=?,note=?,planned_date=?,due_date=?,category=?,completed=?,archived=?,workflow=?,flagged=?,project_id=?,tags_json=?,defer_until=?,context_tags_json=?,estimate_minutes=?,parent_task_id=?,sort_order=?,progress_current=?,progress_target=?,updated_at=?,version=version+1 WHERE owner_sub=? AND id=? AND version=?`)
    .bind(...params,owner.sub,t.id,t.baseVersion).run();
    if(upd.meta?.changes!==1){row=await env.DB.prepare('SELECT * FROM planning_tasks WHERE owner_sub=? AND id=?').bind(owner.sub,t.id).first();return out({error:'task-conflict',remote:row?taskRow(row):null},409);}
  } else {
   await env.DB.prepare(`INSERT INTO planning_tasks(owner_sub,id,version,title,note,planned_date,due_date,category,completed,archived,workflow,flagged,project_id,tags_json,defer_until,context_tags_json,estimate_minutes,parent_task_id,sort_order,progress_current,progress_target,updated_at) VALUES(?,?,1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(owner.sub,t.id,...params).run();
  }
 }catch(ex){return out({error:'database-write-failed'},500);}
 row=await env.DB.prepare('SELECT * FROM planning_tasks WHERE owner_sub=? AND id=?').bind(owner.sub,t.id).first();
 return out({ok:true,task:taskRow(row)});
}
export async function listWatchPlanning(req,env,ownerSub){
 const day=new URL(req.url).searchParams.get('day');if(!isDate(day)||day==null)return out({error:'invalid-day'},400);
 const until=new Date(day+'T12:00:00Z');until.setUTCDate(until.getUTCDate()+60);const max=until.toISOString().slice(0,10);
 const q=await env.DB.prepare(`SELECT id,title,planned_date,due_date,category,completed
   FROM planning_tasks WHERE owner_sub=? AND archived=0 AND completed=0 AND
   (planned_date=? OR (due_date IS NOT NULL AND due_date<=?))
   ORDER BY CASE WHEN due_date IS NOT NULL AND due_date<? THEN 0 ELSE 1 END, due_date ASC, planned_date ASC, title ASC LIMIT 40`)
   .bind(ownerSub,day,max,day).all();
 const tasks=(q.results||[]).map(r=>({id:r.id,title:r.title.slice(0,80),plannedDate:r.planned_date,dueDate:r.due_date,category:r.category}));
 return out({date:day,generatedAt:new Date().toISOString(),today:tasks.filter(t=>t.plannedDate===day||t.dueDate===day||t.dueDate&&t.dueDate<day).slice(0,12),deadlines:tasks.filter(t=>t.dueDate&&t.dueDate<=max).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)).slice(0,15)});
}
