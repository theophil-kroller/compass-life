/** Compass 0.5.77.59.40.2 – discoverable, keyboard/touch/mouse location picker.
 * Pure rendering: no GPS, storage or network calls. The .39 handlers retain
 * permission-gated detection and encrypted vault persistence.
 */
import {effectiveContext39,locationSettings39,contextLinks39} from './location-context-v5775939.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={home:'Zuhause',work:'Arbeit',away:'Unterwegs',unknown:'Standort offen'};
const icons={home:'⌂',work:'▣',away:'↗',unknown:'○'};
export function locationPicker42(state){
 if(!state)return '';
 const cfg=locationSettings39(state),effective=effectiveContext39(state);
 const label=names[effective.kind]||names.unknown;
 const manual=['home','work','away','unknown'].map(kind=>
  `<button type="button" class="ctx42-choice" data-action="ctx39-manual" data-id="${kind}" aria-pressed="${cfg.mode==='manual'&&cfg.manual===kind}"><span aria-hidden="true">${icons[kind]}</span> ${names[kind]}</button>`).join('');
 const zones=['home','work'].map(kind=>{
  const zone=cfg.zones[kind];
  return `<div class="ctx42-zone"><span><strong>${names[kind]}</strong><small>${zone?`Gespeichert · ${Number(zone.radius)} m Radius`:'Noch nicht eingerichtet'}</small></span><button type="button" data-action="ctx39-set-zone" data-id="${kind}">${zone?'Neu festlegen':'Hier festlegen'}</button>${zone?`<button type="button" class="ctx42-remove" data-action="ctx39-clear-zone" data-id="${kind}" title="${names[kind]} löschen" aria-label="Ortszone ${names[kind]} entfernen">×</button>`:''}</div>`;
 }).join('');
 const links=contextLinks39(effective.kind).map(([id,text])=>`<button type="button" data-action="ctx39-go" data-id="${esc(id)}">${esc(text)}</button>`).join('');
 const status=cfg.mode==='auto'?(effective.stale?'Automatik aktiv · Standort noch nicht erkannt':`Automatisch · ${label}`):'Manuell ausgewählt';
 return `<details class="ctx42-menu" aria-label="Standortkontext"><summary class="ctx42-pin" title="Standortkontext auswählen" aria-label="Standortkontext: ${esc(label)}. Öffnen zum Auswählen"><span class="ctx42-emoji" aria-hidden="true">📍</span><span class="ctx42-pin-label">${esc(label)}</span><span class="ctx42-chevron" aria-hidden="true">⌄</span></summary>
 <div class="ctx42-popover" role="group" aria-label="Standort auswählen"><div class="ctx42-popover-head"><strong>Mein Kontext</strong><small>${esc(status)}</small></div>
 <div class="ctx42-choices" role="group" aria-label="Kontext manuell festlegen">${manual}</div>
 <button type="button" class="ctx42-auto ${cfg.mode==='auto'?'ctx42-on':''}" data-action="ctx39-auto" aria-pressed="${cfg.mode==='auto'}">${cfg.mode==='auto'?'✓ Automatisch aktiviert':'◎ Automatisch erkennen'}</button>
 <details class="ctx42-config"><summary>⚙ Standorte &amp; Radius einstellen</summary><div class="ctx42-config-inner"><p>Standortdaten werden nur im verschlüsselten Tresor gespeichert. Keine dauerhafte GPS-Überwachung und keine Cloud-Übertragung deiner Ortszonen.</p>
 <label class="ctx42-radius">Radius für neue Ortszonen <select id="ctx39-radius" aria-label="Erkennungsradius"><option value="150">150 m</option><option value="300" selected>300 m</option><option value="500">500 m</option><option value="750">750 m</option><option value="1000">1.000 m</option><option value="1500">1.500 m</option></select></label>${zones}
 <button type="button" class="ctx42-check" data-action="ctx39-check">📍 Standort jetzt prüfen</button><small>Die automatische Prüfung läuft nur bei sichtbarer App, höchstens alle 30 Minuten und nur nach bereits erteilter Browser-Freigabe. Zur erstmaligen Standortbestimmung kann der Browser nach deiner Erlaubnis fragen.</small></div></details>
 <div class="ctx42-links" aria-label="Passende Ansichten"><small>Passende Ansichten</small><div>${links}</div></div><button type="button" class="ctx42-recommend" data-action="ctx40-toggle">✦ Was passt jetzt? · Vorschläge</button>
 </div></details>`;
}
