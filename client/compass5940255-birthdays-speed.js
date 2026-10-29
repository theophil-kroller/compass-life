/** Compass .40.25.5 – compact birthday ribbon + GTD diagnostics. */
export function compass5940255BirthdaysSpeed(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.25.5 ${label}: expected 1 anchor, found ${n}`);return s.replace(a,b);};
 return {name:'compass-5940255-birthdays-speed',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:once(source,'Build 0.5.77.59.40.25.4','Build 0.5.77.59.40.25.5','lock'),map:null};
  if(!path.endsWith('/client/src/main.js'))return null;
  let s=once(source,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.4';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.5';",'version');
  s=once(s,'Build 0.5.77.59.40.25.4','Build 0.5.77.59.40.25.5','footer');
  s=once(s,"import {familyEvents,familySuggestions,familyRules,familyPersonPanel,familyTodayPanel,familyTodayObservations,familyAccept,familyAcceptProject,familyChoose} from './family-radar-v5775931.js';",`import {familyEvents,familySuggestions,familyRules,familyPersonPanel,familyTodayPanel,familyTodayObservations,familyAccept,familyAcceptProject,familyChoose} from './family-radar-v5775931.js';\nimport {todayBirthdayHighlights,todayBirthdayPanel} from './today-birthdays-v5775940255.js';\nimport './today-birthdays-v5775940255.css';`,'birthday import');
  s=once(s,"if(tab==='today')content=familyTodayPanel(familyProposals,familyTodayObservations(familyVisible,familyPeople,state,{today:familyNow}))+content;",`if(tab==='today'){\n   const birthdays=todayBirthdayHighlights(calendarEvents,e=>eventAppearance(e),familyPeople,familyNow);\n   content=todayBirthdayPanel(birthdays)+familyTodayPanel(familyProposals,familyTodayObservations(familyVisible,familyPeople,state,{today:familyNow}))+content;\n  }`,'today birthday ribbon');
  s=once(s,' let html;\n try{html=',` const screenMeasurement=performanceTrace.start();\n let html;\n try{html=`,'view timing start');
  s=once(s,` app.innerHTML=html;bind();if(tab==='today'&&state){ctx42BindHover();ctx39ScheduleAuto();}void mountPremiumAnatomy(app).catch(err=>console.warn('Compass Anatomiekarte konnte nicht geladen werden:',err));editDraftGuard.afterRender(editDraftFocus);`,` performanceTrace.end('Ansicht berechnen',tab,screenMeasurement);\n const domMeasurement=performanceTrace.start();\n app.innerHTML=html;bind();if(tab==='today'&&state){ctx42BindHover();ctx39ScheduleAuto();}void mountPremiumAnatomy(app).catch(err=>console.warn('Compass Anatomiekarte konnte nicht geladen werden:',err));\n performanceTrace.end('DOM + Events',tab,domMeasurement);\n editDraftGuard.afterRender(editDraftFocus);`,'DOM timing');
  return {code:s,map:null};
 }};
}
