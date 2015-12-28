var express = require('express');
var router = express.Router();
var myUtil = require('../modules/util');
var Project = require('../modules/project');
var DIStatus = require('../modules/diStatus');

router.post('/new',function(req,res,next){
  var project = req.body;
  project._id = myUtil.guid();
  Project.save(project,function(error,pj){
    if(error)
    {
      console.log(error);
      res.json({code:DIStatus.innerError,msg:error.reason});
    }
    else {
      res.json({code:DIStatus.ok,msg:"操作成功"});
    }
  });
});

router.put('/:projectId/update',function(req,res,next){
  res.json({msg:"sss",code:200});
});

router.delete('/:projectId/delete',function(req,res,next){
  res.json({msg:"sss",code:200});
});

module.exports = router;
