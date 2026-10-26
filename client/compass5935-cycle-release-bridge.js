/** .59.35 display-only plugin. Native Family & Coach functionality is in modules. */
export function compass5935CycleReleaseBridge(){
 return {name:'compass-5935-cycle-release',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  const old='Build 0.5.77.59.34';
  if(source.split(old).length!==2)throw Error('Compass .59.35 requires one .34 version badge');
  let s=source.replace(old,'Build 0.5.77.59.35');
  if(path.endsWith('/client/src/main.js')){
   const anchor="const COMPASS_CLIENT_VERSION='0.5.77.59.34';";
   if(s.split(anchor).length!==2)throw Error('Compass .59.35 previous app version missing');
   s=s.replace(anchor,"const COMPASS_CLIENT_VERSION='0.5.77.59.35';");
  }
  return {code:s,map:null};
 }};
}
