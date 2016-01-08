var express = require('express');
var router = express.Router();
var User = require('../modules/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* add new user */
router.get('/new',function(req,res,next){
  User.save({name:"018956"});
  res.json({ab:11});
});
module.exports = router;
