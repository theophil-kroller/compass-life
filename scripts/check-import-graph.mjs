import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
const root=resolve(import.meta.dirname,'..'),paths=[];
function walk(p){for(const n of readdirSync(p)){const f=resolve(p,n);if(statSync(f).isDirectory()){if(n!=='node_modules'&&n!=='dist')walk(f)}else if(/\.(js|mjs)$/.test(n))paths.push(f)}}
walk(resolve(root,'client/src'));
const missing=[];
for(const file of paths){const src=readFileSync(file,'utf8');const imports=src.matchAll(/(?:\b(?:import|export)\s*(?:[^'";]*?\bfrom\s*)?|\bimport\s*\()\s*['"](\.[^'"?]+)['"]/g);for(const m of imports){const base=resolve(dirname(file),m[1]);if(!existsSync(base)&&!existsSync(base+'.js')&&!existsSync(base+'.mjs'))missing.push(`${relative(root,file)} -> ${m[1]}`)}}
if(missing.length){console.error('Missing relative imports:\n'+missing.join('\n'));process.exit(1)}
console.log(`Import graph OK: ${paths.length} modules; no missing relative imports.`)
