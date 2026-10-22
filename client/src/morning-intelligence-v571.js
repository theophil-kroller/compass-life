/** Compass 0.5.71: local, deterministic Morning Intelligence. All personal content
 * lives inside the encrypted Vault's miracleMorning object, never public metadata. */
import {MORNING_STEPS,ensureMorning} from './miracle-morning-v570.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateKey=value=>{const d=new Date(value);return Number.isFinite(d.getTime())?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`:'';};
const dateLabel=value=>{const d=new Date(value);return Number.isFinite(d.getTime())?d.toLocaleDateString('de-AT',{day:'2-digit',month:'short',year:'numeric'}):'';};
const prettyDuration=seconds=>`${Math.round(Math.max(0,Number(seconds)||0)/60)} Min.`;
export const MORNING_VISION_EMOJIS=['🌄','🌿','🧭','💡','🏡','❤️','🎓','🌊','✨'];
export function validMorningVision(source,now=new Date().toISOString()){
 const text=String(source?.text||'').trim().slice(0,1000);if(!text)throw Error('Bitte einen kurzen Zielgedanken eingeben.');
 const title=String(source?.title||'').trim().slice(0,100)||'Mein Ziel';
 const imageData=typeof source?.imageData==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(source.imageData)&&source.imageData.length<150000?source.imageData:'';
 return {id:String(source?.id||crypto.randomUUID()),title,text,emoji:MORNING_VISION_EMOJIS.includes(source?.emoji)?source.emoji:'🌄',imageData,goalId:String(source?.goalId||'').slice(0,120),updatedAt:now};
}
export function saveMorningVision(state,raw,now=new Date().toISOString()){
 const morning=ensureMorning(state);const vision=validMorningVision(raw,now);
 const visions=morning.config.visions||[];const idx=visions.findIndex(v=>v.id===vision.id);
 if(idx>=0)visions[idx]=vision;else visions.push(vision);
 morning.config.visions=visions.slice(0,30);morning.config.updatedAt=now;
 return vision;
}
export function removeMorningVision(state,id,now=new Date().toISOString()){
 const morning=ensureMorning(state);morning.config.visions=morning.config.visions.filter(v=>v.id!==id);morning.config.updatedAt=now;
}
export function addMorningAffirmation(state,text,now=new Date().toISOString()){
 const morning=ensureMorning(state);const value=String(text||'').trim().slice(0,260);
 if(!value)throw Error('Bitte eine Affirmation eingeben.');
 if(morning.config.affirmations.includes(value))throw Error('Diese Affirmation ist bereits vorhanden.');
 if(morning.config.affirmations.length>=30)throw Error('Maximal 30 Affirmationen.');
 morning.config.affirmations=[...morning.config.affirmations,value];morning.config.updatedAt=now;
}
export function removeMorningAffirmation(state,index,now=new Date().toISOString()){
 const morning=ensureMorning(state);if(!Number.isInteger(index)||index<0||index>=morning.config.affirmations.length)return;
 morning.config.affirmations=morning.config.affirmations.filter((_,i)=>i!==index);morning.config.updatedAt=now;
}
export function putMorningNote(state,raw,now=new Date().toISOString()){
 const morning=ensureMorning(state);if(!Array.isArray(morning.notes))morning.notes=[];
 const text=String(raw?.text||'').slice(0,12000);
 const id=String(raw?.id||crypto.randomUUID());const previous=morning.notes.find(row=>row.id===id);
 const note={id,createdAt:previous?.createdAt||raw?.createdAt||now,updatedAt:now,day:String(raw?.day||previous?.day||dateKey(now)),sessionId:String(raw?.sessionId??previous?.sessionId??''),prompt:String(raw?.prompt??previous?.prompt??'').slice(0,200),text,deleted:false};
 if(previous)Object.assign(previous,note);else morning.notes.push(note);
 return note;
}
export function removeMorningNote(state,id,now=new Date().toISOString()){
 const morning=ensureMorning(state);if(!Array.isArray(morning.notes))morning.notes=[];
 const row=morning.notes.find(x=>x.id===id);if(row){row.deleted=true;row.updatedAt=now;}
}
export function sessionToMorningNote(state,session,now=session?.finishedAt||new Date().toISOString()){
 const text=String(session?.note||'').trim();if(!text)return null;
 return putMorningNote(state,{id:'session-'+session.id,sessionId:session.id,day:session.day||dateKey(session.startedAt),text,prompt:ensureMorning(state).config.journalPrompt,createdAt:session.finishedAt||now},now);
}
export function morningInsightsModel(state,days=30,now=new Date()){
 const morning=state?.miracleMorning||{};const max=Math.max(1,Math.min(365,Math.round(Number(days)||30)));
 const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-max+1);
 const end=new Date(now);end.setHours(23,59,59,999);
 const rows=(Array.isArray(morning.sessions)?morning.sessions:[]).filter(s=>s?.finishedAt&&new Date(s.finishedAt)>=start&&new Date(s.finishedAt)<=end);
 const uniqueDates=new Set(rows.map(s=>dateKey(s.finishedAt)).filter(Boolean));
 const timeline=[];for(let i=max-1;i>=0;i--){const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()-i);const day=dateKey(d);timeline.push({day,complete:uniqueDates.has(day)});}
 let streak=0;for(let i=timeline.length-1;i>=0;i--){if(!timeline[i].complete){if(i===timeline.length-1)continue;break;}streak++;}
 const performedSeconds=rows.reduce((sum,s)=>sum+(s.steps||[]).reduce((acc,step)=>acc+(step.skipped?0:Math.max(0,Number(step.seconds)||0)),0),0);
 const steps=MORNING_STEPS.map(step=>({id:step.id,title:step.title,emoji:step.emoji,done:rows.filter(s=>(s.steps||[]).some(x=>x.id===step.id&&!x.skipped)).length,skipped:rows.filter(s=>(s.steps||[]).some(x=>x.id===step.id&&x.skipped)).length,ratio:rows.length?Math.round(100*rows.filter(s=>(s.steps||[]).some(x=>x.id===step.id&&!x.skipped)).length/rows.length):0}));
 return {days:max,entries:rows.length,daysWithRoutine:uniqueDates.size,streak,averageMinutes:rows.length?Math.round(performedSeconds/60/rows.length):0,performedSeconds,steps,timeline,coverage:Math.round(100*uniqueDates.size/max)};
}
const tabs=[['routine','Routine'],['create','Gestalten'],['insights','Insights']];
export function morningIntelligenceHeader(view='routine'){
 return `<div class="mm571-nav"><div class="mm571-title"><small>COMPASS · MORNING INTELLIGENCE</small><h2>Miracle Morning</h2><p>Dein Morgen. Deine Ausrichtung.</p></div><nav class="mm571-tabs" aria-label="Miracle Morning Ansichten">${tabs.map(([v,label])=>`<button type="button" data-action="mm571-view" data-id="${v}" class="${view===v?'active':''}" aria-pressed="${view===v}">${label}</button>`).join('')}</nav></div>`;
}
export function morningCreateView(state,{goals=[],journalEditingId='',journalDraft=null}={}){
 const morning=ensureMorning(state),config=morning.config,notes=(morning.notes||[]).filter(x=>!x.deleted).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
 const selected=journalEditingId?(notes.find(n=>n.id===journalEditingId)||null):null;
 const current=journalDraft&&journalDraft.id===journalEditingId?journalDraft:selected;
 return `<div class="mm571-builder">
 <div class="mm571-builder-grid"><section class="mm571-panel"><div class="mm571-panel-head"><span class="mm571-panel-symbol">💬</span><div><h3>Meine Affirmationen</h3><p>Persönliche Sätze, die sich für dich stimmig anfühlen.</p></div><span class="mm571-count">${config.affirmations.length}</span></div>
 <div class="mm571-affirmation-list">${config.affirmations.length?config.affirmations.map((item,i)=>`<div class="mm571-affirmation"><span>„${esc(item)}“</span><button type="button" data-action="mm571-affirmation-remove" data-id="${i}" aria-label="Affirmation entfernen" title="Entfernen">×</button></div>`).join(''):'<p class="muted-line">Noch keine Affirmationen. Beginne mit einem Satz.</p>'}</div>
 <form id="mm571-affirmation-form" class="mm571-form-row"><input name="affirmation" maxlength="260" placeholder="Meine neue Affirmation …" aria-label="Neue Affirmation" required/><button class="primary-btn" type="submit">Hinzufügen</button></form></section>
 <section class="mm571-panel"><div class="mm571-panel-head"><span class="mm571-panel-symbol">🌄</span><div><h3>Ziele & Visualisierungen</h3><p>Vorstellung und nächster Schritt statt eines vollen Tageskalenders.</p></div><span class="mm571-count">${(config.visions||[]).length}</span></div>
 <div class="mm571-visions">${(config.visions||[]).map(v=>`<article class="mm571-vision">${v.imageData?`<img class="mm571-vision-image" src="${esc(v.imageData)}" alt="Zielbild"/>`:`<span class="mm571-vision-symbol">${esc(v.emoji)}</span>`}<div><strong>${esc(v.title)}</strong><p>${esc(v.text)}</p></div><button type="button" data-action="mm571-vision-remove" data-id="${esc(v.id)}" title="Zielkarte entfernen" aria-label="Zielkarte entfernen">×</button></article>`).join('')}${!(config.visions||[]).length?'<p class="muted-line">Noch keine Zielkarten.</p>':''}</div>
 <form id="mm571-vision-form" class="mm571-vision-form"><div class="mm571-vision-fields"><label>Symbol<select name="emoji">${MORNING_VISION_EMOJIS.map(e=>`<option value="${e}">${e}</option>`).join('')}</select></label><label>Titel<input name="title" maxlength="100" required placeholder="Mein Vorhaben"/></label></div><label>Wie möchte ich handeln?<textarea name="text" maxlength="1000" rows="2" required placeholder="Ich begegne … / Mein nächster Schritt …"></textarea></label><label>Eigenes Zielbild (optional, bleibt verschlüsselt)<input type="file" name="image" accept="image/png,image/jpeg,image/webp"/></label><label>Bestehendes Ziel (optional)<select name="goalId"><option value="">Ohne Verknüpfung</option>${goals.map(g=>`<option value="${esc(g.id)}">${esc(g.title)}</option>`).join('')}</select></label><button class="secondary-btn" type="submit">Zielkarte hinzufügen</button></form></section></div>
 <div class="mm571-builder-grid"><section class="mm571-panel"><div class="mm571-panel-head"><span class="mm571-panel-symbol">✍️</span><div><h3>Scribing · Mein Journal</h3><p>Schreiben oder mit deiner Tastatur diktieren. Verschlüsseltes Autosave.</p></div></div>
 <div class="mm571-journal-list"><button type="button" class="secondary-btn" data-action="mm571-note-new">+ Neuer Eintrag</button>${notes.slice(0,25).map(n=>`<button type="button" class="mm571-note-row ${journalEditingId===n.id?'selected':''}" data-action="mm571-note-open" data-id="${esc(n.id)}"><small>${esc(n.day)}</small><span>${esc(n.text.slice(0,75)||'Neuer Eintrag')}</span></button>`).join('')}</div>
 ${current?`<div class="mm571-editor"><div class="mm571-editor-head"><strong>${esc(current.day)}</strong><small id="mm571-autosave-status">Gespeichert</small></div><textarea id="mm571-journal-text" aria-label="Scribing Journaleintrag" rows="6" maxlength="12000" placeholder="Was bewegt mich heute? …">${esc(current.text)}</textarea><div class="mm571-editor-actions"><button type="button" class="secondary-btn" data-action="mm571-note-close">Schließen</button><button type="button" class="secondary-btn" data-action="mm571-note-delete" data-id="${esc(current.id)}">Löschen</button></div></div>`:''}
 </section><section class="mm571-panel"><div class="mm571-panel-head"><span class="mm571-panel-symbol">⚙️</span><div><h3>Meine Routine anpassen</h3><p>Zeiten, Bewegung, Reading und Reflexionsfrage.</p></div></div>
 <form id="mm571-config-form" class="mm571-config-form"><div class="mm571-duration-grid">${MORNING_STEPS.map(s=>`<label>${s.emoji} ${esc(s.title)}<input type="number" name="duration-${s.id}" min="1" max="90" value="${config.durations[s.id]}" required/></label>`).join('')}</div><label>Reading · aktuelles Buch<input name="readingBook" maxlength="140" value="${esc(config.readingBook)}" placeholder="Mein aktuelles Buch …"/></label><label>Exercise · Übungen (eine pro Zeile)<textarea rows="4" name="exercises" maxlength="1600">${esc(config.exercises.join('\n'))}</textarea></label><label>Journaling-Frage<input name="journalPrompt" maxlength="200" value="${esc(config.journalPrompt)}"/></label><button type="submit" class="primary-btn">Routine speichern</button></form></section></div>
 </div>`;
}
export function morningInsightsView(state,{days=30}={}){
 const stats=morningInsightsModel(state,days);
 return `<section class="mm571-insights"><div class="mm571-insights-heading"><div><h3>Deine Morgen im Überblick</h3><p>Dokumentierte Routinen – kein Sollwert und keine Bewertung.</p></div><div class="mm571-periods">${[7,30,90].map(n=>`<button type="button" data-action="mm571-period" data-id="${n}" class="${days===n?'active':''}">${n} Tage</button>`).join('')}</div></div>
 <div class="mm571-metrics"><article><strong>${stats.entries}</strong><small>Routinen</small></article><article><strong>${stats.averageMinutes} Min.</strong><small>Ø Dauer</small></article><article><strong>${stats.streak}</strong><small>Aktuelle Serie</small></article><article><strong>${stats.daysWithRoutine}/${stats.days}</strong><small>Tage dokumentiert</small></article></div>
 <div class="mm571-insights-layout"><section class="mm571-panel"><h3>Welche Schritte habe ich gemacht?</h3><p class="muted-line">Anteil der aufgezeichneten Routinen mit durchgeführtem Schritt.</p>${stats.steps.map(step=>`<div class="mm571-step-bar"><div><span>${step.emoji} ${esc(step.title)}</span><small>${step.done}/${stats.entries} · ${step.ratio}%</small></div><div class="mm571-track"><span style="width:${step.ratio}%"></span></div></div>`).join('')}${!stats.entries?'<p class="muted-line">Starte deine erste Routine, um hier echte Werte zu sehen.</p>':''}</section><section class="mm571-panel"><h3>Dein Verlauf</h3><p class="muted-line">Grün = dokumentierte Routine; leer = nicht erfasst.</p><div class="mm571-heatmap">${stats.timeline.map(day=>`<span title="${day.day}" class="${day.complete?'done':''}" aria-label="${day.day}: ${day.complete?'erfasst':'kein Eintrag'}"></span>`).join('')}</div><small class="mm571-footnote">Eine fehlende Aufzeichnung sagt nichts darüber aus, ob du trotzdem Teile der Routine gemacht hast.</small><div class="mm571-insight-note"><strong>Zusammenhänge später prüfen</strong><p>Vergleiche Morning Routine, Schlaf und Gefühls-Check-ins erst, wenn ausreichend gemeinsame Tage dokumentiert sind. Keine automatische Kausalbehauptung.</p></div></section></div>
 </section>`;
}
