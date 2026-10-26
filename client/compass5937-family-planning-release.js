/** Compass .59.37: narrowly scoped Family Forecast extension + release marker.
 * Runs after the full legacy chain; no modification to its historical anchors.
 */
export function compass5937FamilyPlanningRelease(){
 const once=(s,needle,replacement,name)=>{const n=s.split(needle).length-1;if(n!==1)throw Error('Compass .37 '+name+' expected one anchor; saw '+n);return s.replace(needle,replacement);};
 return {name:'compass-5937-family-planning-release',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.36','Build 0.5.77.59.37','lock build');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.36';","const COMPASS_CLIENT_VERSION='0.5.77.59.37';",'app version');
  s=once(s,"import {deadlineIntelligence}","import {familyForecastEntries37,familyForecastPanel37,familyStudySlots37,familyCreateStudy37} from './family-planning-v5775937.js';\nimport './family-planning-v5775937.css';\nimport {deadlineIntelligence}",'module import');
  s=once(s,'function chrome(content){',`let familyStudyEventId37='';
function chrome(content){
 if(state&&tab==='forecast'){
  const today=localDate();
  const entries=familyForecastEntries37(calendarEvents,state.people||{},state,{today});
  content=familyForecastPanel37(entries,calendarEvents,state,{selectedId:familyStudyEventId37,coverage:calendarCoverage,updatedAt:calendarUpdatedAt,now:new Date(),today})+content;
 }`,'Forecast panel');
  s=once(s,'async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='fr37-open'){familyStudyEventId37=familyStudyEventId37===id?'':id;render();return;}
 if(action==='fr37-book'){
  const today=localDate(),e=familyForecastEntries37(calendarEvents,state?.people||{},state,{today}).find(x=>x.id===id);
  const person=e&&state.people?.[e.personId];
  if(!person)return toast('Familienzuordnung nicht mehr verfügbar.',true);
  const model=familyStudySlots37(calendarEvents,e,calendarCoverage,calendarUpdatedAt,{now:new Date(),today,familyRadar:state?.familyRadar});
  const slot=model.status==='ready'&&model.slots.find(x=>x.day===plannerDay&&x.start===Number(stepId));
  if(!slot)return toast('Zeitfenster nicht mehr bestätigt. Bitte Kalender aktualisieren.',true);
  let result;
  await mutate(s=>{result=familyCreateStudy37(s,e,person,slot,{today,uuid:()=>crypto.randomUUID()});if(result.created&&!validLocalTask(result.created))throw Error('Lernaufgabe nicht gültig.');});
  toast(result.created?'Lernzeit als Aufgabe vorgemerkt – kein Kalendereintrag angelegt.':'Diese Lernzeit ist bereits vorgemerkt.');return;
 }`,'opt-in actions');
  return {code:s,map:null};
 }};
}
