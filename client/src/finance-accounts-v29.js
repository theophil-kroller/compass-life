/** Compass Finance 0.5.29 · Sources are ledger activity, NOT inferred balances.
 * Account balances below are only genuine, manually recorded wealth snapshots.
 */
import {accountFor,accountLabel} from './finance-revolut.js';
import {validateWealthSnapshot} from './finance-wealth-consolidation.js';
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
function groupFor(id){if(id.startsWith('dkb:visa:')||id.includes(':card:'))return 'Karten';if(id.startsWith('n26:space:'))return 'Unterkonten';return 'Bankkonten';}
export function accountActivityModel(transactions=[],periodRows=transactions){
 const map=new Map(),all=Array.isArray(transactions)?transactions:[],subset=Array.isArray(periodRows)?periodRows:[];
 for(const t of all){const id=accountFor(t);if(!map.has(id))map.set(id,{id,label:accountLabel(t),group:groupFor(id),transactions:0,first:null,last:null,incomeCents:0,outCents:0,unknown:0});const v=map.get(id);v.transactions++;if(/^\d{4}-\d{2}-\d{2}$/.test(t.day||'')){v.first=!v.first||t.day<v.first?t.day:v.first;v.last=!v.last||t.day>v.last?t.day:v.last;}}
 for(const t of subset){const id=accountFor(t),entry=map.get(id);if(!entry)continue;if(!Number.isSafeInteger(t.amountCents))continue;if(t.needsReview){entry.unknown++;continue;}if(t.amountCents>0)entry.incomeCents+=t.amountCents;else entry.outCents-=t.amountCents;}
 return [...map.values()].sort((a,b)=>a.group.localeCompare(b.group,'de')||a.label.localeCompare(b.label,'de'));
}
export function recordedAccountSnapshots(items=[]){
 const map=new Map();for(const raw of Array.isArray(items)?items:[]){let x;try{x=validateWealthSnapshot(raw);}catch{continue;}const key=x.type+'|'+x.label.toLocaleLowerCase('de');if(!map.has(key)||x.day>map.get(key).day)map.set(key,x);}
 return [...map.values()].sort((a,b)=>a.type.localeCompare(b.type)||a.label.localeCompare(b.label,'de'));
}
export function financeAccountsView(state={},periodRows=[],today=''){
 const transactions=state.financeTransactions||[],accounts=accountActivityModel(transactions,periodRows),snapshots=recordedAccountSnapshots(state.financeWealthSnapshots);
 const groups=['Bankkonten','Karten','Unterkonten'];
 return `<section class="fin-accounts" aria-label="Konten nach Quelle"><div class="fin-art-heading"><div><small>ACCOUNTS / KONTENQUELLEN</small><h3>Konten im Überblick</h3><p class="fin-accounts-intro">Umsatzbewegungen sind keine Kontostände. Echte Bewertungsstände stehen getrennt darunter.</p></div><span class="fin-art-tag">${accounts.length} Datenquellen</span></div>
 ${groups.map(group=>{const rows=accounts.filter(a=>a.group===group);return rows.length?`<div class="fin-accounts-group"><div class="fin-accounts-group-head"><h4>${group}</h4><span>${rows.length} ${rows.length===1?'Quelle':'Quellen'}</span></div>${rows.map(a=>`<button type="button" class="fin-account-line" data-action="finance-account-pick" data-id="${h(a.id)}"><span class="fin-account-avatar">${h(a.label.trim().slice(0,1).toUpperCase())}</span><span class="fin-account-title"><strong>${h(a.label)}</strong><small>${a.transactions.toLocaleString('de-AT')} Buchungen · ${h(a.first||'–')} bis ${h(a.last||'–')}</small></span><span class="fin-account-movements"><b>− ${eur(a.outCents)}</b><small>Abgänge im gewählten Zeitraum</small></span><span class="fin-account-arrow">›</span></button>`).join('')}</div>`:'';}).join('')||'<p class="insight-no-data">Noch keine Kontoumsätze importiert.</p>'}
 <section class="fin-account-snapshots"><div class="fin-accounts-group-head"><h4>Dokumentierte Konten- und Depotwerte</h4><span>Manuell bestätigt · Stand je Quelle</span></div>${snapshots.length?`<div class="fin-account-snapshot-list">${snapshots.map(s=>`<div class="fin-account-snapshot-row"><span><strong>${h(s.label)}</strong><small>${h(s.type==='liability'?'Verbindlichkeit':s.type==='bank'?'Bankbestand':s.type==='flatex'?'Depotwert':'Sonstiger Wert')} · ${h(s.day)}</small></span><strong>${s.type==='liability'?'− ':''}${eur(s.cents)}</strong></div>`).join('')}</div>`:'<p class="fin-accounts-intro">Noch keine manuellen Kontostände gespeichert. Im Bereich Portfolio kannst du einen echten Bewertungsstand erfassen.</p>'}<button type="button" class="secondary-btn" data-action="finance-pane" data-id="Portfolio">Bewertungsstände im Portfolio pflegen →</button></section>
 <p class="fin-disclaimer">Ein Klick auf eine Kontozeile filtert die Finanzbuchungen nach dieser Quelle. „Abgänge“ enthalten auch Eigenüberträge, Bargeld und offene Fälle; sie sind daher ausdrücklich kein Konsumbudget. Manuelle Bestände können andere Stichtage haben als die Buchungen und dürfen nicht zu einer erfundenen Zeitreihe verbunden werden.</p></section>`;
}
