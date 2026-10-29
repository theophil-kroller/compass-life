import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {todayBirthdayHighlights,todayBirthdayPanel} from '../client/src/today-birthdays-v5775940255.js';
import {familySuggestions} from '../client/src/family-radar-v5775931.js';
const d='2026-10-29';
const birthday=(id,name,date='2026-10-29')=>({id,summary:name+' Geburtstag',eventType:'birthday',start:{date},status:'confirmed'});
test('All birthdays, not only family: unlocked People + Calendar appear on Today and upcoming days',()=>{
 const people={a:{id:'a',name:'Mutter',relationKind:'family',birthdayMonthDay:'10-29'},b:{id:'b',name:'Kollegin',relationKind:'colleague',birthdayMonthDay:'10-29'},c:{id:'c',name:'Freundin',relationKind:'friend',birthdayMonthDay:'10-30'}};
 const items=todayBirthdayHighlights([birthday('g1','Andreas'),birthday('g2','Mutter')],()=>({}),people,d);
 assert.equal(items.filter(x=>x.days===0).length,3); // mother once, colleague and Andreas
 assert.equal(items.filter(x=>x.days===1).length,1);
 const panel=todayBirthdayPanel(items);
 assert.match(panel,/🎂 Geburtstag/);assert.match(panel,/Heute:/);
 assert.match(panel,/Mutter/);assert.match(panel,/Kollegin/);assert.match(panel,/Andreas/);
 assert.match(panel,/Weitere Geburtstage/);
 assert.match(panel,/data-action="fr31-person"/);
 assert.match(panel,/data-action="agenda-open" data-id="g1"/);
 assert.doesNotMatch(panel,/data-id="birthday:g1:/);
});
test('Hidden, canceled and off-window birthday events omitted; non-family opt-out does not hide valid birthdays',()=>{
 const events=[birthday('hide','Test'),{...birthday('gone','Gone'),status:'cancelled'},birthday('far','Far','2026-11-20')];
 const result=todayBirthdayHighlights(events,e=>({hidden:e.id==='hide'}),{},d);
 assert.equal(result.length,0);
 const people={x:{id:'x',name:'Arbeitspartner',relationKind:'colleague',birthdayMonthDay:'10-31'}};
 assert.equal(todayBirthdayHighlights([],()=>({}),people,d).length,1);
});
test('Today birthdays remain visible even with many upcoming; HTML escape protects contact names',()=>{
 const people=Object.fromEntries(Array.from({length:9},(_,i)=>['c'+i,{id:'c'+i,name:i===0?'<img src=x onerror=alert(1)>':'Person '+i,birthdayMonthDay:'10-29'}]));
 const html=todayBirthdayPanel(todayBirthdayHighlights([],()=>({}),people,d));
 assert.equal((html.match(/class="bday255-name"/g)||[]).length,9);
 assert.ok(html.includes('&lt;img'));
 assert.ok(!html.includes('<img'));
});
test('Feb 29 birthday has established Feb 28 observation in non-leap years',()=>{
 const items=todayBirthdayHighlights([],()=>({}),{p:{id:'p',name:'Feb',birthdayMonthDay:'02-29'}},'2027-02-28');
 assert.equal(items.length,1);assert.equal(items[0].days,0);
});
test('No unsolicited birthday task writes or calendar API fetch in display model',()=>{
 const s={people:{p:{id:'p',name:'Kollege',birthdayMonthDay:'10-29'}},tasks:{},projects:{}};
 const before=JSON.stringify(s);todayBirthdayPanel(todayBirthdayHighlights([],()=>({}),s.people,d));
 assert.equal(JSON.stringify(s),before);
});
test('Family radar keeps existing task/project guards with large task list',()=>{
 const e=[{id:'t1',summary:'Nathanael: Mathematik-Schularbeit',start:{date:'2026-11-05'}}];
 const p={id:'p',name:'Nathanael'};
 const s={tasks:{},projects:{}};
 const proposal=familySuggestions(e,{p},s,{today:d})[0];
 assert.ok(proposal);
 for(let i=0;i<3000;i++)s.tasks['x'+i]={id:'x'+i,workflow:'next',archived:false};
 s.projects.done={familyRadarKey:proposal.key,archived:false};
 assert.equal(familySuggestions(e,{p},s,{today:d}).length,0);
});
test('Release chain injects birthday view and performance phase measurement after full guarded transforms',async()=>{
 const root=join(dirname(fileURLToPath(import.meta.url)),'..');
 const cfg=readFileSync(join(root,'client/vite.config.js'),'utf8');
 const imports=new Map([...cfg.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.*?)'/g)].map(m=>[m[1],m[2]]));
 const calls=[...cfg.matchAll(/\b(\w+)\(\)/g)].map(x=>x[1]).filter(x=>imports.has(x));
 let s=readFileSync(join(root,'client/src/main.js'),'utf8');
 for(const f of calls){const m=await import(pathToFileURL(join(root,'client',imports.get(f))).href);const result=await m[f]().transform(s,join(root,'client/src/main.js'));if(result?.code)s=result.code;}
 assert.match(s,/0\.5\.77\.59\.40\.25\.6/);
 assert.match(s,/todayBirthdayPanel\(birthdays\)\+familyTodayPanel/);
 assert.match(s,/performanceTrace\.end\('Ansicht berechnen'/);
 assert.match(s,/performanceTrace\.end\('DOM \+ Events'/);
 assert.match(cfg,/maximumFileSizeToCacheInBytes:\s*4\s*\*\s*1024\s*\*\s*1024/);
});
