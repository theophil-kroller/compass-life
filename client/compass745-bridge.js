/** Compass 0.5.77.45 — local-first receipt category breakdown.
 * Runs after .44. Keeps receipt originals untouched and stores learned category
 * corrections in receiptJournal.categoryRules (existing E2EE journal mirror).
 */
export function compass745Bridge(){
 const unique=(s,from,to,label)=>{
  const count=s.split(from).length-1;
  if(count!==1)throw Error(`Compass .45: ${label}: expected one integration anchor, got ${count}`);
  return s.replace(from,to);
 };
 return {name:'compass-745-receipt-taxonomy',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;const ch=(a,b,k)=>{s=unique(s,a,b,k);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.44';","const COMPASS_CLIENT_VERSION='0.5.77.45';",'version');
  ch("import {RECEIPT_GPT_PROMPT,parseReceiptJSONList,receiptInboxView,putReceipts,deleteReceipt} from './receipt-gpt-v57743.js';",
    "import {RECEIPT_GPT_PROMPT,parseReceiptJSONList,receiptInboxView,putReceipts,deleteReceipt} from './receipt-gpt-v57743.js';\nimport {setReceiptCategory} from './receipt-categories-v57745.js';\nimport './receipt-categories-v57745.css';",'category imports');
  ch("let dreamDays743=30,dreamEditingId743='',dreamKind743='all',receiptDraft743=null;",
    "let dreamDays743=30,dreamEditingId743='',dreamKind743='all',receiptDraft743=null,receiptMonth745=localDateString(new Date()).slice(0,7);",'receipt month state');
  ch('receiptInboxView(state,{draft:receiptDraft743})','receiptInboxView(state,{draft:receiptDraft743,month:receiptMonth745})','receipt category UI');
  ch(" const receipt743Form=app.querySelector('#receipts743-form');",` // Bind category correction independently of the full page form. Keep the
 // current open details panel and scroll position while updating the amounts.
 app.querySelectorAll('.receipts745-select').forEach(select=>select.onchange=async()=>{
  if(!state)return;
  const id=select.dataset.receiptId,index=Number(select.dataset.receiptIndex),category=select.value;
  select.disabled=true;
  try{
   await mutate(st=>setReceiptCategory(st,{receiptId:id,index,category}),null,true);
   const oldPanel=app.querySelector('.receipts745-categories');
   if(oldPanel){
    const html=receiptInboxView(state,{draft:receiptDraft743,month:receiptMonth745});
    const detached=document.createElement('div');detached.innerHTML=html;
    for(const part of ['.receipts745-stats','.receipts745-bars','.receipts745-explain']){
     const before=oldPanel.querySelector(part),after=detached.querySelector(part);
     if(before&&after)before.replaceWith(after);
    }
    // Reflect category changes for identical merchant/product descriptions.
    const updated=detached.querySelectorAll('.receipts745-select');
    const visible=oldPanel.querySelectorAll('.receipts745-select');
    visible.forEach((el,i)=>{if(updated[i])el.innerHTML=updated[i].innerHTML;});
   }
   toast('Warengruppe gespeichert. Gleiche Produkte werden künftig automatisch erkannt.');
  }catch(ex){toast('Produktgruppe: '+ex.message,true);render();}
  finally{if(select.isConnected)select.disabled=false;}
 });
 const receipt743Form=app.querySelector('#receipts743-form');`,'receipt category input');
  ch("if(action==='receipts743-cancel'){",`if(action==='receipts745-month'){
  if(!['prev','next'].includes(id))return;
  const [year,month]=receiptMonth745.split('-').map(Number);
  const d=new Date(Date.UTC(year,month-1+(id==='prev'?-1:1),1));
  receiptMonth745=d.toISOString().slice(0,7);render();return;
 }
 if(action==='receipts743-cancel'){`,'month navigation');
  return {code:s,map:null};
 }};
}
