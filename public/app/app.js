angular.module('userApps',['userRoutes','userController','userServices','loginController'])
.config(function($httpProvider)
{
$httpProvider.interceptors.push('AuthInterceptors');
});