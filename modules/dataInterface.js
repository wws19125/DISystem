/*
{
  name:"登陆",
  format:"itegration/appUser/checkLogin/{userno}/{password}?token",
  intro:"这是一个登陆接口，用于用户登陆",
  params:[
    {name:"userno",intro:"工号,base64加密"},
    {name:"password",intro:"密码,base64加密"}
  ],
  retContent:{
    "message":"返回消息提示",
    "showcard":"N",
    "statusCode":"状态码",
    "token":"令牌",
    "username":"用户名",
    "userno":"工号",
    "test(测试使用)":[{a:"测试的a"}]
  }
}
*/
var mongodb = require("./db");
var util = require("./util");
var test = require('assert');
var User = require("./user");
var Project = require("./project");
var diStatus = require("./diStatus");

var COLNAME = "datainterfaces";

function DataInterface(di)
{
  di = di||{};
  this.name= di.name||"未填写";
  this.format = di.format||"未填写";
  this.intro = di.intro||"未填写";
  this.params = di.params||[];
  this.retContent = di.retContent||"无";
  this._id = di._id||util.guid();
  this.projectId = di.projectId||"-1";
}

module.exports = DataInterface;

///save record
///
DataInterface.save = function(di,callback){
  //console.log(di);
  if(di instanceof Array)
  {
    di.forEach(function(item,index)
    {
      item._id = util.guid();
      console.log(item.projectId);
      if(!item.projectId||item.projectId=="-1")
      {
        callback({reason:"Arrays no project id",status:-1});
        return;
      }
    });
  }
  else
  {
    di._id = util.guid();
    if(!di.projectId||di.projectId=="-1")
    {
      console.log("di no project id");
      callback({reason:"di no project id",status:-1});
      return;
    }
  }
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({reason:"open error",error:err,status:-1});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({reason:"open db error",error:err,status:-1});
      }
      collection.insert(di,{safe: true}, function(err, di){
          callback(err?{reason:"新建失败",error:err}:err,di);
      });
    });
  });
};

DataInterface.removeById = function(_id,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({reason:"open db error",error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({reason:"open collection error",error:err});
      }
      collection.remove({_id:_id},function(err,res){
        callback(err?{reason:"删除失败",error:err}:err,res);
      });
    });
  });
};

DataInterface.getById = function(diId,callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({reason:"open db error",error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({reason:"getById:open collection error",error:err});
      }
      collection.find({_id:diId}).limit(1).next(function(err, doc){
        callback(err?{reason:"查询失败",error:err}:err,doc);
      });
    });
  });
}

DataInterface.getByProjectId = function(projectId,callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({reason:"open error",error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({reason:"open collection error",error:err,status:-1});
      }
      collection.find({projectId:projectId}).toArray(callback);
    });
  });
}
DataInterface.remove = function(did,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
      }
      collection.deleteOne({_id:did},function(err,result){
          return callback(err?{msg:"删除失败",code:diStatus.innerErrorOpenCollection,error:err}:err,result);
      });
    });
  });
};
DataInterface.update = function(di,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({reason:"open error",error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({reason:"open collection error",error:err,status:-1});
      }
      collection.replaceOne({_id:di._id},di,function(err,result){
          return callback(err?{reason:"update: insert error",error:err}:err,result);
      });
    });
  });
};

DataInterface.changeStatus = function(di,status,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({reason:"open error",error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({reason:"open collection error",error:err,status:-1});
      }
      collection.updateOne({_id:di._id},{$set:{status:status}},function(err,result){
          return callback(err?{reason:"delete: insert error",error:err}:err,result);
      });
    });
  });
};

DataInterface.getAuth = function(user,dataInterfaceID,callback)
{
  var res = {authRole:user.authRole};
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback(User.checkProjectAuth(res));
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback(User.checkProjectAuth(res));
      }
      collection.find({_id:dataInterfaceID}).limit(1).next(function(err,doc){
        if(err)
        {
          return callback(User.checkProjectAuth(res));
        }
        if(doc)
        {
          //db.collection("")
          Project.getUserAuth(user,doc.projectId,callback);
        }
      });
    });
  });
};
