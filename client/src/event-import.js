// Explicitly sourced event imports. No scraping or AI-generated availability claims.
const allowed=['Kultur','Kino','Konzert','Theater','Oper','Festival','Sport','Sonstiges'];
const iso=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const norm=s=>s.trim().toLocaleLowerCase('de').replace(/\s+/g,' ');
export const discoveryPrompt=`Recherchiere tatsächlich angekündigte Veranstaltungen in Graz und Wien in den nächsten 30 Tagen (Oper, Theater, Kino, Konzerte, Festivals, Sport). Verwende Veranstalterseiten oder offizielle Kalender. Gib AUSSCHLIESSLICH valides JSON zurück: {"events":[{"title":"...","date":"YYYY-MM-DD","city":"Graz","venue":"...","category":"Kultur","sourceUrl":"https://..."}]}. Für jedes Event muss date und sourceUrl zur Veranstaltung passen. Keine hypothetischen Veranstaltungen oder erfundenen Daten. Maximal 50 Einträge.`;
export function eventKey(e){return [norm(e.title),e.date,norm(e.city)].join('|');}
export function validEvent(e){return Boolean(e&&typeof e==='object'&&!Array.isArray(e)&&typeof e.title==='string'&&e.title.trim().length>1&&e.title.length<=160&&iso(e.date)&&typeof e.city==='string'&&e.city.trim().length>1&&e.city.length<=80&&typeof e.venue==='string'&&e.venue.length<=140&&allowed.includes(e.category)&&typeof e.sourceUrl==='string'&&e.sourceUrl.length<=500&&/^https:\/\//.test(e.sourceUrl)&&(()=>{try{const u=new URL(e.sourceUrl);return !!u.hostname&&!!u.hostname.includes('.');}catch{return false;}})());}
export function parseEventImport(raw, existing=[]){
 if(typeof raw!=='string'||raw.length>200000)throw Error('JSON zu groß (maximal 200 KB).');
 let payload;try{payload=JSON.parse(raw);}catch{throw Error('Kein gültiges JSON.');}
 const events=Array.isArray(payload)?payload:payload?.events;
 if(!Array.isArray(events)||events.length>100)throw Error('Erwartet JSON mit events (maximal 100).');
 const known=new Set(existing.filter(validEvent).map(eventKey)),added=[];let duplicates=0;
 for(const item of events){
  if(!validEvent(item))throw Error('Ein Eintrag benötigt Titel, Datum, Ort, Kategorie und einen HTTPS-Quellenlink.');
  const itemClean={title:item.title.trim(),date:item.date,city:item.city.trim(),venue:item.venue.trim(),category:item.category,sourceUrl:item.sourceUrl};
  const key=eventKey(itemClean);if(known.has(key)){duplicates++;continue;}
  known.add(key);added.push(itemClean);
 }
 return {added,duplicates};
}
export function upcomingImportedEvents(items,today){return (items||[]).filter(validEvent).filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'de'));}
