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

function DISystem(){

};
DISystem.hiddenMenu = function(flag)
{
  $(".di_toolbar_right_menu").css("display","none");
};
DISystem.setMenuCallback = function(callback){
  DISystem.menuCallback["di_toolbar_right_menu"] = callback;
};
DISystem.menuCallback = {};
DISystem.addRightMenu = function(identity,text,style,callback)
{
  var a = $("<a href='#'>{0}</a>".format(text));
  a.addClass("di_toolbar_right");
  a.addClass(identity);
  a.css(style);
  $(".di_toolbar_navbar").append(a);
  DISystem.menuCallback[identity] = callback;
  return a;
}
DISystem.goBack = function(){
  if(window.sessionStorage.getItem("root"))
  {
    window.history.go(-1);
  }
  else {
    window.location.replace("/");
  }
};
DISystem.showTooltip = function(text){
  var target = document.querySelector(".di_tooltip");
  $(target).html(text).show();
  window.setTimeout(function(){
    $(target).hide();
  },2000);
};
$(function(){
  $(".di_toolbar_navbar").on("click",".di_toolbar_right",function(){
    for(var identity in DISystem.menuCallback)
    {
      if(this.classList.contains(identity))
      {
        DISystem.menuCallback[identity]();
      }
    }
  });
});
