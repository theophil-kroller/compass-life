/** Compass .59.37.1 – tiny navigational fix. No calendar reads or vault changes. */
export function compass59371FamilyShortcutsRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .37.1 ${label}: expected one anchor, saw ${n}`);return s.replace(a,b);};
 return {name:'compass-59371-family-shortcuts',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.37','Build 0.5.77.59.37.1','build label');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.37';","const COMPASS_CLIENT_VERSION='0.5.77.59.37.1';",'app version');
  s=once(s,'async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='fr371-plan'){
  // Existing Today projection already owns the event. Do not fetch Calendar or create a task.
  if(!state||!calendarEvents.some(e=>e.id===id&&e.status!=='cancelled'))return;
  familyStudyEventId37=id;tab='forecast';calmNavGroup='plan';
  render();
  requestAnimationFrame(()=>app.querySelector('.fr37-forecast')?.scrollIntoView({block:'start',behavior:'smooth'}));
  return;
 }`,'Forecast action');
  return {code:s,map:null};
 }};
}
