/** Compass .59.33: opt-in contact recovery guidance, rendered only on empty People screen.
 * No network requests, no profile copying, no secret reads and no implicit consent.
 */
export function peopleRecoveryStep5933({count=0,mirrorReady=false,enabled=false,authenticated=false,online=true,syncStatus='lokal'}={}){
 if(count>0)return {kind:'ready',title:'Kontaktprofile auf diesem Gerät vorhanden.',detail:'',action:null};
 if(!mirrorReady)return {kind:'setup',title:'Die Kontakte liegen wahrscheinlich noch auf deinem anderen Gerät.',
  detail:'Richte auf Desktop und Handy den verschlüsselten Geräteabgleich mit derselben eigenen Synchronisierungs-Passphrase ein. Bestehende Kontakte bleiben erhalten.',
  action:{id:'system',kind:'tab',label:'Geräteabgleich einrichten'}};
 if(!enabled)return {kind:'consent',title:'Kontaktprofile sind auf diesem Gerät noch nicht freigegeben.',
  detail:'Aktiviere den freiwilligen, Ende-zu-Ende-verschlüsselten Kontaktabgleich ausdrücklich auf Desktop UND Handy. Persönliche Kontaktnotizen bleiben verschlüsselt.',
  action:{id:'people-sync719-toggle',kind:'action',label:'Kontakt-Sync hier aktivieren'}};
 if(!authenticated)return {kind:'signin',title:'Der Kontaktabgleich benötigt eine aktive Compass-Anmeldung.',
  detail:'Melde dich mit demselben Compass-Konto wie am Desktop an. Der Kontaktabgleich verwendet außerdem dieselbe Sync-Passphrase auf beiden Geräten.',
  action:{id:'system',kind:'tab',label:'Anmeldung prüfen'}};
 if(!online)return {kind:'offline',title:'Deine Kontakte sind auf diesem Gerät noch nicht lokal verfügbar.',
  detail:'Sobald du wieder online bist, kannst du den verschlüsselten Kontaktabgleich auslösen. Es wird nichts automatisch angelegt.',
  action:null};
 return {kind:syncStatus==='fehler'?'failed':syncStatus==='ok'?'empty-remote':'sync',
  title:syncStatus==='ok'?'Journal-Abgleich bestätigt, aber noch keine Kontakte übernommen.':syncStatus==='fehler'?'Kontaktabgleich noch nicht erfolgreich.':'Kontaktabgleich ist aktiviert.',
  detail:syncStatus==='ok'?'Prüfe am Desktop, ob dort Kontakte vorhanden sind, die Kontaktfreigabe aktiviert ist und der verschlüsselte Abgleich erfolgreich war. Beide Geräte benötigen denselben Schlüssel.':'Starte den verschlüsselten Kontaktabgleich. Wenn die Liste leer bleibt, prüfe auf dem Desktop die Kontaktfreigabe und die Sync-Passphrase.',
  action:{id:'people-sync719-now',kind:'action',label:'Kontakte jetzt abgleichen'}};
}
export function peopleRecoveryPanel5933(options={}){
 const step=peopleRecoveryStep5933(options);
 if(step.kind==='ready')return '';
 const button=step.action?`<button type="button" class="primary-btn p5933-recovery-btn" data-${step.action.kind==='tab'?'tab':'action'}="${step.action.id}">${step.action.label}</button>`:'';
 return `<div class="p5933-recovery" aria-label="Kontaktprofile auf diesem Gerät wieder verfügbar machen"><div class="p5933-recovery-head"><strong>Menschen auf diesem Gerät</strong><small>0 Profile · nur dieser Tresor</small></div><p><strong>${step.title}</strong></p><p>${step.detail}</p><div class="p5933-recovery-actions">${button}<span>Keine Kontakte werden automatisch veröffentlicht oder neu angelegt.</span></div></div>`;
}
