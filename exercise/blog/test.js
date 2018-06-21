var express=require('express');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var app          = express();
var path= require('path');
app.set(path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(cookieParser());
app.use(session({ secret: '123' }));
app.use(flash());
app.get('/',function(req,res){
    req.flash('error','hi erro');
    res.send('hi');
})
app.get('/erro',function(req,res){
    console.log(req.flash('error').toString());
})
app.listen(3000);