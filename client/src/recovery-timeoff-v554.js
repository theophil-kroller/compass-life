/** Compass 0.5.54: explainable, read-only time-off scenarios.
 * No changes to calendar, tasks, ZA, vacation balances, or health records.
 * Unknown workloads or unavailable calendar coverage are never called safe.
 */
import {proactivePlan} from './proactive-planner-v47.js';
import {remainingVacation,worktimeWeeks,workHM} from './worktime-v553.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayAfter=(s,n)=>new Date(Date.parse(`${s}T12:00:00Z`)+n*86400000).toISOString().slice(0,10);
const avg=a=>a.length?a.reduce((s,n)=>s+n,0)/a.length:null;
/** Signals are descriptions of time records, not a medical judgement. */
export function recoveryEvidence(work={},nights=[],today=new Date().toISOString().slice(0,10),threshold=45){
 const weeks=worktimeWeeks(work.days||[],Number(today.slice(0,4))).filter(w=>w.end<today);
 const recent=weeks.slice(-4),earlier=weeks.slice(-8,-4);
 const workAverage=avg(recent.map(w=>w.hours));
 const sleep=(Array.isArray(nights)?nights:[]).filter(n=>n?.day<=today&&Number.isFinite(n.sleepMinutes)&&n.sleepMinutes>0&&n.sleepMinutes<=900);
 const seven=dayAfter(today,-6),thirty=dayAfter(today,-30),before=dayAfter(today,-7);
 const recentSleep=sleep.filter(n=>n.day>=seven),earlierSleep=sleep.filter(n=>n.day>=thirty&&n.day<=before);
 const sleepCurrent=recentSleep.length>=4?avg(recentSleep.map(n=>n.sleepMinutes)):null;
 const sleepBaseline=earlierSleep.length>=10?avg(earlierSleep.map(n=>n.sleepMinutes)):null;
 const workElevated=recent.length>=3&&workAverage>=threshold;
 const sleepDown=sleepCurrent!=null&&sleepBaseline!=null&&sleepCurrent<sleepBaseline-30;
 return {workAverage,previousWorkAverage:earlier.length>=3?avg(earlier.map(w=>w.hours)):null,
  recentWeeks:recent.length,workElevated,sleepCurrent,sleepBaseline,recentNights:recentSleep.length,priorNights:earlierSleep.length,sleepDown,
  message:workElevated&&sleepDown?'Hohe dokumentierte Wochenstunden und zuletzt kürzere Schlafdauer. Ein Erholungstag kann eine sinnvolle Option sein.':
   workElevated?'Dokumentierte Wochenstunden zuletzt erhöht. Prüfe deinen subjektiven Erholungsbedarf.':
   sleepDown?'Gemessene Schlafdauer zuletzt kürzer. Es gibt nicht genug Hinweise, dies allein durch Arbeit zu erklären.':
   'Kein belastbarer gemeinsamer Hinweis auf erhöhten Erholungsbedarf aus den vorhandenen Daten. Ein freier Tag darf trotzdem sinnvoll sein.'};
}
/** Remove all working slots on the selected day, then rerun the identical deadline planner.
 * A shortfall already present in the baseline is not incorrectly attributed to the day off.
 */
