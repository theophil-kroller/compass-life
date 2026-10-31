import test from 'node:test';
import assert from 'node:assert/strict';
import {professionalTimeSummary,activityToJournalArea} from '../client/src/worktime-category-v0587.js';
import {timeEntries,unifiedTimeEntries,unifiedTimeBreakdown,putTimeEntry} from '../client/src/personal-journal-v5692.js';
const day='2026-10-31';const at=(h,m=0)=>new Date(`${day}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`).toISOString();
const E=(id,s,e,category)=>({id,start:at(s),end:at(e),category});
test('Sport, Erholung, Familie, Privatprojekt are not professional work',()=>{
 const summary=professionalTimeSummary([E('work',9,11,'work'),E('sport',11,12,'leisure'),E('rest',12,13,'health'),E('family',13,14,'family'),E('project',14,15,'project')],day,{now:new Date(at(18)).getTime()});
 assert.equal(summary.work,120); assert.equal(summary.nonWork,240); assert.equal(summary.minutes.leisure,60);assert.equal(summary.minutes.health,60);
});
test('overlapping professional entries are not doubled',()=>{
 assert.equal(professionalTimeSummary([E('w1',9,11,'work'),E('w2',10,12,'work')],day).work,180);
});
test('a live Sport timer is not counted as professional work',()=>{
 const s=professionalTimeSummary([],day,{activeStart:at(8),activeCategory:'leisure',now:new Date(at(9,30)).getTime()});
 assert.equal(s.work,0);assert.equal(s.nonWork,90);
});
test('a live Work timer counts as work, day boundaries clip long sessions',()=>{
 const s=professionalTimeSummary([{id:'cross',start:new Date('2026-10-30T23:00:00').toISOString(),end:at(1),category:'work'}],day);
 assert.equal(s.work,60);
 const active=professionalTimeSummary([],day,{activeStart:at(8),activeCategory:'work',now:new Date(at(9,30)).getTime()});assert.equal(active.work,90);
});
test('existing time-journal overrides are respected without changing original quick records',()=>{
 const s={quickWorktime:{sessions:[E('quick',9,10,'work')]},timeJournal:{entries:[],overrides:{}}};
 putTimeEntry(s,{id:'quick',start:at(9),end:at(10),category:'leisure',title:'Sport',project:''});
 assert.equal(timeEntries(s)[0].category,'leisure');assert.equal(s.quickWorktime.sessions[0].category,'work');
 assert.equal(professionalTimeSummary(timeEntries(s),day).work,0);
});
test('Garmin Freizeit/Erholung must not masquerade as professional work',()=>{
 assert.equal(activityToJournalArea('Freizeit'),'leisure');assert.equal(activityToJournalArea('Erholung'),'health');assert.equal(activityToJournalArea('Soziales'),'family');assert.equal(activityToJournalArea('Arbeit'),'work');
 const sessions=[{id:'sport',source:'Garmin',category:'Freizeit',title:'Bujinkan',startedAt:`${day}T09:00:00`,durationMinutes:60},
 {id:'rest',source:'Garmin',category:'Erholung',title:'Erholung',startedAt:`${day}T11:00:00`,durationMinutes:45},
 {id:'work',source:'Garmin',category:'Arbeit',title:'Forschung',startedAt:`${day}T14:00:00`,durationMinutes:90}];
 const state={timeJournal:{entries:[],overrides:{}}};
 const rows=unifiedTimeEntries(state,sessions);assert.deepEqual(rows.map(x=>x.category).sort(),['health','leisure','work']);
 const summary=unifiedTimeBreakdown(state,sessions,7,new Date(`${day}T18:00:00`));
 assert.equal(summary.totals.work,90);assert.equal(summary.totals.leisure,60);assert.equal(summary.totals.health,45);
});
test('user-facing UI explicitly says nonwork does not count as work',async()=>{
 const fs=await import('node:fs/promises');const code=await fs.readFile(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 assert.match(code,/professionalSummaryForDay/);assert.match(code,/Sport, Erholung oder andere Lebensbereiche erfasst/);
 assert.match(code,/Nicht-Arbeit|nicht als Arbeit gezählt/);
});
