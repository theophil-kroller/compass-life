import {validTask} from './tasks.js';
const out=(v,code=200)=>new Response(JSON.stringify(v),{status:code,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const re=/^[0-9a-f-]{36}$/i;
const categories=new Set(['Allgemein','Forschung','Lehre','Pruefungen','Verwaltung','Meeting','Weiterbildung','Familie','Beziehungsdynamiken']);
const statuses=new Set(['active','hold','completed']);
export const projectRow=r=>({id:r.id,title:r.title,outcome:r.outcome,category:r.category,status:r.status,dueDate:r.due_date,version:r.version,updatedAt:r.updated_at});
export const validProjectPayload=p=>Boolean(p&&re.test(p.id||'')&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=140&&typeof p.outcome==='string'&&p.outcome.length<=800&&categories.has(p.category)&&statuses.has(p.status)&&
 (p.dueDate==null||/^\d{4}-\d{2}-\d{2}$/.test(p.dueDate)&&Number.isFinite(Date.parse(p.dueDate+'T12:00:00Z'))&&new Date(p.dueDate+'T12:00:00Z').toISOString().slice(0,10)===p.dueDate)&&Number.isSafeInteger(p.baseVersion)&&p.baseVersion>=0);
export async function listProjects(env,owner){const q=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? ORDER BY updated_at DESC LIMIT 300').bind(owner.sub).all();return out({projects:(q.results||[]).map(projectRow)});}
export async function putProject(req,env,owner){
 let p;try{const raw=await req.text();if(raw.length>3000)return out({error:'payload-too-large'},413);p=JSON.parse(raw);}catch{return out({error:'invalid-json'},400);}
 if(!validProjectPayload(p))return out({error:'invalid-project'},400);
 let row=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,p.id).first();
 if((!row&&p.baseVersion!==0)||(row&&row.version!==p.baseVersion))return out({error:'project-conflict',remote:row?projectRow(row):null},409);
 const now=new Date().toISOString();
 try{
  if(row){const result=await env.DB.prepare('UPDATE planning_projects SET title=?,outcome=?,category=?,status=?,due_date=?,version=version+1,updated_at=? WHERE owner_sub=? AND id=? AND version=?')
   .bind(p.title.trim(),p.outcome,p.category,p.status,p.dueDate||null,now,owner.sub,p.id,p.baseVersion).run();
   if(result.meta?.changes!==1){row=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,p.id).first();return out({error:'project-conflict',remote:row?projectRow(row):null},409);}
  }else await env.DB.prepare('INSERT INTO planning_projects(owner_sub,id,version,title,outcome,category,status,due_date,updated_at) VALUES(?,?,1,?,?,?,?,?,?)')
    .bind(owner.sub,p.id,p.title.trim(),p.outcome,p.category,p.status,p.dueDate||null,now).run();
 }catch{row=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,p.id).first();return out({error:'project-conflict',remote:row?projectRow(row):null},409);}
 row=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,p.id).first();return out({ok:true,project:projectRow(row)});
}
