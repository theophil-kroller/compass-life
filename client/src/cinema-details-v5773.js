import {parseResearchJson,normalizeResearchLink} from './event-import.js';
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
 const text=`COMPASS · FILMTEXTE UND POSTER · Metadaten-Nachrecherche.\nRecherchiere NUR diese ${portion.length} Filmtitel, die bereits als Kinovorführungen in Compass gespeichert sind. KEINE neuen Vorstellungstermine recherchieren. Titel und Filmversion anhand offizieller Kino-, Festival-, Verleih- oder Filmwebsites gegenprüfen; Verwechslungen gleichnamiger Filme vermeiden.\n\n${titles}\n\nPOSTER HABEN PRIORITÄT: Die bisherigen Recherchen lieferten Kurzbeschreibungen, aber KEINE imageUrl. Recherchiere deshalb bei JEDEM unten genannten Film zuerst auf den offiziellen Kino-/Verleih-/Filmseiten eine direkte Bilddatei. Prüfe, dass imageUrl tatsächlich eine Bilddatei als HTTPS-Ressource zurückgibt, nicht nur eine HTML-Seite oder ein Vorschaulink. Suche bei fehlendem Treffer systematisch in offiziellen Presse-/Medienbereichen; keine erfundenen URLs und keine Bilder fremder Filme. Wenn KEIN überprüfbarer und für die Anzeige zulässiger direkter Bildlink existiert, den Film in dieser Antwort lieber AUSLASSEN, statt die schon vorhandene Synopsis ohne Poster erneut zu liefern. Bei Filmen, deren Beschreibung laut Liste fehlt, kannst du zusätzlich zwei bis drei konkrete deutsche Sätze (160–350 Zeichen) zu Handlung, Thema oder dokumentarischem Gegenstand aufnehmen; wenn Beschreibung bereits vorhanden: bitte NICHT erneut liefern. Quelle als echte HTTPS-Seite in sourceUrl, Posterdatei unter imageUrl. Maximal 20 Filme, exakt die gelisteten Titel; KEINE neuen Spielzeiten.
Falls überhaupt keine verwendbare Posterdatei verifizierbar ist: Gib {\"films\":[]} zurück. Auf keinen Fall Bildlinks raten oder Beispieldomains ausgeben.\n\nAUSGABE AUSSCHLIESSLICH als valides JSON ohne Markdown:\n{"films":[{"title":"Filmtitel exakt wie oben","imageUrl":"https://offizielle-bildquelle.example/poster.jpg","sourceUrl":"https://offizielle-filmquelle.example/echte-seite"}]}\nDie .example-Adressen sind Platzhalter und dürfen NIEMALS übernommen werden. Mindestens eines von description oder imageUrl ist erforderlich; beide optional einzeln. Maximal ${portion.length} Filmobjekte, keine Veranstaltungs-JSON-Einträge.`;
 return {text,next:start+portion.length>=missing.length?0:start+portion.length,count:portion.length,total:missing.length};
}
function cleanRaw(raw){let s=raw.trim().replace(/^\uFEFF/,'');if(/^```(?:json)?\s*/i.test(s))s=s.replace(/^```(?:json)?\s*/i,'').replace(/\s*```\s*$/,'');return s;}
export function isCinemaDetailsJSON(raw){if(typeof raw!=='string')return false;try{const data=parseResearchJson(raw);return !!data&&!Array.isArray(data)&&Array.isArray(data.films);}catch{return false;}}
export function parseCinemaDetailsImport(raw,existing){
 if(typeof raw!=='string'||raw.length>4000000)throw Error('Film-Metadaten JSON zu groß.');
 let data;try{data=parseResearchJson(raw);}catch(ex){throw Error('Film-Metadaten: '+ex.message);}
 if(!Array.isArray(data?.films)||data.films.length>120)throw Error('Erwartet "films" mit 1 bis 120 Einträgen.');
 const knownFilms=new Set(groupCinemaScreenings(existing).map(x=>x.key)),entries=[],seen=new Set();let unmatched=0,duplicates=0;
 for(const [i,f] of data.films.entries()){
  if(!f||typeof f!=='object'||Array.isArray(f))throw Error(`Film ${i+1}: ungültiges Objekt.`);
  const title=n(f.title),description=meaningfulFilmDescription(f.description),sourceUrl=normalizeResearchLink(n(f.sourceUrl)),imageUrl=f.imageUrl?normalizeResearchLink(n(f.imageUrl)):'';
  if(title.length<2||title.length>160||(!description&&!imageUrl)||description.length>420||!validHTTPS(sourceUrl)||(imageUrl&&!validHTTPS(imageUrl)))throw Error(`Film ${i+1} (${title||'ohne Titel'}): echte Kurzbeschreibung ODER Poster, HTTPS-Beleg und optional gültige Bild-URL erforderlich.`);
  const key=cinemaFilmKey(title);if(seen.has(key)){duplicates++;continue;}seen.add(key);
  if(!knownFilms.has(key)){unmatched++;continue;}
  entries.push({title,key,...(description?{description}:{}),sourceUrl,...(imageUrl?{imageUrl}:{})});
 }
 return {kind:'film-details',total:data.films.length,entries,unmatched,duplicates,affected:existing.filter(e=>isCinemaEvent(e)&&entries.some(f=>f.key===cinemaFilmKey(e.title))).length};
}
export function enrichCinemaEvent(event,entry,at){
 if(!isCinemaEvent(event)||cinemaFilmKey(event.title)!==entry.key)return event;
 return {...event,...(entry.description?{description:entry.description,synopsisSourceUrl:entry.sourceUrl,synopsisImportedAt:at}:{}),...(entry.imageUrl?{imageUrl:entry.imageUrl,posterSourceUrl:entry.sourceUrl,posterImportedAt:at}:{} )};
}
