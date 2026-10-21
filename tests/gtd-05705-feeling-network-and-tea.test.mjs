import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EMOTION_NETWORK_TERMS,findEmotionNetwork,toggleNetworkTerm,renderFeelingNetwork} from '../client/src/feeling-network-v5705.js';
import {newFeelingDraft,chooseFeeling,validatedCheckin,feelingOverlay,draftFromCheckin,feelingInsights,FEELINGS} from '../client/src/feeling-wheel-v565.js';
import {FOOD_PRESETS} from '../client/src/personal-journal-v5692.js';
const id='40b593c1-73a8-433a-bfaa-660960879fff',at='2026-10-21T11:40:00.000Z',day='2026-10-21';
test('0.5.70.5 free text stress query offers independent feelings, states and body observations',()=>{
 const r=findEmotionNetwork('Ich bin gerade gestresst');
 const words=r.words.map(t=>t.word);
 for(const term of ['Überfordert','Angespannt','Getrieben','Gereizt','Erschöpft'])assert.ok(words.includes(term),`${term} suggestion missing`);
 assert.ok(r.words.some(t=>t.kind==='körper'));
 assert.ok(r.words.some(t=>t.kind==='gefühl'));
 assert.ok(r.words.some(t=>t.kind==='zustand'));
});
test('0.5.70.5 ambiguous expression shows multiple directions rather than guessing a diagnosis',()=>{
 const r=findEmotionNetwork('aufgeregt');
 const words=r.words.map(t=>t.word);
 assert.ok(words.includes('Nervös'));
 assert.ok(words.includes('Vorfreudig'));
 assert.ok(words.includes('Begeistert'));
});
test('0.5.70.5 distinction: shame, envy and guilt remain independent, not forced into six wheel roots',()=>{
 for(const term of ['Beschämt','Neidisch','Schuldig']){
  const x=EMOTION_NETWORK_TERMS.find(t=>t.word===term);
  assert.equal(x.kind,'gefühl');assert.equal(x.root,'');
 }
 assert.equal(FEELINGS.length,6);
});
test('0.5.70.5 network terms clickable and stable, also allow notes without an assigned root',()=>{
 const word=EMOTION_NETWORK_TERMS.find(x=>x.word==='Angespannt');
 let d={...newFeelingDraft(),ownWords:'Ich bin gerade gestresst'};
 d=toggleNetworkTerm(d,word.id);
 assert.deepEqual(d.networkTerms,[word.id]);
 assert.deepEqual(d.selected,{});
 const stored=validatedCheckin(d,{id,at,day});
 assert.deepEqual(stored.items,[]);
 assert.equal(stored.ownWords,'Ich bin gerade gestresst');
 assert.deepEqual(stored.networkTerms,[word.id]);
 assert.deepEqual(draftFromCheckin(stored).networkTerms,[word.id]);
 assert.match(feelingInsights([stored],day),/Ich bin gerade gestresst/);
 d=toggleNetworkTerm(d,word.id);assert.deepEqual(d.networkTerms,[]);
});
test('0.5.70.5 clicked classic emotion suggests root while preserving existing 1–10 slider',()=>{
 const term=EMOTION_NETWORK_TERMS.find(x=>x.word==='Gereizt');
 let d={...newFeelingDraft(),ownWords:'genervt'};
 d=toggleNetworkTerm(d,term.id);
 assert.equal(d.selected.anger,5);
 assert.equal(d.details.anger.family,'Reizung');
 const cleared=toggleNetworkTerm(d,term.id);assert.equal(cleared.selected.anger,undefined);assert.deepEqual(cleared.networkTerms,[]);
 const ui=feelingOverlay(d,[],{inputMode:'words'});
 assert.match(ui,/data-action="feeling-mode"/);
 assert.match(ui,/fw681-intensity-scale/);
 assert.match(ui,/fw705-network-graph/);
 assert.match(ui,/Genervt|Gereizt/);
});
test('0.5.70.5 unclassified raw phrase can be captured and restored after editing',()=>{
 const d={...newFeelingDraft(),ownWords:'Ich kann noch nicht genau benennen, was ich spüre'};
 const stored=validatedCheckin(d,{id,at,day});assert.deepEqual(stored.items,[]);
 assert.equal(draftFromCheckin(stored).ownWords,d.ownWords);
 assert.throws(()=>validatedCheckin(newFeelingDraft(),{id,at,day}),/mindestens ein Gefühl/);
 assert.throws(()=>validatedCheckin({...d,ownWords:'x'.repeat(501)},{id,at,day}),/500/);
});
test('0.5.70.5 HTML escapes untrusted original phrases and network terms are validated',()=>{
 const d={...newFeelingDraft(),ownWords:'<img src=x onerror=alert(1)>'};
 const html=feelingOverlay(d,[],{inputMode:'words'});
 assert.ok(!html.includes('<img'));
 assert.ok(html.includes('&lt;img'));
 assert.throws(()=>validatedCheckin({...d,networkTerms:['fake']},{id,at,day}),/Gefühlsbegriff/);
 const network=renderFeelingNetwork(d);assert.ok(!network.includes('<img'));
});
test('0.5.70.5 original slider vocabulary and unsweetened tea preset remain accessible',()=>{
 const d=chooseFeeling(newFeelingDraft(),'joy');const ui=feelingOverlay(d,[]);
 assert.match(ui,/Erfreut/);assert.match(ui,/Euphorisch/);
 assert.ok(FOOD_PRESETS.some(x=>x.id==='tea-unsweetened'&&x.title==='Tee ungesüßt'));
 assert.ok(FOOD_PRESETS.some(x=>x.id==='tea-honey'));
});
test('0.5.70.5 seamless mobile typing, sealed unlocked/locked capture and no new D1 migration',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 const vault=readFileSync(new URL('../client/src/vault.js',import.meta.url),'utf8');
 assert.match(main,/ownInput\.oninput/);assert.match(main,/results\.innerHTML=renderFeelingNetwork/);
 assert.match(main,/action==='feeling-network-term'/);
 assert.match(main,/vault\.appendSealedFeeling\(entry\)/);
 assert.match(vault,/String\(entry\.ownWords/);
 assert.match(main,/journalSyncPayload\(st\)/);
});
