import {compass5930MobileLongevityBridge} from '../client/compass5930-mobile-longevity-bridge.js';
import {writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {execFileSync} from 'node:child_process';
test('full mobile transform parses; Focus never renders extra menu',()=>{
const source=`import {buildLifeBalanceRadar} from './life-balance-radar-v563.js';
const COMPASS_CLIENT_VERSION='0.5.77.59.29';
const buildLabel='Build 0.5.77.59.29';
let compass55Mode='focus',calmNavGroup='',tab='insights',balancePeriod=7,balanceHistoryCount=2,balanceSelectedAxis=null,state={};
const ico=(x)=>x;
const h=x=>x;
function chrome(content){return \`<div class="shell"><aside class="sidebar" aria-label="Navigation"><nav class="side-nav calm-side-nav" aria-label="Hauptnavigation"></nav></aside>4{content}</div>\`;}
function tabsHelper(el){const target=el.dataset.tab;if(!target)return;if(target==='today'){} }
function balanceTab(){return lifeBalanceRadarView(buildLifeBalanceRadar(state,{today,period:balancePeriod,healthDays}),{history:buildLifeBalanceHistory(state,{today,period:balancePeriod,healthDays,count:balanceHistoryCount}),activeAxis:balanceSelectedAxis})}
function insightsScreen(){return chrome(\`<div class="insight-workspace" aria-label="Compass Insights · Personal Analytics"></div>\`)}
async function runAction(action,id,stepId=null,plannerDay=null) {
if(action==='calm-nav-group'){calmNavGroup=calmNavGroup===id?'':id;render();return;}
if(action==='balance-select'){if(id===''||['sleep','activity','gtd','finance','people','body','recovery','work'].includes(id)){balanceSelectedAxis=id||null;render();}return;}
}
`;
const plugin=compass5930MobileLongevityBridge();
const transformed=plugin.transform(source,'/repo/client/src/main.js').code;
const dir=mkdtempSync(join(tmpdir(),'compass-5930-test-'));
try{const f=join(dir,'transformed.mjs');writeFileSync(f,transformed);execFileSync(process.execPath,['--check',f]);}finally{rmSync(dir,{force:true,recursive:true});}
if(!transformed.includes("compass55Mode==='extended'?`<nav class=\"cm930-direct\""))throw Error('direct nav not gated');
if(!transformed.includes('compass55Mode'))throw Error('missing mode guard');
});
