import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {researchCoverageSnapshot,recordResearchImport,researchRefreshStates,researchReminders,researchReminderText,RESEARCH_REFRESH_RULES} from '../client/src/discovery-freshness-v5777.js';
import {DISCOVERY_RESEARCH_BUTTONS} from '../client/src/discovery-research-v577.js';
const museum={title:'Ausstellung A',date:'2026-10-22',endDate:'2030-12-31',category:'Ausstellung',researchGroup:'arts'};
const sample=(group,date,extra={})=>({title:'Ereignis',date,category:group==='cinema-program'?'Kino':'Ausstellung',researchGroup:group,lastImportedAt:'2026-10-22T18:00:00.000Z',...extra});
const status=(s,today,id)=>researchRefreshStates(s,today).find(x=>x.id===id);
test('rules cover all ten actual prompt buttons',()=>{
 assert.equal(DISCOVERY_RESEARCH_BUTTONS.length,10);
 assert.deepEqual(Object.keys(RESEARCH_REFRESH_RULES).sort(),DISCOVERY_RESEARCH_BUTTONS.map(x=>x.id).sort());
});
test('no phantom overdue review items before first research',()=>{
 assert.deepEqual(researchRefreshStates({},'2026-10-22'),[]);
 assert.deepEqual(researchReminders({},'2026-10-22'),[]);
});
test('cinema import produces reminder in advance of the last screening, not after it',()=>{
 const state={discoveryResearchHistory:{'cinema-program':{at:'2026-10-22T20:00:00Z'}},discoveredEvents:[sample('cinema-program','2026-10-29')]};
 const before=status(state,'2026-10-23','cinema-program');
 assert.equal(before.status,'fresh');
 assert.equal(before.coverageEnd,'2026-10-29');
 assert.equal(status(state,'2026-10-26','cinema-program').status,'soon');
 assert.equal(status(state,'2026-10-27','cinema-program').status,'due');
 assert.equal(status(state,'2026-10-30','cinema-program').status,'due');
});
test('short import reach triggers check even sooner than standard cadence',()=>{
 const state={discoveredEvents:[sample('cinema-program','2026-10-24')]};
 const x=status(state,'2026-10-22','cinema-program');
 assert.equal(x.status,'due');
 assert.equal(x.nextReview,'2026-10-22');
 assert.match(researchReminderText(x),/Heute/);
});
test('long-running museum exhibition does not suppress fresh programme research until 2030',()=>{
 const state={discoveryResearchHistory:{arts:{at:'2026-10-22T10:00:00Z',firstDate:'2026-10-22',lastEventDate:'2026-10-22',lastEndDate:'2030-12-31'}},discoveredEvents:[museum]};
 const x=status(state,'2026-11-30','arts');
 assert.equal(x.latestEventEnd,'2030-12-31');
 assert.equal(x.status,'due');
 assert.equal(x.nextReview,'2026-10-22'); // source programme covered only that day
});
test('research updates reset a due reminder and store last coverage date',()=>{
 const state={discoveryResearchHistory:{music:{at:'2026-01-01T11:00:00.000Z',lastEventDate:'2026-02-01'}},discoveredEvents:[]};
 assert.equal(status(state,'2026-10-22','music').status,'due');
 recordResearchImport(state,'music',{total:3,added:[sample('music','2026-11-10')],refreshed:[]},'2026-10-22T20:00:00Z');
 const x=status(state,'2026-10-23','music');
 assert.equal(x.coverageEnd,'2026-11-10');
 assert.equal(x.status,'fresh');
 assert.equal(state.discoveryResearchHistory.music.total,3);
 assert.equal(researchReminders(state,'2026-10-23').length,0);
});
test('multi-batch same-day import retains furthest event reach from both batches',()=>{
 const state={};
 recordResearchImport(state,'cinema-program',{total:250,added:[sample('cinema-program','2026-10-26')],refreshed:[]},'2026-10-22T12:00:00Z');
 recordResearchImport(state,'cinema-program',{total:90,added:[sample('cinema-program','2026-10-30')],refreshed:[]},'2026-10-22T13:00:00Z');
 assert.equal(state.discoveryResearchHistory['cinema-program'].lastEventDate,'2026-10-30');
});
test('metadata snapshot records start and actual ending of long multi-day events',()=>{
 assert.deepEqual(researchCoverageSnapshot([{date:'2026-10-30',endDate:'2027-01-14'},{date:'2026-11-11'}]),{firstDate:'2026-10-30',lastEventDate:'2026-11-11',lastEndDate:'2027-01-14'});
});
test('review and Today share the same read-only research hints and navigation',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/function researchRefreshPanel\(mode='today'\)/);
 assert.match(main,/researchRefreshPanel\('today'\)/);
 assert.match(main,/researchRefreshPanel\('review'\)/);
 assert.match(main,/data-action="discovery-research-open"/);
 assert.match(main,/if\(action==='discovery-research-open'\)/);
 assert.match(main,/recordResearchImport\(st,group,preview,at\)/);
 assert.match(main,/discoveryImportOpen=true;discoveryImportPreview=null;discoveryImportError=''/);
});
test('single-click poster pass assembles batches without silently saving any image',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/if\(action==='discovery-poster-all'\)/);
 assert.match(main,/for\(let offset=0;offset<cap;offset\+=12\)/);
 assert.match(main,/posterLookupResult=combined/);
 assert.match(main,/Bitte die Bilder vor der Übernahme prüfen/);
 assert.match(main,/data-action="discovery-poster-apply"/);
});
