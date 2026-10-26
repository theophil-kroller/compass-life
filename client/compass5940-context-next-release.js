/** Compass 0.5.77.59.40 – guarded integration after .39. No legacy rewrites. */
export function compass5940ContextNextRelease(){
 const once=(s,a,b,label)=>{const hits=s.split(a).length-1;if(hits!==1)throw Error('Compass .40 '+label+': expected one anchor, got '+hits);return s.replace(a,b);};
 return {name:'compass-5940-context-next-release',enforce:'pre',transform(source,id){
  const p=id.replace(/\\/g,'/').split('?')[0];
  if(!p.endsWith('/client/src/main.js')&&!p.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.39','Build 0.5.77.59.40','badge');
  if(p.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.39';","const COMPASS_CLIENT_VERSION='0.5.77.59.40';",'app version');
  s=once(s,"import {deadlineIntelligence}","import {contextNextPanel40,dismissTask40,MINUTES40,ENERGY40} from './context-next-v5775940.js';\nimport './context-next-v5775940.css';\nimport {deadlineIntelligence}",'imports');
  s=once(s,'function todayWork(locked=false){','let ctx40Expanded=false;\nfunction todayWork(locked=false){','lazy state');
  const before='return `${locationContextPanel39(state,nextActions(state))}<div class="today-layout premium751-today">';
  const after='return `${locationContextPanel39(state,nextActions(state))}${ctx40Expanded&&selectedDay===localDate()?contextNextPanel40(state,{day:selectedDay,context:effectiveContext39(state).kind}):""}<div class="today-layout premium751-today">';
  s=once(s,before,after,'Today panel');
  s=once(s,'async function runAction(action,id,stepId=null,plannerDay=null) {',`async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='ctx40-toggle'){ctx40Expanded=!ctx40Expanded;if(ctx40Expanded&&selectedDay!==localDate())selectedDay=localDate();render();return;}
 if(action==='ctx40-minutes'){
  if(!state||!MINUTES40.includes(Number(id)))return;
  await mutate(s=>{s.uiPreferences??={};s.uiPreferences.dailyMinutes=Number(id);});return;
 }
 if(action==='ctx40-energy'){
  if(!state||!ENERGY40.includes(id))return;
  await mutate(s=>{s.uiPreferences??={};s.uiPreferences.dailyEnergy=id;});return;
 }
 if(action==='ctx40-skip'){
  if(!state?.tasks?.[id])return;
  await mutate(s=>{dismissTask40(s,id,localDate());});return;
 }
 if(action==='ctx40-reset'){
  if(!state)return;
  await mutate(s=>{s.contextRecommendations40??={};s.contextRecommendations40.dismissed={};});return;
 }
 if(action==='ctx40-task'){
  if(!state?.tasks?.[id])return;
  selectedTaskId=id;todayInspectorOpen=true;render();
  if(window.matchMedia?.('(max-width:800px)')?.matches)requestAnimationFrame(()=>app.querySelector('.today-focus-inspector')?.scrollIntoView?.({behavior:'smooth',block:'start'}));
  return;
 }
 `,'user actions');
  return {code:s,map:null};
 }};
}
