/** Compass 0.5.91.5 — review proposals for actual AND presentation-only open rows.
 * Pure planner: validate before mutating the vault, and never approve unseen rows.
 */
import {financeReviewGroups,categorizeTransaction,merchantKey,safeMerchantRule} from './finance-core.js';
import {economicFlowIndex,economicPresentationRows} from './finance-economic-flows-v05914.js';

/** The review screen uses economicPresentationRows; the save handler must use
 * exactly that projection as well, not the stale original needsReview flag. */
export function financeReviewProposal(transactions=[],id,{category,flow,applyAll=false}={}){
 if(!Array.isArray(transactions))throw Error('Keine Buchungsdaten geladen.');
 const projected=economicPresentationRows(transactions,economicFlowIndex(transactions));
 const group=financeReviewGroups(projected).find(g=>g.entries.some(t=>t.id===id));
 if(!group)throw Error('Diese Buchung ist nicht mehr offen. Bitte die Liste neu laden.');
 const selected=applyAll?group.entries:[group.entries.find(t=>t.id===id)];
 if(!selected.length)throw Error('Keine Buchung ausgewählt.');
 const changes=selected.map(t=>{
  try{return {id:t.id,updated:categorizeTransaction(transactions.find(r=>r.id===t.id),category,flow)};}
  catch(error){
   if(/Vorzeichen und Geldfluss-Art/.test(error.message))throw Error(`${t.amountCents>0?'Geldeingang':'Geldabgang'} am ${t.day}: Die gewählte Art „${flow==='expense'?'Ausgabe':flow==='income'?'Einnahme':flow==='refund'?'Rückerstattung':flow==='cash'?'Bargeld':'Umbuchung'}“ passt nicht zum Buchungsvorzeichen. Bitte eine andere Art/Kategorie wählen.`);
   throw error;
  }
 });
 return {changes,groupCount:group.entries.length,merchant:group.merchant,merchantKey:merchantKey(group.merchant),ruleAllowed:safeMerchantRule(group.merchant)};
}

/** An update only touches the explicitly approved IDs. No blanket reclassification
 * of other payment purposes or already confirmed transactions. */
export function applyFinanceReviewProposal(state,proposal,{remember=false,category,flow}={}){
 state.financeTransactions??=[];state.financeRules??=[];
 const approved=new Map(proposal.changes.map(x=>[x.id,x.updated]));let count=0;
 state.financeTransactions=state.financeTransactions.map(row=>{
  const changed=approved.get(row.id);if(!changed)return row;
  count++;return changed;
 });
 if(count!==proposal.changes.length)throw Error('Eine Buchung hat sich zwischen Auswahl und Speicherung geändert. Bitte erneut prüfen.');
 if(remember&&proposal.ruleAllowed&&proposal.merchantKey){
  state.financeRules=state.financeRules.filter(r=>r.merchantKey!==proposal.merchantKey);
  state.financeRules.push({merchantKey:proposal.merchantKey,category,flow});
 }
 return count;
}
