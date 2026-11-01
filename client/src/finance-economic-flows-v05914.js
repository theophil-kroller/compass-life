/** Compass 0.5.91.4 — conservative economic classification of imported ledger entries.
 * Does NOT mutate the vault or automatically approve transfer pairs. A bank movement
 * and an economic income/expense are different concepts. Unknown stays unknown.
 */
import {accountFor} from './finance-revolut.js';
const ownTransferText=/(?:\bEIGEN(?:Ü|UE)BERTRAG\b|\bEIGENES? KONTO\b|\bOWN ACCOUNT\b|\bINTERNAL TRANSFER\b|\bKREDITKARTEN(?:\s|-)?ABRECHNUNG\b|\bCARD COMPLETE.*VISA\b)/iu;
const genericUnclear=new Set(['Sonstiges / Überweisung ohne klaren Zweck','Sonstiges / Zahlung ohne klaren Zweck','Einnahmen / Eingang ohne klare Herkunft']);
const transferFamily=t=>String(t?.category||'').startsWith('Transfer /')||t?.flow==='transfer'||Boolean(t?.linkedTransferId);
const cashFamily=t=>String(t?.category||'').startsWith('Bargeld /')||t?.flow==='cash';
const userConfirmed=t=>t?.source==='user'||t?.confidence==='confirmed'||t?.source==='own-rule';
const hasOwnEvidence=t=>ownTransferText.test(String(t?.description||''))||ownTransferText.test(String(t?.category||''));
const generic=t=>genericUnclear.has(String(t?.category||''))&&!userConfirmed(t);
const uncertain=t=>t?.needsReview===true||generic(t);
const dateOK=d=>/^\d{4}-\d\d-\d\d$/.test(String(d||''))&&!Number.isNaN(Date.parse(d+'T12:00:00Z'));
const daysApart=(a,b)=>Math.abs(Date.parse(a+'T12:00:00Z')-Date.parse(b+'T12:00:00Z'))/86400000;
/** Build once for all accounts, before period/account filters. Index keys are transaction objects,
 * avoiding collisions when imports have missing/duplicated provider IDs. */
export function economicFlowIndex(transactions=[]){
 const rows=Array.isArray(transactions)?transactions:[],classification=new Map(),byAmount=new Map();
 for(const t of rows){
  if(!t||!Number.isSafeInteger(t.amountCents)||!dateOK(t.day))continue;
  let kind='other';
  if(transferFamily(t)||hasOwnEvidence(t))kind='transfer';
  else if(cashFamily(t))kind='cash';
  else if(uncertain(t))kind='uncertain';
  else if(t.flow==='income'&&t.amountCents>0)kind='income';
  else if(t.flow==='refund'&&t.amountCents>0)kind='refund';
  else if(t.flow==='expense'&&t.amountCents<0)kind='expense';
  classification.set(t,kind);
  if(t.amountCents!==0){const key=Math.abs(t.amountCents),items=byAmount.get(key)||[];items.push(t);byAmount.set(key,items);}
 }
 // Opposite signed legs on DISTINCT known source accounts with matching cents and near dates.
 // Never reclassify two independently confirmed external transactions by coincidence.
 const paired=new Set();
 for(const list of byAmount.values()){
  if(list.length<2)continue;
  const rowsSorted=list.slice().sort((a,b)=>String(a.day).localeCompare(String(b.day))||String(a.id||'').localeCompare(String(b.id||'')));
  for(const a of rowsSorted){
   if(paired.has(a)||classification.get(a)==='cash')continue;
   const candidates=rowsSorted.filter(b=>b!==a&&!paired.has(b)&&b.amountCents===-a.amountCents&&accountFor(a)!==accountFor(b)&&daysApart(a.day,b.day)<=3&&classification.get(b)!=='cash');
   const b=candidates.find(b=>{
    if(a.linkedTransferId&&String(a.linkedTransferId)===String(b.id))return true;
    if(b.linkedTransferId&&String(b.linkedTransferId)===String(a.id))return true;
    const evidence=classification.get(a)==='transfer'||classification.get(b)==='transfer'||hasOwnEvidence(a)||hasOwnEvidence(b);
    if(evidence)return !(userConfirmed(a)&&classification.get(a)!=='transfer')&&!(userConfirmed(b)&&classification.get(b)!=='transfer');
    return uncertain(a)&&uncertain(b);
   });
   if(!b)continue;
   paired.add(a);paired.add(b);
   const evidence=classification.get(a)==='transfer'||classification.get(b)==='transfer'||hasOwnEvidence(a)||hasOwnEvidence(b)||a.linkedTransferId===b.id||b.linkedTransferId===a.id;
   classification.set(a,evidence?'transfer':'uncertain');classification.set(b,evidence?'transfer':'uncertain');
  }
 }
 return classification;
}
export function economicFlowKind(t,index){return index?.get(t)||'other';}
/** Ledger transactions are ALWAYS kept for balance reconciliation, including transfers. */
export const economicExternalNet=t=>Number.isSafeInteger(t?.amountCents)?t.amountCents:0;

/** View-only projection for legacy charts, reports and review lists that still expect
 * `needsReview` / `flow`. Original encrypted transaction records are never changed. */
export function economicPresentationRows(rows=[],index){
 return rows.map(t=>{
  const kind=economicFlowKind(t,index);
  if(kind==='uncertain'&&!t.needsReview)return {...t,needsReview:true,ruleReason:t.ruleReason||'Wirtschaftlicher Zweck unklar: möglicher Eigenübertrag, Einnahme oder externe Ausgabe',source:t.source||'economic-review'};
  if(kind==='transfer'&&t.flow!=='transfer')return {...t,flow:'transfer',category:'Transfer / Eigene Konten',needsReview:false,ruleReason:'Neutralisiert für Auswertungen – interner Eigenübertrag / Kreditkartenausgleich (Konto-Originaldaten unverändert)'};
  if(kind==='cash'&&t.flow!=='cash')return {...t,flow:'cash',category:'Bargeld / Bargeldbehebung',needsReview:false};
  return t;
 });
}
