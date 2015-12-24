function guid() {
  function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
String.prototype.format = function(){
    var args = arguments;
    return this.replace(/\{\d+\}/g,function(_old,index){
      var i = parseInt(_old.substr(1,_old.length-1));
      if(i<args.length)
        return args[i];
      else
        return _old;
    });
};
