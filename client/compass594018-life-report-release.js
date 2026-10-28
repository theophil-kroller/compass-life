/** Compass 0.5.77.59.40.18 – guarded release gate; no changes to older transform assumptions. */
export function compass594018LifeReportRelease(){
 const once=(s,oldValue,newValue,label)=>{
  const count=s.split(oldValue).length-1;
  if(count!==1)throw Error(`Compass .40.18 ${label}: expected 1 anchor, got ${count}`);
  return s.replace(oldValue,newValue);
 };
 return {name:'compass-594018-life-report',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   return {code:once(source,'Build 0.5.77.59.40.17','Build 0.5.77.59.40.18','lock'),map:null};
  }
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.17';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.18';",'version');
  s=once(s,'Build 0.5.77.59.40.17','Build 0.5.77.59.40.18','footer');
  s=once(s,"const tabDef=insightTab==='intelligence'?", "const tabDef=insightTab==='report'?{label:'Ars Vivendi',subtitle:'Compass Life Report'}:insightTab==='intelligence'?",'report heading');
  s=once(s,"const content=insightTab==='intelligence'?", "const content=insightTab==='report'?reportSetupView(state,{...lifeReportSettings,now:today}):insightTab==='intelligence'?",'report view');
  if(!s.includes("import {reportSetupView,reportDocument,reportEvidence,reportRecommendations,rankEvidenceLocally} from './life-report-v577594018.js';")||!s.includes("if(action==='clp-preview')")||!s.includes("insightTab==='report'?reportSetupView"))throw Error('Compass .40.18: report entrypoint missing');
  return {code:s,map:null};
 }};
}
