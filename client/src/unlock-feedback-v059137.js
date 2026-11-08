/** 0.5.91.37 · UI-only progress for the ORIGINAL local encrypted vault.
 * Never reads the password, never fakes authentication, never hides an error. */
export const UNLOCK_STAGE_137=Object.freeze({decrypt:'Tresor wird entschlüsselt …',drafts:'Entwürfe werden geladen …',merge:'Arbeitsraum wird vorbereitet …',capture:'Verschlüsselte Eingänge werden geprüft …',render:'Compass wird geöffnet …'});
export function reportUnlockStage137(stage){
 if(typeof document==='undefined')return;
 document.dispatchEvent(new CustomEvent('compass:unlock-progress-137',{detail:{stage}}));
}
/** Attach once per physical overlay shell; independent of vault/render implementation. */
export function attachUnlockProgress137(shell){
 const slot=shell.querySelector('.ars22-form-slot');if(!slot)return ()=>{};
 const progress=document.createElement('div');progress.className='ars137-progress';progress.hidden=true;
 progress.setAttribute('role','status');progress.setAttribute('aria-live','polite');
 progress.innerHTML='<div class="ars137-spin" aria-hidden="true"><i></i><i></i><i></i></div><span data-ars137-label>Tresor wird entschlüsselt …</span><div class="ars137-track" aria-hidden="true"><i></i></div>';
 slot.after(progress);
 let busy=false;
 const status=stage=>{
  const start=stage!=='error'&&Boolean(UNLOCK_STAGE_137[stage]);
  busy=start;progress.hidden=!start;
  if(start)progress.querySelector('[data-ars137-label]').textContent=UNLOCK_STAGE_137[stage];
  const submit=slot.querySelector('button[type="submit"]');if(submit){submit.disabled=start;submit.setAttribute('aria-busy',String(start));}
  const close=shell.querySelector('.ars22-close');if(close)close.disabled=start;
  shell.classList.toggle('ars137-busy',start);
 };
 const listener=event=>status(event.detail?.stage);
 const onSubmit=event=>{if(event.target?.id==='vault-form'){
   // The original app still reads its FormData and owns all crypto/errors.
   if(busy){event.preventDefault();event.stopPropagation();return;}
   // The actual unlock callback will publish the first stage immediately.
 }};
 document.addEventListener('compass:unlock-progress-137',listener);
 slot.addEventListener('submit',onSubmit,true);
 return ()=>{document.removeEventListener('compass:unlock-progress-137',listener);slot.removeEventListener('submit',onSubmit,true);};
}
