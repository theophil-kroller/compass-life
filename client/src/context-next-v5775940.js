/** Context Intelligence Phase 2 (.59.40): explainable, on-demand recommendations.
 * No GPS access, network requests, calendar promises, background work or task mutations.
 * Scores are advisory only. Only explicitly available GTD Next Actions can appear.
 */
import {nextActions,localDate} from './tasks.js';
import {goalsForProject} from './life-intelligence-v22.js';
import {effectiveContext39} from './location-context-v5775939.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const placeTags={home:['home','zuhause','daheim','wohnung','heim'],work:['work','arbeit','büro','buero','office','uni','tu','tu-graz'],away:['away','unterwegs','mobil','errands','erledigungen','telefon','einkaufen']};
const placeLabels={home:'Zuhause',work:'Arbeit',away:'Unterwegs',unknown:'ohne verlässlichen Standort'};
export const ENERGY40=['offen','low','medium','high'];
export const MINUTES40=[15,30,60,120];
const isoDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const delta=(a,b)=>Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000);
export function contextTagKind40(tag){const t=String(tag||'').replace(/^@/,'').toLocaleLowerCase('de').trim();return Object.keys(placeTags).find(k=>placeTags[k].includes(t))||null;}
export function taskPlace40(task){const places=[...new Set((Array.isArray(task?.contextTags)?task.contextTags:[]).map(contextTagKind40).filter(Boolean))];return places;}
export function recommendationPreferences40(state){
 const prefs=state?.uiPreferences||{};
 return {minutes:MINUTES40.includes(Number(prefs.dailyMinutes))?Number(prefs.dailyMinutes):60,
 energy:ENERGY40.includes(prefs.dailyEnergy)?prefs.dailyEnergy:'offen'};
}
export function feedback40(state){const raw=state?.contextRecommendations40?.dismissed;return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};}
export function dismissTask40(state,taskId,day=localDate()){
 if(!state?.tasks?.[taskId]||!isoDate(day))return false;
 state.contextRecommendations40??={};state.contextRecommendations40.dismissed??={};
 const until=new Date(day+'T12:00:00Z');until.setUTCDate(until.getUTCDate()+7);
 state.contextRecommendations40.dismissed[taskId]=until.toISOString().slice(0,10);
 // Retain only recent bounded feedback; don't fill the vault with abandoned task IDs.
 const all=Object.entries(state.contextRecommendations40.dismissed).filter(([id,expiry])=>state.tasks[id]&&isoDate(expiry)&&expiry>=day).sort((a,b)=>b[1].localeCompare(a[1]));
 state.contextRecommendations40.dismissed=Object.fromEntries(all.slice(0,80));return true;
}
export function recommendNext40(state,{day=localDate(),context=null,minutes=null,energy=null,limit=3}={}){
 if(!isoDate(day))throw Error('Ungültiges Tagesdatum');
 const preferred=recommendationPreferences40(state);
 const budget=MINUTES40.includes(Number(minutes))?Number(minutes):preferred.minutes;
 const power=ENERGY40.includes(energy)?energy:preferred.energy;
 const kind=context??effectiveContext39(state).kind;
 const available=nextActions(state,day),dismissed=feedback40(state);
 const scored=[];let skippedTime=0,skippedPlace=0,skippedFeedback=0;
 for(const task of available){
  if(isoDate(dismissed[task.id])&&dismissed[task.id]>=day){skippedFeedback++;continue;}
  const places=taskPlace40(task),reasons=[];
  const match=places.includes(kind),otherPlace=places.length>0&&!match;
  // An explicitly incompatible place should never be represented as executable here.
  // With unknown location, recommendations remain usable but avoid place-specific actions.
  if(otherPlace||(kind==='unknown'&&places.length)){skippedPlace++;continue;}
  const effort=Number(task.estimateMinutes);
  if(Number.isFinite(effort)&&effort>budget){skippedTime++;continue;}
  let score=0;
  if(match){score+=26;reasons.push(`Passt zu ${placeLabels[kind]}`);}
  else if(!places.length)reasons.push('Ortsunabhängig');
  if(task.dueDate&&isoDate(task.dueDate)){
   const days=delta(day,task.dueDate);
   if(days<0){score+=65;reasons.push('Frist überschritten');}
   else if(days===0){score+=60;reasons.push('Frist heute');}
   else if(days<=2){score+=43;reasons.push(`Frist in ${days} Tag(en)`);}
   else if(days<=7){score+=25;reasons.push('Frist diese Woche');}
  }
  if(task.flagged){score+=20;reasons.push('Markiert');}
  if(task.plannedDate===day){score+=14;reasons.push('Für heute vorgesehen');}
  if(task.projectId&&goalsForProject(state,task.projectId).length){score+=12;reasons.push('Aktives Ziel');}
  if(Number.isFinite(effort)&&effort>0){score+=Math.max(0,10-Math.round(effort/20));reasons.push(`${effort} Minuten geschätzt`);}
  else reasons.push('Dauer unbekannt');
  const tagged=(Array.isArray(task.contextTags)?task.contextTags:[]).find(x=>/^energy-(low|medium|high)$/.test(x));
  if(power!=='offen'){
   if(tagged==='energy-'+power){score+=13;reasons.push('Passt zur angegebenen Energie');}
   else if(tagged){score-=14;reasons.push('Energiebedarf abweichend');}
  }
  scored.push({task,score,reasons});
 }
 scored.sort((a,b)=>b.score-a.score||Number(!!b.task.flagged)-Number(!!a.task.flagged)||String(a.task.title).localeCompare(String(b.task.title),'de'));
 return {items:scored.slice(0,Math.max(1,Math.min(3,limit))),total:scored.length,skippedTime,skippedPlace,skippedFeedback,kind,minutes:budget,energy:power};
}
export function contextNextPanel40(state,{day=localDate(),context=null}={}){
 const picks=recommendNext40(state,{day,context});
 const hint=picks.kind==='unknown'?'Standort nicht eindeutig – nur ortsunabhängige Aufgaben.':`Aktueller Kontext: ${placeLabels[picks.kind]}.`;
 const filters=`<div class="ctx40-filters"><span>Zeit</span>${MINUTES40.map(m=>`<button type="button" data-action="ctx40-minutes" data-id="${m}" aria-pressed="${m===picks.minutes}">${m}′</button>`).join('')}<span>Energie</span>${ENERGY40.map(e=>`<button type="button" data-action="ctx40-energy" data-id="${e}" aria-pressed="${e===picks.energy}">${{offen:'Offen',low:'Wenig',medium:'Mittel',high:'Viel'}[e]}</button>`).join('')}</div>`;
 const cards=picks.items.map((r,i)=>`<div class="ctx40-item"><span class="ctx40-rank">${i+1}</span><div class="ctx40-item-text"><strong>${esc(r.task.title)}</strong><small>${esc(r.reasons.slice(0,3).join(' · '))}</small></div><button type="button" class="ctx40-open" data-action="ctx40-task" data-id="${esc(r.task.id)}" aria-label="Aufgabe ${esc(r.task.title)} öffnen">Ansehen</button><button type="button" class="ctx40-skip" data-action="ctx40-skip" data-id="${esc(r.task.id)}" title="Vorschlag für sieben Tage ausblenden" aria-label="Vorschlag ${esc(r.task.title)} sieben Tage ausblenden">×</button></div>`).join('');
 return `<section class="ctx40" aria-label="Kontextabhängige Next-Action-Empfehlungen"><header><div><strong>✦ Was passt jetzt?</strong><small>${esc(hint)}</small></div><button type="button" data-action="ctx40-toggle" aria-label="Empfehlungen schließen" title="Schließen">×</button></header>${filters}<div class="ctx40-items">${cards||'<p>Keine passende ausführbare Aktion für diesen Ort, diese Zeit und Energie. Filter anpassen oder Next Actions öffnen.</p>'}</div><footer><small>${picks.skippedPlace} anderer Ort · ${picks.skippedTime} Zeitbudget · ${picks.skippedFeedback} ausgeblendet. Freie Kalenderzeit ist damit nicht bestätigt.</small>${Object.keys(feedback40(state)).length?'<button type="button" data-action="ctx40-reset">Ausgeblendete zurücksetzen</button>':''}</footer><p class="ctx40-note">Nur Vorschläge. Keine automatische Planung, keine neuen Deadlines und keine Änderungen an deiner Aufgabenpriorität.</p></section>`;
}
