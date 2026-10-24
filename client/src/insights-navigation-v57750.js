/** Compass 0.5.77.50 — single taxonomy for desktop and mobile Insights.
 * Navigation only: existing sections and their persisted data remain unchanged.
 */
export const INSIGHTS750_GROUPS=Object.freeze([
 {id:'intelligence',title:'Übersicht & Intelligence',icon:'layers',default:'intelligence',tabs:[
  ['intelligence','Cockpit'],['weekly','Wochenkompass'],['capacity','Fristen & Kapazität'],['balance','Life Balance'],['connections','Zusammenhänge'],['explore','Explore']]},
 {id:'health',title:'Gesundheit & Körper',icon:'heart',default:'sleep',tabs:[
  ['sleep','Schlaf'],['energy','Body Battery'],['stress','Stress'],['body','Körperanalyse'],['strength','Krafttraining'],['nutrition','Ernährung'],['activity','Aktivitäten']]},
 {id:'life',title:'Leben & Orte',icon:'compass',default:'feelings',tabs:[
  ['feelings','Gefühlswelt'],['touch','Berührung & Nähe'],['dreamworld','Traumwelt'],['places','Orte & Weltkarte'],['recovery','Erholung']]},
 {id:'time',title:'Zeit & Produktivität',icon:'clock',default:'worktime',tabs:[
  ['worktime','Arbeitszeit'],['timejournal','Zeitjournal'],['focus','Produktivität'],['habits','Habits'],['progress','Fortschritt']]},
 {id:'sources',title:'Datenquellen',icon:'settings',default:'sources',tabs:[['sources','Datenquellen']]}
]);
export const INSIGHTS750_EXTERNAL=new Set(['activity','recovery','progress']);
export const INSIGHTS750_TABS=new Set(INSIGHTS750_GROUPS.flatMap(g=>g.tabs.map(([id])=>id)));
export const insights750Group=id=>INSIGHTS750_GROUPS.find(g=>g.id===id)||null;
export const insights750GroupFor=(activeTab,insightTab)=>
 INSIGHTS750_GROUPS.find(g=>g.tabs.some(([id])=>id===(INSIGHTS750_EXTERNAL.has(activeTab)?activeTab:insightTab)))||INSIGHTS750_GROUPS[0];
