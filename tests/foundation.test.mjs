import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMutation,validCursor} from '../worker/src/validation.js';
import {nextBatch,applyResult,mergePulled} from '../client/src/sync.js';
const m=(id,mutationId,baseVersion=0)=>({id,mutationId,baseVersion,title:'Sache klären',note:'',deleted:false});
const a='c2d12eb0-43ca-4ea1-a13d-e1d2dbf251bd';
const b='a41d82aa-47da-4026-8a47-5b45fbef6b54';
const c='15764fd6-5c92-4e96-9f79-5bcfd07420d3';
test('mutation validation accepts sane input, rejects malformed requests',()=>{
  assert.equal(validateMutation(m(a,b)),null);
  assert.equal(validateMutation({...m(a,b),title:''}),'invalid-title');
  assert.equal(validateMutation({...m(a,b),baseVersion:-1}),'invalid-base-version');
  assert.equal(validateMutation({...m(a,b),deleted:'false'}),'invalid-deleted-flag');
  assert.equal(validateMutation({...m(a,b),note:'x'.repeat(10001)}),'invalid-note');
});
test('cursor rejects negative/invalid values',()=>{
  assert.equal(validCursor('0'),0);assert.equal(validCursor('123'),123);
  assert.equal(validCursor('-1'),null);assert.equal(validCursor('lol'),null);
});
test('sync batch contains at most one mutation per item',()=>{
  const batch=nextBatch([m(a,b),m(a,c),m(c,a)]);
  assert.equal(batch.length,2);assert.equal(batch[0].mutationId,b);assert.equal(batch[1].id,c);
});
test('retry acknowledgment removes only acknowledged mutation and advances server version',()=>{
  const state={pending:[m(a,b),m(a,c)],serverVersions:{},records:{},conflicts:[]};
  applyResult(state,{id:a,mutationId:b,status:'duplicate',version:1});
  assert.equal(state.pending.length,1);assert.equal(state.serverVersions[a],1);
});
test('a simultaneous change is not silently overwritten',()=>{
  const state={pending:[m(a,b)],records:{[a]:{id:a,title:'Lokale Fassung',deleted:false}},serverVersions:{[a]:1},conflicts:[]};
  mergePulled(state,[{id:a,version:2,title:'Externe Fassung',note:'',deleted:false,updatedAt:'2026-10-16T00:00:00Z'}]);
  assert.equal(state.records[a].title,'Lokale Fassung');assert.equal(state.conflicts.length,1);
});
test('clean remote change merges into local state',()=>{
  const state={pending:[],records:{},serverVersions:{},conflicts:[]};
  mergePulled(state,[{id:a,version:1,title:'Remote',note:'',deleted:false,updatedAt:'2026-10-16T00:00:00Z'}]);
  assert.equal(state.records[a].title,'Remote');assert.equal(state.serverVersions[a],1);
});
