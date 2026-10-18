import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyBankTransaction,categorizeTransaction,updateBankSuggestions,validCategory,safeMerchantRule,parseRaiffeisenCsv,financeViewModel} from '../client/src/finance-core.js';
import {financeSearchTransactions} from '../client/src/finance-analytics.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
const expense=(description,amountCents=-1200,merchant='')=>({id:'unit',day:'2026-10-01',description,amountCents,merchant});
const check=(description,category,flow='expense',amount=-1200)=>{
 const r=classifyBankTransaction(expense(description,amount));
 assert.equal(r.category,category,description);assert.equal(r.flow,flow);assert.equal(r.needsReview,false);assert.ok(validCategory(r.category));return r;
};

test('0.5.14.1 Austrian bank merchant classification: consumption, mobility, culture, dance, body and taxes',()=>{
 check('Payment reference: KAPITALERTRAGSTEUER','Finanzen / Kapitalertragsteuer');
 check('Payment reference: SPAR DANKT 5419 GRAZ','Lebensmittel / Supermarkt');
 check('Payment reference: PANDA ASIA 2370','Lebensmittel / Asia-Supermarkt');
 check('ONLINE BANKING Recipient: Alice Example Payment reference: Biogast Rückzahlung April','Lebensmittel / Bio-Lebensmittel');
 check('Payment reference: MENSA STREMAYERGASSE GRAZ 8010','Essen & Ausgehen / Mensa & Kantine');
 check('Payment reference: BUJINKAN DOJO GRAZ','Gesundheit & Sport / Kampfsport');
 check('Payment reference: TANZSCH. CONNY&DADO GRAZ','Gesundheit & Sport / Tanzen');
 check('Payment reference: STUKITZSAUNA 2322','Gesundheit & Sport / Sauna & Therme');
 check('Payment reference: THERME NOVA','Gesundheit & Sport / Sauna & Therme');
 check('Payment reference: BGYM GRAZ','Gesundheit & Sport / Fitness & Sport');
 check('Payment recipient: MASS RESPONSE SERVICE GMBH','Verträge & Abos / Telekommunikation');
 check('Payment recipient: WIENER LINIEN GMBH & CO KG','Mobilität / Öffentliche Verkehrsmittel');
 check('Payment recipient: PAYWARD IRELAND LTD.','Transfer / Krypto','transfer');
 check('Payment recipient: flatex','Transfer / Depot & Wertpapiere','transfer');
 check('Payment reference: SB-BEHEBUNG 00084823','Bargeld / Bargeldbehebung','cash');
 check('Payment reference: ORF-BEITRAGS SERVICE GMBH','Wohnen / ORF-Beitrag');
 check('Payment reference: 7,5 % p.a.Sollzinsen','Finanzen / Sollzinsen');
});

test('0.5.14.1 unknown cash use and private purpose do not force historical manual work',()=>{
 const privateTransfer=check('ONLINE BANKING Recipient: Alice Example Payment reference: private expense','Transfer / Private Überweisung','transfer');
 assert.equal(privateTransfer.confidence,'broad');
 assert.match(privateTransfer.ruleReason,/Zweck/);
 const amazon=check('Payment recipient: AMAZON PAYMENTS EUROPE S.C.A. Purpose of use: 305-00000000','Shopping / Online-Shopping');
 assert.equal(amazon.confidence,'broad');
 const pay=check('Payment reference: PAYPAL *WEBSHOP','Shopping / Zahlungsdienst (Inhalt unbekannt)');
 assert.match(pay.ruleReason,/unbekannt/);
 assert.equal(safeMerchantRule('PAYPAL Europe S.a.r.l.'),false);
 assert.equal(safeMerchantRule('POS'),false);
 assert.equal(safeMerchantRule('Normaler Händler'),true);
});

