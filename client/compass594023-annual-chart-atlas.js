/** .40.23 Annual Chart Atlas: provenance-driven printable chart catalog.
 * Keeps the premium anatomy renderer and all prior report functionality.
 */
export function compass594023AnnualChartAtlas(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.23 ${label}: expected one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-594023-annual-chart-atlas',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.22','Build 0.5.77.59.40.23','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.22';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.23';",'version');
  s=once(s,'Build 0.5.77.59.40.22','Build 0.5.77.59.40.23','footer');
  return {code:s,map:null};
 }};
}
