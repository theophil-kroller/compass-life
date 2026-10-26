/** Compass 0.5.77.59.26 · personal, descriptive health context for the coach.
 * No population norm, black-box recovery score, medical diagnosis, or auto-applied load.
 * Three independent imported series; missing data never become zero or "good".
 */
const dayOK = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v||''));
const safeNum = (n,min,max) => typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max?n:null;
const median = values => { const v=values.filter(Number.isFinite).sort((a,b)=>a-b); return v.length?(v.length%2?v[(v.length-1)/2]:(v[v.length/2-1]+v[v.length/2])/2):null; };
const age=(day,today)=>{
 if(!dayOK(day)||!dayOK(today))return null;
 const difference=(Date.parse(today+'T12:00:00Z')-Date.parse(day+'T12:00:00Z'))/86400000;
 return Number.isFinite(difference)&&difference>=0?Math.round(difference):null;
};
const groupByDay=(rows,field,low,high,today)=>{
 const m=new Map();
 for(const row of Array.isArray(rows)?rows:[]){
  const d=row?.day;const daysAgo=age(d,today);if(daysAgo===null||daysAgo>90)continue;
  const value=safeNum(row?.[field],low,high);
  if(value===null)continue;
  // Multiple records on a single day do not inflate a baseline.
  const old=m.get(d);if(!old||String(row.at||'')>=String(old.at||''))m.set(d,{day:d,at:row.at||'',value});
 }
 return [...m.values()].sort((a,b)=>a.day.localeCompare(b.day));
};
const rounded=(v,precision=1)=>v===null?null:Number(v.toFixed(precision));
/** Sleep = median of 3 recent nights versus 10+ prior observed nights (day -3 to -45).
 * HRV = median of 3 recent nightly averages versus 10+ older nights (day -3 to -45).
 * Thresholds are conservative trend flags, not diagnostics or workout clearances.
 */
