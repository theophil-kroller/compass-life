/** Compass .59.34 – transparent V-Taper feedback from *confirmed* user sets.
 * No synthetic recovery scores, no unverified Garmin RIR, no automatic loading changes.
 */
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export const V_TAPER_WEEKLY_TARGETS=Object.freeze({back:[10,16],shoulders:[10,16],chest:[6,12],quads:[6,12],posterior:[6,12],core:[4,10]});
export function validRir34(value){
 if(value===''||value==null)return null;
 const n=Number(value);return Number.isInteger(n)&&n>=0&&n<=4?n:null;
}
export function confirmedRir34(state,exerciseId,today){
 const out=[];
 for(const session of Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[]){
  if(session?.source!=='compass-guided-v5920'||!Array.isArray(session.exercises))continue;
  const day=String(session.startedAt||'').slice(0,10);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||day>today)continue;
  for(const e of session.exercises){if(e.exerciseId!==exerciseId)continue;
   for(const set of Array.isArray(e.confirmedSets)?e.confirmedSets:[]){const rir=validRir34(set.rir);if(set.confirmed===true&&rir!==null)out.push({rir,day,at:set.completedAt||session.startedAt});}
  }
 }
 return out.sort((a,b)=>String(b.at).localeCompare(String(a.at)));
}
export function coach34RecommendedSets({state,goal,exerciseId,primary,baseSets,level,history,health,today}){
 if(!Number.isInteger(baseSets)||baseSets<1)return baseSets;
 if(goal!=='vtaper')return baseSets;
 // At low confidence, never infer novice performance from missing historic data.
 let result=level?.level==='beginner'?Math.min(baseSets,2):baseSets;
 const recent=confirmedRir34(state,exerciseId,today).slice(0,5);
 const weekly=Number(history?.counts7?.[primary]||0);
 const target=V_TAPER_WEEKLY_TARGETS[primary];
 // Low sleep AND HRV are a caution, not a measured physiological readiness.
 if(health?.attention===true)result=Math.min(result,2);
 if(target&&weekly>=target[1])result=Math.min(result,2);
 // Very hard sets with low session history should not trigger extra weekly volume.
 if(recent.length>=2&&recent.slice(0,2).every(x=>x.rir===0))result=Math.min(result,2);
 // More volume is deliberately NOT auto-added simply because sets felt easy.
 return clamp(result,1,baseSets);
}
export function coach34Feedback(state,history,today){
 const rows=[];
 for(const [group,target] of Object.entries(V_TAPER_WEEKLY_TARGETS)){
  const observed=history?.usable?Number(history.counts7?.[group]||0):null;
  rows.push({group,minimum:target[0],maximum:target[1],observed:Number.isFinite(observed)?Math.round(observed*10)/10:null,
   status:observed===null?'unknown':observed<target[0]?'under':observed>target[1]?'above':'within'});
 }
 const sessions=Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[];
 const rirs=sessions.flatMap(s=>Array.isArray(s?.exercises)?s.exercises:[]).flatMap(e=>Array.isArray(e?.confirmedSets)?e.confirmedSets:[]).filter(x=>x?.confirmed&&validRir34(x.rir)!==null).map(x=>validRir34(x.rir));
 return {weekly:rows,recordedRir:rirs.length,latestRir:rirs.length?rirs.at(-1):null,
  caveat:'Richtwerte für dokumentierte Satzbeteiligungen, nicht gemessenen Muskelaufbau. Garmin ohne einzelne Übungsdetails bleibt unbekannt. RIR muss vom Nutzer bestätigt werden.'};
}
/** Feedback changes explanatory next-step guidance, not the user's confirmed load. */
export function coach34RirGuidance(state,exerciseId,today){
 const recent=confirmedRir34(state,exerciseId,today).slice(0,3);
 if(!recent.length)return '';
 const avg=recent.reduce((sum,x)=>sum+x.rir,0)/recent.length;
 if(avg<=0.5)return `Letzte ${recent.length} RIR-Angabe(n): nahe am Muskelversagen. Technik und Erholung prüfen; nicht automatisch Gewicht erhöhen.`;
 if(avg>=3)return `Letzte ${recent.length} RIR-Angabe(n): noch viel Reserve. Zuerst saubere Wiederholungen bis zur Zielobergrenze entwickeln, dann Belastung prüfen.`;
 return `Letzte ${recent.length} RIR-Angabe(n): Ø ${avg.toFixed(1)} Wdh. Reserve. Belastung beobachten und kontrolliert steigern.`;
}
