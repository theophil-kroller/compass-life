/** Compass .59.39 – last, guarded Vite transform; all prior releases retained. */
export function compass5939LocationContextRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error('Compass .39 '+label+': expected one anchor, got '+n);return s.replace(a,b);};
 return {name:'compass-5939-location-context',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.38','Build 0.5.77.59.39','lock and release badge');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.38';","const COMPASS_CLIENT_VERSION='0.5.77.59.39';",'app version');
  s=once(s,"import {deadlineIntelligence}","import {locationContextPanel39,locationSettings39,zone39,classifyPosition39,contextTasks39,effectiveContext39} from './location-context-v5775939.js';\nimport './location-context-v5775939.css';\nimport {deadlineIntelligence}",'module import');
  s=once(s,'function todayWork(locked=false){',`function todayWork(locked=false){`,'today anchor check');
  s=once(s,'return `<div class="today-layout premium751-today">','return `${locationContextPanel39(state,nextActions(state))}<div class="today-layout premium751-today">','compact Today panel');
  s=once(s,'async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='ctx39-manual'){
  if(!['home','work','away'].includes(id)||!state)return;
  await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='manual';s.locationContext39.manual=id;});return;
 }
 if(action==='ctx39-auto'){
  if(!state)return;
  const old=locationSettings39(state);
  if(old.mode==='auto'){await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='manual';s.locationContext39.manual=old.manual;});return;}
  if(!Object.keys(old.zones).length)return toast('Bitte zuerst Zuhause oder Arbeit als Ortszone festlegen.',true);
  await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='auto';});
  await ctx39LocateAndSave(null);return;
 }
 if(action==='ctx39-set-zone'){
  if(!state||!['home','work'].includes(id))return;
  const radius=Number(app.querySelector('#ctx39-radius')?.value||300);
  await ctx39LocateAndSave(id,radius);return;
 }
 if(action==='ctx39-clear-zone'){
  if(!state||!['home','work'].includes(id))return;
  await mutate(s=>{s.locationContext39??={};s.locationContext39.zones??={};delete s.locationContext39.zones[id];s.locationContext39.last=null;});return;
 }
 if(action==='ctx39-check'){if(state)await ctx39LocateAndSave(null);return;}
 if(action==='ctx39-task'){
  if(!state?.tasks?.[id])return;tab='next';calmNavGroup='plan';contextFilter='';selectedTaskId=id;render();return;
 }
 if(action==='ctx39-go'){
  if(!['next','people','forecast','insights','inbox'].includes(id))return;
  tab=id;if(id==='next'||id==='forecast')calmNavGroup='plan';
  if(id==='insights'){calmNavGroup='insights';insightTab='habits';}
  if(id==='next')contextFilter='';
  render();return;
 }`,'actions');
  s=once(s, "app.innerHTML=html;bind();void mountPremiumAnatomy(app).catch(err=>console.warn('Compass Anatomiekarte konnte nicht geladen werden:',err));editDraftGuard.afterRender", "app.innerHTML=html;bind();if(tab==='today'&&state)ctx39ScheduleAuto();void mountPremiumAnatomy(app).catch(err=>console.warn('Compass Anatomiekarte konnte nicht geladen werden:',err));editDraftGuard.afterRender",'render hook');
  s=once(s,'let balancePerspectiveChoice38=\'all\';',`let balancePerspectiveChoice38='all';
let ctx39Running=false,ctx39LastAttempt=0;
async function ctx39LocateAndSave(zoneKind=null,radius=300,{silent=false}={}){
 if(!state||ctx39Running)return;
 if(!navigator.geolocation||!window.isSecureContext){if(!silent)toast('Standort benötigt eine sichere HTTPS-Verbindung und Browser-Freigabe.',true);return;}
 ctx39Running=true;ctx39LastAttempt=Date.now();
 try{
  const fix=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(
   p=>resolve({latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy}),reject,
   {enableHighAccuracy:false,maximumAge:60000,timeout:9000}));
  if(!state)return;
  if(zoneKind){
   if(fix.accuracy>radius/2)throw Error('Ort auf ±'+Math.round(fix.accuracy)+' m ungenau. Bitte draußen oder mit genauerem GPS erneut erfassen.');
   const saved=zone39(fix,radius,new Date().toISOString());
   await mutate(s=>{s.locationContext39??={};s.locationContext39.zones??={};s.locationContext39.zones[zoneKind]=saved;});
   if(!silent)toast((zoneKind==='home'?'Zuhause':'Arbeit')+' lokal verschlüsselt als Ortszone gespeichert.');
  }else{
   const result=classifyPosition39(fix,locationSettings39(state).zones);
   await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='auto';s.locationContext39.last={kind:result.kind,reason:result.reason,accuracy:Math.round(fix.accuracy),checkedAt:new Date().toISOString()};});
   if(!silent)toast(result.kind==='unknown'?'Standort nicht eindeutig. Bitte Ortszonen und GPS-Genauigkeit prüfen.':'Kontext auf diesem Gerät erkannt.');
  }
 }catch(ex){if(!silent)toast(ex.code===1?'Standortzugriff nicht erteilt. Du kannst den Kontext manuell wählen.':'Standort: '+(ex.message||'nicht verfügbar'),true);}
 finally{ctx39Running=false;}
}
function ctx39ScheduleAuto(){
 // Render is a pure fast path. Check a permission that was ALREADY granted and
 // never open a permission prompt, keep a GPS watcher or poll in background.
 if(ctx39Running||Date.now()-ctx39LastAttempt<30*60*1000)return;
 const cfg=locationSettings39(state);
 if(cfg.mode!=='auto'||!Object.keys(cfg.zones).length||document.visibilityState==='hidden'||!navigator.permissions?.query)return;
 ctx39LastAttempt=Date.now();
 try{Promise.resolve(navigator.permissions.query({name:'geolocation'})).then(p=>{
  if(p?.state==='granted'&&state&&tab==='today'&&locationSettings39(state).mode==='auto')ctx39LocateAndSave(null,300,{silent:true});
 }).catch(()=>{});}catch{}
}`,'runtime');
  return {code:s,map:null};
 }};
}
