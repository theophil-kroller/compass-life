import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compass5940253PwaDeployFix} from '../client/compass5940253-pwa-deploy-fix.js';
const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');

test('Workbox 4 MiB offline precache limit covers the 2.1 MB asset that failed GitHub #309',()=>{
 assert.match(cfg,/maximumFileSizeToCacheInBytes:\s*4\s*\*\s*1024\s*\*\s*1024/);
 const max=4*1024*1024;
 assert.ok(max>2098390);
 assert.match(cfg,/globPatterns:\s*\['\*\*\/\*\.\{js,css,html,svg,png,json,webmanifest\}'\]/);
 assert.match(cfg,/cleanupOutdatedCaches:\s*true/);
});
test('release 40.25.3 remains registered and bumps the app plus lock versions',()=>{
 assert.match(cfg,/compass5940252PersonalPatterns\(\),compass5940253PwaDeployFix\(\),compass5940254FinancePatternsPrint\(\),compass5940255BirthdaysSpeed\(\),compass5940256FastGtdActions\(\)\)/);
 const p=compass5940253PwaDeployFix();
 const base="const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.2';\nBuild 0.5.77.59.40.25.2";
 const main=p.transform(base,'/repo/client/src/main.js');
 assert.ok(main?.code.includes("const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.3'"));
 assert.ok(main?.code.includes('Build 0.5.77.59.40.25.3'));
 const lock=p.transform('Build 0.5.77.59.40.25.2','/repo/client/src/ars-vivendi-lock-v5775922.js');
 assert.equal(lock.code,'Build 0.5.77.59.40.25.3');
});
