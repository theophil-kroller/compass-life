/** Early navigation for finance, even when heavy analytics are lazily loaded. */
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function financeQuickNavView(state={},pane='Überblick',options={}){
 const rows=Array.isArray(state.financeTransactions)?state.financeTransactions:[];
 const pending=rows.filter(t=>t?.needsReview).length;
 const queued=(state.financeMobileDecisions||[]).filter(d=>d.status==='pending').length;
 const conflicts=(state.financeMobileDecisions||[]).filter(d=>d.status==='conflict').length;
 const items=[['Überblick','Übersicht'],['Buchungen','Buchungen'],['Prüfen',`Unklassifiziert (${pending})`]];
 return `<nav class="fin79-quick-nav" aria-label="Finanzbereiche">${items.map(([id,label])=>`<button type="button" data-action="finance-pane" data-id="${safe(id)}" class="fin79-nav-btn ${pane===id?'is-active':''}" ${pane===id?'aria-current="page"':''}>${safe(label)}</button>`).join('')}</nav>`+
 (queued?`<div class="fin79-sync-status" role="status">${queued} Zuordnung${queued===1?'':'en'} lokal verschlüsselt vorgemerkt · Abgleich mit Hauptgerät ausstehend</div>`:'')+(conflicts?`<div class="fin79-sync-status" role="alert">${conflicts} Buchung${conflicts===1?'':'en'} konnte${conflicts===1?'':'n'} wegen veränderter Quelldaten nicht zugeordnet werden. Bitte Finanzdaten aktualisieren.</div>`:'');
}
