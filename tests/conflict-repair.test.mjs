import test from 'node:test';
import assert from 'node:assert/strict';
import {pruneIdenticalConflicts} from '../client/src/sync.js';
const row=(title,note='',deleted=false)=>({id:'a',title,note,deleted,version:3});
test('old identical test conflicts are automatically removed without resubmitting identical content',()=>{
 const state={records:{a:row('Test')},pending:[{id:'a',mutationId:'queued'}],conflicts:[{id:'a',local:row('Test'),remote:row('Test')}],serverVersions:{a:1}};
 assert.equal(pruneIdenticalConflicts(state),1);
 assert.equal(state.pending.length,0);assert.equal(state.conflicts.length,0);assert.equal(state.serverVersions.a,3);
});
test('true conflict with differing note remains protected',()=>{
 const state={records:{a:row('Test','important local note')},pending:[],conflicts:[{id:'a',local:row('Test','important local note'),remote:row('Test','cloud note')}],serverVersions:{a:1}};
 assert.equal(pruneIdenticalConflicts(state),0);assert.equal(state.conflicts.length,1);
});
