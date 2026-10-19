import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseFlatexCsv,flatexKind,isFlatexCsv} from '../client/src/finance-flatex-v36.js';
import {previewBankFiles,financeViewModel} from '../client/src/finance-core.js';
import {detectFinanceFormat} from '../client/src/finance-account-import.js';
import {fetchTwelveDataQuote,parseMarketQuote,flatexPortfolioCashSummary,flatexPortfolioSection} from '../client/src/finance-market-v36.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
const header='Buchungstag;Valuta;Empfänger;Zahlungspfl.;TA.Nr.;Buchungsinformationen;Betrag;';
const row=(nr,detail,cents,date='19.10.2026')=>`${date};${date};;;${nr};${detail};${cents};EUR`;
const sample=[header,row('1234567','Ausführung ORDER Kauf IE00TEST1234 123','-100,50'),row('1234568','Kauf IE00TEST1234 123','100,50'),row('1234569','Erträgnisausschüttung IE00TEST1234','12,03'),row('1234570','Thesaurierung transparenterFonds IE00TEST1234','-2,12'),row('1234571','Code: SCOR - CreditorReference: Savings','1.000,00'),row('1234572','Zinsabschluss 01.01.2026 -31.03.2026','0,00')].join('\r\n');
test('0.5.36 detects flatex only by its actual 8-column statement header',()=>{
 assert.equal(isFlatexCsv(sample),true);assert.equal(detectFinanceFormat(sample,'other.csv'),'flatex');
 assert.equal(detectFinanceFormat('Buchungstag;Valuta;Betrag\n2026-01-01;hi;100','Kontoumsätze.csv'),'unknown');
 assert.throws(()=>parseFlatexCsv(sample.replace('TA.Nr.','Reference')),/Kopfzeile/);
});
test('0.5.36 flatex cash ledger semantics: buys/sells not income or consumer spending',()=>{
 const {rows,zero,unresolved,types}=parseFlatexCsv(sample);
 assert.equal(rows.length,5);assert.equal(zero,1);assert.equal(unresolved,1);
 assert.equal(types['trade-buy'],1);assert.equal(types['trade-settlement'],1);
 assert.equal(rows[0].flow,'transfer');assert.equal(rows[1].flow,'transfer');
 assert.equal(rows[2].flow,'income');assert.equal(rows[2].category,'Einnahmen / Kapitalerträge');
 assert.equal(rows[3].category,'Finanzen / Kapitalertragsteuer');
 assert.equal(rows[4].flow,'transfer');assert.equal(rows[4].needsReview,true);
 assert.equal(financeViewModel(rows).incomeCents,1203);
 assert.equal(rows.every(t=>t.accountId==='flatex:cash:EUR'),true);
 assert.equal(parseFlatexCsv(sample).rows[0].id,rows[0].id);
 assert.equal(flatexPortfolioCashSummary(rows).rows,5);
});
test('0.5.36 flatex imports dedupe repeated exports and validate precision and currency',()=>{
 const data=previewBankFiles([{name:'statements.csv',text:sample},{name:'again.csv',text:sample}],[]);
 assert.equal(data.rows.length,5);assert.equal(data.duplicates,5);
 const again=previewBankFiles([{name:'once.csv',text:sample}],data.rows);assert.equal(again.rows.length,0);
 assert.throws(()=>parseFlatexCsv(sample.replace('1.000,00','1.000,000')),/Buchung/);
 assert.throws(()=>parseFlatexCsv(sample.replace('12,03;EUR','12,03;USD')),/Buchung/);
});
test('0.5.36 extended flatex classifications remain conservative',()=>{
 assert.equal(flatexKind('Ausführung ORDER Verkauf DE0001234567 987'),'trade-sell');
 assert.equal(flatexKind('Kauf IE00TEST1234 87654321'),'trade-settlement');
 assert.equal(flatexKind('My unknown memo'),'unknown');
 const broken=[header,row('1234567','Unbekannt','55,00')].join('\n');
 assert.equal(parseFlatexCsv(broken).rows[0].needsReview,true);
});
test('0.5.36 quotes are opt-in, source-bound and never mix currencies',async()=>{
 const seen=[];
 const q=await fetchTwelveDataQuote('AAPL','my_private_key_123',{fetchFn:async(url,opts)=>{seen.push([url,opts]);return {ok:true,json:async()=>({symbol:'AAPL',close:'223.17',currency:'USD',datetime:'2026-10-16',name:'Synthetic stock'})};}});
 assert.equal(q.price,223.17);assert.equal(q.currency,'USD');assert.equal(q.asOf,'2026-10-16');
 assert.equal(seen[0][0].includes('my_private_key'),false);assert.equal(seen[0][1].headers.Authorization,'apikey my_private_key_123');assert.equal(seen[0][1].credentials,'omit');
 assert.throws(()=>parseMarketQuote({symbol:'WRONG',close:10,currency:'EUR'},'AAPL'),/anderes Wertpapier/);
 assert.throws(()=>parseMarketQuote({symbol:'AAPL',close:10},'AAPL'),/Währung/);
 assert.match(flatexPortfolioSection([],null),/nicht automatisch|keine verlässlichen aktuellen Stückzahlen/);
});
test('0.5.36 finance nav is in left sidebar and top finance tabs hidden on desktop',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
 assert.match(main,/data-action="calm-finance-view"/);assert.match(main,/calmNavGroup==='finance'/);
 assert.match(main,/action==='calm-finance-view'/);assert.match(css,/@media\(min-width:701px\)/);
 const html=financeDashboardView({financeTransactions:[]},'Portfolio','all',null,0,{portfolioTab:'settings'});
 assert.match(html,/flatex Buchungen und Kurse/);assert.match(html,/finance-quote-form/);
 assert.match(html,/fin30-period-select/);
});
