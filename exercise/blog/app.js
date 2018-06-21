var express = require('express')
var logger=require('morgan');
var favicon = require('serve-favicon')
var path = require('path')
var helmet=require('helmet');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express()
var setting = require('./setting');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.set(path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(session({
    secret: setting.cookieSecret,
    key: setting.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
      host: '127.0.0.1',
      port: '27017',
      db: 'session',
      url: 'mongodb://localhost:27017/test'
  })
  })); 
  
app.use(helmet());
var flash = require('connect-flash');
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',require('./routes/user'))
app.use(favicon(path.join(__dirname,'favicon.png')))
app.listen(3000,()=>console.log('listen on 3000 port'));    
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
