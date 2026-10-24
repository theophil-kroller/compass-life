/** Compass 0.5.77.37.1 · Knappe kcal-Datenlücken direkt beim Tageswert.
 * Keine fehlende Angabe wird als null behandelt; kein Tagebuch-Eintrag wird verändert.
 * Native <details> supports touch + keyboard, CSS adds desktop hover.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function nutritionMissingEnergyPill(row){
 const unknown=Array.isArray(row?.missingItems)?row.missingItems:[];
 const supplements=Array.isArray(row?.supplementItems)?row.supplementItems:[];
 const all=[...unknown.map(x=>({...x,supplement:false})),...supplements.map(x=>({...x,supplement:true}))];
 if(!all.length)return '';
 const count=all.length,allSupplements=unknown.length===0;
 const symbol=allSupplements?'💊':'ⓘ',label=`${count} ohne kcal`;
 const names=all.map(x=>x.title||'Unbekanntes Lebensmittel').join(' · ');
 const items=all.map(item=>`<div class="n577-pill-item"><span class="n577-pill-name">${esc(item.emoji||'🍽️')} <strong>${esc(item.title||'Lebensmittel')}</strong></span><small>${esc(item.supplement?'Nahrungsergänzung · keine kcal-Deklaration; kein Nullwert angenommen':item.reason||'Energiewert derzeit unbekannt')}</small>${!item.supplement&&item.id?`<button type="button" data-action="pj92-food-edit" data-id="${esc(item.id)}" class="n577-pill-edit">Eintrag prüfen</button>`:''}</div>`).join('');
 return `<details class="n577-pill-details"><summary class="n577-mini-pill" aria-label="${esc(`${count} Einträge ohne kcal-Angabe. ${names}`)}" title="${esc(names)}"><span aria-hidden="true">${symbol}</span> ${esc(label)}</summary><div class="n577-pill-popover" aria-label="Namen der Einträge ohne kcal-Angabe"><strong class="n577-pill-heading">${count} ${count===1?'Eintrag':'Einträge'} ohne kcal-Angabe</strong>${items}</div></details>`;
}
