import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {compass750Bridge} from '../client/compass750-bridge.js';
import {
 INSIGHTS750_GROUPS, INSIGHTS750_EXTERNAL, insights750Allowed, insights750GroupFor,
 insights750Sidebar,insights750PrimaryTabs,insights750Subtabs,insights750Cockpit
} from '../client/src/insights-navigation-v57750.js';

const ico=(name)=>`<svg>${name}</svg>`;
test('Five discoverable groups with unique, complete routes; previous insights preserved',()=>{
 assert.equal(INSIGHTS750_GROUPS.length,5);
 const ids=INSIGHTS750_GROUPS.flatMap(g=>g.tabs.map(([id])=>id));
 assert.equal(ids.length,new Set(ids).size);
 for(const required of ['weekly','capacity','balance','connections','explore','sleep','energy','stress','body','strength','nutrition','activity','feelings','touch','dreamworld','places','recovery','worktime','timejournal','focus','habits','progress','sources'])assert.ok(insights750Allowed(required),required);
 assert.ok(!insights750Allowed('<svg>'));assert.equal(insights750GroupFor('insights','capacity').id,'intelligence');
 assert.equal(insights750GroupFor('activity','sleep').id,'health');
 assert.equal(insights750GroupFor('recovery','weekly').id,'life');
 assert.equal(insights750GroupFor('progress','body').id,'time');
 assert.deepEqual([...INSIGHTS750_EXTERNAL].sort(),['activity','progress','recovery']);
});
test('Sidebar is five items, active route gets focus, sub-navigation includes both work views',()=>{
 const html=insights750Sidebar('insights','weekly',ico);
 assert.equal((html.match(/data-action="ins750-group"/g)||[]).length,5);
 assert.match(html,/Übersicht &amp; Intelligence/);
 assert.match(html,/Gesundheit &amp; Körper/);
 assert.doesNotMatch(html,/data-action="calm-insight-view"/);
 assert.match(insights750Sidebar('activity','weekly',ico),/ins750-side-item is-active[^>]*data-id="health"/);
 const tabs=insights750Subtabs('insights','timejournal');
 assert.match(tabs,/data-id="worktime"/);assert.match(tabs,/data-id="timejournal"/);
 assert.match(tabs,/data-id="progress"/);
 assert.match(insights750Subtabs('insights','places'),/Orte &amp; Weltkarte/);
 assert.equal(insights750Subtabs('insights','sources'),'');
 const mobile=insights750PrimaryTabs('insights','nutrition',ico);
 assert.equal((mobile.match(/ins750-primary/g)||[]).length,5);
});
test('Cockpit is read-only, escapes user data and distinguishes observed from missing values',()=>{
 const state={healthImports:{garminNights:[{day:'2026-10-23',totals:{deep:50}}],fitdays:[{day:'2026-10-23',at:'2026-10-23T08:00:00Z',weightKg:82.4}]},tasks:{a:{id:'a',title:'<img src=x onerror=alert(1)>',dueDate:'2026-10-25'}}};
 const snapshot=JSON.stringify(state);
 const html=insights750Cockpit(state,{today:'2026-10-24'});
 assert.match(html,/1\/7 Nächte/);assert.match(html,/82,4 kg/);assert.match(html,/1 anstehend/);
 assert.doesNotMatch(html,/<img src=/);assert.equal(JSON.stringify(state),snapshot);
 const missing=insights750Cockpit({}, {today:'2026-10-24'});
 assert.match(missing,/Noch kein Fitdays-Gewicht/);assert.match(missing,/0\/7 Nächte/);
});

