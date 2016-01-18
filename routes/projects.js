var express = require('express');
var router = express.Router();
var myUtil = require('../modules/util');
var Project = require('../modules/project');
var DIStatus = require('../modules/diStatus');

router.post('/new',function(req,res,next){
  var project = req.body;
  project._id = myUtil.guid();
  Project.save(project,req.session.user,function(error,pj){
    if(error)
    {
      res.json({code:error.code,msg:error.msg});
      error.mode =0;
      next(error);
    }
    else {
      res.json({code:DIStatus.ok,msg:"操作成功"});
    }
  });
});

/// authority
/// authority to user, just obtain data
router.get('/:projectId/authority',function(req,res,next){
  if(req.get("X-Requested-With"))
  {
    Project.getAuth(req.params.projectId,req.session.user,function(error,users){
      if(error)
      {
        res.json({code:error.code,msg:error.msg});
        error.mode =0;
        next(error);
      }
      else {
        res.json({code:DIStatus.ok,msg:"操作成功",data:users});
      }
    });
    //res.json({code:200,msg:"成功",data:""});
  }
  else
    res.render('projects/authority',{title:"项目授权"});
});

/// authority
/// authority for users, update db
router.put('/:projectId/authority',function(req,res,next){
  Project.updateAuth(req.session.user,{uid:req.body.uid,authProject:req.body.auths,pid:req.params.projectId},function(error,auths){
    if(error)
    {
      res.json({code:error.code,msg:"授权失败"});
      error.mode =0;
      next(error);
    }
    else {
      res.json({code:DIStatus.ok,msg:"授权成功",data:auths});
    }
  });
  //res.json({code:DIStatus.ok,msg:"授权成功"});
});

/// search user
/// search user for authority
router.get('/:projectId/:userName/searchUser',function(req,res,next){
  Project.searchUser(req.params.userName,req.params.projectId,function(error,user){
    if(error)
    {
      res.json({code:error.code,msg:"查询用户失败"});
      error.mode =0;
      next(error);
    }
    else {
      res.json({code:DIStatus.ok,msg:"查询成功",data:user});
    }
  });
  //res.json({code:DIStatus.ok,msg:"授权成功"});
});

router.get('/:projectId/update',function(req,res,next){
  //console.log(req.params.projectId);
  Project.getOneProject({_id:req.params.projectId},function(error,project){
    if(error)
    {
      res.render('projects/edit',{title:"编辑项目",code:error.code,msg:error.msg});
      error.mode =0;
      next(error);
    }
    else {
      res.render('projects/edit',{title:"编辑项目",code:DIStatus.ok,msg:"操作成功",project:project});
    }
  });
  //res.render('projects/edit',{title:"编辑项目"});
});

router.put('/:projectId/update',function(req,res,next){
  var project = req.body;
  Project.update(project,function(error,result){
    if(error)
    {
      res.json({code:error.code,msg:error.msg});
      error.mode =0;
      next(error);
    }
    else {
      res.json({code:DIStatus.ok,msg:"操作成功"});
    }
  });
});

router.delete('/:projectId/delete',function(req,res,next){
  Project.remove(req.params.projectId,function(error,result){
    if(error)
    {
      res.json({code:error.code,msg:error.msg});
      error.mode =0;
      next(error);
    }
    else {
      res.json({code:DIStatus.ok,msg:"删除成功"});
    }
  });
});

module.exports = router;
