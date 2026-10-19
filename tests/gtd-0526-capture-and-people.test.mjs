import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseCaptureLines,parseAiCaptureJson,capturePreview,captureInboxRecord} from '../client/src/capture-triage-v26.js';
const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');

test('0.5.26 capture distinguishes actions, agenda and waiting; excludes prose and does not invent deadlines',()=>{
 const rows=parseCaptureLines('Meeting: Status zum Release\n- [Aktion] Präsentation senden\n- [Waiting] Rückmeldung von Redaktion abwarten\n- [Agenda] Auftrag klären\n- Idee ohne Label');
 assert.equal(rows.length,4);
 assert.deepEqual(rows.map(r=>r.kind),['Aktion','Waiting For','Gesprächspunkt','Ungeklärt']);
 const record=captureInboxRecord(rows[0],{id:'local-id',updatedAt:'2026-10-19T10:00:00Z'});
 assert.deepEqual(Object.keys(record).sort(),['deleted','id','note','tags','title','updatedAt']);
 assert.match(record.note,/Klärungsvorschlag/);
 assert.ok(!('dueDate' in record));
});

test('0.5.26 capture preview flags repeated and existing records without creating tasks',()=>{
 const rows=parseCaptureLines('- Brief versenden\n- Brief versenden\n- Anderes Anliegen');
 const preview=capturePreview(rows,[{title:'ANDERES Anliegen',deleted:false}]);
 assert.deepEqual(preview.map(x=>x.duplicate),[false,true,true]);
 assert.throws(()=>parseCaptureLines('A'.repeat(40001)),/40.000/);
 assert.equal(parseCaptureLines('Langer Fließtext ohne strukturierten Hinweis.').length,0);
});

test('0.5.26 local AI JSON is schema-checked and unsafe/invalid tags filtered',()=>{
 const parsed=parseAiCaptureJson(JSON.stringify({items:[{title:'Mit Team Rücksprache halten',kind:'Gesprächspunkt',note:'Keine implizite Deadline',tags:['#nathanael','???','Nathanael','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa']}]}));
 assert.deepEqual(parsed[0].tags,['nathanael']);
 assert.throws(()=>parseAiCaptureJson('not-json'),/gültiges JSON/);
 assert.throws(()=>parseAiCaptureJson(JSON.stringify({items:[{title:'t',kind:'Aktion'}]})),/Titel oder Notiz/);
 assert.throws(()=>parseAiCaptureJson(JSON.stringify({wrong:[]})),/items/);
});

test('0.5.26 people opens agenda before contact history, handles tasks and inbox in place',()=>{
 const people=main.slice(main.indexOf('function peopleScreen(){'),main.indexOf('function financeScreen(){'));
 assert.ok(people.indexOf('<section class="people-agenda-first">') < people.indexOf('<section class="people-relationship-card">'));
 assert.match(people,/person-point-form/);
 assert.match(people,/person-quick-check/);
 assert.match(people,/Besprochen &amp; archivieren/);
 assert.match(main,/data-action="person-task-done"/);
 assert.match(main,/app\.querySelectorAll\('\.person-point-form'\)/);
 assert.match(main,/s\.taskPending\[id\]=true/);
 assert.match(main,/s\.pending\.push\(makeMutation\(r\)\)/);
 assert.ok(!people.includes('data-action="person-inbox-open"'));
 assert.ok(!people.includes('data-action="person-task-open"'));
 assert.match(css,/\.person-point-actions/);
});

test('0.5.26 bulk capture is preview-before-commit, optional, local-first',()=>{
 assert.match(main,/captureBulkPanel\(\)/);
 assert.match(main,/capture-bulk-confirm/);
 assert.match(main,/capturePreview\(/);
 assert.match(main,/captureInboxRecord\(/);
 assert.match(main,/makeMutation\(rec\)/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.29'/);
 const helper=readFileSync(new URL('../tools/capture/local_ai_capture.py',import.meta.url),'utf8');
 assert.match(helper,/127\.0\.0\.1:1234/);
 assert.doesNotMatch(helper,/https:\/\//);
});
