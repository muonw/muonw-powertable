import{S as o,i as l,s as m,e as f,x as p,c,a as u,y as d,d as r,b,g as h,z as _,n as $,r as j,p as y,A as g}from"../../../../chunks/index-92110330.js";import{d as O}from"../../../../chunks/jobs-f0c41956.js";import{P as k}from"../../../../chunks/PowerTable-dd7d38ef.js";function x(n){let e,t,s;return t=new k({props:{ptData:n[0],ptInstructs:n[1],ptOptions:n[2]}}),{c(){e=f("div"),p(t.$$.fragment),this.h()},l(a){e=c(a,"DIV",{class:!0});var i=u(e);d(t.$$.fragment,i),i.forEach(r),this.h()},h(){b(e,"class","MuonW PowerTable")},m(a,i){h(a,e,i),_(t,e,null),s=!0},p:$,i(a){s||(j(t.$$.fragment,a),s=!0)},o(a){y(t.$$.fragment,a),s=!1},d(a){a&&r(e),g(t)}}}function D(n){return n.forEach(e=>{let t="";e.job.indexOf("Engineer")!==-1||e.job.indexOf("Manage")!==-1?t="\u{1F4BC}":e.job.indexOf("Health")!==-1||e.job.indexOf("Nurse")!==-1?t="\u200D\u{1F48A}":e.job.indexOf("Data")!==-1&&(t="\u{1F4BB}"),e.job=t?`<b>${t} ${e.job}</b>`:e.job}),n}function P(n){return[O,[{key:"id",title:"ID"},{key:"first_name",title:"First Name",sortable:!1},{key:"last_name",title:"Surname"},{key:"company",title:"Company",filterPhrase:"/p.*i/gi"},{key:"department",title:"Department \u{1F3E2}",filterable:!1},{key:"job",title:"Job Title",parseAs:"unsafe-html"}],{userFunctions:{customParse:D}}]}class S extends o{constructor(e){super(),l(this,e,P,x,m,{})}}export{S as default};