// Explicitly sourced event imports, not live availability claims.
export const EVENT_CATEGORIES=['Kultur','Kino','Konzert','Theater','Oper','Ballett','Musical','Kabarett','Festival','Sport','Tanz','Zouk','Kizomba','Bachata','Bujinkan','Sonstiges'];
const aliases={Fussball:'Sport',Fußball:'Sport',Tennis:'Sport',Musik:'Konzert',Ausstellung:'Kultur',Cabaret:'Kabarett',Comedy:'Kabarett','Stand-up':'Kabarett',Standup:'Kabarett',Social:'Tanz',Tanzabend:'Tanz',BujinkanSeminar:'Bujinkan',Ninjutsu:'Bujinkan'};
const iso=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;
const norm=s=>s.trim().toLocaleLowerCase('de').replace(/\s+/g,' ');
export const discoveryPrompt=`Recherchiere wirklich angekündigte Veranstaltungen der nächsten 60 Tage; für größere Festivals, Tanzwochenenden und Budō-/Bujinkan-Camps auch die nächsten 6 Monate. Suche getrennt nach (1) Graz und Umgebung, (2) Wien, (3) Österreichweit, (4) relevantem Europa (besonders Polen, Tschechien, Slowakei, Deutschland, Slowenien). Berücksichtige Oper, Theater, Ballett, Musical, Kino, Konzerte, Festivals, Fußball/Sport und ausdrücklich Kabarett/Stand-up. Suche AUCH Tanzveranstaltungen: Zouk, Brazilian Zouk, Kizomba, Bachata, Socials, Workshops, Conny und Dado, Wien und geeignete Events in Polen/Tschechien. Suche AUCH Bujinkan/Bujinkan Budō Taijutsu (z. B. Bujū Camp Österreich, Tai Kai, Seminare mit japanischen Shihan oder Gastlehrern in Österreich/Europa). Nur Veranstaltungen mit belegbarem Termin, Ort und offizieller Veranstalter- oder Ticketquelle aufnehmen. KEIN Event erfinden: nenne weder Termine für Conny/Dado noch Bujinkan-Meister, wenn kein belegbarer Event existiert. Gib AUSSCHLIESSLICH gültiges JSON ohne Markdown zurück: {"events":[{"title":"...","date":"YYYY-MM-DD","city":"Wien","country":"Österreich","venue":"...","category":"Kabarett","description":"Maximal zwei kurze, belegte Sätze: Worum geht es und was erwartet Besucher?","sourceUrl":"https://...","imageUrl":"https://..."}]}. Zulässige Kategorien: ${EVENT_CATEGORIES.join(', ')}. Verwende 'Zouk', 'Kizomba', 'Bachata', 'Bujinkan' und 'Kabarett', wenn passend, andernfalls 'Tanz' oder 'Sport'. imageUrl ist OPTIONAL: ausschließlich direkte HTTPS-Bild-URLs von offiziellen Quellen, deren Verwendung zulässig ist, sonst das Feld weglassen. description ebenfalls optional, wenn das Programm nicht verlässlich beschrieben wird. Country optional für alte Einträge, bei europäischen Reisen aber unbedingt angeben. Prüfe für jeden Eintrag Datum und Quelle. Keine hypothetischen Events; max. 100 Einträge.`;
export function eventKey(e){return [norm(e.title),e.date,norm(e.city)].join('|');}
function normalizeLink(link){return typeof link==='string'?link.replace(/\\([:./])/g,'$1'):link;}
function httpsUrl(link){if(typeof link!=='string'||link.length>500||!/^https:\/\//.test(link))return false;try{const u=new URL(link);return u.protocol==='https:'&&!!u.hostname.includes('.')&&!u.username&&!u.password;}catch{return false;}}
const countryName=s=>typeof s==='string'?s.trim().slice(0,80):'';
export function eventCountry(e){if(e.country)return e.country;return ['Graz','Wien','Vienna','Linz','Salzburg','Innsbruck','Klagenfurt','Villach','St. Pölten','Leoben','Seiersberg'].includes(e.city)?'Österreich':'';}
export function eventArea(e){const country=eventCountry(e).toLocaleLowerCase('de');const city=String(e.city||'').toLocaleLowerCase('de');if(['graz','seiersberg','feldkirchen bei graz','gratwein','gratkorn'].includes(city))return 'graz';if(city==='wien'||city==='vienna')return 'vienna';if(['österreich','austria','at'].includes(country))return 'austria';return country?'europe':'unknown';}

export function validEvent(e){return Boolean(e&&typeof e==='object'&&!Array.isArray(e)&&typeof e.title==='string'&&e.title.trim().length>1&&e.title.length<=160&&iso(e.date)&&typeof e.city==='string'&&e.city.trim().length>1&&e.city.length<=80&&typeof e.venue==='string'&&e.venue.length<=140&&EVENT_CATEGORIES.includes(e.category)&&httpsUrl(e.sourceUrl)&&(!e.description||typeof e.description==='string'&&e.description.length<=420)&&(!e.imageUrl||httpsUrl(e.imageUrl))&&(!e.country||typeof e.country==='string'&&e.country.length<=80));}
function normalizeRaw(raw){let text=raw.trim().replace(/^\uFEFF/,'');if(/^```(?:json)?\s*/i.test(text))text=text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```\s*$/,'').trim();return text;}
function parseJson(raw){
 let text=normalizeRaw(raw);try{return JSON.parse(text);}catch(ex){
  // Only repair the documented AI typo inside JSON string literals (\\: \\. \\/), never remove structural characters.
  const cleaned=text.replace(/\\([:./])/g,'$1');
  try{return JSON.parse(cleaned);}catch{throw Error('Kein gültiges JSON. Entferne einleitende Kommentare; erwarte {"events":[...]}. '+String(ex.message).slice(0,110));}
 }
}
export function parseEventImport(raw,existing=[]){
 if(typeof raw!=='string'||raw.length>200000)throw Error('JSON zu groß (maximal 200 KB).');
 const payload=parseJson(raw);const events=Array.isArray(payload)?payload:payload?.events;
 if(!Array.isArray(events)||events.length>100)throw Error('Erwartet JSON mit "events" (maximal 100 Einträge).');
 const known=new Set(existing.filter(validEvent).map(eventKey)),added=[];let duplicates=0;
 for(let i=0;i<events.length;i++){
  const item=events[i];if(!item||typeof item!=='object'||Array.isArray(item))throw Error(`Eintrag ${i+1}: kein Veranstaltungsobjekt.`);
  const clean={title:String(item.title||'').trim(),date:item.date,city:String(item.city||'').trim(),venue:String(item.venue||'').trim(),category:aliases[item.category]||item.category,sourceUrl:normalizeLink(item.sourceUrl)};
  if(item.country!=null)clean.country=countryName(item.country);
  if(item.imageUrl!=null)clean.imageUrl=normalizeLink(item.imageUrl);
  if(item.description!=null)clean.description=String(item.description).trim().slice(0,420);
  if(!validEvent(clean)){
    const bad=[];
    if(clean.title.length<2||clean.title.length>160)bad.push('Titel');
    if(!iso(clean.date))bad.push('Datum (YYYY-MM-DD)');
    if(clean.city.length<2||clean.city.length>80)bad.push('Stadt');
    if(clean.venue.length>140)bad.push('Ort');
    if(!EVENT_CATEGORIES.includes(clean.category))bad.push(`Kategorie "${clean.category||'leer'}"`);
    if(!httpsUrl(clean.sourceUrl))bad.push('HTTPS-Quellenlink');
    if(clean.imageUrl&&!httpsUrl(clean.imageUrl))bad.push('HTTPS-Bildlink (imageUrl)');
    throw Error(`Eintrag ${i+1} (${clean.title||'ohne Titel'}): Bitte ${bad.join(', ')||'Quellenlink oder Beschreibung'} prüfen.`);
  }
  const key=eventKey(clean);if(known.has(key)){duplicates++;continue;}known.add(key);added.push(clean);
 }
 return {added,duplicates};
}
export function upcomingImportedEvents(items,today){return (items||[]).filter(validEvent).filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title,'de'));}
export const eventAppearance=(category)=>({Sport:['⚽','sport'],Oper:['🎼','stage'],Theater:['🎭','stage'],Ballett:['🩰','stage'],Musical:['🎤','stage'],Kabarett:['🎙️','cabaret'],Konzert:['🎵','concert'],Kino:['🎬','cinema'],Festival:['🎪','festival'],Kultur:['🏛️','culture'],Tanz:['💃','dance'],Zouk:['🪇','dance'],Kizomba:['🌙','dance'],Bachata:['💃','dance'],Bujinkan:['🥷','budo'],Sonstiges:['✨','other']})[category]||['✨','other'];
