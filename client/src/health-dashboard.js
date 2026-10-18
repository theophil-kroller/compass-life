import {missingGarminDays} from './health-import.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const color={deep:'#345C9C',light:'#9DB6E4',rem:'#A87CC7',awake:'#DEAA76',unknown:'#DCE4E9'};
const fmt=(n,unit='',digits=1)=>n==null?'–':Number(n).toLocaleString('de-AT',{maximumFractionDigits:digits})+(unit?' '+unit:'');
const periodDays={30:30,90:90,365:365,all:20000};
const daysBefore=(today,n)=>{const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-n);return d.toISOString().slice(0,10);};
const shortDate=s=>new Date(s+'T12:00:00Z').toLocaleDateString('de-AT',{day:'numeric',month:'short'});
const clock=iso=>new Date(iso).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'});
export function healthTrendSvg(data,key,title,unit='',tint='#377963'){
 const sorted=[...data].filter(x=>Number.isFinite(x[key])).sort((a,b)=>a.day.localeCompare(b.day));
 if(!sorted.length)return `<div class="health-graph-empty">Noch keine ${esc(title)}-Messungen importiert.</div>`;
 const width=680,height=170,pad=35,values=sorted.map(x=>x[key]),min=Math.min(...values),max=Math.max(...values);
 const lo=Math.max(0,min-(max-min||1)*.32),hi=max+(max-min||1)*.32,range=hi-lo||1;
 const dateA=Date.parse(sorted[0].day+'T00:00:00Z'),dateB=Date.parse(sorted.at(-1).day+'T00:00:00Z');
 const px=x=>pad+(dateB===dateA?0.5:(Date.parse(x.day+'T00:00:00Z')-dateA)/(dateB-dateA))*(width-pad*2);
 const py=v=>(height-pad)-(v-lo)/range*(height-pad*2);
 const points=sorted.map((d)=>`${px(d).toFixed(1)},${py(d[key]).toFixed(1)}`).join(' ');
 const area=sorted.length>1?`<polygon points="${pad},${height-pad} ${points} ${px(sorted.at(-1))},${height-pad}" fill="${tint}" opacity=".09"/>`:'';
 return `<div class="health-chart-shell"><svg class="health-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}: ${sorted.length} Messpunkte" preserveAspectRatio="none">
 ${[0,.5,1].map(f=>`<line x1="${pad}" y1="${py(lo+(hi-lo)*f)}" x2="${width-pad}" y2="${py(lo+(hi-lo)*f)}" stroke="#E9EEEB" stroke-width="1"/><text x="2" y="${py(lo+(hi-lo)*f)+4}" font-size="11" fill="#80958A">${fmt(lo+(hi-lo)*f,'',0)}</text>`).join('')}
 ${area}${sorted.length>1?`<polyline points="${points}" fill="none" stroke="${tint}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`:''}
 ${sorted.slice(sorted.length>200?sorted.length-200:0).map(d=>`<circle cx="${px(d)}" cy="${py(d[key])}" r="${sorted.length>60?2.2:3.9}" fill="${tint}"><title>${esc(shortDate(d.day))}: ${fmt(d[key],unit)}</title></circle>`).join('')}
 <text x="${pad}" y="${height-4}" font-size="12" fill="#718678">${esc(shortDate(sorted[0].day))}</text><text x="${width-pad}" y="${height-4}" font-size="12" text-anchor="end" fill="#718678">${esc(shortDate(sorted.at(-1).day))}</text>
 </svg></div>`;
}
export function sleepTimeline(night){
 if(!night?.stages?.length)return '<p class="health-graph-empty">Noch keine detaillierten Garmin-Schlafphasen vorhanden.</p>';
 const start=Date.parse(night.start),end=Date.parse(night.end),duration=end-start||1;
 const stages=[['Wach',1,color.awake],['REM',4,color.rem],['Leicht',2,color.light],['Tief',3,color.deep],['Unbekannt',0,color.unknown]];
 const segments=night.stages.map(s=>{const x=(Date.parse(s.start)-start)/duration*640,w=Math.max(0,(Date.parse(s.end)-Date.parse(s.start))/duration*640);const y=s.stage===1?10:s.stage===4?34:s.stage===2?58:s.stage===3?82:106;
  return `<rect x="${x.toFixed(2)}" y="${y}" width="${w.toFixed(2)}" height="20" rx="1" fill="${[color.unknown,color.awake,color.light,color.deep,color.rem][s.stage]}"><title>${esc(stages.find(x=>x[1]===s.stage)?.[0])} · ${clock(s.start)}–${clock(s.end)}</title></rect>`;
 }).join('');
 return `<div class="sleep-stage-chart"><div class="sleep-stage-labels"><span>Wach</span><span>REM</span><span>Leicht</span><span>Tief</span><span>Unbek.</span></div><div class="sleep-stage-content"><svg viewBox="0 0 640 135" preserveAspectRatio="none" role="img" aria-label="Schlafstadien am ${esc(night.day)}, ${esc(clock(night.start))} bis ${esc(clock(night.end))}">
 ${[10,34,58,82,106].map(y=>`<rect x="0" y="${y}" width="640" height="20" fill="#F4F7F5" rx="2"/>`).join('')}${segments}</svg>
 <div class="sleep-time-axis"><span>${clock(night.start)}</span><span>${clock(night.end)}</span></div></div></div>`;
}
export function bodySegmentsReport(latest){
 const regions=[['rightArm','Rechter Arm'],['leftArm','Linker Arm'],['trunk','Rumpf'],['rightLeg','Rechtes Bein'],['leftLeg','Linkes Bein']];
 const measure=(key,title,colorValue)=>{
  const fields=latest?.[key]||{};
  const available=regions.filter(([id])=>Number.isFinite(fields[id]?.kg));
  return `<article class="health-report-card health-segment-panel"><div class="health-report-title"><div><small>FITDAYS · SEGMENTANALYSE</small><h4>${esc(title)}</h4></div></div>
   ${available.length?`<div class="body-segment-list">${available.map(([id,label])=>{
      const record=fields[id],fraction=Number.isFinite(record.relativePct)?Math.min(record.relativePct,220)/220*100:null;
      return `<div class="body-segment-row"><div><span>${esc(label)}</span><strong>${fmt(record.kg,'kg')}</strong></div><div class="body-segment-track"><span style="width:${fraction===null?0:fraction.toFixed(1)}%;background:${colorValue}"></span></div><small>${record.relativePct==null?'':fmt(record.relativePct,'% Referenz')}</small></div>`;
    }).join('')}</div>`:'<p class="health-graph-empty">Für diese Messung liegen keine segmentalen Fitdays-Werte vor.</p>'}
   <p class="small-muted">Balken zeigen den von Fitdays angegebenen Referenzprozentsatz, nicht den Körperfettanteil dieser Region.</p></article>`;
 };
 if(!Object.keys(latest?.segmentFat||{}).length&&!Object.keys(latest?.segmentMuscle||{}).length)return '';
 return `<div class="health-segments-grid">${measure('segmentFat','Fettmasse nach Körperregion','#C58A5D')}${measure('segmentMuscle','Muskelmasse nach Körperregion','#4B977D')}</div>`;
}
export function importedHealthDashboard(data={},span=90,selectedNight=''){
 const fit=data.fitdays||[],nights=data.garminNights||[],hrv=data.garminHrv||[],wellness=data.garminWellness||[];
 const today=new Date().toLocaleDateString('sv-SE'),threshold=daysBefore(today,(periodDays[span]||90)-1);
 const body=[...fit.filter(x=>x.day>=threshold)].sort((a,b)=>a.at.localeCompare(b.at));
 const byDay=[...new Map(body.map(x=>[x.day,x])).values()],nightList=nights.filter(x=>x.day>=threshold),hrvRows=hrv.filter(x=>x.day>=threshold);
 const latest=fit.at(-1),lastNight=nights.find(x=>x.day===selectedNight)||nights.at(-1);
 const missing=missingGarminDays([...nights,...hrv],today);
 const metrics=[['Gewicht',fmt(latest?.weightKg,'kg'),'weightKg'],['Körperfett',fmt(latest?.bodyFatPct,'%'),'bodyFatPct'],['Muskelmasse',fmt(latest?.muscleKg,'kg'),'muscleKg'],['Körperwasser',fmt(latest?.waterPct,'%'),'waterPct'],['Viszeralfett',fmt(latest?.visceralFat),'visceralFat']];
 return `<section class="health-import-hub" aria-label="Garmin und Fitdays Import">
 <div class="health-import-heading"><div><span class="eyebrow">COMPASS / GESUNDHEIT</span><h3>Deine Daten. Dein Verlauf.</h3><p>Garmin-Schlaf und HRV gemeinsam mit Fitdays-Körpermessungen – lokal im verschlüsselten Tresor.</p></div><span class="health-local-badge">🔒 Nur auf diesem Gerät</span></div>
 <div class="health-import-brief"><div><strong>${nights.length}</strong><span>Garmin-Nächte</span></div><div><strong>${hrv.length}</strong><span>HRV-Tage</span></div><div><strong>${fit.length}</strong><span>Fitdays-Messungen</span></div><div><strong>${wellness.length}</strong><span>Stress-/Energiepunkte</span></div></div>
 <div class="health-import-controls"><label class="secondary-btn health-upload-btn">Dateien auswählen <input id="health-import-input" type="file" multiple accept=".zip,.fit,.csv,.xls,.xlsx,.json"/></label><span>Garmin ZIP / FIT / Schlaf-JSON · Fitdays CSV / XLS · auch mehrere Dateien zugleich</span></div>
 <div class="health-import-download-links"><a href="https://connect.garmin.com/app/settings/accountInformation" target="_blank" rel="noopener noreferrer">↗ Garmin Connect · Tagesexport öffnen</a><details><summary>Fitdays-Export: Wo finde ich ihn?</summary><p>Fitdays-App → Verlauf / Berichte → Menü (⋯) → Exportieren → Zeitraum auswählen → Datei speichern oder teilen. Je nach App-Version kann die Beschriftung abweichen.</p></details></div>
 ${missing.length?`<p class="health-import-missing"><strong>Garmin-Nachimport:</strong> ${missing.length} mögliche Tage ohne importierte Garmin-Schlaf-/HRV-Daten seit dem letzten Import, ${esc(shortDate(missing[0]))}–${esc(shortDate(missing.at(-1)))}. Lücken können auch Tage ohne auswertbaren Schlaf bedeuten.</p>`:''}
 ${!fit.length&&!nights.length&&!hrv.length?`<div class="health-empty-welcome">Lade deine Garmin-Tages-ZIPs gesammelt oder deinen Fitdays-Export hoch. Compass prüft die Messwerte vor dem Speichern; bestehende Einträge bleiben erhalten.</div>`:''}
 <div class="health-graph-navigation"><strong>Verlauf</strong><div class="health-range-actions">${[30,90,365,'all'].map(n=>`<button class="secondary-btn ${span===n?'is-chosen':''}" data-action="import-health-range" data-id="${n}">${n==='all'?'Alles':n+' T.'}</button>`).join('')}</div></div>
 <div class="health-trend-grid"><article class="health-report-card"><div class="health-report-title"><div><small>FITDAYS</small><h4>Körpergewicht</h4></div><b>${fmt(latest?.weightKg,'kg')}</b></div>${healthTrendSvg(byDay,'weightKg','Körpergewicht','kg','#327E70')}</article>
 <article class="health-report-card"><div class="health-report-title"><div><small>FITDAYS</small><h4>Körperfett</h4></div><b>${fmt(latest?.bodyFatPct,'%')}</b></div>${healthTrendSvg(byDay,'bodyFatPct','Körperfett','%','#B77E52')}</article></div>
 <div class="health-report-metrics">${metrics.map(([label,value])=>`<div class="health-report-metric"><span>${label}</span><strong>${value}</strong></div>`).join('')}</div>
 ${bodySegmentsReport(latest)}
 <div class="health-report-card health-sleep-card"><div class="health-report-title"><div><small>GARMIN</small><h4>Schlafphasen</h4></div>${lastNight?`<span>${esc(shortDate(lastNight.day))}</span>`:''}</div>
 ${nights.length?`<div class="health-night-select"><label for="health-night-select">Nacht ansehen</label><select id="health-night-select">${[...nights].reverse().slice(0,250).map(n=>`<option value="${esc(n.day)}" ${n.day===lastNight?.day?'selected':''}>${esc(new Date(n.day+'T12:00:00Z').toLocaleDateString('de-AT'))}</option>`).join('')}</select></div>`:''}
 ${sleepTimeline(lastNight)}
 ${lastNight?`<div class="sleep-stage-summary">${[['Tief',lastNight.totals.deep,color.deep],['Leicht',lastNight.totals.light,color.light],['REM',lastNight.totals.rem,color.rem],['Wach',lastNight.totals.awake,color.awake]].map(([label,v,c])=>`<span><i style="background:${c}"></i>${label}: ${Math.floor(v/60)}h ${String(v%60).padStart(2,'0')}m</span>`).join('')}</div>`:''}</div>
 <article class="health-report-card"><div class="health-report-title"><div><small>GARMIN</small><h4>Herzfrequenzvariabilität · HRV</h4></div><b>${fmt(hrv.at(-1)?.nightAverageMs,'ms')}</b></div>${healthTrendSvg(hrvRows,'nightAverageMs','nächtliche HRV','ms','#8260A3')}</article>
 <p class="health-chart-disclaimer">Garmin-Schlafstadien und Fitdays-Körperzusammensetzung sind Geräteschätzungen. Zeiträume ohne Messung bleiben leer. Kein medizinischer Befund. FIT-Rohdaten werden beim Import nicht gespeichert oder übertragen.</p>
 <div class="health-import-bottom"><span>Letzter manueller Import: ${data.lastImportAt?esc(new Date(data.lastImportAt).toLocaleString('de-AT')):'noch keiner'}</span><button type="button" class="secondary-btn" data-action="health-import-clear" ${!fit.length&&!nights.length&&!hrv.length?'disabled':''}>Lokale Importdaten löschen</button></div>
 </section>`;
}

/** 0.5.8: separate source administration from analytics so that the sidebar has one Insights entry. */
export function healthSourcesView(data={}){
 const nights=data?.garminNights||[],hrvs=data?.garminHrv||[],fit=data?.fitdays||[],wellness=data?.garminWellness||[],today=new Date().toLocaleDateString('sv-SE');
 const missing=missingGarminDays([...nights,...hrvs],today);
 return `<section class="health-import-hub health-sources-only" aria-label="Gesundheitsdatenquellen">
 <div class="health-import-heading"><div><span class="eyebrow">INSIGHTS / DATENQUELLEN</span><h3>Import & Verbindungen</h3><p>Deine Auswertungen stehen in Schlaf, Stress, Body Battery, Aktivität und Körper. Hier verwaltest du die Datenquellen.</p></div><span class="health-local-badge">🔒 Garmin & Fitdays lokal</span></div>
 <div class="health-import-brief"><div><strong>${nights.length}</strong><span>Garmin-Nächte</span></div><div><strong>${hrvs.length}</strong><span>HRV-Tage</span></div><div><strong>${fit.length}</strong><span>Fitdays-Messungen</span></div><div><strong>${wellness.length}</strong><span>Stress-/Energiepunkte</span></div></div>
 <div class="health-import-controls"><label class="secondary-btn health-upload-btn">Mehrere Exportdateien auswählen<input id="health-import-input" type="file" multiple accept=".zip,.fit,.csv,.xls,.xlsx,.json" /></label><span>Garmin ZIP / FIT / Schlaf-JSON und Fitdays CSV / XLS in einem Import</span></div>
 <div class="health-import-download-links"><a href="https://connect.garmin.com/app/settings/accountInformation" target="_blank" rel="noopener noreferrer">↗ Garmin Connect · Export öffnen</a><details><summary>Fitdays-Export: Anleitung anzeigen</summary><p>Fitdays → Verlauf / Berichte → ⋯ → Exportieren → Zeitraum auswählen → Datei speichern/teilen. Bezeichnungen unterscheiden sich nach App-Version.</p></details></div>
 <p class="health-chart-disclaimer"><strong>Neu in Compass 0.5.9:</strong> Bereits importierte Garmin-Tages-ZIPs bitte einmal erneut als Sammelimport auswählen. So werden Stress- und Body-Battery-Messungen ergänzt, ohne bestehende Schlaf- und HRV-Daten zu verdoppeln.</p>
 ${missing.length?`<p class="health-import-missing"><strong>Mögliche Garmin-Lücken:</strong> ${missing.length} Tage · ${esc(shortDate(missing[0]))}–${esc(shortDate(missing.at(-1)))}. Das sind Hinweise, keine garantierten Aufzeichnungslücken.</p>`:''}
 <div class="health-import-bottom"><span>Letzter Dateiimport: ${data.lastImportAt?esc(new Date(data.lastImportAt).toLocaleString('de-AT')):'noch keiner'}</span><button type="button" class="secondary-btn" data-action="health-import-clear" ${!fit.length&&!nights.length&&!hrvs.length&&!wellness.length?'disabled':''}>Lokale Importdaten löschen</button></div>
 <p class="health-chart-disclaimer">Garmin-/Fitdays-Dateien werden lokal verarbeitet und im verschlüsselten Tresor gespeichert. Health-Connect-Tageswerte sind ein gesonderter Cloud-Sync und derzeit nicht Ende-zu-Ende-verschlüsselt.</p></section>`;
}
export function healthBodyView(data={},span=90){
 const fit=data?.fitdays||[];const today=new Date().toLocaleDateString('sv-SE'),threshold=daysBefore(today,(span==='all'?20000:Number(span)||90)-1);
 const rows=fit.filter(x=>x.day>=threshold).sort((a,b)=>a.at.localeCompare(b.at));const byDay=[...new Map(rows.map(x=>[x.day,x])).values()];
 const latest=rows.at(-1)||null;
 const m=[['Gewicht',latest?.weightKg,'kg'],['Körperfett',latest?.bodyFatPct,'%'],['Muskelmasse',latest?.muscleKg,'kg'],['Körperwasser',latest?.waterPct,'%'],['Viszeralfett',latest?.visceralFat,'']];
 return `<section class="insight-body-view" aria-label="Fitdays Körperreport"><div class="insight-data-note">${rows.length} echte Fitdays-Messungen im ausgewählten Zeitraum · Körperfett und Muskelwerte sind Schätzungen der Bioimpedanzwaage.</div>
 <div class="health-report-metrics">${m.map(([label,value,u])=>`<div class="health-report-metric"><span>${esc(label)}</span><strong>${fmt(value,u)}</strong></div>`).join('')}</div>
 <div class="health-trend-grid"><article class="health-report-card"><div class="health-report-title"><div><small>FITDAYS · VERLAUF</small><h4>Körpergewicht</h4></div><b>${fmt(latest?.weightKg,'kg')}</b></div>${healthTrendSvg(byDay,'weightKg','Körpergewicht','kg','#327E70')}</article>
 <article class="health-report-card"><div class="health-report-title"><div><small>FITDAYS · VERLAUF</small><h4>Körperfett</h4></div><b>${fmt(latest?.bodyFatPct,'%')}</b></div>${healthTrendSvg(byDay,'bodyFatPct','Körperfett','%','#B77E52')}</article></div>
 ${bodySegmentsReport(latest)}<p class="insight-footnote">Segment-Prozentwerte bedeuten Fitdays-Referenzprozente, nicht Körperfettanteile der Regionen. Bei fehlenden Messungen keine Interpolation.</p></section>`;
}

/** Existing Health Connect day summaries are preserved in Insights after removing duplicate navigation. */
export function healthConnectActivityView(days=[],span='28'){
 const n=span==='all'?3650:Number(span)||28;
 const today=new Date().toLocaleDateString('sv-SE'),cutoff=daysBefore(today,n-1);
 const rows=(days||[]).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.day||'')&&d.day>=cutoff&&d.day<=today).sort((a,b)=>a.day.localeCompare(b.day));
 const measures=[['steps','Schritte','Schritte','#377F70'],['exerciseMinutes','Trainingsminuten','min','#6B89B3']];
 const chart=(key,label,unit,tint)=>{
  const points=rows.filter(x=>Number.isFinite(x[key])&&x[key]>=0);
  if(!points.length)return `<p class="health-graph-empty">Noch keine Health-Connect-${esc(label)} im gewählten Zeitraum verfügbar.</p>`;
  const W=700,H=200,L=52,R=18,T=15,B=35,w=W-L-R,h=H-T-B,max=Math.max(1,...points.map(x=>x[key]));
  const d0=Date.parse((rows[0]?.day||today)+'T12:00:00Z'),d1=Date.parse((rows.at(-1)?.day||today)+'T12:00:00Z'),width=Math.max(86400000,d1-d0);
  const X=day=>L+(Date.parse(day+'T12:00:00Z')-d0)/width*w;
  const path=points.map(x=>`<circle cx="${X(x.day)}" cy="${T+h-x[key]/max*h}" r="${points.length>60?2.5:4}" fill="${tint}"><title>${esc(x.day)} · ${x[key].toLocaleString('de-AT')} ${esc(unit)}</title></circle>`).join('');
  const grid=[0,.5,1].map(t=>`<line x1="${L}" x2="${W-R}" y1="${T+h-h*t}" y2="${T+h-h*t}" stroke="#E6EDE9"/><text x="${L-8}" y="${T+h-h*t+4}" text-anchor="end" font-size="11" fill="#73897C">${Math.round(max*t)}</text>`).join('');
  return `<div class="insight-svg-scroller"><svg class="insight-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)} aus Health Connect: ${points.length} gemessene Tage">${grid}${path}</svg></div>`;
 };
 return `<div class="insight-activity-content"><div class="insight-data-note">${rows.length} importierte Health-Connect-Tage im gewählten Zeitraum. Fehlende Tage bleiben Lücken. Garmin-Aktivitäten, Stress und Body Battery werden erst in späteren Phasen detailliert dekodiert.</div>
 <div class="insight-chart-grid">${measures.map(([key,label,unit,tint])=>{const values=rows.map(x=>x[key]).filter(x=>Number.isFinite(x)&&x>=0),avg=values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
 return `<article class="insight-chart-card"><div class="insight-figure-title"><div><small>HEALTH CONNECT · ${esc(unit.toUpperCase())}</small><h3>${esc(label)}</h3></div><strong>${avg===null?'–':Math.round(avg).toLocaleString('de-AT')}</strong></div>${chart(key,label,unit,tint)}<p class="insight-figure-note">Durchschnitt aus ${values.length} tatsächlich erfassten Tagen; fehlende Tage werden nicht als null gezählt.</p></article>`;}).join('')}</div></div>`;
}
