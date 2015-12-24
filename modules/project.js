var mongodb = require("./db");
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
    db.collection("projects",function(err,collection){
      if(err)
      {
        mongodb.close();
        return callback(err);
      }

      collection.find({name:"金恒聚视"},function(err,cursor){
        if(cursor)
        {
          var result = [];
          cursor.each(function(err,doc){
            if(doc)
            {
              result.push(doc);
              callback(err,result);
              mongodb.close();
            }
          });
        }
      });

    });
  });
}

Project.prototype.save = function(project){

}

//Project.prototype.getAll = function
