/** Ars Vivendi .59.22: visual gate for the EXISTING Compass encrypted Vault.
 * This module never sees, stores, duplicates or verifies the passphrase.
 * The actual #vault-form and its onsubmit handler remain the source of truth.
 * No vault/crypto, sync, project, or authentication code is replaced.
 */
import './ars-vivendi-lock-v5775922.css';
import './compass-5928-lux.css';

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
       <div class="ars28-version">Compass Life · Build 0.5.77.59.40.25.8</div>
       <button class="ars22-tap" type="button" data-ars22-open aria-controls="ars22-unlock-dialog" aria-expanded="false" aria-label="Compass Tresor entsperren"></button>
     </div>
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
    trigger.addEventListener('click',()=>{
     if(shell.classList.contains('ars28-entering'))return;
     shell.classList.add('ars28-entering');
     window.setTimeout(()=>{if(shell&&!wasOpen){displayForm();shell.classList.remove('ars28-entering');}},540);
    });
    shell.querySelector('[data-ars22-close]').addEventListener('click',dismissForm);
    // The original illustration contains the gold unlock control: keep a single
    // invisible semantic hotspot rather than painting a second button on top.
    shell.addEventListener('keydown',e=>{
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
