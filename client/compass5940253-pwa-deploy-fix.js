/** Release .40.25.3 — Workbox main bundle precache hotfix. */
export function compass5940253PwaDeployFix(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.3 ${label}: expected 1 anchor, found ${n}`);return s.replace(a,b);};
 return {name:'compass-5940253-pwa-deploy-fix',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.2','Build 0.5.77.59.40.25.3','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.2';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.3';",'version');
  s=once(s,'Build 0.5.77.59.40.25.2','Build 0.5.77.59.40.25.3','footer');
  return {code:s,map:null};
 }};
}
