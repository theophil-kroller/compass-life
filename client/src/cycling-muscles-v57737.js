/** Compass .37: cycling is an observed *activity*, not an inferred resistance set.
 * Garmin CSV/FIT summary lacks power, cadence, gradients, gearing and motor output.
 * Muscle involvement is a conservative biomechanics-based qualitative map.
 * Sources: PMID 27448605; PMC6818133; PMID 9391872.
 */
const isDay=x=>/^\d{4}-\d{2}-\d{2}$/.test(x||'');
const fromDate=x=>{const d=new Date(x+'T12:00:00Z');return Number.isFinite(+d)?d:null;};
const shift=(d,n)=>{const x=fromDate(d);if(!x)return '';x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
export const CYCLING_REGIONS=Object.freeze({
 primary:Object.freeze(['quadriceps','glute_max']),
 secondary:Object.freeze(['calves_gastro','calves_soleus','hamstrings','tibialis','glute_med'])
});
function isBike(s){const text=String([s?.activityType,s?.title].filter(Boolean).join(' ')).toLowerCase();
 if(/(?:radfahr|bicycl|cycling|fahrrad|e[ -]?bike|rennrad|mountain.?bike|\bbike\b)/i.test(text))return true;
 // Garmin FIT sport=2 cycling; sport 21 = cycling indoors for older exports.
 return [2,21].includes(s?.sport)&&!/(?:swim|run|strength)/i.test(text);
}
/** Idempotent import aggregation: a FIT summary and a CSV from approximately
 * the same ride count as one ride, NEVER double duration. */
export function cyclingSessions(state,{range='28',today}={}){
 const latest=isDay(today)?today:new Date().toLocaleDateString('sv-SE');
 const from=range==='all'?'':shift(latest,1-(Number(range)||28));
 const selected=(state?.healthImports?.garminSessions||[]).filter(x=>x&&isBike(x)&&isDay(x.day)&&x.day<=latest&&(!from||x.day>=from)&&Number.isFinite(x.durationMinutes)&&x.durationMinutes>0&&x.durationMinutes<=1440)
  .slice().sort((a,b)=>String(a.start||'').localeCompare(String(b.start||'')));
 const chosen=[];
 for(const row of selected){const start=Date.parse(row.start||'');
  const idx=chosen.findIndex(other=>{
   if(row.day!==other.day)return false;
   const prior=Date.parse(other.start||'');
   if(!Number.isFinite(start)||!Number.isFinite(prior))return row.id===other.id;
   const offsets=row.source===other.source?[0]:[0,-1,1,-2,2];
   return Math.min(...offsets.map(h=>Math.abs(start-prior+h*3600000)))<=180000&&Math.abs(row.durationMinutes-other.durationMinutes)<=Math.max(5,Math.min(row.durationMinutes,other.durationMinutes)*.15);
  });
  if(idx<0){chosen.push(row);continue;}
  const prev=chosen[idx];
  // Prefer a row with richer metadata; otherwise do not overwrite a confirmed value.
  const quality=x=>[x.avgHr,x.calories,x.distanceKm,x.end].filter(v=>v!=null).length;
  if(quality(row)>quality(prev))chosen[idx]=row;
 }
 return chosen.sort((a,b)=>String(a.start).localeCompare(String(b.start)));
}
export function cyclingMuscleSummary(state,opts={}){
 const sessions=cyclingSessions(state,opts),minutes=sessions.reduce((s,x)=>s+x.durationMinutes,0),days=new Set(sessions.map(x=>x.day)).size;
 return {sessions,minutes:Math.round(minutes*10)/10,days,rides:sessions.length,
  regions:CYCLING_REGIONS,mode:'recruited-not-measured',motor:'user-reported-off-not-in-export',
  note:'Ausdauertypische Muskelbeteiligung beim Treten; keine erfassten Kraftsätze, EMG-Werte oder objektiv gemessene Wadenbelastung. Motorstatus wird im Garmin-Export nicht verifiziert.'};
}
