var authority = {
  authorityAccessManager:0x4,  //是有管理权限
  authorityCreateProject:0x2, //创建项目权限


  authoritySuperAdminManager:0xff,
  authoritySuperAdminProject:0xff,

  authorityAccessProject:0x80, //查看项目
  authorityAuthProject:0x40, //授权项目
  authorityEditProject:0x20, //编辑项目
  authorityDeleteProject:0x10, //删除项目

  authorityCreateInterface:0x08, //创建接口
  authorityEditInterface:0x04, // 编辑接口
  authorityDeleteInterface:0x02, //删除接口
  authorityDownPdf:0x01 //下载接口
};

module.exports = authority;
