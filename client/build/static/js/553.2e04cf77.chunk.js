"use strict";(self.webpackChunkappalti190_client=self.webpackChunkappalti190_client||[]).push([[553],{3553:function(n,e,t){t.r(e);var r=t(390),o=t(971),c=t(3721),u=t(6715),i=t(2687),s=t(2333),a=t(4100);function f(){var n=(0,o.k6)(),e=(0,r.useContext)(s.F),t=(0,r.useContext)(i.V),f=t.auth,l=t.setAuth,h=(0,c.$)().t;return(0,r.useEffect)((function(){e?(0,u.w7)({success:function(){console.log("signOut calling setAuth"),l({user:!1}),n.replace("/")},error:function(n){console.error("signOut error:",n),a.A.error(h(n.message))}}):(console.log("signOut calling setAuth"),l({user:!1}),n.replace("/"))}),[e,n,f,l,h]),null}e.default=r.memo(f)},6715:function(n,e,t){t.d(e,{_f:function(){return l},Rv:function(){return h},w7:function(){return g},y1:function(){return f}});var r=t(6515),o=t(6444),c=t(2600),u=t.n(c),i={signUp:function(n){return s("/api/auth/register","POST",n)},confirmSignUp:function(n){return s("/api/auth/verify/".concat(n.code),"GET",n)},signIn:function(n){return s("/api/auth/login","POST",n)},UNUSEDcurrentAuthenticatedUser:function(n){return new Promise((function(n,e){var t=JSON.parse(localStorage.getItem("auth"));console.log("currentAuthenticatedUser auth:",t),n(!!t&&t.user)}))},signOut:function(n){return new Promise((function(n,e){n()}))}},s=function(n,e,t){return console.log("fetcher:",n,e,t),new Promise((function(o,c){"GET"===e&&t&&(n+="?"+Object.keys(t).map((function(n){return encodeURIComponent(n)+"="+encodeURIComponent(t[n])})).join("&")),console.log("fetcher url 2:",n);var i=(0,r.Z)((0,r.Z)({method:e,headers:new Headers(u().api.headers)},t&&"GET"!==e&&{body:JSON.stringify(t)}),{},{redirect:u().api.redirect});console.log("fetcher opt:",i),fetch(n,(0,r.Z)((0,r.Z)({method:e,headers:new Headers(u().api.headers)},t&&"GET"!==e&&{body:JSON.stringify(t)}),{},{redirect:u().api.redirect})).then((function(e){console.log("fetcher res:",e);try{e.json().then((function(t){console.log("fetcher from ".concat(n," data:"),t),e.ok||c({status:e.status,statusText:e.statusText,message:t.message?t.message:e.statusText}),o(t)}))}catch(t){console.error("fetch ".concat(n," error:"),t),c(t)}})).catch((function(e){console.error("fetch ".concat(n," error:"),e),c(e)}))}))},a=i;function f(n,e){var t=e.success,c=e.error,u=e.final;(0,o.JE)(a.signUp((0,r.Z)({},n)).then((function(n){return t(n)})).catch((function(n){return c(n)})).finally((function(n){return u(n)})))}function l(n,e){var t=e.success,c=e.error,u=e.final;console.log("TrackPromise - props:",n),(0,o.JE)(a.confirmSignUp((0,r.Z)({},n)).then((function(n){return t(n)})).catch((function(n){return c(n)})).finally((function(n){return u(n)})))}function h(n,e){var t=e.success,r=e.error,c=e.final;(0,o.JE)(a.resendSignUp(n).then((function(n){return t(n)})).catch((function(n){return r(n)})).finally((function(n){return c(n)})))}function g(n){var e=n.success,t=n.error,r=n.final;(0,o.JE)(a.signOut().then((function(n){return e(n)})).catch((function(n){return t(n)})).finally((function(n){return r(n)})))}}}]);
//# sourceMappingURL=553.2e04cf77.chunk.js.map