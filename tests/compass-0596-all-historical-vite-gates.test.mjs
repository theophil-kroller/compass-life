import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const cfg=readFileSync(new URL('../client/vite.config.js',import.meta.url),'utf8');

test('Every historical plugin adjacency that failed on #231, #232, #233 remains intact',()=>{
 const required=[
  /compass746Bridge\(\), compass747Bridge\(\)/,
  /compass747Bridge\(\), compass748Bridge\(\), compass749Bridge\(\), VitePWA/,
  /VitePWA\([\s\S]*?\),\s*\/\/ Guarded 0\.5\.77\.50/,
  /compass750Bridge\(\), compass751Bridge\(\), compass752Bridge\(\), compass753Bridge\(\), compass754Bridge\(\), compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/,
  /compass755Bridge\(\), compass756Bridge\(\), compass757Bridge\(\), compass758Bridge\(\)\]/
 ];
 for(const re of required)assert.match(cfg,re,String(re));
});

test('.59.3 is registered exactly once between VitePWA and the old .50-.58 pre-bridge chain',()=>{
 assert.equal((cfg.match(/compass7593UxBridge\(\)/g)||[]).length,1);
 const pwa=cfg.indexOf('VitePWA({'),position=cfg.indexOf('compass7593UxBridge(),'),legacy=cfg.indexOf('compass750Bridge(),');
 assert.ok(pwa>=0&&pwa<position&&position<legacy);
 assert.match(cfg,/import \{ compass7593UxBridge \} from '\.\/compass7593-ux-bridge\.js';/);
 const src=readFileSync(new URL('../client/compass7593-ux-bridge.js',import.meta.url),'utf8');
 assert.match(src,/enforce:'pre'/);
});
