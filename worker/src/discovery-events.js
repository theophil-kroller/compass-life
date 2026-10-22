import {eventKey,validEvent} from '../../client/src/event-import.js';
const out=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const asEvent=row=>({key:row.event_key,event:row.event_json?JSON.parse(row.event_json):null,status:row.status,removed:!!row.removed,version:row.version});
export async function listDiscoveryEvents(env,owner){
 const rows=await env.DB.prepare('SELECT event_key,event_json,status,removed,version FROM discovery_events WHERE owner_sub=? ORDER BY updated_at DESC LIMIT 5000').bind(owner.sub).all();
 return out({events:(rows.results||[]).map(asEvent)});
}
function validMutation(x){return Boolean(x&&typeof x.key==='string'&&x.key.length<=260&&typeof x.status==='string'&&['open','saved','hidden'].includes(x.status)&&typeof x.removed==='boolean'&&Number.isSafeInteger(x.baseVersion)&&x.baseVersion>=0&& (x.removed?(x.event===null||x.event===undefined):validEvent(x.event)&&eventKey(x.event)===x.key));}
export async function upsertDiscoveryEvents(req,env,owner){
 let body;try{const raw=await req.text();if(raw.length>110000)return out({error:'payload-too-large'},413);body=JSON.parse(raw);}catch{return out({error:'invalid-json'},400);}
 if(!Array.isArray(body?.events)||body.events.length<1||body.events.length>25||body.events.some(x=>!validMutation(x))||new Set(body.events.map(x=>x.key)).size!==body.events.length)return out({error:'invalid-events'},400);
 const results=[];
 for(const m of body.events){
  const current=await env.DB.prepare('SELECT event_key,event_json,status,removed,version FROM discovery_events WHERE owner_sub=? AND event_key=?').bind(owner.sub,m.key).first();
  const currentEvent=current?asEvent(current):null;
  if(current&&current.version!==m.baseVersion||!current&&m.baseVersion!==0){results.push({key:m.key,status:'conflict',remote:currentEvent});continue;}
  const payload=m.removed?null:JSON.stringify(m.event),now=new Date().toISOString();let result;
  if(current){result=await env.DB.prepare('UPDATE discovery_events SET event_json=?,status=?,removed=?,version=version+1,updated_at=? WHERE owner_sub=? AND event_key=? AND version=?').bind(payload,m.status,Number(m.removed),now,owner.sub,m.key,m.baseVersion).run();}
  else {try{result=await env.DB.prepare('INSERT INTO discovery_events (owner_sub,event_key,event_json,status,removed,version,updated_at) VALUES(?,?,?,?,?,1,?)').bind(owner.sub,m.key,payload,m.status,Number(m.removed),now).run();}catch{result={meta:{changes:0}};}}
  if(result.meta?.changes===1)results.push({key:m.key,status:'applied',version:m.baseVersion+1});
  else{const newer=await env.DB.prepare('SELECT event_key,event_json,status,removed,version FROM discovery_events WHERE owner_sub=? AND event_key=?').bind(owner.sub,m.key).first();results.push({key:m.key,status:'conflict',remote:newer?asEvent(newer):null});}
 }
 return out({results});
}
