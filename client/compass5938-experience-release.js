/** Compass .59.38: date navigation + radar perspective, appended after .37.1. */
export function compass5938ExperienceRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error('Compass .38 '+label+' anchor count '+n);return s.replace(a,b);};
 return {name:'compass-5938-family-balance',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.37.1','Build 0.5.77.59.38','badge');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.37.1';","const COMPASS_CLIENT_VERSION='0.5.77.59.38';",'version');
  s=once(s,"import {deadlineIntelligence}","import {balancePerspective38} from './life-balance-perspectives-v5775938.js';\nimport './life-balance-perspectives-v5775938.css';\nimport {deadlineIntelligence}",'imports');
  s=once(s,'function chrome(content){',`let balancePerspectiveChoice38='all';
function chrome(content){`,'state');
  s=once(s,"<h1 class=\"sr-only\">${h(title)}</h1>","<h1 class=\"sr-only\">${h(title)}</h1>${tab==='today'?`<nav class=\"daynav38\" aria-label=\"Tag auswählen\"><button type=\"button\" data-action=\"daynav38\" data-id=\"previous\" title=\"Vorheriger Tag\" aria-label=\"Vorheriger Tag\">‹</button><button type=\"button\" data-action=\"daynav38\" data-id=\"today\" title=\"Zu Heute springen\" aria-label=\"Heute anzeigen\">${h(title)}</button><button type=\"button\" data-action=\"daynav38\" data-id=\"next\" title=\"Nächster Tag\" aria-label=\"Nächster Tag\">›</button></nav>`:''}",'date nav');
  const original="lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays,includeNutrition930:compass55Mode==='extended'}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount,includeNutrition930:compass55Mode==='extended'}),activeAxis:balanceSelectedAxis})";
  s=once(s,original,`(compass55Mode==='extended'?balancePerspective38(state,{today,period:balancePeriod,healthDays,choice:balancePerspectiveChoice38,activeAxis:balanceSelectedAxis,history:balanceHistoryCount}):lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount}),activeAxis:balanceSelectedAxis}))`,'radar render');
  s=once(s,'async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='fr38-routine-save'){
  const person=state?.people?.[id],form=app.querySelector('#fr38-routine-form');
  if(!person||!form||form.dataset.person!==id||!familyRules(state,person).enabled)return;
  const data=new FormData(form),arrivalHour=Number(data.get('arrivalHour')),footballMinutes=Number(data.get('footballMinutes'));
  const weekdays=[...new Set(data.getAll('weekday').map(Number))].filter(n=>Number.isInteger(n)&&n>=0&&n<=6);
  if(![18,19,20,21].includes(arrivalHour)||![0,30,45,60,75].includes(footballMinutes))return toast('Bitte gültigen Abendrhythmus auswählen.',true);
  await mutate(s=>{s.familyRadar??={};s.familyRadar.availability??={};s.familyRadar.availability[id]={arrivalHour,footballMinutes,weekdays,updatedAt:stamp()};});
  toast('Abendrhythmus gespeichert; Anwesenheit bleibt bei unbekannten Tagen offen.');return;
 }
 if(action==='daynav38'){
  if(tab!=='today')return;
  const day=id==='today'?localDate():previousLocalDay(selectedDay);
  const next=id==='next'?new Date(Date.parse(selectedDay+'T12:00:00Z')+86400000).toISOString().slice(0,10):day;
  if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(next))return;
  selectedDay=next;todayInspectorOpen=false;calendarMonth=new Date(next+'T12:00:00');render();return;
 }
 if(action==='balance-view38'){
  if(!['all','health','life'].includes(id))return;
  balancePerspectiveChoice38=id;balanceSelectedAxis=null;render();return;
 }
 if(action==='balance38-select'){balanceSelectedAxis=id||null;render();return;}`,'actions');
  return {code:s,map:null};
 }};
}
