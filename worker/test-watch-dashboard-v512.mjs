import {test} from 'node:test';
import assert from 'node:assert/strict';
import {watchDashboard,watchCalendarPublish,watchShoppingToggle,significantCalendarEvents,familySchoolDeadlines} from './src/watch-dashboard-v512.js';
const uuid='12345678-1234-4234-9234-1234567890ab';
function fixture(){
 const store={events:'',updatedAt:'',v:2,checked:false};
 const db={prepare(sql){let args=[];return {bind(...v){args=v;return this;},async first(){
  if(sql.includes('watch_devices'))return {owner_sub:'owner'};
  if(sql.includes('watch_calendar_daily'))return store.events?{events_json:store.events,updated_at:store.updatedAt}:null;
  return null;
 },async all(){
  if(sql.trimStart().startsWith('SELECT p.id,p.title,p.updated_at FROM planning_projects p'))return {results:[{id:'12345678-1234-4234-9234-1234567890af',title:'Einkaufsliste – Hofer'}]};
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
 const d=await r.json();assert.equal(d.events.length,0);assert.equal(d.today.length,1);assert.equal(d.shopping[0].title,'Hafermilch Barista');assert.equal(d.shoppingListTitle,'Einkaufsliste – Hofer');
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

test('Nathanael school exam from Compass Calendar appears once as N: deadline', async()=>{
 const {env}=fixture();const day='2026-10-27';
 const request=watchReq('/api/watch/calendar-snapshot','POST',{day,events:[],familyDeadlines:[
  {date:'2026-11-04',title:'N: Englisch-Schularbeit'},
  {date:'2026-11-04',title:'N: Englisch-Schularbeit'},
  {date:'2026-11-15',title:'N: Mathe-Schularbeit'}]});
 assert.equal((await watchCalendarPublish(request,env,{sub:'owner'})).status,200);
 const data=await (await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env)).json();
 assert.deepEqual(data.deadlines.filter(x=>x.family).map(x=>x.title),['N: Englisch-Schularbeit']);
});
test('future school deadlines validate dates and provenance prefix',()=>{
 assert.deepEqual(familySchoolDeadlines([{date:'2026-11-04',title:'N: Mathe-Schularbeit'},{date:'2026-11-04',title:'English Work'}],'2026-10-27').map(x=>x.title),['N: Mathe-Schularbeit']);
});
test('selected shopping project determines list and duplicate titles within that project are suppressed',async()=>{
 const hofer='11111111-1111-4111-8111-111111111111';
 const spar='22222222-2222-4222-8222-222222222222';
 const mem={events:JSON.stringify({events:[],familyDeadlines:[],shoppingProjectId:hofer})};
 const env={DB:{prepare(sql){let args=[];return {bind(...v){args=v;return this;},async first(){
  if(sql.includes('watch_devices'))return {owner_sub:'owner'};
  if(sql.includes('watch_calendar_daily'))return {events_json:mem.events,updated_at:'2026-10-27T07:00:00Z'};
  return null;
 },async all(){
  if(sql.trimStart().startsWith('SELECT p.id,p.title,p.updated_at FROM planning_projects p'))return {results:[{id:spar,title:'Einkaufsliste – Spar'},{id:hofer,title:'Einkaufsliste – Hofer'}]};
  if(sql.includes('planning_tasks t'))return {results:args[1]===hofer?[
    {id:uuid,title:'Toilettenpapier',completed:0,version:1},
    {id:'33333333-3333-4333-8333-333333333333',title:'  toilettenpapier  ',completed:0,version:1},
    {id:'44444444-4444-4444-8444-444444444444',title:'Barista Hafermilch',completed:0,version:1}
  ]:[{id:uuid,title:'Spar Liste',completed:0,version:1}]};
  if(sql.includes('planning_tasks'))return {results:[]};
  return {results:[]};
 },async run(){return {meta:{changes:1}};}};}}};
 const data=await (await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env)).json();
 assert.equal(data.shoppingListTitle,'Einkaufsliste – Hofer');
 assert.deepEqual(data.shopping.map(x=>x.title),['Toilettenpapier','Barista Hafermilch']);
});

test('watch dashboard returns list options, selects exactly the requested list and rejects bad ids',async()=>{
 const {env}=fixture();
 const a=await (await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env)).json();
 assert.equal(a.shoppingLists.length,1);
 assert.equal(a.shoppingListId,'12345678-1234-4234-9234-1234567890af');
 assert.equal((await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27&list=../../../other'),env)).status,400);
});
test('person projection is opt-in: absent by default and accepts bounded names and agenda titles',async()=>{
 const {env}=fixture();
 const none=await (await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env)).json();
 assert.deepEqual(none.people,[]);
 const pub=await watchCalendarPublish(watchReq('/api/watch/calendar-snapshot','POST',{day:'2026-10-27',events:[],people:[{name:'Martin',points:['Urlaub klären']}]}),env,{sub:'owner'});
 assert.equal(pub.status,200);
 const one=await (await watchDashboard(watchReq('/api/watch/dashboard?day=2026-10-27'),env)).json();
 assert.deepEqual(one.people,[{name:'Martin',points:['Urlaub klären']}]);
 const bad=await watchCalendarPublish(watchReq('/api/watch/calendar-snapshot','POST',{day:'2026-10-27',events:[],people:[{name:'X',points:['a','b','c','d','e']}]}),env,{sub:'owner'});
 assert.equal(bad.status,400);
});
