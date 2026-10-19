import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {deepSankey,deepSankeyModel} from '../client/src/finance-deep-sankey.js';
import {accountFlowView,verifiedAccountEdges} from '../client/src/finance-account-flows.js';
import {KRAKEN_FORMAT,krakenWealthSummary,updateKrakenQuotes} from '../client/src/finance-kraken.js';
const e=(id,merchant,amount,category)=>({id,day:'2026-10-10',merchant,description:merchant,flow:'expense',amountCents:-amount,category,needsReview:false});
const sample=[e('1','HOFER VIENNA',160382,'Lebensmittel / Supermarkt'),e('2','SPAR GRAZ',105740,'Lebensmittel / Supermarkt'),e('3','BILLA GRAZ',29487,'Lebensmittel / Supermarkt'),e('4','dm drogerie',9200,'Lebensmittel / Drogerie'),e('5','Zouk studio',8000,'Gesundheit & Sport / Tanzen')];
test('four true Sankey stages expose Hofer, Spar and Billa in SVG itself; money remains conserved',()=>{
 const groups=deepSankeyModel(sample),food=groups.find(g=>g.name==='Lebensmittel'),sub=food.children.find(c=>c.name==='Supermarkt');
 assert.deepEqual(sub.merchants.map(x=>x.name),['Hofer','Spar','Billa']);
 assert.equal(sub.merchants.reduce((a,b)=>a+b.cents,0),sub.cents);
 assert.equal(groups.reduce((a,g)=>a+g.cents,0),sample.reduce((a,g)=>a-g.amountCents,0));
 const out=deepSankey(sample);
 for(const value of ['Händler / Zahlungspartner','Hofer','Spar','Billa','Supermarkt','Lebensmittel','Gesundheit &amp; Sport','fin-flow-band','finance-merchant-select'])assert.ok(out.includes(value),value);
 assert.match(out,/data-action="finance-subcategory-select"/);
});
test('special own-account transfer cannot be counted as consumption in four-level chart',()=>{
 const transfer={id:'transfer',amountCents:-19000,flow:'transfer',needsReview:false,category:'Transfer / Eigene Konten'};
 const groups=deepSankeyModel([...sample,transfer]);
 assert.equal(groups.filter(g=>!g.special).reduce((a,g)=>a+g.cents,0),sample.reduce((a,g)=>a-g.amountCents,0));
 assert.match(deepSankey([...sample,transfer]),/Transfers \/ Investieren/);
});
test('account network is a real multi-node flow and does not show unsupported confirmations',()=>{
 const rows=[{id:'a',accountId:'raiffeisen:current:EUR',amountCents:-45000,flow:'transfer',linkedTransferId:'b'},
 {id:'b',accountId:'n26:current:EUR',amountCents:45000,flow:'transfer',linkedTransferId:'a'}];
 assert.equal(verifiedAccountEdges(rows).length,1);
 const view=accountFlowView(rows);assert.match(view,/fin-account-ribbon/);assert.match(view,/Raiffeisen/);assert.match(view,/N26/);
 assert.ok(!view.includes('Ausgabe von 450'));
 assert.equal(verifiedAccountEdges(rows.map(r=>({...r,linkedTransferId:null}))).length,0);
});
test('Kraken public EUR repricing preserves holdings and rejects historic backfill',()=>{
 const old={format:KRAKEN_FORMAT,generatedAt:'2026-10-10T11:00:00Z',balances:{XXBT:'0.5',ZEUR:'10'},ledgers:[],trades:[],quotesEur:{},pricedAt:null,valuationHistory:[]};
 const repriced=updateKrakenQuotes(old,{quotesEur:{XXBT:'60000',ZEUR:'1'},pricedAt:'2026-10-19T01:30:00Z'});
 assert.equal(krakenWealthSummary(repriced).totalEur,30010);
 assert.equal(repriced.generatedAt,old.generatedAt);
 assert.deepEqual(repriced.valuationHistory,[],'old position with new price is not a historic current portfolio point');
 assert.throws(()=>updateKrakenQuotes(old,{quotesEur:{XXBT:'NaN'},pricedAt:'2026-10-19T01:30:00Z'}));
});
test('Kraken quote-only route has no trading or withdrawal endpoints, and UI remains local',()=>{
 const bridge=readFileSync(new URL('../tools/kraken/kraken_bridge.py',import.meta.url),'utf8');
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(bridge,/self\.path == '\/quotes'/);assert.match(main,/data-action="finance-kraken-refresh-quotes"|finance-kraken-refresh-quotes/);
 assert.doesNotMatch(bridge,/AddOrder|Withdraw|CancelOrder/);
});
