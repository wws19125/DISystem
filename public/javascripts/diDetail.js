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
    window.onload = function(){
      return;
      $.ajax({
        url:'/home/update',
        type:'post',
        data:{data:JSON.stringify(data)},
        success:function(data){
          console.log(JSON.stringify(data));
        },
        error:function(){
          //console.log(data);
        },
        complete:function(){
          //console.log(data);
        }
      });
      var html = "";
      var params = ""
      var retContents = "";
      data.forEach(function(ifParam){
        ifParam.params.forEach(function(param){
          params += template_param.format(param.name,param.intro);
        });
        if(ifParam["retContent"])
          retContents = getReturn(ifParam["retContent"]);
        html += template.format("test",ifParam.name,ifParam.format.formatParam(),ifParam.intro,params,retContents);
        params = retContents = "";
      });
      document.querySelector(".di_detail").innerHTML = html;
      html = "";
      var details = document.querySelectorAll("section");
      for(var i=0;i<details.length;i++)
      {
        var item = details[i];
        var item_title = item.querySelector("a");
        html += "<li><a href='#category{0}'>{1}、{2}</a></li>".format(i,i+1,item_title.innerHTML);
        item_title.setAttribute("name","category{0}".format(i));
      }
      document.querySelector("aside").querySelector("ul").innerHTML = html;
      html = "";
      //data = undefined;
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
        //var category = document.querySelector(".di_container_box").querySelector("aside");
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
            }
            else
            {
              target.style.position = "inherit";
              dt.style.marginLeft = margin;
            }
          };
        }
      }

    };