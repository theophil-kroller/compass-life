/** Activity-adjusted daily colour thresholds for Compass nutrition history.
 * Garmin's activity calories include resting calories (Garmin support FAQ lkl4cwCLlK7ox362uGQEV7).
 * Compare NET workout expenditure to the individual's usual 28-day baseline;
 * do not add gross workout calories to an already activity-adjusted PAL/TDEE.
 * Pure, local-only, rederived after import. No persistence of synthetic kcal.
 */
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const dayValid=x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x||''));
const shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
const median=x=>{const s=[...x].sort((a,b)=>a-b),mid=s.length>>1;return s.length?(s.length%2?s[mid]:(s[mid-1]+s[mid])/2):0;};
export function distinctGarminCalorieSessions(imports={}){
 const sessions=[...(imports.garminSessions||[])].filter(x=>dayValid(x?.day)&&finite(x.calories)&&x.calories>0&&x.calories<10000&&finite(x.durationMinutes)&&x.durationMinutes>0&&x.durationMinutes<1440)
 .sort((a,b)=>String(a.start||'').localeCompare(String(b.start||'')));
 const unique=[];
 for(const s of sessions){
  const at=Date.parse(s.start||'');
  const duplicate=unique.find(p=>{
   if(p.day!==s.day)return false;
   if(p.id===s.id)return true;
   const earlier=Date.parse(p.start||'');
   if(!finite(at)||!finite(earlier))return false;
   // CSV vs FIT can shift timezone by one or two hours; do not merge distinct
   // workouts unless duration and kcal also agree within a small tolerance.
   return Math.abs(at-earlier)<=7200000 && Math.abs(s.durationMinutes-p.durationMinutes)<=3 && Math.abs(s.calories-p.calories)<=Math.max(20,s.calories*.1);
  });
  if(!duplicate)unique.push(s);
 }
 return unique;
}
export function activityEnergyByDay(state,goal,{today=new Date(),baselineDays=28}={}){
 const base=goal&&goal.ready&&goal.settings?.enabled&&finite(goal.resting?.kcal)&&finite(goal.tdee)&&finite(goal.target);
 const todayStr=typeof today==='string'?today:new Date(today).toLocaleDateString('sv-SE');
 if(!base||!dayValid(todayStr))return {ready:false,reason:'Persönliches Energieziel noch nicht vollständig eingerichtet.',byDay:new Map()};
 const first=shift(todayStr,1-baselineDays);
 const days=new Set((state?.healthImports?.garminFitness||[]).filter(x=>dayValid(x.day)&&x.day>=first&&x.day<=todayStr&&finite(x.steps)&&x.steps>=0).map(x=>x.day));
 const all=distinctGarminCalorieSessions(state?.healthImports||{}).filter(x=>x.day>=first&&x.day<=todayStr);
 // On days with Garmin daily monitoring, no workout = confirmed no IMPORTED workout,
 // not proof of rest. Ten covered days prevent spurious early baselines.
 const useful=all.filter(x=>days.has(x.day));
 if(days.size<10||useful.length===0)return {ready:false,reason:'Für eine belastbare Anpassung fehlen mindestens 10 Garmin-Monitoringtage und importierte Aktivitäten mit kcal und Dauer.',byDay:new Map(),coveredDays:days.size};
 const net=new Map([...days].map(d=>[d,0]));
 for(const row of useful){const rest=goal.resting.kcal*row.durationMinutes/1440;net.set(row.day,(net.get(row.day)||0)+Math.max(0,row.calories-rest));}
 const typical=net.size?[...net.values()].reduce((a,b)=>a+b,0)/net.size:0;
 const byDay=new Map();
 for(const [day,energy] of net){
  // Do not pretend precise extra energy data, cap outlier effects conservatively.
  const difference=Math.max(-600,Math.min(900,energy-typical));
  byDay.set(day,{day,trainingNet:Math.round(energy),habitualNet:Math.round(typical),delta:Math.round(difference),target:Math.round(goal.target+difference),tdee:Math.round(goal.tdee+difference),complete:false,source:'Garmin-Aktivitäten, netto gegenüber 28-Tage-Mittel (geschätzt)'});
 }
 return {ready:true,byDay,coveredDays:days.size,medianNet:median([...net.values()]),baselineNet:Math.round(typical),uncertainty:'Garmin-kcal sind Schätzwerte; fehlende Sportaufzeichnungen können die Tageswerte verändern.'};
}
export function dailyKcalGradient({target,tdee},max){
 if(!finite(target)||!finite(tdee)||!finite(max)||max<=0)return '';
 const left=Math.max(2,Math.min(94,target/max*100)),right=Math.max(left+1,Math.min(98,tdee/max*100));
 // Each day shares the same kcal X-axis but owns its green-yellow-red boundaries.
 return `background:linear-gradient(to right,#125a3b 0%,#55b873 ${Math.max(0,left-5).toFixed(1)}%,#b5d584 ${left.toFixed(1)}%,#f7ca60 ${((left+right)/2).toFixed(1)}%,#ea8d6f ${right.toFixed(1)}%,#b63c50 100%)`;
}
