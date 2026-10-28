/** Release .40.25.1 – test/deploy repair + solar annual cover. */
export function compass5940251SolarCoverHotfix(){
 const once=(s,a,b,label)=>{const count=s.split(a).length-1;if(count!==1)throw Error(`Compass .40.25.1 ${label}: expected 1 anchor, got ${count}`);return s.replace(a,b);};
 return {name:'compass-5940251-solar-cover-hotfix',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25','Build 0.5.77.59.40.25.1','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.1';",'version');
  s=once(s,'Build 0.5.77.59.40.25','Build 0.5.77.59.40.25.1','footer');
  return {code:s,map:null};
 }};
}
