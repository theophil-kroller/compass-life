import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {
  RECEIPT_CATEGORY_IDS,suggestReceiptCategory,receiptCategoryForItem,setReceiptCategory,mergeReceiptCategoryRules,receiptRuleKey
} from '../client/src/receipt-categories-v57745.js';
import {parseReceiptJSONList,receiptMonthSummary,receiptInboxView,putReceipts,mergeReceiptJournals} from '../client/src/receipt-gpt-v57743.js';
import {compass745Bridge} from '../client/compass745-bridge.js';
const item=(description,total,category='Lebensmittel')=>({description,quantity:1,unit:'Stück',unit_price:total,total,category,confidence:'high'});
const receipt=(date,items,merchant='Hofer')=>({schema:'compass_receipt_v1',merchant,date,currency:'EUR',total:items.reduce((s,x)=>s+x.total,0),items});
const initial=()=>{
 const state={financeTransactions:[{id:'bank-1'}]};
 const a=receipt('2026-10-24',[item('Käferbohnen 400g',2.97),item('Steir. Kürbisk.öl',7.99),item('Bananen lose',1.68),item('Toilettenp. 10x200',3.99,'Drogerie'),item('Cerealino 166,5g',1.99)]);
 const b=receipt('2026-10-10',[item('Bananen lose',0.96),item('Stuff. Crust Pizza',3.99),item('Haferdrink B. 1l',7.92,'Getränke')]);
 assert.deepEqual(putReceipts(state,parseReceiptJSONList(JSON.stringify([a,b]))),{added:2,skipped:0});return state;
};
test('receipt category taxonomy distinguishes food, nonfood, and ambiguous abbreviations',()=>{
 const examples={
  'Käferbohnen 400g':'legumes','BIO Karotten':'vegetables','Heidelbeeren 500g':'fruit',
  'BIO-ESL Vollmilch':'dairy','Eier FL 15er M':'eggs','Haferdrink B. 1l':'plant-based',
  'BIO Erdnussmus100%':'nuts','Steir. Kürbisk.öl':'oils','Pringles Hot 160g':'snacks',
  'TK Germknödel Powi':'sweets','Stuff. Crust Pizza':'prepared','Laugenbrezel':'staples',
  'bal. Taschent 15x10':'drugstore','Cerealino 166,5g':'unknown','BBQ Burgersch.200g':'unknown'
 };
 for(const [description,want] of Object.entries(examples))assert.equal(suggestReceiptCategory({description,category:'Lebensmittel'}).category,want,description);
 assert.equal(new Set(RECEIPT_CATEGORY_IDS).size,RECEIPT_CATEGORY_IDS.length);
});
test('monthly category breakdown uses receipt position totals without altering receipts or banking',()=>{
 const st=initial(),before=structuredClone(st.receiptJournal.entries);
 const model=receiptMonthSummary(st,'2026-10');
 assert.equal(model.receipts.length,2);
 assert.equal(model.products.length,7);
 assert.equal(model.categories.find(x=>x.id==='unknown').amount,1.99);
 assert.equal(model.categories.find(x=>x.id==='fruit').amount,2.64);
 const sum=model.categories.reduce((s,x)=>s+x.amount,0),total=model.receipts.reduce((s,x)=>s+x.total,0);
 assert.ok(Math.abs(sum-total)<.001);
 assert.deepEqual(st.receiptJournal.entries,before);
 assert.equal(st.financeTransactions[0].id,'bank-1');
 const html=receiptInboxView(st,{month:'2026-10'});
 assert.match(html,/Wofür gibst du beim Einkaufen Geld aus/);
 assert.match(html,/Produktgruppen prüfen und korrigieren/);
 assert.match(html,/receipts745-select/);
 assert.match(html,/Noch zu prüfen/);
});
test('manual change is reusable by merchant and product, without modifying original receipt',()=>{
 const state=initial(),old=structuredClone(state.receiptJournal.entries);
 const receipt1=state.receiptJournal.entries[0];
 const result=setReceiptCategory(state,{receiptId:receipt1.id,index:2,category:'snacks'});
 assert.equal(result.affected,2);
 assert.equal(receiptCategoryForItem(state,receipt1,receipt1.items[2]).category,'snacks');
 assert.equal(receiptMonthSummary(state,'2026-10').categories.find(c=>c.id==='fruit'),undefined);
 assert.deepEqual(state.receiptJournal.entries,old);
 setReceiptCategory(state,{receiptId:receipt1.id,index:2,category:'auto'});
 assert.equal(receiptCategoryForItem(state,receipt1,receipt1.items[2]).category,'fruit');
 assert.throws(()=>setReceiptCategory(state,{receiptId:receipt1.id,index:2,category:'invented'}),/Ungültige/);
});
test('E2EE mirror merges independent category corrections including reset-to-auto',()=>{
 const original=initial(),receiptA=original.receiptJournal.entries[0];
 const desktop=structuredClone(original),phone=structuredClone(original);
 setReceiptCategory(desktop,{receiptId:receiptA.id,index:2,category:'snacks'});
 setReceiptCategory(phone,{receiptId:receiptA.id,index:0,category:'staples'});
 const merged=mergeReceiptJournals(desktop.receiptJournal,phone.receiptJournal);
 assert.equal(Object.keys(merged.categoryRules).length,2);
 assert.equal(receiptCategoryForItem({receiptJournal:merged},receiptA,receiptA.items[0]).category,'staples');
 assert.equal(receiptCategoryForItem({receiptJournal:merged},receiptA,receiptA.items[2]).category,'snacks');
 const key=receiptRuleKey(receiptA.merchant,receiptA.items[2].description);
 const updated=mergeReceiptCategoryRules(merged.categoryRules,{[key]:{category:'auto',updatedAt:'9999-01-01T00:00:00Z'}});
 assert.equal(updated[key].category,'auto');
 assert.equal(receiptCategoryForItem({receiptJournal:{categoryRules:updated}},receiptA,receiptA.items[2]).category,'fruit');
});
test('partial prices are not silently converted into an observed zero amount',()=>{
 const st=initial(),row=st.receiptJournal.entries[0];
 row.items.push({...item('Unlesbar',0),total:null,unit_price:null});
 const m=receiptMonthSummary(st,'2026-10');
 assert.equal(m.coverage.missing,1);
 assert.equal(m.categories.find(c=>c.id==='unknown').missing,1);
 assert.ok(receiptInboxView(st,{month:'2026-10'}).includes('ohne Preis'));
});
test('0.5.77.45 Vite integration produces parsable actions, import, events and version',()=>{
 const mock=`
const COMPASS_CLIENT_VERSION='0.5.77.44';
import {RECEIPT_GPT_PROMPT,parseReceiptJSONList,receiptInboxView,putReceipts,deleteReceipt} from './receipt-gpt-v57743.js';
let dreamDays743=30,dreamEditingId743='',dreamKind743='all',receiptDraft743=null;
function shoppingScreen(){ return receiptInboxView(state,{draft:receiptDraft743}); }
function bind() { const receipt743Form=app.querySelector('#receipts743-form'); }
async function runAction(action,id){ if(action==='receipts743-cancel'){ receiptDraft743=null; render();return; } }
`;
 const built=compass745Bridge().transform(mock,'/repo/client/src/main.js').code;
 for(const needle of ['0.5.77.45','setReceiptCategory','receiptMonth745','receipts745-select','receipts745-month','month:receiptMonth745'])assert.ok(built.includes(needle),needle);
 const path=join(tmpdir(),`compass745-${process.pid}.mjs`);
 writeFileSync(path,built);try{execFileSync(process.execPath,['--check',path]);}finally{unlinkSync(path);}
 assert.throws(()=>compass745Bridge().transform('none','/repo/client/src/main.js'),/integration anchor/);
});
test('Vite plugin ordering and previous regression tests include the new last plugin',()=>{
 const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(vite,/compass744Bridge\(\), compass745Bridge\(\), compass746Bridge\(\), VitePWA/);
 for(const file of ['compass-057743-dream-receipts.test.mjs','compass-057744-fixes.test.mjs']){
  const s=readFileSync(new URL(file,import.meta.url),'utf8');
  assert.match(s,/compass745Bridge/);
 }
});
