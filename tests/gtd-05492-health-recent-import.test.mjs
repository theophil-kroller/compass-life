import test from 'node:test';
import assert from 'node:assert/strict';
import {newestHealthFirst,healthImportCoverage} from '../client/src/health-import-diagnostics-v492.js';
import {readFileSync} from 'node:fs';

test('date-named Garmin ZIPs prioritize October 19 and 18 above older history, even when scan is unsorted',()=>{
 const entries=[
  {name:'2026-05-01.zip',file:{lastModified:2000000000000}},
  {name:'2026-10-18.zip',file:{lastModified:1}},
  {name:'2026-10-17.zip',file:{lastModified:1}},
  {name:'2026-10-19.zip',file:{lastModified:1}},
  {name:'unknown.zip',file:{lastModified:2000000000001}}
 ];
 const original=[...entries];
 const sorted=newestHealthFirst(entries);
 assert.deepEqual(sorted.slice(0,2).map(x=>x.name),['2026-10-19.zip','2026-10-18.zip']);
 assert.deepEqual(entries,original,'must not mutate original import list');
});

test('newest 150 of 175 includes latest missing days; remainder can be processed in a subsequent batch',()=>{
 const entries=Array.from({length:175},(_,i)=>{
  const date=new Date(Date.UTC(2026,4,1+i)).toISOString().slice(0,10);
  return {name:`${date}.zip`,file:{lastModified:i}};
 });
 const ordered=newestHealthFirst(entries);
 assert.deepEqual(ordered.slice(0,2).map(x=>x.name),['2026-10-22.zip','2026-10-21.zip']);
 assert.equal(ordered.slice(0,150).length,150);
 assert.equal(ordered.slice(150).length,25);
 assert.ok(ordered.slice(0,150).some(x=>x.name==='2026-10-19.zip'));
});

test('sleep-only ZIP preview must report zero stress points and still expose latest night',()=>{
 const coverage=healthImportCoverage({garminNights:[{day:'2026-10-19'}],garminWellness:[{at:'2026-10-19T16:00:00Z',stress:null,bodyBattery:50}]},'Europe/Vienna');
 assert.equal(coverage.stress.count,0);
 assert.equal(coverage.stress.last,'');
 assert.equal(coverage.battery.last,'2026-10-19');
 assert.equal(coverage.nights.last,'2026-10-19');
});

test('Europe/Vienna zone dates do not drop late-evening UTC samples',()=>{
 const coverage=healthImportCoverage({garminWellness:[
  {at:'2026-10-17T23:30:00Z',stress:72},
  {at:'2026-10-19T10:00:00Z',stress:44},
  {at:'2026-10-19T10:05:00Z',stress:45},
 ]},'Europe/Vienna');
 assert.equal(coverage.stress.first,'2026-10-18');
 assert.equal(coverage.stress.last,'2026-10-19');
 assert.equal(coverage.stress.count,3);
});

test('UI shows confirmed last stress date separately from import preview and reads newest-first',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/planHealthQueue\(group\)/);
 assert.match(main,/Importvorschau · noch nicht gespeichert/);
 assert.match(main,/Im Vault gespeichert/);
 assert.match(main,/Gesundheitsimport bestätigt/);
 assert.match(main,/healthFilePreview=null;smartHubStage=null;insightWellnessDay=''/,'successful import must show latest day rather than stale selection');
});
