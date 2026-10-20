import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {planHealthQueue,healthBatchResult,HEALTH_IMPORT_SAMPLE_SIZE,HEALTH_IMPORT_BATCH_SIZE} from '../client/src/health-import-queue-v493.js';
import {recheckHealthArchiveEntries,committedSmartImport} from '../client/src/smart-import-hub-v49.js';
import {inspectHealthFiles,commitHealthImport} from '../client/src/health-import.js';
import {healthImportCoverage} from '../client/src/health-import-diagnostics-v492.js';
const base=n=>({name:`2026-10-${String(n).padStart(2,'0')}.zip`,file:{lastModified:0},kind:'health',duplicate:false,digest:String(n).padStart(64,'a')});
test('one consent creates a full queue of 361 archives without silently dropping everything after 150',()=>{
 const entries=Array.from({length:361},(_,i)=>({name:`${new Date(Date.UTC(2025,10,i+1)).toISOString().slice(0,10)}.zip`,file:{lastModified:i},kind:'health',duplicate:false}));
 const {ordered,batches,total}=planHealthQueue(entries);
 assert.equal(total,361);assert.equal(ordered[0].name,'2026-10-27.zip');
 assert.equal(batches[0].length,HEALTH_IMPORT_SAMPLE_SIZE);
 assert.equal(batches.reduce((s,b)=>s+b.length,0),361);
 assert.ok(batches.slice(1).every(b=>b.length<=HEALTH_IMPORT_BATCH_SIZE));
 assert.deepEqual(batches.flat().map(e=>e.name).sort(),entries.map(e=>e.name).sort());
 assert.equal(new Set(batches.flat()).size,361);
});
test('a partly decoded ZIP can add useful values but never gets marked complete in the file ledger',()=>{
 const entries=[base(17),base(18),base(19)];
 const p={processed:2,errors:['2026-10-18.zip: 1 FIT-Datei nicht lesbar','2026-10-19.zip: unknown'],fileResults:[{status:'ok'},{status:'partial'},{status:'error'}]};
 const report=healthBatchResult(entries,p);
 assert.deepEqual(report.accepted,[entries[0]]);assert.deepEqual(report.partial,[entries[1]]);assert.deepEqual(report.failed,[entries[2]]);
 const ledger=committedSmartImport([],report.accepted,'health');
 assert.equal(ledger.length,1);assert.equal(ledger[0].name,'2026-10-17.zip');
});
test('a deliberate health backfill re-enables historical files while preserving other categories and same-scan exact duplicates',()=>{
 const records=[{...base(17),duplicate:true},{...base(18),duplicate:true},{...base(18),name:'copy.zip',duplicate:true},{name:'bank.csv',kind:'bank',duplicate:true,digest:'b'.repeat(64)}];
 const updated=recheckHealthArchiveEntries(records);
 assert.deepEqual(updated.map(x=>x.duplicate),[false,false,true,true]);
 assert.ok(records.every(r=>r.duplicate),'function must not mutate the original entries');
});
test('native Garmin CSV importing still uses existing parser and reports per-file outcomes for a retryable failure',async()=>{
 const csv='Activity Type,Date,Title,Distance,Time,Calories\nWalking,2026-10-19 12:00:00,Walk,2.0,00:35:00,130\n';
 const asFile=(name,text)=>{const b=Buffer.from(text);return {name,size:b.length,arrayBuffer:async()=>Uint8Array.from(b).buffer};};
 const preview=await inspectHealthFiles([asFile('Activities.csv',csv),asFile('bad.fit','text that is not a FIT file')]);
 assert.equal(preview.processed,1);assert.deepEqual(preview.fileResults.map(x=>x.status),['ok','error']);
 assert.equal(preview.garminSessions.length,1);
 const state={};commitHealthImport(state,preview);commitHealthImport(state,preview);
 assert.equal(state.healthImports.garminSessions.length,1,'reimport must preserve existing activities without duplication');
});
test('reimport enriches missing historical stress while keeping an already stored sleep night',()=>{
 const state={};
 const base={fitdays:[],garminNights:[{day:'2026-10-19',stages:[{type:'deep'}]}],garminHrv:[],garminWellness:[],garminFitness:[],garminSessions:[]};
 commitHealthImport(state,base);
 const supplementary={...base,garminNights:[],garminWellness:[{at:'2026-10-19T10:00:00Z',stress:50,bodyBattery:60}]};
 commitHealthImport(state,supplementary);commitHealthImport(state,supplementary);
 assert.equal(state.healthImports.garminNights.length,1);
 assert.equal(state.healthImports.garminWellness.length,1);
 assert.equal(healthImportCoverage(state.healthImports,'Europe/Vienna').stress.last,'2026-10-19');
});
test('UI requires consent before all batches, reports saved coverage and gives a real stop control',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const part of ['planHealthQueue(group)','for(let index=0;index<batches.length;index++)','health-import-confirm','smart49-health-backfill','health-import-stop','healthImportJob.done','commitHealthImport(s,preview)','healthBatchResult(batch,preview)','report.accepted'])assert.ok(main.includes(part),part);
 assert.doesNotMatch(main,/newestHealthFirst\(group\)\.slice\(0,150\)/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.58'/);
});
