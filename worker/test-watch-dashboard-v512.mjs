import {test} from 'node:test';
import assert from 'node:assert/strict';
import {watchDashboard,watchCalendarPublish,watchShoppingToggle,significantCalendarEvents} from './src/watch-dashboard-v512.js';
const uuid='12345678-1234-4234-9234-1234567890ab';
function fixture(){
 const store={events:'',updatedAt:'',v:2,checked:false};
 const db={prepare(sql){let args=[];return {bind(...v){args=v;return this;},async first(){
  if(sql.includes('watch_devices'))return {owner_sub:'owner'};
  if(sql.includes('watch_calendar_daily'))return store.events?{events_json:store.events,updated_at:store.updatedAt}:null;
  return null;
 },async all(){
  if(sql.includes('planning_tasks t'))return {results:[{id:uuid,title:'Hafermilch Barista',completed:store.checked,version:store.v}]};
  if(sql.includes('planning_tasks'))return {results:[{id:uuid,title:'Vorbereitung',due_date:'2026-10-29',planned_date:'2026-10-27',category:'Lehre'}]};
  return {results:[]};
 },async run(){
  if(sql.includes('INSERT INTO watch_calendar_daily')){store.events=args[2];store.updatedAt=args[3];}
  if(sql.includes('UPDATE planning_tasks SET completed')){store.checked=Boolean(args[0]);store.v++;}
  return {meta:{changes:1}};
 }};}};
 return {store,env:{DB:db}};
}
const watchReq=(path,method='GET',data)=>new Request('https://local'+path,{method,headers:{authorization:'Bearer cw1_'+ 'a'.repeat(64),...data?{'content-type':'application/json'}:{}},...(data?{body:JSON.stringify(data)}:{})});
test('no unauthorized watch data',async()=>{
 const r=await watchDashboard(new Request('https://local/api/watch/dashboard?day=2026-10-27'),fixture().env);assert.equal(r.status,401);
});
test('dashboard loads actual tasks, dated due and shopping only',async()=>{
 const {env}=fixture();const r=await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env);assert.equal(r.status,200);
 const d=await r.json();assert.equal(d.events.length,0);assert.equal(d.today.length,1);assert.equal(d.shopping[0].title,'Hafermilch Barista');
});
test('already stored Compass calendar projected without Google OAuth',async()=>{
 const {env}=fixture();const req=watchReq('/api/watch/calendar-snapshot','POST',{day:'2026-10-27',events:[{start:'09:00',end:'10:30',title:'Jour fixe UFO'}]});
 const pub=await watchCalendarPublish(req,env,{sub:'owner'});assert.equal(pub.status,200);
 const d=await (await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env)).json();
 assert.deepEqual(d.events.map(x=>x.start+'-'+x.end),['09:00-10:30']);
});
test('invalid calendar boundaries rejected',async()=>{
 const r=await watchCalendarPublish(watchReq('/api/watch/calendar-snapshot','POST',{day:'2026-10-27',events:[{start:'14:30',end:'09:00',title:'bad'}]}),fixture().env,{sub:'owner'});assert.equal(r.status,400);
});
test('shopping write is version-aware and idempotent conflict checks',async()=>{
 const {env}=fixture();const req=watchReq('/api/watch/shopping/toggle','POST',{id:uuid,version:2,checked:true});
 assert.equal((await watchShoppingToggle(req,env)).status,200);
 const conflict=await watchShoppingToggle(watchReq('/api/watch/shopping/toggle','POST',{id:uuid,version:2,checked:false}),env);
 assert.equal(conflict.status,409);
});

test('Watch ring excludes generic Work and short events but retains meaningful 90/120-minute appointments',async()=>{
 const raw=[{title:'Work',start:'08:00',end:'17:00'},
 {title:'Kurzer Reminder',start:'08:30',end:'08:45'},
 {title:'Jour fixe UKO',start:'09:00',end:'10:30'},
 {title:'Lehre',start:'13:00',end:'15:00'},
 {title:'Work meeting mit Kollegen',start:'15:00',end:'16:00'}];
 assert.deepEqual(significantCalendarEvents(raw).map(x=>x.title),['Jour fixe UKO','Lehre','Work meeting mit Kollegen']);
 const {env}=fixture();
 const pub=await watchCalendarPublish(watchReq('/api/watch/calendar-snapshot','POST',{day:'2026-10-27',events:raw}),env,{sub:'owner'});
 assert.equal(pub.status,200);
 const body=await (await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env)).json();
 assert.deepEqual(body.events.map(e=>e.title),['Jour fixe UKO','Lehre','Work meeting mit Kollegen']);
});
