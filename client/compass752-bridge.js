/** Compass 0.5.77.52 — chart-first health analytics.
 * Surgical, fail-closed Vite transforms after 0.5.77.51. The existing Garmin /
 * Fitdays data, controls, processing, chart calculations and Today UI stay intact.
 */
export function compass752Bridge(){
 const changeOnce=(source,from,to,label)=>{
  const count=source.split(from).length-1;
  if(count!==1)throw Error(`Compass .52: ${label}: expected one anchor, found ${count}`);
  return source.replace(from,to);
 };
 return {name:'compass-752-chart-first',enforce:'pre',transform(source,id){
  const file=id.replace(/\\/g,'/').split('?')[0];
  if(file.endsWith('/client/src/main.js')){
   let output=changeOnce(source,"const COMPASS_CLIENT_VERSION='0.5.77.51';", "const COMPASS_CLIENT_VERSION='0.5.77.52';", 'version');
   output=changeOnce(output,"import './premium-ui-v57751.css';", "import './premium-ui-v57751.css';\nimport './chart-first-v57752.css';", 'chart stylesheet');
   output=changeOnce(output,'<div class="insight-workspace" aria-label="Compass Insights · Personal Analytics">',
    '<div class="insight-workspace cf52-insight cf52-${insightTab}" aria-label="Compass Insights · Personal Analytics">','specific health panel scope');
   return {code:output,map:null};
  }
  if(file.endsWith('/client/src/insights.js')){
   let output=source;
   // For Sleep, the actual analytical figures lead. Put findings and provenance
   // after the sleep analytics; preserve findings as *visible* material.
   const earlier=' ${healthFindingsView(findings,healthAi.order||[],healthAi.status||\'\')}\n ${sleepDataProvenance(model,imported)}\n ${sleep}';
   const latest=' ${sleep}\n ${healthFindingsView(findings,healthAi.order||[],healthAi.status||\'\')}\n <details class="cf52-provenance"><summary>Quellen &amp; Datenqualität</summary>${sleepDataProvenance(model,imported)}</details>';
   output=changeOnce(output,earlier,latest,'sleep charts before prose');
   // HRV, sleep consistency and distribution must never default to hidden.
   output=changeOnce(output,'<details class="sleep550-extra sleep550-extended">',
    '<details class="sleep550-extra sleep550-extended" open>','visible advanced sleep plots');
   return {code:output,map:null};
  }
  return null;
 }};
}
