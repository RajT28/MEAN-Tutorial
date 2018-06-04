var express=require('express');
var app=express();
var morgan=require('morgan');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var router=express.Router();
var appRoutes=require('./app/routes/api')(router);
var passport=require('passport');
var social=require('./app/passport/passport')(app,passport);
var path=require('path');

var port=process.env.PORT ||3005;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname +'/public'));
app.use(morgan('dev'));
app.use('/api',appRoutes);
mongoose.connect('mongodb://localhost:27017/meandb',function(err)
{
    if(err)
    {
        console.log('error while connecting '+err);
    }
    else
    {
     console.log('connected to db');
    }
}
);
app.get('*',function(req,res)
{
res.sendFile(path.join(__dirname+ '/public/app/views/index.html'));
});


app.listen(port,function()
{
console.log('server is running on ...'+port);
});