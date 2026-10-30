/** Compass 0.5.79 · Small E2EE journal commands for secondary-device finance edits.
 * A receiver never changes financeTransactions or publishes a private finance snapshot.
 * The source validates the original record and publishes the new authoritative snapshot.
 */
import {categorizeTransaction,validCategory,merchantKey,safeMerchantRule} from './finance-core.js';
const FLOWS=new Set(['income','expense','refund','transfer','cash']);
const asArray=value=>Array.isArray(value)?value:[];
export function financeDecisionFingerprint(t){
 if(!t||typeof t.id!=='string'||!t.id)return '';
 return JSON.stringify([t.id,t.day,t.amountCents,t.accountId||'',t.merchant||'',t.category||'',t.flow||'',Boolean(t.needsReview)]);
}
export function queueFinanceMobileDecision(state,transactionId,category,flow,now=new Date().toISOString(),id=crypto.randomUUID(),remember=false){
 const tx=asArray(state?.financeTransactions).find(t=>t.id===transactionId);
 if(!tx)throw Error('Buchung nicht gefunden. Bitte Geräteabgleich aktualisieren.');
 if(!validCategory(category)||!FLOWS.has(flow))throw Error('Ungültige Buchungskategorie.');
 // Validate amount signs and main-category/flow agreement before the command enters the journal.
 categorizeTransaction(tx,category,flow);
 if(!state?.privateDeviceMirror?.key||state.privateDeviceMirror.mode!=='receiver')throw Error('Nur für ein eingerichtetes Empfangsgerät.');
 if(asArray(state.financeMobileDecisions).some(x=>x.transactionId===transactionId&&x.status==='pending'))throw Error('Diese Buchung ist bereits zur Übernahme vorgemerkt.');
 if(asArray(state.financeMobileDecisions).filter(x=>x.status==='pending').length>=250)throw Error('Zu viele offene Zuordnungen. Bitte mit dem Hauptgerät synchronisieren.');
 const created={id,transactionId,category,flow,base:financeDecisionFingerprint(tx),createdAt:now,updatedAt:now,status:'pending',remember:Boolean(remember)&&safeMerchantRule(tx.merchant)};
 state.financeMobileDecisions=[...asArray(state.financeMobileDecisions),created];
 return created;
}
export function mergeFinanceMobileDecisions(left,right){
 const byId=new Map();
 for(const row of [...asArray(left),...asArray(right)]){
  if(!row?.id||typeof row.id!=='string'||!['pending','applied','conflict'].includes(row.status))continue;
  const prev=byId.get(row.id);
  const stamp=String(row.updatedAt||''),previous=String(prev?.updatedAt||'');
  const priority=x=>x?.status==='pending'?0:x?.status==='conflict'?1:2;
  if(!prev||stamp>previous||(stamp===previous&&priority(row)>priority(prev)))byId.set(row.id,row);
 }
 return [...byId.values()].sort((a,b)=>String(a.createdAt).localeCompare(String(b.createdAt))||a.id.localeCompare(b.id));
}
/** Return change counts. Will never override a transaction modified since the phone's snapshot. */
export function applyQueuedFinanceDecisions(state,now=new Date().toISOString()){
 if(state?.privateDeviceMirror?.mode!=='source')return {handled:0,applied:0,conflicts:0};
 const records=asArray(state.financeMobileDecisions),rows=asArray(state.financeTransactions);
 let handled=0,applied=0,conflicts=0;
 for(const decision of records){
  if(decision.status!=='pending')continue;
  const i=rows.findIndex(t=>t.id===decision.transactionId),tx=rows[i];
  let conflict='';
  if(!tx)conflict='Buchung nicht mehr vorhanden';
  else if(financeDecisionFingerprint(tx)!==decision.base){
   if(tx.category===decision.category&&tx.flow===decision.flow&&!tx.needsReview){
    decision.status='applied';decision.updatedAt=now;handled++;continue;
   }
   conflict='Buchung wurde seit der Zuordnung geändert';
  }else{
   try{rows[i]=categorizeTransaction(tx,decision.category,decision.flow);
    if(decision.remember&&safeMerchantRule(tx.merchant)){
     const key=merchantKey(tx.merchant);state.financeRules=asArray(state.financeRules).filter(r=>r.merchantKey!==key);
     state.financeRules.push({merchantKey:key,category:decision.category,flow:decision.flow});
    }}
   catch{conflict='Kategorie und Buchung passen nicht zusammen';}
  }
  decision.status=conflict?'conflict':'applied';decision.updatedAt=now;
  if(conflict){decision.reason=conflict;conflicts++;}else{applied++;}
  handled++;
 }
 if(handled){state.financeTransactions=rows;state.financeMobileDecisions=records;}
 return {handled,applied,conflicts};
}
export const financeMobileDecisionStatus=(rows,id)=>asArray(rows).filter(x=>x.transactionId===id).at(-1)?.status||'';
