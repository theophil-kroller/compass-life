/** Compass 0.5.77.59.40.3 – compact icon-first location picker.
 * Keeps the .39 handlers and encrypted local storage, but reduces text and
 * uses a mobile-safe bottom sheet so the menu is never clipped on phones.
 */
import {effectiveContext39,locationSettings39,contextLinks39} from './location-context-v5775939.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={home:'Zuhause',work:'Arbeit',away:'Unterwegs',unknown:'Standort offen'};
const icons={home:'⌂',work:'▣',away:'↗',unknown:'○'};
const linkIcons={
 next:'✓',
 inbox:'＋',
 people:'👥',
 forecast:'🗓',
 insights:'◔'
};
export function locationPicker43(state){
 if(!state)return '';
 const cfg=locationSettings39(state),effective=effectiveContext39(state),kind=effective.kind||'unknown';
 const status=cfg.mode==='auto'?(effective.stale?'Auto · offen':`Auto · ${names[kind]}`):`Manuell · ${names[kind]}`;
 const manual=['home','work','away','unknown'].map(k=>
  `<button type="button" class="ctx43-choice${cfg.mode==='manual'&&cfg.manual===k?' is-active':''}" data-action="ctx39-manual" data-id="${k}" aria-pressed="${cfg.mode==='manual'&&cfg.manual===k}" aria-label="${names[k]}" title="${names[k]}"><span aria-hidden="true">${icons[k]}</span></button>`
 ).join('');
 const zones=['home','work'].map(k=>{
  const zone=cfg.zones[k];
  return `<div class="ctx43-zone"><span class="ctx43-zone-icon" aria-hidden="true">${icons[k]}</span><div class="ctx43-zone-copy"><strong>${names[k]}</strong><small>${zone?`Gespeichert · ${Number(zone.radius)} m`:'Noch nicht festgelegt'}</small></div><button type="button" data-action="ctx39-set-zone" data-id="${k}">${zone?'Neu setzen':'Festlegen'}</button>${zone?`<button type="button" class="ctx43-remove" data-action="ctx39-clear-zone" data-id="${k}" aria-label="${names[k]} entfernen" title="${names[k]} löschen">×</button>`:''}</div>`;
 }).join('');
 const links=contextLinks39(kind).map(([id,text])=>`<button type="button" class="ctx43-link" data-action="ctx39-go" data-id="${esc(id)}" aria-label="${esc(text)}" title="${esc(text)}"><span aria-hidden="true">${linkIcons[id]||'•'}</span></button>`).join('');
 return `<details class="ctx43-menu" aria-label="Standortkontext"><summary class="ctx43-pin" title="Standortkontext auswählen" aria-label="Standortkontext: ${esc(names[kind])}. Öffnen zum Auswählen"><span class="ctx43-pin-glyph" aria-hidden="true">📍</span><span class="ctx43-current" aria-hidden="true">${icons[kind]}</span><span class="ctx43-chevron" aria-hidden="true">⌄</span></summary>
 <div class="ctx43-popover" role="group" aria-label="Standort auswählen"><div class="ctx43-topline"><small>${esc(status)}</small><div class="ctx43-mini-actions"><button type="button" class="ctx43-mini${cfg.mode==='auto'?' is-active':''}" data-action="ctx39-auto" aria-pressed="${cfg.mode==='auto'}" aria-label="Automatisch erkennen" title="Automatisch erkennen">◎</button><button type="button" class="ctx43-mini" data-action="ctx39-check" aria-label="Standort jetzt prüfen" title="Standort jetzt prüfen">📍</button><button type="button" class="ctx43-mini" data-action="ctx40-toggle" aria-label="Was passt jetzt?" title="Was passt jetzt?">✦</button></div></div>
 <div class="ctx43-choices" role="group" aria-label="Kontext manuell wählen">${manual}</div>
 <div class="ctx43-links" aria-label="Passende Ansichten">${links}</div>
 <details class="ctx43-config"><summary title="Orte und Radius einstellen" aria-label="Orte und Radius einstellen">⚙ <span>Einstellungen</span></summary><div class="ctx43-config-inner"><label class="ctx43-radius">Radius <select id="ctx39-radius" aria-label="Erkennungsradius"><option value="150">150 m</option><option value="300" selected>300 m</option><option value="500">500 m</option><option value="750">750 m</option><option value="1000">1.000 m</option><option value="1500">1.500 m</option></select></label>${zones}<small>Ortszonen werden nur lokal im verschlüsselten Tresor gespeichert. Keine Dauerüberwachung und keine Cloud-Übertragung.</small></div></details>
 </div></details>`;
}
