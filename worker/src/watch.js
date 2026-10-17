// Minimal secure Garmin bridge: single owner, short-lived pairing, write-only device credentials.
// Private health/activity data stays behind authenticated owner endpoints.
const categories = new Set(['Forschung','Lehre','Pruefungen','Pruefungskorrektur','Pruefungserstellung','Verwaltung','Meeting','Weiterbildung','Familie','Beziehungsdynamiken']);
const out=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const bytesHex=b=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
export async function hash(value){return bytesHex(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))));}
const nowISO=()=>new Date().toISOString();
export const validWatchSession=s=>Boolean(s && typeof s==='object' && /^w[0-9a-f]{32}$/.test(s.id||'') && categories.has(s.activity) && Number.isSafeInteger(s.startedAt) && s.startedAt>1700000000 && s.startedAt<Date.now()/1000+300 &&
 Number.isSafeInteger(s.durationSec)&&s.durationSec>=1&&s.durationSec<=43200 &&
 Number.isSafeInteger(s.focusSec)&&s.focusSec>=0&&s.focusSec<=s.durationSec &&
 Number.isSafeInteger(s.breakSec)&&s.breakSec>=0&&s.breakSec<=s.durationSec && s.focusSec+s.breakSec<=s.durationSec &&
 Number.isSafeInteger(s.pomodoros)&&s.pomodoros>=0&&s.pomodoros<=100 &&
 (s.bbStart==null||(Number.isInteger(s.bbStart)&&s.bbStart>=0&&s.bbStart<=100)) &&
 (s.bbEnd==null||(Number.isInteger(s.bbEnd)&&s.bbEnd>=0&&s.bbEnd<=100)) &&
 Array.isArray(s.bbSamples)&&s.bbSamples.length<=72 && s.bbSamples.every(p=>Array.isArray(p)&&p.length===2&&Number.isInteger(p[0])&&p[0]>=0&&p[0]<=s.durationSec&&Number.isInteger(p[1])&&p[1]>=0&&p[1]<=100) &&
 Array.isArray(s.hrSamples)&&s.hrSamples.length<=180 && s.hrSamples.every(p=>Array.isArray(p)&&p.length===2&&Number.isInteger(p[0])&&p[0]>=0&&p[0]<=s.durationSec&&Number.isInteger(p[1])&&p[1]>=30&&p[1]<=230));
async function body(req,cap=16000){const raw=await req.text();if(raw.length>cap)throw Error('payload-too-large');return JSON.parse(raw);}

