import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {INSIGHTS750_GROUPS,INSIGHTS750_EXTERNAL,insights750GroupFor,insights750Allowed,insights750Subtabs,insights750Sidebar} from '../client/src/insights-navigation-v57750.js';
import {compass7593UxBridge} from '../client/compass7593-ux-bridge.js';

const source=readFileSync(new URL('../client/compass7593-ux-bridge.js',import.meta.url),'utf8');
const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');

// Essential navigation semantics: Dashboard is Life Balance, never redundant cards.
test('Overview & Intelligence starts with Life Balance rather than Cockpit',()=>{
 const group=INSIGHTS750_GROUPS.find(g=>g.id==='intelligence');
 assert.equal(group.default,'balance');
 assert.deepEqual(group.tabs.map(x=>x[0]),['balance','weekly','capacity','connections','explore','report']);
 assert.equal(group.tabs.some(([id])=>id==='intelligence'),false);
 const tabs=insights750Subtabs('insights','balance');
 assert.match(tabs,/Life Balance/);
 assert.doesNotMatch(tabs,/Cockpit|data-id="intelligence"/);
 assert.match(tabs,/data-id="balance" class="ins750-subtab is-active"/);
 assert.equal(insights750GroupFor('insights','balance').id,'intelligence');
});

test('recovery no longer appears under Insights but remains a working legacy route',()=>{
 const all=INSIGHTS750_GROUPS.flatMap(g=>g.tabs.map(t=>t[0]));
 assert.equal(all.includes('recovery'),false);
 assert.equal(insights750Allowed('recovery'),true);
 assert.equal(insights750GroupFor('recovery','weekly').id,'life');
 assert.deepEqual([...INSIGHTS750_EXTERNAL].sort(),['activity','progress','recovery']);
 assert.doesNotMatch(insights750Subtabs('insights','places'),/Erholung/);
 assert.doesNotMatch(insights750Sidebar('insights','places',()=>''),/Erholung/);
});

test('Plan entry, proper Focus handling and Life Balance header override are guarded',()=>{
 for(const needle of [
  "${navItem('recovery','Freizeit & Erholung','heart')}",
  "if(target==='recovery'){compass55Mode='extended'",
  "if(action==='calm-nav-group'&&id==='insights'){tab='insights';insightTab='balance'",
  "'someday','recovery'].includes(tab)?'plan'",
 ])assert.ok(source.includes(needle),needle);
 assert.ok(!source.includes("insights750Subtabs(\\'recovery\\',insightTab)"));
 assert.equal(compass7593UxBridge().transform('return 1;', '/repo/client/src/not-main.js'),null);
});

test('historic PWA/bridge sequence is untouched',()=>{
 assert.match(vite,/compass747Bridge\(\), compass748Bridge\(\), compass749Bridge\(\), VitePWA/);
 assert.match(vite,/compass7593UxBridge\(\),\s*compass750Bridge\(\)/);
 assert.match(vite,/compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/);
});
