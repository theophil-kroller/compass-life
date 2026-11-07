import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import {resolveNewTaskProject} from '../client/src/project-task-context-v059132.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projects={
  projA:{id:'projA',kind:'project',title:'Projekt A'},
  projB:{id:'projB',kind:'project',title:'Projekt B'},
  lv:{id:'lv',kind:'project',title:'Lehrveranstaltung'},
  folder:{id:'folder',kind:'folder',title:'Ordner'},
  template:{id:'template',kind:'project',title:'Vorlage',isTemplate:true}
};
const sources=['main-full-v57759402510.js','main.js'].map(n=>({name:n,code:readFileSync(path.join(root,'client/src',n),'utf8')}));

test('project A click beats stale LV form select',()=>{
  assert.deepEqual(resolveNewTaskProject({contextProjectId:'projA',liveProjectId:'projA',formProjectId:'lv',projects}),{projectId:'projA',contextual:true,error:null});
});
test('project B click beats stale LV even after creating in A',()=>{
  const a=resolveNewTaskProject({contextProjectId:'projA',liveProjectId:'projA',formProjectId:'lv',projects});
  const b=resolveNewTaskProject({contextProjectId:'projB',liveProjectId:'projB',formProjectId:a.projectId,projects});
  assert.equal(b.projectId,'projB');
});
test('template action remains in its template',()=>{
  const r=resolveNewTaskProject({contextProjectId:'template',liveProjectId:'template',formProjectId:'lv',projects});
  assert.equal(r.projectId,'template');
});
test('stale click context rejects rather than silently moving to LV',()=>{
  const r=resolveNewTaskProject({contextProjectId:'projA',liveProjectId:'projB',formProjectId:'lv',projects});
  assert.equal(r.projectId,null);assert.equal(r.error,'stale-project-context');
});
test('deleted project and folder contexts cannot accept new action',()=>{
  for(const id of ['deleted','folder']){
    const r=resolveNewTaskProject({contextProjectId:id,liveProjectId:id,formProjectId:'lv',projects});
    assert.equal(r.error,'stale-project-context');
  }
});
test('standalone Today / Next Actions retain explicit project selection',()=>{
  for(const chosen of ['lv','projA','']){
    const r=resolveNewTaskProject({contextProjectId:'',liveProjectId:'',formProjectId:chosen,projects});
    assert.equal(r.projectId,chosen||null);assert.equal(r.contextual,false);
  }
});
for(const {name,code} of sources){
  test(`${name}: project-local new task uses locked project label and hidden ID`,()=>{
    const start=code.indexOf('function taskCreateForm('),end=code.indexOf('function taskProgressInline(',start);
    assert.ok(start>=0&&end>start);
    const script=code.slice(start,end)+'\ntaskCreateForm("","projA","")';
    const sandbox={state:{projects},h:x=>String(x),dateControl:()=>'',categoryOptions:()=>'',workflowOptions:()=>'',projectOptions:()=>'<option value="lv">LV</option>',taskParentOptions:()=>'',ico:()=>''};
    const html=vm.runInNewContext(script,sandbox);
    assert.match(html,/data-context-project-id="projA"/);
    assert.match(html,/Projekt: <strong>Projekt A<\/strong> · fest zugeordnet/);
    assert.match(html,/<input type="hidden" name="projectId" value="projA"\/>/);
    assert.doesNotMatch(html,/<select name="projectId">/);
  });
  test(`${name}: global create still offers project picker`,()=>{
    const start=code.indexOf('function taskCreateForm('),end=code.indexOf('function taskProgressInline(',start);
    const script=code.slice(start,end)+'\ntaskCreateForm("", "", "")';
    const sandbox={state:{projects},h:x=>String(x),dateControl:()=>'',categoryOptions:()=>'',workflowOptions:()=>'',projectOptions:()=>'<option value="lv">LV</option>',taskParentOptions:()=>'',ico:()=>''};
    const html=vm.runInNewContext(script,sandbox);
    assert.match(html,/<select name="projectId">/);
    assert.doesNotMatch(html,/data-context-project-id/);
  });
  test(`${name}: save uses resolved context, not form-project`,()=>{
    assert.match(code,/const context=resolveNewTaskProject\(/);
    assert.match(code,/projectId:context\.projectId,parentTaskId:/);
    assert.match(code,/if\(context\.error\)\{toast\(/);
    assert.match(code,/action==='tree-add-task'&&state\.projects\?\.\[id\]\?\.kind!=='project'/);
  });
}
