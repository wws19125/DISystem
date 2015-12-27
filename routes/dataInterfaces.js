var express = require('express');
var router = express.Router();
var DataInterface = require('../modules/dataInterface');
var diUtil = require('../modules/util.js');
var diStatus = require('../modules/diStatus.js');

router.get('/:projectId/list-for-project',function(req,res,next){
  DataInterface.getByProjectId(req.params.projectId,function(error,data){
    if(error)
    {
      console.log(error);
      res.json({msg:"获取失败",statusCode:300});
    }
    else {
      res.json({msg:"ok",statusCode:200,dataContent:data});
    }
  });
});

router.get('/:_id/showdetail',function(req,res,next)
{
  res.json({ok:1});
});

/** add **/
router.get('/:projectId/new',function(req,res,next){
  res.render('datainterfaces/edit',{title:"添加接口",projectId:req.params.projectId});
});
router.post('/:projectId/new',function(req,res,next){
  if(req.body.dataBody)
  {
    try {
      var di = JSON.parse(req.body.dataBody);
      if(di.projectId!=req.params.projectId)
      {
        res.json({msg:err.reason,code:diStatus.innerError});
        return;
      }
      di.status = 1;
      di._id = diUtil.guid();
      DataInterface.save(di,function(err,data){
        if(err)
        {
          res.json({msg:err.reason,code:diStatus.innerError});
        }
        else
        {
          res.json({msg:"success",code:diStatus.ok});
        }
      });
    } catch (e) {
      res.json({msg:err.reason,code:diStatus.innerError});
    }
  }
  else
    res.json({msg:"发生异常：参数错误",code:diStatus.outterError});
});

/** update **/
router.get('/:dataInterfaceID/update',function(req,res,next){
  DataInterface.getById(req.params.dataInterfaceID,function(err,di){
    if(err)
    {
      res.render('datainterfaces/edit',{title:"修改接口",projectId:di.projectId,datainterface:null,code:diStatus.otherError,test:{a:1}});
    }
    else {
        res.render('datainterfaces/edit',{title:"修改接口",projectId:di.projectId,datainterface:di,code:diStatus.ok,test:{a:1}});
    }
  });
});
router.put('/:dataInterfaceID/update',function(req,res,next){
  var di = JSON.parse(req.body.dataBody);
  DataInterface.update(di,function(err,result){
    if(err)
    {
        res.json({msg:err.reason,code:diStatus.innerError});
    }
    else {
      res.json({msg:"success",code:diStatus.ok});
    }
  });
});


router.delete('/:dataInterfaceID/update',function(req,res,next){
  res.json({code:200,msg:'ok'});
  return;
  var di = JSON.parse(req.body.dataBody);
  DataInterface.update(di,function(err,result){
    if(err)
    {
        res.json({msg:err.reason,code:diStatus.innerError});
    }
    else {
      res.json({msg:"success",code:diStatus.ok});
    }
  });
});

module.exports = router;
