/** Compass 0.5.8 – intentional future-finance scaffold. No data collection or bank connection. */
export const FINANCE_PANES=[
 {title:'Überblick',icon:'layers',text:'Cashflow und Vermögensentwicklung auf einen Blick'},
 {title:'Cashflow',icon:'sync',text:'Einnahmen, Ausgaben und Umbuchungen'},
 {title:'Einnahmen',icon:'trendingUp',text:'Geldquellen und Eingangstrends'},
 {title:'Ausgaben',icon:'activity',text:'Kategorien, Monatsvergleich und Geldflüsse'},
 {title:'Prognose',icon:'chart',text:'Muster, Szenarien und Prognosen'},
 {title:'Fixkosten',icon:'calendar',text:'Regelmäßige Zahlungen, Verträge und Abos'},
 {title:'Sparpotenzial',icon:'target',text:'Veränderungen erkennen und selbst bewerten'},
 {title:'Reisen',icon:'map',text:'Buchungen zu Reisen zuordnen und Kosten vergleichen'},
 {title:'Portfolio',icon:'folder',text:'Wertpapiere, Kraken, flatex und Anlageerträge'}
];
export const FINANCE_EXPORTS=[
 {label:'Bank / Kreditkarte',description:'Im Online-Banking Umsätze als CSV, CAMT oder MT940 exportieren. Das genaue Format hängt von deiner Bank ab.',href:null},
 {label:'N26 / DKB',description:'Exportiere Giro- und Kartenumsätze als CSV. Compass erkennt N26, DKB Giro und DKB Visa automatisch anhand ihrer Spalten.',href:null},
 {label:'Kraken',description:'Kraken Pro → Profil → Statements → Export Statement; Trades, Ledgers und Balances als CSV auswählen.',href:'https://support.kraken.com/de/articles/14320306955668-how-to-export-your-account-history'},
 {label:'flatex Österreich',description:'flatex classic → Konto & Depot → Konto-/Depotumsätze; Zeitraum wählen. Exportformat im eigenen Depot prüfen.',href:'https://www.flatex.at/produkte-handel/plattformen/flatex-classic/'}
];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function financePreviewView(ico=()=>'',selected='Überblick'){
 return `<div class="finance-preview" aria-label="Compass Finanzen · Planung"><header class="finance-preview-hero"><div><span class="insight-kicker">COMPASS / PERSONAL FINANCE</span><h2>Finanzen. Ein klarer Blick.</h2><p>Hier entsteht später dein lokales Finanz-Dashboard – ohne ungefragte Kontoverbindungen oder Datenübertragung.</p></div><span class="finance-status">Vorgemerkt · noch kein Import</span></header>
 <div class="finance-preview-grid">${FINANCE_PANES.map(p=>`<button type="button" data-action="finance-pane" data-id="${esc(p.title)}" class="finance-preview-pane ${selected===p.title?'is-selected':''}">${ico(p.icon,19)}<span><strong>${esc(p.title)}</strong><small>${esc(p.text)}</small></span></button>`).join('')}</div>
 <section class="finance-export-help"><span class="insight-kicker">QUELLEN VORBEREITEN</span><h3>Wo finde ich später meine Daten?</h3><p class="muted-line">Die Quellen sind nur Anleitungen und Links. Noch werden keine Finanzdateien eingelesen oder gespeichert.</p>
 ${FINANCE_EXPORTS.map(e=>`<div class="finance-export-row"><div><strong>${esc(e.label)}</strong><small>${esc(e.description)}</small></div>${e.href?`<a href="${esc(e.href)}" target="_blank" rel="noopener noreferrer">Anleitung ↗</a>`:'<span class="quiet-tag">Je nach Bank</span>'}</div>`).join('')}</section>
 <p class="insight-footnote">Geplant: Transaktionen und sensible Kontodaten bleiben verschlüsselt im lokalen Vault. Investments werden nicht als Konsumausgaben gezählt. Bitte hier noch keine Bankdaten hochladen.</p></div>`;
}
