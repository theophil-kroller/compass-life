import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePrivateFinancePack,matchPrivateFinanceRule,extractRecipient,extractPurpose} from '../client/src/finance-private-rules.js';
import {validCategory,classifyBankTransaction,previewBankFiles} from '../client/src/finance-core.js';
import {placesInsightsView,manualPlaceVisit,placeClusters} from '../client/src/insights-places.js';
const specimen={format:'compass-private-finance-rules',version:1,rules:[
 {recipientContains:'Alice Example',purposeIncludesAny:['Train journey','summer holiday'],category:'Familie / Kinderreisen',flow:'expense'},
 {recipientContains:'Alice Example',category:'Familie / Kinder & Unterhalt',flow:'expense'},
 {recipientContains:'Broker Service Ireland',category:'Transfer / Krypto',flow:'transfer'},
 {recipientContains:'Bob Tutor',purposeIncludesAny:['Tutoring','course'],category:'Familie / Schul- & Kurskosten',flow:'expense'}
]};
const rules=validatePrivateFinancePack(specimen,validCategory);
function tx(recipient,purpose,amount=-30000){return {amountCents:amount,description:`ONLINE BANKING Recipient: ${recipient} Payment reference: ${purpose} Recipient IBAN: AT12345`,merchant:recipient};}
test('0.5.14.2 private rule pack matches payment receiver and purpose, prioritizes specific travel',()=>{
 assert.equal(classifyBankTransaction(tx('Alice Example','Train journey China'),[],rules).category,'Familie / Kinderreisen');
 assert.equal(classifyBankTransaction(tx('Alice Example','Monthly support'),[],rules).category,'Familie / Kinder & Unterhalt');
 assert.equal(classifyBankTransaction(tx('Bob Tutor','Tutoring lesson'),[],rules).category,'Familie / Schul- & Kurskosten');
 assert.equal(classifyBankTransaction(tx('Broker Service Ireland','Savings'),[],rules).flow,'transfer');
 assert.notEqual(classifyBankTransaction(tx('Another Ireland Entity','Savings'),[],rules).category,'Transfer / Krypto');
 assert.equal(extractRecipient(tx('Alice Example','support').description),'ALICE EXAMPLE');
 assert.equal(extractPurpose(tx('Alice Example','Train journey').description),'TRAIN JOURNEY');
});
test('0.5.14.2 private rules file is strict, does not allow arbitrary JS or invalid money flow',()=>{
 assert.throws(()=>validatePrivateFinancePack({...specimen,version:2},validCategory));
 assert.throws(()=>validatePrivateFinancePack({...specimen,rules:[{recipientContains:'xx',category:'Familie / Kinderreisen',flow:'expense'}]},validCategory));
 assert.throws(()=>validatePrivateFinancePack({...specimen,rules:[{recipientContains:'Alice Example',category:'Transfer / Krypto',flow:'expense'}]},validCategory));
 assert.throws(()=>validatePrivateFinancePack({...specimen,rules:[{recipientContains:'Alice Example',category:'Unbekannt / Unbekannt',flow:'expense'}]},validCategory));
});
test('0.5.14.2 user financial names are not present in public source, file import is wired',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8'),core=readFileSync(new URL('../client/src/finance-core.js',import.meta.url),'utf8');
 // Public repository must not contain a serialized recipient-rule list.
 assert.ok(!main.includes('recipientContains:')&&!core.includes('recipientContains:'));
 assert.match(main,/finance-private-rules-file/);assert.match(main,/financePrivateRules/);assert.match(main,/open-worldmap/);
 assert.match(main,/insightPeriod='all'/);
 const view=readFileSync(new URL('../client/src/finance-dashboard.js',import.meta.url),'utf8');assert.match(view,/Private JSON-Regeln einlesen/);
});
test('0.5.14.2 worldmap remains visible with empty data and existing older visits work with all-time period',()=>{
 const empty=placesInsightsView();assert.match(empty,/Deine Weltkarte ist bereit/);assert.match(empty,/places-world-svg/);assert.match(empty,/Timeline-JSON oder ZIP auswählen/);
 const older=manualPlaceVisit({name:'Example destination',lat:35.68,lon:139.69,start:'2024-07-04T06:00:00Z',end:'2024-07-05T06:00:00Z'});
 assert.equal(placeClusters([older],{}, {start:null,end:'2026-10-18'}).length,1);
 const map=placesInsightsView({visits:[older],range:{start:null,end:'2026-10-18'}});
 assert.match(map,/Example destination/);assert.match(map,/places-world-svg/);
});
