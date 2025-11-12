(function (global) {
  function qs(s,c){return (c||document).querySelector(s)} function qsa(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
  function el(t,c,a){var e=document.createElement(t); if(c)e.className=c; if(a){for(var k in a){if(k==='text')e.textContent=a[k]; else if(k==='html')e.innerHTML=a[k]; else e.setAttribute(k,a[k]);}} return e;}
  function fromDom(){
    var items=qsa('.project-text'); if(items.length){return items.map(function(n,i){var nm=qs('.project-name',n);var lc=qs('.project-location',n);
      var img=(global.PROJECTS&&global.PROJECTS[i])?global.PROJECTS[i].image:null; return {name:nm?nm.textContent.trim():'',location:lc?lc.textContent.trim():'',image:img,index:i};});}
    if(Array.isArray(global.PROJECTS)) return global.PROJECTS.map(function(p,i){return {name:p.name,location:p.location,image:p.image,index:i};});
    return [];
  }
  var M={_o:null,_els:{},
    init:function(o){var auto=fromDom(); this._o=Object.assign({aboutTitle:'About LT Studio Design',aboutHtml:'<div class="ltsd-about"><p>Agregá tu contenido del About aquí.</p></div>',projects:auto,triggers:{all:'[data-ltsd="all"]',about:'[data-ltsd="about"]'},useGoToProjectHandler:typeof global.goToProject==='function'}, (global.LTSD_MODALS_CONFIG||{}), o||{});
      this._shell(); this._bind(); this._globals();},
    _shell:function(){
      if(!qs('#ltsd-all-modal')){var m=el('div','ltsd-modal',{id:'ltsd-all-modal',role:'dialog','aria-modal':'true'}), p=el('div','ltsd-modal__panel'),
        h=el('div','ltsd-modal__header'), t=el('div','ltsd-modal__title',{text:'All Projects'}), x=el('button','ltsd-modal__close',{'aria-label':'Cerrar',text:'×'});
        x.onclick=this.close.bind(this,'all'); h.appendChild(t);h.appendChild(x); var g=el('div','ltsd-projects',{id:'ltsd-projects-grid'}); p.appendChild(h);p.appendChild(g); m.appendChild(p); document.body.appendChild(m);
        this._els.all={m:m,p:p,h:h,t:t,x:x,g:g};}
      if(!qs('#ltsd-about-modal')){var m2=el('div','ltsd-modal',{id:'ltsd-about-modal',role:'dialog','aria-modal':'true'}), p2=el('div','ltsd-modal__panel'),
        h2=el('div','ltsd-modal__header'), t2=el('div','ltsd-modal__title',{text:(this._o.aboutTitle||'About')}), x2=el('button','ltsd-modal__close',{'aria-label':'Cerrar',text:'×'});
        x2.onclick=this.close.bind(this,'about'); h2.appendChild(t2);h2.appendChild(x2); var c2=el('div','ltsd-about',{id:'ltsd-about-content'}); p2.appendChild(h2);p2.appendChild(c2); m2.appendChild(p2); document.body.appendChild(m2);
        this._els.about={m:m2,p:p2,h:h2,t:t2,x:x2,c:c2};}
      document.addEventListener('keydown',function(e){if(e.key==='Escape')M.close();});
      ['#ltsd-all-modal','#ltsd-about-modal'].forEach(function(s){var mm=qs(s); if(mm) mm.addEventListener('click',function(e){if(e.target===mm) M.close();});});
    },
    _bind:function(){
      qsa(this._o.triggers.all).forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();M.openAll();});});
      qsa(this._o.triggers.about).forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();M.openAbout();});});
      qsa('[onclick*="showAllProjects"]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();M.openAll();});});
      qsa('[onclick*="showAbout"]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();M.openAbout();});});
    },
    _globals:function(){
      if(typeof global.showAllProjects!=='function') global.showAllProjects=function(){M.openAll();};
      if(typeof global.closeAllProjects!=='function') global.closeAllProjects=function(){M.close('all');};
      if(typeof global.showAbout!=='function') global.showAbout=function(){M.openAbout();};
      if(typeof global.closeAbout!=='function') global.closeAbout=function(){M.close('about');};
    },
    openAll:function(){
      var E=this._els.all||{m:qs('#ltsd-all-modal'),g:qs('#ltsd-projects-grid'),t:qs('#ltsd-all-modal .ltsd-modal__title')}; if(!E.m||!E.g)return;
      E.t.textContent='All Projects'; E.g.innerHTML='';
      var list=(Array.isArray(this._o.projects)&&this._o.projects.length)?this._o.projects:fromDom();
      list.forEach(function(p,i){var card=el('div','ltsd-card',{'data-index':String(i)}); var bg=p.image||(Array.isArray(global.PROJECTS)&&global.PROJECTS[i]?global.PROJECTS[i].image:null);
        if(bg) card.style.backgroundImage='url("'+bg+'")'; var ov=el('div','ltsd-card__overlay'); ov.appendChild(el('div','ltsd-card__title',{text:(p.name||('Proyecto '+(i+1)))})); ov.appendChild(el('div','ltsd-card__location',{text:(p.location||'')})); card.appendChild(ov);
        card.onclick=function(){ if(M._o.useGoToProjectHandler && typeof global.goToProject==='function' && typeof p.index==='number') global.goToProject(p.index); };
        E.g.appendChild(card);});
      E.m.classList.add('ltsd-modal--visible');
    },
    openAbout:function(){
      var E=this._els.about||{m:qs('#ltsd-about-modal'),c:qs('#ltsd-about-content'),t:qs('#ltsd-about-modal .ltsd-modal__title')}; if(!E.m||!E.c)return;
      E.t.textContent=this._o.aboutTitle||'About'; E.c.innerHTML=this._o.aboutHtml||'<div class="ltsd-about"><p>Agregá tu contenido del About aquí.</p></div>'; E.m.classList.add('ltsd-modal--visible');
    },
    close:function(which){
      var A=qs('#ltsd-all-modal'), B=qs('#ltsd-about-modal'); if(!which||which==='all'){ if(A) A.classList.remove('ltsd-modal--visible'); } if(!which||which==='about'){ if(B) B.classList.remove('ltsd-modal--visible'); }
    }
  };
  function ready(f){ if(document.readyState!=='loading') f(); else document.addEventListener('DOMContentLoaded',f); }
  ready(function(){ try{ M.init(); }catch(e){} }); global.LTSDModals=M;
})(window);
