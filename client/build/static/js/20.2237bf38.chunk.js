(this["webpackJsonpappalti190-client"]=this["webpackJsonpappalti190-client"]||[]).push([[20],{326:function(e,t,n){"use strict";var r=n(31),a={getProfile:function(){return r.a.get("/user/getProfile").then((function(e){return e.data}),(function(e){return e}))},updateProfile:function(e){var t=e.email,n=e.password,a=e.firstName,u=e.lastName,o=e.address,s=e.fiscalCode,c=e.businessName;return r.a.post("/user/updateProfile",{email:t,password:n,firstName:a,lastName:u,address:o,fiscalCode:s,businessName:c}).then((function(e){return e.data}),(function(e){return e}))},updateUserProperty:function(e){var t=e.userId,n=e.propertyName,a=e.propertyValue;return r.a.post("/user/updateUserProperty",{userId:t,propertyName:n,propertyValue:a}).then((function(e){return e.data}),(function(e){return e}))},updatePlan:function(e){return console.log("updatePlan - plan:",e),r.a.post("/user/updatePlan",e).then((function(e){return e.data}),(function(e){return e}))},getRoles:function(e){return r.a.get("/user/getRoles").then((function(e){return e.data}),(function(e){return e}))},updateRoles:function(e){return r.a.post("/user/updateRoles",e).then((function(e){return e.data}),(function(e){return e}))},getPublicContent:function(){return r.a.get("/test/all")},getUserBoard:function(){return r.a.get("/test/user")},getModeratorBoard:function(){return r.a.get("/test/mod")},getAdminBoard:function(){return r.a.get("/test/admin")},getAdminPanel:function(){return r.a.get("/admin/getAdminPanel").then((function(e){return e.data}),(function(e){return e}))}};t.a=a},457:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),u=n(18),o=n(295),s=n(326),c=n(76),i=n(77),l=n(1);function p(e){var t=Object(u.f)(),n=Object(o.a)().t,a=Object(u.g)(),p=a.pathname,f=a.search;return Object(r.useEffect)((function(){var e=p.match("/payment-success")?"success":p.match("/payment-cancel")?"cancel":"unknown",r=new URLSearchParams(f).get("product");"success"===e?s.a.updatePlan({plan:r}).then((function(e){if(e instanceof Error)return console.error("profileUpdate error:",e),void i.b.error(Object(c.g)(e));console.log("*** updatePlan result OK (user?):",e),i.b.success(n("Plan updated successfully"))})):console.warn("PaymentRedirect - path name was:",p),t.push("/profile",{tabValue:1})})),Object(l.jsx)(l.Fragment,{})}t.default=a.a.memo(p)}}]);
//# sourceMappingURL=20.2237bf38.chunk.js.map