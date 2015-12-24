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
var db = require("./db");
function DataInterface(di)
{
  di = di||{};
  this.name= di.name||"未填写";
  this.format = di.format||"未填写";
  this.intro = di.intro||"未填写";
  this.params = di.params||[];
  this.retContent = di.retContent||"无";
}

module.exports = DataInterface;

DataInterface.prototype.save = function(di){
  console.log("===========save============");
};