// Representative .49.1-generated main.js anchors, including older sidebar edits.
const fixture = [
 "import './body-transformation-v57749.css';",
 "const COMPASS_CLIENT_VERSION='0.5.77.49.1';",
 "let sleepMemo={data:null,period:'',today:'',value:null};",
 'function chrome(content){return `<div class="calm-nav-group">',
 '${calmNavGroup===\'insights\'?`<div class="calm-subitems" id="calm-nav-insights">',
 '<button type="button" class="calm-mobile-nav-back" data-action="calm-nav-group" data-id="insights">${ico(\'arrow\',15)}<span>Menü</span></button>',
 '<button type="button" class="nav-item" data-action="calm-insight-view" data-id="feelings">Gefühle</button>',
 '<button type="button" class="nav-item" data-action="calm-insight-view" data-id="weekly">Wochenkompass</button>',
 ' </div>`:\'\'}',
 ' </div>',
 ' <div class="calm-nav-group">Finanzen</div></div>`;}',
 'function insightsScreen(){',
 "const tabDef=insightTab==='capacity'?{label:'Fristen'}:null;",
 "const compactInsights=[['weekly','Wochenkompass','calendar']];",
 'const tabs=compactInsights.map(([id,label,icon])=>`<button data-action="insights-tab" data-id="${id}">${ico(icon,16)}${label}</button>`).join(\'\');',
 'const healthChoices=healthMode?`<div>Gesundheit</div>`:\'\';',
 "const content=insightTab==='capacity'?capacityGuardianView(state):foo;",
 'return chrome(`<div class="insight-workspace">',
 '<div class="calm-insight-toolbar"><nav class="calm-insights-nav">${tabs}</nav></div>',
 ' <div class="insight-view-header ${insightTab===\'sources\'?\'insight-source-heading\':\'\'}">${healthChoices}</div>',
 '${content}</div>`);',
 '}',
 'async function action(action,id){',
 "if(action==='calm-nav-group'){return;}",
 '}',
].join('\n');
test('Guarded Vite integration transforms .49.1 markup in correct order and JS parses',()=>{
 const bridge=compass750Bridge();const out=bridge.transform(fixture,'/repo/client/src/main.js').code;
 assert.match(out,/COMPASS_CLIENT_VERSION='0\.5\.77\.50'/);
 assert.match(out,/insights750Sidebar\(tab,insightTab,ico\)/);
 assert.match(out,/insights750PrimaryTabs\(tab,insightTab,ico\)/);
 assert.match(out,/insights750Subtabs\(tab,insightTab\)/);
 assert.match(out,/insights750Cockpit\(state/);
 assert.doesNotMatch(out,/data-id="feelings">Gefühle<\/button>/);
 assert.match(out,/action==='ins750-group'\|\|action==='ins750-open'/);
 assert.match(out,/function insights750GroupFor750/);
 assert.equal(bridge.transform(fixture,'/repo/client/src/other.js'),null);
 const path=join(tmpdir(),`compass750-${process.pid}.mjs`);
 writeFileSync(path,out);
 try{execFileSync(process.execPath,['--check',path]);}finally{unlinkSync(path);}
});
test('Fails closed if key sidebar or bridge anchors are missing or duplicated',()=>{
 const bridge=compass750Bridge();
 assert.throws(()=>bridge.transform('bad','/repo/client/src/main.js'),/anchor/);
 assert.throws(()=>bridge.transform(fixture.replace('id="calm-nav-insights"','id="gone"'),'/repo/client/src/main.js'),/sidebar/);
 assert.throws(()=>bridge.transform(fixture.replace("const content=insightTab==='capacity'?",'const content=insightTab===\'weekly\'?'),'/repo/client/src/main.js'),/cockpit content/);
});
test('Vite pre-transform follows 0.5.77.49.1 and old CI anchor checks still pass',()=>{
 const conf=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(conf,/import \{ compass750Bridge \} from '\.\/compass750-bridge\.js'/);
 assert.match(conf,/compass747Bridge\(\), compass748Bridge\(\), compass749Bridge\(\), VitePWA/);
 assert.match(conf,/VitePWA\([\s\S]*?\),\s*\/\/ Guarded 0\.5\.77\.50/);
 assert.match(conf,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\)\]/);
 assert.match(readFileSync(new URL('../client/compass750-bridge.js',import.meta.url),'utf8'),/enforce:'pre'/);
});
