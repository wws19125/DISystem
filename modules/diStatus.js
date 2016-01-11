var status = {
  ok:200, //正常
  noErrorMsg:"success",

  innerError: 300, //内部原因
  innerErrorMsg:"服务出错，请及时联系站点,谢谢！",
  innerErrorOpenDB:301, //打开数据库失败
  innerErrorOpenCollection:302, //open collection error
  innerErrorOperationCollection:303, //operate collection error

  outterError: 400, //外部原因，如参数错误等等
  outterErrorNotLogin:401, //未登录错误
  outterErrorNotLoginMsg:"非法用户，请先登录",
  outterErrorLogin:402,
  outterErrorLoginMsg:"登陆失败",
  outterErrorAreadyExist: 403, //数据重复

  authorityError: 500, //权限不够
  authorityErrorAccess: 501, //访问权限不足,
  authorityErrorAccessMsg: "访问权限不足",
  authorityErrorOperation: 502, //操作权限不足
  authorityErrorOperationMsg: "操作权限不足",

  otherError: 600 //未知原因
};
module.exports = status;
