import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {familyForecastEntries37,familyStudySlots37,familyCreateStudy37,mergeFamilyRadar37,familyForecastPanel37} from '../client/src/family-planning-v5775937.js';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';
import {compass5937FamilyPlanningRelease} from '../client/compass5937-family-planning-release.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const child={id:'n',name:'Nathanael Kroller',relationKind:'family',tag:'nathanael'};
const adult={id:'b',name:'Bettina Klampfer',relationKind:'friend'};
const today='2026-10-26',now=new Date('2026-10-26T09:00:00');
const entry=(id,title,date,extra={})=>({id,summary:title,start:{date},end:{date:date==='2026-11-04'?'2026-11-05':date},status:'confirmed',...extra});
const rows=[entry('math','Nathanael: Mathematik-Schularbeit','2026-11-04'),entry('adult','Bettina Klampfer: Mathematik-Schularbeit','2026-11-03'),entry('english','Nathanael: Englisch-Schularbeit','2026-11-05')];
const coverage={start:'2026-10-01',end:'2026-12-01',complete:true};
const recent=now.getTime()-90000;

test('Family Forecast shows the real child but not an adult friend, without ever creating tasks',()=>{
 const state={tasks:{},projects:{}};const list=familyForecastEntries37(rows,{n:child,b:adult},state,{today});
 assert.deepEqual(list.map(x=>x.id),['math','english']);
 assert.equal(Object.keys(state.tasks).length,0);
 const markup=familyForecastPanel37(list,rows,state,{coverage,updatedAt:recent,now,today});
 assert.match(markup,/Nathanael Kroller/);assert.doesNotMatch(markup,/Bettina/);
});
test('Calendar coverage must be complete and within two hours to assert study-slot availability',()=>{
 const ex=familyForecastEntries37(rows,{n:child},{},{today})[0];
 assert.equal(familyStudySlots37(rows,ex,{...coverage,complete:false},recent,{now,today}).status,'disconnected');
 assert.equal(familyStudySlots37(rows,ex,coverage,recent-3*3600000,{now,today}).status,'stale');
 assert.equal(familyStudySlots37(rows,ex,coverage,recent,{now,today}).status,'ready');
});
test('All-day blocked day is not falsely reported as free, and no exam-day study slot is proposed',()=>{
 const ex=familyForecastEntries37(rows,{n:child},{},{today})[0];
 const full=entry('blocked','Family event','2026-10-27',{end:{date:'2026-10-28'}});
 const s=familyStudySlots37([...rows,full],ex,coverage,recent,{now,today});
 assert.ok(s.slots.length);
 assert.ok(s.slots.every(x=>x.day!=='2026-10-27'&&x.day<'2026-11-04'&&x.minutes===45));
});
test('Opt-in creates exactly one private 45 minute task and repeated clicks cannot duplicate it',()=>{
 const state={people:{n:child},tasks:{},projects:{}};
 const ex=familyForecastEntries37(rows,{n:child},state,{today})[0];
 const slot=familyStudySlots37(rows,ex,coverage,recent,{now,today}).slots[0];
 let i=0;const uuid=()=>`00000000-0000-4000-8000-${String(++i).padStart(12,'0')}`;
 assert.equal(Object.keys(state.tasks).length,0);
 const a=familyCreateStudy37(state,ex,child,slot,{today,uuid});
 assert.equal(a.created?.plannedDate,slot.day);assert.equal(a.created?.estimateMinutes,45);assert.equal(a.created?.dueDate,null);
 assert.equal(state.taskPending[a.created.id],true);
 const b=familyCreateStudy37(state,ex,child,slot,{today,uuid});
 assert.equal(b.reason,'existing');assert.equal(Object.keys(state.tasks).length,1);
 const wrong=familyCreateStudy37(state,ex,adult,slot,{today,uuid});
 assert.equal(wrong.reason,'invalid');
});
test('Device mirror merges family rules and decisions by timestamps (not by local vs remote direction)',()=>{
 const local={rules:{n:{role:'child',mathSupport:true,updatedAt:'2026-10-26T10:00:00Z'}},decisions:{'n::math::learning':{status:'snoozed',updatedAt:'2026-10-26T08:00:00Z'}}};
 const remote={rules:{n:{role:'child',mathSupport:false,updatedAt:'2026-10-26T11:00:00Z'}},decisions:{'n::math::learning':{status:'dismissed',updatedAt:'2026-10-26T12:00:00Z'}}};
 const x=mergeFamilyRadar37(local,remote),y=mergeFamilyRadar37(remote,local);
 assert.deepEqual(x,y);assert.equal(x.rules.n.mathSupport,false);assert.equal(x.decisions['n::math::learning'].status,'dismissed');
 assert.equal(mergeJournalData({familyRadar:local},{familyRadar:remote}).familyRadar.decisions['n::math::learning'].status,'dismissed');
});
test('A Family Radar opt-out remains effective after device sync, including legacy mixed statuses',()=>{
 const local={rules:{b:{role:'off',enabled:false,updatedAt:'2026-10-26T12:00:00Z'}}};
 const remote={rules:{b:{role:'child',enabled:true,updatedAt:'2026-10-26T10:00:00Z'}}};
 const merged=mergeFamilyRadar37(local,remote);assert.equal(merged.rules.b.role,'off');
 assert.ok(familyForecastEntries37(rows,{b:adult},{familyRadar:merged},{today}).every(e=>e.personName!=='Bettina Klampfer'&&e.personId==null));
});
test('Without a synced Nathanael profile only a read-only school notice appears, never a booking button',()=>{
 const state={people:{b:adult}};
 const entries=familyForecastEntries37(rows,state.people,state,{today});
 assert.ok(entries.some(e=>e.personName==='Nathanael'&&e.personId===null));
 assert.ok(entries.every(e=>e.personName!=='Bettina Klampfer'));
 const ui=familyForecastPanel37(entries,rows,state,{coverage,updatedAt:recent,now,today});
 assert.doesNotMatch(ui,/fr37-open/);
});

