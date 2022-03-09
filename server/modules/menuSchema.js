const mongoose = require("mongoose");
const menuShema = mongoose.Schema({
  //菜单类型
  menuType: Number,
  //   菜单名称
  menuName: String,
  //   权限标识
  menuCode: String,
  //   路由地址
  path: String,
  //   图标
  icon: String,
  // 组件地址
  component: String,
  //菜单状态
  menuState: Number,
  parentId: [mongoose.Types.ObjectId],
  createTime: {
    type: Date,
    default: Date.now(),
  }, //创建时间
  updateTime: {
    type: Date,
    default: Date.now(),
  }, //更新时间
});
// 第一个参数是schema模型的名称
// 第三个参数是数据库映射可以不写，会变成第一个参数+"s"
module.exports = mongoose.model("menu", menuShema, "menus");
