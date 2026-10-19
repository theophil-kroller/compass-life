import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sma,ema,bollinger,rsi,macd,supportResistance,technicalSettings,renderTechnicalChart,wireTechnicalCrosshair} from '../client/src/kraken-technical-v40.js';
import {krakenPriceChartHtml} from '../client/src/kraken-history-v39.js';
const bars=(n=260)=>Array.from({length:n},(_,i)=>({time:Date.UTC(2026,0,1+i),open:100+i,high:103+i,low:98+i,close:101+i,volume:10+i}));
test('SMA uses a full window, and EMA starts with its arithmetic seed',()=>{
 assert.deepEqual(sma([1,2,3,4,5],3),[null,null,2,3,4]);
 assert.deepEqual(ema([1,2,3,4,5],3),[null,null,2,3,4]);
 assert.throws(()=>sma([1],1));
});
test('Bollinger ±2 population deviations; flat input gives a flat envelope',()=>{
 const b=bollinger([5,5,5,5,5,5],3);
 assert.deepEqual(b.middle,[null,null,5,5,5,5]);assert.equal(b.upper.at(-1),5);assert.equal(b.lower.at(-1),5);
 const variable=bollinger([1,2,3,4],3);assert.ok(variable.upper[2]>2);assert.ok(variable.lower[2]<2);
});
test('RSI Wilder is bounded, 100 for strictly rising, 0 falling, 50 flat',()=>{
 assert.equal(rsi(Array.from({length:25},(_,i)=>i+1)).at(-1),100);
 assert.equal(rsi(Array.from({length:25},(_,i)=>25-i)).at(-1),0);
 assert.equal(rsi(Array(25).fill(100)).at(-1),50);
 assert.equal(rsi(Array(14).fill(100)).every(x=>x===null),true);
});
test('MACD waits until 26 closes, signal until 34, and flat input settles at zero',()=>{
 const m=macd(Array(50).fill(200));assert.equal(m.line[24],null);assert.equal(m.line[25],0);assert.equal(m.signal[32],null);assert.equal(m.signal[33],0);assert.equal(m.histogram.at(-1),0);
});
test('Support/resistance uses past pivot levels, never imaginary projections',()=>{
 const t=bars(20);const v=supportResistance(t);assert.ok(v);assert.equal(v.support,null);assert.equal(v.resistance,null);
});
test('chart has candlesticks, wick, volume, moving averages and accessible indicator toggles',()=>{
 const html=renderTechnicalChart(bars(240),{ma20:true,ma50:true,ma200:true,volume:true,rsi:true,macd:true,bb:true,sr:true});
 assert.match(html,/fin40-chart-svg/);assert.match(html,/fin40-pointer-area/);assert.match(html,/finance-kraken-chart-toggle/);
 for(const s of ['MA 20','MA 50','MA 200','Bollinger','Support / Resistance','Volumen','RSI','MACD','Candlesticks'])assert.ok(html.includes(s),s);
 assert.match(html,/RSI 14/);assert.match(html,/MACD/);assert.match(html,/aria-pressed="true"/);
 assert.match(html,/fin40-crosshair/);assert.match(html,/60 Kerzen/);
});
test('line and last 60 candles work; user-controlled settings validated',()=>{
 const cfg=technicalSettings({mode:'line',zoom:'60',rsi:true,evil:true});assert.equal(cfg.mode,'line');assert.equal(cfg.zoom,'60');assert.equal(cfg.evil,undefined);
 const html=renderTechnicalChart(bars(250),cfg);
 assert.match(html,/60 von 250 Kerzen sichtbar/);assert.match(html,/Linie/);
 assert.match(html,/Fadenkreuz/);
});
test('not enough historical data yields no invented 200 day average',()=>{
 const html=renderTechnicalChart(bars(70),{ma200:true});assert.match(html,/MA200 benötigt mindestens 200 Kerzen/);
 assert.equal(sma([1,2,3],200).every(x=>x===null),true);
});
test('history card now renders advanced technical chart using public OHLC, not wallet values',()=>{
 const candles=bars(80),data={candles,source:'Kraken Spot / EUR'};
 const html=krakenPriceChartHtml('XXBT','1m',data,false,'',[{asset:'XXBT',amount:0.45}],{rsi:true});
 assert.match(html,/0,45 Einheiten/);assert.match(html,/fin40-chart-svg/);assert.match(html,/Kursverlauf ≠ historische Entwicklung/);
 assert.doesNotMatch(html,/"balances"/);
});
test('wire binding is safe on empty DOM; main wires toggle and chart interactions',()=>{
 assert.doesNotThrow(()=>wireTechnicalCrosshair(null,[],{}));
 const js=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(js,/finance-kraken-chart-toggle/);assert.match(js,/wireTechnicalCrosshair/);assert.match(js,/krakenChartSettings/);
});
