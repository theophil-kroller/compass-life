/** Compass 0.5.91.6 — conservative cross-export duplicate protection.
 * Preserve original encrypted rows. Ignore only documented duplicates for reporting,
 * account balance bridging and subsequent imports; never dedupe on amount/date alone.
 */
import {accountFor} from './finance-revolut.js';
const text=v=>String(v??'').normalize('NFKC').trim();
const plain=v=>text(v).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleUpperCase('de-AT').replace(/[^A-Z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const entryValue=t=>Number.isSafeInteger(t?.amountCents)&&/^\d{4}-\d\d-\d\d$/.test(String(t?.day||''));
// Bilingual Raiffeisen statement descriptors. Do not include IBAN/BIC in fingerprints.
const CP=/(?:^|\s)(?:Client|Auftraggeber|Zahlungspflichtige\*?r?|Payment recipient|Recipient|Zahlungsempf[aä]nger(?:in)?|Empf[aä]nger(?:in)?):\s*(.*?)(?=\s+(?:Purpose of use|Verwendungszweck|Payment reference|Zahlungsreferenz|Client IBAN|Client BIC|IBAN Auftraggeber|BIC Auftraggeber|IBAN|BIC)\s*:|$)/iu;
const PU=/(?:^|\s)(?:Purpose of use|Verwendungszweck|Payment reference|Zahlungsreferenz):\s*(.*?)(?=\s+(?:Client IBAN|Client BIC|IBAN Auftraggeber|BIC Auftraggeber|IBAN|BIC|Mandatsreferenz|Mandate reference|Payment recipient|Zahlungsempf[aä]nger)\s*:|$)/iu;
const meaningfulReference=s=>{const r=text(s).match(/(?:^|[^A-Z0-9])([0-9]{5,}\/[0-9]{4,}|[0-9]{10,})(?=$|[^A-Z0-9])/iu);return r?.[1]||'';};
const sourceId=t=>text(accountFor(t)||t?.accountId||'');
export function financeSemanticFingerprint(t){
 if(!entryValue(t)||!sourceId(t))return '';
 const desc=text(t.description);
 const purpose=desc.match(PU)?.[1]||'';
 const reference=meaningfulReference(purpose)||meaningfulReference(t.bankReference);
 const counterpart=plain(desc.match(CP)?.[1]||'');
 // A robust reference AND matching named counterparty are mandatory for cross-language matching.
 // Merchant/date/amount alone can legitimately repeat (shops, multiple payroll batches).
 if(!reference||counterpart.length<5)return '';
 const currency=text(t.currency||'EUR').toUpperCase();
 return [sourceId(t),t.day,t.amountCents,currency,'reference',reference,counterpart].join('\x1f');
}
const quality=t=>(t?.source==='user'||t?.confidence==='confirmed'?10:0)+(t?.needsReview?0:2);
/** Does not overwrite or delete any transaction. Suppressed rows are recoverable. */
export function financeDuplicateIndex(transactions=[],distinctIds=[]){
 const rows=Array.isArray(transactions)?transactions:[],distinct=new Set(Array.isArray(distinctIds)?distinctIds:[]);
 const buckets=new Map();
 for(const [i,t] of rows.entries()){
  if(!entryValue(t))continue;
  const id=text(t.id),fingerprint=financeSemanticFingerprint(t);
  const keys=[id?`id:${id}`:'',fingerprint?`economic:${fingerprint}`:''].filter(Boolean);
  for(const key of keys){const list=buckets.get(key)||[];list.push({t,i});buckets.set(key,list);}
 }
 const hidden=new Set(),groups=[],grouped=new Set();
 // Identity duplicates precede the economic signature; they remain exact duplicates.
 for(const [key,members] of [...buckets].sort(([a],[b])=>a.startsWith('id:')?-1:b.startsWith('id:')?1:a.localeCompare(b))){
  const candidates=members.filter(x=>!hidden.has(x.t));
  if(candidates.length<2)continue;
  const eligible=key.startsWith('id:')?candidates:candidates.filter(x=>!distinct.has(text(x.t.id)));
  if(eligible.length<2)continue;
  eligible.sort((a,b)=>quality(b.t)-quality(a.t)||a.i-b.i);
  const keep=eligible[0].t;
  for(const {t} of eligible.slice(1)){
   if(grouped.has(t))continue;
   hidden.add(t);grouped.add(t);
   groups.push({kept:keep,hidden:t,reason:key.startsWith('id:')?'Identische Import-ID':'Gleiches Konto, Datum, Betrag, Zahlungspartner und Zahlungsreferenz'});
  }
 }
 return {rows:rows.filter(t=>!hidden.has(t)),hidden,groups};
}
export const financeActiveTransactions=(transactions=[],distinctIds=[])=>financeDuplicateIndex(transactions,distinctIds).rows;
/** Used when confirming imports as well as for local preview — avoids a stale-preview race. */
export function financeUniqueImports(incoming=[],existing=[],distinctIds=[]){
 const ids=new Set((Array.isArray(existing)?existing:[]).map(x=>text(x?.id)).filter(Boolean));
 const signatures=new Set((Array.isArray(existing)?existing:[]).map(financeSemanticFingerprint).filter(Boolean));
 const distinct=new Set(Array.isArray(distinctIds)?distinctIds:[]);
 const rows=[];let duplicates=0;
 for(const t of Array.isArray(incoming)?incoming:[]){
  const id=text(t?.id),signature=financeSemanticFingerprint(t);
  if(id&&ids.has(id)||signature&&signatures.has(signature)&&!distinct.has(id)){duplicates++;continue;}
  rows.push(t);if(id)ids.add(id);if(signature)signatures.add(signature);
 }
 return {rows,duplicates};
}
