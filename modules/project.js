var mongodb = require("./db");
var myUtil = require("./util");
var diStatus = require("./diStatus");
var User = require("./user");
var authority = require("./authority");

var COLNAME = "projects";
var RCOLNAME = "authProjects";
var UCOLNAME = "users";

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
    if(user.authRole&authority.authorityAccessManager)
    {
      db.collection(COLNAME,function(err,collection){
        if(err)
        {
          return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenCollection,error:err});
        }
        collection.find().toArray(function(err,docs){
          if(err)
          {
            return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
          }
          var auths = [];
          docs.forEach(function(item,index){
            auths[item._id] = authority.authoritySuperAdminProject;
          });
          return callback(err,{auths:auths,projects:docs});
        });
      });
      return;
    }

    db.collection(RCOLNAME,function(err,rcollection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenCollection,error:err});
      }
      rcollection.aggregate([{$match:{uid:user._id,authProject:{$gte:authority.authorityAccessProject}}},{$project:{_id:1,auths:{pid:"$pid",auth:"$authProject"},pid:1,uid:1}},{$group:{_id:"$uid",pids:{$push:"$pid"},auths:{$push:"$auths"}}}],function(err,res){
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
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenCollection,error:err});
      }
      collection.findOneAndUpdate({_id:project._id},{$set:{name:project.name,desc:project.desc}}, function(err, di){
          callback(err?{msg:"修改失败",code:diStatus.innerErrorOpenCollection,error:err}:err,di);
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
Project.remove = function(project_id,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }
    db.collection(RCOLNAME,function(err,rcollection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
      }
      rcollection.remove({pid:project_id},function(err, result){
        if(err)
        {
          return callback({msg:"删除失败",code:diStatus.innerErrorOperationCollection,error:err},result);
        }
        else {
          db.collection(COLNAME,function(err,collection){
            if(err)
            {
              return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
            }
            collection.remove({_id:project_id},function(err, result){
              callback(err?{msg:"删除失败",code:diStatus.innerErrorOperationCollection,error:err}:err,result);
            });
          });
        }
      });
    });
  });
}

Project.updateAuth = function(user,projectAuth,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }
    db.collection(RCOLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenCollection,error:err});
      }
      collection.findOneAndUpdate({uid:projectAuth.uid,pid:projectAuth.pid},{$set:{authProject:projectAuth.authProject,author:user._id,updateTime:(new Date())}}, function(err, result){
          if(err)
          {
            return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
          }
          if(result.lastErrorObject.n==0)
          {
            collection.insertOne({uid:projectAuth.uid,pid:projectAuth.pid,author:user._id,_id:myUtil.guid(),authProject:projectAuth.authProject,createTime:(new Date())},function(err,result){
              callback(err?{msg:"授权失败",code:diStatus.innerErrorOpenCollection,error:err}:err,projectAuth);
            });
          }
          else {
            callback(null,projectAuth);
          }
      });
    });
  });
}

Project.searchUser = function(username,project_id,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }

    db.collection(UCOLNAME,function(err,ucol){
      ucol.find({username:username},{username:1,_id:1}).limit(1).next(function(error,user){
        if(error)
        {
          return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
        }
        if(user)
        {
          db.collection(RCOLNAME,function(err,rcol){
            rcol.find({uid:user._id,pid:project_id}).toArray(function(error,docs){
              if(error)
                return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
              if(docs.length>0)
              {
                return callback(null,{msg:"用户已授权!",code:300});
              }
              else {
                return callback(null,{msg:"查询用户成功",user:user,code:200});
              }
            });
          });
        }
        else
          return callback(null,{msg:"没有该用户",user:user,code:300});
      });
    });
  });
}

Project.getAuth = function(project_id,user,callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOpenDB,error:err});
    }
    db.collection(RCOLNAME,function(err,rcollection){
      if(err)
      {
        return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
      }
      /*
      rcollection.find({pid:project_id}).toArray(function(err,res){
        callback(err?{msg:"查询失败",code:diStatus.innerErrorOpenCollection,error:err}:err,res);
      });
      */
      rcollection.aggregate([{$match:{pid:project_id,uid:{$ne:user._id}}},{$project:{projects:{upd:"$_id",uid:"$uid",authProject:"$authProject"},pid:"$pid",uid:"$uid"}},{$group:{_id:"$pid",projects:{$push:"$projects"},users:{$push:"$uid"}}}],function(err,result){
        //console.log(JSON.stringify(result));
        if(err)
        {
          return callback({msg:diStatus.innerErrorMsg,code:diStatus.innerErrorOperationCollection,error:err});
        }
        if(result.length==0)
        {
          return callback(null,{projects:[]});
        }
        db.collection("users",function(err,collection){
          collection.find({_id:{$in:result[0].users}},{password:0}).toArray(function(err,docs){
            var res = {};
            res.projects = result[0].projects;
            res.users = {};
            docs.forEach(function(item,index){
              res.users[item._id] = item.username;
            });
            return callback(err?{msg:"查询失败",code:diStatus.innerErrorOpenCollection,error:err}:err,res);
          });
        });
        //return callback(null,null);
      });
    });
  });
};

Project.getUserAuth = function(user,project_id,callback)
{
  var res = {authRole:user.authRole};
  if(!project_id)
    return callback(User.checkProjectAuth(res));
  if(user.authRole&authority.authorityAccessManager)
  {
    return callback(User.checkProjectAuth(user));
  }
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback(User.checkProjectAuth(res));
    }
    db.collection(RCOLNAME,function(err,rcollection){
      if(err)
      {
        return callback(User.checkProjectAuth(res));
      }
      rcollection.find({pid:project_id,uid:user._id}).limit(1).next(function(err,doc){
        if(err)
        {
          return callback(User.checkProjectAuth(res));
        }
        res.authRole = user.authRole;
        res.authProject = doc.authProject;
        return callback(User.checkProjectAuth(res));
      });
    });
  });
};
