/** Compass 0.5.77.59.40.2: fix the missing Today context controls.
 * Builds on the entire .40.1 bridge chain; no schema, Worker, or Vault rewrite.
 */
export function compass59402LocationPickerRelease(){
 const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw Error(`Compass .40.2 ${label}: expected one anchor, got ${n}`);return s.replace(a,b);};
 return {name:'compass-59402-location-picker',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  if(!path.endsWith('/client/src/main.js')&&!path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return null;
  let s=once(source,'Build 0.5.77.59.40.1','Build 0.5.77.59.40.2','visible build badge');
  if(path.endsWith('/client/src/ars-vivendi-lock-v5775922.js'))return {code:s,map:null};
  s=once(s,"const COMPASS_CLIENT_VERSION='0.5.77.59.40.1';","const COMPASS_CLIENT_VERSION='0.5.77.59.40.2';",'client version');
  s=once(s,"import {deadlineIntelligence}","import {locationPicker42} from './location-picker-v57759402.js';\nimport './location-picker-v57759402.css';\nimport {deadlineIntelligence}",'imports');
  // .39/.40 added a full-width panel, but on the real mobile route it wasn't discoverable.
  // Keep the existing recommendation panel (lazy) and move controls into the pin menu.
  s=once(s,'${locationContextPanel39(state,nextActions(state))}','', 'remove redundant location strip');
  s=once(s,'<nav class="daynav38" aria-label="Tag auswählen">','<div class="ctx42-date-row"><nav class="daynav38" aria-label="Tag auswählen">','Today date navigation wrapper');
  s=once(s,'aria-label="Nächster Tag">›</button></nav>`:\'\'}','aria-label="Nächster Tag">›</button></nav>${locationPicker42(state)}</div>`:\'\'}','Today pin after date nav');
  // Explicitly allow resetting a manual choice to Unknown.
  s=once(s,"if(!['home','work','away'].includes(id)||!state)return;","if(!['home','work','away','unknown'].includes(id)||!state)return;",'manual context choices');
  // Native details works with tap/keyboard. Desktop pointer hover opens without a click;
  // binding is attached to the fresh node after each Today paint, never global polling.
  s=once(s,"app.innerHTML=html;bind();if(tab==='today'&&state)ctx39ScheduleAuto();", "app.innerHTML=html;bind();if(tab==='today'&&state){ctx42BindHover();ctx39ScheduleAuto();}",'Today menu binder');
  s=once(s,'let ctx39Running=false,ctx39LastAttempt=0;',`function ctx42BindHover(){
 const menu=app.querySelector('.ctx42-menu');if(!menu)return;
 // PWA on Android uses the summary's native tap toggle; desktop uses hover.
 if(window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches){
  menu.addEventListener('pointerenter',()=>{menu.open=true;});
  menu.addEventListener('pointerleave',ev=>{if(!menu.contains(ev.relatedTarget))menu.open=false;});
 }
 menu.addEventListener('focusout',ev=>{if(!menu.contains(ev.relatedTarget))menu.open=false;});
}
let ctx39Running=false,ctx39LastAttempt=0;`,'hover wiring');
  return {code:s,map:null};
 }};
}
