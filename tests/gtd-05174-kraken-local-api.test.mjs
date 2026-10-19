import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateKrakenSnapshot,mergeKrakenSnapshot,krakenPortfolioView,KRAKEN_FORMAT} from '../client/src/finance-kraken.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
const fixture={
 format:KRAKEN_FORMAT,generatedAt:'2026-10-19T10:00:00Z',
 balances:{XXBT:'0.01000000',ZEUR:'123.45',XETH:'0.12345'},
 ledgers:[{id:'L123456-TEST01-123456',time:1792404000.5,asset:'ZEUR',amount:'150.00',fee:'0.00',balance:'123.45',type:'deposit',subtype:'',refid:'A123'}],
 trades:[{id:'T123456-TEST01-123456',time:1792404100.5,pair:'XETHZEUR',type:'buy',price:'1.25',volume:'0.01000000',cost:'0.0125',fee:'0.0001'}],partial:false
};
test('Kraken Spot snapshot validates asset quantities and never classifies holdings as EUR cashflow',()=>{
 const result=validateKrakenSnapshot(fixture);
 assert.equal(result.balances.XXBT,'0.01000000');
 assert.equal(result.ledgers[0].type,'deposit');
 const html=krakenPortfolioView(result);
 assert.match(html,/XXBT/);assert.match(html,/0\.01000000/);
 assert.match(html,/Spot/);assert.match(html,/nicht automatisch/);
 assert.doesNotMatch(html,/€\s*0[,.]01/);
});
test('Kraken reimport merges by stable ledger/trade IDs without duplicate records and refreshes balances',()=>{
 const first=mergeKrakenSnapshot(null,fixture);
 const second=mergeKrakenSnapshot(first,{...fixture,generatedAt:'2026-10-19T11:00:00Z',balances:{...fixture.balances,XXBT:'0.022'}});
 assert.equal(second.trades.length,1);assert.equal(second.ledgers.length,1);
 assert.equal(second.balances.XXBT,'0.022');assert.equal(second.generatedAt,'2026-10-19T11:00:00Z');
});
test('Kraken snapshot rejects keys, malformed and unexpectedly large entries, and never injects source text',()=>{
 assert.throws(()=>validateKrakenSnapshot({...fixture,secret:'API_SECRET'}),/Zugangsdaten/);
 assert.throws(()=>validateKrakenSnapshot({...fixture,balances:{BTC:'NaN'}}),/Währungscode oder Betrag/);
 assert.throws(()=>validateKrakenSnapshot({...fixture,format:'unknown'}),/Keine Compass-Kraken/);
 assert.throws(()=>validateKrakenSnapshot({...fixture,ledgers:Array.from({length:10001},()=>fixture.ledgers[0])}),/zu viele Buchungen/);
 const sample=validateKrakenSnapshot({...fixture,ledgers:[{...fixture.ledgers[0],type:'<img src=x onerror=alert(1)>'}]});
 const html=krakenPortfolioView(sample);
 assert.doesNotMatch(html,/<img/);assert.match(html,/&lt;img/);
});
test('Kraken portfolio UI is reachable from Finance and the weekly review, with explicit preview/confirmation and no frontend secret field',()=>{
 const html=financeDashboardView({financeTransactions:[]},'Portfolio','all',null,0,{krakenPreview:validateKrakenSnapshot(fixture)});
 assert.match(html,/finance-kraken-file/);
 assert.match(html,/finance-kraken-confirm/);
 assert.match(html,/START_WINDOWS\.bat/);
 assert.doesNotMatch(html,/name="apiSecret"/);
 const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(source,/finance-kraken-confirm/);
 assert.match(source,/mergeKrakenSnapshot/);
 assert.match(source,/id==='kraken'/);
 assert.match(source,/COMPASS_CLIENT_VERSION='0\.5\.25'/);
});
test('Local helper only allows read-only Kraken API paths, writes exports to private downloads and avoids Worker',()=>{
 const src=readFileSync(new URL('../tools/kraken/kraken_sync.py',import.meta.url),'utf8');
 assert.match(src,/ENDPOINTS = \{'Balance', 'Ledgers', 'TradesHistory'\}/);
 assert.match(src,/os\.open\(str\(target\).*0o600\)/);
 assert.match(src,/getpass\.getpass/);
 assert.doesNotMatch(src,/0\/private\/(?:AddOrder|Withdraw|AddExport)/);
 assert.doesNotMatch(src,/https:\/\/(?:[^'\"\s]*\.)?(?:workers\.dev|github\.com)/i);
});
