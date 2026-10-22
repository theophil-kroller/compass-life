import test from 'node:test';
import assert from 'node:assert/strict';
import {eventKey,validEvent,parseEventImport} from '../client/src/event-import.js';
import {groupCinemaScreenings,meaningfulFilmDescription} from '../client/src/cinema-program-v5772.js';
import {cinemaDayShift,cinemaForDay,cinemaEnrichmentPrompt,parseCinemaDetailsImport,isCinemaDetailsJSON,enrichCinemaEvent} from '../client/src/cinema-details-v5773.js';
const make=(title,date,venue,time,description='Kinovorführung.')=>({title,date,venue,startTime:time,category:'Kino',city:'Graz',country:'Österreich',sourceUrl:'https://kino.example.org/film',description});
test('generic cinema label is not treated as a film synopsis, but a real plot is',()=>{
 for(const s of ['Kinovorführung.','Programmkinovorführung.','Dokumentarfilm.','Originalfassung mit deutschen Untertiteln (OmU).','Kinder- und Familienfilm.','Kinofilm.'])assert.equal(meaningfulFilmDescription(s),'',s);
 const plot='Eine junge Forscherin sucht in den Alpen nach ihrem verschwundenen Vater. Auf ihrer Reise entdeckt sie eine lange verborgene Familiengeschichte.';
 assert.equal(meaningfulFilmDescription(plot),plot);
 const films=groupCinemaScreenings([make('Bergfilm','2026-10-23','KIZ','20:00','Kinovorführung.'),make('Bergfilm','2026-10-24','Annenhof','20:30',plot)]);
 assert.equal(films[0].description,plot);
});
test('film detail JSON matches existing title, no new screening, every original eventKey stays unchanged',()=>{
 const existing=[make('Atmosphere','2026-10-23','KIZ','20:00'),make('Atmosphere','2026-10-23','Schubert','19:30'),make('Alte Liebe','2026-10-24','KIZ','18:30')];
 const oldKeys=existing.map(eventKey);
 const raw=JSON.stringify({films:[{title:'Atmosphere',description:'Eine Dokumentation untersucht, wie moderne Gesellschaften den Wert von Natur und Reichtum bemessen und welche Konsequenzen sich daraus ergeben.',sourceUrl:'https://kino.example.org/synopsis',imageUrl:'https://kino.example.org/poster.jpg'}]});
 assert.equal(isCinemaDetailsJSON(raw),true);
 const preview=parseCinemaDetailsImport(raw,existing);
 assert.deepEqual([preview.kind,preview.entries.length,preview.affected,preview.unmatched],['film-details',1,2,0]);
 const enriched=existing.map(e=>enrichCinemaEvent(e,preview.entries[0],'2026-10-22T20:00:00.000Z'));
 assert.deepEqual(enriched.map(eventKey),oldKeys);
 assert.equal(enriched[0].synopsisSourceUrl,'https://kino.example.org/synopsis');
 assert.equal(enriched[1].imageUrl,'https://kino.example.org/poster.jpg');
 assert.equal(validEvent(enriched[0]),true);
 assert.equal(enriched[2].description,'Kinovorführung.');
 assert.equal(groupCinemaScreenings(enriched).find(f=>f.title==='Atmosphere').description,preview.entries[0].description);
});
test('rejects placeholder/invalid film texts, unsafe poster URL, bad source, duplicate and unmatched gracefully',()=>{
 const ex=[make('Film X','2026-10-23','KIZ','20:00')];
 const body=f=>JSON.stringify({films:[f]});
 assert.throws(()=>parseCinemaDetailsImport(body({title:'Film X',description:'Kinovorführung.',sourceUrl:'https://kino.example.org'}),ex),/Film 1/);
 assert.throws(()=>parseCinemaDetailsImport(body({title:'Film X',description:'Ein junger Mann erlebt einen unerwarteten Wandel seines Lebens.',sourceUrl:'http://kino.example.org'}),ex),/HTTPS/);
 assert.throws(()=>parseCinemaDetailsImport(body({title:'Film X',description:'Ein junger Mann erlebt einen unerwarteten Wandel seines Lebens.',sourceUrl:'https://kino.example.org',imageUrl:'javascript:alert(1)'}),ex),/Film 1/);
 assert.equal(parseCinemaDetailsImport(body({title:'Andere',description:'Ein echter Film über eine unerwartete Familiengeschichte.',sourceUrl:'https://kino.example.org'}),ex).unmatched,1);
});
test('film descriptions prompt targets only missing content/posters in bounded batches',()=>{
 const films=groupCinemaScreenings([make('Atmosphere','2026-10-23','KIZ','20:00'),make('Alte Liebe','2026-10-23','KIZ','20:00','Eine Familiengeschichte führt mehrere Generationen in einem Dorf zusammen.')]);
 const p=cinemaEnrichmentPrompt(films,0,1);
 assert.equal(p.count,1);assert.equal(p.next,1);assert.match(p.text,/Atmosphere/);assert.doesNotMatch(p.text,/Alte Liebe/);assert.match(p.text,/"films"/);assert.match(p.text,/KEINE neuen Vorstellungstermine/);
});
test('calendar day paging keeps film showings on selected day, stable across month boundary',()=>{
 const arr=[make('Atmosphere','2026-10-31','KIZ','19:00'),make('Atmosphere','2026-11-01','KIZ','20:00'),make('Alte Liebe','2026-11-01','KIZ','18:00')];
 assert.equal(cinemaDayShift('2026-10-31',1),'2026-11-01');assert.equal(cinemaDayShift('2026-11-01',-1),'2026-10-31');
 assert.equal(cinemaForDay(arr,'2026-10-31').length,1);assert.equal(groupCinemaScreenings(cinemaForDay(arr,'2026-11-01')).length,2);
});
test('legacy event JSON remains compatible and old screening keys are unchanged',()=>{
 const e=make('Atmosphere','2026-10-23','KIZ','20:00');
 const parsed=parseEventImport(JSON.stringify({researchGroup:'cinema-program',events:[e]}),[e]);
 assert.equal(parsed.added.length,0);assert.equal(parsed.refreshed.length,1);assert.equal(eventKey(e),eventKey(parsed.refreshed[0]));
});
