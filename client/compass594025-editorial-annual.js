/** Release .40.25 – Ars Vivendi Editorial Rebuild. */
export function compass594025EditorialAnnual(){
 const once=(source,oldText,newText,name)=>{const count=source.split(oldText).length-1;if(count!==1)throw Error(`Compass .40.25 ${name}: expected 1 anchor, found ${count}`);return source.replace(oldText,newText);};
 return {name:'compass-594025-editorial-annual',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.24','Build 0.5.77.59.40.25','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.24';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25';",'version');
  s=once(s,'Build 0.5.77.59.40.24','Build 0.5.77.59.40.25','footer');
  return {code:s,map:null};
 }};
}
