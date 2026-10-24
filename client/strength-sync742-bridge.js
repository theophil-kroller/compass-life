/** Compass 0.5.77.42 — guarded Vite integration after Compass .41.
 * Fixes multi-device Garmin strength assignments. No edits to cloud Worker or original Garmin data.
 */
export function strengthSync742Bridge(){
 const one=(src,from,to,label)=>{
  const found=src.split(from).length-1;
  if(found!==1)throw Error(`Compass .42 strength sync: Integrationsanker ${label} nicht eindeutig (${found}); Build abgebrochen statt Datenrisiko.`);
  return src.replace(from,to);
 };
 return {name:'compass-742-strength-e2ee-sync',enforce:'pre',transform(source,id){
  const path=id.replace(/\\/g,'/').split('?')[0];
  let s=source;
  if(path.endsWith('/client/src/main.js')){
   s=one(s,"const COMPASS_CLIENT_VERSION='0.5.77.41';","const COMPASS_CLIENT_VERSION='0.5.77.42';",'version');
   s=one(s,"s?.touchJournal||null,s?.miracleMorning||null", "s?.touchJournal||null,s?.strengthJournal||null,s?.miracleMorning||null",'detect strength changes for sync');
   s=one(s,"touchJournal:copy.touchJournal||{entries:[]},miracleMorning:ensureMorning(st)","touchJournal:copy.touchJournal||{entries:[]},strengthJournal:st.strengthJournal||{annotations:[]},miracleMorning:ensureMorning(st)",'encrypted strength snapshot');
   s=one(s,"st.touchJournal=m.touchJournal;st.feelingCheckins=m.feelingCheckins;", "st.touchJournal=m.touchJournal;st.strengthJournal=m.strengthJournal;st.feelingCheckins=m.feelingCheckins;",'apply remote strength journal');
   s=one(s,"if(action==='pj92-sync-now'){",`if(action==='str742-sync-now'){
  if(!state?.privateDeviceMirror?.key||!authToken){toast('Trainingsabgleich benötigt einen verbundenen verschlüsselten Geräteabgleich und eine Anmeldung.',true);return;}
  try{const ok=await syncPersonalJournal();toast(ok?'Krafttraining und Journale verschlüsselt abgeglichen.':'Trainingsabgleich noch nicht möglich.',!ok);}
  catch(ex){toast('Trainingsabgleich: '+ex.message,true);}
  return;
 }
 if(action==='pj92-sync-now'){`,'manual strength sync action');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/personal-journal-v5692.js')){
   s=one(s,"import {mergePeopleDirectory} from './people-sync-v57719.js';","import {mergePeopleDirectory} from './people-sync-v57719.js';\nimport {mergeStrengthJournal} from './strength-device-sync-v57742.js';",'merge import');
   s=one(s,"touchJournal:mergeTouchRecords(lc.touchJournal,rc.touchJournal),", "touchJournal:mergeTouchRecords(lc.touchJournal,rc.touchJournal),\n  strengthJournal:mergeStrengthJournal(lc.strengthJournal,rc.strengthJournal),",'merge strength assignments by session');
   return {code:s,map:null};
  }
  if(path.endsWith('/client/src/strength-editor-v57732.js')){
   s=one(s,'<small>Lokales Trainingsjournal</small>','<small>Verschlüsselter Geräteabgleich möglich</small>','device sync description');
   s=one(s,'<p class="str732-help">Die Muskelkarte wird aus den von dir zugeordneten Übungen berechnet;',`<p class="str742-sync-hint">\${state?.privateDeviceMirror?.key?'Geräteabgleich verbunden. Übungszuordnungen bleiben bei Änderungen auf beiden Geräten erhalten.':'Nur lokal: Bitte den verschlüsselten Geräteabgleich in System einrichten, damit die Übungszuordnungen auch am Handy erscheinen.'}</p><button type="button" class="secondary-btn" data-action="str742-sync-now">↻ Übungen zwischen Geräten abgleichen</button><p class="str732-help">Die Muskelkarte wird aus den von dir zugeordneten Übungen berechnet;`,'sync trigger in training editor');
   return {code:s,map:null};
  }
  return null;
 }};
}
