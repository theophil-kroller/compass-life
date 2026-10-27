import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {locationPicker43} from '../client/src/location-picker-v57759403.js';
import {compass59403LocationPickerCompactRelease} from '../client/compass59403-location-picker-compact-release.js';
const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');

test('Compact picker uses icon-first trigger and icon-only manual choices',()=>{
 const html=locationPicker43({locationContext39:{mode:'manual',manual:'home'}});
 assert.match(html,/<summary class="ctx43-pin"/);
 assert.match(html,/📍/);
 assert.match(html,/ctx43-current/);
 assert.doesNotMatch(html,/ctx43-pin-label/);
 for(const k of ['home','work','away','unknown']) assert.match(html,new RegExp(`class="ctx43-choice(?: is-active)?"[^>]+data-id="${k}"`));
 assert.match(html,/aria-label="Zuhause"/);
 assert.match(html,/aria-label="Arbeit"/);
 assert.match(html,/aria-label="Unterwegs"/);
 assert.match(html,/aria-label="Standort offen"/);
 assert.match(html,/ctx39-auto/);
 assert.match(html,/ctx39-check/);
 assert.match(html,/ctx40-toggle/);
});

test('Compact mobile CSS switches to a fixed bottom sheet to avoid clipping',()=>{
 const css=readFileSync(new URL('../client/src/location-picker-v57759403.css',import.meta.url),'utf8');
 assert.match(css,/@media\(max-width:700px\)\{\.ctx43-popover\{position:fixed;/);
 assert.match(css,/bottom:calc\(env\(safe-area-inset-bottom, 0px\) \+ 12px\)/);
 assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
});

test('Late plugin upgrades .40.2 to .40.3 and swaps in compact picker imports',()=>{
 assert.match(config,/compass59402LocationPickerRelease\(\)\);\s*compassConfig\.plugins\.push\(compass59403LocationPickerCompactRelease\(\)\)/);
 const plugin=compass59403LocationPickerCompactRelease();
 assert.equal(plugin.transform('whatever','/repo/client/src/other.js'),null);
 assert.throws(()=>plugin.transform('no version','/repo/client/src/main.js'),/badge/);
 const transformed=plugin.transform("Build 0.5.77.59.40.2\nconst COMPASS_CLIENT_VERSION='0.5.77.59.40.2';\nimport {locationPicker42} from './location-picker-v57759402.js';\nimport './location-picker-v57759402.css';\nconst x=locationPicker42(state);",'/repo/client/src/main.js').code;
 assert.match(transformed,/0\.5\.77\.59\.40\.3/);
 assert.match(transformed,/locationPicker43/);
 assert.match(transformed,/location-picker-v57759403\.js/);
});

test('Pipeline upgrades the actual main source to .40.3 and keeps one today picker hook',async()=>{
 const imports=new Map([...config.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...config.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 let code=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const name of names){
  const mod=await import(new URL('../client/'+imports.get(name),import.meta.url));
  const result=await mod[name]().transform(code,'/repo/client/src/main.js');
  if(result?.code)code=result.code;
 }
 assert.match(code,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.[34]'/);
 assert.match(code,/locationPicker43\(state\)/);
 assert.equal((code.match(/locationPicker43\(state\)/g)||[]).length,1);
 assert.equal((code.match(/locationPicker42\(state\)/g)||[]).length,0);
});
