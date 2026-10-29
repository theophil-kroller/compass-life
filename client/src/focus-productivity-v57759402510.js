/** Compass .40.25.10 · Activity-aware productivity and progress. No inferred hours. */
export const FOCUS_COLORS={
 Forschung:'#268A91',Lehre:'#C99C42',Lehrvorbereitung:'#D5AE64',
 Pruefungskorrektur:'#D76A40',Pruefungserstellung:'#B85D69',Pruefungen:'#8A7986',
 Verwaltung:'#557DAD',Meeting:'#8597B0',Weiterbildung:'#9675BB',
 Familie:'#4F9F77',Beziehungsdynamiken:'#B8758F',Unklassifiziert:'#92989E'};
export const FOCUS_LABELS={Forschung:'Forschung',Lehre:'Lehre',Lehrvorbereitung:'Lehrvorbereitung',Pruefungskorrektur:'Prüfungskorrektur',Pruefungserstellung:'Prüfungserstellung',Pruefungen:'Prüfungen – bitte zuordnen',Verwaltung:'Verwaltung',Meeting:'Meetings',Weiterbildung:'Weiterbildung',Familie:'Familie',Beziehungsdynamiken:'Beziehungsdynamiken',Unklassifiziert:'Noch nicht klassifiziert'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rounded=v=>Math.round(v*10)/10;
const focus=a=>a.source==='Garmin'?Math.max(0,Number(a.focusSec)||0):0;
const sec=a=>Math.max(0,(Number(a.durationMinutes)||0)*60);
const isWork=a=>a&&!a.deleted&&a.category==='Arbeit'&&/^\d{4}-\d{2}-\d{2}T/.test(a.startedAt||'');
const label=k=>FOCUS_LABELS[k]||FOCUS_LABELS.Unklassifiziert;
const color=k=>FOCUS_COLORS[k]||FOCUS_COLORS.Unklassifiziert;
export function activityTotals(activities=[],{start='',end='9999-12-31'}={}){
 const byType=new Map(),seen=new Set();let duration=0,focusSeconds=0,pomodoros=0,review=0,sessions=0;
 for(const a of activities){
  if(!isWork(a)||seen.has(a.id))continue;seen.add(a.id);
  const day=a.startedAt.slice(0,10);if(day<start||day>end)continue;
  const type=FOCUS_COLORS[a.activityType]?a.activityType:'Unklassifiziert';
  const v=byType.get(type)||{type,seconds:0,focusSeconds:0,pomodoros:0,sessions:0,review:0};
  v.seconds+=sec(a);v.focusSeconds+=focus(a);v.pomodoros+=Math.max(0,Number(a.pomodoros)||0);
  v.sessions++;if(a.activityTypeReview)v.review++;
  byType.set(type,v);duration+=sec(a);focusSeconds+=focus(a);pomodoros+=Math.max(0,Number(a.pomodoros)||0);
  sessions++;if(a.activityTypeReview)review++;
 }
 return {duration,focusSeconds,pomodoros,review,sessions,byType:[...byType.values()].sort((a,b)=>b.focusSeconds-a.focusSeconds||b.seconds-a.seconds)};
}
export function focusActivityBreakdown(activities=[]){
 const m=activityTotals(activities);if(!m.sessions)return '';
 const hours=x=>rounded(x/3600).toLocaleString('de-AT',{maximumFractionDigits:1});
 const rows=m.byType.map(x=>`<div class="c4010-focus-row"><span class="c4010-legend-dot" style="background:${color(x.type)}"></span>${x.type==='Pruefungen'&&m.review?`<button type="button" class="c4011-exam-row-action" data-action="focus-review-open" title="Prüfungs-Sessions jetzt zuordnen">${esc(label(x.type))} <em class="c4010-share">${m.focusSeconds?Math.round(x.focusSeconds/m.focusSeconds*100):0}%</em></button>`:`<strong>${esc(label(x.type))} <em class="c4010-share">${m.focusSeconds?Math.round(x.focusSeconds/m.focusSeconds*100):0}%</em></strong>`}<span>${x.pomodoros} P.</span><span>${hours(x.focusSeconds)} h Fokus</span><span>${hours(x.seconds)} h erfasst</span></div>`).join('');
 return `<section class="c4010-focus-summary"><header><strong>Fokuszeit nach Tätigkeitsart</strong><small>${m.pomodoros} Pomodoros · ${hours(m.focusSeconds)} h Fokus · ${hours(m.duration)} h Sessions</small></header><div class="c4010-focus-rows">${rows}</div>${m.review?`<div class="c4010-review-warning">${m.review} historische Prüfungs-Session(s) sind noch nicht zugeordnet. <button type="button" class="secondary-btn c4011-review-cta" data-action="focus-review-open">Jetzt zuordnen</button></div>`:''}<p class="c4010-focus-note">Nur protokollierte Sessions. Fokuszeit und gesamte Sessiondauer sind verschiedene Größen. Keine Zuordnung aus Kalendertiteln geschätzt.</p></section>`;
}
export function stackedWorkDays(activities=[],rows=[]){
 if(!rows.length)return '<p class="muted-line">Noch keine protokollierte Arbeitszeit in diesem Zeitraum.</p>';
 const last=rows.slice(-36),byDay=new Map();
 for(const a of activities){if(!isWork(a))continue;const day=a.startedAt.slice(0,10);if(!byDay.has(day))byDay.set(day,new Map());const m=byDay.get(day),type=FOCUS_COLORS[a.activityType]?a.activityType:'Unklassifiziert';m.set(type,(m.get(type)||0)+sec(a)/60);}
 const max=Math.max(1,...last.map(r=>r.workMinutes));
 const bars=last.map(r=>{
  const parts=[...(byDay.get(r.day)||new Map()).entries()];
  const width=Math.min(100,100*r.workMinutes/max);
  const segments=parts.map(([type,mins])=>`<i style="width:${Math.min(100,mins/Math.max(r.workMinutes,1)*100).toFixed(2)}%;background:${color(type)}" title="${esc(label(type))}: ${rounded(mins)} min"></i>`).join('');
  return `<div class="c4010-daybar"><time>${esc(r.day.slice(5))}</time><div class="c4010-dayrail"><div class="c4010-dayfill" style="width:${width.toFixed(1)}%">${segments}</div></div><strong>${Math.round(r.workMinutes)} min</strong><small>${r.pomodoros} P.</small></div>`;
 }).join('');
 const types=activityTotals(activities).byType;
 const legend=types.map(x=>`<span><i style="background:${color(x.type)}"></i>${esc(label(x.type))}</span>`).join('');
 return `<div class="c4010-stacked-days">${bars}</div><div class="c4010-legend">${legend}</div>`;
}
export function timeProgressMarkup(activities=[],start='',end='9999-12-31'){
 const m=activityTotals(activities,{start,end});if(!m.sessions)return '';
 const n=x=>rounded(x/3600).toLocaleString('de-AT',{maximumFractionDigits:1});
 return `<div class="c4010-progress" aria-label="Arbeitszeit nach Tätigkeit in den letzten sieben Tagen"><div class="c4010-progress-head"><strong>Zeitallokation · 7 Tage</strong><small>${n(m.focusSeconds)} h Fokus · ${m.pomodoros} Pomodoros</small></div>${m.byType.map(x=>`<div class="c4010-progress-line"><i style="background:${color(x.type)}"></i><span>${esc(label(x.type))}</span><strong>${n(x.seconds)} h</strong><small>${x.pomodoros} P.</small></div>`).join('')}</div>`;
}
export function projectTimeText(activities=[],projectId=''){
 const matched=activities.filter(a=>isWork(a)&&a.projectId===projectId);if(!matched.length)return 'Noch keine Zeit zugeordnet';
 const mins=matched.reduce((s,a)=>s+sec(a),0)/60;
 const fmins=matched.reduce((s,a)=>s+focus(a),0)/60;
 return `${rounded(mins/60).toLocaleString('de-AT')} h erfasst · ${rounded(fmins/60).toLocaleString('de-AT')} h Fokus`;
}
