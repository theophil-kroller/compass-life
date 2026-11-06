import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {EXERCISES} from '../client/src/strength-editor-v57732.js';

const c=new URL('../client/',import.meta.url);
const js=readFileSync(new URL('src/strength-guided-v5775920.js',c),'utf8');
const css=readFileSync(new URL('src/strength-guided-v5775920.css',c),'utf8');
const manifest=JSON.parse(readFileSync(new URL('public/strength-visuals-v059128/manifest.json',c),'utf8'));
const groups={'pullup':'Rücken','cable-row':'Rücken','crunch':'Rumpf','pallof-press':'Rumpf','curl-to-press':'Kombinationsübungen','hammer-to-press':'Kombinationsübungen'};

test('all six targeted editorial exercises have unique photo-based START/ENDE illustration files',()=>{
 assert.equal(manifest.release,'0.5.91.28');
 assert.equal(manifest.count,6);
 assert.deepEqual(Object.keys(manifest.images).sort(),Object.keys(groups).sort());
 for(const [id,group] of Object.entries(groups)){
  assert.equal(EXERCISES.find(e=>e.id===id)?.group,group,id);
  const file=new URL(`public/strength-visuals-v059128/${id}.webp`,c);
  const buf=readFileSync(file);
  assert.ok(buf.byteLength>20_000,id);
  assert.equal(buf.toString('ascii',0,4),'RIFF');
  assert.equal(buf.toString('ascii',8,12),'WEBP');
  assert.deepEqual(manifest.images[id].phases,['START','ENDE']);
  assert.deepEqual(manifest.images[id].dimensions,[1448,850]);
  assert.equal(manifest.images[id].sha256,createHash('sha256').update(buf).digest('hex'));
 }
});

test('these six exercise visuals take precedence over all previous images and text-only fallback',()=>{
 const n=js.indexOf('BACK_CORE_PHOTO_EXERCISES_128.has(curr.id)?');
 const chest=js.indexOf('CHEST_PHOTO_EXERCISES_127.has(curr.id)?');
 const calf=js.indexOf('CUSTOM_PHOTO_EXERCISES_126.has(curr.id)?');
 const fallback=js.indexOf(':exerciseMovementSvg(curr.id)}');
 assert.ok(n>0 && chest>n && calf>chest && fallback>calf);
 assert.ok(js.includes('BACK_CORE_PHOTO_ROOT_128=VISUAL_ROOT.replace'));
 assert.ok(js.includes('BACK_CORE_PHOTO_ROOT_128}${curr.id}.webp'));
 assert.ok(js.includes('PHASE_TEXT_126[curr.id]'));
 assert.ok(css.includes('.str128-back-core-figure img'));
});

test('approved chest and calf images and all training confirmations remain unchanged',()=>{
 const chest=JSON.parse(readFileSync(new URL('public/strength-visuals-v059127/manifest.json',c),'utf8'));
 assert.equal(chest.count,7);
 assert.ok(statSync(new URL('public/strength-visuals-v059126/calf-raise.webp',c)).size>20_000);
 for(const [id,m] of Object.entries(chest.images)){
   const sha=createHash('sha256').update(readFileSync(new URL(`public/strength-visuals-v059127/${id}.webp`,c))).digest('hex');
   assert.equal(sha,m.sha256,id);
 }
 assert.ok(js.includes('sets.push({confirmed:true'));
 assert.ok(js.includes('saveRir=('));
});

test('release version and original photos stay fully compatible',()=>{
 const root=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 const client=JSON.parse(readFileSync(new URL('package.json',c),'utf8'));
 assert.equal(root.version,'0.5.91.31');
 assert.equal(client.version,'0.5.91.31');
 assert.match(readFileSync(new URL('src/compass-release-v57759402519.js',c),'utf8'),/0\.5\.91\.31/);
});
