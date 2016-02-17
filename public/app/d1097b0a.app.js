"use strict";angular.module("koodainApp",["ngCookies","ngResource","ngSanitize","ngFileUpload","ngVis","ui.router","ui.bootstrap","ui-notification","ui.ace"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider","NotificationProvider",function(a,b,c,d,e){b.otherwise("/"),c.html5Mode(!0),d.interceptors.push("authInterceptor"),e.setOptions({startTop:55})}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$stateChangeStart",function(a,d){c.isLoggedInAsync(function(c){d.authenticate&&!c&&(a.preventDefault(),b.path("/login"))})})}]),angular.module("koodainApp").config(["$stateProvider",function(a){a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}]),angular.module("koodainApp").controller("LoginCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.login=function(d){a.submitted=!0,d.$valid&&b.login({email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){a.errors.other=b.message})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("koodainApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){a.errors={},a.changePassword=function(b){a.submitted=!0,b.$valid&&c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){a.message="Password successfully changed."})["catch"](function(){b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""})}}]),angular.module("koodainApp").controller("SignupCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.register=function(d){a.submitted=!0,d.$valid&&b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("koodainApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("koodainApp").config(["$stateProvider",function(a){a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("koodainApp").controller("ApiDescrCtrl",["$scope",function(a){a.message="Hello"}]),angular.module("koodainApp").config(["$stateProvider",function(a){a.state("api-descr",{url:"/api-descr",templateUrl:"app/api-descr/api-descr.html",controller:"ApiDescrCtrl"})}]),angular.module("koodainApp").controller("DeployCtrl",["$scope","$http","$resource","$uibModal","Notification","VisDataSet","queryDevices",function(a,b,c,d,e,f,g){function h(a){var b={playSound:"",measureTemperature:""};if(a in b||(a="default"),a in z)return a;var c=b[a];return c||(c=""),z[a]={shape:"icon",icon:{face:"FontAwesome",code:c,size:50,color:"black"}},z[a+":selected"]={shape:"icon",icon:{face:"FontAwesome",code:c,size:50,color:"purple"}},a}function i(a){return h(a.name)}function j(){return"device"}function k(a){var b=a.id,c={id:b,label:a.name||b,group:j()};return c}function l(a){var b={id:"app:"+a.id,label:a.name,group:i(a),selectable:!1};return b}function m(a){for(var b={},c=0;c<a.length;c++){var d=a[c];b[d.id]=d}return b}function n(){g.queryDevices().then(function(b){A=m(b),g.addMockDevicesTo(A),x=new f,y=new f,r(),a.graphData={nodes:x,edges:y},a.$apply()})}function o(b){x.update(C.map(function(a){return{id:a,group:j(A[a])}})),x.update(b.map(function(a){return{id:a,group:j(A[a])+":selected"}})),C=b,a.selectedDevices=C.map(function(a){return A[a]})}function p(){var b=g.filter(A,a.devicequery,a.appquery);B.selectNodes(b),o(b)}function q(){g.queryDevices().then(function(b){A=m(b),g.addMockDevicesTo(A),r(),p(),a.$apply()})}function r(){x.clear(),y.clear(),Object.keys(A).forEach(function(a){x.add(k(A[a]))});for(var a in A){var b=A[a],c=b.apps;c&&(x.add(c.map(l)),y.add(c.map(function(a){return{from:"app:"+a.id,to:b.id}})))}}function s(a){return"app:"===a.slice(0,4)}function t(a){return!s(a)}function u(b){var c=b.nodes.filter(t);a.devicequery=c.map(function(a){return"#"+a}).join(","),a.$apply()}function v(a){return"/api/pipe/"+a}var w=c("/api/projects");a.projects=w.query();var x,y,z={device:{shape:"icon",icon:{face:"FontAwesome",code:"",size:50,color:"gray"}},"device:selected":{shape:"icon",icon:{face:"FontAwesome",code:"",size:50,color:"purple"}}},A=[];n();var B,C=[],D={onload:function(b){B=b,a.$watch("devicequery",p),a.$watch("appquery",p)},selectNode:u,deselectNode:u};a.loadDevices=q;var E={groups:z,interaction:{multiselect:!0}};a.graphEvents=D,a.graphOptions=E,a.deployments=[],a.openManageAppsModal=function(){d.open({controller:"ManageAppsCtrl",templateUrl:"manageapps.html",resolve:{data:function(){return{devices:a.selectedDevices,devicequery:a.devicequery,appquery:a.appquery}}}}).result.then(function(b){a.deployments.push(b)})},a.verifyDeployment=function(){d.open({controller:"VerifyDeploymentCtrl",templateUrl:"verifydeployment.html",resolve:{deployments:function(){return a.deployments}}}).result.then(function(){a.deployments=[]})},a.discardDeployment=function(){a.deployments=[]},a.openLogModal=function(a,b){d.open({controller:"AppLogCtrl",templateUrl:"applog.html",resolve:{device:a,app:b}}).result.then(null,function(){clearInterval(b._logInterval)})},a.setAppStatus=function(a,c,d){var e=a.url+"/app/"+c.id;return b({url:v(e),method:"PUT",data:{status:d}}).then(function(a){c.status=a.data.status})},a.removeApp=function(a,c){var d=a.url+"/app/"+c.id;return b({url:v(d),method:"DELETE"}).then(function(){for(var b=a.apps,d=0;d<b.length;d++)if(b[d].id===c.id)return void b.splice(d,1)})},a.selectDevicesForProject=function(c){b({method:"GET",url:"/api/projects/"+c.name+"/files/liquidiot.json"}).then(function(b){var c=JSON.parse(b.data.content),d=c["device-classes"];d&&d.length?a.devicequery="."+d.join("."):a.devicequery="*"})}}]).controller("ManageAppsCtrl",["$scope","$resource","$uibModalInstance","data",function(a,b,c,d){a.devices=d.devices,a.devicequery=d.devicequery,a.appquery=d.appquery;var e=b("/api/projects");a.projects=e.query(),a.cancel=function(){c.dismiss("cancel")},a.done=function(){var b={devicequery:d.devicequery,appquery:d.appquery,project:a.selectedProject,numApproxDevices:d.devices.length,n:a.allDevices||!a.numDevices?"all":a.numDevices,removeOld:a.removeOld};c.close(b)}}]).controller("VerifyDeploymentCtrl",["$scope","$http","$resource","$uibModalInstance","Notification","deployments",function(a,b,c,d,e,f){function g(a,c){var d=a.url;return e.info("Deploying "+c+" to "+d),b({method:"POST",url:"/api/projects/"+c+"/package",data:{deviceUrl:d}}).then(function(){})}function h(a){return devicelib.devices(a.devicequery,a.appquery).then(function(b){return a.devices=b,Promise.all(b.map(function(b){return g(b,a.project)}))})}a.deployments=f,a.cancel=function(){d.dismiss("cancel")},a.done=function(){d.close()},a.deploy=function(){var b=a.deployments;b.length&&(a.deploying=!0,Promise.all(b.map(h)).then(function(){delete a.deploying,e.success("Deployment successful!"),d.close()},function(b){console.log(b),delete a.deploying,e.error("Deployment failed!")}))}}]).controller("AppLogCtrl",["$scope","$http","$uibModalInstance","device","app",function(a,b,c,d,e){function f(a){return"/api/pipe/"+a}a.device=d,a.app=e,a.cancel=function(){c.dismiss("cancel")},e._logInterval=setInterval(function(){var c=d.url+"/app/"+e.id+"/log";b({method:"GET",url:f(c)}).then(function(b){a.log=b.data})},2e3)}]),angular.module("koodainApp").config(["$stateProvider",function(a){a.state("deploy",{url:"/deploy",templateUrl:"app/deploy/deploy.html",controller:"DeployCtrl"})}]),angular.module("koodainApp").controller("MainCtrl",["$scope","$http","$resource","$uibModal","Notification",function(a,b,c,d,e){var f=c("/api/projects");a.projects=f.query(),a.openNewProjectModal=function(){d.open({controller:"NewProjectCtrl",templateUrl:"newproject.html"}).result.then(function(b){console.log(b);var c=new f({name:b});c.$save().then(function(){a.projects=f.query()},function(a){e.error(a.data.error)})})}}]).controller("NewProjectCtrl",["$scope","$uibModalInstance",function(a,b){a.ok=function(){console.log(a.newproject.name),b.close(a.newproject.name)},a.cancel=function(){b.dismiss("cancel")}}]),angular.module("koodainApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("koodainApp").controller("ProjectCtrl",["$scope","$stateParams","$resource","Notification","Upload","project","files","resources",function(a,b,c,d,e,f,g,h){function i(a,b){return e.upload({url:b,data:{file:a}}).then(function(){console.log(a),d.success("Uploaded "+a.name)})}a.project=f,a.files=g,a.resources=h;var j,k=ace.require("ace/ext/modelist"),l="/api/projects/"+b.project;a.fileClicked=function(b){a.activeFile=b;var c=k.getModeForPath(b.name);a.activeFile.mode=c?c.name:null},a.aceLoaded=function(a){j=a,j.$blockScrolling=1/0,j.setOptions({fontSize:"11pt"})},a.updating={};var m=c(l+"/files/:name",null,{update:{method:"PUT"}});a.$watch("activeFile.content",function(){var b=a.activeFile;if(b){var c=m.update({name:b.name},b);a.updating[b.name]=c.$promise.$$state}}),a.uploadFile=function(b){var d=l+"/files";i(b,d).then(function(){a.files=c(d).get()})},a.uploadResource=function(b){var d=l+"/files/resources";i(b,d).then(function(){a.resources=c(d).get()})}}]),angular.module("koodainApp").config(["$stateProvider",function(a){a.state("project",{url:"/project/:project",templateUrl:"app/project/project.html",controller:"ProjectCtrl",resolve:{project:["$stateParams","$resource",function(a,b){return b("/api/projects/"+a.project).get().$promise}],files:["$stateParams","$resource",function(a,b){return b("/api/projects/"+a.project+"/files").get().$promise}],resources:["$stateParams","$resource",function(a,b){return b("/api/projects/"+a.project+"/files/resources").get().$promise}]}})}]),angular.module("koodainApp").service("queryDevices",["$http",function(a){function b(a,b){return b.id==a}function c(a,b){return b.type==a}function d(a,b){if(!a)return!0;for(var c=0;c<a.length;c++)if(!b.classes||-1===b.classes.indexOf(a[c]))return!1;return!0}function e(a,b){return"not"===a.key?!n(b,a.value):!0}function f(a,b){if(!a)return!0;for(var c=0;c<a.length;c++)if(!e(a[c],b))return!1;return!0}function g(a,e){return a.tag&&"*"!==a.tag&&!c(a.tag,e)?!1:d(a.classList,e)?a.id&&!b(a.id,e)?!1:f(a.pseudos,e)?a.attributes&&!h(a.attributes,e)?!1:!0:!1:!1}function h(a,b){for(var c=0;c<a.length;c++)if(!i(a[c],b))return!1;return!0}function i(a,b){return a.test(b[a.key])}function j(a,b){for(var c=0;c<a.length;c++)if(!g(a[c],b))return!1;return!0}function k(a,b){for(var c=b.expressions,d=0;d<c.length;d++)if(j(c[d],a))return!0;return!1}function l(a,b){if("string"==typeof b&&(b=Slick.parse(b)),!b)return[];var c=a.apps;if(!c)return!1;for(var d=0;d<c.length;d++)if(k(c[d],b))return!0;return!1}function m(a,b){if("string"==typeof b&&(b=Slick.parse(b)),!b)return[];for(var c=b.expressions,d=0;d<c.length;d++)if(j(c[d],a))return!0;return!1}function n(a,b,c){return b&&!m(a,b)?!1:c&&!l(a,c)?!1:!0}function o(a,b,c){return b||c?Object.keys(a).filter(function(d){return n(a[d],b,c)}):[]}function p(){var a=["canDoSomething","hasSomeProperty","isSomething"],b=a.filter(function(){return Math.random()<.5});return b.push("mock"),b.push(["development","production"][Math.floor(3*Math.random())]),b}function q(){var a=[];return Math.random()<.2&&a.push("playSound"),Math.random()<.2&&a.push("measureTemperature"),a}function r(){return q().map(function(a){return{name:a,id:++z}})}function s(){return"TF11"+Math.floor(10*Math.random())}function t(){var a=p(),b="mock"+ ++y;return{id:b,name:b,classes:a,apps:r(a),location:s()}}function u(){for(var a={},b=0;x>b;b++){var c=t();a[c.id]=c}return a}function v(a){var b=u();for(var c in b)a[c]=b[c];return a}function w(a){return devicelib.devices(a)}var x=100,y=0,z=5e5;return{queryDevices:w,filter:o,addMockDevicesTo:v}}]),angular.module("koodainApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("koodainApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}]),angular.module("koodainApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("koodainApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("koodainApp").controller("NavbarCtrl",["$scope","$location","$state","Auth",function(a,b,c,d){a.$state=c,a.menu=[{title:"Home",link:"/"},{title:"Edit",link:"/project"},{title:"Deploy",link:"/deploy"},{title:"APIs",link:"/api-descr"},{title:"Swagger",link:"/swagger-editor"}],a.isCollapsed=!0,a.isLoggedIn=d.isLoggedIn,a.isAdmin=d.isAdmin,a.getCurrentUser=d.getCurrentUser,a.logout=function(){d.logout(),b.path("/login")},a.isActive=function(a){return(b.path()+"/").startsWith(a+"/")}}]),angular.module("koodainApp").run(["$templateCache",function(a){a.put("app/account/login/login.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from<code>server/config/seed.js</code>. Default account is<code>test@test.com</code>/<code>test</code></p><p>Admin account is<code>admin@admin.com</code>/<code>admin</code></p></div><div class=col-sm-12><form name=form ng-submit=login(form) novalidate class=form><div class=form-group><label>Email</label><input name=email ng-model=user.email class="form-control"></div><div class=form-group><label>Password</label><input type=password name=password ng-model=user.password class="form-control"></div><div class="form-group has-error"><p ng-show="form.email.$error.required &amp;&amp; form.password.$error.required &amp;&amp; submitted" class=help-block>Please enter your email and password.</p><p class=help-block>{{ errors.other }}</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-login">Login</button> <a href=/signup class="btn btn-default btn-lg btn-register">Register</a></div><hr><div><a href="" ng-click=loginOauth(&quot;facebook&quot;) class="btn btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a href="" ng-click=loginOauth(&quot;google&quot;) class="btn btn-google-plus"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a href="" ng-click=loginOauth(&quot;twitter&quot;) class="btn btn-twitter"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form name=form ng-submit=changePassword(form) novalidate class=form><div class=form-group><label>Current Password</label><input type=password name=password ng-model=user.oldPassword mongoose-error="" class="form-control"><p ng-show=form.password.$error.mongoose class=help-block>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword ng-model=user.newPassword ng-minlength=3 required class="form-control"><p ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) &amp;&amp; (form.newPassword.$dirty || submitted)" class=help-block>Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button type=submit class="btn btn-lg btn-primary">Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form name=form ng-submit=register(form) novalidate class=form><div ng-class="{ &quot;has-success&quot;: form.name.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.name.$invalid &amp;&amp; submitted }" class=form-group><label>Name</label><input name=name ng-model=user.name required class="form-control"><p ng-show="form.name.$error.required &amp;&amp; submitted" class=help-block>A name is required</p></div><div ng-class="{ &quot;has-success&quot;: form.email.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.email.$invalid &amp;&amp; submitted }" class=form-group><label>Email</label><input type=email name=email ng-model=user.email required mongoose-error="" class="form-control"><p ng-show="form.email.$error.email &amp;&amp; submitted" class=help-block>Doesn\'t look like a valid email.</p><p ng-show="form.email.$error.required &amp;&amp; submitted" class=help-block>What\'s your email address?</p><p ng-show=form.email.$error.mongoose class=help-block>{{ errors.email }}</p></div><div ng-class="{ &quot;has-success&quot;: form.password.$valid &amp;&amp; submitted,        &quot;has-error&quot;: form.password.$invalid &amp;&amp; submitted }" class=form-group><label>Password</label><input type=password name=password ng-model=user.password ng-minlength=3 required mongoose-error="" class="form-control"><p ng-show="(form.password.$error.minlength || form.password.$error.required) &amp;&amp; submitted" class=help-block>Password must be at least 3 characters.</p><p ng-show=form.password.$error.mongoose class=help-block>{{ errors.password }}</p></div><div><button type=submit class="btn btn-inverse btn-lg btn-login">Sign up</button> <a href=/login class="btn btn-default btn-lg btn-register">Login</a></div><hr><div><a href="" ng-click=loginOauth(&quot;facebook&quot;) class="btn btn-facebook"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a href="" ng-click=loginOauth(&quot;google&quot;) class="btn btn-google-plus"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a href="" ng-click=loginOauth(&quot;twitter&quot;) class="btn btn-twitter"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li ng-repeat="user in users" class=list-group-item><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span><a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/api-descr/api-descr.html","<div>This is the api-descr view.</div>"),a.put("app/deploy/deploy.html",'<!-- Copyright (c) TUT Tampere University of Technology 2015-2016--><!-- All rights reserved.--><!-- --><!-- Main author(s):--><!-- Antti Nieminen <antti.h.nieminen@tut.fi>--><div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div ng-if=deployments.length style="text-align:center; padding:24px" class=jumbotron>You have staged deployment changes<br><button ng-click=discardDeployment() class="btn btn-default">Discard</button> <button ng-click=verifyDeployment() class="btn btn-primary">Verify</button></div><div class=row><div class=col-sm-4><p>{{selectedDevices.length}} devices selected</p><p><div role=group class=btn-group><button ng-disabled=!selectedDevices.length ng-click=openManageAppsModal() class="btn btn-default">Deploy Apps</button></div></p><ul ng-init="shownIndex = -1" class=list-group><li ng-repeat="device in selectedDevices" ng-click="$parent.shownIndex = $index" class=list-group-item><i class=fa>{{device.code}}</i> <strong>{{device.id}}</strong><div><ul class=appinfo><li ng-repeat="app in device.apps"><strong>{{app.name}} {{app.version}}</strong> {{app.status}}<br><div role=group class=btn-group><a ng-if="app.name.indexOf(\'liquidiot-\')===0" ng-href=/project/{{app.name.slice(10)}} class="btn btn-default"><i class="fa fa-edit"></i></a><button ng-click="openLogModal(device, app)" class="btn btn-default"><i class="fa fa-list"></i></button><button ng-if="app.status===\'paused\'" ng-click="setAppStatus(device, app, \'running\')" class="btn btn-primary"><i class="fa fa-play"></i></button><button ng-if="app.status===\'running\'" ng-click="setAppStatus(device, app, \'paused\')" class="btn btn-primary"><i class="fa fa-pause"></i></button><button ng-click="removeApp(device, app)" class="btn btn-danger"><i class="fa fa-trash"></i></button></div></li></ul></div><div><small><code ng-repeat="cls in device.classes">{{cls}}</code></small></div></li></ul></div><div class=col-sm-8><p>Select devices compatible with project:<div role=group class=btn-group><button ng-repeat="project in projects" ng-click=selectDevicesForProject(project) class="btn btn-default">{{project.name}}</button></div></p><p>Or query devices:<form class="form-inline queryform"><label for=devicequery>Device:</label><input id=devicequery ng-model=devicequery ng-model-options="{debounce: 200}" class="form-control"><label for=appquery>App:</label><input id=appquery ng-model=appquery ng-model-options="{debounce: 200}" class="form-control"></form></p><div id=network><vis-network data=graphData options=graphOptions events=graphEvents component=network></vis-network></div><p><button ng-click=loadDevices() class="btn btn-default"><span class="fa fa-refresh"></span></button></p></div></div></div><script type=text/ng-template id=manageapps.html><div class="modal-header"><button type="button" ng-click="cancel()" class="close">&times;</button><h4 class="modal-title">Deploy Applications</h4></div><div class="modal-body"><form name="form" class="form"><div class="form-group"><label for="selectproject">Deploy application</label> <select id="selectproject" ng-model="selectedProject" class="form-control"><option ng-repeat="project in projects">{{project.name}}</option></select> <!--label to--><!--br--><!--input(id="radio-all", type="checkbox", value="all", ng-model="allDevices", ng-init="allDevices = true")--><!--label(for="radio-all")  all--><!--input.form-control(ng-disabled="allDevices", type="number", ng-model="numDevices")--><!--label  devices matching the query//code  {{query}}\n//| . --><label><span ng-if="devicequery">to all the devices matching the query<code> {{devicequery}}</code></span><span ng-if="!devicequery">to all the devices</span><span ng-if="appquery"> with an app matching<code>{{appquery}}</code></span>. </label><small> (Approx. {{devices.length}} such devices.)</small></div><!--.form-groupinput(id="remove-old", type="checkbox", ng-model="removeOld")\nlabel(for="remove-old")\n  |  Remove earlier versions of {{selectedProject || "the same app"}}--></form><!--p| Query: \ncode {{query}}--><div class="modal-footer"><button ng-disabled="!selectedProject" ng-click="done()" class="btn btn-default">Stage deployment</button></div><!--ul.list-group(ng-init="shownIndex = -1")li.list-group-item(ng-repeat="device in devices", ng-click="$parent.shownIndex = $index")\n  i.fa {{device.code}} \n  |  \n  strong {{device.id}}\n  |  \n  div(ng-if="device.apps.length")\n    small Apps: \n      strong(ng-repeat="app in device.apps")\n        | {{app.name}} {{app.version}}\n  div(uib-collapse="$parent.shownIndex!==$index")\n    small Device classes: \n      code(ng-repeat="cls in device.classes") {{cls}}\n      --></div></script><script type=text/ng-template id=verifydeployment.html><div class="modal-header"><button type="button" ng-click="cancel()" class="close">&times;</button><h4 class="modal-title">Deploy<span ng-if="deploying"> <i class="fa fa-spinner fa-spin"></i></span></h4></div><div class="modal-body"><ul class="list-group"><li ng-repeat="deployment in deployments" class="list-group-item">Deploy the latest version of <strong>{{deployment.project}}</strong> to\n <span ng-if="deployment.n===\'all\'">all the </span><span ng-if="deployment.n!==\'all\'">{{deployment.n}}</span> devices matching <strong><code>{{deployment.devicequery}}</code> - <code>{{deployment.appquery}}</code></strong> (approx. {{deployment.numApproxDevices}} such devices)<ul><li ng-if="deployment.removeOld">Remove earlier versions of the app</li></ul></li></ul></div><div class="modal-footer"><button class="btn btn-default"><i class="fa fa-save"></i> \nSave for later</button><button ng-click="deploy()" class="btn btn-primary"><i class="fa fa-paper-plane"></i> \nDeploy</button></div></script><script type=text/ng-template id=applog.html><div class="modal-header"><button type="button" ng-click="cancel()" class="close">&times;</button><h4 class="modal-title">Log of {{app.id}} at {{device.id}}</h4></div><div class="modal-body"><pre>{{log}}</pre></div></script>'),a.put("app/main/main.html",'<!-- Copyright (c) TUT Tampere University of Technology 2015-2016--><!-- All rights reserved.--><!-- --><!-- Main author(s):--><!-- Antti Nieminen <antti.h.nieminen@tut.fi>--><div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-12><h3>Projects</h3><ul ng-repeat="project in projects" class="nav nav-tabs nav-stacked col-md-3 col-lg-3 col-sm-4"><li class=project><a ng-href=/project/{{project.name}}>{{project.name}}</a></li></ul></div><div class=col-sm-12><button ng-click=openNewProjectModal() class="btn btn-primary mainbutton"><i class="fa fa-plus"></i> New Project</button></div></div></div><!--footer.footer.container\n--><script type=text/ng-template id=newproject.html><div class="modal-header"><button type="button" ng-click="cancel()" class="close">&times;</button><h4 class="modal-title">New Project</h4></div><div class="modal-body"><form role="form" name="newprojectform" ng-submit="ok()"><div class="form-group"><label for="projectname">Project name:</label><input type="text" required="required" ng-pattern="/^[a-z][a-z0-9]*$/" id="projectname" name="projectname" placeholder="" ng-model="newproject.name" class="form-control"/><span ng-if="newprojectform.projectname.$error.pattern" class="error">Project name must match <code>[a-z][a-z0-9]*</code></span><span ng-if="newprojectform.projectname.$error.required || !newprojectform.projectname.$invalid"><i class="fa"></i></span></div></form></div><div class="modal-footer"><button type="submit" ng-click="cancel()" class="btn btn-default">Cancel</button><button type="submit" ng-disabled="newprojectform.projectname.$invalid" ng-click="ok()" class="btn btn-primary">Create project</button></div></script>'),a.put("app/project/project.html",'<!-- Copyright (c) TUT Tampere University of Technology 2015-2016--><!-- All rights reserved.--><!-- --><!-- Main author(s):--><!-- Antti Nieminen <antti.h.nieminen@tut.fi>--><div ng-include=&quot;components/navbar/navbar.html&quot;></div><div class=container><div class=row><div class=col-sm-3><div class=sidebar><h4>{{project.name}} source files</h4><ul class=list-group><li ng-repeat="file in files.files | filter:{isDirectory: false} | orderBy:\'name\'" ng-class="{active: activeFile.name===file.name}" ng-click=fileClicked(file) class="list-group-item project-file">{{file.name}} <i ng-if="updating[file.name].status===0" class="fa fa-circle-o-notch fa-spin"></i><i ng-if="updating[file.name].status===2" class="fa fa-warning"></i></li><li class=list-group-item><div ngf-select=uploadFile($file) class="btn btn-default"><i class="fa fa-plus"></i> Upload</div></li></ul><h4>{{project.name}} resources</h4><ul class=list-group><li ng-repeat="file in resources.files | orderBy:\'name\'" class=list-group-item>{{file.name}}</li><li class=list-group-item><div ngf-select=uploadResource($file) class="btn btn-default"><i class="fa fa-plus"></i> Upload</div></li></ul></div></div><div class=col-sm-9><div ng-if=activeFile ui-ace="{onLoad: aceLoaded, mode: activeFile.mode}" ng-model=activeFile.content ng-model-options="{debounce: 500}" class=the-editor></div></div></div></div>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div ng-controller=NavbarCtrl class="navbar navbar-default navbar-static-top"><div class=container><div class=navbar-header><button type=button ng-click="isCollapsed = !isCollapsed" class=navbar-toggle><span class=sr-only>Toggle navigation</span><span class=icon-bar></span><span class=icon-bar></span><span class=icon-bar></span></button><a href="/" class=navbar-brand>Koodain</a></div><div id=navbar-main uib-collapse=isCollapsed class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-repeat="item in menu" disabled ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(&quot;/admin&quot;)}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-if=!isLoggedIn() ng-class="{active: isActive(&quot;/signup&quot;)}"><a href=/signup>Sign up</a></li><li ng-if=!isLoggedIn() ng-class="{active: isActive(&quot;/login&quot;)}"><a href=/login>Login</a></li><li ng-if=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-if=isLoggedIn() ng-class="{active: isActive(&quot;/settings&quot;)}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-if=isLoggedIn() ng-class="{active: isActive(&quot;/logout&quot;)}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>');
}]);