var express = require('express');
var router = express.Router();
var DataInterface = require('../modules/dataInterface');

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
  res.render('datainterfaces/edit',{title:"添加接口"});
});
router.post('/new',function(req,res,next){

});

/** update **/
router.put('/update',function(req,res,next){

});
module.exports = router;
