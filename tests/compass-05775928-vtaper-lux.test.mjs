import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const here=new URL('../client/compass5928-vtaper-lux-bridge.js',import.meta.url);
const source=readFileSync(here,'utf8');
const bridge=runInNewContext(source.replace(/^export /gm,'')+'\ncompass5928VtaperLuxBridge();',{Date,Map,Set,Number,Math,String,Error});
const apply=(s,n)=>bridge.transform(s,`/repo/client/src/${n}`).code;
const coach=readFileSync(new URL('../client/src/strength-coach-v5775910.js',import.meta.url),'utf8');
const guided=readFileSync(new URL('../client/src/strength-guided-v5775920.js',import.meta.url),'utf8');
test('V-Taper becomes first-time preference; Strength/StrongLifts remains opt-in',()=>{
 const s=apply(coach,'strength-coach-v5775910.js');
 assert.match(s,/goal='vtaper'/);assert.match(s,/o.goal:'vtaper'/);assert.match(s,/mode==='stronglifts'/);
 assert.match(s,/pike-pushup/);assert.match(s,/prone-y-raise/);
 assert.match(s,/Trainingstage/);
});
test('new bodyweight photos wired into guided workout without replacing 7 originals',()=>{
 const s=apply(guided,'strength-guided-v5775920.js');
 assert.match(s,/VTAPER_PHOTO_ROOT/);assert.match(s,/strength-visuals-v5775928/);
 assert.match(s,/display:none/,'bodyweight-only workouts should not show plate loading controls');
 assert.match(s,/PREMIUM_VISUALS\.has\(curr.id\)/);
 assert.match(s,/compass:post-workout-nutrition-5928/);
});
test('labelled BCAA preset with label nutrient breakdown; no fake recovery window',()=>{
 const s=apply(`export const FOOD_PRESETS=[\n ['supplement-bluebonnet-one-men','💊','Multi','Nahrungsergänzung','1 Kapsel',null,null],\n].map(([id,emoji,title,group,defaultAmount='',kcalLow=null,kcalHigh=null])=>({\n id,emoji,title,group,defaultAmount,kcalLow,kcalHigh,\n ...(id==='matcha'||id==='matcha-oat-plain'?{foo:1}:{}),\n}));`, 'personal-journal-v5692.js');
 assert.match(s,/supplement-bcaa-alphaminos/);assert.match(s,/leucineG:5/);assert.match(s,/35,35/);
 assert.doesNotMatch(s,/innerhalb.*Stunden.*Muskelwachstum/i);
});
test('Wim-Hof session sets playback guard, checkpoint, completion grace and releases on pause',()=>{
 const s=apply(`import './wim-hof-player-v5775921.css';
function resetAudio(){audio.pause();audio.ontimeupdate=tick;audio.onloadedmetadata=tick;audio.onended=async()=>{if(closed)return;playing=false;release();await onComplete({track,finishedAt:new Date().toISOString(),durationSeconds:Math.round(audio.duration||0)});};}
async function play(){if(playing){audio.pause();playing=false;release();setButtons();return;}await audio.play();playing=true;void keepAwake();}
function stop(){audio.pause();}
function close(){if(closed)return;}
function onPause(){audio.pause();playing=false;release();setButtons();status('Pausiert');}
`,'wim-hof-player-v5775921.js');
 assert.match(s,/routineActive5928\(\)/);assert.match(s,/routineEnded5928\(\)/);
 assert.match(s,/clearWimCheckpoint5928\(track\)/);assert.match(s,/routineStopped5928\(\)/);
});
test('Gold ring animation preserves genuine vault form and build version is visible',()=>{
 const s=apply(`import './ars-vivendi-lock-v5775922.css';
const foo=\`<div>
       <button class="ars22-tap" type="button"></button></div>\`;
function link(){trigger.addEventListener('click',displayForm);}`,'ars-vivendi-lock-v5775922.js');
 assert.match(s,/ars28-gold-rings/);assert.match(s,/Build 0\.5\.77\.59\.28/);
 assert.match(s,/displayForm\(\)/);
});
test('auto-lock is held only while exercise active and five minutes afterward; app version changes',()=>{
 const s=apply(`const COMPASS_CLIENT_VERSION='0.5.77.26';
const render=()=>\`<footer>Compass · Private Beta · Lokal verschlüsselt \${ico('shield',13)}</footer>\`;
window.addEventListener('offline',render);
setInterval(async()=>{if(state&&Date.now()-lastActivity>15*60*1000){await morningBeforeLock();}},60000);`,'main.js');
 assert.match(s,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.28'/);
 assert.match(s,/compassRoutineActive/);assert.match(s,/compassRoutineGraceUntil/);
 assert.match(s,/Build 0\.5\.77\.59\.28/);
});
test('bridge refuses incompatible source instead of silently dropping functionality',()=>{
 assert.throws(()=>apply('export const broken=1;','strength-coach-v5775910.js'),/anchor/);
});
