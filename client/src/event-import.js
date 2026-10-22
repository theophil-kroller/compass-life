// Explicitly sourced event imports, not live availability claims.
export const EVENT_CATEGORIES=['Kultur','Museum','Ausstellung','Kino','Filmfestival','Konzert','Theater','Oper','Ballett','Musical','Kabarett','Festival','Sport','Fußball','Basketball','Tanz','Zouk','Kizomba','Bachata','Contact Improvisation','Bujinkan','Mountainbike','BMX','Wintersport','Skifahren','Langlaufen','Rodeln','Workshop','Shibari','Tantra','Körperarbeit','Sonstiges'];
const aliases={Fussball:'Fußball',Football:'Fußball',Soccer:'Fußball',Tennis:'Sport',Musik:'Konzert',Cabaret:'Kabarett',Comedy:'Kabarett','Stand-up':'Kabarett',Standup:'Kabarett',Social:'Tanz',Tanzabend:'Tanz',BujinkanSeminar:'Bujinkan',Ninjutsu:'Bujinkan',MTB:'Mountainbike',Mountainbiking:'Mountainbike',MountainbikeEvent:'Mountainbike',Arthouse:'Kino',Film:'Kino',KinoFilm:'Kino',Contact:'Contact Improvisation',Kinbaku:'Shibari',Embodiment:'Körperarbeit'};
const validStartTime=t=>typeof t==='string'&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(t);
const iso=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const norm=s=>s.trim().toLocaleLowerCase('de').replace(/\s+/g,' ');
export const discoveryPrompt=`Recherchiere wirklich angekündigte Veranstaltungen der nächsten 60 Tage; für größere Festivals, Tanzwochenenden und Budō-/Bujinkan-Camps auch die nächsten 6 Monate. Suche getrennt nach (1) Graz und Umgebung, (2) Wien, (3) Österreichweit, (4) relevantem Europa (besonders Polen, Tschechien, Slowakei, Deutschland, Slowenien). Berücksichtige Oper, Theater, Ballett, Musical, Kino, Konzerte, Festivals, Fußball/Sport und ausdrücklich Kabarett/Stand-up. Suche AUCH Tanzveranstaltungen: Zouk, Brazilian Zouk, Kizomba, Bachata, Socials, Workshops, Conny und Dado, Wien und geeignete Events in Polen/Tschechien. Suche AUCH Bujinkan/Bujinkan Budō Taijutsu (z. B. Bujū Camp Österreich, Tai Kai, Seminare mit japanischen Shihan oder Gastlehrern in Österreich/Europa). Nur Veranstaltungen mit belegbarem Termin, Ort und offizieller Veranstalter- oder Ticketquelle aufnehmen. KEIN Event erfinden: nenne weder Termine für Conny/Dado noch Bujinkan-Meister, wenn kein belegbarer Event existiert. Gib AUSSCHLIESSLICH gültiges JSON ohne Markdown zurück: {"events":[{"title":"...","date":"YYYY-MM-DD","city":"Wien","country":"Österreich","venue":"...","category":"Kabarett","description":"Maximal zwei kurze, belegte Sätze: Worum geht es und was erwartet Besucher?","sourceUrl":"https://...","imageUrl":"https://..."}]}. Zulässige Kategorien: ${EVENT_CATEGORIES.join(', ')}. Verwende 'Zouk', 'Kizomba', 'Bachata', 'Bujinkan' und 'Kabarett', wenn passend, andernfalls 'Tanz' oder 'Sport'. imageUrl ist OPTIONAL: ausschließlich direkte HTTPS-Bild-URLs von offiziellen Quellen, deren Verwendung zulässig ist, sonst das Feld weglassen. description ebenfalls optional, wenn das Programm nicht verlässlich beschrieben wird. Country optional für alte Einträge, bei europäischen Reisen aber unbedingt angeben. Prüfe für jeden Eintrag Datum und Quelle. Keine hypothetischen Events; max. 250 Einträge.`;
// Legacy keys stay stable; only precisely timed cinema screenings gain a compact venue/time discriminator.
function screeningHash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
export function eventKey(e){const base=[norm(e.title),e.date,norm(e.city)].join('|');if(['Kino','Filmfestival'].includes(e.category)&&e.startTime&&e.venue){return [norm(e.title).slice(0,124),e.date,norm(e.city).slice(0,74),'screen-'+screeningHash(norm(e.venue)+'|'+e.startTime)].join('|');}return base;}
export function normalizeResearchLink(link){return typeof link==='string'?link.replace(/\\([:./_?&=%#-])/g,'$1'):link;}
function httpsUrl(link){if(typeof link!=='string'||link.length>500||!/^https:\/\//.test(link))return false;try{const u=new URL(link);return u.protocol==='https:'&&!!u.hostname.includes('.')&&!u.username&&!u.password;}catch{return false;}}
const countryName=s=>typeof s==='string'?s.trim().slice(0,80):'';
export function eventCountry(e){if(e.country)return e.country;return ['Graz','Wien','Vienna','Linz','Salzburg','Innsbruck','Klagenfurt','Villach','St. Pölten','Leoben','Seiersberg'].includes(e.city)?'Österreich':'';}
export function eventArea(e){const country=eventCountry(e).toLocaleLowerCase('de');const city=String(e.city||'').toLocaleLowerCase('de');if(['graz','seiersberg','feldkirchen bei graz','gratwein','gratkorn'].includes(city))return 'graz';if(city==='wien'||city==='vienna')return 'vienna';if(['österreich','austria','at'].includes(country))return 'austria';return country?'europe':'unknown';}

export function validEvent(e){return Boolean(e&&typeof e==='object'&&!Array.isArray(e)&&typeof e.title==='string'&&e.title.trim().length>1&&e.title.length<=160&&iso(e.date)&&typeof e.city==='string'&&e.city.trim().length>1&&e.city.length<=80&&typeof e.venue==='string'&&e.venue.length<=140&&EVENT_CATEGORIES.includes(e.category)&&httpsUrl(e.sourceUrl)&&(!e.endDate||iso(e.endDate)&&e.endDate>=e.date)&&(!e.description||typeof e.description==='string'&&e.description.length<=420)&&(!e.imageUrl||httpsUrl(e.imageUrl))&&(!e.country||typeof e.country==='string'&&e.country.length<=80)&&(!e.startTime||validStartTime(e.startTime))&&(!e.lastImportedAt||typeof e.lastImportedAt==='string'&&Number.isFinite(Date.parse(e.lastImportedAt)))&&(!e.researchGroup||typeof e.researchGroup==='string'&&e.researchGroup.length<=60)&&(!e.synopsisSourceUrl||httpsUrl(e.synopsisSourceUrl))&&(!e.synopsisImportedAt||typeof e.synopsisImportedAt==='string'&&Number.isFinite(Date.parse(e.synopsisImportedAt))));}
function normalizeRaw(raw){let text=raw.trim().replace(/^\uFEFF/,'');if(/^```(?:json)?\s*/i.test(text))text=text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```\s*$/,'').trim();return text;}
/**
 * Repair only malformed, presentation-style backslash escapes inside JSON strings.
 * ChatGPT sometimes returns sourceUrl = "https\\://www\\.museum\\_name.at/...".
 * Never remove JSON-structural escapes, never alter text outside string literals.
 */
export function repairResearchJsonEscapes(text){
 let out='',inside=false;
 const punctuation=new Set([':', '.', '_', '-', '?', '&', '=', '#', '%']);
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(!inside){out+=c;if(c==='"')inside=true;continue;}
  if(c==='\\'&&i+1<text.length){
   const next=text[i+1];
   if(punctuation.has(next)){out+=next;i++;continue;}
   // Retain valid JSON escapes, including \", \\, \/, \n and \uXXXX.
   out+=c+next;i++;continue;
  }
  out+=c;if(c==='"')inside=false;
 }
 return out;
}
export function parseResearchJson(raw){
 if(typeof raw!=='string'||raw.length>4000000)throw Error('JSON zu groß (maximal 4 MB).');
 const text=normalizeRaw(raw);
 try{return JSON.parse(text);}catch(ex){
  try{return JSON.parse(repairResearchJsonEscapes(text));}
  catch{throw Error('Kein gültiges JSON (JSON-Syntaxfehler): '+String(ex.message).slice(0,180)+' · Bitte vollständiges JSON mit "events" oder "films" einfügen.');}
 }
}
export function parseEventImport(raw,existing=[]){
 if(typeof raw!=='string'||raw.length>4000000)throw Error('JSON zu groß (maximal 4 MB).');
 const payload=parseResearchJson(raw);const events=Array.isArray(payload)?payload:payload?.events;
 if(!Array.isArray(events)||events.length>2000)throw Error('Erwartet {"events":[...]} mit maximal 2.000 Einträgen. Für Filmbeschreibungen {"films":[...]} verwenden.');
 const existingKeys=new Set(existing.filter(validEvent).map(eventKey));const known=new Set(existingKeys),added=[],refreshed=[];let duplicates=0;
 for(let i=0;i<events.length;i++){
  const item=events[i];if(!item||typeof item!=='object'||Array.isArray(item))throw Error(`Eintrag ${i+1}: kein Veranstaltungsobjekt.`);
  const clean={title:String(item.title||'').trim(),date:item.date??item.startDate??item.start_date,city:String(item.city||'').trim(),venue:String(item.venue||'').trim(),category:aliases[item.category]||item.category,sourceUrl:normalizeResearchLink(item.sourceUrl??item.sourceURL)};
  if(item.country!=null)clean.country=countryName(item.country);
  if(item.endDate!=null||item.end_date!=null)clean.endDate=item.endDate??item.end_date;
  if(item.startTime!=null||item.start_time!=null)clean.startTime=String(item.startTime??item.start_time).trim();
  if(item.imageUrl!=null||item.posterUrl!=null)clean.imageUrl=normalizeResearchLink(item.imageUrl??item.posterUrl);
  if(item.description!=null)clean.description=String(item.description).trim().slice(0,420);
  if(!validEvent(clean)){
    const bad=[];
    if(clean.title.length<2||clean.title.length>160)bad.push('Titel');
    if(!iso(clean.date))bad.push('Datum (YYYY-MM-DD)');
    if(clean.endDate&&(!iso(clean.endDate)||clean.endDate<clean.date))bad.push('Enddatum');
    if(clean.city.length<2||clean.city.length>80)bad.push('Stadt');
    if(clean.venue.length>140)bad.push('Ort');
    if(!EVENT_CATEGORIES.includes(clean.category))bad.push(`Kategorie "${clean.category||'leer'}"`);
    if(!httpsUrl(clean.sourceUrl))bad.push('HTTPS-Quellenlink');
    if(clean.startTime&&!validStartTime(clean.startTime))bad.push('Beginn (HH:MM)');
    if(clean.imageUrl&&!httpsUrl(clean.imageUrl))bad.push('HTTPS-Bildlink (imageUrl)');
    throw Error(`Eintrag ${i+1} (${clean.title||'ohne Titel'}): Bitte ${bad.join(', ')||'Quellenlink oder Beschreibung'} prüfen.`);
  }
  const key=eventKey(clean);if(known.has(key)){duplicates++;if(existingKeys.has(key)&&!refreshed.some(x=>eventKey(x)===key))refreshed.push(clean);continue;}known.add(key);added.push(clean);
 }
 return {added,refreshed,duplicates,total:events.length,researchGroup:typeof payload?.researchGroup==='string'?payload.researchGroup.slice(0,60):''};
}
export function upcomingImportedEvents(items,today){return (items||[]).filter(validEvent).filter(e=>(e.endDate||e.date)>=today).sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'de'));}
export const eventAppearance=(category)=>({Museum:['🏛️','culture'],Ausstellung:['🖼️','culture'],Filmfestival:['🎞️','cinema'],Fußball:['⚽','sport'],Basketball:['🏀','sport'],Mountainbike:['🚵','sport'],BMX:['🚴','sport'],Wintersport:['⛷️','sport'],Skifahren:['🎿','sport'],Langlaufen:['🎿','sport'],Rodeln:['🛷','sport'],'Contact Improvisation':['🌀','dance'],Workshop:['🕯️','culture'],Shibari:['🪢','culture'],Tantra:['🌿','culture'],Körperarbeit:['🧘','culture'],Sport:['⚽','sport'],Oper:['🎼','stage'],Theater:['🎭','stage'],Ballett:['🩰','stage'],Musical:['🎤','stage'],Kabarett:['🎙️','cabaret'],Konzert:['🎵','concert'],Kino:['🎬','cinema'],Festival:['🎪','festival'],Kultur:['🏛️','culture'],Tanz:['💃','dance'],Zouk:['🪇','dance'],Kizomba:['🌙','dance'],Bachata:['💃','dance'],Bujinkan:['🥷','budo'],Sonstiges:['✨','other']})[category]||['✨','other'];

export const discoveryPromptRegional=discoveryPrompt.replace('Recherchiere wirklich angekündigte Veranstaltungen der nächsten 60 Tage; für größere Festivals, Tanzwochenenden und Budō-/Bujinkan-Camps auch die nächsten 6 Monate.', 'Recherchiere wirklich angekündigte Veranstaltungen in Graz, Wien und Österreich der nächsten 30 Tage.').replace('max. 250 Einträge.', 'max. 60 Einträge.');
export const discoveryPromptTravel=discoveryPrompt.replace('Recherchiere wirklich angekündigte Veranstaltungen der nächsten 60 Tage; für größere Festivals, Tanzwochenenden und Budō-/Bujinkan-Camps auch die nächsten 6 Monate.', 'Recherchiere gezielt nur Zouk, Kizomba, Bachata, Social-Dance-Festivals, Bujinkan-Camps und Bujinkan-Seminare in Österreich, Deutschland, Polen, Tschechien, Slowakei und Slowenien in den nächsten 6 Monaten.').replace('max. 250 Einträge.', 'max. 70 Einträge.');
