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

// 用户列表
router.get("/list", async (ctx) => {
  const { userId, userName, state } = ctx.request.query;
  const { page, skipIndex } = util.paper(ctx.request.query);
  let params = {};
  if (userId) params.userId = userId;
  if (userName) params.userName = userName;
  if (state && state !== "0") params.state = state;
  try {
    // 根据条件查询所有用户列表
    // 过滤一些字段
    const query = user.find(params, { _id: 0, userPwd: 0 });
    const list = await query.skip(skipIndex).limit(page.pageSize);
    // 统计总条数
    const total = await user.countDocuments(params);
    ctx.body = util.success({
      page: {
        ...page,
        total,
      },
      list,
    });
  } catch (error) {
    ctx.body = util.fail(`查询异常:${error.stack}`);
  }
});
module.exports = router;
