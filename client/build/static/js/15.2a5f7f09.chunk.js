(this["webpackJsonpappalti190-client"]=this["webpackJsonpappalti190-client"]||[]).push([[15],{306:function(e,t,n){"use strict";var a=n(21),o=n(310),c=n(0),r=n.n(c),i=n(290),l=n(358),s=n(344),d=n(359),u=n(360),b=n(361),j=n(1),f=["title","contentText","actions"],O=function(e){var t=e.title,n=e.contentText,c=e.actions,r=Object(o.a)(e,f);return Object(j.jsxs)(l.a,Object(a.a)(Object(a.a)({},r),{},{onBackdropClick:function(){},"aria-labelledby":t,onClose:function(e,t){},children:[Object(j.jsx)(s.a,{children:t}),Object(j.jsx)(d.a,{children:Object(j.jsx)(u.a,{children:n})}),Object(j.jsx)(b.a,{children:c.map((function(e,t){return Object(j.jsx)(i.a,{onClick:function(){e.callback(),e.closeModal&&r.onClose()},variant:"primary"===e.variant?"contained":"secondary"===e.variant?"outlined":"contained",autoFocus:r,style:{textTransform:"none"},children:e.text},t)}))})]}))};O.defaultProps={title:"",contentText:"",actions:[{text:"Ok",closeModal:!0,callback:function(){},variant:"primary",autoFocus:!1}]},t.a=r.a.memo(O)},317:function(e,t,n){"use strict";var a=n(104),o=n(87),c=n.n(o),r=n(31),i=n(45),l=function(){var e=Object(a.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i.a.getUser()){e.next=3;break}return e.abrupt("return",null);case 3:return e.next=5,r.a.get("/job/get");case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),s={get:l,set:function(e){return i.a.getUser()?r.a.put("/job/set",{job:e}):null},upload:function(e){var t=new FormData;return t.append("file",e),r.a.post("/job/upload",t,{headers:{"Content-Type":"multipart/form-data"}})},transformXls2Xml:function(e){return r.a.post("/job/transformXls2Xml/:filePath",{filePath:e})},validateXml:function(e){return r.a.post("/job/validateXml/:transform",{transform:e})},outcomeCheck:function(e,t){return r.a.post("/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione",{anno:e,codiceFiscaleAmministrazione:t})},outcomeFailureDetails:function(e,t){return r.a.post("/job/outcomeFailureDetails/anno/codiceFiscaleAmministrazione",{anno:e,codiceFiscaleAmministrazione:t})},sanitizeJob:function(e){var t;if(null===e||void 0===e||null===(t=e.transform)||void 0===t||!t.xml)return e;var n=e;return n.transform.xml="\u2026",n},getPlans:function(){return r.a.get("/job/getPlans")}};t.a=s},449:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),c=n(283),r=n(14),i=n(21),l=n(310),s=n(292),d=n(459),u=n(295),b=n(299),j=n(450),f=n(460),O=n(294),p=n(410),x=n(45),h=n(317),m=n(290),v=n(462);var g=n(1),k=Object(c.a)((function(e){return{paragraph:{fontSize:"1.1em"},paragraphSmall:{fontSize:"0.8em"},centered:{display:"flex",justifyContent:"center",alignItems:"center"},justified:{textAlign:"justify"},box:{display:"flex"},boxLeft:{justifyContent:"flex-start"},boxRight:{justifyContent:"flex-end"},sup:{fontSize:"0.8em"},scrollableContainer:{display:"flex",flexDirection:"column",marginTop:"1em",minHeight:"5em"},scrollable:{height:"100%",overflowY:"auto",paddingLeft:10,paddingRight:10,minHeight:"3em"}}})),w=o.a.memo((function(e){return Object(g.jsx)("div",{children:e.children})}));w.defaultProps={};var C=o.a.memo((function(e){var t=k(),n=function(){var e=Object(a.useState)({width:window.innerWidth,height:window.innerHeight}),t=Object(r.a)(e,2),n=t[0],o=t[1];return Object(a.useEffect)((function(){function e(){o({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),n}();return Object(g.jsx)("div",{className:t.scrollableContainer,children:Object(g.jsx)("div",{className:t.scrollable,style:{height:Math.max(120,n.height-90-100-60)},children:e.children})})}));C.defaultProps={};var I=o.a.memo((function(e){var t=k();return Object(g.jsx)("div",{className:t.centered,children:Object(g.jsx)("h2",{children:e.children})})}));I.defaultProps={};var E=o.a.memo((function(e){var t=k();return Object(g.jsx)(p.a,{mb:1,children:Object(g.jsx)(O.a,{component:"div",className:"".concat(t.paragraph," ").concat(t.justified," ").concat(e.small?t.paragraphSmall:null," ").concat(e.class),children:e.children})})}));E.defaultProps={class:null};var y=o.a.memo((function(e){var t=k();return Object(g.jsx)(p.a,{component:"span",m:1,className:"".concat(t.box," ").concat(t.boxLeft),children:Object(g.jsx)(m.a,{variant:"contained",color:"secondary",onClick:e.onPrev,disabled:!e.prevIsEnabled,children:e.children})})}));y.defaultProps={};var P=o.a.memo((function(e){var t=k();return Object(g.jsx)(p.a,{component:"span",m:1,className:"".concat(t.box," ").concat(t.boxRight),children:Object(g.jsx)(m.a,{variant:"contained",color:"secondary",onClick:e.onNext,disabled:!e.nextIsEnabled,children:e.children})})}));P.defaultProps={};var S=o.a.memo((function(e){var t=k();return Object(g.jsx)(v.a,{title:e.title,placement:"top",children:Object(g.jsx)("sup",{className:t.sup,children:e.anchor})})}));function N(e){var t=Object(s.a)().t,n=Object(a.useState)(!0),o=Object(r.a)(n,1)[0];return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:t("Welcome!")}),Object(g.jsxs)(E,{children:["Questa \xe8 la nostra proposta per adempiere i requisiti della "," ",Object(g.jsx)("a",{href:"https://www.anticorruzione.it/-/adempimenti-legge-190/2012-art.-1-comma-32-7",target:"legge190",children:"Legge 190"}),". Speriamo che sia chiara e semplice da usare."]}),Object(g.jsx)(E,{children:"Questa app ti guider\xe0 passo passo nei pochi steps che occorrono per completare l'adempimento con successo."}),Object(g.jsxs)(E,{children:["Per iniziare dovrai scaricare un modello Excel",Object(g.jsx)(S,{title:"Pu\xf2 essere in formato MicroSoft-Excel, oppure in formato ODS, come preferisci."}),", che contiene delle regole per guidarti nella compilazione, e minimizzare i possibili errori formali."]}),Object(g.jsx)(E,{children:"Poi dovrai inserire, uno per riga, tutti i beni o servizi che la tua struttura ha appaltato nell'anno in corso."}),Object(g.jsx)(E,{children:"Alla fine dell'anno, in genere entro la fine di Gennaio dell'anno successivo, sar\xe0 sufficiente caricare qui il foglio Excel compilato."}),Object(g.jsx)(E,{children:"A questo punto il nostro sistema effettuer\xe0 il controllo formale dei dati inseriti. Nel caso che venga segnalato qualche anomalia dovrai correggere sul file Excel le anomalie segnalate, e poi ri-caricarlo."}),Object(g.jsx)(E,{children:"Dopodich\xe8 potrai scaricare il documento XML prodotto, che andr\xe0 pubblicato sul sito cui fa riferimento la tua struttura."}),Object(g.jsx)(E,{children:"A questo punto avrai praticamente completato l'adempimento. Se vorrai potrai controllare - sempre su questo sito - l'esito della verifica da parte dell'ANAC."}),Object(g.jsx)(E,{children:'Tieni presente che siamo sempre disponibili a risponderti per qualsiasi dubbio o incertezza. Le modalit\xe0 di assistenza sono diverse, dal supporto telefonico a quello per email, e dipendono anche dal piano scelto. I riferimenti sono presenti nel menu, alla voce "Supporto".'})]}),Object(g.jsx)("div",{children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:o,children:"".concat(t("Start"))})})]})}S.defaultProps={anchor:"*"},N.defaultProps={};var z=o.a.memo(N),J=n(18),A=n(107),D=n(288),T=n(59),U=n(306),F=n(20),M=n.n(F);function L(e){var t=Object(s.a)().t,n=Object(J.f)(),o=Object(a.useState)(!0),c=Object(r.a)(o,1)[0],l=Object(a.useState)((function(){var t,n;return!(null===(t=e.job)||void 0===t||!t.download)&&(null===(n=e.job)||void 0===n?void 0:n.download)})),d=Object(r.a)(l,2),u=d[0],b=d[1],j=Object(A.b)().showModal,f=function(){return!!T.a.getCurrentUser()||(function(e){j(U.a,e)}({title:t("Please log in or register"),contentText:t("You need to be authenticated to proceed"),actions:[{text:t("Login"),closeModal:!0,autoFocus:!0,callback:function(){x.a.set("redirect",e.tabId),n.push("/signin")}},{text:t("Register"),closeModal:!0,callback:function(){x.a.set("redirect",e.tabId),n.push("/signup")}},{text:t("Cancel"),closeModal:!0,callback:function(){return e.goto("prev")}}]}),!1)};return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:t("Download")}),Object(g.jsx)(E,{children:"Scarica il modello Excel in cui potrai inserire i dati degli appalti, uno per riga."}),Object(g.jsx)(E,{children:Object(g.jsxs)(m.a,{onClick:function(){if(f()){var t=document.createElement("a");t.download=M.a.data.templateDownloadName,t.href=M.a.data.templateDownloadLink,t.click(),b(!0),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{download:!0}))}},variant:"contained",color:"tertiary",children:[t("Download")," \u2b07"]})})]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:c,children:"".concat(t("Back"))})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:u,children:"".concat(t("Continue"))})})]})]})}L.defaultProps={};var R=o.a.memo(L),X=Object(c.a)((function(e){return{ul:{padding:32}}}));function q(e){var t=X(),n=Object(s.a)().t,o=Object(a.useState)(!0),c=Object(r.a)(o,1)[0],i=Object(a.useState)(!0),l=Object(r.a)(i,1)[0];return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:n("Fill your data")}),Object(g.jsx)(E,{children:"Adesso puoi aprire il modello scaricato con il tuo programma di gestione fogli di lavoro."}),Object(g.jsxs)(E,{children:['Sono presenti 2 fogli: "METADATI" ed "ELENCO GARE". Ti consigliamo di iniziare dal primo foglio, "METADATI", ed inserire i 4 dati generali richiesti:',Object(g.jsxs)("ul",{className:t.ul,children:[Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"codiceFiscaleStrutturaProponente"})," il codice fiscale della tua struttura"]}),Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"denominazioneStrutturaProponente"})," la ragione sociale della tua struttura"]}),Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"annoRiferimento"})," l'anno di riferimento per cui inserirai gli appalti"]}),Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"urlFile"})," l'indirizzo URL dove sar\xe0 pubblicato il documento finale"]})]})]}),Object(g.jsx)(E,{children:'A questo punto puoi passare al secondo foglio, "ELENCO GARE". Occorre inserire ogni appalto (o "gara"), uno per riga.'}),Object(g.jsxs)(E,{children:["I campi da compilare sono:",Object(g.jsxs)("ul",{className:t.ul,children:[Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"CIG"})," il Codice Identificativo Gara"]}),"... TODO: documentare tutti gli altri campi..."]})]})]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:c,children:"".concat(n("Back"))})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:l,children:"".concat(n("Continue"))})})]})]})}q.defaultProps={};var B=o.a.memo(q),G=n(104),W=n(87),Y=n.n(W),H=n(75),_=n(76),Q=n(408),V={flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px",borderWidth:2,borderRadius:2,borderColor:"blue",borderStyle:"dashed",backgroundColor:"#fafafa",color:"#353535",outline:"none",transition:"border .24s ease-in-out"},K={backgroundColor:"lightyellow",borderColor:"purple"},Z={backgroundColor:"lightgreen",borderColor:"darkgreen"},$={backgroundColor:"lightred",borderColor:"darkred"},ee=function(e){var t=e.onDrop,n=e.accept,o=Object(s.a)().t,c=Object(Q.a)({onDrop:t,accept:n}),r=c.getRootProps,l=c.getInputProps,d=c.isFocused,u=c.isDragAccept,b=c.isDragReject,j=c.isDragActive,f=Object(a.useMemo)((function(){return Object(i.a)(Object(i.a)(Object(i.a)(Object(i.a)({},V),d?K:{}),u?Z:{}),b?$:{})}),[d,u,b]);return Object(g.jsxs)("div",Object(i.a)(Object(i.a)({className:"dropzone-div"},r({style:f})),{},{children:[Object(g.jsx)("input",Object(i.a)({className:"dropzone-input"},l())),Object(g.jsx)("div",{className:"text-center",children:j?Object(g.jsx)("p",{className:"dropzone-content",children:o("Release to drop the files here")}):Object(g.jsx)("p",{className:"dropzone-content",children:o("Drag 'n drop some files here, or click to select files")})})]}))};function te(e){var t,n,o,c,l,d,u,b=Object(s.a)().t,j=Object(J.f)(),f=Object(a.useState)(!0),O=Object(r.a)(f,1)[0],p=Object(a.useState)(!(null===e||void 0===e||null===(t=e.job)||void 0===t||!t.file)),v=Object(r.a)(p,2),k=v[0],S=v[1],N=Object(A.b)().showModal,z=Object(a.useState)([".csv","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel"]),F=Object(r.a)(z,1)[0];Object(a.useEffect)((function(){return!!T.a.getCurrentUser()||(function(e){N(U.a,e)}({title:b("Please log in or register"),contentText:b("You need to be authenticated to proceed"),actions:[{text:b("Login"),closeModal:!0,autoFocus:!0,callback:function(){x.a.set("redirect",e.tabId),j.push("/signin")}},{text:b("Register"),closeModal:!0,callback:function(){x.a.set("redirect",e.tabId),j.push("/signup")}},{text:b("Cancel"),closeModal:!0,callback:function(){return e.goto("prev")}}]}),!1)}),[e]);var M=Object(a.useCallback)(function(){var t=Object(G.a)(Y.a.mark((function t(n){return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:n}));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e]),L=Object(a.useCallback)(Object(G.a)(Y.a.mark((function t(){var n;return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(n={}).tabId=e.job.tabId,e.setJob(n),S(!1);case 4:case"end":return t.stop()}}),t)}))),[e]),R=Object(a.useCallback)((function(e){var t,n,a,o;return null!==e&&void 0!==e&&null!==(t=e.type)&&void 0!==t&&null!==(n=t.split("/")[1])&&void 0!==n&&n.match("officedocument.spreadsheetml.sheet")||null!==e&&void 0!==e&&null!==(a=e.type)&&void 0!==a&&null!==(o=a.split("/")[1])&&void 0!==o&&o.match("ms-excel")?null:b("Please upload a spreadsheet")+"."+(null!==e&&void 0!==e&&e.type?" "+b("Selected file looks like {{fileType}}",{fileType:e.type}):"")}),[b]),X=Object(a.useCallback)(function(){var t=Object(G.a)(Y.a.mark((function t(n){return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h.a.upload(n).then((function(e){console.log("Upload success, file path",e.data.file),M(e.data.file)}),(function(t){console.error("Upload error:",t),L(),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:{error:Object(H.d)(t)}})),_.b.error(Object(H.d)(t))}));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e,M,L]),q=Object(a.useCallback)(function(){var t=Object(G.a)(Y.a.mark((function t(n){return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!n){t.next=13;break}if(!R(n)){t.next=7;break}e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:null})),S(!1),t.next=11;break;case 7:return e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:n})),t.next=10,X(n);case 10:S(!0);case 11:t.next=16;break;case 13:_.b.error(b("No file selected, sorry... Please, repeat...")),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:null})),S(!1);case 16:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e,X,R,b]),B=Object(a.useCallback)((function(e){console.log("accepted files:",e),q(e[0])}),[q]),W=function(){var t=Object(G.a)(Y.a.mark((function t(){return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.goto("next");case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:b("Upload")}),Object(g.jsx)(E,{children:"Carica il foglio Excel compilato:"}),Object(g.jsxs)("div",{className:"container",children:[Object(g.jsx)(ee,{onDrop:B,accept:F}),Object(g.jsx)("br",{}),Object(g.jsxs)(E,{children:[(null===e||void 0===e||null===(n=e.job)||void 0===n||null===(o=n.file)||void 0===o?void 0:o.originalname)&&b("Selected file")+": ".concat(null===e||void 0===e||null===(c=e.job)||void 0===c||null===(l=c.file)||void 0===l?void 0:l.originalname),Object(g.jsx)("br",{}),(null===e||void 0===e||null===(d=e.job)||void 0===d||null===(u=d.file)||void 0===u?void 0:u.originalname)&&Object(g.jsx)(m.a,{variant:"contained",size:"small",onClick:L,title:b("Remove file"),children:" \ud83d\uddd1 "})]})]})]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:O,children:"".concat(b("Back"))})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:W,nextIsEnabled:k,children:"".concat(b("Continue"))})})]})]})}te.defaultProps={};var ne=o.a.memo(te);function ae(e){var t,n,o,c=Object(s.a)().t,l=Object(J.f)(),d=x.a.getUser(),u=Object(a.useState)({}),b=Object(r.a)(u,2),j=b[0],f=b[1],O=Object(a.useState)(!(null===e||void 0===e||null===(t=e.job)||void 0===t||null===(n=t.transform)||void 0===n||!n.planUpgradeDeclined)),p=Object(r.a)(O,2),m=p[0],v=p[1],k=Object(a.useState)(!0),S=Object(r.a)(k,1)[0],N=Object(A.b)().showModal;Object(a.useEffect)((function(){var t,n,a,o,r,s,u,b,j,f,O,p;(console.log("useeffect 1"),null!==(t=e.job)&&void 0!==t&&t.transform)?"TRUNCATED_DUE_TO_PLAN_LIMIT"===(null===(n=e.job)||void 0===n||null===(a=n.transform)||void 0===a?void 0:a.code)&&(null!==(o=e.job)&&void 0!==o&&null!==(r=o.transform)&&void 0!==r&&r.planUpgradeDeclined||function(e){N(U.a,e)}({title:c("Please upgrade your plan"),contentText:c("You need to upgrade your plan to proceed.")+"\n"+c('Your current plan is "'.concat(null===d||void 0===d||null===(s=d.plan)||void 0===s?void 0:s.name,'".'))+"\n"+c("To elaborate ".concat(null===(u=e.job)||void 0===u||null===(b=u.transform)||void 0===b?void 0:b.cigCount,' CIGs you need at least plan "').concat(null===(j=e.job)||void 0===j||null===(f=j.transform)||void 0===f||null===(O=f.planRequired)||void 0===O?void 0:O.name,'"')),actions:[{text:c("Upgrade plan"),closeModal:!0,autoFocus:!0,callback:function(){x.a.set("redirect",e.tabId),l.push("/profile",{tabValue:1})}},{text:c("Proceed with the first ".concat(null===d||void 0===d||null===(p=d.plan)||void 0===p?void 0:p.cigNumberAllowed," CIGs")),closeModal:!0,callback:function(){var t;v(!0),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{transform:Object(i.a)(Object(i.a)({},null===(t=e.job)||void 0===t?void 0:t.transform),{},{planUpgradeDeclined:!0})}))}}]})):v(!0)}),[null===(o=e.job)||void 0===o?void 0:o.transform]),Object(a.useEffect)((function(){console.log("useeffect 2"),e.job.file&&!e.job.transform&&Object(G.a)(Y.a.mark((function t(){return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return f({loading:!0}),t.next=3,h.a.transformXls2Xml(e.job.file.path).then((function(t){if(t instanceof Error)return e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{transform:t})),_.b.error(Object(H.d)(t)),f({error:Object(H.d)(t)});e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{transform:t.data.result})),f({success:t.data})}));case 3:case"end":return t.stop()}}),t)})))()}),[]),Object(a.useEffect)((function(){console.log("useeffect 3"),e.job.file&&e.job.transform&&!e.job.validateXml&&Object(G.a)(Y.a.mark((function t(){return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return f({loading:!0}),t.next=3,h.a.validateXml(e.job.transform).then((function(t){if(t instanceof Error)return e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{validateXml:t})),_.b.error(Object(H.d)(t)),f({error:Object(H.d)(t)});e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{validateXml:t.data})),f({success:t.data})}),(function(t){e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{validateXml:t}))}));case 3:case"end":return t.stop()}}),t)})))()}),[]);return console.log(e.job),Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:c("Check")}),Object(g.jsxs)(E,{children:[Object(g.jsxs)("pre",{children:["JOB: ",JSON.stringify(e.job,null,2)]}),j&&"loading"in j&&"Elaborazione in corso...",j&&"error"in j&&"Errore: ".concat(j.error),j&&"success"in j&&"Elaborazione completata"]}),j&&"error"in j&&"Errore: ".concat(j.error)]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:S,children:"".concat(c("Back"))})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:m,children:"".concat(c("Continue"))})})]})]})}ae.defaultProps={};var oe=o.a.memo(ae);function ce(e){var t,n,o,c,l=Object(s.a)().t,d=Object(a.useState)({}),u=Object(r.a)(d,2),b=u[0],j=u[1],f=Object(a.useState)(!1),O=Object(r.a)(f,2),p=O[0],x=O[1],m=Object(a.useState)(!0),v=Object(r.a)(m,1)[0];Object(a.useEffect)((function(){e.job&&e.job.transform&&(e.job.outcome?(x(!0),j({success:"successo"===e.job.outcome.esitoUltimoTentativoAccessoUrl})):Object(G.a)(Y.a.mark((function t(){var n,a,o,c,r,l;return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return j({loading:!0}),t.next=3,h.a.outcomeCheck(null===(n=e.job)||void 0===n||null===(a=n.transform)||void 0===a||null===(o=a.metadati)||void 0===o?void 0:o.annoRiferimento,null===(c=e.job)||void 0===c||null===(r=c.transform)||void 0===r||null===(l=r.header)||void 0===l?void 0:l.codiceFiscaleStrutturaProponente).then((function(t){if(t instanceof Error)return _.b.error(Object(H.d)(t)),j({error:Object(H.d)(t)});e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{outcome:t.data})),j({success:t.data}),x(!0)}),(function(t){return _.b.error(Object(H.d)(t)),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{outcome:t.response.data.message})),j({error:Object(H.d)(t)})}));case 3:case"end":return t.stop()}}),t)})))())}),[e.job.transform,e.job.outcome]);return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:l("Wait for ANAC validation")}),Object(g.jsxs)(E,{children:[b&&"success"in b&&"successo"===(null===(t=e.job)||void 0===t||null===(n=t.outcome)||void 0===n?void 0:n.esitoUltimoTentativoAccessoUrl)&&Object(g.jsxs)("pre",{children:[Object(g.jsx)("img",{src:"images/success.ico",width:"64",alt:"success"})," ",null===(o=e.job)||void 0===o||null===(c=o.outcome)||void 0===c?void 0:c.dataUltimoTentativoAccessoUrl]}),Object(g.jsxs)("pre",{children:["JOB: ",JSON.stringify(e.job,null,2)]})]}),b&&"error"in b&&"Errore: ".concat(b.error)]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:v,children:"".concat(l("Back"))})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:p,children:"".concat(l("Continue"))})})]})]})}ce.defaultProps={};var re=o.a.memo(ce);function ie(e){var t=Object(s.a)().t,n=Object(a.useState)(!0),o=Object(r.a)(n,1)[0];return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsxs)(I,{children:[t("Finished"),"!"]}),Object(g.jsx)(E,{children:Object(g.jsx)("div",{style:{fontSize:128,textAlign:"center"},children:"\ud83c\udfc1"})})]}),Object(g.jsx)(D.a,{container:!0,children:Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:o,children:"".concat(t("Back"))})})})]})}ie.defaultProps={};var le=o.a.memo(ie),se=["children","value","index"];function de(e){var t=e.children,n=e.value,a=e.index,o=Object(l.a)(e,se);return Object(g.jsx)(O.a,Object(i.a)(Object(i.a)({component:"div",role:"tabpanel",hidden:n!==a,id:"scrollable-auto-tabpanel-".concat(a),"aria-labelledby":"nav-tab-".concat(a)},o),{},{children:Object(g.jsx)(p.a,{p:3,children:t})}))}var ue=function(e){return{id:"nav-tab-".concat(e),"aria-controls":"nav-tabpanel-".concat(e)}},be=Object(d.a)((function(e){return{root:{opacity:.8}}}))((function(e){return Object(g.jsx)(f.a,Object(i.a)({},e))})),je=Object(c.a)((function(e){return{root:{flexGrow:1},tab:{backgroundColor:e.palette.secondary.light},tabIndicator:{backgroundColor:e.palette.secondary.dark,height:1}}})),fe=function(){var e=je(),t=Object(a.useState)((function(){return x.a.getJob()})),n=Object(r.a)(t,2),o=n[0],c=n[1],l=Object(s.a)().t;function d(e){c(Object(i.a)(Object(i.a)({},o),{},{tabId:e}))}function f(e){var t=e;if("string"===typeof e)switch(e.toLowerCase()){case"start":case"download":case"fill your data":case"upload":case"check":case"wait for validation":case"finish!":break;case"next":t=o?o.tabId+1:0;break;case"prev":t=o?o.tabId-1:0;break;default:return void console.error("Unforeseen where specification in goto: ".concat(e))}d(t)}return Object(a.useEffect)((function(){var e=x.a.get("redirect");e&&(c(Object(i.a)(Object(i.a)({},o),{},{tabId:e})),x.a.remove("redirect"))}),[o]),Object(a.useEffect)((function(){x.a.setJob(o),h.a.set(o)}),[o]),null!==o&&void 0!==o&&o.tabId||(o.tabId=0),Object(g.jsxs)("div",{className:e.root,children:[Object(g.jsx)(u.a,{elevation:0,position:"fixed",style:{top:50},children:Object(g.jsx)(b.a,{elevation:1,square:!0,children:Object(g.jsxs)(j.a,{value:null===o||void 0===o?void 0:o.tabId,variant:"scrollable",scrollButtons:"auto",onChange:function(e,t){M.a.ui.userCanForceTabChange&&d(t)},"aria-label":"current section",classes:{indicator:e.tabIndicator},className:e.tab,children:[Object(g.jsx)(be,Object(i.a)({label:"".concat(l("Start")," \ud83e\ude84")},ue(0))),Object(g.jsx)(be,Object(i.a)({label:"".concat(l("Download")," \u2b07")},ue(1))),Object(g.jsx)(be,Object(i.a)({label:"".concat(l("Fill your data")," \ud83d\udd8b")},ue(2))),Object(g.jsx)(be,Object(i.a)({label:"".concat(l("Upload")," \u2b06")},ue(3))),Object(g.jsx)(be,Object(i.a)({label:"".concat(l("Check")," \u2714")},ue(4))),Object(g.jsx)(be,Object(i.a)({label:"".concat(l("Wait for validation")," \ud83c\udfaf")},ue(5))),Object(g.jsx)(be,Object(i.a)({label:"".concat(l("Finish!")," \ud83c\udfc1")},ue(6)))]})})}),Object(g.jsxs)(g.Fragment,{children:[0===(null===o||void 0===o?void 0:o.tabId)&&Object(g.jsx)(de,{index:0,value:o.tabId,children:Object(g.jsx)(z,{goto:f,job:o,setJob:function(e){return c(e)}})}),1===(null===o||void 0===o?void 0:o.tabId)&&Object(g.jsx)(de,{index:1,value:o.tabId,children:Object(g.jsx)(R,{goto:f,job:o,setJob:function(e){return c(e)}})}),2===(null===o||void 0===o?void 0:o.tabId)&&Object(g.jsx)(de,{index:2,value:o.tabId,children:Object(g.jsx)(B,{goto:f,job:o,setJob:function(e){return c(e)}})}),3===(null===o||void 0===o?void 0:o.tabId)&&Object(g.jsx)(de,{index:3,value:o.tabId,children:Object(g.jsx)(ne,{goto:f,job:o,setJob:function(e){return c(e)}})}),4===(null===o||void 0===o?void 0:o.tabId)&&Object(g.jsx)(de,{index:4,value:o.tabId,children:Object(g.jsx)(oe,{goto:f,job:o,setJob:function(e){return c(e)}})}),5===(null===o||void 0===o?void 0:o.tabId)&&Object(g.jsx)(de,{index:5,value:o.tabId,children:Object(g.jsx)(re,{goto:f,job:o,setJob:function(e){return c(e)}})}),6===(null===o||void 0===o?void 0:o.tabId)&&Object(g.jsx)(de,{index:6,value:o.tabId,children:Object(g.jsx)(le,{goto:f,job:o,setJob:function(e){return c(e)}})})]})]})},Oe=Object(c.a)((function(e){return{home:{fontSize:"1.5em"}}}));function pe(){var e=Oe();return Object(g.jsx)("div",{className:e.home,children:Object(g.jsx)(fe,{})})}t.default=o.a.memo(pe)}}]);
//# sourceMappingURL=15.2a5f7f09.chunk.js.map