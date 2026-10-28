/** .40.22 premium annual: full original anatomical muscle SVG and audited finance category atlas. */
export function compass594022AnnualPremiumReport(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.22 ${label}: expected exactly one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-594022-annual-premium-report',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.21','Build 0.5.77.59.40.22','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.21';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.22';",'version');
  s=once(s,'Build 0.5.77.59.40.21','Build 0.5.77.59.40.22','footer');
  // The event handler is already async. Open popup from click first, then import
  // the very same detailed geometry package the main strength UI uses.
  s=once(s,"   reportWindow.document.write(annualDocument(state,{...lifeReportSettings,rankedIds:allow?lifeReportSettings.rankedIds:[],now:localDate()}));",
   "   const annualAnatomy=await import('body-muscles').catch(err=>{console.warn('Premium-Anatomie nicht verfügbar:',err);return null;});\n   reportWindow.document.write(annualDocument(state,{...lifeReportSettings,rankedIds:allow?lifeReportSettings.rankedIds:[],now:localDate(),anatomy:annualAnatomy}));",'anatomy import');
  return {code:s,map:null};
 }};
}
