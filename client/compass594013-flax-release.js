/** Compass .40.13: flax quick capture, chewed evidence & retroactive logging.
 * Existing date/GPS and watch transforms remain in force. */
export function compass594013FlaxRelease(){
 const once=(source,oldValue,newValue,label)=>{
  const occurrences=source.split(oldValue).length-1;
  if(occurrences!==1)throw Error(`Compass .40.13 ${label}: ${occurrences} matches`);
  return source.replace(oldValue,newValue);
 };
 return {name:'compass-594013-flax-capture',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   return {code:once(source,'Build 0.5.77.59.40.12','Build 0.5.77.59.40.13','lock version'),map:null};
  }
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.12';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.13';",'app version');
  s=once(s,'Build 0.5.77.59.40.12','Build 0.5.77.59.40.13','footer version');
  return {code:s,map:null};
 }};
}
