(this["webpackJsonpappalti190-client"]=this["webpackJsonpappalti190-client"]||[]).push([[9],{234:function(e,t,r){"use strict";r.d(t,"c",(function(){return g})),r.d(t,"a",(function(){return h})),r.d(t,"e",(function(){return O})),r.d(t,"d",(function(){return v})),r.d(t,"b",(function(){return x}));var n=r(17),a=r(0),o=r.n(a),c=r(224),i=r(312),l=r(303),s=r(317),d=r(217),u=r(179),f=r(182),m=r(302),b=function(e,t){return"#"+e.replace(/^#/,"").replace(/../g,(function(e){return("0"+Math.min(255,Math.max(0,parseInt(e,16)+t)).toString(16)).substr(-2)}))},j=r(55),p=r(2),g=o.a.memo((function(e){var t=Object(f.a)((function(e){return{startAdornment:{backgroundColor:"#eaedf0",height:"2.5rem",maxHeight:"3rem",marginLeft:-15,marginRight:5,paddingLeft:10,paddingRight:10,borderRight:"1px solid #c5c5c5"},endAdornment:{backgroundColor:"#eaedf0",height:"2.5rem",maxHeight:"3rem",marginLeft:5,marginRight:-15,paddingLeft:10,paddingRight:10,borderLeft:"1px solid #c5c5c5"}}}))();return Object(p.jsx)(i.a,{id:e.id,type:e.type,value:e.value,required:e.required,autoFocus:e.autoFocus,autoComplete:e.autoComplete.toString(),variant:e.variant,fullWidth:e.fullWidth,label:e.label,size:e.size,margin:e.margin,className:e.className?e.className:t.textField,placeholder:e.placeholder,onChange:function(t){return e.onChange(t.target.value)},disabled:e.disabled,error:!Object(j.e)(e.error),InputProps:{startAdornment:e.startAdornmentIcon?Object(p.jsx)(m.a,{className:e.startAdornmentClass?e.startAdornmentClass:t.startAdornment,position:"start",children:e.startAdornmentIcon}):Object(p.jsx)(p.Fragment,{}),endAdornment:e.endAdornmentIcon?Object(p.jsx)(m.a,{className:e.endAdornmentClass?e.endAdornmentClass:t.endAdornment,position:"end",children:e.endAdornmentIcon}):Object(p.jsx)(p.Fragment,{}),className:t.input}})}));g.defaultProps={type:"text",required:!1,autoFocus:!1,autoComplete:!1,variant:"outlined",fullWidth:!0,label:"",size:"small",margin:"dense",className:null,placeholder:"",startAdornmentClass:null,endAdornmentClass:null,disabled:!1,error:""};var h=o.a.memo((function(e){var t=Object(f.a)((function(e){return function(e){return{button:{margin:e.spacing(1,0,0,0),textTransform:"none",fontSize:"1.3em",color:"white",backgroundColor:e.palette.success.main,"&:hover":{backgroundColor:b(e.palette.success.main,-25)}},buttonSecondary:{margin:e.spacing(1,0,0,0),textTransform:"none",fontSize:"1em !important",color:"white",backgroundColor:e.palette.secondary.dark+" !important","&:hover":{backgroundColor:b(e.palette.secondary.dark,-25)+" !important"}},buttonFederated:{margin:e.spacing(1,0,0,0),justifyContent:"flex-start",paddingLeft:e.spacing(5),fontSize:"1.3em"},buttonFederatedFacebook:{backgroundColor:e.palette.socialButtons.facebook.backgroundColor,"&:hover":{backgroundColor:b(e.palette.socialButtons.facebook.backgroundColor,-25)}},buttonFederatedGoogle:{backgroundColor:e.palette.socialButtons.google.backgroundColor,"&:hover":{backgroundColor:b(e.palette.socialButtons.google.backgroundColor,-25)}}}}(e)}))();return Object(p.jsx)(c.a,{fullWidth:e.fullWidth,variant:e.variant,color:e.color,size:e.size,className:"".concat(t.button," ").concat(e.social?t.buttonFederated:""," ").concat(e.social?t["buttonFederated"+Object(j.a)(e.social)]:""," ").concat(t[e.className]),startIcon:e.startIcon,onClick:e.onClick,disabled:e.disabled,children:e.children})}));h.defaultProps={fullWidth:!0,variant:"contained",color:"primary",social:null},o.a.memo((function(e){var t=Object(f.a)((function(e){return{disabled:{color:"grey",cursor:"default","&:hover":{textDecoration:"none"}}}}))(),r=e.disabled?t.disabled:"";return Object(p.jsx)(l.a,{control:Object(p.jsx)(s.a,{checked:e.checked,onChange:function(t){return e.onChange(t.target.checked)},className:"".concat(e.className," ").concat(r),color:e.color,size:e.size,disabled:e.disabled}),label:Object(p.jsx)(O,{className:"".concat(e.className," ").concat(r),children:e.children})})})).defaultProps={checked:!1,color:"primary",size:"small"};var O=o.a.memo((function(e){return Object(p.jsx)(u.a,Object(n.a)(Object(n.a)({component:e.component,variant:e.variant,color:e.color,align:e.align},e),{},{children:e.children}))}));O.defaultProps={component:"h1",variant:"body2",color:"textPrimary"};var v=o.a.memo((function(e){var t=Object(f.a)((function(t){return{normal:{cursor:"pointer",textDecoration:e.decoration?e.decoration:"none"},disabled:{color:"grey",cursor:"default","&:hover":{textDecoration:"none",color:"grey"}}}}))(),r=e.disabled?t.disabled:t.normal;return Object(p.jsx)(d.a,Object(n.a)(Object(n.a)({href:e.href,className:"".concat(e.className," ").concat(r),color:e.color},e),{},{children:e.children}))}));v.defaultProps={color:"textPrimary"};var x=o.a.memo((function(e){var t=Object(f.a)((function(t){return function(t){return{container:{display:"flex",alignItems:"center",marginTop:t.spacing(e.marginVertical),marginBottom:t.spacing(e.marginVertical)},divider:{width:"100%",borderBottom:"1px solid "+(e.color?e.color:t.palette.primary.dark),paddingLeft:t.spacing(1)},text:{paddingLeft:t.spacing(e.paddingHorizontal),paddingRight:t.spacing(e.paddingHorizontal)}}}(t)}))();return Object(p.jsxs)("div",{className:t.container,children:[Object(p.jsx)("div",{className:t.divider}),e.children&&Object(p.jsx)("span",{className:t.text,children:e.children}),Object(p.jsx)("div",{className:t.divider})]})}));x.defaultProps={marginVertical:1,paddingHorizontal:1}},238:function(e,t,r){"use strict";var n=r(33),a=r(34);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a(r(0)),c=(0,n(r(35)).default)(o.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");t.default=c},245:function(e,t,r){"use strict";var n=r(33),a=r(34);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a(r(0)),c=(0,n(r(35)).default)(o.createElement("path",{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"}),"Lock");t.default=c},248:function(e,t,r){"use strict";var n=r(1),a=r(3),o=r(0),c=(r(5),r(4)),i=r(6),l=r(80),s=Object(l.a)(o.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");var d=o.forwardRef((function(e,t){var r=e.alt,i=e.children,l=e.classes,d=e.className,u=e.component,f=void 0===u?"div":u,m=e.imgProps,b=e.sizes,j=e.src,p=e.srcSet,g=e.variant,h=void 0===g?"circular":g,O=Object(a.a)(e,["alt","children","classes","className","component","imgProps","sizes","src","srcSet","variant"]),v=null,x=function(e){var t=e.src,r=e.srcSet,n=o.useState(!1),a=n[0],c=n[1];return o.useEffect((function(){if(t||r){c(!1);var e=!0,n=new Image;return n.src=t,n.srcSet=r,n.onload=function(){e&&c("loaded")},n.onerror=function(){e&&c("error")},function(){e=!1}}}),[t,r]),a}({src:j,srcSet:p}),y=j||p,w=y&&"error"!==x;return v=w?o.createElement("img",Object(n.a)({alt:r,src:j,srcSet:p,sizes:b,className:l.img},m)):null!=i?i:y&&r?r[0]:o.createElement(s,{className:l.fallback}),o.createElement(f,Object(n.a)({className:Object(c.a)(l.root,l.system,l[h],d,!w&&l.colorDefault),ref:t},O),v)}));t.a=Object(i.a)((function(e){return{root:{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,width:40,height:40,fontFamily:e.typography.fontFamily,fontSize:e.typography.pxToRem(20),lineHeight:1,borderRadius:"50%",overflow:"hidden",userSelect:"none"},colorDefault:{color:e.palette.background.default,backgroundColor:"light"===e.palette.type?e.palette.grey[400]:e.palette.grey[600]},circle:{},circular:{},rounded:{borderRadius:e.shape.borderRadius},square:{borderRadius:0},img:{width:"100%",height:"100%",textAlign:"center",objectFit:"cover",color:"transparent",textIndent:1e4},fallback:{width:"75%",height:"75%"}}}),{name:"MuiAvatar"})(d)},272:function(e,t,r){"use strict";var n=r(33),a=r(34);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a(r(0)),c=(0,n(r(35)).default)(o.createElement("path",{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"}),"LockOutlined");t.default=c},318:function(e,t,r){"use strict";r.r(t);var n,a=r(19),o=r(0),c=r.n(o),i=r(11),l=r(230),s=r(182),d=r(248),u=r(218),f=r(226),m=r(313),b=r(272),j=r.n(b),p=r(238),g=r.n(p),h=r(245),O=r.n(h),v=r(17),x=["title","titleId"];function y(){return y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},y.apply(this,arguments)}function w(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}function C(e,t){var r=e.title,a=e.titleId,c=w(e,x);return o.createElement("svg",y({fill:"#ffffff",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 50 50",width:"50px",height:"50px",ref:t,"aria-labelledby":a},c),r?o.createElement("title",{id:a},r):null,n||(n=o.createElement("path",{d:"M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"})))}var k,N=o.forwardRef(C),P=(r.p,["title","titleId"]);function S(){return S=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},S.apply(this,arguments)}function z(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}function I(e,t){var r=e.title,n=e.titleId,a=z(e,P);return o.createElement("svg",S({fill:"#ffffff",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 50 50",width:"50px",height:"50px",ref:t,"aria-labelledby":n},a),r?o.createElement("title",{id:n},r):null,k||(k=o.createElement("path",{d:"M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"})))}var L=o.forwardRef(I),A=(r.p,r(2)),R={display:"flex",width:20,height:20,alignItems:"center",justifyContent:"center",marginLeft:5,marginRight:5},F=c.a.memo((function(){return Object(A.jsx)("div",{style:Object(v.a)(Object(v.a)({},R),{},{width:26,marginLeft:1}),children:Object(A.jsx)(N,{})})})),E=c.a.memo((function(){return Object(A.jsx)("div",{style:Object(v.a)(Object(v.a)({},R),{},{width:20,marginLeft:1,marginRight:10}),children:Object(A.jsx)(L,{})})})),M=r(56),V=r(234),H=r(55),B=r(57),D=r(46),W=r(75),_=r(86),T=r(12),q=r.n(T),G=Object(s.a)((function(e){return function(e){return{avatar:{backgroundColor:e.palette.success.main},forgotPassword:{color:e.palette.success.main},signUp:{color:e.palette.success.main},columnLeft:{marginLeft:e.spacing(.2)},columnRight:{marginLeft:"auto",marginRight:e.spacing(.2)},fieldset:{border:0}}}(e)}));function J(){var e=G(),t=Object(i.f)(),r=Object(o.useState)(""),n=Object(a.a)(r,2),c=n[0],s=n[1],b=Object(o.useState)(""),p=Object(a.a)(b,2),h=p[0],v=p[1],x=Object(o.useState)({}),y=Object(a.a)(x,2),w=y[0],C=y[1],k=Object(o.useContext)(W.a),N=Object(l.a)().t,P=function(){return!!k||(M.b.warning("Sorry, we are currently offline. Please wait for the network to become available."),!1)},S=function(){if(!Object(_.b)(c)){var e="Please supply a valid email";return C({email:e}),M.b.warning(e),!1}if(!h){var t="Please supply a password";return C({password:t}),M.b.warning(t),!1}return!0};return Object(A.jsx)(f.a,{maxWidth:"xs",children:Object(A.jsx)("form",{className:e.form,noValidate:!0,autoComplete:"off",children:Object(A.jsxs)("fieldset",{className:e.fieldset,children:[Object(A.jsx)(m.a,{m:0}),Object(A.jsx)(u.a,{container:!0,justifyContent:"center",children:Object(A.jsx)(d.a,{className:e.avatar,children:Object(A.jsx)(j.a,{})})}),Object(A.jsx)(m.a,{m:2}),Object(A.jsx)(u.a,{container:!0,justifyContent:"flex-start",children:Object(A.jsx)(V.e,{children:N("Sign in with email and password")})}),Object(A.jsx)(m.a,{m:0}),Object(A.jsx)(V.c,{autoFocus:!0,id:"email",value:c,onChange:s,placeholder:N("Email"),startAdornmentIcon:Object(A.jsx)(g.a,{}),error:w.email}),Object(A.jsx)(V.c,{id:"password",type:"password",value:h,onChange:v,placeholder:N("Password"),startAdornmentIcon:Object(A.jsx)(O.a,{}),error:w.password}),Object(A.jsx)(m.a,{m:1}),Object(A.jsx)(V.a,{onClick:function(e){e.preventDefault(),S()&&P()&&(C({}),B.a.signin({email:c,password:h}).then((function(e){if(e instanceof Error)return M.b.error(Object(H.c)(e)),void C({});console.info("signin by ".concat(c)),D.a.dispatch("login"),t.push("/")})))},children:N("Sign In")}),Object(A.jsxs)(u.a,{container:!0,alignItems:"center",children:[Object(A.jsx)(u.a,{className:e.columnLeft}),Object(A.jsx)(u.a,{className:e.columnRight,style:{marginTop:5},children:Object(A.jsx)(V.d,{href:"/forgot-password",className:e.forgotPassword,children:N("Forgot Password?")})})]}),Object(A.jsx)(m.a,{m:2}),Object(A.jsxs)(u.a,{container:!0,direction:"row",justifyContent:"center",spacing:1,children:[Object(A.jsx)(u.a,{item:!0,children:Object(A.jsx)(V.e,{children:N("Don't have an account?")})}),Object(A.jsx)(u.a,{item:!0,children:Object(A.jsx)(V.d,{href:"/signup",className:e.signUp,children:N("Register Now!")})})]}),!!q.a.federatedSigninProviders.length&&Object(A.jsxs)(A.Fragment,{children:[Object(A.jsx)(m.a,{m:3}),Object(A.jsx)(V.b,{children:Object(A.jsx)(V.e,{children:Object(A.jsx)("i",{children:N("or")})})}),Object(A.jsx)(m.a,{m:3}),Object(A.jsx)(u.a,{container:!0,justifyContent:"flex-start",children:Object(A.jsx)(V.e,{children:N("Sign in with a social account")})}),Object(A.jsx)(m.a,{m:0}),q.a.federatedSigninProviders.map((function(e){return Object(A.jsx)(V.a,{social:e,startIcon:"Facebook"===e?Object(A.jsx)(F,{}):Object(A.jsx)(E,{}),onClick:function(e){return function(e,t){e.preventDefault(),S()&&P()&&(C({}),window.open("/api/auth/loginGoogle","_self"))}(e)},children:e},e)}))]})]})})})}t.default=c.a.memo(J)}}]);
//# sourceMappingURL=9.4518d3e3.chunk.js.map