import {guidedSetDay} from './strength-session-days-v059121.js';
/** Compass 0.5.88 – explicit StrongLifts specialization of the existing guided
 * session log. No second workout history; Garmin-compatible IDs retained.
 */
export const STRONGLIFTS88=Object.freeze({
 A:[['squat',5,5],['bench',5,5],['barbell-row',5,5]],
 B:[['squat',5,5],['military-press',5,5],['deadlift',1,5]]
});
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const finite=n=>typeof n==='number'&&Number.isFinite(n);
export function strongliftsSettings88(state){const raw=state?.strengthJournal?.strongliftsSettings88||{};const weights=raw.weights||{},steps=raw.steps||{};
 return {barKg:finite(raw.barKg)&&raw.barKg>=0&&raw.barKg<=50?raw.barKg:20,
  deloadPercent:finite(raw.deloadPercent)&&raw.deloadPercent>=5&&raw.deloadPercent<=30?raw.deloadPercent:10,
  failuresBeforeDeload:[2,3,4,5].includes(raw.failuresBeforeDeload)?raw.failuresBeforeDeload:3,
  restSeconds:[90,120,150,180,240,300].includes(raw.restSeconds)?raw.restSeconds:180,
  weights:Object.fromEntries([...STRONGLIFTS88.A,...STRONGLIFTS88.B].map(([id])=>[id,finite(weights[id])&&weights[id]>=0?weights[id]:null])),
  steps:Object.fromEntries([...STRONGLIFTS88.A,...STRONGLIFTS88.B].map(([id])=>[id,finite(steps[id])&&steps[id]>=.5&&steps[id]<=10?steps[id]:(['squat','deadlift'].includes(id)?2.5:1.25)]))};}
export function saveStrongliftsSettings88(state,raw){const prev=strongliftsSettings88(state);const cfg={...prev,weights:{...prev.weights},steps:{...prev.steps}};
 for(const k of ['barKg','deloadPercent','restSeconds','failuresBeforeDeload']){if(raw[k]===undefined)continue;const value=Number(raw[k]);if(!Number.isFinite(value))throw Error('StrongLifts: ungültiger Parameter '+k);cfg[k]=value;}
 for(const [id] of [...STRONGLIFTS88.A,...STRONGLIFTS88.B]){if(raw.weights?.[id]!==undefined){const n=raw.weights[id]===''?null:Number(raw.weights[id]);if(n!==null&&(!Number.isFinite(n)||n<0||n>350))throw Error('Ungültiges Startgewicht für '+id);cfg.weights[id]=n;}if(raw.steps?.[id]!==undefined){const n=Number(raw.steps[id]);if(!Number.isFinite(n)||n<.5||n>10)throw Error('Ungültiger Gewichtsschritt');cfg.steps[id]=n;}}
 if(cfg.barKg<0||cfg.barKg>50||cfg.deloadPercent<5||cfg.deloadPercent>30||![90,120,150,180,240,300].includes(cfg.restSeconds)||![2,3,4,5].includes(cfg.failuresBeforeDeload))throw Error('StrongLifts-Konfiguration außerhalb der Grenzen.');
 state.strengthJournal??={annotations:[]};state.strengthJournal.strongliftsSettings88={...cfg,updatedAt:new Date().toISOString()};return state.strengthJournal.strongliftsSettings88;
}
/** Only completed, confirmed StrongLifts sessions can advance the A/B rotation. */
export function strongliftsSessions88(state){return (state?.strengthGuidedSessions||[]).filter(s=>s?.completed===true&&(s.mode==='stronglifts'||/StrongLifts 5×5/i.test(s.planTitle||''))).sort((a,b)=>String(a.startedAt).localeCompare(String(b.startedAt)));}
export function strongliftsLastVariant88(state){const sessions=strongliftsSessions88(state);for(const s of sessions.slice().reverse()){const v=s.variant||/Workout (A|B)/.exec(s.planTitle||'')?.[1];if(STRONGLIFTS88[v])return v;}return null;}
export function strongliftsNextVariant88(state){return strongliftsLastVariant88(state)==='A'?'B':'A';}
export function strongliftsExerciseHistory88(state,id){return strongliftsSessions88(state).filter(s=>s.exercises?.some(e=>e.exerciseId===id)).map(s=>{const ex=s.exercises.find(e=>e.exerciseId===id),rows=(ex?.confirmedSets||[]).filter(t=>t.confirmed===true),expected=STRONGLIFTS88.A.concat(STRONGLIFTS88.B).find(x=>x[0]===id)?.[1]||5;
  const work=rows.filter(r=>Number.isInteger(r.reps)&&Number.isFinite(r.weightKg)&&r.weightKg>=0),load=work[0]?.weightKg??null;
  const consistent=load!==null&&work.length>=expected&&work.slice(0,expected).every(r=>r.reps>=5&&Math.abs(r.weightKg-load)<.05);
  return {sessionId:s.id,day:rows.length?guidedSetDay(s,rows.at(-1)):(s.startedAt||'').slice(0,10),kg:load,sets:work.length,completed:consistent,confirmed:rows.length,expected};});}
