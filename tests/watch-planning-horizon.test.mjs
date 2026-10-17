import test from 'node:test';
import assert from 'node:assert/strict';
import {listWatchPlanning} from '../worker/src/tasks.js';

test('watch deadline snapshot covers 60 days (without treating future deadlines as Today)', async () => {
 let params;
 const rows=[
  {id:'a',title:'Prüfungskorrektur Oktober 2026',planned_date:null,due_date:'2026-10-28',category:'Pruefungen'},
  {id:'b',title:'Workshop Business Models',planned_date:null,due_date:'2026-11-10',category:'Lehre'},
  {id:'c',title:'Für heute planen',planned_date:'2026-10-17',due_date:null,category:'Forschung'}
 ];
 const env={DB:{prepare(sql){assert.match(sql,/FROM planning_tasks/);return{bind(...args){params=args;return{all:async()=>({results:rows})};}};}}};
 const request=new Request('https://example.org/api/watch/planning?day=2026-10-17');
 const response=await listWatchPlanning(request,env,'test-owner');
 assert.equal(response.status,200);
 const data=await response.json();
 assert.equal(params[0],'test-owner');
 assert.equal(params[1],'2026-10-17');
 assert.equal(params[2],'2026-12-16');
 assert.deepEqual(data.deadlines.map(e=>e.title),['Prüfungskorrektur Oktober 2026','Workshop Business Models']);
 assert.deepEqual(data.today.map(e=>e.title),['Für heute planen']);
});
