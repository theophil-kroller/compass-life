import {parseTags} from './tasks.js';
const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('de').trim().replace(/^#/,'');
export function tagCatalog(state){
 const map=new Map();
 const add=(tag,type='tag',label='')=>{const key=parseTags([tag])[0];if(!key)return;const old=map.get(key);if(!old||type==='person')map.set(key,{tag:key,type,label:label||key});};
 for(const p of Object.values(state?.people||{}))add(p.tag,'person',p.name);
 for(const t of Object.values(state?.tasks||{})){for(const x of t.tags||[])add(x);for(const x of t.contextTags||[])add(x);}
 for(const r of Object.values(state?.records||{})){for(const x of r.tags||[])add(x);}
 return [...map.values()];
}
export function suggestTags(state,query='',limit=7){
 const catalog=tagCatalog(state),q=norm(query),recent=(state?.recentTags||[]).map(norm);
 return catalog.filter(x=>!q||norm(x.tag).includes(q)||norm(x.label).includes(q))
  .sort((a,b)=>{
   const rank=x=> (x.type==='person'?30:0) + (recent.includes(x.tag)?20-Math.min(recent.indexOf(x.tag),15):0)+(q&&(norm(x.tag).startsWith(q)||norm(x.label).startsWith(q))?25:0);
   return rank(b)-rank(a)||a.label.localeCompare(b.label,'de');
  }).slice(0,limit);
}
export function applyTagSuggestion(value,suggestion){const parts=String(value||'').split(/[,;\n]+/);parts[parts.length-1]=suggestion;return parseTags(parts).join(', ');}
export function rememberTag(state,tag){const t=parseTags([tag])[0];if(!t)return;state.recentTags=[t,...(state.recentTags||[]).filter(x=>x!==t)].slice(0,20);}
/** Shared progressive enhancement of existing comma-separated tag inputs. */
export function wireSmartTags(root,getState){
 for(const input of root.querySelectorAll('input[data-smart-tags]')){
  if(input.dataset.tagsBound==='yes')continue;input.dataset.tagsBound='yes';input.autocomplete='off';
  const wrap=document.createElement('div');wrap.className='smart-tags-wrap';input.parentNode.insertBefore(wrap,input);wrap.appendChild(input);
  const menu=document.createElement('div');menu.className='smart-tags-menu';menu.setAttribute('role','listbox');menu.hidden=true;wrap.append(menu);
  let options=[],index=0;
  const segment=()=>input.value.split(/[,;\n]/).at(-1).trim();
  const refresh=()=>{const existing=parseTags(input.value.split(/[,;\n]/).slice(0,-1)); options=suggestTags(getState(),segment()).filter(x=>!existing.includes(x.tag));index=0;
   menu.innerHTML='';for(const [i,opt] of options.entries()){const b=document.createElement('button');b.type='button';b.className='smart-tag-option';b.setAttribute('role','option');b.setAttribute('aria-selected',String(i===index));
    const label=document.createElement('span');label.textContent=opt.type==='person'?'👤 '+opt.label:'#'+opt.tag;const sub=document.createElement('small');sub.textContent=opt.type==='person'?'Person · #'+opt.tag:'Tag';b.append(label,sub);
    b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>choose(i));menu.append(b);}
   menu.hidden=!options.length;};
  const choose=(i)=>{if(!options[i])return;const tag=options[i].tag;input.value=applyTagSuggestion(input.value,tag);menu.hidden=true;input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();};
  input.addEventListener('focus',refresh);input.addEventListener('input',refresh);
  input.addEventListener('keydown',e=>{if(menu.hidden)return;if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();index=(index+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;[...menu.children].forEach((b,i)=>b.setAttribute('aria-selected',String(i===index)));}
   if(e.key==='Enter'&&options.length){e.preventDefault();choose(index);}if(e.key==='Escape')menu.hidden=true;});
  input.addEventListener('blur',()=>{setTimeout(()=>{menu.hidden=true;},120);});
 }
}
