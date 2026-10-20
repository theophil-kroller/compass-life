/** Compass 0.5.61 — local bank pattern recognition for a conditional daily cash-flow forecast.
 * No bank details leave the device. Evidence is never a promise of future payment.
 * Seasonal salary uplifts are INSIDE a single salary transfer, not separate transfers:
 * keep them outside the conservative spendable baseline until expressly planned.
 */
import {merchantKey,safeMerchantRule} from './finance-core.js';
const cashflowMonth=(day,offset=0)=>{const [y,m]=String(day).slice(0,7).split('-').map(Number);return new Date(Date.UTC(y,m-1+offset,1)).toISOString().slice(0,7);};
const cashflowDateOK=x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x||''))&&!Number.isNaN(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;
const median=v=>{const s=[...v].sort((a,b)=>a-b);return s.length?s.length%2?s[(s.length-1)/2]:Math.round((s[s.length/2-1]+s[s.length/2])/2):0;};
const integer=v=>Number.isSafeInteger(v)&&Math.abs(v)<100_000_000_000;
const deltaDays=(a,b)=>Math.round((Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000);
const monthLast=m=>new Date(Date.UTC(+m.slice(0,4),+m.slice(5,7),0)).getUTCDate();
const addDay=(day,offset)=>new Date(Date.parse(day+'T12:00:00Z')+offset*86400000).toISOString().slice(0,10);
const cleanLabel=t=>String(t.merchantDisplayName||t.merchant||'').normalize('NFKC').replace(/\s+/g,' ').trim().slice(0,90);
// Match the merchant identity used by the existing Fixkosten confirmation screen.
const payerName=t=>merchantKey(t.merchant||t.merchantDisplayName||'');
const ownTransfer=t=>Boolean(t.linkedTransferId)||/^(?:Transfer \/ (?:Eigene Konten|Kreditkartenabrechnung|Depot & Wertpapiere|Krypto|Sparen))$/iu.test(String(t.category||''));
// Bank exports often code manual rent/service-charge standing orders as private transfers.
const housingMemo=t=>/(?:^|[^a-zäöüß])(?:betriebskosten|hausverwaltung|mietzins|miete)(?:$|[^a-zäöüß])/iu.test(String(t.description||'')+' '+String(t.category||''));
export const isRecognizedExternalHousingTransfer=t=>t.flow==='transfer'&&!ownTransfer(t)&&housingMemo(t);
const isExpense=t=>t.amountCents<0&&(t.flow==='expense'||isRecognizedExternalHousingTransfer(t));
const isIncome=t=>t.amountCents>0&&t.flow==='income';
const safeName=name=>name.length>=4&&safeMerchantRule(name)&&!/^(?:UNBEKANNT|UNBEKANNTER ZAHLUNGSPARTNER|BANK|BARGELD|KARTENZAHLUNG|SONSTIGES|GEHALT|EINKOMMEN|UEBERWEISUNG|ÜBERWEISUNG|SEPA|DAUERAUFTRAG|TRANSFER|LASTSCHRIFT|PAYMENT|EMPFAENGER|AUFTRAGGEBER)$/iu.test(name);
const knownSalary=t=>/\b(?:GEHALT|LOHN|BEZUG|PAYROLL|SALARY|ENTGELT)\b/iu.test(String(t.category||'')+' '+String(t.description||'').slice(0,110));
const clearlyVariable=category=>/^(?:Lebensmittel|Essen & Ausgehen|Shopping|Freizeit & Reisen|Mobilität \/ (?:Auto & Tanken|Parken & Maut)|Wohnen \/ Haushalt & Einrichtung|Gesundheit & Sport \/ (?:Medizin|Sauna|Optik|Tanzen|Kampfsport|Schwimmen))/iu.test(category);
const contractualCategory=category=>/^(?:Wohnen \/ (?:Miete & Betriebskosten|Strom & Heizung|ORF-Beitrag)|Verträge & Abos \/|Familie \/ Kinder & Unterhalt|Mobilität \/ Öffentliche Verkehrsmittel|Finanzen \/ (?:Bankgebühren|Sollzinsen))/iu.test(category);
const payKey=t=>[t.accountId||'primary',payerName(t),isIncome(t)?'in':'out'].join('|');
function eligible(t,today){return t&&cashflowDateOK(t.day)&&t.day<=today&&t.day>=cashflowMonth(today,-36)+'-01'&&integer(t.amountCents)&&t.amountCents!==0&&(!t.currency||t.currency==='EUR')&&!t.needsReview&&(isExpense(t)||isIncome(t))&&safeName(cleanLabel(t))&&safeName(String(t.merchant||t.merchantDisplayName||''));}
/** The same merchant with many transactions per month is not a subscription. */
export function detectPaymentPatterns(transactions=[],today,recurringRules={}){
 if(!cashflowDateOK(today))throw Error('Ungültiges Tagesdatum');
 const rules=recurringRules&&typeof recurringRules==='object'&&!Array.isArray(recurringRules)?recurringRules:{};
 const rows=(Array.isArray(transactions)?transactions:[]).filter(t=>eligible(t,today)&&rules[payerName(t)]!=='exclude');
 const map=new Map();for(const t of rows){const key=payKey(t);if(!map.has(key))map.set(key,[]);map.get(key).push(t);}
 const patterns=[];
 for(const [key,all] of map){
  all.sort((a,b)=>a.day.localeCompare(b.day));const byMonth=new Map();
  for(const t of all){const m=t.day.slice(0,7);if(!byMonth.has(m))byMonth.set(m,[]);byMonth.get(m).push(t);}
  // Avoid joining separate purchases / refunds / several monthly transfers as a fixed recurring payment.
  if([...byMonth.values()].some(group=>group.length>1))continue;
  const completed=all.filter(t=>t.day.slice(0,7)<today.slice(0,7));
  const trailing=completed.filter(t=>t.day>=cashflowMonth(today,-7)+'-01');
  if(trailing.length<3||deltaDays(today,all.at(-1).day)>75)continue;
  const first=completed[0]?.day.slice(0,7),last=completed.at(-1)?.day.slice(0,7);
  if(!first||!last)continue;
  const monthsBetween=(+last.slice(0,4)-+first.slice(0,4))*12+(+last.slice(5)-+first.slice(5))+1;
  if(monthsBetween>0&&completed.length/monthsBetween<.67)continue;
  const recent=all.slice(-Math.min(7,all.length));
  const ends=recent.filter(t=>monthLast(t.day.slice(0,7))-Number(t.day.slice(8))<=3).length;
  const endOfMonth=ends>=Math.ceil(recent.length*.70);
  const days=recent.map(t=>Number(t.day.slice(8)));
  const category=String(all.at(-1).category||'');
  const confirmed=rules[payerName(all.at(-1))]==='fixed';
  const dayTolerance=confirmed?31:contractualCategory(category)?8:5;
  const spread=Math.max(...days.map(d=>Math.abs(d-median(days))));
  if(!endOfMonth&&spread>dayTolerance)continue;
  // For an explicitly confirmed expense whose payment date varies, forecast the
  // EARLIEST recent debit rather than optimistic median; do not mask uncertainty.
  const calendarDay=confirmed&&!endOfMonth&&spread>5?Math.min(...days):median(days);
  const income=isIncome(all.at(-1));const salary=income&&(knownSalary(all.at(-1))||all.some(knownSalary));
  if(!income){
   // Recurring supermarket, restaurant or travel transactions are not proof of a subscription.
   if(clearlyVariable(category)&&!confirmed)continue;
   // Monthly public transport passes as a contract-like expense only if prices are stable.
   if(category==='Mobilität / Öffentliche Verkehrsmittel'&&!confirmed){const a=completed.slice(-6).map(t=>-t.amountCents);if(a.length<3||Math.max(...a)-Math.min(...a)>median(a)*.20)continue;}
   // Other uncategorized outflows need a stable amount and a long history.
   if(!contractualCategory(category)&&!confirmed&&!(completed.length>=6&&Math.max(...completed.slice(-6).map(t=>-t.amountCents))-Math.min(...completed.slice(-6).map(t=>-t.amountCents))<=median(completed.slice(-6).map(t=>-t.amountCents))*.08))continue;
  }else if(!salary){
   // Non-payroll positive transactions are not safely recurring unless verified over a longer horizon.
   if(completed.length<6)continue;
  }
  // Salary baseline uses the LOWER half. Repeated seasonal uplifts are part of that same payment.
  const amountHistory=completed.length?completed:all;
  const amounts=amountHistory.map(t=>Math.abs(t.amountCents));
  const baseline=salary?median([...amounts].sort((a,b)=>a-b).slice(0,Math.max(2,Math.ceil(amounts.length*.6)))):
   income?median(amounts.slice(-4)):Math.abs(all.at(-1).amountCents);
  // Don't forecast tiny noise or unreasonably large, unverified bank data.
  if(baseline<1000||baseline>100_000_000_00)continue;
  const uplifts=[];
  if(salary){
   const bySeason=new Map();for(const t of amountHistory){
    const uplift=t.amountCents-baseline;
    if(uplift<=Math.max(15000,Math.round(baseline*.12)))continue;
    const mm=t.day.slice(5,7),year=t.day.slice(0,4);
    if(!bySeason.has(mm))bySeason.set(mm,[]);bySeason.get(mm).push({year,extra:uplift});
   }
   for(const [month,found] of bySeason){const distinct=new Set(found.map(r=>r.year));
    if(distinct.size>=1)uplifts.push({month,extraCents:median(found.map(f=>f.extra)),years:distinct.size,confirmed:false});
   }
   uplifts.sort((a,b)=>a.month.localeCompare(b.month));
  }
  patterns.push({key,merchantKey:payerName(all.at(-1)),confirmed,estimatedDay:confirmed&&!endOfMonth&&spread>5,name:cleanLabel(all.at(-1)),accountId:all.at(-1).accountId||'',kind:income?'income':'expense',type:salary?'salary':income?'recurring-income':'fixed-cost',category,baselineCents:baseline,lastCents:Math.abs(all.at(-1).amountCents),lastDay:all.at(-1).day,calendarDay,endOfMonth,observations:completed.length,months:all.map(t=>t.day.slice(0,7)),seasonalUplifts:uplifts,dayVariance:endOfMonth?0:spread});
 }
 return patterns.sort((a,b)=>Number(b.type==='salary')-Number(a.type==='salary')||b.baselineCents-a.baselineCents);
}
function paymentDate(month,p){
 const day=String(p.endOfMonth?monthLast(month):Math.min(monthLast(month),p.calendarDay)).padStart(2,'0');
 let value=month+'-'+day;const week=new Date(value+'T12:00:00Z').getUTCDay();
 // Conservative only: income can arrive later, costs can be debited earlier.
 // Exception: empirically end-of-month salary often arrives on the last BUSINESS day.
 if(p.endOfMonth&&p.kind==='income'&&(week===0||week===6))return addDay(value,week===0?-2:-1);
 if(week===6)return addDay(value,p.kind==='expense'?-1:2);
 if(week===0)return addDay(value,p.kind==='expense'?-2:1);
 return value;
}
const isBankOutflow=t=>t.amountCents<0&&(t.flow==='expense'||t.flow==='cash'||t.flow==='transfer'&&!t.linkedTransferId&&!['Transfer / Eigene Konten','Transfer / Kreditkartenabrechnung'].includes(t.category));
/** Daily forecast with recurring grouped payments and residual variable spending.
 * Returns null when bank merchant information is not adequate: caller keeps 0.5.60 fallback.
 */
export function dailyPaymentForecast({transactions=[],patterns=[],today,planned=[],scenario=null,opening=null,buffer=0}={}){
 if(!cashflowDateOK(today))throw Error('Ungültiges Tagesdatum');
 const end=cashflowMonth(today,12)+'-01';
 const salary=patterns.filter(p=>p.type==='salary');const expenses=patterns.filter(p=>p.kind==='expense');
 if(!salary.length||!expenses.length)return null;
 const recentMonths=Array.from({length:6},(_,i)=>cashflowMonth(today,i-6));
 const usable=(Array.isArray(transactions)?transactions:[]).filter(t=>t&&cashflowDateOK(t.day)&&t.day<=today&&integer(t.amountCents)&&(!t.currency||t.currency==='EUR')&&!t.needsReview);
 const matched=new Set(patterns.map(p=>p.key));
 // Coverage cannot be proven by a lone paycheck. Require evidence of multiple bank outflows.
 const observed=recentMonths.filter(m=>usable.filter(t=>t.day.startsWith(m)&&isBankOutflow(t)).length>=2);
 if(observed.length<3)return null;
 const unmatchedExpenses=observed.map(m=>usable.filter(t=>t.day.startsWith(m)&&isBankOutflow(t)&&!matched.has(payKey(t))).reduce((s,t)=>s-t.amountCents,0));
 const variableCents=Math.round(unmatchedExpenses.reduce((a,b)=>a+b,0)/unmatchedExpenses.length);
 const events=[];
 const push=(day,cents,label,source,kind,extra={})=>{if(day>=today&&day<end&&integer(cents)&&cents!==0)events.push({day,cents,label,source,kind,...extra});};
 for(let i=0;i<12;i++){
  const month=cashflowMonth(today,i);const paidInMonth=new Set(usable.filter(t=>t.day.startsWith(month)).map(payKey));
  for(const p of patterns){
   // Prevent counting the salary/rent twice when already observed earlier this month.
   if(paidInMonth.has(p.key))continue;
   const day=paymentDate(month,p);
   // Today's manually confirmed account balance can already include today's transactions.
   if(day<=today)continue;
   push(day,(p.kind==='income'?1:-1)*p.baselineCents,p.type==='salary'?'Gehalt · '+p.name:p.name,p.type,p.kind,{patternKey:p.key});
  }
  if(variableCents>0){
   const days=monthLast(month),remaining=i===0?Math.max(0,(days-Number(today.slice(8)))/days):1;
   const estimated=Math.round(variableCents*remaining);
   if(estimated>0)push(i===0?addDay(today,1):month+'-01',-estimated,'Sonstige Ausgaben · vorsichtige Monatsschätzung','variable','expense');
  }
 }
 for(const p of planned){if(cashflowDateOK(p.day)&&integer(p.cents))push(p.day,p.cents,p.label,'planned',p.cents<0?'expense':'income');}
 if(scenario&&cashflowDateOK(scenario.day)&&integer(scenario.cents)&&scenario.cents>0)push(scenario.day,-scenario.cents,'Ungeplante Zahlung','scenario','expense');
 events.sort((a,b)=>a.day.localeCompare(b.day)||a.cents-b.cents);
 let balance=opening,cumulative=0,trough=opening,baseTrough=opening;
 const monthly=new Map(Array.from({length:12},(_,i)=>{const month=cashflowMonth(today,i);return [month,{month,expectedIncome:0,expectedExpense:0,plannedChange:0,scenarioChange:0,net:0,change:0,scenarioChangeTotal:0,balance:null,scenarioBalance:null}];}));
 let base=0,withScenario=0;
 // Apply expected debits before credits on the same day: conservative intra-day ordering.
 const dates=[today,...new Set(events.map(e=>e.day))].sort();
 const buckets=new Map();for(const event of events){if(!buckets.has(event.day))buckets.set(event.day,[]);buckets.get(event.day).push(event);}
 for(const date of dates){
  for(const e of buckets.get(date)||[]){const row=monthly.get(e.day.slice(0,7));if(!row)continue;
   if(e.source==='scenario')row.scenarioChange+=e.cents;
   else if(e.source==='planned')row.plannedChange+=e.cents;
   else if(e.cents>0)row.expectedIncome+=e.cents;else row.expectedExpense-=e.cents;
   if(e.source!=='scenario')base+=e.cents;
   withScenario+=e.cents;
   if(opening!==null){trough=Math.min(trough,opening+withScenario);if(e.source!=='scenario')baseTrough=Math.min(baseTrough,opening+base);}
  }
 }
 let running=0,runningScenario=0;
 for(const row of monthly.values()){
  row.net=row.expectedIncome-row.expectedExpense+row.plannedChange;
  running+=row.net;runningScenario+=row.net+row.scenarioChange;
  row.change=running;row.scenarioChangeTotal=runningScenario;
  row.balance=opening===null?null:opening+running;
  row.scenarioBalance=opening===null?null:opening+runningScenario;
 }
 return {year:[...monthly.values()],events,variableCents,observedMonths:observed.length,trough,baseTrough,mode:'daily',bonusCandidates:salary.flatMap(p=>p.seasonalUplifts.map(u=>({name:p.name,...u}))),verifiedStart:opening!==null};
}
