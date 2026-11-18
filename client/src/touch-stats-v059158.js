/** Aggregate voluntary, private touch entries by calendar week or month and person. */
import {touchEntries,touchKinds,TOUCH_KINDS} from './touch-journal-v577.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localDay=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const startOfWeek=d=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate(),12);x.setDate(x.getDate()-(x.getDay()+6)%7);return x;};
const weekKey=d=>localDay(startOfWeek(d));
export function touchStats58(state,{unit='month',periods=12,personId='',today=new Date()}={}){
 const mode=unit==='week'?'week':'month',length=Math.max(1,Math.min(36,Number(periods)||12));
 const dates=Array.from({length},(_,i)=>{const d=new Date(today.getFullYear(),today.getMonth(),today.getDate(),12);if(mode==='month')return new Date(d.getFullYear(),d.getMonth()-(length-i-1),1,12);d.setDate(d.getDate()-7*(length-i-1));return startOfWeek(d);});
 const buckets=dates.map(d=>({key:mode==='month'?localDay(d).slice(0,7):weekKey(d),label:mode==='month'?d.toLocaleDateString('de-AT',{month:'short',year:'2-digit'}):`ab ${d.toLocaleDateString('de-AT',{day:'2-digit',month:'2-digit'})}`,count:0,types:{}}));
 const map=new Map(buckets.map((b,i)=>[b.key,i])),types={};const persons=new Map();
 for(const row of touchEntries(state)){
  const d=new Date(row.at);if(!Number.isFinite(d.getTime())||d>today)continue;
  const key=mode==='month'?localDay(d).slice(0,7):weekKey(d);if(!map.has(key))continue;
  if(personId&&row.personId!==personId)continue;
  const bucket=buckets[map.get(key)];bucket.count++;
  for(const k of touchKinds(row)){bucket.types[k]=(bucket.types[k]||0)+1;types[k]=(types[k]||0)+1;}
  const id=row.personId||row.person||'';if(id){const prev=persons.get(id)||{personId:row.personId||'',name:state?.people?.[row.personId]?.name||row.person||'Ohne Name',count:0};prev.count++;persons.set(id,prev);}
 }
 return {unit:mode,periods:buckets,total:buckets.reduce((s,b)=>s+b.count,0),types,people:[...persons.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name,'de'))};
}
export function touchStatsView58(state,{unit='month',personId=''}={}){
 const stats=touchStats58(state,{unit,personId}),max=Math.max(1,...stats.periods.map(x=>x.count));
 const people=Object.values(state?.people||{}).filter(p=>p?.id&&p?.name&&['family','partner','friend'].includes(p.relationKind)).sort((a,b)=>a.name.localeCompare(b.name,'de'));
 const typeBars=TOUCH_KINDS.filter(k=>stats.types[k.id]).map(k=>`<div class="ts58-kind"><span>${k.icon} ${esc(k.name)}</span><strong>${stats.types[k.id]}</strong></div>`).join('');
 const bars=stats.periods.map(b=>`<div class="ts58-bar" title="${esc(b.label+': '+b.count+' Einträge')}"><div class="ts58-track"><i style="height:${b.count?Math.max(5,b.count/max*100):0}%"></i></div><strong>${b.count}</strong><small>${esc(b.label)}</small></div>`).join('');
 return `<section class="work-card ts58-wrap"><div class="work-heading"><span>📊 Kontakt- & Berührungsstatistik</span><small>Dokumentierte Einträge</small></div><div class="ts58-filters"><label>Auflösung <select data-touch58="unit"><option value="month" ${unit!=='week'?'selected':''}>Monatlich · 12 Monate</option><option value="week" ${unit==='week'?'selected':''}>Wöchentlich · 12 Wochen</option></select></label><label>Person <select data-touch58="person"><option value="">Alle Personen</option>${people.map(p=>`<option value="${esc(p.id)}" ${p.id===personId?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label></div><div class="ts58-headline"><strong>${stats.total}</strong><span>erfasste Begegnungen im Zeitraum</span></div><div class="ts58-chart" aria-label="Zeitlicher Verlauf dokumentierter Kontakte">${bars}</div><h3>Nach Kategorie</h3><div class="ts58-types">${typeBars||'<p class="muted-line">Für diese Auswahl noch keine Einträge.</p>'}</div>${!personId&&stats.people.length?`<details><summary>Kontakte nach Person (${stats.people.length})</summary><div class="ts58-types">${stats.people.slice(0,30).map(p=>`<div class="ts58-kind"><span>${esc(p.name)}</span><strong>${p.count}</strong></div>`).join('')}</div></details>`:''}</section>`;
}
