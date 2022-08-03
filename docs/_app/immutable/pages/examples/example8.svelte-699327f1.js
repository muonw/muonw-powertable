import{S as H,i as L,s as V,e as q,x as z,c as B,a as J,y as K,d as S,b as Q,g as U,z as X,r as Z,p as ee,C as ae,w as se,$ as te}from"../../chunks/index-5436dd91.js";import{P as le,p as w,g as D}from"../../chunks/PowerTable-cb0966b3.js";function re(v){let y,n,p,x={ptData:v[1],ptInstructs:v[2],ptOptions:v[3]};return n=new le({props:x}),v[4](n),{c(){y=q("div"),z(n.$$.fragment),this.h()},l(a){y=B(a,"DIV",{class:!0});var c=J(y);K(n.$$.fragment,c),c.forEach(S),this.h()},h(){Q(y,"class","MuonW PowerTable")},m(a,c){U(a,y,c),X(n,y,null),p=!0},p(a,[c]){const T={};c&2&&(T.ptData=a[1]),c&4&&(T.ptInstructs=a[2]),c&8&&(T.ptOptions=a[3]),n.$set(T)},i(a){p||(Z(n.$$.fragment,a),p=!0)},o(a){ee(n.$$.fragment,a),p=!1},d(a){a&&S(y),v[4](null),ae(n)}}}const W=1,G=2,I=3;function ne(v,y,n){let p,x=[],a=[],c={};se(()=>{n(1,x=w),n(3,c={userFunctions:{pageMod:N},searchPhrase:"/a.*t/gimsu",searchIsRegex:!0,checkboxColumn:!0});let s=[];Object.keys(w[0]).forEach(g=>{s.push({key:g,title:g,parseAs:"unsafe-html"})}),s[4].filterPhrase="man",s[4].filterIsRegex=!1,s[5].filterPhrase="o",s[5].filterIsRegex=!1,n(2,a=s)});let T={[W]:{open:'<span class="search-match">',close:"</span>"},[G]:{open:'<span class="filter-match">',close:"</span>"},[I]:{open:'<span class="overlap-match">',close:"</span>"}};function N(s){if(p!=null&&p.getData){let g=Y(s);s=j(s,g)}return s}function Y(s){var _,P,t,f,O;let g,M,u={},r=[],m=p.getData();g=(P=(_=m.search)==null?void 0:_.value)!=null?P:"",M=(f=(t=m.search)==null?void 0:t.isRegex)!=null?f:!1,a.forEach(e=>{var b,E,k,d;u[e.key]={value:(E=(b=m.filters[e.key])==null?void 0:b.value)!=null?E:"",isRegex:(d=(k=m.filters[e.key])==null?void 0:k.isRegex)!=null?d:!1}});let h,l;if(g){let e=new RegExp("");if(M===!1){let b=g.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");e=new RegExp(b,"gi")}else{if(l=D(g),!l)throw new Error("RegEx is not valid!");h=(O=l==null?void 0:l.flags)!=null?O:"",e=new RegExp(l.pattern,h)}s.forEach((b,E)=>{a.forEach((k,d)=>{let o=[];M===!1||(h==null?void 0:h.indexOf("g"))!==-1?o=[...b[k.key].matchAll(e)]:o=[b[k.key].match(e)],o!=null&&o.length&&(r[E]||(r[E]={}),r[E][k.key]||(r[E][k.key]=[]),o.forEach(R=>{if(R)for(let C=R.index;C<R.index+R[0].length;C++)r[E][k.key][C]=W}))})})}let i=new RegExp("");return a.forEach((e,b)=>{var E,k;if((E=u[e.key])!=null&&E.value){if(u[e.key].isRegex===!1){let d=u[e.key].value.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");i=new RegExp(d,"gi")}else{if(l=D(u[e.key].value),!l)throw new Error("RegEx is not valid!");h=(k=l==null?void 0:l.flags)!=null?k:"",i=new RegExp(l.pattern,h)}s.forEach((d,o)=>{let R=[];u[e.key].isRegex===!1||(h==null?void 0:h.indexOf("g"))!==-1?R=[...d[e.key].matchAll(i)]:R=[d[e.key].match(i)],R.length&&(r[o]||(r[o]={}),r[o][e.key]||(r[o][e.key]=[]),R.forEach(C=>{var A;if(C)for(let $=C.index;$<C.index+C[0].length;$++)(A=r[o][e.key][$])!=null&&A?r[o][e.key][$]=I:r[o][e.key][$]=G}))})}}),r}function j(s,g){let M=[];return s.forEach((u,r)=>{a.forEach(m=>{var h;if(M=(h=g[r])==null?void 0:h[m.key]){let l=-1,i={startChar:-1,endChar:-1,type:-1},_=[],P=0;M.forEach((t,f)=>{l===-1?i={startChar:f,endChar:f,type:t}:f-P>1?(_.push({...i,endChar:P}),i={startChar:f,endChar:f,type:t}):t!=l?(_.push({...i}),i={startChar:f,endChar:f,type:t}):i.endChar=f,l=t,P=f}),i.type>0&&_.push(i),_=_.sort((t,f)=>f.startChar-t.startChar),_.forEach(t=>{u[m.key]=[u[m.key].slice(0,t.startChar),T[t.type].open,u[m.key].slice(t.startChar,t.endChar+1),T[t.type].close,u[m.key].slice(t.endChar+1)].join("")})}})}),s}function F(s){te[s?"unshift":"push"](()=>{p=s,n(0,p)})}return[p,x,a,c,F]}class he extends H{constructor(y){super(),L(this,y,ne,re,V,{})}}export{he as default};