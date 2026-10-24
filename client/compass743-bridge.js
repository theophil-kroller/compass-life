/** Compass 0.5.77.43: Dreamworld + receipt JSON inbox + automatic E2EE resume sync.
 * Source transformations run after .42; fail closed for any moved anchor.
 * No Worker migration and no upload of raw dreams or receipt data outside the E2EE mirror.
 */
export function compass743Bridge(){
 const replace=(s,oldValue,newValue,key)=>{const count=s.split(oldValue).length-1;if(count!==1)throw Error('Compass .43: expected exactly one '+key+' integration anchor, found '+count);return s.replace(oldValue,newValue);};
 const pathOf=id=>id.replace(/\\/g,'/').split('?')[0];
 return {name:'compass-743-dreams-receipts-journal',enforce:'pre',transform(source,id){
  const path=pathOf(id);let s=source;
  const ch=(a,b,k)=>{s=replace(s,a,b,k)};
  if(path.endsWith('/client/src/main.js')){
   ch("const COMPASS_CLIENT_VERSION='0.5.77.42';","const COMPASS_CLIENT_VERSION='0.5.77.43';",'version');
   ch("import {nutritionHistoryView} from './nutrition-history-v577.js';", "import {nutritionHistoryView} from './nutrition-history-v577.js';\nimport {dreamJournalView,putDreamEntry,deleteDreamEntry,DREAM_KINDS} from './dream-journal-v57743.js';\nimport {RECEIPT_GPT_PROMPT,parseReceiptJSON,receiptInboxView,putReceipt,deleteReceipt} from './receipt-gpt-v57743.js';\nimport './dream-journal-v57743.css';\nimport './receipt-gpt-v57743.css';",'imports');
   ch('let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;',
`let dreamDays743=30,dreamEditingId743='',dreamKind743='all',receiptDraft743=null;
let lastAutoResume743=0;
// Device resume: read E2EE journal automatically without touching data on the other device.
function automaticJournalResume743(){
 if(!state?.privateDeviceMirror?.key||!authToken||!navigator.onLine||journalSyncBusy||journalSyncInFlight)return;
 if(typeof document!=='undefined'&&document.visibilityState==='hidden')return;
 if(Date.now()-lastAutoResume743<25000)return;
 if(document.activeElement?.closest?.('#dream743-form, #receipts743-form, #str732-form'))return;
 lastAutoResume743=Date.now();scheduleJournalSync(0);
}
if(typeof window!=='undefined'){
 window.addEventListener('focus',automaticJournalResume743,{passive:true});
 window.addEventListener('online',automaticJournalResume743,{passive:true});
}
if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')automaticJournalResume743();});
let journalSyncTimer=null,journalSyncInFlight=null,journalRevision=0,journalLastConfirmedAt=0;`,'auto E2EE pull on resume');
   ch('s?.touchJournal||null,s?.strengthJournal||null,s?.miracleMorning||null',
      's?.touchJournal||null,s?.strengthJournal||null,s?.dreamJournal||null,s?.receiptJournal||null,s?.miracleMorning||null','new journals fingerprint');
   ch('strengthJournal:st.strengthJournal||{annotations:[]},miracleMorning:ensureMorning(st)',
      'strengthJournal:st.strengthJournal||{annotations:[]},dreamJournal:st.dreamJournal||{entries:[]},receiptJournal:st.receiptJournal||{entries:[]},miracleMorning:ensureMorning(st)','E2EE payload');
   ch('st.strengthJournal=m.strengthJournal;st.feelingCheckins=m.feelingCheckins;',
      'st.strengthJournal=m.strengthJournal;st.dreamJournal=m.dreamJournal;st.receiptJournal=m.receiptJournal;st.feelingCheckins=m.feelingCheckins;','E2EE apply');
   ch("const tabDef=insightTab==='touch'?", "const tabDef=insightTab==='dreamworld'?{label:'Traumwelt',subtitle:'Nachtträume, Tagträume und Fantasien'}:insightTab==='touch'?",'dream heading');
   ch("const compactInsights=[['balance'", "const compactInsights=[['dreamworld','Traumwelt','moon'],['balance'",'compact Dreamworld nav');
   ch("const content=insightTab==='connections'?", "const content=insightTab==='dreamworld'?dreamJournalView(state,{days:dreamDays743,editingId:dreamEditingId743,kind:dreamKind743}):insightTab==='connections'?",'dream insights view');
   ch("if(action==='insights-tab'){if(id==='touch'||INSIGHT_TABS.some(t=>t.id===id))", "if(action==='insights-tab'){if(id==='touch'||id==='dreamworld'||INSIGHT_TABS.some(t=>t.id===id))",'compact dream tab action');
   ch("if(action==='calm-insight-view'){if(INSIGHT_TABS.some(t=>t.id===id)||", "if(action==='calm-insight-view'){if(id==='dreamworld'||INSIGHT_TABS.some(t=>t.id===id)||",'sidebar dream tab action');
   ch("${navItem('activity','Aktivitäten','activity')}",
      `<button type="button" class="nav-item \${tab==='insights'&&insightTab==='dreamworld'?'is-active':''}" data-action="calm-insight-view" data-id="dreamworld">\${ico('moon',19)}<span>Traumwelt</span></button>
 \${navItem('activity','Aktivitäten','activity')}`,'sidebar dream link');
   ch('${shopping741QuickButton()}${worktimeQuickButton()}',
      '${shopping741QuickButton()}<button type="button" class="quick-utility-button dream743-quick" data-action="dream743-open" title="Traumwelt · schnelle Erfassung" aria-label="Nachttraum, Tagtraum oder Fantasie erfassen">🌙<span class="quick-utility-label">Traum</span></button>${worktimeQuickButton()}', 'quick dream button');
   ch('<div class="shopping713-shell"><section class="work-card shopping713-overview">',
      '<div class="shopping713-shell">${receiptInboxView(state,{draft:receiptDraft743})}<section class="work-card shopping713-overview">','receipt panel in shopping');
   ch('function bind() {',`function bind() {
 const dream743Form=app.querySelector('#dream743-form');
 if(dream743Form)dream743Form.onsubmit=async event=>{
  event.preventDefault();if(!state)return;
  const fd=new FormData(dream743Form);
  try{
   const at=new Date(String(fd.get('at')));
   if(!Number.isFinite(at.getTime()))throw Error('Ungültiger Zeitpunkt.');
   await mutate(st=>putDreamEntry(st,{id:String(fd.get('id')||'')||undefined,kind:String(fd.get('kind')),at:at.toISOString(),title:fd.get('title'),body:fd.get('body'),mood:String(fd.get('mood')||'unknown'),vividness:fd.get('vividness'),lucid:fd.get('lucid')==='on',tags:fd.get('tags')}));
   dreamEditingId743='';render();toast('Erinnerung verschlüsselt gespeichert.');
  }catch(ex){toast('Traumwelt: '+ex.message,true);}
 };
 const dream743KindFilter=app.querySelector('#dream743-kind-filter');if(dream743KindFilter)dream743KindFilter.onchange=()=>{dreamKind743=dream743KindFilter.value;render();};
 const receipt743Form=app.querySelector('#receipts743-form');
 if(receipt743Form)receipt743Form.onsubmit=event=>{
  event.preventDefault();try{receiptDraft743=parseReceiptJSON(String(new FormData(receipt743Form).get('json')||''));render();toast('Bon erkannt. Vor dem Speichern bitte alle Positionen prüfen.');}
  catch(ex){toast('Bonprüfung: '+ex.message,true);}
 };
`,'dream and receipt forms');
   ch("if(action==='pj92-sync-now'){",`if(action==='dream743-open'){
  tab='insights';insightTab='dreamworld';calmNavGroup='insights';dreamEditingId743='';render();return;
 }
 if(action==='dream743-period'){if(!['7','30','90'].includes(id))return;dreamDays743=Number(id);render();return;}
 if(action==='dream743-edit'){if(!(state?.dreamJournal?.entries||[]).some(x=>x.id===id&&!x.deleted))return;dreamEditingId743=id;tab='insights';insightTab='dreamworld';render();app.querySelector('#dream743-form')?.scrollIntoView({block:'start'});return;}
 if(action==='dream743-reset'){dreamEditingId743='';render();return;}
 if(action==='dream743-delete'){
  if(!state||!confirm('Diese Erinnerung wirklich entfernen?'))return;
  try{await mutate(st=>deleteDreamEntry(st,id));if(dreamEditingId743===id)dreamEditingId743='';toast('Erinnerung entfernt.');}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='dream743-select-kind'){
  if(!['night','daydream','fantasy'].includes(id))return;
  const form=app.querySelector('#dream743-form'),sel=form?.elements?.namedItem('kind');if(sel){sel.value=id;app.querySelectorAll('.dream743-kind-row .dream743-chip').forEach(b=>b.classList.toggle('selected',b.dataset.id===id));}return;
 }
 if(action==='receipts743-copy'){
  try{await navigator.clipboard.writeText(RECEIPT_GPT_PROMPT);toast('Kassenbon-Prompt kopiert.');}
  catch(ex){const area=app.querySelector('#receipts743-prompt');if(area){area.focus();area.select();}toast('Prompt markieren und kopieren – Zwischenablage nicht verfügbar.',true);}return;
 }
 if(action==='receipts743-cancel'){receiptDraft743=null;render();return;}
 if(action==='receipts743-confirm'){
  if(!receiptDraft743||!state)return;
  try{await mutate(st=>putReceipt(st,receiptDraft743));receiptDraft743=null;render();toast('Geprüften Bon verschlüsselt gespeichert. Keine Finanzbuchung angelegt.');}
  catch(ex){toast('Bonimport: '+ex.message,true);}return;
 }
 if(action==='receipts743-delete'){
  if(!state||!confirm('Diesen gespeicherten Bon entfernen?'))return;
  try{await mutate(st=>deleteReceipt(st,id));toast('Bon entfernt.');}catch(ex){toast(ex.message,true);}return;
 }
 if(action==='pj92-sync-now'){`,'dream and receipt actions');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   ch("import {mergeStrengthJournal} from './strength-device-sync-v57742.js';","import {mergeStrengthJournal} from './strength-device-sync-v57742.js';\nimport {mergeDreamJournals} from './dream-journal-v57743.js';\nimport {mergeReceiptJournals} from './receipt-gpt-v57743.js';",'journal merge imports');
   ch('strengthJournal:mergeStrengthJournal(lc.strengthJournal,rc.strengthJournal),',
      'strengthJournal:mergeStrengthJournal(lc.strengthJournal,rc.strengthJournal),\n  dreamJournal:mergeDreamJournals(lc.dreamJournal,rc.dreamJournal),\n  receiptJournal:mergeReceiptJournals(lc.receiptJournal,rc.receiptJournal),','E2EE merge with tombstones');
   return {code:s,map:null};
  }
  return null;
 }};
}
