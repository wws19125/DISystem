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
  User.save({name:req.body.username});
  res.json({msg:"11"});
});

module.exports = router;
