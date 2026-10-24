/** Compass 0.5.77.47 — Deadline & Capacity Guardian after Weekly Intelligence.
 * Only local application code; no Worker or data schema migrations.
 * Integration anchors fail closed if the upstream .46 build changed.
 */
export function compass747Bridge(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .47: ${label}: expected one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-747-deadline-capacity-guardian',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;const ch=(a,b,k)=>{s=once(s,a,b,k);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.46';", "const COMPASS_CLIENT_VERSION='0.5.77.47';",'visible version');
  ch("import {weeklyIntelligenceView} from './weekly-intelligence-v57746.js';",
    "import {weeklyIntelligenceView} from './weekly-intelligence-v57746.js';\nimport {capacityGuardianView,capacityGuardianTeaser,saveCapacitySettings} from './capacity-guardian-v57747.js';\nimport './capacity-guardian-v57747.css';",'new imports');
  ch("const tabDef=insightTab==='weekly'?", "const tabDef=insightTab==='capacity'?{label:'Fristen & Kapazität',subtitle:'Aktueller GTD-Stand · bewusst geschätzte Arbeitskapazität'}:insightTab==='weekly'?",'capacity insights header');
  ch("const compactInsights=[['weekly','Wochenkompass','calendar']",
    "const compactInsights=[['capacity','Fristen','target'],['weekly','Wochenkompass','calendar']",'insights navigation');
  ch("const content=insightTab==='weekly'?weeklyIntelligenceView(state,{today:localDate(),offset:weeklyOffset746}):insightTab==='dreamworld'?",
    "const content=insightTab==='capacity'?capacityGuardianView(state,{today:localDate()}):insightTab==='weekly'?weeklyIntelligenceView(state,{today:localDate(),offset:weeklyOffset746})+capacityGuardianTeaser(state,{today:localDate()}):insightTab==='dreamworld'?",'content');
  ch("if(action==='insights-tab'){if(id==='touch'||id==='dreamworld'||id==='weekly'||INSIGHT_TABS.some(t=>t.id===id))",
    "if(action==='insights-tab'){if(id==='touch'||id==='dreamworld'||id==='weekly'||id==='capacity'||INSIGHT_TABS.some(t=>t.id===id))",'top navigation action');
  ch("if(action==='calm-insight-view'){if(id==='dreamworld'||id==='weekly'||INSIGHT_TABS.some(t=>t.id===id)||",
    "if(action==='calm-insight-view'){if(id==='dreamworld'||id==='weekly'||id==='capacity'||INSIGHT_TABS.some(t=>t.id===id)||",'sidebar navigation action');
  const oldLink='<button type="button" class="nav-item ${tab===\'insights\'&&insightTab===\'weekly\'?\'is-active\':\'\'}" data-action="calm-insight-view" data-id="weekly">';
  const newLink='<button type="button" class="nav-item ${tab===\'insights\'&&insightTab===\'capacity\'?\'is-active\':\'\'}" data-action="calm-insight-view" data-id="capacity">${ico(\'target\',19)}<span>Fristen &amp; Kapazität</span></button>\n '+oldLink;
  ch(oldLink,newLink,'sidebar capacity item');
  ch('function bind() {',`function bind() {
 const capacityForm747=app.querySelector('#cap747-form');
 if(capacityForm747)capacityForm747.onsubmit=async ev=>{
  ev.preventDefault();if(!state)return;
  const fd=new FormData(capacityForm747),estimates={};
  for(const [key,value] of fd.entries())if(key.startsWith('estimate:'))estimates[key.slice(9)]=String(value);
  try{
   const focusHours=String(fd.get('focusHours')??'').trim();
   const reservePct=String(fd.get('reservePct')??'20').trim();
   await mutate(st=>saveCapacitySettings(st,{focusHours,reservePct,estimates}),null,true);
   toast('Fokusbudget und Aufwandsschätzungen im lokalen Tresor gespeichert.');
  }catch(ex){toast('Kapazitätsplanung: '+ex.message,true);}
 };`, 'capacity form binding');
  ch("if(action==='weekly746-shift'){",`if(action==='capacity747-open'){
  tab='insights';insightTab='capacity';calmNavGroup='insights';render();return;
 }
 if(action==='weekly746-shift'){`, 'capacity CTA action');
  return {code:s,map:null};
 }};
}
