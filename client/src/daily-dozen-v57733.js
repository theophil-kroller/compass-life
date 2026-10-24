import {dailyDozenEvidence} from './daily-dozen-auto-v57734.js';
export {dailyDozenEvidence} from './daily-dozen-auto-v57734.js';
/** Dr. Michael Greger's Daily Dozen. User-controlled servings, source-aware.
 * 12 food/activity groups, 24 total daily ticks, including exercise and beverages.
 * No inference from imprecise nutrition logs. Encrypted nutritionJournal sync uses
 * category-level timestamps; different device edits to different categories survive.
 */
export const DAILY_DOZEN=Object.freeze([
 {id:'beans',name:'Hülsenfrüchte',emoji:'🫘',target:3,detail:'z. B. Bohnen, Linsen, Kichererbsen'},
 {id:'berries',name:'Beeren',emoji:'🫐',target:1,detail:'frisch, tiefgekühlt oder ungesüßt'},
 {id:'fruit',name:'Andere Früchte',emoji:'🍎',target:3,detail:'Obst außer Beeren'},
 {id:'cruciferous',name:'Kreuzblütler',emoji:'🥦',target:1,detail:'Brokkoli, Kohl, Rucola'},
 {id:'greens',name:'Grünes Blattgemüse',emoji:'🥬',target:2,detail:'z. B. Grünkohl, Salat'},
 {id:'vegetables',name:'Andere Gemüse',emoji:'🥕',target:2,detail:'verschiedene Gemüsearten'},
 {id:'flax',name:'Gemahlene Leinsamen',emoji:'🌱',target:1,detail:'1 EL gemahlen; nicht nur Omega-3-Kapsel'},
 {id:'nuts',name:'Nüsse und Samen',emoji:'🥜',target:1,detail:'zusätzlich zur Leinsamenportion'},
 {id:'spices',name:'Kräuter und Gewürze',emoji:'🫚',target:1,detail:'z. B. Kurkuma + weitere Kräuter'},
 {id:'wholegrains',name:'Vollkorn',emoji:'🌾',target:3,detail:'z. B. Hafer, Vollkornbrot, Naturreis'},
 {id:'beverages',name:'Getränke',emoji:'💧',target:5,detail:'Wasser, Tee und andere geeignete Getränke'},
 {id:'exercise',name:'Bewegung',emoji:'🚶',target:1,detail:'90 min moderat oder 40 min intensiv laut Greger'}
]);
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const isDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&Number.isFinite(Date.parse(s+'T12:00:00Z'));
const clamp=(x,max)=>Math.max(0,Math.min(max,Math.round(Number(x)||0)));
const dateLocal=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const shiftDailyDozenDate=(day,n)=>{const dt=new Date(day+'T12:00:00');dt.setDate(dt.getDate()+n);return dateLocal(dt);};
export function dailyDozenSummary(state,day){
 const record=state?.nutritionJournal?.dailyDozen?.[day]||{};
 const evidence=dailyDozenEvidence(state,day);
 const rows=DAILY_DOZEN.map(c=>{const auto=clamp(evidence.totals[c.id]||0,c.target),manual=record[c.id];
  const explicit=manual!==undefined;return {...c,count:explicit?clamp(manual?.count??manual,c.target):auto,source:explicit?'manual':auto?'auto':'unknown',auto,provenance:evidence.notes[c.id]||[],updatedAt:manual?.updatedAt||''};});
 const completed=rows.reduce((n,x)=>n+x.count,0),total=rows.reduce((n,x)=>n+x.target,0);
 return {day,rows,completed,total,percentage:Math.round(completed/total*100),completedGroups:rows.filter(x=>x.count===x.target).length,groups:rows.length,evidence};
}
export function setDailyDozen(state,day,id,delta){
 if(!isDay(day))throw Error('Ungültiges Datum.');
 const cat=DAILY_DOZEN.find(c=>c.id===id);if(!cat)throw Error('Unbekannte Daily-Dozen-Kategorie.');
 if(delta!==1&&delta!==-1)throw Error('Ungültige Änderung.');
 state.nutritionJournal??={entries:[],customFoods:[]};
 state.nutritionJournal.dailyDozen??={};
 const record=state.nutritionJournal.dailyDozen[day]??={};
 const prior=record[id]; const suggested=dailyDozenEvidence(state,day).totals[id]||0;
 const value=prior!==undefined?clamp(prior?.count??prior,cat.target):clamp(suggested,cat.target);const next=clamp(value+delta,cat.target);
 if(next===value)return next;
 record[id]={count:next,updatedAt:new Date().toISOString()};return next;
}
/** Reconcile individual checkboxes from desktop / phone; newer change per category wins.
 * No automatic ``0`` backfill; old missing categories are unknown, not checked. */
