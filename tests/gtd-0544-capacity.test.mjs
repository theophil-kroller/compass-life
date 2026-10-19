import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {capacityForecast,capacitySettings,capacitySuggestions,busyIntervals,mergeIntervals} from '../client/src/capacity-engine-v44.js';
const today='2026-10-19';
const now=new Date('2026-10-19T08:00:00');
const coverage={complete:true,start:'2026-10-01',end:'2026-11-30'};
const input={connected:true,coverage,updatedAt:now.getTime(),now,startDay:today,days:1};
const ev=(start,end,extra={})=>({start:{dateTime:start},end:{dateTime:end},...extra});
const t=(a,b)=>ev(`${today}T${a}:00`,`${today}T${b}:00`);
test('No connected calendar => unknown, never invented free slots',()=>{
 const v=capacityForecast({...input,connected:false});assert.equal(v.status,'disconnected');assert.equal(v.totalMinutes,null);assert.deepEqual(v.slots,[]);
});
test('Incomplete pagination and stale calendar cannot authorize free hours',()=>{
 assert.equal(capacityForecast({...input,coverage:{...coverage,complete:false}}).status,'partial');
 assert.equal(capacityForecast({...input,updatedAt:now.getTime()-3*3600000}).status,'stale');
 assert.equal(capacityForecast({...input,coverage:{...coverage,end:'2026-10-19'}}).status,'partial');
});
test('Merging overlapping meetings plus 10 min margins, no double-counting',()=>{
 const v=capacityForecast({...input,events:[t('10:00','11:00'),t('10:30','12:00')]});
 assert.deepEqual(v.slots.map(s=>[new Date(s.start).getHours(),new Date(s.end).getHours(),s.minutes]),[[9,9,50],[12,17,290]]);
 assert.equal(v.totalMinutes,340);
});
test('Hidden/routine events still block, transparent and cancelled do not',()=>{
 const v=capacityForecast({...input,events:[{...t('09:00','10:00'),summary:'Work',hidden:true},t('10:30','11:30'),{...t('12:00','13:00'),transparency:'transparent'},{...t('14:00','15:00'),status:'cancelled'}]});
 assert.equal(v.slots.length,1);assert.equal(v.slots[0].minutes,320);assert.equal(v.totalMinutes,320);
});
test('Opaque all-day event blocks day, transparent all-day does not',()=>{
 const all={start:{date:today},end:{date:'2026-10-20'}};
 assert.equal(capacityForecast({...input,events:[all]}).totalMinutes,0);
 assert.equal(capacityForecast({...input,events:[{...all,transparency:'transparent'}]}).totalMinutes,480);
});
test('Weekend excluded by default, optionally counted',()=>{
 const sunday='2026-10-25',s={...input,startDay:sunday,days:1};
 assert.equal(capacityForecast(s).totalMinutes,0);
 assert.equal(capacityForecast({...s,settings:{weekends:true}}).totalMinutes,480);
});
test('Filter short slots; elapsed time today does not return past time',()=>{
 const n=new Date('2026-10-19T16:35:00');
 const v=capacityForecast({...input,now:n,updatedAt:n.getTime()});assert.equal(v.totalMinutes,0); // 25 minutes left < configured 30-minute minimum
});
test('Time window preferences normalized and bounded, invalid end corrected',()=>{
 assert.deepEqual(capacitySettings({startHour:18,endHour:9,bufferMinutes:999,weekends:true}),{startHour:18,endHour:19,bufferMinutes:10,minSlotMinutes:30,weekends:true});
});
test('No write actions; suggestions obey existing next actions, estimates and unknowns',()=>{
 const f=capacityForecast(input);
 const task={id:'a',title:'Korrigieren',category:'Allgemein',workflow:'next',estimateMinutes:45,progressTarget:null};
 const state={tasks:{a:task},projects:{}};
 const original=JSON.stringify(state);
 const r=capacitySuggestions(state,f);assert.equal(r.length,1);assert.equal(r[0].task.id,'a');assert.equal(r[0].estimateUnknown,false);assert.equal(JSON.stringify(state),original);
 assert.deepEqual(capacitySuggestions(state,{...f,status:'partial'}),[]);
});
test('Capacity is integrated read-only in forecast and short hint at Heute',()=>{
 const m=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(m,/capacityPanel\(\)/);assert.match(m,/compactCapacityHint\(\)/);assert.match(m,/capacity-settings-form/);
 assert.doesNotMatch(readFileSync(new URL('../client/src/capacity-engine-v44.js',import.meta.url),'utf8'),/fetch\(|localStorage|writeFile/);
});
