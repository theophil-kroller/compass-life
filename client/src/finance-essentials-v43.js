/** Compass 0.5.43 · Explainable three-completed-month spending and optional personal cost classes.
 * No inferred bank balances, no reclassification of pending transfers/cash/refunds.
 */
import {FINANCE_CATEGORIES} from './finance-core.js';
import {wealthSummary} from './finance-wealth-consolidation.js';
const h=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const monthShift=(month,n)=>{const [y,m]=month.split('-').map(Number);return new Date(Date.UTC(y,m-1+n,1)).toISOString().slice(0,7);};
export const COST_CLASSES=[['essential','Notwendig'],['flexible','Flexibel'],['optional','Verzichtbar'],['unclassified','Noch nicht zugeordnet']];
export const COST_CATEGORY_KEYS=new Set(FINANCE_CATEGORIES.filter(x=>!['Einnahmen','Transfer','Rückerstattung','Bargeld','Prüfen'].includes(x[0])).map(x=>x.join(' / ')));
export function checkedCostClass(category,value){if(!COST_CATEGORY_KEYS.has(category)||!COST_CLASSES.some(x=>x[0]===value))throw Error('Ungültige Klassifizierung.');return value;}
export function threeMonthCostModel(transactions=[],today=new Date().toISOString().slice(0,10),classes={}){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(today)||!Number.isFinite(Date.parse(today)))throw Error('Ungültiger Stichtag.');
 const months=[3,2,1].map(n=>monthShift(today.slice(0,7),-n));
 const all=Array.isArray(transactions)?transactions:[];
 const valid=all.filter(t=>/^\d{4}-\d{2}-\d{2}$/.test(t.day||'')&&months.includes(t.day.slice(0,7)));
 const observed=months.map(month=>({month,rows:valid.filter(t=>t.day.startsWith(month)).length}));
 const complete=observed.every(x=>x.rows>0); // Presence is NOT a guarantee that bank exports are complete.
 const spending=valid.filter(t=>!t.needsReview&&t.flow==='expense'&&Number.isSafeInteger(t.amountCents)&&t.amountCents<0);
 const sums={essential:0,flexible:0,optional:0,unclassified:0};const cats=new Map();
 for(const t of spending){const cat=String(t.category||'');const cents=-t.amountCents;const key=Object.hasOwn(classes||{},cat)?classes[cat]:'unclassified';const cls=COST_CLASSES.some(x=>x[0]===key)?key:'unclassified';sums[cls]+=cents;cats.set(cat,(cats.get(cat)||0)+cents);}
 const total=Object.values(sums).reduce((a,b)=>a+b,0);
 const classified=sums.unclassified===0&&spending.length>0;
 const byMonth=months.map(month=>({month,cents:spending.filter(t=>t.day.startsWith(month)).reduce((a,t)=>a-t.amountCents,0)}));
 return {months,observed,complete,classified,totals:sums,total,average:complete?Math.round(total/3):null,monthly:byMonth,categories:[...cats].sort((a,b)=>b[1]-a[1]).map(([category,cents])=>({category,cents,className:Object.hasOwn(classes||{},category)?classes[category]:'unclassified'})),pendingCount:valid.filter(t=>t.needsReview&&t.amountCents<0).length,cashCount:valid.filter(t=>t.flow==='cash').length};
}
export function observedLiquidity(state={},today=new Date().toISOString().slice(0,10)){
 const records=wealthSummary(state).observed.filter(x=>x.type==='bank'&&x.day<=today);if(!records.length)return {cents:null,old:true,latest:null,count:0};
 const latest=records.reduce((a,x)=>!a||a<x.day?x.day:a,null);const oldest=records.reduce((a,x)=>!a||a>x.day?x.day:a,null);const days=Math.floor((Date.parse(today+'T12:00:00Z')-Date.parse(oldest+'T12:00:00Z'))/86400000);
 return {cents:records.reduce((sum,x)=>sum+x.cents,0),old:days>35||days<0,latest,count:records.length};
}
const options=(cls)=>COST_CLASSES.map(([v,label])=>`<option value="${v}" ${cls===v?'selected':''}>${label}</option>`).join('');
export function financeNecessitiesView(state={},transactions=[],today=new Date().toISOString().slice(0,10),{compact=false}={}){
 const m=threeMonthCostModel(transactions,today,state.financeCostClasses||{}),liq=observedLiquidity(state,today);
 const means=Object.fromEntries(Object.entries(m.totals).map(([k,v])=>[k,m.complete?Math.round(v/3):null]));
 const runway=liq.cents!==null&&!liq.old&&means.essential>0&&m.classified&&m.complete?liq.cents/means.essential:null;
 const readiness=m.complete?'3 Kalendermonate mit Buchungen':'Mindestens ein Kalendermonat ohne importierte Buchungen';
 const panels=[['Ø Konsum / Monat',m.average===null?'–':eur(m.average),'Letzte 3 abgeschlossene Monate'],['Notwendig / Monat',means.essential===null?'–':eur(means.essential),'Nur von dir zugeordnete Kategorien'],['Flexibel + verzichtbar',means.flexible===null?'–':eur(means.flexible+means.optional),'Mögliches, nicht garantiertes Sparpotenzial'],['Liquiditätsreichweite',runway===null?'–':`${runway.toLocaleString('de-AT',{maximumFractionDigits:1})} Mon.`,'Nur aus belegten Bankbeständen']];
 const row=(item)=>`<article class="fin43-cost-row"><span title="${h(item.category)}">${h(item.category)}</span><b>${eur(item.cents)}</b><select aria-label="Kostenart für ${h(item.category)}" data-finance-cost-class="${h(item.category)}">${options(item.className)}</select></article>`;
 return `<section class="fin43-costs ${compact?'fin43-costs-compact':''}" aria-label="Pflicht, flexibel und verzichtbare Ausgaben">
 <div class="fin43-stat-grid">${panels.map(([title,value,note])=>`<article class="fin43-stat"><small>${h(title)}</small><strong>${h(value)}</strong><span>${h(note)}</span></article>`).join('')}</div>
 ${compact?`<div class="fin43-inline-help"><span>${h(readiness)} · ${m.categories.filter(x=>x.className==='unclassified').length} Kategorien noch nicht zugeordnet</span><button type="button" class="fin43-text-link" data-action="finance-pane" data-id="Pflicht & Luxus">Kostenarten zuordnen →</button></div>`:
 `<div class="fin43-cost-layout"><section class="fin43-class-breakdown"><h3>Was ist notwendig, was kann ich verändern?</h3><p>Ordne jede Ausgabenkategorie selbst ein. Ohne Zuordnung bleibt sie offen – Compass erklärt keine persönlichen Ausgaben automatisch zu Luxus.</p>${COST_CLASSES.map(([key,label])=>`<div class="fin43-cost-total"><span>${h(label)}</span><b>${m.complete?eur(Math.round(m.totals[key]/3))+' / Monat':'–'}</b><div class="fin43-cost-rail"><i class="fin43-color-${key}" style="width:${m.total?(100*m.totals[key]/m.total).toFixed(2):0}%"></i></div></div>`).join('')}</section>
 <section class="fin43-cost-review"><h3>Kategorien einordnen</h3><p>Die Auswahl wird lokal gespeichert und im verschlüsselten privaten Geräteabgleich berücksichtigt. Einzelne Buchungen können unterschiedliche Zwecke haben; deren Kategorie bei Bedarf zuvor in „Buchungen“ präzisieren.</p><div class="fin43-cost-table">${m.categories.map(row).join('')||'<p>Nach einem Bankimport erscheinen hier bestätigte Ausgabenkategorien.</p>'}</div></section></div>`}
 <p class="fin43-method">${h(readiness)} · ${m.pendingCount} ungeklärte Auszahlungen · ${m.cashCount} Bargeldbuchungen separat. Buchungsabdeckung ist nicht garantiert. ${liq.latest?`Bankbestände: ${h(liq.latest)} (${liq.count} erfasste Konten)${liq.old?' · veraltet':''}.`:'Keine bestätigten Bankguthaben erfasst.'} Reichweite ist nur bei vollständiger Kategoriezuordnung und zeitnahen Bankbeständen berechenbar. Keine automatische Saldo-Hochrechnung.</p></section>`;
}
