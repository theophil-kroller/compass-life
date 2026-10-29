import test from 'node:test';
import assert from 'node:assert/strict';
import {validWatchSession,acceptWatchSession,listWatchSessions} from '../worker/src/watch.js';
import {projectActivities,validActivityEdit} from '../client/src/activity-management.js';
import {activityTotals,stackedWorkDays,timeProgressMarkup,projectTimeText} from '../client/src/focus-productivity-v57759402510.js';
import {unifiedTimeBreakdown,unifiedTimeEntries,timeJournalView} from '../client/src/personal-journal-v5692.js';
const id='w'+'a'.repeat(32);
const started=Math.floor(new Date('2026-10-29T08:00:00Z').getTime()/1000);
const base={id,activity:'Pruefungskorrektur',startedAt:started,durationSec:1500,focusSec:1500,breakSec:0,pomodoros:1,hrSamples:[],bbSamples:[],bbStart:null,bbEnd:null,revision:1,finalized:false};
function D1(){
 let rows=[];
 return {rows,db:{prepare(sql){let args=[];return {bind(...a){args=a;return this},async first(){if(sql.includes('watch_deleted_sessions'))return null;if(sql.includes('watch_devices'))return {owner_sub:'owner',revoked:0};return null},async run(){
  if(!sql.includes('INSERT INTO watch_sessions'))return {meta:{changes:1}};
  const [owner,id,token,activity,started_at,duration_sec,focus_sec,break_sec,pomodoros,hr_samples_json,bb_samples_json,body_battery_start,body_battery_end,received_at,revision,finalized]=args;
  const item={owner_sub:owner,session_id:id,activity,started_at,duration_sec,focus_sec,break_sec,pomodoros,hr_samples_json,bb_samples_json,body_battery_start,body_battery_end,revision,finalized};
  const prior=rows.find(x=>x.owner_sub===owner&&x.session_id===id);
  if(!prior){rows.push(item);return {meta:{changes:1}};}
  if(prior.finalized===0&&revision>prior.revision&&prior.started_at===started_at){Object.assign(prior,item);return {meta:{changes:1}};}
  return {meta:{changes:0}};
 },async all(){
  if(!sql.includes('FROM watch_sessions'))return {results:[]};
  let matches=rows.filter(r=>r.owner_sub===args[0]).sort((a,b)=>b.started_at-a.started_at||b.session_id.localeCompare(a.session_id));
  if(args.length===5)matches=matches.filter(r=>r.started_at<args[1]||(r.started_at===args[2]&&r.session_id<args[3]));
  return {results:matches.slice(0,args.at(-1))};
 }};}}};
}
const token='cw1_'+'f'.repeat(64);
async function post(db,entry){const req=new Request('https://test.local/api/watch/sessions',{method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify(entry)});return (await acceptWatchSession(req,{DB:db})).json()}
test('Pomodoro checkpoints update a single immutable final session, replay is idempotent',async()=>{
 const {db,rows}=D1();assert.equal(validWatchSession(base),true);
 assert.equal((await post(db,base)).duplicate,false);assert.equal(rows.length,1);
 assert.equal((await post(db,base)).duplicate,true);
 const newer={...base,revision:2,durationSec:3300,focusSec:3000,breakSec:300,pomodoros:2};
 assert.equal((await post(db,newer)).duplicate,false);assert.equal(rows[0].pomodoros,2);
 const final={...newer,revision:3,finalized:true,durationSec:3500,breakSec:500};
 assert.equal((await post(db,final)).duplicate,false);assert.equal(rows[0].finalized,1);
 assert.equal((await post(db,newer)).duplicate,true);
 assert.equal((await post(db,final)).duplicate,true);
 assert.equal(rows[0].pomodoros,2);assert.equal(rows.length,1);
 const list=await(await listWatchSessions({DB:db},{sub:'owner'})).json();
 assert.equal(list.sessions[0].finalized,true);assert.equal(list.sessions[0].focusSec,3000);
});
test('pagination returns every record with stable keyset cursor',async()=>{
 const {db,rows}=D1();for(let i=0;i<6;i++)rows.push({owner_sub:'owner',session_id:'w'+i.toString(16).padStart(32,'0'),activity:'Forschung',started_at:started+i,duration_sec:1500,focus_sec:1500,break_sec:0,pomodoros:1,hr_samples_json:'[]',bb_samples_json:'[]',body_battery_start:null,body_battery_end:null,revision:0,finalized:1});
 let cursor=null,all=[];
 do{const req=new Request('https://x.invalid/api/watch/sessions?limit=2'+(cursor?'&cursor='+encodeURIComponent(cursor):''));const d=await(await listWatchSessions({DB:db},{sub:'owner'},req)).json();all.push(...d.sessions);cursor=d.nextCursor;}while(cursor);
 assert.equal(all.length,6);assert.equal(new Set(all.map(s=>s.id)).size,6);
});
test('historical generic exam stays reviewable; explicit correction keeps distinct category and project',()=>{
 const state={activityEdits:{},manualActivities:{},projects:{p1:{title:'Australien'}}};
 const watch=[{...base,activity:'Pruefungen',pomodoros:2,revision:0,finalized:true},{...base,id:'w'+'b'.repeat(32),activity:'Forschung',pomodoros:1,focusSec:1200}];
 let list=projectActivities(watch,state);assert.equal(list.find(x=>x.id===id).activityTypeReview,true);
 state.activityEdits[id]={activityType:'Pruefungskorrektur',projectId:'p1'};list=projectActivities(watch,state);
 assert.equal(list.find(x=>x.id===id).activityTypeReview,false);
 assert.equal(activityTotals(list).pomodoros,3);
 assert.match(projectTimeText(list,'p1'),/erfasst/);
 assert.match(stackedWorkDays(list,[{day:'2026-10-29',workMinutes:50,pomodoros:3}]),/Prüfungskorrektur/);
 assert.match(timeProgressMarkup(list,'2026-10-29','2026-10-29'),/Forschung/);
 assert.equal(validActivityEdit({title:'Korrekturen',category:'Arbeit',startedAt:'2026-10-29T09:00',durationMinutes:25,note:'',projectId:'p1',activityType:'Pruefungskorrektur'}),true);
});
test('Garmin + quick work intervals count only once in journal totals, watch rows open Activity Inspector',()=>{
 const state={projects:{p1:{title:'Australien'}},quickWorktime:{sessions:[{id:'q1',start:'2026-10-29T08:00:00Z',end:'2026-10-29T09:00:00Z',category:'work'}]},timeJournal:{entries:[],overrides:{}}};
 const watch=[{id,source:'Garmin',category:'Arbeit',title:'Forschung',startedAt:'2026-10-29T10:30',durationMinutes:30,projectId:'p1'}];
 // Timezone-independent proof: overlap same local clock hour as the watch.
 state.quickWorktime.sessions[0].start=new Date('2026-10-29T10:30').toISOString();
 state.quickWorktime.sessions[0].end=new Date('2026-10-29T11:00').toISOString();
 const r=unifiedTimeBreakdown(state,watch,7,new Date('2026-10-29T15:00'));
 assert.equal(r.totalMinutes,30);assert.equal(r.totals.work,30);
 assert.equal(unifiedTimeEntries(state,watch).length,2);
 assert.match(timeJournalView(state,{period:7,watchActivities:watch}),/data-action="activity-open"/);
});
