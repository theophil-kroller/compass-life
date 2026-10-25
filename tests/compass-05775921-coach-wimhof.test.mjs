import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
const rel=p=>new URL('../'+p,import.meta.url);
const read=p=>readFileSync(rel(p),'utf8');
const bridge=read('client/compass5910-strength-habits-bridge.js');
const guide=read('client/src/strength-guided-v5775920.js');
const wim=read('client/src/wim-hof-player-v5775921.js');
const coach=read('client/src/strength-coach-v5775910.js');

test('Morgen und Abend verwenden die kompakten MP3-Ausgaben der gelieferten M4A-Aufnahmen',()=>{
 for(const [filename,key] of [['AUD-20240504-WA0004.mp3','morning'],['AUD-20240504-WA0005.mp3','evening']]){
  assert.ok(wim.includes(key+':{'));
  assert.ok(wim.includes(filename));
  const file=readFileSync(rel('client/public/wim-hof-audio/'+filename));
  assert.ok(file.byteLength>1000000);
  assert.ok(file.subarray(0,3).toString('ascii')==='ID3'||file[0]===0xff,'valid MP3 signature');
 }
});
test('Wim Hof wird erst nach vollständiger Wiedergabe abgehakt, nicht nach Stop/Pause',()=>{
 assert.match(wim,/audio\.onended=async/);
 assert.match(wim,/await onComplete\(/);
 assert.match(wim,/function stop\(\)/);
 assert.match(wim,/indexedDB\.open\(DB,1\)/);
 assert.match(wim,/wimSaveRecording\(track,blob\)/);
 assert.match(wim,/URL\.createObjectURL\(blob\)/);
 assert.match(wim,/navigator\.wakeLock\.request\('screen'\)/);
 assert.match(bridge,/wim-hof-start/);
 assert.match(bridge,/habitIsDone\(state,'wim-hof'\)/);
 assert.doesNotMatch(wim,/autoplay\b/i);
});
test('Wim Hof audios are loaded on demand; not in Vite pre-cache',()=>{
 const vite=read('client/vite.config.js');
 assert.match(vite,/globPatterns:/);
 assert.doesNotMatch(vite,/\.(?:mp3|m4a)[,}'"]|\*\.(?:mp3|m4a)/);
 assert.match(wim,/async function ensureLoaded\(\)/);
 assert.match(wim,/fetch\(wimTrackSource\(track\)/);
 assert.match(wim,/accept="\.mp3,\.m4a/);
 assert.match(wim,/\(mp3\|m4a\)/);
});
test('The coach is goal-and-location-aware and StrongLifts is gym-only',()=>{
 assert.match(coach,/mode==='stronglifts'/);
 assert.match(coach,/location==='gym'&&mode==='stronglifts'/);
 assert.match(coach,/trainingFocus:strongLifts\?/);
 assert.match(coach,/data-place="home"/);
 assert.match(coach,/data-place="gym"/);
 assert.match(bridge,/💪 Coach/);
 assert.match(bridge,/mm570-open/);
});
test('Plate inventory is 4 of each 2.5 2 1.5 and 1 kilograms (28 kg total)',()=>{
 assert.match(coach,/HOME_PLATE_INVENTORY/);
 assert.match(guide,/HOME_PLATES_KG=28/);
 assert.match(guide,/validPlateWeight/);
 const source=guide.replace(/^import.*$/gm,'').replace(/export (function|const) /g,'$1 ').replace('import.meta.env?.BASE_URL',"'/'")+'\nthis.max=maxHomeWeight;this.ok=validPlateWeight;';
 const vm=createContext({Number,String,Math,RegExp});
 runInContext(source,vm);
 assert.equal(vm.max('dumbbell-row'),28);
 assert.equal(vm.ok(28,'home','dumbbell-row'),true);
 assert.equal(vm.ok(30,'home','dumbbell-row'),false);
 assert.equal(vm.ok(70,'gym','deadlift'),true);
});

test('Set tracking requires explicit tap and retains Garmin approval step',()=>{
 assert.match(guide,/data-act="set-circle"/);
 assert.match(guide,/sets\.push\(\{confirmed:true/);
 assert.match(bridge,/str620-prefill/);
 assert.match(bridge,/window\.confirm/);
 assert.match(guide,/navigator\.wakeLock/);
});
