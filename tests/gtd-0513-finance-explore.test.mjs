import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {splitBankCsv,parseRaiffeisenCsv,previewBankFiles,categorizeTransaction,financeViewModel,bankMerchant,validCategory,classifyBankTransaction} from '../client/src/finance-core.js';
import {financeDashboardView,expenseSankey} from '../client/src/finance-dashboard.js';
import {explorePairs,blockBootstrapRegression,explorerChart,exploreView,exploreDays} from '../client/src/insights-explorer.js';
const row=(day,desc,amount,id)=>`${day};"${desc}";${day};${amount};EUR;${id}`;
const csv=[row('02.01.2024','Payment reference: HOFER 2421  K3  02.01 12:54','-23,45','2024-01-02 A'),
 row('03.01.2024','Payment recipient: AMAZON EU Purpose of use: purchase Payment recipient IBAN: AT111234567891234567','-34,90','2024-01-03 B'),
 row('04.01.2024','ONLINE BANKING VOM 04.01 UM 14:00 Recipient: Unbekannt Purpose of use: privat Recipient IBAN: AT111234567891234567','-300,00','2024-01-04 C'),
 row('05.01.2024','Payment reference: Lohnabrechnung','2.300,00','2024-01-05 D'),
 row('06.01.2024','Payment recipient: Wüstenrot Versicherungs-AG Purpose of use: KFZ-Versicherung','-90,00','2024-01-06 E'),
 row('07.01.2024','Payment reference: PAYPAL *XYZ','-43,01','2024-01-07 F')].join('\r\n');

test('Raiffeisen: semicolon quotes, BOM, decimal comma, dates and bad rows',()=>{
 const parsed=parseRaiffeisenCsv('\ufeff'+csv);assert.equal(parsed.rows.length,6);assert.equal(parsed.rows[0].amountCents,-2345);assert.equal(parsed.rows[3].amountCents,230000);
 assert.deepEqual(splitBankCsv('a;"x;y";z\n'),[['a','x;y','z']]);
 assert.deepEqual(splitBankCsv('a;"x""y";z'),[['a','x"y','z']]);
 assert.throws(()=>parseRaiffeisenCsv(row('31.02.2024','foo','-22,00','ref')),/Datum/);
 assert.throws(()=>parseRaiffeisenCsv(row('01.01.2024','foo','-22.00','ref')),/Betrag/);
 assert.throws(()=>parseRaiffeisenCsv('01.01.2024;bad;01.01.2024'),/6 Felder/);
});

test('known merchants auto-assign, marketplace and purpose-unknown are labeled broad',()=>{
 const t=parseRaiffeisenCsv(csv).rows;
 assert.deepEqual([t[0].category,t[0].needsReview],['Lebensmittel / Supermarkt',false]);
 assert.equal(t[1].category,'Shopping / Online-Shopping');assert.equal(t[1].needsReview,false);assert.equal(t[1].confidence,'broad');
 assert.equal(t[2].category,'Sonstiges / Überweisung ohne klaren Zweck');assert.equal(t[2].needsReview,false);assert.equal(t[2].confidence,'broad');
 assert.equal(t[3].category,'Einnahmen / Gehalt');assert.equal(t[3].needsReview,false);
 assert.equal(t[4].category,'Verträge & Abos / Versicherungen');assert.equal(t[4].needsReview,false);
 assert.equal(t[5].needsReview,false);assert.match(t[5].category,/Zahlungsdienst/);
 assert.equal(validCategory('Fantasiekategorie'),false);
});

test('bulk CSV imports are idempotent with overlapping archives and preserve genuine separate entries',()=>{
 const first=previewBankFiles([{name:'2024.csv',text:csv},{name:'overlap.csv',text:csv}]);assert.equal(first.rows.length,6);assert.equal(first.duplicates,6);
 const second=previewBankFiles([{name:'another.csv',text:csv}],first.rows);assert.equal(second.rows.length,0);assert.equal(second.duplicates,6);
 const almost=previewBankFiles([{name:'2.csv',text:csv+'\n'+row('02.01.2024','Payment reference: HOFER 2421  K3  02.01 12:54','-23,45','2024-01-02 15:23 unique')}],first.rows);
 assert.equal(almost.rows.length,1);
});

