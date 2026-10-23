import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyPosterLookupResult,lookupPosterBatch,verifyPosterImage} from '../client/src/cinema-poster-lookup-v5774.js';

const candidate=(n)=>({key:`movie-${n}`,title:`Film ${n}`,matchedTitle:`Film ${n}`,imageUrl:`https://poster.example.org/${n}.jpg`,sourceUrl:`https://movie.example.org/${n}`});

test('Preview counts only browser-decodable poster URLs, not catalogue title matches',async()=>{
 const candidates=[1,2,3,4,5].map(candidate);
 const checked=[];
 const result=await verifyPosterLookupResult({suggestions:candidates,checked:12,unmatched:['7 unseen'],errors:[],hasMore:true,nextOffset:12},async url=>{
  checked.push(url);
  return /\/(?:3|4)\.jpg$/.test(url);
 },3);
 assert.equal(result.matched,5);
 assert.deepEqual(result.suggestions.map(x=>x.title),['Film 3','Film 4']);
 assert.deepEqual(result.unavailable.map(x=>x.title),['Film 1','Film 2','Film 5']);
 assert.equal(result.checked,12);
 assert.equal(result.hasMore,true);
 assert.equal(result.nextOffset,12);
 assert.equal(checked.length,5);
});

test('Poster validation rejects verifier exceptions, invalid links and empty batches gracefully',async()=>{
 const invalid={...candidate(2),imageUrl:'http://unsafe.example.org/img.jpg'};
 const a=await verifyPosterLookupResult({suggestions:[candidate(1),invalid]},async()=>{throw Error('blocked');});
 assert.equal(a.matched,2);assert.equal(a.suggestions.length,0);assert.equal(a.unavailable.length,2);
 const b=await verifyPosterLookupResult({suggestions:[],checked:12,unmatched:[],errors:[]});
 assert.equal(b.suggestions.length,0);assert.equal(b.matched,0);
});

test('Lookup marks continuation and end of batch correctly',async()=>{
 const films=Array.from({length:14},(_,i)=>({title:`Film ${i+1}`,imageUrl:''}));
 const fetcher=async()=>({ok:true,json:async()=>({metas:[]})});
 const first=await lookupPosterBatch(films,{fetcher,offset:0,batchSize:12});
 assert.equal(first.checked,12);assert.equal(first.hasMore,true);assert.equal(first.nextOffset,12);
 const last=await lookupPosterBatch(films,{fetcher,offset:first.nextOffset,batchSize:12});
 assert.equal(last.checked,2);assert.equal(last.hasMore,false);assert.equal(last.nextOffset,0);
});

test('UI shows only loadable posters and allows continuation / manual replacement',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/verifyPosterLookupResult\(candidateBatch,verifyPosterImage,4\)/);
 assert.match(main,/ladbare Poster von/);
 assert.match(main,/Treffer mit defektem oder blockiertem Bildlink/);
 assert.match(main,/discovery-poster-next/);
 assert.match(main,/data-poster-preview-key/);
 assert.match(main,/posterLookupSelected\.delete\(failed\.key\)/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.77\.(?:7|8|9)'/);
});
