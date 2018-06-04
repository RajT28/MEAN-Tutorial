var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var titlize=require('mongoose-title-case');
var validate=require('mongoose-validator');
var Schema=mongoose.Schema;

var nameValidator= [
    validate({
        validator:'matches',
        arguments: /^([a-zA-Z]{3,20})+$/,
        message:'Name must be at least 3 character max 20 and no digit or special character allowed'
    })
];
var emailValidator= [
    validate({
        validator:'isEmail',
      
        message:'Email must be in form of abc@xyz.domain'
    })
];
var usernameValidator= [
    validate(
        {
           validator:'isLength',
           arguments:[5,25],
           message:'Username should be atleat   {ARGS[0]} and max {ARGS[1]}'
        }
    ),
    validate({
        validator:'isAlphanumeric',
       
        message:'Username must contain character and digit only no special symbol is allowed'
    })
];
var passwordValidator=[
    validate(
        {
           validator:'matches',
           arguments:"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$",
           message:'Password  should be minimum 4 characters max 50 character, at least one uppercase letter, one lowercase letter, one number and one special character:'
        }
    )
];
var UserSchema=new Schema(
    {
        name:{type:String,required:true,validate:nameValidator},
        username:{type:String,lowercase:true,unique:true,required:true,validate:usernameValidator},
        password:{type:String,required:true ,validate:passwordValidator},
        email:{type:String,lowercase:true,unique:true,required:true,validate:emailValidator},
        
    }
);
UserSchema.pre('save',function(next)
{
  var user=this;
  bcrypt.hash(user.password,null,null,function(err,hash)
{
    if(err) return next(err);
    user.password=hash;
    next();
});
});
UserSchema.plugin(titlize,{
    paths:['name']
});
UserSchema.methods.comparePassword=function(password)
{
  return  bcrypt.compareSync(password,this.password);
};
module.exports=mongoose.model('User',UserSchema);

