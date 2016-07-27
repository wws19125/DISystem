var setting = require("../setting");
//var DB = require("mongodb").Db;
//var Connection = require("mongodb");//.Connection;
//var Server = require("mongodb").Server;
var DB = {
  open:function(callback){
    callback(false,DB.db);
  },
  db:""
};
module.exports = DB;//new DB(setting.db,new Server(setting.host,setting.port,{}),{safe:true});
