import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import {compass5910StrengthHabitsBridge} from '../client/compass5910-strength-habits-bridge.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const p=compass5910StrengthHabitsBridge();
const nav=(id,label,icon)=>` \${navItem('${id}','${label}','${icon}')}`;
const navIds=[['overview','Übersicht','layers'],['next','Next Actions','target'],['projects','Projekte','folder'],['templates','Vorlagen','bookmark'],['shopping','Einkaufslisten','list'],['forecast','Kalender & Forecast','calendar'],['radar','Konferenzen','book'],['flagged','Flagged','flag'],['hold','On Hold','pause'],['someday','Dreams · Someday','spark']];
const plan=navIds.map(x=>nav(...x)).join('\n');
const mockMain=[plan,
`return '<button type="button" class="habit569-item '+(done?'is-done':'')+'" data-action="habit-toggle" data-id="'+h(item.id)+'" '+(lockedDone?'disabled':'')+'><span></span></button>';`,
`'<article class="habit569-card"><div class="habit569-card-head"><div><strong>'+h(item.title)+'`,
`data-action="habit-toggle" data-id="'+h(item.id)+'">'+(doneToday?'Heute erledigt ✓':'Heute abhaken')+'</button>`,
`if(action==='habit-toggle'){`].join('\n');
const mockEditor=[
` ['pallof-press','Pallof Press','Rumpf','core',['shoulders']],`,
`favorites=['hip-thrust'`,
`const reversed=[...sessions].reverse(),pending=`,
`${'${prompt}'}<details><summary>Trainingseinheit zum Bearbeiten auswählen`,
`<div class="str732-rows">`].join('\n');

test('All optional views keep existing Vite chain and use only dynamic imports',()=>{
 const cfg=read('client/vite.config.js');
 assert.match(cfg,/plugins: \[compass5910StrengthHabitsBridge\(\), nutrition3Bridge\(\)/);
 assert.match(cfg,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(cfg,/compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(read('client/src/makko-ho-guide-v5775910.js'),/export function openMakkoGuide/);
 assert.doesNotMatch(cfg,/makko-ho-guide-v5775910\.js/);
 assert.match(cfg,/globIgnores:/);
 assert.match(cfg,/compass-guides-on-demand-v1/);
 assert.match(cfg,/handler: 'CacheFirst'/);
 const index=read('client/index.html');
 assert.doesNotMatch(index,/makko-ho-guide-v5775910/);
 assert.doesNotMatch(index,/strength-coach-v5775910/);
});
test('Strength catalog adds Ab Wheel and optional gym/home V-Taper exercises',()=>{
 const transformed=p.transform(mockEditor,'/repo/client/src/strength-editor-v57732.js').code;
 for(const id of ['ab-wheel-kneeling','cable-straight-arm-pulldown','dumbbell-floor-press','cable-lateral-raise'])assert.ok(transformed.includes(id));
 assert.match(transformed,/StrongLifts A · 5×5/);
 assert.match(transformed,/strength-coach-open/);
 assert.match(transformed,/favorites=\['ab-wheel-kneeling'/);
});
test('Anatomy includes Ab Wheel and every new cable/home exercise',()=>{
 const src=` 'pallof-press':r(['obliques','rectus_abdominis'],['deltoid_front']),`;
 const transformed=p.transform(src,'/repo/client/src/strength-anatomy-v57737.js').code;
 for(const id of ['ab-wheel-kneeling','dumbbell-romanian-deadlift','cable-single-arm-row','cable-crunch'])assert.ok(transformed.includes(id));
 assert.match(transformed,/ab-wheel-kneeling':r\(\['rectus_abdominis','obliques'\]/);
});
test('Planning menu is shorter with recoverable secondary actions',()=>{
 const out=p.transform(mockMain,'/repo/client/src/main.js').code;
 assert.ok(out.indexOf("navItem('next'")<out.indexOf('plan610-more'));
 assert.ok(out.indexOf("navItem('projects'")<out.indexOf('plan610-more'));
 assert.ok(out.includes("navItem('forecast','Kalender & Forecast','calendar')"));
 assert.ok(out.includes("navItem('shopping','Einkaufslisten','list')"));
 assert.ok(out.includes('Weitere Planung'));
 assert.match(out,/makko-guide-start/);
 assert.match(out,/habitId|habitIsDone/);
 assert.match(out,/await import\('\.\/makko-ho-guide-v5775910\.js'\)/);
 assert.match(out,/await import\('\.\/strength-coach-v5775910\.js'\)/);
});
test('Fail closed for missing transformation anchors; never silently ship stale UI',()=>{
 assert.throws(()=>p.transform('broken','/repo/client/src/main.js'),/source anchor/);
 assert.equal(p.transform('anything','/repo/client/src/other.js'),null);
});
test('Makko guide has six named positions and a paused, adjustable timer',()=>{
 const src=read('client/src/makko-ho-guide-v5775910.js');
 for(const x of ['Lunge & Dickdarm','Magen & Milz','Herz & Dünndarm','Blase & Niere','Perikard & Dreifacherwärmer','Leber & Gallenblase'])assert.ok(src.includes(x));
 // v59.14 deliberately replaced the synthetic AudioContext gong with a licensed
 // acoustic recording. Do not require a removed oscillator in legacy tests.
 for(const x of ['duration=45','setInterval(tick,200)','visibilitychange','data-go="next"','onFinish','GONG_DEFAULT_URL','overtime'])assert.ok(src.includes(x),`missing: ${x}`);
 assert.match(src,/new Audio\(GONG_DEFAULT_URL\)/,'acoustic gong recording must be used');
 assert.match(src,/remaining===0&&!completed/,'gong should fire once when target time is reached');
 assert.doesNotMatch(src,/new\s+AudioContext\s*\(|createOscillator\s*\(/,'no synthesized beep or oscillator fallback');
});
test('Coach exposes goals, equipment filter, and no-data disclosure',()=>{
 let src=read('client/src/strength-coach-v5775910.js');
 src=src.replace(/^import .*;\s*$/gm,'').replace(/export (function|const) /g,'$1 ');
 const ids=['ab-wheel-kneeling','plank','dead-bug','dumbbell-floor-press','dumbbell-row','dumbbell-pullover','dumbbell-lateral-raise','goblet-squat','dumbbell-romanian-deadlift','dumbbell-shoulder-press','bench','squat','deadlift','lat-pulldown','cable-straight-arm-pulldown','cable-single-arm-row','cable-lateral-raise','cable-rear-delt-fly','face-pull','cable-crunch','cable-woodchop','barbell-row'];
 const ctx=createContext({EXERCISES:ids.map(id=>({id,name:id})),strengthPeriod:()=>({groups:[],events:[],knownSets:0,unassigned:0}),detailedMuscleData:()=>({regions:{}}),console});
 runInContext(src+'\nthis.check=proposeStrengthTraining;',ctx);
 const home=ctx.check({}, {goal:'abs',equipment:'home',today:'2026-10-25'});
 assert.equal(home.coverageKnown,false);assert.ok(home.selected.some(x=>x.id==='ab-wheel-kneeling'));assert.ok(home.selected.every(x=>x.place==='home'));
 const gym=ctx.check({}, {goal:'vtaper',equipment:'gym',today:'2026-10-25'});
 assert.ok(gym.selected.some(x=>['lat-pulldown','cable-straight-arm-pulldown','cable-lateral-raise'].includes(x.id)));
 assert.ok(gym.selected.every(x=>x.place==='gym'));
});
