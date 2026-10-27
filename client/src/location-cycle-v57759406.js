/** Compass .59.40.6 – 2-icon location control: pin settings + one-tap cycle. */
import {locationSettings39,effectiveContext39} from './location-context-v5775939.js';
const names={home:'Zuhause',work:'Arbeit',away:'Unterwegs',unknown:'Alle Kontexte'};
const icons={home:'⌂',work:'💼',away:'👤',unknown:'◎'};
export const CYCLE_CONTEXTS46=Object.freeze(['home','work','away','unknown']);
export const nextLocationContext46=kind=>CYCLE_CONTEXTS46[(Math.max(0,CYCLE_CONTEXTS46.indexOf(kind))+1)%4];
export function locationCycle46(state){
 if(!state)return '';
 const config=locationSettings39(state),effective=effectiveContext39(state),kind=effective.kind||'unknown';
 const zones=['home','work'].map(k=>{const z=config.zones[k];return `<div class="ctx46-zone"><span>${icons[k]} ${names[k]} <small>${z?`${Number(z.radius)} m`:'nicht eingerichtet'}</small></span><button type="button" data-action="ctx39-set-zone" data-id="${k}">${z?'Neu setzen':'Festlegen'}</button>${z?`<button type="button" data-action="ctx39-clear-zone" data-id="${k}" aria-label="${names[k]} entfernen">×</button>`:''}</div>`;}).join('');
 return `<div class="ctx46-pair" aria-label="Standort und Kontext">
 <details class="ctx46-settings"><summary class="ctx46-pin" aria-label="Standortverwaltung öffnen" title="Standortverwaltung · GPS und Automatik">📍</summary><div class="ctx46-sheet" role="group" aria-label="GPS-Einstellungen"><div class="ctx46-head"><strong>Standort</strong><small>${config.mode==='auto'?'Automatisch':'Manuell'}</small></div><button type="button" data-action="ctx39-auto" aria-pressed="${config.mode==='auto'}">◎ Automatisch erkennen ${config.mode==='auto'?'✓':''}</button><button type="button" data-action="ctx39-check">📍 Jetzt prüfen</button><label>Radius <select id="ctx39-radius" aria-label="Ortsradius"><option value="150">150 m</option><option value="300" selected>300 m</option><option value="500">500 m</option><option value="750">750 m</option><option value="1000">1000 m</option><option value="1500">1500 m</option></select></label>${zones}<small>Ortszonen lokal verschlüsselt. Kein GPS-Tracking im Hintergrund.</small></div></details>
 <button type="button" class="ctx46-cycle" data-action="ctx46-cycle" aria-label="Kontext ${names[kind]}. Weiter: ${names[nextLocationContext46(kind)]}" title="${names[kind]} · Klicken zum Wechseln" aria-live="polite"><span aria-hidden="true">${icons[kind]}</span></button></div>`;
}
