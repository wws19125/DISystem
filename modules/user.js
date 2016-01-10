var mongodb = require("./db");
var errorStatus = require("./diStatus");
var myUtil = require("./util");
var test = require("assert");
var COLNAME = "users";

function User(user)
{
  this.username = user.username;
  this.password = user.password;
  this.authRole=user.authRole||0;
}

module.exports = User;

User.save = function save(user,callback){
  user._id = myUtil.guid();
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenCollection,error:err});
      }
      collection.find({username:user.username}).limit(1).next(function(err,doc){
        if(err)
          callback(err?{msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOperationCollection,error:err}:err,doc);
        else {
          if(doc)
            return callback({msg:"用户名已经存在",code:errorStatus.outterErrorAreadyExist,error:err});
          else {
                  collection.insertOne(user,function(err,result){
                      return callback(err?{msg:"创建用户失败",code:errorStatus.innerErrorOperationCollection,error:err}:err,user);
                  });
          }
        }
      });
    });
  });
  /*
  User.findUser({name:user.name},function(error,ruser){
    if(ruser){
      return callback({msg:"用户名已经存在",code:errorStatus.outterErrorAreadyExist,error:err});
    }
    else {

      console.log("存进数据库中去");
    }
  });
  */
};

///findUser
User.findUser = function(user,callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenCollection,error:err});
      }
      collection.find(user).limit(1).next(function(err,doc){
        callback(err?{msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOperationCollection,error:err}:err,doc);
      });
    });
  });
};

User.findAllUser = function(callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenCollection,error:err});
      }
      collection.find({},{password:0}).toArray(function(err,docs){
        callback(err?{msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOperationCollection,error:err}:err,docs);
      });
    });
  });
};

User.removeUser = function(user,callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenCollection,error:err});
      }
      collection.remove(user,function(err,result){
          return callback(err?{msg:"删除用户失败",code:errorStatus.innerErrorOperationCollection,error:err}:err,user);
      });
    });
  });
}
User.resetPassword = function(user,callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenCollection,error:err});
      }
      collection.update(user,{$set:{password:"123456"}},function(err,result){
          return callback(err?{msg:"重置失败",code:errorStatus.innerErrorOperationCollection,error:err}:err,user);
      });
    });
  });
}

User.authRole = function(user,callback)
{
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenDB,error:err});
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback({msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOpenCollection,error:err});
      }
      collection.update({username:user.username,_id:user._id},{$set:{authRole:user.authRole}},function(err,result){
          return callback(err?{msg:"操作失败",code:errorStatus.innerErrorOperationCollection,error:err}:err,user);
      });
    });
  });
}
