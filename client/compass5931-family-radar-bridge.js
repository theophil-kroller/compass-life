/** Compass .59.31 – read-only family calendar radar + opt-in GTD integration.
 * Adds at four stable function declarations only; does not rewrite prior plugin output.
 */
export const RELEASE_5931='0.5.77.59.31';
export function compass5931FamilyRadarBridge(){
 const once=(s,anchor,replacement,label)=>{const n=s.split(anchor).length-1;if(n!==1)throw Error(`Compass .59.31 ${label}: ${n} integration anchors; expected 1`);return s.replace(anchor,replacement);};
 return {name:'compass-family-radar-5931',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.30','Build 0.5.77.59.31','lockscreen build number'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=source;
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.30';","const COMPASS_CLIENT_VERSION='0.5.77.59.31';",'build number');
  s=once(s,'Build 0.5.77.59.30','Build 0.5.77.59.31','visible build number');
  s=once(s,"import {deadlineIntelligence}",`import {familyEvents,familySuggestions,familyRules,familyPersonPanel,familyTodayPanel,familyTodayObservations,familyAccept,familyAcceptProject,familyChoose} from './family-radar-v5775931.js';
import './family-radar-v5775931.css';
import {deadlineIntelligence}`,'family radar import');
  s=once(s,'function chrome(content){',`function chrome(content){
 // Family radar reuses the cached Google Calendar and person records. No extra API call.
 if(state&&(tab==='people'||tab==='today')){
  const familyPeople=state.people||{};
  const familyVisible=calendarEvents.filter(e=>e.status!=='cancelled'&&String(e.summary||'').includes(':')&&(!eventAppearance(e).hidden||showHiddenCalendarEvents));
  const familyNow=localDate();
  const familyProposals=familySuggestions(familyVisible,familyPeople,state,{today:familyNow});
  if(tab==='today')content=familyTodayPanel(familyProposals,familyTodayObservations(familyVisible,familyPeople,state,{today:familyNow}))+content;
  if(tab==='people'){
   const options=peopleInScope(Object.values(familyPeople),peopleScope);
   const familySelected=options.find(p=>p.id===selectedPersonId)||options[0];
   if(familySelected){
    const familySettings=familyRules(state,familySelected);
    if(familySettings.enabled||familySelected.relationKind==='family')content=familyPersonPanel(familySettings.enabled?familyEvents(familyVisible,familySelected,{today:familyNow}):[],familyProposals,familySelected,familySettings)+content;
   }
  }
 }`,'read-only family panels');
  s=once(s,'async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='fr31-person'&&state?.people?.[id]){selectedPersonId=id;peopleTab='list';peopleScope='all';tab='people';calmNavGroup='';render();return;}
 if(action==='fr31-rules-save'){
  const person=state?.people?.[id],form=app.querySelector('#fr31-settings-form');if(!person||!form||form.dataset.person!==id)return;
  const data=new FormData(form),mathLead=Number(data.get('mathLead')),deadlineLead=Number(data.get('deadlineLead'));
  if(!Number.isInteger(mathLead)||mathLead<1||mathLead>60||!Number.isInteger(deadlineLead)||deadlineLead<1||deadlineLead>90)return toast('Bitte gültige Vorlaufzeiten eingeben.',true);
  await mutate(s=>{s.familyRadar??={};s.familyRadar.rules??={};s.familyRadar.rules[id]={role:['child','off','information'].includes(data.get('role'))?data.get('role'):'off',enabled:data.has('enabled')&&data.get('role')==='child',mathSupport:data.has('mathSupport'),mathLead,deadlineLead,otherExams:data.get('otherExams')==='support'?'support':'observe'};});toast('Familiäre Unterstützungsregeln gespeichert.');return;
 }
 if(['fr31-accept','fr31-project','fr31-dismiss','fr31-snooze'].includes(action)){
  if(!state)return;
  const proposals=familySuggestions(calendarEvents.filter(e=>!eventAppearance(e).hidden||showHiddenCalendarEvents),state.people||{},state,{today:localDate()});
  const chosen=proposals.find(x=>x.key===id);if(!chosen)return;
  if(action==='fr31-project'){
   if(chosen.action.kind!=='organise')return;
   const person=state.people[chosen.personId];if(!person)return;
   let created;
   await mutate(s=>{created=familyAcceptProject(s,chosen,person,{today:localDate(),uuid:()=>crypto.randomUUID()});if(created.project&&(!validProject(created.project)||!validProject(created.folder)||created.tasks.some(t=>!validLocalTask(t))))throw Error('Familien-Projektplan ungültig.');});
   toast(created.project?'Familienprojekt und vier Schritte angelegt.':'Projekt existiert bereits.');return;
  }
  if(action==='fr31-accept'){
   const person=state.people[chosen.personId];
   if(!person)return;
   let result;
   await mutate(s=>{result=familyAccept(s,chosen,person,{today:localDate(),uuid:()=>crypto.randomUUID()});if(result.created.some(t=>!validLocalTask(t)))throw Error('Familienaufgabe konnte nicht validiert werden.');});
   toast(result.created.length?(result.created.length===2?'Zwei Lernaufgaben übernommen.':'Vorbereitungsaufgabe übernommen.'):'Aufgabe bereits vorhanden.');return;
  }
  await mutate(s=>familyChoose(s,chosen.key,action==='fr31-dismiss'?'dismissed':'snoozed',localDate()));
  toast(action==='fr31-snooze'?'Familienhinweis für drei Tage zurückgestellt.':'Familienhinweis verworfen.');return;
 }`,'explicit private GTD decisions');
  return {code:s,map:null};
 }};
}
