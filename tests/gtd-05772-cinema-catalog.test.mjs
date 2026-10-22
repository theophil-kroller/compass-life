import test from 'node:test';
import assert from 'node:assert/strict';
import {groupCinemaScreenings,cinemaOverview,cinemaCoverageWarning,cinemaSearch,cinemaFilmKey} from '../client/src/cinema-program-v5772.js';
const screening=(title,date,venue,time,category='Kino')=>({title,date,venue,startTime:time,category,city:'Graz'});
test('films group across cinema, day, time while preserving every screening',()=>{
 const inputs=[screening('Atmosphere','2026-10-23','KIZ','20:00'),screening('Atmosphere','2026-10-22','Schubertkino','18:00'),screening(' ATMOSPHERE ','2026-10-23','Schubertkino','17:00'),screening('Alte Liebe','2026-10-22','KIZ','19:00')];
 const films=groupCinemaScreenings(inputs);
 assert.equal(films.length,2);assert.equal(films[1].screenings.length,3);
 assert.equal(films[1].screenings[0].date,'2026-10-22');
 assert.equal(films[1].venues.length,2);
 assert.equal(inputs[0].title,'Atmosphere');
 assert.deepEqual(cinemaOverview(inputs),{titles:2,screenings:4,venues:2,otherEvents:0});
 assert.equal(cinemaSearch(films,'schubertkino').length,1);
 assert.equal(cinemaSearch(films,'alter').length,0);
 assert.equal(cinemaFilmKey('Atmosphere '),cinemaFilmKey('ATMOSPHERE'));
});
test('events that are not cinema stay out, even with same title',()=>{
 const r=groupCinemaScreenings([screening('Jazz','2026-10-23','Theater','20:00','Konzert'),screening('Jazz','2026-10-23','KIZ','22:00','Filmfestival')]);
 assert.equal(r.length,1);assert.equal(r[0].screenings.length,1);
});
test('huge JSON containing only two films produces a useful coverage warning',()=>{
 const many=Array.from({length:245},(_,i)=>screening(i%2?'Alte Liebe':'Atmosphere','2026-10-23','KIZ',i%2?'17:30':'20:00'));
 const d=cinemaOverview(many);
 assert.equal(d.titles,2);assert.equal(d.screenings,245);
 assert.match(cinemaCoverageWarning(d),/nur 2 verschiedene Filmtitel/);
 assert.equal(cinemaCoverageWarning({titles:50,screenings:245}), '');
});
