(this["webpackJsonpappalti190-client"]=this["webpackJsonpappalti190-client"]||[]).push([[15],{304:function(e,t,n){"use strict";var o=n(21),a=n(310),c=n(0),r=n.n(c),i=n(290),l=n(358),s=n(344),d=n(359),b=n(360),u=n(361),j=n(1),f=["title","contentText","actions"],O=function(e){var t=e.title,n=e.contentText,c=e.actions,r=Object(a.a)(e,f);return Object(j.jsxs)(l.a,Object(o.a)(Object(o.a)({},r),{},{onBackdropClick:function(){},"aria-labelledby":t,onClose:function(e,t){},children:[Object(j.jsx)(s.a,{children:t}),Object(j.jsx)(d.a,{children:Object(j.jsx)(b.a,{children:n})}),Object(j.jsx)(u.a,{children:c.map((function(e,t){return Object(j.jsx)(i.a,{onClick:function(){e.callback&&e.callback(),e.closeModal&&r.onClose()},variant:"primary"===e.variant?"contained":"secondary"===e.variant?"outlined":"contained",autoFocus:r,style:{textTransform:"none"},children:e.text},t)}))})]}))};O.defaultProps={title:"",contentText:"",actions:[{text:"Ok",closeModal:!0,callback:function(){},variant:"primary",autoFocus:!1}]},t.a=r.a.memo(O)},317:function(e,t,n){"use strict";var o=n(104),a=n(87),c=n.n(a),r=n(31),i=n(45),l=function(){var e=Object(o.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i.a.getUser()){e.next=3;break}return e.abrupt("return",null);case 3:return e.next=5,r.a.get("/job/get");case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),s={get:l,set:function(e){return i.a.getUser()?r.a.put("/job/set",{job:e}):null},upload:function(e){var t=new FormData;return t.append("file",e),r.a.post("/job/upload",t,{headers:{"Content-Type":"multipart/form-data"}})},transformXls2Xml:function(e){return r.a.post("/job/transformXls2Xml/:filePath",{filePath:e})},validateXml:function(e){return r.a.post("/job/validateXml/:transform",{transform:e})},outcomeCheck:function(e,t){return r.a.post("/job/outcomeCheck/:anno/:codiceFiscaleAmministrazione",{anno:e,codiceFiscaleAmministrazione:t})},outcomeFailureDetails:function(e,t){return r.a.post("/job/outcomeFailureDetails/anno/codiceFiscaleAmministrazione",{anno:e,codiceFiscaleAmministrazione:t})},sanitizeJob:function(e){var t;if(null===e||void 0===e||null===(t=e.transform)||void 0===t||!t.xml)return e;var n=e;return n.transform.xml="\u2026",n},getPlans:function(){return r.a.get("/job/getPlans")}};t.a=s},449:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),c=n(283),r=n(14),i=n(21),l=n(310),s=n(292),d=n(459),b=n(295),u=n(299),j=n(450),f=n(460),O=n(294),p=n(410),x=n(45),h=n(317),v=n(290),m=n(462);var g=n(1),k=Object(c.a)((function(e){return{paragraph:{fontSize:"1.1em"},paragraphSmall:{fontSize:"0.8em"},centered:{display:"flex",justifyContent:"center",alignItems:"center"},justified:{textAlign:"justify"},box:{display:"flex"},boxLeft:{justifyContent:"flex-start"},boxRight:{justifyContent:"flex-end"},sup:{fontSize:"0.8em"},scrollableContainer:{display:"flex",flexDirection:"column",marginTop:"1em",minHeight:"5em"},scrollable:{height:"100%",overflowY:"auto",paddingLeft:10,paddingRight:10,minHeight:"3em"}}})),w=a.a.memo((function(e){return Object(g.jsx)("div",{children:e.children})}));w.defaultProps={};var C=a.a.memo((function(e){var t=k(),n=function(){var e=Object(o.useState)({width:window.innerWidth,height:window.innerHeight}),t=Object(r.a)(e,2),n=t[0],a=t[1];return Object(o.useEffect)((function(){function e(){a({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),n}();return Object(g.jsx)("div",{className:t.scrollableContainer,children:Object(g.jsx)("div",{className:t.scrollable,style:{height:Math.max(120,n.height-90-100-60)},children:e.children})})}));C.defaultProps={};var I=a.a.memo((function(e){var t=k();return Object(g.jsx)("div",{className:t.centered,children:Object(g.jsx)("h2",{children:e.children})})}));I.defaultProps={};var E=a.a.memo((function(e){var t=k();return Object(g.jsx)(p.a,{mb:1,children:Object(g.jsx)(O.a,{component:"div",className:"".concat(t.paragraph," ").concat(t.justified," ").concat(e.small?t.paragraphSmall:null," ").concat(e.class),children:e.children})})}));E.defaultProps={class:null};var y=a.a.memo((function(e){var t=k();return Object(g.jsx)(p.a,{component:"span",m:1,className:"".concat(t.box," ").concat(t.boxLeft),children:Object(g.jsx)(v.a,{variant:"contained",color:"secondary",onClick:e.onPrev,disabled:!e.prevIsEnabled,children:e.children})})}));y.defaultProps={};var P=a.a.memo((function(e){var t=k();return Object(g.jsx)(p.a,{component:"span",m:1,className:"".concat(t.box," ").concat(t.boxRight),children:Object(g.jsx)(v.a,{variant:"contained",color:"secondary",onClick:e.onNext,disabled:!e.nextIsEnabled,children:e.children})})}));P.defaultProps={};var S=a.a.memo((function(e){var t=k();return Object(g.jsx)(m.a,{title:e.title,placement:"top",children:Object(g.jsx)("sup",{className:t.sup,children:e.anchor})})}));function N(e){var t=Object(s.a)().t,n=Object(o.useState)(!0),a=Object(r.a)(n,1)[0];return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:t("Welcome!")}),Object(g.jsxs)(E,{children:["Questa \xe8 la nostra proposta per adempiere i requisiti della "," ",Object(g.jsx)("a",{href:"https://www.anticorruzione.it/-/adempimenti-legge-190/2012-art.-1-comma-32-7",target:"legge190",children:"Legge 190"}),". Speriamo che sia chiara e semplice da usare."]}),Object(g.jsx)(E,{children:"Questa app ti guider\xe0 passo passo nei pochi passi che occorrono per completare l'adempimento con successo."}),Object(g.jsxs)(E,{children:["Per iniziare dovrai scaricare un modello Excel",Object(g.jsx)(S,{title:"Pu\xf2 essere in formato MicroSoft-Excel, oppure in formato ODS, come preferisci."}),", che contiene delle regole per guidarti nella compilazione, e minimizzare i possibili errori formali."]}),Object(g.jsx)(E,{children:"Poi dovrai inserire, uno per riga, tutti i beni o servizi che la tua struttura ha appaltato nell'anno in corso."}),Object(g.jsx)(E,{children:"Alla fine dell'anno, in genere entro la fine di Gennaio dell'anno successivo, sar\xe0 sufficiente caricare qui il foglio Excel compilato."}),Object(g.jsx)(E,{children:"A questo punto il nostro sistema effettuer\xe0 il controllo formale dei dati inseriti. Nel caso che venga segnalata qualche anomalia dovrai correggere sul file Excel le anomalie segnalate, e poi ri-caricarlo."}),Object(g.jsx)(E,{children:"Dopodich\xe8 potrai scaricare il documento XML prodotto, che andr\xe0 pubblicato sul sito cui fa riferimento la tua struttura."}),Object(g.jsx)(E,{children:"A questo punto avrai praticamente completato l'adempimento. Se vorrai potrai controllare - sempre su questo sito - l'esito della verifica da parte dell'ANAC."}),Object(g.jsx)(E,{children:'Tieni presente che siamo sempre disponibili a risponderti per qualsiasi dubbio o incertezza. Le modalit\xe0 di assistenza sono diverse, dal supporto telefonico a quello per email, e dipendono anche dal piano scelto. I riferimenti sono presenti nel menu, alla voce "Supporto".'})]}),Object(g.jsx)("div",{children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:a,children:t("Start")})})]})}S.defaultProps={anchor:"*"},N.defaultProps={};var z=a.a.memo(N),J=n(18),A=n(107),D=n(288),T=n(59),U=n(304),M=n(20),F=n.n(M),R=n(75);function L(e){var t=Object(s.a)().t,n=Object(J.f)(),a=Object(o.useState)(!0),c=Object(r.a)(a,1)[0],l=Object(o.useState)((function(){var t,n;return!(null===(t=e.job)||void 0===t||!t.download)&&(null===(n=e.job)||void 0===n?void 0:n.download)})),d=Object(r.a)(l,2),b=d[0],u=d[1],j=Object(A.b)().showModal,f=function(){return!!T.a.getCurrentUser()||(function(e){j(U.a,e)}({title:t("Please log in or register"),contentText:t("You need to be authenticated to proceed"),actions:[{text:t("Login"),closeModal:!0,autoFocus:!0,callback:function(){x.a.set("redirect",e.tabId),n.push("/signin")}},{text:t("Register"),closeModal:!0,callback:function(){x.a.set("redirect",e.tabId),n.push("/signup")}},{text:t("Cancel"),closeModal:!0,callback:function(){return e.goto("prev")}}]}),!1)};return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:t("Download")}),Object(g.jsx)(E,{children:"Scarica il modello Excel in cui potrai inserire i dati degli appalti, uno per riga."}),Object(g.jsx)(E,{children:Object(g.jsxs)(v.a,{onClick:function(){f()&&(Object(R.c)(F.a.data.templateDownloadUrl),u(!0),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{download:!0})))},variant:"contained",color:"tertiary",children:[t("Download")," \u2b07"]})})]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:c,children:t("Back")})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:b,children:t("Continue")})})]})]})}L.defaultProps={};var X=a.a.memo(L),q=Object(c.a)((function(e){return{ul:{padding:32}}}));function B(e){var t=q(),n=Object(s.a)().t,a=Object(o.useState)(!0),c=Object(r.a)(a,1)[0],i=Object(o.useState)(!0),l=Object(r.a)(i,1)[0];return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:n("Fill your data")}),Object(g.jsx)(E,{children:"Adesso puoi aprire il modello scaricato con il tuo programma di gestione fogli di lavoro."}),Object(g.jsxs)(E,{children:['Sono presenti 2 fogli: "METADATI" ed "ELENCO GARE". Ti consigliamo di iniziare dal primo foglio, "METADATI", ed inserire i 4 dati generali richiesti:',Object(g.jsxs)("ul",{className:t.ul,children:[Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"codiceFiscaleStrutturaProponente"})," il codice fiscale della tua struttura"]}),Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"denominazioneStrutturaProponente"})," la ragione sociale della tua struttura"]}),Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"annoRiferimento"})," l'anno di riferimento per cui inserirai gli appalti"]}),Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"urlFile"})," l'indirizzo URL dove sar\xe0 pubblicato il documento finale"]})]})]}),Object(g.jsx)(E,{children:'A questo punto puoi passare al secondo foglio, "ELENCO GARE". Occorre inserire ogni appalto (o "gara"), uno per riga.'}),Object(g.jsxs)(E,{children:["I campi da compilare sono:",Object(g.jsxs)("ul",{className:t.ul,children:[Object(g.jsxs)("li",{children:[Object(g.jsx)("i",{children:"CIG"})," il Codice Identificativo Gara"]}),"... TODO: documentare tutti gli altri campi..."]})]})]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:c,children:n("Back")})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:l,children:n("Continue")})})]})]})}B.defaultProps={};var G=a.a.memo(B),W=n(104),Y=n(87),_=n.n(Y),H=n(76),Q=n(408),V={flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px",borderWidth:2,borderRadius:2,borderColor:"blue",borderStyle:"dashed",backgroundColor:"#fafafa",color:"#353535",outline:"none",transition:"border .24s ease-in-out"},K={backgroundColor:"lightyellow",borderColor:"purple"},Z={backgroundColor:"lightgreen",borderColor:"darkgreen"},$={backgroundColor:"lightred",borderColor:"darkred"},ee=function(e){var t=e.onDrop,n=e.accept,a=Object(s.a)().t,c=Object(Q.a)({onDrop:t,accept:n}),r=c.getRootProps,l=c.getInputProps,d=c.isFocused,b=c.isDragAccept,u=c.isDragReject,j=c.isDragActive,f=Object(o.useMemo)((function(){return Object(i.a)(Object(i.a)(Object(i.a)(Object(i.a)({},V),d?K:{}),b?Z:{}),u?$:{})}),[d,b,u]);return Object(g.jsxs)("div",Object(i.a)(Object(i.a)({className:"dropzone-div"},r({style:f})),{},{children:[Object(g.jsx)("input",Object(i.a)({className:"dropzone-input"},l())),Object(g.jsx)("div",{className:"text-center",children:j?Object(g.jsx)("p",{className:"dropzone-content",children:a("Release to drop the files here")}):Object(g.jsx)("p",{className:"dropzone-content",children:a("Drag 'n drop some files here, or click to select files")})})]}))};function te(e){var t,n,a,c,l,d,b,u=Object(s.a)().t,j=Object(J.f)(),f=Object(o.useState)(!0),O=Object(r.a)(f,1)[0],p=Object(o.useState)(!(null===e||void 0===e||null===(t=e.job)||void 0===t||!t.file)),m=Object(r.a)(p,2),k=m[0],S=m[1],N=Object(A.b)().showModal,z=Object(o.useState)([".csv","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel"]),M=Object(r.a)(z,1)[0];Object(o.useEffect)((function(){return!!T.a.getCurrentUser()||(function(e){N(U.a,e)}({title:u("Please log in or register"),contentText:u("You need to be authenticated to proceed"),actions:[{text:u("Login"),closeModal:!0,autoFocus:!0,callback:function(){x.a.set("redirect",e.tabId),j.push("/signin")}},{text:u("Register"),closeModal:!0,callback:function(){x.a.set("redirect",e.tabId),j.push("/signup")}},{text:u("Cancel"),closeModal:!0,callback:function(){return e.goto("prev")}}]}),!1)}),[e]);var F=Object(o.useCallback)(function(){var t=Object(W.a)(_.a.mark((function t(n){return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:n}));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e]),L=Object(o.useCallback)(Object(W.a)(_.a.mark((function t(){var n;return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(n={}).tabId=e.job.tabId,e.setJob(n),S(!1);case 4:case"end":return t.stop()}}),t)}))),[e]),X=Object(o.useCallback)((function(e){var t,n,o,a;return null!==e&&void 0!==e&&null!==(t=e.type)&&void 0!==t&&null!==(n=t.split("/")[1])&&void 0!==n&&n.match("officedocument.spreadsheetml.sheet")||null!==e&&void 0!==e&&null!==(o=e.type)&&void 0!==o&&null!==(a=o.split("/")[1])&&void 0!==a&&a.match("ms-excel")?null:u("Please upload a spreadsheet")+"."+(null!==e&&void 0!==e&&e.type?" "+u("Selected file looks like {{fileType}}",{fileType:e.type}):"")}),[u]),q=Object(o.useCallback)(function(){var t=Object(W.a)(_.a.mark((function t(n){return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h.a.upload(n).then((function(e){console.log("Upload success, file path",e.data.file),F(e.data.file)}),(function(t){console.error("Upload error:",t),L(),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:{error:Object(R.f)(t)}})),H.b.error(Object(R.f)(t))}));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e,F,L]),B=Object(o.useCallback)(function(){var t=Object(W.a)(_.a.mark((function t(n){return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!n){t.next=13;break}if(!X(n)){t.next=7;break}e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:null})),S(!1),t.next=11;break;case 7:return e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:n})),t.next=10,q(n);case 10:S(!0);case 11:t.next=16;break;case 13:H.b.error(u("No file selected, sorry... Please, repeat...")),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{file:null})),S(!1);case 16:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),[e,q,X,u]),G=Object(o.useCallback)((function(e){console.log("accepted files:",e),B(e[0])}),[B]),Y=function(){var t=Object(W.a)(_.a.mark((function t(){return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.goto("next");case 1:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:u("Upload")}),Object(g.jsx)(E,{children:"Carica il foglio Excel compilato:"}),Object(g.jsxs)("div",{className:"container",children:[Object(g.jsx)(ee,{onDrop:G,accept:M}),Object(g.jsx)("br",{}),Object(g.jsxs)(E,{children:[(null===e||void 0===e||null===(n=e.job)||void 0===n||null===(a=n.file)||void 0===a?void 0:a.originalname)&&u("Selected file")+": ".concat(null===e||void 0===e||null===(c=e.job)||void 0===c||null===(l=c.file)||void 0===l?void 0:l.originalname),Object(g.jsx)("br",{}),(null===e||void 0===e||null===(d=e.job)||void 0===d||null===(b=d.file)||void 0===b?void 0:b.originalname)&&Object(g.jsx)(v.a,{variant:"contained",size:"small",onClick:L,title:u("Remove file"),children:" \ud83d\uddd1 "})]})]})]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:O,children:u("Back")})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:Y,nextIsEnabled:k,children:u("Continue")})})]})]})}te.defaultProps={};var ne=a.a.memo(te);function oe(e){var t,n,a,c=Object(s.a)().t,l=Object(J.f)(),d=x.a.getUser(),b=Object(o.useState)({}),u=Object(r.a)(b,2),j=u[0],f=u[1],O=Object(o.useState)(!(null===e||void 0===e||null===(t=e.job)||void 0===t||null===(n=t.transform)||void 0===n||!n.planUpgradeDeclined)),p=Object(r.a)(O,2),v=p[0],m=p[1],k=Object(o.useState)(!0),S=Object(r.a)(k,1)[0],N=Object(A.b)().showModal;Object(o.useEffect)((function(){var t,n,o,a,r,s,b,u,j,f,O,p;(console.log("useeffect 1"),null!==(t=e.job)&&void 0!==t&&t.transform)?"TRUNCATED_DUE_TO_PLAN_LIMIT"===(null===(n=e.job)||void 0===n||null===(o=n.transform)||void 0===o?void 0:o.code)&&(null!==(a=e.job)&&void 0!==a&&null!==(r=a.transform)&&void 0!==r&&r.planUpgradeDeclined||function(e){N(U.a,e)}({title:c("Please upgrade your plan"),contentText:c("You need to upgrade your plan to proceed.")+"\n"+c('Your current plan is "{{planName}}".',{planName:null===d||void 0===d||null===(s=d.plan)||void 0===s?void 0:s.name})+"\n"+c('To elaborate {{cigCount}} CIGs you need at least plan "{{planName}}"',{cigCount:null===(b=e.job)||void 0===b||null===(u=b.transform)||void 0===u?void 0:u.cigCount,planName:null===(j=e.job)||void 0===j||null===(f=j.transform)||void 0===f||null===(O=f.planRequired)||void 0===O?void 0:O.name}),actions:[{text:c("Upgrade plan"),closeModal:!0,autoFocus:!0,callback:function(){x.a.set("redirect",e.tabId),l.push("/profile",{tabValue:1})}},{text:c("Proceed with the first {{cigNumberAllowed}} CIGs",{cigNumberAllowed:null===d||void 0===d||null===(p=d.plan)||void 0===p?void 0:p.cigNumberAllowed}),closeModal:!0,callback:function(){var t;m(!0),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{transform:Object(i.a)(Object(i.a)({},null===(t=e.job)||void 0===t?void 0:t.transform),{},{planUpgradeDeclined:!0})}))}}]})):m(!0)}),[null===(a=e.job)||void 0===a?void 0:a.transform]),Object(o.useEffect)((function(){console.log("useeffect 2"),e.job.file&&!e.job.transform&&Object(W.a)(_.a.mark((function t(){return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return f({loading:!0}),t.next=3,h.a.transformXls2Xml(e.job.file.path).then((function(t){if(t instanceof Error)return e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{transform:t})),H.b.error(Object(R.f)(t)),f({error:Object(R.f)(t)});e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{transform:t.data.result})),f({success:t.data})}));case 3:case"end":return t.stop()}}),t)})))()}),[]),Object(o.useEffect)((function(){console.log("useeffect 3"),e.job.file&&e.job.transform&&!e.job.validateXml&&Object(W.a)(_.a.mark((function t(){return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return f({loading:!0}),t.next=3,h.a.validateXml(e.job.transform).then((function(t){if(t instanceof Error)return e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{validateXml:t})),H.b.error(Object(R.f)(t)),f({error:Object(R.f)(t)});e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{validateXml:t.data})),f({success:t.data})}),(function(t){e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{validateXml:t}))}));case 3:case"end":return t.stop()}}),t)})))()}),[]);return console.log(e.job),Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:c("Check")}),Object(g.jsxs)(E,{children:[Object(g.jsxs)("pre",{children:["JOB: ",JSON.stringify(e.job,null,2)]}),j&&"loading"in j&&"Elaborazione in corso...",j&&"error"in j&&"Errore: ".concat(j.error),j&&"success"in j&&"Elaborazione completata"]}),j&&"error"in j&&"Errore: ".concat(j.error)]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:S,children:c("Back")})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:v,children:c("Continue")})})]})]})}oe.defaultProps={};var ae=a.a.memo(oe);function ce(e){var t,n,a,c,l=Object(s.a)().t,d=Object(o.useState)({}),b=Object(r.a)(d,2),u=b[0],j=b[1],f=Object(o.useState)(!1),O=Object(r.a)(f,2),p=O[0],x=O[1],v=Object(o.useState)(!0),m=Object(r.a)(v,1)[0];Object(o.useEffect)((function(){e.job&&e.job.transform&&(e.job.outcome?(x(!0),j({success:"successo"===e.job.outcome.esitoUltimoTentativoAccessoUrl})):Object(W.a)(_.a.mark((function t(){var n,o,a,c,r,l;return _.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return j({loading:!0}),t.next=3,h.a.outcomeCheck(null===(n=e.job)||void 0===n||null===(o=n.transform)||void 0===o||null===(a=o.metadati)||void 0===a?void 0:a.annoRiferimento,null===(c=e.job)||void 0===c||null===(r=c.transform)||void 0===r||null===(l=r.header)||void 0===l?void 0:l.codiceFiscaleStrutturaProponente).then((function(t){if(t instanceof Error)return H.b.error(Object(R.f)(t)),j({error:Object(R.f)(t)});e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{outcome:t.data})),j({success:t.data}),x(!0)}),(function(t){return H.b.error(Object(R.f)(t)),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{outcome:t.response.data.message})),j({error:Object(R.f)(t)})}));case 3:case"end":return t.stop()}}),t)})))())}),[e.job.transform,e.job.outcome]);return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:l("Wait for ANAC validation")}),Object(g.jsxs)(E,{children:[u&&"success"in u&&"successo"===(null===(t=e.job)||void 0===t||null===(n=t.outcome)||void 0===n?void 0:n.esitoUltimoTentativoAccessoUrl)&&Object(g.jsxs)("pre",{children:[Object(g.jsx)("span",{style:{color:"green",fontSize:"1.7em"},children:"\u2713"})," ",null===(a=e.job)||void 0===a||null===(c=a.outcome)||void 0===c?void 0:c.dataUltimoTentativoAccessoUrl]}),Object(g.jsxs)("pre",{children:["JOB: ",JSON.stringify(e.job,null,2)]})]}),u&&"error"in u&&"Errore: ".concat(u.error)]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:m,children:l("Back")})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:p,children:l("Continue")})})]})]})}ce.defaultProps={};var re=a.a.memo(ce);function ie(e){var t=Object(s.a)().t,n=Object(J.f)(),a=Object(o.useState)(!0),c=Object(r.a)(a,1)[0],l=Object(o.useState)((function(){var t,n;return!(null===(t=e.job)||void 0===t||!t.download)&&(null===(n=e.job)||void 0===n?void 0:n.downloadDataset)})),d=Object(r.a)(l,2),b=d[0],u=d[1],j=Object(A.b)().showModal,f=function(){return!!T.a.getCurrentUser()||(function(e){j(U.a,e)}({title:t("Please log in or register"),contentText:t("You need to be authenticated to proceed"),actions:[{text:t("Login"),closeModal:!0,autoFocus:!0,callback:function(){x.a.set("redirect",e.tabId),n.push("/signin")}},{text:t("Register"),closeModal:!0,callback:function(){x.a.set("redirect",e.tabId),n.push("/signup")}},{text:t("Cancel"),closeModal:!0,callback:function(){return e.goto("prev")}}]}),!1)};return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsx)(I,{children:t("Download produced dataset and publish")}),Object(g.jsxs)(E,{children:[Object(g.jsxs)("p",{children:[t("Download dataset and provide to publish it"),"."]}),Object(g.jsx)("p",{children:t("The file will have to be reachable at address {{publish_url}}",{publish_url:"https://todo..."})})]}),Object(g.jsx)(E,{children:Object(g.jsxs)(v.a,{onClick:function(){if(f()){var t=e.job.transform.outputUrl;console.log("job:",e.job),console.log("url:",t),Object(R.d)(t),u(!0),e.setJob(Object(i.a)(Object(i.a)({},e.job),{},{downloadDataset:!0}))}},variant:"contained",color:"tertiary",children:[t("Download")," \u2b07"]})})]}),Object(g.jsxs)(D.a,{container:!0,children:[Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:c,children:t("Back")})}),Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(P,{onNext:function(){e.goto("next")},nextIsEnabled:b,children:t("Continue")})})]})]})}ie.defaultProps={};var le=a.a.memo(ie);function se(e){var t=Object(s.a)().t,n=Object(o.useState)(!0),a=Object(r.a)(n,1)[0];return Object(g.jsxs)(w,{children:[Object(g.jsxs)(C,{children:[Object(g.jsxs)(I,{children:[t("Finished"),"!"]}),Object(g.jsx)(E,{children:Object(g.jsx)("div",{style:{fontSize:128,textAlign:"center"},children:"\ud83c\udfc1"})})]}),Object(g.jsx)(D.a,{container:!0,children:Object(g.jsx)(D.a,{item:!0,xs:6,children:Object(g.jsx)(y,{onPrev:function(){e.goto("prev")},prevIsEnabled:a,children:t("Back")})})})]})}se.defaultProps={};var de=a.a.memo(se),be=["children","value","index"];function ue(e){var t=e.children,n=e.value,o=e.index,a=Object(l.a)(e,be);return Object(g.jsx)(O.a,Object(i.a)(Object(i.a)({component:"div",role:"tabpanel",hidden:n!==o,id:"scrollable-auto-tabpanel-".concat(o),"aria-labelledby":"nav-tab-".concat(o)},a),{},{children:Object(g.jsx)(p.a,{p:3,children:t})}))}var je=function(e){return{id:"nav-tab-".concat(e),"aria-controls":"nav-tabpanel-".concat(e)}},fe=Object(d.a)((function(e){return{root:{opacity:.8}}}))((function(e){return Object(g.jsx)(f.a,Object(i.a)({},e))})),Oe=Object(c.a)((function(e){return{root:{flexGrow:1},tab:{backgroundColor:e.palette.secondary.light},tabIndicator:{backgroundColor:"MediumSeaGreen",height:3}}})),pe=function(){var e=Oe(),t=Object(o.useState)((function(){return x.a.getJob()})),n=Object(r.a)(t,2),a=n[0],c=n[1],l=Object(s.a)().t;function d(e){c(Object(i.a)(Object(i.a)({},a),{},{tabId:e}))}function f(e){var t=e;if("string"===typeof e)switch(e.toLowerCase()){case"start":case"download":case"fill your data":case"upload":case"check":case"publish":case"wait for validation":case"finish!":break;case"next":t=a?a.tabId+1:0;break;case"prev":t=a?a.tabId-1:0;break;default:return void console.error("Unforeseen where specification in goto: ".concat(e))}d(t)}return Object(o.useEffect)((function(){var e=x.a.get("redirect");e&&(c(Object(i.a)(Object(i.a)({},a),{},{tabId:e})),x.a.remove("redirect"))}),[a]),Object(o.useEffect)((function(){x.a.setJob(a),h.a.set(a)}),[a]),null!==a&&void 0!==a&&a.tabId||(a.tabId=0),Object(g.jsxs)("div",{className:e.root,children:[Object(g.jsx)(b.a,{elevation:0,position:"fixed",style:{top:50},children:Object(g.jsx)(u.a,{elevation:1,square:!0,children:Object(g.jsxs)(j.a,{value:null===a||void 0===a?void 0:a.tabId,variant:"scrollable",scrollButtons:"auto",onChange:function(e,t){F.a.ui.userCanForceTabChange&&d(t)},"aria-label":"current section",classes:{indicator:e.tabIndicator},className:e.tab,children:[Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Start")," \ud83e\ude84")},je(0))),Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Download")," \u25bc")},je(1))),Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Fill your data")," \ud83d\udd8b")},je(2))),Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Upload")," \u25b2")},je(3))),Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Check")," \u2705")},je(4))),Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Publish")," \ud83c\udf0d")},je(5))),Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Wait for validation")," \ud83c\udfaf")},je(6))),Object(g.jsx)(fe,Object(i.a)({label:"".concat(l("Finish!")," \ud83c\udfc1")},je(7)))]})})}),Object(g.jsxs)(g.Fragment,{children:[0===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:0,value:a.tabId,children:Object(g.jsx)(z,{goto:f,job:a,setJob:function(e){return c(e)}})}),1===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:1,value:a.tabId,children:Object(g.jsx)(X,{goto:f,job:a,setJob:function(e){return c(e)}})}),2===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:2,value:a.tabId,children:Object(g.jsx)(G,{goto:f,job:a,setJob:function(e){return c(e)}})}),3===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:3,value:a.tabId,children:Object(g.jsx)(ne,{goto:f,job:a,setJob:function(e){return c(e)}})}),4===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:4,value:a.tabId,children:Object(g.jsx)(ae,{goto:f,job:a,setJob:function(e){return c(e)}})}),5===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:5,value:a.tabId,children:Object(g.jsx)(le,{goto:f,job:a,setJob:function(e){return c(e)}})}),6===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:6,value:a.tabId,children:Object(g.jsx)(re,{goto:f,job:a,setJob:function(e){return c(e)}})}),7===(null===a||void 0===a?void 0:a.tabId)&&Object(g.jsx)(ue,{index:7,value:a.tabId,children:Object(g.jsx)(de,{goto:f,job:a,setJob:function(e){return c(e)}})})]})]})},xe=Object(c.a)((function(e){return{home:{fontSize:"1.5em"}}}));function he(){var e=xe();return Object(g.jsx)("div",{className:e.home,children:Object(g.jsx)(pe,{})})}t.default=a.a.memo(he)}}]);
//# sourceMappingURL=15.9d1ca167.chunk.js.map