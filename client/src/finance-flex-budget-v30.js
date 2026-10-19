/** Compass 0.5.30 — opt-in finance plans; never invents account balances or transaction coverage.
 * All entries are stored only in the encrypted local vault. No server migration.
 */
import {FINANCE_CATEGORIES,escapeFinance} from './finance-core.js';
const h=escapeFinance;
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const safeInt=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
export const FLEX_GROUPS=Object.freeze([
  {id:'fixed',label:'Fix',detail:'Regelmäßige Verpflichtungen',color:'#397B70'},
  {id:'flexible',label:'Flexibel',detail:'Monatlich gestaltbare Ausgaben',color:'#56A7A0'},
  {id:'nonmonthly',label:'Unregelmäßig',detail:'Jahresbudget statt falscher Monatsgrenze',color:'#C29063'}
]);
export const BUDGET_CATEGORIES=Object.freeze(FINANCE_CATEGORIES.filter(([a])=>!['Einnahmen','Transfer','Bargeld','Rückerstattung','Prüfen'].includes(a)).map(row=>row.join(' / ')));
const categories=new Set(BUDGET_CATEGORIES);
const dateValid=v=>{if(!/^\d{4}-\d\d-\d\d$/.test(String(v||'')))return false;const date=new Date(`${v}T12:00:00Z`);return Number.isFinite(+date)&&date.toISOString().slice(0,10)===v;};
const monthValid=v=>/^\d{4}-(0[1-9]|1[0-2])$/.test(String(v||''));
export function validateBudgetEntry(value){
 const {category,group,limitCents}=value||{};
 if(!categories.has(category)||!FLEX_GROUPS.some(g=>g.id===group)||!safeInt(limitCents,1,100_000_000_000))throw Error('Ungültiges Budget: Kategorie, Gruppe und Betrag prüfen.');
 return {category,group,limitCents};
}
export function putBudgetEntry(list=[],raw){
 const next=validateBudgetEntry(raw);if(!Array.isArray(list))throw Error('Ungültige Budgetliste.');
 if(list.length>=BUDGET_CATEGORIES.length&&!list.some(x=>x.category===next.category))throw Error('Zu viele Budgets.');
 return [...list.filter(x=>x.category!==next.category),next].sort((a,b)=>a.category.localeCompare(b.category,'de'));
}
export function validateSavingsGoal(input){
 const {id,title,kind,targetCents,savedCents,targetDay='',updatedDay=''}=input||{};
 if(!/^[a-z0-9-]{5,75}$/i.test(String(id||''))||typeof title!=='string'||title.trim().length<2||title.trim().length>90||!['savings','reserve'].includes(kind)||!safeInt(targetCents,1,100_000_000_000)||!safeInt(savedCents,0,100_000_000_000)||targetDay&&!dateValid(targetDay)||updatedDay&&!dateValid(updatedDay))throw Error('Ungültiges Finanzziel: Name, Beträge und Datum prüfen.');
 return {id,title:title.trim(),kind,targetCents,savedCents,targetDay,updatedDay};
}
export function putSavingsGoal(list=[],raw){
 const goal=validateSavingsGoal(raw);
 if(!Array.isArray(list)||list.length>=51)throw Error('Zu viele Finanzziele.');
 if(list.length>=50&&!list.some(x=>x.id===goal.id))throw Error('Maximal 50 Finanzziele.');
 return [...list.filter(x=>x.id!==goal.id),goal];
}
export function goalProjection(goal,today){
 const g=validateSavingsGoal(goal),remaining=Math.max(0,g.targetCents-g.savedCents);
 if(!g.targetDay||!dateValid(today))return {remaining,monthly:null};
 const [y,m]=g.targetDay.slice(0,7).split('-').map(Number),[ny,nm]=today.slice(0,7).split('-').map(Number);
 const months=Math.max(0,(y-ny)*12+m-nm+(g.targetDay.slice(8)<today.slice(8)?0:1));
 return {remaining,monthly:months>0?Math.ceil(remaining/months):null};
}
/** Never mix a monthly reserve with actual yearly spending: different units/time horizons. */
export function flexBudgetModel(transactions=[],entries=[],month='2026-10'){
 if(!monthValid(month))throw Error('Ungültiger Budgetmonat.');
 const valid=[];const used=new Set();
 for(const raw of Array.isArray(entries)?entries:[]){try{const x=validateBudgetEntry(raw);if(!used.has(x.category)){valid.push(x);used.add(x.category);}}catch{/* Legacy/corrupted budget rows cannot block finance overview. */}}
 const ym=month.slice(0,4),monthSpend=new Map(),ytdSpend=new Map();
 const eligible=(Array.isArray(transactions)?transactions:[]).filter(x=>x&&x.needsReview===false&&x.flow==='expense'&&Number.isSafeInteger(x.amountCents)&&x.amountCents<0&&typeof x.day==='string'&&/^\d{4}-\d\d-\d\d$/.test(x.day));
 let monthlyTotal=0,unbudgeted=0,missingCategory=0;
 for(const tx of eligible){const monthKey=tx.day.slice(0,7),c=String(tx.category||''),amount=-tx.amountCents;if(monthKey===month){monthlyTotal+=amount;monthSpend.set(c,(monthSpend.get(c)||0)+amount);if(!used.has(c))unbudgeted+=amount;}
  if(monthKey>=`${ym}-01`&&monthKey<=month)ytdSpend.set(c,(ytdSpend.get(c)||0)+amount);
  if(monthKey===month&&!categories.has(c))missingCategory+=amount;
 }
 const groups=FLEX_GROUPS.map(g=>{
  const rows=valid.filter(x=>x.group===g.id).map(x=>({...x,spentCents:g.id==='nonmonthly'?ytdSpend.get(x.category)||0:monthSpend.get(x.category)||0,monthSpentCents:monthSpend.get(x.category)||0}));
  const budgetCents=rows.reduce((s,x)=>s+x.limitCents,0),spentCents=rows.reduce((s,x)=>s+x.spentCents,0);
  return {...g,rows,budgetCents,spentCents,remainingCents:budgetCents-spentCents,provisionCents:g.id==='nonmonthly'?Math.round(budgetCents/12):null};
 });
 return {month,groups,unbudgetedCents:unbudgeted,missingCategoryCents:missingCategory,monthlyTotalCents:monthlyTotal,configured:valid.length,eligibleCount:eligible.length};
}
const monthText=month=>new Intl.DateTimeFormat('de-AT',{month:'long',year:'numeric'}).format(new Date(`${month}-15T12:00:00`));
export function financeBudgetGoalsView(state={},month='2026-10',today='2026-10-19'){
 const validMonth=monthValid(month)?month:today.slice(0,7);
 const model=flexBudgetModel(state.financeTransactions||[],state.financeFlexBudgets||[],validMonth);
 const goals=(Array.isArray(state.financeSavingsGoals)?state.financeSavingsGoals:[]).flatMap(x=>{try{return [validateSavingsGoal(x)];}catch{return [];}});
 const groups=model.groups.map(g=>{
  const percent=g.budgetCents?Math.min(100,100*g.spentCents/g.budgetCents):0;
  const isYearly=g.id==='nonmonthly',periodText=isYearly?`Januar bis ${monthText(validMonth)} · Jahresbudget`:`${monthText(validMonth)} · Monatsbudget`;
  return `<article class="fin30-group" style="--fin30-accent:${g.color}"><header><div><strong>${h(g.label)}</strong><small>${h(g.detail)}</small></div><span class="fin30-number">${g.rows.length} Kategorien</span></header>
  <div class="fin30-totals"><span><strong>${h(eur(g.spentCents))}</strong><small>ausgegeben · ${h(periodText)}</small></span><span><strong>${g.budgetCents? h(eur(g.budgetCents)):'–'}</strong><small>${isYearly?'Jahresbudget':'Monatsbudget'}</small></span></div>
  <div class="fin30-track" role="progressbar" aria-label="${h(g.label)} Budgetnutzung" aria-valuenow="${Math.round(percent)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent.toFixed(1)}%"></span></div>
  <div class="fin30-summary">${g.budgetCents?`<span class="${g.remainingCents<0?'fin30-over':''}">${g.remainingCents>=0?h(eur(g.remainingCents))+' verbleibend':h(eur(-g.remainingCents))+' über Budget'}</span>`:'<span>Noch kein Budget festgelegt</span>'}${isYearly&&g.budgetCents?`<span>${h(eur(g.provisionCents))} monatliche Rücklage (Planwert)</span>`:''}</div>
  ${g.rows.length?`<div class="fin30-lines">${g.rows.map(r=>`<div class="fin30-line"><div><span>${h(r.category)}</span><small>${h(eur(r.spentCents))} / ${h(eur(r.limitCents))}</small></div><div class="fin30-line-actions"><button type="button" class="fin30-textbtn" data-action="finance-budget-edit" data-id="${h(r.category)}" aria-label="Budget ${h(r.category)} bearbeiten">Bearbeiten</button><button type="button" class="fin30-iconbtn" data-action="finance-budget-remove" data-id="${h(r.category)}" aria-label="Budget ${h(r.category)} entfernen">×</button></div></div>`).join('')}</div>`:'<p class="fin30-empty">Füge eine Kategorie hinzu, wenn du für diesen Bereich einen Rahmen setzen möchtest.</p>'}
  </article>`;
 }).join('');
 const current=new Date(`${validMonth}-15T12:00:00Z`),previous=new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth()-1,15)),next=new Date(Date.UTC(current.getUTCFullYear(),current.getUTCMonth()+1,15));
 const key=d=>d.toISOString().slice(0,7);
 const categoryOptions=BUDGET_CATEGORIES.map(category=>`<option value="${h(category)}">${h(category)}</option>`).join('');
 return `<div class="fin30-panel" aria-label="Flex Budgeting und Sparziele"><header class="fin30-header"><div><span class="insight-kicker">COMPASS / BUDGET & ZIELE</span><h3>Mein finanzieller Spielraum</h3><p>Nur bestätigte Konsumausgaben. Eigene Überträge, Bargeldbehebungen und offene Buchungen werden nicht als Verbrauch gezählt.</p></div><div class="fin30-period"><button type="button" data-action="finance-budget-month" data-id="${key(previous)}" aria-label="Vormonat">‹</button><label>Monat<input type="month" id="finance-budget-month" value="${validMonth}" min="2000-01" max="2099-12"/></label><button type="button" data-action="finance-budget-month" data-id="${key(next)}" aria-label="Nächster Monat">›</button></div></header>
 <div class="fin30-kpis"><div><small>Konsum im gewählten Monat</small><strong>${h(eur(model.monthlyTotalCents))}</strong></div><div><small>Ohne Budgetzuordnung</small><strong>${h(eur(model.unbudgetedCents))}</strong></div><div><small>Budgetierte Kategorien</small><strong>${model.configured}</strong></div></div>
 <div class="fin30-groups">${groups}</div>
 <details class="fin30-editor" id="finance-budget-editor"><summary>+ Kategorie budgetieren oder ändern</summary><form id="finance-flex-budget-form" class="fin30-form"><label>Kategorie<select name="category" id="finance-budget-category">${categoryOptions}</select></label><label>Budgetart<select name="group" id="finance-budget-group">${FLEX_GROUPS.map(g=>`<option value="${g.id}">${h(g.label)}</option>`).join('')}</select></label><label>Betrag in EUR<input name="limit" required type="number" min="0.01" step="0.01" max="1000000000" placeholder="z. B. 250"/></label><p class="fin30-hint">Fix / Flexibel: Betrag pro Monat. Unregelmäßig: Betrag pro Jahr, mit Rücklagenvorschlag durch 12. Eine neue Zuordnung ersetzt das bestehende Budget für diese Kategorie.</p><button class="primary-btn" type="submit">Budget speichern</button></form></details>
 <section class="fin30-goals"><header><div><span class="insight-kicker">FINANZIELLE ZIELE</span><h3>Sparen & Rücklagen</h3><p>Fortschritt wird ausschließlich anhand deiner manuell bestätigten Beträge gezeigt – nicht anhand geschätzter Kontostände.</p></div></header>
 <div class="fin30-goal-grid">${goals.map(g=>{const p=goalProjection(g,today),pct=Math.min(100,Math.floor(100*g.savedCents/g.targetCents));return `<article class="fin30-goal"><div class="fin30-goal-title"><div><small>${g.kind==='reserve'?'Rücklage':'Sparziel'}</small><strong>${h(g.title)}</strong></div><button type="button" data-action="finance-goal-remove" data-id="${h(g.id)}" aria-label="${h(g.title)} entfernen">×</button></div><div class="fin30-goal-amount"><strong>${h(eur(g.savedCents))}</strong><span>von ${h(eur(g.targetCents))}</span></div><div class="fin30-track" role="progressbar" aria-label="${h(g.title)} Fortschritt" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div><small>${g.targetDay?`Zieltermin ${h(g.targetDay)} · `:''}${p.monthly!==null?`${h(eur(p.monthly))}/Monat rechnerisch nötig`:h(eur(p.remaining))+' fehlen noch'}${g.updatedDay?' · Stand '+h(g.updatedDay):''}</small><form data-finance-goal-update="${h(g.id)}" class="fin30-goal-update"><label>Bestätigter Fortschritt (EUR)<input type="number" name="saved" min="0" max="1000000000" step="0.01" required value="${(g.savedCents/100).toFixed(2)}"/></label><button class="secondary-btn" type="submit">Aktualisieren</button></form></article>`;}).join('')||'<p class="fin30-empty">Noch keine Spar- oder Rücklageziele. Du kannst ein Ziel freiwillig anlegen.</p>'}</div>
 <details class="fin30-editor"><summary>+ Finanzielles Ziel anlegen</summary><form id="finance-savings-goal-form" class="fin30-form"><label>Zielname<input name="title" maxlength="90" required placeholder="z. B. Notgroschen"/></label><label>Art<select name="kind"><option value="savings">Sparziel</option><option value="reserve">Rücklage</option></select></label><label>Zielbetrag EUR<input name="target" type="number" required min="0.01" max="1000000000" step="0.01"/></label><label>Bereits zurückgelegt EUR (manuell bestätigt)<input name="saved" type="number" required min="0" max="1000000000" step="0.01" value="0"/></label><label>Zieltermin (freiwillig)<input name="targetDay" type="date"/></label><button class="primary-btn" type="submit">Ziel anlegen</button></form></details>
 </section><p class="fin-disclaimer">Budgets sind persönliche Planwerte, keine automatischen Kontosperren. Fehlende oder nicht importierte Buchungen können die Ist-Werte unterschätzen. Jahresbudgets beziehen sich auf das Kalenderjahr; die monatliche Rücklage ist nur ein Planwert und kein nachgewiesenes Guthaben. Bestehende Vermögensziele bleiben separat im Portfolio.</p></div>`;
}
