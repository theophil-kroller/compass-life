/** Apply only after the previously validated .40.18 transform. */
export function compass594019AnnualRelease(){
 const once=(s,oldValue,newValue,label)=>{const count=s.split(oldValue).length-1;if(count!==1)throw Error('Compass .40.19 '+label+' expected one anchor, got '+count);return s.replace(oldValue,newValue);};
 return {name:'compass-594019-annual',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.18','Build 0.5.77.59.40.19','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.18';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.19';",'version');
  s=once(s,'Build 0.5.77.59.40.18','Build 0.5.77.59.40.19','footer');
  s=once(s,"insightTab==='report'?reportSetupView(state,{...lifeReportSettings,now:today})", "insightTab==='report'?annualSetupView(state,{...lifeReportSettings,now:today})", 'report setup');
  s=once(s,'reportWindow.document.write(reportDocument(state,','reportWindow.document.write(annualDocument(state,','report renderer');
  if(!s.includes("from './life-annual-v577594019.js'"))throw Error('Annual module not imported');
  return {code:s,map:null};
 }};
}
