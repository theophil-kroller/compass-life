/** Compass 0.5.77.59.40.8 – audit-friendly N-of-1 plateau strategy diary.
 * Observational comparisons, not causal effects. Never fabricate RIR or measured rests.
 */
import {sessionEvidence47,coachPlateau47,coachFitdaysSegments47} from './strength-plateau-v57759407.js';
const mean=rows=>rows.length?rows.reduce((s,x)=>s+x,0)/rows.length:null;
const median=rows=>{const s=[...rows].filter(Number.isFinite).sort((a,b)=>a-b);return s.length?s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2:null;};
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=s=>String(s||'').slice(0,10);
const stamp=()=>new Date().toISOString();
const addDays=(s,n)=>new Date(Date.parse(day(s)+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const STRATEGIES={
 'longer-rest':'Längere Satzpausen',
 'progress-reps':'Wiederholungen steigern',
 'consider-volume':'Satzvolumen prüfen',
 'variation':'Übungsvariante testen',
 'measure-rest':'Satzpausen dokumentieren',
 'consider-deload':'Entlastung testen'
};
export function coachTrial48(state,exerciseId){
 return (state?.coachTrials48||[]).filter(t=>t.exerciseId===exerciseId&&t.status==='running').at(-1)||null;
}
export function coachTrialStart48(state,{exerciseId,exerciseTitle,strategy,primary='back',today=day(stamp()),goal='vtaper'}={}){
 if(goal!=='vtaper')throw Error('N-of-1-Test derzeit auf V-Taper begrenzt.');
 if(!exerciseId||!STRATEGIES[strategy])throw Error('Unbekannte Übung oder Strategie.');
 if(coachTrial48(state,exerciseId))throw Error('Für diese Übung läuft bereits ein Strategieexperiment.');
 const baseline=sessionEvidence47(state,exerciseId,today).filter(x=>x.day<today).slice(-3);
 if(baseline.length<2)throw Error('Erst zwei vollständige, dokumentierte Trainingstage vor dem Versuch erforderlich.');
 const loads=baseline.map(s=>s.load),known=loads.every(Number.isFinite);
 if(!known||Math.max(...loads)-Math.min(...loads)>.05)throw Error('Baseline benötigt vergleichbare, dokumentierte Gewichte in zwei bis drei Trainings.');
 const existing=state.coachTrials48??=[];
 if(existing.length>=150)throw Error('Maximal 150 Versuche; zuerst ältere Versuche exportieren.');
 const trial={id:crypto.randomUUID(),exerciseId,exerciseTitle:String(exerciseTitle||exerciseId).slice(0,140),primary,
  goal,strategy,status:'running',startedAt:stamp(),startDay:today,deadlineDay:addDays(today,35),
  baseline:{days:baseline.map(s=>s.day),loadKg:median(loads),reps:median(baseline.map(s=>s.reps)),rir:median(baseline.map(s=>s.rir)),restSeconds:median(baseline.map(s=>s.rest)),count:baseline.length},
  note:'Eine Trainingsvariable ändern; Pausen, Last, Satzanzahl und Erholungsumstände dokumentieren.'};
 existing.push(trial);return trial;
}
export function coachTrialEvaluate48(state,trial,today=day(stamp())){
 if(!trial)return null;
 const all=sessionEvidence47(state,trial.exerciseId,today).filter(x=>x.day>=trial.startDay&&x.day<=today&&x.day!==trial.startDay);
 const comparable=all.filter(x=>Number.isFinite(x.load)&&Math.abs(x.load-trial.baseline.loadKg)<=.05);
 const change=median(comparable.map(x=>x.reps));
 const rest=median(comparable.map(x=>x.rest)),rir=median(comparable.map(x=>x.rir));
 const sampleDays=comparable.map(x=>x.day);
 const span=sampleDays.length>1?Math.round((Date.parse(sampleDays.at(-1)+'T12:00:00Z')-Date.parse(sampleDays[0]+'T12:00:00Z'))/864e5):0;
 const enough=comparable.length>=3&&span>=14;
 const restChanged=Number.isFinite(trial.baseline.restSeconds)&&Number.isFinite(rest)?Math.round(rest-trial.baseline.restSeconds):null;
 const deltaRep=change!==null?Number((change-trial.baseline.reps).toFixed(1)):null;
 const confounders=[];
 if(all.length>comparable.length)confounders.push('abweichende Last bei '+(all.length-comparable.length)+' Einheit(en)');
 if(trial.strategy==='longer-rest'&&restChanged===null)confounders.push('Pausen nicht auf beiden Seiten gemessen');
 if(trial.strategy==='longer-rest'&&restChanged!==null&&restChanged<20)confounders.push('Pausenänderung kaum umgesetzt');
 const status=!enough?'collecting':confounders.length?'inconclusive':deltaRep>=1?'improved':deltaRep<0?'declined':'unchanged';
 return {status,allCount:all.length,comparableCount:comparable.length,span,deltaReps:deltaRep,
  baseline:trial.baseline,followup:{reps:change,rir,restSeconds:rest},restChanged,confounders,
  fitdays:coachFitdaysSegments47(state,{today}),
  interpretation:status==='collecting'?`Noch ${Math.max(0,3-comparable.length)} vergleichbare Einheit(en) und mindestens 14 Tage Vergleich benötigt.`:
   status==='improved'?`Bei gleicher Last wurden im Median ${deltaRep} Wiederholungen mehr beobachtet. Mögliche Verbesserung, kein Kausalnachweis.`:
   status==='declined'?`Bei gleicher Last wurden ${Math.abs(deltaRep)} Wiederholungen weniger beobachtet. Ursachen und Erholung prüfen.`:
   status==='unchanged'?'Kein klarer Leistungsunterschied bei gleicher Last. Strategiewechsel prüfen.':
   'Bedingungen sind nicht ausreichend vergleichbar: '+confounders.join('; ')};
}
export function coachTrialFinish48(state,id,today=day(stamp())){
 const trial=(state.coachTrials48||[]).find(x=>x.id===id&&x.status==='running');
 if(!trial)throw Error('Kein laufendes Experiment gefunden.');
 const review=coachTrialEvaluate48(state,trial,today);
 if(review.status==='collecting')throw Error('Noch nicht genügend Vergleichseinheiten.');
 trial.status='finished';trial.finishedAt=stamp();trial.result={status:review.status,deltaReps:review.deltaReps,restChanged:review.restChanged,comparableCount:review.comparableCount,interpretation:review.interpretation};
 return trial;
}
/** Iterative experiment selection: never repeat a failed variable blindly.
 * Poor comparability means measure first, not conclude failure.
 */
export function coachTrialNextStrategy48(state,exerciseId,preferred='measure-rest',healthAttention=false){
 const previous=(state?.coachTrials48||[]).filter(t=>t.exerciseId===exerciseId&&t.status==='finished').at(-1);
 if(!previous)return {strategy:preferred,reason:''};
 if(previous.result?.status==='inconclusive')return {strategy:'measure-rest',reason:'Letzter Versuch war nicht vergleichbar; zunächst Messung standardisieren.'};
 if(previous.result?.status==='improved')return {strategy:preferred,reason:'Letzter Versuch zeigte Fortschritt; Strategie zunächst beibehalten.'};
 if(healthAttention)return {strategy:'consider-deload',reason:'Belastungswarnung: Entlastung erwägen, statt direkt Volumen zu erhöhen.'};
 const order=['longer-rest','progress-reps','consider-volume','variation','consider-deload'];
 const i=order.indexOf(previous.strategy);const next=order[(i+1)%order.length];
 return {strategy:next,reason:`Nach Versuch „${STRATEGIES[previous.strategy]||previous.strategy}“ ohne klaren Fortschritt: andere einzelne Variable prüfen.`};
}
export function coachNof1Panel48(state,plan,today){
 if(plan?.goal!=='vtaper')return '';
 const focus=(plan.exercises||[]).filter(e=>['back','shoulders'].includes(e.primary)).slice(0,6);
 const rows=focus.map(ex=>{
  const active=coachTrial48(state,ex.id),p=coachPlateau47(state,ex.id,{today,primary:ex.primary,healthAttention:plan.health?.attention,
   weeklyKnownSets:plan.history?.usable?plan.history.counts7?.[ex.primary]:null,activeDeload:plan.cycle?.deloadActive});
  if(active){const review=coachTrialEvaluate48(state,active,today);return `<div class="str408-row"><strong>${safe(ex.title)} · ${safe(STRATEGIES[active.strategy])}</strong><small>${safe(review.interpretation)} · ${review.comparableCount} Vergleichseinheiten</small>${review.status!=='collecting'?`<button type="button" data-trial48="finish" data-id="${safe(active.id)}">Versuch auswerten &amp; abschließen</button>`:''}</div>`;}
  if(p.status!=='possible-plateau')return '';
  const suggested=coachTrialNextStrategy48(state,ex.id,STRATEGIES[p.action]?p.action:'measure-rest',plan.health?.attention);
  const strategy=suggested.strategy;
  return `<div class="str408-row"><strong>${safe(ex.title)}</strong><small>${safe(p.reason)} ${safe(suggested.reason)}</small><button type="button" data-trial48="start" data-id="${safe(ex.id)}" data-strategy="${safe(strategy)}" data-title="${safe(ex.title)}" data-primary="${safe(ex.primary)}">Versuch: ${safe(STRATEGIES[strategy])} starten</button></div>`;
 }).filter(Boolean).join('');
 const history=(state.coachTrials48||[]).filter(x=>x.status==='finished').slice(-6).reverse().map(x=>`<div class="str408-row"><strong>${safe(x.exerciseTitle)} · ${safe(STRATEGIES[x.strategy]||x.strategy)}</strong><small>${safe(x.result?.interpretation||'Auswertung fehlt')} · ${safe(day(x.finishedAt))}</small></div>`).join('');
 return `<details class="str408-panel"><summary>◇ N-of-1 · Strategieversuche (${(state.coachTrials48||[]).filter(x=>x.status==='running').length} aktiv)</summary><div class="str408-body">${rows||'<p>Für einen Vergleich fehlen noch mindestens vier Trainingstage über drei Wochen oder es liegt kein Plateau vor.</p>'}${history?`<details><summary>Abgeschlossene Versuche</summary>${history}</details>`:''}<small>Versuche werden im verschlüsselten lokalen Compass-Tresor gespeichert. Vergleich nur unter ähnlichen Bedingungen; Fitdays-BIA ist eine ergänzende, nicht kausale Trendbeobachtung.</small></div></details>`;
}
