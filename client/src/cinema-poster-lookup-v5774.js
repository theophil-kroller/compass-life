// Compass 0.5.77.4 — explicit, best-effort poster lookup via public Cinemeta catalogue.
// NEVER silently choose a film based on a similar name. No source images are copied or bundled.
// A single user action initiates a bounded number of title-only requests to the external service.
import {cinemaFilmKey} from './cinema-program-v5772.js';

export const CINEMETA_ORIGIN='https://v3-cinemeta.strem.io';
export const POSTER_LOOKUP_BATCH_SIZE=18;
const n=s=>String(s||'').normalize('NFKC').trim();
const safeHTTPS=s=>{if(typeof s!=='string'||s.length>500||!s.startsWith('https://'))return false;
 try{const u=new URL(s);return u.protocol==='https:'&&u.hostname.includes('.')&&!u.username&&!u.password;}catch{return false;}};
export function posterLookupTitle(title){
 return n(title).replace(/\s*\((?:o\.?m\.?u\.?|omu|ov|originalfassung|3d|2d|df|deutsche fassung)\)\s*$/gi,'').trim();
}
export function posterMatchKey(title){
 return posterLookupTitle(title).toLocaleLowerCase('de-AT').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[’‘`´]/g,"'").replace(/ß/g,'ss').replace(/&/g,' und ')
  .replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
}
export function posterSearchUrl(title){
 // URL-encode, but preserve Stremio's documented `search=<query>.json` path shape.
 return `${CINEMETA_ORIGIN}/catalog/movie/top/search=${encodeURIComponent(posterLookupTitle(title))}.json`;
}
export function selectPosterSuggestion(film,metas){
 const wanted=posterMatchKey(film?.title),rows=Array.isArray(metas)?metas:[];
 if(!wanted||wanted.length<3)return null;
 const exact=rows.filter(m=>m&&typeof m.name==='string'&&posterMatchKey(m.name)===wanted&&safeHTTPS(m.poster));
 // Different years may share a movie title. Reject ambiguous results outright rather than attach wrong art.
 const distinct=new Map(exact.map(m=>[String(m.id||'')+'|'+String(m.year||m.releaseInfo||''),m]));
 if(distinct.size!==1)return null;
 const m=[...distinct.values()][0];
 const imdb=typeof m.id==='string'&&/^tt\d{6,12}$/.test(m.id)?`https://www.imdb.com/title/${m.id}/`:null;
 return {key:cinemaFilmKey(film.title),title:film.title,matchedTitle:m.name,imageUrl:m.poster,
  sourceUrl:imdb||CINEMETA_ORIGIN,provider:'Cinemeta / Stremio',year:String(m.year||m.releaseInfo||'').slice(0,12),selected:true};
}
export async function fetchPosterSuggestion(film,fetcher=fetch){
 const url=posterSearchUrl(film.title);
 // Network failures are nonfatal; the UI can still use JSON enrichment.
 try{const res=await fetcher(url,{headers:{accept:'application/json'},signal:AbortSignal.timeout(12000)});
  if(!res?.ok)return {suggestion:null,reason:`HTTP ${res?.status||'?'}`};
  const data=await res.json();
  const suggestion=selectPosterSuggestion(film,data?.metas);
  return {suggestion,reason:suggestion?'':'Kein eindeutig passender Titel mit Poster'};
 }catch(e){return {suggestion:null,reason:'Abruf nicht möglich: '+String(e?.message||e).slice(0,90)};}
}
export async function lookupPosterBatch(films,{fetcher=fetch,offset=0,batchSize=POSTER_LOOKUP_BATCH_SIZE}={}){
 const missing=(Array.isArray(films)?films:[]).filter(f=>f&&!f.imageUrl&&typeof f.title==='string');
 const start=Math.min(Math.max(0,Number(offset)||0),Math.max(0,missing.length-1));
 const selected=missing.slice(start,start+Math.min(30,Math.max(1,batchSize)));
 const suggestions=[],unmatched=[],errors=[];
 // Sequential, rate friendly requests; do not crawl an entire cinema catalogue in the background.
 for(const film of selected){
  const result=await fetchPosterSuggestion(film,fetcher);
  if(result.suggestion)suggestions.push(result.suggestion);
  else{unmatched.push(film.title);if(result.reason.startsWith('Abruf nicht möglich')||result.reason.startsWith('HTTP'))errors.push(`${film.title}: ${result.reason}`);}
 }
 return {suggestions,unmatched,errors,checked:selected.length,totalMissing:missing.length,
  nextOffset:start+selected.length>=missing.length?0:start+selected.length};
}
export function validPosterSuggestion(x){return Boolean(x&&typeof x.key==='string'&&x.key.length>0&&safeHTTPS(x.imageUrl)&&safeHTTPS(x.sourceUrl));}
export function applyPosterToEvent(e,suggestion,at){
 if(cinemaFilmKey(e?.title)!==suggestion?.key||!['Kino','Filmfestival'].includes(e?.category)||!validPosterSuggestion(suggestion))return e;
 return {...e,imageUrl:suggestion.imageUrl,posterSourceUrl:suggestion.sourceUrl,posterProvider:suggestion.provider||'Cinemeta / Stremio',posterImportedAt:at};
}

/** Only count an external link as usable after the browser decodes the actual image.
 * This does not grant rights to republish a third-party poster.
 */
export async function verifyPosterImage(url,load=globalThis.Image,timeout=8000){
 if(!safeHTTPS(url)||typeof load!=='function')return false;
 return await new Promise(resolve=>{let done=false;const img=new load();let timer;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);img.onload=null;img.onerror=null;resolve(ok);};
  timer=setTimeout(()=>finish(false),timeout);img.referrerPolicy='no-referrer';img.onload=()=>finish(img.naturalWidth>0);img.onerror=()=>finish(false);img.src=url;
 });
}
