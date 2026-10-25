/** Regression gate: reproduce the actual production Vite bridge chain on REAL main.js.
 * This closes the gap where handcrafted fixtures pass although production markup differs.
 * No browser, network or data access required.
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
 assert.equal(imports.at(-1).exportName,'compass758Bridge','latest bridge should be final');
 let source=readFileSync(sourceFile,'utf8');
 for(const {filename,exportName} of imports){
   const module=await import(pathToFileURL(join(repo,'client',filename)).href);
   assert.equal(typeof module[exportName],'function',`${filename}: exported plugin factory`);
   const plugin=module[exportName]();
   assert.equal(typeof plugin.transform,'function',`${filename}: transform available`);
   let result;
   try{result=plugin.transform(source,sourceFile);}
   catch(error){throw new Error(`Actual transform chain failed in ${filename}: ${error.message}`,{cause:error})}
   if(result?.code)source=result.code;
 }
 assert.match(source,/const COMPASS_CLIENT_VERSION='0\.5\.77\.58'/);
 assert.match(source,/if\(tab==='shopping'\)content=compass57ShopTabs\(\)\+content/);
 assert.match(source,/function compass56TodayWorkspace\(\)/);
 assert.match(source,/function compass58ProjectLayout\(/);
 assert.match(source,/name=\"intent\" value=\"dream\"/);
 const dir=mkdtempSync(join(tmpdir(),'compass-main-chain-'));
 try{
   const temp=join(dir,'compiled-main.mjs');writeFileSync(temp,source);
   execFileSync(process.execPath,['--check',temp],{stdio:'pipe',timeout:30000});
 } finally {rmSync(dir,{recursive:true,force:true})}
});
