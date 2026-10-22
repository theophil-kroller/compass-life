import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const fix=css.slice(css.lastIndexOf('/* Compass 0.5.70.8'));

test('date picker and shortcut buttons share only two inspector columns on desktop',()=>{
 assert.match(fix,/\.v559-inspector-form \.v559-date-row\s*\{\s*grid-template-columns:\s*minmax\(0,\s*58px\)\s+minmax\(0,\s*1fr\)/);
 assert.match(fix,/\.v559-inspector-form \.v559-date-tools\s*\{[^}]*grid-column:\s*2\s*;/s);
 assert.match(fix,/\.v559-inspector-form \.v559-date-tools\s*\{[^}]*flex-wrap:\s*wrap\s*;/s);
});

test('date input and inspector content cannot force horizontal overflow',()=>{
 assert.match(fix,/\.v559-inspector-form \.v559-date-row input\[type="date"\]\s*\{[^}]*min-width:\s*0/s);
 assert.match(fix,/\.today-focus-inspector \.v559-inspector-form[^{}]*\{\s*min-width:\s*0;/s);
 assert.match(fix,/\.today-focus-inspector \.v559-compact-field input[^{}]*\{[^}]*width:\s*100%/s);
});

test('task date editing stays functional',()=>{
 assert.match(main,/function compactInspectorDate/);
 assert.match(main,/data-action="date-adjust"/);
 assert.match(main,/data-action="date-clear"/);
 assert.match(main,/const COMPASS_CLIENT_VERSION='0\.5\.\d+(?:\.\d+)?'/);
});
