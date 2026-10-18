/** Compass 0.5.12 — visit-only, local-first Google Maps Timeline / manual stays.
 * NO route tracking, reverse geocoding, tile requests or cloud synchronization.
 * Google may infer visits incorrectly; never assert a confirmed sleep location.
 */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shortDate=iso=>new Date(iso).toLocaleDateString('de-AT',{day:'2-digit',month:'short',year:'numeric'});
const validDate=t=>Number.isFinite(Date.parse(t))&&new Date(t).getUTCFullYear()>=2000&&new Date(t).getUTCFullYear()<=2100;
const validCoord=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
const maxDays=365*2,maxVisits=50000;
const round=(n,d=3)=>Number(n.toFixed(d));
function coordinate(value){
 if(typeof value==='string'){
  const s=value.replace(/°/g,'').replace(/^geo:/i,'').trim();
  const m=s.match(/^\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)(?:\s*[,;].*)?$/);
  if(m){const lat=Number(m[1]),lon=Number(m[2]);return validCoord(lat,lon)?{lat,lon}:null;}
 }
 if(value&&typeof value==='object'){
  if(value.latLng||value.location||value.placeLocation)return coordinate(value.latLng||value.location||value.placeLocation);
  const lat=Number(value.latitude??value.lat??(Number.isFinite(value.latitudeE7)?value.latitudeE7/1e7:NaN));
  const lon=Number(value.longitude??value.lng??value.lon??(Number.isFinite(value.longitudeE7)?value.longitudeE7/1e7:NaN));
  if(validCoord(lat,lon))return {lat,lon};
 }
 return null;
}
function timestamp(value){
 if(value&&typeof value==='object')return timestamp(value.timestamp??value.dateTime??value.time);
 if(typeof value==='number')return new Date(value>1e11?value:value*1000).toISOString();
 if(typeof value==='string'){
  if(/^\d{13}$/.test(value))return new Date(Number(value)).toISOString();
  if(validDate(value))return new Date(value).toISOString();
 }
 return null;
}
function visitRecord(start,end,pos,source='googleTimeline',name='',confirmed=false){
 if(!start||!end||!pos||!validDate(start)||!validDate(end))return null;
 const millis=Date.parse(end)-Date.parse(start);
 if(millis<15*60000||millis>maxDays*86400000)return null;
 const lat=round(pos.lat,5),lon=round(pos.lon,5),begin=new Date(start).toISOString(),finish=new Date(end).toISOString();
 const id=`${source}:${begin}:${finish}:${lat}:${lon}`;
 return {id,source,start:begin,end:finish,lat,lon,name:String(name||'').slice(0,100),confirmed:Boolean(confirmed),minutes:Math.round(millis/60000)};
}
export function parseTimelineData(json){
 const root=Array.isArray(json)?{semanticSegments:json}:json;
 if(!root||typeof root!=='object')throw Error('Keine gültigen Google-Timeline-Daten');
 const semantic=root.semanticSegments||root.timelineObjects||root.locations;
 if(!Array.isArray(semantic))throw Error('Keine semanticSegments oder timelineObjects im Export gefunden');
 if(semantic.length>200000)throw Error('Zu viele Standortereignisse für einen Import');
 const result=[];
 for(const segment of semantic){
  let visit=null;
  if(segment?.visit){
   const candidate=segment.visit.topCandidate||segment.visit;
   const pos=coordinate(candidate.placeLocation||candidate.location||candidate.latLng);
   visit=visitRecord(timestamp(segment.startTime),timestamp(segment.endTime),pos,'googleTimeline',candidate.name||'',Boolean(segment.visit.isConfirmed||segment.visit.editConfirmationStatus==='CONFIRMED'));
  }else if(segment?.placeVisit){
   const v=segment.placeVisit,d=v.duration||{},loc=v.location||{};
   const start=timestamp(d.startTimestamp||d.startTimestampMs||segment.startTime);
   const end=timestamp(d.endTimestamp||d.endTimestampMs||segment.endTime);
   visit=visitRecord(start,end,coordinate(loc),'googleTimeline',loc.name||'',Boolean(v.isConfirmed));
  }
  if(visit)result.push(visit);
  // Activity paths and rawSignals are deliberately not imported or persisted.
 }
 return [...new Map(result.map(x=>[x.id,x])).values()].sort((a,b)=>a.start.localeCompare(b.start)).slice(0,maxVisits);
}
export async function inspectTimelineFiles(files){
 if(!files?.length||files.length>12)throw Error('Bitte 1–12 Timeline-Dateien auswählen');
 const visits=[],warnings=[];
 for(const file of files){
  if(file.size>125*1024*1024)throw Error('Eine Timeline-Datei ist größer als 125 MB; bitte nach Zeitraum aufteilen');
  const bytes=new Uint8Array(await file.arrayBuffer());
  let texts=[];
  if(bytes[0]===80&&bytes[1]===75){
   const {unzip}=await import('fflate');
   const entries=await new Promise((ok,bad)=>unzip(bytes,{filter:x=>/\.json$/i.test(x.name)&&!x.name.startsWith('__MACOSX/')},(e,r)=>e?bad(e):ok(r)));
   const list=Object.entries(entries).filter(([name])=>/Timeline\.json$|Semantic Location History|Records\.json$/i.test(name));
   if(list.length>45)throw Error('Zu viele Timeline-JSON-Dateien im ZIP');
   texts=list.map(([name,data])=>({name,data}));
  }else texts=[{name:file.name,data:bytes}];
  if(!texts.length)warnings.push(`${file.name}: keine unterstützte Timeline-JSON gefunden`);
  for(const item of texts){
   if(item.data.byteLength>130*1024*1024){warnings.push(`${item.name}: JSON zu groß`);continue;}
   try{const rows=parseTimelineData(JSON.parse(new TextDecoder().decode(item.data)));visits.push(...rows);}catch(e){warnings.push(`${item.name.split('/').at(-1)}: ${e.message}`);}
  }
 }
 const unique=[...new Map(visits.map(v=>[v.id,v])).values()].sort((a,b)=>a.start.localeCompare(b.start));
 return {visits:unique.slice(0,maxVisits),warnings};
}
export function manualPlaceVisit({name,lat,lon,start,end}){
 const title=String(name||'').trim(),point={lat:Number(lat),lon:Number(lon)};
 if(!title||title.length>100||!validCoord(point.lat,point.lon))throw Error('Bitte Name und gültige Breiten-/Längengrade angeben');
 const result=visitRecord(timestamp(start),timestamp(end),point,'manual',title,true);
 if(!result)throw Error('Start und Ende müssen gültig sein (mindestens 15 Minuten, maximal zwei Jahre)');
 return result;
}
export function mergePlaces(existing=[],incoming=[]){
 const map=new Map((existing||[]).filter(x=>x&&typeof x.id==='string').map(x=>[x.id,x]));
 let added=0;
 for(const row of incoming){if(!map.has(row.id)){added++;map.set(row.id,row);}}
 if(map.size>maxVisits)throw Error('Mehr als 50.000 Aufenthalte: kleinere Exportzeiträume verwenden');
 return {visits:[...map.values()].sort((a,b)=>a.start.localeCompare(b.start)),added};
}
const placeKey=p=>`${Math.round(p.lat*4)/4},${Math.round(p.lon*4)/4}`;
export function placeClusters(visits=[],labels={},range={start:null,end:null}){
 const end=range.end?Date.parse(`${range.end}T23:59:59Z`):Infinity;
 const start=range.start?Date.parse(`${range.start}T00:00:00Z`):-Infinity;
 const map=new Map();
 for(const p of visits){if(Date.parse(p.end)<start||Date.parse(p.start)>end)continue;
  const key=placeKey(p),old=map.get(key);
  if(!old)map.set(key,{key,lat:p.lat,lon:p.lon,name:labels[key]||p.name||'',count:1,minutes:p.minutes,first:p.start,last:p.end,manual:p.source==='manual',confirmed:p.confirmed});
  else{old.count++;old.minutes+=p.minutes;if(p.start<old.first)old.first=p.start;if(p.end>old.last)old.last=p.end;old.manual||=p.source==='manual';old.confirmed||=p.confirmed;}
 }
 return [...map.values()].sort((a,b)=>b.minutes-a.minutes||b.count-a.count);
}
/** Require an interval covering the actual sleep midpoint; never infer sleep from GPS track points. */
export function compareSleepPlaces(nights=[],visits=[],labels={}){
 const clusters=new Map();
 for(const n of nights){const s=Date.parse(n.start),e=Date.parse(n.end);
  const total=n.totals||{},sleep=Number(total.deep||0)+Number(total.light||0)+Number(total.rem||0);
  if(!Number.isFinite(s)||!Number.isFinite(e)||e-s<45*60000||sleep<=0)continue;
  const mid=(s+e)/2;
  const hits=visits.filter(p=>Date.parse(p.start)<=mid&&Date.parse(p.end)>=mid&&p.minutes>=120);
  if(hits.length!==1)continue; // overlapping/conflicting visits cannot be assigned uniquely
  const visit=hits[0],key=placeKey(visit),a=clusters.get(key)||{key,name:labels[key]||visit.name||'',nights:0,totalMinutes:0,hrv:null,confirmedNights:0};
  a.nights++;a.totalMinutes+=sleep;a.confirmedNights+=visit.confirmed?1:0;
  clusters.set(key,a);
 }
 return [...clusters.values()].map(a=>({...a,avgMinutes:Math.round(a.totalMinutes/a.nights)})).sort((a,b)=>b.nights-a.nights);
}
// Schematic self-contained continent silhouettes; no map-tile requests or external image beacons.
const continent=[
 [[-169,68],[-154,72],[-135,69],[-126,57],[-130,50],[-124,42],[-118,32],[-105,27],[-97,16],[-87,10],[-82,8],[-79,15],[-85,22],[-82,30],[-72,42],[-60,48],[-53,57],[-64,61],[-81,61],[-96,70],[-125,72]],
 [[-81,12],[-72,12],[-65,9],[-59,6],[-50,1],[-35,-7],[-40,-22],[-48,-28],[-54,-39],[-70,-55],[-75,-47],[-74,-31],[-79,-12]],
 [[-11,36],[-17,25],[-17,13],[-12,3],[8,-5],[11,-18],[18,-35],[28,-34],[35,-20],[43,-11],[51,10],[43,14],[36,28],[30,32],[10,38]],
 [[-11,36],[-8,44],[-1,50],[10,54],[20,57],[33,55],[39,59],[51,56],[64,58],[74,55],[88,57],[102,50],[112,43],[125,42],[135,36],[142,31],[135,18],[122,8],[105,0],[98,9],[90,19],[78,9],[71,14],[62,25],[53,28],[43,38],[37,44],[28,42],[19,45],[9,43],[3,38]],
 [[113,-12],[126,-13],[136,-11],[153,-23],[151,-36],[140,-39],[123,-35],[114,-24]],
 [[-52,83],[-42,80],[-38,68],[-46,60],[-59,62],[-62,75]],
 [[47,-13],[51,-17],[50,-25],[45,-26],[43,-17]],
 [[130,32],[135,35],[141,44],[146,44],[141,35]],
 [[-180,-70],[-120,-73],[-70,-72],[-20,-73],[40,-72],[90,-73],[145,-71],[180,-73],[180,-83],[-180,-83]]
];
const X=lon=>(lon+180)*2.5,Y=lat=>(90-lat)*2.5;
function mapGraphic(clusters,selected){
 const land=continent.map(points=>`<path d="${points.map(([lon,lat],i)=>`${i?'L':'M'}${X(lon).toFixed(1)},${Y(lat).toFixed(1)}`).join(' ')} Z" fill="#DCE9E0" stroke="#F6FBF7" stroke-width="1.3"/>`).join('');
 const lines=[-120,-60,0,60,120].map(lon=>`<line x1="${X(lon)}" x2="${X(lon)}" y1="20" y2="430" stroke="#E3ECE6"/>`).join('')+[-60,-30,0,30,60].map(lat=>`<line x1="20" x2="880" y1="${Y(lat)}" y2="${Y(lat)}" stroke="#E3ECE6"/>`).join('');
 const dots=clusters.slice(0,75).map(p=>{
  const r=p.key===selected?8:Math.min(7,3.5+Math.log2(p.count+1));
  const x=X(p.lon),y=Y(p.lat),label=p.name||`${p.lat.toFixed(1)}°, ${p.lon.toFixed(1)}°`;
  return `<g><circle cx="${x}" cy="${y}" r="${r+4}" fill="#398976" fill-opacity=".13"/><circle cx="${x}" cy="${y}" r="${r}" fill="${p.key===selected?'#BF745A':'#348575'}" stroke="white" stroke-width="1.9" data-action="places-select" data-id="${esc(p.key)}" role="button" tabindex="0"><title>${esc(label)} · ${p.count} Besuch(e)</title></circle></g>`;
 }).join('');
 return `<div class="places-map-shell"><svg viewBox="0 0 900 450" class="places-world-svg" role="img" aria-label="Schematische Weltkarte mit ${clusters.length} Standortgruppen" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="900" height="450" fill="#F3F8F7" rx="12"/>${lines}${land}${dots}</svg></div>`;
}
const displayName=p=>p.name||`${p.lat.toFixed(2)}°, ${p.lon.toFixed(2)}°`;
export function placesInsightsView({visits=[],labels={},nights=[],range={start:null,end:null},selected='',preview=null}={}){
 const clusters=placeClusters(visits,labels,range),location=clusters.find(p=>p.key===selected)||clusters[0],sleep=compareSleepPlaces(nights,visits,labels),validNights=sleep.reduce((s,x)=>s+x.nights,0);
 const first=visits[0],last=visits.at(-1);
 const from=range.start?Date.parse(`${range.start}T00:00:00Z`):-Infinity;
 const to=range.end?Date.parse(`${range.end}T23:59:59Z`):Infinity;
 const recent=visits.filter(v=>Date.parse(v.end)>=from&&Date.parse(v.start)<=to).slice(-18).reverse();
 const visitName=v=>labels[placeKey(v)]||v.name||`${v.lat.toFixed(2)}°, ${v.lon.toFixed(2)}°`;
 return `<section class="places-insights" aria-label="Orte und Reisen — nur lokale Standortdaten">
 <div class="insight-kpi-grid"><article class="insight-kpi"><span>Aufenthaltsereignisse</span><strong>${visits.length.toLocaleString('de-AT')}</strong><small>${first?`${shortDate(first.start)} bis ${shortDate(last.end)}`:'Noch kein Standortimport'}</small></article><article class="insight-kpi"><span>Standortgruppen</span><strong>${clusters.length}</strong><small>Im gewählten Zeitraum, etwa 25-km-Gruppen</small></article><article class="insight-kpi"><span>Schlafnächte zugeordnet</span><strong>${validNights}</strong><small>Nur bei überlappenden Aufenthaltsintervallen</small></article></div>
 ${!visits.length?`<div class="places-start-here"><strong>Deine Weltkarte ist bereit – Standortdaten fehlen noch</strong><p>Die Karte ist bereits Teil von Compass. Anders als Garmin-Schlafwerte werden Google-Maps-Aufenthalte nicht automatisch übertragen. Importiere deinen Android-Timeline-Export unten unter „Standortdaten ergänzen“; die Datei bleibt lokal im Tresor.</p><p>Google Maps → Profilbild → Meine Zeitachse → Menü → Einstellungen und Datenschutz → Zeitachsendaten exportieren. Anschließend hier <strong>Timeline-JSON oder ZIP auswählen</strong>. Der Import liest Aufenthaltsintervalle, keine Bewegungsrouten.</p></div>`:''}
 <div class="insight-chart-grid places-main-grid"><article class="insight-chart-card places-map-card"><div class="insight-figure-title"><div><small>01 · THE WORLD</small><h3>Meine Aufenthaltsorte</h3></div></div>${mapGraphic(clusters,location?.key)}<p class="insight-figure-note">Schematische, lokal gerenderte Weltkarte. Marker zeigen Aufenthaltsgruppen, keine lückenlose Reise- oder GPS-Route. Die Koordinaten verlassen nicht den verschlüsselten Vault.</p></article>
 <article class="insight-chart-card places-list-card"><div class="insight-figure-title"><div><small>02 · PLACES</small><h3>Besuchte Orte</h3></div></div>${clusters.length?`<div class="places-result-list">${clusters.slice(0,25).map(p=>`<button type="button" class="places-result ${location?.key===p.key?'selected':''}" data-action="places-select" data-id="${esc(p.key)}"><span class="places-location-dot"></span><span><strong>${esc(displayName(p))}</strong><small>${p.count} Aufenthalt${p.count===1?'':'e'} · ca. ${Math.round(p.minutes/60)} h erfasst</small></span><span>→</span></button>`).join('')}</div>`:'<div class="insight-no-data"><strong>Keine Aufenthalte importiert</strong><p>Exportiere deine Google Maps Timeline und wähle die Datei unten aus.</p></div>'}</article></div>
 <article class="insight-chart-card places-timeline"><div class="insight-figure-title"><div><small>03 · JOURNEY</small><h3>Reiseverlauf</h3></div><span class="insight-figure-note">Letzte ${recent.length} Aufenthalte im Zeitraum</span></div>${recent.length?`<div class="places-timeline-list">${recent.map(v=>`<div class="places-timeline-entry"><span class="places-timeline-dot"></span><div><strong>${esc(visitName(v))}</strong><small>${esc(shortDate(v.start))} – ${esc(shortDate(v.end))} · ca. ${Math.round(v.minutes/60)} h · ${v.source==='manual'?'Manuell eingetragen':v.confirmed?'Google: bestätigt':'Google: erkannt'}</small></div></div>`).join('')}</div>`:'<p class="insight-figure-note">Noch kein Reiseverlauf für den gewählten Zeitraum.</p>'}<p class="insight-figure-note">Nur aus Besuchsintervallen; keine geschätzten Wege zwischen Orten. Reisen ohne Besuchsereignisse werden nicht ergänzt.</p></article>
 ${location?`<article class="insight-chart-card places-detail"><div class="insight-figure-title"><div><small>04 · SELECTED PLACE</small><h3>${esc(displayName(location))}</h3></div></div><p class="insight-figure-note">Erster Eintrag: ${esc(shortDate(location.first))} · letzter Eintrag: ${esc(shortDate(location.last))}. Die automatische Google-Zuordnung ist keine Bestätigung eines Aufenthalts.</p><form id="place-label-form" data-key="${esc(location.key)}" class="places-label-form"><label>Eigene Bezeichnung für diesen Ort<input name="name" maxlength="100" placeholder="z. B. Sydney, Graz oder Hotel" value="${esc(labels[location.key]||'')}"/></label><button type="submit" class="secondary-btn">Ort benennen</button></form></article>`:''}
 <div class="insight-chart-grid"><article class="insight-chart-card"><div class="insight-figure-title"><div><small>05 · SLEEP AND PLACE</small><h3>Schlaf nach Aufenthaltsort</h3></div></div>${sleep.length?`<div class="places-sleep-list">${sleep.slice(0,12).map(p=>`<div><span><strong>${esc(p.name||p.key)}</strong><small>${p.nights} Nacht${p.nights===1?'':'Nächte'} · ${p.confirmedNights} mit bestätigtem Aufenthalt</small></span><div class="insight-focus-track"><i style="width:${Math.min(100,p.avgMinutes/600*100).toFixed(1)}%"></i></div><b>${Math.floor(p.avgMinutes/60)} h ${String(p.avgMinutes%60).padStart(2,'0')}</b></div>`).join('')}</div>`:'<div class="insight-no-data"><strong>Noch keine belastbare Schlaf-Ort-Zuordnung</strong><p>Benötigt mindestens eine echte Garmin-Schlafnacht und einen Aufenthalt, der den Schlafmittelpunkt eindeutig umfasst.</p></div>'}<p class="insight-figure-note">Explorative Zuordnung: Google-Aufenthalte können falsch sein. Kein automatischer Nachweis des tatsächlichen Übernachtungsorts; keine kausalen Aussagen.</p></article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>06 · IMPORT</small><h3>Standortdaten ergänzen</h3></div></div><p class="insight-figure-note">Google Maps auf Android → Profilbild → Meine Zeitachse → ⋮ → Einstellungen & Datenschutz → Zeitachsendaten exportieren. Die Menüpunkte können je nach Version abweichen.</p><label class="secondary-btn places-upload-btn">Timeline-JSON oder ZIP auswählen<input id="places-import-input" type="file" multiple accept=".json,.zip,application/json,application/zip"/></label>${preview?`<div class="places-import-preview"><strong>${preview.visits.length} Aufenthalte erkannt</strong><p>${preview.warnings.length?preview.warnings.map(esc).join(' · '):'Nur Besuchsereignisse; Rohsignale und GPS-Routen werden verworfen.'}</p><button type="button" class="primary-btn" data-action="places-import-confirm" ${preview.visits.length?'':'disabled'}>Import übernehmen</button> <button type="button" class="secondary-btn" data-action="places-import-cancel">Abbrechen</button></div>`:''}<details class="places-manual"><summary>Aufenthalt manuell ergänzen</summary><form id="places-manual-form" class="places-manual-form"><label>Ort<input name="name" maxlength="100" placeholder="z. B. Graz" required/></label><div><label>Breitengrad<input name="lat" type="number" step="any" min="-90" max="90" required/></label><label>Längengrad<input name="lon" type="number" step="any" min="-180" max="180" required/></label></div><label>Von<input name="start" type="datetime-local" required/></label><label>Bis<input name="end" type="datetime-local" required/></label><button type="submit" class="secondary-btn">Aufenthalt speichern</button></form></details>${visits.length?'<button type="button" class="text-link places-clear" data-action="places-clear">Alle lokalen Standortdaten löschen</button>':''}<p class="insight-figure-note">Der Import bleibt vollständig lokal im verschlüsselten Vault. Kein Maps-API-Aufruf, keine Ortsauflösung über externe Server und kein Cloud-Sync. Originaldateien werden nicht gespeichert.</p></article></div>
 </section>`;
}
