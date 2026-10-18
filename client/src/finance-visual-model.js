/** Compass 0.5.17 · deterministic local-only presentation analytics.
 * No bank balance inference; no missing months treated as zero historical spending.
 */
import {financeMonthlySeries,monthDistance} from './finance-analytics.js';
export const isFinanceDay=s=>/^\d{4}-\d{2}-\d{2}$/.test(String(s||''))&&!Number.isNaN(Date.parse(`${s}T12:00:00Z`));
const monthStart=(d,n=0)=>{const [y,m]=d.slice(0,7).split('-').map(Number);return new Date(Date.UTC(y,m-1+n,1)).toISOString().slice(0,7);};
const lastDay=(month)=>new Date(Date.UTC(Number(month.slice(0,4)),Number(month.slice(5)),0)).getUTCDate();
const monthName=m=>new Date(`${m}-15T12:00:00Z`).toLocaleDateString('de-AT',{month:'long',year:'numeric'});
export function financePeriodInfo(transactions=[],period='last12',today=new Date().toLocaleDateString('sv-SE')){
 const day=isFinanceDay(today)?today:new Date().toISOString().slice(0,10),current=day.slice(0,7);
 let start='',end='',label='Gesamter importierter Zeitraum';
 if(period==='current'){start=current+'-01';end=day;label=`${monthName(current)} · bisher`;}
 else if(period==='last3'||period==='last12'){start=monthStart(day,period==='last3'?-2:-11)+'-01';end=day;label=`Letzte ${period==='last3'?'3':'12'} Kalendermonate · inkl. laufendem Monat`;}
 else if(period==='ytd'){start=day.slice(0,4)+'-01-01';end=day;label=`${day.slice(0,4)} · bisher`;}
 else if(/^\d{4}$/.test(period)){start=period+'-01-01';end=period+'-12-31';label=`Kalenderjahr ${period}`;}
 else if(/^\d{4}-\d{2}$/.test(period)&&Number(period.slice(5))>=1&&Number(period.slice(5))<=12){start=period+'-01';end=`${period}-${lastDay(period)}`;label=monthName(period);}
 const all=Array.isArray(transactions)?transactions:[],rows=all.filter(t=>isFinanceDay(t.day)&&(!start||t.day>=start)&&(!end||t.day<=end));
 const dates=rows.map(t=>t.day).sort(); const first=dates[0]||null,last=dates.at(-1)||null;
 const distinct=[...new Set(rows.map(t=>t.day.slice(0,7)))];
 return {rows,label,start,end,first,last,months:distinct.length,partial:!first||period==='current'||period==='last3'||period==='last12'||period==='ytd'||(last===day),today:day};
}
const eligibleExpense=t=>!t.needsReview&&t.flow==='expense'&&Number(t.amountCents)<0&&isFinanceDay(t.day);
export const financeCategory=t=>String(t.category||'Sonstiges').split(' / ')[0];
export function financeCategorySeries(transactions=[],category='',today=new Date().toLocaleDateString('sv-SE')){
 const day=isFinanceDay(today)?today:new Date().toISOString().slice(0,10),thisMonth=day.slice(0,7);
 const latestObserved=transactions.filter(t=>isFinanceDay(t.day)).map(t=>t.day).sort().at(-1)||null;
 const firstObserved=transactions.filter(t=>isFinanceDay(t.day)).map(t=>t.day).sort()[0]||null;
 const history=[];
 for(let i=12;i>=1;i--){const m=monthStart(day,-i);
  const all=transactions.filter(t=>isFinanceDay(t.day)&&t.day.startsWith(m));
  const rows=all.filter(t=>eligibleExpense(t)&&(!category||financeCategory(t)===category));
  // Full temporal coverage cannot be established from transaction rows alone.
  // Exclude empty export months and first partial imported month.
  const observed=all.length>0&&(!firstObserved||m>firstObserved.slice(0,7));
  history.push({month:m,cents:rows.reduce((a,t)=>a-Math.min(0,t.amountCents),0),observed,count:rows.length});
 }
 const prior=history.filter(x=>x.observed),v=prior.map(x=>x.cents),sum=v.reduce((a,b)=>a+b,0),n=v.length,mean=n?sum/n:null;
 const percentile=(arr,p)=>{if(!arr.length)return null;const s=arr.slice().sort((a,b)=>a-b),at=(s.length-1)*p,i=Math.floor(at),f=at-i;return s[i]*(1-f)+s[Math.min(i+1,s.length-1)]*f;};
 const p20=n>=6?percentile(v,.2):null,p80=n>=6?percentile(v,.8):null;
 const currentRows=transactions.filter(t=>eligibleExpense(t)&&t.day.startsWith(thisMonth)&&(!category||financeCategory(t)===category));
 const spent=currentRows.reduce((a,t)=>a-t.amountCents,0),daysInMonth=lastDay(thisMonth),elapsed=Math.min(daysInMonth,Number(day.slice(8)));
 const std=n>1?Math.sqrt(v.reduce((a,x)=>a+(x-mean)**2,0)/(n-1)):null;
 // Straight-line pace is provisional and suppressed for historically erratic series.
 const regular=n>=6&&mean>0&&std/mean<.8;
 const forecast=regular&&elapsed>=7?Math.round(spent/elapsed*daysInMonth):null;
 const firstSix=prior.slice(-6,-3),lastThree=prior.slice(-3);
 const avg=rows=>rows.reduce((a,x)=>a+x.cents,0)/Math.max(1,rows.length);
 const consecutiveSix=prior.slice(-6).every((x,i,a)=>i===0||monthDistance(a[i-1].month,x.month)===1);
 const delta=firstSix.length===3&&lastThree.length===3&&consecutiveSix&&avg(firstSix)>0?(avg(lastThree)-avg(firstSix))/avg(firstSix):null;
 const status=delta===null?'Unklar':Math.abs(delta)<.08||Math.abs(avg(lastThree)-avg(firstSix))<1500?'Stabil':delta>0?'Steigend':'Sinkend';
 const position=forecast===null||p20===null?'Keine Prognose':forecast<p20?'Unter üblich':forecast>p80?'Über üblich':'Im üblichen Bereich';
 const missing=history.filter(x=>!x.observed).map(x=>x.month);
 return {category,history,prior,n,mean,p20,p80,spent,forecast,regular,status,delta,position,missing,thisMonth,day,latestObserved,firstObserved};
}
export function financialSnapshot(transactions=[],today=new Date().toLocaleDateString('sv-SE')){
 const history=financeMonthlySeries(transactions,'all').filter(m=>m.month<today.slice(0,7));
 const latest=history.slice(-12); const consecutive=latest.length>=6&&latest.every((m,i)=>i===0||monthDistance(latest[i-1].month,m.month)===1)&&monthDistance(latest.at(-1).month,today.slice(0,7))<=2;
 const avg=consecutive?latest.reduce((s,m)=>s+m.expenseCents,0)/latest.length:null;
 const values=latest.map(m=>m.expenseCents),std=avg!==null&&latest.length>1?Math.sqrt(values.reduce((a,v)=>a+(v-avg)**2,0)/(values.length-1)):null;
 return {months:latest,averageExpense:avg,spread:std,observedMonths:latest.length,consecutive,latestMonth:latest.at(-1)?.month||null};
}
