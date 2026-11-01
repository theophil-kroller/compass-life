/** Compass 0.5.77.53 — premium, read-only finance overview. O(n) single-pass.
 * No forecasts, fake account balance, transfers as spending, or dashboard heavy charts.
 */
import {accountChoices,accountMatches,accountFor,accountLabel} from './finance-revolut.js';
import {validateWealthSnapshot} from './finance-wealth-consolidation.js';
import {netWorthOverviewCard} from './finance-net-worth-v19.js';
const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const euro=x=>(x/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const correctDay=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const offsetMonth=(today,n)=>new Date(Date.UTC(Number(today.slice(0,4)),Number(today.slice(5,7))-1+n,1)).toISOString().slice(0,7);
export function premiumFinanceRange(period='last12',today=new Date().toLocaleDateString('sv-SE')){
 const day=correctDay(today)?today:new Date().toLocaleDateString('sv-SE');
 let from='',to=day;
 if(period==='current')from=day.slice(0,7)+'-01';
 else if(period==='lastMonth'){const month=offsetMonth(day,-1);from=month+'-01';to=month+'-'+String(new Date(Date.UTC(Number(month.slice(0,4)),Number(month.slice(5,7)),0)).getUTCDate()).padStart(2,'0');}
 else if(period==='last3')from=offsetMonth(day,-2)+'-01';
 else if(period==='last12')from=offsetMonth(day,-11)+'-01';
 else if(period==='ytd')from=day.slice(0,4)+'-01-01';
 else if(/^\d{4}$/.test(period)){from=period+'-01-01';to=period+'-12-31';}
 else if(/^\d{4}-(?:0[1-9]|1[0-2])$/.test(period)){from=period+'-01';const d=new Date(Date.UTC(Number(period.slice(0,4)),Number(period.slice(5,7)),0)).getUTCDate();to=period+'-'+String(d).padStart(2,'0');}
 else if(period==='all')to='9999-12-31';
 else from=offsetMonth(day,-11)+'-01';
 return {from,to};
}
export function premiumFinanceModel(state={},options={}){
 const {period='last12',account='all',today=new Date().toLocaleDateString('sv-SE')}=options;
 const transactions=Array.isArray(state.financeTransactions)?state.financeTransactions:[];
 const {from,to}=premiumFinanceRange(period,today);
 const byMonth=new Map(),cats=new Map();let income=0,expense=0,refund=0,pending=0,records=0,review=0,first='',last='';
 for(const t of transactions){
  const day=t?.day,amount=t?.amountCents;
  if(!correctDay(day)||day<from||day>to||!accountMatches(t,account)||!Number.isSafeInteger(amount))continue;
  records++;if(!first||day<first)first=day;if(day>last)last=day;
  const month=day.slice(0,7),entry=byMonth.get(month)||{month,income:0,expense:0,refund:0,pending:0,count:0};entry.count++;
  if(t.needsReview){entry.pending+=Math.abs(amount);pending+=Math.abs(amount);review++;}
  else if(t.flow==='income'&&amount>0){income+=amount;entry.income+=amount;}
  else if(t.flow==='expense'&&amount<0){expense-=amount;entry.expense-=amount;const key=String(t.category||'Sonstiges').split(' / ')[0];cats.set(key,(cats.get(key)||0)-amount);}
  else if(t.flow==='refund'&&amount>0){refund+=amount;entry.refund+=amount;}
  // Explicit transfers, investments, cash movements and unclear flows are NOT inferred consumption.
  byMonth.set(month,entry);
 }
 const months=[...byMonth.values()].sort((a,b)=>a.month.localeCompare(b.month));
 const categories=[...cats].map(([name,cents])=>({name,cents})).sort((a,b)=>b.cents-a.cents).slice(0,5);
 const flow=income+refund-expense;
 return {income,expense,refund,pending,flow,records,review,months,categories,first,last,from,to,account,period};
}
/** Latest confirmed balances only. Ledger transactions cannot prove a current bank balance.
 * Snapshot labels are matched conservatively to documented account labels, never guessed
 * from transfers or from a historical transaction sum. Unmatched snapshots remain visible.
 */
export function financeAccountStatusModel(state={},today=new Date().toLocaleDateString('sv-SE')){
 const day=correctDay(today)?today:new Date().toLocaleDateString('sv-SE');
 const seen=new Map();
 for(const t of Array.isArray(state.financeTransactions)?state.financeTransactions:[]){
  if(!t||!correctDay(t.day)||t.day>day)continue;
  const id=accountFor(t),label=accountLabel(t);
  const v=seen.get(id)||{id,label,latestTransaction:null,transactions:0};
  v.transactions++;if(!v.latestTransaction||t.day>v.latestTransaction)v.latestTransaction=t.day;
  seen.set(id,v);
 }
 const latest=new Map();
 for(const raw of Array.isArray(state.financeWealthSnapshots)?state.financeWealthSnapshots:[]){
  let snap;try{snap=validateWealthSnapshot(raw);}catch{continue;}
  if(snap.type!=='bank'||snap.day>day)continue;
  const key=snap.label.toLocaleLowerCase('de-AT');
  if(!latest.has(key)||snap.day>latest.get(key).day)latest.set(key,snap);
 }
 const items=[...seen.values()].sort((a,b)=>a.label.localeCompare(b.label,'de-AT'));
 const matched=new Set();
 for(const item of items){
  const snap=latest.get(item.label.toLocaleLowerCase('de-AT'))||null;
  item.snapshot=snap; if(snap)matched.add(snap.label.toLocaleLowerCase('de-AT'));
 }
 // A manually recorded account may exist even without imported transactions.
 for(const [key,snapshot] of latest){if(!matched.has(key))items.push({id:'snapshot:'+key,label:snapshot.label,latestTransaction:null,transactions:0,snapshot});}
 items.sort((a,b)=>a.label.localeCompare(b.label,'de-AT'));
 return {accounts:items,knownCount:items.filter(a=>a.snapshot).length,
  total:items.reduce((sum,a)=>sum+(a.snapshot?.cents||0),0),
  incomplete:items.some(a=>!a.snapshot),today:day};
}
const monthLabel=ym=>new Intl.DateTimeFormat('de-AT',{month:'long',year:'numeric'}).format(new Date(ym+'-15T12:00:00Z'));
function financeAccountBalances(state,today){
 const accounts=financeAccountStatusModel(state,today);
 const day=accounts.today;
 const rows=accounts.accounts.map(a=>`<div class="fin53-account-row"><div class="fin53-account-name"><strong>${e(a.label)}</strong><small>${a.latestTransaction?`Letzte Buchung: ${e(a.latestTransaction)}`:'Keine importierten Buchungen'}</small></div><div class="fin53-account-value"><strong>${a.snapshot?e(euro(a.snapshot.cents)):'–'}</strong><small>${a.snapshot?`Saldo vom ${e(a.snapshot.day)}`:'Kein bestätigter Saldo'}</small></div></div>`).join('');
 const suggestions=accounts.accounts.filter(a=>!a.id.startsWith('snapshot:')).map(a=>`<option value="${e(a.label)}"></option>`).join('');
 return `<section class="fin53-balances" aria-label="Bankkonten und bestätigte Kontostände"><div class="fin53-section-head"><div><small>KONTEN &amp; SALDEN</small><h3>Wo liegt mein Geld?</h3></div><span class="fin53-asof">${accounts.knownCount} / ${accounts.accounts.length} Salden</span></div>
 ${rows||'<p class="fin53-empty-small">Noch keine Kontoquelle oder bestätigten Kontostände vorhanden.</p>'}
 ${accounts.knownCount?`<div class="fin53-account-total"><span>Summe dokumentierter Bankguthaben${accounts.incomplete?' · unvollständig':''}</span><strong>${e(euro(accounts.total))}</strong></div>`:''}
 <details class="fin53-balance-add"><summary>+ Kontostand erfassen / aktualisieren</summary><form id="finance-wealth-add" class="fin53-balance-form"><input type="hidden" name="type" value="bank"/><label>Konto<input name="label" required list="fin53-account-list" maxlength="70" placeholder="z. B. N26 · Giro EUR" autocomplete="off"/></label><datalist id="fin53-account-list">${suggestions}</datalist><label>Saldo vom<input type="date" name="day" required max="${e(day)}" value="${e(day)}"/></label><label>Bestätigter Saldo · EUR<input name="amount" type="number" step="0.01" min="0" max="1000000000" required placeholder="0.00"/></label><button class="secondary-btn" type="submit">Saldo speichern</button></form></details>
 <p class="fin53-balance-note">Buchungsdatum ≠ Saldo-Stichtag. Nur dokumentierte Salden; kein automatischer Bankabruf. Nicht erfasste Konten werden nicht als 0 € gerechnet.</p></section>`;
}
function financeMonthSummary(state,selection,period,today){
 const focus=/^\d{4}-(?:0[1-9]|1[0-2])$/.test(period)?period:period==='current'?today.slice(0,7):offsetMonth(today,-1);
 const m=premiumFinanceModel(state,{period:focus,account:selection,today});
 return `<section class="fin53-month-summary" aria-label="Monatliche Einnahmen und Ausgaben"><div class="fin53-section-head"><div><small>MONAT AUF EINEN BLICK</small><h3>${e(monthLabel(focus))}</h3></div><span class="fin53-asof">${period==='current'?'laufender Monat':'Kalendermonat'}</span></div>
 <div class="fin53-month-row"><span>Einnahmen</span><strong>${e(euro(m.income))}</strong></div>
 <div class="fin53-month-row"><span>Rückerstattungen</span><strong>${e(euro(m.refund))}</strong></div>
 <div class="fin53-month-row"><span>Ausgaben · Konsum</span><strong>${e(euro(m.expense))}</strong></div>
 <div class="fin53-month-row fin53-month-net"><span>Beobachteter Geldfluss</span><strong class="${m.flow<0?'fin53-negative-text':''}">${e(euro(m.flow))}</strong></div>
 <p class="fin53-month-note">${m.records} Buchungen · ${m.review} ungeklärt. Eigenüberträge und Bargeldbehebungen sind nicht als Konsum verbucht.${m.records?'':' Für diesen Monat liegen noch keine importierten Buchungen vor.'}</p></section>`;
}
function monthlyChart(model){
 const months=model.months.slice(-12);
 if(!months.length)return '<div class="fin53-empty">Noch keine klassifizierten Buchungen für diesen Zeitraum. Importiere Daten oder ändere den Filter.</div>';
 const W=810,H=282,left=69,right=20,top=22,bottom=56,plot=H-top-bottom,spacing=(W-left-right)/months.length;
 const max=Math.max(1,...months.flatMap(m=>[m.income+m.refund,m.expense]));
 const EURaxis=v=>Math.round(v/100).toLocaleString('de-AT')+' €';
 const grid=[0,.5,1].map(f=>{const y=top+plot*(1-f);return `<line x1="${left}" y1="${y}" x2="${W-right}" y2="${y}" stroke="currentColor" opacity=".12"/><text x="${left-9}" y="${y+4}" text-anchor="end" fill="currentColor" opacity=".58" font-size="12">${e(EURaxis(f*max))}</text>`;}).join('');
 const bars=months.map((m,i)=>{
  const x=left+i*spacing+spacing*.18,w=Math.min(24,Math.max(4,spacing*.26)),hIn=(m.income+m.refund)/max*plot,hOut=m.expense/max*plot;
  const monthLabel=new Intl.DateTimeFormat('de-AT',{month:'short',year:'2-digit'}).format(new Date(m.month+'-15T12:00:00Z'));
  return `<g><rect x="${x.toFixed(1)}" y="${(top+plot-hIn).toFixed(1)}" width="${w.toFixed(1)}" height="${hIn.toFixed(1)}" rx="3" fill="#548b79"><title>${e(m.month)} · Einnahmen inkl. Rückerstattungen: ${e(euro(m.income+m.refund))}</title></rect><rect x="${(x+w+2).toFixed(1)}" y="${(top+plot-hOut).toFixed(1)}" width="${w.toFixed(1)}" height="${hOut.toFixed(1)}" rx="3" fill="#d18f68"><title>${e(m.month)} · Konsumausgaben: ${e(euro(m.expense))}</title></rect><text x="${(left+(i+.5)*spacing).toFixed(1)}" y="${H-23}" text-anchor="middle" fill="currentColor" opacity=".72" font-size="${months.length>9?10:12}">${e(monthLabel)}</text></g>`;
 }).join('');
 return `<div class="fin53-chart-scroll"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Monatliche bestätigte Einnahmen und Ausgaben, ${months.length} Monate mit Buchungen, keine interpolierten Nullmonate">${grid}${bars}</svg></div><div class="fin53-legend"><span><i class="fin53-inc"></i>Einnahmen und Rückerstattungen</span><span><i class="fin53-exp"></i>Konsumausgaben</span><span>${months.length} Monate mit Buchungen</span></div>`;
}
const go=(where,label,klass='')=>`<button type="button" class="${klass||'fin53-link'}" data-action="finance-pane" data-id="${e(where)}">${e(label)}</button>`;
const metric=(label,value,foot,tone='')=>`<article class="fin53-kpi ${tone}"><span>${e(label)}</span><strong>${e(value)}</strong><small>${e(foot)}</small></article>`;
export function financePremiumOverviewView(state={},options={}){
 const model=premiumFinanceModel(state,options),all=state.financeTransactions||[];
 const selection=options.account||'all';const period=options.period||'last12';
 const periods=[['current','Dieser Monat'],['lastMonth','Letzter Monat'],['last3','3 Monate'],['last12','12 Monate'],['ytd','Jahr'],['all','Gesamt']];
 const choices=accountChoices(all),max=Math.max(1,...model.categories.map(x=>x.cents));
 const top=model.categories.length?model.categories.map(x=>`<div class="fin53-category"><div><span>${e(x.name)}</span><strong>${e(euro(x.cents))}</strong></div><div class="fin53-bar"><i style="width:${Math.max(1,100*x.cents/max).toFixed(2)}%"></i></div></div>`).join(''):'<p class="fin53-empty-small">Keine bestätigten Konsumausgaben.</p>';
 // This function does not call financeDashboardView or costly exotic/sankey/forecast renderers.
 return `<div class="finance-preview finance-workspace fin53-workspace" aria-label="Finanzen · Premium-Überblick">
 <header class="fin53-header"><div><span class="fin53-eyebrow">FINANZEN / ÜBERBLICK</span><h2>Dein Geld im Blick</h2><p>Bestätigte Buchungen und tatsächliche Monate. Keine geschätzten Kontostände.</p></div><div class="fin53-filters"><label>Zeitraum<select id="finance-period" aria-label="Finanzzeitraum">${periods.map(([id,title])=>`<option value="${id}" ${period===id?'selected':''}>${title}</option>`).join('')}${/^\d{4}(?:-\d{2})?$/.test(period)?`<option selected value="${e(period)}">${e(period)}</option>`:''}</select></label><label>Konto<select id="finance-account" aria-label="Bankkonto"><option value="all" ${selection==='all'?'selected':''}>Alle Konten</option>${choices.map(x=>`<option value="${e(x.id)}" ${selection===x.id?'selected':''}>${e(x.label)}</option>`).join('')}</select></label></div></header>
 <div class="fin53-priority">${financeAccountBalances(state,options.today||new Date().toLocaleDateString('sv-SE'))}${financeMonthSummary(state,selection,period,options.today||new Date().toLocaleDateString('sv-SE'))}</div>
 <div class="fin53-metrics">${metric('Einnahmen',euro(model.income),'Bestätigte Eingänge')}${metric('Konsumausgaben',euro(model.expense),'Ohne Eigenüberträge')}${metric('Beobachteter Geldfluss',euro(model.flow),'Einnahmen + Rückerstattungen − Konsum',model.flow<0?'fin53-negative':'')}<button type="button" class="fin79-open-review" data-action="finance-pane" data-id="Prüfen" aria-label="${model.review} offene Buchungen direkt klassifizieren">${metric('Ungeklärte Beträge',euro(model.pending),`${model.review} Buchung(en) offen · jetzt zuordnen ↗`,'fin53-pending')}</button></div>
 <div class="fin53-content"><section class="fin53-hero"><div class="fin53-section-head"><div><small>MONATLICHER GELDFLUSS</small><h3>Einnahmen &amp; Ausgaben</h3></div>${go('Cashflow','Cashflow-Details')}</div>${monthlyChart(model)}</section>
 <section class="fin53-top"><div class="fin53-section-head"><div><small>AUFTEILUNG</small><h3>Größte Ausgabenkategorien</h3></div>${go('Ausgaben','Alle')}</div>${top}</section></div>
 <div class="fin53-bottom"><section class="fin53-wealth"><div class="fin53-section-head"><div><small>VERMÖGEN</small><h3>Dokumentierte Bestände</h3></div>${go('Portfolio','Portfolio öffnen')}</div>${netWorthOverviewCard(state)||'<p class="fin53-empty-small">Noch keine vollständigen Bestandsdaten hinterlegt.</p>'}</section><section class="fin53-actions"><div class="fin53-section-head"><div><small>WEITERARBEITEN</small><h3>Verwalten und vertiefen</h3></div></div><div class="fin53-buttons">${go('Buchungen','Buchungen bearbeiten','secondary-btn')}${go('Prüfen',`${model.review} offene Zuordnungen`,'secondary-btn')}${go('Visual Lab','Weitere Diagramme','secondary-btn')}</div><p class="fin53-method">${e(model.records)} zugeordnete Kontobuchungen im ausgewählten Zeitraum. Kategorien umfassen nur bestätigte Ausgaben. Fehlende Monate bedeuten fehlende Importabdeckung, nicht Null Euro. Geldfluss ist kein Kontostand; unter „Details“ stehen die weiteren Methoden.</p></section></div>
 </div>`;
}
