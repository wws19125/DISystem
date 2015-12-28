var mongodb = require("./db");
var myUtil = require("./util");
var COLNAME = "projects";
function Project(project)
{
  project = project||{};
  this._id = project._id||"-1",
  this.name = project.name||"未知",
  this.desc = project.desc||""
}
module.exports = Project;

Project.get = function(callback){
  mongodb.open(function(err,db){
    if(err)
    {
      mongodb.close();
      return callback(err);
    }
    db.collection(COLNAME,function(err,collection){
      if(err)
      {
        return callback(err);
      }
      collection.find().toArray(function(err,result){
        callback(err,result);
      });
    });
  });
}

Project.save = function(project,callback){
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

//Project.prototype.getAll = function
