/** Deterministic N26 and DKB statement adapters. All input is parsed offline in the client.
 * Bank and account TYPE are recognized by headers, not an untrusted filename alone.
 * Never store or publish bank account numbers from the export header in source code.
 */
import {parseCommaCsv} from './finance-revolut.js';
import {isFlatexCsv} from './finance-flatex-v36.js';

const N26=['Booking Date','Value Date','Partner Name','Partner Iban','Type','Payment Reference','Account Name','Amount (EUR)','Original Amount','Original Currency','Exchange Rate'];
const DKB_GIRO=['Buchungsdatum','Wertstellung','Status','Zahlungspflichtige*r','Zahlungsempfänger*in','Verwendungszweck','Umsatztyp','IBAN','Betrag (€)','Gläubiger-ID','Mandatsreferenz','Kundenreferenz'];
const DKB_VISA=['Belegdatum','Wertstellung','Status','Beschreibung','Umsatztyp','Betrag (€)','Fremdwährungsbetrag'];
const same=(got,wanted)=>got.length===wanted.length&&wanted.every((v,i)=>got[i]===v);
const clean=s=>String(s??'').trim();
const integerHash=parts=>{let h=0x811c9dc5;for(const b of new TextEncoder().encode(parts.join('\x1f'))){h=Math.imul(h^b,0x01000193)>>>0;}return h.toString(16).padStart(8,'0');};
const decCents=(s,locale='de')=>{
 const v=clean(s).replace(/\s|\u00a0/g,'');const normal=locale==='de'?v.replace(/\./g,'').replace(',','.'):v;
 if(!/^[+-]?\d+(?:\.\d{1,2})?$/.test(normal))return null;
 const sign=normal.startsWith('-')?-1:1,[i,fract='']=normal.replace(/^[+-]/,'').split('.');const result=sign*(Number(i)*100+Number(fract.padEnd(2,'0')));
 return Number.isSafeInteger(result)?result:null;
};
const day=(value)=>{
 const s=clean(value);let m=s.match(/^(\d{4})-(\d\d)-(\d\d)$/);if(!m){m=s.match(/^(\d\d)\.(\d\d)\.(\d{2,4})$/);if(!m)return null;const y=m[3].length===2?`20${m[3]}`:m[3];m=[null,y,m[2],m[1]];}
 const v=`${m[1]}-${m[2]}-${m[3]}`,d=new Date(`${v}T12:00:00Z`);return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v?v:null;
};
const header=(rows,fields)=>rows.findIndex(row=>same(row,fields));
const n26Space=(name)=>name==='Hauptkonto'||name==='Main Account'?'n26:current:EUR':`n26:space:${integerHash([name])}`;
export function detectFinanceFormat(text,name=''){
 const start=String(text||'').replace(/^\uFEFF/,'').slice(0,12000);
 if(isFlatexCsv(start))return 'flatex';
 const comma=parseCommaCsv(start.split(/\r?\n/,1)[0]); // inspect only the intact first header row
 if(comma.length&&same(comma[0],N26))return 'n26';
 const lines=start.split(/\r?\n/).slice(0,12);
 const first=(lines[0]||'').replace(/^\uFEFF/,'');
 if(first.startsWith('Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance'))return 'revolut';
 if(lines.some(line=>line.replace(/"/g,'').includes('Buchungsdatum;Wertstellung;Status;Zahlungspflichtige*r;Zahlungsempfänger*in')))return 'dkb-giro';
 if(lines.some(line=>line.replace(/"/g,'').includes('Belegdatum;Wertstellung;Status;Beschreibung;Umsatztyp;Betrag (€)')))return 'dkb-visa';
 // Raiffeisen's six-column format has no stable bank name in its filename.
 // Require a valid row shape and date/currency fields; never infer from the filename only.
 const row=first.split(';').map(x=>x.replace(/^"|"$/g,''));
 if(row.length===6&&/^\d\d\.\d\d\.\d{4}$/.test(row[0])&&row[4]==='EUR')return 'raiffeisen';
 if(row.length===6&&/^datum|buchung/i.test(row[0]))return 'raiffeisen';
 return 'unknown';
}
// Semicolon DKB statements include preambles and escaped quoted fields.
function parseSemiCsv(text){const input=String(text||'').replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<input.length;i++){const c=input[i];if(c==='"'){if(quoted&&input[i+1]==='"'){field+='"';i++;}else if(!quoted&&!field)quoted=true;else if(quoted)quoted=false;else field+='"';}
 else if(c===';'&&!quoted){row.push(field);field='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(field);if(row.some(x=>clean(x)))rows.push(row);row=[];field='';}else field+=c;}
 if(quoted)throw Error('DKB-CSV enthält ungeschlossene Anführungszeichen');row.push(field);if(row.some(x=>clean(x)))rows.push(row);return rows;
}
const pending=(incoming,reason='Zahlungseingang oder Kontoübertrag bitte prüfen')=>({category:'Prüfen / Noch ungeklärt',flow:incoming?'income':'expense',confidence:'low',needsReview:true,source:'bank-review',ruleReason:reason});
const transfer=(category='Transfer / Eigene Konten',reason='Vermuteter Kontoübertrag; Gegenbuchung prüfen')=>({category,flow:'transfer',confidence:'low',needsReview:true,source:'transfer-candidate',ruleReason:reason});
const expense=(entry,classify,customRules,privateRules)=>classify?classify(entry,customRules,privateRules):pending(false,'Ausgabe unbekannter Art');
const accountName=n=>String(n||'').trim().slice(0,70);
export function parseN26Csv(text,{classify,customRules=[],privateRules=[],maxRows=15000}={}){
 const rows=parseCommaCsv(text);if(!rows.length||!same(rows[0],N26))throw Error('N26-Spalten passen nicht zum unterstützten N26-CSV.');if(rows.length-1>maxRows)throw Error('N26-CSV enthält zu viele Zeilen.');
 const result=[];let skipped=0;const occurrence=new Map();
 for(const [index,r] of rows.entries()){if(index===0)continue;if(r.length!==N26.length)throw Error(`N26-CSV: Spaltenzahl in Zeile ${index+1} stimmt nicht.`);
 const o=Object.fromEntries(N26.map((h,i)=>[h,r[i]])),d=day(o['Booking Date']),valueDay=day(o['Value Date'])||d,amount=decCents(o['Amount (EUR)'],'en');
 if(!d||amount===null)throw Error(`N26-CSV: ungültiges Datum oder Betrag in Zeile ${index+1}`);if(!amount){skipped++;continue;}
 const space=accountName(o['Account Name'])||'Hauptkonto',accountId=n26Space(space);const merchant=clean(o['Partner Name'])||'N26';const description=[merchant,clean(o['Payment Reference'])].filter(Boolean).join(' · ').slice(0,2500);
 const signature=integerHash(['n26',...r]),ordinal=(occurrence.get(signature)||0)+1;occurrence.set(signature,ordinal);
 const t={id:`n26-${signature}-${ordinal}`,accountId,accountDisplay:accountId==='n26:current:EUR'?'N26 · Giro':`N26 · ${space}`,day:d,valueDay,amountCents:amount,merchant:merchant.slice(0,90),description,currency:'EUR',sourceFileType:'n26-csv',source:'N26 CSV',n26Type:clean(o.Type)};
 const type=t.n26Type,up=amount>0;let classification;
 if(type==='Presentment')classification=up?pending(true,'Kartengutschrift prüfen'):expense(t,classify,customRules,privateRules);
 else if(type==='Presentment Refund'||type==='Direct Debit Reversal')classification={category:'Rückerstattung / Rückzahlung',flow:'refund',confidence:'high',needsReview:false,source:'n26-type'};
 else if(type==='Fee')classification={category:'Finanzen / Bankgebühren',flow:'expense',confidence:'high',needsReview:false,source:'n26-type'};
 else if(type==='Direct Debit')classification=up?pending(true):expense(t,classify,customRules,privateRules);
 else if(['Credit Transfer','Debit Transfer','MoneyBeam'].includes(type)){
  const owns=/\b(?:N26|REVOLUT|DKB|RAIFFEISEN|SPARE|SAVINGS|UMBUCHUNG|EIGEN(?:ES|E)?\s+KONTO)\b/iu.test(description);
  classification=owns?transfer('Transfer / Eigene Konten','Eigenübertrag möglich – bitte Gegenbuchung bestätigen'):pending(up,'Überweisung: Einkommen, Konsum oder eigenes Konto?');
  if(!up&&classify){const c=classify(t,customRules,privateRules);if(['Transfer / Krypto','Transfer / Depot & Wertpapiere'].includes(c.category))classification={...c,needsReview:false};}
 }else classification=pending(up,'N26-Vorgangsart noch nicht klassifiziert');
 result.push({...t,...classification});
 }
 return {rows:result,skipped};
}
function parseDkb(text,kind,{classify,customRules=[],privateRules=[],maxRows=15000}={}){
 const all=parseSemiCsv(text),fields=kind==='giro'?DKB_GIRO:DKB_VISA,start=header(all,fields);if(start<0)throw Error('DKB-CSV-Kopfzeile für diese Kontoart nicht gefunden.');if(all.length-start-1>maxRows)throw Error('DKB-CSV enthält zu viele Zeilen.');
 const rows=[];let skipped=0,zero=0;const occ=new Map();
 const first=all[0]||[],last4=kind==='visa'?(first[2]||'').match(/\d{4}\s*$/)?.[0]?.trim()||'unknown':'';
 for(let i=start+1;i<all.length;i++){
  const r=all[i];if(r.length!==fields.length)throw Error(`DKB-CSV: ungültige Spaltenzahl in Datenzeile ${i+1}.`);const o=Object.fromEntries(fields.map((key,j)=>[key,r[j]]));
  if(clean(o.Status)!=='Gebucht'){skipped++;continue;}
  const d=day(o[kind==='giro'?'Buchungsdatum':'Belegdatum']),valueDay=day(o.Wertstellung)||d,cents=decCents(o['Betrag (€)']);
  if(!d||cents===null)throw Error(`DKB-CSV: Datum/Betrag in Zeile ${i+1} ungültig.`);if(!cents){zero++;continue;}
  const accountId=kind==='giro'?'dkb:current:EUR':`dkb:visa:${last4}`,label=kind==='giro'?'DKB · Giro':`DKB · Visa ${last4==='unknown'?'':('•••• '+last4)}`.trim();
  const merchant=kind==='giro'?clean(cents<0?o['Zahlungsempfänger*in']:o['Zahlungspflichtige*r']):clean(o.Beschreibung);
  const description=(kind==='giro'?[merchant,clean(o.Verwendungszweck)].filter(Boolean).join(' · '):merchant).slice(0,3000);
  const signature=integerHash([kind,...r]),ordinal=(occ.get(signature)||0)+1;occ.set(signature,ordinal);
  const entry={id:`dkb-${kind}-${signature}-${ordinal}`,accountId,accountDisplay:label,day:d,valueDay,amountCents:cents,merchant:(merchant||'DKB').slice(0,90),description,currency:'EUR',source:'DKB CSV',sourceFileType:`dkb-${kind}-csv`,dkbType:clean(o.Umsatztyp)};
  const credit=cents>0;let classification;
  if(kind==='giro'){
   if(/\b(?:VISA|KREDITKARTE|KREDITKARTEN|KARTENABRECHNUNG)\b/iu.test(description))classification=transfer('Transfer / Kreditkartenabrechnung','Mögliche DKB-Visa-Abrechnung – Gegenbuchung bitte prüfen');
   else if(/\b(?:REVOLUT|N26|RAIFFEISEN|EIGEN(?:ES|E)?\s+KONTO|UMBUCHUNG)\b/iu.test(description))classification=transfer('Transfer / Eigene Konten','Möglicher eigener Banktransfer – Gegenbuchung bitte prüfen');
   else classification=credit?pending(true,'Zahlungseingang: Einkommen oder Kontoübertrag?'):expense(entry,classify,customRules,privateRules);
  }else{
   // DKB Visa exports can contain interest/tax-only records. These are genuine
   // financial events, but NOT card purchases or transfers from the giro account.
   if(credit&&/\b(?:Habenzinsen|Guthabenzinsen|Zinsgutschrift)\b/iu.test(description))
    classification={category:'Einnahmen / Kapitalerträge',flow:'income',confidence:'high',needsReview:false,source:'dkb-visa-interest',ruleReason:'Zinsgutschrift (DKB Visa)'};
   else if(!credit&&/\b(?:Abgeltungsteuer|Kapitalertragsteuer|KapESt)\b/iu.test(description))
    classification={category:'Finanzen / Kapitalertragsteuer',flow:'expense',confidence:'high',needsReview:false,source:'dkb-visa-tax',ruleReason:'Einbehaltene Kapitalertragsteuer (DKB Visa)'};
   else classification=credit?pending(true,'Visa-Gutschrift oder Rückzahlung bitte prüfen'):expense(entry,classify,customRules,privateRules);
  }
  rows.push({...entry,...classification});
 }
 return {rows,skipped,zero};
}
export const parseDkbGiroCsv=(s,opt)=>parseDkb(s,'giro',opt);
export const parseDkbVisaCsv=(s,opt)=>parseDkb(s,'visa',opt);
