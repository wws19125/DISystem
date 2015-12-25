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
    db.collection("datainterfaces",function(err,collection){
      if(err)
      {
        mongodb.close();
        return callback({reason:"open error",error:err,status:-1});
      }
      collection.insert(di,{safe: true}, function(err, di){
          callback(err,di);
          mongodb.close();
      });
    });
  });
};

DataInterface.getById = function(_id,callback)
{

}

DataInterface.getByProjectId = function(projectId,callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({reason:"open error",error:err,status:-1});
    }
    db.collection("datainterfaces",function(err,collection){
      if(err)
      {
        mongodb.close();
        return callback({reason:"open collection error",error:err,status:-1});
      }
      collection.find({projectId:projectId},{_id:0},function(err,cursor){
        if(cursor)
        {
          console.log(cursor);
          var result = [];
          cursor.each(function(err,doc){
            console.log(doc);
          });
        }
      });
    });
  });
}
