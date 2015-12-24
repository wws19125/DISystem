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
    var data = [
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
      },
      {
        name:"报表",
        format:"itegration/appservice/ReportService/getReportItemsPermission/{userno}?token={token}",
        intro:"获取报表接口，用于获取报表菜单",
        params:[
          {name:"userno",intro:"工号"},
          {name:"token",intro:"令牌"}
        ]
      },
      {
        name:"反馈",
        format:"itegration/appUser/addFeeBack/{userno}/{username}?strContent={content}&token={token}",
        intro:"用于反馈信息",
        params:[
          {name:"userno",intro:"工号"},
          {name:"username",intro:"用户名"},
          {name:"content",intro:"反馈内容"},
          {name:"token",intro:"令牌"}
        ]
      },
      {
        name:"修改密码",
        format:"itegration/appUser/update_user_Password/{userno}/{npassword}/{opassword}?token={token}",
        intro:"用户密码修改接口",
        params:[
          {name:"userno",intro:"工号"},
          {name:"npassowrd",intro:"新用户密码,base64加密"},
          {name:"opassword",intro:"旧的用户密码,base64加密"},
          {name:"token",intro:"令牌"}
        ]
      },
      {
        name:"获取用户信息",
        format:"itegration/appUser/getUserInfo/{userno}?token={token}",
        intro:"获取用户信息，如用户名等",
        params:[
          {name:"userno",intro:"工号"},
          {name:"token",intro:"令牌"}
        ]
      },
      {
        name:"画面菜单",
        format:"itegration/returnChild_MsgById/a8d9d9756b684bf4b3e536e9f60fbc7a/returnChild_menu",
        intro:"获取实时画面菜单",
        params:[
        ]
      },
      {
        name:"获取资源压缩文件",
        format:"static/others/images/resources.zip",
        intro:"获取资源压缩文件，在手机中进行解压",
        params:[
        ],
        retContent:"压缩包，zip格式，需要解压"
      },
      {
        name:"获取资源配置",
        format:"static/others/images/resources.json",
        intro:"获取资源配置，用于升级使用",
        params:[
        ],
        retContent:"配置文件json"
      },
      {
name:"视频",
format:"itegration/returnChild_MsgById/dcda957a6864460abcd62185a5712b25/returnChild_menu",
intro:"获取视频里面需要的所有信息",
params:[

],
retContent:{
    "message": "根据当前节点UUID获取下一层的信息成功",
    "statusCode":"状态码",
    "data": [
    {
        "createDateTime": "创建时间",
        "targetURL": "",
        "Fid":"父截图id",
        "intIsDelete": 0,
        "id": "截图id",
        "strName": "监控区域名称",
        "nodeIcon": "",
        "main_type": "FV",
        "child_id": "子截图id",
        "intIsLeaf": 0,
        "intPriority": "优先级",
        "intIsActive": 1,
        "companyId": "公司id",
        "nodeType": "节点类型",
        "updateDateTime": "更新时间",
        "createUserId": "创建者id"
    }
    ]
}
},
{
name:"视频截图",
format:"static/others/PicCapture/{PictureID}.jpg",
intro:"获取视频截图",
params:[
   {name:"PictureID",intro:"根据返回的nodeType类型判断，如果nodeType返回的值是F,就继续判断返回的child_id是否为空，如果为空，PictureID的值就为返回的id值，child_id不为空，PictureID的值就是child_id;如果nodeType返回的值不是F，PictureID的值为返回的id的值"}
],
retContent:{}
},
{
name:"视频播放",
format:"rtmpt://host:5080/JHFocusView?UserId=testuser/{id}",
intro:"视频播放",
params:[
{ name:"id",intro:"如果获取的child_id为空，id就是返回的id,如果返回的child_id不为空，则此节点下面还有其他视频监控点，不能直接播放"}
]
},{
name:"报表分类",
format:"itegration/appservice/ReportService/getReportItemsPermission/{userNo}?token={token}",
intro:"获取报表的类别和下一节点的信息",
params:[
{name:"userNo",intro:"工号"},
{name:"token",intro:"令牌"}
],
retContent:[
    {
  "id":"id",
        "strClass": "类型",
        "intOrder":"优先级",
        "strContentName": "报表类别",
        "strTitle": "报表标题"
    }
]

}
    ];
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
      $.ajax({
        url:'/home/update',
        type:'post',
        data:{data:JSON.stringify(data)},
        success:function(data){
          console.log("ok");
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
