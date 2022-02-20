/**
 * 用户管理模块
 */
// 导入 ueserSchema
const user = require("./../modules/userSchema");
const router = require("koa-router")();
const util = require("./../utils/util");
const jwt = require("jsonwebtoken");
//初始化
const initData = require("./../utils/init");
initData(user, { userName: "admin", userPwd: "admin" });

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
      "userName"
    );
    const data = res._doc; //返回用户信息
    const token = jwt.sign(
      {
        data,
      },
      "miyao",
      { expiresIn: "1h" }
    );
    // res返回的是一个数组
    if (res) {
      // 或者解构赋值

      data.token = token;
      ctx.body = util.success(data);
    } else {
      ctx.body = util.fail("用户名或密码错误");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});

router.get("/bar", function (ctx, next) {
  ctx.body = "this is a users/bar response";
});

module.exports = router;
