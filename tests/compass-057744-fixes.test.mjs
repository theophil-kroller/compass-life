import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {writeFileSync,unlinkSync} from 'node:fs';
import {compass744Bridge} from '../client/compass744-bridge.js';
import {parseReceiptJSON,parseReceiptJSONList,putReceipts,receiptInboxView,receiptMonthSummary} from '../client/src/receipt-gpt-v57743.js';

const receipt=(date,total,desc)=>({schema:'compass_receipt_v1',merchant:'Hofer',date,currency:'EUR',total,items:[{description:desc,quantity:1,unit:'Stück',unit_price:total,total,category:'Lebensmittel',confidence:'high'}]});
test('GPT multiple bon objects round-trip, no silent finance writes',()=>{
 const input=JSON.stringify([receipt('2026-10-24',5.1,'Kürbiskernöl'),receipt('2026-10-10',2.5,'Käferbohnen')]);
 const data=parseReceiptJSONList(input);assert.equal(data.length,2);
 assert.throws(()=>parseReceiptJSON(input),/Mehrfachvorschau/);
 const state={financeTransactions:[{id:'bank'}]};
 assert.deepEqual(putReceipts(state,data),{added:2,skipped:0});
 assert.deepEqual(putReceipts(state,data),{added:0,skipped:2});
 assert.equal(receiptMonthSummary(state,'2026-10').receipts.length,2);
 assert.equal(state.financeTransactions.length,1);
 assert.ok(receiptInboxView(state,{draft:data}).includes('Prüfvorschau: 2 Bons'));
});
test('JSON supports fences and pasted escaped indentation; validates each bon',()=>{
 const raw=JSON.stringify([receipt('2026-10-24',5.1,'A'),receipt('2026-10-10',2.5,'B')],null,2);
 assert.equal(parseReceiptJSONList('```json\n'+raw+'\n```').length,2);
 const rich=raw.split('\n').map(l=>'&#x20;'+l+'\\').join('\n');
 assert.equal(parseReceiptJSONList(rich.slice(0,-1)).length,2);
 assert.throws(()=>parseReceiptJSONList(JSON.stringify([receipt('2026-10-24',5.1,'A'),{...receipt('2026-10-10',2.5,'B'),currency:'USD'}])),/Bon 2:.*EUR/);
 assert.throws(()=>parseReceiptJSONList('[{}]'),/Bon 1:.*Schema/);
});
test('older single bon API stays intact',()=>{assert.equal(parseReceiptJSON(JSON.stringify(receipt('2026-10-24',3,'A'))).date,'2026-10-24');});
const mock=`
import {RECEIPT_GPT_PROMPT,parseReceiptJSON,receiptInboxView,putReceipt,deleteReceipt} from './receipt-gpt-v57743.js';
const COMPASS_CLIENT_VERSION='0.5.77.43';
function shopping741QuickButton(){
 const active=shoppingLists(state).filter(p=>p.status==='active');
 if(!active.length)return '';
 const selected=active.find(p=>p.id===shoppingSelectedId)||active[0];
 return selected;
}
async function runAction(action,id){
 if(action==='shopping741-open'){
 const active=shoppingLists(state).filter(p=>p.status==='active');
 if(!active.length){toast('Keine aktive Einkaufsliste.');return;}
 shoppingSelectedId=active[0]?.id;
 }
}
function bind() {
 const dream743Form=app.querySelector('#dream743-form');
 if(dream743Form)dream743Form.onsubmit=async event=>{};
 const receipt743Form=app.querySelector('#receipts743-form');
 if(receipt743Form)receipt743Form.onsubmit=event=>{
 event.preventDefault();try{receiptDraft743=parseReceiptJSON(String(new FormData(receipt743Form).get('json')||''));render();toast('Bon erkannt. Vor dem Speichern bitte alle Positionen prüfen.');}catch(ex){}
 };
}
async function moreActions(action){
 if(action==='receipts743-confirm'){
  if(!receiptDraft743||!state)return;
  try{await mutate(st=>putReceipt(st,receiptDraft743));receiptDraft743=null;render();toast('Geprüften Bon verschlüsselt gespeichert. Keine Finanzbuchung angelegt.');}
  catch(ex){}
 }
}
`;
test('last bridge changes only once and syntax of transformed source is valid',()=>{
 const actual=compass744Bridge().transform(mock,'/work/client/src/main.js').code;
 assert.match(actual,/0\.5\.77\.44/);
 assert.match(actual,/shopping741-open.*title="Einkaufslisten und Kassenbons öffnen"/s);
 assert.match(actual,/receiptDraft743=parseReceiptJSONList/);
 assert.match(actual,/stopImmediatePropagation\(\)/);
 assert.match(actual,/putReceipts\(st,receiptDraft743\)/);
 const path=join(tmpdir(),'compass-744-syntax-'+process.pid+'.mjs');
 writeFileSync(path,actual);try{execFileSync(process.execPath,['--check',path],{stdio:'pipe'});}finally{unlinkSync(path);}
});
test('bridge fails closed when a previous integration anchor changes',()=>assert.throws(()=>compass744Bridge().transform('no base code','/work/client/src/main.js'),/integration anchor/));
test('Vite pipeline keeps historical ordering and appends .44 once',()=>{
 const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(config,/compass741Bridge\(\), strengthSync742Bridge\(\), compass743Bridge\(\), compass744Bridge\(\), VitePWA/);
});