export function recoveryCandidates(state,forecast,{kind='za',today=new Date().toISOString().slice(0,10),maxResults=5}={}){
 const work=state?.workTime||{};
 const hasAccount=kind==='za'?Number.isFinite(work.lastBalance?.hours):remainingVacation(work,today)!=null;
 const availableHours=kind==='za'?work.lastBalance?.hours:(remainingVacation(work,today)?.hours??null);
 const debit=Number(work.vacation?.hoursPerDay)||8;
 if(forecast?.status!=='ready')return {status:'unavailable',reason:'Kalenderdaten fehlen, sind unvollständig oder veraltet.',options:[],kind};
 if(!hasAccount)return {status:'unknown-balance',reason:'Guthaben noch nicht bestätigt oder eingelesen.',options:[],kind};
 if(availableHours<debit)return {status:'insufficient-balance',reason:`Für einen ganzen freien Tag werden ${debit} Stunden benötigt; das Guthaben reicht dafür nicht.`,options:[],kind};
 const base=proactivePlan(state,forecast);const baseRisks=new Map(base.shortfalls.map(x=>[x.task.id,x.remaining]));
 const planned=Array.isArray(state?.uiPreferences?.dailyPlanBlocks)?state.uiPreferences.dailyPlanBlocks:[];
 const options=(forecast.days||[]).filter(d=>d.day>today&&!d.off&&d.workMinutes>0&&d.minutes>=60).map(d=>{
  const slots=forecast.slots.filter(s=>s.day!==d.day);
  const clipped={...forecast,slots,days:forecast.days.map(x=>x.day===d.day?{...x,slots:[],minutes:0,workMinutes:0,off:true}:x),totalMinutes:slots.reduce((a,x)=>a+x.minutes,0)};
  const simulation=proactivePlan(state,clipped);
  const newRisks=simulation.shortfalls.filter(x=>x.remaining>(baseRisks.get(x.task.id)||0));
  const baselineRisk=base.shortfalls.length>0;
  const unknownCount=Math.max(base.unknownCount||0,simulation.unknownCount||0);
  const booked=planned.filter(x=>x.day===d.day&&!x.done);
  const rating=newRisks.length?'risk':unknownCount||baselineRisk||booked.length?'uncertain':'feasible';
  const lostMinutes=d.minutes;
  return {day:d.day,rating,blocked:newRisks.length,unknownCount,baselineRisk,alreadyPlanned:booked.length,
    newRisks:newRisks.slice(0,3).map(x=>({id:x.task.id,title:x.task.title,missing:x.remaining-(baseRisks.get(x.task.id)||0)})),
    lostMinutes,remainingHours:availableHours-debit,kind,needsApproval:true,
    reason:newRisks.length?`${newRisks.length} zusätzliche Fristkonflikte gegenüber der Planung ohne freien Tag.`:
     unknownCount?'Nicht alle fristgebundenen Aufgaben haben Aufwandsschätzungen.':
     baselineRisk?'Es bestehen bereits Fristkonflikte, auch ohne freien Tag.':
     booked.length?'Bereits vorgemerkte Arbeitsblöcke müssten umgeplant werden.':'Die bekannten geschätzten Aufgaben passen weiterhin in die verbleibenden Arbeitsfenster.'};
 }).sort((a,b)=>({'feasible':0,'uncertain':1,'risk':2}[a.rating]-{'feasible':0,'uncertain':1,'risk':2}[b.rating])||a.day.localeCompare(b.day)).slice(0,maxResults);
 return {status:'ready',kind,availableHours,debit,options,baselineRiskCount:base.shortfalls.length,unknownCount:base.unknownCount||0};
}
export function recoveryView(result,evidence,{kind='za',open=false}={}){
 const name=kind==='za'?'ZA':'Urlaub';const fmt=d=>new Intl.DateTimeFormat('de-AT',{weekday:'short',day:'numeric',month:'short'}).format(new Date(d+'T12:00:00'));
 const stateText={feasible:'Rechnerisch machbar',uncertain:'Noch prüfen',risk:'Fristgefährdung'};
 return `<details class="rec554" id="rec554-panel" ${open?'open':''}><summary>🌿 Freien Tag prüfen <span>ZA / Urlaub · Simulation</span></summary><div class="rec554-content">
 <p class="rec554-signal">${esc(evidence.message)}</p><div class="rec554-controls"><span>Was wäre, wenn ich einen Tag freinehme?</span><button type="button" data-action="rec554-kind" data-id="za" class="${kind==='za'?'selected':''}">ZA</button><button type="button" data-action="rec554-kind" data-id="vacation" class="${kind==='vacation'?'selected':''}">Urlaub</button></div>
 ${result.status!=='ready'?`<p class="rec554-caveat">${esc(result.reason)} Keine belastbaren Terminvorschläge möglich.</p>`:
 `<p class="rec554-balance">${name}-Guthaben: ${esc(workHM(result.availableHours))} · nach einem Tag rechnerisch ${esc(workHM(result.availableHours-result.debit))}</p>
 <div class="rec554-options">${result.options.map(o=>`<div class="rec554-option"><div><strong>${esc(fmt(o.day))}</strong><small>${esc(o.reason)}${o.newRisks.length?' · '+esc(o.newRisks.map(x=>x.title).join(', ')):''}</small></div><span class="rec554-rating rec554-${o.rating}">${stateText[o.rating]}</span></div>`).join('')||'<p class="muted-line">Keine geeigneten freien Arbeitstage innerhalb der nächsten 14 Tage gefunden.</p>'}</div>`}
 <p class="rec554-disclaimer">Unverbindliche Szenarien mit höchstens 80 % Tagesauslastung. Nur verlässlich geladener primärer Kalender und bekannte Aufwände. Work bleibt verfügbare Arbeitszeit. Keine Buchung, kein Guthabenabzug, keine Kalenderänderung oder Genehmigung. Gesundheitswerte sind keine Diagnose.</p></div></details>`;
}
