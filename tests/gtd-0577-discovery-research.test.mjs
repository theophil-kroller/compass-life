import test from 'node:test';
import assert from 'node:assert/strict';
import {DISCOVERY_FILTER_GROUPS,DISCOVERY_RESEARCH_BUTTONS,researchPrompt,researchButton,groupForEvent,formatResearchDate} from '../client/src/discovery-research-v577.js';
test('all requested categories and sources are present',()=>{
 assert.ok(DISCOVERY_RESEARCH_BUTTONS.length>=10);
 assert.equal(DISCOVERY_RESEARCH_BUTTONS.filter(x=>x.id==='cinema-program').length,1);
 assert.equal(new Set(DISCOVERY_FILTER_GROUPS.map(x=>x.id)).size,DISCOVERY_FILTER_GROUPS.length);
 assert.equal(groupForEvent({category:'Kizomba'}),'dance');
 assert.equal(groupForEvent({category:'Shibari'}),'alternative');
 assert.equal(groupForEvent({category:'Kino'}),'cinema');
 assert.match(researchPrompt('alternative',['Workshop','Shibari']),/seminare-cesta\.com/);
 assert.match(researchPrompt('alternative',['Workshop','Shibari']),/ISTA/);
 assert.match(researchPrompt('cinema-program',['Kino']),/VOLLSTÄNDIGE/);
 assert.match(researchPrompt('stage',['Oper','Theater']),/Wien/);
 assert.match(researchPrompt('dance',['Zouk','Kizomba']),/europaweit/);
 assert.ok(researchButton('winter'));
 assert.equal(formatResearchDate('nope'),'Noch kein Import');
});

import {parseEventImport,eventKey,validEvent} from '../client/src/event-import.js';
const film=(venue,time)=>({title:'Dokumentarfilm über Bergsport',date:'2026-11-05',startTime:time,city:'Graz',country:'Österreich',venue,category:'Kino',sourceUrl:'https://kino.example.org/programm'});
test('cinema showtimes keep venue and start time distinct without changing legacy keys',()=>{
 const a=film('KIZ','18:00'),b=film('Annenhof','18:00'),c=film('KIZ','20:30');
 assert.equal(new Set([eventKey(a),eventKey(b),eventKey(c)]).size,3);
 const old={...a};delete old.startTime;
 assert.equal(eventKey(old),'dokumentarfilm über bergsport|2026-11-05|graz');
 assert.ok(validEvent(a));assert.ok(!validEvent({...a,startTime:'25:99'}));
 const result=parseEventImport(JSON.stringify({researchGroup:'cinema-program',events:[a,b,c]}));
 assert.equal(result.added.length,3);assert.equal(result.researchGroup,'cinema-program');
 const again=parseEventImport(JSON.stringify({researchGroup:'cinema-program',events:[a,b,c]}),result.added);
 assert.equal(again.added.length,0);assert.equal(again.refreshed.length,3);assert.equal(again.duplicates,3);
});
