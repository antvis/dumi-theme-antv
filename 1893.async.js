(self.webpackChunk=self.webpackChunk||[]).push([[1893],{13411:function(J){function f(t){var _=new Error("Cannot find module '"+t+"'");throw _.code="MODULE_NOT_FOUND",_}f.keys=function(){return[]},f.resolve=f,f.id=13411,J.exports=f},62594:function(J,f,t){"use strict";t.d(f,{w:function(){return v}});var _=t(1201),v=(0,_.createContext)({})},48429:function(J,f,t){"use strict";t.d(f,{T:function(){return x}});var _=t(1201),v=t(22700),u=t(80197),E=t(39789),m=t(62903),p=t(54767),x=function(){return(0,p.jsx)(p.Fragment,{children:(0,p.jsx)(u.ZP,{status:"404",title:"404",subTitle:"Sorry, the page you visited does not exist.",extra:(0,p.jsx)(m.rU,{to:"/",children:(0,p.jsxs)(E.Z,{type:"primary",children:[(0,p.jsx)(v.Z,{}),"Back Home"]})})})})}},97041:function(J,f,t){"use strict";t.d(f,{S:function(){return Ge}});var _=t(84140),v=t.n(_),u=t(1201),E=t(62903),m=t(28014),p=t(24971),x=t(68333),T=t(86188),P=t(18583),j=t.n(P),fe=t(72624),V=t.n(fe),ue=t(6686),S=t.n(ue),h=t(28290),y=t(62769);function M(i){var e=i.match(/fetch\('(.*)'\)/);return e&&e.length>0&&!e[1].startsWith("http")?i.replace(e[1],h.join(location.origin||"",location.pathname||"","..",e[1])):i}function Z(i){var e=i.match(/require\(['"](.*)['"]\)/g)||[],r=i.match(/from\s+['"](.*)['"]/g)||[],n={};return[].concat(S()(e),S()(r)).forEach(function(s){var a=s.match(/require\(['"](.*)['"]\)/);a&&a[1]&&(n[a[1]]="latest");var l=s.match(/from\s+['"](.*)['"]/);l&&l[1]&&(n[l[1]]="latest")}),n}function W(i,e,r,n,s,a){var l;return{files:(l={"package.json":{content:{main:"index.".concat(r),dependencies:n,devDependencies:s}}},V()(l,"index.".concat(r),{content:M(e)}),V()(l,"index.html",{content:a.container||'<div id="container" />'}),l)}}function G(i,e,r,n,s,a){return{title:i,js:e,html:a.container||'<div id="container" />',json:JSON.stringify(j()({dependencies:n,devDependencies:s},a.json))}}function b(i,e,r,n,s,a){var l;return{title:i||"",description:"",template:"create-react-app",dependencies:n,files:(l={},V()(l,"index.".concat(r.startsWith("ts")?"ts":"js"),e),V()(l,"index.html",a.container||'<div id="container" />'),l)}}function F(i,e,r,n,s,a){var l=a.htmlCodeTemplate,d=l===void 0?"":l,c=a.container,L=c===void 0?"":c,U=/insertCss\(`\s*(.*)\s*`\);/,R=M(e).replace(/import\s+.*\s+from\s+['"].*['"];?/g,"").replace(U,"").replace(/^\s+|\s+$/g,""),D=d.replace("{{code}}",indentString(R,4)).replace("{{title}}",i||"example"),A=e.match(U);return A&&A[1]&&(D=D.replace("</head>",`  <style>
`.concat(indentString(A[1],4),`
    </style>
  </head>`))),L&&(D=D.replace("<body>",`<body>
`.concat(indentString(L,4)))),D}function $(i,e){var r=e==="zh"?`// \u6211\u4EEC\u7528 insert-css \u6F14\u793A\u5F15\u5165\u81EA\u5B9A\u4E49\u6837\u5F0F
// \u63A8\u8350\u5C06\u6837\u5F0F\u6DFB\u52A0\u5230\u81EA\u5DF1\u7684\u6837\u5F0F\u6587\u4EF6\u4E2D
// \u82E5\u62F7\u8D1D\u5B98\u65B9\u4EE3\u7801\uFF0C\u522B\u5FD8\u4E86 npm install insert-css
insertCss(`:`// We use 'insert-css' to insert custom styles
// It is recommended to add the style to your own style sheet files
// If you want to copy the code directly, please remember to install the npm package 'insert-css
insertCss(`;return i.replace(/^insertCss\(/gm,r)}function X(i,e,r){var n=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"container",s=document.getElementById(e),a=document.createElement("script"),l=i.replace(/'container'|"container"/,"'".concat(n,"'"));a.innerHTML=`
// Can only have one anonymous define call per script file
// \u548C monaco loader \u52A0\u8F7D\u51B2\u7A81
var __runnerDefine = window['define'];
window['define'] = null;
try {
  `.concat(l,`

  window.__reportErrorInPlayground && window.__reportErrorInPlayground(null);
} catch(e) {
  window.__reportErrorInPlayground && window.__reportErrorInPlayground(e);
} finally {
  window['define'] = __runnerDefine;
}
  `),s.innerHTML=r||"<div id=".concat(n," />"),s.appendChild(a)}function te(i,e){var r=(0,y.transform)(i,{filename:e,presets:["react","typescript","es2015","stage-3"],plugins:["transform-modules-umd"]}),n=r.code;return n}var ne=t(54856),Te=t.n(ne),je=t(65585),Se=t(32774),De=t(58909),Pe=t(24579),be=t(15462),Ae=t(76841),Y=t(88830),Oe=t(79485),Me=t(68996),Fe=function(e){var r="https://private-alipayobjects.alipay.com/alipay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png",n=new Image,s=!1,a=function(d){s||(s=!0,n.src="",e(d))};return n.onload=function(){return a("responded")},n.onerror=function(){return a("error")},n.src=r,setTimeout(function(){return a("timeout")},1500)},nt=function(e){var r=typeof e=="undefined"?window.location.host:e;if(r==="antv.vision")return"antv.gitee.io";var n=r.match(/(.*)\.antv\.vision/);return n&&n[1]?"antv-".concat(n[1],".gitee.io"):r};function Ie(i,e){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"examples";return i.includes("/tree/master/")?"".concat(i.replace("/tree/master/","/edit/master/"),"/").concat(r,"/").concat(e):"".concat(i,"/edit/master/").concat(r,"/").concat(e)}var rt=function(e,r){return groupBy(e||[],function(n){return!n.postFrontmatter||!n.postFrontmatter[r]?"OTHER":n.postFrontmatter[r].title})},ot=function(e,r){return Object.keys(e).sort(function(n,s){return n==="OTHER"?-1:s==="OTHER"?1:e[n][0].postFrontmatter[r].order-e[s][0].postFrontmatter[r].order})},me=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"",r=e.split("/");return r.slice(r.indexOf("examples")+1).filter(function(n){return n}).join("/")},ge=function(e){var r=e.groupedEdgeKey,n=e.groupedEdges,s=e.examples,a=me(r);return s.find(function(l){return l.slug===a})?(s.findIndex(function(l){return l.slug===a})||0)+100:!n[r]&&!n[r].length?0:n[r][0].node.frontmatter.order||0},pe=function(e){return groupBy(e,function(r){var n=r.node.fields.slug;return n.endsWith("/API")||n.endsWith("/design")?n.split("/").slice(0,-2).join("/"):n.split("/").slice(0,-1).join("/")})},Le=function(e,r,n){var s=pe(r);return Object.keys(s).filter(function(a){return a.startsWith("/".concat(n,"/"))}).sort(function(a,l){var d=ge({groupedEdgeKey:a,examples:e,groupedEdges:s}),c=ge({groupedEdgeKey:l,examples:e,groupedEdges:s});return d-c})},at=function(e,r,n){return Le(e,r,n).map(function(s){var a=me(s),l=e.find(function(d){return d.slug===a})||{};return{title:l&&l.title?l.title[n]:a,value:s,icon:l.icon,children:pe(r)[s].filter(function(d){var c=d.node.fields.slug;return!(c.endsWith("/API")||c.endsWith("/design")||c.endsWith("/gallery"))})}})},B=t(74377),Q={toolbar:"toolbar___h3qg9",codesandbox:"codesandbox___Rl2Ic",riddle:"riddle___AlJcu",stackblitz:"stackblitz___s1FFX",html:"html___wWO9G",editortabs:"editortabs___fWU2B",current:"current___eFbbe"},o=t(54767),Ue=Ae.Z.Paragraph,I;(function(i){i.JAVASCRIPT="JavaScript",i.DATA="Data"})(I||(I={}));var Re=function(e){var r=e.sourceCode,n=e.fileExtension,s=e.playground,a=s===void 0?{}:s,l=e.location,d=e.title,c=d===void 0?"":d,L=e.isFullScreen,U=L===void 0?!1:L,R=e.editorTabs,D=e.currentEditorTab,A=e.onEditorTabChange,k=e.onToggleFullscreen,K=k===void 0?null:k,H=e.onExecuteCode,q=(0,E.bU)(),w=Te()(c)==="object"?c[q.id]:c,z=j()(j()({},Z(r)),a.dependencies),N=a.devDependencies||{},ce=W(w,r,n,z,N,a),oe=G(w,r,n,z,N,a),ee=b(w,r,n,z,N,a),ae=(0,u.useState)(!1),se=v()(ae,2),ve=se[0],le=se[1];return(0,u.useEffect)(function(){Fe(function(C){le(C==="responded")})},[]),(0,o.jsxs)("div",{className:Q.toolbar,children:[(0,o.jsx)("div",{className:Q.editortabs,children:R.map(function(C,de){return(0,o.jsx)("span",{className:C===D?Q.current:"",onClick:function(){return A(C)},children:C},de)})}),ve?(0,o.jsxs)("form",{action:"//riddle.alibaba-inc.com/riddles/define",method:"POST",target:"_blank",children:[(0,o.jsx)("input",{type:"hidden",name:"data",value:JSON.stringify(oe)}),(0,o.jsx)(Y.Z,{title:(0,B.NT)("\u5728 Riddle \u4E2D\u6253\u5F00"),children:(0,o.jsx)("input",{type:"submit",value:"Create New Riddle with Prefilled Data",className:Q.riddle})})]}):null,(0,o.jsx)(Y.Z,{title:(0,B.NT)("\u5728 StackBlitz \u4E2D\u6253\u5F00"),children:(0,o.jsx)(je.Z,{className:Q.stackblitz,onClick:function(){Me.Z.openProject(ee)}})}),(0,o.jsx)(Y.Z,{title:(0,B.NT)("\u5728 CodeSandbox \u4E2D\u6253\u5F00"),children:(0,o.jsxs)("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank",children:[(0,o.jsx)("input",{type:"hidden",name:"parameters",value:(0,Oe.Z)(ce)}),(0,o.jsx)("button",{type:"submit",className:Q.codesandbox,children:(0,o.jsx)(Se.Z,{style:{marginLeft:8}})})]})}),(0,o.jsx)(Ue,{copyable:{text:r},style:{marginLeft:6}}),K?(0,o.jsx)(Y.Z,{title:U?(0,B.NT)("\u79BB\u5F00\u5168\u5C4F"):(0,B.NT)("\u8FDB\u5165\u5168\u5C4F"),children:U?(0,o.jsx)(De.Z,{onClick:K,style:{marginLeft:12}}):(0,o.jsx)(Pe.Z,{onClick:K,style:{marginLeft:12}})}):null,(0,o.jsx)(Y.Z,{title:(0,B.NT)("\u6267\u884C\u4EE3\u7801"),children:(0,o.jsx)(be.Z,{onClick:H,style:{marginLeft:12}})})]})},he={editor:"editor___b4OfU",monaco:"monaco___DoW9n"};x._m.config({"vs/nls":{availableLanguages:{"*":"zh-cn"}},paths:{vs:"https://gw.alipayobjects.com/os/lib/monaco-editor/0.34.0/min/vs"}});var Ne=function(e){var r=e.title,n=r===void 0?"":r,s=e.source,a=e.relativePath,l=a===void 0?"":a,d=e.playground,c=e.replaceId,L=c===void 0?"container":c,U=e.isFullscreen,R=e.onReady,D=R===void 0?m.Z:R,A=e.onDestroy,k=A===void 0?m.Z:A,K=e.onError,H=K===void 0?m.Z:K,q=e.onFullscreen,w=q===void 0?m.Z:q,z=(0,E.bU)(),N=(0,E.WF)().themeConfig.playground.extraLib,ce=N===void 0?"":N,oe=(0,u.useState)(null),ee=v()(oe,2),ae=ee[0],se=ee[1],ve=(0,u.useState)(s),le=v()(ve,2),C=le[0],de=le[1],Ee=(0,u.useRef)(null),Xe=l.split(".")[l.split(".").length-1]||"js",Ye=(0,u.useState)([]),xe=v()(Ye,2),Qe=xe[0],ke=xe[1],qe=(0,u.useState)(I.JAVASCRIPT),ye=v()(qe,2),ie=ye[0],et=ye[1],it=function(){var O=new Event("resize");window.dispatchEvent(O)};(0,u.useEffect)(function(){typeof window!="undefined"&&(window.__reportErrorInPlayground=function(g){g&&(console.error(g),H(g))})});var Ce=(0,u.useCallback)((0,T.Z)(function(g){if(!!g){var O;try{O=te($(g,z.id),l),H(null)}catch(_e){console.error(_e),H(_e);return}X(O,"playgroundScriptContainer",d==null?void 0:d.container,L)}},300),[]);(0,u.useEffect)(function(){de(s)},[s]),(0,u.useEffect)(function(){Ce(C)},[C]),(0,u.useEffect)(function(){return D(),d!=null&&d.playgroundDidMount&&new Function(d.playgroundDidMount)(),function(){k(),d!=null&&d.playgroundWillUnmount&&new Function(d.playgroundWillUnmount)()}},[]),(0,u.useEffect)(function(){var g=s.match(/fetch\('(.*)'\)/);g&&g.length>0&&fetch(g[1]).then(function(O){return O.json()}).then(function(O){ke([I.JAVASCRIPT,I.DATA]),se(O)})},[]);var tt=(0,u.useCallback)(function(g){ie===I.JAVASCRIPT&&de(g)},[]);return(0,o.jsxs)("div",{className:he.editor,children:[(0,o.jsx)(Re,{fileExtension:Xe,sourceCode:C,playground:d,location,title:n,isFullScreen:U,editorTabs:Qe,currentEditorTab:ie,onExecuteCode:function(){return Ce(C)},onEditorTabChange:et,onToggleFullscreen:w}),(0,o.jsx)("div",{className:he.monaco,style:{height:"calc(100% - 36px)"},children:(0,o.jsx)(x.ZP,{language:ie===I.JAVASCRIPT?"javascript":"json",value:ie===I.JAVASCRIPT?C:JSON.stringify(ae,null,2),path:l,loading:"Loading...",options:{readOnly:ie===I.DATA,automaticLayout:!0,minimap:{enabled:!1},scrollBeyondLastLine:!1,fixedOverflowWidgets:!0,lineNumbersMinChars:4,showFoldingControls:"always",foldingHighlight:!0},onChange:tt,onMount:function(O){Ee.current=O}})})]})},Ze=t(80197),re={preview:"preview___cVXja",header:"header___UWdZk",content:"content___etVbP",playgroundScriptContainer:"playgroundScriptContainer___OJxfg",result:"result___ia9Co"},We=function(e){var r=e.header,n=e.error;return(0,o.jsxs)("div",{className:re.preview,children:[(0,o.jsx)("div",{className:re.header,children:r}),(0,o.jsxs)("div",{className:re.content,children:[(0,o.jsx)("div",{id:"playgroundScriptContainer",className:re.playgroundScriptContainer}),n?(0,o.jsx)(Ze.ZP,{className:re.result,status:"error",title:(0,B.NT)("\u6F14\u793A\u4EE3\u7801\u62A5\u9519\uFF0C\u8BF7\u68C0\u67E5"),subTitle:(0,o.jsx)("pre",{children:n&&n.message})}):null]})]})},Be=t(85856),Ke=t(98142),He=t(12344),$e=t(73340),we={},ze=function(e){var r=e.title,n=e.relativePath,s=e.githubUrl;return(0,o.jsx)(Be.Z,{ghost:!1,title:r,subTitle:(0,o.jsx)(Y.Z,{title:(0,B.NT)("\u5728 GitHub \u4E0A\u7F16\u8F91"),children:(0,o.jsx)("a",{href:Ie(s,n,"examples"),target:"_blank",rel:"noopener noreferrer",className:we.editOnGtiHubButton,children:(0,o.jsx)($e.Z,{})})}),extra:(0,o.jsx)(Ke.Z,{split:(0,o.jsx)(He.Z,{type:"vertical"})})})},Je=t(9647),Ve=t(48429),Ge=function(e){var r=e.exampleTopics,n=e.topic,s=e.example,a=e.demo,l=e.notFound,d=l===void 0?(0,o.jsx)(Ve.T,{}):l,c=(0,Je.X)(r,n,s,a);if(!c)return d;var L=c.title,U=c.source,R=c.relativePath,D=(0,E.WF)(),A=D.themeConfig,k=A.githubUrl,K=(0,u.useState)(),H=v()(K,2),q=H[0],w=H[1],z=(0,u.useState)(!1),N=v()(z,2),ce=N[0],oe=N[1],ee=(0,E.bU)(),ae=(0,o.jsx)(ze,{title:L[ee.id],relativePath:R,githubUrl:k});return(0,o.jsxs)(p.Z,{split:"vertical",defaultSize:"50%",minSize:100,children:[(0,o.jsx)(We,{error:q,header:ae}),(0,o.jsx)(Ne,{source:U,relativePath:R,onError:w,onFullscreen:oe,onDestroy:m.Z,onReady:m.Z})]})}},9647:function(J,f,t){"use strict";t.d(f,{X:function(){return m}});var _=t(18583),v=t.n(_),u=t(88839);function E(p){var x=new Map;return(0,u.Z)(p,function(T){(0,u.Z)(T.examples,function(P){(0,u.Z)(P.demos,function(j){x.set("".concat(T.id,"-").concat(P.id,"-").concat(j.id),v()(v()({},j),{},{relativePath:"".concat(T.id,"/").concat(P.id,"/demo/").concat(j.filename),targetExample:P,targetTopic:T}))})})}),x}function m(p,x,T,P){var j=E(p);return j.get("".concat(x,"-").concat(T,"-").concat(P))}},74377:function(J,f,t){"use strict";t.d(f,{NT:function(){return j},ZY:function(){return P},ic:function(){return ue},km:function(){return T},tF:function(){return V}});var _=t(54856),v=t.n(_),u=t(84140),E=t.n(u),m=t(1201),p=t(3334),x=t(62903),T=function(){var h=(0,m.useState)(!1),y=E()(h,2),M=y[0],Z=y[1];return(0,m.useEffect)(function(){window.location.host.includes("gitee.io")&&window.location.host.includes("antv")&&Z(!0)},[]),[M]},P=function(){document.body.scrollTop=document.documentElement.scrollTop=0},j=function(h){var y=(0,x.YB)();return y.formatMessage({id:h})},fe=function(h){var y=h.link,M=y===void 0?"":y,Z=h.siteUrl,W=Z===void 0?"":Z,G=h.lang,b=G===void 0?"":G,F;M?F=M:W==="https://antv.vision"?F="/".concat(b):F="https://antv.vision/".concat(b);var $=useState(""),X=_slicedToArray($,2),te=X[0],ne=X[1];return useEffect(function(){window.location.host.includes("gitee.io")&&window.location.host.includes("antv")&&ne("https://antv.gitee.io/".concat(b))},[]),[te||F]},V=function(){var h=(0,m.useState)([]),y=E()(h,2),M=y[0],Z=y[1];return(0,m.useEffect)(function(){var W=document.querySelectorAll("aside .ant-menu-item a"),G=document.querySelector("aside .ant-menu-item-selected a"),b=Array.from(W).findIndex(function(ne){return ne===G}),F=b-1>=0?W[b-1]:void 0,$=b+1<W.length?W[b+1]:void 0,X=F?{slug:F.getAttribute("href")||void 0,title:F.textContent||void 0}:void 0,te=$?{slug:$.getAttribute("href")||void 0,title:$.textContent||void 0}:void 0;Z([X,te])},[]),M};function ue(S){var h=(0,x.bU)();return v()(S)==="object"?(0,p.Z)(S,[h.id]):S}}}]);
