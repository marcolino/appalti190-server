(this["webpackJsonpappalti190-client"]=this["webpackJsonpappalti190-client"]||[]).push([[10],{401:function(e,t,a){"use strict";var r=a(43);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=r(a(44)),n=a(1),c=(0,o.default)((0,n.jsx)("path",{d:"M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"}),"MoreVert");t.default=c},402:function(e,t,a){"use strict";var r=a(43);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=r(a(44)),n=a(1),c=(0,o.default)((0,n.jsx)("path",{d:"M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"}),"Share");t.default=c},403:function(e,t,a){"use strict";var r=a(43);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=r(a(44)),n=a(1),c=(0,o.default)((0,n.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"}),"DeleteForever");t.default=c},409:function(e,t,a){"use strict";var r=a(14),o=a(6),n=a(2),c=a(0),i=(a(11),a(5)),s=a(269),l=a(9),u=a(12),d=a(105),b=a(1),f=Object(d.a)(Object(b.jsx)("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person"),j=a(158),v=a(216);function p(e){return Object(j.a)("MuiAvatar",e)}Object(v.a)("MuiAvatar",["root","colorDefault","circular","rounded","square","img","fallback"]);var O=["alt","children","className","component","imgProps","sizes","src","srcSet","variant"],m=Object(l.a)("div",{name:"MuiAvatar",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,t[a.variant],a.colorDefault&&t.colorDefault]}})((function(e){var t=e.theme,a=e.ownerState;return Object(n.a)({position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,width:40,height:40,fontFamily:t.typography.fontFamily,fontSize:t.typography.pxToRem(20),lineHeight:1,borderRadius:"50%",overflow:"hidden",userSelect:"none"},"rounded"===a.variant&&{borderRadius:t.shape.borderRadius},"square"===a.variant&&{borderRadius:0},a.colorDefault&&{color:t.palette.background.default,backgroundColor:"light"===t.palette.mode?t.palette.grey[400]:t.palette.grey[600]})})),h=Object(l.a)("img",{name:"MuiAvatar",slot:"Img",overridesResolver:function(e,t){return t.img}})({width:"100%",height:"100%",textAlign:"center",objectFit:"cover",color:"transparent",textIndent:1e4}),g=Object(l.a)(f,{name:"MuiAvatar",slot:"Fallback",overridesResolver:function(e,t){return t.fallback}})({width:"75%",height:"75%"});var x=c.forwardRef((function(e,t){var a=Object(u.a)({props:e,name:"MuiAvatar"}),l=a.alt,d=a.children,f=a.className,j=a.component,v=void 0===j?"div":j,x=a.imgProps,y=a.sizes,M=a.src,S=a.srcSet,C=a.variant,N=void 0===C?"circular":C,w=Object(o.a)(a,O),R=null,k=function(e){var t=e.crossOrigin,a=e.referrerPolicy,o=e.src,n=e.srcSet,i=c.useState(!1),s=Object(r.a)(i,2),l=s[0],u=s[1];return c.useEffect((function(){if(o||n){u(!1);var e=!0,r=new Image;return r.onload=function(){e&&u("loaded")},r.onerror=function(){e&&u("error")},r.crossOrigin=t,r.referrerPolicy=a,r.src=o,n&&(r.srcset=n),function(){e=!1}}}),[t,a,o,n]),l}(Object(n.a)({},x,{src:M,srcSet:S})),z=M||S,A=z&&"error"!==k,H=Object(n.a)({},a,{colorDefault:!A,component:v,variant:N}),P=function(e){var t=e.classes,a={root:["root",e.variant,e.colorDefault&&"colorDefault"],img:["img"],fallback:["fallback"]};return Object(s.a)(a,p,t)}(H);return R=A?Object(b.jsx)(h,Object(n.a)({alt:l,src:M,srcSet:S,sizes:y,ownerState:H,className:P.img},x)):null!=d?d:z&&l?l[0]:Object(b.jsx)(g,{className:P.fallback}),Object(b.jsx)(m,Object(n.a)({as:v,ownerState:H,className:Object(i.a)(P.root,f),ref:t},w,{children:R}))}));t.a=x},411:function(e,t,a){"use strict";var r=a(2),o=a(6),n=a(0),c=(a(11),a(5)),i=a(269),s=a(9),l=a(12),u=a(299),d=a(158),b=a(216);function f(e){return Object(d.a)("MuiCard",e)}Object(b.a)("MuiCard",["root"]);var j=a(1),v=["className","raised"],p=Object(s.a)(u.a,{name:"MuiCard",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(){return{overflow:"hidden"}})),O=n.forwardRef((function(e,t){var a=Object(l.a)({props:e,name:"MuiCard"}),n=a.className,s=a.raised,u=void 0!==s&&s,d=Object(o.a)(a,v),b=Object(r.a)({},a,{raised:u}),O=function(e){var t=e.classes;return Object(i.a)({root:["root"]},f,t)}(b);return Object(j.jsx)(p,Object(r.a)({className:Object(c.a)(O.root,n),elevation:u?8:void 0,ref:t,ownerState:b},d))}));t.a=O},412:function(e,t,a){"use strict";var r=a(7),o=a(6),n=a(2),c=a(0),i=(a(11),a(5)),s=a(269),l=a(294),u=a(12),d=a(9),b=a(158),f=a(216);function j(e){return Object(b.a)("MuiCardHeader",e)}var v=Object(f.a)("MuiCardHeader",["root","avatar","action","content","title","subheader"]),p=a(1),O=["action","avatar","className","component","disableTypography","subheader","subheaderTypographyProps","title","titleTypographyProps"],m=Object(d.a)("div",{name:"MuiCardHeader",slot:"Root",overridesResolver:function(e,t){var a;return Object(n.a)((a={},Object(r.a)(a,"& .".concat(v.title),t.title),Object(r.a)(a,"& .".concat(v.subheader),t.subheader),a),t.root)}})({display:"flex",alignItems:"center",padding:16}),h=Object(d.a)("div",{name:"MuiCardHeader",slot:"Avatar",overridesResolver:function(e,t){return t.avatar}})({display:"flex",flex:"0 0 auto",marginRight:16}),g=Object(d.a)("div",{name:"MuiCardHeader",slot:"Action",overridesResolver:function(e,t){return t.action}})({flex:"0 0 auto",alignSelf:"flex-start",marginTop:-4,marginRight:-8,marginBottom:-4}),x=Object(d.a)("div",{name:"MuiCardHeader",slot:"Content",overridesResolver:function(e,t){return t.content}})({flex:"1 1 auto"}),y=c.forwardRef((function(e,t){var a=Object(u.a)({props:e,name:"MuiCardHeader"}),r=a.action,c=a.avatar,d=a.className,b=a.component,f=void 0===b?"div":b,v=a.disableTypography,y=void 0!==v&&v,M=a.subheader,S=a.subheaderTypographyProps,C=a.title,N=a.titleTypographyProps,w=Object(o.a)(a,O),R=Object(n.a)({},a,{component:f,disableTypography:y}),k=function(e){var t=e.classes;return Object(s.a)({root:["root"],avatar:["avatar"],action:["action"],content:["content"],title:["title"],subheader:["subheader"]},j,t)}(R),z=C;null==z||z.type===l.a||y||(z=Object(p.jsx)(l.a,Object(n.a)({variant:c?"body2":"h5",className:k.title,component:"span",display:"block"},N,{children:z})));var A=M;return null==A||A.type===l.a||y||(A=Object(p.jsx)(l.a,Object(n.a)({variant:c?"body2":"body1",className:k.subheader,color:"text.secondary",component:"span",display:"block"},S,{children:A}))),Object(p.jsxs)(m,Object(n.a)({className:Object(i.a)(k.root,d),as:f,ref:t,ownerState:R},w,{children:[c&&Object(p.jsx)(h,{className:k.avatar,ownerState:R,children:c}),Object(p.jsxs)(x,{className:k.content,ownerState:R,children:[z,A]}),r&&Object(p.jsx)(g,{className:k.action,ownerState:R,children:r})]}))}));t.a=y},413:function(e,t,a){"use strict";var r=a(2),o=a(6),n=a(0),c=(a(11),a(5)),i=a(269),s=a(9),l=a(12),u=a(158),d=a(216);function b(e){return Object(u.a)("MuiCardContent",e)}Object(d.a)("MuiCardContent",["root"]);var f=a(1),j=["className","component"],v=Object(s.a)("div",{name:"MuiCardContent",slot:"Root",overridesResolver:function(e,t){return t.root}})((function(){return{padding:16,"&:last-child":{paddingBottom:24}}})),p=n.forwardRef((function(e,t){var a=Object(l.a)({props:e,name:"MuiCardContent"}),n=a.className,s=a.component,u=void 0===s?"div":s,d=Object(o.a)(a,j),p=Object(r.a)({},a,{component:u}),O=function(e){var t=e.classes;return Object(i.a)({root:["root"]},b,t)}(p);return Object(f.jsx)(v,Object(r.a)({as:u,className:Object(c.a)(O.root,n),ownerState:p,ref:t},d))}));t.a=p},454:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return F}));var r=a(0),o=a(18),n=a(292),c=a(283),i=a(409),s=a(402),l=a.n(s),u=a(297),d=a(403),b=a.n(d),f=a(401),j=a.n(f),v=a(411),p=a(412),O=a(413),m=a(6),h=a(2),g=(a(11),a(5)),x=a(269),y=a(9),M=a(12),S=a(158),C=a(216);function N(e){return Object(S.a)("MuiCardActions",e)}Object(C.a)("MuiCardActions",["root","spacing"]);var w=a(1),R=["disableSpacing","className"],k=Object(y.a)("div",{name:"MuiCardActions",slot:"Root",overridesResolver:function(e,t){var a=e.ownerState;return[t.root,!a.disableSpacing&&t.spacing]}})((function(e){var t=e.ownerState;return Object(h.a)({display:"flex",alignItems:"center",padding:8},!t.disableSpacing&&{"& > :not(:first-of-type)":{marginLeft:8}})})),z=r.forwardRef((function(e,t){var a=Object(M.a)({props:e,name:"MuiCardActions"}),r=a.disableSpacing,o=void 0!==r&&r,n=a.className,c=Object(m.a)(a,R),i=Object(h.a)({},a,{disableSpacing:o}),s=function(e){var t=e.classes,a={root:["root",!e.disableSpacing&&"spacing"]};return Object(x.a)(a,N,t)}(i);return Object(w.jsx)(k,Object(h.a)({className:Object(g.a)(s.root,n),ownerState:i,ref:t},c))})),A=a(294),H=(a(14),{pushNotifications:[]}),P=Object(r.createContext)(H),T=a(20),D=a.n(T),I=a(51),L=Object(c.a)((function(e){return{root:{"& > *":{margin:e.spacing(1)}},notifications:{maxWidth:300,fontSize:"1.5em"},media:{maxHeight:300}}}));function F(e){var t=Object(r.useContext)(P),a=t.status,c=t.setStatus,s=Object(o.f)(),d=L(),f=Object(n.a)().t;return Object(w.jsx)("div",{className:d.root,children:a.pushNotifications.map((function(e,t){var r=e.data["google.c.a.ts"],o=new Intl.DateTimeFormat(D.a.languages.fallback,{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).format(1e3*r);return Object(w.jsxs)(v.a,{className:d.root,children:[Object(w.jsx)(p.a,{avatar:Object(w.jsx)(i.a,{sx:{bgcolor:I.a},src:e.notification.image,"aria-label":"notification avatar"}),action:Object(w.jsx)(u.a,{"aria-label":"settings",size:"large",children:Object(w.jsx)(j.a,{})}),title:e.notification.title,subheader:o}),Object(w.jsx)(O.a,{children:Object(w.jsx)("img",{src:e.notification.image,alt:"test",style:{maxHeight:300,maxWidth:300}})}),Object(w.jsx)(O.a,{children:Object(w.jsx)(A.a,{variant:"body2",color:"textSecondary",component:"p",children:e.notification.body})}),Object(w.jsxs)(z,{children:[Object(w.jsx)(u.a,{"aria-label":"share",size:"large",children:Object(w.jsx)(l.a,{onClick:function(){alert(f("Sorry, message sharing is not handled, yet..."))}})}),Object(w.jsx)(u.a,{"aria-label":"delete forever",onClick:function(){return function(e){c({pushNotifications:a.pushNotifications.filter((function(t,a){return a!==e}))}),a.pushNotifications.length<=1&&s.goBack()}(t)},size:"large",children:Object(w.jsx)(b.a,{})})]})]},t)}))})}}}]);
//# sourceMappingURL=10.8aec4c26.chunk.js.map