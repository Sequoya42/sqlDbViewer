webpackJsonp([1],{"7SxJ":function(e,t){},"7UdW":function(e,t){},"7zck":function(e,t){},NHnr:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("7+uW"),n={render:function(){var e=this.$createElement,t=this._self._c||e;return t("v-app",[t("div",{attrs:{id:"app"}},[t("router-view")],1)])},staticRenderFns:[]};var l=a("VU/8")({name:"App"},n,!1,function(e){a("iH+u")},null,null).exports,s=a("/ocq"),o=a("fZjL"),i=a.n(o),c=a("woOf"),u=a.n(c),p={name:"Table",props:["tKey","tValue","color","colors"],data:function(){return{}},computed:{},methods:{wesh:function(e){console.log("wesh called"),this.$emit("toggle",e)}},components:{}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{on:{click:function(t){e.wesh(e.tKey)}}},[a("v-card",{staticClass:"drawing",style:{borderTop:"6px solid",borderRadius:"20px 36px 10px 10px",borderColor:e.color,boxShadow:"0 4px 6px 0 hsla(0, 0%, 0%, 0.2)"},attrs:{flat:""}},[a("v-card-title",{attrs:{"primary-title":""}},[a("h1",[e._v(e._s(e.tKey))])]),e._v(" "),e._l(e.tValue,function(t,r){return a("v-flex",{key:r},[a("v-card-text",[a("h2",{style:{color:t in e.colors?e.colors[t]:"grey"}},[e._v(e._s(r))]),e._v(" "),a("h3",{style:{color:t in e.colors?e.colors[t]:"hsl(249,9%,80%)"}},[e._v(e._s(t))])])],1)}),e._v(" "),a("v-card-text")],2)],1)},staticRenderFns:[]};var f={name:"HelloWorld",components:{Table:a("VU/8")(p,d,!1,function(e){a("7UdW")},"data-v-6327b06b",null).exports},data:function(){return{msg:"Welcome to Your Vue.js App",allTables:{},tables:{},tableNames:[],references:[],colors:{},text:[]}},computed:{},methods:{colorGen:function(){var e=[];return e[0]=Math.random()*Math.floor(360),e[1]=Math.random()*Math.floor(80)+20+"%",e[2]=Math.random()*Math.floor(80)+"%","hsl("+e[0]+", "+e[1]+", "+e[2]+")"},parseKnex:function(e){for(var t=this,a=/CREATE TABLE `?(\w+)`? ?∆(.[^Ω]*)Ω/g,r=/CONSTRAINT `?(\w+)`? FOREIGN KEY \([`]?(\w+)[`]?\) REFERENCES (.[^(]+)/g,n=void 0,l=void 0,s=1,o=function(){n.index===a.lastIndex&&a.lastIndex++;var e={};n[2].split(",").map(function(e){return e.trim()}).filter(function(e){return!(e.startsWith("CONSTRAINT")||e.startsWith("KEY")||e.startsWith("PRIMARY"))}).map(function(t,a){var r=t.split(" ");e[[r[0].replace(/`| /g,"")]]=r[1]+("character"==r[1]?" "+r[2].split("(")[1].split(")")[0]:"")}),t.tableNames.push([n[1],s++]),t.$set(t.tables,n[1],e),t.$set(t.colors,n[1],t.colorGen())};null!==(n=a.exec(e));)o();for(;null!==(l=r.exec(e));){l.index===r.lastIndex&&r.lastIndex++;var i=l[1].replace(/_\w[^_]+_id_foreign/,""),c=l[3].replace(/`| /g,"");this.references.push({tableName:i,ref:c,val:l[2]}),i in this.tables&&(this.tables[i][[l[2]]]=c)}this.allTables=u()({},this.tables)},read:function(e){for(var t,a=this,r=e.target.files,n=function(e,t){var r=new FileReader;r.onload=function(t){a.text.push(t.target.result.replace(/\(\s/g,"∆").replace(/\)(;| E)/g,"Ω").replace(/\n|\r/g,"")),a.parseKnex(a.text[e])},r.readAsText(t)},l=0;t=r[l];l++)n(l,t)},doTheThing:function(e){var t=this;if(i()(this.tables).length!==i()(this.allTables).length)this.tables=this.allTables;else{var a=[e];this.references.forEach(function(t){t.tableName==e&&a.push(t.ref)}),console.log("x",a),this.tables=i()(this.allTables).filter(function(e){return a.includes(e)}).reduce(function(e,a){return e[a]=t.allTables[a],e},{})}}}},h={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{attrs:{fluid:""}},[a("h4",[e._v("Example: postgresql use : pg_dump -s databasename > file.sql")]),e._v(" "),a("h4",[e._v("Example:  sql use mysqldump -u root -p --no-data dbname > schema.sql")]),e._v(" "),a("h5",[e._v(" Then use that file")]),e._v(" "),a("input",{attrs:{type:"file",multiple:""},on:{change:e.read}}),e._v(" "),a("v-layout",{attrs:{wrap:""},model:{value:e.tables,callback:function(t){e.tables=t},expression:"tables"}},[a("transition-group",{staticClass:"rs-flex",attrs:{name:"list"}},e._l(e.tables,function(t,r){return a("v-flex",{key:r},[a("Table",{attrs:{tKey:r,color:e.colors[r],colors:e.colors,tValue:t},on:{toggle:e.doTheThing}})],1)}))],1)],1)},staticRenderFns:[]};var v=a("VU/8")(f,h,!1,function(e){a("7SxJ")},"data-v-0e97533d",null).exports;r.a.use(s.a);var m=new s.a({routes:[{path:"/",name:"HelloWorld",component:v}]}),b=a("3EgV"),x=a.n(b);a("7zck");r.a.use(x.a),r.a.config.productionTip=!1,new r.a({el:"#app",router:m,components:{App:l},template:"<App/>"})},"iH+u":function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.1a5d99c5ac0eba973cb5.js.map