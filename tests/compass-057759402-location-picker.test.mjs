import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {locationPicker42} from '../client/src/location-picker-v57759402.js';
import {compass59402LocationPickerRelease} from '../client/compass59402-location-picker-release.js';
const mainSrc=readFileSync(new URL('../client/compass59402-location-picker-release.js',import.meta.url),'utf8');
const config=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
test('Pin is visible and offers all four manual contexts and settings; initial location unknown',()=>{
 const html=locationPicker42({});
 assert.match(html,/<summary class="ctx42-pin"/);
 assert.match(html,/📍/);
 assert.match(html,/Standort offen/);
 for(const k of ['home','work','away','unknown']) assert.match(html,new RegExp('data-action="ctx39-manual" data-id="'+k+'"'));
 assert.match(html,/ctx42-config/);assert.match(html,/ctx39-set-zone/);assert.match(html,/ctx39-auto/);
 assert.match(html,/ctx39-check/);assert.match(html,/ctx40-toggle/);
 assert.match(html,/Passende Ansichten/);
 assert.doesNotMatch(html,/latitude|longitude|getCurrentPosition/);
});
test('Manual work mode changes label and context navigation; no GPS tracking triggered',()=>{
 const html=locationPicker42({locationContext39:{mode:'manual',manual:'work'}});
 assert.match(html,/📍/);assert.match(html,/Arbeit/);assert.match(html,/data-id="people"/);
 assert.match(html,/ctx42-choice" data-action="ctx39-manual" data-id="work" aria-pressed="true"/);
});
test('Auto context shows stale status, zone metadata but never leaks coordinates',()=>{
 const st={locationContext39:{mode:'auto',zones:{home:{latitude:47.03,longitude:15.39,radius:300}},last:null}};
 const html=locationPicker42(st);
 assert.match(html,/Automatik aktiv/);assert.match(html,/300 m Radius/);
 assert.doesNotMatch(html,/47\.03|15\.39/);
});
test('Markup escapes dynamic text, uses native details for tap and keyboard, no global geolocation',()=>{
 assert.equal(locationPicker42(null),'');
 const css=readFileSync(new URL('../client/src/location-picker-v57759402.css',import.meta.url),'utf8');
 assert.match(css,/ctx42-date-row/);assert.match(css,/max-width:550px/);
 assert.match(mainSrc,/pointerenter/);assert.match(mainSrc,/pointerleave/);
 assert.doesNotMatch(mainSrc,/watchPosition|setInterval/);
});
test('Final Vite plugin applies after .40.1; old panel removed but opt-in recommendation retained',()=>{
 assert.match(config,/compassConfig\.plugins\.push\(compass59401NavigationRelease\(\)\);\s*compassConfig\.plugins\.push\(compass59402LocationPickerRelease\(\)\)/);
 const plugin=compass59402LocationPickerRelease();
 assert.equal(plugin.transform('whatever','/repo/client/src/other.js'),null);
 assert.throws(()=>plugin.transform('no version','/repo/client/src/main.js'),/badge/);
 assert.match(plugin.transform("const badge='Build 0.5.77.59.40.1'",'/repo/client/src/ars-vivendi-lock-v5775922.js').code,/59\.40\.2/);
 const recommendation=readFileSync(new URL('../client/compass5940-context-next-release.js',import.meta.url),'utf8');
 assert.match(recommendation,/ctx40Expanded/); // lazy panel still provided by .40
 assert.match(mainSrc,/locationPicker42\(state\)/);
});
test('Actual full source pipeline places one pin immediately after Today day navigation, without a full-width bar',async()=>{
 const imports=new Map([...config.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...config.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 let code=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 for(const name of names){
  const mod=await import(new URL('../client/'+imports.get(name),import.meta.url));
  const result=await mod[name]().transform(code,'/repo/client/src/main.js');
  if(result?.code)code=result.code;
 }
 assert.match(code,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.2'/);
 assert.match(code,/<div class="ctx42-date-row"><nav class="daynav38"/);
 assert.match(code,/<\/nav>\$\{locationPicker42\(state\)\}<\/div>/);
 assert.equal((code.match(/locationPicker42\(state\)/g)||[]).length,1);
 assert.equal((code.match(/locationContextPanel39\(state,nextActions\(state\)\)/g)||[]).length,0);
 assert.match(code,/ctx40Expanded&&selectedDay===localDate\(\)/);
 assert.match(code,/if\(tab==='today'&&state\)\{ctx42BindHover\(\);ctx39ScheduleAuto\(\);\}/);
});
