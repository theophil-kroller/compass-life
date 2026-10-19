import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {merchantDisplay,merchantRows,financeMerchantEdit,financeMerchantInspector} from '../client/src/finance-merchant-editor.js';
import {deepSankey,deepSankeyModel} from '../client/src/finance-deep-sankey.js';
import {merchantExpenseGroups} from '../client/src/finance-merchant-insights.js';
import {financeExpenseOverview,financeSearchTransactions} from '../client/src/finance-analytics.js';
const expense=(id,merchant,cents,category='Shopping / Online-Shopping')=>({id,merchant,description:`Banktext ${merchant}`,amountCents:-cents,day:'2026-10-19',needsReview:false,flow:'expense',category,source:'bank'});
const sample=()=>[
  expense('1','AMAZON PAYMENTS EUROPE',34700),
  expense('2','KLARNA / AMAZON PURCHASE',26000),
  expense('3','JETSTAR000000',41700,'Freizeit & Reisen / Flüge'),
  expense('4','AMAZON MARKETPLACE',8300,'Lebensmittel / Supermarkt')
];
test('canonical merchant alias merges two original payment descriptors without rewriting bank records',()=>{
 const base=sample(),out=financeMerchantEdit(base,['1','2'],{displayName:'Amazon'});
 assert.equal(out.changed,2);assert.equal(out.rows[0].merchant,'AMAZON PAYMENTS EUROPE');assert.equal(out.rows[1].description,'Banktext KLARNA / AMAZON PURCHASE');
 assert.equal(merchantDisplay(out.rows[0]),'Amazon');assert.equal(merchantRows(out.rows,'amazon').length,2);assert.equal(base[0].merchantDisplayName,undefined);
 const model=deepSankeyModel(out.rows);
 assert.equal(model.find(g=>g.name==='Shopping').children[0].merchants.find(m=>m.name==='Amazon').cents,60700);
 const html=deepSankey(out.rows);
 assert.equal((html.match(/>Amazon · /g)||[]).length,1,'Exactly one visible leaf label for merged merchant');
 assert.ok(html.includes('607'));
});
test('the same merchant across subcategories merges into one Sankey leaf but retains two economic flows',()=>{
 const original=sample(),{rows}=financeMerchantEdit(original,['1','2','4'],{displayName:'Amazon'});
 const html=deepSankey(rows);
 assert.equal((html.match(/>Amazon · /g)||[]).length,1);
 assert.equal((html.match(/<path class="fin-flow-band"[^>]+data-id="Amazon"/g)||[]).length,2);
 assert.equal(financeExpenseOverview(rows).merchants.find(g=>g.name==='Amazon').cents,69000);
 assert.equal(rows.reduce((n,t)=>n-t.amountCents,0),110700);
});
test('category reassignment adjusts groups and original descriptor is preserved',()=>{
 const rows=financeMerchantEdit(sample(),['3'],{displayName:'Jetstar',category:'Freizeit & Reisen / Flüge'}).rows;
 assert.equal(rows[2].merchantDisplayName,'Jetstar');assert.equal(rows[2].category,'Freizeit & Reisen / Flüge');assert.match(rows[2].description,/JETSTAR000000/);
 const fixed=financeMerchantEdit(rows,['1'],{displayName:'Hausverwaltung',category:'Wohnen / Miete & Betriebskosten'}).rows;
 assert.equal(deepSankeyModel(fixed).find(g=>g.name==='Wohnen').cents,34700);
});
test('clear alias restores original bank display without touching the underlying transaction',()=>{
 const rows=financeMerchantEdit(sample(),['3'],{displayName:'Jetstar'}).rows;
 const undone=financeMerchantEdit(rows,['3'],{clearAlias:true}).rows;
 assert.equal(undone[2].merchantDisplayName,undefined);assert.equal(undone[2].merchant,'JETSTAR000000');
});
test('unsafe grouping is not automatic; bad categories, unknown ids and invalid names fail closed',()=>{
 const a=sample();assert.notEqual(merchantDisplay(a[0]),merchantDisplay(a[1]));
 assert.throws(()=>financeMerchantEdit(a,['2'],{displayName:'Amazon',category:'Transfer / Eigene Konten'}),/Ausgabenkategorien/);
 assert.throws(()=>financeMerchantEdit(a,['nonexistent'],{displayName:'Amazon'}),/nicht|geändert/);
 assert.throws(()=>financeMerchantEdit(a,['1'],{displayName:''}),/Händlername/);
 assert.throws(()=>financeMerchantEdit(a,['1','1'],{displayName:'Amazon'}),/Doppelte/);
 const malicious=financeMerchantEdit(a,['1'],{displayName:'<img src=x onerror=alert(1)>'}).rows;
 assert.ok(!financeMerchantInspector(malicious,'<img src=x onerror=alert(1)>').includes('<img src=x'));
});
test('inspector and ledger use renamed merchant while original payment remains findable',()=>{
 const rows=financeMerchantEdit(sample(),['3'],{displayName:'Jetstar'}).rows;
 const panel=financeMerchantInspector(rows,'Jetstar');assert.match(panel,/finance-merchant-bulk-form/);assert.match(panel,/JETSTAR000000/);assert.match(panel,/value="3"/);
 assert.equal(financeSearchTransactions(rows,{query:'Jetstar'}).count,1);
 assert.equal(financeSearchTransactions(rows,{query:'JETSTAR000000'}).count,1);
 assert.match(readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8'),/financeMerchantSelected=id;render\(\)/);
});
test('separate merchant insights take canonical alias into account',()=>{
 const rows=financeMerchantEdit(sample(),['1','2'],{displayName:'Amazon'}).rows;
 const groups=merchantExpenseGroups(rows,'Shopping');
 assert.equal(groups[0].merchants.find(m=>m.name==='Amazon').count,2);
});
