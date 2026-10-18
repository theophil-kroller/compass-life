import test from 'node:test';
import assert from 'node:assert/strict';
import {OCCASION_STEPS,easterSunday,annualHolidays,upcomingOccasions,daysUntil,occasionTask,occasionTaskTag,relatedOccasionTask,shiftDay,validCustomStep} from '../client/src/occasion-planning.js';
import {validLocalTask,nextActions} from '../client/src/tasks.js';
import {activeActivities,projectActivities,activityStats,validManualActivity,isValidLocalDateTime,timelineItems} from '../client/src/activity-management.js';
import {DEFAULT_CALENDAR_RULES,classifyCalendarEvent} from '../client/src/calendar-rules.js';
const uuid='12345678-1234-4234-b234-123456789abc';
const appearance=e=>classifyCalendarEvent(e,DEFAULT_CALENDAR_RULES);
test('Easter and Christmas use Gregorian recurring dates, including year rollover',()=>{
 assert.equal(easterSunday(2026),'2026-04-05');
 assert.equal(easterSunday(2027),'2027-03-28');
 assert.equal(easterSunday(2030),'2030-04-21');
 assert.deepEqual(annualHolidays('2026-10-18',70).map(x=>[x.kind,x.date]),[['christmas','2026-12-24']]);
 assert.deepEqual(annualHolidays('2027-03-01',40).map(x=>[x.kind,x.date]),[['easter','2027-03-28']]);
 assert.deepEqual(annualHolidays('2026-12-27',70),[]);
 assert.equal(shiftDay('2027-01-01',-14),'2026-12-18');
 assert.equal(daysUntil('2026-10-18','2026-12-24'),67);
});
test('Birthday events opt-in and filter canceled/hidden entries; no unrelated events',()=>{
 const events=[
 {id:'birthday-1',summary:'Geburtstag von Paul',start:{date:'2026-10-31'},eventType:'birthday'},
 {id:'safety',summary:'⚠️ No flying after diving',start:{date:'2026-11-01'}},
 {id:'cancel',summary:'Birthday canceled',status:'cancelled',start:{date:'2026-10-30'}},
 {id:'hidden',summary:'Geburtstag xyz',start:{date:'2026-10-29'}}
 ];
 const found=upcomingOccasions(events,e=>e.id==='hidden'?{hidden:true}:appearance(e),'2026-10-18',21);
 assert.deepEqual(found.map(x=>x.kind),['birthday']);
 assert.equal(found[0].title,'Paul');
 assert.equal(found[0].date,'2026-10-31');
});
test('Holiday suggestions have staged deadlines and become ordinary validated synced Next Actions only by explicit creation',()=>{
 const occasion=annualHolidays('2026-10-18',70)[0];
 const gather=OCCASION_STEPS.christmas.find(s=>s.id==='gather');
 const gifts=OCCASION_STEPS.christmas.find(s=>s.id==='gifts');
 assert.equal(daysUntil('2026-10-18',occasion.date)>gather.daysBefore,true); // Not yet prompted.
 const readyDay='2026-11-06';
 assert.equal(daysUntil(readyDay,occasion.date)<=gather.daysBefore,true);
 const task=occasionTask(gifts,occasion,uuid,'','2026-10-18');
 assert.ok(validLocalTask(task));assert.equal(task.dueDate,'2026-12-17');assert.equal(task.plannedDate,'2026-11-12');
 assert.equal(task.deferUntil,'2026-11-12');
 const late=occasionTask(gifts,occasion,uuid,'','2026-12-20');
 assert.equal(late.dueDate,'2026-12-20');assert.equal(late.plannedDate,'2026-12-20');
 assert.equal(nextActions({tasks:{[uuid]:task},projects:{}},'2026-11-06').length,0);
 assert.equal(nextActions({tasks:{[uuid]:task},projects:{}},'2026-11-12').length,1);
 const state={tasks:{[uuid]:task}};
 assert.equal(relatedOccasionTask(state,occasion,gifts)?.id,uuid);
 assert.equal(occasionTaskTag(occasion,gifts),task.tags.find(x=>x.startsWith('anlass-')));
 assert.ok(!relatedOccasionTask(state,occasion,gather));
 assert.ok(validCustomStep({id:'custom-'+uuid,label:'Tisch buchen',daysBefore:5,deadlineBefore:2,minutes:15}));
});
test('Garmin edits and manual sessions aggregate correctly, soft delete restorable, purged invisible',()=>{
 const watch=[{id:'w'+'a'.repeat(32),activity:'Forschung',startedAt:Date.parse('2026-10-17T08:00:00Z')/1000,durationSec:3600,pomodoros:2}];
 const manual={id:'manual-'+uuid,title:'Wandern',category:'Erholung',startedAt:'2026-10-17T11:00',durationMinutes:75,projectId:'',note:'',deleted:false};
 assert.equal(validManualActivity(manual),true);
 assert.equal(isValidLocalDateTime('2026-02-30T12:40'),false);
 const state={manualActivities:{[manual.id]:manual},activityEdits:{}};
 assert.equal(projectActivities(watch,state).length,2);
 assert.equal(activeActivities(watch,state).length,2);
 assert.equal(activityStats(activeActivities(watch,state),'2026-10-17','2026-10-17').recoveryMinutes,75);
 state.activityEdits[watch[0].id]={title:'Andere Kategorie',deleted:true};
 assert.equal(activeActivities(watch,state).length,1);
 state.activityEdits[watch[0].id].deleted=false;
 assert.equal(activeActivities(watch,state).length,2);
 state.activityEdits[watch[0].id].purged=true;
 assert.equal(projectActivities(watch,state).length,1);
});
test('Timeline separates deadlines, planned tasks, milestones and calendar recovery',()=>{
 const state={tasks:{[uuid]:{id:uuid,title:'Muss',plannedDate:'2026-11-03',dueDate:'2026-11-05',archived:false,completed:false,projectId:null}},projects:{}};
 const events=[{id:'sauna',summary:'Sauna',start:{date:'2026-11-04'}}];
 const list=timelineItems(state,events,'2026-11-01','2026-11-10',appearance);
 assert.deepEqual(list.map(x=>x.type),['planned','calendar','due']);
 assert.equal(list[1].icon,'🧖');
});
