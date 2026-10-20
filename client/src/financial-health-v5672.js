/** Compass 0.5.67.2 – auditable financial wellbeing signal.
 * Distinguishes everyday spending from asset movement and confirmed cash reserves.
 * Does not infer a bank balance from transactions or treat portfolio deposits as expenses.
 */
import {portfolioHistoricalPoints} from './finance-net-worth-v19.js';

const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const validDay=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const monthOffset=(day,n)=>{const [y,m]=day.slice(0,7).split('-').map(Number);return new Date(Date.UTC(y,m-1+n,1)).toISOString().slice(0,7);};
const assetCategory=/^Transfer\s*\/\s*(?:Eigene Konten|Kreditkartenabrechnung|Sparen|Krypto|Depot\s*&\s*Wertpapiere)/i;
const movementCategory=/^Transfer\s*\/\s*(?:Sparen|Krypto|Depot\s*&\s*Wertpapiere)/i;

export function financialHealthEvidence(state={},today='2026-10-21'){
 const rows=Array.isArray(state.financeTransactions)?state.financeTransactions:[];
 const minMonth=monthOffset(today,-36),currentMonth=today.slice(0,7);
 const groups=new Map(),excludedBy={own:0,invest:0},count={valid:0,pending:0,unknown:0,invalid:0,excluded:0,partial:0};
 for(const tx of rows){
  const day=tx?.day,amount=tx?.amountCents;
  if(!validDay(day)||day>today||!Number.isSafeInteger(amount)||amount===0||(tx.currency&&tx.currency!=='EUR')){count.invalid++;continue;}
  const month=day.slice(0,7);
  if(month<minMonth||month>=currentMonth){count.partial++;continue;}
  const category=String(tx.category||'');
  if(tx.linkedTransferId||assetCategory.test(category)||(tx.flow==='transfer'&&category!=='Transfer / Private Überweisung')){
   count.excluded++;if(movementCategory.test(category))excludedBy.invest++;else excludedBy.own++;continue;
  }
  // An unknown flow remains usable as provisional signed bank movement.
  if(tx.flow==='income'&&amount<0||tx.flow==='expense'&&amount>0){count.invalid++;continue;}
  const group=groups.get(month)||{month,income:0,expense:0,rows:0,pending:0};
  if(amount>0)group.income+=amount;else group.expense+=-amount;
  group.rows++;count.valid++;if(tx.needsReview){count.pending++;group.pending++;}if(!tx.flow||tx.flow==='unknown')count.unknown++;
  groups.set(month,group);
 }
 const complete=[...groups.values()].filter(x=>x.income>0&&x.expense>0).sort((a,b)=>a.month.localeCompare(b.month)).slice(-12);
 const income=complete.reduce((n,m)=>n+m.income,0),expense=complete.reduce((n,m)=>n+m.expense,0);
 const latest=[...groups.keys()].sort().at(-1)||null;
 const stale=!!latest&&latest<monthOffset(today,-12);
 const score=complete.length>=2&&income>0&&expense>0&&!stale?clamp(60+100*(income-expense)/income):null;
 const incomeMonthly=complete.length?Math.round(income/complete.length):null;
 const expenseMonthly=complete.length?Math.round(expense/complete.length):null;
 const margin=income>0?(income-expense)/income:null;
 // A manually confirmed bank opening balance is meaningful ONLY for its own date.
 const settings=state.financeCashflowSettings||{};
 const asOf=settings.asOf;
 const verified=validDay(asOf)&&asOf===today&&Number.isSafeInteger(settings.openingCents)&&settings.openingCents>=0;
 const reserveMonths=verified&&expenseMonthly>0?settings.openingCents/expenseMonthly:null;
 const reserveScore=reserveMonths===null?null:clamp(reserveMonths/6*100);
 // A reserve is a second independent signal, never invent it by summing ledger movements.
 const combined=score==null?null:reserveScore==null?score:clamp(score*.8+reserveScore*.2);
 let wealth={available:false,changeCents:null,first:null,last:null,sourceCount:0};
 try{const history=portfolioHistoricalPoints(state),points=history.points||[];
  if(points.length>=2){const first=points[0],last=points.at(-1);if(first.day!==last.day){wealth={available:true,changeCents:last.netCents-first.netCents,first:first.day,last:last.day,sourceCount:history.sources.length};}}
 }catch{/* Historical valuation remains unknown rather than invented. */}
 const cause=!rows.length?'Noch keine Bankbuchungen importiert':!count.valid?'Keine auswertbaren abgeschlossenen EUR-Monate (Eigen-/Anlageüberträge bleiben ausgeschlossen)':stale?'Die letzte auswertbare Buchung liegt mehr als zwölf Monate zurück':complete.length<2?`${count.valid} auswertbare Buchungen, aber nur ${complete.length} Monate mit Ein- und Ausgängen (mindestens 2 benötigt)` :null;
 const provisional=complete.length<3||count.pending>0||count.unknown>0;
 return {score:combined,cashflowScore:score,reserveScore,reserveMonths,verifiedBalance:verified,wealth,
  income,expense,incomeMonthly,expenseMonthly,margin,monthCount:complete.length,months:complete,
  supported:count.valid,pending:count.pending,unknown:count.unknown,excluded:count.excluded,excludedBy,invalid:count.invalid,
  latest,provisional,cause,source:'Bankbuchungen',total:rows.length,
  scoreMethod:'Cashflow: 60 + 100 × (Einnahmen − laufende Ausgaben) / Einnahmen, begrenzt auf 0–100. Bei heute bestätigter Reserve: 80 % Cashflow + 20 % Reservedeckung (6 Monate = 100). Vermögensänderungen zählen nicht zum Score.'};
}