test('0.5.14.1 large unknown transactions require review, small unknowns are plainly labeled broad',()=>{
 const small=classifyBankTransaction(expense('Payment reference: UNIDENTIFIED_VENDOR 123'));
 assert.equal(small.category,'Sonstiges / Zahlung ohne klaren Zweck');assert.equal(small.needsReview,false);assert.equal(small.confidence,'broad');
 const large=classifyBankTransaction(expense('Payment reference: UNIDENTIFIED_VENDOR 123',-230000));
 assert.equal(large.category,'Prüfen / Noch ungeklärt');assert.equal(large.needsReview,true);
 const largeIncoming=classifyBankTransaction(expense('Payment reference: unknown payer',230000));
 assert.equal(largeIncoming.needsReview,true);
 check('Payment reference: Familienbeihilfe 2026','Einnahmen / Familienleistungen','income',24000);
});

test('0.5.14.1 reclassification repairs old imports and does not overwrite manual confirmations',()=>{
 const old=[
  {...expense('Payment reference: Kapitalertragsteuer'),id:'tax',merchant:'KAPITALERTRAGSTEUER',category:'Prüfen / Noch ungeklärt',flow:'expense',needsReview:true,source:'review'},
  {...expense('Payment reference: PANDA ASIA'),id:'food',merchant:'PANDA ASIA',category:'Prüfen / Noch ungeklärt',flow:'expense',needsReview:true,source:'review'},
  {...expense('Payment reference: AMZN Mktp DE'),id:'shop',merchant:'AMAZON',category:'Shopping / Online-Shopping',flow:'expense',needsReview:true,source:'rule'},
  {...expense('Payment reference: PANDA ASIA'),id:'manual',merchant:'PANDA ASIA',category:'Freizeit & Reisen / Kultur & Freizeit',flow:'expense',needsReview:false,source:'user',confidence:'confirmed'},
  {...expense('Payment reference: Unknown vendor'),id:'broad',merchant:'unknown',category:'Sonstiges / Zahlung ohne klaren Zweck',flow:'expense',needsReview:false,source:'broad-rule',confidence:'broad'},
 ];
 const result=updateBankSuggestions(old,[],classifyBankTransaction);
 assert.equal(result.closed,3);assert.equal(result.manualKept,1);assert.equal(result.rows[0].category,'Finanzen / Kapitalertragsteuer');
 assert.equal(result.rows[1].category,'Lebensmittel / Asia-Supermarkt');assert.equal(result.rows[2].needsReview,false);
 assert.equal(result.rows[3].category,'Freizeit & Reisen / Kultur & Freizeit');assert.equal(result.rows[3].source,'user');
 assert.equal(result.rows[4].category,'Sonstiges / Zahlung ohne klaren Zweck');
 const twice=updateBankSuggestions(result.rows,[],classifyBankTransaction);assert.equal(twice.changed,0);
 const rule={merchantKey:'UNKNOWN',category:'Gesundheit & Sport / Kampfsport',flow:'expense'};
 const learned=updateBankSuggestions(result.rows,[rule],classifyBankTransaction);
 assert.equal(learned.rows[4].category,'Gesundheit & Sport / Kampfsport');
 assert.equal(learned.rows[3].source,'user');
});

test('0.5.14.1 review lists all booking details and ledger exposes original text',()=>{
 const t={...expense('Payment reference: <script>alert(1)</script>',-120000),id:'unsafe',merchant:'unknown vendor',category:'Prüfen / Noch ungeklärt',flow:'expense',confidence:'low',needsReview:true,source:'review'};
 const r=financeDashboardView({financeTransactions:[t]},'Prüfen');
 assert.match(r,/Alle 1 Buchungsdetails/);assert.match(r,/&lt;script&gt;/);assert.doesNotMatch(r,/<script>/);
 const broad={...t,id:'generic',amountCents:-200,category:'Sonstiges / Zahlung ohne klaren Zweck',needsReview:false,confidence:'broad',source:'broad-rule'};
 const list=financeDashboardView({financeTransactions:[t,broad]},'Buchungen');
 assert.match(list,/Grobe Kategorien/);assert.match(list,/Vollständige Buchungsdetails|Buchungen/);
 assert.equal(financeSearchTransactions([t,broad],{filter:'broad'}).count,1);
 assert.equal(financeViewModel([t,broad]).pending.length,1);
});
