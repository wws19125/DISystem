String.prototype.formatParam = function(){
  //return this;
  return this.replace(/\{[A-Za-z0-9_]+\}/g,function(_old,index){
    return "<font color='red'>{0}</font>".format(_old);
  });
};

var template = "<section>\
    <a name='#{0}' class='di_name'>{1}</a>\
    <div>\
      <h4>请求接口</h4>\
      <div>\
        <a>格式:</a>\
        <span>{2}</span>\
      </div>\
      <div>\
        <a>类型:</a>\
        <span>{6}</span>\
      </div>\
      <div>\
        <a>说明:</a>\
        {3}\
      </div>\
      <div>\
        <a>参数:</a>\
        <ul>\
          {4}\
        </ul>\
      </div>\
    </div>\
    <div>\
      <h4>返回值</h4>\
      <div>\
      {5}\
      </div>\
    </div>\
    <div class='di_operation'>\
      <a href='/di/{7}/update' style='color:#666;text-shadow:none;'>编辑</a>\
      <a data-did='{7}'>删除</a>\
    </div>\
  </section>";
var template_param = "<li><a>{0}</a><span>{1}</span></li>";
function getReturn(jsonData){
  var html = "";
  if(typeof jsonData=="object")
          {
            if(jsonData instanceof Array)
            {
              html += "<ul><li>[</li>{0}<li>]</li></ul>".format(getReturn(jsonData[0]));
            }
            else
              {
                html += "<ul><li>{</li>";
                for(var item in jsonData)
                {
                  html += "<li><a>{0}</a>&nbsp;<span>{1}</span>".format(item,getReturn(jsonData[item]));
                }
                html += "<li>}</li></ul>";
              }
          }
      else
      {
        html += "&nbsp;"+jsonData;
      }
      return html;
  };
$(function(){
    //DISystem.displayMenu();
    var backCount = window.history.length;
    window.onhashchange = function(){
      DISystem.goBack = function(){ window.history.go( backCount - window.history.length-1);};
    };
    $.ajax({
      url:'/di/{0}/list-for-project'.format(document.querySelector("article").dataset.id),
      type:'get',
      success:function(data){
        showDetail(data.dataContent);
      },
      error:function(){

      },
      complete:function(){
        //console.log(data);
      }
    });
    function showDetail(data)
    {
    var html = "";
    var params = ""
    var retContents = "";
    data.forEach(function(ifParam){
      ifParam.params.forEach(function(param){
        params += template_param.format(param.name,param.intro);
      });
      if(ifParam["retContent"])
        retContents = getReturn(ifParam["retContent"]);
      html += template.format("test",ifParam.name,ifParam.format.formatParam(),ifParam.intro,params,retContents,ifParam.method||"GET",ifParam._id);
      params = retContents = "";
    });
    document.querySelector(".di_detail").innerHTML = html;
    html = "";
    var details = document.querySelectorAll("section");
    html += "<li><a href='/di/{0}/new'>新建接口</a></li>".format(document.querySelector("article").dataset.id);
    for(var i=0;i<details.length;i++)
    {
      var item = details[i];
      var item_title = item.querySelector("a");
      html += "<li><a href='#category{0}'>{1}、{2}</a></li>".format(i,i+1,item_title.innerHTML);
      item_title.setAttribute("name","category{0}".format(i));
    }
    document.querySelector("aside").querySelector("ul").innerHTML = html;
    html = "";
  }
    //postion
    var style = undefined;
    if(window.getComputedStyle)
      //firefox
      style = window.getComputedStyle(document.querySelector(".di_detail"),null);
    else
      //ie
      style = document.querySelector(".di_detail").currentStyle;
    if(style)
    {
      if(style["z-index"]==100)
      {
        var target = document.querySelector("aside");
        var dt = document.querySelector(".di_detail");
        var offset = target.offsetTop;
        var margin = dt.style.marginLeft;
        window.onscroll = function(){
          if(document.body.scrollTop>=offset){
            target.style.position = "fixed";
            dt.style.marginLeft = parseInt(margin)+215;
            target.style.left=0;
          }
          else
          {
            target.style.position = "inherit";
            dt.style.marginLeft = margin;
          }
        };
      }
    }

    DISystem.setMenuCallback(function(){
      $("aside").css("z-index",99).toggle();
    });
    $("aside").on("click","li",function(){
      if($(".di_toolbar_right_menu").css("display")=="none")
        return;
      $("aside").hide();
    });
});
