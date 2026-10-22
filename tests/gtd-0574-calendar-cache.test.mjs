import test from 'node:test';
import assert from 'node:assert/strict';
import {applyCalendarWindow,mergeCalendarArchives,calendarFetchWindows,calendarSyncStart,visibleCachedCalendar,normalizeCalendarArchive} from '../client/src/calendar-cache-v574.js';
const seen='2026-10-22T12:00:00.000Z';
const event=(id,day,updated=seen)=>({id,summary:`Event ${id}`,start:{date:day},end:{date:day},updated,status:'confirmed'});
test('archive retains past while updating future, no duplication',()=>{
 let a=applyCalendarWindow(null,[event('old','2023-09-21'),event('next','2023-12-01')],{start:'2023-09-01',end:'2024-01-01',seenAt:seen});
 let b=applyCalendarWindow(a,[event('next','2023-12-01')],{start:'2023-11-01',end:'2024-01-01',seenAt:'2026-10-23T11:00:00Z'});
 assert.equal(b.events.length,2);assert.equal(visibleCachedCalendar(b).length,2);
 assert.equal(visibleCachedCalendar(b).find(x=>x.id==='old').summary,'Event old');
});
test('missing entries in complete window are tombstoned and do not reappear on device merge',()=>{
 let a=applyCalendarWindow(null,[event('a','2026-10-20'),event('b','2026-11-01')],{start:'2026-10-01',end:'2026-12-01',seenAt:'2026-10-20T08:00:00Z'});
 let b=applyCalendarWindow(a,[event('b','2026-11-01')],{start:'2026-10-01',end:'2026-12-01',seenAt:'2026-10-22T08:00:00Z'});
 assert.equal(visibleCachedCalendar(b).length,1);
 assert.equal(visibleCachedCalendar(mergeCalendarArchives(a,b)).length,1);
});
test('incomplete fetch fails closed',()=>{assert.throws(()=>applyCalendarWindow(null,[],{start:'2025-01-01',end:'2025-12-31',seenAt:seen,complete:false}));});
test('sync range uses observed earliest stress and rechecks future',()=>{
 const imported={garminWellness:[{at:'2024-03-10T12:00:00Z',stress:72},{at:'2025-05-21T06:00:00Z',stress:10}]};
 assert.equal(calendarSyncStart(imported,'2026-10-22'),'2024-03-10');
 const first=calendarFetchWindows(null,imported,'2026-10-22');assert.ok(first.length>1);assert.equal(first[0].start,'2024-03-10');
 const cached=normalizeCalendarArchive({events:[],start:'2024-03-10',end:'2027-10-22',completed:true,updatedAt:seen});
 const second=calendarFetchWindows(cached,imported,'2026-10-22');assert.ok(second.every(w=>w.start>='2026-07-24'));
});
test('no token, sensitive guest fields, or description are persisted',()=>{
 const eventWithPrivate={...event('secure','2026-10-23'),description:'Private notes',attendees:[{email:'private@test.com'}],hangoutLink:'secret',token:'secret'};
 const archive=applyCalendarWindow(null,[eventWithPrivate],{start:'2026-10-01',end:'2026-11-01',seenAt:seen});
 const data=JSON.stringify(archive);assert.ok(!data.includes('private@test.com')&&!data.includes('Private notes')&&!data.includes('secret'));
});
