import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {discoveryDisplayDay412,discoveryOverlaps412,discoveryOngoingLabel412} from '../client/src/discovery-current-day-v577594012.js';
import {upcomingImportedEvents,eventKey} from '../client/src/event-import.js';
import {eventState,prunePastEvents,pendingEventBatch} from '../client/src/event-sync.js';

const exhibition={title:'(RE)NEW Part II',date:'2026-10-23',endDate:'2026-11-02',category:'Ausstellung',city:'Graz',venue:'esc medien kunst labor',sourceUrl:'https://example.org/exhibition'};
const screening={title:'Ein Film',date:'2026-10-27',category:'Kino',city:'Graz',venue:'Kino',sourceUrl:'https://example.org/cinema'};
const oldConcert={title:'Konzert',date:'2026-10-22',category:'Konzert',city:'Wien',venue:'Saal',sourceUrl:'https://example.org/concert'};

test('running multi-day exhibitions appear under today; source date and event identity stay unchanged',()=>{
 const today='2026-10-28',original=structuredClone(exhibition),key=eventKey(exhibition);
 assert.equal(discoveryDisplayDay412(exhibition,today),today);
 assert.equal(discoveryOverlaps412(exhibition,today,today),true);
 assert.match(discoveryOngoingLabel412(exhibition,today),/seit 23\.10\.2026 · bis 02\.11\.2026/);
 assert.deepEqual(exhibition,original);assert.equal(eventKey(exhibition),key);
 assert.equal(discoveryDisplayDay412(exhibition,'2026-10-22'),'2026-10-23');
 assert.equal(discoveryOverlaps412(exhibition,'2026-11-03','2026-11-10'),false);
});
test('true expired events are never shown as upcoming, ongoing events are',()=>{
 const list=upcomingImportedEvents([oldConcert,screening,exhibition],'2026-10-28');
 assert.equal(list.length,1);assert.equal(list[0].title,exhibition.title);
 assert.equal(discoveryOngoingLabel412(screening,'2026-10-28'),'');
});
test('new immediate cleanup removes stale unsaved cinema and other events with cloud tombstones',()=>{
 const s=eventState({discoveredEvents:[oldConcert,screening,exhibition]});
 assert.equal(prunePastEvents(s,'2026-10-28',0,0),2);
 assert.deepEqual(s.discoveredEvents,[exhibition]);
 assert.equal(s.eventDeleted[eventKey(oldConcert)],true);
 assert.equal(s.eventDeleted[eventKey(screening)],true);
 assert.equal(pendingEventBatch(s).length,2);
});
test('saved events remain as private shortlist, even after expiration, but are excluded from upcoming list',()=>{
 const s=eventState({discoveredEvents:[oldConcert]});s.eventPreferences[eventKey(oldConcert)]='saved';
 assert.equal(prunePastEvents(s,'2026-10-28',0,0),0);
 assert.equal(upcomingImportedEvents(s.discoveredEvents,'2026-10-28').length,0);
});
test('the final build keeps watch logic and positions pin at right edge',()=>{
 const c=readFileSync(new URL('../client/src/compass-workspace-v57759409.css',import.meta.url),'utf8');
 assert.match(c,/\.ctx42-date-row\{display:flex;width:100%/);
 assert.match(c,/\.ctx42-date-row \.ctx46-pair\{margin-left:auto!important/);
 const src=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(src,/discoveryDisplayDay412\(e,today\)/);
 assert.match(src,/colleaguesForWatch/);
});
