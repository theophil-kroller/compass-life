import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compass5910StrengthHabitsBridge} from '../client/compass5910-strength-habits-bridge.js';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const src=()=>read('client/src/makko-ho-guide-v5775910.js');
test('Side stretch requires two manual holds before finishing',()=>{
 const s=src();
 assert.match(s,/if\(step===5&&side==='left'\)/);
 assert.match(s,/side='right';remaining=duration;overtime=0;completed=false;render\(\);return/);
 assert.match(s,/if\(step===5\)\{[\s\S]*?await onSession\(data\);await onFinish\(data\)/);
 assert.match(s,/1\/2 · Zur linken Seite neigen/);
 assert.match(s,/2\/2 · Zur rechten Seite neigen/);
});
test('No counted minutes while paused; partial sessions are recorded separately',()=>{
 const s=src();
 assert.match(s,/let activeSince=null,activeMs=0,stageHolds=\[\]/);
 assert.match(s,/activeMs\+=Math\.max\(0,performance\.now\(\)-activeSince\)/);
 assert.match(s,/const stop=\(\)=>\{stopActive\(\)/);
 assert.match(s,/sessionData\(false\)/);
 assert.match(s,/sessionData\(true\)/);
 assert.match(s,/if\(seconds>0\)stageHolds\.push/);
});
test('Gong and wake lock remain; music is still only loaded after Play',()=>{
 const s=src();
 assert.match(s,/navigator\.wakeLock\.request\('screen'\)/);
 assert.match(s,/completed=true;overtime=0;gong\(\);render\(\)/);
 const h=s.split("panel.querySelector('[data-go=\"start\"]').onclick=()=>{")[1];
 assert.ok(h);
 assert.match(h.slice(0,420),/void acquireWakeLock\(\)/);
 assert.match(h.slice(0,420),/if\(musicEnabled\)void ensureMusic\(\)/);
 assert.doesNotMatch(s,/createOscillator\(/);
});
test('Images are new safe-padded local assets and redundant foot hint is removed',()=>{
 const s=src(),css=read('client/src/makko-ho-guide-v5775910.css');
 assert.match(s,/makko-ho-cards-v5775917/);
 assert.match(s,/\.webp\?v=5917/);
 assert.doesNotMatch(s,/Gong bei Zielzeit · Timer läuft weiter/);
 assert.match(css,/\.mk617-side-label\{/);
 assert.match(css,/object-fit:contain/);
});
test('Vault persistence and compact 14-day statistics are provided by existing first Vite bridge',()=>{
 const bridge=read('client/compass5910-strength-habits-bridge.js');
 assert.match(bridge,/makkoHoSessions/);
 assert.match(bridge,/onSession:async session/);
 assert.match(bridge,/await mutate\(st=>\{/);
 assert.match(bridge,/onFinish:async/);
 assert.match(bridge,/function makkoTimeInsights\(st\)/);
 assert.match(bridge,/const dates=Array\.from\(\{length:14\}/);
 assert.match(bridge,/Vorzeitig beendete Sessions/);
 assert.doesNotMatch(bridge,/localStorage\.setItem\(['"]makko/);
});
