/**
 * Compass 0.5.77.16: vault-backed unsaved editor drafts.
 * No localStorage/sessionStorage, no API upload. The parent app persists only
 * inside the existing encrypted local Vault; it must never sync this key.
 */
const PROTECTED_FORMS=new Set([
 'task-create-form','task-edit-form','project-create-form','project-edit-form',
 'inbox-edit-form','dream-create-form','dream-edit-form',
 'person-project-create-form','person-contact-form','wf715-create'
]);
export const EDIT_DRAFT_VAULT_KEY='localEditDraftsV57716';
export function editorKey(form,context={}){
 if(!form?.id||!PROTECTED_FORMS.has(form.id))return '';
 const id=form.id;
 const entity=String(form.dataset?.id||'');
 // New-task and new-project forms can appear in multiple separate contexts.
 const creation=id==='task-create-form'||id==='project-create-form'||id==='person-project-create-form';
 const route=creation?[context.tab||'',context.treeCreateParent||'',context.treeTaskParent||'',context.selectedProjectId||'',context.selectedDay||''].join(':'):'';
 return [id,entity,route].join('|');
}
export function draftControls(form){
 const count=new Map();
 return [...form.querySelectorAll('input[name], textarea[name], select[name]')]
  .filter(el=>!['hidden','submit','button','reset','file','password'].includes(String(el.type||'').toLowerCase()))
  .map(el=>{const name=el.name,ordinal=count.get(name)||0;count.set(name,ordinal+1);return {el,key:`${name}#${ordinal}`};});
}
export function captureFormDraft(form){
 const values={};
 for(const {el,key} of draftControls(form))values[key]=(['checkbox','radio'].includes(el.type)?!!el.checked:el.value);
 const expanded=[...form.querySelectorAll('details')].map((x,i)=>x.open?i:null).filter(x=>x!==null);
 return {values,expanded,at:Date.now()};
}
export function restoreFormDraft(form,draft){
 if(!draft||typeof draft!=='object'||!draft.values)return false;
 for(const {el,key} of draftControls(form))if(Object.prototype.hasOwnProperty.call(draft.values,key)){
  if(['checkbox','radio'].includes(el.type))el.checked=!!draft.values[key];
  else el.value=String(draft.values[key]??'');
 }
 if(Array.isArray(draft.expanded))for(const [i,el] of [...form.querySelectorAll('details')].entries())el.open=draft.expanded.includes(i);
 return true;
}
export function createEditDraftGuard({root,getState,getContext,persist,traceInputStart=null,traceInputEnd=null,delay=2800}){
 const cache=new Map();let timer=null,loadedState=null,rendering=false;
 const doc=root?.ownerDocument || (typeof document!=='undefined'?document:null);
 const forms=()=>[...root.querySelectorAll('form[id]')].filter(form=>editorKey(form,getContext()));
 const key=form=>form?.dataset?.compassDraftKey||editorKey(form,getContext());
 function hydrate(){
  const state=getState();if(!state||state===loadedState)return;
  const saved=state[EDIT_DRAFT_VAULT_KEY];
  if(saved&&typeof saved==='object')for(const [id,draft] of Object.entries(saved))if(!cache.has(id)&&draft?.values)cache.set(id,draft);
  loadedState=state;
 }
 function updateState(){
  const state=getState();if(!state)return;
  const recent=[...cache.entries()].sort((a,b)=>(b[1]?.at||0)-(a[1]?.at||0)).slice(0,25);
  state[EDIT_DRAFT_VAULT_KEY]=Object.fromEntries(recent);
 }
 function scheduleSave(){
  updateState();clearTimeout(timer);
  timer=setTimeout(()=>{
   timer=null;if(!getState())return;
   persist(Object.fromEntries(cache)).then(()=>{
    for(const form of forms()){
     const status=form.querySelector('.v57716-draft-status');
     if(status&&!status.hidden)status.textContent='Entwurf verschlüsselt gespeichert ✓';
    }
   }).catch(()=>{
    for(const form of forms()){
     const status=form.querySelector('.v57716-draft-status');
     if(status&&!status.hidden)status.textContent='Entwurf nur im Arbeitsspeicher – Speichern fehlgeschlagen';
    }
   });
  },delay);
 }
 function keep(form){const id=key(form);if(!id)return null;const snapshot=captureFormDraft(form);cache.set(id,snapshot);scheduleSave();return snapshot;}
 function focusSnapshot(){
  const el=doc?.activeElement,form=el?.closest?.('form');const id=key(form);
  if(!id||!form?.contains(el)||!['INPUT','TEXTAREA','SELECT'].includes(el.tagName))return null;
  const field=draftControls(form).find(({el:node})=>node===el);
  if(!field)return null;
  let start=null,end=null;
  try{start=el.selectionStart;end=el.selectionEnd;}catch{}
  return {id,field:field.key,start,end};
 }
 function shouldDefer(sameView){
  if(!sameView||rendering)return false;
  const el=doc?.activeElement,form=el?.closest?.('form');const id=key(form);
  return !!(id&&cache.has(id)&&form?.contains(el)&&['INPUT','TEXTAREA','SELECT'].includes(el.tagName));
 }
 function beforeRender(){
  hydrate();const focus=focusSnapshot();
  // input/change handlers normally record every keystroke. Snapshot once more
  // immediately before DOM replacement for browser autofill/composition.
  for(const form of forms())if(cache.has(key(form)))cache.set(key(form),captureFormDraft(form));
  rendering=true;return focus;
 }
 function afterRender(focus){
  hydrate();
  for(const form of forms()){
   const id=editorKey(form,getContext());form.dataset.compassDraftKey=id;
   const draft=cache.get(id);
   if(draft)restoreFormDraft(form,draft);
   const status=doc?.createElement?.('small');if(!status)continue;status.className='v57716-draft-status';
   status.hidden=!draft;
   status.textContent=draft?'Ungespeicherter Entwurf wiederhergestellt':'Entwurf wird im verschlüsselten Tresor gesichert';
   form.appendChild(status);
   const track=()=>{
    const started=traceInputStart?.();
    keep(form);status.hidden=false;status.textContent='Entwurf wird gesichert …';
    if(started!=null)traceInputEnd?.(form.id,started);
   };
   form.addEventListener('input',track);
   form.addEventListener('change',track);
  }
  if(focus){
   const form=forms().find(x=>key(x)===focus.id);
   const el=draftControls(form||{querySelectorAll:()=>[]}).find(x=>x.key===focus.field)?.el;
   if(el){el.focus({preventScroll:true});if(Number.isInteger(focus.start)&&Number.isInteger(focus.end)&&typeof el.setSelectionRange==='function')try{el.setSelectionRange(focus.start,focus.end);}catch{}}
  }
  rendering=false;
 }
 function commit(form){
  const id=key(form);if(!id)return null;
  const backup=cache.get(id)||captureFormDraft(form);
  cache.delete(id);updateState();clearTimeout(timer);timer=null;
  // A committed entry must also disappear from the separate encrypted draft store.
  persist(Object.fromEntries(cache)).catch(()=>{});
  return {id,backup};
 }
 function rollback(backup){if(!backup?.id||!backup.backup)return;cache.set(backup.id,backup.backup);scheduleSave();}
 function pending(){return [...cache.keys()];}
 async function flush(){
  if(!getState())return;
  clearTimeout(timer);timer=null;updateState();
  await persist(Object.fromEntries(cache));
 }
 function reset(){clearTimeout(timer);timer=null;cache.clear();loadedState=null;rendering=false;}
 return {beforeRender,afterRender,shouldDefer,commit,rollback,pending,hydrate,flush,reset};
}
