import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendarBirthdayCandidates,familyWorkerSnapshot,buildFamilyTodayHtml,createDeferredFamilyCache} from '../client/src/today-core-deferred-v5775940259.js';
import {todayBirthdayHighlights,todayBirthdayPanel} from '../client/src/today-birthdays-v5775940255.js';
import {familySuggestions,familyTodayObservations,familyTodayPanel} from '../client/src/family-radar-v5775931.js';
import {compass5940259TodayDeferred} from '../client/compass5940259-today-deferred.js';
const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const today='2026-10-29';
const birthday=(id,summary,date)=>({id,summary,start:{date},end:{date:'2026-10-30'}});
test('birthday ribbon remains immediate for all contact types; old/future events are excluded',()=>{
 const people={mom:{id:'mom',name:'Mutter',birthdayMonthDay:'10-29',relationKind:'family'},
  pal:{id:'pal',name:'Freundin Anna',birthdayMonthDay:'10-30',relationKind:'friend'},
  peer:{id:'peer',name:'Arbeitskollege Leo',birthdayMonthDay:'11-02',relationKind:'colleague'}};
 const events=[birthday('old','Alter Geburtstag','2026-10-20'),birthday('future','Ferne Birthday','2026-11-08'),birthday('friend','Geburtstag Martina','2026-10-29'),birthday('holiday','Besprechung','2026-10-29')];
 const narrowed=calendarBirthdayCandidates(events,today,7);
 assert.deepEqual(narrowed.map(e=>e.id),['friend','holiday']);
 const birthdays=todayBirthdayHighlights(narrowed,()=>({}),people,today);
 assert.ok(birthdays.some(b=>b.title==='Mutter'&&b.days===0));
 assert.ok(birthdays.some(b=>b.title==='Martina'&&b.days===0));
 assert.ok(birthdays.some(b=>b.title==='Freundin Anna'&&b.days===1));
 assert.ok(birthdays.some(b=>b.title==='Arbeitskollege Leo'));
 const html=todayBirthdayPanel(birthdays);
 assert.match(html,/🎂/);assert.match(html,/Mutter/);assert.match(html,/Martina/);
 assert.doesNotMatch(html,/Alter Geburtstag|Ferne Birthday/);
});
test('worker snapshot uses minimal task data and preserves Family Radar observations',()=>{
 const people={kid:{id:'kid',name:'Nathanael',relationKind:'family',aliases:'Nathaniel',contactLog:[{secret:'private'}]}};
 const calendar=[{id:'exam',summary:'Nathanael: Mathematik-Schularbeit',start:{date:'2026-11-05'},end:{date:'2026-11-06'}},
  {id:'unrelated',summary:'Beratung',start:{date:'2026-11-05'}},
  {id:'far',summary:'Nathanael: Test',start:{date:'2027-02-01'}},
  {id:'hidden',summary:'Nathanael: Schularbeit',start:{date:'2026-11-01'}}];
 const state={familyRadar:{rules:{kid:{role:'child',enabled:true}}},tasks:{x:{familyRadarKey:'ref',note:'unrelated full secret'}},projects:{},health:{secret:'health'},finance:{secret:'finance'}};
 const visible=calendar.filter(e=>!e.id.includes('hidden')&&e.summary.includes(':'));
 const original=familyTodayPanel(familySuggestions(visible,people,state,{today}),familyTodayObservations(visible,people,state,{today}));
 const snap=familyWorkerSnapshot(calendar,people,state,today,e=>({hidden:e.id==='hidden'}));
 assert.equal(snap.events.length,1);
 assert.equal(snap.events[0].id,'exam');
 assert.ok(!JSON.stringify(snap).includes('private'));
 assert.ok(!JSON.stringify(snap).includes('health'));
 assert.ok(!JSON.stringify(snap).includes('unrelated full secret'));
 assert.equal(buildFamilyTodayHtml(snap),original);
 assert.match(original,/Nathanael/);
});
test('stale worker results are ignored; current result caches and lock invalidates it',()=>{
 const cache=createDeferredFamilyCache(),instances=[];
 const factory=()=>{const w={terminated:false,onmessage:null,onerror:null,postMessage(msg){w.last=msg;},terminate(){w.terminated=true;}};instances.push(w);return w;};
 const ready=[];
 const key1=['2026-10-29',1],key2=['2026-10-29',2];
 cache.schedule(key1,{},html=>ready.push(html),{workerFactory:factory});
 assert.equal(cache.peek(key1),null);assert.ok(cache.isPending(key1));
 cache.schedule(key2,{},html=>ready.push(html),{workerFactory:factory});
 assert.equal(instances[0].terminated,true);
 instances[0].onmessage({data:{job:instances[0].last.job,html:'STALE'}});
 assert.deepEqual(ready,[]);
 instances[1].onmessage({data:{job:instances[1].last.job,html:'CURRENT'}});
 assert.deepEqual(ready,['CURRENT']);assert.equal(cache.peek(key2),'CURRENT');
 cache.clear();assert.equal(cache.peek(key2),null);assert.equal(instances[1].terminated,true);
});
test('transform defers family but keeps birthdays on first paint and clears on lock',()=>{
 const src=read('transformed-main-preview.js'),config=read('client/vite.config.js');
 assert.match(src,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.25\.9'/);
 assert.match(src,/calendarBirthdayCandidates\(calendarEvents,familyNow,7\)/);
 assert.match(src,/todayBirthdayPanel\(birthdays\)\+'<div data-core259-family/);
 assert.match(src,/requestAnimationFrame\(\(\)=>requestAnimationFrame\(run\)\)/);
 assert.match(src,/new Worker\(new URL\('\.\/today-family-worker-v5775940259\.js',import\.meta\.url\),\{type:'module'\}\)/);
 assert.match(src,/core259FamilyCache\.clear\(\);core259FamilyKey=null;/);
 assert.match(src,/Heute: Geburtstage sofort/);
 assert.match(src,/Heute: Familienradar Worker fertig/);
 assert.match(config,/compass5940258CorePerformance\(\),compass5940259TodayDeferred\(\)\)/);
 assert.equal(compass5940259TodayDeferred().name,'compass-5940259-today-deferred');
});
