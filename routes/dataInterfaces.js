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

router.get('/:projectId/download',function(req,res,next){
  Project.getUserAuth(req.session.user,req.params.projectId,function(auths){
    if(!auths.canDownPdf)
    {
      res.status(403).send("<h1>权限不足</h1>");
      return;
    }
    DataInterface.getByProjectId(req.params.projectId,function(error,dis){
      if(error)
      {
        res.send("<h1>发生错误</h1>");
        return;
      }
      var doc = new PDFDocument();
      doc.pipe(fs.createWriteStream('./output.pdf')).on('finish',function(){
        /*
        res.download("./output.pdf",function(err){
          if(err)
          {
            res.send("<h1>发生错误</h1>");
            console.log(err);
          }
        });
        */
        var options = {
          root: './',
          dotfiles: 'deny',
          headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
          }
        };
        res.sendFile("output.pdf", options, function (err) {
          if (err) {
            console.log(err);
            res.status(err.status).end();
          }
          else {
            console.log('Sent:file');
            fs.unlink("./output.pdf");
          }
        });
      });
      //doc.registerFont('arial', path.join(__dirname + '/Arial.ttf'), 'arial');
      //doc.registerFont('arial2', path.join(__dirname + '/Arial.ttf'), 'arial');
      //doc.font('arial');

      // HACK: clear font cache for real font name
      delete doc._fontFamilies['ArialUnicodeMS'];
      //doc.font('fonts/msyh.ttf').fontSize(25).text('接口文档', {width:450,align:'center'});
      doc.font('fonts/msyh.ttf').fontSize(25).text('接口文档', {width:450,align:'center'});
      doc.addPage().fontSize(12);
      dis.forEach(function(item,index){
        console.log(item);
        doc.fillColor("#333333").text("接口名称:",{continued:true}).fillColor("red").text(item.name);//.moveDown(0.5);
        doc.fillColor("#333333").text("接口格式:",{continued:true}).fillColor("red").text(item.format);
        doc.fillColor("#333333").text("接口说明:",{continued:true}).fillColor("red").text(item.intro);
        doc.fillColor("#333333").text("接口方式:",{continued:true}).fillColor("red").text(item.method);
        doc.fillColor("#333333").text("接口参数:");//,{continued:true}).fillColor("red").text(item.format);
        item.params.forEach(function(param,pidx){
          doc.fillColor("green").text("    "+param.name,{continued:true}).fillColor("red").text("  "+param.intro);
        });
        doc.fillColor("#333333").text("接口返回值:");

        doc.moveDown(5);
      });
      doc.end();
    });
  });
});
module.exports = router;
