/** Compass 0.5.19 — manual flatex holding valuation snapshots. No broker API or credentials.
 * Price, quantity and estimated costs are separate: cash transfers never count as profit.
 */
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const DECIMAL=/^\d{1,12}(?:\.\d{1,8})?$/;
const isDate=s=>{if(!DATE.test(String(s||'')))return false;const d=new Date(`${s}T12:00:00Z`);return Number.isFinite(+d)&&d.toISOString().slice(0,10)===s;};
const assetId=s=>String(s||'').trim().toUpperCase();
export function validateHoldingSnapshot(x){
 if(!x||typeof x!=='object'||!isDate(x.day)||typeof x.name!=='string'||x.name.trim().length<2||x.name.length>100||typeof x.symbol!=='string'||!/^[\p{L}0-9._\- ]{2,30}$/u.test(x.symbol.trim()))throw Error('Bitte gültige Bezeichnung, ISIN/Ticker und Datum angeben.');
 if(!['etf','stock','fund','bond','other'].includes(x.kind))throw Error('Ungültige Wertpapierart.');
 if(typeof x.quantity!=='string'||!DECIMAL.test(x.quantity)||!Number.isFinite(Number(x.quantity))||Number(x.quantity)>1e9||!Number.isSafeInteger(x.priceCents)||x.priceCents<0||x.priceCents>100_000_000_000)throw Error('Ungültige Stückzahl oder EUR-Preis.');
 const valueCents=Math.round(Number(x.quantity)*x.priceCents);
 if(!Number.isSafeInteger(valueCents)||valueCents>100_000_000_000)throw Error('Positionswert zu groß.');
 return {day:x.day,name:x.name.trim(),symbol:assetId(x.symbol),kind:x.kind,quantity:x.quantity,priceCents:x.priceCents,valueCents};
}
export function addHoldingSnapshot(items=[],input){
 const v=validateHoldingSnapshot(input);if(!Array.isArray(items)||items.length>9999)throw Error('Zu viele Positionsbewertungen.');
 const key=x=>String(x.symbol).toUpperCase()+'|'+x.day;
 return [...items.filter(x=>key(x)!==key(v)),v].sort((a,b)=>a.day.localeCompare(b.day)).slice(-10000);
}
export function latestHoldings(items=[]){
 const latest=new Map();for(const raw of Array.isArray(items)?items:[]){let x;try{x=validateHoldingSnapshot(raw);}catch{continue;}if(!latest.has(x.symbol)||latest.get(x.symbol).day<x.day)latest.set(x.symbol,x);}
 return [...latest.values()].filter(x=>x.valueCents>0).sort((a,b)=>b.valueCents-a.valueCents);
}
export const holdingValueCents=items=>latestHoldings(items).reduce((n,x)=>n+x.valueCents,0);
