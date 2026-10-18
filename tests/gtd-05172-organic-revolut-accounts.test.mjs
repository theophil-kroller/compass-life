import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseRevolutCsv,transferCandidates,accountMatches,BANK_ACCOUNTS} from '../client/src/finance-revolut.js';
import {previewBankFiles} from '../client/src/finance-core.js';
import {hierarchicalSankey,hierarchicalFlows} from '../client/src/finance-exotic-hierarchy.js';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
const header='Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance';
const line=(type,day,description,amount,fee='0.00',state='COMPLETED')=>[type,'Current',day+' 10:30:00',day+' 11:00:00','"'+description.replaceAll('"','""')+'"',amount,fee,'EUR',state,'100.00'].join(',');
const csv=[header,line('Deposit','2026-10-15','Top up bank card', '100.00'),line('Card Payment','2026-10-16','Food, Supplies','-20.00','0.50'),line('Card Payment','2026-10-17','Retracted','-10.00','0.00','REVERTED')].join('\n');
test('0.5.17.2 parses Revolut multi-line quoting, ignores reverted and preserves fees separately',()=>{
 const r=parseRevolutCsv(csv);assert.equal(r.reversed,1);assert.equal(r.fees,1);assert.equal(r.rows.length,3);assert.equal(r.rows.reduce((n,x)=>n+x.amountCents,0),7950);
 assert.ok(r.rows.every(x=>x.accountId==='revolut:current:EUR'));
 assert.equal(r.rows.find(x=>x.revolutType==='Deposit').needsReview,true,'topups must not become salaries');
 assert.equal(r.rows.find(x=>x.id.endsWith('-fee')).amountCents,-50);
 const p=previewBankFiles([{name:'example.csv',text:csv}]);assert.equal(p.rows.length,3);assert.equal(p.reversed,1);assert.equal(p.fees,1);
 assert.equal(previewBankFiles([{name:'example.csv',text:csv}],p.rows).rows.length,0);
});
test('0.5.17.2 own-account proposals never auto-merge and do not match unrelated payments',()=>{
 const rows=[
 {id:'a',accountId:'raiffeisen:current:EUR',day:'2026-10-14',amountCents:-10000,flow:'transfer',description:'Own account'},
 {id:'b',accountId:'n26:current:EUR',day:'2026-10-15',amountCents:10000,flow:'transfer',description:'Transfer from own bank'},
 {id:'c',accountId:'n26:current:EUR',day:'2026-10-15',amountCents:-10000,flow:'transfer',description:'Transfer to Revolut'},
 {id:'d',accountId:'revolut:current:EUR',day:'2026-10-16',amountCents:10000,flow:'income',revolutType:'Deposit',description:'Top up'},
 {id:'e',accountId:'dkb:current:EUR',day:'2026-10-16',amountCents:-10000,flow:'expense',description:'Merchant Shop'}
 ];
 const pairs=transferCandidates(rows);assert.equal(pairs.length,2);assert.deepEqual(pairs.map(x=>[x.aId,x.bId]),[['c','d'],['a','b']]);
 assert.equal(rows[0].flow,'transfer');assert.equal(rows[3].flow,'income','candidate matching must be nonmutating');
 assert.equal(accountMatches(rows[4],'dkb:current:EUR'),true);assert.equal(accountMatches(rows[4],'revolut:current:EUR'),false);
 assert.ok(BANK_ACCOUNTS.some(x=>x.bank==='DKB'));
});
test('0.5.17.2 organic sankey has three columns and actual cubic ribbons for subcategories',()=>{
 const t=(id,cat,cents)=>({id,day:'2026-09-12',amountCents:-cents,flow:'expense',category:cat,needsReview:false});
 const rows=[t('f','Lebensmittel / Supermarkt',10000),t('b','Lebensmittel / Bäckerei',2000),t('s','Gesundheit & Sport / Tanzen',5000)];
 const groups=hierarchicalFlows(rows);assert.equal(groups.length,2);assert.equal(groups.find(x=>x.name==='Lebensmittel').children.length,2);
 const html=hierarchicalSankey(rows);assert.match(html,/fin-organic-sankey/);assert.match(html,/C\d/);assert.match(html,/Hauptkategorien/);assert.match(html,/Unterkategorien/);assert.match(html,/Bäckerei/);assert.match(html,/Tanzen/);
 assert.ok((html.match(/fin-flow-band/g)||[]).length>=5);
});
test('0.5.17.2 account filters and pending importers are honestly labelled, private bank numbers never in source',()=>{
 const html=financeDashboardView({financeTransactions:[]},'Überblick','all',null,0,{account:'dkb:current:EUR',today:'2026-10-19'});
 assert.match(html,/DKB/);assert.match(html,/N26/);assert.match(html,/Revolut/);assert.match(html,/finance-account/);
 assert.match(html,/DKB Giro und Visa bleiben getrennte Konten/);
 const fs=['../client/src/finance-revolut.js','../client/src/finance-dashboard.js','../client/src/main.js'];
 for(const rel of fs){const s=readFileSync(new URL(rel,import.meta.url),'utf8');assert.doesNotMatch(s,/DE\d{20}/,'no full private IBAN should be embedded');}
});

test('0.5.17.2 Raiffeisen reclassification does not override Revolut transfer identity',async()=>{
 const {updateBankSuggestions}=await import('../client/src/finance-auto-rules.js');
 const rv={id:'rv-1',day:'2026-09-01',amountCents:30000,accountId:'revolut:current:EUR',sourceFileType:'revolut-csv',flow:'income',revolutType:'Deposit',category:'Prüfen / Noch ungeklärt',needsReview:true};
 const result=updateBankSuggestions([rv],[],()=>({category:'Einnahmen / Gehalt',flow:'income',needsReview:false}));
 assert.equal(result.changed,0);assert.strictEqual(result.rows[0],rv);
});
