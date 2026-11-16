import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {tasksForDay} from '../client/src/tasks.js';
import {parseMensaJSON,cleanMensaJsonInput} from '../client/src/mensa-catalog-v57759402512.js';

const task=(id,dueDate,extras={})=>({id,title:id,dueDate,completed:false,archived:false,...extras});
test('Heute retains open overdue weekend deadlines until completion, postponement or removal',()=>{
 const today='2026-11-16';
 const state={tasks:{weekend:task('weekend','2026-11-14'),monday:task('monday',today),done:task('done','2026-11-15',{completed:true}),archived:task('archived','2026-11-14',{archived:true}),next:task('next','2026-11-20')}};
 assert.deepEqual(tasksForDay(state,today).map(t=>t.id),['monday']);
 assert.deepEqual(tasksForDay(state,today,{includeOverdue:true}).map(t=>t.id),['weekend','monday']);
 assert.deepEqual(tasksForDay(state,'2026-11-15',{includeOverdue:false}).map(t=>t.id),['done']);
 state.tasks.weekend.dueDate='2026-11-20';
 assert.deepEqual(tasksForDay(state,today,{includeOverdue:true}).map(t=>t.id),['monday']);
 state.tasks.weekend.dueDate='2026-11-14';state.tasks.weekend.completed=true;
 assert.deepEqual(tasksForDay(state,today,{includeOverdue:true}).map(t=>t.id),['monday']);
 delete state.tasks.weekend;
 assert.deepEqual(tasksForDay(state,today,{includeOverdue:true}).map(t=>t.id),['monday']);
});
const entry={menuDate:'2026-11-16',title:'Frühlingsrolle',venueId:'mensa-tu-graz-stremayrgasse',timezone:'Europe/Vienna',menuStatus:'confirmed_from_published_menu',evidence:{sourceType:'user_provided_official_menu_screenshot',sourceUrl:null,sourceClaimsOnly:'Originalmenü per Screenshot'},nutrientEstimates:{energyKcal:{min:520,max:870,confidence:'low'},protein:{min:12,max:23,confidence:'low'}}};
test('Mensa parser accepts GPT rich-text copy artifacts and does not invent a source URL',()=>{
 const data=JSON.stringify({format:'compass-mensa-catalog-v1',entries:[entry]},null,2);
 const rich=data.split('\n').map((line,i)=>'&#x20;'+line+(i<data.split('\n').length-1?'\\':'')).join('\n');
 const parsed=parseMensaJSON(rich);
 assert.equal(parsed.length,1);
 assert.equal(parsed[0].title,'Frühlingsrolle');
 assert.equal(parsed[0].menuStatus,'estimated_from_source');
 assert.equal(parsed[0].evidence.sourceUrl,'');
 assert.equal(parsed[0].nutrientEstimates.energyKcal.max,870);
});
test('Mensa parser accepts fenced JSON and preserves properly escaped quotes',()=>{
 const row={...entry,description:'Mit Text „Der Code zum Jungbleiben"',evidence:{sourceType:'official_menu',sourceUrl:'https://example.org/menu'},menuStatus:'confirmed_from_published_menu'};
 const raw='Antwort:\n```json\n'+JSON.stringify({entries:[row]},null,2)+'\n```';
 assert.equal(parseMensaJSON(raw)[0].description,row.description);
 assert.equal(cleanMensaJsonInput(raw).startsWith('{'),true);
});
test('Unverifiable online menu without user screenshot remains rejected',()=>{
 const row={...entry,evidence:{sourceType:'official_menu',sourceUrl:null}};
 assert.throws(()=>parseMensaJSON(JSON.stringify({entries:[row]})),/prüfbaren HTTPS-Quellenlink/);
});
test('Today mensa button explicitly switches Focus to Extended before opening Insights, without eager menu import',()=>{
 const src=readFileSync(new URL('../client/src/main-full-v57759402510.js',import.meta.url),'utf8');
 const start=src.indexOf("if(action==='mensa-open-insights')");
 assert.ok(start>0);
 const block=src.slice(start,start+480);
 assert.ok(block.indexOf("compass55Mode='extended'")>0);
 assert.ok(block.indexOf("compass55Mode='extended'")<block.indexOf("tab='insights'"));
 assert.ok(block.indexOf("tab='insights'")<block.indexOf('render();return;'));
 assert.doesNotMatch(block,/import\(|ensureMensaForNutrition/);
});
