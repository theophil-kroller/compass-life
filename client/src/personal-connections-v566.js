/** Compass 0.5.66 — local, descriptive connections between voluntarily logged
 * emotions and independently observed days. No inferred emotions, imputation,
 * diagnostic or causal claims, or transfer to another service.
 */
import {FEELINGS} from './feeling-wheel-v565.js';
import {sleepMinutes} from './insights.js';
import {joinedFitnessDays} from './insights-fitness.js';

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayOK=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const shift=(day,n)=>new Date(Date.parse(day+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
const valid=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const metrics=Object.freeze([
 {key:'sleep',name:'Schlaf',unit:'h',color:'#8bb5e6',description:'Schlafdauer der Nacht, zugeordnet zum Aufwachdatum',format:v=>(v/60).toLocaleString('de-AT',{maximumFractionDigits:1})},
 {key:'steps',name:'Bewegung',unit:'Schritte',color:'#82c6af',description:'Tages-Schrittzahl; Garmin vor Health Connect, keine Addition',format:v=>Math.round(v).toLocaleString('de-AT')},
 {key:'work',name:'Arbeitsbelastung',unit:'h',color:'#e3b77d',description:'Erfasste Arbeitsstunden des Tages, kein Rückschluss auf Stress',format:v=>v.toLocaleString('de-AT',{maximumFractionDigits:1})},
 {key:'battery',name:'Body Battery',unit:'Punkte',color:'#b8a2e2',description:'Garmin-Tagesmaximum; Geräteindikator, kein Maß für psychisches Wohlbefinden',format:v=>Math.round(v).toLocaleString('de-AT')}
]);
const emotion=id=>FEELINGS.find(e=>e.id===id);
/** Pair only days with both a check-in and an observed value. The "other" cohort
 * contains *other CHECK-IN days*, never missing diary days.
 */
export function personalConnections(state={}, {today='2026-10-21',days=30,emotionId='anger',healthDays=[]}={}){
 if(!dayOK(today)||![7,30,90].includes(Number(days))||!emotion(emotionId))throw Error('Ungültiger Analysezeitraum oder Gefühl.');
 const start=shift(today,1-Number(days));
 const diaries=new Map();
 for(const entry of Array.isArray(state.feelingCheckins)?state.feelingCheckins:[]){
  const day=entry?.day||entry?.at?.slice(0,10);
  if(!dayOK(day)||day<start||day>today||!Array.isArray(entry.items))continue;
  const vals=diaries.get(day)||new Map();
  for(const item of entry.items){if(!emotion(item.id)||!Number.isInteger(item.intensity)||!valid(item.intensity,1,10))continue;vals.set(item.id,Math.max(vals.get(item.id)||0,item.intensity));}
  if(vals.size)diaries.set(day,vals);
 }
 const measured=new Map();
 const add=(day,key,value)=>{if(!dayOK(day)||day<start||day>today)return;const old=measured.get(day)||{};old[key]=value;measured.set(day,old);};
 const health=state.healthImports||{};
 for(const row of Array.isArray(health.garminNights)?health.garminNights:[]){const v=sleepMinutes(row);if(valid(v,120,900))add(row.day,'sleep',v);}
 for(const row of joinedFitnessDays(health,healthDays,today,{start,end:today})){if(valid(row.steps,0,100000))add(row.day,'steps',row.steps);}
 for(const row of Array.isArray(state.workTime?.days)?state.workTime.days:[]){if(valid(row?.hours,0,24))add(row.day,'work',row.hours);}
 // Multiple monitoring samples on one day: only one maximum per day.
 for(const row of Array.isArray(health.garminWellness)?health.garminWellness:[]){const day=row?.at?.slice(0,10);if(valid(row?.bodyBattery,0,100)&&dayOK(day)&&day>=start&&day<=today){const prior=measured.get(day)?.battery;add(day,'battery',Math.max(prior??0,row.bodyBattery));}}
 const pairs=[...diaries].map(([day,feelings])=>({day,intensity:feelings.get(emotionId)||null,observed:measured.get(day)||{}})).sort((a,b)=>a.day.localeCompare(b.day));
 // Only self-confirmed person interactions. An unlogged contact is not an absence.
 const recordedContacts=new Set();
 for(const person of Object.values(state.people||{}))for(const item of Array.isArray(person?.contactLog)?person.contactLog:[]){
  if(dayOK(item?.day)&&item.day>=start&&item.day<=today&&['meeting','video','call','message','email','other'].includes(item.type))recordedContacts.add(item.day);
 }
 const withContact=pairs.filter(x=>recordedContacts.has(x.day));
 const withoutLog=pairs.filter(x=>!recordedContacts.has(x.day));
 const social={withContactDays:withContact.length,withoutLogDays:withoutLog.length,
  withEmotion:withContact.filter(x=>x.intensity!==null).length,
  withoutLogEmotion:withoutLog.filter(x=>x.intensity!==null).length,
  sufficient:withContact.length>=3&&withoutLog.length>=3};
 const analysis=metrics.map(metric=>{
  const matched=pairs.filter(row=>valid(row.observed[metric.key],0,metric.key==='steps'?100000:metric.key==='work'?24:metric.key==='sleep'?900:100));
  const selected=matched.filter(row=>row.intensity!==null),other=matched.filter(row=>row.intensity===null);
  const selectedMean=mean(selected.map(row=>row.observed[metric.key]));const otherMean=mean(other.map(row=>row.observed[metric.key]));
  return {...metric,matched,selectedCount:selected.length,otherCount:other.length,selectedMean,otherMean,
   sufficient:selected.length>=3&&other.length>=3,coverage:matched.length};
 });
 return {start,today,days:Number(days),emotionId,emotion:emotion(emotionId),checkinDays:pairs.length,checkins:(Array.isArray(state.feelingCheckins)?state.feelingCheckins:[]).filter(e=>{const d=e?.day||e?.at?.slice(0,10);return d>=start&&d<=today&&diaries.has(d);}).length,emotionDays:pairs.filter(row=>row.intensity!==null).length,analysis,social};
}

function dotPlot(metric){
 if(!metric.matched.length)return '<p class="pc66-missing">Keine gemeinsamen Mess- und Check-in-Tage.</p>';
 const data=metric.matched.slice(-36),numbers=data.map(row=>row.observed[metric.key]);const min=Math.min(...numbers),max=Math.max(...numbers),delta=Math.max(1,max-min);
 const w=420,h=116,left=20,right=20,top=16,bottom=18;
 const xs=i=>left+(i/Math.max(1,data.length-1))*(w-left-right);
 const ys=v=>top+(1-(v-min)/delta)*(h-top-bottom);
 const dots=data.map((row,i)=>{const color=row.intensity!==null?'#87e8d0':'#97a0b1';const label=`${row.day}: ${metric.format(row.observed[metric.key])} ${metric.unit}; ${row.intensity!==null?'ausgewähltes Gefühl '+row.intensity+'/10':'anderer Check-in'}`;return `<circle cx="${xs(i).toFixed(1)}" cy="${ys(row.observed[metric.key]).toFixed(1)}" r="${row.intensity!==null?5:3.5}" fill="${color}" stroke="#152535" stroke-width="1.3"><title>${esc(label)}</title></circle>`;}).join('');
 return `<svg viewBox="0 0 ${w} ${h}" class="pc66-plot" role="img" aria-label="${esc(metric.name)} an ${data.length} gemeinsam dokumentierten Tagen, nach Check-in-Gruppe gefärbt"><line x1="${left}" y1="${h-bottom}" x2="${w-right}" y2="${h-bottom}" stroke="#536879" opacity=".6"/><line x1="${left}" y1="${top}" x2="${w-right}" y2="${top}" stroke="#536879" opacity=".25"/>${dots}<text x="${left}" y="${h-2}" fill="#a8b9c6" font-size="10">${esc(data[0].day.slice(5))}</text><text x="${w-right}" y="${h-2}" text-anchor="end" fill="#a8b9c6" font-size="10">${esc(data.at(-1).day.slice(5))}</text></svg>`;
}
export function personalConnectionsView(model){
 const summary=model.analysis.filter(a=>a.sufficient).length;
 return `<section class="pc66" aria-label="Emotionen und Alltagsdaten – explorative Beobachtungen"><header class="pc66-header"><div><small>COMPASS · PERSONAL INTELLIGENCE</small><h2>Zusammenhänge entdecken</h2><p>Was geht mit deinen dokumentierten Gefühlen einher? Ein vorsichtiger Blick auf tatsächliche Beobachtungen.</p></div><button type="button" class="pc66-add" data-action="feeling-open">✦ Gefühl erfassen</button></header>
 <div class="pc66-controls"><div role="group" aria-label="Gefühl für Vergleich auswählen" class="pc66-emotions">${FEELINGS.map(e=>`<button type="button" class="${model.emotionId===e.id?'active':''}" style="--pc66-color:${e.color}" data-action="connection-emotion" data-id="${e.id}" aria-pressed="${model.emotionId===e.id}" title="${esc(e.description)}">${e.emoji}<span>${esc(e.label)}</span></button>`).join('')}</div><div class="pc66-days" role="group" aria-label="Analysezeitraum">${[7,30,90].map(n=>`<button type="button" class="${n===model.days?'active':''}" data-action="connection-period" data-id="${n}" aria-pressed="${n===model.days}">${n} T</button>`).join('')}</div></div>
 <div class="pc66-summary"><div><strong>${model.checkins}</strong><span>Check-ins</span></div><div><strong>${model.checkinDays}</strong><span>Tage mit Check-in</span></div><div><strong>${model.emotionDays}</strong><span>Tage mit ${esc(model.emotion.label)}</span></div><div><strong>${summary} / 4</strong><span>Vergleiche möglich</span></div></div>
 <p class="pc66-caption"><span class="pc66-dot active"></span> ${esc(model.emotion.label)} dokumentiert <span class="pc66-dot"></span> Anderes Gefühl dokumentiert · Je Punkt ein Tag mit Check-in und Messwert.</p>
 <div class="pc66-grid">${model.analysis.map(metric=>`<article class="pc66-card"><div class="pc66-card-head"><div><small>${esc(metric.description)}</small><h3>${esc(metric.name)}</h3></div><span>${metric.coverage} Paar-Tage</span></div>${dotPlot(metric)}<div class="pc66-comparison"><div><small>${esc(model.emotion.label)} · ${metric.selectedCount} Tage</small><strong>${metric.selectedMean===null?'–':esc(metric.format(metric.selectedMean))} <em>${esc(metric.unit)}</em></strong></div><div><small>Andere Check-ins · ${metric.otherCount} Tage</small><strong>${metric.otherMean===null?'–':esc(metric.format(metric.otherMean))} <em>${esc(metric.unit)}</em></strong></div></div><p class="pc66-verdict">${metric.sufficient?'Deskriptiver Vergleich möglich; keine Ursache oder statistische Signifikanz ableitbar.':'Noch nicht genügend vergleichbare Tage (mind. 3 pro Gruppe). Vorhandene Werte nur zur Orientierung.'}</p></article>`).join('')}</div>
 <section class="pc66-social"><div><small>BEZIEHUNGEN · BESTÄTIGTE KONTAKTE</small><h3>Persönlicher Austausch & ${esc(model.emotion.label)}</h3><p>Wie oft war ${esc(model.emotion.label)} an Tagen mit selbst dokumentiertem Kontakt Teil deines Check-ins?</p></div><div class="pc66-social-pairs"><div><span>Mit dokumentiertem Kontakt</span><strong>${model.social.withEmotion} / ${model.social.withContactDays}</strong><small>Check-in-Tage</small></div><div><span>Kein Kontakt dokumentiert</span><strong>${model.social.withoutLogEmotion} / ${model.social.withoutLogDays}</strong><small>Check-in-Tage</small></div></div><p class="pc66-verdict">${model.social.sufficient?'Beide Gruppen haben mindestens drei Beobachtungstage. Das zeigt lediglich zeitliches Zusammenfallen.':'Für einen vorsichtigen Vergleich brauchen wir mindestens drei Check-in-Tage pro Gruppe.'} Fehlende Kontaktprotokolle sind keine kontaktfreien Tage. Keine Bewertung von Menschen oder Beziehungen.</p></section>
 <div class="pc66-method"><strong>So liest du diese Darstellung</strong><p>Verglichen werden nur Tage, an denen du selbst Gefühle erfasst hast <em>und</em> zu denen der jeweilige Messwert vorliegt. „Andere Check-ins“ bedeutet nicht „Gefühl abwesend“; mehrere Gefühle können gemeinsam vorkommen. Wiederholte Check-ins am selben Tag zählen nur einmal (höchste dokumentierte Intensität). Schlaf ist der Nacht des Aufwachdatums zugeordnet. Fehlende Tage werden weder ergänzt noch als Null gewertet. Auch bei Unterschieden gilt: <strong>Zusammenhang ist keine Ursache</strong>; kleine, selbst ausgewählte Stichproben und Jahreszeit, Arbeitstage oder andere Umstände können die Werte beeinflussen.</p><p>Alle Analysen laufen lokal im verschlüsselten Compass-Kontext. Es werden keine zusätzlichen sensiblen Daten gespeichert oder an eine KI übertragen.</p></div></section>`;
}
