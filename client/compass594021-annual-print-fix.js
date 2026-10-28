/** .40.21: static printable charts and day-aggregated stress; safe version-only release transform. */
export function compass594021AnnualPrintFix(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.21 ${label}: expected exactly one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-594021-annual-print-fix',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.20','Build 0.5.77.59.40.21','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.20';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.21';",'version');
  s=once(s,'Build 0.5.77.59.40.20','Build 0.5.77.59.40.21','footer');
  if(!s.includes('reportWindow.document.write(annualDocument(state,'))throw Error('Compass .40.21: annual renderer disconnected');
  return {code:s,map:null};
 }};
}
