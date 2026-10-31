import test from 'node:test';
import assert from 'node:assert/strict';
import {validateLifeEvent,lifeWeekCells,lifeWeeksView,parseLifeEventsImport,applyLifeEventsImport} from '../client/src/life-weeks-v0582.js';
import {lifeWeeksPosterModel} from '../client/src/life-weeks-pdf-v0583.js';
// Synthetic fixture: the actual user's LinkedIn and calendar data is intentionally NOT committed to the public repository.
const example=JSON.stringify({schema:'compass_life_events_v1',events:[
 {title:'Volunteer role A',category:'volunteer',organization:'Community Services',start:'2022-03-01',end:'2025-02-28',startPrecision:'month',endPrecision:'month',source:'linkedin',sourceRef:'linkedin:vol:1'},
 {title:'Volunteer role B',category:'volunteer',organization:'Language School',start:'2011-10-01',end:'2012-02-29',startPrecision:'month',endPrecision:'month',source:'linkedin',sourceRef:'linkedin:vol:2'},
 {title:'Volunteer role C',category:'volunteer',organization:'Village Foundation',location:'Test City, Country',start:'2003-08-01',end:'2004-09-30',startPrecision:'month',endPrecision:'month',source:'linkedin',sourceRef:'linkedin:vol:3'},
 {title:'Volunteer role D',category:'volunteer',organization:'Austrian Civic Organization',start:'2001-07-01',end:'2003-08-31',startPrecision:'month',endPrecision:'month',source:'linkedin',sourceRef:'linkedin:vol:4'},
 {title:'Travel A',category:'travel',location:'Test Country A and B',start:'2022-08-04',end:'2022-10-20',source:'calendar',sourceRef:'calendar:travel:a'},
 {title:'Travel B',category:'travel',location:'Test Country C',start:'2024-12-19',end:'2025-01-13',source:'calendar',sourceRef:'calendar:travel:b'}
]});
test('four LinkedIn volunteer spans and two travel candidates are valid and month precision preserved',()=>{
 const list=parseLifeEventsImport(example);assert.equal(list.length,6);assert.equal(list.filter(x=>x.category==='volunteer').length,4);assert.equal(list.filter(x=>x.category==='travel').length,2);assert.equal(list[0].startPrecision,'month');assert.equal(list[0].endPrecision,'month');
 assert.equal(list.find(x=>x.sourceRef==='linkedin:vol:3').location,'Test City, Country');
});
test('ongoing relationships need no end date and fill current week, not future weeks',()=>{
 const e=validateLifeEvent({title:'Partnerschaft',category:'relationship',person:'Partnerin',start:'2021-01-01',ongoing:true});assert.equal(e.end,'');assert.equal(e.private,true);
 const cells=lifeWeekCells(43,{today:'2026-10-31',events:[e]});assert.ok(cells.some(c=>c.status==='current'&&c.events.includes(e)));
 assert.equal(cells.filter(c=>c.status==='future'&&c.events.length).length,0);
});
test('parallel partners and education show in annual timeline without overwriting travel colors',()=>{
 const a=validateLifeEvent({title:'Partnerschaft A',category:'relationship',person:'A',start:'2020-01-01',end:'2027-01-01'});
 const b=validateLifeEvent({title:'Partnerschaft B',category:'relationship',person:'B',start:'2022-01-01',ongoing:true});
 const c=validateLifeEvent({title:'Studium',category:'education',organization:'TU Graz',start:'2023-01-01',ongoing:true});
 const ui=lifeWeeksView({lifeWeekEvents:[a,b,c]}, {today:'2026-10-31',selectedAge:43});
 assert.match(ui,/lw84-relationship-ribbon/);assert.match(ui,/lw84-timeline/);assert.match(ui,/Ongoing/);assert.match(ui,/TU Graz/);
});
test('import requires correct schema and rejects malformed or excessive data',()=>{
 assert.throws(()=>parseLifeEventsImport('no'),/JSON/);
 assert.throws(()=>parseLifeEventsImport(JSON.stringify({schema:'other',events:[]})),/compass_life_events_v1/);
 assert.throws(()=>parseLifeEventsImport(JSON.stringify({schema:'compass_life_events_v1',events:Array(151).fill({})})),/Maximal/);
});
test('existing sourceRef prevents duplicate import, idempotent second application',()=>{
 const state={};const first=parseLifeEventsImport(example,{existing:[]});assert.equal(applyLifeEventsImport(state,first),6);
 const after=parseLifeEventsImport(example,{existing:state.lifeWeekEvents});assert.ok(after.every(x=>x.duplicate));
 assert.equal(applyLifeEventsImport(state,after),0);assert.equal(state.lifeWeekEvents.length,6);
});
test('PDF default excludes private relationships, explicit choice includes them',()=>{
 const person=validateLifeEvent({title:'Partnerin Privat',person:'Privat',category:'relationship',start:'2020-01-01',ongoing:true});
 const normal=validateLifeEvent({title:'Wanderung',category:'travel',start:'2024-05-01',end:'2024-05-07'});
 const a=lifeWeeksPosterModel({events:[person,normal],today:'2026-10-31'});
 assert.equal(a.events.length,1);assert.equal(a.events[0].title,'Wanderung');
 const b=lifeWeeksPosterModel({events:[person,normal],includePrivateRelationships:true,today:'2026-10-31'});
 assert.equal(b.events.length,2);
});
test('source date errors must be flagged instead of converted to invented values',()=>{
 assert.throws(()=>validateLifeEvent({title:'Zertifikat',start:'2025-03-15',end:'2026-01-01',startPrecision:'month',category:'education'}));
 assert.throws(()=>validateLifeEvent({title:'Bildung',start:'2025-03-01',end:'2025-04-01',endPrecision:'month',category:'education'}));
});
