import test from 'node:test';
import assert from 'node:assert/strict';
import {contextChoices,filterContextTasks} from '../client/src/context-perspectives.js';
const tasks=[
 {id:'a',contextTags:['arbeit-uni','laptop']},
 {id:'b',contextTags:['arbeit-buero']},
 {id:'c',contextTags:['energie-hoch','arbeit']},
 {id:'d',contextTags:['laptop','arbeitgeber']}
];
test('Context perspectives group existing dashed tags without writing or inventing new data',()=>{
 const before=JSON.stringify(tasks),choices=contextChoices(tasks);
 assert.ok(choices.some(c=>c.value==='group:arbeit'&&c.group));
 assert.ok(choices.some(c=>c.value==='laptop'&&!c.group));
 assert.equal(JSON.stringify(tasks),before);
});
test('Context parent matching uses separator boundaries, not accidental substrings',()=>{
 assert.deepEqual(filterContextTasks(tasks,'group:arbeit').map(x=>x.id),['a','b','c']);
 assert.deepEqual(filterContextTasks(tasks,'arbeit').map(x=>x.id),['c']);
 assert.deepEqual(filterContextTasks(tasks,'laptop').map(x=>x.id),['a','d']);
 assert.equal(filterContextTasks(tasks,'').length,4);
});
