(this["webpackJsonpappalti190-client"]=this["webpackJsonpappalti190-client"]||[]).push([[13],{306:function(e,t,a){"use strict";var n=a(21),o=a(310),r=a(0),c=a.n(r),i=a(290),s=a(358),d=a(344),l=a(359),u=a(360),m=a(361),b=a(1),f=["title","contentText","actions"],j=function(e){var t=e.title,a=e.contentText,r=e.actions,c=Object(o.a)(e,f);return Object(b.jsxs)(s.a,Object(n.a)(Object(n.a)({},c),{},{onBackdropClick:function(){},"aria-labelledby":t,onClose:function(e,t){},children:[Object(b.jsx)(d.a,{children:t}),Object(b.jsx)(l.a,{children:Object(b.jsx)(u.a,{children:a})}),Object(b.jsx)(m.a,{children:r.map((function(e,t){return Object(b.jsx)(i.a,{onClick:function(){e.callback(),e.closeModal&&c.onClose()},variant:"primary"===e.variant?"contained":"secondary"===e.variant?"outlined":"contained",autoFocus:c,style:{textTransform:"none"},children:e.text},t)}))})]}))};j.defaultProps={title:"",contentText:"",actions:[{text:"Ok",closeModal:!0,callback:function(){},variant:"primary",autoFocus:!1}]},t.a=c.a.memo(j)},314:function(e,t,a){"use strict";a.d(t,"c",(function(){return h})),a.d(t,"a",(function(){return g})),a.d(t,"e",(function(){return O})),a.d(t,"d",(function(){return x})),a.d(t,"b",(function(){return v}));var n=a(21),o=a(0),r=a.n(o),c=a(290),i=a(456),s=a(464),d=a(452),l=a(293),u=a(294),m=a(283),b=a(362),f=function(e,t){return"#"+e.replace(/^#/,"").replace(/../g,(function(e){return("0"+Math.min(255,Math.max(0,parseInt(e,16)+t)).toString(16)).substr(-2)}))},j=a(75),p=a(1),h=r.a.memo((function(e){var t=Object(m.a)((function(e){return{startAdornment:{backgroundColor:"#efefff",height:"2.5rem",maxHeight:"3rem",marginLeft:-15,marginRight:5,paddingLeft:10,paddingRight:10,borderRight:"1px solid #c5c5c5"},endAdornment:{backgroundColor:"#efefff",height:"2.5rem",maxHeight:"3rem",marginLeft:5,marginRight:-15,paddingLeft:10,paddingRight:10,borderLeft:"1px solid #c5c5c5"},textField:{backgroundColor:"#efefff"}}}))();return Object(p.jsx)(i.a,{id:e.id,type:e.type,value:e.value,required:e.required,autoFocus:e.autoFocus,autoComplete:e.autoComplete.toString(),variant:e.variant,fullWidth:e.fullWidth,label:e.label,size:e.size,margin:e.margin,className:e.className?e.className:t.textField,placeholder:e.placeholder,onChange:function(t){return e.onChange(t.target.value)},disabled:e.disabled,error:!Object(j.g)(e.error),InputProps:{startAdornment:e.startAdornmentIcon?Object(p.jsx)(b.a,{className:e.startAdornmentClass?e.startAdornmentClass:t.startAdornment,position:"start",children:e.startAdornmentIcon}):Object(p.jsx)(p.Fragment,{}),endAdornment:e.endAdornmentIcon?Object(p.jsx)(b.a,{className:e.endAdornmentClass?e.endAdornmentClass:t.endAdornment,position:"end",children:e.endAdornmentIcon}):Object(p.jsx)(p.Fragment,{}),className:t.input}})}));h.defaultProps={type:"text",required:!1,autoFocus:!1,autoComplete:!1,variant:"outlined",fullWidth:!0,label:"",size:"small",margin:"dense",className:null,placeholder:"",startAdornmentClass:null,endAdornmentClass:null,disabled:!1,error:""};var g=r.a.memo((function(e){var t=Object(m.a)((function(e){return function(e){return{button:{margin:e.spacing(1,0,0,0),textTransform:"none",fontSize:"1.3em",color:"white",backgroundColor:e.palette.success.main,"&:hover":{backgroundColor:f(e.palette.success.main,-25)}},buttonSecondary:{margin:e.spacing(1,0,0,0),textTransform:"none",fontSize:"1em !important",color:"white",backgroundColor:e.palette.secondary.dark+" !important","&:hover":{backgroundColor:f(e.palette.secondary.dark,-25)+" !important"}},buttonFederated:{margin:e.spacing(1,0,0,0),justifyContent:"flex-start",paddingLeft:e.spacing(5),fontSize:"1.3em"},buttonFederatedFacebook:{backgroundColor:e.palette.socialButtons.facebook.backgroundColor,"&:hover":{backgroundColor:f(e.palette.socialButtons.facebook.backgroundColor,-25)}},buttonFederatedGoogle:{backgroundColor:e.palette.socialButtons.google.backgroundColor,"&:hover":{backgroundColor:f(e.palette.socialButtons.google.backgroundColor,-25)}}}}(e)}))();return Object(p.jsx)(c.a,{fullWidth:e.fullWidth,variant:e.variant,color:e.color,size:e.size,className:"".concat(t.button," ").concat(e.social?t.buttonFederated:""," ").concat(e.social?t["buttonFederated"+Object(j.a)(e.social)]:""," ").concat(t[e.className]),startIcon:e.startIcon,onClick:e.onClick,disabled:e.disabled,children:e.children})}));g.defaultProps={fullWidth:!0,variant:"contained",color:"primary",social:null},r.a.memo((function(e){var t=Object(m.a)((function(e){return{disabled:{color:"grey",cursor:"default","&:hover":{textDecoration:"none"}}}}))(),a=e.disabled?t.disabled:"";return Object(p.jsx)(s.a,{control:Object(p.jsx)(d.a,{checked:e.checked,onChange:function(t){return e.onChange(t.target.checked)},className:"".concat(e.className," ").concat(a),color:e.color,size:e.size,disabled:e.disabled}),label:Object(p.jsx)(O,{className:"".concat(e.className," ").concat(a),children:e.children})})})).defaultProps={checked:!1,color:"primary",size:"small"};var O=r.a.memo((function(e){return Object(p.jsx)(u.a,Object(n.a)(Object(n.a)({component:e.component,variant:e.variant,color:e.color,align:e.align},e),{},{children:e.children}))}));O.defaultProps={component:"h1",variant:"body2",color:"textPrimary"};var x=r.a.memo((function(e){var t=Object(m.a)((function(t){return{normal:{cursor:"pointer",textDecoration:e.decoration?e.decoration:"none"},disabled:{color:"grey",cursor:"default","&:hover":{textDecoration:"none",color:"grey"}}}}))(),a=e.disabled?t.disabled:t.normal;return Object(p.jsx)(l.a,Object(n.a)(Object(n.a)({href:e.href,className:"".concat(e.className," ").concat(a),color:e.color},e),{},{children:e.children}))}));x.defaultProps={color:"textPrimary"};var v=r.a.memo((function(e){var t=Object(m.a)((function(t){return function(t){return{container:{display:"flex",alignItems:"center",marginTop:t.spacing(e.marginVertical),marginBottom:t.spacing(e.marginVertical)},divider:{width:"100%",borderBottom:"1px solid "+(e.color?e.color:t.palette.primary.dark),paddingLeft:t.spacing(1)},text:{paddingLeft:t.spacing(e.paddingHorizontal),paddingRight:t.spacing(e.paddingHorizontal)}}}(t)}))();return Object(p.jsxs)("div",{className:t.container,children:[Object(p.jsx)("div",{className:t.divider}),e.children&&Object(p.jsx)("span",{className:t.text,children:e.children}),Object(p.jsx)("div",{className:t.divider})]})}));v.defaultProps={marginVertical:1,paddingHorizontal:1}},399:function(e,t,a){"use strict";var n=a(43);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n(a(44)),r=a(1),c=(0,o.default)((0,r.jsx)("path",{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"}),"LockOpenOutlined");t.default=c},400:function(e,t,a){"use strict";var n=a(43);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n(a(44)),r=a(1),c=(0,o.default)((0,r.jsx)("path",{d:"M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"}),"LockOpen");t.default=c},439:function(e,t,a){"use strict";a.r(t);var n=a(14),o=a(0),r=a.n(o),c=a(18),i=a(292),s=a(107),d=a(283),l=a(409),u=a(288),m=a(298),b=a(410),f=a(399),j=a.n(f),p=a(352),h=a.n(p),g=a(319),O=a.n(g),x=a(400),v=a.n(x),C=a(75),k=a(59),w=a(76),y=a(314),N=a(112),A=a(306),P=a(1),z=Object(d.a)((function(e){return function(e){return{avatar:{backgroundColor:e.palette.success.main},fieldset:{border:0},title:{width:"100%",color:e.palette.title.color,display:"flex",justifyContent:"center",paddingTop:3,paddingBottom:50,paddingLeft:10,paddingRight:10}}}(e)}));function F(){var e=z(),t=Object(o.useState)(""),a=Object(n.a)(t,2),r=a[0],d=a[1],f=Object(o.useState)(""),p=Object(n.a)(f,2),g=p[0],x=p[1],F=Object(o.useState)(""),M=Object(n.a)(F,2),S=M[0],I=M[1],R=Object(o.useState)({email:null,password:null,passwordConfirmed:null,code:null}),V=Object(n.a)(R,2),D=V[0],L=V[1],T=Object(o.useState)(!1),H=Object(n.a)(T,2),B=H[0],W=H[1],E=Object(o.useState)(""),q=Object(n.a)(E,2),_=q[0],J=q[1],G=Object(o.useState)(""),Y=Object(n.a)(G,2),K=Y[0],Q=Y[1],U=Object(c.f)(),X=Object(i.a)().t,Z=Object(s.b)().showModal,$=function(e){return Z(A.a,e)},ee=function(){if(!B&&!Object(N.b)(r)){var e=X("Please supply a valid email");return w.b.warning(e),L({email:e}),!1}if(B){if(!Object(N.c)(g)){var t=X("Please supply a more complex password");return w.b.warning(t),L({password:t}),!1}if(!S){var a=X("Please confirm the password");return L({passwordConfirmed:a}),w.b.warning(a),!1}if(g!==S){var n=X("The confirmed password does not match the password");return w.b.warning(n),L({passwordConfirmed:n}),!1}}return!0};return Object(P.jsx)(m.a,{maxWidth:"xs",children:Object(P.jsx)("form",{className:e.form,noValidate:!0,autoComplete:"off",children:Object(P.jsxs)("fieldset",{className:e.fieldset,children:[!B&&Object(P.jsxs)(P.Fragment,{children:[Object(P.jsx)(b.a,{m:1}),Object(P.jsx)(u.a,{container:!0,justifyContent:"center",children:Object(P.jsx)(l.a,{className:e.avatar,children:Object(P.jsx)(j.a,{})})}),Object(P.jsx)(b.a,{m:3}),Object(P.jsx)(u.a,{container:!0,justifyContent:"flex-start",children:Object(P.jsx)(y.e,{variant:"subtitle1",className:e.title,children:X("Reset password")})}),Object(P.jsx)(b.a,{m:1}),Object(P.jsx)(y.c,{autoFocus:!0,id:"email",value:r,onChange:d,placeholder:X("Email"),startAdornmentIcon:Object(P.jsx)(v.a,{}),error:D.email}),Object(P.jsx)(b.a,{m:1}),Object(P.jsx)(y.a,{onClick:function(e){e.preventDefault(),ee()&&(L({}),k.a.forgotPassword({email:r}).then((function(e){if(e instanceof Error)return w.b.error(Object(C.d)(e)),L({email:Object(C.d)(e)});W(!0),x(""),e.codeDeliveryMedium;var t=e.codeDeliveryMedium;J(t),$({title:X("Verification code sent"),contentText:X("Verification code sent via {{medium}} to {{email}}.",{medium:t,email:r})+"\n"+X("Please copy and paste it here."),actions:[{text:X("Ok"),closeModal:!0,autoFocus:!0,callback:console.log("Ok")}]})})))},children:X("Request password reset")})]}),B&&Object(P.jsxs)(P.Fragment,{children:[Object(P.jsx)(y.c,{id:"password",type:"password",value:g,onChange:x,placeholder:X("New password"),startAdornmentIcon:Object(P.jsx)(O.a,{}),error:D.password}),Object(P.jsx)(y.c,{id:"passwordConfirmed",type:"password",value:S,onChange:I,placeholder:X("New password confirmation"),startAdornmentIcon:Object(P.jsx)(O.a,{}),error:D.passwordConfirmed}),Object(P.jsx)(y.c,{id:"confirmationCode",type:"number",value:K,onChange:Q,placeholder:X("Numeric code just received by {{codeDeliveryMedium}}",{codeDeliveryMedium:_}),startAdornmentIcon:Object(P.jsx)(h.a,{}),error:D.confirmationCode}),Object(P.jsx)(b.a,{m:1}),Object(P.jsx)(y.a,{onClick:function(e){e.preventDefault(),ee()&&(L({}),k.a.resetPasswordConfirm({email:r,password:g,code:K}).then((function(e){if(e instanceof Error){console.log("EC",e.response.data.code,Object.keys(e),Object.values(e));var t=e.response.data.code;return w.b.error(Object(C.d)(e)),L("code"===t?{confirmationCode:Object(C.d)(e)}:{password:Object(C.d)(e)})}W(!1),d(""),x(""),I(""),Q(""),$({title:X("Password reset success"),contentText:X("You can now sign in with your new password"),actions:[{text:X("Ok"),autoFocus:!0,closeModal:!0,callback:function(){return U.push("/signin")}}]})})))},children:X("Confirm Password Reset")}),Object(P.jsx)(b.a,{m:2}),Object(P.jsx)(u.a,{container:!0,justifyContent:"flex-end",children:Object(P.jsx)(y.d,{decoration:"underline",onClick:function(e){e.preventDefault(),L({}),k.a.resendResetPasswordCode({email:r}).then((function(e){if(e instanceof Error)return L({confirmationCode:Object(C.d)(e)}),void w.b.error(Object(C.d)(e));w.b.info("A verification code has been sent via ".concat(e.codeDeliveryMedium," to ").concat(r))}))},children:X("Resend code")})})]})]})})})}t.default=r.a.memo(F)}}]);
//# sourceMappingURL=13.d961b985.chunk.js.map