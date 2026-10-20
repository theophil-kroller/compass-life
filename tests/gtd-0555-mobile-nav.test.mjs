import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const MAIN=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const CSS=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');

test('0.5.55 mobile main nav returns to one horizontally scrollable strip with accessible group back controls',()=>{
  assert.match(CSS,/Mobile navigation: one swipeable rail/);
  assert.match(CSS,/\.calm-side-nav\{\s*display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important/);
  assert.match(CSS,/overflow-x:auto!important;overflow-y:hidden!important/);
  assert.match(CSS,/\.calm-side-nav:has\(>\.calm-nav-group>\.calm-group-toggle\.is-open\)/);
  for(const group of ['plan','insights','finance']){
    assert.match(MAIN,new RegExp(`class="calm-mobile-nav-back" data-action="calm-nav-group" data-id="${group}"`));
  }
  assert.match(CSS,/\.calm-side-nav \.calm-mobile-nav-back\{/);
});
test('0.5.55 mobile insights tabs stay on a single swipeable line',()=>{
  assert.match(CSS,/\.calm-insights-nav\{display:flex;flex-wrap:nowrap!important;flex:1 1 auto;min-width:0;/);
  assert.match(CSS,/\.calm-insight-tab\{flex:0 0 auto;white-space:nowrap\}/);
});
