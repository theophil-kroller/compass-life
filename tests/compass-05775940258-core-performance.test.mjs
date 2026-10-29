import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reviewCheckpoint,restoreReviewCheckpoint,createTodayPanelMemo} from '../client/src/core-performance-v5775940258.js';
import {gtdDelta,applyGtdDelta} from '../client/src/core-first-v5775940257.js';
import {compass5940258CorePerformance} from '../client/compass5940258-core-performance.js';
const read=relative=>readFileSync(new URL('../'+relative,import.meta.url),'utf8');
const sample=()=>({format:1,records:{inbox:{title:'Behalten'}},tasks:{task:{id:'task',completed:false}},projects:{project:{id:'project',reviewedAt:null}},taskPending:{},projectPending:{},weeklyReview:{step:0,done:[],updatedAt:'2026-10-29'},reviewPending:false,health:{private:'do not copy'},finance:{private:'do not copy'}});
test('review step is a replayable narrow delta; finance and health are excluded',()=>{
 const state=sample(),snapshot=structuredClone(state),checkpoint=reviewCheckpoint(state);
 state.weeklyReview={...state.weeklyReview,step:1};state.reviewPending=true;
 const delta=gtdDelta(checkpoint,state);
 assert.deepEqual(delta.weeklyReview,state.weeklyReview);
 assert.equal(delta.reviewPending,true);
 assert.ok(!JSON.stringify(delta).includes('do not copy'));
 assert.deepEqual(applyGtdDelta(snapshot,delta).weeklyReview,state.weeklyReview);
});
test('reviewing one project creates a task-safe replayable record and can roll back',()=>{
 const state=sample(),checkpoint=reviewCheckpoint(state,{singleProjectId:'project'});
 state.projects.project.reviewedAt='2026-10-29T14:00:00Z';state.projectPending.project=true;
 state.weeklyReview={...state.weeklyReview,done:['projects']};state.reviewPending=true;
 const delta=gtdDelta(checkpoint,state);
 assert.equal(delta.projects.project.reviewedAt,state.projects.project.reviewedAt);
 const recovered=applyGtdDelta(sample(),delta);
 assert.equal(recovered.projectPending.project,true);assert.deepEqual(recovered.weeklyReview.done,['projects']);
 restoreReviewCheckpoint(state,checkpoint);
 assert.equal(state.projects.project.reviewedAt,null);assert.equal(state.reviewPending,false);
});
test('Today family memo caches only identical inputs and never changes output on hits',()=>{
 const memo=createTodayPanelMemo();let calls=0;
 assert.equal(memo.get(['date',1],()=>{calls++;return '<birthday>A</birthday>';}),'<birthday>A</birthday>');
 assert.equal(memo.get(['date',1],()=>{calls++;return 'wrong';}),'<birthday>A</birthday>');
 assert.equal(calls,1);
 assert.equal(memo.get(['date',2],()=>{calls++;return 'new';}),'new');
 memo.clear();assert.equal(memo.get(['date',2],()=>{calls++;return 'refresh';}),'refresh');
 assert.equal(calls,3);
});
test('plugin has guarded anchors, fast review/inspector, visible Today timings',()=>{
 const source=read('transformed-main-preview.js');const plugin=compass5940258CorePerformance();
 assert.match(source,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.25\.8'/);
 assert.match(source,/fastReview\?reviewCheckpoint/);
 assert.match(source,/GTD Journal sicher/);
 assert.match(source,/Heute: Familien- und Geburtstagsradar/);
 assert.match(source,/Heute: Aufgaben und Kalender/);
 assert.match(source,/Heute: Shell und Hinweise/);
 assert.match(source,/fastGtd:true,fastPlanning:true,singleTaskId:id,onApplied:\(\)=>\{notice='Aufgabe aktualisiert/);
 assert.match(source,/captureReviewDraft\(\);const index=/);
 assert.equal(plugin.name,'compass-5940258-core-performance');
});
