import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOOD_PRESETS,nutritionQuickView,nutritionInsightsView} from '../client/src/personal-journal-v5692.js';
import {compass594014FlaxTileRelease} from '../client/compass594014-flax-tile-release.js';

test('flaxseed renders in the same four-column food tile grid as other snacks',()=>{
 const food=FOOD_PRESETS.find(f=>f.id==='spar-bio-flaxseed');
 assert.deepEqual([food.emoji,food.title,food.group,food.defaultAmount],['🌱','SPAR Bio-Leinsamen · gekaut','Snacks','1 TL (3 g)']);
 const html=nutritionQuickView({nutritionJournal:{entries:[],customFoods:[]}});
 assert.match(html,/<button type="button" data-action="pj92-food-tap" data-id="spar-bio-flaxseed"[^>]*class="pj92-food-tile[^>]*><span>🌱<\/span><small>SPAR Bio-Leinsamen · gekaut · 1 TL \(3 g\)<\/small><\/button>/);
 assert.doesNotMatch(html,/pj92-flax-quick|flax-yesterday|Gestern mit Uhrzeit nachtragen/);
 assert.match(html,/<button type="button" data-action="pj92-food-tap" data-id="sbudget-topfencreme-vanilla"/);
});
test('flax uses normal action repeatedly and generic nutrition editor supports any day',()=>{
 const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(main,/if\(action==='pj92-food-tap'\)/);
 assert.match(main,/at:stamp\(\)/);
 assert.doesNotMatch(main,/pj92-flax-yesterday/);
 const journal=nutritionInsightsView({nutritionJournal:{entries:[{id:'y',foodId:'spar-bio-flaxseed',at:'2026-10-27T17:00:00Z',amount:'1 TL (3 g)',note:'Vor dem Schlucken gekaut'}],customFoods:[]}}, {editingId:'y'});
 assert.match(journal,/name="at"/);
 assert.match(journal,/type="datetime-local"/);
});
test('release updates the client build number, and keeps former version transform intact',()=>{
 const plugin=compass594014FlaxTileRelease();
 const input="const COMPASS_CLIENT_VERSION='0.5.77.59.40.13';\nBuild 0.5.77.59.40.13";
 assert.match(plugin.transform(input,'/src/client/src/main.js').code,/0\.5\.77\.59\.40\.14/);
});
