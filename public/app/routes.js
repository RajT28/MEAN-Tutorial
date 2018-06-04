var app=angular.module('userRoutes',['ngRoute'])
.config(function($routeProvider,$locationProvider)
{
    $routeProvider
    .when('/',
{
    templateUrl:'app/views/pages/home.html'
})
    .when('/register',
{
templateUrl:'app/views/pages/users/register.html',
controller:'regCtrl',
controllerAs:'register',
authenticated:false
})
.when('/login',
{
templateUrl:'app/views/pages/users/login.html',
controller:'loginCtrl',
controllerAs:'login',
authenticated:false
})
.when('/about',
{
templateUrl:'app/views/pages/about.html',

})
.when('/logout',
{
    templateUrl:'app/views/pages/users/logout.html',
    authenticated:true
})
.when('/profile',
{
    templateUrl:'app/views/pages/users/profile.html',
    authenticated:true
})
.when('/facebook/:token',
{
    templateUrl:'app/views/pages/users/social/social.html',
    controller:'facebookCtrl',
controllerAs:'facebook',
authenticated:false
})
.when('/twitter/:token',
{
    templateUrl:'app/views/pages/users/social/social.html',
    controller:'twitterCtrl',
controllerAs:'twitter',
authenticated:false
})
.when('/google/:token',
{
    templateUrl:'app/views/pages/users/social/social.html',
    controller:'googleCtrl',
controllerAs:'google',
authenticated:false
})
.when('/facebookerror',
{
    templateUrl:'app/views/pages/users/login.html'
   
})
.when('/twittererror',
{
    templateUrl:'app/views/pages/users/login.html'
   
})
.when('/googleerror',
{
    templateUrl:'app/views/pages/users/login.html'
   
})
.otherwise({redirectTo:'/'});
$locationProvider.html5Mode({
    enabled:true,
    requiredBase:false
});
});
app.run(['$rootScope','Auth','$location',function($rootScope,Auth,$location)
{
    $rootScope.$on('$routeChangeStart',function(event,next,current)
{
   
if(next.$$route.authenticated==true)
{
 if(!Auth.isLoggedIn())
 {
     event.preventDefault();
     $location.path('/login');
 }
}else if(next.$$route.authenticated==false)
{
    if(Auth.isLoggedIn())
    {
        event.preventDefault();
        $location.path('/profile');
    }
}

});
}]);