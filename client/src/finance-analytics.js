/** Compass 0.5.14 — purely local, deterministic finance analyses.
 * Never infer complete account coverage, contracts, travel attribution, or wealth
 * from a collection of exported bank transactions alone. */
import {merchantKey,safeMerchantRule} from './finance-core.js';

const cents=t=>Math.abs(Number(t.amountCents)||0);
const signed=t=>Number(t.amountCents)||0;
const isMonth=m=>/^\d{4}-\d{2}$/.test(m)&&Number(m.slice(5))>=1&&Number(m.slice(5))<=12;
export function monthDistance(a,b){
 if(!isMonth(a)||!isMonth(b))return null;
 return (Number(b.slice(0,4))-Number(a.slice(0,4)))*12+Number(b.slice(5))-Number(a.slice(5));
}
export function financeMonthlySeries(transactions=[],period='all'){
 const rows=(Array.isArray(transactions)?transactions:[]).filter(t=>/^\d{4}-\d{2}-\d{2}$/.test(t.day||'')&&(period==='all'||t.day.startsWith(period)));
 const result=new Map();
 for(const t of rows){const m=t.day.slice(0,7);if(!isMonth(m))continue;
  const x=result.get(m)||{month:m,count:0,expenseCents:0,incomeCents:0,refundCents:0,transfersOutCents:0,transfersInCents:0,cashCents:0,pendingOutCents:0,pendingInCents:0,netBankCents:0,categories:{}};
  x.count++;x.netBankCents+=signed(t);const v=cents(t);
  if(t.needsReview){if(signed(t)<0)x.pendingOutCents+=v;else x.pendingInCents+=v;}
  else if(t.flow==='expense'&&signed(t)<0){x.expenseCents+=v;const category=String(t.category||'Unbekannt').split(' / ')[0];x.categories[category]=(x.categories[category]||0)+v;}
  else if(t.flow==='income'&&signed(t)>0)x.incomeCents+=v;
  else if(t.flow==='refund'&&signed(t)>0)x.refundCents+=v;
  else if(t.flow==='cash'&&signed(t)<0)x.cashCents+=v;
  else if(t.flow==='transfer'){if(signed(t)<0)x.transfersOutCents+=v;else x.transfersInCents+=v;}
  result.set(m,x);
 }
 return [...result.values()].sort((a,b)=>a.month.localeCompare(b.month));
}
export function financeExpenseOverview(transactions=[],period='all'){
 const months=financeMonthlySeries(transactions,period);
 const categories=new Map(),merchants=new Map();
 for(const t of transactions){
  if(t.needsReview||t.flow!=='expense'||signed(t)>=0||(period!=='all'&&!String(t.day).startsWith(period)))continue;
  const v=cents(t),c=String(t.category||'Unbekannt'),parent=c.split(' / ')[0];
  const group=categories.get(parent)||{name:parent,cents:0,detail:new Map(),count:0};group.cents+=v;group.count++;group.detail.set(c,(group.detail.get(c)||0)+v);categories.set(parent,group);
  const mk=merchantKey(t.merchant||''),prev=merchants.get(mk)||{name:t.merchant||'Unbekannt',cents:0,count:0};prev.count++;prev.cents+=v;merchants.set(mk,prev);
 }
 const sortedCategories=[...categories.values()].map(c=>({...c,details:[...c.detail].map(([name,cents])=>({name,cents})).sort((a,b)=>b.cents-a.cents),detail:undefined})).sort((a,b)=>b.cents-a.cents);
 const latest=months.at(-1),prev=months.at(-2);
 const comparable=latest&&prev&&monthDistance(prev.month,latest.month)===1;
 const monthChange=comparable?{latest:latest.month,previous:prev.month,deltaCents:latest.expenseCents-prev.expenseCents,deltaPercent:prev.expenseCents>0?100*(latest.expenseCents-prev.expenseCents)/prev.expenseCents:null}:null;
 return {months,categories:sortedCategories,merchants:[...merchants.values()].sort((a,b)=>b.cents-a.cents).slice(0,15),monthChange,openOutCents:months.reduce((s,m)=>s+m.pendingOutCents,0),openInCents:months.reduce((s,m)=>s+m.pendingInCents,0)};
}
/** Candidates are observations, NEVER automatic contracts. Manual status overrides are local. */
export function financeRecurringCandidates(transactions=[],manual={}){
 const all=(Array.isArray(transactions)?transactions:[]).slice().sort((a,b)=>String(a.day).localeCompare(String(b.day)));
 const lastMonth=all.map(t=>String(t.day||'').slice(0,7)).filter(isMonth).sort().at(-1);
 if(!lastMonth)return [];
 const skipParents=new Set(['Lebensmittel','Essen & Ausgehen','Shopping','Bargeld','Freizeit & Reisen','Mobilität']);
 const groups=new Map();
 for(const t of all){if(t.needsReview||t.flow!=='expense'||signed(t)>=0)continue;
  const key=merchantKey(t.merchant||'');if(!key||!safeMerchantRule(key))continue;
  const month=String(t.day||'').slice(0,7),gap=monthDistance(month,lastMonth);if(gap===null||gap<0||gap>15)continue;
  const group=groups.get(key)||{key,merchant:t.merchant||'Unbekannt',dates:[],amounts:[],categories:new Map(),days:[],byMonth:new Map()};
  group.dates.push(t.day);group.amounts.push(cents(t));group.days.push(Number(t.day.slice(8)));group.byMonth.set(month,(group.byMonth.get(month)||0)+1);
  const parent=String(t.category||'').split(' / ')[0];group.categories.set(parent,(group.categories.get(parent)||0)+1);groups.set(key,group);
 }
 const out=[];
 for(const group of groups.values()){
  const months=[...group.byMonth.keys()].sort(),status=manual[group.key]||'candidate';
  if(status==='exclude')continue;
  const category=[...group.categories].sort((a,b)=>b[1]-a[1])[0]?.[0]||'';
  const last=months.at(-1),fresh=monthDistance(last,lastMonth)<=2;
  const gaps=months.slice(1).map((m,i)=>monthDistance(months[i],m));
  const monthly=gaps.length&&gaps.filter(n=>n===1).length>=2;
  const lowMultiple=Math.max(...group.byMonth.values())<=2;
  const eligible=!skipParents.has(category)&&lowMultiple&&monthly&&months.length>=3&&fresh;
  if(status!=='fixed'&&!eligible)continue;
  const recent=group.amounts.slice(-6),avg=Math.round(recent.reduce((s,v)=>s+v,0)/recent.length);
  const median=recent.slice().sort((a,b)=>a-b)[Math.floor(recent.length/2)];
  const recentAmount=group.amounts.at(-1),shift=recent.length>1?recentAmount-median:0;
  const total=group.amounts.reduce((s,v)=>s+v,0);
  out.push({key:group.key,merchant:group.merchant,status:status==='fixed'?'fixed':'candidate',category,months:months.length,lastMonth:last,meanCents:avg,lastCents:recentAmount,shiftCents:shift,totalCents:total,active:fresh,stable:avg>0&&recent.every(v=>Math.abs(v-avg)/avg<0.30),observedCount:group.amounts.length});
 }
 return out.sort((a,b)=>(a.status==='fixed'?-1:1)-(b.status==='fixed'?-1:1)||Number(b.active)-Number(a.active)||b.meanCents-a.meanCents).slice(0,100);
}
export function financeSearchTransactions(transactions=[],{query='',period='all',filter='all',page=0,pageSize=25}={}){
 const q=String(query).normalize('NFKC').toLocaleLowerCase('de-AT').trim().slice(0,100);
 const list=transactions.filter(t=>{
  if(period!=='all'&&!String(t.day||'').startsWith(period))return false;
  if(filter==='pending'&&!t.needsReview)return false;
  if(filter==='broad'&&(t.needsReview||!(t.confidence==='broad'||t.source==='broad-rule')))return false;
  if(filter==='expense'&&(t.needsReview||t.flow!=='expense'||signed(t)>=0))return false;
  if(filter==='transfer'&&(t.needsReview||t.flow!=='transfer'))return false;
  return !q||[t.merchant,t.description,t.category,t.day].some(x=>String(x||'').normalize('NFKC').toLocaleLowerCase('de-AT').includes(q));
 }).sort((a,b)=>String(b.day).localeCompare(String(a.day))||String(a.id).localeCompare(String(b.id)));
 const safePage=Math.min(Math.max(0,Math.trunc(Number(page)||0)),Math.max(0,Math.ceil(list.length/pageSize)-1));
 return {rows:list.slice(safePage*pageSize,(safePage+1)*pageSize),count:list.length,page:safePage,pages:Math.max(1,Math.ceil(list.length/pageSize))};
}
