/** Compass 0.5.70 – Miracle Morning. Pure data logic; personal text never enters public session metadata. */
export const MORNING_STEPS=[
 {id:'silence',letter:'S',title:'Silence',de:'Stille',emoji:'🧘',minutes:5,detail:'Atme ruhig. Sitze oder beobachte, was gerade da ist.'},
 {id:'affirmations',letter:'A',title:'Affirmations',de:'Affirmationen',emoji:'💬',minutes:3,detail:'Lies oder sprich deine eigenen, glaubwürdigen Affirmationen.'},
 {id:'visualization',letter:'V',title:'Visualization',de:'Visualisierung',emoji:'🌄',minutes:3,detail:'Stell dir vor, wie du deine nächsten Schritte gehst.'},
 {id:'exercise',letter:'E',title:'Exercise',de:'Bewegung',emoji:'🏋️',minutes:10,detail:'Eine kurze, ruhige Aktivierung. Technik geht vor Tempo.'},
 {id:'reading',letter:'R',title:'Reading',de:'Lesen',emoji:'📖',minutes:10,detail:'Öffne dein Buch. Der Zeitstand wird beim Zurückkehren berechnet.'},
 {id:'scribing',letter:'S',title:'Scribing',de:'Schreiben',emoji:'✍️',minutes:5,detail:'Schreibe oder diktiere, was dich heute bewegt.'}
];
export const MORNING_EXERCISES=[
 'Kurzhantel-Rudern','Schulterdrücken mit Kurzhanteln','Bizepscurls mit Kurzhanteln','Ab Wheel (kontrolliert, kleiner Bewegungsradius)'
];
export const MORNING_PRESETS={quick:[1,1,1,1,1,1],standard:[5,3,3,10,10,5],long:[10,5,5,15,15,10]};
const iso=s=>typeof s==='string'&&Number.isFinite(Date.parse(s));
export const defaultMorningConfig=()=>({durations:Object.fromEntries(MORNING_STEPS.map(s=>[s.id,s.minutes])),affirmations:[],visualization:'',goalId:'',exercises:MORNING_EXERCISES.slice(),readingBook:'',journalPrompt:'Wofür möchte ich heute Raum schaffen?',updatedAt:new Date().toISOString()});
export function normalizeMorningConfig(cfg){
 const raw=cfg&&typeof cfg==='object'?cfg:{};
 const standard=defaultMorningConfig();
 return {
  durations:Object.fromEntries(MORNING_STEPS.map(step=>{const n=Number(raw.durations?.[step.id]);return [step.id,Number.isInteger(n)&&n>=1&&n<=90?n:standard.durations[step.id]];})),
  affirmations:(Array.isArray(raw.affirmations)?raw.affirmations:[]).map(s=>String(s||'').trim().slice(0,260)).filter(Boolean).slice(0,30),
  visions:(Array.isArray(raw.visions)?raw.visions:[]).filter(v=>v&&typeof v==='object'&&String(v.text||'').trim()).slice(0,30).map(v=>({id:String(v.id||''),title:String(v.title||'Mein Ziel').slice(0,100),text:String(v.text||'').slice(0,1000),emoji:String(v.emoji||'🌄').slice(0,6),imageData:typeof v.imageData==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(v.imageData)&&v.imageData.length<150000?v.imageData:'',goalId:String(v.goalId||'').slice(0,120),updatedAt:String(v.updatedAt||'')})),
  visualization:String(raw.visualization||'').trim().slice(0,1200),goalId:String(raw.goalId||'').slice(0,120),
  exercises:(Array.isArray(raw.exercises)?raw.exercises:MORNING_EXERCISES).map(x=>String(x||'').trim().slice(0,120)).filter(Boolean).slice(0,12),
  readingBook:String(raw.readingBook||'').trim().slice(0,140),
  journalPrompt:String(raw.journalPrompt||standard.journalPrompt).trim().slice(0,200),
  updatedAt:iso(raw.updatedAt)?raw.updatedAt:standard.updatedAt
 };
}
export function ensureMorning(state){
 if(!state.miracleMorning||typeof state.miracleMorning!=='object')state.miracleMorning={config:defaultMorningConfig(),sessions:[]};
 if(!Array.isArray(state.miracleMorning.sessions))state.miracleMorning.sessions=[];
 if(!Array.isArray(state.miracleMorning.notes))state.miracleMorning.notes=[];
 // Existing v0.5.70 Scribing text remains discoverable in the new journal.
 for(const session of state.miracleMorning.sessions){
  if(!session?.id||!session?.finishedAt||!String(session.note||'').trim())continue;
  const id='session-'+session.id;
  if(!state.miracleMorning.notes.some(note=>note.id===id))state.miracleMorning.notes.push({id,sessionId:session.id,text:String(session.note).slice(0,12000),day:session.day||session.finishedAt.slice(0,10),prompt:'',createdAt:session.finishedAt,updatedAt:session.updatedAt||session.finishedAt,deleted:false});
 }
 state.miracleMorning.config=normalizeMorningConfig(state.miracleMorning.config);
 return state.miracleMorning;
}
export function newMorningSession(durations=null,now=new Date().toISOString(),id=crypto.randomUUID()){
 return {id,startedAt:now,updatedAt:now,stepIndex:0,status:'idle',elapsedSeconds:0,stepStartedAt:'',
  durations:Object.fromEntries(MORNING_STEPS.map((step,i)=>[step.id,Number(durations?.[step.id]||durations?.[i]||step.minutes)])),
  steps:[],note:'',finishedAt:''};
}
export function elapsedStepSeconds(session,now=new Date().toISOString()){
 const elapsed=Math.max(0,Math.floor(Number(session?.elapsedSeconds||0)));
 return elapsed+(session?.status==='running'&&iso(session.stepStartedAt)?Math.max(0,Math.floor((Date.parse(now)-Date.parse(session.stepStartedAt))/1000)):0);
}
export function transitionMorning(session,action,now=new Date().toISOString()){
 if(!session||!iso(now))throw Error('Ungültiger Morning-Zeitpunkt.');
 if(!['start','pause','finish','skip','end'].includes(action))throw Error('Unbekannte Player-Aktion.');
 const s=structuredClone(session);if(s.finishedAt)throw Error('Diese Routine ist bereits abgeschlossen.');
 const i=s.stepIndex;if(i<0||i>=MORNING_STEPS.length)throw Error('Ungültiger SAVERS-Schritt.');
 const elapsed=elapsedStepSeconds(s,now);
 if(action==='start'){
  if(s.status!=='running'){s.status='running';s.stepStartedAt=now;}
 }else if(action==='pause'){
  s.status='paused';s.elapsedSeconds=elapsed;s.stepStartedAt='';
 }else{
  const key=MORNING_STEPS[i].id;
  s.steps=[...(s.steps||[]).filter(item=>item.id!==key),{id:key,seconds:elapsed,skipped:action==='skip',finishedAt:now}];
  s.stepStartedAt='';s.elapsedSeconds=0;s.status='idle';
  if(action==='end'||i===MORNING_STEPS.length-1){const d=new Date(now);s.finishedAt=now;s.day=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');s.status='finished';}
  else{s.stepIndex=i+1;}
 }
 s.updatedAt=now;return s;
}
export function morningSafeMeta(session){if(!session)return null;const {id,startedAt,updatedAt,stepIndex,status,elapsedSeconds,stepStartedAt,durations,steps,finishedAt}=session;
 return {id,startedAt,updatedAt,stepIndex,status,elapsedSeconds,stepStartedAt,durations,steps,finishedAt};}
export function morningFromSafeMeta(meta){
 if(!meta||!iso(meta.startedAt)||typeof meta.id!=='string')return null;
 const elapsed=Number(meta.elapsedSeconds||0),idx=Number(meta.stepIndex);
 if(!Number.isInteger(idx)||idx<0||idx>=MORNING_STEPS.length||!Number.isFinite(elapsed)||elapsed<0||elapsed>86400)return null;
 return {...newMorningSession(meta.durations||{},meta.startedAt,meta.id),...meta,note:''};
}
export function storeMorningSession(state,record){
 if(!record?.id||!iso(record.startedAt)||!iso(record.updatedAt))throw Error('Ungültige Morgenroutine.');
 const journal=ensureMorning(state);const i=journal.sessions.findIndex(x=>x.id===record.id);
 if(i<0)journal.sessions.push(structuredClone(record));
 else if(String(journal.sessions[i].updatedAt||'')<=record.updatedAt)journal.sessions[i]=structuredClone(record);
 return journal.sessions.find(x=>x.id===record.id);
}
export function mergeMorningData(a,b){
 const left=a&&typeof a==='object'?a:{},right=b&&typeof b==='object'?b:{};
 const rows=new Map();for(const session of [...(left.sessions||[]),...(right.sessions||[])]){
  if(!session?.id)continue;const prior=rows.get(session.id);
  if(!prior||String(session.updatedAt||'')>String(prior.updatedAt||''))rows.set(session.id,session);
 }
 const aConfig=left.config||{},bConfig=right.config||{};
 const notes=new Map();for(const note of [...(left.notes||[]),...(right.notes||[])]){
  if(!note?.id)continue;const previous=notes.get(note.id);
  if(!previous||String(note.updatedAt||'')>String(previous.updatedAt||''))notes.set(note.id,note);
 }
 return {config:normalizeMorningConfig(String(aConfig.updatedAt||'')>=String(bConfig.updatedAt||'')?aConfig:bConfig),sessions:[...rows.values()].sort((x,y)=>String(y.startedAt).localeCompare(String(x.startedAt))),notes:[...notes.values()].sort((x,y)=>String(y.createdAt).localeCompare(String(x.createdAt)))};
}
export function morningStats(state,days=30,now=new Date()){
 const from=now.getTime()-days*86400000;
 const entries=(state?.miracleMorning?.sessions||[]).filter(s=>iso(s.finishedAt)&&Date.parse(s.finishedAt)>=from&&Date.parse(s.finishedAt)<=now.getTime());
 const totalSeconds=entries.reduce((a,s)=>a+(s.steps||[]).reduce((n,x)=>n+(x.skipped?0:Number(x.seconds||0)),0),0);
 return {entries,totalSeconds,daysWithRoutine:new Set(entries.map(s=>s.finishedAt.slice(0,10))).size,averageMinutes:entries.length?Math.round(totalSeconds/60/entries.length):0};
}

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clock=seconds=>{const secs=Math.max(0,Math.ceil(Number(seconds)||0));return `${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;};
export function morningHubView(state,{settings=false,goals=[]}={}){
 const journal=ensureMorning(state),config=journal.config,summary=morningStats(state),recent=[...summary.entries].sort((a,b)=>b.finishedAt.localeCompare(a.finishedAt)).slice(0,8);
 return `<section class="work-card mm570-hub"><div class="work-heading"><span>🌅 Miracle Morning · SAVERS</span><div class="mm570-head-actions"><button type="button" class="secondary-btn" data-action="mm570-settings">${settings?'Konfiguration schließen':'⚙ Konfigurieren'}</button><button type="button" class="secondary-btn" data-action="mm570-open" data-id="quick">6 Minuten</button><button type="button" class="primary-btn" data-action="mm570-open">Routine starten →</button></div></div><p class="muted-line">Deine persönliche Morgenroutine. Sechs Schritte, jeder kann jederzeit beendet oder übersprungen werden.</p><div class="mm570-overview">${MORNING_STEPS.map(step=>`<div title="${esc(step.title)}"><span>${step.emoji}</span><strong>${esc(step.letter)}</strong><small>${config.durations[step.id]} Min.</small></div>`).join('')}</div><div class="mm570-metrics"><div><strong>${summary.entries.length}</strong><small>Routinen · 30 Tage</small></div><div><strong>${summary.averageMinutes} Min.</strong><small>Ø tatsächlich erfasst</small></div><div><strong>${summary.daysWithRoutine}</strong><small>Tage mit Routine</small></div></div>
 ${settings?`<form id="mm570-settings-form" class="mm570-settings"><h3>Mein Morning konfigurieren</h3><p class="muted-line">Persönliche Texte bleiben im verschlüsselten Tresor und werden im Sperrmodus nicht angezeigt.</p><div class="mm570-settings-grid">${MORNING_STEPS.map(step=>`<label>${step.emoji} ${esc(step.title)}<input name="duration-${step.id}" type="number" min="1" max="90" value="${config.durations[step.id]}" required aria-label="Minuten für ${esc(step.title)}"/></label>`).join('')}</div><label>Affirmationen (eine pro Zeile)<textarea rows="5" name="affirmations" maxlength="3200" placeholder="Ich gestalte meinen Tag bewusst.&#10;Ich übe, auch unter Druck freundlich zu bleiben.">${esc(config.affirmations.join('\n'))}</textarea></label><label>Visualisierung / persönlicher Zielimpuls<textarea rows="3" name="visualization" maxlength="1200" placeholder="Worauf möchte ich heute hinarbeiten?">${esc(config.visualization)}</textarea></label><label>Mit vorhandenem Lebensziel verknüpfen<select name="goalId"><option value="">Kein Ziel verknüpft</option>${goals.map(g=>`<option value="${esc(g.id)}" ${g.id===config.goalId?'selected':''}>${esc(g.title)}</option>`).join('')}</select></label><label>Exercise · Übungen zu Hause (eine pro Zeile)<textarea rows="5" name="exercises" maxlength="1600">${esc(config.exercises.join('\n'))}</textarea></label><label>Reading · aktuelles Buch<input name="readingBook" maxlength="140" value="${esc(config.readingBook)}" placeholder="Was lese ich gerade?"/></label><label>Scribing · Journaling-Frage<input name="journalPrompt" maxlength="200" value="${esc(config.journalPrompt)}"/></label><button class="primary-btn" type="submit">Konfiguration verschlüsselt speichern</button></form>`:''}
 <div class="mm570-history"><h3>Deine letzten Morgen</h3>${recent.length?recent.map(session=>`<div><strong>${new Date(session.finishedAt).toLocaleDateString('de-AT',{day:'numeric',month:'short'})}</strong><span>${(session.steps||[]).filter(s=>!s.skipped).length} von 6 Abschnitten · ${Math.round((session.steps||[]).reduce((a,s)=>a+(s.skipped?0:s.seconds||0),0)/60)} Min.</span></div>`).join(''):'<p class="muted-line">Noch keine abgeschlossenen Routinen. Starte mit sechs Minuten, wenn der Morgen knapp ist.</p>'}</div></section>`;
}
export function morningOverlayView(session,config,{locked=false,goalTitle='',goalTitles={}}={}){
 const active=MORNING_STEPS[session.stepIndex]||MORNING_STEPS[0],duration=Number(session.durations?.[active.id]||config?.durations?.[active.id]||active.minutes),elapsed=elapsedStepSeconds(session),remaining=Math.max(0,duration*60-elapsed);
 const running=session.status==='running',final=session.stepIndex===MORNING_STEPS.length-1;
 let details=`<p>${esc(active.detail)}</p>`;
 if(active.id==='affirmations')details=locked?'<p>Deine persönlichen Affirmationen bleiben bei gesperrtem Tresor verborgen. Du kannst sie auswendig sprechen oder später entsperren.</p>':(config.affirmations||[]).length?`<div class="mm570-lines">${config.affirmations.map(line=>`<p>${esc(line)}</p>`).join('')}</div>`:'<p>Hinterlege deine eigenen Affirmationen über „Konfigurieren“ unter Insights → Habits.</p>';
 if(active.id==='visualization')details=locked?'<p>Richte deine Aufmerksamkeit auf einen persönlichen Wunsch oder eine konkrete Handlung heute. Zieltexte bleiben geschützt.</p>':`<div class="mm570-lines">${(config.visions||[]).length?config.visions.map(v=>`<div class="mm571-player-vision">${v.imageData?`<img src="${esc(v.imageData)}" alt="Mein Zielbild"/>`:''}<p><strong>${esc(v.emoji)} ${esc(v.title)}</strong>${v.goalId&&goalTitles[v.goalId]?`<small>Verknüpft: ${esc(goalTitles[v.goalId])}</small>`:''} · ${esc(v.text)}</p></div>`).join(''):`${goalTitle?`<p><strong>Mein Ziel:</strong> ${esc(goalTitle)}</p>`:''}${config.visualization?`<p>${esc(config.visualization)}</p>`:'<p>Wie möchte ich heute handeln? Welche kleine Handlung bringt mich meinem Ziel näher?</p>'}`}</div>`;
 if(active.id==='exercise')details=`<p>Bewege dich kontrolliert und ohne Überforderung.</p><ul>${(locked?MORNING_EXERCISES:config.exercises||MORNING_EXERCISES).map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
 if(active.id==='reading')details=`<p>${!locked&&config.readingBook?`<strong>${esc(config.readingBook)}</strong> · `:''}Du kannst jetzt zu Kindle wechseln. Beim Zurückkommen wird die verstrichene Zeit neu berechnet.</p>`;
 if(active.id==='scribing')details=`<label class="mm570-journal-label">${locked?'Was möchte ich mir merken?':esc(config.journalPrompt||'Was möchte ich heute festhalten?')}<textarea id="mm570-journal" rows="5" maxlength="4000" placeholder="Schreiben oder die Diktierfunktion des Geräts verwenden …">${esc(session.note||'')}</textarea></label><small>${locked?'Der Text wird beim Abschließen dieses Schritts verschlüsselt gesichert.':'Journaling bleibt im lokalen verschlüsselten Vault.'}</small>`;
 return `<div class="mm570-backdrop"><section id="mm570-player" role="dialog" aria-modal="true" aria-labelledby="mm570-title" class="mm570-player"><header class="mm570-player-head"><div><small>MIRACLE MORNING · ${locked?'GESPERRTER TRESOR':'MEINE ZEIT'}</small><h2 id="mm570-title">Mein Morgenritual</h2></div><button type="button" data-action="mm570-close" aria-label="Routine schließen" title="Später fortsetzen">✕</button></header><div class="mm570-progress">${MORNING_STEPS.map((step,i)=>`<button type="button" data-action="mm570-go-step" data-id="${i}" aria-label="${esc(step.title)} ansehen" title="${esc(step.title)}" class="${session.steps?.some(s=>s.id===step.id)?'done':i===session.stepIndex?'active':''}" ${i>session.stepIndex?'disabled':''}></button>`).join('')}</div><div class="mm570-center"><span class="mm570-emoji">${active.emoji}</span><small>SCHRITT ${session.stepIndex+1} VON 6 · ${esc(active.letter)}</small><h2>${esc(active.title)}</h2><p class="mm570-sub">${esc(active.de)} · ${duration} Min.</p><div class="mm570-clock" data-mm570-clock="1"><strong data-mm570-remaining>${clock(remaining)}</strong><span>${running?'Läuft':session.status==='paused'?'Pausiert':'Bereit'}</span></div><div class="mm570-desc">${details}</div></div><footer class="mm570-player-footer"><div class="mm570-controls"><button type="button" class="primary-btn" data-action="mm570-${running?'pause':'start'}">${running?'⏸ Pausieren':'▶ Start'}</button><button type="button" class="secondary-btn" data-action="mm570-finish">✓ ${final?'Abschließen':'Fertig'}</button><button type="button" class="secondary-btn mm570-skip" data-action="mm570-skip">Überspringen →</button></div><button type="button" class="mm570-restart" data-action="mm570-restart">Neue Routine beginnen</button><small>Auch bei einem App-Wechsel bleibt die Zeitberechnung korrekt. Alarme im Hintergrund sind geräteabhängig.</small></footer></section></div>`;
}
