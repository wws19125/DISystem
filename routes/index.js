var express = require('express');
var router = express.Router();
//var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var DataInterface = require('../modules/dataInterface.js');
var Project = require('../modules/project');
var errorStatus = require("../modules/diStatus");
var User = require('../modules/user');


//var url = 'mongodb://localhost:27017/test';
router.post('/update',function(req,res,next){
  res.json({ok:12});
  return;
  var data = JSON.parse(req.body.data);
  //console.log(data);
  for(var i=0;i<data.length;i++)
  {
    data[i]["projectId"] = "638f2370-f584-a077-c0ad-447b43dc635f";
  }
  DataInterface.save(data,function(error,data){
    if(error)
      res.json({status:-1,code:-1,err:error});
    else {
      res.json({status:0,code:200});
    }
  });
  return;
  //console.log("===========");
  //return;
  MongoClient.connect(url,function(err,db){
    assert.equal(null,err);
    console.log('Connected correctly to server.');

    db.collection("t",function(err,collection){
      assert.equal(null,err);
      console.log('Connected correctly to collection.');
      collection.insert(data,{safe:true},function(err){
        db.close();
        if(err)
          console.log("error");
        res.json({ok:1});
      });

    });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  Project.get(req.session.user,function(err,data){
    if(err)
    {
      res.render('index', { title: 'DISystem' });
      err.mode==0;
      next(err);
    }
    else
    {
      res.render('index',{ title :"DISystem",data:data||{}});
    }
  });
});

/* GET interface detail page. */
router.get('/:projectId/detail',function(req,res,next){
  Project.getUserAuth(req.session.user,req.params.projectId,function(auths){
    if(!auths.canAccessProject)
    {
      res.status(403).send("<div><h1>权限不足</h1></div>");
      return;
    }
    res.render('diDetail',{title:"接口详细",projectId:req.params.projectId});
  });
});

router.get('/project/new',function(req,res,next){
  Project.getUserAuth(req.session.user,null,function(auths){
    if(!auths.canCreateProject)
    {
      res.status(403).send("<div><h1>权限不足</h1></div>");
      return;
    }
    res.render('projects/edit',{title:"新建项目"});
  });

});
module.exports = router;
