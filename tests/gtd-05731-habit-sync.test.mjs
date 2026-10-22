import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergeHabitQuick} from '../client/src/habit-device-sync-v5731.js';
import {mergeJournalData} from '../client/src/personal-journal-v5692.js';

const stamp1='2026-10-22T07:14:22.123Z',stamp2='2026-10-22T09:30:11.000Z';
const item={id:'vocal-image',title:'Vocal Image',slot:'Morgen',active:true};
const tap=(id,day,done,doneAt)=>({habitId:id,day,done,doneAt});
test('phone completion becomes visible on desktop without removing desktop habits',()=>{
 const phone={items:[item],completions:[tap('vocal-image','2026-10-22',true,stamp1)]};
 const desktop={items:[{id:'hakka-5',title:'Hakka',active:true}],completions:[]};
 const merged=mergeHabitQuick(desktop,phone);
 assert.equal(merged.completions.length,1);
 assert.equal(merged.completions[0].done,true);
 assert.deepEqual(merged.items.map(i=>i.id),['hakka-5','vocal-image']);
 assert.deepEqual(mergeHabitQuick(phone,desktop),merged);
});
test('a later explicit uncheck does not resurrect during the next sync',()=>{
 const checked={items:[item],completions:[tap('vocal-image','2026-10-22',true,stamp1)]};
 const unchecked={items:[item],completions:[tap('vocal-image','2026-10-22',false,stamp2)]};
 const merged=mergeHabitQuick(checked,unchecked);
 assert.deepEqual(merged.completions,[tap('vocal-image','2026-10-22',false,stamp2)]);
 assert.deepEqual(mergeHabitQuick(merged,checked),merged);
});
test('independent offline days combine deterministically and idempotently',()=>{
 const a={items:[item],completions:[tap('vocal-image','2026-10-21',true,stamp1)]};
 const b={items:[],completions:[tap('vocal-image','2026-10-22',true,stamp2)]};
 const x=mergeHabitQuick(a,b);
 assert.equal(x.completions.length,2);
 assert.deepEqual(mergeHabitQuick(b,a),x);
 assert.deepEqual(mergeHabitQuick(x,a),x);
});
test('equal timestamp tie prefers unchecked and old missing timestamps are not restamped',()=>{
 const a={completions:[tap('vocal-image','2026-10-22',true,stamp1),{habitId:'hakka-5',day:'2026-10-20',done:true}]};
 const b={completions:[tap('vocal-image','2026-10-22',false,stamp1)]};
 const merged=mergeHabitQuick(a,b);
 assert.equal(merged.completions.find(x=>x.habitId==='vocal-image').done,false);
 assert.equal(merged.completions.find(x=>x.habitId==='hakka-5').doneAt,'');
});
test('full private journal merge carries Habits without dropping other domains',()=>{
 const local={nutritionJournal:{entries:[{id:'food',at:stamp1}],customFoods:[]},habitsQuick:{items:[item],completions:[tap('vocal-image','2026-10-22',true,stamp1)]}};
 const remote={feelingCheckins:[{id:'checkin',at:stamp2,items:[]}],habitsQuick:{items:[],completions:[]}};
 const merged=mergeJournalData(local,remote);
 assert.equal(merged.habitsQuick.completions.length,1);
 assert.equal(merged.nutritionJournal.entries.length,1);
 assert.equal(merged.feelingCheckins.length,1);
});
test('UI sends & receives Habits and exposes sync status',()=>{
 const src=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(src,/habitsQuick:ensureHabitState\(st\)/);
 assert.match(src,/if\(m\.habitsQuick\)st\.habitsQuick=m\.habitsQuick/);
 assert.match(src,/s\?\.habitsQuick\|\|null/);
 assert.match(src,/const row=\{habitId,day,done:done===true,doneAt\}/);
 assert.match(src,/Habits, Zeitjournal, Ernährung & Kalender/);
});
