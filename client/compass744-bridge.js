/** Compass 0.5.77.44: permanently reachable shopping, working Dreamworld quick access,
 * multiple receipt JSONs with safe preview and deduplication.
 * Executed last after the existing .43 plugin, never rewrites the E2EE journal.
 */
export function compass744Bridge(){
 const one=(s,from,to,label)=>{
  const n=s.split(from).length-1;
  if(n!==1)throw Error(`Compass .44: ${label} integration anchor expected once, found ${n}`);
  return s.replace(from,to);
 };
 return {name:'compass-744-receipt-batch-dream-quick-shopping',enforce:'pre',transform(source,id){
  if(!id.replace(/\\/g,'/').split('?')[0].endsWith('/client/src/main.js'))return null;
  let s=source;const ch=(a,b,k)=>{s=one(s,a,b,k);};
  ch("const COMPASS_CLIENT_VERSION='0.5.77.43';","const COMPASS_CLIENT_VERSION='0.5.77.44';",'version');
  ch("import {RECEIPT_GPT_PROMPT,parseReceiptJSON,receiptInboxView,putReceipt,deleteReceipt} from './receipt-gpt-v57743.js';",
     "import {RECEIPT_GPT_PROMPT,parseReceiptJSONList,receiptInboxView,putReceipts,deleteReceipt} from './receipt-gpt-v57743.js';",'batch import functions');
  // The existing .41 helper only rendered the button if an open checklist existed.
  // Keep the badge when there is an active list, but allow receipt access at any time.
  ch(" if(!active.length)return '';\n const selected=active.find(p=>p.id===shoppingSelectedId)||active[0];",
     ` if(!active.length)return \`<button type="button" class="quick-utility-button shopping741-quick" data-action="shopping741-open" title="Einkaufslisten und Kassenbons öffnen" aria-label="Einkaufslisten und Kassenbons öffnen"><span class="shopping741-symbol" aria-hidden="true">🛒</span><span class="quick-utility-label">Einkauf</span></button>\`;
 const selected=active.find(p=>p.id===shoppingSelectedId)||active[0];`,'permanent shopping shortcut');
  ch("if(!active.length){toast('Keine aktive Einkaufsliste.');return;}","if(!active.length){shoppingSelectedId='';tab='shopping';calmNavGroup='plan';render();return;}",'shopping without active list');
  ch("receiptDraft743=parseReceiptJSON(String(new FormData(receipt743Form).get('json')||''));",
     "receiptDraft743=parseReceiptJSONList(String(new FormData(receipt743Form).get('json')||''));",'parse JSON list');
  ch("toast('Bon erkannt. Vor dem Speichern bitte alle Positionen prüfen.');",
     "toast(receiptDraft743.length+' Bon(s) erkannt. Jede Position vor dem Speichern prüfen.');",'count receipts');
  ch("try{await mutate(st=>putReceipt(st,receiptDraft743));receiptDraft743=null;render();toast('Geprüften Bon verschlüsselt gespeichert. Keine Finanzbuchung angelegt.');}",
     "try{let result;await mutate(st=>{result=putReceipts(st,receiptDraft743);});receiptDraft743=null;render();toast(result.added+' Bon(s) verschlüsselt gespeichert'+(result.skipped?' · '+result.skipped+' bereits vorhanden':'')+'. Keine Finanzbuchung angelegt.');}",
     'batch import with duplicate skipping');
  // Own dedicated handler so clicking the moon always opens/focuses the journal,
  // regardless of the generic data-action listener registered later in bind().
  ch(' const dream743Form=app.querySelector(\'#dream743-form\');',
` const dreamShortcuts744=app.querySelectorAll('.dream743-quick,[data-action="calm-insight-view"][data-id="dreamworld"],[data-action="insights-tab"][data-id="dreamworld"]');
 dreamShortcuts744.forEach(dreamShortcut744=>dreamShortcut744.addEventListener('click',ev=>{
  ev.preventDefault();ev.stopImmediatePropagation();
  if(!state){toast('Bitte zuerst den Tresor entsperren.',true);return;}
  document.activeElement?.blur?.();
  tab='insights';insightTab='dreamworld';calmNavGroup='insights';dreamEditingId743='';
  render();
  const field=app.querySelector('#dream743-form textarea[name="body"]');
  field?.scrollIntoView?.({behavior:'auto',block:'center'});
  field?.focus?.({preventScroll:true});
 }));
 const dream743Form=app.querySelector('#dream743-form');`, 'direct moon click and focus');
  return {code:s,map:null};
 }};
}
