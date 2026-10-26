/** Compass 0.5.77.59.40.1 – navigation/inspector hotfix on successful .40. */
export function compass59401NavigationRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error('Compass .40.1 '+label+': expected one anchor, saw '+n);return s.replace(a,b);};
 return {name:'compass-59401-navigation',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.40','Build 0.5.77.59.40.1','badge');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.1';","app version");
  s=once(s,"import {deadlineIntelligence}","import './compass59401-navigation-fixes.css';\nimport {deadlineIntelligence}","CSS");
  s=once(s,"function chrome(content){","let familyRadarJumpPersonId401=null;\nfunction chrome(content){","radar transient state");
  s=once(s,"  if(tab==='people'){\n   const options=peopleInScope(","  if(tab==='people'&&familyRadarJumpPersonId401){\n   const options=peopleInScope(","family panel opt-in");
  s=once(s,"if(action==='fr31-person'&&state?.people?.[id]){selectedPersonId=id;","if(action==='fr31-person'&&state?.people?.[id]){familyRadarJumpPersonId401=id;selectedPersonId=id;","family explicit entry");
  s=once(s,"if(familySelected){\n    const familySettings=","if(familySelected&&familySelected.id===familyRadarJumpPersonId401){\n    const familySettings=","selected family only");
  s=once(s,"if(target==='today')todayInspectorOpen=false;","if(target==='today')todayInspectorOpen=false;if(target==='people'){familyRadarJumpPersonId401=null;peopleScope=state&&typeof effectiveContext39==='function'&&effectiveContext39(state).kind==='work'?'work':'all';peopleTab='list';peopleShowAll=false;selectedPersonId=null;}if(target==='forecast')forecastInspectorOpen401=false;","normal people entry");
  s=once(s,"tab=id;if(id==='next'||id==='forecast')calmNavGroup='plan';","if(id==='people'){familyRadarJumpPersonId401=null;peopleScope=state&&effectiveContext39(state).kind==='work'?'work':'all';peopleTab='list';peopleShowAll=false;selectedPersonId=null;}if(id==='forecast')forecastInspectorOpen401=false;tab=id;if(id==='next'||id==='forecast')calmNavGroup='plan';","context link people");
  s=once(s,"if(action==='person-select'){contactSaveStatus='';","if(action==='person-select'){familyRadarJumpPersonId401=null;contactSaveStatus='';","contact selection closes radar");
  s=once(s,"if(action==='people-scope720'){if(PEOPLE_SCOPES","if(action==='people-scope720'){familyRadarJumpPersonId401=null;if(PEOPLE_SCOPES","scope manual selection closes radar");
  s=once(s,"familyStudyEventId37=id;tab='forecast';calmNavGroup='plan';","familyStudyEventId37=id;forecastInspectorOpen401=false;tab='forecast';calmNavGroup='plan';","plan jump resets inspector");
  s=once(s,"function forecastScreen(){","let forecastInspectorOpen401=false;\nfunction forecastScreen(){","forecast transient state");
  s=once(s,"<div class=\"forecast-layout\">${calendarRail()}<section class=\"forecast-full work-card\">","<div class=\"forecast-layout ${forecastInspectorOpen401?\"forecast-inspector-open\":\"forecast-inspector-closed\"}\">${calendarRail()}<section class=\"forecast-full work-card\">","forecast grid");
  s=once(s,"<aside class=\"forecast-inspector\">${eventAgendaPanel()}<section class=\"work-card task-inspector\"><div class=\"work-heading\"><span>${ico('checkSquare',18)} Aufgabe bearbeiten</span></div>","<aside class=\"forecast-inspector\">${eventAgendaPanel()}<section class=\"work-card task-inspector\"><div class=\"work-heading\"><span>${ico('checkSquare',18)} Aufgabe bearbeiten</span><button type=\"button\" class=\"forecast-inspector-close\" data-action=\"forecast-inspector-close\" title=\"Aufgabe bearbeiten schließen\" aria-label=\"Aufgabe bearbeiten schließen\">${ico('x',17)}</button></div>","forecast inspector close button");
  s=once(s,"if(action==='task-select'){if(!state?.tasks?.[id])return;selectedTaskId=id;","if(action==='task-select'){if(!state?.tasks?.[id])return;if(tab==='forecast')forecastInspectorOpen401=true;selectedTaskId=id;","task selection opens forecast inspector");
  s=once(s,"async function runAction(action,id,stepId=null,plannerDay=null) {","async function runAction(action,id,stepId=null,plannerDay=null) {\n if(action==='forecast-inspector-close'){forecastInspectorOpen401=false;selectedTaskId=null;render();return;}","close action");
  return {code:s,map:null};
 }};
}
