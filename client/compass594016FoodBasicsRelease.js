/** Compass 0.5.77.59.40.16 — two reusable food catalog tiles.
 * No one-off buttons, schema change or import migration.
 */
export function compass594016FoodBasicsRelease(){
 const once=(source,oldValue,newValue,label)=>{
  const n=source.split(oldValue).length-1;
  if(n!==1)throw Error(`Compass .40.16 ${label}: expected 1, found ${n}`);
  return source.replace(oldValue,newValue);
 };
 return {name:'compass-594016-food-basics',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))
   return {code:once(source,'Build 0.5.77.59.40.15','Build 0.5.77.59.40.16','lock version'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.15';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.16';",'client version');
  s=once(s,'Build 0.5.77.59.40.15','Build 0.5.77.59.40.16','footer version');
  return {code:s,map:null};
 }};
}
