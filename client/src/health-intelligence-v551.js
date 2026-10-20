/** Compass 0.5.51 – Local health intelligence: explainable observations first.
 * No diagnoses, no inferred sensor wear, no fabricated causality. The optional
 * local model can only rank existing findings, not introduce new health facts.
 */
import {sleepHM} from './sleep-intelligence-v550.js';
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const t=d=>Date.parse(`${d}T12:00:00Z`);
const shift=(d,n)=>new Date(t(d)+n*86400000).toISOString().slice(0,10);
const average=a=>{const x=a.filter(Number.isFinite);return x.length?x.reduce((s,v)=>s+v,0)/x.length:null;};
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(n).toLocaleString('de-AT');
function hrvDays(imported,today){return (imported.garminHrv||[]).filter(x=>DAY.test(x?.day||'')&&x.day<=today&&Number.isFinite(x.nightAverageMs)&&x.nightAverageMs>0&&x.nightAverageMs<500);}
function validNights(nights,today){return nights.filter(n=>DAY.test(n?.day||'')&&n.day<=today&&Number.isFinite(n.sleepMinutes)&&n.sleepMinutes>0&&n.sleepMinutes<=1440);}
function finding(id,headline,observation,explanations,meaning,evidence,kind='neutral'){
 return {id,headline,observation,explanations,meaning,evidence,kind};
}
/** All comparisons use unique measured nights; missing days are never zeros. */
export function healthFindings({nights=[],imported={},today}={}){
 if(!DAY.test(today||''))return [];
 const all=validNights(nights,today),findings=[];
 const last7=all.filter(n=>n.day>=shift(today,-6)),previous=all.filter(n=>n.day>=shift(today,-36)&&n.day<=shift(today,-7));
 const recent=average(last7.map(n=>n.sleepMinutes)),baseline=average(previous.map(n=>n.sleepMinutes));
 if(last7.length>=4&&previous.length>=12){
  const delta=Math.round(recent-baseline),abs=Math.abs(delta);
  if(abs>=25){findings.push(finding('sleep-trend',delta<0?'Schlafdauer zuletzt kürzer':'Schlafdauer zuletzt länger',
   `Ø ${sleepHM(recent)} in den letzten sieben Tagen, ${abs} min ${delta<0?'unter':'über'} deinem vorherigen Vergleichszeitraum.`,
   ['Mögliche Einflüsse sind Schlafenszeiten, Termine, Training, Reisen oder Unterbrechungen. Die Daten allein zeigen keine Ursache.'],
   delta<0?'Achte darauf, ob du dich tagsüber müde fühlst und ob sich in den nächsten Nächten genug Zeit für Schlaf einplanen lässt.':'Prüfe, ob du dich mit der längeren Schlafzeit auch ausgeruhter fühlst.',
   `${last7.length} gemessene Nächte in 7 Tagen · ${previous.length} Vergleichsnächte in 30 Tagen`,delta<0?'watch':'positive'));
  }else findings.push(finding('sleep-stable','Schlafdauer derzeit ähnlich',
   `Ø ${sleepHM(recent)} zuletzt; ${abs} min Unterschied zu deinem 30-Tage-Vergleich.`,
   ['Bei einzelnen Nächten kann es dennoch größere Schwankungen geben. Ein stabiler Mittelwert beweist keine ausreichende Erholung.'],
   'Wenn du dich tagsüber fit fühlst, ist aktuell kein großer Rückgang deiner gemessenen Schlafdauer erkennbar.',
   `${last7.length} aktuelle · ${previous.length} Vergleichsnächte`,'neutral'));
 }
 const hrvs=hrvDays(imported,today),hnew=hrvs.filter(n=>n.day>=shift(today,-6)),hold=hrvs.filter(n=>n.day>=shift(today,-36)&&n.day<=shift(today,-7));
 const hr=average(hnew.map(n=>n.nightAverageMs)),hb=average(hold.map(n=>n.nightAverageMs));
 if(hnew.length>=4&&hold.length>=10&&hb>0){
  const pct=Math.round((hr/hb-1)*100);
  if(Math.abs(pct)>=12){findings.push(finding('hrv-change',pct<0?'Nächtliche HRV zuletzt niedriger':'Nächtliche HRV zuletzt höher',
   `Ø ${fmt(hr)} ms, ${pct>0?'+':''}${pct} % zum vorausgehenden Vergleichszeitraum.`,
   ['HRV kann unter anderem mit Schlaf, Trainingsbelastung, Infekten, Alkohol, Messumständen oder psychischer Belastung schwanken. Eine einzelne Ursache lässt sich nicht ableiten.'],
   pct<0?'Beobachte den Verlauf zusammen mit Schlafdauer und deinem eigenen Befinden. Eine niedrigere Wearable-HRV allein ist keine kritische Gesundheitswarnung.':'Prüfe, ob sich die Veränderung über mehrere Tage hält; höhere HRV ist nicht für sich allein ein Gesundheitsurteil.',
   `${hnew.length} HRV-Tage aktuell · ${hold.length} Vergleichstage`,'neutral'));
  }
 }
 // Stress is Garmin's physiological estimate, not a measure of negative emotion.
 const byStressDay=new Map(),byBatteryDay=new Map();
 for(const p of imported.garminWellness||[]){
  if(!Number.isFinite(Date.parse(p?.at)))continue;
  const day=String(p.at).slice(0,10);if(!DAY.test(day)||day>today)continue;
  if(Number.isFinite(p.stress)&&p.stress>=0&&p.stress<=100){if(!byStressDay.has(day))byStressDay.set(day,[]);byStressDay.get(day).push(p.stress);}
  const hour=new Date(p.at).getUTCHours(); // UTC hour is only a coarse proxy; not used for absolute conclusions.
  if(hour>=5&&hour<=10&&Number.isFinite(p.bodyBattery)&&p.bodyBattery>=0&&p.bodyBattery<=100){if(!byBatteryDay.has(day))byBatteryDay.set(day,[]);byBatteryDay.get(day).push(p.bodyBattery);}
 }
 const wellnessTrend=(map,minPoints,currentWindow=6)=>{
  const rows=[...map].filter(([,v])=>v.length>=minPoints).map(([day,v])=>({day,mean:average(v)}));
  const a=rows.filter(v=>v.day>=shift(today,-6)),b=rows.filter(v=>v.day>=shift(today,-36)&&v.day<=shift(today,-7));
  return {a,b,delta:average(a.map(x=>x.mean))-average(b.map(x=>x.mean))};
 };
 const stress=wellnessTrend(byStressDay,12);
 if(stress.a.length>=4&&stress.b.length>=10&&Number.isFinite(stress.delta)&&Math.abs(stress.delta)>=12){
  findings.push(finding('stress-trend','Garmin-Stresswerte haben sich verändert',
   `Die gemessenen Tagesmittel liegen zuletzt ${Math.abs(Math.round(stress.delta))} Punkte ${stress.delta>0?'höher':'niedriger'} als im Vergleichszeitraum.`,
   ['Garmin schätzt körperliche Stressreaktionen; Aktivität, Messlücken, Trainingsbelastung und Erholung können die Werte beeinflussen. Das ist keine direkte Messung von Emotionen.'],
   'Sieh dir an, ob der Trend zusammen mit Schlaf, Aktivität oder subjektiver Anspannung auftritt. Einzelne Stressspitzen sind keine Gesundheitswarnung.',
   `${stress.a.length} Tage mit mindestens 12 Messungen · ${stress.b.length} Vergleichstage`,'neutral'));
 }
 const battery=wellnessTrend(byBatteryDay,2);
 if(battery.a.length>=4&&battery.b.length>=10&&Number.isFinite(battery.delta)&&Math.abs(battery.delta)>=15){
  findings.push(finding('battery-trend','Body Battery morgens verändert',
   `Die erfassten Vormittagswerte liegen im Mittel ${Math.abs(Math.round(battery.delta))} Punkte ${battery.delta>0?'über':'unter'} dem bisherigen Verlauf.`,
   ['Body Battery ist ein Garmin-Modellwert, kein direkt gemessener Energievorrat. Aufzeichnungsbeginn und Ladezeiten können die Stichprobe verändern.'],
   'Prüfe die Entwicklung zusammen mit deinem Schlaf und Befinden; die Kennzahl allein sollte keine Tagesplanung bestimmen.',
   `${battery.a.length} Tage mit Vormittagsdaten · ${battery.b.length} Vergleichstage`));
 }
 // A 'late' training is one whose actual end was within four hours before
 // the recorded bedtime. The data must provide a usable absolute timestamp.
 const sessions=(imported.garminSessions||[]).filter(s=>Number.isFinite(Date.parse(s?.end))&&Number.isFinite(Date.parse(s?.start))&&Date.parse(s.end)>Date.parse(s.start));
 if(sessions.length>=6&&all.length>=20){
  const groupLate=[],groupOther=[];
  for(const n of all.filter(n=>n.day>=shift(today,-89))){
   const bed=Date.parse(n.start);if(!Number.isFinite(bed))continue;
   const late=sessions.some(s=>{const lag=bed-Date.parse(s.end);return lag>=0&&lag<=4*3600000&&Date.parse(s.start)<bed;});
   (late?groupLate:groupOther).push(n.sleepMinutes);
  }
  if(groupLate.length>=6&&groupOther.length>=10){
   const delta=Math.round(average(groupLate)-average(groupOther));
   if(Math.abs(delta)>=25)findings.push(finding('late-activity','Training vor dem Schlafengehen: Unterschied beobachtet',
    `Nach Aktivitäten, die innerhalb von vier Stunden vor dem Schlafbeginn endeten, lag der erfasste Schlaf im Mittel ${Math.abs(delta)} min ${delta<0?'unter':'über'} den anderen Nächten.`,
    ['Es könnte mit Trainingszeit oder -intensität zusammenhängen. Auch Wochenenden, Tagesbelastung und andere Einflüsse können die Gruppen unterscheiden.'],
    'Das ist eine Beobachtung, kein Nachweis, dass spätes Training die Veränderung verursacht. Vergleiche über längere Zeit und achte auf dein Befinden.',
    `${groupLate.length} Nächte nach spätem Training · ${groupOther.length} Vergleichsnächte`));
  }
 }
 return findings.sort((a,b)=>(a.kind==='watch'?0:1)-(b.kind==='watch'?0:1)).slice(0,5);
}
export function healthFindingsView(findings=[],localSelection=[],status=''){
 const rank=id=>localSelection.includes(id)?localSelection.indexOf(id):100;
 const sorted=localSelection.length?[...findings].sort((a,b)=>rank(a.id)-rank(b.id)):findings;
 const cardMarkup=f=>`<div class="health551-finding"><div class="health551-finding-title"><strong>${safe(f.headline)}</strong><span>${safe(f.evidence)}</span></div><p>${safe(f.observation)}</p><details><summary>Mögliche Erklärung & Bedeutung</summary><div><b>Was könnte dahinterstecken?</b> ${f.explanations.map(safe).join(' ')}</div><div><b>Was bedeutet das für mich?</b> ${safe(f.meaning)}</div></details></div>`;
 const cards=sorted.slice(0,2).map(cardMarkup).join('');
 const extra=sorted.length>2?`<details class="health551-more"><summary>${sorted.length-2} weitere Beobachtungen ansehen</summary>${sorted.slice(2).map(cardMarkup).join('')}</details>`:'';
 return `<section class="health551-panel" aria-label="Gesundheit im Kontext"><div class="health551-header"><div><span>HEALTH INTELLIGENCE</span><h3>Was sagen meine Daten?</h3></div><button type="button" class="health551-ai-button" data-action="health551-local-summary" ${findings.length?'':'disabled'} title="Nur ausgewählte Analyseergebnisse an das lokal laufende LM Studio senden">Lokal priorisieren</button></div>${cards}${extra}${cards?'':'<p class="health551-empty">Für nachvollziehbare Zusammenhänge fehlen noch ausreichend vergleichbare Nächte oder ergänzende Messungen.</p>'}<small class="health551-foot">Beobachtungen aus vorhandenen Messwerten, keine Diagnose. Erklärungen sind Hypothesen, keine nachgewiesenen Ursachen. Die lokale KI kann nur diese geprüften Hinweise sortieren und wird ausschließlich auf Knopfdruck kontaktiert.</small>${status?`<p class="health551-ai-status" role="status">${safe(status)}</p>`:''}</section>`;
}
/** Only model-ordered known IDs are returned. Freeform model health claims are discarded. */
export function validateHealthModelRank(raw,findings){
 const parsed=typeof raw==='string'?JSON.parse(raw.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g,'')):raw;
 if(!Array.isArray(parsed?.ids)||parsed.ids.length>5)throw Error('Das Modell hat keine gültige Reihenfolge geliefert.');
 const ids=new Set(findings.map(x=>x.id)),out=[];
 for(const id of parsed.ids){if(typeof id==='string'&&ids.has(id)&&!out.includes(id))out.push(id);}
 if(!out.length)throw Error('Kein überprüfbarer Hinweis aus der Modellantwort.');
 return out;
}
export async function rankHealthFindingsLocally(findings,fetcher=fetch){
 if(!findings?.length)return [];
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),14000);
 try{
  const models=await fetcher('http://127.0.0.1:1234/v1/models',{signal:controller.signal});if(!models.ok)throw Error('LM Studio: keine Modellliste');
  const model=(await models.json())?.data?.[0]?.id;if(!model||String(model).length>180)throw Error('Kein lokales Modell geladen');
  const res=await fetcher('http://127.0.0.1:1234/v1/chat/completions',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({model,temperature:0,max_tokens:150,messages:[{role:'system',content:'Du priorisierst ausschließlich gegebene datengestützte Hinweise. Gib nur JSON {"ids":["...", "..."]} aus, mit existierenden IDs in Reihenfolge ihrer praktischen Relevanz. Keine neuen medizinischen Aussagen, Diagnosen oder Empfehlungen.'},{role:'user',content:JSON.stringify(findings.map(f=>({id:f.id,observation:f.observation,evidence:f.evidence})))}]})});
  if(!res.ok)throw Error(`LM Studio HTTP ${res.status}`);
  const json=await res.json();return validateHealthModelRank(json?.choices?.[0]?.message?.content||'',findings);
 }finally{clearTimeout(timer);}
}
