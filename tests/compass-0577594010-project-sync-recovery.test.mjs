import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {syncProjectWithTrash410} from '../client/src/project-sync-recovery-v577594010.js';
import {validProjectPayload} from '../worker/src/projects.js';

const sample={id:'123e4567-e89b-42d3-a456-426614174000',title:'Entferntes Projekt',outcome:'',category:'Allgemein',status:'deleted',dueDate:null,reviewIntervalDays:7,reviewedAt:null,kind:'project',folderIcon:null,projectType:'parallel',parentId:null,sortOrder:0,isTemplate:false,baseVersion:3};
function api(initial='active',version=3){
 let row={...sample,status:initial,version};const calls=[];
 const send=async p=>{
  calls.push({...p});
  assert.equal(validProjectPayload(p),true,'All transitions use valid worker project schema');
  if(p.status==='deleted'&&row.status!=='trash'){const err=new Error('project-not-in-trash');err.status=400;throw err;}
  if(p.baseVersion!==row.version){const err=new Error('project-conflict');err.status=409;throw err;}
  row={...row,...p,version:row.version+1};return {project:row};
 };
 return {send,calls,get row(){return row;}};
}

test('Already-trashing project permanently deletes in one server request',async()=>{
 const x=api('trash'),ack=[];
 const r=await syncProjectWithTrash410(sample,x.send,v=>ack.push(v));
 assert.equal(r.project.status,'deleted');assert.equal(r.project.version,4);
 assert.deepEqual(x.calls.map(p=>p.status),['deleted']);assert.deepEqual(ack,[]);
});

test('Repeated fast delete from active cloud uses verified trash then permanent delete',async()=>{
 const x=api(),versions=[];
 const r=await syncProjectWithTrash410(sample,x.send,v=>{versions.push(v);});
 assert.equal(r.project.status,'deleted');assert.equal(x.row.version,5);
 assert.deepEqual(x.calls.map(p=>p.status),['deleted','trash','deleted']);
 assert.deepEqual(x.calls.map(p=>p.baseVersion),[3,3,4]);assert.deepEqual(versions,[4]);
});

test('Network outage after staging never loses retry version or removes local deletion intent',async()=>{
 const x=api();let savedVersion=sample.baseVersion,throwOnce=true;
 const flaky=async p=>{if(p.status==='deleted'&&p.baseVersion===4&&throwOnce){throwOnce=false;throw Error('offline');}return x.send(p);};
 await assert.rejects(syncProjectWithTrash410(sample,flaky,v=>{savedVersion=v;}),/offline/);
 assert.equal(savedVersion,4);assert.equal(x.row.status,'trash');
 const r=await syncProjectWithTrash410({...sample,baseVersion:savedVersion},x.send,v=>{savedVersion=v;});
 assert.equal(r.project.status,'deleted');assert.deepEqual(x.calls.map(p=>p.status),['deleted','trash','deleted']);
});

test('A conflicting remote version is NEVER overwritten or forced through',async()=>{
 const x=api('active',6);
 await assert.rejects(syncProjectWithTrash410(sample,x.send,()=>{}),e=>e.status===409);
 assert.equal(x.row.status,'active');assert.deepEqual(x.calls.map(p=>p.status),['deleted','trash']);
});

test('User undo during staging postpones final irreversible deletion',async()=>{
 const x=api();let localUnchanged=true;
 const r=await syncProjectWithTrash410(sample,x.send,()=>{localUnchanged=false;},()=>localUnchanged);
 assert.equal(r.deferred,true);assert.equal(x.row.status,'trash');
 assert.deepEqual(x.calls.map(p=>p.status),['deleted','trash']);
});

test('Other project status updates are a single write and do not stage trash',async()=>{
 const x=api();const r=await syncProjectWithTrash410({...sample,status:'archived'},x.send,()=>{});
 assert.equal(r.project.status,'archived');assert.equal(x.calls.length,1);
});

test('Integrated full Vite source has staged acknowledgement and .40.10 version',async()=>{
 const root=new URL('../',import.meta.url);
 const config=readFileSync(new URL('client/vite.config.js',root),'utf8');
 const map=new Map([...config.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*'\.\/(.+?\.js)'/g)].map(x=>[x[1],x[2]]));
 const names=[...config.matchAll(/\b([a-zA-Z]\w*(?:Bridge|Release))\(\)/g)].map(x=>x[1]);
 assert.equal(names.at(-1),'compass594010ProjectSyncRecoveryRelease');
 let src=readFileSync(new URL('client/src/main.js',root),'utf8');
 for(const name of names){const mod=await import(new URL('../client/'+map.get(name),import.meta.url));const res=mod[name]().transform(src,'/repo/client/src/main.js');if(res?.code)src=res.code;}
 execFileSync(process.execPath,['--input-type=module','--check'],{input:src});
 assert.match(src,/COMPASS_CLIENT_VERSION='0\.5\.77\.59\.40\.10'/);
 assert.match(src,/syncProjectWithTrash410\(payload,/);
 assert.match(src,/state\.projectVersions\[id\]=version;await persist\(\)/);
 assert.match(src,/if\(data\.deferred\)continue;/);
 assert.match(src,/data-action="p48-view-trash"/);
});
