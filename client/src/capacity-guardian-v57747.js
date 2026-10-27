/** Compass 0.5.77.47 — Deadline & Capacity Guardian, local/read-only model.
 * No claims of available calendar slots, current wellbeing, or task completion.
 * Required effort and focus budget come ONLY from explicit user inputs.
 */
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayValid=d=>DAY.test(d||'')&&Number.isFinite(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
const between=(a,b)=>Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);
const human=d=>new Date(d+'T12:00:00Z').toLocaleDateString('de-AT',{day:'numeric',month:'short',weekday:'short'});
const num=(v,d=1)=>Number.isFinite(v)?v.toLocaleString('de-AT',{maximumFractionDigits:d}):'–';
const hrs=v=>Number.isFinite(v)?`${num(v/60)} h`:'–';
const idSafe=v=>typeof v==='string'&&v.length>0&&v.length<=128&&!/[<>"']/g.test(v);
const weekday=d=>{const x=new Date(d+'T12:00:00Z').getUTCDay();return x>0&&x<6;};
const planDays=(a,b)=>{let n=0;for(let i=0;i<=Math.min(28,between(b,a));i++)if(weekday(shift(a,i)))n++;return n;};
const categories={Forschung:'Forschung / Doktorat',Lehre:'Lehre',Pruefungen:'Prüfungskorrekturen',Verwaltung:'Verwaltung',Familie:'Familie',Allgemein:'Sonstiges'};
const prefOf=s=>s?.uiPreferences?.capacityGuardian||{};
export function capacitySettings(state){
 const raw=prefOf(state),weeklyFocusHours=Number(raw.weeklyFocusHours),reservePct=Number(raw.reservePct);
 const focus=raw.weeklyFocusHours!==null&&raw.weeklyFocusHours!==undefined&&raw.weeklyFocusHours!==''&&Number.isFinite(weeklyFocusHours)&&weeklyFocusHours>=0&&weeklyFocusHours<=40?weeklyFocusHours:null;
 const reserve=Number.isFinite(reservePct)&&reservePct>=0&&reservePct<=60?reservePct:20;
 return {weeklyFocusHours:focus,reservePct:reserve,estimates:raw.estimates&&typeof raw.estimates==='object'?raw.estimates:{}};
}
/** Save draft budget + per-task effort into the private, encrypted vault state.
 * No calendar events, automatic scheduling, or task deadlines are modified.
 */
export function saveCapacitySettings(state,{focusHours='',reservePct=20,estimates={}}={}){
 if(!state||typeof state!=='object')throw Error('Tresor muss entsperrt sein.');
 const n=focusHours===''||focusHours==null?null:Number(focusHours),reserve=Number(reservePct);
 if(n!==null&&(!Number.isFinite(n)||n<0||n>40))throw Error('Fokusbudget: 0 bis 40 Stunden pro Woche.');
 if(!Number.isFinite(reserve)||reserve<0||reserve>60)throw Error('Puffer: 0 bis 60 Prozent.');
 const prev=capacitySettings(state),next={...prev.estimates};
 for(const [id,v] of Object.entries(estimates)){
  if(!idSafe(id)||!state.tasks?.[id])continue;
  if(v===''||v===null||v===undefined){delete next[id];continue;}
  const hours=Number(v);
  if(!Number.isFinite(hours)||hours<=0||hours>120)throw Error('Schätzzeit pro Aufgabe: größer 0 bis 120 Stunden.');
  next[id]=Math.round(hours*60);
 }
 state.uiPreferences??={};
 state.uiPreferences.capacityGuardian={weeklyFocusHours:n,reservePct:reserve,estimates:next};
 return state.uiPreferences.capacityGuardian;
}
export function capacityGuardianModel(state,{today,days=14}={}){
 const now=dayValid(today)?today:new Date().toLocaleDateString('sv-SE');
 const horizon=Math.max(7,Math.min(30,Math.floor(Number(days)||14))),to=shift(now,horizon);
 const prefs=capacitySettings(state);
 const tasks=Object.values(state?.tasks||{}).filter(t=>t&&idSafe(t.id||'')&&!t.completed&&!t.archived&&!state?.projects?.[t.projectId]?.isTemplate);
 const due=tasks.filter(t=>dayValid(t.dueDate)&&t.dueDate<=to).sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||String(a.title||'').localeCompare(String(b.title||''),'de'));
 const overdue=due.filter(t=>t.dueDate<now),future=due.filter(t=>t.dueDate>=now);
 const getEstimate=t=>Number.isFinite(prefs.estimates[t.id])&&prefs.estimates[t.id]>0?prefs.estimates[t.id]:null;
 const known=future.filter(t=>getEstimate(t)!==null),unknown=future.filter(t=>getEstimate(t)===null);
 const totalKnownMinutes=known.reduce((s,t)=>s+getEstimate(t),0);
 const dailyBudget=prefs.weeklyFocusHours===null?null:(prefs.weeklyFocusHours*60/5)*(1-prefs.reservePct/100);
 const weekdays=planDays(shift(now,1),to),totalCapacity=dailyBudget===null?null:dailyBudget*weekdays;
 const milestones=Object.values(state?.projects||{}).filter(p=>p&&!p.isTemplate&&p.kind!=='folder'&&p.status==='active'&&dayValid(p.dueDate)&&p.dueDate<=to).sort((a,b)=>a.dueDate.localeCompare(b.dueDate));
 const checklist=future.map(t=>{
  const candidates=future.filter(x=>x.dueDate<=t.dueDate),need=candidates.reduce((s,x)=>s+(getEstimate(x)||0),0);
  const capacity=dailyBudget===null?null:dailyBudget*planDays(shift(now,1),t.dueDate);
  const missing=candidates.filter(x=>getEstimate(x)===null).length;
  const status=capacity===null?'budget_missing':need>capacity+1e-7?'overbooked':missing?'incomplete':'within_estimate';
  return {task:t,estimate:getEstimate(t),cumulativeKnown:need,remainingCapacity:capacity,unknownCount:missing,status};
 });
 const problems=checklist.filter(x=>x.status==='overbooked');
 const unscheduled=tasks.filter(t=>!dayValid(t.dueDate)&&t.flagged).slice(0,7);
 const plan=Array.from({length:horizon},(_,i)=>shift(now,i+1)).filter(weekday).slice(0,8).map(d=>({day:d,minutes:dailyBudget}));
 return {today:now,to,prefs,overdue,future,milestones,checklist,known,unknown,totalKnownMinutes,dailyBudget,totalCapacity,weekdays,problems,unscheduled,plan,source:'GTD-Aufgaben, Projekte und von dir eingegebenes Fokusbudget',isEstimated:prefs.weeklyFocusHours!==null};
}
const tone=status=>status==='overbooked'?'risk':status==='within_estimate'?'good':'unknown';
const pill=(label,t)=>`<span class="cap747-pill ${t}">${esc(label)}</span>`;
export function capacityGuardianView(state,{today}={}){
 const m=capacityGuardianModel(state,{today}),p=m.prefs;
 const card=(k,v,sub)=>`<article class="cap747-kpi"><span>${esc(k)}</span><strong>${esc(v)}</strong><small>${esc(sub)}</small></article>`;
 const tags=m.problems.length?pill(`${m.problems.length} Kapazitätswarnung(en)`,'risk'):m.unknown.length?pill(`${m.unknown.length} Aufwandsschätzung(en) fehlen`,'unknown'):pill('GTD-Fristen geprüft','good');
 const timeCell=t=>{const n=p.estimates[t.id];return `<label class="cap747-est-cell"><input name="estimate:${esc(t.id)}" type="number" step="0.25" min="0.25" max="120" inputmode="decimal" value="${Number.isFinite(n)?num(n/60,2).replace(',','.'):''}" aria-label="Geschätzter Aufwand in Stunden für ${esc(t.title||'Aufgabe')}"/><span>h</span></label>`;};
 const deadlineRow=x=>`<div class="cap747-task"><div class="cap747-task-main"><strong>${esc(x.task.title||'Unbenannte Aufgabe')}</strong><span>${esc(categories[x.task.category]||x.task.category||'Aufgabe')} · ${esc(human(x.task.dueDate))}</span></div>${timeCell(x.task)}<div class="cap747-flag">${x.status==='overbooked'?pill('Puffer reicht rechnerisch nicht','risk'):x.status==='incomplete'?pill('Weitere Schätzungen fehlen','unknown'):x.status==='budget_missing'?pill('Fokusbudget fehlt','unknown'):pill('Rechnerisch im Rahmen','good')}</div></div>`;
 return `<section class="cap747-shell" aria-label="Deadline und Kapazitätsplanung">
 <header class="cap747-header"><div><div class="cap747-kicker">RELAXED CONTROL · FORWARD INTELLIGENCE</div><h2>Fristen &amp; Kapazität</h2><p>Was steht an – und wie viel davon lässt sich mit deinem <em>selbst gewählten</em> Fokusbudget voraussichtlich bearbeiten?</p></div>${tags}</header>
 <div class="cap747-kpis">${card('Offen / überfällig',String(m.overdue.length),'GTD-Fristen vor heute')}${card('Nächste 14 Tage',String(m.future.length),'Offene Aufgaben mit Fälligkeit')}${card('Geschätzter Aufwand',hrs(m.totalKnownMinutes),`${m.known.length}/${m.future.length} Aufgaben geschätzt`)}${card('Planungskapazität',hrs(m.totalCapacity),m.isEstimated?`${m.weekdays} Werktage · ${p.reservePct} % Puffer`:'Bitte Fokusbudget angeben')}</div>
 <section class="cap747-config"><div class="cap747-section-top"><h3>Dein geschütztes Fokusbudget</h3><span>Manuelle Annahmen · keine Kalenderbuchung</span></div><p>Trage ein, wie viele Stunden du pro Woche <strong>realistisch und ohne Überlastung</strong> für konzentrierte Aufgaben reservieren möchtest. Die Verteilung auf Werktage dient nur der Vorschau.</p>
 <form id="cap747-form"><div class="cap747-form-head"><label>Fokusstunden pro Woche <input type="number" name="focusHours" value="${p.weeklyFocusHours===null?'':p.weeklyFocusHours}" min="0" max="40" step="0.5" inputmode="decimal" placeholder="noch offen"/></label><label>Sicherheitsreserve <input type="number" name="reservePct" value="${p.reservePct}" min="0" max="60" step="5" inputmode="numeric"/><span> %</span></label><button type="submit" class="primary-btn">Schätzungen speichern</button></div>
 <div class="cap747-list-head"><h3>Aufgaben und Schätzungen</h3><span>Je Aufgabe einmal Stunden eintragen oder korrigieren</span></div>
 ${m.future.length?`<div class="cap747-tasks">${m.checklist.map(deadlineRow).join('')}</div>`:'<p class="cap747-empty">Keine offenen GTD-Aufgaben mit Frist in den nächsten 14 Tagen erfasst.</p>'}
 </form><p class="cap747-note">Eine grüne Kennzeichnung bedeutet nur: Der <strong>geschätzte</strong> Aufwand passt rechnerisch zum eingegebenen Budget. Bereits belegte Kalendereinträge, Krankheit, kurzfristige Aufgaben und nicht geschätzte Tätigkeiten sind darin nicht enthalten.</p></section>
 ${m.overdue.length?`<section class="cap747-alert"><h3>Überfällige GTD-Fristen (${m.overdue.length})</h3><ul>${m.overdue.slice(0,8).map(t=>`<li><strong>${esc(t.title||'Aufgabe')}</strong><span>fällig ${esc(human(t.dueDate))}</span></li>`).join('')}</ul></section>`:''}
 <section class="cap747-scenario"><div class="cap747-section-top"><h3>Mögliche Fokuszeitfenster</h3><span>Planungsszenario, nicht dein freier Kalender</span></div>${m.isEstimated?`<div class="cap747-days">${m.plan.map(x=>`<div><strong>${esc(human(x.day))}</strong><span>${hrs(x.minutes)}</span></div>`).join('')}</div>`:'<p class="cap747-empty">Lege zuerst dein wöchentliches Fokusbudget fest. Compass wird daraus keine freien Kalendertermine erfinden.</p>'}<p>Diese Blöcke werden <strong>nicht</strong> automatisch in deinen Kalender geschrieben. Du kannst später passende freie Kalenderfenster auswählen.</p></section>
 ${m.milestones.length?`<section class="cap747-milestones"><h3>Zusätzliche Projektfristen</h3><p>Separat angezeigt; nicht als geschätzte Arbeitsstunden gezählt.</p><ul>${m.milestones.slice(0,8).map(x=>`<li><strong>${esc(x.title||'Projekt')}</strong> · ${esc(human(x.dueDate))}</li>`).join('')}</ul></section>`:''}
 ${m.unscheduled.length?`<section class="cap747-milestones"><h3>Markiert, aber ohne Fälligkeit</h3><ul>${m.unscheduled.map(x=>`<li>${esc(x.title||'Aufgabe')}</li>`).join('')}</ul><p>Diese Aufgaben benötigen nicht automatisch eine künstliche Deadline.</p></section>`:''}
 <p class="cap747-disclaimer">Grundlage: aktuelle lokale GTD-Daten und deine manuellen Schätzungen. Gesundheitsdaten werden für die heutige Belastbarkeit ausdrücklich nicht verwendet, weil importierte Garmin-/Fitdays-Werte veraltet sein können. E-Mails und offene Rechnungen werden erst berücksichtigt, wenn sie separat erfasst oder zuverlässig verbunden sind.</p>
 </section>`;
}
export function capacityGuardianTeaser(state,{today}={}){
 const m=capacityGuardianModel(state,{today});const txt=m.overdue.length?`${m.overdue.length} überfällige Frist(en)`:m.problems.length?`${m.problems.length} rechnerische Kapazitätswarnung(en)`:m.unknown.length?`${m.unknown.length} Aufwandsschätzung(en) fehlen`:m.future.length?`${m.future.length} anstehende Fristen`:'Derzeit keine GTD-Frist im 14-Tage-Fenster';
 return `<section class="cap747-teaser"><div><strong>🎯 Fristen &amp; Kapazität</strong><p>${esc(txt)} · Ausblick auf Basis des aktuellen GTD-Stands, nicht der historischen Gesundheitsimports.</p></div><button type="button" class="secondary-btn" data-action="capacity747-open">Planung prüfen →</button></section>`;
}
