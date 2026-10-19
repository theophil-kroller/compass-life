/** Dated, manually imported flatex classic portfolio holdings. No broker login, no guessed prices.
 * This user-provided CSV is kept exclusively in the encrypted Compass Vault (or opt-in E2EE mirror).
 */
const HEAD=['stichtag','isin','bezeichnung','art','stueck','kurs_eur','marktwert_eur','einstand_eur'];
const TYPES=new Set(['ETF','AKTIE','FONDS','ANLEIHE','CASH']);
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const validDay=x=>{if(!DATE.test(x))return false;const d=new Date(x+'T12:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===x;};
function number(raw,max=1e11){
 const value=String(raw??'').trim().replace(/\s/g,'');
 if(!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,8})?$/.test(value)&&!/^(?:\d+)(?:\.\d{1,8})?$/.test(value))throw Error('Ungültiger Zahlenwert in der Depotdatei.');
 const normalized=value.includes(',')?value.replace(/\./g,'').replace(',','.'):/^\d{1,3}(?:\.\d{3})+$/.test(value)?value.replace(/\./g,''):value;
 const v=Number(normalized);if(!Number.isFinite(v)||v<0||v>max)throw Error('Depotbetrag außerhalb des erlaubten Bereichs.');return v;
}
const cents=x=>Math.round(number(x,1e9)*100);
export function validateFlatexPosition(p){
 if(!p||typeof p!=='object'||!validDay(p.day)||!TYPES.has(p.kind)||typeof p.name!=='string'||p.name.trim().length<2||p.name.length>120)throw Error('Ungültige Depotposition oder Stichtag.');
 if(p.kind!=='CASH'&&!/^[A-Z]{2}[A-Z0-9]{10}$/.test(p.isin||''))throw Error('ISIN der Depotposition ungültig.');
 if(p.kind==='CASH'&&p.isin!=='CASH')throw Error('Verrechnungsguthaben muss als CASH gekennzeichnet sein.');
 if(!Number.isFinite(p.quantity)||p.quantity<0||p.quantity>1e10||!Number.isSafeInteger(p.marketCents)||p.marketCents<0||p.marketCents>1e11||!Number.isSafeInteger(p.costCents)||p.costCents<0||p.costCents>1e11||!Number.isFinite(p.unitPrice)||p.unitPrice<0||p.unitPrice>1e9)throw Error('Depotposition mit ungültigen Werten.');
 if(p.kind!=='CASH'&&p.quantity<=0)throw Error('Position ohne positive Stückzahl.');
 if(p.kind!=='CASH'&&Math.abs(p.quantity*p.unitPrice*100-p.marketCents)>Math.max(100,Math.round(p.marketCents*.002)))throw Error('Kurs und Marktwert widersprechen sich bei '+p.isin+'.');
 return {...p,name:p.name.trim()};
}
export function parseFlatexPositionsCsv(text){
 if(typeof text!=='string'||text.length>1000000)throw Error('Depotdatei zu groß.');
 const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 if(lines.length<2||lines.length>202)throw Error('Keine gültige Depotdatei mit Positionen.');
 const head=lines.shift().split(';').map(x=>x.toLocaleLowerCase('de-AT'));
 if(JSON.stringify(head)!==JSON.stringify(HEAD))throw Error('Nicht unterstützter Depot-CSV-Aufbau. Bitte die Compass-Vorlage verwenden.');
 const items=[],keys=new Set();let day='';
 for(const line of lines){
  const cells=line.split(';');if(cells.length!==8)throw Error('Eine Depotzeile besitzt nicht acht Spalten.');
  const [d,isin0,name,kind0,quantity,unit,market,cost]=cells,kind=kind0.trim().toUpperCase(),isin=isin0.trim().toUpperCase();
  const p=validateFlatexPosition({day:d,isin,name,kind,quantity:number(quantity),unitPrice:number(unit),marketCents:cents(market),costCents:cents(cost)});
  if(day&&p.day!==day)throw Error('Ein Depotimport muss denselben Stichtag für alle Positionen haben.');day=p.day;
  if(keys.has(isin))throw Error('ISIN mehrfach in derselben Datei: '+isin);keys.add(isin);items.push(p);
 }
 if(!items.some(x=>x.kind!=='CASH'))throw Error('Keine Wertpapierpositionen in der Depotdatei.');
 return validateFlatexSnapshot({day,positions:items});
}
export function validateFlatexSnapshot(v){
 if(!v||!validDay(v.day)||!Array.isArray(v.positions)||v.positions.length<1||v.positions.length>200)throw Error('Ungültiger Depotstichtag.');
 const seen=new Set();return {day:v.day,positions:v.positions.map(raw=>{const p=validateFlatexPosition(raw);if(p.day!==v.day||seen.has(p.isin))throw Error('Doppelter oder abweichender Depotstichtag.');seen.add(p.isin);return p;})};
}
export function putFlatexSnapshot(snapshots=[],input){
 if(!Array.isArray(snapshots)||snapshots.length>2000)throw Error('Zu viele Depotstichtage.');
 const snap=validateFlatexSnapshot(input);
 return [...snapshots.filter(x=>x.day!==snap.day),snap].sort((a,b)=>a.day.localeCompare(b.day)).slice(-365);
}
export function latestFlatexSnapshot(snapshots=[]){
 let latest=null;for(const x of Array.isArray(snapshots)?snapshots:[]){try{const v=validateFlatexSnapshot(x);if(!latest||v.day>latest.day)latest=v;}catch{/* invalid old records ignored */}}
 return latest;
}
export function flatexSnapshotStats(snapshot){
 const p=snapshot?validateFlatexSnapshot(snapshot).positions:[];
 const shares=p.filter(x=>x.kind!=='CASH'),cash=p.filter(x=>x.kind==='CASH').reduce((a,x)=>a+x.marketCents,0);
 const value=shares.reduce((a,x)=>a+x.marketCents,0),cost=shares.reduce((a,x)=>a+x.costCents,0);
 return {day:snapshot?.day||'',positions:shares,sharesCents:value,cashCents:cash,overallCents:value+cash,costCents:cost,gainCents:value-cost,gainPercent:cost>0?100*(value-cost)/cost:null};
}
