import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {financeDashboardView} from '../client/src/finance-dashboard.js';
import {smartImportHubView} from '../client/src/smart-import-hub-v49.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
test('hub is reachable without adding another large sidebar item',()=>{
 assert.match(main,/data-action="smart49-open"/);assert.match(main,/id="smart-import-hub"|smartImportHubView\(/);
 assert.match(main,/window\.showDirectoryPicker/);assert.match(main,/data-action="smart49-preview-kind"|action==='smart49-preview-kind'/);
 assert.doesNotMatch(main,/navItem\('import'/);
});
test('bank preview remains wired to existing finance confirmation and ledger',()=>{
 assert.match(main,/financePreview=preview;financePane='Prüfen'/);
 assert.match(main,/if\(smartHubStage\?\.kind==='bank'\)s\.smartImportHistory=committedSmartImport/);
 const page=financeDashboardView({financeTransactions:[],financeRules:[]},'Prüfen','all',{rows:[{id:'demo'}],duplicates:0,auto:0,review:1,byAccount:[]});
 assert.match(page,/data-action="finance-import-confirm"/);
});
test('all supported preview types are explicitly confirmed by the old importer',()=>{
 for(const type of ['health','places','project','kraken','bank','flatex'])assert.match(main,new RegExp(`id==='${type}'|kind==='${type}'`),type);
 assert.match(main,/s\.smartImportHistory=committedSmartImport\(s\.smartImportHistory,smartHubStage\.entries,'project'\)/);
 assert.match(main,/s\.smartImportHistory=committedSmartImport\(s\.smartImportHistory,smartHubStage\.entries,'kraken'\)/);
 assert.match(main,/s\.smartImportHistory=committedSmartImport\(s\.smartImportHistory,report\.accepted,'health'\)/);
});
test('release does not claim background monitoring or silently process local folders',()=>{
 const ui=smartImportHubView();
 assert.match(ui,/Ordner wählen/);assert.match(ui,/Prüfen/);
 assert.match(ui,/geschlossenem Browser benötigt einen separaten lokalen Begleitprozess/);
 assert.match(ui,/erst nach deiner Bestätigung/);
});