export function strongliftsProgression88(state,id,{healthAttention=false,pain=false}={}){const cfg=strongliftsSettings88(state),records=strongliftsExerciseHistory88(state,id),last=records.at(-1),initial=cfg.weights[id];
 if(!last||last.kg===null)return {lastKg:null,suggestedKg:initial,action:initial===null?'needs-start':'configured-start',failures:0,message:initial===null?'Bitte ein aktuelles Startgewicht selbst festlegen. Alte Bestleistungen sind keine Startgewichte.':'Manuell konfiguriertes Einstiegsgewicht; Technik und Wohlbefinden prüfen.'};
 let fails=0;for(const x of records.slice().reverse()){if(x.completed)break;fails++;}
 if(healthAttention||pain)return {lastKg:last.kg,suggestedKg:null,action:'safety-hold',failures:fails,message:'Schmerz-/Ermüdungshinweis: keine automatische Laststeigerung. Gegebenenfalls Trainingspause oder medizinische Abklärung.'};
 if(fails>=cfg.failuresBeforeDeload){return {lastKg:last.kg,suggestedKg:null,deloadSuggestionKg:Math.round(last.kg*(1-cfg.deloadPercent/100)*4)/4,action:'deload-proposed',failures:fails,message:`${fails} gescheiterte vergleichbare Einheiten: ${cfg.deloadPercent} % Entlastung nur nach Bestätigung erwägen.`};}
 if(last.completed){const next=last.kg+cfg.steps[id];return {lastKg:last.kg,suggestedKg:Math.round(next*100)/100,action:'increase-proposed',failures:0,message:`5×5 bzw. 1×5 dokumentiert: +${cfg.steps[id]} kg als nächster freiwilliger Versuch.`};}
 return {lastKg:last.kg,suggestedKg:null,action:'repeat-load',failures:fails,message:'Arbeitssätze noch nicht vollständig erreicht: aktuelle Last wiederholen oder Technik/Pausen prüfen.'};}
export function strongliftsWarmups88(weightKg,barKg=20){if(!finite(weightKg)||weightKg<=barKg)return [];
 const steps=[{pct:0,reps:5},{pct:.4,reps:5},{pct:.6,reps:3},{pct:.8,reps:2}],out=[];
 for(const s of steps){const kg=s.pct===0?barKg:Math.max(barKg,Math.floor(weightKg*s.pct/2.5)*2.5);if(kg>=weightKg||out.some(x=>x.kg===kg))continue;out.push({kg,reps:s.reps});}return out;}
/** Symmetric plate calculator. It never claims odd plates can load evenly. */
export function strongliftsPlates88(totalKg,barKg=20,inventory=[25,20,15,10,5,2.5,1.25,.5]){
 if(!finite(totalKg)||!finite(barKg)||totalKg<barKg)return {possible:false,perSide:[],unfilledKg:null};let rem=Math.round((totalKg-barKg)/2*100)/100;const out=[];
 for(const p of inventory){if(!finite(p)||p<=0)continue;const count=Math.floor((rem+1e-8)/p);if(count){out.push({kg:p,count});rem=Math.round((rem-p*count)*100)/100;}}
 return {possible:rem<.01,perSide:out,unfilledKg:rem};}
