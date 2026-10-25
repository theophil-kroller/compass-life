import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const guide=()=>read('client/src/makko-ho-guide-v5775910.js');

test('The Makko-Ho music menu offers all user-supplied tracks and remembers choice',()=>{
 const js=guide();
 for(const id of ['sakura-dance','henshin','japan-koto'])assert.match(js,new RegExp(`id:'${id}'`));
 assert.match(js,/let selectedMusic='sakura-dance'/);
 assert.match(js,/localStorage\.getItem\(MUSIC_SELECTED_KEY\)/);
 assert.match(js,/localStorage\.setItem\(MUSIC_SELECTED_KEY,selectedMusic\)/);
 assert.match(js,/localStorage\.getItem\(MUSIC_VOLUME_KEY\)/);
 assert.match(js,/localStorage\.setItem\(MUSIC_VOLUME_KEY,String\(musicVolume\)\)/);
 assert.match(js,/data-go="music-settings"/);
 assert.match(js,/data-go="track"/);
 assert.match(js,/data-track="\$\{track\.id\}"/);
});

test('Three bundled recordings have valid MP3 signatures and are requested only on use',()=>{
 const js=guide();
 assert.match(js,/if\(selectedMusic!=='classic'\)return ensureLocalMusic\(\)/);
 assert.match(js,/new Audio\(MUSIC_ROOT\+selection\.file\)/);
 assert.match(js,/player\.preload='none'/);
 assert.match(js,/musicPlayer\.loop=true/);
 assert.match(js,/if\(running&&musicEnabled\)void ensureMusic\(\)/);
 assert.doesNotMatch(js,/createOscillator\(/);
 const names=['sakura-dance.mp3','henshin-koto.mp3','japan-koto-folk.mp3'];
 for(const name of names){
   const b=readFileSync(new URL('../client/public/makko-ho-music-v5775918/'+name,import.meta.url));
   assert.ok(b.length>1_000_000&&b.length<8_000_000,`${name}: unexpected size`);
   assert.ok(b.toString('ascii',0,3)==='ID3'||b[0]===255,`${name}: invalid MP3`);
 }
});

test('Existing timer, gong, wake lock, side-switch and complete-session bookkeeping stay unchanged',()=>{
 const js=guide();
 for(const fragment of ['getGong()','if(remaining===0&&!completed)','void acquireWakeLock()','releaseWakeLock()','side=\'right\'','onFinish(data)','onSession(data)','data-go="start"','data-go="next"'])assert.ok(js.includes(fragment),fragment);
 assert.match(js,/GONG_DEFAULT_URL/);
});

test('Music chooser is a compact responsive popover, not another scrollable screen',()=>{
 const css=read('client/src/makko-ho-guide-v5775910.css');
 for(const selector of ['.mk618-gear','.mk618-settings','.mk618-track','.mk618-track.selected'])assert.ok(css.includes(selector),selector);
 assert.match(css,/\.mk618-settings\{position:absolute/);
 assert.match(css,/@media\(max-width:520px\)/);
 assert.match(css,/\.mk616-dialog\{[^}]*overflow:hidden/);
});
