var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e){t.appendChild(e)}function s(t){t.parentNode.removeChild(t)}function a(t){return document.createElement(t)}function c(t){return document.createTextNode(t)}function d(){return c(" ")}function u(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}let f;function p(t){f=t}const m=[],g=[],h=[],v=[],b=Promise.resolve();let w=!1;function x(t){h.push(t)}let $=!1;const y=new Set;function k(){if(!$){$=!0;do{for(let t=0;t<m.length;t+=1){const e=m[t];p(e),_(e.$$)}for(p(null),m.length=0;g.length;)g.pop()();for(let t=0;t<h.length;t+=1){const e=h[t];y.has(e)||(y.add(e),e())}h.length=0}while(m.length);for(;v.length;)v.pop()();w=!1,$=!1,y.clear()}}function _(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(x)}}const A=new Set;function S(t,e){-1===t.$$.dirty[0]&&(m.push(t),w||(w=!0,b.then(k)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function E(l,i,a,c,d,u,m,g=[-1]){const h=f;p(l);const v=l.$$={fragment:null,ctx:null,props:u,update:t,not_equal:d,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i.context||(h?h.$$.context:[])),callbacks:n(),dirty:g,skip_bound:!1,root:i.target||h.$$.root};m&&m(v.root);let b=!1;if(v.ctx=a?a(l,i.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return v.ctx&&d(v.ctx[t],v.ctx[t]=o)&&(!v.skip_bound&&v.bound[t]&&v.bound[t](o),b&&S(l,t)),e})):[],v.update(),b=!0,o(v.before_update),v.fragment=!!c&&c(v.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);v.fragment&&v.fragment.l(t),t.forEach(s)}else v.fragment&&v.fragment.c();i.intro&&((w=l.$$.fragment)&&w.i&&(A.delete(w),w.i($))),function(t,n,l,i){const{fragment:s,on_mount:a,on_destroy:c,after_update:d}=t.$$;s&&s.m(n,l),i||x((()=>{const n=a.map(e).filter(r);c?c.push(...n):o(n),t.$$.on_mount=[]})),d.forEach(x)}(l,i.target,i.anchor,i.customElement),k()}var w,$;p(h)}function M(e){let n,o,r,l,f,p,m,g,h,v,b,w,x,$,y,k,_,A,S,E,M,C,V,T,O,z,F,L,N=P(e[0])+"",q=P(e[1])+"",H=P(e[2])+"",I=P(e[3])+"",B=P(e[4])+"";return{c(){n=a("div"),o=a("div"),r=a("div"),l=a("h2"),l.textContent="Feature Support",f=d(),p=a("p"),m=c("Offline Mode "),g=c(N),h=d(),v=a("p"),b=c("Desktop Mode "),w=c(q),x=d(),$=a("p"),y=c("Multi Audio Tracks in Video "),k=c(H),_=d(),A=a("p"),S=c("Casting "),E=c(I),M=d(),C=a("p"),V=c("Media Controls "),T=c(B),O=d(),z=a("h2"),z.textContent="App List",F=d(),L=a("div"),L.innerHTML='<a href="img-viewer/public" class="card w-350 mw-full m-0 p-0 d-flex mr-10 mb-10 svelte-1ggk6ul" target="_blank" rel="noopener"><div class="w-100 h-100 m-10 align-self-center rounded d-flex align-items-center justify-content-center"><img src="img-viewer/public/128.png" class="d-block rounded h-100 w-100" alt="logo"/></div> \n          <div class="flex-grow-1 overflow-y-hidden d-flex align-items-center position-relative h-120"><div class="p-10 w-full m-auto"><p class="m-0 font-weight-medium text-dark-lm text-light-dm text-reset">Image Viewer</p> \n              <p class="font-size-12 mt-0 mb-0">Simple and Fast Image Viewer</p></div></div></a> \n\n        <a href="audio-player/public" class="card w-350 mw-full m-0 p-0 d-flex mr-10 mb-10 svelte-1ggk6ul" target="_blank" rel="noopener"><div class="w-100 h-100 m-10 align-self-center rounded d-flex align-items-center justify-content-center"><img src="audio-player/public/128.png" class="d-block rounded h-100 w-100" alt="logo"/></div> \n          <div class="flex-grow-1 overflow-y-hidden d-flex align-items-center position-relative h-120"><div class="p-10 w-full m-auto"><p class="m-0 font-weight-medium text-dark-lm text-light-dm text-reset">Audio Player</p> \n              <p class="font-size-12 mt-0 mb-0">Simple and Fast Audio Player</p></div></div></a> \n\n        <a href="video-player/public" class="card w-350 mw-full m-0 p-0 d-flex mr-10 mb-10 svelte-1ggk6ul" target="_blank" rel="noopener"><div class="w-100 h-100 m-10 align-self-center rounded d-flex align-items-center justify-content-center"><img src="video-player/public/128.png" class="d-block rounded h-100 w-100" alt="logo"/></div> \n          <div class="flex-grow-1 overflow-y-hidden d-flex align-items-center position-relative h-120"><div class="p-10 w-full m-auto"><p class="m-0 font-weight-medium text-dark-lm text-light-dm text-reset">Video Player</p> \n              <p class="font-size-12 mt-0 mb-0">Simple and Powerful Video Player</p></div></div></a>',u(l,"class","content-title"),u(p,"class","mt-0 mb-0 "+j(e[0])+" svelte-1ggk6ul"),u(v,"class","mt-0 mb-0 "+j(e[1])+" svelte-1ggk6ul"),u($,"class","mt-0 mb-0 "+j(e[2])+" svelte-1ggk6ul"),u(A,"class","mt-0 mb-0 "+j(e[3])+" svelte-1ggk6ul"),u(C,"class","mt-0 mb-0 "+j(e[4])+" svelte-1ggk6ul"),u(z,"class","content-title mt-20"),u(L,"class","row"),u(r,"class","content"),u(o,"class","content-wrapper"),u(n,"class","page-wrapper")},m(t,e){!function(t,e,n){t.insertBefore(e,n||null)}(t,n,e),i(n,o),i(o,r),i(r,l),i(r,f),i(r,p),i(p,m),i(p,g),i(r,h),i(r,v),i(v,b),i(v,w),i(r,x),i(r,$),i($,y),i($,k),i(r,_),i(r,A),i(A,S),i(A,E),i(r,M),i(r,C),i(C,V),i(C,T),i(r,O),i(r,z),i(r,F),i(r,L)},p:t,i:t,o:t,d(t){t&&s(n)}}}function P(t){return t?"Supported":"Unsupported"}function j(t){return t?"text-success":"text-danger"}function C(t){return["serviceWorker"in navigator,"onbeforeinstallprompt"in window,"audioTracks"in HTMLVideoElement.prototype,"PresentationRequest"in window,"mediaSession"in navigator]}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),E(this,t,C,M,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
