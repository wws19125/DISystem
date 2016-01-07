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

User.save = function save(callback){
  var user = {
    name:this.name,
    password:this.password
  };
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
      collection.find({name:user.name,password:user.password}).limit(1).next(function(err,doc){
        callback(err?{msg:errorStatus.innerErrorMsg,code:errorStatus.innerErrorOperationCollection,error:err}:err,doc);
      });
    });
  });
};

User.removeUser = function(user,callback)
{

}
