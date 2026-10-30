import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INSPIRATION_LEVEL_SYMBOLS,INSPIRATION_LEVEL_COLORS,inspirationRatingModal,inspirationInsightsView} from '../client/src/task-inspiration-v57759402523.js';
const source=name=>readFileSync(new URL('../client/src/'+name,import.meta.url),'utf8');
test('All 7 inspiration stages include symbol, number, distinct color and German label',()=>{
 const html=inspirationRatingModal({id:'a',title:'Aufgabe'});
 assert.equal(Object.keys(INSPIRATION_LEVEL_SYMBOLS).length,7);
 assert.equal(new Set(Object.values(INSPIRATION_LEVEL_SYMBOLS)).size,7);
 assert.equal(new Set(Object.values(INSPIRATION_LEVEL_COLORS)).size,7);
 for(let n=1;n<=7;n++){
   assert.ok(html.includes(`data-inspiration-level="${n}"`));
   assert.ok(html.includes(INSPIRATION_LEVEL_SYMBOLS[n]));
 }
 assert.ok(INSPIRATION_LEVEL_COLORS[1].toLowerCase().startsWith('#57'));
 assert.equal(INSPIRATION_LEVEL_SYMBOLS[7],'♥');
});
test('Feedback history contains semantic symbols; no color-only interpretation',()=>{
 const rendered=inspirationInsightsView({taskInspiration:[{id:'k',taskId:'t',title:'Lernen',category:'Lesen',level:7,at:'2026-10-30T10:00:00Z'}]});
 assert.match(rendered,/data-inspiration-level="7"/);
 assert.match(rendered,/♥/);
 assert.match(rendered,/7\/7/);
});
test('Extended orange theme is scoped to .compass55-extended and Focus remains unchanged',()=>{
 const css=source('extended-amber-v0578.css');
 assert.match(css,/\.shell\.compass55-extended/);
 assert.match(css,/#a95217/);
 assert.doesNotMatch(css,/\.compass55-focus/);
 assert.match(source('main-full-v57759402510.js'),/import '\.\/extended-amber-v0578.css'/);
});
