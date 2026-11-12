/** Compass 0.5.91.41 · Visual V-taper overview before all existing Body Insights.
 * Read-only: real matched Smart Tape sessions + observed Fitdays/training/nutrition.
 * No synthetic percent target, growth claim or automatic exercise prescription.
 */
import {vtaperOverlayPanel143} from './vtaper-overlay-v059143.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const display=(v,d=1)=>finite(v)?v.toLocaleString('de-AT',{minimumFractionDigits:d,maximumFractionDigits:d}):'–';
const diff=(v,d=1)=>finite(v)?`${v>0?'+':''}${display(v,d)}`:'–';
const fmtDay=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'')?`${v.slice(8,10)}.${v.slice(5,7)}.${v.slice(0,4)}`:'–';
const validDate=x=>/^20\d\d-\d\d-\d\d$/.test(x||'');
const span=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);

/** A pair is formed ONLY from the same timestamp/source/method/protocol.
 * No shoulder on Tuesday with waist on Wednesday and no questionable readings.
 */
export function vtaperTapeCheckins141(tapeModel){
 const sessions=new Map();
 for(const region of tapeModel?.series||[]){
  for(const p of region.points||[]){
   if(!finite(p.valueCm)||p.valueCm<=0||!validDate(p.day)||p.qualityStatus==='questionable')continue;
   const key=[p.at,p.source||'',p.method||'',p.protocol||''].join('|');
   const item=sessions.get(key)||{at:p.at,day:p.day,source:p.source,method:p.method,protocol:p.protocol,values:{}};
   item.values[region.id]=p.valueCm;sessions.set(key,item);
  }
 }
 return [...sessions.values()].filter(s=>finite(s.values.shoulder)&&finite(s.values.waist)&&s.values.waist>0)
  .sort((a,b)=>a.at.localeCompare(b.at));
}
const rounded=(v,d=3)=>Math.round(v*10**d)/10**d;
const delta=(previous,latest)=>finite(previous)&&finite(latest)?rounded(latest-previous,2):null;
const pct=(previous,latest)=>finite(previous)&&finite(latest)&&previous>0?rounded(100*(latest/previous-1),2):null;
const get=(values,id)=>finite(values?.[id])?values[id]:null;
const avg=(values,ids)=>ids.every(id=>finite(values?.[id]))?ids.reduce((x,id)=>x+values[id],0)/ids.length:null;

