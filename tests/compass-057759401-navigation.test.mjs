import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compass59401NavigationRelease} from '../client/compass59401-navigation-release.js';

const plugin=compass59401NavigationRelease();
test('Only app entrypoints are transformed; old or partial source fails closed',()=>{
 assert.equal(plugin.transform('bad','/repo/client/src/other.js'),null);
 assert.throws(()=>plugin.transform('bad','/repo/client/src/main.js'),/badge/);
 const lock=plugin.transform('Build 0.5.77.59.40','/repo/client/src/ars-vivendi-lock-v5775922.js').code;
 assert.equal(lock,'Build 0.5.77.59.40.1');
});
test('Fixed date column and phone stacking prevent ranges crossing titles',()=>{
 const css=readFileSync(new URL('../client/src/compass59401-navigation-fixes.css',import.meta.url),'utf8');
 assert.match(css,/minmax\(136px,150px\)/);
 assert.match(css,/column-gap:18px/);
 assert.match(css,/max-width:620px/);
 assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
});
test('Inspector is opt-in, closable and forecast uses two columns by default',()=>{
 const css=readFileSync(new URL('../client/src/compass59401-navigation-fixes.css',import.meta.url),'utf8');
 assert.match(css,/forecast-inspector-closed .forecast-inspector\{display:none/);
 assert.match(css,/forecast-inspector-closed\{grid-template-columns:195px minmax\(0,1fr\)/);
 const bridge=readFileSync(new URL('../client/compass59401-navigation-release.js',import.meta.url),'utf8');
 assert.match(bridge,/forecastInspectorOpen401=true/);
 assert.match(bridge,/forecast-inspector-close/);
});
test('Ordinary People entry starts with work colleagues in work context; 🔮 targets a single family person',()=>{
 const bridge=readFileSync(new URL('../client/compass59401-navigation-release.js',import.meta.url),'utf8');
 assert.match(bridge,/familyRadarJumpPersonId401=id/);
 assert.match(bridge,/familySelected\.id===familyRadarJumpPersonId401/);
 assert.match(bridge,/effectiveContext39\(state\)\.kind==='work'/);
 assert.match(bridge,/peopleScope='work'\?'work'|'work'\?'work'/); // encoded ternary preserves work option
 assert.match(bridge,/familyRadarJumpPersonId401=null/);
});