test('Release plugin upgrades both badges, refuses missing anchors and injects actions only in main',()=>{
 const plugin=compass5937FamilyPlanningRelease();
 const main="const COMPASS_CLIENT_VERSION='0.5.77.59.36'; const badge='Build 0.5.77.59.36';\nimport {deadlineIntelligence} from './d.js';\nfunction chrome(content){return content;}\nasync function runAction(action,id,stepId=null,plannerDay=null) {return null;}";
 const r=plugin.transform(main,'/repo/client/src/main.js').code;
 assert.match(r,/COMPASS_CLIENT_VERSION='0.5.77.59.37'/);
 assert.match(r,/familyForecastPanel37/);assert.match(r,/familyCreateStudy37/);
 assert.match(plugin.transform("const lock='Build 0.5.77.59.36'",'/repo/client/src/ars-vivendi-lock-v5775922.js').code,/Build 0\.5\.77\.59\.37/);
 assert.throws(()=>plugin.transform('no badge','/repo/client/src/main.js'),/anchor/);
});
test('The full Vite chain retains its history and registers the new plugin after .36',()=>{
 const src=readFileSync(resolve(root,'client/vite.config.js'),'utf8');
 assert.match(src,/compassConfig\.plugins\.push\(compass5936CalendarAccessRelease\(\)\);\s*compassConfig\.plugins\.push\(compass5937FamilyPlanningRelease\(\)\)/);
 const main=readFileSync(resolve(root,'client/src/main.js'),'utf8');
 assert.match(main,/familyRadar:st\.familyRadar/);assert.match(main,/if\(m\.familyRadar\)st\.familyRadar=m\.familyRadar/);
});

test('Every registered historic and current plugin transforms the actual main source in order, and JavaScript parses',async()=>{
 const config=readFileSync(resolve(root,'client/vite.config.js'),'utf8');
 const importMap=new Map([...config.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...config.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 let main=readFileSync(resolve(root,'client/src/main.js'),'utf8');
 let lock=readFileSync(resolve(root,'client/src/ars-vivendi-lock-v5775922.js'),'utf8');
 for(const name of names){
  const file=importMap.get(name);assert.ok(file,`Missing import for ${name}`);
  const mod=await import(new URL('../client/'+file,import.meta.url).href);
  const plugin=mod[name]();assert.equal(typeof plugin.transform,'function');
  for(const [which,source,path] of [['main',main,'/repo/client/src/main.js'],['lock',lock,'/repo/client/src/ars-vivendi-lock-v5775922.js']]){
   const changed=await plugin.transform(source,path);
   if(changed){if(which==='main')main=changed.code;else lock=changed.code;}
  }
 }
 assert.ok(names.length>=43,`The historic plugin list changed unexpectedly: ${names.length}`);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.1'/);
 assert.match(main,/familyForecastPanel37\(/);
 assert.match(main,/familyCreateStudy37\(/);
 assert.match(lock,/Build 0\.5\.77\.59\.40/);
 execFileSync(process.execPath,['--input-type=module','--check'],{input:main,stdio:['pipe','pipe','pipe']});
});
