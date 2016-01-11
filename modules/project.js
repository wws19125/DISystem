var mongodb = require("./db");
var myUtil = require("./util");
var diStatus = require("./diStatus");
var COLNAME = "projects";
var RCOLNAME = "authProjects";

function Project(project)
{
  project = project||{};
  this._id = project._id||"-1",
  this.name = project.name||"未知",
  this.desc = project.desc||""
}
module.exports = Project;

/// get projects by user
/// user legal user
/// callback function(err,user)
Project.get = function(user,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }
    db.collection(RCOLNAME,function(err,rcollection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenCollection,error:err});
      }
      rcollection.aggregate([{$match:{uid:user._id,authProject:{$gte:0x80}}},{$project:{_id:1,auths:{pid:"$pid",auth:"$authProject"},pid:1,uid:1}},{$group:{_id:"$uid",pids:{$push:"$pid"},auths:{$push:"$auths"}}}],function(err,res){
        if(err)
        {
          return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
        }
        else {
          db.collection(COLNAME,function(err,collection){
            if(err)
            {
              return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenCollection,error:err});
            }
            collection.find({_id:{$in:res[0].pids}}).toArray(function(err,docs){
              //callback(err,docs);
              if(err)
              {
                return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
              }
              var auths = {};
              res[0].auths.forEach(function(auth,index){
                auths[auth.pid] = auth.auth;
              });
              callback(err,{auths:auths,projects:docs});
            });
          });
        }
      });
    });
  });
}

Project.save = function(project,user,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }
    project.owner = user._id;
    project.createTime = new Date();
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenCollection,error:err});
      }
      collection.insert(project,{safe: true}, function(err, di){
          if(err)
          {
            return callback({msg:"新建失败(1)",code:diStatus.innerErrorOperationCollection,error:err});
          }
          db.collection(RCOLNAME,function(err,rcol){
            if(err)
            {
              return callback({msg:"新建失败(2)",code:diStatus.innerErrorOpenCollection,error:err});
            }
            rcol.insert({_id:myUtil.guid(),uid:user._id,pid:project._id,authProject:0xff},function(err,result){
              callback(err?{msg:"新建失败",code:diStatus.innerErrorOpenCollection,error:err}:err,di);
            });
          });
      });
    });
  });
}

Project.update = function(project,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback(err);
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({reason:"save: open collection error",error:err});
      }
      collection.insert(project,{safe: true}, function(err, di){
          callback(err?{reason:"save: 新建失败",error:err}:err,di);
      });
    });
  });
}

Project.getOneProject = function(project,callback){
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
      collection.find(project).limit(1).next(function(err, doc){
          callback(err?{msg:"查询失败",code:diStatus.innerErrorOperationCollection,error:err}:err,doc);
      });
    });
  });
};