export function vtaperOverviewModel141(tapeModel,transformation=null,{heightCm=null}={}){
 const sessions=vtaperTapeCheckins141(tapeModel);
 const latest=sessions.at(-1)||null;
 const first=sessions.length>1?[...sessions].reverse().find(x=>x.day!==latest.day)||null:null;
 const comparable=!!(latest&&first&&span(first.day,latest.day)>0);
 const v0=first?.values||{},v1=latest?.values||{};
 const ratio0=comparable?v0.shoulder/v0.waist:null;
 const ratio1=latest?latest.values.shoulder/latest.values.waist:null;
 const ratioDelta=comparable?delta(ratio0,ratio1):null;
 const ratioPct=comparable?pct(ratio0,ratio1):null;
 const contexts=new Map((tapeModel?.workoutCheckins||[]).map(x=>[x.at,x]));
 const lastFlag=latest?contexts.get(latest.at):null,baseFlag=first?contexts.get(first.at):null;
 const pump=Boolean(lastFlag?.postWorkout||baseFlag?.postWorkout);
 const relatedPump=Boolean((lastFlag?.possiblePumpRegions||[]).includes('shoulder')||(baseFlag?.possiblePumpRegions||[]).includes('shoulder'));
 const unknownPump=Boolean([lastFlag,baseFlag].some(x=>x?.postWorkout&&(x.linked?.matched?.length??0)===0));
 const uniqueDays=new Set(sessions.map(x=>x.day)).size;
 const historySpan=sessions.length>1?span(sessions[0].day,latest.day):0;
 const lowConfidence=!comparable||uniqueDays<4||pump||historySpan<21;
 const meaningful=ratioPct!==null&&Math.abs(ratioPct)>=.1;
 const direction=!comparable?'unavailable':!meaningful?'flat':ratioPct>0?'improving':'decreasing';
 const measures=[
  {id:'shoulder',label:'Schultern',goal:'up',change:comparable?delta(v0.shoulder,v1.shoulder):null,first:get(v0,'shoulder'),last:get(v1,'shoulder'),pumpPossible:relatedPump||unknownPump},
  {id:'waist',label:'Taille',goal:'down',change:comparable?delta(v0.waist,v1.waist):null,first:get(v0,'waist'),last:get(v1,'waist'),pumpPossible:false},
  {id:'chest',label:'Brust',goal:'up',change:comparable?delta(get(v0,'chest'),get(v1,'chest')):null,first:get(v0,'chest'),last:get(v1,'chest'),pumpPossible:unknownPump||pump&&Boolean((lastFlag?.possiblePumpRegions||[]).includes('chest')||(baseFlag?.possiblePumpRegions||[]).includes('chest'))},
  {id:'arms',label:'Oberarme Ø',goal:'up',change:comparable?delta(avg(v0,['leftUpperArm','rightUpperArm']),avg(v1,['leftUpperArm','rightUpperArm'])):null,first:avg(v0,['leftUpperArm','rightUpperArm']),last:avg(v1,['leftUpperArm','rightUpperArm']),pumpPossible:unknownPump||pump&&Boolean((lastFlag?.possiblePumpRegions||[]).some(id=>id.endsWith('UpperArm'))||(baseFlag?.possiblePumpRegions||[]).some(id=>id.endsWith('UpperArm')))}
 ];
 const weight=transformation?.weight||null,fat=transformation?.fat||null,c=transformation?.sourceCounts||{};
 return {sessions,first:comparable?first:null,latest,heightCm,comparable,ratioFirst:ratio0,ratioLatest:ratio1,ratioDelta,ratioPct,
  direction,lowConfidence,pump,relatedPump,measures,weight:{last:weight?.last?.value??null,delta:weight?.delta??null,days:weight?.count??0},
  fat:{last:fat?.last?.value??null,delta:fat?.delta??null,days:fat?.count??0},
  trainingDays:c.strength??0,sets:c.sets??0,proteinDays:c.protein??0,kcalDays:c.kcal??0,
  proteinPartial:c.proteinPartial??0,period:transformation?.range??'90',source:'read-only-observed-measurements'};
}
function evidenceTone141(row){
 if(!finite(row?.change))return {cls:'missing',label:'Noch kein Vergleich'};
 if(Math.abs(row.change)<.05)return {cls:'steady',label:'Unverändert'};
 if(row.pumpPossible)return {cls:'caution',label:'Pump möglich'};
 const desired=(row.goal==='up'?row.change>0:row.change<0);
 return {cls:desired?'good':'review',label:desired?'Günstige Richtung':'Gegenläufig'};
}
function headline(m){
 if(!m.latest)return {title:'Dein V-Taper startet hier',description:'Sobald eine vollständige Schulter- und Taillenmessung vorliegt, zeigt Compass hier deine persönliche Ausgangsform.'};
 if(!m.comparable)return {title:'Dein V-Taper startet hier',description:'Eine Schulter- und Taillenmessung ist vorhanden. Nach dem nächsten Wochen-Check-in wird die Veränderung sichtbar.'};
 if(m.direction==='improving')return {title:'Deine V-Proportion entwickelt sich positiv',description:`Die gemessene Schulter-Taille-Ratio liegt ${display(Math.abs(m.ratioPct),2)} % über dem ersten Check-in. ${m.lowConfidence?'Das ist ein früher Hinweis, noch kein gesicherter Körperform-Trend.':'Mehrere Messungen erlauben eine bessere Trendeinordnung, aber keinen direkten Beweis für Muskelzuwachs.'}`};
 if(m.direction==='decreasing')return {title:'Deine V-Proportion ist derzeit niedriger',description:'Diese Messwerte zeigen eine kleinere Schulter-Taille-Ratio. Trainingspump, Tageszeit und Messungenauigkeit mitberücksichtigen, bevor du den Plan änderst.'};
 return {title:'Deine V-Proportion ist bisher weitgehend stabil',description:'Der aktuelle Messunterschied ist klein. Bleib bei vergleichbaren Wochenmessungen, um die weitere Entwicklung zuverlässig sichtbar zu machen.'};
}
function metric141(m){
 const tone=evidenceTone141(m);
 const directionIcon=finite(m.change)?m.change>0?'↗':m.change<0?'↘':'→':'–';
 return `<div class="vt141-change ${tone.cls}"><div><strong>${esc(m.label)}</strong><small>${esc(tone.label)}</small></div><span>${finite(m.change)?`${directionIcon} ${esc(diff(m.change))} cm`:'–'}</span></div>`;
}
export function vtaperOverviewHtml141(m){
 const word=headline(m),first=m.first,last=m.latest;
 const change=finite(m.ratioPct)?`${diff(m.ratioPct,2)} %`:'–';
 const ratio=finite(m.ratioLatest)?display(m.ratioLatest,3):'–';
 const testability=m.pump?'Mindestens ein Smart-Tape-Check-in wurde nach einem Workout erfasst. Pump kann einzelne Umfänge beeinflussen.':m.lowConfidence?'Mit weniger als vier vergleichbaren Check-ins ist die Entwicklung noch vorläufig.':'Vergleich aus mehreren tatsächlichen Check-ins; Messfehler und Körperwasser bleiben möglich.';
 const ratioHint=m.comparable?`${display(m.ratioFirst,3)} → ${display(m.ratioLatest,3)} · ${fmtDay(first.day)} bis ${fmtDay(last.day)}`:'Schulter ÷ Taille · aus demselben Messtermin';
 const cards=[
  {label:'Training',value:m.trainingDays?`${m.trainingDays} Tage`:'–',detail:m.sets?`${m.sets} erfasste Sätze`:'Sätze noch nicht vollständig erfasst'},
  {label:'Gewicht',value:finite(m.weight.last)?`${display(m.weight.last)} kg`:'–',detail:finite(m.weight.delta)?`${diff(m.weight.delta)} kg im gewählten Zeitraum`:'Noch kein Gewichtsvergleich'},
  {label:'Körperfett (BIA)',value:finite(m.fat.last)?`${display(m.fat.last)} %`:'–',detail:finite(m.fat.delta)?`${diff(m.fat.delta)} Prozentpunkte, gerätegeschätzt`:'Noch kein BIA-Vergleich'},
  {label:'Ernährungsprotokoll',value:(m.proteinDays||m.kcalDays)?`${Math.max(m.proteinDays,m.kcalDays)} Tage`:'–',detail:`Protein ${m.proteinDays} · kcal ${m.kcalDays} Tage quantifizierbar`}
 ];
 return `<section class="vt141-dashboard" aria-label="V-Taper-Fortschritt zuerst, danach alle bisherigen Körper-Insights">
  <header class="vt141-header"><div><span class="vt141-kicker">COMPASS · DEINE TRANSFORMATION</span><h2>Dein V-Taper-Fortschritt</h2><p>Letzte zwei vollständige Smart-Tape-Check-ins · tägliche Körper- und Trainingsdaten als Kontext</p></div><span class="vt141-confidence">${m.lowConfidence?'Früher Vergleich':'Mehrere Check-ins'}</span></header>
  <div class="vt141-body">
   <div class="vt141-assessment">
    <span class="vt141-overline">SCHULTER / TAILLE</span>
    <div class="vt141-ratio-line"><strong class="vt141-ratio">${ratio}</strong><span class="vt141-ratio-change ${m.direction==='improving'?'positive':m.direction==='decreasing'?'negative':'neutral'}">${esc(change)}</span></div>
    <p class="vt141-dates">${esc(ratioHint)}</p>
    <h3>${esc(word.title)}</h3><p class="vt141-explainer">${esc(word.description)}</p>
    <div class="vt141-confidence-note"><span aria-hidden="true">◉</span><span>${esc(testability)}</span></div>
   </div>
   <div class="vt141-compare" aria-label="Vorher-Nachher-Vergleich auf Basis echter Smart-Tape-Umfänge">
    <div class="vt141-compare-head"><strong>Deine Silhouette</strong><small>Modellierte Proportionen</small></div>
    ${vtaperOverlayPanel143(first,last,{heightCm:m.heightCm,pump:m.pump})}
      </div>
  </div>
  <div class="vt141-lower"><div class="vt141-changes"><div class="vt141-section-title"><strong>Was hat sich verändert?</strong><small>Letzte zwei Check-ins</small></div><div class="vt141-changes-grid">${m.measures.map(metric141).join('')}</div></div>
   <div class="vt141-effort"><div class="vt141-section-title"><strong>Deine Beständigkeit</strong><small>Beobachtete Daten · kein Ziel-Score</small></div><div class="vt141-effort-grid">${cards.map(c=>`<div><small>${esc(c.label)}</small><strong>${esc(c.value)}</strong><span>${esc(c.detail)}</span></div>`).join('')}</div></div></div>
  <footer class="vt141-footer"><span aria-hidden="true">✦</span> <strong>Nächster Schritt:</strong> ${m.comparable?'Weiter regelmäßig morgens wiegen und wöchentlich vor dem Training messen. Erst nach weiteren vergleichbaren Check-ins sollte der Coach den längerfristigen Körperformtrend zur Trainingsplanung heranziehen.':'Smart-Tape-Umfänge wöchentlich erfassen; dann erscheint hier automatisch der erste Vorher-nachher-Vergleich.'} <span class="vt141-footer-detail">↓ Alle bisherigen Messwerte, Muskelgrafiken und Detailanalysen folgen darunter.</span></footer>
 </section>`;
}
