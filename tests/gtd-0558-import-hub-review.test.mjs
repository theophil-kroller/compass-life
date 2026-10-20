import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {detectSmartImport,smartImportHubView,SMART_IMPORT_KINDS} from '../client/src/smart-import-hub-v49.js';
import {markSuccessfulImport,importStatuses,importStatusMarkup} from '../client/src/import-status-v558.js';
import {reviewImportHub} from '../client/src/review-import-hub.js';
import {worktimeView,worktimeImportPanel} from '../client/src/worktime-v553.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');

test('Import Hub detects worktime name conservatively and accepts manual assignment',()=>{
 assert.equal(detectSmartImport({name:'Arbeitszeit_2026.xlsx'}).kind,'worktime');
 assert.equal(detectSmartImport({name:'time-tracking-template.xlsx'}).kind,'worktime');
 assert.equal(detectSmartImport({name:'unknown.xlsx'}).kind,'unknown');
 assert.equal(detectSmartImport({name:'fitdays.xlsx'}).kind,'health');
 assert.equal(SMART_IMPORT_KINDS.worktime,'Arbeitszeit-Excel');
 assert.match(smartImportHubView({state:{},entries:[]}),/Datenaktualität aller Quellen/);
});

test('Fresh import timestamp and last data coverage are independent; older records not given fabricated dates',()=>{
 const st={workTime:{days:[{day:'2026-09-20',hours:8}],lastImportedAt:'2026-10-20T16:00:00Z'},financeTransactions:[{day:'2026-10-01'}],smartImportHistory:[]};
 const rows=importStatuses(st,'2026-10-20');
 const work=rows.find(x=>x.id==='worktime'),bank=rows.find(x=>x.id==='bank');
 assert.equal(work.at,'2026-10-20T16:00:00.000Z');assert.equal(work.content,'2026-09-20');assert.equal(work.status,'check');
 assert.equal(bank.status,'undocumented');assert.equal(bank.at,null);
 assert.match(importStatusMarkup(st,'2026-10-20'),/Datum bisher nicht erfasst/);
 markSuccessfulImport(st,'bank','2026-10-20T16:00:00Z');
 assert.equal(importStatuses(st,'2026-10-20').find(x=>x.id==='bank').status,'current');
});

test('Review exposes compact data freshness and opens same import hub without requiring imports',()=>{
 const html=reviewImportHub({state:{}});
 assert.match(html,/Datenquelle/);assert.match(html,/Arbeitszeit-Excel/);
 assert.match(html,/data-id="hub"/);assert.match(html,/data-id="worktime"/);
 assert.match(html,/Einzelimporte direkt im Review/);
 assert.match(main,/if\(action==='review-import-open'\)\{if\(id==='hub'/);
});

test('Worktime plot is displayed before multiyear plot and standalone import last',()=>{
 const page=main.match(/insightTab==='worktime'\?([^:]+):insightTab==='stress'/)?.[1]||'';
 assert.match(page,/worktimeView\(/);assert.match(page,/worktimeYearComparisonView\(/);assert.match(page,/worktimeImportPanel\(/);
 assert.ok(page.indexOf('worktimeYearComparisonView')<page.indexOf('worktimeImportPanel'));
 const chart=worktimeView({days:[{day:'2026-10-19',hours:8}]},2026,45,null,'2026-10-20',false);
 assert.doesNotMatch(chart,/Monatsvergleich & Arbeitszeitkonten/);
 assert.doesNotMatch(chart,/id="work553-file"/);
 assert.match(chart,/width="27" height="27"/);
 assert.match(chart,/<title>KW/);
 assert.match(worktimeImportPanel({days:[{day:'2026-10-19'}]},{days:[],issues:[],sheets:[]}),/class="work553-panel" open/);
});

test('Smart import worktime goes through actual workbook inspection and confirmation, no new API writes',()=>{
 assert.match(main,/workPreview=await inspectWorktimeFile\(group\[0\]\.file/);
 assert.match(main,/if\(smartHubStage\?\.kind==='worktime'\)s\.smartImportHistory=committedSmartImport/);
 assert.match(main,/markSuccessfulImport\(s,'worktime'\)/);
 assert.match(main,/if\(smartHubStage\?\.kind==='worktime'\)smartHubStage=null/);
});
