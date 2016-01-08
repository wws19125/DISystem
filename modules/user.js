var mongodb = require("./db");
var errorStatus = require("./diStatus");
var myUtil = require("./util");
var COLNAME = "users";

function User(user)
{
  this.name = user.name;
  this.password = user.password;
}

module.exports = User;

User.save = function save(user,callback){
  user._id = myUtil.guid();
  user.role = 0;
  User.findUser({name:user.name},function(error,ruser){
    if(ruser){
      console.log("用户存在了");
      return;
    }
    else {
      console.log("存进数据库中去");
    }
  });
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
      collection.find().toArray(function(err,docs){
        callback(err?{msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOperationCollection,error:err}:err,docs);
      });
    });
  });
};

User.removeUser = function(user,callback)
{

}
