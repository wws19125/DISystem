var express = require('express');
var router = express.Router();
var User = require('../modules/user');
var errorStatus = require("../modules/diStatus");

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAllUser(function(error,users){
    if(error)
    {
      res.json({code:error.code,msg:error.msg});
      error.mode=0;
      next(error);
    }
    else {
      var code = errorStatus.ok;
      var msg = "查询成功";
      res.json({code:code,msg:msg,data:users});
    }
  });
});

/* add new user */
router.post('/new',function(req,res,next){
  var user = new User({username:req.body.username,password:req.body.password});
  if(req.body.auth==1)
  {
    user.authRole = 0x03;
  }
  else {
    user.authRole = 0x01;
  }
  User.save(user,function(err,result){
    if(err)
    {
      res.json({code:err.code,msg:err.msg});
      err.mode=0;
      next(err);
    }
    else {
        var code = errorStatus.ok;
        var msg = "新建成功";
        res.json({code:code,msg:msg,data:{username:user.username,_id:user._id,authRole:user.authRole}});
    }
  });
});

router.delete('/delete',function(req,res,next){
  var user = {username:req.body.username,_id:req.body._id};
  User.removeUser(user,function(err,result){
    if(err)
    {
      res.json({code:err.code,msg:err.msg});
      err.mode=0;
      next(err);
    }
    else {
        var code = errorStatus.ok;
        var msg = "删除成功";
        res.json({code:code,msg:msg,data:{username:user.username,_id:user._id}});
    }
  });
});
router.put('/resetPassword',function(req,res,next){
  var user = {username:req.body.username,_id:req.body._id};
  User.resetPassword(user,function(err,result){
    if(err)
    {
      res.json({code:err.code,msg:err.msg});
      err.mode=0;
      next(err);
    }
    else {
        var code = errorStatus.ok;
        var msg = "重置成功";
        res.json({code:code,msg:msg,data:{username:user.username,_id:user._id}});
    }
  });
});
router.put('/authRole',function(req,res,next){
  var user = {username:req.body.username,_id:req.body._id,authRole:parseInt(req.body.authRole)};
  User.authRole(user,function(err,result){
    if(err)
    {
      res.json({code:err.code,msg:err.msg});
      err.mode=0;
      next(err);
    }
    else {
        var code = errorStatus.ok;
        var msg = "操作成功";
        res.json({code:code,msg:msg,data:{username:user.username,_id:user._id}});
    }
  });
});
module.exports = router;
