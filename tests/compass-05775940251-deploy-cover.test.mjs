import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {annualDocument} from '../client/src/life-annual-v577594019.js';
import {compass5940251SolarCoverHotfix} from '../client/compass5940251-solar-cover-hotfix.js';

test('solar annual cover is warm amber/yellow, not dark green, print-color-safe',()=>{
 const html=annualDocument({},{now:'2026-10-28',period:'year'});
 const cover=html.match(/\.av19-cover\{[^}]+\}/)?.[0]||'';
 assert.match(cover,/#ffeab1/i);
 assert.match(cover,/#f6aa41/i);
 assert.match(cover,/print-color-adjust:exact/);
 assert.doesNotMatch(cover,/#0c2d25/i);
 assert.match(html,/PRIVATE ARCHIVE/);
 assert.match(html,/PERSONAL CHRONICLE/);
 assert.doesNotMatch(html,/A Life Examined\. A Life Beautifully Lived\./);
});
test('minor version 40.25.1 is guarded and registered after 40.25',()=>{
 const plug=compass5940251SolarCoverHotfix();
 const r=plug.transform("const COMPASS_CLIENT_VERSION='0.5.77.59.40.25';\nBuild 0.5.77.59.40.25",'/site/client/src/main.js');
 assert.match(r.code,/40\.25\.1/);
 assert.equal(plug.transform('', '/site/client/src/unrelated.js'),null);
 assert.match(readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8'),/compass594025EditorialAnnual\(\),compass5940251SolarCoverHotfix\(\)/);
});
