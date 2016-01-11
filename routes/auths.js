var express = require('express');
var router = express.Router();
var User = require('../modules/user');
var errorStatus = require("../modules/diStatus");


router.get('/',function(req,res,next){
  res.render('login',{});
});

//user login
router.post('/',function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  User.findUser({username:username,password:password},function(error,user){
    if(error)
    {
      res.json({code:error.code,msg:error.msg});
      next({mode:0,error:error.error});
    }
    else {
      var code = errorStatus.ok;
      var msg = "登陆成功";
      if(user){
        req.session.user=user;
      }
      else
      {
        code = errorStatus.outterErrorLogin;
        msg = errorStatus.outterErrorLoginMsg;
      }
      res.json({msg:msg,code:code});
    }
  });
});

//user exit
router.post('/logout',function(req,res,next){
});
module.exports = router;
