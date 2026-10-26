/** .59.33: visible release increment after the tested .32 chain. No UI transform.
 * Contact recovery and Family Today performance are native source modules.
 */
export function compass5933PeopleFamilyBridge(){
 return {name:'compass-5933-people-family-release',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  const version='0.5.77.59.32';
  const display='Build '+version;
  if(source.split(display).length!==2)throw Error('Compass .59.33 previous release badge must be unique');
  let result=source.replace(display,'Build 0.5.77.59.33');
  if(path.endsWith('/client/src/main.js')){
   const anchor="const COMPASS_CLIENT_VERSION='0.5.77.59.32';";
   if(result.split(anchor).length!==2)throw Error('Compass .59.33 previous app version must be unique');
   result=result.replace(anchor,"const COMPASS_CLIENT_VERSION='0.5.77.59.33';");
  }
  return {code:result,map:null};
 }};
}
