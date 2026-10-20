/** Compass 0.5.49.3: bounded, explicit-consent health import queue.
 * Uses the original Garmin/Fitdays parsers and commitHealthImport. File hashes
 * are acknowledged ONLY for files parsed without errors AND saved to the vault.
 */
import {newestHealthFirst} from './health-import-diagnostics-v492.js';
export const HEALTH_IMPORT_BATCH_SIZE=20;
export const HEALTH_IMPORT_SAMPLE_SIZE=8;
export function planHealthQueue(entries=[],{sampleSize=HEALTH_IMPORT_SAMPLE_SIZE,batchSize=HEALTH_IMPORT_BATCH_SIZE}={}){
 const ordered=newestHealthFirst(entries.filter(e=>e?.file&&!e.duplicate));
 if(!Number.isSafeInteger(sampleSize)||sampleSize<1||sampleSize>75||!Number.isSafeInteger(batchSize)||batchSize<1||batchSize>75)throw Error('Ungültige Stapelgröße');
 const batches=[];
 if(ordered.length){batches.push(ordered.slice(0,sampleSize));for(let i=sampleSize;i<ordered.length;i+=batchSize)batches.push(ordered.slice(i,i+batchSize));}
 return {ordered,batches,total:ordered.length};
}
/** A parser warning is NOT a complete import, even when some data was usable.
 * The data may still be merged, but the file remains eligible for a later retry.
 */
export function healthBatchResult(entries=[],preview={}){
 const results=Array.isArray(preview.fileResults)?preview.fileResults:[];
 const accepted=entries.filter((_,i)=>results[i]?.status==='ok');
 const partial=entries.filter((_,i)=>results[i]?.status==='partial');
 const failed=entries.filter((_,i)=>results[i]?.status!=='ok'&&results[i]?.status!=='partial');
 return {accepted,partial,failed,read:Number(preview.processed)||0,errors:Array.isArray(preview.errors)?preview.errors:[]};
}