export function mergeDailyDozen(local={},remote={}){
 const out={};for(const data of [local,remote])for(const [date,values] of Object.entries(data||{})){
  if(!isDay(date)||!values||typeof values!=='object')continue;
  const rec=out[date]??={};for(const cat of DAILY_DOZEN){const item=values[cat.id];
   if(item==null)continue;
   const count=clamp(typeof item==='number'?item:item.count,cat.target);
   const updatedAt=typeof item==='object'?String(item.updatedAt||''):'';
   if(!rec[cat.id]||updatedAt>=String(rec[cat.id].updatedAt||''))rec[cat.id]={count,updatedAt};
  }
 }
 return out;
}
export function dailyDozenView(state,{day=dateLocal(new Date()),today=dateLocal(new Date())}={}){
 const m=dailyDozenSummary(state,day),pct=m.percentage,canNext=day<today;
 return `<section class="dd733-root" aria-label="Dr. Greger Daily Dozen"><div class="dd733-header"><div><h2>🌿 Dr. Greger’s Daily Dozen</h2><p>12 Kategorien · 24 Portionen und Aktivitäten. Eindeutig protokollierte Lebensmittel zählen automatisch; du kannst jede Zuordnung korrigieren.</p></div><a href="https://nutritionfacts.org/topics/daily-dozen/" target="_blank" rel="noopener noreferrer">Originalempfehlungen ↗</a></div>
 <div class="dd733-top"><div class="dd733-day"><button type="button" data-action="dd733-day" data-id="prev" aria-label="Vortag">‹</button><strong>${esc(day)} ${day===today?'· Heute':''}</strong><button type="button" data-action="dd733-day" data-id="next" ${!canNext?'disabled':''} aria-label="Folgetag">›</button><button type="button" data-action="dd733-day" data-id="today">Heute</button></div>
 <div class="dd733-summary"><strong>${m.completed} / ${m.total}</strong><span>abgehakte Portionen · ${pct}%</span><small>${m.completedGroups} von ${m.groups} Kategorien vollständig</small><div class="dd733-meter" role="progressbar" aria-valuenow="${m.completed}" aria-valuemin="0" aria-valuemax="${m.total}" aria-label="Daily Dozen Portionen"><span style="width:${pct}%"></span></div></div></div>
 <div class="dd733-grid">${m.rows.map(x=>`<article class="dd733-item ${x.count>=x.target?'is-complete':''}"><div class="dd733-item-heading"><span class="dd733-icon">${x.emoji}</span><div><strong>${esc(x.name)}</strong><small>${esc(x.detail)}</small>${x.source==='auto'?`<small class="dd734-autoproof" title="${esc(x.provenance.join(' · '))}">✓ Aus Tagebuch erkannt</small>`:x.source==='manual'?'<small class="dd734-manualproof">✓ Von dir bestätigt / korrigiert</small>':''}${x.id==='nuts'&&!x.count&&m.evidence.nutGrams>0?`<small class="dd734-progress-note">${m.evidence.nutGrams} g von ca. 30 g erfasst (Daily Dozen)</small>`:''}</div></div><div class="dd733-controls"><button type="button" data-action="dd733-step" data-id="-${esc(x.id)}" aria-label="${esc(x.name)}: eine Portion entfernen" ${x.count===0?'disabled':''}>−</button><span aria-label="${x.count} von ${x.target} Portionen">${x.count} / ${x.target}</span><button type="button" data-action="dd733-step" data-id="+${esc(x.id)}" aria-label="${esc(x.name)}: eine Portion hinzufügen" ${x.count===x.target?'disabled':''}>+</button></div></article>`).join('')}</div>
 <p class="dd733-note">Eindeutig erkannte Portionen werden automatisch gezählt; manuelle Korrekturen haben Vorrang. Unvollständige Tage zeigen nicht „zu wenig gegessen“, sondern nur den Dokumentationsstand. Fortschritt wird verschlüsselt im Ernährungsjournal gespeichert und bei aktiviertem Journal-Abgleich pro Kategorie zusammengeführt.</p></section>`;
}
