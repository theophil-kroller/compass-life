/** Compass 0.5.72: Morning Connections — read-only, local, descriptive.
 * Missing logs are UNKNOWN; routine days and observed sleep/feelings are never inferred.
 * No data leaves the vault and no health/psychological or causal conclusions are made.
 */
import {sleepMinutes} from './insights.js';
const goodDay=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const shift=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const mean=a=>a.length?a.reduce((s,n)=>s+n,0)/a.length:null;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=x=>x===null?'–':x.toLocaleString('de-AT',{maximumFractionDigits:1});
/** Public data model: only explicit completed SAVERS sessions; waking-day Garmin sleep.
 * Check-in groups are limited to days with real feeling recordings.
 */
export function morningConnections(state={}, {today=new Date().toISOString().slice(0,10),days=30}={}){
 if(!goodDay(today)||![7,30,90].includes(Number(days)))throw Error('Ungültiger Zeitraum.');
 const start=shift(today,1-Number(days));
 const routineDays=new Set();
 for(const entry of state?.miracleMorning?.sessions||[]){
  if(!entry?.finishedAt||!Number.isFinite(Date.parse(entry.finishedAt)))continue;
  const day=goodDay(entry.day)?entry.day:entry.finishedAt.slice(0,10);
  if(day>=start&&day<=today&&Array.isArray(entry.steps)&&entry.steps.some(s=>!s.skipped))routineDays.add(day);
 }
 // One night per waking date; if overlapping imports appear, preserve latest valid record.
 const nights=new Map();
 for(const entry of state?.healthImports?.garminNights||[]){
  const val=sleepMinutes(entry),day=entry?.day;
  if(goodDay(day)&&day>=start&&day<=today&&Number.isFinite(val)&&val>=120&&val<=900)nights.set(day,val);
 }
 const checkins=new Map();
 for(const entry of state?.feelingCheckins||[]){
  const day=entry?.day||entry?.at?.slice(0,10);
  if(!goodDay(day)||day<start||day>today||!Array.isArray(entry.items))continue;
  const items=entry.items.filter(x=>typeof x?.id==='string'&&Number.isInteger(x.intensity)&&x.intensity>=1&&x.intensity<=10);
  if(!items.length)continue;
  // Do not translate broad emotional categories into an invented positivity/health score.
  const emotions=checkins.get(day)||new Set();for(const x of items)emotions.add(x.id);
  checkins.set(day,emotions);
 }
 const daysWithNight=[...nights].map(([day,minutes])=>({day,minutes,routine:routineDays.has(day)}));
 const withRoutine=daysWithNight.filter(x=>x.routine),withoutDocumented=daysWithNight.filter(x=>!x.routine);
 const pairedDays=[...checkins].map(([day,emotions])=>({day,emotions:[...emotions],routine:routineDays.has(day)}));
 const pairedWithRoutine=pairedDays.filter(x=>x.routine),pairedWithoutDocumented=pairedDays.filter(x=>!x.routine);
 const coverage={routineDays:routineDays.size,measuredNights:nights.size,feelingDays:checkins.size,sleepPairs:withRoutine.length,feelingPairs:pairedWithRoutine.length};
 const sleep={withCount:withRoutine.length,otherCount:withoutDocumented.length,
  withMean:mean(withRoutine.map(x=>x.minutes)),otherMean:mean(withoutDocumented.map(x=>x.minutes)),
  sufficient:withRoutine.length>=3&&withoutDocumented.length>=3};
 const commonEmotions=(rows)=>{const tally=new Map();for(const r of rows)for(const id of r.emotions)tally.set(id,(tally.get(id)||0)+1);return [...tally].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,5);};
 const emotions={withCount:pairedWithRoutine.length,otherCount:pairedWithoutDocumented.length,
  withTop:commonEmotions(pairedWithRoutine),otherTop:commonEmotions(pairedWithoutDocumented),
  sufficient:pairedWithRoutine.length>=3&&pairedWithoutDocumented.length>=3};
 const timeline=Array.from({length:Number(days)},(_,i)=>{const day=shift(start,i);return {day,routine:routineDays.has(day),sleep:nights.has(day),feeling:checkins.has(day)};});
 return {today,start,days:Number(days),coverage,sleep,emotions,timeline};
}
export function morningConnectionsView(model){
 const c=model.coverage,s=model.sleep,e=model.emotions;
 const sleepComparison=s.sufficient?`<div class="mc572-comparison"><span>Mit dokumentierter Morning-Routine: <strong>${fmt(s.withMean/60)} h</strong> (${s.withCount} Nächte)</span><span>Ohne Routinenachweis: <strong>${fmt(s.otherMean/60)} h</strong> (${s.otherCount} Nächte)</span></div><p>Die Nächte sind dem Aufwachdatum zugeordnet. Der Unterschied ist rein beschreibend.</p>`:
  `<p>Für den Schlafvergleich werden mindestens drei gemessene Nächte mit und drei ohne dokumentierte Routine benötigt. Aktuell ${s.withCount} / ${s.otherCount}.</p>`;
 const top=arr=>arr.map(([id,n])=>`${esc(id)} (${n})`).join(' · ')||'Keine Gefühls-Check-ins';
 const feelingComparison=e.sufficient?`<p>Häufig dokumentierte Gefühlsgruppen an Check-in-Tagen mit Routine: ${top(e.withTop)}</p><p>Andere Check-in-Tage: ${top(e.otherTop)}</p>`:
  `<p>Für den Vergleich benötigen wir mindestens drei Check-in-Tage je Gruppe. Aktuell ${e.withCount} / ${e.otherCount}.</p>`;
 return `<section class="mc572-root" aria-label="Morning Connections"><header class="mc572-header"><div><small>PERSONAL INTELLIGENCE · LOKAL</small><h3>Morning Connections</h3><p>Was fällt an Tagen mit dokumentierter Morgenroutine auf?</p></div></header>
 <div class="mc572-metrics"><div><strong>${c.routineDays}</strong><span>Routinetage</span></div><div><strong>${c.measuredNights}</strong><span>gemessene Nächte</span></div><div><strong>${c.feelingDays}</strong><span>Gefühls-Check-in-Tage</span></div></div>
 <div class="mc572-cards"><article class="mc572-card"><h4>🌙 Routine & Schlaf</h4>${sleepComparison}</article><article class="mc572-card"><h4>✦ Routine & Gefühlswelt</h4>${feelingComparison}</article></div>
 <details class="mc572-evidence"><summary>Datenabdeckung (${model.days} Tage)</summary><div class="mc572-timeline">${model.timeline.map(x=>`<span class="${x.routine?'has-routine':''}" title="${x.day} · Routine ${x.routine?'ja':'nicht dokumentiert'} · Schlaf ${x.sleep?'gemessen':'nicht gemessen'} · Gefühl ${x.feeling?'erfasst':'nicht erfasst'}" aria-label="${x.day}: ${x.routine?'Routine':'keine Routine dokumentiert'}, ${x.sleep?'Schlaf vorhanden':'Schlaf fehlt'}, ${x.feeling?'Gefühl vorhanden':'Gefühl fehlt'}"></span>`).join('')}</div><small>Grün = Routine dokumentiert. Die Punkte zeigen keine Bewertung. Weitere Daten nur im entsperrten Vault.</small></details>
 <p class="mc572-method"><strong>Interpretation:</strong> „Ohne Routinenachweis“ bedeutet nicht, dass keine Routine stattgefunden hat. Fehlende Schlaf- oder Gefühlsdaten werden nicht ergänzt und nicht als Null gewertet. Gefühlsangaben sind selbst erfasst, keine Diagnosen oder Stimmungs-Scores. Es gibt keine Kausalitäts- oder Wirksamkeitsaussage. Analysen erfolgen lokal.</p></section>`;
}
