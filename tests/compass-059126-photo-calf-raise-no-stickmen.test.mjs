import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';
const base=new URL('../client/',import.meta.url);
const guided=readFileSync(new URL('src/strength-guided-v5775920.js',base),'utf8');
const css=readFileSync(new URL('src/strength-guided-v5775920.css',base),'utf8');
const photo=new URL('public/strength-visuals-v059126/calf-raise.webp',base);
const manifest=JSON.parse(readFileSync(new URL('public/strength-visuals-v059126/manifest.json',base),'utf8'));
const src=guided.replace(/^import.*$/gm,'').replace(/export (function|const) /g,'$1 ').replace('import.meta.env?.BASE_URL',"'/'");
const ctx={Number,Math,String,Date,RegExp,Map,Set,Intl};
runInNewContext(src+'\nthis.visualAPI={exerciseMovementSvg};',ctx);
const missing=['incline-bench','pushup','chest-press','chest-fly','pullup','cable-row','romanian-deadlift','leg-press','lunge','leg-extension','leg-curl','hip-thrust','glute-bridge','calf-raise','shoulder-press','lateral-raise','reverse-fly','biceps-curl','hammer-curl','triceps-pushdown','triceps-extension','wrist-curl','crunch','pallof-press','curl-to-press','hammer-to-press','triceps-curl','skullcrusher','close-grip-bench','reverse-curl','concentration-curl','seated-dumbbell-press','incline-pushup','decline-pushup','pike-pushup','prone-y-raise'];
test('new calf raise media uses real WebP data and owner approved start/end labels',()=>{
 assert.equal(manifest.release,'0.5.91.26');
 assert.equal(manifest.images['calf-raise'].stages.join(':'),'START:END');
 assert.ok(existsSync(photo));assert.ok(statSync(photo).size>20000);
 const bytes=readFileSync(photo);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.match(guided,/CUSTOM_PHOTO_EXERCISES_126\.has\(curr\.id\)/);
 assert.match(guided,/CUSTOM_PHOTO_ROOT_126/);
 assert.match(guided,/Hantelscheibe/);
});
test('calf-raise branch wins over legacy stickman fallback',()=>{
 const approved=guided.indexOf('CUSTOM_PHOTO_EXERCISES_126.has(curr.id)?');
 const fallback=guided.indexOf(':exerciseMovementSvg(curr.id)}');
 assert.ok(approved>0&&fallback>approved);
 assert.ok(!guided.includes('${COACH_NEW_VISUAL_ROOT}${curr.id}.svg'));
 assert.match(css,/str126-calf-figure/);
});
test('all previously schematic workouts now have explicit START / ENDE descriptions rather than SVG figures',()=>{
 assert.equal(EXERCISES.length,68);
 assert.equal(missing.length,36);
 for(const id of missing){
  assert.ok(EXERCISES.some(x=>x.id===id),id);
  const result=ctx.visualAPI.exerciseMovementSvg(id);
  assert.match(result,/START/);assert.match(result,/ENDE/);
  assert.ok(!result.includes('<svg'),id);
  assert.match(result,/keine Strichmännchen-Grafik/);
 }
});
test('photo switching remains compatible with original photo collections and V-Taper plugin anchors',()=>{
 assert.match(guided,/PREMIUM_VISUALS\.has\(curr\.id\)/);
 assert.match(guided,/COACH_PREMIUM_PHOTOS\.has\(curr\.id\)/);
 assert.match(guided,/NEW_EXERCISES_BY_ID_89\.has\(curr\.id\)/);
 assert.match(guided,/COACH_NEW_VISUALS/); // archive remains accessible but is never rendered
 assert.equal((guided.match(/import\.meta\.env\?\.BASE_URL/g)||[]).length,1);
 assert.match(guided,/role="group" aria-label="Start- und Endposition als Text/);
});
