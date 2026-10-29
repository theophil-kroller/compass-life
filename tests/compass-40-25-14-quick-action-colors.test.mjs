import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const path=new URL('../client/src/',import.meta.url);
const js=readFileSync(new URL('main-full-v57759402510.js',path),'utf8');
const css=readFileSync(new URL('quick-utility-colors-v57759402514.css',path),'utf8');

test('quick actions have independent color and accessible labels in all modes',()=>{
 assert.match(js,/import '\.\/quick-utility-colors-v57759402514\.css';/);
 assert.match(js,/data-action=\\?"worktime-quick-open/);
 assert.match(js,/data-action=\\?"habit-quick-open/);
 assert.match(js,/quick-utility-button pj92-work-quick/);
 assert.match(js,/quick-utility-button pj92-habit-quick/);
 assert.match(js,/title=\\?"\$\{title\}\\?" aria-label=\\?"\$\{title\}/);
 assert.match(css,/\.utility-right \.pj92-work-quick\{/);
 assert.match(css,/\.utility-right \.pj92-habit-quick\{/);
 assert.match(css,/#174eaa/i);
 assert.match(css,/#6f359c/i);
});

test('habit uses a distinctive muscle icon; status is labeled and does not change writes',()=>{
 assert.match(js,/<span class=\\?"pj92-habit-glyph\\?" aria-hidden=\\?"true\\?">💪<\/span>/);
 assert.match(js,/Habits abhaken · \$\{done\} von \$\{items\.length\} erledigt/);
 assert.match(js,/Arbeitszeit erfassen · Timer läuft/);
 assert.match(css,/\.pj92-work-quick\.is-active::after/);
 assert.match(css,/\.pj92-habit-quick\.is-complete::after/);
 assert.doesNotMatch(css,/journalSync|mirrorGet|receiptJournal|nutritionJournal/);
});
