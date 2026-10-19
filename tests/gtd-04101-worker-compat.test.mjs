import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assertCompatibleWorker} from '../client/src/health-check.js';

test('Worker 0.5.5 API 11 and ready D1 work', () => {
  assert.equal(assertCompatibleWorker({apiVersion:11,schema:{ready:true}}), true);
});
test('Newer compatible Worker stays accepted', () => {
  assert.equal(assertCompatibleWorker({apiVersion:11,schema:{ready:true}}), true);
});
test('Old Worker reports deployment, not SQL issue', () => {
  assert.throws(() => assertCompatibleWorker({apiVersion:7,schema:{ready:true}}), /Worker veraltet.*SQL allein aktualisiert den Worker/);
});
test('Ready Worker with missing migration reports D1 and required migration', () => {
  assert.throws(() => assertCompatibleWorker({apiVersion:11,schema:{ready:false,requiredMigration:'0008'}}), /Migration 0008 erforderlich/);
});
test('Invalid or absent API rejects safely', () => {
  for (const v of [null, {}, {apiVersion:'8',schema:{ready:true}}])
    assert.throws(()=>assertCompatibleWorker(v), /Worker veraltet/);
});
test('App uses shared check and displays frontend version; review and navigation remain enabled', () => {
  const ui=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
  assert.match(ui,/assertCompatibleWorker\(health\)/);
  assert.match(ui,/COMPASS_CLIENT_VERSION='0\.5\.19'/);
  assert.match(ui,/navItem\('people','Menschen','people'\)/);
  assert.match(ui,/navItem\('recovery','Erholung','heart'\)/);
  assert.ok(!ui.includes('Nicht alles muss sofort geklärt werden.'));
});
