/* Compass 0.5.77.59.9 · Progressive keyboard navigation for GTD views.
 * Does not read or change vault, tasks, persistence, sync or Vite bridges.
 * Uses only established data-action buttons; all keyboard shortcuts are opt-in.
 */
(()=>{
  'use strict';
  if(typeof document==='undefined')return;
  const editable=el=>!!(el?.closest?.('input,textarea,select,[contenteditable="true"],[role="textbox"]'));
  const visible=el=>!!(el&&!el.disabled&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  const selectors={
    project:'.compass58-nav-item',
    task:'.compass58-outline [data-action="tree-task-select"]',
    inbox:'.inbox-mvp-row',
    today:'.today-tasks [data-action="task-select"]'
  };
  function context(el){
    if(!el?.closest)return null;
    if(el.closest('.compass58-sidebar,.compass58-mobile-tree'))return ['project',el.closest('.compass58-sidebar,.compass58-mobile-tree')];
    if(el.closest('.compass58-outline'))return ['task',el.closest('.compass58-outline')];
    if(el.closest('.inbox-mvp-list'))return ['inbox',el.closest('.inbox-mvp-list')];
    if(el.closest('.today-tasks'))return ['today',el.closest('.today-tasks')];
    return null;
  }
  function moveFocus(el,direction){
    const ctx=context(el);if(!ctx)return false;
    const [type,region]=ctx;
    const candidates=[...region.querySelectorAll(selectors[type])].filter(visible);
    if(!candidates.length)return false;
    const at=candidates.indexOf(el.closest(selectors[type]));
    const next=candidates[Math.min(candidates.length-1,Math.max(0,at+direction))];
    if(!next)return false;
    next.focus({preventScroll:true});next.scrollIntoView({block:'nearest',inline:'nearest'});
    return true;
  }
  function findProjectNode(el){return el?.closest?.('.compass58-nav-row');}
  function expandProject(el,expand){
    const row=findProjectNode(el), caret=row?.querySelector('[data-action="compass58-folder-expand"]');
    if(!visible(caret))return false;
    if((caret.getAttribute('aria-expanded')==='true')===expand)return false;
    const id=el.closest('[data-id]')?.dataset?.id;
    caret.click();
    requestAnimationFrame(()=>{
      const same=[...document.querySelectorAll('.compass58-nav-item')].find(x=>x.dataset.id===id&&visible(x));
      const active=document.activeElement;
      if(!active||active===document.body||!active.isConnected)same?.focus({preventScroll:true});
    });
    return true;
  }
  function inspectorToggle(){return [...document.querySelectorAll('.compass58-heading-actions [data-action="compass58-inspector-toggle"]')].find(visible)||null;}
  document.addEventListener('keydown',e=>{
    if(e.defaultPrevented||e.isComposing||editable(e.target))return;
    const target=e.target,workspace=document.querySelector('.compass58-workspace');
    if(e.altKey&&e.shiftKey&&!e.ctrlKey&&!e.metaKey&&workspace&&workspace.contains(e.target)){
      if(e.key.toLowerCase()==='i'){
        const toggle=inspectorToggle();if(!toggle)return;
        e.preventDefault();toggle.click();return;
      }
      if(e.key.toLowerCase()==='n'){
        const add=[...workspace.querySelectorAll('.compass58-heading-actions [data-action="tree-add-task"]')].find(visible);
        if(!add)return;
        e.preventDefault();add.click();return;
      }
    }
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
    const button=target?.closest?.('button[data-action],a[data-action]');
    if(e.key==='ArrowUp'||e.key==='ArrowDown'){
      if(button&&moveFocus(button,e.key==='ArrowDown'?1:-1))e.preventDefault();
      return;
    }
    if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&button?.matches('.compass58-nav-item')){
      if(expandProject(button,e.key==='ArrowRight'))e.preventDefault();
      return;
    }
    if(e.key==='Escape'&&workspace?.contains(target)&&workspace.classList.contains('has-inspector')){
      const close=[...workspace.querySelectorAll('.compass58-inspector [data-action="tree-inspector-close"]')].find(visible);
      if(close){e.preventDefault();close.click();}
    }
  });
})();
