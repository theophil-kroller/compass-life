import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');

test('journal changes start their own immediate sync instead of waiting for general debounce',()=>{
 assert.match(source,/if\(journalFingerprint\(state\)!==journalBefore\).*syncPersonalJournal\(\)\.catch/s);
 assert.match(source,/if\(journalSyncInFlight\)return journalSyncInFlight;/);
 assert.match(source,/if\(journalRevision!==startRevision\).*scheduleJournalSync\(0\)/s);
});
test('opening worktime refreshes the encrypted journal from the cloud',()=>{
 assert.match(source,/worktime-quick-open[^\n]+syncPersonalJournal\(\)\.catch/s);
});
test('journal sync is re-checked on network return and tab foreground',()=>{
 assert.match(source,/addEventListener\('online',[^\n]*scheduleJournalSync\(0\)/);
 assert.match(source,/visibilitychange[^\n]*\n[^\n]*scheduleJournalSync\(0\)/);
});
test('status is specific to journal and not a generic green account indicator',()=>{
 assert.match(source,/journalSyncStatus==='ok'\?'Journal auf diesem Gerät abgeglichen'/);
 assert.doesNotMatch(source,/Planung \+ privater Geräteabgleich/);
});
test('mobile utility bar scrolls without overflowing the viewport, and redundant microcopy is gone',()=>{
 assert.match(css,/\.utility-bar\{display:block;width:100%;max-width:100%;box-sizing:border-box;overflow-x:auto/);
 assert.match(css,/\.quick-panel\{box-sizing:border-box;min-width:0;max-width:100%;width:100%/);
 assert.doesNotMatch(source,/Motivierend statt perfektionistisch: ein Häkchen genügt/);
 assert.doesNotMatch(source,/Play startet ein Intervall, Stopp beendet es/);
});
