// Compass 0.5.77.3 – verified film synopses and poster enrichment, without resubmitting showtimes.
import {cinemaFilmKey,groupCinemaScreenings,isCinemaEvent,meaningfulFilmDescription} from './cinema-program-v5772.js';

const n=s=>String(s||'').trim();
const validHTTPS=s=>{if(typeof s!=='string'||s.length>500||!/^https:\/\//i.test(s))return false;try{const u=new URL(s);return u.protocol==='https:'&&u.hostname.includes('.')&&!u.username&&!u.password;}catch{return false;}};
export const cinemaDayShift=(day,offset)=>{if(!/^\d{4}-\d\d-\d\d$/.test(String(day)))return '';const t=new Date(day+'T12:00:00Z');if(!Number.isFinite(+t))return '';t.setUTCDate(t.getUTCDate()+offset);return t.toISOString().slice(0,10);};
export const cinemaForDay=(events,day)=>events.filter(e=>isCinemaEvent(e)&&e.date===day);
export const missingFilmInfo=films=>films.filter(f=>!f.description||!f.imageUrl).sort((a,b)=>Number(!b.description)-Number(!a.description)||a.title.localeCompare(b.title,'de-AT'));
export function cinemaEnrichmentPrompt(films,offset=0,limit=20){
 const missing=missingFilmInfo(films),start=offset>=missing.length?0:offset,portion=missing.slice(start,start+limit);
 if(!portion.length)return {text:'',next:0,count:0,total:0};
 const titles=portion.map((f,i)=>`${i+1}. ${f.title} (${!f.description?'Kurzbeschreibung fehlt':'Beschreibung vorhanden'}; ${!f.imageUrl?'Poster fehlt':'Poster vorhanden'}) · Kinoquelle: ${f.screenings[0]?.sourceUrl||'keine'}`).join('\n');
 const text=`COMPASS · FILMTEXTE UND POSTER · Metadaten-Nachrecherche.\nRecherchiere NUR diese ${portion.length} Filmtitel, die bereits als Kinovorführungen in Compass gespeichert sind. KEINE neuen Vorstellungstermine recherchieren. Titel und Filmversion anhand offizieller Kino-, Festival-, Verleih- oder Filmwebsites gegenprüfen; Verwechslungen gleichnamiger Filme vermeiden.\n\n${titles}\n\nFür JEDEN eindeutig identifizierten Film: Gib in 'description' 2–3 aussagekräftige deutsche Sätze (ca. 160–350 Zeichen) zu Handlung, Thema oder dokumentarischem Gegenstand an. Beschreibe wirklich den Inhalt, NICHT 'Kinofilm', 'Dokumentarfilm', 'Programmkinovorführung' oder reine Genre-/Sprachangaben. Nur nachweisbare Inhalte sachlich in eigenen Worten zusammenfassen, nicht aus dem Titel etwas erfinden, keine Plots verraten. In 'sourceUrl' den echten HTTPS-Beleg für die Inhaltsangabe angeben. Wenn kein verifizierbarer Inhalt auffindbar ist, den Film WEGLASSEN; nicht raten. OPTIONAL 'imageUrl': direkt erreichbare offizielle HTTPS-Poster-Bilddatei, deren Darstellung/Weiterverwendung vom Rechteinhaber zulässig ist. Keine Suchergebnis-Seiten, keine HTML-Seiten, keine fiktiven URLs; wenn Bildrechte oder Direktlinks unklar sind, 'imageUrl' weglassen.\n\nAUSGABE AUSSCHLIESSLICH als valides JSON ohne Markdown:\n{"films":[{"title":"Filmtitel exakt wie oben","description":"Zwei bis drei konkrete Sätze zur Handlung oder zum Inhalt.","sourceUrl":"https://offizielle-filmquelle.example/echte-seite","imageUrl":"https://offizielle-bildquelle.example/poster.jpg"}]}\nDie .example-Adressen sind Platzhalter und dürfen NIEMALS übernommen werden. imageUrl optional. Maximal ${portion.length} Filmobjekte, keine Veranstaltungs-JSON-Einträge.`;
 return {text,next:start+portion.length>=missing.length?0:start+portion.length,count:portion.length,total:missing.length};
}
function cleanRaw(raw){let s=raw.trim().replace(/^\uFEFF/,'');if(/^```(?:json)?\s*/i.test(s))s=s.replace(/^```(?:json)?\s*/i,'').replace(/\s*```\s*$/,'');return s;}
export function isCinemaDetailsJSON(raw){if(typeof raw!=='string')return false;try{const data=JSON.parse(cleanRaw(raw));return !!data&&!Array.isArray(data)&&Array.isArray(data.films);}catch{return false;}}
export function parseCinemaDetailsImport(raw,existing){
 if(typeof raw!=='string'||raw.length>4000000)throw Error('Film-Metadaten JSON zu groß.');
 let data;try{data=JSON.parse(cleanRaw(raw));}catch{throw Error('Film-Metadaten müssen gültiges JSON mit "films" sein.');}
 if(!Array.isArray(data?.films)||data.films.length>120||data.films.length<1)throw Error('Erwartet "films" mit 1 bis 120 Einträgen.');
 const knownFilms=new Set(groupCinemaScreenings(existing).map(x=>x.key)),entries=[],seen=new Set();let unmatched=0,duplicates=0;
 for(const [i,f] of data.films.entries()){
  if(!f||typeof f!=='object'||Array.isArray(f))throw Error(`Film ${i+1}: ungültiges Objekt.`);
  const title=n(f.title),description=meaningfulFilmDescription(f.description),sourceUrl=n(f.sourceUrl),imageUrl=f.imageUrl?n(f.imageUrl):'';
  if(title.length<2||title.length>160||!description||description.length>420||!validHTTPS(sourceUrl)||(imageUrl&&!validHTTPS(imageUrl)))throw Error(`Film ${i+1} (${title||'ohne Titel'}): echte Inhaltsbeschreibung (28–420 Zeichen), HTTPS-Quelle und optional gültige Bild-URL erforderlich.`);
  const key=cinemaFilmKey(title);if(seen.has(key)){duplicates++;continue;}seen.add(key);
  if(!knownFilms.has(key)){unmatched++;continue;}
  entries.push({title,key,description,sourceUrl,...(imageUrl?{imageUrl}:{})});
 }
 return {kind:'film-details',total:data.films.length,entries,unmatched,duplicates,affected:existing.filter(e=>isCinemaEvent(e)&&entries.some(f=>f.key===cinemaFilmKey(e.title))).length};
}
export function enrichCinemaEvent(event,entry,at){
 if(!isCinemaEvent(event)||cinemaFilmKey(event.title)!==entry.key)return event;
 return {...event,description:entry.description,...(entry.imageUrl?{imageUrl:entry.imageUrl}:{}),synopsisSourceUrl:entry.sourceUrl,synopsisImportedAt:at};
}
