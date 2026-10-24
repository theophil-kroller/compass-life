/** Compass 0.5.77.35: descriptive encounter history, not an intimacy or relationship score.
 * Every visualized observation is explicitly volunteered by the owner.
 * No unlogged day is interpreted as an absence of touch.
 */
import {touchEntries,touchKinds,TOUCH_KINDS} from './touch-journal-v577.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isoLocal=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const shift=(day,n)=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return isoLocal(d);};
const validDay=x=>/^\d{4}-\d{2}-\d{2}$/.test(x||'');
const FEEL={pleasant:{label:'Angenehm',color:'#44967E'},neutral:{label:'Neutral',color:'#DBA759'},unpleasant:{label:'Unangenehm',color:'#D48077'},unsure:{label:'Unklar',color:'#A6A1B0'}};
export const TOUCH_EXPERIENCE=Object.freeze(Object.keys(FEEL));
export function touchExperienceOptions(value=''){
 return `<option value="" ${!value?'selected':''}>Keine Angabe</option>`+Object.entries(FEEL).map(([id,v])=>`<option value="${id}" ${value===id?'selected':''}>${v.label}</option>`).join('');
}
export function touchObservations(state,{period=30,today=isoLocal(new Date())}={}){
 const days=[7,30,90].includes(+period)?+period:30;
 if(!validDay(today))throw Error('Ungültiger Tagesbezug.');
 const start=shift(today,-days+1);
 const entries=touchEntries(state).filter(x=>{const d=isoLocal(new Date(x.at));return d>=start&&d<=today;});
 const byDay=new Map(),byKind=new Map(),experiences=new Map();
 for(const row of entries){
  const d=isoLocal(new Date(row.at));byDay.set(d,(byDay.get(d)||0)+1);
  for(const kind of touchKinds(row))byKind.set(kind,(byKind.get(kind)||0)+1);
  if(FEEL[row.experience])experiences.set(row.experience,(experiences.get(row.experience)||0)+1);
 }
 const dates=Array.from({length:days},(_,i)=>shift(start,i)).map(d=>({day:d,entries:byDay.get(d)??null}));
 return {period:days,start,today,entries,dates,byKind,experiences,loggedDays:byDay.size,experienced:[...experiences.values()].reduce((a,b)=>a+b,0)};
}
/** Does not evaluate a relationship, assign a touch quota or infer consent from dance/sport. */
export function touchAnalyticsView(state,{period=30,today=isoLocal(new Date())}={}){
 const m=touchObservations(state,{period,today}),ranked=[...m.byKind].sort((a,b)=>b[1]-a[1]);
 const max=Math.max(1,...ranked.map(x=>x[1]));
 const heat=m.dates.map(({day,entries},i)=>{
  const title=entries===null?`${day}: kein Eintrag (unbekannt)`:`${day}: ${entries} dokumentierte Begegnung${entries===1?'':'en'}`;
  const level=entries===null?'empty':entries===1?'one':entries===2?'two':'many';
  return `<span class="t735-day ${level}" title="${esc(title)}" aria-label="${esc(title)}">${i%7===0?`<small>${day.slice(5)}</small>`:''}<i></i></span>`;
 }).join('');
 const bars=ranked.map(([id,count])=>{const kind=TOUCH_KINDS.find(x=>x.id===id);return `<div class="t735-kind"><span>${kind?.icon||'✨'} ${esc(kind?.name||id)}</span><div class="t735-track"><i style="width:${(100*count/max).toFixed(1)}%"></i></div><strong>${count}</strong></div>`;}).join('');
 const feedback=Object.entries(FEEL).map(([id,value])=>m.experiences.has(id)?`<span class="t735-feeling" style="--tone:${value.color}"><i></i>${esc(value.label)}: ${m.experiences.get(id)}</span>`:'').filter(Boolean).join('');
 return `<section class="work-card t735-insights" aria-label="Dokumentierte Berührung und Nähe im Zeitverlauf"><div class="work-heading"><span>🗓️ Dokumentierte Nähe · Verlauf</span><small>${m.period} Tage</small></div>
 <div class="t735-stats"><div><strong>${m.entries.length}</strong><small>dokumentierte Begegnungen</small></div><div><strong>${m.loggedDays}</strong><small>Tage mit Eintrag</small></div><div><strong>${m.byKind.size}</strong><small>erfasste Arten</small></div></div>
 <div class="t735-history" role="img" aria-label="Tagesverlauf dokumentierter Berührung und Nähe; Grau ist unbekannt, keine Null"><div class="t735-daygrid">${heat}</div><div class="t735-legend"><span><i class="one"></i> 1 Eintrag</span><span><i class="two"></i> 2 Einträge</span><span><i class="many"></i> 3+ Einträge</span><span><i class="empty"></i> nicht protokolliert</span></div></div>
 ${bars?`<div class="t735-type-list"><h3>Berührungsarten</h3>${bars}</div>`:''}
 ${feedback?`<div class="t735-feedback"><strong>Freiwillig beschriebenes Erleben</strong><div>${feedback}</div><small>${m.experienced} von ${m.entries.length} Begegnungen mit Angabe. Keine automatische Bewertung.</small></div>`:''}
 <p class="t735-caveat">Nur von dir eingetragene Begegnungen. Ein Tag ohne Eintrag bedeutet nicht „keine Berührung“. Tanzen kann ohne unmittelbaren Körperkontakt stattfinden. Aus Anzahl, Art oder Kontaktdauer lässt sich keine Beziehungsqualität, Einwilligung oder Wirkung auf deine Gesundheit ableiten. Subjektives Erleben ist freiwillig.</p></section>`;
}