export function strengthCoachHealthContext(state,{today=new Date().toISOString().slice(0,10)}={}){
 const imports=state?.healthImports||{};
 const nights=groupByDay(imports.garminNights,'sleepMinutes',60,960,today);
 const hrv=groupByDay(imports.garminHrv,'nightAverageMs',5,250,today);
 const recent=(rows)=>rows.filter(x=>age(x.day,today)<=2);
 const baseline=(rows)=>rows.filter(x=>{const a=age(x.day,today);return a>=3&&a<=45;});
 const sleepRecent=recent(nights),sleepBaseline=baseline(nights);
 const hrvRecent=recent(hrv),hrvBaseline=baseline(hrv);
 const sleepLatest=median(sleepRecent.map(x=>x.value));const sleepRef=median(sleepBaseline.map(x=>x.value));
 const hrvLatest=median(hrvRecent.map(x=>x.value));const hrvRef=median(hrvBaseline.map(x=>x.value));
 const sleepUsable=sleepRecent.length>=2&&sleepBaseline.length>=10;
 const hrvUsable=hrvRecent.length>=2&&hrvBaseline.length>=10;
 const sleepChange=sleepUsable?rounded(sleepLatest-sleepRef,0):null;
 const hrvChange=hrvUsable?rounded((hrvLatest/hrvRef-1)*100,1):null;
 const sleepLow=sleepChange!==null&&sleepChange<=-60;
 const hrvLow=hrvChange!==null&&hrvChange<=-15;
 const trackedBody=(Array.isArray(imports.fitdays)?imports.fitdays:[])
  .filter(x=>dayOK(x?.day)&&age(x.day,today)!==null&&safeNum(x?.weightKg,20,350)!==null)
  .sort((a,b)=>String(a.at||a.day).localeCompare(String(b.at||b.day)));
 // Latest daily measurement wins; body impedance devices fluctuate with hydration.
 const bodyPerDay=new Map();for(const row of trackedBody)bodyPerDay.set(row.day,row);
 const bodySeries=[...bodyPerDay.values()].sort((a,b)=>a.day.localeCompare(b.day));
 const latestBody=bodySeries.at(-1)||null;
 const earlierBody=[...bodySeries].reverse().find(x=>latestBody&&age(x.day,latestBody.day)>=21&&age(x.day,latestBody.day)<=90)||null;
 const bodyTrend=latestBody&&earlierBody?{
  from:earlierBody.day,to:latestBody.day,measurements:bodySeries.length,daysBetween:age(earlierBody.day,latestBody.day),
  weightKgDelta:rounded(latestBody.weightKg-earlierBody.weightKg,2),
  weightWeeklyPct:rounded((latestBody.weightKg/earlierBody.weightKg-1)*100/(age(earlierBody.day,latestBody.day)/7),2),
  bodyFatPctDelta:safeNum(latestBody.bodyFatPct,1,75)!==null&&safeNum(earlierBody.bodyFatPct,1,75)!==null?rounded(latestBody.bodyFatPct-earlierBody.bodyFatPct,2):null,
  muscleKgDelta:safeNum(latestBody.muscleKg,2,200)!==null&&safeNum(earlierBody.muscleKg,2,200)!==null?rounded(latestBody.muscleKg-earlierBody.muscleKg,2):null,
  // A single pair is not enough to infer a real composition trend.
  reliableForTrend:bodySeries.length>=6
 }:null;
 const status=sleepLow&&hrvLow?'attention':sleepLow||hrvLow?'notice':sleepUsable||hrvUsable?'observed':'insufficient';
 const reasons=[];
 if(sleepLow)reasons.push('Schlaf deutlich unter dem persönlichen Vergleichsfenster');
 if(hrvLow)reasons.push('nächtliche HRV deutlich unter dem persönlichen Vergleichsfenster');
 const guidance=status==='attention'?'Beide beobachteten Signale liegen deutlich unter deinen persönlichen Vergleichswerten. Training heute konservativ planen oder eine Pause erwägen; keine automatische Trainingssperre.':
  status==='notice'?'Ein beobachtetes Signal liegt deutlich unter deinem Vergleichswert. Belastung und subjektives Befinden besonders berücksichtigen.':
  status==='observed'?'Kein starkes negatives Signal anhand der verfügbaren persönlichen Vergleichsfenster – das ist keine Trainingsfreigabe.':
  'Für einen persönlichen Vergleich fehlen genügend aktuelle Nächte bzw. historische Messungen.';
 const bodyNote=bodyTrend?
  `Fitdays ${bodyTrend.from}–${bodyTrend.to}: Gewicht ${bodyTrend.weightKgDelta>0?'+':''}${bodyTrend.weightKgDelta} kg${bodyTrend.bodyFatPctDelta!==null?`, Körperfett ${bodyTrend.bodyFatPctDelta>0?'+':''}${bodyTrend.bodyFatPctDelta} Prozentpunkte`:''}${bodyTrend.muscleKgDelta!==null?`, Geräte-Muskelmasse ${bodyTrend.muscleKgDelta>0?'+':''}${bodyTrend.muscleKgDelta} kg`:''}. ${bodyTrend.reliableForTrend?'Über mehrere Messungen bestätigt werden muss der Verlauf dennoch.':'Nur wenige Messungen: allenfalls Richtungsindiz, kein verlässlicher Wachstumstrend.'}`:
  'Fitdays: Für einen längerfristigen Vergleich sind Messungen mit mindestens 21 Tagen Abstand erforderlich.';
 return {
  today,status,reasons,guidance,bodyNote,attention:sleepLow&&hrvLow,
  sleep:{recentCount:sleepRecent.length,baselineCount:sleepBaseline.length,usable:sleepUsable,recentMinutes:sleepUsable?rounded(sleepLatest,0):null,baselineMinutes:sleepUsable?rounded(sleepRef,0):null,deltaMinutes:sleepChange,flag:sleepLow},
  hrv:{recentCount:hrvRecent.length,baselineCount:hrvBaseline.length,usable:hrvUsable,recentMs:hrvUsable?rounded(hrvLatest,1):null,baselineMs:hrvUsable?rounded(hrvRef,1):null,deltaPct:hrvChange,flag:hrvLow},
  body:{latest:latestBody?{day:latestBody.day,weightKg:latestBody.weightKg,bodyFatPct:safeNum(latestBody.bodyFatPct,1,75),muscleKg:safeNum(latestBody.muscleKg,2,200)}:null,trend:bodyTrend,count:bodySeries.length},
  method:'Schlaf/HRV: Median der letzten 3 Kalendertage (mind. 2 Werte) gegen Median der 3–45 Tage davor (mind. 10 Werte). Signalgrenzen −60 min bzw. −15 %. Fitdays: mindestens 21 Tage Abstand; BIA-Körperfett-/Muskelangaben schwanken mit Flüssigkeit und Messbedingungen. Kein validierter Regenerations- oder Hypertrophie-Score.'
 };
}
