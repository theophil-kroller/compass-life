import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const main=readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const start=main.indexOf('let captureOverlayOpen=false;');
const end=main.indexOf('let captureAfterUnlock=false;',start);
assert.ok(start>0 && end>start);

function prepare(){
 const existingTitle={id:'capture-modal-input',value:'Learnly: Umfrage bei den Schulen',selectionStart:9,selectionEnd:9};
 const existingNote={id:'capture-modal-note',value:'Interview und Auswertung',selectionStart:5,selectionEnd:5};
 const existingDashboard={id:'capture',value:'Idee für morgen',selectionStart:3,selectionEnd:3};
 const details={open:true};
 const form={elements:{title:existingTitle,note:existingNote},querySelector:sel=>sel==='.optional-capture'?details:null};
 let current={modal:form,title:existingTitle,note:existingNote,dashboard:existingDashboard};
 const app={querySelector:selector=>({
  '#capture-modal-form':current.modal,
  '#capture-form textarea[name="title"]':current.dashboard,
  '#capture-modal-input':current.title,
  '#capture-modal-note':current.note,
  '#capture':current.dashboard,
 }[selector] ?? null)};
 const document={activeElement:existingNote};
 const code=main.slice(start,end)+'\n({snapshotCaptureDraft,restoreCaptureDraft,resetAfterSuccess:()=>{captureDraft={title:"",note:"",noteOpen:false};dashboardCaptureDraft="";captureSkipNextSnapshot=true;},getDraft:()=>captureDraft})';
 const api=vm.runInNewContext(code,{app,document,requestAnimationFrame:fn=>fn()});
 return {api,details,current,form,existingNote,existingTitle,existingDashboard,replace:next=>Object.assign(current,next)};
}

test('Quick Capture retains the complete title, note, open details and focus across background rerenders',()=>{
 const {api,existingNote,replace}=prepare();
 const focus=api.snapshotCaptureDraft();
 assert.equal(focus.id,'capture-modal-note');
 assert.equal(focus.start,5);
 const title={id:'capture-modal-input',value:'',focus:()=>{},setSelectionRange:()=>{}};
 const note={id:'capture-modal-note',value:'',focus(){this.wasFocused=true},setSelectionRange(a,b){this.range=[a,b]}};
 const dashboard={id:'capture',value:'',focus:()=>{},setSelectionRange:()=>{}};
 const details={open:false};
 replace({modal:{elements:{title,note},querySelector:()=>details},title,note,dashboard});
 api.restoreCaptureDraft(focus);
 assert.equal(title.value,'Learnly: Umfrage bei den Schulen');
 assert.equal(note.value,'Interview und Auswertung');
 assert.equal(dashboard.value,'Idee für morgen');
 assert.equal(details.open,true);
 assert.equal(note.wasFocused,true);
 assert.deepEqual(note.range,[5,5]);
 assert.equal(existingNote.value,'Interview und Auswertung');
});

test('Quick Capture clears drafts after successful capture without reading the submitted form back',()=>{
 const {api,replace}=prepare();
 api.snapshotCaptureDraft();
 api.resetAfterSuccess();
 const title={id:'capture-modal-input',value:'old submitted value'};
 const note={id:'capture-modal-note',value:'old submitted note'};
 replace({modal:{elements:{title,note},querySelector:()=>({open:true})},title,note,dashboard:null});
 api.snapshotCaptureDraft();
 assert.equal(api.getDraft().title,'');
 assert.equal(api.getDraft().note,'');
});

test('Quick Capture preserves draft across close/reopen; hotkeys and unrelated render do not force closure',()=>{
 assert.match(main,/captureDraft=\{title:form\.elements\.title\?\.value/);
 assert.match(main,/const captureFocus=snapshotCaptureDraft\(\)/);
 assert.match(main,/app\.innerHTML=html;bind\(\);restoreCaptureDraft\(captureFocus\)/);
 assert.match(main,/captureNeedsInitialFocus=!captureOverlayOpen/);
 assert.match(main,/captureSkipNextSnapshot=true/);
 assert.doesNotMatch(main,/sessionStorage\.setItem\([^\n]*captureDraft/);
 assert.match(main,/Entwurf bleibt beim Schließen bis zur Erfassung erhalten/);
});
