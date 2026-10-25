import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=x=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const guide=()=>read('client/src/makko-ho-guide-v5775910.js');

test('Single acoustic gong exactly at threshold, without auto-stopping or auto-next',()=>{
 const src=guide();const tick=src.split('function tick(){')[1].split('function render(){')[0];
 assert.match(tick,/if\(remaining===0&&!completed\)/);
 assert.match(tick,/completed=true;overtime=0;gong\(\);render\(\)/);
 assert.doesNotMatch(tick,/stop\(\)|step\+\+|beep\(/);
 assert.match(src,/new Audio\(GONG_DEFAULT_URL\)/);
 assert.doesNotMatch(src,/createOscillator\(/);
});

test('Overtime increases, pauses correctly and resets on next stage',()=>{
 const src=guide();
 assert.match(src,/overtime=Math\.max\(0,Math\.floor\(-delta\/1000\)\)/);
 assert.match(src,/snapshotTime\(\);stop\(\);render\(\);return/);
 assert.match(src,/target=performance\.now\(\)\+\(completed\?-overtime:remaining\)\*1000/);
 assert.match(src,/completed\?'\+'\+fmt\(overtime\):fmt\(remaining\)/);
 assert.match(src,/step\+\+;remaining=duration;overtime=0;completed=false;render\(\)/);
});

test('Duration and recorded music are user-controlled; media is not eagerly embedded',()=>{
 const src=guide();
 assert.match(src,/duration=Number\(e.target.value\)\|\|45;remaining=duration;overtime=0/);
 assert.match(src,/if\(musicEnabled\)void ensureMusic\(\)/);
 assert.match(src,/musicPlayer\.loop=true/);
 assert.doesNotMatch(src,/setTimeout\(\(\)=>beep\(/);
 assert.ok(!src.includes('import "/makko-ho-music'));
});

test('Compact timer remains legible next to Play and Next in fixed-height player',()=>{
 const css=read('client/src/makko-ho-guide-v5775910.css');
 const js=guide();
 assert.match(js,/mk613-timer-display mk616-timer/);
 assert.match(css,/\.mk613-clock-state\{/);
 assert.match(js,/data-go="next"/);
 assert.match(js,/const ART_ROOT=/);
 assert.match(css,/\.mk616-dialog\{[^}]*overflow:hidden/);
});
