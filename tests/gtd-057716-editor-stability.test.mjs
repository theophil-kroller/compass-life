import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEditDraftGuard,EDIT_DRAFT_VAULT_KEY,editorKey} from '../client/src/edit-draft-guard-v57716.js';

function environment({delay=12,initial=null}={}){
 const state=initial||{records:{},projects:{},tasks:{}};
 const doc={activeElement:null,createElement:tag=>({tagName:tag,hidden:true,textContent:'',className:''})};
 const root={ownerDocument:doc,form:null,querySelectorAll(sel){return sel==='form[id]'&&this.form?[this.form]:[];}};
 let saved=0,lastSnapshot=null;
 const createForm=(id,formId='project-create-form',values={title:'Mein neuer Projektname',outcome:'Schwierige Nachfassaktion'})=>{
  const form={id:formId,dataset:{id},controls:[],details:[],listeners:{},status:null,
   querySelectorAll(selector){if(selector==='input[name], textarea[name], select[name]')return this.controls;if(selector==='details')return this.details;return [];},
   querySelector(selector){return selector==='.v57716-draft-status'?this.status:null;},
   appendChild(node){this.status=node;},contains(node){return node?.form===this;},addEventListener(evt,cb){this.listeners[evt]=cb;}};
  for(const [name,value] of Object.entries(values)){
   const el={name,type:'text',value,tagName:'INPUT',form,selectionStart:0,selectionEnd:0,
    closest(selector){return selector==='form'?this.form:null;},
    focus(){doc.activeElement=this;},setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}};
   form.controls.push(el);
  }
  root.form=form;return form;
 };
 const getContext=()=>({tab:'projects',selectedDay:'2026-10-23'});
 const guard=createEditDraftGuard({root,getState:()=>state,getContext,
  persist:async()=>{saved++;lastSnapshot=structuredClone(state);},delay});
 return {state,root,doc,guard,createForm,saveCount:()=>saved,snapshot:()=>lastSnapshot,delay};
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
test('0.5.77.16: preserves typed project text, focus and caret through whole-root rebuild',async()=>{
 const e=environment();const old=e.createForm('');e.guard.afterRender(null);
 const title=old.controls[0];title.value='Entwurf für meine Forschungsprojekte';title.focus();title.setSelectionRange(14,14);
 old.listeners.input();
 assert.equal(e.guard.shouldDefer(true),true,'background render on same page should be deferred');
 assert.equal(e.guard.shouldDefer(false),false,'explicit navigation must remain possible');
 const focus=e.guard.beforeRender();const updated=e.createForm('');e.guard.afterRender(focus);
 assert.equal(updated.controls[0].value,'Entwurf für meine Forschungsprojekte');
 assert.equal(e.doc.activeElement,updated.controls[0]);
 assert.equal(updated.controls[0].selectionStart,14);
 await sleep(24);
 assert.equal(e.saveCount(),1,'rapid input produces one debounced vault write');
 assert.equal(e.snapshot()[EDIT_DRAFT_VAULT_KEY]['project-create-form||projects::::2026-10-23'].values['title#0'],'Entwurf für meine Forschungsprojekte');
});
test('0.5.77.16: does not restore another project or template entry draft',()=>{
 const e=environment();const form=e.createForm('aaaa','project-edit-form',{title:'Vorlage Einkauf'});e.guard.afterRender(null);
 form.controls[0].value='Vorlage Einkauf erweitert';form.listeners.input();e.guard.beforeRender();
 const other=e.createForm('bbbb','project-edit-form',{title:'Anderes Projekt'});e.guard.afterRender(null);
 assert.equal(other.controls[0].value,'Anderes Projekt');
 assert.notEqual(editorKey(form,{}),editorKey(other,{}));
});
test('0.5.77.16: saves drafts only after idle and clears them on committed save',async()=>{
 const e=environment({delay:30});const form=e.createForm('x','task-edit-form',{title:'Wichtige E-Mail'});e.guard.afterRender(null);
 for(let i=0;i<7;i++){form.controls[0].value='Wichtige E-Mail '+i;form.listeners.input();}
 assert.equal(e.saveCount(),0,'typing does not encrypt whole vault per keystroke');
 const backup=e.guard.commit(form);
 assert.deepEqual(e.guard.pending(),[]);
 assert.deepEqual(e.state[EDIT_DRAFT_VAULT_KEY],{});
 await sleep(45);assert.equal(e.saveCount(),1,'commit writes cleared draft state instead of stale values');
 assert.deepEqual(e.snapshot()[EDIT_DRAFT_VAULT_KEY],{});
 e.guard.rollback(backup);
 await sleep(45);
 assert.equal(e.saveCount(),2,'on mutation failure draft returns and persists');
});
test('0.5.77.16: ignores non-editor forms and never drafts password inputs',()=>{
 const e=environment();const f=e.createForm('','login-form',{password:'never save'});e.guard.afterRender(null);
 assert.equal(f.listeners.input,undefined);
 assert.equal(e.guard.pending().length,0);
});
test('0.5.77.16: backend and background-data returns do not repaint unrelated project view',()=>{
 const src=fs.readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
 assert.match(src,/if\(\['source','receiver'\]\.includes\(state\.privateDeviceMirror\?\.mode\)&&privateChanged/);
 assert.match(src,/const trackJournal=!!\(state\.privateDeviceMirror\?\.key&&authToken\)/);
 assert.match(src,/widgetDevices=data\.devices\|\|\[\];widgetConnectError='';if\(tab==='insights'&&insightTab==='sources'\)render\(\)/);
 assert.match(src,/healthLastUpdated=Date\.now\(\);if\(\['insights','progress','recovery'\]\.includes\(tab\)\)render\(\)/);
 assert.match(src,/watchError='';if\(\['activity','overview','insights','recovery','progress'\]\.includes\(tab\)\)render\(\)/);
});
