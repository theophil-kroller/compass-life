/** Flatex Austria Kontoumsaetze (CSV) – ledger only, NOT a securities position statement.
 * Keeps trade settlement, internal cash legs, fund taxation and distributions distinct.
 * Deterministic IDs use transaction number plus unmodified source fields.
 */
import {splitBankCsv,euroNumber,bankIdentity} from './finance-core.js';
const clean=v=>String(v??'').trim();
const HEAD=['Buchungstag','Valuta','Empfänger','Zahlungspfl.','TA.Nr.','Buchungsinformationen','Betrag',''];
const sameHead=r=>r?.length===8&&HEAD.every((h,i)=>clean(r[i]).replace(/^\uFEFF/,'')===h);
const date=s=>{const m=/^(\d\d)\.(\d\d)\.(\d{4})$/.exec(clean(s));if(!m)return null;const d=new Date(Date.UTC(+m[3],+m[2]-1,+m[1]));return d.toISOString().slice(0,10)===`${m[3]}-${m[2]}-${m[1]}`?`${m[3]}-${m[2]}-${m[1]}`:null;};
export function isFlatexCsv(input){return sameHead(splitBankCsv(String(input??'').split(/\r?\n/,1)[0])[0]);}
export const flatexKind=description=>{
 const s=clean(description);
 if(/^Ausführung\s+(?:ORDER\s+)?Kauf\b/iu.test(s))return 'trade-buy';
 if(/^Ausführung\s+(?:ORDER\s+)?Verkauf\b/iu.test(s))return 'trade-sell';
 if(/^(?:Kauf|Verkauf)\s+[A-Z]{2}[A-Z0-9]{10}\b/iu.test(s))return 'trade-settlement';
 if(/^(?:Erträgnisausschüttung|Dividende|Ausschüttung|Zinsgutschrift)\b/iu.test(s))return 'distribution';
 if(/^Thesaurierung\s+transparenter\s?Fonds/iu.test(s))return 'fund-tax';
 if(/^Zinsabschluss\b/iu.test(s))return 'interest-close';
 if(/\b(?:KESt|Kapitalertragsteuer|Quellensteuer|Steuereinbehalt)\b/iu.test(s))return 'tax';
 if(/\b(?:Spesen|Gebühr|Provision)\b/iu.test(s))return 'fee';
 if(/\b(?:Überweisung|Umbuchung|CreditorReference|SEPA|Savings|Einzahlung|Auszahlung)\b/iu.test(s))return 'bank-transfer';
 return 'unknown';
};
export function parseFlatexCsv(input,{maxRows=15000}={}){
 const all=splitBankCsv(input);if(!sameHead(all[0]))throw Error('flatex: Kontoumsätze-Kopfzeile passt nicht. Bitte den vollständigen CSV-Export wählen.');
 if(all.length-1>maxRows)throw Error('flatex: Zu viele Buchungen in einer Datei.');
 let zero=0,unresolved=0;const rows=[],types={};
 for(let i=1;i<all.length;i++){
  const r=all[i];if(r.length!==8)throw Error(`flatex: Ungültige Spaltenzahl in Zeile ${i+1}.`);
  const day=date(r[0]),valueDay=date(r[1]),amountCents=euroNumber(r[6]),currency=clean(r[7]);
  if(!day||!valueDay||amountCents===null||currency!=='EUR'||!/^[0-9]{5,25}$/.test(clean(r[4])))throw Error(`flatex: Ungültige Buchung in Zeile ${i+1} (Datum, TA.Nr., Betrag oder Währung).`);
  if(!amountCents){zero++;continue;}
  const description=clean(r[5]).slice(0,1500),kind=flatexKind(description),isin=description.match(/\b[A-Z]{2}[A-Z0-9]{10}\b/u)?.[0]||'';
  let category='Prüfen / Noch ungeklärt',flow=amountCents>0?'income':'expense',needsReview=true,reason='Flatex-Buchung noch nicht sicher zugeordnet';
  if(['trade-buy','trade-sell','trade-settlement'].includes(kind)){
   category='Transfer / Depot & Wertpapiere';flow='transfer';needsReview=false;reason='Handels-/Abrechnungsbuchung ist keine Konsumausgabe und kein laufendes Einkommen';
  }else if(kind==='distribution'&&amountCents>0){
   category='Einnahmen / Kapitalerträge';flow='income';needsReview=false;reason='Gebuchte Ausschüttung; vor möglicher Steuer- und Quellensteuerbetrachtung';
  }else if(kind==='fund-tax'||kind==='tax'){
   if(amountCents<0){category='Finanzen / Kapitalertragsteuer';flow='expense';needsReview=false;reason='Steuerabzug (nicht freiwilliger Konsum)';}
  }else if(kind==='fee'&&amountCents<0){category='Finanzen / Bankgebühren';flow='expense';needsReview=false;reason='Abgerechnete Depot-/Bankspesen';}
  else if(kind==='bank-transfer'){
   category='Transfer / Eigene Konten';flow='transfer';needsReview=true;reason='Gegenkonto / Herkunft des Flatex-Transfers bitte prüfen';
  }
  if(needsReview)unresolved++;
  const t={id:'flatex-'+bankIdentity(['flatex',...r]).slice(3),day,valueDay,amountCents,currency:'EUR',accountId:'flatex:cash:EUR',accountDisplay:'flatex · Verrechnungskonto',source:'flatex CSV',sourceFileType:'flatex',bankReference:clean(r[4]),description,merchant:isin?`flatex · ${isin}`:'flatex',flatexKind:kind,flatexIsin:isin,category,flow,needsReview,confidence:needsReview?'low':'high',ruleReason:reason};
  rows.push(t);types[kind]=(types[kind]||0)+1;
 }
 return {rows,zero,unresolved,types};
}
