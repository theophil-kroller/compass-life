import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nutritionEntryInspectorView,nutritionInsightsView} from '../client/src/personal-journal-v5692.js';
import {nutritionWorkspace4017} from '../client/src/nutrition-focus-v577594017.js';
const read = p=>readFileSync(new URL(p,import.meta.url),'utf8');
const state={nutritionJournal:{entries:[{id:'eat1',foodId:'banana',at:'2026-10-31T12:34:00.000Z',amount:'1 Banane',note:'Gut'}]}};
test('inspector shows recorded date time above amount and notes, with save and close',()=>{
 const html=nutritionEntryInspectorView(state,{editingId:'eat1'});
 assert.match(html,/ni81-inspector/);
 assert.match(html,/name="at"/);
 assert.match(html,/id="pj92-food-detail-form"/);
 assert.match(html,/data-action="pj92-food-edit-cancel"/);
 assert.match(html,/data-action="pj92-food-delete"/);
 assert.ok(html.indexOf('name="at"')<html.indexOf('name="amount"'));
 assert.match(html,/Gut/);
});
test('inspector absent without selection and old journal has no duplicate edit form',()=>{
 assert.equal(nutritionEntryInspectorView(state,{editingId:''}), '');
 const html=nutritionInsightsView(state,{period:7,editingId:'eat1'});
 assert.doesNotMatch(html,/id="pj92-food-detail-form"/);
 assert.match(html,/data-action="pj92-food-edit"/);
});
test('inspector handles missing entries and user-provided HTML safely',()=>{
 assert.equal(nutritionEntryInspectorView(state,{editingId:'missing'}),'');
 const bad={nutritionJournal:{entries:[{id:'x',foodId:'banana',at:'2026-10-31T12:00:00.000Z',amount:'<script>alert(1)</script>',note:'<img onerror=alert(1)>'}]}};
 const html=nutritionEntryInspectorView(bad,{editingId:'x'});
 assert.doesNotMatch(html,/<script>|<img onerror=/);
 assert.match(html,/&lt;script&gt;/);
});
test('nutrition workspace mounts selected inspector directly, outside collapsed details',()=>{
 const renderSection=()=>'',renderHistory=()=>'',renderJournal=()=>'<div id="journal"></div>',renderEditor=()=>'<aside id="right-inspector"></aside>',renderManualDozen=()=>'',renderSync=()=>'',renderMensa=()=>'';
 const html=nutritionWorkspace4017(state,{day:'2026-10-31',view:'journal',editingId:'eat1',renderSection,renderHistory,renderJournal,renderEditor,renderManualDozen,renderSync,renderMensa});
 assert.match(html, /id="right-inspector"/);
 assert.ok(html.indexOf('id="right-inspector"')>html.lastIndexOf('nf4017-body'));
 assert.match(read('../client/src/nutrition-entry-inspector-v0581.css'),/position:fixed/);
 assert.match(read('../client/src/main-full-v57759402510.js'),/renderEditor:\(\)=>nutritionEntryInspectorView/);
});
