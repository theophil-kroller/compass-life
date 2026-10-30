/** Compass 0.5.77.59.40.25.23 · optional personal reflection at task completion.
 * Levels describe subjective motivation, not moral worth or diagnoses.
 * Kept outside task records so sync/restore cannot silently strip new fields.
 */
export const INSPIRATION_LEVELS=Object.freeze([
 {level:1,label:'I have to / must',german:'Ich muss',meaning:'Pflicht oder äußerer Druck'},
 {level:2,label:'I should / ought to',german:'Ich sollte',meaning:'Erwartung oder soziales Ideal'},
 {level:3,label:'I need to',german:'Ich brauche es',meaning:'Wahrgenommene Notwendigkeit'},
 {level:4,label:'I want to',german:'Ich will',meaning:'Bewusster Wunsch'},
 {level:5,label:'I desire to',german:'Ich sehne mich danach',meaning:'Echte Anziehung und Vorfreude'},
 {level:6,label:'I choose to',german:'Ich entscheide mich',meaning:'Frei gewählte Entscheidung'},
 {level:7,label:'I love it!',german:'Ich liebe es!',meaning:'Freude und intrinsische Motivation'}
]);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(v,n=180)=>String(v??'').trim().slice(0,n);
const validLevel=x=>Number.isInteger(Number(x))&&Number(x)>=1&&Number(x)<=7;
export function inspirationEntry(task,level,at=new Date().toISOString(),id=crypto.randomUUID()){
 if(!task?.id||!validLevel(level))throw Error('Ungültige Inspirationsbewertung.');
 return {id,taskId:text(task.id,120),title:text(task.title),category:text(task.category||'Allgemein',80),projectId:text(task.projectId||'',120),level:Number(level),at,updatedAt:at};
}
export function addInspirationEntry(state,entry){
 if(!entry?.id||!validLevel(entry.level)||!entry.taskId||!Number.isFinite(Date.parse(entry.at)))throw Error('Ungültige Inspirationsbewertung.');
 const items=Array.isArray(state.taskInspiration)?state.taskInspiration:[];
 state.taskInspiration=[...items.filter(x=>x.id!==entry.id),entry];
 return entry;
}
export function mergeInspirationEntries(a,b){
 const byId=new Map();for(const item of [...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])]){
  if(!item?.id||!validLevel(item.level)||!item.taskId)continue;
  const previous=byId.get(item.id);
  if(!previous||String(previous.updatedAt||previous.at||'')<String(item.updatedAt||item.at||''))byId.set(item.id,item);
 }
 return [...byId.values()].sort((x,y)=>String(x.at||'').localeCompare(String(y.at||''))||x.id.localeCompare(y.id));
}
export function inspirationStats(state){
 const rows=(Array.isArray(state?.taskInspiration)?state.taskInspiration:[]).filter(r=>validLevel(r?.level));
 const sum=rs=>rs.reduce((s,r)=>s+Number(r.level),0);
 const avg=rs=>rs.length?Math.round(sum(rs)/rs.length*10)/10:null;
 const groups=new Map();for(const r of rows){const key=r.category||'Allgemein';groups.set(key,[...(groups.get(key)||[]),r]);}
 const categoryStats=[...groups].map(([category,rs])=>({category,count:rs.length,mean:avg(rs),low:rs.filter(r=>r.level<=2).length,high:rs.filter(r=>r.level>=6).length}));
 return {rows,count:rows.length,mean:avg(rows),low:rows.filter(r=>r.level<=2),high:rows.filter(r=>r.level>=6),categories:categoryStats.sort((a,b)=>a.mean-b.mean)};
}
export function inspirationSuggestions(state,minExamples=3){
 const stats=inspirationStats(state),open=Object.values(state?.tasks||{}).filter(t=>t&&!t.completed&&!t.archived);
 const categories=new Map(stats.categories.filter(c=>c.count>=minExamples&&c.mean<3.5).map(c=>[c.category,c]));
 return open.filter(t=>categories.has(t.category||'Allgemein')).map(t=>({taskId:t.id,title:t.title,category:t.category||'Allgemein',evidence:categories.get(t.category||'Allgemein')})).slice(0,6);
}
export function inspirationRatingModal(task){
 if(!task)return '';
 return `<div class="inspi23-backdrop" role="presentation"><section class="inspi23-dialog" role="dialog" aria-modal="true" aria-labelledby="inspi23-title"><p class="inspi23-kicker">COMPASS · REFLEXION</p><h2 id="inspi23-title">Wie gerne hast du das gemacht?</h2><p class="inspi23-task">${safe(task.title)}</p><p>Welche Aussage passt am besten zu deiner tatsächlichen Motivation? Die Bewertung ist freiwillig.</p><div class="inspi23-choices">${INSPIRATION_LEVELS.map(s=>`<button type="button" data-action="inspi23-rate" data-id="${s.level}" aria-label="Level ${s.level}: ${safe(s.german)}"><b>${s.level}</b><span><strong>${safe(s.german)}</strong><small>${safe(s.label)} · ${safe(s.meaning)}</small></span></button>`).join('')}</div><button type="button" class="inspi23-skip" data-action="inspi23-skip">Ohne Bewertung abschließen</button></section></div>`;
}
export function inspirationInsightsView(state){
 const stats=inspirationStats(state),suggestions=inspirationSuggestions(state);
 const row=(r)=>`<div class="inspi23-history-row"><span>${safe(r.title||'Aufgabe')}<small>${safe(r.category||'Allgemein')}</small></span><strong>${r.level}/7</strong></div>`;
 return `<section class="work-card inspi23-insights" aria-label="Motivation und Inspirationslevel"><div class="work-heading"><span>♡ Inspiration · Wie gerne mache ich etwas?</span><small>${stats.count} freiwillige Bewertungen</small></div>${!stats.count?`<p>Nach dem Abhaken einer Aufgabe kannst du freiwillig eines von sieben Inspirationsleveln wählen. Erst nach einigen Bewertungen entstehen belastbare Muster.</p>`:`<div class="inspi23-kpis"><div><small>Durchschnitt</small><strong>${String(stats.mean).replace('.',',')} / 7</strong></div><div><small>Level 1–2</small><strong>${stats.low.length}</strong></div><div><small>Level 6–7</small><strong>${stats.high.length}</strong></div></div><div class="inspi23-insights-grid"><div><h3>Was mir wenig Freude macht</h3>${stats.low.slice(-5).reverse().map(row).join('')||'<p>Noch keine Bewertungen auf Level 1–2.</p>'}</div><div><h3>Was ich liebe / bewusst wähle</h3>${stats.high.slice(-5).reverse().map(row).join('')||'<p>Noch keine Bewertungen auf Level 6–7.</p>'}</div></div><h3>Lebensbereiche · erst ab 3 Bewertungen interpretieren</h3><div class="inspi23-category-list">${stats.categories.map(c=>`<div><span>${safe(c.category)} · ${c.count}×</span><strong>${c.count>=3?String(c.mean).replace('.',',')+' / 7':'Noch zu wenig Daten'}</strong></div>`).join('')}</div>${suggestions.length?`<h3>Planungshilfe bei wiederkehrendem Widerstand</h3><p>Diese offenen Aufgaben gehören zu Bereichen, die du mehrfach als wenig motivierend bewertet hast. Eine kleine Next Action, ein kurzer Zeitblock oder Delegation kann helfen; keine automatische Umpriorisierung.</p>${suggestions.map(s=>`<div class="inspi23-history-row"><span>${safe(s.title)}<small>${safe(s.category)} · ${s.evidence.count} Referenzen, Ø ${s.evidence.mean}/7</small></span></div>`).join('')}`:'<p>Für evidenzbasierte Planungshinweise sind mindestens drei Bewertungen pro Bereich mit niedrigem Durchschnitt nötig.</p>'}`}<p class="muted-line">Diese Reflexion erfasst Motivation beim Abschluss, nicht die Qualität deiner Arbeit. Eine ungeliebte Aufgabe ist nicht automatisch unwichtig; Stichproben und Tagesform beeinflussen die Skala.</p></section>`;
}
