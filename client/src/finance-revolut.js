/** Revolut current-account statement import (2020+ CSV).
 * Local processing only. Never equate a transfer between own accounts with income or consumption.
 * The Amount field excludes the separate Fee field (verified against statement balances).
 */
export const BANK_ACCOUNTS=[
 {id:'raiffeisen:current:EUR',label:'Raiffeisen · Giro',bank:'Raiffeisen'},
 {id:'revolut:current:EUR',label:'Revolut · Current EUR',bank:'Revolut'},
 {id:'n26:current:EUR',label:'N26 · Giro EUR',bank:'N26'},
 {id:'dkb:current:EUR',label:'DKB · Giro EUR',bank:'DKB'}
];
export const accountFor=t=>String(t?.accountId||'raiffeisen:current:EUR');
export const accountLabel=t=>String(t?.accountDisplay||BANK_ACCOUNTS.find(x=>x.id===accountFor(t))?.label||(
 accountFor(t).startsWith('dkb:visa:')?'DKB · Visa':accountFor(t).startsWith('n26:space:')?'N26 · Space':accountFor(t))).slice(0,100);
export function accountChoices(transactions=[]){
 const base=BANK_ACCOUNTS.map(x=>({id:x.id,label:x.label})),seen=new Set(base.map(x=>x.id));
 for(const t of transactions){const id=accountFor(t);if(!seen.has(id)){base.push({id,label:accountLabel(t)});seen.add(id);}}
 return base;
}
export const accountMatches=(t,selection='all')=>selection==='all'||accountFor(t)===selection;

