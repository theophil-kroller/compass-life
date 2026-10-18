/** Private user-defined counterparty rules, held ONLY in the encrypted local Vault.
 * Never ship counterparties in the public repository; import a personal JSON pack locally.
 */
const normalize=s=>String(s??'').normalize('NFKC').toLocaleUpperCase('de-AT').replace(/\s+/g,' ').trim();
const supportedFlows=new Set(['expense','income','transfer','cash','refund']);
// Payment recipient / receiver is isolated; keywords elsewhere in a payment reference cannot impersonate the payee.
export function extractRecipient(description){
 const s=String(description||'');
 const hit=s.match(/(?:^|\s)(?:Recipient|Payment recipient|Zahlungsempfänger|Empfänger):\s*(.{2,180}?)(?=\s+(?:Purpose of use|Payment reference|Recipient IBAN|Recipient BIC|Payment recipient IBAN|Mandate reference|Client reference|Verwendungszweck|IBAN|BIC):|$)/iu);
 return normalize(hit?.[1]||'');
}
export function extractPurpose(description){
 const s=String(description||'');
 const hit=s.match(/(?:Purpose of use|Payment reference|Verwendungszweck|Zahlungsreferenz):\s*(.{1,400}?)(?=\s+(?:Recipient IBAN|Recipient BIC|Payment recipient IBAN|Mandate reference|Client reference|IBAN|BIC|Card sequence no):|$)/iu);
 return normalize(hit?.[1]||'');
}
export function validatePrivateFinancePack(doc,validCategory){
 if(!doc||doc.format!=='compass-private-finance-rules'||doc.version!==1||!Array.isArray(doc.rules)||doc.rules.length>100)throw Error('Keine gültige private Compass-Finanzregeldatei (Version 1).');
 const rules=doc.rules.map((x,i)=>{
  if(!x||typeof x.recipientContains!=='string'||x.recipientContains.trim().length<5||x.recipientContains.length>100||!validCategory(x.category)||!supportedFlows.has(x.flow))throw Error(`Private Regel ${i+1}: Empfänger, Kategorie oder Geldfluss ungültig.`);
  const terms=x.purposeIncludesAny||[];if(!Array.isArray(terms)||terms.length>15||terms.some(t=>typeof t!=='string'||t.trim().length<3||t.length>75))throw Error(`Private Regel ${i+1}: ungültige Stichwörter.`);
  const expected={Einnahmen:'income',Rückerstattung:'refund',Transfer:'transfer',Bargeld:'cash'}[x.category.split(' / ')[0]]||'expense';
  if(expected!==x.flow)throw Error(`Private Regel ${i+1}: Geldfluss passt nicht zur Kategorie.`);
  return {recipientContains:normalize(x.recipientContains),purposeIncludesAny:terms.map(normalize),category:x.category,flow:x.flow};
 });
 return rules;
}
export function matchPrivateFinanceRule(transaction,rules=[]){
 const recipient=extractRecipient(transaction?.description),purpose=extractPurpose(transaction?.description);
 if(!recipient)return null;
 // Specific purpose rules are evaluated first, regardless of JSON order.
 const ordered=[...rules].sort((a,b)=>(b.purposeIncludesAny?.length?1:0)-(a.purposeIncludesAny?.length?1:0));
 for(const rule of ordered){
  if(!rule?.recipientContains||!recipient.includes(normalize(rule.recipientContains)))continue;
  const terms=rule.purposeIncludesAny||[];if(terms.length&&!terms.some(t=>purpose.includes(normalize(t))))continue;
  const isCredit=Number(transaction.amountCents)>0;
  if((rule.flow==='income'||rule.flow==='refund')!==isCredit&&rule.flow!=='transfer')continue;
  if(rule.flow==='expense'&&isCredit)continue;
  return {category:rule.category,flow:rule.flow,confidence:'high',needsReview:false,source:'private-rule',ruleReason:terms.length?'Deine private Empfängerregel und der Verwendungszweck stimmen überein':'Deine private Empfängerregel; unbekannte Einzelzwecke bleiben in dieser Kategorie grob eingeordnet'};
 }
 return null;
}
