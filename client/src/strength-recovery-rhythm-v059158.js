/** Strength rhythm: no automatic load changes, only optional rest suggestions. */
const dayOf=x=>String(x?.day||x?.finishedAt||x?.endedAt||x?.startedAt||x?.start||'').slice(0,10);
const validDay=x=>/^\d{4}-\d{2}-\d{2}$/.test(x);
const daysDiff=(a,b)=>(Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/86400000;
export function strengthRhythm58(state,{today=new Date().toISOString().slice(0,10),health={}}={}){
 const sessions=(Array.isArray(state?.strengthGuidedSessions)?state.strengthGuidedSessions:[]).filter(x=>x&&!x.deleted);
 const days=new Set(sessions.map(dayOf).filter(d=>validDay(d)&&d<=today));
 const last7=[...days].filter(d=>daysDiff(d,today)>=0&&daysDiff(d,today)<7).sort();
 let streak=0;for(let i=0;i<14;i++){const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-i);if(days.has(d.toISOString().slice(0,10)))streak++;else break;}
 const count=last7.length;
 const healthAttention=health?.attention===true;
 const restSuggested=healthAttention||count>=6||streak>=5;
 const notice=restSuggested?(healthAttention?'Deine Erholungssignale sprechen für einen lockeren Tag.':`In den letzten sieben Tagen sind ${count} Krafttrainingstage dokumentiert. Eine bewusste Entlastung kann sinnvoll sein.`):count>=4?`${count} Krafttrainingstage in den letzten sieben Tagen. Plane mindestens einen leichteren Tag ein.`:count?`${count} Krafttrainingstage in den letzten sieben Tagen. Achte auf die Erholung derselben Muskelgruppen.`:'Noch keine abgeschlossenen Coach-Einheiten im Sieben-Tage-Fenster.';
 return {count,last7,streak,restSuggested,notice};
}
export function strengthRhythmView58(state,{today,health}={}){
 const r=strengthRhythm58(state,{today,health});
 return `<aside class="str58-rhythm" aria-label="Trainingsrhythmus und Erholung"><div><strong>🌿 Trainingsrhythmus · ${r.count} von 7 Tagen</strong><small>${r.notice}</small></div><div class="str58-dots">${Array.from({length:7},(_,i)=>{const d=new Date((today||new Date().toISOString().slice(0,10))+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(6-i));const day=d.toISOString().slice(0,10);return `<span class="${r.last7.includes(day)?'trained':'rest'}" title="${day}: ${r.last7.includes(day)?'Krafttraining protokolliert':'kein bestätigtes Coach-Training'}"></span>`;}).join('')}</div><small>${r.restSuggested?'Vorschlag: Pause, Spazieren oder leichte Mobilität. Training bleibt eine eigene Entscheidung.':'Täglich aktiv sein ist möglich; dieselben Muskeln brauchen nach intensiven Einheiten Regeneration.'}</small></aside>`;
}
