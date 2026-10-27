import {validTask} from './tasks.js';
const out=(v,code=200)=>new Response(JSON.stringify(v),{status:code,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const re=/^[0-9a-f-]{36}$/i;
const categories=new Set(['Allgemein','Forschung','Lehre','Pruefungen','Verwaltung','Meeting','Weiterbildung','Familie','Beziehungsdynamiken']);
const statuses=new Set(['active','hold','completed','archived','trash','deleted']);
const kinds=new Set(['folder','project']);
const types=new Set(['parallel','sequential','single']);
const folderIcons=new Set(['folder','book','target','calendar','people','heart','activity','suitcase','bookmark','shield','spark','compass']);
export const projectRow=r=>({id:r.id,title:r.title,outcome:r.outcome,category:r.category,status:r.status,dueDate:r.due_date,reviewIntervalDays:r.review_interval_days??7,reviewedAt:r.reviewed_at||null,kind:r.kind||'project',folderIcon:r.kind==='folder'?(r.folder_icon||'folder'):null,projectType:r.project_type||'parallel',parentId:r.parent_id||null,sortOrder:r.sort_order??0,isTemplate:!!r.is_template,version:r.version,updatedAt:r.updated_at});
export const validProjectPayload=p=>Boolean(p&&re.test(p.id||'')&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=140&&typeof p.outcome==='string'&&p.outcome.length<=800&&categories.has(p.category)&&statuses.has(p.status)&&kinds.has(p.kind||'project')&&types.has(p.projectType||'parallel')&&(p.folderIcon==null||p.kind==='folder'&&folderIcons.has(p.folderIcon))&&(p.isTemplate===undefined||typeof p.isTemplate==='boolean')&&(!(p.isTemplate===true)||p.kind==='project')&&(!p.parentId||re.test(p.parentId))&&(p.sortOrder==null||(Number.isSafeInteger(p.sortOrder)&&p.sortOrder>=0&&p.sortOrder<=1000000))&&Number.isSafeInteger(p.reviewIntervalDays??7)&&(p.reviewIntervalDays??7)>=1&&(p.reviewIntervalDays??7)<=90&&(!p.reviewedAt||(typeof p.reviewedAt==='string'&&Number.isFinite(Date.parse(p.reviewedAt))))&&
 (p.dueDate==null||/^\d{4}-\d{2}-\d{2}$/.test(p.dueDate)&&Number.isFinite(Date.parse(p.dueDate+'T12:00:00Z'))&&new Date(p.dueDate+'T12:00:00Z').toISOString().slice(0,10)===p.dueDate)&&Number.isSafeInteger(p.baseVersion)&&p.baseVersion>=0);
export async function listProjects(env,owner){const q=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? ORDER BY updated_at DESC LIMIT 300').bind(owner.sub).all();return out({projects:(q.results||[]).map(projectRow)});}
export async function putProject(req,env,owner){
 let p;try{const raw=await req.text();if(raw.length>3000)return out({error:'payload-too-large'},413);p=JSON.parse(raw);}catch{return out({error:'invalid-json'},400);}
 if(!validProjectPayload(p))return out({error:'invalid-project'},400);
 if(p.parentId){let parentId=p.parentId,seen=new Set([p.id]);for(let i=0;i<100&&parentId;i++){if(seen.has(parentId))return out({error:'project-parent-cycle'},400);seen.add(parentId);const parent=await env.DB.prepare('SELECT id,parent_id FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,parentId).first();if(!parent)return out({error:'invalid-project-parent'},400);parentId=parent.parent_id;if(i===99)return out({error:'project-parent-too-deep'},400);}}
 let row=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,p.id).first();
 if(row?.status==='deleted')return out({error:'project-permanently-deleted'},410);
 if(p.status==='deleted'){
  if(!row||row.status!=='trash')return out({error:'project-not-in-trash'},400);
  const children=await env.DB.prepare("SELECT COUNT(*) AS n FROM planning_projects WHERE owner_sub=? AND parent_id=? AND status!='deleted'").bind(owner.sub,p.id).first();
  const tasks=await env.DB.prepare('SELECT COUNT(*) AS n FROM planning_tasks WHERE owner_sub=? AND project_id=?').bind(owner.sub,p.id).first();
  if((children?.n||0)>0||(tasks?.n||0)>0)return out({error:'project-not-empty'},409);
  if(p.title!=='Entferntes Projekt'||p.outcome!==''||p.dueDate!==null||p.parentId!==null)return out({error:'project-delete-redaction-required'},400);
 }
 if((!row&&p.baseVersion!==0)||(row&&row.version!==p.baseVersion))return out({error:'project-conflict',remote:row?projectRow(row):null},409);
 const now=new Date().toISOString();
 try{
  if(row){const result=await env.DB.prepare('UPDATE planning_projects SET title=?,outcome=?,category=?,status=?,due_date=?,review_interval_days=?,reviewed_at=?,kind=?,folder_icon=?,project_type=?,parent_id=?,sort_order=?,is_template=?,version=version+1,updated_at=? WHERE owner_sub=? AND id=? AND version=?')
   .bind(p.title.trim(),p.outcome,p.category,p.status,p.dueDate||null,p.reviewIntervalDays??7,p.reviewedAt||null,p.kind||'project',p.kind==='folder'?(p.folderIcon||'folder'):null,p.projectType||'parallel',p.parentId||null,p.sortOrder??0,p.isTemplate?1:0,now,owner.sub,p.id,p.baseVersion).run();
   if(result.meta?.changes!==1){row=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,p.id).first();return out({error:'project-conflict',remote:row?projectRow(row):null},409);}
  }else await env.DB.prepare('INSERT INTO planning_projects(owner_sub,id,version,title,outcome,category,status,due_date,review_interval_days,reviewed_at,kind,folder_icon,project_type,parent_id,sort_order,is_template,updated_at) VALUES(?,?,1,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(owner.sub,p.id,p.title.trim(),p.outcome,p.category,p.status,p.dueDate||null,p.reviewIntervalDays??7,p.reviewedAt||null,p.kind||'project',p.kind==='folder'?(p.folderIcon||'folder'):null,p.projectType||'parallel',p.parentId||null,p.sortOrder??0,p.isTemplate?1:0,now).run();
 }catch{return out({error:'database-write-failed'},500);}
 row=await env.DB.prepare('SELECT * FROM planning_projects WHERE owner_sub=? AND id=?').bind(owner.sub,p.id).first();return out({ok:true,project:projectRow(row)});
}
