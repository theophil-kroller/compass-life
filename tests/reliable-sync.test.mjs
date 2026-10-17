import test from 'node:test';
import assert from 'node:assert/strict';
import {applyResult,mergePulled,sameItemContent} from '../client/src/sync.js';

const item=(title='A',note='',deleted=false)=>({id:'item-1',title,note,deleted,updatedAt:'2026-10-17T11:00:00Z'});
const start=(local=item(), mutations=[{id:'item-1',mutationId:'m1',title:local.title,note:local.note,deleted:local.deleted,baseVersion:0}])=>({format:1,records:{'item-1':local},pending:mutations,serverVersions:{},conflicts:[],cursor:0,history:[]});

test('identical payload (including notes and archived state) resolves duplicate insert without human intervention',()=>{
 const s=start();
 applyResult(s,{mutationId:'m1',id:'item-1',status:'conflict',remote:{...item(),version:1}});
 assert.equal(s.pending.length,0);assert.equal(s.conflicts.length,0);assert.equal(s.serverVersions['item-1'],1);
});
test('same title but different note stays a real conflict',()=>{
 const s=start(item('A','new local note'));
 applyResult(s,{mutationId:'m1',id:'item-1',status:'conflict',remote:{...item('A','cloud note'),version:1}});
 assert.equal(s.pending.length,0);assert.equal(s.conflicts.length,1);
 assert.equal(s.conflicts[0].local.note,'new local note');
});
test('pull matches a locally queued update: pending entry is dropped and version acknowledged',()=>{
 const s=start();
 mergePulled(s,[{...item(),version:2}]);
 assert.equal(s.pending.length,0);assert.equal(s.conflicts.length,0);assert.equal(s.serverVersions['item-1'],2);
});
test('changed remote version while a different local edit is queued produces a conflict, not data loss',()=>{
 const s=start(item('A','offline edit'));
 mergePulled(s,[{...item('A','cloud edit'),version:3}]);
 assert.equal(s.conflicts.length,1);assert.equal(s.pending.length,1);
 assert.equal(s.records['item-1'].note,'offline edit');
});
test('same-content comparison includes deletion',()=>{
 assert.equal(sameItemContent(item('A','',false),item('A','',true)),false);
 assert.equal(sameItemContent(item('A','',true),item('A','',true)),true);
});
