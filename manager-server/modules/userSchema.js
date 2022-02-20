// 加载mongoose
const mongoose = require("mongoose");
// 定义实体表配置 需要new
const userSchema = new mongoose.Schema({
  userId: Number, //用户ID，自增长
  userName: String, //用户名称
  userPwd: String, //用户密码，md5加密
  userEmail: String, //用户邮箱
  mobile: String, //手机号
  sex: Number, //性别 0:男  1：女
  deptId: [], //部门 字符数组
  job: String, //岗位
  state: {
    type: Number,
    default: 1,
  }, // 1: 在职 2: 离职 3: 试用期
  role: {
    type: Number,
    default: 1,
  }, // 用户角色 0：系统管理员  1： 普通用户
  roleList: [], //系统角色
  createTime: {
    type: Date,
    default: Date.now(),
  }, //创建时间
  lastLoginTime: {
    type: Date,
    default: Date.now(),
  }, //更新时间
  remark: String,
});
// 下面的语句会创建集合，第三个参数没有会将第一个参数+"s"作为集合名
module.exports = mongoose.model("user", userSchema, "user");
