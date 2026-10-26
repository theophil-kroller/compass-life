import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compass5931FamilyRadarBridge} from '../client/compass5931-family-radar-bridge.js';
import {compass5930MobileLongevityBridge} from '../client/compass5930-mobile-longevity-bridge.js';
const fixture=`import {deadlineIntelligence} from './deadline-intelligence-v45.js';
const COMPASS_CLIENT_VERSION='0.5.77.59.30';
const FOOTER='Build 0.5.77.59.30';
function chrome(content){return content;}
function insightsScreen(){const today='2026-10-26';return chrome(\`<article class="old-plugin-wrapper"><div class="insight-workspace">page</div></article>\`);}
async function runAction(action,id,stepId=null,plannerDay=null) {return;}
`;
test('new Family Radar injects only a read-only chrome projection and optional user decisions',()=>{
 const bridge=compass5931FamilyRadarBridge();
 const result=bridge.transform(fixture,'/repo/client/src/main.js').code;
 assert.match(result,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.31'/);
 assert.match(result,/familySuggestions\(/);
 assert.match(result,/fr31-rules-save/);
 assert.match(result,/fr31-accept/);
 assert.doesNotMatch(result,/\.insert\(.*calendarEvents|calendarEvents\.push/);
 assert.doesNotThrow(()=>new Function(result.replace(/^import .*;$/gm,'').replaceAll('export ','').replaceAll('import ','')));
});
test('Daily Dozen in transformed Insights shell does not depend on exact HTML markup',()=>{
 const bridge=compass5930MobileLongevityBridge();
 const content=readFileSync(new URL('../client/compass5930-mobile-longevity-bridge.js',import.meta.url),'utf8');
 assert.match(content,/screenStart=s\.indexOf\('function insightsScreen\(\)\{'\)/);
 assert.match(content,/const additions=/);
 assert.doesNotMatch(content,/patch\('return chrome\\`<div class="insight-workspace"/);
});
test('Vite chain does not rearrange historic plugins',()=>{
 const vite=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');
 assert.match(vite,/compass757Bridge\(\), compass758Bridge\(\)\]/);
 assert.match(vite,/compassConfig\.plugins\.push\(compass5928VtaperLuxBridge\(\), compass5929BreakfastBridge\(\)\)/);
 assert.match(vite,/compassConfig\.plugins\.push\(compass5930MobileLongevityBridge\(\)\)/);
 assert.match(vite,/compassConfig\.plugins\.push\(compass5931FamilyRadarBridge\(\)\)/);
});

test('Regression #264: Daily Dozen integrates even when earlier bridges wrap the Insights HTML',()=>{
 const transformedPrior=`import {buildLifeBalanceRadar} from './life-balance-radar-v563.js';
const COMPASS_CLIENT_VERSION='0.5.77.59.29';
const buildLabel='Build 0.5.77.59.29';
let compass55Mode='focus',calmNavGroup='',tab='insights',balancePeriod=7,balanceHistoryCount=2,balanceSelectedAxis=null,state={};
const ico=x=>x;
function chrome(content){return \`<div class="shell"><aside class="sidebar" aria-label="Navigation"><nav class="side-nav calm-side-nav" aria-label="Hauptnavigation"></nav></aside>\${content}</div>\`;}
function tabsHelper(el){const target=el.dataset.tab;if(!target)return;if(target==='today'){} }
function balanceTab(){return lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount}),activeAxis:balanceSelectedAxis})}
function insightsScreen(){return chrome(\`<div class="earlier-plugin-header"><nav>Previous categories</nav><section class="insight-workspace">content</section></div>\`)}
async function runAction(action,id,stepId=null,plannerDay=null) {
 if(action==='balance-select'){if(id===''||['sleep','activity','gtd','finance','people','body','recovery','work'].includes(id)){balanceSelectedAxis=id||null;render();}return;}
}
`;
 const transformed=compass5930MobileLongevityBridge().transform(transformedPrior,'/repo/client/src/main.js').code;
 assert.match(transformed,/return chrome\(\(compass55Mode==='extended'/);
 assert.match(transformed,/earlier-plugin-header/);
 assert.doesNotThrow(()=>new Function(transformed.replace(/^import .*;$/gm,'')));
});

test('Source snapshot is generated only after check + build and before Pages deploy',()=>{
 const yaml=readFileSync(new URL('../.github/workflows/deploy-pages.yml',import.meta.url),'utf8');
 const check=yaml.indexOf('npm run check'),build=yaml.indexOf('npm run build');
 const archive=yaml.indexOf('git archive --format=zip'),publish=yaml.indexOf('actions/upload-artifact@v4');
 const pages=yaml.indexOf('actions/deploy-pages@v4');
 assert.ok(check>=0&&build>check&&archive>build&&publish>archive&&pages>publish);
 assert.match(yaml,/name: compass-full-source/);
});
