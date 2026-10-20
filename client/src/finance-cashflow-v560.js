/** Compass 0.5.60 — local-only, explicitly conditional 12-month liquidity planning.
 * Imported movements cannot prove coverage, payment timing or cash balances.
 * Projections never write bank transactions or initiate transfers.
 */
import {escapeFinance} from './finance-core.js';
import {detectPaymentPatterns,dailyPaymentForecast} from './finance-payment-patterns-v561.js';
import {financeRecurringCandidates} from './finance-analytics.js';
import {merchantKey} from './finance-core.js';
const h=escapeFinance;
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
export const cashflowMonth=(day,offset=0)=>{const [y,m]=String(day).slice(0,7).split('-').map(Number);return new Date(Date.UTC(y,m-1+offset,1)).toISOString().slice(0,7);};
export const cashflowLastDay=(today)=>{const [y,m]=String(today).slice(0,7).split('-').map(Number);return new Date(Date.UTC(y,m+11,0)).toISOString().slice(0,10);};
export function cashflowDateOK(x){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(x||'')))return false;const d=new Date(x+'T12:00:00Z');return !Number.isNaN(+d)&&d.toISOString().slice(0,10)===x;}
const integer=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100_000_000_000;
const avg=a=>a.length?Math.round(a.reduce((s,x)=>s+x,0)/a.length):0;
const normEvents=(entries=[])=>Array.isArray(entries)?entries.filter(e=>e&&typeof e==='object'&&typeof e.id==='string'&&e.id.length<=80&&typeof e.label==='string'&&e.label.length<=100&&cashflowDateOK(e.day)&&integer(e.cents)&&e.cents!==0).slice(0,200):[];
export function validatedPlanEvent(event){
 if(!event||!cashflowDateOK(event.day)||!['income','expense'].includes(event.kind)||!integer(event.amountCents)||event.amountCents<=0||event.amountCents>100_000_000_00||typeof event.label!=='string'||!event.label.trim()||event.label.length>100)throw Error('Bitte Bezeichnung, Datum, Art und EUR-Betrag prüfen.');
 if(typeof event.id!=='string'||!/^plan-[A-Za-z0-9-]{8,76}$/.test(event.id))throw Error('Ungültige ID des Planpostens.');
 return {id:event.id,day:event.day,label:event.label.trim(),cents:event.kind==='expense'?-event.amountCents:event.amountCents,kind:event.kind};
}
export function validateCashflowSettings(input,today){
 const opening=input?.openingCents,buffer=input?.bufferCents;
 if(opening!==null&&(!integer(opening)||opening<0))throw Error('Bitte einen gültigen verfügbaren EUR-Anfangsbestand angeben.');
 if(!integer(buffer)||buffer<0)throw Error('Bitte gültigen EUR-Sicherheitspuffer angeben.');
 if(!cashflowDateOK(input?.asOf)||input.asOf>today)throw Error('Der Bestandsstichtag muss gültig und darf nicht in der Zukunft liegen.');
 return {openingCents:opening,bufferCents:buffer,asOf:input.asOf};
}
function monthlyHistory(transactions,today){
 const months=Array.from({length:6},(_,i)=>cashflowMonth(today,i-6));
 return months.map(month=>{
  const rows=transactions.filter(t=>t&&cashflowDateOK(t.day)&&t.day.startsWith(month));
  const valid=rows.filter(t=>!t.needsReview&&Number.isFinite(t.amountCents)&&(!t.currency||t.currency==='EUR'));
  const spent=valid.filter(t=>{
   if(t.amountCents>=0)return false;
   if(t.flow==='expense'||t.flow==='cash')return true;
   if(t.flow==='transfer'){
    // An internal transfer is not a second outflow of the combined EUR cash pool.
    // Private payments, withdrawals to investment and saving DO reduce free bank liquidity.
    return !t.linkedTransferId&&!['Transfer / Eigene Konten','Transfer / Kreditkartenabrechnung'].includes(t.category);
   }
   return false;
  }).reduce((s,t)=>s-t.amountCents,0);
  const income=valid.filter(t=>t.amountCents>0&&t.flow==='income').reduce((s,t)=>s+t.amountCents,0);
  return {month,rows:rows.length,pending:rows.filter(t=>t.needsReview).length,spent,income};
 });
}
/** Nothing here represents a bank-confirmed forecast. When the balance is unknown, return changes only. */
export function cashflowModel({transactions=[],settings={},planned=[],recurringRules={},today='2026-10-20',whatIf=null}={}){
 if(!cashflowDateOK(today))throw Error('Ungültiges heutiges Datum.');
 const recent=monthlyHistory(Array.isArray(transactions)?transactions:[],today),observed=recent.filter(m=>m.rows>0);
 const monthlyExpense=avg(observed.map(m=>m.spent));
 const patterns=detectPaymentPatterns(transactions,today,recurringRules);
 const recognizedSalary=patterns.filter(p=>p.type==='salary');
 // Never smooth seasonal supplements into a falsely high ordinary monthly salary.
 const monthlyIncome=recognizedSalary.length?recognizedSalary.reduce((s,p)=>s+p.baselineCents,0):avg(observed.map(m=>m.income));
 const buffer=integer(settings?.bufferCents)&&settings.bufferCents>=0?settings.bufferCents:0;
 const freshOpening=integer(settings?.openingCents)&&settings.openingCents>=0&&settings.asOf===today;
 const opening=freshOpening?settings.openingCents:null;
 const events=normEvents(planned);
 const scenario=whatIf&&cashflowDateOK(whatIf.day)&&integer(whatIf.cents)&&whatIf.cents>0?{day:whatIf.day,cents:whatIf.cents}:null;
 let year=Array.from({length:12},(_,i)=>{
  const month=cashflowMonth(today,i);const days=new Date(Date.UTC(+month.slice(0,4),+month.slice(5,7),0)).getUTCDate();
  const fraction=i===0?Math.max(0,(days-Number(today.slice(8))+1)/days):1;
  // Today's manually verified opening balance may already include this month's salary.
  // Never double-count it: require explicit additional income for the rest of this month.
  const expectedIncome=i===0?0:monthlyIncome,expectedExpense=Math.round(monthlyExpense*fraction);
  const plannedChange=events.filter(e=>e.day.startsWith(month)&&e.day>=today).reduce((s,e)=>s+e.cents,0);
  const scenarioChange=scenario?.day.startsWith(month)&&scenario.day>=today?-scenario.cents:0;
  return {month,expectedIncome,expectedExpense,plannedChange,scenarioChange,net:expectedIncome-expectedExpense+plannedChange};
 });
 let cumulative=0,cumulativeScenario=0;
 for(const row of year){cumulative+=row.net;cumulativeScenario+=row.net+row.scenarioChange;row.change=cumulative;row.scenarioChangeTotal=cumulativeScenario;row.balance=opening===null?null:opening+cumulative;row.scenarioBalance=opening===null?null:opening+cumulativeScenario;}
 let trough=opening===null?null:Math.min(opening,...year.map(x=>x.scenarioBalance));
 const daily=dailyPaymentForecast({transactions,patterns,today,planned:events,scenario,opening,buffer});
 if(daily){year=daily.year;trough=daily.trough;}
 const regularReady=observed.length>=3&&monthlyIncome>0&&monthlyExpense>0;
 const warnings=[];
 if(daily)warnings.push('Tagesprognose: wiederkehrende Buchungstage sind Schätzwerte. Gehalt inklusive eventueller Sonderanteile wird nur mit dem vorsichtigen Grundbetrag angesetzt; beobachtete saisonale Erhöhungen sind nicht als verfügbares Geld eingerechnet.');
 else warnings.push('Für diese Buchungen sind die Zahlungspartner bzw. regelmäßigen Buchungstage noch nicht ausreichend belegbar: Monatsmodell als Rückfalloption.');
 if(observed.length<6)warnings.push(`Nur ${observed.length} der letzten 6 vollen Monate mit importierten Bankumsätzen.`);
 if(recent.some(x=>x.pending))warnings.push('Ungeklärte Buchungen fehlen in der historischen Basis.');
 if(transactions.some(t=>t&&t.flow==='transfer'&&t.amountCents<0))warnings.push('Private Überweisungen, Sparen und Investments mindern in dieser Schätzung die freie Bankliquidität; bestätigte Eigenüberträge und Kreditkarten-Abrechnungen sind ausgenommen. Unklare Transfers prüfen.');
 if(!daily)warnings.push('Für die restlichen Tage des laufenden Monats wird kein automatischer zusätzlicher Gehaltseingang unterstellt (sonst möglicherweise Doppelzählung).');
 warnings.push('Importierte Monatsbuchungen können unvollständig sein. Einkünfte, Fixkosten und Tageszeitpunkte sind geschätzt; Wechselkurse und Überweisungsgebühren können fehlen.');
 let verdict='unavailable';
 if(scenario){if((!daily&&!regularReady)||opening===null)verdict='unavailable';else if(trough<buffer)verdict='risk';else verdict='conditional';}
 const forecastMerchants=new Set(patterns.filter(p=>p.kind==='expense').map(p=>p.merchantKey));
 const unmodeledRecurring=financeRecurringCandidates(transactions,recurringRules).filter(c=>!forecastMerchants.has(merchantKey(c.key))).slice(0,25).map(c=>({...c,reason:recurringGapReason(c,transactions,today)}));
 return {today,recent,observed:observed.length,regularReady,monthlyExpense,monthlyIncome,opening,buffer,freshOpening,year,trough,verdict,scenario,warnings,planned:events,patterns,daily,unmodeledRecurring,mode:daily?'daily':'monthly'};
}
const formattedDate=d=>cashflowDateOK(d)?new Intl.DateTimeFormat('de-AT',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z')):'—';
const moneyInput=c=>(Number.isFinite(c)?(c/100).toFixed(2):'');
function graph(year,opening){
 const values=year.map(x=>opening===null?x.change:x.balance);
 const stress=year.map(x=>opening===null?x.scenarioChangeTotal:x.scenarioBalance);
 const all=[0,...values,...stress];const lo=Math.min(...all),hi=Math.max(...all),span=Math.max(10000,hi-lo),W=900,H=190,L=30,R=20,T=22,B=28;
 const X=i=>L+i*(W-L-R)/11,Y=v=>T+(H-T-B)*(hi-v)/span;
 const poly=values.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
 const sPoly=stress.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
 return `<div class="fin560-graph"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="12 Monate: erwartete kumulierte Liquiditätsveränderung${opening===null?'':' ab bestätigt eingegebenem Anfangsbestand'}"><line x1="${L}" x2="${W-R}" y1="${Y(0)}" y2="${Y(0)}" stroke="#b5c4bc" stroke-dasharray="5 6"/><polyline fill="none" stroke="#287b6f" stroke-width="3.5" points="${poly}"/>${values.some((x,i)=>x!==stress[i])?`<polyline fill="none" stroke="#c87c58" stroke-width="2.5" stroke-dasharray="7 5" points="${sPoly}"/>`:''}${year.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(values[i])}" r="3" fill="#287b6f"><title>${h(x.month)} · ${h(eur(values[i]))}</title></circle><text x="${X(i)}" y="${H-7}" text-anchor="middle" font-size="10" fill="currentColor">${h(x.month.slice(5))}</text>`).join('')}</svg></div>`;
}

function dailyRunwayGraph(model){
 if(!model.daily)return '';
 const today=model.today,start=Date.parse(today+'T12:00:00Z');
 const dates=Array.from({length:45},(_,i)=>new Date(start+i*86400000).toISOString().slice(0,10));
 const events=model.daily.events;
 let base=0,stress=0;
 const points=dates.map(date=>{
  for(const e of events.filter(e=>e.day===date)){
   if(e.source!=='scenario')base+=e.cents;
   stress+=e.cents;
  }
  return {day:date,base:base+(model.opening??0),scenario:stress+(model.opening??0)};
 });
 const values=points.flatMap(p=>[p.base,p.scenario]),low=Math.min(...values,model.opening??0),high=Math.max(...values,model.opening??0),width=860,height=166,L=20,R=12,T=15,B=25;
 const span=Math.max(10000,high-low),x=i=>L+i*(width-L-R)/44,y=v=>T+(height-T-B)*(high-v)/span;
 const trace=(key)=>points.map((p,i)=>`${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
 const hasScenario=points.some(p=>p.base!==p.scenario);
 const circles=points.filter(p=>events.some(e=>e.day===p.day)).map(p=>{
  const index=Math.round((Date.parse(p.day+'T12:00:00Z')-start)/86400000);
  const entries=events.filter(e=>e.day===p.day);
  return `<circle cx="${x(index).toFixed(1)}" cy="${y(p.scenario).toFixed(1)}" r="3.3" fill="#298b7b"><title>${h(formattedDate(p.day))}: ${h(eur(p.scenario))}${entries.length?` · ${h(entries.map(e=>e.label).join(', '))}`:''}</title></circle>`;
 }).join('');
 const labels=points.filter((_,i)=>i%7===0||i===44).map(p=>{const i=points.indexOf(p);return `<text x="${x(i).toFixed(1)}" y="${height-6}" text-anchor="middle" font-size="10" fill="currentColor">${h(p.day.slice(8)+'.'+p.day.slice(5,7)+'.')}</text>`;}).join('');
 return `<section class="fin561-daily"><div class="fin561-head"><div><h4>Nächste 45 Tage · geschätzter Tagesverlauf</h4><p>${model.opening===null?'Kumulierte Veränderung ohne Kontostand':'Ab heutigem bestätigtem Anfangsbestand'}. Buchungstage sind Schätzungen, nicht garantiert.</p></div></div><div class="fin560-graph"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Voraussichtlicher Tages-Cashflow der nächsten 45 Tage"><polyline fill="none" stroke="#288476" stroke-width="3" points="${trace('base')}"/>${hasScenario?`<polyline fill="none" stroke="#ce8151" stroke-width="2.5" stroke-dasharray="6 4" points="${trace('scenario')}"/>`:''}${circles}${labels}</svg></div></section>`;
}
function recurringGapReason(candidate,transactions,today){
 const lastMonths=String(today||'').slice(0,7);
 const rows=(Array.isArray(transactions)?transactions:[]).filter(t=>t&&t.amountCents<0&&!t.needsReview&&merchantKey(t.merchant||t.merchantDisplayName||'')===merchantKey(candidate.key)&&t.day<=today).sort((a,b)=>a.day.localeCompare(b.day));
 if(!rows.length)return 'Keine auswertbaren Ausgangsbuchungen';
 const latest=rows.at(-1);
 if(latest.flow==='transfer'&&!/(?:miete|betriebskosten|hausverwaltung|mietzins)/iu.test(String(latest.description||'')+' '+String(latest.category||'')))return 'Private Überweisung: Zweck noch nicht als Wohnkosten erkannt';
 const dayDiff=(Date.parse(today+'T12:00:00Z')-Date.parse(latest.day+'T12:00:00Z'))/86400000;
 if(dayDiff>75)return 'Letzter Eingang der Zahlung liegt über 75 Tage zurück';
 const byMonth=new Map();for(const t of rows){let m=String(t.day).slice(0,7);byMonth.set(m,(byMonth.get(m)||0)+1);}
 if([...byMonth.values()].some(n=>n>1))return 'Mehrere Buchungen je Monat – kein eindeutiger Einzeltermin';
 const cutoff=cashflowMonth(today,-7)+'-01';
 if(rows.filter(t=>t.day<lastMonths+'-01'&&t.day>=cutoff).length<3)return 'Weniger als drei vollständige Monatsbeobachtungen im letzten Halbjahr';
 const days=rows.slice(-7).map(t=>Number(String(t.day).slice(8))).filter(Number.isFinite);
 const md=[...days].sort((a,b)=>a-b)[Math.floor(days.length/2)];
 const maxDev=Math.max(...days.map(d=>Math.abs(d-md)));
 if(maxDev>8&&candidate.status!=='fixed')return 'Buchungstag schwankt deutlich – Termin noch nicht belastbar';
 return 'Empfänger, Kategorie oder Buchungsrhythmus noch nicht eindeutig genug';
}
function paymentPatternSection(model){
 const daily=model.daily,patterns=model.patterns||[];
 const heading=`<div class="fin561-head"><div><h4>Zahlungsmuster &amp; Fixkosten</h4><p>${daily?'Tagesprognose aktiv · erwartete Zahlungstage, keine Bankzusagen.':'Noch keine belastbare Tagesprognose: zu wenige bestätigte wiederkehrende Gehalts- und Fixkostenbuchungen mit benannten Zahlungspartnern.'}</p></div><span class="quiet-tag">${patterns.length} erkannt</span></div>`;
 if(!patterns.length)return `<section class="fin561-section">${heading}<p class="fin-art-note">Weitere bestätigte Bankumsätze importieren und Buchungen nach Empfängern klassifizieren, um Muster zu erkennen.</p>${(model.unmodeledRecurring||[]).length?`<details><summary>${model.unmodeledRecurring.length} regelmäßige Kandidaten nicht prognostiziert</summary><div class="fin561-events">${model.unmodeledRecurring.map(x=>`<div><span>${h(x.merchant)} · ${h(x.reason)}</span><strong>${h(x.status==='fixed'?'Bestätigt – weitere Daten nötig':'Kandidat – prüfen')}</strong></div>`).join('')}</div></details>`:''}</section>`;
 const display=patterns.slice(0,24).map(p=>{
  const next=daily?.events.find(e=>e.patternKey===p.key&&e.day>=model.today);
  const typ=p.type==='salary'?'Gehalt (Basis)':p.kind==='expense'?'Wiederkehrende Fixkosten':'Regelmäßiger Eingang';
  return `<tr><td><strong>${h(p.name)}</strong><small>${h(typ)} · ${p.observations} historische Monate</small></td><td>${h(next?.day?formattedDate(next.day):'Termin offen')}</td><td>${h(eur(p.baselineCents))}</td><td>${h(p.kind==='expense'?'Letzter Betrag als Ansatz':'Ohne unbestätigte Sonderanteile')}</td></tr>`;
 }).join('');
 const bonus=patterns.filter(p=>p.type==='salary').flatMap(p=>p.seasonalUplifts.map(u=>({name:p.name,...u}))).sort((a,b)=>a.month.localeCompare(b.month));
 const bonusHtml=bonus.length?`<div class="fin561-bonus"><strong>Beobachtete höhere Gehaltsmonate (kein zusätzlicher Zahlungseingang)</strong><p>${bonus.slice(0,12).map(b=>`${h(b.month)}: +${h(eur(b.extraCents))} im gemeinsamen Gehalt bei ${h(b.name)} (${b.years} Jahr${b.years===1?'':'e'} beobachtet)`).join(' · ')}. <strong>Diese Erhöhungen werden nicht in den verfügbaren Grundbetrag eingerechnet.</strong> Falls verbindlich erwartet, nur den Zusatzbetrag als einmaligen Planposten bestätigen.</p></div>`:'';
 const missing=(model.unmodeledRecurring||[]);
 const missingHtml=missing.length?`<details class="fin560-method"><summary>${missing.length} weitere regelmäßige Kandidaten noch nicht in der Tagesprognose</summary><p>Auch ein bestätigter Vertrag wird erst mit ausreichend aktuellen, nachvollziehbaren Bankbuchungen und einem plausiblen Zahlungstag in die Tagesprognose übernommen. Manuelle Bestätigung gilt für die Einordnung als Fixkosten, nicht als garantierter Zahlungstermin. Prüfe bei fehlenden Positionen die Geldflussart, Empfängerzuordnung und Buchungshistorie.</p><div class="fin561-events">${missing.map(x=>`<div><span>${h(x.merchant)} · ${h(x.months)} Monate<br><small>${h(x.reason)}</small></span><strong>${h(x.status==='fixed'?'Bestätigt – Termin prüfen':'Kandidat – prüfen')}</strong></div>`).join('')}</div></details>`:'';
 return `<section class="fin561-section">${heading}<div class="fin560-table-wrap"><table class="fin560-table fin561-table"><thead><tr><th>Zahlungspartner &amp; Typ</th><th>Nächster Termin</th><th>Ansatz</th><th>Modell</th></tr></thead><tbody>${display}</tbody></table></div>${bonusHtml}${missingHtml}${daily?`<details><summary>Nächste 14 erwartete Geldbewegungen</summary><div class="fin561-events">${daily.events.filter(e=>e.source!=='scenario').slice(0,14).map(e=>`<div><time>${h(formattedDate(e.day))}</time><span>${h(e.label)}</span><strong>${h(eur(e.cents))}</strong></div>`).join('')}</div></details>`:''}</section>`;
}
export function cashflowDashboard(state={},today,whatIf=null,draft=null){
 const model=cashflowModel({transactions:state.financeTransactions||[],settings:state.financeCashflowSettings||{},planned:state.financePlannedCashflows||[],recurringRules:state.financeRecurringRules||{},today,whatIf});
 const s=state.financeCashflowSettings||{};const results=model.scenario?model.verdict==='unavailable'?'<strong>Keine belastbare Ja/Nein-Antwort möglich.</strong> Bitte aktuellen Anfangsbestand und ausreichend aktuelle Bankdaten bestätigen.':model.verdict==='risk'?`<strong>Engpass im Szenario.</strong> Der modellierte Tiefststand (${h(eur(model.trough))}) unterschreitet deinen Sicherheitspuffer von ${h(eur(model.buffer))}.`:`<strong>Rechnerisch innerhalb des Puffers.</strong> Modellierter Tiefststand: ${h(eur(model.trough))}, Sicherheitspuffer: ${h(eur(model.buffer))}. Die tatsächliche Zahlungsfähigkeit ist damit nicht garantiert.`:'';
 const entry=model.scenario?`<section class="fin560-answer ${model.verdict==='risk'?'risk':''}" aria-live="polite">${results}<small>${h(eur(model.scenario.cents))} zusätzliche Ausgabe am ${h(formattedDate(model.scenario.day))}. ${model.daily?'Tagesmodell mit geschätzten Buchungstagen; tatsächliche Termine und Beträge können abweichen.':'Monatsmodell – mögliche untermonatliche Engpässe bleiben unsichtbar.'} Überweisung wird nicht ausgelöst.</small><button type="button" class="secondary-btn" data-action="finance-560-commit-scenario" ${model.scenario.day<today||model.scenario.day>=cashflowMonth(today,12)+'-01'?'disabled':''}>Als geplante einmalige Ausgabe übernehmen</button></section>`:'';
 return `<section class="fin560" aria-label="12-Monats-Liquiditätsplanung"><div class="fin560-heading"><div><span class="insight-kicker">FINANCIAL FORECAST / 12 MONATE</span><h3>Reicht mein Geld – auch nach einer unerwarteten Zahlung?</h3><p>Du entscheidest. Compass rechnet nur anhand deiner erfassten Daten, ohne Zahlung oder Kontobewegung auszulösen.</p></div><span class="quiet-tag">Lokal · Was wäre wenn?</span></div>
 <div class="fin560-kpis"><article><small>${model.patterns.some(p=>p.type==='salary')?'Regelmäßige Gehaltsbasis / Monat':'Ø Einnahmen / Monat (historisch)'}</small><strong>${h(eur(model.monthlyIncome))}</strong><span>${model.observed} Monate mit Buchungen</span></article><article><small>Ø historische Bankabflüsse / Monat</small><strong>${h(eur(model.monthlyExpense))}</strong><span>ohne Eigenüberträge</span></article><article><small>Modellierte Nettoveränderung · 12M</small><strong>${h(eur(model.year.at(-1).change))}</strong><span>Keine Kontoauskunft</span></article><article><small>Tiefststand mit Szenario</small><strong>${model.opening===null?'Nicht berechenbar':h(eur(model.trough))}</strong><span>${model.opening===null?'Heutiger Anfangsbestand fehlt':model.daily?'Tägliches Minimum aus geschätzten Buchungstagen':'Nur Monatsendwerte plus Anfangsbestand'}</span></article></div>
 <div class="fin560-layout"><form id="finance-560-what-if" class="fin560-panel"><h4>Eine ungeplante Zahlung prüfen</h4><label>Wofür?<input name="label" maxlength="100" value="${h(draft?.label??whatIf?.label??'')}" placeholder="z. B. Unterstützung für Familie" required/></label><div class="fin560-fieldrow"><label>Betrag inkl. Gebühren (€)<input name="amount" type="number" min="0.01" max="100000000" step="0.01" value="${h(draft?.amount??moneyInput(whatIf?.cents))}" required/></label><label>Wann?<input name="day" type="date" min="${h(today)}" max="${h(cashflowLastDay(today))}" value="${h(draft?.day??whatIf?.day??today)}" required/></label></div><button type="submit" class="primary-btn">Kann ich mir das leisten? →</button><p class="fin-art-note">Unverbindliche Simulation. Die Ausgabe wird erst nach ausdrücklicher Bestätigung übernommen.</p></form>
 <form id="finance-560-settings" class="fin560-panel"><h4>Liquidität & Puffer</h4><label>Verfügbarer EUR-Anfangsbestand über alle berücksichtigten Konten (€)<input type="number" name="opening" min="0" max="1000000000" step="0.01" value="${h(moneyInput(s.openingCents))}" placeholder="Erst von dir bestätigen"/></label><div class="fin560-fieldrow"><label>Stichtag des Bestands<input name="asOf" type="date" max="${h(today)}" value="${h(s.asOf||today)}" required/></label><label>Sicherheitspuffer (€)<input name="buffer" type="number" min="0" max="1000000000" step="0.01" value="${h(moneyInput(s.bufferCents??0))}" required/></label></div><button type="submit" class="secondary-btn">Bestand & Puffer im Vault speichern</button><p class="fin-art-note">${model.freshOpening?'Anfangsbestand heute bestätigt.':'Für eine aktuelle Einschätzung Bestand mit heutigem Stichtag neu bestätigen.'} Wertpapiere/Krypto nicht automatisch als frei verfügbares Bargeld gezählt.</p></form></div>
 ${entry}${paymentPatternSection(model)}${dailyRunwayGraph(model)}<h4 class="fin560-section-label">Erwarteter Verlauf · 12 Monate</h4>${graph(model.year,model.opening)}<div class="fin560-table-wrap"><table class="fin560-table"><thead><tr><th>Monat</th><th>Erwartete Einnahmen</th><th>Erwartete Ausgaben</th><th>Zusätzlich geplant</th><th>${model.opening===null?'Kumulierte Veränderung':'Modellierter Monatsendbestand'}</th></tr></thead><tbody>${model.year.map(row=>`<tr><td>${h(row.month)}</td><td>${h(eur(row.expectedIncome))}</td><td>${h(eur(row.expectedExpense))}</td><td>${h(eur(row.plannedChange+row.scenarioChange))}</td><td><strong>${h(eur(model.opening===null?row.scenarioChangeTotal:row.scenarioBalance))}</strong></td></tr>`).join('')}</tbody></table></div>
 <details class="fin560-plan-details"><summary>Einmalige zukünftige Ein- und Auszahlungen verwalten · ${model.planned.length} geplant</summary><form id="finance-560-event" class="fin560-panel fin560-plan-form"><div class="fin560-fieldrow"><label>Art<select name="kind"><option value="expense">Zusätzliche Ausgabe</option><option value="income">Zusätzliche Einnahme</option></select></label><label>Datum<input type="date" name="day" min="${h(today)}" value="${h(today)}" required/></label></div><div class="fin560-fieldrow"><label>Bezeichnung<input name="label" maxlength="100" required placeholder="z. B. Reparatur"/></label><label>Betrag (€)<input type="number" name="amount" min="0.01" max="100000000" step="0.01" required/></label></div><button type="submit" class="secondary-btn">Einmaligen Planposten speichern</button></form>${model.planned.map(p=>`<div class="fin560-plan-row"><div><strong>${h(p.label)}</strong><small>${h(formattedDate(p.day))} · ${p.cents>0?'Einnahme':'Ausgabe'} · ${h(eur(Math.abs(p.cents)))}</small></div><button type="button" class="secondary-btn" data-action="finance-560-remove-event" data-id="${h(p.id)}">Entfernen</button></div>`).join('')||'<p class="fin-art-note">Noch keine zusätzlichen Zahlungen geplant.</p>'}</details>
 <details class="fin560-method"><summary>Wie belastbar ist die Antwort?</summary><p>${model.daily?'Für die Tagesvorschau werden wiederkehrende Bankzahlungspartner mit beobachteten Monatstagen modelliert. Variable Ausgaben werden konservativ früh im Monat angesetzt. Eine Gehaltsüberweisung enthält normale und gegebenenfalls saisonal erhöhte Anteile; letztere zählen nicht als gesichertes Geld.':'Die Durchschnittswerte stammen aus den letzten bis zu sechs vollen Monaten mit vorhandenen Buchungen; fehlende Muster werden als Monatswerte geschätzt.'} Der bestätigte Anfangsbestand muss heute gelten. Zusätzliche Planposten dürfen bestehende erwartete Abbuchungen nicht doppeln. Weder prognostizierte Tage noch Beträge sind vom Bankinstitut bestätigt.</p><ul>${model.warnings.map(w=>`<li>${h(w)}</li>`).join('')}</ul><p>Für Überweisungen nach China: Wechselkurs, Zwischenbankgebühren, Kosten des Empfängers und mögliche Verzögerungen bitte in der Frage berücksichtigen.</p></details></section>`;
}
