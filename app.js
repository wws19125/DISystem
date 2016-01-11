var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
/*
var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});
*/

var homes = require('./routes/index');
var users = require('./routes/users');
var auths = require('./routes/auths');
var datainterfaces = require('./routes/dataInterfaces');
var projects = require('./routes/projects');
var managers = require('./routes/managers');

var errorStatus = require('./modules/diStatus');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name:"diSessionId",
  /*
  genid: function(req) {
    console.log(genuuid());
    return genuuid() // use UUIDs for session IDs
  },
  */
  secret: 'keyboard cat',
  cookie:{
    maxAge: 60000
  }
}));

app.use(function(req, res, next) {

  /*********************************/
  var user = {
    _id: '7894c9c4-f0e2-2be3-d92d-d149c83610d0',
    username: 'admin',
    authRole: '3'
  };
  req.session.user = user;
  /*********************************/

  if(req.path=="/")
  {
    // legal user
    if(req.session&&req.session.user)
    {
      res.redirect("/home");
    }
    else
      next();
    return;
  }
  if(req.session)
  {
    var _session = req.session;
    ///没有登陆
    if(!_session.user)
    {
      //ajax
      if(req.get("X-Requested-With"))
      {
        res.json({code:errorStatus.outterErrorNotLogin,msg:'非法用户，请登陆!'});
      }
      else {
        res.redirect('/');
      }
    }
    else {
      if(/^(\/manager)/.test(req.path))
      {
        if(req.session.user)
        {
          if(!!(req.session.user.authRole&0x4))
            return next();
          //ajax
          if(req.get("X-Requested-With"))
          {
            res.json({code:errorStatus.authorityErrorAccess,msg:errorStatus.authorityErrorAccessMsg});
          }
          else {
            res.status(403).send("<h1 style='width:100%;text-align:center;margin-top:20%;'>抱歉,访问出错,错误代码:{0}</h1>".format(errorStatus.authorityErrorAccess));
          }
          return;
          //res.end();
        }
      }
      next();
    }
  }
});

app.use('/', auths);
app.use('/users', users);
app.use('/home',homes);
app.use('/di',datainterfaces);
app.use('/project',projects);
app.use('/manager',managers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if(err.mode)
    {
      console.log(err);
      return;
    }
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  if(err.mode)
  {
    console.log(err);
    return;
  }
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
