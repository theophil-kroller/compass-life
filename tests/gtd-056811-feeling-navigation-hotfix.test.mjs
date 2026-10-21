import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const dash=readFileSync(new URL('../client/src/feeling-interface-v5681.js',import.meta.url),'utf8');
const tabs=readFileSync(new URL('../client/src/insights.js',import.meta.url),'utf8');
test('Gefühlswelt ist als direkte Insights-Seitennavigation erreichbar',()=>{
  assert.match(main,/data-action="calm-insight-view" data-id="feelings"[^\n]*<span>Gefühlswelt<\/span>/);
  assert.match(tabs,/id:'feelings',label:'Gefühlswelt'/);
  assert.match(main,/insightTab==='feelings'\?feelingInsights\(/);
});
test('Gesperrte Startseite erzeugt keine doppelten Schnellzugriffsbuttons',()=>{
  assert.doesNotMatch(main,/locked-capture-help/);
  assert.doesNotMatch(main,/Gefühl erfassen – ohne Entsperren/);
  assert.doesNotMatch(main,/Gedanken erfassen – ohne Entsperren/);
  assert.match(main,/class="fw65-top-trigger"[^>]*data-action="feeling-open"/);
  assert.match(main,/class="search-shell capture-shortcut"[^>]*data-action="capture-focus"/);
});
test('Gefühlsdashboard dupliziert nicht den globalen Check-in',()=>{
  assert.doesNotMatch(dash,/\+ Gefühl erfassen/);
  assert.match(dash,/Feeling Inspector/);
  assert.match(dash,/Chronik/);
});
