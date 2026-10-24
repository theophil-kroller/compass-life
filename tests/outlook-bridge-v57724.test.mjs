import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {OUTLOOK_SCHEMA,parseOutlookFlags,outlookCandidates,outlookTask,outlookInboxRecord,chooseOutlookItems,outlookBridgeUrl} from '../client/src/outlook-bridge-v57724.js';
import {validLocalTask} from '../client/src/tasks.js';
const A='a'.repeat(64),B='b'.repeat(64);
const input={schema:OUTLOOK_SCHEMA,source:'classic-outlook-local',items:[{id:A,subject:'  Vertragsentwurf  ',flagDueDate:'2026-11-04'},{id:B,subject:'Rückmeldung abwarten'}]};
test('strict Outlook schema: duplicate IDs skipped and no mail body/sender copied',()=>{
 const items=parseOutlookFlags({...input,items:[...input.items,input.items[0]]});
 assert.deepEqual(items.map(x=>x.title),['Vertragsentwurf','Rückmeldung abwarten']);
 assert.equal(items[0].flagDueDate,'2026-11-04');
 assert.equal(items[0].dueDate,undefined);
 assert.equal('body' in items[0],false);
 assert.throws(()=>parseOutlookFlags({items:[]}),/Ungültiger/);
 assert.throws(()=>parseOutlookFlags({...input,items:[{id:'123',subject:'Subject'}]}),/ungültig/);
 assert.throws(()=>parseOutlookFlags({...input,items:[{id:A,subject:'<script>'.repeat(25)}]}),/ungültig/);
 assert.throws(()=>parseOutlookFlags({...input,items:new Array(501).fill(input.items[0])}),/Ungültiger/);
});
test('previous imports are skipped and never recreated from the same export',()=>{
 const items=outlookCandidates(input,{[A]:{id:'local-task',kind:'next'}});
 assert.equal(items[0].alreadyImported,true);assert.equal(items[0].selected,false);
 assert.equal(items[1].alreadyImported,false);
 const params=new URLSearchParams();params.append('selected',A);params.append('selected',B);
 params.append('title-'+B,'Brief beantworten');params.append('kind-'+B,'waiting');
 const chosen=chooseOutlookItems(items,params,{[A]:{id:'local-task'}});
 assert.deepEqual(chosen.map(x=>x.id),[B]);
 assert.equal(chosen[0].kind,'waiting');
});
test('Outlook next/waiting create valid GTD tasks without hard deadlines or Office raw IDs',()=>{
 const next=outlookTask(input.items[0],'c57d87a7-3c4e-40fb-8e72-0920323c8ed1','2026-10-24T07:00:00Z');
 assert.ok(validLocalTask(next));assert.equal(next.workflow,'next');assert.equal(next.dueDate,null);
 assert.ok(!JSON.stringify(next).includes(A));assert.equal(next.tags[0],'outlook');
 const waiting=outlookTask(input.items[1],'88a1a0e3-bb4b-4933-a012-d1f66ef800d0',undefined,'waiting');
 assert.ok(validLocalTask(waiting));assert.equal(waiting.workflow,'waiting');
 assert.equal(waiting.plannedDate,null);
 const rec=outlookInboxRecord(input.items[0],'88a1a0e3-bb4b-4933-a012-d1f66ef800d0');
 assert.equal(rec.deleted,false);assert.equal(rec.tags[0],'outlook');assert.equal(rec.title,'Vertragsentwurf');
});
test('bridge URL always loops back; no arbitrary external address can be configured',()=>{
 assert.equal(outlookBridgeUrl(8765),'http://127.0.0.1:8765/v1/flags');
 for(const value of [80,65536,'foo',0])assert.throws(()=>outlookBridgeUrl(value));
});
test('Outlook UI is gated to inbox and requires manual approval before storing',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/outlook724Markup\(\)/);
 assert.match(main,/outlook724Token/);
 assert.match(main,/confirm\(`\$\{selected\.length\} Outlook-Markierungen/);
 assert.match(main,/outlookBridgeImported/);
 assert.match(main,/outlook724Preview/);
 assert.match(main,/outlook724Fetch\(true\)/);
 assert.match(main,/document\.visibilityState!=='visible'/);
 assert.match(main,/outlook724Token='';outlook724Connected=false;/);
 const bridge=readFileSync(new URL('../tools/outlook_bridge.py',import.meta.url),'utf8');
 assert.match(bridge,/127\.0\.0\.1/);assert.match(bridge,/secrets\.compare_digest/);assert.match(bridge,/read_flagged\(limit\)/);
 assert.doesNotMatch(bridge,/\.Send\(|\.Delete\(|\.Save\(/);
});
