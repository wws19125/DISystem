var express = require('express');
var router = express.Router();

var User = require('../modules/user');
var errorStatus = require("../modules/diStatus");

router.get('/',function(req,res,next){
  var auths = User.checkProjectAuth(req.session.user);
  if(!auths.canAccessManager)
  {
    res.status(403).send("<h1>权限不足</h1>");
    return;
  }
  res.render('manager/index',{title:"后台管理"});
});

router.get('/user',function(req,res,next){
  User.findAllUser(function(error,users){
    console.log(users);
  });
  var auths = User.checkProjectAuth(req.session.user);
  if(!auths.canAccessManager)
  {
    res.status(403).send("<h1>权限不足</h1>");
    return;
  }
  res.render('manager/user',{title:"用户管理"});
});
router.get('/project',function(req,res,next){
  var auths = User.checkProjectAuth(req.session.user);
  if(!auths.canAccessManager)
  {
    res.status(403).send("<h1>权限不足</h1>");
    return;
  }
  res.render('manager/project',{title:"项目管理"});
});

module.exports = router;
