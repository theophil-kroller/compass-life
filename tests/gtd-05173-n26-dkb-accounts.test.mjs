import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {detectFinanceFormat,parseN26Csv,parseDkbGiroCsv,parseDkbVisaCsv} from '../client/src/finance-account-import.js';
import {previewBankFiles} from '../client/src/finance-core.js';
import {transferCandidates} from '../client/src/finance-revolut.js';
import {accountFlowView,verifiedAccountEdges} from '../client/src/finance-account-flows.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';

const n26Header='Booking Date,Value Date,Partner Name,Partner Iban,Type,Payment Reference,Account Name,Amount (EUR),Original Amount,Original Currency,Exchange Rate';
const n26Csv=[n26Header,'2026-10-16,2026-10-16,Local Bakery,,Presentment,,Hauptkonto,-4.80,-4.80,EUR,1','2026-10-16,2026-10-16,Local Savings,,Debit Transfer,,Reserve,-40.00,-40.00,EUR,1'].join('\n');
const giroHeader='Buchungsdatum;Wertstellung;Status;Zahlungspflichtige*r;Zahlungsempfänger*in;Verwendungszweck;Umsatztyp;IBAN;Betrag (€);Gläubiger-ID;Mandatsreferenz;Kundenreferenz';
const giroCsv=['Kontotyp;Girokonto','','',giroHeader,'15.10.2026;16.10.2026;Gebucht;;Visa Kreditkarte;Ausgleich VISA;Ausgang;;-200,00;;;','15.10.2026;16.10.2026;Gebucht;;Unknown Store;Purchase;Ausgang;;-20,19;;;','15.10.2026;16.10.2026;Gebucht;;Unknown Store;Info;Ausgang;;0,00;;;'].join('\n');
const visaHeader='Belegdatum;Wertstellung;Status;Beschreibung;Umsatztyp;Betrag (€);Fremdwährungsbetrag';
const visaCsv=['Karte;Visa Kreditkarte;0000','','',visaHeader,'16.10.2026;16.10.2026;Gebucht;Visa repayment;Unbekannt;200,00;','17.10.2026;17.10.2026;Gebucht;Rail ticket;Unbekannt;-9,50;'].join('\n');

test('actual headers determine N26 versus DKB Giro and DKB Visa, not filenames',()=>{
 assert.equal(detectFinanceFormat(n26Csv,'DKB.csv'),'n26');
 assert.equal(detectFinanceFormat(giroCsv,'N26.csv'),'dkb-giro');
 assert.equal(detectFinanceFormat(visaCsv,'giro.csv'),'dkb-visa');
 assert.equal(detectFinanceFormat('unknown,broken','DKB.csv'),'unknown');
});
test('N26 respects Spaces and imports existing entries without duplicating on re-import',()=>{
 const n=parseN26Csv(n26Csv);assert.equal(n.rows.length,2);
 assert.equal(n.rows[0].accountId,'n26:current:EUR');assert.ok(n.rows[1].accountId.startsWith('n26:space:'));
 const rows=previewBankFiles([{name:'private-account.csv',text:n26Csv}]);
 assert.equal(rows.rows.length,2);assert.ok(rows.rows.every(t=>!t.sourceFile));
 assert.equal(previewBankFiles([{name:'private-account.csv',text:n26Csv}],rows.rows).rows.length,0);
});
test('DKB Giro Visa maintain different account identities and exclude zero-value rows',()=>{
 const giro=parseDkbGiroCsv(giroCsv),visa=parseDkbVisaCsv(visaCsv);
 assert.equal(giro.rows.length,2);assert.equal(giro.zero,1);
 assert.equal(visa.rows.length,2);
 assert.equal(giro.rows[0].accountId,'dkb:current:EUR');assert.equal(visa.rows[0].accountId,'dkb:visa:0000');
 assert.equal(giro.rows[0].flow,'transfer');assert.equal(giro.rows[0].needsReview,true);
 assert.equal(visa.rows[0].needsReview,true);
});
test('a matching bank-card repayment is proposed but never counted as third-party consumption',()=>{
 const transactions=[...parseDkbGiroCsv(giroCsv).rows,...parseDkbVisaCsv(visaCsv).rows];
 const suggestions=transferCandidates(transactions);
 assert.equal(suggestions.length,1);assert.equal(suggestions[0].amountCents,20000);
 assert.equal(verifiedAccountEdges(transactions).length,0);
 const [a,b]=transactions.filter(t=>Math.abs(t.amountCents)===20000);
 for(const [t,other] of [[a,b],[b,a]])Object.assign(t,{linkedTransferId:other.id,flow:'transfer',category:'Transfer / Eigene Konten',needsReview:false});
 const edges=verifiedAccountEdges(transactions);
 assert.equal(edges.length,1);assert.equal(edges[0].cents,20000);
 assert.match(accountFlowView(transactions),/DKB · Visa/);
});
test('normal consumer debits cannot be proposed as bank-to-bank transfers due to amount coincidence',()=>{
 const one={id:'bank',day:'2026-10-15',amountCents:4000,accountId:'n26:current:EUR',flow:'transfer',description:'From savings'};
 const other={id:'purchase',day:'2026-10-16',amountCents:-4000,accountId:'dkb:visa:0000',flow:'expense',description:'Local Cafe',needsReview:false};
 assert.equal(transferCandidates([one,other]).length,0);
});
test('finance dashboard renders distinct account controls and a dedicated transfer view',()=>{
 const html=financeDashboardView({financeTransactions:[]},'Kontenflüsse','all',null,0,{account:'all',today:'2026-10-19'});
 assert.match(html,/finance-account/);assert.match(html,/Mein Geld zwischen den Konten/);
 assert.match(html,/N26/);assert.match(html,/DKB/);
});
test('no real bank numbers or raw bank data embedded in source or test fixtures',()=>{
 for(const f of ['../client/src/finance-account-import.js','../client/src/finance-account-flows.js','../client/src/finance-dashboard.js','../client/src/main.js']){
  const code=readFileSync(new URL(f,import.meta.url),'utf8');assert.doesNotMatch(code,/DE\d{20}/);
 }
});

