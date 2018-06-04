angular.module('loginController',['authServices'])
.controller('loginCtrl',function(Auth,$timeout,$location,$rootScope)
{
    
    var app=this;
    app.loadme=false;
    $rootScope.$on('$routeChangeStart',function()
{
 
if(Auth.isLoggedIn())
{
   
    app.isLoggedIn=true;
    Auth.getUser().then(function(data)
{
   
    app.username=data.data.username;
    app.email=data.data.email;
    app.loadme=true;
});
}
else
{
  
    app.isLoggedIn=false;
    app.username='';
    app.loadme=true;
}
  if($location.hash()=='_#_')$location.hash(null);
});
    this.facbook=function()
    {
  console.log('fb testing');
    };
    this.loginUser=function(loginData)
   {
       app.loading=true;
       app.errorMsg=false;
       
       Auth.login(app.loginData).then(function(data)
       {
           app.loading=false;
           if(data.data.success)
           {
               app.loading=false;
              app.successMsg=data.data.message+'...Redirecting';
              $timeout(function()
            {
                $location.path('/');
                app.loginData='';
                app.successMsg=false;
            },2000);
           }else
           {
               app.loading=false;
             app.errorMsg=data.data.message;
           }
       });
   };
   this.logout =function()
   {

       Auth.logout();
       $location.path('/logout');
       $timeout(function()
    {
        $location.path('/');
    },2000);
    
   };
});