export async function createPair(env,owner){
  const code=String(crypto.getRandomValues(new Uint32Array(1))[0]%100000000).padStart(8,'0');
  const ts=nowISO();const expires=new Date(Date.now()+10*60000).toISOString();
  await env.DB.prepare('DELETE FROM watch_pair_codes WHERE owner_sub=?').bind(owner.sub).run();
  await env.DB.prepare('INSERT INTO watch_pair_codes(code_hash,owner_sub,created_at,expires_at) VALUES(?,?,?,?)')
    .bind(await hash(code),owner.sub,ts,expires).run();
  return out({code,expiresAt:expires,reason:'Code nur auf der Uhr eingeben. Gültig für 10 Minuten.'});
}
async function limitAttempt(req,env){
  const ip=req.headers.get('CF-Connecting-IP')||'unknown';
  const key=await hash('watch-pair:'+ip);const window=Math.floor(Date.now()/600000);
  const entry=await env.DB.prepare('SELECT window_start,attempts FROM watch_pair_attempts WHERE ip_hash=?').bind(key).first();
  if(entry&&entry.window_start===window && entry.attempts>=8)return false;
  if(entry&&entry.window_start===window){await env.DB.prepare('UPDATE watch_pair_attempts SET attempts=attempts+1 WHERE ip_hash=?').bind(key).run();}
  else {await env.DB.prepare('INSERT INTO watch_pair_attempts(ip_hash,window_start,attempts) VALUES(?,?,1) ON CONFLICT(ip_hash) DO UPDATE SET window_start=excluded.window_start,attempts=1').bind(key,window).run();}
  return true;
}
export async function claimPair(req,env){
  if(!(await limitAttempt(req,env)))return out({error:'rate-limited'},429);
  let data;try{data=await body(req,300);}catch{return out({error:'invalid-payload'},400);}
  if(!/^\d{8}$/.test(data?.code||''))return out({error:'invalid-code'},400);
  const codeHash=await hash(data.code);const row=await env.DB.prepare('SELECT owner_sub,expires_at FROM watch_pair_codes WHERE code_hash=?').bind(codeHash).first();
  if(!row||row.expires_at<=nowISO())return out({error:'invalid-or-expired-code'},401);
  const removed=await env.DB.prepare('DELETE FROM watch_pair_codes WHERE code_hash=? AND expires_at>?').bind(codeHash,nowISO()).run();
  if(removed.meta?.changes!==1)return out({error:'already-used'},409);
  const token='cw1_'+bytesHex(crypto.getRandomValues(new Uint8Array(32)));
  await env.DB.prepare('INSERT INTO watch_devices(token_hash,owner_sub,device_label,created_at) VALUES(?,?,?,?)').bind(await hash(token),row.owner_sub,'Garmin fēnix 7S',nowISO()).run();
  return out({token,paired:true});
}
async function getDevice(req,env){
  const token=(req.headers.get('Authorization')||'').replace(/^Bearer /,'');
  if(!/^cw1_[0-9a-f]{64}$/.test(token))return null;
  const tokenHash=await hash(token);
  const d=await env.DB.prepare('SELECT owner_sub,revoked FROM watch_devices WHERE token_hash=?').bind(tokenHash).first();
  return d&&!d.revoked?{sub:d.owner_sub,hash:tokenHash}:null;
}
export async function acceptWatchSession(req,env){
  const d=await getDevice(req,env);if(!d)return out({error:'unauthorized'},401);
  let s;try{s=await body(req,14000);}catch{return out({error:'invalid-payload'},400);}
  if(!validWatchSession(s))return out({error:'invalid-session'},400);
  const result=await env.DB.prepare(`INSERT INTO watch_sessions(owner_sub,session_id,token_hash,activity,started_at,duration_sec,focus_sec,break_sec,pomodoros,hr_samples_json,bb_samples_json,body_battery_start,body_battery_end,received_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(owner_sub,session_id) DO NOTHING`)
    .bind(d.sub,s.id,d.hash,s.activity,s.startedAt,s.durationSec,s.focusSec,s.breakSec,s.pomodoros,JSON.stringify(s.hrSamples),JSON.stringify(s.bbSamples),s.bbStart??null,s.bbEnd??null,nowISO()).run();
  return out({ok:true,duplicate:result.meta?.changes===0});
}
export async function listWatchSessions(env,owner){
  const q=await env.DB.prepare('SELECT session_id,activity,started_at,duration_sec,focus_sec,break_sec,pomodoros,hr_samples_json,bb_samples_json,body_battery_start,body_battery_end FROM watch_sessions WHERE owner_sub=? ORDER BY started_at DESC LIMIT 50').bind(owner.sub).all();
  return out({sessions:(q.results||[]).map(r=>({id:r.session_id,activity:r.activity,startedAt:r.started_at,durationSec:r.duration_sec,focusSec:r.focus_sec,breakSec:r.break_sec,pomodoros:r.pomodoros,hrSamples:JSON.parse(r.hr_samples_json),bbSamples:JSON.parse(r.bb_samples_json),bbStart:r.body_battery_start,bbEnd:r.body_battery_end}))});
}
export async function revokeWatchDevice(req,env,owner){
 let d;try{d=await body(req,1000);}catch{return out({error:'invalid-payload'},400);}
 if(typeof d?.deviceHash!=='string'||!/^([0-9a-f]{64})$/.test(d.deviceHash))return out({error:'invalid-device'},400);
 await env.DB.prepare('UPDATE watch_devices SET revoked=1 WHERE owner_sub=? AND token_hash=?').bind(owner.sub,d.deviceHash).run();
 return out({revoked:true});
}

export async function listWatchDevices(env,owner){
 const q=await env.DB.prepare('SELECT token_hash,device_label,created_at FROM watch_devices WHERE owner_sub=? AND revoked=0 ORDER BY created_at DESC LIMIT 10').bind(owner.sub).all();
 return out({devices:(q.results||[]).map(r=>({deviceHash:r.token_hash,label:r.device_label,createdAt:r.created_at}))});
}
