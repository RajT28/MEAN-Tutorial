var  FacebookStrategy = require('passport-facebook').Strategy;
var  TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy=require('passport-google').Strategy;
var User=require('../models/user');
var session=require('express-session');
var cookieSession = require('cookie-session');
var jwt=require('jsonwebtoken');
var secret='Gmail@#123';
   
module.exports=function(app,passport){
    app.use(passport.initialize());
    app.use(passport.session());
   app.use(session({secret:'keyboard cat',resave:false,saveUninitialized:true,cookie:{secure:false}}));
    passport.serializeUser(function(user,done)
{
     token= jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
 
   done(null,user.id);
});
  passport.deserializeUser(function(id,done)
{
   User.findById(id,function(err,user)
{
  done(err,user);
});
});
passport.use(new FacebookStrategy(
        {
            clientID:'419104971885246',
            clientSecret:'8173cab5ca8e6d64ec5913f615a670e5',
           
            callbackURL:"https://f3f2adf2.ngrok.io/auth/facebook/callback",
            profileFields:['id','displayName','photos','email']
        },
    function(accessToken,refreshToken,profile,done)
    {
      
        User.findOne({email:profile._json.email}).select('username password email').exec(function(err,user)
    {
        if(err) done (err);
        if(user && user !=null)
        {
            done(null,user);
        }
        else done(err);
    });
      
    }
    ));
    passport.use(new TwitterStrategy({
        consumerKey:'LpWBDXbLTPK9xukBG9Pn8PRX7',
        consumerSecret:'lW5XEUrZdkXeVuMYChmlUMxgdX5byjJB3H53SzkJeGU8XgBBvH',
        callbackURL:'http://localhost:3005/auth/twitter/callback',
        userProfileURL:"https://api.twiitter.com/1.1/account/verify_credential.json?include_email=true"
    },
    function(token,tokenSecret,profile,done)
    {
        console.log('profile :'+profile);
       
        User.findOne({email:profile.email[0].value}).select('username password email').exec(function(err,user)
    {
        if(err)
        {
            done(err);
            console.log('error email is not present in system');
        }
        if(user && user !=null)
        {
            done(null,user);
        }else{
            done(err);
            console.log('email is not present in system');
        }
    });
        done(null,profile);
    }
 ));
 /*passport.use(new GoogleStrategy({
    clientID:'',
    clientSecret:'',
    callbackURL:""
  },
function(accessToken,refreshToken,profile,done)
{
    User.findOne({email:profile.email[0].value}).select('username password email').exec(function(err,user)
{
    if(err) done(err);
    if(user && user !=null)
    {
        done(null,user);
    }else{
        done(err);
    }
});
    done(null,profile);
}
));*/


      app.get('/auth/twitter', passport.authenticate('twitter'));
     
      app.get('auth/twitter/callback',passport.authenticate('twitter',{failureRedirect:'/twittererror'}),function(req,res)
    {
        res.redirect('/twittererror'+token);
    });
   
    app.get('/auth/google',passport.authenticate('google',{scope:['https://www.googleapis.com/auth/plus.login','profile','email']}));
    app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/googleerror'}),function(req,res)
{
    res.redirect('/google/'+token);
});
    app.get('/auth/facebook', passport.authenticate('facebook',{failureRedirect:'/facebookerror'}));
    app.get('auth/facebook/callback',passport.authenticate('facebook',{scope:'email'}),function(req,res)
{
     res.redirect('/facebook'+token);
});
 
  return passport;
}
