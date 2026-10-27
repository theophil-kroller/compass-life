/** Compass .59.40.6 — one-click context cycle, version label, existing .40.5 untouched. */
export function compass59406RirContextRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.6 ${label}: expected 1 anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-59406-rir-context',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.40.5','Build 0.5.77.59.40.6','version badge');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.5';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.6';",'client version');
  s=once(s,"import {locationPicker43} from './location-picker-v57759403.js';\nimport './location-picker-v57759403.css';","import {locationCycle46,nextLocationContext46} from './location-cycle-v57759406.js';\nimport './location-cycle-v57759406.css';",'location imports');
  s=once(s,'locationPicker43(state)','locationCycle46(state)','location component');
  s=once(s,'async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='ctx46-cycle'){
  if(!state)return;
  const from=effectiveContext39(state).kind;
  const next=nextLocationContext46(from);
  await mutate(s=>{s.locationContext39??={};s.locationContext39.mode='manual';s.locationContext39.manual=next;});
  return;
 }`,'manual cycle handler');
  return {code:s,map:null};
 }};
}
