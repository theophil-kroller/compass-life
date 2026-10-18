/** Compass 0.5.12 — visit-only, local-first Google Maps Timeline / manual stays.
 * NO route tracking, reverse geocoding, tile requests or cloud synchronization.
 * Google may infer visits incorrectly; never assert a confirmed sleep location.
 */
import {WORLD_LAND_PATH} from './world-outline.js';
import {approximatePlace} from './offline-places.js';
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
// Natural Earth 110m country outlines are bundled. All controls work without map tiles or HTTP requests.
const X=lon=>(lon+180)*2.5,Y=lat=>(90-lat)*2.5;
export const PLACE_MAP_REGIONS={
 world:{label:'Welt',x:0,y:0,w:900,h:450},
 europe:{label:'Europa',x:407,y:40,w:195,h:97.5},
 austria:{label:'Österreich',x:464,y:90,w:55,h:27.5},
 china:{label:'China',x:620,y:79,w:197,h:100},
 australia:{label:'Australien',x:695,y:240,w:165,h:104}
};
function viewBounds(region='world',zoom=1){
 const r=PLACE_MAP_REGIONS[region]||PLACE_MAP_REGIONS.world;
 const z=Math.min(5,Math.max(1,Number(zoom)||1)),w=r.w/z,h=r.h/z;
 return {x:r.x+(r.w-w)/2,y:r.y+(r.h-h)/2,w,h};
}
function mapGraphic(clusters,selected,region='world',zoom=1){
 const view=viewBounds(region,zoom),shrink=Math.pow(view.w/900,.72);
 const land=`<path d="${WORLD_LAND_PATH}" fill="#DCE9E0" stroke="#F7FBF8" stroke-width="${(Math.max(.12,view.w/900*1.3)).toFixed(3)}" fill-rule="evenodd"/>`;
 const lines=[-120,-60,0,60,120].map(lon=>`<line x1="${X(lon)}" y1="0" x2="${X(lon)}" y2="450" stroke="#E5ECE8" stroke-width=".35"/>`).join('')+[-60,-30,0,30,60].map(lat=>`<line x1="0" x2="900" y1="${Y(lat)}" y2="${Y(lat)}" stroke="#E5ECE8" stroke-width=".35"/>`).join('');
 const dots=clusters.slice(0,1000).filter(p=>{const x=X(p.lon),y=Y(p.lat);return x>=view.x-2&&x<=view.x+view.w+2&&y>=view.y-2&&y<=view.y+view.h+2;}).map(p=>{
  const r=Math.max(.20,Math.min(6,3.5+Math.log2(p.count+1))*shrink),x=X(p.lon),y=Y(p.lat),label=displayName(p);
  return `<g data-action="places-select" data-id="${esc(p.key)}" role="button" tabindex="0" aria-label="${esc(label)}, ${p.count} Aufenthalte"><circle cx="${x}" cy="${y}" r="${(r*1.6).toFixed(3)}" fill="#348575" fill-opacity=".12"/><circle cx="${x}" cy="${y}" r="${r.toFixed(3)}" fill="${p.key===selected?'#C8795D':'#348575'}" stroke="white" stroke-width="${Math.max(.07,r*.25).toFixed(2)}"/><title>${esc(label)} · ${p.count} Aufenthalte</title></g>`;
 }).join('');
 const buttons=Object.entries(PLACE_MAP_REGIONS).map(([key,r])=>`<button type="button" class="places-map-region ${region===key?'selected':''}" data-action="places-map-region" data-id="${key}" aria-pressed="${region===key}">${r.label}</button>`).join('');
 return `<div class="places-map-tools" aria-label="Kartenausschnitt wählen"><div class="places-map-region-set">${buttons}</div><div class="places-map-zoom"><button type="button" data-action="places-map-zoom" data-id="in" aria-label="Karte vergrößern" ${zoom>=5?'disabled':''}>+</button><button type="button" data-action="places-map-zoom" data-id="out" aria-label="Karte verkleinern" ${zoom<=1?'disabled':''}>−</button></div></div><div class="places-map-shell"><svg viewBox="${view.x} ${view.y} ${view.w} ${view.h}" class="places-world-svg" role="img" aria-label="Weltkarte: ${esc(PLACE_MAP_REGIONS[region]?.label||'Welt')}, ${clusters.length} Standortgruppen" xmlns="http://www.w3.org/2000/svg"><rect x="${view.x}" y="${view.y}" width="${view.w}" height="${view.h}" fill="#F3F8F7"/>${lines}${land}${dots}</svg></div>`;
}
const displayName=p=>p.name||approximatePlace(p.lat,p.lon).name;
export function placesInsightsView({visits=[],labels={},nights=[],range={start:null,end:null},selected='',preview=null,mapRegion='world',mapZoom=1,listLimit=25}={}){
 const clusters=placeClusters(visits,labels,range),location=clusters.find(p=>p.key===selected)||clusters[0],sleep=compareSleepPlaces(nights,visits,labels),validNights=sleep.reduce((s,x)=>s+x.nights,0);
 const first=visits[0],last=visits.at(-1);
 const from=range.start?Date.parse(`${range.start}T00:00:00Z`):-Infinity;
 const to=range.end?Date.parse(`${range.end}T23:59:59Z`):Infinity;
 const recent=visits.filter(v=>Date.parse(v.end)>=from&&Date.parse(v.start)<=to).slice(-18).reverse();
 const visitName=v=>labels[placeKey(v)]||v.name||approximatePlace(v.lat,v.lon).name;
 return `<section class="places-insights" aria-label="Orte und Reisen — nur lokale Standortdaten">
 <div class="insight-kpi-grid"><article class="insight-kpi"><span>Aufenthaltsereignisse</span><strong>${visits.length.toLocaleString('de-AT')}</strong><small>${first?`${shortDate(first.start)} bis ${shortDate(last.end)}`:'Noch kein Standortimport'}</small></article><article class="insight-kpi"><span>Standortgruppen</span><strong>${clusters.length}</strong><small>Im gewählten Zeitraum, etwa 25-km-Gruppen</small></article><article class="insight-kpi"><span>Schlafnächte zugeordnet</span><strong>${validNights}</strong><small>Nur bei überlappenden Aufenthaltsintervallen</small></article></div>
 ${!visits.length?`<div class="places-start-here"><strong>Deine Weltkarte ist bereit – Standortdaten fehlen noch</strong><p>Die Karte ist bereits Teil von Compass. Anders als Garmin-Schlafwerte werden Google-Maps-Aufenthalte nicht automatisch übertragen. Importiere deinen Android-Timeline-Export unten unter „Standortdaten ergänzen“; die Datei bleibt lokal im Tresor.</p><p>Google Maps → Profilbild → Meine Zeitachse → Menü → Einstellungen und Datenschutz → Zeitachsendaten exportieren. Anschließend hier <strong>Timeline-JSON oder ZIP auswählen</strong>. Der Import liest Aufenthaltsintervalle, keine Bewegungsrouten.</p></div>`:''}
 <div class="insight-chart-grid places-main-grid"><article class="insight-chart-card places-map-card"><div class="insight-figure-title"><div><small>01 · THE WORLD</small><h3>Meine Aufenthaltsorte</h3></div></div>${mapGraphic(clusters,location?.key,mapRegion,mapZoom)}<p class="insight-figure-note">Lokale, zoombare Weltkarte (Natural Earth). Marker zeigen Aufenthaltsgruppen, keine lückenlose Reise- oder GPS-Route. Ländernamen und ungefähre Städteräume werden nur offline zugeordnet. Die Koordinaten verlassen nicht den verschlüsselten Vault.</p></article>
 <article class="insight-chart-card places-list-card"><div class="insight-figure-title"><div><small>02 · PLACES</small><h3>Besuchte Orte</h3></div></div>${clusters.length?`<div class="places-result-list">${clusters.slice(0,listLimit).map(p=>`<button type="button" class="places-result ${location?.key===p.key?'selected':''}" data-action="places-select" data-id="${esc(p.key)}"><span class="places-location-dot"></span><span><strong>${esc(displayName(p))}</strong><small>${p.count} Aufenthalt${p.count===1?'':'e'} · ca. ${Math.round(p.minutes/60)} h erfasst</small></span><span>→</span></button>`).join('')}</div>${clusters.length>listLimit?`<button type="button" class="secondary-btn places-more-btn" data-action="places-more">Weitere 25 Orte anzeigen (${clusters.length-listLimit} verbleibend)</button>`:''}`:'<div class="insight-no-data"><strong>Keine Aufenthalte importiert</strong><p>Exportiere deine Google Maps Timeline und wähle die Datei unten aus.</p></div>'}</article></div>
 <article class="insight-chart-card places-timeline"><div class="insight-figure-title"><div><small>03 · JOURNEY</small><h3>Reiseverlauf</h3></div><span class="insight-figure-note">Letzte ${recent.length} Aufenthalte im Zeitraum</span></div>${recent.length?`<div class="places-timeline-list">${recent.map(v=>`<div class="places-timeline-entry"><span class="places-timeline-dot"></span><div><strong>${esc(visitName(v))}</strong><small>${esc(shortDate(v.start))} – ${esc(shortDate(v.end))} · ca. ${Math.round(v.minutes/60)} h · ${v.source==='manual'?'Manuell eingetragen':v.confirmed?'Google: bestätigt':'Google: erkannt'}</small></div></div>`).join('')}</div>`:'<p class="insight-figure-note">Noch kein Reiseverlauf für den gewählten Zeitraum.</p>'}<p class="insight-figure-note">Nur aus Besuchsintervallen; keine geschätzten Wege zwischen Orten. Reisen ohne Besuchsereignisse werden nicht ergänzt.</p></article>
 ${location?`<article class="insight-chart-card places-detail"><div class="insight-figure-title"><div><small>04 · SELECTED PLACE</small><h3>${esc(displayName(location))}</h3></div></div><p class="insight-figure-note">Automatische Ortsnamen bezeichnen nur grobe Regionen; genaue Bezeichnungen bitte selbst eintragen.</p><p class="insight-figure-note">Erster Eintrag: ${esc(shortDate(location.first))} · letzter Eintrag: ${esc(shortDate(location.last))}. Die automatische Google-Zuordnung ist keine Bestätigung eines Aufenthalts.</p><form id="place-label-form" data-key="${esc(location.key)}" class="places-label-form"><label>Eigene Bezeichnung für diesen Ort<input name="name" maxlength="100" placeholder="z. B. Sydney, Graz oder Hotel" value="${esc(labels[location.key]||'')}"/></label><button type="submit" class="secondary-btn">Ort benennen</button></form></article>`:''}
 <div class="insight-chart-grid"><article class="insight-chart-card"><div class="insight-figure-title"><div><small>05 · SLEEP AND PLACE</small><h3>Schlaf nach Aufenthaltsort</h3></div></div>${sleep.length?`<div class="places-sleep-list">${sleep.slice(0,12).map(p=>`<div><span><strong>${esc(p.name||p.key)}</strong><small>${p.nights} Nacht${p.nights===1?'':'Nächte'} · ${p.confirmedNights} mit bestätigtem Aufenthalt</small></span><div class="insight-focus-track"><i style="width:${Math.min(100,p.avgMinutes/600*100).toFixed(1)}%"></i></div><b>${Math.floor(p.avgMinutes/60)} h ${String(p.avgMinutes%60).padStart(2,'0')}</b></div>`).join('')}</div>`:'<div class="insight-no-data"><strong>Noch keine belastbare Schlaf-Ort-Zuordnung</strong><p>Benötigt mindestens eine echte Garmin-Schlafnacht und einen Aufenthalt, der den Schlafmittelpunkt eindeutig umfasst.</p></div>'}<p class="insight-figure-note">Explorative Zuordnung: Google-Aufenthalte können falsch sein. Kein automatischer Nachweis des tatsächlichen Übernachtungsorts; keine kausalen Aussagen.</p></article>
 <article class="insight-chart-card"><div class="insight-figure-title"><div><small>06 · IMPORT</small><h3>Standortdaten ergänzen</h3></div></div><p class="insight-figure-note">Google Maps auf Android → Profilbild → Meine Zeitachse → ⋮ → Einstellungen & Datenschutz → Zeitachsendaten exportieren. Die Menüpunkte können je nach Version abweichen.</p><label class="secondary-btn places-upload-btn">Timeline-JSON oder ZIP auswählen<input id="places-import-input" type="file" multiple accept=".json,.zip,application/json,application/zip"/></label>${preview?`<div class="places-import-preview"><strong>${preview.visits.length} Aufenthalte erkannt</strong><p>${preview.warnings.length?preview.warnings.map(esc).join(' · '):'Nur Besuchsereignisse; Rohsignale und GPS-Routen werden verworfen.'}</p><button type="button" class="primary-btn" data-action="places-import-confirm" ${preview.visits.length?'':'disabled'}>Import übernehmen</button> <button type="button" class="secondary-btn" data-action="places-import-cancel">Abbrechen</button></div>`:''}<details class="places-manual"><summary>Aufenthalt manuell ergänzen</summary><form id="places-manual-form" class="places-manual-form"><label>Ort<input name="name" maxlength="100" placeholder="z. B. Graz" required/></label><div><label>Breitengrad<input name="lat" type="number" step="any" min="-90" max="90" required/></label><label>Längengrad<input name="lon" type="number" step="any" min="-180" max="180" required/></label></div><label>Von<input name="start" type="datetime-local" required/></label><label>Bis<input name="end" type="datetime-local" required/></label><button type="submit" class="secondary-btn">Aufenthalt speichern</button></form></details>${visits.length?'<button type="button" class="text-link places-clear" data-action="places-clear">Alle lokalen Standortdaten löschen</button>':''}<p class="insight-figure-note">Der Import bleibt vollständig lokal im verschlüsselten Vault. Kein Maps-API-Aufruf, keine Ortsauflösung über externe Server und kein Cloud-Sync. Originaldateien werden nicht gespeichert.</p></article></div>
 </section>`;
}
