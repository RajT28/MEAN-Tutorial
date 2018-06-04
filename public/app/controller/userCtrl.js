angular.module('userController',['userServices'])
.controller('regCtrl',function($http,$location, $timeout,User)
{
    var app=this;
    this.regUser=function(regData)
   {
       app.loading=true;
       app.errorMsg=false;
       
       User.create(app.regData).then(function(data)
       {
           app.loading=false;
           if(data.data.success)
           {
               app.loading=false;
              app.successMsg=data.data.message+'...Redirecting';
              $timeout(function()
            {
                $location.path('/');
            },2000);
           }else
           {
               app.loading=false;
             app.errorMsg=data.data.message;
           }
       });
   }
})
.controller('facebookCtrl',function($routeParams,Auth,$location,$window)
{
    var app=this;
    if($window.location.pathname =='/facebookerror')
    {
        app.errorMsg="facebook email not found in database"
    }else
    {
        console.log($routeParams.token);
        Auth.facebook($routeParams.token);
        $location.path('/');
    }
   
})
.controller('twitterCtrl',function($routeParams,Auth,$location,$window)
{
    $location.path('/twittererror');
  /*  var app=this;
    if($window.location.pathname =='/twittererror')
    {
        app.errorMsg=" email not found in database"
    }else
    {
        console.log($routeParams.token);
        Auth.Twitter($routeParams.token);
        $location.path('/');
    }*/
   
})
.controller('googleCtrl',function($routeParams,Auth,$location,$window)
{
    var app=this;
    if($window.location.pathname =='/googleerror')
    {
        app.errorMsg="email not found in database"
    }else
    {
        console.log($routeParams.token);
        Auth.Google($routeParams.token);
        $location.path('/');
    }
   
});
