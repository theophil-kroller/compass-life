import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {strengthPremium738Bridge} from '../client/strength-premium738-bridge.js';

const base=new URL('../',import.meta.url);
const read=name=>readFileSync(new URL(name,base),'utf8');

test('raw source baseline versions remain consistent with legacy tests; deployed UI upgrades through Vite bridge',()=>{
 const root=JSON.parse(read('package.json'));
 const client=JSON.parse(read('client/package.json'));
 const main=read('client/src/main.js');
 assert.equal(root.version,client.version);
 assert.ok(main.includes(`COMPASS_CLIENT_VERSION='${root.version}'`));
 const bridge=strengthPremium738Bridge();
 const source=`const COMPASS_CLIENT_VERSION='0.5.77.37.1';\nimport './strength-recent-defaults-v577371.css';\nfunction render(){app.innerHTML=html;bind();editDraftGuard.afterRender(editDraftFocus);}`;
 const out=bridge.transform(source,'/project/client/src/main.js').code;
 assert.match(out,/COMPASS_CLIENT_VERSION='0\.5\.77\.40'/);
 assert.match(out,/import \{mountPremiumAnatomy\} from '\.\/strength-premium-v57738\.js';/);
 assert.match(out,/void mountPremiumAnatomy\(app\)/);
 assert.equal((out.match(/mountPremiumAnatomy\(app\)/g)||[]).length,1);
});
