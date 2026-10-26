/** Compass .59.39 Context Intelligence – on-device, permission-led geofencing.
 * Never requests permission, watches GPS, uploads coordinates or stores location trails.
 * Only explicitly enrolled home/work coordinates live in the encrypted vault.
 */
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validNumber=n=>typeof n==='number'&&Number.isFinite(n);
const labels={home:'Zuhause',work:'Arbeit',away:'Unterwegs',unknown:'Unbekannt'};
const names={home:'⌂',work:'▣',away:'↗',unknown:'◎'};
export function validFix39(fix){return !!fix&&validNumber(fix.latitude)&&fix.latitude>=-90&&fix.latitude<=90&&validNumber(fix.longitude)&&fix.longitude>=-180&&fix.longitude<=180&&validNumber(fix.accuracy)&&fix.accuracy>=0&&fix.accuracy<50000;}
export function distanceMeters39(a,b){
 const rad=x=>x*Math.PI/180,dy=rad(b.latitude-a.latitude),dx=rad(b.longitude-a.longitude);
 const k=Math.sin(dy/2)**2+Math.cos(rad(a.latitude))*Math.cos(rad(b.latitude))*Math.sin(dx/2)**2;
 return 6371000*2*Math.asin(Math.min(1,Math.sqrt(k)));
}
export function zone39(fix,radius=300,updatedAt=''){
 if(!validFix39(fix))throw Error('Ungenaue oder ungültige Ortsbestimmung.');
 const r=Number(radius);
 if(!Number.isFinite(r)||r<100||r>1500)throw Error('Ortsradius muss zwischen 100 und 1.500 Metern liegen.');
 return {latitude:fix.latitude,longitude:fix.longitude,radius:r,updatedAt};
}
export function locationSettings39(state){
 const source=state?.locationContext39||{},zones={};
 for(const key of ['home','work']){
  const z=source.zones?.[key];
  if(z&&validNumber(z.latitude)&&Math.abs(z.latitude)<=90&&validNumber(z.longitude)&&Math.abs(z.longitude)<=180&&Number(z.radius)>=100&&Number(z.radius)<=1500)zones[key]=z;
 }
 return {mode:source.mode==='auto'?'auto':'manual',manual:['home','work','away','unknown'].includes(source.manual)?source.manual:'unknown',zones,last:source.last||null};
}
/** Only return a confident zone. Accuracy overlapping its boundary is unknown. */
export function classifyPosition39(fix,zones={}){
 if(!validFix39(fix))return {kind:'unknown',reason:'invalid'};
 const known=['home','work'].filter(k=>zones[k]&&Number.isFinite(zones[k].radius));
 if(!known.length)return {kind:'unknown',reason:'no-zones'};
 const ranked=known.map(k=>({kind:k,distance:distanceMeters39(fix,zones[k]),radius:zones[k].radius})).sort((a,b)=>a.distance-b.distance);
 const match=ranked.filter(x=>x.distance+fix.accuracy<=x.radius);
 if(match.length>1)return {kind:'unknown',reason:'overlapping-zones'};
 if(match.length===1)return {kind:match[0].kind,reason:'inside'};
 if(ranked.some(x=>x.distance-fix.accuracy<=x.radius))return {kind:'unknown',reason:'uncertain'};
 return {kind:'away',reason:'outside'};
}
export function effectiveContext39(state,now=Date.now()){
 const cfg=locationSettings39(state);
 if(cfg.mode==='manual')return {kind:cfg.manual,mode:'manual',stale:false};
 const last=cfg.last;
 if(!last||!['home','work','away','unknown'].includes(last.kind)||!Number.isFinite(Date.parse(last.checkedAt)))return {kind:'unknown',mode:'auto',stale:true};
 const age=now-Date.parse(last.checkedAt);
 return age>=0&&age<=2*3600*1000?{kind:last.kind,mode:'auto',stale:false,checkedAt:last.checkedAt,reason:last.reason,accuracy:last.accuracy}:{kind:'unknown',mode:'auto',stale:true};
}
const aliases={home:new Set(['home','zuhause','daheim','wohnung','heim']),work:new Set(['work','arbeit','büro','buero','office','uni','tu','tu-graz']),away:new Set(['away','unterwegs','mobil','errands','erledigungen','telefon','einkaufen'])};
export function contextTasks39(tasks=[],kind='unknown'){
 const terms=aliases[kind];if(!terms)return [];
 return tasks.filter(t=>!t?.completed&&!t?.archived&&t.workflow!=='hold'&&(t.contextTags||[]).some(x=>terms.has(String(x||'').replace(/^@/,'').toLocaleLowerCase('de')))).slice(0,3);
}
export function contextLinks39(kind){
 if(kind==='home')return [['next','Aufgaben'],['insights','Routinen'],['forecast','Kalender']];
 if(kind==='work')return [['next','Next Actions'],['people','Agenden'],['forecast','Termine']];
 if(kind==='away')return [['next','Next Actions'],['inbox','Schnellerfassung'],['forecast','Nächste Termine']];
 return [['next','Next Actions'],['forecast','Forecast'],['people','Menschen']];
}
/** Tiny always-available row, expansive preferences are intentionally collapsed. */
export function locationContextPanel39(state,tasks=[]){
 const cfg=locationSettings39(state),effective=effectiveContext39(state),kind=effective.kind,related=contextTasks39(tasks,kind);
 const short=effective.mode==='manual'?'manuell':effective.stale?'kein aktueller Standort':'zuletzt erkannt';
 const zones=['home','work'].map(key=>{
  const z=cfg.zones[key];return `<div class="ctx39-zone"><span>${key==='home'?'⌂ Zuhause':'▣ Arbeit'} <small>${z?`Ortszone · ${Number(z.radius)} m`:'Noch nicht festgelegt'}</small></span><button type="button" data-action="ctx39-set-zone" data-id="${key}" title="Aktuellen Standort als ${labels[key]} speichern">${z?'Neu setzen':'Hier festlegen'}</button>${z?`<button type="button" data-action="ctx39-clear-zone" data-id="${key}" aria-label="Ortszone ${labels[key]} entfernen" title="Ortszone entfernen">×</button>`:''}</div>`;
 }).join('');
 const links=contextLinks39(kind).map(([id,label])=>`<button type="button" data-action="ctx39-go" data-id="${id}">${h(label)}</button>`).join('');
 return `<section class="ctx39" aria-label="Standortkontext und passende Schnellzugriffe"><div class="ctx39-main"><span class="ctx39-context" title="${effective.mode==='manual'?'Manuell gewählter Kontext':'Letzte Standortbestimmung; keine Dauerüberwachung'}">${names[kind]} <strong>${labels[kind]}</strong><small>${short}</small></span><nav aria-label="Kontextabhängige Navigation" class="ctx39-links">${links}</nav><details class="ctx39-settings"><summary title="Kontext und Ortszonen einstellen" aria-label="Standortkontext einstellen">⚙ <span>Kontext</span></summary><div class="ctx39-options"><p>Kontext wird nur auf diesem Gerät gespeichert. Standortzugriff erfolgt nach deiner Freigabe; keine Bewegungsverläufe, keine Cloudübertragung der Ortszonen.</p><div class="ctx39-manual" role="group" aria-label="Kontext manuell wählen">${['home','work','away'].map(k=>`<button type="button" data-action="ctx39-manual" data-id="${k}" aria-pressed="${cfg.mode==='manual'&&cfg.manual===k}">${labels[k]}</button>`).join('')}</div><button type="button" class="ctx39-primary" data-action="ctx39-auto" aria-pressed="${cfg.mode==='auto'}">${cfg.mode==='auto'?'✓ Automatische Prüfung aktiviert':'Automatische Prüfung aktivieren'}</button><button type="button" data-action="ctx39-check">Standort jetzt prüfen</button><small>Bei aktivierter Automatik wird höchstens beim Öffnen von „Heute“ und frühestens nach 30 Minuten geprüft; kein GPS im Hintergrund.</small>${zones}<label class="ctx39-radius">Radius neuer Ortszonen <select id="ctx39-radius" aria-label="Ortsradius"><option value="150">150 m</option><option value="300" selected>300 m</option><option value="500">500 m</option><option value="750">750 m</option><option value="1000">1.000 m</option></select></label></div></details></div>${related.length?`<div class="ctx39-tasks"><small>Passend hier:</small>${related.map(t=>`<button type="button" data-action="ctx39-task" data-id="${h(t.id)}">${h(t.title)}</button>`).join('')}</div>`:''}</section>`;
}