test('category confirmation and learned merchant rule never overwrite confirmed transactions',()=>{
 const initial=parseRaiffeisenCsv(csv).rows;const pending=initial[1],approved=categorizeTransaction(pending,'Freizeit & Reisen / Kultur & Freizeit','expense');
 assert.equal(approved.needsReview,false);assert.throws(()=>categorizeTransaction(pending,'invented','expense'),/gültige/);
 const classified=classifyBankTransaction(pending,[{merchantKey:pending.merchant.toLocaleUpperCase('de-AT'),category:'Freizeit & Reisen / Kultur & Freizeit',flow:'expense'}]);assert.equal(classified.needsReview,false);
});

test('Sankey and accounting exclude unreviewed, transfers and cash from consumer spending',()=>{
 let rows=parseRaiffeisenCsv(csv).rows;const vm=financeViewModel(rows,'2024-01');
 assert.equal(vm.incomeCents,230000);assert.equal(vm.expenseCents,2345+3490+30000+9000+4301);assert.equal(vm.pending.length,0);
 const html=expenseSankey(vm);assert.match(html,/Sankey|Abflüsse/);assert.match(html,/Sonstiges|Shopping/);
 assert.match(financeDashboardView({financeTransactions:rows},'Prüfen','all'),/Keine zwingende Prüfung mehr offen/);
 const transfer=categorizeTransaction(rows[2],'Transfer / Eigene Konten','transfer');rows=[...rows.slice(0,2),transfer,...rows.slice(3)];
 const v=financeViewModel(rows,'all');assert.equal(v.transferCents,30000);assert.equal(v.expenseCents,2345+3490+9000+4301);
 assert.equal(v.pending.length,0);
});

test('statistic explorer pairs by date/lag, not by array index, preserving gaps',()=>{
 const days=[{day:'2026-10-11',sleepMinutes:450,workMinutes:30},{day:'2026-10-12',sleepMinutes:480,workMinutes:50},{day:'2026-10-14',sleepMinutes:500,workMinutes:60}];
 assert.equal(explorePairs(days,'sleepMinutes','workMinutes',1).length,1);
 assert.equal(explorePairs(days,'sleepMinutes','workMinutes',0).length,3);
 assert.match(exploreView(days,'sleepMinutes','workMinutes',0),/3 Paare/);
 assert.equal(exploreDays({}).length,0);
});

test('block bootstrap 95% CI requires enough paired observations and nondegenerate spread',()=>{
 const make=n=>Array.from({length:n},(_,i)=>({day:new Date(Date.UTC(2026,0,1+i)).toISOString().slice(0,10),x:i+1,y:1.5*(i+1)+Math.sin(i)*4}));
 const small=blockBootstrapRegression(make(9));assert.equal(small.curve.length,0);assert.ok(small.fit);
 const big=blockBootstrapRegression(make(52));assert.equal(big.curve.length,26);assert.ok(big.curve.every(p=>p.lo<=p.estimate+100&&p.lo<=p.hi));
 assert.match(explorerChart(make(52),big),/Konfidenzband/);
 const noVariance = make(30).map(r => ({...r, x:1}));
 const flat = blockBootstrapRegression(noVariance);assert.equal(flat.fit,null);
});

test('0.5.13 keeps bank data local, activates Explorer and avoids worker writes',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.32'/);
 assert.match(main,/previewBankFiles/);assert.match(main,/financeTransactions/);assert.match(main,/exploreView\(exploreDays/);
 assert.doesNotMatch(main,/\/api\/finance/);
});

test('review groups prioritize recurring uncertain merchants but need explicit batch opt-in',async()=>{
 const {financeReviewGroups}=await import('../client/src/finance-core.js');
 const text=[row('03.01.2024','ONLINE BANKING Recipient: Unknown Institution GmbH Payment reference: wire','-1.200,00','a'),row('06.01.2024','ONLINE BANKING Recipient: Unknown Institution GmbH Payment reference: wire','-1.400,00','b'),row('07.01.2024','Payment reference: HOFER SHOP','-7,00','c')].join('\n');
 const ts=parseRaiffeisenCsv(text).rows;const g=financeReviewGroups(ts);
 assert.equal(g.length,1);assert.equal(g[0].entries.length,2);
 const html=financeDashboardView({financeTransactions:ts},'Prüfen','all');
 assert.match(html,/Alle 2 offenen Buchungen|Alle 2 Buchungsdetails/);assert.match(html,/name="applyAll"/);
 assert.doesNotMatch(html,/checked[^>]*name="applyAll"/);
});
