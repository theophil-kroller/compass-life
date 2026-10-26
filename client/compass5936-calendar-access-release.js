/** .59.36 narrow release increment after .35 – native calendar UX and child aliases are direct modules. */
export function compass5936CalendarAccessRelease(){
 return {name:'compass-5936-calendar-access-release',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  const previous='Build 0.5.77.59.35';
  if(source.split(previous).length!==2)throw Error('Compass .59.36 requires exactly one previous version badge');
  let result=source.replace(previous,'Build 0.5.77.59.36');
  if(path.endsWith('/client/src/main.js')){
   const old="const COMPASS_CLIENT_VERSION='0.5.77.59.35';";
   if(result.split(old).length!==2)throw Error('Compass .59.36 previous app version missing');
   result=result.replace(old,"const COMPASS_CLIENT_VERSION='0.5.77.59.36';");
  }
  return {code:result,map:null};
 }};
}
