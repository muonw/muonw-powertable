import{S as j,i as z,s as B,C as J,k as f,q as p,a as N,l as m,m as $,r as k,h as c,c as D,n as v,b as M,D as n,E as L,F as K,G as O,H as Q,f as T,t as U,I as W,o as X}from"../../chunks/index-83a72ca5.js";function Y(l){let t,u,w,h,_,y,b,r,o,E,i,q,A,H,g,d,C,P;const G=l[1].default,a=J(G,l,l[0],null);return{c(){t=f("nav"),u=f("a"),w=p("Home"),h=p(` | 
    `),_=f("a"),y=p("GitHub"),b=p(` | 
    `),r=f("span"),o=p("☀️"),E=N(),i=f("span"),q=p("🌙"),A=N(),H=f("hr"),g=N(),a&&a.c(),this.h()},l(e){t=m(e,"NAV",{});var s=$(t);u=m(s,"A",{href:!0});var F=$(u);w=k(F,"Home"),F.forEach(c),h=k(s,` | 
    `),_=m(s,"A",{href:!0});var I=$(_);y=k(I,"GitHub"),I.forEach(c),b=k(s,` | 
    `),r=m(s,"SPAN",{id:!0,title:!0});var R=$(r);o=k(R,"☀️"),R.forEach(c),E=D(s),i=m(s,"SPAN",{id:!0,title:!0});var V=$(i);q=k(V,"🌙"),V.forEach(c),s.forEach(c),A=D(e),H=m(e,"HR",{}),g=D(e),a&&a.l(e),this.h()},h(){v(u,"href","/powertable/"),v(_,"href","https://github.com/muonw/powertable"),v(r,"id","switch-to-light-mode"),v(r,"title","Light Mode"),v(i,"id","switch-to-dark-mode"),v(i,"title","Dark Mode")},m(e,s){M(e,t,s),n(t,u),n(u,w),n(t,h),n(t,_),n(_,y),n(t,b),n(t,r),n(r,o),n(t,E),n(t,i),n(i,q),M(e,A,s),M(e,H,s),M(e,g,s),a&&a.m(e,s),d=!0,C||(P=[L(r,"click",l[2]),L(r,"keypress",l[3]),L(i,"click",l[4]),L(i,"keypress",l[5])],C=!0)},p(e,[s]){a&&a.p&&(!d||s&1)&&K(a,G,e,e[0],d?Q(G,e[0],s,null):O(e[0]),null)},i(e){d||(T(a,e),d=!0)},o(e){U(a,e),d=!1},d(e){e&&c(t),e&&c(A),e&&c(H),e&&c(g),a&&a.d(e),C=!1,W(P)}}}function S(l){let t=document.querySelector("html");t==null||t.setAttribute("data-color-scheme",l)}function Z(l,t,u){let{$$slots:w={},$$scope:h}=t;X(()=>{const o=E=>{S(E.matches?"dark":"light")};return window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",o),()=>{window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change",o)}});const _=()=>S("light"),y=()=>S("light"),b=()=>S("dark"),r=()=>S("dark");return l.$$set=o=>{"$$scope"in o&&u(0,h=o.$$scope)},[h,w,_,y,b,r]}class ee extends j{constructor(t){super(),z(this,t,Z,Y,B,{})}}export{ee as default};