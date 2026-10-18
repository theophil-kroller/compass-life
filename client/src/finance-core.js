/** Compass 0.5.14.1 · Local-first bank ledger, explainable categories, and explicit coarse buckets. */
import {detailedFinanceMatch,financeGenericFallback,updateBankSuggestions} from './finance-auto-rules.js';
import {matchPrivateFinanceRule} from './finance-private-rules.js';
import {isRevolutCsv,parseRevolutCsv} from './finance-revolut.js';
export {updateBankSuggestions} from './finance-auto-rules.js';
export const FINANCE_CATEGORIES=[
 ['Einnahmen','Gehalt'],['Einnahmen','Honorare'],['Einnahmen','Kapitalerträge'],['Einnahmen','Sonstiges'],
 ['Wohnen','Miete & Betriebskosten'],['Wohnen','Strom & Heizung'],['Wohnen','ORF-Beitrag'],['Wohnen','Haushalt & Einrichtung'],
 ['Lebensmittel','Supermarkt'],['Lebensmittel','Drogerie'],['Lebensmittel','Asia-Supermarkt'],['Lebensmittel','Bio-Lebensmittel'],['Lebensmittel','Bäckerei'],
 ['Essen & Ausgehen','Restaurant & Café'],['Essen & Ausgehen','Mensa & Kantine'],
 ['Mobilität','Öffentliche Verkehrsmittel'],['Mobilität','Auto & Tanken'],['Mobilität','Parken & Maut'],['Mobilität','Fahrrad'],
 ['Familie','Kinder & Unterhalt'],['Familie','Kinderreisen'],['Familie','Schul- & Kurskosten'],['Familie','Familie & Geschenke'],
 ['Gesundheit & Sport','Fitness & Sport'],['Gesundheit & Sport','Medizin & Apotheke'],['Gesundheit & Sport','Tanzen'],['Gesundheit & Sport','Kampfsport'],['Gesundheit & Sport','Sauna & Therme'],['Gesundheit & Sport','Schwimmen & Bäder'],['Gesundheit & Sport','Optik'],
 ['Freizeit & Reisen','Reisen & Unterkunft'],['Freizeit & Reisen','Flüge'],['Freizeit & Reisen','Kultur & Freizeit'],
 ['Bildung & Beruf','Bildung & Fachliteratur'],['Bildung & Beruf','Software & Beruf'],
 ['Verträge & Abos','Telekommunikation'],['Verträge & Abos','Streaming & Digitales'],['Verträge & Abos','Versicherungen'],
 ['Finanzen','Bankgebühren'],['Finanzen','Steuern & Abgaben'],['Finanzen','Kapitalertragsteuer'],['Finanzen','Sollzinsen'],
 ['Shopping','Online-Shopping'],['Shopping','Bekleidung & Sonstiges'],['Shopping','Zahlungsdienst (Inhalt unbekannt)'],
 ['Bargeld','Bargeldbehebung'],
 ['Transfer','Eigene Konten'],['Transfer','Depot & Wertpapiere'],['Transfer','Krypto'],['Transfer','Sparen'],['Transfer','Private Überweisung'],['Transfer','Kreditkartenabrechnung'],
 ['Rückerstattung','Rückzahlung'],['Rückerstattung','Lebensmittel-Erstattung'],['Rückerstattung','Steuerrückzahlung'],['Einnahmen','Familienleistungen'],['Einnahmen','Eingang ohne klare Herkunft'],['Sonstiges','Überweisung ohne klaren Zweck'],['Sonstiges','Zahlung ohne klaren Zweck'],['Prüfen','Noch ungeklärt']
];
const known=new Set(FINANCE_CATEGORIES.map(([a,b])=>a+' / '+b));
export const categoryLabel=(a,b)=>`${a} / ${b}`;
export const validCategory=c=>known.has(c);
const cleaning=s=>String(s??'').normalize('NFKC').trim();
const upper=s=>cleaning(s).toLocaleUpperCase('de-AT');
export const escapeFinance=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// RFC-4180-style semicolon CSV with multiline quoted payment references and escaped double-quotes.
export function splitBankCsv(input){
 const text=String(input??'').replace(/^\uFEFF/,'');const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){
  const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
  else if(ch===';'&&!quoted){row.push(field);field='';}
  else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(field);field='';if(row.some(x=>x.trim()))rows.push(row);row=[];}
  else field+=ch;
 }
 if(quoted)throw new Error('Bank-CSV enthält ein nicht geschlossenes Anführungszeichen.');
 row.push(field);if(row.some(x=>x.trim()))rows.push(row);
 return rows;
}
const bankDate=s=>{const m=/^(\d\d)\.(\d\d)\.(\d{4})$/.exec(cleaning(s));if(!m)return null;const y=+m[3],month=+m[2],day=+m[1];const d=new Date(Date.UTC(y,month-1,day));return d.getUTCFullYear()===y&&d.getUTCMonth()===month-1&&d.getUTCDate()===day?`${m[3]}-${m[2]}-${m[1]}`:null;};
export const euroNumber=s=>{const v=cleaning(s).replace(/\s/g,'');if(!/^[+-]?(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}$/.test(v))return null;const n=Number(v.replace(/\./g,'').replace(',','.'));return Number.isFinite(n)&&Math.abs(n)<1e11?Math.round(n*100):null;};
// 64-bit FNV-1a over all parsed source fields; deterministic across overlapping exports.
export function bankIdentity(fields){const bytes=new TextEncoder().encode(fields.map(cleaning).join('\u001f'));let h=0xcbf29ce484222325n;for(const b of bytes){h^=BigInt(b);h=BigInt.asUintN(64,h*0x100000001b3n);}return 'rb-'+h.toString(16).padStart(16,'0');}
export function bankMerchant(description){
 const s=cleaning(description);
 const match=s.match(/(?:Payment recipient|Recipient|Zahlungsempfänger|Empfänger):\s*(.{3,100}?)(?=\s+(?:Purpose of use|Payment reference|Recipient IBAN|Payment recipient IBAN|Recipient BIC|Client reference|Mandate reference|Empfänger IBAN|Zahlungsreferenz):|$)/i);
 if(match)return match[1].trim().slice(0,90);
 const pos=s.match(/(?:Payment reference|Purpose of use):\s*([A-Za-zÄÖÜäöüß0-9 '&.\-]{3,55}?)(?=\s{2,}|\s+K\d\s|\s+POS\b|\s+Card sequence|\s+Payment reference|$)/i);
 if(pos)return pos[1].trim().slice(0,55);
 const omit=s.replace(/(?:IBAN|BIC|RZSTAT2G|[A-Z]{2}\d{2}[A-Z0-9]{10,30})\S*/gi,'').replace(/\s+/g,' ').trim();return omit.slice(0,70)||'Unbekannter Zahlungspartner';
}
export const merchantKey=s=>upper(s).replace(/\s+/g,' ').trim().slice(0,90);
export const safeMerchantRule=merchant=>!/(?:^|\W)(?:PAYPAL|KLARNA|STRIPE|SUMUP|BUCHUNGEN|ONLINE BANKING|UNBEKANNT|EPAYMENT|POS)(?:$|\W)/iu.test(merchantKey(merchant));
const rule=(rx,cat,flow='expense',confidence='high')=>({rx:new RegExp(rx,'iu'),category:cat,flow,confidence});
// Real-world merchant rules derived from observed generic transaction descriptors; do not include a user's counterparties.
export const BANK_RULES=[
 rule('(?:^|\\W)(?:HOFER|BILLA|SPAR|INTERSPAR|LIDL|PENNY|EUROSPAR)(?:\\W|$)','Lebensmittel / Supermarkt'),
 rule('(?:^|\\W)(?:DM DROGERIE|DM-DROGERIE|BIPA|MÜLLER DROGERIE)(?:\\W|$)','Lebensmittel / Drogerie'),
 rule('(?:^|\\W)(?:WIENER LINIEN|OEBB|ÖBB|FLIXBUS|FLIXTRAIN|VERKEHRSVERBUND|HOLDING GRAZ LINIEN)(?:\\W|$)','Mobilität / Öffentliche Verkehrsmittel'),
 rule('(?:^|\\W)(?:OMV|SHELL|JET TANKSTELLE|TANKSTELLE|TURMOEL)(?:\\W|$)','Mobilität / Auto & Tanken'),
 rule('(?:^|\\W)(?:PARKGARAGE|PARKAUTOMAT|PARKTICKET|PARKHAUS|APCOA)(?:\\W|$)','Mobilität / Parken & Maut'),
 rule('(?:^|\\W)(?:ANSA FITNESS|FITNESSSTUDIO|FITINN|JOHN HARRIS|HOLMES PLACE|MCFIT)(?:\\W|$)','Gesundheit & Sport / Fitness & Sport'),
 rule('(?:^|\\W)(?:APOTHEKE|PHARMAZIE)(?:\\W|$)','Gesundheit & Sport / Medizin & Apotheke'),
 rule('(?:^|\\W)(?:WÜSTENROT|UNIQA|ALLIANZ|GENERALI|VERSICHERUNGS-AG|VERSICHERUNG)(?:\\W|$)','Verträge & Abos / Versicherungen'),
 rule('(?:^|\\W)(?:MAGENTA|A1 TELEKOM|DREI AT|HUTCHISON DREI|SPUSU)(?:\\W|$)','Verträge & Abos / Telekommunikation'),
 rule('(?:^|\\W)(?:NETFLIX|SPOTIFY|DISNEY\\+|APPLE.COM/BILL)(?:\\W|$)','Verträge & Abos / Streaming & Digitales'),
 rule('(?:^|\\W)(?:BETRIEBSKOSTEN|MIETE|HAUSVERWALTUNG)(?:\\W|$)','Wohnen / Miete & Betriebskosten'),
 rule('(?:^|\\W)(?:ENERGIE STEIERMARK|VERBUND|STROMRECHNUNG|GASRECHNUNG|ENERGIERECHNUNG)(?:\\W|$)','Wohnen / Strom & Heizung'),
 rule('(?:^|\\W)(?:MCDONALDS|MCDONALD.S|BURGER KING|STARBUCKS|BACKWERK)(?:\\W|$)','Essen & Ausgehen / Restaurant & Café'),
 rule('(?:^|\\W)(?:BOOKING.COM|AIRBNB|HOTEL|HOSTEL)(?:\\W|$)','Freizeit & Reisen / Reisen & Unterkunft'),
 rule('(?:^|\\W)(?:AMAZON|AMZN|TEMU)(?:\\W|$)','Shopping / Online-Shopping','expense','medium'),
 rule('(?:^|\W)(?:PAYPAL|KLARNA|STRIPE)(?:\\W|$)','Prüfen / Noch ungeklärt','expense','low'),
 rule('(?:^|\\W)(?:BARGELDBEHEBUNG|BARBEHEBUNG|GELDAUTOMAT|ATM WITHDRAWAL)(?:\\W|$)','Bargeld / Bargeldbehebung','cash','high'),
 rule('(?:^|\\W)(?:RAIFFEISEN.*(?:GEBÜHR|SPESEN)|KONTOFÜHRUNG|KONTOGEBÜHR|KARTENGEBÜHR)(?:\\W|$)','Finanzen / Bankgebühren'),
 rule('(?:^|\\W)(?:UNTERHALT)(?:\\W|$)','Familie / Kinder & Unterhalt','expense','medium'),
 rule('(?:^|\\W)(?:KRYPTO|KRAKEN)(?:\\W|$)','Transfer / Krypto','transfer','medium'),
 rule('(?:^|\\W)(?:FLATEX|DEPOTÜBERTRAG|WERTPAPIERKAUF)(?:\\W|$)','Transfer / Depot & Wertpapiere','transfer','medium'),
 rule('(?:^|\\W)(?:EIGENÜBERTRAG|EIGENES KONTO)(?:\\W|$)','Transfer / Eigene Konten','transfer','medium'),
];
export function classifyBankTransaction(transaction,customRules=[],privateRules=[]){
 const desc=transaction.description||'',m=merchantKey(transaction.merchant||bankMerchant(desc));
 for(const x of customRules){if(!x||!validCategory(x.category)||!x.merchantKey||!['income','expense','transfer','cash','refund'].includes(x.flow))continue;
  const family=x.category.split(' / ')[0];
  const type={Einnahmen:'income',Rückerstattung:'refund',Transfer:'transfer',Bargeld:'cash'}[family]||'expense';
  const directionOkay=x.flow==='transfer'||((x.flow==='income'||x.flow==='refund')?transaction.amountCents>0:transaction.amountCents<0);
  if(safeMerchantRule(m)&&m===x.merchantKey&&type===x.flow&&directionOkay)return {category:x.category,flow:x.flow,confidence:'confirmed',needsReview:false,source:'own-rule'};
 }
 const personal=matchPrivateFinanceRule(transaction,privateRules);if(personal)return personal;
 // More specific, auditable rules, including known Austrian merchants and tax/ATM cases.
 const detailed=detailedFinanceMatch(transaction);if(detailed)return detailed;
 // Never decide an incoming bank transfer is salary based only on the account being credited.
 if(transaction.amountCents>0){
  if(/(?:LOHN|GEHALT|SALARY|PAYROLL|BEZUGSABRECHNUNG)/iu.test(desc))return {category:'Einnahmen / Gehalt',flow:'income',confidence:'high',needsReview:false,source:'rule'};
  if(/(?:RÜCKERSTATTUNG|RUECKERSTATTUNG|RÜCKZAHLUNG|REFUND|STORNO|REToure)/iu.test(desc))return {category:'Rückerstattung / Rückzahlung',flow:'refund',confidence:'medium',needsReview:true,source:'rule'};
  return financeGenericFallback(transaction);
 }
 for(const r of BANK_RULES)if(r.rx.test(desc)){return {category:r.category,flow:r.flow,confidence:r.confidence,needsReview:r.confidence!=='high',source:'rule',ruleReason:r.confidence==='high'?'Bekannter Händler / bekannter Buchungszweck':'Grobe Händlerkategorie; Details aus Zahlung nicht erkennbar'};}
 return financeGenericFallback(transaction);
}
export function parseRaiffeisenCsv(text,{customRules=[],privateRules=[],maxRows=10000}={}){
 const raw=splitBankCsv(text);if(raw.length>maxRows)throw new Error(`Zu viele Buchungen in einer Datei (max. ${maxRows}).`);
 const rows=[];let skippedHeader=0;
 for(let i=0;i<raw.length;i++){
  const r=raw[i];if(r.length===6&&!bankDate(r[0])&&i===0&&/datum|buchung/i.test(r[0])){skippedHeader++;continue;}
  if(r.length!==6)throw new Error(`Bank-CSV: Zeile ${i+1} enthält ${r.length} statt 6 Felder.`);
  const day=bankDate(r[0]),valueDay=bankDate(r[2]);const amountCents=euroNumber(r[3]);
  if(!day||!valueDay||amountCents===null||upper(r[4])!=='EUR')throw new Error(`Bank-CSV: ungültiges Datum, Betrag oder Währung in Zeile ${i+1}.`);
  const fields=r.map(cleaning);const description=cleaning(r[1]).slice(0,3000);const merchant=bankMerchant(description);
  const t={id:bankIdentity(fields),day,valueDay,amountCents,description,merchant,currency:'EUR',bankReference:cleaning(r[5]).slice(0,150),source:'Raiffeisen CSV',accountId:'raiffeisen:current:EUR'};
  Object.assign(t,classifyBankTransaction(t,customRules,privateRules));rows.push(t);
 }
 return {rows,skippedHeader};
}
export function previewBankFiles(items,existing=[],customRules=[],privateRules=[]){
 const seen=new Set(existing.map(x=>x.id)),fresh=[],byAccount=new Map();let duplicates=0,reversed=0,fees=0;
 for(const {text,name} of items){
  const revolut=isRevolutCsv(text);
  const parsed=revolut?parseRevolutCsv(text,{customRules,privateRules,classify:classifyBankTransaction}):parseRaiffeisenCsv(text,{customRules,privateRules});
  reversed+=parsed.reversed||0;fees+=parsed.fees||0;
  for(const r of parsed.rows){if(seen.has(r.id)){duplicates++;continue;}seen.add(r.id);fresh.push({...r,sourceFile:String(name).slice(0,120)});const acc=r.accountId||'raiffeisen:current:EUR';byAccount.set(acc,(byAccount.get(acc)||0)+1);}
 }
 return {rows:fresh,duplicates,reversed,fees,byAccount:[...byAccount].map(([accountId,count])=>({accountId,count})),review:fresh.filter(x=>x.needsReview).length,auto:fresh.filter(x=>!x.needsReview).length};
}
export function categorizeTransaction(t,category,flow){
 if(!validCategory(category)||category==='Prüfen / Noch ungeklärt')throw new Error('Bitte eine konkrete gültige Kategorie auswählen.');
 if(!['income','expense','transfer','refund','cash'].includes(flow))throw new Error('Ungültige Geldfluss-Art.');
 const main=category.split(' / ')[0],expected={Einnahmen:'income',Rückerstattung:'refund',Transfer:'transfer',Bargeld:'cash'}[main]||'expense';
 if(flow!==expected)throw new Error('Kategorie und Geldfluss-Art passen nicht zusammen.');
 const amount=Number(t.amountCents);
 if(((flow==='expense'||flow==='cash')&&amount>=0)||((flow==='income'||flow==='refund')&&amount<=0))throw new Error('Vorzeichen und Geldfluss-Art passen nicht zusammen.');
 return {...t,category,flow,needsReview:false,confidence:'confirmed',source:'user',ruleReason:'Von dir bestätigt'};
}

export function financeViewModel(transactions=[],period='all'){
 const entries=transactions.filter(t=>period==='all'||t.day.startsWith(period));
 const sum=(list)=>list.reduce((n,x)=>n+Math.abs(x.amountCents),0);
 const income=entries.filter(x=>x.amountCents>0&&x.flow==='income'&&!x.needsReview);
 const refunds=entries.filter(x=>x.amountCents>0&&x.flow==='refund'&&!x.needsReview);
 const spending=entries.filter(x=>x.amountCents<0&&x.flow==='expense'&&!x.needsReview);
 const transfers=entries.filter(x=>x.amountCents<0&&x.flow==='transfer'&&!x.needsReview);
 const cash=entries.filter(x=>x.amountCents<0&&x.flow==='cash'&&!x.needsReview);
 const pending=entries.filter(x=>x.needsReview);
 const groups=new Map();for(const t of spending){const parent=t.category.split(' / ')[0];groups.set(parent,(groups.get(parent)||0)+Math.abs(t.amountCents));}
 const categories=[...groups].sort((a,b)=>b[1]-a[1]).map(([name,cents])=>({name,cents}));
 const months=new Map();for(const t of entries){const key=t.day.slice(0,7);const x=months.get(key)||{month:key,incomeCents:0,expenseCents:0,transferCents:0,pendingCents:0,pendingOutCents:0,pendingInCents:0};
  const v=Math.abs(t.amountCents);if(t.needsReview){x.pendingCents+=v;if(t.amountCents<0)x.pendingOutCents+=v;else x.pendingInCents+=v;}else if(t.flow==='income')x.incomeCents+=v;else if(t.flow==='expense')x.expenseCents+=v;else if(t.flow==='transfer')x.transferCents+=v;months.set(key,x);}
 const recurring=new Map();for(const t of spending){const m=merchantKey(t.merchant);if(!m)continue;const v=recurring.get(m)||{merchant:t.merchant,months:new Set(),amounts:[]};v.months.add(t.day.slice(0,7));v.amounts.push(Math.abs(t.amountCents));recurring.set(m,v);}
 const subscriptions=[...recurring.values()].filter(x=>x.months.size>=3).map(x=>({merchant:x.merchant,months:x.months.size,meanCents:Math.round(sum(x.amounts.map(amountCents=>({amountCents})))/x.amounts.length)})).sort((a,b)=>b.months-a.months).slice(0,18);
 return {count:entries.length,pending,auto:entries.filter(x=>!x.needsReview).length,incomeCents:sum(income),refundCents:sum(refunds),expenseCents:sum(spending),transferCents:sum(transfers),cashCents:sum(cash),pendingCents:sum(pending),pendingOutCents:sum(pending.filter(t=>t.amountCents<0)),pendingInCents:sum(pending.filter(t=>t.amountCents>0)),categories,months:[...months.values()].sort((a,b)=>a.month.localeCompare(b.month)),subscriptions,netCents:sum(income)+sum(refunds)-sum(spending)-sum(cash)-sum(transfers)};
}

/** Batch-review candidates are grouped by exact normalized counterparty and direction.
 * A group is only a suggestion: never auto-approve other purposes without explicit opt-in. */
export function financeReviewGroups(transactions=[]){
 const groups=new Map();
 for(const t of transactions.filter(x=>x.needsReview)){
  const key=merchantKey(t.merchant)+(safeMerchantRule(t.merchant)?'':'|'+t.id)+'|'+(t.amountCents>0?'in':'out')+'|'+t.flow;
  if(!groups.has(key))groups.set(key,{key,merchant:t.merchant,flow:t.flow,entries:[],sumCents:0});
  const g=groups.get(key);g.entries.push(t);g.sumCents+=Math.abs(t.amountCents);
 }
 return [...groups.values()].sort((a,b)=>b.entries.length-a.entries.length||b.sumCents-a.sumCents);
}
