import test from 'node:test';
import assert from 'node:assert/strict';
import {bitcoinLongParams,parseCoinbaseBars,aggregateWeekly,publicBitcoinLongHistory} from '../worker/src/market-bitcoin-long-v40.js';
import {krakenHistoryRequest,fetchKrakenHistory,krakenPriceChartHtml} from '../client/src/kraken-history-v39.js';
const DAY=86400_000;
const NOW=Date.UTC(2026,9,19,12);
const rows=()=>Array.from({length:10},(_,i)=>[Math.floor((NOW-i*DAY)/1000),90+i,115+i,98+i,105+i,1+i]);
test('long-term Bitcoin views are BTC/EUR only with explicit period bounds',()=>{
 const five=bitcoinLongParams('https://app.test/api/market/bitcoin/history?symbol=BTC&period=5y',NOW);
 assert.equal(five.weekly,true);assert.ok(five.end-five.start>1800*DAY);
 const three=bitcoinLongParams('https://app.test/api/market/bitcoin/history?symbol=BTC&period=3y',NOW);assert.equal(three.weekly,false);
 const all=bitcoinLongParams('https://app.test/api/market/bitcoin/history?symbol=BTC&period=max',NOW);assert.equal(new Date(all.start).getUTCFullYear(),2015);
 assert.throws(()=>bitcoinLongParams('https://app.test/api/market/bitcoin/history?symbol=ETH&period=10y',NOW));
 assert.throws(()=>bitcoinLongParams('https://app.test/api/market/bitcoin/history?symbol=BTC&period=100y',NOW));
 assert.equal(krakenHistoryRequest('XXBT','max').provider,'coinbase');
 assert.throws(()=>krakenHistoryRequest('ETH','max'),/nur für BTC/);
});
test('Coinbase candles use their actual non-Kraken OHLCV column order',()=>{
 const b=parseCoinbaseBars([[2000000000,90,110,100,105,12],['invalid',0,0,0,0,0]]);
 assert.deepEqual(b,[{time:2000000000,low:90,high:110,open:100,close:105,volume:12}]);
});
test('weekly aggregation uses Mon-Sun high low first open last close and summed volume',()=>{
 const a=aggregateWeekly([
  {time:Date.UTC(2026,0,5)/1000,open:101,high:109,low:99,close:103,volume:2},
  {time:Date.UTC(2026,0,6)/1000,open:103,high:111,low:100,close:108,volume:3},
  {time:Date.UTC(2026,0,12)/1000,open:108,high:115,low:106,close:114,volume:5}
 ]);
 assert.equal(a.length,2);assert.deepEqual([a[0].open,a[0].high,a[0].low,a[0].close,a[0].volume],[101,111,99,108,5]);
});
test('worker fetches only public Coinbase BTC/EUR candle windows, no account data',async()=>{
 const urls=[];
 const fetchFn=async input=>{urls.push(input);return {ok:true,json:async()=>rows()};};
 const req=new Request('https://worker.test/api/market/bitcoin/history?symbol=BTC&period=3y');
 const r=await publicBitcoinLongHistory(req,{fetchFn,now:NOW});
 assert.equal(r.status,200);
 const data=await r.json();assert.equal(data.source,'Coinbase Exchange BTC/EUR');assert.equal(data.timeframe,'day');
 assert.ok(urls.length>1);assert.ok(urls.every(x=>x.startsWith('https://api.exchange.coinbase.com/products/BTC-EUR/candles?')));
 assert.ok(urls.every(x=>!x.includes('balance')&&!x.includes('key')));
 const invalid=await publicBitcoinLongHistory(new Request('https://worker.test/api/market/bitcoin/history?symbol=SECRET&period=10y'),{fetchFn:()=>{throw Error('must not fetch');}});
 assert.equal(invalid.status,400);
});
test('client long views call dedicated endpoint and communicate alternative price source',async()=>{
 const accessed=[], now=Date.now();
 const fetchFn=async url=>{accessed.push(url);return {ok:true,json:async()=>({source:'Coinbase Exchange BTC/EUR',timeframe:'week',candles:[{time:Math.floor((now-DAY*14)/1000),open:95,high:108,low:94,close:102,volume:1},{time:Math.floor((now-DAY*7)/1000),open:103,high:115,low:98,close:112,volume:2}]})};};
 const d=await fetchKrakenHistory('https://worker.test','XXBT','5y',{fetchFn});
 assert.match(accessed[0],/market\/bitcoin\/history\?symbol=BTC&period=5y/);
 const html=krakenPriceChartHtml('XXBT','5y',d,false,'',[{asset:'XXBT',amount:0.10}]);
 assert.match(html,/MAX/);assert.match(html,/Coinbase Exchange BTC\/EUR/);assert.match(html,/Wochenkerzen/);
 const eth=krakenPriceChartHtml('ETH','1m',null);assert.doesNotMatch(eth,/>MAX</);
});
