const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const stages=['collect','inbox','calendar-past','calendar-future','next','waiting','projects','unassigned','someday','finish'];
const uuid=s=>typeof s==='string'&&/^[0-9a-f-]{36}$/i.test(s);
const date=s=>typeof s==='string'&&Number.isFinite(Date.parse(s));
export function validReviewPayload(d){
 return !!(d&&typeof d==='object'&&!Array.isArray(d)&&uuid(d.id)&&date(d.startedAt)&&date(d.updatedAt)&&(!d.completedAt||date(d.completedAt))&&Number.isInteger(d.step)&&d.step>=0&&d.step<stages.length&&Array.isArray(d.done)&&d.done.length<=stages.length&&d.done.every(x=>stages.includes(x))&&Array.isArray(d.inspectedProjects)&&d.inspectedProjects.length<=500&&d.inspectedProjects.every(uuid)&&typeof d.notes==='string'&&d.notes.length<=1200);
}
export async function readWeeklyReview(env,identity){
 const row=await env.DB.prepare('SELECT progress_json,version,updated_at FROM weekly_review_progress WHERE owner_sub=?').bind(identity.sub).first();
 if(!row)return json({progress:null,version:0});return json({progress:JSON.parse(row.progress_json),version:row.version,updatedAt:row.updated_at});
}
export async function writeWeeklyReview(req,env,identity){
 let body;try{const raw=await req.text();if(raw.length>10000)return json({error:'too-large'},413);body=JSON.parse(raw);}catch{return json({error:'invalid-json'},400);}
 if(!validReviewPayload(body?.progress)||!Number.isSafeInteger(body?.baseVersion)||body.baseVersion<0)return json({error:'invalid-review'},400);
 const now=new Date().toISOString(), data=JSON.stringify(body.progress);
 if(body.baseVersion===0){const done=await env.DB.prepare('INSERT INTO weekly_review_progress (owner_sub,progress_json,version,updated_at) VALUES(?,?,1,?) ON CONFLICT(owner_sub) DO NOTHING').bind(identity.sub,data,now).run();
  if(done.meta?.changes===1)return json({version:1,progress:body.progress});
 }else{
  const done=await env.DB.prepare('UPDATE weekly_review_progress SET progress_json=?,version=version+1,updated_at=? WHERE owner_sub=? AND version=?').bind(data,now,identity.sub,body.baseVersion).run();
  if(done.meta?.changes===1)return json({version:body.baseVersion+1,progress:body.progress});
 }
 const row=await env.DB.prepare('SELECT progress_json,version FROM weekly_review_progress WHERE owner_sub=?').bind(identity.sub).first();
 return json({error:'review-conflict',progress:row?JSON.parse(row.progress_json):null,version:row?.version||0},409);
}