export function strengthenStrongliftsPlan88(state,plan,{healthAttention=false,pain=false}={}){
 if(plan?.mode!=='stronglifts')return plan;const cfg=strongliftsSettings88(state),variant=strongliftsNextVariant88(state),spec=STRONGLIFTS88[variant];
 const exercises=spec.map(([id,sets,reps],i)=>{const original=plan.exercises.find(e=>e.id===id)||{};const prog=strongliftsProgression88(state,id,{healthAttention,pain});const load=prog.lastKg??cfg.weights[id]??null;
  return {...original,id,title:original.title||id,primary:original.primary||'back',sets,reps:String(reps),restSeconds:id==='deadlift'?Math.max(180,cfg.restSeconds):cfg.restSeconds,lastKg:load,suggestedKg:prog.suggestedKg,progressionAction:prog.action,progressionHint:prog.message,
   warmupSets:load===null?[]:strongliftsWarmups88(load,cfg.barKg),plates:load===null?null:strongliftsPlates88(load,cfg.barKg),reason:prog.message,order:i+1};});
 return {...plan,variant,title:`StrongLifts 5×5 · Workout ${variant}`,exercises,estimatedMinutes:Math.max(45,Math.round(exercises.reduce((n,e)=>n+e.sets*4,20))),recoveryNote:healthAttention||pain?'Ermüdung oder Beschwerden gemeldet: keine Laststeigerung.':plan.recoveryNote};}
export function strongliftsSettingsMarkup88(state){const c=strongliftsSettings88(state);return `<details class="sl88-settings"><summary>⚙ StrongLifts · Startgewichte, Schritte und Scheibenrechner</summary><form id="sl88-settings-form"><div class="sl88-settings-grid"><label>Stangengewicht (kg)<input name="barKg" type="number" min="0" max="50" step=".5" value="${c.barKg}"></label><label>Satzpause (s)<select name="restSeconds">${[90,120,150,180,240,300].map(n=>`<option ${c.restSeconds===n?'selected':''} value="${n}">${n} s</option>`).join('')}</select></label><label>Fehlschläge bis Deload<select name="failuresBeforeDeload">${[2,3,4,5].map(n=>`<option ${c.failuresBeforeDeload===n?'selected':''} value="${n}">${n}</option>`).join('')}</select></label><label>Deload (%)<input name="deloadPercent" type="number" min="5" max="30" step="1" value="${c.deloadPercent}"></label>${[...new Set([...STRONGLIFTS88.A,...STRONGLIFTS88.B].map(x=>x[0]))].map(id=>`<label>${safe(id)} · Start (kg)<input type="number" name="weight:${id}" min="0" max="350" step=".25" value="${c.weights[id]??''}" placeholder="Selbst festlegen"></label><label>${safe(id)} · Schritt (kg)<input type="number" name="step:${id}" min=".5" max="10" step=".25" value="${c.steps[id]}"></label>`).join('')}</div><button type="submit" class="secondary-btn">Einstellungen verschlüsselt speichern</button></form><small>Bei früheren Rücken-/HWS-Beschwerden bitte Last und Technik besonders konservativ wählen. Keine historischen Rekorde als heutiges Startgewicht übernommen.</small></details>`;}

/** Epley estimate; a gym trend proxy, never a measured 1RM or current max. */
export function strongliftsEstimated1RM88(state,id){
 const rows=(state?.strengthGuidedSessions||[]).flatMap(s=>(s.exercises||[]).filter(e=>e.exerciseId===id).flatMap(e=>(e.confirmedSets||[]).filter(x=>x.confirmed===true&&Number.isFinite(x.weightKg)&&Number.isInteger(x.reps)&&x.reps>=1&&x.reps<=10).map(x=>({day:guidedSetDay(s,x),value:Math.round(x.weightKg*(1+x.reps/30)*10)/10}))));
 return rows.sort((a,b)=>a.day.localeCompare(b.day));
}
