import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(root+'/'+p,'utf8');
const index=read('client/index.html');
const js=read('client/public/gtd-workspace-premium-v577599.js');
const css=read('client/public/gtd-workspace-premium-v577599.css');

test('GTD UI assets are served via BASE_URL; existing entry points stay intact',()=>{
 assert.equal(index.split('%BASE_URL%gtd-workspace-premium-v577599.css').length-1,1);
 assert.equal(index.split('%BASE_URL%gtd-workspace-premium-v577599.js').length-1,1);
 assert.match(index,/src="\/src\/main\.js"/);
 assert.match(index,/insights-streamline-v577591\.css/);
 assert.match(index,/nutrition-cup-plate-v577593\.css/);
 assert.ok(index.indexOf('insights-streamline-v577591.css')<index.indexOf('gtd-workspace-premium-v577599.css'));
 assert.doesNotMatch(index,/vite\.config|compass758Bridge/);
});
test('GTD navigation uses only existing commands; no vault, data or persistence changes',()=>{
 for(const action of ['tree-task-select','compass58-folder-expand','tree-add-task','compass58-inspector-toggle','tree-inspector-close','task-select'])assert.ok(js.includes(action),action);
 assert.ok(js.includes('.compass58-nav-item')&&js.includes('.inbox-mvp-row'));
 assert.doesNotMatch(js,/\blocalStorage\b|\bvault\.|\bindexedDB\b|\bfetch\s*\(|\bmutate\s*\(|state\.tasks\s*=/);
 assert.match(js,/editable\(e\.target\)/);
 execFileSync(process.execPath,['--check',root+'/client/public/gtd-workspace-premium-v577599.js']);
});
test('presentation keeps inspector optional and does not remove chart or data content',()=>{
 for(const selector of ['.compass58-workspace.has-inspector','.compass58-center','.compass58-inspector','.inbox-mvp-layout','.today-tasks'])assert.ok(css.includes(selector),selector);
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css, /@media\(min-width:761px\) and \(max-width:1400px\)/);
 assert.match(css, /:focus-visible/);
 assert.doesNotMatch(css,/display\s*:\s*none\s*!important|\.insight-chart-card\s*\{\s*display\s*:\s*none/);
});
test('ArrowDown moves focus within inbox only; editing fields preserve their keys',()=>{
 let keydown=null, focus=null, prevented=false;
 const region={querySelectorAll(sel){assert.equal(sel,'.inbox-mvp-row');return [a,b];}};
 const mk=id=>({dataset:{id},disabled:false,getClientRects(){return [1]},
   closest(sel){if(sel==='.inbox-mvp-list')return region;if(sel==='.inbox-mvp-row'||sel==='button[data-action],a[data-action]')return this;return null;},
   focus(){focus=id},scrollIntoView(){}});
 const a=mk('a'),b=mk('b');
 const document={addEventListener(event,cb){if(event==='keydown')keydown=cb},querySelector(){return null}};
 vm.runInNewContext(js,{document,getComputedStyle:()=>({visibility:'visible'})});
 assert.equal(typeof keydown,'function');
 const event={target:a,key:'ArrowDown',defaultPrevented:false,isComposing:false,altKey:false,shiftKey:false,ctrlKey:false,metaKey:false,preventDefault(){prevented=true}};
 keydown(event);assert.equal(focus,'b');assert.equal(prevented,true);
 focus=null;prevented=false;
 const input={closest(sel){return sel==='input,textarea,select,[contenteditable="true"],[role="textbox"]'?this:null}};
 keydown({...event,target:input});assert.equal(focus,null);assert.equal(prevented,false);
});
