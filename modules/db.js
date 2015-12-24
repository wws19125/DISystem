var setting = require("../setting");
var DB = require("mongodb").Db;
var Connection = require("mongodb");//.Connection;
var Server = require("mongodb").Server;
module.exports = new DB(setting.db,new Server(setting.host,setting.port,{}),{safe:true});
