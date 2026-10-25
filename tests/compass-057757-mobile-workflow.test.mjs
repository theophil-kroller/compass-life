import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { compass755Bridge } from '../client/compass755-bridge.js';
import { compass756Bridge } from '../client/compass756-bridge.js';
import { compass757Bridge } from '../client/compass757-bridge.js';

const prev=readFileSync(new URL('./compass-057755-lightning-fast.test.mjs',import.meta.url),'utf8');
const marker='const fixture=`', i=prev.indexOf(marker),j=prev.indexOf('`;\n\ntest(',i+marker.length);
assert.ok(i>=0&&j>i);
let original=Function('return '+prev.slice(i+'const fixture='.length,j+1))()
 .replace('function radarScreen(){return null;}', 'function radarScreen(){return null;}\nfunction todayScreen(){return chrome(`${calendarDeadlinePanel()}${occasionPanel()}${todayWork()}`);}');
let after56=compass756Bridge().transform(compass755Bridge().transform(original,'/repo/client/src/main.js').code,'/repo/client/src/main.js').code;
// Incorporate the real markup anchors from main.js which the narrower old tests omitted.
// This fixture proves the full post-bridge syntax and guards the all-important template escaping.
const chromeFixture=String.raw`
function compass57ChromeFixture(){return 
\`<nav class="side-nav calm-side-nav" aria-label="Hauptnavigation">
<button type="button" class="calm-group-toggle \${calmNavGroup==='plan'?'is-open':''}" data-action="calm-nav-group" data-id="plan">Planen</button>
<button type="button" class="calm-group-toggle \${calmNavGroup==='insights'?'is-open':''}" data-action="calm-nav-group" data-id="insights">Insights</button>
<button type="button" class="calm-group-toggle \${calmNavGroup==='finance'?'is-open':''}" data-action="calm-nav-group" data-id="finance">Finanzen</button>
<div class="utility-right"></div>\`;
}
function shoppingScreen(){
 return chrome(\`<div class="shopping713-shell"><section class="work-card shopping713-overview"><h2>🛒 Meine Einkaufslisten</h2><p class="muted-line">Aus deiner bearbeitbaren Vorlage entsteht bei jedem Einkauf eine neue, unabhängige Checkliste.</p><span class="muted-line">Die Vorlage wird beim Abhaken nicht verändert.</span></section></div>\`);
}
function compass57ActionFixture(action,id){if(action==='shopping713-select'){return;}}
`;
// unescape backticks and dollar signs in the source fixture
const fixture=chromeFixture.replaceAll('\\`','`').replaceAll('\\${','${');
after56 += '\n'+fixture;
const final=compass757Bridge().transform(after56,'/repo/client/src/main.js').code;

test('Vite configuration orders .57 after .56',()=>{
 const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(cfg,/compass756Bridge\(\), compass757Bridge\(\)\]/);
 assert.match(cfg,/import \{ compass757Bridge \}/);
});
test('all seven changes transform and resulting JavaScript parses',()=>{
 assert.match(final,/COMPASS_CLIENT_VERSION='0\.5\.77\.57\.1'/);
 const f=join(tmpdir(),`compass757-${process.pid}.mjs`);
 writeFileSync(f,final);
 try{execFileSync(process.execPath,['--check',f]);}finally{unlinkSync(f)}
});
test('Focus button is in toolbar and mobile header, never next to nav items',()=>{
 assert.equal(final.split('class="compass57-desktop-mode"').length-1,1);
 assert.equal(final.split('class="compass57-mobile-mode"').length-1,1);
 assert.match(final, /class="compass57-mobile-mode"[\s\S]{0,1000}<nav class="side-nav calm-side-nav"/);
 assert.match(final,/data-action="compass55-mode"/);
});
test('Touch, feelings and nutrition are visible in Focus while analysis nav stays gated',()=>{
 const css=readFileSync(new URL('../client/src/mobile-workflow-v57757.css',import.meta.url),'utf8');
 for(const name of ['t577-top-trigger','fw65-top-trigger','pj92-food-trigger'])assert.match(css,new RegExp(name));
 assert.match(css,/display:inline-flex!important/);
 assert.match(final,/compass55-extended-only/);
});
test('Shopping list is default and statistics are explicit second tab',()=>{
 assert.match(final,/let compass57ShoppingTab='list'/);
 assert.match(final,/if\(compass57ShoppingTab==='stats'\)return chrome\(compass57ShopStatistics\(\)\)/);
 assert.match(final,/data-action="compass57-shop-tab"/);
 assert.match(final, /if\(tab==='shopping'\)content=compass57ShopTabs\(\)\+content/);
 assert.match(final,/if\(action==='shopping713-select'\)/);
 assert.match(final,/data-action="smart49-open"/);
});
test('statistics never count transfers, refunds, ambiguous records, or a different month',()=>{
 const start=final.indexOf('let compass57ShoppingTab='),stop=final.indexOf('function shoppingScreen(){',start);
 const helper=final.slice(start,stop);
 const context={state:{financeTransactions:[
  {day:'2026-10-25',flow:'expense',category:'Lebensmittel / Supermarkt',amountCents:-1000},
  {day:'2026-10-25',flow:'expense',category:'Lebensmittel',amountCents:-200,needsReview:true},
  {day:'2026-10-25',flow:'transfer',category:'Lebensmittel',amountCents:-5000},
  {day:'2026-10-25',flow:'refund',category:'Lebensmittel',amountCents:700},
  {day:'2026-09-25',flow:'expense',category:'Lebensmittel',amountCents:-1000},
  {day:'2026-10-25',flow:'expense',category:'Freizeit',amountCents:-2500}
 ]},localDate:()=> '2026-10-25',h:String,ico:()=>''};
 vm.createContext(context);vm.runInContext(helper+'\nthis.markup=compass57ShopStatistics()',context);
 assert.match(context.markup,/(?:€\s*10,00|10,00\s*€)/);
 assert.match(context.markup,/1 zugeordnete Buchungen/);
});
test('archive, checkbox and editing behavior remain original',()=>{
 assert.match(final,/shopping713-check|shopping713-select/);
 assert.match(final,/compass55RefreshInspector/);
 assert.match(final,/compass56TodayWorkspace/);
});
