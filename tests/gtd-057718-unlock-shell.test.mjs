import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {isDreamRecord} from '../client/src/tasks.js';

const src=fs.readFileSync(new URL('../client/src/main.js',import.meta.url),'utf8');
const start=src.indexOf('function chrome(content){');
const end=src.indexOf('\nfunction moduleCard(',start);
assert.ok(start>0&&end>start,'global navigation shell must exist');
const source=src.slice(start,end).trim();

function unlockedShell(records){
  const helpers=(src.match(/import\s*\{([^}]*)\}\s*from\s*['"]\.\/tasks\.js['"]/s)||[])[1]||'';
  // This is the contract that 0.5.77.17 violated: the shell calls a helper
  // which was exported by tasks.js but absent from the actual main.js imports.
  assert.match(helpers,/(?:^|,)\s*isDreamRecord\s*(?:,|$)/);
  const state={format:1,records,pending:[],projects:{},tasks:{}};
  const noop=()=>'';
  const ctx={
    state,isDreamRecord,tab:'today',selectedDay:'2026-10-23',localDateString:()=> '2026-10-23',
    ico:noop,h:input=>String(input??''),navItem:(id,label,icon,{count}={})=>`<nav-item data-id="${id}" data-count="${count}">${label}</nav-item>`,
    COMPASS_CLIENT_VERSION:'0.5.77.18',calmNavGroup:'',insightTab:'sleep',financePane:'Überblick',
    FINANCE_GROUPS:[],financeGroupForPane:()=>({title:'Überblick'}),
    weather:{status:'idle',city:'Graz'},worktimeQuickButton:noop,habitQuickButton:noop,
    authToken:'',journalSyncStatus:'lokal',hasVault:true,sealedCaptureAvailable:false,
    notice:'',error:'',captureOverlayOpen:false,feelingOverlayOpen:false,worktimeQuickOpen:false,
    habitQuickOpen:false,nutritionQuickOpen:false,touchQuickOpen:false,morningPlayerOpen:false
  };
  const render=vm.runInNewContext(`(${source})`,ctx);
  return render('<p>Nach dem Entsperren sichtbar</p>');
}

test('0.5.77.18: decrypted vault paints navigation even when inbox is empty',()=>{
  const html=unlockedShell({});
  assert.match(html,/Nach dem Entsperren sichtbar/);
  assert.match(html,/data-id="inbox" data-count="0"/);
});

test('0.5.77.18: decrypted vault filters archived and dreams from Inbox counter',()=>{
  const html=unlockedShell({
    a:{id:'a',title:'Noch offen',deleted:false,tags:[]},
    b:{id:'b',title:'Verworfen',deleted:true,tags:[]},
    c:{id:'c',title:'Someday',deleted:false,tags:['dreams']}
  });
  assert.match(html,/data-id="inbox" data-count="1"/);
});
