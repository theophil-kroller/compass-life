/** Ars Vivendi .59.22: visual gate for the EXISTING Compass encrypted Vault.
 * This module never sees, stores, duplicates or verifies the passphrase.
 * The actual #vault-form and its onsubmit handler remain the source of truth.
 * No vault/crypto, sync, project, or authentication code is replaced.
 */
import './ars-vivendi-lock-v5775922.css';
import './compass-5928-lux.css';
import {COMPASS_VISIBLE_RELEASE} from './compass-release-v57759402519.js';
import {sealedCaptureReady,appendSealedCapture} from './vault.js';
import './compass-25-23-lock-capture.css';

const BASE=String(import.meta.env?.BASE_URL||'/').replace(/\/?$/,'/');
const ASSET=BASE+'ars-vivendi-lock-v5775922.png';
const DESKTOP_MOONLIT=BASE+'ars-vivendi-moonlit-desktop-v5775932.webp';
const ROOT_ID='ars22-lockscreen';

function init(){
  const app=document.getElementById('app');
  if(!app)return;
  let shell=null,activeForm=null,observer=null,panel=null,trigger=null;
  let wasOpen=false;
  const appPreviousInert=app.inert;

  function remove(){
    // Form may have been moved into the overlay. Discard ONLY when Compass
    // itself renders an unlocked view or a replacement vault form.
    if(shell)shell.remove();
    shell=null;panel=null;trigger=null;activeForm=null;wasOpen=false;
    document.documentElement.classList.remove('ars22-locked');
    app.inert=appPreviousInert;
  }

  function displayForm(){
    if(!shell||!activeForm)return;
    wasOpen=true;
    shell.classList.add('ars22-open');
    panel.hidden=false;
    trigger.setAttribute('aria-expanded','true');
    shell.querySelector('[data-ars22-close]')?.focus({preventScroll:true});
    requestAnimationFrame(()=>activeForm.querySelector('input[name="passphrase"]')?.focus({preventScroll:true}));
  }
  function dismissForm(){
    if(!shell)return;
    wasOpen=false;
    shell.classList.remove('ars22-open');
    panel.hidden=true;
    trigger.setAttribute('aria-expanded','false');
    trigger.focus({preventScroll:true});
  }

  function ensureShell(){
    if(shell)return;
    shell=document.createElement('div');
    shell.id=ROOT_ID;
    shell.className='ars22-cover';
    shell.innerHTML=`<div class="ars22-wash" aria-hidden="true"></div>
     <div class="ars22-art" role="img" aria-label="Compass Life – Ars Vivendi: eine goldene Kompassrose vor nachtblauen Bergen und einem See; Die Kunst, bewusst zu leben.">
       <img class="ars22-image" src="${ASSET}" alt="" fetchpriority="high" decoding="async" />
       <span class="ars28-gold-rings" aria-hidden="true"><i></i><i></i><i></i></span>
       <div class="ars28-version">Compass Life · Build ${COMPASS_VISIBLE_RELEASE}</div>
       <button class="ars22-tap" type="button" data-ars22-open aria-controls="ars22-unlock-dialog" aria-expanded="false" aria-label="Compass Tresor entsperren"></button>
       <button type="button" class="ars23-capture-trigger" data-ars23-capture aria-label="Gedanken ohne Tresor-Entsperren verschlüsselt in die Inbox erfassen">✎ <span>Gedanke</span></button>
     </div>
     <section class="ars23-capture-dialog" data-ars23-dialog hidden role="dialog" aria-modal="true" aria-label="Gedanken schnell erfassen">
      <form data-ars23-form><div class="ars23-capture-heading"><div><small>✦ QUICK CAPTURE · INBOX</small><h2>Gedanken festhalten</h2></div><button type="button" data-ars23-close aria-label="Schließen">×</button></div>
       <textarea name="title" rows="3" maxlength="1000" placeholder="Was möchtest du nicht vergessen?" autocomplete="off" required aria-label="Gedanke"></textarea>
       <p data-ars23-status aria-live="polite">Ohne Entsperren · auf diesem Gerät Ende-zu-Ende-verschlüsselt vorgemerkt</p>
       <button type="submit" class="ars23-capture-submit">Sicher in Inbox erfassen</button>
      </form>
     </section>
     <section class="ars22-panel" id="ars22-unlock-dialog" aria-label="Compass Tresor entsperren" role="dialog" aria-modal="true" hidden>
      <div class="ars22-sheet">
       <div class="ars22-sheet-top"><span class="ars22-star" aria-hidden="true">✦</span><button type="button" class="ars22-close" data-ars22-close aria-label="Zurück zum Lockscreen">×</button></div>
       <h2 class="ars22-title">Compass entsperren</h2>
       <p class="ars22-sub">Dein persönlicher, verschlüsselter Arbeitsraum.</p>
       <div class="ars22-form-slot"></div>
      </div>
     </section>`;
    shell.style.setProperty('--ars22-bg',`url("${ASSET}")`);
    shell.style.setProperty('--ars22-desktop-bg',`url("${DESKTOP_MOONLIT}")`);
    document.body.append(shell);
    app.inert=true;
    trigger=shell.querySelector('[data-ars22-open]');
    panel=shell.querySelector('.ars22-panel');
    const captureDialog=shell.querySelector('[data-ars23-dialog]');
    const captureTrigger=shell.querySelector('[data-ars23-capture]');
    const captureForm=shell.querySelector('[data-ars23-form]');
    const captureStatus=shell.querySelector('[data-ars23-status]');
    captureTrigger.addEventListener('click',async()=>{
      captureStatus.textContent='Verschlüsselte Erfassung prüfen …';
      captureDialog.hidden=false;
      try{
        if(!await sealedCaptureReady()){
          captureStatus.textContent='Einmalig zuerst Tresor entsperren und verschlüsselten Eingangspuffer einrichten.';
          captureForm.querySelector('[type=submit]').disabled=true;
        }else{
          captureForm.querySelector('[type=submit]').disabled=false;
          captureStatus.textContent='Ohne Entsperren · nur verschlüsselt gespeichert';
        }
      }catch{captureStatus.textContent='Verschlüsselter Speicher nicht verfügbar. Bitte Tresor entsperren.';captureForm.querySelector('[type=submit]').disabled=true;}
      captureForm.elements.title.focus({preventScroll:true});
    });
    const closeCapture=()=>{captureDialog.hidden=true;captureForm.reset();captureStatus.textContent='';};
    captureDialog.querySelector('[data-ars23-close]').addEventListener('click',closeCapture);
    captureForm.addEventListener('submit',async event=>{
      event.preventDefault();const title=captureForm.elements.title.value.trim();if(!title)return;
      const button=captureForm.querySelector('[type=submit]');button.disabled=true;
      try{
        if(!await sealedCaptureReady())throw Error('Verschlüsselter Eingangspuffer noch nicht eingerichtet');
        await appendSealedCapture(title);
        // Clear all plaintext, including the input node, immediately after encrypted storage.
        closeCapture();
        captureTrigger.textContent='✓ Gesichert';
        setTimeout(()=>{if(shell)captureTrigger.innerHTML='✎ <span>Gedanke</span>';},1700);
      }catch(ex){captureStatus.textContent='Nicht gespeichert: '+String(ex.message||ex);button.disabled=false;}
    });
    trigger.addEventListener('click',()=>{
     if(!captureDialog.hidden)closeCapture();
     if(shell.classList.contains('ars28-entering'))return;
     shell.classList.add('ars28-entering');
     window.setTimeout(()=>{if(shell&&!wasOpen){displayForm();shell.classList.remove('ars28-entering');}},540);
    });
    shell.querySelector('[data-ars22-close]').addEventListener('click',dismissForm);
    // The original illustration contains the gold unlock control: keep a single
    // invisible semantic hotspot rather than painting a second button on top.
    shell.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&!captureDialog.hidden){e.preventDefault();closeCapture();return;}
      if(e.key==='Escape'&&wasOpen){e.preventDefault();dismissForm();}
      if(e.key!=='Tab'||!wasOpen)return;
      const focusables=[...panel.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href]')]
       .filter(x=>!x.closest('[hidden]')&&x.getClientRects().length);
      if(!focusables.length)return;
      const first=focusables[0],last=focusables[focusables.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
    document.documentElement.classList.add('ars22-locked');
  }

  function sync(){
    // Detection is scoped to the app's actual vault screen, NOT to a timer,
    // login-looking card, sealed capture, or page text.
    const form=app.querySelector('form#vault-form');
    if(!form){
      // A regular unlocked app render has a real "Tresor sperren" action.
      // During bootstrap the #app may still be empty: never show a fake lock.
      if(app.querySelector('[data-action="lock"]'))remove();
      return;
    }
    ensureShell();
    if(form!==activeForm){
      activeForm=form;
      // Transfer the existing, already-bound form node. Do not make a copy:
      // its real onsubmit continues to call vault.unlock/vault.create.
      panel.querySelector('.ars22-form-slot').replaceChildren(form);
      shell.querySelector('.ars22-title').textContent=form.querySelector('#passphrase-repeat')?'Lokalen Tresor einrichten':'Compass entsperren';
      if(wasOpen){panel.hidden=false;shell.classList.add('ars22-open');}
    }
  }
  observer=new MutationObserver(sync);
  // The main renderer replaces #app children. Observing only direct children
  // avoids feedback loops when the vault-form itself is moved into the sheet.
  observer.observe(app,{childList:true});
  sync();
  window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
