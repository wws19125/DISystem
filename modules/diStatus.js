var status = {
  ok:200, //正常
  innerError: 300, //内部原因
  outterError: 400, //外部原因，如参数错误等等
  otherError: 500 //未知原因
};
module.exports = status;
