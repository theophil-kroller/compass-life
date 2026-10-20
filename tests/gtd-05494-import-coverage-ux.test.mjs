import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {healthDataCoverage,healthCoverageMarkup,importFilePeriod,filePeriodMarkup} from '../client/src/health-data-coverage-v494.js';
import {smartImportHubView} from '../client/src/smart-import-hub-v49.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const entry=(name,kind='health')=>({name,kind,duplicate:false,reason:'ZIP',size:120,digest:'',members:[],layout:'zip:fit'});
test('2026 May through October are reported as real stored periods, separate from import time',()=>{
 const c=healthDataCoverage({garminNights:[{day:'2026-05-02'},{day:'2026-10-19'}],garminHrv:[{day:'2026-05-03'}],garminWellness:[{at:'2026-05-01T12:00:00Z',stress:40,bodyBattery:35},{at:'2026-10-19T12:00:00Z',stress:60,bodyBattery:70}],garminFitness:[{day:'2026-05-04'}],fitdays:[{at:'2026-10-12T14:00:00Z'}]},'2026-10-20');
 assert.equal(c.all.first,'2026-05-01');assert.equal(c.all.last,'2026-10-19');
 assert.equal(c.kinds.sleep.first,'2026-05-02');assert.equal(c.kinds.sleep.last,'2026-10-19');
 assert.equal(c.kinds.stress.first,'2026-05-01');assert.equal(c.kinds.stress.last,'2026-10-19');
 assert.ok(c.months.some(m=>m.month==='2026-05'&&m.sleep===1));
 assert.ok(c.months.some(m=>m.month==='2026-10'&&m.stress===1));
 const html=healthCoverageMarkup(c);assert.match(html,/02\.05\.2026 – 19\.10\.2026/);assert.match(html,/Monatsabdeckung/);
 assert.match(html,/nicht zwingend vollständig/);
});
test('a day with one data point is never described as a complete recording; future and today not gaps',()=>{
 const c=healthDataCoverage({garminNights:[{day:'2026-10-17'},{day:'2026-10-20'}],garminWellness:[{at:'2026-10-19T15:00:00Z',stress:0,bodyBattery:0}]},'2026-10-20');
 assert.deepEqual(c.gaps.sleep,['2026-10-18','2026-10-19']);
 assert.equal(c.kinds.stress.days,1);assert.equal(c.kinds.battery.days,1);
 assert.match(healthCoverageMarkup(c),/Hinweise, keine bestätigten Aufzeichnungslücken/);
});
test('file period from names remains separate from stored readings and excludes unrelated takeout archives',()=>{
 const files=[entry('2026-05-01.zip'),entry('2026-10-19.zip'),entry('Activities.csv'),entry('takeout-2026-10-11.zip','unknown'),{...entry('2026-06-01.zip'),duplicate:true}];
 const span=importFilePeriod(files);
 assert.equal(span.first,'2026-05-01');assert.equal(span.last,'2026-10-19');assert.equal(span.days,3);assert.equal(span.undated,1);
 const text=filePeriodMarkup(span);assert.match(text,/Dateinamen/);assert.match(text,/01\.05\.2026/);
});
test('hub keeps health preview and confirmation on the same screen with linked date coverage',()=>{
 const files=[entry('2026-05-01.zip'),entry('2026-10-19.zip')];
 const c=healthDataCoverage({garminNights:[{day:'2026-05-01'}]},'2026-10-20');
 const html=smartImportHubView({entries:files,source:'health',storedCoverage:c,healthPreview:{processed:1,garminNights:[{day:'2026-10-19'}],garminWellness:[]},folderStatus:{health:'Freigegeben'}});
 assert.match(html,/Dateinamen:/);assert.match(html,/Im Vault · gemessener Zeitraum/);assert.match(html,/2 Gesundheitsdateien übernehmen/);
 assert.match(html,/data-action="health-import-confirm"/);assert.match(html,/data-action="smart49-rescan-folder"/);
 assert.ok(main.includes('await scanSmartFolder(id)'),'folder selection should trigger a scan');
 assert.ok(main.includes("tab='system';calmNavGroup='';"),'health remains in hub');
 assert.doesNotMatch(main,/smartHubStage=\{kind:'health',entries:queue\.ordered,firstBatch:sample\};[\s\S]{0,300}tab='insights'/);
});
test('no data or empty known period gets clear, conservative labels',()=>{
 const x=healthDataCoverage({},'2026-10-20');assert.equal(x.all.days,0);assert.match(healthCoverageMarkup(x),/Noch keine/);
 const p=importFilePeriod([entry('Activities.csv')]);assert.equal(p.days,0);assert.match(filePeriodMarkup(p),/kein verlässlicher Beginn/);
});
