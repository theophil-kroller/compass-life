/** Compass .40.8 – synced project lifecycle, non-destructive trash and archive. */
const normalized=s=>String(s||'').trim().normalize('NFKC').toLocaleLowerCase('de');
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const PROJECT_ARCHIVE='archived',PROJECT_TRASH='trash',PROJECT_PURGED='deleted';
export function duplicateProject48(state,{title,parentId,kind='project'}){
 const target=normalized(title),parent=parentId||null;
 return Object.values(state?.projects||{}).find(p=>p&&p.status!==PROJECT_PURGED&&p.status!==PROJECT_TRASH&&normalized(p.title)===target&&(p.parentId||null)===parent&&p.kind===kind)||null;
}
export function ancestorLifecycle48(state,project){
 if(!project)return null;let p=project;const seen=new Set();
 while(p){if(seen.has(p.id))return PROJECT_TRASH;seen.add(p.id);
  if([PROJECT_TRASH,PROJECT_PURGED].includes(p.status))return PROJECT_TRASH;
  if(p.status===PROJECT_ARCHIVE)return PROJECT_ARCHIVE;
  p=p.parentId?state?.projects?.[p.parentId]:null;
 }
 return null;
}
export function visibleInProjectTree48(state,project){return !ancestorLifecycle48(state,project);}
export function lifecycleRows48(state,group){
 const entries=Object.values(state?.projects||{}).filter(p=>p&&p.status!==PROJECT_PURGED);
 return entries.filter(p=>ancestorLifecycle48(state,p)===group && (!p.parentId||ancestorLifecycle48(state,state.projects[p.parentId])!==group))
  .sort((a,b)=>String(a.title).localeCompare(String(b.title),'de'));
}
export function childCount48(state,id){const seen=new Set();const visit=pid=>{
  for(const p of Object.values(state?.projects||{})){if(p?.parentId!==pid||p.status===PROJECT_PURGED||seen.has(p.id))continue;seen.add(p.id);visit(p.id);}
 };visit(id);return seen.size;}
export function taskCount48(state,id){const ids=new Set([id]);const visit=x=>{for(const p of Object.values(state?.projects||{})){if(p?.parentId===x&&!ids.has(p.id)){ids.add(p.id);visit(p.id);}}};visit(id);
 return Object.values(state?.tasks||{}).filter(t=>ids.has(t?.projectId)).length;
}
export function canPurgeProject48(state,id){
 const p=state?.projects?.[id];return !!p&&p.status===PROJECT_TRASH&&childCount48(state,id)===0&&taskCount48(state,id)===0&&!p.isTemplate;
}
export function redactProject48(p){return {...p,title:'Entferntes Projekt',outcome:'',category:'Allgemein',status:PROJECT_PURGED,dueDate:null,reviewedAt:null,parentId:null,isTemplate:false,folderIcon:p.kind==='folder'?'folder':null};}
export function projectIcon48(p){
 if(p?.kind==='folder' && (!p.folderIcon||p.folderIcon==='folder')){
  if(/einkaufslisten?/i.test(p.title||''))return 'cart';
  if(/check[ -]?listen?/i.test(p.title||''))return 'checkSquare';
 }
 if(p?.kind==='project'&&/check[ -]?listen?/i.test(p.title||''))return 'checkSquare';
 return p?.kind==='folder'?'folder':'list';
}
export function projectVaultPanel48(state,group,ico){
 const list=lifecycleRows48(state,group),archived=group===PROJECT_ARCHIVE;
 const rows=list.map(p=>`<div class="p48-row"><div class="p48-title">${ico(p.kind==='folder'?'folder':'list',17)} <span>${safe(p.title)}<small>${p.kind==='folder'?'Ordner':'Projekt'} · ${childCount48(state,p.id)} Unterprojekte · ${taskCount48(state,p.id)} Aufgaben</small></span></div><div class="p48-actions"><button type="button" data-action="p48-restore" data-id="${safe(p.id)}">Wiederherstellen</button>${archived?`<button type="button" data-action="p48-trash" data-id="${safe(p.id)}">In Papierkorb</button>`:canPurgeProject48(state,p.id)?`<button type="button" class="p48-danger" data-action="p48-purge" data-id="${safe(p.id)}">Endgültig löschen</button>`:`<span class="p48-muted" title="Zum endgültigen Löschen zuerst Unterprojekte und Aufgaben anders zuordnen">Nicht leer · erst Inhalte verschieben</span>`}</div></div>`).join('');
 return `<section class="p48-vault"><div class="p48-heading"><strong>${ico(archived?'archive':'trash',18)} ${archived?'Archiv':'Papierkorb'}</strong><button type="button" data-action="p48-close">Schließen ×</button></div>${rows||`<p>Der ${archived?'Archivbereich':'Papierkorb'} ist leer.</p>`}<small>Ein Ordner nimmt seine Unterprojekte mit ins ${archived?'Archiv':'Papierkorb'}. Wiederherstellen lässt Aufgaben und Projektstruktur unverändert.</small></section>`;
}