test('Visa interest and capital gains withholding tax are not card purchases or account transfers',()=>{
 const header='Belegdatum;Wertstellung;Status;Beschreibung;Umsatztyp;Betrag (€);Fremdwährungsbetrag';
 const statement=['Karte;Visa Kreditkarte;0000','','',header,'16.10.2026;16.10.2026;Gebucht;Habenzinsen;Unbekannt;2,50;','16.10.2026;16.10.2026;Gebucht;Abgeltungsteuer;Unbekannt;-0,66;'].join('\n');
 const {rows}=parseDkbVisaCsv(statement);
 assert.equal(rows[0].category,'Einnahmen / Kapitalerträge');
 assert.equal(rows[0].needsReview,false);
 assert.equal(rows[1].category,'Finanzen / Kapitalertragsteuer');
 assert.equal(rows[1].needsReview,false);
 assert.equal(transferCandidates(rows).length,0);
});

test('confirmed crypto or brokerage transfers appear as asset reallocations, not consumer spending',()=>{
 const entries=[
  {id:'a',accountId:'raiffeisen:current:EUR',day:'2026-10-01',amountCents:-12000,needsReview:false,flow:'transfer',category:'Transfer / Krypto',description:'Kraken',source:'user'},
  {id:'b',accountId:'dkb:current:EUR',day:'2026-10-02',amountCents:-25000,needsReview:false,flow:'transfer',category:'Transfer / Depot & Wertpapiere',description:'flatex Investment',source:'user'},
  {id:'c',accountId:'n26:current:EUR',day:'2026-10-02',amountCents:-1000,needsReview:true,flow:'transfer',category:'Transfer / Krypto',description:'Kraken',source:'bank-review'}
 ];
 const result=verifiedAccountEdges(entries);
 assert.equal(result.length,2);assert.ok(result.some(e=>e.toLabel==='Kraken'));assert.ok(result.some(e=>e.toLabel==='flatex'));
 assert.ok(!result.some(e=>e.cents===1000));
});

test('manual group review never merges transactions from different banks',async()=>{
 const {financeReviewGroups}=await import('../client/src/finance-core.js');
 const rows=[
  {id:'r',accountId:'raiffeisen:current:EUR',merchant:'Example Merchant',amountCents:-500,flow:'expense',needsReview:true},
  {id:'n',accountId:'n26:current:EUR',merchant:'Example Merchant',amountCents:-500,flow:'expense',needsReview:true},
 ];
 assert.equal(financeReviewGroups(rows).length,2);
});
