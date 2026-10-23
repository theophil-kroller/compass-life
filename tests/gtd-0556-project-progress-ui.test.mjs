import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const main=fs.readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../client/src/style.css',import.meta.url),'utf8');

test('Projects: template-filter helper is imported by the top-level renderer',()=>{
  const imports=main.match(/import \{[^}]+\} from '\.\/tasks\.js';/);
  assert.ok(imports,'tasks import must exist');
  assert.match(imports[0],/\bisTemplateTask\b/,'previous reference error must not recur');
  assert.match(main,/!isTemplateTask\(state,t\)/);
});

test('Today and Next Actions share an accessible progress meter and preserved +1 action',()=>{
  const helper=main.slice(main.indexOf('function taskProgressInline(t){'),main.indexOf('function taskList(',main.indexOf('function taskProgressInline(t){')));
  assert.match(helper,/class="v42-progress-meter"/);
  assert.match(helper,/<progress max="\$\{target\}"/);
  assert.match(helper,/\$\{current\}\/\$\{target\}/);
  assert.match(helper,/data-action="task-progress-plus"/);
  assert.match(main,/\$\{taskProgressInline\(t\)\}/);
  assert.match(main, /taskList\(dayTasks, 'day'\)/);
  assert.match(css,/\.task-row \.v42-progress-meter progress\s*\{display:block!important/);
  assert.match(css,/\.tree-task \.v42-progress-meter progress\s*\{display:none!important/);
});

test('Insights project progress places title and counter in separate cells',()=>{
  const progress=main.slice(main.indexOf('function progressScreen(){'),main.indexOf('function healthSummaryPanel(',main.indexOf('function progressScreen(){')));
  assert.match(progress,/class="progress-project-head"/);
  assert.match(progress,/class="progress-project-name"/);
  assert.match(progress,/class="progress-project-count"/);
  assert.match(progress,/\$\{completed\}\/\$\{tasks.length\}/);
  assert.match(progress,/class="progress-track"/);
  assert.match(css,/\.progress-project \.progress-project-head\s*\{display:grid;grid-template-columns:minmax\(0,1fr\) auto/);
});

test('Project view error no longer accuses the data record',()=>{
  assert.match(main,/Beim Darstellen der Projekte ist ein Fehler aufgetreten/);
  assert.doesNotMatch(main,/Ein Projektdatensatz konnte nicht vollständig angezeigt werden/);
});
