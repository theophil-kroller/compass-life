export async function request(apiUrl, token, path, opts={}) {
  if (!/^https:\/\//.test(apiUrl) && !/^http:\/\/127\.0\.0\.1:/.test(apiUrl))
    throw new Error('Die API-Adresse muss HTTPS verwenden (Ausnahme: lokaler Test).');
  const res=await fetch(`${apiUrl.replace(/\/$/,'')}${path}`,{
    ...opts,
    headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json',...(opts.headers||{})},
    cache:'no-store'
  });
  let data={};try{data=await res.json();}catch{}
  if(!res.ok) {const error=new Error(data.error||`HTTP ${res.status}`);error.status=res.status;throw error;}
  return data;
}
// One mutation per item in a batch. Multiple offline edits on the same item are
// subsequently sent in sequence, preserving stable mutation IDs across retries.
export function nextBatch(pending,max=25) {
  const ids=new Set();const batch=[];
  for(const m of pending) {
    if(ids.has(m.id))continue;
    ids.add(m.id);batch.push(m);
    if(batch.length===max)break;
  }
  return batch;
}
export function applyResult(state,result) {
  const index=state.pending.findIndex(x=>x.mutationId===result.mutationId);
  if(index<0)return;
  const pending=state.pending[index];
  if(result.status==='applied'||result.status==='duplicate') {
    state.serverVersions[pending.id]=result.version;
    state.pending.splice(index,1);
  }else if(result.status==='conflict') {
    state.conflicts=state.conflicts.filter(x=>x.id!==pending.id);
    state.conflicts.push({id:pending.id,local:{...state.records[pending.id]},remote:result.remote});
    state.pending=state.pending.filter(x=>x.id!==pending.id);
  }
}
export function mergePulled(state,changes) {
  for(const remote of changes) {
    const pending=state.pending.some(m=>m.id===remote.id);
    const already=state.conflicts.some(c=>c.id===remote.id);
    const known=state.serverVersions[remote.id]||0;
    if(pending) {
      if(remote.version>known && !already)state.conflicts.push({id:remote.id,local:{...state.records[remote.id]},remote});
      continue;
    }
    if(already)continue;
    if(remote.version>=known) {
      state.records[remote.id]={id:remote.id,title:remote.title,note:remote.note,
        deleted:remote.deleted,updatedAt:remote.updatedAt};
      state.serverVersions[remote.id]=remote.version;
    }
  }
}
