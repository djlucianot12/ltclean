'use strict';
(function (global) {
  const qs=(s,c=document)=>c.querySelector(s); const qsa=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const createEl=(t,cls,attrs={})=>{const el=document.createElement(t); if(cls) el.className=cls; for(const[k,v]of Object.entries(attrs)){if(k==='text')el.textContent=v; else if(k==='html')el.innerHTML=v; else el.setAttribute(k,v)} return el;};
  function buildProjectsFromDom(){
    const items=qsa('.project-text'); if(items.length){ return items.map((el,i)=>({ name:(qs('.project-name',el)?.textContent||'').trim(), location:(qs('.project-location',el)?.textContent||'').trim(), image:(Array.isArray(global.PROJECTS)&&global.PROJECTS[i])?global.PROJECTS[i].image:null, url:null, index:i })); }
    if(Array.isArray(global.PROJECTS)&&global.PROJECTS.length){ return global.PROJECTS.map((p,i)=>({name:p.name,location:p.location,image:p.image,url:null,index:i})); }
    return [];
  }
  const LTSDModals={
    _opts:null,_els:{},
    init(opts={}){
      const auto=buildProjectsFromDom();
      const cfg=Object.assign({aboutTitle:'About LT Studio Design',aboutHtml:'<div class="ltsd-about"><p>Agregá tu contenido del About aquí.</p></div>',projects:auto,triggers:{all:'[data-ltsd="all"]',about:'[data-ltsd="about"]'},useGoToProjectHandler:typeof global.goToProject==='function'}, (global.LTSD_MODALS_CONFIG||{}), opts);
      this._opts=cfg; this._createSkeleton(); this._attachTriggers(); this._ensureGlobalFallbacks();
    },
    _createSkeleton(){
      if(!qs('#ltsd-all-modal')){
        const modal=createEl('div','ltsd-modal',{id:'ltsd-all-modal',role:'dialog','aria-modal':'true'});
        const panel=createEl('div','ltsd-modal__panel');
        const header=createEl('div','ltsd-modal__header');
        const title=createEl('div','ltsd-modal__title',{text:'All Projects'});
        const close=createEl('button','ltsd-modal__close',{'aria-label':'Cerrar',text:'×'}); close.addEventListener('click',()=>this.close('all'));
        header.append(title,close);
        const grid=createEl('div','ltsd-projects',{id:'ltsd-projects-grid'});
        panel.append(header,grid); modal.append(panel); document.body.appendChild(modal);
        this._els.all={modal,panel,header,title,close,grid};
      }
      if(!qs('#ltsd-about-modal')){
        const modal=createEl('div','ltsd-modal',{id:'ltsd-about-modal',role:'dialog','aria-modal':'true'});
        const panel=createEl('div','ltsd-modal__panel');
        const header=createEl('div','ltsd-modal__header');
        const title=createEl('div','ltsd-modal__title',{text:this._opts?.aboutTitle||'About'});
        const close=createEl('button','ltsd-modal__close',{'aria-label':'Cerrar',text:'×'}); close.addEventListener('click',()=>this.close('about'));
        header.append(title,close);
        const content=createEl('div','ltsd-about',{id:'ltsd-about-content'});
        panel.append(header,content); modal.append(panel); document.body.appendChild(modal);
        this._els.about={modal,panel,header,title,close,content};
      }
      document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') this.close(); });
      document.addEventListener('click',(e)=>{ ['#ltsd-all-modal','#ltsd-about-modal'].forEach(sel=>{const m=qs(sel); if(m&&m.classList.contains('ltsd-modal--visible')&&e.target===m) this.close();});});
    },
    _attachTriggers(){
      qsa(this._opts.triggers.all).forEach(el=>el.addEventListener('click',(e)=>{e.preventDefault();this.openAll();}));
      qsa(this._opts.triggers.about).forEach(el=>el.addEventListener('click',(e)=>{e.preventDefault();this.openAbout();}));
      qsa('[onclick*="showAllProjects"]').forEach(el=>el.addEventListener('click',(e)=>{e.preventDefault();this.openAll();}));
      qsa('[onclick*="showAbout"]').forEach(el=>el.addEventListener('click',(e)=>{e.preventDefault();this.openAbout();}));
      qsa('a,button,div,span').forEach(el=>{ const t=(el.textContent||'').trim().toLowerCase(); if(t==='all'&&!el.hasAttribute('data-ltsd')) el.addEventListener('click',(e)=>{e.preventDefault();this.openAll();}); if(t==='about'&&!el.hasAttribute('data-ltsd')) el.addEventListener('click',(e)=>{e.preventDefault();this.openAbout();}); });
    },
    _ensureGlobalFallbacks(){
      if(typeof global.showAllProjects!=='function') global.showAllProjects=()=>this.openAll();
      if(typeof global.closeAllProjects!=='function') global.closeAllProjects=()=>this.close('all');
      if(typeof global.showAbout!=='function') global.showAbout=()=>this.openAbout();
      if(typeof global.closeAbout!=='function') global.closeAbout=()=>this.close('about');
    },
    openAll(){
      const el=this._els.all||{modal:qs('#ltsd-all-modal'),grid:qs('#ltsd-projects-grid'),title:qs('#ltsd-all-modal .ltsd-modal__title')};
      if(!el.modal||!el.grid) return; el.title.textContent='All Projects'; el.grid.innerHTML='';
      const list=(Array.isArray(this._opts.projects)&&this._opts.projects.length)?this._opts.projects:buildProjectsFromDom();
      list.forEach((p,i)=>{ const card=createEl('div','ltsd-card',{'data-index':String(i)}); const bg=p.image||(Array.isArray(global.PROJECTS)&&global.PROJECTS[i]?global.PROJECTS[i].image:null); if(bg) card.style.backgroundImage=`url("${bg}")`; const overlay=createEl('div','ltsd-card__overlay'); overlay.append(createEl('div','ltsd-card__title',{text:p.name||`Proyecto ${i+1}`}), createEl('div','ltsd-card__location',{text:p.location||''})); card.append(overlay); card.addEventListener('click',()=>{ if(this._opts.useGoToProjectHandler&&typeof global.goToProject==='function'&&Number.isInteger(p.index)) global.goToProject(p.index); else if(p.url) window.location.href=p.url;}); el.grid.append(card); });
      el.modal.classList.add('ltsd-modal--visible');
    },
    openAbout(){
      const el=this._els.about||{modal:qs('#ltsd-about-modal'),content:qs('#ltsd-about-content'),title:qs('#ltsd-about-modal .ltsd-modal__title')};
      if(!el.modal||!el.content) return; el.title.textContent=this._opts.aboutTitle||'About'; el.content.innerHTML=this._opts.aboutHtml||'<div class="ltsd-about"><p>Agregá tu contenido del About aquí.</p></div>'; el.modal.classList.add('ltsd-modal--visible');
    },
    close(which){
      const all=qs('#ltsd-all-modal'); const about=qs('#ltsd-about-modal');
      if(!which||which==='all') all&&all.classList.remove('ltsd-modal--visible');
      if(!which||which==='about') about&&about.classList.remove('ltsd-modal--visible');
    }
  };
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }
  ready(()=>{ try{ LTSDModals.init(); }catch(e){} });
  global.LTSDModals=LTSDModals;
})(window);
