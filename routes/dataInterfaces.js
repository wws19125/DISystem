var express = require('express');
var router = express.Router();
var DataInterface = require('../modules/dataInterface');
var diUtil = require('../modules/util.js');
var diStatus = require('../modules/diStatus.js');
var Project = require('../modules/project');
var PDFDocument = require("pdfkit");
var fs = require("fs");
var blobStream = require('blob-stream');

router.get('/:projectId/list-for-project',function(req,res,next){
  Project.getUserAuth(req.session.user,req.params.projectId,function(auths){
    if(!auths.canAccessProject)
    {
      res.json({code:DIStatus.authorityErrorOperation,msg:DIStatus.authorityErrorOperationMsg});
      return;
    }
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
});

router.get('/:_id/showdetail',function(req,res,next)
{
  res.json({ok:1});
});

/** add **/
router.get('/:projectId/new',function(req,res,next){
  Project.getUserAuth(req.session.user,req.params.projectId,function(auths){
    if(!auths.canCreateInterface)
    {
      res.status(403).send("<p>权限不足</p>");
      return;
    }
    res.render('datainterfaces/edit',{title:"添加接口",projectId:req.params.projectId});
  });
});
router.post('/:projectId/new',function(req,res,next){
  Project.getUserAuth(req.session.user,req.params.projectId,function(auths){
    if(!auths.canCreateInterface)
    {
      res.json({code:DIStatus.authorityErrorOperation,msg:DIStatus.authorityErrorOperationMsg});
      return;
    }
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
});

/** update **/
router.get('/:dataInterfaceID/update',function(req,res,next){
  DataInterface.getAuth(req.session.user,req.params.dataInterfaceID,function(auths){
    if(!auths.canEditInterface)
    {
      res.status(403).sender("<p>权限不足</p>");
      return;
    }
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
});
router.put('/:dataInterfaceID/update',function(req,res,next){
  DataInterface.getAuth(req.session.user,req.params.dataInterfaceID,function(auths){
    if(!auths.canEditInterface)
    {
      res.json({code:DIStatus.authorityErrorOperation,msg:DIStatus.authorityErrorOperationMsg});
      return;
    }
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

});


router.delete('/:dataInterfaceID/delete',function(req,res,next){
  DataInterface.getAuth(req.session.user,req.params.dataInterfaceID,function(auths){
    if(!auths.canEditInterface)
    {
      res.json({code:DIStatus.authorityErrorOperation,msg:DIStatus.authorityErrorOperationMsg});
      return;
    }
    //var di = JSON.parse(req.body.dataBody);
    DataInterface.remove(req.params.dataInterfaceID,function(error,result){
      if(error)
      {
          res.json({msg:"删除失败",code:error.code});
          error.mode =0;
          console.log(error);
          //next(error);
      }
      else {
        res.json({msg:"删除成功",code:diStatus.ok});
      }
    });
  });
});

router.get('/:dataInterfaceID/download',function(req,res,next){
  var doc = new PDFDocument();
  //doc.pipe = fs.createWriteStream('output.pdf')
  var stream = doc.pipe(blobStream());
  //# Embed a font, set the font size, and render some text
  /*
  doc.font('fonts/PalatinoBold.ttf')
     .fontSize(25)
     .text('Some text with an embedded font!', 100, 100)
     */

  //# Add another page
  doc.addPage()
     .fontSize(25)
     .text('Here is some vector graphics...', 100, 100)

  //# Draw a triangle
  doc.save()
     .moveTo(100, 150)
     .lineTo(100, 250)
     .lineTo(200, 250)
     .fill("#FF3300")

  //# Apply some transforms and render an SVG path with the 'even-odd' fill rule
  doc.scale(0.6)
     .translate(470, -380)
     .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
     .fill('red', 'even-odd')
     .restore()

  //# Add some text with annotations
  doc.addPage()
     .fillColor("blue")
     .text('Here is a link!', 100, 100)
     .underline(100, 100, 160, 27, {color:"#0000FF"})
     .link(100, 100, 160, 27, 'http://google.com/')

   //# Finalize PDF file
  doc.end();
  //var blobStream = require('blob-stream');
  //var stream = doc.pipe(blobStream());
  stream.on('finish', function() {
    res.redirect(stream.toBlobURL('application/pdf'));
  });
});
module.exports = router;
