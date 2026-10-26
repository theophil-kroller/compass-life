/** Compass .59.34 – release only; feature logic is in native ES modules. */
export function compass5934CoachBridge(){
 return {name:'compass-5934-coach-release',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  const old='Build 0.5.77.59.33';
  if(source.split(old).length!==2)throw Error('Compass .59.34 expected one .33 display badge');
  let s=source.replace(old,'Build 0.5.77.59.34');
  if(path.endsWith('/client/src/main.js')){
   const ver="const COMPASS_CLIENT_VERSION='0.5.77.59.33';";
   if(s.split(ver).length!==2)throw Error('Compass .59.34 previous app version not unique');
   s=s.replace(ver,"const COMPASS_CLIENT_VERSION='0.5.77.59.34';");
  }
  return {code:s,map:null};
 }};
}
