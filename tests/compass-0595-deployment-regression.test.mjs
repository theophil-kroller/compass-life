import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('.59.5 leaves the historical .50-.58 transformer chain continuous and final',()=>{
 const config=read('client/vite.config.js');
 assert.match(config,/compass749Bridge\(\), compass7593UxBridge\(\), VitePWA\(/);
 assert.match(config,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(config,/VitePWA\([\s\S]*?\),\s*\/\/ Guarded 0\.5\.77\.50/);
 assert.equal((config.match(/compass7593UxBridge\(\)/g)||[]).length,1);
});

test('Nutrition is independently importable by Node tests and its SVG CSS loads from HTML',()=>{
 const source=read('client/src/nutrition-timing-v57725.js');
 const index=read('client/index.html');
 const css=read('client/src/nutrition-cup-plate-v577593.css');
 assert.doesNotMatch(source,/import ["']\.\/.*\.css["']/);
 assert.match(index,/href="\/src\/nutrition-cup-plate-v577593\.css"/);
 assert.match(source,/ni725-energy-symbol/);
 assert.match(css,/\.ni725-dots \.ni725-energy-symbol/);
 assert.match(index,/insights-streamline-v577591\.css/);
});
