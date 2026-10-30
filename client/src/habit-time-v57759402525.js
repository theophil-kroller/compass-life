/** Compass .25.25 · source-aware habit-time ledger. All rows stay inside the encrypted vault.
 * It never infers unknown durations from checked habits and does not double count
 * guided Coach sessions already recorded by Miracle Morning's SAVERS Exercise step.
 */
const day=/^\d{4}-\d{2}-\d{2}$/;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mins=n=>Math.round(Number(n)*10)/10;
const isMinutes=n=>typeof n==='number'&&Number.isFinite(n)&&n>0&&n<=600;
const todayFrom=x=>{const d=new Date(x);return Number.isFinite(+d)?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
export const HABIT_TIME_CATEGORIES=Object.freeze({'wim-hof':'Wim-Hof Atemroutine','vocal-image':'Vocal Image','hakka-5':'Makko-Ho','strength':'Krafttraining · Coach','miracle-morning':'Miracle Morning'});
export function putHabitTimeSession(state,{id,habitId,at,day:date,minutes,source='manual',mode='',updatedAt}={}){
 if(!state||typeof state!=='object')throw Error('Tresor nicht entsperrt');
 const value=Number(minutes),when=String(at||new Date().toISOString()),which=day.test(date||'')?date:todayFrom(when);
 if(!HABIT_TIME_CATEGORIES[habitId]||!Number.isFinite(Date.parse(when))||!day.test(which)||!isMinutes(value))throw Error('Datum oder Dauer ungültig (0–600 Minuten).');
 const row={id:String(id||crypto.randomUUID()),habitId,at:when,day:which,minutes:mins(value),mode:String(mode||''),source:String(source),updatedAt:String(updatedAt||new Date().toISOString())};
 const old=Array.isArray(state.habitTimeSessions)?state.habitTimeSessions:[];
 const index=old.findIndex(x=>x.id===row.id);
 if(index>=0){const copy=old.slice();copy[index]=row;state.habitTimeSessions=copy;}else state.habitTimeSessions=[...old,row].slice(-2000);
 return row;
}
export function mergeHabitTimeSessions(left,right){const byId=new Map();for(const row of [...(Array.isArray(left)?left:[]),...(Array.isArray(right)?right:[])]){
 if(!row?.id||!HABIT_TIME_CATEGORIES[row.habitId]||!day.test(row.day||'')||!isMinutes(row.minutes))continue;
 const old=byId.get(row.id);if(!old||String(row.updatedAt||row.at||'')>String(old.updatedAt||old.at||''))byId.set(row.id,row);
 }return [...byId.values()].sort((a,b)=>a.at.localeCompare(b.at)||a.id.localeCompare(b.id));}
function autoRows(state){
 const out=[];
 for(const r of state?.makkoHoSessions||[]){const min=Number(r.totalSeconds)/60;if(!r.id||!isMinutes(min))continue;out.push({id:'makko-'+r.id,habitId:'hakka-5',at:r.finishedAt||r.at||r.day+'T12:00:00',day:r.day||todayFrom(r.finishedAt||r.at),minutes:mins(min),source:'makko-timer'});}
 for(const r of state?.miracleMorning?.sessions||[]){if(!r.id||!r.finishedAt)continue;const seconds=(r.steps||[]).reduce((s,p)=>s+(p.skipped?0:Math.max(0,Number(p.seconds)||0)),0);if(!isMinutes(seconds/60))continue;out.push({id:'mm-'+r.id,habitId:'miracle-morning',at:r.finishedAt,day:r.day||todayFrom(r.finishedAt),minutes:mins(seconds/60),source:'savers-timer'});}
 const mmExercise=new Set((state?.miracleMorning?.sessions||[]).filter(r=>r.finishedAt).map(r=>r.day||todayFrom(r.finishedAt)));
 for(const r of state?.strengthGuidedSessions||[]){if(!r.id||!r.finishedAt||!r.startedAt)continue;const start=Date.parse(r.startedAt),end=Date.parse(r.finishedAt),min=(end-start)/60000;if(!isMinutes(min))continue;const d=todayFrom(r.startedAt);if(mmExercise.has(d))continue;out.push({id:'coach-'+r.id,habitId:'strength',at:r.finishedAt,day:d,minutes:mins(min),source:'coach-timer'});}
 return out.filter(r=>day.test(r.day||''));
}
export function habitTimeModel(state,{anchor=new Date().toISOString().slice(0,10),days=7}={}){
 if(!day.test(anchor))throw Error('Ungültiger Stichtag');const length=Math.max(1,Math.min(365,Number(days)||7));
 const start=new Date(anchor+'T12:00:00Z');start.setUTCDate(start.getUTCDate()-length+1);const first=start.toISOString().slice(0,10);
 const map=new Map();for(const x of [...mergeHabitTimeSessions(state?.habitTimeSessions,[]),...autoRows(state)]){
  if(x.day<first||x.day>anchor||!isMinutes(x.minutes)||map.has(x.id))continue;map.set(x.id,x);
 }
 const rows=[...map.values()].sort((a,b)=>a.at.localeCompare(b.at)),groups=Object.keys(HABIT_TIME_CATEGORIES).map(habitId=>({habitId,label:HABIT_TIME_CATEGORIES[habitId],minutes:mins(rows.filter(r=>r.habitId===habitId).reduce((s,r)=>s+r.minutes,0)),sessions:rows.filter(r=>r.habitId===habitId).length}));
 const total=mins(rows.reduce((s,r)=>s+r.minutes,0)),activeDays=new Set(rows.map(r=>r.day)).size;
 return {anchor,first,days:length,rows,groups,total,activeDays,averagePerActiveDay:activeDays?mins(total/activeDays):null,unknown: (state?.habitsQuick?.completions||[]).filter(x=>x.done!==false&&x.day>=first&&x.day<=anchor&&!rows.some(r=>r.day===x.day&&r.habitId===x.habitId)).length};
}
export function habitTimeInsightsView(state,opts={}){
 const m=habitTimeModel(state,opts),max=Math.max(1,...m.groups.map(x=>x.minutes)),colors=['#9c83c8','#cf9b4b','#5ba999','#688db8','#c3a077'];
 return `<section class="work-card ht25-card" aria-label="Zeitinvestition in Gewohnheiten"><header class="work-heading"><span>◷ Gewohnheiten · Zeitinvestition</span><small>${m.first} – ${m.anchor}</small></header><div class="habit569-kpis"><div><small>Dokumentiert</small><strong>${m.total.toLocaleString('de-AT')} min</strong></div><div><small>Aktive Tage</small><strong>${m.activeDays}</strong></div><div><small>Ø pro aktivem Tag</small><strong>${m.averagePerActiveDay===null?'–':m.averagePerActiveDay+' min'}</strong></div></div><div class="ht25-list">${m.groups.map((g,i)=>`<div class="ht25-row"><div><strong>${esc(g.label)}</strong><span>${g.sessions} ${g.sessions===1?'Einheit':'Einheiten'} · ${g.minutes.toLocaleString('de-AT')} min</span></div><div class="ht25-bar"><i style="width:${g.minutes/max*100}%;background:${colors[i]}"></i></div></div>`).join('')}</div><div class="ht25-forms"><form id="ht25-wim-form"><strong>Wim-Hof-Einheit nachtragen</strong><label>Datum<input name="day" type="date" value="${m.anchor}" max="${m.anchor}" required></label><label>Modus<select name="mode"><option value="morning">Morgen</option><option value="evening">Abend</option></select></label><label>Dauer (Minuten)<input type="number" name="minutes" min="1" max="180" step="0.5" placeholder="z. B. 20" required></label><button type="submit" class="secondary-btn">Einheit speichern</button></form><form id="ht25-vocal-form"><strong>Vocal Image · Minuten erfassen</strong><label>Datum<input name="day" type="date" value="${m.anchor}" max="${m.anchor}" required></label><label>Übungsdauer (Minuten)<input type="number" name="minutes" min="1" max="180" step="1" placeholder="z. B. 30" required></label><button type="submit" class="secondary-btn">Zeit speichern</button></form></div><p class="muted-line">Nur bestätigte oder manuell erfasste Minuten. ${m.unknown} Habit-Häkchen ohne Dauer; diese werden nicht als 0 Minuten bewertet. Coach-Einheiten am selben Tag wie Miracle Morning werden konservativ nicht zusätzlich angerechnet, um Überschneidungen zu vermeiden.</p></section>`;
}
export const HABIT_TIME_CSS=`.ht25-card .ht25-list{display:grid;gap:12px;margin:16px 0}.ht25-row>div:first-child{display:flex;justify-content:space-between;gap:12px;font-size:12px}.ht25-row span{color:var(--muted,#758a84)}.ht25-bar{height:8px;background:#dae7e3;border-radius:8px;margin-top:5px;overflow:hidden}.ht25-bar i{display:block;height:100%;border-radius:8px}.ht25-forms{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:20px 0}.ht25-forms form{border:1px solid #d9e7df;padding:12px;border-radius:12px;display:grid;gap:10px}.ht25-forms form strong{font-size:14px}.ht25-forms label{display:grid;gap:4px;font-size:12px}.ht25-forms input,.ht25-forms select{width:100%;min-width:0;padding:8px;border:1px solid #c7d9d2;border-radius:8px}@media(max-width:650px){.ht25-forms{grid-template-columns:1fr}}`;
