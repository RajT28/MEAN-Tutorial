var User=require('../models/user');
var jwt=require('jsonwebtoken');
var secret='Gmail@#123';
var emailflag;
module.exports =function(router)
{

router.post('/user',function(req,res)
{
  var user=new User();
  user.username=req.body.username;
  user.password=req.body.password;
  user.email=req.body.email;
  user.name=req.body.name;
  var email=user.email;
  var username=user.username;
  if(req.body.username==null || req.body.username=='' || req.body.password==null || req.body.password==''|| req.body.email==null || req.body.email==''|| req.body.name==null || req.body.name=='')
  {
  
  res.json({success:false,message:'Ensure all field  must be  submit'});
  }
  else
  {
   
  user.save(function(err)
{
    if(err)
    {
    if(err.errors !=null)
    {

    
    if(err.errors.name)
    {
     res.json({success:false,message:err.errors.name.message});
 
    }
       else if(err.errors.email)
     {
        res.json({success:false,message:err.errors.email.message});
     }
     else if(err.errors.username)
     {
        res.json({success:false,message:err.errors.username.message});
     }
     else if(err.errors.password)
     {
        res.json({success:false,message:err.errors.password.message});
     }
    
     else  
     {
        res.json({success:false,message:err});
     }
    } else if(err)
    {
        validateEmail(email).then(function(valid) {
            if (valid) {
                res.json({success:false,message:'email is present'}); 
            }
          });
          validateUsername(username).then(function(valid) {
            if (valid) {
                res.json({success:false,message:'Username is present'}); 
            }
          });
      
    }
       
    }else{
        res.json({success:true,message:'user created'});
 
    }
});
  
  
  }  });
  router.post('/authenticate',function(req,res)
{
   var uname=req.body.username;
   var pass=req.body.password;
     if(uname==null || uname=='' ||pass==null || pass=='')
     {
        res.json({success:false,message:'must enter username and password'});
 
     }
     else
     {

      
  User.findOne({username:uname}).select('email username password').exec(function(err,user)
{

    if(err) throw err;
    if(!user)
    {
        res.json({success:false,message:'could not authenticate'});
 
    }
    else if(user)
    {
     var validPassword=user.comparePassword(pass);
     if(!validPassword)
     {
        res.json({success:false,message:'password is inccorect'});
 
     }
     else
     {
       var token= jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
        res.json({success:true,message:'on you are login',token:token});
        console.log(token);
     }
    }   
});
     }
});
router.use(function(req,res,next)
{
    var token = req.headers['x-access-token'] || '';
  if(token)
  {
   jwt.verify(token,secret,function(err,decoded)
{
    if(err)
    {
        res.json({success:false,message: 'Token invalid'});
    }
    else{
        req.decoded=decoded;
        next();
    }
})
  }
  else
  {
      res.json({success:false,message:'No Token Provided'});
  }
});
  router.post('/me',function(req,res)
{
  res.send(req.decoded);
});
  return router;
}

function validateEmail(email){

    return User.findOne({email: email}).then(function(result){
         return result !== null;
    });
 }  
 function validateUsername(username){

    return User.findOne({username: username}).then(function(result){
         return result !== null;
    });
 }  
  