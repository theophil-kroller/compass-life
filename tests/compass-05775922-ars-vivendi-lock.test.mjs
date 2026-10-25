import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const index=read('client/index.html');
const js=read('client/src/ars-vivendi-lock-v5775922.js');
const css=read('client/src/ars-vivendi-lock-v5775922.css');
const asset=new URL('../client/public/ars-vivendi-lock-v5775922.png',import.meta.url);

test('new cover is additive; original Compass entry point and historic styles remain intact',()=>{
 assert.match(index,/<script type="module" src="\/src\/main\.js"><\/script>/);
 assert.match(index,/<script type="module" src="\/src\/ars-vivendi-lock-v5775922\.js"><\/script>/);
 for(const file of ['insights-streamline-v577591.css','gtd-workspace-premium-v577599.css','compact-plan-v5775910.css'])assert.ok(index.includes(file));
 assert.ok(index.indexOf('/src/main.js')<index.indexOf('/src/ars-vivendi-lock-v5775922.js'));
});
test('visual gate reuses original encrypted vault form and cannot unlock by clicking illustration alone',()=>{
 assert.match(js,/form#vault-form/);
 assert.match(js,/\.replaceChildren\(form\)/);
 assert.match(js,/trigger\.addEventListener\('click',displayForm\)/);
 assert.match(js,/app\.querySelector\('\[data-action="lock"\]'\)/);
 assert.match(js,/app\.inert=true/);
 assert.doesNotMatch(js,/vault\.unlock\(|vault\.create\(|localStorage\.setItem|sessionStorage\.setItem/);
 assert.doesNotMatch(js,/fetch\(|createOscillator|AudioContext/);
});
test('app rendering, including repeat lock, re-evaluates original unlock form',()=>{
 assert.match(js,/MutationObserver\(sync\)/);
 assert.match(js,/observer\.observe\(app,\{childList:true\}\)/);
 assert.match(js,/if\(!form\)/);
 assert.match(js,/remove\(\)/);
 assert.match(js,/app\.inert=appPreviousInert/);
});
test('visual sheet supports first-use Vault setup without bypassing security',()=>{
 assert.match(js,/passphrase-repeat/);
 assert.match(js,/Lokalen Tresor einrichten/);
 assert.match(js,/role="dialog" aria-modal="true"/);
 assert.match(js,/Escape/);
 assert.match(js,/focus\(\{preventScroll:true\}\)/);
});
test('responsive, no-scroll image screen and accessible user-controlled unlock',()=>{
 assert.match(css,/overflow:hidden/);
 assert.match(css,/@media\(max-width:719px\)/);
 assert.match(css,/100dvh/);
 assert.match(css,/focus-visible/);
 assert.match(js,/aria-label="Compass Tresor entsperren"/);
});
test('artwork is valid and below default Workbox 2 MiB precache threshold',()=>{
 const bytes=readFileSync(asset);
 assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 assert.ok(bytes.length<2*1024*1024,`PNG ${bytes.length} exceeds default precache size`);
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 assert.ok(width>=750&&height>=1300);
});
