/** Compass 0.5.20 · wealth goals, manually confirmed financial coverage and conditional scenarios.
 * Read-only local derivations. No guessed passive income, historical balance or return.
 */
import {wealthSummary} from './finance-wealth-consolidation.js';
import {escapeFinance} from './finance-core.js';
const h=escapeFinance;
const eur=c=>(c/100).toLocaleString('de-AT',{style:'currency',currency:'EUR'});
const bounds=(v,a,b)=>Math.min(b,Math.max(a,v));
const dateOK=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(String(v||'')))return false;const d=new Date(v+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===v;};
const int=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
export const DEFAULT_WEALTH_PLAN=Object.freeze({monthlyLivingCents:0,monthlyPassiveCents:0,monthlyContributionCents:0,annualReturnBps:300,annualInflationBps:200,horizonYears:10});
export function validateWealthPlan(raw={}){
 const v={...DEFAULT_WEALTH_PLAN,...raw};
 if(!int(v.monthlyLivingCents,0,100_000_000)||!int(v.monthlyPassiveCents,0,100_000_000)||!int(v.monthlyContributionCents,0,100_000_000)||!int(v.annualReturnBps,-1000,1500)||!int(v.annualInflationBps,0,1000)||!int(v.horizonYears,1,30))throw Error('Ungültige Planungswerte. Bitte Beträge, Prozentsätze und Zeitraum prüfen.');
 return {monthlyLivingCents:v.monthlyLivingCents,monthlyPassiveCents:v.monthlyPassiveCents,monthlyContributionCents:v.monthlyContributionCents,annualReturnBps:v.annualReturnBps,annualInflationBps:v.annualInflationBps,horizonYears:v.horizonYears};
}
export function validateWealthGoal(raw){
 if(!raw||typeof raw!=='object'||typeof raw.id!=='string'||!/^[a-z0-9-]{5,75}$/i.test(raw.id)||typeof raw.label!=='string'||raw.label.trim().length<2||raw.label.trim().length>90||!['net','liquid'].includes(raw.kind)||!int(raw.targetCents,1,100_000_000_000)||raw.targetDay&&!dateOK(raw.targetDay))throw Error('Bitte gültiges Vermögensziel angeben.');
 return {id:raw.id,kind:raw.kind,label:raw.label.trim(),targetCents:raw.targetCents,targetDay:raw.targetDay||''};
}
export function addWealthGoal(items=[],input){
 const goal=validateWealthGoal(input);if(!Array.isArray(items)||items.length>40)throw Error('Zu viele Vermögensziele.');
 return [...items.filter(x=>x.id!==goal.id),goal].slice(-40);
}
const safeCents=v=>Number.isFinite(v)?Math.round(bounds(v,-9e14,9e14)):0;
export function wealthScenarioSeries(initialCents,raw={}){
 const p=validateWealthPlan(raw);if(!Number.isSafeInteger(initialCents)||initialCents< -100_000_000_000||initialCents>100_000_000_000)throw Error('Ungültiger Ausgangswert.');
 const rates={vorsichtig:p.annualReturnBps-300,basis:p.annualReturnBps,hoch:p.annualReturnBps+300};
 const data=[];let amounts={vorsichtig:initialCents,basis:initialCents,hoch:initialCents};
 data.push({year:0,...amounts});
 for(let y=1;y<=p.horizonYears;y++){
  for(let m=0;m<12;m++)for(const [key,bps] of Object.entries(rates)){
   // Savings at month end; constant contributions, no future fees or taxes modeled.
   const monthly=Math.pow(1+bps/10000,1/12)-1;
   amounts[key]=safeCents(amounts[key]*(1+monthly)+p.monthlyContributionCents);
  }
  data.push({year:y,...amounts});
 }
 return {data,rates,plan:p};
}
export function wealthPlanningModel(state={}){
 const w=wealthSummary(state),plan=validateWealthPlan(state.financeWealthPlan||{});
 const observedBank=w.observed.filter(x=>x.type==='bank');
 const liquidCents=observedBank.reduce((s,x)=>s+x.cents,0);
 const hasWealth=w.observed.length>0||w.flatexHoldingsIncludedCents>0||Boolean(state.krakenPortfolio?.balances);
 const goals=[];
 for(const entry of Array.isArray(state.financeWealthGoals)?state.financeWealthGoals:[]){try{
  const goal=validateWealthGoal(entry),available=goal.kind==='liquid'?(observedBank.length?liquidCents:null):(hasWealth?w.totalObservedCents:null);
  goals.push({...goal,available,percentage:available===null?null:Math.max(0,Math.round(available/goal.targetCents*100))});
 }catch{/* Invalid legacy state cannot break the dashboard. */}}
 const monthlyCost=plan.monthlyLivingCents;
 const coverage=monthlyCost>0?100*plan.monthlyPassiveCents/monthlyCost:null;
 const liquidMonths=monthlyCost>0&&observedBank.length>0?liquidCents/monthlyCost:null;
 const scenarios=hasWealth&&state.financeWealthPlan?wealthScenarioSeries(w.totalObservedCents,plan):null;
 const futureLivingCents=monthlyCost>0?Math.round(monthlyCost*Math.pow(1+plan.annualInflationBps/10000,plan.horizonYears)):null;
 const futureCoverage=futureLivingCents?100*plan.monthlyPassiveCents/futureLivingCents:null;
 return {wealth:w,plan,goals,hasWealth,coverage,liquidMonths,liquidCents,bankCount:observedBank.length,scenarios,futureLivingCents,futureCoverage};
}
function chart(series){if(!series)return '<p class="fin-disclaimer">Für die Szenariografik fehlt noch ein erfasster Vermögensstand. Im Portfolio kannst du tatsächliche Konten- oder Depotbewertungen ergänzen.</p>';
 const arr=series.data,W=860,H=320,L=92,R=30,T=24,B=60,all=arr.flatMap(v=>[v.vorsichtig,v.basis,v.hoch]),min=Math.min(0,...all),max=Math.max(1,...all),gap=Math.max(1,max-min),X=i=>L+(W-L-R)*i/(arr.length-1),Y=v=>H-B-(H-B-T)*(v-min)/gap;
 const point=(v,k,i)=>`${X(i).toFixed(1)},${Y(v[k]).toFixed(1)}`;
 const line=k=>arr.map((v,i)=>`${i===0?'M':'L'}${X(i).toFixed(1)} ${Y(v[k]).toFixed(1)}`).join(' ');
 const polygon=[...arr.map((v,i)=>point(v,'hoch',i)),...arr.map((v,i)=>point(arr[arr.length-1-i],'vorsichtig',arr.length-1-i))].join(' ');
 const baseEnd=arr.at(-1).basis;
 return `<div class="fin-wealth20-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Hypothetische Vermögensszenarien auf Basis der erfassten Bestände und manuell gesetzter Annahmen"><defs><linearGradient id="fin20band" x1="0" x2="1"><stop stop-color="#B2D8C7" stop-opacity=".3"/><stop offset="1" stop-color="#76A5C3" stop-opacity=".35"/></linearGradient></defs>${[0,.25,.5,.75,1].map(f=>{const v=min+gap*f,y=Y(v);return `<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#DFEBE4"/><text x="${L-12}" y="${y+4}" text-anchor="end" fill="#7A9286" font-size="11">${h(eur(v))}</text>`;}).join('')}<polygon points="${polygon}" fill="url(#fin20band)"/><path d="${line('vorsichtig')}" fill="none" stroke="#CF9A6A" stroke-width="2.5" stroke-dasharray="6 5"/><path d="${line('hoch')}" fill="none" stroke="#6B96C6" stroke-width="2.5" stroke-dasharray="6 5"/><path d="${line('basis')}" fill="none" stroke="#2F806C" stroke-width="4" stroke-linecap="round"/>${arr.map((v,i)=>i===0||i===arr.length-1||i%Math.max(1,Math.ceil(arr.length/6))===0?`<text x="${X(i)}" y="${H-26}" text-anchor="middle" fill="#70877E" font-size="12">${i===0?'Heute':`+${v.year} J.`}</text>`:'').join('')}<circle cx="${X(arr.length-1)}" cy="${Y(baseEnd)}" r="5" fill="#2F806C"><title>Basisszenario nach ${series.plan.horizonYears} Jahren: ${h(eur(baseEnd))}</title></circle></svg><div class="fin-wealth20-legend"><span><i style="background:#CF9A6A"></i>Basis −3 Prozentpunkte</span><span><i style="background:#2F806C"></i>Basis ${h((series.plan.annualReturnBps/100).toLocaleString('de-AT'))} % p.a.</span><span><i style="background:#6B96C6"></i>Basis +3 Prozentpunkte</span></div></div>`;
}
export function wealthPlanningView(state={}){
 const m=wealthPlanningModel(state),p=m.plan,summary=m.scenarios?.data.at(-1);
 const fmt=v=>(v/100).toFixed(2),percentage=v=>Number(v).toLocaleString('de-AT',{maximumFractionDigits:1});
 const dates=state.financeWealthSnapshots||[];
 return `<section class="fin-wealth20" aria-label="Vermögensziele und Planung"><header class="fin-wealth20-head"><div><span class="insight-kicker">WEALTH / PLANUNG · 0.5.20</span><h3>Vermögensziele & finanzielle Unabhängigkeit</h3><p>Was ist erfasst, was möchtest du erreichen – und welche Annahmen stecken dahinter?</p></div><span class="quiet-tag">🔒 Nur lokal im Vault</span></header>
 <div class="fin-wealth20-kpis"><article><small>Passive Deckungsquote</small><strong>${m.coverage===null?'—':percentage(m.coverage)+' %'}</strong><span>${m.coverage===null?'Lebenshaltungskosten eintragen':'Manuell angesetzter Nettozufluss / Monatskosten'}</span></article><article><small>Liquiditätspuffer</small><strong>${m.liquidMonths===null?'—':percentage(m.liquidMonths)+' Monate'}</strong><span>${m.bankCount?`${m.bankCount} erfasste Bankbestände, teils verschiedene Stichtage`:'Bankbestände fehlen'} · keine automatische Hochrechnung</span></article><article><small>Basisszenario in ${p.horizonYears} Jahren</small><strong>${summary?h(eur(summary.basis)):'—'}</strong><span>Rechenbeispiel · keine Renditeprognose</span></article></div>
 <div class="fin-wealth20-layout"><article class="fin-net-panel"><h4>Deine Planungswerte</h4><p class="fin-disclaimer">Nur selbst bestätigte Annahmen. Kursgewinne, Kapitalüberträge und Kraken-Verkäufe sind keine automatischen passiven Einnahmen.</p><form id="finance-wealth-plan-form" class="fin-wealth20-form"><label>Monatliche Lebenshaltungskosten (€)<input type="number" name="living" min="0" max="1000000" step="0.01" required value="${fmt(p.monthlyLivingCents)}"/></label><label>Passive Nettozuflüsse pro Monat (€)<input type="number" name="passive" min="0" max="1000000" step="0.01" required value="${fmt(p.monthlyPassiveCents)}"/></label><label>Zusätzliches Sparen/Investieren pro Monat (€)<input type="number" name="contribution" min="0" max="1000000" step="0.01" required value="${fmt(p.monthlyContributionCents)}"/></label><label>Angenommene jährliche Wertänderung (%)<input type="number" name="return" min="-10" max="15" step="0.25" required value="${p.annualReturnBps/100}"/></label><label>Angenommene jährliche Kostensteigerung (%)<input type="number" name="inflation" min="0" max="10" step="0.25" required value="${p.annualInflationBps/100}"/></label><label>Projektionsdauer<select name="horizon">${[3,5,10,15,20,30].map(y=>`<option value="${y}" ${p.horizonYears===y?'selected':''}>${y} Jahre</option>`).join('')}</select></label><button type="submit" class="primary-btn">Annahmen lokal speichern</button></form></article>
 <article class="fin-net-panel"><h4>Langfristige Vermögensszenarien</h4>${chart(m.scenarios)}${summary?`<div class="fin-wealth20-results"><span>In ${p.horizonYears} Jahren · Basis</span><strong>${h(eur(summary.basis))}</strong><small>Spanne der drei Annahmeszenarien: ${h(eur(summary.vorsichtig))} – ${h(eur(summary.hoch))}</small>${m.futureLivingCents!==null?`<small>Monatliche Lebenshaltungskosten bei ${p.annualInflationBps/100} % angenommener Steigerung in ${p.horizonYears} Jahren: ${h(eur(m.futureLivingCents))} · passive Deckung bei unverändertem Nettozufluss: ${h(percentage(m.futureCoverage))} %</small>`:''}</div>`:''}<p class="fin-disclaimer">Die Szenarien starten beim <strong>teilweise erfassten Netto-Bestand</strong> (${h(eur(m.wealth.totalObservedCents))}). Konstante nominale Monatsbeiträge, Monatszinseszins, keine Steuern, Gebühren, Entnahmen oder Bestandsänderungen. Die Preissteigerungsannahme wirkt nur auf die separate Kosten- und Deckungsquotenrechnung, nicht auf die nominalen Vermögenskurven. Unterschiedliche Bewertungsstichtage und fehlende Quellen machen Ergebnisse unvollständig. Die Bandbreite ist <strong>kein Konfidenzintervall</strong>.</p></article></div>
 <article class="fin-net-panel"><div class="fin-wealth20-head"><div><h4>Meine Vermögensziele</h4><p>Ein Ziel für Nettovermögen oder einen verfügbaren Bankpuffer festhalten.</p></div><span class="quiet-tag">${m.goals.length} Ziele</span></div><div class="fin-wealth20-goals">${m.goals.map(g=>`<div class="fin-wealth20-goal"><div class="fin-wealth20-goal-title"><div><strong>${h(g.label)}</strong><small>${g.kind==='liquid'?'Bankguthaben':'Erfasstes Nettovermögen'} · Ziel ${h(eur(g.targetCents))}${g.targetDay?` · bis ${h(g.targetDay)}`:''}</small></div><button type="button" class="secondary-btn" data-action="finance-wealth-goal-remove" data-id="${h(g.id)}" aria-label="Ziel ${h(g.label)} entfernen">Entfernen</button></div>${g.available===null?'<p class="fin-disclaimer">Für diesen Zieltyp liegen noch keine geeigneten Bestände vor.</p>':`<div class="fin-wealth20-track"><span style="width:${Math.min(100,g.percentage)}%"></span></div><small>${h(eur(g.available))} erfasst · ${h(percentage(g.percentage))} % des Ziels (vorläufig, Datenabdeckung prüfen)</small>`}</div>`).join('')||'<p class="fin-disclaimer">Noch keine Ziele hinterlegt. Zum Beispiel: sechs Monate Liquiditätspuffer oder ein langfristiges Vermögensziel.</p>'}</div><details class="fin-wealth20-goal-add"><summary>+ Neues Vermögensziel anlegen</summary><form id="finance-wealth-goal-form" class="fin-wealth20-form"><label>Bezeichnung<input name="label" required maxlength="90" placeholder="z. B. Liquiditätsreserve"/></label><label>Art<select name="kind"><option value="liquid">Liquiditätspuffer · Bank</option><option value="net">Nettovermögen · erfasst</option></select></label><label>Zielbetrag (€)<input type="number" name="target" min="0.01" max="1000000000" step="0.01" required/></label><label>Zieldatum (optional)<input type="date" name="day"/></label><button type="submit" class="primary-btn">Ziel im Vault speichern</button></form></details></article>
 <p class="fin-disclaimer">Die passive Deckungsquote und das Liquiditätspolster sind persönliche Planungshilfen. Sie stellen weder eine Finanzberatung noch eine vollständige Bilanz dar. Passive Einkünfte müssen von dir netto und nach Steuern bestätigt werden; Ausschüttungen und Wertzuwächse werden nicht gleichgesetzt.</p></section>`;
}
