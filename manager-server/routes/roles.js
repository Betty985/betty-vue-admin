/**
 * 用户管理模块
 */
// 导入 ueserSchema
const Role = require("./../modules/roleSchema");
const router = require("koa-router")();
const util = require("./../utils/util");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
//初始化
const initData = require("./../utils/init");
// initData(user, {
//   userName: "admin",
//   userPwd: "admin",
//   userEmail: "10001@qq.com",
// });

router.prefix("/roles");

//查询所有的角色列表
router.get("/allList", async (ctx) => {
  try {
    const list = Role.find({}, "_id roleName");
    ctx.body = util.success(list);
  } catch (error) {
    ctx.body = util.fail(`查询失败：${error.stack}`);
  }
});
// 按页获取角色列表
router.get("/list", async (ctx) => {
  const { roleName } = ctx.request.query;
  const { page, skipIndex } = util.paper(ctx.request.query);
  try {
    let params = {};
    // 进行过滤
    if (roleName) params.roleName = roleName;
    const query = Role.find(params); //find返回的是query对象
    // 分页      开始             每页条数
    const list = await query.skip(skipIndex).limit(page.pageSize);
    // 按名称获取总条数
    const total = await Role.countDocuments(params);
    ctx.body = util.success({
      list,
      page: {
        ...page,
        total,
      },
    });
  } catch (error) {
    ctx.body = util.fail(`查询失败：${error.stack}`);
  }
});
// 角色操作：创建，编辑和删除
// ctx 获取上下文的句柄
router.post("/operate", async (ctx) => {
  const { _id, roleName, remark, action } = ctx.request.body;
  let res, info;
  try {
    if (action == "create") {
      res = await Role.create({ roleName, remark });
      info = "创建成功";
    } else if (action == "edit") {
      // edit与create的区别是edit需要参数
      if (_id) {
        let params = { roleName, remark };
        params.updateTime = new Date();
        // 查询当前角色   findById唯一索引，速度更快
        res = await Role.findByIdAndUpdate(_id, params);
        info = "编辑成功";
      } else {
        ctx.body = util.fail(`缺少参数params:_id`);
        return;
      }
    } else {
      if (_id) {
        res = await Role.findByIdAndRemove(_id);
        info = "删除成功";
      } else {
        ctx.body = util.fail(`缺少参数params:_id`);
        return;
      }
    }
    ctx.body = util.success(res, info);
  } catch (error) {
    ctx.body = util.fail(`操作失败：${error.stack}`);
  }
});
// 权限设置
router.post("/update/permission", async (ctx) => {
  const { _id, permissionList } = ctx.request.body;
  try {
    let pramas = { permissionList, updateTime: new Date() };
    let res = await Role.findByIdAndUpdate(_id, pramas);
    ctx.body = util.success("", "权限设置成功");
  } catch (error) {
    ctx.body = util.fail(`权限设置失败`);
  }
});
module.exports = router;
