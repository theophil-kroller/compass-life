/** Compass .40.12: an exhibition that started days ago belongs to today's
 * discovery list while it is still running. Preserve the source dates and
 * eventKey for dedupe, bookmarks and Cloudflare synchronization. */
export function discoveryDisplayDay412(event,today){
 if(typeof today!=='string'||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(today))return event?.date||'';
 const start=String(event?.date||'');
 return start<today&&String(event?.endDate||'')>=today?today:start;
}
export function discoveryOverlaps412(event,from,to){
 if(!event||typeof from!=='string'||typeof to!=='string')return false;
 return String(event.date||'')<=to&&String(event.endDate||event.date||'')>=from;
}
export function discoveryOngoingLabel412(event,today){
 if(!event||!event.endDate||!(event.date<today&&event.endDate>=today))return '';
 const format=iso=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(iso)))return iso;
  return `${iso.slice(8,10)}.${iso.slice(5,7)}.${iso.slice(0,4)}`;
 };
 return `Läuft seit ${format(event.date)} · bis ${format(event.endDate)} · Besuchszeiten prüfen`;
}
