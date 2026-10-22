import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const today=src.slice(src.indexOf('function todayWork('),src.indexOf('function radarScreen('));

test('Heute displays either one task inspector or the smart panel, never stacked',()=>{
 assert.match(today,/todayInspectorOpen&&state\?\.tasks\?\.\[selectedTaskId\]/);
 assert.match(today,/today-focus-inspector/);
 assert.match(today,/\$\{taskEditor\(\)\}<\/section>`:todaySmartPanel\(\)/);
 assert.doesNotMatch(today,/class="work-card person-preview"/);
 assert.doesNotMatch(today,/class="overview-nudge"/);
});

test('the task inspector has a clearly labeled close action',()=>{
 assert.match(today,/data-action="today-inspector-close"/);
 assert.match(today,/aria-label="Inspector schließen – Was passt jetzt\? anzeigen"/);
 assert.match(src,/if\(action==='today-inspector-close'\)\{todayInspectorOpen=false;selectedTaskId=null;render\(\);return;\}/);
});

test('selecting a task while in Today opens the inspector without changing tabs',()=>{
 assert.match(src,/if\(action==='task-select'\).*?selectedTaskId=id;if\(tab==='today'\)todayInspectorOpen=true;render\(\)/);
 assert.match(src,/window\.matchMedia\?\.\('\(max-width:800px\)'\)/);
});

test('navigating back to Today or switching day resets the inspector view',()=>{
 assert.match(src,/if\(target==='today'\)todayInspectorOpen=false;tab=target/);
 assert.match(src,/if\(action==='select-day'\).*?todayInspectorOpen=false;/);
 assert.match(src,/if\(action==='reset-today'\).*?todayInspectorOpen=false;/);
});
