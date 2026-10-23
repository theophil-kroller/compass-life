import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {eventKey,parseEventImport} from '../client/src/event-import.js';
import {eventState,queueEvent,removeCinemaEvents,isCinemaEvent,pendingEventBatch,acknowledgeEventBatch,prunePastEvents} from '../client/src/event-sync.js';
import {researchPrompt} from '../client/src/discovery-research-v577.js';
const event=(title,category,date='2026-10-25',time='19:00')=>({title,category,date,startTime:time,venue:'Spielstätte '+category,city:'Graz',country:'Österreich',sourceUrl:'https://events.example.org/official'});
test('Scoped cinema deletion deletes only Kino and Filmfestival; cabaret/dance/workshops unaffected',()=>{
 const movies=[event('Atmosphere','Kino'),event('Atmosphere','Kino','2026-10-26'),event('Mountainfilm','Filmfestival')];
 const others=[event('Comedy-Show','Kabarett'),event('Konzert','Konzert'),event('Zouk-Workshop','Zouk'),event('ISTA Retreat','Tantra'),event('Bujinkan Camp','Bujinkan')];
 const [savedMovie,otherSaved]=[eventKey(movies[0]),eventKey(others[0])];
 const state=eventState({discoveredEvents:[...movies,...others],eventPreferences:{[savedMovie]:'saved',[otherSaved]:'saved'},eventVersions:{[savedMovie]:3,[otherSaved]:2}});
 const result=removeCinemaEvents(state);
 assert.deepEqual(result,{removed:3,saved:1});
 assert.deepEqual(state.discoveredEvents,others);
 assert.equal(state.eventPreferences[savedMovie],undefined);
 assert.equal(state.eventPreferences[otherSaved],'saved');
 for(const film of movies){const k=eventKey(film);assert.equal(state.eventDeleted[k],true);assert.equal(state.eventPending[k],true);}
 for(const other of others){const k=eventKey(other);assert.equal(state.eventDeleted[k],undefined);assert.equal(state.eventPending[k],undefined);}
 const next=pendingEventBatch(state);
 assert.equal(next.length,3);assert.ok(next.every(x=>x.removed===true&&x.event===null));
 assert.equal(removeCinemaEvents(state).removed,0);
 });
test('Scoped deletion generates durable versioned tombstones and lets fresh kino JSON re-import',()=>{
 const film=event('Originalfilm','Kino'), other=event('Musical','Musical');
 const s=eventState({discoveredEvents:[film,other],eventVersions:{[eventKey(film)]:1}});
 removeCinemaEvents(s);
 const b=pendingEventBatch(s);assert.equal(b.length,1);assert.equal(b[0].baseVersion,1);
 acknowledgeEventBatch(s,b,{results:[{key:eventKey(film),status:'applied',version:2}]});
 assert.equal(s.eventVersions[eventKey(film)],2);assert.equal(s.eventPending[eventKey(film)],undefined);
 const raw=JSON.stringify({researchGroup:'cinema-program',events:[{...film,description:'Ein Filmemacher untersucht die Konflikte einer Familie und ihre ungewöhnliche Reise durch das Gebirge.',imageUrl:'https://cdn.example.org/poster.jpg'}]});
 const parsed=parseEventImport(raw,s.discoveredEvents);
 assert.equal(parsed.added.length,1);assert.equal(parsed.added[0].imageUrl,'https://cdn.example.org/poster.jpg');
 queueEvent(s,parsed.added[0]);
 assert.equal(s.eventDeleted[eventKey(film)],undefined);assert.equal(s.eventPending[eventKey(film)],true);
 assert.equal(s.discoveredEvents.length,2);assert.deepEqual(s.discoveredEvents.find(x=>x.title==='Musical'),other);
});
test('Explicit cinema reset resolves cloud conflicts in favor of deliberate deletion',()=>{
 const film=event('Movie with conflict','Kino');const k=eventKey(film);
 const s=eventState({discoveredEvents:[film],eventVersions:{[k]:1},eventConflicts:{[k]:{remote:{version:5,event:film,status:'saved'}}}});
 removeCinemaEvents(s);
 assert.equal(s.eventConflicts[k],undefined);
 assert.equal(pendingEventBatch(s).length,1);
 assert.equal(pendingEventBatch(s)[0].baseVersion,5);
});
test('Cinema expires seven days after event; other areas use existing 14 day rule; saved remain',()=>{
 const cinema=event('Old movie','Kino','2026-10-13');
 const concert=event('Old concert','Konzert','2026-10-13');
 const saved=event('Saved film','Kino','2026-10-10');
 const s=eventState({discoveredEvents:[cinema,concert,saved],eventPreferences:{[eventKey(saved)]:'saved'}});
 assert.equal(prunePastEvents(s,'2026-10-22'),1);
 assert.deepEqual(s.discoveredEvents.map(x=>x.title),['Old concert','Saved film']);
 assert.equal(isCinemaEvent(saved),true);
});
test('UI exposes separate destructive cinema action and research prompt requests posters for each film',()=>{
 const src=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(src,/data-action="discovery-clear-cinema"/);
 assert.match(src,/removeCinemaEvents\(st\)/);
 assert.match(src,/Film-Metadaten prüfen/);
 assert.match(src,/Kein Film-Posterlink im importierten JSON/);
 assert.match(src,/COMPASS_CLIENT_VERSION='0\.5\.77\.(?:7|8|9|10)'/);
 const p=researchPrompt('cinema-program',['Kino','Filmfestival']);
 assert.match(p,/Wiederhole die verifizierte Inhaltsangabe/);
 assert.match(p,/Posterlink bei jeder Vorführung/);
});
