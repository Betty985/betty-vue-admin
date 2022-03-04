/**
 * 用户管理模块
 */
// 导入 ueserSchema
const user = require("./../modules/userSchema");
const Menu = require("./../modules/menuSchema");
const Role = require("./../modules/roleSchema");
const router = require("koa-router")();
const util = require("./../utils/util");
const jwt = require("jsonwebtoken");
// 计数器维护用户ID自增长
const couter = require("./../modules/couterSchema");
const md5 = require("md5");
//初始化
const initData = require("./../utils/init");
// initData(user, {
//   userName: "admin",
//   userPwd: "admin",
//   userEmail: "10001@qq.com",
// });

router.prefix("/users");

router.post("/login", async (ctx, next) => {
  // 数据库查询出错可以被catch捕获错误
  try {
    // koa-bodyparser通过ctx.request.body获取post请求体，请求的参数在请求体里
    let { userName, userPwd } = ctx.request.body;
    /**
     * 指定数据库返回字段的三种方式：
     * 1."userName userPwd"
     * 2.{userName：1，userPwd：0} 1代表返回，0代表不返回
     * 3.select("userName")
     * 4.默认返回全部数据
     */
    //  第二个参数可以指定返回哪些字段  参数之间以空格隔开
    let res = await user.findOne(
      {
        userName,
        userPwd,
      },
      "userName userEmail"
    );
    // res返回的是一个数组
    if (res) {
      // 或者解构赋值
      const data = res._doc; //返回用户信息
      // 生成签名
      const token = jwt.sign(
        {
          data,
        },
        "miyao",
        { expiresIn: "10h" }
      );
      data.token = token;
      ctx.body = util.success(data);
    } else {
      ctx.body = util.fail("用户名或密码错误");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});
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
// 用户删除/批量删除
router.post("/delete", async (ctx) => {
  // 待删除的用户Id数组
  const { userIds } = ctx.request.body;
  // 每个model对象都会返回query对象，可以用query的or或in实现数组批量更新
  // user.updateMany({ $or: [{ userId: 10001 }, { userId: 10002 }] })
  const res = await user.updateMany({ userId: { $in: userIds } }, { state: 2 });
  if (res.nModified) {
    ctx.body = util.success(res, `共删除成功${res.nModified}条数据`);
    return;
  }
  ctx.body = util.fail("删除失败");
});
// 用户新增/编辑
router.post("/operate", async (ctx) => {
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action,
  } = ctx.request.body;
  if (action == "add") {
    if (!userName || !userEmail || !deptId) {
      ctx.body = util.fail("参数错误", util.CODE.PRAMA_ERROR);
      return;
    }
    // 通过$inc +1
    const doc = await couter.findOneAndUpdate(
      { _id: "userId" },
      { $inc: { sequence_value: 1 } },
      { new: true }
    );
    // 用户名和邮箱不能和别人重名
    // 返回_id userName userEmail三个字段
    const res = await user.findOne(
      { $or: [{ userName }, { userEmail }] },
      "_id userName userEmail"
    );
    if (res) {
      ctx.body = util.fail(
        `系统检测到重复用户，信息如下：${res.userName}-${res.userEmail}`
      );
    } else {
      try {
        // new user或create方式创建
        const userObj = new user({
          userId: doc.sequence_value,
          userName,
          // md5加密
          userPwd: md5("123456"),
          userEmail,
          role: 1, //普通用户
          roleList,
          job,
          state,
          deptId,
          mobile,
        });
        // 保存用户创建
        userObj.save();
        ctx.body = util.success({}, "用户创建成功");
      } catch (error) {
        ctx.body = util.fail(error.stack, "用户创建失败");
      }
    }
  } else {
    if (!deptId) {
      ctx.body = util.fail("部门不能为空", util.CODE.PRAMA_ERROR);
      return;
    }
    // 默认返回旧文档，可以通过第三个参数设置返回新文档
    const res = await user.findOneAndUpdate(
      { userId },
      { mobile, job, state, roleList, deptId }
    );
    // res没有nModified属性
    try {
      ctx.body = util.success({}, `更新成功`);
      return;
    } catch (error) {
      ctx.body = util.fail(error.stack, "更新失败");
    }
  }
});
// 全部用户列表
router.get("/all/list", async (ctx) => {
  try {
    const list = await user.find({}, "userId userName userEmail");
    ctx.body = util.success(list);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});
// 动态获取用户权限菜单
router.get("/getPermissionList", async (ctx) => {
  // authorization不区分大小写
  let authorization = ctx.request.headers.authorization;
  let { data } = util.decoded(authorization);
  let menulist = await getMenuList(data.role, data.roleList);
  ctx.body = util.success(menulist);
});
async function getMenuList(userRole, roleKeys) {
  let rootList = [];
  // 管理员
  if (userRole == 0) {
    rootList = (await Menu.find({})) || [];
  } else {
    // 根据用户拥有的角色，获取权限列表
    // 先查找用户对应的角色有哪些
    let roleList = await Role.find({ _id: { $in: roleKeys } });
    // 过滤掉重复的权限
    let permissionList = [];
    roleList.map((role) => {
      let { checkedKeys, halfCheckedKeys } = role.permissionlist;
      permissionList = permissionList.concat([
        ...checkedKeys,
        ...halfCheckedKeys,
      ]);
    });
    // 对permission去重
    permissionList = [...new Set(permissionList)];
    rootList = await Menu.find({ _id: { $in: permissionList } });
  }
  return util.getTreeMenu(rootList, null, []);
}
module.exports = router;
