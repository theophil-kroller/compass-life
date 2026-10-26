/** Regression gate: reproduce the actual production Vite bridge chain on REAL main.js.
 * This closes the gap where handcrafted fixtures pass although production markup differs.
 * No browser, network or data access required.
 * Updated for additive Compass .59 feature bridges: the historic .50-.58 chain
 * must remain intact, while newer opt-in bridges may be appended afterward.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
const repo=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const sourceFile=join(repo,'client/src/main.js');

test('full production bridge chain transforms real main.js, and output parses', async()=>{
 const config=readFileSync(join(repo,'client/vite.config.js'),'utf8');
 const imports=[...config.matchAll(/import\s*\{\s*([\w]+Bridge)\s*\}\s*from\s*'\.\/([^']+-bridge\.js)'/g)]
    .map(m=>({exportName:m[1],filename:m[2]}));
 assert.ok(imports.length>=26,'expected all currently installed bridge plugins');
 const oldLast=imports.findIndex(x=>x.exportName==='compass758Bridge');
 assert.ok(oldLast>=0,'historical .58 bridge must remain installed');
 const later=imports.slice(oldLast+1).map(x=>x.exportName);
 assert.ok(later.every(name=>/^compass59\d+\w*Bridge$/.test(name)),
   'only explicitly versioned .59 feature bridges may follow the old .58 chain');
 assert.ok(later.includes('compass5928VtaperLuxBridge'),'V-Taper module must remain registered');
 assert.ok(later.includes('compass5929BreakfastBridge'),'breakfast module must remain registered');
 assert.ok(later.indexOf('compass5928VtaperLuxBridge')<later.indexOf('compass5929BreakfastBridge'),
   '.29 breakfast requires the prior .28 feature transforms');
 let source=readFileSync(sourceFile,'utf8');
 let historicSource=null;
 for(const {filename,exportName} of imports){
   const module=await import(pathToFileURL(join(repo,'client',filename)).href);
   assert.equal(typeof module[exportName],'function',`${filename}: exported plugin factory`);
   const plugin=module[exportName]();
   assert.equal(typeof plugin.transform,'function',`${filename}: transform available`);
   let result;
   try{result=plugin.transform(source,sourceFile);}
   catch(error){throw new Error(`Actual transform chain failed in ${filename}: ${error.message}`,{cause:error})}
   if(result?.code)source=result.code;
   if(exportName==='compass758Bridge')historicSource=source;
 }
 assert.ok(historicSource,'legacy transform output must be available');
 assert.match(historicSource,/const COMPASS_CLIENT_VERSION='0\.5\.77\.58\.2'/,
   'legacy source must still reach historic .58.2 before new feature transforms');
 const release=source.match(/const COMPASS_CLIENT_VERSION='([^']+)'/);
 assert.ok(release,'a release version must be visible in the fully transformed app');
 assert.match(release[1],/^0\.5\.77\.59\.\d+$/,'new .59 release must be reported by the app');
 assert.ok(Number(release[1].split('.').at(-1))>=29,'version must not regress below installed breakfast release .29');
 assert.match(source,/if\(tab==='shopping'\)content=compass57ShopTabs\(\)\+content/);
 assert.match(source,/function compass56TodayWorkspace\(\)/);
 assert.match(source,/function compass58ProjectLayout\(/);
 assert.match(source,/name="intent" value="dream"/);
 const dir=mkdtempSync(join(tmpdir(),'compass-main-chain-'));
 try{
   const temp=join(dir,'compiled-main.mjs');writeFileSync(temp,source);
   execFileSync(process.execPath,['--check',temp],{stdio:'pipe',timeout:30000});
 } finally {rmSync(dir,{recursive:true,force:true})}
});
