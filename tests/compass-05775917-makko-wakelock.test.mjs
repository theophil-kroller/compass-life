import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const guide=()=>read('client/src/makko-ho-guide-v5775910.js');

test('play/pause is a single icon-only, accessible button',()=>{
  const src=guide();
  const css=read('client/src/makko-ho-guide-v5775910.css');
  assert.match(src,/class="mk616-start mk617-media"/);
  assert.match(src,/aria-label="\$\{running\?'Pausieren':'Starten'\}"/);
  assert.match(src,/aria-pressed="\$\{running\}"/);
  assert.match(src,/<svg aria-hidden="true" viewBox="0 0 24 24"/);
  assert.match(src,/data-go="start"/);
  assert.match(css,/\.mk616-start\.mk617-media\{display:grid;place-items:center/);
  assert.doesNotMatch(src,/>\$\{running\?'Pause':completed\?'Weiter halten':'Play'\}<\/button>/);
});

test('wake lock starts only inside user Play handler, never during import or guide open',()=>{
  const src=guide();
  const start=src.split("panel.querySelector('[data-go=\"start\"]').onclick=()=>{")[1];
  assert.ok(start);
  assert.match(start.slice(0,350),/running=true;[\s\S]*?void acquireWakeLock\(\)/);
  assert.match(src,/navigator\.wakeLock\.request\('screen'\)/);
  assert.match(src,/if\(closed\|\|!running\|\|document\.hidden\)return/);
  assert.match(src,/typeof navigator\.wakeLock\?\.request==='function'/);
  assert.match(src,/data-wake-status aria-live="polite"/);
});

test('wake lock releases on pause, next, reset, duration change and cleanup',()=>{
  const src=guide();
  assert.match(src,/const stop=\(\)=>\{stopActive\(\);running=false;[\s\S]*?releaseWakeLock\(\);\}/);
  for(const action of ['next','prev','reset','duration']){
    const handler=src.split(`panel.querySelector('[data-go="${action}"]').on${action==='duration'?'change':'click'}=`)[1];
    assert.ok(handler,`handler missing: ${action}`);
    assert.match(handler.slice(0,100),/stop\(\)/,`stop missing: ${action}`);
  }
  assert.match(src,/const cleanup=\(\)=>\{if\(closed\)return;closed=true;stop\(\)/);
  assert.match(src,/if\(document\.hidden&&running\)\{snapshotTime\(\);stop\(\);render\(\);\}/);
  assert.match(src,/wakeGeneration/);
  assert.match(src,/generation!==wakeGeneration/);
  assert.match(src,/sentinel\.release\(\)/);
});

test('failed or unsupported requests do not interrupt the workout',()=>{
  const src=guide();
  assert.match(src,/wakeState='unsupported'/);
  assert.match(src,/wakeState='failed'/);
  assert.match(src,/\.catch\(error=>\{/);
  assert.match(src,/wakeRequest=null/);
  assert.match(src,/wakeSentinel\.addEventListener|sentinel\.addEventListener\?\./);
  assert.match(src,/if\(!closed&&running&&!document\.hidden&&wakeRetry<1\)/);
  assert.doesNotMatch(src,/setInterval\(.*wakeLock/);
});

test('old Makko full-screen and gong contracts stay intact',()=>{
  const src=guide(),css=read('client/src/makko-ho-guide-v5775910.css');
  for(const id of ['metal','earth','fire','water','innerfire','wood']) assert.match(src,new RegExp(`pose:'${id}'`));
  assert.match(src,/makko-ho-cards-v5775917/);
  assert.match(src,/completed=true;overtime=0;gong\(\);render\(\)/);
  assert.match(src,/step\+\+;remaining=duration;overtime=0;completed=false;render\(\)/);
  assert.match(css,/height:100dvh;max-height:100dvh/);
  assert.match(css,/overflow:hidden/);
  assert.doesNotMatch(src,/zoneGraphic\(stage\)|mk614-zones/);
});