export const insights750Allowed=id=>INSIGHTS750_TABS.has(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function button(action,id,label,icon,active,ico,classname){
 return `<button type="button" class="${classname}${active?' is-active':''}" data-action="${action}" data-id="${esc(id)}" aria-current="${active?'page':'false'}" aria-pressed="${active}">${ico(icon,17)}<span>${esc(label)}</span></button>`;
}
export function insights750Sidebar(tab,insightTab,ico){
 const active=insights750GroupFor(tab,insightTab);
 return INSIGHTS750_GROUPS.map(g=>button('ins750-group',g.id,g.title,g.icon,(tab==='insights'||INSIGHTS750_EXTERNAL.has(tab))&&active.id===g.id,ico,'nav-item ins750-side-item')).join('\n');
}
export function insights750PrimaryTabs(tab,insightTab,ico){
 const active=insights750GroupFor(tab,insightTab);
 return INSIGHTS750_GROUPS.map(g=>button('ins750-group',g.id,g.title,g.icon,g.id===active.id,ico,'calm-insight-tab ins750-primary')).join('');
}
export function insights750Subtabs(tab,insightTab){
 const group=insights750GroupFor(tab,insightTab);
 if(group.tabs.length<=1)return '';
 const selected=INSIGHTS750_EXTERNAL.has(tab)?tab:insightTab;
 return `<nav class="ins750-subtabs" role="navigation" aria-label="${esc(group.title)} – Unterbereiche">${group.tabs.map(([id,label])=>`<button type="button" data-action="ins750-open" data-id="${esc(id)}" class="ins750-subtab${id===selected?' is-active':''}" aria-current="${id===selected?'page':'false'}" aria-pressed="${id===selected}">${esc(label)}</button>`).join('')}</nav>`;
}
/** Compact read-only overview: no additional data source or assumed zero days. */
export function insights750Cockpit(state,{today=new Date().toLocaleDateString('sv-SE')}={}){
 const day=/^\d{4}-\d{2}-\d{2}$/.test(today)?today:new Date().toLocaleDateString('sv-SE');
 const date=v=>new Date(`${v}T12:00:00Z`).toLocaleDateString('de-AT',{day:'numeric',month:'short'});
 const shift=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10);};
 const since=shift(day,-7),nights=(state?.healthImports?.garminNights||[]).filter(r=>r?.day>=since&&r.day<day),fit=(state?.healthImports?.fitdays||[])
  .filter(r=>typeof r?.day==='string'&&r.day<=day&&Number.isFinite(r.weightKg)).sort((a,b)=>(a.at||a.day).localeCompare(b.at||b.day));
 const tasks=Object.values(state?.tasks||{}).filter(t=>t&&!t.completed&&!t.archived&&typeof t.dueDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(t.dueDate)&&!state?.projects?.[t.projectId]?.isTemplate);
 const overdue=tasks.filter(t=>t.dueDate<day).length,soon=tasks.filter(t=>t.dueDate>=day&&t.dueDate<=shift(day,14)).length;
 const count=new Set(nights.filter(n=>['deep','light','rem'].some(k=>Number.isFinite(n?.totals?.[k]))).map(n=>n.day)).size;
 const weight=fit.at(-1),measurement=weight?`${Number(weight.weightKg).toLocaleString('de-AT',{maximumFractionDigits:1})} kg · ${esc(date(weight.day))}`:'Noch kein Fitdays-Gewicht';
 const card=(icon,title,summary,description,target)=>`<article class="ins750-hub-card"><div class="ins750-hub-card-head"><span aria-hidden="true">${icon}</span><h3>${esc(title)}</h3></div><strong>${esc(summary)}</strong><p>${esc(description)}</p><button type="button" class="secondary-btn" data-action="ins750-open" data-id="${esc(target)}">Öffnen</button></article>`;
 return `<section class="ins750-hub" aria-label="Intelligence-Cockpit">
 <div class="ins750-hub-intro"><span class="ins750-eyebrow">RELAXED CONTROL · ÜBERBLICK</span><h2>Ein Einstieg, alle Perspektiven</h2><p>Wähle über die Untertabs gezielt Wochenkompass, Kapazität, Life Balance, Zusammenhänge oder Explore. Hier stehen nur dokumentierte Daten – keine automatisch erfundene Tagesbewertung.</p></div>
 <div class="ins750-hub-grid">
 ${card('🗓️','Wochenkompass',`${count}/7 Nächte`, 'Garmin-Schlafdaten an den sieben vollständig vergangenen Kalendertagen.', 'weekly')}
 ${card('🎯','Fristen & Kapazität',`${soon} anstehend · ${overdue} überfällig`, 'Offene GTD-Fristen für die kommenden 14 Tage; Planung separat prüfen.', 'capacity')}
 ${card('⚖️','Körper & Gesundheit',measurement, 'Letzter dokumentierter Gewichtsstand; Fitdays-Messungen sind keine Live-Werte.', 'body')}
 ${card('◉','Life Balance','Persönliche Perspektiven','Lebensbereiche und ihre dokumentierte Datenabdeckung gemeinsam ansehen.', 'balance')}
 ${card('🔎','Zusammenhänge','Daten statt Vermutungen','Beobachtete zeitliche Zusammenhänge differenziert untersuchen.', 'connections')}
 ${card('⏳','Arbeitszeit & Journal','Zwei Ansichten · ein Bereich','Arbeitszeitkonto oder frei erfasste Zeit im Untertab Zeit & Produktivität.', 'worktime')}
 </div><p class="ins750-hub-note">Die bisherigen Insights, Berichte, Erfassungsdialoge und Datenquellen bleiben unverändert; nur ihre Navigation ist neu geordnet.</p></section>`;
}
