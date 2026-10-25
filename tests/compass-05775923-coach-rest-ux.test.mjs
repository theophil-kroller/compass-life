import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const src=name=>readFileSync(new URL('../client/src/'+name,import.meta.url),'utf8');
const player=src('strength-guided-v5775920.js'),pCss=src('strength-guided-v5775920.css');
const coach=src('strength-coach-v5775910.js'),cCss=src('strength-coach-v5775910.css');
test('two consecutive 90s phases with monotonic timer and optional one-shot vibration',()=>{
 assert.match(player,/Math\.max\(180,seconds\)/);
 assert.match(player,/restUntil-performance\.now\(\)/);
 assert.match(player,/restSeconds<=90&&!restVibrated&&resting/);
 assert.match(player,/navigator\.vibrate\(120\)/);
 assert.match(player,/Phase 1 \/ 2/);
 assert.match(player,/Phase 2 \/ 2/);
 assert.match(player,/data-act="skip-rest"/);
 assert.match(player,/restVibrated=false/);
});
test('existing set circles, user confirmation, Garmin boundary and wake lock are preserved',()=>{
 for(const token of ['data-act="set-circle"','sets.push({confirmed:true','navigator.wakeLock','onSession(data)','matchingGuidedSessions','confirmedGuidedSets','HOME_PLATES_KG=28'])assert.ok(player.includes(token),token);
});
test('photo replaces pullover stick figure; remaining schematic fallback retained',()=>{
 assert.match(player,/'dumbbell-pullover'\]\)/);
 assert.match(player,/str620-premium-figure/);
 assert.match(player,/exerciseMovementSvg\(curr.id\)/);
 assert.ok(statSync(new URL('../client/public/strength-visuals-v5775920/dumbbell-pullover.webp',import.meta.url)).size>15000);
 assert.match(pCss,/max-height:45dvh/);
});
test('the equipment and training evidence explanations collapse, without dropping data',()=>{
 assert.match(coach,/Equipmentdetails/);
 assert.match(coach,/Trainingsdaten & Regeneration/);
 assert.match(coach,/Methodik & Grenzen/);
 assert.match(coach,/28 kg Scheiben insgesamt/);
 assert.match(coach,/str620-launch/);
 assert.match(cCss,/str623-more/);
});
