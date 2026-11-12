/** Compass 0.5.91.42 · Active, equipment-aware next-set challenge.
 * Challenges are based on confirmed Coach sets. Proposed weight is never
 * confirmed as a completed set; the athlete can revise the working load.
 */
import {latestCoachRirSession46} from './strength-rir-progress-v57759406.js';
const SMALL = new Set(['dumbbell-lateral-raise','cable-lateral-raise','reverse-fly','dumbbell-front-raise']);
const fmt=n=>Number(n).toLocaleString('de-AT',{maximumFractionDigits:2});
const range=s=>{const m=String(s||'').match(/(\d+)\s*[–-]\s*(\d+)/);return m?{low:Number(m[1]),high:Number(m[2])}:null;};
/**
 * A load *trial* is possible before every set reaches the cap when the last
 * verified session demonstrates a large reserve, but never becomes the default
 * working weight. Otherwise give a concrete rep challenge instead of silence.
 */
export function activeChallenge42({state,exerciseId,today,lastKg,reps,plannedSets=3,equipmentDecision=null,healthAttention=false,deload=false,pain=false,strongLifts=false}={}){
 if(strongLifts)return null; // Preserve StrongLifts' own independent 5x5 loading rules.
 if(healthAttention||deload||pain)return {kind:'recovery',title:'Heute bewusst leichter',detail:'Keine Laststeigerung bei Erholungswarnung, Beschwerden oder Entlastung. Bewege dich nur schmerzfrei.',candidateKg:null};
 const bounds=range(reps);if(!bounds)return null;
 const last=latestCoachRirSession46(state,exerciseId,today);
 if(!last||last.elapsed>28||!Number.isFinite(lastKg)||lastKg<=0)return null;
 const valid=(last.sets||[]).filter(s=>s.confirmed===true&&Number.isInteger(s.reps)&&s.reps>=1&&s.reps<=50&&Number.isFinite(s.weightKg)&&Math.abs(s.weightKg-lastKg)<0.05);
 if(!valid.length)return null;
 const trustworthyRir=valid.filter(s=>Number.isInteger(s.rir)&&s.rir>=0&&s.rir<=4);
 const enough=valid.length>=Math.min(2,plannedSets);
 const easy=enough&&trustworthyRir.length>=Math.min(2,plannedSets)&&trustworthyRir.every(s=>s.rir>=3)&&valid.every(s=>s.reps>=bounds.low);
 const ready=equipmentDecision?.next&&equipmentDecision?.load&&equipmentDecision.action!=='verify-weight';
 const next=ready?equipmentDecision.next.plateKg:null;
 const jump=next&&lastKg>0?(next-lastKg)/lastKg:null;
 const limit=SMALL.has(exerciseId)?0.16:0.20;
 // When subjective RIR is absent, repeated verified top-of-range performance
 // on TWO distinct completed workout days supports a cautious, reversible first-
 // set trial (never silent proof of readiness). Missing RIR alone is not failure.
 const repeatCap=(()=>{
  if(!ready||!enough||!valid.every(s=>s.reps>=bounds.high)||trustworthyRir.some(s=>s.rir<=1))return false;
  const prior=[];
  for(const session of Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[]){
   if(session?.source!=='compass-guided-v5920'||session.deleted||!(session.completed===true||session.finishedAt))continue;
   for(const exercise of session.exercises||[]){
    if(exercise.exerciseId!==exerciseId)continue;
    const sets=(exercise.confirmedSets||[]).filter(s=>s.confirmed===true&&Number.isInteger(s.reps)&&Number.isFinite(s.weightKg)&&Math.abs(s.weightKg-lastKg)<.05&&s.reps>=bounds.high&&(!Number.isInteger(s.rir)||s.rir>=2));
    if(sets.length>=Math.min(2,plannedSets))prior.push({at:String(session.startedAt||''),id:session.id,day:sets[0].completedDay||String(sets[0].completedAt||'').slice(0,10)});
   }
  }
  return new Set(prior.filter(x=>x.day).map(x=>x.day)).size>=2;
 })();
 if((easy||repeatCap)&&Number.isFinite(jump)&&jump>0&&jump<=limit){
  return {kind:'load-trial',title:`Gewichts-Challenge: ${fmt(lastKg)} → ${fmt(next)} kg`,detail:`${easy?'Mindestens zwei Sätze mit RIR ≥3':'Zwei bestätigte Trainingstage am oberen Wiederholungsziel'} sprechen für einen vorsichtigen Versuch. Coach schlägt ${fmt(next)} kg für den ersten Arbeitssatz vor (Ziel etwa ${bounds.low} Wdh.). Falls Technik oder RIR schlechter werden: auf ${fmt(lastKg)} kg zurück. Kein Satz wird automatisch bestätigt.`,candidateKg:next,confidence:'moderate',baselineKg:lastKg};
 }
 const avg=trustworthyRir.length?trustworthyRir.reduce((a,b)=>a+b.rir,0)/trustworthyRir.length:null;
 if(enough&&avg!==null&&avg>=2&&valid.every(s=>s.reps>=bounds.low)&&valid.some(s=>s.reps<bounds.high)){
  const target=Math.min(bounds.high,Math.min(...valid.map(s=>s.reps))+1);
  return {kind:'reps',title:`Wiederholungs-Challenge: ${fmt(lastKg)} kg × ${target}`,detail:`Mindestens einen der nächsten Arbeitssätze bei gleicher Last auf ${target} saubere Wiederholungen steigern (Ziel RIR etwa 2). ${ready&&jump>limit?'Der nächste Scheibenschritt ist aktuell relativ groß. ':''}Eine Wiederholungssteigerung zählt ebenfalls als Fortschritt.`,candidateKg:null,confidence:'moderate',baselineKg:lastKg};
 }
 if((easy||repeatCap)&&ready&&jump>limit){
  return {kind:'small-plates',title:'Bereit für mehr – Scheibenschritt noch zu groß',detail:`Hohe Reserve dokumentiert, aber ${fmt(lastKg)} → ${fmt(next)} kg wären rund ${Math.round(jump*100)} %. Zielwiederholungen festigen oder kleinere Scheiben verwenden; kein riskanter automatischer Sprung.`,candidateKg:null,confidence:'moderate',baselineKg:lastKg};
 }
 if(!trustworthyRir.length){
  return {kind:'log-rir',title:'Nächste Challenge: RIR erfassen',detail:`Letzte Last ${fmt(lastKg)} kg. Dokumentiere bei mindestens zwei Sätzen deine RIR, damit Compass einen begründeten Gewichtsversuch statt bloßer Wiederholungsziele vorschlagen kann.`,candidateKg:null,confidence:'low',baselineKg:lastKg};
 }
 return {kind:'hold',title:'Technik und Zielwiederholungen festigen',detail:`Noch keine belastbare Grundlage für einen neuen Gewichtsschritt. Bei ${fmt(lastKg)} kg kontrolliert trainieren und RIR dokumentieren.`,candidateKg:null,confidence:'low',baselineKg:lastKg};
}
export function challengeBadge42(challenge){
 if(!challenge)return '';
 const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<div class="str142-challenge str142-${e(challenge.kind)}" role="note"><strong>🎯 ${e(challenge.title)}</strong><small>${e(challenge.detail)}</small></div>`;
}
