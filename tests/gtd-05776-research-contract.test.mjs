import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseEventImport,parseResearchJson,repairResearchJsonEscapes,EVENT_CATEGORIES} from '../client/src/event-import.js';
import {isCinemaDetailsJSON,parseCinemaDetailsImport} from '../client/src/cinema-details-v5773.js';
import {DISCOVERY_RESEARCH_BUTTONS,researchPrompt} from '../client/src/discovery-research-v577.js';

const caseEvent=(category,extra={})=>({title:`Testereignis ${category}`,date:'2026-12-06',city:'Graz',country:'Österreich',venue:'Kulturhaus',category,description:'Ein nachweislich angekündigtes Veranstaltungsformat.',sourceUrl:'https://quelle.example.org/programm',...extra});

const urlMistakes=(s)=>s.replaceAll('https://','https\\://').replaceAll('.example.','\\.example\\.').replaceAll('_','\\_');

test('all ten prompt buttons generate schemas accepted by the exact shared importer',()=>{
 assert.equal(DISCOVERY_RESEARCH_BUTTONS.length,10);
 for(const button of DISCOVERY_RESEARCH_BUTTONS){
  const prompt=researchPrompt(button.id,EVENT_CATEGORIES);
  assert.match(prompt,/"researchGroup"/);
  assert.match(prompt,/"events"/);
  assert.match(prompt,/Pflichtfeld date/);
  assert.match(prompt,/KEINE Backslashes/);
  const categories={
   'cinema-program':'Kino','cinema-cabaret':'Kabarett','music':'Musical',stage:'Oper',dance:'Kizomba',arts:'Ausstellung',spectator:'Basketball',active:'Bujinkan',winter:'Langlaufen',alternative:'Körperarbeit'
  };
  const example=caseEvent(categories[button.id]);
  const r=parseEventImport(JSON.stringify({researchGroup:button.id,events:[example]}));
  assert.equal(r.added.length,1,button.id);
  assert.equal(r.researchGroup,button.id);
 }
});

test('AI escaped URLs are repaired inside JSON strings without corrupting JSON syntax or legitimate escapes',()=>{
 const obj={researchGroup:'arts',events:[caseEvent('Ausstellung',{
  title:'Werk in Wien – „_Fragmente“',
  description:'Originaltext: "Zitat", richtiges Umlaut-Zeichen, \\n bleibt sichtbar.',
  sourceUrl:'https://museum.example.org/kunst/projekt_nov2026?lang=de&tag=blueme'
 })]};
 const raw=urlMistakes(JSON.stringify(obj));
 assert.throws(()=>JSON.parse(raw));
 const parsed=parseEventImport(raw);
 assert.equal(parsed.added[0].sourceUrl,obj.events[0].sourceUrl);
 assert.equal(parsed.added[0].title,obj.events[0].title);
 assert.equal(parsed.added[0].description,obj.events[0].description);
 const code='{"events":[{"bad":"https\\://a\\.b\\_c.com"}]}';
 assert.doesNotThrow(()=>JSON.parse(repairResearchJsonEscapes(code)));
});

test('museum and winter season alternative date keys are accepted',()=>{
 const raw=JSON.stringify({researchGroup:'arts',events:[{
  ...caseEvent('Ausstellung',{endDate:'2027-02-03'}),date:undefined,startDate:'2026-11-01'
 }]});
 const r=parseEventImport(raw);
 assert.equal(r.added.length,1);
 assert.equal(r.added[0].date,'2026-11-01');
 assert.equal(r.added[0].endDate,'2027-02-03');
 const season=parseEventImport(JSON.stringify({researchGroup:'winter',events:[{
  ...caseEvent('Langlaufen'),date:undefined,start_date:'2026-12-01',end_date:'2027-02-20'
 }]}));
 assert.equal(season.added[0].date,'2026-12-01');
 assert.equal(season.added[0].endDate,'2027-02-20');
});

test('film enrichment JSON routes through the same tolerant parser',()=>{
 const existing=[caseEvent('Kino',{title:'Die kleine Reise',date:'2026-11-23',venue:'Kino A',startTime:'18:00'})];
 const raw=urlMistakes(JSON.stringify({films:[{
  title:'Die kleine Reise', description:'Eine Reise über Berge und Täler mit unerwarteten Wendungen.',
  sourceUrl:'https://film.example.org/press/info',imageUrl:'https://film.example.org/media/poster_01.jpg'
 }]}));
 assert.equal(isCinemaDetailsJSON(raw),true);
 const result=parseCinemaDetailsImport(raw,existing);
 assert.equal(result.kind,'film-details');
 assert.equal(result.entries.length,1);
 assert.equal(result.entries[0].imageUrl,'https://film.example.org/media/poster_01.jpg');
});

test('malformed JSON and invalid field names fail transparently with specific feedback',()=>{
 assert.throws(()=>parseEventImport('{"events":[{"title":"x","sourceUrl":"https\\://bad.example.org"'),/JSON-Syntaxfehler/);
 assert.throws(()=>parseEventImport(JSON.stringify({events:[caseEvent('Opera')]})),/Eintrag 1.*Kategorie/);
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/discoveryImportDraft=String\(new FormData\(discoveryForm\)/);
 assert.match(main,/discoveryImportError=String\(ex.message\|\|ex\)/);
 assert.match(main,/id="discovery-import-feedback"/);
 assert.match(main,/role="alert"/);
 assert.match(main,/\$\{h\(discoveryImportDraft\)\}<\/textarea>/);
 assert.match(main,/COMPASS_CLIENT_VERSION='0\.5\.\d+(?:\.\d+)*'/);
});
