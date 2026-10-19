import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {krakenHistoryRequest,krakenHistorySeries,fetchKrakenHistory,krakenPriceChartHtml} from '../client/src/kraken-history-v39.js';
import {krakenPublicParams,publicKrakenHistory} from '../worker/src/market-kraken-v39.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
const asset='XXBT';
const bar=(daysAgo,close)=>{const time=Math.floor((Date.now()-daysAgo*86400000)/1000);return {time,open:close,high:close+5,low:close-5,close,volume:1};};
test('market history maps legacy Kraken XBT to BTC and enforces period bounds',()=>{
 assert.deepEqual(krakenHistoryRequest('XXBT','1m'),{symbol:'BTC',interval:240,days:30,period:'1m'});
 assert.equal(krakenHistoryRequest('ETH','1y').interval,1440);
 assert.equal(krakenHistoryRequest('BTC','2y').interval,1440);
 assert.throws(()=>krakenHistoryRequest('EUR','1m'),/unterstütztes/);
 assert.throws(()=>krakenHistoryRequest('INVALID-HOLDING','1m'),/unterstütztes/);
 assert.throws(()=>krakenHistoryRequest('BTC','10y'),/Ungültiger/);
});
test('public Worker market route uses restricted Kraken origin and cannot proxy arbitrary URLs or secrets',async()=>{
 assert.deepEqual(krakenPublicParams('https://api.example/api/market/kraken/ohlc?symbol=BTC&interval=1440'),{symbol:'BTC',interval:'1440',pair:'XBTEUR'});
 assert.throws(()=>krakenPublicParams('https://api.example/api/market/kraken/ohlc?symbol=evil.com%2fetc&interval=1440'));
 let url='';const row=[Math.floor(Date.now()/1000),100,110,90,108,100,3,4];
 const output=await publicKrakenHistory(new Request('https://compass.example/api/market/kraken/ohlc?symbol=BTC&interval=1440'),{fetchFn:async x=>{url=x;return {ok:true,json:async()=>({error:[],result:{XXBTZEUR:[row],last:123}})}}});
 assert.equal(output.status,200);assert.equal((await output.json()).candles[0].close,108);assert.match(url,/^https:\/\/api\.kraken\.com\/0\/public\/OHLC\?pair=XBTEUR/);
 const bad=await publicKrakenHistory(new Request('https://compass.example/api/market/kraken/ohlc?symbol=secret&interval=1'),{fetchFn:()=>{throw Error('Must never fetch');}});assert.equal(bad.status,400);
});
test('historical quotes request passes symbol and period only, not personal wallet holdings',async()=>{
 const url=[];const fake=async(input)=>{url.push(input);return {ok:true,json:async()=>({asOf:new Date().toISOString(),candles:[bar(3,100),bar(2,104),bar(1,110)]})}};
 const data=await fetchKrakenHistory('https://compass.test','XXBT','1m',{fetchFn:fake});
 assert.equal(data.candles.length,3);assert.match(url[0],/symbol=BTC/);assert.doesNotMatch(url[0],/XXBT|balance|amount|token|apikey/);
 const html=krakenPriceChartHtml('XXBT','1m',data,false,'',[{asset:'XXBT',amount:0.42}]);
 assert.match(html,/KRAKEN \/ EUR-KURSHISTORIE/);assert.match(html,/data-action="finance-kraken-chart-period"/);assert.match(html,/Kursverlauf ≠ historische Entwicklung/);assert.match(html,/0,42 Einheiten/);
});
test('history series rejects malformed and empty data rather than inventing chart values',()=>{
 assert.throws(()=>krakenHistorySeries({candles:[]}),/wenige/);
 const points=krakenHistorySeries({candles:[bar(5,110),bar(1,120),bar(5,110)]});assert.equal(points.length,2);
});
test('finance overview remembers expanded Sankey and keeps merchant editor available',()=>{
 const tx={id:'a',day:'2026-10-01',amountCents:-1000,flow:'expense',merchant:'Cafe',category:'Lebensmittel / Restaurant',needsReview:false};
 const base={financeTransactions:[tx]};
 const html=financeDashboardView(base,'Überblick','last12',null,0,{sankeyExpanded:true,merchantSelected:'Cafe'});
 assert.match(html,/id="finance-overview-sankey" class="fin31-advanced-flow" open/);
 assert.match(html,/Händler bearbeiten|Buchungen bearbeiten/);
 assert.match(readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8'),/overviewSankey\.addEventListener\('toggle'/);
});
test('navigation offers Geldkreislauf and Kontenflüsse in Cashflow without menu duplicates',()=>{
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(source,/!\['Geldkreislauf','Kontenflüsse'\]\.includes\(p.title\)/);
 const h=financeDashboardView({financeTransactions:[]},'Cashflow','all');
 assert.match(h,/fin39-cashflow-shortcuts/);assert.match(h,/data-id="Geldkreislauf"/);assert.match(h,/data-id="Kontenflüsse"/);
});
