/** Compass 0.5.77.48 — Calendar-aware Capacity Guardian and micro-work packets.
 * Pure and local-first. Never creates calendar events or GTD tasks and never
 * declares a free slot unless Google Calendar coverage is complete and fresh.
 */
import {capacityGuardianModel,capacitySettings} from './capacity-guardian-v57747.js';
import {capacityForecast} from './capacity-engine-v44.js';
import {taskFriction} from './task-friction-v57715.js';
import {isActionAvailable} from './tasks.js';

const DAY=/^\d{4}-\d{2}-\d{2}$/;
const esc=x=>String(x??'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
const fmt=(v,n=0)=>Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:n}):'–';
const stamp=x=>new Date(x).toLocaleDateString('de-AT',{day:'numeric',month:'short',weekday:'short'});
const clock=x=>new Date(x).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'});
const stampTime=x=>`${stamp(x)} · ${clock(x)}`;
const validTaskId=id=>typeof id==='string'&&id.length>0&&id.length<=128&&!/[<>"']/.test(id);
const clamp=(value,lo,hi)=>Number.isSafeInteger(value)&&value>=lo&&value<=hi;
const prefsFor=s=>s?.uiPreferences?.capacityGuardian||{};
export function workPacketSettings(state){
 const x=prefsFor(state)?.packets;
 if(!x||typeof x!=='object'||Array.isArray(x))return {};
 const out={};for(const [id,v] of Object.entries(x)){
  if(!validTaskId(id)||!v||typeof v!=='object')continue;
  const count=v.count==null?null:Number(v.count),unitMinutes=v.unitMinutes==null?null:Number(v.unitMinutes),blockMinutes=Number(v.blockMinutes);
  if(count!==null&&!clamp(count,1,10000))continue;
  if(unitMinutes!==null&&!clamp(unitMinutes,1,240))continue;
  if(!clamp(blockMinutes,15,180))continue;
  out[id]={count,unitMinutes,blockMinutes};
 }
 return out;
}
/** Private Vault preferences only, preserving estimates and 0.5.77.47 settings. */
export function saveWorkPacketSettings(state,inputs={}){
 if(!state||typeof state!=='object')throw Error('Tresor muss entsperrt sein.');
 const current=workPacketSettings(state),next={...current};
 for(const [id,raw] of Object.entries(inputs||{})){
  if(!validTaskId(id)||!state.tasks?.[id])continue;
  const count=raw?.count===''||raw?.count==null?null:Number(raw.count);
  const unitMinutes=raw?.unitMinutes===''||raw?.unitMinutes==null?null:Number(raw.unitMinutes);
  const blockMinutes=raw?.blockMinutes===''||raw?.blockMinutes==null?45:Number(raw.blockMinutes);
  if(count!==null&&!clamp(count,1,10000))throw Error('Anzahl: 1 bis 10.000.');
  if(unitMinutes!==null&&!clamp(unitMinutes,1,240))throw Error('Minuten je Einheit: 1 bis 240.');
  if(!clamp(blockMinutes,15,180))throw Error('Arbeitsblock: 15 bis 180 Minuten.');
  if(count===null&&unitMinutes===null&&blockMinutes===45)delete next[id];
  else next[id]={count,unitMinutes,blockMinutes};
 }
 state.uiPreferences??={};state.uiPreferences.capacityGuardian??={};
 state.uiPreferences.capacityGuardian.packets=next;
 return next;
}
export function remainingWork(state,t){
 const custom=workPacketSettings(state)[t.id]||{},pref=capacitySettings(state);
 const target=Number(t.progressTarget),current=Number(t.progressCurrent);
 const counter=Number.isSafeInteger(target)&&target>0&&Number.isSafeInteger(current)&&current>=0&&current<=target;
 const count=counter?target-current:custom.count;
 const unitMinutes=custom.unitMinutes;
 const computed=count!==null&&count!==undefined&&unitMinutes!==null&&unitMinutes!==undefined?count*unitMinutes:null;
 const estimate=Number(pref.estimates[t.id]);
 const known=computed!==null?computed:Number.isFinite(estimate)&&estimate>0?estimate:null;
 return {task:t,remainingCount:count,unitMinutes,minutes:known,blockMinutes:custom.blockMinutes||45,counter,custom};
}
/** Align the earlier 0.5.77.47 deadline risk display with explicit unit-based work.
 * This is a read-only facade; task and guardian settings are never mutated.
 */
export function effectiveCapacityState748(state){
 const guardian=capacitySettings(state),estimates={...guardian.estimates};
 for(const t of Object.values(state?.tasks||{})){
  if(!validTaskId(t?.id||''))continue;
  const w=remainingWork(state,t);
  if(Number.isSafeInteger(w.remainingCount)&&Number.isSafeInteger(w.unitMinutes)&&w.minutes!==null)
   estimates[t.id]=w.minutes;
 }
 return {...state,uiPreferences:{...state?.uiPreferences,capacityGuardian:{...prefsFor(state),estimates}}};
}
const hasValidDay=d=>DAY.test(d||'')&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
function actionable(state,t,today){
 return t&&!t.completed&&!t.archived&&!state?.projects?.[t.projectId]?.isTemplate&&validTaskId(t.id||'')&&
 (t.workflow||'next')==='next'&&(!t.deferUntil||t.deferUntil<=today)&&
 (!t.projectId||state.projects?.[t.projectId]?.status!=='hold')&&
 (!t.parentTaskId||!state.tasks?.[t.parentTaskId]?.archived);
}
const frictionHint=t=>{
 const f=taskFriction(t.note||'');
 if(f.blocker==='unclear')return 'Vorbereitung: kleinsten nächsten Schritt formulieren';
 if(f.blocker==='unpleasant')return 'Einstieg: zuerst eine kurze, konkrete Kontaktaufnahme';
 if(f.overcoming==='high')return 'Einstiegshürde hoch: kleinen Startblock wählen';
 return '';
};
/** A calendar slot is only a *candidate*: no booking, and budget limits still apply.
 * Earliest-deadline-first; a task without effort estimate cannot silently disappear.
 */
export function capacityCalendarModel(state,{today,now=new Date(),calendarEvents=[],calendarCoverage=null,calendarUpdatedAt=0,calendarConnected=false}={}){
 const day=hasValidDay(today)?today:new Date().toLocaleDateString('sv-SE');
 const base=capacityGuardianModel(effectiveCapacityState748(state),{today:day}),focus=capacitySettings(state),settings=state?.uiPreferences?.capacity||{};
 const forecast=capacityForecast({events:calendarEvents,coverage:calendarCoverage,connected:calendarConnected,updatedAt:calendarUpdatedAt,now,startDay:day,days:15,settings});
 const to=base.to;
 const tasks=Object.values(state?.tasks||{}).filter(t=>actionable(state,t,day)&&(t.flagged||hasValidDay(t.dueDate)&&t.dueDate<=to))
  .filter(t=>!t.dueDate||t.dueDate>=day||t.flagged)
  .sort((a,b)=>(a.dueDate||'9999-12-31').localeCompare(b.dueDate||'9999-12-31')||Number(!!b.flagged)-Number(!!a.flagged)||String(a.title||'').localeCompare(String(b.title||''),'de'))
  .slice(0,50);
 const work=tasks.map(t=>remainingWork(state,t));
 const unknown=work.filter(w=>w.minutes===null),known=work.filter(w=>w.minutes!==null&&w.minutes>0);
 const nonReady=forecast.status!=='ready';
 const usable=focus.weeklyFocusHours!==null && focus.weeklyFocusHours>0 && !nonReady;
 // Set a safe upper bound independently of how much free calendar time exists.
 const dailyCap=usable?Math.floor(focus.weeklyFocusHours*60*(1-focus.reservePct/100)/(forecast.settings.weekends?7:5)):null;
 const capUsed=new Map(),cursor=new Map(),plans=[],unscheduled=[];
 // The shared capacity engine reports opaque all-day blocks separately; its
 // slots may still include those dates. Treat any such date as fully blocked.
 const opaqueAllDay=new Set((forecast.days||[]).filter(d=>d.allDayBusy>0).map(d=>d.day));
 if(usable&&dailyCap>=1){
  for(const w of known){
   let remain=w.minutes,itemsLeft=(Number.isSafeInteger(w.remainingCount)&&Number.isSafeInteger(w.unitMinutes)&&w.unitMinutes>0)?w.remainingCount:null;
   for(const slot of forecast.slots){
    if(remain<=0||plans.length>=80)break;
    if(opaqueAllDay.has(slot.day))continue;
    if(w.task.dueDate&&slot.day>w.task.dueDate)break;
    if(!isActionAvailable(state,w.task,slot.day))continue;
    let a=Math.max(slot.start,cursor.get(slot)||slot.start);
    const used=capUsed.get(slot.day)||0,dayLeft=dailyCap-used;
    const span=Math.floor((slot.end-a)/60000),max=Math.min(remain,span,dayLeft,w.blockMinutes);
    if(max<=0)continue;
    let minutes=max,count=null;
    if(itemsLeft!==null){
     count=Math.min(itemsLeft,Math.floor(max/w.unitMinutes));
     if(count<=0)continue;
     minutes=count*w.unitMinutes;
    }
    if(minutes<=0)continue;
    const end=a+minutes*60000;
    plans.push({taskId:w.task.id,title:w.task.title||'Aufgabe',category:w.task.category||'',day:slot.day,start:a,end,minutes,count,unitMinutes:w.unitMinutes,dueDate:w.task.dueDate||null,friction:frictionHint(w.task)});
    cursor.set(slot,end);capUsed.set(slot.day,used+minutes);
    remain-=minutes;if(itemsLeft!==null)itemsLeft-=count;
   }
   if(remain>0)unscheduled.push({task:w.task,minutes:remain,units:itemsLeft});
  }
 }else unscheduled.push(...known.map(w=>({task:w.task,minutes:w.minutes,units:w.remainingCount})));
 return {today:day,forecast,focus,dailyCap,known,unknown,plans,unscheduled,settings,base,upcoming:tasks,requiresCalendarRefresh:nonReady,status:forecast.status};
}
const detail=status=>({disconnected:'Google Calendar ist nicht verbunden oder nicht freigegeben.',partial:'Die Kalenderabdeckung für die nächsten 15 Tage ist unvollständig.',stale:'Dein letzter Kalenderabgleich ist älter als zwei Stunden.',ready:'Termine wurden für die betrachteten Tage vollständig und kürzlich abgeglichen.'})[status]||'Kalenderdaten nicht verfügbar.';
export function capacityCalendarView(state,options={}){
 const m=capacityCalendarModel(state,options),color=m.status==='ready'?'good':'unknown';
 const card=(label,n,sub)=>`<div class="cap748-stat"><span>${esc(label)}</span><strong>${esc(n)}</strong><small>${esc(sub)}</small></div>`;
 const planned=m.plans.reduce((a,p)=>a+p.minutes,0),unplanned=m.unscheduled.reduce((a,p)=>a+p.minutes,0);
 const examples=m.upcoming.filter(t=>t.category==='Pruefungen'||t.category==='Forschung'||t.flagged).slice(0,12);
 const workSettings=workPacketSettings(state);
 const packetRows=examples.map(t=>{
  const x=remainingWork(state,t),v=workSettings[t.id]||{};
  return `<div class="cap748-edit-row"><div class="cap748-task-title"><strong>${esc(t.title)}</strong><small>${esc(t.category||'Aufgabe')}${t.dueDate?' · Frist '+esc(t.dueDate):' · markiert'}${x.counter?' · '+x.remainingCount+' von '+t.progressTarget+' offen':''}</small></div><label>Einheiten<input type="number" name="packet:${esc(t.id)}:count" min="1" max="10000" step="1" inputmode="numeric" value="${v.count??''}" placeholder="${x.counter?'GTD-Zähler':'z. B. 60'}" ${x.counter?'disabled title="Wird vom GTD-Fortschrittszähler übernommen"':''}/></label><label>Min./Einheit<input type="number" name="packet:${esc(t.id)}:unitMinutes" min="1" max="240" step="1" inputmode="numeric" value="${v.unitMinutes??''}" placeholder="z. B. 8"/></label><label>Blocklänge<input type="number" name="packet:${esc(t.id)}:blockMinutes" min="15" max="180" step="5" inputmode="numeric" value="${v.blockMinutes??45}"/></label></div>`;
 }).join('');
 const slotHtml=m.plans.slice(0,35).map((p,i)=>`<div class="cap748-slot"><div class="cap748-when"><strong>${esc(stampTime(p.start))}</strong><span>bis ${esc(clock(p.end))} · ${p.minutes} Min.</span></div><div class="cap748-task"><strong>${esc(p.title)}</strong><small>${p.count!==null?`${p.count} Einheiten · `:''}${esc(p.category||'Aufgabe')}${p.friction?' · '+esc(p.friction):''}</small></div><span class="cap748-seq">${i+1}</span></div>`).join('');
 const warnings=m.status!=='ready'?`<div class="cap748-alert"><strong>Keine bestätigten freien Zeitfenster</strong><p>${esc(detail(m.status))} Compass zeigt deshalb keine konkreten Termine an.</p><button type="button" class="secondary-btn" data-action="cap748-calendar-refresh">Kalender verbinden / aktualisieren</button></div>`:m.dailyCap===null?`<div class="cap748-alert"><strong>Fokusbudget noch nicht festgelegt</strong><p>Oben zuerst ein realistisches Wochenbudget speichern. Kalenderlücken allein sind keine verfügbare Arbeitskapazität.</p></div>`:'';
 return `<section class="cap748-shell" aria-label="Kalendergestützte Wochenplanung"><header><div><span class="cap748-kicker">RELAXED CONTROL · CALENDAR REALITY</span><h2>Termine &amp; machbare Arbeitsblöcke</h2><p>Prüfungskorrekturen, Dissertation und andere unangenehme Aufgaben in konkrete Schritte zerlegen, ohne bereits belegte Kalenderzeiten zu verplanen.</p></div><span class="cap748-status ${color}">${esc(m.status==='ready'?'Kalender überprüft':'Kalenderstand unsicher')}</span></header>
 <div class="cap748-stats">${card('Kalenderdaten',m.status==='ready'?'aktuell':'ungeprüft',m.forecast.source)}${card('Dokumentierter Aufwand',m.known.length,`${m.unknown.length} weitere Aufgabe(n) ohne Schätzung`)}${card('Zeitvorschläge',m.plans.length,`${fmt(planned)} Min. unverbindlich`)}${card('Noch nicht eingeplant',m.unscheduled.length,unplanned?`${fmt(unplanned)} Min. offener bekannter Aufwand`:'Keine weiteren geschätzten Aufgaben')}</div>
 <p class="cap748-source">${esc(detail(m.status))}${m.status==='ready'?` Zuletzt abgeglichen: ${esc(new Date(options.calendarUpdatedAt).toLocaleString('de-AT'))}.`:' Keine Annahme von „frei“ allein aus fehlenden Ereignissen.'}</p>
 <section class="cap748-config"><h3>Aufgaben in kleine Pakete zerlegen</h3><p>Zum Beispiel: <strong>60 Prüfungskorrekturen × 8 Minuten = 480 Minuten</strong>, verteilt auf überschaubare 40–50-Minuten-Blöcke. Wenn deine GTD-Aufgabe einen Fortschrittszähler hat, verwendet Compass automatisch die <em>noch offenen</em> Einheiten.</p><form id="cap748-packets-form"><div class="cap748-edit-list">${packetRows||'<p>Aktuell keine passenden offenen Forschungs-, Lehr- oder markierten Aufgaben in diesem Fristenfenster.</p>'}</div><button class="primary-btn" type="submit">Arbeitspakete speichern</button></form></section>
 ${warnings}
 <section class="cap748-schedule"><div class="cap748-section-head"><h3>Vorgeschlagene Zeitfenster</h3><span>Kein Kalendereintrag wird erstellt</span></div>${slotHtml||'<p class="cap748-empty">Noch keine seriösen Terminvorschläge möglich. Kalender aktualisieren, Fokusbudget und erforderlichen Aufwand ergänzen.</p>'}${m.unscheduled.length?`<p class="cap748-unplanned">${m.unscheduled.length} Aufgabe(n) mit bekanntem Restaufwand passen noch nicht in die ausgewiesenen Slots oder liegen vor einer zu nahen Frist. Das ist ein Planungshinweis, keine Prognose über deine Leistungsfähigkeit.</p>`:''}</section>
 ${m.unknown.length?`<p class="cap748-empty">Für ${m.unknown.length} weitere Aufgabe(n) fehlt eine Aufwandsschätzung. Sie sind nicht als erledigt oder als null Aufwand eingerechnet.</p>`:''}
 <p class="cap748-footnote">Quellen: aktuelle GTD-Fristen und von dir eingegebenes Fokusbudget; Google-Calendar-Zeiten nur bei vollständiger Abdeckung und Aktualisierung innerhalb von zwei Stunden. Garmin-/Fitdays-Messwerte werden nicht zur Einschätzung deiner heutigen Belastbarkeit benutzt. Keine automatische Terminbuchung und keine Aufgabenerstellung.</p></section>`;
}
