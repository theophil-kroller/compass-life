import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,copyFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {strengthTouch735Bridge} from '../client/strength-touch735-bridge.js';
import {strengthNutrition732Bridge} from '../client/strength-nutrition732-bridge.js';
const bridge=strengthTouch735Bridge();
const strengthOriginal=readFileSync(new URL('../client/src/strength-insights-v57728.js',import.meta.url),'utf8');
const strengthAfter32=strengthNutrition732Bridge().transform(strengthOriginal,'/some/client/src/strength-insights-v57728.js').code;
function patched(content,path){return bridge.transform(content,'/some/client/src/'+path)?.code;}
const touchBefore=`export const TOUCH_KINDS=Object.freeze([
 {id:'hug',icon:'🫂',name:'Umarmung'}, {id:'dance',icon:'💃',name:'Tanzen'},
 {id:'cuddle',icon:'🤗',name:'Kuscheln'}, {id:'kiss',icon:'💋',name:'Küssen'},
 {id:'sex',icon:'❤️',name:'Sex / Intimität'}, {id:'sleep',icon:'🌙',name:'Zusammen einschlafen'},
]);
export function putTouch(state,{id,kind,kinds,at,personId='',person='',note='',deleted=false}={}){
 const row={note:String(note||'').trim().slice(0,500),deleted:!!deleted,updatedAt:new Date().toISOString()};return row;
}
export function touchQuickView(){return \`<label>Notiz<input name="note" maxlength="500" placeholder="Optional"></label>\`;}
export function touchHistoryView(state,{period=30}={}){const edit={note:'',experience:''};return \`<label>Notiz<textarea name="note" maxlength="500" rows="2">\${esc(edit.note)}</textarea></label><section class="work-card"><h3>Chronik</h3>\`;}
`;
const mainBefore=`import './anti-aging-eight-v57734.css';
const COMPASS_CLIENT_VERSION='0.5.77.34';
const tabs=compactInsights.map(([id,label,icon])=>\`<button>\${ico(icon,16)}<span>\${label}</span></button>\`);
const nav=\`\${ico('activity',19)}<span>Krafttraining</span>\`;
const edit=async()=>{await mutate(s=>putTouch(s,{id:String(fd.get('id')),kinds:fd.getAll('kinds'),at:dateValue.toISOString(),personId,person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||'')}));touchEditingId='';};
const capture=async()=>{await mutate(s=>putTouch(s,{kinds:fd.getAll('kinds'),at:when.toISOString(),personId,person:state?.people?.[personId]?.name||'',note:String(fd.get('note')||'')}));
  touchQuickOpen=false;};`;
