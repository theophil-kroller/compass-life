/** Compass .40.10 — staged permanent delete and version/display bump. */
export function compass594010ProjectSyncRecoveryRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.10 ${label}: expected 1 anchor, found ${n}`);return s.replace(a,b);};
 return {name:'compass-594010-project-sync-recovery',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.9','Build 0.5.77.59.40.10','lock badge'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,'Build 0.5.77.59.40.9','Build 0.5.77.59.40.10','header badge');
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.9';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.10';",'version');
  s=once(s,"import {todayOrdered49,todayMove49,taskLifecycleView49", "import {syncProjectWithTrash410} from './project-sync-recovery-v577594010.js';\nimport {todayOrdered49,todayMove49,taskLifecycleView49",'sync helper import');
  s=once(s,"   const data=await request(config.apiUrl,authToken,'/api/projects',{method:'POST',body:JSON.stringify({...projectPlain(project),baseVersion:state.projectVersions[id]||0})});",`   const payload={...projectPlain(project),baseVersion:state.projectVersions[id]||0};
   const data=await syncProjectWithTrash410(payload,
     (p)=>request(config.apiUrl,authToken,'/api/projects',{method:'POST',body:JSON.stringify(p)}),
     async(version)=>{state.projectVersions[id]=version;await persist();},
     ()=>before===JSON.stringify(projectPlain(state.projects[id])));
   if(data.deferred)continue;`,'staged project deletion');
  return {code:s,map:null};
 }};
}
