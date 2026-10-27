/** Compass .40.11 – photographed foods, source-aware micros and Greger evidence. */
export function compass594011FoodsRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.11 ${label}: expected 1 anchor, found ${n}`);return s.replace(a,b);};
 return {name:'compass-594011-nutrition-products',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.10','Build 0.5.77.59.40.11','lock badge'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,'Build 0.5.77.59.40.10','Build 0.5.77.59.40.11','header badge');
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.10';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.11';",'version');
  return {code:s,map:null};
 }};
}