test('SVG now renders front and rear concurrently, roles & load modes separate',()=>{
 const result=patched(strengthAfter32,'strength-insights-v57728.js');
 assert.match(result,/str735-two-maps/);assert.match(result,/bodySvg\(m,'front',side==='back'\?'load':'roles'\)/);
 assert.match(result,/bodySvg\(m,'back',side==='back'\?'load':'roles'\)/);
 assert.match(result,/#EA493B/);assert.match(result,/#F2C94C/);
 assert.match(result,/function bodySvg\(model,side,mode='roles'\)/);
});
test('touch kinds include massage and stroking and retain one existing dance choice',()=>{
 const result=patched(touchBefore,'touch-journal-v577.js');
 assert.equal((result.match(/id:'dance'/g)||[]).length,1);
 assert.match(result,/id:'stroke'/);assert.match(result,/id:'massage'/);
 assert.match(result,/experience:\['pleasant','neutral','unpleasant','unsure'\]/);
 assert.match(result,/touchAnalyticsView\(state,\{period\}\)/);
 assert.match(result,/Wie hast du es erlebt/);
});
test('main navigation uses biceps icon on desktop and compact view; experience passes to vault',()=>{
 const result=patched(mainBefore,'main.js');
 assert.match(result,/COMPASS_CLIENT_VERSION='0.5.77.35'/);
 assert.match(result,/str735-menu-icon/);
 assert.match(result,/💪/);
 assert.equal((result.match(/fd.get\('experience'\)/g)||[]).length,2);
});
test('guarded bridges fail loudly on mismatched source',()=>{
 assert.throws(()=>patched('export const broken=true;','touch-journal-v577.js'),/Integrationsanker/);
});
test('touch timeline differentiates documented events from unknown days; no inferred well-being',async()=>{
 const root=mkdtempSync(join(tmpdir(),'compass-touch735-'));
 mkdirSync(join(root,'client','src'),{recursive:true});
 const stub=`export const TOUCH_KINDS=[{id:'dance',name:'Tanzen',icon:'💃'},{id:'massage',name:'Massage',icon:'💆'},{id:'stroke',name:'Streicheln',icon:'🖐️'}];
export const touchKinds=row=>row.kinds||[];
export function touchEntries(s){return s.touchJournal?.entries||[];}`;
 writeFileSync(join(root,'package.json'),'{"type":"module"}');
 writeFileSync(join(root,'client','src','touch-journal-v577.js'),stub);
 copyFileSync(new URL('../client/src/touch-insights-v57735.js',import.meta.url),join(root,'client','src','touch-insights-v57735.js'));
 const {touchObservations,touchAnalyticsView}=await import('file://'+join(root,'client','src','touch-insights-v57735.js'));
 const state={touchJournal:{entries:[{at:'2026-10-23T20:00:00+02:00',kinds:['dance'],experience:''},{at:'2026-10-24T12:00:00+02:00',kinds:['massage','stroke'],experience:'pleasant'}]}};
 const m=touchObservations(state,{period:7,today:'2026-10-24'});
 assert.equal(m.entries.length,2);assert.equal(m.loggedDays,2);assert.equal(m.byKind.get('massage'),1);assert.equal(m.byKind.get('stroke'),1);
 assert.equal(m.dates[0].entries,null);assert.equal(m.experienced,1);
 const html=touchAnalyticsView(state,{period:7,today:'2026-10-24'});
 assert.match(html,/kein Eintrag \(unbekannt\)/);assert.match(html,/Angenehm: 1/);assert.match(html,/Tanzen kann ohne unmittelbaren Körperkontakt/);
});
test('render muscle map with empty and annotated data without fabricated activation',async()=>{
 const root=mkdtempSync(join(tmpdir(),'compass-str735-'));
 mkdirSync(join(root,'client','src'),{recursive:true});
 writeFileSync(join(root,'package.json'),'{"type":"module"}');
 const muscles=['chest','back','shoulders','biceps','triceps','forearms','core','quads','posterior','glutes','calves'];
 writeFileSync(join(root,'client','src','garmin-strength-v57728.js'),`export const MUSCLE_GROUPS=${JSON.stringify(muscles.map(id=>({id,label:id})))};
export const strengthMuscles=()=>({name:'Unknown',primary:null,secondary:[]});
export const mergeStrengthImports=(_,incoming)=>incoming;`);
 writeFileSync(join(root,'client','src','strength-editor-v57732.js'),`export const applyStrengthAnnotations=(state,rows)=>rows;
export const manualExerciseMuscles=id=>id==='hip-thrust'?{name:'Hip Thrust',primary:'glutes',secondary:['posterior']}:id==='curl-to-press'?{name:'Curl to Press',primary:'biceps',secondary:['shoulders','triceps']}:({name:'Unknown',primary:null,secondary:[]});
export const strengthEditorView=()=>'<section class="str732-editor">Editor</section>';`);
 const modified=patched(strengthAfter32,'strength-insights-v57728.js');
 writeFileSync(join(root,'client','src','strength-insights-v57728.js'),modified);
 const {strengthInsightsView}=await import('file://'+join(root,'client','src','strength-insights-v57728.js'));
 const today='2026-10-24';
 const empty=strengthInsightsView({healthImports:{}},{range:'7',today});
 assert.match(empty,/Vorne/);assert.match(empty,/Hinten/);assert.match(empty,/str735-body-legend/);
 assert.match(empty,/Nicht zugeordnet/);
 const state={healthImports:{garminStrength:[{id:'1',start:'2026-10-23T09:00:00Z',day:'2026-10-23',sets:[{index:0,exercise:'Hip Thrust',exerciseId:'hip-thrust',reps:10,weightKg:25},{index:1,exercise:'Curl to Press',exerciseId:'curl-to-press',reps:10,weightKg:15}],reportedSets:2}]}};
 const sample=strengthInsightsView(state,{range:'7',side:'front',today});
 assert.match(sample,/Hauptmuskel/);assert.match(sample,/Unterstützend/);
 assert.match(sample,/Hip Thrust/);assert.match(sample,/Curl to Press/);
 const load=strengthInsightsView(state,{range:'7',side:'back',today});
 assert.match(load,/Satzbelastung/);assert.match(load,/Wenige Sätze/);
});
test('touch-module imports remain circular-safe; new options persist without inferring values',async()=>{
 const root=mkdtempSync(join(tmpdir(),'compass-touch-import735-'));
 mkdirSync(join(root,'client','src'),{recursive:true});
 writeFileSync(join(root,'package.json'),'{"type":"module"}');
 const source=patched(touchBefore+'\nexport const touchKinds=row=>row?.kinds||[];\nexport const touchEntries=state=>state?.touchJournal?.entries||[];\n','touch-journal-v577.js');
 writeFileSync(join(root,'client','src','touch-journal-v577.js'),source);
 copyFileSync(new URL('../client/src/touch-insights-v57735.js',import.meta.url),join(root,'client','src','touch-insights-v57735.js'));
 const {putTouch,TOUCH_KINDS}=await import('file://'+join(root,'client','src','touch-journal-v577.js'));
 const state={};const row=putTouch(state,{kind:'massage',at:'2026-10-24T12:00:00Z',experience:'pleasant'});
 assert.equal(row.experience,'pleasant');
 assert.equal(TOUCH_KINDS.filter(x=>x.id==='dance').length,1);
 const invalid=putTouch(state,{kind:'stroke',at:'2026-10-24T12:00:00Z',experience:'made-up'});
 assert.equal(invalid.experience,'');
});
