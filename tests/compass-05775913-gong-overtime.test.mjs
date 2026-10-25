import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(x)=>readFileSync(new URL('../'+x,import.meta.url),'utf8');
const guide=()=>read('client/src/makko-ho-guide-v5775910.js');
test('one gong at threshold, no automatic stop or navigation',()=>{
 const text=guide();const timer=text.split('function tick(){')[1].split('function render(){')[0];
 assert.match(timer,/if\(remaining===0&&!completed\)/);
 assert.match(timer,/completed=true;overtime=0;gong\(\);render\(\)/);
 assert.doesNotMatch(timer,/stop\(\)|step\+\+|beep\(/);
 assert.match(text,/for\(const \[frequency,level,decay\] of/);
});
test('overtime continues to increase, and paused time does not accrue',()=>{
 const text=guide();
 assert.match(text,/overtime=Math\.max\(0,Math\.floor\(-delta\/1000\)\)/);
 assert.match(text,/snapshotTime\(\);stop\(\);render\(\);return/);
 assert.match(text,/target=performance\.now\(\)\+\(completed\?-overtime:remaining\)\*1000/);
 assert.match(text,/completed\?'\+'\+fmt\(overtime\):fmt\(remaining\)/);
});
test('new exercise resets overtime and music stays on demand',()=>{
 const text=guide();
 assert.match(text,/step\+\+;remaining=duration;overtime=0;completed=false;render\(\)/);
 assert.match(text,/duration=Number\(e.target.value\)\|\|45;remaining=duration;overtime=0/);
 assert.match(text,/if\(musicEnabled\)void ensureMusic\(\)/);
 assert.match(text,/musicPlayer\.loop=true/);
 assert.doesNotMatch(text,/setTimeout\(\(\)=>beep\(/);
});
test('label is legible outside the ring, without introducing eager media',()=>{
 const css=read('client/src/makko-ho-guide-v5775910.css');
 const js=guide();
 assert.match(js,/class="mk613-timer-display"/);
 assert.match(css,/\.mk613-clock-state\{font-size:11px/);
 assert.match(js,/data-go="next"/);
 assert.match(js,/const ART_ROOT=/);
 assert.ok(!js.includes('import \"/makko-ho-music'));
});
