// Compass 0.5.77.2 — one film per card, with all sourced screenings preserved.
// Pure display grouping: never modifies stored event objects or their synchronization keys.
const n=s=>String(s||'').trim();
const generic=/^(?:(?:programm|sonder)?kino(?:film|vorführung)|(?:film|kino)vorführung|(?:dokumentar|spiel|familien|kinder|animations|kurz|kunst|independent|arthouse|abendfüllender)film|(?:kinder- und )?familienfilm|filmpremiere|originalfassung|originalversion|om[uU]|filmfestival|filmabend|veranstaltung)(?:\s+in\s+originalfassung)?(?:\s+mit\s+deutschen\s+untertiteln)?(?:\s*\(om[uU]\))?\.?$/i;
export function meaningfulFilmDescription(value){
 const valueText=n(value).replace(/\s+/g,' ');
 if(!valueText||valueText.length<28||generic.test(valueText))return '';
 if(/^(?:kinofilm|dokumentarfilm|kinovorführung|programmkinovorführung|originalfassung|filmvorführung)[\s.,;:!()\w-]*$/i.test(valueText)&&valueText.length<100)return '';
 return valueText;
}
export function preferredFilmDescription(screenings){
 const descriptions=(screenings||[]).map(e=>meaningfulFilmDescription(e.description)).filter(Boolean);
 return descriptions.sort((a,b)=>b.length-a.length)[0]||'';
}

export const CINEMA_CATEGORIES = Object.freeze(['Kino', 'Filmfestival']);
export const isCinemaEvent = event => CINEMA_CATEGORIES.includes(event?.category);
export function cinemaFilmKey(title) {
 return String(title || '').normalize('NFKC').trim().toLocaleLowerCase('de-AT').replace(/\s+/g,' ');
}
function compareShowings(a,b) {
 return a.date.localeCompare(b.date) || String(a.startTime||'99:99').localeCompare(String(b.startTime||'99:99')) || a.city.localeCompare(b.city,'de') || a.venue.localeCompare(b.venue,'de');
}
export function groupCinemaScreenings(events=[]) {
 const films = new Map();
 for (const event of events) {
  if (!isCinemaEvent(event) || typeof event.title !== 'string' || !event.title.trim()) continue;
  const key=cinemaFilmKey(event.title);
  if(!films.has(key))films.set(key,{key,title:event.title.trim(),screenings:[],venues:new Set(),cities:new Set()});
  const film=films.get(key);
  film.screenings.push(event);
  if(event.venue)film.venues.add(`${event.city}::${event.venue}`);
  if(event.city)film.cities.add(event.city);
 }
 return [...films.values()].map(film=>{
  film.screenings.sort(compareShowings);
  film.venues=[...film.venues]; film.cities=[...film.cities];
  film.description=preferredFilmDescription(film.screenings);
  film.imageUrl=film.screenings.find(e=>e.imageUrl)?.imageUrl||'';
  film.synopsisSourceUrl=film.screenings.find(e=>e.synopsisSourceUrl)?.synopsisSourceUrl||'';
  film.lastImportedAt=film.screenings.reduce((max,e)=>String(e.lastImportedAt||'')>max?String(e.lastImportedAt):max,'');
  film.firstDate=film.screenings[0]?.date||'';
  return film;
 }).sort((a,b)=>a.title.localeCompare(b.title,'de-AT',{sensitivity:'base'}));
}
export function cinemaOverview(events=[]) {
 const screenings=events.filter(isCinemaEvent);
 const films=groupCinemaScreenings(screenings);
 return {titles:films.length,screenings:screenings.length,venues:new Set(screenings.map(e=>e.venue&&`${e.city}|${e.venue}`).filter(Boolean)).size,otherEvents:events.length-screenings.length};
}
export function cinemaSearch(films,query=''){
 const needle=String(query).trim().toLocaleLowerCase('de-AT');
 if(!needle)return films;
 return films.filter(f=>[f.title,...f.screenings.flatMap(e=>[e.venue,e.city,e.description])].some(x=>String(x||'').toLocaleLowerCase('de-AT').includes(needle)));
}
export function cinemaCoverageWarning({titles,screenings}) {
 return screenings>=20&&titles>0&&screenings/titles>=12
  ?`Achtung: ${screenings} Kinotermine, aber nur ${titles} verschiedene Filmtitel. Das importierte JSON enthält viele Vorführungen derselben Filme. Ob weitere Filmtitel in den Kinospielplänen fehlen, muss durch eine erneute Recherche geprüft werden.`
  :'';
}