// RFC 4180 CSV (commas, BOM, multiline quotes, escaped quotes); protects against badly formed exports.
export function parseCommaCsv(text){
 const input=String(text||'').replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<input.length;i++){
  const c=input[i];if(c==='"'){if(quoted&&input[i+1]==='"'){field+='"';i++;}else if(!quoted&&!field)quoted=true;else if(quoted)quoted=false;else field+='"';}
  else if(c===','&&!quoted){row.push(field);field='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(field);if(row.some(v=>v.trim()))rows.push(row);row=[];field='';}
  else field+=c;
 }
 if(quoted)throw Error('Revolut-CSV: unvollständiges Anführungszeichen');row.push(field);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
const HEADERS=['Type','Product','Started Date','Completed Date','Description','Amount','Fee','Currency','State','Balance'];
const exactHeader=fields=>HEADERS.every(h=>fields.includes(h));
export const isRevolutCsv=content=>{
 const first=String(content||'').replace(/^\uFEFF/,'').split(/\r?\n/,1)[0];
 return exactHeader(first.replace(/^\uFEFF/,'').split(','));
};
const amt=value=>{const v=String(value||'').trim();if(!/^-?\d+(?:\.\d{1,2})?$/.test(v))return null;const sign=v.startsWith('-')?-1:1;const [integer,dec='']=v.replace(/^-/,'').split('.');const cents=sign*(Number(integer)*100+Number(dec.padEnd(2,'0')));return Number.isSafeInteger(cents)?cents:null;};
const date=v=>{const m=/^(\d{4})-(\d\d)-(\d\d)(?:[ T]\d\d:\d\d:\d\d)?$/.exec(String(v||''));if(!m)return null;const d=new Date(`${m[1]}-${m[2]}-${m[3]}T12:00:00Z`);return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===`${m[1]}-${m[2]}-${m[3]}`?`${m[1]}-${m[2]}-${m[3]}`:null;};
function identity(parts){const bytes=new TextEncoder().encode(parts.join('\u001f'));let h=0xcbf29ce484222325n;for(const b of bytes){h^=BigInt(b);h=BigInt.asUintN(64,h*0x100000001b3n);}return 'rv-'+h.toString(16).padStart(16,'0');}
const escName=s=>String(s??'').trim().slice(0,160);
export function parseRevolutCsv(text,{customRules=[],privateRules=[],classify=null,maxRows=12000}={}){
 const lines=parseCommaCsv(text);if(!lines.length||!exactHeader(lines[0]))throw Error('Die CSV hat keine unterstützte Revolut-Headerstruktur.');
 const fields=lines[0],idx=HEADERS.map(h=>fields.indexOf(h));if(lines.length-1>maxRows)throw Error('Revolut-CSV enthält zu viele Zeilen.');
 const rows=[];let reversed=0,fees=0,unsupportedCurrency=0,skipped=0;
 for(let j=1;j<lines.length;j++){
  const raw=lines[j];if(raw.length!==fields.length)throw Error(`Revolut-CSV: falsche Feldzahl in Zeile ${j+1}.`);
  const o=Object.fromEntries(HEADERS.map((n,k)=>[n,raw[idx[k]]])),state=o.State.trim();
  if(state==='REVERTED'||state==='PENDING'){reversed++;continue;}
  if(state!=='COMPLETED'){skipped++;continue;}
  if(o.Currency!=='EUR'){unsupportedCurrency++;continue;} // no fictitious FX rate
  const day=date(o['Completed Date']),startedDay=date(o['Started Date']),value=amt(o.Amount),fee=amt(o.Fee);
  if(!day||!startedDay||value===null||fee===null||fee<0)throw Error(`Revolut-CSV: ungültiges Datum oder Betrag in Zeile ${j+1}.`);
  if(!value&&!fee){skipped++;continue;}
  const baseId=identity(HEADERS.filter(n=>n!=='Balance').map(n=>o[n]));
  const description=escName(o.Description)||'Revolut-Buchung',type=o.Type.trim(),incoming=value>0;
  const t={id:baseId,accountId:'revolut:current:EUR',day,valueDay:day,startedDay,amountCents:value,description,merchant:description.slice(0,90),currency:'EUR',sourceFileType:'revolut-csv',revolutType:type,source:'Revolut CSV'};
  let result;
  switch(type){
   case 'Card Payment': result=incoming?{category:'Prüfen / Noch ungeklärt',flow:'income',needsReview:true,confidence:'low',source:'revolut-review'}:classify?classify(t,customRules,privateRules):{category:'Prüfen / Noch ungeklärt',flow:'expense',needsReview:true,confidence:'low',source:'revolut-uncertain'};break;
   case 'Card Refund':case 'Refund':result={category:'Rückerstattung / Rückzahlung',flow:'refund',needsReview:false,confidence:'high',source:'revolut-type'};break;
   case 'ATM':result={category:'Bargeld / Bargeldbehebung',flow:'cash',needsReview:false,confidence:'high',source:'revolut-type'};break;
   case 'Fee':result={category:'Finanzen / Bankgebühren',flow:'expense',needsReview:false,confidence:'high',source:'revolut-type'};break;
   case 'Reward':result={category:'Einnahmen / Sonstiges',flow:'income',needsReview:false,confidence:'high',source:'revolut-type'};break;
   case 'Deposit':case 'Transfer':result={category:'Prüfen / Noch ungeklärt',flow:incoming?'income':'transfer',needsReview:true,confidence:'low',source:'revolut-review',ruleReason:'Transfer oder Einzahlung: Gegenkonto und Zweck bitte prüfen'};break;
   default:result={category:'Prüfen / Noch ungeklärt',flow:incoming?'income':'expense',needsReview:true,confidence:'low',source:'revolut-review'};
  }
  if(value)rows.push({...t,...result});
  if(fee){fees++;rows.push({...t,id:baseId+'-fee',amountCents:-fee,merchant:'Revolut · Gebühr',description:`Revolut-Gebühr (${type})`,revolutType:'Fee on '+type,category:'Finanzen / Bankgebühren',flow:'expense',confidence:'high',needsReview:false,source:'revolut-fee'});}
 }
 if(unsupportedCurrency)throw Error(`Revolut-CSV enthält ${unsupportedCurrency} Buchungen in anderen Währungen. Bitte EUR-Konto separat exportieren; eine Umrechnung ohne Wechselkurs erfolgt nicht.`);
 return {rows,reversed,fees,skipped};
}
/** Opposite-direction movements, same amount, near dates on separate accounts.
 * These are ONLY candidate matches until explicit approval.
 */
export function transferCandidates(transactions=[],limit=12){
 const explicit=t=>t.flow==='transfer'||['Deposit','Transfer'].includes(t.revolutType)||/\b(?:TOP[ .-]?UP|ÜBERTRAG|UEBERTRAG|ÜBERWEISUNG|UEBERWEISUNG|SEPA[ -]TRANSFER|OWN ACCOUNT|EIGEN(?:ES)? KONTO|N26|REVOLUT|DKB|RAIFFEISEN|VISA(?:-?ABRECHNUNG)?|KREDITKARTENABRECHNUNG)\b/iu.test(String(t.description||''));
 // An unclassified positive credit can be the receiving leg of a bank transfer.
 // Ordinary card purchases, salaries and confirmed consumption are NOT transfer evidence.
 const eligible=(a,b)=>{
  const ae=explicit(a),be=explicit(b);
  if(ae&&be){const confirmedPurchase=[a,b].some(t=>t.flow==='expense'&&!t.needsReview&&!/(?:\b(?:UEBERWEISUNG|TRANSFER|UEBERTRAG|EIGEN(?:ES)? KONTO)\b|ÜBERWEISUNG|ÜBERTRAG)/iu.test(String(t.description||'')));return confirmedPurchase?0:2;}
  const receiving=a.amountCents>0?a:b,initiator=receiving===a?b:a;
  return explicit(initiator)&&receiving.needsReview===true&&receiving.amountCents>0?1:0;
 };
 const sorted=transactions.filter(t=>t&&Number.isSafeInteger(t.amountCents)&&t.amountCents!==0&&/^\d{4}-\d\d-\d\d$/.test(t.day||'')&&!String(t.id).endsWith('-fee')&&!t.linkedTransferId).sort((a,b)=>String(b.day).localeCompare(a.day));
 const byAmount=new Map();for(const r of sorted){const list=byAmount.get(r.amountCents)||[];list.push(r);byAmount.set(r.amountCents,list);}
 const paired=new Set(),out=[];
 for(const a of sorted){if(paired.has(a.id))continue;
  const options=(byAmount.get(-a.amountCents)||[]).filter(b=>b.id!==a.id&&!paired.has(b.id)&&accountFor(a)!==accountFor(b)&&Math.abs(Date.parse(a.day)-Date.parse(b.day))<=3*86400000&&eligible(a,b)>0);
  if(!options.length)continue;
  options.sort((x,y)=>eligible(a,y)-eligible(a,x)||Math.abs(Date.parse(a.day)-Date.parse(x.day))-Math.abs(Date.parse(a.day)-Date.parse(y.day))||x.id.localeCompare(y.id));
  const b=options[0];paired.add(a.id);paired.add(b.id);
  const [first,second]=[a,b].sort((x,y)=>x.id.localeCompare(y.id));
  out.push({aId:first.id,bId:second.id,day:first.day,otherDay:second.day,amountCents:Math.abs(first.amountCents),accounts:[accountLabel(first),accountLabel(second)]});
  if(out.length>=limit)break;
 }
 return out;
}
