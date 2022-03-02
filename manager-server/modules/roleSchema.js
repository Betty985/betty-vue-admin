// 加载mongoose
const mongoose = require("mongoose");
// 定义实体表配置 需要new
const roleSchema = new mongoose.Schema({
  roleName: String,
  remark: String,
  permissionList: {
    checkedKeys: [],
    halfcheckedKeys: [],
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  },
  createTime: {
    type: Date,
    default: Date.now(),
  },
});
// 下面的语句会创建集合，第三个参数没有会将第一个参数+"s"作为集合名
module.exports = mongoose.model("role", roleSchema, "roles");
