import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {nutritionFocusDay4017,nutritionDotChart4017,nutritionWorkspace4017} from '../client/src/nutrition-focus-v577594017.js';
import {compass594017NutritionFocusRelease} from '../client/compass594017-nutrition-focus-release.js';
const day='2026-10-28';
const stamp=(h,m)=>new Date(2026,9,28,h,m).toISOString();
const state={nutritionJournal:{customFoods:[],entries:[
 {id:'a',foodId:'apple',amount:'1 Stück',at:stamp(8,15)},
 {id:'b',foodId:'water-glass',amount:'250 ml',at:stamp(9,30)},
 {id:'c',foodId:'apple',amount:'1 Stück',at:stamp(17,45)}
]}};
const renders={renderHistory:()=>'<div id="historic-chart">Original kcal Diagramm</div>',renderJournal:()=>'<div id="journal-editor">Tagebuch Editor</div>',renderManualDozen:()=>'<div id="manual-dozen">Manueller Daily Dozen</div>',renderSync:()=>'<div id="sync">Synchronisierung</div>',renderSection:kind=>`<div data-original="${kind}">Existing visual view</div>`};
test('today derives real event times, distinct drinks, and numeric kcal coverage',()=>{
 const m=nutritionFocusDay4017(state,day);
 assert.equal(m.entries.length,3);
 assert.equal(m.entries[0].time.getHours(),8);
 assert.equal(m.entries[1].kind,'drink');
 assert.equal(m.entries[1].kcal,0);
 assert.equal(m.unknown,0);
 assert.ok(m.high>=m.low);
 assert.equal(m.drinks,1);
});
test('daily plot is graphics-first, timestamp-true, no simulated data',()=>{
 const html=nutritionDotChart4017(nutritionFocusDay4017(state,day));
 assert.ok(html.includes('<svg'));
 assert.equal((html.match(/class="nf4017-dot"/g)||[]).length,3);
 assert.ok(html.includes('08:15'));assert.ok(html.includes('17:45'));
 const empty=nutritionDotChart4017(nutritionFocusDay4017({nutritionJournal:{entries:[]}},day));
 assert.equal((empty.match(/class="nf4017-dot"/g)||[]).length,0);
 assert.ok(empty.includes('noch keine'));
});
test('home has exactly four main options; active graphical timeline precedes numerical summary',()=>{
 const html=nutritionWorkspace4017(state,{day,view:'journal',...renders});
 assert.ok(html.indexOf('nf4017-plot')<html.indexOf('nf4017-summary'));
 assert.equal((html.match(/class="nf4017-nav"/g)||[]).length,1);
 assert.ok(html.indexOf('data-id="daily-dozen"')>=0);
 assert.ok(html.includes('Original kcal Diagramm')&&html.includes('Tagebuch Editor'));
 assert.ok(html.includes('id="sync"'));
 assert.ok(!html.includes('data-original="daily-dozen"'));
});
test('daily dozen kept, manual edit accessible, advanced chart views kept under trends',()=>{
 const daily=nutritionWorkspace4017(state,{day,view:'daily-dozen',...renders});
 assert.ok(daily.includes('data-original="daily-dozen"'));
 assert.ok(daily.includes('id="manual-dozen"'));
 for(const view of ['timing','trends','connections','fats','anti-aging','phyto']){
  const h=nutritionWorkspace4017(state,{day,view,...renders});
  assert.ok(h.includes(`data-original="${view}"`));
  assert.ok(h.includes('nf4017-subnav'));
 }
});
test('food editing opens expanded journal and synced view remains available',()=>{
 const html=nutritionWorkspace4017(state,{day,view:'journal',editingId:'a',...renders});
 assert.match(html,/<details class="nf4017-detail" open>/);
 assert.ok(html.includes('data-action="pj92-food-open"'));
});
test('guarded transform changes versions, removes global Daily Dozen preface, retains existing views',async()=>{
 const root=fileURLToPath(new URL('../',import.meta.url));
 const source=readFileSync(join(root,'client/src/main.js'),'utf8');
 const config=readFileSync(join(root,'client/vite.config.js'),'utf8');
 const imports=new Map([...config.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.*?)'/g)].map(m=>[m[1],m[2]]));
 const factories=[...config.matchAll(/\b(\w+)\(\)/g)].map(m=>m[1]).filter(name=>imports.has(name));
 let transformed=source;
 for(const factory of factories){
  const mod=await import(pathToFileURL(join(root,'client',imports.get(factory))).href);
  const plugin=mod[factory]();
  const result=await plugin.transform?.(transformed,join(root,'client/src/main.js'));
  if(result?.code)transformed=result.code;
 }
 assert.ok(transformed.includes("const COMPASS_CLIENT_VERSION='0.5.77.59.40.25.4'"));
 assert.ok(transformed.includes('nutritionWorkspace4017(state'));
 assert.ok(!transformed.includes("return chrome((compass55Mode==='extended'&&insightTab==='nutrition'?dailyDozen5930View"));
 assert.ok(transformed.includes("kind==='fats'?nutritionFatView"));
 assert.ok(transformed.includes("kind==='phyto'?nutritionPhytoView"));
 assert.ok(source.includes("const COMPASS_CLIENT_VERSION='0.5.77.26'"));
 assert.equal(typeof compass594017NutritionFocusRelease().transform,'function');
});
