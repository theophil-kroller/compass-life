import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newFeelingDraft,feelingOverlay,validatedCheckin} from '../client/src/feeling-wheel-v565.js';
import {findEmotionNetwork} from '../client/src/feeling-network-v5705.js';

const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const at='2026-10-21T10:24:00.000Z';
const d={...newFeelingDraft(),ownWords:'Ich bin gerade gestresst'};

test('0.5.70.6: wordcloud renders when vault locked and write-only key exists',()=>{
 const html=feelingOverlay({...d,locked:true},[],{inputMode:'words',captureReady:true});
 assert.match(html,/In eigenen Worten/);
 assert.match(html,/fw705-search-input/);
 assert.match(html,/fw705-network-graph/);
 assert.match(html,/Überfordert/);
 assert.match(html,/Verschlüsselter Eingangspuffer/);
 assert.match(html,/data-action="feeling-save"(?![^>]*disabled)/);
 assert.equal(findEmotionNetwork(d.ownWords).words.length>0,true);
});

test('0.5.70.6: lookup can be used without unlock or configured capture key; saving remains guarded',()=>{
 const html=feelingOverlay({...d,locked:true},[],{inputMode:'words',captureReady:false});
 assert.match(html,/fw705-network-graph/);
 assert.match(html,/Zum sicheren Speichern den Tresor einmalig entsperren/);
 assert.match(html,/data-action="feeling-save" disabled/);
});

test('0.5.70.6: last-used input mode survives modal reopen and is only a non-sensitive preference',()=>{
 assert.match(main,/FEELING_MODE_KEY='compass\.feeling\.inputMode\.v5706'/);
 assert.match(main,/function rememberedFeelingInputMode\(/);
 assert.match(main,/function chooseFeelingInputMode\(/);
 assert.match(main,/if\(action==='feeling-mode'\)[^\n]*chooseFeelingInputMode\(id\)/);
 const line=main.split('\n').find(line=>line.includes("if(action==='feeling-open')"));
 assert.ok(line);
 assert.ok(!line.includes('!state&&!sealedCaptureAvailable'));
 assert.ok(!line.includes("feelingInputMode='wheel'"));
 assert.match(main,/captureReady:sealedCaptureAvailable/);
});

test('0.5.70.6: free form no root is still valid for encrypted capture',()=>{
 const entry=validatedCheckin(d,{id:'11ed9e04-44bb-4c0b-8e33-208442a4a3e1',at,day:'2026-10-21'});
 assert.equal(entry.ownWords,d.ownWords);
 assert.deepEqual(entry.items,[]);
});
