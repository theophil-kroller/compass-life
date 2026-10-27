import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {familyDateRange38,familyPersonPanel,familyRules,familyTodayPanel} from '../client/src/family-radar-v5775931.js';
import {familyStudySlots37,mergeFamilyRadar37,familyForecastEntries37,familyForecastPanel37} from '../client/src/family-planning-v5775937.js';
import {radarMovement38,balanceModel38,balancePerspective38} from '../client/src/life-balance-perspectives-v5775938.js';
const root=resolve(new URL('..',import.meta.url).pathname);
const child={id:'n',name:'Nathanael Kroller',relationKind:'family',tag:'nathanael'};
const ev=(id,title,day,end)=>({id,summary:title,start:{date:day},end:{date:end},status:'confirmed'});
const today='2026-10-26',now=new Date('2026-10-26T09:00:00');
const cover={start:'2026-10-01',end:'2026-12-01',complete:true};
const fresh=now.getTime()-90000;
test('all-day holidays display the entire range, excluding the final Google end date',()=>{
 const holiday=ev('h','Nathanael: Herbstferien','2026-10-26','2026-11-03');
 assert.deepEqual(familyDateRange38(holiday),{start:'2026-10-26',end:'2026-11-02'});
 const single=ev('s','Nathanael: Feiertag','2026-10-26','2026-10-27');
 assert.deepEqual(familyDateRange38(single),{start:'2026-10-26',end:'2026-10-26'});
 const panel=familyPersonPanel([{id:'h',day:'2026-10-26',title:'Herbstferien',kind:'holiday',linkedReminders:[],event:holiday}],[],child);
 assert.match(panel,/26\. Okt/);assert.match(panel,/2\. Nov/);assert.match(panel,/Herbstferien/);
});
test('Nathanael gets evening 45-minute study after 45-minute football and transition',()=>{
 const entry=familyForecastEntries37([ev('e','Nathanael: Englisch-Schularbeit','2026-11-04','2026-11-05')],{n:child},{},{today})[0];
 const m=familyStudySlots37([],entry,cover,fresh,{now,today});
 assert.equal(m.status,'ready');assert.ok(m.slots.length);
 assert.ok(m.slots.every(s=>s.at>='20:00'&&s.until<='21:30'&&s.minutes===45&&s.attendanceUnverified===true));
});
test('an evening meeting blocks the learning slot and personal weekday rules filter candidates',()=>{
 const entry={id:'e',kind:'exam',day:'2026-11-04',title:'Englisch',personId:'n',personName:'Nathanael Kroller'};
 const rule={availability:{n:{weekdays:[3],arrivalHour:19,footballMinutes:45}}};
 const m=familyStudySlots37([ {id:'blocked',summary:'Besprechung',start:{dateTime:'2026-10-29T20:00:00'},end:{dateTime:'2026-10-29T21:00:00'}} ],entry,cover,fresh,{now,today,familyRadar:rule});
 assert.ok(m.slots.every(s=>new Date(s.day+'T12:00:00').getDay()===3));
 assert.ok(m.slots.every(s=>s.day!=='2026-10-29'));
});
test('stale calendar never asserts an evening is free',()=>{
 const entry={id:'e',kind:'exam',day:'2026-11-04',personId:'n',personName:'Nathanael'};
 const m=familyStudySlots37([],entry,cover,fresh-3*3600000,{now,today});assert.equal(m.status,'stale');assert.deepEqual(m.slots,[]);
});
test('family availability preferences merge across encrypted device snapshots by version',()=>{
 const a={availability:{n:{arrivalHour:19,footballMinutes:45,weekdays:[],updatedAt:'2026-10-26T11:00:00Z'}}};
 const b={availability:{n:{arrivalHour:20,footballMinutes:60,weekdays:[1],updatedAt:'2026-10-26T12:00:00Z'}}};
 assert.deepEqual(mergeFamilyRadar37(a,b),mergeFamilyRadar37(b,a));
 assert.equal(mergeFamilyRadar37(a,b).availability.n.arrivalHour,20);
});
test('globe and calendar are adjacent independent controls, with accessible hover hints',()=>{
 const html=familyTodayPanel([],[{id:'a',personId:'n',personName:'Nathanael',title:'Test',daysLeft:3,action:null}]);
 assert.match(html,/class="fr371-orb-link"[\s\S]*class="fr371-plan"/);
 assert.match(html,/title="Family Radar und Termine öffnen"/);
 assert.match(html,/title="In Kalender &amp; Forecast planen"/);
});
test('movement minutes take priority over steps and Garmin minutes are not added to Health Connect',()=>{
 const state={healthImports:{garminFitness:[{day:today,steps:9000}],garminSessions:[{day:today,sport:2,durationMinutes:150,title:'Cycling'},{day:today,sport:19,durationMinutes:50,title:'Strength Training'}]}};
 const hc=[{day:'2026-10-24',exerciseMinutes:30},{day:'2026-10-25',exerciseMinutes:35},{day:'2026-10-26',exerciseMinutes:40}];
 const model=radarMovement38(state,hc,today,7);
 assert.equal(model.source,'Health Connect');assert.match(model.movement.detail,/105 dokumentierte/);assert.equal(model.strength.observed,1);
 const all=balanceModel38(state,{today,period:7,healthDays:hc,choice:'all'});
 assert.equal(all.axes.find(x=>x.key==='movement38')?.label,'Bewegungszeit');
});
test('Garmin cycling sessions count without steps and coach strength is counted once per day',()=>{
 const state={healthImports:{garminSessions:[{day:today,sport:2,durationMinutes:60,title:'Cycling'},{day:today,sport:19,durationMinutes:40,title:'Krafttraining'}]},strengthGuidedSessions:[{startedAt:today+'T17:00:00Z',completed:true,exercises:[{confirmedSets:[{confirmed:true,reps:10}]}]}]};
 const m=radarMovement38(state,[],today,7);
 assert.equal(m.source,'Garmin-Sessions');assert.match(m.movement.detail,/100 dokumentierte/);assert.equal(m.strength.observed,1);
 const health=balanceModel38(state,{today,period:7,healthDays:[],choice:'health'});
 assert.equal(health.axes.length,8);assert.ok(health.axes.some(x=>x.key==='strength38'));
 const html=balancePerspective38(state,{today,period:7,choice:'health',healthDays:[]});
 assert.match(html,/Gesundheit/);assert.match(html,/Krafttraining/);assert.match(html,/balance38-select/);
});
test('three radar perspectives preserve old full radar and unknown emotional scores',()=>{
 const data={};for(const choice of ['all','health','life']){const m=balanceModel38(data,{today,period:7,healthDays:[],choice});assert.equal(m.axes.length,8);}
 assert.equal(balanceModel38({},{today,period:7,choice:'life'}).axes.find(x=>x.key==='feelings38').score,null);
});
test('new release transforms the real complete Vite chain, retains old shortcuts and navigates dates',async()=>{
 const cfg=readFileSync(resolve(root,'client/vite.config.js'),'utf8');
 const files=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(m=>[m[1],m[2]]));
 const names=[...cfg.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(m=>m[1]);
 assert.equal(names.at(-1),'compass594011FoodsRelease');
 let main=readFileSync(resolve(root,'client/src/main.js'),'utf8');
 let lock=readFileSync(resolve(root,'client/src/ars-vivendi-lock-v5775922.js'),'utf8');
 for(const name of names){const api=await import(pathToFileURL(resolve(root,'client',files.get(name))).href);const plugin=api[name]();
  for(const [where,source] of [['main',main],['lock',lock]]){const changed=plugin.transform(source,resolve(root,'client/src',where==='main'?'main.js':'ars-vivendi-lock-v5775922.js'));if(changed){if(where==='main')main=changed.code;else lock=changed.code;}}
 }
 for(const x of ['daynav38','balancePerspective38','fr371-plan','fr38-routine-save',"COMPASS_CLIENT_VERSION='0.5.77.59.40.11'"])assert.ok(main.includes(x),x);
 assert.match(lock,/Build 0\.5\.77\.59\.40/);
 execFileSync(process.execPath,['--input-type=module','--check'],{input:main});
});
