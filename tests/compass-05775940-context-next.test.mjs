import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {contextTagKind40,taskPlace40,recommendationPreferences40,feedback40,dismissTask40,recommendNext40,contextNextPanel40} from '../client/src/context-next-v5775940.js';
import {compass5940ContextNextRelease} from '../client/compass5940-context-next-release.js';
const today='2026-10-26';
const task=(id,title,more={})=>({id,title,workflow:'next',completed:false,archived:false,projectId:null,contextTags:[],estimateMinutes:30,...more});
const example=()=>({tasks:{a:task('a','Büroarbeit',{contextTags:['büro'],dueDate:'2026-10-27'}),b:task('b','Zuhause lernen',{contextTags:['zuhause'],flagged:true}),c:task('c','Telefonat',{contextTags:[],dueDate:'2026-10-26'}),d:task('d','Verschieben',{contextTags:[],deferUntil:'2026-11-01'}),e:task('e','Fertig',{completed:true}),f:task('f','Warte',{workflow:'waiting'}),g:task('g','Lange Aufgabe',{estimateMinutes:180}),h:task('h','Energie low',{contextTags:['energy-low']})},projects:{},uiPreferences:{dailyMinutes:60,dailyEnergy:'low'},locationContext39:{mode:'manual',manual:'home'}});
test('Unknown location gives only location-independent tasks, never guesses a home location',()=>{
 const state=example();state.locationContext39.manual='unknown';const out=recommendNext40(state,{day:today});
 assert.ok(out.items.every(x=>!taskPlace40(x.task).length));assert.ok(!out.items.some(x=>x.task.id==='a'||x.task.id==='b'));
 assert.equal(out.skippedPlace,2);assert.equal(out.kind,'unknown');
});
test('Home vs office tasks are never mistaken for each other and due dates explain rank',()=>{
 const st=example();const atHome=recommendNext40(st,{day:today,context:'home'});
 assert.ok(atHome.items.some(x=>x.task.id==='b'));assert.ok(!atHome.items.some(x=>x.task.id==='a'));
 const atWork=recommendNext40(st,{day:today,context:'work'});
 assert.ok(atWork.items.some(x=>x.task.id==='a'));assert.ok(!atWork.items.some(x=>x.task.id==='b'));
 assert.ok(atWork.items.some(x=>x.task.id==='c'&&x.reasons.join(' ').includes('Frist heute')));
 assert.ok(atWork.items.some(x=>x.task.id==='a'&&x.reasons.join(' ').includes('Passt zu Arbeit')));
});
test('Only available Next Actions, respect defer, hold, completion, time and user energy',()=>{
 const st=example();const res=recommendNext40(st,{day:today,context:'unknown',minutes:60,energy:'low'});
 assert.ok(!res.items.some(x=>['d','e','f','g'].includes(x.task.id)));
 assert.equal(res.skippedTime,1);assert.equal(res.items[0].task.id,'c');
 assert.ok(res.items.some(x=>x.task.id==='h'&&x.reasons.some(reason=>reason.includes('Energie'))));
 assert.deepEqual(recommendationPreferences40(st),{minutes:60,energy:'low'});
});
test('Feedback hides for seven days, local bounded storage and reset remain possible',()=>{
 const st=example();assert.equal(dismissTask40(st,'invalid',today),false);
 assert.equal(dismissTask40(st,'c',today),true);
 assert.equal(feedback40(st).c,'2026-11-02');
 assert.ok(!recommendNext40(st,{day:today,context:'home'}).items.some(x=>x.task.id==='c'));
 assert.ok(recommendNext40(st,{day:'2026-11-03',context:'home'}).items.some(x=>x.task.id==='c'));
 st.contextRecommendations40.dismissed={};assert.ok(recommendNext40(st,{day:today,context:'home'}).items.some(x=>x.task.id==='c'));
});
test('Tags are normalized only from task metadata, never task titles',()=>{
 assert.equal(contextTagKind40('@büro'),'work');assert.deepEqual(taskPlace40(task('1','Büro',{contextTags:[]})),[]);
 assert.deepEqual(taskPlace40(task('1','x',{contextTags:['zuhause','home','büro']})),['home','work']);
});
test('HTML escapes task titles and is small, clear, accessible, opt-in, no fake calendar slot',()=>{
 const st=example();st.tasks.c.title='<svg onload=alert(1)>';
 const html=contextNextPanel40(st,{day:today,context:'unknown'});
 assert.match(html,/Was passt jetzt/);assert.match(html,/data-action="ctx40-skip"/);assert.doesNotMatch(html,/data-action="ctx40-reset"/);
 st.contextRecommendations40={dismissed:{c:'2026-11-02'}};assert.match(contextNextPanel40(st,{day:today,context:'unknown'}),/data-action="ctx40-reset"/);
 assert.match(html,/Zeitbudget/);assert.doesNotMatch(html,/<svg onload/);assert.match(html,/&lt;svg/);
 assert.doesNotMatch(html,/getCurrentPosition\s*\(/);assert.match(html,/Freie Kalenderzeit ist damit nicht bestätigt/);
});
test('Main integration keeps recommendations lazy and version bump is guarded',()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compassConfig\.plugins\.push\(compass5939LocationContextRelease\(\)\);\s*compassConfig\.plugins\.push\(compass5940ContextNextRelease\(\)\);/);
 const plugin=compass5940ContextNextRelease();
 assert.equal(plugin.transform('nothing','/repo/client/src/not-main.js'),null);
 assert.throws(()=>plugin.transform('wrong','/repo/client/src/main.js'),/badge/);
 const lock=plugin.transform("const a='Build 0.5.77.59.39';",'/repo/client/src/ars-vivendi-lock-v5775922.js').code;
 assert.match(lock,/59\.40/);
 const old=readFileSync(new URL('../client/src/location-context-v5775939.js',import.meta.url),'utf8');
 assert.match(old,/data-action="ctx40-toggle"/);
 const newMod=readFileSync(new URL('../client/src/context-next-v5775940.js',import.meta.url),'utf8');
 assert.doesNotMatch(newMod,/navigator\.geolocation|watchPosition\s*\(|localStorage|fetch\s*\(/);
 const src=readFileSync(new URL('../client/compass5940-context-next-release.js',import.meta.url),'utf8');
 assert.match(src,/ctx40Expanded&&selectedDay===localDate\(\)/);
});
