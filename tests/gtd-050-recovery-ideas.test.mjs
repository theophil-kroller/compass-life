import test from 'node:test';
import assert from 'node:assert/strict';
import {allRecoveryIdeas,scoreRecoveryIdeas,recoveryWeather,validRecoveryIdea} from '../client/src/recovery-ideas.js';
test('Personal ideas support weather, time, energy, distance without creating tasks',()=>{
 const all=allRecoveryIdeas({});
 assert.ok(all.length>=8);
 assert.ok(all.some(x=>x.emoji==='🥷'));
 const quick=scoreRecoveryIdeas(all,{weather:'rain',minutes:60,energy:'low',range:'near'});
 assert.ok(quick.length>0);
 assert.ok(quick.every(x=>x.minutes<=60 && x.energy==='low' && (x.weather==='rain'||x.weather==='any')));
 assert.equal(recoveryWeather('Regen'), 'rain');
 assert.equal(recoveryWeather('Sonnenschein'),'sun');
 assert.equal(recoveryWeather(''),'unknown');
});
test('Ideas are validated, local additions are visible, removing starters does not change defaults',()=>{
 const x={id:'idea-55f52c65-39ea-4534-9a7d-3ee854486370',title:'Abends ins Theater',emoji:'🎭',weather:'rain',energy:'medium',minutes:150,range:'near'};
 assert.ok(validRecoveryIdea(x));
 assert.ok(!validRecoveryIdea({...x,title:'',minutes:-3}));
 const customized=allRecoveryIdeas({recoveryIdeas:[x],hiddenStarterIdeas:['starter-sauna']});
 assert.ok(customized.some(i=>i.title==='Abends ins Theater'));
 assert.ok(!customized.some(i=>i.id==='starter-sauna'));
 assert.ok(allRecoveryIdeas({}).some(i=>i.id==='starter-sauna'));
});
