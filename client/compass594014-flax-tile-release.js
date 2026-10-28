/** Compass .40.14 · reusable flaxseed tile; no one-off yesterday control. */
export function compass594014FlaxTileRelease(){
 const once=(source,original,replacement,description)=>{
  const count=source.split(original).length-1;
  if(count!==1)throw Error(`Compass .40.14 ${description}: ${count} matches`);
  return source.replace(original,replacement);
 };
 return {name:'compass-594014-flax-tile',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))
   return {code:once(source,'Build 0.5.77.59.40.13','Build 0.5.77.59.40.14','lock version'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let code=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.13';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.14';",'client version');
  code=once(code,'Build 0.5.77.59.40.13','Build 0.5.77.59.40.14','footer version');
  return {code,map:null};
 }};
}
