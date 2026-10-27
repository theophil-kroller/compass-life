/** Compass .59.40.7 — plateau review and actual rest timing.
 * Guarded late Vite transform, preserving all earlier content intact.
 */
export function compass59407PlateauRelease(){
 const one=(s,a,b,what)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.7 ${what}: ${n} anchors`);return s.replace(a,b);};
 return {name:'compass-59407-plateau',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];let s=source;
  if(path.endsWith('/client/src/main.js')||path.endsWith('/client/src/ars-vivendi-lock-v5775922.js')){
   s=one(s,'Build 0.5.77.59.40.6','Build 0.5.77.59.40.7','badge');
   if(path.endsWith('/client/src/main.js'))s=one(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.6';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.7';",'version');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-coach-v5775910.js')){
   s=one(s,"import {coach34Feedback", "import {coachPlateauView47,coachPlateauRestPlan47} from './strength-plateau-v57759407.js';\nimport './strength-plateau-v57759407.css';\nimport {coach34Feedback", 'coach import');
   s=one(s,'  const plan=planNextWorkout(state,{...prefs,today});','  const plan=coachPlateauRestPlan47(state,planNextWorkout(state,{...prefs,today}),today);','next-plan pause experiment');
   s=one(s,"  ${unfinished?`<section class=\"str405-resume\"", "  ${coachPlateauView47(state,plan,today)}\n  ${unfinished?`<section class=\"str405-resume\"",'plateau panel');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-guided-v5775920.js')){
   s=one(s," let snapshot=resumeSession?structuredClone(resumeSession):makeGuidedSnapshot(plan),before=document.activeElement,saveChain=Promise.resolve(),saveStatus='saved',saveSerial=0;",
    " let snapshot=resumeSession?structuredClone(resumeSession):makeGuidedSnapshot(plan),before=document.activeElement,saveChain=Promise.resolve(),saveStatus='saved',saveSerial=0;\n snapshot.pendingSetStarts47??={};",'set start persistence');
   s=one(s,'const total=Math.max(180,seconds);','const total=Math.max(30,Number(seconds)||180);','respect prescribed rest');
   {const from="restSeconds>90?'Phase 1 / 2':'Phase 2 / 2'";if(s.split(from).length-1!==2)throw Error('Compass .40.7 rest phase markers');s=s.split(from).join("restSeconds>0?'Pausentimer':'Pause beendet'");}
   s=one(s,'<small>90 + 90s · Vibration bei 1:30</small>',"<small>Geplant: ${curr.restSeconds} s · +1/+2 min möglich</small>",'rest timer description');
   s=one(s,' function render(){',` function beginSet47(index){
  if(!started||!Number.isInteger(index)||index<1||index>plan.exercises[ex].sets)return;
  const record=snapshot.exercises[ex];if(record.confirmedSets.some(s=>s.confirmed&&s.setNumber===index))return;
  const key=ex+':'+index;
  snapshot.pendingSetStarts47[key]=new Date().toISOString();stopRest();
  void persist().catch(console.warn);render();
 }
 function render(){`,'start actual set');
   s=one(s,"</p>\n   ${resting?","</p>\n   ${started&&done>0&&!allDone?`<div class=\"str407-exact-rest\"><span>${snapshot.pendingSetStarts47[ex+':'+(done+1)]?'Satzbeginn erfasst ✓':'Pause exakt erfassen (optional)'}</span><button type=\"button\" data-act=\"begin-set\" data-set=\"${done+1}\">▶ Satz ${done+1} beginnen</button></div>`:''}\n   ${resting?",'start button');
   s=one(s,'<button type="button" data-act="skip-rest">Überspringen</button></div>',
    '<button type="button" data-act="extend-rest" data-extra="60">+1 min</button><button type="button" data-act="extend-rest" data-extra="120">+2 min</button><button type="button" data-act="skip-rest">Überspringen</button></div>','extend rest controls');

   s=one(s,"  el.querySelector('[data-act=\"close\"]').onclick=()=>close();",`  el.querySelector('[data-act="begin-set"]')?.addEventListener('click',ev=>beginSet47(Number(ev.currentTarget.dataset.set)));
  el.querySelector('[data-act="close"]').onclick=()=>close();`,'button handler');
   s=one(s,"  el.querySelector('[data-act=\"begin-set\"]')?.addEventListener('click',ev=>beginSet47(Number(ev.currentTarget.dataset.set)));","  el.querySelector('[data-act=\"begin-set\"]')?.addEventListener('click',ev=>beginSet47(Number(ev.currentTarget.dataset.set)));\n  el.querySelectorAll('[data-act=\"extend-rest\"]').forEach(button=>button.addEventListener('click',()=>{const add=Number(button.dataset.extra);if(!resting||![60,120].includes(add))return;const remain=Math.max(0,Math.ceil((restUntil-performance.now())/1000));setRest(remain+add);void persist().catch(console.warn);render();}));",'bind extend rest');
   s=one(s,'      sets.push({confirmed:true,setNumber:index,reps:timeBased(ex)?null:proposedReps(ex,index),weightKg:plateKg,completedAt:new Date().toISOString()});',`      const marker=snapshot.pendingSetStarts47[ex+':'+index]||null;
      const previous=sets.filter(s=>s.confirmed&&s.setNumber<index).sort((a,b)=>b.setNumber-a.setNumber)[0];
      const from=Date.parse(previous?.completedAt||''),to=Date.parse(marker||'');
      const observed=Number.isFinite(from)&&Number.isFinite(to)&&to>=from&&to-from<=3600000?Math.round((to-from)/1000):null;
      sets.push({confirmed:true,setNumber:index,reps:timeBased(ex)?null:proposedReps(ex,index),weightKg:plateKg,completedAt:new Date().toISOString(),
       ...(marker?{setStartedAt:marker}:{}),...(observed!==null?{restActualSeconds:observed}:{})});
      delete snapshot.pendingSetStarts47[ex+':'+index];`,'timestamp capture');
   return {code:s,map:null};
  }
  return null;
 }};
}
